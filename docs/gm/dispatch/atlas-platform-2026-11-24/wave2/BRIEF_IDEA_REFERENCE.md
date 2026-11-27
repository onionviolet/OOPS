# Lane: make the idea registry the reference for past and future ideaboarding (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md). For this lane the coordinator hands over: `prototypes/world-atlas/ideas.mjs`, `prototypes/world-atlas/ideas-views.mjs`, `tests/atlas_ideas.test.js`, plus new files `docs/ideas/BOARD_KINDS.json`, `docs/ideas/README.md`. Do not edit index.html, serve.mjs, codex*, workbench*, canvas*, docs/IDEA_INDEX.md or any board itself.

Weibao: "port all of our previous ideaboarding and ideas into world atlas and then for future we can use that as reference". Read docs/audits/IDEA_SOURCES_INVENTORY_2026-11-24.md (finding: nearly all past ideaboarding is already in repo docs, which the registry reads; 1,905 unregistered boards hold 70,133 rows; the reference tier is only the 228 registered boards) and docs/audits/IDEA_REGISTRY_SWEEP_2026-11-24.md (method, noise, limits).

Port means making the registry trustworthy as a reference, not copying rows into a second store.
1. **Board kinds.** Classify every board as one of: idea-board, plan, considerations, backlog, rules, audit, run-output, research, other. Heuristics from path and title (dispatch run folders, OUTPUT/REPORT/DEDUPE/census names are run-output or audit; *_CONSIDERATIONS*, IDEAS, ideaboard, IDEA_BOARD are idea-board or considerations; *_PLAN* plan), plus `docs/ideas/BOARD_KINDS.json` as the hand override file (path -> kind, with a note). Seed overrides for the inventory's ranked top 60 after opening each file's first screen. Expose `kind` on boards and rows.
2. **Reference tier.** A row is reference when its board is registered OR its kind is idea-board, considerations, plan or backlog. Make the page default to the reference tier with a toggle for all, and show the kind on each board. Report the new reference counts.
3. **Noise.** Reduce table noise: a table cell that only repeats codes (like `W1/W2` or `S17 (C2)`) is a link, not an idea; ideas from tables need a code cell plus a title cell. Measure before/after rows and residue on the registered tier; keep every existing test passing or update it with the reason.
4. **Agent search.** A CLI: `node prototypes/world-atlas/ideas.mjs search <query> [--family X] [--kind K] [--all] [--json]` printing composite id, status, title, board locator; reference tier by default. Document it in the route contract comment.
5. **Future boards.** Write `docs/ideas/README.md` (short): how to write an ideaboard so the atlas absorbs it (accepted formats with one example each, status words, where to register, how to check: the search CLI and the Ideas page residue for that board), and that proposals stay proposals (AD32). No new rule code.

Tests in tests/atlas_ideas.test.js for kinds, overrides, reference tier, the table rule and the CLI. Run `node --test tests/atlas_*.test.js`, `npm run -s check:docs`, and time the cold registry build before and after.

Report: counts before/after (reference rows, boards by kind, residue), the 60 overrides summary, CLI examples with output, test lines, gaps.
