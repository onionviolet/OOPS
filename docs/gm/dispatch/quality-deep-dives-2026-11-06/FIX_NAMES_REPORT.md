# FIX NAMES report (2026-11-07)

CHECKPOINT: done. `node scripts/check_names.mjs` is 0 findings, 0 new, 0 stale (was 34). Baseline and backlog regenerated.
Labels: SHOWN = I ran it.

## Fixed
- NPCs, `src/data/npcs.js` (19 rows) + `src/models/npc.js`: added a `displayName` field read through `getName()`, so the talk button,
  dialogue header and default "Trade with ..." text show it. `name` stays the internal key (it is the NPC `id` and the trader stock
  seed), as do registry ids, dialogue keys and trader keys. Each line carries `// names: allow internal key; players read displayName`.
  Names (proposals, outside the name-grammar pools so they do not collide with generated people): Old Hesk (village elder), Harl
  (guard), Wend (old craftsman), the Pennick family (millers), Skerrit (the hooded man), Granny Moth (old woman of the slums), Corwin
  Slate (gate guard), Hesper Ayles (farm supervisor), Madam Kohaku (nekomimi proprietress), Murrow, Ludd, Sorrel, Grist, Rook (swampland
  chief, cook, tailor, tanner, scout), Dunstan (village trader), Quill (back-alley trader), Mulgrave (swampland trader), Tama (nekomimi
  trader), Nori (the Whisker Corner trader, was "cat cafe trader").
- "nekomimi" kept: it is a playable race in `src/races.js` and the "Nekomimi café" place, so an in-world people word.
- `src/models/npc.js`: trade fallback text uses `getName()` instead of `this.name`.
- `src/first_hour.js`: "Talk to village elder" guidance now names the button the player sees ("Talk to Old Hesk, the village elder").
- Nests, `src/data/locations.js` (ids unchanged): Forest ant nest -> "Roadside ant nest"; Red ant nest 1/2/3 -> "Furrow", "Orchard",
  "Barn-wall ant nest"; the four "Enter the [..]" link texts match.
- Allowed with reason (NMR4/NMR5 dials): "Village" and "Forest" places (id is derived from name, so renaming would move save keys, and
  players read them as region names); Axe/Dagger/Hat/etc. recipe labels and Leather gloves/Leather hat/Old axe (starter commodities);
  Catfish (a real fish beside Ratfish, a resource name in a place file, not a spelling split).

## Left
- Prose in other files still says "the village elder" as a role in running text (NMR1 dial allows it). Not changed.
- Other readers of NPC `name` (people_knowledge, chronicle, Reports lines) key by ids or use role words; not touched, so saved
  history keeps its wording (PRS8).
- Nest names and the other 18 NPC displays were not exercised in a browser or the runner (implemented-unverified); only the elder was.

## Checks
- SHOWN `node scripts/check_names.mjs`: 0 findings, 0 new, 0 stale. `--update-baseline`, `--backlog` ran.
- SHOWN `node --test tests/names_check.test.js`: 8 pass.
- SHOWN focused tests (first_hour, trader_keyed_stock, trader_templates, world_look, interaction_system, native_rendering, reward_keys,
  seeded_streams, stepper_life_commit): pass. `tests/openings_check.test.js` has 1 failure, "committed baseline parses ...": that is
  the OPENINGS lane's own baseline, not names.
- SHOWN headless (`scripts/headless/runner.mjs`, fresh boot, seed 20261014, click Talk to someone):
  talk list: "Talk to Old Hesk, the village elder"; dialogue header: "Old Hesk, the village elder"; first-hour line: "Talk to Old Hesk,
  the village elder."
