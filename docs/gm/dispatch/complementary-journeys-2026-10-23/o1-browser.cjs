const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
const fs=require('node:fs'),path=require('node:path');
gate('o1-focus-workshop',async h=>{
 const {p,boot,enroll,save,load,roundtrip,played,until,assert,gates,out}=h;
 await p.setViewportSize({width:1920,height:1080});let s=await boot();
 const basic=JSON.stringify({components:{head:'Cheap iron short blade',handle:'Simple wooden short handle'},quality:100});
 Object.assign(s.inventories.person.main_character,{[basic]:{count:1},'{"id":"Charcoal"}':{count:5},'{"id":"Lamp oil"}':{count:2},'{"id":"Rough wood log"}':{count:8}});
 s.availabilities.dialogue.oldCraftsman=1;await load(s,'ordinary-gear-and-supplies');await enroll();
 const field=async id=>{
  await p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');n.value='notebook';n.dispatchEvent(new Event('change',{bubbles:true}));});
  await p.locator('[data-notebook-view="here"]').click();
  await p.evaluate(()=>document.querySelectorAll('#field_panel details,#field_panel').forEach(d=>d.open=true));
  const b=p.locator(`[data-field-command="${id}"]`);assert.equal(await b.isEnabled(),true,await b.getAttribute('title'));await b.press('Enter');console.log('field',id);
 };
 // Learn and recover the existing method through its real controls.
 await field('field.begin');await field('field.join_craft');await played(3);
 await field('field.learn_focus');await played(2);
 await p.evaluate(()=>window.change_location({location_id:'Shack'}));await until(s=>s['current location']==='Shack','arrival at Shack');
 await field('field.recover_focus');await played(2);
 await p.evaluate(()=>window.change_location({location_id:'Village'}));await until(s=>s['current location']==='Village','arrival at Village');
 const open=async()=>p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');n.value='gear-workshop';n.dispatchEvent(new Event('change',{bubbles:true}));});
 await open();const panel=p.locator('#gear_workshop');
 const choose=async(action,key,focused=false)=>{await open();await panel.getByRole('combobox',{name:'Carried gear',exact:true}).selectOption(key);await panel.getByRole('combobox',{name:'Gear process',exact:true}).selectOption(action);if(action==='quench')await panel.getByRole('combobox',{name:'Process material',exact:true}).selectOption('{"id":"Lamp oil"}');if(focused)await panel.getByRole('combobox',{name:'Process control',exact:true}).selectOption('focus');};
 const keyFrom=async()=>Object.keys((await save()).inventories.person.main_character).find(k=>k.includes('"gearwork"')&&JSON.parse(k).components?.head);
 const execute=async()=>{const b=panel.locator('[data-gear-commit]');assert.equal(await b.isEnabled(),true,await panel.innerText());await b.press('Enter');};
 s=await save();assert.equal(s.expansion.simulation.energies.player['field.focus'].reserve,4);const fuel=s.inventories.person.main_character['{"id":"Charcoal"}'].count;
 await choose('heat',basic);await execute();let k=await keyFrom();assert.ok(k);
 await choose('quench',k,true);assert.match(await panel.innerText(),/spends 2 focus/);await execute();k=await keyFrom();
 s=await save();assert.equal(s.expansion.simulation.energies.player['field.focus'].reserve,2);assert.equal(s.inventories.person.main_character['{"id":"Lamp oil"}'].count,1);
 assert.equal(s.inventories.person.main_character['{"id":"Charcoal"}'].count,fuel-1);assert.equal(JSON.parse(k).gearwork.treatment.stage,'quenched');
 const brittle=JSON.parse(k).gearwork.treatment.toughness;
 await choose('temper',k,true);await execute();k=await keyFrom();s=await save();
 assert.equal(s.expansion.simulation.energies.player['field.focus'].reserve,0);assert.equal(s.expansion.simulation.energies.player['field.focus'].strain,2);assert.ok(JSON.parse(k).gearwork.treatment.toughness>brittle);
 await choose('quench',k,true);assert.equal(await panel.locator('[data-gear-commit]').isEnabled(),false);assert.match(await panel.innerText(),/Recover measured focus/);
 await roundtrip('focus-tempered-gear',s=>({energy:s.expansion.simulation.energies.player['field.focus'],stock:s.inventories.person.main_character}));
 await choose('quench',k,true);
 assert.match(await panel.innerText(),/Heat-treated edge/);
 for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]])for(const px of [14,21]){
  await p.setViewportSize({width,height});await p.evaluate(px=>{for(const key of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.setProperty(key,px+'px');document.querySelector('#gear_workshop').style.fontSize=px+'px';},px);await open();
  await p.screenshot({path:path.join(out,`workshop-${width}-${px}.png`)});
  assert.equal(await panel.getByRole('combobox',{name:'Process control',exact:true}).count(),1);
 }
 gates.push('Real field membership, learned/recovered focus, fuel heating, paid focus quench/temper, live item stat reader, exhausted-focus rejection; six desktop/text captures. Ordinary starting gear/supplies are fixture prerequisites.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
