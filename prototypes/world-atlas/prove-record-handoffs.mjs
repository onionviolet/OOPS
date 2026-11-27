import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),output=join(root,'docs/representations/evidence/atlas-record-handoffs-2026-11-25');mkdirSync(output,{recursive:true});
const focus='lotm.rule.lender-release-and-compensation-intent',proposal='4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03';
const sha=b=>createHash('sha256').update(b).digest('hex');let server,browser,lastPage;
try{
 const env={...process.env,ATLAS_PORT:'0'};for(const k of ['ATLAS_REBUILD','ATLAS_SNAPSHOT','ATLAS_READER_ROOT','ATLAS_HANDOFFS'])delete env[k];
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',c=>fail(Error('Atlas exited '+c)));server.stdout.setEncoding('utf8').on('data',s=>{const m=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();const page=lastPage=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);
 const errors=[],writes=[],lookups=[];page.on('pageerror',e=>{errors.push(e.message);console.log('Page error: '+e.message);});page.on('request',r=>{if(r.method()!=='GET')writes.push(r.method()+' '+r.url());if(r.url().includes('/record-handoffs?'))lookups.push(r.url());});
 await page.goto(base+'/#world/lotm/things/'+focus);
 const trail=page.locator('.record-handoff-trail[data-record-type="rule"]');await trail.locator('summary').waitFor();assert.equal(lookups.length,0,'trail fetched before opening');
 await trail.locator('summary').click();await trail.getByRole('heading',{name:'Implementation report attached',exact:true}).waitFor();
 assert.match(await trail.innerText(),/late response|fixture|prerequisites/i);
 await trail.getByRole('button',{name:'Compare checkout build',exact:true}).click();
 await trail.getByText('Tested on this exact checkout build.',{exact:true}).waitFor();
 await trail.getByRole('heading',{name:'Implementation report attached',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'lotm-record-native-trail-1920.png')});
 await trail.getByText('Tested on this exact checkout build.',{exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'lotm-record-tested-build-1920.png')});
 const exact=await(await page.request.get(base+'/record-handoffs?'+new URLSearchParams({world:'lotm',view:'things',focus,type:'rule'}))).json();
 assert.deepEqual(exact.entries.map(e=>e.id),[proposal]);
 for(const query of [{world:'lotm',type:'entity'},{world:'hp',type:'rule'}]){
  const boundary=await(await page.request.get(base+'/record-handoffs?'+new URLSearchParams({...query,view:'things',focus}))).json();assert.deepEqual(boundary.entries,[]);
 }
 await trail.getByRole('link',{name:'Open source proposal and reports',exact:true}).click();
 await page.locator('.reading-handoffs').getByRole('heading',{name:'Lender release and separate third-party compensation intent',exact:true}).waitFor();assert.equal(new URL(page.url()).hash,'#workbench/handoffs/'+proposal);
 await page.goto(base+'/#world/hp/things/hp.law.carpet-embargo');const empty=page.locator('.record-handoff-trail[data-record-type="rule"]');await empty.locator('summary').waitFor();await empty.locator('summary').click();
 await empty.getByText('No saved Workbench handoff matches this exact record.',{exact:true}).waitFor();await empty.scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'empty-record-trail-1920.png')});
 assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const report=exact.entries[0].implementationReports[0],result={scope:'normal default Atlas; actual LOTM record and persistent reports; read-only on-demand trail',viewport:'1920x1080',
  record:'#world/lotm/things/'+focus,proposalId:proposal,reportId:report.id,testedBundleSha256:report.playtests[0].testedBundleSha256,checkoutBundleSha256:sha(readFileSync(join(root,'dist/bundle.js'))),
  exactMatch:true,sourceProposalClicked:true,emptyRecord:'#world/hp/things/hp.law.carpet-embargo',sameIdOtherFamilyEmpty:true,sameIdOtherWorldEmpty:true,lazyLookup:true,writeRequests:writes,errors,
  modelSha256:sha(readFileSync(join(root,'prototypes/world-atlas/record-handoffs.mjs'))),viewSha256:sha(readFileSync(join(root,'prototypes/world-atlas/record-handoffs-view.mjs')))};
 writeFileSync(join(output,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){
 if(lastPage)console.log('Visible failure state: '+(await lastPage.locator('body').innerText()).slice(0,1000));throw error;
}finally{
 if(server?.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}await browser?.close();
}
