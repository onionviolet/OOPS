#!/usr/bin/env node
// T1: report EVERY over-length string at once. The limit is enforced by validateLotmCast's walk()
// in src/book_world_lotm_cast.js (`value.length > 200`, JS UTF-16 length, whole pack).
// Usage: node scripts/lotm_slice/prescan.mjs <reviewed-episode.json | build-episode.py> [--limit N] [--all]
// Exit 1 when anything is over. A reviewed JSON scans only acts/sequences/visits (what the builder packs) unless --all.
import fs from 'node:fs';import {spawnSync} from 'node:child_process';
export const LIMIT=200,PACKED=['acts','sequences','visits'];
export function scanValue(value,path,limit=LIMIT,out=[]){
  if(typeof value==='string'){if(value.length>limit)out.push({path,length:value.length,limit,over:value.length-limit,preview:value.slice(0,50)});}
  else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))scanValue(v,path?path+'.'+k:k,limit,out);
  return out;
}
export function scanReviewed(review,{limit=LIMIT,all=false}={}){
  const out=[],keys=all?Object.keys(review):PACKED.filter(k=>k in review);
  for(const k of keys){
    for(const f of scanValue(review[k],k,limit)){
      const m=/^acts\.(\d+)\./.exec(f.path),act=m&&review.acts[m[1]];
      out.push(act?{...f,id:act.id}:f);
    }
  }
  return out;
}
const PY=`import sys,json,tokenize,ast
out=[]
with open(sys.argv[1],'rb') as f:
    for t in tokenize.tokenize(f.readline):
        if t.type==tokenize.STRING:
            try:v=ast.literal_eval(t.string)
            except Exception:continue
            if isinstance(v,str):out.append([t.start[0],len(v.encode('utf-16-le'))//2,v[:50]])
print(json.dumps(out))`;
export function scanPython(file,limit=LIMIT){
  const r=spawnSync('python3',['-I','-c',PY,file],{encoding:'utf8'});
  if(r.status!==0)throw new Error('python tokenize failed: '+r.stderr);
  return JSON.parse(r.stdout).filter(([,n])=>n>limit).map(([line,length,preview])=>({path:file.split('/').pop()+':'+line,length,limit,over:length-limit,preview}));
}
export function scanFile(file,opts={}){return file.endsWith('.py')?scanPython(file,opts.limit):scanReviewed(JSON.parse(fs.readFileSync(file,'utf8')),opts);}
export function format(found,limit=LIMIT){
  if(!found.length)return `ok: no string over ${limit} characters`;
  return [`${found.length} string(s) over ${limit} characters:`,...found.map(f=>`  ${f.path}${f.id?' ('+f.id+')':''}  length ${f.length}, limit ${f.limit}, cut ${f.over}  "${f.preview}..."`)].join('\n');
}
if(import.meta.url===`file://${process.argv[1]}`){
  const a=process.argv.slice(2),file=a.find(x=>!x.startsWith('--')&&a[a.indexOf(x)-1]!=='--limit');
  if(!file){console.error('usage: prescan.mjs <reviewed-episode.json|build-episode.py> [--limit N] [--all]');process.exit(2);}
  const li=a.indexOf('--limit'),limit=li>=0?Number(a[li+1]):LIMIT,found=scanFile(file,{limit,all:a.includes('--all')});
  console.log(format(found,limit));process.exit(found.length?1:0);
}
