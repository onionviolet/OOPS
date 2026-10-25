// Live crafting failure journey: a thin steep records in the failure ledger, changes the forecast and charges the verge grudge.
// Fresh origin, headless. Run after npm run build with a static server on YAIRPG_PORT.
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
  const open=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});};
  const keys=()=>page.locator('[data-craft-material]').evaluateAll(ns=>ns.map(n=>n.dataset.craftMaterial));
  const pick=async ids=>{for(const k of await keys()){const el=page.locator(`[data-craft-material='${k.replace(/'/g,"\\'")}']`);const want=ids.includes(JSON.parse(k).materialRef);if(want!==await el.isChecked())await (want?el.check():el.uncheck());}};
  const notice=()=>page.locator('#crafting_engine_home [role=status]').innerText();
  await page.goto(url);await boot();await open();say(`[${w}] fresh`);
  let failedIds=null,tries=0;
  for(let i=0;i<12&&!failedIds;i++){
   await page.locator('#crafting_gather').click();
   const all=(await keys()).map(k=>JSON.parse(k).materialRef);await pick(all);
   await page.locator('#crafting_engine_home [data-craft-commit]').click();
   const text=await notice();
   if(/too thin/.test(text)){failedIds=all;say(`[${w}] live failure after ${i+1} gather(s): ${text}`);}
   else {const s=await snapshot();assert.equal(Object.hasOwn(s,'craftLedger'),false,'success must not record');assert.match(text,/became a preparation/);}
  }
  assert.ok(failedIds,'no thin steep within 12 attempts');
  let s=await snapshot();const pairs=Object.values(s.craftLedger.pairs);assert.equal(pairs.length,1);assert.deepEqual(pairs[0].tries[0].reasons,['thin']);
  say(`[${w}] ledger entry: ${JSON.stringify(pairs[0])}`);
  const row=()=>s.economy_standing.ledger.rows.find(r=>r.id==='craft:verge-grudge');
  assert.equal(row().amount,1);assert.equal(row().kind,'grievance');assert.equal(row().creditor,'village_verge');say(`[${w}] obligations row: ${JSON.stringify(row())}`);
  await page.screenshot({path:`${evidence}/failure-after-${w}.png`});
  const grudgeText=await page.locator('[data-craft-grudge]').innerText();assert.match(grudgeText,/grumble.*\(1\)/);say(`[${w}] grudge line: ${grudgeText}`);
  // Same materials again: the forecast reads known-fail before anything is spent.
  const ids=pairs[0].materials;
  for(let i=0;i<10;i++){const have=(await keys()).map(k=>JSON.parse(k).materialRef);if(ids.every(id=>have.includes(id)))break;await page.locator('#crafting_gather').click();}
  await pick(ids);const fc=page.locator('[data-craft-forecast]');assert.equal(await fc.getAttribute('data-verdict'),'known-fail');
  const ft=await fc.innerText();assert.match(ft,/Tried before.*once.*too thin/);say(`[${w}] forecast: ${ft}`);
  await page.screenshot({path:`${evidence}/failure-forecast-${w}.png`});
  await page.locator('#crafting_engine_home [data-craft-commit]').click();s=await snapshot();
  assert.equal(Object.values(s.craftLedger.pairs)[0].count,2);assert.equal(row().amount,2);say(`[${w}] repeat: ledger count 2, grudge 2`);
  await page.locator('#save_button').click();s=await snapshot();const saved={ledger:s.craftLedger,rows:s.economy_standing.ledger.rows};
  await page.reload();await boot();s=await snapshot();assert.deepEqual({ledger:s.craftLedger,rows:s.economy_standing.ledger.rows},saved);
  await open();assert.match(await page.locator('[data-craft-grudge]').innerText(),/\(2\)/);say(`[${w}] save+reload keep ledger and grudge`);
  const [d]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const enc=fs.readFileSync(await d.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'itch-failure.txt',mimeType:'text/plain',buffer:enc})]);await boot();
  s=await snapshot();assert.deepEqual({ledger:s.craftLedger,rows:s.economy_standing.ledger.rows},saved);say(`[${w}] Export + Import keep ledger and grudge`);
  await context.close();
 }
 assert.deepEqual(errors,[]);say('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
