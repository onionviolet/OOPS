# R15 G6: FA22 minigame and management families (MG01–MG10)

2026-10-13. Worker branch `worktree-agent-a98ba83b128c9a0c3`, commit 0810bdf9,
based on 4becff87; merged by root. Root saved this report from the worker's
hand-back text. Authority: [R15 brief](../BRIEF.md) and Weibao's 2026-10-13
instruction adding FA22 to R15. Design and original acceptance list:
[design](../../../../minigames-2026-10-11/DESIGN.md),
[backlog](../../../../minigames-2026-10-11/ACCEPTANCE_BACKLOG.md). Fiction,
names, prices and balance remain reversible proposals awaiting Weibao.

## Result

The saved Codex candidate (`IMPLEMENTATION.diff`, 84 commands) was applied to
current code; conflicts in `src/main.js`, `src/expansion_engine.js`,
`src/simulation_effects.js` and `src/simulation_ui.js` were resolved by keeping
current code and adding the courtyard entries. As delivered, the game could not
be played: the courtyard charter never appeared, and three more defects broke
MG01 settlement, every crafted product and repeat work. All four are fixed with
tests. After the fixes every family was played **natural** on the rebuilt bundle
at 1600×1100 (new game in Village, ordinary clicks, no seeded state), each with a
failure or cancel case, plus Save/reload, Export and literal-file Import on a
separate fresh profile, a repeat import that paid nothing twice, a failed-save
injection and old saves without courtyard state. `npm test` passed 594/594 on
the worker branch, including 17 new courtyard tests.

## How to reach it in play

1. Start a new game and stay in Village.
2. Open Local actions, then **Market courtyard · trade, property and projects**.
3. Choose **Visit the market courtyard · optional, free**.

The starting purse (102) covers all ten families, and Mira sells logs, cloth and
seed. Everything happens in Village on played time. The first full route takes
about 15 minutes of real play.

## Defects found and fixed

| ID | What was wrong | Evidence | Fix | Test |
|---|---|---|---|---|
| F1 | The charter and every "not yet chosen" gate (`not(...)` on an unset `actor.mg.*` fact) never passed: the rules engine treats an unset fact as unknown, not false, so the panel offered nothing | source: `mg.begin` preview `visible:false` | `src/management/facts.js`: courtyard actor facts no command has set now read as `false` | every journey in `tests/management.test.js` starts from the charter |
| F2 | MG01 share return and advance repayment threw "Actor does not hold this claim" by re-settling a claim the earlier instant command had already settled | source test | `src/management/capital_rooms.js`: removed two duplicate settle effects | MG01 share and advance tests |
| F3 | Courtyard items had no native `id`, so the first finished crate threw "Unknown acquired item." and the clock stalled one minute before the job was due, every tick | natural, browser on pre-fix bundle 49f6ad90 ([evidence](evidence/n0-defect-unknown-item.json)); last published save stayed intact | `src/management/foundation.js`: pass `id` to `OtherItem` | item registration test |
| F4 | Program-scheduler repetitions received a flat `vitals` object, so repeat work with a stamina cost paused at once; only the first repetition ran | source test | `src/simulation.js` program boundary passes `vitals: out.vitals`, same as the controller path | MG07 mandate test runs three repetitions |

## Per family

All browser checks: rebuilt bundle `6270d46aa670…`, fresh profiles, 1600×1100,
headless Chrome; served bytes matched disk bytes on every load.

| Family | What was checked | Label | Result |
|---|---|---|---|
| Charter | Only the free visit is offered first; visiting gives no money, deed or debt; residents and Mira's finite stock appear | natural | pass |
| MG01 | Inspect, share 3, batch, **cancel** (2 logs back, no crate), batch again, sale of 6 into Orin, one return of 4, settlement closed. Run B: goods advance, sale of 6, repay 3 once. Run C: pass moves nothing | natural | pass |
| MG02 | Buy room 5, repair with 1 log, rental; Sela's stay pays 2 at completion; **changing room use is blocked** during the stay; request, repair answer, personal rest. Run B: ending the rental creates no debt | natural | pass |
| MG03 | Mira's crate at 6, then her demand closes; Sela's greens at friendly 3; **Bram's fine-crate sale refused without a fine crate**; inn meal **cancelled** (portion back, no pay), then served for 3. Run B: grain meal pays 5 | natural | pass |
| MG04 | No bid before inspection; ten ceiling wins at clearing price 8; lot closes. Run C: five ceiling loses, no money moves | natural | pass |
| MG05 | No shipment before Bram's order; escorted crate holds cargo, 2-coin fee and 2 of Orin's stamina, delivers 12 once, pays Orin; order closes. Run B: local run pays 8. Cancel refund and leaving Village mid-job: source only | natural (cancel: source) | pass |
| MG06 | Rent 4, buy seeds; no harvest on empty plot; planting **cancelled** (seed back); greens harvested for 3 once; occupied plot can't be replanted; grain gives 5 | natural | pass |
| MG07 | Recipe must be done once by hand before a mandate; mandate of 3: **pause**, resume, **cancel current repetition** refunds the log; Bram's order pays 6 once. Foreman: one order, Orin's stamina, crate returned once. Run B: careful crate pays 10; Orin's job **stopped**, logs collected, fee kept | natural | pass |
| MG08 | Loan of 8; **no collection before the paid work**; extension moves no money; funded crate pays Sela 10 and player 2; principal collected once. Run B: gift never collectible. Run C: refusal moves nothing | natural | pass |
| MG09 | Book for 2, **cancel unhosted booking refunds 2**; restored exhibition refused without a restored display; conserved exhibition pays 8, object stays with Mira. Run B: grain gathering pays 5 | natural | pass |
| MG10 | Conservation **cancelled** (heirloom and cloth back); conserve, display, withdraw the same object. Run B: sale-grade repair, sold to Bram for 14 once | natural | pass |

