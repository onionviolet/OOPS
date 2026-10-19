// Reviewed supplied-edition analysis and inert local authoring proposals.
// These helpers inspect supplied snapshots. They never settle native state.
import {deepFreezeUnlessFrozen as freeze} from './basics.js';
const isId = value => typeof value === 'string' && value.length > 0;
const outputId = value => isId(value) ? value : null;
const evidence = (lane, claimId, locator, file) => ({
  lane, claimId, locator, file: `docs/research/novels/full-book/${lane}/${file}`,
});
const joins = freeze({
  identity: ['actual actor/body/controller carriers', 'Backlog replacement carrier stage/validation binding', 'observer knowledge and remembered committed history'],
  role: ['actual incumbent survival and rights/duties', 'native institutional authorization', 'single gameplay publication'],
  credit: ['actual event performer and recipient', 'attributed observer evidence', 'native opportunity eligibility and settlement'],
  equipment: ['native_equipment_transaction.prepareNativeEquipment', 'actual item custody/material stock', 'native craft/effect settlement'],
  execution: ['actual body/source/fuel/control', 'native target/function effect', 'single gameplay publication'],
  entry: ['world_instances.validateWorldBindings', 'native world location/access', 'actual local people/stock/history'],
});

const orv = [
  evidence('omniscient-reader', 'ORV-028-01', 'ch28 b4–21,53–90', 'workers/NOTES_011_030.md'),
  evidence('omniscient-reader', 'ORV-029-01', 'ch29 b5–19,28–50', 'workers/NOTES_011_030.md'),
  evidence('omniscient-reader', 'ORV-034-01', 'ch34 b3–10,39–51,105–127', 'workers/NOTES_031_050.md'),
  evidence('omniscient-reader', 'ORV-036-01', 'ch36 b23–49,63–74,108–123', 'workers/NOTES_031_050.md'),
  evidence('omniscient-reader', 'ORV-010-02', 'ch10 chap_00010 b53–83', 'workers/NOTES_001_010.md'),
  evidence('omniscient-reader', 'ORV-377-01', 'chap_00377.xhtml b27–66', 'workers/NOTES_371_390.md'),
  evidence('omniscient-reader', 'ORV-378-01', 'chap_00378.xhtml b69–108,127–160,167–186', 'workers/NOTES_371_390.md'),
];
const worm = [
  evidence('worm', 'W002-C04', 'W002:p018-p027', 'readers/001-007/NOTES.json'),
  evidence('worm', 'W005-C04', 'W005:p025-p043', 'readers/001-007/NOTES.json'),
  evidence('worm', 'W007-C06', 'W007:p028-p041', 'readers/001-007/NOTES.json'),
  evidence('worm', 'W013-C02', 'W013:p002-p026,p045-p053', 'readers/008-017/NOTES.json'),
  evidence('worm', 'W100-C01', 'W100:p002-p021,p034-p040,p114-p123', 'readers/094-100/NOTES.json'),
];
const mechanic = [
  evidence('legendary-mechanic', 'LM-c0006-02', 'c0006:p12–32', 'readers/0006-0025/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0012-03', 'c0012:p27–48', 'readers/0006-0025/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0012-04', 'c0012:p50–59', 'readers/0006-0025/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0027-03', 'c0027:p20–47,48–64', 'readers/0026-0045/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0067-02', 'c0067:p15–52', 'readers/0066-0085/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0069-03', 'c0069:p51–77', 'readers/0066-0085/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0077-02', 'c0077:p19–43', 'readers/0066-0085/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0078-02', 'c0078:p19–45', 'readers/0066-0085/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0145-02', 'c0145:p14–30', 'readers/0126-0145/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0068-02', 'c0068:p14–35', 'readers/0066-0085/NOTES.md'),
  evidence('legendary-mechanic', 'LM-c0041-01', 'c0041:p1–21,30–46', 'readers/0026-0045/NOTES.md'),
];
const labyrinth = [
  evidence('labyrinth-mad-god-1', 'B03-C04', 'ch43 OEBPS/c2KT.xhtml b22–35; ch44 OEBPS/c2N7.xhtml b11–18', 'workers/b03/NOTES.md'),
  evidence('labyrinth-mad-god-1', 'B03-C05', 'ch44 OEBPS/c2N7.xhtml b3–7,19,32–34', 'workers/b03/NOTES.md'),
  evidence('labyrinth-mad-god-1', 'B03-C22', 'ch51 OEBPS/c30T.xhtml b17–24; ch52 OEBPS/c31T.xhtml b3–7', 'workers/b03/NOTES.md'),
  evidence('labyrinth-mad-god-1', 'B03-C23', 'ch55 OEBPS/c353.xhtml b21–27; ch56 OEBPS/c366.xhtml b4–23', 'workers/b03/NOTES.md'),
  evidence('labyrinth-mad-god-1', 'B04-C10', 'ch64 OEBPS/c3FS.xhtml b7–15', 'workers/b04/NOTES.md'),
  evidence('labyrinth-mad-god-1', 'B07-C30', 'ch119 OEBPS/c5K1.xhtml b27–35', 'workers/b07/NOTES.md'),
  evidence('labyrinth-mad-god-2', 'R02-C24', 'ch13 b18–25,32–45', 'readers/R02_NOTES.md'),
  evidence('labyrinth-mad-god-2', 'R03-C13', 'ch30 b19–27', 'readers/R03_NOTES.md'),
  evidence('labyrinth-mad-god-2', 'R03-C14', 'ch30 b25–28', 'readers/R03_NOTES.md'),
  evidence('labyrinth-mad-god-2', 'R05-C32', 'ch81 b21–38', 'readers/R05_NOTES.md'),
  evidence('labyrinth-mad-god-2', 'R06-C18', 'ch95 OEBPS/c4UD.xhtml b19–26', 'readers/R06_NOTES.md'),
  evidence('labyrinth-mad-god-2', 'R06-C21', 'ch96 OEBPS/c4W2.xhtml b34–52; further control claims R06-C22–27', 'readers/R06_NOTES.md'),
];

