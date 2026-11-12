import {itemSafetyFacts} from './book_world_lotm_item_safety.js';
import {amuletWorkshopRecords} from './lotm_amulet_crafting.js';
import {tingenMishapRecords} from './lotm_amulet_protection.js';
import {configureConstables} from './book_world_lotm_constables.js';
import {remotePresenceFacts} from './place_remote_presence.js';
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
// Tingen Seer slice native domain (LIP3/LIP4). Registers through the domain registry (AR2): the
// save envelope is validated by book_world_lotm_envelope.js, native sleep joins through wake/tick,
// and the panel mounts with the other domains. main.js makes one configureLotm call.
import {castNeedsFullContext,CAST_EAGER_PEOPLE_LIMIT,castPlaces,installCast,restoreUnavailableCast,castAvailable,lotmCastLife,dormantCastPlace,castLocalClock,lotmBe} from './book_world_lotm_cast_host.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {registerDutySet} from './duties_domain.js';
import {LOTM_DUTIES,LOTM_RENT,LOTM_CIVIL_DUTIES,LOTM_CIVIL_DUTY_ID,LOTM_GUARD_DUTIES,LOTM_GUARD_DUTY_ID} from './book_world_lotm_duties.js';
import {lotmDutyHeld} from './book_world_lotm_positions.js';
import {registerUpcomingSource} from './upcoming_strip_ui.js';
import {lotmFacts} from './book_world_lotm_actions.js';
import {lotmDivinationFacts} from './book_world_lotm_div_supply.js';
import {lotmActFacts} from './book_world_lotm_acts_host.js';
import {createLotmHost,lotmSimulationContexts} from './book_world_lotm_host.js';
import {createLotmPanel} from './book_world_lotm_ui.js';
import {lotmPeople} from './book_world_lotm_content.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {registerLocalClockSource} from './today_strip.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
import {createCastLocationRestore} from './cast_location_restore.js';
import {configureHeatPurse} from './heat.js';
let host=null,panel=null,ports=null,castLocationRestore=null;
registerLocalClockSource(()=>{const state=ports?.state(),place=ports?.location();
 return place&&place===state?.simulation?.people?.player?.location?castLocalClock(state):null;});
