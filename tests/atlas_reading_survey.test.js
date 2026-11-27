import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {savedReadingSurvey} from '../prototypes/world-atlas/reading-survey.mjs';
import {OUTPUT_KINDS} from '../prototypes/world-atlas/batch-output-index.mjs';

test('saved survey keeps a zero-world measurement distinct from missing, partial-scope and invalid files',async t=>{
    const root=await mkdtemp(join(tmpdir(),'atlas-survey-'));
    t.after(()=>rm(root,{recursive:true,force:true}));
    const folder=join(root,'readiness');await mkdir(folder);
    const outputs=OUTPUT_KINDS.map(({pass,kind})=>({pass,kind,parsedRows:0,matchedRows:0,withheldRows:0,unindexedRows:0,missing:0,unattested:0}));
    const report={schema:'atlas-reading-readiness/1',scope:'world',measuredAt:'2026-11-25T00:00:00Z',books:[{prefixes:0}],outputs,privateText:'do not expose'};
    for(const [world,overrides] of Object.entries({empty:{},subset:{scope:'subset'},broken:{outputs:outputs.slice(1)}}))
        await writeFile(join(folder,world+'.json'),JSON.stringify({...report,world,...overrides}));
    const result=savedReadingSurvey(['absent','broken','empty','empty','subset'].map(world=>({world})),join(root,'snapshot.json'));
    assert.deepEqual(result.map(row=>[row.world,row.status||'measured']),[['absent','missing'],['broken','unavailable'],['empty','measured'],['subset','unavailable']]);
    assert.equal(result[2].totals.missing,0);
    assert.equal(result[2].prefixes,0);
    assert.doesNotMatch(JSON.stringify(result),/do not expose/);
});
