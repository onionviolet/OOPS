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

test('independent enrollment removes the fresh shell kit from the player',()=>{
 const p=bare();p.gameplay.player.inventory={'fixture.item':1};
 const o=hostOver(p),plan=o.host.enroll('be',{independent:true});
 assert.deepEqual(plan.gameplay.player.inventory,{});
 assert.deepEqual(plan.equipment.player,{});
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
 const {createFreshLifeStart}=await import('./src/fresh_life_start.js');
 assert.ok(!hostOver(bare()).host.view().profiles.some(p=>p.key==='be'));
 const p=JSON.parse(fs.readFileSync(0,'utf8'));restoreUnavailableCast(p.state,registry);validateLotmState(p.state);
 let owned=true;const fresh=createFreshLifeStart({token:null,state:()=>p.state,setOwned:value=>{owned=value;},refresh:()=>{}});
 fresh.onLoad({expansion:p.state});await Promise.resolve();assert.equal(fresh.isHeld(),true);assert.equal(fresh.onOwnership(true),false);assert.equal(owned,false);
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


test('the named lead is offered through developer starts, without changing existing saved lives',()=>{
 const ordinary=hostOver(bare(),{developerStarts:()=>false}).host.view();
 assert.equal(ordinary.profiles.some(p=>p.key==='be'),false);
 const developer=hostOver(bare(),{developerStarts:()=>true}).host.view();
 assert.ok(developer.profiles.some(p=>p.key==='be'&&p.label.startsWith('Developer playthrough:')));
});

test('the be seat drinks, steadies and holds a pool on its own source, round-tripping and leaving the Tingen path alone',async()=>{
 const {beSeerDrinkEffects,beSeerSteadyEffects,beSeerCogitateEffects,beSeerUse,BE_SEER_SOURCE,BE_SEER_ENERGY_ID}=await import('../src/book_world_lotm_be_seer.js');
 const {validateSimulationEffect}=await import('../src/simulation_contracts.js');
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 const plan=structuredClone(o.box.p),cause='fixture.be.seer';
 const apply=effects=>applySimulationEffects(plan,effects,{actorId:'player'},registry,cause);
 for(const e of [...beSeerDrinkEffects(),...beSeerSteadyEffects(),...beSeerCogitateEffects(),beSeerUse()])validateSimulationEffect(e);
 assert.notEqual(BE_SEER_SOURCE,LOTM_IDS.source);assert.notEqual(BE_SEER_ENERGY_ID,LOTM_IDS.energy);
 validateLotmState(plan.state);
 apply(beSeerDrinkEffects());
 let s=plan.state;
 assert.ok(s.actors.player.sources[BE_SEER_SOURCE]);assert.equal(s.actors.player.sources[LOTM_IDS.source],undefined);
 assert.ok(s.simulation.energies.player[BE_SEER_ENERGY_ID]);assert.equal(s.simulation.energies.player[LOTM_IDS.energy],undefined);
 validateLotmState(s);validateSimulationState(s.simulation,s,registry.simulation);
 apply(beSeerSteadyEffects());apply([beSeerUse()]);apply(beSeerCogitateEffects());
 s=plan.state;validateLotmState(s);
 const back=JSON.parse(JSON.stringify(s));validateLotmState(back);validateSimulationState(back.simulation,back,registry.simulation);
 assert.equal(JSON.stringify(back),JSON.stringify(s));
 // Refusals: pool without a source, steadiness without the drink, the Tingen source on a book life, a Tingen-free save holding the book pool.
 const noSource=structuredClone(s);delete noSource.actors.player.sources[BE_SEER_SOURCE];assert.throws(()=>validateLotmState(noSource),/source and its recorded drink/);
 const noDrink=structuredClone(s);delete noDrink.actors.player.facts['book.lotm.be.seer.ingested'];assert.throws(()=>validateLotmState(noDrink),/source and its recorded drink/);
 const noPool=structuredClone(s);delete noPool.simulation.energies.player[BE_SEER_ENERGY_ID];assert.throws(()=>validateLotmState(noPool),/pool exists exactly/);
 const early=structuredClone(plan.state);delete early.actors.player.facts['book.lotm.be.seer.ingested'];delete early.actors.player.facts['book.lotm.be.seer.stabilized'];delete early.actors.player.sources[BE_SEER_SOURCE];delete early.simulation.energies.player[BE_SEER_ENERGY_ID];
 validateLotmState(early);early.actors.player.facts['book.lotm.be.seer.stabilized']=true;
 assert.throws(()=>validateLotmState(early),/needs the drink first/);
 // The Tingen path and its probationer saves are unchanged: a Tingen probationer holding the book chain is refused.
 const {fresh}=await import('./lotm_helpers.js'),tp=structuredClone(fresh());validateLotmState(tp.state);
 applySimulationEffects(tp,beSeerDrinkEffects(),{actorId:'player'},registry,'fixture.tingen.seer');
 assert.throws(()=>validateLotmState(tp.state),/belongs to the book life/);
});

test('B2: the darkened eyes show to a cast Beyonder who looks, to nobody else, and fade when Cogitation restores them',async()=>{
 const {beSeerDrinkEffects,beSeerEyesDarkEffects,beSeerEyesClearEffects,beSeerCogitateEffects,BE_SEER_EYES}=await import('../src/book_world_lotm_be_seer.js');
 const {lotmCastReveal,castIndexOf}=await import('../src/book_world_lotm_cast_reveal.js');
 const {lotmReveal}=await import('../src/book_world_lotm_abilities.js');
 const {characterBioView}=await import('../src/character_bio.js');
 const {validateSimulationEffect}=await import('../src/simulation_contracts.js');
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 const plan=structuredClone(o.box.p),apply=effects=>applySimulationEffects(plan,effects,{actorId:'player'},registry,'fixture.be.eyes');
 for(const e of [...beSeerEyesDarkEffects(),...beSeerEyesClearEffects(),...beSeerCogitateEffects(1,{restoreEyes:true})])validateSimulationEffect(e);
 // Pack people carry hashed ids; the index id is what the observer table keys.
 const pack={people:[{id:'fixture.person.hashed-neil',indexId:'lotm.person.old-neil'},{id:'fixture.person.hashed-clerk',indexId:'lotm.person.clerk'}]};
 const view=reveal=>characterBioView({state:plan.state,registry,context:{worldId:LOTM_IDS.world,actorId:'player'},reveal}).description.find(r=>r.id==='look.eyes');
 apply(beSeerDrinkEffects());apply(beSeerEyesDarkEffects());validateLotmState(plan.state);
 // Failure scenario: Klein drinks, Old Neil looks, and the cast id is not a known observer, so nothing is revealed.
 const neil=lotmCastReveal('fixture.person.hashed-neil',registry,plan.state,pack);
 assert.deepEqual(neil,[BE_SEER_EYES],'a cast Beyonder who looks sees the eyes');
 assert.equal(castIndexOf('fixture.person.hashed-neil',pack),'lotm.person.old-neil');
 assert.match(view(neil).detail,/dark, near black/);
 assert.equal(view([]),undefined,'unobserved, the owner view shows nothing');
 assert.deepEqual(lotmCastReveal('fixture.person.hashed-clerk',registry,plan.state,pack),[],'an ordinary cast person sees nothing');
 assert.deepEqual(lotmReveal('lotm.person.old-neil',registry,plan.state),[BE_SEER_EYES],'a bare index id also works');
 // Save round trip keeps the sign; the sign without the drink is refused.
 const back=JSON.parse(JSON.stringify(plan.state));validateLotmState(back);
 const orphan=structuredClone(plan.state);delete orphan.actors.player.sources['book.lotm.be_seer'];assert.throws(()=>validateLotmState(orphan),/darkened eyes follow the drink|source and its recorded drink/);
 // Cogitation without restoreEyes leaves the sign (the text does not show the return); with it the sign fades.
 apply(beSeerCogitateEffects());assert.deepEqual(lotmCastReveal('fixture.person.hashed-neil',registry,plan.state,pack),[BE_SEER_EYES]);
 apply(beSeerCogitateEffects(undefined,{restoreEyes:true}));
 assert.deepEqual(lotmCastReveal('fixture.person.hashed-neil',registry,plan.state,pack),[],'the eyes are restored and nothing is left to see');
 validateLotmState(plan.state);
});

test('B3: the Spirit Vision switch gates aura seeing, ending it leaves exhaustion, sleep or time clears it, and the pool pays',async()=>{
 const B=await import('../src/book_world_lotm_be_seer.js');
 const {simulationFacts}=await import('../src/simulation_effects.js');
 const {meets,validateSimulationEffect}=await import('../src/simulation_contracts.js');
 const {lotmFacts}=await import('../src/book_world_lotm_actions.js');
 const {characterBioView}=await import('../src/character_bio.js');
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 const plan=structuredClone(o.box.p),apply=effects=>applySimulationEffects(plan,effects,{actorId:'player'},registry,'fixture.be.vision');
 const facts=()=>{const ctx={actorId:'player',external:plan.external,gameplay:plan.gameplay,facts:{}};
  return {...simulationFacts(plan.state,ctx,registry),...lotmFacts(plan.state,{...ctx,vitals:{player:{health:24,max_health:24,stamina:18,max_stamina:18}}})};};
 const can=rule=>meets(rule,facts());
 const bio=()=>characterBioView({state:plan.state,registry,context:{worldId:LOTM_IDS.world,actorId:'player'}}).conditions.map(r=>r.label);
 for(const e of [...B.beSpiritVisionOnEffects(),...B.beSpiritVisionOffEffects(),...B.beSpiritRestEffects()])validateSimulationEffect(e);
 // Failure scenario: aura observations offered with the switch off, or the switch worked without the potion.
 assert.equal(can(B.beSpiritVisionSeesRequires()),false,'no potion, no seeing');
 assert.equal(can(B.beSpiritVisionOnRequires()),false,'no potion, no switch');
 apply(B.beSeerDrinkEffects());
 assert.equal(can(B.beSpiritVisionOnRequires()),true);assert.equal(can(B.beSpiritVisionSeesRequires()),false,'switch off: no aura observation');
 assert.equal(can(B.beSpiritVisionOffRequires()),false,'cannot switch off what is off');
 const before=plan.state.simulation.energies.player[B.BE_SEER_ENERGY_ID].reserve;
 apply([B.beSeerUse()]);apply(B.beSpiritVisionOnEffects());
 assert.ok(plan.state.simulation.energies.player[B.BE_SEER_ENERGY_ID].reserve<before,'the B1 pool pays; no second pool');
 assert.equal(can(B.beSpiritVisionSeesRequires()),true);assert.equal(can(B.beSpiritVisionOnRequires()),false,'already on');
 assert.ok(bio().includes('Spirit Vision on'),'the existing condition view shows the switch');
 validateLotmState(plan.state);
 // Ending it leaves one notch of exhaustion; switching on again stays open below the dial (ch62/ch69/ch70 repeat use).
 apply(B.beSpiritVisionOffEffects());
 assert.equal(can(B.beSpiritVisionSeesRequires()),false);assert.equal(can(B.beSpiritVisionOnRequires()),true,'one notch: can switch on again');
 {const again=structuredClone(plan.state),saved=plan.state;
  for(let i=1;i<B.BE_SPIRIT_EXHAUSTION_LIMIT;i++){apply(B.beSpiritVisionOnEffects());apply(B.beSpiritVisionOffEffects());}
  assert.equal(plan.state.simulation.conditions.player[B.BE_SPIRIT_EXHAUSTION].intensity,B.BE_SPIRIT_EXHAUSTION_LIMIT);
  assert.equal(can(B.beSpiritVisionOnRequires()),false,'at the dial: too worn to switch on');
  const r=JSON.parse(JSON.stringify(plan.state));validateLotmState(r);plan.state=r;assert.equal(can(B.beSpiritVisionOnRequires()),false,'the notches survive a save round trip');
  apply(B.beSpiritRestEffects());assert.equal(can(B.beSpiritVisionOnRequires()),true,'sleep clears every notch');
  plan.state=saved;void again;}
 assert.ok(bio().includes('Spirit Vision exhaustion')&&!bio().includes('Spirit Vision on'));
 const exhausted=plan.state.simulation.conditions.player[B.BE_SPIRIT_EXHAUSTION];assert.equal(exhausted.expiresAt,plan.state.clock+B.BE_SPIRIT_EXHAUSTION_FALLBACK_MINUTES);
 validateLotmState(plan.state);validateLotmState(JSON.parse(JSON.stringify(plan.state)));
 const keep=plan.state;
 apply(B.beSpiritRestEffects());assert.equal(can(B.beSpiritVisionOnRequires()),true,'sleep clears it');
 // Time alone clears it too (the assumed fallback).
 plan.state=keep;apply(B.beSpiritVisionOffEffects());plan.state.clock+=B.BE_SPIRIT_EXHAUSTION_FALLBACK_MINUTES+1;
 assert.equal(can(B.beSpiritVisionOnRequires()),true,'the fallback expiry lapses');
 // Refusal: the switch without the drink.
 const orphan=structuredClone(keep);delete orphan.actors.player.sources[B.BE_SEER_SOURCE];assert.throws(()=>validateLotmState(orphan));
});

// B4/B5/R1 (divination energy cost and method gate), uses the fixture cast above.
const {previewSimulationCommand,commitSimulationCommand}=await import('../src/simulation.js');
const {createSimulationRegistry,validateSimulationEffect}=await import('../src/simulation_contracts.js');
const {lotmContext}=await import('../src/book_world_lotm_actions.js');
const {defineDivinations,quoteDivinations}=await import('../src/cast_divination_adapter.js');
const {defineCastAbilities}=await import('../src/cast_ability_adapter.js');
const {lotmDivinationFacts}=await import('../src/book_world_lotm_div_supply.js');
await import('../src/book_world_lotm_domain.js');
const B=await import('../src/book_world_lotm_be_seer.js');
const M=await import('../src/book_world_lotm_divination_method.js');
const {LOTM_CAST_SITUATION:CAST_SIT}=await import('../src/book_world_lotm_cast_host.js');
const binding={worldId:LOTM_IDS.world,group:'book_lotm',situationId:CAST_SIT};
const room='fixture.place.player';
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
// A working pendulum query: the method gates the means (B5) and the attempt spends the Seer pool (B4).
const query={id:'fixture.pendulum',targetId:'fixture.sample',question:'Does the pendulum lean to yes?',method:'Pendulum',label:'Ask the pendulum',description:'Let the pendulum swing over the question.',place:room,
 means:M.beDivMethodRequires('pendulum',{real:true}),contact:eq('actor.life','alive'),
 steps:[{id:'ask',kind:'attempt',label:'Ask',description:'Spend spirit and watch the swing.',minutes:2,costs:[B.beSeerUse()],status:'signal',signal:'It swings clockwise.',report:'You watched the swing.'}]};
const cmds=defineDivinations({queries:[query]},binding);
const ref=createSimulationRegistry({commands:cmds,energies:[B.BE_SEER_ENERGY]});for(const [id,d] of ref.commands)registry.simulation.commands.set(id,d);
const ctxOf=p=>lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:{health:24,max_health:24,stamina:18,max_stamina:18}},nativeAlive:true,facts:{location:p.state.simulation.people.player.location}});
function setup(){
 const o=hostOver(bare());o.host.enroll('be',{independent:true});const p=structuredClone(o.box.p);
 p.state.simulation.people.player.location=room;
 return {p,apply:e=>applySimulationEffects(p.state===undefined?p:p,e,{actorId:'player'},registry,'fixture.m')};
}
const preview=p=>previewSimulationCommand(p.state,registry,'fixture.pendulum.ask',ctxOf(p));
const fx=(p,effects)=>applySimulationEffects(p,effects,{actorId:'player'},registry,'fixture.m');

