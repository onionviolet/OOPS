import {createPocketDoorConnection} from './pocket_realm_rules.js';
import {exchangeContext} from './exchange.js';
import {buildNativePocketCargo,previewNativeRealmTraveler} from './native_realm_traveler.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob,simulationOccupiesActor} from './simulation.js';
import {validateExpansionState} from './expansion_engine.js';
import {FOLDED_GLASSHOUSE_IDS as ids} from './pocket_realm_content.js';
import {createWorldInstance,createWorldVisit,planWorldDeparture,planWorldInstanceUpdate,worldInstanceView} from './world_instances.js';
import {planRealmOpening,planRealmClosure,previewRealmPassage} from './realm_connections.js';
import {GLASSHOUSE_CONTENT as content,GLASSHOUSE_DEFINITION as definition,GLASSHOUSE_SCENES as scenes,activeRealmVisit,realmFacts,syncRealmClock,validateRealmState} from './realm_state.js';
import {activePractice} from './techniques.js';
import {waitingSimulationChoice} from './simulation.js';
import {bodyFacts} from './body_progression.js';
import {pocketObservationDefinitions,pocketObservationActions,pocketObservationContext,previewPocketObservationAction,commitPocketObservationAction,pocketObservationView} from './pocket_observation.js';
import {openRealmObservationClock,closeRealmObservationClock} from './realm_state.js';
export const POCKET_LOCATION='Folded Glasshouse';
const clone=x=>structuredClone(x),assert=(ok,message)=>{if(!ok)throw Error(message);};
const eq=(fact,value=true)=>({fact,op:'eq',value});
const prefix=content.bindings.worldFactPrefix,commandId=name=>`${prefix}.${name}`,leadId=commandId('lead');
const rootCommand=(id,label,worldId,location,costs=[],effects=[])=>({id,revision:1,label,actorId:'player',worldId,location,group:'glasshouse',costs,effects});
const know=(key,value)=>({type:'knowledge',actor:'player',key:`${prefix}.${key}`,stage:'seen',value});
const definitions=clone(content.simulation);

const selectedSceneNames=new Set(['welcome','paid_work','return','refuse','leave_terms','damp_trial','sound_trial','cooperative_trial','shelf','private_research','offer_research','hear_research']);
for(const original of scenes.simulation.commands)if(selectedSceneNames.has(original.id.split('.').at(-1))){const d=clone(original);d.group='glasshouse';if(d.actorId==='player')d.visibleWhen={all:[eq(`knowledge.${prefix}.meeting.seen`),...(d.visibleWhen?[d.visibleWhen]:[])]};
 if(d.actorId===content.caretakerId){delete d.group;if(d.id.endsWith('.private_research'))d.requires.all.push(eq(`world.${prefix}.scenes.shelfBuilt`));}
 definitions.commands.push(d);}
