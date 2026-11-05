// node tests/seer_exhaustion_browser.mjs <selected build root> <private proof directory>
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {Session,serve} from '../scripts/playtest/lib.mjs';
import {seerExhaustionFixture,SEER_FIXTURE_PREFIX as P} from './helpers/seer_exhaustion_fixture.mjs';
import {BE_SEER_ENERGY_ID as E,BE_SPIRIT_VISION as V,BE_SPIRIT_EXHAUSTION as X,BE_SPIRIT_EXHAUSTION_LIMIT as limit} from '../src/book_world_lotm_be_seer.js';
const [build,out]=process.argv.slice(2).map(p=>resolve(p));await mkdir(out,{recursive:true});
const pack=seerExhaustionFixture(),server=await serve(join(build,'dist')),checks=[];
const ok=(label,value)=>{assert.ok(value,label);checks.push(label);console.log('PASS '+label);};
const session=await new Session({url:server.url,seed:43,wall:Date.UTC(2026,10,4,20),opTimeout:20000,hooks:{beforeOpen:async context=>{
 await context.route('**/private_packs/**',r=>{const p=new URL(r.request().url()).pathname;const data=p.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:p.endsWith('lotm-cast/cast.json')?pack:null;return r.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});});
}}}).start();
const page=()=>session.page,snap=()=>page().evaluate(()=>window.simulationTestHooks.snapshot());
const button=id=>page().locator(`[data-lotm="${P+id}"]`).first();
const show=async()=>{await page().getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await page().evaluate(()=>{for(const d of document.querySelectorAll('#lotm_panel details'))d.open=true;});};
const ready=async()=>{const p=page();await p.waitForFunction(()=>!!window.simulationTestHooks);await p.evaluate(()=>window.simulationTestHooks.pause());for(let i=0;i<450;i++){const play=p.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();const confirm=p.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();if(await p.evaluate(()=>document.getElementById('loading_screen')?.style.visibility==='hidden')){await p.waitForTimeout(350);await show();return;}await p.waitForTimeout(100);}throw Error('Native load did not become ready.');};
const step=async()=>{await session.step(2);await page().evaluate(()=>window.advanceTicks(0,{render:true}));await show();};
const act=async id=>{await button(id).click();await step();};
const intensity=s=>s.expansion.simulation.conditions.player?.[X]?.intensity||0;
const pool=s=>s.expansion.simulation.energies.player[E].reserve;
const digest=s=>JSON.stringify({conditions:s.expansion.simulation.conditions.player,energy:s.expansion.simulation.energies.player,completed:s.expansion.actors.player.completed,jobs:s.expansion.simulation.jobs});
const save=async()=>{await page().locator('#save_button').click();return snap();};
const roundTrip=async name=>{const expected=digest(await save());await page().reload();await ready();ok(name+' reload keeps exact conditions, pool and completions',digest(await snap())===expected);const down=page().waitForEvent('download');await page().locator('#save_to_file_button').click();const file=join(out,name+'-export.txt');await(await down).saveAs(file);await page().evaluate(()=>localStorage.clear());await page().reload();await ready();const nav=page().waitForEvent('domcontentloaded');await page().locator('#saved_file_input').setInputFiles(file);await nav;await ready();ok(name+' literal Export/Import keeps exact state',digest(await snap())===expected);};
try{
 await session.open();await page().evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();
 ok('source-free character cannot switch on',await button('on').isDisabled());await act('entry');
 for(let i=1;i<=limit;i++){
  const before=pool(await snap());ok('cycle '+i+' is admitted below the exhaustion dial',await button('on').isEnabled());await button('on').click();if(i===1){ok('switch-on is a real pending native job',(await snap()).expansion.simulation.jobs.some(j=>j.commandId===P+'on'));await roundTrip('pending-on');}await step();let s=await snap();ok('cycle '+i+' spends exactly one spirituality and turns vision on',pool(s)===before-1&&s.expansion.simulation.conditions.player[V]?.intensity===1);
  await act('off');s=await snap();ok('cycle '+i+' retains the accumulated notch',intensity(s)===i&&!s.expansion.simulation.conditions.player[V]);
  if(i===1)await roundTrip('one-notch');
 }
 await act('recover');let s=await snap();ok('cogitation restores available energy without clearing fatigue',pool(s)>0&&intensity(s)===limit);
 ok('exhaustion dial blocks a further use despite available energy',await button('on').isDisabled());ok('native refusal explains sleep and the real action retains its cost',/worn|sleep/i.test(await button('on').getAttribute('title'))&&/1 spirituality/.test(await button('on').innerText()));
 const before=digest(await snap());await button('on').evaluate(n=>n.click());ok('forced disabled activation commits nothing',digest(await snap())===before);await page().screenshot({path:join(out,'at-limit-1920.png')});
 await roundTrip('at-limit');ok('restored state remains blocked at the same dial',await button('on').isDisabled());
 await button('sleep').click();await show();await page().locator('[data-lotm="cancel"]:visible').first().click();await step();ok('cancelled sleep clears no exhaustion',intensity(await snap())===limit);
 await act('sleep');ok('completed sleep clears all notches and enables the source again',intensity(await snap())===0&&await button('on').isEnabled());await act('on');ok('post-sleep vision works through the same native consumer',(await snap()).expansion.simulation.conditions.player[V]?.intensity===1);
 await roundTrip('restored-vision');await page().screenshot({path:join(out,'after-rest-1920.png')});ok('no browser errors',session.errors.length===0);
}catch(error){await page().screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.txt'),await page().locator('body').innerText().catch(()=>''));throw error;}
finally{await writeFile(join(out,'result.json'),JSON.stringify({route:'synthetic native Seer calibration fixture; no canon-arrival claim',viewport:'1920x1080',bundleHash:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex'),fixtureHash:createHash('sha256').update(JSON.stringify(pack)).digest('hex'),checks,errors:session.errors},null,2));await session.browser.close();server.close();}
