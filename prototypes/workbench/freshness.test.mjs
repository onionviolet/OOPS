import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {studyFreshness} from './freshness.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex');
test('matching source remains a sketch; source and built-output drift are detected',async()=>{
 const root=await mkdtemp(join(tmpdir(),'oops-freshness-'));const workbench=join(root,'bench');const study={id:'test',fidelity:'sketch',entry:'built/test/index.html'};
 try{await mkdir(join(workbench,'built/test'),{recursive:true});await writeFile(join(root,'producer.js'),'original');await writeFile(join(workbench,'built/test/study.js'),'bundle');await writeFile(join(workbench,'built/test/INPUTS.json'),JSON.stringify({sourceHashes:{'producer.js':hash('original')},outputHashes:{'study.js':hash('bundle')}}));const options={workbench,repository:root};
 let r=await studyFreshness(study,options);assert.equal(r.status,'matching');assert.match(r.message,/simplified sketch/);
 await writeFile(join(root,'producer.js'),'changed');r=await studyFreshness(study,options);assert.equal(r.status,'stale');assert.deepEqual(r.changed,['source: producer.js']);
 await writeFile(join(root,'producer.js'),'original');await writeFile(join(workbench,'built/test/study.js'),'other');r=await studyFreshness(study,options);assert.equal(r.status,'stale');assert.deepEqual(r.changed,['build: study.js']);
 await rm(join(workbench,'built/test/study.js'));r=await studyFreshness(study,options);assert.match(r.changed[0],/build missing/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('archived and missing manifests cannot claim current native UI',async()=>{assert.equal((await studyFreshness({id:'old',fidelity:'archived'},{workbench:'.',repository:'.'})).status,'archived');assert.equal((await studyFreshness({id:'unknown',entry:'missing/index.html'},{workbench:'.',repository:'.'})).status,'unverified');});
