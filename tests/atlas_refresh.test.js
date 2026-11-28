import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,renameSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {validateManifest,selectChanges,adopt} from '../scripts/atlas_refresh.mjs';

const dir='docs/research/novels/sample/private/lead-run-test';
const hash='a'.repeat(64);
const row={path:dir+'/samplec010_rules.jsonl',size:12,hash};

test('refresh selects changed reader bytes and rejects unowned transfers',()=>{
    assert.deepEqual(selectChanges(validateManifest([row],new Set([dir])),()=>hash),[]);
    assert.deepEqual(selectChanges([row],()=>null),[row]);
    for(const path of [dir+'/chapter.txt',dir+'/../source/samplec010_rules.jsonl',dir+'/index_010.json',dir+'/batch/samplec010_rules.jsonl']){
        assert.throws(()=>validateManifest([{...row,path}],new Set([dir])),/Invalid private reader manifest/);
    }
    assert.throws(()=>validateManifest([row,row],new Set([dir])),/Invalid private reader manifest/);
});

test('failed adoption restores the live directory and leaves the candidate available',()=>{
    mkdirSync('.local/atlas-refresh',{recursive:true});
    const home=mkdtempSync('.local/atlas-refresh/test-');
    const live=join(home,'live'),candidate=join(home,'stage'),previous=join(home,'previous');
    mkdirSync(live);mkdirSync(candidate);
    assert.throws(()=>adopt(candidate,live,previous,(from,to)=>{
        if(from===candidate)throw Error('simulated move failure');
        renameSync(from,to);
    }),/simulated/);
    assert.ok(existsSync(live)&&existsSync(candidate)&&!existsSync(previous));
    adopt(candidate,live,previous);
    assert.ok(existsSync(live)&&existsSync(previous)&&!existsSync(candidate));
});
