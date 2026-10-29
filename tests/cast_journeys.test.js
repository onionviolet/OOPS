import test from 'node:test';
import assert from 'node:assert/strict';
import {defineJourneys,quoteJourneys,pendingJourneyReports,settleJourneyReports} from '../src/cast_journeys.js';
import {fresh,ctx,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {simulationFacts} from '../src/simulation_effects.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
const a='fixture.place.a',b='fixture.place.b',c='fixture.place.c';
const data={journeys:[
 {id:'fixture.carriage',from:a,to:b,means:'carriage',label:'Take the carriage',minutes:3,fare:2,hours:[6,18],report:'You arrive by carriage.'},
 {id:'fixture.return',from:b,to:a,means:'walk',label:'Return home',minutes:2,fare:0,report:'You return home.'},
 {id:'fixture.boat',from:a,to:c,means:'boat',label:'Cross by boat',minutes:5,fare:1,hours:[20,4],requires:{fact:'actor.fixture.ticket',op:'eq',value:true,reason:'Get a ticket.'},report:'You arrive by boat.'}
]};
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation},commands=defineJourneys(data,binding);
const defs=createSimulationRegistry({commands});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
function setup(money=5){const p=fresh(money);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=a;return p;}
function context(p,hour=6){return {...ctx(p),structuredNative:{bound:true,worldId:I.world,bodyId:'native.player.body',locationIds:[a,b,c]},facts:{...ctx(p).facts,'journey.hour':hour,'journey.money':p.external.money}};}
const preview=(p,d,hour)=>previewSimulationCommand(p.state,registry,d.id,context(p,hour));
const start=(p,d,hour)=>({...p,...commitSimulationCommand(p.state,registry,{id:d.id},context(p,hour),p.state.sequence)});
test('quote exposes fare, duration, means and every blocked admission reason without spending',()=>{
 const p=setup(0),before=JSON.stringify(p),offers=quoteJourneys(p.state,commands,d=>preview(p,d,0),{facts:d=>simulationFacts(p.state,context(p,0),registry,[d.requires])});
 assert.equal(offers[0].duration,3);assert.equal(offers[0].costText,'2 money fare.');assert.match(offers[0].routeText,/carriage/);
 assert.ok(offers[0].reasons.some(r=>/Service runs/.test(r)));assert.ok(offers[0].reasons.some(r=>/fare/.test(r)));
 assert.ok(offers[1].reasons.some(r=>/Return to/.test(r)));assert.ok(offers[2].reasons.some(r=>/ticket/.test(r)));
 assert.equal(JSON.stringify(p),before);assert.deepEqual(defineJourneys(undefined,binding),[]);
 assert.deepEqual(quoteJourneys(p.state,[],()=>assert.fail()),[]);
});
test('native job reserves fare once, keeps origin until due, relocates through native authority and reports once',()=>{
 let p=start(setup(),commands[0]),before=p.state.clock;
 assert.equal(p.external.money,3);assert.equal(p.state.simulation.people.player.location,a);assert.equal(pendingJourneyReports(p.state,commands,I.world),false);
 assert.throws(()=>start(p,commands[0]));
 // Native relocation needs its live world adapter at completion as well as quote.
 const job=JSON.parse(JSON.stringify(p.state.simulation.jobs.at(-1)));assert.equal(job.commandId,'fixture.carriage');
 p.state.simulation.jobs=[job];
 return import('../src/expansion_engine.js').then(({advanceSimulation})=>{
  const step=n=>{const c=context(p),out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});p={...p,...out};return out;};
  step(2);assert.equal(p.state.simulation.people.player.location,a);const out=step(1);
  assert.equal(p.state.clock,before+3);assert.equal(p.state.simulation.people.player.location,b);assert.equal(out.nativeLocation,b);assert.equal(out.nativePatch['current location'],b);assert.equal(p.external.money,3);
  assert.equal(pendingJourneyReports(p.state,commands,I.world),true);assert.equal(settleJourneyReports(p.state,commands,I.world).length,1);assert.deepEqual(settleJourneyReports(p.state,commands,I.world),[]);
  p=start(p,commands[1]);step(2);assert.equal(p.state.simulation.people.player.location,a);assert.equal(p.external.money,3);
 });
});
test('stale hours, purse, origin and support are checked again before commit',()=>{
 for(const change of [p=>p.external.money=0,p=>p.state.simulation.people.player.location=b]){
  const p=setup();assert.equal(preview(p,commands[0],6).eligible,true);change(p);const before=JSON.stringify(p);assert.throws(()=>start(p,commands[0],6));assert.equal(JSON.stringify(p),before);
 }
 assert.throws(()=>start(setup(),commands[0],18));
 const boat=setup();boat.state.actors.player.facts['fixture.ticket']=true;
 // Overnight service accepts its two intervals, excludes the closing boundary.
 for(const h of [20,23,0,3])assert.equal(preview(boat,commands[2],h).eligible,true);
 assert.equal(preview(boat,commands[2],4).eligible,false);
});

