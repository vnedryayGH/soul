# P66 — Deployment Instructions

**Дата:** 2025-10-22  
**Цель:** Задеплоить P66 (Context Management) на APP сервер и запустить smoke test  
**Время:** ~15-20 минут  

---

## 📦 Что нужно задеплоить

### Новые файлы (4):
1. `backend/app/services/project_log_service.py` (486 строк)
2. `backend/app/routers/project_logs_admin.py` (305 строк)
3. `backend/app/alembic/versions/20251022_170000_p66_project_logs.py` (миграция)
4. `Soul/templates/project_operational_template.md` (шаблон)
5. `Soul/templates/project_extended_template.md` (шаблон)

### Изменённые файлы (2):
6. `backend/app/services/hyperloop_engine.py` — добавлены 6 DSL команд
7. `backend/app/main.py` — зарегистрирован роутер

---

## 🚀 Deployment Step-by-Step

### Шаг 1: Коммит и пуш изменений

```powershell
# На локальной машине (Windows)
cd E:\Soul\Telegram_Bot

# Проверить что изменено
git status

# Добавить все файлы
git add backend/app/services/project_log_service.py
git add backend/app/routers/project_logs_admin.py
git add backend/app/alembic/versions/20251022_170000_p66_project_logs.py
git add backend/app/services/hyperloop_engine.py
git add backend/app/main.py
git add Soul/templates/project_operational_template.md
git add Soul/templates/project_extended_template.md
git add docs/P66_*.md
git add .cursorrules.new

# Коммит
git commit -m "feat(P66): Context Management - DSL commands + API + auto-init

- Добавлен ProjectLogService для управления operational/extended логами
- Реализовано 6 DSL команд: PROJECT.LOG.{INIT,READ_OP,READ_EXT,UPDATE_OP,UPDATE_EXT,ROTATE}
- Добавлено 6 API endpoints: /api/admin/projects/:id/logs/*
- Auto-init логов при PROJECT.CREATE (best-effort)
- Миграция: добавлены поля log_operational_path, log_extended_path, log_last_rotated_at
- Оптимизирован .cursorrules (-54.9% токенов: 5029 -> 2266)
- Шаблоны для operational/extended логов

Closes #P66
Ref: Soul/P66_TZ_Project_Context_Management_and_Operational_Logs_v1_0.md"

# Пуш
git push origin main
```

---

### Шаг 2: Pull на APP сервере

```bash
# SSH на APP1 (можно на APP2, но лучше сначала на один)
ssh user@217.12.38.238

# Перейти в директорию проекта
cd /var/www/soulpulse

# Проверить текущую ветку
git branch

# Если не на main, переключиться
git checkout main

# Pull изменений
git pull origin main

# Проверить что файлы появились
ls -la backend/app/services/project_log_service.py
ls -la backend/app/routers/project_logs_admin.py
ls -la backend/app/alembic/versions/20251022_170000_p66_project_logs.py
ls -la Soul/templates/project_operational_template.md
```

---

### Шаг 3: Применить миграцию

```bash
# Активировать venv
cd backend
source venv/bin/activate

# Проверить текущую версию БД
alembic current

# Применить миграцию
alembic upgrade head

# Проверить что применилась
alembic current
# Ожидаем: 20251022_170000 (head)

# Проверить что поля добавлены
psql -U miniapp_user -d miniapp_db -c "\d projects" | grep log_

# Ожидаем:
# log_operational_path | text
# log_extended_path    | text
# log_last_rotated_at  | timestamp with time zone
```

---

### Шаг 4: Перезапустить backend

```bash
# Выйти из venv
deactivate

# Перезапустить service
sudo systemctl restart soulpulse-backend.service

# Проверить статус
sudo systemctl status soulpulse-backend.service
# Ожидаем: active (running)

# Проверить логи (последние 2 минуты)
sudo journalctl -u soulpulse-backend.service -f --since "2 minutes ago"

# Ожидаем:
# - Запуск успешный
# - Нет ошибок импорта project_log_service / project_logs_admin
# - Роутер project_logs_admin включён
```

