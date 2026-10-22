import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/oops-inventory-proof');await mkdir(out,{recursive:true});
const server=await serve(root),receipt={root,setup:'Fresh origin; declared mixed native test stock and an original public structured-equipment test pack; no personal saves or natural-acquisition claim.',cases:[],checks:[]};
const key=id=>JSON.stringify({id});
const pack={schema:2,id:'inventory-proof',revision:1,compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock'],world:{id:'inventory-proof.world',label:'Inventory test room'},locations:[{id:'inventory-proof.room',label:'Fitting room',description:'Original verification fixture.'}],items:[4,8].map(n=>({id:'inventory-proof.coat'+n,label:'Test coat '+n,description:'Known original test clothing.',equipment:{slot:'torso',baseDefense:n,weight:n,layer:1,coverage:{chest:1},forms:['human']}})),simulation:{people:[]},presentation:{people:{},status:[]},starts:[{id:'inventory-proof.start',locationId:'inventory-proof.room',description:'Original test beginning.',body:{id:'inventory-proof.body',form:'human',ownerId:'player',controllerId:'player',hands:2},effects:[4,8].map(n=>({type:'item',actor:'player',key:key('inventory-proof.coat'+n),amount:1}))}]};
const s=new Session({url:server.url+'?test_hooks=1&structured_candidate=inventory-proof',seed:87,wall:Date.UTC(2026,9,21,15),hooks:{beforeOpen:async context=>{
 await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:['inventory-proof/pack.json']}}));
 await context.route('**/private_packs/inventory-proof/pack.json',r=>r.fulfill({json:pack}));
}}});let p,phase='start';
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));seed.customization=defaultCustomizationState();delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];seed.inventories.person.main_character={};
for(let quality=10;quality<=150;quality+=5)seed.inventories.person.main_character[JSON.stringify({id:'Cheap leather pants',quality})]={count:1};
for(const [id,count]of [['Stale bread',5],['Rat meat chunks',2],['ABC for kids',1],['Rough wood log',7]])seed.inventories.person.main_character[key(id)]={count};
async function replay(){await p.waitForFunction(()=>typeof window.simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(450);}
async function persist(label){await p.locator('#save_button').click();const before=await s.save();await p.reload();await replay();let saved=await s.save();assert.deepEqual(saved.inventories,before.inventories);const literal=await p.evaluate(()=>save_to_file());await writeFile(join(out,'native-export.txt'),literal);await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(join(out,'native-export.txt'))]);await replay();saved=await s.save();assert.deepEqual(saved.inventories,before.inventories);assert.deepEqual(saved.character.equipment,before.character.equipment);receipt.checks.push(label+': actual Save/reload/Export/literal-file Import retains native stock/equipment');}
try{
 await s.start();
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1800,1040,21],[1536,864,14],[1536,864,21]]){
 phase=`mixed stock ${width}/${size}`;const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;await s.open(f);p=s.page;await p.setViewportSize({width,height});await p.waitForTimeout(450);
 const rows=p.locator('#inventory_content_div > .inventory_item_control');assert.equal(await rows.count(),33);
 await p.locator('[data-control-box="inventory"] > button').click();const find=p.getByRole('searchbox',{name:'Find inventory item',exact:true});
 await find.fill('pants');await p.getByRole('combobox',{name:'Quality',exact:true}).selectOption('125');await p.waitForTimeout(200);assert.equal(await rows.evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length),6);
 await find.fill('');await p.getByRole('combobox',{name:'Quality',exact:true}).selectOption('all');await p.getByRole('combobox',{name:'Item kind',exact:true}).selectOption('book');assert.equal(await rows.evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length),1);
 await p.getByRole('combobox',{name:'Item kind',exact:true}).selectOption('all');await p.keyboard.press('Escape');
 await rows.locator('.item_name').filter({hasText:'Cheap leather pants'}).last().click();
 await p.locator('[data-workspace-action="expand"][data-module="belongings"]').click();await p.waitForTimeout(550);
 const inspector=p.getByRole('region',{name:'Selected inventory item',exact:true});await inspector.waitFor({state:'visible'});assert.match(await inspector.innerText(),/150%/);
 await p.screenshot({path:join(out,`expanded-${width}-${size}.png`)});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const geometry=await p.evaluate(()=>{const a=document.querySelector('#inventory_content_div').getBoundingClientRect(),b=document.querySelector('.inventory-workbench-inspection').getBoundingClientRect();return {list:{x:a.x,width:a.width,height:a.height},inspection:{x:b.x,width:b.width,height:b.height},overlap:a.right>b.left+1};});assert.equal(geometry.overlap,false);assert(geometry.list.height>200&&geometry.list.height<height);assert(geometry.inspection.height<height);assert(geometry.list.width>200);
 const selected=rows.locator('.item_name').filter({hasText:'Cheap leather pants'}).last();const b=await selected.boundingBox(),l=await p.locator('#inventory_content_div').boundingBox();assert(b.y>=l.y&&b.y+b.height<=l.y+l.height+1);
 await selected.focus();await p.waitForTimeout(450);receipt.cases.push({width,height,size,geometry});await p.keyboard.press('Escape');
 }
 phase='batch chest';const f=structuredClone(seed);f['current location']='Shack';f.availabilities.location.Shack=1;f.locations.Shack={...f.locations.Shack,housing_unlocked:true};f.customization.profiles.Default.settings.typography.size=21;await s.open(f);p=s.page;
 await p.locator('#open_storage_div').click();const batch=p.locator('.storage-batch');await batch.locator('summary').click();
 const choose=async name=>batch.locator('.storage-batch-list label').filter({hasText:name}).locator('input[type="checkbox"]').check();
 await choose('Stale bread');await choose('Rough wood log');await batch.getByRole('button',{name:'Review transfer',exact:true}).click();assert.match(await batch.locator('[role=status]').innerText(),/2 stacks, 12 items/);
 const before=await s.save();await batch.getByRole('button',{name:'Cancel selection',exact:true}).click();assert.deepEqual((await s.save()).inventories,before.inventories);
 await choose('Stale bread');await choose('Rough wood log');await batch.getByRole('button',{name:'Review transfer',exact:true}).click();
 // A normal single-stack command changes sequence while the review remains open.
 await p.getByRole('combobox',{name:'Compare carried and chest item'}).selectOption(key('Stale bread'));await p.locator('[data-storage-compare="deposit"]').click();const stale=await s.save();await batch.getByRole('button',{name:'Confirm transfer',exact:true}).click();assert.deepEqual((await s.save()).inventories,stale.inventories);assert.match(await batch.locator('[role=status]').innerText(),/Nothing moved/);
 await batch.getByRole('button',{name:'Review transfer',exact:true}).click();await batch.getByRole('button',{name:'Confirm transfer',exact:true}).click();assert.match(await batch.locator('[role=status]').innerText(),/complete/);
 let saved=await s.save();assert.equal(saved.inventories.person.main_character[key('Rough wood log')],undefined);assert.equal(saved.inventories.storage.player[key('Rough wood log')].count,7);await p.screenshot({path:join(out,'batch-chest-21.png')});await persist('Atomic reviewed batch');
 receipt.checks.push('Batch review/cancel is pure; a real intervening command rejects stale review without partial transfer; renewed exact batch succeeds');
 phase='structured comparison';await s.open();p=s.page;await p.locator('#workspace_navigation select').first().selectOption('beginning');await p.locator('[data-structured-begin]').click();await p.waitForTimeout(650);await p.keyboard.press('Escape');
 let a=p.locator('#inventory_content_div .item_name').filter({hasText:'Test coat 4'});await a.click();await p.getByRole('button',{name:'Equip',exact:true}).click();await p.waitForTimeout(500);
 const defense=()=>p.locator('#defense_slot').innerText();const d1=await defense();await p.locator('#inventory_content_div .item_name').filter({hasText:'Test coat 8'}).click();await p.waitForTimeout(500);assert.match(await p.locator('#proto23_item_detail .worn-comparison').innerText(),/Equipment defense: 4 → 8/);await p.screenshot({path:join(out,'structured-comparison.png')});await p.getByRole('button',{name:'Equip',exact:true}).click();await p.waitForTimeout(500);assert.notEqual(await defense(),d1);await persist('Native structured equip comparison');receipt.checks.push('Original public test pack: actual structured comparison predicts4→8 equipment defense, then native Equip changes the worn consumer');
 assert.deepEqual(s.errors,[]);receipt.result='PASS';
}catch(e){receipt.failure={phase,error:e.stack};await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}
finally{receipt.errors=s.errors;await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));await s.close();await server.close();}
console.log(JSON.stringify({result:receipt.result,cases:receipt.cases.length,checks:receipt.checks,out}));
