import test from 'node:test';
import assert from 'node:assert/strict';
import {begin, commit, settle, validate, view} from '../src/hp_brewing_state.js';
import {potionWorkingWorlds} from '../src/potion_working_rules.js';

const hogwarts = 'book.hp.school.world';
const cyoria = 'book.mol.cyoria';
function room(world) {
    let now = 0;
    let state = begin({seed: 11, now});
    const rules = potionWorkingWorlds[world];
    const context = () => ({world, location: rules.location, now});
    const run = (action, fields) => {
        const result = commit(state, context(), {type:'potionWorking', action, ...fields});
        state = validate(result.state);
        return result.summary;
    };
    const wait = minutes => { now += minutes; settle(state, now); };
    return {
        run, wait, context,
        get state() { return state; },
        get data() { return view(state, context()).potionWorkings; },
        reload() { state = validate(JSON.parse(JSON.stringify(state))); },
        source(material) {
            run('source', {material});
            wait(rules.sources.find(row => row.material === material).minutes);
        },
        brew(materials, operations) {
            run('reset');
            for(const material of materials) run('measure', {material, quantity: 1});
            for(const operation of operations) run('append', {operation, level: 1});
            run('brew');
            wait(operations.reduce((n, op) => n + rules.operationMinutes[op], 0));
            return Object.keys(state.potionWorkings[world].bottles).at(-1);
        },
    };
}

test('Hogwarts: hot egg acquisition, player operation order, use, and observed method', () => {
    const r = room(hogwarts);
    assert.throws(() => commit(r.state, {...r.context(), location:'Village'}, {type:'potionWorking', action:'fire'}), /local potioneering/);
    r.run('fire');
    assert.throws(() => r.run('collect'), /no hot egg/);
    r.wait(25);
    r.run('collect');
    r.reload();
    r.run('freeze');
    assert.throws(() => r.run('freeze'), /hot egg/);
    r.source('rose');
    r.source('water');
    const bottle = r.brew(['frozen_egg', 'rose', 'water'], ['extract', 'steep']);
    assert.ok(!r.data.materials.some(m => m.id === 'frozen_egg'));
    assert.equal(r.data.methods.length, 0);
    r.reload();
    const tampered = structuredClone(r.state);
    tampered.potionWorkings[hogwarts].bottles[bottle].working.steps.reverse();
    assert.throws(() => validate(tampered), /Invalid saved potion bottle/);
    assert.match(r.run('dose', {bottle, route:'oral', subject:'The library'}), /thoughts keep returning/);
    assert.equal(r.data.effects[0].subject, 'The library');
    assert.equal(r.data.effects[0].minutes, 32);
    assert.equal(r.data.methods.length, 1);
    assert.throws(() => r.run('dose', {bottle, route:'oral', subject:'The library'}), /still hold/);

    r.run('fire'); r.wait(25); r.run('collect'); r.run('freeze');
    r.source('rose'); r.source('water');
    const reversed = r.brew(['frozen_egg', 'rose', 'water'], ['steep', 'extract']);
    assert.match(r.run('dose', {bottle:reversed, route:'oral', subject:'The greenhouse'}), /no change/);
    assert.equal(r.data.methods.length, 1);
});

test('Hogwarts: independently sourced mucus and treacle use the same player working', () => {
    const r = room(hogwarts);
    r.source('mucus'); r.source('water');
    const sample = r.brew(['mucus','water'], ['stir']);
    assert.match(r.run('dose', {bottle:sample, route:'assay'}), /moves more slowly/);
    r.source('alihotsy');
    const exposure = r.brew(['alihotsy'], ['steep']);
    r.run('dose', {bottle:exposure, route:'oral'});
    assert.ok(r.data.effects.some(e => e.label === 'Alihotsy hysteria'));
    r.source('treacle');
    const remedy = r.brew(['treacle'], ['stir']);
    assert.match(r.run('dose', {bottle:remedy, route:'oral'}), /symptoms cleared/);
    assert.ok(!r.data.effects.some(e => e.label === 'Alihotsy hysteria'));
});

