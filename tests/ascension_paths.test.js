import test from 'node:test';
import assert from 'node:assert/strict';
import {definePath, pathView} from '../src/ascension_paths.js';
import {mistglassPathView} from '../src/ascension_paths_mistglass.js';
import {cultivationView} from '../src/absorb_p23/world_adaptation/techniques.js';

const ladder = () => ({id:'t.path', world:'t', label:'Test', shape:'ladder', stages:[
    {id:'a', label:'A', crossings:[], grants:['entry']},
    {id:'b', label:'B', crossings:[{id:'q', type:'quota', label:'Quota', fact:'pool', need:10}, {id:'s', type:'structure', label:'Order kept', fact:'ordered', need:true}], grants:['sense']},
    {id:'c', label:'C', crossings:[{id:'i', type:'ingest', label:'Potion taken', fact:'drank', need:true, irreversible:true}], grants:['power'], failure:{signs:'Whispers', outcome:'Loss of control'}},
]});

test('a crossing is ready only when every typed requirement is met', () => {
    const p = definePath(ladder());
    assert.equal(pathView(p, 0, {pool:9, ordered:true}).ready, false);
    assert.equal(pathView(p, 0, {pool:10, ordered:false}).ready, false);
    const v = pathView(p, 0, {pool:10, ordered:true});
    assert.equal(v.ready, true);
    assert.deepEqual(v.crossings.map(c => [c.id, c.have, c.met]), [['q',10,true],['s',true,true]]);
});

test('unknown stages stay ??? and an owner ceiling blocks a ready crossing', () => {
    const p = definePath(ladder());
    const v = pathView(p, 1, {drank:true}, {known:1});
    assert.equal(v.stage, 'B');
    assert.equal(v.next, '???');
    assert.deepEqual(v.ladder.map(s => s.label), ['A','B','???']);
    assert.equal(v.crossings[0].irreversible, true);
    assert.deepEqual(v.failure, {signs:'Whispers', outcome:'Loss of control'});
    const capped = pathView(p, 1, {drank:true}, {ceiling:1});
    assert.equal(capped.capped, true);
    assert.equal(capped.ready, false);
    assert.equal(pathView(p, 2).next, null);
});

test('descriptors are validated and frozen', () => {
    assert.throws(() => definePath({...ladder(), shape:'spiral'}), /Invalid ascension path/);
    const noCross = ladder(); noCross.stages[1].crossings = [];
    assert.throws(() => definePath(noCross), /needs crossings/);
    const badType = ladder(); badType.stages[1].crossings[0].type = 'luck';
    assert.throws(() => definePath(badType), /Invalid crossing/);
    const p = definePath(ladder());
    assert.ok(Object.isFrozen(p.stages[1].crossings[0]));
    assert.throws(() => pathView(p, 3), /Invalid position/);
});

test('Mistglass tracks agree with the P12 method view at every practice minute', () => {
    assert.equal(mistglassPathView(undefined), null);
    for(const selected of ['breath','settling']) for(let m = 0; m <= 48; m++) {
        const state = {schema:1, selected, minutes:{breath:0, settling:0, [selected]:m}};
        assert.equal(mistglassPathView(state).stage, cultivationView(state).stage);
    }
});
