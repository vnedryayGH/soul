# P62 — JD.BOOTSTRAP Runbook (dry_run → apply → rollback)

Версия: v1.0

## 1) Назначение
- Безопасное выполнение bootstrap‑пакетов JD для 10+ ролей/процессов: dry_run проверка, apply с Two‑Keys, rollback при сбое.

## 2) Предпосылки
- ТЗ и контракты актуальны (P62/P63/P65/P66/P67).
- Персоны созданы/обновлены: заполнены `persona_id` (UUID) или настроен mapping `de_id→persona_id`.
- Настроены Two‑Keys для риск‑операций (FLAGS/секреты/финансы).

## 3) Формат JD.BOOTSTRAP
- Поля: roles, processes, routines, schedules, rbac/rasi, flags, with_trace, idempotency_key.
- Без хардкодов URL/секретов.

## 4) Выполнение через Hyperloop CLI
- Dry run:
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --dsl "JD.BOOTSTRAP DRY_RUN with_trace=true idempotency_key=jd_202511"
```
- Apply (после Two‑Keys):
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --dsl "TWO_KEYS.REQUEST operation='jd.bootstrap.apply' scope='dev' reason='Apply JD'"
# После approve получить request_id
python tools/catalog/active/utils/hyperloop_cli.py --dsl "JD.BOOTSTRAP APPLY idempotency_key=jd_202511 request_id=<request_id>"
```
- Rollback (если требуется):
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --dsl "JD.BOOTSTRAP ROLLBACK idempotency_key=jd_202511"
```

## 5) Транспорт и стабильность
- Предпочтительно: Signed (`/api/hyperloop/execute-signed`). Если недоступен — fallback на `/api/admin/agent/exec` с Strict JSON из файла.
- При 504/timeout: уменьшить пакет/запустить батчами; проверить proxy/NO_PROXY/timeout; убедиться, что health OK, очередь не перегружена.

## 6) Acceptance
- Dry run проходит без ошибок; apply выполнился (идемпотентно), audit/подписи сохранены.
- Операционный лог пополнен; FLAGS обновлены.

## 7) Troubleshooting
- 504/timeout: проверка сетей, прокси, signed‑канала, разделение на партии.
- UUID/валидация: заполнить `persona_id`/mapping; повторить dry_run.
- Two‑Keys: получить/подставить корректный `request_id`.
