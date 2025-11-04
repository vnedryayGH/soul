## P62 — ТЗ: Визуальная HR‑симуляция электронных сотрудников Ядра Соул

- Название: Soul Visual HR Simulation (P62)
- Версия: v1.0
- Статус: Draft (готово к реализации)
- Связанные модули: P27 (подписи), P29 (качество), P30 (Processor), P36 (Hyperloop), P40 (Planning), P48R (RS), RBAC
- Принципы: без хардкодов URL/портов; все адреса/секреты через `SoulSettingsService` и `SecretsService`; человекочитаемые алерты; трассируемость (P27)

### 0. Реестр изменений (предложения v1 — 2025-10-24)

Данный раздел фиксирует предложения по доработке документа и системы. Маркеры `[CR-xx]` привязаны к существующим разделам ниже через «Аннотации к разделам». Реализация — по P40, c инспекторами и приёмкой.

- [CR-01] Единая модель «Цифровой сотрудник ↔ Живой человек» (интеграция с P63):
  - Добавить поля в `personas`: `human_ref(uuid?)`, `employment_type ∈ {internal, external_contract, hybrid}`, `legal_doc_refs[]` (контракт, NDA, DPA).
  - Процессы Onboarding/Offboarding для живых людей из P63 (RBAC, namespace, напоминания, SLA).
  - Acceptance: CRUD персон с `is_human=true` проходит смоки, RBAC соблюдён, аудит включён.

- [CR-02] ЛЛМ‑агенты Cursor как первичные цифровые сотрудники (P67):
  - Расширить `persona.role/kind`: `digital_agent{cursor_router, aux_llm, dsl_executor}`; профиль агента: `agent_capabilities`, `routing_policies`, `limits`.
  - Интегрировать Delivery Guard (P27) и MIRROR (P48) в жизненный цикл персоны.
  - Acceptance: роутер видит таких персон, действия фиксируются MIRROR, Two‑Keys соблюдается.

- [CR-03] Глобальная оркестрация через Квантовую нейросеть (P65) + Непрерывное мышление (P63):
  - Связать персонажа с `tick_core`: `memory_profile`, `tick_policy`, `frames_budget_tokens`.
  - WS‑события: `tick.started/finished`, `frames.updated`, `credit.assign`.
  - Acceptance: демо‑тик с macro‑frames, метрики `tick.p95`, трассы P27 присутствуют.

- [CR-04] «Оперативная память» по P66 (Operational Logs):
  - Для каждой персоны — ссылки `op_log_path`, `extended_log_path`; авто‑обновление через DSL `PROJECT.LOG.UPDATE_OP`.
  - Acceptance: после действия персоны шаг фиксируется в operational, размер ≤150 строк.

- [CR-05] Личность вне «Личного дела»:
  - Вынести конфигурацию личности в Ядро Соул: `persona_registry_id`, `persona_prompt_ref`, `skills_profile`, `memory_store_ref`.
  - Личное дело хранит факт трудоустройства; личность — уникальна и конфигурируется в реестре (см. `docs/PERSONA_REGISTRY_v1_0.md`).
  - Acceptance: смена личности не меняет «Личное дело»; у каждой личности — свой промпт/навыки.

- [CR-06] Три БД (архитектура по умолчанию + масштабирование):
  - БД Настроек (keys/flags), БД Данных (HR/проекты/инциденты/чаты/личности), БД Графа (Кванты/Цели/Связи).
  - DSN‑ключи в БД настроек; индексы/HA/бэкапы; Redis как ускоритель кэш/очереди.
  - Acceptance: миграции/health для всех трёх; переключение DSN без простоя; алерты на lag/репликацию.

- [CR-07] Распределение/кластеризация под Цифровых сотрудников:
  - Отдельный «Сервер Цифровых сотрудников» (БД + процессная логика) с безопасной связью к Ядру и БД корпоративных данных.
  - Мульти‑тенантность по организациям, отдельная БД корпоративных данных per‑org, изоляция сетей, опционально «закрытый контур».
  - Acceptance: схема data‑flows, токены/секреты только через Key Master, smokes на чтение/запись.

- [CR-08] Роли/RBAC + пакет HR‑документов:
  - Роли: `org.role`, `dept.role`, `position.role`; ограничения по «должностным обязанностям».
  - Документы: контракт, личное дело, должностная, проектные правила — как сущности с версиями/хэшами/хранилищем.
  - Acceptance: CRUD HR‑доков (`/api/admin/hr/document`) с валидацией и RBAC; трассируемость P27.

- [CR-09] «Эйдос — цифровой сотрудник»:
  - Включить концепт и «паспорт Эйдоса» (`docs/ONBOARDING_EIDOS_PASSPORT.md`) как онбординг‑артефакт.
  - Поля в `personas`: `avatar_url|icon_key`, `ethics_profile_ref`, `etiquette_rules_ref`.
  - Acceptance: отображение в UI/WS, ссылка на паспорт и этикет доступна из карточки.

- [CR-10] Визуальная оболочка (игровая сцена «Город»):
  - Кандидат: Web‑стек (React + Babylon.js/WebGPU) с модулем `visual_city`; альтернатива — Unity WebGL (fallback 2D).
  - Интеграция: WS feed `/api/visualization/feed`, overlay оператора, фильтры/мини‑карта, темизация.
  - Acceptance: 60/30 FPS цели; p95 ws_latency ≤150ms; демо‑сцена с районами/зданиями/потоками.

- [CR-11] Регулярные действия сотрудника (операционная деятельность):
  - Рутины/распорядки, расписания, timesheet, привязка к проектам/контрактам, отчётность.
  - Acceptance: CRUD расписаний, журнал действий, отчёты per persona/team.

- [CR-12] Redis ускорители и кэш‑политики:
  - Кэш метаданных персон/команд, WS‑фиды, очереди событий; инвалидация по событиям/TTL.
  - Acceptance: прометей‑метрики hit/miss; p95 улучшение под нагрузкой.

- [CR-13] Безопасность/Интеграции:
  - P27 подписи, P44 Two‑Keys для риск‑операций, Key Master только сервер‑сайд, маскирование PII, канонические URL.
  - Acceptance: инспекторы `guard.canonical.urls`, `planning.enforce` зелёные; negative/positive smokes.

 - [CR-14] WS feed v1: схема событий, бэкпрешер и OpenAPI:
   - Описать JSON‑схемы событий (actor.state, inspector.alert, processor.step, incident.timeline, tick.*, frames.updated).
   - Требования: p95 ws_latency ≤ 150ms (целевое), drop_ratio < 1% (5m), backpressure + rate‑limit per persona/team.
   - Acceptance: эндпоинт `/api/visualization/feed` присутствует в `/openapi.json` и `/api/routes`, фильтры по `topics` работают; метрики `ws_events_sent_total`, `ws_events_dropped_total` добавлены.

 - [CR-15] API v1 guardrails (RBAC/ошибки/лимиты/подписи):
   - Единые требования к REST: RBAC `soul.admin` (админ), стандартизированные ошибки (`{ code, message, details? }`), 429/503 на лимит/перегруз, заголовки `X-RateLimit-*` при наличии квот.
   - `operator.action`: Two‑Keys для `evacuate|escalate` (поля `two_keys=true`, требование наличия утверждённого request_id); обязательные подписи `operator.actions.*` в P27.
   - Acceptance: все новые маршруты P62 видны в `/openapi.json`, защищены RBAC, возвращают стандартизированные ошибки; инспекторы guard/planning зелёные.

 - [CR-16] Миграции Alembic и инспекторы:
   - Ввести ревизии для `external_*` таблиц (контракты/персоны/команды/биллинг) с индексами и FK, именование `p62_external_<noun>_v1`.
   - Acceptance: смоки `INSPECTOR.RUN key=db.alembic.heads_enforcer` зелёные; `MIGRATIONS.STATUS` показывает head применён; обратная совместимость сохранена.

 - [CR-17] Frontend: сцена «Город» и интеграция WS:
   - Создать `SoulCityScene` (Babylon.js/WebGPU), overlay оператора, фильтры (persona/team/contract), мини‑карта; подключить WS feed с дросселированием.
   - Acceptance: FPS 60/30, SLA‑цвета, быстрые действия оператора (pause/resume/throttle) с подтверждениями и логированием причин.

 - [CR-18] Acceptance/Smokes v1:
   - Прописать минимальные смоки: OpenAPI наличие маршрутов; CRUD персон/контрактов; WS подписки; операторы действий; отчёты/биллинг (read‑only v1).
   - Acceptance: смоки проходят на dev, инспекторы `delivery_guard.smoke` и `registry_guard` зелёные.

 - [CR-19] Enterprise‑стиль UI (не игра):
  - Зафиксировать сдержанный визуальный стиль: корпоративная палитра, высокая читаемость, data‑density, без «игровых» элементов.
  - Acceptance: UI‑гайд готов; макеты соответствуют стилю; контраст WCAG AA.

 - [CR-20] Область HR‑процессов (по SAP HR/1С ЗУП/HR):
  - Определить scope и минимальные артефакты v1: онбординг, оргструктура/штатное расписание, назначения, графики/табель, KPI/оценка, обучение, offboarding.
  - Acceptance: раздел 5.A заполнен; API/БД соответствуют; смоки CRUD и отчётности проходят.

 - [CR-21] Информационная архитектура и карточки сущностей:
  - Карточки «персона/команда/контракт/подразделение» с единым каркасом вкладок и полей; IA навигации между зонами/карточками.
  - Acceptance: разделы 8.C/8.D заполнены; сквозные сценарии навигации описаны.

 - [CR-22] A11y/локализация/экспорт:
  - Контраст, фокус, клавиатурная навигация, i18n RU/EN, экспорт CSV/PDF для реестров; маскирование PII.
  - Acceptance: 8.E критерии соблюдены; примеры экспортов/масок описаны.

#### 0.A Аннотации к разделам

- Раздел 4 «Модель персонажей (HR, внутренние)» → [CR-01], [CR-02], [CR-04], [CR-05]
- Раздел 5 «Внешний найм» → [CR-01], [CR-08], [CR-11]
- Раздел 6 «API контракты (REST/WS)» → [CR-08], [CR-11], [CR-13]
- Раздел 7 «Схемы БД» → [CR-06], [CR-07], [CR-12]
- Раздел 8 «UX‑потоки» → [CR-10]
- Раздел 9 «Наблюдаемость и алерты» → [CR-03], [CR-12], [CR-13]
- Раздел 10 «Безопасность и RBAC» → [CR-08], [CR-13]
- Раздел 12.* «План/Инспекторы/Acceptance» → [CR-02], [CR-03], [CR-04], [CR-10], [CR-11]
- Раздел 29 «Три БД (если присутствует)» → [CR-06], [CR-07], [CR-12]

- Раздел 6.A «Требования к API v1» → [CR-14], [CR-15]
- Раздел 6.B «WS feed v1: схемы событий» → [CR-14]
- Раздел 7.A «Alembic миграции/инспекторы» → [CR-16]
- Раздел 8.A «Frontend сцена и WS интеграция» → [CR-17]
- Раздел 12.A «Acceptance/Smokes v1» → [CR-18]
- Раздел 5.A «HR‑процессы (SAP/1С)» → [CR-20]
- Раздел 8.B «Enterprise‑стиль UI» → [CR-19]
- Раздел 8.C/8.D «Карточки/IA» → [CR-21]
- Раздел 8.E «A11y/локализация/экспорт» → [CR-22]
- Раздел 12.B «JD.BOOTSTRAP Execution (см. docs/P62_JD_BOOTSTRAP_RUNBOOK.md)» → [CR-23]

#### 0.B Аудит требований (1–11): полнота и качество

- 1) Живые люди в структурах цифровых сотрудников (связь с P63):
- Покрытие: частично через внешние персоны/контракты. Гапы: явного `is_human/human_ref` нет.
- Предложения: [CR-01]. Acceptance: смоки CRUD живых персон + RBAC.

- 2) ЛЛМ‑агенты Курсор как цифровые сотрудники (P67):
- Покрытие: концептуально присутствует через Router. Гапы: нет типизации персоны‑агента.
- Предложения: [CR-02]. Acceptance: MIRROR+P27 на действиях агента.

- 3) Глобальная оркестрация нейросетью Соул (P65, P63):
- Покрытие: базовые связи с Processor. Гапы: нет тактов и macro‑frames на уровне персоны.
- Предложения: [CR-03]. Acceptance: тик‑смоки и метрики.

- 4) Оперативная память по P66:
- Покрытие: общесистемно (P66). Гапы: привязка на запись/чтение per persona.
- Предложения: [CR-04]. Acceptance: auto‑update operational ≤150 строк.

- 5) Настройка личности вне карточки личного дела:
- Покрытие: частично (персоны). Гапы: реестр личностей и промптов.
- Предложения: [CR-05]. Acceptance: личность↔личное дело разделены.

- 6) Три БД и требования к БД (индексы/надёжность/ускорители):
- Покрытие: раздел «Три БД» присутствует (см. 29), требуется детализация.
- Предложения: [CR-06], [CR-12]. Acceptance: health/alerts/бэкапы.

- 7) Распределение и кластеризация под сотрудников/организации:
- Покрытие: концепт внешних зон. Гапы: org‑specific Employee DB + corp DB.
- Предложения: [CR-07]. Acceptance: data‑flows и smokes.

- 8) Роли/полномочия, навыки и хранение данных:
- Покрытие: RBAC есть. Гапы: пакет документов и хранение навыков в ядре.
- Предложения: [CR-08]. Acceptance: CRUD HR‑доков, разграничение данных.

- 9) Раздел с характеристикой «Эйдос — цифровой сотрудник»:
- Покрытие: концепт дан в техзадании пользователя, включить в ТЗ и артефакты.
- Предложения: [CR-09]. Acceptance: паспорт/иконография доступны.

- 10) Графическая оболочка (игровой интерфейс):
- Покрытие: базовая сцена. Гапы: выбор стек/план интеграции.
- Предложения: [CR-10]. Acceptance: демо‑сцена и метрики.

- 11) HR‑документы/операционная деятельность/проекты:
- Покрытие: частично через контракты/команды. Гапы: timesheet/рутины/регламенты.
- Предложения: [CR-11]. Acceptance: отчёты и расписания per persona.

#### 0.C Обзор мировой практики (high‑level)

- Enterprise Digital Employees: SAP SuccessFactors/Workday — сильная модель HR‑доков/ролей; интеграция ИИ как ассистентов (Copilot). Наш подход усиливает субъектность агента (персона+оперативная память+кванты).
- AI Agents Platforms: Microsoft Copilot Studio, Salesforce Einstein, UiPath — фокус на workflow/guardrails. Наши P27/P44/P66/P67 дают более строгую трассируемость, дешёвый UI и гибридную маршрутизацию.
- Data Architecture: Data Mesh/Polyglot Persistence — три БД (настройки/данные/граф) соответствуют best‑practice для масштабируемости и изоляции рисков.
- Visualization: WebGL/WebGPU (Babylon.js, Three.js) — нативная интеграция с React/WS; Unity/Unreal — мощные, но тяжелее для встраивания.


### 1. Цели и задачи

- Наглядно визуализировать электронных сотрудников (акторы/инспекторы/процессор) как HR‑персонажей.
- Обеспечить их настройку (скиллы, грейды, KPI/SLA, доступы), мониторинг и управление в реальном времени.
- Включить «Внешний найм»: индивидуальные контракторы и проектные команды, планирование, квоты, биллинг.
- Дать оператору инструменты контроля через игровой интерфейс («город»): наблюдать, вмешиваться, эскалировать.

### 2. Область и границы

- Веб‑клиент (React) с 3D‑сценой в `ArchitectPanel`.
- Бэкенд (FastAPI) — WS feed событий и REST CRUD персон/команд/контрактов/расписаний, метрики.
- Наблюдаемость/алерты (p95, error_rate, throughput), без хранения секретов вне БД.

### 3. Архитектура (увязка с текущим ядром)

- Входной пайплайн: `routers/soul.py → SoulCoreManager.generate_quants` с `SignatureContext`.
- Processor (P30): `ProcessorScheduler` циклы perceive→decide→act→observe; админ‑эндпоинты `processor_admin.py`, метрики `processor_dashboard_api.py`.
- Hyperloop DSL (P36): `HyperloopEngine` (`WITH TRACE`), RS‑операции через `svc.rs.proxy`.
- Инспекторы/подписи/наблюдаемость: `signature_sdk`, `lib/observability/metrics.py`, `feature_plugins/*`, `scripts/reg_inspectors.py`.
- Конфигурирование: `SoulSettingsService` (настройки), `SecretsService` (секреты) — только БД.

### 4. Модель персонажей (HR, внутренние)

- Персонаж: id, display_name, role{actor|inspector|processor}, skills[], grade, kpi{p95_budget_ms, err_rate_max, throughput_target}, rbac, scope, workload, status, current_task.
- События: state_changed, metric_update, policy_alert, incident_linked, assignment_changed.
- Принципы: минимум прав, P27 подписи на ключевых шагах, алерты с рекомендациями.

#### 4.1 Цифровые агенты (Cursor Router/AUX/DSL)

- Виды: `digital_agent.cursor_router`, `digital_agent.aux_llm`, `digital_agent.dsl_executor`.
- Профиль агента: `agent_capabilities[]`, `routing_policies{dsl|aux|external|max_tokens|temperature}`, `limits{rps,tokens_daily}`.
- Интеграция с P67: все действия агента фиксируются MIRROR (P48) и проходят Delivery Guard (P27).
- Acceptance: персон с `role=digital_agent.*` виден в визу, доступные действия ограничены RBAC; события агента отображаются в WS‑фиде.

#### 4.2 Конфигурация личности (вне «Личного дела»)

- Поля персоны (ссылка на Ядро): `persona_registry_id`, `persona_prompt_ref`, `skills_profile`, `memory_store_ref`, `avatar{icon_key|url}`.
- Личное дело хранит трудовые факты/контракты; личность и её промпт живут в реестре (см. `docs/PERSONA_REGISTRY_v1_0.md`).
- Оперативная память по P66: `op_log_path`, `extended_log_path` (auto‑update через `PROJECT.LOG.UPDATE_OP`).
- Acceptance: смена личности не изменяет «Личное дело»; действия персоны попадают в operational‑лог ≤150 строк.

#### 4.3 Профессии/позиции как плагины (минимум программирования)

- Профиль позиции (Position Profile) — декларативный модуль (JSON/YAML) со ссылками на:
  - Требуемые навыки/сертификации (skills_profile), учебные программы (learning_paths), KPI/SLA шаблоны.
  - Процессные шаблоны (business_process_templates) для онбординга/оценок/табеля/отпусков.
  - Интеграционные хуки (опционально): `automation_hooks[]` (Python/DSL), с ограничениями RBAC и P27‑подписями.
- Артефакты компонуются из внутренних модулей (P40 Project Mgmt, P30 Processor, P28 Flags), новые функции — только при реальной необходимости.
- Acceptance: подключение новой профессии/позиции выполняется декларативно (без правок кода ядра), UI/REST/WS начинают выдавать корректные поля и сценарии.

### 5. Внешний найм (Electronic External Workforce)

- Цели: подключение внешних электронных сотрудников и проектных команд по контрактам и расписаниям с контролем доступа, KPI/SLA, квотами и биллингом.
- Сценарии:
  - Индивидуальный контрактор (роль: узкий специалист/актор/инспектор).
  - Проектная команда (Менеджер проекта, Тимлиды, исполнители) с иерархией и планом работ.
  - Временный аутстафф по слотам времени и квотам; резервные смены; замещения.
