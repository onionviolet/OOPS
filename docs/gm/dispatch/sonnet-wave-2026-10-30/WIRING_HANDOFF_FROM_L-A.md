# Wiring hand-off from L-A to sw-wire (2026-10-30)

L-A has no open edits in `src/book_world_lotm_{host,state,cast_host}.js`, `src/simulation.js` or `src/domain_registry.js`; all T2/TH2 work is committed (`0df26deaa`). Gates for your commits are run by L-A through `scripts/slot_run.mjs`. Everything below is unwired.

## Gate pitfalls (learned today, save yourself an hour)
- A clean worktree needs the gitignored `docs/research/novels/*`, `private_packs/` and `node_modules` linked in, or nine native fixtures and two CLI tests fail with no useful message.
- `tests/cast_topic_talk.test.js` reads `cast-lives-lanes/D2_LOAD_INTEGRATION.patch` (now tracked, `3efe400b8`). Its malformed-pack case applies that patch to a disposable copy; it does not mean the loader preflight is integrated.
- Browser floor for T2 is still pending (scripted Chrome by `sw-slots`).

## Queue, best first target first
| # | Slice | Wiring | Notes |
| --- | --- | --- | --- |
| 1 | L14 events (`a2dc5ce6c`, `699a87eb6`, `f4b04a599`) | Load `world_events_v1..v8.json` per active volume; `frameBindings` binds a beat to a day when the lead reaches its chapter; at day rollover `learnedBetween` then `eventKnowledgeWrites` through the one knowledge writer; adapter from `newsOn` to eventFeed | See `L14_CALENDAR_DESIGN.md` |
| 2 | L4 divination (`00ab553e1`, `597494193`) | `book_world_lotm_cast_host.js:168`: merge `LOTM_DIVINATION_ROWS.queries` into `pack.divinations` | No fact supplier for `actor.lotm.div.*`, so rows are ineligible until one exists; see `L4_WIRING_NOTE.md` |
| 3 | L9 harm (`b8da5ec4a`, `5351071b2`) | Apply `L9_WIRING_S2.patch` (`git apply --check` passed at its HEAD) to `src/simulation.js` preview; host supplies `context.harmSave`, `context.harmActionClass`; accrual into casts and rites; tick for `die:loss_of_control` | Restart is scoped by slice 2 |
| 4 | L11 cities (`474608112` to `7c296b2b2`) | manifest supplements for `lotm-next-city/region.json`, `lotm-baiyam/region.json`; `loadCities()`; route legs to `defineJourneys` rows | `defineJourneys` is T2's seam (`cast_journeys.js`); persona save slice needs a migration |
| 5 | L10 ladder and learn (`3287d6a2e` to `80592d1ad`) | `book_world_lotm_path.js` `advanceLadder`; register conditions and abilities | Ceiling stays Sequence 8, so play is unchanged |
| 6 | L4 summons, potions, crafts; L8 sheets; L13 bridges | Owner-needed effects or read models only | No host consumer yet |

## Changes in my own data line that touch host code later
- Routine bands (`build_cast_pack.mjs --whole-book --from/--to`) produce pack data only. Adopting a band into `private_packs/lotm-cast/cast.json` is a pack revision, not a host edit.
