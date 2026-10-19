import {natural as nat} from './basics.js';
import {RELAY_IDS as I,RELAY_KEYS as K,RELAY_CARRIER_JOINS} from './feature_expansion_subtlety_scene.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob,simulationOccupiesActor} from './simulation.js';
import {assert,validateSimulationState} from './simulation_contracts.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {projectSubtletyKnowledgeLegibility} from './action_legibility.js';

const known=state=>state.actors?.player?.facts?.['subtlety.relay.introduced']===true;
const count=(state,context,actor,key)=>{
 const p=state.simulation?.people?.[actor];
 const stock=p?.inventory==='simulation'?state.simulation.owners?.[actor]:context.gameplay?.[actor]?.inventory;
 return nat(stock?.[key])?stock[key]:0;
};
const staff=[I.keeper,I.clerk,I.witness];

// Internal action legality only. Never publish this truth projection as known
// people, learned explanations or a private carrier sheet.
export function relayFacts(state,context={}){
 const s=state.simulation,r=state.backlog?.replacement,location=context.facts?.location||s?.people?.player?.location;
 const stock=context.gameplay?.player?.inventory,v=context.vitals?.player;
 const nativeReady=!!stock&&Object.values(stock).every(nat)&&!!v&&['health','max_health','stamina','max_stamina'].every(k=>Number.isFinite(v[k])&&v[k]>=0)&&v.health<=v.max_health&&v.stamina<=v.max_stamina;
 const ready=!!r&&r.schema===1&&r.revision===1&&staff.every(id=>s?.people?.[id]?.life==='alive'&&state.actors?.[id]?.worldId===I.world&&s.people[id].location==='Village');
 const loan=s?.custody?.[I.loan],right=s?.claims?.[I.office];
 const f={'relay.replacementReady':ready,'relay.supported':context.actorId==='player'&&nativeReady&&state.actors?.player?.worldId===I.world&&location==='Village'&&ready&&
  !state.realmPrototype?.activeVisitId&&!state.chronicle?.session&&state.chronicle?.life.endedAt==null,
  'relay.handsUsable':nativeReady&&(s?.people?.player?.body?.hands??2)>=2&&v.health>1,
  'relay.witnessHands':ready&&(s.people[I.witness].body?.hands??0)>=2,
  'relay.actualOffice':ready&&right?.status==='held'&&right.owner==='player'&&r.officeStatus==='appointed'&&r.credential?.active===true&&r.credential.holderId==='player'&&r.credential.officeId===I.office,
  'relay.officeKnown':!!s?.knowledge?.player?.['backlog.registry.appointment'],
  'relay.badgeAvailable':ready&&!loan&&count(state,context,I.keeper,K.badge)===1&&!Object.values(s?.custody||{}).some(c=>c.holder===I.keeper&&c.key===K.badge)};
 for(const variant of ['badge','worn'])f[`relay.loan.${variant}`]=nativeReady&&loan?.owner===I.keeper&&loan.holder==='player'&&loan.key===K[variant]&&loan.count===1&&
  count(state,context,'player',K[variant])>=1&&!Object.values(context.equipment?.player||s?.equipment?.player||{}).includes(K[variant]);
 return f;
}
export function relayContext(state,context){return {...context,facts:{...context.facts,...relayFacts(state,context)}};}

