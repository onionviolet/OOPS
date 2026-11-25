# Lane Q2: port Weibao's Game Idea Bank into the repo (Codex luna)

Read first: [OWNERSHIP.md](OWNERSHIP.md). You own only `docs/ideas/GAME_IDEA_BANK_2026-11-24.md`. Read-only everywhere else; do not edit docs/IDEA_INDEX.md (the coordinator adds the entry from your report).

Weibao approved the port ("go ahead") of `~/Documents/Claude/Projects/Weibao's Workspace/plans/06_Projects/Side_Projects/Game_Idea_Bank.md` from his planning vault.

Do:
1. Read the whole file. It is Weibao's own idea bank (several game ideas, a section of his words verbatim, and working interpretations).
2. Write `docs/ideas/GAME_IDEA_BANK_2026-11-24.md` following docs/ideas/README.md so the atlas registry absorbs it:
   - A header: source path, port date 2026-11-24, "ported with Weibao's yes", and that everything is a proposal (AD32).
   - Give each idea a stable code with prefix `GIB` (GIB1, GIB2, ...; sub-ideas GIB1a etc.) in a format the registry parses (check docs/ideas/README.md and run `node prototypes/world-atlas/ideas.mjs search GIB --all` after writing to confirm every code parses).
   - Keep Weibao's verbatim words verbatim and labelled as his. Keep agent interpretations labelled as interpretations, separate from his words.
   - For each idea, one line on how it relates to OOPS today (already in OOPS, overlaps with a named board or family, or separate project), with the evidence (file or idea code). Use the search CLI to find overlaps.
   - Leave out anything that is not a game idea (personal, career, course or scheduling material), and say in the header that such material was left out.
3. Run `npm run -s check:docs` and fix any hit in your file (reword; do not change Weibao's verbatim words; if a verbatim line trips the check, add `<!-- slip-ok: Weibao's verbatim words -->` at the end of that line).

Report: the file, the GIB codes with one-line titles, overlaps found, the check result, and a one-line IDEA_INDEX entry for the coordinator.