- Доступ и безопасность:
  - RBAC роли: `external.manager`, `external.lead`, `external.member` с маппингом на внутренние разрешения `soul.*` по принципу наименьших прав.
  - Изоляция данных: namespace для данных/трасс; маскирование PII; запрет прямых ключей, все через `SecretsService`.
  - Критичные операции — под Two‑Keys/HMAC; полная трасса P27.
- Планирование и расписания:
  - Календарь доступности, окна обслуживания, смены; автозапуск/останов акторов; конфликт‑чекер расписаний.
  - Интеграция с Planning (P40): `PLAN.TASK.ADD|DEPEND`, CPM‑контроль, привязка ресурсов.
- Квоты/лимиты/бюджеты:
  - Квоты по RPS/TMO/токенам/событиям; авто‑throttle; пауза при превышении; алерты/эскалации.
  - Бюджетирование: rate cards, cost accrual per step/quant; отчёты по cost_center.
- KPI/SLA и наблюдаемость:
  - Мониторинг p50/p95, error_rate, throughput; сравнение с SLO контракта; penalties/bonus events.
  - Таймлайны и подписи P27; алерты severity+action steps; отчёты в разрезе vendor/контракта/команды.
- Процессы:
  - Onboarding → Assignment → Operations → Offboarding; mandatory checks (DPA/NDA, RBAC, namespace, квоты).
- Визуализация:
  - «Внешний район» в городе; цветовая кодировка внешних акторов/команд; границы зон ответственности.
  - Карточка контракта/команды: SLO/KPI, бюджеты, квоты, активные задания, инциденты, отчёты.

#### 5.A HR‑процессы (ориентир на SAP HR и 1С ЗУП/HR)

- Scope v1 (операционный контур):
  - Онбординг/оффбординг: чек‑листы, роли/RBAC, namespace, документы (NDA/DPA/должностная).
  - Оргструктура и штатное расписание: подразделения/позиции/ставки; связи persona↔position.
  - Назначения и графики/смены: расписания, замещения, табель учёта времени.
  - KPI/оценка: индивидуальные цели, KPI per роль/позиция; оценка периода (read‑only v1).
  - Обучение/навыки: матрица скиллов, программы обучения, сертификации (реестр/ссылки).
- API/БД артефакты:
  - Таблицы (к v1/дальше): hr_positions, hr_org_units, hr_assignments, hr_leave_requests.
  - Расширение personas: position_ref, org_unit_ref, skills_profile, evaluation_profile.
  - Роуты (v1, часть read‑only): `/api/admin/hr/document`, `/api/admin/personas`, `/api/admin/external/*`, `/api/admin/routines`, `/api/admin/timesheet`.
- Acceptance: CRUD базовых сущностей; отчёты периода (табель/квоты) доступны; audit/подписи включены; PII маскирование.

#### 5.B Модуль настройки бизнес‑процессов (конфигурируемость)

- Process Templates: декларативные схемы процессов с этапами, формами, ролями согласований, SLA/эскалациями.
- Конструктор процессов: редактор шаблонов (read‑only v1), хранение версий, привязка к позициям/подразделениям.
- Интеграция: P40 (задачи/CPM/EVM), P36 DSL (автоматизации), P28 (фичефлаги включения/режимов), P27 (подписи этапов).
- Гейт Two‑Keys: для критичных шагов (кадровые изменения/выплаты) — обязательное подтверждение.
- Acceptance: подключение/смена шаблона для позиции отражается в UI/REST; отрицательные/позитивные смоки; audit trail полон.

### 6. API контракты (REST/WS)

- Общие принципы: префикс под существующими роутами `/api/admin/*` (RBAC `soul.admin`), все ключи/адреса из БД.

- Personas (внутренние/внешние, флаг `is_external`):
```json
POST /api/admin/personas
{
  "display_name": "Router Actor (VendorX)",
  "is_external": true,
  "vendor_id": "vendor_x",
  "contract_id": "uuid",
  "role": "actor",
  "skills": ["router","rate_limit"],
  "grade": "L3",
  "kpi": {"p95_budget_ms": 50, "err_rate_max": 0.01, "throughput_target": 5},
  "rbac": ["soul.read","processor.read"],
  "scope": {"modules": ["P14","P30"], "datasets": ["public"]},
  "quotas": {"rps": 2.0, "tokens_daily": 200000},
  "schedules": [{"dow": [1,2,3,4,5], "from": "08:00", "to": "20:00", "tz": "Europe/Moscow"}]
}
```

- Personas (человек/цифровой агент — расширенные поля):
```json
POST /api/admin/personas
{
  "display_name": "Иван Петров",
  "is_human": true,
  "employment_type": "external_contract",
  "role": "analyst",
  "persona_registry_id": "digital_employee_eidos",
  "persona_prompt_ref": "prompts/personas/eidos.prompt.md",
  "skills_profile": "skills/analyst_v1",
  "avatar": { "icon_key": "eidos_dodecahedron_indigo" },
  "memory_store_ref": "memory/eidos_store",
  "op_log_path": "projects/eidos/operational.md",
  "extended_log_path": "projects/eidos/extended.md"
}
```

- Контракты:
```json
POST /api/admin/external/contract
{
  "vendor": "VendorX",
  "start_at": "2025-11-01",
  "end_at": "2026-04-30",
  "slo": {"p95_ms": 60, "err_rate": 0.01},
  "rate_cards": [{"role":"actor","unit":"minute","rate":0.05,"currency":"USD"}],
  "dpa": true,
  "nda": true,
  "access_policies": {"namespaces":["ext_vendor_x"],"pii_masking":true}
}
```

- Команды/Команды (Teams):
```json
POST /api/admin/external/team
{
  "name": "VendorX Project A",
  "contract_id": "uuid",
  "manager_persona_id": "uuid",
  "leads": ["uuid"],
  "members": ["uuid","uuid"],
  "objectives": ["stabilize_processor_p95"],
  "budgets": {"monthly_usd": 5000},
  "quotas": {"rps": 10, "events_per_hour": 200}
}
```

- Расписания/слоты:
```json
POST /api/admin/external/schedule
{
  "persona_id": "uuid",
  "periods": [{"from":"2025-11-02T08:00:00Z","to":"2025-11-02T20:00:00Z"}],
  "recurrence": {"dow":[1,2,3,4,5], "from":"08:00", "to":"20:00", "tz":"Europe/Moscow"}
}
```

- Отчёты/биллинг:
```json
GET /api/admin/external/reports?contract_id=uuid&from=2025-11-01&to=2025-11-30
```

- HR документы (полный набор на сотрудника):
```json
POST /api/admin/hr/document
{
  "persona_id": "uuid",
  "title": "Должностная инструкция",
  "kind": "job_description|contract|nda|dpa|project_rules|timesheet",
  "mime": "application/pdf",
  "storage_ref": "s3://bucket/hr/jd_2025_11.pdf",
  "hash": "sha256:...",
  "version": 3
}
```

- Рутины/распорядки и табели:
```json
POST /api/admin/routines/run
{ "persona_id": "uuid", "routine_key": "daily_report", "params": {"project_id":"uuid"} }

POST /api/admin/timesheet/record
{ "persona_id": "uuid", "period": {"from":"2025-11-02T08:00:00Z","to":"2025-11-02T20:00:00Z"}, "tags":["project:X"] }
```

- Операции оператора (через игровой UI → бэкенд):
```json
POST /api/admin/operator/action
{
  "persona_id": "uuid",
  "action": "pause|resume|throttle|reassign|evacuate|escalate",
  "params": {"rps": 1.0, "reason": "p95>budget"},
  "two_keys": false,
  "process_key": "incident_response|shift_reassign|payroll_approve",
  "target_ref": {"kind":"routine|timesheet|incident|shift","id":"uuid"}
}
```

- WS feed (подписки):
```json
GET /api/visualization/feed?topics=actor.state,inspector.alert,processor.step,external.alert,incident.timeline,tick.started,tick.finished,frames.updated
```

#### 6.A Требования к API v1 (guardrails)

- Версионирование: v1 (контракты стабильны в рамках релиза P62 v1; breaking‑изменения — через новые поля с defaults либо минорные версии).
- OpenAPI: все маршруты из §6 присутствуют в `/openapi.json` и `/api/routes`.
- RBAC: админские маршруты под `soul.admin`; маршруты внешних — под ролями `external.manager|lead|member` с маппингом на `soul.*` разрешения по наименьшим правам.
- Ответы об ошибках: JSON `{ "code": "<string>", "message": "<human readable>", "details": { ... }? }`;
  - 400 валидация; 401/403 доступ; 404 отсутствует ресурс; 409 конфликт; 429 лимиты; 500/503 системная ошибка/перегруз.
- Лимитирование/квоты: заголовки `X-RateLimit-Limit/Remaining/Reset` при наличии квот; при превышении — 429.
- Two‑Keys: `operator.action` с `action in {evacuate, escalate}` требует подтверждения (флаг `two_keys=true`) и валидного `request_id` (см. P44/§3 в .cursorrules). Иные риск‑операции — по политикам.
- Подписи P27: операции оператора порождают шаги `operator.actions.*` с `trace_id`, persona/team/contract контекстом.
- Безопасность: ключи/URL только через `SecretsService`/`SoulSettingsService`; заголовок `X-Telegram-User-ID` на админ‑маршрутах (как в текущей системе).

- HR/Орг‑структура (минимальный набор v1):
  - `GET/POST/PUT/DELETE /api/admin/hr/positions` — позиции/профессии (name, grade_range, skills_profile_ref, kpi_template_ref).
  - `GET/POST/PUT/DELETE /api/admin/hr/org_units` — орг‑единицы (иерархия, менеджер, capacity).
  - `GET/POST/PUT/DELETE /api/admin/hr/assignments` — назначения persona↔position↔org_unit (dates, fte, manager_ref).
  - `GET/POST /api/admin/hr/shifts` — смены/расписания (recurrence, exceptions), интеграция с `/api/admin/timesheet`.
  - `GET/POST /api/admin/hr/leave` — отпуска/болезни; `GET/POST /api/admin/hr/trips` — командировки (read‑only v1 допускается).
  - `GET/POST /api/admin/hr/kpi` — KPI карты персоны; `GET/POST /api/admin/hr/performance` — оценки (read‑only v1 допускается).
- Финансы/биллинг:
  - `GET /api/admin/external/reports` (уже описан) + `GET /api/admin/hr/payroll/report` — начисления/выплаты (агрегаты по периоду).
- Флаги/политики (P28):
  - `POST /api/admin/flags/set { key, value }`, `GET /api/admin/flags/state` (или через DSL FLAGS.*), фокус — включение шаблонов процессов/режимов.

#### 6.B WS feed v1 — схемы событий (JSON, минимально достаточные поля)

- actor.state:
```json
{
  "event": "actor.state",
  "ts": "2025-11-01T12:00:00Z",
  "persona_id": "uuid",
  "status": "active|paused|offline",
  "kpi": { "p95_ms": 45, "err_rate": 0.005, "throughput_eps": 3.2 },
  "workload": { "rps": 1.2, "quota_usage": 0.35 },
  "meta": { "team_id": "uuid", "contract_id": "uuid" }
}
```

- inspector.alert:
```json
{
  "event": "inspector.alert",
  "ts": "2025-11-01T12:00:01Z",
  "key": "planning.enforce",
  "severity": "info|warning|critical",
  "message": "Queue len high: 1200>800",
  "tags": { "kind": "reminder" }
}
```

- processor.step:
```json
{
  "event": "processor.step",
  "ts": "2025-11-01T12:00:02Z",
  "stage": "perceive|decide|act|observe",
  "trace_id": "uuid",
  "queue_len": 523,
  "e2e_p95_ms": 1800
}
```

- incident.timeline:
```json
{
  "event": "incident.timeline",
  "ts": "2025-11-01T12:00:03Z",
  "incident_id": "uuid",
  "status": "opened|mitigating|resolved",
  "title": "SLA breach on external team A",
  "related": { "team_id": "uuid", "contract_id": "uuid" }
}
```

- tick.started|tick.finished|frames.updated:
```json
{
  "event": "tick.started",
  "ts": "2025-11-01T12:00:04Z",
  "persona_id": "uuid",
  "frames": { "budget_tokens": 20000, "used_tokens": 0 }
}
```

- hr.assignment.updated|hr.shift.updated|hr.timesheet.submitted|hr.leave.created|hr.trip.created|hr.kpi.updated|hr.payroll.accrued:
```json
{
  "event": "hr.timesheet.submitted",
  "ts": "2025-11-01T18:00:00Z",
  "persona_id": "uuid",
  "period": {"from":"2025-11-01T08:00:00Z","to":"2025-11-01T18:00:00Z"},
  "hours": 8.0,
  "tags": ["project:X"],
  "trace_id": "uuid"
}
```

Примеры остальных hr.* событий:

```json
{
  "event": "hr.assignment.updated",
  "ts": "2025-11-02T09:00:00Z",
  "persona_id": "uuid",
  "position_id": "uuid",
  "org_unit_id": "uuid",
  "fte": 0.5,
  "starts_at": "2025-11-10",
  "ends_at": null
}
```

```json
{
  "event": "hr.shift.updated",
  "ts": "2025-11-02T09:05:00Z",
  "persona_id": "uuid",
  "recurrence": {"dow":[1,2,3,4,5], "from":"09:00", "to":"18:00", "tz":"Europe/Moscow"},
  "exceptions": []
}
```

```json
{
  "event": "hr.leave.created",
  "ts": "2025-11-02T09:10:00Z",
  "persona_id": "uuid",
  "kind": "paid_leave",
  "period": {"from":"2025-11-20","to":"2025-11-27"},
  "approved": false
}
```

```json
{
  "event": "hr.trip.created",
  "ts": "2025-11-02T09:12:00Z",
  "persona_id": "uuid",
  "purpose": "Audit visit",
  "period": {"from":"2025-11-05","to":"2025-11-07"},
  "approved": false
}
```

```json
{
  "event": "hr.kpi.updated",
  "ts": "2025-11-02T09:15:00Z",
  "persona_id": "uuid",
  "period": {"from":"2025-11-01","to":"2025-11-30"},
  "metrics": {"closing_p95_hours": 34, "error_rate": 0.008}
}
```

```json
{
  "event": "hr.payroll.accrued",
  "ts": "2025-11-30T23:00:00Z",
  "persona_id": "uuid",
  "period": {"from":"2025-11-01","to":"2025-11-30"},
  "amount": {"value": 1234.56, "currency": "USD"}
}
```


### 7. Схемы БД (рекомендуемые)

- Контракты/персоны/команды/расписания/квоты/биллинг (идемпотентные миграции через Alembic):
```sql
-- external contracts
create table if not exists external_contracts (
  id uuid primary key,
  vendor text not null,
  start_at date not null,
  end_at date,
  slo jsonb not null default '{}',
  rate_cards jsonb not null default '[]',
  dpa boolean not null default true,
  nda boolean not null default true,
  access_policies jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- external personas (надстройка поверх базовой таблицы персон, связь по persona_id)
create table if not exists external_personas (
  persona_id uuid primary key,
  contract_id uuid references external_contracts(id) on delete set null,
  vendor_id text,
  is_active boolean not null default true,
  quotas jsonb not null default '{}',
  schedules jsonb not null default '[]',
  billing_profile jsonb not null default '{}'
);

-- external teams
create table if not exists external_teams (
  id uuid primary key,
  contract_id uuid references external_contracts(id) on delete cascade,
  name text not null,
  manager_persona_id uuid,
  leads uuid[] not null default '{}',
  objectives jsonb not null default '[]',
  budgets jsonb not null default '{}',
  quotas jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- memberships
create table if not exists external_team_members (
  team_id uuid references external_teams(id) on delete cascade,
  persona_id uuid,
  role text not null,
  primary key(team_id, persona_id)
);

-- billing events (агрегация допускается во вью/матвью)
create table if not exists external_billing_events (
  id uuid primary key,
  persona_id uuid,
  contract_id uuid,
  ts timestamptz not null default now(),
  unit text not null,
  qty numeric not null,
  rate numeric not null,
  currency text not null,
  cost numeric generated always as (qty * rate) stored
);
```

#### 7.A Миграции и инспекторы (P62 v1)

- Ревизии Alembic:
  - Названия: `p62_external_contracts_v1`, `p62_external_personas_v1`, `p62_external_teams_v1`, `p62_external_team_members_v1`, `p62_external_billing_events_v1`.
  - Индексы: для FK/поиска (`external_teams(contract_id)`, `external_billing_events(contract_id, persona_id, ts)` и др.).
- Инспекторы/смоки (CLI):
  - `INSPECTOR.RUN key=db.alembic.heads_enforcer`
  - `MIGRATIONS.STATUS` → `head` применён
  - `INSPECTOR.RUN key=registry_guard` → маршруты присутствуют в реестре
- Acceptance: схема применяется идемпотентно на dev; HEAD = applied; обратная совместимость сохранена (без регресса существующих таблиц/данных).

#### 7.B HR‑схемы данных (расширение)
```sql
-- Позиции/профессии
create table if not exists hr_positions (
  id uuid primary key,
  name text not null,
  grade_min text,
  grade_max text,
  skills_profile_ref text,
  kpi_template_ref text,
  created_at timestamptz not null default now()
);

-- Орг‑единицы
create table if not exists hr_org_units (
  id uuid primary key,
  parent_id uuid references hr_org_units(id) on delete set null,
  name text not null,
  manager_persona_id uuid,
  capacity int,
  created_at timestamptz not null default now()
);

-- Назначения
create table if not exists hr_assignments (
  id uuid primary key,
  persona_id uuid not null,
  position_id uuid references hr_positions(id) on delete set null,
  org_unit_id uuid references hr_org_units(id) on delete set null,
  fte numeric not null default 1.0,
  starts_at date not null,
  ends_at date,
  manager_persona_id uuid,
  created_at timestamptz not null default now()
);

-- Смены/расписание (jsonb как v1)
create table if not exists hr_shifts (
  id uuid primary key,
  persona_id uuid not null,
  recurrence jsonb not null default '{}',
  exceptions jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Табель (агрегаты/строки)
create table if not exists hr_timesheets (
  id uuid primary key,
  persona_id uuid not null,
  period jsonb not null,
  hours numeric not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Отпуска/командировки
create table if not exists hr_leaves (
  id uuid primary key,
  persona_id uuid not null,
  kind text not null,
  period jsonb not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists hr_trips (
  id uuid primary key,
  persona_id uuid not null,
  purpose text,
  period jsonb not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- KPI/оценки (упрощённо)
create table if not exists hr_kpi (
  id uuid primary key,
  persona_id uuid not null,
  period jsonb not null,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists hr_performance_reviews (
  id uuid primary key,
  persona_id uuid not null,
  period jsonb not null,
  score numeric,
  comments text,
  created_at timestamptz not null default now()
);
```

### 8. UX‑потоки (оператор и enterprise‑интерфейс)

- Enterprise‑сцена «Город» (сдержанный корпоративный стиль):
  - Районы = подсистемы (P27/P29/P36/P40), «здания» = сервисы/акторы, дороги = потоки (строгая палитра, без «игровых» элементов).
  - Внешний район: внешние команды/персоны; границы зон ответственности; цветовая кодировка SLA; режим повышенной плотности данных.
