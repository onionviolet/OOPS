import test from 'node:test';
import assert from 'node:assert/strict';
import {definePlaceActs,seedPlaceObjects,objectNoticeability,quotePlaceActs,settlePlaceActReports,pendingPlaceActReports} from '../src/place_acts.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
const room='fixture.room',sink='fixture.sink',stock=I.supervisor;
const fact=(key,value)=>({type:'fact',scope:'world',key:`fixture.${key}`,value});
const eq=(key,value)=>({fact:`world.fixture.${key}`,op:'eq',value,reason:`Check ${key} first.`});
const rows=[
 ['inspect',room,1,null,[fact('seen',true),{type:'observation',scope:'world',key:'fixture.contents',as:'fixture.observed.contents'}]],
 ['pay',room,1,eq('paid',false),[fact('paid',true)],[{type:'resource',actor:'player',key:'money',native:true,amount:-1}]],
 ['use',room,1,eq('paid',true),[fact('lit',true)]],
 ['wash',sink,4,null,[fact('washed',true),fact('wet',true)]],
 ['clean',room,3,{all:[eq('wet',true),eq('lit',true)]},[fact('clean',true)]],
 ['consume',room,5,null,[],[{type:'resource',actor:stock,key:'fixture.portions',amount:-1}]],
 ['store',room,1,eq('container',''),[fact('container','fixture.drawer'),fact('exposure',0.1)]],
 ['take',room,1,eq('container','fixture.drawer'),[fact('container',''),fact('exposure',1)]]
];
const data={objects:[{id:'fixture.desk',facts:{'fixture.contents':3,'fixture.paid':false,'fixture.lit':false,'fixture.wet':false,'fixture.container':'','fixture.exposure':1},resources:[{actor:stock,key:'fixture.portions',amount:2}]}],
 acts:rows.map(([operation,place,minutes,requires,effects,costs=[]])=>({id:`fixture.${operation}`,operation,place,minutes,requires,effects,costs,label:`${operation} object`,description:`Handle the object: ${operation}.`,report:`You ${operation} the object.`,knowledgeKey:`fixture.known.${operation}`,costLabel:costs.length?'1 unit':'no stock spent'}))};
