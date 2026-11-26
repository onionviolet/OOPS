// Attach the independently completed public native receipt through ordinary Workbench controls.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const proposal='69772c5a2df1f201e9299ef2b923eb24fbe1093a99b4d79ad5ad8f4e27320724';
const report='04931f697003fbcb3ff98ef4727eec33a6df681fcf8ccf9643af7a5cc07ae418';
const directory='docs/representations/evidence/ri-leaf-source-native-2026-11-25',proofPath=directory+'/proof.json';
const sha=value=>createHash('sha256').update(value).digest('hex');
const proofBytes=readFileSync(join(root,proofPath)),proof=JSON.parse(proofBytes);
assert.equal(proof.proposalId,proposal);assert.equal(proof.reportId,report);assert.deepEqual(proof.errors,[]);
const savedReport=join(root,'work/atlas-reading-handoffs/implementation-reports',report+'.json'),before=sha(readFileSync(savedReport));
let browser,server;const errors=[];
try{
    const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;
    server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
    const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas stopped '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const match=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});});
    browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/#workbench/handoffs/'+proposal);
    const section=page.locator('.reading-implementation-report').filter({hasText:'src/ri_leaf_treatment.js'});await section.waitFor();
    await section.getByText('Attach native playtest receipt',{exact:true}).click();await section.getByLabel('Public proof JSON path',{exact:true}).fill(proofPath);
    const response=page.waitForResponse(response=>response.request().method()==='POST'&&response.url().endsWith(`/implementation-reports/${report}/playtests`));
    await section.getByRole('button',{name:'Attach playtest',exact:true}).click();const attachedResponse=await response;assert(attachedResponse.ok(),await attachedResponse.text());const attached=await attachedResponse.json();
    await page.reload();const evidence=page.locator(`[data-playtest-id="${attached.id}"]`);await evidence.waitFor();
    const checking=page.waitForResponse(response=>response.url().endsWith(`/playtests/${attached.id}/build-check`));await evidence.getByRole('button',{name:'Compare checkout build',exact:true}).click();
    const comparison=await(await checking).json();assert.equal(comparison.status,'exact-match');assert.equal(comparison.currentBundleSha256,proof.bundleSha256);
    await evidence.getByText('Tested on this exact checkout build.',{exact:true}).waitFor();await evidence.scrollIntoViewIfNeeded();await page.screenshot({path:join(root,directory,'workbench-native-receipt-1920.png')});
    assert.equal(sha(readFileSync(savedReport)),before,'existing immutable report unchanged');assert.equal(sha(readFileSync(join(root,proofPath))),sha(proofBytes),'frozen native proof unchanged');assert.deepEqual(errors,[]);
    const result={proposalId:proposal,reportId:report,attachmentId:attached.id,proofPath,proofSha256:sha(proofBytes),comparison,errors,route:'/#workbench/handoffs/'+proposal};
    writeFileSync(join(root,directory,'workbench-attachment.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{if(browser)await browser.close();if(server&&server.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}}
