// Actual immutable chapter-130/chapter-129 proposals, normal Workbench form.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,readdirSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),directory=join(root,'work/atlas-reading-handoffs');
const later='4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03',earlier='d36ab6955de9976f57e6204e1cecd183e12acdc64f322f694b686582aecdb773';
const evidencePath='docs/research/LOTM_CH130_BOUNDED_READING_2026-11-25.md';
const qualification='The chapter-130 source qualifies the chapter-129 replacement promise for this response: Old Neil reassures Klein about the used charm and intends to approach Swain later. It supports a contextual release; it does not establish a third-party agreement, claim amount or payment.';
const sha=b=>createHash('sha256').update(b).digest('hex');
const originals=()=>Object.fromEntries(['','implementation-reports','playtest-attachments'].flatMap(folder=>readdirSync(join(directory,folder)).filter(n=>/^[a-f0-9]{64}\.json$/.test(n)).map(n=>[join(folder,n),sha(readFileSync(join(directory,folder,n)))])));
const before=originals(),output=join(root,'docs/representations/evidence/atlas-proposal-qualification-2026-11-25');mkdirSync(output,{recursive:true});
let server,browser;try{
 const env={...process.env,ATLAS_PORT:'0'};for(const key of ['ATLAS_REBUILD','ATLAS_SNAPSHOT','ATLAS_READER_ROOT','ATLAS_HANDOFFS'])delete env[key];
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',c=>fail(Error('Atlas exited '+c)));server.stdout.setEncoding('utf8').on('data',s=>{const m=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#workbench/handoffs/'+later);
 await page.getByText('Link an earlier proposal',{exact:true}).click();
 await page.getByLabel('Earlier saved proposal',{exact:true}).selectOption(earlier);
 await page.getByLabel('How does this source qualify it?',{exact:true}).fill(qualification);
 await page.getByLabel('Public qualification evidence path',{exact:true}).fill(evidencePath);
 await page.getByRole('button',{name:'Save qualification link',exact:true}).click();
 await page.getByRole('heading',{name:'Qualifies an earlier proposal',exact:true}).waitFor();
 const forward=page.locator('.handoff-qualifications').getByRole('link');assert.equal(await forward.getAttribute('href'),'#workbench/handoffs/'+earlier);
 await page.screenshot({path:join(output,'later-qualifies-earlier-1920.png')});await forward.click();
 await page.getByRole('heading',{name:'Qualified by later evidence',exact:true}).waitFor();
 const back=page.locator('.handoff-qualifications').getByRole('link');assert.equal(await back.getAttribute('href'),'#workbench/handoffs/'+later);
 await page.screenshot({path:join(output,'earlier-qualified-by-later-1920.png')});await back.click();
 await page.getByRole('heading',{name:'Qualifies an earlier proposal',exact:true}).waitFor();await page.reload();
 await page.getByRole('heading',{name:'Qualifies an earlier proposal',exact:true}).waitFor();
 const queue=await(await fetch(base+'/reading-handoffs')).json(),newer=queue.entries.find(e=>e.id===later),older=queue.entries.find(e=>e.id===earlier);
 const relation=newer.qualifiesEarlier.find(r=>r.earlierProposalId===earlier&&r.qualification===qualification);assert.ok(relation);
 assert.equal(older.qualifiedByLater.find(r=>r.id===relation.id).laterProposalId,later);assert.equal(relation.files.evidence.status,'unchanged');
 const retry=await fetch(base+'/reading-handoffs/'+later+'/qualifications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({earlierProposalId:earlier,qualification,evidencePath})});
 assert.equal(retry.status,200);assert.equal((await retry.json()).id,relation.id);assert.deepEqual(originals(),before);
 assert.equal(newer.stage,'proposed');assert.equal(older.stage,'proposed');assert.deepEqual(errors,[]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const result={viewport:'1920x1080',scope:'actual persistent Workbench queue, normal explicit form; no inferred labels or gameplay promotion',laterProposalId:later,earlierProposalId:earlier,
  relation,originalStatementsUnchanged:true,originalStatementFiles:Object.keys(before).length,idempotent:true,reloaded:true,bothDirectionsClicked:true,errors};
 writeFileSync(join(output,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}
 await browser?.close();
}
