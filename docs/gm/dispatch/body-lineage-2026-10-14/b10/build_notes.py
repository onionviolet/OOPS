"""Generate B10 documents from explicitly authored lane data; no external writes."""
from pathlib import Path
import os, re, json
OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
B1 = OUT.parent / 'b1'
W = {}

def add(slug, scope, sources, variables, default, dial, cost, adjectives, rows, gap):
    assert (B1 / f'WORLD_{slug}.md').exists(), slug
    assert len(variables) == 5
    parsed = {}
    for row in rows.strip().split('\n'):
        code, status, origin, method, use = row.split('|')
        assert code not in parsed and status in 'BPL'
        parsed[code] = [status, origin, method, use]
    W[slug] = dict(scope=scope, sources=sources, variables=variables, default=default, dial=dial, cost=cost, adjectives=adjectives, rows=parsed, gap=gap)

add('harry-potter', 'Selected-book potion preparation; temporary bodily impersonation and treatment, not acquisition of wizard ancestry.',
 [('docs/gm/dispatch/procgen-2026-10-13/p6/CANON_LOCATORS.md','K2-K4: Chamber of Secrets ch10 TXT4132-4168 and ch6 TXT2315-2395; Goblet of Fire ch13 TXT4824-4855. Inherited SHOWN/STATED supplied-book locators.'),('docs/worlds/harry-potter/SOURCE_LEDGER.md','H1-H4; registry, eligibility and plant-source bounds.'),('docs/research/power-systems/wiki-digests/DIGEST_harry-potter.md','Fandom dump revision review DH3: Fidelius r1933855, Introduction. Secret carrier only, not a potion or inheritance law.')],
 ['Correct named part, maturity and preparation for the selected potion.','Selected harvest window or viable Mandrake stage; no universal shelf life.','Recipe constituents and contamination; a pure-blood claim is a separate social assertion.','Intended-person input differs from an animal input; potion eligibility does not establish permanent inherited magic.','Target-linked hair and supplier/bed/harvest record; a shop label cannot authenticate the intended person.'],
 'Source ingredients and an actual preparation before a temporary change or cure.', 'School nursery, commercial preparation, stolen target sample or explicit plant-body AU.', 'Time, vessel, protection, recipe access and ingredient stock.',
 'School supervision, private-sample theft and creature handling have local witnesses and sanctions. A coercive supplier changes the relationship record; ingredient chemistry alone does not reveal consent.', '''SO1|L|Creature keeper or ingredient merchant|Obtain a recipe-qualified secretion or creature part|K3 proves route sensitivity for plant secretion; creature-part identities require their own selected recipe scene
SO3|P|Hogwarts greenhouse grower|Negotiate bed access and stage-qualified harvesting|Access to a producer, not a place that grants wizard genes
SO4|B|Mandrake grower and Bubotuber bed|Harvest the named part with protection and stage handling|Restorative preparation or route-specific skin effect; K3
SO5|B|Intended person, hair held by collector|Collect and keep target material separate for Polyjuice|Temporary target form through K2 preparation; chosen consent/theft route is authored
SO6|P|Era-qualified canon target or their custodian|Acquire one actual target-linked sample through an authored interaction|Same recipe, individual consequences; no random canon identity or omnipresent donor
SO7|P|Apothecary with a titled ingredient lot|Buy prepared or raw stock and compare records|Alternative supply; exact stock, price and authenticity are authored
SO8|P|School greenhouse or supervised brewing class|Earn access, borrow protection and settle custody|A teaching/supply contract, not hereditary faculty
SO10|P|Peer holding the same scarce target sample|Trade a measured portion or contest custody|Target evidence and later trust change, not the target’s true ancestry
SO11|P|Traveler carrying labeled herbs or hair|Check physical carriage and exact recipe identity at destination|Material might supply a role; foreign magic conversion remains unqualified
SO12|P|Your own retained hair sample|Authenticate, store and use only in an eligible identity recipe|Restoring appearance is distinct from restoring injuries, age or an earlier self''',
 'SO2 ancient bodily remains and SO9 inheritance rewards remain UNKNOWN here. Permanent gene rewriting, generic magical blood transfusion and an age-restoration sample bank have no selected source rule.')

add('dnd', 'SRD 5.2.1 selected healing rules and Phandalin setting anchors; broader transformation and ancestry need separate edition-qualified passages.',
 [('docs/worlds/dnd/SOURCE_CONTRACT.md','S02/C04-C07: zero HP pp17-18, Cure Wounds p121, Mending p148, short rest p187; S04 Phandalin trades/shrine. Inherited inspected primary facts.'),('docs/research/power-systems/wiki-digests/DIGEST_dungeons-dragons-2024-revised-fifth-edition.md','Evidence limit: blocked_no_revision, no additional certified lore.')],
 ['Actual treatment or fitted aid meets its selected rule, rather than a single monster rarity score.','Patient condition and reagent condition only if that spell or process reads them.','Ordinary supplies may carry contaminants; purity has no automatic effect on Cure Wounds.','Recipient and chosen spell rule; healing, stabilization and repaired gear are distinct.','Caster, rule profile, original patient and purchased materials; keep 5.1 and 5.2.1 separate.'],
 'A skilled local healer supplies a supported bodily treatment.', 'Mundane aid, species-specific fitting, or a separately sourced transformation/resurrection spell.', 'Caster eligibility, actual spell resources, appointment and payment under authored terms.',
 'Shrine service, guild permission and handling the dead follow the chosen locality. SRD spell feasibility does not settle donation law or whether a particular NPC offers service.', '''SO5|P|Patient or volunteer in a local clinic|Take a scoped diagnostic sample or measurements|Evidence for fitted care; no donor blood grants class or species
SO7|P|Phandalin trader and aid maker|Purchase titled materials for a fitted aid|Crafted accommodation; C02 crafting has proficiency/material/time costs
SO8|B|Eligible shrine or independent caster|Apply Cure Wounds under C07 and actual eligibility|Bodily healing, not revival or new ancestry; service availability is authored
SO11|P|Traveler with physical tool materials|Use a compatible mechanical aid under local craft rules|Foreign enchantment needs a separately sourced adapter
SO12|P|Your own measurements and tissue evidence|Compare condition before and after treatment|Diagnosis and fitting; no automatic clone, younger body or inherited spell''',
 'SO1-SO4, SO6, SO9-SO10 remain UNKNOWN as body-changing supply routes. Monster-part grafts, dragon ancestry, Awaken, Reincarnate and resurrection are retrieval leads outside the inspected spell slice, not edition-wide bans.')

add('soldiers-life', 'Public source-qualified logistics, care and preservation proposals; full-world implementation stays paused and private eligibility stays sealed.',
 [('docs/gm/dispatch/procgen-2026-10-13/p6/CANON_LOCATORS.md','K11/M04: Book5 ch282 P50-54, ch310 P48-53, ch311 P4-14,22. Specific storage suspends contents time; not every magical bag.'),('docs/worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md','W03: Book1 body table/ch51 P45-46/ch55 P71-75; Book3 ecology and dungeon rules. Inherited stated/shown summaries, exact inheritance unknown.'),('docs/worlds/world-depth-2026-10-13/04_FALLOUT_SKYRIM_SL_TTKS.md','A Soldier’s Life, source-bound unit and duty considerations. W1-SRC-01..26 remain private source owners.')],
 ['Intact specimen, usable local medicine or correctly fitted kit; strength and specimen value differ.','Ordinary transit versus specifically qualified time-suspending storage; reopening does not rejuvenate a batch.','Mixed ingredients and species identification; no inferred pedigree-to-potency rule.','Species, patient and local procedure; an eligibility reading is not a transferable organ.','Duty issuer, creature/source site, custody and selected bag law; private source IDs remain ID-only.'],
 'Source ordinary care and useful monster/plant material through a titled expedition.', 'Paid procurement, local preservation, native nonhuman start or a separately qualified modification.', 'Expedition time, supplies, protection, storage access and actual processor.',
 'Legion duties, independent civilian suppliers and contested creature collection can differ. Cruelty and consent follow selected polity/actors; all are proposals, not a universal military prohibition.', '''SO1|L|Expedition holding a Book3 ecology specimen|Collect an intact qualified creature part rather than every power-bearing tissue|Venom, saliva and movement are different mechanisms; no general organ-to-faculty rule
SO3|L|Dungeon/site custodian|Collect only under the selected room and renewal law|Reported regrowing fruit/enemies is not generic unlimited bloodline stock
SO4|L|Grower or room with qualified fruit|Take a source-qualified plant portion|Consumer and body effect need exact scene; no invention of an essence recipe
SO5|P|Medic, patient or donor|Negotiate care and keep a diagnostic sample’s custody|Treatment/evidence; no transfer of hidden source eligibility
SO7|P|Quartermaster or independent supplier|Purchase one inspected batch or preservation service|Alternative to hunting, with finite source stock and custody
SO8|P|Actual supply-duty issuer|Receive authorized medical or preservation stock under contract|Institution supplies means and obligations, not heredity
SO11|P|Traveler carrying a qualified batch|Keep batch condition and test destination use separately|A time-suspending bag law does not prove foreign biology compatibility
SO12|P|Your own recorded pre-treatment sample|Compare recovery or authenticate a medical record|No free earlier-body restoration or private eligibility reveal''',
 'SO2, SO6, SO9 and SO10 body-source mechanisms remain UNKNOWN. No hidden protagonist faculty, sealed route truth or raw book prose appears here; authoring cast/era and later native gates stay with owning GMs.')

add('mother-of-learning', 'Existing continuous independent-visitor Cyoria branch supports bounded care and samples, not a live loop or new personal-mana body.',
 [('docs/worlds/mother-of-learning/WORLD_BRIEF.md','Source and branch boundary; MOL-C011-03/04, C014-02/03/07, C024-04/05: Kael household/material research and finite mild-injury salve.'),('docs/gm/dispatch/procgen-2026-10-13/p6/CANON_LOCATORS.md','K6-K8: crystallized mana, treated frame, control and power are separate. Device fuel is not a bloodline.'),('docs/research/power-systems/wiki-digests/DIGEST_mother-of-learning.md','Earlier mappings/source gate; no independently verified body bank rule.')],
 ['Useful care input or diagnostic sample; lamp charge is a different resource.','Salve/sample condition only under an authored process; no loop-based replenishment in this branch.','Contamination and label accuracy; unrelated impurities do not manufacture personal mana.','Retained visitor body and mild-injury treatment; a negative mana assessment has bounded scope.','Kael’s actual preparation, patient, local sample and branch identity; no copied protagonist history.'],
 'Commission finite care and preserve a scoped sample for analysis.', 'Original ingredient-growing project or separately source-qualified mage/body route in another branch.', 'Stock, crown payment, specialist time, paper and actual analysis means.',
 'Household privacy and Kael’s family time matter here; clinical access is negotiated. No consent from a named student is generated automatically.', '''SO3|P|Cyoria household or rented workroom|Pay for a treatment/research site and relevant apparatus|The site supplies access and conditions, not a new mana organ
SO4|P|Local salve supplier or proposed herb grower|Obtain a titled ingredient lot for one declared mild-injury preparation|Exact botanical recipe remains authored, not certified canon
SO5|P|Patient and Kael|Request care or give a scoped sample with agreed use|Sample analysis does not copy the patient’s faculty
SO6|P|Era-qualified Kael as provider|Negotiate his finite care/research time|Named provider remains authored and independent, not a random blood donor
SO7|P|Household/shop supplier|Pay for a real preparation or material lot|Medicine and six-charge lamp supply keep distinct budgets
SO8|B|Existing bounded household care arrangement|Apply its finite salve only to supported mild injury|World-brief design ownership, not newly verified gameplay
SO10|P|Peer researcher with an inspected batch|Trade sample or report under a specific agreement|Only actual communicated evidence changes diagnoses
SO11|P|Visitor with foreign herb or aid|Assess physical treatment role before use|No personal-mana grant or lamp export entitlement
SO12|P|Your own condition/sample log|Record before/after care and retain custody|No earlier-loop tissue bank, independent copied reserves or body reset''',
 'SO1, SO2 and SO9 remain UNKNOWN for bodily acquisition in the retained visitor slice. Simulacra, markers and source future secrets are not imported as new branch mechanics.')

add('ttks-border-inspector', 'TTKS B5 mirror members1-668, ongoing capture; cooperation-qualified copying and infection gifts stay source-specific.',
 [('docs/gm/dispatch/procgen-2026-10-13/p9/TTKS_B5.md','Source boundary: R1 member0004 target/kind/level/cooperation; R4 0089/0133/0214/0305 substrate; R3 power; K16 member0437 heading ch432 plant mask.'),('docs/gm/dispatch/ttks-novels-2026-10-10/FINDINGS.md','Addendum3 F5-F9 and B5 supplied-edition coverage; printed headings differ from member ordinal.')],
 ['Eligible target/kind/level and copied substrate quality; incomplete rune information is separate.','Living source/active infection state or plant condition at encounter; precise retention windows unknown.','Infection, imprint and material fractions differ; a clean detector result has a named blind spot.','Actual collector rank, cooperation channel, power and substrate; no general graft acceptance.','Captured member ID, target actor, consent/cooperation evidence and copy operation; preserve origin even where copying leaves donor unchanged.'],
 'Inspect with imperfect channels, then acquire a cooperation-qualified output.', 'Funded consensual copy, contested infection exposure, ordinary procurement or explicit collector-grant AU.', 'Electricity, correct substrate, access and actual ranked method; source-specific reported debts require recheck.',
 'Cooperation can be a mechanical predicate here; institutional admission and moral approval remain separate. An unsafe exposure route does not become a generic donor-consent veto.', '''SO1|L|Eligible infected creature outside the gate|Inspect and use only a selected source-qualified acquisition channel|Creature information is not universal genetic loot
SO3|P|Inspection gate/utility worksite custodian|Arrange apparatus and charging access|Power/site condition supplies execution, not a body rewrite by itself
SO4|B|Source-linked exceptional plant-mask holder|Acquire under member0437's selected affinity conditions|Emotional/source interaction, not ordinary inherited botanical chemistry
SO5|B|Cooperating eligible target|Invoke R1 copy with ranked target/kind/level predicates|Information/output under exact rule; copies need not consume donor material
SO7|P|Gate supplier or salvage trader|Buy a titled carrier or eligible prepared sample|Price and detector evidence do not authenticate every hidden infection
SO8|P|Inspection institution and utility owner|Earn access and fund an admitted inspection/copy job|Role permission, electricity and target cooperation have separate records
SO10|P|Peer collector holding a qualified output|Trade actual output or collaborate on collection|No inferred identical powers from a shared inspector title
SO11|P|Traveler holding copied substrate|Declare edge carriage and destination operation|Downgraded/unsupported substrate follows the selected rule, not a name conversion
SO12|P|Your own dated infection/body observation|Compare channel-specific readings and retained sample|Negative evidence is scoped; no free restored earlier self''',
 'SO2, SO6 and SO9 remain UNKNOWN; exact infection modification and numerical debt/odds need selected member recheck. Do not blend B1-B5 books or canon cast.')

