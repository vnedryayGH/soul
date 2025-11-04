from __future__ import annotations

import asyncio
from typing import List

from prompt_toolkit import prompt
from prompt_toolkit.completion import WordCompleter

from backend.app.db import async_session_maker  # type: ignore
from backend.app.services.rbac_service import RBACService  # type: ignore
from sqlalchemy import select  # type: ignore
from backend.app.models import User  # type: ignore

ROLE_KEYS = [
    "architect", "admin", "vip", "premium", "basic",
    "ext_frontend_dev", "ext_integration_dev", "ext_channel_dev", "ext_soulpulse_dev",
]


async def list_users() -> List[str]:
    async with async_session_maker() as db:
        rows = (await db.execute(select(User))).scalars().all()
        return [f"{u.tg_id}\t{u.id}\t{getattr(u,'name', '')}" for u in rows]


async def get_roles(tg_id: int) -> List[str]:
    async with async_session_maker() as db:
        r = await db.execute(select(User).where(User.tg_id == int(tg_id)))
        u = r.scalar_one_or_none()
        if not u:
            return []
        svc = RBACService(db)
        return [x.name for x in await svc.get_user_roles(u.id)]


async def set_role(tg_id: int, role: str, add: bool) -> bool:
    async with async_session_maker() as db:
        from sqlalchemy import select as _s
        r = await db.execute(_s(User).where(User.tg_id == int(tg_id)))
        u = r.scalar_one_or_none()
        if not u:
            return False
        svc = RBACService(db)
        if add:
            return await svc.assign_role_to_user(u.id, role)
        return await svc.remove_role_from_user(u.id, role)


def main() -> None:
    users_cache: List[str] = asyncio.run(list_users())
    print("Users (tg_id\tid\tname):")
    for line in users_cache[:20]:
        print("  ", line)
    tg = prompt("Enter user TG ID: ")
    try:
        tg_id = int(tg.strip())
    except Exception:
        print("Invalid tg id")
        return
    roles = asyncio.run(get_roles(tg_id))
    print("Current roles:", ", ".join(roles) if roles else "<none>")
    role = prompt("Role to assign/remove: ", completer=WordCompleter(ROLE_KEYS))
    op = prompt("Operation (assign/remove): ").strip().lower()
    ok = asyncio.run(set_role(tg_id, role.strip(), add=(op=="assign")))
    print("OK" if ok else "FAILED")


if __name__ == "__main__":
    main()
