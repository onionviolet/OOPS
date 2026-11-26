import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {Session} from '../scripts/playtest/lib.mjs';
import {serve} from '../scripts/perf/lib.mjs';
import {scenarioSave} from '../scripts/headless/scenarios.mjs';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadRankTwo} from '../src/world_packs/book_gu_lead_rank_two.js';
import {RI_DAY_ITEMS as IT,RI_LEAD_DAY as DAY} from '../src/ri_lead_day_facts.js';
import {RI_LEAF_TREATMENT as LEAF,RI_LEAF_ITEM} from '../src/ri_leaf_treatment.js';
import {RI_HEALER_WORK as HEALER} from '../src/world_packs/book_gu_lead_healer_work.js';
const baseline=process.argv.includes('--baseline'),build=resolve(process.argv[2]||'.lane-builds/tally-uses-20261125'),out=resolve('docs/representations/evidence/known-tally-uses-2026-11-25');
await mkdir(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const fixture=JSON.parse(await scenarioSave('ri-fang-yuan-wild-gu'));
const pin=raw=>({id:raw.id,revision:raw.revision,contentHash:'sha256:'+hash(JSON.stringify(raw))});
fixture.content_packs.structured.extensions.push(pin(guLeadRankTwo),pin(guLeadDay));
fixture.expansion.actors.player.facts[`${DAY}.wolf_at_wall`]=true;
(fixture.expansion.simulation.knowledge.player||={})[`${DAY}.fed.moonglow`]={at:fixture.expansion.clock||0,stage:'understood',value:'The Moonglow Gu has eaten.',cause:'fixture.setup'};
const inv=fixture.inventories.person.main_character,key=id=>JSON.stringify({id});delete inv[key(IT.tally)];
for(const [id,count]of [[IT.stone,4],[IT.moonglow,1],[IT.petals,6]])inv[key(id)]={count};
const server=await serve(build),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,10,25,15),opTimeout:30000});
const count=(s,id)=>s.inventories.person.main_character[key(id)]?.count||0;
const snap=()=>session.page.evaluate(()=>simulationTestHooks.snapshot());
const click=async locator=>{await locator.evaluate(n=>{for(let a=n.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});await locator.click();};
const structured=id=>session.page.locator(`[data-structured-action="${id}"]`),use=id=>session.page.locator(`[data-known-item-consumer="${id}"]`);
const show=()=>session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('beginning');
const checks=[];
try{
 await session.start();await session.open(fixture);await show();
 await click(structured(`${DAY}.drive_off`));let s=await snap();assert.equal(count(s,IT.tally),1);assert.equal(s.expansion.actors.player.facts[`${DAY}.injured`],true);
 const tooltip=await session.page.locator('#inventory_content_div .item_tooltip').filter({hasText:'Watch tally'}).first().textContent();
 if(!baseline){assert.equal(await use(`${DAY}.hand_in_tally`).count(),1);assert.equal(await use(`${HEALER}.tally`).count(),0);checks.push('Earned tally shows known board quote; unadmitted healer is absent');}
 await click(session.page.locator(`[data-structured-extension="${LEAF}"]`));await click(session.page.locator(`[data-structured-extension="${HEALER}"]`));
 const panel=session.page.locator('.daily-powers');await panel.scrollIntoViewIfNeeded();
 if(baseline){const text=await panel.innerText();await session.page.screenshot({path:join(out,'before.png')});
  await writeFile(join(out,'before.json'),JSON.stringify({bundleSha256:hash(await readFile(join(build,'dist/bundle.js'))),tooltip,panel:text,boardShown:/Turn in a watch tally/.test(text),healerShown:/Trade a watch tally/.test(text)},null,2));console.log('Captured existing tally item and Hero context');}
 else{
  await session.page.locator('[data-known-item-choices]').scrollIntoViewIfNeeded();
  assert.match(await use(`${DAY}.hand_in_tally`).innerText(),/10 merit/);assert.match(await use(`${HEALER}.tally`).innerText(),/Vitality Leaf/);
  const context=await session.page.locator('[data-known-item-choices]').innerText();assert.match(context,/1 held/);assert.match(context,/5 min/);
  await session.page.screenshot({path:join(out,'known-choices.png')});checks.push('Both admitted uses share held tally context and actual input/time quotes');
  const earned=await session.save();
  await use(`${HEALER}.tally`).click();s=await snap();assert.equal(count(s,IT.tally),0);assert.equal(count(s,RI_LEAF_ITEM),1);assert.equal(count(s,IT.merit),0);
  assert.equal(await session.page.locator('[data-known-item-choices]').isVisible(),false);
  await session.page.screenshot({path:join(out,'spent-for-leaf.png')});
  await session.save();await session.page.reload();await session.page.waitForFunction(()=>!!window.simulationTestHooks);await session.page.evaluate(()=>simulationTestHooks.pause());
  if(await session.page.locator('#loading_screen_play_button').isVisible())await session.page.locator('#loading_screen_play_button').click({force:true});
  assert.equal(count(await snap(),RI_LEAF_ITEM),1);assert.equal(await session.page.locator('[data-known-item-choices]').isVisible(),false);checks.push('Leaf trade consumes tally; reload retains leaf and no stale spendable card');
  await session.open(earned);await use(`${DAY}.hand_in_tally`).click();
  const stop=session.page.locator('[data-day-action="follow-up"] button');assert.match(await stop.innerText(),/Stop handing in the tally/);assert.ok(await stop.isEnabled());
  await session.step(5);s=await snap();assert.equal(count(s,IT.merit),10);assert.equal(count(s,RI_LEAF_ITEM),0);assert.equal(count(s,IT.tally),0);
  await session.save();await session.page.reload();await session.page.waitForFunction(()=>!!window.simulationTestHooks);await session.page.evaluate(()=>simulationTestHooks.pause());
  if(await session.page.locator('#loading_screen_play_button').isVisible())await session.page.locator('#loading_screen_play_button').click({force:true});
  assert.equal(count(await snap(),IT.merit),10);assert.equal(await session.page.locator('[data-known-item-choices]').isVisible(),false);checks.push('Same earned checkpoint funds board instead: reachable running Stop,5min→10merit, no leaf, persistent consumed tally');
  await writeFile(join(out,'result.json'),JSON.stringify({bundleSha256:hash(await readFile(join(build,'dist/bundle.js'))),viewport:'1920x1080',fixture:'composed Fang rank/day wall encounter; tally earned by actual drive-off; branches from same earned post-terms save',tooltip,checks,pageErrors:session.errors.filter(e=>e.kind==='pageerror')},null,2));assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);console.log(JSON.stringify(checks));
 }
}catch(error){console.error(error);await session.page?.screenshot({path:join(out,'failed.png')});throw error;}
finally{await session.browser?.close();await server.close();}