add('ttks-humanitys-heir', 'TTKS B4 civilization legacy and genetic diagnosis; ancestry, material purity and machine rights differ.',
 [('docs/gm/dispatch/ttks-novels-2026-10-10/FINDINGS.md','Addendum3 F5-F9, B4 supplied-edition coverage.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-humanitys-heir.md','Owned GN9/OB4; golden ancestry assessment, purity and machine permissions remain separate.')],
 ['A valid diagnostic specimen or fitted machine interface, not an ancestry title.','Test sampling date and specimen condition; no certified biological shelf-life rule.','Measured specimen content versus a claimed golden pedigree; exact scale unresolved.','Machine/interface requirements and this body; lineage recognition alone does not authorize equipment.','Patient, test issuer, machine owner and source edition; family claims stay attributed.'],
 'Obtain evidence and a compatible interface through a named custodian.', 'Original civic diagnostic clinic, inherited equipment or explicit newly authored body modification.', 'Test access, tools, time and separately granted machine rights.',
 'The chosen legacy institution may control assessment and use rights; coercive testing, voluntary testing and forged recognition produce different local histories.', '''SO5|P|Volunteer or tested citizen|Acquire an agreed specimen and diagnostic report|Evidence, not transfer of golden ancestry
SO7|P|Instrument/component supplier|Buy a titled diagnostic or interface component|Fit/repair changes practical work without granting pedigree
SO8|B|Legacy diagnostic authority or machine custodian|Assess ancestry and grant machine use separately|Bounded B1 source-summary ownership; exact source member still required
SO9|L|Legacy-site custodian|Investigate a qualified admission/test route|A civilization legacy is not yet a proved blood-only trial
SO11|P|Traveler with preserved test specimen|Check destination assay semantics and custody|Matching diagnostic names do not make ancestry scales equivalent
SO12|P|Your own earlier diagnostic sample|Compare measured change under the same protocol|No automatic trait reinstall or copied machine permission''',
 'SO1-SO4, SO6 and SO10 actual body-source routes remain UNKNOWN. Public summary does not supply a genetic-editing recipe or inherited mastery.')

add('ttks-mimic', 'TTKS B1 mimic/body evidence and loop-carried information; matter and identity retention need their actual source rule.',
 [('docs/gm/dispatch/ttks-novels-2026-10-10/FINDINGS.md','Addendum3 F5-F9, B1 supplied-edition coverage.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-mimic.md','Owned MS2/OB4; mimic replacement, chalice custody and memory/soul gains do not establish reproduction.')],
 ['A useful disguise trace or correct observed bodily pattern; exact replacement procedure unknown.','Current trace versus remembered prior-loop observation; matter cannot be presumed carried.','Mixed identity evidence and contaminated samples; no automatic trait purity scale.','Body execution, memory/soul gains and mimic route are separate; one copied impression is not mastery.','Actor, observed event and loop/branch occurrence; do not present old matter as currently owned.'],
 'Source a scoped trace and test an identity claim.', 'Authored diagnostic service or separately qualified mimic body route.', 'Observation tools, access and current-body practice; material retention must be established.',
 'Impersonation may matter to an institution or victim through witnessed evidence. No universal law/consent rule is inferred from the word mimic.', '''SO5|P|Person leaving an observable trace|Collect a scoped physical sample and compare it with observations|Identity evidence, not a certified anatomical copying recipe
SO7|P|Diagnostic supplier or relic custodian|Commission examination without changing source identity|An instrument or chalice must have real custody; neither proves ancestry
SO8|P|Researcher with relevant detection means|Request a channel-specific assessment|Only supported observations enter the report
SO11|L|Carrier crossing a loop/branch boundary|Qualify material retention independently of memory|A remembered specimen is not an imported owned specimen
SO12|L|Your own prior-loop record or current sample|Compare retained information with present-body evidence|An earlier body’s material availability remains unresolved''',
 'SO1-SO4, SO6, SO9-SO10 body-source routes remain UNKNOWN. Do not infer a source of new bodies from a disguise diagnosis or manufacture a previous self.')

add('lord-of-mysteries', 'Selected characteristic/formula custody and body-changing potions; inherited novel locators, not a new full primary audit.',
 [('docs/gm/dispatch/procgen-2026-10-13/p9/LOTM.md','Source boundary M10-M17: L0142 v1ch140, L0214 v1ch212, L0221 v2ch5 main input/substitution; L0357 v2ch138 imprint; L0461 ordered preparation.'),('docs/gm/dispatch/procgen-2026-10-13/p8/WORLD_VARIATIONS.md','LOTM/COI row: characteristic conservation, containment and true contents; cleansing scope unknown.'),('docs/research/power-systems/wiki-digests/DIGEST_lord-of-mysteries.md','Evidence limit/earlier mappings only, no revision-backed full-body law.')],
 ['Pathway/sequence content and usable preparation; rarity, quantity and digestion are different.','Physical reagent age and containment history; characteristic content has no generic herb-decay law.','Former-owner imprint, external corruption, auxiliaries and contained sequence content are separate.','Exact main input/formula, recipient pathway and advancement prerequisites; an equal tag sum is insufficient.','Actual source entity, conserved identity, current holder and artifact containment; seller claim remains a claim.'],
 'Acquire a titled main source and auxiliaries, then assess before a qualified preparation.', 'Creature-source, deceased-holder transfer, purchase, church allocation or original auxiliary farming.', 'Actual formula, specialist means, custody transfer and supported containment; no invented universal cleanse.',
 'Church restriction, occult-market practice, corpse treatment and donor consent vary by actor/locality. A corpse-harvesting route has witnesses and claimants; chemistry does not settle ownership.', '''SO1|B|Qualified creature-material holder|Recover the exact formula’s eligible main input|M10 replacement rules; hunting/transport details need selected scene
SO2|L|Ancient remains/artifact custodian|Investigate a preserved characteristic-bearing source|Age and conserved custody do not prove safe extraction or purity
SO3|P|Restricted preparation room or containment site|Rent or earn compatible workspace|Condition/access, not ambient generation of characteristics
SO4|P|Auxiliary-reagent grower|Grow/trade original compatible auxiliaries|Cannot replace a required main identity by a generic herb
SO5|B|Deceased or living characteristic holder and claimants|Transfer/extract only under a supported source law|Conserved identity changes custody; no new token per corpse roll
SO6|L|Authored canon figure holding a named source|Qualify era, actual item/body state and a possible transfer|No procedural stock duplicate or protagonist privilege
SO7|P|Occult seller with actual lot|Negotiate titled purchase and independent assessment|Fake invoice changes belief, not pathway content
SO8|P|Church/organization storekeeper|Accept source allocation with specified service terms|Faction allegiance and biological source stay separate
SO9|L|Legacy/tomb custodian|Qualify actual reward and admission rule|Not every tomb is a blood-only trial or renewable source
SO10|P|Rival holding the same conserved characteristic|Trade, steal or contest its actual custody|One winner does not imply duplicate identities; conflict has causal witnesses
SO11|P|Traveler carrying characteristic or preparation|Preserve origin law and test a destination consumer|Foreign use needs actual directional compatibility, not energy-name matching
SO12|L|Your own actual characteristic/sample custodian|Qualify donation, extraction or archived body material|Retention of self, source and descendants requires its own rule''',
 'Exact extraction/cleanse quantities and hereditary transfer remain open/U; do not add a generic purity-to-mastership or soul-copy rule. Sealed S1/S2 stay ID/route/status only.')

add('circle-of-inevitability', 'Separate COI source snapshot; characteristics, contained sequences and boons are distinct source forms.',
 [('docs/gm/dispatch/procgen-2026-10-13/p8/WORLD_VARIATIONS.md','LOTM/COI row: COI0028-29 stated conservation, COI0295 contained sequence content, COI0495 storage manual; bounded attributed source reuse.'),('docs/gm/dispatch/procgen-2026-10-13/p9/CIRCLE_OF_INEVITABILITY.md','Source boundary M14 C0060-61 blood/ritual media versus granted source; M15 C0030 decaying characteristic-free preparation; boon bestower connection/imprint, all attributed supplied-edition SHOWN/STATED with fidelity gaps.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_circle-of-inevitability.md','MS2/OB4; boon/reset, memory, pact terms and estate differ. No standalone COI digest was found in this pass.')],
 ['Actual pathway/sequence or grant content; a boon is not a bottled characteristic.','Reagent condition and actual resealing/storage history; no passive renewal from a new site roll.','Contained lower sequences, imprint and corruption; contained content is not several separately owned objects.','Selected potion/grant prerequisites and actor; nontransferable grant is not hereditary biology.','Source holder, patron if relevant, custody graph and COI-specific occurrence; LOTM era is separate.'],
 'Source and assess one actually held characteristic or a named grant.', 'Purchased stock, institutional supply or a separately authored grant-based route.', 'Formula, containment, support and exact grant obligations.',
 'Local occult organizations and patrons can attach different terms. Consent, exploitation and lawful ownership have separate attributed facts; no generic purity policing is selected.', '''SO1|L|Qualified creature-source custodian|Identify a selected formula source before acquisition|Exact source identity and collection rule need COI scene qualification
SO2|L|Old characteristic-bearing remains holder|Inspect conserved contents and title|Ancient origin is not a guarantee of compatibility
SO4|P|Auxiliary supplier|Provide original formula-compatible support reagents|No substitution for exact sequence identity
SO5|B|Actual characteristic holder or their deceased estate|Transfer under the conserved-content law|COI0028-29/0295; no duplicate lower-sequence tokens
SO6|L|Era-authored canon source holder|Resolve actual holder and current state|No cloned canon cast or generated protagonist source
SO7|P|Trader with a contained source record|Purchase and authenticate transfer|Stock ledger and invoice belief differ
SO8|L|Organization/patron controlling allocation|Qualify stock allocation or boon relation|Boons and characteristics have different transfer/recall laws
SO10|P|Rival with the same contained source|Negotiate or contest custody|Trade/theft changes holder and local relationships
SO11|P|Traveler with sealed source cargo|Check storage and destination operation|COI0495 storage does not imply universal import use
SO12|L|Your own current source or bodily trace|Qualify what can be retained, donated or reinstalled|A reset/memory mechanism proves no general clone bank''',
 'SO3 body-granting places and SO9 inheritance trials remain UNKNOWN; exact boon rules, cleaning and earlier-body restoration require separate scenes. No live COI source claims are made.')

add('shadow-slave', 'Qualified shards, parts, weave anchors and authored legacy/trial eligibility, not generic inheritable Aspects.',
 [('docs/gm/dispatch/procgen-2026-10-13/p9/SHADOW_SLAVE.md','Source boundary: ch613/618/695-701 nodes/weaves; ch1605/2048 craft pipeline; ch2056-2062 exceptional construction, not general blood-binding.'),('docs/research/power-systems/wiki-digests/DIGEST_shadow-slave.md','DSS1 Aspect r824, Aspect Legacy/Flaw; obsolete-community dated secondary claim.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_shadow-slave.md','Family equipment/training versus individual Aspect/Flaw; Echo is not the slain original.')],
 ['Creature rank, core class, intact part and compatible anchor function are different.','Physical part condition versus shard/soul state; no universal shard spoilage.','Contamination and weave integrity; lineage identity is not an additive reagent purity.','Recipient, actual maker faculty and node/weave roles; high-grade metal does not grant an Aspect.','Killed creature/source, shard ID, Memory/part owner, trial and realm; unique lineage relics stay authored.'],
 'Acquire qualified parts/shards and commission a useful supported weave or preparation.', 'Trade, logistics commission, personally eligible craft or a selected legacy/trial route.', 'Real source stock, maker means, guarded preparation and irreversible failure only where the rule specifies it.',
 'Academy/clan access, salvage title and revealing private body faculties are local political facts. No universal clan consent or universal prey morality is implied.', '''SO1|B|Hunter with a qualified creature shard/part|Acquire under selected source law and preserve anchor identity|Resource for supported growth/weave; not every tissue grants creature skills
SO2|L|Ancient remains/lineage-relic custodian|Qualify preserved source and actual recipient|No generic ancient blood gives a canon lineage
SO3|P|Guarded preparation site/citadel host|Arrange compatible work and recovery conditions|Safe preparation is distinct from obtaining an Aspect
SO4|P|Ordinary supply grower|Provide body-compatible meals/care inputs|No random herb-made Divine Aspect
SO5|P|Patient or examiner|Acquire scoped bodily/soul observations by supported means|Evidence and treatment, not copying their True Name or faculty
SO6|L|Canon holder of a named lineage relic|Qualify actual era, route and source object|Named truth and changed truth stay with their discovery owner
SO7|P|Shard/part/Memory seller|Transfer actual source objects and title|Trade preserves graph and binding; no blanket tradable-scrap rule
SO8|P|Academy or clan supply officer|Allocate preparation equipment or lessons|School methods and items differ from inherited mastery
SO9|B|Actual Nightmare/Aspect-legacy rule|Pass the selected eligible trial for its authored grant|DSS1 separates legacy and ordinary rank; rewards not generated from a universal algorithm
SO10|P|Rival expedition with held shards|Trade, cooperate or dispute source custody|Real actors have their own supplies and motives
SO11|P|Carrier crossing a declared realm/world edge|Retain cargo and separately validate soul/material operation|No assumed two-world body-copy or universal transit ratio
SO12|L|Your own present body/soul record|Qualify preservation or modification from a source-specific route|Exceptional construction does not certify a general self-restoration bank''',
 'General gene copying, bloodline recipe and restoration remain UNKNOWN. Older digest and ongoing source dossiers are different coverage. SS-S01..04 remain ID/route/status only.')

