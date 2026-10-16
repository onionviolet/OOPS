import test from 'node:test';
import assert from 'node:assert/strict';
import {fighterReadout} from '../src/combat_readout.js';
import {projectOpponents} from '../src/combat_opponents_domain.js';
const deps = {skills: {}, tagSkills: {}, hitChance: (ap, ep) => ap / (ap + ep)};
function fighter({name, stats = {}, tags = {}, shield = false, alive = true, secret = {}}) {
    const full = {attack_power: 4.4, attack_count: 1, attack_speed: 0.82, attack_points: 30, evasion_points: 10, defense: 1, health: 13.2, max_health: 20, ...stats};
    return {name, tags, is_alive: alive, ...secret, getFullStats: () => full, getEquipment: () => shield ? {'off-hand': {offhand_type: 'shield'}} : {},
        hasShield: () => shield, getBlockStrength: () => shield ? 6.6 : 0};
}
const hero = (extra = {}) => fighter({name: 'Hero', tags: {main_character: true}, stats: {attack_points: 40, evasion_points: 20, health: 50, max_health: 60}, ...extra});
const secret = {id: 'sealed_template_x', xp_value: 77, loot_list: [{item_name: 'Hidden relic'}], level: 9, truth: 'SEALED-TRUTH'};
const readout = (c, at) => fighterReadout(c, at, deps);
const ids = o => o.facts.map(f => f.id);
test('solo player: hit/evade percentages, you-hit, health and count', () => {
    const p = projectOpponents({attackers: [hero()], defenders: [fighter({name: 'Starving wolf rat', secret})]}, readout);
    assert.equal(p.active, true); assert.equal(p.disclosure, 'native-legacy'); assert.equal(p.count, 1); assert.equal(p.alive, 1);
    const [o] = p.opponents;
    assert.deepEqual([o.slot, o.name, o.defeated], ['opponent-1', 'Starving wolf rat', false]);
    assert.deepEqual(o.health, {current: 14, max: 20, fraction: 0.66});
    assert.deepEqual(ids(o), ['attack', 'speed', 'hits-you', 'evades-you', 'defense', 'you-hit']);
    assert.equal(o.facts[0].value, '4 dmg'); assert.equal(o.facts[1].value, '0.82 /s');
    assert.ok(o.facts.every(f => f.known === true && f.value != null));
});
test('party side switches to ratings; shields give block and a 100% hit; defeated stay listed', () => {
    const p = projectOpponents({attackers: [hero(), fighter({name: 'Ally'})], defenders: [fighter({name: 'A', shield: true}), fighter({name: 'B', alive: false, stats: {health: -3}})]}, readout);
    assert.equal(p.count, 2); assert.equal(p.alive, 1);
    assert.deepEqual(ids(p.opponents[0]), ['attack', 'speed', 'attack-rating', 'block', 'defense']);
    assert.deepEqual(ids(p.opponents[1]), ['attack', 'speed', 'attack-rating', 'evasion-rating', 'defense']);
    assert.equal(p.opponents[1].defeated, true); assert.equal(p.opponents[1].health.fraction, 0);
    const shielded = projectOpponents({attackers: [hero({shield: true})], defenders: [fighter({name: 'C'})]}, readout);
    assert.deepEqual(shielded.opponents[0].facts.find(f => f.id === 'hits-you'), {id: 'hits-you', label: 'Hit you', known: true, value: '100%', number: 100, shield: true});
});
test('inactive or ended combat projects an empty board', () => {
    for(const combat of [null, {is_ended: true, attackers: [hero()], defenders: [fighter({name: 'X'})]}])
        assert.deepEqual(projectOpponents(combat, readout), {schema: 1, active: false, disclosure: 'native-legacy', count: 0, alive: 0, opponents: []});
});
test('no internal ids, tags, levels, loot, XP or sealed fields leak into the projection', () => {
    const text = JSON.stringify(projectOpponents({attackers: [hero()], defenders: [fighter({name: 'Wolf rat', tags: {beast: true, sealed_kind: true}, secret})]}, readout));
    for(const leak of ['sealed_template_x', 'Hidden relic', 'SEALED-TRUTH', 'sealed_kind', 'beast', 'xp_value', 'loot', 'level', 'tags', '"77"', ':77', ':9,']) assert.ok(!text.includes(leak), leak);
    const allowed = new Set(['schema', 'active', 'disclosure', 'count', 'alive', 'opponents', 'slot', 'index', 'name', 'defeated', 'health', 'current', 'max', 'fraction', 'facts', 'id', 'label', 'known', 'value', 'number', 'shield']);
    JSON.parse(text, (key, v) => {if(key && !/^\d+$/.test(key)) assert.ok(allowed.has(key), key); return v;});
});
