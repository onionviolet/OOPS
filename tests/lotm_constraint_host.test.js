import test from 'node:test';
import assert from 'node:assert/strict';
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

fixture.revision='fixture.r2';
// A second actor's needs are deliberately unmet: canon pins apply to everyone.
fixture.bindings.beats.push({...beat,id:'fixture.other.beat',actor:people[1].id,effects:[{fact:'fixture.other.canon',value:2}]});
const oldFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');await whenCastLoaded();globalThis.fetch=oldFetch;
const {bare,hostOver,I}=await import('./lotm_helpers.js');
const {createLotmState,validateLotmState}=await import('../src/book_world_lotm_state.js');
const {planLotmCastBeats,canonActionDecision,persistLotmCastPlan,compactCastLedger,deriveCastLedger,castRevisionReport}=await import('../src/book_world_lotm_cast_host.js');
const {domainRegistry}=await import('../src/domain_registry.js');
const {newBeatState}=await import('../src/beat_records.js');
const {validateBeatLedger}=await import('../src/beat_ledger.js');
const make=()=>{domainRegistry.command('beatLedger','commit')(newBeatState());const o=hostOver(bare());o.host.enroll('be',{independent:true});return o;};
test('all actors keep canon and every cast write has provenance in repeatable runs',()=>{
 const run=()=>{const o=make(),out=planLotmCastBeats(o.box.p.state,undefined,fixture);return {state:o.box.p.state,out};};
 const a=run(),b=run();assert.equal(JSON.stringify(a),JSON.stringify(b));
 assert.equal(a.out.ledger.facts['fixture.canon'],true);assert.equal(a.out.ledger.facts['fixture.other.canon'],2);
 assert.ok(a.out.results.every(r=>r.status==='carried'&&r.provenance==='canon-derived'&&r.diffs.every(d=>d.provenance)));
 assert.ok(a.out.knowledgeWrites.every(w=>w.provenance&&w.effect.basis.provenance));assert.equal(a.out.strain.length,2);
 assert.ok(Object.values(a.state.lotm.castProvenance).every(code=>['canon','canon-derived','emergent'].includes(code)));
});
test('new lives pin revision; missing and older revisions load without changing deltas',()=>{
 assert.equal(createLotmState(0,'book.lead.be@1').packRevision,'fixture.r2');
 const s=make().box.p.state;delete s.lotm.packRevision;validateLotmState(s);assert.equal(s.lotm.packRevision,undefined);
 s.lotm.packRevision='fixture.r1';s.worlds[I.world].facts['fixture.canon']=false;s.lotm.castProvenance['fact:fixture.canon']='fill';
 const before=JSON.stringify(s);validateLotmState(s);assert.equal(castRevisionReport(s,fixture).strain.length,1);assert.equal(JSON.stringify(s),before);
 s.lotm.packRevision={bad:1};assert.throws(()=>validateLotmState(s),/revision/);
});
test('host reservation adapter aggregates costs and effects with native holdings',()=>{
 const s=make().box.p.state,p=structuredClone(fixture);
 p.contracts=[{id:'fixture.rent',actor:people[0].id,window:{from:10,to:20},needs:{type:'resource',key:'money',op:'gte',value:8},reason:'You need this for your rent.'}];
 const d={costs:[{type:'resource',native:true,key:'money',amount:-2}],effects:[{type:'resource',native:true,key:'money',amount:-1}]};
 assert.deepEqual(canonActionDecision(s,d,p,{external:{money:10}}),{allowed:false,reason:'You need this for your rent.'});
 s.lotm.runMode='open';assert.equal(canonActionDecision(s,d,p,{external:{money:10}}).allowed,true);
});
test('compact durable ledger derives canon, retaining differing deltas',()=>{
 const s=make().box.p.state,out=planLotmCastBeats(s,undefined,fixture),saved=compactCastLedger(out.ledger,fixture);
 assert.equal(saved.facts['fixture.canon'],undefined);assert.equal(saved.facts['fixture.other.canon'],undefined);
 assert.equal(deriveCastLedger(saved,fixture).facts['fixture.canon'],true);
 saved.facts['fixture.canon']=false;assert.equal(deriveCastLedger(saved,fixture).facts['fixture.canon'],false);
 validateBeatLedger({schema:1,...saved});
 const o=make(),plan={state:structuredClone(o.box.p.state)};
 persistLotmCastPlan(plan,()=>{});
 assert.equal(plan.nativePatch.beatLedger.facts['fixture.canon'],undefined);
});
test('failed persistence neither commits domain ledger nor publishes reports',()=>{
 const s=make().box.p.state,before=JSON.stringify(domainRegistry.command('beatLedger','state')());let published=0;
 assert.throws(()=>persistLotmCastPlan({state:structuredClone(s)},()=>{throw Error('fixture persistence rejected');},{publish:()=>published++}),/rejected/);
 assert.equal(JSON.stringify(domainRegistry.command('beatLedger','state')()),before);assert.equal(published,0);
});
test('the host consumes conditioned outcomes rather than merely recording a draw',()=>{
 const s=make().box.p.state,p=structuredClone(fixture),b=p.bindings.beats[0];
 b.outcomes=[{effects:[{fact:'fixture.canon',value:false}],weight:999},{effects:b.effects,weight:1}];
 const out=planLotmCastBeats(s,undefined,p);
 assert.equal(out.ledger.facts['fixture.canon'],true);assert.equal(out.strain.find(r=>r.constraint===b.id).probability,.001);
 b.outcomes=[{effects:[...b.effects,{fact:'fixture.extra',value:false}],weight:1}];
 assert.throws(()=>planLotmCastBeats(s,undefined,p),/no model-consistent/);
});
test('180 synthetic canon facts across actors survive two identical null-player replays and compact reload',()=>{
 const s=make().box.p.state,p=structuredClone(fixture);
 p.bindings.beats=Array.from({length:180},(_,i)=>({...beat,id:`fixture.beat.${i}`,actor:people[i%2].id,effects:[{fact:`fixture.fact.${i}`,value:i}]}));
 const run=()=>{const out=planLotmCastBeats(structuredClone(s),undefined,p),stored=compactCastLedger(out.ledger,p),loaded=deriveCastLedger(JSON.parse(JSON.stringify(stored)),p);return {out,stored,loaded};};
 const a=run();assert.equal(JSON.stringify(a),JSON.stringify(run()));
 assert.equal(Object.keys(a.out.ledger.done).length,180);
 for(let i=0;i<180;i++){assert.equal(a.loaded.facts[`fixture.fact.${i}`],i);assert.equal(a.stored.facts[`fixture.fact.${i}`],undefined);}
});
test('canon world facts are protected across actors and explicit world scope',()=>{
 const s=make().box.p.state;
 assert.equal(canonActionDecision(s,{effects:[{type:'fact',scope:'world',key:'fixture.other.canon',value:99}]},fixture).allowed,false);
});
