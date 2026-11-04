// B8: BE-seat firearm practice, ammunition and hit chance. Failure scenarios: unloaded or unissued revolver never hits; a round is spent exactly once
// (also across save and reload); practice aim cannot pass the text's "basic approval" step; a hit is the same notch scale as the band table.
import test from 'node:test';
import assert from 'node:assert/strict';
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
const {hostOver,registry,fresh,bare}=await import('./lotm_helpers.js');
const {validateLotmState}=await import('../src/book_world_lotm_state.js');
const {validateSimulationState,validateSimulationEffect}=await import('../src/simulation_contracts.js');
const {applySimulationEffects}=await import('../src/simulation_effects.js');
const {lotmFacts}=await import('../src/book_world_lotm_actions.js');
const F=await import('../src/book_world_lotm_be_firearm.js');
const beLife=()=>{const o=hostOver(bare());o.host.enroll('be',{independent:true});return structuredClone(o.box.p);};
const apply=(plan,effects,cause='fixture.firearm')=>applySimulationEffects(plan,effects,{actorId:'player'},registry,cause);
const facts=plan=>lotmFacts(plan.state,{gameplay:plan.gameplay});
const ready=()=>{const p=beLife();apply(p,[...F.beFirearmIssueEffects(),...F.beFirearmStockEffects('ordinary',30),...F.beFirearmStockEffects('silver',10)]);return p;};

test('B8 effects validate and loading respects the chambers and the carried count',()=>{
 for(const e of [...F.beFirearmIssueEffects(),...F.beFirearmLoadEffects('ordinary',6),...F.beFirearmFireEffects('silver',{practice:true})])validateSimulationEffect(e);
 const p=ready();apply(p,F.beFirearmLoadEffects('ordinary',6));
 assert.equal(facts(p)['lotm.beFirearm.loaded'],6);assert.equal(facts(p)['lotm.beFirearm.free'],0);assert.equal(facts(p)['lotm.beFirearm.carried.ordinary'],24);
 apply(p,F.beFirearmLoadEffects('silver',1));
 assert.throws(()=>validateLotmState(p.state),/More rounds are loaded/,'the seventh round does not fit');
 const q=ready();assert.throws(()=>apply(q,F.beFirearmLoadEffects('ordinary',31)),/Insufficient/,'cannot load rounds not carried');
});

test('an empty or unissued revolver never hits; a loaded one spends exactly one round',()=>{
 const always=()=>0,p=beLife();
 assert.deepEqual([F.resolveShot(facts(p),{rng:always}).reason,F.resolveShot(facts(p),{rng:always}).fired],['no_revolver',false]);
 const q=ready();let r=F.resolveShot(facts(q),{rng:always});
 assert.equal(r.fired,false);assert.equal(r.reason,'empty');assert.equal(r.hit,false);assert.deepEqual(r.effects,[]);
 apply(q,F.beFirearmLoadEffects('ordinary',2));
 r=F.resolveShot(facts(q),{rng:always,practice:true});assert.equal(r.fired,true);assert.equal(r.hit,true,'rng 0 is under any chance');
 apply(q,r.effects);assert.equal(facts(q)['lotm.beFirearm.loaded.ordinary'],1);assert.equal(facts(q)['lotm.beFirearm.practiceFired'],1);
 // the chosen kind must be the loaded one: silver is empty
 assert.equal(F.resolveShot(facts(q),{rng:always,kind:'silver'}).reason,'empty');
 assert.throws(()=>F.resolveShot(facts(q),{}),/rng/);
 // a fight shot spends a round but does not move practice
 const before=facts(q)['lotm.beFirearm.practiceFired'];apply(q,F.resolveShot(facts(q),{rng:always}).effects);
 assert.equal(facts(q)['lotm.beFirearm.practiceFired'],before);assert.equal(facts(q)['lotm.beFirearm.loaded'],0);
 assert.throws(()=>apply(q,F.beFirearmFireEffects('ordinary')),/Insufficient/,'no negative ammunition');
});

test('aim grows with practice only up to the basic-approval step, then stops',()=>{
 const a=n=>F.aimNotch(n);
 assert.equal(a(0),0);assert.ok(a(50)>a(0));assert.ok(a(1000)>a(250));
 assert.equal(a(1000),a(1e6),'a thousand rounds is the text\'s basic approval (ch128 P002); more moves nothing');
 assert.equal(F.aimCapRounds(),1000);
 const lo=F.shotOdds({fired:0,range:'close'}).chance,hi=F.shotOdds({fired:1000,range:'close'}).chance;
 assert.ok(hi>lo&&hi>0.9&&lo<=0.5);
 assert.ok(F.shotOdds({fired:1000,range:'far'}).chance<hi);
});

test('hit chance and damage ride the band scale: a Seq 7 Demoness dodges (LCT6), silver counts against a Beyonder, an ordinary adult falls to one hit',()=>{
 const adult=F.shotOdds({fired:1000,range:'close'}),clown=F.shotOdds({fired:1000,range:'close',target:{pathway:'Demoness',sequence:7,beyonder:true}});
 assert.ok(clown.chance<adult.chance,'a faster target is harder to hit');
 assert.equal(adult.hitsToDown,1);
 const zombie={pathway:'Chained',sequence:6,beyonder:true},o=F.shotOdds({fired:1000,range:'close',target:zombie}),s=F.shotOdds({fired:1000,range:'close',target:zombie,kind:'silver'});
 assert.ok(o.hitsToDown>=3&&s.hitsToDown<o.hitsToDown,'silver needs fewer hits on a Beyonder');
 assert.ok(F.shotOdds({fired:0,range:'far',unaware:true}).delta>F.shotOdds({fired:0,range:'far'}).delta,'an unaware target is easier');
});

test('rounds, loading and practice survive a JSON save and reload; broken saves are refused',()=>{
 const p=ready();apply(p,F.beFirearmLoadEffects('silver',3));apply(p,F.resolveShot(facts(p),{rng:()=>0,kind:'silver',practice:true}).effects);
 validateLotmState(p.state);
 const back=JSON.parse(JSON.stringify(p.state));validateLotmState(back);validateSimulationState(back.simulation,back,registry.simulation);
 assert.equal(JSON.stringify(back),JSON.stringify(p.state));
 const q={...p,state:back};assert.equal(facts(q)['lotm.beFirearm.loaded.silver'],2,'spent once, not again on reload');assert.equal(facts(q)['lotm.beFirearm.practiceFired'],1);
 const noGun=structuredClone(p.state);delete noGun.actors.player.facts[F.BE_REVOLVER_FACT];assert.throws(()=>validateLotmState(noGun),/need the revolver/);
 const odd=structuredClone(p.state);odd.actors.player.resources['book.lotm.be.loaded.ordinary']=-1;assert.throws(()=>validateLotmState(odd),/whole numbers/);
 // the Tingen probationer holds no revolver
 const tp=structuredClone(fresh());validateLotmState(tp.state);apply(tp,F.beFirearmIssueEffects());assert.throws(()=>validateLotmState(tp.state),/belongs to the book life/);
});
