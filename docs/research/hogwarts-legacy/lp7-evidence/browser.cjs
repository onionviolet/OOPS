// Rebuilt native UI on an isolated origin, starting from an unchanged earned
// public test checkpoint. No supplied materials, flags, skills or runtime edits.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const evidence=__dirname, root=path.resolve(__dirname,'../../../..');
const entry=fs.readFileSync(path.join(root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r1/natural-prerequisite/natural-prerequisite-save.txt'),'utf8').trim();
const initial=JSON.parse(Buffer.from(entry.split(':')[1],'base64').toString('utf8'));
const keys=Object.fromEntries(['Field fitting knife','Dulled field fitting knife','Broad field fitting knife','Dulled broad field fitting knife','Fine field fitting knife','Dulled fine field fitting knife','Rough wood log','Tree sap','Wet repair stave','Sound repair stave','Matched repair stave'].map(x=>[x,JSON.stringify({id:x})]));
const checks=[],errors=[];const pass=(id,detail)=>{checks.push({id,detail});console.log('PASS',id,JSON.stringify(detail))};
let b,p;
async function openPanels(){await p.locator('#feature_expansion_panel').evaluate(e=>{for(let n=e;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});await p.locator('#feature_expansion_panel details').filter({has:p.locator('summary').getByText('Fitting tools & materials',{exact:true})}).evaluate(e=>e.open=true);}
const row=id=>p.locator(`[data-action-legibility-key="action:${id}"]`);
async function click(id){const r=row(id);await r.locator('button').first().click();console.log('ACTION',id);}
async function save(){await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
const stock=(s,name)=>s.inventories.person.main_character[keys[name]]?.count||0;
const project=s=>({levels:s.levels,characterXp:s.character.xp,inventory:s.inventories.person.main_character,money:s.character.money,clock:s.expansion.clock,rng:s.expansion.rng,simulation:s.expansion.simulation,actor:s.expansion.actors.player});
async function advance(n){const start=(await save()).expansion.clock;for(let i=0;i<40;i++){await p.clock.runFor(1000);if((await save()).expansion.clock>=start+n)return;}throw Error('Normal timer did not advance '+n+' played minutes');}
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
(async()=>{try{
 b=await chromium.launch({headless:true,channel:'chrome'});const c=await b.newContext({viewport:{width:1366,height:768},acceptDownloads:true});p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto('http://127.0.0.1:8200/style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),initial);
 await p.clock.install({time:new Date('2026-10-14T12:00:00Z')});await p.clock.pauseAt(new Date('2026-10-14T12:00:01Z'));
 await p.goto('http://127.0.0.1:8200',{waitUntil:'domcontentloaded'});await start();
 const old=await save();assert.deepEqual(old.inventories.person.main_character,initial.inventories.person.main_character);assert.equal(old.expansion.actors.player.facts['feature_objects.introduced'],undefined);pass('old-save-no-lp7-stock-or-activation',{logs:stock(old,'Rough wood log'),sap:stock(old,'Tree sap')});
 await p.getByRole('button',{name:'Do this: Meet Eda, the sluice fitter',exact:true}).click();await openPanels();
 await click('feature_objects.buy');const bought=await save();assert.equal(stock(bought,'Field fitting knife'),1);assert.equal(bought.character.money,initial.character.money-6);
 await shot('01-stat-choice-before',row('feature_objects.choose_stat'));
 await click('feature_objects.cut_sharp_own');await advance(4);let baseline=await save();assert.equal(stock(baseline,'Wet repair stave'),2);assert.equal(stock(baseline,'Dulled field fitting knife'),1);pass('baseline-cut-output-2',{wet:2,logs:stock(baseline,'Rough wood log')});
 await click('feature_objects.repair_dull_own');const common=await save();fs.writeFileSync(path.join(evidence,'common-earned.save.txt'),'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(common)).toString('base64'));
 const log=stock(common,'Rough wood log'),sap=stock(common,'Tree sap');
 await click('feature_objects.choose_stat');let pending=await save();assert.equal(stock(pending,'Field fitting knife'),0);assert.equal(stock(pending,'Rough wood log'),log-1);assert.equal(stock(pending,'Tree sap'),sap-1);assert.equal(stock(pending,'Broad field fitting knife'),0);assert.equal(Object.keys(pending.expansion.simulation.sites['feature_objects.fitting_bench'].reservations).length,1);
 assert.equal(await row('feature_objects.choose_function').locator('button').first().isDisabled(),true);assert.match(await row('feature_objects.choose_function').innerText(),/bench is reserved/);assert.match(await p.locator('#feature_expansion_panel').innerText(),/Fitting bench: 1\/1 slots occupied/);await shot('02-slot-reserved',row('feature_objects.choose_function'));pass('recipe-consumption-and-single-slot',{logs:log-1,sap:sap-1,slot:1});
 await roundtrip('stat-pending');await advance(3);let stat=await save();assert.equal(stock(stat,'Broad field fitting knife'),1);assert.equal(Object.keys(stat.expansion.simulation.sites['feature_objects.fitting_bench'].reservations).length,0);
 await click('feature_objects.cut_broad_own');await advance(4);stat=await save();assert.equal(stock(stat,'Wet repair stave'),5);assert.equal(stock(stat,'Dulled broad field fitting knife'),1);assert.equal(stat.expansion.simulation.knowledge.player['feature_objects.method'],undefined);await shot('03-stat-output',p.locator('#feature_expansion_panel .expedition_history').filter({hasText:'Cutting yield 3 replaced'}));pass('stat-output-3-and-no-method',{wetBefore:2,wetAfter:5});await roundtrip('stat-complete');
 // Replay the exact earned common checkpoint for the other material choice.
 await importLiteral(path.join(evidence,'common-earned.save.txt'));
 await click('feature_objects.choose_function');await roundtrip('function-pending');await advance(3);let guide=await save();assert.equal(stock(guide,'Fine field fitting knife'),1);assert.equal(guide.expansion.simulation.knowledge.player['feature_objects.method'],undefined);assert.equal(await row('feature_objects.choose_stat').locator('button').first().isDisabled(),true);pass('guide-does-not-grant-learning',{guide:1});
 await click('feature_objects.inspect');await advance(2);await click('feature_objects.observe_alignment');await advance(2);
 assert.equal(await row('feature_objects.match_fine_own').locator('button').first().isDisabled(),true);await shot('04-guide-before-lesson',row('feature_objects.match_fine_own'));
 await click('feature_objects.learn');await advance(3);await click('feature_objects.buy_sound');
 assert.equal(await row('feature_objects.match_fine_own').locator('button').first().isDisabled(),false);await shot('05-function-choice-after-lesson',row('feature_objects.match_fine_own'));
 await click('feature_objects.match_fine_own');await advance(3);const matched=await save();assert.equal(stock(matched,'Matched repair stave'),1);assert.equal(stock(matched,'Fine field fitting knife'),0);assert.equal(stock(matched,'Dulled fine field fitting knife'),1);await shot('06-function-output',p.locator('#feature_expansion_panel .expedition_history').filter({hasText:'one actual Matched repair stave'}));pass('function-useful-output',{matched:1,method:matched.expansion.simulation.knowledge.player['feature_objects.method'].stage});await roundtrip('function-complete');
 assert.equal(errors.length,0);pass('no-page-errors',errors);
 const bundle=await p.request.get('http://127.0.0.1:8200/dist/bundle.js');const actual=crypto.createHash('sha256').update(await bundle.body()).digest('hex'),local=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist/bundle.js'))).digest('hex');assert.equal(actual,local);pass('rebuilt-served-bundle',{sha256:actual});
 fs.writeFileSync(path.join(evidence,'results.json'),JSON.stringify({viewport:{width:1366,height:768},entry:'unchanged earned R1 natural-prerequisite checkpoint',timer:'Playwright virtual clock runs the normal one-minute-per-tick gameplay scheduler',checks,errors},null,2));
 }catch(e){console.error(e.stack);if(p){fs.writeFileSync(path.join(evidence,'failure.txt'),await p.locator('body').innerText().catch(()=>''));await p.screenshot({path:path.join(evidence,'failure.png')}).catch(()=>{});}process.exitCode=1;}finally{if(b)await b.close();}})();
