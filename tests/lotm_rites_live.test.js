// R5/U3 live floor: the real bundle in a disposable build, a fixture BE life, one altar rite performed through the
// rendered buttons, with Save, reload, Export and Import in the middle and at the end. In-process DOM: no layout, so
// the 1920x1080 target is not measured here (receipt gap).
import test from 'node:test';
import assert from 'node:assert/strict';
test('R5/U3: the altar rite is performed from the panel, survives reload and import mid-run, and charges backlash once', {timeout:300000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-r5-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})){
  if(['.git','src','scripts','tests','private_packs'].includes(entry.name))continue;
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 }
 const mainFile=join(dir,'src/main.js');
 await writeFile(mainFile,(await readFile(mainFile,'utf8'))+`
export {whenCastLoaded as r5Ready} from './book_world_lotm_cast_days.js';
export const r5Enroll=()=>domainRegistry.command('lotm','enrollBeFresh')();
export const r5Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};
`);
 const items=join(dir,'src/items.js');
 await writeFile(items,(await readFile(items,'utf8'))+`\nfor(const id of ['lotm.item.ritual-candle','lotm.stock.quiet-fragrance'])item_templates[id]=new Material({id,name:id,description:'Synthetic material.',value:1});\n`);
 const evidence={label:'I',locator:'fixture p1'},people=[{id:'fixture.person.lead',indexId:'fixture.person.lead',name:'Lead',tier:'principal',relations:[],knows:[],wants:[],...evidence}];
 const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.room',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...evidence};
 const pack={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],clockClaims:[],beats:[beat],anchors:[],schedule:[],
  placeAliases:[{id:'fixture.alias.room',indexId:'lotm.place.klein-room',place:'fixture.room',...evidence}],
  places:[{id:'fixture.room',indexId:'fixture.room',name:'Room',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
  host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
  bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule:[],beats:[beat]},
  leadLife:{actorId:people[0].id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.room',blurb:'Begin at home.'},knownPlaces:['fixture.room'],history:[],relations:[],intentions:[],untakenChoices:[]}};
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});
 await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));
 await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 const buildOut=join(dir,'r5-build');
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:buildOut},timeout:90000,maxBuffer:1024*1024});
 const worker=join(dir,'r5-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
const key=id=>JSON.stringify({id});
const g=await boot(null,{seed:41,heroName:null});
const CALL='lotm.rite.spirit-call',ids=['set-candle-north','set-candle-east','set-candle-south','set-candle-west','altar','petition','answer'];
try {
 await g.module.r5Ready();g.module.r5Enroll();
 let initial=JSON.parse(g.internals.create_save());
 initial.inventories.person.main_character[key('lotm.item.ritual-candle')]={count:4};
 initial.inventories.person.main_character[key('lotm.stock.quiet-fragrance')]={count:1};
 await g.load(initial);await g.settle();
 const button=id=>document.querySelector('[data-lotm="'+CALL+'.'+id+'"]');
 const block=document.querySelector('[data-lotm-altar-rites]');
 assert.ok(block,'altar block is rendered');
 assert.match(block.textContent,/north corner.*east corner.*south corner.*west corner/);
 assert.ok(button(ids[0])&&!button(ids[0]).disabled,'first placement is live');
 assert.equal(button(ids[1]),null,'only the next step is a button');
 const inv=async n=>((await g.save()).inventories.person.main_character[key(n)]||{count:0}).count;
 for(const id of ids.slice(0,2)){g.module.r5Act(CALL+'.'+id);await g.step(2);}
 assert.equal(await inv('lotm.item.ritual-candle'),2);
 // Pause: reload, then Export and Import mid-ritual.
 await g.reload();let encoded=await g.exportFile();await g.importFile(encoded);await g.reload();
 assert.equal(await inv('lotm.item.ritual-candle'),2,'no candle lost or doubled');
 assert.match(document.querySelector('[data-lotm-altar-rites]').textContent,/\\(set\\)/);
 assert.ok(button(ids[2])&&!button(ids[2]).disabled,'resumes at the third corner');
 assert.equal(button(ids[0]),null);
 for(const id of ids.slice(2)){g.module.r5Act(CALL+'.'+id);await g.step(16);}
 const saved=await g.save();
 assert.equal(saved.expansion.actors.player.facts['lotm.act.'+CALL+'.done'],true);
 assert.equal(await inv('lotm.item.ritual-candle'),0);assert.equal(await inv('lotm.stock.quiet-fragrance'),0);
 encoded=await g.exportFile();await g.importFile(encoded);await g.reload();
 const after=await g.save();
 assert.equal(after.expansion.actors.player.facts['lotm.act.'+CALL+'.done'],true);
 const harm=JSON.stringify(after).match(/"power":([0-9.]+)/);
 console.log('HARM '+(harm&&harm[1]));
 assert.ok(harm&&Number(harm[1])===1.5,'backlash 1.5 once, kept through export and import');
 assert.deepEqual(g.errors,[]);assert.equal(g.internals.foundationSaveBlocked,false);
} finally {g.close();}
`);
 try{const out=await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});t.diagnostic(out.stdout.trim());}
 catch(error){assert.fail(`Altar rite live run failed: ${error.message}\n${error.stdout||''}\n${error.stderr||''}`);}
});
