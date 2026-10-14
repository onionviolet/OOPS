import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreams,streamSeed,scopedStream,STREAMS} from '../src/seeded_streams.js';
import {createMixtureState} from '../src/mixture_state.js';
import {createGeneratedPeople} from '../src/generated_people.js';

test('one-time generator seeds come from the saved stream root without consuming draws', () => {
    const state={rng:43,streams:createStreams(43)},before=JSON.stringify(state);
    const mix=streamSeed(state,STREAMS.craft,'village.mixtures@1'),people=streamSeed(state,scopedStream('world.people'),'village.generated_people@1');
    assert.equal(JSON.stringify(state),before,'pure: no cell or receipt written');
    assert.equal(streamSeed(state,STREAMS.craft,'village.mixtures@1'),mix);
    assert.notEqual(mix,people);
    const other={rng:44,streams:createStreams(44)};
    assert.notEqual(streamSeed(other,STREAMS.craft,'village.mixtures@1'),mix);
    assert.ok(Number.isSafeInteger(mix)&&mix>=0&&mix<=0xffffffff);
    assert.deepEqual(createMixtureState(mix),createMixtureState(mix));
    assert.deepEqual(createGeneratedPeople(people,0),createGeneratedPeople(people,0));
});