export const SITUATED_BOOK_PROFILES = freeze([
  {
    id: 'book.omniscient_reader', title: "Omniscient Reader's Viewpoint", revision: 1,
    sourceEditions: [{lane: 'omniscient-reader', edition: 'Supplied English Illustrated Edition, singNsong compilation', sha256: '24cf71786db0c6e91a5ec12a1047a993a25c6bf4d5a72deb0ee2c417436655bf', reviewedExtent: 'All551 supplied chapters read/reviewed/integrated;1263956 body words; final hospital continuation uncertain', limits: 'Compilation/translation authenticity, illustration pixels and complete publication coverage unverified'}],
    sceneIds: ['situated.orv.chungmuro_roster'], evidence: orv,
    replacement: {
      appearance: 'Alias, uniform or claimed landlord changes a claim. Personal recognition, local tenancy and source faculty remain separate.',
      credential: 'A tenancy record or authorized contract may establish its exact local right; appearance alone cannot do so.',
      recognizedRole: 'Replacing Pildu or a scenario protagonist is a divergent branch requiring actual incumbent fate, source and scenario binding. No canonical-role replacement is activated here.',
      credit: 'Broadcast attention, claimed rescue and actual rescue may reach different audiences. Coin rewards require the actual scenario recipient.',
      opportunity: 'Sponsorship offers, gifts, story succession and command contracts have separate counterparties and acceptance. No universal fate theft.',
      equipment: 'Horn gear needs actual horns/manual making. Possessing an item or tenancy does not supply Armed Zone, body stats or source control.',
      bodyController: 'Kaizenix host occupation/identity erosion is later specific evidence, not ordinary Chungmuro disguise. Host Yuri has her own history/voice.',
      soulReincarnation: 'Bookmark is a temporary conditioned loan, not permanent person replacement. Kaizenix, Underworld rebirth and regression require distinct bindings; no universal inheritance.'
    },
    sourceExceptions: [{id:'orv.bookmark', era:'ch10 and later evolution', rule:'Understanding/body/fuel/duration bound loan; no transfer of identity or permanent mastery', evidence:[orv[4]]}, {id:'orv.kaizenix_hosts', era:'ch377–378', rule:'Lived host years and memory erosion; Yuri remains a distinct host history; ordinary entrant cannot claim this route', evidence:[orv[5],orv[6]]}, {id:'orv.pildu_contract', era:'ch36', rule:'Defense Master is counterparty, Pildu recipient; survival/growth duty, ten daily commands/five years/no automatic renewal are this contract alone', evidence:[orv[3]]}],
    tropeChain: {source:'Chungmuro room scarcity → coercive landlord → leverage/zone destruction → emergency defense → negotiated scoped command. Source events are baseline, not required player actions.', subversions:['Pay or seek actual available room','Cooperate with residents and known defenders','Withdraw from a costly zone','Negotiate an exact duty without inheriting a protagonist power'], boundary:'Averted conflict does not summon a substitute landlord or boss.'},
    smallInteractions: ['Actual room capacity and water/food stock','Permission distinct from rare attribute/stigma','Repair/reinstall defenses takes actual work','Cooking and hand-made gear remain useful'],
    unknowns: ['Exact ordinary room handover/registry procedure is original proposed policy','No general soul-signature identity test established for this opening','Detailed contract enforcement outside the named case unknown'],
    nativeBindingGap: 'No ORV native instance, Chungmuro occupants/rooms/coin stock, scenario reward owner, Pildu contract or source faculty registered. Profiles/rule receipts are implemented-unverified authoring support.'
  },
  {
    id:'book.worm', title:'Worm', revision:1,
    sourceEditions:[{lane:'worm', edition:'Supplied EPUB attributed to John McCrae', sha256:'5eb58f982c240739ac639de456c858e394c3ea787b21a901e63b0c95eaad2936', reviewedExtent:'All304 supplied story/interlude/Teneral entries integrated;1682635 normalized words; ends Interlude: End', limits:'Paragraph authenticity unverified; Purity/Lisa bonus interludes have relocated supplied reading order; sequel teasers excluded'}],
    sceneIds:['situated.worm.costume_work'], evidence:worm,
    replacement:{
      appearance:'Mask, cape name and unmasked acquaintance are distinct evidence channels; group introductions initially remain testimony.',
      credential:'Cape costume grants no PRT/Wards office, clearance or team consent.',
      recognizedRole:'Taking a cape name cannot replace Taylor/Grue or their relationships. A real role handover needs named willing people and authority; canonical replacement branch remains absent.',
      credit:'Media attribution and the actual rescuer differ. A witness can revise a claim without moving equipment or becoming an automatic friend.',
      opportunity:'Recruitment, favors and employment need recipient acceptance. No generic chosen-role/luck/fate transfer is evidenced.',
      equipment:'Taylor made and tested particular silk/exoskeleton armor. Replacement cloth must meet actual fit/construction; her hoped bullet resistance is untested, not a copied property.',
      bodyController:'Regent later controls an occupied conscious body with attention/familiarity/distance limits and muscle-memory access. He does not directly read thoughts; target still exists.',
      soulReincarnation:'Regent control, clones, inherited fragments and backups are distinct source processes. None follows from a borrowed face; arbitrary soul or shard inheritance unknown.'
    },
    sourceExceptions:[{id:'worm.regent_control',era:'W100 late post-Leviathan',rule:'Controller and conscious target remain separate; sleep ends control; no thought reading; muscle memory may be usable in this case',evidence:[worm[4]]}],
    tropeChain:{source:'Solitary intended hero meets villains after Lung → masked introductions/mistaken alignment → cautious unmasked recruitment. No compulsory enemy/protagonist chain.',subversions:['Keep civilian work/identity','Ask for demonstrated means','Decline recruitment','Repair ordinary gear without joining a cape team'],boundary:'Later coercion/Endbringer crisis is not auto-triggered by a workshop refusal.'},
    smallInteractions:['Self-made armor fit and unfinished dye/paint','Actual fabric/insect-shell supply','Ordinary tools and paid work','Sleep, family routines and school costs remain real'],
    unknowns:['Proposed repair counter is original, not a canonical named shop','Tinker-device replacement needs named operator/design compatibility; costume precedent proves no general replication','Soul signature or automatic replacement relationship rule unknown'],
    nativeBindingGap:'No Worm native Brockton Bay, Taylor/Undersider actor and shard owners, institutional registry, costume stock or source-specific control effect registered.'
  },
  {
    id:'book.legendary_mechanic',title:'The Legendary Mechanic',revision:1,
    sourceEditions:[{lane:'legendary-mechanic',edition:'Supplied English EPUB creator field Chocolion; novelist Qi Peijia; translation/compilation qualified',sha256:'fcf19109551a4cc5cc355cb30a93b4947278473737fc2004935c540dd5e1991e',reviewedExtent:'All1463 supplied NCX story entries read/reviewed/integrated;3274716 p words plus3438 x words; story ends c1463:p81, translator afterword p82',limits:'Bare478 and8111 label seams, numbers/unit ambiguity and relative timestamp metadata retained; no missing prose/authenticity claim'}],
    sceneIds:['situated.mechanic.workshop_dispatch'],evidence:mechanic,
    replacement:{
      appearance:'Face simulator succeeds only with actual uniform, covered skin/body, voice/callsign/radio context. One captain accepts a sore-throat explanation; this is not universal recognition success.',
      credential:'A stolen access card supplies a specific gate channel; it grants neither employee expertise nor blanket institutional authority.',
      recognizedRole:'Division13 employment, Zero/Black Phantom alias and a recognized mission contribution differ. Replacing the exact agent needs real access and history, not an NPC label.',
      credit:'Officials may credit the wrong institution while Bennett knows more. Records, interface contribution and public stories stay separate.',
      opportunity:'Remembered game future enables anticipation; changed missions/people are not guaranteed destiny. Actual recipient/eligibility still required.',
      equipment:'Blueprints, parts, tools, energy, signal reach and construction differ. Rover battery/control constraints and incomplete magnetism armor are named devices, not a universal recipe.',
      bodyController:'Han acts in the existing Xiao Han body; Germinal body-origin testimony and restored-memory theory do not establish transmigration cause or inherited allegiance.',
      soulReincarnation:'Black Spider copies/consciousness transfer and later possession are particular exceptions, not the ordinary NPC interface. No general player respawn or source-body replacement.'
    },
    sourceExceptions:[{id:'mechanic.xiao_han_origin',era:'c0001–12',rule:'NPC-labelled operation works for Han; researchers theory of enhanced/restored memory remains theory. Prior body history need not determine allegiance.',evidence:[mechanic[1],mechanic[2]]},{id:'mechanic.infiltration',era:'c0077–78',rule:'Local disguise and stolen credential rely on separate channels; source guard is killed, which must remain true in source baseline. Proposed workshop entrant kills/replaces nobody.',evidence:[mechanic[6],mechanic[7]]},{id:'mechanic.black_spider',era:'c0041',rule:'Faceless copies and transferred active consciousness have local radius and incomplete census; capturing the last encounter body does not destroy all reported copies.',evidence:[mechanic[10]]}],
    tropeChain:{source:'Specialist craft → costly/late orders → mission logistics → mixed true/false intelligence → conditional infiltration → independent evidence. Foreknowledge is partial/private.',subversions:['Deliver honest paid repair','Disclose uncertainty and request verification','Decline impersonation','Leave an unsuited upgrade incomplete instead of inventing mastery'],boundary:'Missing design knowledge is not fixed by extra metal, title or copied appearance.'},
    smallInteractions:['Battery stock/output and50m Rover control are separate','Heavy gear fits workshop/vehicle space','Overdue orders and borrowed garage access','A repaired suit at2% derivation is not mastered blueprint'],
    unknowns:['Exact local replacement component needs actual device/build specification','No universal NPC learning/respawn entitlement','Body transmigration cause and inherited memories unresolved'],
    nativeBindingGap:'No Legendary Mechanic native Western Capital/Division13 people, workshop orders/money, robot signal/energy or disguise/credential tests registered.'
  },
  {
    id:'book.labyrinth_mad_god',title:'Labyrinth of the Mad God',revision:1,
    sourceEditions:[
      {lane:'labyrinth-mad-god-1',edition:'Supplied Magnus Grey/AETHON English volume1, metadata2026-04-14',sha256:'c3caa8d82829d1fea853dd58dc15245d1cc00e5428885c7269370ac83b06faa6',reviewedExtent:'All119 numbered narrative chapters read/reviewed/integrated;216003 narrative words including headings; ch119 narrative ends b35',limits:'Class change is unaccepted, reward distribution interrupted, Earth/family/Bandit destination unresolved; later promo is outside story'},
      {lane:'labyrinth-mad-god-2',edition:'Supplied Magnus Grey/AETHON English volume2, metadata2026-07-15',sha256:'cce77f8ec3b292c4895115a05d435841d67d86f897f112deabdd3cb7131a2b6e',reviewedExtent:'All121 story chapters plus included Book1 recap read/reviewed/integrated;4843 blocks/224146 words; Nick crosses tower threshold ch121 b47',limits:'Recap is not independent volume1 reading. Companion arrivals/healing/tower floors/guardian/Earth restoration and Bandit reunion unshown; Book3 excluded'}
    ],
    sceneIds:['situated.labyrinth.guest_meal','situated.labyrinth.bog_field_guide'],evidence:labyrinth,
    replacement:{
      appearance:'Nickname, bow and guest acceptance do not grant Elder leadership or translated mind access.',
      credential:'System contestant/citizen status and sponsor jurisdiction need exact source authority; a badge/name does not install geneline, class or bloodline.',
      recognizedRole:'Taking a helper or mentor title does not replace Nick, Elder or Taltos. Handover needs actual accepted local duty; no god/contestant canonical replacement binding.',
      credit:'Shared cooking and witnessed assistance can be remembered without compulsory friendship/rewards; a copied journal retains its actual authors and reports.',
      opportunity:'Arena awards, class offers, active stones and constrained choices have their own recipients; volume1 unfinished offer cannot be treated as accepted.',
      equipment:'Bag of Molding rearranges/separates, cannot mix/refine inside. Julie staff is owner-command keyed; soulbound flask gives others half benefit without transferring ownership.',
      bodyController:'Parasite core and altered host are separate actors. Nick restoration/expulsion differs from Trell freedom followed by host death; cure does not revive every donor.',
      soulReincarnation:'Ordinary Sophia matrix preserves instincts/muscle processing, not deceased mind/self; her exceptional living contract summon has different costs/ontology. No generic resurrection.'
    },
    sourceExceptions:[{id:'labyrinth.parasite',era:'v1ch43–44',rule:'Nick restored/expelled core destroyed; Trell freed but dies. Separate host/controller/life outcomes.',evidence:[labyrinth[0],labyrinth[1]]},{id:'labyrinth.soulbound_flask',era:'v2ch30 and later',rule:'Named owner remains Nick; other drinker half benefit; actual elixir/wait/return/death conditions remain source-specific.',evidence:[labyrinth[7],labyrinth[8]]},{id:'labyrinth.matrix',era:'v2ch95',rule:'Sophia reports ordinary matrix lacks mind/self; living contract exception must not reuse matrix semantics.',evidence:[labyrinth[10]]}],
    tropeChain:{source:'V1 guest food/independent watch contrasts imposed mentorship; v2 team skill diversity/private secrets → field research/copying → conditional aid under danger. Rival aid need not absolve old hostility.',subversions:['Offer ordinary cooking/watch work','Keep or share a known field observation','Respect private methods','Withdraw from an unsafe cast','Choose finite cooperation without claiming a companion'],boundary:'Source cliffhangers remain open; neither local scene invents tower interior or family reunion.'},
    smallInteractions:['Cooking needs gathered food/tools; Survivor still needs supplies','Guest status grants no command ownership','Staff key/charges differ from learned control','Guide copying does not grant core/source/fuel','Force Acceleration acquisition does not teach stopping/control'],
    unknowns:['Lemur vocalizations remain untranslated; guest interpretation is Nick account','Wand recharge mechanism/repeatability unresolved despite later about-one/day report','Bloodline theft is described, not a witnessed repeatable transfer','Tower interior and post-entry healing cannot be authored as source facts'],
    nativeBindingGap:'No Labyrinth native island/bog, System sponsor/class/core, lemur consent/food stock, party staff/flask/matrix or tower threshold bindings registered. Two volumes share one setting with separate source/ending boundaries.'
  },
]);

