import test from 'node:test';
import assert from 'node:assert/strict';
import {frontierCatalogue as cat, frontierBrewLaw as law} from '../src/craft_content_frontier.js';
import {generateMaterial} from '../src/craft_materials.js';
import {resolveBatch} from '../src/craft_resolver.js';
import {createFailureLedger, forecastFromLedger, recordBatchAttempt, validateFailureLedger} from '../src/craft_failure_ledger.js';
import {formatBatchName, parseBatchName} from '../src/craft_item_name.js';

const water = cat.materials['Spring water'], chalk = cat.materials['Lime chalk'];
const brew = (process, extra = []) => resolveBatch(law, {inputs: [{material: water, qty: 1}, {material: chalk, qty: 1, role: 'catalyst'}, ...extra], process, stations: ['hearth']});
const req = process => ({materials: [water.id], process});

test('failure ledger: forecast changes after a recorded failure and survives reload', () => {
    const result = brew([{op: 'steep', level: 1}]);
    assert.deepEqual(result.product.outputs, {}, 'water plus chalk catalyst makes nothing');
    const before = createFailureLedger();
    assert.equal(forecastFromLedger(before, req([['steep', 1]])).verdict, 'untried');
    const after = recordBatchAttempt(before, result);
    assert.equal(before.pairs[water.id], undefined, 'input ledger is untouched');
    const f = forecastFromLedger(after, req([['steep', 1]]));
    assert.deepEqual([f.verdict, f.tries, f.reasons], ['known-fail', 1, ['inert']]);
    assert.equal(forecastFromLedger(after, req([['steep', 2]])).verdict, 'near');
    const reloaded = validateFailureLedger(JSON.parse(JSON.stringify(after)));
    assert.deepEqual(forecastFromLedger(reloaded, req([['steep', 1]])), f);
    assert.equal(forecastFromLedger(recordBatchAttempt(reloaded, result), req([['steep', 1]])).tries, 2);
});

test('failure ledger: successes are not recorded and corrupt ledgers are rejected', () => {
    const herb = generateMaterial(cat, 'reedherb', {root: 1, scope: 'w/meadow', index: 0}).value;
    const ok = resolveBatch(law, {inputs: [{material: herb, qty: 2}], process: []});
    const empty = createFailureLedger();
    assert.ok(Object.keys(ok.product.outputs).length, 'herb brews something');
    assert.equal(recordBatchAttempt(empty, ok), empty);
    assert.throws(() => validateFailureLedger({family: 'craft.failures@1', pairs: {a: {materials: ['b'], tries: [], count: 1}}}), /Corrupt/);
});

