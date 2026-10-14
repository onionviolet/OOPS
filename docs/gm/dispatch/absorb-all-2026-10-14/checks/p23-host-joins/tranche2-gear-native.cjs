// Each invocation owns a fresh browser context and a unique evidence directory.
// Committed fixtures are immutable prerequisites, never another check's output.
const __p00Fs = require('fs'), __p00Path = require('path');
if (!process.env.URL) throw new Error('Set URL to the served native build origin.');
const __p00Base = new URL(process.env.URL);
if (!/^https?:$/.test(__p00Base.protocol)) throw new Error('URL must use HTTP or HTTPS.');
const __p00URL = __p00Base.href.replace(/\/?$/, '/');
const fixtureDir = __p00Path.join(__dirname, 'fixtures');
const __p00ProofRoot = process.env.YAIRPG_PROOF_DIR || require('os').tmpdir();
__p00Fs.mkdirSync(__p00ProofRoot, {recursive: true});
const __p00OutputDir = __p00Fs.mkdtempSync(__p00Path.join(__p00ProofRoot, __p00Path.basename(__filename, '.cjs') + '-'));
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=__p00URL,dir=__p00OutputDir,gates=[];
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true}),c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
const save=async()=>{await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
try{
 const fixture=JSON.parse(fs.readFileSync(path.join(fixtureDir,'tranche1-prelight.json')));fixture['current location']='Village';fixture.character.money=3000;fixture.availabilities.trader.villageTrader=1;fixture.availabilities.location['Infested field']=1;fixture.character.hp_to_full=0;fixture.pacing_e1.fullness=100;delete fixture.household;delete fixture.p23_exposure;
 await p.goto(base+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await p.goto(base);await p.locator('#loading_screen_play_button:not(.none_display)').click();
 const old=await save();assert.equal(old.p23_living_gear,undefined);
 await p.evaluate(()=>window.startTrade('villageTrader'));
 for(const name of ['Cinder keeper ring','Cinder keeper ring','Wayfarer dial','Road memory dagger'])await p.locator('#trader_inventory_div .item_name').getByText(name,{exact:true}).locator('xpath=ancestor::*[contains(@class,"inventory_item_control")]').click();
 await p.locator('#accept_trade_button').click();await p.locator('#exit_trade_button').click();
 const bought=await save();assert.ok(bought.character.money<old.character.money);assert.equal(bought.inventories.person.main_character['{"id":"Cinder keeper ring","quality":100}']?.count||bought.inventories.person.main_character['{"id":"Cinder keeper ring"}']?.count,2);gates.push('paid native trader acquisition; no feature family on old save');
 const equip=async name=>{const row=p.locator('#inventory_content_div .inventory_item_control').filter({has:p.locator('.item_name').getByText(name,{exact:true})});await row.locator('.equip_item_button').click();};
 await equip('Cinder keeper ring');let first=await save();const firstRing=first.character.equipment.ring.inventory_key;assert.ok(JSON.parse(firstRing).e2_instance);
 await equip('Cinder keeper ring');let second=await save();const secondRing=second.character.equipment.ring.inventory_key;assert.notEqual(firstRing,secondRing);assert.equal(second.inventories.person.main_character[firstRing].count,1);
 await equip('Wayfarer dial');await equip('Road memory dagger');let ready=await save();gates.push('two bought ring copies receive distinct identities with condition off');
 fs.writeFileSync(path.join(dir,'tranche2-equipped.json'),JSON.stringify(ready));
 const pendingDownload=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const pd=await pendingDownload,pendingFile=path.join(dir,'tranche2-pending-gear.save.txt');await pd.saveAs(pendingFile);await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles(pendingFile)]);const pending=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.deepEqual(pending.p23_living_gear,ready.p23_living_gear);const equipment=s=>Object.fromEntries(Object.entries(s.character.equipment).filter(([,item])=>item).map(([slot,item])=>[slot,{key:item.inventory_key,quality:item.quality,components:item.components,stats:item.stats}]));assert.deepEqual(equipment(pending),equipment(ready));await p.locator('#loading_screen_play_button:not(.none_display)').click();gates.push('allocated pending gear Export/literal-file Import retains physical identities before any kill');

 await p.evaluate(()=>window.change_location({location_id:'Infested field'}));
 await p.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('save data'));return s.p23_living_gear?.copies&&Object.values(s.p23_living_gear.copies).some(x=>x.reserve>=3);},{},{timeout:90000});
 await p.evaluate(()=>window.change_location({location_id:'Village'}));let settled=await save();assert.ok(settled.p23_living_gear.copies[secondRing].reserve>=3);assert.ok(Object.values(settled.p23_living_gear.copies).some(x=>x.kills>=3));gates.push('actual native beast kills settle per equipped copy with native XP/loot');
 fs.writeFileSync(path.join(dir,'tranche2-settled.json'),JSON.stringify(settled));
 await p.locator('#p23_living_gear_panel summary').click();const beforeSpend=await save();await p.locator('[data-living-gear-action="spend"]').click();let spent=await save();assert.equal(spent.p23_living_gear.copies[secondRing].reserve,beforeSpend.p23_living_gear.copies[secondRing].reserve-3);assert.ok(spent.character.stamina_to_full<beforeSpend.character.stamina_to_full);gates.push('native cinder spending debits three and recovers missing stamina');
 const allocator=spent.equipment_durability.nextId;await p.evaluate(()=>window.unequip_item('ring'));const unequipped=await save();assert.equal(unequipped.inventories.person.main_character[secondRing].count,1);assert.deepEqual(unequipped.p23_living_gear,spent.p23_living_gear);
 await p.evaluate(key=>{const row=[...document.querySelectorAll('#inventory_content_div [data-character_item]')].find(e=>e.dataset.character_item===key);if(!row)throw Error('Allocated ring row missing');row.querySelector('.equip_item_button').click();},secondRing);const reequipped=await save();assert.equal(reequipped.character.equipment.ring.inventory_key,secondRing);assert.equal(reequipped.equipment_durability.nextId,allocator);assert.deepEqual(reequipped.p23_living_gear,spent.p23_living_gear);gates.push('native unequip/re-equip keeps per-copy reserves and does not reallocate identity');

 await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').click();const reloaded=await save();assert.deepEqual(reloaded.p23_living_gear,spent.p23_living_gear);gates.push('settled copy growth and spend survive native reload');
 const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=await download;await file.saveAs(path.join(dir,'tranche2-export.txt'));
 await p.locator('#saved_file_input').setInputFiles(path.join(dir,'tranche2-export.txt'));await p.waitForTimeout(1000);if(await p.locator('#loading_screen_play_button:not(.none_display)').isVisible())await p.locator('#loading_screen_play_button:not(.none_display)').click();let imported=await save();assert.deepEqual(imported.p23_living_gear,spent.p23_living_gear);gates.push('actual Export and literal-file Import retain native living gear');
 await p.screenshot({path:path.join(dir,'tranche2-gear-desktop.png')});
 const response=await p.request.get(base+'dist/bundle.js'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');assert.equal(hash(await response.body()),hash(fs.readFileSync('dist/bundle.js')));assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'tranche2-gear-native.json'),JSON.stringify({status:'PASS',bundleSha256:hash(fs.readFileSync('dist/bundle.js')),gates,pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
