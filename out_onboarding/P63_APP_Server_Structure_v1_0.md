Структура на АПП‑сервере для онбординга внешних разработчиков (P63)

База (read‑only для раздачи на клиент):
/var/www/developers/base/
  cursorrules_external_v1_0.md
  prompts/
  templates/
  tools/

Проектные папки разработчиков (RBAC, per‑project/per‑dev):
/var/www/developers/projects/<project_key>/<dev_id>/
  docs/
  registry/
  logs/
  sync/

Примечания
- Раздача клиенту идёт синхронно после успешной валидации опций онбординга (Hyperloop).  
- Системные сервисы не содержат жёстких URL/портов; все адреса и секреты читаются из БД.  
- Долгоживущие процессы — только под systemd юнитами на АПП‑серверах.


