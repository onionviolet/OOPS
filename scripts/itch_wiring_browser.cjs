// IM22/IM23/IM24/IM25 wiring journey. Fresh origin, headless. Run after npm run build with a static server on YAIRPG_PORT.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=`http://127.0.0.1:${process.env.YAIRPG_PORT||19471}/?test_hooks=1`,evidence='docs/gm/dispatch/itch-wiring-2026-10-23/evidence';
fs.mkdirSync(evidence,{recursive:true});
const say=m=>console.log(m);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{for(const [w,h] of [[1536,864],[1920,1080]]){
  const context=await browser.newContext({viewport:{width:w,height:h},acceptDownloads:true});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);say('PAGEERROR '+e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const ready=()=>page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});
  const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();};
  const open=async id=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);};
  await page.goto(url);await boot();say(`[${w}] fresh`);
  // Crafting: gather, select, craft, composition name
  await open('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});
  await page.locator('#crafting_gather').click();await page.locator('[data-craft-material]').first().check();
  assert.equal(await page.locator('[data-craft-forecast]').isHidden(),true);say(`[${w}] forecast hidden while untried`);
  // Seed a ledger failure for the gathered material (no Village batch fails live) and reload.
  const gathered=await snapshot();assert.equal(Object.hasOwn(gathered,'craftLedger'),false);
  const matKey=Object.keys(gathered.inventories.person.main_character).find(k=>JSON.parse(k).id==='Gathered herb');
  const matId=JSON.parse(matKey).materialRef;
  const seeded=structuredClone(gathered);seeded.craftLedger={family:'craft.failures@1',pairs:{[matId]:{materials:[matId],count:2,tries:[{process:'steep#1',count:2,reasons:['inert'],residue:{}}]}}};
  await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),seeded);await page.reload();await boot();
  await open('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});
  await page.locator('[data-craft-material]').first().check();
  const fc=page.locator('[data-craft-forecast]');assert.equal(await fc.isVisible(),true);const ft=await fc.innerText();assert.match(ft,/Tried before.*2 times/);say(`[${w}] forecast after load: ${ft}`);
  await page.locator('#crafting_steep_level').selectOption('2');assert.match(await fc.getAttribute('data-verdict'),/near/);say(`[${w}] other steep level reads near`);
  await page.locator('#crafting_steep_level').selectOption('1');
  await page.screenshot({path:`${evidence}/craft-forecast-${w}.png`});
  // Craft: composition name in the panel and in the native inventory
  // A thin steep spends the lot and makes nothing (live failure path); gather and retry until a vial exists.
  for(let i=0;i<8;i++){await page.locator('#crafting_engine_home [data-craft-commit]').click();if(await page.locator('[data-craft-composition]').count())break;await page.locator('#crafting_gather').click();await page.locator('[data-craft-material]').first().check();}
  const comp=await page.locator('[data-craft-composition]').first().innerText();assert.match(comp,/^Unidentified .* \[1\*.*@\d+ \| steep#1\] · 1 carried$/);say(`[${w}] composition name: ${comp}`);
  const crafted=await snapshot();assert.ok(crafted.craftLedger.pairs[matId]);
  const key=Object.keys(crafted.inventories.person.main_character).find(k=>JSON.parse(k).productFamily==='craft.batch@1');
  await page.screenshot({path:`${evidence}/craft-name-${w}.png`});
  const invName=await page.evaluate(k=>[...document.querySelectorAll('[data-character_item]')].find(n=>n.getAttribute('data-character_item')===k)?.innerText,key);
  say(`[${w}] inventory row: ${JSON.stringify(invName)}`);assert.match(invName||'',/steep#1/);
  // Save, reload, export/import keep the ledger
  await page.locator('#save_button').click();const saved=await snapshot();assert.ok(saved.craftLedger.pairs[matId]);
  await page.reload();await boot();assert.deepEqual((await snapshot()).craftLedger,saved.craftLedger);say(`[${w}] ledger survives save+reload`);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'itch-wiring.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
  assert.deepEqual((await snapshot()).craftLedger,saved.craftLedger);say(`[${w}] ledger survives Export + Import`);
  // Story and history panel
  await open('story-insight');await page.locator('#story_insight_panel').waitFor({state:'visible'});
  assert.equal(await page.locator('[data-war-id]').count(),0);
  await page.locator('[data-story-insight="recall"]').click();
  const wars=await page.locator('[data-war-id]').allInnerTexts();const none=await page.locator('#story_insight_panel').innerText();
  say(`[${w}] wars: ${wars.length} ${JSON.stringify(wars[0]||none.slice(-120))}`);
  if(wars.length)for(const l of wars)assert.match(l,/Cause: .*stronger \(\d+ against \d+\)/);
  await page.screenshot({path:`${evidence}/history-${w}.png`});
  const s1=await snapshot();const hist=s1.expansion.loreHistory.worldHistories;assert.deepEqual(Object.keys(hist),['base.frontier']);
  await page.locator('#save_button').click();await page.reload();await boot();await open('story-insight');
  assert.equal((await page.locator('[data-war-id]').allInnerTexts()).join('|'),wars.join('|'));assert.deepEqual((await snapshot()).expansion.loreHistory.worldHistories,hist);say(`[${w}] history stable after save+reload`);
  const [d2]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const enc2=fs.readFileSync(await d2.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'itch-wiring2.txt',mimeType:'text/plain',buffer:enc2})]);await boot();
  assert.deepEqual((await snapshot()).expansion.loreHistory.worldHistories,hist);say(`[${w}] history survives Export + Import`);
  await context.close();
 }
 assert.deepEqual(errors,[]);say('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
