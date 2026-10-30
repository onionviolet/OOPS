// Return digest browser proof (TIME_AND_CHRONICLE TC3, RPT6, B1): fresh life, earned steps, 1920x1080 headless Chrome.
//   npm run build && node docs/representations/evidence/time/browser.cjs      (own static server, fresh origin; no save is edited except step E's pre-slice copy)
// Route: talk to the elder, open the Notebook, investigate the waypost, let twelve game hours pass; then
// Save, reload, Mark as read, Save, Export, Import, and load a copy with the slice removed.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const out=__dirname,repo=path.resolve(out,'../../../..');
const {launchChrome,advanceGameMinutes,openNotebook}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(repo,u==='/'?'index.html':u);
 if(!f.startsWith(repo)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
const view=page=>page.evaluate(()=>{const d=document.getElementById('return_digest'),f=document.getElementById('world_event_feed'),s=window.simulationTestHooks.snapshot();
 const chain=[];for(let n=d;n&&n!==document.body;n=n.parentElement){const cs=getComputedStyle(n);if(n.hidden||cs.display==='none'||cs.visibility==='hidden'||(n.tagName==='DETAILS'&&!n.open))chain.push(`${n.tagName.toLowerCase()}#${n.id}.${n.className}`.slice(0,80));}
 return {visible:!!d&&d.checkVisibility(),rendered:!!d&&!d.hidden,rect:d&&[...Object.values(d.getBoundingClientRect().toJSON())].map(Math.round),blockers:chain,text:d?.innerText||'',feedShown:!!f&&!f.hidden&&getComputedStyle(f).display!=='none',
  marker:s.returnDigest??null,clock:s.expansion?.clock,pageOverflow:document.documentElement.scrollWidth>innerWidth+1};});
const saveNow=async page=>{await page.locator('#save_button').click({force:true});await page.waitForTimeout(300);return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/?test_hooks=1`;
 const bundle=crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,'dist/bundle.js'))).digest('hex').slice(0,16);
 const browser=await launchChrome(),errors=[],log=[],views={};
 try{const page=await (await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true})).newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks,null,{timeout:60000});const play=page.getByText('PLAY',{exact:true});if(await play.isVisible().catch(()=>false))await play.click();await page.waitForTimeout(1500);};
  await page.goto(url);await boot();
  views.fresh=await view(page);assert.equal(views.fresh.visible,false);assert.deepEqual(views.fresh.marker,{schema:1,seenAt:0});log.push('A0 fresh life: no row; marker baselined at clock 0 and saved');
  await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('#center_mode_back').click();
  await advanceGameMinutes(page,1);await page.waitForTimeout(500);
  const opened=await page.evaluate(()=>{const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.textContent.trim().startsWith('Notes, practice')));const o=sel&&[...sel.options].find(o=>o.textContent.trim().startsWith('Notes, practice'));if(!o)return null;sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));return o.textContent.trim();});
  assert.ok(opened,'Notes, practice & people is listed in All panels');await page.locator('#adventure_notebook').waitFor({state:'visible'});await page.waitForTimeout(500);
  const here=page.locator('[data-notebook-view="here"]');if(await here.count())await here.first().click();await page.locator('#village_panel summary').waitFor({state:'visible'});await page.locator('#village_panel summary').click();
  const openPanel=title=>page.evaluate(t=>{const named=o=>o.textContent.replace(/\s*•\s*$/,'').trim()===t;const sel=[...document.querySelectorAll('select')].find(s=>[...s.options].some(named));const o=sel&&[...sel.options].find(named);if(!o)return null;sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));return t;},title);
  await page.locator('[data-village-action="village.waypost"]').click();log.push('A1 earned: talked to the elder, opened Notes, practice & people from All panels, investigated the waypost');
  await advanceGameMinutes(page,5);assert.ok(await openPanel('World events'),'World events is listed in All panels once it has news');await page.waitForTimeout(500);log.push('A1b opened World events from All panels');
  await advanceGameMinutes(page,235);views.fourHours=await view(page);log.push(`A2 four hours later: row ${views.fourHours.visible?'shown':'hidden'}`);
  await advanceGameMinutes(page,480);views.away=await view(page);
  assert.equal(views.away.visible,true,'digest after twelve hours');assert.match(views.away.text,/While you were away · about half a day/);assert.match(views.away.text,/You · \d/);assert.match(views.away.text,/waypost/i);assert.equal(views.away.pageOverflow,false);
  log.push(`A3 twelve hours later: "${views.away.text.replace(/\n+/g,' | ')}"`);
  await page.evaluate(()=>document.getElementById('return_digest').scrollIntoView({block:'center'}));await page.screenshot({path:path.join(out,'digest-away-1920x1080.png')});
  const saved=await saveNow(page);assert.deepEqual(saved.returnDigest,{schema:1,seenAt:0});await page.reload();await boot();views.reloaded=await view(page);
  assert.equal(views.reloaded.rendered,true,'still unread after reload');assert.equal(views.reloaded.marker.seenAt,0);
  log.push(`B Save and reload: still unread, marker seenAt 0; World events module ${views.reloaded.visible?'open':'closed by the workspace, reopened from All panels'}`);
  if(!views.reloaded.visible){await openPanel('World events');await page.waitForTimeout(500);assert.equal((await view(page)).visible,true);}
  await page.locator('#return_digest button').click();views.read=await view(page);assert.equal(views.read.visible,false);assert.ok(views.read.clock-views.read.marker.seenAt<=2);
  log.push(`C Mark as read: row hidden; marker seenAt ${views.read.marker.seenAt} = clock`);
  await page.screenshot({path:path.join(out,'digest-read-1920x1080.png')});
  await saveNow(page);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click({force:true})]);const encoded=fs.readFileSync(await download.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'digest-export.txt',mimeType:'text/plain',buffer:encoded})]);
  await boot();views.imported=await view(page);assert.equal(views.imported.visible,false,'Import does not replay a read digest');assert.equal(views.imported.marker.seenAt,views.read.marker.seenAt);
  log.push('D Export then Import: marker carried, row not replayed');
  const legacy=await saveNow(page);delete legacy.returnDigest;await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),legacy);await page.reload();await boot();
  views.legacy=await view(page);assert.equal(views.legacy.visible,false);assert.ok(views.legacy.clock-views.legacy.marker.seenAt<=2&&views.legacy.marker.seenAt>views.read.marker.seenAt-1,'starts at its own clock');log.push('E save without the slice: marker starts at its own clock, no replay');
  const r={bundle,viewport:'1920x1080',route:'fresh life, elder talk, Notebook waypost, 12 game hours; Save, reload, Mark as read, Export, Import, pre-slice save',errors,log,views};
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(r,null,1));console.log(JSON.stringify({bundle,errors,log},null,1));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.log(JSON.stringify({log,errors,views},null,1));process.exitCode=1;}finally{await browser.close().catch(()=>{});server.close();}
})();
