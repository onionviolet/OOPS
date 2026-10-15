# NV-D2: Carrier and access matrix

Pin `f8982244800e86553217a2dba555a0f41c2b87ba`. Shown means inspected static source, not runtime proof.

| Retained thing | Source home / current reader | What movement does and does not establish |
|---|---|---|
| Credits, owned ships, outfits and licenses | player save/load, fleet/equipment readers | Career assets follow the player save; buying/equipping/using remain separate operations. Full transfers unread. |
| Completed stories | player mission/event completion sets | Completion can open a later offer; it does not grant every institution's approval. |
| Institutional access | es_cargo variable plus current Empire reputation gates | Work history creates a service route; present standing can still block it. |
| Psychic recognition | sirius_psychic player variable | Survives declining trial coordinates; not equal to usable Flow capacity. |
| Power apparatus | actual ship and amplifier outfits | Fidelity includes an intrinsic amplifier; other compatible hardware is possible. Ability code checks actual support and resource. |
| Flow charge | pilot shipMemory, recalculation/update readers | Capacity, regen, use and over-baseline decay differ. Arbitrary long-term charge retention through saves/swaps was not verified. |
| Bioship progress | bioshipexp, biostage and skill shipvars | The manager rebuilds relevant intrinsics on ship update; growth is not a single player-global level. |
| Relationships | authored variables, named character helpers and logs in sampled campaigns | Persistent narrative recognition is shown; universal interpersonal affinity or companion migration is not. |
| Changed destination | applied world-diff identity and story variables | Returning can expose changed services. No parallel copy or cross-universe conversion is implied. |

The Seeking Chakra stat function defines three amplifier tiers with costs 25/50/100 Flow and cooldowns 3/4/5 seconds; it generates descriptions from the same values. Activation checks cooldown, target and enough Flow, then spends Flow and launches the actual effect. Flow itself can regenerate below its baseline when no power is active and decay from excess charge. These are source numbers, not recommended YAIRPG balance.

Bioship income growth only applies while using a bioship and ignores negative payment amounts. Soromid bioships use factor 1, other bioships factor 0.5. Income above 500,000 credits grows with a square-root branch; XP is capped at the maximum stage threshold. The manager does not inspect the payment reason in its sampled callback, so do not describe it as a proof of effort-specific reward provenance. It uses a readiness notification and applies stage progress on landing or immediately if already landed.

Sources: [`src/player.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c); [`dat/missions/empire/es_cargo.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/empire/es_cargo.lua); [`dat/missions/sirius/sirius_awakening.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/sirius/sirius_awakening.lua); [`dat/ships/lua/lib/flow.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ships/lua/lib/flow.lua); [`dat/outfits/flow/abilities/seeking_chakra.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/outfits/flow/abilities/seeking_chakra.lua); [`dat/events/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua); [`dat/scripts/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/bioship.lua). Map: K3/K7/K9/K15/K18, P04/P07/P09/P16/P17.
