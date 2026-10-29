import test from 'node:test';
import assert from 'node:assert/strict';
import {defineInferences,quoteInferences,pendingInferenceReports,settleInferenceReports} from '../src/cast_inference_adapter.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
const eq=(fact,value,reason='The supporting condition is missing.')=>({fact,op:'eq',value,reason});
const room='fixture.room';
// Synthetic pack.inferences schema. Evidence is held by this observer, never a
// query into world truth. Reports and uncertainty are private-pack authored data.
export const exampleChain={id:'fixture.thought',label:'Consider a sample',description:'Recall a fragment, form a belief and choose a next step.',place:room,steps:[
 {id:'recall',kind:'recall',label:'Recall the note',description:'Review the fragment you remember.',minutes:1,report:'I remember part of a note about the left sample.',evidence:[{key:'fixture.memory',value:'A fragment mentions the left sample.'}]},
 {id:'infer',kind:'infer',label:'Consider the fragment',description:'Form a tentative belief from your recollection.',minutes:1,report:'I think the left sample may be safe.',uncertainty:'The remembered note is incomplete.',evidence:[{key:'inference.fixture.thought.recall',value:'I remember part of a note about the left sample.'}]},
 {id:'intend',kind:'intend',label:'Plan a question',description:'Plan to ask about the sample before using it.',minutes:1,report:'I intend to ask about the left sample.',evidence:[{key:'inference.fixture.thought.infer',value:'I think the left sample may be safe.'}]},
 {id:'postpone',kind:'postpone',label:'Postpone the question',description:'Put the question aside until ready.',minutes:1,report:'I postponed asking about the sample.'},
 {id:'resume',kind:'resume',label:'Resume the question',description:'Return to the postponed question.',minutes:1,report:'I returned to the question.'},
 {id:'cancel',kind:'cancel',label:'Cancel the plan',description:'Choose to abandon the question.',minutes:1,report:'I abandoned the question.'}
]};
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
const commands=defineInferences({chains:[exampleChain]},binding);
const gate={all:[eq('actor.inference.fixture.thought.intention','active','Choose to ask first.'),eq('knowledge.inference.fixture.thought.infer.value',exampleChain.steps[1].report,'Consider the evidence first.')]};
const consumer={id:'fixture.use',revision:1,label:'Ask about the sample',worldId:I.world,actorId:'player',group:'book_lotm',duration:1,requires:gate,completionRequires:gate,cancellation:'refund',completionFailure:'refund',effects:[{type:'fact',scope:'actor',actor:'player',key:'fixture.questionAsked',value:true}]};
const defs=createSimulationRegistry({commands:[...commands,consumer]});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh(5);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;p.state.actors.player.facts['fixture.sample.safe']=false;return p;}
function memory(p){p.state.simulation.knowledge.player||={};p.state.simulation.knowledge.player['fixture.memory']={stage:'seen',value:'A fragment mentions the left sample.',at:p.state.clock,cause:'fixture.memory',basis:{kind:'recollection',attributedTo:'player',situationId:I.situation}};return p;}
const preview=(p,id)=>previewSimulationCommand(p.state,registry,id,ctx(p));
const start=(p,id)=>({...p,...commitSimulationCommand(p.state,registry,{id},ctx(p),p.state.sequence)});
const step=(p,id)=>wait(start(p,id),registry.simulation.commands.get(id).duration);
const think=(p=memory(setup()))=>['recall','infer','intend'].reduce((p,id)=>step(p,'fixture.thought.'+id),p);
test('absent rows are silent; preview has no early belief, truth, mutation or draw',()=>{
 const p=setup(),before=JSON.stringify(p);
 assert.deepEqual(defineInferences(undefined,binding),[]);assert.deepEqual(quoteInferences(p.state,[],()=>assert.fail()),[]);
 for(let i=0;i<3;i++){
  const q=quoteInferences(p.state,commands,d=>preview(p,d.id));assert.equal(q.length,6);assert.equal(q[0].eligible,false);
  assert.ok(!JSON.stringify(q).includes(exampleChain.steps[1].report));assert.ok(!JSON.stringify(q).includes('fixture.sample.safe'));assert.ok(!JSON.stringify(q).includes('"effects"'));
 }
 assert.equal(JSON.stringify(p),before);assert.throws(()=>start(p,'fixture.thought.recall'));
});
test('recollection to belief to intention drives an actual gate without changing truth or another observer',()=>{
 let p=memory(setup());const seed=p.state.simulation.seed;
 assert.equal(preview(p,consumer.id).eligible,false);assert.equal(preview(p,'fixture.thought.infer').eligible,false);
 p=start(p,'fixture.thought.recall');assert.equal(p.state.simulation.knowledge.player['inference.fixture.thought.recall'],undefined);p=wait(p,1);
 p=step(p,'fixture.thought.infer');assert.equal(preview(p,consumer.id).eligible,false);
 const belief=p.state.simulation.knowledge.player['inference.fixture.thought.infer'];assert.equal(belief.stage,'interpreted');assert.equal(belief.basis.kind,'inference');assert.equal(belief.basis.uncertainty,exampleChain.steps[1].uncertainty);
 assert.equal(p.state.simulation.knowledge.player['inference.fixture.thought.recall'].basis.kind,'recollection');
 p=step(p,'fixture.thought.intend');assert.equal(preview(p,consumer.id).eligible,true);p=step(p,consumer.id);assert.equal(p.state.actors.player.facts['fixture.questionAsked'],true);
 assert.equal(p.state.actors.player.facts['fixture.sample.safe'],false);assert.equal(p.state.simulation.seed,seed);assert.equal(p.external.money,5);
 for(const [actor,k] of Object.entries(p.state.simulation.knowledge))if(actor!=='player')assert.equal(k['inference.fixture.thought.infer'],undefined);
 assert.equal(pendingInferenceReports(p.state,commands,I.world),true);assert.equal(settleInferenceReports(p.state,commands,I.world).length,3);assert.deepEqual(settleInferenceReports(p.state,commands,I.world),[]);
 validateSimulationState(p.state.simulation,p.state,registry.simulation);
});
test('postponement, cancellation, reconsideration and interrupted thoughts preserve their consequences',()=>{
 let postponed=step(think(),'fixture.thought.postpone');postponed=step(postponed,'fixture.thought.cancel');assert.equal(preview(postponed,consumer.id).eligible,false);assert.equal(postponed.state.actors.player.facts['inference.fixture.thought.intention'],'cancelled');
 let p=think();p=step(p,'fixture.thought.postpone');assert.equal(preview(p,consumer.id).eligible,false);p=step(p,'fixture.thought.resume');assert.equal(preview(p,consumer.id).eligible,true);
 p=step(p,'fixture.thought.cancel');assert.equal(preview(p,consumer.id).eligible,false);assert.equal(preview(p,'fixture.thought.resume').eligible,false);
 p=step(p,'fixture.thought.recall');assert.equal(preview(p,consumer.id).eligible,false,'reconsidering invalidates an old intention');p=step(p,'fixture.thought.infer');p=step(p,'fixture.thought.intend');assert.equal(preview(p,consumer.id).eligible,true);
 p=memory(setup());p=start(p,'fixture.thought.recall');delete p.state.simulation.knowledge.player['fixture.memory'];p=wait(p,1);assert.equal(p.state.simulation.knowledge.player['inference.fixture.thought.recall'],undefined);
 p=memory(setup());p=start(p,'fixture.thought.recall');p={...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p),p.state.sequence)};assert.equal(p.state.simulation.knowledge.player['inference.fixture.thought.recall'],undefined);assert.equal(p.external.money,5);
});
test('supported text and testimony preserve source attribution; malformed/ownerless rows are rejected by adapter or registry',()=>{
 for(const kind of ['read','testimony']){
  const row=structuredClone(exampleChain);row.steps[0].kind=kind;row.steps[0].sourceId='fixture.note';row.steps[0].requires={all:[eq('actor.fixture.textHeld',true),eq('actor.fixture.comprehends',true)]};
  const ds=defineInferences({chains:[row]},binding);createSimulationRegistry({commands:JSON.parse(JSON.stringify(ds))});
  for(const d of ds)registry.simulation.commands.set(d.id,d);
  let p=memory(setup());assert.equal(preview(p,ds[0].id).eligible,false);Object.assign(p.state.actors.player.facts,{'fixture.textHeld':true,'fixture.comprehends':true});p=step(p,ds[0].id);
  assert.equal(p.state.simulation.knowledge.player[ds[0].inference.receiptKey].basis.sourceId,'fixture.note');
 }
 for(const d of commands)registry.simulation.commands.set(d.id,d);
 for(const change of [r=>r.steps[0].evidence=[],r=>delete r.steps[1].uncertainty,r=>r.steps[0].kind='relocate',r=>r.steps[0].minutes=0,r=>r.steps[0].effects=[{type:'fact'}],r=>r.steps[0].sourceId=undefined,r=>r.steps[0].requires={all:[]},r=>r.steps[0].requires=false,r=>r.steps[0].kind='intend',r=>r.steps[0].kind='read']){
  const row=structuredClone(exampleChain);change(row);assert.throws(()=>createSimulationRegistry({commands:defineInferences({chains:[row]},binding)}));
 }
 assert.deepEqual(JSON.parse(JSON.stringify(commands)),commands,'definitions have no undefined fields');
});

