# W5 report: real craft as early text cues

2026-10-14. Documentation lane complete; proposals only.

| Code | Result |
|---|---|
| W5-R1 | Created [MICRO_CRAFT](MICRO_CRAFT.md): SB13-SB92, 80 new details; eight per requested craft. Each has F0 text, F1 text, property/route and evidence basis. |
| W5-R2 | Covered sight, sound, smell and feel; mistakes, workmanship, jargon, maker-body effects and weather/site conditions. Context is explicit where no supported direct weather effect was found. |
| W5-R3 | Kept craft facts separate from inferred game wording. Twenty-three source IDs; qualified color, sound, bow moisture, gem design and body/exposure claims. |
| W5-R4 | Only the two assigned files written. Root palette and existing owners remain read only. No runtime edits, build, browser, saves, commits or push. |

## Owners read

`COMMON.md`, lane `W5.md`, repository `AGENTS.md`, `PROJECT.md`,
`~/.claude/user-preferences.md`, `docs/GAME_MASTER_PROMPT.md` relevant rules,
and the maker request in `docs/USER_VISION.md`.

Root palette plus each listed owner: P6 `SMITHING.md`, `PATTERNS.md`,
`REPORT.md`; crafting/consumables palette; materials/alchemy audit;
`worlds/PROGRESSION_AND_ASSEMBLY.md`; `TECHNOLOGY_AND_PROGRESSION.md`.
Relevant sections used for contracts, knowledge, measurement and site/body scope.
Memory registry used only to route live-authority checks, not craft facts.

## External source evidence

The [source ledger](MICRO_CRAFT.md#source-ledger) gives URLs and section locators.
Read text or relevant excerpts from ABANA controlled forging; Knife Steel Nerds
on grinding, heat treatment and 80CrV2; Met armet and decoration; Royal Armouries replica care;
Primitive Archer's maker-written hickory bow article; Tandy education;
GIA on proportions, craftsmanship and color; Corning glass glossary/annealing/FAQ;
Wood Database workability, western red cedar and moisture; V&A sculpture;
Manuscript Pen FAQ; HSE upper-limb and dust sources.

E1: Fitzwilliam's armor PDF had damaged extracted text. The web screenshot
route returned no readable image evidence to this session. Replaced the two
provisional rows with Met-sourced embossing and heat-patination details.
No final row relies on that PDF; no local temporary files were created.
E2: S16 workability full-page fetch failed. Switched to readable search text
from that same specialist page; no fetch retry loop. Its claims remain excerpt-level.
E3: Art of Making's point-chisel page failed. Switched to V&A; no claim relies
on that failed page. Colorado State's scanned leather unit was inspected by
search excerpt/screenshot route but not used as evidence; Tandy supplies the rows.

## Checks and open questions

| Code | Check / remaining gate |
|---|---|
| C1 | Static check: 80 unique consecutive SB IDs, SB13-SB92; ten craft sections, eight rows each. |
| C2 | PASS: each row has F0/F1, property/route and evidence basis. 54 STATED craft bases, 26 INFERRED craft bases; every game wording/mapping remains inferred. All source references resolve to S01-S23. |
| C3 | PASS: local file links/anchors resolve, each cue is at most nine words, no em dash or spaced double-hyphen prose. Git status shows both assigned files new/untracked; only those files created by W5. |
| Q1 | Root chooses global SB numbering and any selected gameplay slice. These lane-local IDs are not a claim on the root palette. |
| Q2 | Select the craft/material/era before using a cue. Hickory flat bows, veg-tan tooling, metal dip pens and one armet are bounded examples. |
| Q3 | No universal acoustic flaw assay is established. Sound-based exact reveals require source-tested protocols or an explicit world/cheat grant. |
| Q4 | Direct weather effects on stone, gem and calligraphy were not verified. Their weather rows concern observation or worksite conditions and are INFERRED. |
| Q5 | Future implementation requires an actual property consumer and knowledge projection, rebuilt desktop browser evidence, applicable save/import checks and human taste acceptance. No gameplay completion claimed. |