add('paradise-hub', 'Qualified novel Contractor hub, separate from the original service hub; supplied MTL evidence retains U for fidelity.',
 [('docs/worlds/paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md','BR3/L10 sid2548 p4-30/sid2550 p3-54 Void blood; L11 sid2335 p29-50 unconsumed Corrupted Blood card; BC2/L2 living conversion; BC4/L4 dragon-flesh trial.'),('docs/research/power-systems/wiki-digests/DIGEST_reincarnation-paradise.md','Source gate is not a body-law certification; use newer public body owner.')],
 ['Typed item effect, purity operation and actual recipient; displayed options differ from an observed result.','Flesh condition, preserved blood lot and alchemical core service life are separate.','Purified Void blood versus Corrupted Blood card; no normalized incomplete odds or universal clean-item law.','Item/actor-specific path and body conditions; universal compatibility is UNKNOWN.','Item source, bought lot, injection record and uncertain recipient alias; do not silently assign bird powers to a dog.'],
 'Obtain an actual typed item, assess it and commit an actor-specific change.', 'Blood item, alchemical refit, living conversion, companion care or explicit compatibility AU.', 'Purchase/material expense, procedure time, specialist means and source-specified outcome risks.',
 'Contractor, paid worker, companion and independent resident have different standing. Voluntary conversion is a specific occurrence; no global contract consent, universal safety service or cruelty tax is inferred.', '''SO1|B|Holder of the L4 dragon-flesh lot|Use the qualified meal trial with actual recipient|Reported companion strengthening is source-specific, not hunger death or general bloodline absorption
SO2|L|Ancient source/material holder|Qualify extraction and retained identity before use|Ancient God revival example is not routine blood-stock procurement
SO3|P|Preparation-room/workshop owner|Rent/earn compatible apparatus access|Installed array, patient and materials are separate
SO4|P|Alchemical-material supplier|Supply original compatible growth/repair inputs|Named exact plant-to-bloodline recipes remain unqualified
SO5|L|Body donor or participant in a selected ritual|Qualify source and actual occupant/recipient|Sacrificial body, restored subject and replacement body differ
SO6|B|Authored Baha/Amu/Bubtney source occurrences|Use the L10/L7-L8 evidence with alias and era qualifiers|Observed blood/refit result is not an unrestricted canon sample route
SO7|B|Actual blood-item holder and buyer|Acquire typed stock under the recorded item terms|L10 purchase/use versus L11 unconsumed card; service price/availability remain authored
SO8|P|Paid examiner or appropriate hub service|Negotiate preparation/refit and recognition separately|Body change does not grant Contractor citizenship
SO9|L|Specific recruitment/trial issuer|Qualify reward and eligibility before treating it as a body source|A recruitment trial is not a universal free-race-change coupon
SO10|P|Contractor holding a rare blood item|Trade actual stock or collaborate on examination|Other system users do not create a second source identity by relabeling it
SO11|B|Declared cross-world companion/item carrier|Use BC11's actual crossing profile; author another edge explicitly|One pet’s sealed actives/retained passives are not a universal export law
SO12|L|Your body/sample or prepared replacement custodian|Qualify recovery, clone or replacement separately|BC10/BI3: repair and a physical clone do not establish identical subject revival''',
 'Exact alias, L11 odds, safe reversal, generic blood-source manufacture and clone continuity remain OPEN. All SHOWN/STATED above are inherited dossier labels, with supplied-MTL U; no new original-Chinese read.')

add('naruto', 'Original manga vols 1-72; organ provenance, medical learning and puppet bodies, not later sequel tools.',
 [('docs/worlds/naruto/SOURCE_LEDGER.md','N3-N7/N11-N14, Acquisition distinctions and NU2-NU5. N4 eye gift is official adaptation corroboration; N7 human puppets has bounded official manga locators.'),('docs/research/power-systems/wiki-digests/DIGEST_naruto.md','Earlier mappings/source gate; Hashirama-cell recipe is a retrieval lead, not verified by this digest.')],
 ['Living/intact organ, preserved puppet function and actual medic skill; donor fame is not a yield score.','Tissue viability and storage only after source qualification; puppet preservation has different rules.','Actual graft and added substances; clan concentration has no supplied numeric universal scale.','Recipient body/chakra, surgical means and source strain; copied gestures do not supply an eye.','Original donor, transferred organ, surgeon and era; a temporary chakra-assisted intervention is not a permanent second eye.'],
 'Acquire source-qualified tissue or fitted puppet means and develop actual control.', 'Voluntary gift, acquired organ, medical service, ordinary puppet construction or explicit AU procedure.', 'Actual organ/material custody, surgeon, energy/strain and practiced coordination.',
 'Village clinic, clan custody and illicit experiments can differ in law, consent and retaliation. A donated organ does not transfer clan membership; no generic refusal of harsh-world routes is imposed.', '''SO1|L|Creature/summoning-source custodian|Qualify a beast part or relationship at NU5 before acquisition|Summoning teaching does not certify a harvested source faculty
SO2|L|Ancient tissue custodian|Qualify preservation and source identity|Not every remain supplies a bloodline or reanimated person
SO3|L|Sage/training-place custodian|Qualify site and bodily source conditions|No generic spring-granted chakra route
SO4|P|Medic’s ordinary reagent supplier|Provide treatment-support ingredients|No plant substitute for actual eye/source identity
SO5|B|Actual eye donor/recipient or human-puppet source|Transfer the source organ or acquire preserved exceptional body under its own route|N4/N7; exact transplant/preservation formula still NU2/NU3
SO6|L|Authored Obito/Hashirama-associated material holder|Resolve actual organ/cell sample, era and procedure|Obito gift has N4 corroboration; Hashirama-cell general use needs separate manga scenes
SO7|P|Qualified clinic or illicit organ supplier|Purchase actual material/service with independent provenance checks|Vendor receipt alone does not prove compatibility or consent
SO8|B|Trained medic or puppet specialist|Commission source-compatible treatment/refit under N6/N7|Teaching, surgery and bloodline ownership are different
SO9|L|Clan/training-site legacy custodian|Qualify exact eligibility and reward|A clan manual is not automatically a blood-key trial
SO10|P|Rival holding a unique graft|Trade, recover or contest the actual organ|No duplication across adult/child timeline counterparts
SO11|P|Traveler with preserved tissue or puppet part|Carry actual source and test local execution|Foreign stamina is not automatically chakra
SO12|B|Your own body altered by a sourced exceptional puppet procedure|Develop only the supported retained core/frame functions|N7 existence; generic cloning, reproductive transmission and copied selves remain unproved''',
 'Hashirama cells, exact eye costs, combined-nature prerequisites, reanimation and summoning consent need their own NU scenes. N10 attribution conflict remains quarantined; no later Boruto mechanics are imported.')

add('jujutsu', 'Body/brain technique, source objects and local medicine; secondary revision-bound evidence, not generic technique-bearing carcasses.',
 [('docs/worlds/jujutsu/SOURCE_LEDGER.md','Directly checked core laws: Cursed Technique r79254, Reverse Cursed Technique r79210, Zenin Clan r79324, Finger Bearer r73010; source/era caveats.'),('docs/research/power-systems/wiki-digests/DIGEST_jujutsu-kaisen.md','DJ4 Heavenly Restriction r79234; DJ9 fuel/formula and external storage; no ambient-harvest certification.'),('docs/gm/dispatch/procgen-2026-10-13/p8/WORLD_VARIATIONS.md','JJK row: ambient capture, cursed-object fabrication and corpse yield remain unverified.')],
 ['Actual object/formula/source and intact bodily carrier; grade alone does not establish effect.','Carrier integrity/containment history; ordinary tissue decay and persistent object law need separate qualification.','Imprint, energy, obligation and biological contamination differ; purification does not automatically erase a technique.','Recipient body/source/target and supported healing; birth restriction is not a chosen installable vow.','Object holder, creator, occurrence, technique source and selected continuity; no anatomy from a clan surname.'],
 'Source a qualified object or supported treatment and keep formula, fuel and access distinct.', 'Containment courier, paid healer, clan warehouse access or explicitly original collector/body AU.', 'Real means, object custody, appropriate healer/source and exact technique constraints.',
 'Clan authority, hostage risk and warehouse permission differ from body eligibility. Imposed birth exchanges have no retroactive consent; contracts and criminal consequences follow exact parties and local rules.', '''SO1|L|Contained curse/source holder|Qualify an actual retained object rather than generic curse flesh|Finger Bearer occurrence does not establish a carcass-to-technique recipe
SO2|L|Preserved historical cursed-object custodian|Select a source-specific ancient remain and containment law|Exact incarnation/source operation requires its own primary scene
SO3|P|Containment facility/site owner|Arrange suitable storage and inspection apparatus|No source-certified ambient energy farm
SO4|P|Ordinary care-material supplier|Provide a compatible physical treatment input|Plants do not randomly produce innate techniques
SO5|P|Actual patient or donor|Commission bounded treatment or acquire a scoped trace|Reverse healing, soul repair and specimen possession differ
SO6|L|Canon holder of a named body/object|Qualify actual occurrence, holder and recipient route|Ryomen Sukuna’s Fingers r78141 is an indexed retrieval locator, not a reread certified recipe
SO7|P|Dealer with actual contained object/service|Transfer titled stock or pay for a qualified procedure|Counterfeit claims and object truth remain separate
SO8|B|Clan warehouse custodian or source-qualified healer|Obtain asset access/medical use without inheriting the technique|Zenin r79324 and RCT r79210; actual availability is authored
SO9|L|Selected trial/ritual authority|Qualify whether a reward really changes a body/source|Culling Game rule authority is not generic genetic inheritance
SO10|P|Rival holding a scarce source object|Negotiate, intercept or contest custody with real means|No omniscient detection or automatic mutual-vow penalty
SO11|P|Traveler carrying physical or cursed cargo|Check directional substrate and local execution|Similar energy names prove no technique conversion
SO12|B|Your own actual embodied technique/source|Develop expression/control under the engraved-body rule|Self tissue possession is not a certified reinstall/clone procedure''',
 'Ancient-object extraction, source retention after death, technique copying/grafting and generic ambient rates remain unverified. Later Modulo/Simurian sources are not blended into main-series era.')

add('bleach', 'Living/spiritual body, artificial-body existence and personal source development; bounded official anchors plus open manufacture gates.',
 [('docs/worlds/bleach/SOURCE_LEDGER.md','B2-B7/B10-B14; BU2 Asauchi manufacture, BU4 spiritual material extraction, BU5 Gigai/artificial bodies, BU6 continuity.'),('docs/research/power-systems/wiki-digests/DIGEST_bleach.md','Older blocked digest; it does not negate newer official ledger evidence.')],
 ['Compatible spiritual carrier and personal source state; equipment quality and release mastery differ.','Physical shell condition versus spiritual actor/source continuity; no default soul spoilage timer.','Mixed spiritual sources, imprint and damage are separate; no generic cleanse into personal release.','Living/spiritual target, perception and actual source architecture; purchased instrument does not give all faction powers.','Maker/source holder, spiritual actor and era; a named artificial body does not imply printable identical selves.'],
 'Source an actual supported instrument/body service and separately develop personal faculties.', 'Original support laboratory, artificial shell, sourced extraordinary power gift or selected Asauchi test.', 'Real apparatus, specialist, source/realm compatibility and personal work.',
 'Research-facility access and personal bonds differ; named experiments and gifts have their own agency/consent. No universal soul-resource market or mandatory spiritual-cruelty score is created.', '''SO1|L|Hollow-part/source custodian|Qualify source retention and extraction at BU4|A defeated soul is not ordinary monster meat
SO2|L|Historical spiritual-source holder|Inspect only after a specific remains/continuity scene|Ancient soul fate and usable substrate remain BU4/BU6
SO3|P|Laboratory or realm-site custodian|Obtain an instrument worksite under its source law|Reishi density alone does not certify harvest
SO5|B|Actual spiritual-source giver or artificial-body specialist|Qualify the gift/service independently from body fabrication|B3/B10 extraordinary transfer and B2 artificial existence; repeatability unknown
SO6|B|Era-authored Rukia, Nimaiya or Urahara source role|Use actual gifted source or test/service context|B2-B4/B10; no procedural duplication of actor’s bond or manufactured soul
SO7|P|Specialist shop with ordinary supported stock|Buy a fitted instrument or shell-support component|Not a marketplace for another actor’s Bankai
SO8|B|Personal-source teacher or source-specific creator|Earn access to supported development/Asauchi test|B4/B7; exact blank production still BU2
SO9|B|Actual Asauchi test custodian|Pass the particular source-qualified test|Development/source context, not bloodline reward algorithm
SO10|P|Rival courier holding a source instrument|Trade or dispute its actual custody|Personal attunement need not transfer with the package
SO11|P|Traveler across a declared realm/world edge|Carry the correct body or substrate and test target interaction|No universal ordinary-body perception or reishi adapter
SO12|L|Your own Gigai/artificial-body custodian|Qualify retained actor and personal source on replacement|Existing artificial life is not a self-copy or revival entitlement''',
 'SO4 botanical body sources remain UNKNOWN. BU2/BU4/BU5/BU6 stay open; later secondary notes do not certify a primary reishi/corpse harvesting law.')

add('fate', 'Class vessels, manufactured lives and ritual authority; each continuity and individual method needs its own source boundary.',
 [('docs/research/power-systems/wiki-digests/DIGEST_fate-series.md','DF1-DF3: Command Spell r404906 Usage; Servant r405040 Characteristics, selected class-vessel subset.'),('docs/worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md','W10/FT: Homunculus r387998 Characteristics/Variants; Familiar r405493 scope warning. Dated secondary inherited statements.')],
 ['Correct vessel/circuit arrangement and selected record subset; a hero’s fame is not graft quality.','Vessel condition, powered manifestation and ordinary tissue viability have different clocks.','Ritual identity/circuit integrity versus contaminants; no universal pure-blood numeric law.','Class vessel, actual source energy and artificial-life method; a catalyst does not supply every heroic ability.','Creator, heroic record, summoned instance and chosen continuity; named heroes/catalysts stay authored.'],
 'Source a manufactured vessel or an eligible ritual manifestation through actual means.', 'Artificial-worker life, summoned perspective, separately sourced catalyst procurement or explicit vessel AU.', 'Maker capability, apparatus, energy and actual ritual/authority terms.',
 'Creator purpose is not proof of absent will. Artificial workers, Masters and independent Servants have different local obligations; consent and compulsion keep exact party-specific rules.', '''SO2|L|Relic/catalyst custodian|Authenticate an ancient bodily relic under one ritual|Catalyst-body relation needs selected source scene; no generic relic-to-gene grant
SO3|P|Ritual/workshop owner|Arrange actual compatible apparatus and energy source|Location grants access/conditions rather than heroic ancestry
SO5|L|Living donor or artificial-life creator|Qualify a biological/circuit source operation|Manufactured existence does not prove arbitrary donor grafting
SO6|B|Authored heroic record and ritual instance|Manifest only the class vessel’s enabled subset|DF2 source-to-vessel relation; not extraction of a famous person’s DNA
SO7|P|Workshop supplier or relic dealer|Buy a real component with independent origin check|False catalyst pedigree can mislead; no guaranteed summon or universal market
SO8|B|Homunculus maker or ritual authority|Create the selected supported artificial-life method|W10 method-specific cognition/growth; no general manufactured-person formula
SO9|L|Specific ritual/trial custodian|Qualify source grant and recipient eligibility|Command charges and class admission do not prove a hereditary trial
SO10|P|Rival Master holding a relic/vessel resource|Trade or contest physical custody and known rights|Command authority, friendship and body control remain distinct
SO11|P|Traveler with a vessel/component|Check local energy/manifestation rather than a name match|Keeping a catalyst is not exporting a working summoning system
SO12|L|Your own stored tissue/circuit record|Qualify a selected manufacturing/replacement method|No generic same-self clone, spare-body or inherited-memory guarantee''',
 'SO1 and SO4 body-changing material sources remain UNKNOWN; mature Homunculus bodies have born-child exceptions, and Familiar scope is partial. Physical catalyst source and resurrection are unresolved.')

