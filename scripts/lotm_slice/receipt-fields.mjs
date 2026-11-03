#!/usr/bin/env node
// T6: print receipt verification text from a slice's browser-result.json (stdout only).
// Usage: node scripts/lotm_slice/receipt-fields.mjs <browser-result.json> [--bundle-sha <sha>]
import fs from 'node:fs';
export function receiptFields(r,{expectBundle}={}){
  const t=r.timings||[],sum=p=>t.filter(x=>x.phase===p),sec=ms=>(ms/1000).toFixed(1),n=p=>sum(p).length;
  const acts=sum('native-action').map(x=>x.ms),settles=sum('settle').map(x=>x.ms);
  const errs=r.pageErrors||[],steps=r.steps||[],status=r.error?'FAILED':'Passed';
  const money=[...new Set(steps.map(s=>s.money))],inv=money.length===1?`money ${money[0]} unchanged`:`money ${money.join(' -> ')}`;
  const L=[];
  L.push(`| Native route, headless Chrome | ${status}: ${steps.length} intents, ${inv}, ${errs.length} page errors, ${sec(r.wallMs)} s | |`);
  L.push('');
  L.push(`- Bundle sha256: ${r.bundleSha256}${expectBundle?(r.bundleSha256===expectBundle?' (matches expected)':' (MISMATCH, expected '+expectBundle+')'):''}`);
  L.push(`- Pack sha256: ${r.packSha256}`);
  L.push(`- Boot/import counts: ${n('boot')} boots and ${n('import')} import${n('import')===1?'':'s'} (one run).`);
  L.push(`- Timings: boot ${sum('boot').map(x=>sec(x.ms)).join(' / ')} s; import ${sum('import').map(x=>sec(x.ms)).join(' / ')||'none'} s; native-action ${acts.length?sec(Math.min(...acts))+'-'+sec(Math.max(...acts)):'none'} s each; settle ${settles.length?sec(Math.min(...settles))+'-'+sec(Math.max(...settles)):'none'} s each; wall ${sec(r.wallMs)} s.`);
  L.push(`- Page errors: ${errs.length?JSON.stringify(errs):'0'}`);
  if(r.error)L.push(`- Error: ${String(r.error).split('\n')[0]}`);
  L.push('- Steps:');
  for(const s of steps)L.push(`  - ${s.id}: ${s.minutes} min, at ${s.location}, money ${s.money}`);
  for(const c of r.checks||[])L.push(`- Check: ${c}`);
  return L.join('\n');
}
if(import.meta.url===`file://${process.argv[1]}`){
  const a=process.argv.slice(2),file=a.find(x=>!x.startsWith('--')&&a[a.indexOf(x)-1]!=='--bundle-sha');
  if(!file){console.error('usage: receipt-fields.mjs <browser-result.json> [--bundle-sha <sha>]');process.exit(2);}
  const bi=a.indexOf('--bundle-sha');
  console.log(receiptFields(JSON.parse(fs.readFileSync(file,'utf8')),{expectBundle:bi>=0?a[bi+1]:undefined}));
}
