const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('rendering-layout',async h=>{
 const {p,assert,fs,path,out,boot,load,gates}=h;await boot();
 const prefix=process.env.RENDERING_PREFIX;if(!prefix)throw Error('RENDERING_PREFIX must name the earned rendering journey export.');
 const s=JSON.parse(Buffer.from(fs.readFileSync(prefix,'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString());
 for(const size of [14,21])for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]]){
  const view=structuredClone(s);view.customization.profiles[view.customization.active].settings.typography.size=size;
  await p.setViewportSize({width,height});await load(view,`earned-result-display-${width}-${size}`);
  await p.evaluate(()=>{window.openCraftingWindow();window.switchCraftingRecipesPage('cooking');});
  await p.locator('.crafting_recipe_list:visible [data-recipe_id="Render animal fat from Goat meat"] .recipe_item_name').click();
  const button=p.locator('[data-craft-commit]:visible');assert.equal(await button.isEnabled(),true);
  await button.scrollIntoViewIfNeeded();const b=await button.boundingBox();assert.ok(b.x>=0&&b.y>=0&&b.x+b.width<=width&&b.y+b.height<=height);
  assert.match(await p.locator('[data-craft-detail]:visible').innerText(),/4 per attempt/);
  await p.screenshot({path:path.join(out,`rendering-${width}-${size}.png`)});
  gates.push(`${width}x${height}, saved ${size}px preference: exact source/cost and reachable native craft control`);
 }
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