add('hunter-x-hunter', 'Specific Chimera Ant queen food-derived offspring and ability predicates; soldiers do not inherit the queen’s sampling operation.',
 [('docs/worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md','W11/HX: Chimera Ant Queen r419578 Feeding/Offspring/Colony, dated secondary; origin/mutation and trait arithmetic unknown.'),('docs/research/power-systems/wiki-digests/DIGEST_hunter-x-hunter.md','DX1-DX3 Nen r421055 Conditions/Vows/Activation Requirements; actual corpse versus replica semantic predicate.')],
 ['Queen-eligible food/source traits versus corpse/replica eligibility for a particular ability.','Food/source state and nest care window; no certified universal birth or tissue-decay rate.','Mixed food ancestry is not a single purity rank; contamination can matter only under a selected rule.','Queen phagogenesis, soldier mating and ordinary Nen methods differ; no food-to-full-mastery formula.','Food source, queen, actual offspring and ability creator; donor and newborn are different people.'],
 'Source real food for the particular queen and generate only a source-compatible original offspring palette.', 'Independent soldier, cooperative nonhuman-food colony AU, commissioned specimen or separately sourced eye-market route.', 'Real food, care, time and nest; rates/mix rules remain proposed until scenes are qualified.',
 'Predation, coexistence and donor consent belong to the chosen colony/local society. A cooperative colony without human predation is an explicit AU, not retrospective canon.', '''SO1|B|Queen’s food collector holding an actual beast|Feed under the specific queen source mechanism|Food-derived offspring traits, not powers for every worker
SO2|L|Holder of preserved ancient food/remains|Qualify viability and queen acceptance|No evidence that fossils supply the same reproductive input
SO3|P|Nest site custodian|Secure shelter, care means and source access|Site supports reproduction; it does not confer Nen
SO4|L|Food supplier holding plants/fungi|Qualify acceptable diet and any trait contribution|Queen’s full diet and universal plant-gene transfer remain unknown
SO5|B|Queen’s acquired food/source person|Apply only the source’s actual food-derived mechanism|Human genetic contribution is inferred in W11, not proved genealogical arithmetic
SO6|L|Authored canon tissue/eye holder|Qualify a named source and scene before transfer|Kurta eyes and transplant markets remain separate retrieval work
SO7|P|Original colony supplier or specimen broker|Trade real food/specimens and attributed origin|Markets do not authenticate Nen or guarantee inheritance
SO8|P|Original cooperative care group|Fund procurement and inspect actual offspring|Institution is an original addition; neither soldier nor researcher becomes queen
SO9|L|Specific ability/trial custodian|Qualify grant rather than importing exam reward logic|A condition is not automatically a bloodline inheritance trial
SO10|P|Rival holding a specimen or target replica|Trade/contest actual stock and retained creator predicate|DX1: true material origin may fail the selected semantic target test
SO11|P|Traveler carrying food or replica|Check destination diet, condition and ability predicate|Cross-world food does not automatically confer foreign soul-bound powers
SO12|L|Your own current/earlier specimen|Qualify actual self-sample use and actor continuity|No self-consumption restoration, shared telepathy or cloned-memory assumption''',
 'Queen-origin mutation, exact diet, trait combinations, birth schedules and retained human memory remain UNKNOWN. Cannibalism is a world-specific route consequence, not a universal progression requirement.')

add('fullmetal-alchemist', 'Manga/2009 and 2003 remain separate; prosthesis, biological fusion and soul-bearing source have different acquisition laws.',
 [('docs/worlds/fullmetal-alchemist/SOURCE_LEDGER.md','Claim ledger: Automail r77396 Drawbacks/Customization; Alphonse r77623 Blood Seal; Philosopher’s Stone r78123 Composition/History; energy-source contradiction.'),('docs/worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md','W12/FM: Chimera r77713 and Homunculus r78132, method/source/continuity qualifiers.'),('docs/research/power-systems/wiki-digests/DIGEST_fullmetal-alchemist.md','DM1/DM2: staged alchemy and stored-soul budget; dated secondary claims.')],
 ['Fitted automail workmanship, viable fusion inputs or actual Stone reserve; these are not one tier.','Tissue condition, maintenance condition and soul-carrier bond are separate clocks.','Metal impurities versus stored souls; people cannot be refined away as ordinary contaminants.','Recipient anatomy, learned comprehension, actual energy payer and selected continuity; no universal successful fusion.','Donor/subject, source souls, mechanic and continuity-specific procedure; material ownership does not prove agreement.'],
 'Acquire fitted prosthetic means or source-qualified care with a real specialist.', 'Biological fusion, soul-bearing source, original non-soul-consuming construct AU or paid mechanical aid.', 'Materials, actual surgeon/maker, recovery and coordination; stored-soul use spends its own source budget.',
 'Military control, independent mechanics and exploited research subjects differ. Willing souls have a specific reported source effect; universal consent mechanics and local legal rules remain separate.', '''SO1|B|Creator holding eligible creature fusion inputs|Use only a selected Chimera method|W12 method-dependent living fusion, not every tissue copying all abilities
SO2|L|Ancient/deceased source custodian|Qualify continuity-specific remains/source interaction|2003 remains effects do not carry into manga/2009 automatically
SO3|P|Mechanic’s shop or actual laboratory|Arrange fitted work and recovery apparatus|Site grants capabilities/conditions, not free exchange or regeneration
SO5|B|Actual donor/subject or soul-bearing source holder|Acquire under the specific fusion/source operation|Chimera subject and Stone reserve retain identities and costs
SO6|L|Era-authored Scar/Alphonse/source holder|Qualify actual array/body/source transfer|Inherited array knowledge and blood seal do not establish cloned ancestry
SO7|B|Automail specialist with titled materials|Commission fabrication/fitting and maintenance|Automail r77396; actual offers/prices remain original proposals
SO8|B|Qualified State institution or independent specialist|Source apparatus/service with actual duties|Institutional status is not a metaphysical rank; access is case-specific
SO9|L|Specific Gate/ritual source authority|Qualify exact bodily cost and result|Not an interchangeable bloodline trial or free-stat exchange
SO10|P|Rival holding a usable component/Stone|Trade or contest actual custody and reserves|No duplicate stored souls or retroactive consent
SO11|P|Traveler with fitted part or soul carrier|Test physical operation and local source separately|Foreign fuel cannot silently become stored human souls
SO12|B|Your current body, automail fit and actual source carrier|Refit or repair under the supported method|Growth/fitting affects practical function; generic earlier-body restoration remains open''',
 'SO4 body-changing botanical sources remain UNKNOWN. FMA energy-source pages conflict; preserve alternatives. Precise chimera manufacture, source consent and generic reversal need selected primary scenes.')

add('chainsaw-man', 'Dated secondary snapshot through2023-11-27; blood fuel, corpse possession, heart fusion and contract prices differ.',
 [('docs/worlds/chainsaw-man/SYNTHESIS.md','§2-§3: Devil r25098, Fiend r24028, Hybrid r25122, Contract r25006; living-Devil boost condition versus unconditioned bullet; Horsemen and chronology conflicts.'),('docs/research/power-systems/wiki-digests/DIGEST_chainsaw-man.md','Earlier blocked digest, superseded in source coverage by the newer synthesis; not primary verification.')],
 ['Blood/flesh source vitality, intact heart/corpse and recipient type; amount is not universal strength.','Living-source boost condition differs from stored-blood condition; exact storage/decay law unknown.','Blood mix and contamination differ from Devil concept identity; no generic hereditary purity.','Human/Devil contract eligibility, Fiend possession and Hybrid fusion each have distinct predicates.','Actual blood donor, corpse owner, Devil/heart identity and contract payer; preserved agency is source-specific.'],
 'Acquire blood or a named contract source for an eligible use.', 'Voluntary donor, bought stock, corpse possession, source-qualified heart fusion or explicit recovery AU.', 'Real blood/vitality, exact contract price, eligible participants and source-specific trigger.',
 'Japan’s hunter-only contract/gun access is a snapshot wiki assertion, not real-world legal advice. Donor consent, legal sacrifice eligibility and NPC reaction are distinct; cruelty follows participants and consequences.', '''SO1|B|Holder of living-Devil blood/flesh|Acquire under a selected source/boost condition|Synthesis retains competing boost wording; no universal swallowed-skill inheritance
SO2|L|Custodian of ancient corpse/remains|Qualify source persistence and eligible possession|Ordinary corpse possession does not prove usable ancient remains
SO3|P|Hunter care/containment site|Arrange guarded recovery and owned supply|Place supports treatment, not genetic awakening
SO5|B|Actual blood donor or human corpse custodian|Use blood for eligible recovery or corpse for source-qualified Fiend possession|Recovery and occupied-corpse identity differ; donor route is authored
SO6|L|Canon heart/blood/contract holder|Qualify actual era, trigger and independent actor agreement|Named exceptional recovery does not become universal supplier stock
SO7|P|Hunter supplier holding a blood batch|Buy titled source stock with scoped condition evidence|Invoice does not prove living-Devil eligibility or all recipient effects
SO8|B|Eligible hunter institution and Devil counterparty|Negotiate exact contract service/access and price|Institution title does not create a valid counterparty or inherited contract
SO9|L|Specific contract/trial authority|Qualify whether a lasting body change is an actual reward|No general bloodline trial from hunter recruitment
SO10|P|Rival holding a usable donor source/contract contact|Trade a physical lot or make an actual introduction|Contact is not possession of someone else’s bargain
SO11|P|Traveler carrying blood/heart|Preserve source and validate destination body use|Earth/Hell concept return is not a cross-franchise cargo law
SO12|B|Your own blood or contract-priced body faculty|Spend/recover only through the actor’s actual mechanism|Own-blood ability cost differs from someone else’s blood; no universal earlier-self bank''',
 'SO4 botanical modification sources remain UNKNOWN. Exact storage, Horsemen eligibility exceptions, corpse identity, concept reincarnation and1983/1984 chronology stay open; no generic reproductive Hybrid ancestry.')

add('frieren', 'Field observation, care and teacher transfer; no canon body-looting or cultivation lineage law supplied.',
 [('docs/worlds/frieren/SYNTHESIS.md','§2-§3: Turk Region r14484 observation-gated learning; Serie r14764 specific transfer/giver loss; Ecology r14559; Heiter r14835 care; selected wiki snapshot2023-12-12.'),('docs/research/power-systems/wiki-digests/DIGEST_frieren.md','Older evidence limit; newer synthesis owns secondary source coverage.')],
 ['Valid observed specimen or real healing/teaching means; specimen rarity does not supply mana.','Current specimen/venom condition or patient treatment window; no general potion decay law.','Ordinary contaminants and observed aura differ; concealed mana is not impure ancestry.','Actual caster/recipient and observed-learning rule; blood possession does not give a demon’s spell.','Witness, specimen, learned method giver and era; record whether transfer cost belongs to the teacher.'],
 'Source field evidence and compatible care, keeping bodily eligibility separate.', 'Guided field study, paid healing, a specific costly teacher transfer or explicit body-modification AU.', 'Travel, actual observations, caster means and the selected transfer cost.',
 'Association access, village hospitality and individual teacher choices differ. Learning from an observation is distinct from consent to blood donation or a spell transfer.', '''SO1|L|Field observer with a qualified fauna specimen|Collect/observe only the supported field property|No inherited monster spell from its tissue
SO3|B|Turk-region observer or guide|Reach the source phenomenon and record the actual observation|Observation-gated procedure, not a permanent bodily constitution
SO4|L|Regional flora/venom supplier|Qualify a specific care or field consumer|Ecology name alone proves no gene/affinity effect
SO5|B|Eligible priest or source-specific teacher|Obtain care or the exact teacher-transfer service|Heiter/Serie roles; costs and eligibility remain specific
SO6|B|Authored Serie/teacher occurrence|Transfer only the selected supported method and giver cost|Not gene extraction or ownership of every spell
SO7|P|Care/instrument supplier|Purchase fitted preparation and field tools|No random mana-infused bloodline herbs
SO8|B|Association/qualified teacher|Earn access to supported study/privilege|Exam standing is not a mana power rank
SO9|L|Exam custodian|Qualify an actual source reward/privilege before treating it as body change|Exam pass does not certify altered ancestry
SO10|P|Rival researcher holding an actual observation/sample|Trade limited evidence or cooperate on fieldwork|Communication changes knowledge, not material truth
SO11|P|Traveler with care material or notebook|Check physical care/observation usefulness|Notebook does not create compatible mana
SO12|P|Your own before/after condition record|Measure care or practice with supported means|No restoration bank or acquired elf lifespan''',
 'SO2 ancient body sources and any genetic/bloodline modification remain UNKNOWN. Longer-lived species do not imply low fertility; teacher transfer is procedural knowledge/source service, not heredity.')

add('reverend-insanity', 'Living Gu/source custody, host capacity, food and implanted enforcement; body change and possession remain selected-method specific.',
 [('docs/research/power-systems/wiki-digests/DIGEST_reverend-insanity.md','DR1 Gu r63539 Taking Care/Rank; DR2 Poison Vow Gu r63835 Introduction/Remove; earlier maps remain leads.'),('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','The Gu Wilds source-world summary; exact body alteration and inheritance scenes not fully qualified here.')],
 ['Gu grade, living condition, compatible host and actual food; rank does not encode every cost.','Living Gu viability and feed readiness, separate from stored ingredient condition.','Actual recipe ingredients/marks and donor facts; no automatic clan-purity power ladder.','Host capacity, fuel, exact body-change/implant rule and actual counter-Gu.','Individual Gu custody, maker, recipe and implanted mark; unique source identity is not mass stock.'],
 'Obtain an eligible living Gu and keep operation/food/host separate.', 'Trade, supported wild collection, refinement, implanted vow removal or source-qualified bodily alteration.', 'Food, activation essence, actual recipe/access and removal means.',
 'Clan trade, coercive implants and voluntary contracts have different actor histories. An implanted enforcer can be removed by the selected counter-method; unclear inner-intent semantics stay unresolved.', '''SO1|L|Wild-Gu or beast source collector|Qualify encounter and capture/source recipe|Wild acquisition does not certify any beast organ as a body Gu
SO2|L|Inheritance/remains custodian|Qualify actual preserved Gu/material and title|Ancient remains are not a universal blood-memory input
SO3|P|Gu nursery or refining-site holder|Secure actual support and recipe apparatus|No place-only aptitude gain without a rule
SO4|L|Gu-food supplier|Qualify actual living-tool food or recipe input|Plants do not automatically transmit a Gu’s faculty
SO5|B|Holder of an actual implanted vow mark|Apply the source-qualified implant/removal operation|DR2 bodily enforcer; does not establish reproductive transmission
SO7|B|Seller holding a real living Gu|Acquire and meet DR1 host/food/fuel requirements|Purchase does not include mastery; exact market availability remains authored
SO8|P|Clan/independent refining specialist|Commission one eligible process with actual terms|Clan membership, recipe rights and bodily aptitude differ
SO9|L|Inheritance-ground custodian|Qualify admission and actual source reward|No blood-only gate inferred from an inheritance label
SO10|P|Rival holding the same Gu or recipe|Trade/recover custody or taught knowledge|A recipe can be copied while the living Gu has one holder unless its rule says otherwise
SO11|P|Traveler with supported live Gu cargo|Check actual feeding, edge law and recipient compatibility|Not universal immunity to foreign energy or guaranteed Gu death
SO12|L|Your own body gains and implanted carrier|Qualify loss/retention/self-donation under chosen method|No generic earlier-body reset or bloodline reinstall''',
 'SO6 named canon body-source route remains UNKNOWN in this selected evidence. Exact consumed-Gu permanent gains are an earlier-map lead, not fresh canon; do not impose a universal once limit.')

