const gate=require('./browser-helper.cjs');
gate('m2-receipts',async h=>{
 const {p,boot,enroll,save,load,roundtrip,assert,gates}=h;
 await p.setViewportSize({width:1920,height:1080});let s=await boot();
 // Ordinary pre-existing supplies and native Crafting5 admission, no new facts,
 // lots or capabilities are injected. All W1 state below comes from UI actions.
 const inv=s.inventories.person.main_character;inv['{"id":"Rat pelt"}']={count:12};inv['{"id":"Lamp oil"}']={count:1};inv['{"id":"Rough wood log"}']={count:5};
 s.levels.person.main_character.skill_xp.Crafting=1000;s.availabilities.dialogue.oldCraftsman=1;
 await load(s,'ordinary-repair-supplies');await enroll();await p.evaluate(()=>advanceTicks(1));
 const open=async()=>{await p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');if(n&&[...n.options].some(o=>o.value==='gear-workshop')){n.value='gear-workshop';n.dispatchEvent(new Event('change',{bubbles:true}));}document.querySelectorAll('details').forEach(d=>d.open=true);});};
 await open();await p.locator('#gear_workshop [aria-label="Maker"]').selectOption('player');console.log('workshop opened');
 const click=async sel=>{await open();const b=p.locator(sel);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,await b.getAttribute('title'));await b.press('Enter');console.log('clicked',sel);await p.locator('#gear_workshop [aria-label="Maker"]').selectOption('player');};
 await click('[data-mender-action="lesson"]');await click('[data-mender-action="shift"]');
 await click('[data-hide-treatment="smoked"]');await click('[data-hide-treatment="smoked"]');await click('[data-hide-treatment="oiled"]');
 s=await save();const lots=Object.keys(s.inventories.person.main_character).filter(k=>JSON.parse(k).lineage?.facts.treatment);assert.ok(lots.some(k=>JSON.parse(k).lineage.facts.treatment==='smoked')&&lots.some(k=>JSON.parse(k).lineage.facts.treatment==='oiled'));
 for(const key of lots){const event=JSON.parse(key).lineage.history[0];assert.equal(event.revision,2);assert.equal(event.inputs.length,2);assert.equal(event.inputs[1].role,'support');assert.equal(event.inputs[1].disposition,'consumed');assert.ok(['Lamp oil','Rough wood log'].includes(JSON.parse(event.inputs[1].item_key).id));}
 await roundtrip('m2-prepared-exact-support-lots',s=>s.inventories.person.main_character);
 await click('[data-mender-action="tool:smoked"]');await click('[data-mender-action="tool:oiled"]');
 await click('[data-mender-action="advance:smoked"]');await click('[data-mender-action="fine:smoked"]');await click('[data-mender-action="fine:oiled"]');
 s=await save();assert.ok(s.expansion.actors.player.sources['frontier.mender.fitted']);
 const kits=Object.keys(s.inventories.person.main_character).filter(k=>JSON.parse(k).id==='Portable leatherworking kit');assert.deepEqual(kits.map(k=>JSON.parse(k).quality).sort(),[60,80]);
 const linings=Object.keys(s.inventories.person.main_character).filter(k=>JSON.parse(k).id==='Processed rat pelt');assert.deepEqual(linings.map(k=>JSON.parse(k).quality).sort(),[85,95]);
 await roundtrip('m2-support-through-tool-and-lining',s=>({actor:s.expansion.actors.player,faculties:s.expansion.simulation.faculties.player,stock:s.inventories.person.main_character}));
 await open();const stockBefore=JSON.stringify((await save()).inventories.person.main_character);await p.locator('#gear_workshop [aria-label="Maker"]').selectOption('player');assert.equal(JSON.stringify((await save()).inventories.person.main_character),stockBefore,'preview does not spend native stock');
 gates.push('Native lesson, local repair shift, two treatments, two usable kit grades, preparation-consuming advancement and changed precise work');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
