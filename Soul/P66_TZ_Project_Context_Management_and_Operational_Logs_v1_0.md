# P66 — Управление контекстом проекта и оперативные логи v1.0

**Статус:** УТВЕРЖДЕНО  
**Дата:** 2025-10-22  
**Автор:** Архитектор (TG: 468326902)  
**Связано:** P40 (Planning), P57 (System Prompt Governance), P58 (Hyperloop API)  

---

## Проблема

Cursor Agents перегружаются информацией из системного промпта:
- `.cursorrules` содержит 484 строки (~6500 токенов)
- Таблица из 40+ P-TZ документов подталкивает читать всё подряд
- При каждой длинной сессии контекст растёт до 80K+ токенов
- Результат: `Connection failed`, потеря истории, блокировка работы

**Root cause:** Отсутствие иерархии информации и системы управления фокусом внимания.

---

## Архитектура решения: 4-уровневая система

```
┌─────────────────────────────────────────────────────────────┐
│ Уровень 0: БАЗОВЫЙ ПРОМПТ (.cursorrules)                    │
│ • Только критичное для старта (<150 строк, ~2K токенов)     │
│ • Роль, глобальные правила, ссылка на Уровень 1            │
│ • Указание: "Читай далее ТОЛЬКО по необходимости"          │
└─────────────────────────────────────────────────────────────┘
                          ↓ when started
┌─────────────────────────────────────────────────────────────┐
│ Уровень 1: ОПЕРАТИВНЫЙ ЛОГ ПРОЕКТА (project_operational.md)│
│ • Текущая задача (3-5 предложений)                         │
│ • Последние 3-5 шагов (с результатами)                     │
│ • Immediate context (переменные, пути, активные ветки)     │
│ • Ссылки на Уровень 2 для деталей                          │
│ • Размер: 50-150 строк (~1K-2K токенов)                    │
│ • Обновляется: после КАЖДОГО выполненного шага             │
└─────────────────────────────────────────────────────────────┘
                          ↓ when need details
┌─────────────────────────────────────────────────────────────┐
│ Уровень 2: РАСШИРЕННЫЙ ЛОГ ПРОЕКТА (project_extended.md)   │
│ • Полная история проекта (структурированная)               │
│ • Все шаги с timestamp и результатами                       │
│ • Решения и обоснования (ADR - Architecture Decision Log)  │
│ • Диаграммы, схемы, важные фрагменты кода                 │
│ • Ссылки на P-TZ документы (по теме)                       │
│ • Размер: 300-1000 строк (~5K-15K токенов)                 │
│ • Обновляется: после завершения значимых этапов            │
└─────────────────────────────────────────────────────────────┘
                          ↓ when need P-TZ spec
┌─────────────────────────────────────────────────────────────┐
│ Уровень 3: P-TZ ДОКУМЕНТЫ (специализированные ТЗ)          │
│ • Читать ТОЛЬКО когда явно нужна спецификация             │
│ • Например: нужно реализовать RBAC → читай P44            │
│ • Размер документа: 500-2000 строк                          │
└─────────────────────────────────────────────────────────────┘
                          ↓ when P-TZ insufficient
┌─────────────────────────────────────────────────────────────┐
│ Уровень 4: ВНЕШНИЕ ИСТОЧНИКИ (код, LIB, web search)        │
│ • Codebase search, grep, read_file                         │
│ • LIB.SEARCH для паттернов и lessons learned               │
│ • Web search для внешней информации                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow агента

### 🚀 Старт работы

```
1. Прочитать .cursorrules (Уровень 0) → знать роль и базовые правила
2. Прочитать project_operational.md (Уровень 1) → понять текущую задачу
3. Начать работу с минимальным контекстом (~3K-4K токенов)
```

### 🔄 Во время работы

```
4. Нужны детали истории? → Читай project_extended.md (Уровень 2)
5. Нужна спецификация RBAC/Planning/RS? → Читай конкретный P-TZ (Уровень 3)
6. Нужен код или паттерны? → Используй codebase_search / LIB.SEARCH (Уровень 4)
```

### ✅ После каждого шага

```
7. Обновить project_operational.md:
   - Добавить выполненный шаг
   - Удалить устаревшие шаги (старше 3 последних)
   - Обновить immediate context
