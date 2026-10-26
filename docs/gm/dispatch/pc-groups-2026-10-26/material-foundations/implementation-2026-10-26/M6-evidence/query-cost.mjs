// PC43: real native selector, registration cadence and bounded diagnostic work.
// Timing is local descriptive evidence; evaluation counts are the stable budget.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {queryRenderingSources, renderingSources} from '../../../../../../../src/native_rendering_recipes.js';
import {nativeCatalogue} from '../../../../../../../src/native_material_catalogue.js';
const times=[];let result;
for(let i=0;i<101;i++) {
 const before=performance.now(); result=queryRenderingSources();
 const elapsed=performance.now()-before;
 if(i)times.push(elapsed);
}
times.sort((a,b)=>a-b);
assert.deepEqual(result.sources,renderingSources());
assert.equal(result.coverage.complete,true);
assert.equal(result.cost.fitEvaluations,Object.keys(nativeCatalogue.materials).length-1);
const limited=queryRenderingSources({maxCandidates:8});
assert.equal(limited.coverage.complete,false);assert.equal(limited.cost.fitEvaluations,8);
assert.deepEqual(queryRenderingSources().sources,result.sources);
console.log(JSON.stringify({consumer:'registerRenderingRecipes -> queryRenderingSources -> gradeMaterialFit',
 cadence:'one complete query per recipe registration; no production TagStore instance or recurring UI query found',
 result,limited:{coverage:limited.coverage,cost:limited.cost},
 timing:{runs:100,medianMs:times[50],p95Ms:times[95]},cache:'none; each call reads supplied catalogue and revision; mutable observer/stock state is not cached'},null,2));
