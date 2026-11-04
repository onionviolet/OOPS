import test from 'node:test';
import assert from 'node:assert/strict';

const evidence={label:'I',locator:'fixture p1'};
const people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
const schedule=[{id:'fixture.slot',actor:people[0].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],knows:[{key:'fixture.lesson',value:'A lesson.',audience:'actor'}],...evidence};
const fixture={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[{id:'fixture.alias.room',indexId:'lotm.place.klein-room',place:'fixture.place.other',label:'I',locator:'fixture p1'}],clockClaims:[],beats:[beat],anchors:[],schedule,
 places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence},{id:'fixture.place.next',indexId:'fixture.place.next',name:'Next',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
 bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},leadLife:{
 actorId:'fixture.person.lead',profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other','fixture.place.next'],history:[{id:'school',value:'A remembered school.',date:'before start',locator:'fixture p1'}],
 relations:[{person:'fixture.person.relative',kind:'relative',date:'before start',locator:'fixture p2'}],
 intentions:[{id:'visit',label:'the day of your visit',offset:200,knowledge:'book.lotm.history.school'}],
 untakenChoices:[{id:'fixture.choice',scene:'fixture.scene',label:'An untaken option',status:'untaken',locator:'fixture p3'}]}};
const savedFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {validLeadLife}=await import('../src/book_world_lotm_lives.js');
const {castAvailable,castActCommands}=await import('../src/book_world_lotm_cast_host.js');
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
const {LOTM_IDS}=await import('../src/book_world_lotm_ids.js');
await whenCastLoaded();globalThis.fetch=savedFetch;
const {bare,hostOver,registry,wait}=await import('./lotm_helpers.js');
const {validateLotmState}=await import('../src/book_world_lotm_state.js');
const {validateSimulationState}=await import('../src/simulation_contracts.js');
await import('../src/book_world_lotm_domain.js');
const {harmState}=await import('../src/harm_state.js');
const {LOTM_ACT_KEYS:K}=await import('../src/lotm_act_bindings.js');
const {lotmActFacts}=await import('../src/book_world_lotm_acts_host.js');
const CALL='lotm.rite.spirit-call',STEPS=['set-candle-north','set-candle-east','set-candle-south','set-candle-west','altar','petition','answer'];
const setup=(stock={})=>{const o=hostOver(bare());o.host.enroll('be',{independent:true});Object.assign(o.box.p.gameplay.player.inventory,stock);return o;};
const KIT={[K.candle]:4,[K.fragrance]:1};
const offers=o=>o.host.view().altarRites||[];
const step=(o,id)=>o.host.act(`${CALL}.${id}`);
// A step is a timed job: it lands when its minutes have passed.
const finish=(o,id)=>{step(o,id);o.box.p=wait(o.box.p,registry.simulation.commands.get(`${CALL}.${id}`).duration);return o;};
const inv=o=>o.box.p.gameplay.player.inventory;
const facts=o=>o.box.p.state.actors.player.facts;
const power=()=>harmState().backlash?.power??0;

test('R5: the rite rows are compiled into the be host and offered only where and when they can run',()=>{
 assert.equal(castAvailable,true);
 assert.ok(castActCommands.some(c=>c.id===`${CALL}.answer`),'spirit call is installed');
 const o=setup(KIT);
 assert.ok(registry.simulation.commands.has(`${CALL}.answer`),'registered for play, not only for tests');
 const list=offers(o).filter(a=>a.rowId===CALL);
 assert.deepEqual(list.map(a=>a.step),['set-candle-north','set-candle-east','set-candle-south','set-candle-west','altar','petition','answer']);
 assert.deepEqual(list.map(a=>a.status),['next','later','later','later','later','later','later']);
 assert.equal(list[0].eligible,true);assert.equal(list[1].eligible,false,'only the next step is live');
 assert.match(list[0].layout.stations.map(x=>x.label).join(';'),/north corner.*east corner.*south corner.*west corner/);
});

