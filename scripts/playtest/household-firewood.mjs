// Already rebuilt disposable dirty-input candidate; fresh storage, no personal saves.
// node scripts/playtest/household-firewood.mjs /tmp/candidate /absolute/private/evidence
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';
import {firewoodFixture,carriedWood} from '../../tests/helpers/household_firewood_fixture.mjs';

const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/oops-ff3-browser');await mkdir(out,{recursive:true});
const missing=[],server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:15000,
    hooks:{beforeOpen:context=>context.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);})}});
const receipt={viewport:{width:1920,height:1080},setup:'Synthetic owned Shack/hearth, exact-key logs and basic hero; native buttons, travel, clock and persistence thereafter. No natural acquisition claim.',checks:[]};
let page;
const snapshot=()=>page.evaluate(()=>simulationTestHooks.snapshot());
async function openHome(seed){await session.open(seed);page=session.page;await session.step(1);await page.waitForTimeout(350);await page.locator('button[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});}
async function showControls(){await page.locator('button[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});}
async function replayPlay(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(350);}
async function persist(label){
    const before=await session.save();await page.reload();await replayPlay();assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(before)),[]);
    const literal=await page.evaluate(()=>save_to_file()),exported=await session.save();await writeFile(join(out,label+'-export.txt'),literal);
    await Promise.all([page.waitForEvent('load'),page.evaluate(s=>load_progress(s),literal)]);await replayPlay();assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(exported)),[]);
    await page.locator('button[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});
    assert.equal(await page.getByRole('button',{name:'Disable firewood auto-feed',exact:true}).isEnabled(),true,'restored controls are actionable without spending a tick');
    receipt.checks.push(label+': exact Save/reload/Export/literal Import; controls ready without advancing time');
}
try{
    await session.start();await session.open();page=session.page;const seed=firewoodFixture(await session.save());await openHome(seed);
    // Use actionability-aware native buttons for the ordinary public route.
    const stock=page.getByRole('button',{name:'Stock 1 Rough wood log',exact:true});await stock.click();await stock.click();
    let s=await snapshot();assert.equal(carriedWood(s),6);assert.equal(s.household.hearth.firewood.logs.length,2);
    await page.getByRole('button',{name:'Enable firewood auto-feed',exact:true}).click();
    await page.getByRole('button',{name:'Light hearth · 1 Rough wood log',exact:true}).click();
    await session.step(19);s=await session.save();assert.equal(s.household.hearth.fuelMinutes,1);assert.equal(s.household.hearth.firewood.logs.length,2);assert.equal(carriedWood(s),5);
    await page.waitForFunction(()=>document.getElementById('p23_household_panel')?.textContent.includes('2/5 stocked logs'));
    await page.screenshot({path:join(out,'pending-pile.png')});receipt.checks.push('2 real carried logs transferred to visible 2/5 pile, policy selected, manual ignition spent a separate log');await persist('pending');
    const pending=await session.save();await session.step(41);const whole=await session.save();assert.equal(whole.household.hearth.fuelMinutes,0);assert.equal(whole.household.hearth.firewood.logs.length,0);assert.equal(carriedWood(whole),5);
    await persist('exhausted');await page.screenshot({path:join(out,'exhausted-pile.png')});
    receipt.checks.push('Finite reserve feeds at expiry and empties without debiting carried stock');
    await session.open(pending);page=session.page;for(let i=0;i<41;i++)await session.step(1);assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(whole)),[]);receipt.checks.push('41-minute batch equals 41 native single-minute advances');
    await session.open(pending);page=session.page;await page.evaluate(()=>change_location({location_id:'Village'}));s=await session.save();assert.equal(s['current location'],'Village');assert.equal(s.household.hearth.firewood.logs.length,2,'departure crossing fuel expiry cannot feed the home reserve');
    await session.step(25);assert.equal((await snapshot()).household.hearth.fuelMinutes,0);
    await page.evaluate(()=>change_location({location_id:'Shack'}));await page.locator('button[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});
    await session.step(1);assert.equal((await snapshot()).household.hearth.fuelMinutes,0);await showControls();await page.getByRole('button',{name:'Light hearth · 1 Rough wood log',exact:true}).click();await showControls();await page.getByRole('button',{name:'Extinguish · discard remaining fuel',exact:true}).click();await session.step(21);s=await snapshot();assert.equal(s.household.hearth.fuelMinutes,0);assert.equal(s.household.hearth.firewood.logs.length,2);receipt.checks.push('Departure burns only prepaid fuel; return and extinguish preserve stocked logs without automatic ignition');
    await persist('extinguished');
    await showControls();await page.getByRole('button',{name:'Light hearth · 1 Rough wood log',exact:true}).click();
    await page.evaluate(()=>change_location({location_id:'Village'}));await session.step(5);
    assert.equal((await snapshot()).household.hearth.fuelMinutes,5);
    await page.evaluate(()=>change_location({location_id:'Shack'}));s=await snapshot();
    assert.equal(s.household.hearth.fuelMinutes,0);assert.equal(s.household.hearth.firewood.logs.length,2);
    receipt.checks.push('Return travel crossing exhaustion also leaves the reserve untouched');
    assert.deepEqual([...new Set(missing)].filter(p=>p!=='/private_packs/manifest.json'),[]);
    const resource404='Failed to load resource: the server responded with a status of 404 (Not Found)';const expected=session.errors.filter(e=>e.kind==='console'&&e.text===resource404);assert.ok(expected.length<=missing.length);assert.deepEqual(session.errors.filter(e=>!expected.includes(e)),[]);
    receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');receipt.missingOptionalResources=[...new Set(missing)];
}catch(e){receipt.status='failed';receipt.failure=e.stack;receipt.errors=session.errors;if(page)await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}
finally{await writeFile(join(out,'browser-receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