test('B5: a means without its learned method does not run, the lesson alone shows but does not work, drink plus lesson works',async()=>{
 const {p}=setup();
 const f=()=>lotmDivinationFacts(p.state,{external:p.external,gameplay:p.gameplay});
 for(const e of [...M.beDivMethodLearnEffects('pendulum','Old Neil showed you the swing.',CAST_SIT),...B.beSeerDrinkEffects()])validateSimulationEffect(e);
 assert.equal(f()['actor.lotm.div.method.pendulum.real'],false);
 assert.equal(preview(p).eligible,false,'no method, no pendulum');
 fx(p,B.beSeerDrinkEffects());
 assert.equal(f()['actor.lotm.div.method.pendulum.real'],false,'the potion alone teaches nothing');
 assert.equal(preview(p).eligible,false);
 const q=p.state;fx(p,M.beDivMethodLearnEffects('pendulum','Old Neil showed you the swing.',CAST_SIT));
 assert.equal(f()['actor.lotm.div.method.pendulum.learned'],true);assert.equal(f()['actor.lotm.div.method.pendulum.real'],true);
 assert.equal(f()['actor.lotm.div.method.tarot.learned'],false,'one lesson opens one method');
 assert.equal(preview(p).eligible,true);
 // A staged show needs the lesson only: learned without the source.
 const s=setup().p;fx(s,M.beDivMethodLearnEffects('pendulum','Shown.',CAST_SIT));
 const sf=lotmDivinationFacts(s.state,{external:s.external,gameplay:s.gameplay});
 assert.equal(sf['actor.lotm.div.method.pendulum.learned'],true);assert.equal(sf['actor.lotm.div.method.pendulum.real'],false);
 assert.throws(()=>M.beDivMethodRequires('unlisted'));
 validateLotmState(p.state);
});

