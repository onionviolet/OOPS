# D6: one original-world secret roll

Status: PROPOSAL, source-audited 2026-10-13. No runtime implementation, roll or discovery has been exercised. Rank W2-4. Candidate content is SEALED; this file uses IDs and route/status only.

| Slice | Outcome Weibao can play | Owner doc | Dependencies | Proposed branch / port |
|---|---|---|---|---|
| D6-A S1 | Enter an optional original Village discovery branch, notice S1, investigate by R1 or R2, then use the discovered option | [World secrets](../../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md) | P1 root/streams mandatory; P2 truth/knowledge projection contract mandatory, without requiring mixing itself; P3 clues and P4 witness delivery optional | `proc/w2-d6-secrets` / 19440 |

## Live audit and authority

| Code | Evidence | Finding |
|---|---|---|
| F1 | `src/expansion_engine.js:73-79`; `src/simulation_contracts.js:217-235` | Worlds have facts/resources; simulation has per-actor knowledge. Neither is a versioned per-save candidate-selection/discovery owner. Add an optional explicit owner, not a truth string in a loose world fact. |
| F2 | `src/main.js:440`; `src/simulation.js:49,67`; `src/simulation_resolution.js:3-6` | Expansion `rng` moves; simulation seeds derive from it at enrollment. A hash of current `rng` on every entry would not implement an immutable per-save choice. Use integrated P1 root and preserve selected ID. |
| F3 | `src/simulation_effects.js:281-284`; `src/simulation_effects.js:110-113` | Knowledge uses seen/interpreted/understood plus text, not all five secret stages. S1 keeps stage and evidence IDs in its own owner; project safe visible text into ordinary knowledge only when appropriate. |
| F4 | `src/simulation.js:398-415`; `src/expansion_engine.js:579,529-531` | Public event labels, discovery logs and roll labels can reveal content. Every projection must use current actor knowledge; candidate names/truth labels must never enter generic rolls/history before discovery. |
| F5 | `src/expedition_content.js:40-43,64-78`; `src/save_files.js:72-73` | Existing original `base.frontier` is a valid bounded host; a new world/travel system is unnecessary. Save Import already validates expansion but needs explicit S1 validation and compatibility gating. |

Reconciliation: `PROJECT.md:365-392` and USER_VISION's hidden-specialness/sealing direction require character-limited discovery and ID-only public reporting. This is an original branch in the existing realm, not a randomized replacement for a canonical franchise fact. Natural course remains causal, with no required Frontier playthrough. It does not change the default opening, register another realm or add prestige. Candidate truths and their exact clue/payoff bindings are in [sealed/S1_CANDIDATES.md](sealed/S1_CANDIDATES.md), marked SEALED. Do not preview that file for Weibao.

## Gaps and bounded decisions

| Code | Gap / conflict | Proposed disposition |
|---|---|---|
| R1 | Per-run and per-save have different lifetimes | D6-A is per-save, per original world instance. Save/reload, Import, revisit and local chapter restart retain S1's selected ID. A genuine new save gets another selection. Future world regeneration/heir/branch operations need declared carry/remap rules. |
| R2 | ID-only save cannot also store arbitrary rendered truth text | S1 authority saves candidate/evidence/reading IDs and content revision only. Secret Notebook text is derived through a versioned sealed resolver. Ordinary logs get neutral route/status text until discovery, and must not duplicate truth prose in exports. |
| R3 | A low roll could make one route impossible | Both routes have repeatable attainable evidence actions; failure records an uncertain reading, never deletes a route. No progress hard lock or harmful off-screen consequence. |
| R4 | Generic knowledge stage may be promoted too early | Explicit stage order and evidence predicates control promotion. An unknown effect may operate; knowing a player's previous-save solution is not evidence or character knowledge. |
| R5 | Fairness review is a distinct gate | Candidate-by-candidate design self-review is in the sealed file. Independent sealed reviewer pass is OPEN for the eventual builder, as requested by the owner. P5 does not claim that pass or delegate runtime work. |

## Implementation contract

World binding: `base.frontier`, optional original branch `proc.s1@1`. For fresh saves eligible for this branch, select S1 at the new-save creation transaction; the branch menu later exposes only known surroundings and R1/R2 access. For old saves, leave owner absent until explicit enrollment in the new original branch; create and freeze S1 in that transaction before its first clue. Never auto-enroll old saves or apply new undiscovered rules to unrelated legacy tasks.

