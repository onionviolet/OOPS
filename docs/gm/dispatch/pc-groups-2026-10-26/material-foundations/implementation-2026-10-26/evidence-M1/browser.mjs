// Rebuilt native rendering sample on an existing explicitly synthetic fixture.
// No normal profile, personal save or foreground browser is used.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
const root=process.cwd();
const {launchChrome}=createRequire(path.join(root,'package.json'))('./scripts/ui_helpers.cjs');
const buildRoot=process.env.M1_BUILD_ROOT;
assert.ok(buildRoot,'M1_BUILD_ROOT required');
const out=path.join(root,'docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/evidence-M1');
const fixture='/Users/weiwei/.codex/research/reference-mechanics-2026-10-25/native-rendering-Kl9gcQ/exact-goat-fat.save.txt';
const encoded=await readFile(fixture,'utf8');
const save=JSON.parse(Buffer.from(encoded.split(':').slice(1).join(':'),'base64').toString('utf8'));
save.saved_at=Date.now(); // avoid unrelated away-time progression in this synthetic life
const server=createServer(async(req,res)=>{
 try {
  let file=path.resolve(buildRoot,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(buildRoot+'/')) throw Error('outside root');
  if((await stat(file)).isDirectory()) file=path.join(file,'index.html');
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
 } catch {res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const errors=[];
try {
 browser=await launchChrome();
 const context=await browser.newContext({viewport:{width:1920,height:1080}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(data=>localStorage.setItem('save data',JSON.stringify(data)),save);
 const origin=`http://127.0.0.1:${server.address().port}`;
 await page.goto(origin+'/?test_hooks=1');
 await page.getByText('PLAY',{exact:true}).click();
 if(await page.getByText('Confirm',{exact:true}).isVisible()) await page.getByText('Confirm',{exact:true}).click();
 await page.waitForFunction(()=>window.simulationTestHooks);
 await page.evaluate(()=>{simulationTestHooks.pause();window.openCraftingWindow();window.switchCraftingRecipesPage('cooking');});
 await page.locator('[data-crafting_category="cooking"] [data-recipe_id="Render animal fat from Goat meat"]').click();
 const detail=page.locator('#crafting_detail');await detail.waitFor({state:'visible'});
 const before=await page.evaluate(()=>simulationTestHooks.snapshot());
 const text=await detail.innerText();assert.match(text,/Goat meat/);assert.match(text,/4/);
 await page.screenshot({path:path.join(out,'desktop-1920.png')});
 const buttons=await detail.getByRole('button').allTextContents();
 const craft=detail.getByRole('button',{name:/^Craft 1/}).first();
 await craft.click();
 await page.waitForFunction(n=>simulationTestHooks.snapshot().total_crafting_attempts>n,before.total_crafting_attempts);
 const after=await page.evaluate(()=>simulationTestHooks.snapshot());
 const items=s=>s.inventories.person.main_character;
 const count=(s,id)=>items(s)[JSON.stringify({id})]?.count||0;
 assert.equal(count(before,'Goat meat')-count(after,'Goat meat'),4);
 assert.equal(count(before,'Boar meat'),count(after,'Boar meat'));
 assert.equal(count(after,'Animal fat')-count(before,'Animal fat'),1);
 const afterText=await detail.innerText();assert.match(afterText,/Missing|need|material|0 ready/i);
 await page.screenshot({path:path.join(out,'after-1920.png')});
 assert.deepEqual(errors,[]);
 const bundleHash=createHash('sha256').update(await readFile(path.join(buildRoot,'dist/bundle.js'))).digest('hex');
 await writeFile(path.join(out,'browser-result.json'),JSON.stringify({fixture,origin,route:'named existing synthetic ordinary native rendering fixture',viewport:'1920x1080',bundleHash,beforeText:text,afterText,buttons,
   goatSpent:4,boarUnchanged:true,fatProduced:1,errors,highestState:'agent-verified, not human-reviewed',persistence:'no schema/state format change in M1; no new literal round trip claimed'},null,2)+'\n');
 console.log('PASS rebuilt rendering: 4 Goat spent, Boar unchanged, actual fat +1, populated desktop, zero page errors');
 await context.close();
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
