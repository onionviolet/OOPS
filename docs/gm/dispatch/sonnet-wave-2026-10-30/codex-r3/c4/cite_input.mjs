// Exact assigned-anchor fallback. Prints private source text to the reader only.
import {readFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const {shardIndex,locatorsOf}=await import(pathToFileURL(join(root,'scripts/lead_run/cite_paragraphs.mjs')));
const args=process.argv.slice(2), value=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const input=resolve(args[0]||'');
const allowed=join(root,'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/');
if(!input.startsWith(allowed))throw Error('Expected an owned C4 private input.');
const rows=readFileSync(input,'utf8').split('\n').filter(Boolean).map(JSON.parse);
const row=rows.find(r=>r.id===value('--id'));
if(!row)throw Error('Assigned ID not found.');
const i=Number(value('--occurrence','0')), occurrence=row.occurrences[i];
if(!Number.isSafeInteger(i)||i<0||!occurrence)throw Error('Occurrence index is out of range.');
const keys=locatorsOf({locator:occurrence.locator});
if(!keys.length)throw Error('No parseable anchor; record a gap.');
const index=shardIndex(join(root,'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27'));
for(const key of keys){
 let [book,ch,p]=key.split(':').map(Number);
 const inferred=book===0&&occurrence.volume>1;
 if(inferred)book=occurrence.volume;
 console.log(JSON.stringify({id:row.id,occurrence:i,volume:occurrence.volume,locator:occurrence.locator,book,chapter:ch,paragraph:p,inferred_book:inferred,...(inferred?{basis:'Input shard-derived volume repairs omitted book prefix.'}:{})}));
 for(let q=Math.max(1,p-3);q<=p+3;q++){
  const text=index.get(`${book}:${ch}:${q}`);
  if(text)console.log(`${q===p?'*':' '} [b${book||1} ch${ch} p${q}] ${text}`);
  else if(q===p)console.log('MISSING ANCHOR: record a gap, do not extract from the metadata.');
 }
}
