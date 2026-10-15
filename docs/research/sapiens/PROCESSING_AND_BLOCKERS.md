# Processing and blockers digest

| Stage | Source mechanism | Input/output and time | Limit |
|---|---|---|---|
| Dry grass | Item evolution | Grass becomes hay; base 120 world-time units | Cover x4, not a worker recipe |
| Dry flax/vessels/bricks | Item evolution | Wet/raw intermediate becomes dry; representative base 240 | Item fraction/reference persist in state, runtime reload not verified |
| Fire vessel | Staffed craft action sequence | One dry vessel plus kiln and pottery-firing role produces fired vessel | Default action repeats 7, check cadence 4; not an exact total duration |
| Thresh | Staffed action sequence | Wheat plus container becomes filled urn variant | Worker mastery gates completion; container type retained |
| Grind / dough | Staffed recipes | Filled wheat urn becomes flour urn; dough returns empty urn | Concrete resource-object outputs encode containers |
| Cook | Staffed campfire action sequence | One raw meat/vegetable/fish produces cooked form | Campfire, cooking role/skill, practical availability required |

Evidence: `common/evolvingObject.lua`, `server/serverEvolvingObject.lua`, `common/craftable.lua`, `server/sapienAI/activeOrderAI.lua`. Typed missing inputs, tools, storage, facilities, role, distance and environmental flags are checked in `planManager` and described in `hubUIUtilities`. Missing role means no allowed member; not a missing completed skill. Resource amounts can show available/required fractions. Target stock threshold is an intentional hold, not failure.

Do not claim exact wall-clock recipe time from the 4-unit cadence and 7 repeats: hauling, traits, tools, inspection, skill learning and pause/speed affect it. Stored compatible evolution updates object types and counts; incompatible output is emitted outside storage. Coverage preferences differ for drying and spoilage. Actual movement, cover-boundary timing and cancellation/reload need runtime checks.
