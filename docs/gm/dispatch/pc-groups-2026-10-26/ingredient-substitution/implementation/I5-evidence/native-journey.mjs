import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
const source = path.resolve(process.argv[2]), output = path.resolve(process.argv[3]);
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'native-browser');
await mkdir(out, {recursive:true});
const {Session} = await import(pathToFileURL(path.join(source, 'scripts/playtest/lib.mjs')));
const {HP} = await import(pathToFileURL(path.join(source, 'src/hp_brewing_state.js')));
const {calendarMinutes} = await import(pathToFileURL(path.join(source, 'src/world_rhythm.js')));
const bundleHash = createHash('sha256').update(await readFile(path.join(output, 'dist/bundle.js'))).digest('hex');
assert.equal(bundleHash, '28bbfe910094b1d7063f4a14167491704a7f0883815b925412589905e17d89d5');
const server = createServer(async(req,res) => {try {
    const url = new URL(req.url, 'http://x'), file = path.resolve(output, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if(!file.startsWith(output + '/')) throw Error('outside output');
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
} catch {res.writeHead(404).end();}});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const s = new Session({url:`http://127.0.0.1:${server.address().port}/?test_hooks=1`, seed:21, wall:Date.UTC(2026,9,26), opTimeout:20000});
const bone = JSON.stringify({id:'Bonemeal'}), method = 'book.hp.abrasive-suspension@1';
const checks = [], matrix = [], http = [], quantities = [], production = {};
let p, baseSave, rawSave, commonSave, lastActual, currentStage = 'boot';
const record = text => {checks.push(text);writeFileSync(path.join(out,'progress.json'),JSON.stringify({currentStage,checks,bundleHash}));console.log('PASS ' + text);};
const live = () => p.evaluate(() => simulationTestHooks.snapshot());
const save = async() => {await p.locator('#save_button').click();return JSON.parse(await p.evaluate(() => localStorage.getItem('save data')));};
const hp = async() => (await live()).hp_brewing;
const inventory = snap => snap.inventories.person.main_character;
const digest = snap => ({hp:snap.hp_brewing, inventory:inventory(snap), world:snap.expansion.actors.player.worldId});
const panel = async() => {await p.locator('#workspace_navigation select').first().selectOption('hp-polyjuice');await p.locator('#hp_brewing').waitFor({state:'visible'});};
const opened = async fixture => {await s.open(fixture);p=s.page;p.on('response',r => {if(r.status()>=400)http.push({url:r.url(),status:r.status()});});await panel();};
const select = async(id,value) => {await p.locator(`[data-hp-select="${id}"]`).selectOption(value);await p.waitForTimeout(30);};
const button = id => p.locator(`[data-hp-action="${id}"]`).first();
const act = async id => {assert.equal(await button(id).isDisabled(),false,await button(id).getAttribute('title'));await button(id).click();};
const row = id => p.locator(`[data-hp-batch="${id}"]`);
const step = async n => {await s.step(n);await p.waitForTimeout(40);};
const choose = async id => {await select('method',method);await act('clear-selection');await select('comparison-option',id);};
const acquire = async(ingredient, route='book.hp.route.student_store', prepared=false) => {
    await select('ingredient', 'book.hp.ing.'+ingredient);await select('route',route);
    const box=p.locator('[data-hp-prepared]');if(await box.count())await box.setChecked(prepared);
    await act('acquire');return Object.values((await hp()).lots).filter(l=>l.ingredient==='book.hp.ing.'+ingredient).at(-1).id;
};
const prep = async(id,variant) => p.locator(`[data-hp-lot="${id}"]`).getByRole('button',{name:variant==='fine'?'Fine powder (2 coins)':'Coarse powder (1 coin)',exact:true}).click();
const finish = async() => {const pending=(await hp()).cauldron.brew;await step(pending.readyAt-(await hp()).now);return Object.values((await hp()).batches).find(b=>b.history.startedAt===pending.history.startedAt && b.readyAt===pending.readyAt && b.id===`b${pending.id}`);};
const boot = async() => {await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await panel();};
const checkpoint = async name => {
    const before=digest(await save());await p.reload();await boot();assert.deepEqual(digest(await save()),before);
    const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#save_to_file_button').click()]);const f=path.join(out,name+'.txt');await download.saveAs(f);
    await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(f)]);await boot();assert.deepEqual(digest(await save()),before);
    record(name+': native Save/reload/Export/literal file Import preserves HP, native stock and host world');
};
const screenMatrix = async name => {
    for(const [width,height]of [[1920,1080],[1536,864]])for(const font of [14,21]) {
        await p.setViewportSize({width,height});await p.locator('#workspace_navigation select').first().selectOption('customization');
        await p.locator('[aria-label="Font size"]').fill(String(font));await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await panel();
        await p.locator('[data-hp-select="method"]').scrollIntoViewIfNeeded();const ui=await s.uiCheck();assert.equal(ui.pageOverflow,0);assert.deepEqual(ui.unlabeled,[]);
        await p.screenshot({path:path.join(out,`${name}-${width}-${font}.png`)});matrix.push({name,width,height,font,ui});
    }
};
try {
    await writeFile(path.join(out,'process.json'),JSON.stringify({pid:process.pid,pgid:process.pid,source,output,bundleHash,status:'running'},null,2));
    await s.start();await opened();baseSave=await save();assert.equal(baseSave.hp_brewing,undefined);
    const fixture=structuredClone(baseSave);inventory(fixture)[bone]={count:3};
    await opened(fixture);await p.locator('#workspace_navigation select').first().selectOption('beginning');
    await p.locator('[data-structured-choice="life"]').selectOption('book.hp.school');await p.getByRole('button',{name:'Confirm arrival',exact:true}).click();
    let snapshot=await save();assert.equal(snapshot.expansion.actors.player.worldId,'book.hp.school.world');assert.equal(inventory(snapshot)[bone].count,3);
    await panel();await act('begin');record('Named starting stock Bonemeal3; normal UI-confirmed HP school arrival retains exact native cargo, then earned bench Begin');
    currentStage='acquisition';
    const fine=await acquire('bicorn_horn','book.hp.route.trusted_supplier');await prep(fine,'fine');
    const coarse=await acquire('bicorn_horn','book.hp.route.trusted_supplier');await prep(coarse,'coarse');
    await select('method',method);rawSave=await save();
    await choose('alternative:'+bone);await select('slot-bicorn',fine);await select('slot-knotgrass',coarse);
    const capacityBefore=digest(await save());assert.equal(await button('brew').isDisabled(),true);assert.match(await button('brew').getAttribute('title'),/one to 3/);assert.deepEqual(digest(await save()),capacityBefore);
    record('Actual four-portion selection refuses capacity before stock or coin payment');
    await choose('alternative:'+bone);await screenMatrix('comparison');await act('brew');
    let state=await hp();assert.equal(state.cauldron.brew.history.externalMaterials[0].qty,2);assert.equal(state.cauldron.brew.history.inputs.length,0);assert.equal(inventory(await live())[bone].count,1);
    await step(10);await checkpoint('native-only-pending');const alt=await finish();production.alternative=alt.id;
    await choose('alternative:'+bone);assert.equal(await button('brew').isDisabled(),true);assert.match(await button('brew').getAttribute('title'),/no longer carried/);
    assert.ok((await hp()).lots[fine]);assert.ok((await hp()).lots[coarse]);assert.equal(inventory(await live())[bone].count,1);
    record('Stale preferred native quantity refuses while unchosen horn alternatives remain; no automatic substitution');
    await choose('reference:'+fine);await act('brew');const ref=await finish();production.reference=ref.id;
    await choose(`blend:${coarse}:${bone}`);const beforeFailure=await live(), durable=await p.evaluate(()=>localStorage.getItem('save data'));
    await p.evaluate(()=>{window.__g2Set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')throw Error('G2 injected mixed-admission disk failure');return window.__g2Set.call(this,k,v);};});
    await button('brew').click();assert.match(await p.locator('#hp_brewing').innerText(),/G2 injected/);assert.deepEqual(digest(await live()),digest(beforeFailure));assert.equal(await p.evaluate(()=>localStorage.getItem('save data')),durable);
    await p.evaluate(()=>{Storage.prototype.setItem=window.__g2Set;delete window.__g2Set;});await act('brew');
    assert.equal(inventory(await live())[bone],undefined);assert.equal((await hp()).lots[coarse],undefined);assert.equal((await hp()).purse,beforeFailure.hp_brewing.purse-1);
    const blend=await finish();production.blend=blend.id;assert.equal((await hp()).cauldron.condition,550);
    commonSave=await save();record('Actual mixed native-key deletion/local-lot/coin/history failure rolls back both owners; retry spends once and all three production paths conserve quantities');
    currentStage='controlled-reader';
    for(const [kind,id]of Object.entries(production)) {
        await opened(commonSave);const before=await hp();await row(id).locator('[data-hp-action="treat-cauldron"]').click();const after=await hp();
        assert.equal(after.cauldron.condition,750);assert.equal(after.batches[id].dosesLeft,before.batches[id].dosesLeft-1);assert.equal(Object.keys(after.samples).length,0);
        assert.ok(after.methods.length);record(`${kind}: actual produced dose raises the same 550-condition fixture to750, spends one dose and records only demonstrated conditions`);
        if(kind==='alternative') {await checkpoint('native-treated-partial');lastActual=await save();}
    }
    currentStage='quantity-readers';
    for(const [name,expected]of [['small',100],['bulk',133]]) {
        await opened(rawSave);await choose(`alternative-${name}:${bone}`);await act('brew');const b=await finish();
        for(let i=0;i<2;i++){const id=await acquire('leeches');await select('method',method);await act('clear-selection');await select('slot-leeches',id);await act('brew');await finish();}
        assert.equal((await hp()).cauldron.condition,550);await row(b.id).locator('[data-hp-action="treat-cauldron"]').click();
        const after=await hp();assert.equal(after.cauldron.condition,550+expected);assert.equal(after.batches[b.id].dosesLeft,2);quantities.push({name,removed:expected,condition:after.cauldron.condition});
        record(`Selectable ${name} native-quantity trial changes actual cleanup by${expected}; remaining material/doses stay conserved`);
    }
    currentStage='downstream-reader';await opened(lastActual);
    // Use real routes to supply the pinned potion after the actual cleaning.
    const lace=await acquire('lacewing_flies','book.hp.route.trusted_supplier',true);
    await p.locator(`[data-hp-lot="${lace}"] [data-hp-action="assay-lot"]`).click();
    assert.equal((await hp()).lots[lace].truth.stewedMinutes>=30240,true,'qualified bought preparation fixture must be witnessed by assay');
    const flux=await acquire('fluxweed','book.hp.route.harvest');assert.equal((await hp()).lots[flux].known.provenance,'full_moon');
    const leech=await acquire('leeches'), knot=await acquire('knotgrass');
    const privateRoute=HP.routes.find(route=>route.kind==='unlicensed').id;
    const horn=await acquire('bicorn_horn',privateRoute);await prep(horn,'fine');
    const skin=await acquire('boomslang_skin',privateRoute);await p.locator(`[data-hp-lot="${skin}"]`).getByRole('button',{name:'Fine shreds (1 coin)',exact:true}).click();
    await select('method',HP.formula.id);await act('clear-selection');
    for(const [slot,id]of Object.entries({lacewing:lace,leeches:leech,fluxweed:flux,knotgrass:knot,bicorn:horn,boomslang:skin}))await select('slot-'+slot,id);
    const qualified=await save();await act('brew');assert.equal((await hp()).cauldron.brew.grade,'canon');
    const canon=await finish();assert.equal(canon.grade,'canon');await act('sample-ask');
    await select('batch',canon.id);await select('sample',Object.keys((await hp()).samples)[0]);await act('drink');assert.equal((await hp()).effect.kind,'transform');
    await checkpoint('cleaning-to-canon-use');lastActual=await save();
    // Same real acquired inputs, original fouled apparatus: actual admission resolves degraded.
    const control=structuredClone(qualified);control.hp_brewing.cauldron.condition=550;
    await opened(control);await select('method',HP.formula.id);for(const [slot,id]of Object.entries({lacewing:lace,leeches:leech,fluxweed:flux,knotgrass:knot,bicorn:horn,boomslang:skin}))await select('slot-'+slot,id);
    await act('brew');assert.equal((await hp()).cauldron.brew.grade,'degraded');
    record('Actual cleaned apparatus makes the qualified pinned potion and real one-hour transformation; named dirty-apparatus control resolves degraded, so cleanup feeds a useful reader');
    currentStage='reverse-fixture';
    await opened(baseSave);const delta=calendarMinutes(lastActual['current time'])-calendarMinutes((await live())['current time']);if(delta>0)await step(delta);
    const returned=await save();returned.hp_brewing=structuredClone(lastActual.hp_brewing);await opened(returned);
    assert.equal((await live()).expansion.actors.player.worldId,'base.frontier');const kept=digest(await save());
    const foreign=row(production.alternative).locator('[data-hp-action="foreign-use"]');assert.equal(await foreign.isDisabled(),true);assert.match(await foreign.getAttribute('title'),/no supported way/);
    await foreign.evaluate(el=>el.onclick());assert.match(await p.locator('#hp_brewing').innerText(),/dose stays yours/);assert.deepEqual(digest(await save()),kept);
    await checkpoint('returned-cargo-inert');record('Named synthetic returned-cargo prerequisite: actual Frontier host quote/execute refuses structural repair and retains HP doses and native gear/stock');
    currentStage='final-layout';await opened(lastActual);await select('method',method);await screenMatrix('used');
    const errors=s.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(errors,[]);
    const unexpected=http.filter(e=>!new URL(e.url).pathname.endsWith('/favicon.ico'));assert.deepEqual(unexpected,[]);
    const served=p.url();await writeFile(path.join(out,'result.json'),JSON.stringify({status:'PASS',bundleHash,source,output,served,checks,matrix,quantities,production,
        route:'Named initial Bonemeal3 fixture, earned actual HP school arrival and all bench acquisition/preparation/commit/use; controlled cloned lab branches; named returned-cargo and dirty-apparatus controls',pageErrors:errors,httpUnexpected:unexpected,review:'agent-verified, not human-reviewed'},null,2)+'\n');
    console.log('PASS complete G2 native journey; '+checks.length+' checks, '+matrix.length+' desktop captures');
} catch(error) {
    await writeFile(path.join(out,'recovery-fixtures.json'),JSON.stringify({baseSave,rawSave,commonSave,lastActual,checks,quantities,production,currentStage}));
    await p?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});await writeFile(path.join(out,'failure.txt'),currentStage+'\n'+(error.stack||error));
    await writeFile(path.join(out,'failure-ui.txt'),await p?.locator('body').innerText().catch(()=>''));throw error;
} finally {await s.close();server.close();await writeFile(path.join(out,'process-end.json'),JSON.stringify({pid:process.pid,stage:currentStage,ended:true}));}
