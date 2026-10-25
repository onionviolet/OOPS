const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {pathToFileURL}=require('node:url');
const R='/Users/weiwei/code/yet-another-idle-rpg/';
const {launchChrome,withTestHooks,openNotebook}=require(R+'scripts/ui_helpers.cjs');
const W=+process.argv[2],PORT=process.argv[3],OUT=process.argv[4];fs.mkdirSync(OUT,{recursive:true});
const log=[];const ok=m=>{log.push('PASS '+m);console.log('PASS '+m);};
(async()=>{
const {planProcessedMaterial}=await import(pathToFileURL(R+'src/material_lineage.js'));
const {gradedKey}=await import(pathToFileURL(R+'src/harvest.js'));
const b=await launchChrome();const errs=[];
const play=async page=>{await page.waitForFunction(()=>{const b=document.getElementById('loading_screen_play_button');return !!b&&b.checkVisibility();},null,{timeout:20000}).catch(()=>{});await page.evaluate(()=>document.getElementById('loading_screen_play_button')?.click());await page.waitForFunction(()=>{const l=document.getElementById('loading_screen');return !l||!l.checkVisibility();},null,{timeout:20000}).catch(()=>{});};
const open=async fixture=>{const ctx=await b.newContext({viewport:{width:W,height:900},acceptDownloads:true});
 if(fixture)await ctx.addInitScript(d=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(d))},fixture);
 const page=await ctx.newPage();page.on('pageerror',e=>errs.push(e.message));
 await page.goto(withTestHooks(`http://127.0.0.1:${PORT}/`));await page.waitForTimeout(400);
 if(!(await page.locator('#chronicle_life_end').isVisible()))await play(page);
 if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
 await page.waitForTimeout(400);return {page,ctx};};
const save=async page=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
const openMod=async(page,id)=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);await page.waitForTimeout(400);};
const panel=async page=>{await page.locator('[data-route-id="known-people"]').click();await page.waitForTimeout(500);
 const t=page.locator('[data-notebook-view="people"]');if(await t.isVisible())await t.click();
 if(!(await page.locator('#chronicle_panel').isVisible())){await openMod(page,'notebook');await page.waitForTimeout(300);const t2=page.locator('[data-notebook-view="people"]');if(await t2.isVisible())await t2.click();}
 await page.locator('#chronicle_panel').waitFor({state:'visible',timeout:5000});if(!(await page.locator('#chronicle_panel').evaluate(n=>n.open)))await page.locator('#chronicle_panel summary').click();};