// Optional content uses only existing people/items/knowledge/situations/jobs.
// Absent scene is inert. No second generic carrier, enrollment or save owner.
export function validateRelayState(state,registry,nativeContext){
 const s=state.simulation,f=state.actors?.player?.facts||{},opened=known(state),situation=s?.situations?.[I.scene];
 const present=situation||s?.custody?.[I.loan]||s?.claims?.[I.invitation]||staff.some(id=>state.actors?.[id]?.resources?.[I.purse]!=null);
 if(!opened&&!present)return;
 assert(opened&&f['subtlety.relay.version']===1&&situation?.revision===1&&situation.privateTruth.caseRepairBy===I.witness,'Incomplete or unsupported relay activation. Preserve the original save.');
 assert(state.backlog?.schema===2&&state.backlog.replacement?.schema===1,'The relay requires its existing supported office history.');
 assert(staff.every(id=>s.people[id]?.definitionId===id&&s.people[id].inventory==='simulation'&&state.actors[id]?.worldId===I.world&&s.owners[id]),'The relay cannot recreate or substitute its actual people.');
 const credit=f['subtlety.relay.credit'],invitation=s.claims[I.invitation];
 assert(['unselected','honest','claimed','corrected','exposed','compensated'].includes(credit),'Unsupported relay credit branch.');
 const used=f['subtlety.relay.invitationUsed']===true,witnessWorked=f['subtlety.relay.witnessWorked']===true;
 assert(!(used&&witnessWorked),'The same finite fitting opportunity cannot be used twice.');
 const expectedOwner=credit==='unselected'?I.clerk:['honest','corrected'].includes(credit)?I.witness:'player';
 assert(invitation?.owner===expectedOwner&&invitation.status===(used||witnessWorked?'settled':'held'),'The fitting invitation lost its exact allocation or consumed receipt.');
 assert(!['exposed','compensated'].includes(credit)||used,'A spent-opportunity correction needs actual performed fitting work.');
 assert(nat(state.actors[I.clerk].resources[I.purse])&&state.actors[I.clerk].resources[I.purse]<=8,'Invalid finite relay purse.');
 for(const [actor,key,max] of [[I.clerk,'publicOrders',1],[I.clerk,'invitationOrders',1],[I.clerk,'dispatchOrders',1],[I.witness,'pledgedWork',1],[I.witness,'kitSales',1]])
  assert(nat(state.actors[actor].resources[`subtlety.relay.${key}`])&&state.actors[actor].resources[`subtlety.relay.${key}`]<=max,'Invalid finite relay work or sale demand.');
 const c=s.custody[I.loan];
 if(c)assert(f['subtlety.relay.badgeBorrowed']===true&&f['subtlety.relay.badgeReturned']!==true&&c.owner===I.keeper&&c.holder==='player'&&c.count===1&&[K.badge,K.worn].includes(c.key),'Unsupported physical relay badge custody.');
 else if(f['subtlety.relay.badgeBorrowed']===true)assert(f['subtlety.relay.badgeReturned']===true,'The physical badge loan needs its actual return receipt.');
 if(nativeContext?.gameplay?.player?.inventory){
  const total=[I.keeper,'player'].reduce((n,id)=>n+count(state,nativeContext,id,K.badge)+count(state,nativeContext,id,K.worn),0);
  assert(total===1,'The same conserved relay badge cannot disappear or duplicate.');
  if(c)assert(count(state,nativeContext,'player',c.key)===1&&!Object.values(nativeContext.equipment?.player||{}).includes(c.key),'The relay badge loan lost its exact native carried item.');
 }
 assert(!(f['subtlety.relay.delivered']&&f['subtlety.relay.parcelUnpacked']),'A consumed relay parcel cannot also be unpacked.');
 if(registry)validateSimulationState(s,state,registry.simulation);
}

const allowedReplacement=id=>typeof id==='string'&&id.startsWith('backlog.replacement.');
/** Inject the actual Backlog planner, preview and validators after its freeze.
 * commit is commitBacklogAction (bound to root's advancePlan when needed).
 * validate wraps validateReplacementRecord(state.backlog,state).
 * view is replacementView. carrierView is for admission only, never the UI.
 * stage is stageReplacementCommand for the sole integrator's staged joins;
 * this host delegates to commit rather than mutating stage out of sequence.
 */
