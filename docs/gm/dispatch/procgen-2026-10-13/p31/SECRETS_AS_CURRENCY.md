# AK1 and AK2: information has holders, evidence and audiences

2026-10-14. **PROPOSAL ONLY.** Extends [root AK1-AK2](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#ak-secrets-as-currency), [MK5 recipe secrecy and KN flawed knowledge](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) and [P23 M3 dramatic irony](../p23/INNER_LIFE.md#m3a-dramatic-irony-without-thought-policing). [P19 G5](../p19/GOSSIP.md) owns contact and reaction eligibility, [P11 information](../p11/INFORMATION_AND_LIBRARIES.md) message transit, [P14](../p14/CONTRACT.md) claims/beliefs/history, and CR4 maker/economy lanes recipe trade. P31 adds confidential stakes and uses; it proposes no second rumor network or omniscient truth UI.

## AK1.a: generated NPC confidentiality is separate from sealed world discovery

A generated NPC secret is a private proposition about a real actor, event, method or asset in this particular save. Its truth is fixed by an actual cause or committed original generation. It must fit the person's means/history and existing canon continuity. A generator cannot invent a secret crime and retroactively alter unrelated historical receipts, or manufacture a reserved canon identity. Public canon mechanics remain attributed; new changed/randomized world truths remain sealed.

Use separate namespaces and policy: `npcConfidential` for these generated social records, `worldSealedRef` only for links to the existing sealed owner. NPC confidential truth may appear to the player through its actual discovery route. Any relation to a sealed world secret stays ID/route/status only in this lane's public artifacts. Do not copy that world's answer into a broker record, rumor, reward title, price or fixture name. Also keep undiscovered generated NPC payloads out of public audit reports; use neutral example types and IDs. No real sealed payload is included here.

Some private facts are valuable without wrongdoing: a family formula, an anonymous benefactor, a protected meeting, concealed expertise, an unfinished invention, a planned bid. Confidence, exclusivity, verifiability, relevance, perishability and actual interested buyers shape value. A false accusation can also have social force, but remains a claim and never becomes the secret truth by repeated circulation.

## AK1.b: proposed records and admission

```text
ConfidentialRecord: id, revision, contextRefs, subjectRefs, propositionRef
  truthBasisReceiptRef | originalGenerationReceiptRef
  classification: npcConfidential, discoveryPolicyRef, evidenceAffordanceRefs
  disclosureScope, lawRef, actionableConsumerRefs, changedAt?
EvidenceRecord: id, actualCauseRef, subject/propositionRefs, custodianRef
  channel/protocol, occurredAt, acquiredAt, integrity, scope, sourceRootRefs
ConfidentialHolding: observerRef, recordRef?, claimRefs, evidenceRefs
  stance, confidence, sourceLineage, learnedAt, permittedAudienceRefs
DisclosureEpisode: id, sender/listener/channelRefs, claim/evidenceRefs
  permissionOrCoercionCauseRef, sentAt, arrivedAt?, supersedesRef?
InformationDeal: id, parties, termsRevision, exactDisclosureScope
  actualFundsOrServiceRefs, escrowRefs, due/verificationPolicy, settlementRefs
```

Semantic proposal, not live APIs. An observer may possess an unidentified claim without knowing a corresponding confidential record exists. Do not auto-link the hidden record ID into their view. Evidence can be a real witnessed event, actual correspondence, physical trace, scoped assay, authenticated document, confession or world-supported perception. Owning a document is not believing it; knowing a claim is not proving it; having a proof is not public disclosure.

Generation sequence: bind actual context/person/possible motive and cause → select a lawful original private circumstance → freeze truth and revisions → validate at least one reachable evidence path for advertised investigation → persist resolution and any draw allocation → create only observer-permitted leads. Lost/undiscoverable background texture can exist if explicitly labeled; do not promise it as a solvable investigation. Previews do not enroll a secret, generate a new culprit or spend draws.

## AK1.c: learn, trade, sell, use or protect

| Root extension | Concrete action and consequence | Required real consumer |
|---|---|---|
| AK1.c1 Broker | Buy a scoped claim, a verified account or access to a source | Buyer pays actual funds; receipt names disclosed evidence standard, delivery and refund terms. Broker only sells what they know or explicitly claims to have. |
| AK1.c2 Spy | Observe handling, intercept real correspondence, cultivate a source or use a fitting perception power | Copresence/range/access/sense and successful receipt precede knowledge. Payment/cover/compromise follow local law, no universal espionage roll. |
| AK1.c3 Exchange | Trade one method detail for one contact or other claim | Mutual delivery with actual channel and terms; copying knowledge does not supply ingredients, tools or skill mastery. |
| AK1.c4 Sell | Offer information to a buyer with an actual interest and purse | Scope, confidence and source independence inform known quote. No payment from an uncreated rich buyer or a price oracle that leaks hidden truth. |
| AK1.c5 Leverage | Threaten disclosure to obtain money, service, silence or another specific concession | Delivered threat plus recipient's belief and actual resources; recipient may comply, refuse, counteroffer, flee, investigate or retaliate. A demand alone cannot write a debt. |
| AK1.c6 Protect | Refuse disclosure, guard a copy/source, obtain confidentiality terms or offer shelter | Prevent a supported transmission or protect actual custody/access; earned trust is about observed protection. Keeping quiet is not automatic divine virtue or universal favor. |
| AK1.c7 Publish/use | Present evidence at a trial, expose a counterfeit, prepare against a technique or make a competitive product | Court/market/combat/crafting owner reads a scoped known claim or actual physical law. Disclosure itself grants no unrelated power. |

Information is usually non-rival: telling one buyer does not erase the seller's knowledge. Physical evidence, copyrighted in-world rights, exclusive access, promises of exclusivity and limited attention are separate resources. A sale can transfer a physical notebook, copy a claim, disclose an oral detail or license a method; record which. Exclusive deals track real restrictions and breaches rather than making the truth disappear from all other heads. A later real copy sale remains possible if terms allow it.

Blackmail can be bluff or backed threat. Threatened harm needs a plausible audience, channel and actual consequence. Target evaluation reads what the target believes about the broker's evidence, not omniscient author truth. A broken threat promise can create a dispute; paying may not erase prior disclosure or copies. Extortion, protection, spying, lawful testimony and voluntary disclosure all stay selectable with their world-specific consequences. No universal moral score decides the only valid option.

## AK1.d: knowledge markets and counterplay

Keep source roots through P19/P14: two brokers repeating one source are not corroboration. Buyers may pay for freshness, precision, authenticity or discretion. A powerful freely accessible fact can still matter, but exclusivity premiums fade after actual dissemination. Market quotes use what the buyer can assess, plus explicit secrecy commitments. No hidden fact count, value sorting, disabled reason or candidate list may act as appraisal.

Counterplay remains concrete: document authentication, asking an independent witness, checking custody, paying an expert, observing a delivery, an allowed lie detector, or accepting uncertainty. A lie detector's scope might be sincere belief rather than objective truth. Recipe reverse engineering [MK5](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md#mk-the-makers-identity) requires real sample/assay protocol and scoped observations; P2 currently cannot extract another maker's secret from a vial. Protecting a formula can coexist with teaching a partial method, selling product, open publication or public-domain discovery.

Original first journey proposal: NPC supplies a disputed workshop document. A broker offers a paid verified account, while the hero can inspect an actual delivery receipt or ask an independent witness. Retain both accounts until evidence supports a revision. The hero can sell a scoped verified statement, protect the source, publish it or use it to negotiate a commission. A remote uninformed control NPC stays unchanged. No private truth is specified in this document.

## AK2.a: discovery of the player's own secrets

Link [P23 M3](../p23/INNER_LIFE.md#m3a-dramatic-irony-without-thought-policing): human foreknowledge, character knowledge and another actor's knowledge differ. Discoverable player secrets may concern an actual power use, prior-life memory, concealed identity, private allegiance or committed crime. Generated suspicion needs evidence caused by something that actually happened or by an explicitly authored background, not inspection of the player's save fields.

| Evidence route | What can be learned | What remains unproved |
|---|---|---|
| Witness a power's visible result | This person caused or accompanied the observed unusual event | Exact cheat name, source, full repertoire and past-life origin unless that route exposes them |
| Compare repeated material outcomes | A supported anomaly hypothesis from real samples/receipts | Perfect identification from one lucky brew or static quality label |
| Obtain an actual private message | Its received content and known speaker/authenticity | Private intent, unspoken memories or unknown aliases |
| Inspect a recorded crime trace | Scope of actual handling, time, witness or object evidence | Culprit identity where evidence supports several candidates |
| Hear voluntary disclosure/confession | What the player said, with attribution | Whether it is true; confidence and verification remain distinct |
| Use supported supernatural observation | Exactly the senses/target/scope allowed by that ability | Universal reading of body, soul, world-sealed truth and all memories |

AK2.b: An observer first perceives → forms a scoped hypothesis → acquires further actual evidence → revises belief → chooses a supported reaction → communicates through real contacts. Suspicion alone can prompt investigation, an offer or a mistaken accusation under local law. Discovery can lead to friendship, recruitment, protection, greed, fear, a test, persecution or indifference. No universal punishment for being an outsider or owning a strong cheat.

AK2.c: Player options include disclosure, demonstrations, plausible alternate explanations, concealment, disguises, private practice, counter-investigation, diplomacy, intimidation or lawful extraordinary memory/record alteration. Concealment changes actual access/perception; it cannot rewrite an already witnessed event for free. Memory erasure, when supported, acts on named memories and preserves external copies/testimony unless the power also reaches them. No retroactive reroll of the secret or unexplained NPC amnesia.

AK2.d: Reports/showcase fixtures use player-secret IDs and routes only. A director view must preserve the sealed owner policy; generic recipe-sandbox truth access does not grant a world-secret inspection route. NPC planners may read their own holdings only. Sorting by true cheat power, latent origin or sealed identity is a leak even when names are hidden.

## Idle, persistence and future gates

Spies/brokers can schedule due contacts, verification and delivery through real worker capacity and budget. First proposal uses played local time; unsupported offscreen/closed-browser activity waits. Ordinary gathering/crafting never auto-sells information or signs confidentiality. Save before public delivery, after partial evidence and after a protection/threat settlement. Retain truth versions, source roots, custody, claim/belief revisions, actual recipients, copied knowledge, confidentiality promises, escrow and next draw. UI/history can compact but must keep actionable evidence and exclusive commitments.

At 1366x768, show known claims/evidence beside a selected scoped offer, with confidence, provenance and actual audience; at 1600x1000 show contradictions/delivered accounts alongside it. Mobile deferred. Future gates, all NOT RUN: same original secret across reload; no truth from preview/price/accessibility metadata; independent versus circular sources; intercepted versus delivered message; protected versus public audiences; false allegation versus truth; invalid/stale trade and failed write; physical evidence versus information copies; NPC discovery of one visible player clue with no uninformed propagation; exact Save/reload/Export/literal Import before and after trade/use/protection. [REPORT](REPORT.md#future-acceptance-gates) applies.