const directChains=['recalled','witnessed'].map((basis,i)=>({id:`fixture.direct.${basis}`,label:'Consider what you know',description:'Consider your own recollection or perception.',place:room,steps:[
 {id:'think',kind:'infer',label:'Consider the fragment',description:'Form a tentative belief.',minutes:1,report:'I think the fragment warrants caution.',uncertainty:'A fragment is incomplete.',
  observation:{basis,actor:'player',value:'I recall or see a fragment.'}}]}));
const postponedChain={id:'fixture.direct.plan',label:'Defer a question',description:'Keep a question for later.',place:room,steps:[
 {id:'defer',kind:'postpone',label:'Defer the question',description:'Postpone a question from your recollection.',minutes:1,report:'I will ask later.',observation:{basis:'recalled',actor:'player',value:'I recall an unanswered question.'}},
 {id:'resume',kind:'resume',label:'Return to the question',description:'Choose to ask now.',minutes:1,report:'I intend to ask now.'}]};
test('single source-attributed perceptions and recollections permit belief and a postponed intention',()=>{
 const ds=defineInferences({chains:[...directChains,postponedChain]},binding);
 for(const [id,d] of createSimulationRegistry({commands:ds}).commands)registry.simulation.commands.set(id,d);
 let p=setup();const truth=p.state.actors.player.facts['fixture.sample.safe'];
 for(const basis of ['recalled','witnessed']){
  const id=`fixture.direct.${basis}.think`;p=step(p,id);
  const k=p.state.simulation.knowledge.player[`inference.${id}`];assert.equal(k.stage,'interpreted');assert.equal(k.basis.observation,basis);
  assert.equal(p.state.actors.player.facts[`inference.fixture.direct.${basis}.intention`],'considering');
 }
 assert.equal(preview(p,'fixture.direct.plan.resume').eligible,false);
 p=step(p,'fixture.direct.plan.defer');assert.equal(p.state.actors.player.facts['inference.fixture.direct.plan.intention'],'postponed');
 p=step(p,'fixture.direct.plan.resume');assert.equal(p.state.actors.player.facts['inference.fixture.direct.plan.intention'],'active');
 assert.equal(p.state.actors.player.facts['fixture.sample.safe'],truth);assert.equal(preview(p,consumer.id).eligible,false);
 for(const mutate of [r=>delete r.steps[0].observation,r=>r.steps[0].observation.actor='fixture.other',r=>r.steps[0].observation.basis='world-truth',r=>r.steps[0].evidence=[{key:'fixture.unheld',value:'Unheld.'}]]){
  const row=structuredClone(directChains[0]);mutate(row);
  if(row.steps[0].evidence){const guarded=defineInferences({chains:[row]},binding);for(const [id,d] of createSimulationRegistry({commands:guarded}).commands)registry.simulation.commands.set(id,d);assert.equal(preview(setup(),guarded[0].id).eligible,false);}
  else assert.throws(()=>defineInferences({chains:[row]},binding));
 }
});

