// Canonical local Workbench API attachment; no second browser or game run.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('.'),directory='docs/representations/evidence/glow-earned-current-a686-2026-11-25';
const proposal='7f5b831dd993bdc625dbfce2afb8532b13de4a797897a24ecb899a50a4989c1f';
const report='16e35564706bceaefc0827ad5d8408c7a01408634d9c3c114df24d6d25c06002';
const proofPath=directory+'/proof.json',proofBytes=readFileSync(proofPath),proof=JSON.parse(proofBytes);
assert.equal(proof.bundleSha256,'a6863a9d600d192a9c50102a1f0762472172c9f003f747f20807e640dd43c8ca');assert.deepEqual(proof.errors,[]);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const reportPath=join(root,'work/atlas-reading-handoffs/implementation-reports',report+'.json'),before=sha(readFileSync(reportPath));
const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
try{
    const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas stopped '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
    const queue=await(await fetch(base+'/reading-handoffs')).json();
    const entry=queue.entries.find(entry=>entry.id===proposal);assert(entry);
    assert.equal(entry.implementationReports.find(row=>row.id===report)?.consumer.path,'src/ui/feel_finish.js');
    const route=`/reading-handoffs/${proposal}/implementation-reports/${report}/playtests`;
    const response=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({proofPath})});
    if(!response.ok)throw Error(await response.text());const attached=await response.json();
    const comparison=await(await fetch(base+route+'/'+attached.id+'/build-check',{cache:'no-store'})).json();assert.equal(comparison.status,'exact-match');assert.equal(comparison.currentBundleSha256,proof.bundleSha256);
    const reopened=await(await fetch(base+'/reading-handoffs')).json();assert(reopened.entries.find(entry=>entry.id===proposal).implementationReports.find(row=>row.id===report).playtests.some(row=>row.id===attached.id));
    assert.equal(sha(readFileSync(reportPath)),before);assert.equal(sha(readFileSync(proofPath)),sha(proofBytes));
    const result={proposalId:proposal,reportId:report,attachmentId:attached.id,proofPath,proofSha256:sha(proofBytes),method:'Canonical local Workbench API; saved attachment reopened and compared without another game/browser run',comparison};
    writeFileSync(join(directory,'workbench-attachment.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
}finally{if(server.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}}
