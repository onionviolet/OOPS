// Rebuilt private-origin journey. Fixtures below are earned native saves only.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {encodeSaveFile} from '../../src/save_files.js';
const {launchChrome}=createRequire(import.meta.url)('../ui_helpers.cjs');
const build=path.resolve(process.argv[2]||'/tmp/yairpg-L7-s3-build');
const out=path.resolve(process.argv[3]||'docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L7/S3/browser');
await mkdir(out,{recursive:true});
const P='book.ss.company',id=n=>`${P}.${n}`,key=n=>JSON.stringify({id:id(n)});
const server=createServer(async(req,res)=>{try{let file=path.resolve(build,'.'+new URL(req.url,'http://local').pathname);if(file!==build&&!file.startsWith(build+'/'))throw Error('path');if((await stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),p=await context.newPage();p.setDefaultTimeout(20000);
const result={route:'fresh Village → company → independent sleep/camp work → grown shadow → brace patrol/paid return/treatment; earned same-prefix rope/both/unprepared comparison',errors:[],checks:[],matrix:[],comparisons:{}};
p.on('pageerror',e=>result.errors.push(e.message));
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};
const open=()=>p.locator('#workspace_navigation select').first().selectOption('beginning');
const save=()=>p.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});
// Loading materializes zero XP for NPC skills; absence and explicit zero agree.
// Preserve the player ledger and every nonzero NPC entry in exact comparisons.
const skillDigest=levels=>({...levels,person:Object.fromEntries(Object.entries(levels.person).map(([id,ledger])=>[id,id==='main_character'?ledger:{...ledger,skill_xp:Object.fromEntries(Object.entries(ledger.skill_xp).filter(([,xp])=>xp!==0))}]))});
const digest=s=>({record:s.content_packs?.structured,actors:s.expansion.actors,simulation:s.expansion.simulation,clock:s.expansion.clock,inventory:s.inventories,skills:skillDigest(s.levels),location:s['current location'],hp:s.character.hp_to_full,stamina:s.character.stamina_to_full});
const load=async literal=>{await Promise.all([p.waitForEvent('load'),p.evaluate(text=>window.load_progress(text),literal)]);await play();await open();};
const roundTrip=async name=>{const before=await save(),expected=digest(before);await writeFile(path.join(out,name+'-before.json'),JSON.stringify(before,null,2));await p.reload();await play();assert.deepEqual(digest(await save()),expected,name+' reload');const literal=await p.evaluate(()=>window.save_to_file());await load(literal);assert.deepEqual(digest(await save()),expected,name+' literal Import');result.checks.push(name+': Save/reload/Export/literal Import equal, including native vital offsets');};
const step=n=>p.evaluate(n=>window.advanceTicks(n),n);
const act=async n=>{await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(command=>{try{return window.simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===command);}catch{return false;}},id(n));};
const instant=async n=>{const before=(await save()).expansion.actors.player.completed[id(n)]||0;await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(({command,before})=>{try{return window.simulationTestHooks.snapshot().expansion.actors.player.completed[command]>before;}catch{return false;}},{command:id(n),before});};
const hound=s=>s.expansion.simulation.people[id('hound')];
const bag=(s,n)=>s.inventories.person.main_character[key(n)]?.count||0;
const stock=(s,who,n)=>s.expansion.simulation.owners[id(who)][key(n)]||0;
const phase=s=>s.expansion.actors.player.facts[id('phase')];
const cancel=async()=>{await p.locator('[data-structured-cancel]').click();await p.waitForFunction(()=>{try{return !window.simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.actorId==='player');}catch{return false;}});};
const prepare=async methods=>{await instant('manifest');await act('prepare');await step(5);for(const n of methods){await act('prepare_'+n);await step(3);}await act('enter');await step(5);};
try{
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);await play();await open();const ordinary=await save();
    for(const [env,pack] of [['L7_OLD_SS_SAVE','book.ss.apprentice'],['L7_OLD_GU_SAVE','book.ri.academy']])if(process.env[env]){
        await load(encodeSaveFile(await readFile(process.env[env],'utf8')));assert.equal((await save()).content_packs.structured.packId,pack);result.checks.push(pack+' unchanged earned receipt imports on company build');await load(encodeSaveFile(JSON.stringify(ordinary)));
    }
    await p.locator('[data-structured-choice="life"]').selectOption(P);await p.locator('[data-structured-begin]').click();
    let s=await save();const opening=JSON.stringify(s),identity=hound(s).body.id;assert.equal(hound(s).vitals.health,10);assert.equal(bag(s,'gem'),2);
    await instant('commission');await instant('cancel_commission');assert.equal(bag(await save(),'gem'),2);await instant('commission');await step(1);s=await save();
    let sleep=s.expansion.simulation.jobs.find(j=>j.actorId===id('hound'));assert.deepEqual(sleep.participants,[id('hound')]);assert.equal(sleep.due-s.expansion.clock,30);assert.equal(await p.locator(`[data-structured-action="${id('manifest')}"]`).isDisabled(),true);await roundTrip('pending-independent-sleep');
    const perception=s.levels.person.main_character.skill_xp.Perception;await act('camp_work');await step(5);s=await save();assert.equal(s.levels.person.main_character.skill_xp.Perception,perception+1);assert.equal(s.expansion.simulation.jobs.length,1);assert.equal(hound(s).body.rank,0);await step(25);s=await save();assert.equal(hound(s).body.id,identity);assert.equal(hound(s).body.rank,1);assert.equal(hound(s).vitals.health,29);assert.equal(hound(s).body.strike,6.75);await roundTrip('same-companion-grown');
    await instant('manifest');await act('prepare');await step(2);await roundTrip('pending-party-provision');await cancel();s=await save();assert.equal(stock(s,'warden','badge'),6);assert.equal(bag(s,'ration'),8);
    await act('prepare');await step(5);await act('prepare_brace');await step(3);await act('enter');await step(2);await roundTrip('pending-party-travel');await step(3);s=await save();assert.equal(s['current location'],id('ruin'));assert.equal(hound(s).location,id('ruin'));
    await act('breach_1');await step(2);await roundTrip('pending-patrol-stage');await step(3);s=await save();assert.equal(hound(s).vitals.health,24.375);assert.equal(s.expansion.actors.player.facts[id('injury')],1);assert(s.character.hp_to_full>0,'actual native body retains breach damage after its minute');result.nativeDamageOffset=s.character.hp_to_full;result.comparisons.grownBrace={health:hound(s).vitals.health,max:hound(s).vitals.max_health};
    await act('report');await step(2);await roundTrip('pending-return-report');await cancel();s=await save();assert.equal(bag(s,'badge'),0);assert.equal(stock(s,'hound','badge'),1);assert.equal(phase(s),3);
    await act('report');await step(5);s=await save();assert.equal(bag(s,'badge'),1);assert.equal(stock(s,'warden','badge'),5);assert.equal(s['current location'],id('camp'));assert.equal(hound(s).location,id('camp'));assert.equal(await p.locator(`[data-structured-action="${id('report')}"]`).count(),0);
    await act('treat');await step(5);s=await save();assert.equal(s.expansion.actors.player.facts[id('injury')],0);assert.equal(s.character.hp_to_full,0);await roundTrip('returned-treated-party');
    await instant('buy_gem');assert.equal(bag(await save(),'badge'),0);await instant('commission');await step(1);s=await save();sleep=s.expansion.simulation.jobs.find(j=>j.actorId===id('hound'));assert.equal(sleep.due-s.expansion.clock,60);
    for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
        await p.setViewportSize({width,height});await p.locator('#workspace_navigation select').first().selectOption('customization');await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await open();
        const row=p.locator('#structured_pack_panel p').filter({hasText:/^Your same shadow:/});await row.evaluate(el=>el.scrollIntoView({block:'center'}));
        const geometry=await p.locator('#structured_pack_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));assert.equal(geometry.font,size);assert.equal(geometry.pageOverflow,false);await p.screenshot({path:path.join(out,`company-${width}-${size}.png`)});result.matrix.push({width,height,size,...geometry});
    }
    await load(encodeSaveFile(opening));await step(10);const ready=JSON.stringify(await save());await writeFile(path.join(out,'earned-patrol-ready-fixture.json'),ready);
    for(const [name,methods,action,minutes,expected] of [['rope',['rope'],'ledge_0',10,19],['brace',['brace'],'breach_0',5,14.5],['both',['rope','brace'],'supported_0',5,19],['unprepared',[],'unprepared_0',5,13]]){
        await load(encodeSaveFile(ready));await prepare(methods);await act(action);await step(minutes);s=await save();assert.equal(hound(s).vitals.health,expected);result.comparisons[name]={health:hound(s).vitals.health,max:hound(s).vitals.max_health,nativeHpOffset:s.character.hp_to_full,report:s.expansion.actors.player.facts[id('report')]};
        if(name==='unprepared'){assert.equal(await p.locator(`[data-structured-action="${id('report')}"]`).isDisabled(),true);await act('withdraw');await step(5);s=await save();assert.equal(bag(s,'badge'),0);assert.equal(stock(s,'warden','badge'),6);assert.equal(hound(s).location,id('camp'));assert.equal(s['current location'],id('camp'));await roundTrip('failed-patrol-withdrawal');}
        else{await act('report');await step(5);assert.equal(bag(await save(),'badge'),1);}
    }
    assert.deepEqual(result.errors,[]);result.checks.push('same captured identity and actual body growth; useful player work during NPC sleep','actual rope/brace/both preparations change stage; growth reduces actual injury','native breach damage, dressing and allocated single payment; no replay','failed unprepared attempt returns both bodies and escrow without paying report');result.success=true;result.reviewState='agent-verified, not human-reviewed';result.bundleSha256=createHash('sha256').update(await readFile(path.join(build,'dist/bundle.js'))).digest('hex');
}catch(e){result.failure=e.stack;result.panel=await p.locator('#structured_pack_panel').innerText().catch(()=>'');await writeFile(path.join(out,'failure-save.json'),JSON.stringify(await save(),null,2)).catch(()=>{});await p.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw e;
}finally{await writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2));await context.close();await browser.close();server.close();}
console.log(JSON.stringify({success:result.success,bundleSha256:result.bundleSha256,checks:result.checks,matrix:result.matrix,comparisons:result.comparisons,errors:result.errors}));
