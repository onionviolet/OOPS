import test from 'node:test';
import assert from 'node:assert/strict';
import {defineBodyCare,quoteBodyCare} from '../src/cast_body_adapter.js';
import {fresh,ctx,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
const place='fixture.place.home',binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
// Pack schema example: amounts and duration may be unknown; stock is supplied by
// its existing owner, not seeded by the body adapter. No per-person split implied.
const data={acts:[
 {id:'fixture.sleep',kind:'sleep',place,label:'Sleep',minutes:4,report:'You wake after resting.'},
 {id:'fixture.wake',kind:'wake',place,label:'Wake',report:'You regain wakeful movement.'},
 {id:'fixture.meal',kind:'meal',place,label:'Share a meal',minutes:2,participants:['player'],food:[{owner:'player',key:'fixture.food',amount:3}],report:'You share the meal.'},
 {id:'fixture.taste',kind:'meal',place,label:'Taste the shared meal',food:[{owner:'player',key:'fixture.food',amount:null}],report:'You taste the meal.',ownerNeeded:'meal quantity and nutrition owner'},
 {id:'fixture.care',kind:'care',place,label:'Care for yourself',report:'You tend to yourself.',ownerNeeded:'symptom recovery owner'}
]};
const commands=defineBodyCare(data,binding),defs=createSimulationRegistry({commands});
for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh();p.state.simulation.people.player.location=place;p.state.actors.player.resources['fixture.food']=3;applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.start');return p;}
function context(p,sleeping=false){return {...ctx(p),facts:{...ctx(p).facts,'bodyCare.sleeping':sleeping}};}
const start=(p,d,sleeping=false)=>({...p,...commitSimulationCommand(p.state,registry,{id:d.id},context(p,sleeping),p.state.sequence)});
function step(p,n){const c=context(p);return {...p,...advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}})};}
test('optional fields stay JSON-safe through the real registry; absent data is silent',()=>{
 assert.deepEqual(defineBodyCare(undefined,binding),[]);
 assert.deepEqual(quoteBodyCare({},[],()=>assert.fail()),[]);
 assert.equal(createSimulationRegistry({commands}).commands.size,5);
 assert.equal(commands[3].bodyCare.food[0].amount,null);
 assert.equal(commands[3].duration,0);
 assert.equal(quoteBodyCare({},[commands[3]],()=>({visible:true,eligible:true,reasons:[]}))[0].duration,null);
 for(const change of [r=>r.food[0].amount=-1,r=>r.food[0].amount=undefined,r=>r.requires={all:[]}]){
  const bad=structuredClone(data);change(bad.acts[3]);assert.throws(()=>defineBodyCare(bad,binding));
 }
});
test('real food is reserved once, absent food refuses and interrupted work returns stock',()=>{
 const p=setup(),before=JSON.stringify(p),q=previewSimulationCommand(p.state,registry,commands[2].id,context(p));
 assert.equal(q.eligible,true);assert.equal(JSON.stringify(p),before);
 let held=start(p,commands[2]);assert.equal(held.state.actors.player.resources['fixture.food'],0);
 assert.throws(()=>start(held,commands[2]));
 const cancelled=cancelSimulationJob(held.state,registry,held.state.simulation.jobs.at(-1).id,context(held),held.state.sequence);
 assert.equal(cancelled.state.actors.player.resources['fixture.food'],3);
 assert.equal(cancelled.state.simulation.knowledge.player?.['body.care.fixture.meal'],undefined);
 held=step(held,2);assert.equal(held.state.actors.player.resources['fixture.food'],0);
 assert.equal(held.state.simulation.knowledge.player['body.care.fixture.meal'].basis.food[0].amount,3);
 const empty=setup();empty.state.actors.player.resources['fixture.food']=0;assert.throws(()=>start(empty,commands[2]));
});
test('absent meal participants refuse; lost contact refunds existing stock',()=>{
 const row={...data.acts[2],id:'fixture.groupmeal',participants:[I.supervisor]};
 const d=defineBodyCare({acts:[row]},binding)[0],defs=createSimulationRegistry({commands:[d]});
 registry.simulation.commands.set(d.id,defs.commands.get(d.id));
 const p=setup();assert.equal(previewSimulationCommand(p.state,registry,d.id,context(p)).eligible,false);
 p.state.simulation.people[I.supervisor].location=place;let held=start(p,d);
 held.state.simulation.people[I.supervisor].location='fixture.place.away';held=step(held,2);
 assert.equal(held.state.actors.player.resources['fixture.food'],3);
 assert.equal(held.state.simulation.knowledge.player?.['body.care.fixture.groupmeal'],undefined);
});
test('unknown portions write observation and owner-needed fact without fabricated stock or recovery',()=>{
 const p=setup(),body=structuredClone(p.state.simulation.people.player),out=start(p,commands[3]);
 assert.equal(out.state.actors.player.resources['fixture.food'],3);
 assert.deepEqual(out.state.simulation.people.player,body);
 const receipt=out.state.simulation.knowledge.player['body.care.fixture.taste'];
 assert.deepEqual(receipt.basis.participants,['player']);assert.equal(receipt.basis.food[0].amount,null);
 assert.equal(out.state.actors.player.facts['body.ownerNeeded.fixture.taste'],'meal quantity and nutrition owner');
});
test('pack fact-waking does not substitute native sleep state, and interruption grants no completion',()=>{
 const p=setup();p.state.actors.player.facts['place.act.awake']=true;
 assert.equal(previewSimulationCommand(p.state,registry,commands[0].id,context(p,true)).eligible,false);
 assert.equal(previewSimulationCommand(p.state,registry,commands[1].id,context(p,false)).eligible,false);
 let held=start(p,commands[0]);const job=held.state.simulation.jobs.at(-1);
 held={...held,...cancelSimulationJob(held.state,registry,job.id,context(held,true),held.state.sequence)};
 assert.equal(held.state.simulation.knowledge.player?.['body.care.fixture.sleep'],undefined);
 const woke=start(held,commands[1],true);assert.equal(woke.state.simulation.people.player.location,place);
 assert.equal(woke.state.simulation.knowledge.player['body.care.fixture.wake'].value,'You regain wakeful movement.');
});

