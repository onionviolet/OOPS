import {registerDomain,domainRegistry} from './domain_registry.js';
import {DRAINAGE_SITUATION,DRAINAGE_WORLD,drainageLocation,drainageRoom,drainageLayout,drainageGate,drainageRevealed,validateDrainage,quoteDrainage,stageDrainage,drainageView} from './drainage_site.js';
import {createDrainagePanel} from './drainage_site_ui.js';
let ports,panel,physicalSignature='';
function followPhysicalPresence(){if(!ports)return;const root=ports.root(),seed=root.worlds?.[DRAINAGE_WORLD]?.facts?.['drainage.seed'];if(seed===undefined)return;const next=JSON.stringify([seed,drainageGate(root)]);if(next===physicalSignature)return;physicalSignature=next;sync(root);ports.refreshScene();}
export function configureDrainage(operations){
 ports=operations;if(!ports.registry.simulation.situations.has(DRAINAGE_SITUATION.id))ports.registry.simulation.situations.set(DRAINAGE_SITUATION.id,DRAINAGE_SITUATION);
 for(let i=0;i<6;i++){const id=drainageLocation(i);if(!ports.locations[id])ports.locations[id]=new ports.SafeLocation({id,name:i===0?'Riverside service entrance':`Riverside gallery marker ${i+1}`,description:'An unexamined stretch of the old riverside service galleries.',is_unlocked:false,connected_locations:[],is_under_roof:true});}
 const entry=ports.locations[drainageLocation(0)];if(!ports.locations.Village.connected_locations.some(c=>c.location===entry))ports.locations.Village.connected_locations.push({location:entry,travel_time:5});sync(ports.root());
}
function sync(root){
 if(!ports||!root)return;const seed=root.worlds?.[DRAINAGE_WORLD]?.facts?.['drainage.seed'],revealed=drainageRevealed(root),layout=seed===undefined?null:drainageLayout(seed),gate=seed===undefined?false:drainageGate(root);
 for(let i=0;i<6;i++){
  const place=ports.locations[drainageLocation(i)];place.getAvailabilityComponent().is_unlocked=revealed.includes(i)&&(i!==5||gate);
  place.connected_locations=i===0?[{location:ports.locations.Village,travel_time:5,custom_text:'Return to Village'}]:[];
  if(layout)for(const [a,b]of layout.edges)if(a===i||b===i)place.connected_locations.push({location:ports.locations[drainageLocation(a===i?b:a)],travel_time:2});
  const observation=root.simulation?.knowledge?.player?.['drainage.room.'+i];place.description=observation?.value||'An unexamined stretch of the old riverside service galleries. Inspect it through Riverside exploration to record what your own senses support.';
 }
}
function context(){
 const root=ports.root(),actor=ports.actor(),p=domainRegistry.project('pledges')?.state;
 return {root,clock:root.clock,world:ports.world(),location:ports.location(),body:ports.body(),alive:actor.is_alive===true,ready:ports.writable()&&ports.idle()&&!ports.blocked()&&!p?.ordeal,stats:{...actor.getFullStats()},inventory:Object.fromEntries(Object.entries(actor.getItems()).map(([key,row])=>[key,row.count])),trialLearning:p?.trial.learning||0,channels:domainRegistry.command('crafting','bodyChannels')?.()||0};
}
function view(){if(!ports)return {visible:false,actions:[],map:{nodes:[],edges:[]}};const c=context();return drainageView(c.root,c);}
function perform(request){
 const c=context(),q=quoteDrainage(c.root,request,c);if(!q.eligible)throw Error(q.reason);const result=stageDrainage(ports.plan(q.minutes),request,c,ports.registry),root=result.plan.state;
 result.plan.nativePatch={...result.plan.nativePatch};const revealed=drainageRevealed(root),gate=drainageGate(root);for(let i=0;i<6;i++)result.plan.nativePatch['availabilities/location/'+drainageLocation(i)]=revealed.includes(i)&&(i!==5||gate)?1:0;
 ports.commit(result.plan);sync(ports.root());ports.refreshScene();ports.logMessage(result.message,'notification');panel?.render();return result.quote;
}
registerDomain({id:'drainage_site',initialState:()=>null,validate:(_,save)=>{if(!save.expansion){if(drainageRoom(save['current location'])!==null)throw Error('This gallery needs its actual Frontier state.');return;}validateDrainage(save.expansion);const room=drainageRoom(save['current location']);if(room!==null&&(save.expansion.worlds?.[DRAINAGE_WORLD]?.facts?.['drainage.seed']===undefined||!drainageRevealed(save.expansion).includes(room)||save.expansion.actors.player.worldId!==DRAINAGE_WORLD))throw Error('This position needs its observed Frontier route.');},load:(_,save)=>sync(save?.expansion||ports?.root()),
 tick:minutes=>{if(minutes>0)followPhysicalPresence();},commands:{quote:request=>{const c=context();return quoteDrainage(c.root,request,c);},execute:perform},projection:view,refresh:()=>{if(ports)sync(ports.root());panel?.render();},panels:[()=>{panel=createDrainagePanel({read:view,act:perform});}]});
