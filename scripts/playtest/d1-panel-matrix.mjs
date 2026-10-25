// Every discoverable panel at both desktop targets. Uses only disposable public
// fixtures, native panel navigation and disclosure. No personal saves or commands.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {Session} from './lib.mjs';
import {LAYOUT_SPEC} from '../../src/layout_spec.js';
import {createHash} from 'node:crypto';
const phase=process.argv[2]||'after';
const out=resolve(`docs/gm/dispatch/ui-detail-2026-10-25/evidence/${phase}/panels`);await mkdir(out,{recursive:true});
const missing=[];
const hooks={beforeOpen:async context=>{context.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);});if(phase==='before'){await context.route('**/dist/bundle.js*',route=>route.fulfill({path:'/tmp/d1-baseline/bundle.js',contentType:'text/javascript'}));await context.route('**/styles/ui_tokens.css*',route=>route.fulfill({path:'/tmp/d1-baseline/ui_tokens.css',contentType:'text/css'}));await context.route(/\/\?test_hooks=1$/,route=>route.fulfill({path:'/tmp/d1-baseline/index.html',contentType:'text/html'}));}}};
const s=new Session({hooks,url:'http://127.0.0.1:5101/?test_hooks=1',seed:19,wall:Date.UTC(2026,9,25),opTimeout:7000});
const fixture=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
delete fixture.availabilities?.recipe?.undefined;delete fixture.availabilities?.recipe?.['recipe/undefined'];
const receipt={phase,fixture:'tests/fixtures/perf/mid.json',inputs:{},captures:[],gaps:[],errors:[]};
for(const file of ['dist/bundle.js','styles/ui_tokens.css','index.html'])receipt.inputs[file]=createHash('sha256').update(await readFile(phase==='before'?'/tmp/d1-baseline/'+file.split('/').at(-1):file)).digest('hex');
try{
 await s.start();await s.open(fixture);const p=s.page;await p.evaluate(()=>document.fonts.ready);
 const select=p.locator('#workspace_navigation select[aria-label="Other known panels"]');
 const options=await select.locator('option').evaluateAll(nodes=>nodes.filter(n=>n.value).map(n=>({id:n.value,title:n.textContent,disabled:n.disabled})));
 for(const option of options){
  if(option.disabled){receipt.gaps.push({...option,status:'known, ineligible in fixture'});continue;}
  for(const [width,height]of [[1920,1080],[1440,900]]){
   await p.setViewportSize({width,height});
   for(let i=0;i<4&&await p.locator('#main_content').getAttribute('data-center-task');i++)await p.keyboard.press('Escape');
   await select.selectOption(option.id);await p.waitForTimeout(100);
   const state=await p.evaluate(()=>({task:document.getElementById('main_content').dataset.centerTask||'local',text:document.getElementById('center_mode_content')?.innerText.slice(0,200)||''}));
   if(state.task!==`workspace:${option.id}`&&!(option.id==='local-actions'&&state.task==='local')){receipt.gaps.push({...option,viewport:[width,height],status:'navigation did not open expected panel',state});continue;}
   // Open the selected panel's own outer disclosure, without expanding every
   // secondary reference or triggering any gameplay button.
   await p.locator('#center_mode_content .expanded-panel-view').evaluateAll(nodes=>{for(const view of nodes){const first=[...view.children].find(n=>n.tagName==='DETAILS');if(first)first.open=true;}});
   await p.evaluate(()=>document.fonts.ready);await p.mouse.move(2,2);await p.waitForTimeout(80);
   const metrics=await p.evaluate(()=>{
    const root=document.querySelector('#center_mode_content'),nodes=[...root.querySelectorAll('*')],visible=n=>{const r=n.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(n).visibility!=='hidden';};
    const controls=nodes.filter(n=>n.matches('button,input,select,summary,[role="button"]')&&visible(n));
    return {task:document.getElementById('main_content').dataset.centerTask,document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],text:root.innerText.slice(0,600),controls:controls.length,unlabeled:controls.filter(n=>n.tagName!=='INPUT'&&!n.textContent.trim()&&!n.getAttribute('aria-label')&&!n.title).map(n=>n.id||n.tagName),logHeight:document.querySelector('[data-region="log"]').getBoundingClientRect().height};
   });
   assert(metrics.document[0]<=width+1,`${option.id} horizontal page overflow`);assert(metrics.document[1]<=height+1,`${option.id} vertical page overflow`);
   const path=join(out,`${option.id}-${width}x${height}.png`);await p.screenshot({path});receipt.captures.push({...option,viewport:[width,height],path:path.replace(resolve('.')+'/',''),...metrics});
  }
 }
 const known=new Set(options.map(o=>o.id));receipt.sourceInventory=Object.entries(LAYOUT_SPEC.surfaces).map(([id,surface])=>({id,type:surface.type,home:surface.home,status:surface.status,coverage:known.has(id)?receipt.captures.some(c=>c.id===id)?'captured':'known, see gaps':'not discovered in this fixture; source inventory only'}));
 receipt.missingResources=missing;receipt.fontAssets='Existing primary-checkout Gothic assets copied locally, ignored and not committed';receipt.errors=s.errors;await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify({phase,captures:receipt.captures.length,panels:new Set(receipt.captures.map(c=>c.id)).size,inventory:receipt.sourceInventory.length,gaps:receipt.gaps.length,errors:receipt.errors}));
} catch(e){await s.page?.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.json'),JSON.stringify({error:e.stack,receipt,errors:s.errors},null,2));throw e;}
finally{await s.close();}
