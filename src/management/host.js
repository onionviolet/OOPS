import {settleFarmSupply} from './farm_supply.js';
import {check} from '../basics.js';
import {evaluateRule} from '../rules.js';
import {UNMET_REASON} from '../player_reasons.js';
import {enrollSimulation,commitSimulationCommand,cancelSimulationJob,previewSimulationCommand,simulationFacts,simulationRuleFacts,setSimulationProgram,pauseSimulationProgram,resumeSimulationProgram} from '../simulation.js';
import {meets} from '../simulation_contracts.js';
import {I} from './shared.js';
import {formatDuration} from '../number_format.js';
import {managementDefinitions} from './content.js';
import {managementFacts} from './facts.js';
import {validateManagementState} from './validation.js';
import {moneyText} from '../reveal_chain.js';
export const managementContext=(state,context)=>({...context,facts:{...context.facts,...managementFacts(state,context)}});
export function commitManagement(state,registry,command,context,sequence=state.sequence) {
 check(context.actorId==='player'&&sequence===state.sequence,'The courtyard choice is stale.');
 check(['cancel','delegate_cancel','pause'].includes(command.type)||!context.busy,'Finish your current native activity before making a courtyard choice.');
 let out;
 if(command.type==='delegate_cancel') {
  const j=state.simulation?.jobs.find(j=>j.id===command.id&&j.actorId===I.orin&&j.commandId==='mg.foreman.execute');
  check(j,'Choose Orin’s actual commissioned job.');
  check(managementFacts(state,context)['management.foremanReturnAvailable'],'Return locally to cancel and collect Orin’s held inputs.');
  out=cancelSimulationJob(state,registry,j.id,{...managementContext(state,context),actorId:I.orin},sequence);
 } else if(command.type==='cancel') {
  const j=state.simulation?.jobs.find(j=>j.id===command.id&&j.actorId==='player');
  check(j?.commandId.startsWith('mg.'),'Choose the actual accepted courtyard job.');
  out=cancelSimulationJob(state,registry,j.id,managementContext(state,context),sequence);
 } else if(command.type==='repeat') {
  const d=registry.simulation.commands.get(command.id);
  check(d?.group===I.group&&d.repeatable===true&&state.actors.player.completed[d.id]>0,'Complete this finite recipe manually before scheduling it.');
  check(Number.isSafeInteger(command.count)&&command.count>=1&&command.count<=3,'Choose one to three repetitions within the finite mandate.');
  out=setSimulationProgram(state,registry,d.id,command.count,managementContext(state,{...context,targetId:d.targetId||null}),sequence);
 } else if(command.type==='resume') {
  check(state.simulation?.programs.player?.commandId.startsWith('mg.'),'No courtyard work mandate is paused.');
  const id=state.simulation.programs.player.commandId;
  out=resumeSimulationProgram(state,registry,{...managementContext(state,context),targetId:registry.simulation.commands.get(id)?.targetId||null},sequence);
 } else if(command.type==='pause') {
  check(state.simulation?.programs.player?.commandId.startsWith('mg.'),'No courtyard work mandate is active.');
  out=pauseSimulationProgram(state,context,sequence);
 } else {
  const d=registry.simulation.commands.get(command.id);
  check(d?.group===I.group&&(d.actorId==='player'||d.id==='mg.foreman.execute'),'Choose a known courtyard command.');
  if(d.id==='mg.foreman.execute'){
   const npcContext={...context,actorId:I.orin,targetId:null,worldId:I.world,managementPlayerLocation:context.facts?.location,managementPlayerAlive:context.nativeAlive,vitals:{...context.vitals,[I.orin]:state.simulation.people[I.orin].vitals},facts:{...context.facts,location:state.simulation.people[I.orin].location}};
   out=commitSimulationCommand(state,registry,{id:d.id},managementContext(state,npcContext),sequence);
   validateManagementState(out.state,registry.simulation);return out;
  }
  const first=command.id===I.begin&&!state.simulation?enrollSimulation(state,registry,context,sequence):{state,...context};
  out=commitSimulationCommand(first.state,registry,{id:d.id},managementContext(first.state,{...context,external:first.external,gameplay:first.gameplay,vitals:first.vitals||context.vitals,targetId:d.targetId||null}),first.state.sequence);
  out.acquisitions=[...(first.acquisitions||[]),...(out.acquisitions||[])];
  out.unlocks=[...(first.unlocks||[]),...(out.unlocks||[])];
 }
 settleFarmSupply(out,registry,managementContext(out.state,{...context,external:out.external,gameplay:out.gameplay}),{harvest:command.id==='mg.farm.harvest_grain'});
 validateManagementState(out.state,registry.simulation);
 return out;
}
export const managementFamilies={charter:'Courtyard charter',supplies:'Finite supplies',MG01:'Investing and patronage',MG02:'Property management',MG03:'Shopkeeping and inn',MG04:'Auctions and appraisal',MG05:'Caravans and shipping',MG06:'Farming and care',MG07:'Workshop scheduling',MG08:'Lending and mutual aid',MG09:'Events and performances',MG10:'Restoration and collections'};
// UIC180: a blocked courtyard row says what is short and where to get it, not the engine's fallback line (UIC166, UIC172).
// Reads only the command's own requirement; an item it lacks names the count held and, when Mira's supplies carry it, her price.
const itemName=key=>{try{return JSON.parse(key).id;}catch{return String(key);}};
const unmetLeaves=(rule,facts,out=[])=>{if(!rule||rule.not)return out;if(rule.all||rule.any){for(const r of rule.all||rule.any)if(!evaluateRule(r,facts).met)unmetLeaves(r,facts,out);return out;}if(!evaluateRule(rule,facts).met)out.push(rule);return out;};
function shortfall(state,registry,d,quoteContext) {
 const facts=simulationRuleFacts(state,quoteContext,registry,d.requires),lines=[];
 // An item a running job holds is not short: the job has it, and "Finish your current activity first." leads instead.
 const held=new Set(state.simulation.jobs.filter(j=>j.actorId==='player').flatMap(j=>(j.costs||[]).filter(c=>c.type==='item'&&c.amount<0).map(c=>c.key)));
 for(const leaf of unmetLeaves(d.requires,facts)) {
  if(!leaf.fact?.startsWith('item.')||leaf.op!=='gte'){if(leaf.reason)lines.push(leaf.reason);continue;}
  const key=leaf.fact.slice(5),have=Number(facts[leaf.fact])||0,name=itemName(key).toLowerCase();
  if(held.has(key))continue;
  const sell=managementDefinitions.commands.find(c=>c.family==='supplies'&&c.effects.some(e=>e.type==='transfer'&&e.key===key&&e.to==='player'));
  const price=sell&&-sell.costs.filter(c=>c.key==='money').reduce((t,c)=>t+c.amount,0),seller=sell&&(registry.simulation.people?.get?.(sell.targetId)?.label||state.simulation.people[sell.targetId]?.label||'').split(', ')[0];
  lines.push(`Needs ${leaf.value} ${name}; you have ${have}.${sell?` ${seller||'The courtyard'} sells one for ${moneyText(price)} under Finite supplies.`:''}`);
 }
 return lines;
}
// UIC181: the plot's state in words, so the Farming summary says where the crop stands before it is opened (UR158).
export function plotLine(facts,job=null,registry=null,clock=0) {
 if(facts['mg.plotRight']!==true)return 'plot not rented';
 const d=job&&registry?.simulation.commands.get(job.commandId);
 if(d?.family==='MG06')return `${d.label.split(' · ')[0].toLowerCase()}, ${formatDuration(Math.max(0,job.due-clock))} to go`;
 const crop=facts['mg.cropType']||'crop',stage=facts['mg.cropStage'];
 return stage==='planted'?`${crop} planted, tend next`:stage==='tended'?`${crop} tended, grow next`:stage==='ready'?`${crop} ready to harvest`:'plot empty, plant next';
}
// The courtyard exists only in its own world; outside it nothing below can show, so callers may answer from the state alone.
export const managementWorldHere=state=>state?.actors?.player?.worldId===I.world;
export function managementPresentation(state,registry,context) {
 const local=managementWorldHere(state)&&context.facts?.location==='Village';
 if(!local)return {visible:false,sections:[],records:[]};
 const opened=state.actors.player.facts['mg.opened']===true,current=managementContext(state,context),sections=[];
 if(!opened) return {visible:true,opened:false,sections:[{id:'charter',label:managementFamilies.charter,actions:[{id:I.begin,label:'Visit the market courtyard · optional, free',description:managementDefinitions.commands.find(d=>d.id===I.begin).description,eligible:current.facts['management.supported']&&!context.busy,reasons:['No stock, money, deed or debt is granted by meeting the residents.'],duration:0}]}],records:[]};
 const facts=simulationFacts(state,current,registry);
 for(const [family,label] of Object.entries(managementFamilies)) {
  const actions=[];
  for(const d of managementDefinitions.commands.filter(d=>d.family===family)) {
   if(d.once&&state.actors.player.completed[d.id]||d.id!=='mg.foreman.execute'&&!meets(d.visibleWhen,facts))continue;
   const npc=d.id==='mg.foreman.execute';
   const quoteContext=npc?{...current,actorId:I.orin,targetId:null,managementPlayerLocation:context.facts?.location,managementPlayerAlive:context.nativeAlive,vitals:{...context.vitals,[I.orin]:state.simulation.people[I.orin].vitals},facts:{...current.facts,location:state.simulation.people[I.orin].location}}:{...current,targetId:d.targetId||null};
   // NPC readiness uses its own actor facts; player observation remains local.
   if(npc&&!state.actors[I.orin]?.facts['mg.foremanReady'])continue;
   const quote=previewSimulationCommand(state,registry,d.id,quoteContext);
   const reasons=!quote.eligible&&quote.reasons.includes(UNMET_REASON)?(()=>{const named=[...new Set([...shortfall(state,registry,d,quoteContext),...quote.reasons.filter(r=>r!==UNMET_REASON)])];return named.length?named:quote.reasons;})():quote.reasons;
   if(quote.visible)actions.push({id:d.id,label:d.label,description:d.description,eligible:quote.eligible&&!context.busy,reasons,duration:quote.duration,costs:quote.costs});
   if(d.repeatable===true&&state.actors.player.completed[d.id]>0)actions.push({id:d.id,type:'repeat',count:3,label:'Schedule up to three of this learned recipe',description:'Each repetition reserves real inputs separately. Shortages stop the mandate; costs are refunded when cancelled. No extra purchases or changed terms.',eligible:quote.eligible&&!context.busy,reasons:quote.reasons});
  }
  if(actions.length)sections.push({id:family,label,actions,...(family==='MG06'?{status:plotLine(state.actors.player.facts,state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('mg.')),registry,state.clock)}:{})});
 }
 const job=state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('mg.'));
 if(job)sections.unshift({id:'work',label:'Accepted courtyard work',actions:[{id:job.id,type:'cancel',label:`Cancel ${registry.simulation.commands.get(job.commandId)?.label} · refund inputs`,description:`${formatDuration(Math.max(0,job.due-state.clock))} of work left.`,eligible:true,reasons:[]}]});
 const foremanJob=state.simulation.jobs.find(j=>j.actorId===I.orin&&j.commandId==='mg.foreman.execute');
 if(foremanJob)sections.unshift({id:'foreman_work',label:'Orin’s commissioned work',actions:[{id:foremanJob.id,type:'delegate_cancel',label:'Stop Orin’s one-order job · return reserved inputs to him',description:`${formatDuration(Math.max(0,foremanJob.due-state.clock))} of work left. Collect the logs through the foreman cancellation action after stopping. The paid fee is retained.`,eligible:current.facts['management.foremanReturnAvailable'],reasons:[]}]});
 const program=state.simulation.programs.player;
 if(program?.commandId.startsWith('mg.')&&program.status==='running')sections.unshift({id:'mandate',label:'Bounded work mandate',actions:[{type:'pause',label:'Pause the courtyard mandate',eligible:true,reasons:[],description:'Pause future repetitions; cancel the current job separately to refund its reservation.'}]});
 if(program?.commandId.startsWith('mg.')&&program.status==='paused'&&program.remaining>0){
  const d=registry.simulation.commands.get(program.commandId),q=previewSimulationCommand(state,registry,d.id,{...current,targetId:d.targetId||null});
  sections.unshift({id:'resume_mandate',label:'Paused work mandate',actions:[{type:'resume',label:'Resume the remaining courtyard recipe repetitions',description:`${program.remaining} repetitions remain; each uses actual current stock and support.`,eligible:q.eligible&&!context.busy,reasons:q.reasons}]});
 }
 const records=Object.entries(state.simulation.knowledge.player||{}).filter(([id])=>id.startsWith('mg.')).map(([id,k])=>({id,text:k.value}));
 return {visible:true,opened:true,sections,records};
}
