import test from 'node:test';
import {mkdtemp, cp, readdir, symlink, writeFile, readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';

test('prepared integration: fresh native meeting fixture, rendered reaction, Save/reload/Export/Import and faded fixture', {timeout:300000}, async t => {
 const exec=promisify(execFile), root=process.cwd(), dir=await mkdtemp(join(tmpdir(),'yairpg-mr2-route-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','scripts','tests']) await cp(join(root,name),join(dir,name),{recursive:true});
 for(const entry of await readdir(root,{withFileTypes:true})) if(!['.git','src','scripts','tests','private_packs','.lane-builds'].includes(entry.name))
  await symlink(join(root,entry.name),join(dir,entry.name),entry.isDirectory()?'dir':'file');
 const patch=join(root,'docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR2_INTEGRATION.patch');
 let integrated=true;
 try {await exec('git',['apply','-R','--check',patch],{cwd:root});} catch {integrated=false;}
 if(!integrated) await exec('git',['apply',patch],{cwd:dir});
 const arch=await exec(process.execPath,['scripts/check_architecture.mjs'],{cwd:dir,timeout:60000,maxBuffer:1024*1024});
 t.diagnostic('Patched architecture: '+arch.stdout.trim());
 const regressionEnv={...process.env}; delete regressionEnv.NODE_TEST_CONTEXT;
 const regression=await exec(process.execPath,['--test','--test-reporter=tap','tests/simulation.test.js','tests/everyday_life.test.js','tests/simulation_ui_hidden.test.js','tests/simulation_hidden_display.test.js','tests/simulation_extensions.test.js'],{cwd:dir,env:regressionEnv,timeout:60000,maxBuffer:1024*1024});
 if(!/^# tests \d+/m.test(regression.stdout)) throw Error('Missing regression-run receipt: '+regression.stdout+' '+regression.stderr);
 t.diagnostic('Patched existing simulation/panel regressions: '+regression.stdout.split('\n').filter(line=>/^# (tests|pass|fail)/.test(line)).join('; '));
 const main=join(dir,'src/main.js');
 await writeFile(main,(await readFile(main,'utf8'))+`\nexport const mr2Render = () => simulationPanel.render();\nexport const mr2Open = () => expandWorkspaceModule('notebook');\nexport const mr2Act = actSimulation;\nexport const mr2Memory = () => domainRegistry.command('memory','read')();\nexport const mr2MeetingFixture = () => process_rewards({rewards:{dialogues:['old craftsman']},source_type:'textline',source_name:'villageElder'});\n`);
 await exec(process.execPath,['build.js'],{cwd:dir,env:{...process.env,BUILD_OUT:join(dir,'candidate')},timeout:60000,maxBuffer:1024*1024});
 t.diagnostic('Disposable bundle SHA-256: '+createHash('sha256').update(await readFile(join(dir,'candidate/dist/bundle.js'))).digest('hex'));
 const worker=join(dir,'mr2-route-worker.mjs');
 await writeFile(worker,`
import assert from 'node:assert/strict';
import {boot} from './scripts/headless/runner.mjs';
import {readMemories, freshMemory} from './src/person_memory.js';
import {calendarMinutes} from './src/world_rhythm.js';
import {applySimulationEffects} from './src/simulation_effects.js';
import {persistExpansionPlan} from './src/expansion_persistence.js';
const g=await boot(null,{seed:37,heroName:null});
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
 // Click the actual workshop control; do not inject a memory or a relationship.
 const control=g.$('[data-simulation="village.working_habits"]');
 assert.ok(control); assert.equal(control.disabled,false); assert.equal(control.hidden,false);
 g.module.mr2Open();
 await g.click('#notebook_tab_people');
 g.$('#simulation_panel').open=true;
 await g.click(control);
 g.module.mr2Render();
 const line=g.text('#workshop_personal_detail');
 assert.match(line,/since you asked about his working habits/);
 let saved=await g.save();
 const day=Math.floor(calendarMinutes(saved['current time'])/1440);
 assert.equal(readMemories(saved.memory,'oldCraftsman',day).filter(e=>e.about==='player').length,1);
 const memory=structuredClone(saved.memory);
 await g.reload(); g.module.mr2Render();
 assert.deepEqual((await g.save()).memory,memory);
 assert.match(g.text('#workshop_personal_detail'),/since you asked about his working habits/);
 const exported=await g.exportFile(); await g.importFile(exported);
 g.module.mr2Render(); assert.deepEqual((await g.save()).memory,memory);
 assert.match(g.text('#workshop_personal_detail'),/since you asked about his working habits/);
 // Test-only clock fixture: later native date, with the earned memory retained.
 saved=await g.save(); saved['current time'].year+=30;
 await g.load(saved); g.module.mr2Render();
 assert.doesNotMatch(g.text('#workshop_personal_detail'),/since you asked about his working habits/);
 const old=await g.save(); delete old.memory;
 await g.importFile('YAIR-UTF8-1:'+Buffer.from(JSON.stringify(old)).toString('base64'));
 g.module.mr2Render(); assert.deepEqual((await g.save()).memory ?? freshMemory(),freshMemory());
 assert.doesNotMatch(g.text('#workshop_personal_detail'),/since you asked about his working habits/);
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
 try {const result=await exec(process.execPath,[worker],{cwd:dir,timeout:270000,maxBuffer:1024*1024}); if(result.stdout.trim())t.diagnostic(result.stdout.trim());}
 catch(error){throw Error(error.message+'\n'+(error.stdout||'')+'\n'+(error.stderr||''));}
});
