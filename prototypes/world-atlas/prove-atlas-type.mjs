// Typography only: actual normal Atlas, identical routes/content at desktop sizes.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const phase=process.argv[2]||'before';assert.ok(['before','after','zoom'].includes(phase));
const root=resolve(process.argv[3]||'docs/representations/evidence/atlas-typography-2026-11-25'),suffix=process.argv[4]||'';assert.match(suffix,/^[a-z0-9-]*$/);const out=join(root,phase+(suffix?'-'+suffix:''));await mkdir(out,{recursive:true});
const hash=s=>createHash('sha256').update(s).digest('hex');
const child=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit'],windowsHide:true});
let browser,page;const errors=[],captures=[];
try{
 const base=await new Promise((ok,fail)=>{child.once('error',fail);child.once('exit',code=>fail(Error('Atlas exited '+code)));child.stdout.setEncoding('utf8').on('data',text=>{const m=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();page=await browser.newPage({viewport:{width:1366,height:768}});page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
 let plan;
 if(phase==='before'){
  const result=await(await page.request.get(base+'/atlas-find?'+new URLSearchParams({q:'Klein Moretti',type:'subjects',world:'lotm'}))).json();
  const rows=result.groups.flatMap(g=>g.rows),row=rows.find(r=>r.kind==='person'&&r.href.includes('/things/'))||rows.find(r=>r.href.includes('/things/'));assert.ok(row,'real populated person/subject record available');
  plan=[{name:'controls',route:'#world/lotm/reading'},{name:'find',route:'#find?q=magic'},{name:'record',route:row.href}];await writeFile(join(root,'routes.json'),JSON.stringify(plan,null,2));
 }else plan=JSON.parse(await readFile(join(root,'routes.json'),'utf8'));
 const viewports=phase==='zoom'?[{width:1366,height:768,zoom:1.25},{width:1920,height:1080,zoom:1.25}]:[{width:1366,height:768},{width:1920,height:1080}];
 for(const viewport of viewports){
  if(viewport.zoom){await page.context().close();const context=await browser.newContext({viewport:{width:Math.round(viewport.width/viewport.zoom),height:Math.round(viewport.height/viewport.zoom)},deviceScaleFactor:viewport.zoom});page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));}
  else await page.setViewportSize({width:viewport.width,height:viewport.height});
  for(const state of plan){
   await page.goto(base+'/'+state.route);await page.locator('header .atlas-find-global').waitFor();
   if(phase==='before')await page.evaluate(()=>{const link=document.querySelector('link[href="/atlas-type.css"]');if(link)link.disabled=true;});
   if(state.name==='find')await page.locator('.atlas-find-result').first().waitFor();
   else await page.locator('.box-canvas').waitFor();
   if(state.name==='record'){
    const record=page.locator('.canvas-inspector').first();await record.locator('h2').first().waitFor();
    // The same current native details disclosure is opened in both phases.
    const summary=record.locator('details > summary').first();if(await summary.count()&&!await summary.evaluate(n=>n.parentElement.open))await summary.click();
    await record.evaluate(n=>n.scrollTop=0);await page.evaluate(()=>window.scrollTo(0,0));
   }
   await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.evaluate(()=>{
    const selectors={brand:'body > header h1',menu:'body > header nav button',searchLabel:'.atlas-find-global label',searchInput:'.atlas-find-global input',searchButton:'.atlas-find-global button',heading:'main h2',paragraph:'main p',status:'.atlas-find-status,main [role="status"]',findHeading:'.atlas-find-result h3',findBody:'.atlas-find-result p:not(.atlas-find-meta):not(.atlas-find-status-note)',findMeta:'.atlas-find-meta',recordHeading:'.canvas-inspector h2',recordBody:'.canvas-record .tree-fact,.canvas-inspector p',diagram:'.canvas-box'};
    const result={};for(const [name,selector]of Object.entries(selectors)){const n=[...document.querySelectorAll(selector)].find(n=>n.checkVisibility());if(!n)continue;const c=getComputedStyle(n);result[name]={selector,fontFamily:c.fontFamily,fontSize:c.fontSize,fontWeight:c.fontWeight,lineHeight:c.lineHeight,color:c.color};}
    const clone=document.querySelector('main').cloneNode(true);clone.querySelectorAll('.canvas-toolbar output').forEach(n=>n.remove());
    return {samples:result,body:{fontFamily:getComputedStyle(document.body).fontFamily,fontSize:getComputedStyle(document.body).fontSize},cssViewport:{width:innerWidth,height:innerHeight,devicePixelRatio},overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),mainText:clone.textContent.replace(/\s+/g,' ').trim(),typographySheetDisabled:!!document.querySelector('link[href="/atlas-type.css"]')?.disabled,stylesheet:[...document.styleSheets].map(s=>s.href).filter(Boolean).map(s=>new URL(s).pathname),fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status}))};
   });
   assert.equal(metrics.overflow,0,'no horizontal page overflow');
   if(phase!=='before')assert.equal(metrics.stylesheet.at(-1),'/atlas-type.css','typography stylesheet loaded last');
   else assert.ok(!metrics.stylesheet.includes('/atlas-type.css')||metrics.typographySheetDisabled,'before uses existing cascade with typography sheet disabled');
   const textSha256=hash(metrics.mainText);delete metrics.mainText;
   if(viewport.zoom){assert.equal(metrics.cssViewport.width,Math.round(viewport.width/viewport.zoom));assert.equal(metrics.cssViewport.height,Math.round(viewport.height/viewport.zoom));assert.equal(metrics.cssViewport.devicePixelRatio,viewport.zoom);}
   const name=state.name+'-'+viewport.width+(viewport.zoom?'-125pct':'');const screenshot=join(out,name+'.png');await page.screenshot({path:screenshot});const png=await readFile(screenshot),pngDimensions={width:png.readUInt32BE(16),height:png.readUInt32BE(20)};assert.equal(pngDimensions.width,Math.round(metrics.cssViewport.width*metrics.cssViewport.devicePixelRatio));assert.equal(pngDimensions.height,Math.round(metrics.cssViewport.height*metrics.cssViewport.devicePixelRatio));captures.push({name,route:state.route,viewport,pngDimensions,textSha256,...metrics});console.log(phase+' '+name);
  }
 }
 assert.deepEqual(errors,[]);await writeFile(join(out,'computed.json'),JSON.stringify({phase,captures,pageErrors:errors},null,2));
 if(phase!=='before'){
  const before=JSON.parse(await readFile(join(root,'before/computed.json'),'utf8'));
  for(const current of captures){const previous=before.captures.find(c=>c.name===current.name.replace('-125pct',''));assert.equal(current.textSha256,previous.textSha256,'same populated text excluding visual map scale: '+current.name);for(const sample of ['diagram','brand'])if(previous.samples[sample]&&current.samples[sample])assert.deepEqual(current.samples[sample],previous.samples[sample],sample+' typography unchanged');}
  await page.evaluate(()=>{document.documentElement.style.setProperty('--custom-font','Georgia');document.documentElement.style.setProperty('--custom-size','18px');});
  const preference=await page.locator('.atlas-find-global input').evaluate(n=>({family:getComputedStyle(n).fontFamily,size:getComputedStyle(n).fontSize}));assert.match(preference.family,/Georgia/);assert.equal(preference.size,'18px');await writeFile(join(out,'preferences.json'),JSON.stringify(preference,null,2));
 }
}catch(error){console.error(error);await page?.screenshot({path:join(out,'failed.png')}).catch(()=>{});throw error;}
finally{await browser?.close();if(child.exitCode===null&&child.signalCode===null){const ended=once(child,'exit');child.kill();await ended;}}
