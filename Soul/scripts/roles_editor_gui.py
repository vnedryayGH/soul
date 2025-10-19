from __future__ import annotations

import os
import tkinter as tk
from tkinter import ttk, messagebox
from tkinter import filedialog as _fd
from typing import List, Dict, Any, Optional, Tuple

try:
	import requests as _rq  # type: ignore
	_HAS_REQUESTS = True
except Exception:  # pragma: no cover
	_HAS_REQUESTS = False
	import urllib.request as _urlreq  # type: ignore
	import urllib.error as _urlerr  # type: ignore
	import json as _json2


def _http_request(method: str, url: str, *, headers: Optional[Dict[str, str]] = None, json: Optional[Dict[str, Any]] = None, timeout: int = 20):
	if _HAS_REQUESTS:
		try:
			r = _rq.request(method.upper(), url, headers=headers, json=json, timeout=timeout)
			return r  # has .ok/.status_code/.headers/.text/.json()
		except Exception as e:  # pragma: no cover
			class _Resp:  # minimal shim
				ok = False
				status_code = 0
				headers: Dict[str, str] = {}
				text = str(e)
				def json(self):
					return {"error": str(e)}
			return _Resp()
	# urllib fallback
	data_bytes = None
	req_headers = headers.copy() if isinstance(headers, dict) else {}
	if json is not None:
		data_bytes = _json2.dumps(json).encode("utf-8")
		req_headers.setdefault("Content-Type", "application/json")
	req = _urlreq.Request(url, data=data_bytes, method=method.upper())
	for k, v in req_headers.items():
		try:
			req.add_header(k, str(v))
		except Exception:
			continue
	try:
		with _urlreq.urlopen(req, timeout=timeout) as resp:
			status = resp.getcode()
			text = resp.read().decode("utf-8", errors="replace")
			hdrs = dict(resp.headers.items())  # type: ignore
	except Exception as e:  # pragma: no cover
		class _Resp:
			ok = False
			status_code = 0
			headers: Dict[str, str] = {}
			text = str(e)
			def json(self):
				try:
					return _json2.loads(self.text)
				except Exception:
					return {"error": str(e)}
		return _Resp()
	class _Resp:
		ok = (200 <= status < 300)
		status_code = status  # type: ignore
		headers = hdrs  # type: ignore
		text = text  # type: ignore
		def json(self):
			try:
				return _json2.loads(text)
			except Exception:
				return {"text": text}
	return _Resp()


ROLE_KEYS_FIXED = [
	"architect", "admin",
	"ext_frontend_dev", "ext_integration_dev", "ext_channel_dev", "ext_soulpulse_dev",
	"vip", "premium", "basic",
]


def _api_base() -> str:
	base = os.getenv("API_BASE", "https://mini.soulpulse.art/api").strip()
	if not (base.startswith("http://") or base.startswith("https://")):
		return "https://mini.soulpulse.art/api"
	if base.endswith("/"):
		base = base[:-1]
	return base


def _headers() -> Dict[str, str]:
	tg = os.getenv("TG_ID", "468326902").strip()
	return {"X-Telegram-User-ID": tg}


def _list_users() -> List[Dict[str, Any]]:
	url = f"{_api_base()}/user-management/users?limit=200"
	r = _http_request("GET", url, headers=_headers(), json=None, timeout=20)
	if not r.ok:
		raise RuntimeError(getattr(r, "text", "HTTP error"))
	js = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
	return list(js.get("users") or [])


def _get_roles_by_user_id(user_id: int) -> List[str]:
	url = f"{_api_base()}/user-management/user/{user_id}/roles"
	r = _http_request("GET", url, headers=_headers(), json=None, timeout=20)
	if not r.ok:
		raise RuntimeError(getattr(r, "text", "HTTP error"))
	js = r.json()
	roles = js.get("roles") or []
	return [str(x.get("name")) for x in roles if isinstance(x, dict)]


