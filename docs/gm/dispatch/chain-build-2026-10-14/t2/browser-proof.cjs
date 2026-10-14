// Rebuilt native read-only proof over a disposable TEST FIXTURE literal export.
// Usage: node <this file> /private/tmp/cb-t2-...-literal.txt [output directory]
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=process.cwd(),literal=process.argv[2],out=process.argv[3]||path.join(__dirname,'evidence');
const settle=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const {decodeSaveFile}=await import(path.join(root,'src/save_files.js'));
 const {drawUnit,STREAMS}=await import(path.join(root,'src/seeded_streams.js'));
 const expected=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');
 assert.match(expected.character.name,/^TEST FIXTURE CB T2/);
 fs.mkdirSync(out,{recursive:true});
 const ctx=await chromium.launchPersistentContext('/private/tmp/cb-t2-profile-proof-'+process.pid+'-'+Date.now(),{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
 const page=ctx.pages()[0],errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
 const read=()=>page.evaluate(()=>localStorage.getItem('save data'));
 const save=async()=>{await page.locator('#save_button').click();await settle(100);return read();};
 const next=s=>drawUnit(structuredClone(s.expansion),STREAMS.craft,'cb-t2-next');
 const scope=s=>({harvest:s.harvest,mixtures:s.mixtures,inventory:s.inventories,streams:s.expansion.streams,simulation:s.expansion.simulation});
 try{
  await page.clock.setFixedTime(new Date('2026-10-14T12:05:03.601Z'));
  await page.goto('http://127.0.0.1:22450/?harvest-inspector=1');
  const served=await page.request.get('http://127.0.0.1:22450/dist/bundle.js');
  const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
  const buildHash=hash(await served.body());assert.equal(buildHash,hash(fs.readFileSync(path.join(root,'dist/bundle.js'))));
  await page.locator('#loading_screen_play_button').click();await page.locator('#hero_creation_name_field').fill('TEST FIXTURE CB T2 PROOF TARGET');await page.locator('#hero_creation_panel_confirmation').click();
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles(literal)]);
  assert.equal(await read(),JSON.stringify(expected),'literal import bytes');
  await page.locator('#loading_screen_play_button').click();await settle(650);
  // HackTimer owns a worker. Freeze only the external scheduler after panels
  // mount and before the one-second game tick, then compare the real Save path.
  for(const w of page.workers())await w.evaluate(()=>self.close());await settle(100);
  const before=await save();assert.deepEqual(scope(JSON.parse(before)),scope(expected));
  await page.locator('#harvest_inspector > summary').click();await settle(100);
  assert.equal(await page.locator('#harvest_inspector').locator('button,input,select,textarea').count(),0);
  for(const [width,height]of [[1366,768],[1600,1000]]){
   await page.setViewportSize({width,height});await page.mouse.move(10,10);await settle(100);
   const box=await page.locator('#harvest_inspector').boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=height);
   await page.screenshot({path:path.join(out,`final-${width}.png`)});
   assert.equal(await save(),before,'open inspector bytes');
  }
  await page.locator('#harvest_inspector > summary').click();await settle(100);assert.equal(await save(),before,'closed inspector bytes');
  const download=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const exported=await download;
  const file='/private/tmp/cb-t2-proof-export-'+Date.now()+'.txt';await exported.saveAs(file);
  assert.equal(JSON.stringify(decodeSaveFile(fs.readFileSync(file,'utf8'),'v0.6')),before,'Export bytes');
  assert.equal(next(JSON.parse(before)),next(expected));
  await page.reload();await page.locator('#loading_screen_play_button').click();await settle(650);for(const w of page.workers())await w.evaluate(()=>self.close());await settle(100);
  const reloaded=await save();assert.deepEqual(scope(JSON.parse(reloaded)),scope(expected));assert.equal(next(JSON.parse(reloaded)),next(expected));
  await page.locator('#harvest_inspector > summary').click();await settle(100);assert.equal(await save(),reloaded);
  await page.goto('http://127.0.0.1:22450/');await page.locator('#loading_screen_play_button').click();await settle(650);for(const w of page.workers())await w.evaluate(()=>self.close());
  assert.equal(await page.locator('#harvest_inspector').count(),0,'non-developer DOM');
  assert.deepEqual(errors,[]);
  const summary={buildHash,literalBytes:JSON.stringify(expected).length,normalizedBytes:before.length,literalImportExact:true,openCloseSaveBytesExact:true,exportBytesExact:true,reloadChainAndStreamStateExact:true,nextDrawMatches:true,nextCraftValue:next(expected),nonDeveloperInspectorAbsent:true,mutationControls:0,viewports:['1366x768','1600x1000'],pageErrors:errors};
  fs.writeFileSync(path.join(out,'proof.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
 }finally{await ctx.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
