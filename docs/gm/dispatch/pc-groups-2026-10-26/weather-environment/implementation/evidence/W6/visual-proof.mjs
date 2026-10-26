// Named starting-material fixture; all entry, apparatus, preparation and use earned.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
const SNAP=process.env.W6_SNAPSHOT||'/Users/weiwei/.codex/research/weather-w6-2026-10-26/snapshot';
const OUTPUT=path.join(SNAP,'output'),E=import.meta.dirname;
const {launchChrome,advanceGameMinutes}=createRequire(path.join(SNAP,'package.json'))('./scripts/ui_helpers.cjs');
const server=createServer(async(req,res)=>{try{let target=path.resolve(OUTPUT,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));assert.ok(target===OUTPUT||target.startsWith(OUTPUT+'/'));if((await fs.stat(target)).isDirectory())target=path.join(target,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.json':'application/json','.png':'image/png'})[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
page.setDefaultTimeout(20000);const errors=[],receipt={route:'Agent-earned W4 prepared-stave export plus named25-credit field-funding fixture; actual paid apparatus/forecast/field/grounding/kit and coppice-water join',origin,errors,roundtrips:[]};
page.on('pageerror',e=>errors.push(e.stack));await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
const P='book.paradise',F=P+'.campaign.',R=P+'.drying.rack',key=id=>JSON.stringify({id}),LOG=key('Rough wood log'),ROPE=key('Survey rope'),KIT=key('Prepared survey kit'),COAL=key('Charcoal');
const EF=F+'hub.environment_';
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
 receipt.route='Visual-only cost sections on agent-generated charged and paid-heat exports; unchanged final bundle';receipt.bundleHash=createHash('sha256').update(await fs.readFile(path.join(OUTPUT,'dist/bundle.js'))).digest('hex');receipt.captures=[];await page.goto(origin+'/?test_hooks=1');await boot();
 for(const specimen of [{name:'ground',file:'charged-dry-native.save.txt',selector:'article[data-action-legibility-key^="action:field.ground."]',pattern:/1 district credit.*1 stamina/s},{name:'heat',file:'final-paid-heat.save.txt',selector:'article[data-action-legibility-key="action:drying.heat"]',pattern:/1 charcoal is consumed/}]){
  const literal=await fs.readFile(path.join(E,specimen.file),'utf8');await Promise.all([page.waitForEvent('load'),page.evaluate(x=>load_progress(x),literal)]);await boot();
  for(const [width,height,size]of [[1920,1080,14],[1536,864,21]]){
   await page.setViewportSize({width,height});await page.locator('#workspace_navigation select').first().selectOption('customization');await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await panel();
   const card=page.locator(specimen.selector).first();assert.match(await card.innerText(),specimen.pattern);await focus(card.getByText('Stated costs',{exact:true}));
   const metrics=await card.evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));assert.equal(metrics.pageOverflow,false);await page.screenshot({path:path.join(E,`${specimen.name}-cost-visible-${width}-${size}.png`)});receipt.captures.push({specimen:specimen.name,width,height,size,...metrics});
  }
 }
 assert.deepEqual(errors,[]);receipt.status='visual-only verified';console.log('PASS final visible grounding and heat costs,1920/14 and1536/21');
}finally{await fs.writeFile(path.join(E,'visual-cost-result.json'),JSON.stringify(receipt,null,2)+'\n');await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
