import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCastAbilities,quoteCastAbilities,commitCastAbility} from '../src/cast_ability_adapter.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
const eq=(fact,value)=>({fact,op:'eq',value});
// pack.abilityConflicts: {encounters:[{id,label,description,place?,targetId?,
// requires?,locator?,sourceStepId?,moves:[{id,label,description,minutes,after?,
// requires?,costs?:null|native[],effects?:native[],report,result?,ability?:{
// sourceId?:null|string,function?,acquisition?,executionKind?,control?,target?,
// counters?,carriers?}}]}]}. Unknown amounts/stages/source are omitted or null.
export const encounter={id:'fixture.encounter',label:'A short encounter',description:'Find an opening and leave the pursuit.',place:'fixture.room',moves:[
 {id:'notice',label:'Read the opening',description:'Use a held method to notice an opening.',minutes:1,costs:[{type:'resource',actor:'player',native:true,key:'money',amount:-1}],
  ability:{sourceId:'fixture.method',function:'perception',acquisition:'learned',executionKind:'ordinary-technique',counters:[eq('actor.fixture.counter',true)]},
  effects:[{type:'knowledge',actor:'player',key:'fixture.opening',stage:'seen',value:'A way past the pursuer is visible.'}],report:'You noticed a way past.'},
 {id:'leave',after:['notice'],label:'Leave the pursuit',description:'Use the observed opening to leave.',minutes:2,
  requires:eq('knowledge.fixture.opening.value','A way past the pursuer is visible.'),effects:[{type:'fact',scope:'actor',actor:'player',key:'fixture.pursued',value:false}],result:'released',report:'You left the pursuit.'},
 {id:'withdraw',after:['notice'],label:'Withdraw',description:'Step back without using the opening.',minutes:1,effects:[{type:'fact',scope:'actor',actor:'player',key:'fixture.withdrawn',value:true}],result:'withdrawn',report:'You withdrew.'}
]};
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
registry.sources.set('fixture.method',{id:'fixture.method',revision:1,kind:'technique',label:'Held method',grants:[]});
const commands=defineCastAbilities({encounters:[encounter]},binding);
for(const [id,d] of createSimulationRegistry({commands}).commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh(5);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location='fixture.room';p.state.actors.player.facts['fixture.counter']=false;
 p.state.actors.player.sources['fixture.method']={acquiredAt:0,expiresAt:null,receiptId:'fixture.grant',worldId:I.world,revision:1};
 p.state.simulation.faculties.player||={};p.state.simulation.faculties.player['fixture.method']={awakened:true,active:true,suppressed:false,development:0};return p;}
