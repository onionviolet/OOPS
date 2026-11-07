import test from 'node:test';
import assert from 'node:assert/strict';
import {socialContest, scaleByMargin, rowNotch, SOCIAL_DIALS} from '../src/social_contest.js';
import {channelsOf} from '../src/channels.js';
import {abilityRows} from '../src/book_world_lotm_abilities.js';

const state = {streams: {root: 123456789}, period: 4};
const hag = level => ({id: 'p', rows: [{skill_id: 'Haggling', level}]});
const vendor = {id: 'v', name: 'The vendor', disposition: 0};
const rate = (mk, n = 400) => { let w = 0; for (let i = 0; i < n; i++) w += socialContest({streams: {root: 1000 + i}, period: i}, mk(i)).won ? 1 : 0; return w / n; };

test('same seed, same inputs: same result; a new attempt or period is a new draw', () => {
    const q = {actor: hag(5), target: vendor, channel: 'sway', stakes: 1};
    assert.deepEqual(socialContest(state, q), socialContest(state, q));
    const seen = new Set(Array.from({length: 12}, (_, i) => socialContest(state, {...q, attempt: i}).margin));
    assert.ok(seen.size > 6);
    assert.throws(() => socialContest({}, q), /root/);
});

test('skill rows raise the chance; warmth raises it; stakes lower it; margin is bounded', () => {
    const base = socialContest(state, {actor: hag(0), target: vendor, channel: 'sway'}).chance;
    const skilled = socialContest(state, {actor: hag(25), target: vendor, channel: 'sway'}).chance;
    assert.ok(skilled > base + 0.5);
    assert.ok(socialContest(state, {actor: hag(5), target: {...vendor, disposition: 2}, channel: 'sway'}).chance > socialContest(state, {actor: hag(5), target: vendor, channel: 'sway'}).chance);
    assert.ok(socialContest(state, {actor: hag(5), target: vendor, channel: 'sway', stakes: 3}).chance < socialContest(state, {actor: hag(5), target: vendor, channel: 'sway'}).chance);
    assert.ok(rate(i => ({actor: hag(25), target: vendor, channel: 'sway'})) > rate(i => ({actor: hag(0), target: vendor, channel: 'sway'})) + 0.4);
    for (let i = 0; i < 50; i++) { const r = socialContest({streams: {root: i + 1}}, {actor: hag(10), target: vendor, channel: 'sway'}); assert.ok(r.margin >= -1 && r.margin <= 1); assert.equal(r.won, r.margin > 0); }
    assert.equal(socialContest(state, {actor: hag(25), target: {...vendor, disposition: 99}, channel: 'sway', stakes: 99}).stakes, SOCIAL_DIALS.stakesCap.value);
});

test('price effect is bounded: zero on a loss, 2% to 8% on a win', () => {
    assert.equal(scaleByMargin({won: false, margin: -0.5}, 0.02, 0.08), 0);
    assert.equal(scaleByMargin({won: true, margin: 0.0001}, 0.02, 0.08), 0.02);
    assert.equal(scaleByMargin({won: true, margin: 1}, 0.02, 0.08), 0.08);
    assert.equal(scaleByMargin({won: true, margin: 7}, 0.02, 0.08), 0.08);
});

test('a deceive success leaves the target unaware unless it reads people', () => {
    const liar = {id: 'p', rows: [{key: 'x.ab.face_hold.row'}, {skill_id: 'Haggling', level: 25}]};
    let landed = 0, exposedPlain = 0, exposedReader = 0, readerWins = 0;
    for (let i = 0; i < 300; i++) {
        const s = {streams: {root: 5000 + i}};
        const plain = socialContest(s, {actor: liar, target: vendor, channel: 'deceive'});
        if (plain.won) landed++;
        if (plain.exposed) exposedPlain++;
        assert.ok(!/lie|false|decei/i.test(plain.observerText), plain.observerText);
        assert.ok(!/lie/i.test(plain.text) || plain.exposed);
        const reader = socialContest(s, {actor: liar, target: {...vendor, rows: [{key: 'y.ab.seer_read', channels: ['read_people'], notch: 6}]}, channel: 'deceive'});
        assert.ok(!/lie|decei/i.test(reader.observerText));
        if (reader.exposed) { exposedReader++; assert.equal(reader.won, false); assert.ok(reader.margin < 0); }
        if (reader.won) readerWins++;
    }
    assert.ok(landed > 150); assert.equal(exposedPlain, 0); assert.ok(exposedReader > 100); assert.ok(readerWins < landed);
});

test('read people runs against the target conceal rows; a win shows mood and tell only to the actor', () => {
    const reader = {id: 'p', rows: [{key: 'a.ab.x', channels: ['read_people'], notch: 3}]};
    const open = socialContest(state, {actor: reader, target: {...vendor, disposition: 1, tell: 'short of coin'}, channel: 'read_people'});
    const guarded = socialContest(state, {actor: reader, target: {...vendor, rows: [{key: 'z.ab.face_hold', channels: ['conceal'], notch: 5}]}, channel: 'read_people'});
    assert.ok(open.chance > guarded.chance);
    const won = Array.from({length: 40}, (_, i) => socialContest({streams: {root: 90 + i}}, {actor: reader, target: {...vendor, disposition: 1, tell: 'short of coin'}, channel: 'read_people'})).find(r => r.won);
    assert.equal(won.learned.tell, 'short of coin'); assert.match(won.learned.mood, /warm/);
    assert.ok(!/short of coin/.test(won.observerText));
});

test('second world (AD51): LOTM ability rows work as rows, with no edit to LOTM', () => {
    const face = Object.values(abilityRows).flat().find(a => a.key === 'face_hold');
    assert.deepEqual(channelsOf(face), ['conceal']);
    assert.equal(rowNotch([face], ['conceal']), SOCIAL_DIALS.abilityNotch.value);
    const seer = {id: 'seer', name: 'The seer', rows: [face]};
    const asLiar = socialContest(state, {actor: seer, target: vendor, channel: 'deceive'}), noFace = socialContest(state, {actor: {id: 'plain', rows: []}, target: vendor, channel: 'deceive'});
    assert.ok(asLiar.chance > noFace.chance);
    const guard = socialContest(state, {actor: {id: 'p', rows: [{key: 'q', channels: ['read_people'], notch: 1}]}, target: seer, channel: 'read_people'});
    assert.equal(guard.resistNotch, SOCIAL_DIALS.abilityNotch.value);
    // an actor given by id comes from state.actors
    const byId = socialContest({...state, actors: {seer: {rows: [face]}}}, {actor: 'seer', target: vendor, channel: 'deceive'});
    assert.equal(byId.chance, asLiar.chance);
});

test('inputs are not mutated and an unknown channel is refused', () => {
    const s = structuredClone(state), a = hag(7), t = {...vendor}, snap = JSON.stringify([s, a, t]);
    socialContest(s, {actor: a, target: t, channel: 'deceive'});
    assert.equal(JSON.stringify([s, a, t]), snap);
    assert.throws(() => socialContest(s, {actor: a, target: t, channel: 'charm'}), /channel/);
});
