// Native desktop proof: ordinary local crossing and visible developer Klein entry.
// No incident state, relationship, pay or completed action is injected.
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Session} from '../scripts/playtest/lib.mjs';
import {serve} from '../scripts/perf/lib.mjs';
import {TENT,TENT_COMMANDS,tentIncidentData,tentIncidentFacts} from '../src/lotm_tent_incident.js';

const build=resolve(process.argv[2]||'.lane-builds/tingen-tent-20261125');
const out=resolve(process.argv[3]||'docs/representations/evidence/lotm-tent-incident-2026-11-25');
const mode=process.argv[5]||'both';assert.ok(['both','local','klein'].includes(mode));
const checkpointDir=resolve(process.argv[6]||'work/lotm-tent-browser-d815-20261125');
const acceptedCheckpointBuild=process.argv[7]||null;
if(acceptedCheckpointBuild)assert.match(acceptedCheckpointBuild,/^[a-f0-9]{64}$/);
const pack=JSON.parse(await readFile('private_packs/lotm-cast/cast.json','utf8'));
const data=tentIncidentData(pack);assert.ok(data);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalBundleSha256=hash(await readFile(join(build,'dist/bundle.js')));
if(process.argv[4])assert.equal(originalBundleSha256,process.argv[4],'requested normal build matches before proof');
await mkdir(out,{recursive:true});await mkdir(checkpointDir,{recursive:true});
const checks=[],served=new Set(),responses=[],captureErrors=[],setupClockSteps=[],checkpoints=[];
const server=await serve(build),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,10,25,15),opTimeout:30000,
 hooks:{beforeOpen:async context=>context.on('response',r=>{if(new URL(r.url()).pathname==='/dist/bundle.js')responses.push(r.body().then(bytes=>served.add(hash(bytes))).catch(error=>captureErrors.push(String(error))));})}});