Source tests in `tests/management.test.js` (17) repeat each core loop and its
failure paths, plus shipment refund on leaving Village, refusals without money,
the mandate stopping on a log shortage, expansion save/load with a held job, and
rejection of edited resident coins, duplicated stock and a partial charter.

## Persistence

| Case | What was checked | Label | Result |
|---|---|---|---|
| P1 held state | Shipment in flight, paused mandate, planted grain, extended loan, prepared exhibition, displayed object. Save/reload identical; Export and literal-file Import on a separate fresh profile identical; both copies then completed the shipment the same way (money 59 → 71) | natural | pass ([P1](evidence/P1-persistence.json)) |
| P2 completed state | After the whole route: reload, Export, then Import twice into the same profile; nothing paid or created again | natural | pass ([P2](evidence/P2-completed-persistence.json)) |
| P3 old saves | A new game exported from the pre-integration build (4becff87) and the committed D1 fixture, each imported on fresh profiles of both builds: no `mg.*` data; money, location, inventory, skills and people equal; only `availabilities` differs (default records for 8 new item templates) | natural (D1 file is an existing seeded fixture) | pass ([P3](evidence/P3-old-save.json), [diff](evidence/P3-availabilities.json)) |
| P3 older reader | Pre-integration build rejects the completed courtyard save without writing storage | natural | pass ([evidence](evidence/P3-older-reader.json)) |
| P4 failed write | Storage writes forced to fail during a log purchase: purse, inventory, Mira's coins and stored save unchanged; after reload one retry bought exactly one log | natural | pass ([evidence](evidence/P4-failed-publication.json)) |

Compatibility: no new save domain and no migration. Courtyard state lives in the
existing expansion actors, simulation owners, sites, claims and knowledge, and
only the explicit charter creates it, so old saves stay inert.

## Source files changed

From `IMPLEMENTATION.diff`: new `src/management/*.js` (13 files),
`src/data/expedition_items.js`, `src/expansion_engine.js`,
`src/feature_expansion_content.js`, `src/simulation_ui.js`. G6 fixes:
`src/management/facts.js`, `capital_rooms.js`, `foundation.js`,
`src/simulation.js`. New `tests/management.test.js`. Shared hunks: `src/main.js`
(candidate hunks only: imports, `managementPanel`, native contexts, five render
lists, three `actSimulation` guards, `actManagement`, panel creation),
`src/simulation.js` (candidate guard plus F4 line), `src/simulation_effects.js`
(one import, one facts spread). `src/save_files.js` untouched.

## Still open

- **Weibao's acceptance** of the courtyard setting, fiction, names, prices and
  pacing. Village stamina regenerates in about a second, so courtyard stamina
  costs have no real effect there; costs are low against the 102 starting purse.
- **UI polish, not defects:** used one-time offers stay visible as disabled rows;
  several refusals show the generic "required knowledge, means or circumstances
  are missing" instead of the specific item or purse reason.
- **Backlog cases not run in the browser:** P4 at the other eight save points;
  P5 lost contact and leaving mid-job (source only); P6 edited imports (source
  only); P7 keyboard focus.
- After a failed write, saving stays blocked until reload (shared save code
  behavior, not courtyard code).

## Harness and evidence

`harness/repl.mjs` serves the worktree on 127.0.0.1:19160 and takes steps on
19161; `harness/run-step.sh <step>` sends `steps/_prelude.js` plus the named
step. Order: n00–n09 natural run A, b01 run B, c01 run C, p3/p3b/p3c old saves
(pre-integration build on 19162 from a `git archive HEAD` copy), p4 failed save
write; `p-stamina.js` is the stamina probe. Profiles stayed under
`/private/tmp/r15-g6-profile*`. `evidence/` (about 1 MB) holds journals,
persistence comparisons, three exported test-hero saves and one screenshot.
