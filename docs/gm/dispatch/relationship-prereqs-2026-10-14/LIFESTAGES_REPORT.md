# Life-stage and custom report, 2026-10-14

**F1:** expanded the assigned design surfaces only. [Part 30](../../../worlds/world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md) adds 106 rows on life stages, era/custom palettes, 26 world-specific rows, system joins, discovery, prerequisites and five ranked slices. [Addendum](CLAUDE_ADDENDUM.md) adds CQ19-CQ32, 14 rows, with CQ1-CQ18 preserved verbatim. All new mechanics are proposals, not accepted specifications or gameplay.

**F2:** the fixed rule remains both people 18+ by body age for romance, partner verbs and romantic/sexual content. Legal majority, power rank, mature appearance, soul memories, species maturity, an AU and cheats cannot lower it. Child contracts remain offscreen political/legal ties without romantic content. Other boundaries fit their world, era and lore. Unknown body age remains unknown. Live rereading also found later addendum 2 DV1, recorded in User Vision and part 29 RFM6, requiring adult appearance. That additional fixed restriction is linked and preserved separately. No migration or age grant was made.

**F3:** current code has cosmetic age labels, a bounded chronicle age clock and a separate public household timeline. It does not establish numerical body age for all participants. Part 30 cites inspected source with file:line, distinguishes local STATED lore from INFERRED original fill-ins, and keeps unsupported thresholds UNKNOWN. Reincarnated children, long-lived and constructed bodies, heirs, caregivers, local law and institutional status remain distinct.

## Files and row counts

| Code | File changed | Rows / disposition |
|---|---|---|
| W1 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/CLAUDE_ADDENDUM.md` | Expanded by 14 consideration rows, CQ19-CQ32. Total CQ rows 32. Original CQ1-CQ18 and their surrounding original text unchanged. |
| W2 | `docs/worlds/world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md` | Created, 106 consideration rows. Prefix counts below. |
| W3 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/LIFESTAGES_REPORT.md` | Created, report only. Its inventory/finding/decision codes are not part-30 consideration rows. |

| Code prefix | Range | Rows | Collision result across parts 0-29 |
|---|---|---|---|
| LSC | LSC1-LSC9 | 9 | Unused before this part |
| LSL | LSL1-LSL15 | 15 | Unused before this part |
| LSE | LSE1-LSE21 | 21 | Unused before this part |
| LSW | LSW1-LSW26 | 26 | Unused before this part |
| LSX | LSX1-LSX12 | 12 | Unused before this part |
| LSD | LSD1-LSD8 | 8 | Unused before this part |
| LSP | LSP1-LSP10 | 10 | Unused before this part |
| LSA | LSA1-LSA5 | 5 | Unused before this part |

CQ is an existing addendum namespace, not a newly claimed unused prefix. CQ19-CQ32 were unused in parts 0-29 and the original addendum. Missing numbered parts in the directory are not invented as checked files. All present parts 00-29 were scanned. Generic report codes W/F/C/Q/V are local to this report, not new global consideration prefixes.

## Proposed index row, not applied

Place after part 29 in `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md` when its owner chooses to reconcile the index. This run never edits that file.

```markdown
| [30 Life stages and custom](world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md) | Body age and local life stages, era and household customs, world-specific ladders with source limits, succession and time joins, fixed 18+ romance floor, discovery, added prerequisites and five ranked slices | LSC, LSL, LSE, LSW, LSX, LSD, LSP, LSA | 106 |
```

## Contradictions and tensions, both sides

These are documentary mismatches, scope tensions or unresolved design questions, not permission to edit another owner's files. No factual correction was made to CQ1-CQ18. A following clarification spells out body age while preserving the original wording.

| Code | One side | Other side | Treatment in assigned files |
|---|---|---|---|
| C1 | STATED: CQ17 says stage boundaries scale with lifespan/maturity; part 29 RFM6 also has maturation dials. | FIXED USER RULE: no scaled species maturity or adult soul substitutes for both bodies being 18+. | LSL1-LSL6 separates bodily chronology, maturity, role, appearance and law. Scaling applies only to other stages, never to the floor. |
| C2 | SHOWN: chronicle labels below 25 as youth and starts at 18 (`src/life_experience.js:8-10`; `src/chronicle.js:78-80`); creation stores an adult string (`src/character_creation.js:72,80`). | STATED: CQ1 and part 29's age floor need actual age for both people; their institutional ladder may use adult at a different age. | LSC1-LSC4 records the incompatible meanings of one age label. LSP1/LSP9 proposes a basis contract and legacy unknown handling rather than assuming youth means child or adult means verified 18+. |
| C3 | STATED: `NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md` F1 attributes an age-derived life-stage fallback to `currentNativeBody()` at `src/main.js:535-538`. | SHOWN: that function projects id/form/owner/controller/hands/mobility; `src/main.js:1077` separately supplies `lifeStage` from biography in a caller context. | LSC8 narrows the function claim without claiming stage context is absent everywhere. No source or requirements-doc repair. |
| C4 | SHOWN: creation option is `middle aged` (`index.html:110-112`), matching the stored selection path. | SHOWN: greeting compares `middle-aged` (`src/main.js:2123-2127`); the nonhuman requirements B10 already flags this. | LSC8 records the string mismatch. Documentation only; no code fix or greeting proof. |
| C5 | STATED: broad origins/era/childhood proposals allow growing local lives and world calendars; CQ6/CQ18 expects meaningful NPC/stage changes. | SHOWN/STATED: `src/npc_lives.js:33-42` reveals preauthored news; MoL WORLD_BRIEF fixes a retained-body branch and frozen unsupported absence; part 23 TN2's absence defaults remain bounded proposals. | LSL10-LSL11/LSW10-LSW11 distinguishes growth design from current implementation. No new offline aging, NPC marriages, loop resets or world advancement is implied. |
| C6 | STATED: parts 12/17, the north star and nonhuman starts support infants, varied heirs, species and body changes. | SHOWN: current heir chronicle calls an age-18 initializer (`src/chronicle.js:288-301`), while structured body admission uses scalar adult labels (`src/structured_pack_runtime.js:18,30`). | LSC7/LSC9 and LSX3-LSX5 identify compatibility/owner work. New infant/elder heirs and nested body histories are not already implemented or auto-migrated. |
| C7 | STATED: north star's "Romance, expanded" includes spirits, monsters and AIs where fitting; original nonhuman starts offer bodyless/constructed participation. | FIXED USER RULE: every romantic route still needs both body ages 18+. UNKNOWN: numerical body-age semantics for some proposed forms. | LSL6/CQ21 leaves romantic admission unqualified until a supported chronology exists. All fitting nonromantic friendship, care, work and legacy paths remain available. No arbitrary consciousness-to-body-age equivalence. |
| C8 | FIXED TASK RULE: both bodies must be 18+; apparent age is a separate fact and cannot prove body age. | STATED LIVE FOLLOW-UP: User Vision records addendum 2 DV1 tightening the floor with adult appearance; part 29 RFM6 already includes it. | Part 30 and this addendum link the later restriction and preserve it separately. The task rule is a minimum, not permission to remove a later stricter restriction. Childlike appearance cannot open a romantic route, even with adult chronological age; an adult-looking child still fails body age. |

