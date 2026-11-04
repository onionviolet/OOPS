import test from 'node:test';
import assert from 'node:assert/strict';
import {degreeOf, expose, advance, isTerminal, exposuresFor, DAY, WEEK} from '../src/affliction_track.js';
import {corrode, critOptions, corrosionDamage} from '../src/material_corrosion.js';
import {TETANUS, FESTERING_WOUND, RESISTANT_FESTERING_WOUND, AFFLICTIONS, RUSTING} from '../src/affliction_catalogue.js';

const fixed = (...rolls) => () => rolls.shift();

test('degree of success follows d20 bands and natural 1/20 steps', () => {
    assert.equal(degreeOf(24, 14), 3);
    assert.equal(degreeOf(14, 14), 2);
    assert.equal(degreeOf(5, 14), 1);
    assert.equal(degreeOf(4, 14), 0);
    assert.equal(degreeOf(14, 14, 1), 1);
    assert.equal(degreeOf(5, 14, 20), 2);
});

test('tetanus reproduces its calibration: onset 10 days, stages a week then a day, death is terminal', () => {
    assert.equal(expose(TETANUS, {at: 0, total: 14}).track, null, 'a passed exposure save leaves no track');
    const {track} = expose(TETANUS, {at: 0, total: 10});
    assert.equal(track.stage, 0); assert.equal(track.nextAt, 10 * DAY);
    let r = advance(TETANUS, track, {at: 10 * DAY, draw: fixed()});
    assert.equal(r.track.stage, 1); assert.equal(r.events[0].type, 'onset');
    assert.equal(r.track.nextAt, 10 * DAY + WEEK);
    r = advance(TETANUS, r.track, {at: 10 * DAY + WEEK + 2 * DAY - 1, draw: fixed({total: 8}, {total: 8})});
    assert.equal(r.track.stage, 3);
    r = advance(TETANUS, r.track, {at: 30 * DAY, draw: fixed({total: 2, natural: 1})});
    assert.ok(isTerminal(TETANUS, r.track)); assert.equal(r.events.at(-1).type, 'terminal');
    assert.equal(advance(TETANUS, r.track, {at: 99 * DAY, draw: () => assert.fail('no save past terminal')}).track.stage, 4);
});

test('critical failure starts at stage 2; successes step down to recovery', () => {
    const {track} = expose(FESTERING_WOUND, {at: 0, total: 1});
    assert.equal(track.pendingStage, 2);
    let r = advance(FESTERING_WOUND, track, {at: DAY, draw: fixed()});
    r = advance(FESTERING_WOUND, r.track, {at: 3 * DAY, draw: fixed({total: 13})});
    assert.equal(r.track.stage, 1);
    r = advance(FESTERING_WOUND, r.track, {at: 5 * DAY, draw: fixed({total: 30})});
    assert.equal(r.track, null); assert.equal(r.events.at(-1).type, 'recovered');
});

test('resistant strain ignores common antiseptic and needs two successes per step', () => {
    let {track} = expose(RESISTANT_FESTERING_WOUND, {at: 0, total: 8});
    let r = advance(RESISTANT_FESTERING_WOUND, track, {at: DAY, draw: fixed()});
    r = advance(RESISTANT_FESTERING_WOUND, r.track, {at: 3 * DAY, draw: fixed({total: 10}), treatment: {kind: 'common_antiseptic', bonus: 5}});
    assert.equal(r.events[0].resisted, 'common_antiseptic');
    assert.equal(r.track.stage, 2, 'the bonus did not apply, so 10 failed DC 15');
    r = advance(RESISTANT_FESTERING_WOUND, r.track, {at: 5 * DAY, draw: fixed({total: 15}), treatment: {kind: 'strong_remedy', bonus: 0}});
    assert.equal(r.track.stage, 2, 'one success banks credit only');
    r = advance(RESISTANT_FESTERING_WOUND, r.track, {at: 7 * DAY, draw: fixed({total: 15})});
    assert.equal(r.track.stage, 1);
});

test('contamination follows wound and carrier, not weapon labels', () => {
    const rustyNail = {carries: ['soil', 'filth']};
    assert.deepEqual(exposuresFor({kind: 'puncture', depth: 2}, rustyNail, AFFLICTIONS).map(d => d.id), ['tetanus', 'festering_wound']);
    assert.deepEqual(exposuresFor({kind: 'graze', depth: 1}, rustyNail, AFFLICTIONS).map(d => d.id), ['festering_wound']);
    assert.deepEqual(exposuresFor({kind: 'puncture', depth: 2}, {carries: []}, AFFLICTIONS), [], 'a clean rusty-looking blade carries nothing');
    assert.deepEqual(exposuresFor({kind: 'puncture', depth: 1}, {carries: ['resistant strain']}, AFFLICTIONS).map(d => d.id), ['resistant_festering_wound']);
});

test('rusting trades crit damage for corrosion of iron gear or iron creatures only', () => {
    const target = {material: 'flesh', gear: [{id: 'mail', kind: 'armor', material: 'steel', protection: 5, maxProtection: 5, condition: 100},
        {id: 'mithral', kind: 'armor', material: 'mithral', protection: 4}, {id: 'charm', kind: 'armor', material: 'iron', magic: true, protection: 2}]};
    const opts = critOptions(RUSTING, {normalDamage: 6, critDamage: 12, target});
    assert.deepEqual(opts.map(o => o.id), ['damage', 'gear:mail']);
    assert.equal(opts[1].damage, 6);
    const r = corrode('rust', target.gear[0], {amount: 3});
    assert.equal(r.item.protection, 2); assert.equal(r.item.condition, 40); assert.equal(target.gear[0].protection, 5);
    assert.equal(corrode('rust', target.gear[0], {amount: 9}).destroyed, true);
    assert.equal(corrode('rust', {kind: 'weapon', material: 'iron', condition: 80}, {amount: 1}).item.condition, 0);
    assert.equal(corrode('rust', target.gear[2], {amount: 6}).reason, 'magic');
    assert.deepEqual(critOptions(RUSTING, {normalDamage: 6, critDamage: 12, target: {material: 'iron'}}).map(o => o.id), ['damage', 'creature']);
    assert.deepEqual(critOptions(RUSTING, {normalDamage: 6, critDamage: 12, target: {unattended: true, gear: target.gear}}).map(o => o.id), ['damage']);
    assert.equal(corrosionDamage({dice: 10, level: 20}), 25);
});
