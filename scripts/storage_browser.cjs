// Only generated fixtures and fresh browser contexts; no personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT || 'playwright');
const {openNotebook}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18625/',out=process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-storage-proof';
const seedPath=process.env.YAIRPG_PROFILE_SEED || '/Users/weiwei/.codex/visualizations/2026/10/04/01a1051c-ed9f-7a92-81fb-53403489e007/promise-delivery-proof/generated-help-save.json';
const wood=JSON.stringify({id:'Rough wood log'}),pants=JSON.stringify({id:'Cheap leather pants',quality:123});
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.YAIRPG_CHROME ? {executablePath:process.env.YAIRPG_CHROME} : {})});
 const errors=[],warnings=[],findings=[];let page,context,fingerprint;
 const seed=JSON.parse(fs.readFileSync(seedPath,'utf8'));
 const base=structuredClone(seed);base['current location']='Shack';base.availabilities.location.Shack=1;
 base.inventories.person.main_character[wood]={count:7};base.inventories.person.main_character[pants]={count:2};
 base.inventories.storage={player:{[wood]:{count:3}}};
 const open=async fixture=>{
  context=await browser.newContext({viewport:{width:1500,height:1050}});
  await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
  page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack));
  page.on('console',m=>{if(['warning','error'].includes(m.type()))warnings.push(m.text());});
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();
  await page.locator('#open_storage_div').click();
 };
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return saved();};
 const click=async(target,key,amount=1)=>{
  // Exact encoded keys are selected without CSS escaping user content.
  await page.evaluate(({target,key,amount})=>{
   const n=[...document.querySelectorAll('[data-'+target+'_item]')].find(n=>n.getAttribute('data-'+target+'_item')===key && !n.classList.contains('equipped_item_control'));
   if(!n)throw Error('Missing chest item '+key);
   const button=amount===1?n.querySelector('.item_name'): [...n.querySelectorAll('.trade_ammount_button')].find(b=>Number(b.getAttribute('data-trade_ammount'))===amount);
   if(!button)throw Error('Missing amount control');button.click();
  },{target,key,amount});
 };
 const reload=async()=>{await page.reload();await page.getByText('PLAY',{exact:true}).click();await page.locator('#open_storage_div').click();};
 const imported=async()=>{
  const encoded=await page.evaluate(()=>window.save_to_file());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-chest.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
  await page.getByText('PLAY',{exact:true}).click();await page.locator('#open_storage_div').click();return save();
 };
 try{
  await open(base);fingerprint=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name);
  assert.ok(fingerprint.endsWith(fs.readFileSync('index.html','utf8').match(/dist\/bundle\.js\?version=[^&"]+/)[0]));
  const before=await save();
  await click('character',wood,5);let p=await saved();assert.equal(p.inventories.person.main_character[wood].count,2);assert.equal(p.inventories.storage.player[wood].count,8);
  assert.deepEqual(p.item_log,before.item_log);assert.deepEqual(p.levels,before.levels);
  const partial=await imported();assert.equal(partial.inventories.storage.player[wood].count,8);
  await reload();await click('storage',wood,Infinity);p=await saved();assert.equal(p.inventories.person.main_character[wood].count,10);assert.equal(p.inventories.storage.player[wood],undefined);
  await click('character',pants,10);p=await saved();assert.equal(p.inventories.storage.player[pants].count,2);assert.equal(p.inventories.person.main_character[pants],undefined);
  await click('storage',pants);p=await saved();assert.equal(p.inventories.person.main_character[pants].count,1);assert.equal(p.inventories.storage.player[pants].count,1);
  const round=await imported();assert.deepEqual(round.inventories.storage,p.inventories.storage);assert.deepEqual(round.inventories.person.main_character,p.inventories.person.main_character);
  await page.screenshot({path:path.join(out,'chest-partial.png'),fullPage:true});
  const packet=await page.evaluate(key=>{const n=[...document.querySelectorAll('[data-character_item]')].find(n=>n.getAttribute('data-character_item')===key);return {item_key:key,count:1,expectedCount:Number(n.getAttribute('data-item_count')),sequence:Number(n.getAttribute('data-storage-sequence'))};},wood);
  assert.equal(await page.evaluate(p=>window.move_item_to_storage(p),packet),true);
  const once=await saved();assert.equal(await page.evaluate(p=>window.move_item_to_storage(p),packet),false);assert.deepEqual((await saved()).inventories,once.inventories);
  findings.push('Rebuilt real chest controls split/merge ordinary and quality-specific stock; 5/10/all clamp correctly. Partial and completed file import/reload retain both owners. Movement adds no XP or acquisition; a repeated exact packet rejects.');
  fs.writeFileSync(path.join(out,'generated-chest-save.json'),JSON.stringify(once));await context.close();
  await open(base);await page.evaluate(key=>window.equip_item(key),pants);await page.evaluate(()=>window.open_storage());
  const equipped=await save();await click('character',pants);const spare=await saved();
  assert.equal(spare.inventories.storage.player[pants].count,1);assert.equal(spare.inventories.person.main_character[pants],undefined);assert.deepEqual(spare.character.equipment,equipped.character.equipment);
  const equippedOnly={item_key:pants,count:1,expectedCount:0,sequence:spare.expansion.sequence};
  assert.equal(await page.evaluate(p=>window.move_item_to_storage(p),equippedOnly),false);assert.deepEqual((await saved()).inventories,spare.inventories);assert.match(await page.locator('body').innerText(),/Unequip/);
  await page.evaluate(()=>window.unequip_item('legs'));await page.evaluate(()=>window.open_storage());await click('character',pants);
  assert.equal((await saved()).inventories.storage.player[pants].count,2);await context.close();
  findings.push('Real native equipment remains outside the bag: owned spare copies deposit normally, an equipped-only packet rejects, and unequipping permits transfer of that actual item.');
  const {commitSimulationCommand}=await import('../src/simulation.js'),{expeditionRegistry}=await import('../src/expedition_content.js');
  const ready=structuredClone(base);ready.character.money=30;
  ready.expansion.simulation.knowledge.player.workbench={stage:'seen',value:'Generated observed packing notes',at:ready.expansion.clock,cause:'fixture:workbench'};
  const learned=commitSimulationCommand(ready.expansion,expeditionRegistry,{id:'village.study_method'},{actorId:'player',external:{money:30},gameplay:{player:{inventory:Object.fromEntries(Object.entries(ready.inventories.person.main_character).map(([k,v])=>[k,v.count])),skills:{},reputation:{}}},facts:{location:'Village','village.craftsmanMet':true}});
  ready.expansion=learned.state;ready.expansion.worlds['base.frontier'].facts['workbench.wet']=false;ready.character.money=learned.external.money;ready.availabilities.textline['oldCraftsman:hello']=5;
  await open(ready);await openNotebook(page);await page.locator('[data-notebook-view="people"]').click();await page.locator('#simulation_panel').evaluate(n=>n.open=true);
  await page.locator('[data-simulation="village.measured_pack"]').click();await page.evaluate(()=>window.open_storage());
  const reserved=await saved();assert.ok(reserved.expansion.simulation.jobs.some(j=>j.actorId==='player'));
  await click('character',wood);assert.deepEqual((await saved()).inventories,reserved.inventories);assert.match(await page.locator('body').innerText(),/Finish your current/);await context.close();
  findings.push('Actual paid Shack packing through Notebook reserves the participant and debits its log before chest transfer; the remaining carried stock cannot move until work ends.');
  // Legacy expansion-less component envelope.
  const legacy=structuredClone(base);delete legacy.expansion;
  await open(legacy);await click('character',wood);const l=await imported();assert.equal(l.inventories.storage.player[wood].count,4);await context.close();
  findings.push('Expansion-less supported component save imports and transfers without enrollment.');
  const old=structuredClone(base);old['game version']='v0.5.5.9';old.character.inventory={[wood]:{count:7}};
  old.player_storage={inventory:{[wood]:{count:3}}};old.skills={};old.activities={};old.dialogues={};old.traders={};old.books={};old.quests={};
  old.locations={Shack:{is_unlocked:true,housing_unlocked:true}};
  for(const key of ['expansion','inventories','levels','availabilities','npcs','npc_equipment','fork_schema'])delete old[key];
  await open(old);const migrated=await save();assert.equal(migrated.inventories.storage.player[wood].count,3);
  await click('character',wood,5);const om=await imported();assert.equal(om.inventories.storage.player[wood].count,8);assert.equal(om.inventories.person.main_character[wood].count,2);
  await reload();assert.equal((await save()).inventories.storage.player[wood].count,8);await context.close();
  findings.push('Generated pre-v0.6 legacy player_storage migrates into the real storage component once, transfers, exports/imports and reloads without item loss or duplication.');

  const loan=structuredClone(base);loan.expansion.simulation.custody['fixture.loan']={owner:'promiseVisitor',holder:'player',key:wood,count:1,at:loan.expansion.clock,cause:'fixture:loan'};
  await open(loan);const lb=await save();await click('character',wood);assert.deepEqual((await saved()).inventories,lb.inventories);assert.match(await page.locator('body').innerText(),/borrowed/i);await context.close();
  findings.push('Generated loan fixture rejects deposit and retains the exact custody and both native inventories. Lawful return ordering is exercised by the real simulation API in native_storage_transaction.test.js.');
  for(const direction of ['deposit','withdraw']){
   await open(base);const failureBefore=await save();
   await page.evaluate(()=>{window.storageBeforeFailure=localStorage.getItem('save data');const write=Storage.prototype.setItem;window.storageOriginalWrite=write;Storage.prototype.setItem=function(k,v){if(k==='save data')throw Error('Injected chest quota');return write.call(this,k,v);};});
   await click(direction==='deposit'?'character':'storage',wood);
   assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),await page.evaluate(()=>window.storageBeforeFailure));
   const live=await page.evaluate(()=>{
    window.update_displayed_character_inventory();window.update_displayed_storage_inventory();
    const read=target=>Object.fromEntries([...document.querySelectorAll('[data-'+target+'_item]')].filter(n=>!n.classList.contains('equipped_item_control')).map(n=>[n.getAttribute('data-'+target+'_item'),{count:Number(n.querySelector('.item_count').innerText.replace('x','').trim()) || 1}]));
    return {bag:read('character'),chest:read('storage')};
   });
   assert.deepEqual(live.bag,failureBefore.inventories.person.main_character);assert.deepEqual(live.chest,failureBefore.inventories.storage.player);assert.match(await page.locator('body').innerText(),/saving failed/i);
   await reload();assert.deepEqual((await save()).inventories,failureBefore.inventories);await context.close();
   findings.push('Injected '+direction+' quota preserves exact committed bytes, both live owners, rendered quantities and reload.');
  }
  assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({url,fingerprint,findings,errors,warnings},null,2));console.log(JSON.stringify({out,findings,errors,warnings},null,2));
 }catch(e){fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({message:e.stack,errors,warnings,text:await page?.locator('body').innerText().catch(()=>null)},null,2));await page?.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
