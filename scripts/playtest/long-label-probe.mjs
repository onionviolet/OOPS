// DL6 / Q18 P06 probe: long labels keep meaning and an inspectable full name at the desktop targets.
// Crowded fixture with a long hero name; every visible leaf text cut by its box (sideways or by line
// clamp) must offer its full text through title or aria-label. Temp rebuilt bundle, fresh origin, headless.
// Usage: node scripts/playtest/long-label-probe.mjs <out-dir>   (screenshots and long-labels.json stay in out-dir)
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session} from './lib.mjs';
import {readFixture} from '../perf/lib.mjs';
const out=path.resolve(process.argv[2]||'.');await fs.mkdir(out,{recursive:true});
const NAME='Wilhelmina Evangeline Thistlewood-Ravensworth of the Lower Mill Road';
const bundle=await buildBundle(),server=await serve(bundle.dir);
const s=await new Session({url:server.url,opTimeout:30000,seed:7,wall:Date.UTC(2026,9,27)}).start();
const cut=()=>{
 const shown=n=>n.checkVisibility({contentVisibilityAuto:true,visibilityProperty:true});
 const label=n=>n.id?'#'+n.id:n.localName+(n.classList.length?'.'+[...n.classList].slice(0,2).join('.'):'');
 const rows=[];
 for(const el of document.body.querySelectorAll('*')){
  if(el.children.length||!el.textContent.trim()||!shown(el))continue;
  const cs=getComputedStyle(el),wide=/hidden|clip/.test(cs.overflowX)&&el.scrollWidth>el.clientWidth+1,tall=/hidden|clip/.test(cs.overflowY)&&cs.webkitLineClamp!=='none'&&el.scrollHeight>el.clientHeight+1;
  if(!wide&&!tall)continue;
  const full=el.textContent.trim(),help=[el,el.closest('[title],[aria-label]')].filter(Boolean).map(n=>n.getAttribute('title')||n.getAttribute('aria-label')||'').find(t=>t.includes(full.slice(0,40)))||'';
  rows.push({el:label(el),text:full.slice(0,80),ellipsis:cs.textOverflow==='ellipsis',inspectable:!!help});
 }
 const field=document.getElementById('character_name_field');
 return {rows,nameField:field?{value:field.value,shown:shown(field)}:null};
};
const results=[];
try{
 const fixture=JSON.parse(readFixture('crowded'));fixture.character.name=NAME;
 await s.open(fixture);const seed=await s.save();
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;
  await s.open(f);const p=s.page;await p.setViewportSize({width,height});await p.waitForTimeout(400);await p.evaluate(()=>document.fonts.ready);
  const font=await p.evaluate(()=>getComputedStyle(document.querySelector('#inventory_div')).fontSize);
  if(font!==`${size}px`)throw new Error(`text size ${font}, wanted ${size}px`);
  const r=await p.evaluate(cut);results.push({width,height,size,font,...r});
  await p.screenshot({path:path.join(out,`long-labels-${width}-${size}.png`)});
 }
}finally{await s.close();server.close();await bundle.dispose();}
await fs.writeFile(path.join(out,'long-labels.json'),JSON.stringify(results,null,1));
for(const r of results){const bad=r.rows.filter(x=>!x.inspectable);console.log(`${r.width}x${r.height} text ${r.font}: ${r.rows.length} cut labels, ${bad.length} without full-name access; name field ${JSON.stringify(r.nameField?.value===NAME)}`);
 for(const x of bad.slice(0,12))console.log(`  ${x.ellipsis?'…':'|'} ${x.el} | ${x.text}`);}
