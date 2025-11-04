# P62 — Implementation Checklist (v1)

- [ ] Фаза -1 Merge: docs/P62_BRANCH_MERGE_PLAN.md выполнен; тег p62-merge-baseline
- [ ] Фаза 0 Preflight: health/routes/openapi ок; FLAGS state.p62.phase=0-ok
- [ ] Фаза 1 DB: p62_external_* миграции применены; heads_enforcer ok
- [ ] Фаза 2 REST: personas/external/hr базовые маршруты соответствуют OpenAPI; ошибки `{code,message,details?}`; RBAC ok
- [ ] Фаза 3 WS: /api/visualization/feed фильтры topics, метрики ws_*; hr.* события выдаются
- [ ] Фаза 4 Finance: external reports / payroll report возвращают агрегаты; PII маскирование
- [ ] Фаза 5 UI: /soul/city доступна; карточки сущностей (Summary/KPI/RBAC/Документы/Расписание/Инциденты/История); enterprise‑стиль
- [ ] Фаза 6 Observability: инспекторы зелёные; алерты настроены
- [ ] Фаза 7 Freeze: доки обновлены; pytest и смоки зелёные; FLAGS state.p62.done=true

## Тесты/смоки
- [ ] `scripts/p62_smoke.ps1|.sh` отработали без ошибок
- [ ] `pytest -q tests/test_p62_*` зелёный

## Безопасность/стиль
- [ ] RBAC: все /api/admin/* под soul.admin; заголовок X-Telegram-User-ID
- [ ] Two‑Keys: operator.action risk операции и JD.apply
- [ ] A11y/i18n: контраст, клавиатура, RU/EN строки
- [ ] Exports: CSV/PDF под фильтрами; PII маскирование
