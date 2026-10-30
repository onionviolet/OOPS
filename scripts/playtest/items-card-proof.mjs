// Item card proof (ITEMS.md): fresh life -> carried pants card against an empty slot; equip, then a better pair against a worn one.
// Plus the gallery states (appraisal levels). 1920x1080, Luminous default; headless; temp bundle, no tracked dist writes.
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {readFile} from 'node:fs/promises';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {buildBundle,serve,Session} from './lib.mjs';
const out=resolve(process.argv[2]||'docs/representations/evidence/items');await mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir),s=new Session({url:server.url,seed:87,wall:Date.UTC(2026,9,30,9)});
const receipt={viewport:'1920x1080',cases:[]};let p;
try{
 await s.start();await s.open();p=s.page;
 p.setDefaultTimeout(30000);await p.setViewportSize({width:1920,height:1080});
 const row=p.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'}).first();
 await row.click();await p.waitForTimeout(500);
 const card=p.locator('#proto23_item_detail .item-card, .item-card').first();await card.waitFor({state:'visible'});
 const first=await card.innerText();assert.match(first,/Nothing worn in legs/);assert.match(first,/trash · 40%/i);
 receipt.cases.push({case:'fresh life, nothing worn',text:first});
 await p.screenshot({path:join(out,'fresh-life-1920.png')});
 await card.screenshot({path:join(out,'fresh-life-card.png')});
 assert.equal(await p.locator('.shell-item-fulltext').count()>0,true,'text form kept');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 // A declared test stock: pants at two qualities. Wear the better, then inspect the worse against it.
 const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));seed.customization=defaultCustomizationState();delete seed.availabilities.recipe.undefined;
 for(const quality of [60,140])seed.inventories.person.main_character[JSON.stringify({id:'Cheap leather pants',quality})]={count:1};
 await s.open(seed);p=s.page;p.setDefaultTimeout(30000);
 await p.locator('#inventory_content_div > [data-item_quality="140"] .item_name').first().click();await p.getByRole('button',{name:'Equip',exact:true}).click();await p.waitForTimeout(500);
 await p.locator('#inventory_content_div > [data-item_quality="60"] .item_name').first().click();await p.waitForTimeout(500);
 const c2=p.locator('.item-card').first();await c2.waitFor({state:'visible'});const second=await c2.innerText();
 assert.match(second,/Compared with your/);receipt.cases.push({case:'60% pants against worn 140% pants',text:second});
 await p.screenshot({path:join(out,'vs-worn-1920.png')});await c2.screenshot({path:join(out,'vs-worn-card.png')});
 assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'||!/404/.test(e.text)),[],'only missing optional resources (404) tolerated');receipt.result='PASS';
}catch(e){receipt.failure=e.stack;await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));
 // gallery states
 try{const g=await s.browser.newPage({viewport:{width:1920,height:1080}});await g.goto(server.url.replace('?test_hooks=1','item-card-gallery.html'));await g.waitForSelector('.item-card');await g.screenshot({path:join(out,'gallery-1920.png'),fullPage:true});await g.goto(server.url.replace('?test_hooks=1','item-card-gallery.html?effects=off'));await g.waitForSelector('.item-card');await g.screenshot({path:join(out,'gallery-effects-off.png'),fullPage:true});}catch(e){receipt.galleryError=String(e);await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));}
 await s.close();server.close();await bundle.dispose();}
console.log(JSON.stringify({result:receipt.result,out}));
