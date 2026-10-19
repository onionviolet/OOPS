import {check as assert, copy, natural, object, sameJson as same} from './basics.js';
import {TIDEMARK_IDS as ids,TIDEMARK_LOCATIONS as places,TIDEMARK_KEYS as keys,TIDEMARK_NATIVE_DOMAIN as nativeDomain,
 TIDEMARK_ENDPOINT as endpoint,tidemarkDefinitions} from './feature_expansion_destination.js';
import {activeTidemarkVisit,validateTidemarkState} from './feature_expansion_destination_host.js';
import {validateItemKey} from './gameplay_transactions.js';
import {jsonData} from './simulation_contracts.js';
const calendarSeed={year:1,month:1,day:1,hour:6,minute:0,day_count:1};
function calendarAt(elapsed){const total=360+elapsed,day=Math.floor(total/1440),month=Math.floor(day/30),year=Math.floor(month/12);
 return {year:1+year,month:month%12+1,day:day%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:day+1};}
function inventory(record,label){assert(object(record),`Missing native ${label} inventory.`);for(const [key,count] of Object.entries(record)){validateItemKey(key);assert(natural(count)&&count>0,`Invalid native ${label} count.`);}return record;}
function savedCounts(record,label){assert(object(record),`Missing saved ${label} inventory owner.`);const counts={};for(const [key,value] of Object.entries(record)){
 assert(object(value)&&natural(value.count)&&value.count>0,`Invalid saved ${label} inventory.`);counts[key]=value.count;}return inventory(counts,label);}