export const SITUATED_BOOK_SCENES = freeze([
  {id:'situated.orv.chungmuro_roster',worldId:'book.omniscient_reader',eraId:'orv.ch28_36',place:'Chungmuro rooms/utilities',entry:'Ordinary survivor; optional claim to keep a room roster',branch:'Original local roster duty inserted before departure; Pildu and existing residents retain identities/holdings. No canonical role replacement or forced fight.',people:['source.orv.pildu','situated.orv.room_witness','situated.orv.water_runner'],items:['situated.orv.roster','situated.orv.owned_horn_piece'],opportunities:['situated.orv.voluntary_roster_duty'],knownEntryText:'A room has a capacity. The queue has people in it, even when the channel is looking elsewhere.',voice:[{speaker:'situated.orv.water_runner',text:'Tell me which room first. I cannot carry water to a title.',basis:[orv[0]],classification:'original incidental worker; analytical cue is finite water/room access'}],texture:[{text:'Food and water change hands under the station lights. A pencilled roster is our proposed local prop.',basis:[orv[0]],classification:'source cue plus explicitly original prop'}],laterEncounter:'Same water runner checks the actual duty and witnessed delivery; false badge/title alone neither delivers water nor erases tenancy.',status:'proposed local scene; coded rules implemented-unverified; native binding required'},
  {id:'situated.worm.costume_work',worldId:'book.worm',eraId:'worm.W001_017',place:'Early Brockton Bay, before Leviathan; proposed ordinary repair counter',entry:'Civilian/customer with own clothing; cape alias opt-in',branch:'Original incidental repair stop; Taylor and Undersiders retain their own bodies, sources and introductions. No recruitment/death triggered.',people:['source.worm.taylor','situated.worm.repair_worker','situated.worm.return_customer'],items:['situated.worm.owned_garment','situated.worm.thread'],opportunities:['situated.worm.paid_repair'],knownEntryText:'The repair counter checks the damaged seam and who owns the garment. A mask is a separate conversation.',voice:[{speaker:'situated.worm.repair_worker',text:'I can mend the seam. I am not putting bulletproof on the receipt.',basis:[worm[0]],classification:'original incidental craft worker; no canonical voice imitation'}],texture:[{text:'Loose street clothes can hide armor imperfectly. At home, toast and jam can say someone returned before anyone hears their story.',basis:[worm[2],worm[3]],classification:'original phrasing from distinct local cues; not a free household encounter'}],laterEncounter:'Same repair worker remembers paid work, garment owner and actual claimed test. Unmasked friend knowledge remains separately known.',status:'proposed local scene; coded rules implemented-unverified; native binding required'},
  {id:'situated.mechanic.workshop_dispatch',worldId:'book.legendary_mechanic',eraId:'mechanic.c0066_0085',place:'Western Capital workshop/Division13 dispatch, before joint reconnaissance',entry:'Ordinary paid repair customer; optional borrowed delivery identity',branch:'Original component/delivery check; Han and actual team/technicians survive unchanged. Source infiltration killing is not replayed or assumed.',people:['source.mechanic.han','source.mechanic.lu_qian','situated.mechanic.dispatch_clerk'],items:['situated.mechanic.actual_component','situated.mechanic.delivery_slip'],opportunities:['situated.mechanic.funded_repair_order'],knownEntryText:'The bench has a part, a deadline and someone waiting for a working device. Knowing its drawing has not paid the order.',voice:[{speaker:'situated.mechanic.dispatch_clerk',text:'The face matches the slip. Show me the part before I stamp delivered.',basis:[mechanic[5],mechanic[6]],classification:'original clerk; qualified separate appearance/function checks'}],texture:[{text:'A borrowed garage solves a space problem; a better blueprint does not make the truck narrower. Breakfast and overdue orders still compete with three-day work.',basis:[mechanic[4],mechanic[9]],classification:'original phrasing from garage/breakfast/order cues'}],laterEncounter:'Same clerk checks actual component test, paid donor stock and delivery record; duty or unpaid order survives an alias change.',status:'proposed local scene; coded rules implemented-unverified; native binding required'},
  {id:'situated.labyrinth.guest_meal',worldId:'book.labyrinth_mad_god',eraId:'labyrinth.v1.ch51_56',place:'Island lemur guest camp after parasite cure',entry:'Ordinary guest offering owned food or willing cooking/watch labor',branch:'Original bounded guest meal; Elder/Bandit remain independent. Trell remains dead in source baseline; no hidden resurrected foreman.',people:['source.labyrinth.elder','source.labyrinth.bandit','situated.labyrinth.guest'],items:['situated.labyrinth.owned_crab','situated.labyrinth.cooking_tool'],opportunities:['situated.labyrinth.guest_watch_offer'],knownEntryText:'A sentry waits for the Elder’s response. Sharing a meal can earn a place beside the fire; it does not make the camp yours.',voice:[{speaker:'situated.labyrinth.guest',text:'I will cook what I brought. We can ask for watch without pretending we hired them.',basis:[labyrinth[2],labyrinth[3]],classification:'original human guest; lemur speech remains untranslated'}],texture:[{text:'Roots, nuts and grubs pass through busy hands. The Elder distributes food while the guards keep working.',basis:[labyrinth[2],labyrinth[3]],classification:'original description from observed work; no mandatory reward'}],laterEncounter:'Same Elder/guest and actual shared food/witnessed watch are consulted; goodwill is not unlimited supplies or control.',status:'proposed local scene; coded rules implemented-unverified; native binding required'},
  {id:'situated.labyrinth.bog_field_guide',worldId:'book.labyrinth_mad_god',eraId:'labyrinth.v2.ch80_96',place:'Bog shelter, research/party interval before later evacuation',entry:'Ordinary copyist/traveler with own pen/paper; no assumed class/core',branch:'Original attributed guide/component check. Named companions retain their own private methods and bounded stock; tower outcomes stay unshown.',people:['source.labyrinth.nick','source.labyrinth.sophia','situated.labyrinth.copyist'],items:['situated.labyrinth.paper','situated.labyrinth.pen','situated.labyrinth.actual_loan_device'],opportunities:['situated.labyrinth.guide_copy'],knownEntryText:'The notebook names who saw a thing and who explained it. A neat copy still cannot install a mana pathway.',voice:[{speaker:'situated.labyrinth.copyist',text:'Leave room beside that warning. Someone may come back with a correction.',basis:[labyrinth[9]],classification:'original copyist; attribution/revision is proposed policy'}],texture:[{text:'Shared research leaves gaps for another person’s knowledge. A copied definition is useful at the table without becoming a new spell.',basis:[labyrinth[9]],classification:'original nonmechanical wording from research cue'}],laterEncounter:'Same copyist preserves earlier attributed report and adds witnessed correction; used paper and donor device do not refresh.',status:'proposed local scene; coded rules implemented-unverified; native binding required'},
]);