Proposed owner: `expansion.worldSecrets = {schema:1, worlds:{'base.frontier':{revision:1, poolRevision:1, secrets:{S1:{candidateId, selectedAt, selectionReceiptId, conditionIds:[], conditionClocks:{}, discovered:{player:{stage:'unnoticed', evidenceIds:[], readingIds:[], payoffReceiptIds:[]}}}}}}}`. Candidate allow-list is S1.T1/S1.T2/S1.T3, uniformly selected from stable ID order using a single P1 `worldSecrets` draw; store selection receipt and cursor atomically. Receipt includes ID/draw position, never candidate prose. Optional branch objects and local jobs use stable ID-only native/definition references; observed numeric results can be saved, but secret prose is never copied into item payloads or job labels. Validate stage enum, clock, ID membership, actor/world binding, evidence graph, condition IDs/clocks and stage prerequisites. Revision resolver must retain v1 candidates for imports after authoring updates. Missing/unsupported revision rejects without replacing the current save; do not reroll as fallback.

Two independent routes for every candidate: R1, Perception with direct field/bench observation; R2, Literacy with a local record and a supported comparison. Both use actual held means and reachable paid/ordinary acquisition. A taught/commissioned alternative can supply the needed instrument or reading without requiring a rare power. Exact thresholds, costs, objects, text and distinct evidence predicates live sealed. Evidence is committed only after an actual completed action. A preview cannot grant an evidence ID or stage.

Stages: unnoticed → sensed (one fitting clue), suspected (one route reading), known (R1 or R2 complete proof), usable (perform its earned payoff action). Alternate readings remain explicitly uncertain until proved; no candidate truth in refusal strings, tooltips, captions, route titles, DOM attributes, console, history, feed, roll receipts or checkpoint reports. After discovery, player UI may render only the discovered candidate's authorized text. Underlying rules resolve by candidate ID and may affect this optional branch before the character knows why. Hidden truth must not be used to write a clairvoyant NPC response.

First consumer: sealed payoff P1 is a real optional preparation action, with a persisted paid outcome and a demonstrated improvement in a later local task. It never becomes the only path to basic work, shelter, food or saving. A non-investigating character can continue comfortable ordinary play. No hunger death, source canon alteration, full cosmic event system or meta-knowledge transfer.

File ownership: new `src/world_secret_{state,host,view}.js`, `src/world_secret_content.sealed.js`, focused fixtures with neutral output, and optional S1 UI in existing Notebook. Root owns shared registration and optional-schema/save changes in `src/expansion_engine.js`, `src/main.js`, `src/save_files.js`, plus any new item registration with the P2 owner. P3/P4 integration consumes their clue/person adapters; no independent edits to their modules. This public spec cannot substitute for reading sealed content before implementing.

## Acceptance checklist (future, all NOT RUN)

- [ ] A1 SEALED REVIEW / SOURCE: independent reviewer checks each of S1.T1–T3 against R1/R2 reachability, correct proof, worthwhile payoff and ordinary-progress fallback. Tests print IDs only; same seed/instance selects same ID, previews/reloads/imports never draw, unrelated P1 cursors unchanged.
- [ ] A2 NATIVE: fresh origin naturally reaches a clue and completes one route, advances S1 to usable and demonstrates P1 in a real paid task. Separate fresh seeded-native journeys exercise both routes for every candidate. Before-route truth-effect and unknown-state observations use ID-only evidence summaries.
- [ ] A3 PERSISTENCE: Save/reload before clue, at suspected, known and after payoff; Export then literal-file Import into another fresh origin. Compare selected ID/revision, actor stage, evidence, paid outcome and next stream state. Inspect serialized output privately for ID-only S1 data; old absent save stays unchanged.
- [ ] A4 DISCLOSURE / FAILURE: sealed automated assertions scan all pre-discovery player surfaces and console/errors for candidate text, including other candidates after one reveal. Failed write, stale completion, missing revision and forged evidence reject safely without overwriting a slot or rerolling.
- [ ] A5 UI / EXPERIENCE: rebuilt 1366x768 plus 1600x1000, R1/R2 and stage feedback readable in existing panels; no catalogue of truths. Mobile, new worlds, heir carry and full branching secrecy deferred. Weibao can accept discovery feel without unsealing; truth approval remains separate.