def _get_available_roles() -> List[str]:
	url = f"{_api_base()}/user-management/available-roles"
	r = _http_request("GET", url, headers=_headers(), json=None, timeout=20)
	roles: List[str] = []
	if not r.ok:
		return list(dict.fromkeys(ROLE_KEYS_FIXED))
	js = r.json()
	items = js.get("available_roles") or []
	roles = [str(x.get("name")) for x in items if isinstance(x, dict)]
	# Объединяем с фиксированным набором, чтобы гарантировать наличие ext_* ролей
	roles = list(dict.fromkeys(ROLE_KEYS_FIXED + roles))
	return roles


def _assign_role(user_id: int, role: str) -> bool:
	url = f"{_api_base()}/user-management/assign-role"
	body = {"target_user_id": int(user_id), "role_name": role}
	r = _http_request("POST", url, headers=_headers(), json=body, timeout=20)
	return bool(r and r.ok)


def _remove_role(user_id: int, role: str) -> bool:
	url = f"{_api_base()}/user-management/remove-role"
	body = {"target_user_id": int(user_id), "role_name": role}
	r = _http_request("POST", url, headers=_headers(), json=body, timeout=20)
	return bool(r and r.ok)


def _resolve_user_id_by_tg(tg_id: int) -> Tuple[Optional[int], Optional[str]]:
	try:
		# Сначала идемпотентный ensure (создаст при отсутствии)
		url2 = f"{_api_base()}/user-management/ensure-by-tg?tg_id={int(tg_id)}"
		r = _http_request("POST", url2, headers=_headers(), json=None, timeout=20)
		if not r.ok:
			# fallback: resolve
			url = f"{_api_base()}/user-management/resolve?tg_id={int(tg_id)}"
			r = _http_request("GET", url, headers=_headers(), json=None, timeout=20)
			if not r.ok:
				try:
					err = r.text
				except Exception:
					err = "HTTP error"
				return None, err
		js = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
		uid = js.get("user_id")
		return (int(uid) if uid is not None else None), None
	except Exception as e:
		return None, str(e)