add('warlock-magus-world', 'Public sample/research economy with MTL/source qualifiers; sealed WD-S01..04 not exposed or expanded.',
 [('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','Warlock of the Magus World WMW1-WMW3 and WMW12: funded specimen research, chip samples, freshness-priced stalls; explicitly U/design reuse.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_warlock-magus-world.md','GN9/AG6 source ownership; transformation, sealing and family strategy are inferred fit needing exact MTL scenes.')],
 ['Sample integrity and useful measured structure, not donor fame or a chip guess.','Specimen condition during procurement/storage; market freshness hour is a public design lead, not a certified rate.','Measured material concentration, inherited source and contamination separately; no universal purity ceiling.','Actual body/source and selected procedure; chip prediction does not guarantee integration.','Supplier, specimen, scan protocol and source window; sealed routes stay ID/status only.'],
 'Procure one useful sample and obtain a scoped diagnosis before any change.', 'Academy procurement, paid specimen broker, ordinary medicine, source-qualified beast bloodline or explicit original scan AU.', 'Tuition/grant funds, apparatus, sample stock, time and actual procedure specialist.',
 'Specimen legality varies by region in the public owner. Volunteers, prisoner suppliers and corpse lots can produce different institutional/revenge consequences; none proves physical compatibility.', '''SO1|L|Beast-specimen broker or collector|Obtain source-qualified tissue for an actual scan|Exact bloodline extraction/integration needs a selected scene
SO2|L|Ancient specimen/remains custodian|Qualify retained active source and authenticity|Old genealogy alone supplies no reliable source
SO3|P|Rented academy workspace|Pay for storage/diagnostic apparatus access|Site enables study rather than a faculty menu
SO4|P|Reagent grower or prepared-material supplier|Fund compatible ordinary care/research inputs|No named canon herb-to-lineage formula asserted
SO5|L|Donor or deceased-source custodian|Qualify an actual blood/sample operation|Clinical diagnosis differs from acquired bloodline and inheritance
SO7|L|Freshness-priced sample stall|Buy a titled specimen with scoped testing|WMW12 design/source lead, exact market scene and rate open
SO8|L|Academy/grant issuer|Fund procurement and research under declared obligations|Public WMW1 economy lead; not universal monopoly or bloodline entitlement
SO9|L|Legacy-place custodian|Qualify recipient/reward rather than a generic lineage trial|No supplied exact inheritance-ground recipe
SO10|P|Rival holding an inspected sample|Trade a portion/report or collaborate|Research access and actual sample custody change separately
SO11|P|Traveler with preserved specimen|Test directional use and retained source|World fusion premise does not authorize every foreign organ
SO12|P|Your own diagnosed specimen archive|Retain dated samples and compare bodily change|A record is no guaranteed same-self reconstruction or descendant faculty''',
 'SO6 exact named canon source route remains UNKNOWN. Sealed WD-S01..04 stay ID-only. BP6, BD8/9 and heritable source editing need exact source qualification; no new MTL/chapter proof claimed.')

add('genetic-ascension', 'Gene-window biology and ordinary beast-product economy; exact gene acquisition is not established by the public status-window summary.',
 [('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','GEN2 gene-window caretaker and GEN4 quality hides/meat; source-world qualified summary, not new gene recipe.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_genetic-ascension.md','GN9/CL2 ownership; founder/heir-trial and corpse-to-power links are inferred candidates.')],
 ['Intact useful sample or hide quality versus gene grade; do not conflate tanner and genetic researcher.','Meat/tissue viability versus gene-window timing; no generic gene shelf life.','Measured mixture or line expression; no demonstrated universal pedigree dilution equation.','Current gene state/body/caretaker and selected procedure; food stock does not automatically install genes.','Hunter/source beast, sample lot, test issuer and gene-window occurrence.'],
 'Source physical specimens and a scoped diagnosis during a supported window.', 'Care-supported research, market specimen, source-qualified gene operation or explicit freely-crossing-genes AU.', 'Actual tissue, care time, apparatus and window-related body risk.',
 'Civic work and gene ambitions are separate lives. Caretakers, hunters and diagnostic authorities have their own rights; no generic gene caste or compulsory predation is inferred.', '''SO1|L|Hunter holding an identified beast sample|Collect tissue beside the ordinary hide/meat chain|GEN4 supply exists as summary; gene integration law still unknown
SO3|P|Caretaker’s prepared room|Arrange conditions for a supported gene window|Care/site makes work possible, not a new inherited trait
SO5|P|Volunteer or patient|Give a scoped sample for comparison|Testing is evidence, not an accepted new gene
SO7|L|Hunter/tanner/sample merchant|Purchase a titled physical lot|Public quality trade lead; bodily gene use needs its own source law
SO8|P|Original clinic/civic care contract|Fund diagnostic work and care without forcing gene ambitions|Service obligations differ from ancestry recognition
SO9|L|Proposed heir/legacy custodian|Qualify a real trial and transmitted source|B1 BP8 is inferred fit, not established canon
SO10|P|Rival sample holder|Trade data/portions or contest real procurement|No universal shared knowledge from gene grade
SO11|P|Traveler with titled tissue|Keep source/condition and test destination method|GEN8 free gene crossing is a changed premise, not default canon
SO12|P|Your own dated sample/window history|Compare expression and observed recovery|Stored data/tissue does not restore the prior body''',
 'SO2, SO4 and SO6 actual body-source routes remain UNKNOWN. GEN9 rerolled lineage truth stays sealed; no status screen establishes a corpse-to-power or clone-personhood recipe.')

add('perfect-run', 'Public elixir-family and market leads; holder-specific checkpoint retention remains separate from acquired bodily powers.',
 [('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','The Perfect Run PR1-PR4, especially PR3 power-by-elixir/market general-knowledge lead.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_perfect-run.md','Body change and source risks need qualification; PR-S1/PR-S2 remain sealed.')],
 ['Authentic elixir family, batch and usable recipient effect, not family-name rarity.','Container seal and actual stability law; no source-certified universal expiry.','Authenticity/contamination and supported dose are distinct; exact mixing effects unknown.','Actual body and selected elixir rule; checkpoint restoration is not every buyer’s faculty.','Maker/holder, batch and timeline; sealed holder truth remains ID-only.'],
 'Investigate an actual elixir lot and its claimed body effect.', 'Licensed supplier, black-market purchase, original assay service or separately qualified alteration route.', 'Purchase, independent examination, preparation and actual source risks.',
 'Corporate/control claims and black-market relationships follow the chosen actors. Consent is relevant to the specific buyer/subject, not an assumed universal law governing every elixir.', '''SO5|L|Recipient/producer linked to an elixir procedure|Qualify actual body sample or source relation|No generic blood donation copies elixir powers
SO7|L|Dealer with a real elixir batch|Inspect provenance and obtain under selected terms|PR3 is G lead; exact preparation/acquisition needs source qualification
SO8|P|Original assay/clinic provider|Compare claimed batch and supported bodily response|Institution/service is authored, not a universal canon regulator
SO10|P|Rival holding a rare authentic vial|Trade/recover the actual object|Material ownership and checkpoint-holder memory differ
SO11|P|Traveler with vial or known method|Check actual carried matter and destination consumer|Loop knowledge is not a delivered vial
SO12|L|Your own pre-change specimen/checkpoint|Qualify what the actual holder restores|No gene bank or copied checkpoint entitlement''',
 'SO1-SO4, SO6 and SO9 source routes remain UNKNOWN. PR-S1/PR-S2 are not opened; exact elixir mixture, risks and retention need source-scene qualification.')

add('cradle', 'Remnants and path-specific bodily preparation are public general-knowledge leads; blocked digest certifies no new route.',
 [('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','CRD2-CRD4; CRD3 Remnants as hazards/resources, explicitly G leads.'),('docs/research/power-systems/wiki-digests/DIGEST_cradle.md','Evidence limit: blocked_no_revision; earlier mappings remain unverified.')],
 ['Actual Remnant faculties and compatible preparation; donor rank alone is insufficient.','Manifestation/source retention and intact condition need exact scenes; no ordinary tissue-decay default.','Aspect/source content and contamination, not a universal bloodline purity.','Recipient Path/body, supported bond/integration and energy; whole donor mastery not presumed.','Dead source actor, actual Remnant, custodian and chosen era; no duplicate source roll.'],
 'Qualify a real Remnant/source before any body-changing procedure.', 'Trade, teacher-guided path preparation, noncombat service or explicit original Remnant integration.', 'Actual source, compatible method, site/support and source-specific risks.',
 'Remnant custody, teacher agreement and clan claims have local rules. A dead source and the retained manifestation are not automatically the same subject or an owned obedient servant.', '''SO1|L|Sacred-beast source custodian|Qualify an actual source/part and usable operation|No automatic beast-tissue gene loot
SO2|L|Custodian of an ancient Remnant/remains|Qualify persistence and provenance|Old remains and current Remnant existence differ
SO3|L|Path training-site custodian|Qualify actual environmental energy and practice|A generic aura-rich label proves no bloodline grant
SO5|L|Deceased-source Remnant custodian|Qualify transfer and supported bodily use|CRD3 source lead; exact Remnant integration still open
SO7|P|Original source broker|Trade actual inspected stock and title|No canon market availability asserted
SO8|P|Original teacher/service group|Commission compatible preparation|Institution does not supply missing source by affiliation
SO9|L|Source-specific legacy ground|Qualify admission and reward|No inferred blood-only trial from a clan name
SO10|P|Rival holding a Remnant/source|Contest or share only supported custody/usage|Duplication/fusion requires actual law
SO11|P|Traveler with a supported source carrier|Test destination substrate and operator|No cross-world energy equivalence by name
SO12|L|Your own source/body record|Qualify retained faculties after body change|No freely cloned self or generic reincarnation bank''',
 'SO4 and SO6 source routes remain UNKNOWN. All exact Remnant acquisition, integration, ancestry and transformation rules require a primary source pass; no fresh canon claims.')

add('speedrunning-multiverse', 'Bloodline-gated legacy and new-vessel fit are bounded source-summary leads; estate/body/soul carriers differ.',
 [('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_speedrunning-multiverse.md','Owned BP8/OB5/MS2; identity F1/F2/F4 and succession bloodline-gated legacy trials.'),('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','SPM2/SPM3/SPM7-SPM10; bodily art fit versus remembered art and estate.')],
 ['Eligible source carrier and art fit; trial reward and taught control differ.','Current vessel condition versus retained estate source; renewal/retention are source-specific.','Actual lineage expression and contamination; no generic purity percentage supplied.','Specific bloodline gate and current body; memory of an art does not confer executable anatomy.','Vessel, source trial, realm occurrence and estate custodian; counterpart inventories do not duplicate.'],
 'Qualify the actual eligible carrier and a real legacy reward.', 'Estate caretaker procurement, new-body practice, qualified reserve vessel or explicit alternative trial gate.', 'Travel/run terms, current-body practice and real source/estate support.',
 'Estate managers, trial custodians and local relatives have separate interests. A held bloodline does not make all natives obedient or waive a rival’s claim.', '''SO2|L|Graveyard/legacy custodian|Qualify a real source object in a selected realm|SPM8 opportunity is a proposal, not a blood recipe
SO3|P|Estate preparation room or realm practice site|Prepare current body for a retained art|No place-only inherited mastery
SO5|L|Actual vessel/body provider|Qualify occupancy and retained source before use|Reserve body is not independently minded descendant by default
SO7|P|Original realm supplier|Purchase compatible care/source support|Not a universal multiverse market
SO8|P|Estate caretaker or qualified teacher|Arrange practical support and instruction|Office/estate ownership differs from bloodline faculty
SO9|L|Actual bloodline-gated legacy custodian|Test carrier and transfer a source-qualified reward|Bounded B1 ownership; exact trial scene/reward remains primary gate
SO10|P|Rival holder of a legacy key/source|Trade or contest actual custody|Blood key, family claim and actual faculty need separate proof
SO11|L|Run/return source carrier|Qualify soul-bound core, body and material retention per edge|SPM10 changed run premise does not prove universal export
SO12|L|Your own prepared vessel/earlier sample|Qualify source-fit restoration and continuing subject|No copied inventory or ordinary heir from a spare body''',
 'SO1, SO4 and SO6 actual supply routes remain UNKNOWN. Exact trial, body retention and soul/core law need source windows; SPM9 changed truth stays sealed.')

# Original public palettes retain their design status; they establish no canon.
add('original-frontier', 'Existing gathering material families and practical care; extraordinary organ integration is an explicit additional prototype proposal.',
 [('docs/GATHERING_AND_RESOURCE_USES.md','Five resource families, methods/preservation, recurring people and useful consumer loop.'),('docs/worlds/original-frontier/WORLD_BRIEF.md','Signature decisions, residents and continuity; no selected hereditary campaign.')],
 ['Intact useful gland, conditioned herb and actual prepared dose; rank does not confer potency.','Selected delicate batches only; ordinary old herbs/loot do not acquire global decay.','Composition, contaminants and preserved geometry; no clan-purity model.','Declared treatment or original organ function and this body; sample does not grant the monster’s skill.','Creature/patch, actual holder, harvest method and processing record, with claim versus assay separate.'],
 'Gather a useful care ingredient and commission a real treatment or fitted aid.', 'Original one-organ gene-thief prototype, nonlethal secretion husbandry, donor service or imported-compatible aid.', 'Tools, owned stock, actual processor, care and practiced changed movement.',
 'Original grower permissions, donor agreements and witnessed theft/revenge vary per local actor. Cruelty is a chosen world/route adjective, not a compulsory penalty or hunt-only progression.', '''SO1|P|Hunter/tender with a gland or shed part|Choose intact extraction or nonlethal collection|Care ingredient or declared new-organ prototype; no automatic skill copy
SO2|P|Original ruin custodian with a fossil/remain|Survey, obtain title and test retained structure|Blueprint/evidence first; viable extinct-line revival requires a new law
SO3|P|Original spring/grove custodian|Arrange exposure only under a declared local adaptation rule|Specific comfort/condition change, not unspecified free bloodline
SO4|P|Grower with viable herb/culture|Select leaf/root/cutting and preserve its useful fractions|Care input, repeat supply or original symbiotic function
SO5|P|Volunteer, deceased estate or contested donor|Record actual sample rights and collection route|Diagnosis/donation with actor-specific consequences
SO6|P|Locally authored notable founder or master|Qualify an actual named source donation|Original cast stays authored, not generated famous-cell stock
SO7|P|Merchant holding a real batch|Buy and verify origin/condition independently|Fakes alter beliefs; useful properties stay true
SO8|P|Original clinic/guild custodian|Fund a supply/treatment contract|Service duties and body change have separate causes
SO9|P|Original inheritance-ground keeper|Author an eligible source trial and funded reward|Gate may accept kin, an outsider or another proved means
SO10|P|Rival holding a rare source|Trade/share/contest actual custody|Actual available stock and witnessed disputes
SO11|P|Traveler with tissue/herb/aid|Test one destination consumer with its real operator|Keep unusable cargo owned; decoration, sale or return can remain useful
SO12|P|Your own archived sample/current body|Compare a declared pre/post change and retain sample custody|Restoration only if a new actual template-repair law is selected''',
 'All new source procedures here are proposals. Existing native animal care, loot and herbs do not prove carcass partitioning, generated chemistry, gene editing, inherited faculties or native persistence.')

