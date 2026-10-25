// Earned attention patterns share one actual practice schedule. Stable tracks
// retain their own drill/mastery; no fork owns or duplicates native condensate.
import {check,natural} from './basics.js';
const tasks=['breath','settling'];
const shape=(x,keys)=>x&&Object.keys(x).sort().join(',')===keys.split(',').sort().join(',');
export function validateForks(f){
 if(f===undefined)return;check(shape(f,'slots,phase')&&Array.isArray(f.slots)&&f.slots.length>0&&f.slots.length<=2&&natural(f.phase)&&f.phase<100,'Invalid attention fork schedule.');
 for(const [i,s] of f.slots.entries())check(shape(s,'id,task,minutes,weight')&&s.id===`mistglass.fork.${i+1}`&&tasks.includes(s.task)&&shape(s.minutes,'breath,settling')&&Object.values(s.minutes).every(n=>natural(n)&&n<=48)&&natural(s.weight)&&s.weight<=100&&s.weight%25===0,'Invalid attention fork.');
 check(f.slots.reduce((n,s)=>n+s.weight,0)<=100,'Forks exceed actual available attention.');
}
export function forkWeights(f){validateForks(f);const weights=f?.slots.map(s=>s.weight)||[];return [100-weights.reduce((n,w)=>n+w,0),...weights];}
export function forkAllocation(f,n){
 const weights=forkWeights(f),counts=weights.map(w=>Math.floor(n/100)*w);let phase=f.phase;
 for(let i=0;i<n%100;i++){let end=0;const index=weights.findIndex(w=>{end+=w;return phase<end;});counts[index]++;phase=(phase+1)%100;}
 return {counts,phase};
}
export function forkBonuses(f){
 validateForks(f);return {odds:(f?.slots||[]).reduce((n,s)=>n+25*Math.floor(s.minutes.settling/16),0),work:(f?.slots||[]).reduce((n,s)=>n+10*Math.floor(s.minutes.breath/16),0)};
}
export function changeForks(d,techniques,action){
 if(action==='add'){
  check(techniques.minutes.breath>=48&&techniques.minutes.settling>=48&&d.depth.flow+d.depth.still>=1,'Integrate both actual drills and understand one local law before shaping independent attention.');
  check((d.forks?.slots.length||0)<2&&d.nodes.bridge>=2,'This vessel needs two actual bridge nodes for each of its two supported patterns.');
  d.forks ||= {slots:[],phase:0};const i=d.forks.slots.length;d.nodes.bridge-=2;d.impurity++;
  d.forks.slots.push({id:`mistglass.fork.${i+1}`,task:tasks[i],minutes:{breath:0,settling:0},weight:0});validateForks(d.forks);return 1000;
 }
 check(d.forks,'Shape an earned attention pattern first.');const [kind,index,value]=action.split(':'),i=Number(index),s=d.forks.slots[i];check(s,'Choose an existing pattern.');
 if(kind==='weight'){const n=Number(value);check(natural(n)&&n<=100&&n%25===0,'Allocate attention in quarters.');s.weight=n;validateForks(d.forks);d.paired=false;}
 else if(kind==='task'){check(tasks.includes(value),'Choose a known circulation or refinement drill.');s.task=value;}
 else check(false,'Unknown attention allocation.');return 0;
}