test('native sleep, waking, meals and real validator Save/reload/Export/Import', {timeout:300000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-bd1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 await mkdir(join(dir,'tests'),{recursive:true});
 await cp(join(root,'tests/perspective_controls.test.js'),join(dir,'tests/perspective_controls.test.js'));
 t.diagnostic('BD1 fixture tests the live integrated source.');
 await exec(process.execPath,['--test','tests/perspective_controls.test.js'],{cwd:dir});
 const arch=await exec(process.execPath,['scripts/check_architecture.mjs'],{cwd:dir});t.diagnostic(arch.stdout.trim());
 const buildOut=join(dir,'bd1-build');
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:buildOut},maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');
 t.diagnostic('Integrated build SHA-256 '+createHash('sha256').update(await readFile(join(buildOut,'dist/bundle.js'))).digest('hex'));
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as bd1Ready} from './book_world_lotm_cast_days.js';\nexport const bd1Enroll=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const bd1Validate=save=>validateSaveEnvelope(save,game_version);\nexport const bd1Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[1].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:5,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other','fixture.place.second','fixture.place.third'],history:[],relations:[],intentions:[],untakenChoices:[]},
  bodyCare:JSON.parse('{"acts": [{"id": "fixture.native.sleep", "kind": "sleep", "place": "fixture.place.other", "label": "Sleep here", "minutes": 4, "report": "You wake after resting."}, {"id": "fixture.native.wake", "kind": "wake", "place": "fixture.place.other", "label": "Wake now", "report": "You wake early."}, {"id": "fixture.native.meal", "kind": "meal", "place": "fixture.place.other", "label": "Share a meal", "minutes": 2, "report": "You finish the meal.", "food": [{"owner": "player", "key": "fixture.food", "amount": 3}]}, {"id": "fixture.native.taste", "kind": "meal", "place": "fixture.place.other", "label": "Taste the meal", "report": "You taste the shared meal.", "participants": ["player", "fixture.person.relative"], "food": [{"owner": "player", "key": "fixture.food", "amount": null}], "ownerNeeded": "nutrition and portion owner"}]}')};
 for(const id of ['second','third'])pack.places.push({id:`fixture.place.${id}`,indexId:`fixture.place.${id}`,name:id,openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence});
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const worker=join(dir,'bd1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.bd1Ready();g.module.bd1Enroll();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 const initial=await g.save();
 assert.equal(document.querySelector('[data-lotm-body-care]').dataset.perspective,'player');
 assert.equal(button('fixture.native.wake').disabled,true);
 // Synthetic fixture seed goes through the real validator, not a body seed.
 const seeded=structuredClone(initial);seeded.expansion.actors.player.resources['fixture.food']=3;seeded.character.hp_to_full=12;seeded.character.stamina_to_full=12;
 await g.load(seeded);assert.equal(g.internals.foundationSaveBlocked,false);
 assert.equal(button('fixture.native.meal').disabled,false);
 g.module.bd1Act('fixture.native.meal');
 let saved=await g.save();assert.equal(saved.expansion.actors.player.resources['fixture.food'],0);
 assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='fixture.native.meal'));
 const tampered=structuredClone(saved);tampered.expansion.simulation.jobs.find(j=>j.commandId==='fixture.native.meal').costs[0].amount=-1;
 assert.throws(()=>g.module.bd1Validate(tampered),/exact admitted definition/);
 const support=structuredClone(saved);delete support.expansion.simulation.jobs.find(j=>j.commandId==='fixture.native.meal').completionSupport;
 assert.throws(()=>g.module.bd1Validate(support),/Body support/);
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false);
 const pending=await g.exportFile();await g.importFile(pending);await g.step(2);
 saved=await g.save();assert.equal(saved.expansion.actors.player.resources['fixture.food'],0);
 assert.equal(saved.expansion.simulation.knowledge.player['body.care.fixture.native.meal'].value,'You finish the meal.');
 assert.equal(button('fixture.native.meal').disabled,true);
 g.module.bd1Act('fixture.native.taste');saved=await g.save();
 assert.equal(saved.expansion.actors.player.resources['fixture.food'],0);
 assert.equal(saved.expansion.simulation.knowledge.player['body.care.fixture.native.taste'].basis.food[0].amount,null);
 g.module.bd1Act('fixture.native.sleep');saved=await g.save();assert.equal(saved.is_sleeping,true);
 assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='fixture.native.sleep'));
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false);saved=await g.save();assert.equal(saved.is_sleeping,true);
 assert.equal(button('fixture.native.wake').disabled,false);
 g.module.bd1Act('fixture.native.wake');saved=await g.save();assert.equal(saved.is_sleeping,false);
 assert.equal(saved.expansion.simulation.jobs.some(j=>j.commandId==='fixture.native.sleep'),false);
 assert.equal(saved.expansion.simulation.knowledge.player['body.care.fixture.native.sleep'],undefined);
 assert.equal(saved.expansion.simulation.knowledge.player['body.care.fixture.native.wake'].value,'You wake early.');
 const depleted=await g.save();depleted.character.hp_to_full=12;await g.load(depleted);const beforeRecovery=(await g.save()).character.hp_to_full;
 g.module.bd1Act('fixture.native.sleep');await g.step(4);saved=await g.save();assert.ok(saved.character.hp_to_full<beforeRecovery,'native sleep recovery consumed by health');assert.equal(saved.is_sleeping,false);
 assert.equal(saved.expansion.simulation.knowledge.player['body.care.fixture.native.sleep'].value,'You wake after resting.');
 assert.equal(saved['current location'],'fixture.place.other');
 await g.reload();const encoded=await g.exportFile();await g.importFile(encoded);saved=await g.save();
 assert.equal(saved.expansion.simulation.knowledge.player['body.care.fixture.native.sleep'].value,'You wake after resting.');
 assert.equal(saved.expansion.actors.player.resources['fixture.food'],0);assert.equal(saved.is_sleeping,false);
 await g.load(initial);assert.equal(g.internals.foundationSaveBlocked,false);assert.deepEqual(g.errors,[]);
 await g.settle();
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native body fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