class RolesGUI(tk.Tk):
	def __init__(self) -> None:
		super().__init__()
		self.title("Roles Editor (P63)")
		self.geometry("920x640")

		self.users: List[Dict[str, Any]] = []
		self.selected_tg: tk.StringVar = tk.StringVar()
		roles_avail = _get_available_roles()
		self.role_choice: tk.StringVar = tk.StringVar(value=(roles_avail[0] if roles_avail else "basic"))
		self.roles_list: tk.StringVar = tk.StringVar(value="<none>")
		# Settings (TG_ID/API_BASE)
		self.set_tg_id: tk.StringVar = tk.StringVar(value=os.getenv("TG_ID", "468326902"))
		self.set_api_base: tk.StringVar = tk.StringVar(value=os.getenv("API_BASE", _api_base()))
		# Invite extra: Name
		self.inv_name = tk.StringVar(value="")

		# Notebook tabs
		nb = ttk.Notebook(self)
		nb.pack(fill=tk.BOTH, expand=True)

		# --- Tab: Roles ---
		frm = ttk.Frame(nb)
		nb.add(frm, text="Roles")

		# Users list
		self.users_box = tk.Listbox(frm, height=14)
		self.users_box.grid(row=0, column=0, rowspan=6, sticky="nsew")
		self.users_box.bind("<<ListboxSelect>>", self.on_select_user)
		sb = ttk.Scrollbar(frm, orient=tk.VERTICAL, command=self.users_box.yview)
		sb.grid(row=0, column=1, rowspan=6, sticky="ns")
		self.users_box.config(yscrollcommand=sb.set)

		# Controls
		lbl_tg = ttk.Label(frm, text="User/TG ID:")
		lbl_tg.grid(row=0, column=2, sticky="w", padx=10)
		self.ent_tg = ttk.Entry(frm, textvariable=self.selected_tg, width=18)
		self.ent_tg.grid(row=0, column=3, sticky="w")
		self.btn_copy_id = ttk.Button(frm, text="Copy ID", command=self.copy_user_id)
		self.btn_copy_id.grid(row=0, column=3, sticky="e", padx=(0,10))

		lbl_roles = ttk.Label(frm, text="Current roles:")
		lbl_roles.grid(row=1, column=2, sticky="w", padx=10)
		self.lbl_roles_val = ttk.Label(frm, textvariable=self.roles_list)
		self.lbl_roles_val.grid(row=1, column=3, sticky="w")

		self.cb_role = ttk.Combobox(frm, values=_get_available_roles(), textvariable=self.role_choice, state="readonly", width=32)
		self.cb_role.grid(row=2, column=2, columnspan=2, sticky="w", padx=10)
		self._install_context_menu(self.ent_tg)
		self._install_context_menu(self.cb_role)

		# Settings panel
		settings = ttk.LabelFrame(frm, text="Settings")
		settings.grid(row=6, column=0, columnspan=2, sticky="ew", padx=10, pady=(8,0))
		ttk.Label(settings, text="TG_ID:").grid(row=0, column=0, sticky="w")
		ent_tg = ttk.Entry(settings, textvariable=self.set_tg_id, width=18)
		ent_tg.grid(row=0, column=1, sticky="w")
		self._install_context_menu(ent_tg)
		ttk.Label(settings, text="API_BASE:").grid(row=0, column=2, sticky="w", padx=(12,0))
		ent_api = ttk.Entry(settings, textvariable=self.set_api_base, width=44)
		ent_api.grid(row=0, column=3, sticky="ew")
		self._install_context_menu(ent_api)
		btn_apply = ttk.Button(settings, text="Apply", command=self.apply_settings)
		btn_apply.grid(row=0, column=4, sticky="e", padx=(8,0))
		settings.columnconfigure(3, weight=1)

		btn_assign = ttk.Button(frm, text="Assign", command=self.assign_role)
		btn_assign.grid(row=3, column=2, sticky="ew", padx=10, pady=5)
		btn_remove = ttk.Button(frm, text="Remove", command=self.remove_role)
		btn_remove.grid(row=3, column=3, sticky="ew", pady=5)

		# Diagnostics & Logs panel
		diag = ttk.LabelFrame(frm, text="Diagnostics")
		diag.grid(row=7, column=0, columnspan=4, sticky="nsew", padx=10, pady=(10,0))
		self.btn_test = ttk.Button(diag, text="Test endpoints", command=self.test_endpoints)
		self.btn_test.grid(row=0, column=0, sticky="w")
		self.btn_open_health = ttk.Button(diag, text="Open health", command=self.open_dev_access_health)
		self.btn_open_health.grid(row=0, column=1, sticky="w", padx=(8,0))
		self.btn_save_bootstrap = ttk.Button(diag, text="Save bootstrap.ps1", command=self.save_bootstrap_script)
		self.btn_save_bootstrap.grid(row=0, column=2, sticky="w", padx=(8,0))
		self.log_text = tk.Text(diag, height=8)
		self.log_text.grid(row=1, column=0, columnspan=4, sticky="nsew", pady=(6,0))
		self._install_context_menu(self.log_text)
		diag.columnconfigure(3, weight=1)
		diag.rowconfigure(1, weight=1)

		# Invite generator (Name + project/docs/indexes/code)
		inv = ttk.LabelFrame(frm, text="Invite generator")
		inv.grid(row=8, column=0, columnspan=4, sticky="nsew", padx=10, pady=(10,0))
		self.inv_project = tk.StringVar()
		self.inv_docs = tk.StringVar(value="docs,Soul")
		self.inv_indexes = tk.StringVar(value="")
		self.inv_code = tk.StringVar(value="backend,frontend")
		rowb = 0
		ttk.Label(inv, text="Name:").grid(row=rowb, column=0, sticky="w"); ttk.Entry(inv, textvariable=self.inv_name, width=28).grid(row=rowb, column=1, sticky="ew")
		rowb += 1
		ttk.Label(inv, text="Project:").grid(row=rowb, column=0, sticky="w"); ttk.Entry(inv, textvariable=self.inv_project, width=28).grid(row=rowb, column=1, sticky="ew")
		rowb += 1
		ttk.Label(inv, text="Docs dirs:").grid(row=rowb, column=0, sticky="w"); ttk.Entry(inv, textvariable=self.inv_docs, width=28).grid(row=rowb, column=1, sticky="ew")
		rowb += 1
		ttk.Label(inv, text="Docs indexes:").grid(row=rowb, column=0, sticky="w"); ttk.Entry(inv, textvariable=self.inv_indexes, width=28).grid(row=rowb, column=1, sticky="ew")
		rowb += 1
		ttk.Label(inv, text="Code dirs:").grid(row=rowb, column=0, sticky="w"); ttk.Entry(inv, textvariable=self.inv_code, width=28).grid(row=rowb, column=1, sticky="ew")
		rowb += 1
		btn_gen = ttk.Button(inv, text="Generate", command=self.generate_invite)
		btn_gen.grid(row=rowb, column=0, sticky="ew", pady=(6,2))
		btn_copy = ttk.Button(inv, text="Copy", command=self.copy_invite)
		btn_copy.grid(row=rowb, column=1, sticky="ew", pady=(6,2))
		rowb += 1
		self.inv_text = tk.Text(inv, height=6, width=48)
		self.inv_text.grid(row=rowb, column=0, columnspan=2, sticky="nsew")
		self._install_context_menu(self.inv_text)
		inv.columnconfigure(1, weight=1)
		inv.rowconfigure(rowb, weight=1)

		frm.columnconfigure(0, weight=1)
		frm.columnconfigure(2, weight=0)
		frm.columnconfigure(3, weight=1)
		frm.rowconfigure(0, weight=1)
		frm.rowconfigure(7, weight=1)

		# --- Tab: Assignments ---
		frm2 = ttk.Frame(nb)
		nb.add(frm2, text="Assignments")
		cols = ("user_id","username","roles")
		self.tree = ttk.Treeview(frm2, columns=cols, show="headings", height=14)
		for c in cols:
			self.tree.heading(c, text=c)
		self.tree.grid(row=0, column=0, columnspan=3, sticky="nsew", padx=6, pady=6)
		vs = ttk.Scrollbar(frm2, orient=tk.VERTICAL, command=self.tree.yview)
		vs.grid(row=0, column=3, sticky="ns")
		self.tree.configure(yscrollcommand=vs.set)
		btn_refresh = ttk.Button(frm2, text="Refresh", command=self.load_assignments)
		btn_refresh.grid(row=1, column=0, sticky="w", padx=6, pady=(0,6))
		btn_edit = ttk.Button(frm2, text="Edit role", command=self.edit_selected_role)
		btn_edit.grid(row=1, column=1, sticky="w", padx=6, pady=(0,6))
		btn_del = ttk.Button(frm2, text="Remove role", command=self.remove_selected_role)
		btn_del.grid(row=1, column=2, sticky="w", padx=6, pady=(0,6))
		frm2.columnconfigure(0, weight=1)
		frm2.rowconfigure(0, weight=1)

		# Status bar & progress
		self.status = tk.StringVar(value="Ready")
		self.status_bar = ttk.Label(self, textvariable=self.status, anchor="w")
		self.status_bar.pack(fill=tk.X, side=tk.BOTTOM)
		self.pb = ttk.Progressbar(self, mode="determinate", maximum=100)
		self.pb.pack(fill=tk.X, side=tk.BOTTOM)

		self.after(50, self.load_users)

	def open_dev_access_health(self) -> None:
		try:
			url = f"{_api_base()}/admin/access/health"
			r = _http_request("GET", url, headers=_headers(), json=None, timeout=15)
			js = r.json() if getattr(r, "headers", {}).get("content-type", "").startswith("application/json") else {"text": getattr(r, "text", "")}
			self._log(f"GET {url} → {getattr(r, 'status_code', 0)}\n{js}")
		except Exception as e:
			self._log(f"GET /admin/access/health error: {e}")

	def save_bootstrap_script(self) -> None:
		try:
			path = _fd.asksaveasfilename(title="Save bootstrap.ps1", defaultextension=".ps1", filetypes=[("PowerShell Script", ".ps1"), ("All Files", ".*")])
			if not path:
				return
			script = (
				"$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n"
				"python .\\Soul\\scripts\\hyperloop_cli.py --preflight\n"
				"python .\\Soul\\scripts\\hyperloop_cli.py --dsl INSPECTOR.RUN key=dev_access.health\n"
			)
			with open(path, "w", encoding="utf-8") as f:
				f.write(script)
			self._log(f"Saved bootstrap script: {path}")
		except Exception as e:
			messagebox.showerror("Error", str(e))

	def _log(self, line: str) -> None:
		try:
			self.log_text.insert(tk.END, (line[:8192] + ("…" if len(line) > 8192 else "")) + "\n")
			self.log_text.see(tk.END)
		except Exception:
			pass

	def _set_status(self, text: str, *, ok: bool | None = None) -> None:
		self.status.set(text)
		if ok is True:
			self.status_bar.configure(foreground="#0a0")
		elif ok is False:
			self.status_bar.configure(foreground="#a00")
		else:
			self.status_bar.configure(foreground="")
		self.update_idletasks()

	def _progress(self, v: int) -> None:
		try:
			self.pb.configure(value=max(0, min(100, v)))
			self.update_idletasks()
		except Exception:
			pass

	def load_users(self) -> None:
		self._set_status("Loading users…")
		self._progress(10)
		try:
			rows = _list_users()
			self._progress(70)
		except Exception as e:
			messagebox.showerror("Error", str(e))
			rows = []
		self.users = rows
		self.users_box.delete(0, tk.END)
		for u in rows:
			name = (u.get("first_name") or "") + " " + (u.get("last_name") or "")
			self.users_box.insert(tk.END, f"{u.get('user_id')}\t{u.get('username') or ''}\t{name.strip()}")
		self._progress(100)
		self._set_status(f"Loaded {len(rows)} users", ok=True)

	def on_select_user(self, _evt=None) -> None:
		idxs = self.users_box.curselection()
		if not idxs:
			return
		idx = idxs[0]
		u = self.users[idx]
		self.selected_tg.set(str(u.get("user_id")))
		try:
			roles = _get_roles_by_user_id(int(u.get("user_id")))
		except Exception as e:
			messagebox.showerror("Error", str(e))
			roles = []
		self.roles_list.set(", ".join(roles) if roles else "<none>")
		self._set_status("User selected", ok=True)

	def refresh_roles(self) -> None:
		# Поддержка ввода TG ID: при необходимости сначала разрешаем в user_id
		try:
			raw = self.selected_tg.get().strip()
			uid = int(raw)
		except Exception:
			messagebox.showwarning("Warning", "Invalid user id or tg id")
			return
		# Если это TG ID — пробуем ensure/resolve
		if uid and uid > 1000000:
			resolved_uid, err = _resolve_user_id_by_tg(uid)
			if resolved_uid is None:
				messagebox.showerror("Error", f"Cannot resolve user by TG ID\n{err or ''}")
				self._set_status("Resolve failed", ok=False)
				return
			uid = resolved_uid
			self.selected_tg.set(str(uid))
		try:
			roles = _get_roles_by_user_id(uid)
		except Exception as e:
			messagebox.showerror("Error", str(e))
			roles = []
		self.roles_list.set(", ".join(roles) if roles else "<none>")
		self._set_status("Roles refreshed", ok=True)

	def assign_role(self) -> None:
		self._apply_role(True)

	def remove_role(self) -> None:
		self._apply_role(False)

	def _apply_role(self, add: bool) -> None:
		# допускаем ввод tg_id — попытаемся разрешить в user_id
		txt = self.selected_tg.get().strip()
		uid: Optional[int]
		try:
			uid = int(txt)
		except Exception:
			uid = None
		if uid is None:
			messagebox.showwarning("Warning", "Enter user id or tg id")
			return
		self._progress(10)
		self._set_status("Resolving user…")
		if uid and uid > 1000000:  # эвристика: это TG ID
			resolved_uid, err = _resolve_user_id_by_tg(uid)
			if resolved_uid is None:
				messagebox.showerror("Error", f"Cannot resolve user by TG ID\n{err or ''}")
				self._set_status("Resolve failed", ok=False)
				return
			uid = resolved_uid
			# Обновляем поле ввода на user_id, чтобы дальнейшие вызовы (roles) не били 404
			self.selected_tg.set(str(uid))
		role = self.role_choice.get().strip()
		try:
			r = None
			self._set_status("Applying role…")
			self._progress(60)
			if add:
				url = f"{_api_base()}/user-management/assign-role"
				body = {"target_user_id": int(uid), "role_name": role}
				r = _http_request("POST", url, headers=_headers(), json=body, timeout=20)
			else:
				url = f"{_api_base()}/user-management/remove-role"
				body = {"target_user_id": int(uid), "role_name": role}
				r = _http_request("POST", url, headers=_headers(), json=body, timeout=20)
			ok = bool(r and r.ok)
			self._progress(90)
			if r is not None and (not r.ok):
				try:
					msg = r.json()
					messagebox.showerror("Error", str(msg))
					self._set_status("Operation failed", ok=False)
				except Exception:
					messagebox.showerror("Error", getattr(r, "text", "HTTP error"))
					self._set_status("Operation failed", ok=False)
		except Exception as e:
			messagebox.showerror("Error", str(e))
			ok = False
		if ok:
			self.refresh_roles()
			self._progress(100)
			self._set_status("Done", ok=True)
		else:
			self._progress(0)

	def copy_user_id(self) -> None:
		try:
			self.clipboard_clear()
			self.clipboard_append(self.selected_tg.get())
			messagebox.showinfo("Copied", "User ID copied")
		except Exception as e:
			messagebox.showerror("Error", str(e))

	def generate_invite(self) -> None:
		"""Собрать текст приглашения по ТЗ."""
		role = self.role_choice.get().strip()
		project = (self.inv_project.get() or "").strip()
		docs = (self.inv_docs.get() or "").strip()
		indexes = (self.inv_indexes.get() or "").strip()
		code = (self.inv_code.get() or "").strip()
		name = (self.inv_name.get() or "<FULL_NAME>").strip()
		uid_txt = self.selected_tg.get().strip()
		connect = f"CONNECT.NEW_DEV id=\"{uid_txt}\" name=\"{name}\" role=\"{role}\"\n"
		lines = [project, docs, indexes, code]
		out = connect + "\n".join(lines) + "\n"
		self.inv_text.delete("1.0", tk.END)
		self.inv_text.insert("1.0", out)
		self._set_status("Invite generated", ok=True)

	def copy_invite(self) -> None:
		try:
			self.clipboard_clear()
			self.clipboard_append(self.inv_text.get("1.0", tk.END))
			messagebox.showinfo("Copied", "Invite copied to clipboard")
			self._set_status("Invite copied", ok=True)
		except Exception as e:
			messagebox.showerror("Error", str(e))

	def apply_settings(self) -> None:
		# Обновляем переменные окружения, чтобы хелперы использовали новые значения
		os.environ["TG_ID"] = self.set_tg_id.get().strip()
		base = self.set_api_base.get().strip()
		if not (base.startswith("http://") or base.startswith("https://")):
			messagebox.showwarning("Warning", "API_BASE must start with http:// or https://. Reverting to default.")
			base = "https://mini.soulpulse.art/api"
			self.set_api_base.set(base)
		os.environ["API_BASE"] = base
		messagebox.showinfo("Applied", f"Headers/API base updated:\nTG_ID={os.environ['TG_ID']}\nAPI_BASE={os.environ['API_BASE']}")
		self._set_status("Settings applied", ok=True)

	def _install_context_menu(self, widget) -> None:
		menu = tk.Menu(widget, tearoff=0)
		def do_copy():
			try:
				self.clipboard_clear()
				if isinstance(widget, tk.Text):
					text = widget.get("1.0", tk.END)
				else:
					text = widget.get()
				self.clipboard_append(text)
			except Exception:
				pass
		def do_paste():
			try:
				clip = self.clipboard_get()
				if isinstance(widget, tk.Text):
					widget.insert(tk.INSERT, clip)
				else:
					widget.delete(0, tk.END)
					widget.insert(0, clip)
			except Exception:
				pass
		def do_select_all():
			try:
				if isinstance(widget, tk.Text):
					widget.tag_add(tk.SEL, "1.0", tk.END)
				else:
					widget.selection_range(0, tk.END)
			except Exception:
				pass
		menu.add_command(label="Copy", command=do_copy)
		menu.add_command(label="Paste", command=do_paste)
		menu.add_command(label="Select All", command=do_select_all)
		def show_menu(event):
			menu.tk_popup(event.x_root, event.y_root)
		widget.bind("<Button-3>", show_menu)

	def test_endpoints(self) -> None:
		# DRY run последовательность: resolve/ensure/assign
		base = _api_base()
		h = _headers()
		try:
			self._set_status("Testing endpoints…")
			self._progress(20)
			url = f"{base}/user-management/resolve?tg_id={int(self.set_tg_id.get().strip())}"
			r = _http_request("GET", url, headers=h, json=None, timeout=12)
			self._log(f"GET {url} -> {getattr(r,'status_code',0)}")
			self._log(getattr(r, "text", ""))
			self._progress(50)
			url = f"{base}/user-management/ensure-by-tg?tg_id={int(self.set_tg_id.get().strip())}"
			r = _http_request("POST", url, headers=h, json=None, timeout=12)
			self._log(f"POST {url} -> {getattr(r,'status_code',0)}")
			self._log(getattr(r, "text", ""))
			self._progress(80)
			self._set_status("Diagnostics done", ok=True)
		except Exception as e:
			self._log(f"Diagnostics error: {e}")
			self._set_status("Diagnostics error", ok=False)

	def load_assignments(self) -> None:
		# Загружаем пользователей с их ролями в таблицу
		self.tree.delete(*self.tree.get_children())
		try:
			rows = _list_users()
			for u in rows:
				uid = int(u.get('user_id'))
				roles = _get_roles_by_user_id(uid)
				self.tree.insert('', tk.END, values=(uid, u.get('username') or '', ", ".join(roles)))
			self._set_status("Assignments loaded", ok=True)
		except Exception as e:
			messagebox.showerror("Error", str(e))
			self._set_status("Assignments load failed", ok=False)

	def edit_selected_role(self) -> None:
		item = self.tree.selection()
		if not item:
			return
		vals = self.tree.item(item[0], 'values')
		try:
			uid = int(vals[0])
		except Exception:
			return
		roles_avail = _get_available_roles()
		win = tk.Toplevel(self)
		win.title("Edit roles")
		choice = tk.StringVar(value=roles_avail[0] if roles_avail else "basic")
		cb = ttk.Combobox(win, values=roles_avail, textvariable=choice, state="readonly")
		cb.pack(padx=10, pady=10)
		def do_add():
			ok = _assign_role(uid, choice.get().strip())
			messagebox.showinfo("Assign", "OK" if ok else "FAILED")
			self._set_status("Role assigned" if ok else "Assign failed", ok=ok)
			self.load_assignments()
		def do_remove():
			ok = _remove_role(uid, choice.get().strip())
			messagebox.showinfo("Remove", "OK" if ok else "FAILED")
			self._set_status("Role removed" if ok else "Remove failed", ok=ok)
			self.load_assignments()
		btn_a = ttk.Button(win, text="Assign", command=do_add)
		btn_a.pack(padx=10, pady=(0,6))
		btn_r = ttk.Button(win, text="Remove", command=do_remove)
		btn_r.pack(padx=10, pady=(0,10))

	def remove_selected_role(self) -> None:
		item = self.tree.selection()
		if not item:
			return
		vals = self.tree.item(item[0], 'values')
		try:
			uid = int(vals[0])
		except Exception:
			return
		role = self.role_choice.get().strip()
		ok = _remove_role(uid, role)
		messagebox.showinfo("Remove", "OK" if ok else "FAILED")
		self._set_status("Role removed" if ok else "Remove failed", ok=ok)
		self.load_assignments()


if __name__ == "__main__":
	try:
		app = RolesGUI()
		app.mainloop()
	except Exception as e:
		root = tk.Tk()
		root.title("Diagnostics")
		txt = tk.Text(root, height=16, width=80)
		txt.pack(fill=tk.BOTH, expand=True)
		try:
			msg = str(e)
		except Exception:
			msg = "GUI start error"
		txt.insert("1.0", msg[:8192])
		root.mainloop()
