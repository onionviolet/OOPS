// Continue an actual UI-earned consumer checkpoint. Never creates wool or cloth.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const R=require(path.resolve('docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const URL='http://127.0.0.1:8202/',OUT=path.resolve('docs/research/hogwarts-legacy/lp4-evidence');
const stock=(s,id)=>s.inventories.person.main_character[JSON.stringify({id})]?.count||0;
(async()=>{
 const input=process.argv[2];assert.ok(input,'Pass the earned.json from a successful consumer.cjs run.');
 const bytes=fs.readFileSync(input),earned=JSON.parse(bytes);assert.ok(stock(earned,'Wool cloth')>0);assert.ok(earned.meadow_pen.collected>0);
 const {encodeSaveFile}=await import(path.resolve('src/save_files.js'));const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hl-lp4-continue-'));
 const file=path.join(dir,'earned.txt');fs.writeFileSync(file,encodeSaveFile(bytes.toString()));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const ctx=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(15000);
 const ready=()=>p.waitForFunction(()=>document.querySelector('#workspace_current_work')?.textContent.includes('Saving available.'));
 async function save(){await ready();await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
 async function importFile(f){await Promise.all([p.waitForEvent('domcontentloaded'),p.locator('#saved_file_input').setInputFiles(f)]);await R.startFresh(p);await ready();}
 try{
  await p.goto(URL,{waitUntil:'domcontentloaded'});await R.startFresh(p);await ready();await importFile(file);
  const imported=await save();assert.deepEqual(imported.inventories,earned.inventories);assert.deepEqual(imported.meadow_pen,earned.meadow_pen);assert.equal(imported.character.money,earned.character.money);
  await p.locator('.choice_craft').first().click();await p.locator('#crafting_mainpage_buttons [data-crafting_category="crafting"]').click();await p.locator('[data-crafting_category="crafting"][data-crafting_subcategory="items"] [data-recipe_id="Wool cloth"] .recipe_item_name').click();
  await p.screenshot({path:path.join(OUT,'09-earned-consumer-context.png')});await p.evaluate(()=>window.closeCraftingWindow());
  const pen=p.locator('#meadow_pen_panel');await pen.locator('summary').first().click();await pen.scrollIntoViewIfNeeded();await p.locator('[data-habitat="buy_feed"]').click();
  const paid=await save();assert.equal(paid.character.money,earned.character.money-2);assert.equal(stock(paid,'Meadow hay'),stock(earned,'Meadow hay')+1);assert.equal(stock(paid,'Wool'),stock(earned,'Wool'));assert.equal(stock(paid,'Wool cloth'),stock(earned,'Wool cloth'));assert.equal(paid.meadow_pen.collected,earned.meadow_pen.collected);
  const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const exported=path.join(dir,'continued-export.txt');await(await download).saveAs(exported);await importFile(exported);
  const final=await save();assert.deepEqual(final.meadow_pen,paid.meadow_pen);for(const id of ['Meadow hay','Wool','Wool cloth'])assert.equal(stock(final,id),stock(paid,id));
  await p.locator('#meadow_pen_panel > summary').click();await p.locator('#meadow_pen_panel').scrollIntoViewIfNeeded();assert.equal(await p.locator('[data-habitat="buy_feed"]').isEnabled(),true);await p.screenshot({path:path.join(OUT,'08-consumer-imported.png')});assert.deepEqual(errors,[]);
  const result={status:'passed',url:URL,viewport:{width:1366,height:768},bundleSha256:createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),earnedSnapshotSha256:createHash('sha256').update(bytes).digest('hex'),checks:['exact earlier UI-earned wool/cloth/pen checkpoint imported into a fresh writable origin','post-import native two-coin hay purchase succeeds without replaying wool or cloth','new paid stock and old earned output survive another Export/literal file Import; controls remain writable'],finalStock:{hay:stock(final,'Meadow hay'),wool:stock(final,'Wool'),cloth:stock(final,'Wool cloth'),collectedBatches:final.meadow_pen.collected},errors};
  fs.writeFileSync(path.join(OUT,'continued-import-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