add('crucible', 'Original energy-rich ecology with separately proposed body tempering, bloodlines and Concept resources.',
 [('docs/WORLD_CARDS.md','§2 The Crucible; Growth and How you grow. Original card, not a direct A Novel Concept adapter.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_crucible.md','CN5/GN2/TR3/BM2 ownership; purification and body tempering remain distinct.')],
 ['Active tissue role, intact Concept carrier and useful preparation, each separate.','Fresh living substrate versus stable mineral/fragment; site exposure uses actual played time.','Blood-source concentration, corruption and reagent contaminants are different fields.','Current body, energy acceptance and chosen tempering/bloodline method; no guaranteed skill uptake.','Creature/site, actual primordial-source relation if used, custody and method; named singular seats do not multiply.'],
 'Source an original compatible preparation for one body process.', 'Nonlethal beast pact, purchased source, site tempering, family source or openly declared Concept exception.', 'Actual support, energy handling, workspace, material and tribulation terms where selected.',
 'Refuge contracts, wild hunting and patron obligations differ. Predation and generosity are both fitting choices; no universal purity hierarchy or mandatory flaw is selected.', '''SO1|P|Refuge hunter/tender|Collect blood/gland or negotiate a supported pact|Selected anatomy/energy function, not whole creature mastery
SO2|P|Ruins custodian|Recover a retained ancestral source after inspection|Origin/contamination and surviving source need real laws
SO3|P|Energy-field/site holder|Use a compatible controlled tempering exposure|Site conditions and bodily practice create a specific adaptation
SO4|P|Refuge grower|Produce a source-compatible herb or living symbiont|Growth supply has actual stock and propagation law
SO5|P|Donor or founder estate|Transfer a supported source sample/mark|Transmission and recipient development stay separate
SO6|P|Authored notable champion/source holder|Negotiate one actual donation or legacy|Original notable remains an authored actor
SO7|P|Merchant with compatible lot|Buy, assay and process source stock|Price does not prove compatibility
SO8|P|Refuge clinic/teacher|Commission a supported body operation|Access/funds, not automatic lineage allegiance
SO9|P|Actual trial-space custodian|Earn an authored source reward under stated suppression/time terms|No generic once-per-save or mandatory blood gate
SO10|P|Rival civilization’s source holder|Trade or contest actual stock with their means|No player-level scaling or omniscient pursuit
SO11|P|Rift carrier with permitted stock|Validate edge and local active/cargo use|Timed absence and usable energy are separate
SO12|P|Your own retained repair template/sample|Restore only through an authored working template process|Body, soul injury, practice and property retain separately''',
 'Every route is original P. Exact numerical purification, universal shared blood pressure and direct source-book adaptation remain unselected; no singular Concept seat duplication.')

add('gu-wilds', 'Original living-tool world; separate from Reverend Insanity source law.',
 [('docs/WORLD_CARDS.md','§3 and How you grow: living Gu food, recipes, aptitude and inheritance caves; original inspiration.')],
 ['Living-tool condition, recipe quality and host fit; rank is separate.','Food readiness and living Gu support; prepared stock condition only when relevant.','Selected recipe composition and aptitude claims; no universal pedigree purity.','Host capacity, actual food/fuel and selected bodily alteration method.','Gu holder, maker, source site and recipe; actual unique identities conserved by card law.'],
 'Acquire a compatible living means and feed it for a declared body use.', 'Tended Gu, market stock, clan allocation, inherited recipe or explicitly supported aptitude change.', 'Food, essence, skilled recipe execution and actual custody.',
 'Clan assessment, coercive ownership and independent trade are local facts. A removal/refinement method can offer a route around an imposed bodily obstacle at its own cost.', '''SO1|P|Mountain collector/tender|Capture or tend a supported living Gu|Source tool and acquired body effect are separate
SO2|P|Inheritance-remains custodian|Recover retained Gu/material with known support|No old corpse creates a universal ancestor memory
SO3|P|Nursery/refining-place owner|Rent access and maintain producer conditions|Site supports actual source production
SO4|P|Food/reagent grower|Supply a qualified diet/recipe ingredient|Actual propagation and feed stocks matter
SO5|P|Donor or implanted-mark holder|Apply selected body/implant recipe|Consent and clan ties do not follow automatically
SO7|P|Caravan seller|Transfer one real living Gu/material lot|Food and recipe rights cost separately
SO8|P|Clan/refining-school keeper|Earn or negotiate actual stock and instruction|School permission is not genetic faculty
SO9|P|Inheritance-cave custodian|Pass the authored eligibility test and receive actual source|Tests may accept an outsider through another fitting means
SO10|P|Rival holding the needed living source|Trade, capture or cooperate|Real custody and foreseeable relationship outcomes
SO11|P|Traveler with supported live cargo|Supply food and a working destination operator|Research can change edge behavior; no unconditional death or free conversion
SO12|P|Your own altered body/sample|Preserve a supported template or diagnose retained changes|Not a generic copied self or inherited tool mastery''',
 'SO6 canon-figure stock is not selected for this original card. Exact body recipes and foreign-law bypasses need new authoring; source-book particulars are not silently imported.')

add('fog-city', 'Original potion/role world; exact pathway inputs and custody remain authored, separate from LOTM/COI canon.',
 [('docs/WORLD_CARDS.md','§4 and How you grow: potion ingredients, role digestion, organizations and body/remnant hazards.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_fog-city.md','SB5/MS4/OB2/OB6; body risk and funeral custody differ.')],
 ['Authentic source ingredient and recipe role, not generic high-quality blood.','Physical auxiliaries versus retained occult source; chosen preservation law only.','Imprint, contamination and pathway content separate.','Recipient path, digestion and prepared procedure; common tags do not grant every route.','Source owner, hazardous remnant, current lot and inspector; hidden truths stay withheld.'],
 'Acquire a titled source and an actual preparation before a role-linked body change.', 'Church supply, secret-market lot, original remnant recovery or auxiliary farming.', 'Formula, specialist, stock and supported containment/acting.',
 'Church registration, secret-club terms and corpse customs differ by neighborhood/actor. A harsh occult supplier and a voluntary donor have different consequences, not different unearned chemistry.', '''SO1|P|Qualified occult-creature collector|Take an exact authored ingredient|No automatic creature-to-complete-power grant
SO2|P|Old remnant/ruin custodian|Inspect and title a preserved source|Imprint/corruption are separate source fields
SO3|P|Contained preparation-room keeper|Secure working conditions and apparatus|No place-roll minting of a singular source
SO4|P|Auxiliary grower|Propagate a compatible support ingredient|Exact main ingredients remain identity-bound if their law says so
SO5|P|Living donor or deceased estate|Transfer a selected source under actual custody law|Inheritance, source extraction and person revival differ
SO7|P|Secret-club seller|Acquire authenticated material or pay for assessment|Fake provenance changes belief, not true source
SO8|P|Church/clinic keeper|Earn stock or supported treatment with actual duties|Allegiance and body faculty differ
SO9|P|Legacy-room custodian|Pass a declared source-specific test|No compulsory hereditary admission
SO10|P|Rival holding the desired source|Negotiate, steal or recover real custody|Actual source scarcity and witness knowledge
SO11|P|Traveler with a sealed batch|Check cargo/active use separately|Knowledge or material alone does not guarantee foreign potion function
SO12|P|Your own retained sample/source|Use a declared template/diagnostic process|No copied knowledge, free characteristic or earlier-self resurrection''',
 'SO6 canon cast does not belong to this original card. Exact source/formula/cleanup/transmission laws need authored selection; no automatic LOTM rule import.')

add('dreaming', 'Original trial-grant world; material, body/soul grant and controlled flaws remain this card’s authored rules.',
 [('docs/WORLD_CARDS.md','§5 and How you grow: trial grant, soul shards, Memories/Echoes and two-realm carriage.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_dreaming.md','PH6/CN8/MS5; no hereditary Aspect or dynasty default.')],
 ['Intact compatible shard/part and useful trial grant, separate from creature danger.','Part condition, guarded rest and supported realm transition; no global shard decay.','Contamination/weave state versus individual Flaw; no blood-purity ladder.','Actual recipient, supported grant, soul/body and Memory use.','Source creature, actual trial, realm and current owner; Echo and source subject differ.'],
 'Prepare at a guarded anchor, acquire actual source stock and face a selected grant trial.', 'Purchased equipment, logistics service, original relic route or explicit altered trial law.', 'Real preparation, guard/support, compatible source and the chosen trial’s costs.',
 'Citadel access, clan sponsorship and salvage title have different authorities. Guardianship and donor consent are route-specific; no universal cruelty requirement.', '''SO1|P|Realm hunter with actual shard/part|Collect under authored source retention law|Material use and whole creature ability differ
SO2|P|Ruins/relic custodian|Recover intact preserved stock|Old lineage source needs an actual recipient operation
SO3|P|Guarded-anchor owner|Arrange rest and compatible source preparation|No generic safe-sleep promise or body reset
SO4|P|Ordinary supply grower|Provide compatible preparation/care inputs|Not hereditary Aspects from random herbs
SO5|P|Examiner/donor|Transfer a scoped sample or give supported care|Individual faculty and copied evidence differ
SO7|P|Source/Memory seller|Transfer actual stock with binding/custody|No infinite drop refill of unique relic
SO8|P|Citadel/academy keeper|Fund preparation and specific training|Office and source grant differ
SO9|P|Actual trial rule and reward custodian|Receive the selected body/soul faculty after its causal trial|Trial source is not biological heredity
SO10|P|Rival expedition holding a source|Trade/share/contest under actual terms|No universal player-relative scaling
SO11|P|Declared realm/world carrier|Apply selected body/cargo transition|Two realms do not imply two copies of stock
SO12|P|Your own supported body/soul template|Use only a chosen restoration operation|Retain body, subject, grant and equipment separately''',
 'SO6 named canon source is not selected for the original card. Direct Shadow Slave lineage mechanisms are not imported; bodily effects and exact trial law remain unimplemented proposals.')

add('salvage-reach', 'Original technological source chain: real parts, implants and paid replacement/backup laws, not inherited mechanical mastery.',
 [('docs/WORLD_CARDS.md','§8: four machine gates, trained stats plus implants, paid backup body and actual power budgets.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_salvage-reach.md','BM1/OB5; donor/body/source and backup subject continuity need actual declared transfer.')],
 ['Connector geometry, intact actuator and usable template; item grade does not authenticate a person.','Living tissue viability, battery charge and mechanical wear differ; parked backups need a declared support law.','Alloy/material contamination and firmware/template tampering; neither is ancestral purity.','Body/interface, actual power and control; a new limb still needs coordination unless installed method truly supplies it.','Wreck/module serial, maker, prior owner, firmware/template revision and licensed or contested custody.'],
 'Acquire a titled part and commission a compatible fitted implant.', 'Salvage, corporate clinic, self-build, licensed/pirated module or actual paid backup.', 'Blueprint, actual construction, power, fitting, maintenance and backup support.',
 'Corporate recall rights, clinic agreements and black-market repairs differ. Paid body ownership is not permission to delete an occupant; empty manufactured vessels and independent AIs have separate states.', '''SO1|P|Original engineered-beast caretaker|Obtain a supported biological sensor/shed substrate|Organ module needs an actual interface; no copied creature mind
SO2|P|Derelict-body/wreck custodian|Salvage an intact prosthetic or preserved template carrier|Ancient provenance/firmware risk affects a real later use
SO3|P|Clean fitting shop/recovery facility|Pay for compatible apparatus access|Facility supports work, not free template restoration
SO4|P|Synthetic-culture producer|Obtain a compatible tissue/scaffold input|Body workshop needs actual production law, not arbitrary plant tags
SO5|P|Volunteer or actual manufactured-vessel owner|Acquire tissue/template rights or an empty shell|Personhood and sampling agreement are explicit
SO7|P|Part merchant/corporate clinic|Buy module/service with inspection and real terms|A licence or invoice is not compatibility proof
SO8|P|Corporation/militia/service guild|Accept implant support with stated service/recall terms|Institution rights and physical kill-switch presence differ
SO9|P|Original certification/trial issuer|Earn an actually held module or service entitlement|Passing supplies stock/access, not instantaneous expert control
SO10|P|Rival salvager with the desired module|Trade/recover/intercept actual custody|Power budget and module serial stay attached
SO11|P|Traveler with implant or parts|Check power and local operation independently|Foreign magic rechanneling requires an actual adapter
SO12|P|Your own paid body/template archive|Use the declared restoration and subject-transfer law|No automatic duplicated you, equipment or independent cloned soul''',
 'SO6 canon-figure biology is unselected. This card authorizes possibilities, not implementation; sample archives, template cloning and exact backup continuity need an authored carrier contract.')

