# Инструкция для нового Разработчика (среда Соул)

1) Вставьте в чат ЛЛМ‑Агента Курсор команду, полученную от Архитектора вида:
   CONNECT.NEW_DEV id="<TG_ID>" name="<FULL_NAME>" role="<ROLE_KEY>"
2) Последовательно отправьте 4 строки:
   - Название проекта
   - Каталоги с документацией
   - Индексы/реестры документации (если есть)
   - Каталоги с кодом проекта
3) Дождитесь автоматической проверки среды и онбординга (установка недостающих зависимостей при возможности). Если появятся ошибки — исправьте их согласно сообщениям.
4) По завершении вы получите краткую памятку и ссылки на проектные структуры и реестры.

## Правила доступа и работы
- Работайте только в своей проектной ветке и в рамках своей роли. Доступ к Ядру, КЛИ, Гиперлуп и системным промптам отсутствует.
- Все URL/порты/секреты — из БД через системные сервисы; не добавляйте жёсткие пути/секреты в код.
- Для изменений API/бизнес‑логики/коннекторов создавайте «Заявку на изменение» — вы получите обратную связь от Архитектора и статус выполнения.
- Документы и реестры синхронизируются с АПП‑сервером автоматически при вашей работе с документами.

## Единичная команда для ЛЛМ‑Агента (пример)
CONNECT.NEW_DEV id="468326902" name="Ivan Petrov" role="ext_frontend_dev"

## Быстрая выгрузка исходников/документов (после успешной проверки)
- На своей станции: выполните клиентский скрипт (Windows/PowerShell или Python):
  - Python (из корня репозитория):
    python .\Soul\scripts\dev_onboarding_client.py --project demo_project --docs-dirs docs,Soul --code-dirs backend,frontend --workdir .
  - Скрипт сформирует файл registry/onboarding_response.json и выведет готовые команды scp на основе адресов/путей из БД (без хардкода).

## Смоки (PowerShell) — Dev Access, инспекторы, GitHub App

1) Dev Access health (через REST и Hyperloop):
- REST:  python .\Soul\scripts\hyperloop_cli.py --http-get https://mini.soulpulse.art/api/admin/access/health
- DSL:   python .\Soul\scripts\hyperloop_cli.py --dsl INSPECTOR.RUN key=dev_access.health

2) Инспекторы (базовые):
- Canonical URLs:     python .\Soul\scripts\hyperloop_cli.py --dsl INSPECTOR.RUN key=guard.canonical.urls
- Planning enforce:   python .\Soul\scripts\hyperloop_cli.py --dsl INSPECTOR.RUN key=planning.enforce
- Run All (signature):python .\Soul\scripts\hyperloop_cli.py --dsl INSPECTOR.RUN_ALL scope=signature

3) GitHub App health и секреты (Key Master):
- Health:             python .\Soul\scripts\hyperloop_cli.py --github-health
- Установка секрета (b64): python .\Soul\scripts\hyperloop_cli.py --secrets-set-b64 --secret-key github.app.private_key --secret-b64 <BASE64>
- Установка секрета (JSON файл):  python .\Soul\scripts\hyperloop_cli.py --secrets-set-json --secrets-json-file secrets_payload.json

## Troubleshooting — GitHub App/PAT и запись секретов

- Проверяйте наличие ключей в БД: `github.app.id`, `github.installation.id`; приватный ключ — в `soul_secrets` с ключом `github.app.private_key`.
- Для PowerShell избегайте `-Body '{...}'`; используйте CLI макросы или `--post-json-file`.
- B64 путь предпочтителен для ключей/многострочных секретов.

## Bootstrap.ps1 — диагностика и логи

Минимальный шаблон:

```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
python .\Soul\scripts\hyperloop_cli.py --preflight
python .\Soul\scripts\hyperloop_cli.py --dsl INSPECTOR.RUN key=dev_access.health
```


