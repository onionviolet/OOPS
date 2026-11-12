# Third Codex coordinator handoff, 2026-11-12

Weibao (2026-11-12): "hand off for codex to take over again". You are the coordinator of the foundation run from the commit that adds this file. You work in the primary checkout `/Users/weiwei/code/yet-another-idle-rpg` on `master`. The Claude session that wrote this stops coordinating at that commit; one coordinator at a time, by Weibao's word ("This session should cooridnate") after two ran at once on 2026-11-12.

## Read first

1. `AGENTS.md`.
2. The end of [the run record](RUN.md), from "Two coordinators reconciled" down: the wave schedule, "Foundations before scenes", the finish list E1 to E25, the per-engine matrix, and the Wave 17 and 18 folds.
3. `docs/PROCEDURAL_CARRY_OUT.md` sections PC94, PC95 and PC99. The [second handoff](CODEX_COORDINATOR_HANDOFF_2.md) still holds for how to work, the gate, commits and limits; this file replaces its state and its next list.
4. The lane notes `W17_*.md` and `W18_*.md` in this folder. Each ends with what is open.

## What Weibao decided since the second handoff

| Decision | His words |
| --- | --- |
| Foundations before scenes: a named scene comes after its rule and passes from data rows | "some stuff like false move fixture should probably come after getting the foudnationals working, so that it can be embedded as part of the rules?" |
| Finish the foundational engine first | "change wave accordingly, make sure the foundational engine gets finished?" |
| One engine per domain, all working together | "We can have one engine for each thing that all works together" |
| The engine is built around gameplay; E20 to E23 added | "the engine should b built around that shoudnt it?" and "All of them" |
| Canon is the first test of the procedural system | "does the procedural system firstly work for all the cannon spells, gu, items and more?" |
| Retire finished worktrees; each session retires its own | "Retire finished, make sure they do that themselves" |

E24 (canon first) and E25 (an items ledger) are the coordinator's proposal from his canon question, used as working order. E1 to E19 are a proposal from lane gaps and the audit.

## State at handoff

