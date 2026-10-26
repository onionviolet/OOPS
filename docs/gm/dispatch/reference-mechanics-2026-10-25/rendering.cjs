const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('native-rendering',async h=>{
 const {p,assert,boot,load,save,played,roundtrip,gates,path,out}=h;
 await p.setViewportSize({width:1920,height:1080});let s=await boot();
 s.global_flags.is_crafting_unlocked=true;
 s.levels.person.main_character.skill_xp.Cooking=500000;
 s.levels.person.main_character.skill_xp.Alchemy=500000;
 s.availabilities.skill.Cooking=1;s.availabilities.skill.Alchemy=1;s.availabilities.skill.Literacy=1;
 for(const [id,count] of [['Butchering and you',1],['Medicine for dummies',1],['Goat meat',8],['Boar meat',30],['Oneberry',10],['Golmoon leaf',5]]){
  s.inventories.person.main_character[JSON.stringify({id})]={count};
  s.item_log[id]={id,number:count,quality_highest:0,quality_lowest:0};
 }
 await load(s,'ordinary-stock-unread-method-books');
 const open=async()=>{await p.evaluate(()=>{window.openCraftingWindow();window.switchCraftingRecipesPage('cooking');});};
 const row=id=>p.locator(`.crafting_recipe_list:visible [data-recipe_id=${JSON.stringify(id)}]`);
 await open();assert.equal(await row('Render animal fat from Goat meat').isVisible(),false);
 await p.evaluate(()=>{window.closeCraftingWindow();window.start_reading('Butchering and you');});await played(900);
 s=await save();assert.ok(s.availabilities.recipe['Animal fat']);
 await open();assert.equal(await row('Render animal fat from Crab meat').isVisible(),false,'unseen source remains hidden');
 await row('Render animal fat from Goat meat').locator('.recipe_item_name').click();
 assert.match(await p.locator('[data-craft-detail]:visible').innerText(),/4.*selected|4 per attempt/);
 const before=await save();await p.locator('[data-craft-commit]:visible').click();s=await save();
 const count=(s,id)=>s.inventories.person.main_character[JSON.stringify({id})]?.count??0;
 assert.equal(count(s,'Goat meat'),count(before,'Goat meat')-4);assert.equal(count(s,'Boar meat'),30);assert.equal(count(s,'Animal fat'),1);
 await roundtrip('exact-goat-fat',s=>({inventory:s.inventories.person.main_character,method:s.availabilities.recipe['Animal fat']}));
 await p.evaluate(()=>window.start_reading('Medicine for dummies'));await played(1100);s=await save();assert.ok(s.availabilities.recipe['Healing balm']);
 await p.evaluate(()=>{window.openCraftingWindow();window.switchCraftingRecipesPage('alchemy');});
 await row('Healing balm').locator('.recipe_item_name').click();await p.locator('[data-craft-commit]:visible').click();s=await save();
 assert.equal(count(s,'Animal fat'),0);assert.equal(count(s,'Healing balm'),1);
 await roundtrip('rendered-fat-used-in-balm',s=>s.inventories.person.main_character);
 await open();await row('Render animal fat from Goat meat').locator('.recipe_item_name').click();
 for(const [width,height,size]of [[1920,1080,14],[1536,864,14],[1536,864,21]]){
  await p.setViewportSize({width,height});await p.evaluate(size=>document.querySelector('#crafting_window').style.setProperty('--custom-size',size+'px'),size);
  assert.equal(await p.locator('[data-craft-commit]:visible').isEnabled(),true);
  await p.screenshot({path:path.join(out,`rendering-${width}-${size}.png`)});
 }
 gates.push('Labelled ordinary stock/Cooking fixture, real book reading earns the shared method, unseen source hidden, explicit goat recipe consumes four goat and zero boar, native fat survives Import and is spent by Healing balm after its book is actually read.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
