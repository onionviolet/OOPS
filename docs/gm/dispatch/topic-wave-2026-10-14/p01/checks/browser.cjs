// Disposable profiles; native UI transactions. Real worker ticks for completion;
// freeze only external timers for exact snapshots. No stock/time/save injection.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=process.cwd(),out=path.join(__dirname,'../evidence'),origin='http://127.0.0.1:22470';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const {decodeSaveFile}=await import(path.join(root,'src/save_files.js'));
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true}),results=[];
 for(const [width,height]of [[1366,768],[1600,1000]]){
 const contexts=[],errors=[],checks=[];
 const context=async()=>{const c=await browser.newContext({viewport:{width,height},acceptDownloads:true});contexts.push(c);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(12000);await p.clock.setFixedTime(new Date('2026-10-14T20:00:00Z'));return p;};
 let page=await context();
 const freeze=async p=>{await pause(650);for(const w of p.workers())await w.evaluate(()=>self.close());};
 const boot=async(p,name)=>{await p.goto(origin);await p.locator('#loading_screen_play_button').click();await p.locator('#hero_creation_name_field').fill(name);await p.locator('#hero_creation_panel_confirmation').click();await freeze(p);};
 const save=async p=>{await p.locator('#save_button').click();return JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));};
 const scope=s=>({mixtures:s.mixtures,inventory:s.inventories.person.main_character,money:s.character.money,clock:s['current time']});
 const rows=async p=>p.locator('#mixture_feedback').innerText();
 const open=async p=>{await p.locator('#village_mixing_open').click();};
 const check=(name,fn)=>{fn();checks.push(name);};
 const fit=async(p,label)=>{
  // Top of the existing scrolling panel, no scroll needed for any feedback row.
  await p.locator('#crafting_window').evaluate(el=>{el.scrollTop=0;});
  const boxes=await p.locator('#mixture_feedback > div,#mixture_craft').evaluateAll(els=>els.map(el=>({id:el.id||el.querySelector('[id]').id,rect:el.getBoundingClientRect().toJSON()})));
  const clip=await p.locator('#crafting_window').boundingBox();
  for(const b of boxes)assert.ok(b.rect.top>=clip.y&&b.rect.bottom<=Math.min(height,clip.y+clip.height),`${label} ${b.id} clipped: ${JSON.stringify({box:b.rect,clip})}`);
  await p.screenshot({path:path.join(out,`${label}-${width}.png`)});checks.push(label+'-all-rows-and-mix-visible');return boxes;
 };
 const persistence=async(p,label)=>{
  await p.locator('#crafting_window').evaluate(el=>{el.scrollTop=0;});
  const before=await save(p),beforeRows=await rows(p);
  const d=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const literal=path.join('/private/tmp',`p01-${label}-${width}-${Date.now()}.txt`);await(await d).saveAs(literal);
  const exported=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');assert.deepEqual(exported,before);
  await p.reload();await p.locator('#loading_screen_play_button').click();await freeze(p);await open(p);const reloaded=await save(p);assert.deepEqual(scope(reloaded),scope(before));assert.equal(await rows(p),beforeRows);
  const importedPage=await context();await boot(importedPage,`TEST FIXTURE P01 IMPORT ${label} ${width}`);
  await Promise.all([importedPage.waitForNavigation({waitUntil:'domcontentloaded'}),importedPage.locator('#saved_file_input').setInputFiles(literal)]);
  assert.equal(await importedPage.evaluate(()=>localStorage.getItem('save data')),JSON.stringify(exported));
  await importedPage.locator('#loading_screen_play_button').click();await freeze(importedPage);await open(importedPage);const imported=await save(importedPage);assert.deepEqual(scope(imported),scope(before));assert.equal(await rows(importedPage),beforeRows);
  await fit(importedPage,`import-${label}`);await importedPage.context().close();
  fs.writeFileSync(path.join(out,`${label}-persistence-${width}.json`),JSON.stringify({sourceOnly:false,literal,exportFullEnvelopeExact:true,reloadStockJobAndRowsExact:true,literalImportBytesExact:true,importStockJobAndRowsExact:true,rows:beforeRows},null,2));checks.push(label+'-save-reload-export-literal-import');
 };
 try{
  await boot(page,`TEST FIXTURE P01 ${width}`);await open(page);
  const served=await page.request.get(origin+'/dist/bundle.js'),buildHash=hash(await served.body());assert.equal(buildHash,hash(fs.readFileSync(path.join(root,'dist/bundle.js'))));
  await fit(page,'initial');
  for(let i=0;i<3;i++)await page.getByRole('button',{name:'Buy 1 (8 coins)',exact:true}).click();
  for(let i=0;i<4;i++)await page.getByRole('button',{name:'Buy 1 (2 coins)',exact:true}).click();
  const bought=await save(page);assert.equal(bought.character.money,70);checks.push('paid-inputs-32-coins');
  await page.locator('#mixture_craft').click();assert.match(await page.locator('#mixture_notice').innerText(),/Mixture owned/);
  const mixed=await save(page);check('one-vial-paid-inputs',()=>{assert.equal(mixed.inventories.person.main_character['{"id":"River bellleaf"}'].count,2);assert.equal(mixed.inventories.person.main_character['{"id":"Spring water"}'].count,3);});
  await page.getByRole('button',{name:'Experiment: drink one dose',exact:true}).click();await page.getByRole('button',{name:'Save observed method',exact:true}).click();
  await page.getByRole('spinbutton',{name:'Repeat batch count',exact:true}).fill('4');await page.getByRole('button',{name:'Queue learned method',exact:true}).click();
  const pending=await save(page);assert.equal(pending.mixtures.job.remaining,4);await fit(page,'pending');await persistence(page,'pending');
  // Resume the ordinary played clock; wait for two held batches to complete,
  // then the next reservation finds the actual missing bellleaf.
  await page.reload();await page.locator('#loading_screen_play_button').click();await open(page);
  await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('save data'));return s?.mixtures?.sequence>5&&s.mixtures.job===null;},null,{timeout:18000});
  await freeze(page);await page.getByRole('button',{name:'Back to local actions',exact:true}).click();await open(page);
  const completed=await save(page);check('timed-repeat-stops-on-actual-shortage',()=>{assert.equal(completed.mixtures.job,null);assert.equal(completed.inventories.person.main_character['{"id":"River bellleaf"}'],undefined);assert.equal(completed.inventories.person.main_character['{"id":"Spring water"}'].count,1);});
  assert.match(await rows(page),/Queue finished or stopped/);assert.match(await rows(page),/Current reason: Next batch needs 1 River bellleaf; you have 0/);
  await fit(page,'completed');await persistence(page,'completed');
  for(let i=0;i<2;i++)await page.getByRole('button',{name:'Buy 1 (8 coins)',exact:true}).click();await page.getByRole('button',{name:'Buy 1 (2 coins)',exact:true}).click();
  assert.match(await rows(page),/Current reason: Next batch can start now/);
  const beforeResume=await save(page);await page.getByRole('spinbutton',{name:'Repeat batch count',exact:true}).fill('2');await page.getByRole('button',{name:'Queue learned method',exact:true}).click();const resumed=await save(page);assert.equal(resumed.mixtures.job.remaining,2);checks.push('replenish-resume');
  await page.reload();await page.locator('#loading_screen_play_button').click();await open(page);await pause(1100);await freeze(page);const midJob=await save(page);assert.ok(midJob.mixtures.job);assert.ok(midJob['current time'].minute>resumed['current time'].minute);assert.ok(midJob['current time'].minute-resumed['current time'].minute<3);checks.push('cancel-after-played-tick');
  await page.locator('#mixture_cancel').click();const cancelled=await save(page);assert.equal(cancelled.mixtures.job,null);assert.deepEqual(cancelled.inventories,beforeResume.inventories);checks.push('cancel-exact-held-refund');
  const beforeUnknown=await save(page);
  await page.evaluate(()=>{globalThis.p01SetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')throw Error('private evaluator sealed threshold 897');return globalThis.p01SetItem.call(this,k,v);};});
  await page.locator('#mixture_craft').click();const failureNotice=await page.locator('#mixture_notice').innerText();assert.match(failureNotice,/Can't mix right now.*Last notice:/);assert.doesNotMatch(failureNotice,/private|sealed|897/);
  await page.evaluate(()=>{Storage.prototype.setItem=globalThis.p01SetItem;delete globalThis.p01SetItem;});assert.deepEqual(scope(await save(page)),scope(beforeUnknown));checks.push('unknown-error-safe-retained-notice-no-payment');
  // Force a stale selection quote by changing its value without the input event.
  // The normal admission path must refuse before payment; restore via input.
  const beforeStale=await save(page);await page.locator('#mixture_amount_River_bellleaf').evaluate(el=>{el.value='2';});await page.locator('#mixture_craft').click();assert.match(await page.locator('#mixture_notice').innerText(),/Quote changed/);const afterStale=await save(page);assert.deepEqual(scope(afterStale),scope(beforeStale));checks.push('forced-stale-selection-zero-payment');
  await page.locator('#mixture_amount_River_bellleaf').fill('1');
  const beforeReopen=await save(page);for(let i=0;i<4;i++){await page.getByRole('button',{name:'Back to local actions',exact:true}).click();await open(page);}assert.deepEqual(scope(await save(page)),scope(beforeReopen));checks.push('reopen-stock-time-and-owner-unchanged');
  await fit(page,'final');assert.deepEqual(errors,[]);checks.push('zero-page-errors');
  results.push({viewport:`${width}x${height}`,buildHash,checks,errors,implementedUnverified:[]});fs.writeFileSync(path.join(out,'proof.json'),JSON.stringify({results},null,2));console.log(JSON.stringify(results.at(-1)));
 }catch(e){await page.screenshot({path:path.join(out,`failure-${width}.png`)});console.error(await rows(page).catch(()=>''));throw e;}finally{for(const c of contexts)await c.close();}
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;process.exit(1)});
