// Native browser proof with a synthetic private-pack overlay, fresh origin and no personal save.
// BUILD_OUT=.lane-builds/foundation-conversations npm run build
// node tests/conversation_knowledge_browser.mjs <BUILD_OUT> <outDir>
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve,Session} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS as I,CONVERSATION_FIXTURE_ANSWER as answer} from './helpers/conversation_knowledge_fixture.mjs';
const [build,out]=process.argv.slice(2).map(p=>resolve(p));
await mkdir(out,{recursive:true});
const server=await serve(join(build,'dist')),pack=conversationKnowledgeFixture();
const checks=[],ok=(label,value)=>{assert.ok(value,label);checks.push(label);console.log('PASS '+label);};
let castRequests=0;
const session=await new Session({url:server.url,seed:37,wall:Date.UTC(2026,10,4,15),opTimeout:15000,hooks:{beforeOpen:async context=>{
 await context.route('**/private_packs/**',async route=>{
  const p=new URL(route.request().url()).pathname;
  if(p.endsWith('/lotm-cast/cast.json')&&++castRequests>1)await new Promise(r=>setTimeout(r,500));
  const data=p.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:p.endsWith('/lotm-cast/cast.json')?pack:null;
  return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
 });
}}}).start();
const snap=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const button=id=>session.page.locator(`[data-lotm="${id}"]`).first();
const openTopics=async()=>session.page.evaluate(()=>{for(const n of document.querySelectorAll('#lotm_panel details'))n.open=true;});
const step=async n=>{await session.step(n);await session.page.evaluate(()=>window.advanceTicks(0,{render:true}));await openTopics();};
const play=async()=>{
 const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);
 await p.evaluate(()=>window.simulationTestHooks.pause());
 let stable=0;const deadline=Date.now()+45000;
 while(Date.now()<deadline){
  const b=p.locator('#loading_screen_play_button');if(await b.isVisible())await b.click();
  const confirm=p.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();
  const hidden=await p.evaluate(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');
  stable=hidden?stable+1:0;if(stable>=3)return;
  await p.waitForTimeout(100);
 }
 throw Error('The native loading screen did not become ready for input.');
};
const show=async()=>{const p=session.page;const sel=p.getByRole('combobox',{name:'Other known panels'});await sel.selectOption('lotm');await openTopics();};
try{
 await session.open();const p=session.page;
 await p.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();
 ok('named fixture begins with five pence',(await snap()).character.money===5);
 ok('response initially blocked',await button(I.answer).isDisabled());
 ok('absent neighbour cannot be addressed',await button('book.lotm.fixture_absent.ask').isDisabled());
 let text=await p.locator('#lotm_panel').innerText();
 ok('preview keeps future answer and private recipient knowledge hidden',!text.includes(answer)&&!text.includes('cobalt-seven'));
 ok('offer shows time and real payment',await button(I.offer).isEnabled()&&/2 min/.test(await button(I.offer).innerText())&&/money -1/.test(text));
 await button(I.offer).scrollIntoViewIfNeeded();
 await p.screenshot({path:join(out,'before-1920.png')});
 await button(I.offer).click();await openTopics();
 ok('pending disclosure grants no knowledge',!(await snap()).expansion.simulation.knowledge[I.person]?.[I.privateKey]);
 await button('cancel').click();await step(1);
 let s=await snap();ok('cancel returns cost and teaches no recipient',s.character.money===5&&!s.expansion.simulation.knowledge[I.person]?.[I.privateKey]);
 await button(I.offer).click();await step(3);s=await snap();
 ok('completed disclosure pays exactly once',s.character.money===4);
 ok('recipient learns but absent neighbour does not',!!s.expansion.simulation.knowledge[I.person]?.[I.privateKey]&&!s.expansion.simulation.knowledge[I.away]?.[I.privateKey]);
 ok('recipient memory changes the next available response',await button(I.answer).isEnabled());
 text=await p.locator('#lotm_panel').innerText();ok('unasked answer and recipient private text remain hidden',!text.includes(answer)&&!text.includes('cobalt-seven'));
 await button(I.answer).click();await step(2);s=await snap();
 ok('the new response teaches the player its useful result',s.expansion.simulation.knowledge.player[I.answerKey]?.value===answer);
 await p.locator('#lotm_panel [data-tab="notebook"]').click();
 ok('received answer appears after the conversation',(await p.locator('#lotm_panel').innerText()).includes(answer));
 ok('one settled answer is shown once',(await p.locator('#lotm_panel').innerText()).split(answer).length===2);
 await p.screenshot({path:join(out,'received-1920.png')});
 await p.locator('#save_button').click();
 const digest=s=>JSON.stringify({money:s.character.money,knowledge:s.expansion.simulation.knowledge,jobs:s.expansion.simulation.jobs});
 const before=digest(await snap());
 await writeFile(join(out,'before-reload.json'),JSON.stringify(await snap(),null,2));
 await p.reload();await play();await show();ok('reload retains both holders and the exact payment',digest(await snap())===before);
 await p.waitForFunction(()=>document.getElementById('location_name_span')?.textContent==='Fixture room');
 ok('late source restores the native place identity after reload',(await p.locator('#location_name_span').innerText())==='Fixture room');
 ok('late source refresh keeps the current conversation task',await p.locator('#lotm_panel').isVisible());
 ok('return label uses the restored place name',(await p.locator('#center_mode_back').innerText()).includes('Fixture room'));
 const downloaded=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=join(out,'fixture-export.txt');await(await downloaded).saveAs(file);
 await p.evaluate(()=>localStorage.clear());await p.reload();await play();
 const imported=p.waitForEvent('domcontentloaded',{timeout:45000});
 await p.locator('#saved_file_input').setInputFiles(file);await imported;await play();await show();
 ok('literal import retains the consequence and payment',digest(await snap())===before);
 ok('imported recipient memory still unlocks the response',await button(I.answer).isEnabled());
 ok('private recipient text stays out of the player panel',!(await p.locator('#lotm_panel').innerText()).includes('cobalt-seven'));
 // Literal import can finish publishing the native save before its loading
 // overlay has finished. Wait for actual input readiness before a pointer action.
 await play();
 await p.waitForFunction(()=>document.getElementById('location_name_span')?.textContent==='Fixture room');
 ok('literal import resolves the same native identity',(await p.locator('#location_name_span').innerText())==='Fixture room');
 await p.locator('#lotm_panel [data-tab="notebook"]').click();
 ok('imported result stays readable in Notebook',(await p.locator('#lotm_panel').innerText()).includes(answer));
 await p.locator('#lotm_panel').waitFor({state:'visible'});
 await p.evaluate(()=>{window.scrollTo(0,0);document.getElementById('lotm_panel')?.scrollIntoView({block:'center'});});
 await writeFile(join(out,'final-layout.json'),JSON.stringify(await p.evaluate(()=>({scrollY,viewport:innerHeight,panel:document.getElementById('lotm_panel').getBoundingClientRect().toJSON(),body:document.body.getBoundingClientRect().toJSON()})),null,2));
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await p.screenshot({path:join(out,'after-1920.png')});
 ok('no browser errors',session.errors.length===0);
}catch(error){
 await session.page.screenshot({path:join(out,'failure-1920.png')}).catch(()=>{});
 await writeFile(join(out,'failure.txt'),await session.page.locator('body').innerText().catch(()=>''));
 throw error;
}finally{
 const bundleHash=createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex');
 await writeFile(join(out,'result.json'),JSON.stringify({route:'synthetic native cast fixture; fixture enrollment hook, UI conversation actions',viewport:'1920x1080',bundleHash,checks,errors:session.errors},null,2));
 await session.browser.close();server.close();
}
