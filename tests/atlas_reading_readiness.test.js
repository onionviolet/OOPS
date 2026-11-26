import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {measureReadingReadiness,readMeasuredReadiness,readReadinessFollowups,sha} from '../prototypes/world-atlas/reading-readiness.mjs';
import {createBookOutputReader} from '../prototypes/world-atlas/output-records.mjs';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
import {OUTPUT_KINDS} from '../prototypes/world-atlas/batch-output-index.mjs';
function setup(t){
 const dir=mkdtempSync(join(tmpdir(),'readiness-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const book={key:'x',world:'w',dir:pathToFileURL(dir).href,shards:{prefix:'x',size:1}},registry=[book];
 const write=(name,value)=>writeFileSync(join(dir,name),typeof value==='string'?value:value.map(r=>JSON.stringify(r)).join('\n'));
 write('shard_x_ch001-001.txt','');write('shard_x_ch002-002.txt','');
 const source={prefix:'xc001',census:[{id:'w.ticket',kind:'item',label:'Public ticket'}]};
 const digest=digestWorld({world:'w',shards:[source]});
 write('xc001m_census.jsonl',[{id:'w.ticket'},{id:'PRIVATE-UNINDEXED',label:'PRIVATE-RAW'},{id:'PRIVATE-SEALED',sealed:['S1']}]);
 write('xc001_rules.jsonl','{bad');write('xc001_rules.partial','');
 write('xc001_services.jsonl',[]);
 const snapshot=join(dir,'snapshot.json'),digestFile=join(dir,'digest.json'),file=join(dir,'report.json');
 writeFileSync(snapshot,'{}');writeFileSync(digestFile,JSON.stringify(digest));
 const options={world:'w',registry,digest,snapshotBytes:readFileSync(snapshot),digestBytes:readFileSync(digestFile)};
 return {dir,book,registry,digest,write,options,snapshot,digestFile,file};
}
test('aggregate preserves twelve-kind direct-reader counts across missing and mixed files without raw material',t=>{
 const f=setup(t),report=measureReadingReadiness(f.options),reader=createBookOutputReader(f.book,{registry:f.registry,digest:f.digest});
 assert.equal(report.outputs.length,12);assert.equal(report.books[0].prefixes,2);
 for(const def of OUTPUT_KINDS){const target=report.outputs.find(r=>r.pass===def.pass&&r.kind===def.kind);
  const pages=reader.prefixes.map(prefix=>reader.read({prefix,pass:def.pass,kind:def.kind}));
  assert.equal(target.parsedRows,pages.reduce((n,p)=>n+p.counts.fileRows,0));assert.equal(target.matchedRows,pages.reduce((n,p)=>n+p.counts.matchedRows,0));assert.equal(target.expected,pages.length);
 }
 const census=report.outputs[0];assert.deepEqual([census.selected,census.inspected,census.missing,census.parsedRows,census.matchedRows,census.withheldRows,census.unindexedRows],[1,1,1,3,1,1,1]);
 const rules=report.outputs.find(r=>r.kind==='rules');assert.equal(rules.partial,1);assert.equal(rules.parseErrors,1);
 assert.equal(report.books[0].outputs[0].fieldRows,1);
 assert.doesNotMatch(JSON.stringify(report),/PRIVATE|w\.ticket|readiness-|\.jsonl|file:\/\//);
 assert.equal(report.binding.snapshotSha256,sha('{}'));
});
test('selection without admitted digest is explicitly unattested; read failures remain errors',t=>{
 const f=setup(t),noDigest=measureReadingReadiness({...f.options,digest:null});assert.equal(noDigest.outputs[0].unattested,1);assert.equal(noDigest.outputs[0].inspected,0);
 const bad=measureReadingReadiness({...f.options,readerOptions:{readFile:()=>{throw Error('PRIVATE PATH');}}});assert.equal(bad.outputs[0].readErrors,1);assert.equal(bad.outputs[0].unattested,0);assert.doesNotMatch(JSON.stringify(bad),/PRIVATE PATH/);
});
test('stored status separates missing, measured, stale snapshot/digest and changed file metadata',t=>{
 const f=setup(t),query={world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file};
 assert.equal(readMeasuredReadiness(query).status,'missing');writeFileSync(f.file,JSON.stringify(measureReadingReadiness(f.options)));
 assert.equal(readMeasuredReadiness(query).status,'measured');
 const report=JSON.parse(readFileSync(f.file));
 assert.match(report.binding.calculationSha256,/^[a-f0-9]{64}$/);
 for(const previous of [undefined,'f'.repeat(64)]){
  const binding={...report.binding,calculationSha256:previous};
  writeFileSync(f.file,JSON.stringify({...report,binding}));
  assert.deepEqual(readMeasuredReadiness(query).stale,['reading-calculation']);
 }
 writeFileSync(f.file,JSON.stringify(report));
 f.write('xc001m_census.jsonl',[]);assert.ok(readMeasuredReadiness(query).stale.includes('selected-file-metadata'));
 writeFileSync(f.snapshot,'{"changed":true}');writeFileSync(f.digestFile,'{}');const result=readMeasuredReadiness(query);assert.ok(result.stale.includes('snapshot'));assert.ok(result.stale.includes('world-digest'));
});
test('bounded subsets are labelled and cannot imply current whole archive',t=>{
 const f=setup(t),report=measureReadingReadiness({...f.options,prefixes:['xc001'],fields:false});assert.equal(report.scope,'subset');assert.equal(report.outputs[0].expected,1);assert.equal(report.books[0].outputs[0].fields,undefined);
 writeFileSync(f.file,JSON.stringify(report));const result=readMeasuredReadiness({world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file});assert.equal(result.fileState,'not-checked');
});
test('ambiguous joins retain their count and stored artifacts cannot add public raw fields',t=>{
 const f=setup(t);f.digest.entities.push({...f.digest.entities[0],label:'Other public ticket'});
 const report=measureReadingReadiness(f.options);assert.equal(report.outputs[0].ambiguousRows,1);
 report.raw='PRIVATE RAW';report.note='PRIVATE NOTE';report.outputs[0].raw='PRIVATE ROW';report.books.push({key:'PRIVATE KEY'});
 report.books[0].outputs[0].fields.push({id:'PRIVATE FIELD',rows:8});writeFileSync(f.file,JSON.stringify(report));
 const response=readMeasuredReadiness({world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file});assert.doesNotMatch(JSON.stringify(response),/PRIVATE/);
});
test('world field coverage sums independently across books and survives the public GET projection',t=>{
 const f=setup(t),other={...f.book,key:'y'};f.registry.push(other);
 f.write('shard_y_ch001-001.txt','');f.write('yc001m_census.jsonl',[{id:'w.ticket',zh:'PRIVATE SOURCE VALUE',aliases:['PRIVATE ALIAS']}]);
 const report=measureReadingReadiness(f.options),world=report.outputs[0],first=report.books[0].outputs[0],second=report.books[1].outputs[0];
 assert.equal(world.fieldRows,2);assert.equal(world.fieldRows,first.fieldRows+second.fieldRows);
 for(const field of world.fields)assert.equal(field.rows,first.fields.find(r=>r.id===field.id).rows+second.fields.find(r=>r.id===field.id).rows);
 assert.equal(world.fields.find(r=>r.id==='original-name').rows,1);assert.equal(first.fields.find(r=>r.id==='original-name').rows,0,'world accumulation must not mutate book counts');
 writeFileSync(f.file,JSON.stringify(report));const response=readMeasuredReadiness({world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file});
 assert.deepEqual(response.report.outputs[0].fields,world.fields);assert.equal(response.report.outputs[0].fieldRows,2);assert.doesNotMatch(JSON.stringify(response),/PRIVATE SOURCE VALUE|PRIVATE ALIAS/);
});
test('missing selector markers and clean Luna fallback use the shared canonical selection',t=>{
 const f=setup(t);f.write('xc002_full.partial','');
 f.write('xc001_census.partial','');f.write('xc001Lm_census.jsonl',[{id:'w.ticket'}]);
 const reader=createBookOutputReader(f.book,{registry:f.registry,digest:f.digest});assert.equal(reader.selected('xc001','census','census').source,'luna');
 const report=measureReadingReadiness(f.options),census=report.outputs[0];
 assert.deepEqual([census.expected,census.selected,census.inspected,census.missing,census.partial,census.parsedRows],[2,1,1,1,1,1]);
 assert.equal(report.outputs.find(r=>r.pass==='scenes'&&r.kind==='scenes').partial,1,'a missing full-pass marker remains partial rather than selected');
});


test('saved follow-ups are count-only, reason-separated and paginated without source inspection',t=>{
 const f=setup(t),report=measureReadingReadiness(f.options),query={world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file};
 writeFileSync(f.file,JSON.stringify(report));
 const summary=readMeasuredReadiness(query);assert.deepEqual(summary.report.followups,{status:'available'});assert.equal(summary.report.followups.files,undefined);
 const unindexed=readReadinessFollowups(query);assert.equal(unindexed.status,'measured');assert.equal(unindexed.total,1);assert.equal(unindexed.files[0].route,'#library/outputs/x/xc001/census/census');assert.equal(unindexed.files[0].counts.unindexedRows,1);
 assert.doesNotMatch(JSON.stringify(unindexed),/PRIVATE|w\.ticket|\.jsonl|file:\/\//);
 const missing=readReadinessFollowups(query,{reason:'missing',limit:2});assert.equal(missing.total,21);assert.equal(missing.files.length,2);assert.equal(missing.files[0].counts.missing,1);
 const next=readReadinessFollowups(query,{reason:'missing',limit:2,offset:2});assert.equal(next.total,missing.total);assert.notDeepEqual(next.files,missing.files);
 assert.ok(readReadinessFollowups(query,{reason:'partial'}).files.some(f=>f.kind==='rules'));assert.equal(readReadinessFollowups(query,{reason:'errors'}).files[0].counts.parseErrors,1);
 assert.equal(readReadinessFollowups(query,{reason:'unattested'}).total,0);
 f.write('xc001m_census.jsonl','{malformed now');const saved=readReadinessFollowups(query);assert.equal(saved.status,'stale');assert.equal(saved.files[0].counts.unindexedRows,1,'uses saved count, not changed output bytes');assert.ok(saved.stale.includes('selected-file-metadata'));
 for(const options of [{reason:'PRIVATE'},{offset:-1},{limit:51},{offset:0.5}])assert.throws(()=>readReadinessFollowups(query,options));
});

test('follow-up boundary rejects injected identities/routes and orders largest unresolved files first',t=>{
 const f=setup(t),report=measureReadingReadiness(f.options),base=report.followups.files.find(f=>f.counts.unindexedRows),query={world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file};
 report.followups.files.push({...base,prefix:'xc002',counts:{...base.counts,unindexedRows:7},route:'PRIVATE ROUTE',raw:'PRIVATE RAW'}, {...base,key:'foreign'}, {...base,prefix:'../../PRIVATE'}, {...base,prefix:'xc003',pass:'PRIVATE'}, {...base,prefix:'xc004',counts:{withheldRows:100}}, {...base,prefix:'xc005',counts:{unindexedRows:'PRIVATE'}}, {...base});
 writeFileSync(f.file,JSON.stringify(report));const result=readReadinessFollowups(query);assert.equal(result.total,2);assert.deepEqual(result.files.map(f=>f.prefix),['xc002','xc001']);assert.equal(result.files[0].counts.unindexedRows,7);assert.doesNotMatch(JSON.stringify(result),/PRIVATE|foreign|raw/);assert.equal(result.files[0].route,'#library/outputs/x/xc002/census/census');
});

test('old and absent reports request remeasurement rather than manufacturing empty follow-ups',t=>{
 const f=setup(t),query={world:'w',registry:f.registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file};
 assert.deepEqual([readReadinessFollowups(query).availability,readReadinessFollowups(query).total],['missing',null]);
 const report=measureReadingReadiness(f.options);delete report.followups;delete report.binding.calculationSha256;writeFileSync(f.file,JSON.stringify(report));
 const legacy=readReadinessFollowups(query);assert.equal(legacy.availability,'remeasure');assert.equal(legacy.total,null);assert.equal(legacy.status,'stale');assert.deepEqual(legacy.stale,['reading-calculation']);assert.deepEqual(legacy.files,[]);
});

test('withheld-only selected files never become follow-ups',t=>{
 const f=setup(t);f.write('xc001m_census.jsonl',[{id:'PRIVATE',sealed:['S1']}]);const report=measureReadingReadiness(f.options);
 assert.equal(report.outputs[0].withheldRows,1);assert.equal(report.followups.files.some(r=>r.prefix==='xc001'&&r.kind==='census'),false);
});


test('legacy follow-up prefix ownership remains with the first shared registry entry',t=>{
 const f=setup(t),other={...f.book,key:'y'},registry=[f.book,other],query={world:'w',registry,snapshot:f.snapshot,digestFile:f.digestFile,file:f.file},report=measureReadingReadiness({...f.options,registry});
 report.followups.files=[{key:'x',prefix:'b1s2',pass:'rules',kind:'rules',counts:{unindexedRows:2}},{key:'y',prefix:'b1s2',pass:'rules',kind:'rules',counts:{unindexedRows:9}},{key:'x',prefix:'yc001',pass:'rules',kind:'rules',counts:{unindexedRows:9}}];writeFileSync(f.file,JSON.stringify(report));
 const result=readReadinessFollowups(query);assert.equal(result.total,1);assert.equal(result.files[0].key,'x');assert.equal(result.files[0].prefix,'b1s2');
});
