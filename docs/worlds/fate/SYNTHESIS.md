# Fate / TYPE-MOON world-pack synthesis

Status: **M5 Develop/Research proposal, 2026-10-15.** Research and proposals do not accept a design, authenticate canon, implement gameplay, or establish human acceptance. The eight linked owners form a new world pack. Each design row is a proposal unless labeled as source evidence or an unresolved question.

## 1. Sources, labels, and earlier work

**Labels:** `W` is a dated Type-Moon Wiki assertion; `R` is a reader-note paraphrase; `I` marks cross-page synthesis or authoring principles, not a direct wiki law; `I` is an inference; `O` is a YAIRPG proposal; `U` is unknown or unresolved. Source facts cite page title and revision in the [source ledger](SOURCE_LEDGER.md); every proposed engine shape and behavior remains `O`.

**Read by the source-reader lanes:** the initial `fate-full` checkpoint reports 33 completed pages and 735,773 selected characters. Shard A reports 993 completed selected payloads / 15,585,170 characters; shard B reports 1,481 / 15,576,638; shard C reports 3,864 retained inputs / 15,566,907 and adjudication of all 21 no-input manifest rows. The three shard summaries report contiguous bounded reads, revision/hash/length reconciliation, zero pending retained inputs, and unresolved nested transclusions. This is full reading of assigned retained selections, not whole wiki articles, every nested source, or primary TYPE-MOON works. Reader notes and summaries remain in the existing gitignored `docs/research/power-systems/wiki-digests/full-dumps/workers/fate-full/` tree and are linked from the ledger; raw/private text remains outside tracked files.

**This synthesis author read:** `AGENTS.md` and the live project summary; the source deep-dive playbook's M5 outline and checklist; all four input `NOTES.jsonl` files by targeted inspection and searches; all three shard summaries and the base checkpoint; `DIGEST_fate-series.md`; the archived index/source manifests by metadata query; the specified campaign framework, completion template, secret standard, world-depth overview and relevant access/start/route proposals; and all nine Bleach pack files as the layout and evidence-boundary example. The synthesis author did **not** read the 6,371 private payloads in full. A local search for the named `source-deep-dive` skill did not find it in the available skill catalog or skill directories, so this pass used the requested project playbook directly.

**Private payload spot checks by this author:** Magic Circuit r395092; Master r398975; Command Spell r404906; Servant r405040; Fate/Zero r405726. The checked text supported the bounded distinctions recorded in [SOURCE_LEDGER](SOURCE_LEDGER.md). These remain wiki claims, not primary-source authentication.

**Earlier work and design context:** `DIGEST_fate-series.md` contains bounded revision review DF1–DF3, while its earlier E8 table is explicitly unverified. Existing proposals `QBK4`, `QW10`, and `QBW10` in `world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md` cover event-graph branching, the Grail War/Church referee idea, and stay night route boundaries with hollow ataraxia separately scoped. The pack follows the [campaign framework](../CAMPAIGN_FRAMEWORK.md), [world completion template](../templates/WORLD_COMPLETION_TEMPLATE.md), [sealed-secret standard](../WORLD_SECRETS_AND_DISCOVERY.md), and the standing [canon-first priority](../../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13). Entry access and AU selection remain subject to shared start/continuity owners; this pack does not create runtime selectors.

## 2. Rules an engine would need to model

