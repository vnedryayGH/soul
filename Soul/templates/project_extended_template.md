# Расширенный лог: {{project_name}}

**Проект ID:** `{{project_id}}`  
**Создан:** {{created_at}}  
**Владелец:** {{owner_name}} (TG: {{owner_tg_id}})  
**Статус:** {{status}}  
**Методология:** {{methodology}}  
**Приоритет:** {{priority}}

---

## Оглавление

1. [Описание проекта](#описание)
2. [Архитектура решения](#архитектура)
3. [История шагов](#история)
4. [ADR (Architecture Decision Records)](#adr)
5. [Диаграммы и схемы](#диаграммы)
6. [Инциденты и риски](#инциденты)
7. [Метрики и результаты](#метрики)
8. [P-TZ релевантные](#ptz-docs)
9. [Код и артефакты](#артефакты)

---

## Описание проекта {#описание}

### Проблема

{{problem_description}}

### Решение

{{solution_description}}

### Критерии успеха

{{success_criteria}}

### Scope

**В рамках проекта:**
- {{in_scope_items}}

**Вне рамок:**
- {{out_of_scope_items}}

---

## Архитектура решения {#архитектура}

### Общая схема

```
{{architecture_diagram}}
```

### Компоненты

{{components_list}}

### Взаимодействие

{{interaction_description}}

---

## История шагов {#история}

### {{date}} — {{milestone_title}}

**Шаги:**
1. {{step_description}}
2. {{step_description}}

**Результаты:**
- {{result_item}}

**Проблемы и решения:**
- {{problem}}: {{solution}}

**Следующее:** {{next_action}}

---

## ADR (Architecture Decision Records) {#adr}

### ADR-001: {{decision_title}}

**Дата:** {{date}}  
**Статус:** {{status}} (Принято/Отклонено/Заменено ADR-XXX)  
**Участники:** {{participants}}

**Контекст:**
{{context_description}}

**Решение:**
{{decision_description}}

**Обоснование:**
{{rationale}}

**Последствия:**
{{consequences}}
+ {{positive_consequence}}
- {{negative_consequence}}

**Альтернативы рассмотрены:**
- {{alternative_1}}: {{why_rejected}}
- {{alternative_2}}: {{why_rejected}}

**Связанные ADR:**
- {{related_adr}}

---

## Диаграммы и схемы {#диаграммы}

### Схема 1: {{diagram_title}}

```
{{diagram_content}}
```

**Описание:** {{diagram_description}}

---

## Инциденты и риски {#инциденты}

### Инциденты

| ID | Severity | Дата | Описание | Статус | Ссылка |
|----|----------|------|----------|--------|--------|
| {{incident_id}} | {{severity}} | {{date}} | {{description}} | {{status}} | [Link](#) |

### Риски

| ID | Impact | Вероятность | Описание | Митигация | Владелец |
|----|--------|-------------|----------|-----------|----------|
| {{risk_id}} | {{impact}} | {{probability}} | {{description}} | {{mitigation}} | {{owner}} |

---

## Метрики и результаты {#метрики}

### Целевые метрики

| Метрика | Цель | Текущее | Статус |
|---------|------|---------|--------|
| {{metric_name}} | {{target}} | {{current}} | {{status}} |

### Результаты тестов

{{test_results}}

### Производительность

{{performance_results}}

---

## P-TZ релевантные {#ptz-docs}

Документы которые использовались в этом проекте:

- **{{ptz_id}}** — {{ptz_title}} ({{why_used}})
  - Разделы: {{sections_used}}
  - Ключевые концепции: {{concepts_used}}

---

## Код и артефакты {#артефакты}

### Ключевые файлы

| Файл | Назначение | Статус |
|------|------------|--------|
| {{file_path}} | {{purpose}} | {{status}} |

### Commits

{{commit_list}}

### PRs

{{pr_list}}

---

## Changelog расширенного лога

### {{date}} — v{{version}}

- {{change_description}}

---

**Размер документа:** {{size_lines}} строк, {{size_tokens}} токенов  
**Последнее обновление:** {{last_updated}}

