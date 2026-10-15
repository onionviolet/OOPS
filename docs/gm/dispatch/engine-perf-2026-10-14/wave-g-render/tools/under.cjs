// inclusive time by source function, only for samples with an ancestor in file F (or display.js line range)
const fs=require('fs');const {SourceMap}=require('node:module');
const [,,mapf,F,lo,hi,...profs]=process.argv;const sm=new SourceMap(JSON.parse(fs.readFileSync(mapf)));
const incl={};let tot=0;
for(const pf of profs){const prof=JSON.parse(fs.readFileSync(pf));
const dt={};prof.samples.forEach((s,i)=>dt[s]=(dt[s]||0)+(prof.timeDeltas[i]||0));
const parent=new Map();for(const n of prof.nodes)for(const c of n.children||[])parent.set(c,n.id);
const key=new Map(prof.nodes.map(n=>{const f=n.callFrame;if(!f.url.includes('bundle.js'))return [n.id,{k:f.functionName||'(native)'}];const e=sm.findEntry(f.lineNumber,f.columnNumber);if(!e?.originalSource)return [n.id,{k:'?'}];const file=e.originalSource.split('/').pop();return [n.id,{k:file+':'+(e.originalLine+1)+' '+(e.name||f.functionName),file,line:e.originalLine+1}];}));
const hit=id=>{const x=key.get(id);return x.file===F&&(lo==='-'||(x.line>=+lo&&x.line<=+hi));};
for(const n of prof.nodes){const t=dt[n.id]||0;if(!t)continue;let p=n.id,inside=false;const chain=[];while(p!==undefined){chain.push(p);if(hit(p))inside=true;p=parent.get(p);}if(!inside)continue;tot+=t;const seen=new Set();for(const c of chain){const k=key.get(c).k;if(!seen.has(k)){seen.add(k);incl[k]=(incl[k]||0)+t;}}}}
console.log('total',(tot/1000).toFixed(0));for(const [k,v] of Object.entries(incl).sort((a,b)=>b[1]-a[1]).slice(0,+process.env.N||40))console.log((v/1000).toFixed(0).padStart(6),k);
