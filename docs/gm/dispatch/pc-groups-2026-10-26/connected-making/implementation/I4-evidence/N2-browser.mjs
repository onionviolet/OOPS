import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]||'/tmp/yairpg-g1-i4-n2-source'), output=path.resolve(process.argv[3]||'/tmp/yairpg-g1-i4-n2-output');
const {Session}=await import(pathToFileURL(path.join(root,'scripts/playtest/lib.mjs')));
const evidence=path.join(path.dirname(new URL(import.meta.url).pathname),'N2-browser'), exports='/tmp/yairpg-i4-n2-private-exports';
await mkdir(evidence,{recursive:true});await mkdir(exports,{recursive:true});
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://x');const file=path.resolve(output,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(output+'/'))throw Error('outside');res.setHeader('content-type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.woff2':'font/woff2','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const s=new Session({url:`http://127.0.0.1:${server.address().port}/?test_hooks=1`,seed:21,wall:Date.UTC(2026,9,26),opTimeout:15000});
const checks=[], http=[];let p;
const select=async(id,value)=>{await p.locator(`[data-hp-select="${id}"]`).selectOption(value);await p.waitForTimeout(50);};
const action=id=>p.locator(`[data-hp-action="${id}"]:not([disabled])`).first().click();
const row=id=>p.locator(`[data-hp-batch="${id}"]`);
const save=async()=>{await p.locator('#save_button').click();return JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));};
const hp=async()=>(await save()).hp_brewing;
const open=async()=>{await p.locator('#workspace_navigation select').first().selectOption('hp-polyjuice');await p.locator('#hp_brewing').waitFor({state:'visible'});};
const boot=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible'});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await open();};
const checkpoint=async name=>{
 const before=await hp();await p.reload();await boot();assert.deepEqual(await hp(),before);
 const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#save_to_file_button').click()]);
 const file=path.join(exports,name+'.txt');await download.saveAs(file);
 await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(file)]);await boot();assert.deepEqual(await hp(),before);
 checks.push(name+': native Save/reload/Export/literal file Import retained exact HP state');
};
const horn=async(variant,injectFailure=false)=>{
 await select('ingredient','book.hp.ing.bicorn_horn');await select('route','book.hp.route.trusted_supplier');await action('acquire');
 const state=await hp(), lot=Object.values(state.lots).filter(l=>l.ingredient==='book.hp.ing.bicorn_horn').at(-1);
 const button=p.locator(`[data-hp-lot="${lot.id}"]`).getByRole('button',{name:variant==='fine'?'Fine powder (2 coins)':'Coarse powder (1 coin)',exact:true});
 if(injectFailure){
  const before=await hp(), durable=await p.evaluate(()=>localStorage.getItem('save data'));
  await p.evaluate(()=>{window.__i4Set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')throw Error('I4 injected paid-preparation failure');return window.__i4Set.call(this,k,v);};});
  await button.click();assert.match(await p.locator('#hp_brewing').innerText(),/injected paid-preparation failure/);
  assert.equal(await p.evaluate(()=>localStorage.getItem('save data')),durable);
  await p.evaluate(()=>{Storage.prototype.setItem=window.__i4Set;delete window.__i4Set;});assert.deepEqual(await hp(),before);
  checks.push('Actual paid-preparation native write failure restores raw lot, purse and absent receipt; retry charges once');
 }
 await button.click();return lot.id;
};
const selectSuspension=async lot=>{await select('method','book.hp.abrasive-suspension@1');await action('clear-selection');await select('slot-bicorn',lot);};
try{
 await s.start();await s.open();p=s.page;
 p.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});
 await open();await action('begin');
 const first=await horn('fine',true);await selectSuspension(first);await action('brew');
 let state=await hp();assert.equal(state.cauldron.brew.history.inputs[0].lot.preparation.means.laborCoins,2);
 assert.equal(state.cauldron.brew.history.minutes,20);assert.equal(Object.keys(state.lots).length,0);
 await checkpoint('pending-suspension');await s.step(20);state=await hp();const batch=Object.values(state.batches)[0];
 await row(batch.id).locator('[data-hp-action="assay-batch"]').click();
 await row(batch.id).locator('[data-hp-action="treat-cauldron"]').click();
 state=await hp();assert.equal(state.batches[batch.id].dosesLeft,2);assert.equal(state.cauldron.condition,1000);assert.equal(Object.keys(state.samples).length,0);
 const method=state.methods[0].id;
 await row(batch.id).locator('[data-hp-action="split-batch"]').click();state=await hp();const part=Object.values(state.batches).find(b=>b.id!==batch.id);
 await row(part.id).locator('[data-hp-action="store-batch"]').click();await checkpoint('observed-partial-custody');
 checks.push('Earned supplier horn -> paid fine preparation -> paid water service -> actual 20-minute settling -> assay -> one-dose scouring -> retained stored remainder and method');
 const second=await horn('fine');await selectSuspension(second);
 await p.locator('[data-hp-methods] > summary').click();await p.waitForTimeout(50);await select('demonstrated-method',method);await select('repeat-mode','quick');
 assert.equal(await p.locator('[data-hp-methods]').evaluate(n=>n.open),true,'method disclosure stays open across selection rerenders');
 await action('repeat');state=await hp();assert.equal(state.cauldron.brew.history.inputs[0].lot.id,second);assert.notEqual(first,second);
 await checkpoint('repeated-pending');await s.step(20);state=await hp();const repeated=Object.values(state.batches).at(-1);
 await row(repeated.id).locator('[data-hp-action="treat-cauldron"]').click();assert.equal((await hp()).cauldron.condition,1000);
 const third=await horn('coarse');await selectSuspension(third);
 if(!await p.locator('[data-hp-methods]').evaluate(n=>n.open)){await p.locator('[data-hp-methods] > summary').click();await p.waitForTimeout(50);}
 await select('demonstrated-method',method);await select('repeat-mode','quick');
 assert.equal(await p.locator('[data-hp-action="repeat"]').isDisabled(),true);
 await select('repeat-mode','guided');assert.match(await p.locator('[data-hp-methods]').innerText(),/Modified attempt/);
 await action('repeat');await s.step(20);state=await hp();const coarse=Object.values(state.batches).at(-1);
 await row(coarse.id).locator('[data-hp-action="treat-cauldron"]').click();state=await hp();assert.equal(state.cauldron.condition,950);
 await p.locator('[data-hp-notebook] > summary').click();await p.waitForTimeout(50);
 assert.match(await p.locator('[data-hp-notebook]').innerText(),/Known changes: Horn of a bicorn preparation/);
 assert.match(await p.locator('[data-hp-notebook]').innerText(),/do not by themselves identify a cause/);
 checks.push('Quick replay rebinds a new actually held lot; fine/coarse controlled tests change actual residue, and notebook names preparation change with uncertainty');
 await checkpoint('comparison-post-use');
 const matrix=[];
 for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width,height});await p.locator('#workspace_navigation select').first().selectOption('customization');
  await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await open();
  const ui=await s.uiCheck();assert.equal(ui.pageOverflow,0);assert.deepEqual(ui.unlabeled,[]);
  await row(coarse.id).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(evidence,`use-${width}-${size}.png`)});matrix.push({width,height,size,ui});
 }
 const unexpected=http.filter(e=>!e.url.includes('/private_packs/')&&!new URL(e.url).pathname.endsWith('/favicon.ico'));
 assert.deepEqual(unexpected,[]);assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'),[]);
 const bundleHash=createHash('sha256').update(await readFile(path.join(output,'dist/bundle.js'))).digest('hex');
 await writeFile(path.join(evidence,'result.json'),JSON.stringify({checks,matrix,bundleHash,httpUnexpected:unexpected,pageErrors:s.errors.filter(e=>e.kind==='pageerror'),route:'Earned fresh standalone HP bench; one named synthetic native storage-failure injection; no native transport or normal profile claimed'},null,2)+'\n');
 console.log(JSON.stringify({checks,matrix:matrix.length,bundleHash}));
}catch(e){await p?.screenshot({path:path.join(evidence,'failure.png')}).catch(()=>{});await writeFile(path.join(evidence,'failure.txt'),e.stack||String(e));throw e;}finally{await s.close();server.close();}
