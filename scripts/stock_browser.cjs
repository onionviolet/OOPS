// O4: carried stock <-> companion pack on a fresh origin; generated fixtures only.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {launchChrome,waitForPage}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18731/',out=process.env.YAIRPG_PROOF_DIR||'/tmp/yairpg-stock-proof';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=await import('./field_fixtures.mjs');
 const browser=await launchChrome(),errors=[];let page,context;
 const open=async(fixture,size)=>{
  context=await browser.newContext({viewport:size||{width:1920,height:1080}});
  if(fixture)await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
  page=await context.newPage();page.setDefaultTimeout(18000);page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
 };
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return saved();};
 const reload=async()=>{await page.reload();await page.getByText('PLAY',{exact:true}).click();};
 const imported=async()=>{const encoded=await page.evaluate(()=>window.save_to_file());await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-stock.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await page.getByText('PLAY',{exact:true}).click();return save();};
 const panel=async()=>{if(await page.locator('#stock_view_panel').isVisible())return;const sel=page.locator('select:has(option[value="stock_view"])');await sel.waitFor({state:'attached',timeout:30000});await page.waitForFunction(()=>!document.querySelector('option[value="stock_view"]').disabled);await sel.selectOption('stock_view');await page.locator('#stock_view_panel').waitFor({state:'visible'});};
 const holder=(id)=>page.locator(`#stock_view_panel [data-stock-holder="${id}"]`);
 try{
  await open();const base=await save();await context.close();
  let p=f.fieldCommand(f.joinField(),'party.meet');
  const fixture=structuredClone(base);fixture.expansion=p.state;fixture.character.money=p.external.money;fixture.inventories.person.main_character[f.wood]={count:5};
  await open(fixture);await panel();
  assert.equal(await holder('player').count(),1);assert.equal(await holder('partyPartner').count(),1);
  const wood=f.wood;
  await page.screenshot({path:path.join(out,'before-1920.png')});
  await holder('player').locator(`[data-stock-key='${wood}'] [data-stock-action=entrust]`).click();
  let s=await save();
  assert.equal(s.inventories.person.main_character[wood].count,4);assert.equal(s.expansion.simulation.owners.partyPartner[wood],1);
  const loans=Object.values(s.expansion.simulation.custody);assert.equal(loans.length,1);assert.deepEqual([loans[0].owner,loans[0].holder,loans[0].count],['player','partyPartner',1]);
  await panel();assert.match(await holder('partyPartner').textContent(),/yours, lent/);
  await page.screenshot({path:path.join(out,'after-entrust-1920.png')});
  await reload();s=await saved();assert.equal(s.expansion.simulation.owners.partyPartner[wood],1);await panel();assert.match(await holder('partyPartner').textContent(),/yours, lent/);
  const imp=await imported();assert.equal(imp.expansion.simulation.owners.partyPartner[wood],1);assert.equal(Object.keys(imp.expansion.simulation.custody).length,1);assert.equal(imp.inventories.person.main_character[wood].count,4);
  await panel();
  await holder('partyPartner').locator('[data-stock-action=retrieve]').click();
  s=await save();assert.equal(s.inventories.person.main_character[wood].count,5);assert.equal(s.expansion.simulation.owners.partyPartner[wood],undefined);assert.equal(Object.keys(s.expansion.simulation.custody).length,0);
  await panel();await page.screenshot({path:path.join(out,'after-retrieve-1920.png')});
  await page.setViewportSize({width:1366,height:768});await panel();await page.screenshot({path:path.join(out,'laptop-1366.png')});
  const overflow=await page.evaluate(()=>{const n=document.getElementById('stock_view_panel');return n.scrollWidth>n.clientWidth+1;});assert.equal(overflow,false);
  assert.deepEqual(errors,[]);
  console.log('stock browser: pass');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
