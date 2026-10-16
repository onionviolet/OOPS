// Run in this worktree after npm run build, with HTTP server on port 21400.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const out='docs/gm/dispatch/research-tech-2026-10-14/slice1';
(async()=>{
 const profile=process.env.RT_SLICE1_PROFILE||`/private/tmp/rt-slice1-profile-${Date.now()}`;
 const c=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
 const p=c.pages()[0],errors=[],checks=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log(m.type(),m.text().slice(0,600));});p.on('dialog',d=>d.accept());
 const check=(id,detail)=>{checks.push({id,label:'seeded-native',detail});console.log(id,detail);};
 const read=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const save=async()=>{await p.evaluate(()=>window.saveProgress());return read();};
 const play=async()=>{await p.locator('#loading_screen_play_button').click();};
 const imp=async file=>{console.log('import',file);await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(file)]);await p.locator('#loading_screen_play_button').waitFor();};
 try{
 await p.goto('http://127.0.0.1:21400');await play();
 if(await p.locator('#hero_creation_panel').isVisible()){await p.locator('#hero_creation_name_field').fill('TEST FIXTURE RT SLICE1');await p.locator('#hero_creation_panel_confirmation').click();}
 const base=await save();assert.equal(base.character.name,'TEST FIXTURE RT SLICE1');fs.writeFileSync('/private/tmp/rt-slice1-base.json',JSON.stringify(base));
 execFileSync(process.execPath,[`${out}/seed.mjs`],{stdio:'inherit'});
 const originalDescription=await p.locator('#location_description_div').innerText();
 for(const [band,width,height] of [['novice',1366,768],['master',1600,1000]]) {
  await p.setViewportSize({width,height});await imp(`/private/tmp/rt-slice1-${band}.txt`);await play();
  assert.equal(await p.locator('#location_description_div').innerText(),originalDescription);
  await p.locator('.choice_craft').click();
  for(const [category,recipe,cue] of [
   ['woodworking','Processed rough wood',band==='novice'?'You notice the lines in the wood.':'You read changes in the grain before judging the finished surface.'],
   ['forging','Metal fishing hook',band==='novice'?"Light catches the metal's surface.":'You read the reflection to judge the evenness of the finished surface.']]) {
   await p.locator(`.crafting_mainpage_button[data-crafting_category="${category}"]`).click();
   await p.locator(`.recipe_div[data-recipe_id="${recipe}"]`).filter({visible:true}).click();
   const more=p.locator('#crafting_detail details');if(!await more.evaluate(e=>e.open))await more.locator('summary').click();
   assert.equal(await p.locator('#crafting_detail .craft_cue').innerText(),cue);
   await p.locator('[data-craft-amount="10"]').click();
   assert.match(await p.locator('#crafting_detail [data-craft-receipt]').innerText(),/^Made /);
   assert.ok((await p.locator('#crafting_detail [data-craft-receipt]').innerText()).endsWith(cue));
   assert.equal(await p.locator('#crafting_detail .craft_cue').innerText(),cue);
   const receipt=await p.locator('#crafting_detail [data-craft-receipt]').innerText();
   await more.locator('summary').click();await p.locator('#crafting_detail .craft_cue').waitFor({state:'detached'});await more.locator('summary').click();
   assert.equal(await p.locator('#crafting_detail [data-craft-receipt]').innerText(),receipt);
   await p.locator('#crafting_detail .craft_cue').waitFor({state:'visible'});
   await p.locator('#crafting_detail .craft_cue').scrollIntoViewIfNeeded();
   await p.screenshot({path:`${out}/${band}-${category}-${width}.png`});
   const s=await save();if(band==='novice') assert.ok(s.levels.person.main_character.skill_xp[category==='woodworking'?'Woodworking':'Forging'] >= Math.round(100*40*(1-1.5**10)/(1-1.5))/100);check(`C-${band}-${category}`,{viewport:`${width}x${height}`,receipt,skillXP:s.levels.person.main_character.skill_xp[category==='woodworking'?'Woodworking':'Forging'],detailsMatch:true,collapsedTextAbsent:true});
  }
  await p.locator('#exit_crafting_button').click();
  await p.locator('#town_panel > summary').click();await p.locator('[data-town-action="town.return"]').click();
  const sentence='Travelers use the corrected signs copied from your ledger.';
  assert.equal(await p.locator('#location_description_div').innerText(),originalDescription+' '+sentence);
  const after=await save();assert.equal(after.expansion.actors.player.facts['town.returned'],true);
  // Existing prose view folds once when it observes changed text; wait for that sync.
  for(let attempt=0;attempt<3;attempt++){
   const more=p.getByRole('button',{name:'More about this place',exact:true});if(await more.count())await more.click();
   await p.waitForTimeout(100);if(await p.getByRole('button',{name:'Less',exact:true}).count())break;
  }
  await p.getByRole('button',{name:'Less',exact:true}).waitFor();
  await p.getByRole('button',{name:'Less',exact:true}).scrollIntoViewIfNeeded();
  assert.ok(await p.evaluate(()=>{const el=document.getElementById('location_description_div');const node=el.firstChild;const start=node.textContent.indexOf('Travelers use the corrected signs');const range=document.createRange();range.setStart(node,start);range.setEnd(node,node.length);const r=range.getBoundingClientRect();const shell=el.closest('.workspace-module-body').getBoundingClientRect();return r.top>=shell.top && r.bottom<=shell.bottom;}),'Village sentence is inside the scrolled visible place panel');
  await p.screenshot({path:`${out}/village-${width}.png`});
  await p.getByRole('button',{name:'Less',exact:true}).click();
  check(`V-${band}`,{viewport:`${width}x${height}`,nativeReturn:true,immediateDescription:true});
 }
 const before=await save(),desc=await p.locator('#location_description_div').innerText();
 await p.reload();await p.locator('#loading_screen_play_button').waitFor();
 assert.equal(await p.locator('#location_description_div').innerText(),desc);
 const restored=await read();assert.deepEqual(restored,before);check('P-reload','Save/reload keeps the full stored envelope and Village sentence identical before PLAY.');
 const download=p.waitForEvent('download');await p.evaluate(()=>document.getElementById('save_to_file_button').click());const file='/private/tmp/rt-slice1-literal-export.txt';await (await download).saveAs(file);
 const {decodeSaveFile}=await import(process.cwd()+'/src/save_files.js');const exported=decodeSaveFile(fs.readFileSync(file,'utf8'),before['game version']);
 // Export has its native reward bookkeeping. Compare import against that export.
 await imp(file);assert.equal(await p.locator('#location_description_div').innerText(),desc);
 const imported=await read();assert.deepEqual(imported,exported);check('P-import','Literal native Export/Import preserves the entire exported envelope and the identical Village sentence.');
 await imp('/private/tmp/rt-slice1-old.txt');assert.equal(await p.locator('#location_description_div').innerText(),originalDescription);check('P-old','Old save missing town.returned retains the original Village description.');
 const oldBefore=await read();for(let i=0;i<10;i++)await p.locator('#location_description_div').innerText();assert.deepEqual(await read(),oldBefore);check('P-view','Repeated reading changes no stored state.');
 const bundle=fs.readFileSync('dist/bundle.js');assert.deepEqual(await (await p.request.get('http://127.0.0.1:21400/dist/bundle.js')).body(),bundle);assert.deepEqual(errors,[]);
 fs.writeFileSync(`${out}/browser-evidence.json`,JSON.stringify({date:'2026-10-14',profile,origin:'http://127.0.0.1:21400',bundleSha256:crypto.createHash('sha256').update(bundle).digest('hex'),checks,pageErrors:errors},null,2)+'\n');
 console.log('PASS',checks.length);
 }catch(e){await p.screenshot({path:'/private/tmp/rt-slice1-failure.png'});fs.writeFileSync('/private/tmp/rt-slice1-failure.html',await p.content());console.error('profile',profile);throw e;}finally{await c.close();}
})().catch(e=>{console.error(e);process.exit(1);});