const topologyEvidence = (lane, claimIds, file) => ({lane,claimIds,file:`docs/research/novels/full-book/${lane}/${file}`});
export const SITUATED_BOOK_TOPOLOGIES = freeze([
  {worldId:'book.omniscient_reader',status:'source-qualified authoring disposition; no native topology registered',
    continuity:'Star Stream setting contains Earth, other lived realms and distinct world-lines; a source scenario is not the identity of its destination.',
    hubInstitution:'Dokkaebi Bureau/channel jurisdiction and later Context of the Constellations transit city are distinct institutions/places. Neither is installed in the Chungmuro opening.',
    physical:['Seoul station is a region of Earth','Peace Land has real inhabitants and its own relative clock','Underworld/Demon Realm have their own permissions and resources'],
    scenarioInstance:'Theatre Dungeon projects movie spaces with local rewards; this does not prove every imagined fiction is physically accessible or every mission produces a fresh world.',
    branch:'Changed1863 line and returned Earth with three outside years are separate source histories. A return is not automatic reset.',
    mental:'Fourth Wall/library/viewpoint functions need their own observed channel/body conditions; no ordinary workshop physical entry is inferred from a mental function.',
    sceneWindow:'orv.ch28_36 remains Earth/Chungmuro; later topology is author-facing future evidence, not known player travel.',
    clocks:'Local scenario timers, Earth absence and relative world clocks remain distinct; no universal conversion. Proposed native absent time stays frozen until a declared binding.',
    edgeCarriers:'No passage edge selected. Future edge must bind actual body/controller, Story/source/fuel, item fit, cargo custody and contract jurisdiction; observation transfers none.',
    evidence:[topologyEvidence('omniscient-reader',['ORV-037-01','ORV-120-01','ORV-295-01','ORV-299-01','ORV-314-01'],'WORLD_AND_DAILY_LIFE.md')],
    gap:'Needs actual persistent instance and endpoint/mission/clock bindings for each selected realm; no ORV hub/destination/return command exists here.'},
  {worldId:'book.worm',status:'source-qualified authoring disposition; no native topology registered',
    continuity:'Earth Bet and parallel Earths are distinct lived worlds; Brockton Bay is a region, not a mission dimension.',
    hubInstitution:'PRT/Wards, Cauldron and refugee settlements have different jurisdictions; no universal issuing hub is evidenced.',
    physical:['Portals reach different Earths','Vehicle size and fuel constrain actual passage','Final Annette counterpart is a distinct person on unnamed sealed Earth'],
    scenarioInstance:'No Paradise-style fresh mission instance is selected or evidenced by the early repair scene.',
    branch:'Counterpart histories remain independent. Projected/predicted alternatives do not establish reset, interchangeable people or a new surviving branch on command.',
    mental:'Thinker inference and projected/altered memory are information processes, not ordinary physically accessible worlds; W291 projected future is not its eventual occurrence.',
    sceneWindow:'worm.W001_017 remains early Brockton Bay; late portal/epilogue evidence is author-facing only.',
    clocks:'Portal access does not establish a global rate conversion; each event/reveal and final sealed Earth chronology remain separate.',
    edgeCarriers:'No passage selected. Later vehicle carries its finite fuel/size; original/counterpart people and borrowed sources do not merge on arrival.',
    evidence:[topologyEvidence('worm',['W291-C02'],'SYSTEMS.md'),topologyEvidence('worm',['W277-C04'],'indexes/EVERYDAY.md'),topologyEvidence('worm',['W304-C06'],'PEOPLE.md')],
    gap:'Needs actual Earth/portal instances, cargo geometry/fuel, native actor locations and separate counterpart histories; early costume work activates none.'},
  {worldId:'book.legendary_mechanic',status:'source-qualified authoring disposition; no native topology registered',
    continuity:'Planet Aquamarine/Western Capital are actual local planet/region. Galactic travel, secondary dimensions and replay instances are different categories.',
    hubInstitution:'Division13, workshops, later mercenary/Army institutions can issue scoped work. No one mission label defines every visited planet.',
    physical:['Planet/space travel has actual paid transport and finite device means','Secondary-dimension accounts require case evidence; Six Sanctums initially remain guarded testimony'],
    scenarioInstance:'Instance crystals/replay mirrors reproduce past baseline scenes with possible local changes. Han fears non-player entry and does not test it in the cited early crystal passage; original history is not thereby rewritten.',
    branch:'Old player memories are forecasts in changed native history; an update/version interval is neither a guaranteed reset nor an erased institution.',
    mental:'Soul-signature projection into Han mind does not disclose physical coordinates; network information contact differs from bodily travel.',
    sceneWindow:'mechanic.c0066_0085 remains Western Capital/joint mission; late Sanctum/network facts do not authorize this entrant.',
    clocks:'Later normal6:1 is distinguished from update disconnection/variable interval; not applied as universal native offline growth.',
    edgeCarriers:'No passage selected. Future edges require paid vehicle/cargo, actual knowledge/source/device fuel, credential jurisdiction and local NPC/player status separately.',
    evidence:[topologyEvidence('legendary-mechanic',['LM-c0152-02','LM-c0153-01','LM-c0161-03','LM-c0286-03','LM-c0289-01','c1124:p77–97','c1125:p1–52','LM-c0437-03'],'KNOWLEDGE_AND_IDENTITY.md')],
    gap:'Needs native planet/ship/dimension/instance and actual replay eligibility/history boundaries. Workshop dispatch activates no replay or travel.'},
  {worldId:'book.labyrinth_mad_god',status:'two supplied volumes, one setting; no native topology registered',
    continuity:'Searing Isle and Sewers of Kastilla are local regions; transported furnished room, arena, bog and Bandit jungle strand retain separate location/history.',
    hubInstitution:'System sponsors and paid arena authorization are contested jurisdiction. A furnished arrival/saferoom does not prove a permanent lived central hub.',
    physical:['V1 island exit occurs after terrain changed','V2 cosmic portal travel dissolves/reassembles Nick; protection and cargo custody are explicit','Bandit jungle develops independently; exact parallel clock sync unknown'],
    scenarioInstance:'Tutorial/arena/challenge contracts apply to actual places and loans. Tower quest advertises partitioned pocket-dimension floors; included story does not visit them.',
    branch:'Separate host/core lives and changed island are persistent outcomes, not generic reset. No branch clone or tower-instance replay supplied.',
    mental:'Visualization/map/journal knowledge is mental information, not an accessible physical inner world; memory map does not update moving actors.',
    sceneWindow:'V1 guest meal51–56 and v2 bog guide80–96 are separate era windows; no automatic travel/canonical skip connects them.',
    clocks:'Quest/extraction/rest announcements differ from parallel jungle time; no exact universal ratio or browser-closed disaster selected.',
    edgeCarriers:'Future edges bind actual reconstructed body, same controller, owned cargo versus arena loans, soulbound owner/charges, local faculty and independent companion routing. Bandit arrival must not be assumed.',
    evidence:[topologyEvidence('labyrinth-mad-god-1',['B03-C14','B07-C24','B07-C28','B07-C30'],'POWERS.md'),topologyEvidence('labyrinth-mad-god-2',['R01-C17','R01-C18','R04-C02','R03-C23','R03-C24','R03-C25','R07-C37'],'WORLD.md')],
    gap:'Needs actual island/arena/bog endpoints and custody/portal rules; tower interior remains source-unknown and must be labelled original if later authored.'},
]);

