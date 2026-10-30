import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCastMaking,quoteCastMaking,validateCastMakingConsumers} from '../src/cast_making_adapter.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';

// Synthetic pack example. These keys are fixture inventory, not new stock seeds.
const key=id=>JSON.stringify({id});
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
const data={schema:1,catalogue:{id:'fixture.materials',revision:1,axes:[{id:'restore',kind:'fraction'}],materials:[
 {id:'fixture.leaf',revision:1,properties:{restore:400}},{id:'fixture.water',revision:1,properties:{}},{id:'fixture.tool',revision:1,properties:{}}]},
 laws:[{id:'fixture.law',revision:1,carrier:'Liquid',ops:[{id:'mix'}],outputs:[{id:'restore',route:'oral',effect:'health',axis:'restore',per:20}]}],rows:[
 {id:'fixture.make',revision:1,label:'Prepare a liquid',description:'Mix the held ingredients into a liquid for use.',report:'You prepared a liquid.',place:'fixture.room',minutes:2,knowledgeKey:'fixture.recipe',law:'fixture.law@1',
 recipe:{id:'fixture.recipe',revision:1,law:'fixture.law@1',slots:[{id:'leaf',role:'active',select:{material:'fixture.leaf'},qty:[1,1]},{id:'water',role:'solvent',select:{material:'fixture.water'},qty:[1,1]},{id:'tool',role:'catalyst',select:{material:'fixture.tool'},qty:[1,1]}],process:[{op:'mix'}]},
 inputs:[{key:key('fixture.leaf'),material:'fixture.leaf',qty:1},{key:key('fixture.water'),material:'fixture.water',qty:1},{key:key('fixture.tool'),material:'fixture.tool',qty:1,role:'catalyst'}],process:[{op:'mix',level:1}],stations:[],product:{key:key('fixture.liquid'),label:'Prepared liquid'},
 use:{label:'Drink the liquid',description:'Drink the prepared liquid to restore health.',report:'You drank the liquid.',minutes:1,effects:[{type:'vital',key:'health',output:{route:'oral',effect:'health'}}]}}
]};
const commands=defineCastMaking(data,binding);
const defs=createSimulationRegistry({commands});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh();applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location='fixture.room';p.gameplay.player.inventory={[key('fixture.leaf')]:2,[key('fixture.water')]:2,[key('fixture.tool')]:1};p.state.simulation.knowledge.player||={};p.state.simulation.knowledge.player['fixture.recipe']={stage:'seen',value:'A known method.',at:0,cause:'fixture.setup'};return p;}
const preview=(p,d=commands[0])=>previewSimulationCommand(p.state,registry,d.id,ctx(p));
const start=(p,id='fixture.make')=>({...p,...commitSimulationCommand(p.state,registry,{id},ctx(p),p.state.sequence)});
test('known multi-slot batch reserves real matter and use consumes the resolved product',()=>{
 let p=setup(),before=JSON.stringify(p);const q=quoteCastMaking(p.state,commands,d=>preview(p,d));
 assert.equal(q.length,2);assert.match(q[0].costText,/fixture.leaf.*1/);assert.equal(q[1].eligible,false);assert.equal(JSON.stringify(p),before);
 p=start(p);assert.equal(p.gameplay.player.inventory[key('fixture.leaf')],1);assert.equal(p.gameplay.player.inventory[key('fixture.liquid')],undefined);
 p=wait(p,2);assert.equal(p.gameplay.player.inventory[key('fixture.liquid')],1);assert.equal(p.gameplay.player.inventory[key('fixture.tool')],1);
 assert.equal(preview(p,commands[1]).eligible,true);assert.equal(commands[1].effects[0].amount,4,'potency comes from composition');
 p=start(p,'fixture.make.use');p=wait(p,1);assert.equal(p.gameplay.player.inventory[key('fixture.liquid')],undefined);
 assert.equal(p.state.simulation.knowledge.player['making.fixture.make.used'].value,'You drank the liquid.');
 assert.throws(()=>start(p,'fixture.make.use'),'an empty bottle cannot be used twice');
});
test('missing instruction, stock, apparatus and lost support produce no free product',()=>{
 for(const mutate of [p=>delete p.state.simulation.knowledge.player['fixture.recipe'],p=>delete p.gameplay.player.inventory[key('fixture.leaf')],p=>delete p.gameplay.player.inventory[key('fixture.tool')]]){
  const p=setup();mutate(p);const before=JSON.stringify(p);assert.equal(preview(p).eligible,false);assert.throws(()=>start(p));assert.equal(JSON.stringify(p),before);
 }
 let p=start(setup());p.state.simulation.people.player.location='fixture.elsewhere';p=wait(p,2);
 assert.equal(p.gameplay.player.inventory[key('fixture.leaf')],2);assert.equal(p.gameplay.player.inventory[key('fixture.liquid')],undefined);assert.equal(p.state.simulation.knowledge.player['making.fixture.make'],undefined);
 p=start(setup());const cancelled=cancelSimulationJob(p.state,registry,p.state.simulation.jobs.at(-1).id,ctx(p),p.state.sequence);
 assert.equal(cancelled.gameplay.player.inventory[key('fixture.leaf')],2);assert.equal(cancelled.state.simulation.knowledge.player['making.fixture.make'],undefined);
});
test('same mechanism carries a second product, stable identity, silent absence and rejects conflicting bindings',()=>{
 assert.deepEqual(defineCastMaking(undefined,binding),[]);assert.deepEqual(quoteCastMaking(setup().state,[],()=>assert.fail()),[]);
 for(const seed of [1,17,42]){const p=setup();p.state.seed=seed;assert.deepEqual(defineCastMaking(JSON.parse(JSON.stringify(data)),binding),commands);}
 const second=structuredClone(data),row=structuredClone(second.rows[0]);row.id='fixture.other';row.recipe.id='fixture.other.recipe';row.recipe.slots[0].qty=[2,2];row.inputs[0].qty=2;row.product={key:key('fixture.other.liquid'),label:'Another liquid'};row.use.effects=[{type:'fact',scope:'actor',key:'fixture.used',value:true}];second.rows.push(row);
 const secondCommands=defineCastMaking(second,binding);assert.equal(secondCommands.length,4);
 const secondDefs=createSimulationRegistry({commands:secondCommands});for(const [id,d] of secondDefs.commands)registry.simulation.commands.set(id,d);
 let p=wait(start(setup(),'fixture.other'),2);p=wait(start(p,'fixture.other.use'),1);
 assert.equal(p.gameplay.player.inventory[key('fixture.leaf')],undefined);assert.equal(p.gameplay.player.inventory[key('fixture.water')],1);assert.equal(p.state.actors.player.facts['fixture.used'],true);assert.equal(p.state.simulation.knowledge.player['making.fixture.make'],undefined);
 assert.equal(p.gameplay.player.inventory[key('fixture.other.liquid')],undefined);
 const external=structuredClone(data);delete external.rows[0].use;external.rows[0].product.consumer='fixture.ingest';
 const joined=defineCastMaking(external,binding),consumer={actorId:'player',costs:[{type:'item',key:key('fixture.liquid'),amount:-1}]};
 assert.throws(()=>validateCastMakingConsumers(joined,()=>null));assert.doesNotThrow(()=>validateCastMakingConsumers(joined,()=>consumer));
 consumer.costs[0].key=key('fixture.other');assert.throws(()=>validateCastMakingConsumers(joined,()=>consumer));
 for(const mutate of [d=>d.rows[0].inputs[0].qty=2,d=>delete d.rows[0].minutes,d=>delete d.rows[0].use,d=>d.rows[0].law='missing@1',d=>d.rows[0].inputs[1].key=key('fixture.leaf'),d=>d.rows[0].product.key=key('fixture.leaf'),d=>d.rows[0].recipe.law=null]){
  const bad=structuredClone(data);mutate(bad);assert.throws(()=>defineCastMaking(bad,binding));
 }
 const blocked=quoteCastMaking(setup().state,commands,()=>({visible:true,eligible:true,reasons:[]}),{blocked:'Saving paused.'});assert.equal(blocked[0].eligible,false);
});