| Rule | Evidence | Proposed engine shape |
|---|---|---|
| `W` Eligibility and execution source are distinct. | Magic Circuit r395092 describes circuits, Foundation access, formulas, energy and activation in separate parts of the mechanism. | `O`: keep actor eligibility, circuit profile, Foundation, formula, method, fuel and activation as separate checks and state. |
| `W` Master status, contract, charges and energy supply have distinct conditions. | Master r398975 describes retained Master status after Servant loss while a Command Spell remains, and a possible new pact with an unclaimed Servant; it also discusses Magical Paths and system-specific capacity. | `O`: separate status, active contract, living instance, charges, supplier, path, reserve, rate, interruption and recipient response. |
| `W` Command Spells carry distinct authority/charges and can also supply magical energy in specific uses. | Command Spell r404906 describes distinct charges and says they can reinforce a Servant; Master r398975 distinguishes authority from supply paths. | `O`: model authority, charge and ongoing supply separately; represent target, channel, scope, action, resistance and relation. No unconditional success. |
| `W` Source record, vessel and summoned instance are not one object. | Servant r405040. Chaldea Saint Graph storage is a local exception that can preserve memories after resummoning under circumstances. | `O`: link a versioned instance to its source record, selected class vessel, contract, support, active kit, anchor and continuity-specific memory policy. |
| `I` The same broad ritual family has branch-specific architectures. | Master r398975 and notes for Fuyuki, Moon Cell and Chaldea; Zero r405726 is separate from stay night. | `O`: every continuity entry chooses a rules profile; forbid silent cross-profile inheritance. |
| `I` Ability effects require their actual carriers, triggers, costs, targets and counters. | Noble Phantasm r402465 and character-specific notes; shard summaries record many scope exceptions. | `O`: author one evidence-backed ability record per relevant variant. Unknown means unknown; do not infer from rank or analogy. |
| `I` Identity can span body, soul, memory, record, vessel and contract. | Servant r405040, Master r398975, Tsukihime r347154, and selected FGO entries. | `O`: separate actor identity and carrier state; each restoration/transfer route names its actual conditions and persistence. |
| `I` A witnessed event is not the same as a report, belief, or author truth. | Master r398975 and character/event notes with explicitly different observers and explanations. | `O`: store observation, medium, time, recipient, confidence, belief and underlying event separately. |
| `I` Loops, simulations, Singularity histories, Lostbelts and parallel worlds differ. | Timeline r405727; FGO Crisis Facing the Human Order r405666; Urd and Lostbelt Zero notes. | `O`: select one causal model with its own travel, observation, pruning, correction and record-retention rules. No universal fate system. |
| `W` Original and remake Tsukihime mechanics are not interchangeable by name. | Dead Apostle r400369; Dead Apostle/Remake r404590; The Twenty-seven Dead Apostle Ancestors/Remake r404706. | `O`: version-pin people, taxonomy and ability records; require remake evidence before porting an original claim. |
| `I` Costs and limits vary per form and story. | Magic Circuit r395092 describes irreversible circuit damage; Servant r405040 describes instance upkeep. Shards A–C report other compatibility, preparation, supply, counter and contradiction cases. | `O`: store cost and consequence per source-qualified method; never substitute a global mana or rank formula. |

## 3. Full catalog at a glance

The [module catalogue](MODULE_CATALOGUE.md) holds 18 proposed state families. Coverage is broad but intentionally not exhaustive.

| Catalog area | Coverage | Neighbors and conflicts | Remaining gap |
|---|---|---|---|
| Magus, circuits, Foundations, formulas | Detailed conceptual mechanics; no accepted numbers. | Circuit vs fuel vs formula vs tool; damage and rare exceptions. | Primary source cases and exact operation limits. |
| Master, command, contracts, supply | Strong bounded Fuyuki core in digest DF1–DF3 and Master r398975. | Formal authority vs energy vs consent vs affection. | Primary route checks and exact charge/consequence cases. |
| Summoning, class, Heroic Spirits, NPs | Large selected wiki corpus and version records. | Record vs class vessel vs instance; lore vs gameplay; true name vs combat. | Design-relevant roster census, primary citations, missing transclusions. |
| Familiars, Mystic Codes, tools, constructs | Many independent examples, with different autonomy and channels. | Owner vs operator vs sensor; construct vs familiar vs Servant. | Exact range, upkeep and native interaction cases. |
| FGO systems, events, Singularities, Lostbelts | Extensive lane reading across many selected pages. | Simulation vs retained past vs pruning vs reported theory; in-page timeline conflicts. | Primary chapter checks for whichever event is selected. |
| EXTRA / Moon Cell | Contract and digital-contest architecture distinct from Fuyuki. | Master identity vs avatar/body; local system authority. | Primary game text and Record/CCC edition choice. |
| Tsukihime / Melty Blood / KNK / Mahoyo | Separate candidate entries with selected character/system claims. | Original/remake, Shiki identities, body personalities, Root speculation. | Primary edition/route checks and a selected playable scope. |
| Apocrypha / Strange Fake / Prototype / Prisma / GUDAGUDA / others | Named entries and numerous character/system pages. | Alternate-root, event, manga, gameplay and collaboration branches. | Exact per-entry source/version coverage before a campaign claim. |

## 4. Proposed data model

