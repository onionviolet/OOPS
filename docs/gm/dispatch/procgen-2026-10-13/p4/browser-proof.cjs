// Run from this worktree after npm run build and serving port 19340.
// Test-only durable profile and literal export stay under /private/tmp.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
(async()=>{
 const c=await chromium.launchPersistentContext(process.env.P4_PROFILE||'/private/tmp/procgen-p4-profile-explore',{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
 const p=c.pages()[0]||await c.newPage();for(const other of c.pages())if(other!==p)await other.close();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const people=s=>s.generated_people;
 const click=async(id,action)=>p.locator(`[data-generated-person="${id}"] [data-generated-action="${action}"]`).click();
 await p.goto('http://127.0.0.1:19340');await p.locator('#loading_screen_play_button').click();
 if(await p.locator('#hero_creation_panel').isVisible()){
  await p.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN P4 NATURAL');await p.locator('#hero_creation_panel_confirmation').click();
 }
 await p.locator('#generated_people_panel > summary').click();
 if(await p.getByRole('button',{name:'Welcome road travelers'}).count())await p.getByRole('button',{name:'Welcome road travelers'}).click();
 for(const id of ['traveler_1','traveler_2']){
  await p.locator(`[data-generated-person="${id}"] > summary`).click();
  if(await p.locator(`[data-generated-person="${id}"] [data-generated-action="meet"]`).count())await click(id,'meet');
  await p.locator(`[data-generated-person="${id}"] > summary`).click();
 }
 await p.locator('#save_button').click();const before=await saved();assert.ok(people(before).people.slice(0,2).every(p=>p.met));
 const person=people(before).people.slice(0,2).find(p=>p.goal.item==='Stale bread'&&!p.goal.fulfilled);assert.ok(person,'This natural fixture needs one bread request. Use a fresh profile for another seed.');
 await p.locator(`[data-generated-person="${person.id}"] > summary`).click();await click(person.id,'talk');await click(person.id,'help');
 const helped=await saved(),a=people(helped).people.find(p=>p.id===person.id);assert.ok(a.goal.fulfilled);assert.equal(a.knownTraits.length,1);assert.ok(a.traits.length>a.knownTraits.length);assert.equal(helped.character.money,before.character.money+person.goal.reward);
 const bread=Object.keys(before.inventories.person.main_character).find(k=>k.includes('Stale bread'));assert.equal(helped.inventories.person.main_character[bread].count,before.inventories.person.main_character[bread].count-1);
 await click(person.id,'settle');await p.locator('#save_button').click();const savedBeforeReload=await saved();await p.reload();await p.locator('#loading_screen_play_button').waitFor();assert.deepEqual(people(await saved()),people(savedBeforeReload));
 await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(1000);await p.locator('#generated_people_panel > summary').click();
 await p.locator(`[data-generated-person="${person.id}"] > summary`).click();assert.ok((await p.locator('#generated_people_panel').innerText()).includes(`${a.traits.length-1} undiscovered`));
 await p.screenshot({path:'docs/gm/dispatch/procgen-2026-10-13/p4/desktop-1366.png'});
 await p.setViewportSize({width:1600,height:1000});await p.screenshot({path:'docs/gm/dispatch/procgen-2026-10-13/p4/desktop-1600.png'});
 const download=await Promise.all([p.waitForEvent('download'),p.locator('#save_to_file_button').click()]);const literal='/private/tmp/procgen-p4-literal.txt';await download[0].saveAs(literal);
 const {decodeSaveFile}=await import(process.cwd()+'/src/save_files.js');const exported=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');
 await p.locator('#saved_file_input').setInputFiles(literal);await p.waitForEvent('load');await p.locator('#loading_screen_play_button').waitFor();assert.deepEqual(people(await saved()),people(exported));
 assert.deepEqual(errors,[]);
 const bundle=fs.readFileSync('dist/bundle.js'),served=await (await p.request.get('http://127.0.0.1:19340/dist/bundle.js')).body();assert.deepEqual(served,bundle);
 const proof={date:'2026-10-13',label:'NATURAL',profile:process.env.P4_PROFILE||'/private/tmp/procgen-p4-profile-explore',viewports:['1366x768','1600x1000'],met:2,goalPaid:true,nativeBreadRemoved:true,oneTraitDiscovered:true,otherTraitsHidden:true,settled:true,saveReloadExact:true,exportLiteralImportExact:true,pageErrors:errors,bundleSha256:crypto.createHash('sha256').update(bundle).digest('hex')};
 fs.writeFileSync('docs/gm/dispatch/procgen-2026-10-13/p4/browser-evidence.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