async function drainResponses(){await Promise.all(responses);assert.deepEqual(captureErrors,[],'all served gameplay bundle bodies captured before navigation');}
const snap=()=>session.page.evaluate(()=>simulationTestHooks.snapshot());
const expansion=s=>s.expansion,elapsed=s=>expansion(s).clock-expansion(s).lotm.initializedAt;
const facts=s=>expansion(s).actors.player.facts;
const knowledge=s=>expansion(s).simulation.knowledge.player||{};
const trust=s=>expansion(s).simulation.relationships[data.reader]?.player?.axes?.trust||0;
const purse=s=>expansion(s).actors[data.reader]?.resources?.[TENT.prefix+'purse'];
const panel=()=>session.page.locator('#lotm_panel');
const button=id=>panel().locator(`[data-lotm="${id}"]`).first();
async function show(){if(!await panel().isVisible())await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');const here=panel().getByRole('tab',{name:'Here',exact:true});if(await here.getAttribute('aria-selected')!=='true')await here.click();}
async function reveal(id){
 const b=button(id);assert.equal(await b.count(),1,`native control exists: ${id}`);
 const ancestors=await b.evaluate(n=>{const a=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)a.push([...p.parentElement.children].indexOf(p));return a.length;});
 for(let i=0;i<ancestors;i++){
  const closed=b.locator('xpath=ancestor::details[not(@open)][last()]');await closed.locator(':scope > summary').click();
 }
 await b.scrollIntoViewIfNeeded();return b;
}
async function start(id){const b=await reveal(id);assert.ok(await b.isEnabled(),`${id}: ${await b.getAttribute('title')}`);await b.click();}
async function finish(id,expected){
 const quoted=await reveal(id);assert.match((await quoted.innerText())+' '+(await quoted.getAttribute('title')||''),new RegExp(`\\b${expected} min\\b`),'duration is visible before choosing '+id);
 const before=await snap();await start(id);const s=await snap();
 const job=expansion(s).simulation.jobs.find(j=>j.commandId===id);
 assert.ok(job,`native job started: ${id}`);assert.equal(job.due-expansion(before).clock,expected);
 await session.step(expected);assert.equal(expansion(await snap()).actors.player.completed[id],(expansion(before).actors.player.completed[id]||0)+1);
}
async function waitUntil(offset){const s=await snap();assert.ok(elapsed(s)<=offset);if(elapsed(s)===offset)return;
 const id=`wait.until.${expansion(s).lotm.initializedAt+offset}`,b=await reveal(id);assert.ok(await b.isEnabled());
 const target=expansion(s).lotm.initializedAt+offset;
 const wall=performance.now();
 const measurement={from:elapsed(s),to:offset,wallStartedAt:new Date().toISOString(),method:'visible Wait until control',status:'running'};
 setupClockSteps.push(measurement);
 await writeFile(join(out,'setup-progress.json'),JSON.stringify(setupClockSteps,null,2));
 try{
  await b.click();
  measurement.clickMs=Math.round(performance.now()-wall);
  let lastClock=expansion(s).clock;
  while(await panel().locator('[data-lotm="wait.stop"]').count()){
   const state=await session.page.waitForFunction(previous=>{
    const clock=simulationTestHooks.clock();
    return clock>previous||!document.querySelector('#lotm_panel [data-lotm="wait.stop"]')?{clock}:false;
   },lastClock,{timeout:90000,polling:500});
   lastClock=(await state.jsonValue()).clock;
   await state.dispose();
  }
  const clock=await session.page.evaluate(()=>simulationTestHooks.clock());
  const receipt=await panel().locator(':scope > p[role="status"]').last().innerText();
  assert.equal(clock,target,'advertised Wait target: '+receipt);
  assert.match(receipt,/You waited \d+ min here/);
  measurement.status='completed';
 }catch(error){
  measurement.status='failed';
  throw error;
 }finally{
  measurement.wallMs=Math.round(performance.now()-wall);
  await writeFile(join(out,'setup-progress.json'),JSON.stringify(setupClockSteps,null,2));
 }
}
async function ready(){await session.page.waitForFunction(()=>!!window.simulationTestHooks);await session.page.evaluate(()=>simulationTestHooks.pause());const play=session.page.locator('#loading_screen_play_button');if(await play.isVisible())await play.click({force:true});await drainResponses();await show();}
async function retain(name,s=undefined){
 const state=s||await session.save(),bytes=Buffer.from(JSON.stringify(state)),sha256=hash(bytes);
 await writeFile(join(checkpointDir,name+'.json'),bytes);await writeFile(join(checkpointDir,name+'.meta.json'),JSON.stringify({sha256,bundleSha256:originalBundleSha256,route:'Native UI-earned test checkpoint; no outcome edits'}));
 checkpoints.push({name,sha256,mode:'earned in this run'});return state;
}
async function stored(name){try{const bytes=await readFile(join(checkpointDir,name+'.json')),meta=JSON.parse(await readFile(join(checkpointDir,name+'.meta.json'),'utf8'));assert.equal(hash(bytes),meta.sha256);assert.ok(meta.bundleSha256===originalBundleSha256||meta.bundleSha256===acceptedCheckpointBuild,'checkpoint build is current or explicitly admitted for unchanged cross-build replay');return {state:JSON.parse(bytes),sha256:meta.sha256,earnedOnBundleSha256:meta.bundleSha256};}catch(error){if(error.code==='ENOENT')return null;throw error;}}
async function restore(name){const saved=await stored(name);if(!saved)return null;await session.open(saved.state);await ready();checkpoints.push({name,sha256:saved.sha256,earnedOnBundleSha256:saved.earnedOnBundleSha256,restoredOnBundleSha256:originalBundleSha256,mode:'restored unchanged native UI-earned checkpoint from earlier attempt'});return saved.state;}
async function persist(label){
 const before=await session.save();await drainResponses();await session.page.reload();await ready();
 const pick=s=>({facts:Object.fromEntries(Object.entries(facts(s)).filter(([k])=>k.startsWith(TENT.prefix))),trust:trust(s),purse:purse(s),money:s.character.money,reading:knowledge(s)['book.lotm.excursion.reading.seen']});
 assert.deepEqual(pick(await snap()),pick(before),label+' Save/reload');
 const download=session.page.waitForEvent('download');await session.page.locator('#save_to_file_button').click();
 const chunks=[];for await(const chunk of await(await download).createReadStream())chunks.push(chunk);
 await session.open();await drainResponses();session.page.on('dialog',d=>d.accept());const loaded=session.page.waitForEvent('domcontentloaded');
 await session.page.locator('#saved_file_input').setInputFiles({name:'tingen-tent-save.txt',mimeType:'text/plain',buffer:Buffer.concat(chunks)});await loaded;await ready();
 assert.deepEqual(pick(await snap()),pick(before),label+' native Export/Import');
 checks.push(label+' Save/reload and literal native Export/Import');
}
async function screenshot(name){await panel().locator('[data-lotm-tent-incident]').scrollIntoViewIfNeeded();await session.page.screenshot({path:join(out,name+'.png')});assert.equal((await session.uiCheck()).pageOverflow,0);}
async function walkTo(place){
 if(expansion(await snap()).simulation.people.player.location===place)return;
 const walk=await reveal('lotm.move.'+place);assert.ok(await walk.isEnabled());await walk.click();
 const s=await snap(),job=expansion(s).simulation.jobs[0];assert.ok(job,'native walk starts a job');await session.step(job.due-expansion(s).clock);
 assert.equal(expansion(await snap()).simulation.people.player.location,place);
}
async function packAct(id){const row=pack.householdActs.acts.find(a=>a.id===id);assert.ok(row);await walkTo(row.place);await finish(id,row.minutes);}
async function entry(profile){
 console.log('Starting native entry: '+profile);
 await session.open();
 await session.page.getByRole('button',{name:'Cross',exact:true}).click();await button('pick_'+profile).click();
 await session.page.getByRole('button',{name:profile==='be'?'Start this new life':'Confirm and cross to Tingen',exact:true}).click();
 const expectedProfile=(profile==='be'?pack.leadLife:pack.host).profile.id;
 await session.page.waitForFunction(id=>window.simulationTestHooks?.snapshot()?.expansion?.lotm?.entryProfile===id,expectedProfile);await ready();
 if(profile==='be'){
  const sequence=pack.householdActs.sequences.find(s=>s.id==='opening_household');assert.ok(sequence);
  for(const stage of sequence.stages){if(stage.readyOffset!=null)await waitUntil(stage.readyOffset);await packAct(stage.commandId);}
  const depart=pack.householdActs.sequences.flatMap(s=>s.stages).find(s=>s.commandId==='book.lotm.excursion.depart');assert.ok(depart?.readyOffset);
  await waitUntil(depart.readyOffset);await packAct(depart.commandId);await packAct('book.lotm.excursion.bread');
 }
 await walkTo(data.place);
 await waitUntil(TENT.open);await screenshot(profile+'-arrival');console.log('Reached native tent opening: '+profile);return retain(profile+'-arrival');
}

