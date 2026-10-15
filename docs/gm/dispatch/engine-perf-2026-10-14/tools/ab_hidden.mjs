// A/B idle: node ab.mjs <baseRev|DIR> <headRev|WORKTREE|DIR> <fixture.json> <sec> <reps> [modes=visible,hidden]
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs');
const [A,B,FIX,SEC='20',REPS='2',MODES='visible,hidden']=process.argv.slice(2);
const V=await import('./vis.mjs');
const S=process.env.YAIRPG_SCRATCH||path.join(os.tmpdir(),'yairpg-ab'); fs.mkdirSync(S,{recursive:true});
async function tree(rev,name){ if(fs.existsSync(path.join(rev,'dist/bundle.js')))return rev; const d=path.join(S,'build-'+name); L.prepareTree(rev,d); await L.build(d); return d;}
const dirs=[await tree(A,'a'),await tree(B,'b')]; const srv=[await L.serve(dirs[0]),await L.serve(dirs[1])];
const fx=fs.readFileSync(FIX,'utf8'); const out=[];
const load=()=>os.loadavg()[0].toFixed(0);
const browser=await L.launchChrome();
try{ for(let r=0;r<+REPS;r++) for(const mode of MODES.split(',')) for(const i of [0,1]){
  const {context,page,errors}=await V.openGameVis(L,browser,srv[i].url,fx);
  try{ await page.waitForTimeout(4000); let other;
    if(mode==='hidden'){await V.setHidden(page,true);await page.waitForTimeout(1500);}
    const hidden=await page.evaluate(()=>document.hidden);
    const l0=load(); const w=await L.idleWindow(context,page,+SEC);
    const row={rep:r,mode,build:i?'B':'A',hidden,load:`${l0}-${load()}`,...w,errors:errors.length};
    out.push(row); console.log(JSON.stringify(row));
  } finally{await context.close();}
}} finally{await browser.close(); for(const s of srv)await s.close();}
fs.writeFileSync(path.join(S,'ab-last.json'),JSON.stringify(out,null,1));
