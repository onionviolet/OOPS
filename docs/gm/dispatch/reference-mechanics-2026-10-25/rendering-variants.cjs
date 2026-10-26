const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('rendering-variants',async h=>{
 const {p,assert,fs,boot,load,save,roundtrip,quota,gates}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const prefix=process.env.RENDERING_PREFIX;if(!prefix)throw Error('RENDERING_PREFIX must name the earned rendering export.');
 let s=JSON.parse(Buffer.from(fs.readFileSync(prefix,'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString());
 for(const [id,count]of [['Crab meat',10],['Frog meat',9]]){s.inventories.person.main_character[JSON.stringify({id})]={count};s.item_log[id]={id,number:count,quality_highest:0,quality_lowest:0};}
 await load(s,'earned-methods-ordinary-crab-frog-stock');
 const select=async id=>{await p.evaluate(()=>{window.openCraftingWindow();window.switchCraftingRecipesPage('cooking');});await p.locator(`.crafting_recipe_list:visible [data-recipe_id=${JSON.stringify('Render animal fat from '+id)}] .recipe_item_name`).click();};
 const count=(s,id)=>s.inventories.person.main_character[JSON.stringify({id})]?.count??0;
 await select('Crab meat');await quota('#crafting_detail [data-craft-commit]');await select('Crab meat');
 s=await save();assert.equal(count(s,'Crab meat'),10);assert.equal(count(s,'Animal fat'),0);
 await p.locator('[data-craft-commit]:visible').click();s=await save();assert.equal(count(s,'Crab meat'),0);assert.equal(count(s,'Animal fat'),1);assert.equal(count(s,'Goat meat'),4);
 await roundtrip('crab-contribution-exact-cost',s=>s.inventories.person.main_character);
 await select('Frog meat');assert.equal(await p.locator('[data-craft-commit]:visible').isEnabled(),false);
 const before=await save();await p.evaluate(()=>window.useRecipe(document.querySelector('.crafting_recipe_list [data-recipe_id="Render animal fat from Frog meat"] .recipe_item_name'),1));
 s=await save();assert.deepEqual(s.inventories.person.main_character,before.inventories.person.main_character,'insufficient chosen source never falls back to goat or boar');
 s.inventories.person.main_character[JSON.stringify({id:'Frog meat'})].count=10;await load(s,'one-additional-ordinary-frog-meat');await select('Frog meat');await p.locator('[data-craft-commit]:visible').click();s=await save();
 assert.equal(count(s,'Frog meat'),0);assert.equal(count(s,'Animal fat'),2);assert.equal(count(s,'Goat meat'),4);assert.equal(count(s,'Boar meat'),30);
 await roundtrip('frog-contribution-exact-cost',s=>s.inventories.person.main_character);
 gates.push('Actual crab and frog craft costs/output, known-method prefix with labelled ordinary source stock, quota-failed crab craft rolls back, insufficient frog direct command spends nothing and never substitutes another source.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
