# Codex coordinator handoff, 2026-11-12

Weibao (2026-11-12): "hand off for codex coordinator to take over and work on implementing everything in full? maybe can defer gameplay for now to focus on foundational systems like the procedural stuff and more" and "Then send out that codex coordinator to pick thing up and continue work until goals fufiled or limits met, I am bumping credit limit to 62000, and usage to 20%".

You are the coordinator of the foundation run now. The Claude coordinator and its Claude chats stop at their current commits. You work in the primary checkout `/Users/weiwei/code/yet-another-idle-rpg` on `master`.

## Read first

1. `AGENTS.md` (startup read, multi-agent rules, safety, sealed secrets, commits).
2. `docs/PROCEDURAL_FOUNDATION_PLAN.md`: the whole plan. Key sections: the chat table, PFP1-PFP34, "Making all achievable" (ledgers CV, grammar layers GL, procedural rules PR, milestones MS1-MS7), "Sectioning by mechanism", "Separate but connected" (effect grammar), "Heredity", "Lore first", "Bloodlines", "More systems at the same depth" (MD1-MD15).
3. `docs/gm/dispatch/foundation-run-2026-11-12/RUN.md`: the run record and resume block. Keep it current.
4. Each chat's checkpoint: `docs/gm/dispatch/foundation-<letter>-2026-11-12/CHECKPOINT.md` (A B C E F G K L M P R S W). Their "Next phase" and "Requests" sections are your queue.

## Objective

Milestones MS1-MS6 in order, each committed on master, foundations only. Gameplay slices are deferred: MS5's reachable route per domain is proof that a foundation runs in the game, not content work. Progress is the runs share per coverage ledger (`npm run check:coverage`, `docs/coverage/README.md`). Breadth past the done checks goes to backlog rows.

State at handoff (master `4c476b518` plus this handoff commit):

- MS1 done for every ledger: 0 unclassified rows. Runs share: gu_kinds 26.2%, gu_moves 0.5%, hp_potions 1.8%, hp_ingredients 5%, hp_spells 83.9%, lotm_potions 19%, creatures (L's ledger; check README).
- Contracts on master: kernel working v0.5 with oaths, actor quote, budgeted search and composed workings (`src/kernel_*.js`); world substrate with sky, effects primitives and a live shell-chamber route (`src/world_*.js`); grammar v0 and effect grammar with the five checks (`src/procedural_grammar.js`, `src/effect_grammar.js`, `src/effect_checks.js`); agency v0 (`src/agency*.js`); contest moves as effect sentences (C); progression path contract with LR3 and LR4 (R); societies and markets contract (M); coverage tooling; emergence harness (E).
- MS2: S measured GL2 at 35/94 (below the 70% target) and filed S2R1-S2R9 as requests to P and W.
- The wave 3 full suite was running at handoff; check its result first (`npm test`, trust the real exit code).

## Open work in flight

- Claude chats K, B and S were mid-phase at handoff. Their branches: `claude/fdn-k-kernel-a28c4b`, `claude/fdn-b-brewing-afd93a`, `claude/fdn-s-spellcraft-ec4a66`. Merge any commits newer than master after checking them.
- Codex lanes (started by the Claude coordinator, launcher `scripts/codex_goal_lane.py`):

| Lane | Worktree | Branch | Brief |
| --- | --- | --- | --- |
| fdn-g-codex-1 | `/Users/weiwei/code/yair-codex-g1` | `codex/fdn-g-keeper-batch1` | `CODEX_LANE.md` there: delete five Keeper modules onto `gu.working@1` |
| fdn-b-codex-1 | `/Users/weiwei/code/yair-codex-b1` | `codex/fdn-b-lane1` | B's ledger and inventory shards |
| fdn-s-codex-1 | `/Users/weiwei/code/yair-codex-s1` | `codex/fdn-s-lane1` | S's spell lane |

  These lanes edit without committing and write `CODEX_RETURN.md` when they stop. You now own their review: check the diff at its locators, run the brief's focused tests and browser routes, commit what passes on the lane branch with the owning chat's letter in the message, and merge it.
- Status: `python3 -I scripts/codex_goal_lane.py status`. Usage: `python3 -I scripts/codex_goal_lane.py usage`.

## Limits (hard)

- Codex included-usage window: stop all lanes and yourself at **20% used** (read 15% at handoff).
- Credit balance: stop at **62,000** (about 2,961 headroom at handoff).
- The shared limits file `~/.codex/foundation-lanes/limits.json` holds both lines; new lanes read it at every guard check. The three running lanes were launched with the older 30% ceiling, so when `usage` shows 19% or more, stop them with `python3 -I scripts/codex_goal_lane.py stop --name <lane>` and pause your own goal.
- Read usage before every new lane and at least every 30 minutes. If a usage read fails, stop opening lanes.

## How to work

- Lanes: one writer per file area. For the next wave, follow the [storage defaults in the foundation run playbook](../../FOUNDATION_RUN_PLAYBOOK.md#next-wave-storage-defaults-weibao-2026-11-12) when assigning worktrees and running isolated builds. Use the existing `CODEX_LANE.md` brief shape (goal, files it may touch, files it must not touch, focused tests, return, done check). Keep at most three lanes at once.
- Order: finish MS2 (P and W answer S2R1-S2R9, then GL2 for Gu and spells), then MS3 (runs as data across ledgers; G's Keeper compression to 10+ deleted modules), MS4 (23 canon moves as composed workings), MS5 (one reachable route per domain at the floor plus one combined headless browser pass), MS6 (N knowledge, X places, D story contracts, PG1 people, PG2 societies, E's three chains). The MD1-MD15 rows join their owners after MS3.
- Lore first (PFP30): canon laws become fixed points with locators before a generator varies them.
- Gates: lanes run focused tests; you run `npm run build`, `npm run check:arch`, `npm run check:rules`, `npm run check:coverage` and the full `npm test` once per merge wave. Docs-only merges skip the full suite. `npm test` already runs through the limiter; do not wrap it.
- Commits: only this run's paths, from a fresh HEAD, no `Co-Authored-By` trailer, never stash, reset or force, no push (push waits for Weibao). Merge conflicts in `docs/AREA_GUIDE.md` and `docs/RULES_INDEX.md` are adjacent table rows: keep every row.
- Shared docs (USER_VISION, PROJECT, plan): edit hunk-only from disk. No em dashes. Sealed secrets by ID. Headless browsers only, never a visible window. Raw book prose stays out of git.
- Record each wave in RUN.md (merged commits, checks with counts, ledger shares, usage read) and keep its resume block current, so a fresh session can continue.

## Stop

Stop when MS1-MS6 are met and recorded, or when either limit is reached, or at a decision only Weibao can make (push, direction change, a limit raise). Leave RUN.md's resume block current and a short report of what moved: ledger shares before and after, milestones reached, checks run, what is open.
