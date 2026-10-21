// Run from the isolated candidate: node docs/gm/dispatch/deep-engine-2026-10-20/P3_EVIDENCE/verify-browser.mjs /private/evidence
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {boot,ROOT,canonicalSave,diffSaves} from '../../../../../scripts/headless/runner.mjs';
import {createHeadlessScenario,createBrowserScenario,ordinaryLampJourney,scenarioInputIdentity,BROWSER_SCENARIO_BRIDGE} from '../../../../../scripts/headless/scenario.mjs';
import {LAMP_FIXTURE,ordinaryLampFixture} from '../../../../../tests/fixtures/deep_engine/ordinary_lamp.mjs';
import {serve} from '../../../../../scripts/perf/lib.mjs';
import {Session} from '../../../../../scripts/playtest/lib.mjs';
const evidence=resolve(process.argv[2]);
await mkdir(evidence,{recursive:true});
const sha=value=>createHash('sha256').update(value).digest('hex');
let game,session,server;
const receipt={checks:[],viewport:{width:1920,height:1080},presentationChanged:false,
    bridge:'Source-owned test bridge appended inside the real main bundle. No production main edit. Same domain registry and real native owner commands; whole-game reentrancy/replay is not claimed.'};
const assertJourney = result => {
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
};
const safe = result => {
    const {saved,exported,...out}=result;
    return {...out,saveSha256:sha(canonicalSave(saved)),exportSha256:sha(exported)};
};
try {
    game=await boot(null,{seed:LAMP_FIXTURE.seed,wallStart:LAMP_FIXTURE.wallStart,heroName:null});
    const fixture=ordinaryLampFixture(await game.save());
    await game.load(fixture);
    const identity=await scenarioInputIdentity(ROOT,LAMP_FIXTURE,fixture);
    const headless=await ordinaryLampJourney(createHeadlessScenario(game,identity));
    assertJourney(headless); assert.deepEqual(game.errors,[]);
    game.close(); game=null;
    receipt.checks.push('Headless real-owner lamp command, time, stale rejection, Save/reload/Export/literal Import');
    // Official candidate build already passed. Retain its identity before adding
    // the narrow test-only command bridge to a separate instrumented bundle.
    receipt.officialBundleSha256=sha(await readFile(join(ROOT,'dist/bundle.js')));
    await build({entryPoints:[join(ROOT,'src/main.js')],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,
        outfile:join(evidence,'scenario-bundle.js'),logLevel:'error',plugins:[{name:'scenario-native-ports',setup(b){
            b.onLoad({filter:/[\\/]src[\\/]main\.js$/},async args=>({contents:await readFile(args.path,'utf8')+'\n'+BROWSER_SCENARIO_BRIDGE,loader:'js'}));
        }}]});
    // Candidate-only output copy. Shared dist/index remain untouched.
    await writeFile(join(ROOT,'dist/bundle.js'),await readFile(join(evidence,'scenario-bundle.js')));
    receipt.instrumentedBundleSha256=sha(await readFile(join(ROOT,'dist/bundle.js')));
    const missing=[];
    server=await serve(ROOT);
    session=new Session({url:server.url+'?test_hooks=1',seed:LAMP_FIXTURE.seed,wall:LAMP_FIXTURE.wallStart,opTimeout:15000,
        hooks:{beforeOpen:context=>context.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);})}});
    await session.start(); await session.open(fixture);
    const scenario=createBrowserScenario(session,identity);
    const page=()=>session.page;
    const before=await page().evaluate(()=>({save:localStorage.getItem('save data'),snapshot:simulationTestHooks.snapshot()}));
    await page().evaluate(()=>{
        window.scenarioSavedRandom=Math.random;window.scenarioSavedCrypto=crypto.getRandomValues;
        Math.random=()=>{throw Error('Observation drew RNG');};crypto.getRandomValues=()=>{throw Error('Observation drew crypto RNG');};
    });
    try {for(let i=0;i<3;i++){await scenario.inspect();await scenario.quote({type:'lamp.toggle'});}}
    finally {await page().evaluate(()=>{Math.random=window.scenarioSavedRandom;crypto.getRandomValues=window.scenarioSavedCrypto;delete window.scenarioSavedRandom;delete window.scenarioSavedCrypto;});}
    const after=await page().evaluate(()=>({save:localStorage.getItem('save data'),snapshot:simulationTestHooks.snapshot()}));
    assert.equal(after.save,before.save);assert.deepEqual(diffSaves(canonicalSave(after.snapshot),canonicalSave(before.snapshot)),[]);
    receipt.checks.push('Browser repeated quote/inspection changes no save bytes/state and draws neither Math.random nor crypto RNG');
    const browser=await ordinaryLampJourney(scenario);
    assertJourney(browser);
    for(const key of ['before','preview','quote','reloaded','imported']) assert.deepEqual(browser[key],headless[key]);
    for(const key of ['lit','elapsed','stale']) {
        assert.equal(browser[key].status,headless[key].status);assert.deepEqual(browser[key].delta,headless[key].delta);
    }
    assert.deepEqual(diffSaves(canonicalSave(await scenario.persistence.save()),canonicalSave(browser.saved)),[]);
    receipt.checks.push('Same scenario contract: browser/headless known projections and semantic deltas match');
    receipt.checks.push('Browser Save/reload/Export/literal Import: complete canonical current-format envelope exact');
    // Native visible route uses the same owner after the facade journey.
    const lamp=JSON.stringify({id:'Oil lamp'});
    async function inventoryUse(){
        await page().locator(`#inventory_content_div > [data-character_item='${lamp}']`).click();
        await page().locator('[data-shell-item-action="use"]').click();
    }
    await inventoryUse();assert.equal((await scenario.inspect()).lamp.shining,false);
    await inventoryUse();assert.equal((await scenario.inspect()).lamp.shining,true);
    assert.equal((await scenario.inspect()).lamp.oil,238);
    await page().screenshot({path:join(evidence,'native-lamp.png')});
    receipt.checks.push('Native inventory select/use twice reaches the same owner: out/relight retains 238 fuel');
    receipt.headless=safe(headless);receipt.browser=safe(browser);
    receipt.missingResources=[...new Set(missing)];
    assert.deepEqual(receipt.missingResources,['/private_packs/manifest.json']);
    const fatal=session.errors.filter(e=>!(e.kind==='console'&&/404 \(Not Found\)/.test(e.text)));
    assert.deepEqual(fatal,[]);receipt.pageErrors=fatal;
    await writeFile(join(evidence,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify({checks:receipt.checks,source:identity.sourceSha256,receipt:join(evidence,'receipt.json')}));
} finally {game?.close();await session?.close();await server?.close();}