- `master` holds Waves 12 to 18 unpushed. Check `git log -8` and `git status` first. Dirty and not this run's, leave alone: `dist/bundle.js`, `dist/bundle.js.map`, `index.html`, `docs/tools/game_mcp_limits.jsonl`, `docs/gm/FOUNDATION_RUN_PLAYBOOK.md`, the first `CODEX_COORDINATOR_HANDOFF.md`, untracked `scripts/wave_scratch.sh`.
- The commit message of the handoff commit names the Wave 18 gate. No build has been run since Wave 14; a build writes `dist/`, which is not this run's, so it waits for tie-in or an isolated build directory.
- Old worktrees `yair-w13-*` to `yair-w16-*` and `yair-codex-*`, `yair-fdn-ms2-*` are merged or superseded and take about 2.2 GB each. Remove the clean ones with `git worktree remove` (no force), keep branches. New lanes use sparse worktrees (the pattern is in the run record's Wave 17 notes; about 108 MB).
- Parked reference branch: `worktree-agent-acf8ea60fce434111` at `b63d5096f` (the first recipe-truth module). Its scenes now run on the knowledge record; do not merge it.

## Where the finish list stands

| Line | State | Evidence or what is left |
| --- | --- | --- |
| E1 costs debited | Part | Kernel port and cost owner in the host; market, brew regulator and contest costs bypass accounts; a short payment does not weaken an effect; the door-forcing price is debited directly |
| E2 knowledge | Part | Pack `n.knowledge`; its cost rows are not passed to the cost owner; checks through the host need a per-working read port |
| E3 design record | Part | Edit and copy on five kinds; round-trip gaps G1 to G12; a design as holder state |
| E4 timeline and budget | Met in tests | Mixed day 319 segments; next cost is the vent Gu's five-minute pulse |
| E5 settlement agreement, all packs and records | Not started as its own lane | Each lane proved its own |
| E6 near and far parity | Not started | Needs creatures on E12 |
| E7 actor chain through the kernel | Not started | The worm settles outside the kernel |
| E8 coupling report | Met | 9 couplings across domains |
| E9 engine host | Met in tests | Progression, contest, brewing, body alteration, Gu moves with held slots on private loops |
| E10 place graph | Met in tests | Links join places and not yet bodies or things; a link has one state for all senses |
| E11 saved dice | Met in tests | Creature lifecycle does not use the draw key; five older modules take a root from the caller |
| E12 holder lifecycle | Met in tests | Creature engine not on the acts; the lifecycle lineage key and the dice draw key are two names for one thing and need joining; no count-only cohort change |
| E13 conservation | Half | Lifecycle rows done; rate laws and `set` still unowned |
| E14 to E18 | Not started | Save tolerance, observers, scale, refusals with no price, fine time |
| E19 every engine complete, eight pairs coupled | Not started | Matrix in the run record |
| E20 to E22 gameplay surfaces, idle time, player as holder | Not started | |
| E23 seam test | Lane was running at handoff | See below |
| E24 canon first | Standing table in the run record | Hogwarts potions: 259 rows wait on five mechanisms |
| E25 items ledger | Not started | |

## In flight at handoff

A Claude lane was writing the E23 seam test on branch `fable/w18-seam` (worktree `/Users/weiwei/code/yair-w18-seam`): new files under `tests/` and a note `W18_GAME_SEAM.md`, no `src` edits. If the branch has a commit, read the note, run its test in the primary checkout, merge it and record its mismatch list in the run record. If it has none, the Claude session will merge it when the lane returns; check `git log master --grep seam` before redoing it.

## Next, in order

1. **Join the two trait keys** (E11, E12) and put the creature engine on the lifecycle acts as a pack in the engine world, with the count-only cohort change. This unblocks E6 and the Gu body rows.
2. **E24 for Hogwarts potions:** the five mechanisms (what a dose does through a body door, a mind state, a body form, a plant or creature target, conceal or sense). Each is a shared mechanism with at least two consumers, proven by rows that then compute.
3. **E13 second half, E17 and E14:** named rows for rate laws; a price or a way around on each refusal the audit listed; unknown packs and quantities kept inert on restore.
4. **E19:** the outside engines onto the host one at a time (brewing, contest, body alteration, progression), then the eight missing pairs in one mixed run.
5. **E7, E15, E20 to E22:** another holder acting through the kernel; observers writing to the knowledge record; options, quote, act, receipt on every engine; a week away against a week played.
6. **E25 and the rest of E24:** an items ledger; the 41 labelled Gu mechanisms; killer-move parts from the full-book reader notes for chapters 1 to 600 (the book is read in full; this is extraction).
7. Then Wave 19 and 20 of the schedule: operators, generators, scenes.

Stop at a decision that is Weibao's: a push, paid reading (173 Lord of the Mysteries formulas, The Perfect Run beyond its bounded return, 380 ingredient properties), a build into `dist/`, any wiring into `src/main.js` beyond what the seam test already documents, or a change to the limits below.

## Limits

- Codex weekly window: stop at **49%** (28% at this handoff).
- Credit balance: stop at **62,000**. Headroom was **2,961** at this handoff, which is a few lanes at most. Read `python3 -I scripts/codex_goal_lane.py usage` before every lane. When the floor is near, stop and say so; do not ask a Claude session to continue for you.
- At most three lanes at once, one writer per shared file. `src/world_substrate.js`, `src/world_effects.js`, `src/kernel_working.js`, `src/engine_world.js` and `src/engine_records.js` are shared: lanes that edit them say which regions, and the coordinator merges.
- Gate (PC99): the full `npm test` when a wave changes a file the game loads (`node scripts/reachable.mjs --is <file>` exits 0; `world_substrate.js`, `kernel_working.js` and `kernel_identity.js` are loaded). Otherwise focused tests plus `check:arch`, `check:rules`, `check:coverage`, `check:docs`.
- Commits: own paths, guarded, no `Co-Authored-By` trailer, no stash, reset or force, no push.
