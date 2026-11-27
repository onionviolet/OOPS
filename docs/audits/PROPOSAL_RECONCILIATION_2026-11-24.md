# Reconciliation of the 2026-11-24 Gu and atlas proposals

Audit, not an accepted decision (AD32). Trigger: Weibao, "can we work on the ideas or /reconcile-project for everything?" Goal: one ranked list of what to build next, with every selected proposal given a route.

**Scope.** Tree at `361efdec4`. Selected families, each keeping its original IDs:

- the [Gu blocker audit](GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md): F1–F4, A1–A4, R1, P1–P4;
- the [RI community research](../research/RI_COMMUNITY_ANSWERS_2026-11-24.md): C1–C11, F1–F7, I1–I7;
- the [Heaven's Will Discord ideas](../research/HEAVENS_WILL_DISCORD_IDEAS_2026-11-24.md): T1–T34, HW1–HW17, L1–L13;
- the [atlas ideaboard](../research/WORLD_ATLAS_IDEABOARD_2026-11-22.md): WA1–WA24;
- the [atlas goal check](../reviews/WORLD_ATLAS_PLATFORM_2026-11-24.md): F1–F7, R1–R18.

The two Astra audits ([direction](OOPS_DIRECTION_AND_WEAK_RULES_2026-11-24.md), [platform](ATLAS_PLATFORM_AUDIT_2026-11-24.md)) are read as competing proposals and as the source of the open decisions. The [Discord atlas ideas](../research/DISCORD_ATLAS_DESIGN_IDEAS_2026-11-24.md) (DY codes) are outside this pass and listed as unmapped residue.

**Authority used.**
- [PROJECT current focus](../../PROJECT.md#current-focus): foundations first, Gu capability breadth before further UI.
- The [vision log, 2026-11-24](../gm/USER_VISION_LOG_2026-11.md#atlas-audience-foundations-milestone-and-look-2026-11-24): the atlas serves both audiences equally; the first foundations milestone is "Not sure yet"; polish before identity.
- [W1–W7 accepted](../gm/USER_VISION_LOG_2026-11.md#weak-rules-w1w7-reconciled-2026-11-24).
- Weibao in this session: "add the I1 and I2 ideas to the atlas ideaboard, can we start work by coordinating the codex and sending them out to work on those?"

Nothing else in these families has recorded acceptance.

**Evidence levels.**
- "Built" means source committed at the hash named.
- "Tested" means tests run today with output read. For other sessions' commits it means the test was reported by that session.
- No item here has browser proof by this session, and none is human-reviewed.

## Ledger

Dispositions: **adopted** (cites the direction), **build** (ranked below), **decide** (in the decision packet), **parked** (with a reopen trigger), **retired** (with a successor).

### Built today

| IDs | Claim | Class | Owner / consumer | Evidence | Disposition |
|---|---|---|---|---|---|
| WA24 = I2 | Check a passage before paying for a read | duplicate pair, now one item | `scripts/check_passage.py` → atlas codex row button | Built `361efdec4` and `440a4184c`. Self-test (18 cases) and node test run today, exit 0 | **adopted** (session direction above); built |
| WA23 = I1 | Evidence per recipe slot | duplicate pair | `scripts/gu_move_slots.py`, `docs/coverage/evidence/gu_move_slots.jsonl` → codex move detail | Built `361efdec4`, `abaaaf035` and `0f1e625fd`. Tests run today, exit 0. `check:coverage` exit 0 after the move to `evidence/` | **adopted**; built. Its follow-up is B4 |
| goal-check R5, R6, WA12 (part) | Per-row wiki pages over the coverage ledgers | incomplete integration → implemented in part | `prototypes/world-atlas/codex.mjs`, `codex-views.mjs` | Built `440a4184c`; atlas session reports `atlas_codex` 8 of 8 | Proposal status kept (AD32). The remaining WA12 layers (scenes, ties, code links) are **parked** until B3 picks a row that needs them |
| WA16 (part) | Since last time | incomplete integration | `changelog.mjs` (`GET /changes?since=`) | Built `440a4184c`; `atlas_changelog` test reported | This covers commits and the working tree. Snapshot count diffs stay **parked**: reopen when two dated snapshots are compared for a decision |
| goal-check R12, WA2 (part) | The cat fold, generalized | incomplete integration | `src/ui/fold.js`, [DESIGN_GRAMMAR](../DESIGN_GRAMMAR.md) | Built `34ba697fe`; `fold.test.js` reported | Proposal status kept. Astra's refinement holds: reuse it, then generalize to a second kind |

### Gu ledger leads (source facts)

| IDs | Claim | Class | Owner / consumer | Evidence | Disposition |
|---|---|---|---|---|---|
| audit P3 (6 rows), L6, L7, L10, L11, C8, Time Anchor rank 6 (`ri:ch1810:p41`) | Chapter-stated ranks for rows blocked as rank-unknown or effect-unknown | missing proof (one reader, unchecked) | `docs/coverage/chapter_tier_labels.json` → `gu_kinds.jsonl` through the ledger scripts | Claude read the cited paragraphs for ch1291:p83, ch1063:p55, ch1018:p69, ch637:p74, ch516:p63 and ch1810:p41 | **build B1** (second reader, then fold) |
| L3, L4, L8, L9, C6, audit P4 (5 type words) | Effect statements for effect-unknown rows | missing proof | the effect-label pass (`scripts/chapter_effect_labels.mjs` and its fold) | Partly checked by eye (ch516:p63, ch746:p15) | **build B1** |
| L1, L2, L5, L12, L13 | Corrections and alias clues on rows that are not blocked | compatible variant / evidence correction | the same ledger owners | Codex-reported, unchecked here | **build B1** (record as corrections; no state change) |
| audit A2 | 108–113 effect-unknown rows already carry a wiki-tier effect that needs mapping | incomplete integration | the GL2 effect-family mapping, `wiki_tier_labels.json` | Counted today from the ledgers | **build B2** |
| C1–C5, C10 | Partial killer-move recipes from chapters | missing supplier, now supplied | `gu_move_slots.jsonl` (WA23) | 88 chapter slots at their cited paragraphs; 5 checked by eye | Covered by WA23. Second reading goes with **B1** |
| C7, C9 | Derivation Gu's effect is the formation's, not the Gu's; rank ceiling is a separate field from rank observed | genuine source question / compatible variant | Gu catalogue owner | C7 is speculation; C9 is chapter-cited (ch2136) | **parked**: reopen when a case needs Derivation Gu or a ceiling field |
| audit F1 (first version) | Rank gaps came from shallow search | evidence correction | the audit | Corrected in the audit itself | **retired**; successor is the audit's corrected F1 |
| goal-check R11 | `*-unknown` slugs are reading gaps | evidence correction | goal check → blocker audit | The blocker audit and Astra both disagree, with evidence | **retired**; successors are the blocker audit A1–A4 and Astra's remedy split |
| audit A3 | Paid reads for the residue | user spend | AU16 and AU17 budget rules | — | **decide Q5**, after B1 and B2 |
| audit A4 | Moves need an authored-recipe rule, or a partial state | compatible variant | GKM5–GKM8; the ledger note on authored order ("supports before cores (GG9)") already covers order | — | **build B4** for slot display; the new ledger state is **decide Q4** |

### Mechanic ideas (Heaven's Will, fan projects, community)

| IDs | Claim | Class | Owner | Disposition |
|---|---|---|---|---|
| HW1 | Show an unnamed support by its known job | incomplete integration of WA23 | GKM5–GKM8; codex slot fold | **build B4** |
| HW3 | One composed investigation move: broad sweep or a stronger probe | new case on an existing owner | `src/gu_senses.js`, GKM340–GKM343 | **build B5** (a foundation case, engine-first) |
| HW2 | The same attack at two essence stages, as paired receipts | missing proof for an existing rule | GKM36, GKM85; WA11 | **parked**: reopen when B3 reaches a combat row |
| HW4, HW6, HW7, HW8 | Non-damage rivals; wound and treatment; sustainable feeding; two material routes | new cases on existing owners | GKM1, GKM19–GKM22; Body and Health, GKM408, GKM425; GKM70, GKM439–GKM442; GKM41 | **parked** as foundation-run candidates: reopen when the [resume block](../gm/dispatch/foundation-run-2026-11-12/RUN.md#current-resume-block) picks that part (FR1, pick by unblocking) |
| HW5 | Dev dossier fact versus in-world Known things | compatible variant of goal-check R8 | WA12, WA24; SX1, UR80, UR84 | **parked**: Astra disagrees that these are "the same rows" today. Reopen with a shared identity join |
| HW9, HW10, HW16 | Unique Immortal claim custody; inheritance eligibility; contested legacy | new proposals on existing owners | GKM31, GKM47–GKM48; GKM391; death and succession owners | **parked**: reopen when Fang Yuan's slice resumes (he is the first consumer, per PROJECT) |
| HW11–HW15, HW17 | Regions, ascension fork, aperture view, transformation Dao marks, lethal stakes, trade signals | new proposals | Maps and Travel, GKM81; RI gates, GKM377; `gu_aperture.js`; `gu_living_body.js`; contest pack; Keeper market | **parked** in the HW report, with the owners named there |
| T1–T34 | Heaven's Will thread map | evidence | — | Kept as evidence. The thread suggestions are another project's ideas, credited, not to be lifted wholesale |
| F1–F7, C11 | Fan-project mechanics and design precedents | evidence | — | Kept as precedents for B4 and I3 |

### Atlas platform ideas

| IDs | Claim | Class | Owner | Disposition |
|---|---|---|---|---|
| I3, I6, I7 | Substitution workbench; mechanics fold with field traceability; event history from receipts | compatible variants of Astra V4, V2 and V5 | atlas session; `prototypes/workbench/` | **parked** behind Q1. Reopen inside the gap-to-proof pilot |
| I4, I5 | "How do I get and keep this running" view; typed relation graph | compatible variants of goal-check F3 and Astra V7 | atlas; `src/progression_gates.js`, `canvas.mjs` | **parked** behind Q2 (canvas choice) |
| goal-check F3, F4 | Unlock-chain lens; shared-system rows (Gu, potions, bench forms) | incomplete integration | atlas codex | **parked** with I4 and I5 |
| WA1–WA7 | World themes, glyphs, voice captions, quotes, map ground, recipe cards, in-world framing | proposals (flavour) | atlas; DESIGN_GRAMMAR | **parked**: the 2026-11-24 direction puts polish before identity. Reopen after the grammar covers the atlas shell |
| WA8, WA9, WA11, WA15 | Gap cards; safe "close the gap" writes; book-to-game ladder; leverage | compatible variants of Astra V3, V4 and V6 | atlas codex blockers (already sorted by rows unblocked, with `nextAction`) | WA8 and WA15 are partly built in codex blockers. WA9 and WA11 are **decide Q1** (writeback as a candidate handoff, plus the evidence ladder) |
| WA10, WA13, WA14, WA17–WA22 | Fill review queue; cross-world compare; global search; batch watch; time scrubber; footprint; ask the atlas; printable brief; sound | proposals | atlas | **parked**. WA17 already exists in part as `batch-status.mjs`. Reopen on a named use |
| goal-check F1, F2, F5–F7; R1–R4; R7–R10; R13–R18 | Provenance, Watchcraft pilot, receipts strip, dev-tool guard, code clash; codex base; four atlases; Known things; reach; renderer; design language; landing debt | mapped verdict by verdict in [Astra's comparison table](OOPS_DIRECTION_AND_WEAK_RULES_2026-11-24.md#comparison-with-claudes-note) | atlas session | The disagreements are R8, R11 (retired above), R13 with T1–T4 (**decide Q2**) and FR2 (**decide Q3**). Refinements stay with the atlas session's owner work. F7, the WA code clash with the World absorption WA1–WA68 rules, is still live: **parked**, reopen before any WA code is cited in a rule owner |

## Ranked build list

1. **B1 Second-read and fold today's Gu leads.** Covers the chapter-stated ranks (audit P3, L6, L7, L10, L11, C8, Time Anchor), the effect statements (L3, L4, L8, L9, C6) and the 88 chapter slots. Run `check_passage.py` on each, have a second reader confirm, then fold through the ledger owner's existing fold path. It costs agent time and no API credits. It unblocks rows directly and touches no runtime code.
2. **B2 Map the 108–113 wiki-tier effects to effect families (GL2).** Mechanical, free, and the largest single unblock for effect-unknown rows.
3. **B3 One Gu gap-to-proof pilot** (Astra direction D1 and platform D1–D4). Take one blocked row from the codex blocker list through a case to "runs", recording each evidence level separately. Waits on **Q1**.
4. **B4 Move slots that show their job** (HW1, the A4 display half). Unnamed or unresolved slots show the job the source gives them, and a scratch recipe can try a support. Owners: GKM5–GKM8 and the atlas fold.
5. **B5 One composed investigation case** (HW3). An engine-first foundation case on `gu_senses.js`. Pick it through the resume block's FR1 rule, not out of order.

Ranked after these: HW2, then HW7, then HW4, then I3 inside the pilot, then WA1 after the grammar.

## Decision packet

**Answered 2026-11-24:** Weibao, "Start all of them up till Q5". Q1–Q4 take the recommended answers below, and B1–B5 are started ([vision log](../gm/USER_VISION_LOG_2026-11.md#proposal-reconciliation-q1q4-answered-b1b5-started-2026-11-24)). Q5 stays open.

| Rank | Question | Recommended answer | What changes |
|---|---|---|---|
| Q1 | Adopt one Gu gap-to-proof cycle as the atlas pilot, with the corrected evidence ladder (case, reachability, player action, persistence as separate fields)? | Yes. Both Astra audits and the goal check converge on it | B3 starts; WA9 and WA11 get their shape from the pilot |
| Q2 | Atlas renderer: grow its own canvas plus a page web (T1+T4, Astra), or build from game UI primitives (T3, the goal check)? | T1+T4 now, sharing pure grammar pieces; revisit on a measured workload | Decides I4, I5 and the relation lens |
| Q3 | Do engine-only foundation waves count, or is play reach the score (FR2)? | Engine-only waves count; tie-in waves report player outcomes (Astra D3) | Foundation wave reports keep two outcome types |
| Q4 | Add a `partial-recipe` ledger state for moves whose sources name some slots? | Yes. It separates 88 chapter-backed partial moves from moves with no evidence | `gu_moves` states and `check:coverage` change; needs the ledger owner |
| Q5 | Pay for reads on the effect-unknown residue after B1 and B2? | Decide after B1 and B2 report the residue size | Spend under AU16 and AU17 |

## Unmapped residue

DY1–DY40 (Discord atlas ideas); goal-check rounds 3 and 4 items T1–T4, FR1–FR6, L1–L3 and DC1–DC4 beyond the verdicts cited above; Astra W8–W22 (untouched, per the W1–W7 entry). None of these was mapped in this pass.

## Results, 2026-11-24 (agent-verified, not human-reviewed)

Lanes and records are in [proposal-build-2026-11-24](../gm/dispatch/proposal-build-2026-11-24/README.md).

- **B1, kind leads.** The second reader agreed on all 22 leads. 16 `gu_kinds` rows moved to precise blockers (rank-unknown 221 → 218, effect-unknown 296 → 292). No row reached runs through B1 alone.
- **B1, slots.** 86 of 88 chapter slots agreed on second read, and 2 differ. Five slots carry a source-stated `job`.
- **B2.** 1 of 113 wiki effects fits an existing effect family. The other 112 record `effectFamilyGap` with the missing rule and its owner, so effect-unknown is mostly missing rules.
- **Q4.** 20 moves are now `blocked:roles-partial` (roles-unknown 651 → 640, roles-unchecked 63 → 54).
- **B5.** `combined-investigation` is an authored, engine-only case (`src/world_packs/gu_investigation_cases.js`) with a `gu-investigation` family in `scripts/case_runner.mjs`. It computes `expressed-authored`. No player route.
- **B3, the atlas pilot.** `fandom:Heavenly_Essence_Treasure_Monarch_Lotus` reaches `runs-authored` (commit `98700248b`, with its [handoff](../gm/dispatch/atlas-platform-2026-11-24/pilot/HANDOFF_fandom_Heavenly_Essence_Treasure_Monarch_Lotus.md)). Case, reachability, headless player action and headless persistence are each proven. No browser receipt. The generator applies its WA9 handoff line, and lane A's wrong "produce a material" gap for it is removed.
- **B4 display.** With the atlas session, pending lane B's contract (`secondRead`, `secondReadNote`, `job`, `jobAt`).
- **Q5 input.** 40 effect-unknown rows with at least 5 paragraph hits and no chapter or wiki effect ([lane A report](../gm/dispatch/proposal-build-2026-11-24/lane-a/REPORT.md)). Several top ids are ambiguous names (`fandom:Three_Gu`, `fandom:One_Gu`).

Checks on the combined tree: `check:coverage` exit 0 (224 ledgers); Gu, case-runner, passage and workshop tests 532 of 532; `check:arch` 0; `check:rules` 0 (one stale-glob warning outside this work); doc check clean for these files.
