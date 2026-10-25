// Re-fit K1 work-plan proof (2026-10-22): the itinerary's latest settled step shows
// beside current work. The fixture drives the real reserve route in node (as
// tests/routine_jobs does) on top of the perf fixture, then loads it as a generated
// save on fresh origins. No personal saves; fixture facts are not natural-acquisition
// evidence. Usage: node scripts/playtest/refit-k1-work-plan.mjs . <out> (after npm run build)
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {loadExpansionState,advanceSimulation} from '../../src/expansion_engine.js';
import {expeditionRegistry as registry} from '../../src/expedition_content.js';
import {beginBodyRecord} from '../../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand as workshop} from '../../src/reference_gameplay_host.js';
import {REFERENCE_GAMEPLAY_IDS as RI,REFERENCE_GAMEPLAY_KEYS as K} from '../../src/reference_gameplay_content.js';
import {startAuditedKitReserve} from '../../src/audited_kit_reserve_host.js';
import {Game_Time} from '../../src/game_time.js';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/refit-k1-work-plan-proof');await mkdir(out,{recursive:true});
const server=await serve(root),receipt={root,setup:'Fresh origin per case; perf fixture plus a node-driven audited kit reserve with one completed batch; generated save only.',cases:[],checks:[]};
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p)=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'village.shackUnlocked':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true});
const advance=(p,n)=>{const c=ctx(p);const o=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...o,vitals:o.vitals||c.vitals};};
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));seed.customization=defaultCustomizationState();delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
let g={state:loadExpansionState(structuredClone(seed.expansion),registry),external:{money:seed.character.money},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};const start=g.state.clock;
g=beginBodyRecord(g.state,registry,ctx(g));g.state.simulation.people.player.body=structuredClone(body);g=beginFeatureObjects(g.state,registry,ctx(g));
g=commitFeatureObjectCommand(g.state,registry,{id:'feature_objects.inspect'},ctx(g));g=advance(g,2);g=enrollReferenceGameplay(g.state,ctx(g));g=workshop(g.state,registry,{id:RI.open},ctx(g));
g.gameplay.player.inventory={[K.kit]:3,[K.resin]:3,[K.sound]:6};g=startAuditedKitReserve(g.state,registry,ctx(g));g=advance(g,3);
seed.expansion=g.state;for(const [k,n]of Object.entries(g.gameplay.player.inventory))seed.inventories.person.main_character[k]={count:n};
const calendar=new Game_Time(seed['current time']);calendar.goUp(g.state.clock-start);seed['current time']=Object.fromEntries(['year','month','day','hour','minute','day_count'].map(k=>[k,calendar[k]]));
const s=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,9,22,15)});let p,phase='start';
const section=async()=>{await p.locator('#workspace_navigation select').first().selectOption('notebook');await p.locator('[data-notebook-view="here"]').click();
 if(!await p.locator('#feature_expansion_panel').evaluate(n=>n.open))await p.locator('#feature_expansion_panel > summary').click();
 await p.locator('#feature_expansion_panel summary').filter({hasText:'Finite survey-kit reserve'}).click();await p.waitForTimeout(250);
 const work=p.locator('#feature_expansion_panel').getByText(/Last step result:/).first();await work.scrollIntoViewIfNeeded();return work;};
try{
 await s.start();
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1800,1040,21],[1536,864,14],[1536,864,21]]){
  phase=`work plan ${width}/${size}`;const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;await s.open(f);p=s.page;await p.setViewportSize({width,height});await p.waitForTimeout(400);
  const work=await section();const text=await work.innerText();
  assert.match(text,/1\/3 accepted batches used; 2 remain\./);
  assert.match(text,/Last step result: Bind two sound staves with set resin · two survey kits \+ 3 min completed\. \d+ game min ago\./);
  assert.equal(await work.isVisible(),true);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:join(out,`work-plan-${width}-${size}.png`)});receipt.cases.push({width,height,size,text:text.slice(0,600)});
 }
 assert.deepEqual(s.errors,[]);receipt.errors=s.errors;receipt.checks.push('The audited kit reserve itinerary shows its latest completed step beside its batch count at all six desktop cases.');
 await writeFile(join(out,'result.json'),JSON.stringify(receipt,null,1));console.log(JSON.stringify({ok:true,out,cases:receipt.cases.length}));
}catch(error){receipt.failed={phase,error:error.stack,errors:s.errors};await writeFile(join(out,'result.json'),JSON.stringify(receipt,null,1));console.error(phase,error);if(p)await p.screenshot({path:join(out,'failure.png')}).catch(()=>{});process.exitCode=1;}
finally{await s.close();server.close();}
