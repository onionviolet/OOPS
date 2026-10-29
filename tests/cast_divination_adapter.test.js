import test from 'node:test';
import assert from 'node:assert/strict';
import {defineDivinations,quoteDivinations,pendingDivinationReports,settleDivinationReports} from '../src/cast_divination_adapter.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob,simulationFacts} from '../src/simulation.js';
const eq=(fact,value,reason='Use the prepared means.')=>({fact,op:'eq',value,reason});
const room='fixture.room',world=I.world;
// Synthetic row schema/example for pack.divinations. Signal is an observation;
// belief is separately attributed inference. Neither field asserts world truth.
export const exampleQuery={id:'fixture.query',targetId:'fixture.sample',question:'Which sample should be set aside?',method:'A held pointer',label:'Test a sample',description:'Prepare a pointer, trace the rite, ask and interpret.',place:room,
 means:eq('actor.fixture.instrument',true),contact:eq('actor.fixture.contact',true,'Bring the sample within reach.'),
 ritual:{id:'fixture.rite',world:'fixture',formula:'fixture.pointer',scale:'small',label:'A pointer rite',conditions:[
  {id:'fixture.still',label:'A still surface',principle:{id:'fixture.support',text:'Keep the pointer steady.',wants:{functional:['steady']}},exact:{rule:eq('actor.fixture.still',true),text:'A still table'},substitutes:[{id:'fixture.clamp',rule:eq('actor.fixture.clamp',true),tags:{functional:['steady']},text:'A clamped support'}]}]},
 dial:{floor:0.5,baseOdds:0,maxOdds:0,recoveryDays:0,status:'ORIGINAL',why:'Synthetic supported signal, no random accuracy model.'},
 steps:[
  {id:'prepare',kind:'prepare',label:'Prepare the pointer',description:'Place the held pointer over the sample.',minutes:1,report:'You prepared the pointer.'},
  {id:'trace',kind:'rite',label:'Trace the first mark',description:'Trace a mark before the question.',minutes:1,report:'You traced the mark.'},
  {id:'turn',kind:'rite',label:'Turn the pointer',description:'Turn after tracing the mark.',minutes:1,report:'You turned the pointer.'},
  {id:'ask',kind:'attempt',label:'Ask the question',description:'Spend one coin and observe the pointer.',minutes:2,costs:[{type:'resource',actor:'player',key:'money',native:true,amount:-1}],status:'signal',signal:'The pointer leans left.',report:'You watched the pointer lean left.'},
  {id:'interpret',kind:'interpret',label:'Interpret the signal',description:'Record your reading as a belief.',minutes:1,belief:'I believe the left sample is safe.',report:'You recorded a tentative reading.'}
 ]};
