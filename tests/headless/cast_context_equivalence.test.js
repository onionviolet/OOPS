// Frozen P7 differential. Run explicitly; the coordinator owns the full suite.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readdir,symlink,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile),root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const changed=['src/main.js','src/world_completion_facts.js'];
const ports="\nexport {whenCastLoaded as p5CastReady} from './book_world_lotm_cast_days.js';\nexport {openStepperBatch};\nexport {setClockSpanModeForTests} from './clock_owner.js';\nexport const p5EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\nexport {simulationNativeContexts as p7Contexts};\n";
test('actor reads, observer promotions, state and exact save bytes equal the frozen eager path',async t=>{
 const baseline=process.env.YAIRPG_CONTEXT_BASELINE;
 if(!baseline){t.skip('Set YAIRPG_CONTEXT_BASELINE to frozen pre-P7 source and pack');return;}
 const temp=await mkdtemp(join(tmpdir(),'yairpg-context-equivalence-')),receipts=[];
 // Use one frozen dependency tree; concurrent unrelated source edits cannot enter one side.
 for(const pack of ['live','candidate'])await t.test(pack,async()=>{
  const outputs=[];
  for(const phase of ['before','after']){
   const dir=join(temp,phase+'-'+pack);
   for(const name of ['src','scripts','tests','private_packs'])await cp(join(baseline,name),join(dir,name),{recursive:true});
   for(const e of await readdir(root,{withFileTypes:true}))if(!['.git','src','scripts','tests','private_packs'].includes(e.name))await symlink(join(root,e.name),join(dir,e.name),e.isDirectory()?'dir':'file');
   if(pack==='candidate')await cp(process.env.YAIRPG_CONTEXT_PACK||join(baseline+'-candidate','private_packs/lotm-cast/cast.json'),join(dir,'private_packs/lotm-cast/cast.json'));
   if(phase==='after')for(const path of changed)await cp(join(root,path),join(dir,path));
   let main=await readFile(join(dir,'src/main.js'),'utf8');
   if(!main.includes('as p5CastReady'))main+=ports;
   await writeFile(join(dir,'src/main.js'),main);
   const out=join(temp,phase+'-'+pack+'.json');
   await exec(process.execPath,[join(root,'tests/headless/cast_context_fixture.mjs'),dir,'beside',out],{timeout:240000,maxBuffer:1024*1024});
   outputs.push(JSON.parse(await readFile(out,'utf8')));
  }
  for(const key of ['state','save','samples','explicit','promoted'])assert.deepEqual(outputs[1][key],outputs[0][key],key);
  const row={pack,equalState:true,equalSaveBytes:true,equalObservedFacts:true,equalExplicitFacts:true,before:{minuteMs:outputs[0].minuteMs,waitMs:outputs[0].ms},after:{minuteMs:outputs[1].minuteMs,waitMs:outputs[1].ms}};
  receipts.push(row);await writeFile(join(temp,'receipt.json'),JSON.stringify(receipts,null,2));t.diagnostic(JSON.stringify(row));
 });
 t.diagnostic('Frozen inputs and private exact outputs: '+temp);
});