try{
 await session.start();
 if(mode!=='klein'){
 const local=(await stored('beside-arrival'))?.state||await entry('beside');
 let witnessed=(await stored('local-witnessed'))?.state;
 if(!await restore('local-response')){
  if(witnessed){await restore('local-witnessed');}else{await session.open(local);await ready();await finish(TENT_COMMANDS.watch,TENT.watchMinutes);assert.equal(knowledge(await snap())['book.lotm.excursion.reading.seen'],undefined);witnessed=await retain('local-witnessed');console.log('MILESTONE actual local watch settled with public witness');}
  await finish(TENT_COMMANDS.clarify,TENT.clarifyMinutes);assert.equal(trust(await snap()),1);await retain('local-response');
 }
 assert.ok(witnessed);await screenshot('local-calm-response');await persist('Local response');
 console.log('Local observation/response and persistence passed');
 await waitUntil(TENT.nextDay);const referralStart=await snap();await finish(TENT_COMMANDS.referral,TENT.referralMinutes);
 const money=(await snap()).character.money;await start(TENT_COMMANDS.flyers);assert.equal(purse(await snap()),0);await retain('local-flyers-pending');await persist('Pending flyer round');
 const pending=expansion(await snap()).simulation.jobs.find(j=>j.commandId===TENT_COMMANDS.flyers);assert.ok(pending);await session.step(pending.due-expansion(await snap()).clock);
 assert.equal((await snap()).character.money,money+TENT.pence);assert.equal(purse(await snap()),0);await screenshot('local-paid-round');await persist('Completed flyer round');await retain('local-paid');
 checks.push(`Local public witness and calm response earn trust; ${TENT.referralMinutes}min referral and ${TENT.workMinutes}min finite-purse round pay ${TENT.pence}p`);
 console.log('Local trusted work and pending/final persistence passed');
 await session.open(local);await show();await session.step(60);assert.equal(facts(await snap())[TENT.prefix+'witness'],undefined);assert.equal(trust(await snap()),0);await screenshot('missed-window');
 await waitUntil(TENT.nextDay);await finish(TENT_COMMANDS.inquire,TENT.inquiryMinutes);await finish(TENT_COMMANDS.flyers,TENT.workMinutes);assert.equal(trust(await snap()),0);checks.push('An hour at the tent without choosing to watch grants no witness/trust; independent ordinary inquiry remains usable');
 await session.open(witnessed);await show();await finish(TENT_COMMANDS.leave,TENT.leaveMinutes);assert.equal(trust(await snap()),0);assert.equal(facts(await snap())[TENT.prefix+'response'],'left');await screenshot('local-leave-choice');checks.push('The one-minute leave choice resolves the local response without a fee or trust reward');
 console.log('Local missed-window, ordinary work and leave alternatives passed');
 assert.equal(elapsed(referralStart),TENT.nextDay);
 }
 if(mode!=='local'){
 if(!await restore('klein-paid')){
  if(!await restore('klein-response')){
   if(!await restore('be-arrival'))await entry('be');await finish('book.lotm.excursion.reading',pack.householdActs.acts.find(a=>a.id==='book.lotm.excursion.reading').minutes);
   assert.ok(knowledge(await snap())['book.lotm.excursion.reading.seen']);await finish(TENT_COMMANDS.clarify,TENT.clarifyMinutes);
   assert.ok(await button('book.lotm.excursion.decline').isEnabled(),'original decline remains reachable');await packAct('book.lotm.excursion.decline');await retain('klein-response');await screenshot('klein-own-reading');await persist('Klein observation and response');
  }
  assert.equal(trust(await snap()),1);assert.ok(knowledge(await snap())['book.lotm.excursion.reading.seen']);
  await waitUntil(TENT.nextDay);await finish(TENT_COMMANDS.referral,TENT.referralMinutes);const kleinMoney=(await snap()).character.money;await finish(TENT_COMMANDS.flyers,TENT.workMinutes);assert.equal((await snap()).character.money,kleinMoney+TENT.pence);assert.equal(purse(await snap()),0);await retain('klein-paid');
 }
 await screenshot('klein-paid-round');await persist('Klein paid round');
 checks.push('Klein retains his own earned reading and trust; native referral and finite-purse paid continuation complete or resume from the exact earned paid checkpoint');
 }
 assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
 await drainResponses();const bundleSha256=hash(await readFile(join(build,'dist/bundle.js')));assert.equal(bundleSha256,originalBundleSha256,'fixed disk bundle remains unchanged');assert.deepEqual([...served],[bundleSha256]);
 const result={status:'agent-verified-not-human-reviewed',mode,viewport:{width:1920,height:1080},bundleSha256,servedBundleSha256:[...served],setup:'Ordinary beside crossing and visible developer Klein playthrough; native walks/actions and short Wait; long offered Wait targets reached by normal test tick advancement, no incident outcome edits',setupClockSteps,checkpoints,checks,pageErrors:[]};
 await writeFile(join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){
 console.error(error);
 await Promise.allSettled(responses);await writeFile(join(out,'failure-progress.json'),JSON.stringify({status:'failed',mode,bundleSha256:originalBundleSha256,servedBundleSha256:[...served],captureErrors,setupClockSteps,checkpoints,completedChecks:checks,error:String(error)},null,2));
 if(session.page){
  const s=await snap().catch(()=>null);if(s){const e=expansion(s);await writeFile(join(out,'failure-state.json'),JSON.stringify({clock:e.clock,elapsed:elapsed(s),profile:e.lotm?.entryProfile,
   tentFacts:tentIncidentFacts(e,data),playerFacts:Object.fromEntries(Object.entries(facts(s)).filter(([k])=>k.startsWith(TENT.prefix))),
   completed:Object.fromEntries(Object.entries(e.actors.player.completed).filter(([k])=>k.startsWith(TENT.prefix))),
   jobs:e.simulation.jobs.map(j=>({id:j.id,commandId:j.commandId,due:j.due})),
   tentLog:e.simulation.log.filter(l=>JSON.stringify(l).includes(TENT.prefix)).slice(-12).map(l=>({at:l.at,text:l.text,cause:l.cause}))},null,2));}
  await session.page.screenshot({path:join(out,'failed.png')}).catch(()=>{});
 }
 await writeFile(join(out,'failure.txt'),String(error.stack)+'\n'+await session.page?.locator('body').innerText().catch(()=>''));throw error;
}
finally{await session.close();await server.close();}
