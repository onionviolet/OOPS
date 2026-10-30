import test from 'node:test';
import {mkdtemp, cp, readdir, symlink, writeFile, readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';

test('native trait route: fresh meeting/supply fixture, interruption, amends, rendered reaction and Save/reload/Export/Import', {timeout:660000}, async t => {
 const exec=promisify(execFile), root=process.cwd(), dir=await mkdtemp(join(tmpdir(),'yairpg-mr2-route-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts','tests']) await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})) if(!['.git','src','scripts','tests','private_packs','.lane-builds'].includes(entry.name))
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 // MR1/MR2 are integrated. Existing simulation regressions run separately, once.
 // Named native fixture: background tab, decorative mutation observers paused; explicit workshop render only.
 const main=join(dir,'src/main.js');
 await writeFile(main,'document.hidden = true; globalThis.MutationObserver = class {observe() {} disconnect() {} takeRecords() {return [];}};\n'+(await readFile(main,'utf8'))+`\nexport const mr2Render = () => simulationPanel.render();\nexport const mr2Open = () => expandWorkspaceModule('notebook');\nexport const mr2Act = actSimulation;\nexport const mr3SuppliesFixture = () => process_rewards({rewards:{money:1,items:[{item:'Rough wood log',count:3}]},source_type:'textline',source_name:'mr3.fixture'});\nexport const mr2Memory = () => domainRegistry.command('memory','read')();\nexport const mr2MeetingFixture = () => process_rewards({rewards:{dialogues:['old craftsman']},source_type:'textline',source_name:'villageElder'});\n`);
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:join(dir,'candidate')},timeout:60000,maxBuffer:1024*1024});
 t.diagnostic('Disposable bundle SHA-256: '+createHash('sha256').update(await readFile(join(dir,'candidate/dist/bundle.js'))).digest('hex'));
 const worker=join(dir,'mr2-route-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';

import {HeadlessGame} from './scripts/headless/runner.mjs';
// This native fixture does not certify the harness's attribute polling or foreground UI.
const settleNative=HeadlessGame.prototype.settle;
HeadlessGame.prototype.settle=function(ms){this.attributeObservers?.clear();return settleNative.call(this,ms);};
import {readMemories, freshMemory} from './src/person_memory.js';
import {calendarMinutes} from './src/world_rhythm.js';
import {applySimulationEffects} from './src/simulation_effects.js';
import {persistExpansionPlan} from './src/expansion_persistence.js';
const g=new HeadlessGame({seed:37,heroName:null}); g.settleMs=0; await g.reload();
try {
 assert.deepEqual((await g.save()).memory ?? freshMemory(),freshMemory());
 await g.call('start_dialogue','villageElder');
 await g.call('start_textline','hello');
 await g.call('end_dialogue');
 // Named prerequisite fixture: unlock the craftsman meeting, normally earned after the field.
 g.module.mr2MeetingFixture();
 await g.call('start_dialogue','oldCraftsman');
 await g.call('start_textline','hello');
 await g.call('end_dialogue');
 g.module.mr2Act({type:'enroll'});
 g.module.mr2Render();
 assert.doesNotMatch(g.text('#workshop_personal_detail'),/since you asked about his working habits/);
 // Check the real control, then use the native command. No memory or relationship injection.
 const control=g.$('[data-simulation="village.working_habits"]');
 assert.ok(control); assert.equal(control.disabled,false); assert.equal(control.hidden,false);
 g.module.mr2Act({type:'command',id:'village.working_habits',targetId:'oldCraftsman'});
 g.module.mr2Render();
 const line=g.text('#workshop_personal_detail');
 assert.match(line,/since you asked about his working habits/);
 let saved=await g.save();
 const day=Math.floor(calendarMinutes(saved['current time'])/1440);
 assert.equal(readMemories(saved.memory,'oldCraftsman',day).filter(e=>e.about==='player').length,1);
 g.module.mr3SuppliesFixture(); g.module.mr2Render();
 // MR3: real paid commands write distinct harm and amends episodes.
 assert.deepEqual(saved.expansion.simulation.knowledge.player['person.oldCraftsman.trait.forgiving'],undefined);
 for(const id of ['village.commission','village.interrupt_work']) {
  const b=g.$('[data-simulation="'+id+'"]'); assert.ok(b); assert.equal(b.disabled,false);  g.module.mr2Act({type:'command',id,targetId:'oldCraftsman'});  g.module.mr2Render();
 }
 const wary=g.text('#workshop_personal_detail'); assert.match(wary,/Wary|Cooler/); assert.match(wary,/interrupted/);

 const apology=g.$('[data-simulation="village.practical_apology"]'); assert.equal(apology.disabled,false); g.module.mr2Act({type:'command',id:'village.practical_apology',targetId:'oldCraftsman'}); g.module.mr2Render();
 const softened=g.text('#workshop_personal_detail'); assert.match(softened,/Warmer|More at ease/); assert.match(softened,/amends/);
 const afterApology=await g.save();
 const episodes=readMemories(afterApology.memory,'oldCraftsman',day);
 assert.equal(episodes.filter(e=>e.kind==='harmed').length,1); assert.equal(episodes.filter(e=>e.kind==='amends').length,1);
 assert.equal(new Set(episodes.map(e=>e.fact)).size,episodes.length,'distinct causes have distinct pointers');
 assert.equal(afterApology.expansion.simulation.knowledge.player['person.oldCraftsman.trait.forgiving'].value,'forgiving');
 await g.reload(); g.module.mr2Render(); assert.equal(g.text('#workshop_personal_detail'),softened);
 const mr3Export=await g.exportFile(); await g.importFile(mr3Export); g.module.mr2Render();
 assert.equal(g.text('#workshop_personal_detail'),softened); assert.deepEqual((await g.save()).memory,afterApology.memory);
 // Real effect receiver, including a zero-clock receipt and a failing durable store.
 const current=await g.save(), state=structuredClone(current.expansion);
 state.clock=0;
 const plan={state,external:{money:current.character.money},gameplay:{}};
 const fx={type:'relationship',actor:'oldCraftsman',target:'player',axis:'trust',amount:2,text:'Supplied the agreed materials.'};
 applySimulationEffects(plan,[fx],{actorId:'player'},g.internals.expeditionRegistry,'mr2.failure');
 applySimulationEffects(plan,[fx],{actorId:'player'},g.internals.expeditionRegistry,'mr2.failure');
 assert.equal(plan.memoryEffects.length,1,'receipt at clock zero deduplicates');
 const before=g.module.mr2Memory();
 assert.throws(()=>persistExpansionPlan(plan,{createSave:()=>JSON.stringify(current),storage:{setItem(){throw Error('disk unavailable');}},key:'fixture'}),/disk unavailable/);
 assert.deepEqual(g.module.mr2Memory(),before,'failed candidate never publishes memory');
 assert.equal(g.internals.foundationSaveBlocked,false); assert.deepEqual(g.errors,[]);
} finally {g.close();}
`);
 try {const result=await exec(process.execPath,[worker],{cwd:dir,timeout:600000,maxBuffer:1024*1024}); if(result.stdout.trim())t.diagnostic(result.stdout.trim());}
 catch(error){throw Error(error.message+'\n'+(error.stdout||'')+'\n'+(error.stderr||''));}
});
