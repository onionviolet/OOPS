import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {Session} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';

const out=resolve(process.env.OUT||'docs/gm/dispatch/ui-detail-2026-10-25/evidence/before/shell');
await mkdir(out,{recursive:true});
const fixture=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
delete fixture.availabilities?.recipe?.undefined;
if(fixture.availabilities?.recipe)delete fixture.availabilities.recipe['recipe/undefined'];
const populated=structuredClone(fixture);populated.customization=defaultCustomizationState();
const override=structuredClone(fixture);override.customization=defaultCustomizationState();
override.customization.profiles.Default.settings.typography={font:'system',size:21};
override.customization.profiles.Default.modules.messages={typography:{font:'serif',size:21}};
const session=new Session({url:process.env.YAIRPG_URL||'http://127.0.0.1:5101/?test_hooks=1',seed:19,wall:Date.UTC(2026,9,25),opTimeout:12000});
const receipt={url:session.url,fixture:'tests/fixtures/perf/mid.json',views:[],errors:[]};
async function openDetails(page){await page.locator('#center_mode_content details').evaluateAll(nodes=>nodes.forEach(n=>n.open=true));await page.waitForTimeout(250);}
async function platformFonts(page,selector){const c=await page.context().newCDPSession(page);await c.send('DOM.enable');await c.send('CSS.enable');const {root}=await c.send('DOM.getDocument');const {nodeId}=await c.send('DOM.querySelector',{nodeId:root.nodeId,selector});const result=nodeId?await c.send('CSS.getPlatformFontsForNode',{nodeId}):{fonts:[]};await c.detach();return result.fonts;}
try{
 await session.start();
 const variants=[['fresh-default',null],['populated-default',populated],['populated-explicit-overrides',override]];
 for(const [name,seed]of variants){
  await session.open(seed);const page=session.page;await page.evaluate(()=>document.fonts.ready);
  for(const [width,height]of [[1920,1080],[1440,900]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(1500);await openDetails(page);
   const fonts={inventory:await platformFonts(page,'#inventory_content_div .item_name'),log:await platformFonts(page,'#message_log_div')};
   const metrics=await page.evaluate(async()=>{
    await document.fonts.ready;
    const box=s=>{const n=document.querySelector(s);if(!n)return null;const r=n.getBoundingClientRect(),c=getComputedStyle(n);return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),font:c.fontFamily,size:c.fontSize,weight:c.fontWeight,visible:!!(r.width&&r.height&&c.display!=='none'&&c.visibility!=='hidden')}};
    const targets=['#game_bar','[data-module="vitals"]','[data-module="belongings"]','[data-module="local-actions"]','[data-module="focus"]','[data-module="messages"]','#message_box_div'];
    const styleTargets=['#inventory_div','#message_log_div','#main_content'];
    return{viewport:[innerWidth,innerHeight],page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],regions:Object.fromEntries(targets.map(s=>[s,box(s)])),styles:Object.fromEntries(styleTargets.map(s=>[s,box(s)])),nav:[...document.querySelectorAll('#workspace_navigation > select, #game_bar .game-bar-overflow')].map(n=>({selector:n.id?'#'+n.id:n.className,aria:n.getAttribute('aria-label'),title:n.title,text:n.innerText||n.options?.[0]?.textContent,rect:(r=>({x:Math.round(r.x),w:Math.round(r.width)}))(n.getBoundingClientRect())})),presentation:document.querySelector('#main_content')?.dataset.presentation,componentTheme:document.querySelector('#inventory_div')?.dataset.componentTheme,effects:document.documentElement.dataset.effects,typography:document.querySelector('#inventory_div')?.dataset.typographyFont,fonts:undefined,screen:document.body.innerText.slice(0,1000)};
   });
   const label=`${name}-${width}x${height}`;await page.screenshot({path:join(out,label+'.png')});
   metrics.fonts=fonts;receipt.views.push({label,metrics});
   for(const id of ['customization','belongings','records','known-people','projects','ledger']){
    const select=page.locator('#workspace_navigation select[aria-label="Other known panels"]');await select.selectOption(id).catch(()=>{});await page.waitForTimeout(400);await openDetails(page);
    const details=await page.evaluate(()=>[...document.querySelectorAll('#center_mode_content details')].map(n=>({summary:n.querySelector(':scope > summary')?.innerText||'',open:n.open,box:(r=>({x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}))(n.getBoundingClientRect())})));
    const pLabel=`${name}-${id}-${width}x${height}`;await page.screenshot({path:join(out,pLabel+'.png')});receipt.views.push({label:pLabel,panel:id,details});
   }
  }
 }
 receipt.errors=session.errors;await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify({views:receipt.views.length,errors:receipt.errors},null,2));
}finally{await session.close();}
