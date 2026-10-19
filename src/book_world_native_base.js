// Shared native binding for retained book-world campaigns (Mother of Learning,
// Paradise). Each world file supplies only its data and wording through
// createBookWorldNative(config); this module owns the one implementation of the
// stock ledger, calendar, quest projection, save validation and live binding
// (AR3 one authority per fact). It imports no world file, so it adds no cycle.
import {validateItemKey} from './gameplay_transactions.js';
import {jsonData} from './simulation_contracts.js';
export function createBookWorldNative({world,footprints,nativeDomain,nativeStock,definitions,activeVisit,validateCampaignState,
 stateKey,ns,activationKey,requestsKey,stockField,ownerCount,ownerCountMessage,tradeMessage,questDescription}){
const assert=(ok,message)=>{if(!ok)throw Error(message);},copy=x=>structuredClone(x),natural=n=>Number.isSafeInteger(n)&&n>=0,object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),shape=(v,fields,label)=>assert(object(v)&&Object.keys(v).length===fields.length&&fields.every(k=>Object.hasOwn(v,k)),`Unsupported ${label} fields.`);
const people=definitions.people.map(d=>d.id),calendarSeed={year:1,month:1,day:1,hour:6,minute:0,day_count:1};
const owners=footprints.map(f=>({...f.native,worldId:f.worldId,instanceId:f.instanceId,
 peopleIds:definitions.people.filter(p=>p.worldId===f.worldId).map(p=>p.id)}));
const places=owners.flatMap(o=>o.locations);
function validateDefinitions(){
 assert(owners.length===ownerCount&&new Set(owners.map(o=>o.worldId)).size===ownerCount&&new Set(owners.map(o=>o.instanceId)).size===ownerCount,ownerCountMessage);
 const ids=owners.flatMap(o=>[o.stockOwner,o.shopOwner,o.questId,...o.locations]);
 assert(ids.every(id=>typeof id==='string'&&id.length>0)&&new Set(ids).size===ids.length&&new Set(people).size===people.length,`${world} native owner IDs overlap.`);
 assert(definitions.people.every(p=>owners.some(o=>o.worldId===p.worldId&&o.locations.includes(p.location))&&p.inventory==='native'&&p.provision===false),`${world} native residents lack their actual local owners.`);
 for(const o of owners){assert(o.locations.length>0&&object(o.quest)&&typeof o.quest.title==='string',`Missing authored ${world} native quest/location definitions.`);counts(nativeStock[o.stockOwner],o.stockOwner);counts(nativeStock[o.shopOwner],o.shopOwner);}
}

function calendarAt(elapsed){assert(natural(elapsed)&&natural(elapsed+360),'Invalid local calendar elapsed time.');const total=360+elapsed,days=Math.floor(total/1440),months=Math.floor(days/30),years=Math.floor(months/12);
 return {year:years+1,month:months%12+1,day:days%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:days+1};}
