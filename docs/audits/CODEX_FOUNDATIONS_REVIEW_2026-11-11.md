# Codex foundations wave review, 2026-11-11

Claude review of the Codex procedural-foundations chats (FG1-FG7 plus the earlier build phases of the same goals), read at about 15:00 EST on a shared tree that other writers were still changing. These are findings and proposals. None of them is an accepted decision.

## What the wave did

- Eight Codex chats with goals: Gu/world rules, creatures, potions, chemistry, crafting, Hogwarts vocabulary, spell research, and other systems. Weibao set the direction in those chats ("foundations first, wiring later", "playable slices later").
- Code: 153 new `src` files (about 16.2k lines) and 122 modified tracked files (+11.5k / -0.5k). 114 of the new files are Gu. None of it is committed; the last commit is `b92e1e87f` at 00:08.
- Docs: the Round 5 and 6 foundations map in [CROSS_WORLD_SYSTEMS_TRANSFER](../CROSS_WORLD_SYSTEMS_TRANSFER.md#round-6-foundations-goals-by-existing-chat), per-lane checkpoints under `docs/gm/dispatch/*-2026-11-11/`, and root-rule research docs.
- The latest FG phase is paper only: source cases, a counterexample per rule, and paper checks.

## Checks run on the combined tree

| Check | Result |
| --- | --- |
| `npm run build` | pass, bundle `9174af76c42d3f19...` |
| `npm run check:arch` | pass, main.js 10114 vs baseline 10115 |
| `npm run check:rules` | pass. One TMR1 warning comes from committed `book_world_hp_exams.js`, not this wave. One stale glob. |
| 23 new test files | 135/135 pass |
| `npm test` (full) | **fail: 6142 pass, 4 fail, 2 skipped.** The background wrapper reported exit 0 while the suite exited 1, the same false-green as the morning's merge8. |

Full-suite failures:

1. `tests/ui_contract.test.js:6` `src/spellbook_ui.js` inserts its panel into a foreign host (UR65-UR68 contract).
2. `tests/ui_contract.test.js:36` `spellbook` has no surface entry in `LAYOUT_SPEC.surfaces`.
3. `tests/hp_lead_life.test.js:26` HP lead pack hash changed (`d2e3...` to `a851...`). `hp_lead_spells.js` gained 215 lines, and the pin and the "does not touch book.hp" claim were not reconciled.
4. `tests/cast_topic_talk.test.js:104` the stored D2 patch no longer applies to the modified `book_world_lotm_cast_days.js`. That is a LOTM/Klein-area file.

## Findings

**F1 · Two live directions, only one of them recorded.** Weibao told the Codex chats "foundations first, playable slices later". No owner records that: not USER_VISION, not the direction log, not VISION_DIGEST, not PROJECT.md. PROJECT.md still says the immediate build order is Klein through Tingen and Fang Yuan through the Qing Mao departure. Klein stayed at ch129 and Fang Yuan at ch140 today, and no lead-life commit landed. The Gu wave is the `book.ri.keeper` seat, not Fang Yuan's lead line. By the repo's own authority rules, the wave ran off the recorded focus. By Weibao's chat words, it was on direction. The gap is the missing record, not agent drift.

**F2 · The Gu "procedural engine" is mostly hand-authored, one Gu at a time.** 67 keeper and keeper-pack files, about 8.4k lines, median 96 lines each. A typical file (`gu_keeper_seven.js`) hardcodes its own operation list, facts key, JSON parser, timing constants and stock arithmetic. Only 1 of the 67 imports the shared `gu_procedures` or `gu_workshop`. That is the opposite of the stated goal: a small rule set that reproduces canon and yields variants. Each new Gu currently costs a new module, a new validator and new save shape.

**F3 · Shared kernels are forming in parallel, not converging.** `craft_working` has a real second consumer: `potion_workings` and `book_craft_workings` both build on it, which is the healthy pattern. `spell_working` (47 lines, no imports), `creature_methods`, `gu_procedures` and `method_program` are each separate "ordered steps over typed roles" leaves. The second-consumer rule allows this for now. But Round 4's "one extensible vocabulary for invention" is not happening, and the FG paper phase does not address it.

**F4 · The process gates slipped.** AGENTS says merge finished, gate-passing lanes before dispatching a new wave. The Round 6 goals went out while merge8 sat unintegrated, the claude-resume conflicts stayed open and the tree held 324 dirty paths. Every lane verified its own bundle (each receipt has a different build hash), so nobody browser-verified the combined tree, and the combined tree fails 4 tests. A day of work sits uncommitted in one shared checkout.

**F5 · Some evidence is thinner than the labels.** Browser receipts point at `/tmp/...` directories that will not survive a reboot. `living_regulator.js` and `potion_workings.js` have no direct test import; they are reached only through `meadow_shell_state` and `hp_brewing_state`. `book_craft_transaction.js` is imported only by a test, so no runtime route uses it. 46 new runtime files have no direct test importer. Indirect coverage may be enough, but "browser-verified" on a lane receipt means that lane's bundle, not the repo now.

**F6 · What went well.** The credit reserve held (64,960 vs 64,500). Lane receipts carry build hashes and viewports. The seam maps reuse existing owners instead of inventing new ones. main.js did not grow. The crafting lane closed a real matrix: forge, reheat, repair, durable rollback, and paid failure that spends the source once. The paper phase asks the right cross-domain question (what happens when a support leaves mid-process), and the answers separate "already done" from "still needs live support" cleanly.

## Proposed actions (ranked)

- **A1 · Record the direction.** Done 2026-11-11: Weibao answered "Foundations first". Recorded in the [direction log](../gm/USER_VISION_LOG_2026-11.md#foundations-first-playable-slices-later-2026-11-11), USER_VISION, VISION_DIGEST and the PROJECT.md focus line. F1 is resolved; the wave was on direction.
- **A2 · Stop new dispatch, fix the 4 failures, commit by lane.** Spell lane: spellbook surface entry and host insertion, plus the HP lead pack pin. LOTM owner: refresh or retire the D2 patch. Then commit each lane's own paths from a fresh HEAD. Trust the suite's real exit code, not the wrapper's.
- **A3 · Make the Gu paper phase end in a compression test.** Express 5-10 existing keeper modules as data over one shared procedure, operation and stock owner, and delete the bespoke files that it covers. If the rules cannot express them, that is the real foundation gap.
- **A4 · Unify the "working" shape before a fifth one appears.** Compare `craft_working`, `spell_working`, `creature_methods` and `gu_procedures` on one page: roles, ordered steps, quote, settle, receipt. Promote the common part only where two consumers already agree.
- **A5 · Move proof into the repo.** Each lane copies its browser receipt JSON somewhere tracked or regenerable, and runs one browser pass on the combined bundle after A2.

## The Derive and Implement World Rules chat (Gu goal)

Thread `01a1c932-2eb9-7342-b2d5-6163e117392b`, 01:01 to about 15:10 EST. Live checkpoint: [GKM229](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#comprehensive-goal-evidence-and-open-foundations) and its session handoff.

- **G1 · Phases.** 01:00-02:20 research and framing. 02:20-11:20 about 60 playable Gu Keeper slices (GKM numbers), one every 6 to 10 minutes, each claiming browser and save checks on its own build. 11:30 onward, after Weibao said "foundations first", it built the foundations map, dispatched FG1-FG7, folded the returns, grew the source index and ran read-only probes.
- **G2 · Coverage against the goal.** Every clause has at least one slice or paper case: source index (2,206 wiki rows in 1,466 records, 78 chapter-checked Gu, 23 move records, 753 move leads), wild ecology (wolf ridge, roaming Liquor Worm), farming (fireflies, Nine Leaf grass), propagation (Thunder Potato mother), individuality (tray Moonlight traits), bonds and agency (Insight Moth), Immortal uniqueness and contested refinement (Fortune Thread, Fixed Immortal Travel), composition and variant search (Red Fire, Giant Hand pairs, Fork Light), failure and recovery, time-path borrowing. The pet seam was assessed with the creature lane.
- **G3 · Strength.** Epistemic hygiene is good: source facts, authored fixture values and open questions are labelled separately throughout, and conflicting chapter evidence is kept rather than flattened.
- **G4 · Gap: breadth by bespoke scene, not by engine.** The data path (`gu_catalogue.js`) holds 21 kinds against 2,206 indexed rows. 67 Keeper files hand-build one scene each and only 23 Gu-area files read the catalogue. The goal says "reproduce known Gu ... with data and reusable mechanics"; most of the day reproduced them with code. The reusable leaves (activation, refinement, claims, move search, projection) are real, but each scene re-wires them.
- **G5 · Gap: no finish line.** "Comprehensive" plus open-ended paper rounds means the goal stays active forever. Its own next steps (GKM231, GKM233, GKM246) add more paper cases rather than reducing the 67 modules.
- **G6 · Gap: proof is per build.** Playable claims hold for each slice's recorded bundle. The combined tree has not been browser-checked, and nothing is committed.
- **Proposal.** Give the goal a measurable next milestone: catalogue N kinds from the index as data, and re-express M existing Keeper scenes through shared leaves with their old modules deleted and tests still passing (A3 above).