test('Cyoria: an authored salve result depends on a player-composed process', () => {
    const r = room(cyoria);
    r.source('leaf'); r.source('oil'); r.source('water');
    const failed = r.brew(['leaf','oil','water'], ['steep','extract','stir']);
    r.run('sore-skin');
    assert.match(r.run('dose', {bottle:failed, route:'topical'}), /no change/);
    assert.equal(r.data.methods.length, 0);
    r.source('leaf'); r.source('oil');
    const worked = r.brew(['leaf','oil'], ['extract','stir']);
    assert.match(r.run('dose', {bottle:worked, route:'topical'}), /symptoms cleared/);
    r.reload();
    assert.equal(r.data.effects.length, 0);
    assert.equal(r.data.methods.length, 1);
    r.source('leaf'); r.source('oil');
    r.run('recall', {method:r.data.methods[0].id});
    assert.equal(r.data.materials.filter(m => m.measured === 1).length, 2);
});

test('Cyoria: one paid leaf becomes two independently used portions across reload', () => {
    const r = room(cyoria);
    const purse = r.state.purse;
    r.source('leaf');
    r.run('measure', {material:'leaf', quantity:1});
    assert.throws(() => r.run('separate'), /Grind and press/);
    assert.equal(r.state.purse, purse);
    r.run('append', {operation:'extract', level:1});
    r.run('separate');
    assert.equal(r.state.purse, purse - 1);
    r.reload();
    r.wait(5);
    r.reload();
    const {portion} = r.data.separation;
    assert.deepEqual([portion.liquidMass, portion.solidMass], [600, 400]);
    assert.match(r.run('wipe-press'), /lifted the residue/);
    assert.equal(r.data.separation.residue, 0);
    assert.throws(() => r.run('wipe-press'), /keep a press cake/i);
    r.source('oil');
    const bottle = r.brew(['pressed_extract', 'oil'], ['stir']);
    assert.deepEqual(r.state.potionWorkings[cyoria].bottles[bottle].extraction,
        {id:portion.id, parent:portion.parent, extractMass:600, mesh:'coarse', makeUpWater:400});
    r.run('sore-skin');
    r.reload();
    assert.match(r.run('dose', {bottle, route:'topical'}), /symptoms cleared/);
    assert.ok(r.data.separation.portion.liquidUsed && r.data.separation.portion.solidsUsed);
    assert.equal(r.data.effects.length, 0);
});

test('Cyoria: tighter mesh leaves wet cake and weaker salve, with one paid cleanup', () => {
    const r = room(cyoria);
    r.source('leaf');
    r.run('measure', {material:'leaf', quantity:1});
    r.run('append', {operation:'extract', level:1});
    assert.throws(() => r.run('separate', {mesh:'toString'}), /choose a mesh/i);
    r.run('separate', {mesh:'fine'});
    r.reload();
    r.wait(5);
    const {portion} = r.data.separation;
    assert.deepEqual([portion.liquidMass, portion.solidMass, portion.capacity], [190, 810, 195]);
    assert.match(r.run('wipe-press'), /195 parts/);
    assert.equal(r.data.separation.residue, 205);
    r.reload();
    assert.throws(() => r.run('wipe-press'), /keep a press cake/i);
    const purse = r.state.purse;
    r.run('wipe-cloth');
    assert.equal(r.state.purse, purse - 1);
    assert.equal(r.data.separation.residue, 0);
    assert.throws(() => r.run('wipe-cloth'), /clean cloth/i);
    r.source('oil');
    const bottle = r.brew(['fine_extract', 'oil'], ['stir']);
    assert.deepEqual(r.state.potionWorkings[cyoria].bottles[bottle].extraction,
        {id:portion.id, parent:portion.parent, extractMass:190, mesh:'fine', makeUpWater:810});
    r.run('sore-skin');
    assert.match(r.run('dose', {bottle, route:'topical'}), /symptoms eased/);
    r.reload();
    assert.equal(r.data.effects[0].strength, 1);
    assert.equal(r.data.separation.residue, 0);
});

