// node savediff.mjs <builtDir> [fixture|none] : capture successive durable writes while idle, report which paths differ.
import fs from 'node:fs';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs'); const V=await import('./vis.mjs');
const [DIR,FIX]=process.argv.slice(2); const fx=FIX&&FIX!=='none'?fs.readFileSync(FIX,'utf8'):null;
const srv=await L.serve(DIR); const b=await L.launchChrome();
try{const {context,page}=await V.openGameVis(L,b,srv.url,fx);
 await page.evaluate(()=>{window.__w=[];const o=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')window.__w.push(v);return o.call(this,k,v);};});
 await page.waitForTimeout(8000);
 const ws=await page.evaluate(()=>window.__w);
 const diff=(a,b,p='',out=[])=>{if(JSON.stringify(a)===JSON.stringify(b))return out;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'/'+k,out);}else out.push(p);return out;};
 const paths={};for(let i=1;i<ws.length;i++)for(const p of diff(JSON.parse(ws[i-1]),JSON.parse(ws[i])))paths[p]=(paths[p]||0)+1;
 console.log(JSON.stringify({writes:ws.length,paths}));
}finally{await b.close();await srv.close();}
