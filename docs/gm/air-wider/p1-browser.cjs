// Rebuilt game gate; original public proposal only, isolated browser profiles.
const fs=require('fs'),assert=require('assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const {abilityPack}=await import('../../../tests/fixtures/air-wider/ability_pack.js');const pack=abilityPack();
 console.log('launch');const browser=await chromium.launch({channel:'chrome',headless:true});
 console.log('launched');const make=async()=>{const c=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});const p=await c.newPage();p.on('dialog',d=>d.accept());
 await p.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:['airproof/pack.json']}}));await p.route('**/private_packs/airproof/pack.json',r=>r.fulfill({json:pack}));await p.goto('http://127.0.0.1:18840/?structured_candidate=airproof',{waitUntil:'domcontentloaded'});return {c,p};};
 const {c,p}=await make();console.log('loaded');await p.locator('#loading_screen_play_button').click();console.log('play');await p.locator('#hero_creation_panel_confirmation').click();console.log('hero');
 await p.locator('.workspace-layout-menu > summary').click();await p.locator('.workspace-picker > summary').click();await p.locator('[data-workspace-action=restore][data-module=beginning]').click();console.log('opened');
 await p.locator('[data-structured-begin]').click();console.log(await p.locator('#structured_pack_panel').innerText());
 const hand=p.locator('[data-structured-action="airproof.repair.hand"]'),jig=p.locator('[data-structured-action="airproof.repair.jig"]');
 await hand.waitFor();assert.equal(await jig.isDisabled(),true);
 await p.locator('#save_button').click();const read=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));const before=await read();
 await hand.click();await p.locator('#save_button').click();const after=await read();assert.equal(after.character.money,before.character.money-2);assert.equal(after.inventories.person.main_character['{"id":"airproof.fixed"}'].count,1);
 await p.locator('[data-structured-action="airproof.suppress"]').click();assert.equal(await hand.isDisabled(),true);await p.locator('#save_button').click();const refused=await read();assert.equal(refused.character.money,after.character.money);
 await p.reload();await p.locator('#loading_screen_play_button').click();assert.equal(await hand.isDisabled(),true);await p.locator('#save_button').click();const reload=await read();
 const select=s=>({money:s.character.money,inventory:s.inventories.person.main_character,receipt:s.content_packs.structured,faculties:s.expansion.simulation.faculties,powers:s.expansion.simulation.powers,completed:s.expansion.actors.player.completed});assert.deepEqual(select(reload),select(refused));
 const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const download=await dl;const file='/tmp/air-wider-p1-export.txt';await download.saveAs(file);
 const {c:c2,p:p2}=await make();assert.equal(await p2.evaluate(()=>localStorage.getItem('save data')),null);await p2.locator('#saved_file_input').setInputFiles(file);await p2.waitForTimeout(1000);const imported=await p2.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.deepEqual(select(imported),select(reload));
 await p.screenshot({path:'/tmp/air-wider-p1-desktop.png'});console.log(JSON.stringify({viewport:[1366,768],money:[before.character.money,after.character.money,refused.character.money],paidRepair:true,unsupportedJig:true,suppressedHand:true,reload:true,literalFileImport:true,receiptUnchanged:true}));await c2.close();await c.close();await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
