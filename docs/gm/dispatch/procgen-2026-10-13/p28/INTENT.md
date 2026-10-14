# P28 player intent and knowledge-backed topics

2026-10-14. **PROPOSAL ONLY.** Extends root Y1–Y2 and P15 DIALOGUE V2/V4–V6, LLM_OPTIONS L1/L3–L5 and RUNTIME_TEXT T2. No parser or new route exists because this document describes it. [REPORT](REPORT.md) owns audit limits and future slices.

## Y1.1: a small box with an honest contract

Proposed label: **What would you like to do?** A typed goal, a known-topic menu and ordinary action controls coexist. A player can keep an aspiration, track a thread, open an existing action, or draft a director content request. These are distinct choices, not mutually exclusive modes. A goal never grants competence, romance, clues, items, consent, travel or a world change.

First implementation recommendation: an offline keyword/menu parser over a world-local supported-intent catalogue. Each entry declares verb aliases, argument types, known target picker, ambiguity rules, owning ambition/thread adapter and current action-preview adapter. Do not index the raw simulation registry or hidden actor records. [P23 AMBITIONS N1a–N1b](../p23/AMBITIONS.md) owns ambition progress; P12 owns thread/quest structure; [P22 STORY_REQUESTS K2.1–K2.2](../p22/STORY_REQUESTS.md) owns director requests. P28 is their input translator. Final sibling refresh found these proposal owners after their initial checkpoints; runtime adapters still remain dependencies, not invented available APIs.

Proposed flow: type → parse → choose interpretation/target → preview supported steps → explicitly save goal or open action. Opening a control never executes it. The ordinary host then requotes and admits the actual action. Preview typing, menu searches and clarification use no gameplay draw, time, resources or knowledge writes. A confirmed goal note may persist through its own checked publication; parser failure leaves it a draft.

## Y1.2: bounded grammar and clarification

Normalize Unicode and spacing for matching; preserve the player's original text separately if they choose to save it. Use curated aliases, whole tokens and longest known phrases. A suggested 500-character prototype input bound protects the surface, not the scope of possible ambitions. Longer notes can use P16 authorship. Never truncate a goal and execute the truncated interpretation.

Recognize a small grammar such as `verb + target + optional known object/place`. Conjunctions produce editable separate candidates, not an automatic sequence. Negation, quoted speech, temporal qualifiers and unsupported conditions require a supported grammar rule or clarification. A bag of words must not map “don't fight Neri” to Fight. Unknown names, typos and same-name contacts use known disambiguators; fuzzy matches are suggestions only. A named target is world/instance/actor-qualified, never matched globally by display name.

| Code | Input / condition | Proposed visible result and next choice |
|---|---|---|
| Y1.2a | “Help with the delivery” matches two known threads | Show their known requester/place and ask which; preserve text; no draw or commitment |
| Y1.2b | “Court the baker” but no supported courtship adapter | “You can save this as a goal. Courtship actions are not available in this version.” Offer a known meeting only if it exists, without labelling it courtship |
| Y1.2c | “Find out who stole the rope” with a known report but no proved theft | Track an enquiry about the attributed report; known witness/evidence actions only; do not create a culprit or certify theft |
| Y1.2d | “Become a master and buy cloth” | Two editable candidates: ambition and supported shop route. No automatic purchase or promise of mastery |
| Y1.2e | Unknown entity or opaque sealed ID | Generic unmatched input and known-menu choices. No confirmation of hidden identity, secret existence, reservation reason or near-match to a private alias |
| Y1.2f | Target left, price changed, pack unavailable, stale goal | Preserve goal and historical terms; show only known current obstacle or neutral unavailability. Requote before action, never silently substitute another person |
| Y1.2g | No match / unsupported language / uncertain intent | Keep draft; offer known goals/topics and “Save as a personal note.” Optional director request stays a candidate requiring P15 production |

These are original interface examples, not canon dialogue. Use deterministic match tiers, for example exact menu label, curated synonym, multiple matches and unmatched. Do not display invented confidence percentages. Show “I understood: investigate this reported loss” and let the player edit it. Cancelling interpretation does not lose ordinary play.

## Y1.3: goal records and optional model proposals

A proposed input record references the goal owner rather than copying it: record ID, parser/catalogue revision, original text if retained, selected intent, known target refs, world/instance/branch, chosen interpretation, owner ref/revision and status (`draft`, `clarify`, `tracked`, `unavailable`, `retired`). Milestones/progress read authoritative receipts. Completed dialogue text and biography highlights do not prove ambition completion. Do not invent a second scheduler, relationship score or objective store.

