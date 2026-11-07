import test from 'node:test';
import assert from 'node:assert/strict';
import {CHANNELS, CHANNEL_IDS, channelsOf, channelNote, channelCoverage} from '../src/channels.js';
import {SKILL_CHANNELS, LOTM_ABILITY_CHANNELS} from '../src/channel_map.js';
import {abilityFunctions} from '../src/structured_ability_runtime.js';
import {abilityRows, abilityCommands, hostileAbilityCommands, LOTM_HOSTILES, lotmReveal} from '../src/book_world_lotm_abilities.js';

test('every channel projects onto an existing function and effect type, or says it has no owner', () => {
    assert.equal(new Set(CHANNEL_IDS).size, CHANNEL_IDS.length);
    for (const c of CHANNELS) {
        assert.ok(c.label && c.plain && c.seam, c.id);
        if (c.status === 'unbuilt') {assert.equal(c.projects.length, 0, `${c.id} claims no seam yet`); continue;}
        assert.ok(c.projects.length, c.id);
        for (const p of c.projects) for (const e of p.effects) assert.ok(abilityFunctions[p.fn]?.has(e), `${c.id}: ${p.fn}/${e}`);
    }
});

test('mapping tables only name real channels and real rows', () => {
    for (const ids of [...Object.values(SKILL_CHANNELS), ...Object.values(LOTM_ABILITY_CHANNELS)]) for (const id of ids) assert.ok(CHANNEL_IDS.includes(id), id);
    const keys = new Set(Object.values(abilityRows).flat().map(a => `ability:${a.key}`));
    for (const k of Object.keys(LOTM_ABILITY_CHANNELS)) assert.ok(keys.has(k), k);
    for (const k of Object.keys(SKILL_CHANNELS)) assert.ok(k.startsWith('skill:'));
});

test('every LOTM ability row has a channel whose projection covers its function and effect types', () => {
    for (const [pk, rows] of Object.entries(abilityRows)) for (const a of rows) {
        const ids = channelsOf(a);
        assert.ok(ids.length, `${pk}.${a.key} has a channel`);
        const ok = ids.some(id => CHANNELS.find(c => c.id === id).projects.some(p => p.fn === a.fn && a.effects.every(e => p.effects.includes(e.type) || e.type === 'knowledge' && p.fn === 'perception')));
        assert.ok(ok, `${pk}.${a.key} (${a.fn}) fits its channel`);
    }
});

test('skills and ability ids resolve through the same lookup; unknown rows have no channel', () => {
    assert.deepEqual(channelsOf({skill_id: 'Perception'}), ['perceive']);
    assert.deepEqual(channelsOf({skill_id: 'Haggling'}), ['sway']);
    assert.deepEqual(channelsOf({skill_id: 'Literacy'}), ['read_text']);
    assert.deepEqual(channelsOf({skill_id: 'Medicine'}), ['heal']);
    assert.deepEqual(channelsOf({id: 'book.lotm.ab.spirit_sight'}), ['perceive']);
    assert.deepEqual(channelsOf({id: 'book.lotm.ab.spirit_sight.row'}), ['perceive']);
    assert.deepEqual(channelsOf({skill_id: 'Combat'}), []);
    assert.deepEqual(channelsOf({channel: 'nonsense'}), []);
    assert.deepEqual(channelsOf({key: 'x', channels: ['sway']}), ['sway']);
    const cov = channelCoverage([{skill_id: 'Perception'}, {key: 'spirit_sight'}]);
    assert.equal(cov.perceive, 2); assert.equal(cov.sway, 0);
});

test('the skill tooltip note names the channel in plain words; a non-holder and an unmapped skill get nothing (ABR19)', () => {
    assert.match(channelNote({skill_id: 'Perception'}, {holder: true}), /^Kind of power: Perceive the hidden\. It lets you notice/);
    assert.equal(channelNote({skill_id: 'Perception'}), '');
    assert.equal(channelNote({skill_id: 'Perception'}, {holder: false}), '');
    assert.equal(channelNote({skill_id: 'Combat'}, {holder: true}), '');
    const row = Object.values(abilityRows).flat().find(a => a.key === 'face_hold');
    assert.match(channelNote(row, {holder: true}), /Conceal/);
    for (const c of [...abilityCommands, ...hostileAbilityCommands]) assert.doesNotMatch(c.description, /Kind of power/, 'command text is unchanged');
});

test('failure scenario: an observer who sees a concealed look learns the look only, never the channel', () => {
    const look = {id: 'book.lotm.pallor', look: {concealed: true, seenBy: ['beyonder'], text: 'pale'}};
    const registry = {sources: new Map(), simulation: {conditions: new Map([[look.id, look]])}};
    const state = {actors: {player: {sources: {}}}, simulation: {conditions: {player: {[look.id]: {intensity: 1}}}}};
    const seen = lotmReveal(LOTM_HOSTILES[0].id, registry, state);
    assert.deepEqual(seen, [look.id]);
    assert.doesNotMatch(JSON.stringify(seen), /Kind of power|perceive|impose_condition/);
});

test('the skill tooltip builder calls the note for the skill itself and the dist is not needed for the unit text', async () => {
    const {readFileSync} = await import('node:fs');
    const src = readFileSync(new URL('../src/display.js', import.meta.url), 'utf8');
    assert.match(src, /channelNote\(skill, \{holder: true\}\)/);
});
