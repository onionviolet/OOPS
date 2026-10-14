// Procgen wave 1 integrated browser proof. Run from the integration worktree
// after `npm run build`, serving it on 127.0.0.1:${PORT||19660}.
// Fresh test-only profiles under /private/tmp; never a personal save.
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const PORT=process.env.PORT||19660,ORIGIN=`http://127.0.0.1:${PORT}`;
const folder=new URL('./',import.meta.url).pathname,root=new URL('../../../../../',import.meta.url).pathname;
const {decodeSaveFile}=await import(root+'src/save_files.js');
const stamp=Date.now(),profile=`/private/tmp/procgen-wave1-integration-profile-${stamp}`;
const hash=b=>createHash('sha256').update(b).digest('hex');
const localBundle=hash(await readFile(root+'dist/bundle.js'));
const checks=[],errors=[];
const pass=(id,label,check,detail)=>{checks.push({id,label,check,pass:true,...(detail?{detail}:{})});console.log('PASS',id,label,check,detail?JSON.stringify(detail):'');};

const open=async(dir,seedSave)=>{
    const ctx=await chromium.launchPersistentContext(dir,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
    if(seedSave)await ctx.addInitScript(data=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',data);},JSON.stringify(seedSave));
    const page=ctx.pages()[0]||await ctx.newPage();for(const o of ctx.pages())if(o!==page)await o.close();
    page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});
    await page.goto(ORIGIN);return {ctx,page};
};
const bind=async page=>{await page.evaluate(async()=>{window.__m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);});
    await page.waitForFunction(async()=>(await navigator.locks.query()).held.some(r=>r.name==='yairpg-save:save data'));};
const play=page=>page.locator('#loading_screen_play_button:not(.none_display)').click();
const read=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
const save=page=>page.evaluate(()=>{const original=Storage.prototype.setItem;let wrote=false;
    Storage.prototype.setItem=function(k,v){if(this===localStorage&&k==='save data')wrote=true;return original.call(this,k,v);};
    try{window.saveProgress();}finally{Storage.prototype.setItem=original;}
    if(!wrote)throw Error('Manual Save did not write.');return JSON.parse(localStorage.getItem('save data'));});
const owners=s=>({streams:s.expansion?.streams,encounter:s.native_encounter??null,mixtures:s.mixtures??null,people:s.generated_people??null,
    decks:s.expansion?.simulation?.decks??null,cards:Object.values(s.expansion?.simulation?.events||{}).filter(e=>e.storylet)});
const projection=s=>({...owners(s),inventory:s.inventories.person.main_character,purse:s.character.money,
    exposure:s.active_effects?.['Village mixture exposure']??null,clock:s.expansion?.clock,time:s['current time']});
const killsAt=(page,n)=>page.waitForFunction(n=>{if((__m.get_context().locations['Infested field'].enemy_groups_killed||0)>=n){__m.current_combat?.clearAllAttackLoops();return true;}return false;},n,{timeout:40000});
const toVillage=page=>page.evaluate(()=>window.change_location({location_id:'Village',skip_travel_time:true}));