8. Размер project_operational.md ВСЕГДА ≤150 строк (принудительная обрезка старого)
```

### 🎯 После завершения этапа

```
9. Обновить project_extended.md:
   - Перенести все шаги из operational в extended
   - Записать ADR (почему выбрали это решение)
   - Добавить ссылки на P-TZ которые использовались
10. Очистить project_operational.md (оставить только "Следующая задача")
```

---

## Формат Оперативного лога

**Файл:** `projects/<project_key>/operational.md`

```markdown
# Оперативный лог: <Project Name>

**Последнее обновление:** 2025-10-22 16:30  
**Текущий этап:** Реализация системы логов  
**Ветка:** `p66-context-management`  
**План-задача:** `<plan_task.id>`

## 🎯 Текущая задача

Создать P66 документ с 4-уровневой архитектурой управления контекстом.
Цель: снизить начальный контекст с 50K до 4K токенов.

## 📋 Последние шаги (max 5)

### Шаг 3: Создание P66 документа ✅
**Время:** 2025-10-22 16:30  
**Результат:** Документ создан, описана архитектура  
**Файлы:** `Soul/P66_TZ_Project_Context_Management_and_Operational_Logs_v1_0.md`

### Шаг 2: Аудит .cursorrules ✅
**Время:** 2025-10-22 16:15  
**Результат:** Найдено 484 строки, таблица 40+ P-TZ, дублирование 60%  
**Токены:** ~6500 в промпте + 40K-80K от P-TZ = проблема

### Шаг 1: Диагностика проблемы ✅
**Время:** 2025-10-22 16:00  
**Результат:** Backend здоров, проблема на стороне Cursor (переполнение контекста)

## 📌 Immediate Context

**Активные переменные:**
- `project_id`: (получить после регистрации)
- `plan_task_id`: (получить после создания задачи)
- `branch`: `p66-context-management`

**Важные пути:**
- `.cursorrules` — требует минимизации
- `Soul/P66_*.md` — создаётся сейчас
- `projects/<key>/operational.md` — новая структура

**Следующий шаг:**
Создать шаблон operational.md и расширить P66 разделами DSL/API.

## 🔗 Ссылки на детали

- **Расширенный лог:** `projects/p66-context-mgmt/extended.md` (создать)
- **P-TZ релевантные:** P40 (Planning), P57 (Governance), P58 (Hyperloop API)
- **Incidents:** (пока нет)
```

**Ключевые принципы:**
1. **Размер:** Не более 150 строк
2. **Актуальность:** Только последние 3-5 шагов
3. **Фокус:** Что нужно СЕЙЧАС для работы
4. **Обрезка:** Старые шаги удаляются автоматически

---

## Формат Расширенного лога

**Файл:** `projects/<project_key>/extended.md`

```markdown
# Расширенный лог: <Project Name>

**Проект ID:** `<project_id>`  
**Создан:** 2025-10-22  
**Владелец:** Архитектор (TG: 468326902)  
**Статус:** В работе  
**Методология:** Agile  

## Оглавление

