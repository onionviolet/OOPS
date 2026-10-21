import test from 'node:test';
import assert from 'node:assert/strict';
import {createScenarioFacade, knownLampProjection} from '../src/scenario_facade.js';
import {boot, ROOT, canonicalSave, diffSaves} from '../scripts/headless/runner.mjs';
import {createHeadlessScenario, scenarioInputIdentity, ordinaryLampJourney} from '../scripts/headless/scenario.mjs';
import {LAMP_FIXTURE, ordinaryLampFixture} from './fixtures/deep_engine/ordinary_lamp.mjs';

test('facade reads copied observer projections and keeps mutation/persistence explicit', async () => {
    let state = 0, writes = 0, advances = 0;
    const identity = {fixture:{id:'synthetic',version:1}};
    const scenario = createScenarioFacade({identity,
        inspect:() => ({known:state}), quote:() => ({eligible:true,spend:1}),
        execute:() => {state++;}, advance:() => {advances++;},
        persistence:{save:() => {writes++;},load:() => {},reload:() => {},exportFile:() => '',importFile:() => {}},
    });
    identity.fixture.id = 'changed';
    assert.equal(scenario.identity().fixture.id,'synthetic');
    const first = await scenario.inspect();
    assert.throws(() => {first.known = 99;},TypeError);
    await scenario.quote({type:'example'}); await scenario.inspect();
    assert.deepEqual([state,writes,advances],[0,0,0]);
    assert.deepEqual((await scenario.execute(await scenario.quote({type:'example'}))).delta,
        [{path:'/known',before:0,after:1}]);
    assert.throws(() => scenario.advance(Infinity),/finite/);
    const known = knownLampProjection({held:true,lit:false,shining:false,oil:0,noticed:{sealed:19},
        futureTruth:'unknown',light:{ambient:30,bonus:0,light:30,secret:'hidden'}},10);
    assert.equal(JSON.stringify(known).includes('sealed'),false);
    assert.equal(JSON.stringify(known).includes('hidden'),false);
    assert.equal(JSON.stringify(known).includes('unknown'),false);
});

test('named native lamp journey: pure quote, real spend/time, stale rejection and persistence', async t => {
    const game = await boot(null,{seed:LAMP_FIXTURE.seed,wallStart:LAMP_FIXTURE.wallStart,heroName:null});
    t.after(() => game.close());
    const save = ordinaryLampFixture(await game.save());
    await game.load(save);
    const identity = await scenarioInputIdentity(ROOT,LAMP_FIXTURE,save);
    const scenario = createHeadlessScenario(game,identity);
    const bytes = game.storage.getItem('save data'), before = canonicalSave(game.snapshot());
    const random = Math.random;
    Math.random = () => {throw Error('Observation drew RNG.');};
    try {
        for (let i=0;i<3;i++) {await scenario.inspect(); await scenario.quote({type:'lamp.toggle'});}
        await assert.rejects(scenario.quote({type:'unsupported'}),/Unsupported/);
    } finally {Math.random = random;}
    assert.equal(canonicalSave(game.snapshot()),before);
    assert.equal(game.storage.getItem('save data'),bytes);
    const result = await ordinaryLampJourney(scenario);
    assert.deepEqual(result.before,result.preview);
    assert.equal(result.quote.value.spend,1);
    assert.equal(result.lit.status,'applied');
    assert.equal(result.lit.after.lamp.oil,240);
    assert.equal(result.elapsed.after.lamp.oil,238);
    assert.equal(result.elapsed.after.minute-result.before.minute,2);
    assert.equal(result.stale.status,'rejected');
    assert.match(result.stale.error.message,/changed/);
    assert.deepEqual(result.stale.delta,[]);
    assert.equal(result.saved.inventories.person.main_character[JSON.stringify({id:'Lamp oil'})],undefined);
    assert.deepEqual(result.reloaded,result.elapsed.after);
    assert.deepEqual(result.imported,result.reloaded);
    assert.deepEqual(diffSaves(canonicalSave(await scenario.persistence.save()),canonicalSave(result.saved)),[]);
    // Domain remains writable after rejection and retained ticket needs fresh quote.
    const out = await scenario.execute(await scenario.quote({type:'lamp.toggle'}));
    assert.equal(out.after.lamp.shining,false);
    assert.equal(out.after.lamp.oil,238);
    assert.deepEqual(game.errors,[]);
});