function counts(value,label){assert(object(value),`Missing native ${label} inventory.`);for(const [key,count] of Object.entries(value)){validateItemKey(key);assert(natural(count)&&count>0,`Invalid native ${label} count.`);}return value;}
function savedCounts(value,label){assert(object(value),`Missing saved native ${label} owner.`);return counts(Object.fromEntries(Object.entries(value).map(([key,v])=>{shape(v,['count'],`${label} inventory entry`);return [key,v.count];})),label);}
const encode=value=>Object.fromEntries(Object.entries(value).map(([key,count])=>[key,{count}]));
function questProjection(state,worldId){
 const owner=owners.find(o=>o.worldId===worldId);assert(owner,`Not a ${world} quest world.`);
 const d=state[stateKey],f=state.worlds?.[worldId]?.facts||{},q=owner.quest;
 assert(object(q)&&typeof q.firstFact==='string'&&Array.isArray(q.resolvedFacts)&&q.resolvedFacts.length>0&&q.resolvedFacts.every(key=>typeof key==='string'),`Missing authored ${world} quest facts.`);
 const first=!!d&&f[q.firstFact]===true,resolved=!!d&&q.resolvedFacts.some(key=>f[key]===true);
 return {is_active:!!d&&!resolved,is_finished:resolved,task_status:[{is_finished:first},{is_finished:resolved}]};
}
function validateNativeMetadata(value,state){jsonData(value);shape(value,['schema','definitionRevision','revision','initializedAt','worldOwners'],`${world} native envelope`);const d=state[stateKey];
 assert(d&&value.schema===1&&value.definitionRevision===1&&natural(value.revision)&&value.revision>0&&value.revision===d.nativeRevision&&value.initializedAt===d.initializedAt,'Native campaign revision and optional state disagree.');
 assert(Array.isArray(value.worldOwners)&&value.worldOwners.length===owners.length,'Missing independent native world owners.');
 for(let index=0;index<owners.length;index++){const expected=owners[index],w=value.worldOwners[index],instance=d.instances.find(i=>i.id===expected.instanceId);
  shape(w,['worldId','instanceId','calendar','stockOwner','shopOwner','peopleIds','questId'],'native world owner');
  for(const key of ['worldId','instanceId','stockOwner','shopOwner','questId'])assert(w[key]===expected[key],'Native world owner identity changed.');
  assert(instance?.clock&&natural(instance.clock.elapsed),'Missing retained native calendar instance.');
  assert(same(w.peopleIds,expected.peopleIds)&&same(w.calendar,calendarAt(instance.clock.elapsed)),'Native resident/calendar owners differ from the retained instance.');}
 return true;
}
function validateEnvelope(envelope){const state=envelope.expansion||{},d=state[stateKey],n=envelope[nativeDomain],visit=activeVisit(state),location=envelope['current location'];
 if(!d){
  assert(n==null&&!places.includes(location),`This save requires its optional ${world} campaign/native owner binding.`);
  for(const o of owners){for(const inventory of [envelope.inventories?.[ns]?.[o.stockOwner],envelope.inventories?.trader?.[o.shopOwner]])assert(inventory==null||(object(inventory)&&Object.keys(inventory).length===0),`Absent ${world} cannot retain finite world stock.`);
   assert(!envelope.quests?.[o.questId]?.is_active&&!envelope.quests?.[o.questId]?.is_finished,`Absent ${world} cannot retain an active local quest.`);
   for(const id of o.locations)assert(!envelope.availabilities?.location?.[id],`Absent ${world} locations must remain unavailable.`);
   assert(!envelope.availabilities?.trader?.[o.shopOwner],`Absent ${world} shops must remain unavailable.`);}
  for(const id of people){const inventory=envelope.inventories?.person?.[id],xp=envelope.levels?.person?.[id],equipment=envelope.npc_equipment?.[id];
   assert(!state.simulation?.people?.[id]&&!state.actors?.[id]&&!envelope.availabilities?.person?.[id],`Absent ${world} cannot retain an enrolled native person.`);
   assert(inventory==null||(object(inventory)&&Object.keys(inventory).length===0),`Absent ${world} native people must have empty inventory placeholders.`);
   assert(equipment==null||(object(equipment)&&Object.keys(equipment).length===0),`Absent ${world} native people must have empty equipment placeholders.`);
   assert(xp==null||(object(xp)&&xp.total_xp===0&&object(xp.skill_xp)&&Object.values(xp.skill_xp).every(n=>n===0)),`Absent ${world} native people must have empty XP placeholders.`);}
  return true;
 }

 validateCampaignState(state);validateNativeMetadata(n,state);assert(places.includes(location)===!!visit&&(!visit||location===state.simulation.people.player.location),'Saved current location and actual campaign visit disagree.');
 assert(object(envelope.character)&&object(envelope.character.equipment)&&object(envelope.levels?.person?.main_character),'Missing actual shared native player/equipment/XP owner.');
 savedCounts(envelope.inventories?.person?.main_character,'main_character');
 if(visit){const body=state.simulation.people.player.body;assert(body?.id==='native.player.body'&&body.form==='human'&&body.ownerId==='player'&&body.controllerId==='player',`Active ${world} visit requires the actual supported native player body.`);}
 for(const id of people){const body=state.simulation.people[id]?.body;assert(body?.id===`native.person.${id}.body`&&body.ownerId===id&&body.controllerId===id&&body.form==='human',`Native ${world} resident body is not its own independent owner.`);}

 for(const id of people){assert(object(envelope.npcs?.[id])&&object(envelope.levels?.person?.[id])&&object(envelope.npc_equipment?.[id]),'Missing distinct native person/XP/equipment owner.');savedCounts(envelope.inventories?.person?.[id],id);}
 for(const o of owners){savedCounts(envelope.inventories?.[ns]?.[o.stockOwner],o.stockOwner);savedCounts(envelope.inventories?.trader?.[o.shopOwner],o.shopOwner);
  for(const id of o.locations)assert(object(envelope.locations?.[id]),'Missing independently mutable native location owner.');
  assert(same(envelope.quests?.[o.questId],questProjection(state,o.worldId)),'Native local quest projection does not match its committed objective facts.');
  assert(envelope.availabilities?.trader?.[o.shopOwner]===0,tradeMessage);}
 return true;
}
// Actual native constructors are injected by main before loading. Registration
// creates empty, unavailable definitions only. Explicit durable enrollment is
// the only stock/body/role initialization path; render and restore never seed.
function createBindings({NPC,NPCRegistry,SafeLocation,locations,InventoryComponent,inventories,TraderComponent,Quest,QuestTask,quests,activeQuests,availabilities,Game_Time,getItemFromKey,
 getNativeContext=()=>({}),getCurrentLocation=()=>null,getNativeBody=()=>null}){
 assert([NPC,SafeLocation,InventoryComponent,TraderComponent,Quest,QuestTask,Game_Time,getItemFromKey].every(v=>typeof v==='function'),'Bind the real native campaign constructors.');
 assert(NPCRegistry&&object(locations)&&object(inventories)&&object(quests)&&object(activeQuests)&&object(availabilities?.quest)&&object(availabilities.trader)&&object(inventories.trader),'Bind the real native campaign registries.');
 let metadata=null,registered=false;const stock={},shops={},calendars={},localQuests={};
 const actualCounts=items=>{assert(object(items),'Missing live native inventory.');for(const value of Object.values(items))assert(object(value)&&natural(value.count),'Malformed live native stock count.');return counts(Object.fromEntries(Object.entries(items).filter(([,v])=>v.count>0).map(([key,v])=>[key,v.count])),'live');};
 const reconstruct=value=>Object.fromEntries(Object.entries(counts(value,'staged')).map(([key,count])=>{const item=getItemFromKey(key);assert(item,'A staged campaign item definition is unavailable.');return [key,{item,count}];}));
 const replace=(owner,items)=>{const native=owner.getItems();for(const key of Object.keys(native))delete native[key];Object.assign(native,items);};
 function register(){if(registered)return;validateDefinitions();
  assert(!places.some(id=>locations[id])&&!people.some(id=>NPCRegistry.getAll()[id])&&!owners.some(o=>quests[o.questId]||inventories.trader?.[o.shopOwner]||inventories[ns]?.[o.stockOwner]),'A different native binding already owns the campaign IDs.');
  inventories[ns]||={};
  for(const o of owners){stock[o.stockOwner]=new InventoryComponent();inventories[ns][o.stockOwner]=stock[o.stockOwner];
   const shop=new TraderComponent({name:`${footprints.find(f=>f.worldId===o.worldId).definition.label} supply counter`,is_unlocked:false,profit_margin:1,refresh_time:4});
   // Register exactly one inventory owner. The seller's personal Inventory is
   // different; no NPC alias or global refresh can copy this finite shop stock.
   shop.refresh=()=>false;shop.can_refresh=()=>false;shop.last_refresh=0;shops[o.shopOwner]=shop;inventories.trader[o.shopOwner]=shop.getInventoryComponent();availabilities.trader[o.shopOwner]=shop.getAvailabilityComponent();
   calendars[o.worldId]=new Game_Time(calendarSeed);
   const placeholderKeys=['undefined','undefined:task:0','undefined:task:1'],prior=Object.fromEntries(placeholderKeys.map(key=>[key,{present:Object.hasOwn(availabilities.quest,key),value:availabilities.quest[key]}]));
   const title=o.quest.title;
   const quest=new Quest({quest_id:o.questId,quest_name:title,quest_description:questDescription,questline:footprints.find(f=>f.worldId===o.worldId).definition.label,quest_rewards:{},
    quest_tasks:[new QuestTask({task_description:'Meet or inspect the actual local owners.',task_condition:{any:{}},task_rewards:{}}),new QuestTask({task_description:'Complete the retained local work or disposition.',task_condition:{any:{}},task_rewards:{}})]});
   for(const [key,p] of Object.entries(prior)){if(p.present)availabilities.quest[key]=p.value;else delete availabilities.quest[key];}
   quest.id=o.questId;quest.quest_id=o.questId;quests[o.questId]=quest;localQuests[o.questId]=quest;availabilities.quest[o.questId]=quest.getAvailabilityComponent();quest.quest_tasks.forEach((task,index)=>{availabilities.quest[`${o.questId}:task:${index}`]=task.getAvailabilityComponent();});
  }
  for(const person of definitions.people){
   assert(person.inventory==='native'&&person.provision===false,`${world} residents require actual unseeded native owners.`);
   // Constructor capacities define this locked placeholder. Durable root activation
   // alone enrolls the actor and initializes usable vitals, inventory and XP.
   const npc=new NPC({id:person.id,name:person.label,levelable:copy(person.vitals),is_unlocked:false,description:person.description||`A resident of ${footprints.find(f=>f.worldId===person.worldId).definition.label}. Native stock, equipment, XP and vitals remain their actual owners.`});
   npc.reputation={};NPCRegistry.add(person.id,npc);
  }
  for(const o of owners)for(const id of o.locations)locations[id]=new SafeLocation({id,name:id,is_unlocked:false,
   npcs:definitions.people.filter(p=>p.location===id).map(p=>p.id),connected_locations:[],is_under_roof:false,
   is_temperature_static:true,static_temperature:20,light_level:'normal',tags:{[ns]:true},entrance_rewards:{},
   description:`${footprints.find(f=>f.worldId===o.worldId).definition.label}. Use Notebook for retained local work, actual stock, optional assignments and departure.`});
  registered=true;
 }
 function applyQuest(id,value){const quest=localQuests[id],a=quest.getAvailabilityComponent();a.is_unlocked=value.is_active||value.is_finished;a.is_finished=value.is_finished;a.is_locked=false;
  quest.quest_tasks.forEach((task,index)=>{task.getAvailabilityComponent().is_finished=value.task_status[index].is_finished;});if(value.is_active)activeQuests[id]=quest;else delete activeQuests[id];}
 function applyAvailability(state){const enabled=!!state[stateKey];for(const id of places){locations[id].getAvailabilityComponent().is_unlocked=enabled;
   locations[id].npcs=[...(locations[id].npcs||[]).filter(person=>!people.includes(person)),...people.filter(person=>enabled&&state.simulation?.people[person]?.life==='alive'&&state.simulation.people[person].location===id)];
  }
  for(const id of people)NPCRegistry.get(id).getAvailabilityComponent().is_unlocked=enabled&&state.simulation?.people[id]?.life==='alive';for(const shop of Object.values(shops))shop.getAvailabilityComponent().is_unlocked=false;}
 function writeAvailability(envelope,state){for(const o of owners){const q=questProjection(state,o.worldId);envelope.quests[o.questId]=copy(q);envelope.availabilities.quest[o.questId]=(q.is_active||q.is_finished?1:0)|(q.is_finished?2:0);
  q.task_status.forEach((t,index)=>{envelope.availabilities.quest[`${o.questId}:task:${index}`]=t.is_finished?2:0;});envelope.availabilities.trader[o.shopOwner]=0;
  for(const id of o.locations)envelope.availabilities.location[id]=state[stateKey]?1:0;for(const id of o.peopleIds)envelope.availabilities.person[id]=state[stateKey]&&state.simulation.people[id].life==='alive'?1:0;}}
 function read(state){assert(registered,'Register native campaign definitions before reading.');const d=state[stateKey];
  assert(d?metadata&&metadata.revision===d.nativeRevision:metadata===null,'Restore matching campaign metadata before reading its native owners.');
  const context=getNativeContext(),at=getCurrentLocation(),bodyHere=state.simulation?.people.player?.location,free=at!==null&&(at==='Village'||places.includes(at))&&bodyHere===at;
  // This stock view is private admission context. Observer UI must use scoped host presentation.
  return {bound:true,revision:metadata?.revision||0,body:copy(getNativeBody()),stock:Object.fromEntries(owners.flatMap(o=>[[o.stockOwner,actualCounts(stock[o.stockOwner].getItems())],[o.shopOwner,actualCounts(shops[o.shopOwner].getInventoryComponent().getItems())]])),
   calendars:Object.fromEntries(owners.map(o=>[o.worldId,copy(metadata?.worldOwners.find(w=>w.worldId===o.worldId)?.calendar||calendarSeed)])),quests:Object.fromEntries(owners.map(o=>[o.questId,questProjection(state,o.worldId)])),
   endpointBindings:[{endpoint:{worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'},available:!!locations.Village?.canBeStarted?.(context),positions:[{id:'gate.arrival',free,bodyForms:['human']}]},
    ...footprints.map(f=>({endpoint:f.endpoint,available:d?!!locations[owners.find(o=>o.worldId===f.worldId).locations[0]].canBeStarted?.(context):true,positions:[{id:'gate.arrival',free,bodyForms:['human']}]}))]};
 }
 function stage(plan){assert(registered,'Register native campaign definitions before staging.');const d=plan.state[stateKey];
  if(!d){assert(!metadata&&!plan[activationKey]&&!plan[requestsKey]?.length,'Ordinary publication cannot drop or mutate an active campaign.');return {write(){},publish(){}};}
  const first=plan[activationKey]===true;assert(first?!metadata&&d.nativeRevision===0:metadata&&metadata.revision===d.nativeRevision,'Campaign native stock quote is stale.');
  const next=Object.fromEntries(owners.flatMap(o=>[[o.stockOwner,first?copy(nativeStock[o.stockOwner]):actualCounts(stock[o.stockOwner].getItems())],[o.shopOwner,first?copy(nativeStock[o.shopOwner]):actualCounts(shops[o.shopOwner].getInventoryComponent().getItems())]]));
  const requests=plan[requestsKey]||[];assert(Array.isArray(requests)&&requests.length<=16&&(!first||requests.length===0),'Unsupported initial native stock requests.');
  assert(new Set(requests.map(r=>r?.cause)).size===requests.length,`Duplicate ${world} stock command in one publication.`);
  for(const request of requests){shape(request,['owner','key','count','cause','expectedRevision'],'native campaign stock request');
   const command=definitions.commands.find(c=>c.id===request.cause),authored=command?.[stockField]?.find(row=>row.owner===request.owner&&row.key===request.key&&row.count===request.count);
   assert(authored&&Number.isSafeInteger(request.count)&&request.count<0&&request.owner===authored.owner&&request.key===authored.key&&request.count===authored.count&&request.expectedRevision===metadata.revision,'The native stock request lacks its exact authored command and current revision.');
   assert(next[request.owner]&&natural((next[request.owner][request.key]||0)+request.count),'The finite shop/local stock is exhausted.');
   // Native stock reductions must appear as the matching physical acquisition
   // in the same staged plan. A menu/state field cannot create a free item.
   assert(plan.acquisitions?.some(a=>a.owner==='player'&&a.key===request.key&&a.count===-request.count),'A native stock transfer needs its matching acquisition receipt.');
   next[request.owner][request.key]=(next[request.owner][request.key]||0)+request.count;if(!next[request.owner][request.key])delete next[request.owner][request.key];}
  const nextMeta={schema:1,definitionRevision:1,revision:(metadata?.revision||0)+1,initializedAt:d.initializedAt,worldOwners:owners.map(o=>({worldId:o.worldId,instanceId:o.instanceId,
   calendar:calendarAt(d.instances.find(i=>i.id===o.instanceId).clock.elapsed),stockOwner:o.stockOwner,shopOwner:o.shopOwner,peopleIds:copy(o.peopleIds),questId:o.questId}))};
  const prepared=Object.fromEntries(Object.entries(next).map(([id,value])=>[id,reconstruct(value)]));d.nativeRevision=nextMeta.revision;validateNativeMetadata(nextMeta,plan.state);
  return {write(envelope){envelope[nativeDomain]=copy(nextMeta);envelope.inventories[ns]||={};assert(envelope.inventories.trader&&envelope.quests&&envelope.availabilities,'Missing native save owner namespaces.');
    for(const o of owners){envelope.inventories[ns][o.stockOwner]=encode(next[o.stockOwner]);envelope.inventories.trader[o.shopOwner]=encode(next[o.shopOwner]);}writeAvailability(envelope,plan.state);
   },publish(){metadata=nextMeta;for(const o of owners){replace(stock[o.stockOwner],prepared[o.stockOwner]);replace(shops[o.shopOwner].getInventoryComponent(),prepared[o.shopOwner]);calendars[o.worldId].loadTime(nextMeta.worldOwners.find(w=>w.worldId===o.worldId).calendar);applyQuest(o.questId,questProjection(plan.state,o.worldId));}applyAvailability(plan.state);}};
 }
 function snapshot(envelope,state){assert(registered,'Register native campaign definitions before save creation.');if(!state[stateKey]){assert(metadata===null,`An active native ${world} binding cannot be omitted from its save.`);delete envelope[nativeDomain];return envelope;}
  assert(metadata?.revision===state[stateKey].nativeRevision,'Live campaign native metadata is stale.');envelope[nativeDomain]=copy(metadata);writeAvailability(envelope,state);return envelope;}
 function restore(envelope){assert(registered,'Register native campaign definitions before native loading.');validateEnvelope(envelope);const state=envelope.expansion||{},d=state[stateKey];
  if(!d){metadata=null;for(const o of owners){replace(stock[o.stockOwner],{});replace(shops[o.shopOwner].getInventoryComponent(),{});calendars[o.worldId].loadTime(calendarSeed);applyQuest(o.questId,{is_active:false,is_finished:false,task_status:[{is_finished:false},{is_finished:false}]});}applyAvailability(state);return;}
  const prepared=Object.fromEntries(owners.flatMap(o=>[[o.stockOwner,reconstruct(savedCounts(envelope.inventories[ns][o.stockOwner],o.stockOwner))],[o.shopOwner,reconstruct(savedCounts(envelope.inventories.trader[o.shopOwner],o.shopOwner))]]));
  metadata=copy(envelope[nativeDomain]);for(const o of owners){replace(stock[o.stockOwner],prepared[o.stockOwner]);replace(shops[o.shopOwner].getInventoryComponent(),prepared[o.shopOwner]);calendars[o.worldId].loadTime(metadata.worldOwners.find(w=>w.worldId===o.worldId).calendar);applyQuest(o.questId,envelope.quests[o.questId]);}applyAvailability(state);
 }
 return {register,read,stage,snapshot,restore,validateEnvelope:validateEnvelope,ownsPerson:id=>people.includes(id),getPerson:id=>{assert(people.includes(id),'Not a campaign resident.');return NPCRegistry.get(id);},
  getCalendar:worldId=>{assert(calendars[worldId],'Not a campaign calendar.');return calendars[worldId];},getStock:id=>{assert(stock[id],'Not a campaign communal stock.');return stock[id];},getShop:id=>{assert(shops[id],'Not a campaign shop.');return shops[id];},getQuest:id=>{assert(localQuests[id],'Not a campaign quest.');return localQuests[id];}};
}
return {calendarAt,questProjection,validateNativeMetadata,validateEnvelope,createBindings};
}
