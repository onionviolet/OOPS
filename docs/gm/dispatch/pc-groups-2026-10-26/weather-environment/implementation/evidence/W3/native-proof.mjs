// Named starting-material fixture; all entry, apparatus, preparation and use earned.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
const SNAP=process.env.W3_SNAPSHOT||'/Users/weiwei/.codex/research/weather-w3-2026-10-26/snapshot';
const OUTPUT=path.join(SNAP,'output'),E=import.meta.dirname;
const {launchChrome,advanceGameMinutes}=createRequire(path.join(SNAP,'package.json'))('./scripts/ui_helpers.cjs');
const server=createServer(async(req,res)=>{try{let target=path.resolve(OUTPUT,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));assert.ok(target===OUTPUT||target.startsWith(OUTPUT+'/'));if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.json':'application/json','.png':'image/png'})[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
page.setDefaultTimeout(20000);const errors=[],receipt={route:'Fresh native starting-owned-material fixture; real elder/entry/paid bench/rack/preparation/drying/binding/commission and travel',origin,errors,roundtrips:[]};
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
 if(process.env.W3_REIMPORT_PROOF==='1'){
 receipt.route='Reimport agent-earned W3 native exports into final refusal-corrected bundle; no new fixture grants';receipt.reimportProof=true;
 const restore=async name=>{const literal=await fs.readFile(path.join(E,name+'.save.txt'),'utf8');await Promise.all([page.waitForEvent('load'),page.evaluate(x=>load_progress(x),literal)]);await boot();await panel();};
 await restore('partial-native-cohort');assert.equal(await button(/Bind two dry staves/).isDisabled(),true);assert.match(await page.locator('#feature_expansion_panel').innerText(),/Dry and collect two staves/);await roundtrip('refusal-final');
 await restore('binding-pending');await roundtrip('binding-final');await click(/Cancel work/);let current=await save();const dryKeys=Object.keys(current.inventories.person.main_character).filter(k=>JSON.parse(k).drying?.moisture===0);assert.equal(dryKeys.length,2);assert.equal(await button(/Bind two dry staves/).isDisabled(),false);const kitBefore=current.inventories.person.main_character[KIT].count,moneyBefore=current.expansion.actors.player.resources[P+'.coin'];
 await act(/Bind two dry staves/,F+'hub.drying_bind',3);assert.equal((await save()).inventories.person.main_character[KIT].count,kitBefore+1);await act(/Supply district repair order 1/,F+'hub.commission_1',2);current=await roundtrip('commission-final');assert.equal(current.expansion.actors.player.resources[P+'.coin'],moneyBefore+3);receipt.actualConsumer=true;
 await restore('absent-rack');const frozen=JSON.stringify(held(await save()));await click(/Enter the independent contractor district/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.paradise.hub');assert.equal(JSON.stringify(held(await save())),frozen);await step(2);assert.equal(moistures(await save())[0],4000);receipt.frozenTravel=true;
 }else{
 const fixture=await snapshot();for(const [k,count]of [[LOG,30],[ROPE,12],[KIT,4],[COAL,3]])fixture.inventories.person.main_character[k]={count};
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);await page.reload();await boot();
 const a=page.locator('#location_actions_div');await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();for(const id of ['hello','what happened','ask to leave 1','need to']){const line=a.locator('.dialogue_textline[data-textline="'+id+'"]');await line.waitFor({state:'visible'});await line.evaluate(n=>n.click());await line.waitFor({state:'detached'});}await page.evaluate(()=>end_dialogue());await step(3);
 await click(/Begin an optional record of local care/);await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.simulation);
 await act(/Read the parallel-entry/,P+'.chart');await click(/Choose independent Paradise entry/);await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.bookWorldCampaign);
 await click(/Enter the independent contractor district/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.paradise.hub');
 await act(/Meet the independent service desk/,P+'.hub_meet');await act(/Accept the funded packing shift/,P+'.hub_shift',5);
 await act(/Open the extended craft, danger and return terms/,F+'hub.begin');await act(/Build your own paid-district bench/,F+'hub.bench',5);
 await act(/Build a spaced drying rack/,F+'hub.drying_rack',3);await act(/Fit a sliding cover/,F+'hub.drying_cover',3);await act(/Fit cross-ventilation/,F+'hub.drying_vents',2);
 const beforeCut=await save();await act(/Prepare two damp staves/,F+'hub.drying_cut',4);let s=await save();assert.equal(s.inventories.person.main_character[LOG].count,beforeCut.inventories.person.main_character[LOG].count-1);assert.equal(s.inventories.person.main_character[key('Wet repair stave')].count,2);
 await click(/Place one damp stave/);await click(/Place one damp stave/);await click(/Seal the lid/);await step(3);s=await roundtrip('sealed-batches');assert.deepEqual(moistures(s),[6000,6000]);await page.screenshot({path:path.join(E,'sealed-1920.png')});
 await click(/Open the lid/);const coal=s.inventories.person.main_character[COAL].count;await click(/Heat the open rack/);await step(2);s=await save();assert.deepEqual(moistures(s),[4000,4000]);assert.equal(s.inventories.person.main_character[COAL].count,coal-1);
 await click(/Take one damp stave/);await step(2);s=await roundtrip('partial-native-cohort');const carried=Object.keys(s.inventories.person.main_character).find(k=>JSON.parse(k).drying);assert.equal(JSON.parse(carried).drying.moisture,4000);assert.deepEqual(moistures(s),[2000]);
 await click(/Place one damp stave/);await step(12);s=await roundtrip('dried-rack');assert.deepEqual(moistures(s),[0,0]);await click(/Take one sound stave/);await click(/Take one sound stave/);s=await roundtrip('dry-native-keys');
 const beforeBind=s.inventories.person.main_character;await click(/Bind two dry staves/);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),F+'hub.drying_bind');await roundtrip('binding-pending');
 await click(/Cancel work/);s=await save();assert.deepEqual(s.inventories.person.main_character,beforeBind,'cancel returns exact keys once');
 await act(/Bind two dry staves/,F+'hub.drying_bind',3);s=await save();assert.equal(s.inventories.person.main_character[KIT].count,beforeBind[KIT].count+1);
 const money=s.expansion.actors.player.resources[P+'.coin'];await act(/Supply district repair order 1/,F+'hub.commission_1',2);s=await roundtrip('used-commission');assert.equal(s.expansion.actors.player.resources[P+'.coin'],money+3);receipt.actualConsumer=true;
 await act(/Prepare two damp staves/,F+'hub.drying_cut',4);await click(/Place one damp stave/);await step(2);s=await save();const frozen=JSON.stringify(held(s));
 await click(/Return to Village in your retained body/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='base.frontier');await step(10);s=await roundtrip('absent-rack');assert.equal(JSON.stringify(held(s)),frozen);
 await click(/Enter the independent contractor district/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.paradise.hub');assert.equal(JSON.stringify(held(await save())),frozen);await step(2);assert.equal(moistures(await save())[0],4000);receipt.frozenTravel=true;
 }
 receipt.matrix=[];
 for(const [width,height]of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await page.setViewportSize({width,height});await page.locator('#workspace_navigation select').first().selectOption('customization');await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await panel();
  const card=page.locator('article[data-action-legibility-key="action:'+F+'hub.drying_bind"]');await focus(process.env.W3_REIMPORT_PROOF==='1'?card.getByText(/Dry and collect two staves/).first():card);const bounds=await card.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,overflow:el.scrollWidth>el.clientWidth+1}));assert.equal(bounds.overflow,false);
  const text=await page.locator('#feature_expansion_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));assert.equal(text.font,size);assert.equal(text.pageOverflow,false);await page.screenshot({path:path.join(E,`${process.env.W3_REIMPORT_PROOF==='1'?'drying-final':'drying'}-${width}-${size}.png`)});receipt.matrix.push({width,height,size,bounds,...text});
 }
 assert.deepEqual(errors,[]);console.log('PASS native exact cohorts, paid drying, useful commission, cancellation, freeze, seven literal persistence checkpoints and desktop matrix');
}catch(error){receipt.failure=error.stack;await page.screenshot({path:path.join(E,'native-failure.png')});await fs.writeFile(path.join(E,'native-failure-ui.txt'),await page.locator('body').innerText());throw error;}
finally{await fs.writeFile(path.join(E,process.env.W3_REIMPORT_PROOF==='1'?'native-final-result.json':'native-result.json'),JSON.stringify(receipt,null,2)+'\n');await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
