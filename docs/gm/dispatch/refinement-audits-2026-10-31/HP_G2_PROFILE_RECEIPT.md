# HP G2 profile receipt (2026-11-03)

Status: implemented, below floor (AD43). Source-edited and focused-tested only; not rebuilt, not in a browser, not committed. Rules: AD36, AD43, AD44, AD46, AD51, AR1-AR16, LR2-H1, G2/G4/G11 of [the start doc](HP_LEAD_RUN_START_2026-11-03.md).

**What was wrong.** A pack with id `book.hp.lead` cannot sit in `BUNDLED_WORLD_PACKS`: the loader refuses nested pack ids (`namespacesOverlap`, `world_pack_loader.js:212`) and `book.hp` is already a pack, so the lead pack would go dormant. Native `id` must also equal the pack id. Fix kept the requested ids: the lead pack loads from a second list in the same registry file.

| Check | Result |
| --- | --- |
| Focused test `tests/hp_lead_life.test.js` | 3 pass, 0 fail (pack loads in its own list; start gives child body, guardian relationships, no items, no money, source with no power; `project('hp')` gives `arc.next` and `arc.done`, zero acts legal, the act starts a job) |
| `tests/world_pack_registry.test.js`, `world_pack_hp.test.js`, `world_pack_loader.test.js`, `hp_arrival_compatibility.test.js` | 29 pass after one expectation update (the `world_packs` projection now lists `book.hp.lead`) |
| `book.hp.school` content hash | before `60f98887...3017`, after identical; `book.hp.trade` `75d141fb...eb6b` identical; `book.hp` pack fingerprint `wp1:d2e3d53c88303348` identical |
| Start contents | ten-year-old child body (`lifeStage: child`), `guardian_of` relationships from Vernon and Petunia (1000), cupboard start, no wand, no item, no resource, source `book.hp.lead.magic` granted with no `power`; knowledge omits chapter 1 and the wider wizarding world |
| `npm run check:arch` | pass (grandfathered counts only) |
| `npm run check:rules` | PASS |

## Files
New: `src/world_packs/book_hp_lead_life_data.js` (life, household acts, G11 tiers), `src/world_packs/book_hp_lead_life.js` (pack), `src/book_world_hp_lead_domain.js` (panel projection), `tests/hp_lead_life.test.js`. Edited: `src/world_pack_registry.js` (second list, lookup fallback, projection lists both), `tests/world_pack_registry.test.js` (one expectation).

## Decisions and gaps
- Save compatibility: new definition id, no earlier save holds it; `compatibility.legacy: preserve-dormant` as required. Nothing existing migrates.
- Calendar: no year; week starts on Saturday so day 0 is the birthday; 08:00 is an authored proposal (the book gives "morning").
- Panel hook: `registerHpLeadDomain(registerDomain, getState)` is not yet called from `main.js` (not mine to edit), so `simulationTestHooks.project('hp')` returns nothing in a real page until one line wires it. The lead start is also not yet offered in the beginnings list (`registerHpBeginnings` is the school's file). Both belong to the later rebuilt native proof.
- Shared seam used: `placeActSequenceView`. It returns null for zero acts, so the projection supplies an empty arc (`next: null`, `done: false`). One stub act (`dress`, scene 1) exists so `arc.next` is real.
- G4 (accidental magic): only the held source exists; the glass-vanishing outcome is for the canon run, not invented. G11: Dursleys full tier; Piers, the director and the boa are tier labels only, not spawned. No canon numbers used, so no source lookup was needed.
- Not touched: `build_crosswalk.mjs`, LOTM files, `book.hp.school`/`trade`, `dist/`.