for(const controller of definitions.controllers)for(const action of controller.actions){const command=definitions.commands.find(d=>d.id===action.commandId);if(command?.targetId&&!action.targetId)action.targetId=command.targetId;}
definitions.controllers.push(...scenes.simulation.controllers.map(d=>({...clone(d),actions:d.actions.filter(a=>a.commandId.endsWith('.private_research')||a.commandId.endsWith('.offer_research'))})));
delete definitions.commands.find(d=>d.id===commandId('export_template')).claim;
// The canonical gift claim lives only in the world instance.
// Use the instance's played clock for this resident's decision, not absence.
const replaceClock=rule=>{if(!rule||typeof rule!=='object')return; if(rule.fact===`situation.${content.situationId}.responseOpen`){rule.fact='glasshouse.offerExpired';rule.value=true;}for(const value of Object.values(rule))if(typeof value==='object')Array.isArray(value)?value.forEach(replaceClock):replaceClock(value);};
for(const d of definitions.commands){d.group=d.actorId==='player'?'glasshouse':undefined;if(d.group===undefined)delete d.group;if(d.actorId===content.caretakerId)replaceClock(d.requires);}
definitions.commands.find(d=>d.id===leadId).effects.find(e=>e.type==='knowledge').basis.situationId='exchange.parcel';
definitions.commands.find(d=>d.id===commandId('repair_step')).requires.all.push(eq('faculty.field.load_step.active'));
const meeting=definitions.commands.find(d=>d.id===commandId('meet'));
meeting.effects.find(e=>e.type==='knowledge'&&e.key===`${prefix}.meeting`).value='Joss has six logs, three kits and one template. The dry corner is usable; the loose frame keeps the bench shut. You can help, decline or leave. Joss waits eight minutes spent here before using personal supplies.';
definitions.commands.push(
 rootCommand('pocket.open_payment','Open the folded doorway · 1 wooden coin','base.frontier','Village',[{type:'resource',key:'money',amount:-1,native:true}],[know('door','You paid for one opening of the folded doorway. The same interior remains when its route is closed.')]),
 rootCommand('pocket.enter_receipt','Enter the folded doorway','base.frontier','Village',[],[know('entered','You carried your own body and belongings into the Folded Glasshouse. The doorway remains available for return.')]),
 rootCommand('pocket.exit_receipt','Return through the folded doorway',ids.worldId,'Folded Glasshouse',[],[know('returned','You returned with the same carried inventory. Joss, the bench, stored supplies and prior work remain in the Glasshouse.')]),
 rootCommand('pocket.close_receipt','Close the folded doorway','base.frontier','Village',[],[know('closed','You closed access to the Glasshouse. Its interior and possessions remain; no current view of Joss arrives through a closed route.')]),
 {...rootCommand('pocket.fund_bench','Contribute to Joss’s bench fund · 1 wooden coin',ids.worldId,'Folded Glasshouse',[{type:'resource',native:true,key:'money',amount:-1}],[{type:'resource',actor:content.caretakerId,key:'coins',amount:1},know('contribution','You transferred one real wooden coin to Joss’s bench fund. It is a contribution, not a purchase of the remaining stock or faculty.')]),targetId:content.caretakerId,coLocated:true,visibleWhen:eq(`world.${prefix}.scenes.shelfBuilt`),requires:{all:[eq('worldVisit.instanceId',ids.instanceId),eq(`person.${content.caretakerId}.willing`),eq(`world.${prefix}.scenes.shelfBuilt`)]}},
 {...rootCommand('pocket.frontier_pack','Pack with Joss’s pattern · 2 logs + 2 stamina · 3 min','base.frontier','Shack',[
  {type:'item',key:JSON.stringify({id:'Rough wood log'}),amount:-2},{type:'vital',key:'stamina',amount:-2}],[{type:'item',key:JSON.stringify({id:'Prepared survey kit'}),amount:2}]),duration:3,cancellation:'refund',requires:{all:[eq(`knowledge.${prefix}.packing.basis`,'instruction'),eq('glasshouse.templateAvailable')]},visibleWhen:eq(`knowledge.${prefix}.packing.seen`)}
);
definitions.commands.push(...clone(pocketObservationDefinitions.commands).map(d=>({...d,group:'glasshouse'})));
definitions.powers=[...(definitions.powers||[]),...clone(pocketObservationDefinitions.powers)];
export const pocketSimulationDefinitions=definitions;
const hiddenInternal=new Set(['pocket.open_payment','pocket.enter_receipt','pocket.exit_receipt','pocket.close_receipt']);
export const pocketRealmActions=[{id:'pocket.open',label:'Open or reopen the folded doorway · 1 wooden coin'},
 {id:'pocket.enter',label:'Step into the Glasshouse · carry your actual belongings'}, {id:'pocket.exit',label:'Return to the Village · keep carried belongings'}, {id:'pocket.close',label:'Close the doorway · keep the interior'},
 ...definitions.commands.filter(d=>d.actorId==='player'&&!hiddenInternal.has(d.id)&&!d.id.startsWith('pocket.observation.')).map(d=>({id:d.id,label:d.label})),...pocketObservationActions,{id:'pocket.cancel',label:'Cancel your current Glasshouse work'}];