export function createRelayHost(replacement){
 assert(replacement&&['commit','preview','actions','validate','view','carrierView'].every(k=>typeof replacement[k]==='function'),'Bind the actual frozen Backlog office planner/validator/preview/view before activating relay work.');
 function validate(state,registry,nativeContext){
  replacement.validate(state);
  const carrier=replacement.carrierView(state);
  if(known(state))assert(carrier&&carrier.carriers?.rightful?.actorId===I.keeper&&carrier.carriers.entrant?.actorId==='player'&&carrier.officeHolder===state.simulation.claims[I.office]?.owner,'The relay must consume its existing exact office carriers.');
  validateRelayState(state,registry,nativeContext);
 }
 function current(state,context){return relayContext(state,typeof replacement.context==='function'?replacement.context(state,context):context);}
 function commit(state,registry,command,context,expectedSequence=state.sequence){
  assert(state.sequence===expectedSequence&&context.actorId==='player','This relay action is stale or belongs to another actor.');
  if(command.type==='replacement'){
   assert(allowedReplacement(command.id),'The relay cannot dispatch another Backlog lane.');
   const out=replacement.commit(state,registry,{...command,sequence:expectedSequence},context,expectedSequence);validate(out.state,registry,out);return out;
  }
  assert(state.simulation&&state.backlog?.replacement,'Meet the existing office staff before opening the relay layer.');
  const ctx=current(state,context);
  let out;
  if(command.type==='cancel_job'){
   const job=state.simulation.jobs.find(j=>j.id===command.id&&j.actorId==='player');
   assert(job&&registry.simulation.commands.get(job.commandId)?.group===I.group,'No accepted relay job matches that cancellation.');
   out=cancelSimulationJob(state,registry,job.id,ctx,expectedSequence);
  }else{
   const id=command.type==='begin'?I.begin:command.id,d=registry.simulation.commands.get(id);
   assert(['begin','command'].includes(command.type)&&d?.group===I.group&&d.actorId==='player'&&(command.type==='begin'||d.id!==I.begin),'Unknown relay command.');
   assert(command.targetId==null||command.targetId===d.targetId,'Choose the actual declared relay participant.');
   out=commitSimulationCommand(state,registry,{id},current(state,{...context,targetId:d.targetId||null}),expectedSequence);
  }
  validate(out.state,registry,out);return out;
 }
 function preview(state,registry,commandId,context){
  const d=registry.simulation.commands.get(commandId);assert(d?.group===I.group,'Unknown relay preview.');
  return previewSimulationCommand(state,registry,commandId,current(state,{...context,targetId:d.targetId||null}));
 }
 function presentation(state,registry,context){
  const ctx=current(state,context),introduced=known(state),r=state.backlog?.replacement,actions=[];
  const canBegin=!introduced&&ctx.facts['relay.supported']&&context.facts?.['village.elderMet']===true&&!context.busy&&!simulationOccupiesActor(state);
  // The existing proof supplies real office/disguise/recognition/return actions.
  // They keep their own actual planner and player-addressed accounts.
  const officeActions=replacement.actions().filter(d=>allowedReplacement(d.id)&&(!r?d.id==='backlog.replacement.meet':d.id!=='backlog.replacement.meet')).map(d=>{
   const p=replacement.preview(state,registry,d.id,context);
   return {...d,eligible:p.eligible,reasons:p.reasons||[],command:{type:'backlog',id:d.id}};
  }).filter(d=>d.eligible);
  if(canBegin)actions.push({id:I.begin,label:'Ask about the relay work',eligible:true,reasons:[],command:{type:'relay',action:'begin'}});
  if(introduced)actions.push(...projectFeatureCommands(state,registry,ctx,{groups:[I.group]}).filter(d=>d.id!==I.begin).map(d=>({...d,command:{type:'relay',action:'command',id:d.id,targetId:d.command.targetId}})));
  const work=introduced?featureWorkControls(state,registry,[I.group],ctx):{work:'',actions:[]};
  actions.unshift(...work.actions.map(d=>({...d,command:{type:'relay',action:'cancel_job',id:d.command.id}})));
  const records=introduced?featureRecordedKnowledge(state,['subtlety.relay.']):[];
  const recognition=relayKnowledgePresentation(state),base=replacement.view(state);
  return {id:I.scene,label:'Relay office · work, credit and remembered people',visible:!!(r||introduced||canBegin||officeActions.length),introduced,canBegin,
   actions,officeActions,work:work.work,records,recognition,officeReports:base.records||[],people:relayPeopleView(state),
   description:introduced?'The same office history, one physical badge loan, counted local work and a finite repair-credit opportunity.':'Meet the existing office staff, then explicitly ask about their additional relay work.'};
 }
 return {commit,preview,presentation,validate,context:current};
}

// Only retained player/heard knowledge enters these observer-safe projections.
// NPC belief objects and private situation truth are never passed to legibility.
export function relayKnowledgePresentation(state){
 const metadata={};
 const add=(key,observerId,medium,status,supersedes)=>{metadata[`subtlety.relay.${key}`]={known:true,observerId,recipientId:'player',medium,statusKnown:true,status,...(supersedes?{supersedes:`subtlety.relay.${supersedes}`}:{})};};
 add('credit.claim','player','remembered','claimed');
 add('credit.honest',I.clerk,'heard','recognized');
 add('credit.correction',I.witness,'heard','corrected');
 add('credit.compensation',I.witness,'heard','settled');
 add('dispatch.delivery',I.witness,'witnessed','recognized');
 const people=Object.fromEntries(staff.map((id,n)=>[id,{known:known(state),label:['Eda, seal steward','Orrin, counter clerk','Bera, local witness'][n]}]));
 return projectSubtletyKnowledgeLegibility({state,prefix:'subtlety.relay.',metadata,people});
}
export function relayPeopleView(state){
 if(!known(state))return [];
 const k=state.simulation?.knowledge?.player||{};
 return [[I.keeper,'Eda, seal steward',['meeting','badge.','refusal','later.honest','later.office']],
  [I.clerk,'Orrin, same counter clerk',['meeting','terms','texture','public.','dispatch.','credit.']],
  [I.witness,'Bera, same local witness',['meeting','credit.','dispatch.delivery','witness.sale','later.']]].map(([id,name,prefixes])=>({id,name,location:'Last met: Village',
   details:Object.entries(k).filter(([key])=>prefixes.some(p=>key.startsWith(`subtlety.relay.${p}`))).map(([,r])=>r.value)}));
}
export {RELAY_CARRIER_JOINS};