const binding={worldId:world,group:'book_lotm',situationId:I.situation};
const obscured=structuredClone(exampleQuery);obscured.id='fixture.obscured';obscured.steps[3].status='obscured';obscured.steps[3].signal='The pointer cannot be read.';obscured.steps[3].report='You received no clear answer.';obscured.steps[4].belief='I cannot conclude which sample is safe.';
const commands=defineDivinations({queries:[exampleQuery,obscured]},binding);
const consumer={id:'fixture.use',revision:1,label:'Set the sample aside',actorId:'player',worldId:world,duration:1,group:'book_lotm',requires:{all:[eq('actor.divination.fixture.query.phase','interpret'),eq('knowledge.divination.fixture.query.interpretation.value',exampleQuery.steps[4].belief)]},effects:[{type:'fact',scope:'actor',actor:'player',key:'fixture.sample.setAside',value:true}]};
const defs=createSimulationRegistry({commands:[...commands,consumer]});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh(5);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;Object.assign(p.state.actors.player.facts,{'fixture.instrument':true,'fixture.contact':true,'fixture.still':true,'fixture.sample.safe':false});return p;}
const def=id=>registry.simulation.commands.get(id);
const preview=(p,id)=>previewSimulationCommand(p.state,registry,id,ctx(p));
const start=(p,id)=>({...p,...commitSimulationCommand(p.state,registry,{id},ctx(p),p.state.sequence)});
const doStep=(p,id)=>wait(start(p,id),def(id).duration);
const prepared=(p=setup(),prefix='fixture.query')=>['prepare','trace','turn'].reduce((p,id)=>doStep(p,`${prefix}.${id}`),p);
test('preview is pure and observer safe; absent packs stay silent',()=>{
 const p=setup(),before=JSON.stringify(p),seed=p.state.simulation.seed;
 for(let i=0;i<3;i++){
  const q=quoteDivinations(p.state,commands,d=>preview(p,d.id),{facts:()=>simulationFacts(p.state,ctx(p),registry)});assert.equal(q.length,10);assert.equal(q[0].grade,'met');
  const s=JSON.stringify(q);assert.ok(!s.includes('leans left'));assert.ok(!s.includes('left sample is safe'));assert.ok(!s.includes('"effects"'));assert.match(q[3].costText,/-1/);
 }
 assert.equal(JSON.stringify(p),before);assert.equal(p.state.simulation.seed,seed);
 assert.deepEqual(defineDivinations(undefined,binding),[]);assert.deepEqual(quoteDivinations(p.state,[],()=>assert.fail()),[]);
});
test('ordered support, actual payment, frozen attempt identity and a consumed misreading',()=>{
 let p=setup();assert.equal(preview(p,'fixture.query.turn').eligible,false);assert.equal(preview(p,consumer.id).eligible,false);
 p=prepared(p);const seed=p.state.simulation.seed,before=JSON.stringify(p);p=start(p,'fixture.query.ask');
 assert.equal(p.external.money,4);const job=p.state.simulation.jobs.at(-1);assert.equal(job.commandId,'fixture.query.ask');const frozen=JSON.stringify(job);
 for(let i=0;i<3;i++)quoteDivinations(p.state,commands,d=>preview(p,d.id),{facts:()=>simulationFacts(p.state,ctx(p),registry)});assert.equal(JSON.stringify(p.state.simulation.jobs.at(-1)),frozen);
 assert.notEqual(JSON.stringify(p),before);assert.equal(p.state.simulation.knowledge.player?.['divination.fixture.query.signal'],undefined);
 p=wait(p,2);const signal=p.state.simulation.knowledge.player['divination.fixture.query.signal'];assert.equal(signal.cause,job.id);assert.equal(signal.basis.targetId,'fixture.sample');assert.equal(p.state.simulation.seed,seed);
 assert.equal(pendingDivinationReports(p.state,commands,world),true);assert.equal(settleDivinationReports(p.state,commands,world).length,4);assert.deepEqual(settleDivinationReports(p.state,commands,world),[]);
 p=doStep(p,'fixture.query.interpret');const belief=p.state.simulation.knowledge.player['divination.fixture.query.interpretation'];assert.equal(belief.stage,'interpreted');assert.equal(belief.basis.kind,'inference');assert.deepEqual(belief.basis.evidence,['divination.fixture.query.signal']);
 assert.equal(p.state.actors.player.facts['fixture.sample.safe'],false,'misreading leaves truth untouched');assert.equal(preview(p,consumer.id).eligible,true);p=doStep(p,consumer.id);assert.equal(p.state.actors.player.facts['fixture.sample.setAside'],true);
 for(const [actor,k] of Object.entries(p.state.simulation.knowledge))if(actor!=='player')assert.equal(k['divination.fixture.query.signal'],undefined);
 validateSimulationState(p.state.simulation,p.state,registry.simulation);
 // Repeating a sourced episode has a fresh native cause and charges again.
 p=prepared(p);assert.equal(preview(p,consumer.id).eligible,false,'old belief cannot bypass the new ordered phase');p=wait(start(p,'fixture.query.ask'),2);assert.equal(p.external.money,3);assert.notEqual(p.state.simulation.knowledge.player['divination.fixture.query.signal'].cause,signal.cause);
});
test('obscured attempt pays without an answer; stale means and interrupted support conserve stock',()=>{
 let p=prepared(setup(),'fixture.obscured');p=doStep(p,'fixture.obscured.ask');assert.equal(p.external.money,4);assert.equal(p.state.simulation.knowledge.player['divination.fixture.obscured.signal'].basis.status,'obscured');assert.equal(preview(p,consumer.id).eligible,false);
 p=prepared();p.state.actors.player.facts['fixture.instrument']=false;const before=JSON.stringify(p);assert.throws(()=>start(p,'fixture.query.ask'));assert.equal(JSON.stringify(p),before);
 p=prepared();p=start(p,'fixture.query.ask');p.state.actors.player.facts['fixture.contact']=false;p=wait(p,2);assert.equal(p.external.money,5);assert.equal(p.state.simulation.knowledge.player?.['divination.fixture.query.signal'],undefined);
 p=prepared();p=start(p,'fixture.query.ask');p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p),p.state.sequence)};assert.equal(p.external.money,5);
 p=setup();delete p.state.actors.player.facts['fixture.still'];assert.equal(preview(p,'fixture.query.prepare').eligible,false);p.state.actors.player.facts['fixture.clamp']=true;assert.equal(preview(p,'fixture.query.prepare').eligible,true);
});
test('row validation rejects missing means, unsupported effects, stages and unpaid attempts',()=>{
 for(const change of [r=>delete r.means,r=>delete r.contact,r=>r.steps[1].kind='relocate',r=>r.steps[3].costs=[],r=>delete r.steps[3].signal,r=>r.steps[1].id='prepare',r=>r.steps[0].minutes=0,r=>r.steps[1].effects=[{type:'relocate'}],r=>r.recipients=['fixture.other'],r=>r.steps[3].costs[0].amount=1]){const r=structuredClone(exampleQuery);change(r);assert.throws(()=>defineDivinations({queries:[r]},binding));}
 const before=structuredClone(exampleQuery);defineDivinations({queries:[exampleQuery]},binding);assert.deepEqual(exampleQuery,before);
});

