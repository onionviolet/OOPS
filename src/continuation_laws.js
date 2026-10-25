// Knowledge can be anchored by this connection; bodies, nodes and fuel stay put.
import {check,natural} from './basics.js';
import {setSavedPurse} from './money.js';
const ids=['flow','still'];
export const freshLawMemory=()=>({best:{flow:0,still:0},anchored:{flow:0,still:0}});
export function validateLawMemory(m){
 if(m===undefined)return;check(m&&Object.keys(m).sort().join(',')==='anchored,best','Invalid remembered law record.');
 for(const key of ['best','anchored'])check(m[key]&&Object.keys(m[key]).sort().join(',')==='flow,still'&&ids.every(id=>natural(m[key][id])&&m[key][id]<=40),'Invalid remembered law depth.');
 check(ids.every(id=>m.anchored[id]<=m.best[id]),'A law anchor needs actual prior understanding.');
}
export function observeLaws(c,expansion){
 if(c.challenge)return;const depth=expansion?.worldAdaptation?.techniques?.discipline?.depth;if(!depth||!ids.some(id=>depth[id]>0))return;
 c.lawMemory ||= freshLawMemory();for(const id of ids)c.lawMemory.best[id]=Math.max(c.lawMemory.best[id],depth[id]||0);validateLawMemory(c.lawMemory);
}
export function lawMemoryView(c,money=0){
 const m=c.lawMemory||freshLawMemory();validateLawMemory(m);
 return ids.map(id=>({id,best:m.best[id],anchored:m.anchored[id],cost:100*2**m.anchored[id],eligible:!c.challenge&&m.anchored[id]<m.best[id],affordable:money>=100*2**m.anchored[id]}));
}
export function purchaseLawAnchor(save,c,id){
 check(ids.includes(id),'Choose a known local law.');const q=lawMemoryView(c,save.character.money).find(q=>q.id===id);check(q.eligible,'Deepen this law through actual practice before anchoring its next depth.');check(q.affordable,`Needs ${q.cost} carried native coins.`);
 setSavedPurse(save,save.character.money-q.cost,'continuation.law_anchor');c.lawMemory.anchored[id]++;validateLawMemory(c.lawMemory);
}
