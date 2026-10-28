// Tingen Seer slice native domain (LIP3/LIP4). Registers through the domain registry (AR2): the
// save envelope is validated by book_world_lotm_envelope.js, native sleep joins through wake/tick,
// and the panel mounts with the other domains. main.js makes one configureLotm call.
import {castPlaces,installCast,restoreUnavailableCast,castAvailable,lotmBeside,dormantCastPlace} from './book_world_lotm_cast_host.js';
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
 for(const {id,name} of [...Object.values(L).map(id=>({id,name:id})),...castPlaces])locations[id]=new SafeLocation({id,name,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,is_temperature_static:true,static_temperature:20,light_level:'normal',
  tags:{book_world_lotm:true},entrance_rewards:{},description:'Tingen probationer branch. Use the Tingen workroom panel for the supervisor, the bench and your lodging.'});
}
export function configureLotm(p){
 ports=p;register(p);
 import('./book_world_lotm_cast_days.js').then(({whenCastLoaded})=>whenCastLoaded()).then(pack=>{if(!pack)return;installCast(p.registry);for(const {id,name} of castPlaces)if(!p.locations[id])p.locations[id]=new p.SafeLocation({id,name,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,is_temperature_static:true,static_temperature:20,light_level:'normal',tags:{book_world_lotm:true},entrance_rewards:{},description:'A place in Tingen.'});panel?.render();});
 host=createLotmHost(p);
}
function restoreMissingCast(envelope){
 if(!ports||castAvailable||!lotmBeside(envelope.expansion))return;
 const place=id=>{ports.locations[id]??=new ports.SafeLocation({id,name:'Cast place unavailable',is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,
  tags:{book_world_lotm:true},entrance_rewards:{},description:'Restore the private cast pack to resume this place.'});};
 restoreUnavailableCast(envelope.expansion,ports.registry,place);
 for(const id of Object.keys(envelope.locations||{}))if(dormantCastPlace(id))place(id);
}
registerDomain({id:'lotm',deps:[],validate:(_slice,envelope)=>restoreMissingCast(envelope),tick:()=>host?.tick(),refresh:()=>panel?.render(),
 commands:{wake:()=>host?.wake()},
 projection:(kind,...args)=>kind==='contexts'?lotmSimulationContexts(...args):kind==='facts'?lotmFacts(...args):host?.view(),
 panels:[()=>{panel=createLotmPanel({read:sel=>host.view(sel),act:id=>host.act(id),cancel:id=>host.cancel(id),move:id=>host.move(id),enroll:profile=>host.cross(profile),home:ports.home()});}]});
