const gate=require('./browser-helper.cjs');
const fs=require('node:fs'),path=require('node:path');
const fixture=path.join(__dirname,'age-boundary-no-tingen.save.txt');
gate(process.env.EXPECT_RAW?'estate-label-before':'estate-label-after',async h=>{
 const {p,boot,load,save,assert,gates,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const encoded=fs.readFileSync(fixture,'utf8').trim(),s=JSON.parse(Buffer.from(encoded.replace(/^YAIR-UTF8-1:/,''),'base64'));
 await load(s,'generated-age-boundary');const modal=p.locator('#chronicle_life_end'),list=p.locator('#chronicle_heir_leftovers');await modal.waitFor({state:'visible'});
 const before=await save(),text=await list.innerText();assert.ok(Object.keys(before.inventories.person.main_character).some(k=>JSON.parse(k).gearwork));
 if(process.env.EXPECT_RAW){assert.match(text,/"gearwork"/);gates.push('Reproduced raw serialized worked-gear data in the populated native estate preview on an isolated source rebuild.');}
 else{assert.doesNotMatch(text,/"gearwork"|"components"|"e2_instance"/);assert.match(text,/Cheap iron dagger/);gates.push('Worked native gear uses its existing readable item name in estate preview.');}
 for(const [width,height,size]of [[1920,1080,14],[1536,864,21]]){
  await p.setViewportSize({width,height});await modal.evaluate((n,size)=>{for(const key of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.setProperty(key,size+'px');n.style.fontSize=size+'px';n.style.setProperty('--custom-size',size+'px');},size);
  const geometry=await list.evaluate(n=>{const r=n.getBoundingClientRect();return {font:getComputedStyle(n).fontSize,left:r.left,right:r.right,width:r.width,clientWidth:n.clientWidth,scrollWidth:n.scrollWidth};});
  assert.equal(geometry.font,size+'px');
  if(!process.env.EXPECT_RAW){assert.ok(geometry.left>=0&&geometry.right<=width);assert.ok(geometry.scrollWidth<=geometry.clientWidth+2,JSON.stringify(geometry));}
  await list.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`estate-${width}-${size}.png`)});
  const button=modal.locator('[data-life="begin-heir"]');await button.scrollIntoViewIfNeeded();const r=await button.boundingBox();assert.ok(r&&r.y>=0&&r.y+r.height<=height);
  await p.screenshot({path:path.join(out,`estate-controls-${width}-${size}.png`)});
  fs.writeFileSync(path.join(out,`geometry-${width}-${size}.json`),JSON.stringify(geometry,null,2));
 }
 const after=await save();assert.deepEqual(after.inventories,before.inventories);assert.deepEqual(after.character,before.character);assert.deepEqual(after.expansion,before.expansion);assert.deepEqual(after.equipment_durability,before.equipment_durability);
 fs.writeFileSync(path.join(out,'estate-preview.txt'),text);gates.push('Repeated preview/desktop resize preserves complete saved expansion, character, inventories and equipment identity/condition; text-only change reuses O4 actual transfer/import proof.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
