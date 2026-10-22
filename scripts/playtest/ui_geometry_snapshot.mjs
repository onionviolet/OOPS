// Disposable-origin geometry snapshot for UI token migrations (UR65-UR68).
// Usage: node scripts/playtest/ui_geometry_snapshot.mjs <out.json>
// Records every visible element's box, padding and z-index on the mid fixture
// at 1920x1080 and 14/21 px text, plus a new character at 14 px.
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const out=resolve(process.argv[2]);
const app=await serve(resolve('.')),s=new Session({url:app.url+'?test_hooks=1',seed:23,wall:Date.UTC(2026,9,21),opTimeout:12000});
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];seed.customization=defaultCustomizationState();seed.global_flags.is_crafting_unlocked=true;
const snap=()=>s.page.evaluate(()=>{const path=e=>{const p=[];for(let n=e;n&&n!==document.body;n=n.parentElement){const i=n.id?'#'+n.id:n.tagName.toLowerCase()+':'+[...n.parentElement.children].indexOf(n);p.unshift(i);if(n.id)break}return p.join('>')};
 const rows={};for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(!r.width||!r.height)continue;const c=getComputedStyle(e);if(c.visibility==='hidden')continue;
  rows[path(e)]=[r.x,r.y,r.width,r.height].map(v=>Math.round(v*100)/100).join(',')+'|'+[c.paddingTop,c.paddingRight,c.paddingBottom,c.paddingLeft,c.marginTop,c.marginLeft,c.rowGap,c.columnGap,c.zIndex].join(' ')}
const fit=[...document.querySelectorAll('.workspace-module')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const r=e.getBoundingClientRect();const sc=[e,...e.querySelectorAll('*')].filter(x=>x.scrollHeight>x.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(x).overflowY));return e.dataset.module+' '+Math.round(r.height)+(sc.length?' scrolls '+sc.map(x=>x.scrollHeight+'/'+x.clientHeight).join(','):'')});
 return {page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],topRow:document.querySelector('#main_content').style.getPropertyValue('--shell-top-row'),fit,errors:window.__errors||[],rows}});
const result={};
try{await s.start();
 for(const [name,size,save] of [['mid-14',14,seed],['mid-21',21,seed],['new-14',14,null]]){
  let f=save&&structuredClone(save);if(f)f.customization.profiles.Default.settings.typography.size=size;
  await s.open(f);await s.page.setViewportSize({width:1920,height:1080});await s.page.waitForTimeout(900);await s.page.evaluate(()=>document.fonts.ready);
  result[name]=await snap();await s.page.screenshot({path:out.replace(/\.json$/,`-${name}.png`)});}
}finally{await s.browser?.close();app.close?.();}
await writeFile(out,JSON.stringify(result));
for(const [k,v] of Object.entries(result)){console.log(k,'elements',Object.keys(v.rows).length,'page',v.page.join('x'),'top row',v.topRow);if(process.env.FIT)console.log('  '+v.fit.join('\n  '))}
if(s.errors?.length)console.log('page errors',JSON.stringify(s.errors).slice(0,600));
