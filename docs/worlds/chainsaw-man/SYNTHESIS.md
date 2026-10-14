# Chainsaw Man world pack synthesis (M5)

Status: research synthesis and authoring proposals, 2026-10-13. Weibao ranked anime worlds canon-first and requested this reading be turned into a usable world pack. This folder is not accepted gameplay, a complete canon audit, or runtime implementation.

## 1. Sources, labels and prior work

**Primary input:** local paraphrased notes from [CSM full-dump reader](../../research/power-systems/wiki-digests/full-dumps/workers/csm-full/SUMMARY.md), 207 paired notes (204 frozen-manifest entries plus three restored full concept pages), based on Chainsaw Man Wiki revisions up to 2023-11-27, including early Part 2. Only material after that cutoff is outside this snapshot. Private payloads were spot-checked under `~/.codex/research/wikis/chainsaw-man.fandom.com/dump/`. The notes are git-ignored; no raw prose is copied here.

**Earlier work:** [wiki digest](../../research/power-systems/wiki-digests/DIGEST_chainsaw-man.md) was `blocked_no_revision` and its mappings were explicitly unverified. This synthesis upgrades mechanics coverage using the later offline snapshot, but does not authenticate canon. The eight-owner shape follows [Bleach](../bleach/WORLD_BRIEF.md) and the shared [campaign framework](../CAMPAIGN_FRAMEWORK.md). Starts/AUs follow [priority canon and AU](../world-depth-2026-10-13/08_PRIORITY_CANON_AND_AU.md), [more book worlds](../world-depth-2026-10-13/09_MORE_BOOK_WORLDS_CANON_AND_AU.md), [access and starts](../world-depth-2026-10-13/11_ACCESS_AND_STARTS.md), [priority world starts](../world-depth-2026-10-13/12_PRIORITY_WORLD_STARTS.md), and [sealed secrets](../WORLD_SECRETS_AND_DISCOVERY.md).

**Labels:** “Wiki says” identifies a dated secondary assertion; **Proposal** marks YAIRPG design. Conflicts remain unresolved. Post-cutoff Part 2 is a gap, not filled from memory.

**Skill note:** `source-deep-dive` was not present in the available skill catalog or local skill folders. This synthesis follows `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md`, especially M5 and its checklist.

## 2. Rules an engine should model

| Rule | Evidence | Proposed engine shape |
|---|---|---|
| Fear is concept-linked and population-level; public love or admiration can weaken a Devil | “Devil” rev25098 | Devil identity + changing public fear and regard states; no character XP proxy |
| Ordinary Devil death and concept erasure are distinct | “Devil” rev25098; “Pochita” rev25186 | Separate death transition, Earth/Hell reincarnation and erasure outcome |
| Primal Fear Devils have never experienced ordinary death/rebirth and retain identity | “Devil” rev25098, direct payload check | Record has-never-died history and very high durability; death outcome remains unknown |
| Blood can heal, fuel or enhance, but conditions differ | “Devil” rev25098; “Fiend” rev24028; “Hybrid” rev25122 | Typed blood or flesh source, amount, vitality and consumer effect; Devil strength boost is reported for living-Devil blood/flesh, with an unconditioned boost bullet also present |
| Contracts are specific bargains between eligible parties | “Contract” rev25006; “Devil” rev25098 | Human/Devil pair, terms, eligible sacrifice, proxy, trigger, use, status and exit; Fiends cannot contract and Devils cannot contract with Devils |
| Fiend possession and Hybrid fusion are different body states | “Fiend” rev24028; “Hybrid” rev25122 | Corpse possession versus fused heart/human consciousness; reversion, recovery and individual traits/triggers remain distinct |
| Exceptional body recovery and reversion are actor-specific | “Fiend” rev24028; “Hybrid” rev25122 | Preserve Power's possibly unique return to Devil state and Hybrid trigger/heart recovery cases without making them universal |
| Devil ability costs and persistence vary by actor | “Devil” rev25098 | Track own-blood costs and reported death-termination per ability; do not generalize to every Devil |
| Fragmentation may delay reincarnation; erasure affects history and exceptional memory | “Devil” rev25098 | Track uncertain fragment/core status and separate world history from Horsemen-level faint memories |
| Institutional access differs by role | “Devil Hunter” rev24927; “Devil Hunter Club” rev23133 | Affiliation-specific jobs, reports, equipment and authority; only hunters may legally contract or carry guns in Japan, per the wiki |
| Ability conditions and actors are not interchangeable | E.g. “Makima” rev25174, “Yoru” rev25176, “Stone Devil” rev23741 | Store actor, trigger, target, costs and counter individually; reject P2/P3 note failure modes |
| Occurrence, belief, report and revelation differ | “Timeline” rev24952; history/arc entries | Actual event ledger plus per-observer knowledge and confidence |