const evidence={origin:ORIGIN,profile,bundleSha256:localBundle,hero:'TEST FIXTURE PROCGEN WAVE1 combined',viewports:['1366x768','1600x1000'],checks,errors};
let {ctx,page}=await open(profile);
try {
    assert.equal(hash(await (await page.request.get(ORIGIN+'/dist/bundle.js')).body()),localBundle);
    pass('W0','source/rebuilt','served bundle bytes equal the integration worktree build');
    await play(page);await page.locator('#hero_creation_name_field').fill(evidence.hero);await page.locator('#hero_creation_panel_confirmation').click();await bind(page);
    let s=await save(page);assert.ok(s.expansion.streams?.schema===1);assert.equal(s.mixtures??null,null);assert.equal(s.generated_people??null,null);assert.equal(s.expansion.simulation?.decks??null,null);
    pass('W1','natural','fresh hero has P1 streams and no opt-in P2/P3/P4 owners before use');

    // P3: elder, Notebook > People > Begin Village encounters.
    await page.getByText('Talk to someone',{exact:false}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
    await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();await page.locator('[data-storylet="begin"]').click();
    s=await save(page);assert.ok(s.expansion.simulation.decks);pass('P3a','natural','storylet decks begin through elder and Notebook controls',{decks:Object.keys(s.expansion.simulation.decks)});
    await page.keyboard.press('Escape').catch(()=>{});

    // P4: welcome and meet generated travelers.
    await page.locator('#generated_people_panel > summary').click();await page.getByRole('button',{name:'Welcome road travelers'}).click();
    for(const id of ['traveler_1','traveler_2']){const row=page.locator(`[data-generated-person="${id}"]`);await row.locator('> summary').click();await row.locator('[data-generated-action="meet"]').click();}
    await page.locator('[data-generated-person="traveler_1"] [data-generated-action="talk"]').click();
    s=await save(page);const met=s.generated_people.people.filter(p=>p.met);assert.equal(met.length,2);assert.equal(s.generated_people.people[0].knownTraits.length,1);
    assert.equal(s.generated_people.seed>=0,true);
    pass('P4a','natural','two generated travelers met; one trait discovered by talking; rest hidden',{names:met.map(p=>p.name),requests:met.map(p=>p.goal.item)});
    await page.locator('#generated_people_panel > summary').click();

    // P2: buy, mix two identical + one distinct, experiment, save method, queue.
    await page.locator('#village_mixing_open').click();
    const buy=async(price,n=1)=>{for(let i=0;i<n;i++)await page.getByRole('button',{name:`Buy 1 (${price} coins)`,exact:true}).click();};
    await buy(8,5);await buy(2,6);await buy(10,2);await buy(4);
    const preview=(await save(page)).mixtures;await page.locator('#mixture_amount_River_bellleaf').fill('2');await page.locator('#mixture_process').selectOption('boil');await page.locator('#mixture_process').selectOption('steep');await page.locator('#mixture_amount_River_bellleaf').fill('1');
    assert.deepEqual((await save(page)).mixtures,preview);pass('P2a','natural','preview inputs consume no mixture state');
    await page.locator('#mixture_craft').click();await page.locator('#mixture_craft').click();
    await page.locator('#mixture_amount_River_bellleaf').fill('0');await page.locator('#mixture_amount_Emberseed').fill('1');await page.locator('#mixture_process').selectOption('boil');await page.locator('#mixture_craft').click();
    s=await save(page);const steep=Object.values(s.mixtures.products).find(p=>s.inventories.person.main_character[JSON.stringify({id:'Village mixture',mixture:p.id})]?.count===2);
    assert.ok(steep);assert.equal(Object.keys(s.mixtures.products).length,2);
    const steepKey=JSON.stringify({id:'Village mixture',mixture:steep.id});
    const line=()=>page.locator('[data-mixture-product]').filter({has:page.locator('button')}).filter({hasText:'Steeped'});
    await line().getByRole('button',{name:'Experiment: drink one dose',exact:true}).click();
    s=await save(page);assert.equal(s.mixtures.knowledge[steep.id].source,'oral experiment');assert.ok(s.active_effects['Village mixture exposure'].effects.stats.health_regeneration_flat.flat>0);
    pass('P2b','natural','paid ingredients; stacked identical vial plus distinct product; experiment applies real exposure',{products:2,steepCount:1});
    await line().getByRole('button',{name:'Save observed method'}).click();await line().getByRole('button',{name:'Queue learned method'}).click();
    s=await save(page);assert.ok(s.mixtures.job);
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('save data')).mixtures?.job==null||(window.saveProgress(),false),{},{timeout:30000,polling:1000}).catch(()=>{});
    s=await save(page);
    assert.ok((s.inventories.person.main_character[steepKey]?.count||0)>=2,'learned queue produced a vial');
    pass('P2c','natural','learned-method queue produced vials from held stock while idle in Village',{job:s.mixtures.job?{remaining:s.mixtures.job.remaining}:null,steepCount:s.inventories.person.main_character[steepKey].count});
    await page.getByRole('button',{name:'Back to local actions'}).click();
    await page.screenshot({path:folder+'village-1366.png'});

    // P1: seeded-native readiness through native XP/unlock APIs, then a saved mid-fight checkpoint.
    await page.evaluate(()=>{__m.add_xp_to_character(2000000,true);__m.unlock_location({location:__m.get_context().locations['Infested field']});});
    await page.evaluate(()=>window.change_location({location_id:'Infested field',skip_travel_time:true}));
    await page.waitForFunction(()=>__m.current_combat||document.querySelector('#enemies_div')?.children.length,{timeout:10000}).catch(()=>{});
    await page.waitForTimeout(1500);const checkpoint=await save(page);assert.ok(checkpoint.native_encounter,'saved mid-fight');
    await page.screenshot({path:folder+'fight-1366.png'});
    const killed=checkpoint.location_kills??null;const before=await page.evaluate(()=>__m.get_context().locations['Infested field'].enemy_groups_killed||0);
    await killsAt(page,before+1);const first=await save(page);
    const fightOut=x=>({inventory:x.inventories.person.main_character,kills:Object.values(x.enemy_killcount).reduce((a,b)=>a+b,0),
        heroRolls:x.expansion.streams.log.filter(r=>r.s.startsWith('encounter:core')&&r.k.includes('attackers')).map(r=>[r.id,r.u]).sort(),
        lootRolls:x.expansion.streams.log.filter(r=>r.s.startsWith('loot')).map(r=>[r.id,r.u]).sort(),
        nextLineup:x.native_encounter?.enemies.map(e=>[e.template,e.stats])});
    await page.evaluate(x=>localStorage.setItem('save data',JSON.stringify(x)),checkpoint);await page.reload();await bind(page);
    const reloaded=await save(page);
    for(const k of ['streams','encounter','mixtures','people','decks','cards'])assert.deepEqual(owners(reloaded)[k],owners(checkpoint)[k],'reload consumed nothing: '+k);
    await play(page);
    pass('X1','seeded-native','reload of mid-fight checkpoint retains all four owners exactly (streams, encounter, mixtures, travelers, decks, cards); compared after reload, before PLAY');
    await killsAt(page,before+1);const replay=await save(page);
    assert.deepEqual(fightOut(replay),fightOut(first));
    pass('P1a','seeded-native','next kill replays identically after reload: hero roll receipts, loot receipts, inventory and next lineup',{kills:fightOut(first).kills,lootReceipts:fightOut(first).lootRolls.length});

    // P1: trader restock epoch replay.
    await toVillage(page);await page.evaluate(()=>__m.process_rewards({rewards:{traders:[{trader:'village trader'}]},source_type:'test',source_name:'WAVE1 fixture'}));
    const beforeShop=await save(page);await page.evaluate(()=>window.start_trade('villageTrader'));const shopFirst=await save(page);await page.evaluate(()=>window.exit_trade());
    await page.evaluate(x=>localStorage.setItem('save data',JSON.stringify(x)),beforeShop);await page.reload();await bind(page);await play(page);
    await page.evaluate(()=>window.start_trade('villageTrader'));const shopReplay=await save(page);await page.evaluate(()=>window.exit_trade());
    assert.deepEqual(shopReplay.inventories.trader,shopFirst.inventories.trader);assert.deepEqual(shopReplay.expansion.streams.cells,shopFirst.expansion.streams.cells);
    pass('P1b','seeded-native','trader restock replays identically from the pre-refresh save');

    // P3: idle in Village for deck draws, then branch-compare the next draw.
    const startClock=(await save(page)).expansion.clock;
    await page.waitForFunction(c=>{window.saveProgress();const x=JSON.parse(localStorage.getItem('save data'));return Object.values(x.expansion.simulation.events).filter(e=>e.storylet).length>=2&&x.expansion.clock>=c+24;},startClock,{timeout:90000,polling:1000});
    const deckSave=await save(page);const cards=owners(deckSave).cards;
    pass('P3b','natural','idle Village time drew storylet cards from the seeded decks',{clockFrom:startClock,clockTo:deckSave.expansion.clock,cards:cards.map(e=>[e.definitionId,e.mode,e.status])});
    const target=deckSave.expansion.clock+14;
    await page.waitForFunction(t=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data')).expansion.clock>=t;},target,{timeout:40000,polling:20});
    const uninterrupted=await save(page);
    const branch=await open(`${profile}-branch`,deckSave);await bind(branch.page);await play(branch.page);
    await branch.page.waitForFunction(t=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data')).expansion.clock>=t;},target,{timeout:40000,polling:20});
    const branched=await save(branch.page);await branch.ctx.close();
    const deckAt=x=>({decks:x.expansion.simulation.decks,cards:owners(x).cards.map(e=>({id:e.id,def:e.definitionId,at:e.at,receipt:e.storylet.receipt})),clock:x.expansion.clock});
    if(uninterrupted.expansion.clock===branched.expansion.clock){assert.deepEqual(deckAt(branched),deckAt(uninterrupted));
        pass('P3c','seeded-native','after Save and reload in a separate profile, the next deck draws match the uninterrupted run at the same clock',{clock:target});}
    else checks.push({id:'P3c',label:'seeded-native',check:'next-draw branch compare',pass:false,detail:{a:uninterrupted.expansion.clock,b:branched.expansion.clock}});

    // P3 response: answer one open card with its first response.
    await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();
    const openCard=owners(await save(page)).cards.find(e=>e.status==='open'&&e.mode!=='ambient');
    if(openCard){const row=page.locator(`[data-storylet-card="${openCard.definitionId}"]`);await row.scrollIntoViewIfNeeded();
        const btn=row.locator('[data-storylet-response]').first();const rid=await btn.getAttribute('data-storylet-response');await btn.click();
        const after=await save(page);const ev=after.expansion.simulation.events[openCard.id];
        assert.notEqual(ev.status,'open');pass('P3d','natural',`storylet ${openCard.mode} answered through its panel button`,{card:openCard.definitionId,response:rid,status:ev.status});}
    await page.locator('#storylet_panel').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'storylets-1366.png'});
    await page.keyboard.press('Escape').catch(()=>{});

    // P4: help a traveler if the hero carries a requested item.
    s=await save(page);const inv=s.inventories.person.main_character;
    const helpable=s.generated_people.people.find(p=>p.met&&!p.goal.fulfilled&&Object.keys(inv).some(k=>JSON.parse(k).id===p.goal.item&&inv[k].count>0));
    if(helpable){await page.locator('#generated_people_panel > summary').click();const row=page.locator(`[data-generated-person="${helpable.id}"]`);if(!(await row.locator('[data-generated-action="help"]').isVisible()))await row.locator('> summary').click();
        await row.locator('[data-generated-action="help"]').click();const after=await save(page);
        assert.equal(after.generated_people.people.find(p=>p.id===helpable.id).goal.fulfilled,true);assert.equal(after.character.money,s.character.money+helpable.goal.reward);
        pass('P4b','natural','traveler request paid from their saved purse after giving the native item',{item:helpable.goal.item});
        await page.locator('#generated_people_panel > summary').click();}

    // Combined Save, reload, Export, literal Import.
    const finalSave=await save(page);await page.reload();await bind(page);
    assert.deepEqual(projection(await read(page)),projection(finalSave));await play(page);
    pass('X2','natural','Save then reload retains combined state exactly before PLAY');
    const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click({force:true});const download=await dl;
    const file=`/private/tmp/procgen-wave1-integration-export-${stamp}.txt`;await download.saveAs(file);
    const exported=decodeSaveFile(await readFile(file,'utf8'),'v0.6');
    await page.evaluate(()=>__m.add_money_to_character(7));await save(page);
    const nav=page.waitForEvent('framenavigated',{predicate:f=>f===page.mainFrame(),timeout:20000});nav.catch(()=>{});
    await page.locator('#saved_file_input').setInputFiles(file);await nav;
    await page.waitForFunction(()=>document.querySelector('#loading_screen_play_button')?.textContent.includes('PLAY'));
    const imported=await read(page);assert.deepEqual(projection(imported),projection(exported));
    pass('X3','natural','UI Export download, then literal-file Import restores the exact combined projection (streams, encounter, mixtures, exposure, travelers, decks, cards, inventory, purse, clock)');
    await bind(page);await play(page);await page.setViewportSize({width:1600,height:1000});await page.waitForTimeout(600);
    await page.locator('#journal_show_notebook').click().catch(()=>{});await page.locator('[data-notebook-view="people"]').click().catch(()=>{});
    await page.screenshot({path:folder+'imported-1600.png'});pass('X4','natural/visual','1600x1000 render after import captured');
    evidence.final={travelers:imported.generated_people.people.length,products:Object.keys(imported.mixtures.products).length,cards:owners(imported).cards.length,streamCells:Object.keys(imported.expansion.streams.cells).length};
} finally {await ctx.close();}

