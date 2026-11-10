// node tests/lotm_elliott_case_browser.mjs <isolated BUILD_OUT> <private evidence dir>
// Canonical case rows with a shortened entry that grants only earlier story prerequisites.
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join, resolve} from 'node:path';
import {Session, serve} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture} from './helpers/conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects, beSeerSteadyEffects, BE_SEER_ENERGY_ID, BE_SPIRIT_EXHAUSTION, BE_SPIRIT_VISION} from '../src/book_world_lotm_be_seer.js';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';
import {beDivMethodLearnEffects} from '../src/book_world_lotm_divination_method.js';

const [build,out]=process.argv.slice(2).map(path=>resolve(path));
await mkdir(out,{recursive:true});
const source=JSON.parse(await readFile('private_packs/lotm-cast/cast.json','utf8'));
const fixture=conversationKnowledgeFixture();
const situation='book.lotm.tingen.canon_beside';
const prefix='book.lotm.elliott.';
const book='book.lotm.';
const entryId=prefix+'fixture';
const stages=['kj3u.ride','kj3u.hire','kj3u.dowse1','kj3u.route','kj3u.block','kj3u.floor3','kj3v.poem'];
const canonicalRows=stages.map(id=>source.householdActs.acts.find(row=>row.id===book+id));
const [ride,,,,,,poem]=canonicalRows;
const leonard=poem.targetId;
const room=ride.place;
const old=fixture.leadLife.profile.start;
fixture.places=[{...fixture.places.find(p=>p.id===old),id:room,name:'Tingen search · shortened entry'}];
fixture.people=[fixture.people.find(p=>p.id===fixture.leadLife.actorId),{...fixture.people[1],id:leonard,indexId:'fixture.leonard',name:'Leonard Mitchell'}];
fixture.host.profile.start=room;
Object.assign(fixture.leadLife,{knownPlaces:[room],relations:[]});
fixture.leadLife.profile.start=room;
fixture.schedule=[];fixture.bindings.schedule=[];fixture.beats=[];fixture.bindings.beats=[];
delete fixture.topicTalks;
const report=(key,value)=>({type:'knowledge',actor:'player',key,value,stage:'seen',basis:{kind:'observation',attributedTo:'player',situationId:situation}});
const actorFact=key=>({type:'fact',scope:'actor',actor:'player',key:book+key,value:true});
const entry={id:entryId,place:room,minutes:1,operation:'use',label:'Enter the search fixture',
 description:'Begin after the office briefing and the earlier dowsing lesson.',report:'You wait with Leonard for Klee’s return.',
 knowledgeKey:prefix+'fixture.arrived',costs:[],effects:[
  ...beSeerDrinkEffects(),...beSeerSteadyEffects(),
  ...beDivMethodLearnEffects('dowsing','You learned the principle of dowsing.',situation),
  ...['kj3s.vessel.idea','kj3u.mission.joined','kj3u.contract.signed','kj3u.pendulum.worn','kj3t.dowsing.rules','kj3p.switch.set'].map(actorFact),
  report(book+'kj3u.medium.seen','Klee is fetching Elliott’s belongings.'),
  {type:'fact',scope:'world',key:'household.excursion.meeting.active',value:false},
  {type:'relocate',actor:leonard,location:room}
 ]};
const query=source.householdActs.inquiries.queries.find(row=>row.id===prefix+'dowsing');
assert.ok(query);
fixture.householdActs={requiredPeople:[leonard],inquiries:{queries:[query]},acts:[entry,...canonicalRows],
 sequence:{id:prefix+'fixture.sequence',title:'Elliott’s case · shortened entry',
  stages:[entry,...canonicalRows].map(row=>({commandId:row.id,label:row.label})),conclusion:'Leonard has your account.'}};

