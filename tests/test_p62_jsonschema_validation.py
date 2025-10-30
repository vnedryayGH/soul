import yaml
from jsonschema import Draft202012Validator


def _load_openapi_spec():
    with open('docs/P62_OPENAPI_SPEC_v1.yaml', encoding='utf-8') as f:
        return yaml.safe_load(f)


def test_jsonschemas_present_and_valid():
    spec = _load_openapi_spec()
    comps = spec.get('components', {})
    schemas = comps.get('schemas', {})
    assert schemas, 'No schemas in OpenAPI fragment'
    # Validate each schema with jsonschema (best-effort; OpenAPI subset)
    for name, schema in schemas.items():
        # Convert OpenAPI schema to JSON Schema Draft 2020-12 compatible subset
        Draft202012Validator.check_schema(schema)
