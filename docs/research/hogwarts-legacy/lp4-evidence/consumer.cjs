// Disposable fresh-origin policy and native consumer checks. No user saves.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const R=require(path.resolve('docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const URL='http://127.0.0.1:8202/',OUT=path.resolve('docs/research/hogwarts-legacy/lp4-evidence');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hl-lp4-native-'));
const stock=(s,id)=>s.inventories.person.main_character[JSON.stringify({id})]?.count||0;
const hash=b=>createHash('sha256').update(b).digest('hex');
const get=url=>new Promise((resolve,reject)=>http.get(url,r=>{const a=[];r.on('data',b=>a.push(b));r.on('end',()=>resolve(Buffer.concat(a)));r.on('error',reject);}).on('error',reject));
(async()=>{
 const expected=hash(fs.readFileSync('dist/bundle.js'));assert.equal(hash(await get(URL+'dist/bundle.js')),expected);
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const errors=[],checks=[],attempts=[];let ctx,p;
 async function launch(storageState){ctx=await browser.newContext({viewport:{width:1366,height:768},storageState,acceptDownloads:true});p=await ctx.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));await p.goto(URL,{waitUntil:'domcontentloaded'});await R.startFresh(p);}
 async function save(){await p.waitForFunction(()=>document.querySelector('#workspace_current_work')?.textContent.includes('Saving available.'));await p.locator('#save_button').click();const s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));fs.writeFileSync(path.join(temp,'earned.json'),JSON.stringify(s));return s;}
 const pen=()=>p.locator('#meadow_pen_panel'),b=id=>p.locator('[data-habitat="'+id+'"]'),fact=id=>p.locator('[data-habitat-fact="'+id+'"]');
 async function open(){if(!await pen().evaluate(e=>e.open))await pen().locator('summary').first().click();await pen().scrollIntoViewIfNeeded();}
 async function care(){await open();await b('buy_feed').click();await b('feed').click();await b('attend').click();}
 async function collect(){await open();await p.waitForFunction(()=>/Harvest: ready/.test(document.querySelector('[data-habitat-fact="harvest"]')?.textContent));await b('collect').click();return save();}
 async function shot(name){await p.screenshot({path:path.join(OUT,name+'.png')});}
 async function importFile(file){await Promise.all([p.waitForEvent('domcontentloaded'),p.locator('#saved_file_input').setInputFiles(file)]);await R.startFresh(p);}
 try{
  await launch();await open();await b('build').click();await b('adopt').click();await care();
  const pending=await save(),st=await ctx.storageState();await ctx.close();await new Promise(r=>setTimeout(r,8000));
  await launch(st);await open();const resumed=await save();
  assert.deepEqual(resumed.meadow_pen,pending.meadow_pen);assert.equal(stock(resumed,'Wool'),0);assert.match(await fact('harvest').innerText(),/[0-2]\/6/);
  checks.push('eight real seconds closed: exact persisted care owner, no catch-up wool; only resumed native ticks advance progress');await shot('05-offline-resumed');
  await collect();await care();await save();
  // Ordinary known route and actual native travel/work, without a crafting unlock.
  await R.unlockCombatRoute(p);await R.enterCombat(p);await R.leaveCombat(p);await open();
  assert.match(await fact('harvest').innerText(),/ready, 5 Wool/);assert.match(await fact('care').innerText(),/needs hay; needs attention/);assert.match(await fact('welfare').innerText(),/Safe/);
  checks.push('actual Village departure, travel and field work advance supported production; expired care preserves ready wool and safe welfare');await shot('06-away-ready');await collect();
  // Controlled prior crafting eligibility only. Every material and pen fact is earned.
  const natural=await save(),fixture=structuredClone(natural);fixture.global_flags.is_crafting_unlocked=true;
  const {encodeSaveFile}=await import(path.resolve('src/save_files.js'));
  const fixtureFile=path.join(temp,'crafting-precondition.txt');fs.writeFileSync(fixtureFile,encodeSaveFile(JSON.stringify(fixture)));await importFile(fixtureFile);
  const loaded=await save();assert.deepEqual(loaded.meadow_pen,natural.meadow_pen);assert.deepEqual(loaded.inventories,natural.inventories);assert.equal(loaded.character.money,natural.character.money);
  checks.push('controlled prior-context fixture changes only global_flags.is_crafting_unlocked; literal native import retains earned pen, stock and money');
  let result;
  for(let cycle=0;cycle<24;cycle++){
   let before=await save();if(stock(before,'Wool')<5){await care();await collect();before=await save();}
   await p.locator('.choice_craft').first().click();await p.locator('#crafting_mainpage_buttons [data-crafting_category="crafting"]').click();
   await p.locator('[data-crafting_category="crafting"][data-crafting_subcategory="items"] [data-recipe_id="Wool cloth"] .recipe_item_name').click();
   await p.locator('[data-craft-commit]').click();const after=await save();
   assert.equal(stock(after,'Wool'),stock(before,'Wool')-5);const attempt={inputWool:5,cloth:stock(after,'Wool cloth')-stock(before,'Wool cloth')};attempts.push(attempt);console.log('CRAFT',JSON.stringify(attempt));
   await shot('07-native-wool-consumer');await p.evaluate(()=>window.closeCraftingWindow());
   if(stock(after,'Wool cloth')>0){result=after;break;}
  }
  assert.ok(result,'No native cloth success within the authored 24-attempt test budget.');
  checks.push('habitat Wool consumed by actual native recipe and produced useful Wool cloth');
  await p.reload({waitUntil:'domcontentloaded'});await R.startFresh(p);const reloaded=await save();assert.equal(stock(reloaded,'Wool'),stock(result,'Wool'));assert.equal(stock(reloaded,'Wool cloth'),stock(result,'Wool cloth'));assert.deepEqual(reloaded.meadow_pen,result.meadow_pen);
  const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(temp,'consumed-export.txt');await(await download).saveAs(file);await importFile(file);
  const imported=await save();assert.equal(stock(imported,'Wool'),stock(result,'Wool'));assert.equal(stock(imported,'Wool cloth'),stock(result,'Wool cloth'));assert.deepEqual(imported.meadow_pen,result.meadow_pen);
  checks.push('consumed product Save/reload/Export/literal file Import preserves remaining wool, cloth and collection count without duplication');
  await open();await b('buy_feed').click();const continued=await save();assert.equal(continued.character.money,imported.character.money-2);assert.equal(stock(continued,'Meadow hay'),stock(imported,'Meadow hay')+1);assert.equal(stock(continued,'Wool cloth'),stock(imported,'Wool cloth'));assert.equal(continued.meadow_pen.collected,imported.meadow_pen.collected);
  checks.push('post-import controls remain writable: another actual two-coin hay purchase succeeds without replaying wool or cloth');await shot('08-consumer-imported');
  const layout=await p.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth>innerWidth,viewport:{width:innerWidth,height:innerHeight}}));assert.equal(layout.horizontalOverflow,false);assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(OUT,'consumer-results.json'),JSON.stringify({status:'passed',priorCraftingContext:'controlled: only global_flags.is_crafting_unlocked enabled',viewport:{width:1366,height:768},url:URL,bundleSha256:expected,checks,attempts,finalStock:{wool:stock(imported,'Wool'),cloth:stock(imported,'Wool cloth'),collectedBatches:imported.meadow_pen.collected},layout,errors},null,2));console.log(JSON.stringify({checks,attempts,errors},null,2));
 }catch(e){await p.screenshot({path:path.join(temp,'failure.png')}).catch(()=>{});console.error('Saved diagnostic:',temp,'errors:',errors);throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