const preview=(p,id)=>previewSimulationCommand(p.state,registry,id,ctx(p));
const start=(p,id)=>({...p,...commitCastAbility(commands,id,{state:p.state,context:ctx(p),commit:commandId=>commitSimulationCommand(p.state,registry,{id:commandId},ctx(p),p.state.sequence)})});
const step=(p,id)=>wait(start(p,id),registry.simulation.commands.get(id).duration);
test('absent packs stay silent and quotes spend no stock or draws and hide aftermath',()=>{
 assert.deepEqual(defineCastAbilities(undefined,binding),[]);
 const p=setup(),before=JSON.stringify(p);
 for(let n=0;n<3;n++){
  const rows=quoteCastAbilities(p.state,commands,d=>preview(p,d.id));assert.equal(rows.length,3);
  assert.ok(!JSON.stringify(rows).includes('released'));assert.ok(!JSON.stringify(rows).includes('way past the pursuer is visible'));
  assert.match(rows[1].costText,/not recorded/);
 }
 assert.equal(JSON.stringify(p),before);
});
test('held source, counter and continuing support refuse or refund without granting an opening',()=>{
 for(const change of [p=>delete p.state.actors.player.sources['fixture.method'],p=>p.state.actors.player.facts['fixture.counter']=true]){
  const p=setup();change(p);const before=JSON.stringify(p);assert.equal(preview(p,commands[0].id).eligible,false);assert.throws(()=>start(p,commands[0].id));assert.equal(JSON.stringify(p),before);
 }
 let p=start(setup(),commands[0].id);assert.equal(p.external.money,4);p.state.actors.player.facts['fixture.counter']=true;p=wait(p,2);
 assert.equal(p.external.money,5);assert.equal(p.state.simulation.knowledge.player?.['fixture.opening'],undefined);
 assert.equal(preview(p,commands[1].id).eligible,false);
});
test('native observation is consumed by escape; withdrawal and repeated settlement retain distinct aftermath',()=>{
 let p=setup();assert.equal(preview(p,commands[1].id).eligible,false);
 p=step(p,commands[0].id);assert.equal(preview(p,commands[1].id).eligible,true,JSON.stringify({q:preview(p,commands[1].id),facts:p.state.actors.player.facts,k:p.state.simulation.knowledge.player,jobs:p.state.simulation.jobs}));
 const job=start(p,commands[1].id);p=wait(job,2);assert.equal(p.state.actors.player.facts['fixture.pursued'],false);
 assert.equal(p.state.actors.player.facts[commands[1].castAbility.resultKey],'released');assert.equal(p.external.money,4);
 const stable=JSON.stringify(p.state.actors.player.completed);p=wait(p,3);assert.equal(JSON.stringify(p.state.actors.player.completed),stable);
 p=step(step(setup(),commands[0].id),commands[2].id);assert.equal(p.state.actors.player.facts['fixture.withdrawn'],true);
 assert.equal(p.state.actors.player.facts[commands[2].castAbility.resultKey],'withdrawn');assert.equal(preview(p,commands[1].id).eligible,false);
 assert.equal(p.state.simulation.knowledge[I.supervisor]?.['fixture.opening'],undefined);
});
test('unknown details do not invent costs, grants, results or native effects; registry requires JSON-safe rows',()=>{
 const row=structuredClone(encounter);row.moves[0].ability={sourceId:null};row.moves[0].costs=null;
 row.moves[0].effects=[{type:'owner-needed',owner:'fixture.training',value:'Practice was described.'}];
 const ds=defineCastAbilities({encounters:[row]},binding);createSimulationRegistry({commands:ds});assert.equal(ds[0].castAbility.cost,null);assert.deepEqual(ds[0].costs,[]);assert.match(ds[0].effects[0].value,/owner needed: fixture.training/);
 const partial=structuredClone(encounter);partial.moves[0].ability={sourceId:'fixture.method'};partial.moves[0].costs=[{type:'resource',native:true,key:'money',amount:null}];
 partial.moves[0].effects=[{type:'vital',key:'stamina',amount:null}];
 const partialCommands=defineCastAbilities({encounters:[partial]},binding);createSimulationRegistry({commands:partialCommands});
 assert.deepEqual(partialCommands[0].costs,[]);assert.equal(partialCommands[0].castAbility.cost,null);
 assert.match(partialCommands[0].effects[0].value,/amount not recorded/);
 const partialRegistry=createSimulationRegistry({commands:partialCommands});
 assert.ok(partialRegistry.commands.get(partialCommands[0].id).requires);
 for(const change of [r=>r.moves[1].after=['missing'],r=>r.moves[0].effects=[{type:'invented'}],r=>r.moves[0].requires=[],r=>r.moves[0].costs=[{type:'resource',actor:'player',native:true,key:'money',amount:1}],r=>r.moves[0].ability.sourceId=undefined]){
  const r=structuredClone(encounter);change(r);assert.throws(()=>createSimulationRegistry({commands:defineCastAbilities({encounters:[r]},binding)}));
 }
});

