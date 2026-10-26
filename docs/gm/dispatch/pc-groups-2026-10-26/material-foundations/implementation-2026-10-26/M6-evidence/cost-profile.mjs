import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {pathToFileURL} from 'node:url';
import {join,resolve} from 'node:path';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]);
const {queryRenderingSources}=await import(pathToFileURL(join(root,'src/native_rendering_recipes.js')));
const {begin,commit,settle,view,HP}=await import(pathToFileURL(join(root,'src/hp_brewing_state.js')));
const {assessHpPreparation,inspectHpPreparation}=await import(pathToFileURL(join(root,'src/hp_brewing_formula.js')));
const time=fn=>{const values=[];let result;for(let n=0;n<101;n++){const start=performance.now();result=fn();if(n)values.push(performance.now()-start);}values.sort((a,b)=>a-b);return {result,medianMs:values[50],p95Ms:values[95],samples:100};};
const native=time(()=>queryRenderingSources());assert.equal(native.result.cost.fitEvaluations,32);assert.equal(native.result.coverage.complete,true);
const limited=queryRenderingSources({maxCandidates:8});assert.equal(limited.coverage.complete,false);assert.equal(limited.cost.fitEvaluations,8);
assert.deepEqual(queryRenderingSources().sources,native.result.sources);
let state=begin({seed:11,now:0}),now=0;const ctx=()=>({now,moon:'Full'});const act=req=>{state=commit(state,ctx(),req).state;};const slots={};
for(const slot of HP.formula.slots){act({type:'acquire',ingredient:slot.ingredient,route:slot.id==='fluxweed'?'book.hp.route.harvest':['bicorn','boomslang'].includes(slot.id)?'book.hp.route.trusted_supplier':'book.hp.route.student_store'});slots[slot.id]=Object.keys(state.lots).at(-1);}
act({type:'stew',lotId:slots.lacewing});now+=HP.formula.slots[0].minStewMinutes;settle(state,now);
act({type:'prepare',lotId:slots.bicorn,variant:'book.hp.prep.powder_fine'});act({type:'prepare',lotId:slots.boomslang,variant:'book.hp.prep.shred_fine'});
act({type:'acquire',ingredient:'book.hp.ing.lacewing_flies',route:'book.hp.route.trusted_supplier',prepared:true});
const before=JSON.stringify(state);const hp=time(()=>{const projected=view(state,ctx());return {assessment:assessHpPreparation(projected,slots),inspection:inspectHpPreparation(projected,slots)};});
assert.equal(JSON.stringify(state),before);assert.equal(hp.result.inspection.length,6);
const report={native:{catalogue:native.result.catalogue,knownCatalogueRows:33,candidateRows:32,cost:native.result.cost,coverage:native.result.coverage,medianMs:native.medianMs,p95Ms:native.p95Ms,samples:native.samples,
 cadence:'one full query at native recipe registration; no per-tick TagStore consumer',enumeration:'O(catalogue rows), even when fit-evaluation budget truncates',limited:{coverage:limited.coverage,cost:limited.cost}},
 hp:{route:'named pure current-law producer fixture; six selected prepared lots plus one supplier-claim lot; no pacing/native persistence claim from this timing',heldLots:Object.keys(state.lots).length,selectedSlots:6,inspectorRows:6,medianMs:hp.medianMs,p95Ms:hp.p95Ms,samples:hp.samples,ownerUnchanged:true,
 cadence:'actual panel has signature skip before assessment; content rebuild calls assessment directly and within inspector; actual browser result verifies20 unchanged-visible ticks skip content and selection changes invalidate'},
 cacheDecision:'No new index/cache justified by current registration cadence or selected7-lot inspector cost. Preserve actual observer-projected signature and fresh source reads.',timingLimit:'One local machine run; descriptive timings, not hard CI budget or universal scale promise.'};
await writeFile(join(out,'combined-query-cost.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
