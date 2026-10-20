import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K} from './book_world_lotm_ids.js';
import {lotmCommands,lotmSources,lotmPowers,lotmEnergies} from './book_world_lotm_actions.js';
import {createLotmState} from './book_world_lotm_state.js';
export {LOTM_IDS,LOTM_LOCATIONS,LOTM_KEYS,LOTM_SOURCE_HASH,LOTM_SOURCE_SNAPSHOT} from './book_world_lotm_ids.js';
export {lotmSources};
export const lotmWorlds=[{id:I.world,label:'Tingen · supervised probationer branch',publicName:'Tingen',continuityLabel:'Original early-Tingen probationer branch',
 provenance:'Lord of the Mysteries, supplied EPUB 6126274478a9. Initiation teaching, guided attention, perception exercise and sleep recovery are source-grounded (plan H1/H2); the probationer, supervisor, stock counts, costs and timings are authored.'}];
// Original supervisor: no canon identity, memories or future knowledge.
export const lotmPeople=[{id:I.supervisor,label:'Warden Hale (original supervisor)',revision:1,worldId:I.world,location:L.workroom,inventory:'native',provision:false,
 description:'An original institutional supervisor who holds one prepared dose and the sample lots, and can teach one bounded method. Attention is finite; no canon identity.',
 resources:{'book.lotm.attention':6},body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}}];
// Opening stock lives with the supervisor (plan S3). Prehistory preparation is not debited again.
export const LOTM_NATIVE_STOCK={[I.supervisor]:{[K.dose]:1,[K.comparator]:1,[K.sampleA]:1,[K.sampleB]:1}};
export const lotmDefinitions={people:lotmPeople,sites:[{id:I.site,revision:1,label:'Tingen supervised workroom bench',capacity:1}],powers:lotmPowers,energies:lotmEnergies,commands:lotmCommands,conditions:[],encounters:[],controllers:[],situations:[{id:I.situation,revision:1,label:'Original Tingen probationer account',context:{worldId:I.world,instanceId:'book.lotm.tingen.main',continuityId:'book.lotm.probationer.branch',eraId:'book.lotm.early_tingen',regionId:'book.lotm.tingen'},participants:['player'],initialPhase:'present',phases:['present'],privateTruth:{role:'original_probationer'}}]};
export const LOTM_ITEM_SPECIFICATIONS=[
 ['Tingen prepared Seer dose','One supervised prepared dose from a pinned, authored lot. Holding it grants nothing; taking it is a separate irreversible step.'],
 ['Tingen ordinary comparator sample','An ordinary material used to compare against supported samples.'],
 ['Tingen supported sample lot A','A supported sample lot. Observation shows presence at the material, not identity or safety.'],
 ['Tingen supported sample lot B','A second, distinct supported sample lot for the same method.']
].map(([id,description])=>({id,name:id,description,value:1,tags:{expedition:true,book_world_lotm:true}}));
export function registerLotmItems({itemTemplates,OtherItem}){for(const spec of LOTM_ITEM_SPECIFICATIONS){if(itemTemplates[spec.id])throw Error(`Duplicate Lord of the Mysteries item ${spec.id}.`);itemTemplates[spec.id]=new OtherItem(spec);}}
// Pure enrollment of the original probationer branch (plan S2 prototype start).
// The caller owns the publication; this changes only the passed state.
export function enrollLotmBranch(state){
 const s=state.simulation;if(!s)throw Error('Enroll living-world services first.');
 if(state.actors.player.worldId===I.world)throw Error('The probationer branch is already enrolled.');
 state.worlds[I.world]||={facts:{},resources:{},completed:{}};state.actors.player.worldId=I.world;s.people.player.location=L.workroom;
 s.people.player.body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
 for(const d of lotmPeople){state.actors[d.id]||={facts:{},resources:{},completed:{},sources:{},techniques:{},worldId:d.worldId};
  Object.assign(state.actors[d.id],{worldId:d.worldId});Object.assign(state.actors[d.id].resources,d.resources);
  s.people[d.id]={life:'alive',inventory:d.inventory,location:d.location,bornAt:state.clock,definitionId:d.id,definitionRevision:d.revision,vitals:{...d.vitals},
   body:{id:`native.person.${d.id}.body`,form:'human',hands:2,mobile:true,ownerId:d.id,controllerId:d.id}};}
 state.lotm=createLotmState(state.clock);
 return state;
}