const phase=(id,actors,means,branches,retained,prerequisiteEventKinds=[])=>({id,actors,requiredMeans:means,branches,retained,prerequisiteEventKinds});
export const SITUATED_BOOK_CHAINS = freeze([
  {id:'situated.chain.orv.roster_accountability',worldId:'book.omniscient_reader',sceneIds:['situated.orv.chungmuro_roster'],classification:'original branchable local insertion, source-qualified room/contract cues',nativeStatus:'unactivated; no registered commands/effects',
    independentGoals:'Pildu retains his source-era authority/defense interests; residents want water and actual room capacity; proposed runner wants completed deliveries, not protagonist recognition.',
    phases:[
      phase('claim',['player','situated.orv.water_runner'],['appearanceObservable'],['honest guest','optional attributed keeper claim','refuse duty'],['actual claimant/observer/evidence'],[]),
      phase('check',['situated.orv.room_witness','situated.orv.water_runner'],['roomRecordAvailable'],['witness confirms limited delivery','mismatched title remains disputed','seek incumbent account'],['different observer beliefs'],['claim_recorded']),
      phase('duty',['player','source.orv.pildu'],['localPermission','dutyAccepted'],['willing scoped paid duty','ordinary own-room work','partial supply','decline'],['specific right/duty or refusal; no source transfer'],['claim_checked']),
      phase('response',['source.orv.pildu','situated.orv.water_runner'],['actualDeliveryEvidence'],['legitimate performance','compensate short delivery','expose forged claim','hostile obstruction only after actual actor choice'],['spent stock; claimant liability; resident access'],['duty_decided']),
      phase('closure',['player','situated.orv.room_witness'],['correctionChannelAvailable'],['restitution','authorized one-right handover','keep ordinary tenancy','withdraw'],['original performer survives; known corrections differ'],['response_committed']),
      phase('later_queue',['situated.orv.water_runner','situated.orv.room_witness'],['samePeopleReachable'],['honor real delivery','request unpaid duty','withhold unearned access','accept refusal without new boss'],['same roster/witness/event IDs, finite stock, duties and distinct beliefs'],['closure_committed'])
    ],evidence:[orv[0],orv[1],orv[3]],gap:'Native room/water/coins/rights and observer-history joins; root chain runtime owns actual committed phases.'},
  {id:'situated.chain.worm.repair_reputation',worldId:'book.worm',sceneIds:['situated.worm.costume_work'],classification:'original local chain; no forced Undersider recruitment',nativeStatus:'unactivated; no registered commands/effects',
    independentGoals:'Worker wants funded safe repair; customer wants actual garment back; Taylor/Undersiders retain their own cautious introductions and choices.',
    phases:[
      phase('order',['player','situated.worm.repair_worker'],['willingAccess'],['civilian order','attributed cape alias','decline'],['garment owner and payer'],[]),
      phase('material',['player','situated.worm.repair_worker'],['materialCompatible','ordinaryCompetence'],['ordinary seam repair','seek actual compatible stock','partial repair','refuse untested protection promise'],['actual tested seam; bulletproof remains unknown'],['order_decided']),
      phase('recognition',['situated.worm.return_customer','situated.worm.repair_worker'],['creditEvidenceAvailable'],['witness paid work','challenge borrowed name','keep civilian privacy'],['appearance/personal memory differ'],['material_checked']),
      phase('settlement',['player','situated.worm.repair_worker'],['actualDeliveryEvidence'],['pay/return actual garment','refund unused owned stock','correct stolen credit','hostile withholding creates exact unpaid dispute'],['finite stock, bill, custody and actual performer'],['recognition_recorded']),
      phase('later_counter',['situated.worm.return_customer','situated.worm.repair_worker'],['samePeopleReachable'],['repeat paid work','request restitution','retain unknown alias','peaceful refusal'],['specific trust/custody history; no copied shard, automatic affection or spawned villain'],['settlement_committed'])
    ],evidence:[worm[0],worm[1],worm[3]],gap:'Native local item/craft/payment/custody and distinct knowledge consumers; no canon cape role/recruitment replaced.'},
  {id:'situated.chain.mechanic.prototype_authority',worldId:'book.legendary_mechanic',sceneIds:['situated.mechanic.workshop_dispatch'],classification:'original prototype/delivery chain from source craft/infiltration contrasts',nativeStatus:'unactivated; no registered commands/effects',
    independentGoals:'Customer needs working output on a funded deadline; clerk needs correct delivery; Han retains private expertise/blueprints and actual mission priorities.',
    phases:[
      phase('drawing',['player','situated.mechanic.dispatch_clerk'],['instructionsKnown'],['attribute fragment to teacher','request complete design','ordinary spare-part replacement','decline'],['information provenance; no blueprint mastery grant'],[]),
      phase('bench',['player','source.mechanic.lu_qian'],['toolAvailable','materialCompatible','ordinaryCompetence'],['funded test','partial safe repair','stop for missing knowledge'],['actual consumed parts/test; retained unused stock'],['drawing_checked']),
      phase('function',['player','source.mechanic.han'],['deviceEnergyAvailable','signalAvailable','operatorControlReady'],['demonstrate actual function','report range/energy limit','ask willing specialist','withdraw'],['bounded test evidence; source/control remains with owner'],['bench_work_committed']),
      phase('dispatch',['situated.mechanic.dispatch_clerk','player'],['credentialAccepted','actualDeliveryEvidence'],['honest delivery','legitimate borrowed courier permission','audit false cover','hostile forged completion'],['separate face/slip/function tests; exact liability'],['function_checked']),
      phase('later_service',['situated.mechanic.dispatch_clerk','source.mechanic.lu_qian'],['samePeopleReachable'],['pay maintenance','correct earlier wrong credit','fund refinement','decline new order'],['unfinished design stays unfinished; retained prototype/stock/order history'],['dispatch_committed'])
    ],evidence:[mechanic[0],mechanic[3],mechanic[5],mechanic[6],mechanic[7]],gap:'Native funded orders, workshop/device effects, source/knowledge/credit and repeated actual service consumers required.'},
  {id:'situated.chain.labyrinth.guest_and_guide',worldId:'book.labyrinth_mad_god',sceneIds:['situated.labyrinth.guest_meal','situated.labyrinth.bog_field_guide'],classification:'original reusable local cooperation/research pattern in two separate source-era windows; no forced link/skip between them',nativeStatus:'unactivated; no registered commands/effects',
    independentGoals:'V1 Elder distributes actual food/guards; Bandit acts independently. V2 Sophia retains private methods/costs; copyist wants useful attributed guide, not ownership of Nick source.',
    phases:[
      phase('offer',['player','local_recipient'],['recipientWilling','recipientReachable'],['owned food or writing stock','ordinary labor','keep private','refuse'],['actual local recipient/stock; no automatic contract'],[]),
      phase('observe',['player','local_witness'],['ordinaryCompetence','toolAvailable'],['cook/watch or copy known observation','record report as report','partial preparation'],['witnessed work distinct from inferred goodwill/method'],['offer_decided']),
      phase('method',['player','local_specialist'],['instructionsKnown'],['ask willing help','ordinary tool route','decline private/source-incompatible method'],['instruction distinct from installed core/controller; no compelled revelation'],['observation_recorded']),
      phase('cooperate',['local_recipient','local_specialist','player'],['willingAccess','actualDeliveryEvidence'],['finite agreed watch/copy','respect refusal','correct overstated credit','hostile stock taking creates exact custody dispute'],['aid and trust/obligation separate; independent local choices'],['method_decided']),
      phase('later_return',['local_recipient','local_witness'],['samePeopleReachable'],['recognize actual meal/guide','add attributed correction','seek restitution','continue ordinary guest life'],['same local IDs/history and used stock; no Trell revival, Bandit ownership or tower ending invention'],['cooperation_committed'])
    ],actorAliases:{'situated.labyrinth.guest_meal':{local_recipient:'source.labyrinth.elder',local_witness:'situated.labyrinth.guest',local_specialist:'source.labyrinth.bandit'},'situated.labyrinth.bog_field_guide':{local_recipient:'situated.labyrinth.copyist',local_witness:'source.labyrinth.nick',local_specialist:'source.labyrinth.sophia'}},
    evidence:[labyrinth[2],labyrinth[3],labyrinth[9],labyrinth[10]],gap:'Per-window actual recipient stock, nonverbal consent, attributed guide/native knowledge and retained observer histories; cross-era passage separately required.'},
]);

