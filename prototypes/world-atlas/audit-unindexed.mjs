// Deterministic bounded diagnostic. Persist counts and existing public routes only.
import assert from 'node:assert/strict';
import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {registeredBooks} from './library-reading.mjs';
import {createBookOutputReader} from './output-records.mjs';
import {publicLifeRow} from './texture-life.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),registry=registeredBooks();
const base=join(root,'work/atlas-snapshot'),snapshotBytes=readFileSync(join(base,'snapshot.json')),snapshot=JSON.parse(snapshotBytes);
const sha=b=>createHash('sha256').update(b).digest('hex');
const file=join(root,'docs/representations/evidence/atlas-archive-scale-2026-11-25',process.argv[2]||'unindexed-sample.json');
assert.ok(!existsSync(file),'Preserve prior evidence; supply a new result basename.');
const normalize=s=>typeof s==='string'?s.trim().replace(/\s+/g,' ').toLowerCase():'';
const safe=s=>typeof s==='string'&&s.trim()&&!/(?:file:\/\/|[a-z]:[\\/]|(?:^|\s)\/(?:Users|home|tmp|private|var|mnt)\/|https?:\/\/|(?:^|[\\/])private[\\/])/i.test(s);
const supported=new Set(['person','place','item','creature','organization','org','deity','document','language','price','measure','clock','calendar','event']);
const kinds=new Set([...supported,'ability','spell','law','custom','institution','craft','potion','rite','other']);
const totals={},worlds=[];
const inc=(map,key,n=1)=>map[key]=(map[key]||0)+n;
for(const summary of snapshot.findings.worlds.filter(w=>w.read>0)){
 const digest=JSON.parse(readFileSync(join(base,'readers',summary.world+'.json'))),entities=new Map(digest.entities.map(e=>[e.id,e])),rules=new Map(digest.rules.map(r=>[r.id,r]));
 const names=new Map();for(const e of digest.entities)for(const name of [e.label,...e.aliases||[]]){const key=normalize(name);if(key){if(!names.has(key))names.set(key,[]);names.get(key).push(e);}}
 const readers=new Map(),candidates=[];
 for(const book of registry.filter(b=>b.world===summary.world)){
  const reader=createBookOutputReader(book,{registry,digest});readers.set(book.key,reader);
  for(const prefix of reader.prefixes)if(reader.selected(prefix,'census','census').name||reader.selected(prefix,'people','people').name)candidates.push({key:book.key,prefix});
 }
 candidates.sort((a,b)=>(a.key+'\0'+a.prefix).localeCompare(b.key+'\0'+b.prefix,'en'));
 const take=Math.min(12,candidates.length),selected=Array.from({length:take},(_,i)=>candidates[take===1?0:Math.floor(i*(candidates.length-1)/(take-1))]);
 const result={world:summary.world,candidatePrefixes:candidates.length,sampledPrefixes:take,outputs:[],counts:{}};
 for(const sample of selected)for(const kind of ['census','people']){
  const reader=readers.get(sample.key),contents=new Map();
  const query={prefix:sample.prefix,pass:kind,kind,size:100};
  const read=path=>{const bytes=readFileSync(path);contents.set('sha256:'+sha(bytes),bytes);return bytes;};
  let page=reader.read(query,read);
  if(!page.inspected)continue;
  const content=contents.get(page.contentHash);assert.ok(content,'Selected output bytes not captured.');
  const matched=new Set();const collect=p=>{for(const record of p.records)for(const [a,b]of record.fileLines)for(let line=a;line<=b;line++)matched.add(line);};collect(page);
  for(let offset=100;offset<page.total;offset+=100)collect(reader.read({...query,offset},read));
  const out={key:sample.key,prefix:sample.prefix,kind,contentHash:page.contentHash,counts:page.counts,reasons:{},kindCounts:{},publicColumns:{},exactPublicRules:0,alternateFields:{},examples:[]};
  let observed=0,line=0;
  for(const text of String(content).split(/\r?\n/)){
   line++;if(!text.trim())continue;let row;try{row=JSON.parse(text);}catch{continue;}
   if(!row||typeof row!=='object'||Array.isArray(row)||!publicLifeRow(row)||matched.has(line))continue;
   observed++;const id=typeof row.id==='string'&&row.id.trim()?row.id:null,entity=entities.get(id);
   let reason=!id?'missing/non-string identity':entity&&kind==='people'&&entity.col!=='people'?'identity belongs to another public column':entity&&(!safe(entity.label)||!safe(entity.id))?'existing public identity has no safe link label':entity?'other exact-link rejection':kind==='census'&&!supported.has(row.kind)?'unsupported census kind':rules.has(id)?'identity exists as public rule, not entity':'no entity with this public identity';
   inc(out.reasons,reason);inc(result.counts,kind+': '+reason);inc(totals,kind+': '+reason);
   if(kind==='census')inc(out.kindCounts,kinds.has(row.kind)?row.kind:typeof row.kind==='string'?'unrecognized string kind':'missing/non-string kind');
   if(entity)inc(out.publicColumns,entity.col);
   const publicRule=rules.get(id);if(publicRule&&publicLifeRow(publicRule)&&safe(publicRule.name)&&safe(publicRule.id))out.exactPublicRules++;
   const alternative=['person','personId','who','subject','entityId','entity'].find(field=>typeof row[field]==='string'&&entities.get(row[field])?.col==='people');
   if(alternative)inc(out.alternateFields,alternative);
   // Equality with a public label/alias is a candidate, not an attested identity join.
   const aliases=[...new Set([row.name,row.label,id].flatMap(value=>names.get(normalize(value))||[]))].filter(e=>e.id!==id);
   if(aliases.length)inc(out.alternateFields,aliases.length===1?'unique public label/alias equality':'ambiguous public label/alias equality');
   if(out.examples.length<3&&!out.examples.some(e=>e.reason===reason&&!!e.publicRuleHref===!!publicRule))out.examples.push({reason,line,outputHref:'#library/outputs/'+[sample.key,sample.prefix,kind,kind].map(encodeURIComponent).join('/'),
    ...(entity&&safe(entity.id)&&safe(entity.label)?{publicTargetHref:'#world/'+summary.world+'/things/'+encodeURIComponent(entity.id)}:{}),
    ...(publicRule&&publicLifeRow(publicRule)&&safe(publicRule.name)&&safe(publicRule.id)?{publicRuleHref:'#world/'+summary.world+'/'+(['craft','potion','rite','spell'].includes(publicRule.kind)?'making/working:':'things/')+encodeURIComponent(publicRule.id)}:{}),
    ...(alternative?{alternateField:alternative,publicAlternateHref:'#world/'+summary.world+'/things/'+encodeURIComponent(row[alternative])}:{})});
  }
  assert.equal(observed,page.counts.unindexed,'Sample accounting differs from actual exact reader: '+summary.world+'/'+sample.prefix+'/'+kind);
  result.outputs.push(out);
 }
 worlds.push(result);console.log(JSON.stringify({world:result.world,prefixes:take,counts:result.counts}));
}
const output={scope:'up to twelve evenly spaced selected-output prefixes per nonempty world, sorted by book key and prefix; census and people only; no extrapolation',
 snapshotSha256:sha(snapshotBytes),privacy:'Private/sealed rows are excluded by the normal output reader. Public-looking rows absent from the admitted digest do not establish a public identity; no raw IDs, names or prose are emitted.',totals,worlds};
mkdirSync(dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(output,null,2));
