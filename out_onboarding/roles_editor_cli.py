from __future__ import annotations

import argparse
import sys
from typing import List

from backend.app.db import async_session_maker  # type: ignore
from backend.app.services.rbac_service import RBACService  # type: ignore
from sqlalchemy import select  # type: ignore
from backend.app.models import User  # type: ignore


async def list_roles(user_tg_id: int | None) -> None:
    async with async_session_maker() as db:
        rbac = RBACService(db)
        if user_tg_id is None:
            # список пользователей с ролями
            rows = (await db.execute(select(User))).scalars().all()
            for u in rows:
                roles = [r.name for r in await rbac.get_user_roles(u.id)]
                print(f"{u.id}\t{u.tg_id}\t{','.join(roles)}")
            return
        row = await db.execute(select(User).where(User.tg_id == int(user_tg_id)))
        u = row.scalar_one_or_none()
        if not u:
            print("user not found", file=sys.stderr)
            sys.exit(1)
        roles = [r.name for r in await rbac.get_user_roles(u.id)]
        print(",".join(roles))


async def assign_role(user_tg_id: int, role: str) -> None:
    async with async_session_maker() as db:
        from sqlalchemy import select as _select
        row = await db.execute(_select(User).where(User.tg_id == int(user_tg_id)))
        u = row.scalar_one_or_none()
        if not u:
            print("user not found", file=sys.stderr)
            sys.exit(1)
        rbac = RBACService(db)
        ok = await rbac.assign_role_to_user(u.id, role)
        print("ok" if ok else "failed")


async def remove_role(user_tg_id: int, role: str) -> None:
    async with async_session_maker() as db:
        from sqlalchemy import select as _select
        row = await db.execute(_select(User).where(User.tg_id == int(user_tg_id)))
        u = row.scalar_one_or_none()
        if not u:
            print("user not found", file=sys.stderr)
            sys.exit(1)
        rbac = RBACService(db)
        ok = await rbac.remove_role_from_user(u.id, role)
        print("ok" if ok else "failed")


def main() -> None:
    p = argparse.ArgumentParser(description="Roles editor for developers")
    sub = p.add_subparsers(dest="cmd", required=True)

    ls = sub.add_parser("list")
    ls.add_argument("--tg-id", type=int)

    add = sub.add_parser("assign")
    add.add_argument("--tg-id", type=int, required=True)
    add.add_argument("--role", required=True)

    rm = sub.add_parser("remove")
    rm.add_argument("--tg-id", type=int, required=True)
    rm.add_argument("--role", required=True)

    args = p.parse_args()

    import asyncio

    if args.cmd == "list":
        asyncio.run(list_roles(args.tg_id))
    elif args.cmd == "assign":
        asyncio.run(assign_role(args.tg_id, args.role))
    else:
        asyncio.run(remove_role(args.tg_id, args.role))


if __name__ == "__main__":
    main()