export function getSituatedBookTopology(worldId) {
  return SITUATED_BOOK_TOPOLOGIES.find(topology => topology.worldId === worldId) || null;
}
export function getSituatedBookChain(chainId) {
  return SITUATED_BOOK_CHAINS.find(chain => chain.id === chainId) || null;
}

const rule = (id, kind, publicHint, requiredJoins, extra = {}) => ({id,kind,publicHint,requiredJoins,
  classification:id.includes('.') ? 'source-qualified local restriction; native snapshot admission is proposed' : 'original conservative snapshot admission; not a universal source law',...extra});
export const SITUATED_BOOK_RULES = freeze([
  rule('ordinary_entry','entry','Ordinary entry needs this place’s actual permission, not a borrowed name.',joins.entry),
  rule('appearance_claim','appearance','Appearance can support an attributed recognition claim; it transfers no property or power.',joins.identity),
  rule('recognized_role','role','A real role needs the incumbent, their consent and the authority that can hand it over.',joins.role),
  rule('credit_claim','credit','A claim of credit differs from a witnessed action and its rightful recipient.',joins.credit),
  rule('opportunity_redirect','opportunity','Check this opportunity’s recipient and terms before proposing a change.',joins.credit),
  rule('equipment_substitution','equipment','An owned replacement still needs a fit and function check on the actual device.',joins.equipment),
  rule('body_replacement','body','A borrowed appearance supplies no body, controller or source transition.',joins.identity),
  rule('learned_execution','execution','Instructions, source, fuel and control are separate means.',joins.execution),
  rule('ordinary_work','work','Useful ordinary work needs actual tools, material and willing access.',joins.equipment),
  rule('share_owned_stock','stock','Offer actual owned supplies and let the recipient choose.',joins.credit),
  rule('mechanic.face_cover','face','This local cover has several recognition channels; one matching face is incomplete.',joins.identity,{worldId:'book.legendary_mechanic'}),
  rule('mechanic.robot_control','robot','A device needs its own power and a reachable control signal.',joins.execution,{worldId:'book.legendary_mechanic'}),
  rule('worm.bulletproof_claim','bulletproof','An untested armor hope is not a demonstrated protection.',joins.equipment,{worldId:'book.worm'}),
  rule('labyrinth.bag_process','bag','This bag can separate and arrange contents; refining requires a workspace outside it.',joins.equipment,{worldId:'book.labyrinth_mad_god'}),
  rule('labyrinth.staff_use','staff','A held staff still needs its owner’s keyed command and actual charges.',joins.execution,{worldId:'book.labyrinth_mad_god',eraPrefix:'labyrinth.v2.'}),
  rule('labyrinth.matrix_identity','matrix','An ordinary summon matrix is not the deceased individual’s mind.',joins.identity,{worldId:'book.labyrinth_mad_god',eraPrefix:'labyrinth.v2.'}),
  rule('labyrinth.force_control','force','Acquisition does not teach controlled movement or supply mana.',joins.execution,{worldId:'book.labyrinth_mad_god',eraPrefix:'labyrinth.v2.'}),
  rule('labyrinth.flask_use','flask','A drinker and registered flask owner remain different; use spends actual elixir.',joins.execution,{worldId:'book.labyrinth_mad_god',eraPrefix:'labyrinth.v2.'}),
]);

