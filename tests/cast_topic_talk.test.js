import test from 'node:test';
import assert from 'node:assert/strict';
import {defineTopicTalks,quoteTopicTalks,pendingTopicTalkReports,settleTopicTalkReports} from '../src/cast_topic_talk.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
const room='fixture.room',other='fixture.other',person='fixture.person.local',away='fixture.person.away';
const basis={kind:'instruction',attributedTo:person,situationId:I.situation};
const knowledge=(actor,key,value)=>({type:'knowledge',actor,key,value,stage:'seen',basis});
const data={talks:[
 {id:'fixture.offer',personId:person,topicId:'fixture.task',label:'A small task',description:'Discuss a task and choose whether to help.',minutes:2,choices:[
  {id:'agree',label:'Offer help',minutes:1,report:'You agreed to help.',costs:[{type:'resource',actor:'player',key:'money',native:true,amount:-1}],effects:[knowledge('player','fixture.task.known','You know where to help.'),knowledge(person,'fixture.answer','The offer was accepted.'),{type:'relationship',actor:person,target:'player',axis:'trust',amount:2,text:'Offered help.'},{type:'reputation',actor:'player',region:'fixture.block',amount:1},{type:'event',actor:person,eventId:'fixture.follow',delay:4}]},
  {id:'refuse',label:'Decline politely',report:'You declined the task.',effects:[knowledge(person,'fixture.answer','The offer was declined.'),{type:'relationship',actor:person,target:'player',axis:'trust',amount:-1,text:'Declined help.'}]}]},
 {id:'fixture.question',personId:person,topicId:'fixture.route',label:'Ask about a route',description:'Ask for directions after learning of the task.',minutes:1,knowledgeKey:'fixture.task.known',place:room,hour:0,choices:[{id:'ask',label:'Ask for directions',report:'You asked for directions.',effects:[knowledge('player','fixture.route','The path begins here.')]}]},
 {id:'fixture.absent',personId:away,topicId:'fixture.visit',label:'Arrange a visit',description:'Ask about visiting.',minutes:1,choices:[{id:'ask',label:'Ask about a visit',report:'You asked about a visit.',effects:[]}]}
]};
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
const commands=defineTopicTalks(data,binding);
const definitions=createSimulationRegistry({commands,people:[person,away].map(id=>({id,revision:1,label:id,worldId:I.world,inventory:'simulation',location:id===person?room:other,resources:{},body:{form:'human',hands:2,mobile:true},vitals:{health:24,max_health:24,stamina:18,max_stamina:18}})),events:[{id:'fixture.follow',revision:1,label:'Follow up',interval:1,mode:'ambient',automatic:false,public:false,actorId:person,effects:[]}]});
for(const family of ['people','commands','events'])for(const [id,d] of definitions[family])registry.simulation[family].set(id,d);
function setup(){const p=fresh(5);p.gameplay.player.reputation['fixture.block']=0;applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;return p;}
const context=(p,d)=>{const c=ctx(p,d.targetId);c.facts['topicTalk.hour']=Math.floor(p.state.clock/60)%24;return c;};
const preview=(p,d)=>previewSimulationCommand(p.state,registry,d.id,context(p,d));
const def=id=>commands.find(d=>d.id===`fixture.${id}`);
const start=(p,id)=>{const d=def(id);return {...p,...commitSimulationCommand(p.state,registry,{id:d.id},context(p,d),p.state.sequence)};};
test('all choices quote costs and effects without mutation, absent packs stay silent',()=>{
 const p=setup(),before=JSON.stringify(p),q=quoteTopicTalks(p.state,commands,d=>preview(p,d));
 assert.equal(q.length,4);assert.equal(q[0].duration,3);assert.match(q[0].costText,/-1/);assert.match(q[0].effectText,/trust \+2/);assert.match(q[0].effectText,/standing \+1/);assert.match(q[0].effectText,/after 4 min/);assert.equal(q[0].topicLabel,'A small task');
 assert.deepEqual(q[0].effects,commands[0].effects);assert.equal(JSON.stringify(p),before);
 assert.deepEqual(defineTopicTalks(undefined,binding),[]);assert.deepEqual(quoteTopicTalks(p.state,[],()=>assert.fail()),[]);
 const blocked=quoteTopicTalks(p.state,commands,d=>preview(p,d),{blocked:'Saving paused.',decide:()=>({allowed:false,reason:'Choose the current step.'})});assert.equal(blocked[0].eligible,false);assert.ok(blocked[0].reasons.includes('Saving paused.'));
});
test('agreement and refusal settle distinct facts, directed bonds, standing and follow-on jobs',()=>{
 let p=setup(),clock=p.state.clock;p=start(p,'offer.agree');
 assert.deepEqual(p.state.simulation.jobs.at(-1).participants,['player',person]);
 assert.equal(pendingTopicTalkReports(p.state,commands,I.world),false);p=wait(p,3);
 assert.equal(p.state.clock,clock+3);assert.equal(p.external.money,4);
 assert.equal(p.state.simulation.knowledge.player['fixture.task.known'].basis.attributedTo,person);
 assert.equal(p.state.simulation.knowledge[person]['fixture.answer'].value,'The offer was accepted.');
 assert.equal(p.state.simulation.relationships[person].player.axes.trust,2);
 assert.equal(p.gameplay.player.reputation['fixture.block'],1);
 assert.ok(Object.values(p.state.simulation.checks).some(c=>c.definitionId==='fixture.follow'&&c.due===p.state.clock+4));
 const receipt=p.state.simulation.knowledge.player['topic.talk.fixture.offer.agree'];assert.deepEqual(receipt.basis.participants,['player',person]);assert.equal(receipt.basis.topicId,'fixture.task');assert.equal(receipt.basis.choiceId,'agree');
 assert.equal(pendingTopicTalkReports(p.state,commands,I.world),true);assert.equal(settleTopicTalkReports(p.state,commands,I.world).length,1);
 assert.deepEqual(settleTopicTalkReports(JSON.parse(JSON.stringify(p.state)),commands,I.world),[]);validateSimulationState(p.state.simulation,p.state,registry.simulation);
 p=wait(start(setup(),'offer.refuse'),2);assert.equal(p.state.simulation.knowledge.player['fixture.task.known'],undefined);assert.equal(p.state.simulation.relationships[person].player.axes.trust,-1);assert.equal(p.external.money,5);
});
test('knowledge, hour, place and away gates reject stale admission without changes',()=>{
 let p=setup();assert.equal(preview(p,def('question.ask')).eligible,false);
 let before=JSON.stringify(p);assert.throws(()=>start(p,'question.ask'));assert.equal(JSON.stringify(p),before);
 const offers=quoteTopicTalks(p.state,commands,d=>preview(p,d),{presence:(d,q)=>d.targetId===away?{...q,eligible:false,reasons:['Away; return time and place are not known.']}:q});assert.match(offers.at(-1).reasons[0],/Away/);
 assert.throws(()=>start(p,'absent.ask'));assert.equal(JSON.stringify(p),before);
 p=wait(start(p,'offer.agree'),3);assert.equal(preview(p,def('question.ask')).eligible,true);p.state.clock=60;assert.equal(preview(p,def('question.ask')).eligible,false);
 p.state.clock=3;p.state.simulation.people.player.location=other;assert.equal(preview(p,def('question.ask')).eligible,false);
});
test('lost participant cancels supported work, returns reserved costs, grants no outcome',()=>{
 let p=start(setup(),'offer.agree');p.state.simulation.people[person].location=other;p=wait(p,3);
 assert.equal(p.external.money,5);assert.equal(p.state.simulation.knowledge.player?.['fixture.task.known'],undefined);assert.equal(pendingTopicTalkReports(p.state,commands,I.world),false);
});
test('bad rows cannot silently omit unsupported effects, attribution or duplicate choices',()=>{
 for(const change of [r=>r.choices[0].effects.push({type:'fact',key:'fixture.x',value:true}),r=>delete r.choices[0].effects[0].basis,r=>r.choices.push(r.choices[0]),r=>r.minutes=-1,r=>r.hour=24]){const bad=structuredClone(data);change(bad.talks[0]);assert.throws(()=>defineTopicTalks(bad,binding));}
});
test('generator-shaped source attribution binds the host situation through native registry validation',()=>{
 const row=structuredClone(data.talks[0]);
 row.choices[0].effects=[{type:'knowledge',actor:person,key:'fixture.source.result',value:'A source-qualified result.',stage:'seen',basis:{kind:'observation',at:'fixture p1',attributedTo:person}}];
 const original=structuredClone(row),defs=defineTopicTalks({talks:[row]},binding);
 assert.deepEqual(row,original,'binding does not mutate pack data');
 assert.deepEqual(defs[0].effects[0].basis,{...original.choices[0].effects[0].basis,situationId:I.situation});
 assert.doesNotThrow(()=>createSimulationRegistry({commands:defs}));
 const explicit=structuredClone(row);explicit.choices[0].effects[0].basis.situationId='fixture.other.situation';
 assert.equal(defineTopicTalks({talks:[explicit]},binding)[0].effects[0].basis.situationId,'fixture.other.situation');
 const invalid=structuredClone(row);invalid.choices[0].effects[0].basis.kind='invalid';
 assert.throws(()=>createSimulationRegistry({commands:defineTopicTalks({talks:[invalid]},binding)}),/Invalid knowledge attribution/);
});

