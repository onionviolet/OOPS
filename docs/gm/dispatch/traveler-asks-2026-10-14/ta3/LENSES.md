# TA3 people sight, clues and developer reachability

2026-10-14. Proposal for TA-L3 and Amendment 1 discovery hooks. [KINDS](KINDS.md) owns item/grade predicates and typed receipts; [REPEAT](REPEAT.md) owns cadence and saved memory. GL4 comes from [procedural status](../../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md#gl-cheats-that-show-or-bend-generated-stuff). It is a proposed lens, not a live implemented feature.

## D1. One feasibility analysis, separate audiences

Use TA1's live-data obtainability index and extend the existing `lint_story_spine.mjs` / `run_story_spine.mjs`. Do not make another request catalogue or a second general solver. A pure analysis returns requirement IDs, world-route witnesses, access shortfalls, knowledge visibility and uncertainty. Player presentation receives a filtered projection. Developer output does not get injected into the player view model.

| Code | Audience | Visible fields | Forbidden inference or side effect |
|---|---|---|---|
| L1 Ordinary traveler card | Agreed need/quantity/optional grade, fee/reward, ready/stretch/unknown band, held fee status, learned source hints, safe wait/cancel explanation | No unlearned tool/location/recipe answer, private purse, hidden trait, complete ingredient law or sealed truth |
| L2 GL4 people sight | Explicit activation can reveal supported needs/goals/traits through the world's authorized lens policy; known-source routes remain knowledge-filtered. Show knowledge provenance and uncertainty | No new person/need generation, fulfillment, free stock, repicking draws, standing gain, or automatic full source discovery |
| L3 Stronger source revelation | Separate deliberate lens capability may teach an eligible nonsealed source claim, saving its disclosure route and cost if any | GL4 alone does not grant this capability. Revealing a need cannot silently reveal every supplier or recipe |
| L4 Developer reachability | Sanitized world-route/status report, requirement and prerequisite IDs, missing adapters, costs/bands, test seed/table revision and replay witnesses | No truth payload, message body, private save, unsealed answer dump or mutation. Internal analysis can inspect retained truth; public output stays ID/route/status only |

For desktop 1366x768 and 1600x1000, show terms, band, known clue, reserved reward and routine action together in the traveler card. Put evidence detail and known alternative sources in an adjacent/expandable panel. Keep long debug traces out of ordinary play. Unknown/known and grade cannot depend on color alone. Mobile and a global inspector redesign are deferred. Future implementation requires own rebuilt fresh-origin screenshots; no UI behavior is claimed by these docs.

## D2. Saved knowledge, not rewritten truth

P4 currently has `met` and `knownTraits`; P2 has `knowledge[productId].observed`; GX5 only projects appearance recognition. None is a general source-knowledge ledger. Add the smallest optional typed ledger under the relevant player knowledge owner, with observer, subject/ref, claim kind, learned-at game time, source route, epistemic status and content revision. Do not build a competing truth store in lens settings.

GL4 activation stages knowledge additions and any real costs in the full save before publication. No per-render writes. A revealed goal does not set the person met, alter their true goal/traits/need, fill their purse, advance a stream or settle a request. If hidden trait revelation uses P4 knownTraits, revise its current invariant that an unmet person has none, or restrict the first capability to met people. Do not fake a meeting just to satisfy the validator. Lens-only provenance needs its own entry even when the field also enters a normal knowledge list.

Revealed property knowledge is not an oral experiment. First mixture asks can keep the existing observed-only qualification; a later appraisal adapter can introduce a separately validated identified status with provenance. Do not write `observed:true` merely because a cheat showed a property. Saved knowledge survives lens deactivation, reload and import; turning the lens off changes presentation, not memory. Truth remains retained unchanged. Unknown schemas/refs reject before import storage replacement.

Keep the ledger bounded by admitted subject/claim IDs with superseded claims folded by key. Retain meaningful provenance and uncertainty. Learning a source once does not prove it is still open or stocked. World changes can invalidate availability without erasing the fact that a person told the player about it. Persist durable learned claims; compute current affordability/access and reach band from the present snapshot rather than saving every band transition. No copied hidden product profiles in knowledge.

## D3. Honest clue chains for unknown asks

Unknown asks are solvable exploration goals. Their route exists in the world but is not yet player knowledge. Do not label them impossible or suppress them just because a new hero cannot satisfy them. Supply discovery premiums with frozen terms as described in KINDS D4.

| Code | Clue stage | Example and admission rule | Saved knowledge |
|---|---|---|---|
| C1 Need stated | “I need a whole pelt, not scraps.” The requested visible property is a term, not a source answer. Use only implemented grade vocabulary | Need/terms learned from issuer; no full harvest anatomy or recipe unlock |
| C2 Fiction lead | “Someone who works with hides might know.” Generic lead requires an authored reason. Name a specific craftsperson only after meeting them or an explicit issuer introduction | Lead claim with issuer and disclosure route; uncertainty retained |
| C3 Inquiry | Player asks a contact actually reachable through a dialogue route. That contact may describe a tool, practice or place within their own authorized knowledge | Contact-sourced clue, relevant source/requirement IDs and learned labels. The dialogue genuinely teaches those fields |
| C4 Trial and observation | Player uses real gathering, processing or craft routes and observes the product. Failed/damaged outcomes remain truthful evidence, not proof of a guaranteed future grade | Observed action/product and learned grade/properties; native handling consumes actual time/materials |
| C5 Known route | Learned route now supports ready or stretch according to current skill/tool/money/travel constraints | Durable route knowledge plus current computed access; the world may still have uncertain yields |

No clue refers to an unreached named location through an accidental tooltip. If the issuer explicitly teaches a public location, record that teaching first, then show its name. Hearsay can offer a lead without asserting success. A blocked clue route needs another authored public lead or an honest “No further lead known”; it cannot silently reveal the answer. Hints are not mandatory breadcrumbs for every step and never promise success on the next roll.

Sealed secrets are excluded from these ordinary clue chains. Secret-related needs refer only to secret ID, route and status in docs/debug; no clue text, fees, failure differences, ordering or tooltip exposes the truth. An authorized in-game secret discovery route may teach its permitted knowledge. A global people-sight toggle is not that route and does not unseal the world. Use synthetic sealed canaries in tests; do not print real secret strings in artifacts.

## D4. Developer reachability report contract

Extend the existing lint as a side-effect-free report mode, with machine-readable rows plus short human findings. Proposed row fields: ask ID/revision, kind, world/profile revision, requirement refs and optional grade predicate, `worldRouteStatus` (witnessed / unsupported / no-route), `reachBand`, known/missing prerequisite IDs, knowledge status, public clue route IDs, reward basis/premiums, consumer/settlement witness status, capacity warnings and evidence label. Developer route IDs may themselves be sensitive; redact sealed ones to the permitted secret ID and route status. No copied full save or product truth.

Distinguish these outcomes:

| Code | Finding | Gate consequence |
|---|---|---|
| R1 | Real world route + known available prerequisites | Ready; executable witness still needed for a gameplay claim |
| R2 | Real world route + known missing skill/tool/money/travel | Stretch; valid draw, higher fee. Report blockers without turning them into fresh-player failures |
| R3 | Real world route + undiscovered source | Unknown; valid draw, honest clue and higher fee. Player report withholds the hidden witness |
| R4 | Catalogue declaration but unsupported producer/consumer or grade adapter | Unsupported; not proof of a world route. Keep proposed kind out of the live pool until implemented |
| R5 | No world route, circular-only unlocks, invalid ref or impossible property/grade threshold | Fail admission/lint. Unknown is not a cover for unsolvable content |

Route analysis reads real trader stock/restock definitions, gather prerequisites, drop/harvest ownership, recipes, station/quality ranges, mixture laws and service consumers. Distinguish world existence, probability, current stock, skill access, discovery and ability to fund the request. A rare valid drop is not a deterministic short-time guarantee. A mixture property witness includes an actual qualifying method and an observation/repeat path internally; output withholds undiscovered formulas. Evaluate grades through HV1's adapter once present, keeping ordinary/legacy item routes separate. HM4's replacement of supported part drops means the index must not count both legacy drops and new carcass processing as current independent routes.

G1 can supply addressed sampling and bounded retries for authored pools, but a successful sample is not a complete solver proof. A named fallback must itself have a world witness; G1 fallbacks bypass its candidate validation. Never discover reachability by advancing live craft/loot/market streams. Use pure range/predicate analysis and isolated seeded runner fixtures. If analysis cannot prove a route, label unsupported/uncertain and require an executable witness before pool admission, rather than claiming unknown means valid.

## G1. Future gates

SOURCE tests should cover all three valid bands, no-route rejection, absent grade compatibility, equivalent item representations through the harvest adapter, mixed-line bands, changing band without changing quoted terms, clue progression, source availability changes, insufficient funds, pure repeated previews and save-byte measurements. Include reward monotonicity for otherwise equivalent ready/stretch/unknown asks without using hidden potency.

Knowledge tests compare retained truth/stream snapshots before and after ordinary views and lens grants. GL4 should change only admitted knowledge/cost fields. Prove no unmet-person fake meeting, no accidental P2 observation, no source answer or sealed canary leak in player cards, recap, exports of debug reports and error text. Exact native Save/reload/Export/literal-file Import preserves learned clues with the lens off. Rebuilt desktop journeys exercise one unknown-to-stretch-to-ready chain, one GL4 reveal and a safely waiting request. Headless/lint results remain SOURCE evidence, not native gameplay acceptance.