1. [Описание проекта](#описание)
2. [Архитектура решения](#архитектура)
3. [История шагов](#история)
4. [ADR (Architecture Decision Records)](#adr)
5. [Диаграммы и схемы](#диаграммы)
6. [Инциденты и риски](#инциденты)
7. [P-TZ релевантные](#ptz-docs)

## Описание проекта {#описание}

**Проблема:** Cursor Agents перегружаются контекстом, короткие задачи работают,
длинные блокируются с `Connection failed`.

**Решение:** 4-уровневая система управления информацией с оперативным логом
размером 50-150 строк для поддержания фокуса.

**Критерий успеха:** Начальный контекст ≤5K токенов, длинные сессии >50 сообщений
без ошибок.

## Архитектура решения {#архитектура}

[Полная схема 4-уровневой системы]

## История шагов {#история}

### 2025-10-22 16:30 — Создание P66 документа

**Шаги:**
1. Аудит .cursorrules выявил 484 строки + таблица 40+ P-TZ
2. Спроектирована 4-уровневая архитектура
3. Создан P66 с форматами operational/extended логов

**Результаты:**
- Файл: `Soul/P66_TZ_Project_Context_Management_and_Operational_Logs_v1_0.md`
- Токены промпта: 6500 → планируется 2000 (после оптимизации .cursorrules)

**Следующее:** Реализовать DSL команды для управления логами

### 2025-10-22 16:00 — Диагностика и создание инцидента

[детали...]

## ADR (Architecture Decision Records) {#adr}

### ADR-001: Выбор 4-уровневой системы вместо 2-уровневой

**Дата:** 2025-10-22  
**Статус:** Принято  

**Контекст:** Изначально рассматривали простую систему "промпт + проектный лог".

**Решение:** Разделили на 4 уровня с явной иерархией.

**Обоснование:**
- Агент должен явно понимать когда переходить к следующему уровню
- Operational лог малого размера (50-150 строк) удерживает фокус
- Extended лог сохраняет историю без переполнения контекста
- P-TZ читаются только по требованию

**Последствия:**
+ Контекст снижен с 50K до 4K токенов на старте
+ Чёткий workflow для агента
- Нужна дисциплина обновления логов

**Альтернативы отвергнуты:**
- Автоматическая компрессия: недетерминирована, теряет важное
- Единый лог: растёт бесконтрольно

## Диаграммы и схемы {#диаграммы}

[Вставить схемы из P66]

## Инциденты и риски {#инциденты}

[Ссылки на INCIDENT.LIST для этого проекта]

## P-TZ релевантные {#ptz-docs}

Документы которые использовались в этом проекте:

- **P40** — Planning (методология, CPM, задачи)
- **P57** — System Prompt Governance (правила обновления промпта)
- **P58** — Hyperloop API (DSL команды)
- **P36** — Hyperloop DSL (грамматика)
```

**Ключевые принципы:**
1. **Полнота:** Вся история проекта
2. **Структура:** Оглавление, разделы, ADR
3. **Навигация:** Якоря для быстрого поиска
4. **Размер:** 300-1000 строк (контролируемый рост)

---

## DSL команды для управления логами

### PROJECT.LOG.INIT

**Назначение:** Инициализировать структуру логов для проекта

**Синтаксис:**
```
PROJECT.LOG.INIT project_id=<UUID> [template=<default|minimal|research>]
```

**Поведение:**
1. Создать папку `projects/<project_key>/`
2. Создать `operational.md` из шаблона
3. Создать `extended.md` с метаданными из `plan_projects`
4. Вернуть пути к файлам

**Пример:**
```powershell
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.INIT project_id=<pid> template=default"
```

---

### PROJECT.LOG.UPDATE_OP

**Назначение:** Добавить шаг в оперативный лог (с автообрезкой)

**Синтаксис:**
```
PROJECT.LOG.UPDATE_OP project_id=<UUID> step_title="..." step_result="..." [files="..."]
```

**Поведение:**
1. Прочитать `operational.md`
2. Добавить новый шаг в раздел "Последние шаги" с timestamp
3. Если шагов >5 → удалить самый старый
4. Обновить "Последнее обновление"
5. Если размер >150 строк → предупредить + принудительная обрезка

**Пример:**
```powershell
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.UPDATE_OP project_id=<pid> step_title='Создан P66' step_result='Документ готов' files='Soul/P66_*.md'"
```

---

### PROJECT.LOG.UPDATE_EXT

**Назначение:** Добавить раздел или ADR в расширенный лог

**Синтаксис:**
```
PROJECT.LOG.UPDATE_EXT project_id=<UUID> section=<history|adr|diagrams|incidents> content="..."
```

**Поведение:**
1. Прочитать `extended.md`
2. Добавить контент в указанный раздел
3. Обновить оглавление если нужно
4. Сохранить

**Пример:**
```powershell
# Добавить ADR
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.UPDATE_EXT project_id=<pid> section=adr content='ADR-001: Выбор 4-уровневой системы...'"

# Добавить историю
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.UPDATE_EXT project_id=<pid> section=history content='### 2025-10-22 — Завершение P66...'"
```

---

### PROJECT.LOG.ROTATE

**Назначение:** Перенести все шаги из operational в extended, очистить operational

**Синтаксис:**
```
PROJECT.LOG.ROTATE project_id=<UUID> [next_task="..."]
```

**Поведение:**
1. Прочитать `operational.md`
2. Извлечь все шаги из раздела "Последние шаги"
3. Добавить их в `extended.md` раздел "История" с текущей датой
4. Очистить operational.md (оставить только структуру + next_task)
5. Вернуть статистику (перенесено строк, новый размер)

**Пример:**
```powershell
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.ROTATE project_id=<pid> next_task='Реализовать DSL команды'"
```

---

### PROJECT.LOG.READ_OP

**Назначение:** Прочитать оперативный лог (для загрузки в контекст агента)

**Синтаксис:**
```
PROJECT.LOG.READ_OP project_id=<UUID>
```

**Возврат:**
```json
{
  "ok": true,
  "data": {
    "content": "<полный текст operational.md>",
    "size_lines": 87,
    "size_tokens": 1250,
    "last_updated": "2025-10-22T16:30:00Z",
    "steps_count": 3
  }
}
```

---

### PROJECT.LOG.READ_EXT

**Назначение:** Прочитать расширенный лог (или конкретный раздел)

**Синтаксис:**
```
PROJECT.LOG.READ_EXT project_id=<UUID> [section=<all|history|adr|diagrams>]
```

**Возврат:**
```json
{
  "ok": true,
  "data": {
    "content": "<полный или частичный текст>",
    "size_lines": 450,
    "size_tokens": 6800,
    "sections": ["описание", "архитектура", "история", "adr", "диаграммы"]
  }
}
```

---

## API endpoints (backend)

### POST /api/admin/projects/:project_id/logs/init

**Payload:**
```json
{
  "template": "default"
}
```

**Response:**
```json
{
  "ok": true,
  "paths": {
    "operational": "projects/p66-context-mgmt/operational.md",
    "extended": "projects/p66-context-mgmt/extended.md"
  }
}
```

### POST /api/admin/projects/:project_id/logs/operational/update

**Payload:**
```json
{
  "step_title": "Создан P66",
  "step_result": "Документ готов",
  "files": ["Soul/P66_*.md"]
}
```

### GET /api/admin/projects/:project_id/logs/operational

**Response:**
```json
{
  "ok": true,
  "content": "...",
  "metadata": {
    "size_lines": 87,
    "size_tokens": 1250,
    "steps_count": 3
  }
}
```

---

## Интеграция с P40 (Planning)

Логи привязаны к проектам из P40:

1. **При создании проекта** (`PROJECT.CREATE`) → автоматически вызвать `PROJECT.LOG.INIT`
2. **При выполнении задачи** (`PLAN.TASK.UPDATE status=completed`) → автоматически `PROJECT.LOG.UPDATE_OP` с результатом
3. **При завершении этапа** → предложить агенту `PROJECT.LOG.ROTATE`

**Поля `plan_projects` расширить:**
```sql
ALTER TABLE plan_projects ADD COLUMN log_operational_path TEXT;
ALTER TABLE plan_projects ADD COLUMN log_extended_path TEXT;
ALTER TABLE plan_projects ADD COLUMN log_last_rotated_at TIMESTAMPTZ;
```

---

## Оптимизация .cursorrules (после P66)

### Что убрать:

1. **Таблица P-TZ (строки 25-68):** Заменить на:
   ```
   ## P-TZ Documents
   
   Read P-TZ documents ONLY when needed for specific task:
   - Planning/CPM: P40
   - RBAC/Two-Keys: P44
   - Incidents: P50
   - RS operations: P48R
   - Context management: P66 (this workflow)
   
   Full list: see docs/SYSTEM_MASTER_DOCUMENTS_REGISTRY.md
   Priority: Operational log → Extended log → P-TZ → Source code
   ```

2. **Примеры команд (строки 74-118):** Убрать, ссылаться на P36/P40

3. **Дублирование Planning + Developer Workflow:** Объединить в 1 раздел

### Что добавить:

1. **Workflow P66 (сразу после Global Rules):**
   ```
   ## Agent Context Workflow (P66)
   
   1. START: Read .cursorrules (you are here) + PROJECT.LOG.READ_OP
   2. WORK: Use operational log as primary context
   3. DETAILS: Read extended log / P-TZ / code ONLY when needed
   4. AFTER STEP: PROJECT.LOG.UPDATE_OP (add step, auto-trim old)
   5. AFTER PHASE: PROJECT.LOG.ROTATE (move to extended, clear operational)
   
   Goal: Keep context ≤5K tokens for stable long sessions.
   ```

### Размер после оптимизации:

```
Текущий: 484 строки, ~6500 токенов
После: ~150 строк, ~2000 токенов
Экономия: ~4500 токенов (~70%)
```

---

## Acceptance Criteria

### Функциональные:

1. ✅ DSL команды `PROJECT.LOG.*` реализованы
2. ✅ API endpoints `/api/admin/projects/:id/logs/*` работают
3. ✅ Автоматическая обрезка operational.md при >150 строк
4. ✅ Шаблоны operational/extended логов созданы
5. ✅ Интеграция с P40 (авто-инициализация при PROJECT.CREATE)

### Метрики:

1. **Начальный контекст агента:** ≤5K токенов (было 50K-86K)
2. **Размер operational.md:** 50-150 строк (enforcement автоматический)
3. **Стабильность длинных сессий:** >50 сообщений без `Connection failed`
4. **Время доступа к operational:** <50ms (read from disk or cache)

### Smoke test:

```powershell
# 1. Создать проект
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.CREATE name='Test_P66' owner=468326902"

# 2. Инициализировать логи (автоматически при PROJECT.CREATE)
# → проверить существование operational.md, extended.md

# 3. Добавить 10 шагов
for i in 1..10 {
  python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.UPDATE_OP project_id=<pid> step_title='Step $i' step_result='Done'"
}
# → проверить что operational.md содержит только последние 5

# 4. Ротация
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.ROTATE project_id=<pid> next_task='Continue'"
# → проверить что все 10 шагов в extended.md, operational.md очищен

# 5. Длинная сессия (50+ сообщений в Cursor)
# → проверить отсутствие Connection failed
```

---

## Риски и митигация

### Риск 1: Агенты забывают обновлять operational.md

**Митигация:**
- Добавить в .cursorrules imperative: "AFTER STEP: PROJECT.LOG.UPDATE_OP"
- Inspector `planning.enforce` проверяет наличие обновлений лога при PLAN.TASK.UPDATE
- Auto-update триггер в backend при завершении задач

### Риск 2: Extended.md растёт бесконтрольно (>1000 строк)

**Митигация:**
- Warning при >800 строк
- Предложение создать отдельный архивный документ
- Сжатие старых разделов (компрессия через LLM при Sleep)

### Риск 3: Дублирование информации между operational/extended

**Митигация:**
- Чёткое разделение: operational = "что сейчас", extended = "что было и почему"
- Автоматическая ротация переносит данные, не копирует

---

## Roadmap

### Phase 1: Базовая реализация (сегодня)

- [x] P66 документ создан
- [ ] DSL команды реализованы (backend)
- [ ] API endpoints опубликованы
- [ ] Шаблоны operational/extended готовы

### Phase 2: Интеграция с P40 (завтра)

- [ ] Auto-init логов при PROJECT.CREATE
- [ ] Auto-update operational при PLAN.TASK.UPDATE
- [ ] Inspector для контроля ведения логов

### Phase 3: Оптимизация .cursorrules (завтра)

- [ ] Убрать таблицу P-TZ, заменить на P66 workflow
- [ ] Убрать дублирование, примеры команд
- [ ] Smoke test на реальном проекте (50+ сообщений)

### Phase 4: Автоматизация (через неделю)

- [ ] LLM-агент для сжатия extended.md при Sleep
- [ ] Анализ паттернов: какие P-TZ реально читаются
- [ ] Рекомендации агенту что читать для текущей задачи

---

## Связанные документы

- **P40:** Project Management (создание проектов, задачи, CPM)
- **P57:** System Prompt Governance (правила обновления .cursorrules)
- **P58:** Hyperloop Projects API (DSL PROJECT.*)
- **P36:** Hyperloop DSL v1.1 (грамматика команд)
- **P16:** Memory Compaction (Sleep, архивация)

---

## Changelog

### v1.0 — 2025-10-22

- Создан документ P66
- Спроектирована 4-уровневая архитектура
- Определены форматы operational/extended логов
- Описаны DSL команды PROJECT.LOG.*
- Описаны API endpoints
- Определены Acceptance Criteria и метрики

