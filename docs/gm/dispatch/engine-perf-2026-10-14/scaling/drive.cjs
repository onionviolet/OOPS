// Scaling driver. Usage: node drive.cjs <url> <fixture.json> <outdir> <maxClock> [chunk]
// Drives a developed save with advanceTicks (?test_hooks=1) and records size parts + tick cost at checkpoints.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,FIX,OUT,MAX,CH]=[process.argv[2],process.argv[3],process.argv[4],+process.argv[5],+(process.argv[6]||250)];
const ACTIVE=process.env.ACTIVE==='1',SKIP=/cancel|reset|resize|divider|workspace|hits|close|reload|delete|abandon|wipe|import|export|save|difficulty|option/i;
const CHECK=[1000,3000,10000,30000,100000].filter(c=>c<=MAX);
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 const fixture=JSON.parse(fs.readFileSync(FIX,'utf8'));
 await context.addInitScript(d=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',JSON.stringify(d));sessionStorage.setItem('seeded','1');}},fixture);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(URL);
 await page.getByText('PLAY',{exact:true}).click({noWaitAfter:true});
 if(await page.getByText('Confirm',{exact:true}).isVisible().catch(()=>false))await page.getByText('Confirm',{exact:true}).click({noWaitAfter:true});
 await page.waitForFunction(()=>typeof advanceTicks==='function',null,{timeout:30000});
 await page.evaluate(()=>advanceTicks(1));
 const stat=()=>page.evaluate(()=>{const raw=localStorage.getItem('save data');const s=JSON.parse(raw);const e=s.expansion;let origin=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);origin+=2*(k.length+localStorage.getItem(k).length);}
  const sz=o=>JSON.stringify(o)?.length||0;
  const parts={};for(const k of Object.keys(e))parts[k]=sz(e[k]);
  const sim={};for(const k of Object.keys(e.simulation||{}))sim[k]=sz(e.simulation[k]);
  const act={};for(const [id,a] of Object.entries(e.actors||{}))for(const k of Object.keys(a))act[k]=(act[k]||0)+sz(a[k]);
  const top={};for(const k of Object.keys(s))top[k]=sz(s[k]);
  return {clock:e.clock,saveChars:raw.length,storageBytes:raw.length*2,originBytes:origin,headroom:4*1024*1024-origin,top,expansion:parts,simulation:sim,actors:act};});
 const rows=[];const t0=Date.now();
 const save=async tag=>{const r=await stat();r.tag=tag;r.wallS=+((Date.now()-t0)/1000).toFixed(0);rows.push(r);fs.writeFileSync(path.join(OUT,'rows.json'),JSON.stringify(rows,null,1));return r;};
 let cur=await save('start'),next=0,lastWall=Date.now(),lastClock=cur.clock,tickMs=[];
 while(cur.clock<MAX&&errors.length===0){
  const target=CHECK.find(c=>c>cur.clock)||MAX;const n=Math.min(CH,Math.max(1,target-cur.clock));
  const a=Date.now();let res;
  if(ACTIVE){ // synthetic player: click one enabled control per panel family each round, round-robin
   await page.evaluate(([skip,round])=>{const re=new RegExp(skip,'i');const all=[...document.querySelectorAll('button')].filter(b=>!b.disabled&&!b.hidden&&![...b.attributes].some(a=>re.test(a.name+'='+a.value))&&!re.test(b.id||'')&&[...b.attributes].some(a=>a.name.startsWith('data-')));
    const fam={};for(const b of all){const k=[...b.attributes].find(a=>a.name.startsWith('data-')).name;(fam[k]||=[]).push(b);}
    for(const k of Object.keys(fam)){const l=fam[k];try{l[round%l.length].click();}catch{}}},[SKIP.source,Math.floor(cur.clock||0)]);
  }
  try{res=await page.evaluate(n=>{const t=performance.now();advanceTicks(n);return performance.now()-t;},n);}catch(e){errors.push('advance: '+e.message);break;}
  const clk=(await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).expansion.clock));
  tickMs.push({clock:clk,n,ms:+res.toFixed(0),perTick:+(res/n).toFixed(2)});
  if(CHECK.includes(clk)||clk>=MAX){cur=await save('checkpoint');cur.recentPerTick=tickMs.slice(-4).map(x=>x.perTick);console.log(JSON.stringify({clock:cur.clock,KB:(cur.storageBytes/1024)|0,head:cur.headroom,perTick:cur.recentPerTick,wall:cur.wallS}));}
  else {cur={clock:clk};if(tickMs.length%20===0)console.log('..',clk,tickMs.at(-1).perTick,'ms/tick',((Date.now()-t0)/1000)|0,'s');}
  fs.writeFileSync(path.join(OUT,'ticks.json'),JSON.stringify(tickMs));
 }
 const snap=await page.evaluate(()=>localStorage.getItem('save data'));fs.writeFileSync(path.join(OUT,'final-save-'+cur.clock+'.json'),snap);
 fs.writeFileSync(path.join(OUT,'errors.json'),JSON.stringify(errors));console.log('errors',errors);
 await context.close();await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