Source provenance tension also remains explicit: Frieren's older blocked digest has no acquired revision, while its newer WORLD_BRIEF/SOURCE_LEDGER cites a qualified secondary snapshot. LSW19 uses the newer ledger's stated scope without upgrading either to primary canon verification. TTKS FINDINGS retains older partial coverage alongside Addendum 3; LSW5-LSW9 use the dated later summary and leave age/custom extraction UNKNOWN. No new raw-book read was performed.

## Open decisions for Weibao, at most five

No answer is needed to finish this documentation pass. These are future selections with recommended defaults and reachable alternatives, not either/or questions or new approval gates.

| Code | Open decision | Default + Dial + Reasonably |
|---|---|---|
| Q1 | First visible life-stage/custom slice | Default: known original Village custom plus one supervised lesson reader, after the reader contract. Dial: equivalent source-qualified HP or D&D contact. Reasonably: keep canon priority and one playable slice; documentation breadth is not a backlog order. |
| Q2 | First world's exact nonromantic stage thresholds | Default: choose one world/era/institution from LSW and inspect only its needed source facts. Dial: school, apprenticeship, civic capacity, service or estate control. Reasonably: no universal majority and no change to the fixed floor. |
| Q3 | How much childhood to play | Default: a few useful dependent-stage choices with an explicit later snapshot. Dial: detailed childhood, shorter chapters, later entry or no child start in the selected slice. Reasonably: preview actual changes; no real-time years, silent acceptance or automatic XP. |
| Q4 | Body-age compatibility for old and unusual lives | Default: preserve current nonromantic play and unresolved ages; define a supported basis before a new adult route. Dial: exact retained-body anchor, reviewed original history or source-backed form chronology. Reasonably: do not infer 18 from labels, appearance or soul memories; no migration without a full-envelope decision. |
| Q5 | Elderhood's practical role in the first fitted profile | Default: teaching, archives and household influence without universal decline. Dial: continued work, retirement, care, sourced lifespan change or ageless role changes. Reasonably: keep current mortality/XP terms until separately authorized; immortality need not freeze society. |

## Checks and limits

| Code | Check | Result / scope |
|---|---|---|
| V1 | Row/collision check | 106 unique part-30 consideration codes, expected per-prefix counts; 14 new CQ rows; all new consideration prefixes and CQ19-CQ32 unused across present parts 00-29. |
| V2 | Original addendum preservation | Original text before the new section hashes to `2ae49b99e10f93ac0a3d07d7ae34adf56b9c96aaf3ee55a8f7665fef0c57438a`, matching the pre-edit read. CQ1-CQ18 unchanged; no factual corrections. |
| V3 | Document hygiene | Local Markdown targets, table widths, trailing whitespace, missing paths, duplicate codes and banned dash/style forms checked in the three assigned files. Source citations checked against inspected files. |
| V4 | Ownership | Only W1-W3 written by this run. Part 29, its audit and the shared index were read, never edited. Other dirty work preserved. Concurrent owner changes are not this run's writes. |
| V5 | Runtime evidence | Source-read only. No gameplay source, bundle, tests, saves or private packs changed. No build, test suite, browser journey, migration, commit or push. Future selected gameplay still needs rebuilt 1366x768 proof and persistence proof where applicable; mobile deferred. |

**Final summary:** Three assigned docs delivered. Part 30 has 106 rows across eight unused prefixes; the addendum adds CQ19-CQ32 with CQ1-CQ18 unchanged. The proposed index row, eight conflicts/tensions and five open future decisions are recorded here. The 18+ body-age floor stays fixed. Document checks pass; all implementation and playable acceptance gates remain open. No source, bundle, tests, saves, private packs, index, commit or push changed by this run.
