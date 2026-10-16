// node dethid.mjs <dirA> <dirB> <fixture> <minutes> [hideA=0] [hideB=1]: durable save at fixture minute+N, natural ticks.
import fs from 'node:fs';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs'); const V=await import('./vis.mjs');
const [A,B,FIX,N='20',HA='0',HB='1']=process.argv.slice(2); const fx=fs.readFileSync(FIX,'utf8');
const br=await L.launchChrome(); const res=[];
try{for(const [dir,hide] of [[A,HA==='1'],[B,HB==='1']]){const srv=await L.serve(dir);
  const {context,page,errors}=await V.openGameVis(L,br,srv.url,fx);
  try{ if(hide)await V.setHidden(page,true);
    const start=L.gameMinutes(JSON.parse(fx)['current time']);
    const raw=await page.waitForFunction(t=>{const v=localStorage.getItem('save data'),c=JSON.parse(v)['current time'];return ((c.day_count*24+c.hour)*60+c.minute)>=t&&v;},start+(+N),{polling:20,timeout:+N*3000+60000});
    const save=JSON.parse(await raw.jsonValue()); for(const k of ['saved_at','total_playtime'])delete save[k];
    res.push({text:JSON.stringify(save),hidden:await page.evaluate(()=>document.hidden),end:L.gameMinutes(save['current time']),clock:save.expansion?.clock,errors});
  }finally{await context.close();await srv.close();}}
}finally{await br.close();}
const [a,b]=res; console.log(JSON.stringify({identical:a.text===b.text,a:{hidden:a.hidden,end:a.end,clock:a.clock,bytes:a.text.length,errors:a.errors},b:{hidden:b.hidden,end:b.end,clock:b.clock,bytes:b.text.length,errors:b.errors}}));
if(a.text!==b.text){fs.writeFileSync('det-a.json',a.text);fs.writeFileSync('det-b.json',b.text);}