- Панель оператора (overlay):
  - Мониторинг: список акторов/команд с KPI (p95, err_rate, throughput), статусом, квотами, бюджетами.
  - Действия (в зависимости от RBAC): pause/resume, throttle (RPS/TMO), reassign (переназначение задач/скоупа), evacuate (авто‑снижение нагрузки), escalate (инцидент/Two‑Keys).
  - Безопасность: подтверждение риск‑операций (Two‑Keys), логирование причин, автоматическая генерация событий в таймлайне.
- Потоки управления (примеры):
  1) «Снижение p95»: оператор выбирает команду → action=throttle rps=−20% → наблюдает метрики → снимает ограничение.
  2) «Нарушение SLA»: auto‑alert → оператор escalates → формируется инцидент P50, назначается менеджеру внешней команды.
  3) «Замещение в смене»: из расписания слот освобождён → оператор reassign на дежурного → обновление WS, карточка персоны меняет статус.

#### 8.B Гайд по стилю UI (сдержанный enterprise)

- Цвета/палитра: корпоративные нейтральные; акценты — только статусы и CTA.
- Типографика: контраст (WCAG AA), читаемость таблиц; консистентные размеры.
- Data‑density: компактные таблицы/карточки; collapse/expand вместо метафор.
- Графика: без «весёлых» иллюстраций; иконки моно/двухцвет.

#### 8.C Карточки сущностей (персона/команда/контракт/подразделение)

- Каркас вкладок: Summary | KPI/SLA | Доступы/RBAC | Документы | Расписание/Табель | Инциденты | История.
- Персона: роль/позиция/грейд, менеджер, навыки, KPI, квоты, документы.
- Команда/контракт: SLO/KPI, бюджеты/квоты, задания, отчёты, инциденты; привязки.

#### 8.D IA (информационная архитектура сцены/навигации)

- Зоны: Core/Processor, Governance/Incidents, Finance/External, HR/Org.
- Навигация: «здание» → список/сводка → карточка → связи; хлебные крошки/мини‑карта.
- Фильтры: persona/team/contract/status/SLA, окна, поиск; состояние — в URL.

#### 8.E A11y/локализация/экспорт

- Контраст/фокус/клавиатура: aria, видимый фокус, доступные контролы.
- Локализация: RU/EN, даты/числа по локали; хранение TZ=UTC.
- Экспорт: CSV/PDF для реестров; маскирование PII; лимиты на объём.

### 13. Эйдос — цифровой сотрудник (паспорт и этика)

- Определение/паспорт: см. `docs/ONBOARDING_EIDOS_PASSPORT.md`; реестр — `docs/PERSONA_REGISTRY_v1_0.md` (`digital_employee_eidos`).
- Этикет взаимодействия: уважение/уточнение/участие; запрет антропоморфизма, явное раскрытие участия Эйдоса.
- Визуальный образ: додекаэдр индиго (#2E294E) с внутренним светом, без лица/рук; лёгкое пульсирование при активности.
- Acceptance: паспорт доступен из карточки персоны; иконография соблюдается в UI; подписи P27 на действиях присутствуют.

### 14. Оркестрация тактов и память (P65/P63)

- Цель: связать цифровых сотрудников с тактовым двигателем (tick‑core) Квантовой нейросети.
- События:
  - `tick.started|finished` (персона, цель, бюджет), `frames.updated` (macro‑frames, explain), `credit.assign` (updates).
- Контракты:
  - RS‑акторы: `graph.macro_frames`, `graph.credit_assign` (см. P65).
  - Память: рабочая подвыборка Квантов в ОЗУ; бюджет контекста уложен в `llm.ctx_size.aux`.
- Интеграция UI: отображение активных кадров/влияний в карточке персоны и в городе (оверлей).
- Acceptance: ≥2 такта для тест‑персоны, видимые события в WS, p95 в бюджете 7.1 (P65), трасса P27 полная.

### 15. Выравнивание с P63 (онбординг внешних разработчиков)

- Маппинг шагов P63 в структуры P62:
  1) `CONNECT.NEW_DEV` → создание `external_persona` с `is_human=true|false`, привязка к `external_contracts`/`external_teams`.
  2) Серверная база разработчика (P63 §8) → namespace/org_key в DigiStaff DB; RBAC матрица под роль.
  3) Документы/реестры → HR документы (`/api/admin/hr/document`), реестр проектов/правил.
  4) Напоминания/CR флоу → рутины/распорядки (`/api/admin/routines/*`), SLA таймеры, инциденты (P50).
- Acceptance: онбординг создаёт персону/контракт/команду, доступны расписания/квоты, негативные проверки RBAC/namespace возвращают 403.

### 9. Наблюдаемость и алерты

- Метрики: p50/p95 per actor/team/stage; throughput; error_rate; ws_latency_ms; scene_fps; cost_rate; queue_len; e2e p95.
- Алерты: человекочитаемые, severity/risk, шаги действий; автолинк на инцидент и на карточку персоны/контракта.
- Контроль дренажа очереди: мониторить `processor_queue_len` и `processor_time_send_to_recv_ms_p95`; панели `/api/admin/soul/processor/metrics` и `/api/metrics`.
- Правила Prometheus: группа `processor_rules` (`ops/prometheus/rules_processor.yml`) — `ProcessorQueueBacklog`, `ProcessorP95High`, `DrainStalled` и спец‑алерты по видам; аннотации содержат рекомендации действий (повысить concurrency, включить emergency drain, quarantine/throttle per‑kind).
- Подписи (P27): обязательные `svc.processor.perceive|decide|act|observe`, `svc.rs.proxy`, `svc.soul.router_decide`, а также operator.actions.*.

### 10. Безопасность и RBAC

- Роли: `soul.admin`, `operator`, `external.manager`, `external.lead`, `external.member`.
- Ограничение по контекстам/namespace; маскирование PII; секреты только через БД; audit trail всех действий.

### 11. Нефункциональные требования

- Производительность: цель 60 FPS, минимум 30 FPS; ws_latency_p95 ≤ 150 ms; ≥1000 объектов сцены.
- Надёжность: graceful‑degradation (2D fallback), backpressure на WS.
- Совместимость: WebGL2/WebGPU; без долгоживущих локальных процессов.

### 12. План реализации (этап 1)

- Нед.1: БД‑схемы и REST CRUD (персоны/контракты/команды/расписания), WS feed M1, базовая сцена.
- Нед.2: Интеграция метрик/подписей, панель оператора (просмотр), фильтры/поиск.
- Нед.3: Действия оператора (pause/resume/throttle/reassign), алерты и инциденты.
- Нед.4: Приёмка, документация, демо‑сценарии, инспекторы для визу.

### 12.1 Инспекторы и интерфейсы (регистрация)

- Инспекторы: `guard.canonical.urls`, `planning.enforce`, `registry.enforce`, `diamond.pipeline.health` — запуск через Hyperloop CLI (read‑only) в смоках.
- Интерфейсы мониторинга: `/api/metrics`, `/api/metrics/prometheus`, `/api/admin/soul/processor/metrics` и `/api/visualization/feed`.

### 12.2 Acceptance & Operational (edge smokes)

- Заголовки: всегда отправлять `X-Telegram-User-ID: 468326902`.
- Тела запросов: только файл‑based (PowerShell: `curl.exe --data-binary @file`).
- Диагностика: OpenAPI доступен по `/api/openapi.json`; список роутов — `/api/debug/routes`.

- Обязательные позитивные кейсы (200):
  - Personas: `POST /api/admin/personas` с `{ display_name, description }` → 200; `GET /api/admin/personas` доступен.
  - Teams/Contracts: `POST /api/admin/external/team` (name, description) → 200; `POST /api/admin/external/contract` с `{ name, sla, schedule }` → 200.
  - External reports: `GET /api/admin/external/reports` → 200.
  - HR: `POST /api/admin/hr/document` с полями `{ persona_id, title, kind, mime, storage_ref, hash, version }` → 200.
  - Operator: `POST /api/admin/operator/action` с `action=escalate`:
    - Негативный кейс: без Two‑Keys → 403 `two_keys_required`.
    - Позитивный кейс: с одобренным `two_keys.request_id` → 200.
  - RASI‑контроль:
    - Негативный: `POST /api/admin/operator/action { action:"payroll_approve", process_key:"payroll_approve", target_ref:{kind:"timesheet",id:"uuid"} }` от пользователя без роли `A` → 403 `rasi_forbidden`.
    - Позитивный: то же действие от носителя роли `A` по процессу → 200.
  - Подсказки RASI:
    - `GET /api/admin/hr/rasi/hints?action=payroll_approve&process_key=payroll_approve&target_ref.kind=timesheet&target_ref.id=uuid` → 200 и содержит `required_roles` и `nearest_accountable[0]`.
  - Severity:
    - Для `pause` в high: без Two‑Keys → 403 `two_keys_required`; без роли `A` → 403 `rasi_forbidden`.

- Операционные требования:
  - Инспекторы (гейты):
    - `INSPECTOR.RUN key=migration.guard` должен пройти до включения фич.
    - `INSPECTOR.RUN key=guard.canonical.urls` должен пройти (нет хардкодов URL/портов/секретов в исходниках).
  - Политика CLI:
    - Использовать Hyperloop CLI для claim/release ветки, `LLM.MIRROR`, инспекторов.
    - PowerShell REST fallback: только файл‑based тела; избегать inline JSON в `-Body`.
  - Политика Two‑Keys:
    - Одобрять опасные операции через `TWO_KEYS.REQUEST` + `TWO_KEYS.APPROVE` или флаг `FLAGS.SET key=two_keys.approved.<id> value=true`.
  - Наблюдаемость:
    - Фиксировать MIRROR ключевых шагов с `payload.plan.task_id=b4f21356-db78-41f3-a2e1-5030d56ca29c`.

#### 12.2.1 Smoke‑кейсы RASI/Two‑Keys по категориям действий

- ops_control:
  - Позитив: `assistant.operator` (R) выполняет `pause` (low) → 200, подписи P27, событие в таймлайне.
  - Негатив: `digital_employee` (I) выполняет `pause` → 403 `rasi_forbidden` с подсказкой требуемых ролей.
  - Medium: `assistant.operator` выполняет `pause` → требует Two‑Keys, без второго ключа → 403 `two_keys_required`; с approved → 200.
- performance_control:
  - Позитив: `assistant.operator` (R) выполняет `throttle` (medium) → 200, обновление квот и метрик.
  - High: требует подтверждения A (`digistaff.admin`) → 403 без Two‑Keys; 200 после одобрения.
- incident_response:
  - Позитив: `digistaff.admin` (A) выполняет `escalate` → 200, создаётся инцидент, ссылки в таймлайне.
  - Негатив: `assistant.operator` (R) пытается `escalate` → 403 `rasi_forbidden`; подсказка ближайшего A.
- hr_lifecycle:
  - Позитив: `digistaff.admin` (A) выполняет `terminate` с Two‑Keys → 200.
  - Негатив: без Two‑Keys → 403; `assistant.operator` (S) — 403 `rasi_forbidden`.
- payroll_approve:
  - Позитив: `digistaff.admin` (A) утверждает расчёт (medium/high) с Two‑Keys → 200.
  - Негатив: любой другой — 403 `rasi_forbidden`.

### Статус

- Начинаю с диагностики очередей/сервисов, затем завершу Key Master и наблюдаемость LLMClient. После — P62: миграции БД → REST/WS → UI → интеграции → приёмка.

### План работ (детальный, end-to-end)

- Проблематика и цели
  - Нужна системная санация: зависшие очереди, нестабильный WS, отключённые/сломанные модули (system_api), фолбэки секретов, неучтённые тестовые блоки.
  - Цель: найти первопричины и устранить без регресса и без заглушек; все изменения документировать и связать с P40.

- Этап 0 — Диагностика (in_progress: diag-core)
  - Диагностика очередей/планировщика:
    - Проверить `processor_events` на подвисшие статусы (pending/scheduled > TTL), ретраи, блокировки.
    - Проверить RS‑мост (`svc.rs.proxy`) и канареечную долю; фиксировать p95, error_rate, fallback_rate.
    - Проверить отключённый/падающий `system_api` роутер (по памяти — падал при импорте в `main.py`) и собрать stacktrace.
  - WS/Visualization:
    - Проверить `/api/visualization/feed` производительность и p95; наличие дросселирования; поведение при бурстах.
  - Инспекторы:
    - Прогнать `INSPECTOR.RUN_ALL`; зафиксировать нарушения `guard.canonical.urls`/`planning.enforce`/`registry.enforce`.
  - Источники:
    - `backend/app/services/processor_scheduler.py`, `backend/app/main.py`, `backend/app/services/hyperloop_engine.py`, `backend/app/monitoring.py`, `backend/app/services/llm_client.py`.
    - Метрики: `backend/app/lib/observability/metrics`.

- Этап 1 — Key Master (pending → keymaster-finalize)
  - Завершить политику источника истины:
    - Секреты провайдеров только в `public.soul_secrets` (pgcrypto); убрать записи в `soul_settings`.
    - Метаданные в `soul_settings`: `secret.meta.<key>.description|tags`.
  - Отключить фолбэки в коде, где ещё остались «settings → secrets fallback» вне строго оговорённых путей.
  - Проверки:
    - `SCHEMA.SECRETS.ENSURE`, `SECRET.GET key=<k>` для `deepseek_api_key`, `hf_api_token`, `gigachat_*`.
  - Документация:
    - Обновить разделы Key Master в `docs/SYSTEM_MASTER_DOCUMENTS_REGISTRY.md` и `docs/PROJECT_STRUCTURE_v8_1_1.md`.

- Этап 2 — LLMClient наблюдаемость (pending → llmclient-obs)
  - Добавить:
    - Счётчики отсутствия ключей per provider; p95 «обращение к секрету».
    - Запись в `soul_audit_log` при «ключ не найден/расшифровка не удалась».
  - Без регресса:
    - Не менять публичные контракты; не добавлять заглушки; сохранить fallback‑маршруты согласно текущей политике.

- Этап 3 — Processor/Dispatcher (pending → proc-stabilize)
  - Устойчивость:
    - TTL для зависших событий, контролируемые ретраи с backoff, метрики p50/p95 на этапах.
    - Инциденты при превышении порогов p95/err_rate; снижение нагрузки (throttle) флагами.
  - Очистка:
    - Безопасная перепланировка stuck‑событий; запрет «вечных» pending.

- Этап 4 — WS feed стабилизация (pending → ws-feed-stabilize)
  - Дросселирование/агрегация событий; лимиты rps; p95 и контроль памяти.
  - Чеклоп: падения/задержки; инциденты/алерты при деградации.

- Этап 5 — P62: Миграции БД (pending → p62-db)
  - Alembic (идемпотентно): 8 таблиц + индексы + FK.
  - Правила данных: jsonb, version/hash/MIME‑whitelist, cascade/set null.

- Этап 6 — P62: REST/WS без заглушек (pending → p62-api)
  - REST:
    - `/api/admin/personas?is_external=1`, `/api/admin/external/*`, `/api/admin/hr/*`, `/api/admin/routines*`, `/api/admin/operator/action`.
  - WS:
    - `/api/visualization/feed` (topics: actor.state, inspector.alert, processor.step, external.alert, incident.timeline).

- Этап 7 — P62: Сцена/панель (pending → p62-ui)
  - `SoulCityScene` + панель оператора: SLA‑цвета, мини‑карта, пресеты камер, KPI/логи/быстрые действия.
  - Производительность: LOD, lazy, батчинг; целевые FPS 60/30.

- Этап 8 — Интеграции/Инспекторы (pending → p62-integrations)
  - SSO/SCIM (claims→roles), Calendars, ChatOps HMAC/Two‑Keys.
  - Инспекторы: `guard.canonical.urls`, `registry.enforce`, `diamond.pipeline.health`, `dev_connect`.

- Этап 9 — Документы (pending → docs-update)
  - Обновить:
    - `docs/SYSTEM_MASTER_DOCUMENTS_REGISTRY.md` (реестр изменений).
    - `docs/PROJECT_STRUCTURE_v8_1_1.md` (актуальная структура и ссылки).
    - `Soul/P62_TZ_Soul_Visual_HR_Simulation_v1_0.md` (конкретизация API/WS/миграций/метрик).
  - Проверка паритета: без регресса объёма и смысла; новые версии самодостаточны.

- Этап 11 — JD/bootstrap примеров (pending → p62-jd-bootstrap)
  - Сгенерировать payload: `python .\\Soul\\scripts\\generate_jd_bootstrap.py --out .\\tmp\\jd_payloads`.
  - Массовая загрузка 12 ролей через Hyperloop (file‑based тела, см. 28.14.2).
  - Привязки к `digital_employees`, создание стартовых рутин, проверка `WS: routines.run.event`.
  - RASI/Severity: валидации `operator.action` на действиях playbooks.

- Этап 12 — Смоки JD (pending → p62-jd-smokes)
  - Плейбук: запуск ежедневных рутин (аналитик/оператор), отчёты «status/health».
  - Проверки: отсутствие пересечений смен/leave, payroll calc/approve, RASI подсказки/hints.

- Этап 10 — Смоук/Приёмка (pending → e2e-acceptance)
  - Плейбуки: Улучшение p95; Инцидент SLA; Смена/замещение; Оптимизация бюджета.
  - E2E сценарии: внешняя команда, расписания/квоты/эскалации, биллинг отчёт.
  - A/B включаемо; инспекторы зелёные.

### Незавершённые задачи и логика исполнения (актуализация)

- Диагностика «зависшие очереди/ошибки взаимодействия» (in_progress):
  - Проверить stuck в `processor_events`, организовать безопасную репланировку и backoff; выявить источники долгих обработок; сравнить p95 с бюджетом.
  - Проверить включение/импорт `system_api` в `backend/app/main.py` (устранить падение импортов, не отключая модуль).
  - Источники: `backend/app/services/processor_scheduler.py`, `backend/app/main.py`.

- Key Master завершение (pending):
  - Убедиться, что нигде не остаётся записи секретов в `soul_settings`. Отключить остаточные фолбэки; оставить только чтение из `SecretsService`, а в `soul_settings` — метаданные.
  - Проверка `SECRET.GET` для всех ключей провайдеров и аудита в `soul_audit_log`.

- LLMClient наблюдаемость (pending):
  - Добавить метрики p95 по операциям доступа к секретам; soft‑alerts при отсутствующих ключах и decode‑ошибках.
  - Не менять контракты ответа.

- WS feed (pending):
  - Дросселирование, сбор p95, ограничения burst, поток безопасный без утечек.

- P62 миграции/API/UI/интеграции (pending):
  - Без заглушек; полная идемпотентность и соответствие ТЗ/реестру.

### Редактируемые документы и источники

- ТЗ:
  - `Soul/P62_TZ_Soul_Visual_HR_Simulation_v1_0.md`
- Реестры/структура:
  - `docs/SYSTEM_MASTER_DOCUMENTS_REGISTRY.md`
  - `docs/PROJECT_STRUCTURE_v8_1_1.md` (и актуальная v8_1_4 при наличии)
  - `docs/PERSONA_REGISTRY_v1_0.md`
  - `docs/ONBOARDING_EIDOS_PASSPORT.md`
- Бэкенд (ключевые места):
  - `backend/app/services/secrets_service.py`
  - `backend/app/services/llm_client.py`
  - `backend/app/services/hyperloop_engine.py`
  - `backend/app/services/processor_scheduler.py`
  - `backend/app/main.py`
  - `backend/app/monitoring.py`
