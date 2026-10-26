import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K} from './book_world_lotm_ids.js';
import {lotmCommands,lotmSources,lotmPowers,lotmEnergies} from './book_world_lotm_actions.js';
import {createLotmState} from './book_world_lotm_state.js';
import {LOTM_HOSTILES,hostileAbilityCommands,abilityConditions} from './book_world_lotm_abilities.js';
import {LOTM_PROFILES} from './book_world_lotm_lives.js';
import {BENCH_STOCK,STOCK_REV_KEY,LOTM_CHARACTERISTIC as CORE} from './book_world_lotm_bench.js';
import {LOTM_BENCH_ITEMS,FORMULA_ROWS_REVISION} from './lotm_formula_rows.js';
import {RITE_ITEMS} from './book_world_lotm_ritual.js';
export {LOTM_IDS,LOTM_LOCATIONS,LOTM_KEYS,LOTM_SOURCE_HASH,LOTM_SOURCE_SNAPSHOT} from './book_world_lotm_ids.js';
export {lotmSources};
export const lotmWorlds=[{id:I.world,label:'Tingen · supervised probationer branch',publicName:'Tingen',continuityLabel:'Original early-Tingen probationer branch',
 provenance:'Lord of the Mysteries, supplied EPUB 6126274478a9. Initiation teaching, guided attention, perception exercise and sleep recovery are source-grounded (plan H1/H2); the probationer, supervisor, stock counts, costs and timings are authored.'}];
// Original supervisor: no canon identity, memories or future knowledge.
const officer=(id,label,location,description,attention=6)=>({id,label,revision:1,worldId:I.world,location,inventory:'native',provision:false,description,resources:{'book.lotm.attention':attention},body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}});
export const lotmPeople=[{id:I.supervisor,label:'Warden Hale (original supervisor)',revision:1,worldId:I.world,location:L.workroom,inventory:'native',provision:false,
 description:'An original institutional supervisor who holds one prepared dose and the sample lots, and can teach one bounded method. Attention is finite; no canon identity.',
 resources:{'book.lotm.attention':6},body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}},
 officer(I.stormOfficer,'Storm duty officer (original, unnamed)',L.docks,'An original Mandated Punisher duty officer who runs the docks office. No canon identity; supervises visitors and errands in the Storm district.'),
 officer(I.member,'Nighthawk formal member (original, unnamed)',L.workroom,'An original formal member of the Nighthawk team. No canon identity; one of the group the vault needs to release a grade 3 item.'),
 officer(I.broker,'Tingen broker (original, unnamed)',L.docks,'An original trusted middleman who holds money and goods for both sides of a private sale until the buyer verifies. No canon identity; their word is the stake.'),
 officer(I.evernightDeacon,'Nighthawk senior deacon (original, unnamed)',L.workroom,'An original senior deacon appointed to examine Nighthawk candidates. Hale conducts the local pre-screen; this examiner releases the promotion dose. Institution role grounded in 168 p8-p13; identity, visit and attention authored.',3),
 officer(I.stormDeacon,'Storm senior deacon (original, unnamed)',L.docks,'An authored Storm examiner using the Nighthawk examination pattern, who conducts the promotion examination for the Mandated Punishers; the duty officer cannot. No canon identity.',3),
 officer(I.seniorDeacon,'Machinery senior deacon (original, unnamed)',L.university,'An authored Machinery examiner using the Nighthawk examination pattern, who conducts the promotion examination; the local office cannot. No canon identity.',3),
 officer(I.machineryOfficer,'Machinery records officer (original, unnamed)',L.university,'An original Machinery team records officer in the university quarter. No canon identity; supervises visitors and errands in the Steam and Machinery district.')];
