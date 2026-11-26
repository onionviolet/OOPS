// Bounded renderer proof, not an earned loot route. Native item copies are setup;
// the normal save loader, inventory renderer and actual Item glow control do the work.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {Session,serve} from '../../../scripts/playtest/lib.mjs';

const directory=resolve('docs/audits/discord_absorption_2026-10-21/glow-2026-11-25');
await mkdir(directory,{recursive:true});
const bundle=resolve(process.argv[2]||'.lane-builds/discord-glow-20261125/dist');
const fixture=JSON.parse(await readFile('tests/fixtures/perf/fresh.json','utf8'));
const variants=[40,80,110,140,180,220,250];
for(const quality of variants)fixture.inventories.person.main_character[JSON.stringify({id:'Cheap leather pants',quality})]={count:1};
const server=await serve(bundle);
const session=await new Session({url:server.url,seed:41,wall:Date.UTC(2026,10,25,15),opTimeout:15000}).start();
const snapshot=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const measure=()=>session.page.evaluate(()=>({
 glow:document.documentElement.dataset.feelGlow,
 rows:[...document.querySelectorAll('#inventory_div .inventory_item_control[data-feel-rarity]')].map(row=>({
  rarity:row.dataset.feelRarity,name:row.querySelector('.item_name')?.textContent,
  quality:row.querySelector('[data-rarity]')?.textContent,boxShadow:getComputedStyle(row).boxShadow,
  animation:getComputedStyle(row).animationName,
  title:row.querySelector('[data-rarity]')?.title,
  color:getComputedStyle(row.querySelector('[data-rarity]')).color,
 }))}));
try{
 await session.open(fixture);
 const page=session.page;
 await page.waitForFunction(()=>document.querySelectorAll('#inventory_div .inventory_item_control[data-feel-rarity]').length>=7);
 const before=await snapshot(),on=await measure();
 assert.equal(on.glow,'on','fresh per-browser preference uses the actual default');
 const expected=['trash','common','uncommon','rare','epic','legendary','mythical'];
 assert.deepEqual(on.rows.map(row=>row.rarity).sort(),expected.toSorted());
 await page.screenshot({path:join(directory,'item-glow-on-1920.jpg'),type:'jpeg',quality:90});
 await page.getByRole('combobox',{name:'Other known panels'}).selectOption('customization-effects');
 const control=page.locator('[data-display-setting="panel.feel.glow"]');
 await control.evaluate(node=>{for(let parent=node.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;});
 assert.equal(await page.getByLabel('Item glow',{exact:true}).inputValue(),'on');
 await control.scrollIntoViewIfNeeded();
 await page.screenshot({path:join(directory,'item-glow-setting-1920.jpg'),type:'jpeg',quality:90});
 await control.selectOption('off');
 await page.getByRole('button',{name:/Back to Village/}).click();
 await page.waitForFunction(()=>document.documentElement.dataset.feelGlow==='off');
 const off=await measure();
 await page.screenshot({path:join(directory,'item-glow-off-1920.jpg'),type:'jpeg',quality:90});
 for(const rarity of expected){
  const a=on.rows.find(row=>row.rarity===rarity),b=off.rows.find(row=>row.rarity===rarity);
  assert.equal(a.quality,b.quality);assert.equal(a.color,b.color);
  if(['trash','common'].includes(rarity))assert.equal(a.boxShadow,b.boxShadow,rarity+' plain control');
  else assert.notEqual(a.boxShadow,b.boxShadow,rarity+' changes under the actual setting');
  assert.equal(a.animation,'none','rarity halo is static');
 }
 const after=await snapshot();
 assert.deepEqual(after.inventories,before.inventories);
 assert.equal(after.character.money,before.character.money);
 assert.deepEqual(after['current time'],before['current time']);
 assert.deepEqual(session.errors.filter(error=>error.kind==='pageerror'),[]);
 assert.equal((await session.uiCheck()).pageOverflow,0);
 const result={status:'passed',viewport:{width:1920,height:1080},
  bundleSha256:createHash('sha256').update(await readFile(join(bundle,'bundle.js'))).digest('hex'),
  setup:'Disposable perf/fresh.json copy; seven native item qualities added before normal save load. No earned loot claim or DOM rarity/style injection.',
  setting:{label:'Item glow',default:'on',changedThroughActualControl:true},on,off,
  inventoryUnchanged:true,moneyUnchanged:true,clockUnchanged:true,pageErrors:0,pageOverflow:0,
  scope:'Static native rarity row glow, real per-browser on/off. No animation capture or live Discord crawl.'};
 await writeFile(join(directory,'proof.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({status:result.status,bundleSha256:result.bundleSha256,rarities:expected,output:directory}));
}catch(error){
 console.error(error.stack);
 await session.page.screenshot({path:join(directory,'failure.jpg'),type:'jpeg',quality:85});
 console.error(await session.page.locator('[data-display-setting="panel.feel.glow"]').evaluate(node=>{
  const rows=[];for(let p=node;p;p=p.parentElement)rows.push({tag:p.tagName,id:p.id,hidden:p.hidden,display:getComputedStyle(p).display,class:p.className});return rows;
 }).catch(()=>[]));
 console.error(session.errors.filter(e=>!e.text.includes('404')).slice(-4));throw error;
}
finally{server.close();await session.browser?.close();}