test('live or prepared integration crosses native UI and real save validator in a disposable copy',{timeout:180000},async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-dv1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const integrationPatch=resolve(root,'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/DV1_INTEGRATION.patch');
 let integrated=false;
 try{await exec('git',['apply','-R','--check',integrationPatch],{cwd:dir});integrated=true;}catch{}
 if(!integrated){await exec('git',['apply','--check',integrationPatch],{cwd:dir});await exec('git',['apply',integrationPatch],{cwd:dir});}
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as dv1CastReady} from './book_world_lotm_cast_days.js';\nexport const dv1EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const dv1Validate=save=>validateSaveEnvelope(save,game_version);\nexport const dv1Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[1].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other'],history:[],relations:[],intentions:[],untakenChoices:[]},
  topicTalks:{talks:[{id:'fixture.consumer',personId:people[1].id,topicId:'fixture.use',label:'Use the reading',description:'Ask where to set the sample aside after interpreting.',minutes:1,requires:{all:[eq('actor.divination.fixture.query.phase','interpret'),eq('knowledge.divination.fixture.query.interpretation.value',exampleQuery.steps[4].belief)]},choices:[{id:'ask',label:'Discuss the reading',report:'You used the reading to ask a further question.',effects:[]}]}]}};
 const row=structuredClone(exampleQuery);row.place='fixture.place.other';pack.divinations={queries:[row]};


 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));

 await exec('npm',['run','build'],{cwd:dir,env:{...process.env,BUILD_OUT:join(dir,'candidate')},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');t.diagnostic('Disposable integrated build SHA-256: '+createHash('sha256').update(await readFile(join(dir,'candidate/dist/bundle.js'))).digest('hex'));
 const arch=await exec('npm',['run','check:arch'],{cwd:dir,timeout:60000,maxBuffer:1024*1024});t.diagnostic(arch.stdout.trim());
 const worker=join(dir,'dv1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.dv1CastReady();g.module.dv1EnrollBe();
 let initial=JSON.parse(g.internals.create_save());
 assert.ok(!Object.keys(initial.expansion.actors.player.facts).some(k=>k.startsWith('divination.')),'unused mechanism adds no seeded progress');
 Object.assign(initial.expansion.actors.player.facts,{'fixture.instrument':true,'fixture.contact':true,'fixture.still':true,'fixture.sample.safe':false});
 initial.expansion.simulation.knowledge.player||={};
 initial.expansion.simulation.knowledge.player['book.lotm.cast.known.fixture.person.relative']={stage:'seen',value:'You know this person.',at:initial.expansion.clock,cause:'fixture.setup'};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.ok(button('fixture.query.prepare'),'rite is reachable through native place UI');
 assert.equal(document.querySelector('[data-lotm-divinations]').dataset.perspective,'player');
 assert.equal(button('fixture.query.ask').disabled,true,'preparation and order are required');
 assert.equal(button('fixture.consumer.ask').disabled,true,'interpretation consumer starts locked');
 assert.ok(!document.querySelector('[data-lotm-divinations]').textContent.includes('The pointer leans left.'),'future signal hidden');
 for(const id of ['prepare','trace','turn']){g.module.dv1Act('fixture.query.'+id);await g.step(2);}
 const before=await g.save(),money=before.character.money;
 assert.equal(button('fixture.query.ask').disabled,false);
 g.module.dv1Act('fixture.query.ask');
 assert.equal(g.internals.foundationSaveBlocked,false);
 let saved=await g.save();const job=saved.expansion.simulation.jobs.find(j=>j.commandId==='fixture.query.ask');assert.ok(job,'native pending rite saves');
 const bad=structuredClone(saved);bad.expansion.simulation.jobs.find(j=>j.commandId==='fixture.query.ask').effects[2].value='Altered';assert.throws(()=>g.module.dv1Validate(bad),/exact admitted definition/);
 const badSupport=structuredClone(saved);badSupport.expansion.simulation.jobs.find(j=>j.commandId==='fixture.query.ask').completionSupport.requires={all:[]};assert.throws(()=>g.module.dv1Validate(badSupport),/Rite support differs/);
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false);const pending=await g.save();assert.equal(pending.expansion.simulation.jobs.find(j=>j.commandId==='fixture.query.ask').id,job.id);
 const pendingExport=await g.exportFile();await g.importFile(pendingExport);await g.step(3);
 saved=await g.save();const k=saved.expansion.simulation.knowledge.player['divination.fixture.query.signal'];assert.equal(k.value,'The pointer leans left.');assert.equal(k.cause,job.id);assert.equal(saved.character.money,money-1);
 assert.equal(saved.expansion.actors.player.facts['fixture.sample.safe'],false);
 assert.ok(document.querySelector('[data-lotm-divinations]').textContent.includes('The pointer leans left.'));
 g.module.dv1Act('fixture.query.interpret');await g.step(2);
 assert.equal(button('fixture.consumer.ask').disabled,false,'native topic consumer reads interpreted evidence');
 g.module.dv1Act('fixture.consumer.ask');await g.step(2);
 await g.reload();const exported=await g.exportFile();await g.importFile(exported);const after=await g.save();
 assert.equal(after.expansion.simulation.knowledge.player['divination.fixture.query.interpretation'].stage,'interpreted');
 assert.equal(after.expansion.simulation.knowledge.player['topic.talk.fixture.consumer.ask'].value,'You used the reading to ask a further question.');
 assert.equal(after.expansion.simulation.knowledge['fixture.person.relative']?.['divination.fixture.query.signal'],undefined,'other actor did not receive private signal');
 assert.equal(after.character.money,money-1,'no refund or second charge on reload/import');
 assert.deepEqual(g.errors,[]);
 process.stdout.write('native ordered rite, paid attempt, pending/settled Save/reload/Export/Import, support/effect tamper: PASS');
} finally {g.close();}
 `);
 const {stdout}=await exec(process.execPath,['--max-old-space-size=8192',worker],{cwd:dir,timeout:170000,maxBuffer:1024*1024});
 assert.match(stdout,/tamper: PASS/);
});
