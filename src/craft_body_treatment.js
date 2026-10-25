// The crafting-depth owner retains current-body conditioning and a separate
// medicinal residue budget. Tolerance/poison duration remain their own laws.
import {check,natural} from './basics.js';
export const bodyKey=c=>JSON.stringify([c.body?.id??'native.player.body',c.body?.instanceId??null,c.body?.form??'human']);
export const freshTreatment=c=>({binding:bodyKey(c),conditioning:0,impurity:0,capacity:20,apparatus:0,job:null});
export function validateTreatment(b){
 if(b===undefined)return;
 check(b&&Object.keys(b).filter(k=>k!=='channels').sort().join(',')==='apparatus,binding,capacity,conditioning,impurity,job'&&typeof b.binding==='string'&&b.binding.length<=300,'Invalid medicinal body.');
 check((b.channels===undefined||natural(b.channels)&&b.channels<=3)&&['conditioning','impurity','capacity','apparatus'].every(k=>natural(b[k]))&&b.apparatus<=3&&b.capacity>=20&&b.capacity<=50&&b.impurity<=treatmentCapacity(b)&&b.conditioning<=200,'Invalid medicinal budget.');
 if(b.job)check(Object.keys(b.job).sort().join(',')==='at,due,kind'&&natural(b.job.at)&&natural(b.job.due)&&b.job.due>b.job.at&&['purge','capacity','channel'].includes(b.job.kind),'Invalid medicinal treatment.');
}
export const treatmentCapacity=b=>b.capacity+2*(b.channels||0);
export function treatmentNow(value,c){validateTreatment(value);return value?.binding===bodyKey(c)?structuredClone(value):{...freshTreatment(c),apparatus:value?.apparatus??0};}
export function consumeTablet(value,product,c){
 const b=treatmentNow(value,c),power=product.outputs.permanent?.conditioning||0;
 check(power>0,'This preparation carries no body-conditioning medicine.');
 const residue=1+Math.ceil((product.thermal?.impurity||0)/100);
 check(b.impurity+residue<=treatmentCapacity(b),`Medicinal residue ${b.impurity}+${residue} exceeds this body's capacity ${treatmentCapacity(b)}. Purge residue or expand capacity first.`);
 const gain=Math.min(200-b.conditioning,Math.max(1,Math.floor(power/5)));check(gain>0,'This body has integrated the conditioning this tablet can presently offer.');
 b.impurity+=residue;b.conditioning+=gain;return {body:b,gain,residue};
}
export function startTreatment(value,action,c){
 const b=treatmentNow(value,c);check(!b.job,'Finish the pending medicinal soak first.');
 let spend;
 if(action==='channel'){
  const next=(b.channels||0)+1;check(next<=3,'This treatment presently supports three bodily channels.');check(b.apparatus>0,'Fit a real treatment vessel first.');check(b.conditioning>=20*next&&c.temperingStage>=next,`Channel ${next} needs this body's conditioning ${20*next} and actual tempering stage ${next}.`);
  b.job={kind:'channel',at:c.clock,due:c.clock+24*next};spend={id:'Iron ingot',count:2*next};
 }else if(action==='apparatus'){check(b.apparatus<3,'The Village bench already holds its largest fitted vessel.');b.apparatus++;spend={id:'Iron ingot',count:2};}
 else {check(['purge','capacity'].includes(action),'Unknown treatment.');check(action==='purge'?b.impurity>0:b.capacity<50,action==='purge'?'No medicinal residue to purge.':'This body has reached the current treatment’s 50-residue capacity.');
  check(b.apparatus>0,'Fit a treatment vessel at the bench first (two Iron ingots).');
  const duration=action==='purge'?Math.max(6,12-2*(b.channels||0)):24;b.job={kind:action,at:c.clock,due:c.clock+duration};spend={id:'Charcoal',count:action==='purge'?2:4};}
 return {body:b,spend};
}
export function finishTreatment(value,c){
 const b=treatmentNow(value,c);if(!b.job||b.job.due>c.clock)return b;
 if(b.job.kind==='channel')b.channels=(b.channels||0)+1;
 else if(b.job.kind==='purge')b.impurity=Math.max(0,b.impurity-5*b.apparatus*(1+(b.channels||0)));else b.capacity=Math.min(50,b.capacity+5);
 b.job=null;return b;
}