test('R1: the BE seat reaches the chart, tarot and numerology rows through learned method plus source, not the Tingen power',()=>{
 const {p}=setup();const f=()=>lotmDivinationFacts(p.state,{external:p.external,gameplay:p.gameplay});
 assert.equal(f()['actor.lotm.div.means.chart'],false);
 fx(p,B.beSeerDrinkEffects());assert.equal(f()['actor.lotm.div.means.chart'],false,'source alone is not the craft');
 fx(p,M.beDivMethodLearnEffects('chart','The chart lesson.',CAST_SIT));
 assert.equal(f()['actor.lotm.div.means.chart'],true);assert.equal(f()['actor.lotm.div.means.tarot'],false);
 // Learned but no source (or lost source): no working method.
 const s=setup().p;fx(s,M.beDivMethodLearnEffects('chart','x',CAST_SIT));
 assert.equal(lotmDivinationFacts(s.state,{external:s.external,gameplay:s.gameplay})['actor.lotm.div.means.chart'],false);
});

test('B4: the divination step spends the Seer pool, shows it in the cost line, and refuses at an empty pool or strain limit',()=>{
 const {p}=setup();fx(p,[...B.beSeerDrinkEffects(),...M.beDivMethodLearnEffects('pendulum','x',CAST_SIT)]);
 const quote=()=>quoteDivinations(p.state,cmds,d=>preview(p),{facts:()=>({})})[0];
 const pool=()=>p.state.simulation.energies.player[B.BE_SEER_ENERGY_ID];
 assert.match(quote().costText,/1 Spirituality; 1 strain \(pool 3 of 3\)/);
 const before=pool().reserve;
 const out=commitSimulationCommand(p.state,registry,{id:'fixture.pendulum.ask'},ctxOf(p),p.state.sequence);
 assert.equal(out.state.simulation.energies.player[B.BE_SEER_ENERGY_ID].reserve,before-1,'paid from the B1 pool');
 // Empty pool: refuse, never run free.
 pool().reserve=0;assert.equal(preview(p).eligible,false);assert.match(quote().costText,/pool 0 of 3/);
 assert.throws(()=>commitSimulationCommand(p.state,registry,{id:'fixture.pendulum.ask'},ctxOf(p),p.state.sequence));
 // Strain limit: rest before more use.
 pool().reserve=3;pool().strain=pool().policy.strainLimit;assert.equal(preview(p).eligible,false);
 // Authoring: an energy cost that is not a use, or has no pool, is not a legal cost.
 for(const bad of [{type:'energy',energyId:B.BE_SEER_ENERGY_ID,operation:'recover',amount:1},{type:'energy',operation:'use',output:1,control:1}]){
  const q2=structuredClone(query);q2.steps[0].costs=[bad];assert.throws(()=>defineDivinations({queries:[q2]},binding),/explicit spent stock/);
 }
 // The ability adapter accepts the same cost and records it as stated, not unknown.
 const ab=defineCastAbilities({encounters:[{id:'fixture.enc',label:'E',description:'d',place:room,moves:[{id:'go',label:'Go',description:'d',minutes:1,report:'r',costs:[B.beSeerUse()]}]}]},binding);
 assert.equal(ab[0].castAbility.cost,'stated');assert.equal(ab[0].costs[0].type,'energy');
});

test('an admitted Cogitation job validates against its exported definition and rejects altered saved effects',async()=>{
 const {beSeerDrinkEffects,beSeerSteadyEffects}=await import('../src/book_world_lotm_be_seer.js');
 const {lotmBeSpellCommands}=await import('../src/lotm_be_spells.js');
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 applySimulationEffects(o.box.p,[...beSeerDrinkEffects(),...beSeerSteadyEffects(),{type:'knowledge',key:'book.lotm.kj3p.cogitation.seen',stage:'seen',value:'Learned the method.'}],{actorId:'player'},registry,'test.cogitation.learn');
 const command=lotmBeSpellCommands.find(c=>c.id.endsWith('.cogitation'));
 o.host.act(command.id);
 assert.equal(o.box.p.state.simulation.jobs.length,1);
 assert.doesNotThrow(()=>validateLotmState(JSON.parse(JSON.stringify(o.box.p.state))));
 const bad=structuredClone(o.box.p.state);bad.simulation.jobs[0].effects[0].amount=99;
 assert.throws(()=>validateLotmState(bad),/exact admitted definition/);
});