// Opening stock lives with the supervisor (plan S3). Prehistory preparation is not debited again.
export const LOTM_NATIVE_STOCK={[I.supervisor]:{[K.dose]:1,[K.comparator]:1,[K.sampleA]:1,[K.sampleB]:1,[K.sealed3]:1},[I.broker]:{[K.frog]:1,[K.hairs]:1,[K.ink]:1,[K.marketCc9]:1,[K.marketCc8]:1,[K.marketSv9]:1,[K.marketSv8]:1,[K.marketSa9]:1,[K.marketSa8]:1,...BENCH_STOCK,[CORE.key]:CORE.stock}};
export const lotmDefinitions={people:[...lotmPeople,...LOTM_HOSTILES.map(h=>({id:h.id,label:h.label,revision:1,worldId:I.world,location:L.docks,inventory:'native',provision:false,description:'An original hostile Beyonder, not enrolled by default: they hold the same source and use the same ability records as the player. No canon identity.',resources:{},body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}}))],sites:[{id:I.site,revision:1,label:'Tingen supervised workroom bench',capacity:1}],powers:lotmPowers,energies:lotmEnergies,commands:[...lotmCommands,...hostileAbilityCommands],conditions:abilityConditions,encounters:[],controllers:[],situations:[{id:I.situation,revision:1,label:'Original Tingen probationer account',context:{worldId:I.world,instanceId:'book.lotm.tingen.main',continuityId:'book.lotm.probationer.branch',eraId:'book.lotm.early_tingen',regionId:'book.lotm.tingen'},participants:['player'],initialPhase:'present',phases:['present'],privateTruth:{role:'original_probationer'}}]};
export const LOTM_ITEM_SPECIFICATIONS=[
 ['Tingen prepared Seer dose','One supervised prepared dose from a pinned, authored lot. Holding it grants nothing; taking it is a separate irreversible step.'],
 ['Tingen ordinary comparator sample','An ordinary material used to compare against supported samples.'],
 ['Tingen supported sample lot A','A supported sample lot. Observation shows presence at the material, not identity or safety.'],
 ['Tingen supported sample lot B','A second, distinct supported sample lot for the same method.'],
 ['Tingen prepared Corpse Collector dose','One supervised prepared dose from a pinned, authored lot, issued when a probationer takes the Corpse Collector allocation. Holding it grants nothing; taking it is a separate irreversible step.'],
 ['Tingen prepared Gravedigger dose','A Sequence 8 Corpse Collector-line dose the workroom releases only after an assessed digestion. Holding it grants nothing; drinking it is a separate irreversible step.'],
 ['Tingen prepared Clown dose','A Sequence 8 dose the workroom releases only after an assessed digestion. Holding it grants nothing; drinking it is a separate irreversible step.'],
  ['Dried black-spotted frog','A dried black-spotted frog, a formula material for the Corpse Collector line. Worth about three soli.'],
  ['Bundle of rare hairs','A bundle sold as rare hairs. Whether it is what the seller says is for an appraiser to judge.'],
  ['Grave-dust ink','A jar of ink ground with grave dust, offered in barter at the frog\'s value.'],
  ['Unmarked prepared dose (Sequence 9)','A prepared potion with no label, sold through a broker. Drinking an unverified, unissued dose is a stated route to loss of control; an appraiser can say what it is.'],
  ['Unmarked prepared dose (Sequence 8)','A prepared potion with no label, a step up from the first. Drinking it undigested or out of order is a stated route to loss of control; an appraiser can say what it is.'],
  ['Tingen prepared Savant dose','One supervised prepared dose issued by the Machinery team\'s records officer on acceptance. Holding it grants nothing; drinking it is a separate irreversible step.'],
  ['Tingen prepared Archaeologist dose','A Sequence 8 Savant-line dose released only after the senior deacon\'s examination. Holding it grants nothing; drinking it is a separate irreversible step.'],
  ['Tingen prepared Sailor dose','One supervised prepared dose issued by the Mandated Punishers\' duty officer on acceptance. Holding it grants nothing; drinking it is a separate irreversible step.'],
  ['Tingen prepared Folk of Rage dose','A Sequence 8 Sailor-line dose released only after the Storm senior deacon\'s examination. Holding it grants nothing; drinking it is a separate irreversible step.'],
  ['Unmarked prepared dose (Savant line, Sequence 9)','A prepared potion with no label, sold through a broker. Drinking an unverified, unissued dose is a stated route to loss of control; an appraiser can say what it is.'],
  ['Unmarked prepared dose (Savant line, Sequence 8)','A prepared potion with no label, a step up from the first. Drinking it undigested or out of order is a stated route to loss of control; an appraiser can say what it is.'],
  ['Unmarked prepared dose (Sailor line, Sequence 9)','A prepared potion with no label, sold through a broker. Drinking an unverified, unissued dose is a stated route to loss of control; an appraiser can say what it is.'],
  ['Unmarked prepared dose (Sailor line, Sequence 8)','A prepared potion with no label, a step up from the first. Drinking it undigested or out of order is a stated route to loss of control; an appraiser can say what it is.'],
  ['Tingen sealed grade-3 item','A grade 3 sealed item from the Tingen vault: a small tarnished lamp that must not be lit. Handling it needs the group and clearance the church sets; it is returned the same day.']
  ,[CORE.id,'One tagged physical core. Its identity and use must be appraised; it is not a prepared potion.']
  ,...LOTM_BENCH_ITEMS
  ,...RITE_ITEMS
].map(([id,description])=>({id,name:id,description,value:1,tags:{expedition:true,book_world_lotm:true}}));
export function registerLotmItems({itemTemplates,OtherItem}){for(const spec of LOTM_ITEM_SPECIFICATIONS){if(itemTemplates[spec.id])throw Error(`Duplicate Lord of the Mysteries item ${spec.id}.`);itemTemplates[spec.id]=new OtherItem(spec);}}
// Pure enrollment of the original probationer branch (plan S2 prototype start).
// The caller owns the publication; this changes only the passed state.
export function enrollLotmBranch(state,profile='probationer'){
 const s=state.simulation;if(!s)throw Error('Enroll living-world services first.');
 if(state.actors.player.worldId===I.world)throw Error('The probationer branch is already enrolled.');
 state.worlds[I.world]||={facts:{},resources:{},completed:{}};state.actors.player.worldId=I.world;s.people.player.location=LOTM_PROFILES[profile].start;
 s.people.player.body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
 for(const d of lotmPeople){state.actors[d.id]||={facts:{},resources:{},completed:{},sources:{},techniques:{},worldId:d.worldId};
  Object.assign(state.actors[d.id],{worldId:d.worldId});Object.assign(state.actors[d.id].resources,d.resources);
  s.people[d.id]={life:'alive',inventory:d.inventory,location:d.location,bornAt:state.clock,definitionId:d.id,definitionRevision:d.revision,vitals:{...d.vitals},
   body:{id:`native.person.${d.id}.body`,form:'human',hands:2,mobile:true,ownerId:d.id,controllerId:d.id}};}
 state.actors[I.broker].resources[STOCK_REV_KEY]=FORMULA_ROWS_REVISION;
 state.lotm=createLotmState(state.clock,LOTM_PROFILES[profile].id);
 return state;
}
