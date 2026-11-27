# Idea registry sweep, 2026-11-24

Register status: finding and proposal. Nothing here is an accepted decision, and no board was edited. Statuses in the registry are what each board states; "proposal (AD32)" means it stated none.

Why: Weibao asked for other ideaboardings to go into the atlas and for the atlas to absorb "all the future panels, ideas, subideas and more" (2026-11-24). `prototypes/world-atlas/ideas.mjs` generalizes the [cheat absorption sweep](CHEAT_ABSORPTION_SWEEP_2026-11-24.md): one row per coded idea on any board, with parents, children and links. The atlas has an Ideas section (routes `/ideas`, `/ideas/rows`, `/ideas/row`, `/ideas/families`, `/ideas/boards`, `/ideas/residue`; contract in the file's header comment). The build reruns the sweep (part `ideas`).

## Counts (checkout at 457c03fb8, uncommitted work included; others edit docs, so reruns drift slightly)

| What | Count |
| --- | --- |
| Docs read (`docs/**/*.md`, no `private/`, no `docs/research/novels/`, not this file) | 8,540 |
| Boards (docs with 3+ coded idea items, or linked from IDEA_INDEX or WRITEUP_REGISTER with 1+; plus 33 rulebooks) | 3,989 (228 registered in the two indexes) |
| Docs with 1 or 2 coded items, not boards | 1,275 (1,414 items) |
| Idea rows | 99,341 (19,841 on registered boards) |
| By format | table 69,611, heading 10,922, bold 12,018, list 3,837, plain line 2,953 |
| Rule items (not ideas; ideas link to them) | 1,434 in 33 rulebooks |
| Families (code prefixes) | 1,615: 26 single-letter "local" (53,074 rows), 1,589 others |
| Collisions | 638 non-local families have a code defined on two or more boards (6,433 codes); 34 families are both idea and rule prefixes (WA, UR, AD, SR, MR, GR, AR and more); 16,644 rows share a code with another row in their own board (348 families) |
| Panels (`definePanel` homes under `src/`) | 72, matching the 72 call sites in the [UI grammar inventory](UI_GRAMMAR_INVENTORY_2026-11-24.md) section 3 |
| Residue lines | 13,705 on 1,773 boards (plus 3,955 on non-board docs) |
| Status as stated | proposal 99,013 (default for almost all), accepted 125, built 105, working-default 91, sent 4, superseded 2, retired 1 |

Largest non-local families (ideas / rules, boards): MC 882 (48), CW 854 (18), LSD 541 / 38 (7), CL 545 (20), PC 539 (57), SO 497 (43), GKM 462 (2), PS 461 (15), DL 448 (10), UR 264 / 180 (17).

Cross-check against the cheat sweep: 417 of its 418 coded candidates are rows here (the missing one is a one-item run log, `docs/gm/dispatch/cheat-status-window-2026-10-13/runs/r1.last.md:36`, a doc below the three-item threshold).

## Method (deterministic, rerunnable)

1. List docs as the cheat sweep does. Skip this report so its count tables do not index themselves.
2. Read the rule register in RULES_INDEX (prefix to owner file, plus reserved prefixes). Items with a registered rule prefix in an owner rulebook are rule items, not ideas.
3. Parse every doc once. Idea formats: table row whose code column (header Code, ID or #, else the first cell) is `CODE`, `CODE title`, `CODE · title`, `CODE: title` or `CODE = ALIAS`; bold paragraph `**CODE · title**`, `**CODE title.**`, `**CODE.** text`; list item starting with a code, bold or plain; heading starting with a code; plain line `CODE: text`. Code shape: 1 to 6 capitals (optionally `-` and more capitals), 1 to 4 digits, optional letter or `.n`.
4. Board = 3 or more idea items, or linked from IDEA_INDEX or WRITEUP_REGISTER with at least 1. Slug is the file stem, longer when stems collide. Row id `<slug>#<CODE>`; a repeat in one board gets `~2` and both rows say `dupInBoard`.
5. Parent: nested list item, then `X40a` to `X40`, then the nearest coded heading, else the round heading. Round = nearest heading text.
6. Status: a Status column cell, `status: word`, `[word ...]` or `(word ...)` inside the first 90 characters after the code, or a section heading of five words or fewer that opens with the status word (`statusSource: heading`). Otherwise "proposal (AD32)". Built is never inferred from prose.
7. Links: other codes in the item body (same board first, doc-qualified `stem#CODE`, then rules, then other boards; single-letter codes never resolve across boards), world names and hyphenated ids, `ledger:id` rows that exist, CTC ids in the catalogue, `src/` files that exist, panels (by their file, or a backticked id with `-` or `_`).
8. Residue = a line that starts with a code (after a list, bold, table, quote or heading marker) and matched no format. Reasons now seen: table-cell-not-single-code 7,492 (`W1/W2`, `S17 (C2)`, `K13.W4.T2`, code lists), plain-paragraph-code 4,654 (prose that opens with a code), code-range-or-list 1,477, list-code-without-text 40, heading-bare-code 32, bold-code-no-separator 8, list-code-unparsed 2. `/ideas/residue?board=<slug>` lists them per board.

## Known limits

- Within-board repeats: in the WA ideaboard `#WA1` is the "Recommended first five" restatement and the real definition is `#WA1~2`; same-board links resolve to the first. No heuristic picks the definition.
- Table rows are 70% of the rows. Some boards are run outputs or ledgers (for example `tw-s-output`, `dedupe-table`), not idea lists. The `registered` tier separates the 228 boards the indexes link.
- Single-letter families (F, T, W, K...) are numbering local to one doc. They are flagged `local`, excluded from collision counts, and hidden by default on the page.
- Heading and plain-line formats raise recall and noise. A coded heading can be a section, not an idea.
- Link resolution is textual. A bare world name in prose, or a code quoted from another doc, can attach a wrong link. Ambiguous codes list up to 3 candidates and say so.
- First request after a doc change rebuilds the registry (about 15 s cold; per-file scans are cached by size and mtime).
- Not done: cheats.mjs is not rebased on this registry (its tests and routes are untouched); the Cheats Candidates tab does not read `/ideas`. Codex links go to the ledger only (the codex page takes no row focus). Rule items have no rows route, only family and board counts.
