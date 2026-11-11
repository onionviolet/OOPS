// Companion work orders (CPR15) and opinion apart from allegiance (CPR18), FRC55. Fresh origin, rebuilt bundle, headless 1920x1080.
// Route: RI keeper -> take the Moonlight Gu -> tend order -> a day on the clock -> refine -> well-kept windows (fond) -> give it back
// (opinion stays) -> take it back -> save/reload/Export/Import at each stage. Usage: node scripts/playtest/gu-work-orders.mjs <built root> <outDir>
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {encodeSaveFile} from '../../src/save_files.js';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const build=path.resolve(process.argv[2]||'.');
const out=path.resolve(process.argv[3]||'/private/tmp/claude-501/gu-work-orders');
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
const result={route:'fresh Village → RI Gu keeper → Moonlight Gu → tend order → refine → fond → give back → take back → save/reload/import',errors:[],checks:[],matrix:[]};
p.on('pageerror',e=>result.errors.push(e.message));
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};
const open=()=>p.locator('#workspace_navigation select').first().selectOption('beginning');
const save=()=>p.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});
// Loading materializes zero XP for NPC skills; absence and explicit zero agree.
// Preserve the player ledger and every nonzero NPC entry in exact comparisons.
const skillDigest=levels=>({...levels,person:Object.fromEntries(Object.entries(levels.person).map(([id,ledger])=>[id,id==='main_character'?ledger:{...ledger,skill_xp:Object.fromEntries(Object.entries(ledger.skill_xp).filter(([,xp])=>xp!==0))}]))});
const digest=s=>({mood:s.moodThoughts,record:s.content_packs?.structured,actors:s.expansion.actors,simulation:s.expansion.simulation,clock:s.expansion.clock,inventory:s.inventories,skills:skillDigest(s.levels)});
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

const line=async sel=>(await p.locator(sel).first().innerText()).trim();
const larder=(s,n,f)=>sim(s).owners[id(n)]?.[key(f)]||0;
try {
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);await play();await open();
    await p.locator('[data-structured-choice="life"]').selectOption(P);await p.locator('[data-structured-begin]').click();
    await p.locator('.gu-house').waitFor();
    await instant1('take_moon');await instant1('feed_moon');
    result.checks.push('before an order: '+await line('[data-gu-row="moon"] [data-gu="work-order"]'));
    await instant1('order.moon_tend.on');
    result.checks.push('order set: '+await line('[data-gu-row="moon"] [data-gu="work-order"]'));
    let s=await save();const before=larder(s,'moon','petals');
    await step(DAY);s=await save();
    assert.equal(larder(s,'moon','petals'),before-4+2,'ate 4, tended 2 into its larder');
    assert.equal(s.expansion.actors[id('moon')].facts[id('moon_kept.worked')],true);
    result.checks.push(`after one day: larder ${before} -> ${larder(s,'moon','petals')} (ate 4, tended 2); `+await line('[data-gu-row="moon"] [data-gu="work-order"]'));
    assert.equal(await p.locator(`[data-structured-action="${id('work_moon')}"]`).isDisabled(),true,'hand work shares the window');
    await shot('01-tend-order');await roundTrip('tend-order');
    // Refine: stipend for stones, lees for the steep; a failed steep injures, so rest it back and try again.
    let tries=0;const bag=(s,n)=>s.inventories.person.main_character[key(n)]?.count||0;
    while(!(await save()).expansion.actors[id('moon')].facts[id('moon_refined')]&&tries<12){
        s=await save();
        if(gu(s,'moon').vitals.health>=3&&bag(s,'lees')>=2){await instant1('fuse');tries++;continue;}
        while(stones(await save())<2){await act1('chores');await step(120);}
        if(bag(s,'lees')<2)await instant1('buy_lees');
        if(gu(s,'moon').vitals.health<3){await instant1('buy_petals');await instant1('feed_moon');await step(DAY);}
    }
    s=await save();assert.ok(s.expansion.actors[id('moon')].facts[id('moon_refined')],'refined within the tries');result.matrix.push({refineTries:tries});
    // Well-kept windows: keep its larder topped up and let the order work.
    for(let i=0;i<4;i++){s=await save();if(stones(s)>=1&&(s.inventories.person.main_character[key('petals')]?.count||0)<6)await instant1('buy_petals');
        if((s.inventories.person.main_character[key('petals')]?.count||0)>=6||true){try{await instant1('feed_moon');}catch{}}await step(DAY);}
    s=await save();
    const mood=(s.moodThoughts?.rows||[]).filter(r=>r.holder===id('moon'));
    result.matrix.push({opinionRows:mood.length,sources:[...new Set(mood.map(r=>r.source))]});
    const opinionText=await line('[data-gu-row="moon"] [data-gu="opinion"]');result.checks.push('opinion line: '+opinionText);
    assert.match(opinionText,/remembers you: fond/);
    assert.match(await line('[data-gu-row="moon"] [data-gu="work-order"]'),/fond toward you: one more/);
    await shot('02-fond');await roundTrip('fond');
    // Give it back: the claim, control, order and tie end; the opinion stays.
    await instant1('return_moon');s=await save();
    assert.equal(sim(s).claims[id('moon_title')].owner,id('steward'));assert.equal(s.expansion.actors.player.facts[id('order_moon')],'none');
    const kept=await line('[data-gu-row="moon"] [data-gu="remembers"]');result.checks.push('given back: '+kept);assert.match(kept,/remembers you: fond/);
    await shot('03-given-back');await roundTrip('given-back');
    await instant1('retake_moon');s=await save();assert.equal(sim(s).claims[id('moon_title')].owner,'player');
    result.checks.push('taken back: '+await line('[data-gu-row="moon"] [data-gu="being"]')+' / '+await line('[data-gu-row="moon"] [data-gu="opinion"]'));
    await shot('04-taken-back');await roundTrip('taken-back');
    assert.deepEqual(result.errors,[]);result.bundleSha256=createHash('sha256').update(await readFile(path.join(build,'dist/bundle.js'))).digest('hex');result.reviewState='agent-verified, not human-reviewed';result.success=true;
}catch(e){result.failure=e.stack;result.panel=await p.locator('#structured_pack_panel').innerText().catch(()=>'');await p.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{await writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2));await context.close();await browser.close();server.close();}
console.log(JSON.stringify({success:result.success,failure:result.failure,bundleSha256:result.bundleSha256,checks:result.checks,matrix:result.matrix,errors:result.errors}));
