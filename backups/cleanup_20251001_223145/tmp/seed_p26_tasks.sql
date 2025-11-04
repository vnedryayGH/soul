-- Seed 30 primary tasks for Super AI Soul (3 cascades x10)
-- Labels encoded as JSONB; priorities: urgent|high|normal|low

WITH ins AS (
  INSERT INTO public.tasks (id, title, description, priority, due_at, labels, status, created_at)
  VALUES
  -- 1) SECURITY: освоить инструменты, сеть, безопасность (10)
  (gen_random_uuid(), 'Security: аудит и защита инфраструктуры', 'Построить модель угроз, активировать алерты и аудит действий.', 'urgent', NOW() + INTERVAL '1 day', '{"domain":"security","area":"infrastructure","tags":["rbac","alerts","audit"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: RBAC и scopes', 'Проверить роли, доступы к Admin API и two-keys операции.', 'high', NOW() + INTERVAL '2 day', '{"domain":"security","area":"rbac","tags":["roles","scopes","two-keys"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: защита секретов', 'Инвентаризация секретов, отключение утечек, ротация ключей.', 'high', NOW() + INTERVAL '3 day', '{"domain":"security","area":"secrets","tags":["env","rotation","vault"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: сетевые периметры', 'Понять Nginx/proxy, таймауты, лимиты, защита от сканирования.', 'normal', NOW() + INTERVAL '4 day', '{"domain":"security","area":"network","tags":["nginx","timeouts","ratelimit"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: observability', 'Метрики и трассировка безопасности, SLA/SLO/алерты.', 'normal', NOW() + INTERVAL '5 day', '{"domain":"security","area":"observability","tags":["metrics","tracing","alerts"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: валидации и схемы', 'Pydantic Strict, Schema Guard, снимки контрактов.', 'normal', NOW() + INTERVAL '6 day', '{"domain":"security","area":"schemas","tags":["pydantic","schema-guard","contracts"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: защита LLM', 'NEGATIVE-сантайзеры, jail-break guard, PII-маскирование.', 'high', NOW() + INTERVAL '2 day', '{"domain":"security","area":"llm","tags":["negative","jailbreak","pii"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: data lineage', 'Восстановить происхождение данных целей и квантов.', 'normal', NOW() + INTERVAL '7 day', '{"domain":"security","area":"lineage","tags":["provenance","audit","goals"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: резервное копирование', 'Проверить бэкапы БД/файлов и сценарии восстановления.', 'normal', NOW() + INTERVAL '7 day', '{"domain":"security","area":"backup","tags":["pg_dump","restore","rpo-rto"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Security: безопасность деплоя', 'Проверка systemd, ключей SSH, StrictHostKeyChecking.', 'normal', NOW() + INTERVAL '4 day', '{"domain":"security","area":"deploy","tags":["systemd","ssh","hardening"]}'::jsonb, 'todo', NOW()),

  -- 2) WORLD: освоить инструменты системы для познания мира (10)
  (gen_random_uuid(), 'World: Telegram/боты', 'Освоить диспетчер, контексты, RBAC, мини‑приложение.', 'normal', NOW() + INTERVAL '3 day', '{"domain":"world","area":"telegram","tags":["bots","miniapp","rbac"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: LLM-провайдеры', 'Профили, стоимость/латентность, failover и роутинг.', 'normal', NOW() + INTERVAL '5 day', '{"domain":"world","area":"llm","tags":["profiles","failover","routing"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: мультимодальность', 'ASR/TTS, обработка аудио, приватность.', 'low', NOW() + INTERVAL '8 day', '{"domain":"world","area":"multimedia","tags":["asr","tts","privacy"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: поиск и ретривер', 'BM25+вектор, ранжирование 30/70_v2.', 'normal', NOW() + INTERVAL '6 day', '{"domain":"world","area":"retrieval","tags":["bm25","vector","ranking"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: наблюдаемость', 'Дашборды/метрики P21, трассы audit/trace_view.', 'normal', NOW() + INTERVAL '6 day', '{"domain":"world","area":"observability","tags":["p21","dashboards","audit"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: API контракты', 'OpenAPI↔Pydantic, версионирование.', 'low', NOW() + INTERVAL '9 day', '{"domain":"world","area":"contracts","tags":["openapi","pydantic","semver"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: интеграции календаря', 'Импорт/экспорт P26, окна расписаний.', 'normal', NOW() + INTERVAL '4 day', '{"domain":"world","area":"calendar","tags":["p26","schedules","windows"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: этика и допуски', 'Ethics‑gate, allow‑list действий, публикации.', 'normal', NOW() + INTERVAL '10 day', '{"domain":"world","area":"ethics","tags":["gate","allow-list","publish"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: тестирование', 'Golden‑Set, интеграционные цепочки P24.', 'low', NOW() + INTERVAL '10 day', '{"domain":"world","area":"testing","tags":["golden","p24","integration"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'World: управление знаниями', 'Индексы документации, регистры, обновление карт.', 'low', NOW() + INTERVAL '11 day', '{"domain":"world","area":"docs","tags":["indexes","registries","maps"]}'::jsonb, 'todo', NOW()),

  -- 3) SELF: познать себя — внутренние инструменты и оптимизация (10)
  (gen_random_uuid(), 'Self: ядро и роутер', 'Сборка SYSTEM/USER, policy‑extract, NEGATIVE.', 'high', NOW() + INTERVAL '2 day', '{"domain":"self","area":"router","tags":["system","modules","negative"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: память 30/70_v2', 'Ранжирование, выравнивание контекста, синонимы.', 'normal', NOW() + INTERVAL '5 day', '{"domain":"self","area":"memory","tags":["30_70","synonyms","ranking"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: DesiredAction', 'Подсхемы, allow‑list, autopublish.', 'normal', NOW() + INTERVAL '6 day', '{"domain":"self","area":"actions","tags":["schemas","allow","autopublish"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: оптимизация сна', 'Алгоритмы Sleep/Decay/Archive.', 'normal', NOW() + INTERVAL '7 day', '{"domain":"self","area":"sleep","tags":["decay","archive","energy"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: эффективность активностей', 'Матвью и ранги, refresh‑rank.', 'normal', NOW() + INTERVAL '6 day', '{"domain":"self","area":"activities","tags":["mv","rank","effectiveness"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: мониторинг качества квантов', 'Метрики качества/дрейфа.', 'low', NOW() + INTERVAL '9 day', '{"domain":"self","area":"quality","tags":["metrics","drift","eval"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: миграции/ABI', 'Alembic, row_version, ETag/If‑Match.', 'low', NOW() + INTERVAL '8 day', '{"domain":"self","area":"migrations","tags":["alembic","etag","abi"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: безопасность данных', 'PII‑санитайзер, red‑team сценарии.', 'normal', NOW() + INTERVAL '7 day', '{"domain":"self","area":"privacy","tags":["pii","red-team","sanitize"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: реестр знаний', 'Актуализировать PROJECT_STRUCTURE / документацию.', 'low', NOW() + INTERVAL '10 day', '{"domain":"self","area":"knowledge","tags":["structure","docs","index"]}'::jsonb, 'todo', NOW()),
  (gen_random_uuid(), 'Self: профили производительности', 'latency/throughput профили LLM и I/O.', 'low', NOW() + INTERVAL '11 day', '{"domain":"self","area":"perf","tags":["latency","throughput","profile"]}'::jsonb, 'todo', NOW())
  RETURNING 1
)
SELECT COUNT(*) FROM ins;

