from __future__ import annotations

import asyncio
import os
import tempfile
from typing import Optional, Dict, Any

import aiohttp
from ..lib.observability.metrics import Timer, incr, observe  # type: ignore


class ASRService:
	"""ASR‑сервис без заглушек: нормализует аудио в WAV/16k и вызывает реальный провайдер.

	Поддержка провайдеров через ENV:
	- ASR_PROVIDER=yandex_speechkit → Yandex Cloud SpeechKit (REST) — YANDEX_SPEECHKIT_API_KEY
	- ASR_PROVIDER=whisper_openai → OpenAI Whisper API — OPENAI_API_KEY
	- ASR_PROVIDER=vosk → оффлайн движок Vosk — VOSK_MODEL_DIR (путь к модели)
	"""

	def __init__(self) -> None:
		self.provider = os.getenv("ASR_PROVIDER", "yandex_speechkit").strip().lower()
		self.model = os.getenv("ASR_MODEL", "base")
		self.ffmpeg_bin = os.getenv("FFMPEG_BIN", "ffmpeg")
		self.yandex_api_key = os.getenv("YANDEX_SPEECHKIT_API_KEY", "").strip()
		self.yandex_lang_default = os.getenv("YANDEX_SPEECHKIT_LANG_DEFAULT", "ru-RU").strip() or "ru-RU"
		self.openai_api_key = os.getenv("OPENAI_API_KEY", "").strip()
		# Vosk
		self.vosk_model_dir = os.getenv("VOSK_MODEL_DIR", "/opt/vosk/models").strip()

	async def _run_ffmpeg(self, src_path: str, dst_path: str) -> None:
		"""Конвертирует входной файл в WAV 16 kHz mono (PCM S16LE)."""
		cmd = [
			self.ffmpeg_bin,
			"-y",
			"-i", src_path,
			"-ac", "1",
			"-ar", "16000",
			"-f", "wav",
			dst_path,
		]
		proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL)
		code = await proc.wait()
		if code != 0:
			raise RuntimeError("ffmpeg conversion failed")

	async def _call_yandex_stt(self, wav_bytes: bytes, lang: str) -> Dict[str, Any]:
		if not self.yandex_api_key:
			raise RuntimeError("YANDEX_SPEECHKIT_API_KEY is not set")
		url = f"https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?topic=general&lang={lang or self.yandex_lang_default}"
		headers = {"Authorization": f"Api-Key {self.yandex_api_key}"}
		timeout = aiohttp.ClientTimeout(total=30)
		async with aiohttp.ClientSession(timeout=timeout) as session:
			async with session.post(url, data=wav_bytes, headers=headers) as resp:
				# Сначала корректно обрабатываем ошибки
				if resp.status != 200:
					_body = await resp.text()
					raise RuntimeError(f"Yandex STT HTTP {resp.status}: {_body[:200]}")
				# Пытаемся распарсить JSON независимо от заголовка Content-Type
				try:
					data = await resp.json(content_type=None)
				except Exception:
					# Фолбэк: читаем как текст и пытаемся распарсить вручную, затем берём поле result
					_body = await resp.text()
					try:
						import json as _json
						obj = _json.loads(_body)
						data = obj if isinstance(obj, dict) else {"result": str(obj)}
					except Exception:
						data = {"result": _body}
				return {
					"text": (str(data.get("result")) if isinstance(data, dict) else "").strip(),
					"language": lang or self.yandex_lang_default,
					"provider": "yandex_speechkit",
					"model": "stt:general",
				}

	async def _call_openai_whisper(self, wav_path: str, lang: Optional[str]) -> Dict[str, Any]:
		if not self.openai_api_key:
			raise RuntimeError("OPENAI_API_KEY is not set")
		url = "https://api.openai.com/v1/audio/transcriptions"
		headers = {"Authorization": f"Bearer {self.openai_api_key}"}
		form = aiohttp.FormData()
		form.add_field("model", "whisper-1")
		if lang:
			form.add_field("language", lang)
		form.add_field("file", open(wav_path, "rb"), filename="audio.wav", content_type="audio/wav")
		timeout = aiohttp.ClientTimeout(total=60)
		async with aiohttp.ClientSession(timeout=timeout) as session:
			async with session.post(url, data=form, headers=headers) as resp:
				data = await resp.json()
				if resp.status != 200:
					raise RuntimeError(f"OpenAI Whisper HTTP {resp.status}: {str(data)[:200]}")
				return {
					"text": (data.get("text") or "").strip(),
					"language": lang or "auto",
					"provider": "whisper_openai",
					"model": "whisper-1",
				}

	async def _call_vosk(self, wav_path: str, lang: Optional[str]) -> Dict[str, Any]:
		"""Оффлайн распознавание через vosk (локально). Требуется установленный пакет vosk.
		Модель выбирается из каталога VOSK_MODEL_DIR по имени в ASR_MODEL (например, vosk-model-ru-0.22).
		"""
		try:
			from vosk import Model, KaldiRecognizer  # type: ignore
		except Exception as e:
			raise RuntimeError(f"vosk not available: {e}")
		model_path = os.path.join(self.vosk_model_dir, self.model)
		if not os.path.isdir(model_path):
			raise RuntimeError(f"Vosk model not found: {model_path}")
		model = Model(model_path)
		rec = KaldiRecognizer(model, 16000)
		import wave
		with wave.open(wav_path, "rb") as wf:
			if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
				raise RuntimeError("wav must be mono PCM16 16kHz")
			text_parts = []
			while True:
				data = wf.readframes(4000)
				if len(data) == 0:
					break
				if rec.AcceptWaveform(data):
					res = rec.Result()
					try:
						import json as _json
						obj = _json.loads(res)
						if obj.get("text"):
							text_parts.append(str(obj["text"]))
					except Exception:
						pass
			final = rec.FinalResult()
			try:
				import json as _json
				objf = _json.loads(final)
				if objf.get("text"):
					text_parts.append(str(objf["text"]))
			except Exception:
				pass
		text = " ".join([p for p in text_parts if p]).strip()
		return {
			"text": text,
			"language": lang or "ru-RU",
			"provider": "vosk",
			"model": os.path.basename(model_path),
		}

    async def transcribe(self, *, file_bytes: bytes, filename: str, language_hint: Optional[str] = None) -> Dict[str, Any]:
        lang = language_hint or self.yandex_lang_default
        with Timer("svc.asr.transcribe", {"provider": self.provider, "lang": str(lang)}):
            observe("svc.asr.audio_bytes_in", float(len(file_bytes or b"")), {"provider": self.provider})
            with tempfile.TemporaryDirectory() as td:
                src_path = os.path.join(td, filename or "audio")
                with open(src_path, "wb") as f:
                    f.write(file_bytes)
                wav_path = os.path.join(td, "norm.wav")
                await self._run_ffmpeg(src_path, wav_path)
                with open(wav_path, "rb") as wf:
                    wav_bytes = wf.read()
                try:
                    if self.provider == "yandex_speechkit":
                        res = await self._call_yandex_stt(wav_bytes, lang)
                    elif self.provider == "whisper_openai":
                        res = await self._call_openai_whisper(wav_path, language_hint)
                    elif self.provider == "vosk":
                        res = await self._call_vosk(wav_path, language_hint)
                    else:
                        raise RuntimeError(f"Unsupported ASR provider: {self.provider}")
                    observe("svc.asr.text_len_out", float(len(res.get("text") or "")), {"provider": self.provider})
                    return res
                except Exception as e:
                    incr("svc.asr.error", {"provider": self.provider, "kind": "transcribe"})
                    raise
