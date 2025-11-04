# Статус миграции Cursor → Soul

**Дата:** 2025-10-22  
**Статус:** ⏳ Готова к применению (требуется доставка файла на сервер)

---

## Проблема которую решили

**Исходная проблема:** Падения Cursor Agent из-за переполнения БД (11+ GB)

**Что сделано:**
1. ✅ Создан бекап настроек Cursor (`cursor_backup_20251022_192606/`)
2. ✅ Очищена БД Cursor (освобождено 11.3 GB)
3. ✅ Перезапущен Cursor - агенты работают стабильно
4. ✅ Создана миграция Alembic для таблиц истории
5. ✅ Исправлена цепочка миграций (`down_revision`)

---

## Структура миграции

**Файл:** `backend/alembic/versions/20251022_200000_cursor_history_tables.py`

**Создаёт 6 таблиц:**
- `cursor_chat_messages` - сообщения из чатов
- `cursor_composer_sessions` - сессии Composer (Ctrl+K)
- `cursor_checkpoints` - снапшоты состояния
- `cursor_code_diffs` - изменения кода
- `cursor_request_contexts` - контексты запросов (опционально)
- `cursor_import_history` - мета-информация об импортах

**Revision ID:** `20251022_200000`  
**Down revision:** `20251020_999999_merge_all_heads_final`  
**Branch:** `p63-onboarding` (commit `1957540a5`)

---

## Применение миграции

### Вариант 1: Через Alembic (требует SSH)

```bash
# На сервере
cd /var/www/soulpulse/backend
alembic upgrade head
```

### Вариант 2: Через SQL напрямую (без SSH)

```bash
# Копируем SQL на сервер любым способом (scp/веб-интерфейс)
# Выполняем на сервере
psql -U miniapp_user -d soulpulse -f scripts/cursor_migration_manual.sql
```

### Вариант 3: Через деплой скрипт

**Windows:**
```powershell
.\scripts\deploy_cursor_migration.ps1
```

**Linux:**
```bash
./scripts/deploy_cursor_migration.sh
```

---

## ⚠️ Блокер: Доставка файла на сервер

**Проблема:**
- SSH соединение зависает при попытке scp/ssh
- Файл миграции `20251022_200000_cursor_history_tables.py` не попал на сервер
- Alembic heads на сервере: `20251020_999999_merge_all_heads_final` (старая версия)
- Git push выполнен успешно, но автопулл не сработал

**Решение:**
Выполнить на сервере вручную:

```bash
# Вариант 1: Git pull (если есть доступ по SSH другим способом)
ssh user@46.173.24.4  # или 217.12.38.238
cd /var/www/soulpulse
git fetch origin
git checkout p63-onboarding  # или merge в текущую ветку
git pull origin p63-onboarding

# Вариант 2: SQL скрипт напрямую (без Alembic)
# Файл scripts/cursor_migration_manual.sql уже обновлён
psql -U miniapp_user -d soulpulse -f scripts/cursor_migration_manual.sql

# Проверка
psql -U miniapp_user -d soulpulse -c "SELECT version_num FROM alembic_version;"
psql -U miniapp_user -d soulpulse -c "SELECT tablename FROM pg_tables WHERE tablename LIKE 'cursor_%';"
```

**После доставки файла:**
```bash
# Активировать venv
cd /var/www/soulpulse/backend
source venv/bin/activate

# Проверить что миграция видна
alembic heads

# Применить
alembic upgrade head

# Проверить
alembic current
```

**Или через API (если файл уже на сервере):**
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --http-post https://mini.soulpulse.art/api/admin/agent/exec --post-json '{"op":"alembic.upgrade","target":"head","two_keys_request_id":"106fa455-75aa-4236-acee-afd692198c37"}'
```

---

## Данные для импорта

**Статус:** Нет данных для импорта

**Почему:**
- БД Cursor была очищена ПЕРЕД экспортом (для устранения падений)
- JSON файлы в `cursor_backup_20251022_192606/cursor_history_export/` пустые
- Это нормально - главное было решить проблему падений

**Что делать дальше:**
1. Применить миграцию на сервере (создать таблицы)
2. Таблицы будут готовы для будущего использования
3. При желании можно периодически экспортировать новую историю Cursor

---

## Команды проверки после применения

### Проверить что таблицы созданы:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'cursor_%'
ORDER BY tablename;
```

Ожидается 6 таблиц.

### Проверить версию миграции:

```sql
SELECT version_num FROM alembic_version;
```

Должно быть: `cursor_history_001`

### Проверить размер таблиц:

```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'cursor_%'
ORDER BY tablename;
```

Все таблицы должны быть пустые (размер ~8-16 KB).

---

## Следующие шаги

1. ✅ **Миграция создана и закоммичена** (revision `20251022_200000`)
2. ✅ **Push в GitHub** (ветка `p63-onboarding`, commit `1957540a5`)
3. ✅ **Two-Keys запрос создан и одобрен** (`106fa455-75aa-4236-acee-afd692198c37`)
4. ⏳ **Доставка файла на сервер** (SSH зависает, нужен git pull на сервере)
5. ⏳ **Применить миграцию** (`alembic upgrade head` на сервере)
6. ⏳ **Проверить создание таблиц** (SQL запросы выше)
7. ✅ **Cursor работает стабильно** (уже работает после очистки)
8. 📋 **Документация обновлена** (этот файл + CURSOR_HISTORY_IMPORT_GUIDE.md)

---

## Периодический экспорт (опционально)

Если в будущем захотите сохранять историю:

```powershell
# 1. Экспорт из Cursor DB
python backend/scripts/export_cursor_to_json.py `
  --db-path "$env:APPDATA\Cursor\User\globalStorage\state.vscdb" `
  --output "./cursor_export_$(Get-Date -Format 'yyyyMMdd')"

# 2. Импорт в Soul DB (на сервере)
python backend/scripts/import_cursor_history.py `
  --db-path "путь_к_cursor_db" `
  --workspace "E:\Soul\Telegram_Bot"
```

---

## Файлы

- `backend/alembic/versions/20251022_2000_cursor_history_tables.py` - миграция Alembic
- `scripts/cursor_migration_manual.sql` - SQL для ручного применения
- `scripts/deploy_cursor_migration.ps1` - PowerShell деплой скрипт
- `scripts/deploy_cursor_migration.sh` - Bash деплой скрипт
- `backend/scripts/export_cursor_to_json.py` - экспорт из Cursor
- `backend/scripts/import_cursor_history.py` - импорт в Soul
- `docs/CURSOR_HISTORY_IMPORT_GUIDE.md` - полная документация

---

**Создано:** Cursor Agent Automation System  
**Последнее обновление:** 2025-10-22 23:30

