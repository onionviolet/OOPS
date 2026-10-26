const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),crypto=require('node:crypto');
gate('o4-body-and-heir',async h=>{
 const {p,out,boot,save,load,roundtrip,played,assert,gates}=h;
 if(!process.env.O1_SAVE)throw Error('O1_SAVE must name this task’s generated focus-tempered-gear export.');
 const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
 const inputs=['dist/bundle.js','src/body_progression.js','src/heir_inheritance.js','src/home_inheritance.js','src/main.js','src/chronicle_ui.js','src/backlog_expansion_time.js','src/discovery_codex.js',__filename,require.resolve('../cultivation-spacing-2026-10-22/browser-helper.cjs')];
 const identity={inputSave:process.env.O1_SAVE,inputSaveSha256:hash(process.env.O1_SAVE),files:Object.fromEntries(inputs.map(file=>[path.relative(process.cwd(),file),hash(file)]))};
 fs.writeFileSync(path.join(out,'o4-inputs.json'),JSON.stringify(identity,null,2));
 const screenshot=tag=>p.screenshot({path:path.join(out,`o4-${tag}-1920x1080.png`)});
 const {bodyFacultyActive,COLD_HARDENED}=await import(pathToFileURL(path.resolve('src/body_progression.js')));
 await p.setViewportSize({width:1920,height:1080});await boot();
 const encoded=fs.readFileSync(process.env.O1_SAVE,'utf8').trim();const fixture=JSON.parse(Buffer.from(encoded.replace(/^YAIR-UTF8-1:/,''),'base64'));
 await load(fixture,'earned-workshop-continuation');
 const notebook=async tab=>{await p.evaluate(()=>{const n=document.querySelector('[aria-label="Other known panels"]');n.value='notebook';n.dispatchEvent(new Event('change',{bubbles:true}));});await p.locator(`[data-notebook-view="${tab}"]`).click();await p.evaluate(()=>document.querySelectorAll('#body_panel,#backlog_expansion_panel,#backlog_expansion_panel details,#chronicle_panel').forEach(d=>d.open=true));};
 const body=async id=>{await notebook('practice');const b=p.locator(`[data-body-command="${id}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,await b.getAttribute('title'));await b.press('Enter');console.log('body',id);};
 const backlog=async id=>{await notebook('here');const b=p.locator(`#backlog_expansion_panel [data-backlog-action="backlog.body.${id}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,await b.locator('..').innerText());await b.press('Enter');console.log('transition',id);};
 await body('body.begin');for(let i=0;i<3;i++){await body('body.cold_soak');await played(6);}await body('body.harden_cold');
 const current=s=>({id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',...s.expansion.simulation.people.player.body});
 let s=await save();assert.equal(bodyFacultyActive(s.expansion,COLD_HARDENED,current(s)),true);await screenshot('earned-weathered-skin');
 const knowledge=structuredClone(s.expansion.simulation.knowledge.player['body.cold']),stock=structuredClone(s.inventories.person.main_character),energy=structuredClone(s.expansion.simulation.energies.player);
 await backlog('meet_clay_vessel');await backlog('ask_clay_vessel');await backlog('possess_clay_vessel');
 s=await save();assert.equal(s.expansion.simulation.people.player.body.form,'clay_vessel');
 assert.equal(bodyFacultyActive(s.expansion,COLD_HARDENED,current(s)),false);
 assert.deepEqual(s.expansion.simulation.knowledge.player['body.cold'],knowledge);assert.deepEqual(s.inventories.person.main_character,stock);assert.deepEqual(s.expansion.simulation.energies.player,energy);
 await screenshot('consenting-borrowed-body');
 await roundtrip('borrowed-body-retained-knowledge',s=>({body:s.expansion.backlog.body,people:s.expansion.simulation.people,knowledge:s.expansion.simulation.knowledge.player,stock:s.inventories.person.main_character,energy:s.expansion.simulation.energies.player}));
 await backlog('return_from_clay');s=await save();assert.equal(bodyFacultyActive(s.expansion,COLD_HARDENED,current(s)),true);assert.deepEqual(s.expansion.simulation.knowledge.player['body.cold'],knowledge);assert.deepEqual(s.inventories.person.main_character,stock);assert.deepEqual(s.expansion.simulation.energies.player,energy);
 // Enrol the actual chronicle; accelerate only its remaining age for this boundary fixture.
 await notebook('people');await p.locator('[data-chronicle="begin-open"]').press('Enter');s=await save();
 const c=s.expansion.chronicle;c.life.mode='mortal';c.life.initialAge=80-(s.expansion.clock-c.enrolledAt+1)/(360*24*60);
 await load(s,'age-boundary-only');await p.locator('#chronicle_life_end').waitFor({state:'visible'});
 const before=await save(),money=before.character.money,oldId=Object.keys(stock).map(k=>JSON.parse(k)).find(k=>k.gearwork)?.e2_instance;
 const deathText=await p.locator('#chronicle_life_end').innerText();assert.match(deathText,/Body, skills and levels/);
 await screenshot('ended-life-estate-preview');
 assert.ok(oldId,'The fixture has an actual worked-gear instance to inherit');
 const oldGear=Object.keys(stock).map(k=>JSON.parse(k)).find(k=>k.e2_instance===oldId);
 const heir=p.locator('[data-life="begin-heir"]');assert.equal(await heir.isEnabled(),true);
 await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),heir.press('Enter')]);
 // Native succession intentionally navigates to the normal URL. Keep that action
 // intact, then restore localhost-only deterministic hooks in this fresh test context.
 const heirSave=await p.evaluate(()=>localStorage.getItem('save data'));
 const testUrl=new URL(p.url());assert.equal(testUrl.origin,new URL(process.env.URL).origin);
 testUrl.searchParams.set('test_hooks','1');await p.goto(testUrl.href,{waitUntil:'domcontentloaded'});
 assert.equal(await p.evaluate(()=>localStorage.getItem('save data')),heirSave,'Restoring the test URL preserves the native heir save');
 await h.play();
 s=await save();assert.equal(s.character.name,'The heir');assert.equal(s.expansion.chronicle.life.experience.generation,2);
 // main.js creates a pristine beginning with 102 coins; estate adds to it.
 assert.equal(s.expansion.chronicle.life.experience.inheritance.money,money);
 assert.equal(s.character.money,money+102);assert.deepEqual(Object.keys(s.inventories.person.main_character).map(k=>JSON.parse(k)).find(k=>k.e2_instance===oldId),oldGear,'The exact worked-gear instance and work stats pass through the estate');
 for(const [kind,ids] of Object.entries(before.discovery_codex?.seen||{}))for(const id of ids)assert.ok(s.discovery_codex.seen[kind].includes(id),'A previously discovered id survives succession');
 assert.equal(s.expansion.chronicle.life.initialAge,18);assert.equal(s.expansion.chronicle.life.endedAt,null);
 assert.ok(!s.expansion.simulation?.people?.player?.body?.['skin.weathered']);
 assert.ok(!s.expansion.simulation?.energies?.player?.['field.focus']);assert.ok(!s.expansion.simulation?.knowledge?.player?.['body.cold']);assert.ok(!s.expansion.actors.player.sources[COLD_HARDENED]);
 await roundtrip('actual-heir-estate-and-fresh-body',s=>({gear:s.inventories.person.main_character,money:s.character.money,codex:s.discovery_codex,record:s.life_record,life:s.expansion.chronicle.life,body:s.expansion.simulation?.people?.player?.body,knowledge:s.expansion.simulation?.knowledge?.player,energy:s.expansion.simulation?.energies?.player,sources:s.expansion.actors.player.sources}));
 await notebook('people');await screenshot('heir-estate-fresh-body');
 assert.deepEqual(Object.fromEntries(inputs.map(file=>[path.relative(process.cwd(),file),hash(file)])),identity.files,'Recorded relevant inputs stayed unchanged during the journey');
 gates.push('Earned weathered skin works on native body, ceases in a consenting borrowed body while knowledge/gear/energy stay, returns with native body; actual heir control passes estate and worked gear, clears unwritten bodily/method state. Only remaining age was fixture-accelerated.');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
