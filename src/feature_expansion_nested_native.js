import {check as assert, copy, natural, object, sameJson as same} from './basics.js';
import {NESTED_IDS as I,NESTED_LOCATIONS as L,NESTED_FOOTPRINTS as footprints,NESTED_NATIVE_DOMAIN as nativeDomain,NESTED_NATIVE_STOCK,nestedDefinitions} from './feature_expansion_nested_content.js';
import {activeNestedVisit,validateNestedCampaignState} from './feature_expansion_nested_host.js';
import {validateItemKey} from './gameplay_transactions.js';
import {jsonData} from './simulation_contracts.js';
const shape=(v,fields,label)=>assert(object(v)&&Object.keys(v).length===fields.length&&fields.every(k=>Object.hasOwn(v,k)),`Unsupported ${label} fields.`);
const people=nestedDefinitions.people.map(d=>d.id),places=Object.values(L),calendarSeed={year:1,month:1,day:1,hour:6,minute:0,day_count:1};
const owners=[{worldId:I.hub,stockOwner:I.hubStock,shopOwner:I.hubShop,questId:I.hubQuest,locations:[L.hub,L.workroom]},
 {worldId:I.salt,stockOwner:I.saltStock,shopOwner:I.saltShop,questId:I.saltQuest,locations:[L.salt,L.enginehouse]},
 {worldId:I.archive,stockOwner:I.archiveStock,shopOwner:I.archiveShop,questId:I.archiveQuest,locations:[L.archive,L.records]}].map(o=>({...o,instanceId:footprints.find(f=>f.worldId===o.worldId).instanceId,peopleIds:people.filter(id=>nestedDefinitions.people.find(p=>p.id===id).worldId===o.worldId)}));
export function nestedCalendarAt(elapsed){assert(natural(elapsed),'Invalid local calendar elapsed time.');const total=360+elapsed,days=Math.floor(total/1440),months=Math.floor(days/30),years=Math.floor(months/12);
 return {year:years+1,month:months%12+1,day:days%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:days+1};}
