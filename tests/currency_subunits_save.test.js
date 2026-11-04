import test from 'node:test';
import assert from 'node:assert/strict';

const key=id=>JSON.stringify(id==='fixture.cloth'?{id,quality:100}:{id});
const FIXTURE_ROWS = () => {
const data={schema:1,rows:[
 {id:'fixture.buy',revision:1,kind:'purchase',sellerId:'fixture.vendor',place:'fixture.room',minutes:2,
 label:'Buy the bundle',description:'Exchange money for the held bundle and receive change.',report:'You bought the bundle.',
 items:[{key:key('fixture.cloth'),count:1,label:'cloth'},{key:key('fixture.food'),count:2,label:'food'}],
 price:{total:7,unit:'small coins',moneyPerUnit:1,tender:10,change:3}},
 {id:'fixture.wear',revision:1,kind:'wear',place:'fixture.room',minutes:1,label:'Put on the cloth',description:'Put the carried cloth in the clothing slot.',report:'You put on the cloth.',key:key('fixture.cloth'),slot:'torso'}]};
return data;};
// R2: a halfpenny purse in the Tingen/BE seat survives native Save, reload, Export and Import and shows as a halfpenny line.
// The fixture builds the live source with the same disposable cast pack as tests/cast_exchange_adapter.test.js.
test('a halfpenny purse round-trips native Save, reload, Export and Import in the Tingen seat', {timeout:300000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join,resolve}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-r2-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }

 await mkdir(join(dir,'tests'));await cp(join(root,'tests/perspective_controls.test.js'),join(dir,'tests/perspective_controls.test.js'));
 t.diagnostic('CU1 fixture tests the live integrated source.');
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
 const data=FIXTURE_ROWS();
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
 const buildOut=join(dir,'r2-build');
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:buildOut},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');
 t.diagnostic('Live-source disposable build SHA-256: '+createHash('sha256').update(await readFile(join(buildOut,'dist/bundle.js'))).digest('hex'));
 const worker=join(dir,'r2-save-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});
try {
 await g.module.cuReady();g.module.cuEnroll();
 let initial=JSON.parse(g.internals.create_save());
 assert.equal(initial.expansion.actors.player.worldId,'book.lotm.tingen');
 initial.character.money=2732.5;
 await g.load(initial);await g.settle();
 const shown=()=>document.getElementById('money_div').textContent;
 assert.match(shown(),/2732½ pence/);
 let saved=await g.save();assert.equal(saved.character.money,2732.5);
 g.module.cuValidate(saved);
 let encoded=await g.exportFile();await g.importFile(encoded);await g.reload();
 saved=await g.save();assert.equal(saved.character.money,2732.5);assert.match(shown(),/2732½ pence/);
 await g.step(2);saved=await g.save();assert.equal(saved.character.money,2732.5);
 assert.deepEqual(g.errors,[]);assert.equal(g.internals.foundationSaveBlocked,false);
 console.log('shown: '+shown());
} finally {g.close();}
`);
 try{const r=await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});t.diagnostic(r.stdout.trim());}
 catch(error){assert.fail(`Halfpenny save fixture failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
