import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {firewoodFixture} from '../../tests/helpers/household_firewood_fixture.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]||'/tmp/oops-home-edges-proof');await mkdir(out,{recursive:true});
const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:12000});let page;
const receipt={setup:'Synthetic legacy Shack access/hearth and logs only. Native meeting, new rental acquisition, companion retrieval, travel, stale quotes and failed durable writes thereafter.',checks:[]};
const button=id=>page.locator(`[data-home-action=${JSON.stringify(id)}]`);
const snap=()=>page.evaluate(()=>simulationTestHooks.snapshot());
async function home(){await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');}
async function click(id){const b=button(id);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});assert.equal(await b.isEnabled(),true,id);await b.click();}
async function replay(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(200);await home();}
try{
    await session.start();await session.open();const seed=firewoodFixture(await session.save());delete seed.homes;
    await session.open(seed);page=session.page;await page.locator('button[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(n=>n.open=true);await page.locator('[data-household-action="meet"]').click();
    await page.evaluate(()=>change_location({location_id:'Village'}));await home();await click('acquire:rental');await page.evaluate(()=>change_location({location_id:'Riverside rented room'}));await home();
    const before=await snap();await click('move_native_cat:rental');const moved=await snap();assert.equal(moved.expansion.clock-before.expansion.clock,30);assert.equal(moved.household.animal,null);assert.equal(moved.homes.properties.rental.household.animal.id,'household.moss');
    receipt.checks.push('Actual native Moss relocates once through 30 played travel minutes; original household state remains, with its animal removed');
    await session.save();const literal=await page.evaluate(()=>save_to_file());await Promise.all([page.waitForEvent('load'),page.evaluate(s=>load_progress(s),literal)]);await replay();assert.equal((await snap()).household.animal,null);assert.equal((await snap()).homes.properties.rental.household.animal.id,'household.moss');
    receipt.checks.push('Literal Export/Import retains one relocated companion and the source household');
    const renew=button('renew:rental');await renew.dispatchEvent('pointerdown');await session.step(1);const staleBefore=await snap();await renew.evaluate(n=>n.click());let after=await snap();assert.equal(after.character.money,staleBefore.character.money);assert.equal(after.homes.properties.rental.paidUntil,staleBefore.homes.properties.rental.paidUntil);assert.match(await page.locator('#home_panel > p[role=status]').innerText(),/terms changed/);
    receipt.checks.push('Pointer-down quote is rejected after native clock/sequence changes, without charge or extended lodging');
    await session.save();const durableBefore=await page.evaluate(()=>localStorage.getItem('save data')),liveBefore=await page.evaluate(()=>simulationTestHooks.project('homes').state);
    await page.evaluate(()=>{const original=Storage.prototype.setItem;window.restoreHomeStorage=()=>Storage.prototype.setItem=original;Storage.prototype.setItem=function(key,value){if(key==='save data')throw new DOMException('Home proof: storage full','QuotaExceededError');return original.call(this,key,value);};});
    await click('renew:rental');assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),durableBefore);assert.deepEqual(await page.evaluate(()=>simulationTestHooks.project('homes').state),liveBefore);await page.evaluate(()=>restoreHomeStorage());
    await page.reload();await replay();after=await snap();assert.deepEqual(after.homes,liveBefore);
    receipt.checks.push('Actual failed durable write publishes no term, coin or residence change; reload recovers the prior saved state');
    await page.screenshot({path:join(out,'relocated-home.png')});receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}catch(e){receipt.status='failed';receipt.failure=e.stack;receipt.errors=session.errors;if(page){receipt.screen=(await page.locator('body').innerText()).slice(-7000);await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});}throw e;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
