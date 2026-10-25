import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {freshCombatReview,validateCombatReview,startReview,observeReview,observeRecovery,finishReview,diagnoseCombat,publicCombatForecast} from './combat_review.js';
let state=freshCombatReview(),ports=null,panel=null;
export function configureCombatReview(operations){ports=operations;}
const binding={get:()=>state,set:v=>{state=v;}};
function frame(){
 const combat=ports?.getCombat?.();if(!combat||combat.is_ended||combat.is_special_combat||!combat.attackers?.[0]?.tags?.main_character)return null;
 return {combat,hero:ports.readout(combat,{fighter_index:0,is_attacker:true}),foes:combat.defenders.map((_,fighter_index)=>ports.readout(combat,{fighter_index,is_attacker:false}))};
}
function begin({id,place}){const f=frame();if(!f)return;state=startReview(state,{id:String(id),place,heroHP:f.hero.health.current,foeHP:f.foes.reduce((n,r)=>n+r.health.current,0),foes:f.foes.map(r=>r.name)});}
const view=()=>{const f=frame();return {visible:!!f||state.recent.length>0,forecast:f?publicCombatForecast(f.hero,f.foes):null,current:state.current?{...state.current,seen:undefined,diagnosis:diagnoseCombat(state.current)}:null,recent:state.recent.map(r=>({...r,diagnosis:diagnoseCombat(r)}))};};
registerDomain({id:'combatReview',initialState:()=>null,save:()=>state.current||state.recent.length?structuredClone(state):undefined,
 validate:validateCombatReview,migrate:s=>s==null?freshCombatReview():structuredClone(s),load:s=>{state=s??freshCombatReview();},
 commands:{begin,recovered:({key,amount})=>{state=observeRecovery(state,key,amount);},observe:({id,key,event})=>{state=observeReview(state,String(id),key,event);},finish:({id,outcome})=>{state=finishReview(state,String(id),outcome);},combatBindings:()=>[binding]},
 projection:view,refresh:()=>panel?.render(),panels:[()=>{panel=createPanel();}]});
function createPanel(){
 const root=document.createElement('section');root.id='combat_review_panel';root.className='expedition_panel';let signature='';
 const n=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;},number=x=>x===null?'unresolved':x.toFixed(1);
 const render=()=>{if(!root.isConnected)return;const v=view(),sig=JSON.stringify(v);if(sig===signature)return;signature=sig;root.replaceChildren(n('h2','Combat forecast and review'));
  if(v.forecast){root.append(n('p',v.forecast.assumptions),n('p',`Estimated seconds to clear ${number(v.forecast.secondsToKill)}; to fall ${number(v.forecast.secondsToFall)}.`));for(const r of v.forecast.pairs)root.append(n('p',`${r.name}: about ${number(r.outgoing)} damage per player swing and ${number(r.incoming)} per opposing swing.${r.uncertain?' Shield present: actual blocking needs observed exchanges.':''}`));}
  if(v.forecast?.protection.length){const table=n('table','');table.dataset.combatProtection='';const caption=n('caption','Your current defensive layers'),header=n('tr','');for(const label of ['Mechanism','Current value','What it changes'])header.append(n('th',label));const head=n('thead',''),body=n('tbody','');head.append(header);table.append(caption,head,body);for(const r of v.forecast.protection){const row=n('tr','');row.append(n('th',r.layer),n('td',`${r.value.toFixed(3).replace(/\.?0+$/,'')} ${r.unit}`),n('td',r.meaning));body.append(row);}root.append(table);}
  for(const r of [...(v.current?[v.current]:[]),...v.recent.slice(0,6)])root.append(n('p',`${r.place}: ${r.foes.join(', ')} · ${r.outcome}; ${r.dealt.toFixed(1)} dealt / ${r.taken.toFixed(1)} taken, ${(r.recovered||0).toFixed(1)} observed charged recovery, ${r.outgoing} outgoing / ${r.incoming} incoming attacks. ${r.diagnosis.cause}: ${r.diagnosis.advice} Gross exchange means before recovery: to clear ${number(r.diagnosis.exchangesToKill)} / to fall ${number(r.diagnosis.exchangesToFall)}.`));
 };
 definePanel({id:'combat-review',title:'Combat forecast and review',role:'records',node:root,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>view().visible,eligible:()=>view().visible});render();return {render};
}
