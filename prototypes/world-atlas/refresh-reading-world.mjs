// Build a standalone Atlas candidate after one world's reading outputs change.
import {createHash} from 'node:crypto';
import {copyFileSync,mkdirSync,mkdtempSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {SNAPSHOT} from './build.mjs';
import {findingsMatrix,readFindings} from './reader-findings.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');

export function replaceWorldFindings(snapshot,digest) {
    const {columns,worlds}=findingsMatrix([digest]);
    const baseline=snapshot.findings;
    if (JSON.stringify(columns)!==JSON.stringify(baseline.columns))
        throw Error('The findings columns changed. Run the full Atlas build.');
    if (baseline.worlds.filter(row=>row.world===digest.world).length!==1)
        throw Error('Choose one world already present in the snapshot.');
    return {...snapshot,findings:{...baseline,worlds:baseline.worlds.map(row=>row.world===digest.world?worlds[0]:row)}};
}

export function prepareReadingWorld(world,snapshotPath=SNAPSHOT) {
    if (!/^[a-z0-9_-]+$/i.test(world||'')) throw Error('Supply a registered world ID.');
    const base=dirname(snapshotPath),original=readFileSync(snapshotPath),snapshot=JSON.parse(original);
    if (!snapshot.findings?.worlds.some(row=>row.world===world)) throw Error('World missing from the saved findings.');
    const priorDigest=sha(readFileSync(join(base,'readers',world+'.json')));
    const [digest]=readFindings({world});
    if (digest?.world!==world) throw Error('The registry did not produce the requested world.');
    const next=replaceWorldFindings(snapshot,digest);
    const updated=JSON.stringify(digest);
    const revision={world,at:new Date().toISOString(),previousSnapshotSha256:sha(original),
        previousDigestSha256:priorDigest,digestSha256:sha(updated)};
    next.readingUpdates={...snapshot.readingUpdates,[world]:revision};
    if(snapshot.findings.worlds.some(row=>!/^[a-z0-9_-]+$/i.test(row.world))) throw Error('Invalid saved world ID.');
    const candidate=mkdtempSync(join(dirname(base),'atlas-reading-'+world+'-'));
    const readers=join(candidate,'readers');
    mkdirSync(readers);
    for (const row of snapshot.findings.worlds) {
        const name=row.world+'.json';
        if(row.world===world) writeFileSync(join(readers,name),updated);
        else copyFileSync(join(base,'readers',name),join(readers,name));
    }
    if (sha(readFileSync(snapshotPath))!==revision.previousSnapshotSha256 ||
        sha(readFileSync(join(base,'readers',world+'.json')))!==priorDigest)
        throw Error('The baseline changed. Candidate is incomplete at '+candidate);
    const bytes=JSON.stringify(next);
    writeFileSync(join(candidate,'snapshot.json'),bytes);
    return {candidate,snapshotSha256:sha(bytes),...revision};
}

if (import.meta.main) console.log(JSON.stringify(prepareReadingWorld(process.argv[2])));
