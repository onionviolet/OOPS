// Named starting-material fixture; all entry, apparatus, preparation and use earned.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
const SNAP=process.env.W5_SNAPSHOT||'/Users/weiwei/.codex/research/weather-w5-2026-10-26/snapshot';
const OUTPUT=path.join(SNAP,'output'),E=import.meta.dirname;
const {launchChrome,advanceGameMinutes}=createRequire(path.join(SNAP,'package.json'))('./scripts/ui_helpers.cjs');
const server=createServer(async(req,res)=>{try{let target=path.resolve(OUTPUT,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));assert.ok(target===OUTPUT||target.startsWith(OUTPUT+'/'));if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.json':'application/json','.png':'image/png'})[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
page.setDefaultTimeout(20000);const errors=[],receipt={route:'Named starting-material/linen fixture; earned wages/entry/lease, finite care, actual nursery log -> measured wash -> retained dry staves -> kit -> finite commission, real frozen travel',origin,errors,roundtrips:[]};
page.on('pageerror',e=>errors.push(e.stack));await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
const P='book.paradise',F=P+'.campaign.',R=P+'.drying.rack',key=id=>JSON.stringify({id}),LOG=key('Rough wood log'),ROPE=key('Survey rope'),KIT=key('Prepared survey kit'),COAL=key('Charcoal');
const snapshot=()=>page.evaluate(()=>simulationTestHooks.snapshot());
const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.locator('#loading_screen_play_button:not(.none_display)').click();await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed'||document.querySelector('#hero_creation_panel_confirmation')?.getClientRects().length);const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed'&&simulationTestHooks.saveStatus().ownsSave);await page.evaluate(()=>simulationTestHooks.pause());};
const panel=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;n.querySelectorAll('details').forEach(d=>d.open=true);});};
const button=re=>page.locator('#feature_expansion_panel button').filter({hasText:re}).first();
async function click(re){await panel();const b=button(re);await b.waitFor({state:'visible'});if(await b.isDisabled())throw Error('Disabled '+re+': '+await b.evaluate(n=>n.parentElement.innerText));await b.click();await page.waitForTimeout(150);}
const step=n=>advanceGameMinutes(page,n);
async function act(re,id,minutes=0){await click(re);if(minutes){await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),id);await step(minutes);}await page.waitForFunction(id=>(simulationTestHooks.snapshot().expansion.actors.player.completed[id]||0)>0,id);}
const save=async()=>{await page.evaluate(()=>saveProgress());return snapshot();};
const digest=s=>JSON.stringify({expansion:s.expansion,inventory:s.inventories.person.main_character,bookOwners:s.inventories.book_world_campaign,metadata:s.book_world_campaign_native,currentTime:s['current time']});
const held=s=>s.expansion.simulation.owners[R],moistures=s=>Object.keys(held(s)).map(k=>JSON.parse(k).drying.moisture);
async function roundtrip(name){const before=await save(),literal=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(E,name+'.save.txt'),literal);await page.reload();await boot();assert.equal(digest(await snapshot()),digest(before),name+' native reload');await Promise.all([page.waitForEvent('load'),page.evaluate(x=>load_progress(x),literal)]);await boot();assert.equal(digest(await snapshot()),digest(before),name+' literal import');await panel();receipt.roundtrips.push(name);return before;}
const focus=async card=>card.evaluate(el=>{el.scrollIntoView({block:'start',inline:'nearest'});let p=el.parentElement;while(p){if(p.scrollHeight>p.clientHeight+1&&/(auto|scroll)/.test(getComputedStyle(p).overflowY)){p.scrollTop=Math.max(0,p.scrollTop-100);break;}p=p.parentElement;}});
try{
 receipt.bundleHash=createHash('sha256').update(await fs.readFile(path.join(OUTPUT,'dist/bundle.js'))).digest('hex');await page.goto(origin+'/?test_hooks=1');await boot();
 const fixture=await snapshot();for(const [k,count]of [[LOG,30],[ROPE,12],[KIT,4],[COAL,3],[key('Linen cloth'),5]])fixture.inventories.person.main_character[k]={count};
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await page.reload();await boot();
 const a=page.locator('#location_actions_div');await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();for(const id of ['hello','what happened','ask to leave 1','need to']){const line=a.locator('.dialogue_textline[data-textline="'+id+'"]');await line.waitFor({state:'visible'});await line.evaluate(n=>n.click());await line.waitFor({state:'detached'});}await page.evaluate(()=>end_dialogue());await step(3);
 await click(/Begin an optional record of local care/);await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.simulation);
 await act(/Read the parallel-entry/,P+'.chart');await click(/Choose independent Paradise entry/);await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.bookWorldCampaign);
 await click(/Enter the independent contractor district/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.paradise.hub');
 await act(/Meet the independent service desk/,P+'.hub_meet');await act(/Accept the funded packing shift/,P+'.hub_shift',5);
 await act(/Open the extended craft, danger and return terms/,F+'hub.begin');await act(/Build your own paid-district bench/,F+'hub.bench',5);
 await act(/Build a spaced drying rack/,F+'hub.drying_rack',3);await act(/Fit cross-ventilation/,F+'hub.drying_vents',2);

 const N='book.paradise.ecology.nursery',EF=F+'hub.environment_';
 const inv=s=>s.inventories.person.main_character,node=s=>JSON.parse(s.expansion.actors[N].facts['ecology.node']||'null'),facts=s=>s.expansion.actors[N].facts;
 let current=await save(),coins=current.expansion.actors.player.resources[P+'.coin'];
 await click(/Lease two rooted coppice stools/);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),F+'hub.ecology_lease');await roundtrip('lease-pending');await click(/Cancel work/);current=await save();assert.equal(current.expansion.actors.player.resources[P+'.coin'],coins);assert.equal(current.expansion.actors[N],undefined);
 await act(/Lease two rooted coppice stools/,F+'hub.ecology_lease',3);current=await roundtrip('nursery-paid');assert.equal(current.expansion.actors.player.resources[P+'.coin'],coins-4);assert.equal(await button(/Lease two rooted coppice stools/).count(),0);
 const logs=inv(current)[LOG].count;await click(/Gather one mature coppice cut/);current=await save();assert.equal(inv(current)[LOG].count,logs+1);assert.equal(node(current).stock,1);
 await click(/Gather one mature coppice cut/);current=await roundtrip('source-exhausted');assert.equal(inv(current)[LOG].count,logs+2);assert.equal(node(current).stock,0);assert.equal(await button(/Gather one mature coppice cut/).isDisabled(),true);assert.match(await page.locator('#feature_expansion_panel').innerText(),/stored\/supplied logs/);
 const pure=digest(current);await panel();await panel();assert.equal(digest(await snapshot()),pure);await step(13);await panel();assert.match(await page.locator('#feature_expansion_panel').innerText(),/0\/2 mature cuts/);
 await act(/Order the finite sealed wash crate/,EF+'buy',2);current=await save();const clear=Object.keys(inv(current)).find(k=>JSON.parse(k).environmentWater?.kind==='clear'),clearBefore=inv(current)[clear].count;
 assert.equal(await button(/Tend rooted stools.*Brackish workshop water/).isDisabled(),true);assert.equal(await button(/Tend rooted stools.*Cloudy workshop water/).isDisabled(),true);
 await click(/Tend rooted stools.*Clear workshop water/);current=await roundtrip('finite-water-care');assert.equal(inv(current)[clear].count,clearBefore-1);assert.equal(facts(current)['ecology.water'],clear);assert.equal(facts(current)['ecology.fedUntil']-facts(current)['ecology.caredAt'],1440);assert.equal(facts(current)['ecology.cares'],1);assert.equal(await button(/Tend rooted stools.*Clear workshop water/).isDisabled(),true);
 await step(37);current=await roundtrip('fractional-supported-growth');const beforeClock=current.expansion.bookWorldCampaign.instances.find(i=>i.worldId===P+'.hub').clock.elapsed,care=JSON.stringify(facts(current));
 await click(/Return to Village in your retained body/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='base.frontier');await step(100);current=await roundtrip('absent-nursery');assert.equal(current.expansion.bookWorldCampaign.instances.find(i=>i.worldId===P+'.hub').clock.elapsed,beforeClock);assert.equal(JSON.stringify(facts(current)),care);
 await click(/Enter the independent contractor district/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.paradise.hub');current=await save();assert.equal(JSON.stringify(facts(current)),care);await step(684);await click(/Gather one mature coppice cut/);current=await roundtrip('regrown-native-log');assert.equal(inv(current)[LOG].count,logs+3);assert.equal(node(current).stock,0);assert.equal(node(current).carry,2);receipt.finiteCare=true;receipt.frozenTravel=true;
 const prior=inv(current),kit=prior[KIT].count;await act(/Wash and soften.*Clear workshop water/,EF+'soften',4);current=await roundtrip('source-log-prepared');assert.equal(inv(current)[LOG].count,logs+2);assert.equal(inv(current)[KIT].count,kit);assert.equal(inv(current)[clear],undefined);const wet=Object.keys(inv(current)).find(k=>JSON.parse(k).drying?.provenanceKey);assert.equal(inv(current)[wet].count,2);
 await click(/Place one damp stave/);await click(/Place one damp stave/);await step(12);current=await save();assert.ok(moistures(current).every(n=>n===0));await click(/Take one sound stave/);await click(/Take one sound stave/);await roundtrip('source-dry-native');
 await click(/Bind two dry staves/);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),F+'hub.drying_bind');await roundtrip('source-bind-pending');await step(3);current=await save();assert.equal(inv(current)[KIT].count,kit+1);
 coins=current.expansion.actors.player.resources[P+'.coin'];await act(/Supply district repair order 1/,F+'hub.commission_1',2);current=await roundtrip('source-paid-commission');assert.equal(current.expansion.actors.player.resources[P+'.coin'],coins+3);assert.equal(inv(current)[KIT].count,kit);receipt.actualConsumer=true;
 receipt.matrix=[];
 for(const [width,height]of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await page.setViewportSize({width,height});await page.locator('#workspace_navigation select').first().selectOption('customization');await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await panel();
  const b=button(/Gather one mature coppice cut/);await focus(b);const bounds=await b.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,overflow:el.scrollWidth>el.clientWidth+1}));assert.equal(bounds.overflow,false);
  const text=await page.locator('#feature_expansion_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));assert.equal(text.font,size);assert.equal(text.pageOverflow,false);await page.screenshot({path:path.join(E,`nursery-${width}-${size}.png`)});receipt.matrix.push({width,height,size,bounds,...text});
 }
 assert.deepEqual(errors,[]);console.log('PASS native paid nursery, standing source conservation, finite water/care, mid-growth/frozen travel/regrown useful log, literal persistence and desktop matrix');

}catch(error){receipt.failure=error.stack;await page.screenshot({path:path.join(E,'native-failure.png')});await fs.writeFile(path.join(E,'native-failure-ui.txt'),await page.locator('body').innerText());throw error;}
finally{await fs.writeFile(path.join(E,'native-result.json'),JSON.stringify(receipt,null,2)+'\n');await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
