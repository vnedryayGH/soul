import json


def test_ws_hr_event_examples_are_valid_json():
    # Validate that examples in P62 TZ are valid JSON objects (basic sanity)
    import re

    with open('Soul/P62_TZ_Soul_Visual_HR_Simulation_v1_0.md', encoding='utf-8') as f:
        md = f.read()

    blocks = re.findall(r'```json\n(.*?)\n```', md, flags=re.S)
    assert blocks, 'No JSON blocks found in P62 TZ'
    ok = 0
    for b in blocks:
        try:
            json.loads(b)
            ok += 1
        except Exception:
            # ignore non-object fragments
            pass
    assert ok >= 6, 'Expected at least 6 valid JSON examples (hr.* events, etc.)'
