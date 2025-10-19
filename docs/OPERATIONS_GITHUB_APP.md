# GitHub App — операции и здоровье

Назначение: консолидация админ-операций GitHub через единый CLI `scripts/github_admin.py` и backend-прокси. Секреты не хранятся локально; используются server-side handles.

Основные принципы
- Все вызовы к GitHub выполняются через бекенд `/api/admin/github/proxy_simple` и `/api/admin/github/health`.
- Базовые URL и ключи берутся из БД (`SoulSettingsService`/`SecretsService`). В коде инструментов URL не хардкодятся.
- Результаты команд — строгий JSON; дополнительно сохраняются в `out/github_admin_<ts>.json`.

Установка и требования
- Никаких отдельных токенов локально. Доступ обеспечивается сервером.
- Используйте переменные окружения для дефолтов (опционально): `HL_API_URL`, `HL_USER_ID`.

Проверки здоровья

```bash
python scripts/github_admin.py app:health
```

Если ответ 404 на PROD — развернуть свежий backend (подключён роутер `github_proxy`) на APP серверах и повторить.

Добавление коллаборатора (write)

```bash
python scripts/github_admin.py collab:add --owner Soul-Cursor --repo soul --username <gh_user> --permission push
```

Создание PR из форка/ветки

```bash
python scripts/github_admin.py pr:create --owner Soul-Cursor --repo soul --head <user:branch> --base develop --title "Sync" --body "Automated"
```

Squash merge PR

```bash
python scripts/github_admin.py pr:merge --owner Soul-Cursor --repo soul --number 123 --method squash --commit-title "Squash: Sync"
```

Статус чеков коммита

```bash
python scripts/github_admin.py checks:status --owner Soul-Cursor --repo soul --sha <commit_sha>
```

Перезапуск проверок

```bash
# Перезапустить все задания workflow run
python scripts/github_admin.py checks:rerun --owner Soul-Cursor --repo soul --run-id <run_id>

# Перезапустить только упавшие задания workflow run
python scripts/github_admin.py checks:rerun --owner Soul-Cursor --repo soul --run-id <run_id> --failed-only

# Пере-запросить check suite (GitHub App checks)
python scripts/github_admin.py checks:rerun --owner Soul-Cursor --repo soul --suite-id <suite_id>
```

Актуализация защиты веток (required contexts)
```bash
python scripts/github_admin.py protections:update \
  --owner Soul-Cursor \
  --repos soul,Slicer,SoulPulseSite \
  --branches develop,main \
  --contexts "ci/branch-name,ci / lint,ci / types,ci / tests,ci / coverage" \
  --strict --reviews 1
```

Обеспечение вебхука GitHub
- URL читается из `api.base_url` (из БД), конечная точка: `/webhook/github`.
```bash
python scripts/github_admin.py webhook:ensure --owner Soul-Cursor --repo soul --secret-handle bot.token.github_webhook --events push,pull_request
```

Обновление CODEOWNERS (через Contents API; ветка по умолчанию develop)

```bash
# Из файла
python scripts/github_admin.py codeowners:update \
  --owner Soul-Cursor --repo soul \
  --message "chore: update CODEOWNERS" \
  --file ./.github/CODEOWNERS

# Inline контент
python scripts/github_admin.py codeowners:update \
  --owner Soul-Cursor --repo soul \
  --message "chore: update CODEOWNERS" \
  --content "* @Soul-Cursor/core @Soul-Cursor/reviewers"
```

Smoke через Hyperloop CLI (дополнительно)

```bash
python Soul/scripts/hyperloop_cli.py --github-health
python Soul/scripts/hyperloop_cli.py --github-proxy --gh-method GET --gh-path /repos/Soul-Cursor/soul/collaborators --gh-dry
```

One‑Button: запись ключей/секретов GitHub App (без кавычечных ловушек)

```bash
# Settings (SoulSettingsService)
python Soul/scripts/hyperloop_cli.py --set-kv --kv-key github.app.id --kv-value 2124984
python Soul/scripts/hyperloop_cli.py --set-kv --kv-key github.installation.id --kv-value 90246951

# Secrets (SecretsService) — значение передавать в base64
# Пример: $pem_b64 = base64(PKCS8/PEM); $ssh_b64 = base64(SSH private key)
python Soul/scripts/hyperloop_cli.py --secrets-set-b64 --secret-key github.app.private_key --secret-b64 <pem_b64>
python Soul/scripts/hyperloop_cli.py --secrets-set-b64 --secret-key ssh.private_key.default.b64 --secret-b64 <ssh_b64>

# Проверка доступности Dev Access (после деплоя на APP)
curl -H "X-Telegram-User-ID: 468326902" http://127.0.0.1:8000/api/admin/access/health
```

Политики безопасности
- Не логировать значения секретов и PII; только статусы API.
- Все изменения защиты веток и прав должны быть воспроизводимы через команды выше.


