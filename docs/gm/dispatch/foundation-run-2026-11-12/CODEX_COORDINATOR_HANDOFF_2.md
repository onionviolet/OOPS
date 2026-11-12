# Second Codex coordinator handoff, 2026-11-12

Weibao (2026-11-12): "first, /reconcile-project , then/compact hand off for codex to cotinue work/coordination of other codex absed on everything we have decided this far, reconciel accordingly".

You are the coordinator of the foundation run from here. The Claude coordinator stops after the commit that adds this file. You work in the primary checkout `/Users/weiwei/code/yet-another-idle-rpg` on `master`, and you direct other Codex lanes with `scripts/codex_goal_lane.py`.

## Read first

1. `AGENTS.md`: startup read, design framing, verification, safety, multi-agent rules.
2. `docs/PROCEDURAL_CARRY_OUT.md`, in this order: "Engine first, tie-in later (PC95)", "Keep it small (PC94)", "Gate rule, craft families in the order, and body alteration (PC99)", "Readjusted from the details (PC89-PC93)", "Loops and levels (PC96)", "Direct operators (PC97)", "Crafts, other features, and absorbing a power system (PC98)", then "Reconciliation" (RC1-RC20) and the tracker.
3. `docs/PROCEDURAL_CORE.md`: the section map at the top, then the goals PC1-PC4 and the pipeline PC5-PC8. The rest is reference.
4. `docs/gm/dispatch/foundation-run-2026-11-12/RUN.md`: the "Claude coordinator takeover" block and Waves 10 to 12.

## What Weibao has decided (his words are in `docs/gm/USER_VISION_LOG_2026-11.md`)

| Decision | Where |
| --- | --- |
| Foundations first, playable slices later | USER_VISION |
| Gu is absorbed first, by facet: ability, body, technique, custody, contest, progression ("Yes, use that order") | Core PC29 |
| No early playable scene ("No, engine first") | Core PC88 |
| Game tie-in waits until the foundational and procedural systems work; prove everything in one headless engine world; absorb bespoke code into the system | Carry-out PC95 |
| A limit is a default with ways around it at a cost, because the core rules bind every mechanism ("There are always ways around everything? Dont forget our core rules too") | Carry-out PC99 |
| All four craft families start now, each with a lead directing Codex | Carry-out PC99 |
| Codex may be used up to 50% of the weekly window | Run record |
| Take the overengineering warning into account: clear completion criteria, review changes, stop retry loops | Carry-out PC94 |

Everything else in the two plan docs is a proposal used as working order. Open with Weibao: the core's Q1 (may headline numbers fall; see RC13), Q2 (core and palette split), Q3 (how far wiki-only Gu go), Q5 (may upstream systems wait), Q7 (phase order). Nothing those would defer is deferred.

## The goal as five numbers

Run `npm run check:coverage`, `npm run report:couplings`, `npm run report:compression` and `node --test tests/engine_world.test.js` to read them. Each packet you dispatch names the number it moves.

| # | End state | At handoff |
| --- | --- | --- |
| G1 | Canon rows compute as expressed through the generic runner | 38 of 80 Hogwarts spellbook rows; 0 in the other six ledgers |
| G2 | Packs composed by the one engine world (`src/engine_world.js`) | 12 of 12 registered; a thirteenth (`l.body_alteration`) is on a branch |
| G3 | Cross-domain couplings exercised in one mixed run | 5 |
| G4 | Generators whose output executes in the engine world | 0 |
| G5 | Bespoke Gu modules absorbed with a passing parity fixture | 0 (36 activation callers, 65 Keeper modules) |

## State at handoff

- `master` is at the commit that adds this file. Its message names the Wave 12 gate. Check `git log -3` and `git status` first.
- Dirty and not this run's, leave uncommitted: `dist/bundle.js`, `dist/bundle.js.map`, `index.html`, `docs/tools/game_mcp_limits.jsonl`, `docs/gm/FOUNDATION_RUN_PLAYBOOK.md`, the first `CODEX_COORDINATOR_HANDOFF.md`, untracked `scripts/wave_scratch.sh`.
- Family branches, each in its own worktree with a `node_modules` symlink to the primary checkout:

