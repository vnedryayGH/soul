from __future__ import annotations

import asyncio
from sqlalchemy import text

try:
    # Running on server within /var/www/soulpulse/backend
    from app.db import async_session_maker  # type: ignore
except Exception as e:  # pragma: no cover
    raise SystemExit(f"import error: {e}")


async def main() -> None:
    async with async_session_maker() as db:
        await db.execute(text(
            """
            update feature_inspectors
            set module='backend.app.feature_plugins.rs_security_limits'
            where key='rs.security_limits'
            """
        ))
        await db.commit()
    print("OK: feature_inspectors updated")


if __name__ == "__main__":
    asyncio.run(main())


