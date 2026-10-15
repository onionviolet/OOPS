// Split busy-combat CPU profile: combat attack-loop machinery vs the swing it triggers (exchange host / resolveExchange).
const fs=require('node:fs');const {SourceMap}=require('node:module');
const prof=JSON.parse(fs.readFileSync(process.argv[2]));const sm=new SourceMap(JSON.parse(fs.readFileSync(process.argv[3])));
const dt={};prof.samples.forEach((s,i)=>dt[s]=(dt[s]||0)+(prof.timeDeltas[i]||0));
const parent=new Map();for(const n of prof.nodes)for(const c of n.children||[])parent.set(c,n.id);
const byId=new Map(prof.nodes.map(n=>[n.id,n]));
const key=n=>{const f=n.callFrame;if(!f.url.includes('bundle.js'))return f.functionName;const e=sm.findEntry(f.lineNumber,f.columnNumber);return e?.originalSource?(e.originalSource.replace(/.*\/src\//,'src/')+' '+(e.name||f.functionName)):'?';};
const keys=new Map(prof.nodes.map(n=>[n.id,key(n)]));
let machinery=0,swing=0,busy=0,worker=0;
for(const n of prof.nodes){const t=dt[n.id]||0;const k=keys.get(n.id);if(k==='(idle)'||k==='(program)')continue;busy+=t;
 let p=n.id,inSwing=false,inCombat=false;while(p!==undefined){const kk=keys.get(p)||'';if(/runP23CombatExchange|resolveExchange/.test(kk))inSwing=true;if(kk.startsWith('src/models/combat.js'))inCombat=true;p=parent.get(p);}
 if(inCombat){if(inSwing)swing+=t;else machinery+=t;}}
console.log(JSON.stringify({busyMs:+(busy/1000).toFixed(0),combatMachineryMs:+(machinery/1000).toFixed(0),combatSwingMs:+(swing/1000).toFixed(0)}));
