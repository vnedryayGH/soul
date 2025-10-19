from __future__ import annotations

import argparse
import json
from pathlib import Path

TEMPLATE = (
    "CONNECT.NEW_DEV id=\"{tg_id}\" name=\"{name}\" role=\"{role}\"\n"
    "# Далее введите 4 строки:\n"
    "{project}\n{docs_dirs}\n{docs_indexes}\n{code_dirs}\n"
)


def main() -> None:
    p = argparse.ArgumentParser(description="Generate invite command for new developer")
    p.add_argument("--tg-id", required=True)
    p.add_argument("--name", required=True)
    p.add_argument("--role", required=True, help="ext_frontend_dev|ext_integration_dev|ext_channel_dev|ext_soulpulse_dev")
    p.add_argument("--project", required=True)
    p.add_argument("--docs-dirs", required=True, help="Comma-separated")
    p.add_argument("--docs-indexes", default="", help="Comma-separated")
    p.add_argument("--code-dirs", required=True, help="Comma-separated")
    p.add_argument("--out", default="invite_new_dev.txt")
    args = p.parse_args()

    text = TEMPLATE.format(
        tg_id=args.tg_id,
        name=args.name,
        role=args.role,
        project=args.project,
        docs_dirs=args.docs_dirs,
        docs_indexes=args.docs_indexes,
        code_dirs=args.code_dirs,
    )
    Path(args.out).write_text(text, encoding="utf-8")

    payload = {
        "tg_id": str(args.tg_id),
        "name": args.name,
        "role": args.role,
        "project": args.project,
        "docs_dirs": [x.strip() for x in args.docs_dirs.split(",") if x.strip()],
        "docs_indexes": [x.strip() for x in args.docs_indexes.split(",") if x.strip()],
        "code_dirs": [x.strip() for x in args.code_dirs.split(",") if x.strip()],
    }
    Path("invite_new_dev.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()


