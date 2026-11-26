import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {runFixtureWorker} from './helpers/fixture_process.mjs';

test('aborting a fixture stops its worker and descendant before cleanup can run',{timeout:15000},async t=>{
 const dir=await mkdtemp(join(tmpdir(),'yairpg-worker-')),marker=join(dir,'ready.json');
 t.after(()=>rm(dir,{recursive:true,force:true}));
 const controller=new AbortController();
 const descendant=`require('fs').writeFileSync(${JSON.stringify(marker)},JSON.stringify({parent:process.ppid,child:process.pid}));setInterval(()=>{},1000);`;
 const worker=`require('child_process').spawn(process.execPath,['-e',${JSON.stringify(descendant)}],{stdio:'inherit'});setInterval(()=>{},1000);`;
 const pending=runFixtureWorker(process.execPath,['-e',worker],{signal:controller.signal,timeout:10000});
 // Attach rejection handling before abort; the marker means both processes exist.
 const rejected=assert.rejects(pending,{code:'ABORT_ERR'});
 let pids;
 for(let i=0;i<500;i++){try{pids=JSON.parse(await readFile(marker,'utf8'));break;}catch{await delay(10);}}
 assert.ok(pids,'descendant started');controller.abort();await rejected;
 assert.ok(await stat(dir),'caller still owns the fixture until worker shutdown completes');
 for(const pid of Object.values(pids))assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});
});

test('fixture worker retains successful output and enforces its existing timeout',async()=>{
 assert.equal((await runFixtureWorker(process.execPath,['-e',"process.stdout.write('ok')"],{timeout:5000})).stdout,'ok');
 await assert.rejects(runFixtureWorker(process.execPath,['-e','setInterval(()=>{},1000)'],{timeout:50}),{code:'ETIMEDOUT'});
});
