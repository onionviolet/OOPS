import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),snapshot=path.join(root,'work/atlas-snapshot/snapshot.json');
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const snapshotHash=hash(snapshot),registry=JSON.parse(fs.readFileSync('docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json')).books;
const worlds=[...new Set(registry.map(book=>book.world))].sort();
const adopted=JSON.parse(fs.readFileSync(snapshot));
if(worlds.length!==44||adopted.failures.length||adopted.findings.worlds.length!==44)throw Error('Expected clean adopted44-world snapshot');
const env={...process.env};for(const key of ['ATLAS_SNAPSHOT','ATLAS_READER_ROOT','ATLAS_REBUILD','ATLAS_HANDOFFS'])delete env[key];
const summaries=[],started=Date.now(),keys=['expected','selected','inspected','missing','partial','unattested','parsedRows','matchedRows','withheldRows','ambiguousRows','unindexedRows','parseErrors','readErrors'];
for(const world of worlds){
    if(hash(snapshot)!==snapshotHash)throw Error('Adopted snapshot changed during sweep');
    execFileSync(process.execPath,['prototypes/world-atlas/measure-reading-readiness.mjs','--world',world],{cwd:root,env,stdio:['ignore','pipe','pipe'],maxBuffer:2*1024*1024});
    const file=path.join(root,'work/atlas-snapshot/readiness',world+'.json'),report=JSON.parse(fs.readFileSync(file));
    if(report.scope!=='world'||report.binding.snapshotSha256!==snapshotHash||report.binding.digestSha256!==hash(path.join(root,'work/atlas-snapshot/readers',world+'.json')))throw Error('Readiness binding differs');
    const totals=Object.fromEntries(keys.map(key=>[key,report.outputs.reduce((n,row)=>n+row[key],0)]));
    const summary={world,seconds:report.seconds,books:report.books.length,prefixes:report.books.reduce((n,b)=>n+b.prefixes,0),totals,
        fieldRows:report.outputs.reduce((n,row)=>n+(row.fieldRows||0),0),digestSha256:report.binding.digestSha256,reportSha256:hash(file)};
    summaries.push(summary);console.log(JSON.stringify(summary));
}
if(hash(snapshot)!==snapshotHash)throw Error('Adopted snapshot changed after sweep');
const totals=Object.fromEntries(keys.map(key=>[key,summaries.reduce((n,row)=>n+row.totals[key],0)]));
const result={schema:'atlas-all-world-readiness-proof/1',measuredAt:new Date().toISOString(),mode:'One separate process per world, sequential; normal default registry, snapshot and restored inputs',
    snapshotSha256:snapshotHash,worlds:worlds.length,worldsWithObservedPrefixes:summaries.filter(r=>r.prefixes).length,
    registryEntries:registry.length,seconds:(Date.now()-started)/1000,totals,summaries,
    note:'Counts cover selected observed prefixes and exact public digest joins, not all possible chapter ranges, source truth, fresh reading, unique world entities or implemented gameplay.'};
fs.writeFileSync('docs/representations/evidence/atlas-reader-visual-2026-11-25/all-world-readiness-result.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({complete:true,worlds:result.worlds,worldsWithObservedPrefixes:result.worldsWithObservedPrefixes,seconds:result.seconds,totals}));