registerOwnedWorkPanel((_work,definition)=>definition?.group==='book_lotm'?'lotm_panel':null);
// Definitions create locked placeholders only. The supervisor's stock is seeded once by enrollment (AR3).
function register({NPC,NPCRegistry,SafeLocation,locations}){
 for(const p of lotmPeople){const npc=new NPC({id:p.id,name:p.label,levelable:structuredClone(p.vitals),is_unlocked:false,description:p.description});npc.reputation={};NPCRegistry.add(p.id,npc);}
 for(const {id,name} of [...Object.values(L).map(id=>({id,name:id})),...castPlaces])locations[id]=new SafeLocation({id,name,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,is_temperature_static:true,static_temperature:20,light_level:'normal',
  tags:{book_world_lotm:true},entrance_rewards:{},description:'Gas lamps, fog and the smell of coal. The probationer branch keeps its own hours.',stations:[{id:'lotm-workroom',name:'Tingen workroom',description:'Your supervisor, the bench and your lodging.',module:'lotm'}]});
}
function ensureCastLocation(id){
 const row=castPlaces.find(p=>p.id===id);if(!row||!ports)return;
 castLocationRestore.ensure(row);
}
export function configureLotm(p){
 ports=p;register(p);
 // FD8: Klein's weekly expense claim is kept on the BE life's own clock; the shared duties domain imports no world.
 registerDutySet('lotm',{defs:LOTM_DUTIES,state:()=>p.state(),active:st=>lotmBe(st),minute:st=>st.clock});
 // The civil clerk's weekly office report is held by the civil post (FD15): resigning the post makes this set inactive, which closes its weeks unaccounted.
 registerDutySet('lotm_civil',{defs:LOTM_CIVIL_DUTIES,state:()=>p.state(),active:st=>lotmDutyHeld(st,LOTM_CIVIL_DUTY_ID),minute:st=>st.clock});
 // The hired guard's weekly night shift is held by the guard row (W9-A): resigning or the term running out makes this set inactive.
 registerDutySet('lotm_guard',{defs:LOTM_GUARD_DUTIES,state:()=>p.state(),active:st=>lotmDutyHeld(st,LOTM_GUARD_DUTY_ID),minute:st=>st.clock});
 // Rent is a standing order on the same clock: settles through the host's purse seam, never a click.
 configureHeatPurse({balance:()=>host.purseBalance(),pay:amount=>host.payFine(amount)});
 registerDutySet('lotm_rent',{defs:LOTM_RENT,state:()=>p.state(),active:st=>lotmBe(st),minute:st=>st.clock,purse:{balance:()=>host.purseBalance(),pay:(amount,paid)=>host.payDues(amount,paid)},money:{world:'Tingen'},
  // OB2: actual carried goods, published together with the settled arrears.
  seize:{present:()=>p.state().actors.player.worldId===I.world&&p.writable?.()!==false&&!p.restoring?.(),goods:()=>host.heldGoods(),take:(picks,plan)=>host.seizeGoods(picks,plan)}});
 castLocationRestore=createCastLocationRestore({locations:p.locations,
  createLocation:definition=>new p.SafeLocation({...definition,is_unlocked:true,npcs:[],connected_locations:[],is_under_roof:true,tags:{book_world_lotm:true},entrance_rewards:{}}),
  onResolved:place=>{if(p.location()===place.id)p.refreshLocationIdentity?.(place);}});
 import('./book_world_lotm_cast_days.js').then(({whenCastLoaded})=>whenCastLoaded()).then(pack=>{if(!pack)return;installCast(p.registry);if(pack.people.length<=CAST_EAGER_PEOPLE_LIMIT)for(const {id} of castPlaces)ensureCastLocation(id);else ensureCastLocation(pack.host.profile.start);for(const id of Object.keys(p.locations))ensureCastLocation(id);panel?.render();});
 host=createLotmHost({...p,ensureCastLocation});
 configureConstables({plan:minutes=>host.sentencePlan(minutes)});
}
function restoreMissingCast(envelope){
 if(!ports||!lotmCastLife(envelope.expansion))return;
 const place=id=>castLocationRestore.retain(id);
 restoreUnavailableCast(envelope.expansion,ports.registry,place);
 if(castAvailable){ensureCastLocation(envelope.expansion.simulation?.people?.player?.location);for(const id of Object.keys(envelope.locations||{}))ensureCastLocation(id);return;}
 for(const id of Object.keys(envelope.locations||{}))if(dormantCastPlace(id))place(id);
}
function workshopPanelView(selection) {
 const state=ports.state(),view=host.view(selection),records=[...amuletWorkshopRecords(state),...tingenMishapRecords(state)];
 if(!records.length||!Array.isArray(view.records))return view;
 return {...view,records:[...view.records,...records].sort((a,b)=>(a.at??0)-(b.at??0))};
}
registerUpcomingSource(()=>host?.upcoming()||[]);
registerDomain({id:'lotm',deps:[],validate:(_slice,envelope)=>restoreMissingCast(envelope),tick:minutes=>host?.tick(minutes),refresh:()=>panel?.render(),
 commands:{restoreSleep:()=>host?.restoreSleep(),wake:()=>host?.wake(),enrollBeFresh:()=>host.enroll('be',{independent:true})},
 projection:(kind,...args)=>kind==='castContext'?castNeedsFullContext(...args):kind==='contexts'?lotmSimulationContexts(...args):kind==='facts'?{...lotmFacts(...args),...lotmDivinationFacts(...args),...lotmActFacts(...args),...itemSafetyFacts(args[0],getPrivateLotmCast()?.itemSafety),...remotePresenceFacts(args[0],getPrivateLotmCast()?.householdActs)}:host?.view(),
 panels:[()=>{panel=createLotmPanel({read:workshopPanelView,act:id=>host.act(id),cancel:id=>host.cancel(id),move:id=>host.move(id),enroll:profile=>host.cross(profile),home:ports.home(),duties:()=>domainRegistry.project('duties'),tieAsk:id=>host.tieAsk(id),homeAct:request=>domainRegistry.command('homes','execute')(domainRegistry.command('homes','quote')(request)),attend:dutyId=>dutyId===LOTM_GUARD_DUTY_ID?host.standWatch():dutyId==='lotm.expense_claim'?host.fileExpense():domainRegistry.command('duties','attend')({dutyId}),resign:id=>host.resign(id),signGuard:()=>host.signGuard(),collectGuard:()=>host.collectGuardPay(),setOrder:(dutyId,policy)=>domainRegistry.command('duties','setOrder')({dutyId,policy})});}]});
