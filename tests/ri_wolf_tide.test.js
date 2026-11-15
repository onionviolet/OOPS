import test from 'node:test';
import assert from 'node:assert/strict';
import {RI_WOLF_TIDE_DIALS as D, RI_WOLF_TIDE_FACT, RI_WOLF_SPECIES, riWolfTideView, riRecordWolfKill, riEncounterWeights, riWolfFoe, riWolfTideLine} from '../src/ri_wolf_tide.js';
import {RI_PATROL_ENCOUNTERS} from '../src/ri_lead_day_facts.js';
import {drawFraction} from '../src/gen_kit.js';

const life = (clock, fact) => ({clock, simulation: {seed: 4242}, actors: {player: {facts: fact ? {[RI_WOLF_TIDE_FACT]: fact} : {}}}});
const DAY = 1440;

test('every dial carries its reason', () => {
    for(const [name, dial] of Object.entries(D)) assert.ok(dial.why?.length > 10, name);
});

test('a full wall gives the patrol its static weights', () => {
    // Find a day on which the large wolves are about, so the full wall is the static table.
    let clock = 0;
    while(!riWolfTideView(life(clock)).rows.find(r => r.id === RI_WOLF_SPECIES.large).present) clock += DAY;
    const w = riEncounterWeights(life(clock));
    for(const row of RI_PATROL_ENCOUNTERS) assert.equal(w[row.id], row.weight, row.id);
});

test('kills thin the wall, move the weights, and the wolves refill over days', () => {
    let clock = 0;
    while(!riWolfTideView(life(clock)).rows.find(r => r.id === RI_WOLF_SPECIES.large).present) clock += DAY;
    let fact;
    for(let i = 0; i < 12; i++) fact = riRecordWolfKill(life(clock, fact), {at: clock});
    const thinned = riEncounterWeights(life(clock, fact)), full = riEncounterWeights(life(clock));
    assert.ok(thinned.small_pack < full.small_pack);
    assert.ok(thinned.quiet > full.quiet);
    assert.equal(thinned.wild_gu, full.wild_gu);
    assert.equal(riWolfTideView(life(clock, fact)).rows.find(r => r.id === RI_WOLF_SPECIES.ordinary).left, D.ordinary.cap - 12);
    const later = clock + 2 * DAY;
    assert.equal(riWolfTideView(life(later, fact)).rows.find(r => r.id === RI_WOLF_SPECIES.ordinary).left, D.ordinary.cap - 12 + 2 * D.ordinary.refillPerDay);
    assert.equal(riWolfTideView(life(later + 10 * DAY, fact)).rows.find(r => r.id === RI_WOLF_SPECIES.ordinary).left, D.ordinary.cap);
    assert.match(riWolfTideLine(life(clock, fact)), /Lightning wolves/);
});

test('the fight foe uses the combat lane draw and its dials, and no big wolf once they are hunted out', () => {
    for(let hour = 0; hour < 48; hour++) {
        const state = life(hour * 60 + 30);
        const foe = riWolfFoe(state);
        assert.equal(foe.large, drawFraction(4242, `ri.wolf.tide:size:${hour}`) < .2);
        assert.deepEqual([foe.hp, foe.attack], foe.large ? [44, 7] : [30, 5]);
        assert.ok(foe.why.length > 10);
        assert.deepEqual(foe, riWolfFoe(state), 'same hour, same wolf');
    }
    let hour = 0;
    while(!riWolfFoe(life(hour * 60)).large) hour++;
    const at = hour * 60;
    let fact;
    for(let i = 0; i < D.large.cap; i++) fact = riRecordWolfKill(life(at, fact), {large: true, at});
    const foe = riWolfFoe(life(at, fact));
    assert.equal(foe.large, false);
    assert.equal(foe.hp, 30);
    assert.match(foe.why, /hunted out/);
    assert.equal(riRecordWolfKill(life(at, fact), {large: true, at}), fact, 'a kill past the counted pool changes nothing');
});

test('a dead wolf yields its parts by size, and only the eye is proof for the board', async () => {
    const {riWolfParts, RI_WOLF_PARTS} = await import('../src/ri_wolf_tide.js');
    assert.deepEqual(riWolfParts({large: false}), {eye: 1, pelt: 1, meat: 6});
    assert.deepEqual(riWolfParts({large: true}), {eye: 1, pelt: 1, meat: 9});
    assert.deepEqual(Object.keys(RI_WOLF_PARTS).filter(k => RI_WOLF_PARTS[k].proof), ['eye']);
});
