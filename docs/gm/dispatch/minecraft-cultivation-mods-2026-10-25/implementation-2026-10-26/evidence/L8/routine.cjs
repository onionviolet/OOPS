const fs=require('fs'),path=require('path'),http=require('http');
const output=process.env.BUILD_OUT;if(!output)throw Error('BUILD_OUT required');
const server=http.createServer((req,res)=>{try{let file=path.resolve(output,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(output+'/')&&file!==output)throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
server.listen(0,'127.0.0.1',async()=>{process.env.URL=`http://127.0.0.1:${server.address().port}`;process.env.L8_BUNDLE=path.join(output,'dist/bundle.js');try{
await require('./native-helper.cjs')('m8-routine-'+(process.env.BEFORE?'before':'after'),async h=>{
const {p,assert,boot,save,played,roundtrip,gates,out,load}=h;
await p.setViewportSize({width:1920,height:1080});await boot();
let fixture=await save();fixture.levels.person.main_character.skill_xp.Combat=1000;fixture.availabilities.skill.Combat=1;
const bread=JSON.stringify({id:'Stale bread'});fixture.inventories.person.main_character[bread].count=6;
await load(fixture,'named-practiced-body-1000-combat-xp-six-rations');
const open=async()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('pledges');
const act=async selector=>{await open();const b=p.locator(selector);assert.equal(await b.isEnabled(),true,await p.locator('#pledges_panel').innerText());await b.press('Enter');};
const initial=await save();await act('[data-ordeal-begin="precision"][data-ordeal-rations="0"]');await act('[data-ordeal-step="steady"]');await act('[data-ordeal-accept]');
let graded=await save();assert.equal(graded.pledges.trial.stage,1);assert.ok(graded.pledges.trial.quality>0);await open();
if(process.env.BEFORE){assert.equal(await p.locator('[data-routine-preview]').count(),0);fs.writeFileSync(path.join(out,'before-ui.txt'),await p.locator('#pledges_panel').innerText());await p.getByRole('spinbutton',{name:'Maximum failure risk (%)',exact:true}).evaluate(n=>n.scrollIntoView({block:'center'}));await p.screenshot({path:path.join(out,'before.png')});gates.push('Actual earned precision grade unlocks three routine limits without a draft source/cost/destination preview');return;}
// Two preparations on the same exact starting body and stock, both actual native commands.
await load(initial,'same-start-guarded-branch');await act('[data-guarded-tempering]');const guarded=await save();
assert.equal(guarded.pledges.trial.stage,1);assert.equal(guarded.pledges.trial.quality||0,0);assert.equal(guarded.inventories.person.main_character[bread].count,1);assert.equal(graded.inventories.person.main_character[bread].count,6);
assert.ok(graded.character.hp_to_full>guarded.character.hp_to_full,'Grade increases actual maximum health while preserving the same absolute starting health');
fs.writeFileSync(path.join(out,'preparation-comparison.json'),JSON.stringify({graded:{stage:graded.pledges.trial.stage,quality:graded.pledges.trial.quality,rations:graded.inventories.person.main_character[bread].count,hpDeficit:graded.character.hp_to_full},guarded:{stage:guarded.pledges.trial.stage,quality:guarded.pledges.trial.quality||0,rations:guarded.inventories.person.main_character[bread].count,hpDeficit:guarded.character.hp_to_full}},null,2));
await load(graded,'actual-earned-grade-for-routine');await open();
const input=async(name,value)=>p.getByRole('spinbutton',{name,exact:true}).fill(String(value));
const beforeDraft=await save();await input('Maximum failure risk (%)',0);await input('Maximum rations per attempt',5);await input('Rations to keep untouched',2);
assert.match(await p.locator('[data-routine-preview]').innerText(),/No attempt fits/);await input('Rations to keep untouched',1);
assert.match(await p.locator('[data-routine-preview]').innerText(),/5.*Stale bread/);assert.match(await p.locator('[data-routine-preview]').innerText(),/1.*remain/);
const draftOnly=await save();assert.deepEqual(draftOnly.pledges,beforeDraft.pledges);assert.deepEqual(draftOnly.inventories,beforeDraft.inventories);assert.equal(draftOnly.expansion.clock,beforeDraft.expansion.clock);
// Missing funded means is admitted as a chosen configuration, then stops without spending.
await input('Rations to keep untouched',2);await act('[data-trial-routine]');await played(1);let stopped=await save();assert.equal(stopped.pledges.routine.enabled,false);assert.match(stopped.pledges.routine.last.reason,/No attempt fits/);assert.equal(stopped.inventories.person.main_character[bread].count,6);assert.equal(stopped.pledges.trial.stage,1);
await open();await input('Rations to keep untouched',1);await act('[data-trial-routine]');await p.evaluate(()=>window.start_dialogue('villageElder'));
await p.evaluate(()=>advanceTicks(1));let choice=await save();assert.equal(choice.inventories.person.main_character[bread].count,6);assert.equal(choice.pledges.trial.stage,1);
const projection=await p.evaluate(()=>simulationTestHooks.project('pledges'));assert.equal(projection.routine.eligible,false);assert.ok(projection.routine.reason);assert.equal(choice.pledges.routine.enabled,false);assert.match(choice.pledges.routine.last.reason,/conversation|choice|decision/);assert.match(projection.routineContext.blocked,/conversation|choice|decision/);
fs.writeFileSync(path.join(out,'pending-conversation.json'),JSON.stringify({routine:choice.pledges.routine,quote:projection.routine,clock:choice.expansion.clock},null,2));
await p.evaluate(()=>window.end_dialogue());await open();if((await save()).pledges.routine.enabled)await act('[data-trial-routine]');
// Four actual saved text/desktop settings, then one actually funded guarded stage.
const matrix=[];
for(const size of [14,21]){await p.locator('[data-route-id="customization"]').click();await p.locator(`[data-text-size-preset="${size}"]`).press('Enter');for(const [width,height]of [[1920,1080],[1536,864]]){await p.setViewportSize({width,height});await open();await p.locator('[data-routine-status]').evaluate(n=>{n.scrollIntoView({block:'start'});let a=n.parentElement;while(a&&(!/auto|scroll/.test(getComputedStyle(a).overflowY)||a.scrollHeight<=a.clientHeight+2))a=a.parentElement;if(a)a.scrollTop=Math.max(0,a.scrollTop-55);});const fit=await p.locator('#pledges_panel').evaluate(n=>({font:parseFloat(getComputedStyle(n).fontSize),width:n.clientWidth,scroll:n.scrollWidth,page:document.documentElement.scrollWidth,viewport:innerWidth}));assert.equal(fit.font,size);assert.ok(fit.scroll<=fit.width+2,JSON.stringify(fit));assert.ok(fit.page<=fit.viewport+2,JSON.stringify(fit));matrix.push({width,height,size,...fit});await p.screenshot({path:path.join(out,`routine-${width}-${size}.png`)});}}
fs.writeFileSync(path.join(out,'matrix.json'),JSON.stringify(matrix,null,2));
await act('[data-trial-routine]');const armed=await save(),project=s=>({routine:s.pledges.routine,trial:s.pledges.trial,inventory:s.inventories.person.main_character});assert.equal(armed.pledges.routine.enabled,true);
const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const armedFile=path.join(out,'armed-exact-ration-limits.save.txt');await(await download).saveAs(armedFile);
const literal=JSON.parse(Buffer.from(fs.readFileSync(armedFile,'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString());assert.deepEqual(project(literal),project(armed));
await p.reload({waitUntil:'domcontentloaded'});assert.deepEqual(project(await h.read()),project(armed));
await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles(armedFile)]);assert.deepEqual(project(await h.read()),project(armed));
gates.push('Armed exact limits: native Save/Export/reload/literal Import equal before allowing the first played tick');await h.play();const done=await save();assert.equal(done.pledges.routine.enabled,false);assert.equal(done.pledges.trial.stage,2);assert.equal(done.inventories.person.main_character[bread].count,1);assert.match(done.pledges.routine.last.reason,/holds/);
await roundtrip('one-funded-guarded-stage-stopped',s=>({pledges:s.pledges,inventory:s.inventories.person.main_character,character:s.character}));
gates.push('Named practiced-body/stock fixture; actual earned graded versus paid guarded stage changes native maximum-health capacity; draft edits no state/time/spend; missing-stock and live conversation no spend; actual funded stage spends five leaving one and stops; four saved desktop/font cases and native persistence');
},{deterministic:true});
}catch(e){console.error(e);process.exitCode=1;}finally{server.close();}});
