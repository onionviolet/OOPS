import test from 'node:test';
import assert from 'node:assert/strict';
import {definePlaceActs,seedPlaceObjects,objectNoticeability,quotePlaceActs,settlePlaceActReports,pendingPlaceActReports,placeStockViews,placeActRecords,placeActVisitors} from '../src/place_acts.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {castObjectCommands} from '../src/book_world_lotm_cast_host.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob,simulationFacts} from '../src/simulation.js';
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

test('paid place work discloses interruption, preserves prior knowledge and never refunds spent input or awards an unfinished result',async()=>{
 const {loadExpansionState}=await import('../src/expansion_engine.js');
 const raw=JSON.stringify({id:'Potato'}),cooked=JSON.stringify({id:'Cooked potato'});
 const row={id:'fixture.paid_prepare',operation:'prepare',place:room,minutes:2,label:'Prepare the held sample',description:'Work the actual sample using a learned procedure.',report:'The prepared sample is ready.',knowledgeKey:'fixture.paid_prepared',cancellation:'forfeit',costLabel:'2 potatoes',requires:eq('paid',true),costs:[{type:'item',actor:'player',key:raw,amount:-2}],effects:[{type:'item',actor:'player',key:cooked,amount:2}]};
 const local={...data,acts:[row]},d=definePlaceActs(local,{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(d.id,d);
 for(const mode of ['complete','cancel','unsupported']){
  let p=setup();p.state.worlds[I.world].facts['fixture.paid']=true;p.gameplay.player.inventory[raw]=2;
  (p.state.simulation.knowledge.player??={})['fixture.learned_procedure']={stage:'understood',value:'A remembered procedure.',at:p.state.clock,cause:'fixture.lesson'};
  const before=JSON.stringify(p);assert.match(quotePlaceActs(p.state,[d],local,x=>preview(p,x))[0].label,/inputs stay spent if stopped/);assert.equal(JSON.stringify(p),before);
  p={...p,...commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence)};
  p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);
  if(mode==='cancel')p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p),p.state.sequence)};
  else{if(mode==='unsupported')p.state.worlds[I.world].facts['fixture.paid']=false;p=wait(p,2);}
  assert.equal(p.gameplay.player.inventory[raw]||0,0);
  assert.equal(p.gameplay.player.inventory[cooked]||0,mode==='complete'?2:0);
  assert.equal(!!p.state.simulation.knowledge.player['fixture.paid_prepared'],mode==='complete');
  assert.equal(p.state.simulation.knowledge.player['fixture.learned_procedure'].value,'A remembered procedure.');
  const amount=p.gameplay.player.inventory[cooked]||0;p=wait(p,3);assert.equal(p.gameplay.player.inventory[cooked]||0,amount);
 }
 for(const cancellation of ['none','typo'])assert.throws(()=>definePlaceActs({acts:[{...row,cancellation}]},{worldId:I.world,group:'book_lotm',situationId:I.situation}),/interruption policy/);
 const legacy={...row};delete legacy.cancellation;const original=definePlaceActs({acts:[legacy]},{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];assert.equal(original.cancellation,'refund');assert.equal(original.completionFailure,'refund');
});
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

