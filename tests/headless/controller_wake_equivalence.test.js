// Deliberately outside the ordinary unit glob: this is a 349-minute full-game
// differential harness. Run explicitly; browser performance remains separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,readdir,symlink,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile),root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const worker=fileURLToPath(new URL('./controller_wake_fixture.mjs',import.meta.url));
async function snapshot(source,dir,candidate,packRoot,supportRoot) {
 await cp(join(source,'src'),join(dir,'src'),{recursive:true});
 await cp(join(supportRoot,'scripts'),join(dir,'scripts'),{recursive:true});
 await cp(join(supportRoot,'tests'),join(dir,'tests'),{recursive:true});
 for(const e of await readdir(root,{withFileTypes:true}))if(!['.git','src','scripts','tests','private_packs'].includes(e.name))await symlink(join(root,e.name),join(dir,e.name),e.isDirectory()?'dir':'file');
 await symlink(packRoot,join(dir,'private_packs'),'dir');
 let main=await readFile(join(dir,'src/main.js'),'utf8');
 if(!main.includes('as p5CastReady'))main+="\nexport {whenCastLoaded as p5CastReady} from './book_world_lotm_cast_days.js';\n";
 if(!main.includes('export {openStepperBatch}'))main+='\nexport {openStepperBatch};\n';
 if(!main.includes('export {setClockSpanModeForTests}'))main+="\nexport {setClockSpanModeForTests} from './clock_owner.js';\n";
 if(!main.includes('export const p5EnrollBe'))main+="\nexport const p5EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\n";
 if(candidate||!process.env.YAIRPG_WAKE_BASELINE)main+="\nexport {setControllerWakeModeForTests as p5SetWakeMode} from './expansion_engine.js';\n";
 // Count existing publications without disabling them or changing their order.
 main=main.replace(/function (?:p5original_)?persistExpansion\(([^\n]*?)\) ?\{/,m=>m+'\n if(window.__wakeFixture)window.__wakeFixture.publications++;');
 await writeFile(join(dir,'src/main.js'),main);
 let kernel=await readFile(join(dir,'src/expansion_engine.js'),'utf8');
 assert.ok(kernel.includes('advanceSimulationBoundary(simulationPlan, registry,'));
 kernel=kernel.replace('advanceSimulationBoundary(simulationPlan, registry,','(window.__wakeFixture && window.__wakeFixture.boundaries++, advanceSimulationBoundary)(simulationPlan, registry,');
 await writeFile(join(dir,'src/expansion_engine.js'),kernel);
}
test('four full-game fixtures preserve state/save bytes in both existing clock modes',async t=>{
 const temp=await mkdtemp(join(tmpdir(),'yairpg-controller-equivalence-')),before=join(temp,'before'),after=join(temp,'after');
 await writeFile(join(temp,'runner.json'),JSON.stringify({pid:process.pid,baseline:process.env.YAIRPG_WAKE_BASELINE||root}));
 const frozen=join(temp,'frozen');await mkdir(frozen);
 for(const name of ['src','scripts','tests'])await cp(join(root,name),join(frozen,name),{recursive:true});
 const packRoot=join(temp,'private_packs');await cp(join(root,'private_packs'),packRoot,{recursive:true});
 await snapshot(process.env.YAIRPG_WAKE_BASELINE||frozen,before,false,packRoot,frozen);await snapshot(root,after,true,packRoot,frozen);
 let pack=false;try{await readFile(join(root,'private_packs/lotm-cast/cast.json'));pack=true;}catch{}
 const receipts=[];
 for(const kind of ['fresh','beside','reading','be'])await t.test(kind,async sub=>{
  if(['beside','be'].includes(kind)&&!pack){sub.skip('Local private fixture unavailable');return;}
  const modes=[];
  for(const mode of ['span','stepped']) {
   const outputs=[];
   for(const [dir,enabled] of [[before,false],[after,true]]) {
    const out=join(temp,`${dir===before?'before':'after'}-${kind}-${mode}.json`);
    await exec(process.execPath,[worker,dir,kind,out,mode,String(enabled)],{timeout:240000,maxBuffer:1024*1024});
    outputs.push(JSON.parse(await readFile(out,'utf8')));
   }
   assert.equal(outputs[0].state,outputs[1].state,`${kind} ${mode}: exact expansion state`);
   assert.equal(outputs[0].save,outputs[1].save,`${kind} ${mode}: exact create_save bytes`);
   assert.equal(outputs[0].publications,outputs[1].publications,`${kind} ${mode}: publication cadence`);
   if(kind==='be'&&mode==='span')assert.ok(outputs[1].boundaries<=outputs[0].boundaries/2,'be span boundaries at least halved');
   const row={kind,mode,equalState:true,equalSaveBytes:true,before:{ms:outputs[0].ms,boundaries:outputs[0].boundaries,publications:outputs[0].publications},after:{ms:outputs[1].ms,boundaries:outputs[1].boundaries,publications:outputs[1].publications}};
   receipts.push(row);sub.diagnostic(JSON.stringify(row));modes.push(outputs[1]);
   await writeFile(join(temp,'receipt.json'),JSON.stringify(receipts,null,2));
  }
  // P4 F4's local-life difference is reported, never normalized away or used to
  // authorize changing native publication cadence.
  sub.diagnostic(`span/stepped equality: state=${modes[0].state===modes[1].state}, save=${modes[0].save===modes[1].save}`);
 });
 t.diagnostic(`Frozen inputs and exact local outputs: ${temp}`);
});