Core checks: I opened the private “Devil” rev25098, “Contract” rev25006, “Fiend” rev24028, “Hybrid” rev25122, and “Devil Hunter” rev24927 selected payloads directly. Primal Fear Devils are described as never having died, not as unable to die. The Devil page gives both a living-Devil source condition for a flesh/blood boost and a broader unconditioned flesh-boost bullet. Contract eligibility, sacrifice rules, and Japan's hunter-only legal access are stated on the selected pages. The Fiend and Hybrid payloads support their specific recovery examples; Devil supports blood-paid abilities, death termination, hedged fragment persistence and exceptional erased-concept memory. Conditions are not inferred from the digest alone.

## 3. Catalog at a glance

| Family | Coverage | Neighbor systems | Main conflict or boundary |
|---|---|---|---|
| Devil concepts/lifecycle | Core concept, fear, blood, Earth/Hell transition, primal exception | media, public fear, death, identity | Concept erasure versus ordinary killing is sometimes conflated |
| Contracts | Summons, objects, lasting access, per-use prices, transformation/transport cases | bodies, payments, institution, knowledge | Contradictory Four Horsemen Fiend-contract claim; exact terms need manga checks |
| Bodies | Human, Devil, Fiend, Hybrid, contract transformation | blood, memory, trigger, durability | Individual exceptions do not define species rules |
| Devils and abilities | Conditional character and entity abilities across retained pages | contracts, host state, counters | Source claims vary by page; cite each revision |
| Institutions | Public Safety, private hunters, school, Church | access, jobs, media, reports | Broad legality/procedure is summarized, not fully specified |
| Setting and events | Earth/Japan, Hell, arcs and timeline | travel, chronology, witness knowledge | Timeline says 1984 while World says 1983 for first Gun attack |

Coverage proof and retained conflicts are in worker [SUMMARY](../../research/power-systems/wiki-digests/full-dumps/workers/csm-full/SUMMARY.md), [ERRATA](../../research/power-systems/wiki-digests/full-dumps/workers/csm-full/ERRATA.md) and [SOURCE_LEDGER](SOURCE_LEDGER.md). Character entries include selected mechanic-bearing spans, not whole original articles.

## 4. Data model (proposal)

Proposed world package records: `world`, `continuity`, `era`, `region`, `entryProfile`, `scenario`, `actor`, `bodyProfile`, `devilConcept`, `fearState`, `bloodResource`, `contractOffer`, `contractState`, `abilityDefinition`, `incident`, `evidence`, `belief`, `institutionAccess`, `failurePolicy`, `transferPolicy`. A record should point to source title/revision and evidence label. An actor's actual state, another actor's belief, public fear and player knowledge are separate. Contract state records eligible sacrifice categories (own body parts, senses, lifespan, legal children or people under legal responsibility), eligibility, incapacitation, proxy delivery, distance, believed counterparty identity, and whether both sides met the terms. Unrelated people are not eligible sacrifices; incapacitation and proxy delivery do not themselves establish eligibility. Unknowns remain null/unknown; contradictory revisions remain alternative evidence rows.

## 5. How rules turn into play (proposal)

Fear becomes a slow public-state consequence of incidents, news and reputation, not a local training bar. Blood is owned by an actor and its source vitality matters. Contracts open access after informed acceptance and exact payment; refusals preserve the ordinary route. Fiends, Hybrids and ordinary humans get different valid actions because their bodies and eligibility differ. Institutions supply work, contacts, legal access and reports. Evidence can be purchased, witnessed or researched, but never grants unearned perception. Compatible YAIRPG jobs, relationships, knowledge, resources, sites and durable receipts can host these loops only after the selected runtime consumer is inspected. This is design mapping, not engine-support evidence.

