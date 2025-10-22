"""
Клиент для подключения к провайдеру модели с механизмом повторных попыток
и обработкой ошибок подключения.
"""

import asyncio
import logging
import time
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum
import aiohttp
import backoff
from contextlib import asynccontextmanager


class ConnectionStatus(Enum):
    """Статусы подключения к провайдеру модели"""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    RETRYING = "retrying"
    FAILED = "failed"


@dataclass
class ModelProviderConfig:
    """Конфигурация провайдера модели"""
    primary_endpoint: str
    fallback_endpoints: List[str]
    api_key: str
    timeout: float = 30.0
    max_retries: int = 5
    retry_delay: float = 1.0
    max_retry_delay: float = 60.0
    backoff_factor: float = 2.0


class ModelProviderError(Exception):
    """Базовая ошибка провайдера модели"""
    pass


class ConnectionError(ModelProviderError):
    """Ошибка подключения к провайдеру"""
    pass


class AuthenticationError(ModelProviderError):
    """Ошибка аутентификации"""
    pass


class RateLimitError(ModelProviderError):
    """Ошибка превышения лимита запросов"""
    pass


class ModelProviderClient:
    """
    Клиент для подключения к провайдеру модели с автоматическими
    повторными попытками и обработкой ошибок.
    """
    
    def __init__(self, config: ModelProviderConfig):
        self.config = config
        self.status = ConnectionStatus.DISCONNECTED
        self.current_endpoint = config.primary_endpoint
        self.session: Optional[aiohttp.ClientSession] = None
        self.logger = logging.getLogger(__name__)
        
        # Настройка логирования
        self._setup_logging()
    
    def _setup_logging(self):
        """Настройка логирования для диагностики"""
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)
    
    @asynccontextmanager
    async def get_session(self):
        """Контекстный менеджер для HTTP сессии"""
        if self.session is None or self.session.closed:
            timeout = aiohttp.ClientTimeout(total=self.config.timeout)
            self.session = aiohttp.ClientSession(
                timeout=timeout,
                headers={
                    'Authorization': f'Bearer {self.config.api_key}',
                    'Content-Type': 'application/json',
                    'User-Agent': 'ModelProviderClient/1.0'
                }
            )
        
        try:
            yield self.session
        finally:
            pass  # Не закрываем сессию здесь, закроем в close()
    
    @backoff.on_exception(
        backoff.expo,
        (aiohttp.ClientError, asyncio.TimeoutError, ConnectionError),
        max_tries=5,
        max_time=300,
        factor=2,
        jitter=backoff.random_jitter
    )
    async def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """
        Выполнение HTTP запроса с автоматическими повторными попытками
        """
        self.status = ConnectionStatus.RETRYING
        
        async with self.get_session() as session:
            url = f"{self.current_endpoint}{endpoint}"
            
            try:
                self.logger.info(f"Выполняем {method} запрос к {url}")
                
                async with session.request(method, url, **kwargs) as response:
                    # Проверяем статус ответа
                    if response.status == 401:
                        raise AuthenticationError("Неверный API ключ")
                    elif response.status == 429:
                        raise RateLimitError("Превышен лимит запросов")
                    elif response.status >= 500:
                        raise ConnectionError(f"Ошибка сервера: {response.status}")
                    elif response.status >= 400:
                        error_text = await response.text()
                        raise ModelProviderError(f"Ошибка клиента: {response.status} - {error_text}")
                    
                    response.raise_for_status()
                    result = await response.json()
                    
                    self.status = ConnectionStatus.CONNECTED
                    self.logger.info(f"Успешное подключение к {url}")
                    
                    return result
                    
            except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                self.logger.error(f"Ошибка подключения к {url}: {e}")
                await self._try_fallback_endpoint()
                raise ConnectionError(f"Не удалось подключиться к {url}: {e}")
    
    async def _try_fallback_endpoint(self):
        """Переключение на резервный endpoint"""
        if self.current_endpoint == self.config.primary_endpoint and self.config.fallback_endpoints:
            old_endpoint = self.current_endpoint
            self.current_endpoint = self.config.fallback_endpoints[0]
            self.logger.info(f"Переключаемся с {old_endpoint} на резервный endpoint {self.current_endpoint}")
        elif self.current_endpoint in self.config.fallback_endpoints:
            # Переключаемся на следующий резервный endpoint или обратно на основной
            current_index = self.config.fallback_endpoints.index(self.current_endpoint)
            if current_index + 1 < len(self.config.fallback_endpoints):
                self.current_endpoint = self.config.fallback_endpoints[current_index + 1]
            else:
                self.current_endpoint = self.config.primary_endpoint
            
            self.logger.info(f"Переключаемся на endpoint {self.current_endpoint}")
    
    async def test_connection(self) -> bool:
        """
        Тестирование подключения к провайдеру модели
        """
        try:
            # Простой health check запрос
            await self._make_request('GET', '/health')
            return True
        except Exception as e:
            self.logger.error(f"Тест подключения не прошел: {e}")
            self.status = ConnectionStatus.FAILED
            return False
    
    async def send_prompt(self, prompt: str, model: str = "gpt-3.5-turbo") -> Dict[str, Any]:
        """
        Отправка промпта модели
        """
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            return await self._make_request('POST', '/v1/chat/completions', json=payload)
        except Exception as e:
            self.logger.error(f"Ошибка при отправке промпта: {e}")
            raise
    
    async def get_models(self) -> List[Dict[str, Any]]:
        """
        Получение списка доступных моделей
        """
        try:
            response = await self._make_request('GET', '/v1/models')
            return response.get('data', [])
        except Exception as e:
            self.logger.error(f"Ошибка при получении списка моделей: {e}")
            raise
    
    async def close(self):
        """Закрытие соединения"""
        if self.session and not self.session.closed:
            await self.session.close()
        self.status = ConnectionStatus.DISCONNECTED
        self.logger.info("Соединение закрыто")
    
    def get_status(self) -> Dict[str, Any]:
        """Получение текущего статуса подключения"""
        return {
            "status": self.status.value,
            "current_endpoint": self.current_endpoint,
            "primary_endpoint": self.config.primary_endpoint,
            "fallback_endpoints": self.config.fallback_endpoints
        }


# Пример использования
async def main():
    """Пример использования клиента"""
    
    # Конфигурация (в реальном приложении загружайте из переменных окружения)
    config = ModelProviderConfig(
        primary_endpoint="https://api.openai.com",
        fallback_endpoints=[
            "https://api.anthropic.com",
            "https://api.cohere.ai"
        ],
        api_key="your-api-key-here",
        timeout=30.0,
        max_retries=5
    )
    
    client = ModelProviderClient(config)
    
    try:
        # Тестируем подключение
        if await client.test_connection():
            print("✅ Подключение успешно установлено")
            
            # Получаем список моделей
            models = await client.get_models()
            print(f"📋 Доступно моделей: {len(models)}")
            
            # Отправляем тестовый промпт
            response = await client.send_prompt("Привет! Как дела?")
            print(f"🤖 Ответ модели: {response}")
            
        else:
            print("❌ Не удалось установить подключение")
            
        # Показываем статус
        status = client.get_status()
        print(f"📊 Статус: {status}")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
    
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())