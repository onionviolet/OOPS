// O5b: native Notebook > People buttons ([data-simulation=...]); time advanced with the deterministic test hook (advanceTicks);
// Shack travel uses window.change_location (the game's own function, as scripts/everyday_browser.cjs does) = LABELLED non-click step.
const gate=require('./browser-helper.cjs'),fs=require('fs'),path=require('path');
gate('o5b-habits',async h=>{const {p,boot,load,save,assert,gates,out,roundtrip,enroll}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const fx=JSON.parse(Buffer.from(fs.readFileSync(path.join(__dirname,'pre-boundary.save.txt'),'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64'));await load(fx,'start');/* GENERATED FIXTURE start: needs Notebook tabs; the enrolled life is far from its end */
 for(const id of ['villageElder','oldCraftsman']){await p.evaluate(id=>window.start_dialogue(id),id);const hi=p.locator('[data-textline="hello"]');if(await hi.count())await hi.press('Enter');await p.evaluate(()=>window.end_dialogue());await p.evaluate(()=>advanceTicks(1));}
 const people=async()=>{await p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');n.value='notebook';n.dispatchEvent(new Event('change',{bubbles:true}));});await p.locator('[data-notebook-view="people"]').click();
  await p.evaluate(()=>{const d=document.querySelector('#simulation_panel');if(d&&!d.open)d.open=true;document.querySelectorAll('#simulation_panel details').forEach(x=>x.open=true);});};
 const act=async id=>{await people();const b=p.locator(`[data-simulation="${id}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,id+' enabled');await b.press('Enter');};
 const adv=async n=>{await p.evaluate(n=>advanceTicks(n),n);};
 await people();await p.locator('#simulation_panel [data-simulation="enroll"]').press('Enter');assert.ok((await save()).expansion.simulation);
 // Social: three shared words build familiarity (village.word_after_work, 2 min each)
 for(let i=0;i<3;i++){await act('village.word_after_work');await adv(3);}
 await people();
 const buttons=async()=>p.evaluate(()=>[...document.querySelectorAll('#simulation_panel [data-simulation]')].filter(b=>b.getClientRects().length).map(b=>b.dataset.simulation+' | '+b.textContent.trim()));
 console.log('after words',JSON.stringify(await buttons()));
 const sp=p.locator('#simulation_panel');
 const shot=async(sel,name)=>{const b=p.locator(sel).first();await b.scrollIntoViewIfNeeded();await b.evaluate(n=>n.scrollIntoView({block:'center'}));await p.screenshot({path:path.join(out,name)});};
 await act('village.commission');await adv(1);await people();console.log('busy buttons',(await buttons()).filter(b=>/between_cuts|word_after/.test(b)));
 assert.ok((await buttons()).some(b=>b.startsWith('village.ask_between_cuts')),'social catalog row 2 visible');
 await shot('#simulation_panel [data-simulation="village.ask_between_cuts"]','social-routine-1920x1080.png');fs.writeFileSync(path.join(out,'social-panel.txt'),(await buttons()).filter(b=>/village\./.test(b)).join('\n'));
 await act('village.ask_between_cuts');await adv(1);
 let s=await save();const fam=s.expansion.simulation.relationships.oldCraftsman.player.axes.familiarity;console.log('familiarity',fam);assert.ok(fam>=3);
 // Habit: three quiet breaks in the Shack
 await p.evaluate(()=>window.change_location({location_id:'Shack'}));
 for(let i=0;i<3;i++){await act('village.quiet_break');await adv(3);await adv(25);}
 s=await save();assert.equal(s.expansion.actors.player.completed['village.quiet_break'],3);
 await p.evaluate(()=>window.change_location({location_id:'Village'}));await adv(1);await people();console.log('habit buttons',(await buttons()).filter(b=>/village\./.test(b)));
 await shot('#simulation_panel [data-simulation="village.habit_pause"]','habit-formed-1920x1080.png');
 const txt=await p.evaluate(()=>document.body.innerText);assert.match(txt,/has become a habit/);fs.writeFileSync(path.join(out,'habit-scene.txt'),txt.match(/[^.]*has become a habit[^.]*\./)[0]);
 assert.ok((await buttons()).some(b=>b.startsWith('village.habit_pause')));
 await p.evaluate(()=>window.change_location({location_id:'Village'}));
 await p.setViewportSize({width:1536,height:864});await shot('#simulation_panel [data-simulation="village.habit_pause"]','habit-1536x864.png');await p.setViewportSize({width:1920,height:1080});
 // persistence: reload + export + file import; habit row and social row survive
 const proj=x=>({c:x.expansion.actors.player.completed,rel:x.expansion.simulation.relationships.oldCraftsman.player.axes});
 await roundtrip('o5b',proj);await adv(1);await people();
 const b2=await buttons();console.log('after import',JSON.stringify(b2));assert.ok(b2.some(b=>b.startsWith('village.habit_pause')));
 const after=await p.evaluate(()=>document.body.innerText);assert.match(after,/has become a habit|habit/i);
 await shot('#simulation_panel [data-simulation="village.habit_pause"]','after-import-1920x1080.png');
 // use the habit row
 await p.evaluate(()=>window.change_location({location_id:'Village'}));await act('village.habit_pause');await adv(2);
 const t=await save();console.log('conditions',JSON.stringify(t.expansion.simulation.conditions.player));
},{deterministic:true}).catch(e=>{console.error(e.message);process.exitCode=1;});