```text
WorldFamily(workFamily, attribution, packRevision)
Continuity(continuityId, work, edition, branch, sourceBoundary)
Era(eraId, continuityId, civilTime, sceneOrdinal, institutions, castSnapshot)
Instance(instanceId, continuityId, causes, actors, sites, claims, rngState)
Actor(identityId, bodyId, soulId, memorySet, knowledgeSet, affiliations)
PowerSource(sourceId, owner, carrier, sourceKind, provenance, integrity, jurisdiction)
Method(methodId, actor, eligibility, foundation, formula, trigger, target, cost, counter)
Contract(contractId, parties, authority, supplyPath, scope, obligations, relation, exit)
Manifestation(instanceId, recordId, vessel, class, activeKit, anchor, upkeep, return)
Observation(observer, target, signal, medium, time, confidence, recipient, belief)
Event(eventId, cause, participants, occurrence, witnesses, branchEffects, aftermath)
Artifact(itemId, owner, holder, operator, interface, charge, condition, compatibleUse)
SecretSlot(slotId, chosenId, discoveryRoute, knowledgeStage, persistence)
```

All types and fields are `O` authoring proposals, not current save types or APIs. A field is added only when the selected continuity needs it and an existing single owner cannot represent it. A secret slot's truth is kept outside ordinary summaries and UI until its route.

## 5. How each rule turns into play

| Proposed play | Existing YAIRPG seam | Proposal and missing binding |
|---|---|---|
| Pay for work, qualified research or service in a workshop. | Jobs, costs, participants, inventory/custody, knowledge and site projects. | `O`: choose one small authored branch; prove one unique settlement and truthful report. Independent world-instance binding is unresolved. |
| Learn a specific formula or tool use. | Existing skill/power, training, item and job concepts. | `O`: add source-qualified eligibility and effect consumer only after primary source selection. No source-specific Type-Moon implementation is inspected here. |
| Form, use or refuse a contract. | Contracts, people, events, durable publication and current nonlethal encounter seams. | `O`: authority, energy, consent, relationship and response need one atomic effect owner and clear persistence. |
| Investigate with a familiar or sensor. | Observation, knowledge/report, items and people. | `O`: preserve the sensor's real signal path, operator, delivery and lost/unavailable data. Do not project camera view as player perception. |
| Change a canon-adjacent event. | Occurrence/causal events, branch proposals and world-instance plan. | `O`: pin continuity, author conditions and observer state; recheck downstream events only in that branch. No historical rollback without an explicit profile. |
| Visit another TYPE-MOON work. | Expansion transition, carried methods/sources, custody, companions and world domains. | `O`: choose compatible combination and bind distinct continuity/instance state. Current docs note that this binding and absence clock are missing. |

Source inspection, a pack, or setup alone cannot demonstrate gameplay. The [implementation packet](IMPLEMENTATION_PACKET.md) is a future proposal that needs fresh owner review before code changes.

## 6. Living beside protagonists: start/AU/access proposals

No M3 fan-premise survey ran. The listed options are local proposals, not fan consensus or accepted starts.

| Proposal | Entry shape | Continuity / access / pitfall |
|---|---|---|
| `O` Fuyuki local civilian, shop worker or workshop aide | Ordinary daily work with a bounded investigation or service. | Choose one stay night route branch and era; don't grant Master status, magecraft sight or route knowledge by menu label. |
| `O` Eligible magus apprentice | A real training, formula, teacher and resource route. | Select one household and source profile; a fictional lineage or circuit profile needs explicit authorship and stays a proposal. |
| `O` Fuyuki Master candidate | A source-bounded route into one named war. | Eligibility and summon are not guaranteed; authority, supply and heroic instance remain separate. |
| `O` Zero-era role | Household, proxy or independent worker in a 1994 snapshot. | Separate Zero's branch from stay night; do not preload exact future 2004 outcomes into this instance. |
| `O` EXTRA digital participant | Moon Cell system participant with local body/avatar and contract rules. | Requires explicit transition into the EXTRA continuity; Fuyuki ritual mechanics do not follow. |
| `O` Chaldea staff / mission participant | Institution-led operation with actual team and supply. | Select exact singularity/Lostbelt/event; no franchise-wide roster or automatic return/resurrection. |
| `O` Tsukihime original or remake night-side role | Household, Church or investigation start with version-specific body and knowledge. | Select edition and route; original 27-ancestor structure does not establish remake law. |
| `O` Historical route, AU, loop or alternate truth | Compatible new branch or source-authorized local loop. | Existing `QBK4` and `QBW10` propose route-local event graphs; no global frontier or rewind. Changed/randomized truth is sealed by ID and route only. |
| `O` Other work entries | Apocrypha, strange Fake, Prototype, Prisma, Mahoyo, KNK, Melty Blood, GUDAGUDA/Redline, DDD, Fire Girl and selected FGO subworlds. | Keep each work, version and event local. Access is an authored route, not proof of a universal portal. |

## 7. More to consider

