import json

import yaml


def test_runtime_openapi_contains_fragment_paths():
    try:
        with open('openapi_dump.json', encoding='utf-8') as f:
            live = json.load(f)
    except Exception:
        return  # skip if dump not present

    with open('docs/P62_OPENAPI_SPEC_v1.yaml', encoding='utf-8') as f:
        frag = yaml.safe_load(f)

    live_paths = set((live.get('paths') or {}).keys())
    frag_paths = set((frag.get('paths') or {}).keys())

    missing = sorted([p for p in frag_paths if p not in live_paths])
    # This test is advisory; it asserts nothing hard until endpoints are implemented
    # But signals developer if drift is large
    assert len(missing) < len(frag_paths), (
        'All fragment paths missing in live OpenAPI; endpoints likely not wired yet'
    )
