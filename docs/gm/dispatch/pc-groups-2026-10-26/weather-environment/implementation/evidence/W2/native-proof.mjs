// W2 frozen-bundle proof. Synthetic saves only; initial residence/materials earned.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/perf/lib.mjs';
import {Session} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/playtest/lib.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]);await mkdir(out,{recursive:true});
const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,26),opTimeout:15000});
const receipt={route:'Fresh native bird start, earned materials; named saved-calendar/condition boundary fixture. Native costs/work/roof/rest and literal persistence.',viewport:'1920x1080',checks:[]};let page;
const k=id=>JSON.stringify({id}),button=id=>page.locator(`[data-home-action=${JSON.stringify(id)}]`);
async function home(){await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');await page.waitForTimeout(40);await page.locator('#home_panel details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));}
async function click(id){const b=button(id);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});assert.equal(await b.isEnabled(),true,id+': '+await page.locator('#home_panel').innerText());await b.click();await page.waitForTimeout(45);assert.doesNotMatch(await page.locator('#home_panel > p[role=status]').innerText(),/terms changed|Unsupported|Invalid |Cannot |could not|Finish the pending/);}
async function open(seed){await session.open(seed);page=session.page;await home();}
async function travel(id){await page.evaluate(id=>change_location({location_id:id}),id);await home();assert.equal((await session.save())['current location'],id);}
async function step(n){await session.step(n);await home();}
async function replay(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await home();}
async function persist(label){const before=await session.save();await page.reload();await replay();assert.deepEqual((await session.save()).homes,before.homes);const literal=await page.evaluate(()=>save_to_file());const exported=await session.save();await Promise.all([page.waitForEvent('load'),page.evaluate(s=>load_progress(s),literal)]);await replay();const after=await session.save();assert.deepEqual(after.homes,exported.homes);assert.deepEqual(after.expansion.simulation.jobs,exported.expansion.simulation.jobs);receipt.checks.push(label+': native Save/reload/Export/literal Import');}
async function finish(id){for(let guard=0;guard<20&&(await session.save()).homes.projects?.[id];guard++){await click('work:'+id);const s=await session.save(),job=s.expansion.simulation.jobs.find(j=>j.actorId==='player');assert.ok(job);await step(job.due-s.expansion.clock);}assert.equal((await session.save()).homes.projects?.[id],undefined);}
try{
 await session.start();await open();await click('start:bird');await travel('Wild willow stand');
 for(let i=0;i<2;i++)await click('gather:Home fallen twigs');for(let i=0;i<4;i++)await click('gather:Home dry grass');await travel('Canopy nest');
 let s=await session.save();assert.equal(s.inventories.person.main_character[k('Home fallen twigs')].count,2);assert.equal(s.inventories.person.main_character[k('Home dry grass')].count,4);
 // Named fixture changes only native calendar and actual structure condition.
 s['current time'].day_count=3;s['current time'].day=3;s['current time'].hour=23;s['current time'].minute=30;
 s.homes.properties.nest.condition={...s.homes.properties.nest.condition,integrity:39,wetness:10,rainMinutes:479};await open(s);
 assert.match(await page.locator('#home_panel').innerText(),/Roof leaks into the native weather exposure/);
 await step(60);s=await session.save();assert.equal(s.homes.properties.nest.condition.wetness,60);assert.equal(s.homes.properties.nest.condition.integrity,38);receipt.checks.push('Offset-30 native rain start: 30 dry + 30 rainy minutes produces wetness 60 and one retained wear crossing');
 const count=id=>s.inventories.person.main_character[k(id)]?.count||0;
 const beforeRepair={twigs:count('Home fallen twigs'),grass:count('Home dry grass')};await click('repair:nest');s=await session.save();assert.equal(count('Home fallen twigs'),beforeRepair.twigs-1);assert.equal(count('Home dry grass'),beforeRepair.grass-2);assert.equal(s.homes.properties.nest.condition.integrity,38);
 await click('work:nest');await step(2);await persist('repair-pending');s=await session.save();await step(s.expansion.simulation.jobs.find(j=>j.actorId==='player').due-s.expansion.clock);await finish('nest');s=await session.save();assert.equal(s.homes.properties.nest.condition.integrity,100);assert.match(await page.locator('#home_panel').innerText(),/Roof provides local weather shelter/);assert.equal(await button('repair:nest').isEnabled(),false);receipt.checks.push('Repair debits actual earned twig/grass, grants no premature repair, retains accepted job, restores actual roof and refuses redundant repair');
 await click('weatherproof:nest');s=await session.save();assert.equal(count('Home fallen twigs'),0);assert.equal(count('Home dry grass'),0);await finish('nest');s=await session.save();assert.equal(s.homes.properties.nest.weatherproof,true);assert.equal(await button('weatherproof:nest').isEnabled(),false);const beforeWet=s.homes.properties.nest.condition.wetness;await step(10);s=await session.save();assert.equal(s.homes.properties.nest.condition.wetness,beforeWet+10);assert.match(await page.locator('#home_panel').innerText(),/weatherproofed/);receipt.checks.push('Weatherproofing consumes separate earned materials/work, halves subsequent direct wetting and refuses duplicate fitting');
 await page.evaluate(()=>start_sleeping());await step(1);assert.equal((await session.save()).is_sleeping,true);await page.evaluate(()=>end_sleeping());await home();receipt.checks.push('Repaired local structure supports actual native sleep');
 await persist('repaired-weatherproofed-condition');
 for(const viewport of [{width:1920,height:1080},{width:1536,height:864}]){for(const fontSize of [14,21]){const sized=await session.save();sized.customization.profiles.Default.settings.typography={font:'gothic',size:fontSize};await open(sized);await page.setViewportSize(viewport);await page.locator('#home_panel details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:join(out,`home-${viewport.width}-${fontSize}.png`)});}}
 receipt.errors=session.errors.filter(e=>!(e.kind==='console'&&e.text.includes('404 (Not Found)')));assert.deepEqual(receipt.errors,[]);receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}catch(e){receipt.status='failed';receipt.failure=e.stack;receipt.errors=session.errors;if(page){receipt.screen=(await page.locator('body').innerText()).slice(-12000);await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});}throw e;}
finally{await writeFile(join(out,'native-receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
console.log(JSON.stringify(receipt,null,2));
