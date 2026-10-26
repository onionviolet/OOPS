// Earned menu actions on a private rebuilt origin. Never reads a player profile.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {encodeSaveFile} from '../../src/save_files.js';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const build=path.resolve(process.argv[2]||'/tmp/yairpg-L7-s2-build');
const out=path.resolve(process.argv[3]||'docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L7/S2/browser');
await mkdir(out,{recursive:true});
const P='book.ri.academy',id=n=>`${P}.${n}`,key=n=>JSON.stringify({id:id(n)});
const server=createServer(async(req,res)=>{try{
    let file=path.resolve(build,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(build+'/')){if(file!==build)throw Error('path');}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});
const p=await context.newPage();p.setDefaultTimeout(20000);
const result={route:'fresh Village → original RI beginning → paid control → food preparation → taught native cutting → daily meal; earned refined-state branch → hunger → late food → spoilage/death',errors:[],checks:[],matrix:[]};
p.on('pageerror',e=>result.errors.push(e.message));
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};
const open=()=>p.locator('#workspace_navigation select').first().selectOption('beginning');
const save=()=>p.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});
const digest=s=>({record:s.content_packs?.structured,actors:s.expansion.actors,simulation:s.expansion.simulation,clock:s.expansion.clock,inventory:s.inventories,skills:s.levels});
const load=async literal=>{await Promise.all([p.waitForEvent('load'),p.evaluate(text=>window.load_progress(text),literal)]);await play();await open();};
const roundTrip=async name=>{const before=await save(),expected=digest(before);await writeFile(path.join(out,name+'-before.json'),JSON.stringify(before,null,2));await p.reload();await play();assert.deepEqual(digest(await save()),expected,name+' reload');
    const literal=await p.evaluate(()=>window.save_to_file());assert.equal(typeof literal,'string');await load(literal);assert.deepEqual(digest(await save()),expected,name+' literal Import');result.checks.push(name+': Save/reload/Export/literal Import equal');};