assert.deepEqual(validateLotmCast(fixture),[]);
const server=await serve(join(build,'dist'));
const session=await new Session({url:server.url,seed:41,wall:Date.UTC(2026,10,9,17),opTimeout:20000,hooks:{beforeOpen:async context=>{
 await context.route('**/private_packs/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  const data=path.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:path.endsWith('/lotm-cast/cast.json')?fixture:null;
  return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
 });
}}}).start();
const checks=[];
const check=(message,value)=>{assert.ok(value,message);checks.push(message);console.log('PASS '+message);};
const button=id=>session.page.locator(`[data-lotm="${id===entryId?id:book+id}"]`).first();
const snapshot=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const show=async()=>{
 await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
 await session.page.evaluate(()=>{for(const e of document.querySelectorAll('#lotm_panel details'))e.open=true;});
};
const ready=async()=>{
 const p=session.page;
 await p.waitForFunction(()=>!!window.simulationTestHooks);
 await p.evaluate(()=>window.simulationTestHooks.pause());
 for(let i=0;i<450;i++){
  for(const id of ['#loading_screen_play_button','#hero_creation_panel_confirmation']){
   const b=p.locator(id);if(await b.isVisible())await b.click();
  }
  if(await p.evaluate(()=>document.getElementById('loading_screen')?.style.visibility==='hidden')){
   await p.waitForTimeout(350);await show();return;
  }
  await p.waitForTimeout(100);
 }
 throw Error('The generated game did not become ready.');
};
const advance=async minutes=>{await session.step(minutes);await session.page.evaluate(()=>window.advanceTicks(0,{render:true}));await show();};
const act=async id=>{
 await button(id).click();
 const row=id===entryId?entry:canonicalRows.find(r=>r.id===book+id);
 await advance(row.minutes);
};
const save=async()=>{await session.page.locator('#save_button').click();return session.page.evaluate(()=>localStorage.getItem('save data'));};
const reload=async bytes=>{
 if(bytes)await session.page.evaluate(data=>localStorage.setItem('save data',data),bytes);
 await session.page.reload();await ready();
};
const change=async(bytes,edit)=>{const s=JSON.parse(bytes);edit(s);await reload(JSON.stringify(s));};
const evidence=(s,key,actor='player')=>s.expansion.simulation.knowledge[actor]?.[key];
const stock=(s,id)=>s.inventories.person.main_character[JSON.stringify({id:book+'elliott_'+id})]?.count??0;
const actorFacts=s=>s.expansion.actors.player.facts;
const pool=s=>s.expansion.simulation.energies.player[BE_SEER_ENERGY_ID];
const effects=s=>s.expansion.simulation.conditions.player??{};
const sightProof=s=>JSON.stringify([s.expansion.clock,pool(s),effects(s)[BE_SPIRIT_VISION],evidence(s,prefix+'auras'),evidence(s,prefix+'inference'),evidence(s,prefix+'klee.account'),stock(s,'clothes'),stock(s,'amulet')]);