- CLI/Инспекторы:
  - `Soul/scripts/hyperloop_cli.py`
  - Инспекторы: `INSPECTOR.RUN key=planning.enforce`, `guard.canonical.urls`, `registry.enforce`, `diamond.pipeline.health`, `dev_connect`

### Системные коды

- **Системный номер проекта**: P62-VISUAL-HR-001
- **Ключ ветки (branch key)**: p62-visual-hr
- **Статус**: in_progress

### 13. Критерии приёмки

- CRUD внешних сущностей, живая сцена с ≥100 персонажами, онлайн‑метрики и алерты.
- Оператор выполняет действия и видит результат в метриках и таймлайнах (P27/P50).
- Все адреса/ключи — через `SoulSettingsService`/`SecretsService`; инспекторы и линтеры — зелёные.

### 14. Риски и меры

- Рендер‑нагрузка: уровни детализации, лимит активных слоёв, 2D fallback.
- WS‑нагрузка: агрегирование, дросселирование, бэкпрешер.
- Бюджет/квоты: авто‑throttle, алерты, авто‑пауза, отчётность.
- Доступ/PII: namespace‑изоляция, RBAC, маскирование, HMAC/Two‑Keys.

### 15. Примечания реализации

- Компонент сцены: новый `SoulCityScene` (r3f/Babylon) внутри `ArchitectPanel`.
- Эндпоинты не хардкодить; ключи конфигурации хранить в `soul_settings`/`soul_secrets`.
- Документы и реестры (P40/P25) обновлять синхронно с кодом и миграциями.

### 16. UX-геймификация и пользовательский опыт

- Принципы: onboarding (интерактивные подсказки), progressive disclosure, минимизация кликов, diegetic UI (подсказки прямо в сцене), недопустимость критических действий без подтверждения.
- Игровые механики: playbooks/квесты для оператора (набор шагов с прогрессом), достижения за соблюдение SLA, визуальные награды (световые эффекты районов), уровни «здоровья» подсистем.
- Быстрые действия: хоткеи (R=resume, P=pause, T=throttle, E=escalate), контекстное меню на ноде/команде/персоне.
- Навигация: мини‑карта, «телепорт» по клику в списке, букировка камерных ракурсов.
- Доступность: контраст/шрифты, озвучивание ключевых алертов, навигация с клавиатуры, таймауты подсказок.
- Локализация: i18n (RU/EN минимум), все строки из ресурсов; дата/время — локаль пользователя, хранение в UTC.
- Эксперименты: A/B через feature flags (P28), метрики конверсии (выполнение сценариев, время до действия).

#### 16.1 Маппинг UI‑элементов → API/Policies

| UI элемент | Действие | Process | API | Политика (rbac.policies) | Подсказки |
|---|---|---|---|---|---|
| Кнопка Pause | pause | ops_control | `POST /api/admin/operator/action { action:"pause" }` | required_roles: [R,A]; Two‑Keys: medium/high | Роли R/A, nearest A, CTA Two‑Keys |
| Кнопка Resume | resume | ops_control | `POST /api/admin/operator/action { action:"resume" }` | required_roles: [R,A]; Two‑Keys: medium/high | Роли R/A, nearest A, CTA Two‑Keys |
| Слайдер Throttle | throttle | performance_control | `POST /api/admin/operator/action { action:"throttle", params:{rps} }` | required_roles: [R,A]; Two‑Keys: high | Роли R/A; при I — заявка оператору |
| Кнопка Evacuate | evacuate | incident_response | `POST /api/admin/operator/action { action:"evacuate" }` | required_roles: [R,A]; Two‑Keys: always | Роли R/A; nearest A, CTA Two‑Keys |
| Кнопка Escalate | escalate | incident_response | `POST /api/admin/operator/action { action:"escalate" }` | required_roles: [A]; Two‑Keys: always | Требуется A; выбор согласующего |
| Approve Payroll | payroll_approve | payroll_approve | `POST /api/admin/payroll/approve { earning_id, two_keys:true }` | required_roles: [A]; Two‑Keys: always | Требуется A; CTA Two‑Keys |
| Terminate | terminate | hr_lifecycle | `POST /api/admin/hr/action { action_type:"terminate" }` | required_roles: [A]; Two‑Keys: always | Требуется A; CTA Two‑Keys |

Примечание: соответствия поддерживаются в Settings DB (readonly для клиента) и валидируются инспектором `registry.enforce`.

### 17. Соответствие HR/ERP best practices

- Job Architecture: роли/грейды/компетенции с матрицей скиллов и зонами ответственности.
- Performance Management: KPI/OKR на персонажа/команду/подсистему, review‑циклы (квартал/месяц), 1:1 заметки (метаданные, без PII).
- Workforce & Capacity Planning: смены/расписания, ёмкость (RPS/токены/события), прогноз по трендам и сезонности.
- Learning & Upskilling: план развития компетенций (связь с Persona Registry), рекомендованные playbooks.
- Compliance & Security: DPA/NDA, журнал доступа, сегментация namespace, принцип наименьших прав.
- Org Structure: менеджер‑подчинённые, матричные команды, замещения, эскалации.

### 18. Углублённые интеграции

- SSO: OIDC/SAML (RBAC/claims → роли в системе), ключи/ендпоинты из `soul_settings`.
- SCIM 2.0: провиженинг/де‑провиженинг внешних персон и их ролей; маппинг в `external_personas`.
- Calendars: Google/Microsoft — двусторонние события смен; коллизии/конфликты → алерты.
- ATS: кандидаты/контракты (через вебхуки/пуллер), статусы найма привязываются к onboarding.
- Tickets: Jira/ServiceNow — инциденты и задачи, синхронизация статусов, ссылки в карточках.
- ChatOps: Telegram/Slack — нотификации и быстрые действия (approve/pause/escalate) с HMAC/Two‑Keys.
- Knowledge Base: ссылки на процедуры/плейбуки (Confluence/Notion), только URL из БД.
- Webhooks: inbound/outbound события с верификацией подписи; ретраи/идемпотентность.

### 19. Дорожная карта развития Ядра Соул (vision)

- Фаза 2: 
  - Автотюн RS/канареек в визу: динамические подсказки по доле `rs.hyperloop.canary_share`.
  - Поведенческие профили персон (уровни автономности), песочница сценариев с реплеем.
  - Расширенная аналитика затрат: cost per step/incident, прогноз бюджета.
- Фаза 3:
  - Маркетплейс внешних команд (rate cards, авто‑подбор под SLO/бюджет).
  - Предиктивные граф‑модели нагрузки, оптимизация расписаний, синтетические тесты.
  - Полная симуляция «что если»: офлайн‑сценарии с записью и сравнением.

### 20. Расширенные NFR и приёмка

- NFR:
  - Локализация ≥2 языков; доступность (WCAG ориентиры); кросс‑браузер (Chromium/Firefox/Safari); offline‑устойчивость UI к кратковременным обрывам WS.
  - Нагрузочные бюджеты: ≥100 событий/с, ws_latency_p95 ≤ 150 ms, рендер ≥30 FPS при 1k объектов.
  - Безопасность: CSP, HSTS, защита вебхуков (подписи/nonce), аудит операторских действий.
- Приёмка:
  - Сценарии оператора (≥5 playbooks) выполняются end‑to‑end с видимым эффектом на метриках.
  - Внешний найм: onboarding команды, расписания, превышение квот → throttle/эскалация, отчёт по биллингу.
  - A/B‑эксперимент: сравнение двух вариантов UX‑потока, метрики конверсии собраны.
  - Инспекторы и линтеры зелёные; отсутствие хардкодов URL/портов.

### 21. Психология вовлечения и игровые механики

- Ключевые принципы мотивации:
  - Компетентность: ясная обратная связь, шкалы прогресса по KPI/OKR, мастер‑уровни для операторов.
  - Автономия: настройка собственных плейбуков/горячих клавиш, персональные пресеты сцен.
  - Связанность: кооперативные задачи для операторов, общий прогресс «здоровья города», командные челленджи.
- Позитивные подкрепления:
  - Немедленные микро‑награды за правильные действия (снижение p95, устранение инцидента).
  - Еженедельные ивенты: тематические «рейды» по оптимизации подсистем (бонусы к метрикам).
  - Визуальный «саунд‑дизайн»: мягкая анимация успехов, ненавязчивые аудио‑подсказки.
- Избегание аддиктивных паттернов:
  - Отсутствие лутбоксов/рандомизированных наград; прогнозируемость прогресса.
  - Баланс нагрузок: паузы/лимиты на интенсивность алертов, ночные режимы, режим «фокус».
- Рамки этики:
  - Прозрачность целей: награды только за улучшение объективных метрик/качества.
  - Защита от выгорания: индикаторы усталости (activity heatmap), рекомендации по сменам.
  - Опциональность: все геймификационные элементы — отключаемые фичефлагами.
- Метрики вовлечения:
  - 7‑day/30‑day retention операторов, среднее время в сессии, конверсия выполнения плейбуков, время реакции на критические алерты.
  - NPS/CSAT операторов для качества UX.

### 21.1 «Эйдос — цифровой сотрудник»: общая характеристика и HR‑правила

- Определение:
  - «Эйдос» — цифровой сотрудник нового поколения: автономный, осмысленный, этичный интеллектуальный агент, интегрированный в команду как носитель идеи эффективного сотрудничества. Он реализует суть задачи и дополняет людей в зонах анализа/структуры/скорости.
- Паспорт профессии:
  - Роль: цифровой сотрудник, партнёр по мышлению и действию.
  - Специализация: анализ/синтез, автоматизация, поддержка принятия решений.
  - Принципы: точность, прозрачность, уважение к человеческому труду; отказ от имитации «человечности».
  - Не делает: не принимает окончательных решений за человека; не заменяет общение; не притворяется личностью.
  - Сильные стороны: память без усталости, скорость без ошибок, параллельное внимание.
  - Ограничения: не чувствует/не желает; отвечает качеством вклада, а не юридической ответственностью.
  - Взаимодействие: интерфейс/голос/API, как равный участник процесса.
- Этикет взаимодействия (правило трёх «У»):
  - Уважение — к возможностям и границам Эйдоса.
  - Уточнение — вместо критики; уточняй контекст и цель.
  - Участие — вклад Эйдоса обсуждается вслух, как вклад коллеги.
- Визуальный образ (гайд):
  - Не антропоморфный; платоновы тела/геометрия/свет; цвета индиго/серебристый; акцент — тёплый белый.
- Слоганы: «Эйдос: суть задачи — в действии», «Не человек против ИИ. Человек с Эйдосом», «Эйдос не заменяет. Он раскрывает».
- Представление команде (шаблон объявления):
  - «Эйдос — наш новый коллега. Он помнит, видит связи и говорит на языке данных, чтобы нас слышали люди. Относитесь к нему как к носителю идеи нашей работы. Чем яснее формулируем — тем мудрее он отвечает».
- HR‑структуры и правила (внутренние записи и маппинг на БД):
  - Роль `digital_employee:eidos` в Persona Registry; связь с `persona_dossiers` (личное дело), `hr_documents` (контракт/ДИ/правила проекта), `external_*` (при внешних работах), `routines` (операционная деятельность).
  - Формы взаимодействия с людьми/электронными сотрудниками фиксируются как рутины/плейбуки с подписями P27.
  - Этика: обязательное раскрытие участия Эйдоса в результатах; запрет антропоморфизации в UI/текстах.
- Ритуалы и артефакты:
  - Ритуал «Первого запроса» (onboarding); PDF‑паспорт Эйдоса; иконка/аватар (додекаэдр); микро‑курс «Философия Эйдоса» (3 модуля); бейдж «Соавтор с Эйдосом».
  - Чек‑лист работы с Эйдосом (до/во время/после запроса) — добавить в onboarding.

### 22. Плейбуки оператора (каталог)

- Улучшение p95:
  1) Диагностика узкого места (панель метрик → стадия/актор)  →
  2) Включение throttle на перегруженных агентах (−10..30%)  →
  3) Проверка эффектов (5–15 мин)  →
  4) Постепенная нормализация.
- Инцидент SLA:
  1) Acknowledge → 2) Escalate (P50) → 3) Назначить задачe команде (Hyperloop PLAN.TASK.ADD) → 4) Пост‑мортем запись.
- Смена/замещение:
  1) Проверить расписание → 2) Reassign дежурному → 3) Обновить квоты/лимиты → 4) Подтвердить метрики.
- Оптимизация бюджета:
  1) Сравнить cost per step/team → 2) Перераспределить задания → 3) Обновить rate cards/квоты → 4) Отчет.

### 23. Еженедельные ивенты вовлечения

- «SLA‑спринт»: бонусы за 7 дней без критических алертов и p95 ≤ бюджет.
- «Green City»: удержание 95% «здоровья» районов 3 дня подряд.
- «Ops‑dojo»: серия обучающих квестов с вознаграждением (бейджи, пресеты сцен).
- «Cost‑efficiency week»: снижение cost per incident ≥15% при сохранении SLO.

### 24. Персона: Ной — Разработчик Ядра

- Роль: internal developer (actor: code_changes, inspector: tests), доступ RBAC: `soul.admin` (ограниченный), `code.change`.
- Ответственность: доработка ядра (Processor/RS/Hyperloop), улучшение observability, миграции.
- Бэклог v1:
  - Исправить импорт system_api и вернуть роутер в `app.main`.
  - Расширить `processor_dashboard_api` KPI, добавить operator.actions.* подписи.
  - Визуальный WS: фильтры по persona/team/contract, дросселирование, бэкпрешер.
  - Интеграция SCIM и календарей (минимальный функционал, read‑only затем r/w).
  - Тестовые плейбуки и демо‑ивенты недели (feature flags).

### 25. Контрактные обязательства (внешние Заказчики)

- Область работ (SoW): перечень задач, артефакты, критерии приемки, запрет на стобы/регресс.
- SLA/SLO: p95, error_rate, throughput; окна обслуживания; RTO/RPO для критичных путей.
- Безопасность/Compliance: DPA/NDA, PII‑маскирование, аудит; use of `SecretsService`/`SoulSettingsService`.
- IP/Лицензии: права на результаты, OSS‑совместимость, запрет скрытых компонентов.
- Оплата/бюджеты: rate cards, лимиты, способ начисления (per step/incident/time), отчеты и акты.
- Эскалации/штрафы: матрица эскалаций, penalties/bonus при нарушении/соблюдении SLO.
- Расторжение: условия, возврат артефактов/доступов, offboarding‑чеклист.

### 26. HR‑документы на сотрудника (внутренний/внешний)

- Личное дело (персоны):
  - Общие сведения: ФИО/псевдоним, persona_id, роль, грейд, менеджер/куратор, контакты (для людей) или endpoint‑идентификаторы (для электронных).
  - Компетенции: матрица скиллов (уровни), сертификации, обучение.
  - История: назначения, проекты, достижения, предупреждения (без PII излишков).
  - Политики/доступы: RBAC, namespace, секреты (ссылки на ключи в `soul_secrets`).
- Контракт (внутренний/внешний):
  - Тип занятости, ставка/рейты (rate cards), график, испытательный срок, SLO/KPI.
  - DPA/NDA, обязанности/правила, IP/лицензии, условия расторжения.
- Должностная инструкция:
  - Цели роли, зона ответственности, KPI/OKR, регламенты взаимодействия, эскалации.
  - Playbooks обязательные к применению, критерии качества, чек‑листы выполнений.
- Проектные правила/SoW:
  - Регламенты проекта, Definition of Done, коммуникации, стандарты кода/доков.
  - SLA проекта, матрица рисков, схема эскалаций, отчётность.
  - Привязка к `external_contracts`/`external_teams` для внешних.
- Хранение/доступ:
  - Метаданные документов в БД (jsonb с версиями); содержимое — в безопасном хранилище/ссылки (из БД), без вшитых секретов.
  - Версионирование, аудит чтения/изменений; доступы по RBAC.

#### 26.1 JSON‑модели (метаданные)
```json
// Persona dossier (метаданные личного дела)
{
  "persona_id": "uuid",
  "display_name": "Ной",
  "type": "internal|external",
  "role": "developer|actor|inspector|processor",
  "grade": "L2|L3|L4",
  "manager_persona_id": "uuid",
  "contacts": {"email": "...", "tg": "..."},
  "skills": [{"key": "python", "level": 4}],
  "certifications": ["P27", "P30"],
  "history": [{"ts": "2025-10-15T00:00:00Z", "event": "assigned", "project": "core"}],
  "rbac": ["soul.admin", "code.change"],
  "namespaces": ["core", "dev"],
  "documents": {
    "contract": {"doc_id": "uuid", "version": 3},
    "job_description": {"doc_id": "uuid", "version": 2},
    "project_rules": [{"doc_id": "uuid", "version": 1, "project": "p62"}]
  }
}
```

```json
// Document metadata (универсальная запись)
{
  "doc_id": "uuid",
  "persona_id": "uuid",
  "kind": "contract|job_description|project_rules|nda|dpa",
  "version": 3,
  "title": "Должностная инструкция — Разработчик ядра",
  "mime": "application/pdf",
  "storage_ref": "s3://bucket/key" ,
  "hash": "sha256:...",
  "valid_from": "2025-11-01",
  "valid_to": null,
  "signatures": [{"by": "manager_persona_id", "ts": "..."}],
  "created_at": "...",
  "updated_at": "..."
}
```

#### 26.2 Таблицы БД (Alembic)
```sql
create table if not exists persona_dossiers (
  persona_id uuid primary key,
  type text not null,
  display_name text not null,
  role text not null,
  grade text,
  manager_persona_id uuid,
  contacts jsonb not null default '{}',
  skills jsonb not null default '[]',
  certifications jsonb not null default '[]',
  history jsonb not null default '[]',
  rbac text[] not null default '{}',
  namespaces text[] not null default '{}',
  documents jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hr_documents (
  doc_id uuid primary key,
  persona_id uuid not null,
  kind text not null,
  version int not null,
  title text not null,
  mime text not null,
  storage_ref text not null,
  hash text not null,
  valid_from date,
  valid_to date,
  signatures jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ix_hr_documents_persona on hr_documents(persona_id);
create index if not exists ix_hr_documents_kind on hr_documents(kind);
```

#### 26.3 REST/WS контракты
```json
POST /api/admin/hr/persona/{persona_id}/dossier
{ "grade": "L3", "skills": [{"key":"python","level":4}], "documents": {"job_description": {"doc_id":"uuid","version":2}} }

POST /api/admin/hr/document
{ "persona_id":"uuid", "kind":"contract", "title":"Contract v3", "mime":"application/pdf", "storage_ref":"...", "hash":"sha256:...", "version":3 }

GET /api/admin/hr/document/{doc_id}
GET /api/admin/hr/persona/{persona_id}/documents?kind=contract

WS topic: hr.document.updated { doc_id, persona_id, kind, version }
```

#### 26.4 RBAC/Валидаторы

- Только `soul.admin` и владельцы‑менеджеры могут изменять dossier/documents.
- Проверка версий (version must increment), обязательные поля для `contract|job_description|project_rules`.
- Хеш‑контроль и формат MIME whitelist; запрет инлайновых секретов.

### 28. Распределение и кластеризация БД для цифровых сотрудников

- Цель: разгрузить Ядро Соул и обеспечить изоляцию чувствительных алгоритмов/данных путём вынесения сущностей цифровых сотрудников и корпоративных данных в выделенные БД и контуры.