---

### Шаг 5: Health Check

```bash
# Проверить что API работает
curl https://mini.soulpulse.art/api/health

# Ожидаем:
# {"status":"ok","version":"2.9","database":"healthy",...}
```

---

## 🧪 Smoke Test (после deployment)

### Test 1: Создать проект с auto-init

```powershell
# С локальной машины
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.CREATE name='P66_Smoke_Test' owner=468326902 methodology=agile description='P66 smoke test'"

# Сохранить project_id из ответа
# {"ok": true, "data": {"project_id": "<UUID>"}}

# Например:
$projectId = "0b3c04ea-a714-4982-aa52-225faef408bb"
```

### Test 2: Проверить auto-init логов

```powershell
# Прочитать operational log
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.READ_OP project_id=$projectId"

# ✅ ОЖИДАЕМ:
# {
#   "ok": true,
#   "data": {
#     "content": "# Оперативный лог: P66_Smoke_Test...",
#     "metadata": {
#       "size_lines": ~80,
#       "size_tokens": ~800,
#       "steps_count": 0,
#       "last_updated": "2025-10-22..."
#     }
#   }
# }
```

### Test 3: Добавить 10 шагов (проверка auto-trim)

```powershell
# Добавить 10 шагов подряд
for ($i=1; $i -le 10; $i++) {
    python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.UPDATE_OP project_id=$projectId step_title='Test Step $i' step_result='Completed successfully' files='test$i.txt'"
    Start-Sleep -Seconds 1
    Write-Host "Шаг $i добавлен"
}

# Прочитать operational log
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.READ_OP project_id=$projectId"

# ✅ ОЖИДАЕМ:
# metadata.steps_count = 5 (не 10!)
# content содержит только "### Шаг 6:" ... "### Шаг 10:"
# Auto-trim сработал! Старые шаги удалены.
```

### Test 4: Ротация логов

```powershell
# Ротация: перенести шаги в extended, очистить operational
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.ROTATE project_id=$projectId next_task='Phase 2: Extended testing'"

# ✅ ОЖИДАЕМ:
# {
#   "ok": true,
#   "data": {
#     "transferred_steps": 5,
#     "transferred_lines": ~40
#   }
# }

# Проверить operational (должен быть очищен)
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.READ_OP project_id=$projectId"

# ✅ ОЖИДАЕМ:
# metadata.steps_count = 0
# content содержит "(Шаги были перенесены в расширенный лог)"

# Проверить extended (должны быть все 5 шагов)
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.READ_EXT project_id=$projectId section=история"

# ✅ ОЖИДАЕМ:
# content содержит "### Шаг 6:" ... "### Шаг 10:"
# content содержит "Всего шагов перенесено: 5"
```

### Test 5: API Endpoints

```powershell
# Создать headers
$Headers = @{ 'X-Telegram-User-ID' = '468326902' }

# GET operational
$op = Invoke-RestMethod -Uri "https://mini.soulpulse.art/api/admin/projects/$projectId/logs/operational" -Headers $Headers
Write-Host "Operational size:" $op.metadata.size_lines "lines," $op.metadata.size_tokens "tokens"

# POST update operational
$Body = @{
    step_title = "API Test Step"
    step_result = "Success via REST API"
    files = @("api_test.txt")
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "https://mini.soulpulse.art/api/admin/projects/$projectId/logs/operational/update" -Method Post -Headers $Headers -ContentType "application/json" -Body $Body
Write-Host "Step added via API:" $result.ok

# GET extended
$ext = Invoke-RestMethod -Uri "https://mini.soulpulse.art/api/admin/projects/$projectId/logs/extended?section=история" -Headers $Headers
Write-Host "Extended history size:" $ext.metadata.size_lines "lines"
```

### Test 6: Проверить файлы на APP сервере