try{
 await session.open();
 await session.page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));
 await show();await act(entryId);await act('kj3u.ride');await act('kj3u.hire');
 let s=await snapshot();
 check('Klee gives exactly one clothes item and one amulet',stock(s,'clothes')===1&&stock(s,'amulet')===1);
 const equipped=await save();
 await change(equipped,s=>delete s.inventories.person.main_character[JSON.stringify({id:book+'elliott_clothes'})]);
 check('the first reading requires Elliott’s clothes',await button('kj3u.dowse1').isDisabled());
 await change(equipped,s=>delete s.inventories.person.main_character[JSON.stringify({id:book+'elliott_amulet'})]);
 check('the first reading requires Elliott’s amulet',await button('kj3u.dowse1').isDisabled());
 await reload(equipped);await act('kj3u.dowse1');s=await snapshot();
 check('native divination records the signal and forward bearing',evidence(s,'divination.'+query.id+'.signal')?.basis.status==='signal'&&actorFacts(s)[prefix+'bearing']==='ahead');
 const bearing=await save();
 await change(bearing,s=>actorFacts(s)[prefix+'bearing']='wrong direction');
 check('the search rejects a mismatched bearing',await button('kj3u.route').isDisabled());
 await change(bearing,s=>delete s.inventories.person.main_character[JSON.stringify({id:book+'elliott_clothes'})]);
 check('later readings can use the amulet alone',await button('kj3u.route').isEnabled());
 await reload(bearing);
 check('bearing survives reload and opens the search',actorFacts(await snapshot())[prefix+'bearing']==='ahead'&&await button('kj3u.route').isEnabled());
 await act('kj3u.route');check('the route produces a bearing to the stairs',actorFacts(await snapshot())[prefix+'bearing']==='stairs');
 await act('kj3u.block');const landing=await save();
 await change(landing,s=>{s.expansion.simulation.conditions.player??={};s.expansion.simulation.conditions.player[BE_SPIRIT_EXHAUSTION]={intensity:3,expiresAt:s.expansion.clock+720};});
 check('exhausted Spirit Vision blocks the inspection',await button('kj3u.floor3').isDisabled());
 await reload(landing);const reserve=pool(await snapshot()).reserve;
 await act('kj3u.floor3');s=await snapshot();
 check('inspection opens Spirit Vision and spends one reserve',!!effects(s)[BE_SPIRIT_VISION]&&pool(s).reserve===reserve-1);
 check('aura observation, inference and Klee account remain separate',evidence(s,prefix+'auras')?.basis.kind==='observation'&&evidence(s,prefix+'inference')?.basis.kind==='inference'&&evidence(s,prefix+'klee.account')?.basis.kind==='instruction');
 check('Leonard has not received private evidence before the handoff',!evidence(s,prefix+'leonard.brief',leonard)&&!evidence(s,prefix+'auras',leonard));
 const before=await save(),proof=sightProof(s);
 await reload(before);
 check('reload preserves the vision state, evidence, items and clock',sightProof(await snapshot())===proof);
 const download=session.page.waitForEvent('download');
 await session.page.locator('#save_to_file_button').click();
 const file=join(out,'before-handoff-export.txt');await(await download).saveAs(file);
 await session.page.evaluate(()=>localStorage.clear());await reload();
 const imported=session.page.waitForEvent('domcontentloaded');
 await session.page.locator('#saved_file_input').setInputFiles(file);await imported;await ready();
 check('literal import preserves the same evidence and active vision',sightProof(await snapshot())===proof);
 await button('kj3v.poem').click();
 await advance(1);
 const pending=await save(), job=(await snapshot()).expansion.simulation.jobs.find(job=>job.commandId===poem.id);
 check('a pending handoff has not disclosed the brief',job&&!evidence(await snapshot(),prefix+'leonard.brief',leonard));
 await reload(pending);
 check('the pending job survives reload without disclosing early',(await snapshot()).expansion.simulation.jobs.some(row=>row.id===job.id)&&!evidence(await snapshot(),prefix+'leonard.brief',leonard));
 await advance(poem.minutes-1);s=await snapshot();
 const brief=evidence(s,prefix+'leonard.brief',leonard);
 check('Leonard receives the qualified account and takes the lead',brief?.basis.attributedTo==='player'&&actorFacts(s)['book.lotm.kj3v.poem.recited']);
 check('Leonard receives the brief without inheriting the private aura record',!evidence(s,prefix+'auras',leonard));
 await save();await reload();s=await snapshot();
 check('settled reload keeps Leonard’s single handoff and both focus items',evidence(s,prefix+'leonard.brief',leonard)?.at===brief.at&&stock(s,'clothes')===1&&stock(s,'amulet')===1);
 check('no browser errors',session.errors.length===0);
 for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
  const page=session.page;
  await page.setViewportSize({width,height});
  await page.locator('#workspace_navigation select').first().selectOption('customization');
  const font=page.locator('[aria-label="Font size"]');
  await font.fill(String(size));await font.dispatchEvent('change');
  await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await show();
  check(`desktop ${width}x${height} at ${size}px has no page overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:join(out,`settled-${width}-${size}.png`)});
 }
}catch(error){
 await session.page.screenshot({path:join(out,'failure.png')}).catch(()=>{});
 await writeFile(join(out,'failure.txt'),await session.page.locator('body').innerText());
 throw error;
}finally{
 await writeFile(join(out,'result.json'),JSON.stringify({
  bundleHash:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex'),
  fixtureHash:createHash('sha256').update(JSON.stringify(fixture)).digest('hex'),
  checks,errors:session.errors},null,2));
 await session.browser.close();server.close();
}
