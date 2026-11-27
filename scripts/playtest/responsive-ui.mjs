// Rebuilt game journey plus explicitly labelled source-component lifecycle checks.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {firewoodFixture} from '../../tests/helpers/household_firewood_fixture.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]);await mkdir(out,{recursive:true});
const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21)});
const receipt={setup:'Synthetic owned Shack, hearth, logs and Linen cloth; subsequent actions use native controls in the rebuilt bundle. Lifecycle checks explicitly import the source component.',checks:[]};
let page;
const action=id=>page.locator(`[data-household-action="${id}"]`);
const home=async()=>{await page.locator('button[data-place-tab="home"]').click();const panel=page.locator('#p23_household_panel');if(!await panel.evaluate(n=>n.open))await panel.locator(':scope > summary').click();};
const effects=mode=>page.evaluate(mode=>document.documentElement.dataset.effects=mode,mode);
const symbol=()=>page.locator('#p23_household_panel .settled-reaction-symbol');
try{
 await session.start();await session.open();const seed=firewoodFixture(await session.save());seed.inventories.person.main_character[JSON.stringify({id:'Linen cloth'})]={count:1};
 await session.open(seed);page=session.page;await home();await effects('full');
 await action('meet').click();assert.equal(await symbol().innerText(),'?');
 await session.step(5);await home();await action('play').focus();
 const before=await action('play').boundingBox();await session.step(1);
 assert.equal(await action('play').evaluate(n=>n===document.activeElement),true);
 assert.deepEqual(await action('play').boundingBox(),before);
 await action('play').press('Enter');assert.equal(await symbol().innerText(),'♪');
 assert.match(await page.locator('.household-action-result').innerText(),/pounces/);
 assert.equal(await page.locator('#p23_household_panel .work-ledger-effect').innerText(),'♪','sentence stays in its result line');
 assert.equal((await session.save()).household.animal.playVisits,1);
 await page.screenshot({path:join(out,'moss-play-1920.png')});
 receipt.checks.push('Native keyboard play: actual visit, anchored musical symbol, local subject motion, one result sentence; focus and button geometry survive a played tick with disabled-reason siblings');
 await action('light').click();assert.equal(await symbol().innerText(),'♨');
 assert.equal((await session.save()).household.hearth.fuelMinutes,20);
 const stock=page.locator('[data-household-action^="stock_firewood:"]').first();await stock.click();
 assert.equal(await symbol().innerText(),'+1');assert.match(await page.locator('.household-scene-hearth').innerText(),/1\/5 stocked logs/);
 await page.screenshot({path:join(out,'hearth-stock-1920.png')});
 receipt.checks.push('Native lighting and stocking display real prepaid fuel and finite reserve; decorative symbols stay at the affected subject');
 await effects('reduced');await session.step(5);await action('pet').click();
 assert.equal(await symbol().innerText(),'♡');
 assert.equal(await page.locator('.household-cat-face').evaluate(n=>n.getAnimations().length),0);
 await effects('off');await session.step(5);await action('pet').click();
 assert.equal(await symbol().count(),0);assert.equal(await page.locator('#p23_household_panel .work-ledger-effect').isVisible(),false);
 assert.match(await page.locator('.household-action-result').innerText(),/settles under your hand/);
 receipt.checks.push('Reduced effects retain still expression without subject movement; Off suppresses transient visuals while native outcome text and gameplay remain');
 await effects('full');await page.emulateMedia({reducedMotion:'reduce'});await session.step(5);await action('pet').click();
 assert.equal(await page.locator('.household-cat-face').evaluate(n=>n.getAnimations().length),0);
 await page.emulateMedia({reducedMotion:'no-preference'});
 // Source-component lifecycle fixture, distinct from native gameplay proof.
 const lifecycle=await page.evaluate(async()=>{
  const {createSettledTextEffects}=await import('/src/settled_text_effects.js');
  const host=document.createElement('div'),anchor=document.createElement('div');anchor.textContent='Observed subject';host.append(anchor);document.body.append(host);
  const fx=createSettledTextEffects({container:host,readSettings:()=>({effects:'full'})});
  const receipt={type:'test',eventId:'a',text:'Retained result'},target={anchor,symbol:'♡',caption:false};
  const first=fx.present(receipt,target),duplicate=fx.present(receipt,target);anchor.remove();
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const removed=host.querySelector('.work-ledger-effect').hidden&&!host.querySelector('.work-ledger-target-pulse');
  host.append(anchor);fx.present({...receipt,eventId:'b'},target);document.documentElement.dataset.effects='off';
  await Promise.resolve();const capped=host.querySelector('.work-ledger-effect').hidden;
  fx.destroy();host.remove();return {first,duplicate,removed,capped};
 });assert.deepEqual(lifecycle,{first:true,duplicate:false,removed:true,capped:true});
 receipt.checks.push('OS reduced motion respected. Source-component fixture: duplicate receipts suppressed, detached anchors retire visuals, changing Effects immediately cancels in-flight effects');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
 receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}catch(error){receipt.status='failed';receipt.failure=error.stack;await page?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw error;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
console.log(JSON.stringify(receipt,null,2));