export function pocketContext(state,context){context=exchangeContext(state,context);const inv=context.gameplay?.player?.inventory||{},key=JSON.stringify({id:'Sealing template'});return pocketObservationContext(state,{...context,facts:{...context.facts,...realmFacts(state),
 'glasshouse.handsUsable':(state.simulation?.people.player?.body?.hands??2)>=2&&!bodyFacts(state)['body.handsTender'],
 'glasshouse.scene.caretakerTemplateAvailable':(state.simulation?.owners[content.caretakerId]?.[key]||0)>=1&&!Object.values(state.simulation?.custody||{}).some(c=>c.holder===content.caretakerId&&c.key===key),
 'glasshouse.templateAvailable':inv[key]>=1&&!Object.values(state.simulation?.custody||{}).some(c=>c.holder==='player'&&c.key===key)}});}
function routeContext(state,context){
 const r=state.realmPrototype,inside=!!activeRealmVisit(state),p=state.simulation?.people.player,body=p?.body;
 const cargoPlan=buildNativePocketCargo(state,context,{from:inside?content.endpoint:content.connectionProposal.from,to:inside?content.connectionProposal.from:content.endpoint,connectionId:ids.connectionId});
 const cargo=cargoPlan.cargo;
 return {actorId:'player',sequence:state.sequence,clock:state.clock,endpoint:inside?content.endpoint:content.connectionProposal.from,
  life:p?.life||'alive',body:{id:'native.player.body',revision:1,form:body?.form||'human'},busy:!!context.busy||simulationOccupiesActor(state),knownConnectionIds:r?.connection?[r.connection.id]:[],
  sources:[],methodIds:[],authorityIds:[],anchors:[],resources:[{ownerId:'player',resourceId:'money',amount:context.external.money}],cargo,cargoComplete:cargoPlan.cargoComplete,cargoReasons:cargoPlan.reasons,
  bindings:[content.connectionProposal.from,content.endpoint].map(endpoint=>({endpoint,available:true,positions:[{id:'doorway.arrival',free:true,bodyForms:['human']}]}))};
}
function request(state,direction='forward'){return {expectedSequence:state.sequence,expectedRevision:state.realmPrototype.connection.revision,direction,operation:'passage'};}
export function previewPocketRealmAction(state,registry,id,context){
 context=pocketContext(state,context);const r=state.realmPrototype,inside=!!activeRealmVisit(state),connection=r?.connection;
 if(id.startsWith('pocket.observation.'))return previewPocketObservationAction(state,registry,id,context,previewSimulationCommand);
 if(id===commandId('export_template')&&r?.instances[ids.instanceId].claims['glasshouse.template_export'])return {visible:false,eligible:false,reasons:['Joss’s one template gift is already claimed.']};
 if(id==='pocket.cancel')return {visible:!!state.simulation?.jobs.some(j=>j.actorId==='player'&&j.commandId.startsWith(prefix)),eligible:true,reasons:[]};
 if(!id.startsWith('pocket.')||['pocket.frontier_pack','pocket.fund_bench'].includes(id)){
  const d=registry.simulation.commands.get(id);if(!d)return {visible:false,eligible:false,reasons:[]};
  const result=previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId||null});
  return {...result,visible:result.visible&&!(d.once&&state.actors.player.completed[id])&&(id===leadId||['pocket.frontier_pack','pocket.fund_bench'].includes(id)||inside)};
 }
 const reasons=[];if(context.busy||simulationOccupiesActor(state)||activePractice(state.actors.player)||state.chronicle?.session||state.chronicle?.life.endedAt!=null||waitingSimulationChoice(state)||state.pending.some(j=>j.context.actorId==='player'))reasons.push('Finish or cancel your current work first.');
 let visible=true;
 if(id==='pocket.open'){visible=!inside&&!connection?.open; if(!state.simulation?.knowledge.player?.[`${prefix}.lead`])reasons.push('Ask Iona about the folded workshop frame first.'); if(context.external.money<1)reasons.push('Opening costs one wooden coin.');}
 else if(id==='pocket.close'){visible=!inside&&!!connection?.open;}
 else if(id==='pocket.enter'){visible=!inside&&!!connection?.open;if(Object.values(r?.observation?.state.leases||{}).some(l=>l.status==='active'))reasons.push('Close the viewing slit before carrying your body through the doorway.'); if(connection){const rc=routeContext(state,context),p=previewRealmPassage(connection,rc,request(state)),t=previewNativeRealmTraveler(state,context,rc,p);reasons.push(...rc.cargoReasons,...p.reasons,...t.reasons);}else reasons.push('Open the doorway first.');}
 else if(id==='pocket.exit'){visible=inside;if(state.simulation?.jobs.some(j=>j.actorId===content.caretakerId))reasons.push('Joss has local work reserved. Wait for that commitment to finish before leaving.');if(connection){const rc=routeContext(state,context),p=previewRealmPassage(connection,rc,request(state,'reverse')),t=previewNativeRealmTraveler(state,context,rc,p);reasons.push(...rc.cargoReasons,...p.reasons,...t.reasons);}else reasons.push('No return doorway is bound.');}
 else return {visible:false,eligible:false,reasons:['Unsupported doorway action.']};
 if(!inside&&context.facts.location!=='Village')reasons.push('Return to the Village doorway.');
 return {visible,eligible:reasons.length===0,reasons};
}

