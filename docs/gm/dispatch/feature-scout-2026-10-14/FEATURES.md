# Feature scout wave, 2026-10-14: shared brief

Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Source list: [feature game scout](../../../research/feature-game-scout-2026-10-14/REPORT.md). Hard rules: [game wave COMMON.md](../game-research-wave-2026-10-14/COMMON.md) (read it first; it governs every lane here, including output shape and done check). Aspect standard: [ASPECTS.md](../game-research-wave-2026-10-14/ASPECTS.md).

## What each lane is for

Each lane answers named mechanic questions for YAIRPG's top-ranked packets. Read the packet text for what "well" means: [PACKETS.md](../../../research/cross-game-synthesis-2026-10-14/PACKETS.md) (P01, P02, P03, P04, P19) and round 5 of [modular production chains](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md).

| Code | Feature | A donor does it well when |
|---|---|---|
| P01 | Work receipts, truthful blockers, next useful action | A stopped job names the exact missing input or capacity, the last result is a real receipt, resume is obvious |
| P03 | Teacher, study and manual routes | Routes cost differently but reach the same usable application; losing the book keeps the knowledge |
| P19 | Staged dialogue with a paid choice | A response spends a real resource, can fail, and failure changes later actions |
| P02 | One good, competing destinations | One held stock has two or more useful uses quoted side by side |
| P04 | Discovery vs permission vs ownership vs usability | "I know how", "I may", "I own it" and "I can now" are separate states |
| CH | Processing chains and kit-making | Timed stages (soak, dry, tan, refine, distill), intermediate goods, interruption rules |
| BD | Bodies as separate parts | Constitution, genetics, physique and gender as independent fields read by different systems |
| RT | Research with evidence and revision | Knowledge comes from evidence, carries uncertainty, can be confirmed or revised |

## Output per lane

1. The COMMON.md game-lane shape (REPORT.md with ranked PROPOSALS, FINDINGS.json, IMPLEMENTATION_PACKETS.md, SMALL_TOUCHES.md, TOOLING.md, CHECKPOINT.md) in the output dir your prompt names.
2. REPORT.md opens with a **Feature answers** table: one row per question in your prompt, answer, evidence (file, class, table), shown / stated / inferred, and which packet it informs (P01 etc.) with a one-line YAIRPG takeaway.
3. An `aspects-2026-10-14/` subfolder per ASPECTS.md, priority rows A01 dialogue, A03 implementation, A04 save. If time runs short, finish the feature answers first and mark aspects PARTIAL.
4. Save deep details (full tables, dialogue with IDs and conditions, decoded flows) in `docs/research/<game>/private/<lane>/`, directly under the game's top folder. Only that level is gitignored (`/docs/research/*/private/`); a `private/` nested deeper, such as `rimworld/feature-pass-2026-10-14/private/`, is NOT ignored, so never put one there. This follows the [standing rule](../../../USER_VISION.md#save-deep-details-for-reference-2026-10-14). Committed docs paraphrase.

Gameplay stays original: these are references for how things are implemented, not code or content to copy.
