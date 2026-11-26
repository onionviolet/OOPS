// Desktop proof from a composed public cast. Fixture setup only grants the
// existing job/potion prerequisites; the visitor, lesson and case use UI buttons.
import assert from 'node:assert/strict';
import {mkdir,readFile,mkdtemp,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {buildBundle,serve,Session} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS as I} from './helpers/conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects,beSeerSteadyEffects,BE_SEER_ENERGY_ID} from '../src/book_world_lotm_be_seer.js';
import {WAGE_CONTRACT_NOTE} from '../src/book_world_lotm_wage.js';
import {OFFICE_LETTER_ROW,OFFICE_LETTER_RETURNED,OFFICE_CHART_ROW} from '../src/lotm_office_case.js';
import {OFFICE_FOLLOWUP_REFERENCE,OFFICE_FOLLOWUP_DONE} from '../src/lotm_office_followup.js';

const pack=conversationKnowledgeFixture(),office=pack.places[0],flat=pack.places[1];
office.indexId='lotm.place.night-watch-reception';office.name='Blackthorn reception';
flat.indexId='lotm.place.flat';flat.name='Moretti flat';
pack.places.push({...flat,id:'lotm.place.cast-33333333333333333333',indexId:'lotm.place.divination-club',name:'Divination Club'});
pack.leadLife.knownPlaces=pack.places.map(p=>p.id);
pack.leadLife.profile.cash=20;
delete pack.topicTalks;
const setup='book.lotm.fixture_office_letter.setup';
pack.householdActs={acts:[{id:setup,place:office.id,operation:'use',minutes:1,label:'Prepare the office letter fixture',
 description:'Set up the existing Nighthawk employment and Seer prerequisites.',report:'The office fixture is ready.',knowledgeKey:'fixture.office-letter',
 effects:[...beSeerDrinkEffects(),...beSeerSteadyEffects(),{type:'knowledge',actor:'player',key:WAGE_CONTRACT_NOTE,stage:'seen',value:'The Nighthawk contract is signed.',
 basis:{kind:'observation',attributedTo:'player',situationId:'book.lotm.tingen.canon_beside'}}]}]};
const followup=process.argv.find(a=>a.startsWith('--followup='))?.split('=')[1];
const delivery=process.argv.includes('--delivery')||!!followup;
const externalBuild=process.argv.slice(2).find(a=>!a.startsWith('--'));
const bundle=externalBuild?{dir:resolve(externalBuild),dispose:async()=>{}}:await buildBundle();
const output=process.env.LOTM_LETTER_EVIDENCE?resolve(process.env.LOTM_LETTER_EVIDENCE):await mkdtemp(join(tmpdir(),'oops-office-letter-'));
await mkdir(output,{recursive:true});
const server=await serve(bundle.dir);
const session=await new Session({url:server.url,seed:41,wall:Date.UTC(2026,10,25,15),opTimeout:15000,hooks:{beforeOpen:context=>
 context.route('**/private_packs/**',route=>{const path=new URL(route.request().url()).pathname;
  const data=path.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:path.endsWith('/lotm-cast/cast.json')?pack:null;
  return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
 })}}).start();
const snap=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const panel=()=>session.page.locator('#lotm_panel');
const button=id=>session.page.locator(`[data-lotm="${id}"]`).first();
const show=async(tab='Here')=>{await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
 await panel().getByRole('tab',{name:tab,exact:true}).click();
 await panel().evaluate(n=>n.querySelectorAll('details').forEach(d=>{d.open=true;}));};
const click=async id=>{const b=button(id);await b.waitFor({state:'attached'});
 await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
 assert.equal(await b.isEnabled(),true,await b.getAttribute('title')||id);await b.click();};
