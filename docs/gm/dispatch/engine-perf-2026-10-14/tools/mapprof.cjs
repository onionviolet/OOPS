// Map a CPU profile from the minified bundle back to source: self time by file, inclusive time by source function.
const fs=require('node:fs');const {SourceMap}=require('node:module');
const prof=JSON.parse(fs.readFileSync(process.argv[2]));const sm=new SourceMap(JSON.parse(fs.readFileSync(process.argv[3])));
const dt={};prof.samples.forEach((s,i)=>dt[s]=(dt[s]||0)+(prof.timeDeltas[i]||0));
const byId=new Map(prof.nodes.map(n=>[n.id,n]));const parent=new Map();for(const n of prof.nodes)for(const c of n.children||[])parent.set(c,n.id);
const key=n=>{const f=n.callFrame;if(!f.url.includes('bundle.js'))return f.functionName||f.url||'(native)';const e=sm.findEntry(f.lineNumber,f.columnNumber);if(!e||!e.originalSource)return '?';return e.originalSource.replace(/.*\/src\//,'src/')+':'+(e.originalLine+1)+' '+(e.name||f.functionName);};
const keys=new Map(prof.nodes.map(n=>[n.id,key(n)]));
const self={},file={},incl={};let tot=0,busy=0;
for(const n of prof.nodes){const t=dt[n.id]||0;tot+=t;const k=keys.get(n.id);if(k!=='(idle)'&&k!=='(program)')busy+=t;self[k]=(self[k]||0)+t;const fk=k.split(':')[0];file[fk]=(file[fk]||0)+t;
 const seen=new Set();let p=n.id;while(p!==undefined){const kk=keys.get(p);if(!seen.has(kk)){seen.add(kk);incl[kk]=(incl[kk]||0)+t;}p=parent.get(p);}}
const show=(o,n,title)=>{console.log('\n## '+title);for(const [k,v] of Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,n))console.log((v/1000).toFixed(0).padStart(7)+'ms',(100*v/busy).toFixed(1).padStart(5)+'%',k);};
console.log('total',(tot/1000).toFixed(0),'ms; JS-busy',(busy/1000).toFixed(0),'ms (pct of busy below)');
show(file,25,'self by file');show(incl,45,'inclusive by function');
