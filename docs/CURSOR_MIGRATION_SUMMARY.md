# Cursor → Soul Migration Summary

**Дата:** 2025-10-22 22:00 UTC  
**Ветка:** `p63-onboarding` (commit `1957540a5`)  
**Статус:** ⏳ Готова к применению (требуется доставка на сервер)

---

## ✅ Выполнено

### 1. Локальная подготовка
- [x] Создан файл миграции Alembic: `backend/alembic/versions/20251022_200000_cursor_history_tables.py`
- [x] Создан SQL fallback скрипт: `scripts/cursor_migration_manual.sql`
- [x] Revision ID: `20251022_200000`
- [x] Down revision: `20251020_999999_merge_all_heads_final`
- [x] Preflight инспекторы пройдены

### 2. Two-Keys процедура
- [x] Request создан: `106fa455-75aa-4236-acee-afd692198c37`
- [x] Request одобрен (Architect fast-track)
- [x] Operation: `migrations.apply`
- [x] Scope: `prod_db`

### 3. Git workflow
- [x] Commit: `feat: Add Cursor history tables migration (20251022_200000)`
- [x] Push в GitHub: `p63-onboarding` ветка
- [x] Commit hash: `1957540a5`

### 4. Структура миграции
Создаёт **6 таблиц**:

| Таблица | Назначение | Индексы |
|---------|------------|---------|
| `cursor_chat_messages` | Сообщения из чатов (bubbles) | bubble_id, created_at, workspace_hash |
| `cursor_composer_sessions` | Сессии Composer (Ctrl+K) | composer_id, workspace_hash |
| `cursor_checkpoints` | Снапшоты состояния | checkpoint_id, workspace_hash |
| `cursor_code_diffs` | Изменения кода | diff_key, workspace_hash |
| `cursor_request_contexts` | Контексты запросов | context_key, workspace_hash |
| `cursor_import_history` | Метаданные импортов | workspace_hash |

---

## ⏳ Требуется выполнить

### Блокер: Доставка файла на сервер

**Проблема:** SSH соединение зависает (таймаут при scp/ssh)

**Текущее состояние на сервере:**
- Alembic heads: `20251020_999999_merge_all_heads_final`
- Alembic current: `20251020_999999_merge_all_heads_final`
- Файл миграции отсутствует (автопулл не сработал)

**Варианты решения:**

#### Вариант 1: Git pull на сервере (рекомендуется)
```bash
ssh user@46.173.24.4
cd /var/www/soulpulse
git fetch origin
git checkout p63-onboarding  # или merge в текущую
git pull origin p63-onboarding

cd backend
source venv/bin/activate
alembic heads  # должно показать 20251022_200000
alembic upgrade head
alembic current  # проверка
```

#### Вариант 2: SQL скрипт напрямую (fallback)
```bash
ssh user@46.173.24.4
cd /var/www/soulpulse
psql -U miniapp_user -d soulpulse -f scripts/cursor_migration_manual.sql
```

#### Вариант 3: Через API (после доставки файла)
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --http-post https://mini.soulpulse.art/api/admin/agent/exec --post-json-file temp_upgrade_again.json
```

---

## 📋 Проверки после применения

```sql
-- 1. Проверить версию
SELECT version_num FROM alembic_version;
-- Ожидается: 20251022_200000

-- 2. Проверить таблицы
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'cursor_%'
ORDER BY tablename;
-- Ожидается: 6 таблиц

-- 3. Проверить размеры (должны быть пустые)
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'cursor_%'
ORDER BY tablename;
-- Ожидается: ~8-16 KB каждая (пустые таблицы)
```

```powershell
# Через Hyperloop CLI
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN_ALL"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=deploy.transfer_guard preflight_only=true"
```

---

## 📦 Артефакты

**Файлы:**
- `backend/alembic/versions/20251022_200000_cursor_history_tables.py` - миграция Alembic
- `scripts/cursor_migration_manual.sql` - SQL fallback
- `docs/CURSOR_MIGRATION_STATUS.md` - детальный статус
- `docs/CURSOR_MIGRATION_SUMMARY.md` - этот файл

**Git:**
- Branch: `p63-onboarding`
- Commit: `1957540a5`
- Remote: `https://github.com/vnedryayGH/soul.git`

**Two-Keys:**
- Request ID: `106fa455-75aa-4236-acee-afd692198c37`
- Status: Approved

---

## 🔧 Следующие шаги после применения

1. ⏳ **Доставить файл на сервер** (git pull или SQL)
2. ⏳ **Применить миграцию** (`alembic upgrade head`)
3. ⏳ **Запустить post-deploy инспекторы** (`INSPECTOR.RUN_ALL`)
4. ⏳ **Проверить планировщик импорта** (SoulCursorImportDaily, 23:50)
5. ⏳ **При наличии state.vscdb** - выполнить разовый импорт
6. ⏳ **Обновить документацию** (финальный статус)

---

## 🚨 Известные проблемы

1. **SSH таймаут:**
   - Симптом: `scp` и `ssh -T` зависают без вывода
   - Workaround: использовать альтернативный доступ к серверу или SQL fallback
   - TODO: Диагностика SSH ключа `deploy/ssh_keys/app_server_key`

2. **Автопулл не работает:**
   - Git push успешен, но файл не появился на сервере
   - TODO: Проверить webhook/cron для автопулла
   - TODO: Проверить какая ветка чекаутнута на сервере

---

**Создано:** Cursor Agent Automation System  
**Последнее обновление:** 2025-10-22 22:10 UTC  
**Проект:** d534d5a2-9ee8-4073-a2eb-568c27e1ccfb  
**Branch key:** CURSOR_SOUL_MIGR_20251022