function record(plan,id){const r=plan.state.realmPrototype;if(!r)return;r.receipts.push({id,at:plan.state.clock,sequence:plan.state.sequence});r.receipts=r.receipts.slice(-32);}
export function commitPocketRealmAction(state,registry,id,context,expectedSequence=state.sequence){
 assert(expectedSequence===state.sequence,'This doorway action is stale.');context=pocketContext(state,context);
 const preview=previewPocketRealmAction(state,registry,id,context);assert(preview.visible&&preview.eligible,preview.reasons.join(' ')||'This action is unavailable.');
 let plan;
 if(id.startsWith('pocket.observation.')){
  const next=clone(state);syncRealmClock(next);
  if(id==='pocket.observation.shutter')closeRealmObservationClock(next);
  plan=commitPocketObservationAction(next,registry,id,context,commitSimulationCommand,expectedSequence);
  if(id==='pocket.observation.activate')openRealmObservationClock(plan.state);
  if(id!=='pocket.observation.replay')record(plan,id);validateRealmState(plan.state);validateExpansionState(plan.state,registry);return plan;
 }
 if(id==='pocket.cancel'){const job=state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith(prefix));return cancelSimulationJob(state,registry,job.id,context,expectedSequence);}
 if(!id.startsWith('pocket.')||['pocket.frontier_pack','pocket.fund_bench'].includes(id)){
  const d=registry.simulation.commands.get(id);plan=commitSimulationCommand(state,registry,{id},pocketContext(state,{...context,targetId:d.targetId||null}),expectedSequence);
  if(id===commandId('meet')){const r=plan.state.realmPrototype;r.offeredElapsed=r.instances[ids.instanceId].clock.elapsed;const p=planWorldInstanceUpdate(r.instances[ids.instanceId],{expectedRevision:r.instances[ids.instanceId].revision,attachActorIds:[content.caretakerId]},definition,{actorIds:Object.keys(plan.state.actors)});assert(p.allowed,p.reasons.join(' '));r.instances[ids.instanceId]=p.nextInstance;}
  if(id===commandId('export_template')){const r=plan.state.realmPrototype,i=r.instances[ids.instanceId];const p=planWorldInstanceUpdate(i,{expectedRevision:i.revision,settleClaims:[{key:'glasshouse.template_export',holderId:'player'}]},definition,{actorIds:Object.keys(plan.state.actors)});assert(p.allowed,p.reasons.join(' '));r.instances[ids.instanceId]=p.nextInstance;}
 }else{
  const next=clone(state);
  if(!next.realmPrototype){next.worlds[ids.worldId]={facts:{},resources:{},completed:{}};next.realmPrototype={schema:2,instances:{[ids.instanceId]:createWorldInstance(definition,{id:ids.instanceId,continuityId:'frontier.glasshouse.branch',eraId:'frontier.present',playedAt:state.clock,parentInstanceId:'frontier.main',actorIds:[]})},visits:[],activeVisitId:null,offeredElapsed:null,receipts:[],connection:createPocketDoorConnection()};}
  syncRealmClock(next);const r=next.realmPrototype,rc=routeContext(next,context),req=request(next,id==='pocket.exit'?'reverse':'forward');
  const quoted=id==='pocket.open'?planRealmOpening(r.connection,rc,req):id==='pocket.close'?planRealmClosure(r.connection,rc,req):previewRealmPassage(r.connection,rc,req);assert(quoted.allowed,quoted.reasons.join(' '));
  if(['pocket.enter','pocket.exit'].includes(id)){assert(!rc.cargoReasons.length,rc.cargoReasons.join(' '));const traveler=previewNativeRealmTraveler(next,context,rc,quoted);assert(traveler.allowed,traveler.reasons.join(' '));}
  const nativeCommand=({'pocket.open':'pocket.open_payment','pocket.close':'pocket.close_receipt','pocket.enter':'pocket.enter_receipt','pocket.exit':'pocket.exit_receipt'})[id];
  plan=commitSimulationCommand(next,registry,{id:nativeCommand},{...context,targetId:null},next.sequence);
  if(quoted.nextConnection)plan.state.realmPrototype.connection=quoted.nextConnection;
  if(id==='pocket.enter'){
   const r=plan.state.realmPrototype,i=r.instances[ids.instanceId];const visit=createWorldVisit(i,{id:`glasshouse.visit.${plan.state.sequence}`,actorId:'player',endpoint:content.endpoint,playedAt:plan.state.clock},definition,{actorIds:Object.keys(plan.state.actors),visits:r.visits});r.visits.push(visit);r.activeVisitId=visit.id;
   plan.state.actors.player.worldId=ids.worldId;plan.state.simulation.people.player.location='Folded Glasshouse';plan.nativeLocation='Folded Glasshouse';plan.nativePatch={'current location':'Folded Glasshouse'};
  }else if(id==='pocket.exit'){
   const r=plan.state.realmPrototype,visit=activeRealmVisit(plan.state),p=planWorldDeparture(r.instances[ids.instanceId],visit,{playedAt:plan.state.clock,visits:r.visits,expectedRevision:r.instances[ids.instanceId].revision},definition);assert(p.allowed,p.reasons.join(' '));r.instances[ids.instanceId]=p.nextInstance;r.visits=r.visits.map(v=>v.id===visit.id?p.nextVisit:v);r.activeVisitId=null;r.visits=r.visits.slice(-63);
   plan.state.actors.player.worldId='base.frontier';plan.state.simulation.people.player.location='Village';plan.nativeLocation='Village';plan.nativePatch={'current location':'Village'};
  }
 }
 record(plan,id);validateRealmState(plan.state);validateExpansionState(plan.state,registry);return plan;
}
export function pocketRealmView(state){
 const r=state.realmPrototype,inside=!!activeRealmVisit(state),known=state.simulation?.knowledge.player||{},i=r?.instances[ids.instanceId];
 const local=i&&inside?worldInstanceView(i,definition,{discovered:true,identityKnown:true,clockKnown:true,factKeys:['repair.status','repair.route','research.complete','bench.open'],siteIds:[],actorIds:[],claimIds:[]}):null;
 return {discovered:!!known[`${prefix}.lead`],inside,observation:pocketObservationView(state),description:inside?`Local time: ${local.elapsedPlayedMinutes} supported minutes. Frame: ${local.facts['repair.status']}. Your presence or a live supported view allows new resident work. Already paid jobs keep their completion time. The manual doorway has no timed expiry.`:r?.connection?.open?'The doorway is open. Entering carries the same native body and bag. Return borrowed goods and close any live viewing slit before passage.':'The doorway is closed. The same room, resident and work remain for a later opening.',
 records:Object.entries(known).filter(([k])=>k.startsWith(`${prefix}.`)).map(([key,r])=>({key,text:r.value,at:r.at}))};
}
