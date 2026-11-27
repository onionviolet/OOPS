import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const out=resolve(process.argv[2]||'docs/representations/evidence/atlas-find-joint-final-2026-11-25');
assert(!existsSync(out)||readdirSync(out).length===0,'Use a fresh evidence directory; preserve previous successes and diagnostics.');
mkdirSync(out,{recursive:true});
const inputs=['index.html','serve.mjs','atlas-find.mjs','atlas-find-view.mjs','canvas.css','atlas-type.css','library-views.mjs','world-rules-view.mjs','cheat-catalogue-view.mjs','things-views.mjs','atlas-native-evidence.mjs','atlas-native-evidence-view.mjs'].map(n=>'prototypes/world-atlas/'+n);
inputs.push('styles/ui_tokens.css');
inputs.push('docs/CHEAT_CATALOGUE.md','work/atlas-snapshot/snapshot.json',...readdirSync(join(root,'work/atlas-snapshot/readers')).filter(f=>f.endsWith('.json')).map(f=>'work/atlas-snapshot/readers/'+f));
const identity=()=>Object.fromEntries(inputs.filter(f=>existsSync(join(root,f))).map(f=>[f,createHash('sha256').update(readFileSync(join(root,f))).digest('hex')]));
const before=identity(),errors=[],checks=[];let findRequests=0,readerRequests=0;
const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;
let browser,page;
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
try{
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',s=>{const m=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();page=await browser.newPage({viewport:{width:1366,height:768}});page.setDefaultTimeout(45000);page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{const p=new URL(r.url()).pathname;if(p==='/atlas-find')findRequests++;if(p.startsWith('/readers/'))readerRequests++;});
 const form=()=>page.getByRole('search',{name:'Find across the Atlas'});
 const input=()=>form().getByRole('searchbox',{name:'Find in Atlas',exact:true});
 const find=async(q,type='all',world='',p=1)=>{
  const params=new URLSearchParams({q,type,world,page:String(p)});
  const response=await page.request.get(base+'/atlas-find?'+params);assert.equal(response.status(),200);
  return response.json();
 };
 const ready=async q=>{await page.locator('.atlas-find-page > .atlas-find-status').filter({hasText:'results for “'+q+'”'}).waitFor();};
 const submit=async q=>{await input().fill(q);await input().press('Enter');await page.getByRole('heading',{name:'Find in Atlas',exact:true}).waitFor();await page.waitForFunction(q=>new URLSearchParams(location.hash.split('?')[1]).get('q')===q,q);await ready(q);};
 const stable=async()=>{await page.waitForFunction(()=>!document.querySelector('main')?.textContent.includes('Searching'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal page overflow');};
 const capture=async name=>{await stable();await page.screenshot({path:join(out,name+'.png')});};
 const openAndBack=async(q,type,world,p=1)=>{
  console.log('[Find acceptance] '+page.viewportSize().width+' '+type+' / '+q+' / page '+p);
  if(q==='Loaded Dice'||q==='pelt'){
   await page.goto(base+'/#find');await page.locator('.atlas-find-page > .atlas-find-status').filter({hasText:'Start with a name'}).waitFor();await submit(q);
   await page.getByRole('combobox',{name:'Result type',exact:true}).selectOption(type);await page.waitForFunction(t=>new URLSearchParams(location.hash.split('?')[1]).get('type')===t,type);await ready(q);
  }else await page.goto(base+'/#find?'+new URLSearchParams({q,type,world,page:String(p)}));
  const result=await find(q,type,world,p),rows=result.groups.find(g=>g.id===type)?.rows,row=type==='cheats'?rows?.find(r=>r.id==='CTC64'):rows?.[0];assert(row,'actual '+type+' result');
  const link=page.locator('main a[href="'+row.href+'"]').first();await link.waitFor();assert((await link.innerText()).trim().length>0,'actual record has a readable link label');
  const searchHash=new URL(page.url()).hash;await link.focus();await link.press('Enter');
  await page.waitForFunction(h=>location.hash===h,row.href);await page.locator('.atlas-find-page').waitFor({state:'detached'});await stable();
  await page.waitForFunction(label=>document.querySelector('main')?.textContent.includes(label),row.label);
  if(row.href.startsWith('#creatures/'))await page.locator('aside[data-record-id="'+row.id+'"]').waitFor();
  let nativeEvidence;
  if(type==='cheats'){
   for(const name of ['Ordinary decision','With the advantage','Evidence','In OOPS'])await page.getByRole('heading',{name,exact:true}).waitFor();assert((await page.locator('.cheat-evidence').innerText()).includes('Native playtest'));
   const [popup]=await Promise.all([page.waitForEvent('popup'),page.getByRole('link',{name:'Open native playtest results',exact:true}).click()]);
   await popup.waitForLoadState('domcontentloaded');assert.equal(new URL(popup.url()).pathname,'/cheat-proof/CTC64');
   const response=await popup.request.get(popup.url());assert.equal(response.status(),200);const proof=await response.json();assert.equal(proof.ok,true);assert.equal(proof.servedBundleSha256,'06758b45d2e5de05aa4e2cb6819e7cc8dc757188e73f4d51fa8dceb34b791634');
   nativeEvidence={route:'/cheat-proof/CTC64',ok:proof.ok,servedBundleSha256:proof.servedBundleSha256};await popup.close();
   if(q==='Loaded Dice'){
    await page.getByRole('link',{name:'Where to play',exact:true}).click();await page.waitForFunction(()=>location.hash==='#workbench/play-evidence/loaded-dice');await page.getByRole('heading',{name:'Native play evidence',exact:true}).waitFor();await page.locator('[data-native-evidence="loaded-dice"]').getByRole('heading',{name:'Loaded Dice',exact:true}).waitFor();await capture('where-to-play-1366');nativeEvidence.whereToPlay='#workbench/play-evidence/loaded-dice';await page.goBack();await page.getByRole('heading',{name:'In OOPS',exact:true}).waitFor();
   }
  }
  await capture((row.href.startsWith('#creatures/')?'native':type)+'-detail-'+page.viewportSize().width);
  await page.reload();await page.locator('main').getByText(row.label,{exact:true}).first().waitFor();
  await page.goBack();await page.waitForFunction(h=>location.hash===h,searchHash);await ready(q);await link.waitFor();
  assert.equal(await input().inputValue(),q);assert.equal(await page.getByRole('combobox',{name:'Result type',exact:true}).inputValue(),type);assert.equal(await page.getByRole('combobox',{name:'Result world',exact:true}).inputValue(),world);
  return {type,query:q,world,href:row.href,label:row.label,queryViaHeader:q==='Loaded Dice'||q==='pelt',keyboardOpen:true,detailReload:true,backHash:searchHash,...(nativeEvidence?{nativeEvidence}:{})};
 };
 await page.goto(base);await input().waitFor();assert.equal(findRequests,0,'normal initial page does not request a Find index');checks.push({initialFindRequests:0});
 await input().focus();await input().press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'Find','search keyboard order reaches submit');
 await input().focus();await submit('magic');
 const broad=await find('magic');assert(broad.total>0);assert(broad.groups.filter(g=>g.total>0).length>=2,'actual mixed query covers multiple types');
 await page.locator('main').getByRole('link').first().waitFor();await capture('mixed-1366');
 await page.locator('.atlas-find-meta').filter({hasText:'Super Supportive'}).first().waitFor();await page.locator('.atlas-find-meta').filter({hasText:'You Are Summoned'}).first().waitFor();
 assert.equal(await page.getByRole('combobox',{name:'Result world',exact:true}).locator('option[value="sup"]').innerText(),'Super Supportive');assert.equal(await page.getByRole('combobox',{name:'Result world',exact:true}).locator('option[value="yas"]').innerText(),'You Are Summoned');checks.push({canonicalWorldLabels:['Super Supportive','You Are Summoned'],stableWorldIds:['sup','yas']});
 checks.push({viewport:'1366x768',mixedQuery:'magic',total:broad.total,groups:broad.groups.map(g=>({id:g.id,total:g.total})),keyboardSubmit:true});
 await page.getByRole('combobox',{name:'Result type',exact:true}).selectOption('rules');await ready('magic');
 await page.waitForFunction(()=>document.querySelector('#atlas-find-type')?.value==='rules'&&document.querySelectorAll('[data-find-group]').length===1);
 assert.equal(await page.locator('[data-find-group]').count(),1);
 await page.getByRole('combobox',{name:'Result world',exact:true}).selectOption('dnd_srd');await ready('magic');
 await page.waitForFunction(()=>document.querySelector('#atlas-find-world')?.value==='dnd_srd');
 const filtered=await find('magic','rules','dnd_srd');assert(filtered.total>0&&filtered.total<=broad.total);
 await page.getByRole('heading',{name:'World rules · '+filtered.total.toLocaleString(),exact:true}).waitFor();
 assert.equal(await page.locator('[data-find-result]').count(),filtered.groups[0].rows.length);
 if(filtered.pages>1){await page.getByRole('navigation',{name:'Find result pages'}).getByRole('button',{name:'Next',exact:true}).click();await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('page')==='2');await page.getByText('Page 2 of '+filtered.pages+' · up to '+filtered.limit+' results per group',{exact:true}).waitFor();const shared=page.url();await page.reload();await ready('magic');assert.equal(page.url(),shared);assert.equal(await input().inputValue(),'magic');await capture('filtered-page2-1366');}
 checks.push({filterType:'rules',filterWorld:'dnd_srd',filteredTotal:filtered.total,unfilteredTotal:broad.total,pages:filtered.pages,pageReload:filtered.pages>1});
 assert.equal(readerRequests,0,'Find loads compact API results without downloading reader digests to the browser');checks.push({searchReaderDigestRequests:0});
 if(filtered.pages>1)checks.push(await openAndBack('magic','rules','dnd_srd',2));
 checks.push(await openAndBack('D20 test succeeds','rules','dnd_srd'));
 checks.push(await openAndBack('CTC64','cheats',''));
 checks.push(await openAndBack('Loaded Dice','cheats',''));
 checks.push(await openAndBack('Klein','subjects','lotm'));
 checks.push(await openAndBack('Village Shack','subjects','base.frontier'));
 await submit('zz-no-atlas-record-582194');const empty=await find('zz-no-atlas-record-582194');assert.equal(empty.total,0);
 await page.getByRole('button',{name:'Clear search',exact:true}).waitFor();await capture('empty-1366');
 await page.getByRole('button',{name:'Clear search',exact:true}).click();await submit('CTC64');await page.locator('main').getByRole('link',{name:/Roll override|Weighted die/i}).first().waitFor();
 checks.push({emptyRecovery:true});
 await page.setViewportSize({width:1920,height:1080});await submit('magic');await capture('mixed-1920');
 checks.push(await openAndBack('D20 test succeeds','rules','dnd_srd'));
 checks.push(await openAndBack('CTC64','cheats',''));
 checks.push(await openAndBack('pelt','cheats',''));
 checks.push(await openAndBack('Klein','subjects','lotm'));
 assert.deepEqual(errors,[]);assert.deepEqual(identity(),before,'frozen app inputs unchanged during acceptance');
 writeFileSync(join(out,'proof.json'),JSON.stringify({ok:true,route:'Normal default Atlas; headless fresh browser origin; no test fixtures or app edits',viewports:['1366x768','1920x1080'],inputIdentity:before,checks,errors},null,2)+'\n');
 console.log(JSON.stringify({ok:true,out,checks:checks.length,errors}));
}catch(error){await page?.screenshot({path:join(out,'failed.png')}).catch(()=>{});writeFileSync(join(out,'failure.json'),JSON.stringify({ok:false,message:error.message,stack:error.stack,inputIdentity:before,checks,errors},null,2)+'\n');throw error;}
finally{try{await page?.context().close();await browser?.close();}finally{if(server.exitCode===null&&server.signalCode===null){const done=once(server,'exit');server.kill();await done;}}}
