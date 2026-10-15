# Deep-detail re-audit of earlier game passes

Dispatched 2026-10-14 by Claude Code. Weibao, after the Hogwarts Legacy
pass showed its shortcomings (unread AI, dialogue, XP and shield rules;
summaries without saved detail): "considr reauditing other games to
address shortcomings like these too?" Governing rule: USER_VISION "Save
deep details for reference, 2026-10-14" (commit cc04a4bf). Standing
authorization covers decompiling owned games read-only.

## Scope and ownership

- Every game dossier under `docs/research/<game>/` that came from a
  decompile, extract, source-read or data pass.
- **Exclude while their lanes are live:** academagia, immortal-life,
  taiwu, warsim, hogwarts-legacy, and anything another live Codex run
  owns (check `ps` for `codex exec` and each dispatch folder's SESSIONS.md
  dated 2026-10-14). List them as "deferred: live lane".
- Don't redo `docs/research/coverage-refresh-2026-10-14/` or
  `docs/research/game-research-adoption-reaudit-2026-10-14/`: read and cite
  them. Those cover lane status and proposal adoption; this covers depth.
- Writes allowed: `docs/research/deep-detail-reaudit-2026-10-14/` and the
  gitignored `docs/research/<game>/private/` of non-excluded games. No
  `src/`, no edits to existing committed dossiers, no commits, no
  installs/uninstalls, no game launches, no save access.

## Phase 1: depth audit (all in-scope games)

For each game, from its CHECKPOINT, COVERAGE, REPORT and TOOLING, plus
what still exists locally (`~/.codex/research/<game>/`, extracts, Ghidra
or ILSpy exports, installs under Steam/`~/Games/yair-windows`/Applications):

1. **Shortcomings** in the Hogwarts sense: unread systems that matter for
   YAIR (AI and perception, dialogue and choice effects, XP and level
   curves, combat formulas and counters, economy, schedules, crafting
   tables, quest step grammar), native gaps left open, numbers stated
   without a consumer.
2. **Detail saved?** Whether full text/dialogue, full tables and decoded
   flows exist anywhere, or only paraphrase.
3. **Route now available:** existing local extract, needs reinstall, REA
   (built at `~/.codex/research/hogwarts-legacy/tools/`, see its REA_TRIAL),
   Ghidra (`/opt/homebrew/opt/ghidra`), kismet-analyzer, ILSpy/Cpp2IL,
   public source.
4. **Value** for YAIR's current direction (PROJECT.md, USER_VISION).

## Phase 2: cheap deep saves now

For games whose extracts or exports are still on disk, save deep detail
into `docs/research/<game>/private/` now: dialogue/text with IDs and
conditions, full readable tables (CSV/JSON), decoded flows, with a
README.md index per game. Run `git check-ignore` first. Biggest value
first; stop a game when the remaining detail is low value.

## Output (`docs/research/deep-detail-reaudit-2026-10-14/`)

- REPORT.md: plain summary first; the top ten re-pass candidates ranked by
  value, each with the named question, route, cost (reinstall? disk?) and
  a one-paragraph lane prompt ready to dispatch. Then which deep saves you
  made in Phase 2.
- LEDGER.json: one row per game (shortcomings, detail saved, route, value,
  deferred reason).
- CHECKPOINT.md, kept current so a restart resumes.
Committed-facing docs paraphrase; secrets by ID only. Plain English, no em
dashes.
