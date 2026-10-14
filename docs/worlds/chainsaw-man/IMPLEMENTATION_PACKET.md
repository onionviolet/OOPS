# Proposed implementation packet: Chainsaw Man first slice

Status: design only; no implementation authorized by this packet. See [SYNTHESIS](SYNTHESIS.md) for rationale.

## Bounded outcome

Proposal: deliver one human hunter's explicit contract negotiation in a fresh isolated test instance. The player can inspect the offered terms, accept or refuse, then use one bounded ability if accepted. Refusal creates no duty. The slice proves a contract is a typed relationship with actual price and eligibility, not a purchasable generic skill.

## Scope and exclusions

Proposed files for future assignment only: a local Chainsaw Man content module, its UI adapter, focused tests, and this pack's relevant detail cards. No `src/`, `dist/`, save, global registry or other world work is authorized by this research task. Exclude combat, contract chaining, arbitrary generated Devils, Hell transfer, death/revival, random truth, and any changed franchise secret.

## State shape (proposal)

Contract ID, human actor ID, Devil actor ID, offer text knowledge, accepted terms, payment type/amount, sacrifice eligibility and ownership, trigger, granted bounded effect, use cost if any, status, due/exit terms if source-supported, observer evidence, and settlement receipt. Eligible sacrifice categories stated by the wiki include the human's own body parts, senses, lifespan, legal children, or people under their legal responsibility. Unrelated people cannot be sacrificed; an incapacitated person may be offered and a proxy may deliver them, while sacrifice may be taken at a distance. Record the believed Devil identity separately: a mistaken identity does not void terms if both parties meet them, per the wiki. Before acceptance, offered terms are not an obligation. A source-supported peaceful exit remains distinct from breach. Persist only after a durable acceptance decision.

## Acceptance evidence for a future build

1. Fresh origin shows exact actor-specific offer and known cost; no hidden term appears as an action label.
2. Refusal spends no price and grants no ability.
3. Acceptance consumes exactly the supported price once; duplicate input cannot duplicate the receipt.
4. A use with valid trigger applies the effect and exact per-use cost; invalid actor/trigger is rejected without mutation unless source evidence says otherwise.
5. Save/reload/export/import preserves contract terms and remaining costs without duplicate settlement.
6. Rebuilt browser evidence at desktop viewport demonstrates the changed behavior. A design-only or source test does not prove play.

## Open dependencies

Primary manga chapter verification of exact contract wording, a selected bounded contract/ability with clear conditions, assigned runtime writer, actual save compatibility decision, UI location, and source-specific failure policy. Until those exist, this packet is not implementable proof and all gameplay gates remain open.
