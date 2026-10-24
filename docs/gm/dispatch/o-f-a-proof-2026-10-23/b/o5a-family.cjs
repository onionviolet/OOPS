// O5a. Generated fixture (labelled): the estate-proof fixture life, aged to its end, with save.kin = [spouse Bram] added because no UI path creates kin.
// Native from there: Begin heir button, Family panel via More panels, Save, reload, Export, file Import.
const gate=require('./browser-helper.cjs'),fs=require('fs'),path=require('path');
gate('o5a-family',async h=>{const {p,boot,load,save,assert,gates,out,roundtrip}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const s=JSON.parse(Buffer.from(fs.readFileSync(path.join(__dirname,'pre-boundary.save.txt'),'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64'));
 s.expansion.chronicle.life.initialAge=79.99999807098766;s.kin=[{name:'Bram',relation:'spouse',age:60,id:'k1'}];
 await load(s,'ended-with-kin');const modal=p.locator('#chronicle_life_end');await modal.waitFor({state:'visible'});
 await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),modal.locator('[data-life="begin-heir"]').press('Enter')]);
 await p.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await p.evaluate(()=>{simulationTestHooks.pause();advanceTicks(1);});
 const open=async()=>{await p.evaluate(()=>{simulationTestHooks.pause();advanceTicks(1);});await p.evaluate(()=>{const n=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.textContent==='Family'));n.value=[...n.options].find(o=>o.textContent==='Family').value;n.dispatchEvent(new Event('change',{bubbles:true}));});await panel.waitFor({state:'visible'});};
 const panel=p.locator('#family_tree_panel');await open();
 // Part 1: native heir flow, ancestor + heir on one tree.
 const t1=await panel.innerText();fs.writeFileSync(path.join(out,'family-native-heir.txt'),t1);assert.match(t1,/Hero/);assert.match(t1,/this life/);assert.doesNotMatch(t1,/Bram/);
 await panel.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'family-native-1920x1080.png')});
 // Part 2: kin is dropped by the game's save serializer and nothing in the game creates it, so the relative is injected into the heir chronicle lineage (GENERATED FIXTURE) and imported by file.
 const hs=await save();assert.equal(hs.kin,undefined);const lin=hs.expansion.chronicle.life.experience.lineage;lin.relatives.push({name:'Bram',relation:'spouse',age:60,of:1});
 await load(hs,'heir-with-relative');await open();
 const text=await panel.innerText();console.log(text);fs.writeFileSync(path.join(out,'family-panel.txt'),text);
 assert.match(text,/Bram/);assert.match(text,/spouse of Hero/);await panel.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'family-1920x1080.png')});
 await p.setViewportSize({width:1536,height:864});await p.screenshot({path:path.join(out,'family-1536x864.png')});await p.setViewportSize({width:1920,height:1080});
 const proj=x=>x.expansion.chronicle.life.experience.lineage;const saved=await save();assert.ok(proj(saved).relatives.length===1&&proj(saved).ancestors.length===1);
 await roundtrip('family',proj);
 await open();assert.equal(await panel.innerText(),text);await panel.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'family-after-import.png')});gates.push('family panel identical after reload+export+import');
},{deterministic:true}).catch(e=>{console.error(e.message);process.exitCode=1;});
