// FD3 second consumer: Gu prepared/loose petals read through ready_stock. Failure scenarios: old save shows the same counts, totals conserve, bad counts refused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {guPetalFacts} from '../src/book_world_gu_domain.js';
import * as RS from '../src/ready_stock.js';
test('prepared and loose counts come back unchanged (old saves: no new key)',()=>{
 assert.deepEqual(guPetalFacts(4,12),{prepared:4,loose:12});
 assert.deepEqual(guPetalFacts(0,0),{prepared:0,loose:0});
});
test('seam ready/spend effects over the same spec conserve the total',()=>{
 const spec={prefix:'gu.',carried:'loose',ready:'prepared',kinds:['petal'],capacity:Infinity,factPrefix:'gu.petals',readyFact:'prepared'};
 const r={'gu.loose.petal':12,'gu.prepared.petal':4},ap=es=>{for(const e of es)r[e.key]+=e.amount;};
 ap(RS.readyEffects(spec,'petal',8));assert.deepEqual([r['gu.prepared.petal'],r['gu.loose.petal']],[12,4]);
 ap(RS.spendEffects(spec,'petal'));assert.equal(r['gu.prepared.petal']+r['gu.loose.petal'],15);
});
test('a negative or fractional count is refused',()=>{
 for(const [p,l] of [[-1,0],[0,1.5]]){const bad=[];guPetalFacts(p,l,(ok,m)=>{if(!ok)bad.push(m);});assert.equal(bad.length,1);}
});