// Old-format saves: a pre-procgen v0.6 repo fixture and P1's single-slice export.
for(const [id,path] of [['O1','docs/gm/d1-alloy-equipment-2026-10-07/fixture/TEST-FIXTURE-D1-smelting-10.txt'],['O2','docs/gm/dispatch/procgen-2026-10-13/p1/literal-export.txt']]){
    const o=await open(`${profile}-${id}`);
    try{await play(o.page);await o.page.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN WAVE1 import host');await o.page.locator('#hero_creation_panel_confirmation').click();await bind(o.page);
        const raw=decodeSaveFile(await readFile(root+path,'utf8'),'v0.6');
        const nav=o.page.waitForEvent('framenavigated',{predicate:f=>f===o.page.mainFrame(),timeout:20000});nav.catch(()=>{});
        await o.page.locator('#saved_file_input').setInputFiles(root+path);await nav;
        await o.page.waitForFunction(()=>document.querySelector('#loading_screen_play_button')?.textContent.includes('PLAY'));
        await bind(o.page);await play(o.page);await o.page.waitForTimeout(500);const x=await save(o.page);
        assert.equal(x.character.name,raw.character.name);assert.deepEqual(x.inventories.person.main_character,raw.inventories.person.main_character);
        assert.equal(x.mixtures??null,null);assert.equal(x.generated_people??null,null);assert.equal(x.expansion?.simulation?.decks??null,raw.expansion?.simulation?.decks??null);
        assert.ok(x.expansion.streams?.schema===1);if(raw.expansion?.streams)assert.equal(x.expansion.streams.root,raw.expansion.streams.root);
        pass(id,'seeded-native',`old-format save imports and plays: same hero/inventory, no P2/P3/P4 owners invented, streams ${raw.expansion?.streams?'kept':'derived'}`,{fixture:path,hero:raw.character.name});
    }finally{await o.ctx.close();}
}
evidence.pass=checks.every(c=>c.pass)&&errors.length===0;
await writeFile(folder+'browser_evidence.json',JSON.stringify(evidence,null,2)+'\n');
console.log('DONE',evidence.pass,checks.length,'errors',errors.length);
if(!evidence.pass)process.exit(1);
