// Ordered work compiled onto the existing simulation jobs, participants and actor
// facts. No scheduler, transaction or save slice: an unfinished step is an ordinary
// refundable job; completed steps remain facts across cancellation and reload.
import {evaluateRule} from './rules.js';
const stable = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x) && !['__proto__','constructor','prototype'].includes(x);
const positive = x => Number.isSafeInteger(x) && x > 0;
const all = (...rules) => ({all: rules.filter(Boolean)});
export const procedureStepKey = id => `procedure.${id}.step`;

// A restart spends a new set of inputs and replaces unfinished work. World rows
// can retain their own once/knowledge gates. Only the final step grants outputs.
// Agents are actual simulation participants, so availability and physical contact
// are rechecked at admission AND settlement, including after loading a saved job.
export function compileProcedure(command, spec) {
 if(!stable(command.id) || !positive(command.duration) || !Array.isArray(spec?.steps) || spec.steps.length < 2)
  throw Error('A procedure needs a timed command and at least two steps.');
 if(command.claim || command.outcomes || command.encounterId) throw Error('Procedure needs an ordinary timed command without a separate claim or encounter.');
 const seen = new Set(), steps = spec.steps;
 for(const step of steps) {
  if(!stable(step.id) || seen.has(step.id) || !positive(step.minutes) || typeof step.label !== 'string' || !step.label.trim()) throw Error('Invalid or duplicate procedure step.');
  seen.add(step.id);
  if(step.condition) evaluateRule(step.condition, {});
  for(const a of step.agents || []) {
   if(!stable(a.id) || !['maker','witness','answerer'].includes(a.role) || a.mode!=null&&!['local','remote'].includes(a.mode) || a.mode==='remote'&&!a.requires) throw Error('Invalid procedure agent.');
   if(a.requires)evaluateRule(a.requires,{});
  }
 }
 if(steps.reduce((n,s)=>n+s.minutes,0)!==command.duration) throw Error('Procedure step times must equal the existing duration.');
 const key=procedureStepKey(command.id), actor=command.actorId || 'player';
 return steps.map((step,index)=>{
  const final=index===steps.length-1;
  const gate=index?{fact:`actor.${key}`,op:'eq',value:index,reason:'Finish the preceding preparation first.'}:null;
  const agentRules=(step.agents||[]).flatMap(a=>a.requires?[a.requires]:[]);
  const requires=all(command.requires,gate,step.condition,...agentRules);
  const participants=[...new Set([...(command.participants||[]),...(step.agents||[]).filter(a=>a.mode!=='remote').map(a=>a.id)])];
  const effects=[...structuredClone(step.effects||[]),...(final?structuredClone(command.effects||[]):[]),{type:'fact',scope:'actor',actor,key,value:final?0:index+1}];
  return {...structuredClone(command),id:final?command.id:`${command.id}.procedure.${index+1}`,
   label:step.label,description:step.description||command.description||step.label,duration:step.minutes,
   costs:index?[]:structuredClone(command.costs||[]),effects,
   requires,completionRequires:all(command.completionRequires||command.requires,gate,step.condition,...agentRules),
   visibleWhen:all(command.visibleWhen,index?gate:null),
   cancellation:'refund',completionFailure:'refund',completionCoLocated:true,
   ...(participants.length?{participants,participantsCoLocated:true}:{}),
   procedure:{schema:1,parentId:command.id,stepId:step.id,index:index+1,total:steps.length,key,
    agents:structuredClone(step.agents||[]),restart:index===0},
   ...(command.making?{making:{...command.making,stage:final?command.making.stage:'procedure'}}:{})};
 });
}