```bash
# SSH на APP сервер
ssh user@217.12.38.238

# Проверить что папка projects создана
ls -la /var/www/soulpulse/projects/

# Проверить логи конкретного проекта
ls -la /var/www/soulpulse/projects/p66_smoke_test/

# Ожидаем:
# operational.md
# extended.md

# Посмотреть содержимое operational
head -20 /var/www/soulpulse/projects/p66_smoke_test/operational.md

# Посмотреть размер файлов
du -h /var/www/soulpulse/projects/p66_smoke_test/
```

---

## ✅ Критерии успеха

| № | Тест | Ожидаемый результат | Статус |
|---|------|---------------------|--------|
| 1 | PROJECT.CREATE | Auto-init логов, paths в БД | ⬜ |
| 2 | PROJECT.LOG.READ_OP | Возврат operational с метаданными | ⬜ |
| 3 | PROJECT.LOG.UPDATE_OP × 10 | Auto-trim до 5 шагов | ⬜ |
| 4 | PROJECT.LOG.ROTATE | Перенос в extended, очистка operational | ⬜ |
| 5 | PROJECT.LOG.READ_EXT | Все 5 шагов в истории | ⬜ |
| 6 | API /logs/operational | REST API работает | ⬜ |
| 7 | Файлы на сервере | operational.md и extended.md существуют | ⬜ |

**Все 7 тестов должны пройти успешно!**

---

## 🎯 Финальный тест: Длинная сессия Cursor Agent

После успешного smoke test:

### 1. Активировать новый .cursorrules

```powershell
# Бэкап старого
Copy-Item .cursorrules .cursorrules.v2.2.3.backup

# Активировать новый (оптимизированный)
Move-Item .cursorrules.new .cursorrules
```

### 2. Открыть новый чат в Cursor

### 3. Загрузить operational log в контекст

```
Прочитай оперативный лог проекта:
python Soul/scripts/hyperloop_cli.py --dsl "PROJECT.LOG.READ_OP project_id=<UUID>"

Вставь результат здесь и продолжи работу над проектом.
```

### 4. Работать >50 сообщений

- Задавать вопросы
- Просить изменения
- Следить за размером контекста в Cursor

### 5. Проверка

**✅ УСПЕХ:** Нет `Connection failed`, сессия стабильна  
**❌ ПРОВАЛ:** Ошибки соединения, потеря контекста

---

## 🔴 Rollback (если что-то пошло не так)

### Откатить миграцию

```bash
cd /var/www/soulpulse/backend
source venv/bin/activate
alembic downgrade -1
deactivate
```

### Откатить код

```bash
cd /var/www/soulpulse
git log --oneline -5  # Найти предыдущий commit
git revert <commit_hash>
sudo systemctl restart soulpulse-backend.service
```

### Удалить созданные логи

```bash
rm -rf /var/www/soulpulse/projects/
```

---

## 📊 Ожидаемые метрики после deployment

| Метрика | До P66 | После P66 |
|---------|--------|-----------|
| Начальный контекст Cursor | 50-86K токенов | ~4K токенов |
| .cursorrules размер | 5,029 токенов | 2,266 токенов |
| Operational log | N/A | 50-150 строк |
| Auto-trim шагов | N/A | Только 5 последних |
| Длинные сессии | ❌ Crash >20 msg | ✅ Stable >50 msg |

---

## 📞 Контакты

**Вопросы:** Architect (TG: 468326902)  
**Документация:** `Soul/P66_TZ_*.md`, `docs/P66_*.md`  
**Код:** `backend/app/services/project_log_service.py`

---

## 🎉 После успешного deployment

1. ✅ Обновить `docs/SYSTEM_MASTER_DOCUMENTS_REGISTRY.md` (уже сделано)
2. ✅ Закрыть все связанные задачи в tracking system
3. ✅ Уведомить команду о новом workflow
4. ✅ Написать короткую инструкцию для агентов по использованию P66

**Ready to deploy!** 🚀

