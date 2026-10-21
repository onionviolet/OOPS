// Rebuilt native UI journey on disposable fixture stock. Never opens a personal save.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const out=resolve(process.argv[2]||'/tmp/oops-gear-depth-browser');await mkdir(out,{recursive:true});
const server=await serve(resolve('.')),s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:15000});
let p;const checks=[],key=id=>JSON.stringify({id}),part=id=>JSON.stringify({id,quality:100});
const spare=JSON.stringify({components:{head:'Cheap iron short blade',handle:'Simple wooden short handle'},quality:80});
const armor=JSON.stringify({components:{internal:'Leather vest',external:'Steel chainmail vest'},quality:150});
const base=JSON.stringify({components:{head:'Cheap iron short blade',handle:'Simple wooden short handle'},quality:100});
async function play(){await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.locator('#loading_screen_play_button').click();await p.waitForFunction(()=>typeof simulationTestHooks==='object',null,{timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(300);}
async function workshop(){await p.locator('#workspace_navigation select').first().selectOption('gear-workshop');await p.locator('#gear_workshop').waitFor({state:'visible'});}
const input=label=>p.getByRole('combobox',{name:label,exact:true});
const currentKey=()=>input('Carried gear').inputValue();
async function runProcess(action,{material,role,slot}={}){
 await input('Gear process').selectOption(action);if(material)await input('Process material').selectOption(material);if(role)await input('Material role').selectOption(role);if(slot)await input('Structural component').selectOption(slot);
 await p.locator('[data-gear-commit]').click();await p.waitForTimeout(100);return currentKey();
}
async function retained(k){const save=await s.save(),wear=save.equipment_durability.condition[k];assert.ok(save.inventories.person.main_character[k]);return {work:JSON.parse(k).gearwork,wear};}
try{
 await s.start();const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities?.recipe?.undefined;if(seed.availabilities?.recipe)delete seed.availabilities.recipe['recipe/undefined'];seed.equipment_durability.enabled=true;seed.global_flags.is_crafting_unlocked=true;seed.availabilities.dialogue.oldCraftsman=1;seed.character.money=1000;
 for(const [k,c] of [[spare,1],[armor,1],[base,1],[part('Simple wooden short handle'),2],[part('Cheap iron short blade'),8],[key('Charcoal'),8],[key('Lamp oil'),2],[key('Iron ingot'),5]])seed.inventories.person.main_character[k]={count:c};
 await s.open(seed);p=s.page;
 await p.evaluate(()=>window.startTrade('villageTrader'));
 const gemRow=p.locator('#trader_inventory_div > [data-trader_item]').filter({hasText:'Cloudy quartz setting'}).first();await gemRow.click();await p.locator('#accept_trade_button').click();await p.locator('#center_mode_back').click();
 const purchased=Object.keys((await s.save()).inventories.person.main_character).find(k=>JSON.parse(k).id==='Cloudy quartz setting');assert.ok(purchased);
 checks.push('Actual native merchant purchase acquires the ordinary gemstone setting; no gem was injected into carried stock');
 await workshop();await input('Carried gear').selectOption(base);
 let k=await runProcess('attach',{material:part('Simple wooden short handle'),role:'grip'});assert.ok(JSON.parse(k).e2_instance);assert.equal(JSON.parse(k).gearwork.roles.grip.grade,1);
 checks.push('Actual workshop controls consume a native component, assign identity and show sourced handling plus mass cost');
 const id=JSON.parse(k).e2_instance;k=await runProcess('heat');k=await runProcess('shape');k=await runProcess('quench',{material:key('Lamp oil')});assert.equal(JSON.parse(k).gearwork.treatment.stage,'quenched');k=await runProcess('temper');
 assert.equal(JSON.parse(k).gearwork.treatment.stage,'tempered');assert.equal(JSON.parse(k).e2_instance,id);checks.push('Native stock-funded heat/shape/oil-quench/temper retains identity and physical tradeoffs');
 k=await runProcess('socket',{material:key('Iron ingot')});k=await runProcess('attach',{material:purchased,role:'setting'});
 assert.equal(JSON.parse(k).gearwork.roles.setting.name,'Cloudy quartz setting');
 checks.push('Actual rigid mount construction and typed gem installation consume owned inputs and add a native equipment contribution');
 await input('Maker').selectOption('oldCraftsman');const beforeCommission=await s.save(),npcBefore=beforeCommission.inventories.person.oldCraftsman[key('Charcoal')]?.count||0;
 k=await runProcess('reforge',{material:part('Cheap iron short blade')});
 assert.equal(JSON.parse(k).gearwork.history.at(-1).maker,'oldCraftsman');assert.equal((await s.save()).inventories.person.oldCraftsman[key('Charcoal')].count,npcBefore+1);
 checks.push('Actual old-craftsman commission uses his native capability and transfers the quoted service fee into his own native stock');
 await input('Maker').selectOption('player');
 const damaged=await s.save();damaged.equipment_durability.condition[k]=35;await s.open(damaged);p=s.page;await workshop();await input('Carried gear').selectOption(k);
 k=await runProcess('repair',{material:part('Cheap iron short blade')});assert.equal((await s.save()).equipment_durability.condition[k],100);
 k=await runProcess('swap',{material:part('Cheap iron short blade'),slot:'head'});assert.equal(JSON.parse(k).e2_instance,id);
 checks.push('Native material repair restores fixture-damaged condition, and actual component replacement preserves the same item identity');
 await p.screenshot({path:join(out,'workshop-1920.png')});
 const expected=await retained(k);await p.reload();await play();await workshop();await input('Carried gear').selectOption(k);assert.deepEqual(await retained(k),expected);
 const literal=await p.evaluate(()=>save_to_file());assert.equal(typeof literal,'string');await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();await workshop();await input('Carried gear').selectOption(k);assert.deepEqual(await retained(k),expected);
 checks.push('Actual Save/reload/Export/literal Import preserves worked item key, history, material roles and condition');
 // Native equipment control, rather than assigning a stat directly.
 const gearRows=p.locator('#inventory_content_div > [data-character_item]');const gi=await gearRows.evaluateAll((rows,k)=>rows.findIndex(r=>r.getAttribute('data-character_item')===k),k);assert.ok(gi>=0);const row=gearRows.nth(gi);
 await row.click({button:'right'});await p.getByRole('menuitem',{name:'Equip',exact:true}).click();
 const equipped=await s.save();assert.equal(equipped.character.equipment.weapon.inventory_key,k);
 await p.reload();await play();const afterEquip=await s.save();assert.equal(afterEquip.character.equipment.weapon.inventory_key,k);checks.push('Native equip and equipped save reload retain the exact worked key');
 await workshop();await input('Carried gear').selectOption(armor);await input('Maker').selectOption('oldCraftsman');
 const draws=JSON.stringify((await s.save()).expansion.streams);await input('Gear process').selectOption('reforge');await input('Process material').selectOption(part('Cheap iron short blade'));
 assert.equal(JSON.stringify((await s.save()).expansion.streams),draws,'preview must not draw');
 const ak=await runProcess('reforge',{material:part('Cheap iron short blade')});const affixes=JSON.parse(ak).affixes;assert.ok(affixes?.length);
 const ar=p.locator('#inventory_content_div > [data-character_item]');const ai=await ar.evaluateAll((rows,k)=>rows.findIndex(r=>r.getAttribute('data-character_item')===k),ak);assert.ok(ai>=0);
 assert.match(await ar.nth(ai).innerHTML(),/resolved when made/);await ar.nth(ai).hover();await p.screenshot({path:join(out,'affixed-armor-tooltip.png')});
 const beforeArmor=await retained(ak);await p.reload();await play();await workshop();assert.deepEqual(await retained(ak),beforeArmor);
 const exportArmor=await p.evaluate(()=>save_to_file());await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),exportArmor)]);await play();await workshop();assert.deepEqual(await retained(ak),beforeArmor);assert.deepEqual(JSON.parse(ak).affixes,affixes);
 checks.push('Native paid armor reforge commits stored affixes, preview draws nothing, inventory tooltip shows resolved facts, and save/reload/export/import retains the result');

 await input('Maker').selectOption('player');await input('Carried gear').selectOption(spare);
 const salvageBefore=await s.save(),returned=['Cheap iron short blade','Simple wooden short handle'].map(id=>JSON.stringify({id,quality:40}));
 await runProcess('salvage');const salvageAfter=await s.save();assert.equal(salvageAfter.inventories.person.main_character[spare],undefined);
 for(const rk of returned)assert.equal(salvageAfter.inventories.person.main_character[rk].count,(salvageBefore.inventories.person.main_character[rk]?.count||0)+1);
 assert.equal(await input('Carried gear').locator('option').evaluateAll((rows,k)=>rows.some(r=>r.value===k),spare),false);assert.equal(await p.locator('[data-gear-commit]').isDisabled(),true);
 assert.deepEqual((await s.save()).inventories.person.main_character,salvageAfter.inventories.person.main_character);
 checks.push('Actual native dismantle consumes a spare assembly, returns both parts at degraded quality and removes the spent choice so repeat cannot duplicate returns');

 for(const size of [14,21]){
  const view=await s.save();view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);p=s.page;await workshop();
  for(const [width,height] of [[1920,1080],[1536,864]]){await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`workshop-${size}-${width}.png`)});}
 }
 checks.push('Actual 14px and 21px typography at 1920×1080 and 1536×864 retains document width');
 await writeFile(join(out,'receipt.json'),JSON.stringify({checks,errors:s.errors,fixture:'Native midgame fixture stock; acquisition and natural pacing remain separate acceptance gates.'},null,2));console.log(JSON.stringify({checks,out,errors:s.errors}));
}catch(e){await writeFile(join(out,'failure.txt'),e.stack||String(e));await writeFile(join(out,'errors.json'),JSON.stringify(s.errors,null,2));await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}finally{await s.close();await server.close();}
