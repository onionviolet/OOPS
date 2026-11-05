// Canonical Anna operation rows, shortened named QA entry, generated origin only.
// node tests/lotm_method_session_browser.mjs <isolated BUILD_OUT> <private evidence dir>
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {Session,serve} from '../scripts/playtest/lib.mjs';
import {annaSessionFixture,ANNA_ENTRY} from './helpers/anna_session_fixture.mjs';
import {ANNA_ID,ANNA_DETAILS_KEY,ANNA_ADVICE_KEY,ANNA_MEMORY_KEY} from '../src/lotm_anna_session_items.js';
import {BE_SEER_SOURCE,BE_SEER_ENERGY_ID} from '../src/book_world_lotm_be_seer.js';
const [build,out]=process.argv.slice(2).map(p=>resolve(p));await mkdir(out,{recursive:true});
const source=JSON.parse(await readFile('private_packs/lotm-cast/cast.json','utf8')),pack=annaSessionFixture(source);
const sourceHash=createHash('sha256').update(JSON.stringify(pack)).digest('hex');
const server=await serve(join(build,'dist')),checks=[];let castRequests=0;
const ok=(name,value)=>{assert.ok(value,name);checks.push(name);console.log('PASS '+name);};
const session=await new Session({url:server.url,seed:41,wall:Date.UTC(2026,10,4,19),opTimeout:20000,hooks:{beforeOpen:async context=>{
 await context.route('**/private_packs/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(path.endsWith('/lotm-cast/cast.json')&&++castRequests>1)await new Promise(r=>setTimeout(r,250));
  const data=path.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:path.endsWith('/lotm-cast/cast.json')?pack:null;
  return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
 });
}}}).start();
const snap=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const button=k=>session.page.locator(`[data-lotm="${k===ANNA_ENTRY?k:'book.lotm.kj3aa.'+k}"]`).first();
const show=async()=>{await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await session.page.evaluate(()=>{for(const e of document.querySelectorAll('#lotm_panel details'))e.open=true;});};
const ready=async()=>{
 const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);await p.evaluate(()=>window.simulationTestHooks.pause());
 for(let i=0;i<450;i++){
  const b=p.locator('#loading_screen_play_button');if(await b.isVisible())await b.click();
  const confirm=p.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();
  if(await p.evaluate(()=>document.getElementById('loading_screen')?.style.visibility==='hidden')){await p.waitForTimeout(350);await show();return;}
  await p.waitForTimeout(100);
 }
 throw Error('Native loading did not become ready.');
};
const step=async n=>{await session.step(n);await session.page.evaluate(()=>window.advanceTicks(0,{render:true}));await show();};
const act=async k=>{await button(k).click();const r=pack.householdActs.acts.find(r=>r.id===(k===ANNA_ENTRY?k:'book.lotm.kj3aa.'+k));await step(r.minutes);};
const save=async()=>{await session.page.locator('#save_button').click();return session.page.evaluate(()=>localStorage.getItem('save data'));};
const load=async bytes=>{await session.page.evaluate(bytes=>localStorage.setItem('save data',bytes),bytes);await session.page.reload();await ready();};
const branch=async (baseline,change)=>{const s=JSON.parse(baseline);change(s);await load(JSON.stringify(s));};
const paper=s=>s.inventories.person.main_character[ANNA_DETAILS_KEY]?.count||0;
const known=(s,actor,key)=>s.expansion.simulation.knowledge[actor]?.[key];
const digest=s=>JSON.stringify({money:s.character.money,stock:s.inventories.person.main_character,knowledge:s.expansion.simulation.knowledge,energy:s.expansion.simulation.energies.player,jobs:s.expansion.simulation.jobs,completed:s.expansion.actors.player.completed});
try{
 await session.open();await session.page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();ok('authored narrator text reaches an unrelated admitted action',await session.page.locator('[data-lotm-task-flavour]').innerText()==='Fixture note: preparation and execution remain separate.');await act(ANNA_ENTRY);
 let s=await snap();ok('entry has reserve and source but only observed method knowledge',s.expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve===3&&known(s,'player','book.lotm.div.method.astrolabe')?.stage==='seen');
 await act('study');const methodDescription=pack.householdActs.acts.find(r=>r.id==='book.lotm.kj3aa.method').description;ok('current action description appears once in its panel',(await session.page.locator('#lotm_panel').innerText()).split(methodDescription).length===2);ok('canonical study makes the actual method available',await button('method').isEnabled());
 const studied=await save();
 await branch(studied,s=>s.expansion.simulation.knowledge.player['book.lotm.div.method.astrolabe'].stage='seen');
 ok('observed method with full reserve does not grant execution',await button('method').isDisabled());const blocker='You have not learned this method, or the Seer power behind it is not in you.';ok('current blocker appears once while the disabled control retains its reason',(await session.page.locator('#lotm_panel').innerText()).split(blocker).length===2&&await button('method').getAttribute('title')===blocker);
 ok('blocked method does not charge energy',(await snap()).expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve===3);
 await session.page.screenshot({path:join(out,'method-observed.png')});
 await branch(studied,s=>s.expansion.simulation.faculties.player[BE_SEER_SOURCE].suppressed=true);
 ok('learned method without present source is blocked',await button('method').isDisabled());
 ok('source suppression preserves understood learning',known(await snap(),'player','book.lotm.div.method.astrolabe')?.stage==='understood');
 await load(studied);await act('method');await act('details');s=await snap();
 ok('Anna writing creates one actual named sheet',paper(s)===1);
 ok('named sheet is visible in native inventory',(await session.page.locator('#inventory_content_div').innerText()).includes('Anna'));
 await act('astrolabe');const charted=await save();
 await branch(charted,s=>{delete s.inventories.person.main_character[ANNA_DETAILS_KEY];s.inventories.person.main_character[JSON.stringify({id:'Rough wood log'})]={count:1};});
 ok('unrelated carried stock cannot replace Anna’s exact paper',await button('hermes').isDisabled());
 await session.page.screenshot({path:join(out,'missing-paper.png')});
 await load(charted);await act('hermes');const memorized=await save();
 ok('memorizing keeps the same unconsumed sheet',paper(await snap())===1&&known(await snap(),'player',ANNA_MEMORY_KEY)?.stage==='understood');
 await branch(memorized,s=>delete s.inventories.person.main_character[ANNA_DETAILS_KEY]);
 ok('paper departure does not erase memory or block later recollection',!!known(await snap(),'player',ANNA_MEMORY_KEY)&&await button('cogitate').isEnabled());
 await load(memorized);await act('cogitate');const rested=await save();
 await branch(rested,s=>s.expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve=0);
 ok('known method and held source without reserve cannot perform dream',await button('dream').isDisabled());
 await load(rested);await act('dream');s=await snap();
 ok('completed canonical dream spends one spirituality',s.expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve===2);
 ok('private dream has not reached Anna',!!known(s,'player','book.lotm.kj3aa.dream.signs')&&!known(s,ANNA_ID,'book.lotm.kj3aa.dream.signs')&&!known(s,ANNA_ID,ANNA_ADVICE_KEY));
 await act('omens');const interpreted=await save(),money=(await snap()).character.money;
 await branch(interpreted,s=>s.expansion.simulation.people[ANNA_ID].location='Whereabouts unplaced');
 ok('absent recipient blocks giving the advice',await button('reveal').isDisabled());
 await load(interpreted);await button('reveal').click();await step(1);const pending=await save(),pendingDigest=digest(await snap());
 ok('pending conversation has not taught the recipient',!known(await snap(),ANNA_ID,ANNA_ADVICE_KEY));
 await session.page.reload();await ready();ok('pending reload preserves exact job and retained learning',digest(await snap())===pendingDigest);
 const down=session.page.waitForEvent('download');await session.page.locator('#save_to_file_button').click();const pendingFile=join(out,'pending-export.txt');await(await down).saveAs(pendingFile);
 await session.page.evaluate(()=>localStorage.clear());await session.page.reload();await ready();
 const nav=session.page.waitForEvent('domcontentloaded');await session.page.locator('#saved_file_input').setInputFiles(pendingFile);await nav;await ready();
 ok('literal pending import keeps the exact conversation and document',digest(await snap())===pendingDigest&&paper(await snap())===1);
 await session.page.locator('[data-lotm="cancel"]').first().click();await step(1);
 ok('cancelled advice teaches no recipient and pays nothing',!known(await snap(),ANNA_ID,ANNA_ADVICE_KEY)&&(await snap()).character.money===money);
 await act('reveal');s=await snap();
 ok('completed advice teaches Anna but reveals no private dream',!!known(s,ANNA_ID,ANNA_ADVICE_KEY)&&!known(s,ANNA_ID,'book.lotm.kj3aa.dream.signs'));
 ok('delivery does not itself collect the fee',s.character.money===money&&await button('paid').isEnabled());
 for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await session.page.setViewportSize({width,height});await session.page.locator('#workspace_navigation select').first().selectOption('customization');
  await session.page.locator('[aria-label="Font size"]').fill(String(size));await session.page.locator('[aria-label="Font size"]').dispatchEvent('change');await session.page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await show();await button('paid').scrollIntoViewIfNeeded();
  ok(`desktop ${width}x${height} at ${size}px has no page overflow`,await session.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await session.page.screenshot({path:join(out,`delivered-${width}-${size}.png`)});
 }
 await act('paid');ok('the later payment awards the stated twelve pence once',(await snap()).character.money===money+12);await step(3);ok('later ticks repeat neither advice nor money',(await snap()).character.money===money+12&&known(await snap(),ANNA_ID,ANNA_ADVICE_KEY).at===known(s,ANNA_ID,ANNA_ADVICE_KEY).at);
 await save();const settled=digest(await snap());await session.page.reload();await ready();ok('settled reload keeps document, learning, recipient and payment',digest(await snap())===settled);
 const download=session.page.waitForEvent('download');await session.page.locator('#save_to_file_button').click();const file=join(out,'settled-export.txt');await(await download).saveAs(file);
 await session.page.evaluate(()=>localStorage.clear());await session.page.reload();await ready();const imported=session.page.waitForEvent('domcontentloaded');await session.page.locator('#saved_file_input').setInputFiles(file);await imported;await ready();
 ok('literal settled import keeps the exact useful outcome',digest(await snap())===settled);ok('no browser errors',session.errors.length===0);
 await writeFile(join(out,'settled.json'),JSON.stringify(await snap(),null,2));
}catch(e){await session.page.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.txt'),await session.page.locator('body').innerText());throw e;}
finally{await writeFile(join(out,'result.json'),JSON.stringify({bundleHash:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex'),sourceHash,route:'canonical KJ3AA operations; named shortened entry and explicit generated-save counterfactual branches',checks,errors:session.errors},null,2));await session.browser.close();server.close();}
