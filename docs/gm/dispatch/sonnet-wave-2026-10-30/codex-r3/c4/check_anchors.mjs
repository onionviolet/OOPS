// Validate anchor addressability without printing source prose.
import {readFileSync} from 'node:fs';
import {shardIndex,locatorsOf} from '../../../../../../scripts/lead_run/cite_paragraphs.mjs';
const base='docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27';
const dir=`${base}/l4/v4plus`;
const manifest=JSON.parse(readFileSync(`${dir}/manifest.json`,'utf8'));
const index=shardIndex(base), counts={};
const missing=[];
for(const batch of manifest.batches){
 const total={ids:0,occurrences:0,anchors:0,found:0,missing:0,inferredBook:0};
 const rows=readFileSync(batch.input,'utf8').split('\n').filter(Boolean).map(JSON.parse);
 for(const r of rows){
  total.ids++;
  for(const o of r.occurrences){
   total.occurrences++;
   const keys=locatorsOf({locator:o.locator});
   if(!keys.length){total.missing++;missing.push({id:r.id,locator:o.locator,reason:'unparseable'});}
   for(const key of keys){
    let [book,ch,p]=key.split(':').map(Number);
    if(book===0&&o.volume>1){book=o.volume;total.inferredBook++;}
    total.anchors++;
    if(index.has(`${book}:${ch}:${p}`))total.found++;
    else{total.missing++;missing.push({id:r.id,locator:o.locator,book,ch,p});}
   }
  }
 }
 counts[batch.input.split('/').at(-1)]=total;
}
// Details stay private for reader gap handling, not in tracked reports.
const {writeFileSync}=await import('node:fs');
writeFileSync(`${dir}/anchor_check.json`,JSON.stringify({counts,missing},null,2)+'\n');
console.log(JSON.stringify({counts,missing:missing.length},null,2));