test('a place visit holds itineraries by settled history without moving bodies or restoring forgotten knowledge',()=>{
 const p=setup(),visits={visits:[{arrival:'fixture.arrive',departure:'fixture.leave',participants:[stock]}]};
 assert.deepEqual([...placeActVisitors(p.state,visits)],[]);
 p.state.actors.player.completed['fixture.arrive']={cause:'fixture.arrived'};
 const before=JSON.stringify(p);assert.deepEqual([...placeActVisitors(p.state,visits)],[stock]);assert.equal(JSON.stringify(p),before);
 const restored=JSON.parse(before);assert.deepEqual([...placeActVisitors(restored.state,visits)],[stock]);
 restored.state.actors.player.completed['fixture.leave']={cause:'fixture.left'};
 assert.deepEqual([...placeActVisitors(restored.state,visits)],[]);
 assert.deepEqual([...placeActVisitors(p.state,{visits:[{arrival:'fixture.arrive',departure:null,continues:true,participants:[stock]}]})],[stock]);
 assert.deepEqual([...placeActVisitors(p.state,visits,stock)],[],'another actor does not inherit this visit');
 assert.throws(()=>placeActVisitors(p.state,{visits:[{arrival:'bad id'}]}),/Invalid place visit/);
});
test('all local recipients must be present at admission and settlement before testimony is delivered',()=>{
 let p=setup();p.state.simulation.people[stock].location=room;
 const row={id:'fixture.testimony',operation:'use',place:room,minutes:2,label:'Give an account',description:'Speak to the people here.',report:'You gave an account.',knowledgeKey:'fixture.spoken',participants:[stock],effects:[{type:'knowledge',actor:stock,key:'fixture.heard',stage:'seen',value:'The visitor reports a gap in memory.'}]};
 const d=definePlaceActs({acts:[row]},{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(d.id,d);
 let before=JSON.stringify(p);assert.equal(preview(p,d).eligible,true);assert.equal(JSON.stringify(p),before);
 p.state.simulation.people[stock].location=sink;before=JSON.stringify(p);assert.equal(preview(p,d).eligible,false);assert.throws(()=>commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence));assert.equal(JSON.stringify(p),before);
 p.state.simulation.people[stock].location=room;
 const started=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence);
 let interrupted={...p,...started};interrupted.state.simulation.people[stock].location=sink;interrupted=wait(interrupted,2);
 assert.equal(interrupted.state.simulation.knowledge[stock]?.['fixture.heard'],undefined);assert.equal(interrupted.state.simulation.knowledge.player?.['fixture.spoken'],undefined);
 p={...p,...commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence)};p=wait(p,2);
 assert.equal(p.state.simulation.knowledge[stock]['fixture.heard'].value,'The visitor reports a gap in memory.');assert.equal(p.state.simulation.knowledge.player['fixture.spoken'].value,row.report);
 assert.throws(()=>definePlaceActs({acts:[{...row,participants:[stock,stock]}]},{worldId:I.world,group:'book_lotm',situationId:I.situation}),/Invalid place act participants/);
});

test('native ingredient preparation conserves held inputs across completion, cancellation and lost support',()=>{
 const raw=JSON.stringify({id:'Potato'}),cooked=JSON.stringify({id:'Cooked potato'});
 const row={id:'fixture.cook',operation:'prepare',place:room,minutes:2,label:'Cook the potatoes',description:'Cook two held potatoes.',report:'Two cooked potatoes are ready.',knowledgeKey:'fixture.cooked',requires:eq('paid',true),
  costs:[{type:'item',actor:'player',key:raw,amount:-2}],effects:[{type:'item',actor:'player',key:cooked,amount:2}]};
 const local={...data,acts:[row]},d=definePlaceActs(local,{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(d.id,d);
 const ready=()=>{const p=setup();p.state.worlds[I.world].facts['fixture.paid']=true;p.gameplay.player.inventory[raw]=2;return p;};
 const begin=p=>({...p,...commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence)});
 for(const mode of ['complete','cancel','unsupported']){
  let p=begin(ready());assert.equal(p.gameplay.player.inventory[raw]||0,0);assert.equal(p.gameplay.player.inventory[cooked]||0,0);
  if(mode==='cancel')p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p),p.state.sequence)};
  else{if(mode==='unsupported')p.state.worlds[I.world].facts['fixture.paid']=false;p=wait(p,2);}
  assert.equal(p.gameplay.player.inventory[raw]||0,mode==='complete'?0:2);
  assert.equal(p.gameplay.player.inventory[cooked]||0,mode==='complete'?2:0);
  assert.equal(!!p.state.simulation.knowledge.player?.['fixture.cooked'],mode==='complete');
  const restored=JSON.parse(JSON.stringify(p));assert.equal(restored.gameplay.player.inventory[mode==='complete'?cooked:raw],2);
 }
 const missing=ready();missing.gameplay.player.inventory[raw]=1;const before=JSON.stringify(missing);
 assert.equal(preview(missing,d).eligible,false);assert.throws(()=>begin(missing));assert.equal(JSON.stringify(missing),before);
 assert.throws(()=>definePlaceActs({acts:[{...row,costs:[{type:'resource',actor:'player',key:'money',native:true,amount:-1}]}]},{worldId:I.world,group:'book_lotm',situationId:I.situation}),/held items or seeded/);
});

