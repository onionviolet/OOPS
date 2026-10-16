// Rebuilt native UI on an isolated origin: earned R1 stock/progress, with
// initial time controlled to the teacher window. No supplied stock or LP state.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const evidence=__dirname, root=path.resolve(__dirname,'../../../..');
const entry=fs.readFileSync(path.join(root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r1/natural-prerequisite/natural-prerequisite-save.txt'),'utf8').trim();
const initial=JSON.parse(Buffer.from(entry.split(':')[1],'base64').toString('utf8'));
// Controlled teacher-window prerequisite only. Native inventory and all LP progress stay unchanged.
initial['current time']={...initial['current time'],hour:8,minute:0};
const keys=Object.fromEntries(['Field fitting knife','Dulled field fitting knife','Broad field fitting knife','Dulled broad field fitting knife','Fine field fitting knife','Dulled fine field fitting knife','Rough wood log','Tree sap','Wet repair stave','Sound repair stave','Matched repair stave','Lever practice brace','Prepared survey kit'].map(x=>[x,JSON.stringify({id:x})]));
const checks=[],errors=[];const pass=(id,detail)=>{checks.push({id,detail});console.log('PASS',id,JSON.stringify(detail))};
let b,p;
async function openPanels(){await p.locator('#feature_expansion_panel').evaluate(e=>{for(let n=e;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});await p.locator('#feature_expansion_panel details').filter({has:p.locator('summary').getByText('Fitting tools & materials',{exact:true})}).evaluate(e=>e.open=true);}
const row=id=>p.locator(`[data-action-legibility-key="action:${id}"]`);
async function click(id){const r=row(id);await r.locator('button').first().click();console.log('ACTION',id);}
async function save(){await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
const stock=(s,name)=>s.inventories.person.main_character[keys[name]]?.count||0;
const project=s=>({levels:s.levels,characterXp:s.character.xp,inventory:s.inventories.person.main_character,money:s.character.money,clock:s.expansion.clock,rng:s.expansion.rng,simulation:s.expansion.simulation,actor:s.expansion.actors.player});
async function advance(n){const start=(await save()).expansion.clock;for(let i=0;i<100;i++){await p.clock.runFor(1000);if((await save()).expansion.clock>=start+n)return;}console.log('TIMER DEBUG',JSON.stringify({save:(await save())['current time'],errors,sim:(await save()).expansion.simulation?.sessions,clock:(await save()).expansion.clock}));throw Error('Normal timer did not advance '+n+' played minutes');}
async function shot(name,locator){if(locator)await locator.evaluate(e=>e.scrollIntoView({block:'start'}));await p.screenshot({path:path.join(evidence,name+'.png')});}
async function start(){const now=await p.evaluate(()=>Date.now());await p.clock.pauseAt(new Date(now+50));await p.locator('#loading_screen_play_button').click();await openPanels();}
async function importLiteral(file){const loaded=p.waitForEvent('load');await p.locator('#saved_file_input').setInputFiles(file);await loaded;await start();}
async function roundtrip(name){
 const original=await save();
 const downloadPromise=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const dl=await downloadPromise;
 const file=path.join(evidence,name+'.save.txt');await dl.saveAs(file);const encoded=fs.readFileSync(file,'utf8').trim();const exported=JSON.parse(Buffer.from(encoded.split(':')[1],'base64').toString('utf8'));
 // Export has its own disclosed reward timer. Compare the actual exported state.
 await p.reload({waitUntil:'domcontentloaded'});await start();assert.deepEqual(project(await save()),project(exported));
 await importLiteral(file);
 assert.deepEqual(project(await save()),project(exported));
 pass(name+'-save-reload-export-literal-import',{clock:exported.expansion.clock,money:exported.character.money,inventory:exported.inventories.person.main_character});
 return exported;
}
const brace='Lever practice brace', batch='feature_objects.lever_practice_brace';
async function field(){await p.locator('#notebook_tab_here').click();await p.locator('#field_panel').evaluate(e=>{for(let n=e;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});await p.locator('#field_panel details').filter({has:p.locator('summary').getByText('Wedged timber & lever lesson · PROPOSAL',{exact:true})}).evaluate(e=>e.open=true);}
const fc=id=>p.locator(`[data-field-command="field.lp1.${id}"]`);
(async()=>{try{
 b=await chromium.launch({headless:true,channel:'chrome'});const c=await b.newContext({viewport:{width:1366,height:768},acceptDownloads:true});p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto('http://127.0.0.1:8196/style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),initial);
 await p.clock.install({time:new Date('2026-10-14T12:00:00Z')});await p.clock.pauseAt(new Date('2026-10-14T12:00:01Z'));
 await p.goto('http://127.0.0.1:8196',{waitUntil:'domcontentloaded'});await start();
 const old=await save();assert.deepEqual(old.inventories.person.main_character,initial.inventories.person.main_character);assert.equal(stock(old,brace),0);assert.equal(old.expansion.actors.player.completed[batch],undefined);pass('old-save-no-stock-or-batch',{logs:stock(old,'Rough wood log'),sap:stock(old,'Tree sap')});
 await field();const begin=p.locator('[data-field-command="field.begin"]');if(await begin.isVisible())await begin.click();
 pass('controlled-teacher-window',{time:(await save())['current time']});await fc('demonstrate').click();await fc('explain').click();assert.equal(await fc('practice').isDisabled(),true);assert.match(await fc('practice').locator('..').innerText(),/Lever practice brace/);pass('practice-needs-real-brace',{method:false});
 await p.getByRole('button',{name:'Do this: Meet Eda, the sluice fitter',exact:true}).click();await openPanels();
 assert.equal(await row(batch).locator('button').first().isDisabled(),true);assert.match(await row(batch).innerText(),/Sound repair stave/);await shot('01-missing-ingredient',row(batch));pass('missing-owned-ingredient-refused',{});
 await click('feature_objects.buy');await click('feature_objects.cut_sharp_own');await advance(4);assert.equal(stock(await save(),'Wet repair stave'),2);
 await click('feature_objects.dry_shade');await advance(6);const dry=await save();assert.equal(stock(dry,'Sound repair stave'),1);pass('real-cutting-and-drying',{wet:1,sound:1});
 // Keep a second owned sound stave so the occupied slot is isolated from stock refusal.
 await click('feature_objects.buy_sound');const supplied=await save();assert.equal(stock(supplied,'Sound repair stave'),2);
 await shot('02-ready-batch',row(batch));const pending=await row(batch).locator('button').first().evaluate(e=>{e.click();return JSON.parse(localStorage.getItem('save data'));});assert.equal(stock(pending,'Sound repair stave'),1);assert.equal(stock(pending,'Tree sap'),stock(supplied,'Tree sap')-1);assert.equal(stock(pending,brace),0);
 const job=pending.expansion.simulation.jobs.find(j=>j.commandId===batch);assert.equal(job.due-pending.expansion.clock,2);assert.equal(Object.keys(pending.expansion.simulation.sites['feature_objects.fitting_bench'].reservations).length,1);
 assert.equal(await row('feature_objects.dry_shade').locator('button').first().isDisabled(),true);assert.match(await row('feature_objects.dry_shade').innerText(),/bench is reserved/);await shot('03-slot-reserved',row(batch));pass('owned-inputs-and-shared-slot',{sound:1,sapSpent:1,duration:2});
 const pendingExport=await roundtrip('batch-pending');assert.ok(pendingExport.expansion.simulation.jobs.find(j=>j.commandId===batch));await advance(2);const collected=await save();assert.equal(stock(collected,brace),1);assert.equal(collected.expansion.actors.player.completed[batch],1);assert.equal(Object.keys(collected.expansion.simulation.sites['feature_objects.fitting_bench'].reservations).length,0);await shot('04-collected-stock',p.locator('#feature_expansion_panel').getByText(/Lever practice braces: 1 carried/));pass('completion-collects-one',{braces:1});
 await roundtrip('batch-collected');await importLiteral(path.join(evidence,'batch-collected.save.txt'));assert.equal(stock(await save(),brace),1);await advance(2);assert.equal(stock(await save(),brace),1);pass('repeated-import-no-recollection',{braces:1});
 await field();assert.equal(await fc('practice').isDisabled(),false);await shot('05-practice-ready',fc('practice'));const beforePractice=await save();await fc('practice').click();const practice=await save();assert.equal(stock(practice,brace),0);assert.equal(practice.character.money,beforePractice.character.money-1);assert.ok(practice.expansion.simulation.jobs.find(j=>j.commandId==='field.lp1.practice'));const practiceExport=await roundtrip('practice-pending');assert.ok(practiceExport.expansion.simulation.jobs.find(j=>j.commandId==='field.lp1.practice'));await advance(3);
 const learned=await save();assert.equal(stock(learned,brace),0);assert.equal(learned.expansion.simulation.knowledge.player['field.lp1.method'].stage,'understood');assert.equal(learned.expansion.actors.player.completed['field.lp1.practice'],1);await field();await shot('06-consumed-and-learned',p.locator('#field_panel'));pass('downstream-consumption-and-learning',{braces:0,learned:true,coinSpent:1});
 await fc('lever_work').click();await advance(2);const useful=await save();assert.equal(stock(useful,'Prepared survey kit'),stock(learned,'Prepared survey kit')+1);pass('learned-method-useful-result',{kitsAdded:1});
 await roundtrip('practice-complete');await importLiteral(path.join(evidence,'practice-complete.save.txt'));assert.equal(stock(await save(),brace),0);assert.equal((await save()).expansion.actors.player.completed['field.lp1.practice'],1);pass('no-duplicate-practice-or-output',{});
 assert.equal(errors.length,0);pass('no-page-errors',errors);const bundle=await p.request.get('http://127.0.0.1:8196/dist/bundle.js');const actual=crypto.createHash('sha256').update(await bundle.body()).digest('hex'),local=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist/bundle.js'))).digest('hex');assert.equal(actual,local);pass('rebuilt-served-bundle',{sha256:actual});
 fs.writeFileSync(path.join(evidence,'results.json'),JSON.stringify({viewport:{width:1366,height:768},entry:'earned R1 stock and progress; initial native time controlled to 08:00 for the teacher window',timer:'Playwright clock runs normal native timers; no inventory or lesson injection',collection:'automatic on batch completion, same native transaction as completion receipt',checks,errors},null,2));
 }catch(e){console.error(e.stack);if(p){fs.writeFileSync(path.join(evidence,'failure.txt'),await p.locator('body').innerText().catch(()=>''));await p.screenshot({path:path.join(evidence,'failure.png')}).catch(()=>{});}process.exitCode=1;}finally{if(b)await b.close();}})();
