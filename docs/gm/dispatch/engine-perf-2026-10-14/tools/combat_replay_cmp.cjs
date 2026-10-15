// Compare replay outputs: canonical durable save, snapshot save, combat log. Prints first differing paths.
const fs=require('node:fs');const [A,B]=process.argv.slice(2).map(f=>JSON.parse(fs.readFileSync(f)));
const diffs=[];const walk=(a,b,p)=>{if(diffs.length>12)return;if(typeof a!==typeof b||Array.isArray(a)!==Array.isArray(b)||(a===null)!==(b===null)){diffs.push(p+': '+JSON.stringify(a)?.slice(0,120)+' vs '+JSON.stringify(b)?.slice(0,120));return;}
 if(a&&typeof a==='object'){const ks=new Set([...Object.keys(a),...Object.keys(b)]);for(const k of ks)walk(a[k],b[k],p+'.'+k);if(JSON.stringify(Object.keys(a))!==JSON.stringify(Object.keys(b)))diffs.push(p+': key order');}else if(a!==b)diffs.push(p+': '+JSON.stringify(a)?.slice(0,120)+' vs '+JSON.stringify(b)?.slice(0,120));};
for(const k of ['ticks','kills','durable','save','log'])walk(A[k],B[k],k);
const same=k=>JSON.stringify(A[k])===JSON.stringify(B[k]);
console.log(JSON.stringify({ticks:[A.ticks,B.ticks],kills:[A.kills,B.kills],durableIdentical:same('durable'),saveIdentical:same('save'),logIdentical:same('log'),durableBytes:JSON.stringify(A.durable).length,logLines:A.log.length}));
if(diffs.length)console.log(diffs.join('\n'));
