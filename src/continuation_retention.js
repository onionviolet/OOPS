// A learning echo carries practice as future aptitude, never as copied bodily
// skill milestones. Challenge insight or native coins fund its explicit anchors.
import {check,natural} from './basics.js';
import {setSavedPurse} from './money.js';
const safeSkill=id=>typeof id==='string'&&id.length>0&&id.length<=160&&!['__proto__','constructor','prototype'].includes(id);
export const freshRetention=()=>({schema:1,credits:0,anchors:{}});
export function validateRetention(r){
 if(r===undefined)return;check(r&&Object.keys(r).sort().join(',')==='anchors,credits,schema'&&r.schema===1&&natural(r.credits)&&r.anchors&&Object.keys(r.anchors).length<=512,'Invalid continuing aptitude.');
 for(const [id,n] of Object.entries(r.anchors))check(safeSkill(id)&&natural(n)&&n>0,'Invalid aptitude anchor.');
}
export function aptitudeMultipliers(c){
 if(!c?.retention||c.challenge)return {};validateRetention(c.retention);
 return Object.fromEntries(Object.entries(c.retention.anchors).filter(([id])=>(c.mastery[id]||0)>0).map(([id,n])=>[id,1+.05*Math.log1p(c.mastery[id]/100)*Math.sqrt(n)]));
}
export function purchaseAnchor(save,c,kind,skill){
 check(safeSkill(skill)&&(c.mastery[skill]||0)>0&&c.knownMastery.includes(skill),'Anchor an actually practiced and known skill.');
 c.retention ||= freshRetention();const r=c.retention,count=r.anchors[skill]||0,cost=50*(count+1);
 if(kind==='insight'){check(r.credits>0,'Complete an isolated challenge to earn insight.');r.credits--;}
 else if(kind==='coin'){check(Number.isSafeInteger(cost)&&Number.isFinite(save.character.money)&&save.character.money>=cost,`Needs ${cost} native coins for this anchor.`);setSavedPurse(save,save.character.money-cost,'continuation.aptitude_anchor');}
 else check(false,'Unknown anchor funding.');
 r.anchors[skill]=count+1;validateRetention(r);
}
export function retentionView(c,money=0){
 const r=c.retention||freshRetention(),multipliers=aptitudeMultipliers(c);return {credits:r.credits,choices:(c.knownMastery||[]).filter(id=>(c.mastery[id]||0)>0).map(skill=>({skill,anchors:r.anchors[skill]||0,multiplier:multipliers[skill]||1,cost:50*((r.anchors[skill]||0)+1),affordable:money>=50*((r.anchors[skill]||0)+1)}))};
}