const step=async n=>{await session.page.evaluate(async n=>n>60?window.fastForward(n):window.advanceTicks(n,{render:true}),n);await panel().evaluate(n=>n.querySelectorAll('details').forEach(d=>{d.open=true;}));};
const boot=async()=>{const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);await p.evaluate(()=>window.simulationTestHooks.pause());
 await p.waitForFunction(()=>document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden');
 const play=p.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();
 await p.waitForFunction(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');};
const state=save=>({money:save.character.money,returned:save.expansion.actors.player.facts[OFFICE_LETTER_RETURNED],
 acting:save.expansion.actors.player.facts['book.lotm.be.acting.office-letter'],reserve:save.expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve,
 note:save.expansion.simulation.knowledge.player['divination.lotm.be.office.letter-search']?.value,
 chartStatus:save.expansion.actors.player.facts['book.lotm.be.client.officecourier'],
 chartFee:save.expansion.actors.player.facts['book.lotm.be.client.officecourier.fee'],
 chartFavor:save.expansion.actors.player.facts['book.lotm.be.client.officecourier.favor'],
 chartActing:save.expansion.actors.player.facts['book.lotm.be.acting.office-delivery'],
 followupReference:save.expansion.simulation.knowledge.player[OFFICE_FOLLOWUP_REFERENCE]?.value,
 followupDone:save.expansion.actors.player.facts[OFFICE_FOLLOWUP_DONE]});
try {
 await session.open();const p=session.page;
 await p.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
 await p.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));
 await show();await click(setup);await step(1);
 await show('Work & merit');
 await panel().locator('[data-lotm-office-practice-link="lotm.be.office.letter-interview"]').click();
 await click('lotm.be.office.letter-interview');await step(10);
 const prepare=OFFICE_LETTER_ROW+'.prepare';
 assert.equal(await button(prepare).isDisabled(),true,'method required before reading');
 await p.screenshot({path:join(output,'visitor.jpg'),type:'jpeg',quality:85});
 await click('lotm.be.lesson.tarot');await step(45);
 const before=state(await snap());
 for(const part of ['prepare','ask','interpret']){await click(OFFICE_LETTER_ROW+'.'+part);await step(1);}
 const read=state(await snap());assert.equal(read.acting,true);assert.equal(read.reserve,before.reserve-1);
 await p.screenshot({path:join(output,'reading.jpg'),type:'jpeg',quality:85});
 await click('lotm.be.office.letter-search');await step(15);
 const letterDone=state(await snap());assert.equal(letterDone.money,before.money+8);assert.equal(letterDone.returned,true);assert.match(letterDone.note,/find the sealed letter/);
 if(delivery){
  await show('Work & merit');
  await panel().locator('[data-lotm-office-practice-link="lotm.be.office.delivery-interview"]').click();
  await click('lotm.be.office.delivery-interview');await step(10);
  assert.equal(await button(OFFICE_CHART_ROW+'.prepare').isDisabled(),true);
  await click('lotm.be.lesson.chart');await step(45);
  for(const part of ['prepare','ask.unclear','interpret.unclear']){await click(OFFICE_CHART_ROW+'.'+part);await step(2);}
  const unclear=state(await snap());assert.equal(unclear.reserve,letterDone.reserve-1);assert.equal(unclear.chartActing,undefined);
  assert.equal(await button('lotm.be.office.delivery-paid').isDisabled(),true);
  assert.equal(await button('lotm.be.office.delivery-unclear').isEnabled(),true);
  await p.screenshot({path:join(output,'unclear-chart.jpg'),type:'jpeg',quality:85});
  if(followup==='ledger'){
   await click('lotm.be.office.delivery-unclear');await step(2);
   const declined=state(await snap());assert.equal(declined.chartStatus,'refused');assert.equal(declined.money,letterDone.money);
  }else{
  await click('lotm.be.office.delivery-ledger');await step(15);
  for(const part of ['prepare','ask','interpret']){await click(OFFICE_CHART_ROW+'.'+part);await step(2);}
  const supported=state(await snap());assert.equal(supported.chartActing,true);assert.equal(supported.reserve,letterDone.reserve-2);
  assert.equal(await button('lotm.be.office.delivery-paid').isEnabled(),true);
  assert.equal(await button('lotm.be.office.delivery-courtesy').isEnabled(),true);
  await p.screenshot({path:join(output,'grounded-chart.jpg'),type:'jpeg',quality:85});
  await click(followup?'lotm.be.office.delivery-courtesy':'lotm.be.office.delivery-paid');await step(2);
  const paid=state(await snap());assert.equal(paid.money,letterDone.money+(followup?0:8));assert.equal(paid.chartStatus,followup?'served_unpaid':'paid');assert.equal(paid.chartFee,followup?undefined:8);assert.equal(paid.chartFavor,1);
  }
 }
 if(followup){
  const act=part=>'lotm.be.office.followup-'+part;
  await show('Work & merit');
  const customers=panel().locator('[data-lotm-office-customers]');
  assert.match(await customers.innerText(),/tomorrow, 09:00–11:00/);
  await customers.scrollIntoViewIfNeeded();
  await p.screenshot({path:join(output,'followup-tomorrow.jpg'),type:'jpeg',quality:85});
  const saved=await snap(),x=saved.expansion;
  const day=Math.floor((x.clock-x.lotm.initializedAt)/1440)+1;
  await step(x.lotm.initializedAt+day*1440+9*60-x.clock);
  await show('Work & merit');
  const route=followup==='ledger'?'ledger':'visitor';
  await panel().locator(`[data-lotm-office-practice-link="${act(route)}"]`).click();
  assert.equal(await button(act('ledger')).isEnabled(),true);
  assert.equal(await button(act('visitor')).isEnabled(),followup!=='ledger');
  assert.match(await button(act('send')).getAttribute('title'),/Get the corrected counter and docket number/);
  assert.match(await panel().innerText(),/Two pence to the runner\./);
  if(followup==='ledger')assert.match(await button(act('visitor')).getAttribute('title'),/no chart was completed/);
  await p.screenshot({path:join(output,'followup-choice.jpg'),type:'jpeg',quality:85});
  const beforeHelp=state(await snap()),beforeClock=(await snap()).expansion.clock;await click(act(route));await step(route==='ledger'?45:5);
  assert.equal((await snap()).expansion.clock-beforeClock,route==='ledger'?45:5);
  assert.ok(state(await snap()).followupReference);
  await click(act('send'));await step(15);
  const corrected=state(await snap());assert.equal(corrected.money,beforeHelp.money-2);assert.equal(corrected.followupDone,true);
  assert.equal(corrected.chartStatus,beforeHelp.chartStatus);assert.equal(corrected.chartFavor,beforeHelp.chartFavor);assert.equal(corrected.chartActing,beforeHelp.chartActing);
 }
 const done=state(await snap());
 await show('Work & merit');
 if(delivery){
  const customers=panel().locator('[data-lotm-office-customers]');
  assert.match(await customers.textContent(),followup?/The corrected dispatch order has gone out/:/The returning visitor: event chart · paid 8 pence · remembers your help/);
  await customers.scrollIntoViewIfNeeded();
 }
 await p.screenshot({path:join(output,'returned.jpg'),type:'jpeg',quality:85});
 await p.locator('#save_button').click();await p.reload();await boot();await show();
 assert.deepEqual(state(await snap()),done);
 const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();
 const exported=join(output,'letter-export.txt');await (await download).saveAs(exported);
 await p.evaluate(()=>localStorage.clear());await p.reload();await boot();
 const imported=p.waitForEvent('domcontentloaded');await p.locator('#saved_file_input').setInputFiles(exported);await imported;await boot();await show();
 assert.deepEqual(state(await snap()),done);
 assert.equal(await button('lotm.be.office.letter-search').isDisabled(),true);
 if(delivery){
  assert.equal(await button('lotm.be.office.delivery-paid').isDisabled(),true);
  assert.equal(await button('lotm.be.office.delivery-courtesy').isDisabled(),true);
 }
 if(followup)assert.equal(await button('lotm.be.office.followup-send').isDisabled(),true);
 assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
 assert.equal((await session.uiCheck()).pageOverflow,0);
 const hash=createHash('sha256').update(await readFile(join(bundle.dir,'bundle.js'))).digest('hex');
 console.log(JSON.stringify({pass:true,bundle:hash,viewport:'1920x1080',before,done,persistence:'Save/reload/Export/Import',output}));
 await rm(exported,{force:true});
} catch(error){console.error(session.errors.filter(e=>!e.text.includes('404')).slice(-5));throw error;}
// Dispose files/server before graceful browser shutdown: Windows can leave its
// close promise pending after Import, even when the browser process has exited.
finally {server.close();await bundle.dispose();if(!process.env.LOTM_LETTER_EVIDENCE)await rm(output,{recursive:true,force:true});await session.browser?.close();}
