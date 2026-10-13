const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),http=require('http'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=process.cwd(),out=__dirname,port=18710;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bundle=sha(fs.readFileSync('dist/bundle.js'));
const map=JSON.parse(fs.readFileSync('dist/bundle.js.map','utf8'));
const sourceFiles=map.sources.map((s,i)=>[path.resolve('dist',s),map.sourcesContent[i]]).filter(([p])=>fs.existsSync(p));
for(const [p,content] of sourceFiles)assert.equal(fs.readFileSync(p,'utf8'),content,p);
const mime={'.js':'application/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));if(!file.startsWith(root+path.sep)||req.url.includes('/private_packs/')){res.writeHead(404);return res.end();}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b);});});
let browser;const result={bundle,sourceMapFiles:sourceFiles.length,route:'Fresh disposable native origins, UI only for progression. Deterministic initial entropy chooses the supported two/one-hand snapshot; no save, resources, flags or progress are injected.',checks:{},events:[],errors:[],unavailableAssets:[]};
const key=name=>JSON.stringify({id:'reedbank.'+name});
async function start(seed,name){
 const ctx=await browser.newContext({viewport:{width:1600,height:1100}});
 await ctx.addInitScript(seed=>{const original=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>a instanceof Uint32Array&&a.length===1?(a[0]=seed,a):original(a);},seed);
 const p=await ctx.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>result.errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))result.errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)result.unavailableAssets.push({url:r.url(),status:r.status()});});
 const response=p.waitForResponse(r=>r.url().includes('/dist/bundle.js'));
 await p.goto('http://127.0.0.1:'+port,{waitUntil:'domcontentloaded'});assert.equal(sha(await (await response).body()),bundle);
 await p.locator('#loading_screen_play_button:not(.none_display)').click();
 if(await p.locator('#hero_creation_panel_confirmation').isVisible()){await p.locator('[data-race_id=human]').click();await p.locator('#hero_creation_name_field').fill(name);await p.locator('[data-gender=female]').click();await p.locator('#hero_creation_panel_confirmation').click();}
 await p.screenshot({path:out+'/opening-debug.png',fullPage:true});
 fs.writeFileSync(out+'/opening-debug.txt',await p.locator('body').innerText());
 await p.locator('.workspace-picker > summary').click();
 await p.locator('[data-workspace-action="restore"][data-module="beginning"]').click();
 if(!(await p.locator('#structured_pack_panel').evaluate(n=>n.open)))await p.locator('#structured_pack_panel > summary').click();
 await p.locator('[data-structured-begin]').click();return {p,ctx};
}
async function save(p,label){await p.locator('#save_button').click();const s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));fs.writeFileSync('/tmp/yairpg-livelihood-'+label+'.json',JSON.stringify(s));return s;}
async function action(p,name){const selector=`[data-structured-action="reedbank.${name}"]`;await p.locator(selector).click();result.events.push(name);}
async function settled(p,name){await p.waitForFunction(id=>{const s=JSON.parse(localStorage.getItem('save data'));return s.expansion?.actors.player.completed['reedbank.'+id]>0;},name,{timeout:30000});}
async function job(p,name){await action(p,name);await settled(p,name);}
async function download(p,label){const pending=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file='/tmp/yairpg-livelihood-'+label+'.txt';await (await pending).saveAs(file);return file;}
async function reload(p){await p.reload({waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button:not(.none_display)').click();}
async function literalImport(p,file){await Promise.all([p.waitForEvent('domcontentloaded',{timeout:90000}),p.locator('#saved_file_input').setInputFiles(file)]);await p.locator('#loading_screen_play_button:not(.none_display)').click();}
function owned(s,actor,name){return s.expansion.simulation.owners[actor][key(name)]||0;}
function coherent(a,b){for(const field of ['actors','worlds','simulation']){
 if(field==='simulation'){for(const f of ['owners','knowledge','relationships','claims','people','jobs'])assert.deepEqual(b.expansion.simulation[f],a.expansion.simulation[f],f);}
 else assert.deepEqual(b.expansion[field],a.expansion[field],field);
 }assert.deepEqual(b.inventories,a.inventories,'inventory');assert.equal(b.character.money,a.character.money,'money');assert.deepEqual(b.content_packs,a.content_packs,'origin');assert.equal(b['current location'],a['current location'],'location');}
(async()=>{
 await new Promise(r=>server.listen(port,'127.0.0.1',r));browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const {p,ctx}=await start(1,'Reedbank Proof');
 let s=await save(p,'opening');assert.equal(s.expansion.simulation.people.player.body.hands,2);
 assert(await p.locator('[data-structured-action="reedbank.access"]').isEnabled());assert(await p.locator('[data-structured-action="reedbank.leave"]').isEnabled());result.checks.twoImmediateChoices=true;
 await action(p,'access');await action(p,'take_basket');await job(p,'repair_basket');await action(p,'deliver_basket');
 s=await save(p,'first-delivered');assert.equal(owned(s,'reedbank.sella','basket_fixed'),1);assert.equal(s.character.money,104);result.checks.firstUsefulRecipientCycle=true;
 await action(p,'take_crate');assert(await p.locator('[data-structured-action="reedbank.repair_crate"]').isDisabled());result.checks.beforeMethodUnavailable=true;
 await action(p,'learn');await p.locator('[data-structured-cancel]').click();
 s=await save(p,'lesson-cancelled');assert.equal(s.character.money,104);assert(!s.expansion.simulation.knowledge.player['reedbank.bracing']);assert.equal(s.expansion.simulation.jobs.length,0);result.checks.realCancellationRefund=true;
 await job(p,'learn');assert(await p.locator('[data-structured-action="reedbank.repair_crate"]').isEnabled());result.checks.afterMethodAvailable=true;
 const midFile=await download(p,'learned');const mid=await save(p,'learned-exported');await reload(p);coherent(mid,await save(p,'learned-reloaded'));await literalImport(p,midFile);coherent(mid,await save(p,'learned-imported'));result.checks.intermediateLiteralRestoration=true;
 await job(p,'joint_crate');s=await save(p,'joint-made');assert.equal(s.expansion.actors['reedbank.mara'].resources.attention,0);assert.equal(owned(s,'reedbank.mara','wood'),0);assert.equal(owned(s,'reedbank.mara','kit'),1);result.checks.colleagueOwnMeans=true;
 await action(p,'deliver_crate_joint');s=await save(p,'second-delivered');assert.equal(owned(s,'reedbank.sella','crate_fixed'),1);assert.equal(s.expansion.actors['reedbank.mara'].resources.coins,5);assert.equal(s.character.money,105);result.checks.secondUsefulCycleAndSplitPay=true;
 await job(p,'leave');const returnFile=await download(p,'lane');const lane=await save(p,'lane-exported');await reload(p);coherent(lane,await save(p,'lane-reloaded'));await literalImport(p,returnFile);coherent(lane,await save(p,'lane-imported'));result.checks.sameLifeLeaveRestore=true;
 await job(p,'return');await action(p,'remember');s=await save(p,'later');assert(s.expansion.actors.player.facts['reedbank.offer']);assert(s.expansion.simulation.knowledge.player['reedbank.later'].cause);result.checks.historyDependentOpportunity=true;
 await job(p,'routine');s=await save(p,'continued');assert.equal(owned(s,'reedbank.sella','fitting'),1);assert.equal(s.character.money,107);result.checks.continuedOrdinaryPaidPlay=true;
 const finalFile=await download(p,'final');const final=await save(p,'final-exported');await reload(p);coherent(final,await save(p,'final-reloaded'));await literalImport(p,finalFile);coherent(final,await save(p,'final-imported'));result.checks.finalLiteralRestoration=true;
 assert(await p.locator('[data-structured-action="reedbank.routine"]').isEnabled(),'Ordinary work must remain writable after final restoration');
 result.checks.writableAfterLiteralRestoration=true;
 result.primary={start:s.content_packs.structured.startId,life:s.content_packs.structured.lifeId,finalMoney:s.character.money,deliveredBasket:owned(s,'reedbank.sella','basket_fixed'),deliveredCrate:owned(s,'reedbank.sella','crate_fixed'),fittings:owned(s,'reedbank.sella','fitting')};
 await p.screenshot({path:out+'/primary.png',fullPage:true});fs.writeFileSync(out+'/primary-ui.txt',await p.locator('#structured_pack_panel').innerText());await ctx.close();
 const secondary=await start(0xffffffff,'One Hand Proof');const q=secondary.p;s=await save(q,'secondary-opening');assert.equal(s.expansion.simulation.people.player.body.hands,1);
 assert(await q.locator('[data-structured-action="reedbank.access"]').isEnabled());assert(await q.locator('[data-structured-action="reedbank.leave"]').isEnabled());await action(q,'access');await action(q,'take_basket');await job(q,'repair_basket');await action(q,'deliver_basket');s=await save(q,'secondary-first');assert.equal(owned(s,'reedbank.sella','basket_fixed'),1);assert.equal(s.character.money,104);assert.equal(s.expansion.simulation.people.player.body.hands,1);result.checks.secondaryNaturalFirstCycle=true;await q.screenshot({path:out+'/secondary.png',fullPage:true});await secondary.ctx.close();
 assert.equal(result.errors.length,0);assert.equal(sha(fs.readFileSync('dist/bundle.js')),bundle);result.status='PASS';
})().catch(e=>{result.status='FAIL';result.failure=e.stack;console.error(e);}).finally(async()=>{fs.writeFileSync(out+'/RESULT.json',JSON.stringify(result,null,2));if(browser)await browser.close();server.closeAllConnections();server.close();console.log(JSON.stringify({status:result.status,checks:result.checks,failure:result.failure}));});
