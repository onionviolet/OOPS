const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {launchChrome}=require('../../scripts/ui_helpers.cjs');
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('content-type','text/html');res.end(fs.readFileSync(path.join(__dirname,'preview.html')));}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const browser=await launchChrome(),context=await browser.newContext({viewport:{width:736,height:1100}});const errors=[],checks=[];
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}`;
 try{
  await page.goto(url,{waitUntil:'networkidle'});const f=page.frameLocator('iframe');const root=f.locator('#yair-foundations-worlds-atlas');await f.locator('tbody tr').first().waitFor();
  const data=await root.locator('.atlas-data').textContent().then(JSON.parse);
  const expected={foundations:15,worlds:10,gaps:8,actions:5,leverage:11};const names={foundations:'Foundations',worlds:'Worlds',gaps:'Gaps',actions:'Next work',leverage:'Later worlds'};
  assert.equal(data.inventory.length,48);assert.equal(data.candidates.length,24);checks.push('48 system records and 24 catalogue entries');
  for(const [view,count] of Object.entries(expected)){
   await f.getByRole('button',{name:names[view],exact:true}).click();assert.equal(await f.locator('tbody tr').count(),count);
   for(const row of data[view]){
    const button=f.getByRole('button',{name:`Select ${row.id}: ${row.name}`,exact:true});await button.click();
    assert.equal(await f.locator('.atlas-detail h3').textContent(),`${row.id} · ${row.name}`);
    assert.equal(await f.locator('.atlas-footing').textContent(),row.state);
    assert.deepEqual(await f.locator('.atlas-fields dd').allTextContents(),[row.now,row.gap,row.next]);
    assert.deepEqual(await f.locator('.atlas-owner').allTextContents(),row.source);
    assert.equal(await f.locator('tbody button[aria-pressed=true]').count(),1);
   }
   checks.push(`${view}: all ${count} records match meaning/gap/next/evidence`);
  }
  await f.getByRole('button',{name:'Foundations',exact:true}).click();await f.getByRole('button',{name:'Select U11: Actions & settlement',exact:true}).click();
  await f.getByRole('button',{name:/Open G4:/}).click();assert.equal(await f.locator('.atlas-detail h3').textContent(),'G4 · Action → consistent aftermath');assert.match(await f.locator('.atlas-fields').textContent(),/L2b health.*fixture closure receipts/);checks.push('foundation-to-gap navigation and corrected health closure');
  await f.getByRole('button',{name:'Next work',exact:true}).click();const a2=f.getByRole('button',{name:'Select A2: Exact workpiece, when needed',exact:true});await a2.focus();await page.keyboard.press('Space');assert.match(await f.locator('.atlas-detail h3').textContent(),/^A2/);assert.equal(await a2.evaluate(el=>el===document.activeElement),true);checks.push('keyboard selection and replacement focus');
  const before=await f.locator('.atlas-detail h3').textContent();await root.evaluate(el=>window.dispatchEvent(new CustomEvent('openai:set_globals',{detail:{globals:{widgetState:{modelContent:{snapshot:'obsolete',view:'worlds',choices:{}}}}}})));assert.equal(await f.locator('.atlas-detail h3').textContent(),before);checks.push('incompatible snapshot ignored');
  const state={snapshot:data.snapshot,view:'leverage',choices:{foundations:'U11',worlds:'W1',gaps:'G2',actions:'A1',leverage:'E3'}};
  await root.evaluate((el,state)=>window.dispatchEvent(new CustomEvent('openai:set_globals',{detail:{globals:{widgetState:{modelContent:state}}}})),state);assert.match(await f.locator('.atlas-detail h3').textContent(),/^E3/);checks.push('compatible selection restored');
  await f.locator('.atlas-catalogue > summary').click();assert.equal(await f.locator('.atlas-catalogue > div > details').count(),24);checks.push('full donor catalogue retained');
  for(const theme of ['light','dark'])for(const width of [736,320]){
   const capture=await context.newPage();capture.on('pageerror',e=>errors.push(e.message));await capture.setViewportSize({width,height:1100});await capture.emulateMedia({colorScheme:theme});await capture.goto(url,{waitUntil:'networkidle'});const cf=capture.frameLocator('iframe');await cf.locator('tbody tr').first().waitFor();
   for(const view of Object.keys(expected)){
    await cf.getByRole('button',{name:names[view],exact:true}).click();
    const bounds=await cf.locator('#yair-foundations-worlds-atlas').evaluate(el=>({doc:document.documentElement.scrollWidth,width:document.documentElement.clientWidth,table:el.querySelector('.table-responsive').scrollWidth,tableWidth:el.querySelector('.table-responsive').clientWidth}));assert.ok(bounds.doc<=bounds.width+1,JSON.stringify({theme,width,view,...bounds}));assert.ok(bounds.table<=bounds.tableWidth+1,JSON.stringify({theme,width,view,...bounds}));
   }
   await cf.getByRole('button',{name:'Foundations',exact:true}).click();await capture.screenshot({path:path.join(__dirname,`foundations-${theme}-${width}.png`),fullPage:true});await cf.getByRole('button',{name:'Later worlds',exact:true}).click();await capture.screenshot({path:path.join(__dirname,`leverage-${theme}-${width}.png`),fullPage:true});await capture.close();checks.push(`all five views fit ${theme} ${width}px`);
  }
  assert.deepEqual(errors,[]);checks.push('no page errors');fs.writeFileSync(path.join(__dirname,'visual-checks.json'),JSON.stringify({checks,errors},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,records:49,errors}));
 }finally{await context.close();await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
