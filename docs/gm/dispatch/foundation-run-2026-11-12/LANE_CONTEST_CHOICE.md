# Codex lane brief: scored chooser, policy rows and policy spread

*Prepared 2026-11-13, not launched. Launch waits for Weibao: Codex usage read 66% of the weekly window against his 50% ceiling. Proposal throughout (AD32). Engine first (PC95): headless, no `src/main.js` wiring, no build, no interface.*

Codes: PC94, PC95, CFC4, CFC15, CBR26, PFP11, SPR6, SPR14, AD38, AD49, and rows TR7, TR8, TR9 and TR13 of the [decomp re-fit](../../../research/DECOMP_REFIT_TIE_IN_2026-11-12.md).

## Goal

Give the contest a chooser that weighs its options, a way to state a fight policy as data, and a harness that shows whether a fight holds a decision. All three plug into `ports.choose`, which `stepContest`, `runContest` and `quoteContestOdds` already accept, so `src/contest.js` does not change.

| Order | Deliverable | Done check |
| --- | --- | --- |
| 1 | **Scored chooser.** For the acting entrant, try each usable move and target on a copy of the record and world, and score what follows: harm dealt, opponents downed, own harm avoided or healed, lasting effects, and cost spent. A `level` dial sets how many candidates are tried and whether the best or a middling score is taken. State a budget (CX5) | On the wolf hunt and one duel from `tests/contest_consumers.test.js`, the scored chooser at a high level does at least as well as `defaultChoice` over the same keyed seeds, a low level does measurably worse than a high one, and a run that exceeds the budget fails a test |
| 2 | **Policy rows.** A policy is an ordered list of rows `{move, when?, count?, fallback?}` read top to bottom. A row whose move cannot be paid for falls to its fallback and stays in the list. A policy with no usable row withdraws (CBR26). The policy is plain JSON and restores with the record | A Moonblade policy with a costly first row falls back when essence runs short and keeps the row; with no stock and no fallback the entrant withdraws; a saved policy restored mid-fight continues to the same result |
| 3 | **Policy spread.** One function runs the same contest spec under a list of named policies on the same seeds and returns, per policy, the outcome counts and what each side spent | A test shows a nonzero spread on one existing fight and reports a zero spread on a fixture built so that no choice matters |

Finish one row before starting the next. If a done check fails twice, stop that row, write what was learned in the return, and go on to the next.

## Read first

- `src/contest.js`: `defaultChoice` (the chooser to match in shape), `stepContest`, `runContest`, `quoteContestOdds`, the `oddsSamples` dial.
- `docs/CONTEST_CONTRACT.md` CFC1 to CFC16.
- `src/contest_packs/gu_world.js` and `src/contest_packs/hogwarts.js`: the existing laws and their moves, including the unfunded fallback.
- `tests/contest.test.js` and `tests/contest_consumers.test.js`: fixtures to reuse.
- The re-fit rows TR7, TR8, TR9 and TR13. They describe how other games do this. They are shapes to learn from. Copy no numbers from them.

## Files it may touch

- Create: `src/contest_choice.js`, `tests/contest_choice.test.js`.
- Nothing else.

## Files it must not touch

- `src/contest.js`, `src/contest_resolvers.js`, anything under `src/contest_packs/` and `src/world_packs/`, `src/spell_*.js`, `src/tempo_fight*.js`, `docs/` other than its return file. Other chats are editing several of these now. If the work needs a change there, write the smallest request in the return and stop that row.

## Checks

- `node --test tests/contest_choice.test.js tests/contest.test.js tests/contest_consumers.test.js`
- `npm run check:arch`
- No build, no full suite, no git operations, no visible windows.

## Return

Write `CODEX_RETURN.md` in the lane's working directory: files created, each done check with its command and counts, the budget chosen and why, anything not covered, and any request to another owner. Do not commit.

## Launch (coordinator, after Weibao's yes)

```bash
git worktree add /Users/weiwei/code/yair-contest-choice -b codex/contest-choice HEAD
```

```bash
python3 -I scripts/codex_goal_lane.py start --name contest-choice --cwd /Users/weiwei/code/yair-contest-choice --brief docs/gm/dispatch/foundation-run-2026-11-12/LANE_CONTEST_CHOICE.md
```

The brief is read from the worktree, so this file has to be committed first or copied in as `CODEX_LANE.md`. Retire the worktree after the fold.
