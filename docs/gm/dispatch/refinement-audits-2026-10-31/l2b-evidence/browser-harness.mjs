import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {join, resolve, extname, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(join(ROOT,'scripts/x.cjs'));
const {launchChrome}=require(join(ROOT,'scripts/ui_helpers.cjs'));
const OUT=resolve(process.argv[2]); await mkdir(OUT,{recursive:true});
const hash=path=>createHash('sha256').update(path).digest('hex');
const bundleHash=hash(await readFile(join(ROOT,'dist/bundle.js')));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{const path=decodeURIComponent(new URL(req.url,'http://x').pathname); const file=resolve(ROOT,'.'+(path==='/'?'/index.html':path));
    try {const body=await readFile(file); res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'}).end(body);} catch {res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}/?test_hooks=1`, browser=await launchChrome();
let context,page; const errors=[],report={route:'DEV SEEDED field-workshop road contest; actual moves and storage in fresh headless browser origins',viewport:'1920x1080',bundleHash};
const open=async seed=>{await context?.close(); context=await browser.newContext({viewport:{width:1920,height:1080}});
    if(seed)await context.addInitScript(d=>{if(!sessionStorage.getItem('s')){localStorage.setItem('save data',d);sessionStorage.setItem('s','1');}},seed);
    page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{timeout:120000,waitUntil:'domcontentloaded'});await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:120000});
    await page.evaluate(()=>window.simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();
    const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible().catch(()=>false))await confirm.click(); await page.waitForTimeout(700);
};
const tick=()=>page.evaluate(()=>window.advanceTicks?.(1));
const wait=()=>page.waitForTimeout(700);
const panelOpen=async()=>{const shown=()=>page.evaluate(()=>{const b=document.querySelector('#tempo_fight_panel');return !!b&&b.offsetParent!==null&&b.getBoundingClientRect().height>0;});
    if(!await shown()){await page.locator('#workspace_navigation').getByText('Notebook',{exact:true}).first().click({timeout:8000,noWaitAfter:true}).catch(()=>{});await wait();}
    if(!await shown())await page.locator('[data-notebook-view="people"]').first().click({timeout:4000,noWaitAfter:true}).catch(()=>{});
    await page.evaluate(()=>{const p=document.getElementById('tempo_fight_panel');if(p)p.open=true;});await wait();};
const realClick=async sel=>{const hit=await page.evaluate(sel=>{const b=document.querySelector(sel);if(!b||b.hidden||b.disabled)return null;for(const block of ['center','end','start','nearest']){b.scrollIntoView({block});const r=b.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,t=document.elementFromPoint(x,y);if(t===b||b.contains(t))return{x,y};}return null;},sel);
    if(!hit)throw Error('control unavailable: '+sel);await page.mouse.click(hit.x,hit.y);await wait();};
const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>localStorage.getItem('save data'));};
const observe=()=>page.evaluate(()=>{const live=window.simulationTestHooks.snapshot(),durable=JSON.parse(localStorage.getItem('save data'));
    const battle=live.expansion.simulation.sessions.player?.nativeBattle;
    return {liveOffset:live.character.hp_to_full,liveStaminaOffset:live.character.stamina_to_full,storedOffset:durable.character.hp_to_full,storedStaminaOffset:durable.character.stamina_to_full,
        fighter:battle?.fighters.player.hp??null,max:battle?.fighters.player.maxHp??null,storedFighter:durable.expansion.simulation.sessions.player?.nativeBattle?.fighters.player.hp??null,
        liveSeq:live.expansion.sequence,storedSeq:durable.expansion.sequence,actions:battle?.actions??null,
        hero:document.querySelector('#character_health_value')?.innerText,card:document.querySelector('#fight_situation .versus-side--you')?.innerText,
        notice:document.querySelector('#fight_situation .fight-situation-notice')?.innerText};});
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const agree=o=>{assert.notEqual(o.fighter,null,'fight is open');const native=o.max-o.liveOffset, stored=o.max-o.storedOffset;close(native,o.fighter);close(stored,o.fighter);close(o.storedFighter,o.fighter);
    const label=`${Math.ceil(o.fighter)}/${Math.ceil(o.max)}`;assert.ok(o.hero.includes(label),`hero ${o.hero} lacks ${label}`);assert.ok(o.card.includes(label),`fight ${o.card} lacks ${label}`);return {...o,native,stored};};
