import {SKILL_CATALOGUE,skillFamilyDefinitions,skillExpansionFacts} from './skill_expansion_content.js';
import {previewSimulationCommand,previewSimulationResponse,simulationFacts} from './simulation.js';
import {evaluateRule} from './rules.js';
import {meets} from './simulation_contracts.js';
import {projectDiscoveryFeature,projectAcceptedWork,projectDiscoveryPanel} from './skill_discovery.js';

export function skillExpansionContext(state,context){
 return {...context,facts:{...context.facts,...skillExpansionFacts(state,context)}};
}
const safeReasons = preview => preview?.eligible?[]:[{known:true,text:'Current preparation, access or agreed attention does not support this action.'}];
// A disabled method names the requirement that failed (PIR9, SLR29, RC8, 2026-10-19), but only
// through text its author wrote for the player (`reason` on a requires leaf) or the shared busy
// line. Engine fallbacks and cost errors can name the craftsman's private attention, so anything
// else keeps the generic line.
const authoredReasons = (rule, out = new Set()) => {
 if(!rule||typeof rule!=='object')return out;if(typeof rule.reason==='string')out.add(rule.reason);
 for(const child of [...(rule.all||rule.any||[]),...(rule.not?[rule.not]:[])])authoredReasons(child,out);return out;
};
const BUSY='Finish your current activity first.';
function knownReasons(state,registry,d,preview,context){
 if(preview.eligible&&preview.visible)return [];
 if(!state.simulation)return safeReasons({eligible:false});
 const authored=authoredReasons(d.requires),targetId=state.simulation?.people[context.targetId]?context.targetId:null;
 const failed=d.requires?evaluateRule(d.requires,simulationFacts(state,{...context,targetId},registry,[d.requires])).reasons:[];
 const named=[...new Set([...failed.filter(r=>authored.has(r)),...preview.reasons.filter(r=>r===BUSY)])];
 return named.length?named.map(text=>({known:true,text})):safeReasons({eligible:false});
}
function publicFacts(state,context){const a=state.actors.player;return {...context.facts,
 ...Object.fromEntries(Object.entries(a.facts).map(([k,v])=>[`actor.${k}`,v])),
 ...Object.fromEntries(Object.entries(state.campaign.facts).map(([k,v])=>[`campaign.${k}`,v]))};}