export function getSituatedBookProfile(id) {
  return SITUATED_BOOK_PROFILES.find(profile => profile.id === id) || null;
}
export function getSituatedBookScene(id) {
  return SITUATED_BOOK_SCENES.find(scene => scene.id === id) || null;
}
const checkMeans = (means, keys) => {
  const missing = keys.filter(key => typeof means?.[key] !== 'boolean');
  const failed = keys.filter(key => means?.[key] === false);
  return failed.length ? ['blocked', `Missing usable means: ${failed.join(', ')}.`] : missing.length
    ? ['unknown', `Unstated means: ${missing.join(', ')}.`] : ['supported', 'All demanded means are explicitly supplied.'];
};
const exactStock = (context, itemId, holderId) => (Array.isArray(context.stock) ? context.stock : [])
  .filter(stock => stock?.itemId === itemId && stock?.holderId === holderId);
const stockCheck = (context, request) => {
  if (!request.itemId || !Number.isInteger(request.quantity) || request.quantity <= 0) return ['unknown','Exact item and positive integer quantity required.'];
  const records = exactStock(context,request.itemId,context.actor.id);
  if (records.length !== 1) return ['unknown','One unambiguous actual stock/custody record required.'];
  const stock = records[0];
  if (!Number.isInteger(stock.quantity) || stock.quantity < 0 || typeof stock.owned !== 'boolean' || typeof stock.available !== 'boolean') return ['unknown','Stock quantity, ownership and availability must be explicit.'];
  if (!stock.owned || !stock.available || stock.quantity < request.quantity) return ['blocked','Actual owned unreserved stock is insufficient.'];
  return ['supported','Actual owned stock supports the proposed use; this receipt consumes nothing.'];
};
function decision(profile, specification, context) {
  const request=context.request || {}, means=context.knownMeans || {}, carriers=context.carriers || {};
  switch (specification.kind) {
    case 'entry': return checkMeans(means,['localPermission','routeReachable']);
    case 'appearance':
      if (carriers.appearance?.claimantId !== context.actor.id || !carriers.appearance?.claimedPersonId) return ['unknown','An attributed actual claimant and claimed identity are required.'];
      return checkMeans(means,['appearanceObservable']);
    case 'role': {
      const role=carriers.role;
      if (!isId(role?.id) || !isId(role.incumbentId) || role.recipientId !== context.actor.id || !Array.isArray(role.rightIds) || !Array.isArray(role.dutyIds) || !role.rightIds.every(isId) || !role.dutyIds.every(isId)) return ['unknown','Exact incumbent, recipient, rights and duties required; canonical role is not implied.'];
      if (role.incumbentLife !== 'alive') return role.incumbentLife === 'dead' ? ['blocked','This proposed willing living handover cannot revive/replace a resolved dead incumbent.'] : ['unknown','Incumbent life is unstated.'];
      if (role.rightIds.length !== 1 || role.dutyIds.length < 1) return ['unknown','The proposed local handover must name one actual right and its actual duty/liability.'];
      if (request.canonicalReplacement === true) return ['unknown','Canonical actor/role replacement needs a separately authored source-era branch and native binding.'];
      return checkMeans(means,['incumbentConsent','institutionAuthorized','dutyAccepted','rightAvailable']);
    }
    case 'credit': {
      const event=carriers.event;
      if (!event?.id || !event.performerId || !event.recipientId) return ['unknown','Actual event performer and rightful recipient required.'];
      if (request.transferReward === true) return ['blocked','Attributing credit does not transfer a native reward or stock.'];
      if (request.claimedPerformerId !== context.actor.id) return ['unknown','Exact attributed claimant required.'];
      if (event.performerId !== request.claimedPerformerId) return ['blocked','This claimant did not perform the supplied actual event; a false claim must remain a separately attributed belief.'];
      return checkMeans(means,['creditEvidenceAvailable']);
    }
    case 'opportunity': {
      const opportunity=carriers.opportunity;
      if (!opportunity?.id || !opportunity.rightfulRecipientId || !opportunity.proposedRecipientId) return ['unknown','Exact opportunity and both recipients required.'];
      if (request.fateTheft === true) return ['unknown','This profile establishes no universal fate-transfer operation.'];
      return checkMeans(means,['termsKnown','recipientEligible','donorConsent','authorityAllowsRedirect']);
    }
    case 'equipment': {
      const item=carriers.equipment;
      if (!item?.id || !item.deviceId || item.installerId !== context.actor.id) return ['unknown','Actual device, proposed component and installer required.'];
      const stock=stockCheck(context,{...request,itemId:item.id});
      if (stock[0] !== 'supported') return stock;
      if (profile.id === 'book.worm' && item.kind === 'tinker') return ['unknown','A named Tinker design/operator binding is required; ordinary costume evidence is insufficient.'];
      if (profile.id === 'book.omniscient_reader' && request.copyFaculty === true) return ['blocked','Material replacement cannot copy an attribute, stigma or body faculty.'];
      return checkMeans(means,['toolAvailable','materialCompatible','fitTested','functionTested','installerCompetent','custodyAllowsUse']);
    }
    case 'body':
      if (request.cause === 'appearance' || request.cause === 'title' || request.cause === 'credential') return ['blocked','This cause changes no actual body/controller/soul/source carrier.'];
      return ['unknown','Source-specific host/control/reincarnation exceptions require exact actual donor/occupant/controller/source binding and conservation. No such native transition is registered here.'];
    case 'execution': return checkMeans(means,['instructionsKnown','sourceBound','fuelAvailable','bodyCompatible','controlReady','targetReachable']);
    case 'work': {
      const stock=stockCheck(context,request);
      return stock[0] === 'supported' ? checkMeans(means,['toolAvailable','ordinaryCompetence','willingAccess']) : stock;
    }
    case 'stock': {
      if (!request.recipientId || request.recipientId === context.actor.id) return ['unknown','A different actual recipient is required.'];
      const stock=stockCheck(context,request);
      return stock[0] === 'supported' ? checkMeans(means,['recipientWilling','recipientReachable']) : stock;
    }
    case 'face': return checkMeans(means,['faceMatch','uniformMatch','bodyMatch','voiceMatch','radioCadenceMatch','credentialAccepted']);
    case 'robot': {
      const device=carriers.equipment;
      if (!device?.deviceId || device.operatorId !== context.actor.id || !Number.isFinite(device.controlDistance) || !Number.isFinite(device.declaredControlRange) || device.controlDistance < 0 || device.declaredControlRange < 0) return ['unknown','Actual operator/device/control distance and declared device range required.'];
      if (device.controlDistance > device.declaredControlRange) return ['blocked','Actual target is outside this device’s supplied control reach.'];
      return checkMeans(means,['deviceEnergyAvailable','signalAvailable','operatorControlReady']);
    }
    case 'bulletproof': return ['unknown','The cited costume was not tested for bullet resistance. A different native material/test binding must establish any actual protection.'];
    case 'bag': return request.processInsideBag === true ? ['blocked','Bag of Molding does not mix/refine inside; remove actual stock into a suitable workspace.'] : checkMeans(means,['workspaceOutsideBag','toolAvailable','materialCompatible']);
    case 'staff': {
      const item=carriers.equipment;
      if (!item?.id || !item.ownerId || !Number.isInteger(item.charges) || item.charges < 0) return ['unknown','Actual keyed owner/item and charge stock required.'];
      if (item.charges === 0) return ['blocked','The supplied actual staff has no charges.'];
      return checkMeans(means,['ownerCommandAvailable','keyAccepted','targetReachable']);
    }
    case 'matrix':
      if (request.recreateMind === true || request.sameDeceasedPerson === true) return ['blocked','Sophia’s ordinary matrix does not recreate mind/self; the deceased actor is not revived.'];
      if (request.livingContract === true) return ['unknown','The living contract summon needs separate actor/consent/cost rules; ordinary matrix receipt does not cover it.'];
      return checkMeans(means,['ritualMeansAvailable','matrixKnown','manaAvailable','staminaAvailable','controllerReady']);
    case 'force': return checkMeans(means,['sourceBound','manaAvailable','movementControlReady','bodyCompatible','safePath']);
    case 'flask': {
      const item=carriers.equipment;
      if (!item?.id || !item.registeredOwnerId || !request.drinkerId || typeof item.elixirAvailable !== 'boolean') return ['unknown','Actual flask/registered owner/drinker and elixir stock required.'];
      if (request.transferOwnership === true) return ['blocked','Lending/drinking does not transfer the soulbound registered owner.'];
      if (!item.elixirAvailable) return ['blocked','Actual elixir is unavailable; no refill occurs in this pure check.'];
      return checkMeans(means,['custodyAllowsUse','drinkerReachable']);
    }
    default: return ['unknown','Unrecognized local rule kind.'];
  }
}

