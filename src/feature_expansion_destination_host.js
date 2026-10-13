import {TIDEMARK_IDS as ids,TIDEMARK_LOCATIONS as places,TIDEMARK_KEYS as keys,TIDEMARK_ENDPOINT as endpoint,TIDEMARK_DEFINITION as definition,
 TIDEMARK_INITIAL_FACTS,tidemarkDefinitions,tidemarkActions} from './feature_expansion_destination.js';
import {createWorldInstance,createWorldVisit,planWorldClock,planWorldDeparture,validateWorldRecords} from './world_instances.js';
import {createRealmConnection,realmConnectionBinding,validateRealmConnectionBinding,planRealmOpening,previewRealmPassage} from './realm_connections.js';
import {buildNativeRealmCargoSnapshot,previewRealmCargoPassage} from './realm_cargo.js';
import {previewNativeRealmTraveler} from './native_realm_traveler.js';
import {enrollSimulation,commitSimulationCommand,previewSimulationCommand,cancelSimulationJob,simulationOccupiesActor,waitingSimulationChoice} from './simulation.js';
import {activePractice} from './techniques.js';
import {jsonData} from './simulation_contracts.js';
const assert=(ok,message)=>{if(!ok)throw Error(message);},copy=x=>structuredClone(x),natural=n=>Number.isSafeInteger(n)&&n>=0;
const frontierEndpoint={worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'};
const domain=()=>({facts:{},resources:{},completed:{},sources:{},techniques:{}});
export function createTidemarkConnection(){return createRealmConnection({id:'tidemark.passage',revision:1,from:frontierEndpoint,to:endpoint,kind:'physical',controllerId:'player',bidirectional:true,duration:0,lifetime:null,
 requirements:{id:'tidemark.present_passage',revision:1,operations:['passage'],bodyForms:['human'],costs:[]},layerPolicy:{passage:true,manifestation:false,contact:false},
 openingCosts:[{ownerId:'player',resourceId:'money',amount:1}],cargoPolicy:{allowed:true,maxUnits:Number.MAX_SAFE_INTEGER,allowEquipped:true,classes:['carried']},flows:['body','cargo']});}
const routeBinding=realmConnectionBinding(createTidemarkConnection());
export function activeTidemarkVisit(state){const d=state.featureDestination;return d?.visits.find(v=>v.id===d.activeVisitId&&v.status==='active')||null;}
export function validateTidemarkState(state){
 const d=state.featureDestination;if(d==null){assert(state.actors?.player?.worldId!==ids.world,'Tidemark presence requires its optional destination record.');return true;}
 jsonData(d);assert(d.schema===1&&d.definitionRevision===1&&d.bodyPolicy==='same_native_body'&&d.sourcePolicy==='local_counterweight_only'&&d.absence==='freeze','Unsupported Tidemark destination version or policy.');
 assert(natural(d.initializedAt)&&d.initializedAt<=state.clock&&natural(d.nativeRevision),'Invalid Tidemark native binding revision.');
 assert(Array.isArray(d.visits)&&d.visits.length<=64&&Array.isArray(d.receipts)&&d.receipts.length<=32,'Invalid bounded destination history.');
 assert(d.instance?.id===ids.instance&&d.instance.eraId===ids.era&&d.instance.continuityId===ids.continuity&&d.instance.parentInstanceId===null,'Tidemark must use its fixed authored present era and independent instance.');
 validateWorldRecords({definitions:[definition],instances:[d.instance],visits:d.visits},{actorIds:Object.keys(state.actors),externalInstances:[{id:'frontier.main',worldId:'base.frontier',parentInstanceId:null}]});
 assert(d.instance.clock.observedAt<=state.clock,'Tidemark clock exceeds the joined played clock.');validateRealmConnectionBinding(d.connection,routeBinding);
 assert(d.connection.open&&d.connection.openedAt<=state.clock,'The persistent Tidemark route must retain its conventional return access.');
 const visit=activeTidemarkVisit(state),others=d.visits.filter(v=>v.status==='active');
 assert(d.activeVisitId===null?others.length===0:!!visit&&others.length===1&&visit.actorId==='player','Invalid active Tidemark visit.');
 assert(!visit||!state.realmPrototype?.visits.some(v=>v.status==='active'),'One native body cannot occupy Tidemark and Glasshouse at once.');
 assert((state.actors.player.worldId===ids.world)===!!visit,'Tidemark visit and actual traveler world disagree.');
 assert(!visit||Object.values(places).includes(state.simulation?.people.player?.location),'Tidemark visit needs its actual native location.');
 assert(state.worlds[ids.world]&&Object.entries(TIDEMARK_INITIAL_FACTS).every(([key,value])=>typeof state.worlds[ids.world].facts[key]===typeof value),'Missing or malformed destination facts.');
 const facts=state.worlds[ids.world].facts;assert(['none','timber','counterweight'].includes(facts['tidemark.route'])&&facts['tidemark.repaired']===(facts['tidemark.route']!=='none')&&(!facts['tidemark.collected']||facts['tidemark.repaired']&&facts['tidemark.agreed']),'Inconsistent local repair agreement.');
 for(const id of [ids.keeper,ids.wright])assert(state.actors[id]?.worldId===ids.world&&state.simulation?.people[id]?.inventory==='native'&&state.simulation.people[id].definitionId===id,'Missing distinct native Tidemark resident.');
 for(const r of d.receipts){
  assert(typeof r.id==='string'&&natural(r.at)&&r.at<=state.clock&&natural(r.sequence)&&r.sequence<=state.sequence,'Invalid destination receipt.');
  if(r.retainedMethods!=null){
   assert(['tidemark.enter','tidemark.return'].includes(r.id)&&natural(r.basisSequence)&&r.basisSequence<r.sequence&&natural(r.connectionRevision)&&r.connectionRevision>0&&r.connectionRevision<=d.connection.revision&&Array.isArray(r.retainedMethods)&&r.retainedMethods.length<=1,'Invalid retained passage carrier.');
   for(const m of r.retainedMethods)assert(m.domain==='method'&&m.id==='tidemark.counterweight'&&natural(m.revision)&&m.revision>0,'Invalid learned method reference.');
  }
 }
 return true;
}
// Reconcile on every staged joined-clock movement, before simulations finish.
// No presence means zero local advancement, even if outside played time changes.
export function syncTidemarkClock(state){const d=state.featureDestination;if(!d||d.instance.clock.observedAt===state.clock)return state;
 const p=planWorldClock(d.instance,{playedAt:state.clock,visits:d.visits,expectedRevision:d.instance.revision},definition);assert(p.allowed,p.reasons.join(' '));d.instance=p.nextInstance;return state;}
export function nextTidemarkBoundary(state){const d=state.featureDestination;if(!d||!activeTidemarkVisit(state))return Infinity;
 const phase=d.instance.clock.elapsed%12;return state.clock+(phase<9?9-phase:12-phase);}
export function tidemarkContext(state,context){
 const d=state.featureDestination,inside=!!activeTidemarkVisit(state),phase=(d?.instance.clock.elapsed||0)%12,n=context.destinationNative;
 const facts=state.worlds[ids.world]?.facts||{},loan=state.simulation?.custody?.['tidemark.inspection_loan'];
 const keeper=context.gameplay?.[ids.keeper]?.inventory||{},own=context.gameplay?.player?.inventory||{};
 const reserved=facts['tidemark.collected']?0:1;
 return {...context,facts:{...context.facts,'tidemark.nativeBound':n?.bound===true&&n.revision===(d?.nativeRevision||0),
  'tidemark.lowTide':inside&&phase<9,'tidemark.terraceAccessible':inside&&(phase<9||facts['tidemark.repaired']===true),
  'tidemark.rewardStock':inside&&(n?.shop?.inventory?.[keys.kit]||0)>=1,
  'tidemark.shopLog':inside&&(n?.shop?.inventory?.[keys.log]||0)>=1,
  'tidemark.shopKit':inside&&(n?.shop?.inventory?.[keys.kit]||0)>reserved,
  'tidemark.salvageStock':inside&&(n?.stock?.[keys.log]||0)>=1,
  'tidemark.loanHeld':loan?.owner===ids.keeper&&loan?.holder==='player'&&loan?.key===keys.kit&&loan?.count===1,
  'tidemark.loanAvailable':inside&&!loan&&(keeper[keys.kit]||0)>=1,
  'tidemark.inspectionKit':inside&&(own[keys.kit]||0)>=1}};
}
export function tidemarkSimulationContexts(state,contexts){if(!state.featureDestination)return contexts;
 const inside=!!activeTidemarkVisit(state),next={...contexts};for(const id of ['player',ids.keeper,ids.wright])if(next[id])next[id]=tidemarkContext(state,next[id]);
 for(const id of [ids.keeper,ids.wright])next[id]={...next[id],busy:!inside||!!next[id]?.busy};return next;}
function busyReasons(state,context){const r=[];
 if(!state.simulation)r.push('Meet the Village’s living-world services before accepting a passage.');
 if(context.busy||simulationOccupiesActor(state)||state.pending.some(j=>j.context.actorId==='player')||activePractice(state.actors.player)||state.chronicle?.session||state.chronicle?.life.endedAt!=null||waitingSimulationChoice(state))r.push('Finish or cancel your current work, encounter or decision first.');
 if((context.vitals?.player?.health??0)<=0||state.simulation?.people.player?.life!=='alive'||state.simulation?.people.player?.body?.mobile===false)r.push('Your current native body must be alive and able to travel.');return r;}
function routeContext(state,context,connection,direction){
 const from=direction==='reverse'?endpoint:frontierEndpoint,to=direction==='reverse'?frontierEndpoint:endpoint;
 const native=context.destinationNative;assert(native?.bound===true&&native.revision===(state.featureDestination?.nativeRevision||0),'Bind the actual Tidemark native owners before passage.');
 const snapshot=buildNativeRealmCargoSnapshot({actorId:'player',bodyId:'native.player.body',sequence:state.sequence,revision:state.sequence+1,
  inventory:context.gameplay?.player?.inventory,equipment:context.equipment?.player,custody:state.simulation?.custody});
 const cargo=previewRealmCargoPassage(snapshot,connection,{expectedSequence:state.sequence,expectedRevision:connection.revision,expectedSnapshotRevision:snapshot.revision,expectedSnapshotBinding:snapshot.binding,
  purposeId:'native.tidemark.physical_passage',from,to,duration:0},{sequence:state.sequence,clock:state.clock,permissions:[],consents:[]});
 assert(snapshot.cargo.every(c=>c.ownerId==='player'),'Return all borrowed goods before using this passage.');assert(cargo.allowed,cargo.reasons.join(' '));
 const p=state.simulation.people.player;assert(native.body?.id==='native.player.body'&&native.body.form==='human','This authored passage supports the actual living native human body only.');
 assert(!p.body?.form||p.body.form===native.body.form,'The actual native body and its persistent form record disagree.');
 return {actorId:'player',sequence:state.sequence,clock:state.clock,endpoint:from,life:p.life,body:{id:native.body.id,revision:1,form:native.body.form},busy:!!context.busy||simulationOccupiesActor(state),
  knownConnectionIds:[connection.id],sources:[],methodIds:[],authorityIds:[],anchors:[],resources:[{ownerId:'player',resourceId:'money',amount:context.external.money}],
  cargo:cargo.cargo,cargoComplete:cargo.cargoComplete,bindings:native.endpointBindings};
}
function quoteRoute(state,context,direction){const connection=state.featureDestination?.connection||createTidemarkConnection(),rc=routeContext(state,context,connection,direction);
 const request={expectedSequence:state.sequence,expectedRevision:connection.revision,direction,operation:'passage'};
 const passage=previewRealmPassage(connection,rc,request),traveler=previewNativeRealmTraveler(state,context,rc,passage);
 return {connection,rc,request,passage,traveler};}
const custom=new Set(['tidemark.open','tidemark.enter','tidemark.return','tidemark.terrace','tidemark.landing','tidemark.cancel']);
const publicActions=new Set(tidemarkActions.map(action=>action.id));
export function previewTidemarkAction(state,registry,id,context){
 if(!publicActions.has(id))return {visible:false,eligible:false,reasons:['Unsupported local command.']};
 context=tidemarkContext(state,context);const inside=!!activeTidemarkVisit(state),d=state.featureDestination,location=context.facts.location;
 if(!custom.has(id)){const command=registry.simulation.commands.get(id);if(!command||!tidemarkDefinitions.commands.some(c=>c.id===id))return {visible:false,eligible:false,reasons:['Unsupported local command.']};
  if(!state.simulation){const reasons=[];if(context.facts.location!=='Village'||state.actors.player.worldId!=='base.frontier')reasons.push('Read this chart at the Village.');
   if(!context.facts['village.elderMet'])reasons.push('Greet the Village elder before reading the nearby chart.');
   if(context.busy||state.pending.some(j=>j.context.actorId==='player')||activePractice(state.actors.player)||state.chronicle?.session||state.chronicle?.life.endedAt!=null)reasons.push('Finish or cancel your current activity first.');
   return {visible:id==='tidemark.chart'&&!!context.facts['village.elderMet'],eligible:id==='tidemark.chart'&&!reasons.length,reasons};}
  const result=previewSimulationCommand(state,registry,id,{...context,targetId:command.targetId||null});
  if(id!=='tidemark.chart'&&!inside)return {...result,visible:false,eligible:false};
  if(inside&&!context.facts['tidemark.nativeBound'])return {...result,eligible:false,reasons:[...result.reasons,'Bind current local native owners before commitment.']};
  return {...result,visible:result.visible&&!(command.once&&state.actors.player.completed[id])};}
 const reasons=busyReasons(state,context);if(!context.facts['tidemark.nativeBound'])reasons.push('Bind the current native destination owners first.');let visible=false;
 if(id==='tidemark.open'){visible=!d&&state.actors.player.worldId==='base.frontier'&&!!state.simulation?.knowledge.player?.['tidemark.chart'];
  if(location!=='Village')reasons.push('Return to the Village chart.');if(!context.facts['tidemark.nativeBound'])reasons.push('Bind the native destination owners first.');if(context.external.money<1)reasons.push('Opening costs one wooden coin.');}
 if(id==='tidemark.enter'){visible=!!d&&!inside&&state.actors.player.worldId==='base.frontier';if(location!=='Village')reasons.push('Enter from the Village chart.');
  if(Object.values(state.realmPrototype?.observation?.state.leases||{}).some(l=>l.status==='active'))reasons.push('Close the Glasshouse viewing slit before taking your body elsewhere.');}
 if(id==='tidemark.return'){visible=inside;if(location!==places.dock)reasons.push('Return to the landing marker first.');
  if(state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).some(a=>[ids.keeper,ids.wright].includes(a))))reasons.push('Finish the paid local resident commitment before leaving.');}
 if(['tidemark.enter','tidemark.return'].includes(id)&&visible)try{const q=quoteRoute(state,context,id==='tidemark.return'?'reverse':'forward');reasons.push(...q.passage.reasons,...q.traveler.reasons);}catch(error){reasons.push(error.message);}
 if(id==='tidemark.terrace'){visible=inside&&location===places.dock;if(!context.facts['tidemark.terraceAccessible'])reasons.push('The low terraces are flooded. Wait for low tide or secure the sluice.');}
 if(id==='tidemark.landing'){visible=inside&&location===places.terrace;}
 if(id==='tidemark.cancel'){const job=state.simulation?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('tidemark.'));return {visible:!!job,eligible:!!job,reasons:[]};}
 return {visible,eligible:visible&&!reasons.length,reasons};
}
function attachResidents(next,registry,context){for(const id of [ids.keeper,ids.wright]){
 const d=registry.simulation.people.get(id);assert(d?.inventory==='native'&&d.provision===false&&!next.actors[id],'The destination needs its exact new native resident definition.');
 next.actors[id]={...domain(),worldId:ids.world,resources:copy(d.resources||{})};next.simulation.people[id]={life:'alive',inventory:'native',location:d.location,bornAt:next.clock,definitionId:id,definitionRevision:d.revision,body:copy(d.body)};
 }next.simulation.sites[ids.site]||={capacity:1,reservations:{}};}
