# Addendum 2 (2026-10-14): save deep details, dialogue text included

New standing rule from Weibao (USER_VISION "Save deep details for
reference, 2026-10-14", commit cc04a4bf): "Feel free to save dialogue text
for future reference for YAIR too ... save deep details and more." This
overrides DEEP_ASSIGNMENT.md's "never copy dialogue text" line.

- Save full dialogue and interface text with line IDs, speakers,
  conditions, choice effects and quest links into
  `docs/research/hogwarts-legacy/private/` (gitignored; the repo is
  public). Use JSON or CSV plus a short README.md index there.
- Also save there: full readable exports of the tables you use (CSV/JSON),
  decoded Blueprint and behavior-tree flows, native chain notes with
  pseudocode, and the first pass's useful tables if not yet saved.
- Bulk raw extracts may stay in `~/.codex/research/hogwarts-legacy/`.
- Committed docs (deep/*.md) keep paraphrase and short IDs, and each links
  the private file it summarizes. Run `git check-ignore` on the private
  folder before writing to confirm it is ignored.
- Sealed secrets and no-save-access rules still apply.
