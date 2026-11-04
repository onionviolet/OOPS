import test from 'node:test';
import assert from 'node:assert/strict';
import {defineLayer, applyLayer, removeLayer, GHOSTLY, HALF_DRAGON} from '../src/creature_layers.js';

const body = () => ({name: 'Orc', tags: ['humanoid', 'needs_breath'], hp: {bonus: 0, max: 20}, armor: {natural: 1}, resist: {}});
const stripped = c => { const x = structuredClone(c); for (const k of ['base', 'layers', 'layerDefs', 'layerLog']) delete x[k]; return x; };

test('apply then remove returns the base exactly, and never mutates the input', () => {
    const orc = body(), frozen = structuredClone(orc);
    const g = applyLayer(orc, GHOSTLY);
    assert.deepEqual(orc, frozen);
    assert.deepEqual(g.layers, ['ghostly']);
    assert.deepEqual(g.tags, ['humanoid', 'incorporeal']);
    assert.equal(g.hp.bonus, 10);
    const r = removeLayer(g, 'ghostly');
    assert.equal(r.ok, true);
    assert.deepEqual(stripped(r.creature), frozen);
    assert.deepEqual(r.creature.layers, []);
});
test('two layers removed in either order give the same result', () => {
    const both = applyLayer(applyLayer(body(), GHOSTLY), HALF_DRAGON);
    const a = removeLayer(removeLayer(both, 'ghostly').creature, 'half_dragon').creature;
    const c = removeLayer(removeLayer(both, 'half_dragon').creature, 'ghostly').creature;
    const noLog = x => { const y = structuredClone(x); delete y.layerLog; return y; };
    assert.deepEqual(noLog(a), noLog(c)); // the log is history, so it differs by order
    assert.deepEqual(stripped(a), body());
    const onlyDragon = removeLayer(both, 'ghostly').creature;
    assert.equal(onlyDragon.armor.natural, 5);
    assert.deepEqual(onlyDragon.tags, ['humanoid', 'needs_breath', 'dragon_blooded']);
});
test('set op then removal restores, even with a later layer on the same path', () => {
    const big = defineLayer({id: 'big', changes: [{path: 'size', op: 'set', value: 'large'}]});
    const bigger = defineLayer({id: 'bigger', changes: [{path: 'size', op: 'set', value: 'huge'}]});
    const c = applyLayer(applyLayer({size: 'medium'}, big), bigger);
    assert.equal(c.size, 'huge');
    assert.equal(removeLayer(c, 'bigger').creature.size, 'large');
    assert.equal(removeLayer(c, 'big').creature.size, 'huge');
    assert.equal(removeLayer(removeLayer(c, 'big').creature, 'bigger').creature.size, 'medium');
});
test('permanent layers refuse removal with a reason', () => {
    const lich = defineLayer({id: 'lich', label: 'Lich', permanent: true, changes: [{path: 'tags', op: 'tag', value: 'undead'}]});
    const c = applyLayer(body(), lich);
    const r = removeLayer(c, 'lich');
    assert.equal(r.ok, false);
    assert.match(r.reason, /permanent/);
    assert.equal(removeLayer(c, 'nope').ok, false);
});
test('the log lists what changed with before and after', () => {
    const g = applyLayer(body(), GHOSTLY);
    const entry = g.layerLog.at(-1);
    assert.equal(entry.layer, 'ghostly');
    assert.deepEqual(entry.changes.find(x => x.path === 'hp.bonus'), {path: 'hp.bonus', op: 'add', before: 0, after: 10});
    const tagChange = entry.changes.find(x => x.op === 'tag');
    assert.deepEqual([tagChange.before, tagChange.after], [['humanoid', 'needs_breath'], ['humanoid', 'needs_breath', 'incorporeal']]);
    const rem = removeLayer(g, 'ghostly').creature.layerLog.at(-1);
    assert.equal(rem.action, 'remove');
    assert.deepEqual(rem.changes.find(x => x.path === 'hp.bonus'), {path: 'hp.bonus', before: 10, after: 0});
});
test('bad definitions throw and double apply throws', () => {
    assert.throws(() => defineLayer({id: 'x', changes: []}));
    assert.throws(() => defineLayer({id: 'x', changes: [{path: 'a', op: 'mul', value: 2}]}));
    assert.throws(() => applyLayer(applyLayer(body(), GHOSTLY), GHOSTLY));
});

test('PFA9: implants fill a body capacity; one that does not fit is refused with the numbers', async () => {
    const {applyLayer, fitsLayer, defineLayer, REFLEX_WIRE} = await import('../src/creature_layers.js');
    const body = {stats: {initiative: 0}, tags: [], capacity: {implant: 3}};
    const wired = applyLayer(body, REFLEX_WIRE);
    assert.equal(wired.stats.initiative, 2);
    const eye = defineLayer({id: 'night_eye', uses: {implant: 2}, changes: [{path: 'tags', op: 'tag', value: 'darkvision'}]});
    const fit = fitsLayer(wired, eye);
    assert.equal(fit.ok, false); assert.equal(fit.used, 2); assert.equal(fit.max, 3);
    assert.throws(() => applyLayer(wired, eye), /capacity/);
    assert.equal(fitsLayer({stats: {}}, eye).ok, true, 'a body with no stated capacity is not limited');
    assert.throws(() => defineLayer({id: 'bad', uses: {implant: 0}, changes: [{path: 'x', op: 'set', value: 1}]}), /positive/);
});
