# Core foundations scorecard, 2026-10-14

Weibao asked how well the core foundations hold up, what else to consider,
and to send Codex where useful. This is an audit, not a decision. It scores
the U01-U15 map from the [shared foundations audit](SHARED_FOUNDATIONS_AUDIT_2026-10-12.md)
plus the kernel pieces from [ability authoring](worlds/ABILITY_AUTHORING.md#foundations-check-and-other-systems-that-share-the-pattern-2026-10-13)
against source at HEAD `5c084e50` of `codex/gameplay-foundations`.

Method: one read-only code sweep of `src/` and `tests/` (paths and names
below come from that read). Nothing was run. "Consumed" means a real action,
calculation or gate reads the field.

## Verdict

Wide and mostly real, but split. About 458 source files (97.7k lines) and
97 test files. Most foundations exist and something actually reads them.
The weakness is not missing pieces. It is that the same job is done two to
seven different ways, and the "shared" core imports world code, so every new
world edits the core. Features are landing faster than the core is unified.

## Scorecard

| Code | Foundation | Score | Main evidence | Clearest gap |
|---|---|---|---|---|
| U01 | Person, body, controller | partial | `simulation.people[id]` with life/body/vitals; `body.ownerId/controllerId` asserted in `simulation_effects.js` | One body per person; no control transfer or possession; legacy `Person` runs in parallel |
| U02 | Anatomy, needs, senses | thin | Conditions as injuries (`body_progression.js`); default-off hunger (`absorb_e1/pacing.js`) | No body parts, slots or sense model; one hand-built nonhuman body |
| U03 | Coherent beginnings | solid, narrow | `structured_pack_runtime.js` with typed starts, durable selection, tests | Foundation start sits behind `?foundation_probe=1`; `anchor_snapshots` lives only on the unmerged start-records branch |
| U04 | Randomness | partial | `state.rng`, per-check derived seeds | 63 `Math.random` calls in combat, loot, crafting, gathering; xorshift copied in 7 files. Fix exists unmerged on `proc/p1-streams` |
| U05 | Time and scheduling | partial | One ordered boundary queue (`simulation.js`), lifespans, world rhythm | No offline catch-up; boundary loop hardcodes world skips |
| U06 | Knowledge and perception | partial | `simulation.knowledge` stages; knowledge-filtered person facts | Predicates still read true target state; no appraisal or in-world language |
| U07 | Learning and capability | partial, fragmented | Skills, `capabilities.js`, `techniques.js`, `power_models.js`, faculties, energies | About six overlapping capability systems; teaching is bespoke three times |
| U08 | Relationships and standing | thin | Two stores (`simulation.relationships`, `chronicle.relationships`), legacy reputation | 42 content effects write relationships; almost nothing reads them; no factions |
| U09 | Ownership and economy | partial | `simulation.custody` owner/holder; native storage and equipment transactions | One legacy money number; untyped resources; owner/holder only on custody records |
| U10 | NPC agency | solid (engine) | Priority-ordered controllers that run real commands; residents | No needs or goals; core loop imports world gates; legacy NPCs have none |
| U11 | Actions and consequences | partial | Quote then commit (`previewSimulationCommand`), 33-op effect vocabulary | Three action pipelines; world IDs hardcoded in the preview |
| U12 | Travel and carriers | partial | `realm_connections.js`, `realm_cargo.js`, transitions; used by 6+ hosts | Barely tested directly; carriers are per world |
| U13 | Loss and continuation | partial | Heir flow wired (`heir_inheritance.js`); rebirth transition | Rebirth used only in tests; combat death is unconsciousness only |
| U14 | Durable state | solid, fragmented | `save_files`, `save_migration`, `save_compatibility`, provenance hashes | Engine schema number bumps per world; no general migration chain |
| U15 | Presentation | thin | `panel_kit.js` `definePanel`, status window | Three kit callers; no kit test; `display.js` 6.2k lines |
| K1 | Shared tag store | absent | Per-item `tags` only | Blocks rule-list crafting, senses as tag filters, cheat cards as data |
| K2 | Rules and programs | partial | `rules.js` used in 29 files; programs repeat N times | Programs have no conditions; two more condition engines in parallel |
| K3 | Cheat runtime | thin | `cheat_cards.js`, CH1 dormant start card, awaken | Hooks, stages and observers always empty; points never earned |
| K4 | Crafting and mixing | partial / absent | Legacy recipes with rollback transactions | Craft rolls use `Math.random`; mixing only on unmerged `proc/p2-mixing` |
| K5 | Combat | partial | `combat_math.js` with injectable random | Four or five battle state machines; main combat unseeded |

## Findings

F1 Two state models run side by side: legacy globals in `main.js` (8.6k
lines) and the engine (`state.simulation`). Most partial scores come from a
feature living in only one of them.

F2 Duplication, by pair: person (legacy vs simulation), relationships (two
stores), conditions (legacy, engine, `packConditions`), actions (three
pipelines), PRNG (seven copies), capabilities (six systems), battles (four or
five machines).

F3 The core depends on the worlds. `simulationFacts` merges about 40
per-world fact functions, and `simulation.js` hardcodes world command IDs and
gates. Each world added makes the next one more expensive and raises merge
conflicts in the same few files.

F4 Write-only data. Relationships are the clearest case; cheat card hooks and
status window points are others. A field nobody reads looks done in a report
and does nothing in play.

F5 Integration debt is now a foundation risk of its own. At audit time: about
77 Codex processes, load average 360-470, about 20 unmerged `absorb-all/*`
branches, `proc/wave1-integration` (streams, mixing, storylets, people)
unmerged, and R15 G10 blocked by another session's staged files in the shared
index. Unmerged fixes (U04 streams) do not help play.

## Weakest five, ranked by worlds blocked

1. U01 + U02 body, anatomy, senses, control: blocks nonhuman, possession,
   summon and multi-body starts. The nonhuman-starts engine lane is designing
   this; keep it the owner.
2. U04 randomness (drags K4, K5): merge `proc/p1-streams` before more
   features add `Math.random` calls.
3. U08 relationships and standing: blocks social, court, sect and romance
   worlds, and companions.
4. K1 tags + K2 conditional programs + K3 cheat hooks: blocks System worlds,
   cheats-as-data and automation.
5. Core coupling (F3) with U14 per-world schemas: the cost multiplier on
   every future world.

## More to consider

| Code | Angle | Why it matters |
|---|---|---|
| M1 | Determinism replay test: seed a save, run N in-game days headless, hash the state; rerun must match | Catches every new `Math.random` and save drift in one check |
| M2 | Ratchet tests: count of `Math.random`, world imports in `simulation*.js`, and non-kit panels may only go down | Stops the debt growing while it is paid off slowly |
| M3 | World registry: worlds register facts, gates, boundary skips and schema steps; the core imports none of them | Fixes F3; new worlds stop touching shared files |
| M4 | One migration chain: global save version plus per-world sub-versions, each step a pure function with a fixture | Replaces per-world schema bumps; every persistence change gets a tested path |
| M5 | Read-side first for duplicates: one read API per concept (person, relationship, capability) over both stores before any store merge | Lets worlds consume one shape now; store unification can wait |
| M6 | "Consumed" check in review: a new field must name its reader and a test that reads it | Prevents F4 |
| M7 | Content load validation: every pack checked against registries at boot in dev | Typos in fact names fail loudly instead of reading false |
| M8 | Tick budget probe: time one boundary step with all worlds loaded | `simulationFacts` merging 40 functions per evaluation may get slow (inference, unmeasured) |
| M9 | Test floor for shared modules: every module imported by 3+ worlds gets a direct test | U12 travel is the first case |
| M10 | Merge cadence: cap open code branches per wave; integrate before dispatching the next wave | Addresses F5; fixes reach play sooner |
| M11 | Monolith split plan for `main.js` and `display.js` by seam, one seam per change | Reduces conflict hot spots for every lane |
| M12 | Belief/truth fence: predicates about other actors read the actor's knowledge view by default; true state needs an explicit "omniscient" flag | Makes U06 hold for NPC agency, deception and appraisal cheats |

## Codex lanes queued

Dispatched under [core-foundations-2026-10-14](gm/dispatch/core-foundations-2026-10-14/COMMON.md).
Each code lane works in its own worktree and branch, adds new files or tests
only, and does not merge. All results are proposals until reviewed.

| Code | Lane | Kind | Covers |
|---|---|---|---|
| A1 | Core consolidation plan: world registry, migration chain, read APIs, ratchets, with file:line and save decisions | docs | F2, F3, M2-M5, M11 |
| A2 | Minimal shared tag store as a pure module with tests | code, new file | K1 |
| A3 | Direct tests for realm travel and cargo modules | tests only | U12, M9 |
| A4 | Relationship read view over both stores, plus a design for factions and standing | code, new file + docs | U08, M5 |
| A5 | Determinism replay harness and ratchet tests (report-only mode) | tests only | M1, M2 |

Not dispatched, already owned elsewhere: U01/U02 (nonhuman-starts engine
lane), U04/K4 streams and mixing (procgen wave 1 integration), U03 snapshots
and U05 offline time (derived-snapshots lane), U13 runs and endings
(runs-and-endings lane).
