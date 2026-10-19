// Transient conservation guard over the actual nested/native owners. No store,
// passage engine, reward manager, wall timer or independent calendar is added.
import {check, copy} from './basics.js';
import {NESTED_FOOTPRINTS,NESTED_IDS,NESTED_MISSIONS,nestedDefinitions} from './feature_expansion_nested_content.js';
import {nestedCalendarAt,nestedQuestProjection} from './feature_expansion_nested_native.js';
import {carrierTransitContext,buildCarrierTransitSnapshot,previewCarrierTransit,stageCarrierTransit,stageCarrierClock,validateCarrierTransitRecord,summarizeCarrierTransitIntent,carrierTransitView} from './backlog_expansion_transit.js';
const frontier={worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'};
const qualification={kind:'original_prototype',evidenceIds:[]};
const kinds=['body','cargo','memory','method','source','fuel','office','credential','duty','debt','curse','observer','ally'];
const clockId=id=>`nested.clock.${id}`;
export function nestedCarrierContext(state,context,connection=null) {
 const d=state.nestedCampaign;check(d&&context.nestedNative?.bound,'Bind the actual optional campaign and native owners.');
 const visit=d.visits.find(v=>v.id===d.activeVisitId&&v.status==='active'),endpoint=visit?.endpoint||frontier;
 const location=state.simulation.people.player.location,revision=state.sequence+1,nativeOwners=[];
 const owner=(id,value,extra={})=>{check(value!==undefined,`Missing actual native owner ${id}.`);nativeOwners.push({id,revision,value:copy(value),...extra});};
 const worlds=NESTED_FOOTPRINTS.map(f=>{
  const instance=d.instances.find(i=>i.id===f.instanceId),ids=[];
  for(const person of nestedDefinitions.people.filter(p=>p.worldId===f.worldId)){
   const id=`native.person.${person.id}`;ids.push(id);owner(id,{gameplay:context.gameplay[person.id],equipment:context.equipment[person.id]||{},vitals:context.vitals[person.id]||state.simulation.people[person.id].vitals});
  }
  const prefix=f.worldId===NESTED_IDS.hub?'hub':f.worldId===NESTED_IDS.salt?'salt':'archive';
  for(const id of [NESTED_IDS[`${prefix}Stock`],NESTED_IDS[`${prefix}Shop`]]){ids.push(id);owner(id,context.nestedNative.stock[id]);}
  const quest=NESTED_IDS[`${prefix}Quest`];ids.push(quest);owner(quest,nestedQuestProjection(state,f.worldId));
  const calendar=`native.calendar.${f.instanceId}`;ids.push(calendar);owner(calendar,nestedCalendarAt(instance.clock.elapsed),{kind:'calendar',clockId:clockId(f.instanceId)});
  for(const [id,value] of Object.entries(context.nestedLocationOwners||{}))if(value.worldId===f.worldId){ids.push(id);owner(id,value);}
  return {definition:f.definition,instance,visits:d.visits.filter(v=>v.instanceId===f.instanceId),nativeOwnerIds:ids};
 });
 owner('native.frontier.village',context.frontierLocationOwner);
 const mission=d.mission,definition=NESTED_MISSIONS.find(m=>m.id===mission?.id);
 const applicableMission=mission&&['accepted','arrived','outcome','extracting'].includes(mission.stage)&&(!connection||[connection.from,connection.to].some(e=>e.worldId===definition.worldId))?mission:null;
 const clocks=[{id:'nested.clock.native',kind:'native',revision,value:{elapsed:state.clock,observedAt:state.clock,unit:'played_minutes',absence:'freeze'},policy:{id:'nested.clock.common',revision:1,mode:'common',rate:{numerator:1,denominator:1},qualification}},
  ...worlds.map(w=>({id:clockId(w.instance.id),kind:w.instance.worldId===NESTED_IDS.hub?'hub':'local',revision:w.instance.revision,instanceId:w.instance.id,value:w.instance.clock,
   policy:{id:`${clockId(w.instance.id)}.presence`,revision:1,mode:'presence',rate:{numerator:1,denominator:1},qualification}}))];
 const deadlines=[];
 if(mission?.localDeadline!=null&&mission.outcome!=='breach'&&!['returned','settled'].includes(mission.stage))deadlines.push({id:`${mission.id}.return`,clockId:clockId(NESTED_FOOTPRINTS.find(f=>f.worldId===definition.worldId).instanceId),at:mission.localDeadline+1,kind:'return'});
 if(mission?.extraction&&['initiated','recovered'].includes(mission.extraction.phase))deadlines.push({id:mission.extraction.id,clockId:clockId(NESTED_FOOTPRINTS.find(f=>f.worldId===definition.worldId).instanceId),at:mission.extraction.dueAt,kind:'extraction'});
 const policies=d.connections.flatMap(c=>['forward','reverse'].map(direction=>({id:`${c.id}.${direction}.retained`,revision:1,from:direction==='forward'?c.from:c.to,to:direction==='forward'?c.to:c.from,qualification,
  carriers:Object.fromEntries(kinds.map(kind=>[kind,{passage:'retain',use:['method','source','fuel','office','credential','duty','curse','ally'].includes(kind)?'unavailable':'none'}]))})));
 const body={id:context.nestedNative.body.id,revision,ownerId:'player',controllerId:'player',form:context.nestedNative.body.form};
 const observed=Object.entries(state.simulation.knowledge.player||{}).filter(([key])=>key==='nested.chart'||key.startsWith('nested.passage')||key.startsWith('nested.arrival.')||key.startsWith('nested.returned.'));
 const bindings=context.nestedNative.endpointBindings.map(b=>({...copy(b),positions:b.positions.map(p=>({...p,free:!context.busy&&state.simulation.people.player.life==='alive'}))}));
 return carrierTransitContext(state,{...context,actorId:'player',worldId:state.actors.player.worldId,facts:{...context.facts,location}},
  {schema:1,revision,actorId:'player',body,endpoint,nativeLocation:location,connection,
   routeContext:connection?{actorId:'player',sequence:state.sequence,clock:state.clock,endpoint,life:state.simulation.people.player.life,body,busy:!!context.busy,
    knownConnectionIds:d.connections.map(c=>c.id),sources:[],methodIds:[],authorityIds:[],anchors:[],resources:[],bindings,
    evidence:observed.map(([id,r])=>({id,at:r.at,text:r.value,kind:['recollection','observation','report','inference','instruction'].includes(r.basis?.kind)?r.basis.kind:'recollection',recipientId:'player',connectionId:connection.id}))}:null,
   mission:applicableMission?{id:mission.id,revision,actorId:'player',issuerId:definition.issuerId,destination:NESTED_FOOTPRINTS.find(f=>f.worldId===definition.worldId).endpoint,
    status:mission.stage==='arrived'||mission.stage==='outcome'?'active':mission.stage==='extracting'?'extracting':mission.stage}:null,
   worlds,externalEndpoints:[{endpoint:frontier,revision,nativeLocation:'Village',nativeOwnerIds:['native.frontier.village']}],nativeOwners,carrierOwners:[],policies,clocks,deadlines,permissions:[],consents:[]});
}
function request(state,context,connection,direction){const snapshot=buildCarrierTransitSnapshot(state,context);return {expectedSequence:snapshot.sequence,expectedRevision:snapshot.revision,expectedBinding:snapshot.binding,direction,
 purposeId:'native.nested.physical_passage',policyId:`${connection.id}.${direction}.retained`,missionId:context.carrierTransit.mission?.id||null};}
export function previewNestedCarriers(state,context,connection,direction){const ctx=nestedCarrierContext(state,context,connection);return previewCarrierTransit(state,ctx,request(state,ctx,connection,direction));}
export function stageNestedCarrierMove(plan,context,connection,direction,bareMove){
 const ctx=nestedCarrierContext(plan.state,context,connection),packet=request(plan.state,ctx,connection,direction);
 const out=stageCarrierTransit(plan,ctx,packet,{stageNativePassage:draft=>{bareMove(draft);return draft;},readContext:draft=>nestedCarrierContext(draft.state,{...context,gameplay:draft.gameplay,vitals:draft.vitals||context.vitals,equipment:draft.equipment||context.equipment},connection)});
 validateCarrierTransitRecord(out.carrierTransitIntent);return out;
}
export function stageNestedCarrierClock(plan,context,minutes,advancePlan,syncClocks){
 const ctx=nestedCarrierContext(plan.state,context),s=buildCarrierTransitSnapshot(plan.state,ctx),active=ctx.carrierTransit.clocks.find(c=>c.instanceId===plan.state.nestedCampaign.visits.find(v=>v.id===plan.state.nestedCampaign.activeVisitId)?.instanceId);
 const boundary=Math.min(...ctx.carrierTransit.deadlines.filter(d=>d.clockId===active?.id).map(d=>Math.max(0,d.at-active.value.elapsed)));
 const amount=Math.min(minutes,boundary);check(Number.isSafeInteger(amount)&&amount>0,'Reconcile the current extraction or return boundary first.');
 const out=stageCarrierClock(plan,ctx,{expectedSequence:s.sequence,expectedRevision:s.revision,expectedBinding:s.binding,minutes:amount,offline:false},
  {advancePlan,syncClocks:draft=>{syncClocks(draft.state);return draft;},readContext:draft=>nestedCarrierContext(draft.state,{...context,gameplay:draft.gameplay,vitals:Object.fromEntries(Object.entries(context.vitals).map(([id,v])=>[id,id==='player'&&draft.native?{...v,health:draft.native.hpToFull==null?v.health:v.max_health-draft.native.hpToFull,stamina:v.max_stamina-draft.native.staminaToFull}:draft.state.simulation.people[id]?.vitals||v])),equipment:draft.equipment||context.equipment})});
 validateCarrierTransitRecord(out.carrierClockIntent);return out;
}
export function nestedCarrierKnowledge(state,context,connection,direction='forward'){
 const ctx=nestedCarrierContext(state,context,connection);return carrierTransitView(state,ctx,request(state,ctx,connection,direction));
}
// Full seals remain transient. Only a compact identity is appended to the
// already-owned bounded receipt format before one normal durable publication.
export function retainNestedCarrierReceipt(plan){
 for(const key of ['carrierTransitIntent','carrierClockIntent'])if(plan[key]){
  validateCarrierTransitRecord(plan[key]);const summary=summarizeCarrierTransitIntent(plan[key]);
  plan.state.nestedCampaign.receipts.push({id:`nested.carrier.${summary.kind}.${plan.state.sequence}`,at:plan.state.clock,sequence:plan.state.sequence});
  plan.state.nestedCampaign.receipts=plan.state.nestedCampaign.receipts.slice(-96);delete plan[key];
 }
 return plan;
}
