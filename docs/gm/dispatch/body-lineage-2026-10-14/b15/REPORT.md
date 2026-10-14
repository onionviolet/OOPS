# B15 report: body cheats as cards

2026-10-14. **Documentation complete; all gameplay remains proposal/unverified.**
Only this `b15/` folder was authored. No shared owner/source/save/bundle edit,
build, npm command, staging, commit, merge, push or browser operation was run.
The main checkout was already dirty and other lanes were active. Root retains
integration authority under [COMMON](../COMMON.md) and [PLAN](../PLAN.md).

Deliverables: [CARDS](CARDS.md), [CV1_SPEC](CV1_SPEC.md),
[TEST_PLAN](TEST_PLAN.md), and [CHECKPOINT](CHECKPOINT.md). CARDS contains 22
schema-shaped JSON payloads plus placement/means/discovery/limits/sealing/
opponent/world-cost notes for every CV1-CV12 and CA1-CA10. The richer placement
fields stay in prose; no unsupported top-level fields or panel IDs were added.
All costs/strengths/frequencies/limits are world adjectives with defaults and
dials, not accepted global balancing rules. Scope by feats remains unverified.

## Findings

| Code | Evidence and finding | Consequence |
|---|---|---|
| F1 SHOWN | `src/cheat_cards.js:1-6`, `src/cheat_cards.js:32-44`, `src/cheat_cards.js:65-75`: exact ten-key JSON contract; granting/message helpers do not execute hooks | Catalogue payloads validate today, but observer/hook entries are inert proposals. Schema success proves neither acquisition nor body behavior. |
| F2 SHOWN | `src/status_window.js:7-40`, `src/cheat_cards.js:85-98`: existing singleton informational panel and first-awakened-entry selection; every dormant status card shares generic awakening | Minimal CV1 composes `state.bodyLens` on the supported existing system card. No independent dormant body card is granted; multiple independent systems need explicit arbitration before shipping. |
| F3 SHOWN + STATED | `src/character_bio.js:10-31`, `src/capabilities.js:4-34`; [B2 SPEC](../b2/SPEC.md) | Bio/source filtering is narrow, not a general hidden-body knowledge check. Capabilities have positive trait/bloodline grants but no physique/constitution kind; B2 has unassigned genetics and no concentration field. CV1 uses admitted observations, never fabricates concentration or grants a second effect. |
| F4 SHOWN + INFERRED | `src/simulation_effects.js:281-284`; [B7 CONSISTENCY](../b7/CONSISTENCY.md); [B13 DIAGNOSTICIANS](../b13/DIAGNOSTICIANS.md); [B14 information/timing](../b14/INFORMATION_AND_TIMING.md) | Existing same-key stage overwrite cannot preserve contradictory typed diagnoses. Use bounded B2 observation values with real body/clock/source binding, keeping claims separate and stale marks dependent on known invalidation. No unobserved revision oracle. |
| F5 SHOWN | `src/main.js:315-321`, `src/main.js:5230`, `src/main.js:5340-5342`, `src/save_files.js:186-220` | Current awakening renders before saving, while file IO has guarded preflight/write. CV1 enable must commit its combined envelope before reveal. Do not inherit R1 completion from a dispatch or treat real save reload as fictional body restoration. |

Detailed file:line audit of all four requested modules plus native serialization,
window wiring and save/knowledge consumers is in CV1_SPEC F1a-F1n. These are
source-read facts, not test-suite or served-browser evidence.

## Dependency reconciliation

| Owner read only | Status used and join |
|---|---|
| Live AGENTS/PROJECT/USER_VISION; genetics G1-G74; linked life-sim body/person/gimmick sections; prior body-lineage integration | Standing means, sealing, laptop-first direction and proposal boundaries govern this return. First milestone stays one realm/one prestige. G70/G71 remain palette, not selected builds. |
| CHEAT_LIBRARY, MEANS_AND_APPRAISAL, CHEAT_COSMOLOGY, CHEATS_BY_WORLD, WORLD_SECRETS_AND_DISCOVERY | Reuse ten C0 fields, placement/carrier distinctions, enemy symmetry, player-mechanic versus diegetic power, scoped knowledge and local compatibility. Direct adaptation/source verification is a future gate; no new primary canon claim was made. |
| Status-window GOAL and CH1_REPORT | Read the whole report including coordinator close: the old Appearance blocker was resolved in its stated worktree proof. R1 is separate hardening; B15 did not rerun or establish its merge. The current inspected main still has render-before-save awakening. |
| B2 SPEC; B7 LEVELS/CONSISTENCY/REPORT | Keep native record/knowledge in `character.body_record`; no body copy in cheat state. NPC detail is demand-driven, not a relationship-based information unlock. B2 schema is proposed and must validate the selected typed value contract before CV1 code. CV1 does not require full B7 generation/lineage or solve its large-save budget. |
| B12 HOOKS/REPORT as they arrived | Use earned grip/callus evidence as a narrow candidate; many micro states lack consumers. Flavour text cannot grant a signal, modifier or diagnosis. Its daily variance proposal does not become a CV1 dependency or random stream. |
| B13 PAIRS/BREADCRUMBS/DIAGNOSTICIANS/REPORT as they arrived | LA look-alikes allow mixed causes; BC observations do not establish ancestry/intent. Medical/kin/fate means differ. Keep source, claim, interpreted belief and legal recognition separate. B13's final report updates its earlier storylet-absence finding; B15 imposes no stale storylet-integration gate. |
| B14 checkpoint, SOCIAL/PSYCHOLOGY/INFORMATION_AND_TIMING/CONSEQUENCES and final REPORT as they arrived | Align SI2/3/4/6 and ST data with dated, scoped, confidential evidence and observer-known invalidation. A body scan does not choose inner feelings, allegiance or transmitted news. Final report states documentation complete; its proposed event/psychology systems are not CV1 prerequisites. |

