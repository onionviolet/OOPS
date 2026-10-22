import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]||'/tmp/oops-home-building-proof');await mkdir(out,{recursive:true});
const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:12000});
const receipt={checks:[],setup:'Fresh native origins, public optional beginnings and actual controls. No inventory, residence, material, money or body seed. Construction, gathering, lining, travel, sleep, salvage and literal persistence.'};let page;
const key=id=>JSON.stringify({id});
async function home(){await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');}
const button=id=>page.locator(`[data-home-action=${JSON.stringify(id)}]`);
async function click(id){const b=button(id);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});assert.equal(await b.isEnabled(),true,id+': '+await page.locator('#home_panel').innerText());await b.click();await page.waitForTimeout(35);}
async function travel(id){await page.evaluate(id=>change_location({location_id:id}),id);await home();assert.equal((await session.save())['current location'],id);}
async function replay(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await home();}
async function persist(label){const before=await session.save();await page.reload();await replay();assert.deepEqual((await session.save()).homes,before.homes);const literal=await page.evaluate(()=>save_to_file());const saved=await session.save();await Promise.all([page.waitForEvent('load'),page.evaluate(s=>load_progress(s),literal)]);await replay();assert.deepEqual((await session.save()).homes,saved.homes);receipt.checks.push(label+': Save/reload/Export/literal Import preserves physical construction and goods');}
try{
 await session.start();
 for(const [profile,id,location,costs]of [
  ['wildbird','nest','Canopy nest',{'Home fallen twigs':4,'Home dry grass':2}],
  ['wildfox','burrow','Willow burrow',{}],
  ['builder','shelter','Willow clearing shelter',{'Home fallen poles':4,'Home dry grass':4}],
 ]){
  await session.open();page=session.page;await home();await click('start:'+profile);let s=await session.save();const money=s.character.money;assert.equal(s['current location'],'Wild willow stand');assert.deepEqual(s.homes.properties,{});
  // Materials come from the actual landscape, with one bundle carried per action.
  for(const [item,n]of Object.entries(costs))for(let i=0;i<n;i++){const before=(await session.save()).expansion.clock;await click('gather:'+item);s=await session.save();assert.ok(s.expansion.clock>before);assert.equal(s.inventories.person.main_character[key(item)].count,i+1);}
  const before=(await session.save()).expansion.clock;await click('build:'+id);assert.equal((await session.save()).homes.properties[id],undefined);while((await session.save()).homes.projects?.[id]){await click('work:'+id);const pending=await session.save(),job=pending.expansion.simulation.jobs.find(j=>j.actorId==='player');await session.step(job.due-pending.expansion.clock);await home();}s=await session.save();assert.ok(s.expansion.clock>=before+20);assert.equal(s.character.money,money);assert.deepEqual(s.homes.properties[id].fixtures,{});assert.equal(s.homes.properties[id].construction.site,'Wild willow stand');for(const item of Object.keys(costs))assert.equal(s.inventories.person.main_character[key(item)],undefined);
  if(profile!=='builder'){for(let i=0;i<3;i++)await click('gather:Home dry grass');await click('weave_lining');}
  await travel(location);if(profile!=='builder')await click('install:'+id+':'+key('Home nest lining'));
  await page.evaluate(()=>start_sleeping());await session.step(1);assert.equal((await session.save()).is_sleeping,true);await page.evaluate(()=>end_sleeping());await home();await persist(profile);
  await page.screenshot({path:join(out,profile+'.png')});if(profile==='wildbird'){const sized=await session.save();sized.customization.profiles.Default.settings.typography={font:'gothic',size:21};await session.open(sized);page=session.page;await home();await page.screenshot({path:join(out,'wildbird-21.png')});receipt.checks.push('Constructed bird home inspected at 1920×1080, 14/21px; typography-only fixture after the native journey');}assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await travel('Village');await travel(location);assert.equal((await session.save()).homes.properties[id].construction.site,'Wild willow stand');
  if(profile!=='builder')await click('remove:'+id+':bed');await click('dismantle:'+id);s=await session.save();assert.equal(s['current location'],'Wild willow stand');assert.equal(s.homes.properties[id],undefined);assert.equal(s.availabilities.location[location]===1,false);
  for(const [item,n]of Object.entries(costs))assert.equal(s.inventories.person.main_character[key(item)]?.count||0,Math.floor(n/2));assert.equal(s.character.money,money);
  receipt.checks.push(profile+': native gather/build without coins, usable shelter, optional handmade lining, leave/return, careful dismantling and exact salvage');
 }
 assert.deepEqual(session.errors.filter(e=>!(e.kind==='console'&&e.text.includes('404 (Not Found)'))),[]);receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}catch(e){receipt.status='failed';receipt.failure=e.stack;receipt.errors=session.errors;if(page){receipt.screen=(await page.locator('body').innerText()).slice(-10000);await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});}throw e;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
console.log(JSON.stringify(receipt,null,2));