add('red-basin', 'Original prosthetic/care economy; native magic, limb regrowth and resurrection absent by default, imports remain mechanism-specific.',
 [('docs/WORLD_CARDS.md','§9 The Red Basin: body as infrastructure, fabrication league, wells, fitted parts and religious distrust.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_red-basin.md','WR1/WR3/WR5/BM1/OB3; replacement alters work and wages, not ancestry.')],
 ['Part fit, repairable assembly and clean care input; prestige does not raise a part’s performance.','Living wound/sample condition versus mechanical wear and stored spares.','Water/reagent contamination and part material integrity; no biological bloodline-purity law.','Actual limb mount, power/control and body; no local regenerative magic supplied.','Fabrication lot, maker, current owner, fitting record and witnessed modifications.'],
 'Source a fitted replacement and actual rehabilitation.', 'Local maker, salvage, imported working aid, voluntary donation or an explicit new tech route.', 'Water, titled parts, mechanic/medic time, fit and local transport.',
 'Fabrication licences, well-house debts and religious suspicion depend on who knows what. Cruel extraction, voluntary care and smuggled parts have distinct witnessed local consequences.', '''SO1|P|Local carcass-product supplier|Obtain useful dressing/material support by an authored rule|No native beast-organ superpower
SO2|P|Old workshop/remains custodian|Recover a usable mechanical spare|No local corpse revival or innate bloodline return
SO3|P|Well/clinic custodian|Obtain water and a real clean worksite|Site access supports bodily care
SO4|P|Grower with supported dressings/care stock|Purchase or collect a compatible ordinary input|No random herb-based limb regrowth
SO5|P|Donor/patient or estate|Record sample/material custody and fit evidence|Consent, body ownership and physical use differ
SO7|P|Fabrication stall or illicit part trader|Buy a real fitted part and inspect source|Certificate and actual mechanical condition differ
SO8|P|Fabrication league/clinic|Earn an actual service under local terms|Institutional recognition does not itself install hardware
SO10|P|Rival carrier holding a usable part|Trade/cooperate/contest source custody|Work capacity and actual claims change
SO11|P|Traveler with a compatible aid|Test real power and local function|Absence of native magic is not an automatic ban on every import
SO12|P|Your own measurements/removed hardware|Preserve fitting evidence and reusable real part|No generic earlier-self clone or healing menu''',
 'SO6 and SO9 body-source routes are unselected. All new local suppliers/processes are original proposals; no accepted expansion of the card’s native magic is made.')

add('orchard-city', 'Public original O2: living city graft industry, voluntary shared embodiment and prepared empty-vessel separation.',
 [('docs/worlds/self-as-player-expansion-2026-10-13/ORIGINAL_WORLDS.md','O2 Two Voices in the Orchard City: graft houses, workshop control, major shared-body agreement and grown empty vessel.')],
 ['Responsive tissue geometry and useful grown structure; a plant trait does not automatically grant human tissue-sense.','Living graft viability, substrate/growth support and harvest window.','Mixed culture/infection and structural integrity, not clan pedigree.','Recipient/body, actual graft method and declared tissue-sense design; city branch and human vessel have different consumers.','Graft source, grower, body occupants and agreed operation; original canon is authored design, not a novel claim.'],
 'Procure responsive tissue and apply a known compatible graft with both occupants’ actual permissions.', 'Plant structure, donor tissue, manufactured empty vessel, independent craft contract or voluntary separation.', 'Workshop, viable input, growth support, actual procedure and shared-fund agreement.',
 'O2 gives standing consent for ordinary work but requires both subjects’ agreement for major bodily/shared-fund changes. Coercive variants require an explicit AU and causal NPC reactions, not a hidden default.', '''SO2|P|Old graft-house specimen custodian|Recover an intact retained culture/structural template|Old physical form is not an ancestral mind
SO3|P|Council/leased branch custodian|Negotiate suitable growing/work space|Branch allocation and public authority are separate
SO4|P|Living city or independent graft grower|Harvest/propagate responsive tissue with actual support|Tool, medicine or grown-body substrate through distinct procedures
SO5|P|Volunteer/patient and current occupants|Take tissue or agree a major body operation|Both subjects and donor permissions keep their own records
SO7|P|Graft house/material seller|Buy a viable culture and supported fitting service|Source identity, growth stage and title remain inspectable
SO8|P|Council/licensed workshop|Commission an actual public-care/body project|Licence doesn’t erase personal agreement
SO9|P|Original guild qualification custodian|Award an actual template/service after fitting demonstration|Trial tests competence, not assumed genetic kinship
SO10|P|Rival graft house holding a culture|Trade, co-develop or contest the source|Culture growth needs support; no free stock replication
SO11|P|Traveler with live tissue/vessel|Check destination habitat and subject passage separately|Information thread does not automatically carry living cargo
SO12|P|Your own shared body/template and prepared empty vessel|Separate subjects under O2's actual refuge/vessel design|No new occupant evicted, private memories not automatically fused''',
 'SO1 beast source and SO6 canon-figure source are unselected. The source is an original public palette; growth rates, template laws and actual implementation remain open.')

add('borrowed-floodwarden', 'Public original O1: prepared replacement body with compatible resonance organs and one continuing subject.',
 [('docs/worlds/self-as-player-expansion-2026-10-13/ORIGINAL_WORLDS.md','O1 The Borrowed Floodwarden: mineral command/resonance organs, workshop preparation, dormant home body and actual transfer.')],
 ['Functional resonance geometry and working replacement body; familiar face is not proof of subject.','Body/organ integrity and supported dormancy, separately from home calendar.','Tissue/material contamination versus resonance pattern; no bloodline purity scale.','Compatible resonance organs and actual transferred operating pattern; property and source are different.','Prepared vessel, maker, continuing subject, original home body and actual moved cargo.'],
 'Commission a compatible replacement vessel with a declared single-subject transfer.', 'Keep restored body, return to dormant original, remain abroad or prepare an equivalent resonance body.', 'Workshop materials, actual organs, passage/refuge apparatus and reconstruction work.',
 'Restored operating keys and harbor title are separate claims. Empty prepared vessels differ from occupied donor bodies; local courts/keepers retain their own authority and relationships.', '''SO3|P|Harbor test-basin/workshop custodian|Arrange compatible medium and organ fitting conditions|Site supports source operation rather than inheriting office
SO5|P|Actual organ maker or consenting donor|Provide a compatible resonance structure under authored means|Donor origin does not transfer person or harbor title
SO7|P|Prepared-body/material seller|Commission an actual empty vessel and inspection|Body, trained pattern and carried inventory differ
SO8|P|Workshop/qualified rite operator|Build and operate a supported transfer/refuge|Operating authority is explicitly negotiated, not global
SO10|P|Rival keeper with a needed source component|Trade/dispute title using actual evidence|Competing claims do not duplicate organs
SO11|P|Passage operator and real body carrier|Move the subject or actual current body under O1|Dormant original and current vessel do not create two conscious yous
SO12|P|Your dormant original or prepared replacement|Use actual refuge/return transfer with separate cargo custody|Same subject; no world rewind, source injury erasure or property teleportation''',
 'SO1-SO2, SO4, SO6 and SO9 material routes are unselected. This is authored original design, not inferred source-book resurrection or clan genetics.')

add('many-door-observatory', 'Public original O3: instrument bodies with no independent subject; actual senses, atlas and cargo each retain their own carrier.',
 [('docs/worlds/self-as-player-expansion-2026-10-13/ORIGINAL_WORLDS.md','O3 The Many-Door Observatory: grown instrument-body, procedural atlas, link-carried experience and lost cargo recovery.')],
 ['Working vessel senses/reach and actual local instrument function; knowledge is a separate atlas.','Vessel condition and link support; no source-certified living-tissue decay law.','Material/circuit faults and signal noise; no ancestry purity.','Selected district physics, vessel design and link; user outside is not a local cloned person.','Vessel maker, sponsor, district, link identity and cargo holder; subject continuity is authenticated by real means.'],
 'Source a district-compatible vessel and actual operating atlas.', 'Survey shell, sensory-specialized replacement, instrument repair or earned person-carrying door.', 'Maker/support, compatible design, physical retrieval and apparatus.',
 'Sponsors, councils and survey guilds have different permissions. Instrument bodies have no independent occupant under O3; making an independently minded one is a declared changed premise.', '''SO2|P|Abandoned station vessel custodian|Recover a repairable old shell/component|Remains salvage recovers physical capacity, not the former subject
SO3|P|Station/workshop keeper|Select actual district physics and fitting apparatus|Place compatibility changes which body functions work
SO4|P|Vessel-growth workshop|Provide supported living scaffold/input|Exact growth mechanism is authored, no arbitrary plant-to-person rule
SO7|P|Station instrument seller|Acquire a titled district-compatible vessel/part|Invoice doesn’t grant working atlas or active link
SO8|P|Survey college/sponsor|Supply a real instrument-body and atlas under terms|Recognition and material/source remain different
SO9|P|Survey certification authority|Demonstrate fit and receive an actually funded vessel/service|No hereditary trial or conjured stock
SO10|P|Rival surveyor with a scarce compatible shell|Trade/share/recover actual hardware|No automatic access to rival’s experience or private cargo
SO11|P|Door/connection operator|Move body/cargo or route one subject’s link under actual edge law|Different districts need specific compatibility; no duplicated cargo
SO12|P|Your current instrument-body and outside self|Replace a destroyed shell while retaining link-carried experience|Cargo stays at destruction site; same continuing outside subject''',
 'SO1, SO5 and SO6 biological donor/canon sources are unselected. O3 does not establish heredity, a copied soul or loss-free equipment restoration.')

add('legendary-mechanic', 'Source-world public engineering/implant/respawn leads, separate from the original Salvage Reach.',
 [('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','Salvage Reach/Legendary Mechanic LGM1-LGM7; source-summary leads and player-specific respawn allowance.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_legendary-mechanic.md','BM1/OB5 ownership; implants, taught engineering and player respawn differ.')],
 ['Correct device/interface and usable component, not engineer title or body level.','Mechanical condition, actual power and living interface viability.','Material/firmware contamination, not biological pedigree purity.','Recipient/device, control and power; player-specific respawn is not an implant gene.','Maker, module, actor, source boundary and actual player/native status.'],
 'Qualify an actual implant/component supply and fit operation.', 'Ordinary engineering, native supplier, supported player seat or explicit backup-body AU.', 'Blueprint/material access, assembly, power and fitting procedure.',
 'Native rights, player status, corporate stock and employment differ. Local service/recall terms remain authored until exact source scenes are qualified.', '''SO2|L|Wreck or old body/component custodian|Qualify salvageable implant parts|No ancient tissue-to-class-power recipe
SO3|P|Workshop/recovery site|Arrange actual source/device fitting means|Lab location does not confer respawn
SO5|L|Implant recipient/manufacturer|Qualify real biological interface or replacement procedure|No generic copied self from mechanical evidence
SO7|L|Actual technology supplier|Obtain source-qualified parts and service|Exact market/clinic scene remains needed
SO8|L|Engineering institution or mission issuer|Qualify device/service reward and duties|Affiliation is not installed capability
SO10|P|Rival engineer holding a usable component|Trade or dispute actual module/title|Blueprint knowledge and physical supply remain separate
SO11|P|Traveler with a device|Check actual power and destination interface|Imported magic conversion needs a selected adapter
SO12|L|Your actual player/native body and source status|Qualify the selected respawn/repair operation|Do not export player exception to every native or biological heir''',
 'SO1, SO4, SO6 and SO9 source routes remain UNKNOWN. Exact implant, clone and source-authorized replacement mechanisms require source windows; no full canon certification.')

add('kenshi', 'Source-world prosthetic and located-injury leads, separate from the original Red Basin.',
 [('docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md','The Red Basin/Kenshi KEN1-KEN10 source G/I leads.'),('docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_kenshi.md','WR1/WR5/BM1/OB3 source-summary ownership; exact limb fit/identity and local law qualification needed.')],
 ['Mechanical limb function/fit and real care supplies, not a lineage grade.','Wound/tissue condition and mechanical wear separately.','Ordinary contamination and component condition; no native supernatural blood purity.','Actual species/limb slot and control; local magic/regrowth not presumed.','Part maker, supplier, patient and selected location/era.'],
 'Source a real replacement limb and retrain its useful movement.', 'Merchant, specialist maker, salvage, paid care or a declared imported working aid.', 'Real parts, fitting, specialist effort and actual local supply.',
 'Faction attitudes, capture/labor markets and clinical consent vary by chosen locality. Do not infer universal status from one religious faction or transplant original Red Basin laws into source canon.', '''SO2|L|Old mechanical-body/component custodian|Qualify salvage and repairable part condition|No deceased person’s return from old hardware
SO3|P|Local fitting/recovery site|Arrange actual apparatus and support|Clean water/repair tools are means, not aptitude
SO5|P|Patient/donor or part owner|Record measurements, consent and removed-part title|Diagnostic/body records differ from inherited faculty
SO7|L|Source-qualified limb seller|Purchase and fit a supported replacement|Specific item/service rules need game-source verification
SO8|P|Original care/workshop contract|Fund service and settle actual duties|Institution addition is original, not universal Kenshi clinic canon
SO10|P|Rival salvager/carrier holding a part|Trade/recover physical custody|No invented shared stock or automatic condemnation
SO11|P|Traveler with a compatible mechanical aid|Test actual power/mount and local use|No local absence becomes a universal foreign-body ban
SO12|L|Your current body and removed limb/component|Qualify rehabilitation and retained coordination|Repair/replacement is not self-cloning or reincarnation''',
 'SO1, SO4, SO6 and SO9 body-source routes remain UNKNOWN. No dynasty or genetic program inferred from scenario starts; no new source-game test.')