test('place sleep binds the player sleep owner and converted stock is not displayed twice',()=>{
 const row={id:'fixture.sleep',operation:'sleep',place:room,minutes:180,label:'Sleep',description:'Sleep here.',report:'You wake.',knowledgeKey:'fixture.slept'};
 const d=definePlaceActs({acts:[row]},{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];
 assert.equal(d.bodyCare.kind,'sleep');assert.equal(d.duration,180);
 assert.throws(()=>definePlaceActs({acts:[row]},{worldId:I.world,actorId:stock,group:'book_lotm',situationId:I.situation}),/sleep owner/);
 const p=setup(),views={stockViews:[{title:'Allocated food',knowledge:'fixture.bought',untilKnowledge:'fixture.converted',rows:[{actor:stock,key:'fixture.portions',label:'Portions'}]}]};
 assert.deepEqual(placeStockViews(p.state,views),[]);
 p.state.simulation.knowledge.player={'fixture.bought':{stage:'seen'}};assert.equal(placeStockViews(p.state,views).length,1);
 p.state.simulation.knowledge.player['fixture.converted']={stage:'seen'};assert.deepEqual(placeStockViews(p.state,views),[]);
 assert.equal(p.state.actors[stock].resources['fixture.portions'],2,'display filtering mutates no stock');
});

test('activity records show retained observations without publishing future text or restoring forgotten findings',()=>{
 const p=setup(),local={acts:[{id:'fixture.read',knowledgeKey:'fixture.finding',report:'A later edition rewrites this claim.'},{id:'fixture.future',knowledgeKey:'fixture.future',report:'Undiscovered content.'}]};
 p.state.actors.player.completed['fixture.read']={cause:'fixture.completed'};
 assert.deepEqual(placeActRecords(p.state,local),[],'completion is not current knowledge');
 p.state.simulation.knowledge.player={'fixture.finding':{stage:'seen',value:'The attributed finding you retained.',at:7}};
 const before=JSON.stringify(p);assert.deepEqual(placeActRecords(p.state,local),[{id:'fixture.finding',text:'The attributed finding you retained.',at:7}]);
 assert.equal(JSON.stringify(p),before,'reading grants nothing and changes no receipt');assert.deepEqual(placeActRecords(p.state,local,stock),[],'another actor does not inherit the finding');
 delete p.state.simulation.knowledge.player['fixture.finding'];assert.deepEqual(placeActRecords(p.state,local),[],'the source pack does not reconstruct forgotten content');
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

test('unobserved source detail stays absent while a visible action can explain an ordinary blocker',()=>{
 const p=setup(),hidden={id:'fixture.discovered',operation:'inspect',place:room,minutes:1,label:'Inspect an observed object',description:'A locally observed object.',report:'You inspect it.',knowledgeKey:'fixture.discovered.result',
  visibleWhen:{all:[{fact:'knowledge.fixture.object.seen',op:'eq',value:true},eq('scene_visible',true)]},requires:{all:[eq('lit',true)]},publicReasons:true};
 const local={acts:[hidden]},d=definePlaceActs(local,{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];
 registry.simulation.commands.set(d.id,d);
 const offers=()=>quotePlaceActs(p.state,[d],local,x=>preview(p,x),{facts:x=>simulationFacts(p.state,ctx(p),registry,[x.requires])});
 p.state.worlds[I.world].facts['fixture.scene_visible']=true;
 assert.deepEqual(offers(),[]);assert.equal(preview(p,d).visible,false);
 assert.throws(()=>commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence));
 p.state.simulation.knowledge.player||={};p.state.simulation.knowledge.player['fixture.object']={stage:'seen',value:'A remembered observation.',at:p.state.clock,cause:'fixture.observation'};
 let offer=offers()[0];assert.ok(offer);assert.equal(offer.eligible,false);assert.deepEqual(offer.reasons,['Check lit first.']);
 delete p.state.worlds[I.world].facts['fixture.lit'];offer=offers()[0];assert.ok(!offer.reasons.includes('Check lit first.'),'an unknown fact is not disclosed as a known failure');
 p.state.worlds[I.world].facts['fixture.lit']=true;offer=offers()[0];assert.equal(offer.eligible,true);
 const started=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p),p.state.sequence);
 started.state.worlds[I.world].facts['fixture.scene_visible']=false;
 const done=wait({...p,...started},1);
 assert.equal(done.state.simulation.knowledge.player['fixture.discovered.result'].value,'You inspect it.');
 assert.equal(settlePlaceActReports(done.state,local,I.world)[0].text,'You inspect it.');
 const reloaded=JSON.parse(JSON.stringify(done));assert.equal(reloaded.state.simulation.knowledge.player['fixture.discovered.result'].value,'You inspect it.');
 p.state.worlds[I.world].facts['fixture.scene_visible']=false;assert.deepEqual(offers(),[]);
});

test('be-seat native pending and settled acts survive save, reload, export and import', {timeout:300000}, async t=>{
 // Run the real native save owner in a disposable copy, with a synthetic cast pack.
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
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as h1CastReady} from './book_world_lotm_cast_days.js';\nexport const h1EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const h1Validate=save=>validateSaveEnvelope(save,game_version);\nexport const h1Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\nexport const h1PrepareReal=(place,key,value)=>{expansionState.simulation.people.player.location=place;expansionState.worlds['book.lotm.tingen'].facts[key]=value;};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[0].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 let pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other'],history:[],relations:[],intentions:[],untakenChoices:[]},
  householdActs:{schema:1,objects:[{id:'fixture.box',facts:{'fixture.box.seen':false,'fixture.existing':7}}],acts:[{id:'book.lotm.fixture_inspect',operation:'inspect',place:'fixture.place.other',minutes:1,label:'Inspect the box',description:'Look over the box.',report:'You inspect the box.',knowledgeKey:'fixture.inspection',requires:{fact:'world.fixture.box.seen',op:'eq',value:false,reason:'Already inspected.'},effects:[{type:'fact',scope:'world',key:'fixture.box.seen',value:true}],costs:[],costLabel:'no stock spent'}]}};
 // H2: the same native validator/save route admits every new operation.
 pack.householdActs.objects.push({id:'fixture.stock',resources:[{actor:'player',key:'fixture.grain',amount:2},{actor:'player',key:'fixture.meal',amount:0}],facts:{'fixture.clock':'07:15'},actorFacts:[{actor:'player',key:'fixture.owned',value:true},{actor:'player',key:'fixture.awake',value:false}]});
 const operations=[['read',{}],['prepare',{costs:[{type:'resource',actor:'player',key:'fixture.grain',amount:-1}],effects:[{type:'resource',actor:'player',key:'fixture.meal',amount:1}]}],['wake',{awakeFact:'fixture.awake'}],['check time',{clock:{fact:'fixture.clock',value:'07:15'}}],['sit',{}],['secure',{objectId:'fixture.stock',secure:{ownedFact:'fixture.owned',custodyFact:'fixture.custody',concealedFact:'fixture.concealed',container:'fixture.drawer'}}],['wait here',{}]];
 pack.householdActs.acts.push(...operations.map(([operation,extra],i)=>({id:`fixture.operation_${i}`,operation,place:'fixture.place.other',minutes:1,label:operation,description:`${operation} at home.`,report:`You finish ${operation}.`,knowledgeKey:`fixture.operation.${i}`,...extra})));
 // Optional private-data repro: the command and its seeded object are copied
 // verbatim into the disposable synthetic pack. No private text enters this file.
 let realRow=null;
 if(process.env.H2_REAL_ACT_ID){
  const source=JSON.parse(await readFile(join(root,'private_packs/lotm-cast/cast.json'),'utf8'));
  realRow=source.householdActs.acts.find(r=>r.id===process.env.H2_REAL_ACT_ID);
  assert.ok(realRow,'Requested live-pack act exists');
  const object=source.householdActs.objects.find(o=>o.id===realRow.objectId);
  assert.ok(object,'Requested live-pack object exists');
  if(process.env.H2_REAL_FULL)pack=source;
  else {
   pack.householdActs.objects.push(object);pack.householdActs.acts.push(realRow);
   pack.places.push({id:realRow.place,indexId:'fixture.place.real',name:'Room',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence});
   pack.leadLife.profile.start=realRow.place;pack.leadLife.knownPlaces.push(realRow.place);
   for(const act of pack.householdActs.acts)if(act.id!==realRow.id)act.place=realRow.place;
  }
 }
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const worker=join(dir,'h1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
import {writeFileSync,appendFileSync} from 'node:fs';
const progress=stage=>{if(${Boolean(process.env.H2_REAL_FULL)})appendFileSync('/tmp/h2-real-progress',stage+'\\n');};
if(${Boolean(process.env.H2_REAL_FULL)})writeFileSync('/tmp/h2-real-progress','');
progress('boot');
const g=await boot(null,{seed:37,heroName:null});
try {
 progress('cast ready');await g.module.h1CastReady();progress('enroll');g.module.h1EnrollBe();progress('enrolled');
 const initial=JSON.parse(g.internals.create_save());
 assert.equal(initial.expansion.lotm.entryProfile,'book.lead.be@1');
 let saved;
 // Optional exact private row repro at its real place with an explicit fixture precondition.
 if(${JSON.stringify(realRow)}!==null){
  const real=${JSON.stringify(realRow)};
  g.module.h1PrepareReal(real.place,real.requires.fact.slice('world.'.length),real.requires.value);
  const button=g.document.querySelector('[data-lotm=\"'+real.id+'\"]');
  const was={disabled:button?.disabled,title:button?.title};
  progress('act');g.module.h1Act(real.id);progress('save pending');saved=await g.save();progress('pending saved');
  assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId===real.id),'real row starts: '+g.lastLog()+' errors='+JSON.stringify(g.errors)+' blocked='+g.internals.foundationSaveBlocked+' jobs='+JSON.stringify(saved.expansion.simulation.jobs.map(j=>j.commandId))+' offer='+JSON.stringify(was)+' notice='+g.document.querySelector('#lotm_panel [role=\"status\"]')?.textContent);
  progress('settle');await g.step(real.minutes+1);progress('settled');
  assert.equal(g.internals.foundationSaveBlocked,false,'real row must not block saving: '+g.lastLog()+' '+JSON.stringify(g.errors));
  saved=await g.save();g.module.h1Validate(saved);
  for(const effect of real.effects)assert.equal(saved.expansion.worlds['book.lotm.tingen'].facts[effect.key],effect.value);
  progress('reload');await g.reload();progress('export');const actualExport=await g.exportFile();progress('import');await g.importFile(actualExport);progress('imported');saved=await g.save();
  for(const effect of real.effects)assert.equal(saved.expansion.worlds['book.lotm.tingen'].facts[effect.key],effect.value);
  g.module.h1PrepareReal(real.place,real.requires.fact.slice('world.'.length),real.requires.value);
 }
 if(!${Boolean(process.env.H2_REAL_FULL)}){
 g.module.h1Act('book.lotm.fixture_inspect');
 assert.equal(g.internals.foundationSaveBlocked,false,'act must durably admit the pending job');
 saved=await g.save();assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='book.lotm.fixture_inspect'));
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
  const id='fixture.operation_'+i;g.module.h1Act(id);
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
 }
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native save fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});