test('Cyoria: a pre-mesh save retains the original press behavior', () => {
    const r = room(cyoria);
    r.source('leaf');
    r.run('measure', {material:'leaf', quantity:1});
    r.run('append', {operation:'extract', level:1});
    r.run('separate');
    r.wait(5);
    const split = r.state.potionWorkings[cyoria].separation;
    delete split.mesh;
    delete split.capacity;
    delete split.fibre;
    delete split.retainedLiquid;
    r.reload();
    assert.match(r.run('wipe-press'), /lifted the residue/);
    assert.equal(r.data.separation.residue, 0);
});

test('Cyoria: draining changes cake capacity and accounts for waste after reload', () => {
    const r = room(cyoria);
    r.source('leaf');
    r.run('measure', {material:'leaf', quantity:1});
    r.run('append', {operation:'extract', level:1});
    r.run('separate', {mesh:'fine'});
    r.wait(5);
    r.run('drain-cake');
    r.reload();
    assert.throws(() => r.run('wipe-press'), /keep a press cake/i);
    r.wait(4);
    r.reload();
    const cake = r.data.separation.portion;
    assert.equal(cake.liquidMass + cake.fibre + cake.retainedLiquid, 1000);
    assert.equal(cake.retainedLiquid, 410);
    assert.equal(cake.drained, true);
    assert.match(r.run('wipe-press'), /lifted the residue/);
    assert.equal(r.data.separation.residue, 0);
    assert.throws(() => r.run('wipe-cloth'), /clean cloth/i);
});

test('Hogwarts: tracer moves through lining, next bottle and timed wash exactly once', () => {
    const r = room(hogwarts);
    r.source('water');
    const control = r.brew(['water'], ['stir']);
    assert.match(r.run('inspect-trace', {bottle:control}), /no blue tracer/);
    r.source('blue_tracer');
    const marked = r.brew(['blue_tracer'], ['stir']);
    assert.match(r.run('inspect-trace', {bottle:marked}), /6 parts/);
    assert.equal(r.data.lining.film, 6);
    r.reload();

    r.source('water');
    const contaminated = r.brew(['water'], ['stir']);
    assert.match(r.run('inspect-trace', {bottle:contaminated}), /3 parts/);
    assert.equal(r.data.lining.film, 3);
    assert.throws(() => r.run('wash-lining'), /portions/);
    r.source('water');
    r.run('measure', {material:'water', quantity:1});
    r.run('wash-lining');
    r.reload();
    assert.equal(r.data.lining.film, 3);
    assert.equal(r.data.lining.lastWash, undefined);
    assert.throws(() => r.run('wash-lining'), /current work/);
    r.wait(3);
    r.reload();
    assert.equal(r.data.lining.film, 0);
    assert.equal(r.data.lining.lastWash.parts, 3);
    assert.deepEqual(r.data.lining.balance, {added:12, held:9, used:0, washed:3});
    assert.throws(() => r.run('wash-lining'), /no retained tracer/);

    r.source('water');
    const clean = r.brew(['water'], ['stir']);
    assert.match(r.run('inspect-trace', {bottle:clean}), /no blue tracer/);
    r.run('dose', {bottle:contaminated, route:'assay'});
    r.reload();
    assert.deepEqual(r.data.lining.balance, {added:12, held:6, used:3, washed:3});

    const tampered = structuredClone(r.state);
    tampered.potionWorkings[hogwarts].liningHistory[0].bottle.constituents[0].amount++;
    assert.throws(() => validate(tampered), /material transfer/);
});