const timedRows=[
 {id:'fixture.prep.unbound',revision:1,kind:'preparation',place:'fixture.room',minutes:2,label:'Arrange the materials',description:'Arrange materials without a recorded recipe.',report:'You arranged the materials.',object:{key:'fixture.materials.arranged',value:true}},
 {id:'fixture.prep.stock',revision:1,kind:'preparation',place:'fixture.room',minutes:1,label:'Prepare the leaf',description:'Spend a held leaf in preparation.',report:'You prepared the leaf.',inputs:[{key:key('fixture.leaf'),qty:1}]},
 ...['write','read','inscribe','destroy','handle'].map(operation=>({id:`fixture.document.${operation}`,revision:1,kind:'document',operation,place:'fixture.room',minutes:1,label:'Handle a document',description:'Handle the held document.',report:`You performed the ${operation} action.`,object:{key:`fixture.document.${operation}`,value:true}}))];
test('timed preparation and document handling retain action/object facts without inventing recipes or delivery',()=>{
 const ds=defineCastMaking({schema:1,rows:timedRows},binding);
 for(const [id,d] of createSimulationRegistry({commands:ds}).commands)registry.simulation.commands.set(id,d);
 let p=setup();p=wait(start(p,'fixture.prep.unbound'),2);
 assert.equal(p.state.actors.player.facts['fixture.materials.arranged'],true);
 assert.equal(p.gameplay.player.inventory[key('fixture.liquid')],undefined);
 for(const operation of ['write','read','inscribe','destroy','handle']){
  p=wait(start(p,`fixture.document.${operation}`),1);assert.equal(p.state.actors.player.facts[`fixture.document.${operation}`],true);
 }
 assert.equal(p.state.simulation.knowledge['fixture.other']?.['making.fixture.document.write'],undefined);
 p=wait(start(p,'fixture.prep.stock'),1);assert.equal(p.gameplay.player.inventory[key('fixture.leaf')],1);
 const empty=setup();delete empty.gameplay.player.inventory[key('fixture.leaf')];assert.throws(()=>start(empty,'fixture.prep.stock'));
 let interrupted=start(setup(),'fixture.prep.stock');interrupted.state.simulation.people.player.location='fixture.elsewhere';interrupted=wait(interrupted,1);
 assert.equal(interrupted.gameplay.player.inventory[key('fixture.leaf')],2);assert.equal(interrupted.state.simulation.knowledge.player['making.fixture.prep.stock'],undefined);
 for(const mutate of [r=>r.kind='equipment',r=>r.delivery={to:'fixture.other'},r=>r.inputs=[{key:key('fixture.leaf'),qty:0}],r=>delete r.object]){
  const row=structuredClone(timedRows[2]);mutate(row);assert.throws(()=>defineCastMaking({schema:1,rows:[row]},binding));
 }
});