# Matrix-only entries retain all twelve cells and a precise reason for no WORLD file.
GAPS = {
 'fated-villain':'Host seizure/remnant and clan recognition are source-summary context; no exact procurement/input or body-source transfer procedure is selected. Generic bloodline theft needs a source scene.',
 'a-novel-concept':'B1 qualifies purification/body tempering, but no exact material/holder/acquisition route beyond the inspired Crucible card is selected here. Direct-source trial/bloodline sources need their own source windows.',
 'a-will-eternal':'Grouped Er Gen source owner is not a title-specific donor/material recipe; alchemical input and body effect need a selected A Will Eternal scene.',
 'beyond-timescape':'Fog exposure/medicine fit is not a qualified blood/body source; exact title/era source windows needed.',
 'i-shall-seal-heavens':'Grouped Er Gen summary does not qualify this title’s material, recipient or source renewal law.',
 'renegade-immortal':'Clone/body-source and soul retention need title-specific scenes; no source recipe inferred from genre.',
 'archive':'Ancestry records and evidence handling exist as design context; no acquired tissue, body-change input or replacement source selected.',
 'bay-city':'Crisis acquisition and public capability records do not establish a physical-source body program; Worm source laws are not imported.',
 'concord-waymarks':'Named original lead has no frozen public body-source rule; proposed memory/body exchange first needs an actual payer/carrier.',
 'elden-ring':'Inactive. Narrow existing brief and unresolved graft/source scenes supply no selected body procurement route; no paused queue resumed.',
 'fallout':'Inactive. FEV/radiation/implant ideas are fit leads beyond the narrow current brief, not source-qualified manufacture or acquisition.',
 'folded-glasshouse':'Workbench fit/template gift is design context, not a biological sample, implanted source or generated bloodline.',
 'goa':'Finite derived mission offers ordinary rescue/care only; no whole-One-Piece fruit, bloodline, Haki or canon-tissue sourcing entitlement.',
 'kairos':'Remains are a public source-summary lead, but no exact body-source use/holder operation was qualified; ship title and pantheon favor differ from acquired anatomy.',
 'labyrinth-mad-god':'Class-related lower needs and care resources are context, not an identified body/source procurement route.',
 'lantern-compact':'Invited specialist services are an original lead without frozen public body-source mechanism.',
 'omniscient-reader':'Body-stat purchase and Avatar identity have separate carriers; no exact bodily-input sourcing operation selected from the public summary.',
 'proto23':'Retained visitor/dojo/rest does not prove healing source, new body, house ancestry or bloodline procurement.',
 'proving-ground':'Training fixtures simulate injury/body variation; they do not manufacture a new biological body or alter visitor identity.',
 'regressors-tale':'Soul-carried practice/young-body return are source-summary context; no actual self-sample bank, body material or transfer procedure qualified.',
 'saltworks':'Waterworks labor/pressure instruction gives bodily practice and infrastructure, not a body-source material economy.',
 'second-coming-gluttony':'Care/future-self and Earth-retention conflict are source-summary context; no exact acquired bloodline/body supply qualified.',
 'service-hub':'Original nested service hub supplies lessons/jobs; no novel Contractor-hub blood-item or admission law imported.',
 'shatterreach':'Original lead needs its own public source/body procedure; Genetic Ascension status-window inspiration is not that procedure.',
 'skyrim':'Inactive. Body-changing alchemy/vampire/soul lore needs selected game-source scenes beyond the current narrow brief; queue remains paused.',
 'tidemark':'Tide-window work and remedies are context; no selected water bloodline, body source or hereditary grant.',
 'travelers-gate':'Synopsis supports realm-based training, but exact source reward/carrier and access law are not qualified.',
 'ttks-annual-traits':'B2 settlement whitelist/memory is not biological sample or material sourcing; exact carried trait acquisition/retention still needs source-member rule.',
 'ttks-jjk-challenge':'B3 challenge projection/loadout is not retained corporeal source material; parent JJK blood/object rules are not silently imported.',
 'wandering-inn':'Guardian relation, class and species care are source context; no actual bodily source-transfer procurement operation selected.',
 'wish-upon-stars':'Renown/wish access and possible body/memory price need an exact source/payer transaction before treating them as body supply.',
 'worm':'Source-specific modified/copy bodies exist as identity leads, but exact bio-service input, holder and acquisition scene not selected; trigger is not genetic loot.',
 'you-are-summoned':'Summoned medic and reconstruction terms are context; exact body-source procurement and subject continuity need their source windows.',
 'you-have-died-again':'Marks and body/soul reset require retention proof; no source-qualified earlier-body material bank supplied.',
 'solo-leveling':'Corpse-to-shadow authority exists as a source-summary lead, but no selected ancient remains/body-source acquisition law; shadow is not an ordinary heir.'
}

SO_NAMES = ['Monsters and beasts','Ancient remains','Places','Plants and fungi','People','Canon figures','Markets','Institutions','Inheritance grounds and trials','Rivals and other system users','Other worlds','Your own body']

def link(path, label):
    return f'[{label}]({os.path.relpath(ROOT / path, OUT)})'


def render():
    files = sorted(B1.glob('WORLD_*.md'))
    actual = {p.stem.removeprefix('WORLD_') for p in files}
    assert set(W) | set(GAPS) == actual, (sorted(actual-set(W)-set(GAPS)), sorted((set(W)|set(GAPS))-actual))
    assert not set(W) & set(GAPS)
    for slug,d in W.items():
        title = (B1/f'WORLD_{slug}.md').read_text().splitlines()[0][2:]
        s = f'# B10: {title}\n\n2026-10-14. Docs-only proposal palette. Read [matrix rules](MATRIX.md) for B/P/L/U, evidence boundaries, source/use distinctions and global P8 joins.\n\n'
        s += f'## Scope and source locators\n\n{d["scope"]}\n\n'+link(f'docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_{slug}.md','B1 world fit (read only)')+' supplies the exact world slug and inherited scope.\n\n'
        s += '| Key | Locator and evidence boundary |\n|---|---|\n'
        for i,(path,desc) in enumerate(d['sources'],1):
            s+=f'| S{i} | {link(path, Path(path).name)}: {desc} |\n'
        s+='\nCanon cast and source figures remain authored at their selected era. P rows may create original incidental suppliers and batches, not reroll book canon bodies, relationships or unique source identities. No sealed truth is disclosed.\n\n'
        s+='## Five sourcing variables\n\nThese are independent proposed facts/observations, not five compulsory meters. Unmeasured values stay unknown; changing custody or reopening storage does not reset condition.\n\n| Variable | This world’s relevant distinction |\n|---|---|\n'
        for name,value in zip(['Quality','Freshness','Purity','Compatibility','Provenance'],d['variables']): s+=f'| {name} | {value} |\n'
        s+='\n## SO1-SO12 routes\n\nB rows identify a bounded source/design anchor; the acquisition action and consumer adaptation still need authoring or source qualification. P rows are explicit original proposals. L rows are retrieval leads with the stated gap.\n\n| Code / source | Basis | Place or holder | Acquisition method | Use and consequence |\n|---|---|---|---|---|\n'
        for n,name in enumerate(SO_NAMES,1):
            code=f'SO{n}'
            if code in d['rows']:
                status,origin,method,use=d['rows'][code]
                s+=f'| {code} {name} | {status} | {origin} | {method} | {use} |\n'
            else:
                s+=f'| {code} {name} | U | No source-qualified holder selected | No operation selected | Open scope, not a canon prohibition; see gap below |\n'
        s+=f'\n## Default, dial and local response\n\n**Default:** {d["default"]}\n\n**Dial:** {d["dial"]}\n\n**In-world reason and cost:** {d["cost"]} Collection gives owned information/potential or a specific input. Actual body use needs its operator, recipient, supported law and cause; transmission to an heir is a separate later event.\n\n**Consent/cruelty/local authority:** {d["adjectives"]}\n\n'
        s+='**Idle proposal:** queue only already admitted procurement, preservation, preparation or recovery with actual stock/means, a receiver and a stop reason. Revalidate source access/conditions at relevant boundaries. No fixed lifetime collection cap, no default offline biological crisis, and no blanket hostile reaction.\n\n'
        s+='**Resource joins:** [P8 creature sources](../../procgen-2026-10-13/p8/CREATURE_RESOURCES.md), [harvest](../../procgen-2026-10-13/p8/HARVEST_YIELDS.md), [logistics](../../procgen-2026-10-13/p8/LOGISTICS.md), [magical source forms](../../procgen-2026-10-13/p8/MAGICAL_RESOURCES.md), [trade/import](../../procgen-2026-10-13/p8/TRADE_SUPPLY.md) and [world boundaries](../../procgen-2026-10-13/p8/WORLD_VARIATIONS.md). Apply only operators compatible with this world. These P8 proposals are not already implemented genetics.\n\n'
        s+=f'## Open source/use gate\n\n{d["gap"]}\n\nFirst selected proof must obtain an actual source by its stated route, inspect only what the observer can know, pay the real process cost, and produce a useful changed action or treatment. Compare a compatible/unsupported use without deleting retained stock or exposing hidden truth. For an implemented stateful slice: rebuild, fresh-origin desktop 1366x768, Save/reload and literal-file Import with an explicit compatibility decision. None was run by B10.\n'
        (OUT/f'WORLD_{slug}.md').write_text(s)
    matrix = '''# B10 world × sourcing matrix

2026-10-14. Docs-only extension of [G52](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), not accepted mechanics or implementation. Exact world roster/slugs come from read-only [B1](../b1/MATRIX.md). No digest-only subject is promoted into a new world.

## Reading the cells

| Mark | Meaning |
|---|---|
| B | A bounded source or existing design owner anchors the source/use relation. Evidence channel remains attached in the world note: inherited primary excerpt summary, secondary STATED claim, or an already owned design. Not fresh canon certification, implemented acquisition or guaranteed service availability. |
| P | Concrete original proposal: place/holder, method and useful consequence supplied in the world note. It may be an AU/local addition; not canon or accepted direction. |
| L | Useful source/research lead with an exact missing operation or scene. Not a functioning procurement route. |
| U | No actual source/use operation selected in this pass. Unknown or outside this slice, not forbidden or universally absent. |

Cells describe sourcing routes, not equivalent rewards. Sources can supply anatomy, temporary form, healing/care, diagnostic evidence, a ritual interface, fuel, a tool or a nonbiological grant. The world note names the actual output. Evidence/teaching alone does not install a body, gene or bloodline; no new hereditary effect is assumed. A provider appearing under SO6 does not imply that harvesting that figure’s body works. SO2 specifically means ancient remains; a recent deceased donor belongs to SO5, while a slain beast is SO1.

SO1 monsters/beasts; SO2 ancient remains; SO3 places; SO4 plants/fungi; SO5 people including recent dead; SO6 authored canon figures/source holders; SO7 markets; SO8 institutions; SO9 inheritance grounds/trials; SO10 rivals/system users; SO11 other worlds; SO12 your own body.

## Common sourcing contract, proposed

| Dimension | Actual source fact | Observer/claim boundary |
|---|---|---|
| Quality | Relevant intact structures, active fractions, workmanship or rule-specific grade. | Rarity/fame/price cannot prove a useful property or full faculty. |
| Freshness | Time and condition history, viable tissue, culture readiness or source-specific persistence. | Report only scoped observation/estimate; ordinary inventory gets no unsolicited global decay. |
| Purity | Measured constituents, contaminants, imprint/source content if meaningful under a law. | Political pedigree, family claim and moral worth are separate; no universal dilution hierarchy. |
| Compatibility | Directional source → procedure → recipient → use under a chosen world/era law. | Unknown is not zero, safe or a generic rejection; an experiment may discover fit where lore permits. |
| Provenance | Origin/subject/site, actual holder, collection and processing, source/continuity revision and custody chain. | Chemistry can establish some origin facts but cannot authenticate consent or lawful title; certificates and witnesses retain their own scope. |

Useful candidate record fields: source/lot ID, world/continuity/era, body/part/role or grant type, amount/unit, five variable facts, holder/custody, collection/process occurrence, sample rights/obligations, preservation/condition law, intended consumer and observer reports. This extends G52/G54; B11 owns implementation/save shape. A copying law such as TTKS can duplicate eligible output under its actual cost law; a conserved characteristic cannot. No global conservation rule overrides a sourced copying exception.

**Default:** acquire one real source and use a supported operator. **Dial:** stronger/friendlier/harsh sourcing, trade, preservation, donor service, extraction, inheritance, self-use or an explicitly authored above-world-level method. **Reason/cost:** actual means, source stock, handling, support and local consequences. Clean powerful combinations may work without an invented drawback. A failed/unsupported operator does not automatically consume cargo.

Book canon people, timelines, special bodies, unique relics and source laws stay authored. Generate original eligible incidental suppliers, cohorts and batches only. Consent, cruelty, law, faction doctrine and mechanical eligibility are attributed local adjectives/facts with actual witnesses and reactions. No hidden universal moral veto or guaranteed revenge/kin sense; those need a real participant and means. Sealed ancestry/provenance stays ID/route/status in public output. No sealed files were opened.

## World × SO1-SO12

| World / B1 slug | SO1 | SO2 | SO3 | SO4 | SO5 | SO6 | SO7 | SO8 | SO9 | SO10 | SO11 | SO12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
'''
    for p in files:
        slug=p.stem.removeprefix('WORLD_'); title=p.read_text().splitlines()[0][2:]
        target=f'WORLD_{slug}.md' if slug in W else f'../b1/WORLD_{slug}.md'
        cells=[W[slug]['rows'].get(f'SO{i}',['U'])[0] if slug in W else 'U' for i in range(1,13)]
        matrix += f'| [{title}]({target}) `{slug}` | '+' | '.join(cells)+' |\n'
    matrix+='\n## Worlds with no selected sourcing operation\n\nThese rows deliberately have no B10 WORLD file. Each has all twelve cells recorded as U; B1 remains their context owner. This avoids replacing source gaps with invented body economies. A later exact source operation can turn an individual cell into B/L, or a declared original world law into P.\n\n| Slug | Reason and next source gate |\n|---|---|\n'
    for slug,reason in sorted(GAPS.items()):matrix+=f'| [{slug}](../b1/WORLD_{slug}.md) | {reason} |\n'
    matrix+='''
## Shared resource owners and limits

[P8 WORLD_VARIATIONS](../../procgen-2026-10-13/p8/WORLD_VARIATIONS.md) supplies bounded world/era constraints; [CREATURE_RESOURCES](../../procgen-2026-10-13/p8/CREATURE_RESOURCES.md) living source, part partition and rights; [HARVEST_YIELDS](../../procgen-2026-10-13/p8/HARVEST_YIELDS.md) intact geometry, useful fractions and waste; [LOGISTICS](../../procgen-2026-10-13/p8/LOGISTICS.md) source-specific condition and storage; [MAGICAL_RESOURCES](../../procgen-2026-10-13/p8/MAGICAL_RESOURCES.md) charge/carrier/living substrate/pattern/grant/identity distinctions; [TRADE_SUPPLY](../../procgen-2026-10-13/p8/TRADE_SUPPLY.md) titled stock, actual deliveries and directional imports.

[GATHERING_AND_RESOURCE_USES](../../../../GATHERING_AND_RESOURCE_USES.md) owns notice → obtain → use → later opportunity. [PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT](../../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), P2/P12-P14 and R1-R9, owns full composition, recipient/route response, knowledge and persistence hazards. B10 selects no new runtime operator, gene record, chemistry resolver or save schema. Existing source/test claims in those audits retain their date/slice; B10 does not refresh them.

See [CHAINS](CHAINS.md) for nine causal proposals and [REPORT](REPORT.md) for findings, ranked recommendations and unverified gates. Priority worlds stay canon-first; inactive Fallout/Skyrim/Elden Ring remain inactive. No UI is authored. Any later UI proof targets laptop 1366x768, mobile deferred. No build, npm, source acquisition, source-library write, user-save access, stage, commit or publication.
'''
    (OUT/'MATRIX.md').write_text(matrix)
    (OUT/'COVERAGE.json').write_text(json.dumps({'date':'2026-10-14','b1_worlds':len(files),'world_notes':len(W),'matrix_only':len(GAPS),'worlds':{p.stem.removeprefix('WORLD_'):{'note':p.stem.removeprefix('WORLD_') in W,'codes':{f'SO{i}':W[p.stem.removeprefix('WORLD_')]['rows'].get(f'SO{i}',['U'])[0] if p.stem.removeprefix('WORLD_') in W else 'U' for i in range(1,13)}} for p in files}},indent=2)+'\n')
    print(f'Wrote {len(W)} world notes; {len(files)} matrix rows; {len(GAPS)} explicit matrix-only gaps.')

if __name__ == '__main__':render()
