import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCastExchanges,quoteCastExchanges} from '../src/cast_exchange_adapter.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {fresh,ctx,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
const key=id=>JSON.stringify(id==='fixture.cloth'?{id,quality:100}:{id});
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
// JSON-safe pack example: the total is supported for the group, with no line prices.
const data={schema:1,rows:[
 {id:'fixture.buy',revision:1,kind:'purchase',sellerId:'fixture.vendor',place:'fixture.room',minutes:2,
 label:'Buy the bundle',description:'Exchange money for the held bundle and receive change.',report:'You bought the bundle.',
 items:[{key:key('fixture.cloth'),count:1,label:'cloth'},{key:key('fixture.food'),count:2,label:'food'}],
 price:{total:7,unit:'small coins',moneyPerUnit:1,tender:10,change:3}},
 {id:'fixture.wear',revision:1,kind:'wear',place:'fixture.room',minutes:1,label:'Put on the cloth',description:'Put the carried cloth in the clothing slot.',report:'You put on the cloth.',key:key('fixture.cloth'),slot:'torso'}]};
const commands=defineCastExchanges(data,binding);
const defs=createSimulationRegistry({commands,people:[{id:"fixture.vendor",revision:1,label:"Vendor",worldId:I.world,inventory:"simulation",location:"fixture.room"}]});for(const [id,d] of defs.people)registry.simulation.people.set(id,d);for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh(20);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');
 p.state.simulation.people.player.location='fixture.room';
 p.state.actors['fixture.vendor']={worldId:I.world,facts:{},resources:{},completed:{},sources:{},techniques:{}};
 p.state.simulation.people['fixture.vendor']={life:'alive',inventory:'simulation',location:'fixture.room',bornAt:0,body:{form:'human',hands:2,mobile:true}};
 p.state.simulation.owners['fixture.vendor']={[key('fixture.cloth')]:1,[key('fixture.food')]:2};
 p.equipment={player:{}};return p;
}
const context=(p,d=commands[0])=>({...ctx(p,d.targetId),equipment:p.equipment});
const preview=(p,d=commands[0])=>previewSimulationCommand(p.state,registry,d.id,context(p,d));
const start=(p,id='fixture.buy')=>({...p,...commitSimulationCommand(p.state,registry,{id},context(p,commands.find(d=>d.id===id)),p.state.sequence)});
const step=(p,n)=>{const c=context(p);return import('../src/expansion_engine.js').then(({advanceSimulation})=>({...p,...advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player,equipment:p.equipment.player}})}));};
test('grouped purchase reserves stock and tender; settlement conserves goods and gives change once',async()=>{
 let p=setup();const before=JSON.stringify(p),offers=quoteCastExchanges(p.state,commands,d=>preview(p,d));
 assert.equal(offers[0].eligible,true,JSON.stringify(offers[0]));assert.equal(offers[1].eligible,false);assert.match(offers[0].costText,/7 small coins.*tender 10, change 3/);assert.equal(JSON.stringify(p),before);
 p=start(p);assert.equal(p.external.money,10);assert.equal(p.gameplay.player.inventory[key('fixture.cloth')],undefined);assert.deepEqual(p.state.simulation.owners['fixture.vendor'],{});
 p=await step(p,2);assert.equal(p.external.money,13);assert.equal(p.gameplay.player.inventory[key('fixture.food')],2);assert.equal(p.gameplay.player.inventory[key('fixture.cloth')],1);
 p=await step(p,3);assert.equal(p.external.money,13);assert.throws(()=>start(p));
 p.equipment.player.torso=key('fixture.old.cloth');p=start(p,'fixture.wear');p=await step(p,1);assert.equal(p.equipment.player.torso,key('fixture.cloth'));assert.equal(p.gameplay.player.inventory[key('fixture.old.cloth')],1);assert.equal(p.gameplay.player.inventory[key('fixture.cloth')],undefined);
 assert.equal(p.state.simulation.knowledge.player['exchange.fixture.wear'].value,'You put on the cloth.');
});
test('stale stock, insufficient tender, absent seller and interruption leave no free goods or change',async()=>{
 for(const mutate of [p=>delete p.state.simulation.owners['fixture.vendor'][key('fixture.food')],p=>p.external.money=9,p=>p.state.simulation.people['fixture.vendor'].location='fixture.other']){
  const p=setup();assert.equal(preview(p).eligible,true,JSON.stringify(preview(p)));mutate(p);const before=JSON.stringify(p);assert.throws(()=>start(p));assert.equal(JSON.stringify(p),before);
 }
 let p=start(setup());let cancelled=cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,context(p),p.state.sequence);
 assert.equal(cancelled.external.money,20);assert.equal(cancelled.state.simulation.owners['fixture.vendor'][key('fixture.food')],2);assert.equal(cancelled.gameplay.player.inventory[key('fixture.food')],undefined);
 p=start(setup());p.state.simulation.people.player.location='fixture.other';p=await step(p,2);
 assert.equal(p.external.money,20);assert.equal(p.state.simulation.owners['fixture.vendor'][key('fixture.cloth')],1);assert.equal(p.state.simulation.knowledge.player?.['exchange.fixture.buy'],undefined);
});
test('native registry accepts JSON roundtrip; unknown total is silent and unsupported precision fails',()=>{
 assert.deepEqual(defineCastExchanges(null,binding),[]);assert.deepEqual(defineCastExchanges(JSON.parse(JSON.stringify(data)),binding),commands);
 assert.doesNotThrow(()=>createSimulationRegistry({commands}));
 const unknown=structuredClone(data);unknown.rows[0].price={total:null,unit:'coins',moneyPerUnit:1,tender:null,change:null};assert.equal(defineCastExchanges(unknown,binding).length,1);
 for(const mutate of [d=>d.rows[0].price.change=4,d=>d.rows[0].price.moneyPerUnit=0,d=>d.rows[0].items.push(d.rows[0].items[0]),d=>d.rows[1].slot=null,d=>d.rows[0].kind='stash']){const bad=structuredClone(data);mutate(bad);assert.throws(()=>defineCastExchanges(bad,binding));}
 const blocked=quoteCastExchanges(setup().state,commands,()=>({visible:true,eligible:true}),{blocked:'Saving paused.'});assert.equal(blocked[0].eligible,false);
});