test('live host and save validator round-trip native topic jobs, choices and receipts', {timeout:180000}, async t=>{
 // Run the real native save owner in a disposable copy, with a synthetic cast pack.
 // Host and save integration are already in the live source. Exercise that copy.
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-d2-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as d2CastReady} from './book_world_lotm_cast_days.js';\nexport {castAvailable as d2CastAvailable} from './book_world_lotm_cast_host.js';\nimport {LOTM_PROFILES as d2Profiles} from './book_world_lotm_lives.js';\nexport const d2BeProfile=()=>d2Profiles.be;\nimport {castTalkPreview as d2Presence} from './book_world_lotm_cast_host.js';\nexport const d2AwayPreview=()=>{const s=structuredClone(expansionState);s.clock=s.lotm.initializedAt+101;return d2Presence(s,{id:'book.lotm.fixture_offer.agree',targetId:'fixture.person.relative'},{visible:true,eligible:true,reasons:[]});};\nexport const d2EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const d2Validate=save=>validateSaveEnvelope(save,game_version);\nexport const d2Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[1].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other'],history:[],relations:[],intentions:[],untakenChoices:[]},
  topicTalks:{talks:[
   {id:'book.lotm.fixture_offer',personId:people[1].id,topicId:'fixture.help',label:'An offer',description:'Discuss helping with a task.',minutes:2,choices:[
    {id:'agree',label:'Agree to help',report:'You agreed to help.',effects:[{type:'knowledge',actor:people[1].id,key:'fixture.answer',stage:'seen',value:'Help was offered.',basis:{kind:'observation',at:'fixture p1',attributedTo:people[1].id}},{type:'relationship',actor:people[1].id,target:'player',axis:'trust',amount:1,text:'Help was offered.'}]},
    {id:'refuse',label:'Refuse politely',report:'You refused politely.',effects:[]}]},
   {id:'book.lotm.fixture_question',personId:people[1].id,topicId:'fixture.route',label:'Ask directions',description:'Ask where to help.',minutes:1,knowledgeKey:'topic.talk.book.lotm.fixture_offer.agree',hour:0,choices:[{id:'ask',label:'Ask for directions',report:'You learned the way.',effects:[]}]},
   {id:'book.lotm.fixture_away',personId:people[1].id,topicId:'fixture.later',label:'Ask later',description:'Discuss another visit.',minutes:1,place:'fixture.place.away',choices:[{id:'ask',label:'Ask later',report:'You discussed a visit.',effects:[]}]}
  ]}};

 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const worker=join(dir,'d2-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.d2CastReady();g.module.d2EnrollBe();
 let initial=JSON.parse(g.internals.create_save());
 assert.equal(initial.expansion.lotm.entryProfile,'book.lead.be@1');
 // A named fixture observation introduces this person without reading a player save.
 initial.expansion.simulation.knowledge.player||={};
 initial.expansion.simulation.knowledge.player['book.lotm.cast.known.fixture.person.relative']={stage:'seen',value:'You know this person.',at:initial.expansion.clock,cause:'fixture.setup'};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.ok(button('book.lotm.fixture_offer.agree'),'topic choice is reachable in the native place panel');
 assert.equal(button('book.lotm.fixture_question.ask').disabled,true,'knowledge gate is shown');
 const absent=g.module.d2AwayPreview();assert.equal(absent.eligible,false);assert.match(absent.reasons.join(' '),/Away|away|return/);
 assert.equal(button('book.lotm.fixture_away.ask').disabled,true,'place gate is shown');
 assert.equal(document.querySelector('[data-lotm-topic-person]').dataset.perspective,'player');
 g.module.d2Act('book.lotm.fixture_offer.agree');
 assert.equal(g.internals.foundationSaveBlocked,false,'pending talk is durably admitted');
 let saved=await g.save();const pending=saved.expansion.simulation.jobs.find(j=>j.commandId==='book.lotm.fixture_offer.agree');
 assert.ok(pending,JSON.stringify([...document.querySelectorAll('[role="status"]')].map(n=>n.textContent)));assert.deepEqual(pending.participants,['player','fixture.person.relative']);
 const changed=structuredClone(saved),job=changed.expansion.simulation.jobs.find(j=>j.commandId==='book.lotm.fixture_offer.agree');
 job.effects[0].value='Altered';assert.throws(()=>g.module.d2Validate(changed),/exact admitted definition/);
 await g.reload();assert.equal(g.internals.foundationSaveBlocked,false);await g.step(3);saved=await g.save();
 assert.equal(saved.expansion.simulation.knowledge['fixture.person.relative']['fixture.answer'].value,'Help was offered.');
 assert.equal(saved.expansion.simulation.knowledge['fixture.person.relative']['fixture.answer'].basis.situationId,'book.lotm.tingen.canon_beside');
 assert.equal(saved.expansion.simulation.knowledge['fixture.person.relative']['fixture.answer'].basis.at,'fixture p1');
 assert.equal(saved.expansion.simulation.relationships['fixture.person.relative'].player.axes.trust,1);
 assert.equal(saved.expansion.simulation.knowledge.player['topic.talk.book.lotm.fixture_offer.agree'].value,'You agreed to help.');
 assert.equal(button('book.lotm.fixture_question.ask').disabled,false,'settled knowledge opens the next topic');
 await g.reload();const encoded=await g.exportFile();await g.importFile(encoded);const after=await g.save();
 assert.equal(after.expansion.simulation.knowledge.player['topic.talk.book.lotm.fixture_offer.agree'].value,'You agreed to help.');
 assert.equal(after.expansion.simulation.relationships['fixture.person.relative'].player.axes.trust,1);
 assert.ok(!after.expansion.simulation.jobs.some(j=>j.commandId==='book.lotm.fixture_offer.agree'));
 // Pre-D2 saves have no talk facts and do not acquire a fabricated choice.
 await g.load(initial);const old=await g.save();assert.equal(old.expansion.simulation.knowledge.player['topic.talk.book.lotm.fixture_offer.agree'],undefined);
 assert.equal(g.internals.foundationSaveBlocked,false);assert.deepEqual(g.errors,[]);
 await g.settle();
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:160000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native save fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
 // Loader preflight is still a prepared patch. Apply it only after the live-source
 // fixture has finished, for the separate malformed-pack recovery scenario.
 const loaderPatch=resolve(root,'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/D2_LOAD_INTEGRATION.patch');
 let loaderIntegrated=false;try{await exec('git',['apply','--reverse','--check',loaderPatch],{cwd:dir});loaderIntegrated=true;}catch{}
 if(!loaderIntegrated){await exec('git',['apply','--check',loaderPatch],{cwd:dir});await exec('git',['apply',loaderPatch],{cwd:dir});}
 // A malformed basis must take the existing missing-pack route before any
 // registry installation, rather than leaving boot rejected or half-loaded.
 pack.topicTalks.talks[0].choices[0].effects[0].basis.kind='invalid';
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const invalidWorker=join(dir,'d2-invalid-worker.mjs');
 await writeFile(invalidWorker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 assert.equal(await g.module.d2CastReady(),null);
 assert.equal(g.module.d2CastAvailable,false);
 assert.equal(g.module.d2BeProfile().label,'Cast unavailable');
 assert.match(g.module.d2BeProfile().blurb,/private cast pack absent/i);
 assert.throws(()=>g.module.d2EnrollBe(),/available Tingen starts/);
 assert.deepEqual(g.errors,[]);
} finally {g.close();}
`);
 try{await exec(process.execPath,[invalidWorker],{cwd:dir,timeout:160000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Invalid-pack fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
