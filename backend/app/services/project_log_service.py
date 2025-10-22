"""
P66 — Project Log Service
Управление оперативными и расширенными логами проектов
"""
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, List
import tiktoken


class ProjectLogService:
    """Сервис управления проектными логами (P66)"""
    
    def __init__(self, base_path: str = "projects"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(exist_ok=True, parents=True)
        
        # Tiktoken для подсчёта токенов
        try:
            self.encoding = tiktoken.get_encoding("cl100k_base")
        except Exception:
            self.encoding = None
    
    def _get_project_dir(self, project_key: str) -> Path:
        """Получить директорию проекта"""
        safe_key = re.sub(r'[^\w\-]', '_', project_key.lower())
        project_dir = self.base_path / safe_key
        project_dir.mkdir(exist_ok=True, parents=True)
        return project_dir
    
    def _count_tokens(self, text: str) -> int:
        """Подсчитать токены в тексте"""
        if not text:
            return 0
        if self.encoding:
            try:
                return len(self.encoding.encode(text))
            except Exception:
                pass
        # Fallback: примерно 4 символа на токен
        return len(text) // 4
    
    def _load_template(self, template_name: str) -> str:
        """Загрузить шаблон"""
        template_path = Path("Soul/templates") / template_name
        if template_path.exists():
            return template_path.read_text(encoding="utf-8")
        # Fallback: минимальный шаблон
        if template_name == "project_operational_template.md":
            return self._get_minimal_operational_template()
        elif template_name == "project_extended_template.md":
            return self._get_minimal_extended_template()
        return ""
    
    def _get_minimal_operational_template(self) -> str:
        """Минимальный шаблон operational log"""
        return """# Оперативный лог: {{project_name}}

**Последнее обновление:** {{timestamp}}  
**Текущий этап:** {{current_phase}}  
**Ветка:** `{{branch_key}}`  
**План-задача:** `{{plan_task_id}}`  
**Проект ID:** `{{project_id}}`

---

## 🎯 Текущая задача

{{current_task_description}}

**Цель:** {{goal}}

---

## 📋 Последние шаги (max 5)

_(Здесь будут отображаться последние выполненные шаги)_

---

## 📌 Immediate Context

**Активные переменные:**
- `project_id`: {{project_id}}
- `branch`: {{branch_key}}

**Следующий шаг:**
{{next_step}}

---

## 🔗 Ссылки на детали

- **Расширенный лог:** `projects/{{project_key}}/extended.md`
- **P-TZ релевантные:** (будут добавлены по мере работы)
"""
    
    def _get_minimal_extended_template(self) -> str:
        """Минимальный шаблон extended log"""
        return """# Расширенный лог: {{project_name}}

**Проект ID:** `{{project_id}}`  
**Создан:** {{created_at}}  
**Владелец:** {{owner_name}} (TG: {{owner_tg_id}})  
**Статус:** {{status}}  
**Методология:** {{methodology}}  

---

## Оглавление

1. [Описание проекта](#описание)
2. [История шагов](#история)
3. [ADR (Architecture Decision Records)](#adr)
4. [Инциденты и риски](#инциденты)
5. [P-TZ релевантные](#ptz-docs)

---

## Описание проекта {#описание}

{{project_description}}

---

## История шагов {#история}

_(История будет заполняться автоматически при ротации operational log)_

---

## ADR (Architecture Decision Records) {#adr}

_(Архитектурные решения будут добавляться по мере принятия)_

---

## Инциденты и риски {#инциденты}

_(Инциденты и риски будут отслеживаться здесь)_

---

## P-TZ релевантные {#ptz-docs}

_(Список использованных P-TZ документов)_

---

**Последнее обновление:** {{timestamp}}
"""
    
    def _render_template(self, template: str, context: Dict[str, Any]) -> str:
        """Подставить переменные в шаблон"""
        result = template
        for key, value in context.items():
            placeholder = f"{{{{{key}}}}}"
            result = result.replace(placeholder, str(value) if value is not None else "")
        return result
    
    async def init_logs(
        self,
        project_id: str,
        project_name: str,
        project_key: str,
        template: str = "default",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        PROJECT.LOG.INIT — инициализация логов
        
        Args:
            project_id: UUID проекта
            project_name: Название проекта
            project_key: Ключ проекта (для папки)
            template: Тип шаблона (default/minimal)
            metadata: Дополнительные метаданные (owner, methodology, etc.)
        
        Returns:
            {"ok": True, "paths": {"operational": "...", "extended": "..."}}
        """
        try:
            project_dir = self._get_project_dir(project_key)
            
            # Пути к файлам
            op_path = project_dir / "operational.md"
            ext_path = project_dir / "extended.md"
            
            # Контекст для шаблонов
            metadata = metadata or {}
            now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
            
            context = {
                "project_id": project_id,
                "project_name": project_name,
                "project_key": project_key,
                "timestamp": now,
                "created_at": now,
                "current_phase": "Инициализация",
                "branch_key": metadata.get("branch", "main"),
                "plan_task_id": metadata.get("plan_task_id", ""),
                "current_task_description": metadata.get("description", "Проект создан"),
                "goal": metadata.get("goal", "Определить цели проекта"),
                "next_step": "Начать работу над первой задачей",
                "owner_name": metadata.get("owner_name", "Architect"),
                "owner_tg_id": metadata.get("owner", "468326902"),
                "status": metadata.get("status", "active"),
                "methodology": metadata.get("methodology", "agile"),
                "project_description": metadata.get("description", "Описание будет добавлено"),
            }
            
            # Создать operational.md
            op_template = self._load_template("project_operational_template.md")
            op_content = self._render_template(op_template, context)
            op_path.write_text(op_content, encoding="utf-8")
            
            # Создать extended.md
            ext_template = self._load_template("project_extended_template.md")
            ext_content = self._render_template(ext_template, context)
            ext_path.write_text(ext_content, encoding="utf-8")
            
            return {
                "ok": True,
                "paths": {
                    "operational": str(op_path),
                    "extended": str(ext_path)
                }
            }
        except Exception as e:
            return {"ok": False, "error": f"init_logs failed: {e}"}
    
    async def read_operational(self, project_key: str) -> Dict[str, Any]:
        """
        PROJECT.LOG.READ_OP — прочитать operational log
        
        Returns:
            {
                "ok": True,
                "content": "...",
                "metadata": {
                    "size_lines": N,
                    "size_tokens": N,
                    "last_updated": "...",
                    "steps_count": N
                }
            }
        """
        try:
            project_dir = self._get_project_dir(project_key)
            op_path = project_dir / "operational.md"
            
            if not op_path.exists():
                return {"ok": False, "error": "operational log not found"}
            
            content = op_path.read_text(encoding="utf-8")
            lines = content.split("\n")
            
            # Подсчитать шаги (ищем "### Шаг N:")
            steps_count = len([l for l in lines if re.match(r"^###\s+Шаг\s+\d+:", l.strip())])
            
            # Найти timestamp из "**Последнее обновление:**"
            last_updated = None
            for line in lines[:20]:  # Ищем в первых 20 строках
                if line.strip().startswith("**Последнее обновление:**"):
                    match = re.search(r"\*\*Последнее обновление:\*\*\s*(.+)", line)
                    if match:
                        last_updated = match.group(1).strip()
                        break
            
            metadata = {
                "size_lines": len(lines),
                "size_tokens": self._count_tokens(content),
                "last_updated": last_updated or "unknown",
                "steps_count": steps_count
            }
            
            return {
                "ok": True,
                "content": content,
                "metadata": metadata
            }
        except Exception as e:
            return {"ok": False, "error": f"read_operational failed: {e}"}
    
    async def read_extended(
        self,
        project_key: str,
        section: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        PROJECT.LOG.READ_EXT — прочитать extended log
        
        Args:
            project_key: Ключ проекта
            section: Секция для чтения (all/history/adr/diagrams/incidents)
        
        Returns:
            {
                "ok": True,
                "content": "...",
                "metadata": {
                    "size_lines": N,
                    "size_tokens": N,
                    "sections": [...]
                }
            }
        """
        try:
            project_dir = self._get_project_dir(project_key)
            ext_path = project_dir / "extended.md"
            
            if not ext_path.exists():
                return {"ok": False, "error": "extended log not found"}
            
            full_content = ext_path.read_text(encoding="utf-8")
            
            # Если section не указан или "all" — вернуть всё
            if not section or section == "all":
                content = full_content
            else:
                # Извлечь конкретную секцию
                # Ищем ## <Section> {#id}
                pattern = rf"##\s+.*\{{#{re.escape(section)}\}}"
                lines = full_content.split("\n")
                
                start_idx = None
                for i, line in enumerate(lines):
                    if re.match(pattern, line):
                        start_idx = i
                        break
                
                if start_idx is None:
                    return {"ok": False, "error": f"section '{section}' not found"}
                
                # Найти конец секции (следующий ## или конец файла)
                end_idx = len(lines)
                for i in range(start_idx + 1, len(lines)):
                    if lines[i].strip().startswith("## "):
                        end_idx = i
                        break
                
                content = "\n".join(lines[start_idx:end_idx])
            
            # Найти все секции
            sections = []
            for line in full_content.split("\n"):
                match = re.match(r"##\s+(.+?)\s+\{#(\w+)\}", line)
                if match:
                    sections.append(match.group(2))
            
            metadata = {
                "size_lines": len(content.split("\n")),
                "size_tokens": self._count_tokens(content),
                "sections": sections
            }
            
            return {
                "ok": True,
                "content": content,
                "metadata": metadata
            }
        except Exception as e:
            return {"ok": False, "error": f"read_extended failed: {e}"}
    
    async def update_operational(
        self,
        project_key: str,
        step_title: str,
        step_result: str,
        files: Optional[List[str]] = None,
        step_status: str = "✅"
    ) -> Dict[str, Any]:
        """
        PROJECT.LOG.UPDATE_OP — добавить шаг в operational log (с auto-trim)
        
        Args:
            project_key: Ключ проекта
            step_title: Название шага
            step_result: Результат выполнения
            files: Список изменённых файлов
            step_status: Статус (✅/🔄/⏳/❌)
        
        Returns:
            {"ok": True, "steps_count": N, "trimmed": bool}
        """
        try:
            project_dir = self._get_project_dir(project_key)
            op_path = project_dir / "operational.md"
            
            if not op_path.exists():
                return {"ok": False, "error": "operational log not found"}
            
            content = op_path.read_text(encoding="utf-8")
            lines = content.split("\n")
            
            # Найти раздел "## 📋 Последние шаги"
            steps_section_idx = None
            for i, line in enumerate(lines):
                if line.strip().startswith("## 📋 Последние шаги"):
                    steps_section_idx = i
                    break
            
            if steps_section_idx is None:
                return {"ok": False, "error": "section '📋 Последние шаги' not found"}
            
            # Найти конец раздела (следующий ##)
            next_section_idx = len(lines)
            for i in range(steps_section_idx + 1, len(lines)):
                if lines[i].strip().startswith("## "):
                    next_section_idx = i
                    break
            
            # Извлечь существующие шаги
            existing_steps = []
            current_step = []
            in_step = False
            
            for i in range(steps_section_idx + 1, next_section_idx):
                line = lines[i]
                if re.match(r"^###\s+Шаг\s+\d+:", line.strip()):
                    if current_step:
                        existing_steps.append("\n".join(current_step))
                    current_step = [line]
                    in_step = True
                elif in_step:
                    if line.strip() == "---" or (line.strip().startswith("###") and i > steps_section_idx + 2):
                        # Конец шага
                        if current_step:
                            existing_steps.append("\n".join(current_step))
                        current_step = []
                        in_step = False
                    else:
                        current_step.append(line)
            
            # Добавить последний шаг если есть
            if current_step:
                existing_steps.append("\n".join(current_step))
            
            # Создать новый шаг
            now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
            step_num = len(existing_steps) + 1
            files_str = ", ".join(files) if files else "—"
            
            new_step = f"""### Шаг {step_num}: {step_title} {step_status}
**Время:** {now}  
**Результат:** {step_result}  
**Файлы:** {files_str}
"""
            
            # Auto-trim: оставить только последние 5 шагов
            existing_steps.append(new_step)
            trimmed = False
            if len(existing_steps) > 5:
                existing_steps = existing_steps[-5:]
                trimmed = True
                # Перенумеровать шаги
                for i, step in enumerate(existing_steps):
                    step_lines = step.split("\n")
                    # Заменить ### Шаг N: на правильный номер
                    if step_lines[0].startswith("### Шаг"):
                        step_lines[0] = re.sub(r"^###\s+Шаг\s+\d+:", f"### Шаг {i+1}:", step_lines[0])
                    existing_steps[i] = "\n".join(step_lines)
            
            # Собрать обратно
            new_lines = (
                lines[:steps_section_idx + 1] +
                [""] +
                [step for step in existing_steps] +
                [""] +
                lines[next_section_idx:]
            )
            
            # Обновить timestamp в начале файла
            for i in range(min(20, len(new_lines))):
                if new_lines[i].strip().startswith("**Последнее обновление:**"):
                    new_lines[i] = f"**Последнее обновление:** {now}  "
                    break
            
            new_content = "\n".join(new_lines)
            
            # Проверить размер (enforcement ≤150 строк)
            if len(new_lines) > 150:
                # Warning — но не блокируем
                pass
            
            op_path.write_text(new_content, encoding="utf-8")
            
            return {
                "ok": True,
                "steps_count": len(existing_steps),
                "trimmed": trimmed,
                "size_lines": len(new_lines)
            }
        except Exception as e:
            return {"ok": False, "error": f"update_operational failed: {e}"}
    
    async def update_extended(
        self,
        project_key: str,
        section: str,
        content: str
    ) -> Dict[str, Any]:
        """
        PROJECT.LOG.UPDATE_EXT — обновить секцию в extended log
        
        Args:
            project_key: Ключ проекта
            section: Секция (history/adr/diagrams/incidents)
            content: Контент для добавления
        
        Returns:
            {"ok": True}
        """
        try:
            project_dir = self._get_project_dir(project_key)
            ext_path = project_dir / "extended.md"
            
            if not ext_path.exists():
                return {"ok": False, "error": "extended log not found"}
            
            full_content = ext_path.read_text(encoding="utf-8")
            lines = full_content.split("\n")
            
            # Найти секцию ## <Section> {#section}
            pattern = rf"##\s+.*\{{#{re.escape(section)}\}}"
            section_idx = None
            for i, line in enumerate(lines):
                if re.match(pattern, line):
                    section_idx = i
                    break
            
            if section_idx is None:
                return {"ok": False, "error": f"section '{section}' not found"}
            
            # Найти конец секции
            next_section_idx = len(lines)
            for i in range(section_idx + 1, len(lines)):
                if lines[i].strip().startswith("## "):
                    next_section_idx = i
                    break
            
            # Добавить контент в конец секции (перед следующей секцией)
            # Добавим timestamp
            now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
            new_content_lines = [
                "",
                f"### {now}",
                "",
                content,
                ""
            ]
            
            new_lines = (
                lines[:next_section_idx] +
                new_content_lines +
                lines[next_section_idx:]
            )
            
            ext_path.write_text("\n".join(new_lines), encoding="utf-8")
            
            return {"ok": True}
        except Exception as e:
            return {"ok": False, "error": f"update_extended failed: {e}"}
    
    async def rotate_logs(
        self,
        project_key: str,
        next_task: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        PROJECT.LOG.ROTATE — перенести шаги из operational в extended, очистить operational
        
        Args:
            project_key: Ключ проекта
            next_task: Описание следующей задачи
        
        Returns:
            {"ok": True, "transferred_lines": N, "transferred_steps": N}
        """
        try:
            # Прочитать operational
            op_result = await self.read_operational(project_key)
            if not op_result.get("ok"):
                return op_result
            
            op_content = op_result["content"]
            op_lines = op_content.split("\n")
            
            # Извлечь все шаги из operational
            steps_section_idx = None
            for i, line in enumerate(op_lines):
                if line.strip().startswith("## 📋 Последние шаги"):
                    steps_section_idx = i
                    break
            
            if steps_section_idx is None:
                return {"ok": False, "error": "steps section not found in operational"}
            
            # Найти конец секции
            next_section_idx = len(op_lines)
            for i in range(steps_section_idx + 1, len(op_lines)):
                if op_lines[i].strip().startswith("## "):
                    next_section_idx = i
                    break
            
            # Извлечь шаги
            steps_lines = op_lines[steps_section_idx + 1:next_section_idx]
            steps_text = "\n".join(steps_lines).strip()
            
            # Подсчитать количество шагов
            steps_count = len([l for l in steps_lines if re.match(r"^###\s+Шаг\s+\d+:", l.strip())])
            
            if steps_count == 0:
                return {"ok": False, "error": "no steps to rotate"}
            
            # Добавить в extended log (секция история)
            now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            history_content = f"""**Ротация:** {now}

{steps_text}

**Всего шагов перенесено:** {steps_count}
"""
            
            ext_result = await self.update_extended(project_key, "история", history_content)
            if not ext_result.get("ok"):
                return ext_result
            
            # Очистить operational (оставить структуру)
            project_dir = self._get_project_dir(project_key)
            op_path = project_dir / "operational.md"
            
            # Заменить раздел "Последние шаги" на пустой
            cleared_lines = op_lines[:steps_section_idx + 1]
            cleared_lines.append("")
            cleared_lines.append("_(Шаги были перенесены в расширенный лог)_")
            cleared_lines.append("")
            cleared_lines += op_lines[next_section_idx:]
            
            # Обновить "Текущая задача" если указан next_task
            if next_task:
                for i in range(len(cleared_lines)):
                    if cleared_lines[i].strip().startswith("## 🎯 Текущая задача"):
                        # Заменить следующие строки до следующей секции
                        j = i + 1
                        while j < len(cleared_lines) and not cleared_lines[j].strip().startswith("##"):
                            j += 1
                        cleared_lines = (
                            cleared_lines[:i+1] +
                            ["", next_task, ""] +
                            cleared_lines[j:]
                        )
                        break
            
            # Обновить timestamp
            now_time = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
            for i in range(min(20, len(cleared_lines))):
                if cleared_lines[i].strip().startswith("**Последнее обновление:**"):
                    cleared_lines[i] = f"**Последнее обновление:** {now_time}  "
                    break
            
            op_path.write_text("\n".join(cleared_lines), encoding="utf-8")
            
            return {
                "ok": True,
                "transferred_steps": steps_count,
                "transferred_lines": len(steps_lines)
            }
        except Exception as e:
            return {"ok": False, "error": f"rotate_logs failed: {e}"}

