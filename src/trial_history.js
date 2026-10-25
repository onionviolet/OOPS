import {trialExpertise} from './trial_expertise.js';
// A bounded account of resolved choices. Conditioning and rewards stay in Pledges.
import {check,natural} from './basics.js';
export const TRIAL_HISTORY_LIMIT=32;
const routes=['quick','guarded','endurance','precision','blade','pole'];
const keys=['stage','quality','pressure','learning'];
const snapshot=t=>Object.fromEntries(keys.map(k=>[k,t[k]||0]));
const validSnapshot=t=>t&&Object.keys(t).sort().join(',')==='learning,pressure,quality,stage'&&keys.every(k=>natural(t[k]))&&t.stage<=3&&t.quality<=27;
export function validateTrialHistory(rows){
 if(rows===undefined)return;
 check(Array.isArray(rows)&&rows.length<=TRIAL_HISTORY_LIMIT,'Invalid trial choice history.');
 for(const r of rows){
  check(r&&Object.keys(r).filter(k=>k!=='load'&&k!=='task').sort().join(',')==='after,at,before,grade,passed,risk,route,steps,units'&&natural(r.at)&&routes.includes(r.route)&&(typeof r.passed==='boolean'||r.passed===null)&&natural(r.units)&&r.units<=5&&natural(r.risk)&&r.risk<=1000&&natural(r.grade)&&r.grade<=9&&validSnapshot(r.before)&&validSnapshot(r.after),'Invalid trial choice record.');
  if(r.task!==undefined)check(r.task&&Object.keys(r.task).sort().join(',')==='after,before'&&natural(r.task.before)&&natural(r.task.after)&&r.task.after===r.task.before+(r.passed===false?1:0),'Invalid remembered task learning.');
  check(r.load===undefined||natural(r.load)&&r.load<=2,'Invalid remembered frame load.');
  if(['quick','guarded'].includes(r.route))check(!r.load,'Invalid quick trial load.');
  check(Array.isArray(r.steps)&&r.steps.length<=12&&r.steps.every(s=>['steady','press'].includes(s)),'Invalid remembered ordeal choices.');
  check(r.after.stage===r.before.stage+(r.passed?1:0)&&r.after.quality===r.before.quality+r.grade&&r.after.learning===r.before.learning+(r.passed===false?1:0)&&(!r.grade||r.passed),'Trial choice differs from its result.');
  if(['quick','guarded'].includes(r.route))check(r.passed!==null&&r.grade===0&&r.steps.length===0,'Invalid quick trial grade.');
  if(r.route==='guarded')check(r.passed&&r.risk===0&&r.units===5,'Invalid guarded trial record.');
 }
}
export function recordTrialChoice(before,after,{at,route,units,risk=0,passed,grade=0,steps=[],load=0}){
 const row={at,route,units,risk,passed,grade,load,...(route!=='guarded'?{task:{before:trialExpertise(before,route),after:trialExpertise(after,route,before.trial.stage+1)}}:{}),steps:[...steps],before:snapshot(before.trial),after:snapshot(after.trial)};
 const decisions=[...(before.trial.decisions||[]),row].slice(-TRIAL_HISTORY_LIMIT);validateTrialHistory(decisions);
 return {...after,trial:{...after.trial,decisions}};
}
export function describeTrialChoice(r){
 const route=r.route==='quick'?'Quick trial':r.route==='guarded'?'Guarded preparation':`${r.route[0].toUpperCase()+r.route.slice(1)} ordeal`,result=r.passed?`held${r.grade?` at grade ${r.grade}`:''}`:r.passed===null?'left without a grade':'failed';
 const steps=r.steps.length?` Steps: ${r.steps.map(s=>s==='steady'?'measured':'press').join(', ')}.`:'';
 return `${route}${r.load?`, ${r.load===1?'raised':'heavy'} load`:''}, ${r.units} ration${r.units===1?'':'s'}${r.route==='quick'?`, ${r.risk/10}% quoted failure risk`:''}; ${result}. Stage ${r.before.stage} → ${r.after.stage}, quality ${r.before.quality} → ${r.after.quality}, fear ${r.before.pressure} → ${r.after.pressure}, learning ${r.before.learning} → ${r.after.learning}.${r.task?` Task lessons ${r.task.before} → ${r.task.after}.`:""}${steps}`;
}
