import test from 'node:test';
import assert from 'node:assert/strict';

test('prepared card host integration preserves pending and settled card state through the real validator', {timeout:300000}, async t=>{
 const {mkdtemp,cp,readdir,symlink,mkdir,writeFile,readFile,rm}=await import('node:fs/promises');
 const {join}=await import('node:path');const {tmpdir}=await import('node:os');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const exec=promisify(execFile),root=process.cwd(),dir=await mkdtemp(join(tmpdir(),'yairpg-cr2-save-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts','tests'])await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true}))if(!['.git','src','scripts','tests','private_packs'].includes(entry.name))await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 const patch='docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CR2_INTEGRATION.patch';
 let integrated=true;try{await exec('git',['apply','-R','--check',join(root,patch)],{cwd:root});}catch{integrated=false;}
 if(!integrated)await exec('git',['apply',join(root,patch)],{cwd:dir});
 const main=join(dir,'src/main.js');await writeFile(main,(await readFile(main,'utf8'))+`\nexport {whenCastLoaded as cr2Ready} from './book_world_lotm_cast_days.js';\nexport const cr2Enroll=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport const cr2Validate=save=>validateSaveEnvelope(save,game_version);\nexport const cr2Act=id=>{domainRegistry.refresh();document.querySelector('[data-lotm="'+id+'"]').onclick();};\n`);
 const ev={label:'I',locator:'fixture page'},person={id:'fixture.person.lead',indexId:'fixture.person.lead',name:'Lead',tier:'principal',relations:[],knows:[],wants:[],...ev};
 const beat={id:'fixture.beat',scene:'fixture.scene.one',actor:person.id,place:'fixture.room',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],...ev};
 const card={schema:'event-card/1',id:'card:fixture.scene.two#1',stepId:'fixture.scene.two#1',scene:'fixture.scene.two',threadId:'fixture.thread',verb:'opens',object:'the box',kind:'act',actor:'lead',place:'fixture.room',present:[],time:{date:{offsetDays:1},timeOfDay:null,precision:'day'},order:{sceneOrder:2,step:1,steps:1},inputs:[],outputs:[],gains:[],requires:[],effects:[{type:'fact',key:'fixture.card.open',value:true,class:'state'}],choices:[],lockedOptions:[],evidence:[],source:'script'};
 const pack={schema:'lotm-cast/1',people:[person],references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule:[],places:[{id:'fixture.room',indexId:'fixture.room',name:'Room',openingHours:[],travel:{district:'evernight',basis:'fixture'},...ev}],host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},bindings:{days:[{scene:'fixture.scene.one',day:1,from:0,to:1440},{scene:'fixture.scene.two',day:2,from:0,to:1440}],schedule:[],beats:[beat]},leadLife:{actorId:person.id,profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.room',blurb:'Begin at home.'},knownPlaces:['fixture.room'],history:[],relations:[],intentions:[],untakenChoices:[]},eventCards:{cards:[card]}};
 await mkdir(join(dir,'private_packs/lotm-cast'),{recursive:true});await writeFile(join(dir,'private_packs/manifest.json'),JSON.stringify({schema:1,supplements:['lotm-cast/cast.json']}));await writeFile(join(dir,'private_packs/lotm-cast/cast.json'),JSON.stringify(pack));
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:join(dir,'candidate')},timeout:60000,maxBuffer:1024*1024});
 const {createHash}=await import('node:crypto');t.diagnostic('Disposable build SHA-256: '+createHash('sha256').update(await readFile(join(dir,'candidate/dist/bundle.js'))).digest('hex'));
 const worker=join(dir,'cr2-save-worker.mjs');await writeFile(worker,`
import assert from 'node:assert/strict';import {boot} from './scripts/headless/runner.mjs';
const g=await boot(null,{seed:37,heroName:null});try{
 await g.module.cr2Ready();g.module.cr2Enroll();let saved=await g.save();assert.equal(saved.expansion.actors.player.facts['fixture.card.open'],undefined,'future card has no early effect');assert.equal(g.internals.foundationSaveBlocked,false);
 await g.reload();let encoded=await g.exportFile();await g.importFile(encoded);assert.equal(g.internals.foundationSaveBlocked,false);
 try{await g.step(1440);}catch(error){throw new Error('native errors '+JSON.stringify(g.errors)+'; '+error.message)}saved=await g.save();assert.equal(saved.expansion.actors.player.facts['fixture.card.open'],true);const findReport=value=>{if(value&&typeof value==='object'){if(value.text==='fixture.thread: opens the box')return value;for(const child of Object.values(value)){const hit=findReport(child);if(hit)return hit;}}};assert.ok(findReport(saved),'card report is stored in the existing report ledger');const find=(value,key)=>{if(value&&typeof value==='object'){if(Object.hasOwn(value,key))return value[key];for(const child of Object.values(value)){const hit=find(child,key);if(hit!==undefined)return hit;}}};
 const marker='lotm.cast.card.card:fixture.scene.two_1.settled';assert.equal(find(saved,marker),true);
 const bad=structuredClone(saved);const replace=(value,key)=>{if(value&&typeof value==='object'){if(Object.hasOwn(value,key)){value[key]='yes';return true;}for(const child of Object.values(value))if(replace(child,key))return true;}return false;};assert.ok(replace(bad,marker));assert.throws(()=>g.module.cr2Validate(bad),/Invalid saved card state/);
 const altered=structuredClone(saved);assert.ok(replace(altered,'fixture.card.open'));assert.throws(()=>g.module.cr2Validate(altered),/Saved card effect differs/);
 await g.reload();encoded=await g.exportFile();await g.importFile(encoded);saved=await g.save();assert.equal(saved.expansion.actors.player.facts['fixture.card.open'],true);assert.equal(g.internals.foundationSaveBlocked,false);assert.deepEqual(g.errors,[]);
}finally{g.close();}
`);
 await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024});
});