const initialNativePeople={
 [ids.keeper]:{inventory:{[keys.log]:2,[keys.kit]:1},skills:{},reputation:{}},
 [ids.wright]:{inventory:{[keys.rope]:1},skills:{},reputation:{}}
};
export function beginTidemark(state,registry,context,expectedSequence=state.sequence){
 assert(expectedSequence===state.sequence,'This chart reading is stale.');
 const preview=previewTidemarkAction(state,registry,'tidemark.chart',context);assert(preview.visible&&preview.eligible,preview.reasons.join(' '));
 const enrolled=state.simulation?{state,external:context.external,gameplay:context.gameplay,vitals:context.vitals,equipment:context.equipment}:enrollSimulation(state,registry,context,expectedSequence);
 const plan=commitSimulationCommand(enrolled.state,registry,{id:'tidemark.chart'},{...context,external:enrolled.external,gameplay:enrolled.gameplay,vitals:enrolled.vitals||context.vitals},enrolled.state.sequence);
 plan.acquisitions=[...(enrolled.acquisitions||[]),...plan.acquisitions];plan.unlocks=[...(enrolled.unlocks||[]),...plan.unlocks];if(enrolled.native&&!plan.native)plan.native=enrolled.native;return plan;
}
export function commitTidemarkAction(state,registry,id,context,expectedSequence=state.sequence){
 assert(expectedSequence===state.sequence,'This destination action is stale.');context=tidemarkContext(state,context);
 const preview=previewTidemarkAction(state,registry,id,context);assert(preview.visible&&preview.eligible,preview.reasons.join(' ')||'This destination action is unavailable.');
 if(id==='tidemark.chart')return beginTidemark(state,registry,context,expectedSequence);
 if(id==='tidemark.cancel'){const job=state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('tidemark.'));return cancelSimulationJob(state,registry,job.id,context,expectedSequence);}
 let plan,retainedPassage;
 if(!custom.has(id)){
  const command=registry.simulation.commands.get(id);plan=commitSimulationCommand(state,registry,{id},{...context,targetId:command.targetId||null},expectedSequence);
  if(['tidemark.collect','tidemark.buy_log','tidemark.buy_kit','tidemark.salvage'].includes(id)){
   const owner=id==='tidemark.salvage'?'stock':'shop',key=['tidemark.collect','tidemark.buy_kit'].includes(id)?keys.kit:keys.log;
   plan.destinationDebit={owner,key,count:1,coins:id==='tidemark.buy_log'?2:id==='tidemark.buy_kit'?5:0,expectedRevision:context.destinationNative.revision};
  }
 }else if(id==='tidemark.open'){
  const next=copy(state);next.worlds[ids.world]={facts:copy(TIDEMARK_INITIAL_FACTS),resources:{},completed:{}};
  attachResidents(next,registry,context);const connection=createTidemarkConnection(),rc=routeContext(state,context,connection,'forward');
  const opened=planRealmOpening(connection,rc,{expectedSequence:state.sequence,expectedRevision:connection.revision,direction:'forward',operation:'passage'});assert(opened.allowed,opened.reasons.join(' '));
  next.featureDestination={schema:1,definitionRevision:1,initializedAt:state.clock,nativeRevision:0,bodyPolicy:'same_native_body',sourcePolicy:'local_counterweight_only',absence:'freeze',
   instance:createWorldInstance(definition,{id:ids.instance,continuityId:ids.continuity,eraId:ids.era,playedAt:state.clock,parentInstanceId:null,actorIds:[ids.keeper,ids.wright]}),
   visits:[],activeVisitId:null,connection:opened.nextConnection,receipts:[]};
  const seeded={...context,gameplay:{...copy(context.gameplay),...copy(initialNativePeople)}};
  plan=commitSimulationCommand(next,registry,{id:'tidemark.open_receipt'},seeded,expectedSequence);plan.destinationActivation=true;
 }else if(['tidemark.enter','tidemark.return'].includes(id)){
  const next=copy(state);syncTidemarkClock(next);const q=quoteRoute(next,context,id==='tidemark.return'?'reverse':'forward');assert(q.passage.allowed&&q.traveler.allowed,[...q.passage.reasons,...q.traveler.reasons].join(' '));
  retainedPassage={basisSequence:state.sequence,connectionRevision:q.passage.connectionRevision,retainedMethods:copy(q.traveler.retained.methodRefs)};
  plan=commitSimulationCommand(next,registry,{id:id==='tidemark.enter'?'tidemark.enter_receipt':'tidemark.exit_receipt'},{...context,targetId:null},expectedSequence);
  const d=plan.state.featureDestination;
  if(id==='tidemark.enter'){const visit=createWorldVisit(d.instance,{id:`tidemark.visit.${plan.state.sequence}`,actorId:'player',endpoint,playedAt:plan.state.clock},definition,{actorIds:Object.keys(plan.state.actors),visits:d.visits});d.visits.push(visit);d.activeVisitId=visit.id;
   plan.state.actors.player.worldId=ids.world;plan.nativeLocation=places.dock;
  }else{const visit=activeTidemarkVisit(plan.state),departure=planWorldDeparture(d.instance,visit,{playedAt:plan.state.clock,visits:d.visits,expectedRevision:d.instance.revision},definition);assert(departure.allowed,departure.reasons.join(' '));
   d.instance=departure.nextInstance;d.visits=d.visits.map(v=>v.id===visit.id?departure.nextVisit:v).slice(-63);d.activeVisitId=null;plan.state.actors.player.worldId='base.frontier';plan.nativeLocation='Village';}
  plan.state.simulation.people.player.location=plan.nativeLocation;plan.nativePatch={'current location':plan.nativeLocation};
 }else{
  plan={state:copy(state),external:copy(context.external),gameplay:copy(context.gameplay),vitals:copy(context.vitals||{}),acquisitions:[],unlocks:[]};
  ++plan.state.sequence;plan.nativeLocation=id==='tidemark.terrace'?places.terrace:places.dock;plan.nativePatch={'current location':plan.nativeLocation};plan.state.simulation.people.player.location=plan.nativeLocation;
 }
 if(plan.state.featureDestination){const d=plan.state.featureDestination;d.receipts.push({id,at:plan.state.clock,sequence:plan.state.sequence,...retainedPassage});d.receipts=d.receipts.slice(-32);}
 validateTidemarkState(plan.state);return plan;
}
export function tidemarkView(state,context){const d=state.featureDestination,inside=!!activeTidemarkVisit(state),known=state.simulation?.knowledge.player||{},c=tidemarkContext(state,context),facts=state.worlds[ids.world]?.facts||{};
 const phase=(d?.instance.clock.elapsed||0)%12;
 return {visible:inside||!!known['tidemark.chart']||context.facts?.location==='Village'&&context.facts?.['village.elderMet']===true,label:inside?'Tidemark':'The terraced harbor chart',inside,
  description:inside?`Local tide: ${phase<9?'low':'high'}; ${phase<9?9-phase:12-phase} played minutes until it changes. ${facts['tidemark.repaired']?'The secured sluice keeps the terraces accessible.':'The terraces open at low tide.'} Local time runs only while you stay. The landing return remains safe through either tide.`:
   d?'The same harbor, people, supplies and agreement wait. Its local clock stays frozen while you are away. Return borrowed goods before entering.':'Opening the chart creates this optional original destination. It accepts no repair, resets no body and adds no prestige.',
  agreement:inside&&facts['tidemark.met']?(facts['tidemark.collected']?'Agreement settled.':facts['tidemark.repaired']?'Repair complete; collect the reserved kit.':facts['tidemark.agreed']?'Secure the sluice by a timber brace or learned counterweight setting.':facts['tidemark.refused']?'You declined; passage and ordinary low-tide access remain.':'Nessa offers a voluntary repair agreement.'):null,
  stock:inside&&facts['tidemark.met']&&context.destinationNative?{salvageLogs:context.destinationNative.stock[keys.log]||0,shopLogs:context.destinationNative.shop.inventory[keys.log]||0,shopKits:context.destinationNative.shop.inventory[keys.kit]||0,reservedKits:facts['tidemark.collected']?0:1}:null,
  records:Object.entries(known).filter(([key])=>key.startsWith('tidemark.')).map(([key,value])=>({key,text:value.value,at:value.at})),
  actions:tidemarkActions.map(a=>({...a}))};
}
// UI consumers can supply the actual registry; the read-only compact view above
// intentionally has no command resolver or mutation path of its own.
export function tidemarkPresentation(state,registry,context){const view=tidemarkView(state,context);view.actions=tidemarkActions.map(a=>({...a,...previewTidemarkAction(state,registry,a.id,context)}));return view;}
