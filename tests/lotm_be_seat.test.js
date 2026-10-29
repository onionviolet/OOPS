import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {validateKnowledgeBasis} from '../src/causal_situations.js';

const evidence={label:'I',locator:'fixture p1'};
const people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
const schedule=[{id:'fixture.slot',actor:people[0].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],knows:[{key:'fixture.lesson',value:'A lesson.',audience:'actor'}],...evidence};
const fixture={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
 places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence},{id:'fixture.place.next',indexId:'fixture.place.next',name:'Next',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
 bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},leadLife:{
 actorId:'fixture.person.lead',profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other','fixture.place.next'],history:[{id:'school',value:'A remembered school.',date:'before start',locator:'fixture p1'}],
 relations:[{person:'fixture.person.relative',kind:'relative',date:'before start',locator:'fixture p2'}],
 intentions:[{id:'visit',label:'the day of your visit',offset:200,knowledge:'book.lotm.history.school'}],
 untakenChoices:[{id:'fixture.choice',scene:'fixture.scene',label:'An untaken option',status:'untaken',locator:'fixture p3'}]}};
const savedFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {leadLifeEntryEffects,validLeadLife}=await import('../src/book_world_lotm_lives.js');
const {syncLotmCast,castAvailable,planLotmCastBeats,canonActionDecision}=await import('../src/book_world_lotm_cast_host.js');
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
const {LOTM_IDS}=await import('../src/book_world_lotm_ids.js');
await whenCastLoaded();globalThis.fetch=savedFetch;
const {bare,hostOver,registry}=await import('./lotm_helpers.js');
const {validateLotmState}=await import('../src/book_world_lotm_state.js');
const {validateSimulationState}=await import('../src/simulation_contracts.js');
const {applyBeatKnowledge}=await import('../src/beat_knowledge.js');
const {applySimulationEffects}=await import('../src/simulation_effects.js');
const {createFreshLifeStart}=await import('../src/fresh_life_start.js');
const {freshNativeSave}=await import('../src/import_probe.js');

test('opening history projects into one knowledge owner with dates and provenance',()=>{
 const effects=leadLifeEntryEffects(fixture);
 assert.equal(effects.length,2);
 assert.ok(effects.every(e=>e.actor==='player'&&e.basis.date==='before start'));
 assert.equal(effects[0].basis.locator,'fixture p1');
 assert.equal(effects[1].key,'book.lotm.cast.known.fixture.person.relative');
 for(const e of effects)validateKnowledgeBasis(e.basis);
 assert.equal(JSON.stringify(effects),JSON.stringify(leadLifeEntryEffects(structuredClone(fixture))));
 assert.deepEqual(leadLifeEntryEffects(null),[]);
});

test('opening history refuses a missing actor or unattributed record',()=>{
 assert.equal(validLeadLife(fixture),true);
 const missing=structuredClone(fixture);missing.leadLife.actorId='fixture.person.missing';
 assert.equal(validLeadLife(missing),false);
 assert.throws(()=>leadLifeEntryEffects(missing),/person and opening records/);
 const unknown=structuredClone(fixture);unknown.leadLife.profile.id='fixture.unknown';assert.equal(validLeadLife(unknown),false);
 const undated=structuredClone(fixture);delete undated.leadLife.history[0].locator;
 assert.throws(()=>leadLifeEntryEffects(undated),/date and source/);
});

test('the pack-selected person is not moved by the NPC schedule in a be seat',()=>{
 assert.equal(castAvailable,true);
 const state={clock:0,lotm:{initializedAt:0,entryProfile:'book.lead.be@1'},
  simulation:{people:{player:{location:'fixture.place.player'},'fixture.person.lead':{location:'fixture.place.player'}}},
  worlds:{[LOTM_IDS.world]:{facts:{}}}};
 syncLotmCast(state);
 assert.equal(state.simulation.people.player.location,'fixture.place.player');
 assert.equal(state.simulation.people['fixture.person.lead'].location,'fixture.place.player');
 const again=structuredClone(state);syncLotmCast(state);syncLotmCast(again);
 assert.equal(JSON.stringify(state),JSON.stringify(again));
});

