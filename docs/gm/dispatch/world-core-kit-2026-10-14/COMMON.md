# World core kit dispatch, common rules (2026-10-14)

Request (Weibao): "core stuff needed for each world to be implemented in
depth? do a 'more to consider? other stuff and more? save and extend
accordingly Send out codex as usesful?' for each aspect?"

Root palette (Claude owns it, read only for you):
`docs/worlds/WORLD_CORE_KIT_2026-10-14.md` (kit parts K1-K18, angles K1.1
and on, cross-cutting KX1-KX10). Extend its codes; do not restate them.

Priority worlds (canon-first order in PROJECT.md "Standing priorities"):
Harry Potter, D&D, TTKS, Mother of Learning, Lord of the Mysteries, Circle
of Inevitability, Shadow Slave, Reincarnation Paradise, Jujutsu Kaisen,
Bleach, Fate, Hunter x Hunter, Fullmetal Alchemist, Naruto. A Soldier's
Life is paused for runtime work but may be covered in docs. Original
Frontier gets a short row as the home world. Fallout, Skyrim and Elden Ring
are deprioritized: one line each at most.

Where to look: `docs/worlds/<world>/` (WORLD_BRIEF, SOURCE_LEDGER, CAMPAIGN,
ABILITY_VARIANTS and others), `docs/worlds/world-depth-2026-10-13/` parts
(especially 02-05, 07, 08, 09, 10, 12, 13, 23), wiki digests in
`docs/research/power-systems/wiki-digests/`, private novels in
`docs/research/novels/full-book/`, `src/` for what code exists, and the web
(official or fandom wikis) to check MEMORY claims.

Rules for every lane:
- Design and documentation only. Do not change gameplay source, bundles,
  tests, saves or private packs. Do not run npm or builds. Do not git add,
  commit or push. Write only your owned files; other agents are active.
- Read `AGENTS.md`, `PROJECT.md` (top sections) and
  `~/.claude/user-preferences.md` first. Style: plain short words, no em
  dashes and no " -- ", short codes on rows, tables where they help.
- Considerations, not specs. Default + Dial + in-world reason where a dial
  fits. No absolutes, no fixed "once" limits, no either/or questions for
  Weibao; write a per-world dial instead. Everything possible, reasonably.
- Label evidence: SHOWN (text with locator), STATED (official or wiki, with
  URL or path), INFERRED (your proposal), MEMORY (recall, unchecked).
  Report contradictions both ways.
- Sealed secrets: never open files named `SECRETS*`; refer to secrets by ID.
- Private novels may be read; quote at most a few words, cite chapter or
  file lines. Never copy prose into these docs.
- Code claims cite `file:line` from the live tree.
- For each kit part you cover, give per world: floor met / partial /
  missing today (with pointer), the floor proposal if missing, then a
  "more to consider" round of new angles specific to that world. End your
  file with a "More to consider, other stuff" section of cross-world angles
  the root palette lacks, and three ranked suggestions.
- Keep a short CHECKPOINT at the top of your file so a resumed run
  continues. Write your report `<lane>_REPORT.md` in this dispatch folder
  last: what you wrote, sources read, open questions.