test('live integration crosses native UI and real save validator in a disposable copy',{timeout:180000},async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-kn1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 await mkdir(join(dir,'tests'));await cp(join(root,'tests/perspective_controls.test.js'),join(dir,'tests/perspective_controls.test.js'));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as kn1CastReady} from './book_world_lotm_cast_days.js';\nexport const kn1EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const kn1Validate=save=>validateSaveEnvelope(save,game_version);\nexport const kn1Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[1].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other'],history:[],relations:[],intentions:[],untakenChoices:[]},
  topicTalks:{talks:[{id:'fixture.consumer',personId:people[1].id,topicId:'fixture.use',label:'Ask about the sample',description:'Use your intention to ask a further question.',minutes:1,requires:gate,choices:[{id:'ask',label:'Ask the question',report:'You asked about the sample.',effects:[]}]}]}};
 const row=structuredClone(exampleChain);row.place='fixture.place.other';pack.inferences={chains:[row,...directChains.map(x=>({...x,place:row.place})),{...postponedChain,place:row.place}]};

 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 await exec('npm',['run','build'],{cwd:dir,env:{...process.env,BUILD_OUT:join(dir,'candidate')},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');t.diagnostic('Disposable integrated build SHA-256: '+createHash('sha256').update(await readFile(join(dir,'candidate/dist/bundle.js'))).digest('hex'));
 const arch=await exec('npm',['run','check:arch'],{cwd:dir,timeout:60000,maxBuffer:1024*1024});t.diagnostic(arch.stdout.trim());
 await exec(process.execPath,['--test',join(dir,'tests/perspective_controls.test.js')],{cwd:dir,timeout:30000,maxBuffer:1024*1024});
 const worker=join(dir,'kn1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.kn1CastReady();g.module.kn1EnrollBe();
 let initial=JSON.parse(g.internals.create_save());
 assert.ok(!Object.keys(initial.expansion.actors.player.facts).some(k=>k.startsWith('inference.')),'unused chains add no progress');
 initial.expansion.actors.player.facts['fixture.sample.safe']=false;
 initial.expansion.simulation.knowledge.player||={};
 initial.expansion.simulation.knowledge.player['book.lotm.cast.known.fixture.person.relative']={stage:'seen',value:'You know this person.',at:initial.expansion.clock,cause:'fixture.setup'};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.ok(button('fixture.thought.recall'),'thought is reachable in the native place UI');
 assert.equal(document.querySelector('[data-lotm-inferences]').dataset.perspective,'player');
 assert.equal(button('fixture.thought.recall').disabled,true,'missing memory stays unknown');
 assert.equal(button('fixture.consumer.ask').disabled,true,'intention gate begins locked');
 assert.ok(!document.querySelector('[data-lotm-inferences]').textContent.includes('I think the left sample may be safe.'),'future belief hidden');
 initial.expansion.simulation.knowledge.player['fixture.memory']={stage:'seen',value:'A fragment mentions the left sample.',at:initial.expansion.clock,cause:'fixture.memory',basis:{kind:'recollection',attributedTo:'player',situationId:'book.lotm.tingen.canon_beside'}};
 await g.load(initial);await g.settle();
 g.module.kn1Act('fixture.thought.recall');await g.step(2);
 g.module.kn1Act('fixture.thought.infer');
 let saved=await g.save();const job=saved.expansion.simulation.jobs.find(j=>j.commandId==='fixture.thought.infer');assert.ok(job,'pending thought passes native save validation');
 assert.equal(saved.expansion.simulation.knowledge.player['inference.fixture.thought.infer'],undefined,'no knowledge until completion');
 const bad=structuredClone(saved);bad.expansion.simulation.jobs.find(j=>j.commandId==='fixture.thought.infer').effects.at(-1).value='Altered';assert.throws(()=>g.module.kn1Validate(bad),/exact admitted definition/);
 const badSupport=structuredClone(saved);badSupport.expansion.simulation.jobs.find(j=>j.commandId==='fixture.thought.infer').completionSupport.requires={all:[]};assert.throws(()=>g.module.kn1Validate(badSupport),/Thought support differs/);
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false);assert.equal((await g.save()).expansion.simulation.jobs.find(j=>j.commandId==='fixture.thought.infer').id,job.id);
 const pendingExport=await g.exportFile();await g.importFile(pendingExport);await g.step(2);
 saved=await g.save();const belief=saved.expansion.simulation.knowledge.player['inference.fixture.thought.infer'];assert.equal(belief.value,'I think the left sample may be safe.');assert.equal(belief.cause,job.id);assert.equal(belief.basis.kind,'inference');
 assert.equal(saved.expansion.actors.player.facts['fixture.sample.safe'],false);assert.equal(button('fixture.consumer.ask').disabled,true);
 g.module.kn1Act('fixture.thought.intend');await g.step(2);assert.equal(button('fixture.consumer.ask').disabled,false);
 g.module.kn1Act('fixture.thought.postpone');await g.step(2);assert.equal(button('fixture.consumer.ask').disabled,true);
 await g.reload();const postponed=await g.exportFile();await g.importFile(postponed);assert.equal(button('fixture.consumer.ask').disabled,true,'postponement survives reload/import');
 g.module.kn1Act('fixture.thought.resume');await g.step(2);assert.equal(button('fixture.consumer.ask').disabled,false);
 g.module.kn1Act('fixture.consumer.ask');await g.step(2);
 g.module.kn1Act('fixture.thought.cancel');await g.step(2);assert.equal(button('fixture.consumer.ask').disabled,true);
 await g.reload();const exported=await g.exportFile();await g.importFile(exported);const after=await g.save();
 assert.equal(after.expansion.actors.player.facts['inference.fixture.thought.intention'],'cancelled');assert.equal(after.expansion.actors.player.facts['fixture.sample.safe'],false);
 assert.equal(after.expansion.simulation.knowledge.player['topic.talk.fixture.consumer.ask'].value,'You asked about the sample.');
 assert.equal(after.expansion.simulation.knowledge['fixture.person.relative']?.['inference.fixture.thought.infer'],undefined,'another observer did not receive the belief');
 g.module.kn1Act('fixture.direct.recalled.think');let direct=await g.save();
 const directJob=direct.expansion.simulation.jobs.find(j=>j.commandId==='fixture.direct.recalled.think');assert.ok(directJob);
 const badDirect=structuredClone(direct);badDirect.expansion.simulation.jobs.find(j=>j.id===directJob.id).effects.at(-1).basis.observation='world-truth';assert.throws(()=>g.module.kn1Validate(badDirect),/exact admitted definition/);
 await g.reload();const directExport=await g.exportFile();await g.importFile(directExport);await g.step(2);
 direct=await g.save();assert.equal(direct.expansion.simulation.knowledge.player['inference.fixture.direct.recalled.think'].basis.observation,'recalled');
 g.module.kn1Act('fixture.direct.witnessed.think');await g.step(2);
 g.module.kn1Act('fixture.direct.plan.defer');await g.step(2);await g.reload();
 const deferredExport=await g.exportFile();await g.importFile(deferredExport);
 assert.equal((await g.save()).expansion.actors.player.facts['inference.fixture.direct.plan.intention'],'postponed');
 g.module.kn1Act('fixture.direct.plan.resume');await g.step(2);
 assert.equal((await g.save()).expansion.actors.player.facts['inference.fixture.direct.plan.intention'],'active');
 assert.equal((await g.save()).expansion.actors.player.facts['fixture.sample.safe'],false);
 assert.deepEqual(g.errors,[]);
 process.stdout.write('native belief, intention gate, pending/settled Save/reload/Export/Import, support/effect tamper: PASS');
} finally {g.close();}
 `);
 const {stdout}=await exec(process.execPath,['--max-old-space-size=8192',worker],{cwd:dir,timeout:170000,maxBuffer:1024*1024});assert.match(stdout,/tamper: PASS/);
});
