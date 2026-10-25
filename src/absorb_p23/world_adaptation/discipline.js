import {validateMantras,mantraEffects,composeMantra,mantraName} from '../../vessel_mantras.js';
import {validateForks,changeForks,forkBonuses} from '../../vessel_forks.js';
import {validateGeometry,geometryView,arrangeVessel,reconcileGeometry,fusionPreview} from '../../vessel_geometry.js';
// Optional Mistglass vessel mechanics. Condensate remains in native energy;
// comprehension and conditioning describe played practice, not spendable energy.
import {check,natural} from '../../basics.js';
export const freshDiscipline=()=>({schema:1,nodes:{flow:0,still:0,bridge:0},impurity:0,forced:false,paired:false,phase:0,residue:0,bodyMinutes:0,comprehension:0,depth:{flow:0,still:0},law:'flow'});
const keys=(o,w)=>o&&Object.keys(o).sort().join(',')===w.split(',').sort().join(',');
export function validateDiscipline(d){
 if(d===undefined)return;
 check(keys(Object.fromEntries(Object.entries(d||{}).filter(([k])=>k!=='geometry'&&k!=='forks'&&k!=='mantras')),'schema,nodes,impurity,forced,paired,phase,residue,bodyMinutes,comprehension,depth,law')&&d.schema===1,'Invalid vessel schema.');
 check(keys(d.nodes,'flow,still,bridge')&&Object.values(d.nodes).every(natural)&&keys(d.depth,'flow,still')&&Object.values(d.depth).every(n=>natural(n)&&n<=40),'Invalid vessel nodes/law.');
 check(['impurity','phase','residue','bodyMinutes','comprehension'].every(k=>natural(d[k]))&&d.phase<2&&d.residue<8&&d.bodyMinutes<=120&&typeof d.forced==='boolean'&&typeof d.paired==='boolean'&&['flow','still'].includes(d.law),'Invalid vessel practice.');validateMantras(d.mantras,d.depth);validateGeometry(d.geometry,d.nodes);validateForks(d.forks);check(!d.paired||!d.forks||d.forks.slots.every(s=>s.weight===0),'Choose paired attention or allocated patterns for this actual practice schedule.');
}
const plus=(a,b)=>{const n=a+b;check(natural(n),'Vessel practice overflow.');return n;};
export function disciplineView(value){
 validateDiscipline(value);const d=value||freshDiscipline(),flow=d.nodes.flow+d.nodes.bridge,still=d.nodes.still+d.nodes.bridge,g=geometryView(d),fork=forkBonuses(d.forks),mantra=mantraEffects(d);
 // Saturating channels avoid unlimited linear output. These are this vessel's
 // current geometry, not universe-wide caps or extra energy storage.
 return {state:structuredClone(d),geometry:g,fusion:fusionPreview(d,true),mantra:d.mantras?.[d.law]?{name:mantraName(d.law,d.mantras[d.law]),...mantra}:null,ratePermille:1000+mantra.rate+g.rateBonus+Math.floor(200*flow/(flow+4))+(d.forced?300:0)+(d.law==='flow'?25*d.depth.flow:0),
  oddsBonus:mantra.odds+fork.odds+g.oddsBonus+Math.floor(500*still/(still+4))+Math.floor(d.bodyMinutes/30)*50+(d.law==='still'?50*d.depth.still:0)-100*d.impurity,
  workPermille:1000-mantra.work-fork.work-Math.floor(150*still/(still+4)),nextLawCost:1000*2**d.depth[d.law],nextComprehension:16*2**d.depth[d.law]};
}
export function advanceDiscipline(d,minutes){
 if(!d)return undefined;const n=structuredClone(d);n.bodyMinutes=Math.min(120,n.bodyMinutes+minutes);n.comprehension=plus(n.comprehension,minutes);
 if(d.forced){const total=BigInt(d.residue)+BigInt(minutes);n.impurity=plus(n.impurity,Number(total/8n));n.residue=Number(total%8n);}
 return n;
}
export const disciplineActions=Object.freeze([
 ['open','Shape a vessel · 1 condensate'],['node:flow','Condense a flow node · 1 condensate'],['node:still','Condense a still node · 1 condensate'],
 ['fuse:all','Fuse all matched nodes · preview the resulting bridges and residue'],['fuse','Fuse one flow + one still into a bridge · leaves 1 impurity'],['purge','Purge 1 impurity · 0.5 condensate'],
 ['force','Toggle forced absorption · +30% throughput, +1 impurity per 8 practice minutes'],['pair','Toggle paired attention · alternate real minutes between both drills; requires both Practiced'],
 ['mantra:flow','Compose or deepen a flow mantra'],['mantra:still','Compose or deepen a stillness mantra'],
 ['law:flow','Study flow law'],['law:still','Study stillness law'],['deepen','Deepen the selected law · geometric condensate and comprehension cost']
]);
export function changeDiscipline(techniques,action,reserve,controlledPurge=false,lawMemory=null){
 const next=structuredClone(techniques),had=!!next.discipline;next.discipline ||= freshDiscipline();const d=next.discipline,v=disciplineView(d);let cost=0;
 if(action==='open'){check(!had,'A vessel is already shaped.');cost=1000;if(lawMemory){check(Object.keys(lawMemory).sort().join(',')==='flow,still'&&Object.values(lawMemory).every(n=>natural(n)&&n<=40),'Invalid anchored local understanding.');d.depth={...lawMemory};}}
 else {check(had,'Shape a vessel first.');
  if(action.startsWith('fork:')){cost=changeForks(d,next,action.slice(5));reconcileGeometry(d);}
  else if(action.startsWith('mantra:'))cost=composeMantra(next,action.slice(7));
  else if(action==='node:flow'||action==='node:still'){cost=1000;const id=action.slice(5);d.nodes[id]=plus(d.nodes[id],1);}
  else if(action.startsWith('layout:'))arrangeVessel(d,action.slice(7));
  else if(action==='fuse:all'){const q=fusionPreview(d,true);check(q.eligible,'Fusion needs at least one flow and one still node.');d.nodes=q.after;d.impurity=q.impurity;reconcileGeometry(d);}
  else if(action==='fuse'){check(d.nodes.flow>0&&d.nodes.still>0,'Fusion needs one flow and one still node.');d.nodes.flow--;d.nodes.still--;d.nodes.bridge=plus(d.nodes.bridge,1);d.impurity=plus(d.impurity,1);reconcileGeometry(d);}
  else if(action==='purge'){check(d.impurity>0,'This vessel has no residue to purge.');cost=controlledPurge?250:500;d.impurity--;}
  else if(action==='force')d.forced=!d.forced;
  else if(action==='pair'){check(next.minutes.breath>=16&&next.minutes.settling>=16,'Practice both drills to 16 minutes before dividing attention.');d.paired=!d.paired;if(d.paired&&d.forks)for(const s of d.forks.slots)s.weight=0;}
  else if(action==='law:flow'||action==='law:still')d.law=action.slice(4);
  else if(action==='deepen'){cost=v.nextLawCost;check(d.comprehension>=v.nextComprehension,`Needs ${v.nextComprehension} actual mist-practice minutes of comprehension.`);check(d.depth[d.law]<40,'This vessel cannot presently resolve a finer law.');d.comprehension-=v.nextComprehension;d.depth[d.law]++;}
  else check(false,'Unknown vessel action.');
 }
 check(natural(reserve)&&reserve>=cost,`Needs ${cost/1000} native condensate; you hold ${reserve/1000}.`);validateDiscipline(d);return {next,cost};
}
