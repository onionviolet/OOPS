# Cast lives: coordinator handoff (2026-10-28, evening)

For a fresh coordinator session. Weibao's words: "Send out seperate worker to improve the workflow, and
then implement the gaps? and then hand off to start in new coordinator with fresh context". This handoff
grants no new scope; the authorized work is the cast-lives plan's queue below.

## Read first (in order)

1. [CAST_LIVES_CARD.md](CAST_LIVES_CARD.md): goal, lane state, rules CLR1-CLR13, what Weibao can do now.
2. This file.
3. [Plan](CAST_LIVES_PLAN_2026-10-28.md) section 22 (round 14: build gaps for the whole game; CL210-CL223)
   and section 19 (fold-loss). Earlier sections only when a brief cites them.
4. `AGENTS.md`, `docs/GROUND_RULES.md` as usual.

## Running when this was written

| Lane | Model | What | pid / session | Logs |
| --- | --- | --- | --- | --- |
| W1 | Luna, medium | Repo lane runner `scripts/codex_lane.mjs`, `scripts/lane_review.mjs`, lane brief template ([brief](cast-lives-lanes/W1_WORKFLOW_BRIEF.md)) | 81178 / `01a184a7-27f0-7893-9043-bfe1638a90ba` | `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/bf0faa81-7a24-47b8-b1ee-6f706b97f36d/scratchpad/lanes/W1/` (`run.log`, `LAST_MESSAGE.md`) |
| G1 | Sol, medium | Wait-until action; beat aftermath writes knowledge ([brief](cast-lives-lanes/G1_WAIT_AND_AFTERMATH_BRIEF.md)) | 81185 / `01a184a7-2809-7eb3-8d63-af362943f61a` | same folder, `G1/` |
| L5r browser replay | (coordinator run) | Two fresh UI replays of chapters 1-3 on the natural clock, started by the previous coordinator | `node scripts/headless/lead_runs/lotm_ui_replay.mjs ...` | private `l5r-ui-replay-2026-10-28/` (`run1.json`, `run2.json`, `proof.json`) |

Check with `ps -p <pid>`; when W1 lands, use `node scripts/codex_lane.mjs status`. Stop a lane by pid or
process group, never `pkill -f`.

## Uncommitted, owned by this work

- L5r: `scripts/headless/lead_runs/lotm_ui_replay.mjs`, `tests/lotm_ui_replay.test.js` (4/4 pass),
  `cast-lives-lanes/L5R_CHECKPOINT.md`. Commit after the browser replay reports (command in the
  checkpoint, section "Coordinator command"; build with `BUILD_OUT=/tmp/yairpg-l5r npm run build` and
  copy `private_packs/` into the build folder first). If the replay fails again, read lines 100-140 of
  the script: it waits on the natural game clock up to 12 real minutes per wait.
- W1 and G1 files when they land.

## The coordinator loop (what worked)

1. Brief from the template (after W1: `LANE_BRIEF_TEMPLATE.md`): publication class, data probe gates,
   owned files plus the prepared-patch rule, seam, done check with FLR lines, "do not commit".
2. Launch with preflight (Codex account `chatgpt`, usage under 100%), at most two writers at once.
3. On exit: read the checkpoint; diff; focused tests; one data spot check; `lane_review.mjs` (or the
   canon-name sweep and top-level-await check by hand); apply any prepared patch after review.
4. Full `npm test` once; `npm run check:arch`; browser floor in headless Chrome at 1920×1080 from a fresh
   origin (`BUILD_OUT` build plus `private_packs/` copied in); screenshots to
   `docs/research/novels/lord-of-mysteries/private/cast-evidence-2026-10-28/` (they show canon names).
5. Commit only the lane's paths from a fresh HEAD, no `Co-Authored-By`, no push; one line in the plan's
   coordination log and the card's state table.

## Known pitfalls

- Codex lanes cannot write `.git` (sandbox); the coordinator commits.
- `codex exec resume` ran full-access, ignoring the original `-s workspace-write`; W1 is fixing the runner.
- Lanes sometimes stop entirely on one blocked item, or misreport edits; read `git status` yourself.
- A page error during a lane's run is the lane's until a clean-HEAD worktree proves otherwise (CLR13);
  the L4c boot `await` looked like an old upstream error and was not.
- The Codex sandbox blocks Chrome and the game MCP; run browser floors yourself.
- Canon data and book text live only in `private_packs/` (AD1, CLR3); `origin` is public.

## Queue (ranked; build only what passes the second-case filter, CL214)

1. Commit L5r (above), W1, G1 after review.
2. **G2** concealment: hide an item in a container, and what others can notice (world-general; second
   case in a later LOTM scene and any world with containers).
3. **G3** NPC trades with their own purse and goods inside the player's footprint (CL216), using the
   existing trade owner; then metered utilities and washing or cleaning traces (evidence), each only
   with its second case.
4. **G4** offers and contracts as obligations (`obligations_ledger.js`), and police notice and travel
   limits (law and enforcement).
5. The scene card (CL122), L6 MoL host (second world playable), and rerunning the L5r replay after each
   capability (CL185, CL219).

## Waiting on Weibao (ask by name, never either/or)

- The "be" seat wording (WER11), which unlocks the 7 seat-only gaps (CL211).
- The LOTM start month (the day index counts from the life's start until then).
- Acceptance of SUI1-SUI19, CLR1-CLR13 and RPT1-RPT12 as binding defaults (CL198).
- Whether to rebuild the checked-in `dist/` so `index.html` shows this work (`npm run desktop` already
  rebuilds), and any push.