test('live or prepared joins preserve pending and settled exchange through native Save, reload, Export and Import', {timeout:180000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-cu1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }

 await mkdir(join(dir,'tests'));await cp(join(root,'tests/perspective_controls.test.js'),join(dir,'tests/perspective_controls.test.js'));
 const patch=join(root,'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CU1_INTEGRATION.patch');
 let integrated=false;
 try{await exec('git',['apply','-R','--check',patch],{cwd:dir});integrated=true;}catch{}
 if(!integrated){await exec('git',['apply','--check',patch],{cwd:dir});await exec('git',['apply',patch],{cwd:dir});}
 t.diagnostic(integrated?'CU1 integration already present; tested live source.':'CU1 integration absent; applied prepared patch in disposable copy.');
 await exec(process.execPath,['--test','tests/perspective_controls.test.js'],{cwd:dir,timeout:30000});
 const arch=await exec('npm',['run','check:arch'],{cwd:dir,timeout:30000});t.diagnostic(arch.stdout.trim());
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`
export {whenCastLoaded as cuReady} from './book_world_lotm_cast_days.js';
export const cuEnroll=()=>domainRegistry.command('lotm','enrollBeFresh')();
export const cuValidate=save=>validateSaveEnvelope(save,game_version);
export const cuAct=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};
`);
 const items=join(dir,'src/items.js');
 await writeFile(items,(await readFile(items,'utf8'))+`\nitem_templates['fixture.food']=new Material({id:'fixture.food',name:'fixture.food',description:'Synthetic food.',value:1});item_templates['fixture.cloth']=new Armor({id:'fixture.cloth',name:'fixture.cloth',description:'Synthetic clothing.',value:1,component_type:'chestplate interior',base_defense:1,component_tier:1,component_stats:{}});\n`);
 const evidence={label:'I',locator:'fixture p1'},people=[{id:'fixture.person.lead',indexId:'fixture.person.lead',name:'Lead',tier:'principal',relations:[],knows:[],wants:[],...evidence}];
 people.push({id:'fixture.vendor',indexId:'fixture.vendor',name:'Vendor',tier:'principal',relations:[],knows:[],wants:[],...evidence});
 const schedule=[{id:'fixture.slot',actor:'fixture.vendor',place:'fixture.room',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.room',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
 places:[{id:'fixture.room',indexId:'fixture.room',name:'Room',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
 bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},
 leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:20,home:null,start:'fixture.room',blurb:'Begin at home.'},knownPlaces:['fixture.room'],history:[],relations:[],intentions:[],untakenChoices:[]},exchanges:data};
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const buildOut=join(dir,'cu1-build');
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:buildOut},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');
 t.diagnostic('Patched disposable build SHA-256: '+createHash('sha256').update(await readFile(join(buildOut,'dist/bundle.js'))).digest('hex'));
 const worker=join(dir,'cu1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const key=id=>JSON.stringify(id==='fixture.cloth'?{id,quality:100}:{id});
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.cuReady();g.module.cuEnroll();
 let initial=JSON.parse(g.internals.create_save());
 initial.expansion.simulation.owners['fixture.vendor']={[key('fixture.cloth')]:1,[key('fixture.food')]:2};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.ok(button('fixture.buy'),'exchange is reachable');
 assert.equal(button('fixture.buy').disabled,false);
 assert.equal(button('fixture.wear').disabled,true);
 assert.equal(document.querySelector('[data-lotm-exchanges]').dataset.perspective,'player');
 g.module.cuAct('fixture.buy');let saved=await g.save();
 assert.equal(g.internals.foundationSaveBlocked,false);
 assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='fixture.buy'));
 assert.equal(saved.character.money,10);
 assert.equal(saved.inventories.person.main_character[key('fixture.food')],undefined);
 const bad=structuredClone(saved);bad.expansion.simulation.jobs.find(j=>j.commandId==='fixture.buy').effects[0].amount=2;
 assert.throws(()=>g.module.cuValidate(bad),/exact admitted definition/);
 const badSupport=structuredClone(saved);badSupport.expansion.simulation.jobs.find(j=>j.commandId==='fixture.buy').completionSupport.location='fixture.other';
 assert.throws(()=>g.module.cuValidate(badSupport),/support differs/);
 g.module.cuValidate(await g.save());let encoded=await g.exportFile();await g.importFile(encoded);await g.reload();await g.step(2);
 saved=await g.save();assert.equal(saved.inventories.person.main_character[key('fixture.food')].count,2);
 assert.equal(saved.inventories.person.main_character[key('fixture.cloth')].count,1);
 assert.equal(saved.character.money,13);
 assert.equal(saved.expansion.simulation.owners['fixture.vendor'][key('fixture.food')],undefined);
 assert.equal(button('fixture.buy').disabled,true);assert.equal(button('fixture.wear').disabled,false);
 g.module.cuValidate(await g.save());encoded=await g.exportFile();await g.importFile(encoded);await g.reload();await g.step(1);
 saved=await g.save();assert.equal(saved.character.money,13);
 assert.equal(saved.inventories.person.main_character[key('fixture.food')].count,2);
 assert.equal(saved.expansion.simulation.knowledge.player['exchange.fixture.buy'].value,'You bought the bundle.');
 assert.equal(button('fixture.wear').disabled,false);g.module.cuAct('fixture.wear');saved=await g.save();assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='fixture.wear'));await g.reload();await g.step(1);
 saved=await g.save();assert.ok(saved.character.equipment.torso);assert.equal(saved.inventories.person.main_character[key('fixture.cloth')],undefined);
 g.module.cuValidate(await g.save());encoded=await g.exportFile();await g.importFile(encoded);await g.reload();
 saved=await g.save();assert.equal(saved.expansion.simulation.knowledge.player['exchange.fixture.wear'].value,'You put on the cloth.');
 assert.ok(saved.character.equipment.torso);
 assert.deepEqual(g.errors,[]);assert.equal(g.internals.foundationSaveBlocked,false);
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:160000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native exchange fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