test('separate supported contact binds the actual guide and sleeping anchor without physical travel or private disclosure',t=>{
 const guide=I.member;
 const row={id:'fixture.guided_sleep',operation:'sleep',place:room,minutes:2,label:'Sleep until interrupted',description:'Sleep in this bed.',report:'You wake with a remembered experience.',knowledgeKey:'fixture.dream.wake',targetId:guide,contact:{place:sink},effects:[{type:'knowledge',actor:guide,key:'fixture.heard.account',stage:'seen',value:'The sleeper reports a gap in memory.'},{type:'knowledge',actor:'player',key:'fixture.dream.trace',stage:'seen',value:'In the experience, an apparent journey ended back at the bed.'}]};
 const local={acts:[row]},d=definePlaceActs(local,{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(d.id,d);castObjectCommands.push(d);t.after(()=>castObjectCommands.splice(castObjectCommands.indexOf(d),1));
 function ready(){const p=setup();p.state.simulation.people[guide].location=sink;p.state.simulation.people[guide].body={...p.state.simulation.people[guide].body,ownerId:guide,controllerId:guide};return p;}
 const begin=p=>({...p,...commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,guide),p.state.sequence)});
 for(const mode of ['complete','lost-guide','lost-control','lost-anchor','cancel']){
  let p=ready();assert.equal(previewSimulationCommand(p.state,registry,d.id,ctx(p,guide)).eligible,true);
  const inv=structuredClone(p.gameplay);p=begin(p);assert.equal(validateLotmState(p.state),true);
  if(mode==='cancel')p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p,guide),p.state.sequence)};
  else{if(mode==='lost-guide')p.state.simulation.people[guide].location=room;if(mode==='lost-control')p.state.simulation.people[guide].body.controllerId='player';if(mode==='lost-anchor')p.state.simulation.people.player.location=sink;p=wait(p,2);}
  assert.equal(!!p.state.simulation.knowledge.player?.['fixture.dream.trace'],mode==='complete');assert.equal(!!p.state.simulation.knowledge[guide]?.['fixture.heard.account'],mode==='complete');assert.deepEqual(p.gameplay,inv);
  assert.equal(p.state.simulation.people.player.location,mode==='lost-anchor'?sink:room);assert.equal(p.state.simulation.knowledge[guide]?.['fixture.private'],undefined);
 }
 assert.throws(()=>definePlaceActs({acts:[{...row,targetId:null}]},{worldId:I.world,group:'book_lotm',situationId:I.situation}),/Separate contact/);
});
test('folded observations expose retained recipient-owned records, without materializing the current pack or another recipient’s account',()=>{
 const p=setup(),local={acts:[{id:'fixture.fold',knowledgeKey:'fixture.fold.result',effects:[{type:'knowledge',actor:'player',key:'fixture.fold.detail'},{type:'knowledge',actor:stock,key:'fixture.fold.private'}]}]};
 p.state.simulation.knowledge.player={'fixture.fold.detail':{value:'The remembered apparent event.',at:4}};p.state.simulation.knowledge[stock]={'fixture.fold.private':{value:'The actual recipient account.',at:4}};
 assert.deepEqual(placeActRecords(p.state,local),[{id:'fixture.fold.detail',text:'The remembered apparent event.',at:4}]);
 delete p.state.simulation.knowledge.player['fixture.fold.detail'];assert.deepEqual(placeActRecords(p.state,local),[]);
 assert.deepEqual(placeActRecords(p.state,local,stock),[{id:'fixture.fold.private',text:'The actual recipient account.',at:4}]);
});
