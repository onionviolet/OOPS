const gate=require('./browser-helper.cjs');
gate('m5-layout',async h=>{
 const {p,assert,boot,load,save,roundtrip,gates,fs,path,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const file='/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/L5/browser/m5-treatment-1CzEeS/paid-purge-complete.save.txt';
 const s=JSON.parse(Buffer.from(fs.readFileSync(file,'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString());await load(s,'native-completed-treatment');
 const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');
 for(const size of [14,21]){
  await p.locator('[data-route-id="customization"]').click();await p.locator(`[data-text-size-preset="${size}"]`).press('Enter');
  for(const [width,height]of [[1920,1080],[1536,864]]){
   await p.setViewportSize({width,height});await open();const panel=p.locator('#crafting_engine_home');const line=panel.getByText(/^Next tablet:/);await line.scrollIntoViewIfNeeded();
   const fit=await panel.evaluate(n=>({font:getComputedStyle(n).fontSize,width:n.clientWidth,scroll:n.scrollWidth}));assert.equal(fit.font,size+'px');assert.ok(fit.scroll<=fit.width+2,JSON.stringify(fit));
   await p.screenshot({path:path.join(out,`medicine-${width}-${size}.png`)});
  }
 }
 await open();
 const current=await save(),herb=Object.keys(current.inventories.person.main_character).find(k=>current.crafting?.materials[JSON.parse(k).materialRef]?.family==='reedherb');
 await p.locator(`[data-craft-material=${JSON.stringify(herb)}]`).check();await p.locator('#crafting_tablet').check();await p.locator('#crafting_heat').fill('2');await p.locator('#crafting_heat').dispatchEvent('change');
 for(let n=0;n<8;n++)await p.locator('#crafting_engine_home [data-craft-commit]').press('Enter');
 let doses=0;const use=p.locator('[data-crafted-use]').filter({hasText:'Drink one'}).first();
 for(let n=0;n<12&&await use.isEnabled();n++){await use.press('Enter');doses++;}
 assert.ok(!(await use.isEnabled()));assert.match(await use.getAttribute('title'),/capacity/);
 const before=await save();await use.evaluate(n=>n.click());assert.deepEqual((await save()).craftDepth.body,before.craftDepth.body);assert.deepEqual((await save()).inventories,before.inventories);
 await use.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'capacity-blocker.png')});
 await roundtrip('capacity-refused',s=>({body:s.craftDepth.body,inventory:s.inventories.person.main_character}));
 gates.push('Saved native 14/21px settings at 1920×1080 and 1536×864, panel width fits; observed next-dose description, real capacity refusal preserves body and stock, final state native roundtrip.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
