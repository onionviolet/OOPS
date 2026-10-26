// Read-only rebuilt desktop audit for homes/household and local stock/trade.
// Browser slot is serialized by the UI-detail coordinator. No personal save is read.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {buildBundle,Session} from './lib.mjs';

const root=resolve('.'),out=resolve('docs/gm/dispatch/ui-detail-2026-10-25/evidence/before/household');
await mkdir(out,{recursive:true});
const bundle=await buildBundle();
const url='http://127.0.0.1:5101/?test_hooks=1';
const session=new Session({url,seed:19,wall:Date.UTC(2026,9,25),opTimeout:15000,
 hooks:{beforeOpen:context=>context.route('**/dist/bundle.js*',route=>route.fulfill({path:join(bundle.dir,new URL(route.request().url()).pathname.endsWith('.map')?'bundle.js.map':'bundle.js')}))}});
const receipt={build:'temporary esbuild bundle from this worktree, served at 127.0.0.1:5101',url,captures:[],panels:[],errors:[]};
const k=id=>JSON.stringify({id});
async function panel(page,id){await page.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption(id);await page.waitForTimeout(450);}
async function captures(page,label,selectors){
 for(const [width,height] of [[1920,1080],[1440,900]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(550);await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(({label,selectors})=>{
   const rect=s=>{const n=document.querySelector(s);if(!n)return null;const r=n.getBoundingClientRect(),c=getComputedStyle(n);return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),visible:r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'};};
   return {label,viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],panels:Object.fromEntries(selectors.map(s=>[s,rect(s)])),text:document.querySelector('#center_mode_content')?.innerText.slice(0,2500)||document.body.innerText.slice(0,1800)};
  },{label,selectors});
  const path=join(out,`${label}-${width}x${height}.png`);await page.screenshot({path});receipt.captures.push({...metrics,path:path.replace(root+'/','')});
 }
}
try{
 await session.start();
 // Real supported home beginning creates an actual staffed manor and household.
 await session.open();let page=session.page;await page.evaluate(()=>document.fonts.ready);
 await page.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption('homes');await page.waitForTimeout(300);
 await page.locator('#home_panel details').filter({has:page.locator('summary:text-is("Choose a home beginning")')}).evaluate(n=>n.open=true);
 const duke=page.locator('[data-home-action="start:ducal"]');
 if(await duke.count()&&await duke.isEnabled())await duke.click();
 await page.waitForTimeout(500);await panel(page,'homes');
 await page.locator('#home_panel select[aria-label="Inspect residence"]').selectOption('manor').catch(()=>{});
 await page.waitForTimeout(300);
 // Open live content groups to expose real household stock, agreements and history.
 await page.locator('#home_panel details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));
 await captures(page,'manor',['#home_panel','#home_panel [data-home-beginnings]','#home_panel [data-home-action="tutor"]','#home_panel [data-home-action="pantry_order"]','#home_panel [data-home-action="family_accept"]']);
 receipt.observations=await page.evaluate(()=>({homeText:document.querySelector('#home_panel')?.innerText.slice(0,6000)||'',routeOptions:[...document.querySelectorAll('#workspace_navigation select[aria-label="Other known panels"] option')].map(o=>({id:o.value,title:o.textContent,disabled:o.disabled})),registered:[...document.querySelectorAll('[data-module]')].map(n=>({id:n.dataset.module,title:n.querySelector('.workspace-module-header strong')?.innerText||'',visible:!!(n.getBoundingClientRect().width&&n.getBoundingClientRect().height)}))}));
 // A public seeded midgame fixture supplies ordinary carried goods and a known Village trader.
 // Remove the malformed optional recipe row as in the established Proto23 delivery playtest.
 const fixture=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 delete fixture.availabilities?.recipe?.undefined;if(fixture.availabilities?.recipe)delete fixture.availabilities.recipe['recipe/undefined'];
 fixture.customization ||= {profiles:{Default:{settings:{typography:{font:'gothic',size:14}}}}};
 await session.open(fixture);page=session.page;await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>window.startTrade('villageTrader'));await page.waitForTimeout(400);
 await captures(page,'trade',['#trade_div','#trader_inventory_div','#trade_price_div','#accept_trade_button','#cancel_trade_button','#exit_trade_button','#inventory_content_div']);
 receipt.trade=await page.evaluate(()=>({mode:document.querySelector('#main_content')?.dataset.centerTask||'',tradeText:document.querySelector('#trade_div')?.innerText.slice(0,3500)||'',controls:[...document.querySelectorAll('#trade_div [onclick],#trade_div button,#trade_div [role="button"]')].map(n=>({selector:n.id?'#'+n.id:n.className||n.tagName,tag:n.tagName,text:n.innerText.trim(),tabIndex:n.tabIndex,role:n.getAttribute('role')})),registered:[...document.querySelectorAll('[data-module]')].map(n=>n.dataset.module)}));
 // The stock panel is only discoverable after meeting a companion. Do not inject a fake
 // party flag/person into the unrelated performance fixture. Report this gate distinctly.
 receipt.stock={status:'not captured',reason:'stock_view is intentionally hidden until a companion is actually met; this browser lane did not reach that gameplay prerequisite. No synthetic companion or empty panel is presented as player evidence.',panelGate:'src/stock_view_ui.js:14,57-58'};
 receipt.errors=session.errors;
 await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({captures:receipt.captures.map(x=>({label:x.label,viewport:x.viewport,document:x.document})),stock:receipt.stock,errors:receipt.errors},null,2));
}finally{await session.close();await bundle.dispose();}
