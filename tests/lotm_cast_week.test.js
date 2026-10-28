import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validateLotmCast,lotmAnchorProbes} from '../src/book_world_lotm_cast.js';
const evidence={label:'I',locator:'authored fixture'};
const place=(id,name,district)=>({id,name,indexId:id,openingHours:[],...evidence,...(district?{travel:{district,basis:'Authored test district.'}}:{})});
const person=(id,name)=>({id,indexId:id,name,tier:'principal',relations:[],knows:[],wants:[],...evidence});
const row=(id,actor,place,from,to)=>({id,actor,place,day:1,until:1,from,to,recurrence:'once',...evidence});
const fixture={schema:'lotm-cast/1',people:[person('fixture.person.arden','Arden Vale'),person('fixture.person.vela','Vela Reed'),person('fixture.person.remote','Tessa Wynn')],references:[],
 places:[place('fixture.place.home','Willow flat','evernight'),place('fixture.place.shop','Copper shop','machinery'),{...place('fixture.place.remote','Distant cabin'),city:'Copperhaven'}],placeAliases:[],clockClaims:[],beats:[],remoteWhereabouts:[{actor:'fixture.person.remote',place:'fixture.place.remote',...evidence}],anchors:[],
 schedule:[row('fixture.row.a','fixture.person.arden','fixture.place.home',0,100),row('fixture.row.b','fixture.person.arden','fixture.place.shop',100,300),row('fixture.row.c','fixture.person.vela','fixture.place.shop',0,300)],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',label:'Begin beside the Willow household',beyonderTrack:false,cash:480,home:null,start:'Tingen probationer lodging',blurb:'A resident near the Willow household.'},situation:{label:'Life beside Willow'}},
 bindings:{days:[{scene:'fixture.scene.1',day:1,from:0,to:300,label:'I',basis:'Authored test day.'}],clocks:[],schedule:[],beats:[]}};
