import test from 'node:test';
import assert from 'node:assert/strict';
import {routeTable} from '../src/layout_spec.js';
import {PERSPECTIVE_CONTROLS} from '../src/perspective_controls.js';
import {PROFILE_IDS} from '../src/book_world_lotm_lives.js';
import {BE_PROFILE_ID,controlForRoute,registerCapability,seatAllows,seatOf} from '../src/seat_profiles.js';

const beside = {lotm:{entryProfile:'lotm.early_tingen.sample_profile@1'}};
const be = {lotm:{entryProfile:BE_PROFILE_ID}};

test('seat profiles derive from existing entry identity and do not add save fields', () => {
    assert.equal(seatOf(beside),'beside');
    assert.equal(seatOf(be),'be');
    assert.equal(seatOf({}), 'ordinary');
    const roundTrip=JSON.parse(JSON.stringify(beside));
    assert.deepEqual(roundTrip,beside);
    assert.equal(Object.hasOwn(roundTrip,'seat'),false);
});

test('registered seat-only capabilities distinguish beside and lead seats', () => {
    registerCapability({id:'test.synthetic.seat-only',audience:'seat-only',panel:'test-panel'});
    assert.equal(seatAllows(beside,{capability:'test.synthetic.seat-only'}),false);
    assert.equal(seatAllows(be,{capability:'test.synthetic.seat-only'}),true);
});

test('lead controls keep only in-world and Menu system controls', () => {
    const menuControls=PERSPECTIVE_CONTROLS.filter(row=>row.kind==='menu');
    for(const row of PERSPECTIVE_CONTROLS.filter(row=>['crossing','other-seat'].includes(row.tag))) {
        assert.equal(seatAllows(be,{control:row.id}),false,row.id);
    }
    for(const row of PERSPECTIVE_CONTROLS.filter(row=>row.tag==='in-world')) {
        assert.equal(seatAllows(be,{control:row.id}),true,row.id);
    }
    for(const row of PERSPECTIVE_CONTROLS.filter(row=>row.tag==='system')) {
        assert.equal(seatAllows(be,{control:row.id}),menuControls.includes(row),row.id);
    }
});

test('ordinary and original book entry profiles preserve all existing routes', () => {
    const routeIds=routeTable().map(route=>route.id);
    assert.equal(routeIds.length,20);
    assert.equal(PROFILE_IDS.length,6);
    // The be seat filters crossing and other-seat routes by design; every other profile keeps them all.
    const states=[{}, ...PROFILE_IDS.filter(id=>id!==BE_PROFILE_ID).map(entryProfile=>({lotm:{entryProfile}}))];
    for(const state of states) for(const routeId of routeIds) {
        const controlId=controlForRoute(routeId);
        assert.ok(controlId,`route ${routeId} has a perspective control`);
        assert.equal(seatAllows(state,{control:controlId}),true,`${seatOf(state)} allows ${routeId}`);
    }
});

test('unknown ids remain visible and warn once', () => {
    const messages=[],prior=console.warn;
    console.warn=(message)=>messages.push(message);
    try {
        assert.equal(seatAllows(be,{control:'unknown-control'}),true);
        assert.equal(seatAllows(be,{control:'unknown-control'}),true);
        assert.equal(seatAllows(beside,{capability:'unknown-capability'}),true);
    } finally { console.warn=prior; }
    assert.equal(messages.length,2);
});
