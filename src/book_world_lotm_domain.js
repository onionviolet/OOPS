// Tingen Seer slice native domain (LIP3/LIP4). Registers through the domain registry (AR2): the
// save envelope is validated by book_world_lotm_envelope.js, native sleep joins through wake/tick,
// and the panel mounts with the other domains. main.js makes one configureLotm call.
import {registerDomain} from './domain_registry.js';
import {lotmFacts} from './book_world_lotm_actions.js';
import {createLotmHost,lotmSimulationContexts} from './book_world_lotm_host.js';
import {createLotmPanel} from './book_world_lotm_ui.js';
import {lotmPeople} from './book_world_lotm_content.js';
import {LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
let host=null,panel=null,ports=null;
// Definitions create locked placeholders only. The supervisor's stock is seeded once by enrollment (AR3).
function register({NPC,NPCRegistry,SafeLocation,locations}){
 for(const p of lotmPeople){const npc=new NPC({id:p.id,name:p.label,levelable:structuredClone(p.vitals),is_unlocked:false,description:p.description});npc.reputation={};NPCRegistry.add(p.id,npc);}
 for(const id of Object.values(L))locations[id]=new SafeLocation({id,name:id,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,is_temperature_static:true,static_temperature:20,light_level:'normal',
  tags:{book_world_lotm:true},entrance_rewards:{},description:'Tingen probationer branch. Use the Tingen workroom panel for the supervisor, the bench and your lodging.'});
}
export function configureLotm(p){
 ports=p;register(p);
 host=createLotmHost(p);
}
registerDomain({id:'lotm',deps:[],tick:()=>host?.tick(),refresh:()=>panel?.render(),
 commands:{wake:()=>host?.wake()},
 projection:(kind,...args)=>kind==='contexts'?lotmSimulationContexts(...args):kind==='facts'?lotmFacts(...args):host?.view(),
 panels:[()=>{panel=createLotmPanel({read:sel=>host.view(sel),act:id=>host.act(id),cancel:id=>host.cancel(id),move:id=>host.move(id),enroll:profile=>host.enroll(profile),home:ports.home()});}]});