fixture.bindings.schedule=fixture.schedule;
// Install an invented fetch fixture before importing the static native registry.
const actualFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {bare,hostOver,save,registry,wait}=await import('./lotm_helpers.js');
const {castPeople,castTalkCommands,castPlaces,syncLotmCast,isRemoteCastPerson}=await import('../src/book_world_lotm_cast_host.js');
const {loadPrivateCast,whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
await whenCastLoaded();
const {entryAnswers}=await import('../src/book_world_lotm_entry.js');
const {validateLotmState}=await import('../src/book_world_lotm_state.js');
const {validateLotmEnvelope}=await import('../src/book_world_lotm_envelope.js');
const {validateSimulationState}=await import('../src/simulation_contracts.js');
const {LOTM_LOCATIONS:L}=await import('../src/book_world_lotm_ids.js');
globalThis.fetch=actualFetch;
const begin=key=>{const o=hostOver(bare());o.host.enroll(key);return o;};
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const baseline={
 probationer:'7c515d30cf2948ec05ad1b218e183f235c2327836872f9fd89b8a8082789af6f',
 machinery:'951e88f3cbdf16e41beb7f5fe10dff8d703c07ca0585e392c3aec01ba6152f07',
 storm:'2e43563bd021d7fce8ceb2724353e5edf3ba34ff56db3fcd5e136b72b142e6c4',
 civil:'7c515d30cf2948ec05ad1b218e183f235c2327836872f9fd89b8a8082789af6f'};
const entryBaseline={
  "probationer": [
    [
      [
        "Body",
        "An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work."
      ],
      [
        "Memories",
        "Yours carry whole. The clerk's come in fragments: faces, the office routine, the way home."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Nothing physical crosses. The money you held stays behind; the clerk's own purse, 2 pounds, is yours."
      ],
      [
        "Name and papers",
        "The clerk's name, papers and post are yours, and their colleagues expect them at work."
      ],
      [
        "Language",
        "The clerk's Loenese comes with the body."
      ],
      [
        "Who notices",
        "No one, at first. Colleagues see a clerk who seems a little changed."
      ],
      [
        "Your old life",
        "Your Village life stops where you left it. This character has no way back yet, so Export first if you want to keep playing it."
      ],
      [
        "What you owe",
        "The clerk's post: report to Warden Hale and serve a probation under church supervision."
      ]
    ],
    [
      [
        "Body",
        "An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work."
      ],
      [
        "Memories",
        "Yours carry whole. The clerk's come in fragments: faces, the office routine, the way home."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Nothing physical crosses. The money you held stays behind with your Village life; the clerk's own purse, 2 pounds, is yours."
      ],
      [
        "Name and papers",
        "The clerk's name, papers and post are yours, and their colleagues expect them at work."
      ],
      [
        "Language",
        "The clerk's Loenese comes with the body."
      ],
      [
        "Who notices",
        "No one, at first. Colleagues see a clerk who seems a little changed."
      ],
      [
        "Your old life",
        "Your Village life pauses where you left it, money and all. Resume it from Continuing connection; this Tingen life then pauses in turn."
      ],
      [
        "What you owe",
        "The clerk's post: report to Warden Hale and serve a probation under church supervision."
      ]
    ]
  ],
  "machinery": [
    [
      [
        "Body",
        "An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work."
      ],
      [
        "Memories",
        "Yours carry whole. The clerk's come in fragments: faces, the office routine, the way home."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Nothing physical crosses. The money you held stays behind; the clerk's own purse, 2 pounds, is yours."
      ],
      [
        "Name and papers",
        "The clerk's name, papers and post are yours, and their colleagues expect them at work."
      ],
      [
        "Language",
        "The clerk's Loenese comes with the body."
      ],
      [
        "Who notices",
        "No one, at first. Colleagues see a clerk who seems a little changed."
      ],
      [
        "Your old life",
        "Your Village life stops where you left it. This character has no way back yet, so Export first if you want to keep playing it."
      ],
      [
        "What you owe",
        "The clerk's post: report to the Machinery team's records officer and serve a probation under church supervision."
      ]
    ],
    [
      [
        "Body",
        "An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work."
      ],
      [
        "Memories",
        "Yours carry whole. The clerk's come in fragments: faces, the office routine, the way home."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Nothing physical crosses. The money you held stays behind with your Village life; the clerk's own purse, 2 pounds, is yours."
      ],
      [
        "Name and papers",
        "The clerk's name, papers and post are yours, and their colleagues expect them at work."
      ],
      [
        "Language",
        "The clerk's Loenese comes with the body."
      ],
      [
        "Who notices",
        "No one, at first. Colleagues see a clerk who seems a little changed."
      ],
      [
        "Your old life",
        "Your Village life pauses where you left it, money and all. Resume it from Continuing connection; this Tingen life then pauses in turn."
      ],
      [
        "What you owe",
        "The clerk's post: report to the Machinery team's records officer and serve a probation under church supervision."
      ]
    ]
  ],
  "storm": [
    [
      [
        "Body",
        "An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work."
      ],
      [
        "Memories",
        "Yours carry whole. The clerk's come in fragments: faces, the office routine, the way home."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Nothing physical crosses. The money you held stays behind; the clerk's own purse, 2 pounds, is yours."
      ],
      [
        "Name and papers",
        "The clerk's name, papers and post are yours, and their colleagues expect them at work."
      ],
      [
        "Language",
        "The clerk's Loenese comes with the body."
      ],
      [
        "Who notices",
        "No one, at first. Colleagues see a clerk who seems a little changed."
      ],
      [
        "Your old life",
        "Your Village life stops where you left it. This character has no way back yet, so Export first if you want to keep playing it."
      ],
      [
        "What you owe",
        "The clerk's post: report to the Punishers' duty officer and serve a probation under church supervision."
      ]
    ],
    [
      [
        "Body",
        "An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work."
      ],
      [
        "Memories",
        "Yours carry whole. The clerk's come in fragments: faces, the office routine, the way home."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Nothing physical crosses. The money you held stays behind with your Village life; the clerk's own purse, 2 pounds, is yours."
      ],
      [
        "Name and papers",
        "The clerk's name, papers and post are yours, and their colleagues expect them at work."
      ],
      [
        "Language",
        "The clerk's Loenese comes with the body."
      ],
      [
        "Who notices",
        "No one, at first. Colleagues see a clerk who seems a little changed."
      ],
      [
        "Your old life",
        "Your Village life pauses where you left it, money and all. Resume it from Continuing connection; this Tingen life then pauses in turn."
      ],
      [
        "What you owe",
        "The clerk's post: report to the Punishers' duty officer and serve a probation under church supervision."
      ]
    ]
  ],
  "civil": [
    [
      [
        "Body",
        "Your own adult body. You arrive in person."
      ],
      [
        "Memories",
        "Yours, whole. You carry no one else's."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Of 29 pounds funded before you came, papers, clothes and one passage took 24. You hold 5 pounds. The money you held before crossing stays behind."
      ],
      [
        "Name and papers",
        "A bought name on 8-pound papers. The church teams know your old ties."
      ],
      [
        "Language",
        "You speak Loenese well enough to pass as a clerk."
      ],
      [
        "Who notices",
        "The Nighthawk office knows you are new and keeps a close eye on a new clerk."
      ],
      [
        "Your old life",
        "Your Village life stops where you left it. This character has no way back yet, so Export first if you want to keep playing it."
      ],
      [
        "What you owe",
        "No money debt. The Nighthawk office offers a civil post: 3 pounds a week, 5 years, secrecy for life. Later ocean passage needs an official certificate."
      ]
    ],
    [
      [
        "Body",
        "Your own adult body. You arrive in person."
      ],
      [
        "Memories",
        "Yours, whole. You carry no one else's."
      ],
      [
        "Base cheat",
        "Comes with you, unchanged."
      ],
      [
        "Money and items",
        "Of 29 pounds funded before you came, papers, clothes and one passage took 24. You hold 5 pounds. The money you held before crossing stays behind with your Village life."
      ],
      [
        "Name and papers",
        "A bought name on 8-pound papers. The church teams know your old ties."
      ],
      [
        "Language",
        "You speak Loenese well enough to pass as a clerk."
      ],
      [
        "Who notices",
        "The Nighthawk office knows you are new and keeps a close eye on a new clerk."
      ],
      [
        "Your old life",
        "Your Village life pauses where you left it. Resume it from Continuing connection; you travel back in person."
      ],
      [
        "What you owe",
        "No money debt. The Nighthawk office offers a civil post: 3 pounds a week, 5 years, secrecy for life. Later ocean passage needs an official certificate."
      ]
    ]
  ]
};
test('original profiles retain byte-identical entry answers, people and complete action/move lists',()=>{
 for(const key of Object.keys(baseline)){
  const {host,box}=begin(key),views=[];
  for(const place of Object.values(L)){box.p.state.simulation.people.player.location=place;views.push(host.view().actions);assert.deepEqual(host.view().moves.map(m=>m.id),Object.entries(L).filter(([,to])=>to!==place).map(([key])=>'lotm.move.'+key));}
  assert.equal(hash(views),baseline[key],key+' actions');
  assert.equal(hash(Object.keys(box.p.state.simulation.people).sort()),'523afc8618c9d3b180c45beef4ff61961c139be14b259f006c4f6991a36509ff');
  assert.equal(JSON.stringify([entryAnswers(key),entryAnswers(key,{returnable:true})]),JSON.stringify(entryBaseline[key]));
 }
});
test('fresh Village life walks to two distinct cast places at two times, talks and refuses away',()=>{
 const {host,box}=begin('beside');
 assert.equal(host.view().profile,'beside');assert.equal(castPeople.length,3);assert.equal(castPlaces.length,2);
 assert.equal(host.view().moves.length,5,'remote places cannot be walked to');
 host.move('lotm.move.fixture.place.home');validateLotmState(box.p.state);validateLotmEnvelope(save(box.p));assert.equal(box.p.state.simulation.jobs[0].due-box.p.state.clock,2);
 box.p=wait(box.p,2);host.tick();
 const first=castTalkCommands[0].id,other=castTalkCommands[1].id;
 assert.equal(host.view().actions.find(a=>a.id===first).eligible,true);host.act(first);
 assert.match(box.p.state.simulation.knowledge.player['book.lotm.cast.met.fixture.person.arden'].value,/Arden Vale/);
 assert.equal(host.view().actions.find(a=>a.id===other).eligible,false);assert.throws(()=>host.act(other),/Away;/);
 host.move('lotm.move.fixture.place.shop');assert.equal(box.p.state.simulation.jobs[0].due-box.p.state.clock,25);
 box.p=wait(box.p,25);host.tick();assert.equal(box.p.state.clock,27);
 assert.equal(host.view().actions.find(a=>a.id===other).eligible,true);host.act(other);
 validateLotmEnvelope(save(box.p));validateSimulationState(box.p.state.simulation,box.p.state,registry.simulation);
 const before=JSON.stringify(box.p.state);host.view();assert.equal(JSON.stringify(box.p.state),before);
 box.p=wait(box.p,100);host.tick();assert.equal(box.p.state.simulation.people['fixture.person.arden'].location,'fixture.place.shop');
 const restored=JSON.parse(JSON.stringify(save(box.p)));syncLotmCast(restored.expansion);validateLotmEnvelope(restored);
 assert.deepEqual(restored.expansion.simulation.people,box.p.state.simulation.people);
 const answers=entryAnswers('beside').map(r=>r.join(' ')).join(' ');assert.match(answers,/No church probation or reporting duty/);assert.match(answers,/stays behind/);
});
test('private loader skips absent or rejected packs and validator rejects broken references',async()=>{
 assert.deepEqual(validateLotmCast(fixture),[]);assert.deepEqual(lotmAnchorProbes(fixture),[]);
 assert.equal(await loadPrivateCast('lotm',validateLotmCast,async()=>({ok:false,status:404})),null);
 assert.equal(await loadPrivateCast('lotm',validateLotmCast,async()=>({ok:true,json:async()=>({schema:1,supplements:[]})})),null);
 const bad=structuredClone(fixture);bad.schedule[0].actor='missing';assert.ok(validateLotmCast(bad).length);
});

test('pack-absent reader hides new entry but retains invented bodies, a role and an active saved walk',async()=>{
 const {execFileSync}=await import('node:child_process');
 const {host,box}=begin('beside');host.move('lotm.move.fixture.place.home');
 // Invented opaque IDs exercise the private namespace, including non-person roles.
 let bytes=JSON.stringify(save(box.p));
 for(const [from,to] of [['fixture.person.arden','lotm.person.cast-aaaaaaaaaaaaaaaaaaaa'],['fixture.person.vela','lotm.role.synthetic-resident'],['fixture.person.remote','lotm.person.cast-cccccccccccccccccccc'],['fixture.place.home','lotm.place.cast-bbbbbbbbbbbbbbbbbbbb']])bytes=bytes.replaceAll(from,to);
 const script=`import fs from 'node:fs';
 import {bare,hostOver,registry} from './tests/lotm_helpers.js';
 import {createHash} from 'node:crypto';
 import {LOTM_LOCATIONS as L} from './src/book_world_lotm_ids.js';
 import {entryAnswers} from './src/book_world_lotm_entry.js';
 import {restoreUnavailableCast} from './src/book_world_lotm_cast_host.js';
 import {validateLotmEnvelope} from './src/book_world_lotm_envelope.js';
 import {validateLotmState} from './src/book_world_lotm_state.js';
 import {validateSimulationState} from './src/simulation_contracts.js';
 import assert from 'node:assert/strict';
 const host=hostOver(bare()).host;assert.equal(host.view().profiles.length,4);assert.throws(()=>host.enroll('beside'),/available/);
 const expected=${JSON.stringify({baseline,entryBaseline,panels:Object.fromEntries(Object.keys(baseline).map(key=>{const o=begin(key);return [key,hash(Object.values(L).map(place=>{o.box.p.state.simulation.people.player.location=place;return o.host.view();}))];}))})};
 for(const key of Object.keys(expected.baseline)){
  const o=hostOver(bare());o.host.enroll(key);const views=[];
  for(const place of Object.values(L)){o.box.p.state.simulation.people.player.location=place;views.push(o.host.view().actions);
   assert.deepEqual(o.host.view().moves.map(m=>m.id),Object.entries(L).filter(([,to])=>to!==place).map(([key])=>'lotm.move.'+key));}
  assert.equal(createHash('sha256').update(JSON.stringify(views)).digest('hex'),expected.baseline[key]);
  assert.equal(JSON.stringify([entryAnswers(key),entryAnswers(key,{returnable:true})]),JSON.stringify(expected.entryBaseline[key]));
  const panels=Object.values(L).map(place=>{o.box.p.state.simulation.people.player.location=place;return o.host.view();});
  assert.equal(createHash('sha256').update(JSON.stringify(panels)).digest('hex'),expected.panels[key],key+' complete view bytes');
 }
 const saved=JSON.parse(fs.readFileSync(0,'utf8'));restoreUnavailableCast(saved.expansion,registry);
 validateLotmEnvelope(saved);validateLotmState(saved.expansion);validateSimulationState(saved.expansion.simulation,saved.expansion,registry.simulation);
 assert.ok(registry.simulation.people.has('lotm.role.synthetic-resident'));
 const play=hostOver({state:saved.expansion,gameplay:{player:{inventory:{},skills:{},reputation:{}}},external:{money:480}});
 assert.ok(play.host.view().actions.some(a=>a.id==='book.lotm.cast_unavailable'&&!a.eligible));`;
 execFileSync(process.execPath,['--input-type=module','-e',script],{input:bytes,stdio:['pipe','pipe','pipe']});
});

test('remote principals have no local talk or away disclosure; known ones get one Elsewhere row',()=>{
 const {host,box}=begin('beside');
 assert.ok(!castTalkCommands.some(d=>d.targetId==='fixture.person.remote'));
 assert.deepEqual(host.view().elsewhere,[]);
 assert.ok(!JSON.stringify(host.view().actions).includes('Distant cabin'));
 box.p.state.simulation.knowledge.player['book.lotm.cast.known.fixture.person.remote']={stage:'seen',value:'A distant acquaintance.',at:0};
 assert.deepEqual(host.view().elsewhere,[{id:'fixture.person.remote',label:'Tessa Wynn lives in Copperhaven'}]);
 assert.ok(!host.view().actions.some(d=>d.id.endsWith('cast_talk_remote')));
});
test('beside clock exposes relative day and band without inventing a civil month',()=>{
 const {host,box}=begin('beside');box.p.state.clock=1440+8*60;
 assert.equal(host.view().localClock,'Day 2, morning');
});
test('cast boot path stays synchronous even when private fetch never resolves',async()=>{
 const {transform}=await import('esbuild');
 const {readFile}=await import('node:fs/promises');
 for(const file of ['cast','cast_days','cast_host','content','districts','domain','entry','envelope','host','lives','state']){
  const source=await readFile(new URL(`../src/book_world_lotm_${file}.js`,import.meta.url),'utf8');
  // esbuild rejects top-level await for a synchronous target, including nested blocks.
  await transform(source,{target:'es2020',format:'esm'});
 }
 const {execFileSync}=await import('node:child_process');
 execFileSync(process.execPath,['--input-type=module','-e',`
 globalThis.fetch=()=>new Promise(()=>{});
 const {castAvailable}=await import('./src/book_world_lotm_cast_host.js');
 const {bare,hostOver}=await import('./tests/lotm_helpers.js');
 if(castAvailable||hostOver(bare()).host.view().profiles.some(p=>p.key==='beside'))throw Error('Early cast entry');
 `],{timeout:10000});
});

test('a pack resolving after registry construction enables validated native enrollment and travel',async()=>{
 const {execFileSync}=await import('node:child_process');
 execFileSync(process.execPath,['--input-type=module','-e',`
 import fs from 'node:fs';import assert from 'node:assert/strict';
 const fixture=JSON.parse(fs.readFileSync(0,'utf8'));let release;
 globalThis.fetch=path=>path.endsWith('manifest.json')?new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>({schema:1,supplements:['lotm-cast/cast.json']})});}):Promise.resolve({ok:true,json:async()=>fixture});
 const {bare,hostOver,registry}=await import('./tests/lotm_helpers.js');
 const {whenCastLoaded}=await import('./src/book_world_lotm_cast_days.js');
 const {validateLotmEnvelope}=await import('./src/book_world_lotm_envelope.js');
 const {save}=await import('./tests/lotm_helpers.js');
 const {host,box}=hostOver(bare());assert.equal(host.view().profiles.length,4);
 release();await whenCastLoaded();assert.equal(host.view().profiles.length,5);
 host.enroll('beside');host.move('lotm.move.fixture.place.home');validateLotmEnvelope(save(box.p));
 assert.ok(registry.simulation.people.has('fixture.person.arden'));
 `],{input:JSON.stringify(fixture),timeout:10000,stdio:['pipe','pipe','pipe']});
});

test('a principal whose every schedule place is outside walkable Tingen counts as remote; an unplaced one does not',()=>{
 const pack={remoteWhereabouts:[],places:[place('p.near','Near room','evernight'),place('p.far','Far room')],
  schedule:[row('r.1','a.far','p.far',0,60),row('r.2','a.mixed','p.far',0,60),row('r.3','a.mixed','p.near',60,120)]};
 assert.equal(isRemoteCastPerson(pack,'a.far'),true);
 assert.equal(isRemoteCastPerson(pack,'a.mixed'),false);
 assert.equal(isRemoteCastPerson(pack,'a.unplaced'),false);
});
