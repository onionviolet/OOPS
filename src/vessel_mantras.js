// Original local scripture composed from an understood law and its real vessel.
// Practice time and energy remain the existing discipline and native pool.
import {check,natural} from './basics.js';
const patterns=['current','pool','woven'];
export function validateMantras(m,depth){
 if(m===undefined)return;
 check(m&&typeof m==='object'&&!Array.isArray(m)&&Object.keys(m).length>0&&Object.keys(m).every(k=>['flow','still'].includes(k)),'Invalid vessel mantras.');
 for(const [law,r]of Object.entries(m))check(r&&Object.keys(r).sort().join(',')==='pattern,tier'&&natural(r.tier)&&r.tier>=1&&r.tier<=3&&r.tier<=depth[law]&&patterns.includes(r.pattern),'Invalid composed mantra.');
}
export function mantraName(law,r){
 if(!r)return null;
 const image={current:'the turning current',pool:'the held pool',woven:'the woven crossing'}[r.pattern],verb=law==='flow'?'Carry':'Settle';
 return `${verb} ${image} · verse ${r.tier}`;
}
export function mantraEffects(d){
 const r=d.mantras?.[d.law];
 if(!r)return {rate:0,odds:0,work:0};
 // The recorded pattern is a physical method, not a new random affix roll.
 return d.law==='flow'?{rate:r.tier*(r.pattern==='current'?30:20),odds:0,work:r.pattern==='woven'?5*r.tier:0}:{rate:0,odds:r.tier*(r.pattern==='pool'?75:50),work:5*r.tier};
}
export function mantraQuote(t,law){
 check(['flow','still'].includes(law),'Choose a local law for this verse.');const d=t.discipline;check(d,'Shape the actual vessel first.');
 const tier=(d.mantras?.[law]?.tier||0)+1,drill=law==='flow'?'breath':'settling',cost=500*2**(tier-1),comprehension=16*4**(tier-1);
 const pattern=d.nodes.bridge>0?'woven':d.nodes.flow>d.nodes.still?'current':'pool',reasons=[];
 if(tier>3)reasons.push('The present local method supports three verses.');
 if(d.depth[law]<tier)reasons.push(`Understand ${law} law to depth ${tier} before composing this verse.`);
 if((t.minutes[drill]||0)<16*tier)reasons.push(`Practice the matching drill for ${16*tier} actual minutes.`);
 if(d.nodes[law]+d.nodes.bridge<1)reasons.push('Condense a matching real node or bridge to sustain this recitation.');
 if(d.comprehension<comprehension)reasons.push(`Hold ${comprehension} already-played minutes of unspent comprehension.`);
 return {eligible:!reasons.length,reasons,law,tier,pattern,cost,comprehension,name:mantraName(law,{tier,pattern})};
}
export function composeMantra(t,law){
 const q=mantraQuote(t,law);check(q.eligible,q.reasons.join(' '));
 t.discipline.comprehension-=q.comprehension;t.discipline.mantras={...t.discipline.mantras,[law]:{tier:q.tier,pattern:q.pattern}};validateMantras(t.discipline.mantras,t.discipline.depth);return q.cost;
}
