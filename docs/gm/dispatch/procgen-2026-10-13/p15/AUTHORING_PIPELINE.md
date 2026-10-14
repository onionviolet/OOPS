# P15 content-authoring pipeline

2026-10-14. **PROPOSAL ONLY.** Tool names, manifests and workflow below are proposed. No lint tool, runtime content, agent batch or executable schema is implemented by P15. [REPORT](REPORT.md) supplies the source audit and future selection gates. Runtime language models are optional and separate from using agents to draft reviewed content during development.

## A1: create content in batches with retained evidence

The pipeline should produce playable situations and assets, not a quota of polished paragraphs. Agents can draft storylets, quests, dialogue, person templates, items, methods and world records from bounded dossiers/wiki digests. Their output stays quarantined until the appropriate owner validates actual requirements, consequences, source fit, disclosure and play. A new claim discovered by a writer is a research proposal, not automatically a world rule.

Reused owners: [E2 card schema](../../../../emergent/E2_STORYLETS.md#3-card-schema-final-proposal), [P3 worktree report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md), [P4 worktree report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md), [P11 N1](../p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs), [P7](../p7/GUIDELINES.md), [P9](../p9/PROFILE_RULES.md), [P10](../p10/REPORT.md), [P6 creative works](../p6/CREATIVE_WORKS.md), and [ABILITY_AUTHORING](../../../../worlds/ABILITY_AUTHORING.md). P12 owns quest/arc shape, P13 canon/divergence, P14 historical/in-world texts and P16 crossovers/endings/player-authored stories. P15 supplies the production/review path into those owners.

## A2: current formats and helpers, inspected source

| Code / locator | What exists | Reuse / missing piece |
|---|---|---|
| F17 [simulation_content.js](../../../../../src/simulation_content.js), lines 44–71, 80–110, 113–129 | JavaScript builders and merged definition arrays: people, commands, events, controllers, conditions, powers and other families. The shower is authored. | Compile reviewed intermediate cards into these supported shapes. Do not treat JS content factories as an unrestricted safe input format for imported drafts. |
| F18 [causal_story_content.js](../../../../../src/causal_story_content.js), lines 12–29, 68–117, 222–249 | Local predicate/cost/knowledge helpers produce finite cases, controller actions and situations. | Good coherent examples for causes and paid consequences, not a generic agent authoring schema. Default once metadata describes these cases, not all future content. |
| F19 [simulation_contracts.js](../../../../../src/simulation_contracts.js), lines 18–38, 47–80, 101–155, 195–212 | JSON-safe data, predicate/effect validation, registry IDs, timing/cost checks, nested references and selected power/advancement cycle checks | Reuse through a thin batch harness. These checks cannot prove all fact names have writers, situations are playable, prose is true or canon is plausible. |
| F20 [site_projects.js](../../../../../src/site_projects.js), lines 1–25 | Declarative phases compile into existing jobs/facts/claims; dependency cycles and phase shapes checked | Reuse for project-like quest steps when appropriate. It supplies no arbitrary plot planner or global once policy. |
| F21 [authored_site.js](../../../../../src/authored_site.js), lines 60–99 | Draft validator and a bounded optional-pack compiler | Reuse normalization, diagnostics and validation-before-admission pattern. Its gather/work fields are a small specific language, not all story/world content. |
| F22 [work_ledger_author_ui.js](../../../../../src/work_ledger_author_ui.js), lines 7–17; [work_ledger_system.js](../../../../../src/work_ledger_system.js), lines 25–36 | JSON draft import/edit/export plus supported recipe checks, stale revision rejection and frozen accepted commission terms | Existing authoring UI is real source, but confined to the original Work Ledger. Avoid advertising it as a generic book-world editor. |
| F23 [scripts/compile_feature_ink.mjs](../../../../../scripts/compile_feature_ink.mjs), lines 12–31, 79–95, 100–129, 135–174 and 194–217 | Pinned compiler/version/hash verification, bounded input recipe, diagnostics, stable host response tags, source/compiled identity and exact-byte check mode | Strong reusable content-compilation pattern. Its scene/response allowlists are specific; a new scene needs deliberate extension. No compiler command was run by P15. |
| F24 [package.json](../../../../../package.json), lines 5–10, 18–20; [build.js](../../../../../build.js), lines 9–16 | ink:compile and ink:check scripts, pinned inkjs dependency; build checks artifact parity and emits licence notices | Preserve the existing recipe and attribution. No general narrative lint command is declared in package scripts. |
| F25 [ABILITY_AUTHORING](../../../../worlds/ABILITY_AUTHORING.md), lines 24–79 | Causal execution, comparison envelope, transfer/teaching/body/source distinction and concrete future gates | Content reviews must bind actual functions/means. A spell name or claimed description is not an implementation. |
| F26 scripts inventory | field_fixtures.mjs prepares focused fixtures; simulation_browser.cjs, people_browser.cjs, events_browser.cjs and other browser scripts target existing slices | Reuse selected fixture/browser conventions after verifying current ownership. Their existence is not a general batch validator or passing P15 evidence. |

No existing helper above is evidence of an end-to-end canon-to-content mass-production pipeline. That is an inference limited to the inspected helpers/package scripts, not a claim that every file in the repository has been audited.

## A3: proposed input envelope and outputs

A batch manifest identifies batch ID/revision, writer area, source/profile revisions and hashes, world/continuity/era/instance scope, audience/secret class, goal/visible player route, supported adapters, requested entity types, reserved IDs, local recurrence policy, migration decision, fixtures and reviewers. Proposed manifest metadata belongs in an authoring envelope/sidecar. Do not inject invented fields into a runtime format and assume its validator enforces them.

Each entry has stable ID/revision/type, cause and intended player value; reads/writes declared by owner and scope; cast with actual eligibility; prerequisites and supported alternate means; structured costs/effects/outcomes; text slots and fallback; timing/expiry/cancellation; evidence refs; known exposure policy; tests/witness links; admission status. The compiler translates only allowed fields to the chosen existing definition family. Unknown opcodes or missing adapters become missing-engine findings, not custom JavaScript invented by a content writer.

| Entry kind | Required semantic content | Proof consumer |
|---|---|---|
| Storylet | Real trigger, fitting cast, valid response/ignore behavior, funded or explicitly sourced consequences | P3 occurrence with frozen terms and one useful changed action or labelled pure texture |
| Quest/arc step | Cause/dependency, objective, completion writer, cancellation/alternative, retained reference | P12 actual objective and later step; prose never counts as completion |
| Person template | Culture/era/cohort, source/role reservations, needs/owned means, knowledge/voice projection | P4/P7 stable person who can take part in a real supported interaction |
| Item/method | Identity, law/source, real inputs and function, provenance, custody, known description | P2/P6/P8/native consumer changes something supported; item label alone is insufficient |
| World/anchor content | Authored laws/geography/roles, source cutoff, canonical causes and declared overlays | P9/P10/P13 and timeline owners; no new world geometry or ontology from prose |
| Dialogue/account/work | Speaker/author, basis/audience, original text, language, underlying claim graph and supported learning/action | P15 turns or P14/P6 edition/copy/performance consumers; no second history/teaching store |

Source evidence has separate fields for claim mode (SHOWN, STATED, INFERRED, UNKNOWN), source quality (primary scene, narrator/actor statement, official rule, secondary digest, unverified lead), edition/revision/cutoff, speaker, locator and contradiction refs. A wiki description of a shown scene remains a secondary report until the primary is checked. A hash proves the selected bytes, not publication authenticity or whole-source completeness. Creator/work attribution is retained independently of claim confidence.

Canon dossier and digest access is bounded by the batch question. Read permitted private notes for analysis, never quote them in output or copy raw prose. Public artifacts contain original summaries and locators only. Direct recreation definitions remain in the private pack under PROJECT. A public fixture is synthetic. Do not ingest a whole library to fill a small card deck or collect a new source when existing qualified coverage suffices. Any necessary new acquisition follows the project's source-acquisition/deep-dive owners in a separately selected task.

## A4: concrete proposed tools

Suggested future CLI: node scripts/content_batch_check.mjs --manifest <batch-path> --checks <check-list> --report <report-path>. This file does not exist in this proposal. First build a wrapper around existing validators, then add only checks justified by the selected batch. Paths below are logical tool names, not claims of installed executables. Machine diagnostics include check ID, severity, content ID, field, source locator or witness, and repair suggestion; public diagnostics use opaque IDs for restricted findings.

| Tool ID / proposed command | Checks and output | Gate and honest limit |
|---|---|---|
| QA1 schema | Parse inert data; version, exact allowed fields, stable/duplicate IDs, finite numbers, safe selectors, strings and size/depth; call existing registry/effect/predicate/pack validators | ERROR blocks compilation. JSON Schema may describe the envelope later; the current JS validators remain runtime authority. Reject executable drafts. |
| QA2 refs | Resolve people/items/sites/powers/commands, source pins, aliases and world/era ownership; map each fact read to its declared writer/default | ERROR for required unresolved refs; optional adapters explicit. Existence does not imply introduced/available/qualified. |
| QA3 consequences | Extract reads/writes/costs; check undeclared effects, conflicting writes/order, negative stock, funded reservations, ownership, knowledge vs capability and visible text/terms agreement | ERROR on proven mismatch; missing semantic adapter returns UNKNOWN. Explicit world-supported creation sources/sinks remain allowed. |
| QA4 predicates | Simplify predicates; find contradictory ranges/types, mutually exclusive roles, unreachable self-prerequisites, missing-aware negation and absent vs zero mistakes | Prove impossibility only in the declared domain. Record unknown external writers rather than pretending missing means false. |
| QA5 reach | Build dependency graph from admitted anchors, grants and requirement writers; search supported action sequences with costs, clocks and cast | Per entry: WITNESS, IMPOSSIBLE-IN-MODEL or UNKNOWN/budget exhausted. Save minimal positive witness; bounded search failure is not proof of dead content. |
| QA6 coverage | Compare requested card/objective/response families with reached fixtures; check positive weight, expiry, location/contact, roles, mode and writer registration | Flags orphan content, zero-weight-only cards, unreachable choices and starvation. Rare optional outcomes need a legitimate route, not forced rarity removal. |
| QA7 grammar | Parse symbols/typed slots, cycles/depth, compatible agreement/register features, maximum surface length, punctuation/markup, fallback completeness | Block unresolved/unsafe actionable lines. Curated sampling plus bounded exhaustive small grammars; no silent truncation. |
| QA8 duplicates-tone | Exact/normalized phrase duplicates; structural consequence fingerprints; near-duplicate clusters; voice vocabulary/register checks | Warning clusters and human decisions. Similarity scores are review aids, not canon or plagiarism verdicts. Repeated genre words are not automatic failures. |
| QA9 canon | Compare claim IDs, continuity/era, reserved identities, knowledge horizon, world-law predicates and explicit AU deltas against selected source owners | Contradiction ledger + qualified review. An agent cannot certify its own invented rule by citing another generated proposal. Unresolved essential source claims block canon-labelled admission. |
| QA10 sealed | Trace restricted fields into every public surface, including error/debug/title/ARIA/caption/sort/count; scan synthetic canaries and private restricted answers locally | Deterministic taint checks plus private manual route review. Public result is ID/status only. Keyword absence cannot prove semantic secrecy. |
| QA11 attribution | Require creator/work/version/locator/claim mode, preserve upstream/tool licences, scan public bundle inputs for private-pack/novel paths and suspicious copied spans | ERROR for missing required provenance/prohibited raw prose. Similarity scanning is bounded evidence; reviewer checks paraphrase and source scope. No raw-source export to a service. |
| QA12 simulate | Execute supported commands against disposable real-code fixtures: completion/refusal/wait, interruption, stale quote, failure, actor absence and alternate means | Retain traces/state deltas with labels. Do not replace a native resolver with a mock that always declares success. |
| QA13 persistence | Same seed/candidate order; preview purity; save/reload/export/literal-file import; old absent owners; content upgrade/missing revision; failed write and duplicate delivery | Source roundtrip and native roundtrip are separate results. A synthetic JSON equality check cannot prove the browser import path. |
| QA14 review-pack | Render a compact player-facing card gallery, known reasons/terms, witness route and comparison; redact restricted metadata | Weibao reviews readability, interest, fit and optional intensity. Human acceptance is a recorded decision, not a machine flag inferred from silence. |

Later tools can aggregate these modules without making fourteen new scripts. Automated quality gates should scale with consequential content, not demand all checks for a cosmetic typo. Do not use a fixed line-count rule to decide whether content is a quest: E2's 25-line heuristic is a drafting hint; persistent state, coordination and consequence scope determine the needed owner.

## A5: a concrete card-batch workflow

Five stages keep write ownership and review bounded. Future roles may be executed sequentially by one worker or by separately assigned agents; this proposal launches none. Root retains shared integration/commit ownership.

1. **B1 Select and freeze.** Root selects one world/era and one visible local loop. Manifest pins supported adapters and source claims, reservations and local recurrence. Suggested first corpus: eight ordinary storylets (two request, two social, two observation, two callback), one short authored conversation, two original person templates and two supported item descriptions. Counts are review scope, not gameplay limits. Person/item instances use existing owners. A canon-first batch is valid when its source/adapter is ready; an original fixture is optional.
2. **B2 Draft into quarantine.** Author first makes a causal outline, requirements/writes and funded consequences, then original text/voices. Add a minimal positive witness and negative/missing-input fixture per distinct semantic contract. Dossier/digest summaries retain shown/stated/inferred and contradiction IDs. No direct registration, new opcode or copied canon speech. Batch artifacts are inert data, not auto-imported JS.
3. **B3 Check and repair.** Run relevant QA1–QA13 modules on frozen inputs. Triage ERROR, WARNING and UNKNOWN separately. Repair the specific entry, rerun its affected dependencies, and keep rejected versions/status without presenting them as live. An absent engine function becomes an explicit blocked entry or a smaller supported design, not a text-only imitation.
4. **B4 Review in context.** A canon/disclosure reviewer checks selected claims and routes; a gameplay reviewer reads traces/terms and near-duplicate clusters. Render a spoiler-safe gallery and a short prospective play route for Weibao. Accept, revise or retain as candidate per entry. Do not make Weibao read sealed answers to approve quality; private route checks report IDs/status only. Review disagreements stay in the ledger.
5. **B5 Admit and prove.** A selected builder compiles only accepted entries, with root-controlled shared registrations and compatibility decision. Perform appropriate source checks/build, rebuilt fresh-origin natural journey and separately labelled seeded cases at 1366x768 and 1600x1000; roundtrip pending/completed state through Save/reload/Export/literal-file Import. Record technical status and human fiction acceptance separately. Root alone handles authorized commits; this P15 task creates no runtime artifacts.

Technical prototype testing can happen before fiction acceptance, while entries stay labelled proposal/implemented-unverified as appropriate. “Ready for review” and “accepted” are distinct; no need to block every disposable test until all writing is approved. A batch can partially pass. Failed cards stay quarantined while accepted supported cards remain individually reviewable. Finish one playable slice before beginning another integration wave.

## A6: example semantic batch card and checks

Synthetic authoring envelope, not a current E2/P3 runtime definition:

~~~yaml
id: fixture.cloth_request
revision: 1
kind: storylet
sourceMode: ORIGINAL_PROPOSAL
cause: fixture.cart_repair_need
reads:
  - need.repair_cloth.remaining
  - requester.available
  - requester.reservable_purse
writes:
  - need.repair_cloth.remaining
  - goods.custody
  - funds.custody
  - request.settlement
cast: requester_from_actual_need
routes:
  deliver: owned_qualified_cloth_to_reserved_fee
  decline: no_transfer_keep_other_opportunities
expiry: release_fee_reservation_without_invented_repair
textSlots: [introduced_requester, qualified_good, frozen_quantity]
witness: fixture.start_to_cloth_request_to_delivery
recurrence: new_supported_need_with_world_local_frequency
~~~

QA2 must resolve every symbolic fact and route to its selected owner adapter before compilation. QA3 verifies actual transfer/conservation and that expiration does not repair the cart. QA5 finds a legitimate way to obtain cloth and meet the requester; it cannot just seed the completed flag and call the card reachable. QA7 proves quantity/item slots match frozen terms. QA10 checks that private source/identity data cannot enter the requester label. QA12/QA13 compare deliver, decline, stale deficit and failed save. A later callback must read the retained settlement, not find the word “delivered” in prose.

Sample playthrough simulation should combine: exhaustive tiny grammar alternatives; pairwise context/voice/knowledge combinations; known boundary values; a deterministic seed corpus for longer traces; and deliberately rare valid fixtures using real admission code. Report corpus size, branch/response coverage and exclusions. Ten thousand failed random rolls do not prove a card impossible; a forced success fixture proves only that controlled route. Native acquisition still needs a natural journey.

## A7: revision, throughput and acceptance records

Suggested states: DRAFT → MACHINE-CHECKED → REVIEWED → ACCEPTED-FOR-SLICE → COMPILED → SOURCE-VERIFIED → NATIVE-VERIFIED, with independent human fiction/feel status. Record partial gates and rejection reasons. These statuses describe evidence, not a new game save schema. No automatic promotion from an attractive sample or a passing test count.

Track useful throughput: accepted distinct situations per reviewed batch, edits per accepted card, defects caught before play, dead/unknown entries, source gaps, native route failures and Weibao's accepted/revised choices. Word count and number of generated cards are secondary. Compare templates/agents on the same supported task without erasing failed samples. Avoid mass-producing hundreds of near-identical delivery jobs before the first loop is playable.

Content updates retain stable IDs, saved realized text, compiled cursor artifacts and frozen terms. Reuse existing Ink content-hash/version retention. A grammar correction affects new occurrences; an active paid turn needs explicit compatibility or its retained artifact. Missing private packs may leave known historical prose readable under that owner's privacy policy, but active execution cannot guess missing definitions. Import validation precedes publication; dialogue polish cannot repair a corrupted save by discarding commitments. These are proposed acceptance requirements, all NOT RUN here.