test('live integration crosses native UI and real save validator in a disposable copy',{timeout:300000},async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd();
 const joins=await Promise.all(['src/book_world_lotm_cast_host.js','src/book_world_lotm_host.js','src/book_world_lotm_state.js','src/book_world_lotm_ui.js','src/perspective_controls.js'].map(file=>readFile(join(root,file),'utf8')));
 const markers=['defineCastAbilities','commitCastAbility','if(def.castAbility)','dataset.lotmAbilityConflicts',"'ability-conflicts'"];
 const present=markers.map((marker,i)=>joins[i].includes(marker));
 if(!present.some(Boolean)){t.skip('AB1 host integration has not landed; native fixture runs when its joins are live.');return;}
 assert.ok(present.every(Boolean),'AB1 integration is incomplete in the live source.');
 const dir=await mkdtemp(join(tmpdir(),'yairpg-ab1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`\nexport {whenCastLoaded as ab1CastReady} from './book_world_lotm_cast_days.js';\nexport const ab1EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const ab1Validate=save=>validateSaveEnvelope(save,game_version);\nexport const ab1Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const evidence={label:'I',locator:'fixture p1'},people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
 const schedule=[{id:'fixture.slot',actor:people[1].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
  places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other'],history:[],relations:[],intentions:[],untakenChoices:[]},
  topicTalks:{talks:[{id:'fixture.consumer',personId:people[1].id,topicId:'fixture.followup',label:'Ask after release',description:'Ask a question after the pursuit ends.',minutes:1,requires:eq('actor.conflict.fixture.encounter.result','released'),choices:[{id:'ask',label:'Ask the next question',report:'You asked a question after release.',effects:[]}]}]}};
 const row=structuredClone(encounter);row.place='fixture.place.other';
 pack.abilityConflicts={encounters:[row]};
 await mkdir(join(dir,'tests'),{recursive:true});
 await cp(join(root,'tests/perspective_controls.test.js'),join(dir,'tests/perspective_controls.test.js'));
 t.diagnostic('AB1 fixture tests the live integrated source.');
 // Fixture source registration is not a pack-granted capability. Real content
 // must bind a source owned by its source/progression registry.
 const sourceFile=join(dir,'src/expedition_content.js');
 await writeFile(sourceFile,(await readFile(sourceFile,'utf8'))+`\nexpeditionRegistry.sources.set('fixture.method',{id:'fixture.method',revision:1,kind:'technique',label:'Held method',grants:[]});\n`);

 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 await exec('npm',['run','build'],{cwd:dir,env:{...process.env,BUILD_OUT:join(dir,'candidate')},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');t.diagnostic('Disposable integrated build SHA-256: '+createHash('sha256').update(await readFile(join(dir,'candidate/dist/bundle.js'))).digest('hex'));
 const arch=await exec('npm',['run','check:arch'],{cwd:dir,timeout:60000,maxBuffer:1024*1024});t.diagnostic(arch.stdout.trim());
 await exec(process.execPath,['--test','tests/perspective_controls.test.js'],{cwd:dir,timeout:30000});
 const worker=join(dir,'ab1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try{
 await g.module.ab1CastReady();g.module.ab1EnrollBe();
 let initial=await g.save();
 assert.ok(!Object.keys(initial.expansion.actors.player.facts).some(k=>k.startsWith('conflict.')));
 Object.assign(initial.expansion.actors.player.facts,{'fixture.counter':false,'fixture.pursued':true});
 initial.expansion.actors.player.sources['fixture.method']={acquiredAt:initial.expansion.clock,expiresAt:null,receiptId:'fixture.grant',worldId:initial.expansion.actors.player.worldId,revision:1};
 initial.expansion.simulation.faculties.player||={};
 initial.expansion.simulation.faculties.player['fixture.method']={awakened:true,active:true,suppressed:false,development:0};
 initial.expansion.simulation.knowledge.player||={};
 initial.expansion.simulation.knowledge.player['book.lotm.cast.known.fixture.person.relative']={stage:'seen',value:'You know this person.',at:initial.expansion.clock,cause:'fixture.setup'};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.ok(button('fixture.encounter.notice'));
 assert.equal(document.querySelector('[data-lotm-ability-conflicts]').dataset.perspective,'player');
 assert.equal(button('fixture.encounter.leave').disabled,true);
 assert.equal(button('fixture.consumer.ask').disabled,true);
 const money=(await g.save()).character.money;
 g.module.ab1Act('fixture.encounter.notice');
 let saved=await g.save();assert.equal(g.internals.foundationSaveBlocked,false);
 const job=saved.expansion.simulation.jobs.find(j=>j.commandId==='fixture.encounter.notice');assert.ok(job,'pending held ability crosses real save validator');
 assert.equal(saved.character.money,money-1);
 assert.match(document.querySelector('#lotm_panel').textContent,/Read the opening · [0-9]+ min left/,'accepted encounter is visible in current work');
 const bad=structuredClone(saved);bad.expansion.simulation.jobs.find(j=>j.id===job.id).effects[0].value='altered';assert.throws(()=>g.module.ab1Validate(bad),/exact admitted definition/);
 const support=structuredClone(saved);support.expansion.simulation.jobs.find(j=>j.id===job.id).completionSupport.requires={all:[]};assert.throws(()=>g.module.ab1Validate(support),/Encounter support differs/);
 await g.reload();const pendingExport=await g.exportFile();await g.importFile(pendingExport);await g.step(2);
 saved=await g.save();assert.equal(saved.expansion.simulation.knowledge.player['fixture.opening'].cause,job.id);
 assert.equal(saved.character.money,money-1);assert.equal(button('fixture.encounter.leave').disabled,false);
 g.module.ab1Act('fixture.encounter.leave');let leaving=await g.save();assert.ok(leaving.expansion.simulation.jobs.some(j=>j.commandId==='fixture.encounter.leave'));
 await g.reload();const leavingExport=await g.exportFile();await g.importFile(leavingExport);await g.step(3);
 saved=await g.save();assert.equal(saved.expansion.actors.player.facts['conflict.fixture.encounter.result'],'released');
 assert.equal(saved.expansion.actors.player.facts['fixture.pursued'],false);
 assert.equal(button('fixture.consumer.ask').disabled,false,'release aftermath consumed by a real native interaction');
 g.module.ab1Act('fixture.consumer.ask');await g.step(2);
 await g.reload();const finalExport=await g.exportFile();await g.importFile(finalExport);await g.step(2);
 saved=await g.save();assert.equal(saved.character.money,money-1);
 assert.equal(saved.expansion.actors.player.completed['fixture.encounter.leave'],1);
 assert.equal(saved.expansion.simulation.knowledge.player['topic.talk.fixture.consumer.ask'].value,'You asked a question after release.');
 assert.equal(saved.expansion.simulation.knowledge['fixture.person.relative']?.['fixture.opening'],undefined);
 assert.equal(saved.expansion.simulation.sessions.player,undefined,'C14 transient cursor is not saved');
 assert.deepEqual(g.errors,[]);
 process.stdout.write('native held ability, pending/settled Save/reload/Export/Import, effect/support tamper and release consumer: PASS');
}finally{g.close();}
 `);
 const {stdout}=await exec(process.execPath,['--max-old-space-size=8192',worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});
 assert.match(stdout,/release consumer: PASS/);
});
