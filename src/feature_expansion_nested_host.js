import {check as assert, copy, natural, object} from './basics.js';
import {auditRemainderControllerAllowed} from './audit_remainder_state.js';
import {remainderConsequencesExistingCommandGate} from './audit_remainder_consequences_facts.js';
import {previewNestedCarriers,stageNestedCarrierMove} from './feature_expansion_nested_carriers.js';
import {NESTED_IDS as I,NESTED_LOCATIONS as L,NESTED_KEYS as K,NESTED_FOOTPRINTS as footprints,NESTED_INITIAL_FACTS,NESTED_MISSIONS as missions,
 NESTED_NATIVE_PEOPLE,nestedDefinitions,nestedActions} from './feature_expansion_nested_content.js';
import {createWorldInstance,createWorldVisit,planWorldClock,planWorldDeparture,validateWorldRecords} from './world_instances.js';
import {createRealmConnection,realmConnectionBinding,validateRealmConnectionBinding,previewRealmPassage} from './realm_connections.js';
import {buildNativeRealmCargoSnapshot,previewRealmCargoPassage} from './realm_cargo.js';
import {previewNativeRealmTraveler} from './native_realm_traveler.js';
import {enrollSimulation,commitSimulationCommand,previewSimulationCommand,cancelSimulationJob,simulationOccupiesActor,waitingSimulationChoice} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {deriveSimulationSeed} from './simulation_resolution.js';
import {activePractice} from './techniques.js';
import {jsonData} from './simulation_contracts.js';
import {compactEndedWorldVisits,previewWorldVisitRoom} from './world_visit_history.js';
const shape=(v,fields,label)=>assert(object(v)&&Object.keys(v).length===fields.length&&fields.every(k=>Object.hasOwn(v,k)),`Unsupported ${label} fields.`);
const frontier={worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'};
const byWorld=new Map(footprints.map(f=>[f.worldId,f])),personIds=nestedDefinitions.people.map(d=>d.id),locationWorld={
 [L.hub]:I.hub,[L.workroom]:I.hub,[L.salt]:I.salt,[L.enginehouse]:I.salt,[L.archive]:I.archive,[L.records]:I.archive};
const homeLocations={[I.hub]:L.hub,[I.salt]:L.salt,[I.archive]:L.archive};
const visitCapacity=96;
const capacityReason='Reserve bounded campaign visit room before travel or contract acceptance.';
function requireVisitCapacity(d,additional=1){assert(d&&d.visits.length+additional<=visitCapacity,capacityReason);}
const visitRoomOptions=additional=>({capacity:visitCapacity,additional,synchronize:syncNestedCampaignClock,validate:validateNestedCampaignState});
const stageVisitRoom=(state,additional=1)=>compactEndedWorldVisits(state,'nestedCampaign',visitRoomOptions(additional));
const passageSlots=id=>id==='nested.enter_hub'||id==='nested.extraction.arrive'||id==='nested.personal.return'?1:id==='nested.mission.arrive'||id.startsWith('nested.accept.')||personalDestinations[id]?2:0;
const credit=(actor,amount)=>({type:'resource',actor,key:'nested.credit',amount});
const knowledge=(key,value)=>({type:'knowledge',actor:'player',key:`nested.${key}`,stage:'seen',value});
const domain=()=>({facts:{},resources:{},completed:{},sources:{},techniques:{}});
const missionDefinition=id=>missions.find(m=>m.id===id);
export function activeNestedVisit(state){const d=state.nestedCampaign;return d?.visits.find(v=>v.id===d.activeVisitId&&v.status==='active')||null;}
export function createNestedConnections(){const hub=byWorld.get(I.hub).endpoint;
 return [[frontier,hub,'nested.entry'],[hub,byWorld.get(I.salt).endpoint,'nested.route.saltworks'],[hub,byWorld.get(I.archive).endpoint,'nested.route.archive']].map(([from,to,id])=>{
  const c=createRealmConnection({id,revision:1,from,to,kind:'physical',controllerId:'player',bidirectional:true,duration:0,lifetime:null,
   requirements:{id:`${id}.approval`,revision:1,operations:['passage'],bodyForms:['human'],costs:[]},layerPolicy:{passage:true,manifestation:false,contact:false},
   cargoPolicy:{allowed:true,maxUnits:Number.MAX_SAFE_INTEGER,allowEquipped:true,classes:['carried']},flows:['body','cargo']});return c;
 });}
const connectionBindings=createNestedConnections().map(realmConnectionBinding);
const missionFields=['id','definitionRevision','stage','acceptedAt','arrivedAt','localDeadline','extended','reservedReward','objective','issuerSuccess','welfare','outcome','extraction','returnedAt','settledAt','reward'];
const stages=['accepted','arrived','outcome','extracting','returned','settled'];
function validateMission(m,state){shape(m,missionFields,'nested mission');const d=missionDefinition(m.id);
 assert(d&&m.definitionRevision===1&&stages.includes(m.stage)&&natural(m.acceptedAt)&&m.acceptedAt<=state.clock&&m.reservedReward===d.reward&&typeof m.extended==='boolean','Invalid accepted mission identity/terms.');
 for(const key of ['arrivedAt','returnedAt','settledAt'])assert(m[key]===null||natural(m[key])&&m[key]>=m.acceptedAt&&m[key]<=state.clock,'Invalid mission stage time.');
 assert(m.localDeadline===null||natural(m.localDeadline),'Invalid active-local return deadline.');
 assert(typeof m.objective==='boolean'&&typeof m.issuerSuccess==='boolean'&&typeof m.welfare==='string'&&['pending','complete','partial','withdrawn','breach'].includes(m.outcome)&&natural(m.reward)&&m.reward<=d.reward,'Invalid mission outcome/payout.');
 assert(m.stage==='accepted'?m.arrivedAt===null&&m.localDeadline===null:m.arrivedAt!==null&&m.localDeadline!==null,'Mission arrival and local clock commitment disagree.');
 assert(['returned','settled'].includes(m.stage)?m.returnedAt!==null:m.returnedAt===null,'Mission return receipt is missing or premature.');
 assert(m.stage==='settled'?m.settledAt!==null:m.settledAt===null&&m.reward===0,'Settlement is missing or premature.');
 if(m.extraction!==null){shape(m.extraction,['id','phase','startedAt','dueAt','interference','recoveredAt','arrivalSequence'],'extraction');const e=m.extraction;
  assert(e.id===`${m.id}.extraction`&&['initiated','interrupted','recovered','ready','arrived'].includes(e.phase)&&natural(e.startedAt)&&natural(e.dueAt)&&e.dueAt>=e.startedAt&&typeof e.interference==='boolean','Invalid authored extraction receipt.');
  assert(e.recoveredAt===null||natural(e.recoveredAt)&&e.recoveredAt>=e.startedAt,'Invalid extraction recovery.');
  assert(e.arrivalSequence===null||natural(e.arrivalSequence)&&e.arrivalSequence<=state.sequence,'Invalid extraction arrival receipt.');
  assert(['extracting','returned','settled'].includes(m.stage)&&(['returned','settled'].includes(m.stage)?e.phase==='arrived'&&e.arrivalSequence!==null:e.arrivalSequence===null),'Extraction and contract stage disagree.');
 }else assert(!['extracting','returned','settled'].includes(m.stage),'A returned contract requires an actual extraction.');
}
export function validateNestedCampaignState(state){const d=state.nestedCampaign;
 if(d==null){assert(state.actors?.player?.facts?.['nested.personal.version']==null&&state.actors?.player?.facts?.['nested.personal.active']==null,'Personal visit history requires its actual optional campaign owners.');assert(!footprints.some(f=>state.actors?.player?.worldId===f.worldId)&&!personIds.some(id=>state.actors?.[id]||state.simulation?.people[id]),'Nested native presence/residents require their optional campaign record.');return true;}
 jsonData(d);shape(d,['schema','definitionRevision','initializedAt','nativeRevision','bodyPolicy','absence','rolePolicy','instances','visits','activeVisitId','connections','offers','mission','history','receipts'],'nested campaign');
 assert(d.schema===1&&d.definitionRevision===1&&d.bodyPolicy==='same_native_body'&&d.absence==='freeze'&&d.rolePolicy==='explicit_local_approval','Unsupported nested campaign version/policy.');
 assert(natural(d.initializedAt)&&d.initializedAt<=state.clock&&natural(d.nativeRevision)&&Array.isArray(d.instances)&&d.instances.length===3&&Array.isArray(d.visits)&&d.visits.length<=visitCapacity,'Invalid independent native campaign owners.');
 validateWorldRecords({definitions:footprints.map(f=>f.definition),instances:d.instances,visits:d.visits},{actorIds:Object.keys(state.actors),externalInstances:[{id:'frontier.main',worldId:'base.frontier',parentInstanceId:null}]});
 for(const f of footprints){const instance=d.instances.find(v=>v.id===f.instanceId);
  assert(instance&&instance.continuityId===f.continuityId&&instance.eraId===f.eraId&&instance.parentInstanceId===null&&instance.clock.observedAt<=state.clock,'Campaign instance identity/era changed.');
  assert(state.worlds[f.worldId]&&Object.entries(NESTED_INITIAL_FACTS[f.worldId]).every(([key,value])=>typeof state.worlds[f.worldId].facts[key]===typeof value),'Missing or malformed retained local facts.');
 }
 assert(Array.isArray(d.connections)&&d.connections.length===3,'Missing exact physical passage owners.');d.connections.forEach((c,index)=>{validateRealmConnectionBinding(c,connectionBindings[index]);assert(c.open&&c.openedAt===d.initializedAt,'Campaign passage approval changed.');});
 const pf=state.actors.player.facts;
 if(pf['nested.personal.version']!=null){assert(pf['nested.personal.version']===1&&[8,9,10,11].includes(state.schema)&&typeof pf['nested.personal.active']==='boolean','Personal visits require the optional expansion8 policy reader. Preserve the original save.');
  assert(pf['nested.personal.active']===([I.salt,I.archive].includes(state.actors.player.worldId)&&!d.mission),'The personal-visit policy and actual contract/body location disagree.');
  if(pf['nested.personal.active'])assert(settledVisit(state,state.actors.player.worldId)&&pf['nested.role']==='contractor','A personal visit requires the actual earned destination history and current contractor approval.');
 }else assert(pf['nested.personal.active']==null,'Personal visit status needs its explicit policy version.');
 const visit=activeNestedVisit(state),active=d.visits.filter(v=>v.status==='active');
 assert(d.activeVisitId===null?active.length===0:!!visit&&active.length===1&&visit.actorId==='player','One actual body needs one active campaign visit.');
 assert(footprints.some(f=>f.worldId===state.actors.player.worldId)===!!visit&&(!visit||visit.endpoint.worldId===state.actors.player.worldId&&locationWorld[state.simulation?.people.player?.location]===state.actors.player.worldId),'Native location and campaign body presence disagree.');
 assert(!visit||!state.featureDestination?.activeVisitId&&!state.realmPrototype?.activeVisitId,'One actual native body cannot also occupy Tidemark or Glasshouse.');
 assert(['resident','employee','contractor'].includes(state.actors.player.facts['nested.role'])&&['none','fragment','supported','refined','taught'].includes(state.actors.player.facts['nested.method']),'Invalid earned role/method state.');
 for(const id of personIds)assert(state.actors[id]?.worldId===nestedDefinitions.people.find(p=>p.id===id).worldId&&state.simulation?.people[id]?.inventory==='native'&&state.simulation.people[id].definitionId===id,'Missing independent native resident owner.');
 assert(Array.isArray(d.offers)&&d.offers.length<=4&&new Set(d.offers.map(o=>o.id)).size===d.offers.length,'Invalid finite offered contracts.');
 for(const o of d.offers){shape(o,['id','at','sequence'],'mission offer');assert(missionDefinition(o.id)&&natural(o.at)&&o.at<=state.clock&&natural(o.sequence)&&o.sequence<=state.sequence,'Invalid offered contract receipt.');}
 assert(Array.isArray(d.history)&&d.history.length<=4&&new Set(d.history.map(m=>m.id)).size===d.history.length,'Invalid once-only settlement history.');
 for(const m of d.history){validateMission(m,state);assert(m.stage==='settled','A retained mission history requires actual settlement.');}
 if(d.mission){validateMission(d.mission,state);assert(!d.history.some(m=>m.id===d.mission.id),'A contract cannot have two payout owners.');
  if(['arrived','outcome','extracting'].includes(d.mission.stage))assert(visit?.endpoint.worldId===missionDefinition(d.mission.id).worldId,'Active mission needs actual destination presence.');
  if(['accepted','returned'].includes(d.mission.stage))assert(visit?.endpoint.worldId===I.hub,'Accepted/returned contract needs actual hub presence.');
 }
 assert(Array.isArray(d.receipts)&&d.receipts.length<=96,'Invalid bounded campaign receipts.');for(const r of d.receipts){shape(r,['id','at','sequence'],'campaign receipt');assert(typeof r.id==='string'&&natural(r.at)&&r.at<=state.clock&&natural(r.sequence)&&r.sequence<=state.sequence,'Invalid campaign receipt.');}
 return true;
}
// Called by the one joined-clock owner before simulation boundaries resolve.
// All three native calendars reconcile, but only actual presence adds elapsed.
export function syncNestedCampaignClock(state){const d=state.nestedCampaign;if(!d)return state;
 for(let index=0;index<d.instances.length;index++){const instance=d.instances[index],f=footprints.find(v=>v.instanceId===instance.id);
  if(instance.clock.observedAt!==state.clock){const p=planWorldClock(instance,{playedAt:state.clock,visits:d.visits,expectedRevision:instance.revision},f.definition);assert(p.allowed,p.reasons.join(' '));d.instances[index]=p.nextInstance;}}
 const m=d.mission,visit=activeNestedVisit(state);if(!m||visit?.endpoint.worldId!==missionDefinition(m.id).worldId)return state;
 const elapsed=d.instances.find(i=>i.id===visit.instanceId).clock.elapsed;
 if(['arrived','outcome','extracting'].includes(m.stage)&&elapsed>m.localDeadline){if(m.stage!=='extracting')m.stage='outcome';m.outcome='breach';m.issuerSuccess=false;}
 if(m.stage==='extracting'&&['initiated','recovered'].includes(m.extraction.phase)&&elapsed>=m.extraction.dueAt){
  m.extraction.phase=m.extraction.interference&&m.extraction.recoveredAt===null?'interrupted':'ready';}
 return state;
}
export function nextNestedCampaignBoundary(state){const d=state.nestedCampaign,m=d?.mission,visit=activeNestedVisit(state);if(!m||!visit||visit.endpoint.worldId!==missionDefinition(m.id).worldId)return Infinity;
 const elapsed=d.instances.find(i=>i.id===visit.instanceId).clock.elapsed;
 const deadline=['arrived','outcome','extracting'].includes(m.stage)&&m.outcome!=='breach'?state.clock+Math.max(1,m.localDeadline-elapsed+1):Infinity;
 if(m.stage==='extracting'&&['initiated','recovered'].includes(m.extraction.phase))return Math.min(deadline,state.clock+Math.max(1,m.extraction.dueAt-elapsed));
 if(deadline!==Infinity)return deadline;
 return Infinity;
}
function localOutcome(state,definition){const f=state.worlds[definition.worldId]?.facts||{};
 if(definition.kind==='followup'){const observed=f[definition.worldId===I.salt?'nested.saltworks.visitedAgain':'nested.archive.visitedAgain']===true;return {objective:observed,
  issuerSuccess:observed,welfare:definition.worldId===I.salt?String(f['nested.saltworks.water']):String(f['nested.archive.claim'])};}
 return definition.worldId===I.salt?{objective:f['nested.saltworks.inspected']===true&&(f['nested.saltworks.export']!=='pending'||f['nested.saltworks.repaired']===true),issuerSuccess:f['nested.saltworks.export']==='delivered',welfare:String(f['nested.saltworks.water'])}:
  {objective:f['nested.archive.inspected']===true&&f['nested.archive.resolved']===true,issuerSuccess:['registered','audited'].includes(f['nested.archive.claim']),welfare:String(f['nested.archive.claim'])};
}
export function nestedFacts(state,external={},native={}){const d=state.nestedCampaign,a=state.actors?.player,actorId=external.actorId||'player',p=state.simulation?.people[actorId],m=d?.mission,def=m&&missionDefinition(m.id),visit=activeNestedVisit(state);
 const owned=external.gameplay?.[actorId]?.inventory||external[actorId]?.inventory||{},person=external.gameplay||external,employee=person[I.employee]?.inventory||{};
 const source=state.actors?.[actorId]?.sources?.[I.method],faculty=state.simulation?.faculties[actorId]?.[I.method],supported=!!source&&(source.expiresAt==null||source.expiresAt>state.clock)&&!!faculty?.active&&faculty.awakened&&!faculty.suppressed;
 const facts={'nested.nativeBound':native.bound===true&&native.revision===(d?.nativeRevision||0),'nested.local.hub':visit?.endpoint.worldId===I.hub,'nested.local.saltworks':visit?.endpoint.worldId===I.salt,'nested.local.archive':visit?.endpoint.worldId===I.archive,
  'nested.role.employee':a?.facts['nested.role']==='employee','nested.role.contractor':a?.facts['nested.role']==='contractor','nested.roleChangeAllowed':!!d&&!m,
  'nested.employeeFunded':(state.actors?.[I.employee]?.resources['nested.credit']||0)>=4&&(employee[K.log]||0)>0,
  'nested.foremanHaulFunded':(state.actors?.[I.foreman]?.resources['nested.credit']||0)>=2&&(state.actors?.[I.foreman]?.resources['nested.haulDemand']||0)>0,
  'nested.employeeKit':(employee[K.kit]||0)>0,'nested.method.supported':supported,'nested.method.refined':['refined','taught'].includes(a?.facts['nested.method']),
  'nested.methodSupport':supported&&p?.life==='alive'&&(p.body?.hands??2)>=2&&p.body?.mobile!==false&&(owned[K.kit]||0)>0&&(owned[K.rope]||0)>0,
  'nested.mission.id':m?.id||'none','nested.mission.stage':m?.stage||'none','nested.mission.accepted':!!m,'nested.mission.arrived':['arrived','outcome','extracting'].includes(m?.stage),
  'nested.mission.objectiveDone':!!def&&localOutcome(state,def).objective,'nested.mission.issuerSuccess':!!def&&localOutcome(state,def).issuerSuccess,
  'nested.mission.returned':m?.stage==='returned','nested.mission.settled':d?.history.length>0,'nested.inside':!!visit};
 for(const chain of ['roles','welfare','method'])facts[`nested.chain.${chain}.started`]=a?.facts[`nested.chain.${chain}.started`]===true;
 for(const [owner,counts] of Object.entries(native.stock||{}))for(const [kind,key] of Object.entries(K))facts[`nested.stock.${owner}.${kind}`]=(counts[key]||0)>0;
 return facts;
}
export function nestedContext(state,context={}){return {...context,facts:{...context.facts,...nestedFacts(state,context,context.nestedNative)}};}
export function nestedSimulationContexts(state,contexts){if(!state.nestedCampaign)return contexts;const next={...contexts},world=state.actors.player.worldId;
 for(const id of ['player',...personIds])if(next[id])next[id]=nestedContext(state,next[id]);
 for(const id of personIds)if(next[id])next[id]={...next[id],busy:world!==state.actors[id].worldId||!!next[id].busy};return next;}
function busyReasons(state,context){const r=[];
 if(!state.simulation)r.push('Meet the Village living-world services before approving this side entry.');
 if(context.busy||simulationOccupiesActor(state)||state.pending.some(j=>j.context.actorId==='player')||activePractice(state.actors.player)||state.chronicle?.session||state.chronicle?.life.endedAt!=null||waitingSimulationChoice(state))r.push('Finish or cancel current work or decisions first.');
 if((context.vitals?.player?.health??0)<=0||state.simulation?.people.player?.life!=='alive'||state.simulation?.people.player?.body?.mobile===false)r.push('The actual living native body must be able to travel.');return r;}
function passage(state,context,connection,direction){
 const retained=previewNestedCarriers(state,context,connection,direction);assert(retained.allowed,retained.reasons.join(" "));const from=direction==='reverse'?connection.to:connection.from,to=direction==='reverse'?connection.from:connection.to,n=context.nestedNative;
 assert(n?.bound===true&&n.revision===(state.nestedCampaign?.nativeRevision||0),'Bind current native campaign owners before passage.');
 const snapshot=buildNativeRealmCargoSnapshot({actorId:'player',bodyId:'native.player.body',sequence:state.sequence,revision:state.sequence+1,inventory:context.gameplay?.player?.inventory,equipment:context.equipment?.player,custody:state.simulation?.custody});
 assert(snapshot.cargo.every(c=>c.ownerId==='player'),'Return borrowed goods before cross-world passage.');
 const cargo=previewRealmCargoPassage(snapshot,connection,{expectedSequence:state.sequence,expectedRevision:connection.revision,expectedSnapshotRevision:snapshot.revision,expectedSnapshotBinding:snapshot.binding,purposeId:'native.nested.physical_passage',from,to,duration:0},{sequence:state.sequence,clock:state.clock,permissions:[],consents:[]});assert(cargo.allowed,cargo.reasons.join(' '));
 const p=state.simulation.people.player;assert(n.body?.id==='native.player.body'&&n.body.form==='human'&&(!p.body?.form||p.body.form===n.body.form),'This gate supports the actual native human body, not a copied/replaced identity.');
 const rc={actorId:'player',sequence:state.sequence,clock:state.clock,endpoint:from,life:p.life,body:{id:n.body.id,revision:1,form:n.body.form},busy:!!context.busy||simulationOccupiesActor(state),
  knownConnectionIds:[connection.id],sources:[],methodIds:[],authorityIds:[],anchors:[],resources:[],cargo:cargo.cargo,cargoComplete:cargo.cargoComplete,bindings:n.endpointBindings};
 const request={expectedSequence:state.sequence,expectedRevision:connection.revision,direction,operation:'passage'},q=previewRealmPassage(connection,rc,request),traveler=previewNativeRealmTraveler(state,context,rc,q);
 assert(q.allowed&&traveler.allowed,[...q.reasons,...traveler.reasons].join(' '));return q;
}
const personalDestinations={'nested.personal.saltworks':I.salt,'nested.personal.archive':I.archive};
const settledVisit=(state,world)=>state.nestedCampaign?.history.some(m=>missionDefinition(m.id)?.worldId===world&&m.stage==='settled'&&m.arrivedAt!==null&&m.returnedAt!==null);
const publicIds=new Set(nestedActions.map(a=>a.id)),standardIds=new Set(nestedDefinitions.commands.filter(c=>!c.id.endsWith('_receipt')).map(c=>c.id));
const moves={'nested.move.workroom':[L.hub,L.workroom],'nested.move.street':[L.workroom,L.hub],'nested.move.enginehouse':[L.salt,L.enginehouse],'nested.move.landing':[L.enginehouse,L.salt],'nested.move.records':[L.archive,L.records],'nested.move.reception':[L.records,L.archive]};
const missionIdFrom=(id,prefix)=>id.startsWith(prefix)?id.slice(prefix.length):null;
function offeredAllowed(d,def){if(d.history.some(m=>m.id===def.id)||d.mission)return false;if(def.kind==='initial')return true;return d.history.some(m=>missionDefinition(m.id).worldId===def.worldId&&missionDefinition(m.id).kind==='initial');}
export function previewNestedCommand(state,registry,id,context={}){
 if(!publicIds.has(id))return {visible:false,eligible:false,reasons:['Unsupported nested campaign command.']};context=nestedContext(state,context);
 const d=state.nestedCampaign,m=d?.mission,visit=activeNestedVisit(state),world=state.actors.player.worldId,location=context.facts.location||state.simulation?.people.player?.location;
 if(standardIds.has(id)){
  if(!state.simulation){const reasons=[];if(world!=='base.frontier'||location!=='Village')reasons.push('Read these terms at the Village.');if(!context.facts['village.elderMet'])reasons.push('Greet the Village elder first.');if(context.busy||activePractice(state.actors.player)||state.pending.some(j=>j.context.actorId==='player'))reasons.push('Finish your current work first.');return {visible:id==='nested.chart'&&!!context.facts['village.elderMet'],eligible:id==='nested.chart'&&!reasons.length,reasons};}
  const command=registry.simulation.commands.get(id),q=previewSimulationCommand(state,registry,id,{...context,targetId:command.targetId||null});return {...q,visible:q.visible&&!(command.once&&state.actors.player.completed[id])&&(id==='nested.chart'||!!d&&!!visit)};
 }
 if(id==='nested.cancel'){const job=state.simulation?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('nested.'));return {visible:!!job,eligible:!!job&&job.cancellation==='refund',reasons:job?.cancellation==='refund'?[]:['This work has no refundable cancellation.']};}
 const reasons=[...busyReasons(state,context),...remainderConsequencesExistingCommandGate(state,id)];if(!context.facts['nested.nativeBound'])reasons.push('Bind current native hub/destination owners first.');let visible=false;
 if(id==='nested.enroll'){visible=!d&&world==='base.frontier'&&!!state.simulation?.knowledge.player?.['nested.chart'];if(location!=='Village')reasons.push('Approve enrollment at the Village entry chart.');
  if(context.nestedNative?.body?.id!=='native.player.body'||context.nestedNative.body.form!=='human')reasons.push('This original side-entry approval supports the actual native human body only.');}
 if(id==='nested.enter_hub'){visible=!!d&&!visit&&world==='base.frontier';if(location!=='Village')reasons.push('Enter through the Village chart.');if(Object.values(state.realmPrototype?.observation?.state.leases||{}).some(l=>l.status==='active'))reasons.push('Close the Glasshouse observation lease before bodily entry.');
  if(visible)try{passage(state,context,d.connections[0],'forward');}catch(error){reasons.push(error.message);}}
 if(id==='nested.return_frontier'){visible=visit?.endpoint.worldId===I.hub;if(location!==L.hub)reasons.push('Return to the service-street gate.');if(m)reasons.push('Settle or recover the accepted contract before leaving the hub.');if(visible)try{passage(state,context,d.connections[0],'reverse');}catch(error){reasons.push(error.message);}}
 if(moves[id]){visible=!!visit&&location===moves[id][0];}
 const offer=missionIdFrom(id,'nested.offer.'),accept=missionIdFrom(id,'nested.accept.');
 if(offer||accept){const def=missionDefinition(offer||accept);visible=!!def&&world===I.hub&&!!d&&offeredAllowed(d,def)&&state.actors.player.facts['nested.role']==='contractor';
  if(location!==L.hub)reasons.push('Meet Mara at the service street.');if(accept&&!d?.offers.some(o=>o.id===def.id))reasons.push('Hear this contract’s offer and full terms before accepting.');if((state.actors[I.issuer]?.resources['nested.credit']||0)<(def?.reward||0))reasons.push('Mara’s actual funds cannot reserve the offered reward.');}
 if(personalDestinations[id]){const destination=personalDestinations[id];visible=world===I.hub&&!!d&&!m&&settledVisit(state,destination)&&state.actors.player.facts['nested.role']==='contractor';
  if(location!==L.hub)reasons.push('Depart from the service-street gate.');
  if(visible)try{passage(state,context,d.connections[destination===I.salt?1:2],'forward');}catch(error){reasons.push(error.message);}
 }
 if(id==='nested.personal.return'){visible=!!d&&!m&&[I.salt,I.archive].includes(world)&&state.actors.player.facts['nested.personal.active']===true;
  if(location!==homeLocations[world])reasons.push('Return through this destination’s actual landing.');
  if(visible)try{passage(state,context,d.connections[world===I.salt?1:2],'reverse');}catch(error){reasons.push(error.message);}
 }
 if(id==='nested.mission.arrive'){visible=m?.stage==='accepted'&&world===I.hub;if(location!==L.hub)reasons.push('Depart from the service-street gate.');if(visible)try{passage(state,context,d.connections[missionDefinition(m.id).worldId===I.salt?1:2],'forward');}catch(error){reasons.push(error.message);}}
 if(id==='nested.mission.report'){visible=!!m&&['arrived','outcome'].includes(m.stage)&&!['breach','withdrawn'].includes(m.outcome);if(!context.facts['nested.mission.objectiveDone'])reasons.push('Perform and close a truthful local objective first.');}
 if(id==='nested.mission.withdraw'){visible=['accepted','arrived'].includes(m?.stage);}
 if(id==='nested.mission.extend'){visible=!!m&&['arrived','outcome','extracting'].includes(m.stage)&&m.outcome!=='breach'&&!m.extended;if((state.actors.player.resources['nested.credit']||0)<(m?missionDefinition(m.id).extensionCost:0))reasons.push('This optional extension needs its stated actual credit payment.');}
 if(id==='nested.mission.breach'){visible=!!m&&['arrived','outcome'].includes(m.stage)&&m.outcome!=='breach';}
 if(id==='nested.extraction.initiate'){visible=m?.stage==='outcome';if(location!==homeLocations[missionDefinition(m?.id)?.worldId])reasons.push('Reach this destination’s actual extraction landing.');}
 if(id==='nested.extraction.wait'){visible=m?.stage==='extracting'&&['initiated','recovered'].includes(m.extraction.phase);}
 if(id==='nested.extraction.recover'){visible=m?.stage==='extracting'&&m.extraction.phase==='interrupted';if((context.gameplay?.player?.inventory?.[K.rope]||0)<1)reasons.push('The one authored route repair consumes one owned rope. Local supplies remain accessible.');}
 if(id==='nested.extraction.arrive'){visible=m?.stage==='extracting'&&m.extraction.phase==='ready';if(location!==homeLocations[missionDefinition(m?.id)?.worldId])reasons.push('Return to the extraction landing.');if(visible)try{passage(state,context,d.connections[missionDefinition(m.id).worldId===I.salt?1:2],'reverse');}catch(error){reasons.push(error.message);}}
 if(id==='nested.mission.settle'){visible=m?.stage==='returned'&&world===I.hub;if(location!==L.hub)reasons.push('Settle with Mara at the service street.');}
 // Leaving cannot strand another resident's already reserved work.
 if((['nested.enter_hub','nested.return_frontier','nested.mission.arrive','nested.extraction.arrive','nested.personal.return'].includes(id)||personalDestinations[id])&&state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).some(a=>personIds.includes(a)&&state.actors[a].worldId===world)))reasons.push('Finish or cancel this local resident commitment before departure.');
 if(d&&visible){const additional=passageSlots(id);
  if(additional&&d.visits.length+additional>visitCapacity)reasons.push(...previewWorldVisitRoom(state,'nestedCampaign',visitRoomOptions(additional)).reasons);}
 const costs=id==='nested.mission.extend'&&m?[credit('player',-missionDefinition(m.id).extensionCost)]:id==='nested.extraction.recover'?[{type:'item',actor:'player',key:K.rope,amount:-1}]:[];
 return {visible,eligible:visible&&!reasons.length,reasons,costs,duration:id==='nested.extraction.wait'&&m?Math.max(0,m.extraction.dueAt-d.instances.find(i=>i.worldId===missionDefinition(m.id).worldId).clock.elapsed):0};
}
function basePlan(state,context){return {state:copy(state),external:copy(context.external||{}),gameplay:copy(context.gameplay||{}),gameplayBefore:copy(context.gameplay||{}),vitals:copy(context.vitals||{}),equipment:copy(context.equipment||{}),acquisitions:[],unlocks:[]};}
function apply(plan,effects,context,registry,id,spending=false){applySimulationEffects(plan,effects,{...context,actorId:'player',worldId:plan.state.actors.player.worldId},registry,`nested:${plan.state.sequence}:${id}`,{spending});}
function receipt(plan,id){const d=plan.state.nestedCampaign;if(d){d.receipts.push({id,at:plan.state.clock,sequence:plan.state.sequence});d.receipts=d.receipts.slice(-96);}}
function attachResidents(next,registry){for(const id of personIds){const d=registry.simulation.people.get(id);assert(d?.inventory==='native'&&d.provision===false&&!next.actors[id],'Bind the exact new native resident definition once.');next.actors[id]={...domain(),worldId:d.worldId,resources:copy(d.resources)};
 next.simulation.people[id]={life:'alive',inventory:'native',location:d.location,bornAt:next.clock,definitionId:id,definitionRevision:d.revision,body:copy(d.body),vitals:copy(d.vitals)};}
 for(const site of nestedDefinitions.sites)next.simulation.sites[site.id]||={capacity:site.capacity,reservations:{}};
 for(const controller of registry.simulation.controllers.values())if(personIds.includes(controller.actorId)&&auditRemainderControllerAllowed(next,controller)&&!next.simulation.controllers[controller.id])next.simulation.controllers[controller.id]={actorId:controller.actorId,due:next.clock+controller.interval,interval:controller.interval};
 for(const event of registry.simulation.events.values())if(event.id.startsWith('nested.')&&event.automatic&&!next.simulation.checks[event.id])next.simulation.checks[event.id]={due:next.clock+event.interval,interval:event.interval,rng:deriveSimulationSeed(next.simulation.seed,event.id),count:0};
}
function moveWorld(plan,worldId){const state=plan.state,d=state.nestedCampaign;syncNestedCampaignClock(state);const old=activeNestedVisit(state);
 if(worldId!=='base.frontier')requireVisitCapacity(d);
 if(old){const index=d.instances.findIndex(i=>i.id===old.instanceId),f=byWorld.get(old.endpoint.worldId),p=planWorldDeparture(d.instances[index],old,{playedAt:state.clock,visits:d.visits,expectedRevision:d.instances[index].revision},f.definition);assert(p.allowed,p.reasons.join(' '));d.instances[index]=p.nextInstance;d.visits=d.visits.map(v=>v.id===old.id?p.nextVisit:v);d.activeVisitId=null;}
 if(worldId!=='base.frontier'){const f=byWorld.get(worldId),instance=d.instances.find(i=>i.id===f.instanceId),v=createWorldVisit(instance,{id:`nested.visit.${state.sequence}`,actorId:'player',endpoint:f.endpoint,playedAt:state.clock},f.definition,{actorIds:Object.keys(state.actors),visits:d.visits});d.visits.push(v);d.activeVisitId=v.id;}
 state.actors.player.worldId=worldId;plan.nativeLocation=worldId==='base.frontier'?'Village':homeLocations[worldId];state.simulation.people.player.location=plan.nativeLocation;plan.nativePatch={...(plan.nativePatch||{}),'current location':plan.nativeLocation};
}
export function commitNestedCommand(state,registry,id,context,expectedSequence=state.sequence){assert(expectedSequence===state.sequence,'This nested campaign command is stale.');context=nestedContext(state,context);
 const q=previewNestedCommand(state,registry,id,context);assert(q.visible&&q.eligible,q.reasons.join(' ')||'This campaign command is unavailable.');
 if(id==='nested.chart'){const enrolled=state.simulation?basePlan(state,context):enrollSimulation(state,registry,context,expectedSequence);
  const plan=commitSimulationCommand(enrolled.state,registry,{id},{...context,external:enrolled.external,gameplay:enrolled.gameplay,vitals:enrolled.vitals},enrolled.state.sequence);plan.acquisitions=[...(enrolled.acquisitions||[]),...plan.acquisitions];plan.unlocks=[...(enrolled.unlocks||[]),...plan.unlocks];return plan;}
 if(id==='nested.cancel'){const job=state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('nested.'));return cancelSimulationJob(state,registry,job.id,context,expectedSequence);}
 if(standardIds.has(id)){const command=registry.simulation.commands.get(id),plan=commitSimulationCommand(state,registry,{id},{...context,targetId:command.targetId||null},expectedSequence);
  if(command.nestedStock)plan.nestedNativeRequests=[{...command.nestedStock,cause:id,expectedRevision:context.nestedNative.revision}];
  receipt(plan,id);validateNestedCampaignState(plan.state);return plan;}
 let plan=basePlan(state,context);++plan.state.sequence;syncNestedCampaignClock(plan.state);if(passageSlots(id))stageVisitRoom(plan.state,passageSlots(id));let d=plan.state.nestedCampaign,m=d?.mission;
 if(id==='nested.enroll'){
  for(const f of footprints){assert(!plan.state.worlds[f.worldId],'A different campaign already owns these worlds.');plan.state.worlds[f.worldId]={facts:copy(NESTED_INITIAL_FACTS[f.worldId]),resources:{},completed:{}};}
  attachResidents(plan.state,registry);plan.gameplay={...plan.gameplay,...copy(NESTED_NATIVE_PEOPLE)};plan.state.actors.player.resources['nested.credit']??=0;
  d=plan.state.nestedCampaign={schema:1,definitionRevision:1,initializedAt:state.clock,nativeRevision:0,bodyPolicy:'same_native_body',absence:'freeze',rolePolicy:'explicit_local_approval',
   instances:footprints.map(f=>createWorldInstance(f.definition,{id:f.instanceId,continuityId:f.continuityId,eraId:f.eraId,playedAt:state.clock,parentInstanceId:null,actorIds:personIds.filter(a=>plan.state.actors[a].worldId===f.worldId)})),visits:[],activeVisitId:null,
   connections:createNestedConnections().map(c=>({...c,open:true,openedAt:state.clock})),offers:[],mission:null,history:[],receipts:[]};
  apply(plan,registry.simulation.commands.get('nested.enroll_receipt').effects,context,registry,id);
  apply(plan,[{type:'source',actor:I.trainer,sourceId:I.method,operation:'grant',origin:'trained',awakened:true,active:true},{type:'power',actor:I.trainer,powerId:I.method,operation:'learn'}],context,registry,id);
  plan.nestedActivation=true;
 }else if(id==='nested.enter_hub'||id==='nested.return_frontier'){
  passage(state,context,d.connections[0],id==='nested.enter_hub'?'forward':'reverse');plan=stageNestedCarrierMove(plan,context,d.connections[0],id==='nested.enter_hub'?'forward':'reverse',draft=>moveWorld(draft,id==='nested.enter_hub'?I.hub:'base.frontier'));d=plan.state.nestedCampaign;m=d.mission;
  apply(plan,[knowledge('passage',id==='nested.enter_hub'?'Arrived in the service district in the same living native body with complete owned/equipped cargo. Local clocks resume; prior owners and histories remain.':'Returned to Village with the actual body and owned cargo. Hub/destination local decisions freeze during unsupported absence. Learned memory remains; local office rights and unsupported exotic powers were not exported.')],context,registry,id);
 }else if(personalDestinations[id]||id==='nested.personal.return'){
  const outbound=!!personalDestinations[id],destination=outbound?personalDestinations[id]:state.actors.player.worldId;
  plan.state.schema=(plan.state.auditRemainder||plan.state.causalStories||plan.state.motherOfLearning||plan.state.proto23Village)?11:plan.state.bookWorldCampaign?10:plan.state.referenceGameplay?9:8;plan.state.actors.player.facts['nested.personal.version']=1;
  if(outbound)plan.state.actors.player.facts['nested.personal.active']=true;
  const connection=d.connections[destination===I.salt?1:2];passage(state,context,connection,outbound?'forward':'reverse');
  plan=stageNestedCarrierMove(plan,context,connection,outbound?'forward':'reverse',draft=>moveWorld(draft,outbound?destination:I.hub));d=plan.state.nestedCampaign;m=d.mission;
  if(!outbound)plan.state.actors.player.facts['nested.personal.active']=false;
  apply(plan,[knowledge(`personal.${destination}.${outbound?'arrival':'return'}`,outbound?'Returned to this same retained destination on your own account after actual settled travel. This discretionary original passage creates no mission, issuer obligation, deadline, reserved reward or payout. The existing people, local rights, remaining stock and unresolved consequences remain.':'Returned to the hub in the same body with your owned cargo after a personal visit. No contract was issued or paid; prior mission settlements and the destination’s actual remaining owners and outcomes remain unchanged.')],context,registry,id);
 }else if(moves[id]){plan.nativeLocation=moves[id][1];plan.state.simulation.people.player.location=plan.nativeLocation;plan.nativePatch={'current location':plan.nativeLocation};
 }else if(id.startsWith('nested.offer.')){const def=missionDefinition(id.slice('nested.offer.'.length));if(!d.offers.some(o=>o.id===def.id))d.offers.push({id:def.id,at:state.clock,sequence:plan.state.sequence});
  apply(plan,[knowledge(`offer.${def.id}`,`${def.label}: ${def.objective} Offered reward ${def.reward} credits for issuer success, ${def.partialReward} for a truthful partial/local outcome, zero for breach. Acceptance reserves Mara’s actual funds. Actual hub arrival is due within ${def.deadline} minutes of destination residence after arrival; one optional extension ${def.extension} minutes costs ${def.extensionCost} credits. Early withdrawal keeps truthful partial work; withdrawal before departure refunds the issuer without a player award. Extraction preparation takes ${def.extraction} local minutes and ${def.interference?'the first unrepaired Saltworks route can be interrupted; one owned rope repairs that authored interruption':'has no authored interference here'}. Missing the return deadline forfeits the payout but keeps the authored recovery route. Reaching the hub and later settlement are separate; settlement pays once. These prototype terms create no resurrection or universal safe exit.`)],context,registry,id);
 }else if(id.startsWith('nested.accept.')){requireVisitCapacity(d,2);const def=missionDefinition(id.slice('nested.accept.'.length));apply(plan,[credit(I.issuer,-def.reward)],context,registry,id,true);
  d.mission={id:def.id,definitionRevision:1,stage:'accepted',acceptedAt:state.clock,arrivedAt:null,localDeadline:null,extended:false,reservedReward:def.reward,objective:false,issuerSuccess:false,welfare:'unknown',outcome:'pending',extraction:null,returnedAt:null,settledAt:null,reward:0};
  apply(plan,[knowledge(`accepted.${def.id}`,'Accepted this offered contract and reserved the issuer’s actual finite reward. No destination reset, arrival, objective or payout occurred.')],context,registry,id);
 }else if(id==='nested.mission.arrive'){requireVisitCapacity(d,2);const def=missionDefinition(m.id);passage(state,context,d.connections[def.worldId===I.salt?1:2],'forward');plan=stageNestedCarrierMove(plan,context,d.connections[def.worldId===I.salt?1:2],'forward',draft=>moveWorld(draft,def.worldId));d=plan.state.nestedCampaign;m=d.mission;
  m.stage='arrived';m.arrivedAt=state.clock;m.localDeadline=d.instances.find(i=>i.worldId===def.worldId).clock.elapsed+def.deadline;
  if(def.kind==='followup')plan.state.worlds[def.worldId].facts[def.worldId===I.salt?'nested.saltworks.visitedAgain':'nested.archive.visitedAgain']=false;
  apply(plan,[knowledge(`arrival.${def.id}`,'Arrived in the actual retained destination. Its existing people, stock, repaired apparatus and claims remain. The accepted local return deadline now starts from this arrival.')],context,registry,id);
 }else if(id==='nested.mission.withdraw'&&m.stage==='accepted'){
  apply(plan,[credit(I.issuer,m.reservedReward),knowledge(`withdrawn.${m.id}`,'Withdrew before departure. The issuer’s reserved credits returned to their purse. No destination, objective, extraction or player payout occurred; you may accept a later offer without resetting the destination.')],context,registry,id);d.mission=null;
 }else if(id==='nested.mission.report'||id==='nested.mission.withdraw'||id==='nested.mission.breach'){const outcome=localOutcome(plan.state,missionDefinition(m.id));m.stage='outcome';m.objective=outcome.objective;m.issuerSuccess=outcome.issuerSuccess;m.welfare=outcome.welfare;
  m.outcome=id==='nested.mission.breach'?'breach':id==='nested.mission.withdraw'?'withdrawn':outcome.issuerSuccess?'complete':'partial';if(m.outcome==='breach')m.issuerSuccess=false;
  apply(plan,[knowledge(`outcome.${m.id}`,`Recorded ${m.outcome}; issuer success ${m.issuerSuccess}; actual local aftermath ${m.welfare}. This report starts no payout or teleport. Extraction and hub settlement remain separate.`)],context,registry,id);
 }else if(id==='nested.mission.extend'){const def=missionDefinition(m.id);apply(plan,[credit('player',-def.extensionCost)],context,registry,id,true);apply(plan,[credit(I.issuer,def.extensionCost)],context,registry,id);m.localDeadline+=def.extension;m.extended=true;
  apply(plan,[knowledge(`extension.${m.id}`,`Negotiated one actual ${def.extension}-minute local extension for ${def.extensionCost} credits. It changes the return commitment; it does not complete the objective or guarantee transit.`)],context,registry,id);
 }else if(id==='nested.extraction.initiate'){const def=missionDefinition(m.id),elapsed=d.instances.find(i=>i.worldId===def.worldId).clock.elapsed;
  m.stage='extracting';m.extraction={id:`${m.id}.extraction`,phase:'initiated',startedAt:elapsed,dueAt:elapsed+def.extraction,interference:def.interference&&!plan.state.worlds[I.salt].facts['nested.saltworks.repaired'],recoveredAt:null,arrivalSequence:null};
  apply(plan,[knowledge(`extraction.${m.id}`,'Extraction was initiated, with actual local transit preparation still due. The destination body remains here until the route is ready and current cargo/body eligibility is checked at hub arrival.')],context,registry,id);
 }else if(id==='nested.extraction.wait'){plan.nestedAdvanceBy=q.duration;plan.nestedAdvanceReason='extraction';
 }else if(id==='nested.extraction.recover'){const elapsed=d.instances.find(i=>i.worldId===missionDefinition(m.id).worldId).clock.elapsed;apply(plan,[{type:'item',actor:'player',key:K.rope,amount:-1}],context,registry,id,true);
  m.extraction.phase='recovered';m.extraction.recoveredAt=elapsed;m.extraction.dueAt=elapsed+2;
  apply(plan,[knowledge(`recovery.${m.id}`,'Used one owned rope to repair this specific interrupted route. Two more played local minutes are required. This successful recovery creates no universal safe-exit law.')],context,registry,id);
 }else if(id==='nested.extraction.arrive'){plan=prepareNestedArrival(plan,registry,context);d=plan.state.nestedCampaign;m=d.mission;
 }else if(id==='nested.mission.settle'){const def=missionDefinition(m.id),outcome=m.outcome;
  const reward=outcome==='complete'?def.reward:outcome==='breach'?0:(m.objective||plan.state.worlds[def.worldId].facts[def.worldId===I.salt?'nested.saltworks.inspected':'nested.archive.inspected'])?def.partialReward:0;
  apply(plan,[credit('player',reward),credit(I.issuer,m.reservedReward-reward)],context,registry,id);m.stage='settled';m.reward=reward;m.settledAt=state.clock;
  if(!m.issuerSuccess&&m.objective)plan.state.worlds[I.hub].facts['nested.hub.returnDispute']=true;
  apply(plan,[knowledge(`settled.${m.id}`,`Settled ${reward} credits from the reserved ${m.reservedReward}. ${m.reservedReward-reward} returned to Mara’s finite purse. Local aftermath ${m.welfare} remains; no native coins, XP, kill-source award or second identity payout was created.`)],context,registry,id);
  d.history.push(copy(m));d.mission=null;
 }
 receipt(plan,id);validateNestedCampaignState(plan.state);return plan;
}
// Exact optional joined-time arrival seam. The caller supplies live native
// owners after advancing through existing global services, then publishes once.
export function prepareNestedArrival(plan,registry,context){const state=plan.state;syncNestedCampaignClock(state);stageVisitRoom(state);const d=state.nestedCampaign,m=d?.mission;
 assert(m?.stage==='extracting'&&m.extraction.phase==='ready','The actual extraction is not ready for hub arrival.');
 requireVisitCapacity(d);
 assert((context.facts?.location||state.simulation.people.player.location)===homeLocations[missionDefinition(m.id).worldId],'Use the actual local extraction landing.');
 passage(state,{...nestedContext(state,context),nestedNative:context.nestedNative},d.connections[missionDefinition(m.id).worldId===I.salt?1:2],'reverse');
 const actual=localOutcome(state,missionDefinition(m.id));m.objective=actual.objective;m.issuerSuccess=m.outcome==='breach'?false:actual.issuerSuccess;m.welfare=actual.welfare;
 if(['complete','partial'].includes(m.outcome))m.outcome=actual.issuerSuccess&&actual.objective?'complete':'partial';
 plan=stageNestedCarrierMove(plan,context,d.connections[missionDefinition(m.id).worldId===I.salt?1:2],'reverse',draft=>moveWorld(draft,I.hub));
 const returned=plan.state.nestedCampaign.mission;returned.stage='returned';returned.returnedAt=plan.state.clock;returned.extraction.phase='arrived';returned.extraction.arrivalSequence=plan.state.sequence;
 apply(plan,[knowledge(`returned.${m.id}`,'Arrived back in the actual lived hub with the same body and complete owned cargo. The destination’s changed people and supplies remain. The contract still awaits its sole settlement owner.')],context,registry,'extraction.arrive');return plan;
}
export function nestedPresentation(state,registry,context){const d=state.nestedCampaign,visit=activeNestedVisit(state),m=d?.mission,def=m&&missionDefinition(m.id),location=context.facts?.location||state.simulation?.people.player?.location;
 const visible=!!d||!!state.simulation?.knowledge.player?.['nested.chart']||location==='Village'&&context.facts?.['village.elderMet'];
 return {visible,label:visit?footprints.find(f=>f.worldId===visit.endpoint.worldId).definition.label:'Service-district side entry',inside:!!visit,role:state.actors.player.facts['nested.role']||'unapproved',credits:state.actors.player.resources['nested.credit']||0,
  description:!d?'The optional original side-entry branch carries your existing living body and owned cargo. Read and approve its terms explicitly.':visit?'Resident work, actual shops and learned methods share the joined played clock. Only the place containing your actual body advances locally; absent instances keep their people, stock, claims and history.':'The same hub and destinations wait. Their unsupported absence time is frozen.',
  provenance:'Qualified supplied English MTL PR01–PR08 service-district distinctions; all residents, destinations, dialogue and numbers here are original prototype additions.',
  clocks:d?d.instances.map(i=>({worldId:i.worldId,instanceId:i.id,elapsed:i.clock.elapsed,active:visit?.instanceId===i.id,absence:i.clock.absence})):[],
  mission:m?{id:m.id,label:def.label,stage:m.stage,outcome:m.outcome,issuerSuccess:m.issuerSuccess,welfare:m.welfare,terms:def,remaining:m.localDeadline===null?null:Math.max(0,m.localDeadline-d.instances.find(i=>i.worldId===def.worldId).clock.elapsed),extraction:copy(m.extraction)}:null,
  history:copy(d?.history||[]),stock:visit?Object.fromEntries(Object.entries(context.nestedNative?.stock||{}).filter(([owner])=>visit.endpoint.worldId===I.hub?[I.hubStock,I.hubShop].includes(owner):visit.endpoint.worldId===I.salt?[I.saltStock,I.saltShop].includes(owner):[I.archiveStock,I.archiveShop].includes(owner))):{},records:Object.entries(state.simulation?.knowledge.player||{}).filter(([k])=>k.startsWith('nested.')).map(([key,v])=>({key,text:v.value,at:v.at})),
  actions:nestedActions.map(a=>({...a,...previewNestedCommand(state,registry,a.id,context)}))};
}