export function skillExpansionPresentation(state,registry,context){
 context=skillExpansionContext(state,context);const s=state.simulation,actor=state.actors.player,knowledge=s?.knowledge.player||{},families=[];
 const facts=publicFacts(state,context),job=s?.jobs.find(j=>j.actorId==='player'&&(registry.simulation.commands.get(j.commandId)?.group==='skills'||j.commandId==='party.rest'));
 const session=s?.sessions.player,exercise=session&&registry.simulation.commands.get(session.commandId)?.group==='skills'?session:null;
 for(const family of SKILL_CATALOGUE){
  const power=s?.powers.player?.[family.powerId],known=!!knowledge[family.knowledgeKey]||!!power?.owned;
  const discover=registry.simulation.commands.get(family.discoverCommandId);
  if(!known){
   if(!discover||!meets(discover.visibleWhen,facts)||actor.completed[discover.id])continue;
   const preview=s?previewSimulationCommand(state,registry,discover.id,{...context,targetId:discover.targetId||null}):null;
   const hint=projectDiscoveryFeature({id:`offer.${discover.id}`,label:discover.label,discovered:true,unlocked:true,eligible:!!preview?.eligible,
    description:'Observe the offered work first. Seeing it does not teach the method.',reasons:s?safeReasons(preview):[{known:true,text:'Follow local people and work to take this offer.'}]});
   families.push({id:hint.id,row:hint,actions:s?[{id:discover.id,row:hint,targetId:discover.targetId||null}]:[],milestones:[]});continue;
  }
  const actions=[],ids=[family.learnCommandId,...family.practiceCommandIds,...family.useCommandIds,
   ...(skillFamilyDefinitions.find(f=>f.id===family.id)?.recoveryIds||[])];
  for(const id of new Set(ids)){
   const d=registry.simulation.commands.get(id);if(!d||d.once&&actor.completed[id])continue;
   const p=previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId||null});
   // Mastery is player-known. Keep the agreed report discoverable at mastery
   // two even before the public workshop opens, with its known gate spelled
   // out. Do not derive or display any craftsman/world-private state here.
   const reportWait=id==='skills.inquiry.road_report'&&power?.owned&&(power.mastery||0)>=2&&!p.visible;
   // The precise material milestone is taught with the method; other future
   // contexts remain hidden until their actual visibility evidence exists.
   if(!p.visible&&!reportWait&&!(id==='skills.timber.precise_pack'&&power?.owned))continue;
   const knownRequirements=reportWait?[{known:true,text:'Start the shared field workshop before requesting its contribution report.',met:false}]:[];
   const row=projectDiscoveryFeature({id,label:d.label,description:d.description||'',discovered:true,unlocked:true,eligible:p.eligible&&p.visible,
    requirements:knownRequirements,reasons:reportWait?knownRequirements:knownReasons(state,registry,d,p,{...context,targetId:d.targetId||null}),
    details:[{known:true,surface:'preview',text:`${p.duration??d.duration??0} played minutes${d.fluency&&p.duration<d.duration?` (practiced from ${d.duration})`:''}; cancellation: ${d.cancellation||'none'}.`} ]});
   actions.push({id,targetId:d.targetId||null,row});
  }
  const row=projectDiscoveryFeature({id:family.id,label:family.label,description:family.description,discovered:true,unlocked:!!power?.owned,
   eligible:actions.some(a=>a.row.control.enabled),reasons:safeReasons({eligible:actions.some(a=>a.row.control.enabled)})});
  families.push({id:family.id,row,actions,mastery:power?.mastery||0,uses:power?.executions||0,learned:!!power?.owned,
   milestones:power?.owned?family.milestones.map(m=>({...m,met:(power.mastery||0)>=m.at})):[],
   records:[
    ...Object.entries(knowledge).filter(([k])=>k.startsWith(family.id+'.')||k.startsWith('skills.'+family.discoverCommandId.split('.')[1]+'.')).map(([id,r])=>({id,text:r.value,at:r.at})),
    // These are the exact player-side snapshots written by the inquiry's
    // observation effects. Never read current world or NPC state for a recap.
    ...(family.id==='frontier.shared_inquiry'?[
     ...['parts','survey','assembly'].filter(key=>Object.hasOwn(actor.facts,`field.project.${key}`)).map(key=>({id:`field.project.${key}`,text:`Your reported ${key} contribution: ${actor.facts[`field.project.${key}`]}.`,at:actor.facts[`field.project.${key}.observedAt`]})),
     ...(Object.hasOwn(actor.facts,'field.roadKnown')?[{id:'field.roadKnown',text:`Your reported road stage: ${actor.facts['field.roadKnown']}.`,at:actor.facts['field.roadKnown.observedAt']}]:[])
    ]:[])
   ]});
 }
 const work=job?projectAcceptedWork({accepted:true,id:job.id,label:registry.simulation.commands.get(job.commandId)?.label,
  remainingMinutes:Math.max(0,job.due-state.clock),details:[{known:true,surface:'preview',text:`Cancellation: ${job.cancellation}.`}]}):null;
 const panel=projectDiscoveryPanel({id:'skills_panel',label:'Methods & practice',entries:families.map(f=>f.row),retained:work?[work]:[]});
 let contest=null;if(exercise){const turn=exercise.turns[exercise.turn];contest={id:exercise.id,cue:turn.cue,
  responses:turn.responses.map(r=>({id:r.id,label:r.label,preview:previewSimulationResponse(state,registry,{kind:'encounter',responseId:r.id},context)}))};}
 return {panel,families,work,jobId:job?.id,cancellation:job?.cancellation,contest,canEnroll:!s&&families.length>0};
}
