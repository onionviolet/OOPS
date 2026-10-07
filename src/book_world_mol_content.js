import {MOL_IDS as I,MOL_LOCATIONS as L,MOL_KEYS as K} from './book_world_mol_ids.js';
import {molCommands,molControllers,molPowers,molSources,molConditions,molSituations,molEncounters} from './book_world_mol_actions.js';
export {MOL_IDS,MOL_LOCATIONS,MOL_KEYS,MOL_FOOTPRINTS,MOL_FRONTIER,MOL_SOURCE_HASH,MOL_SOURCE_SNAPSHOT,MOL_NATIVE_DOMAIN,MOL_BASELINE} from './book_world_mol_ids.js';
export {molSources};
export const molWorlds=[{id:I.world,label:'Cyoria · academy visitor campaign',publicName:'Cyoria',continuityLabel:'Original independent retained-body branch',provenance:'nobody103, Mother of Learning; qualified supplied WebToEpub snapshot e53f95695730. Cyoria/academy/cast/magic distinctions source-grounded; entry, grants, budgets and local service outcomes authored.'}];
export const MOL_INITIAL_FACTS={[I.world]:{'book.mol.arrivalMet':false,'book.mol.arcClosed':false,'book.mol.retrieval':'unoffered','book.mol.hazard':'undisturbed','book.mol.forecast':'unknown','book.mol.aftermath':'unresolved','book.mol.researchDeposited':false}};
const rows=[
 [I.imaya,'Imaya Kuroshka',L.house,{'book.mol.crowns':10,'book.mol.attention':14}],
 [I.ilsa,'Ilsa Zileti',L.academy,{'book.mol.crowns':0,'book.mol.attention':10}],
 [I.ibery,'Ibery Ambercomb',L.library,{'book.mol.crowns':14,'book.mol.attention':12}],
 [I.nora,'Nora Boole',L.workshop,{'book.mol.crowns':10,'book.mol.attention':14,'book.mol.personalMana':18}],
 [I.xvim,'Xvim Chao',L.court,{'book.mol.crowns':0,'book.mol.attention':7}],
 [I.taiven,'Taiven',L.sewer,{'book.mol.crowns':8,'book.mol.attention':10,'book.mol.personalMana':12}],
 [I.kael,'Kael Tverinov',L.house,{'book.mol.crowns':10,'book.mol.attention':12}],
 [I.zorian,'Zorian Kazinski',L.library,{'book.mol.crowns':0,'book.mol.attention':3}],
 [I.opponent,'Hatch scavenger (original local adversary)',L.sewer,{'book.mol.crowns':0,'book.mol.attention':4}]
];
const descriptions={
 [I.imaya]:'Own household, costs, chores and guests. Guest work is an original explicit agreement; no automatic home ownership or private family knowledge.',
 [I.ilsa]:'Academy representative and invocation teacher. Guest library permission, practical competence and commercial certification are distinct.',
 [I.ibery]:'Library assistant with actual books/materials, work and attention. A received observation is separate from author knowledge.',
 [I.nora]:'Formula teacher who requires understanding and functional reconstruction. Her own attuned mana anchors a narrow authored device; she shares neither mastery nor personal source.',
 [I.xvim]:'Demanding mentor evaluates attention and controlled procedure. This paid guest exercise is manual device control, not a copied mage faculty.',
 [I.taiven]:'Recent graduate seeking paid retrieval work with trained physical/combat means. She can receive a bounded survey and refuse an unsafe plan; no invulnerable escort.',
 [I.kael]:'Widowed healer/alchemist with scarce supplies and a daughter. Early guest collaboration and numerical budgets are original proposals; research privacy and family time remain his.',
 [I.opponent]:'Original independent local scavenger guarding a short hatch for salvage. Own hook, meal, finite effort and purse; no sourced antagonist identity or future intelligence. Intervention changes actual injury/position/means.',
 [I.zorian]:'Third-year student following his own ordinary studies. His private perceptions, later loop discoveries and memories are not the visitor’s knowledge.'};
