# MR5 checkpoint: P6 crowds and bystanders (memory side)

Status: **at the floor for the village public-scene route**, agent-verified, not human-reviewed. The fight hook is a prepared patch, not applied. Authority: [systems design](../LEAD_LIFE_SYSTEMS_DESIGN.md) LSD366-LSD369, LSD344, LSD347, LSD139, LSD353; AR1-AR16, AD36/43/45, CLR3.

## Built

| Piece | Where | Default, dial, reason |
| --- | --- | --- |
| Crowd record | `src/crowd.js` | Derived, never saved: roles (worker, vendor, child, elder, authority) by time band, scaled by place, minus named cast present, with a daily head-count swing. Table `crowd.table@1` (`id@rev`, reasons) |
| Step | `stepCrowd` | One keyed draw per (crowd, step) splits every role into flee, freeze, watch, help, fetch by systematic rounding, so heads are conserved. A worse sight moves watching into fleeing and freezing |
| Lazy promotion | `promote`, `chooseWitness` | A person is a pure function of (place, day, band, role, index): id, role and name seed do not depend on other heads or on play order |
| Testimony | `comesForward`, `crowdTestimony` | `crowd.testimony@1`: keyed by witness, investigator and day; civic goals raise it, protecting the player or fear lower it |
| Memory glue | `src/crowd_memory.js`, `mergeImpression` in `src/person_memory.js` | A scene writes one `witnessed` episode for the promoted witness and one merged group impression per place and subject; never twice for one fact |
| Public scene hook | `scene` field on a relationship effect (`simulation_effects.js`, one hunk), handled in `memoryForPlan` | The village interruption at the workbench is the non-fight public scene: `scene {place: "Village", severity: 1}` |
| View | `src/promise_ui.js` | Names from the world name grammar via a port, role, and the witness's manner or what they saw |

Population owners checked: `src/cast_schedule.js` gives named cast whereabouts (used only as a count to subtract); `src/world_pack_population.js` serves loaded packs, not the base village, so the default presence table stands in until a pack supplies one through `scale` and `exclude`.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/crowd.test.js` | PASS 5/5: replay, head conservation, scare, promotion independent of other heads, testimony goals, scene writes once and merges | |
| Focused set (crowd, person_*, promise, everyday_life, simulation, people_knowledge) through `slot_run --kind suite` | PASS 86/86 | Full suite waits for the supervisor's merge gate window (not before 05:30 local) |
| `npm test` through `slot_run --kind suite` at 05:33 | 4519 pass, 14 fail: the 11 cast/lotm/character_sheets/facts_frame failures recorded for MR4 (rerun alone through the gate earlier, same result), plus `slot_run` (2, other sessions hold slots) and the UI design-token test (UR65-UR68), none touching crowd, person_*, promise or simulation | Not proven by a clean-tree run |
| Chrome 1920x1080 through `slot_run --kind browser`, real clicks, named fixtures only for craftsman meeting and logs | After the interruption: "Villagers who saw you: 6 watched. Rue Eddy (vendor) remembers you. Cooler toward you since you interrupted his counting at the bench." | |
| Same pre-interruption save opened in two fresh origins | Same witness, same count both times (`replayFirst` = `replaySecond`) | Different fresh lives have different seeds and so different people, by design |
| Save, reload, `save_to_file` then `load_progress` | Same witness and count; line falls back to "Saw that you interrupted his counting at the bench." once the memory is too faint to change manner; memory slice identical after import; no page errors | |
| `git apply --cached --check P6_FIGHT_HOOK.patch` | Applies to committed `src/native_battle.js` | Not run in a fight; p4-fights owns that file and is dirty |

Evidence: `p3c_evidence/p6-crowd-1920.png`, `p6_browser.mjs`.

## Known limits

- Fights, helping, fetching authorities, hurt bystanders as shields, and authority arrival time are not wired; `stepCrowd` and `promote` supply them through the patch. Investigator testimony exists as functions only, with no command or screen.
- Only `sees_face` promotion is exercised in the village; intervene, hurt and picked-up-item reasons use the same function.
- Roles are a default table; a world swaps it with a new `id@rev`.