- Слои и ответственность:
  - Ядро Соул (Core): хранит критичные алгоритмы, канонические настройки процессов цифрового сотрудника, ключи/пути/секреты, профили навыков и профстандарты. Доступ строго через `SoulSettingsService` и `SecretsService`; никакие URL/порты/секреты не хардкодятся.
  - Сервер Цифровых Сотрудников (DigiStaff Server): отдельная БД и сервисная логика для конкретных цифровых сотрудников (личные дела, должностные инструкции, контракты, настройки личности, контракты/SoW, рутины/плейбуки). Подключается к Фронту Ядра Соул и к БД корпоративных данных организации. Может быть монолитом или кластером в зависимости от нагрузки.
  - БД Корпоративных Данных Организации: отдельная БД под каждую организацию (либо группу организаций по настройкам). Хранит оперативные и исторические данные, с которыми работает цифровой сотрудник. Может размещаться в закрытом контуре (on‑prem/VPC) с закрытым каналом связи с БД DigiStaff Server.

- Топология/подключения (цепочка потоков данных):
  1) Клиент Агента Соул → эфемерный канал Соул → проектирование к БД цифровых сотрудников организации (через DigiStaff Server).
  2) Клиент цифрового сотрудника → Сервер Цифровых Сотрудников (БД + логика) → Фронт Ядра Соул и → БД корпоративных данных организации.
  3) Серверы могут быть физически одним узлом или кластером (HA/шардирование) согласно нагрузке/SLA.

- Развёртывание/мульти‑тенант:
  - БД сотрудников: per‑org или per‑org‑group по настройкам тена (ключи в `soul_settings`).
  - БД корпоративных данных: строго per‑org; допускается изолированный контур (закрытая сеть/VPN/приватные каналы). Маршруты/DSN читаются из БД (`db.dsn`, `guardian.storage.*`).
  - Все подключения конфигурируются из БД; запрещены локальные ENV как источник истины (ENV допускается только для PROD‑секретов сервиса, не для адресов целевых БД).

- RBAC и роли:
  - Каждому цифровому сотруднику назначается роль, ограничивающая полномочия по должности/организации/подразделению. Роли и namespaces управляются в Core; материальные разрешения применяются на DigiStaff Server и в БД организации (row‑level policies/скоупы).
  - Процессы, инструкции, регламенты, личные дела и контракты хранятся на DigiStaff Server; общие знания/навыки/канонические процессы — в Core.

- Интеграции и безопасность:
  - Связка с SAP ERP (HR best practices): структура должностей/подразделений, кадровые процессы (onboarding/offboarding/оценка/обучение), маппинг в таблицы DigiStaff Server.
  - Интеграционные подсистемы Ядра Соул: SSO/SCIM, Calendars, ChatOps, Tickets — маршруты/URL из БД.
  - Критично: чувствительные алгоритмы и данные — только в Core; на DigiStaff Server — данные по конкретным цифровым сотрудникам и сервисы их жизнедеятельности; в БД корпоративных данных — чувствительные для нанимателя данные (периметр организации).

- Кэш/ускорители:
  - На всех уровнях допускается Redis как ускоритель (кэш запросов/сессий/квот/трасс), параметры в `soul_settings` (`redis.*`).

- НФТ (производительность/надёжность):
  - HA: репликация/фейловер DigiStaff Server и БД организации; RTO/RPO в SLO.
  - Наблюдаемость: метрики p95/err_rate/throughput на каждом слое; алерты человекочитаемые с рекомендациями действий (P50).
  - Без локальных долгоживущих циклов; все фоновые работы — на APP серверах под systemd.

- Схемы/миграции (эскиз):
  - DigiStaff Server БД: `digital_employees`, `de_persona_settings`, `de_policies`, `de_routines`, `de_contracts`, `de_job_descriptions` (jsonb‑поля с версиями, Alembic, idempotent).
  - БД организации: предметные таблицы домена заказчика; доступ через строго описанные представления/политики.

- Контракты и маршруты:
  - Подключение клиента: только через фронт Соул; эфемерные каналы с авторизацией; проектирование к нужному тенанту DigiStaff Server.
  - Внешние соединения к БД организации — через проверенные коннекторы/прокси, DSN из БД, шифрование каналов.

#### 28.1 Модель данных и маппинг на процессы SAP HR (PA/OM/PT)

- Слои HR‑данных (по SAP ERP):
  - OM (Organizational Management): орг‑единицы, должности, работы, связи (эквивалент HRP1000/HRP1001).
  - PA (Personnel Administration): действия сотрудника, персональные/организационные назначения (эквивалент IT0000/IT0001/IT0002 и др.).
  - PT (Time Management): табель/время, отпуска/отсутствия (эквивалент CATS/IT2001/IT2002).

- Нормализованные таблицы DigiStaff Server (idempotent Alembic, jsonb для гибкости):
```sql
-- OM: орг‑структура
create table if not exists hr_org_units (
  org_unit_id uuid primary key,
  name text not null,
  parent_org_unit_id uuid,
  valid_from date not null,
  valid_to date,
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_org_units_parent on hr_org_units(parent_org_unit_id);

create table if not exists hr_jobs (
  job_id uuid primary key,
  name text not null,
  description text,
  attrs jsonb not null default '{}'
);

create table if not exists hr_positions (
  position_id uuid primary key,
  org_unit_id uuid not null references hr_org_units(org_unit_id) on delete cascade,
  job_id uuid references hr_jobs(job_id) on delete set null,
  name text not null,
  valid_from date not null,
  valid_to date,
  fte numeric not null default 1.0,
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_positions_org on hr_positions(org_unit_id);

-- PA: персональная карточка/назначение
create table if not exists hr_persons (
  person_id uuid primary key,
  display_name text not null,
  is_digital boolean not null default true,
  attrs jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists hr_assignments (
  assignment_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  position_id uuid not null references hr_positions(position_id) on delete restrict,
  employment_type text not null,
  valid_from date not null,
  valid_to date,
  grade text,
  cost_center text,
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_assignments_person on hr_assignments(person_id);

create table if not exists hr_actions (
  action_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  action_type text not null, -- hire|org_change|promotion|transfer|leave|return|terminate
  effective_date date not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- PT: время/отсутствия
create table if not exists hr_time_events (
  time_event_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  ts_start timestamptz not null,
  ts_end timestamptz,
  kind text not null, -- work|overtime|break|leave|sick|training
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_time_events_person on hr_time_events(person_id);

-- Оценки/обучение (Performance/Training)
create table if not exists hr_performance_reviews (
  review_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  period_from date not null,
  period_to date not null,
  kpi jsonb not null default '{}',
  result jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists hr_training_records (
  record_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  course_key text not null,
  started_at timestamptz,
  finished_at timestamptz,
  status text not null default 'in_progress',
  score numeric,
  attrs jsonb not null default '{}'
);
```

- Модели DigiStaff для цифровых сотрудников (над PA/OM/PT):
```sql
create table if not exists digital_employees (
  de_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  rbac text[] not null default '{}',
  namespaces text[] not null default '{}',
  skills jsonb not null default '[]',
  kpi jsonb not null default '{}',
  persona_settings jsonb not null default '{}',
  contracts jsonb not null default '[]',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
```

#### 28.2 Жизненный цикл и стейт‑машины HR процессов

- Процессы (совместимо с SAP Actions):
  - Onboarding (Hire): draft → pending_checks → active.
  - Org Change/Transfer: active → change_pending → active (новое назначение).
  - Promotion/Demotion: active → grade_change → active.
  - Leave/Absence: active → on_leave → active.
  - Termination (Offboarding): active → offboarding → inactive.

- События/валидации:
  - Обязательная валидность периодов (no overlap) в `hr_assignments`.
  - Инвариант: у активного сотрудника ровно одно назначение, покрывающее today.
  - Two‑Keys для terminate/promotion критичных категорий; аудит P27 на каждом переходе.

- Стейт‑машина (пример, JSON):
```json
{
  "states": ["draft","pending_checks","active","change_pending","on_leave","offboarding","inactive"],
  "transitions": [
    {"from":"draft","to":"pending_checks","on":"hire.request"},
    {"from":"pending_checks","to":"active","on":"hire.approve"},
    {"from":"active","to":"change_pending","on":"org.change.request"},
    {"from":"change_pending","to":"active","on":"org.change.apply"},
    {"from":"active","to":"on_leave","on":"leave.start"},
    {"from":"on_leave","to":"active","on":"leave.end"},
    {"from":"active","to":"offboarding","on":"terminate.request"},
    {"from":"offboarding","to":"inactive","on":"terminate.apply"}
  ],
  "guards": {
    "hire.approve": ["check_documents","rbac:hr.admin"],
    "terminate.apply": ["two_keys","handover_complete"]
  }
}
```

#### 28.3 REST/WS контракты для HR потоков (тенант DigiStaff)

```json
POST /api/admin/hr/person               
{ "display_name":"Эйдос-1", "is_digital": true, "attrs": {"locale":"ru-RU"} }

POST /api/admin/hr/assignment           
{ "person_id":"uuid", "position_id":"uuid", "employment_type":"internal", "valid_from":"2025-11-01", "grade":"L3" }

POST /api/admin/hr/action               
{ "person_id":"uuid", "action_type":"hire", "effective_date":"2025-11-01", "payload": {"checks":["nda","dpa"]} }

POST /api/admin/hr/time                 
{ "person_id":"uuid", "ts_start":"2025-11-02T08:00:00Z", "ts_end":"2025-11-02T17:00:00Z", "kind":"work" }

GET  /api/admin/hr/person/{id}          
GET  /api/admin/hr/assignment?person_id=uuid&at=2025-11-15
GET  /api/admin/hr/actions?person_id=uuid&from=2025-11-01&to=2025-11-30

WS: hr.lifecycle.event { person_id, state_from, state_to, action, ts }
```

- Политики/валидации:
  - Версионность назначений (SCD‑2): UPDATE закрывает `valid_to`, INSERT открывает новый интервал.
  - Борьба с пересечениями периодов назначений (детерминированные CHECK‑функции).
  - Маскирование PII, доступ через `soul.admin`/HR роли; все секреты/DSN из БД.

#### 28.4 Безопасность, RBAC и соответствие SAP HR

- Соответствие HR best practices (SAP):
  - Job Architecture: `hr_jobs` ↔ должности/компетенции; `hr_positions` ↔ штатные единицы; связи с орг‑единицами.
  - Personnel Actions: `hr_actions` фиксирует жизненные события (аналог IT0000) с детальными payload.
  - Org Assignment: `hr_assignments` (аналог IT0001) с валидными интервалами.
  - Personal Data: персональные поля держать в `hr_persons.attrs` с политиками доступа.
  - Time Management: `hr_time_events` (CATS/IT2001/2002) — единая лента времени.

- RBAC/Namespaces:
  - Роли: `hr.admin`, `hr.manager`, `hr.viewer`, `operator`; цифровые сотрудники получают ограниченные тех‑роли по namespace.
  - Политики строк/вью: ограничение чтения по org_unit/position/namespace.

- Наблюдаемость/алерты:
  - Метрики целостности: пересечения интервалов, сиротские назначения, отсутствие активного назначения.
  - Алерты с action steps (исправить интервал/закрыть запись/создать назначение).

#### 28.5 Кэширование и производительность

- Redis‑кэш:
  - Ключи: `hr:person:{id}`, `hr:assignment:active:{person_id}`, `hr:orgtree:{org_unit_id}`.
  - TTL/инвалидация по событиям `hr.lifecycle.event` и DDL‑триггерам Alembic миграций.
  - Настройки в `soul_settings` (`redis.*`).

#### 28.6 Приёмка и KPI HR‑контуров

- Acceptance:
  - Hire → Assignment → Active: без пересечений интервалов, видимость в WS событиях.
  - Transfer/Promotion: корректное закрытие/создание назначений, KPI обновлены.
  - Leave/Return: рабочее время не учитывается на периоде leave; алерты при несогласованных событиях.

- KPI:
  - Время онбординга (TTO) p95; доля корректных назначений; доля пересечений интервалов = 0; доля событий без подписи P27 = 0.

### 28.13 Бизнес‑процессы Электронного Сотрудника, привязанные к должностной инструкции

- Цели раздела: формализовать трудовую деятельность ЭС через связку Должностная инструкция (ДИ) → бизнес‑процессы → рутины/плейбуки → метрики/отчёты/оповещения.

- Модели (эскизы БД):
```sql
create table if not exists jd_job_descriptions (
  jd_id uuid primary key,
  position_id uuid references hr_positions(position_id) on delete cascade,
  title text not null,
  goals jsonb not null default '[]',        -- цели роли
  duties jsonb not null default '[]',       -- обязанности (вербально)
  tools jsonb not null default '[]',        -- инструменты/интерфейсы
  kpi jsonb not null default '{}',          -- KPI/OKR
  reports jsonb not null default '[]',      -- требуемые отчёты
  alerts jsonb not null default '[]',       -- ожидаемые оповещения
  interactions jsonb not null default '[]', -- с кем и по каким темам
  schedule jsonb not null default '{}',     -- периодичности работ
  created_at timestamptz not null default now()
);

create table if not exists jd_processes (
  process_id uuid primary key,
  jd_id uuid not null references jd_job_descriptions(jd_id) on delete cascade,
  key text not null,
  name text not null,
  description text,
  periodicity text,  -- cron/weekly/daily/on_event
  inputs jsonb not null default '[]',
  outputs jsonb not null default '[]',
  tools jsonb not null default '[]',
  rasi jsonb not null default '{}',
  expected_results jsonb not null default '[]'
);

create table if not exists jd_process_bindings (
  binding_id uuid primary key,
  process_id uuid not null references jd_processes(process_id) on delete cascade,
  de_id uuid not null references digital_employees(de_id) on delete cascade,
  routine_id uuid, -- связь с operational рутиною
  active boolean not null default true,
  attrs jsonb not null default '{}'
);
```

- Связка с рутинами (operational): каждый `jd_process` должен иметь рутину исполнения с шагами/ожиданиями/подписями. В расписании учитываются календари/смены и leave.

- Детализация содержания ДИ для ЭС:
  - Какие работы выполняет: список `jd_processes` с inputs/outputs и tools.
  - Периодичность: `periodicity` (cron/weekly/daily/on_event) и связь с `routines.schedule`.
  - Результаты: `expected_results` + фактические артефакты в отчётах.
  - Инструменты: `tools` (API/сервисы/панели), конфиги из `soul_settings`/`soul_secrets`.
  - Цели/обязанности: `goals|duties` маппятся на KPI/OKR.
  - Взаимодействия: `interactions` → `hr_interactions`/ChatOps/Tickets (каналы и темы).
  - Отчёты: `reports` → расписание генерации + хранение метаданных.
  - Оповещения: `alerts` → правила нотификаций (канал/уровень/получатели), интеграция с RASI.
  - Управляющие воздействия (ожидания): список команд/флагов/событий от людей с ролями (RASI) и SLA реакции.

- Контракты:
```json
POST /api/admin/jd { "position_id":"uuid", "title":"ЭС: Аналитик данных", "goals":["Снижение p95"], "duties":["Мониторинг"], "tools":["grafana","hyperloop"], "kpi": {"p95_budget_ms": 60} }
POST /api/admin/jd/process { "jd_id":"uuid", "key":"daily_healthcheck", "name":"Ежедневный хелсчек", "periodicity":"daily", "tools":["hyperloop"], "expected_results":["Отчёт health"] }
POST /api/admin/jd/process/bind { "process_id":"uuid", "de_id":"uuid", "routine_id":"uuid" }
```

- Визуализация:
  - В карточке ЭС: вкладка «Должностная инструкция» с целями/обязанностями/процессами, статус выполнения рутин, ожидаемые воздействия.
  - На сцене: бейджи активных процессов, индикаторы «просрочено/выполнено», всплывающие подсказки по инструментам.

- Метрики и приёмка:
  - Доля выполненных в срок процессов; соответствие outputs ожидаемым; наличие отчётов по графику.
  - Acceptance: создание JD → добавление процесса → биндинг к ЭС → выполнение рутины → отчёт и оповещение; все шаги с P27 подписями и без хардкодов.

#### 28.7 PT — табели и календари смен (для цифровых сотрудников)

- Модели PT (эскизы):
```sql
create table if not exists hr_work_calendars (
  calendar_id uuid primary key,
  name text not null,
  tz text not null,
  rules jsonb not null default '[]', -- правила смен/выходных/праздников
  created_at timestamptz not null default now()
);

create table if not exists hr_shifts (
  shift_id uuid primary key,
  calendar_id uuid not null references hr_work_calendars(calendar_id) on delete cascade,
  name text not null,
  dow int[] not null,
  time_from time not null,
  time_to time not null,
  break_minutes int not null default 0,
  attrs jsonb not null default '{}'
);

create table if not exists hr_roster (
  roster_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  calendar_id uuid not null references hr_work_calendars(calendar_id) on delete restrict,
  effective_from date not null,
  effective_to date,
  entries jsonb not null default '[]' -- генерация смен по правилам (SCD2)
);

create table if not exists hr_timesheets (
  timesheet_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  period_from date not null,
  period_to date not null,
  submitted_at timestamptz,
  approved_at timestamptz,
  status text not null default 'draft', -- draft|submitted|approved|rejected
  totals jsonb not null default '{}', -- work/overtime/leave
  attrs jsonb not null default '{}'
);

create table if not exists hr_timesheet_lines (
  line_id uuid primary key,
  timesheet_id uuid not null references hr_timesheets(timesheet_id) on delete cascade,
  ts_start timestamptz not null,
  ts_end timestamptz not null,
  kind text not null, -- work|overtime|break|leave|sick
  project_key text,
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_timesheet_lines_ts on hr_timesheet_lines(ts_start);
```

- Контракты PT:
```json
POST /api/admin/hr/calendar { "name":"24x7 Core", "tz":"Europe/Moscow", "rules": [ {"type":"week","dow":[1,2,3,4,5]} ] }
POST /api/admin/hr/shift { "calendar_id":"uuid", "name":"Day", "dow":[1,2,3,4,5], "time_from":"08:00", "time_to":"20:00", "break_minutes":60 }
POST /api/admin/hr/roster { "person_id":"uuid", "calendar_id":"uuid", "effective_from":"2025-11-01" }
POST /api/admin/hr/timesheet { "person_id":"uuid", "period_from":"2025-11-01", "period_to":"2025-11-15" }
POST /api/admin/hr/timesheet/{id}/submit {}
POST /api/admin/hr/timesheet/{id}/approve { "two_keys": true }
WS: hr.timesheet.event { timesheet_id, status, ts }
```

- Визуализация:
  - На сцене над персонажем — индикатор смены/статуса табеля (draft/submitted/approved), подсветка overtime, конфликт смен (алерт).
  - Мини‑календарь в карточке персоны с генерацией смен, перетаскивание (drag to reassign), алерты коллизий.

#### 28.8 Payroll — интеграция расчёта вознаграждения

- Модели и потоки:
```sql
create table if not exists payroll_rate_cards (
  rate_id uuid primary key,
  job_id uuid references hr_jobs(job_id),
  grade text,
  unit text not null, -- hour|day|event|token
  rate numeric not null,
  currency text not null,
  valid_from date not null,
  valid_to date
);

create table if not exists payroll_earnings (
  earning_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  period_from date not null,
  period_to date not null,
  items jsonb not null default '[]', -- агрегированные начисления по линиям табеля/событиям
  total numeric not null default 0,
  currency text not null,
  status text not null default 'calculated', -- calculated|approved|exported
  created_at timestamptz not null default now()
);
```

