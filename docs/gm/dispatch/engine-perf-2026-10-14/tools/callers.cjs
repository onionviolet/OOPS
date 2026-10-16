// node callers.cjs prof map srcSubstring : inclusive time of target grouped by caller chain (3 frames)
const fs=require('fs');const {SourceMap}=require('node:module');
const [P,M,T]=process.argv.slice(2);const prof=JSON.parse(fs.readFileSync(P));const sm=new SourceMap(JSON.parse(fs.readFileSync(M)));
const dt={};prof.samples.forEach((s,i)=>dt[s]=(dt[s]||0)+(prof.timeDeltas[i]||0));
const by=new Map(prof.nodes.map(n=>[n.id,n]));const par=new Map();for(const n of prof.nodes)for(const c of n.children||[])par.set(c,n.id);
const name=n=>{const cf=n.callFrame;if(cf.url.includes('bundle')){const e=sm.findEntry(cf.lineNumber,cf.columnNumber);if(e&&e.originalSource)return `${e.originalSource.replace(/.*\/src\//,'src/')}:${e.originalLine+1} ${e.name||cf.functionName}`;}return cf.functionName||cf.url||'?';};
const nm=new Map(prof.nodes.map(n=>[n.id,name(n)]));
const incl=id=>{let t=dt[id]||0;for(const c of by.get(id).children||[])t+=incl(c);return t;};
const agg={};for(const n of prof.nodes){if(!nm.get(n.id).includes(T))continue;let p=par.get(n.id);if(p&&nm.get(p).includes(T))continue;const chain=[];let q=p;for(let i=0;i<4&&q;i++){chain.push(nm.get(q));q=par.get(q);}const k=chain.join(' < ');agg[k]=(agg[k]||0)+incl(n.id)/1000;}
for(const [k,v] of Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,12))console.log(v.toFixed(0)+'ms',k);
