// Seeded harness check only. No game source or real save changes.
const assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {registry,forbidden,fresh,collect}=require('../../checks/leak_lint.cjs');
(async()=>{
 const r=await registry(),name=r.cards[0].name;
 const future={id:'lq-synthetic-future',name:'LQ synthetic future',ui:'lq-future-panel'};
 const rr={cards:[...r.cards,future],labels:new Map([...r.labels,[future.ui,'LQ future panel']])};
 const names=forbidden(rr,{cheats:{held:{},known:{}}});
 for(const n of [future.id,future.name,future.ui,'LQ future panel'])assert(names.includes(n));
 console.log('PASS synthetic future card automatically supplies id/name/panel id/label');
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const {ctx,p}=await fresh(b);
  await p.evaluate(name=>{
   const span=document.createElement('span');span.textContent=name;span.title=name;
   span.setAttribute('aria-label',name);span.setAttribute('aria-description',name);span.setAttribute('aria-valuetext',name);span.setAttribute('role','tooltip');document.body.append(span);
   const reference=document.createElement('span');reference.id='lq-reference';reference.hidden=true;reference.textContent=name;document.body.append(reference);span.setAttribute('aria-describedby',reference.id);
   const select=document.createElement('select');select.setAttribute('aria-label','Native module');const o=document.createElement('option');o.textContent=name;select.append(o);
   const host=document.createElement('div');host.id='customization_host';host.append(select);document.body.append(host);
   const setting=document.createElement('div');setting.dataset.displaySettings='';setting.textContent=name;document.body.append(setting);
   const picker=document.createElement('button');picker.dataset.workspaceAction='restore';picker.textContent=name;document.body.append(picker);
   document.title=name;localStorage.setItem(name,'lq harness');
  },name);
  const surfaces=await collect(p);
  for(const [surface,strings]of Object.entries(surfaces)){
   assert(strings.some(s=>s.includes(name)),surface);console.log('PASS seeded capture '+surface);
  }
  await ctx.close();
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=3;});