test('lost continuing support refunds reserved fare without arrival; opening hours constrain departure',async()=>{
 const {advanceSimulation}=await import('../src/expansion_engine.js');
 let p=setup();p.state.actors.player.facts['fixture.ticket']=true;p=start(p,commands[2],23);
 p.state.actors.player.facts['fixture.ticket']=false;
 const c=context(p,4),out=advanceSimulation(p.state,registry,5,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});
 assert.equal(out.external.money,5);assert.equal(out.state.simulation.people.player.location,a);assert.equal(pendingJourneyReports(out.state,commands,I.world),false);
 p=start(setup(),commands[0],17);const c2=context(p,18),arrived=advanceSimulation(p.state,registry,3,p.external,p.gameplay,{player:{...c2,vitals:c2.vitals.player}});
 assert.equal(arrived.state.simulation.people.player.location,b);assert.equal(arrived.external.money,3);
});

test('missing fare stays unknown and actors without a purse owner quote unpaid fill',()=>{
 const row={...data.journeys[0]};delete row.fare;
 const d=defineJourneys({journeys:[row]},binding)[0];assert.deepEqual(d.costs,[]);
 assert.equal(quoteJourneys({},[d],()=>({visible:true,eligible:true,reasons:[]}))[0].costText,'Fare not recorded.');
 const actor='fixture.actor',npc=defineJourneys(data,{...binding,actorId:actor});assert.deepEqual(npc[0].costs,[]);assert.match(JSON.stringify(npc[0].requires),/purse owner/);
 for(const change of [r=>r.minutes=0,r=>r.fare=-1,r=>r.hours=[5,5],r=>r.hours=[-1,25],r=>r.to='__proto__']){const bad=structuredClone(data);change(bad.journeys[0]);assert.throws(()=>defineJourneys(bad,binding));}
});

test('generator-shaped journey with no fare passes the native registry JSON check',()=>{
 const row={id:'fixture.generated',sourceStepId:'scene#1',sourceStepIds:['scene#1'],from:a,to:b,means:'on_foot',label:'Walk to B',
  description:'Walk to B.',minutes:1,minutesBasis:'fill: one minute',report:'You arrive.',source:{label:'S',locator:'fixture p1'}};
 const command=defineJourneys({journeys:[row]},binding)[0];
 assert.equal(command.journey.fare,null);
 assert.equal(createSimulationRegistry({commands:[command]}).commands.get(row.id).journey.fare,null);
 assert.equal(quoteJourneys({},[command],()=>({visible:true,eligible:true,reasons:[]}))[0].costText,'Fare not recorded.');
 for(const fare of [0,2]){
  const paid=defineJourneys({journeys:[{...row,fare}]},binding)[0];
  assert.equal(createSimulationRegistry({commands:[paid]}).commands.get(row.id).journey.fare,fare);
 }
 for(const fare of [NaN,Infinity,-1])assert.throws(()=>defineJourneys({journeys:[{...row,fare}]},binding),/Invalid journey/);
});

