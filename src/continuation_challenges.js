// Disposable lives use the existing flat continuation snapshots. The only
// exports here are observed crafting knowledge or one unit of trial learning.
import {check,natural,sameJson} from './basics.js';
import {createCraftState} from './craft_state.js';
import {fresh as freshPledges} from './pledges.js';
export const CHALLENGE_GOALS=Object.freeze({
 experiment:{label:'Two observed preparations',description:'In a fresh life, drink preparations and personally observe two distinct oral effects. Return your observed recipe/material knowledge. No items, body conditioning, tolerance, money or player levels export.'},
 trial:{label:'A measured breakthrough',description:'In a fresh life, earn readiness and accept one graded breakthrough. Return one unit of failure learning to your original practice record. The challenge stage, strength, gear and stock stay here.'}
});
export function challengeProgress(save,kind){
 if(kind==='trial')return {have:(save.pledges?.trial.history||[]).some(h=>h.passed&&h.grade>0)?1:0,need:1};
 const effects=new Set([...(save.observedCraftEffects||[]),...Object.entries(save.crafting?.knowledge?.player||{}).filter(([id])=>save.crafting.products[id]).flatMap(([,k])=>k.facts.filter(f=>f.startsWith('effect:oral.')))]);return {have:effects.size,need:2};
}
export function validateChallenge(c){
 if(c===undefined||c===null)return;
 check(c&&Object.keys(c).sort().join(',')==='kind,lifeId,parent,start'&&Object.hasOwn(CHALLENGE_GOALS,c.kind)&&typeof c.lifeId==='string'&&typeof c.parent==='string'&&Number.isFinite(c.start),'Invalid isolated challenge.');
}
export function challengeExport(parent,challenge,kind){
 const next=structuredClone(parent);
 if(kind==='trial'){next.pledges||=freshPledges();next.pledges.trial.learning=(next.pledges.trial.learning||0)+1;return {next,exported:1};}
 const source=challenge.crafting,observed=source?.knowledge?.player||{},ids=Object.keys(observed).filter(id=>source.products[id]);
 check(ids.length>0,'No observed preparation knowledge to return.');
 const owner=next.crafting||createCraftState({world:'base.frontier',life:0});
 const merge=(key,id,value)=>{const prior=owner[key][id];check(!prior||sameJson(prior,value),'Conflicting frozen challenge knowledge.');owner[key][id]=structuredClone(value);};
 for(const id of ids){const p=source.products[id];merge('products',id,p);for(const [,material] of p.inputs)if(source.materials[material])merge('materials',material,source.materials[material]);}
 owner.knowledge.player||={};
 const materialIds=new Set(ids.flatMap(id=>source.products[id].inputs.map(i=>i[1]))),known=[...ids,...Object.keys(observed).filter(id=>materialIds.has(id)||id.startsWith('authored:')&&materialIds.has(id.slice(9)))];
 for(const id of known){const a=owner.knowledge.player[id],b=observed[id];owner.knowledge.player[id]=a?{facts:[...new Set([...a.facts,...b.facts])].sort(),firstAt:Math.min(a.firstAt,b.firstAt),lastAt:Math.max(a.lastAt,b.lastAt)}:structuredClone(b);}
 owner.sequence++;next.crafting=owner;return {next,exported:ids.length};
}
export function validateChallengeHistory(history){
 if(history===undefined)return;check(Array.isArray(history)&&history.length<=24,'Invalid challenge history.');
 for(const h of history)check(h&&Object.hasOwn(CHALLENGE_GOALS,h.kind)&&typeof h.completed==='boolean'&&natural(h.exported)&&natural(h.minutes),'Invalid challenge receipt.');
}
