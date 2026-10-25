import {forkWeights,forkBonuses} from './vessel_forks.js';
export function renderForks({host,state,disabled,act,render,notice}){
 const f=state.forks,weights=forkWeights(f),bonus=forkBonuses(f),p=document.createElement('p');p.textContent=`Attention patterns: ${f?.slots.length||0}/2. Your own drill gets ${weights[0]}% of actual practice minutes; patterns share the rest on a retained hundred-minute schedule. Their learned settling adds ${(bonus.odds/100).toFixed(2)} purification percentage points; their learned breathing reduces precise-work energy by ${(bonus.work/10).toFixed(1)}%. Patterns retain their own practice, without copying it into your bodily drill or holding another reserve.`;host.append(p);
 const button=(id,label,blocked=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.mistglassAction='method:vessel:fork:'+id;b.disabled=disabled||blocked;b.onclick=()=>{try{act('method:vessel:fork:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};host.append(b);};
 button('add','Shape an attention pattern · 2 bridge nodes + 1 condensate; both drills Integrated and one law',state.nodes.bridge<2||(f?.slots.length||0)>=2);
 for(const [i,s]of (f?.slots||[]).entries()){
  const t=document.createElement('p');t.textContent=`Pattern ${i+1}: ${s.task}, ${s.weight}% attention; breathing ${s.minutes.breath}/48, settling ${s.minutes.settling}/48.`;host.append(t);
  for(const task of ['breath','settling'])button(`task:${i}:${task}`,`Pattern ${i+1}: study ${task}`,s.task===task);
  for(const weight of [0,25,50,75,100])button(`weight:${i}:${weight}`,`Pattern ${i+1}: ${weight}% attention`,weight===s.weight||weights.slice(1).reduce((n,w)=>n+w,0)-s.weight+weight>100);
 }
}
