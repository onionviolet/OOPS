const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const repo=process.cwd(),root=process.env.ROOT,dir=__dirname,baselines=[];if(!root)throw Error('ROOT immutable build output required');
let origin;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),url='http://127.0.0.1:0/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,url);if(u.pathname==='/'){
 let s=fs.readFileSync(root+'/index.html','utf8');if(u.searchParams.has('baseline'))s=s.replace(/dist\/bundle\.js\?version=[^"&]+/,`baseline-${u.searchParams.get('baseline')}.js`);res.setHeader('content-type','text/html');return res.end(s);}
 const baseline=baselines.find(b=>u.pathname===`/baseline-${b.name}.js`),file=baseline?.bundle||path.join(root,decodeURIComponent(u.pathname));
 if((!baseline&&!file.startsWith(root+'/'))||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const project=s=>({owner:s.expansion.lotm,actors:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.'))),knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,inventory:Object.fromEntries(Object.entries(s.inventories.person).filter(([,v])=>Object.keys(v).length)),conditions:s.expansion.simulation.conditions,staminaToFull:s.character.stamina_to_full,energies:s.expansion.simulation.energies,powers:s.expansion.simulation.powers,faculties:s.expansion.simulation.faculties,people:s.expansion.simulation.people,claims:s.expansion.simulation.claims,money:s.character.money,location:s['current location']});
async function fixture(browser,baseline){
 const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'?lotm_probe=1&test_hooks=1'+(baseline?'&baseline='+baseline:''));await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{if(await p.locator('#lotm_panel').isVisible())return;await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 const button=id=>p.locator(`#lotm_panel [data-lotm="${id}"]`);
 const click=async id=>{await open();assert.equal(await button(id).isDisabled(),false,id);await button(id).click();console.log('clicked',id);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:false}),n);
 const resume=async()=>{await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());await open();};
 const importLiteral=async encoded=>{await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'e1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await resume();};
 const roundtrip=async perturb=>{await p.evaluate(()=>saveProgress());const before=project(await snap());await p.reload();await resume();assert.deepEqual(project(await snap()),before,'Save/reload exact');const encoded=await p.evaluate(()=>save_to_file());const exported=project(await snap());await perturb();assert.notDeepEqual(project(await snap()),exported);await importLiteral(encoded);assert.deepEqual(project(await snap()),exported,'literal Import exact');return {exportChars:encoded.length,exportSha256:sha(encoded),projectSha256:sha(JSON.stringify(exported))};};
 await open();return {c,p,errors,snap,open,button,click,ticks,importLiteral,roundtrip};
}

(async()=>{
 const result={bundleSha256:sha(fs.readFileSync(root+'/dist/bundle.js')),persistence:[]};
 await new Promise((r,j)=>server.listen(0,'127.0.0.1',r).once('error',j));origin=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const f=await fixture(browser);
  for(const id of ['enroll_storm','book.lotm.report_in_storm','book.lotm.accept_allocation_sa','book.lotm.ingest_sa'])await f.click(id);
  assert.equal(await f.button('book.lotm.recover_dock_manifest').isDisabled(),true);
  for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
   await f.p.setViewportSize({width,height});await f.p.evaluate(px=>{const n=document.querySelector('#lotm_panel');for(const el of [document.documentElement,n])for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])el.style.setProperty(k,px+'px');n.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
   await f.button('book.lotm.recover_dock_manifest').scrollIntoViewIfNeeded();await f.p.screenshot({path:dir+`/power-work-blocked-${width}-${px}.png`});
  }
  const before=await f.snap();await f.click('book.lotm.ab.deep_breath');
  const after=await f.snap();assert.ok(after.expansion.simulation.conditions.player['book.lotm.long_breath']);
  assert.ok(after.expansion.simulation.conditions.player['book.lotm.slick_scales']);
  result.ability={beforeStaminaToFull:before.character.stamina_to_full,afterStaminaToFull:after.character.stamina_to_full};assert.equal(after.character.stamina_to_full,before.character.stamina_to_full+2);
  assert.equal(await f.button('book.lotm.recover_dock_manifest').isDisabled(),false);
  await f.click('book.lotm.recover_dock_manifest');await f.ticks(2);
  result.persistence.push({state:'pending',...await f.roundtrip(()=>f.click('cancel'))});
  const paidBefore=(await f.snap()).character.money;await f.ticks(3);
  assert.equal((await f.snap()).character.money,paidBefore+24);
  assert.equal((await f.snap()).expansion.actors.player.completed['book.lotm.recover_dock_manifest'],1);
  result.persistence.push({state:'completed',...await f.roundtrip(()=>f.click('lotm.move.workroom'))});
  await f.ticks(5);assert.equal((await f.snap()).character.money,paidBefore+24,'no replay payment');
  await f.click('book.lotm.reflect_work_sa');assert.equal((await f.snap()).expansion.actors.player.resources['book.lotm.sa.acting'],1);
  assert.equal(await f.button('book.lotm.reflect_work_sa').isDisabled(),true);
  result.persistence.push({state:'Sailor reflection',...await f.roundtrip(()=>f.click('lotm.move.workroom'))});
  assert.equal((await f.snap()).expansion.actors.player.resources['book.lotm.sa.acting'],1);
  const shots=[];
  for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
   await f.p.setViewportSize({width,height});await f.p.evaluate(px=>{const n=document.querySelector('#lotm_panel');for(const el of [document.documentElement,n])for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])el.style.setProperty(k,px+'px');n.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
   await f.button('book.lotm.recover_dock_manifest').scrollIntoViewIfNeeded();
   const geometry=await f.p.evaluate(()=>{const n=document.querySelector('#lotm_panel'),b=n.querySelector('[data-lotm="book.lotm.recover_dock_manifest"]');return {pageWidth:document.documentElement.scrollWidth,panelWidth:n.clientWidth,panelContentWidth:n.scrollWidth,font:getComputedStyle(b).fontSize};});
   assert.ok(geometry.pageWidth<=width+2);assert.ok(geometry.panelContentWidth<=geometry.panelWidth+1);assert.equal(geometry.font,px+'px');
   const file=`power-work-${width}-${px}.png`;await f.p.screenshot({path:dir+'/'+file});shots.push({width,height,px,geometry,file});
  }
  result.matrix=shots;result.errors=f.errors;assert.deepEqual(f.errors,[]);result.route='Fresh Storm life, report, allocated Sailor dose, ingestion, deep breath, paid manifest recovery; no gameplay grants';
  const sf=await fixture(browser);for(const id of ['enroll_machinery','book.lotm.report_in_machinery','book.lotm.accept_allocation_sv','book.lotm.ingest_sv'])await sf.click(id);
  const svActs=async()=>((await sf.snap()).expansion.actors.player.resources['book.lotm.sv.acting']||0);
  await sf.click('book.lotm.errand_machinery');await sf.ticks(10);assert.equal(await svActs(),0);await sf.click('cancel');assert.equal(await svActs(),0);
  await sf.click('book.lotm.errand_machinery');await sf.ticks(20);assert.equal(await svActs(),0);
  await sf.click('book.lotm.reflect_work_sv');assert.equal(await svActs(),1);assert.equal(await sf.button('book.lotm.reflect_work_sv').isDisabled(),true);
  result.persistence.push({state:'Savant reflection',...await sf.roundtrip(()=>sf.click('lotm.move.docks'))});assert.equal(await svActs(),1);
  for(let i=0;i<3;i++){await sf.click('book.lotm.errand_machinery');await sf.ticks(20);await sf.click('book.lotm.reflect_work_sv');}
  assert.equal(await svActs(),4);assert.equal(await sf.button('book.lotm.request_prescreen_sv').isDisabled(),false);
  await sf.p.screenshot({path:dir+'/role-outcome-savant-settled.png'});await sf.click('book.lotm.request_prescreen_sv');assert.deepEqual(sf.errors,[]);
  result.roleOutcomes={sailorActs:1,savantActs:4,pendingCancelledZero:true,noReplay:true,existingPrescreenEligible:true,errors:sf.errors};await sf.c.close();
  fs.writeFileSync(dir+'/role-outcomes-result.json',JSON.stringify(result,null,2)+'\n');await f.c.close();console.log('PASS power work, pending and completed persistence, desktop matrix');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