| Family | Worktree | Branch | State when this was written |
| --- | --- | --- | --- |
| Body alteration | `/Users/weiwei/code/yair-w12-body` | `codex/w12-body` | Committed `af757abd2`; lead's return is in the run record's Wave 12 notes once folded |
| Stored workings | `/Users/weiwei/code/yair-w12-stored` | `codex/w12-stored` | Committed `0f64436f6` |
| Bindings | `/Users/weiwei/code/yair-w12-bindings` | `codex/w12-bindings` | Committed `9ddb0a947` (`src/binding.js`, `tests/binding.test.js`, `FAMILY_BINDINGS.md`); asks K to export `matches` from `kernel_oath.js` and for a multi-breach receipt |
| Process crafts | `/Users/weiwei/code/yair-w12-process` | `codex/w12-process` | Committed `5f77574a3` (`src/process_law.js`, `src/load_law.js`, fixture, tests, `FAMILY_PROCESS_CRAFTS.md`); law `f.process` with `hold` and `work`; no parity fixture against `gear_work.js` yet |

  Before touching a family branch, run `python3 -I scripts/codex_goal_lane.py status` and check that its lane is finished and that its worktree is clean (`git -C <worktree> status --short` shows nothing but `CODEX_*.md`). If a lead has not committed after its lane finished, review and commit the worktree's state on its branch yourself.
- Finished worktrees to retire after their content is confirmed on `master`: `/Users/weiwei/code/yair-w11-formulas`, `/Users/weiwei/code/yair-w11-feeding` (both folded in Wave 12), following `docs/gm/SHARED_WORKTREE_PRACTICE.md`.
- Known failing test outside the suite: `tests/headless/away_bank_equivalence.test.js`, woodcutting case. It fails on a clean checkout of `0876c3906` and is not this run's (RC18). Do not fix it as part of a foundation packet; report it.

## Next, in order

