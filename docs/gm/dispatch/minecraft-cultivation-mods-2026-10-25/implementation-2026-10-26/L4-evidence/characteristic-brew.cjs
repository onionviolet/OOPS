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
const project=s=>({clock:s.expansion.clock,owner:s.expansion.lotm,actors:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.'))),knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,inventory:Object.fromEntries(Object.entries(s.inventories.person).filter(([,v])=>Object.keys(v).length)),conditions:s.expansion.simulation.conditions,staminaToFull:s.character.stamina_to_full,energies:s.expansion.simulation.energies,powers:s.expansion.simulation.powers,faculties:s.expansion.simulation.faculties,people:s.expansion.simulation.people,claims:s.expansion.simulation.claims,money:s.character.money,location:s['current location']});
async function fixture(browser,baseline){
 const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'?lotm_probe=1&test_hooks=1'+(baseline?'&baseline='+baseline:''));await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{if(await p.locator('#lotm_panel').isVisible())return;await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 const button=id=>p.locator(`#lotm_panel [data-lotm="${id}"]`).first();
 const click=async id=>{await open();assert.equal(await button(id).isDisabled(),false,id);await button(id).click();console.log('clicked',id);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:false}),n);
 const resume=async()=>{await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());await open();};
 const importLiteral=async encoded=>{await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'e1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await resume();};
 const roundtrip=async perturb=>{await p.evaluate(()=>saveProgress());const before=project(await snap());await p.reload();await resume();assert.deepEqual(project(await snap()),before,'Save/reload exact');const encoded=await p.evaluate(()=>save_to_file());const exported=project(await snap());await perturb();assert.notDeepEqual(project(await snap()),exported);await importLiteral(encoded);assert.deepEqual(project(await snap()),exported,'literal Import exact');return {exportChars:encoded.length,exportSha256:sha(encoded),projectSha256:sha(JSON.stringify(exported))};};
 await open();return {c,p,errors,snap,open,button,click,ticks,importLiteral,roundtrip};
}


const row=JSON.parse(fs.readFileSync(dir+'/characteristic-row.json')),core=JSON.parse(fs.readFileSync(dir+'/characteristic-core.json'));
const inventory=s=>s.inventories.person.main_character;
async function choose(f){await f.open();const select=f.p.locator('#lotm_panel [data-lotm="bench_select"]');if(!await select.isVisible())await f.p.locator('#lotm_panel summary').filter({hasText:'Brewing bench · formulas'}).click();await select.selectOption(row.id);}
async function go(f,k){await f.click('lotm.move.'+k);await f.ticks(40);}
async function funded(f){await f.p.evaluate(()=>saveProgress());await f.p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('save data'));d.character.money=5000;localStorage.setItem('save data',JSON.stringify(d));});await f.p.reload();await f.p.waitForFunction(()=>window.simulationTestHooks);await f.p.evaluate(()=>simulationTestHooks.pause());await f.p.getByText('PLAY',{exact:true}).click();await f.p.evaluate(()=>simulationTestHooks.pause());await f.open();assert.equal((await f.snap()).character.money,5000);}
(async()=>{const result={bundleSha256:sha(fs.readFileSync(root+'/dist/bundle.js')),route:'Named funded fresh Nighthawk broker-customer fixtures (5000 pence only; no stock, knowledge, source or progress grants)',routes:[]};
await new Promise((r,j)=>server.listen(0,'127.0.0.1',r).once('error',j));origin=`http://127.0.0.1:${server.address().port}/`;const browser=await chromium.launch({headless:true,channel:'chrome'});
try{for(const mode of ['core','materials']){
 const f=await fixture(browser),entry={mode,persistence:[]};await f.click('enroll');await f.click('book.lotm.report_in');await funded(f);await go(f,'docks');await choose(f);await f.click('book.lotm.bf_buy_'+row.id);
 if(mode==='core')for(const t of ['pay','verify','settle'])await f.click('book.lotm.lot_'+t+'_tc01');
 const inputs=row.slots.filter(s=>mode==='materials'||s.role==='aux');
 for(const sl of inputs.slice(0,mode==='core'?-1:inputs.length))await f.click('book.lotm.bf_ing_'+sl.slug);
 await go(f,'workroom');await choose(f);
 if(mode==='core'){
  assert.equal(await f.button('book.lotm.bf_core_'+row.id).isDisabled(),true,'missing auxiliary refuses');assert.match(await f.button('book.lotm.bf_core_'+row.id).innerText(),/TC01 held: 1.*Need TC01 and every auxiliary lot/s);assert.equal(inventory(await f.snap())[core.key].count,1);
  await go(f,'docks');await choose(f);await f.click('book.lotm.bf_ing_'+inputs.at(-1).slug);await go(f,'workroom');await choose(f);
 }
 await f.click('book.lotm.bf_'+(mode==='core'?'core_':'start_')+row.id);
 assert.equal(await f.button('book.lotm.bf_collect_'+row.id).isDisabled(),true,'timer not bypassed');
 if(mode==='core'){
  const snap=await f.snap();assert.equal(inventory(snap)[core.key]?.count||0,0);assert.equal(snap.expansion.actors.player.facts[core.committedFlag],true);assert.equal(snap.expansion.actors.player.facts['book.lotm.core.tc01.destination'],row.id);
  entry.persistence.push({state:'core pending',...await f.roundtrip(()=>f.click('lotm.move.lodging'))});await choose(f);
 }
 await f.ticks(row.minutes);await choose(f);await f.click('book.lotm.bf_collect_'+row.id);assert.equal(inventory(await f.snap())[row.product.key].count,1);entry.product=row.product.key;if(mode==='core')fs.writeFileSync(root+'/core-bottled-fixture.txt',await f.p.evaluate(()=>save_to_file()));
 if(mode==='core')for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  await f.p.setViewportSize({width,height});await f.p.evaluate(px=>{const n=document.querySelector('#lotm_panel');for(const el of [document.documentElement,n])for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])el.style.setProperty(k,px+'px');n.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
  await f.button('book.lotm.bf_core_'+row.id).scrollIntoViewIfNeeded();const g=await f.p.evaluate(()=>{const n=document.querySelector('#lotm_panel'),b=n.querySelector('[data-lotm="book.lotm.bf_core_visionary_9"]');return {page:document.documentElement.scrollWidth,panel:n.clientWidth,content:n.scrollWidth,font:getComputedStyle(b).fontSize};});assert.ok(g.page<=width+2);assert.ok(g.content<=g.panel+1);assert.equal(g.font,px+'px');await f.p.screenshot({path:dir+`/core-brew-${width}-${px}.png`});(entry.matrix||=[]).push({width,height,px,...g});
 }
 await f.click('book.lotm.drink_vi9');assert.ok((await f.snap()).expansion.actors.player.sources['book.lotm.spectator']);assert.equal(inventory(await f.snap())[row.product.key]?.count||0,0);
 await go(f,'docks');await f.click('book.lotm.act_watch');await f.ticks(20);assert.equal((await f.snap()).expansion.actors.player.resources['book.lotm.vi.acting'],1);
 entry.persistence.push({state:mode+' dose ingested and used',...await f.roundtrip(()=>f.click('lotm.move.workroom'))});entry.errors=f.errors;assert.deepEqual(f.errors,[]);result.routes.push(entry);await f.c.close();
}assert.equal(result.routes[0].product,result.routes[1].product);fs.writeFileSync(dir+'/characteristic-result.json',JSON.stringify(result,null,2)+'\n');console.log('PASS both brew routes, same dose and source use, core conservation, three literal persistence checkpoints and desktop matrix');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