export function validateTidemarkNativeMetadata(value,state){
 jsonData(value);const allowed=['schema','definitionRevision','revision','initializedAt','calendar','shopCoins','stockOwner','shopOwner','peopleIds','questId'];
 assert(object(value)&&Object.keys(value).length===allowed.length&&allowed.every(k=>Object.hasOwn(value,k))&&value.schema===1&&value.definitionRevision===1&&natural(value.revision)&&value.revision>0,'Unsupported destination native owner envelope.');
 const d=state.featureDestination;assert(d&&value.revision===d.nativeRevision&&value.initializedAt===d.initializedAt,'Destination native and simulation binding revisions disagree.');
 assert(value.stockOwner===ids.stock&&value.shopOwner===ids.shop&&same(value.peopleIds,[ids.keeper,ids.wright])&&value.questId===ids.quest&&natural(value.shopCoins),'Destination native owners do not match this authored instance.');
 assert(same(value.calendar,calendarAt(d.instance.clock.elapsed)),'Local native calendar does not match the absence-frozen instance clock.');return true;
}
export function validateTidemarkEnvelope(envelope){
 const state=envelope.expansion||{},d=state.featureDestination,n=envelope[nativeDomain],visit=activeTidemarkVisit(state),location=envelope['current location'];
 if(!d){assert(n==null&&!Object.values(places).includes(location),'This native destination save requires its optional Tidemark binding.');return true;}
 validateTidemarkState(state);validateTidemarkNativeMetadata(n,state);
 assert(Object.values(places).includes(location)===!!visit,'Saved native location and Tidemark visit disagree.');
 if(visit)assert(location===state.simulation.people.player.location,'Saved Tidemark location and actual native body disagree.');
 for(const id of [ids.keeper,ids.wright]){
  assert(envelope.npcs?.[id]&&envelope.levels?.person?.[id]&&envelope.npc_equipment?.[id],'Missing independent native resident save owner.');
  savedCounts(envelope.inventories?.person?.[id],id);
 }
 savedCounts(envelope.inventories?.feature_destination?.[ids.stock],ids.stock);const shop=savedCounts(envelope.inventories?.trader?.[ids.shop],ids.shop);
 assert((shop[keys.kit]||0)>=(state.worlds[ids.world].facts['tidemark.collected']?0:1),'The promised native shop kit is missing.');
 for(const id of Object.values(places))assert(object(envelope.locations?.[id]),'Missing independent destination native location owner.');
 const quest=envelope.quests?.[ids.quest],f=state.worlds[ids.world].facts;
 assert(object(quest)&&quest.is_active===(f['tidemark.agreed']&&!f['tidemark.collected'])&&quest.is_finished===f['tidemark.collected']&&Array.isArray(quest.task_status)&&quest.task_status.length===2&&quest.task_status[0].is_finished===f['tidemark.repaired']&&quest.task_status[1].is_finished===f['tidemark.collected'],'Native repair agreement does not match its committed local facts.');return true;
}
// These constructors are the real native classes, passed by main to avoid the
// native quests -> main cycle during module import. Register definitions before
// normal native loading. Empty definitions never provision or seed on load.
export function createTidemarkNativeBindings({NPC,NPCRegistry,SafeLocation,locations,InventoryComponent,inventories,TraderComponent,
 Quest,QuestTask,quests,activeQuests,availabilities,Game_Time,getItemFromKey,getNativeContext=()=>({}),getCurrentLocation=()=>null,getNativeBody=()=>null}){
 assert([NPC,SafeLocation,InventoryComponent,TraderComponent,Quest,QuestTask,Game_Time,getItemFromKey].every(v=>typeof v==='function'),'Bind actual native destination constructors.');
 assert(NPCRegistry&&object(locations)&&object(inventories)&&object(quests)&&object(activeQuests)&&object(availabilities?.quest),'Bind the native destination registries.');
 let metadata=null,registered=false,stock=null,shop=null,localCalendar=null,quest=null;
 const actualCounts=items=>Object.fromEntries(Object.entries(items).filter(([,v])=>v.count>0).map(([key,value])=>[key,value.count]));
 const reconstruct=counts=>Object.fromEntries(Object.entries(inventory(counts,'staged')).map(([key,count])=>{const item=getItemFromKey(key);assert(item,'A destination native item definition is unavailable.');return [key,{item,count}];}));
 const replaceItems=(owner,prepared)=>{const items=owner.getItems();for(const key of Object.keys(items))delete items[key];Object.assign(items,prepared);};
 function register(){if(registered)return;
  assert(!Object.values(places).some(id=>locations[id])&&!NPCRegistry.getAll()[ids.keeper]&&!NPCRegistry.getAll()[ids.wright]&&!quests[ids.quest],'Destination IDs are already owned by a different native binding.');
  stock=new InventoryComponent();inventories.feature_destination||={};assert(!inventories.feature_destination[ids.stock],'Duplicate communal stock owner.');inventories.feature_destination[ids.stock]=stock;
  shop=new TraderComponent({name:'Venn’s rope shop',is_unlocked:false,profit_margin:1,refresh_time:4});
  // This finite authored shop never refills from global days or trade RNG.
  // Notebook purchases use the same native InventoryComponent and publisher.
  shop.refresh=()=>false;shop.can_refresh=()=>false;shop.last_refresh=0;
  for(const d of tidemarkDefinitions.people){const npc=new NPC({id:d.id,name:d.label,description:d.id===ids.keeper?'A keeper watches the linked sluice floats.':'A ropewright keeps a finite stock beside the landing.',
    is_unlocked:false,...(d.id===ids.wright?{trader:shop}: {})});npc.reputation={};NPCRegistry.add(d.id,npc);}
  for(const [type,id] of Object.entries(places))locations[id]=new SafeLocation({id,name:id,is_unlocked:false,npcs:[],connected_locations:[],is_under_roof:type==='dock',
   is_temperature_static:true,static_temperature:16,light_level:'normal',tags:{feature_destination:true},entrance_rewards:{},
   description:type==='dock'?'A return marker stands above the tide. Nessa tends the linked floats; Venn keeps supplies nearby. Use Notebook to negotiate, work, buy or return.':'Counterweight terraces carry washed-up timber below the harbor wall. The tide changes only with time spent in this destination. Use Notebook to recover finite supplies or return to the landing.'});
  // Native Quest currently registers availability through this.id before it
  // assigns quest_id. Preserve those unrelated historical placeholder entries,
  // then bind this definition's actual distinct ID and tasks explicitly.
  const placeholderKeys=['undefined','undefined:task:0','undefined:task:1'];
  const priorPlaceholders=Object.fromEntries(placeholderKeys.map(key=>[key,{present:Object.hasOwn(availabilities.quest,key),value:availabilities.quest[key]}]));
  quest=new Quest({quest_id:ids.quest,quest_name:'Secure Tidemark’s sluice',quest_description:'Secure the sluice by timber or learned counterweight setting, then collect Venn’s reserved kit.',questline:'Tidemark',quest_rewards:{},
   // An empty condition is automatically completed by any native quest event.
   // An empty `any` group cannot match one; committed local facts own progress.
   quest_tasks:[new QuestTask({task_description:'Secure the actual local sluice.',task_condition:{any:{}},task_rewards:{}}),new QuestTask({task_description:'Collect the reserved shop kit.',task_condition:{any:{}},task_rewards:{}})]});
  for(const [key,previous] of Object.entries(priorPlaceholders)){if(previous.present)availabilities.quest[key]=previous.value;else delete availabilities.quest[key];}
  availabilities.quest[ids.quest]=quest.getAvailabilityComponent();quest.quest_tasks.forEach((task,index)=>{availabilities.quest[`${ids.quest}:task:${index}`]=task.getAvailabilityComponent();});
  quest.id=ids.quest;quest.quest_id=ids.quest;quests[ids.quest]=quest;localCalendar=new Game_Time(calendarSeed);registered=true;
 }
 function questSnapshot(state){const f=state.worlds[ids.world].facts;return {is_active:!!f['tidemark.agreed']&&!f['tidemark.collected'],is_finished:!!f['tidemark.collected'],task_status:[{is_finished:!!f['tidemark.repaired']},{is_finished:!!f['tidemark.collected']}]};}
 function availability(state){const d=state.featureDestination,visit=activeTidemarkVisit(state),phase=(d?.instance.clock.elapsed||0)%12;
  return {[places.dock]:!!d,[places.terrace]:!!d&&(phase<9||state.worlds[ids.world].facts['tidemark.repaired'])};}
 function applyQuest(value){const a=quest.getAvailabilityComponent();a.is_unlocked=value.is_active||value.is_finished;a.is_finished=value.is_finished;a.is_locked=false;
  quest.quest_tasks.forEach((task,index)=>{task.getAvailabilityComponent().is_finished=value.task_status[index].is_finished;});
  if(value.is_active)activeQuests[ids.quest]=quest;else delete activeQuests[ids.quest];}
 function applyAvailability(state){const a=availability(state);for(const [id,open] of Object.entries(a))locations[id].getAvailabilityComponent().is_unlocked=open;
  for(const id of [ids.keeper,ids.wright])NPCRegistry.get(id).getAvailabilityComponent().is_unlocked=!!state.featureDestination;
  // Legacy trade actions remain closed; the transactional Notebook shop binds
  // this actual stock and never uses the global trader refresh/payment path.
  shop.getAvailabilityComponent().is_unlocked=false;
 }
 function writeAvailability(envelope,state){const value=questSnapshot(state);
  envelope.availabilities.quest[ids.quest]=(value.is_active||value.is_finished?1:0)|(value.is_finished?2:0);
  value.task_status.forEach((task,index)=>{envelope.availabilities.quest[`${ids.quest}:task:${index}`]=task.is_finished?2:0;});
  envelope.availabilities.trader[ids.shop]=0;
 }
 function read(state){assert(registered,'Register the native destination definitions before reading.');
  const d=state.featureDestination;assert(d?metadata&&metadata.revision===d.nativeRevision:metadata===null,'Restore current native destination owner metadata first.');
  const context=getNativeContext(),at=getCurrentLocation(),bodyHere=state.simulation?.people.player?.location;
  const dock=locations[places.dock],village=locations.Village;
  const allowed=location=>!!location?.canBeStarted?.(context);
  return {bound:true,revision:metadata?.revision||0,stock:actualCounts(stock.getItems()),shop:{inventory:actualCounts(shop.getInventoryComponent().getItems()),coins:metadata?.shopCoins||0},
   body:copy(getNativeBody()),calendar:copy(metadata?.calendar||calendarSeed),quest:metadata?questSnapshot(state):{is_active:false,is_finished:false,task_status:[{is_finished:false},{is_finished:false}]},
   endpointBindings:[{endpoint:{worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'},available:allowed(village),positions:[{id:'doorway.arrival',free:at!==null&&(at==='Village'||Object.values(places).includes(at))&&bodyHere===at,bodyForms:['human']}]},
    {endpoint,available:d?allowed(dock):!!dock,positions:[{id:'doorway.arrival',free:at!==null&&(at==='Village'||Object.values(places).includes(at))&&bodyHere===at,bodyForms:['human']}]}]};
 }
 function stage(plan){assert(registered,'Register native destination definitions before staging.');const d=plan.state.featureDestination;
  if(!d){assert(!metadata,'A live destination cannot be dropped by an ordinary publication.');return {write(){},publish(){}};}
  const first=plan.destinationActivation===true;
  assert(first?!metadata&&d.nativeRevision===0:metadata&&d.nativeRevision===metadata.revision,'The destination native stage is stale.');
  assert(first||plan.destinationDebit==null||plan.destinationDebit.expectedRevision===metadata.revision,'The local stock quote is stale.');
  const nextStock=first?{[keys.log]:3}:actualCounts(stock.getItems()),nextShop=first?{[keys.log]:3,[keys.kit]:3}:actualCounts(shop.getInventoryComponent().getItems());
  let shopCoins=metadata?.shopCoins||0;
  if(plan.destinationDebit){const debit=plan.destinationDebit;assert(['stock','shop'].includes(debit.owner)&&debit.count===1&&[keys.log,keys.kit].includes(debit.key)&&[0,2,5].includes(debit.coins),'Unsupported native local stock debit.');
   const owner=debit.owner==='stock'?nextStock:nextShop;assert((owner[debit.key]||0)>=debit.count,'The finite local stock is no longer available.');owner[debit.key]-=debit.count;if(!owner[debit.key])delete owner[debit.key];shopCoins+=debit.coins;}
  const nextMeta={schema:1,definitionRevision:1,revision:(metadata?.revision||0)+1,initializedAt:d.initializedAt,calendar:calendarAt(d.instance.clock.elapsed),shopCoins,
   stockOwner:ids.stock,shopOwner:ids.shop,peopleIds:[ids.keeper,ids.wright],questId:ids.quest};
  d.nativeRevision=nextMeta.revision;validateTidemarkNativeMetadata(nextMeta,plan.state);
  const preparedStock=reconstruct(nextStock),preparedShop=reconstruct(nextShop),questState=questSnapshot(plan.state),access=availability(plan.state);
  return {write(envelope){
    envelope[nativeDomain]=copy(nextMeta);envelope.inventories.feature_destination||={};envelope.inventories.feature_destination[ids.stock]=Object.fromEntries(Object.entries(nextStock).map(([key,count])=>[key,{count}]));
    assert(envelope.inventories.trader,'Missing native trader save namespace.');envelope.inventories.trader[ids.shop]=Object.fromEntries(Object.entries(nextShop).map(([key,count])=>[key,{count}]));
    envelope.quests[ids.quest]=copy(questState);for(const [id,open] of Object.entries(access))envelope.availabilities.location[id]=open?1:0;
    for(const id of [ids.keeper,ids.wright])envelope.availabilities.person[id]=1;writeAvailability(envelope,plan.state);
   },publish(){metadata=nextMeta;replaceItems(stock,preparedStock);replaceItems(shop.getInventoryComponent(),preparedShop);localCalendar.loadTime(nextMeta.calendar);applyQuest(questState);applyAvailability(plan.state);}};
 }
 function snapshot(envelope,state){assert(registered,'Register native definitions before save creation.');if(!state.featureDestination){delete envelope[nativeDomain];return envelope;}
  assert(metadata?.revision===state.featureDestination.nativeRevision,'Live destination native metadata is stale.');envelope[nativeDomain]=copy(metadata);
  // Normal native serializers already own these unique IDs. Overwrite the
  // explicit agreement projection without invoking native quest rewards.
  envelope.quests[ids.quest]=questSnapshot(state);writeAvailability(envelope,state);return envelope;
 }
 function restore(envelope){assert(registered,'Register destination definitions before native loading.');validateTidemarkEnvelope(envelope);const state=envelope.expansion||{},d=state.featureDestination;
  if(!d){metadata=null;replaceItems(stock,{});replaceItems(shop.getInventoryComponent(),{});localCalendar.loadTime(calendarSeed);for(const id of Object.values(places))locations[id].getAvailabilityComponent().is_unlocked=false;
   for(const id of [ids.keeper,ids.wright])NPCRegistry.get(id).getAvailabilityComponent().is_unlocked=false;shop.getAvailabilityComponent().is_unlocked=false;applyQuest({is_active:false,is_finished:false,task_status:[{is_finished:false},{is_finished:false}]});return;}
  const preparedStock=reconstruct(savedCounts(envelope.inventories.feature_destination[ids.stock],ids.stock)),preparedShop=reconstruct(savedCounts(envelope.inventories.trader[ids.shop],ids.shop));
  metadata=copy(envelope[nativeDomain]);replaceItems(stock,preparedStock);replaceItems(shop.getInventoryComponent(),preparedShop);localCalendar.loadTime(metadata.calendar);applyQuest(envelope.quests[ids.quest]);applyAvailability(state);
 }
 return {register,read,stage,snapshot,restore,getPerson:id=>{assert([ids.keeper,ids.wright].includes(id),'This is not a destination resident.');return NPCRegistry.get(id);},
  ownsPerson:id=>[ids.keeper,ids.wright].includes(id),getCalendar:()=>localCalendar,getStock:()=>stock,getShop:()=>shop,getQuest:()=>quest};
}
