// Klein's earned save (lotm-kjw37) never became responsive: a Be view priced ~200 offers and each offer's context carried a fresh
// clone of the harm slice, so the facts frame (which matches a context by the identity of each field) rebuilt the whole fact
// dictionary for every offer. A view build now shares one harm copy, save wrapper and journey-places object per build.
// Count ceilings, not wall-clock: fact builds per N offers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withFactsFrame,readFactsFrame} from '../src/facts_frame.js';

test('offers whose contexts share their field identities build facts once; a fresh clone per offer builds N times', () => {
    const state = {clock: 5, sequence: 1}, registry = {}, gameplay = {player: {inventory: {}}}, harm = {schema: 1}, native = {bound: true};
    const OFFERS = 40;
    let builds = 0;
    const read = context => readFactsFrame(state, context, registry, () => ({n: ++builds}));
    const context = (_i, parts) => ({actorId: 'player', targetId: null, gameplay, busy: false, facts: {location: 'Hall', 'topicTalk.hour': 9},
        harm: parts.harm, harmSave: parts.harmSave, harmActionClass: 'talk', structuredNative: parts.native});
    // The shape the host builds now: one shared copy per view.
    const shared = {harm, harmSave: {expansion: state, harm}, native};
    withFactsFrame(state, () => {for(let i = 0; i < OFFERS; i++) read(context(i, shared));});
    assert.equal(builds, 1, 'shared identities reuse one build');
    // The shape the host had: a clone per offer.
    builds = 0;
    withFactsFrame(state, () => {for(let i = 0; i < OFFERS; i++) read(context(i, {harm: structuredClone(harm), harmSave: {expansion: state, harm: structuredClone(harm)}, native: {...native}}));});
    assert.equal(builds, OFFERS, 'the frame still matches by identity, so a clone per offer cannot be reused');
});

test('the Be view builds every offer context through the shared per-build parts', () => {
    const source = readFileSync(new URL('../src/book_world_lotm_host.js', import.meta.url), 'utf8');
    const body = source.slice(source.indexOf(' function readView('), source.indexOf('const actions=[],actingGuidance=[];'));
    assert.ok(body.length > 500, 'found the Be branch of readView');
    assert.doesNotMatch(body, /harmState\(\)|harmContext\(/, 'no per-offer clone of the harm slice inside the view build');
    const calls = body.match(/\bctx\(s,[^)]*\)/g) || [];
    assert.ok(calls.length >= 6);
    for(const call of calls) assert.match(call, /shared\)$/, `${call} must pass the shared parts`);
    assert.match(body, /withFactsFrame\(s,\(\)=>castTopicOffers\(/, 'topic talks are priced inside the view frame like their neighbours');
});