test('independent be enrollment uses one player body and a canon run',()=>{
 const make=()=>{const o=hostOver(bare());o.host.enroll('be',{independent:true});return o;};
 const o=make(),s=o.box.p.state;
 assert.equal(s.lotm.runMode,'canon');assert.equal(s.lotm.entry,undefined);
 assert.equal(s.simulation.people['fixture.person.lead'],undefined);
 assert.equal(s.simulation.people.player.location,'fixture.place.other');
 assert.equal(s.simulation.knowledge.player['book.lotm.history.school'].basis.date,'before start');
 assert.ok(s.simulation.knowledge.player['book.lotm.cast.known.fixture.person.relative']);
 assert.equal(s.simulation.people[LOTM_IDS.supervisor],undefined);
 validateLotmState(s);validateSimulationState(s.simulation,s,registry.simulation);
 assert.equal(JSON.stringify(s),JSON.stringify(make().box.p.state));
 const bad=structuredClone(s);bad.lotm.runMode='open';assert.throws(()=>validateLotmState(bad),/Preserve this save/);
 const view=o.host.view();assert.equal(view.runMode,'canon');assert.ok(!Object.hasOwn(view,'pausedLife'));
 assert.ok(view.waits.some(w=>w.at===s.lotm.initializedAt+200));
 assert.ok(view.actions.some(a=>a.label==='An untaken option'&&!a.eligible&&a.reasons.includes('Not how it happened')));
 assert.ok(!Object.hasOwn(view,'bench')&&!Object.hasOwn(view,'district')&&!Object.hasOwn(view,'axes'));
 assert.throws(()=>hostOver(bare()).host.enroll('be'),/fresh independent/);
});

test('canon beat and actor knowledge resolve identically without player input',()=>{
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 const s=o.box.p.state,first=planLotmCastBeats(s,undefined,fixture),second=planLotmCastBeats(structuredClone(s),undefined,fixture);
 assert.equal(JSON.stringify(first),JSON.stringify(second));
 assert.equal(first.ledger.done['fixture.beat'].status,'carried');
 assert.equal(first.ledger.facts['fixture.canon'],true);
 assert.ok(first.knowledgeWrites.some(w=>w.effect.actor==='player'&&w.effect.key==='fixture.lesson'));
 assert.deepEqual(canonActionDecision(s,{effects:[{type:'fact',key:'fixture.canon',value:false}]},fixture),{allowed:false,reason:'Not how it happened'});
 assert.equal(canonActionDecision(s,{effects:[{type:'fact',key:'fixture.free',value:false}]},fixture).allowed,true);
 const advance=()=>{const state=structuredClone(s);state.clock+=90;const plan={state};const out=planLotmCastBeats(state,undefined,fixture);
  applyBeatKnowledge(plan,out.knowledgeWrites,(p,e,cause)=>applySimulationEffects(p,e,{actorId:'player'},registry,cause));return {state,ledger:out.ledger};};
 assert.equal(JSON.stringify(advance()),JSON.stringify(advance()));
});

test('the same free walk records emergent provenance and yields identical state',()=>{
 const run=()=>{const o=hostOver(bare());o.host.enroll('be',{independent:true});o.host.move('lotm.move.fixture.place.next');return o.box.p.state;};
 const a=run(),b=run();
 assert.equal(a.simulation.people.player.location,'fixture.place.next');
 assert.ok(Object.values(a.simulation.knowledge.player).some(k=>k.basis?.provenance==='emergent'));
 assert.equal(JSON.stringify(a),JSON.stringify(b));
});