test('R5: a ritual with a missing candle cannot be completed and nothing is charged for the attempt',()=>{
 const o=setup({[K.candle]:3,[K.fragrance]:1});
 const first=offers(o).find(a=>a.id===`${CALL}.set-candle-north`);
 assert.equal(first.eligible,false,'means need four candles to begin');
 assert.throws(()=>step(o,'set-candle-north'));
 // Begun with four, then one is lost before the fourth is set: the fourth corner and everything after stay shut.
 const p=setup(KIT);for(const id of STEPS.slice(0,3))finish(p,id);
 inv(p)[K.candle]=0;
 assert.throws(()=>step(p,'set-candle-west'));
 assert.throws(()=>step(p,'altar'));
 assert.equal(facts(p)[`lotm.act.${CALL}.done`],undefined,'never reads as success');
 assert.equal(power(),0);
});

test('R5: steps run in order, a step cannot be skipped or repeated mid-run, and a paused run resumes with its state intact',()=>{
 const o=setup(KIT);
 assert.throws(()=>step(o,'altar'));assert.throws(()=>step(o,'set-candle-east'));
 finish(o,'set-candle-north');
 assert.equal(inv(o)[K.candle],3,'one candle spent');
 assert.throws(()=>step(o,'set-candle-north'),'no restart mid-run');
 // Pause: walk away for an hour; nothing is lost.
 o.box.p=wait(o.box.p,60);
 const mid=offers(o).filter(a=>a.rowId===CALL);
 assert.equal(mid[0].status,'done');assert.equal(mid[1].status,'next');assert.equal(mid[1].eligible,true);
 for(const id of STEPS.slice(1,4))finish(o,id);
 assert.equal(inv(o)[K.candle]??0,0);
 finish(o,'altar');assert.equal(inv(o)[K.fragrance]??0,0);
 finish(o,'petition');assert.equal(facts(o)[`lotm.act.${CALL}.done`],undefined,'not done before the last step');
 finish(o,'answer');
 assert.equal(facts(o)[`lotm.act.${CALL}.done`],true);assert.equal(facts(o)['lotm.spirit-call.contact'],'attempted');
});

test('R5: save and reload mid-run keeps the phase and the spent stock, and a finished run charges backlash once',()=>{
 const o=setup(KIT);for(const id of STEPS.slice(0,2))finish(o,id);
 const saved=JSON.parse(JSON.stringify({state:o.box.p.state,inv:inv(o)}));
 const r=setup();r.box.p.state=saved.state;Object.assign(r.box.p.gameplay.player.inventory,saved.inv);
 validateLotmState(r.box.p.state);validateSimulationState(r.box.p.state.simulation,r.box.p.state,registry.simulation);
 assert.equal(inv(r)[K.candle],2,'two candles were spent before the save and none is returned or spent twice');
 const next=offers(r).find(a=>a.status==='next'&&a.rowId===CALL);assert.equal(next.step,'set-candle-south');assert.equal(next.eligible,true);
 for(const id of STEPS.slice(2))finish(r,id);
 assert.equal(inv(r)[K.candle]??0,0);
 // Backlash is charged at settlement, once, by the row's weight on the Tingen power carrier.
 r.host.tick(0);r.host.tick(0);
 assert.equal(power(),1.5,'1.5 once, not per tick');
 const key=`lotm.backlash.settled.${CALL}`;assert.ok(r.box.p.state.worlds['book.lotm.tingen'].facts[key],'the settled mark rides the save');
});

test('R5: the means flags follow what is held, and only in the Tingen world',()=>{
 const o=setup(KIT);const f=()=>lotmActFacts(o.box.p.state,{gameplay:o.box.p.gameplay});
 assert.equal(f()['actor.lotm.rite.spirit-contact-means'],true);
 inv(o)[K.candle]=3;assert.equal(f()['actor.lotm.rite.spirit-contact-means'],false,'three candles are not the kit');
 assert.equal(lotmActFacts({actors:{player:{worldId:'base.frontier'}}},{})['actor.lotm.rite.spirit-contact-means'],false,'not enrolled: nothing supplied');
});

test('R5: a ward the lead holds cuts the backlash of a finished rite (the dial, not a ban)',()=>{
 const o=setup(KIT),before=power();facts(o)['lotm.protect.ward']=true;
 for(const id of STEPS)finish(o,id);
 o.host.tick(0);
 assert.equal(power()-before,1,'1.5 less the ward 0.5');
});