const step=n=>p.evaluate(n=>window.advanceTicks(n),n);
const act=async n=>{await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(command=>{try{return window.simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===command);}catch{return false;}},id(n));};
const instant=async n=>{const before=(await save()).expansion.actors.player.completed[id(n)]||0;await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(({command,before})=>{try{return window.simulationTestHooks.snapshot().expansion.actors.player.completed[command]>before;}catch{return false;}},{command:id(n),before});};
const gu=s=>s.expansion.simulation.people[id('moonlight')];
const food=s=>s.expansion.simulation.owners[id('moonlight')][key('petals')]||0;
const reserve=s=>s.expansion.simulation.energies.player[id('primeval')].reserve;
try {
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);await play();await open();
    if(process.env.L7_STATUS_FIXTURE) {
        await load(encodeSaveFile(await readFile(process.env.L7_STATUS_FIXTURE,'utf8')));
        await p.setViewportSize({width:1536,height:864});await p.locator('#workspace_navigation select').first().selectOption('customization');await p.locator('[aria-label="Font size"]').fill('21');await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await open();
        const care=p.locator('#structured_pack_panel p').filter({hasText:/^Moonlight Gu care:/});await care.waitFor();assert.match(await care.innerText(),/Dead · care has ended/);assert.match(await care.innerText(),/4 prepared petals/);await care.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'care-status-1536-21.png')});
        const energy=p.locator('#structured_pack_panel p').filter({hasText:/^Primeval activation budget:/});assert.match(await energy.innerText(),/reserve cannot activate it/);await energy.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'dead-activation-budget-1536-21.png')});
        result.route='named expired-lot-dead-gu fixture from complete earned S2 journey; actual native Import on final care-status build';result.checks.push('dead care stops promising another meal; retained essence cannot activate dead Gu');
    } else {
    const ordinary=await save();assert.equal(ordinary.content_packs?.structured,undefined);
    if(process.env.L7_OLD_SAVE){await load(encodeSaveFile(await readFile(process.env.L7_OLD_SAVE,'utf8')));const old=await save();assert.equal(old.content_packs.structured.packId,'book.ss.apprentice');assert.equal(old.expansion.actors.player.facts['book.ss.apprentice.coat_ward_trained'],true);result.checks.push('unchanged S1b grown-pair receipt imports on Gu build');await load(encodeSaveFile(JSON.stringify(ordinary)));}
    await p.locator('[data-structured-choice="life"]').selectOption(P);await p.locator('[data-structured-begin]').click();
    let s=await save();assert.equal(s['current location'],id('annex'));assert.equal(gu(s).body.controllerId,id('moonlight'));assert.equal(food(s),4);
    assert.equal(await p.locator(`[data-structured-action="${id('cut')}"]`).isDisabled(),true);
    await act('refine');await step(7);await roundTrip('pending-refinement');
    await p.locator('[data-structured-cancel]').click();await p.waitForFunction(()=>{try{return window.simulationTestHooks.snapshot().expansion.simulation.jobs.length===0;}catch{return false;}});
    s=await save();assert.equal(reserve(s),6);assert.equal(gu(s).body.controllerId,id('moonlight'));
    await act('refine');await step(30);s=await save();assert.equal(gu(s).body.controllerId,'player');assert.equal(s.inventories.person.main_character[key('gu')].count,1);assert.equal(reserve(s),5);
    const refined=JSON.stringify(s);await writeFile(path.join(out,'earned-refined-fixture.json'),refined);
    await instant('prepare_12');s=await save();assert.equal(food(s),16);assert.equal(reserve(s),5);await roundTrip('prepared-food-plan');
    await act('learn');await step(5);await instant('request_bamboo');const beforeCut=await save();await instant('cut');s=await save();assert.equal(reserve(s),4);assert.equal(food(s),16);assert.equal(s.inventories.person.main_character[key('cut_bamboo')].count,1);
    result.nativeSkillBefore=beforeCut.levels;result.nativeSkillAfter=s.levels;assert.equal(s.levels.person.main_character.skill_xp.Woodcutting,beforeCut.levels.person.main_character.skill_xp.Woodcutting+1,'actual native Woodcutting ledger gains exactly one XP');
    await instant('return_bamboo');s=await save();assert.equal(s.expansion.simulation.owners[id('keeper')][key('cut_bamboo')],1);
    await step(s.expansion.simulation.checks[id('care.a_reset')].due-s.expansion.clock);s=await save();assert.equal(food(s),12);assert.equal(reserve(s),4);assert.equal(gu(s).vitals.health,4);await roundTrip('first-daily-meal');
    for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
        await p.setViewportSize({width,height});await p.locator('#workspace_navigation select').first().selectOption('customization');await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await open();
        const geometry=await p.locator('#structured_pack_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));assert.equal(geometry.font,size);assert.equal(geometry.pageOverflow,false);
        await p.locator('#structured_pack_panel p').filter({hasText:/^Moonlight Gu care:/}).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`care-${width}-${size}.png`)});await p.locator(`[data-structured-row="${id('cut')}"]`).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`gu-${width}-${size}.png`)});result.matrix.push({width,height,size,...geometry});
    }
    await load(encodeSaveFile(refined));await act('learn');await step(5);await instant('request_bamboo');s=await save();await step(2880-s.expansion.clock);s=await save();assert.equal(gu(s).vitals.health,3);assert.equal(food(s),0);assert.equal(await p.locator(`[data-structured-action="${id('cut')}"]`).isEnabled(),true);await instant('cut');await roundTrip('hungry-living-gu');
    s=await save();await step(7199-s.expansion.clock);await instant('prepare_4');s=await save();assert.equal(gu(s).life,'alive');assert.equal(food(s),4);assert.equal(s.expansion.simulation.conditions[id('moonlight')][id('fresh_petals')].expiresAt,7200);await roundTrip('one-minute-before-spoilage');
    await step(1);s=await save();assert.equal(gu(s).life,'dead');assert.equal(gu(s).vitals.health,0);assert.equal(food(s),4);assert.equal(await p.locator(`[data-structured-action="${id('cut')}"]`).isDisabled(),true);await roundTrip('expired-lot-dead-gu');
    const care=p.locator('#structured_pack_panel p').filter({hasText:/^Moonlight Gu care:/});await care.scrollIntoViewIfNeeded();assert.match(await care.innerText(),/Dead · care has ended/);await p.screenshot({path:path.join(out,'dead-gu-panel.png')});
    result.checks.push('same Gu/body/title after paid refinement; Stop refunds essence','cut produces actual native skill XP and physical output','daily meal consumes four petals and no essence','hungry living Gu works; expired stocked petals fail; dead Gu refuses');
    }
    assert.deepEqual(result.errors,[]);result.bundleSha256=createHash('sha256').update(await readFile(path.join(build,'dist/bundle.js'))).digest('hex');result.reviewState='agent-verified, not human-reviewed';result.success=true;
} catch(e){result.failure=e.stack;result.panel=await p.locator('#structured_pack_panel').innerText().catch(()=>'');await writeFile(path.join(out,'failure-save.json'),JSON.stringify(await save(),null,2)).catch(()=>{});await p.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw e;
} finally{await writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2));await context.close();await browser.close();server.close();}
console.log(JSON.stringify({success:result.success,bundleSha256:result.bundleSha256,checks:result.checks,matrix:result.matrix,errors:result.errors}));
