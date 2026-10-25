// Earned execution habits are knowledge, not a new energy pool or bodily tier.
// This Frontier school's two applications do not establish laws in every world.
import {check} from './basics.js';
export const INTENTS={patient:{name:'Patient hands',effect:'Two stability in native tempering and five percentage points less gallery-search risk.'},committed:{name:'Committed stroke',effect:'One extra score from pressing an ordeal, at one extra composure cost.'}};
const key=id=>'cultivation.intent.'+id;
export function intentEvidence(root){
 const f=root?.worlds?.['base.frontier']?.facts||{},a=root?.worldAdaptation?.techniques?.discipline;
 const patient=!!root?.simulation?.knowledge?.player?.['drainage.flowLesson']&&f['drainage.remaining']===0;
 const committed=!!a&&a.depth&&Math.max(...Object.values(a.depth))>=1&&(root.worldAdaptation?.pathWork?.completed||0)>=1;
 return {patient,committed};
}
export function intentEffects(root){
 if(root?.actors?.player?.worldId!=='base.frontier')return {stability:0,searchRisk:0,pressScore:0,pressCost:0};
 const f=root.actors.player.facts||{},id=f[key('selected')];if(!INTENTS[id]||f[key(id)]!==true)return {stability:0,searchRisk:0,pressScore:0,pressCost:0};
 return id==='patient'?{stability:2,searchRisk:5,pressScore:0,pressCost:0}:{stability:0,searchRisk:0,pressScore:1,pressCost:1};
}
export function intentView(root){const f=root?.actors?.player?.facts||{},proof=intentEvidence(root);return {selected:f[key('selected')]||null,choices:Object.entries(INTENTS).filter(([id])=>proof[id]||f[key(id)]===true).map(([id,d])=>({id,...d,learned:f[key(id)]===true,proof:proof[id]}))};}
export function stageIntent(plan,id,c){
 check(INTENTS[id]&&c.alive&&c.ready&&c.world==='base.frontier','Use your living free attention in the Frontier.');
 check(!c.ordeal,'Finish the current ordeal before changing its execution habit.');
 const f=plan.state.actors.player.facts,learned=f[key(id)]===true;
 check(learned||intentEvidence(plan.state)[id],'Complete the actual corresponding field dossier or precise-path study first.');
 check(f[key('selected')]!==id,'This known habit is already selected.');
 check(plan.state.clock-c.clock===(learned?5:15),'Finish the intervening decision before this reflection.');
 check(plan.state.actors.player.worldId==='base.frontier'&&plan.state.chronicle?.life.endedAt==null&&plan.state.simulation?.people.player?.life!=='dead','The acting life or world changed during reflection.');
 f[key(id)]=true;f[key('selected')]=id;plan.state.sequence++;return plan;
}
export function validateIntents(root){const f=root?.actors?.player?.facts||{};for(const id of Object.keys(INTENTS))check(f[key(id)]===undefined||f[key(id)]===true,'Invalid earned intent.');check(f[key('selected')]===undefined||!!INTENTS[f[key('selected')]]&&f[key(f[key('selected')])]===true,'An active intent needs its actual earned knowledge.');}