function counts(value,label){assert(object(value),`Missing native ${label} inventory.`);for(const [key,count] of Object.entries(value)){validateItemKey(key);assert(natural(count)&&count>0,`Invalid native ${label} count.`);}return value;}
function savedCounts(value,label){assert(object(value),`Missing saved native ${label} owner.`);return counts(Object.fromEntries(Object.entries(value).map(([key,v])=>{shape(v,['count'],`${label} inventory entry`);return [key,v.count];})),label);}
const encode=value=>Object.fromEntries(Object.entries(value).map(([key,count])=>[key,{count}]));
export function nestedQuestProjection(state,worldId){const d=state.nestedCampaign,f=state.worlds[worldId]?.facts||{};
 if(worldId===I.hub){const done=!!f['nested.hub.shiftDone'];return {is_active:!!d&&!done,is_finished:done,task_status:[{is_finished:!!f['nested.hub.met']},{is_finished:done}]};}
 const salt=worldId===I.salt,inspected=!!f[salt?'nested.saltworks.inspected':'nested.archive.inspected'],resolved=salt?f['nested.saltworks.export']!=='pending'||!!f['nested.saltworks.repaired']:!!f['nested.archive.resolved'];
 return {is_active:!!d&&inspected&&!resolved,is_finished:!!d&&resolved,task_status:[{is_finished:inspected},{is_finished:!!d&&resolved}]};
}
export function validateNestedNativeMetadata(value,state){jsonData(value);shape(value,['schema','definitionRevision','revision','initializedAt','worldOwners'],'nested native envelope');const d=state.nestedCampaign;
 assert(d&&value.schema===1&&value.definitionRevision===1&&natural(value.revision)&&value.revision>0&&value.revision===d.nativeRevision&&value.initializedAt===d.initializedAt,'Native campaign revision and optional state disagree.');
 assert(Array.isArray(value.worldOwners)&&value.worldOwners.length===3,'Missing independent native world owners.');
 for(let index=0;index<owners.length;index++){const expected=owners[index],w=value.worldOwners[index],instance=d.instances.find(i=>i.id===expected.instanceId);
  shape(w,['worldId','instanceId','calendar','stockOwner','shopOwner','peopleIds','questId'],'native world owner');
  for(const key of ['worldId','instanceId','stockOwner','shopOwner','questId'])assert(w[key]===expected[key],'Native world owner identity changed.');
  assert(same(w.peopleIds,expected.peopleIds)&&same(w.calendar,nestedCalendarAt(instance.clock.elapsed)),'Native resident/calendar owners differ from the retained instance.');}
 return true;
}
export function validateNestedEnvelope(envelope){const state=envelope.expansion||{},d=state.nestedCampaign,n=envelope[nativeDomain],visit=activeNestedVisit(state),location=envelope['current location'];
 if(!d){assert(n==null&&!places.includes(location),'This save requires its optional nested campaign/native owner binding.');return true;}
 validateNestedCampaignState(state);validateNestedNativeMetadata(n,state);assert(places.includes(location)===!!visit&&(!visit||location===state.simulation.people.player.location),'Saved current location and actual campaign visit disagree.');
 for(const id of people){assert(object(envelope.npcs?.[id])&&object(envelope.levels?.person?.[id])&&object(envelope.npc_equipment?.[id]),'Missing distinct native person/XP/equipment owner.');savedCounts(envelope.inventories?.person?.[id],id);}
 for(const o of owners){savedCounts(envelope.inventories?.nested_campaign?.[o.stockOwner],o.stockOwner);savedCounts(envelope.inventories?.trader?.[o.shopOwner],o.shopOwner);
  for(const id of o.locations)assert(object(envelope.locations?.[id]),'Missing independently mutable native location owner.');
  assert(same(envelope.quests?.[o.questId],nestedQuestProjection(state,o.worldId)),'Native local quest projection does not match its committed objective facts.');
  assert(envelope.availabilities?.trader?.[o.shopOwner]===0,'Legacy native coin trade cannot bypass the campaign credit owner.');}
 return true;
}
// Actual native constructors are injected by main before loading. Registration
// creates empty, unavailable definitions only. Explicit durable enrollment is
// the only stock/body/role initialization path; render and restore never seed.
export function createNestedNativeBindings({NPC,NPCRegistry,SafeLocation,locations,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests,availabilities,Game_Time,getItemFromKey,
 getNativeContext=()=>({}),getCurrentLocation=()=>null,getNativeBody=()=>null}){
 assert([NPC,SafeLocation,InventoryComponent,TraderComponent,Quest,QuestTask,Game_Time,getItemFromKey].every(v=>typeof v==='function'),'Bind the real native campaign constructors.');
 assert(NPCRegistry&&object(locations)&&object(inventories)&&object(quests)&&object(activeQuests)&&object(availabilities?.quest),'Bind the real native campaign registries.');
 let metadata=null,registered=false;const stock={},shops={},calendars={},localQuests={};
 const actualCounts=items=>counts(Object.fromEntries(Object.entries(items).filter(([,v])=>v.count>0).map(([key,v])=>[key,v.count])),'live');
 const reconstruct=value=>Object.fromEntries(Object.entries(counts(value,'staged')).map(([key,count])=>{const item=getItemFromKey(key);assert(item,'A staged campaign item definition is unavailable.');return [key,{item,count}];}));
 const replace=(owner,items)=>{const native=owner.getItems();for(const key of Object.keys(native))delete native[key];Object.assign(native,items);};
 function register(){if(registered)return;
  assert(!places.some(id=>locations[id])&&!people.some(id=>NPCRegistry.getAll()[id])&&!owners.some(o=>quests[o.questId]||inventories.trader?.[o.shopOwner]||inventories.nested_campaign?.[o.stockOwner]),'A different native binding already owns the campaign IDs.');
  inventories.nested_campaign||={};
  for(const o of owners){stock[o.stockOwner]=new InventoryComponent();inventories.nested_campaign[o.stockOwner]=stock[o.stockOwner];
   const shop=new TraderComponent({name:`${footprints.find(f=>f.worldId===o.worldId).definition.label} supply counter`,is_unlocked:false,profit_margin:1,refresh_time:4});
   // Register exactly one inventory owner. The seller's personal Inventory is
   // different; no NPC alias or global refresh can copy this finite shop stock.
   shop.refresh=()=>false;shop.can_refresh=()=>false;shop.last_refresh=0;shops[o.shopOwner]=shop;inventories.trader[o.shopOwner]=shop.getInventoryComponent();availabilities.trader[o.shopOwner]=shop.getAvailabilityComponent();
   calendars[o.worldId]=new Game_Time(calendarSeed);
   const placeholderKeys=['undefined','undefined:task:0','undefined:task:1'],prior=Object.fromEntries(placeholderKeys.map(key=>[key,{present:Object.hasOwn(availabilities.quest,key),value:availabilities.quest[key]}]));
   const title=o.worldId===I.hub?'Service-district work ledger':o.worldId===I.salt?'Water and export agreement':'Archive claim ledger';
   const quest=new Quest({quest_id:o.questId,quest_name:title,quest_description:'Committed campaign facts own this local agreement. Mission extraction and payout belong to their distinct contract receipts.',questline:footprints.find(f=>f.worldId===o.worldId).definition.label,quest_rewards:{},
    quest_tasks:[new QuestTask({task_description:'Meet or inspect the actual local owners.',task_condition:{any:{}},task_rewards:{}}),new QuestTask({task_description:'Complete the retained local work or disposition.',task_condition:{any:{}},task_rewards:{}})]});
   for(const [key,p] of Object.entries(prior)){if(p.present)availabilities.quest[key]=p.value;else delete availabilities.quest[key];}
   quest.id=o.questId;quest.quest_id=o.questId;quests[o.questId]=quest;localQuests[o.questId]=quest;availabilities.quest[o.questId]=quest.getAvailabilityComponent();quest.quest_tasks.forEach((task,index)=>{availabilities.quest[`${o.questId}:task:${index}`]=task.getAvailabilityComponent();});
  }
  for(const person of nestedDefinitions.people){const npc=new NPC({id:person.id,name:person.label,levelable:copy(person.vitals),is_unlocked:false,description:`An original resident of ${footprints.find(f=>f.worldId===person.worldId).definition.label}. Native stock, body, equipment, XP, relationships and duties remain their actual owners.`});npc.reputation={};NPCRegistry.add(person.id,npc);}
  const descriptions={
   [L.hub]:'Lin keeps a service desk beside Mara’s assignment counter. Rooms, staff shifts, finite shops and return reports make this a lived district. Use Notebook to approve a role, accept terms or move to Oren’s workroom.',
   [L.workroom]:'Oren’s counted tools lie beside the pressure bench. Paid body care, physical refit and practiced return strokes use actual stock and body support.',
   [L.salt]:'Sela keeps the drinking-water schedule beside the extraction landing. Finite supplies and the water/export aftermath persist between missions.',
   [L.enginehouse]:'Brin’s export duty shares an engine with the drinking-water line. Real braces and supported pressure change the pump; an issuer delivery is a separate decision.',
   [L.archive]:'Tess’s register and Ada’s claim remain at the reception counter. An office title grants only its actual claimant rights; copied identity buys no jurisdiction.',
   [L.records]:'Ivo keeps the surviving witness sheet at a small press. Inspect, preserve or correct it with actual evidence and earned means. The archive keeps the result on revisit.'};
  for(const id of places)locations[id]=new SafeLocation({id,name:id,is_unlocked:false,npcs:people.filter(p=>nestedDefinitions.people.find(d=>d.id===p).location===id),connected_locations:[],is_under_roof:id!==L.salt,
   is_temperature_static:true,static_temperature:id===L.salt||id===L.enginehouse?17:20,light_level:'normal',tags:{nested_campaign:true},entrance_rewards:{},description:descriptions[id]});
  registered=true;
 }
 function applyQuest(id,value){const quest=localQuests[id],a=quest.getAvailabilityComponent();a.is_unlocked=value.is_active||value.is_finished;a.is_finished=value.is_finished;a.is_locked=false;
  quest.quest_tasks.forEach((task,index)=>{task.getAvailabilityComponent().is_finished=value.task_status[index].is_finished;});if(value.is_active)activeQuests[id]=quest;else delete activeQuests[id];}
 function applyAvailability(state){const enabled=!!state.nestedCampaign;for(const id of places)locations[id].getAvailabilityComponent().is_unlocked=enabled;
  for(const id of people)NPCRegistry.get(id).getAvailabilityComponent().is_unlocked=enabled&&state.simulation?.people[id]?.life==='alive';for(const shop of Object.values(shops))shop.getAvailabilityComponent().is_unlocked=false;}
 function writeAvailability(envelope,state){for(const o of owners){const q=nestedQuestProjection(state,o.worldId);envelope.quests[o.questId]=copy(q);envelope.availabilities.quest[o.questId]=(q.is_active||q.is_finished?1:0)|(q.is_finished?2:0);
  q.task_status.forEach((t,index)=>{envelope.availabilities.quest[`${o.questId}:task:${index}`]=t.is_finished?2:0;});envelope.availabilities.trader[o.shopOwner]=0;
  for(const id of o.locations)envelope.availabilities.location[id]=state.nestedCampaign?1:0;for(const id of o.peopleIds)envelope.availabilities.person[id]=state.nestedCampaign&&state.simulation.people[id].life==='alive'?1:0;}}
 function read(state){assert(registered,'Register native campaign definitions before reading.');const d=state.nestedCampaign;
  assert(d?metadata&&metadata.revision===d.nativeRevision:metadata===null,'Restore matching campaign metadata before reading its native owners.');
  const context=getNativeContext(),at=getCurrentLocation(),bodyHere=state.simulation?.people.player?.location,free=at!==null&&(at==='Village'||places.includes(at))&&bodyHere===at;
  return {bound:true,revision:metadata?.revision||0,body:copy(getNativeBody()),stock:Object.fromEntries(owners.flatMap(o=>[[o.stockOwner,actualCounts(stock[o.stockOwner].getItems())],[o.shopOwner,actualCounts(shops[o.shopOwner].getInventoryComponent().getItems())]])),
   calendars:Object.fromEntries(owners.map(o=>[o.worldId,copy(metadata?.worldOwners.find(w=>w.worldId===o.worldId)?.calendar||calendarSeed)])),quests:Object.fromEntries(owners.map(o=>[o.questId,nestedQuestProjection(state,o.worldId)])),
   endpointBindings:[{endpoint:{worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'},available:!!locations.Village?.canBeStarted?.(context),positions:[{id:'gate.arrival',free,bodyForms:['human']}]},
    ...footprints.map(f=>({endpoint:f.endpoint,available:d?!!locations[owners.find(o=>o.worldId===f.worldId).locations[0]].canBeStarted?.(context):true,positions:[{id:'gate.arrival',free,bodyForms:['human']}]}))]};
 }
 function stage(plan){assert(registered,'Register native campaign definitions before staging.');const d=plan.state.nestedCampaign;
  if(!d){assert(!metadata&&!plan.nestedActivation&&!plan.nestedNativeRequests?.length,'Ordinary publication cannot drop or mutate an active campaign.');return {write(){},publish(){}};}
  const first=plan.nestedActivation===true;assert(first?!metadata&&d.nativeRevision===0:metadata&&metadata.revision===d.nativeRevision,'Campaign native stock quote is stale.');
  const next=Object.fromEntries(owners.flatMap(o=>[[o.stockOwner,first?copy(NESTED_NATIVE_STOCK[o.stockOwner]):actualCounts(stock[o.stockOwner].getItems())],[o.shopOwner,first?copy(NESTED_NATIVE_STOCK[o.shopOwner]):actualCounts(shops[o.shopOwner].getInventoryComponent().getItems())]]));
  const requests=plan.nestedNativeRequests||[];assert(Array.isArray(requests)&&requests.length<=16&&(!first||requests.length===0),'Unsupported initial native stock requests.');
  for(const request of requests){shape(request,['owner','key','count','cause','expectedRevision'],'native campaign stock request');
   const command=nestedDefinitions.commands.find(c=>c.id===request.cause),authored=command?.nestedStock;
   assert(authored&&request.owner===authored.owner&&request.key===authored.key&&request.count===authored.count&&request.expectedRevision===metadata.revision,'The native stock request lacks its exact authored command and current revision.');
   assert(next[request.owner]&&natural((next[request.owner][request.key]||0)+request.count),'The finite shop/local stock is exhausted.');
   // Native stock reductions must appear as the matching physical acquisition
   // in the same staged plan. A menu/state field cannot create a free item.
   assert(plan.acquisitions?.some(a=>a.owner==='player'&&a.key===request.key&&a.count===-request.count),'A native stock transfer needs its matching acquisition receipt.');
   next[request.owner][request.key]=(next[request.owner][request.key]||0)+request.count;if(!next[request.owner][request.key])delete next[request.owner][request.key];}
  const nextMeta={schema:1,definitionRevision:1,revision:(metadata?.revision||0)+1,initializedAt:d.initializedAt,worldOwners:owners.map(o=>({worldId:o.worldId,instanceId:o.instanceId,
   calendar:nestedCalendarAt(d.instances.find(i=>i.id===o.instanceId).clock.elapsed),stockOwner:o.stockOwner,shopOwner:o.shopOwner,peopleIds:copy(o.peopleIds),questId:o.questId}))};
  d.nativeRevision=nextMeta.revision;validateNestedNativeMetadata(nextMeta,plan.state);const prepared=Object.fromEntries(Object.entries(next).map(([id,value])=>[id,reconstruct(value)]));
  return {write(envelope){envelope[nativeDomain]=copy(nextMeta);envelope.inventories.nested_campaign||={};assert(envelope.inventories.trader&&envelope.quests&&envelope.availabilities,'Missing native save owner namespaces.');
    for(const o of owners){envelope.inventories.nested_campaign[o.stockOwner]=encode(next[o.stockOwner]);envelope.inventories.trader[o.shopOwner]=encode(next[o.shopOwner]);}writeAvailability(envelope,plan.state);
   },publish(){metadata=nextMeta;for(const o of owners){replace(stock[o.stockOwner],prepared[o.stockOwner]);replace(shops[o.shopOwner].getInventoryComponent(),prepared[o.shopOwner]);calendars[o.worldId].loadTime(nextMeta.worldOwners.find(w=>w.worldId===o.worldId).calendar);applyQuest(o.questId,nestedQuestProjection(plan.state,o.worldId));}applyAvailability(plan.state);}};
 }
 function snapshot(envelope,state){assert(registered,'Register native campaign definitions before save creation.');if(!state.nestedCampaign){delete envelope[nativeDomain];return envelope;}
  assert(metadata?.revision===state.nestedCampaign.nativeRevision,'Live campaign native metadata is stale.');envelope[nativeDomain]=copy(metadata);writeAvailability(envelope,state);return envelope;}
 function restore(envelope){assert(registered,'Register native campaign definitions before native loading.');validateNestedEnvelope(envelope);const state=envelope.expansion||{},d=state.nestedCampaign;
  if(!d){metadata=null;for(const o of owners){replace(stock[o.stockOwner],{});replace(shops[o.shopOwner].getInventoryComponent(),{});calendars[o.worldId].loadTime(calendarSeed);applyQuest(o.questId,{is_active:false,is_finished:false,task_status:[{is_finished:false},{is_finished:false}]});}applyAvailability(state);return;}
  const prepared=Object.fromEntries(owners.flatMap(o=>[[o.stockOwner,reconstruct(savedCounts(envelope.inventories.nested_campaign[o.stockOwner],o.stockOwner))],[o.shopOwner,reconstruct(savedCounts(envelope.inventories.trader[o.shopOwner],o.shopOwner))]]));
  metadata=copy(envelope[nativeDomain]);for(const o of owners){replace(stock[o.stockOwner],prepared[o.stockOwner]);replace(shops[o.shopOwner].getInventoryComponent(),prepared[o.shopOwner]);calendars[o.worldId].loadTime(metadata.worldOwners.find(w=>w.worldId===o.worldId).calendar);applyQuest(o.questId,envelope.quests[o.questId]);}applyAvailability(state);
 }
 return {register,read,stage,snapshot,restore,validateEnvelope:validateNestedEnvelope,ownsPerson:id=>people.includes(id),getPerson:id=>{assert(people.includes(id),'Not a campaign resident.');return NPCRegistry.get(id);},
  getCalendar:worldId=>{assert(calendars[worldId],'Not a campaign calendar.');return calendars[worldId];},getStock:id=>{assert(stock[id],'Not a campaign communal stock.');return stock[id];},getShop:id=>{assert(shops[id],'Not a campaign shop.');return shops[id];},getQuest:id=>{assert(localQuests[id],'Not a campaign quest.');return localQuests[id];}};
}
