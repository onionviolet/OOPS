import assert from 'node:assert/strict';
import {writeFile, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(process.argv[2]), out=resolve(process.argv[3]);
const {Session,serve}=await import(pathToFileURL(join(root,'scripts/playtest/lib.mjs')));
const server=await serve(join(root,'i3-build/dist'));
const s=new Session({url:server.url,seed:21,wall:Date.UTC(2026,9,26),opTimeout:15000});
const checks=[];let p;
const save=async()=>{await p.locator('#save_button').click();return JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));};
const hp=async()=> (await save()).hp_brewing;
const open=async()=>{await p.locator('#workspace_navigation select').first().selectOption('hp-polyjuice');await p.locator('#hp_brewing').waitFor({state:'visible'});};
const boot=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await open();};
const checkpoint=async name=>{
 const before=await hp();await p.reload();await boot();assert.deepEqual(await hp(),before);
 const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#save_to_file_button').click()]);
 const file=join(out,name+'.txt');await download.saveAs(file);
 await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(file)]);await boot();assert.deepEqual(await hp(),before);
 checks.push(name+': native Save/reload/Export/file Import keeps exact HP state');
};
const action=id=>p.locator(`[data-hp-action="${id}"]:not([disabled])`).first().click();
const row=id=>p.locator(`[data-hp-batch="${id}"]`);
try{
 await s.start();await s.open();p=s.page;await open();await action('begin');
 await p.locator('[data-hp-select="ingredient"]').selectOption('book.hp.ing.leeches');
 await p.locator('[data-hp-select="route"]').selectOption('book.hp.route.student_store');await action('acquire');
 const lot=Object.keys((await hp()).lots)[0];await p.locator('[data-hp-select="slot-leeches"]').selectOption(lot);await action('brew');
 let state=await hp();assert.equal(Object.keys(state.lots).length,0);assert.equal(state.cauldron.brew.history.inputs[0].lot.id,lot);
 const pending=structuredClone(state.cauldron.brew);await checkpoint('pending');
 await s.step(pending.readyAt-state.now);state=await hp();const batch=Object.values(state.batches)[0];assert.equal(batch.history.inputs[0].lot.id,lot);assert.equal(batch.readyAt,pending.readyAt);
 const beforeSplit=await hp(), durableBefore=await p.evaluate(()=>localStorage.getItem('save data'));
 await p.evaluate(()=>{window.__i3SetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')throw Error('I3 injected dose-save failure');return window.__i3SetItem.call(this,k,v);};});
 await row(batch.id).locator('[data-hp-action="split-batch"]').click();assert.match(await p.locator('#hp_brewing').innerText(),/I3 injected dose-save failure/);assert.equal(await p.evaluate(()=>localStorage.getItem('save data')),durableBefore);
 await p.evaluate(()=>{Storage.prototype.setItem=window.__i3SetItem;delete window.__i3SetItem;});assert.deepEqual(await hp(),beforeSplit);checks.push('Injected native dose-save failure restores exact batch quantities, serial and history; retry splits once');
 await row(batch.id).locator('[data-hp-action="split-batch"]').click();state=await hp();const part=Object.values(state.batches).find(b=>b.id!==batch.id);assert.equal(part.dosesLeft,1);assert.equal(part.cohortId,batch.cohortId);
 await row(part.id).locator('[data-hp-action="store-batch"]').click();state=await hp();assert.equal(state.batches[part.id].custody,'bench');await checkpoint('stored-partial');
 await row(part.id).locator('[data-hp-action="retrieve-batch"]').click();await row(part.id).locator('[data-hp-action="merge-batch"]').click();
 state=await hp();assert.equal(Object.keys(state.batches).length,1);assert.equal(state.batches[batch.id].dosesLeft,batch.dosesLeft);
 await action('sample-ask');await p.locator('[data-hp-select="batch"]').selectOption(batch.id);await p.locator('[data-hp-select="sample"]').selectOption(Object.keys((await hp()).samples)[0]);await action('drink');
 state=await hp();assert.equal(state.batches[batch.id].dosesLeft,batch.dosesLeft-1);assert.equal(state.batches[batch.id].history.inputs[0].lot.id,lot);await checkpoint('post-use');
 checks.push('Earned student-store lot -> paid simmer -> retained history -> one-dose aliquot -> bench custody -> retrieve/recombine -> actual sample and drink; no duplicate dose');
 const matrix=[];
 for(const [width,height]of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await p.setViewportSize({width,height});await p.locator('#workspace_navigation select').first().selectOption('customization');await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await open();
  const ui=await s.uiCheck();assert.equal(ui.pageOverflow,0);assert.deepEqual(ui.unlabeled,[]);await row(batch.id).scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`custody-${width}-${size}.png`)});matrix.push({width,height,size,ui});
 }
 const errors=s.errors.filter(e=>!(e.kind==='console'&&/404/.test(e.text)));assert.deepEqual(errors,[]);
 await writeFile(join(out,'browser-result.json'),JSON.stringify({checks,matrix,errors,bundleHash:createHash('sha256').update(await readFile(join(root,'i3-build/dist/bundle.js'))).digest('hex'),route:'Earned fresh HP slice; incomplete original mixture intentionally uses existing inert drink consumer',state:'agent-verified, not human-reviewed'},null,2));
 console.log(JSON.stringify({checks,matrix:matrix.length,errors}));
}catch(e){await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.txt'),e.stack);throw e;}finally{await s.close();server.close();}