## 6. Living beside the protagonist (start proposals)

No separate fanfic survey (M3) was run. These starts are informed by existing world-depth start routes, not external fan consensus:

| Start proposal | Mechanic needed | Pitfall |
|---|---|---|
| Civilian near incident | paid support, witnesses, evacuation and local knowledge | no automatic contract or protagonist history |
| Public Safety support/recruit | assignment, supervisor, reports and benefits | agency title is not universal combat rank |
| Private hunter/student | informal lead, limited resources, peer trust | avoid flattening legal differences |
| Devil/Fiend/Hybrid profile | exact body and eligibility | cannot randomize a changed truth without sealed slot and route |
| Divergence AU | separate instance and cause history | do not overwrite canon save or force events back into place |

## 7. More to consider (proposals)

1. Audit manga chapters for exact contract breach, cancellation and sacrifice rules before freezing a reusable contract schema.
2. Audit every ability row with an actor-condition checklist; the spotcheck found dropped conditions and incorrect “unknowns.”
3. Keep timeline occurrence separate from article date, revelation and character belief.
4. Decide how slow population fear changes become playable without turning public attention into a grind meter.
5. Later Part 2 after 2023-11-27 requires a new source acquisition and separate dated evidence pass; early Part 2 is included in this snapshot.

## 8. First playable slice (proposal)

Proposed first slice: one bounded human–Devil contract offer, with inspect/ask/refuse/accept and one eligible use after acceptance. Show exact known price, actor, trigger and limits. Refusal has no supernatural penalty. Acceptance pays once; use pays only the explicitly sourced recurring amount. A fresh desktop browser origin should show both paths, then save/reload/import should preserve the contract state and prevent duplicate payment. Keep combat, generated contracts, Hell travel, terminal death and randomized truths out of this first slice. The [implementation packet](IMPLEMENTATION_PACKET.md) spells out the future gate; it is not an implementation authorization or test result.

## 9. Gaps that would change the design

- **Primary manga source check:** exact wording could alter the contract-party, penalty, payment, exit and use model. The wiki already states sacrifice eligibility and proxy rules, so this is a verification gap rather than an absence of a usable secondary model.
- **Post-cutoff Part 2:** later developments could change current institutions, character status, ability conditions, or available starts. Leave those as gaps until sourced.
- **Chronology:** 1983/1984 conflict changes any date-pinned timeline or incident start.
- **Contract exception conflicts:** Fiend contract claims in “Four Horsemen” rev25233 could indicate source error, a unique exception or changed interpretation; do not implement until adjudicated.
- **Control/Doll/Falling conflicts:** target perception, redirection scope, network conversion and durability affect valid counters and risk.
- **Primary-source attribution:** wiki summaries can merge manga chapters and interpretation; exact chapter evidence may change canon labels and actor/condition assignments.

## Reading record and checklist

**Read in full:** The reader lane reports full reading of all retained selected payloads: 204 manifest entries plus three restored pages (“Devil,” “Fiend,” “Hybrid”), 1,023,140 selected characters over 348 contiguous chunks. This means full retained payloads, not every complete original wiki article. Restored core payloads were read directly by this author for the laws above.

**Read by search/targeted lookup for synthesis:** All 207 notes were indexed by title/revision; mechanism-bearing rows were reviewed by their source facts and assertions. Direct payload spot-checks were made for Devil, Contract, Fiend, Hybrid, and targeted core-law terms. Other cited pages were used from their paraphrased note claims and were not individually reopened in full during synthesis. No primary manga was read in this pass. No M3 survey ran.

**Checklist:** core laws checked directly with locators above; surprising/spotcheck claims repaired or retained as conflicts; reader files already exist beside the synthesis inputs but remain git-ignored; this tracked pack contains paraphrases, no raw prose and no quote above 15 words; primary canon, exact terms, later Part 2, chronology and listed conflicts remain open. No gameplay or runtime verification was attempted.
