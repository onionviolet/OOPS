# One ladder: reconciling ideas, engines and play reach

2026-11-13, master `df7ecec17`. Status: a bounded reconciliation pass with proposals. Nothing here is accepted direction and no build order changes. Request (Weibao): "How to reconcile everything? Make sure ideas and procedural systems are actualized?" then "Reconcile accordingly using that skill".

**Scope of this pass.** It places the project's existing measures on one ladder and maps this chat's proposals to their existing owners. It read the generated [coverage report](../coverage/README.md), the [foundation resume block](../gm/dispatch/foundation-run-2026-11-12/RUN.md#current-resume-block), the [capability runs record](../PROCEDURAL_CARRY_OUT.md#capability-runs-in-the-game-ui-2026-11-12), PROJECT.md, the Homes section of the [area guide](../AREA_GUIDE.md#homes) and the headers of the [November 4 collection reconciliation](LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md). It ran no build, test or browser walk, so every implementation number below is a recorded reading, not a fresh one.

## The ladder and where things stand

The rungs already exist under other names. Only the last three lack a native measure.

| Rung | Native measure | Recorded reading | Evidence level |
| --- | --- | --- | --- |
| 1. Idea | [IDEA_INDEX](../IDEA_INDEX.md), palettes, [writeup register](../gm/WRITEUP_REGISTER.md) | 1,999 candidate documents in the November 4 inventory; 1,806 still without content review at batch 16 | That record's own count; later batches not read here |
| 2. Classified | Coverage ledgers (CV1-CV4) | 3,406 canon rows across seven ledgers, all classified | Generated README at this commit |
| 3. Runs in the engine | Typed `runs-*`, and computed "expressed" (PC9, PC10) | 465 typed; 109 computed. The two disagree both ways: Gu kinds 368 typed and 16 computed, Hogwarts spells 5 typed and 75 computed | Generated README |
| 4. Imported by the game | Computed "runs", by reach from `src/main.js` (PC14) | 0 in every ledger | Generated README |
| 5. Reachable in play | None per capability. Receipts hold headless browser walks | Three capability runs (Fang Yuan, Klein, Su Xiao) on build `02ade05b…`; book routes at Klein ch129, Fang Yuan ch140, Harry Book 1 and Zorian ch26 | Historical receipts, not rerun |
| 6. Judged | None | No reading | No supplier |
| 7. Played by Weibao | Register state "Read" or a recorded acceptance | Not established in this pass | Not searched |

Two readings matter most.

- **Blocked rows cluster.** 2,782 rows are blocked, and five missing rules hold 2,385 of them: Gu move roles (753), Gu rank (678), Gu effect (400), Hogwarts ingredient properties (380) and LOTM formulas kept in notes (174).
- **Rung 4 reads zero by design and also undercounts.** Engine-first (PC95) keeps case modules out of the runtime. The capability runs reach play through their owners directly, so a capability can be on screen while its ledger row still reads zero. The ledgers cannot yet say what a player can reach.

## Discrepancies and dispositions

| ID | Claim and locator | Class | Owner and consumer | Disposition |
| --- | --- | --- | --- | --- |
| L1 | Chat R1: one ladder for canon items and ideas | Compatible variant | CV states, PC9, PC10, PC14 in the [foundation plan](../PROCEDURAL_FOUNDATION_PLAN.md#coverage-ledgers-cv) and [procedural core](../PROCEDURAL_CORE.md) | Rungs 2 to 4 already exist. Use their names; add no parallel ledger. |
| L2 | Chat R3: a new ideas ledger file | Duplicate | IDEA_INDEX and the writeup register; the November 4 assessment's F2 already warns of a duplicate register | Withdrawn as a new file. Residue: the 1,806 unreviewed documents. Proposal: stop measuring ideas by document review and let an idea count when it has a rung 2 row or a named owner section. |
| L3 | Chat R4: a check that a player can reach each capability | Missing proof, missing supplier | Would extend `scripts/coverage_report.mjs`; the resume block says to use no new checker script | Proposal: an optional `reach` field on a ledger row naming a scenario and action, checked by the existing headless runner. Not built. |
| L4 | Rung 4 reads zero while three capability runs are on screen | Measure gap | PC14 reachability in the coverage report | Recorded above. L3 would close it. |
| L5 | Chat: wire one engine part into play each wave | Open decision for Weibao | PC95 engine-first and the [capability runs direction](../gm/USER_VISION_LOG_2026-11.md#capability-runs-in-the-ui-and-combat-scale-2026-11-12) | Unanswered. Capability runs are the existing route for it, so a yes would extend that route. |
| L6 | PROJECT.md focus item 1 reads as an active full Klein journey; the focus paragraph above it pauses Klein and Fang Yuan as "first consumers when slices resume" | Stale emphasis, compatible | PROJECT.md current focus | No edit; priority is Weibao's. See the playthrough note below. |
| L7 | Chat: the base as the hub that systems slot into | Compatible proposal | Home engine ([area guide, Homes](../AREA_GUIDE.md#homes)); home building landed in `0ee50c806` | Rung 1. Its layout slots were not read. |
| L8 | Chat: a UI judge that is not the builder | Proposal, no supplier | [UI rules](../UI_RULES.md), the `prototype-to-decision` skill | Rung 1. This is the missing supplier for rung 6. |
| L9 | Chat round on killing, consequences, death and reset | Proposal with existing owners | `src/contest.js` (`LOSER_OUTCOMES`, `lethal` off by default), `src/defeat_domain.js`, [combat considerations](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) | Kept in the appendix. Not yet folded into the combat owner. |
| L10 | Hand-written progress atlases of November 4 and 7 against the generated coverage report | Possible stale documentation | [Atlas](PROGRESS_ATLAS_2026-11-04.md), [long-term atlas](PROGRESS_ATLAS_2026-11-07_LONG_TERM.md) | Not reviewed. Unmapped. |

## Book playthrough or capability playthrough

Proposal for Weibao's decision; it changes no priority.

Klein's route reached ch129 after 49 slices and 748 stages, and the held copy runs to ch1467. At that rate the full journey is hundreds more slices of authored windows that each prove their own window. A capability run proves a mechanism that every later window and every other life can use.

Default proposed: capability runs lead, and the books become the test set and the spine. Each book supplies a short list of scenes that need several engines at once, played as held-out checks. A book window is authored in full where a life is being played for its own sake. Klein and Fang Yuan resume from ch129 and ch140 as consumers of those capabilities, which is what the focus paragraph already says.

## Unmapped residue

- IDEA_INDEX rows, the systems register against code, the seam register and the [rule conformance ledger](RULE_CONFORMANCE_LEDGER_2026-11-10.md): headers only, no claim review.
- The 1,806 documents the November 4 record lists without content review, and any batches after its sixteenth.
- Whether Weibao has played each rung 5 item: not searched.
- No runtime claim here was re-run on the current tree.

## Appendix: this chat's proposals, kept by code

All rung 1, all proposals.

- **Coherence (F1-F4, A1-A5).** Many authors with nobody playing; rules standing in for taste; code named after delivery waves; systems arriving beside the loop. One UI owner, entry through an existing surface, Weibao's play as the UI gate, a subtraction pass, no new UI rule codes until those run.
- **UI judge (O1-O5).** Rule lint as the floor; paired comparison against YAIR and Proto23 screens; a cold player agent with only the game tools; a taste file of Weibao's picks; counted budgets for panels, visible actions and clicks.
- **Loop and surfaces.** Do, gain, unlock, choose where next. Four fixed surfaces (place, character and skills, inventory, journal) and one shared workbench.
- **Base (O1-O3).** A slot board of rooms and stations; a free grid with adjacency; a base whose shape follows the world, such as the aperture in the Gu world. Default: the slot board as the model, the world shape as its presentation, adjacency as a per-world dial.
- **Mocks (M1-M3).** A gallery page on the real stylesheets and scenario saves; variants as render functions over the same view model; stress data on every mock.
- **Representative engines (E1-E4).** Canon failures must fail for the stated reason; scenes that cross engines; a count of world-specific branches; a blind mix of generated and canon items.
- **Fights that are not killing.** Zero means out of this fight; aftermath by place, stakes by opponent, other ways to win, several bars, and what zero costs as a per-world dial.
- **Deep systems (V1-V4).** A cause line on every result, a notebook of discovered rules, a workbench preview, three depths of detail; invariants, canon cases, mass generation and a long soak.
- **Killing and reset (C1-C6, D1-D5, U1-U5).** A named death takes later book windows off the book; killing works by mechanism; the world's response is the play; blame follows evidence; chosen and compelled violence differ; death takes several shapes per world; reset, prestige and travel stay separate; aim is chosen before the act; the base anchors what carries over; a branch save before a large deed.
