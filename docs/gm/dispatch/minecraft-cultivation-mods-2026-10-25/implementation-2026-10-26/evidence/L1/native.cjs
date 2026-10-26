const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const root='/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/L1-proof-build',dir=process.cwd()+'/docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L1',baselines=[];
let origin;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),url='http://127.0.0.1:0/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,url);if(u.pathname==='/'){
 let s=fs.readFileSync(root+'/index.html','utf8');if(u.searchParams.has('baseline'))s=s.replace(/dist\/bundle\.js\?version=[^"&]+/,`baseline-${u.searchParams.get('baseline')}.js`);res.setHeader('content-type','text/html');return res.end(s);}
 const baseline=baselines.find(b=>u.pathname===`/baseline-${b.name}.js`),file=baseline?.bundle||path.join(root,decodeURIComponent(u.pathname));
 if((!baseline&&!file.startsWith(root+'/'))||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const project=s=>({owner:{lotm:s.expansion.lotm,mol:s.expansion.motherOfLearning},actors:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.')||k.startsWith('book.mol.'))),knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,inventory:Object.fromEntries(Object.entries(s.inventories.person).filter(([,v])=>Object.keys(v).length)),energies:s.expansion.simulation.energies,powers:s.expansion.simulation.powers,faculties:s.expansion.simulation.faculties,people:s.expansion.simulation.people,claims:s.expansion.simulation.claims,money:s.character.money,location:s['current location']});
async function fixture(browser,baseline){
 const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'?lotm_probe=1&test_hooks=1'+(baseline?'&baseline='+baseline:''));await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{if(await p.locator('#lotm_panel').isVisible())return;await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 const button=id=>p.locator(`#lotm_panel [data-lotm="${id}"]`);
 const click=async id=>{await open();assert.equal(await button(id).isDisabled(),false,id);await button(id).click();console.log('clicked',id);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:false}),n);
 const resume=async()=>{await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());await open();};
 const importLiteral=async encoded=>{try{await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded',timeout:12000}),p.locator('#saved_file_input').setInputFiles({name:'e1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);}catch(e){fs.writeFileSync(dir+'/import-failure.txt',await p.locator('body').innerText());await p.screenshot({path:dir+'/import-failure.png'});throw e;}await resume();};
 const roundtrip=async perturb=>{await p.evaluate(()=>saveProgress());const before=project(await snap());await p.reload();await resume();assert.deepEqual(project(await snap()),before,'Save/reload exact');const encoded=await p.evaluate(()=>save_to_file());const exported=project(await snap());await perturb();assert.notDeepEqual(project(await snap()),exported);await importLiteral(encoded);assert.deepEqual(project(await snap()),exported,'literal Import exact');return {exportChars:encoded.length,exportSha256:sha(encoded),projectSha256:sha(JSON.stringify(exported))};};
 await open();return {c,p,errors,snap,open,button,click,ticks,importLiteral,roundtrip};
}

const {openNotebook}=require(process.cwd()+'/scripts/ui_helpers.cjs');
const expectedBundle=sha(fs.readFileSync(root+'/dist/bundle.js'));
async function matrix(f,selector,prefix){const results=[];
 for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  await f.p.setViewportSize({width,height});
  await f.p.evaluate(({selector,px})=>{document.documentElement.style.setProperty('--options_base_font_size',px+'px');document.documentElement.style.fontSize=px+'px';const style=document.createElement('style');style.textContent=`${selector}, ${selector} p, ${selector} span, ${selector} small, ${selector} button, ${selector} summary {font-size:${px}px!important}`;document.head.append(style);},{selector,px});
  await f.p.locator(prefix==='planner'?'[data-lotm-plan]':selector).scrollIntoViewIfNeeded();
  const g=await f.p.locator(selector).evaluate(n=>({pageWidth:document.documentElement.scrollWidth,panelWidth:n.clientWidth,contentWidth:n.scrollWidth,font:getComputedStyle(n.querySelector('p')).fontSize,report:!!document.querySelector('#message_log_div')?.getBoundingClientRect().height}));
  assert.ok(g.pageWidth<=width+2,JSON.stringify(g));assert.ok(g.contentWidth<=g.panelWidth+2,JSON.stringify(g));assert.equal(g.font,px+'px');assert.equal(g.report,true);
  const screenshot=`${prefix}-${width}x${height}-${px}px.png`;await f.p.screenshot({path:dir+'/'+screenshot});results.push({width,height,px,...g,screenshot});
 }
 return results;
}
(async()=>{await new Promise((r,j)=>server.listen(0,'127.0.0.1',r).once('error',j));origin=`http://127.0.0.1:${server.address().port}/`;const browser=await chromium.launch({headless:true,channel:'chrome'}),result={bundleSha256:expectedBundle,indexSha256:sha(fs.readFileSync(root+'/index.html')),origin,persistence:[]};
 try{
  if(!process.argv.includes('--people-only')){const f=await fixture(browser),plan=()=>f.p.locator('[data-lotm-plan]');
  await f.click('enroll');assert.match(await plan().innerText(),/Prepare this current body/);
  let before=project(await f.snap());await f.click('plan_book.lotm.report_in');assert.deepEqual(project(await f.snap()),before);
  assert.equal(await f.p.evaluate(()=>document.activeElement.querySelector('[data-lotm]')?.dataset.lotm),'book.lotm.report_in');
  await f.click('book.lotm.report_in');await f.click('book.lotm.accept_allocation');assert.match(await plan().innerText(),/recorded preparations are met/);
  const ready=project(await f.snap());assert.equal(ready.actors.player.sources['book.lotm.seer'],undefined);
  await f.click('plan_book.lotm.ingest');assert.deepEqual(project(await f.snap()),ready);await f.click('book.lotm.ingest');
  assert.match(await plan().innerText(),/Sequence 8/);assert.match(await plan().innerText(),/0\/6/);assert.match(await plan().innerText(),/Risk:/);assert.doesNotMatch(await plan().innerText(),/Sequence 7|Savant/);
  if(process.argv.includes('--planner-capture-only')){result.plannerMatrix=await matrix(f,'#lotm_panel','planner');result.planner={findNoSpend:true,heldDoseNotPromotion:true,changedSupply:true,route:'fresh native test entry to earned Seer',errors:f.errors};fs.writeFileSync(dir+'/planner-visual.json',JSON.stringify(result,null,2)+'\n');await f.c.close();return;}
  await f.click('book.lotm.lesson');await f.ticks(5);await f.click('book.lotm.act_reading');await f.ticks(10);
  assert.match(await plan().innerText(),/1\/6/);result.persistence.push({kind:'earned Seer one act',...await f.roundtrip(()=>f.click('lotm.move.lodging'))});
  result.plannerMatrix=await matrix(f,'#lotm_panel','planner');assert.deepEqual(f.errors,[]);result.planner={route:'fresh native probationer test entry; native allocation, ingestion, lesson and completed act',findNoSpend:true,heldDoseNotPromotion:true,changedSupply:true,errors:f.errors};await f.c.close();fs.writeFileSync(dir+'/planner-result.json',JSON.stringify(result,null,2)+'\n');if(process.argv.includes('--planner-only')){console.log('PASS planner native route, no-spend navigation, persistence and desktop matrix');return;}}
  const m=await fixture(browser);const fixturePath='/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/L1-private/current-mol-fixture.txt';await m.importLiteral(fs.readFileSync(fixturePath,'utf8'));
  const people=async()=>{await m.p.locator('[data-route-id="known-people"]').click();await m.p.locator('#known_people_panel').waitFor({state:'visible'});};await people();
  for(const id of ['book.mol.ilsa','book.mol.nora']){const card=m.p.locator(`[data-known-person="${id}"]`);await card.locator('summary').click();assert.match(await card.innerText(),/Known capabilities and services/);assert.match(await card.innerText(),/Observed|Told to you/);}
  result.peopleBefore=await m.p.locator('#known_people_panel').innerText();assert.doesNotMatch(result.peopleBefore,/private.workshop|personalMana|Hidden room/);
  result.peopleMatrix=await matrix(m,'#known_people_panel','people');fs.writeFileSync(dir+'/people-visual.json',JSON.stringify(result,null,2)+'\n');
  // The imported synthetic fixture owns a pending paid Xvim lesson. Return its
  // reservation, then pay through the real service and finish once.
  await m.p.locator('#center_mode_back').click();
  await m.p.getByRole('button',{name:'Notebook',exact:true}).click();await m.p.locator('[data-notebook-view="here"]').click();
  await m.p.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});
  const pending=await m.snap(),crowns=pending.expansion.actors.player.resources['book.mol.crowns'];
  fs.writeFileSync(dir+'/mol-buttons.json',JSON.stringify(await m.p.locator('#feature_expansion_panel button').allTextContents(),null,2));const lesson=m.p.getByRole('button',{name:/Practice manual brightness, key and occlusion control with Xvim/});await lesson.click();assert.equal((await m.snap()).expansion.actors.player.resources['book.mol.crowns'],crowns-2);await m.ticks(4);
  const done=await m.snap();assert.equal(done.expansion.actors.player.facts['book.mol.controlTrained'],true);result.appointment={paidTwoCrowns:true,completed:true,fixture:fixturePath};
  await people();assert.match(await m.p.locator('#known_people_panel').innerText(),/Known capabilities and services/);
  result.peoplePersistence=await m.roundtrip(async()=>{await m.p.locator('#center_mode_back').click();await m.p.getByRole('button',{name:'Notebook',exact:true}).click();await m.p.locator('[data-notebook-view="here"]').click();await m.p.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});await m.p.getByRole('button',{name:/Walk to Cyoria formula workshop$/}).click();});
  assert.deepEqual(m.errors,[]);result.peopleErrors=m.errors;await m.c.close();fs.writeFileSync(dir+'/result.json',JSON.stringify(result,null,2)+'\n');console.log('PASS qualified person accounts, paid appointment, persistence and desktop matrix');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
