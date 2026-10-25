// D2 AR9: fresh-origin fixture, native inventory/save, reload, literal file import.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {launchChrome} from '../../../../scripts/perf/lib.mjs';
const browser=await launchChrome();
const output={viewport:'1920x1080',runs:[]};
try {
 for(const name of ['fresh','mid','crowded']){
  const context=await browser.newContext({viewport:{width:1920,height:1080}});
  const fixture=fs.readFileSync(`tests/fixtures/perf/${name}.json`,'utf8');
  await context.addInitScript(d=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',d);sessionStorage.setItem('seeded','1');}},fixture);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const t=performance.now();await page.goto('http://127.0.0.1:5102/',{waitUntil:'load'});
  const play=page.getByText('PLAY',{exact:true});await play.waitFor({state:'visible'});const visible=performance.now()-t;
  await play.click();await page.waitForFunction(()=>typeof window.saveProgress==='function');
  const ready=performance.now()-t;
  const stock=()=>page.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data')).inventories;});
  const initial=await stock();
  const encoded=await page.evaluate(()=>window.save_to_file());assert.ok(encoded);
  await page.reload({waitUntil:'load'});await play.click();assert.deepEqual(await stock(),initial);
  await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('#saved_file_input').setInputFiles({name:'d2-export.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
  await play.click();assert.deepEqual(await stock(),initial);assert.deepEqual(errors,[]);
  output.runs.push({fixture:name,playVisibleMs:visible,readyMs:ready,inventoryOwners:Object.keys(initial.person).length,saveReloadImport:true,errors});
  await context.close();
 }
 fs.writeFileSync(process.argv[2],JSON.stringify(output,null,2));console.log(JSON.stringify(output));
}finally{await browser.close();}
