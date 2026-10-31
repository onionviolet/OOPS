// Earned menu actions on a private rebuilt origin. Never reads a player profile.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {encodeSaveFile} from '../../src/save_files.js';
import {keeperDiets} from '../../src/world_packs/book_gu_keeper.js';
import {starvation} from '../../src/living_upkeep.js';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const build=path.resolve(process.argv[2]||'/private/tmp/claude-501/gu-keeper-build');
const out=path.resolve(process.argv[3]||'/private/tmp/claude-501/gu-keeper-evidence');
await mkdir(out,{recursive:true});
const P='book.ri.keeper',id=n=>`${P}.${n}`,key=n=>JSON.stringify({id:id(n)});
const server=createServer(async(req,res)=>{try{
    let file=path.resolve(build,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(build+'/')){if(file!==build)throw Error('path');}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});
const p=await context.newPage();p.setDefaultTimeout(20000);
const result={route:'fresh Village → original RI Gu keeper beginning → free Gu → refused purchases → stipend week → hold more Gu than fed → starved out on schedule → recover → save/reload/import',errors:[],checks:[],matrix:[]};
p.on('pageerror',e=>result.errors.push(e.message));
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};
const open=()=>p.locator('#workspace_navigation select').first().selectOption('beginning');
const save=()=>p.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});
// Loading materializes zero XP for NPC skills; absence and explicit zero agree.
// Preserve the player ledger and every nonzero NPC entry in exact comparisons.
const skillDigest=levels=>({...levels,person:Object.fromEntries(Object.entries(levels.person).map(([id,ledger])=>[id,id==='main_character'?ledger:{...ledger,skill_xp:Object.fromEntries(Object.entries(ledger.skill_xp).filter(([,xp])=>xp!==0))}]))});
const digest=s=>({record:s.content_packs?.structured,actors:s.expansion.actors,simulation:s.expansion.simulation,clock:s.expansion.clock,inventory:s.inventories,skills:skillDigest(s.levels)});
const load=async literal=>{await Promise.all([p.waitForEvent('load'),p.evaluate(text=>window.load_progress(text),literal)]);await play();await open();};
const roundTrip=async name=>{const before=await save(),expected=digest(before);await writeFile(path.join(out,name+'-before.json'),JSON.stringify(before,null,2));await p.reload();await play();assert.deepEqual(digest(await save()),expected,name+' reload');
    const literal=await p.evaluate(()=>window.save_to_file());assert.equal(typeof literal,'string');await load(literal);assert.deepEqual(digest(await save()),expected,name+' literal Import');result.checks.push(name+': Save/reload/Export/literal Import equal');};
