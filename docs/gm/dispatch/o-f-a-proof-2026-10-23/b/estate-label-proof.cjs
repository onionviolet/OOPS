// Estate label proof. Generated fixture: pre-boundary.save.txt (owner's age-boundary fixture, Tingen entries stripped for this build,
// life age moved 5y back so mixing is possible). Native: buy River bellleaf + Spring water, Mix one vial: steep. Test-hook-adjacent step: the
// chronicle age is moved back to the boundary and re-imported by file (as the owner's O4 harness did) to end the life.
const gate=require('./browser-helper.cjs'),fs=require('fs'),path=require('path');
gate('estate-proof',async h=>{const {p,boot,load,save,assert,gates,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const s=JSON.parse(Buffer.from(fs.readFileSync(path.join(__dirname,'pre-boundary.save.txt'),'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64'));
 await load(s,'pre-boundary');assert.equal(await p.locator('#chronicle_life_end').isVisible(),false);
 await p.getByRole('button',{name:/Mix at the Village counter/}).click();
 await p.getByRole('button',{name:/^Buy 1 \(8 coins\)/}).click();await p.getByRole('button',{name:/^Buy 1 \(2 coins\)/}).click();
 await p.getByRole('button',{name:'Mix one vial: steep'}).click();await p.waitForTimeout(500);
 await p.screenshot({path:path.join(out,'mixed-native.png')});
 let t=await save();const keys=Object.keys(t.inventories.person.main_character);
 const mixKey=keys.find(k=>/mixture|fractions/i.test(k));assert.ok(mixKey,'mixture item exists: '+keys.join(' | '));fs.writeFileSync(path.join(out,'mixture-raw-key.txt'),mixKey);
 delete t.inventories.person.main_character['{"id":"Cheap leather pants","quality":40}'];/* fixture edit: estate list caps at 6 names, drop one filler item so the mixture is not folded into 'and N more' */ t.expansion.chronicle.life.initialAge=79.99999807098766;await load(t,'ended');
 const modal=p.locator('#chronicle_life_end'),list=p.locator('#chronicle_heir_leftovers');await modal.waitFor({state:'visible'});
 const text=await list.innerText();fs.writeFileSync(path.join(out,'estate-preview.txt'),text);console.log(text);
 assert.doesNotMatch(text,/"gearwork"|"components"|"e2_instance"|"fractions"|\{"/);assert.match(text,/Cheap iron dagger/);gates.push('estate preview names worked dagger and mixture readably');
 for(const [w,hh,size] of [[1920,1080,14],[1536,864,21]]){await p.setViewportSize({width:w,height:hh});
  await modal.evaluate((n,size)=>{for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.setProperty(k,size+'px');n.style.fontSize=size+'px';},size);
  const g=await list.evaluate(n=>({sw:n.scrollWidth,cw:n.clientWidth,r:n.getBoundingClientRect().right}));assert.ok(g.sw<=g.cw+2&&g.r<=w,JSON.stringify(g));fs.writeFileSync(path.join(out,`geom-${w}.json`),JSON.stringify(g));
  await list.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`estate-${w}x${hh}.png`)});}
 await p.reload({waitUntil:'domcontentloaded'});await p.evaluate(()=>document.querySelector('#loading_screen_play_button')?.click());await modal.waitFor({state:'visible'});
 assert.equal(await list.innerText(),text);gates.push('reload keeps ended-life estate preview identical');
},{deterministic:true}).catch(e=>{console.error(e.message);process.exitCode=1;});
