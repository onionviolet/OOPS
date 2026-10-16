import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {uiViolations} from '../../../../tests/helpers/ui_contract.mjs';
const base=process.env.R4_URL||'http://127.0.0.1:19154';
const root=process.cwd(),dir=path.dirname(new URL(import.meta.url).pathname);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const map=JSON.parse(fs.readFileSync('dist/bundle.js.map','utf8'));
const mismatches=[];let sourceCount=0,vendorEmbeddedSources=0;
for(let i=0;i<map.sources.length;i++){const file=path.resolve(root,'dist',map.sources[i]);if(!file.startsWith(path.join(root,'src')+path.sep)){vendorEmbeddedSources++;continue;}sourceCount++;if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==map.sourcesContent[i])mismatches.push(map.sources[i]);}
const html=await(await fetch(base+'/')).text();
assert.equal(html,fs.readFileSync('index.html','utf8'));
const urls=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(m=>m[1]).filter(v=>!v.startsWith('http'));
const served=[];for(const url of urls){const response=await fetch(base+'/'+url),bytes=Buffer.from(await response.arrayBuffer()),disk=fs.readFileSync(url.split('?')[0]);served.push({url,status:response.status,match:bytes.equals(disk),sha256:hash(bytes)});}
const ledger=JSON.parse(fs.readFileSync('tests/ui_contract_allowlist.json','utf8')),hits=uiViolations(root),allowed=new Map(ledger.entries.map(h=>[h.key,h.count]));
const unexpected=hits.filter(h=>h.count>(allowed.get(h.key)||0));
const c1=fs.readFileSync('docs/gm/dispatch/ui-foundation-2026-10-15/C1_REPORT.md'),review=JSON.parse(fs.readFileSync('docs/gm/dispatch/ui-triage-apothecary-2026-10-15/runs/C1_ROOT_REVIEW.json','utf8'));
const frozen=JSON.parse(fs.readFileSync(path.join(dir,'evidence/comparison-c1/ROOT_REVIEW.json'),'utf8')).artifacts.map(a=>({path:a.path,match:hash(fs.readFileSync(a.path))===a.sha256}));
const prior=JSON.parse(fs.readFileSync(path.join(dir,'evidence/shell-r2/prior-artifacts.json'),'utf8')).map(a=>({path:a.path,match:hash(fs.readFileSync(a.path))===a.sha256}));
const r3Frozen=Object.entries(JSON.parse(fs.readFileSync(path.join(dir,'evidence/parity-r3/frozen-before.json'),'utf8'))).map(([path,sha256])=>({path,match:hash(fs.readFileSync(path))===sha256}));
const result={r3Frozen,prior,frozen,sourceCount,vendorEmbeddedSources,sourceMismatches:mismatches,served,contract:{entries:hits.length,occurrences:hits.reduce((s,h)=>s+h.count,0),unreviewed:unexpected},c1ReportUnchanged:hash(c1)===review.reportSha256};
fs.writeFileSync(path.join(dir,'evidence/parity-r6/parity.json'),JSON.stringify(result,null,2));
assert(r3Frozen.every(a=>a.match));assert.deepEqual(mismatches,[]);assert(served.every(r=>r.status===200&&r.match));assert.deepEqual(unexpected,[]);assert(result.c1ReportUnchanged);assert(frozen.every(a=>a.match));assert(prior.every(a=>a.match));console.log(JSON.stringify({sources:sourceCount,vendorEmbeddedSources,assets:served.length,contract:result.contract,c1ReportUnchanged:result.c1ReportUnchanged}));