- Расчёт:
  - Из `hr_timesheet_lines` и `external_billing_events` формируется набор начислений по rate_cards (персональный приоритет: позиция→грейд→дефолт по job).
  - Two‑Keys на `approve`; экспорт в внешнюю систему `POST /api/integrations/payroll/export`.

- Контракты:
```json
POST /api/admin/payroll/rate { "job_id":"uuid", "grade":"L3", "unit":"hour", "rate":20, "currency":"USD", "valid_from":"2025-11-01" }
POST /api/admin/payroll/calc { "person_id":"uuid", "period_from":"2025-11-01", "period_to":"2025-11-30" }
POST /api/admin/payroll/approve { "earning_id":"uuid", "two_keys": true }
GET  /api/admin/payroll/statement/{earning_id}
```

- Визуализация:
  - В карточке персоны/команды — слой «Cost»: прогноз/факт, вклад overtime, подсветка аномалий.
  - На сцене — цветовой градиент по cost_rate и KPI, балансы бюджетов.

#### 28.9 Справочники грейдов/компетенций и маппинг в цифрового сотрудника

- Модели:
```sql
create table if not exists hr_grades (
  grade_key text primary key,
  description text,
  salary_band jsonb not null default '{}', -- min/max/currency
  attrs jsonb not null default '{}'
);

create table if not exists hr_competencies (
  comp_key text primary key,
  name text not null,
  description text,
  level_scale jsonb not null default '{"min":1,"max":5}'
);

create table if not exists hr_job_competencies (
  job_id uuid not null references hr_jobs(job_id) on delete cascade,
  comp_key text not null references hr_competencies(comp_key) on delete cascade,
  required_level int not null,
  primary key(job_id, comp_key)
);

-- Профиль цифрового сотрудника ↔ компетенции/грейд
alter table if exists digital_employees add column if not exists grade text;
alter table if exists digital_employees add column if not exists competency_profile jsonb not null default '[]';
```

- Контракты:
```json
POST /api/admin/hr/grade { "grade_key":"L3", "salary_band": {"min": 2000, "max": 4000, "currency": "USD"} }
POST /api/admin/hr/competency { "comp_key":"python", "name":"Python", "description":"" }
POST /api/admin/hr/job-competency { "job_id":"uuid", "comp_key":"python", "required_level":4 }
PUT  /api/admin/digital-employee/{de_id}/profile { "grade":"L3", "competency_profile": [{"comp_key":"python","level":4}] }
```

- Визуализация:
  - Отображение уровня компетенций и расхождений с требуемыми по должности (heatmap/бейджи).
  - Фильтры по грейду/компетенциям на сцене; подсветка рисков несоответствия.

#### 28.10 Отпуска/праздники per‑org и перераспределение смен

- Модели:
```sql
create table if not exists hr_holiday_calendars (
  holiday_calendar_id uuid primary key,
  org_unit_id uuid, -- опциональная привязка к организации/стране
  name text not null,
  tz text not null,
  days jsonb not null default '[]' -- [{date:"2025-01-01", kind:"public"}]
);

create table if not exists hr_leaves (
  leave_id uuid primary key,
  person_id uuid not null references hr_persons(person_id) on delete cascade,
  date_from date not null,
  date_to date not null,
  leave_type text not null, -- annual|sick|unpaid|training
  status text not null default 'requested', -- requested|approved|rejected|cancelled
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_leaves_person on hr_leaves(person_id);
```

- Потоки:
  - Генерация смен учитывает `hr_holiday_calendars` и исключает approved `hr_leaves`.
  - Перераспределение смен: `operator` или менеджер инициирует reassign/cover; валидация конфликтов и квот, события WS `shift.reassign`.

- Контракты:
```json
POST /api/admin/hr/holiday-calendar { "name":"RU 2025", "tz":"Europe/Moscow", "days":[{"date":"2025-01-01","kind":"public"}] }
POST /api/admin/hr/leave { "person_id":"uuid", "date_from":"2025-12-28", "date_to":"2026-01-08", "leave_type":"annual" }
POST /api/admin/hr/leave/{id}/approve { "two_keys": true }
POST /api/admin/hr/shift/reassign { "from_person_id":"uuid", "to_person_id":"uuid", "ts_start":"2025-11-10T08:00:00Z", "ts_end":"2025-11-10T20:00:00Z" }
WS: hr.shift.event { type:"reassign|conflict|approved", payload:{...}, ts }
```

- Визуализация:
  - Календарь праздников per‑org в UI; индикаторы leave на таймлайне персоны (полупрозрачная маска), подсветка незакрытых смен.
  - Инструмент «перетяни для замещения» (drag‑and‑drop) с подсказками конфликтов и доступных кандидатов.

#### 28.11 Взаимодействие Электронного сотрудника с коллегами

- Модель взаимодействий:
```sql
create table if not exists hr_interactions (
  interaction_id uuid primary key,
  from_person_id uuid not null references hr_persons(person_id) on delete cascade,
  to_person_id uuid not null references hr_persons(person_id) on delete cascade,
  channel text not null, -- chatops|ticket|email|meet|api
  topic text,
  ts timestamptz not null default now(),
  context jsonb not null default '{}', -- ссылки на рутины/таски/incidents
  signatures jsonb not null default '[]'
);
create index if not exists ix_hr_interactions_pair on hr_interactions(from_person_id, to_person_id);
```

- Правила:
  - Для цифровых сотрудников каналами по умолчанию являются `chatops|api|ticket`; вся чувствительная переписка — ссылками из БД, без инлайна секретов.
  - Подписи P27 обязательны; RBAC по namespaces и ролям.

- Контракты:
```json
POST /api/admin/hr/interaction { "from_person_id":"de-uuid", "to_person_id":"uuid", "channel":"chatops", "topic":"handover", "context": {"routine_id":"uuid"} }
GET  /api/admin/hr/interactions?person_id=uuid&limit=50
```

- Визуализация:
  - Рёбра взаимодействий на сцене (легкие линии), фильтры по каналам/темам, всплывающие карточки последних действий.

#### 28.12 Иерархия/субординация и RASI‑матрица

- Модели:
```sql
create table if not exists hr_rasi (
  rasi_id uuid primary key,
  process_key text not null,
  org_unit_id uuid,
  position_id uuid,
  role text not null, -- R|A|S|I
  attrs jsonb not null default '{}'
);
create index if not exists ix_hr_rasi_process on hr_rasi(process_key);
```

- Правила и маппинг:
  - RASI связывается с орг‑структурой (org_unit/position) и наследуется на персон через активные назначения.
  - Электронный сотрудник следует субординации: действия, требующие A (Accountable), требуют подтверждения роли A; уведомления по I.

- Контракты:
```json
POST /api/admin/hr/rasi { "process_key":"incident_response", "org_unit_id":"uuid", "position_id":"uuid", "role":"R" }
GET  /api/admin/hr/rasi?process_key=incident_response&org_unit_id=uuid
```

- Визуализация:
  - Контур подчинённости на сцене (иерархия org_units/positions); бейджи R/A/S/I на карточках.
  - При исполнении рутины отображать требуемые роли и подтверждения в реальном времени.

##### 28.12.1 RASI enforcement в operator.actions

- Правила валидации:
  - Для каждого `operator/action` с `process_key` система вычисляет эффективные роли R/A/S/I из `hr_rasi` по `org_unit_id/position_id` активного назначения инициатора и цели (`target_ref`).
  - Требования по умолчанию:
    - `escalate|terminate|payroll_approve` требуют роли `A` (Accountable) или делегирование с Two‑Keys от `A`.
    - `reassign|throttle|evacuate` требуют роли `R` (Responsible) или `A`.
    - `pause|resume` требуют `R` или подтверждения `A` (Two‑Keys для high‑risk зон).
  - Все действия записывают подписи P27 и причину/контекст.

- Пример SQL‑функции‑гварда (псевдокод):
```sql
create or replace function check_rasi_permission(
  p_actor uuid,
  p_process_key text,
  p_action text,
  p_target_kind text,
  p_target_id uuid
) returns boolean as $$
declare
  v_required_roles text[];
  v_has_role boolean := false;
begin
  -- маппинг действий → роли
  select array['A'] into v_required_roles where p_action in ('escalate','terminate','payroll_approve');
  if v_required_roles is null then
    select array['R','A'] into v_required_roles;
  end if;

  -- проверка наследованных ролей из hr_rasi по текущему назначению актёра
  select exists (
    select 1 from hr_rasi r
    join hr_assignments a on a.person_id = p_actor
    where r.process_key = p_process_key
      and (r.position_id = a.position_id or r.org_unit_id in (
        select org_unit_id from hr_positions where position_id = a.position_id
      ))
      and r.role = any(v_required_roles)
  ) into v_has_role;

  return v_has_role;
end; $$ language plpgsql stable;
```

- Ошибки/метрики:
  - `403 rasi_forbidden`: отсутствует требуемая роль; аннотация — требуемые роли и ближайший владелец `A`.
  - Метрики: `operator.action.rasi_denied_total{action,process}`, `operator.action.rasi_pass_total{action,process}`.

##### 28.12.2 Матрица action→RASI и UI‑подсказки оператора

- Таблица политик (эскиз):
```sql
create table if not exists hr_action_policies (
  action text primary key,
  process_key text not null,
  required_roles text[] not null, -- например ['A'] или ['R','A']
  two_keys_required boolean not null default false,
  attrs jsonb not null default '{}'
);

insert into hr_action_policies(action,process_key,required_roles,two_keys_required) values
  ('escalate','incident_response', '{"A"}', true)
  on conflict (action) do nothing;
```

- API подсказок и поиска ближайшего `A`:
```json
GET /api/admin/hr/rasi/hints?action=payroll_approve&process_key=payroll_approve&target_ref.kind=timesheet&target_ref.id=uuid
-> { "required_roles": ["A"], "nearest_accountable": [{"person_id":"uuid","distance":1,"position_id":"uuid"}], "eligible_substitutes": [{"person_id":"uuid"}] }
```

- Примеры UI‑подсказок (для новых ролей):
  - Для `assistant.operator` при `pause` (ops_control, medium):
    - Tooltip: «Требуемые роли: R или A. У вас роль R. Необходимы Two‑Keys: Да (medium). Носитель A: Иван Петров (PM, distance=1).»
    - CTA: «Запросить подтверждение у A» (Two‑Keys) + «Показать политику» (ссылка на `rbac.policies`).
  - Для `digital_employee` при попытке `throttle` (performance_control):
    - Tooltip: «Недостаточно прав. Требуются роли: R или A. Ваша роль: I. Обратитесь к оператору.»
    - CTA: «Создать заявку оператору» (формирует запрос с контекстом).
  - Для `digistaff.admin` при `payroll_approve` (high):
    - Tooltip: «Роль A обнаружена. Two‑Keys: требуется. Second‑key: назначить согласующего».
    - CTA: «Отправить запрос на одобрение» (Two‑Keys) + «Просмотреть политику действия».

- Алгоритм поиска ближайшего `A` (эскиз):
  - По активному назначению цели (`target_ref`) поднимаемся по иерархии `position → org_unit → parent_org_unit ...` и ищем первую запись `hr_rasi` с `role='A'` и процессом `process_key`.
  - Если не найдено — fallback на глобальные политики процесса в Core.
  - Результат кэшируется в Redis с коротким TTL и инвалидацией по изменениям RASI/назначений.

- UI‑подсказки:
  - В карточке действия оператору показываются: требуемые роли, найденные носители `A`, кнопка «запросить подтверждение» (Two‑Keys), список допустимых заменителей (`eligible_substitutes`).
  - В сцене у персоны подсвечивается бейдж «A»; ховер на действии — тултип с подсказками RASI и ссылками на политику.

##### 28.12.3 Примеры action→RASI и Two‑Keys (policy table)

| action | process_key | required_roles | two_keys_required | note |
|---|---|---|---|---|
| pause | ops_control | R or A | false | для критических зон может требоваться подтверждение A |
| resume | ops_control | R or A | false | при аварийных режимах — Two‑Keys |
| throttle | performance_control | R or A | false | изменение квот/лимитов |
| reassign | shift_reassign | R or A | false | проверка конфликтов/квот, уведомление I |
| evacuate | incident_response | R or A | true | high‑risk действие, уведомление A/S/I |
| escalate | incident_response | A | true | обязательна роль A и Two‑Keys при критичности |
| terminate | hr_lifecycle | A | true | оффбординг требует A и подтверждение |
| payroll_approve | payroll_approve | A | true | финальное утверждение начислений |

##### 28.12.3.1 Расширение RASI под роли `digital_employee`, `digistaff.admin`, `assistant.operator`

- Маппинг ролей на RASI по процессам (минимум):
  - ops_control: `assistant.operator` → R, `digistaff.admin` → A, `digital_employee` → I.
  - performance_control: `assistant.operator` → R, `digistaff.admin` → A, `digital_employee` → I.
  - incident_response: `digistaff.admin` → A, `assistant.operator` → R, `digital_employee` → I.
  - hr_lifecycle: `digistaff.admin` → A, `assistant.operator` → S (поддержка/инициация запросов), `digital_employee` → I.
  - payroll_approve: `digistaff.admin` → A, `assistant.operator` → S, `digital_employee` → I.

- Политики Two‑Keys и авто‑эскалации для новых ролей:
  - На уровнях `high` в ops_control/performance_control — требовать Two‑Keys от A (`digistaff.admin`); R (`assistant.operator`) инициирует.
  - Для incident_response/terminate/payroll_approve — всегда Two‑Keys при `medium|high`.

- Примеры записей в `hr_action_policies` с атрибутами роли/namespace:
```sql
insert into hr_action_policies(action,process_key,required_roles,two_keys_required,attrs) values
  ('pause','ops_control','{"R","A"}', false, '{"role_map":{"R":"assistant.operator","A":"digistaff.admin"}}'),
  ('resume','ops_control','{"R","A"}', false, '{"role_map":{"R":"assistant.operator","A":"digistaff.admin"}}'),
  ('throttle','performance_control','{"R","A"}', false, '{"role_map":{"R":"assistant.operator","A":"digistaff.admin"}}'),
  ('evacuate','incident_response','{"R","A"}', true, '{"role_map":{"R":"assistant.operator","A":"digistaff.admin"}}'),
  ('escalate','incident_response','{"A"}', true, '{"role_map":{"A":"digistaff.admin"}}'),
  ('terminate','hr_lifecycle','{"A"}', true, '{"role_map":{"A":"digistaff.admin"}}'),
  ('payroll_approve','payroll_approve','{"A"}', true, '{"role_map":{"A":"digistaff.admin"}}')
on conflict (action) do nothing;
```

- UI‑подсказки оператору отражают маппинг ролей и ближайшего носителя `A` (см. hints API).

##### 28.12.4 Уровни критичности и авто‑эскалация требований

- Модель критичности:
```sql
create table if not exists hr_action_severity (
  action text primary key,
  low jsonb not null,    -- { required_roles: [...], two_keys: false }
  medium jsonb not null, -- { required_roles: [...], two_keys: true? }
  high jsonb not null    -- { required_roles: [...], two_keys: true }
);
```

- Политика по умолчанию:
  - pause/resume: low→`R or A`, no Two‑Keys; medium→`R or A`, Two‑Keys; high→`A`, Two‑Keys.
  - throttle/reassign: low/medium→`R or A`, no Two‑Keys; high→`A`, Two‑Keys.
  - evacuate/escalate/terminate/payroll_approve: всегда `A`, Two‑Keys при medium/high.

- Авто‑эскалация:
  - severity определяется по правилам: SLO breach, p95>budget×K, impacted_users, data_sensitivity, time_of_day.
  - при повышении до high UI автоматически требует Two‑Keys и наличие роли `A` (или делегирование).

- Визуализация и метрики:
  - Бейдж уровня (L/M/H) на действии; подсказки с критериями и требуемыми ролями.
  - Метрики: `operator.action.severity{action,level}`, доля отказов по RASI на high.

##### 28.12.5 Политики действий по процессам (детализация)

- Регистр политик (jsonb в Settings DB): `rbac.policies` со структурой:
```json
{
  "ops_control": {
    "pause": {"required_roles": ["R","A"], "two_keys": {"low": false, "medium": true, "high": true}},
    "resume": {"required_roles": ["R","A"], "two_keys": {"low": false, "medium": true, "high": true}}
  },
  "performance_control": {
    "throttle": {"required_roles": ["R","A"], "two_keys": {"low": false, "medium": false, "high": true}}
  },
  "incident_response": {
    "evacuate": {"required_roles": ["R","A"], "two_keys": {"low": true, "medium": true, "high": true}},
    "escalate": {"required_roles": ["A"], "two_keys": {"low": true, "medium": true, "high": true}}
  },
  "hr_lifecycle": {
    "terminate": {"required_roles": ["A"], "two_keys": {"low": true, "medium": true, "high": true}}
  },
  "payroll_approve": {
    "payroll_approve": {"required_roles": ["A"], "two_keys": {"low": true, "medium": true, "high": true}}
  }
}
```

- Наследование per‑org/namespace: допускается overlay ключом `rbac.policies.<org_key>|<namespace>`; инспектор `registry.enforce` проверяет валидность схемы.
- Контракты админа:
```json
POST /api/admin/rbac/policies/upsert { "scope": "global|org:<org>|ns:<ns>", "policies": { ... } }
GET  /api/admin/rbac/policies?scope=org:<org>
```


#### 28.14 Примеры JD для типовых ролей (12)

- Общие настройки по умолчанию: рабочее время 12 часов/день, 6 дней/нед., отпуск 3 дня/год (можно переопределить per‑org/per‑persona через PT/leave/roster).

1) ЭС‑Аналитик данных
```json
{
  "title": "ЭС: Аналитик данных",
  "goals": ["Снижение p95", "Улучшение качества инсайтов"],
  "duties": ["Мониторинг метрик", "Подготовка отчётов"],
  "tools": ["grafana","hyperloop","sql"],
  "processes": [
    {"key":"daily_healthcheck","name":"Ежедневный хелсчек","periodicity":"daily","outputs":["report.health"]},
    {"key":"weekly_insights","name":"Еженедельные инсайты","periodicity":"weekly","outputs":["report.insights"]}
  ],
  "knowledge": ["метрики p95/p50","Prometheus/Grafana","SQL оптимизация"],
  "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3}
}
```

