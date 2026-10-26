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
 const privateDir=path.join(root,'artifact-proof');fs.mkdirSync(privateDir,{recursive:true});
 const result={bundleSha256:sha(fs.readFileSync(root+'/dist/bundle.js')),persistence:[]};
 await new Promise((r,j)=>server.listen(0,'127.0.0.1',r).once('error',j));origin=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const f=await fixture(browser),actor=async()=>((await f.snap()).expansion.actors),merit=async()=>((await actor()).player.resources['book.lotm.merit.nighthawks.earned']||0);
  for(const id of ['enroll','book.lotm.report_in','book.lotm.accept_allocation','book.lotm.ingest'])await f.click(id);
  assert.equal(await f.p.locator('#lotm_panel [data-lotm^="book.lotm.ab."]').count(),0,'unacquired ability offers absent');
  await f.click('book.lotm.request_sealed_3');assert.equal(await f.button('book.lotm.work_sealed_3_protocol').count(),0);
  await f.click('book.lotm.learn_sealed_3_protocol');await f.ticks(5);
  assert.equal(await f.button('book.lotm.work_sealed_3_protocol').isDisabled(),false);
  const shots=[];
  for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
   await f.p.setViewportSize({width,height});await f.p.evaluate(px=>{const n=document.querySelector('#lotm_panel');for(const el of [document.documentElement,n])for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])el.style.setProperty(k,px+'px');n.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
   await f.button('book.lotm.work_sealed_3_protocol').scrollIntoViewIfNeeded();
   const geometry=await f.p.evaluate(()=>{const n=document.querySelector('#lotm_panel'),b=n.querySelector('[data-lotm="book.lotm.work_sealed_3_protocol"]');return {pageWidth:document.documentElement.scrollWidth,panelWidth:n.clientWidth,panelContentWidth:n.scrollWidth,font:getComputedStyle(b).fontSize,text:b.textContent};});
   assert.ok(geometry.pageWidth<=width+2);assert.ok(geometry.panelContentWidth<=geometry.panelWidth+1);assert.equal(geometry.font,px+'px');
   const file=`g3-${width}-${px}.png`;await f.p.screenshot({path:privateDir+'/'+file});shots.push({width,height,px,geometry,file:privateDir+'/'+file});
  }
  result.matrix=shots;
  const startDebt=(await f.snap()).character.stamina_to_full;await f.click('book.lotm.work_sealed_3_protocol');const reservedDebt=(await f.snap()).character.stamina_to_full;assert.equal(reservedDebt,startDebt+3,'actual native handling reservation');await f.ticks(2);assert.equal(await merit(),0);
  result.persistence.push({state:'G3 pending',...await f.roundtrip(()=>f.click('cancel'))});
  await f.ticks(12);assert.equal(await merit(),0);const before=(await f.snap()).character.stamina_to_full;await f.ticks(1);
  const after=(await f.snap()).character.stamina_to_full;assert.equal(await merit(),2);assert.ok(after>=0);
  result.body={startDebt,reservedDebt,beforeCompletionDebt:before,afterCompletionDebt:after,chargedStamina:3,ordinaryRecoveryAllowed:true};
  result.persistence.push({state:'G3 complete',...await f.roundtrip(()=>f.click('book.lotm.return_sealed_3'))});
  await f.click('book.lotm.merit_case_file_copy');await f.ticks(30);assert.equal(await merit(),3);
  await f.click('book.lotm.merit_buy_sunflower_lot');assert.equal((await actor()).player.resources['book.lotm.merit.nighthawks.spent'],3);
  await f.click('book.lotm.return_sealed_3');assert.equal(await f.button('book.lotm.work_sealed_3_protocol').count(),0);
  assert.match(await f.button('book.lotm.merit_cold_room_watch').textContent(),/60 min/);
  result.errors=f.errors;assert.deepEqual(f.errors,[]);result.route='Fresh probationer report, actual allocation/ingestion, G3 issued, taught handling, actual work, earned merit spent at existing evidence store, return. No gameplay grants.';
  fs.writeFileSync(privateDir+'/result.json',JSON.stringify(result,null,2)+'\n');
  fs.writeFileSync(dir+'/artifact-result.json',JSON.stringify({bundleSha256:result.bundleSha256,persistence:result.persistence,body:result.body,errors:result.errors,route:result.route,matrix:result.matrix.map(({geometry,...v})=>({...v,geometry:{...geometry,text:undefined}})),privateResult:privateDir+'/result.json'},null,2)+'\n');
  await f.c.close();console.log('PASS G3 handling, actual body and merit consumer, literal persistence and four desktop/font cases');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
