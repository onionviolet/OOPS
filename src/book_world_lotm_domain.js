// Tingen Seer slice native domain (LIP3/LIP4). Registers through the domain registry (AR2): the
// save envelope is validated by book_world_lotm_envelope.js, native sleep joins through wake/tick,
// and the panel mounts with the other domains. main.js makes one configureLotm call.
import {castNeedsFullContext,CAST_EAGER_PEOPLE_LIMIT,castPlaces,installCast,restoreUnavailableCast,castAvailable,lotmCastLife,dormantCastPlace} from './book_world_lotm_cast_host.js';
import {registerDomain} from './domain_registry.js';
import {registerUpcomingSource} from './upcoming_strip_ui.js';
import {lotmFacts} from './book_world_lotm_actions.js';
import {lotmDivinationFacts} from './book_world_lotm_div_supply.js';
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
function ensureCastLocation(id){
 const row=castPlaces.find(p=>p.id===id);if(!row||!ports||ports.locations[id])return;
 ports.locations[id]=new ports.SafeLocation({id,name:row.name,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,is_temperature_static:true,static_temperature:20,light_level:'normal',tags:{book_world_lotm:true},entrance_rewards:{},description:'A place in Tingen.'});
}
export function configureLotm(p){
 ports=p;register(p);
 import('./book_world_lotm_cast_days.js').then(({whenCastLoaded})=>whenCastLoaded()).then(pack=>{if(!pack)return;installCast(p.registry);if(pack.people.length<=CAST_EAGER_PEOPLE_LIMIT)for(const {id} of castPlaces)ensureCastLocation(id);else ensureCastLocation(pack.host.profile.start);panel?.render();});
 host=createLotmHost({...p,ensureCastLocation});
}
function restoreMissingCast(envelope){
 if(!ports||!lotmCastLife(envelope.expansion))return;
 const place=id=>{ports.locations[id]??=new ports.SafeLocation({id,name:'Cast place unavailable',is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,
  tags:{book_world_lotm:true},entrance_rewards:{},description:'Restore the private cast pack to resume this place.'});};
 restoreUnavailableCast(envelope.expansion,ports.registry,place);
 if(castAvailable){ensureCastLocation(envelope.expansion.simulation?.people?.player?.location);for(const id of Object.keys(envelope.locations||{}))ensureCastLocation(id);return;}
 for(const id of Object.keys(envelope.locations||{}))if(dormantCastPlace(id))place(id);
}
registerUpcomingSource(()=>host?.upcoming()||[]);
registerDomain({id:'lotm',deps:[],validate:(_slice,envelope)=>restoreMissingCast(envelope),tick:minutes=>host?.tick(minutes),refresh:()=>panel?.render(),
 commands:{restoreSleep:()=>host?.restoreSleep(),wake:()=>host?.wake(),enrollBeFresh:()=>host.enroll('be',{independent:true})},
 projection:(kind,...args)=>kind==='castContext'?castNeedsFullContext(...args):kind==='contexts'?lotmSimulationContexts(...args):kind==='facts'?{...lotmFacts(...args),...lotmDivinationFacts(...args)}:host?.view(),
 panels:[()=>{panel=createLotmPanel({read:sel=>host.view(sel),act:id=>host.act(id),cancel:id=>host.cancel(id),move:id=>host.move(id),enroll:profile=>host.cross(profile),home:ports.home()});}]});