const shot=(page,f)=>page.screenshot({path:path.join(OUT,`${f}-${W}.png`)});
// 1 fresh enrol
let {page,ctx}=await open();
await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.waitForTimeout(800);await page.locator('.end_dialogue_button:visible, button:has-text("Village"):visible').first().click({timeout:5000});
await panel(page);await page.locator('[data-chronicle="begin-open"]').click();
const enrolled=await save(page);assert.ok(enrolled.expansion.chronicle);assert.deepEqual(enrolled.discovery_codex.schema,1);assert.equal(enrolled.inheritance_law,undefined);
ok('fresh game saves discovery_codex slice; law slice absent at default');
// law panel
await openMod(page,'lives_carry');
const pv=await page.locator('#lives_carry_panel').isVisible();assert.ok(pv,'panel visible');
const txt=await page.locator('#lives_carry_panel').innerText();assert.match(txt,/Discovery codex, kept across every life/);assert.match(txt,/single-successor \(default\)|single-successor/);assert.match(txt,/What crosses · Frontier/);assert.match(txt,/halved/);
await shot(page,'01-lives-panel-default');ok('records panel opens from the panel picker showing codex count, law default with reason, ledger');
await page.locator('#lives_carry_law').selectOption('primogeniture');await page.waitForTimeout(200);
assert.match(await page.locator('#lives_carry_panel').innerText(),/primogeniture: Town custom/);
const withLaw=await save(page);assert.equal(withLaw.inheritance_law.law,'primogeniture');await shot(page,'02-law-primogeniture');ok('law dial change persists in inheritance_law slice and states its reason');
await ctx.close();
// 2 ended life fixture
const raw=gradedKey('Rat pelt',85,'whole');
const made=planProcessedMaterial({stock:{[raw]:1},inputs:[{item_key:raw,count:1}],output:{id:'Processed rat pelt',family:'animal-hide',count:1},process:{id:'drying',revision:1,at:40,world_id:'base.frontier',parameters:{method:'rack'}},sourceFacts:{[raw]:{born:0,origin_world:'base.frontier'}}});
const fx=structuredClone(withLaw);delete fx.discovery_codex; // old-save shape: no codex slice
const c=fx.expansion.chronicle;c.life.mode='mortal';c.life.initialAge=80-1/(360*24*60);c.relationships.villageElder.ties.firstConcession=true;
fx.inventories.person.main_character[made.item_key]={count:1};
({page,ctx}=await open(fx));await page.locator('#chronicle_life_end').waitFor({state:'visible',timeout:8000});
const dead=await save(page);assert.notEqual(dead.expansion.chronicle.life.endedAt,null);assert.ok(dead.discovery_codex,'old save gained codex slice on load');
ok('old-shape save (no codex slice) loads and the life ends');
const endTxt=await page.locator('#chronicle_life_end').innerText();
assert.match(endTxt,/What crosses to the next life/);assert.match(endTxt,/Reputation: halved, last life/);assert.match(endTxt,/Heirlooms: 1 processed good gains a line/);assert.match(endTxt,/Inheritance law: Town custom/);assert.match(endTxt,/Discovery codex kept across lives: \d+ found/);
await shot(page,'03-death-ledger');ok('death dialog shows carry ledger, heirloom line, law reason, codex count');
const heirSave=await save(page);
assert.equal(heirSave.expansion.chronicle.life.experience.generation,2);assert.equal(heirSave.inheritance_law.law,'primogeniture');assert.ok(heirSave.discovery_codex.seen.item.length>=1);
const heirKeys=Object.keys(heirSave.inventories.person.main_character);const hk=heirKeys.find(k=>k.includes('"deeds"'));assert.ok(hk,'heirloom key has deeds');
assert.deepEqual(JSON.parse(hk).lineage.deeds.map(d=>[d.kind,d.holder]),[['passed','the heir']]);
ok('heir save keeps codex + law slices and the heirloom gains a passed line');
// remember
await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.waitForTimeout(600);await page.locator('.end_dialogue_button:visible, button:has-text("Village"):visible').first().click();await page.waitForTimeout(600);
await panel(page);const rem=page.locator('[data-chronicle="remember"]');console.log('loc',await page.evaluate(()=>JSON.parse(localStorage.getItem('save data'))['current location']));await panel(page);assert.ok(await rem.isVisible(),'remember option visible');
await shot(page,'04-remember-offered');await rem.click();const after=await save(page);assert.equal(after.expansion.chronicle.relationships.villageElder.ties.rememberedConcession,true);assert.ok(await rem.isHidden());
ok('remembers option appears in life 2 and resolves once');
// item detail
await page.locator('#journal_show_inventory, [data-journal-view="inventory"], #inventory_tab').first().click({timeout:2000}).catch(()=>{});
const tip=await page.evaluate(()=>[...document.querySelectorAll('.item_tooltip')].map(t=>t.textContent).find(t=>/Heirloom history/.test(t))||null);
assert.ok(tip,'tooltip carries heirloom history');assert.match(tip,/passed to the heir/);assert.match(tip,/Heirloom value \d+ \(\d+ from age, 1 per year; 2 from 1 recorded line, 2 each\)/);
ok('item detail states heirloom line and value in parts: '+tip.match(/Heirloom history.*$/)[0].slice(0,160));
const row=page.locator('.item_tooltip',{hasText:'Heirloom history'}).first().locator('xpath=..');await row.scrollIntoViewIfNeeded().catch(()=>{});await row.hover().catch(()=>{});await page.waitForTimeout(300);await shot(page,'05-heirloom-detail');
// reload, export, import
await page.reload();await page.waitForTimeout(500);if(await page.getByText('PLAY',{exact:true}).isVisible())await play(page);await page.waitForTimeout(600);
const reloaded=await save(page);assert.equal(reloaded.inheritance_law.law,'primogeniture');assert.deepEqual(reloaded.discovery_codex.seen.item.sort(),heirSave.discovery_codex.seen.item.sort());assert.equal(reloaded.expansion.chronicle.relationships.villageElder.ties.rememberedConcession,true);
ok('reload keeps law, codex, remembered greeting');
const encoded=await page.evaluate(()=>window.save_to_file());
await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'x.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
await page.waitForTimeout(800);if(await page.getByText('PLAY',{exact:true}).isVisible())await play(page);await page.waitForTimeout(600);
const imported=await save(page);assert.equal(imported.inheritance_law.law,'primogeniture');assert.ok(imported.discovery_codex.seen.item.length>=heirSave.discovery_codex.seen.item.length);assert.ok(Object.keys(imported.inventories.person.main_character).some(k=>k.includes('"deeds"')));
ok('export then import round-trips law, codex, heirloom lines');
assert.deepEqual(errs,[]);ok('no page errors');
fs.writeFileSync(path.join(OUT,`result-${W}.txt`),log.join('\n'));await b.close();})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
