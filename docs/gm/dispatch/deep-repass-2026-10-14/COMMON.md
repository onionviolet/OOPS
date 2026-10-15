# Deep re-pass wave, 2026-10-14: common rules

Dispatched by Claude Code. Weibao: "dispatch re-pass P1-P4 plus Ars
Nouveau and Arx with deep saves." P1-P4 come from
`docs/research/deep-detail-reaudit-2026-10-14/REPORT.md` (read your
section and its common boundary). Ars Nouveau and Arx Libertatis come from
`docs/research/hogwarts-legacy/SIMILAR_GAMES.md` (O2, G06).

## Rules

- Read AGENTS.md, PROJECT.md, the relevant USER_VISION parts, and the
  game's existing dossier (if any) first. Check `ps` for live lanes on the
  same game; if one exists, stop and record it.
- **Deep saves (standing rule, USER_VISION "Save deep details for
  reference, 2026-10-14"):** save full dialogue/text with IDs, speakers and
  conditions, full relevant tables (CSV/JSON), decoded flows and call
  notes in gitignored `docs/research/<game>/private/` with a README.md
  index. Run `git check-ignore` first. Bulk raw stays in
  `~/.codex/research/<game>/`.
- Committed docs paraphrase and link private files. Secrets by ID only.
- Writes allowed: your output folder below, its game's `private/` folder
  and your `~/.codex/research/<game>/` workspace. No `src/`, no edits to
  existing committed dossier files, no commits, no game installs or
  launches, no save access, no purchases. Public source clones are fine
  (own empty dir, read before running, prefer not to build).
- License: record each source's license. Mechanics are paraphrased; no
  code is copied into YAIR by this pass.
- If an input is missing, record the exact blocker rather than installing
  or inventing a formula.

## Output

`docs/research/<game>/repass-2026-10-14/` (new folders for Ars Nouveau and
Arx: `docs/research/ars-nouveau/`, `docs/research/arx-libertatis/`):
REPORT.md (plain summary first, the named question answered with
evidence labelled shown/stated/inferred, five to ten ranked YAIR proposals
marked PROPOSAL, small touches), CHECKPOINT.md (kept current; restart
resumes from it), COVERAGE.json. Plain English, no em dashes.
