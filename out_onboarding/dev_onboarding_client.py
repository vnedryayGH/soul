import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional


def write_options_file(options: Dict[str, object], out_path: Path) -> None:
    out_path.write_text(json.dumps(options, ensure_ascii=False), encoding="utf-8")


def _extract_json(stdout: str) -> Optional[Dict]:
    try:
        # Пробуем распарсить целиком
        return json.loads(stdout)
    except Exception:
        pass
    # Бест‑эффорт: ищем первую фигурную скобку и парсим объект
    try:
        start = stdout.find("{")
        end = stdout.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(stdout[start : end + 1])
    except Exception:
        return None
    return None


def run_hyperloop(commands: str, options_file: Path | None = None, timeout: int = 120) -> Tuple[int, str]:
    cli = [sys.executable, str(Path("Soul/scripts/hyperloop_cli.py"))]
    if options_file is None:
        cli += ["--dsl", commands]
    else:
        cli += ["--commands", commands, "--options-json-file", str(options_file), "--timeout", str(timeout)]
    proc = subprocess.run(cli, capture_output=True, text=True)
    # Печатаем только «сырой» вывод, как предпочитает пользователь
    sys.stdout.write(proc.stdout)
    sys.stderr.write(proc.stderr)
    return proc.returncode, proc.stdout


def ensure_project_layout(base_dir: Path) -> None:
    for rel in [
        "external/prompts",
        "templates",
        "scripts",
        "registry",
        "docs",
        "logs",
    ]:
        (base_dir / rel).mkdir(parents=True, exist_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Client‑side onboarding for external developers")
    parser.add_argument("--project", required=True)
    parser.add_argument("--docs-dirs", required=True, help="Comma‑separated")
    parser.add_argument("--docs-indexes", default="", help="Comma‑separated")
    parser.add_argument("--code-dirs", required=True, help="Comma‑separated")
    parser.add_argument("--workdir", default=".")
    args = parser.parse_args()

    base_dir = Path(args.workdir).resolve()
    ensure_project_layout(base_dir)

    options = {
        "project": args.project,
        "docs_dirs": [p.strip() for p in args.docs_dirs.split(",") if p.strip()],
        "docs_indexes": [p.strip() for p in args.docs_indexes.split(",") if p.strip()],
        "code_dirs": [p.strip() for p in args.code_dirs.split(",") if p.strip()],
    }
    opts_file = base_dir / "registry/onboarding_options.json"
    write_options_file(options, opts_file)

    # Trigger Hyperloop onboarding workflow (read‑only safe stage first)
    code, out = run_hyperloop("ONBOARDING.CHECK_AND_PREPARE WITH TRACE", opts_file)
    if code != 0:
        sys.exit(code)

    # Попробуем распарсить ответ гиперлупа из stdout и сохранить в registry/onboarding_response.json
    try:
        parsed = _extract_json(out)
        if isinstance(parsed, dict):
            # Ищем data из результата hyperloop: { results: [ { data: {...} } ] } или плоский data
            data = parsed.get("data") if "data" in parsed else None
            if data is None and isinstance(parsed.get("results"), list) and parsed["results"]:
                first = parsed["results"][0]
                data = first.get("data") if isinstance(first, dict) else None
            if isinstance(data, dict):
                resp_path = base_dir / "registry/onboarding_response.json"
                resp_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
                app2 = (data.get("app2") or {})
                app2_host = str(app2.get("host") or "mini.soulpulse.art").strip()
                app2_user = str(app2.get("ssh_user") or "root").strip()
                app_paths = (data.get("app_paths") or {})
                projects_root = str(app_paths.get("projects_root") or "/var/www/soulpulse/developers/projects").strip()
                print("=== Copy instructions (read‑only) ===")
                # Безопасный набор директорий: soul/doc внутри demo_project
                safe_dirs = ["demo_project/soul", "demo_project/doc"]
                for d in safe_dirs:
                    remote_path = f"{projects_root.rstrip('/')}/{d}"
                    print(f"scp -r {app2_user}@{app2_host}:{remote_path} ./external/")
    except Exception:
        pass

    # Sync templates/rules happens server‑side after validation
    print("Onboarding command submitted.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # pragma: no cover
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)