World notes are INFERRED original fit proposals. HP = Harry Potter, ASL = A
Soldier's Life, MOL/MoL = Mother of Learning, TTKS = the multi-book TTKS source
group, LOTM = Lord of the Mysteries; Circle of Inevitability keeps its own local
rules rather than inheriting every LOTM reader/cost. These abbreviations do not
claim one shared body model across the books. Every card identifies priority
world fits and unresolved local/imported means. Other examples such as biotech,
cultivation, Naruto-like grafts and Slime-like intake are variants/inspiration;
their exact source/era/holder scope is unverified here.

## Ranked recommendations

| Rank / code | Proposed next work | Observable gate |
|---|---|---|
| 1 / A1 | Build B2 serialization/knowledge join plus CV1's free durable enable and known-body projection on the existing system | One naturally earned public body reading appears, useful next to native play, and survives Save/reload/Export/literal Import at 1366x768. No new reward or hidden-body grant. |
| 2 / A2 | Prove knowledge boundaries before adding numeric body diagnosis | Identical admitted evidence with different hidden truth produces identical UI/metadata/empty text. Known contradiction and witnessed-change stale wording survive roundtrip; unwitnessed mutation adds no hint. |
| 3 / A3 | Reuse a verified durable reveal seam from R1 when present; otherwise make CV1 enable independently atomic | Quota failure publishes no lens/evidence/message/focus; ordinary retry commits and reveals once. No change to CH1 milestones or undocumented hardening claim. |
| 4 / A4 | Add CV3 or CV12 as the second real lens after CV1 to prove active observation versus cached view | Actual scoped protocol/sensor generates an observation, with supported cost, channel and limits; CV1 merely projects it. A named physician or item alone does not satisfy this gate. |
| 5 / A5 | Select one world-qualified action card after the body/projection seam works | CV9-to-CA5 or CA4-to-CA3 has actual stock/custody, body effect, known before/after and reversal/retention policy; source tests plus fresh rebuilt desktop and persistence proof. All other CA cards stay palette. |

Recommendations do not dispatch writers, accept mechanics or authorize main
source edits. Full NPC genetics, general diagnosis graphs, all-world body models,
independent system arbitration, stage-1 quests and shops stay outside the first
CV1 slice. Powerful/no-cost variants remain available when a world supplies
their means; no artificial once-only abuse guard was added.

## Verification and open gates

**V1 Executed:** extracted all 22 CARDS JSON blocks with Node; checked expected
unique IDs; called the live `validateCheatCard` for every block; constructed
in-memory held entries through `grantCheat`, validated them and JSON-roundtripped
them through `validateCheatState`. PASS. No game state, storage or hook executed.
This is a documentation/schema check, not a new runtime test suite.

**V2 Executed:** checked every card for the six requested design sections, all
local Markdown file targets, source-locator bounds, required output files,
trailing whitespace, prohibited dash forms and exact CV/CA coverage. PASS after
the final report existed. The initial link pass correctly flagged its not-yet-
written REPORT target; final pass resolved it. Source semantic anchors were
read directly, including both CH1 report states.

**V3 Scope:** all task mutations were the five Markdown files in this folder;
other lanes were read only. No owner, source library or private save was opened
for modification. No staging/commit/push. Concurrent shared changes are outside
this task and were preserved.

Audit byte receipt for the four required sources, SHA-256, final read. These
identify inspected bytes, not a build or immutable checkout:

| File | SHA-256 |
|---|---|
| `src/cheat_cards.js` | `8ca52e83187845d8da7bdb11d5ba96befe81bd3f2ebbe932f0c664f8140273d4` |
| `src/status_window.js` | `7f26cc81f03ebc3549fc35ea191196c148f83aa5ddf18101a6d6f954ecc9d641` |
| `src/character_bio.js` | `f6dc97c32f651734fb1984df7a93b9c44b42b1078380b7df51a1b670c8dd959a` |
| `src/capabilities.js` | `c72b4c32d26ffb4988e970e6aa849498e3fb79e5bd987b7ab86d449a15322b35` |

**O1 OPEN:** B2/CV1 source implementation, semantic validators, receipt/ref
resolution and selected body/clock adapters. CARD validation alone cannot prove
these. Cross-world and direct-canon means qualification remain per selected world.

**O2 OPEN:** own build and served-byte proof; native free discovery/useful body
reading; Standard/Vivid laptop layout/keyboard/accessibility; storage faults and
actual Save/reload/Export/literal-file Import; sealed/indirect leak matrix.
[TEST_PLAN](TEST_PLAN.md) specifies the source/native/persistence cases, all NOT RUN.

**O3 OPEN:** human fiction, cost/balance and layout-feel acceptance. Documentation
completion establishes no gameplay, installation, deployment or director approval.
Mobile optimization remains deferred. No external primary research, browser
journey, real biological/fate behavior or large-population performance was verified.
