import {NESTED_CHAIN_IDS as I,nestedChainDefinitions,nestedChainFacts,nestedChainCoverage} from './feature_expansion_nested_chains.js';
import {assert,natural} from './simulation_contracts.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from './simulation.js';

export const nestedChainContext=(state,context={})=>({...context,facts:{...context.facts,...nestedChainFacts(state,context)}});
const chainIds=new Set(nestedChainCoverage.map(c=>c.id));
const publicIds=new Set(nestedChainDefinitions.commands.filter(d=>d.actorId==='player').map(d=>d.id));
const residents=[I.issuer,I.trainer,I.keeper,I.foreman,I.registrar,I.claimant,I.witness];
const records=state=>Object.entries(state.simulation?.knowledge?.player||{}).filter(([key])=>key.startsWith('nested.chain.'))
 .map(([id,r])=>({id,at:r.at,text:r.value,attributedTo:r.basis?.attributedTo||null,stage:r.stage,basis:r.basis,cause:r.cause}));

// Compose after the native-world host's nestedContext. No native snapshot,
// publication, inventory seeding or clock is created by this adapter.
export function nestedChainSimulationContexts(state,contexts) {
 if(!state.nestedCampaign)return contexts;
 const next={...contexts};
 for(const id of ['player',...residents])if(next[id])next[id]=nestedChainContext(state,{...next[id],actorId:id});
 return next;
}

export function previewNestedChainCommand(state,registry,id,context) {
 if(!state.nestedCampaign||!state.simulation||!publicIds.has(id))return {visible:false,eligible:false,reasons:['This nested campaign command is unavailable.']};
 const d=registry.simulation.commands.get(id);
 if(d?.group!=='nested_chains'||d.actorId!=='player')return {visible:false,eligible:false,reasons:['This nested campaign command is unregistered.']};
 const prepared=nestedChainContext(state,{...context,actorId:'player',targetId:d.targetId||null});
 const p=previewSimulationCommand(state,registry,id,prepared);
 return {...p,visible:p.visible&&!(d.once&&state.actors.player.completed[id]),reasons:p.reasons.map(reason=>
  reason==='The required knowledge, means or circumstances are missing.'||reason.startsWith('Insufficient nested.')||reason.startsWith('Requires nested.chain.')||reason.startsWith('Requires actor.nested.chain.')||reason.startsWith('Requires situation.nested.chain.')?
   'The disclosed evidence, consent, finite means or retained outcome is not available yet.':reason)};
}

export function commitNestedChainCommand(state,registry,command,context,expectedSequence=state.sequence) {
 assert(expectedSequence===state.sequence&&context.actorId==='player'&&state.nestedCampaign&&state.simulation,'This chain command is stale or its actual native campaign is not enrolled.');
 if(command.type==='cancel_job') {
  const job=state.simulation.jobs.find(j=>j.id===command.id&&j.actorId==='player');
  assert(job&&registry.simulation.commands.get(job.commandId)?.group==='nested_chains','Choose the actual accepted chain job.');
  return cancelSimulationJob(state,registry,job.id,nestedChainContext(state,context),expectedSequence);
 }
 assert(command.type==='command'&&publicIds.has(command.id),'Unsupported nested chain command.');
 const d=registry.simulation.commands.get(command.id);
 assert(d?.group==='nested_chains'&&d.actorId==='player','The chain definition is not registered.');
 assert(command.targetId==null||command.targetId===d.targetId,'Choose the actual declared resident.');
 const prepared=nestedChainContext(state,{...context,targetId:d.targetId||null}),preview=previewNestedChainCommand(state,registry,command.id,prepared);
 assert(preview.visible&&preview.eligible,preview.reasons.join(' ')||'This chain choice is unavailable.');
 return commitSimulationCommand(state,registry,{id:d.id},prepared,expectedSequence);
}

export function nestedChainPeopleView(state,registry) {
 const seen=records(state),rows=[];
 for(const id of residents) {
  const own=seen.filter(r=>r.attributedTo===id);
  if(!own.length)continue;
  const definition=registry?.simulation?.people.get(id);
  rows.push({id,name:definition?.label||id,location:'Last observed in the reported chain; remote state is not observed.',
   details:own.map(r=>r.text),memories:own.map(r=>({id:r.id,at:r.at,text:r.text}))});
 }
 return rows;
}

