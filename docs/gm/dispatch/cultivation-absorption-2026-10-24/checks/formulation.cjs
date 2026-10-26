const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('formulation',async h=>{
 const {p,assert,boot,load,save,played,roundtrip,gates,path,out}=h;
 await p.setViewportSize({width:1920,height:1080});let s=await boot();
 // Ordinary prerequisite stock fixture, never a granted crafted product, grade,
 // conditioning, impurity, treatment or new progression counter.
 s.inventories.person.main_character['{"id":"Charcoal"}']={count:20};s.inventories.person.main_character['{"id":"Iron ingot"}']={count:2};await load(s,'ordinary-prerequisite-stock');
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');await open();
 for(let i=0;i<8;i++)await p.locator('#crafting_gather').click();s=await save();
 const mats=Object.keys(s.inventories.person.main_character).filter(k=>JSON.parse(k).materialRef),get=id=>s.crafting.materials[JSON.parse(id).materialRef];
 const herb=mats.find(k=>get(k).family==='reedherb'),salt=mats.find(k=>get(k).family==='riversalt');assert.ok(herb&&salt,'ordinary harvest produces both formulation inputs');
 const choose=async key=>{const n=p.locator('[data-craft-material]').filter({hasNot:p.locator('none')});await p.locator(`[data-craft-material=${JSON.stringify(key)}]`).check();};
 await choose(salt);await choose(herb);await p.locator('#crafting_layered').check();await p.locator('#crafting_heat').fill('10');await p.locator('#crafting_heat').dispatchEvent('change');
 await p.locator('#crafting_engine_home [data-craft-commit]').click();s=await save();const product=Object.values(s.crafting.products).find(p=>p.order);
 assert.ok(product);assert.equal(product.order[0],JSON.parse(salt).materialRef);assert.ok(product.thermal.residual>0);assert.equal(s.inventories.person.main_character['{"id":"Charcoal"}'].count,19);
 await p.locator('[data-craft-treatment="apparatus"]').click();await p.locator('#crafting_tablet').check();
 // Select a remaining herb lot after the first batch spent its exact source lot.
 s=await save();const nextHerb=Object.keys(s.inventories.person.main_character).find(k=>s.crafting.materials[JSON.parse(k).materialRef]?.family==='reedherb');assert.ok(nextHerb);
 for(const n of await p.locator('[data-craft-material]:checked').all())await n.uncheck();
 await choose(nextHerb);
 await p.locator('#crafting_heat').fill('2');await p.locator('#crafting_heat').dispatchEvent('change');
 await p.locator('#crafting_engine_home [data-craft-commit]').click();s=await save();const tabletKey=Object.keys(s.inventories.person.main_character).find(k=>s.crafting.products[JSON.parse(k).productRef]?.outputs.permanent);assert.ok(tabletKey);
 await p.locator(`[data-crafted-use=${JSON.stringify(tabletKey)}]`).click();s=await save();assert.ok(s.craftDepth.body.conditioning>0);assert.ok(s.craftDepth.body.impurity>0);
 assert.match(await p.locator('body').textContent(),/Herbal conditioning/);
 await p.locator('[data-craft-treatment="purge"]').click();s=await save();assert.equal(s.craftDepth.body.job.kind,'purge');
 await roundtrip('pending-body-treatment',s=>({body:s.craftDepth.body,products:s.crafting.products}));await played(12);s=await save();assert.equal(s.craftDepth.body.job,null);assert.equal(s.craftDepth.body.impurity,0);
 await open();await p.locator('[data-craft-treatment="capacity"]').click();await played(24);s=await save();assert.equal(s.craftDepth.body.capacity,25);
 await roundtrip('completed-body-treatment',s=>({body:s.craftDepth.body,products:s.crafting.products}));await open();await p.screenshot({path:path.join(out,'formulation-1920.png')});
 gates.push('Actual gather/order/heat/fuel/product provenance; body tablet native stamina bucket; funded timed purge/capacity; ordinary stock fixture only');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