export const MOL_NATIVE_PEOPLE={
 [I.imaya]:{inventory:{[K.meal]:4,[K.oil]:2},skills:{},reputation:{}},
 [I.ilsa]:{inventory:{[K.badge]:1},skills:{},reputation:{}},
 [I.ibery]:{inventory:{[K.paper]:4,[K.ink]:2},skills:{},reputation:{}},
 [I.nora]:{inventory:{[K.cube]:2,[K.ink]:2},skills:{},reputation:{}},
 [I.xvim]:{inventory:{},skills:{},reputation:{}},
 [I.taiven]:{inventory:{[K.rod]:1,[K.rope]:2,[K.meal]:2},skills:{},reputation:{}},
 [I.kael]:{inventory:{[K.salve]:3,[K.paper]:2},skills:{},reputation:{}},
 [I.zorian]:{inventory:{[K.paper]:1},skills:{},reputation:{}},
 [I.opponent]:{inventory:{[K.hook]:1,[K.meal]:1,[K.oil]:1},skills:{},reputation:{}}};
export const MOL_NATIVE_STOCK={[I.stock]:{[K.watch]:1},[I.shop]:{[K.paper]:6,[K.ink]:4,[K.cube]:3,[K.oil]:3,[K.meal]:4,[K.rope]:3}};
const people=rows.map(([id,label,location,resources])=>({id,label,revision:1,worldId:I.world,location,description:descriptions[id],inventory:'native',provision:false,resources,body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}}));
export const molDefinitions={people,sites:[{id:I.site,revision:1,label:'Cyoria supervised workshop bench',capacity:1}],powers:molPowers,conditions:molConditions,encounters:molEncounters,situations:molSituations,commands:molCommands,controllers:molControllers};
export const MOL_ITEM_SPECIFICATIONS=[
 ['Cyorian research paper','Counted local blank paper. Study/research consumes it; a title grants no spell.'],
 ['Cyorian formula ink','Counted inscription material for the supervised keyed lamp.'],
 ['Cyorian blank stone cube','Source-pattern training blank. It is not a working magical item without anchored formula, specialist and test.'],
 ['Cyorian keyed formula lamp','Original bounded manual-interface variant of Nora’s lamp lesson. Its keyed brightness/occlusion procedure needs earned control and finite specialist-supplied device fuel; it grants no spellcasting, attacks or light elsewhere.'],
 ['Cyorian lamp oil','Ordinary combustible fuel. Spell disruption cannot extinguish its continuing flame.'],
 ['Cyorian bread parcel','Counted household food, used by actual paid meals or Taiven field preparation.'],
 ['Cyorian mild burn salve','Kael’s finite ordinary preparation, used only for this authored mild exposure/burn. No universal cure.'],
 ['Cyorian sewer residue sample','One original local sealed sample obtained through supported field observation, not a captured creature or copied power.'],
 ['Cyorian retrieved watch','The finite local retrieval objective, represented in hatch stock. Return it to the willing client once.'],
 ['Cyorian annotated design notebook','Player-authored mature design record compiled from completed study and actual observed outcomes. Material is exportable; magical operation is local.'],
 ['Cyorian guest library pass','Ilsa’s explicit original guest access, distinct from enrolment or commercial mage certification.'],
 ['Cyorian scavenger reach hook','Original adversary’s short physical reach tool. It supports a bounded threatened hatch strike, not magic, an unlimited attack or all tunnel ownership.'],
 ['Cyorian Taiven focus staff','Taiven’s own formula-bearing combat implement. It supports her bounded field response and grants no player entitlement.']
].map(([id,description])=>({id,name:id,description,value:1,tags:{expedition:true,book_world_mol:true}}));
export function registerMolItems({itemTemplates,OtherItem}){for(const spec of MOL_ITEM_SPECIFICATIONS){if(itemTemplates[spec.id])throw Error(`Duplicate Mother of Learning item ${spec.id}.`);itemTemplates[spec.id]=new OtherItem(spec);}}
