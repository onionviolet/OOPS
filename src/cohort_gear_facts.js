import {FEATURE_HARNESS} from './feature_expansion_powers.js';
import {COHORT_COACHES} from './cohort_battle_facts.js';
import {mitigateCombatDamageFromStats} from './combat_math.js';
export const cohortFrameShape=p=>JSON.stringify([p?.body?.form,p?.body?.hands,p?.body?.frameBuild??'ordinary']);
export function cohortFrameFit(state,id,{prospective=false}={}){
 const s=state.simulation,p=s?.people[id],a=state.actors[id],shape=a?.facts['cohort.frameShape'];
 const body=p?.life==='alive'&&p.body?.form==='human'&&(p.body.hands||0)>=2&&p.body.mobile!==false&&(a?.resources['cohort.training']>=1||COHORT_COACHES.includes(id));
 const owned=s?.equipment[id]?.field_frame===FEATURE_HARNESS&&(s?.owners[id]?.[FEATURE_HARNESS]||0)>0&&!Object.values(s?.custody||{}).some(c=>c.holder===id&&c.key===FEATURE_HARNESS);
 const active=!!(body&&(prospective||owned&&(!shape||shape===cohortFrameShape(p)))),stage=Math.max(0,Math.min(3,p?.body?.cohortTempering||0));
 return {active,defenseBonus:active?2:0,blockStrength:active?4:0,blockChance:active?Math.min(.6,.3+.1*stage):0,stage,reason:!body?'This braced frame needs a living mobile human body, two usable hands and practiced field forms.':!prospective&&owned&&shape&&shape!==cohortFrameShape(p)?'These straps were fitted to a different build. Arrange a refit for this body.':'The braced frame uses both hands; physical tempering steadies its control.'};
}
export function cohortFramePreview(state,id){
 const current=cohortFrameFit(state,id),fitted=cohortFrameFit(state,id,{prospective:true}),p=state.simulation?.people[id],base=p?.body?.defense||0;
 return {...current,available:state.simulation?.owners[id]?.[FEATURE_HARNESS]||0,fitted,opponents:COHORT_COACHES.filter(actor=>state.simulation?.people[actor]?.location===p?.location).map(actor=>{
  const coach=state.simulation.people[actor],attack=coach.body.attack*(coach.vitals.stamina<=1?.5:1);
  return {id:actor,attack,currentDamage:mitigateCombatDamageFromStats([attack],{defense:base+current.defenseBonus}),fittedDamage:mitigateCombatDamageFromStats([attack],{defense:base+fitted.defenseBonus})};
 })};
}