test('native place-panel journey validates pending Save/reload, arrival and literal Export/Import', {timeout:180000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-t2-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as t2Ready} from './book_world_lotm_cast_days.js';\nexport const t2Enroll=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const t2Validate=save=>validateSaveEnvelope(save,game_version);\nexport const t2Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[1].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:5,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other','fixture.place.second','fixture.place.third'],history:[],relations:[],intentions:[],untakenChoices:[]},
  journeys:{journeys:[
   {id:'fixture.journey.carriage',from:'fixture.place.other',to:'fixture.place.second',means:'carriage',label:'Take the carriage',minutes:3,fare:2,hours:[0,18],report:'You arrive by carriage.'},
   {id:'fixture.journey.return',from:'fixture.place.second',to:'fixture.place.other',means:'walk',label:'Return home',minutes:2,fare:0,report:'You return home.'},
   {id:'fixture.journey.closed',from:'fixture.place.other',to:'fixture.place.third',means:'boat',label:'Take the boat',minutes:4,fare:10,hours:[6,18],report:'You arrive by boat.'}
  ]}};
 for(const id of ['second','third'])pack.places.push({id:`fixture.place.${id}`,indexId:`fixture.place.${id}`,name:id,openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence});
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const worker=join(dir,'t2-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.t2Ready();g.module.t2Enroll();
 const initial=await g.save(),button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.equal(initial['current location'],'fixture.place.other');
 assert.ok(button('fixture.journey.carriage'));assert.equal(button('fixture.journey.carriage').disabled,false);
 assert.equal(document.querySelector('[data-lotm-journeys]').dataset.perspective,'player');
 assert.equal(button('fixture.journey.closed').disabled,true);assert.match(button('fixture.journey.closed').title,/fare/);assert.match(button('fixture.journey.closed').title,/Service runs/);
 assert.equal(button('fixture.journey.return').disabled,true);
 g.module.t2Act('fixture.journey.carriage');
 assert.equal(g.internals.foundationSaveBlocked,false);
 let saved=await g.save();assert.equal(saved.character.money,3);
 assert.equal(saved['current location'],'fixture.place.other');
 const pending=saved.expansion.simulation.jobs.find(j=>j.commandId==='fixture.journey.carriage');assert.ok(pending);
 const changed=structuredClone(saved);changed.expansion.simulation.jobs.find(j=>j.commandId==='fixture.journey.carriage').effects[0].location='fixture.place.third';
 assert.throws(()=>g.module.t2Validate(changed),/exact admitted definition/);
 const cheaper=structuredClone(saved);cheaper.expansion.simulation.jobs.find(j=>j.commandId==='fixture.journey.carriage').costs[0].amount=-1;
 assert.throws(()=>g.module.t2Validate(cheaper),/exact admitted definition/);
 const unsupported=structuredClone(saved);delete unsupported.expansion.simulation.jobs.find(j=>j.commandId==='fixture.journey.carriage').completionSupport;
 assert.throws(()=>g.module.t2Validate(unsupported),/exact admitted definition/);
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false);await g.step(2);
 saved=await g.save();assert.equal(saved['current location'],'fixture.place.other');
 await g.step(1);saved=await g.save();
 assert.equal(saved['current location'],'fixture.place.second');assert.equal(saved.expansion.simulation.people.player.location,'fixture.place.second');assert.equal(saved.character.money,3);
 assert.equal(saved.expansion.simulation.knowledge.player['journey.arrived.fixture.journey.carriage'].value,'You arrive by carriage.');
 await g.reload();const encoded=await g.exportFile();await g.importFile(encoded);saved=await g.save();assert.equal(saved['current location'],'fixture.place.second');assert.equal(saved.character.money,3);
 g.module.t2Act('fixture.journey.return');await g.step(2);saved=await g.save();assert.equal(saved['current location'],'fixture.place.other');assert.equal(saved.character.money,3);
 await g.load(initial);assert.equal(g.internals.foundationSaveBlocked,false);assert.deepEqual(g.errors,[]);
 await g.settle();
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:160000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native journey fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