test('live joins preserve pending and used batches through native Save, reload, Export and Import', {timeout:300000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-mk1-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }

 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`
export {whenCastLoaded as mkReady} from './book_world_lotm_cast_days.js';
export const mkEnroll=()=>domainRegistry.command('lotm','enrollBeFresh')();
export const mkValidate=save=>validateSaveEnvelope(save,game_version);
export const mkAct=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};
`);
 const items=join(dir,'src/items.js');
 await writeFile(items,(await readFile(items,'utf8'))+`\nfor(const id of ['fixture.leaf','fixture.water','fixture.tool','fixture.liquid'])item_templates[id]=new Material({id,name:id,description:'Synthetic material.',value:1});\n`);
 const evidence={label:'I',locator:'fixture p1'},people=[{id:'fixture.person.lead',indexId:'fixture.person.lead',name:'Lead',tier:'principal',relations:[],knows:[],wants:[],...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.room',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule:[],
 places:[{id:'fixture.room',indexId:'fixture.room',name:'Room',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
 bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule:[],beats:[beat]},
 leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.room',blurb:'Begin at home.'},knownPlaces:['fixture.room'],history:[],relations:[],intentions:[],untakenChoices:[]},making:{...data,rows:[...data.rows,...timedRows]}};
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const buildOut=join(dir,'mk1-build');
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:buildOut},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');
 t.diagnostic('Disposable integrated build SHA-256: '+createHash('sha256').update(await readFile(join(buildOut,'dist/bundle.js'))).digest('hex'));
 const worker=join(dir,'mk1-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const key=id=>JSON.stringify({id});
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.mkReady();g.module.mkEnroll();
 let initial=JSON.parse(g.internals.create_save());
 initial.expansion.simulation.knowledge.player||={};
 initial.expansion.simulation.knowledge.player['fixture.recipe']={stage:'seen',value:'A known method.',at:initial.expansion.clock,cause:'fixture.setup'};
 for(const id of ['fixture.leaf','fixture.water','fixture.tool'])initial.inventories.person.main_character[key(id)]={count:2};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+id+'"]');
 assert.ok(button('fixture.make'),'making route is reachable');
 assert.equal(button('fixture.make.use').disabled,true);
 assert.equal(document.querySelector('[data-lotm-making]').dataset.perspective,'player');
 g.module.mkAct('fixture.make');let saved=await g.save();
 assert.equal(g.internals.foundationSaveBlocked,false);
 assert.ok(saved.expansion.simulation.jobs.some(j=>j.commandId==='fixture.make'));
 const bad=structuredClone(saved),job=bad.expansion.simulation.jobs.find(j=>j.commandId==='fixture.make');job.effects[0].amount=2;
 assert.throws(()=>g.module.mkValidate(bad),/exact admitted definition/);
 const badSupport=structuredClone(saved);badSupport.expansion.simulation.jobs.find(j=>j.commandId==='fixture.make').completionSupport.location='fixture.other';
 assert.throws(()=>g.module.mkValidate(badSupport),/support differs/);
 // Pending Export/Import, then reload and settle through the live job owner.
 let encoded=await g.exportFile();await g.importFile(encoded);await g.reload();await g.step(2);
 saved=await g.save();assert.equal(saved.inventories.person.main_character[key('fixture.liquid')].count,1);
 assert.equal(saved.inventories.person.main_character[key('fixture.leaf')].count,1);
 assert.equal(saved.inventories.person.main_character[key('fixture.tool')].count,2);
 assert.equal(button('fixture.make.use').disabled,false);
 saved.character.hp_to_full=8;await g.load(saved);await g.settle();
 const beforeUse=(await g.save()).character.hp_to_full;
 g.module.mkAct('fixture.make.use');await g.save();await g.reload();await g.step(1);
 saved=await g.save();assert.ok(saved.character.hp_to_full<=beforeUse-4,'resolved product reaches native health');assert.equal(saved.inventories.person.main_character[key('fixture.liquid')],undefined);
 assert.equal(saved.expansion.simulation.knowledge.player['making.fixture.make.used'].value,'You drank the liquid.');
 encoded=await g.exportFile();await g.importFile(encoded);await g.reload();
 const after=await g.save();assert.equal(after.expansion.simulation.knowledge.player['making.fixture.make.used'].value,'You drank the liquid.');
 assert.equal(after.inventories.person.main_character[key('fixture.leaf')].count,1);
 assert.equal(after.inventories.person.main_character[key('fixture.liquid')],undefined);
 g.module.mkAct('fixture.prep.unbound');let timed=await g.save();
 const timedJob=timed.expansion.simulation.jobs.find(j=>j.commandId==='fixture.prep.unbound');assert.ok(timedJob);
 const badTimed=structuredClone(timed);badTimed.expansion.simulation.jobs.find(j=>j.id===timedJob.id).effects[0].value=false;
 assert.throws(()=>g.module.mkValidate(badTimed),/exact admitted definition/);
 await g.reload();const timedExport=await g.exportFile();await g.importFile(timedExport);await g.step(3);
 assert.equal((await g.save()).expansion.actors.player.facts['fixture.materials.arranged'],true);
 g.module.mkAct('fixture.document.write');await g.step(2);await g.reload();
 const writtenExport=await g.exportFile();await g.importFile(writtenExport);
 timed=await g.save();assert.equal(timed.expansion.actors.player.facts['fixture.document.write'],true);
 assert.equal(timed.expansion.simulation.knowledge.player['making.fixture.document.write'].value,'You performed the write action.');
 g.module.mkAct('fixture.prep.stock');await g.step(2);
 assert.equal((await g.save()).inventories.person.main_character[key('fixture.leaf')],undefined);
 assert.deepEqual(g.errors,[]);assert.equal(g.internals.foundationSaveBlocked,false);
} finally {g.close();}
`);
 try{await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});}
 catch(error){assert.fail(`Native making fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