export function nestedChainPresentation(state,registry,context) {
 if(!state.nestedCampaign||!state.simulation)return {visible:false,sections:[],people:[],records:[]};
 const prepared=nestedChainContext(state,context),seen=records(state),sections=[];
 for(const chain of nestedChainCoverage) {
  const actions=[];
  for(const d of nestedChainDefinitions.commands) {
   if(d.chainId!==chain.id||d.actorId!=='player'||d.worldId!==state.actors.player.worldId||d.location!==(context.facts?.location||state.simulation.people.player.location))continue;
   const preview=previewNestedChainCommand(state,registry,d.id,prepared);
   if(!preview.visible)continue;
   actions.push({id:d.id,label:d.label,description:d.description||'Accept only this bounded action. Its real inputs reserve now; other future choices reserve nothing.',
    eligible:preview.eligible,reasons:preview.reasons,duration:preview.duration,costs:preview.costs,cancellation:d.cancellation||'none',
    command:{type:'nested_chain',action:{type:'command',id:d.id,targetId:d.targetId||null}}});
  }
  const jobs=state.simulation.jobs.filter(j=>j.actorId==='player'&&registry.simulation.commands.get(j.commandId)?.chainId===chain.id);
  for(const j of jobs)if(j.cancellation!=='none')actions.push({id:`${j.id}:cancel`,label:'Cancel accepted chain work and return its reserved inputs',eligible:true,reasons:[],
   command:{type:'nested_chain',action:{type:'cancel_job',id:j.id}}});
  const known=seen.filter(r=>r.id.startsWith(`${chain.id}.`));
  if(!known.length&&!actions.length&&!jobs.length)continue;
  sections.push({id:chain.id,label:nestedChainDefinitions.situations.find(s=>s.id===chain.id).label,
   description:'Known acts and actual later accounts. An office has local jurisdiction; an issuer payout, local welfare and a learned function have separate owners.',
   actions,records:known,work:jobs.map(j=>`${j.label}: ${Math.max(0,j.due-state.clock)} played minutes remaining.`).join(' ')});
 }
 return {visible:sections.length>0,sections,people:nestedChainPeopleView(state,registry),records:seen};
}

// Existing saved situation/job/source validation handles the frozen typed data.
// This guard admits only the selected IDs/revision and preserves missing state.
export function validateNestedChains(state,registry) {
 const s=state.simulation,active=Object.entries(s?.situations||{}).filter(([id])=>chainIds.has(id));
 if(!state.nestedCampaign){assert(!active.length,'Nested chains require their optional campaign owner; unsupported saved content must not be silently reset.');return true;}
 for(const [id,r] of active) {
  const d=nestedChainDefinitions.situations.find(x=>x.id===id);
  assert(r.revision===1&&r.definitionId===id&&d.phases.includes(r.phase),'Unsupported nested chain revision or phase; preserve this save for the matching reader.');
  assert(r.context.worldId===d.context.worldId&&r.context.instanceId===d.context.instanceId&&r.context.continuityId===d.context.continuityId&&r.context.eraId===d.context.eraId&&r.context.regionId===d.context.regionId,'A chain cannot silently change its historical instance.');
  assert(r.participants.length===d.participants.length&&d.participants.every(p=>r.participants.includes(p)),'A chain cannot replace its stable historical cast.');
  assert(natural(r.openedAt)&&r.openedAt<=state.clock,'Invalid nested chain opening time.');
  if(registry)assert(registry.simulation.situations.has(id),'Saved nested chain is unregistered.');
 }
 const office=s?.claims?.[I.office];
 if(office)assert(active.some(([id])=>id===I.roles)&&['held','settled'].includes(office.status)&&[I.claimant,I.witness,I.registrar].includes(office.owner),'The archive office must keep its actual local owner.');
 for(const chain of nestedChainCoverage) {
  const name=chain.id.split('.').at(-1),disposition=state.actors.player.facts[`nested.chain.${name}.${name==='method'?'choice':'disposition'}`];
  if(disposition!=null)assert(disposition==='open'||chain.branches.includes(disposition),'Unsupported saved chain disposition.');
 }
 return true;
}
