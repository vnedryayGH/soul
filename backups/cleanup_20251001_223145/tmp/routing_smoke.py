import os, asyncio, json
os.environ[ LLM_ROUTING_ENABLED]=1
os.environ[LLM_ROUTING_CONFIG]=backend/config/llm_routing.yaml
from backend.app.services.llm_manager import LLMManager

async def main():
    m = LLMManager()
    out = []
    for fn in [planner,consistency,soul_core,judge]:
        cfg = await m.get_model_for_function(None, fn, locale=en)
        out.append({function: fn, provider: (cfg or {}).get(provider), model: (cfg or {}).get(model_name), display: (cfg or {}).get(display_name)})
    print(json.dumps(out, ensure_ascii=False))

asyncio.run(main())
