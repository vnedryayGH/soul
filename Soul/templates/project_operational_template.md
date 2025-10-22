# Оперативный лог: {{project_name}}

**Последнее обновление:** {{timestamp}}  
**Текущий этап:** {{current_phase}}  
**Ветка:** `{{branch_key}}`  
**План-задача:** `{{plan_task_id}}`  
**Проект ID:** `{{project_id}}`

---

## 🎯 Текущая задача

{{current_task_description}}

**Цель:** {{goal}}

**Критерий успеха:** {{success_criteria}}

---

## 📋 Последние шаги (max 5)

### Шаг 1: {{step_title}} {{step_status}}
**Время:** {{timestamp}}  
**Результат:** {{step_result}}  
**Файлы:** {{files_changed}}

---

## 📌 Immediate Context

**Активные переменные:**
- `project_id`: {{project_id}}
- `plan_task_id`: {{plan_task_id}}
- `branch`: {{branch_key}}
- {{custom_vars}}

**Важные пути:**
- {{important_paths}}

**Текущее состояние:**
- {{current_state}}

**Следующий шаг:**
{{next_step}}

---

## 🔗 Ссылки на детали

- **Расширенный лог:** `projects/{{project_key}}/extended.md`
- **P-TZ релевантные:** {{relevant_ptz_list}}
- **Инциденты:** {{incident_links}}

---

## ⚠️ Текущие блокеры

{{blockers_list}}

---

## 📊 Метрики

- **Размер:** {{size_lines}} строк, {{size_tokens}} токенов
- **Шагов в логе:** {{steps_count}}
- **Последняя ротация:** {{last_rotated_at}}