test('item name grammar: a crafted name parses back to its inputs and process', () => {
    const {product} = brew([{op: 'steep', level: 1}, {op: 'boil', level: 2}]);
    const name = formatBatchName(product);
    assert.match(name, /^Herbal vial \[/);
    const parsed = parseBatchName(name);
    assert.deepEqual(parsed.inputs, product.inputs);
    assert.deepEqual(parsed.process, product.process);
    const odd = {carrier: 'Odd [thing]', inputs: [['consumed', 'a+b*c@1 ^|>#%', 3, 2]], process: []};
    assert.deepEqual(parseBatchName(formatBatchName(odd)), odd);
    assert.throws(() => parseBatchName('Plain sword'), /Not a batch name/);
});
test('wired ledger domain: failed batch changes the adapter forecast, round-trips its save slice, hides unknown residue',async()=>{
 const {domainRegistry}=await import('../src/domain_registry.js');
 await import('../src/crafting_domain.js');const d=await import('../src/craft_ledger_domain.js');
 const {catalogue,law,materialKey}=await import('../src/crafting_frontier_runtime.js');
 const {resolveBatch}=await import('../src/craft_resolver.js');
 const water=catalogue.materials['Spring water'];
 d.setLedgerOwner(null);
 // Spring water alone is inert in the frontier law; its key is not a gathered lot, so the adapter is fed lots directly.
 const key=materialKey(water,50),request={inputs:[{key,qty:1}],process:[{op:'steep',level:1}]};
 assert.equal(d.forecastCraft(request,{materials:{},knowledge:{}}).verdict,'untried');
 const result=resolveBatch(law,{inputs:[{material:water,qty:1}],process:[{op:'steep',level:1}],stations:[]});
 assert.equal(Object.keys(result.product.outputs).length,0);
 d.noteBatch(result);
 const f=d.forecastCraft(request,{materials:{},knowledge:{}});
 assert.equal(f.verdict,'known-fail');assert.equal(f.tries,1);assert.deepEqual(f.residue,{});
 assert.equal(d.forecastCraft({...request,process:[{op:'steep',level:2}]},{materials:{},knowledge:{}}).verdict,'near');
 const saved=domainRegistry.save({});assert.ok(saved.craftLedger);
 d.setLedgerOwner(null);assert.equal(d.ledgerStamp(),0);
 domainRegistry.validate(saved);domainRegistry.load(saved);assert.equal(d.ledgerStamp(),1);
 domainRegistry.load({});assert.equal(d.ledgerStamp(),0);assert.equal(domainRegistry.save({}).craftLedger,undefined);
});
test('live failure path: a thin steep spends the lots, records a thin failure and charges the verge grudge through the obligations ledger',async()=>{
 const {stageCrafting,quoteCrafting,materialKey,catalogue,roughBatch,villageSources}=await import('../src/crafting_frontier_runtime.js');
 const {harvest}=await import('../src/craft_sources.js');
 const {createObligations,validateObligations}=await import('../src/obligations_ledger.js');
 const {chargeGrudge,grudgeNow,GRUDGE}=await import('../src/craft_grudge.js');
 assert.equal(roughBatch({outputs:{oral:{health:13}}}).code,'thin');assert.equal(roughBatch({outputs:{oral:{bind:14}}}),null);
 const ctx={clock:100,world:'base.frontier',location:'Village',blocked:'',root:77};
 // Search real harvested lots for one the floor rejects, so the assertion rides on live numbers, not a stub.
 let found=null;
 for(let root=1;root<80&&!found;root++){
  const h=harvest(villageSources,{root:root*7919,world:ctx.world,location:ctx.location,source:'village-herbs',at:0,actor:{skill:0}});
  for(const it of h.result.items){
   const owner0=stageCrafting(null,{},quoteCrafting(null,{},{type:'harvest'},ctx),{...ctx,root:root*7919}).state;
   const key=materialKey(it.material,it.quality),inv={[key]:it.qty};
   const q=quoteCrafting(owner0,inv,{type:'craft',inputs:[{key,qty:1}]},ctx);if(!q.eligible)continue;
   const plan=stageCrafting(owner0,inv,q,ctx);if(plan.failure){found={plan,key};break;}}
 }
 assert.ok(found,'some live lot should steep thin');
 const {plan,key}=found;
 assert.equal(plan.failure.code,'thin');assert.equal(plan.batch,null);assert.deepEqual(plan.items,[{key,amount:-1}]);assert.deepEqual(Object.keys(plan.state.products),[]);
 let ledger=createFailureLedgerFor(plan);assert.equal(forecastFromLedger(ledger,{materials:plan.failure.result.product.inputs.map(i=>i[1]),process:[['steep',1]]}).reasons[0],'thin');
 let o=chargeGrudge(createObligations(),0);assert.equal(grudgeNow(o,0),1);o=chargeGrudge(o,0);assert.equal(grudgeNow(o,0),2);
 assert.equal(grudgeNow(o,GRUDGE.seasonMinutes),1);assert.equal(grudgeNow(o,3*GRUDGE.seasonMinutes),0);validateObligations(o);
 function createFailureLedgerFor(p){return recordBatchAttempt(createFailureLedger(),p.failure.result,{reasons:[p.failure.code]});}
});