1. **Merge the four family branches, one at a time.** For each: read the diff against the core rules (no hard refusals, no world numbers in shared modules, no "never/always/only" without a reason, no pack importing another pack), run its focused tests from the primary root, resolve `src/engine_world.js` and `tests/engine_world.test.js` by keeping every registry row and updating the pack counts, then run the gate below. Record a receipt per family in `RUN.md`. Each lead's own "below the bar" list goes in the receipt unchanged.
2. **Answer the owner requests the families raised.** W: saved chain rows drop `detail`, which the stored-working blow trigger needs. K: a holder-local rate port at settlement for pace, and a `hold: true` composition slot that lowers to a stored working (TG1). Each is a small packet to that owner with a second consumer named.
3. **G1, more rows that execute.** The 42 Hogwarts rows without a case, by reason: 18 publish for the mind, knowledge or working owners (those owners need a reactor that answers); 14 lower to an act the world refuses (vocabulary in `sharedEffect` and W acts on form and position); 5 are law fields and 1 makes a new holder (the runner's `expect` needs those two shapes); 3 are an act plus a publish; 1 has no shared reading (`animate`). Then Gu abilities as sentences with cases for the 57 labelled chapter-checked kinds (core queue item 5, first pass), then the Draught of Living Death into a body as a potion case.
4. **Gu bodies.** `src/gu_catalogue.js` now carries `body` data for 78 kinds (17 stated diets, 61 unknown). Connect it to the living-things lifecycle so `creatures.jsonl` rows blocked on `gu-body-fields` become per-field unknowns or run.
5. **Budget.** The mixed engine day costs 799 of an 800-segment budget, nearly all from the shell regulator oscillating all day. Give it a rate form with the same totals before another oscillating pack joins.
6. **G5, first absorption.** One Keeper scene re-expressed as rows in the engine world with a parity fixture against the old module's outcomes. The old module stays; deleting it is tie-in work.
7. **G4, first generator.** Generated Gu moves landing through the effect host in the engine world, frozen on discovery.
8. **Improvement loop gaps** from the breeding fixture: a real trade-off in a genome row, a creature assay with a cost, a standing program for many generations in one settlement, and births interleaved with losses still rounding per run.

Not authorized without Weibao: any reading pass that spends paid credit; a reading of The Perfect Run (it is in the library as a prepared 130-chapter capture with no pass recorded, and the carry-out's column for it is a sketch from memory); pushing; any wiring into `src/main.js`, live routes or UI.

## How much canon the data can carry today

| Corpus | Enough to run now | Needs reading first |
| --- | --- | --- |
| Hogwarts spells | 117 spellbook rows with page locators; 80 have effect sentences | Spell names from the wiki without book hits (640 titles) |
| Gu | 78 chapter-checked kinds; 57 with labelled effects; 23 move records | 1,388 wiki-only kinds; 753 move leads; Reverend Insanity volumes 5 to 24 have no reading passes |
| Lord of the Mysteries potions | 46 with formulas | 173 Sequences with no main material in the notes |
| Hogwarts potions and ingredients | 5 potions run by test; 79 ingredients have evidence rows | 380 ingredients lack property rows |
| Creatures | 18 run; no Hogwarts creature row exists | Hogwarts creatures |
| The Perfect Run | The eight-question recipe (PC98) and a generic power-granting potion in the body alteration fixture | The whole power system |

## Limits (hard)

- Codex weekly window: stop every lane and yourself at **49% used** (22% at handoff). Read `python3 -I scripts/codex_goal_lane.py usage` before each lane and at least every 30 minutes. If a read fails, open no lane.
- Credit balance: stop at **62,000** (headroom 2,961 at handoff).
- At most three lanes at once, one writer per file. More than that needs Weibao's word.

## How to work

- **Gate.** The full `npm test` runs when a wave changes a `src` file the game loads (`node scripts/reachable.mjs --is <file>` exits 0), a shared test helper, the build or dependencies; otherwise the gate is every test that imports a changed module or reads a changed data file, plus `check:arch`, `check:rules`, `check:coverage` and `check:docs`. Run one full suite a day regardless. Pass test files as separate arguments (`xargs node --test < list.txt`); an unsplit shell variable silently runs fewer files (RC19). `npm test` already runs through the limiter; do not wrap it.
- **Keep it small (PC94).** Completion is the five numbers. No new checker scripts. Two tries on a packet, then stop it and write what was learned. Read every diff before the gate. Findings go to `RUN.md` as receipts; the plan docs change by editing lines.
- **Core rules in every brief.** Everything is possible, reasonably; things work by how they work; a limit is a default with a dial, an in-world reason and ways around it at a cost; world numbers are pack data; shared modules name no world; proposal status (AD32).
- **Engine first.** No game tie-in, no browser passes, no game save slices for new work. A bespoke module is absorbed when a parity fixture matches it; it is deleted at tie-in.
- **Commits.** Own paths, from a fresh `HEAD`, with the guarded recipe in `docs/gm/SHARED_WORKTREE_PRACTICE.md` (private index, `commit-tree`, `update-ref` with the old value). No `Co-Authored-By` trailer. No stash, reset or force. No push. Run `npm run check:rule-routes -- --message <file>` before committing runtime code.
- **Prose.** No em dashes. Sealed truths by ID in chat and reports. Raw book prose stays out of git. Browsers and apps run headless with no visible window, by his standing rule of 2026-10-30.
- **Record.** After each wave: receipts, the five numbers, the usage read, and an updated resume line in the carry-out's tracker and `RUN.md`.

## Stop

Stop at either limit, at a decision that is Weibao's (a push, a paid reading, a direction change, a limit raise, one of the open questions blocking the next packet), or when the Next list is done. Leave `RUN.md` current and a short report in outcomes: what now runs in the engine world, the five numbers before and after, checks run, what is open.
