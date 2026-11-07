import {remotePresenceFacts} from './place_remote_presence.js';
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
// Tingen Seer slice native domain (LIP3/LIP4). Registers through the domain registry (AR2): the
// save envelope is validated by book_world_lotm_envelope.js, native sleep joins through wake/tick,
// and the panel mounts with the other domains. main.js makes one configureLotm call.
import {castNeedsFullContext,CAST_EAGER_PEOPLE_LIMIT,castPlaces,installCast,restoreUnavailableCast,castAvailable,lotmCastLife,dormantCastPlace,castLocalClock,lotmBe} from './book_world_lotm_cast_host.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {registerDutySet} from './duties_domain.js';
import {LOTM_DUTIES,LOTM_RENT} from './book_world_lotm_duties.js';
import {registerUpcomingSource} from './upcoming_strip_ui.js';
import {lotmFacts} from './book_world_lotm_actions.js';
import {lotmDivinationFacts} from './book_world_lotm_div_supply.js';
import {lotmActFacts} from './book_world_lotm_acts_host.js';
import {createLotmHost,lotmSimulationContexts} from './book_world_lotm_host.js';
import {createLotmPanel} from './book_world_lotm_ui.js';
import {lotmPeople} from './book_world_lotm_content.js';
import {LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {registerLocalClockSource} from './today_strip.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
import {createCastLocationRestore} from './cast_location_restore.js';
let host=null,panel=null,ports=null,castLocationRestore=null;
registerLocalClockSource(()=>{const state=ports?.state(),place=ports?.location();
 return place&&place===state?.simulation?.people?.player?.location?castLocalClock(state):null;});
registerOwnedWorkPanel((_work,definition)=>definition?.group==='book_lotm'?'lotm_panel':null);
// Definitions create locked placeholders only. The supervisor's stock is seeded once by enrollment (AR3).
function register({NPC,NPCRegistry,SafeLocation,locations}){
 for(const p of lotmPeople){const npc=new NPC({id:p.id,name:p.label,levelable:structuredClone(p.vitals),is_unlocked:false,description:p.description});npc.reputation={};NPCRegistry.add(p.id,npc);}
 for(const {id,name} of [...Object.values(L).map(id=>({id,name:id})),...castPlaces])locations[id]=new SafeLocation({id,name,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,is_temperature_static:true,static_temperature:20,light_level:'normal',
  tags:{book_world_lotm:true},entrance_rewards:{},description:'Tingen probationer branch. Use the Tingen workroom panel for the supervisor, the bench and your lodging.'});
}
function ensureCastLocation(id){
 const row=castPlaces.find(p=>p.id===id);if(!row||!ports)return;
 castLocationRestore.ensure(row);
}
export function configureLotm(p){
 ports=p;register(p);
 // FD8: Klein's weekly expense claim is kept on the BE life's own clock; the shared duties domain imports no world.
 registerDutySet('lotm',{defs:LOTM_DUTIES,state:()=>p.state(),active:st=>lotmBe(st),minute:st=>st.clock});
 // Rent is a standing order on the same clock: settles through the host's purse seam, never a click.
 registerDutySet('lotm_rent',{defs:LOTM_RENT,state:()=>p.state(),active:st=>lotmBe(st),minute:st=>st.clock,purse:{balance:()=>host.purseBalance(),pay:(amount,paid)=>host.payDues(amount,paid)}});
 castLocationRestore=createCastLocationRestore({locations:p.locations,
  createLocation:definition=>new p.SafeLocation({...definition,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,tags:{book_world_lotm:true},entrance_rewards:{}}),
  onResolved:place=>{if(p.location()===place.id)p.refreshLocationIdentity?.(place);}});
 import('./book_world_lotm_cast_days.js').then(({whenCastLoaded})=>whenCastLoaded()).then(pack=>{if(!pack)return;installCast(p.registry);if(pack.people.length<=CAST_EAGER_PEOPLE_LIMIT)for(const {id} of castPlaces)ensureCastLocation(id);else ensureCastLocation(pack.host.profile.start);for(const id of Object.keys(p.locations))ensureCastLocation(id);panel?.render();});
 host=createLotmHost({...p,ensureCastLocation});
}
function restoreMissingCast(envelope){
 if(!ports||!lotmCastLife(envelope.expansion))return;
 const place=id=>castLocationRestore.retain(id);
 restoreUnavailableCast(envelope.expansion,ports.registry,place);
 if(castAvailable){ensureCastLocation(envelope.expansion.simulation?.people?.player?.location);for(const id of Object.keys(envelope.locations||{}))ensureCastLocation(id);return;}
 for(const id of Object.keys(envelope.locations||{}))if(dormantCastPlace(id))place(id);
}
registerUpcomingSource(()=>host?.upcoming()||[]);
registerDomain({id:'lotm',deps:[],validate:(_slice,envelope)=>restoreMissingCast(envelope),tick:minutes=>host?.tick(minutes),refresh:()=>panel?.render(),
 commands:{restoreSleep:()=>host?.restoreSleep(),wake:()=>host?.wake(),enrollBeFresh:()=>host.enroll('be',{independent:true})},
 projection:(kind,...args)=>kind==='castContext'?castNeedsFullContext(...args):kind==='contexts'?lotmSimulationContexts(...args):kind==='facts'?{...lotmFacts(...args),...lotmDivinationFacts(...args),...lotmActFacts(...args),...remotePresenceFacts(args[0],getPrivateLotmCast()?.householdActs)}:host?.view(),
 panels:[()=>{panel=createLotmPanel({read:sel=>host.view(sel),act:id=>host.act(id),cancel:id=>host.cancel(id),move:id=>host.move(id),enroll:profile=>host.cross(profile),home:ports.home(),duties:()=>domainRegistry.project('duties'),attend:dutyId=>domainRegistry.command('duties','attend')({dutyId}),setOrder:(dutyId,policy)=>domainRegistry.command('duties','setOrder')({dutyId,policy})});}]});
