import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {TRACKED_READINGS,trackedReadings,trackedReadingHref} from '../prototypes/world-atlas/tracked-readings.mjs';

test('other protagonist evidence stays bounded, receipt-qualified and outside batch intake',()=>{
    for(const world of ['hp','ri','mol']){
        const entries=trackedReadings(world);
        assert.equal(entries.length,1);
        const entry=entries[0];
        assert.equal(entry.findings.length,1);
        assert.ok(entry.findings[0].locators.length);
        assert.ok(existsSync(entry.evidence.file));
        assert.match(entry.evidence.reviewHash,/^[a-f0-9]{64}$/);
        assert.match(entry.state,/not freshly reread/);
        assert.match(entry.coverage,/contributes no batch rows/);
        assert.match(entry.limits.join(' '),/did not reread/i);
        assert.doesNotMatch(entry.coverage+' '+entry.limits.join(' '),/unavailable on this host|No mounted/);
        assert.ok(entry.proposals[0].status);
        assert.match(entry.gameStatus,/not.*fresh|no fresh|does not rerun/);
        assert.equal(trackedReadingHref(entry),'#world/'+world+'/reading/tracked%3A'+entry.id);
        assert.ok(!('shards' in entry)&&!('rows' in entry)&&!('batch' in entry));
    }
    assert.equal(new Set(TRACKED_READINGS.map(e=>e.world+':'+e.id)).size,TRACKED_READINGS.length);
    assert.ok(trackedReadings('lotm').some(e=>e.id==='RA21'));
    assert.match(trackedReadings('hp')[0].findings[0].locators[0],/PDF-p137/);
    assert.equal(trackedReadings('ri')[0].evidence.sourceHash,undefined);
});

test('evidence routes serve only named tracked owners and available native receipts',()=>{
    const server=readFileSync('prototypes/world-atlas/serve.mjs','utf8');
    for(const world of ['hp','ri','mol']){
        const entry=trackedReadings(world)[0];
        assert.ok(server.includes("'"+entry.evidence.href+"'"));
        if(entry.implementationHref)assert.ok(server.includes("'"+entry.implementationHref+"'"));
    }
});
