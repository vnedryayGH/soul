import yaml


def test_position_profile_and_process_template_parsable():
    with open('docs/P62_POSITION_PROFILE_AND_PROCESS_TEMPLATE.yaml', encoding='utf-8') as f:
        docs = list(yaml.safe_load_all(f))
    assert len(docs) >= 2
    kinds = {d.get('kind') for d in docs if isinstance(d, dict)}
    assert 'position.profile/v1' in kinds
    assert 'process.template/v1' in kinds