function receipt(profile, scene, specification, context, result) {
  const known = Array.isArray(context.observer?.knownRuleIds) && context.observer.knownRuleIds.includes(specification.id);
  return freeze({
    profileId:profile?.id || null, sceneId:scene?.id || null, ruleId:outputId(specification.id),
    status:result[0], authoringReason:result[1],
    observerExplanation:known ? specification.publicHint : 'The local result needs an observation or explanation before its rule is known.',
    observerId:outputId(context.observer?.id), requiredNativeJoins:specification.requiredJoins,
    nativeBindingGap:profile?.nativeBindingGap || 'Unknown profile binding.',
    evidence:profile?.evidence || [], ruleClassification:specification.classification || 'unknown',
    prospectiveCarriers:result[0] === 'supported' && specification.kind === 'role'
      ? {rightIds:[...context.carriers.role.rightIds],dutyIds:[...context.carriers.role.dutyIds],incumbentId:context.carriers.role.incumbentId,recipientId:context.actor.id} : null,
    transferableCarriers:[], grants:[], committed:false,
    worldActivation:'unregistered', implementationStatus:'implemented-unverified pure admission only',
  });
}

/** Snapshot contract is documented in situated/INTEGRATION.json. Missing is unknown. */
export function evaluateSituatedBookRule(worldId, ruleId, context = {}) {
  context=context && typeof context === 'object' ? context : {};
  const profile=getSituatedBookProfile(worldId), scene=getSituatedBookScene(context.sceneId);
  const specification=SITUATED_BOOK_RULES.find(candidate => candidate.id === ruleId);
  if (!specification) return receipt(profile,scene,{id:ruleId,publicHint:'Unknown local rule.',requiredJoins:joins.entry},context,['unknown','Unknown rule ID.']);
  let result;
  if (!profile || !scene || scene.worldId !== worldId) result=['unknown','Exact profile and one of its bounded scene IDs required.'];
  else if (specification.worldId && specification.worldId !== worldId) result=['blocked','This source-specific rule belongs to another world.'];
  else if (specification.eraPrefix && !scene.eraId.startsWith(specification.eraPrefix)) result=['blocked','This exception is outside the selected source era.'];
  else if (!isId(context.actor?.id) || !isId(context.actor.bodyId) || !isId(context.actor.controllerId) || context.actor.life !== 'alive') result=context.actor?.life === 'dead' ? ['blocked','The proposed living action cannot revive the resolved actor.'] : ['unknown','Actual living actor/body/controller IDs required.'];
  else if (context.binding?.sceneId !== scene.id || context.binding?.worldId !== worldId || context.binding?.eraId !== scene.eraId || context.binding?.nativeBound !== true) result=['unknown','Exact source-era native scene binding is absent; no world activation or commitment follows.'];
  else if (context.carriers?.body && (context.carriers.body.id !== context.actor.bodyId || context.carriers.body.controllerId !== context.actor.controllerId)) result=['blocked','Supplied body/controller carriers disagree with the actual actor snapshot.'];
  else result=decision(profile,specification,context);
  return receipt(profile,scene,specification,context,result);
}

/** Only this observer's explicitly supplied tests are projected, never global truth. */
export function evaluateSituatedRecognition(worldId, context = {}) {
  context=context && typeof context === 'object' ? context : {};
  const profile=getSituatedBookProfile(worldId), scene=getSituatedBookScene(context.sceneId);
  const observer=context.observer, claim=context.carriers?.appearance;
  const valid=profile && scene?.worldId === worldId && isId(observer?.id) && isId(context.actor?.id) && claim?.claimantId === context.actor.id && isId(claim?.claimedPersonId) && isId(claim?.claimId);
  const tests=valid && Array.isArray(observer.tests) ? observer.tests.filter(test =>
    test && test.observerId === observer.id && test.subjectId === context.actor.id && test.claimId === claim.claimId &&
    ['appearance','credential','personal_memory','demonstrated_method','registry','body_faculty','soul_signature'].includes(test.kind) &&
    ['match','mismatch','unknown'].includes(test.result) && typeof test.evidenceId === 'string' && test.evidenceId.length > 0) : [];
  const result=tests.some(test => test.result === 'mismatch') ? 'blocked' : tests.length && tests.every(test => test.result === 'match') ? 'supported' : 'unknown';
  return freeze({profileId:profile?.id || null,sceneId:scene?.id || null,observerId:outputId(observer?.id),
    status:valid ? result : 'unknown',tests:tests.map(test => ({kind:test.kind,result:test.result,evidenceId:test.evidenceId})),
    explanation:tests.length ? 'These are this observer’s tests of this attributed claim. Agreement proves no transferable power, office, memory or bond.' : 'No matching evidence for this observer and claim was supplied.',
    grants:[],committed:false,worldActivation:'unregistered'});
}

/** Safe UI projection requires actual known scene IDs and hides authoring reasons/evidence. */
export function situatedBookProjection(worldId, context = {}) {
  context=context && typeof context === 'object' ? context : {};
  const profile=getSituatedBookProfile(worldId);
  if (!profile) return freeze({profileId:null,status:'unknown',scenes:[],receipts:[]});
  const known=Array.isArray(context.knownSceneIds) ? context.knownSceneIds : [];
  const scenes=SITUATED_BOOK_SCENES.filter(scene => scene.worldId === worldId && known.includes(scene.id));
  const allowedRules=new Set(Array.isArray(context.observer?.knownRuleIds) ? context.observer.knownRuleIds : []);
  return freeze({profileId:worldId,status:'authoring-profile; native world binding required',
    scenes:scenes.map(scene => ({id:scene.id,text:scene.knownEntryText})),
    receipts:(Array.isArray(context.receipts) ? context.receipts : []).filter(result =>
      result && result.profileId === worldId && result.observerId === context.observer?.id && isId(result.sceneId) && isId(result.ruleId) &&
      ['supported','blocked','unknown'].includes(result.status) && typeof result.observerExplanation === 'string' && known.includes(result.sceneId) && allowedRules.has(result.ruleId))
      .map(result => ({sceneId:result.sceneId,ruleId:result.ruleId,status:result.status,text:result.observerExplanation})),
  });
}