Missing required owner means a saved personal aspiration or a director candidate, labelled accordingly. Keep routes such as study, paid help, cooperation, refusal, detour and fitting powers available when supported. A first parser's vocabulary is an implementation boundary, not a fictional ban. Distinguish “currently blocked,” “not implemented,” “unknown,” and “forbidden by this world's qualified law.” Do not reveal a private reason to make that distinction more specific.

Optional model intent matching can follow P15 L1's constrained proposer. It receives only the typed text and safe known catalogue. It can return catalogue IDs/argument candidates, not commands or new facts. Validate output against the same parser contract, then show interpretation and action terms. Injection-like player text remains data; no tool/file access. Timeout, malformed output, no network and budget exhaustion return to the complete menu/parser. External processing and cost choices follow P15; no save/raw-note upload is implied. Freeze selected interpretation; imports do not send another request.

## Y2.1: ask anyone about what you have learned

Extend P15 V4's **select topic** step with a topic index from observer-qualified claim refs, actual shared encounters, learned methods, known objects and unresolved questions. This enables asking a contact about a learned subject even if the contact has no answer. Separate **player knows the topic**, **speaker knows something**, **can communicate**, **willing to discuss**, and **mechanically supported response**. Topic visibility cannot depend on a hidden speaker fact whose presence leaks an answer.

| Code | Topic source | Supported speech acts / owner |
|---|---|---|
| Y2.1a | Actual pending offer / received terms | Ask terms, clarify, negotiate if supported, help/decline. P11 N1 owns deficit/funds; P15 V4 owns the turn |
| Y2.1b | Attributed witness account or rumor | Ask basis, compare two received claims, report an observed correction. P14/P24 own claim history/perspective; P11 N5 owns transmission |
| Y2.1c | Known method or observed failed work | Ask for instruction, qualified help or an explanation. P6 owns actual teaching/creation; hearing text is not mastery |
| Y2.1d | Shared deed / known relationship event | Recall that receipt, invite further supported work, apologize or discuss disagreement. P19 owns social consequences |
| Y2.1e | Known place/object/occasion | Ask directions, provenance or participation through actual contact/channel. P20/P27/P11 own places, journeys and occasions |

A speaker may respond with a qualified account, a question, “I do not know,” refusal, partial information or a fitting authored deception. These remain real responses. Asking “tell me everything” cannot enumerate hidden topics. Do not show “they know but refuse” unless that itself is earned evidence. A false report remains attributed, not silently corrected by the parser. New speaker knowledge requires the actual observation or transmission owner.

Reuse the existing Ink scene/choice lifecycle for authored beats; bind topic cards through P15's proposed adapter for ordinary recurring talk. For a future known request: ask what is needed, hear the actual terms, choose help or decline, return to the same person, and ask about the real settlement. No new conversational memory database. Preserve speaker, claim basis, turn, exact offered response IDs and frozen speech across leave/reload/import.

## Y2.2: source audit extension, after P15 F26

| Code | SHOWN/SOURCE locator | Inference for P28 |
|---|---|---|
| F27 | `src/people_knowledge.js:12–39,97–105` gates people on met/received records and attributed knowledge | Use known projection for target labels; it is not a generic topic/action resolver |
| F28 | `src/simulation.js:84–142,423–449` previews requirements/means and rechecks an event response against current state | Typed intent routes through a supported preview and host, never directly applies generated effects |
| F29 | `src/causal_story_content.js:86–96`, `src/causal_story_host.js:459–503`, `src/causal_story_core.js:79–87` bind conversation to received knowledge, participants and supported work | Reuse bounded authored conversations; generalized questions need an additional adapter |
| F30 | `src/simulation_effects.js:281–292` rank-overwrites knowledge keys and bounds relationship memories; `src/life_record.js:1,32–58` is explicitly lossy | Do not reconstruct intent progress or conflicting beliefs from prose. This extends P15 F5/F16 rather than claiming their absent generic memory is now implemented |

No browser evidence here. Future gates: negation/ambiguity/unknown-target corpus; no hidden autocomplete; pure preview; same scoped interpretation and turn after reload/import; stale-target requote; failed publication has no goal/action consequence; natural known-goal → actual route → receipt; readable input, terms and ordinary actions at 1366x768 and 1600x1000. Mobile deferred.
