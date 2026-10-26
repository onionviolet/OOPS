// Read-only rebuilt UI audit. Uses disposable test fixtures and one Chrome session.
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {buildBundle, Session} from './lib.mjs';

const root=resolve('.'),out=resolve(process.argv[2]||'docs/gm/dispatch/ui-detail-2026-10-25/evidence/before/cultivation');
await mkdir(out,{recursive:true});
const rebuilt=process.argv.includes('--rebuilt'),bundle=rebuilt?await buildBundle():null;
const session=new Session({url:'http://127.0.0.1:5101/?test_hooks=1',seed:19,wall:Date.UTC(2026,9,25),opTimeout:15000,
 hooks:bundle?{beforeOpen:context=>context.route('**/dist/bundle.js*',route=>route.fulfill({path:join(bundle.dir,new URL(route.request().url()).pathname.endsWith('.map')?'bundle.js.map':'bundle.js')}))}:{}});
const receipt={build:rebuilt?'temporary esbuild bundle from this worktree':'existing static dist bundle',url:'http://127.0.0.1:5101/?test_hooks=1',captures:[],observations:[],errors:[]};
try{
 await session.start();
 const fixture=JSON.parse(await readFile(join(root,'tests/fixtures/perf/mid.json'),'utf8'));
 await session.open(structuredClone(fixture));let p=session.page;
 await p.evaluate(()=>document.fonts.ready);
 // Expand the Local actions and craftsman disclosures, then enroll through the
 // actual button before opening the optional world.
 const localActions=p.locator('#location_related_div');
 await localActions.evaluate(n=>{for(let a=n.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});
 const enrollment=p.locator('#simulation_panel');
 if(await enrollment.count()){
  await enrollment.evaluate(n=>n.open=true);
  const enroll=enrollment.locator('[data-simulation="enroll"]');
  if(await enroll.isVisible().catch(()=>false))await enroll.click();
 } else {
  // This fixture's native old-game route has the local opt-in in Local actions.
  const leisure=localActions.locator('[data-p23-local="enrollLeisure"]');
  if(await leisure.isVisible().catch(()=>false))await leisure.click();
 }
 const panels=[['mistglass','Mistglass conservatory'],['gear-workshop','Gear workshop'],['herbal-experiments','Village experiments']];
 for(const [width,height] of [[1920,1080],[1440,900]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(350);
  for(const [id,label] of panels){
   const select=p.locator('#workspace_navigation select[aria-label="Other known panels"]');
   if(id==='mistglass'){
    await select.selectOption('projects').catch(()=>{});await p.waitForTimeout(250);
    const outer=p.locator('#projects_drawer');if(await outer.isVisible().catch(()=>false))await outer.evaluate(n=>n.open=true);
    const targetPanel=p.locator('#p23_mistglass_panel');await targetPanel.waitFor({state:'visible'});await targetPanel.evaluate(n=>n.open=true);
    const enter=targetPanel.locator('[data-mistglass-action="enter"]');if(await enter.isVisible().catch(()=>false))await enter.click();
    const learn=targetPanel.locator('[data-mistglass-action="learn"]');if(await learn.isVisible().catch(()=>false))await learn.click();
   }else await select.selectOption(id).catch(()=>{});
   await p.waitForTimeout(300);
   const target=id==='mistglass'?'#p23_mistglass_panel':id==='gear-workshop'?'#gear_workshop':'#crafting_engine_home';
   const panel=p.locator(target);const visible=await panel.isVisible().catch(()=>false);
   if(visible&&await panel.evaluate(n=>n.tagName==='DETAILS'))await panel.evaluate(n=>n.open=true);
   await p.waitForTimeout(300);
   const path=join(out,`${id}-${width}x${height}.png`);await p.screenshot({path});
   const details=await p.evaluate(({id,target})=>{const n=document.querySelector(target);const r=n?.getBoundingClientRect();return {id,visible:!!r&&r.width>0&&r.height>0,rect:r?{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}:null,text:n?.innerText.slice(0,2200)||'',page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],open:n?.tagName==='DETAILS'?n.open:null};},{id,target});
   receipt.captures.push({path:path.replace(root+'/',''),viewport:[width,height],...details});
  }
 }
 receipt.observations.push(await p.evaluate(()=>({navigation:[...document.querySelectorAll('#workspace_navigation select option')].map(o=>({value:o.value,text:o.textContent})),available:[...document.querySelectorAll('[data-module]')].map(n=>({module:n.dataset.module,text:n.innerText.slice(0,300)}))})));
 receipt.errors=session.errors;
 await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify({captures:receipt.captures.map(x=>({id:x.id,viewport:x.viewport,visible:x.visible,rect:x.rect,text:x.text.slice(0,220)})),errors:receipt.errors},null,2));
}finally{await session.close();await bundle?.dispose();}