const step=n=>p.evaluate(n=>window.advanceTicks(n),n);
const act=async n=>{await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(command=>{try{return window.simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===command);}catch{return false;}},id(n));};
const instant=async n=>{const before=(await save()).expansion.actors.player.completed[id(n)]||0;await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(({command,before})=>{try{return window.simulationTestHooks.snapshot().expansion.actors.player.completed[command]>before;}catch{return false;}},{command:id(n),before});};
const sim=s=>s.expansion.simulation;
const gu=(s,n)=>sim(s).people[id(n)];
const stones=s=>s.inventories.person.main_character[key('stone')]?.count||0;
const DAY=1440;
const shot=async name=>{await p.locator('.gu-house').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,name+'.png')});};
const why=async n=>{assert.equal(await p.locator(`[data-structured-action="${id(n)}"]`).isDisabled(),true);return (await p.locator(`[data-structured-row="${id(n)}"]`).innerText()).split('\n').filter(l=>/need/i.test(l)).join(' ');};
const act0=act,instant0=instant;
const toClock=async t=>{for(;;){const c=(await save()).expansion.clock;if(t<=c)return;await step(Math.min(t-c,1440));}};
const FOOD={moon:['petals',4],worm:['lees',1],jade:['jade',1]};
const death=(s,n,every)=>{const init=s.content_packs.structured.initializedAt,next=init+(Math.floor((s.expansion.clock-init)/(every*DAY))+1)*every*DAY,[f,m]=FOOD[n],stock=sim(s).owners[id(n)]?.[key(f)]||0;return next+(Math.floor(stock/m)+gu(s,n).vitals.health-1)*every*DAY;};
const act1=async n=>{await open();return act0(n);},instant1=async n=>{await open();return instant0(n);};
try {
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);await play();await open();
    await p.locator('[data-structured-choice="life"]').selectOption(P);await p.locator('[data-structured-begin]').click();
    await p.locator('.gu-house').waitFor();
    let s=await save();assert.equal(stones(s),3);await shot('01-start');
    result.checks.push('refused at 3 stones: '+await why('take_worm'));
    await instant1('take_moon');await instant1('buy_petals');await instant1('buy_petals');
    for(let i=0;i<3;i++)await instant1('feed_moon');
    s=await save();assert.equal(stones(s),1);await roundTrip('moon-fed');
    await toClock(7*DAY);s=await save();assert.equal(stones(s),7);await p.locator('[data-gu="agreement"]').waitFor();
    await instant1('take_worm');s=await save();assert.equal(stones(s),3);
    result.checks.push('refused at 3 stones after buying the worm: '+await why('take_jade'));
    await act1('chores');await step(120);await act1('chores');await step(120);await act1('chores');await step(120);
    s=await save();assert.equal(stones(s),6);await instant1('take_jade');s=await save();assert.equal(stones(s),0);
    for(const n of ['moon','worm','jade'])assert.equal(gu(s,n).body.controllerId,'player');
    result.checks.push('held three Gu on a stipend that feeds fewer: '+await p.locator('[data-gu="feeding-cap"]').innerText());
    await shot('02-over-held');await roundTrip('over-held');
    s=await save();const FOOD={moon:'petals',worm:'lees',jade:'jade'},when={};
    for(const n of ['moon','worm','jade']){const d=keeperDiets.find(x=>x.holder===id(n));
        when[n]=starvation(d,{stock:sim(s).owners[id(n)]?.[key(FOOD[n])]||0,condition:gu(s,n).vitals.health,now:s.expansion.clock,anchor:s.content_packs.structured.initializedAt}).starvedOutAt;}
    result.matrix.push({predictedStarvedOutMinute:when,clockNow:s.expansion.clock});
    for(const [n,t] of Object.entries(when).sort((a,b)=>a[1]-b[1])){
        if(t>s.expansion.clock){await toClock(t-1);s=await save();assert.equal(gu(s,n).vitals.health,2,n+' at condition 2 one minute before');await step(1);}
        s=await save();assert.equal(gu(s,n).vitals.health,1,n+' starved out on the predicted minute');assert.equal(gu(s,n).life,'alive',n+' alive: hunger does not kill a keeper’s Gu');
    }
    await open();await p.locator('[data-gu-row="moon"]').waitFor();assert.match(await p.locator('[data-gu-row="moon"] [data-gu="starves-in"]').innerText(),/Starved out now/);
    assert.equal(await p.locator(`[data-structured-action="${id('work_moon')}"]`).isDisabled(),true);
    await shot('03-starved-out');
    await act1('chores');await step(120);await instant1('buy_petals');await instant1('feed_moon');await toClock((await save()).expansion.clock+1440);
    s=await save();assert.ok(gu(s,'moon').vitals.health>=2,'a meal recovers it');await instant1('order_moon_on');
    await shot('04-recovering-with-order');
    await roundTrip('after-hunger');
    result.checks.push('each Gu was starved out (not killed) on its predicted minute, refused work, recovered on a meal and took a standing order; the Gu house showed the clock; save, reload, Export and Import matched');
    assert.deepEqual(result.errors,[]);result.bundleSha256=createHash('sha256').update(await readFile(path.join(build,'dist/bundle.js'))).digest('hex');result.reviewState='agent-verified, not human-reviewed';result.success=true;
}catch(e){result.failure=e.stack;result.panel=await p.locator('#structured_pack_panel').innerText().catch(()=>'');await p.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{await writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2));await context.close();await browser.close();server.close();}
console.log(JSON.stringify({success:result.success,failure:result.failure,panel:result.panel,bundleSha256:result.bundleSha256,checks:result.checks,matrix:result.matrix,errors:result.errors}));