try{
    await open(null); const base=JSON.parse(await save());
    const fixtures=await import(join(ROOT,'scripts/field_fixtures.mjs'));let p=fixtures.joinField();
    p=fixtures.fieldAdvance(fixtures.fieldCommand(p,'field.learn_focus'),2);p=fixtures.fieldAdvance(fixtures.fieldCommand(p,'field.teach_step','Village',{targetId:'oldCraftsman'}),2);
    p=fixtures.fieldAdvance(fixtures.fieldCommand(p,'field.practice_step'),2);p=fixtures.completeFieldProject(p);p=fixtures.fieldAdvance(fixtures.fieldCommand(p,'rival.begin'),3);
    const seed=structuredClone(base);seed.expansion=p.state;seed.character.money=p.external.money;seed.inventories.person.main_character[fixtures.wood]={count:30};
    seed.availabilities.person.oldCraftsman=1;seed.availabilities.dialogue.oldCraftsman=1;seed.availabilities.location.Shack|=1;
    await open(JSON.stringify(seed));await panelOpen();await realClick('[data-tempo="start"]');await tick();await wait();
    report.start=agree(await observe());
    for(let i=0;i<14;i++){const before=await observe();if(before.fighter<before.max)break;await realClick('#fight_situation [data-fight-option="guard"]');}
    report.damage=agree(await observe());assert.ok(report.damage.fighter<report.damage.max,'opponent landed damage');
    await page.evaluate(()=>document.querySelector('#fight_situation')?.scrollIntoView({block:'start'}));await page.screenshot({path:join(OUT,'damage-1920.png')});
    const damaged=await save();await open(damaged);await tick();await wait();report.reload=agree(await observe());close(report.reload.fighter,report.damage.fighter);
    const encoded=await page.evaluate(()=>window.save_to_file());await open(null);
    await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'tempo.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
    await page.waitForTimeout(1000);const play=page.locator('#loading_screen_play_button');if(await play.isVisible().catch(()=>false)){await page.evaluate(()=>window.simulationTestHooks.pause());await play.click();await wait();}
    await tick();await wait();report.import=agree(await observe());close(report.import.fighter,report.damage.fighter);
    const beforeHeal=report.import.fighter;await realClick('#fight_situation [data-fight-option="tend"]');report.healing=agree(await observe());report.healing.before=beforeHeal;
    assert.ok(report.healing.fighter>beforeHeal,'tending produces a net health gain after opponent responses');
    await page.evaluate(()=>document.querySelector('#fight_situation')?.scrollIntoView({block:'start'}));await page.screenshot({path:join(OUT,'healing-1920.png')});
    const beforeFail=await observe(),oldBytes=await page.evaluate(()=>localStorage.getItem('save data'));
    await page.evaluate(()=>{window.__l2bWrites=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data'){window.__l2bWrites++;throw new Error('L2B simulated disk rejection');}return original.call(this,k,v);};});
    await realClick('#fight_situation [data-fight-option="guard"]');const afterFail=await observe();const failWrites=await page.evaluate(()=>window.__l2bWrites);
    assert.ok(failWrites>0,'failure reached the actual storage setter');assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),oldBytes);
    for(const k of ['fighter','liveOffset','liveStaminaOffset','storedOffset','storedStaminaOffset','storedFighter','liveSeq','storedSeq','actions'])assert.equal(afterFail[k],beforeFail[k],k);
    report.rejected={writeAttempts:failWrites,before:beforeFail,after:afterFail,bytesUnchanged:true};
    await open(oldBytes);await tick();await wait();report.resumed=agree(await observe());
    for(let i=0;i<35;i++){const o=await observe();if(o.fighter===null)break;await realClick('#fight_situation [data-fight-option="withdraw"]');}
    const done=await observe();assert.equal(done.fighter,null,'fight settled');close(done.liveOffset,done.storedOffset);
    const doneSave=await save();const doneMax=report.resumed.max;report.settled={...done,native:doneMax-done.liveOffset};
    await open(doneSave);await tick();await wait();report.settledReload=await observe();close(report.settledReload.liveOffset,done.liveOffset);
    const encodedDone=await page.evaluate(()=>window.save_to_file());await open(null);
    await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'finished.txt',mimeType:'text/plain',buffer:Buffer.from(encodedDone)})]);
    await page.waitForTimeout(1000);const playDone=page.locator('#loading_screen_play_button');if(await playDone.isVisible().catch(()=>false)){await page.evaluate(()=>window.simulationTestHooks.pause());await playDone.click();await wait();}await tick();await wait();
    report.settledImport=await observe();close(report.settledImport.liveOffset,done.liveOffset);assert.equal(report.settledImport.fighter,null);
}catch(e){report.failure=e.stack;await page?.screenshot({path:join(OUT,'failure.png')}).catch(()=>{});}finally{report.errors=errors;await context?.close().catch(()=>{});await browser.close().catch(()=>{});server.close();}
await writeFile(join(OUT,'health-route.json'),JSON.stringify(report,null,2)+'\n');
console.log(report.failure?'FAIL':'PASS',JSON.stringify({bundleHash,damage:report.damage,healing:report.healing,rejected:report.rejected?.writeAttempts,settled:report.settled?.native,failure:report.failure,errors}));
process.exitCode=report.failure||errors.length?1:0;
