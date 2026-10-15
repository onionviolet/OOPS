// Real old-client save and independent fresh native contexts. No other check outputs.
const fs=require('fs'),path=require('path'),os=require('os'),assert=require('assert/strict'),crypto=require('crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
if(!process.env.URL)throw Error('Set URL to rebuilt native origin with .proof-old/ current-main client.');
const origin=new URL(process.env.URL);origin.search='';origin.hash='';const base=origin.href.replace(/\/?$/,'/'),testURL=new URL('?test_hooks=1',base).href,oldURL=new URL('.proof-old/',base).href,key='yairpg:p23:native-authority:1:live';
const root=process.env.YAIRPG_PROOF_DIR||os.tmpdir();fs.mkdirSync(root,{recursive:true});const out=fs.mkdtempSync(path.join(root,'p15-native-'));
const sourceMap=new (require('module').SourceMap)(JSON.parse(fs.readFileSync('dist/bundle.js.map','utf8')));
const tickCallLine=fs.readFileSync('src/main.js','utf8').split('\n').findIndex(line=>line.includes('const advancedMinutes = update_timer();'))+1;
assert.ok(tickCallLine>0,'mapped native tick caller exists');
const operationWrites=[];
const callers=row=>[...row.stack.matchAll(/bundle\.js[^\n]*?:(\d+):(\d+)/g)].map(m=>sourceMap.findEntry(+m[1]-1,+m[2]-1)).map(e=>({source:e.originalSource,line:e.originalLine+1,name:e.name}));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const encode=s=>'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(s)).toString('base64');
const decode=s=>JSON.parse(Buffer.from(s.trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8'));
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const contexts=[],gates=[],errors=[],loaded=[];
 const context=await browser.newContext({viewport:{width:1366,height:768}});contexts.push(context);
 // Persist the trace across native reloads. No game bytes are changed by instrumentation.
 await context.addInitScript(k=>{
  const write=Storage.prototype.setItem;
  document.addEventListener('click',event=>{
   const id=event.target?.closest('button,input')?.id;
   if(id)write.call(sessionStorage,'p15-proof-action',JSON.stringify({id,at:Date.now()}));
   if(id==='native_authority_undo')write.call(sessionStorage,'p15-proof-before-undo',localStorage.getItem(k));
  },true);
  Storage.prototype.setItem=function(name,bytes){
   if(name!==k||this!==localStorage)return write.call(this,name,bytes);
   const trace=JSON.parse(sessionStorage.getItem('p15-proof-writes')||'[]');
   const row={key:name,length:bytes.length,utf8Bytes:new TextEncoder().encode(bytes).length,
    timestamp:new Date().toISOString(),stack:new Error('authority write').stack,
    action:JSON.parse(sessionStorage.getItem('p15-proof-action')||'null'),revision:JSON.parse(bytes).revision};
   try{const result=write.call(this,name,bytes);row.success=true;return result;}
   catch(error){row.success=false;row.error=error.message;throw error;}
   finally{trace.push(row);write.call(sessionStorage,'p15-proof-writes',JSON.stringify(trace));
    if(row.success)write.call(sessionStorage,'p15-proof-write-count',String(Number(sessionStorage.getItem('p15-proof-write-count')||0)+1));}
  };
 },key);
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()===200&&r.url().startsWith(base)&&new URL(r.url()).pathname===new URL('dist/bundle.js',base).pathname)loaded.push(r.body().then(sha));});
 const all=()=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
 const read=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 const play=async()=>{const p=page.locator('#loading_screen_play_button:not(.none_display)');await p.waitFor({state:'visible',timeout:90000});await p.click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();if(new URL(page.url()).searchParams.has('test_hooks'))await page.evaluate(()=>simulationTestHooks.pause());};
 const open=async()=>{if(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--options_display')!=='block'))await page.locator('#options_button').click();const box=page.locator('#native_save_authority');await box.waitFor();if(!await box.evaluate(n=>n.open))await box.locator('summary').click();};
 const change=async id=>{const before=(await read())?.revision||0;await open();await page.locator('#'+id).click();await page.waitForFunction(({k,r})=>{const root=JSON.parse(localStorage.getItem(k));return root?.revision>r&&document.getElementById('native_save_authority_status').textContent.includes('revision '+root.revision+'.');},{k:key,r:before},{timeout:90000});await page.evaluate(()=>window.closeOptions());};
 const beforeWrites=()=>page.evaluate(()=>Number(sessionStorage.getItem('p15-proof-write-count')||0));
 const countSince=async n=>{
  const rows=(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('p15-proof-writes')||'[]'))).filter(r=>r.success).slice(n);
  // A timer's own durable publication is a distinct save, never part of a UI operation.
  // Classify by the mapped caller, rather than a broad Playwright time window.
  const operation=rows.filter(r=>!callers(r).some(f=>f.source==='../src/main.js'&&f.line===tickCallLine));
  operationWrites.push({afterWrite:n,writes:operation.map(r=>({revision:r.revision,callers:callers(r)})),independentTickWrites:rows.length-operation.length});
  assert.equal(operation.length,1,'one physical authority write per operation; '+JSON.stringify(rows.map(r=>({...r,callers:callers(r)}))));
 };
 const save=async()=>{const n=await beforeWrites();await page.locator('#save_button').click();await countSince(n);return read();};
 const reload=async()=>{await page.reload({waitUntil:'domcontentloaded'});return read();};
 const importFile=async file=>{const n=await beforeWrites();await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:90000}),page.locator('#saved_file_input').setInputFiles(file)]);await countSince(n);return read();};
 try{
  const oldResponse=await page.request.get(new URL('dist/bundle.js',oldURL).href);assert.equal(oldResponse.status(),200,'current-main old client served');
  await page.goto(oldURL);await play();await page.locator('#save_button').click();const original=await all();assert.ok(original['save data']);assert.equal(original[key],undefined);fs.writeFileSync(path.join(out,'current-main-old.save.txt'),encode(JSON.parse(original['save data'])));
  // Freeze genuine old-client storage before entering this build. No manufactured game envelope.
  await page.goto(new URL('style.css',base).href,{waitUntil:'domcontentloaded'});await page.evaluate(state=>{localStorage.clear();for(const [k,v]of Object.entries(state))localStorage.setItem(k,v);},original);
  await page.goto(testURL,{waitUntil:'domcontentloaded'});assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);assert.equal((await all())['save data'],original['save data']);gates.push('current-main old client fresh native Save loads unchanged, no implicit enrollment');await play();
  await open();assert.match(await page.locator('#native_save_authority').innerText(),/need this build or later/);
  const preEnrollment=await page.evaluate(()=>{const before=Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]));document.getElementById('native_authority_enroll').click();return before;}),legacyHashes=Object.fromEntries(Object.entries(preEnrollment).map(([k,v])=>[k,sha(v)]));let n=0;await page.waitForFunction(k=>localStorage.getItem(k)!==null,key,{timeout:90000});await countSince(0);await page.waitForFunction(()=>/Enrolled, revision/.test(document.getElementById('native_save_authority_status').textContent));await page.evaluate(()=>window.closeOptions());
  const enrolled=await all();for(const [k,v]of Object.entries(preEnrollment))assert.equal(enrolled[k],v,'legacy bytes unchanged: '+k);fs.writeFileSync(path.join(out,'legacy-hashes.json'),JSON.stringify(legacyHashes,null,2));gates.push('explicit enrollment one write; every prior localStorage key byte-identical');
  n=await beforeWrites();await change('native_authority_capture');await countSince(n);const captured=await read();assert.equal(captured.previous,captured.current);
  // Native paid custody change, then exact rollback. Trade is real stock and money.
  await page.evaluate(()=>window.startTrade('villageTrader'));await page.locator('#trader_inventory_div .item_name').getByText('Stale bread',{exact:true}).locator('xpath=ancestor::*[contains(@class,"inventory_item_control")]').click();await page.locator('#accept_trade_button').click();await page.locator('#exit_trade_button').click();const paid=await save();assert.ok(JSON.parse(paid.current).character.money<JSON.parse(captured.current).character.money);assert.equal(paid.previous,captured.previous);
  n=await beforeWrites();await open();const undoNav=page.waitForNavigation({waitUntil:'domcontentloaded',timeout:90000});await page.locator('#native_authority_undo').click();await undoNav;await countSince(n);const undone=await read(),undoSource=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('p15-proof-before-undo')));assert.equal(undone.current,captured.previous);assert.equal(undone.previous,undoSource.current);assert.equal(undone.revision,undoSource.revision+1);gates.push('captured exact native life, paid native trade, Save and Undo restores exact bytes');
  await play();await save();const durable=await read();const afterReload=await reload();assert.deepEqual(afterReload,durable);await play();
  const download=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const file=path.join(out,'enrolled-export.save.txt');await(await download).saveAs(file);const exported=decode(fs.readFileSync(file,'utf8'));assert.equal(exported.p23_native_authority_export,1);const beforeImport=await read();assert.equal(exported.current,beforeImport.current);assert.equal(exported.previous,beforeImport.previous);
  const imported=await importFile(file);assert.equal(imported.current,exported.current);assert.equal(imported.previous,exported.previous);assert.equal(imported.revision,beforeImport.revision+1);gates.push('enrolled Save/reload/Export/literal-file Import preserves both exact snapshots in one revision');await play();
  const current=await read();n=await beforeWrites();await open();await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:90000}),page.locator('#native_authority_undo').click()]);await countSince(n);const repeated=await read(),repeatSource=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('p15-proof-before-undo')));assert.equal(repeated.current,repeatSource.previous);assert.equal(repeated.previous,repeatSource.current);await play();gates.push('second native Undo swaps exact snapshots without replaying grants');
  await page.evaluate(k=>{window.__p15QuotaBefore=localStorage.getItem(k);window.__p15QuotaWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(name,value){if(name===k)throw new DOMException('P15 quota gate','QuotaExceededError');return window.__p15QuotaWrite.call(this,name,value);};},key);
  await open();await page.locator('#native_authority_capture').click();await page.waitForFunction(()=>/no room/i.test(document.getElementById('native_save_authority_status').textContent));assert.equal(await page.evaluate(k=>localStorage.getItem(k)===window.__p15QuotaBefore,key),true);await page.evaluate(()=>Storage.prototype.setItem=window.__p15QuotaWrite);gates.push('quota failure preserves prior authority bytes');
  for(const [label,mutate]of [['export schema',x=>x.p23_native_authority_export=999],['game schema',x=>{const native=JSON.parse(x.current);native.fork_schema=999;x.current=JSON.stringify(native);}]] ){
   const bad=structuredClone(exported);mutate(bad);const badFile=path.join(out,'rejected-'+label.replaceAll(' ','-')+'.txt');fs.writeFileSync(badFile,encode(bad));const proof=await page.evaluate(async({text,k})=>{const before=localStorage.getItem(k);await window.load_progress(text);return{before,after:localStorage.getItem(k),message:document.body.innerText};},{text:encode(bad),k:key});assert.equal(proof.after,proof.before);assert.match(proof.message,/Import rejected/);gates.push(label+' rejection before mutation');
  }
  // Independent fresh origins test loud corrupt/unsupported boot, preserved recovery bytes.
  for(const corrupt of ['{',JSON.stringify({...await read(),schema:999})]){
   const c=await browser.newContext({viewport:{width:1366,height:768}});contexts.push(c);const p=await c.newPage();await p.goto(new URL('style.css',base).href,{waitUntil:'domcontentloaded'});const storage={...original,[key]:corrupt};await p.evaluate(s=>{for(const[k,v]of Object.entries(s))localStorage.setItem(k,v);},storage);await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('#native_authority_recovery').waitFor({timeout:90000});assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))),storage);assert.match(await p.locator('#native_authority_recovery').innerText(),/preserved legacy/i);const d=p.waitForEvent('download');await p.getByRole('button',{name:'Download preserved legacy save',exact:true}).click();const legacyFile=path.join(out,'legacy-recovery-'+contexts.length+'.txt');await(await d).saveAs(legacyFile);assert.deepEqual(decode(fs.readFileSync(legacyFile,'utf8')),JSON.parse(original['save data']));await c.close();
  }
  gates.push('present corrupt and unsupported authority reject loudly, no fallback or localStorage mutation, actual preserved-legacy recovery download');
  // Explicit native Hard Reset uses fresh native producer and retains authority.
  const beforeReset=await read();n=await beforeWrites();page.once('dialog',d=>d.accept('reset'));await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:90000}),page.evaluate(()=>window.hardReset())]);await countSince(n);const reset=await read();assert.ok(reset);assert.equal(reset.previous,null);assert.equal(reset.revision,beforeReset.revision+1);assert.equal((await all())['save data'],original['save data']);gates.push('explicit Hard Reset writes one fresh native authority and keeps original legacy bytes');
  await play();await page.screenshot({path:path.join(out,'desktop.png')});assert.deepEqual(errors,[]);const served=await page.request.get(new URL('dist/bundle.js',base).href);assert.equal(served.status(),200);const hash=sha(await served.body());assert.deepEqual([...new Set(await Promise.all(loaded))],[hash]);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({lane:'p15-save-time-options',status:'PASS',viewport:'1366x768',bundleSha256:hash,currentMainOldClientBundleSha256:sha(await oldResponse.body()),gates,operationWrites,legacyHashes,pageErrors:errors},null,2));console.log('P15 native PASS '+out);
 }catch(error){fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({error:error.stack,gates,pageErrors:errors},null,2));throw error;}finally{fs.writeFileSync(path.join(out,'authority-writes.json'),JSON.stringify((await page.evaluate(()=>JSON.parse(sessionStorage.getItem('p15-proof-writes')||'[]')).catch(()=>[])).map(r=>({...r,callers:callers(r)})),null,2));for(const c of contexts)await c.close().catch(()=>{});await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