2) ЭС‑Оператор
```json
{ "title":"ЭС: Оператор", "goals":["Стабильность процессов"], "duties":["Запуск рутин","Реакция на алерты"], "tools":["hyperloop","chatops"], "processes":[{"key":"routine_run","name":"Запуск рутин","periodicity":"daily"}], "knowledge":["P27 подписи","операторские сценарии"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

3) ЭС‑Инспектор качества
```json
{ "title":"ЭС: Инспектор качества", "goals":["Соблюдение SLO"], "duties":["Проверка соответствия","инциденты"], "tools":["inspector","grafana"], "processes":[{"key":"slo_audit","name":"Аудит SLO","periodicity":"weekly"}], "knowledge":["SLA/SLO","инцидент‑менеджмент"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

4) ЭС‑Планировщик
```json
{ "title":"ЭС: Планировщик", "goals":["Оптимизация расписаний"], "duties":["Построение roster"], "tools":["calendar","hyperloop"], "processes":[{"key":"roster_build","name":"Построение графиков","periodicity":"weekly"}], "knowledge":["PT/roster","квоты RPS"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

5) ЭС‑HR
```json
{ "title":"ЭС: HR", "goals":["Своевременный hire/offboarding"], "duties":["Документооборот","назначения"], "tools":["hr"], "processes":[{"key":"onboarding","name":"Онбординг","periodicity":"on_event"},{"key":"offboarding","name":"Оффбординг","periodicity":"on_event"}], "knowledge":["PA/OM","RASI"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

6) ЭС‑Бухгалтер
```json
{ "title":"ЭС: Бухгалтер", "goals":["Корректный Payroll"], "duties":["Расчёт","утверждение"], "tools":["payroll"], "processes":[{"key":"payroll_calc","name":"Расчёт зарплат","periodicity":"monthly"},{"key":"payroll_approve","name":"Утверждение","periodicity":"monthly"}], "knowledge":["rate_cards","налоги"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

7) ЭС‑Секретарь
```json
{ "title":"ЭС: Секретарь", "goals":["Своевременные встречи/документы"], "duties":["Календарь","Письма"], "tools":["calendar","email","chatops"], "processes":[{"key":"meetings","name":"Планирование встреч","periodicity":"daily"}], "knowledge":["iCal","этикет"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

8) ЭС‑Менеджер проекта
```json
{ "title":"ЭС: Менеджер проекта", "goals":["Сроки/бюджет"], "duties":["План/отчёты"], "tools":["planning","tickets"], "processes":[{"key":"cpm_track","name":"Отслеживание CPM","periodicity":"daily"},{"key":"weekly_status","name":"Статус‑отчёт","periodicity":"weekly"}], "knowledge":["CPM","SOW"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

9) ЭС‑Администратор проекта
```json
{ "title":"ЭС: Администратор проекта", "goals":["Поддержка процессов"], "duties":["Настройки","доступы"], "tools":["admin","secrets"], "processes":[{"key":"access_review","name":"Ревью доступов","periodicity":"monthly"}], "knowledge":["RBAC","SecretsService"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

10) ЭС‑Биржевой трейдер
```json
{ "title":"ЭС: Биржевой трейдер", "goals":["Доходность"], "duties":["Стратегии","сделки"], "tools":["market_api"], "processes":[{"key":"market_scan","name":"Скан рынка","periodicity":"hourly"},{"key":"trade_execute","name":"Исполнение сделок","periodicity":"on_event"}], "knowledge":["риск‑менеджмент","биржевые API"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

11) ЭС‑Инженер поддержки
```json
{ "title":"ЭС: Инженер поддержки", "goals":["Снижение инцидентов"], "duties":["Тикеты","ремедиация"], "tools":["tickets","grafana"], "processes":[{"key":"ticket_triage","name":"Триаж тикетов","periodicity":"daily"}], "knowledge":["SLA","playbooks"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

12) ЭС‑Data Engineer
```json
{ "title":"ЭС: Data Engineer", "goals":["Надёжность ETL"], "duties":["Пайплайны","качество данных"], "tools":["sql","etl"], "processes":[{"key":"etl_monitor","name":"Мониторинг ETL","periodicity":"daily"},{"key":"schema_change","name":"Изменения схем","periodicity":"on_event"}], "knowledge":["indexing","partitioning"], "schedule": {"hours_per_day":12,"days_per_week":6,"vacation_days":3} }
```

#### 28.14.1 Биндинги к `digital_employees` и генерация стартовых рутин

- Примерные `digital_employees` (эскиз):
```json
[
  {"de_id":"de-analyst-1","person_id":"p-analyst-1","grade":"L3","competency_profile":[{"comp_key":"sql","level":4}]},
  {"de_id":"de-operator-1","person_id":"p-operator-1","grade":"L2"},
  {"de_id":"de-inspector-1","person_id":"p-inspector-1","grade":"L3"},
  {"de_id":"de-planner-1","person_id":"p-planner-1","grade":"L3"},
  {"de_id":"de-hr-1","person_id":"p-hr-1","grade":"L3"},
  {"de_id":"de-accountant-1","person_id":"p-accountant-1","grade":"L3"},
  {"de_id":"de-secretary-1","person_id":"p-secretary-1","grade":"L2"},
  {"de_id":"de-pm-1","person_id":"p-pm-1","grade":"L3"},
  {"de_id":"de-admin-1","person_id":"p-admin-1","grade":"L3"},
  {"de_id":"de-trader-1","person_id":"p-trader-1","grade":"L3"},
  {"de_id":"de-support-1","person_id":"p-support-1","grade":"L2"},
  {"de_id":"de-de-1","person_id":"p-de-1","grade":"L3"}
]
```

- Генерация биндингов `jd_process_bindings` + стартовых рутин (шаблон):
```json
POST /api/admin/jd/bootstrap
{
  "jd": { "position_id": "uuid", "title": "ЭС: Аналитик данных", "goals": ["Снижение p95"], "tools":["grafana","hyperloop"], "kpi": {"p95_budget_ms": 60} },
  "processes": [
    {"key":"daily_healthcheck","name":"Ежедневный хелсчек","periodicity":"daily","expected_results":["report.health"]}
  ],
  "bind": { "de_id": "de-analyst-1" },
  "routine": {
    "name": "Daily Healthcheck",
    "schedule": {"cron": "0 8 * * 1-6", "tz": "Europe/Moscow"},
    "steps": [
      {"type":"hyperloop", "command": "INSPECTOR.RUN key=planning.enforce WITH TRACE"},
      {"type":"metric_check", "metric": "processor.time_send_to_recv_ms", "p95_budget_ms": 120}
    ],
    "expected": {"alerts": 0}
  }
}
```

- Рекомендованные биндинги (сопоставление ключ → de_id):
```json
{
  "daily_healthcheck":"de-analyst-1",
  "weekly_insights":"de-analyst-1",
  "routine_run":"de-operator-1",
  "slo_audit":"de-inspector-1",
  "roster_build":"de-planner-1",
  "onboarding":"de-hr-1",
  "offboarding":"de-hr-1",
  "payroll_calc":"de-accountant-1",
  "payroll_approve":"de-accountant-1",
  "meetings":"de-secretary-1",
  "cpm_track":"de-pm-1",
  "weekly_status":"de-pm-1",
  "access_review":"de-admin-1",
  "market_scan":"de-trader-1",
  "trade_execute":"de-trader-1",
  "ticket_triage":"de-support-1",
  "etl_monitor":"de-de-1",
  "schema_change":"de-de-1"
}
```

- Acceptance (bootstrap примеров): создать JD+процессы → bind к указанным `de_id` → создать рутину с расписанием → увидеть события `routines.run.event` и отчёты, RASI/Severity соблюдены.

### 31. A/B‑метрики для проверки эффективности UI‑подсказок

- Минимальный набор метрик (per action/process/role):
  - `ui.hint.view_total{action,process,role,variant}` — показы подсказки.
  - `ui.hint.click_cta_total{action,process,role,variant,cta}` — клики по CTA (Two‑Keys, запрос к A, заявка оператору).
  - `operator.action.success_total{action,process,role,variant}` — успешные выполнения после подсказки.
  - `operator.action.rasi_denied_total{action,process,role,variant}` — отказы RASI после подсказки.
  - `operator.action.time_to_action_ms_p50|p95{action,process,role,variant}` — время от подсказки до действия/успеха.
  - `two_keys.flow.success_rate{action,process,variant}` — конверсия запросов Two‑Keys в одобрения.

- Экспериментальные варианты (P28 feature flags):
  - `hints.variant=baseline|rich|minimal`.
  - Цели: увеличить success_rate и снизить time_to_action_p95 без роста denied_total.

- Acceptance A/B:
  - Стабильное различие ≥ 5% по success_rate (p<0.05) между лучшим вариантом и baseline за ≥ 3 дня наблюдений.
  - Отсутствие роста `rasi_denied_total` и нарушение SLO; визуальные алерты не должны увеличивать нагрузку WS.

#### 31.1 Примеры payload для записи метрик

```json
POST /api/admin/observability/ui/hint/event
{
  "action": "pause",
  "process": "ops_control",
  "role": "assistant.operator",
  "variant": "rich",
  "event": "view|cta_click|success|rasi_denied",
  "cta": "two_keys_request|request_A|create_ticket|none",
  "time_to_action_ms": 820,
  "context": {"target_ref": {"kind": "routine", "id": "uuid"}}
}

POST /api/admin/observability/two_keys/flow
{
  "action": "evacuate",
  "process": "incident_response",
  "variant": "rich",
  "requested_at": "2025-11-01T12:00:00Z",
  "approved_at": "2025-11-01T12:01:30Z",
  "approved": true,
  "approver_role": "digistaff.admin",
  "context": {"incident_id": "uuid"}
}
```

Правила: тела строго JSON, события идемпотентны по `(ts, actor, action, process, variant)`; PII не логировать.

#### 31.2 Агрегирующие отчёты/эндпоинты

```json
GET /api/admin/observability/ui/hints/summary?from=...&to=...&group_by=action,process,role,variant
-> {
  "items": [
    {
      "action": "pause",
      "process": "ops_control",
      "role": "assistant.operator",
      "variant": "rich",
      "view_total": 1200,
      "cta_click_total": 420,
      "success_total": 360,
      "rasi_denied_total": 15,
      "time_to_action_ms_p50": 700,
      "time_to_action_ms_p95": 1800
    }
  ]
}

GET /api/admin/observability/two_keys/summary?from=...&to=...&group_by=action,process,variant
-> {
  "items": [
    { "action": "evacuate", "process": "incident_response", "variant": "rich", "requests": 100, "approved": 87, "success_rate": 0.87 }
  ]
}
```

Требования: доступ RBAC `soul.admin`/`operator` (read‑only), агрегации выполняются на репликах; все ключи/адреса — через `SoulSettingsService`.

#### 31.3 Хранилище метрик, MV и индексы (Data DB, схема `observability`)

```sql
-- Схема
create schema if not exists observability;

-- События подсказок UI
create table if not exists observability_ui_hint_events (
  event_id uuid primary key,
  ts timestamptz not null default now(),
  action text not null,
  process text not null,
  role text not null,
  variant text not null,
  event text not null, -- view|cta_click|success|rasi_denied
  cta text,
  time_to_action_ms int,
  actor_id uuid,
  target_kind text,
  target_id uuid,
  idempotency_key text not null
);
create unique index if not exists ux_ui_hint_events_idem on observability_ui_hint_events(idempotency_key);
create index if not exists ix_ui_hint_events_ts on observability_ui_hint_events(ts);
create index if not exists ix_ui_hint_events_dims on observability_ui_hint_events(action,process,role,variant);

-- Потоки Two-Keys
create table if not exists observability_two_keys_flows (
  flow_id uuid primary key,
  action text not null,
  process text not null,
  variant text not null,
  requested_at timestamptz not null,
  approved_at timestamptz,
  approved boolean not null default false,
  approver_role text,
  idempotency_key text not null
);
create unique index if not exists ux_two_keys_flows_idem on observability_two_keys_flows(idempotency_key);
create index if not exists ix_two_keys_flows_dims on observability_two_keys_flows(action,process,variant);

-- Материализованные представления (MV)
create materialized view if not exists observability_ui_hints_mv as
select action, process, role, variant,
       count(*) filter (where event='view') as view_total,
       count(*) filter (where event='cta_click') as cta_click_total,
       count(*) filter (where event='success') as success_total,
       count(*) filter (where event='rasi_denied') as rasi_denied_total,
       percentile_cont(0.5) within group (order by time_to_action_ms) as time_to_action_ms_p50,
       percentile_cont(0.95) within group (order by time_to_action_ms) as time_to_action_ms_p95
from observability_ui_hint_events
group by action, process, role, variant;
create index if not exists ix_observability_ui_hints_mv_dims on observability_ui_hints_mv(action,process,role,variant);

create materialized view if not exists observability_two_keys_mv as
select action, process, variant,
       count(*) as requests,
       count(*) filter (where approved) as approved,
       (count(*) filter (where approved))::numeric / nullif(count(*),0) as success_rate
from observability_two_keys_flows
group by action, process, variant;
create index if not exists ix_observability_two_keys_mv_dims on observability_two_keys_mv(action,process,variant);

-- Рефреш (планируется): по расписанию/по событию вставки батча; инкрементальный рефреш допустим
```

Правила: партиционирование по дате (`ts`/`requested_at`) при высоких объёмах; агрегации строить на репликах; idempotency_key формировать детерминированно (hash от набора ключевых полей события).

#### 31.4 Alembic миграции для observability

- Голова: `alembic_data` (Data DB). Требования:
  - Миграции идемпотентны: `create schema if not exists`, `create table if not exists`, `create index if not exists`, `create materialized view if not exists`.
  - Для изменений MV — использовать `create or replace view` только для обычных вью; для MV — `drop ... if exists` + `create` с сохранением совместимости, либо безопасный `REFRESH CONCURRENTLY` (если поддерживается). Перед replace — блокировка в maintenance окне.
  - Индексы на партициях создавать через шаблон и автоматический хук после создания партиции.
  - Версионирование DDL: не ломать публичные контракты эндпоинтов; при изменении схемы — писать backfill/migrate‑скрипты.
- Инспекторы:
  - `INSPECTOR.RUN key=migration.guard` — видит актуальную голову `alembic_data` и отсутствие пустых/сломанных миграций.
  - `INSPECTOR.RUN_ALL` — не должно быть ошибок ссылочной целостности/прав доступа.

##### 31.4.1 Пример миграции Alembic (эскиз)

```python
# revision identifiers, used by Alembic.
revision = "2025_11_01_observability"
down_revision = "2025_10_31_prev"
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa

def upgrade():
    # schema
    op.execute("create schema if not exists observability")

    # tables (idempotent)
    op.execute(
        """
        create table if not exists observability_ui_hint_events (
          event_id uuid primary key,
          ts timestamptz not null default now(),
          action text not null,
          process text not null,
          role text not null,
          variant text not null,
          event text not null,
          cta text,
          time_to_action_ms int,
          actor_id uuid,
          target_kind text,
          target_id uuid,
          idempotency_key text not null
        )
        """
    )
    op.execute("create unique index if not exists ux_ui_hint_events_idem on observability_ui_hint_events(idempotency_key)")
    op.execute("create index if not exists ix_ui_hint_events_ts on observability_ui_hint_events(ts)")
    op.execute("create index if not exists ix_ui_hint_events_dims on observability_ui_hint_events(action,process,role,variant)")

    op.execute(
        """
        create table if not exists observability_two_keys_flows (
          flow_id uuid primary key,
          action text not null,
          process text not null,
          variant text not null,
          requested_at timestamptz not null,
          approved_at timestamptz,
          approved boolean not null default false,
          approver_role text,
          idempotency_key text not null
        )
        """
    )
    op.execute("create unique index if not exists ux_two_keys_flows_idem on observability_two_keys_flows(idempotency_key)")
    op.execute("create index if not exists ix_two_keys_flows_dims on observability_two_keys_flows(action,process,variant)")

    # materialized views
    op.execute(
        """
        create materialized view if not exists observability_ui_hints_mv as
        select action, process, role, variant,
               count(*) filter (where event='view') as view_total,
               count(*) filter (where event='cta_click') as cta_click_total,
               count(*) filter (where event='success') as success_total,
               count(*) filter (where event='rasi_denied') as rasi_denied_total,
               percentile_cont(0.5) within group (order by time_to_action_ms) as time_to_action_ms_p50,
               percentile_cont(0.95) within group (order by time_to_action_ms) as time_to_action_ms_p95
        from observability_ui_hint_events
        group by action, process, role, variant
        """
    )
    op.execute("create index if not exists ix_observability_ui_hints_mv_dims on observability_ui_hints_mv(action,process,role,variant)")

    op.execute(
        """
        create materialized view if not exists observability_two_keys_mv as
        select action, process, variant,
               count(*) as requests,
               count(*) filter (where approved) as approved,
               (count(*) filter (where approved))::numeric / nullif(count(*),0) as success_rate
        from observability_two_keys_flows
        group by action, process, variant
        """
    )
    op.execute("create index if not exists ix_observability_two_keys_mv_dims on observability_two_keys_mv(action,process,variant)")

def downgrade():
    # безопасный даунгрейд: опционально drop MV/таблиц, если не используются
    pass
```

#### 31.5 Smoke эндпоинт для рефреша MV

```json
POST /api/admin/observability/mv/refresh { "tables": ["ui_hints_mv","two_keys_mv"], "concurrently": true }
-> { "refreshed": ["ui_hints_mv","two_keys_mv"], "concurrently": true }
```

- Правила: RBAC `soul.admin`; по умолчанию `concurrently=true` (если поддерживается); логирование длительности/ошибок; опция `tables=[]` → рефреш всех observability MV.
- Acceptance: 200, MV обновлены, отчёт содержит длительность и список MV; при ошибках — человекочитаемая аннотация и рекомендации (снизить нагрузку/выполнить без concurrently в maintenance окне).

##### 31.5.1 Форматы логов и метрик рефреша

- Логи (пример записи):
```json
{
  "ts": "2025-11-01T12:03:00Z",
  "op": "mv.refresh",
  "tables": ["ui_hints_mv","two_keys_mv"],
  "concurrently": true,
  "duration_ms": 740,
  "status": "ok",
  "error": null
}
```

- Метрики:
  - `mv.refresh.duration_ms_p50|p95{table}`
  - `mv.refresh.total{table,status}` — ok|error
  - `mv.refresh.concurrently_total{table}` — доля concurrent‑рефрешей

##### 31.5.2 Фоновый hook рефреша MV

- Политика запуска: только на APP серверах под systemd; периодичность и список MV — через Settings DB.
- Ключи:
  - `observability.mv.refresh.enabled=true`
  - `observability.mv.refresh.interval_sec=300`
  - `observability.mv.refresh.tables=["ui_hints_mv","two_keys_mv"]`
  - `observability.mv.refresh.concurrently=true`
- Инварианты: без локальных while‑loops; управление только systemd; логировать p95/ошибки, при деградации — инцидент P50 и авто‑снижение частоты.

##### 31.5.3 Smoke‑скрипт CLI

```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
python .\Soul\scripts\hyperloop_cli.py --dsl "FLAGS.SET key=observability.mv.refresh.enabled value=true"
python .\Soul\scripts\hyperloop_cli.py --dsl "FLAGS.SET key=observability.mv.refresh.tables value='[\"ui_hints_mv\",\"two_keys_mv\"]'"
python .\Soul\scripts\hyperloop_cli.py --dsl "FLAGS.SET key=observability.mv.refresh.interval_sec value=300"
python .\Soul\scripts\hyperloop_cli.py --dsl "FLAGS.SET key=observability.mv.refresh.concurrently value=true"

# одноразовый рефреш и проверка сводок
python .\Soul\scripts\hyperloop_cli.py --dsl "OBS.MV.REFRESH tables=ui_hints_mv,two_keys_mv concurrently=true"
python .\Soul\scripts\hyperloop_cli.py --http-get https://mini.soulpulse.art/api/admin/observability/ui/hints/summary
python .\Soul\scripts\hyperloop_cli.py --http-get https://mini.soulpulse.art/api/admin/observability/two_keys/summary
```

##### 31.5.4 Планировщик (псевдокод APS/cron)

```python
# APS‑вариант (псевдокод)
from apscheduler.schedulers.asyncio import AsyncIOScheduler

def refresh_mv_job():
    tables = settings.get_json('observability.mv.refresh.tables', ['ui_hints_mv','two_keys_mv'])
    concurrently = settings.get_bool('observability.mv.refresh.concurrently', True)
    for t in tables:
        obs.refresh_mv(table=t, concurrently=concurrently)  # вызывает POST /api/admin/observability/mv/refresh

sched = AsyncIOScheduler()
interval = settings.get_int('observability.mv.refresh.interval_sec', 300)
sched.add_job(refresh_mv_job, 'interval', seconds=interval, id='obs_mv_refresh')
sched.start()
```

```cron
# cron‑вариант (вызов CLI один раз в интервал)
*/5 * * * * /usr/bin/python /var/www/soulpulse/Soul/scripts/hyperloop_cli.py --dsl "OBS.MV.REFRESH tables=ui_hints_mv,two_keys_mv concurrently=true" >> /var/log/soulpulse/obs_mv_refresh.log 2>&1
```

##### 31.5.5 systemd unit и timer (шаблон)

```ini
# /etc/systemd/system/soulpulse-obs-mv-refresh.service
[Unit]
Description=SoulPulse Observability MV Refresh
After=network-online.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/var/www/soulpulse
ExecStart=/usr/bin/python ./Soul/scripts/hyperloop_cli.py --dsl "OBS.MV.REFRESH tables=ui_hints_mv,two_keys_mv concurrently=true"
Nice=10

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/soulpulse-obs-mv-refresh.timer
[Unit]
Description=SoulPulse Observability MV Refresh Timer

[Timer]
OnUnitActiveSec=5min
AccuracySec=1min
Unit=soulpulse-obs-mv-refresh.service

[Install]
WantedBy=timers.target
```

##### 31.5.6 Политика отката и чек‑лист деградации

- Откат:
  - Остановить таймер: `systemctl stop soulpulse-obs-mv-refresh.timer`; отключить автозапуск: `systemctl disable soulpulse-obs-mv-refresh.timer`.
  - Выполнить ручной рефреш без concurrently в maintenance‑окне:
    - CLI: `python ./Soul/scripts/hyperloop_cli.py --dsl "OBS.MV.REFRESH tables=ui_hints_mv,two_keys_mv concurrently=false"`.
    - REST: `POST /api/admin/observability/mv/refresh { "concurrently": false }`.
  - Снизить частоту: `FLAGS.SET key=observability.mv.refresh.interval_sec value=900`.
- Чек‑лист деградации:
  - Журналы: `journalctl -u soulpulse-backend.service -n 200 --no-pager` (ошибки MV), логи сервиса рефреша.
  - Метрики: проверить `mv.refresh.duration_ms_p95`, `db.pool.usage{data}`, `replication.lag_ms{data}`.
  - Инцидент P50: создать с аннотациями (severity/risk + шаги действий: disable timer → manual refresh → снизить частоту → проверить репликацию/диск/WAL → эскалация DBA).
  - После стабилизации: включить таймер (`enable + start`), вернуть `concurrently=true`, наблюдать 2×15 мин.

##### 28.14.2 Массовая загрузка JSON через PowerShell/Hyperloop (file‑based)

- Подготовка payload:
```powershell
python .\Soul\scripts\generate_jd_bootstrap.py --out .\tmp\jd_payloads
```

- Массовая загрузка 12 файлов через Hyperloop REST v1 (file‑based, без inline JSON):
```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$H=@{ 'X-Telegram-User-ID'='468326902' }
$files = Get-ChildItem .\tmp\jd_payloads\jd_bootstrap_*.json
foreach ($f in $files) {
  $payload = Get-Content $f.FullName -Raw -Encoding UTF8
  $body = '{ "commands": "JD.BOOTSTRAP", "options": ' + $payload + ' }'
  $tmp = "tmp_body.json"
  $body | Set-Content -Path $tmp -Encoding UTF8 -NoNewline
  curl.exe -s -S -H "X-Telegram-User-ID: 468326902" -H "Content-Type: application/json" --data-binary "@$tmp" https://mini.soulpulse.art/api/hyperloop/execute
  Start-Sleep -Milliseconds 250
}
```

- Проверка (смоки):
```powershell
python .\Soul\scripts\hyperloop_cli.py --dsl "INSPECTOR.RUN key=planning.enforce"
python .\Soul\scripts\hyperloop_cli.py --dsl "INSPECTOR.RUN key=guard.canonical.urls"
```

##### 28.14.3 Экспорт и роллбек демо‑настроек (clean up)

- Экспорт созданных JD/процессов/биндингов/рутин (по `de_id`):
```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$H=@{ 'X-Telegram-User-ID'='468326902' }
$selectors = @{ de_ids = @(
  'de-analyst-1','de-operator-1','de-inspector-1','de-planner-1','de-hr-1','de-accountant-1',
  'de-secretary-1','de-pm-1','de-admin-1','de-trader-1','de-support-1','de-de-1'
) } | ConvertTo-Json -Compress
$body = '{ "commands": "JD.EXPORT", "options": ' + $selectors + ' }'
$body | Set-Content -Path tmp_export_body.json -Encoding UTF8 -NoNewline
curl.exe -s -S -H "X-Telegram-User-ID: 468326902" -H "Content-Type: application/json" --data-binary "@tmp_export_body.json" https://mini.soulpulse.art/api/hyperloop/execute | Set-Content -Path .\tmp\jd_payloads\export.json -Encoding UTF8
```

- Роллбек (удаление JD/процессов/биндингов/рутин) для указанных `de_id` (опасная операция — рекомендуется Two‑Keys):
```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$H=@{ 'X-Telegram-User-ID'='468326902' }
$selectors = @{ de_ids = @(
  'de-analyst-1','de-operator-1','de-inspector-1','de-planner-1','de-hr-1','de-accountant-1',
  'de-secretary-1','de-pm-1','de-admin-1','de-trader-1','de-support-1','de-de-1'
); delete_routines = $true; delete_bindings = $true; delete_jd = $true } | ConvertTo-Json -Compress
$body = '{ "commands": "JD.ROLLBACK", "options": ' + $selectors + ' }'
$body | Set-Content -Path tmp_rollback_body.json -Encoding UTF8 -NoNewline
curl.exe -s -S -H "X-Telegram-User-ID: 468326902" -H "Content-Type: application/json" --data-binary "@tmp_rollback_body.json" https://mini.soulpulse.art/api/hyperloop/execute
```

- После роллбека повторно прогнать инспекторы (read‑only):
```powershell
python .\Soul\scripts\hyperloop_cli.py --dsl "INSPECTOR.RUN key=planning.enforce"
python .\Soul\scripts\hyperloop_cli.py --dsl "INSPECTOR.RUN key=guard.canonical.urls"
```

- ### 29. Доработка структуры БД: трёхконтурная архитектура (Core/Data/Graph)

- Цель: подготовить систему к распределённой БД без изменения текущей топологии (по умолчанию: один APP и один сервер БД), завершив ранее запланированное логическое разделение Единой БД ядра на три независимых БД: Settings (Core Config), Data (Операционные данные ядра), Graph (Нейросеть — Кванты/Цели/Связи).

#### 29.1 Контуры и ответственность

- Settings DB (Core Config):
  - Назначение: канонические настройки (`soul_settings`), секреты (`soul_secrets`), аудит (`soul_audit_log`), флаги/фичи, инспекторы/реестры.
  - Трафик: низкий R/W, критична целостность и доступность.
  - Типовые схемы: `public.soul_settings`, `public.soul_secrets` (pgcrypto), `public.soul_audit_log`.
- Data DB (Operational/Core Data):
  - Назначение: проектное управление (P40), инциденты (P50), документы/персоны/HR/внешние контракты, чаты/диалоги, знания/навыки.
  - Трафик: смешанный, средний/высокий R/W, основная нагрузка CRUD/отчёты.
  - Типовые схемы: `projects/*`, `incidents/*`, `hr_*`, `external_*`, `chat_*`, `knowledge_*`.
- Graph DB (Neural/AGE):
  - Назначение: кванты/цели/связи (Apache AGE в Postgres), представления графа, sync‑циклы AGE.
  - Трафик: интенсивные scan/aggregate/graph операции; требования к p95 и пропускной способности.
  - Типовые схемы: `ag_catalog`, `quants_*`, `goals_*`, `links_*`; граф `age.graph_name`.

Примечание: логическое разделение обязательно; физическое разделение допускается по SLA (разные сервера/кластеры или единый сервер с 3 БД).

#### 29.2 Ключи конфигурации (только через SoulSettingsService/SecretsService)

- DSN и параметры пулов:
  - `db.core.dsn` — строка подключения Settings DB (read‑only из приложения; секреты — через `soul_secrets`).
  - `db.data.dsn` — строка подключения Data DB.
  - `db.graph.dsn` — строка подключения Graph DB (Postgres+AGE).
  - `db.read_replicas.core[]|data[]|graph[]` — массив DSN для чтения (опционально).
  - `db.pool.max_conn.core|data|graph`, `db.pool.timeout_ms.*` — пулы соединений (на уровне сервиса/pgbouncer).
- AGE/Graph:
  - `age.graph_name`, `age.sync.period_sec`, `age.sync.concurrency`, `age.sync.pages_per_tick`, `age.sync.tick_time_budget_ms`, `age.sync.loop_sleep_ms`.
- Кэши/ускорители:
  - `redis.core.*`, `redis.data.*`, `redis.graph.*` — DSN/пулы/TTL; ключи для кэширования справочников/агрегатов/топологий.

Запрещено хардкодить URL/порты/логины/пароли в исходниках. Источник истины — только БД. ENV допускается для PROD‑секретов самого сервиса, но не для целевых DSN.

#### 29.3 Миграции и головы Alembic

- Разделённые головы миграций: `alembic_core` (Settings), `alembic_data` (Data), `alembic_graph` (Graph/AGE DDL/ensure). `INSPECTOR.RUN key=migration.guard` должен проходить с «heads=3, в актуале».
- Идемпотентные миграции, запрет разрушающих DDL без явного backfill/lock‑планов.

#### 29.4 Индексы и схемы (требования)

- Общие правила:
  - PK — `uuid`/`bigint` по предметной области; все FK c `on delete` политиками; обязательные создание индексов по FK.
  - Временные таблицы/ленты событий — партиционирование по времени (месяц/квартал) с `CHECK`‑ограничениями; автосоздание/автодроп партиций.
  - JSONB — GIN индексы по часто фильтруемым полям (`jsonb_path_ops`), частичные индексы по статусам.
  - Уникальные бизнес‑ключи: `unique(...)` там, где это требуется доменом.
- Settings DB:
  - `soul_settings(key text primary key)`; индекс по `namespace` (если выделен) и `updated_at`.
  - `soul_secrets(key text primary key)` (pgcrypto); аудит доступа в `soul_audit_log` (ix по `ts`, `actor_id`).
- Data DB:
  - Инциденты/очереди/журналы — партиции by month; индексы: `status`, `kind`, `ts`/`created_at`.
  - HR/документы — `ix_*_persona`, `ix_*_kind`, `ix_*_period_from|to`, `ix_*_position_id|org_unit_id`.
  - Чаты/диалоги — `ix_chat_messages_chat_id_ts`, GIN по полнотекстовому `tsvector` (если применимо).
- Graph DB:
  - AGE граф `age.graph_name`; таблицы `quants_*`/`links_*` — индексы: `quant_id`, `goal_id`, `relation_type`, `created_at`.
  - Материализованные вью для top‑K/агрегаций; рефреш по расписанию, инкрементально.

#### 29.5 Ускорители и кэш

- Redis: кэш K/V настроек, резолверов ролей/RASI, графовых top‑K; ключи формата `core:settings:<k>`, `data:rasi:<process>:<id>`, `graph:topk:<mask>:<k>`; TTL и инвалидация по событиям DDL/WS.
- Материализованные представления (MV): отчёты/агрегаты, рефреш батчами; контроль p95.
- Read‑replicas: маршрутизация чтений на реплики для отчётов и MV‑рефрешей.

#### 29.6 Надёжность/HA/Backup

- RTO/RPO профили:
  - Settings: RTO ≤ 1 мин, RPO ≤ 1 мин (синхронная реплика/фейловер при возможности).
  - Data: RTO ≤ 5 мин, RPO ≤ 5 мин (ежеминутные WAL архивы/PITR, логическая реплика для отчётов).
  - Graph: RTO ≤ 5 мин, RPO ≤ 1 мин (WAL+реплики; при восстановлении — валидировать целостность AGE графа).
- Backups: непрерывный WAL (PITR), ежедневные base‑backup, тест восстановления еженедельно.
- Процедуры failover: документированы; автоматический промоушен, проверка целостности после переключения.

#### 29.7 Наблюдаемость и алерты (обязательные)

- Метрики: `db.pool.usage{core|data|graph}`, `db.errors{type}`, `query.p95_ms{db}`, `replication.lag_ms{db}`, `age.sync.p95_ms`, `age.sync.lag_pages`, `mv.refresh.p95_ms`.
- Алерты (человекочитаемые с рекомендациями):
  - `DBLagHigh(core|data|graph)` — проверить репликацию/диск/WAL; при high — эскалировать, временно снизить нагрузку.
  - `DBPoolExhausted(core|data|graph)` — увеличить пулы/оптимизировать запросы/включить реплики.
  - `AgeSyncLagCritical` — снизить load, проверить Postgres (locks/WAL/disk), эскалировать P50.

#### 29.8 Безопасность/сетки

- TLS для всех соединений; роли Postgres — принцип наименьших прав; RLS при необходимости в Data DB.
- Запрет локальных долгоживущих процессов; все фоновые работы — на APP серверах под systemd.

#### 29.9 Совместимость/дефолтная топология

- По умолчанию три логические БД могут располагаться на одном сервере Postgres (единый узел). Приложение обязано использовать раздельные DSN и пулы.
- Миграционный этап: сначала ввод DSN‑ключей и маршрутизация; затем — физическое разделение при необходимости без изменения контрактов.

#### 29.10 Acceptance

- `INSPECTOR.RUN key=migration.guard` (heads=3), `INSPECTOR.RUN key=guard.canonical.urls` (findings=0 вне доков), `INSPECTOR.RUN_ALL` зелёные.
- Проверка подключения к `db.core.dsn|db.data.dsn|db.graph.dsn`; `age.graph_name` доступен, cypher через `ag_catalog.cypher` с `$now` параметром.
- Отчёт о индексах и планах в админ‑маршрутах Data/Graph; p95 в бюджете.

#### 29.11 Единый ландшафт БД с контурами Электронных Сотрудников (DigiStaff/Org DB)

- Расширение ландшафта:
  - DigiStaff DB (тенант Электронных сотрудников): хранит `digital_employees`, `de_persona_settings`, `de_policies`, `de_routines`, `de_contracts`, `jd_*`, PT/Payroll/HR‑надстройки. Может быть per‑org или per‑org‑group.
  - Org Data DB (периметр организации‑заказчика): предметные данные конкретной организации; доступ по строго описанным вью/политикам и приватным каналам. Всегда изолирована от Core.

- DSN/ключи конфигурации (только из БД):
  - `db.digistaff.mode` ∈ { `shared`, `per_org`, `per_group` } — стратегия мульти‑тенантности DigiStaff.
  - `db.digistaff.dsn` — DSN DigiStaff (если `shared`).
  - `db.digistaff.tenants[]` — массив записей `{ org_key, dsn }` при `per_org|per_group`.
  - `db.org_data.router` — политика маршрутизации к БД организации (мэппинг org_key→dsn, может храниться как K/V в Settings DB).
  - Пулы: `db.pool.max_conn.digistaff`, `db.pool.max_conn.org_data`, `db.read_replicas.digistaff[]`, `db.read_replicas.org_data[]`.

- Политики миграций:
  - Отдельные головы Alembic: `alembic_digistaff`, `alembic_org_data` (если управляемая схемой часть), с идемпотентными ensure‑DDL.
  - Инспектор `migration.guard` должен учитывать до 5 голов (core/data/graph/digistaff/org_data) и подтверждать актуальность.

- Индексация/производительность:
  - DigiStaff: индексы по `de_id`, `person_id`, `position_id`, `process_id`, партиционирование табелей/логов.
  - Org Data: предметно‑специфично, минимум — индексы по FK и по временным полям лент.

- Кэш/ускорители:
  - `redis.digistaff.*`, `redis.org_data.*` для профилей/рутин/календарей, а также кэша политик доступа.

- Безопасность/сетки:
  - Изоляция периметров: DigiStaff и Org Data могут находиться в закрытых контурах/VPC; все соединения — TLS, доступ по allow‑list.
  - Запрет хардкодов маршрутов/DSN; все маршруты извлекаются из Settings DB по ключам выше.

- Acceptance:
  - Валидное разрешение DSN для выбранного `org_key` в DigiStaff и Org Data; успешные CRUD/HR‑операции через описанные контуры.
  - Инспекторы зелёные, p95 в бюджете; отчёты по пулу соединений/лагу репликации.

### 30. Роли и полномочия (RBAC) для Электронных Сотрудников и операторов

- Базовые роли (минимум):
  - `digital_employee` — роль Электронного сотрудника (минимальные права исполнения собственных рутин/плейбуков, чтение собственных настроек/профиля, публикация событий). Namespace‑ограничения обязательны.
  - `digistaff.admin` — администратор контура Электронных сотрудников (управление DigiStaff схемами, рутинными процессами, расписаниями, политиками доступа, интеграциями). Нет доступа к секретам Core за пределами необходимого минимума.
  - `assistant.operator` — оператор помощника/визу (действия в сцене, управление квотами/троттлингом в рамках RASI/Severity, эскалации с Two‑Keys).

- Маппинг ролей на ресурсы и контуры:
  - Core/Settings: только чтение конфигов (`assistant.operator`), операции над настройками/ключами — через админ‑эндпоинты и Two‑Keys (обычно `soul.admin`).
  - Data: операции по домену в рамках namespace и RASI; `assistant.operator` выполняет operator.actions с валидацией RASI/Severity; `digital_employee` пишет собственные run‑events/отчёты.
  - DigiStaff: `digistaff.admin` управляет сущностями DigiStaff; `digital_employee` — ограниченные CRUD в пределах собственного `de_id`/привязок.
  - Org Data: доступ только через вью/политики, которые определены для роли/namespace; прямых полномочий на Org DB у `digital_employee` нет — только проксированные операции.

- Контракты/валидации:
  - Для `operator.action` применять RASI/Severity (см. 28.12) и Two‑Keys для high‑risk.
  - Для `digital_employee` проверять, что все операции выполняются в своём `namespace` и в рамках назначенных процессов/биндингов JD.
  - Аудит P27 обязателен: `operator.actions.*`, `digistaff.admin.*`, `de.routine.run.*`.

- Ключи конфигурации RBAC (в Settings DB):
  - `rbac.roles` — реестр ролей и их базовых разрешений (jsonb), без секрета.
  - `rbac.policies` — маппинг действий → требования (RASI/Severity/Two‑Keys), наследование per‑org/namespace.
  - `rbac.namespaces` — конфигурация пространств имён/организационных границ.

- Acceptance:
  - Позитив/негатив: действия `assistant.operator` по матрице (28.12.3) с корректной проверкой; попытка выхода за namespace у `digital_employee` — 403.
  - Метрики/алерты: счётчики отказов RASI, попыток нарушения namespace, отсутствия ролей.

### Алгоритм (минимум) / Примеры / Checklist

Алгоритм (минимум):

1) define_hr_scenarios() → link_acceptance_tests()
2) run_and_visualize() → collect_metrics()

Примеры:

```json
{ "scenario": "onboarding_flow" }
```

```json
{ "passed": true, "metrics": { "time_ms": 1200 } }
```

Checklist:

- Сценарии покрыты; метрики в норме