const commands=definePlaceActs(data,{worldId:I.world,group:'book_lotm',situationId:I.situation});
const definitions=createSimulationRegistry({commands});
for(const [id,d] of definitions.commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh(2);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;seedPlaceObjects(p.state,data,I.world);return p;}
const preview=(p,d)=>previewSimulationCommand(p.state,registry,d.id,ctx(p));
function start(p,id){return commitSimulationCommand(p.state,registry,{id:`fixture.${id}`},ctx(p),p.state.sequence);}
function perform(p,id){const plan=start(p,id),minutes=data.acts.find(r=>r.operation===id).minutes;return wait({...p,...plan},minutes);}
test('each ordinary act quotes real minutes, settles effects and writes one actor receipt',()=>{
 let p=setup();
 for(const op of ['inspect','pay','use','wash','clean','consume','store','take']){
  const d=commands.find(d=>d.id===`fixture.${op}`);p.state.simulation.people.player.location=d.location;
  const before=JSON.stringify(p),q=preview(p,d);assert.equal(q.eligible,true,q.reasons.join(' '));assert.equal(q.duration,d.duration);assert.equal(JSON.stringify(p),before,'quote is read-only');
  const offered=quotePlaceActs(p.state,commands,data,x=>preview(p,x)).find(x=>x.id===d.id);assert.match(offered.label,new RegExp(`${d.duration} min`));
  const clock=p.state.clock;p=perform(p,op);assert.equal(p.state.clock,clock+d.duration);
  assert.equal(pendingPlaceActReports(p.state,data,I.world),true);
  if(op==='inspect')assert.equal(p.state.actors.player.facts['fixture.observed.contents'],3);
  const reports=settlePlaceActReports(p.state,data,I.world);assert.deepEqual(reports.map(r=>r.text),[`You ${op} the object.`]);assert.equal(reports[0].at,p.state.clock);
  assert.deepEqual(settlePlaceActReports(p.state,data,I.world),[],'no duplicate on projection/reload');
  if(op==='pay')assert.equal(p.external.money,1);
  if(op==='consume')assert.equal(p.state.actors[stock].resources['fixture.portions'],1);
  if(op==='store')assert.equal(objectNoticeability(p.state,I.world,{containerFact:'fixture.container',exposureFact:'fixture.exposure'}).exposure,0.1);
 }
 for(const key of ['seen','paid','lit','washed','wet','clean'])assert.equal(p.state.worlds[I.world].facts[`fixture.${key}`],true);
 assert.equal(objectNoticeability(p.state,I.world,{containerFact:'fixture.container',exposureFact:'fixture.exposure'}).exposure,1);
 validateSimulationState(p.state.simulation,p.state,registry.simulation);
 const reloaded=JSON.parse(JSON.stringify(p));assert.equal(seedPlaceObjects(reloaded.state,data,I.world),false);assert.equal(reloaded.state.actors[stock].resources['fixture.portions'],1);assert.deepEqual(settlePlaceActReports(reloaded.state,data,I.world),[]);
});
test('stale payment, empty shared stock and missing place/means refuse without mutation',()=>{
 let p=setup();const lamp=commands.find(d=>d.id==='fixture.use');assert.equal(preview(p,lamp).eligible,false);
 assert.equal(quotePlaceActs(p.state,commands,data,d=>preview(p,d)).find(r=>r.id===lamp.id).eligible,false);
 p.external.money=0;let before=JSON.stringify(p);assert.throws(()=>start(p,'pay'));assert.equal(JSON.stringify(p),before);
 p.state.actors[stock].resources['fixture.portions']=0;before=JSON.stringify(p);assert.throws(()=>start(p,'consume'));assert.equal(JSON.stringify(p),before);
 p.state.simulation.people.player.location=sink;before=JSON.stringify(p);assert.throws(()=>start(p,'inspect'));assert.equal(JSON.stringify(p),before);
 p=setup();const plan=start(p,'pay');assert.equal(plan.external.money,1);assert.deepEqual(settlePlaceActReports(plan.state,data,I.world),[],'unfinished work has no receipt');
 p=wait({...p,...plan},1);before=JSON.stringify(p);assert.throws(()=>start(p,'pay'));assert.equal(JSON.stringify(p),before);
});
test('lost support stops an accepted act without awarding effects or a receipt',()=>{
 let p=setup();p=perform(p,'pay');const plan=start(p,'use');p={...p,...plan};p.state.worlds[I.world].facts['fixture.paid']=false;
 p=wait(p,1);assert.equal(p.state.worlds[I.world].facts['fixture.lit'],false);assert.equal(p.state.simulation.knowledge.player['fixture.known.use'],undefined);
});
test('checking contents preserves the stock and records what this actor actually observed',()=>{
 const p=setup(),row={id:'fixture.count',operation:'inspect',place:room,minutes:2,label:'Empty, count and replace the pouch contents',description:'Empty the pouch, count the three seeds and replace them.',report:'You count three seeds in the pouch and put them back.',knowledgeKey:'fixture.counted',requires:eq('contents',3),effects:[{type:'observation',scope:'world',key:'fixture.contents',as:'fixture.counted.contents'}]};
 const d=definePlaceActs({acts:[row]},{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(d.id,d);
 const q=preview(p,d);assert.equal(q.eligible,true,q.reasons.join(' '));assert.equal(q.duration,2);
 const out=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence),done=wait({...p,...out},2);
 assert.equal(done.state.worlds[I.world].facts['fixture.contents'],3);assert.equal(done.state.actors.player.facts['fixture.counted.contents'],3);
 assert.equal(settlePlaceActReports(done.state,{acts:[row]},I.world)[0].text,row.report);
 done.state.worlds[I.world].facts['fixture.contents']=2;assert.equal(preview(done,d).eligible,false,'a changed stock cannot produce the old count');
});

test('be-seat native pending and settled acts survive save, reload, export and import', {timeout:180000}, async t=>{
 // Run the real native save owner in a disposable copy, with a synthetic cast pack.
 // The state validator is outside H1's grant, so include the coordinator patch in
 // this candidate; once integrated, the same test uses the existing validator.
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-h1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const stateFile=join(dir,'src/book_world_lotm_state.js'),stateSource=await readFile(stateFile,'utf8');
 if(!/\[[^\]]*\.\.\.castObjectCommands\b[^\]]*\]\.find\s*\(/.test(stateSource)){
  const patch=resolve(root,'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_SAVE_INTEGRATION.patch');
  await exec('git',['apply','--check',patch],{cwd:dir});await exec('git',['apply',patch],{cwd:dir});
 }
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as h1CastReady} from './book_world_lotm_cast_days.js';\nexport const h1EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const h1Validate=save=>validateSaveEnvelope(save,game_version);\nexport const h1Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[0].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other'],history:[],relations:[],intentions:[],untakenChoices:[]},
  householdActs:{schema:1,objects:[{id:'fixture.box',facts:{'fixture.box.seen':false,'fixture.existing':7}}],acts:[{id:'book.lotm.fixture_inspect',operation:'inspect',place:'fixture.place.other',minutes:1,label:'Inspect the box',description:'Look over the box.',report:'You inspect the box.',knowledgeKey:'fixture.inspection',requires:{fact:'world.fixture.box.seen',op:'eq',value:false,reason:'Already inspected.'},effects:[{type:'fact',scope:'world',key:'fixture.box.seen',value:true}],costs:[],costLabel:'no stock spent'}]}};
 // H2: the same native validator/save route admits every new operation.
 pack.householdActs.objects.push({id:'fixture.stock',resources:[{actor:'player',key:'fixture.grain',amount:2},{actor:'player',key:'fixture.meal',amount:0}],facts:{'fixture.clock':'07:15'},actorFacts:[{actor:'player',key:'fixture.owned',value:true},{actor:'player',key:'fixture.awake',value:false}]});
 const operations=[['read',{}],['prepare',{costs:[{type:'resource',actor:'player',key:'fixture.grain',amount:-1}],effects:[{type:'resource',actor:'player',key:'fixture.meal',amount:1}]}],['wake',{awakeFact:'fixture.awake'}],['check time',{clock:{fact:'fixture.clock',value:'07:15'}}],['sit',{}],['secure',{objectId:'fixture.stock',secure:{ownedFact:'fixture.owned',custodyFact:'fixture.custody',concealedFact:'fixture.concealed',container:'fixture.drawer'}}],['wait here',{}]];
 pack.householdActs.acts.push(...operations.map(([operation,extra],i)=>({id:`book.lotm.fixture_operation_${i}`,operation,place:'fixture.place.other',minutes:1,label:operation,description:`${operation} at home.`,report:`You finish ${operation}.`,knowledgeKey:`fixture.operation.${i}`,...extra})));
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const worker=join(dir,'h1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.h1CastReady();g.module.h1EnrollBe();
 const initial=JSON.parse(g.internals.create_save());
 assert.equal(initial.expansion.lotm.entryProfile,'book.lead.be@1');
 g.module.h1Act('book.lotm.fixture_inspect');
 assert.equal(g.internals.foundationSaveBlocked,false,'act must durably admit the pending job');
 let saved=await g.save();assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='book.lotm.fixture_inspect'));
 const changed=structuredClone(saved),job=changed.expansion.simulation.jobs.find(j=>j.commandId==='book.lotm.fixture_inspect');
 job.effects[0].value=false;assert.throws(()=>g.module.h1Validate(changed),/exact admitted definition/,'saved job remains bound to its admitted effects');
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false,'pending job reloads');
 await g.step(2);saved=await g.save();
 assert.equal(saved.expansion.worlds['book.lotm.tingen'].facts['fixture.box.seen'],true);
 assert.equal(saved.expansion.simulation.knowledge.player['fixture.inspection'].value,'You inspect the box.');
 assert.ok(!saved.expansion.simulation.jobs.some(j=>j.commandId==='book.lotm.fixture_inspect'));
 await g.reload();let after=await g.save();assert.equal(after.expansion.worlds['book.lotm.tingen'].facts['fixture.box.seen'],true);
 const encoded=await g.exportFile();await g.importFile(encoded);after=await g.save();
 assert.equal(after.expansion.worlds['book.lotm.tingen'].facts['fixture.box.seen'],true);
 assert.equal(after.expansion.simulation.knowledge.player['fixture.inspection'].value,'You inspect the box.');
 assert.equal(g.internals.foundationSaveBlocked,false);assert.deepEqual(g.errors,[]);
 // H2: pending and completed commands cross real Save/reload/Export/Import.
 for(let i=0;i<7;i++){
  const id='book.lotm.fixture_operation_'+i;g.module.h1Act(id);
  saved=await g.save();assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId===id));
  const tampered=structuredClone(saved),pending=tampered.expansion.simulation.jobs.find(j=>j.commandId===id);
  pending.effects.at(-1).value='altered';assert.throws(()=>g.module.h1Validate(tampered),/exact admitted definition/);
  if(i===1){const pendingExport=await g.exportFile();await g.importFile(pendingExport);
   assert.ok((await g.save()).expansion.simulation.jobs.some(j=>j.commandId===id));}
  await g.step(2);saved=await g.save();
  assert.equal(saved.expansion.simulation.knowledge.player['fixture.operation.'+i].stage,'seen');
  process.stdout.write('settled operation '+i+'\\n');
  assert.equal(g.internals.foundationSaveBlocked,false);
 }
 const operationExport=await g.exportFile();await g.importFile(operationExport);saved=await g.save();
 for(let i=0;i<7;i++)assert.equal(saved.expansion.simulation.knowledge.player['fixture.operation.'+i].stage,'seen');
 assert.equal(saved.expansion.actors.player.resources['fixture.grain'],1);
 assert.equal(saved.expansion.actors.player.resources['fixture.meal'],1);
 assert.equal(saved.expansion.actors.player.facts['fixture.awake'],true);
 assert.equal(saved.expansion.worlds['book.lotm.tingen'].facts['fixture.concealed'],true);
 assert.equal(saved.expansion.simulation.knowledge.player['fixture.operation.3.display'].value,'07:15');
 assert.deepEqual(g.errors,[]);
 // Simulate a pre-H1 save: no markers/act facts. Additive seeding preserves any
 // pre-existing world fact and does not invent a completed action or receipt.
 const old=structuredClone(initial),facts=old.expansion.worlds['book.lotm.tingen'].facts;
 delete facts['place.act.seed.fixture.box'];delete facts['fixture.box.seen'];facts['fixture.existing']=9;
 await g.load(old);await g.step(1);after=await g.save();
 assert.equal(after.expansion.worlds['book.lotm.tingen'].facts['fixture.box.seen'],false);
 assert.equal(after.expansion.worlds['book.lotm.tingen'].facts['fixture.existing'],9);
 assert.equal(after.expansion.simulation.knowledge.player['fixture.inspection'],undefined);
 assert.equal(g.internals.foundationSaveBlocked,false);assert.deepEqual(g.errors,[]);
 await g.settle();
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:160000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native save fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