test('without the pack a saved be host refuses its actions',()=>{
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 let data=JSON.stringify(o.box.p);
 for(const [from,to] of [['fixture.person.lead','lotm.person.cast-aaaaaaaaaaaaaaaaaaaa'],['fixture.person.relative','lotm.person.cast-bbbbbbbbbbbbbbbbbbbb'],['fixture.place.other','lotm.place.cast-cccccccccccccccccccc'],['fixture.place.next','lotm.place.cast-dddddddddddddddddddd']])data=data.replaceAll(from,to);
 const script=`import assert from 'node:assert/strict';
 import fs from 'node:fs';globalThis.fetch=async()=>({ok:false});
 const {bare,hostOver,registry}=await import('./tests/lotm_helpers.js');
 const {whenCastLoaded}=await import('./src/book_world_lotm_cast_days.js');await whenCastLoaded();
 const {restoreUnavailableCast}=await import('./src/book_world_lotm_cast_host.js');
 const {validateLotmState}=await import('./src/book_world_lotm_state.js');
 assert.ok(!hostOver(bare()).host.view().profiles.some(p=>p.key==='be'));
 const p=JSON.parse(fs.readFileSync(0,'utf8'));restoreUnavailableCast(p.state,registry);validateLotmState(p.state);
 const h=hostOver(p).host;assert.ok(h.view().actions.some(a=>a.id==='book.lotm.cast_unavailable'));
 assert.throws(()=>h.move('lotm.move.lotm.place.cast-dddddddddddddddddddd'),/private pack absent/);`;
 const run=spawnSync(process.execPath,['--input-type=module','-e',script],{input:data,encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
});

test('only the dedicated be probe can capture the be enrollment',()=>{
 const ordinary={token:'token',freshProbe:false,beRequested:true};
 const wrong={token:'token',freshProbe:true,beRequested:false};
 const allowed={token:'token',freshProbe:true,beRequested:true};
 const plan={state:{lotm:{entryProfile:'book.lead.be@1',runMode:'canon'}}};
 const unrelated={state:{lotm:{entryProfile:'fixture.other',runMode:'canon'}}};
 const original={setEnvelope(){throw Error('ordinary storage must not be used');}};
 assert.equal(createFreshLifeStart(ordinary).canCapture(plan),false);
 assert.equal(createFreshLifeStart(wrong).canCapture(plan),false);
 const start=createFreshLifeStart(allowed);
 assert.equal(start.canCapture(plan),false);assert.equal(start.canCapture(unrelated),false);
 assert.equal(start.storage(original,unrelated),original);
 assert.equal(start.storage(original,plan),original);
});

test('the dedicated probe returns its captured envelope or the actual refusal',async()=>{
 const plan={state:{lotm:{entryProfile:'book.lead.be@1',runMode:'canon'}}},envelope={expansion:plan.state};
 let done,probe;const result=()=>new Promise(resolve=>{done=resolve;});
 const ports={token:'probe',freshProbe:true,beRequested:true,post:value=>done(value),enrollBe:()=>{assert.equal(probe.canCapture(plan),true);assert.equal(probe.canCapture({state:{lotm:{entryProfile:'fixture.other'}}}),false);probe.storage({},plan).setEnvelope('unused',envelope);}};
 probe=createFreshLifeStart(ports);let pending=result();probe.postFreshProbe();
 assert.deepEqual(JSON.parse((await pending).serialized),envelope);
 ports.enrollBe=()=>{throw Error('Fixture refusal');};probe=createFreshLifeStart(ports);pending=result();probe.postFreshProbe();
 assert.equal((await pending).error,'Fixture refusal');
 assert.equal(probe.canCapture(plan),false);
});

test('fresh life publishes only after preflight and reports preparation failure',async()=>{
 const events=[],next={expansion:{lotm:{entryProfile:'book.lead.be@1',runMode:'canon'}}};
 const ports={token:null,freshProbe:false,beRequested:false,canWrite:()=>true,busy:()=>false,
  freeze:()=>{events.push('freeze');return 'release';},thaw:()=>events.push('thaw'),revision:()=>1,
  fresh:async()=>JSON.stringify(next),preflight:async()=>events.push('preflight'),publish:()=>events.push('publish'),
  blockOldRuntime:()=>events.push('block'),reload:()=>events.push('reload')};
 await createFreshLifeStart(ports).start(true);
 assert.deepEqual(events,['freeze','preflight','publish','block','reload','thaw']);
 events.length=0;ports.fresh=async()=>{throw Error('Fixture failed. Your current save is kept.');};
 await assert.rejects(createFreshLifeStart(ports).start(true),/Fixture failed.*current save is kept/);
 assert.deepEqual(events,['freeze','thaw']);
});

test('a detached probe refusal reaches the caller with the save-preserved reason',async()=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document;let listener,frame;
 try{
  globalThis.window={location:{href:'https://fixture.test/',origin:'https://fixture.test'},addEventListener:(_type,fn)=>{listener=fn;},removeEventListener:()=>{}};
  globalThis.document={createElement:()=>frame={contentWindow:{},remove(){}},body:{append(){}}};
  const pending=freshNativeSave({be:true}),token=new URL(frame.src).searchParams.get('import_probe');
  listener({origin:'https://fixture.test',source:frame.contentWindow,data:{token,type:'save-fresh-result',error:'Fixture refusal'}});
  await assert.rejects(pending,/Fixture refusal.*current save is kept/);
 }finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
});