1. `O`: The pack can expose separate panels for identity, energy, authority, active manifestations, obligations and what the character knows. One combined “power” score would hide important causes.
2. `O`: NPC behavior should reflect actual motives and means. A Servant is a person/counterparty with independent goals, not an obedient menu attachment.
3. `O`: Institution names must point to specific duties, access, supply and jurisdiction in one era. A title is not a permission to use every affiliated power.
4. `O`: Build route branches as a base continuity plus declared divergence patches; do not multiply every character by every route/edition.
5. `O`: Keep public franchise twists available as reference. Only changed/randomized facts use sealed IDs, and those references state the route and status without the truth.
6. `O`: A future M3 fan survey is useful only if a concrete start-choice decision depends on common fan-premise patterns; it is not a gate for this source synthesis.

## 8. First playable slice proposal

**`O` One bounded contract: authority, supply and agreement.** After a primary-source check selects one *Fate/stay night* edition and route, author an original small noncombat service between two new local actors in that route's compatible period. Show one finite authority resource, a separate energy account, an executable narrow request, the counterparty's capability and willingness, and an alternative funded/cooperative route. Include an interruption, a broad request, a shortage, refusal and one decline path. The action log shows what this actor observed; it never states hidden author truth as known fact. The local service is original fan continuity inside the selected source branch, not a canon event.

This tests the core distinction with a low-cost authoring slice inside one selected canon branch before a source-character campaign or world binding. Use desktop/laptop as the intended play viewport; the visible result is a compact contract panel, separate resource/authority displays and an event log with the actual reply. Mobile optimization is deferred. No new combat system, route merger, Servant roster, FGO-scale support, sealed secret, timeline rewrite or prestige behavior belongs in this first slice.

**Later native gate:** an authorized implementer first identifies live owner/state/effect writers and compatibility implications. A rebuilt fresh-origin desktop browser run then exercises narrow request, funded route, refusal, shortage, interrupted delivery and repeated submission. If state changes, save/reload/export/literal import must preserve each resource and settle once. This synthesis performed none of those gameplay/build/save checks; director play acceptance remains open.

## 9. Gaps that would change the design

| Gap | Why it could change the design | Next bounded check |
|---|---|---|
| Primary Fuyuki command, supply and summon procedure | Could change eligibility, command authority, cost, resistance, timing and what outcomes are fair. | Choose a specific stay night route/game edition and inspect the source scenes cited by Command Spell r404906, Master r398975 and Servant r405040. |
| Primary circuit/Foundation operation limits | Could change whether a magus training/work loop is viable and what the actor may execute. | Check the cited stay night and other selected primary scenes for the exact formulas selected for play. |
| Route identity and event timing | Could change who is present, what can be known and whether a divergence is coherent. | Pin one edition/route and verify only the required events/cast. |
| Zero-to-stay night continuity use | Could change any proposal that treats both wars as one history. | Keep the wiki's explicit parallel-world statement until a later primary-source choice supplies the branch contract. |
| Moon Cell and Chaldea architecture | Could change identity/body, supply, contract limit, restoration and mission consequences. | Directly inspect one selected EXTRA version or FGO operation before authoring its playable slice. |
| FGO pruning, Singularities, Lostbelts, Urd and restoration | Contradictory statements and attributed theories could change travel, observation, return and persistent-history rules. | Select a concrete scenario and check the primary chapter/movie/game text for only the mechanic that scenario needs. |
| Original/remake Tsukihime taxonomy and recovery | Could change body eligibility, vampire maintenance, institutions and death/revival handling. | Choose an edition/route and verify exact primary scenes; do not port original Dead Apostle r400369 wholesale. |
| Missing nested transclusions and sparse/empty pages | Could supply or alter the alleged rule, while absence does not establish a limitation. | Resolve only transclusions that support an active design decision; selected readers report hundreds unresolved. |
| Contradictory ranks, parameters, versions and gameplay/lore fields | Could change capability, counter and UI estimates. | Keep both source claims and source type; primary evidence for the exact actor/form is required before numeric calibration. |
| Complete source roster and media coverage | Could reveal omitted variants or make a supposedly generic mechanic local. | Build a bounded roster only after a real playable work and actor set are selected. |
| M3 fan-premise patterns | Could change the best protagonist-adjacent opening, but does not block source synthesis. | Run the playbook's bounded survey only if start-selection needs it. |
| Native continuity/instance/persistence binding | Could change whether routes, parallel worlds and returns can safely share state. | Integrator review of current engine owners and an explicit compatibility decision before implementation. |

No unresolved source issue blocks this design synthesis. Each listed unknown remains open and changes only the matching proposal when checked.
