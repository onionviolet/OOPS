// Phase "make": build P1-P5 with the BASELINE assets (route-intercepted, same origin). Phase "check": reopen with live build.
const L=require('./lib.cjs');const fs=require('fs');const path=require('path');const S=process.env.S;const B=S+'/baseline';
const phase=process.argv[2];const OUT=S+'/out/persist';fs.mkdirSync(OUT,{recursive:true});
async function oldAssets(ctx){
 await ctx.route(/\/dist\/bundle\.js/,r=>r.fulfill({path:B+'/dist/bundle.js',contentType:'text/javascript'}));
 await ctx.route(/\/styles\/workspace\.css/,r=>r.fulfill({path:B+'/styles/workspace.css',contentType:'text/css'}));
 await ctx.route(/\/(index\.html)?(\?.*)?$/,r=>r.fulfill({path:B+'/index.html',contentType:'text/html'}));}
const keys=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith('yairpg.workspace')).map(k=>[k,localStorage.getItem(k)])));
const docks=p=>p.evaluate(()=>Object.fromEntries(['left','center','right'].map(d=>[d,[...document.querySelectorAll(`.workspace-dock[data-dock=${d}] > .workspace-module`)].filter(m=>!m.hidden&&getComputedStyle(m).display!=='none').map(m=>m.dataset.module)])));
const meta=p=>p.evaluate(()=>({density:document.getElementById('main_content').dataset.density,mode:document.getElementById('main_content').dataset.workspaceMode,cols:['left','center','right'].map(d=>getComputedStyle(document.querySelector('.workspace-board')).getPropertyValue('--workspace-'+d))}));
async function editOn(p){await p.locator('[data-workspace-action=edit-layout]').click();}
async function dock(p,id,to){const sh=p.locator(`.workspace-module[data-module="${id}"]`);await sh.locator('.workspace-module-controls > summary').click();await sh.locator('select[data-workspace-action=dock]').selectOption(to);await p.waitForTimeout(200);}
async function hide(p,id){const sh=p.locator(`.workspace-module[data-module="${id}"]`);await sh.locator('.workspace-module-controls > summary').click();await sh.locator('[data-workspace-action=hide]').click();await p.waitForTimeout(200);}
const fixtures={
 P1:{w:1366,h:768,make:async p=>{await p.selectOption('select[data-workspace-action=density]','compact');await p.selectOption('select[data-workspace-action=density]','comfortable');}},
 P2:{w:1366,h:768,make:async p=>{await editOn(p);await dock(p,'messages','left');await hide(p,'skills');await p.locator('[data-divider="0"]').focus();for(let i=0;i<4;i++)await p.keyboard.press('ArrowRight');await p.selectOption('select[data-workspace-action=density]','compact');}},
 P3:{w:900,h:800,make:async p=>{await editOn(p);await hide(p,'records');await p.selectOption('select[data-workspace-action=density]','inspection');}},
 P4:{w:1366,h:768,make:async p=>{await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(400);await p.selectOption('select[data-workspace-action=density]','compact');await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(300);}},
};
(async()=>{await L.launch();const save=fs.readFileSync(S+'/out/progressed.json','utf8');
if(phase==='make'){
 for(const [name,f] of Object.entries(fixtures)){const ctx=await L.browser.newContext({viewport:{width:f.w,height:f.h}});await oldAssets(ctx);const {p}=await L.open({ctx,save});
  await f.make(p);await p.waitForTimeout(300);const k=await keys(p);
  if(name==='P2'){await p.locator('.workspace-transfer > summary').click();await p.locator('[data-workspace-action=export]').click();fs.writeFileSync(OUT+'/P5_export.json',await p.locator('.workspace-transfer textarea').inputValue());}
  await p.reload({waitUntil:'domcontentloaded'});await L.doPlay(p);
  const d=await docks(p),m=await meta(p);await p.screenshot({path:`${S}/shots/${name}_old.png`});
  fs.writeFileSync(`${OUT}/${name}.json`,JSON.stringify({keys:k,docks:d,meta:m,state:await ctx.storageState()},null,1));console.log(name,'old',JSON.stringify(d),JSON.stringify(m),Object.keys(k));await ctx.close();}
} else {
 const tag=process.argv[3]||'new';
 for(const name of Object.keys(fixtures)){const f=fixtures[name];const fx=JSON.parse(fs.readFileSync(`${OUT}/${name}.json`));const ctx=await L.browser.newContext({viewport:{width:f.w,height:f.h},storageState:fx.state});
  const {p}=await L.open({ctx});const d=await docks(p),m=await meta(p);await p.reload({waitUntil:'domcontentloaded'});await L.doPlay(p);const d2=await docks(p);const k=await keys(p);
  await p.screenshot({path:`${S}/shots/${name}_${tag}.png`});
  const same=JSON.stringify(k)===JSON.stringify(fx.keys);console.log(name,tag,'storageUnchanged',same,'docksMatchOld',JSON.stringify(d)===JSON.stringify(fx.docks),'reloadStable',JSON.stringify(d)===JSON.stringify(d2),'meta',JSON.stringify(m),JSON.stringify(fx.meta));
  if(JSON.stringify(d)!==JSON.stringify(fx.docks))console.log('   old',JSON.stringify(fx.docks),'\n   new',JSON.stringify(d));await ctx.close();}
 // P0 fresh, P5 import into fresh origin
 const {p,ctx}=await L.open({save});console.log('P0',tag,JSON.stringify(await docks(p)),JSON.stringify(await keys(p)));await p.screenshot({path:`${S}/shots/P0_${tag}.png`});
 if(await p.locator('.workspace-layout-menu > summary').count())await p.locator('.workspace-layout-menu > summary').click();await p.locator('.workspace-transfer > summary').click();await p.locator('.workspace-transfer textarea').fill(fs.readFileSync(OUT+'/P5_export.json','utf8'));await p.locator('[data-workspace-action=import]').click();await p.waitForTimeout(300);
 const st=await p.locator('.workspace-status').innerText();await p.reload({waitUntil:'domcontentloaded'});await L.doPlay(p);const p2=JSON.parse(fs.readFileSync(`${OUT}/P2.json`));
 const d=await docks(p);console.log('P5',tag,'status',st,'docksMatchP2',JSON.stringify(d)===JSON.stringify(p2.docks),JSON.stringify(d));await ctx.close();}
await L.browser.close();})();
