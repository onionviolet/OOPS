# R15: resume the open foundation gates

**Historical executable brief, qualified 2026-10-18:** R15's coordinator later
stopped at its recorded deadline in the [parent checkpoint](../../CHECKPOINT.md).
The old group roster, 1600×1100 smoke, commit/push grants and paid-tool/session
instructions below belong to that task. They do not automatically start a new
run or substitute for current UI_RULES targets, AU budget and input recovery.
A later selected continuation preserves old evidence but chooses current required
gates under AD36/AR16; no worker, merge, commit or push starts from this audit.

2026-10-13. Root coordinator: Claude Code session in the main checkout.

## Authority

Weibao, 2026-10-13: "resume the foundation chain on the open gates, consider
commiting and pushing everything to main accordingly?"

This is the human instruction the R14 checkpoint said it was waiting for. It
replaces R14's "remain bounded incomplete" stop. It does not change product
direction, add taste gates or reopen paused World1.

## What changes in method

R2–R14 only counted native browser proof from a save earned by real play inside
a finite played-time budget, with no retries, resets or seeded states. When a
budget ran out or an earned profile broke, the gate stayed open permanently
("FAIL_CLOSED", "no paid replay"). That rule came from agents, not from Weibao.
"Earned" in the user vision is a game-design rule (the player's in-game
outcomes must be earned), not a ban on QA test saves. His standing preference is
a solo player with save safety, not anti-abuse ceremony.

R15 verification uses **seeded test states** where natural play is the
bottleneck:

- Build fixtures the way `docs/gm/d1-alloy-equipment-2026-10-07/fixture/` did:
  run the real `create_save`, `encodeSaveFile`, `importSaveFile` and `load`, or
  drive real game commands in Node to reach the prerequisite. Name the hero
  `TEST FIXTURE R15 <gate>`. Never hand-write impossible state that the game's
  own commands could not produce, unless the gate is specifically about
  rejecting bad state.
- Then exercise the actual changed behavior in a real browser on the rebuilt
  bundle, from a fresh origin, including Save, reload, Export and literal-file
  Import where persistence changes.
- Retrying after a failure is allowed. A broken earned profile is a lost test
  run, not a permanent product verdict.

Label every claim with exactly one of:

- **natural**: reached by ordinary play from a new game.
- **seeded-native**: prerequisite seeded via real game code, then the changed
  behavior exercised in the browser on rebuilt bytes.
- **source**: Node/unit tests only.

Earlier rounds' exact evidence stays as history. Do not rewrite it.

## Groups

| Group | Gates | Exact leaf owners |
|---|---|---|
| G1 body/recovery | FA07 balm, FA18 runner consequence | r2/ACCEPTANCE_BACKLOG.md, r11/BACKLOG.md |
| G2 production | FA09 routines, FA11 retort, FA12 occupied residue | r4, r6, r7 backlogs |
| G3 knowledge/tools | FA10 manual study, FA13 fieldcraft/assay | r5, r8 backlogs |
| G4 residents/sites | FA14 resident work, FA15 withdrawal/persistence, FA20 rack/bench | r9 BACKLOG, r10 CRITERION_LEDGER and BACKLOG, r13 BACKLOG |
| G5 heir | FA17 leftovers heir (accepted 2026-10-10) | docs/RULES_FROM_SCRATCH.md#the-heir, LIFE_SIM_NORTH_STAR heirs section |
| G6 minigames | FA22 MG01–MG10 integration (added by Weibao 2026-10-13) | docs/gm/dispatch/minigames-2026-10-11/ACCEPTANCE_BACKLOG.md, IMPLEMENTATION.diff |
| G7 authoring | FA21 C4 optional activity/site editor (added by Weibao 2026-10-13) | docs/gm/dispatch/cheats-sfx-implementation-2026-10-12/NEXT_AUTHORING_CYCLE.md, AUTHORING_ADAPTERS.md |
| G8 UI | FA23 UI lane work plus UI follow-ups from G1/G5/G6/G7 (added by Weibao 2026-10-13, run with Codex workers) | UI session's dispatch folders: vivid-proto23-flow, crafting-screen, settings-pass, panel-kit, cheat-status-window (all 2026-10-13) |
| G9 World1 | FA19 custody/exposure via World1 N1–N5 native gates (added by Weibao 2026-10-13; World1 pause lifted for these gates only, full S00–S14 continuation still needs his decision) | docs/gm/dispatch/world1-full-completion-2026-10-11/PAUSED_HANDOFF.md, rounds/r12/REPORT.md |
| Root | Integrated recovery, independent review, commits | r14/BACKLOG.md last rows |

All FA rows are now in R15.
Their owners are unchanged.

## Rules for every group

- Work in your own git worktree branch. Commit there; do not push. Do not
  commit `dist/` or `index.html` version bumps; root rebuilds after merging.
- Evidence and reports go only under `rounds/r15/<group>/`. Browser profiles
  and candidate copies go under `/private/tmp/` and are never committed.
- Use your assigned port. Playwright lives at
  `/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`
  (Chrome channel, headless, 1600×1100 desktop viewport).
- Fix real defects you reproduce, with a test. Keep fixes narrow. Shared files
  (`src/main.js`, `src/simulation.js`, `src/save_files.js`) may be edited, but
  keep the hunk minimal and name it in the report so root can merge it.
- Persistence changes need a migration or an explicit compatibility note.
- Sealed secrets: refer by ID and status only.
- `npm test` must pass in your worktree before you report done.
- Write `REPORT.md` in plain English: per leaf, what was checked, label
  (natural / seeded-native / source), result, and anything still open with the
  concrete reason. No ownership-transfer ceremony.
