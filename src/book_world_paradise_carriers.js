// Transient conservation guard over the actual nested/native owners. No store,
// passage engine, reward manager, wall timer or independent calendar is added.
import {PARADISE_FOOTPRINTS,PARADISE_IDS,paradiseDefinitions} from './book_world_paradise_content.js';
import {paradiseCalendarAt,paradiseQuestProjection} from './book_world_paradise_native.js';
import {carrierTransitContext,buildCarrierTransitSnapshot,previewCarrierTransit,stageCarrierTransit,stageCarrierClock,validateCarrierTransitRecord,summarizeCarrierTransitIntent,carrierTransitView} from './backlog_expansion_transit.js';
const copy=x=>structuredClone(x),check=(ok,text)=>{if(!ok)throw Error(text);};
const frontier={worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'};
const qualification={kind:'original_prototype',evidenceIds:[]};
const kinds=['body','cargo','memory','method','source','fuel','office','credential','duty','debt','curse','observer','ally'];
const clockId=id=>`book.paradise.clock.${id}`;
export function paradiseCarrierContext(state,context,connection=null) {
 const d=state.bookWorldCampaign;check(d&&context.paradiseNative?.bound,'Bind the actual optional campaign and native owners.');
 const visit=d.visits.find(v=>v.id===d.activeVisitId&&v.status==='active'),endpoint=visit?.endpoint||frontier;
 const location=state.simulation.people.player.location,revision=state.sequence+1,nativeOwners=[];
 const owner=(id,value,extra={})=>{check(value!==undefined,`Missing actual native owner ${id}.`);nativeOwners.push({id,revision,value:copy(value),...extra});};
 const worlds=PARADISE_FOOTPRINTS.map(f=>{
  const instance=d.instances.find(i=>i.id===f.instanceId),ids=[];
  for(const person of paradiseDefinitions.people.filter(p=>p.worldId===f.worldId)){
   const id=`native.person.${person.id}`;ids.push(id);owner(id,{gameplay:context.gameplay[person.id],equipment:context.equipment[person.id]||{},vitals:context.vitals[person.id]||state.simulation.people[person.id].vitals});
  }
  for(const id of [f.native.stockOwner,f.native.shopOwner]){ids.push(id);owner(id,context.paradiseNative.stock[id]);}
  const quest=f.native.questId;ids.push(quest);owner(quest,paradiseQuestProjection(state,f.worldId));
  const calendar=`native.calendar.${f.instanceId}`;ids.push(calendar);owner(calendar,paradiseCalendarAt(instance.clock.elapsed),{kind:'calendar',clockId:clockId(f.instanceId)});
  for(const [id,value] of Object.entries(context.paradiseLocationOwners||{}))if(value.worldId===f.worldId){ids.push(id);owner(id,value);}
  return {definition:f.definition,instance,visits:d.visits.filter(v=>v.instanceId===f.instanceId),nativeOwnerIds:ids};
 });
 owner('native.frontier.village',context.frontierLocationOwner);
 const mission=d.mission,definition={worldId:PARADISE_IDS.goa,issuerId:PARADISE_IDS.employee};
 const applicableMission=mission&&['accepted','arrived','outcome','extracting'].includes(mission.stage)&&(!connection||[connection.from,connection.to].some(e=>e.worldId===definition.worldId))?mission:null;
 const clocks=[{id:'book.paradise.clock.native',kind:'native',revision,value:{elapsed:state.clock,observedAt:state.clock,unit:'played_minutes',absence:'freeze'},policy:{id:'book.paradise.clock.common',revision:1,mode:'common',rate:{numerator:1,denominator:1},qualification}},
  ...worlds.map(w=>({id:clockId(w.instance.id),kind:w.instance.worldId===PARADISE_IDS.hub?'hub':'local',revision:w.instance.revision,instanceId:w.instance.id,value:w.instance.clock,
   policy:{id:`${clockId(w.instance.id)}.presence`,revision:1,mode:'presence',rate:{numerator:1,denominator:1},qualification}}))];
 const deadlines=[];
 if(mission?.localDeadline!=null&&mission.outcome!=='breach'&&!['returned','settled'].includes(mission.stage))deadlines.push({id:`${mission.id}.return`,clockId:clockId(PARADISE_FOOTPRINTS.find(f=>f.worldId===definition.worldId).instanceId),at:mission.localDeadline+1,kind:'return'});
 if(mission?.extraction&&['initiated'].includes(mission.extraction.phase))deadlines.push({id:`${mission.id}.extraction`,clockId:clockId(PARADISE_FOOTPRINTS.find(f=>f.worldId===definition.worldId).instanceId),at:mission.extraction.dueAt,kind:'extraction'});
 const policies=d.connections.flatMap(c=>['forward','reverse'].map(direction=>({id:`${c.id}.${direction}.retained`,revision:1,from:direction==='forward'?c.from:c.to,to:direction==='forward'?c.to:c.from,qualification,
  carriers:Object.fromEntries(kinds.map(kind=>[kind,{passage:'retain',use:['method','source','fuel','office','credential','duty','curse','ally'].includes(kind)?'unavailable':'none'}]))})));
 const body={id:context.paradiseNative.body.id,revision,ownerId:'player',controllerId:'player',form:context.paradiseNative.body.form};
 const observed=Object.entries(state.simulation.knowledge.player||{}).filter(([key])=>key==='book.paradise.chart'||key.startsWith('book.paradise.passage')||key.startsWith('book.paradise.arrival')||key.startsWith('book.paradise.return'));
 const bindings=context.paradiseNative.endpointBindings.map(b=>({...copy(b),positions:b.positions.map(p=>({...p,free:!context.busy&&state.simulation.people.player.life==='alive'}))}));
 return carrierTransitContext(state,{...context,actorId:'player',worldId:state.actors.player.worldId,facts:{...context.facts,location}},
  {schema:1,revision,actorId:'player',body,endpoint,nativeLocation:location,connection,
   routeContext:connection?{actorId:'player',sequence:state.sequence,clock:state.clock,endpoint,life:state.simulation.people.player.life,body,busy:!!context.busy,
    knownConnectionIds:d.connections.map(c=>c.id),sources:[],methodIds:[],authorityIds:[],anchors:[],resources:[],bindings,
    evidence:observed.map(([id,r])=>({id,at:r.at,text:r.value,kind:['recollection','observation','report','inference','instruction'].includes(r.basis?.kind)?r.basis.kind:'recollection',recipientId:'player',connectionId:connection.id}))}:null,
   mission:applicableMission?{id:mission.id,revision,actorId:'player',issuerId:definition.issuerId,destination:PARADISE_FOOTPRINTS.find(f=>f.worldId===definition.worldId).endpoint,
    status:mission.stage==='arrived'||mission.stage==='outcome'?'active':mission.stage==='extracting'?'extracting':mission.stage}:null,
   worlds,externalEndpoints:[{endpoint:frontier,revision,nativeLocation:'Village',nativeOwnerIds:['native.frontier.village']}],nativeOwners,carrierOwners:[],policies,clocks,deadlines,permissions:[],consents:[]});
}
function request(state,context,connection,direction){const snapshot=buildCarrierTransitSnapshot(state,context);return {expectedSequence:snapshot.sequence,expectedRevision:snapshot.revision,expectedBinding:snapshot.binding,direction,
 purposeId:'native.book.paradise.physical_passage',policyId:`${connection.id}.${direction}.retained`,missionId:context.carrierTransit.mission?.id||null};}
export function previewParadiseCarriers(state,context,connection,direction){const ctx=paradiseCarrierContext(state,context,connection);return previewCarrierTransit(state,ctx,request(state,ctx,connection,direction));}
export function stageParadiseCarrierMove(plan,context,connection,direction,bareMove){
 const ctx=paradiseCarrierContext(plan.state,context,connection),packet=request(plan.state,ctx,connection,direction);
 const out=stageCarrierTransit(plan,ctx,packet,{stageNativePassage:draft=>{bareMove(draft);return draft;},readContext:draft=>paradiseCarrierContext(draft.state,{...context,gameplay:draft.gameplay,vitals:draft.vitals||context.vitals,equipment:draft.equipment||context.equipment},connection)});
 validateCarrierTransitRecord(out.carrierTransitIntent);out.paradiseCarrierTransitIntent=out.carrierTransitIntent;delete out.carrierTransitIntent;return out;
}
export function stageParadiseCarrierClock(plan,context,minutes,advancePlan,syncClocks){
 const ctx=paradiseCarrierContext(plan.state,context),s=buildCarrierTransitSnapshot(plan.state,ctx),active=ctx.carrierTransit.clocks.find(c=>c.instanceId===plan.state.bookWorldCampaign.visits.find(v=>v.id===plan.state.bookWorldCampaign.activeVisitId)?.instanceId);
 const boundary=Math.min(...ctx.carrierTransit.deadlines.filter(d=>d.clockId===active?.id).map(d=>Math.max(0,d.at-active.value.elapsed)));
 const amount=Math.min(minutes,boundary);check(Number.isSafeInteger(amount)&&amount>0,'Reconcile the current extraction or return boundary first.');
 const out=stageCarrierClock(plan,ctx,{expectedSequence:s.sequence,expectedRevision:s.revision,expectedBinding:s.binding,minutes:amount,offline:false},
  {advancePlan,syncClocks:draft=>{syncClocks(draft.state);return draft;},readContext:draft=>paradiseCarrierContext(draft.state,{...context,gameplay:draft.gameplay,vitals:Object.fromEntries(Object.entries(context.vitals).map(([id,v])=>[id,id==='player'&&draft.native?{...v,health:draft.native.hpToFull==null?v.health:v.max_health-draft.native.hpToFull,stamina:v.max_stamina-draft.native.staminaToFull}:draft.state.simulation.people[id]?.vitals||v])),equipment:draft.equipment||context.equipment})});
 validateCarrierTransitRecord(out.carrierClockIntent);out.paradiseCarrierClockIntent=out.carrierClockIntent;delete out.carrierClockIntent;return out;
}
export function paradiseCarrierKnowledge(state,context,connection,direction='forward'){
 const ctx=paradiseCarrierContext(state,context,connection);return carrierTransitView(state,ctx,request(state,ctx,connection,direction));
}
// Full seals remain transient. Only a compact identity is appended to the
// already-owned bounded receipt format before one normal durable publication.
export function retainParadiseCarrierReceipt(plan){
 for(const key of ['paradiseCarrierTransitIntent','paradiseCarrierClockIntent'])if(plan[key]){
  validateCarrierTransitRecord(plan[key]);const summary=summarizeCarrierTransitIntent(plan[key]);
  plan.state.bookWorldCampaign.receipts.push({id:`book.paradise.carrier.${summary.kind}.${plan.state.sequence}`,at:plan.state.clock,sequence:plan.state.sequence});
  plan.state.bookWorldCampaign.receipts=plan.state.bookWorldCampaign.receipts.slice(-96);delete plan[key];
 }
 return plan;
}
