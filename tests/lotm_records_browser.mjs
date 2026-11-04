// R6 sealed-records browser proof: synthetic cast fixture (the real private pack's 5 MB load races the import probe), fresh origin, 1920x1080.
// The pack ids below are the real pack's armory place and Old Neil's index id, so the production binding resolves as it does in play.
// BUILD_OUT=.lane-builds/r6 npm run build && node tests/lotm_records_browser.mjs <BUILD_OUT> <outDir>
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve,Session} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS as F} from './helpers/conversation_knowledge_fixture.mjs';
const [build,out]=process.argv.slice(2).map(p=>resolve(p));
await mkdir(out,{recursive:true});
const ARMORY='lotm.place.cast-a815f2c711b207abf093',NEIL='lotm.person.cast-6aaa65265bb46e581535',NOTE='book.lotm.kj3ad.dunn.note.shown.neil',N='lotm.records.chanis-stack.';
const pack=conversationKnowledgeFixture(),ev={label:'I',locator:'synthetic records fixture'};
pack.places.push({id:ARMORY,indexId:ARMORY,name:'Armory anteroom',openingHours:[],travel:{district:'evernight',basis:'fixture'},...ev});
pack.people.push({id:NEIL,indexId:'lotm.person.old-neil',name:'Old Neil',tier:'principal',relations:[],knows:[],wants:[],...ev});
const slot={id:'fixture.slot.neil',actor:NEIL,place:ARMORY,day:1,until:1,from:0,to:1400,recurrence:'once',...ev};
pack.schedule.push(slot);
pack.leadLife.profile.start=ARMORY;pack.leadLife.knownPlaces.push(ARMORY);pack.leadLife.relations.push({person:NEIL,kind:'colleague',date:'before start',locator:ev.locator});
pack.householdActs={acts:[{id:'book.lotm.fixture.note',label:'Show Dunn\'s note to Old Neil',description:'Show Old Neil the note Dunn signed.',report:'Old Neil reads the note and nods.',knowledgeKey:'book.lotm.fixture.note.seen',place:ARMORY,minutes:1,operation:'use',
 effects:[{type:'fact',scope:'actor',actor:'player',key:NOTE,value:true}]}]};
const server=await serve(join(build,'dist'));
const checks=[],ok=(l,v)=>{assert.ok(v,l);checks.push(l);console.log('PASS '+l);};
const session=await new Session({url:server.url,seed:37,wall:Date.UTC(2026,10,4,15),opTimeout:15000,hooks:{beforeOpen:async context=>{
 await context.route('**/private_packs/**',route=>{const p=new URL(route.request().url()).pathname;
  const data=p.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:p.endsWith('/lotm-cast/cast.json')?pack:null;
  return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});});}}}).start();
const p=()=>session.page,snap=()=>p().evaluate(()=>window.simulationTestHooks.snapshot());
const openAll=()=>p().evaluate(()=>{for(const n of document.querySelectorAll('#lotm_panel details'))n.open=true;});
const step=async n=>{await session.step(n);await p().evaluate(()=>window.advanceTicks(0,{render:true}));await openAll();};
const play=async()=>{await p().waitForFunction(()=>!!window.simulationTestHooks);await p().evaluate(()=>window.simulationTestHooks.pause());let stable=0;const end=Date.now()+45000;
 while(Date.now()<end){const b=p().locator('#loading_screen_play_button');if(await b.isVisible())await b.click();const c=p().locator('#hero_creation_panel_confirmation');if(await c.isVisible())await c.click();
  const hidden=await p().evaluate(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');stable=hidden?stable+1:0;if(stable>=3)return;await p().waitForTimeout(100);}throw Error('Loading screen never became ready.');};
const show=async()=>{await p().getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await openAll();};
const rows=()=>p().locator('[data-lotm-record-row]').evaluateAll(n=>Object.fromEntries(n.map(x=>[x.dataset.lotmRecordRow,x.dataset.status])));
const btn=id=>p().locator(`[data-lotm="${id}"]`).first();
try{
 await session.open();
 await p().evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();
 ok('no records block without the note',(await rows().catch(()=>({})))[N+'seer-line']===undefined||(await rows())[N+'fetch']!==undefined);
 // Earn the note (one click, synthetic), then the production binding takes over.
 await btn('book.lotm.fixture.note').click();await step(2);
 let r=await rows();ok('armory shows the sealed-records block with Old Neil bound',Object.keys(r).length===9);
 ok('pages need the stack before fetch',r[N+'seer-line']==='needs-stack');
 await p().screenshot({path:join(out,'before-fetch-1920.png')});
 await btn(N+'fetch').click();await step(12);r=await rows();
 ok('fetch brings the stack: Seer page ready',r[N+'seer-line']==='ready');
 ok('Sequence 6 page is withheld',r[N+'beyond-seven']==='withheld');
 const text=await p().locator('#lotm_panel').innerText();
 ok('withheld page states the clearance reason',/open to you on Dunn's note|Sequence 7/.test(text)&&/Sequence 6|armory papers/i.test(text));
 await p().screenshot({path:join(out,'after-fetch-1920.png')});await p().locator('[data-lotm-sealed-records]').screenshot({path:join(out,'records-block.png')});
 const t0=(await snap()).expansion.clock;
 await btn(N+'seer-line').click();await step(25);r=await rows();
 ok('Seer page read once and stays read',r[N+'seer-line']==='read');
 ok('withheld page still withheld, no time charged to it',r['lotm.records.chanis-stack.beyond-seven']==='withheld'&&(await snap()).expansion.clock-t0>=20);
 ok('refused page cannot be started',await btn(N+'beyond-seven').isDisabled());
 await p().screenshot({path:join(out,'read-1920.png')});
 await p().locator('#save_button').click();
 const digest=s=>JSON.stringify({f:s.expansion.actors.player.facts,k:Object.keys(s.expansion.simulation.knowledge.player||{}).filter(k=>k.includes('records'))});
 const before=digest(await snap());
 ok('read fact and knowledge recorded',before.includes('lotm.records.read.seer-line')&&before.includes('lotm.records.seer-line'));
 await p().reload();await play();await show();
 ok('reload retains read pages',digest(await snap())===before&&(await rows())[N+'seer-line']==='read');
 const dl=p().waitForEvent('download');await p().locator('#save_to_file_button').click();const file=join(out,'records-export.txt');await(await dl).saveAs(file);
 await p().evaluate(()=>localStorage.clear());await p().reload();await play();
 await p().locator('#saved_file_input').setInputFiles(file);await p().waitForTimeout(1500);await play();await show();await play();
 ok('import retains read pages',digest(await snap())===before);
 await show();ok('imported panel shows the page read',(await rows())[N+'seer-line']==='read');
 await p().screenshot({path:join(out,'after-import-1920.png')});
 ok('no browser errors',session.errors.length===0);
}catch(e){console.log(JSON.stringify(session.errors,null,1).slice(0,1500));await p().screenshot({path:join(out,'failure-1920.png')}).catch(()=>{});await writeFile(join(out,'failure.txt'),await p().locator('body').innerText().catch(()=>''));throw e;}
finally{
 const hash=createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex');
 await writeFile(join(out,'result.json'),JSON.stringify({route:'synthetic cast fixture with the real armory/Old Neil ids; one-click note; UI fetch, read, refusal, save, reload, Export, Import',viewport:'1920x1080',bundleHash:hash,checks,errors:session.errors},null,2));
 await session.browser.close();server.close();
}
