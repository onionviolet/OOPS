import {Kernel} from './kernel.mjs';
import {normalizePacing,advancePacing,setPacingOption,prepareFood,pacingEffects} from './copied/pacing.mjs';
import {calendarMinutes,recurringWindow,validateSchedule} from './copied/world_rhythm.mjs';
export const seeds={default:42,weather:91};
export const calendarOrigin=calendarMinutes({year:1,month:1,day:1,hour:6,minute:0});
export const schedule={period:1440,opens:480,closes:600};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export function modules(shape={actors:1,items:20,opportunities:0,facts:0}) {
 const actors=Object.fromEntries(Array.from({length:shape.actors},(_,i)=>['actor.'+i,{output:0,fuel:20,facts:Object.fromEntries(Array.from({length:shape.facts},(_,j)=>['fixture.fact.'+j,'synthetic observation '+j]))}]));
 const inventory=Object.fromEntries(Array.from({length:shape.items},(_,i)=>[JSON.stringify({id:'Rough wood log',quality:i+1}),1]));
 const expired=Object.fromEntries(Array.from({length:shape.opportunities},(_,i)=>['fixture.offer.'+i,{due:0,expires:1,status:'expired'}]));
 return [
  {id:'work',version:1,depends:['pacing'],slices:{actors:{schema:1,initial:actors,validate:v=>Object.values(v).every(a=>natural(a.output)&&natural(a.fuel))},inventory:{schema:1,initial:inventory,validate:v=>Object.values(v).every(n=>natural(n))},expired:{schema:1,initial:expired,validate:v=>Object.values(v).every(r=>r.status==='expired'&&natural(r.expires))}},commands:{
   'work.start':(api,p)=>{if(!api.read('actors')[p.actor]||!natural(p.duration))throw Error('bad actor/work');api.schedule('work.finish','job.'+p.actor,api.clock+p.duration,{actor:p.actor});},
   'work.finish':(api,p)=>{const all={...api.read('actors')},a=all[p.actor];all[p.actor]={...a,output:a.output+1+Math.floor(api.random('loot.'+p.actor)*3)};api.write('actors',all);},
   'fixture.fail':api=>{api.random('failure');api.write('actors',{});api.schedule('work.finish','failed',api.clock+1,{actor:'nope'});throw Error('intentional failure');}
  }},
  {id:'rhythm',version:1,depends:['pacing'],slices:{claims:{schema:1,initial:{lastClaim:null,count:0},validate:v=>(v.lastClaim===null||natural(v.lastClaim))&&natural(v.count)}},commands:{
   'service.claim':api=>{validateSchedule(schedule);const c=api.read('claims'),w=recurringWindow(schedule,calendarOrigin+api.clock,c.lastClaim);if(!w.open)throw Error('service closed');api.write('claims',{lastClaim:w.cycle,count:c.count+1});}
  }},
  {id:'pacing',version:1,depends:[],slices:{pacing:{schema:1,initial:normalizePacing({weatherEnabled:true}),validate:v=>JSON.stringify(normalizePacing(v))===JSON.stringify(v)}},commands:{
   'pacing.option':(api,p)=>api.write('pacing',setPacingOption(api.read('pacing'),p.option,p.enabled)),
   // Synthetic meal event, not a native item consumption. No private/native stock.
   'pacing.meal':api=>api.write('pacing',prepareFood(api.read('pacing'),{tags:{food:true},effects:[{duration:120}]},{homeWorld:true}).state)
  },systems:[{id:'played.pacing',run:(api,minutes)=>api.write('pacing',advancePacing(api.read('pacing'),minutes,{homeWorld:true,season:'Spring'}))}]}
 ];
}
export function make(shape){return new Kernel(modules(shape),seeds);}
export function projection(k){return {weather:pacingEffects(k.view('pacing'),{homeWorld:true,outdoors:true,season:'Spring'}),service:recurringWindow(schedule,calendarOrigin+k.clock,k.view('claims').lastClaim)};}
export function startJobs(k,n){for(let i=0;i<n;i++)k.command({id:'start.'+i,type:'work.start',payload:{actor:'actor.'+i,duration:60}});}
