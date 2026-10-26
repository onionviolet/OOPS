// Native frozen-build proof on a separate generated-fixture profile, never the player's.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {_electron}=require('./ui_helpers.cjs').loadPlaywright();
const {makeSnapshot}=require('../desktop/snapshot.cjs');
const task=JSON.parse(fs.readFileSync(process.env.YAIRPG_ADOPTION_TASK||'/tmp/oops-descriptions-adoption.json'));
const out=path.resolve('docs/reviews/ui-descriptions-2026-10-25/evidence/electron');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const profile=path.join(task.work,'description-proof-profile'),snapshot=makeSnapshot(task.candidate.root,profile),errors=[];
 const app=await _electron.launch({executablePath:require('electron'),args:[task.root],cwd:task.root,env:{...process.env,YAIRPG_USER_DATA:profile,YAIRPG_HIDDEN:'1',YAIRPG_FROZEN:'1',YAIRPG_MIRROR:'0',YAIRPG_SERVE_LOG:'1'}});
 try{
  assert.equal(snapshot.id,task.candidate.id);
  const native=await app.evaluate(({app,nativeImage,BrowserWindow},icon)=>{BrowserWindow.getAllWindows()[0].setContentSize(1920,1080);const img=nativeImage.createFromPath(icon);return {profile:app.getPath('userData'),iconSize:img.getSize(),iconEmpty:img.isEmpty(),serving:globalThis.yairpgServing().id};},path.join(task.root,'resources/img/oops-icon.png'));
  assert.equal(native.profile,profile);assert.equal(native.iconEmpty,false);assert.deepEqual(native.iconSize,{width:1024,height:1024});assert.equal(native.serving,snapshot.id);
  const p=await app.firstWindow();p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
  const fixture=JSON.parse(fs.readFileSync('docs/reviews/ui-descriptions-2026-10-25/evidence/traits-dev-seeded.json'));
  await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await p.reload();await p.getByText('PLAY',{exact:true}).click();
  const preview=p.locator('#shell_context_preview');await p.locator('.shell-stat-record[data-attribute-preview="intuition"]').click();
  assert.match(await preview.innerText(),/sense for the flow of a fight/);await p.keyboard.press('Enter');assert.equal(await preview.locator('details').getAttribute('open'),'');await p.keyboard.press('Escape');
  await p.locator('.shell-attributes-open').click();await p.locator('.attribute-inspector-row[data-attribute-id="attack_power"]').click();
  const reading=p.locator('.attribute-inspector-detail');assert.match(await reading.innerText(),/force behind your attacks/);await reading.locator('summary').click();assert.match(await reading.innerText(),/Strength \/ 10/);
  await p.screenshot({path:path.join(out,'native-attack-details-1920.png')});
  await p.locator('#character_show_bio').click();await p.locator('[data-bio-section="learned"] > summary').click();
  const grip=p.locator('[data-bio-entry="body.conditioned_grip"]'),mark=p.locator('[data-bio-entry="body.palm_mark"]');assert.match(await grip.innerText(),/toughened your palms/);assert.doesNotMatch(await mark.innerText(),/inactive/i);await grip.locator('summary').click();assert.match(await grip.innerText(),/Hand control \+1/);
  await p.screenshot({path:path.join(out,'native-trait-details-1920.png')});
  await p.evaluate(()=>window.saveProgress());const before=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')).expansion.actors.player.sources);
  await p.reload();await p.getByText('PLAY',{exact:true}).click();await p.locator('.shell-attributes-open').click();await p.locator('#character_show_bio').click();await p.locator('[data-bio-section="learned"] > summary').click();assert.match(await grip.innerText(),/toughened your palms/);
  const after=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')).expansion.actors.player.sources);assert.deepEqual(after,before);
  await p.evaluate(()=>document.fonts.load('24px "Material Icons"','settings'));const fonts=await p.evaluate(()=>[...document.fonts].filter(f=>f.family.includes('Material Icons')).map(f=>f.status));assert.ok(fonts.includes('loaded'));
  const misses=await app.evaluate(()=>globalThis.yairpgServeLog.misses);assert.deepEqual(misses,[]);assert.deepEqual(errors,[]);
  const result={result:'PASS',origin:p.url(),snapshotId:snapshot.id,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),fixture:'DEV SEEDED generated traits; no player saves',checks:['native stat prose and calculation details','click/Enter pin and Escape','native trait prose and numerical capability detail','cosmetic trait has no false inactive label','native Save/reload retains trait sources','local Material Icons loaded','native PNG icon decodes at 1024×1024'],errors,misses};
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
