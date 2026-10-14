# Nonhuman society, law and economy, 2026-10-14

Status: **research and INFERRED proposals**, not accepted decisions, implemented
starts or gameplay proof. SOCIETY lane under [COMMON](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md).
Only this report and the [checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/society/CHECKPOINT.md)
belong to this lane. Source reads describe definitions, not exercised behavior.

**STATED (Weibao through live owners):** retain canon-first priorities, now
including Reincarnation Paradise, one realm/one prestige layer for the first
milestone, useful meals and no hunger death, desktop/laptop first and mobile
deferred. [PROJECT](../../PROJECT.md) and [USER_VISION](../USER_VISION.md) own
accepted direction. This report neither selects a first start nor authorizes implementation.

**Evidence:** SHOWN is inspected code or a dossier's located scene, explicitly
distinguished below. STATED names an official companion, rulebook, secondary
summary or design owner. INFERRED covers all proposed mechanics, palettes,
examples, defaults and dials. UNKNOWN means the inspected evidence does not
resolve the claim. No outside-text MEMORY claim establishes a world law here.
No raw novel prose or sealed world file was read or reproduced.

## 1. Existing seams and lane boundaries

**STATED (design owners):** [requirements](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md)
M3/M4/M6, N4/N5/N7/N13/N14/N17/N18/N22/N23 motivate this lane; all rounds N1-N23
were read. [Foundations](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md) U06/U08/X01
separate truth, evidence, relationships and recognition; X04/X08 separate reach,
permission and adjudication. [Rivals/identity](../RIVALS_IDENTITIES_AND_FATE.md#what-chosen-and-identity-actually-mean)
keeps stable identity, disguise, credentials, reputation, body and soul apart.
Its branching-conflict rule requires a report, interested actor and means before
escalation, rather than automatic retaliation.

| Code | SHOWN from this lane's reads | Implication, INFERRED |
|---|---|---|
| F1 | `src/exchange.js:5-10` checks clerk willingness, actual loan owner/holder and player stock. Line 7 defaults absent hands to two and requires two usable hands. | Custody and access have usable seams; bodily eligibility needs engine E2, with a different nonhuman work method or actual helper. This check does not itself prohibit every trade command. |
| F2 | `src/exchange_content.js:25-43` reserves two clerk coins, sells blanks for one/three coins, loans/returns a gauge, settles once and gives a directed trust effect on delivery. | A finite agreement can distinguish purchased stock, borrowed tools, promised payment and earned trust. It is not a slavery, body lease or legal-personhood implementation. |
| F3 | `src/exchange_content.js:9,40,44-46` records attributed knowledge, the clerk's own receipt/test and later report. `src/exchange.js:19` displays player's known details/basis. | Reuse evidence-bearing receipts and testimony. Existing exchanges do not implement arbitrary rumor networks. |
| F4 | `src/models/hero.js:30-36` initializes Village/Slums/Town reputation and one money balance; `src/reputation.js:5-13` adds integer regional totals. | Regional goodwill is an existing compatibility summary, not personal fear, legal rights or identity-specific memory. |
| F5 | `src/components/trader_component.js:141-145` combines Haggling, regional reputation and accessory adjustment in merchant margin. `src/trade.js:77-98,483-487` quotes actual stock/purse/market/margin, rechecks price and commits. | Body-specific service quotes should preserve stale-quote review and actual payment. No body-size tariff or agent purse is established here. |
| F6 | `src/data/locations.js:349-373,378-393` names cow, cat, rats, bird and timed rumor chatter; lists elder/guard/craftsman/trader and craft tiers. | Village has household, pest and rumor texture; this ambient text proves no legal code, personhood test or propagating witness system. |
| F7 | `src/data/locations.js:470-500` defines wolf-rat enemies and Village reputation rewards at clear milestones. | Rewards currently summarize game outcomes; they do not show who witnessed a player beast's work or whether reputation follows a disguise. |
| F8 | `src/data/dialogues.js:73-94,163-180` unlocks field/training, gear choices, trader and fieldwork through elder dialogue. `src/data/locations.js:396-403` initially locks Shack housing. | Proposed nonhuman service routes need supported opening access. Do not claim the trader, housing or human speech is available at creation. |
| F9 | `src/data/locations.js:2553-2583,2644-2667` has a 15-minute missing-delivery search and an Animal handling 8 horse solution. | A nonhuman grain errand can reuse this setting, but a new scent/negotiation method is new content. The horse's scripted obedience is not a general consent system. |

**Sibling ownership, STATED:** [ENGINE_SPEC](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md)
F/B corrections, T1/T7 and S1-S12 own anatomy/query/save planning. Do not infer
law from its `ownerId` or add a second body authority. [PLAY](NONHUMAN_STARTS_PLAY_2026-10-14.md)
BK1-BK15 own body loops; NP4/NP8/NP9, NT3/NT5 and ND1/ND2/ND8 already cover
local recognition, custody, economy and darker premise choices. This report
specifies the social/economic joins rather than another body-play catalog.
[MECHANICS](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) TM3/TM6/TM7,
NM4/NM6/NM7/NM8/NM10/NM12 own naming, societies, hidden identity, productive
organs and hosts. [BY_WORLD](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) W01-W16
and NX4/NX6 own species/source comparisons. World examples below retain its
source limits. Late siblings were read and reconciled before closure:
[TRANSFORMATION](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md)
TF9/TF12 and TX4/TX11 own control leases, return and recognition continuity;
[SENSES_SCALE_AND_UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md)
SU5/SU7/SU9 own qualified reach, custody display and known agreement terms.
This lane adds no parallel perception or transformation record.
[Paradise beings](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md)
BC3/BC7, BR2, BS5 and PL1/PL3 qualify loyalty, commerce, worker standing,
household life and issued-body/crossing proposals. BC3's actor-specific fixed
loyalty must remain fixed when that actor is adapted; agency and commerce do
not require invented betrayal or a compulsory bond grind. BR2's Reed worker
transfer does not establish general nonhuman Contractor intake; PL1 issued
vessels remain proposals. BC7 gives a located noncombat earning precedent
(L5 sid1720 p1-23/29-47, sid1724 p15-27), not universal hub citizenship.

## 2. Legal and social status palettes

**INFERRED default:** status is a set of jurisdiction-specific claims and rights,
not a single moral or biological enum. **Dial:** canon law, a selected era's reform,
customary protection, contested claims, or explicit AU. **Reasonably per world:**
social affection, institutional classification, actual autonomy and enforceable
rights can disagree. A helpful household animal need not be declared a citizen
before it can play; a citizen need not be liked. The same being can be worshipped
in a grove, registered as an artifact elsewhere and under a service contract at home.

| Code / status | What it could change | Default + dial + reasonable routes, INFERRED |
|---|---|---|
| LP1 Person | Own earnings, make agreements, testify, seek remedies, travel where admitted | Local rights specified individually. Dial equal citizen, foreign person, minor/dependent or excluded person. Being unable to speak does not mechanically prove lack of mind. |
| LP2 Property | Someone asserts transferable title to object/body, salvage or seizure rights | Record claimant and basis. Dial uncontested local law, disputed title or prohibited ownership. Custody transfer does not itself grant control of the mind. |
| LP3 Livestock | Household registration, sale/inheritance, work/produce, tending obligations | Ordinary animal premise or recognized sentient livestock. Dial farm member, breeding stock, protected dependent or emancipation. Productivity and treatment follow real actors, not free caretaker labor. |
| LP4 Monster | Hunting permits, exclusion, bounties, containment or negotiation | Apply only the local classification/action rule. Dial hostile policy, tolerated resident, treaty ally or recognized people. A label need not imply actual danger or compulsory attack. |
| LP5 Protected being | Sanctuary, guardian/steward duty, restrictions on capture/harvest | Protection has a named authority and scope. Dial religious, ecological, civic or household protection. Protection can coexist with limited autonomy; advocacy can seek additional rights. |
| LP6 Contracted servant | Particular duties, pay/support, expiry, refusal and release terms | Voluntary bounded service for original cozy premises. Dial inherited binding, coercive service, purchased contract or equal partnership when sourced/selected. Contract does not imply affection. |
| LP7 Deity | Offerings, temple claims, sanctuary, delegated authority or mandate | Recognition by a particular audience. Dial true sourced divinity, local worship, office, avatar or false claim. Worship does not automatically confer ownership of devotees, immunity or universal tax authority. |

### World types and priority examples

All **palette entries** in the third column are INFERRED. The evidence column
reports only bounded lore already checked or locally summarized. Canon-faithful
means the selected source/era supports the specific rule, not that the table
supplies a complete jurisdiction. Species detail stays with BY_WORLD codes.

| World type / owner code | Evidence and locator | Default + dial + reasonably per world |
|---|---|---|
| Original Village, BK1/BK3/BK6/BK10/BK15 | SHOWN source F6-F9; **UNKNOWN** formal species law | Household beast LP3/LP5, strange blade LP2, demonstrated mind LP1 claim. Dial curious village, wary guard, sponsor or recognized local resident. No mandatory beast persecution. |
| Wizarding institutions, W01 | **STATED (official companion):** house-elves are magically bound, commonly unpaid, classified as Beings, and freed through a master's clothing gift; Dobby can resist painfully. [House-elf](https://www.harrypotter.com/fact-file/creatures/house-elf), description/MOM classification. **STATED (BY_WORLD W01):** Kreacher inheritance and goblin maker claims; its linked official features/encyclopedia are the locators, not a fresh novel read here. | LP6 can coexist with LP2 and a sentient Being classification. Free worker LP1 claim; goblin maker/customer title dispute. Dial bound/free/reformed AU. Do not promise every protective law or Hogwarts admission from sentience alone. |
| Tabletop settings, W02 | **STATED (official 2024 rules):** sentient items have personality, limited senses and their own activated-property decisions; conflicts with bearers are supported. [Magic Items](https://www.dndbeyond.com/sources/dnd/br-2024/magic-items), Sentient Magic Items/Conflict. **UNKNOWN** civil ownership rules from these mechanics. | LP2 blade with independent will, LP1 nonhuman resident, LP5 sanctuary or LP7 temple entity according to setting. Dial edition/setting/era separately; an Eberron emancipation lead is not a Forgotten Realms law. |
| Military frontier, A Soldier's Life W03 | **STATED (BY_WORLD W03):** sourced monster ecology/body material opportunities; **UNKNOWN** general nonhuman citizenship/emancipation code in its bounded summaries. | LP4 hunted creature or LP5 useful protected being; LP1 claim/LP6 service only when a local institution supports it. Dial original cooperative route or AU recognition. No invented universal slave code. |
| TTKS, W04a-W04e | **STATED (BY_WORLD):** T1 mimics can pass ordinary tests; T4 AIs can refuse/deceive within constraints and estates have owners. W04d T4 R4/R5, members 0078/0095/0117/0129; T1 0041/0044. **UNKNOWN** complete rights for other books. | T1 disguise affects belief; T4 maker/estate title differs from AI intent. Dial recognition/authority separately in each of the five books. Do not merge their worlds or rank ideologies. |
| Telepathic peoples, Mother of Learning W05 | **STATED (BY_WORLD's reviewed summaries):** aranea have distinct webs, silk craft and negotiated access while epilogue human classification denies monster rights. ML WORLD C022-06/C023-01/03, EP02/04/07/08/14/15. | LP1 within a web, LP4 under a human jurisdiction, particular passage agreement without full citizenship. Dial reforms, web affiliation, translator or broker. Rights and negotiated commerce can disagree. |
| Occult institutions, LOTM/COI W06 | **STATED (BY_WORLD):** Church custody/clearance around artifacts, some living/escaping artifacts; LM powers r003 C17; COI 0030/0105. **UNKNOWN** universal artifact cognition/rights. | LP2/LP5 artifact claim, LP1 intelligent being, LP7 specific sourced office/divinity. Dial negotiated use, containment, hidden identity or AU reform. A transferable characteristic is not automatically a person. |
| Apocalyptic summon economies, Shadow Slave W07 | **STATED (BY_WORLD):** Echoes traded in ch505/ch653; fixed replicas/no soul distinguished from personality-bearing growing Shadows (ch106-108, items §2.2). | LP2 Echo custody does not prove enslaved sentient mind. Distinct Shadow bond may need LP6 terms. Dial controller seat or explicitly autonomous Echo AU. Soul absence alone is not a universal cognition test outside this source. |
| Contract hub, Reincarnation Paradise N16-N23 | **SHOWN/STATED via inspected supplied-MTL synthesis:** paid guides/shops/employees PR04 sid26 p22-65, sid27 p1-32; AlchemyMaid ring grants custody while creator lives, §Everyday life paragraph; living ore labor and coercive ownership also summarized there. [FULL_SYNTHESIS](../research/novels/trailblaze-reading/paradise-depth/FULL_SYNTHESIS.md), PR04 and Everyday life. Coverage/translation gaps retained. | Distinguish contractor, employee, companion/pet seat, mission-body occupant and local resident. Dial LP1/LP6 hub agreements and local LP2/LP4/LP5 claims. Hub rank, body power and civil standing stay separate (N20); a mission receipt grants no automatic local emancipation. |
| Secret exorcist institution, JJK W08 | **STATED (BY_WORLD, dated wiki):** Panda has education/personality; headquarters pressure on Yaga differs from public law. Panda r78690 Creation/Body; Cursed Corpse r77902 Usage. | Institution-specific LP1/LP5 recognition for corpse versus LP4 treatment of curses. Dial sponsor, secret cooperation or explicitly recognized peaceful-curse AU. Enrollment is not universal legal equality. |
| Spiritual realms, Bleach W09 | **STATED (BY_WORLD):** blade spirit bond/autonomy differs from sword custody, Zanpakutō r582599; artificial Nemu grounded in official bios, BL B2. Exact rights **UNKNOWN**. | LP1 soul resident, institutional weapon custody LP2 and internal spirit agreement separately. Dial realm, faction, selected manga/anime/novel continuity. Purchasing a blade does not automatically buy its spirit's cooperation. |
| Ritual contracts, Fate W10 | **STATED (BY_WORLD, dated wiki):** independent Servant wills coexist with supply/anchors and constrained Command Spell authority; Servant r405040 Container/Upkeep, DF1-DF3. Homunculus r387998 records manufactured roles, not full civil law. | LP6 ritual service, manufactured-body LP2 claim versus personhood, LP5 refuge or particular LP7 divine status. Dial Fuyuki/Chaldea/other system separately. Consent, magical enforcement and public law are distinct. |
| Other active anime comparisons, W11-W15 | **STATED (BY_WORLD):** ant intelligence/colony W11, retained chimera identity/covert military work W12, bounded Boruto supplement W13, hunter contracts/fear W14 and dated species summaries W15. General legal codes **UNKNOWN**. | Choose institution/era before LP1/LP4/LP6. Dial ordinary worker, protected experiment survivor, negotiated summons or hidden resident. Do not derive a species-wide morality or rights rule from one antagonist. |
| Monster nation, Tensura TM3/TM6/TM7 | **SHOWN/STATED via MECHANICS located dossier summaries:** ordinary craft/trade TM6 T1 members22/30/46/50/53-57; Church doctrine and Falmuth commercial motives TM7 T1 members6/68/70. Naming can mark equal friendship, TM3 TC C04 member5. | LP1 monster citizen locally; LP4 under an opposing doctrine; LP6 named duty only if actual terms establish it. Dial founder, apprentice, merchant, ally or hidden identity. Naming does not universally mean ownership/obedience. |

## 3. Ownership of sentient beings and objects, N4

**INFERRED default:** track the subject's stable identity, material body/object,
claimant/title basis, current holder/location, controller and agreement as separate
references in existing owners. Add only fields the selected route consumes;
ENGINE_SPEC owns schema/version choices. Do not equate `body.ownerId`, a custody
loan, a household relationship and a legal slave claim. A disputed claim remains a
claim until the relevant authority acts. Law may recognize a claim the subject
rejects; affection does not settle that dispute.

| Code / event | Concrete result to record, INFERRED | Continuing agency and settlement |
|---|---|---|
| OW1 Bought | Payer, seller, subject/body id, asserted title/contract scope, price and receipt; funds and custody transfer once | Cooperative choice, challenge seller's title, work toward release or continue in chosen role. Sale may transfer material title while leaving bond/control unchanged. |
| OW2 Sold | Identify what seller can transfer and what is claimed without right; prospective holder's terms/location | Sentient item can warn, negotiate/refuse a bond or act through its supported channel. A coercive selected rule can restrict acts, but does not erase the player seat or invent agreement. |
| OW3 Stolen | Change actual holder/location; keep prior claims and evidence of theft | Signal witness, escape via actual faculty/carrier, seek recovery, negotiate with thief or build a new relationship. Hidden theft does not notify all factions. Recovery does not reset wear, money or history. |
| OW4 Inherited | Deceased claimant, successor, succession authority, material title and continuing obligations | Transfer body/canvas/property only as the world's rule supports. Sentient subject's memories, trust, skills and controller do not become heir assets by default. Contest, release or renewed terms can follow. |
| OW5 Freed | Record releasing authority or successful escape/adjudication, ended claim/control terms and actual destination | Emancipation, escape from custody and termination of a magical bond are different outcomes. Earned coins/relationships survive their declared carriers. Being free need not restore a lost body or make every observer know. |
| OW6 Lost/found | Last known holder, actual reachable place, finder and salvage claim | Dormant sword/plant/anchor remains the same subject. Finder may gain custody without title; fallback resonance/watch/practice needs means. No replacement copy in merchant refresh. |
| OW7 Lent/rented | Owner/lessor, holder/controller window, permitted work, fee/deposit, return route | A borrowed carrier/body has its own condition and owner; return the same identity. A time limit or claim creates a local dispute, not automatic extinction of the mind. N22. |

**INFERRED consent and dark-premise dials:** Default original premise uses
cooperative service, readable terms and a useful refusal/alternative route.
Dial separately: recognition/rights (ND1), command/control (ND2), ownership and
relationship (ND8), scene detail (ND4), stakes/absence (ND7). Reasonably per world,
canon binding, coercive sale, captivity, escape, complicity and ownership disputes
remain playable when explicitly selected and supported. A blanket difficulty
preset should not silently select all of them.

The player's preference for a dark premise is separate from the character's
consent to an event. Consent can authorize travel/work/channel use without sale,
permanent control, reproduction, invasive repair or borrowing a purse. Record
scope, duration, ability to refuse/revoke and actual consequences. Some selected
magical coercion may prevent refusal; show that rule rather than relabeling it as
consent or adding compulsory love. Mechanical severity and prose detail are
independent. Summarizing a scene does not undo its selected outcome.

For carried/fixed starts BK3/BK6/BK7/BK10, include a useful local routine and
communication while transport or dispute is pending. An owner leaving need not
teleport the player away or delete the life. Host/bond departure follows NM12 and
NT8; being freed need not require becoming human (N15).

## 4. Recognition, disguise and rumors

**INFERRED default:** resolve what this observer can perceive, what they believe,
and what authority they can grant. **Dial:** ordinary visible clues, learned
signals, sponsor testimony, documents, scent, specialized sensors or source-specific
soul recognition. **Reasonably:** a speaking animal can prove communication
without proving its former human name; one witness may be convinced while another
remains uncertain. E10, X01, U06/U08, TM7/NM7 and NP4/NT5 already own this split.

| Code / channel | Possible evidence | What it does not establish by itself |
|---|---|---|
| RC1 Body/behavior | Shape, deliberate signal, familiar habit, observed aid/harm | Stable identity, honesty, rights or harmlessness forever |
| RC2 Shared convention | Learned knock/bead code, private phrase, trained scent response | Exclusive identity if copied, leaked or taught to another |
| RC3 Testimony/records | Sponsor, maker mark, prior work receipt, registration, chain of custody | A current controller or truthful unbroken history |
| RC4 Special detection | Actual sensing faculty, range, target and result | Everything beyond its declared scope; aura or bloodline is not necessarily person identity |
| RC5 Witnessed transition | Observer watches the actual shift/transfer with a supported channel | Automatic knowledge for absent traders, institutions or distant family |

Minimal original scene: workshop rat arranges a taught bead pattern and retrieves
one fitting through a narrow route. Craftsman knows an intentional helper by that
signal, guard hears attributed testimony, trader initially knows only a customer's
agent. A disguise can copy appearance and even credentials while failing a
personal-memory or scent check. Changing body updates relevant fit/credentials;
it does not globally erase history or broadcast actual controller IDs.

Rumor propagation is a **proposed** finite chain: witnessed event → report by an
actual actor → reachable recipient → remembered claim with source/time/confidence
→ possible action. Default one workshop audience and one guard contact; dial later
networks, brokers, censorship or false reports. A correction travels separately and
may not reach everyone who heard the accusation. Recipients can doubt testimony,
combine incompatible beliefs or ask for proof. Chatter F6 is flavor, not evidence
that this machinery exists. The private truth and any changed-world secret stay
out of tooltips/rumor summaries until a supported discovery route reveals them.

## 5. Economy, prices per body and body debt

### N23: price the actual service

**INFERRED default:** use the existing currency/stock/payment route when supported;
quote each service's actual fit, capacity, materials, payer and beneficiary.
**Dial:** flat inclusive price, measured usage, subsidy, household support, barter,
faction fee or discriminatory policy. **Reasonably per world:** no universal
nonhuman surcharge; a ghost may occupy no bunk while a giant needs more space.
Keep logistics cost, seller markup and explicit prejudice separate so the player
can act on the known reason. Lore examples do not supply canonical prices.

Illustrative quote shape, not a new mandated schema:
`service + bodyRef/revision + scope/duration + resource units + fit/admission +
base charge + disclosed adjustments + payer + beneficiary + deposit + expiry`.
Changing size/body during a pending quote calls for review, like F5's stale price
check. Fitting body equipment and having legal/shop admission are separate tests.

| Service | Body-specific basis, INFERRED | Useful alternative / spending endpoint |
|---|---|---|
| Inn/shelter | Bunk/berth/anchor/nest space actually used; waterproofing or supervised ward if requested | Small shelf berth, sanctuary anchor, rented stall, own nest or actual household agreement. Ghost gets no invented food bill. |
| Transport | Mass/volume/route, carrier time, tank or protective case, declared hazard handling | Rat rides in an agreed pouch; sword in sheath; aquatic body in actual tank; large body takes a compatible route. Physical nonfit needs a route, not merely a higher fee. |
| Meals/support | Compatible input and quantity; optional growth/repair boost | Meat, light access, mana/fuel, prepared ingredients or no intake. Ordinary unfed play stays comfortable; no hunger death. |
| Gear/repair | Materials, fit, actual damage, practitioner and procedure | Harness, hilt wrap, root guard, core socket, replacement joint or bounded artisan instruction. No boots sold as useful to a legless body without an actual adapter. |
| Risk-sensitive service | Specific known hazard, mitigation labor and authority; not undiscovered true identity | Sourced shielding, agreed escort, another provider or safe remote delivery. Insurance is an optional service with a defined payout, not automatic tax for a monster label. |
| Many-body service | Actual seats/frames/workers using service; one-mind membership is not a free headcount rule | A brood books only traveling members; shared currency has one owner/account. Bills can be per volume instead of per creature where appropriate. |

### Earnings, goods and intermediaries

**INFERRED:** extend NP9/NM10 without duplicating BK loops. One selected start
needs a supported way to earn and a useful way to spend. Goods stay actual stock;
service income needs a real customer and settled outcome.

| Body / sibling code | Possible livelihood | Meaningful spending / custody |
|---|---|---|
| Beast/small creature BK1/BK15 | Tracking, tiny retrieval, escort or agreed farm help | Harness/nest, care, transport; direct purse if admitted, otherwise a named cache or bounded agent |
| Plant BK3 | Declared sap/fruit/silk-equivalent product, shade or tending service | Root protection, irrigation or transplant; land steward handles agreed purchases, not ownership of the mind |
| Blade/construct BK6/BK8 | Paid drill contribution, calibration, repairs or lifting with actual functions | Sheath/parts/bench access; distinguish blade's share, artisan's work and wielder's earnings |
| Spirit/guide BK4/BK11 | Witness report, ward, tutoring or analysis through a supported channel | Anchor/records/project inputs; sponsor holds only the agreed funds and purpose |
| Place/core/brood BK7/BK9 | Room service, funded visitor facility, pollination or retrieval jobs | Materials/territory rights/worker support; rent requires actual consenting occupants and reachable premises |
| Familiar/mission-body N17/N18 | Agreed shared-work payout or own useful service | Own gear/growth line, beneficiary-specific account; contractor and companion purses are not automatically pooled |

Agent agreement specifies principal, agent, accessible stock, purchase/sale scope,
fee/share, spending cap, evidence/report and revocation/settlement. Reliable agents
can remain reliable; invented betrayal is not required for depth. A trader can buy
silk directly while a scribe handles invoices. Not being able to count coins need
not erase earning rights or create telepathic Haggling. Borrowing a body's hands
changes executor, not ownership of all its income.

Nonhuman goods include safely shed scales/feathers, actual sap/venom/silk, compatible
fuel, tiny fittings, anchor services and paid knowledge. N3 production records its
organ, recovery/support and transfer boundary. Self-harvest, already shed material,
licensed collection and theft/injury are different acts. A rare product can change
local demand, with actual stock/saturation or authored finite customers; do not
invent compulsory inflation merely because the player has a strong faculty.

### N22: upkeep and body debt

**INFERRED default:** body support, optional advancement inputs and debts are three
separate records. **Dial:** own body, paid rental, sponsorship, installment purchase,
borrowed mission shell or imposed claim. **Reasonably:** create debt only through
an actual selected agreement or sourced coercive premise, not through declining an
offer. Existing exchange F2 supplies a finite funding example, not a body-debt system.

A body lease needs parties, unique body id, possession/control permissions, fee
schedule/clock, deposit, return deadline/place, damage responsibility, support
provider, default procedure and dispute forum. A money debt separately names debtor,
creditor, principal, rate if any, due event and agreed remedies. Repair damage and
missed rent can be separate claims; creditor ownership of a shell does not grant
ownership of the occupying soul or every future body.

Default shortage pauses only the support-dependent boosted job and offers a viable
routine/return/renegotiation. Dial source-specific reserve limits, repossession or
serious local enforcement when selected. An actual fuel limit can block a powered
operation, but must not become hunger death in disguise. A bodyless fallback needs
its own supported anchor/channel; it is not an automatic free extra life. No new
browser-closed interest/upkeep/aging follows from a lease. Opt-in absence uses the
common clock and declared cap, not a second hidden timer.

N18 mission exit reconciles shell condition, cargo holders, gear fit, unpaid fees,
local claims and the contractor's retained carriers. Hub clearance is not a receipt
that all local debts vanished. Changing bodies does not erase a debtor's agreement;
repairs follow the damaged body. Joint parties pay only their agreed shares. N20
keeps rank, strength and access independent, even when a creditor uses one as leverage.

## 6. Reputation, fear and local standing

**INFERRED default:** keep existing regional goodwill as a compatibility summary
while authored witnesses/relationships/claims carry specific consequences.
**Dial:** finer audience or institutional standing when consumed by play; fear can
be qualitative before a numeric axis is useful. **Reasonably:** a powerful helpful
wolf can be trusted and feared, a beloved thief can remain legally wanted, a
lawful owner can be disliked, and a deity can have little recognized local authority.
No universal strange-body penalty or hidden global alignment.

| Code / act | Possible local change, INFERRED | Boundary |
|---|---|---|
| RF1 Deliver useful work | Customer trust, workshop reputation, later commission or sponsorship | Credited executor/partner and actual receipt; neither universal citizenship nor all-faction fame |
| RF2 Protect others/show power | Gratitude, confidence in protection, awe or fear among witnesses | Threat perceived from evidence; allies need not become hostile just because strength rises |
| RF3 Harm/steal/deceive | Victim grievance, observed accusation, restitution claim or bounty | Detection/report/authority required for others' reaction; false evidence can misattribute identity |
| RF4 Respect/refuse a boundary | Dependability or disagreement, changed specific terms | Refusing a new task is not breach of an unaccepted contract; ending service need not erase friendship |
| RF5 Reveal/change body | Recognition update, questions, sponsor audit or local classification dispute | NT5 continuity: history persists, new observers need evidence; no automatic loyalty reset |
| RF6 Repair/pay/free another | Resolved specific claim, gratitude, possible disagreement with former claimant | Settlement closes that dispute; no infinite repeat reward from refreeing/re-selling one subject |

Village F7 already rewards clearing rat threats. A player rat's helpful act should
be credited by an adapted receipt, not by treating all wolf rats as its faction or
forcing a self-extermination quest. Noncombat recognition/work can provide a route
alongside combat. A bounty needs issuer, evidence/claim, target identifier, scope,
reward and actual pursuer's means. Guards can investigate, negotiate, restrict a
particular entry or do nothing; one report does not summon infinite hunters.

Fear-based magic, where actually sourced (W14), is separate from the Village price
margin and ordinary trust. Worship LP7 can be esteem, organized support or an actual
power input; do not merge all into one reputation number. A transformed impersonator
can benefit from a believed identity while actual title/ownership remains disputed.

## 7. Considerations SL1-SL16

All rows are INFERRED proposals and future checks, **unrun**. Default/dial choices
apply only to a selected world slice, not a requirement to build every system.

| Code | Default + dial + reasonably per world | Later observable question |
|---|---|---|
| SL1 Rights have a place/time | Local jurisdiction and dated rule; dial reform/AU/custom | Can one being trade here while lacking the same rights elsewhere? |
| SL2 Claims differ from truth | Separate asserted title, holder and controller; dial enforceable/contested ownership | Does theft move custody without making the thief rightful owner? |
| SL3 Status is composable | Relevant rights/roles, not a universal enum; dial protected servant or worshipped object | Can protection and limited autonomy coexist without granting all privileges? |
| SL4 Consent has scope | Bounded channels/work/transport; dial disclosed coercive authority | Does agreeing to be carried leave purse, mind and other permissions intact? |
| SL5 Fixed/carried agency | One supported local routine and contact; dial strong escape/recall source | Is waiting for a holder still useful play without invented walking? |
| SL6 Evidence is audience-local | Actual observed/reported clues; dial perfect source-specific detection | Does the trader stay uninformed after a private workshop demonstration? |
| SL7 Rumors need carriers | Small authored report chain; dial broader network later | Can a false rumor survive in one audience after another receives a correction? |
| SL8 Identity continuity is selective | History persists; current credential/fit checks; dial sourced soul recognition | Does body change keep genuine debts without inheriting a stranger's office? |
| SL9 Price service usage | Declared resource/fit charge; dial inclusive/subsidized/prejudiced provider | Can a tiny body pay less for space without every strange body paying a surcharge? |
| SL10 Agents have bounded authority | Real purse/stock, spending limit, report; dial household or pooled accounts | Does one purchase debit once and leave the unspent principal's funds theirs? |
| SL11 Goods have provenance | Produced/shed/harvested stock distinguished; dial lawful or coercive collection | Does sale transfer product while retaining the same living body and recovery state? |
| SL12 Debt has an actual cause | Selected agreement/claim and clock; dial rental/installment/coercion | Does refusal create no invented obligation, and reload create no duplicate interest? |
| SL13 Support keeps a viable life | Meals help, no hunger death, real operation limits; dial sourced support | Can a paused boosted job lead to an actual safe routine or return route? |
| SL14 Fear, law and trust differ | Specific audience/claim; dial numeric axes only when used | Can gratitude and fear coexist without price or rights changing automatically? |
| SL15 Succession/release conserve identities | Unique subject and declared transfers; dial contested heir/freeing authority | Does inheriting or freeing a blade preserve its own memories and avoid a second stock item? |
| SL16 Cross-world settlement is explicit | Local claims/agents continue; carriers declared; dial compatible conversion | Does mission exit settle the rented shell while leaving actual local obligations recorded? |

## 8. Suggestions, at most five

These are INFERRED candidates, not accepted priorities or implementation orders.
They build on ENGINE_SPEC and PLAY's suggested slices rather than launch parallel
campaigns. Finish the chosen playable slice before adding another.

1. **S1: Add one bounded recognition-and-payment join to the selected Village beast
   slice.** One taught signal, one witness, one useful distinctive service, one
   agreed payment and one body-fit purchase. Use F6/F8 setting/access and existing
   finite-transfer guards; require an actual supported communication/executor route.
   Guard recognition and an uninformed trader give a small X01 counterexample.
2. **S2: Use one blade custody dispute to prove N4 after carried-body support.**
   BK6/NM6: one holder change, a retained prior claim, the blade's own choice of
   bond and one return/release settlement. Add inheritance later rather than
   building every ownership event at once. No cloned blade or purchased obedience.
3. **S3: Quote one useful service by actual body use.** Alongside the selected
   slice, compare nest/berth or case/harness service, show payer/beneficiary and
   recheck a stale body/price. Preserve native margin behavior for ordinary goods;
   no universal species multiplier or invented parallel currency.
4. **S4: Attach one bounded agent agreement to a rooted/ghost start when selected.**
   BK3/BK4: sell one actual output/service, authorize one purchase, return a receipt
   and unspent funds. This gives inability to grip a productive alternative while
   preserving caretaker/agent time and ownership.
5. **S5: Resolve one source-specific body lease before Paradise mission-body play.**
   N18/N22: verify that selected canon case or label it original/AU, then declare
   unique shell, permissions, fee/support, return and default. Prove exact condition,
   debts and carriers on departure. AlchemyMaid custody is a comparison, not evidence
   that every mission body is rented or every companion owned.

**Future selected acceptance, not run:** rebuilt fresh-origin 1366×768 desktop
journey with one positive distinctive work/payment/purchase, one relevant refusal
or missing-means case, one audience-specific recognition consequence and applicable
save/reload/export/literal-file import. Inspect identities, custody, actual funds,
claims, condition, learned signals and pending obligations before/after. Mobile is
deferred. This research made no runtime/test/build/browser/save/installation,
commit/push/publication, purchase or source-download claim.

**Coverage:** nine inspected seams; seven status categories; fourteen world-type
comparison rows; seven ownership events; five recognition channels; six pricing
services; six livelihood groups; six reputation examples; sixteen SL considerations;
five suggestions. **UNKNOWN:** complete canon civil codes, exact body prices,
selected source-specific lease terms, runtime support, migration, balance and
playable feel. Secondary summaries and supplied-MTL limits are retained. The
checkpoint records unavailable or later-arriving sibling reports and final checks.
