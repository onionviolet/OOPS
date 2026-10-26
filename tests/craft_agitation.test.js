import test from 'node:test';
import assert from 'node:assert/strict';
import {frontierAgitationLaw as law, createAgitationState, validateAgitationState,
    quoteAgitation, applyAgitation, settleAgitation, admitAgitation, agitationEffect} from '../src/craft_agitation.js';
const batch = {mass: 1, viscosity: 1, fragility: 0.3};
const action = {verb: 'stir', seconds: 2, intensity: 'gentle', direction: 'clockwise', rhythm: 'steady'};
const means = {tools: ['paddle', 'whisk', 'kneader', 'pump', 'shaker'], drive: 'manual',
    stamina: 10000, energy: 10000, toolCondition: 100, maxLoad: 100, reach: 1};
const fresh = () => createAgitationState(law);
const run = (s = fresh(), a = {}, b = batch, m = means, l = law) => applyAgitation(l, s, b, {...action, ...a}, m);
const close = (a, b) => {
    for(const k of Object.keys(a)) typeof a[k] === 'number' ?
        assert.ok(Math.abs(a[k] - b[k]) < 1e-10, `${k}: ${a[k]} != ${b[k]}`) : assert.equal(a[k], b[k]);
};

test('every supported verb changes state and charges real work; paste admits kneading', () => {
    for(const verb of Object.keys(law.verbs)) {
        const {state, costs} = run(fresh(), {verb}, {...batch, viscosity: verb === 'knead' ? 10 : 1});
        assert.ok(state.work > 0 && state.homogeneity > 0 && state.suspension > 0 && state.contact > 0);
        assert.ok(costs.stamina > 0 && costs.toolWear > 0 && costs.laborSeconds === 2);
        assert.ok(agitationEffect(law, state).contact > 0);
    }
    assert.throws(() => run(fresh(), {verb: 'knead'}), /viscosity/);
    assert.throws(() => run(fresh(), {verb: 'whisk'}, {...batch, viscosity: 10}), /viscosity/);
});

test('symmetric motion and unqualified rhythm are materially equivalent', () => {
    const a = run().state;
    for(const direction of ['counterclockwise', 'alternating']) assert.deepEqual(run(fresh(), {direction}).state, a);
    assert.deepEqual(run(fresh(), {rhythm: 'pulsed'}).state, a);
    assert.equal(agitationEffect(law, a).orientedFlow, 0);
});

test('count is work with time and cadence; repeating preview changes nothing', () => {
    const s = fresh(), frozen = JSON.stringify({s, batch, action, means, law});
    const q = quoteAgitation(law, s, batch, action, means);
    assert.deepEqual(quoteAgitation(law, s, batch, action, means), q);
    assert.equal(JSON.stringify({s, batch, action, means, law}), frozen);
    const half = run(s, {strokes: 1});
    assert.equal(half.state.work, run().state.work / 2);
    assert.equal(half.costs.stamina, q.costs.stamina / 2);
    assert.throws(() => run(s, {strokes: 3}), /cadence/);
});

test('viscosity, reach and scale reduce delivered mixing; larger work is paid', () => {
    const ordinary = run();
    assert.ok(run(fresh(), {}, {...batch, mass: 10}).state.contact < ordinary.state.contact);
    assert.ok(run(fresh(), {}, {...batch, viscosity: 10}).state.contact < ordinary.state.contact);
    assert.ok(run(fresh(), {}, batch, {...means, reach: 0.5}).state.contact < ordinary.state.contact);
    const scaled = run(fresh(), {seconds: 20}, {...batch, mass: 10});
    close({...scaled.state, work: ordinary.state.work, heatWork: ordinary.state.heatWork}, ordinary.state);
    assert.equal(scaled.costs.stamina, ordinary.costs.stamina * 10);
});

test('vigorous whisk builds air/foam/heat but shear damages fragile components', () => {
    const gentle = run(fresh(), {verb: 'whisk'}).state;
    const vigorous = run(fresh(), {verb: 'whisk', intensity: 'vigorous'}).state;
    for(const k of ['contact', 'air', 'foam', 'heatWork', 'damage']) assert.ok(vigorous[k] > gentle[k], k);
    const intact = run(fresh(), {verb: 'whisk', intensity: 'vigorous'}, {...batch, fragility: 0}).state;
    assert.equal(intact.damage, 0);
    assert.ok(agitationEffect(law, vigorous).intact < agitationEffect(law, gentle).intact);
});

test('plateau limits gain, damage is irreversible, recovery remixes settling', () => {
    const s = run(fresh(), {seconds: 100, intensity: 'vigorous'}).state;
    assert.equal(s.homogeneity, 1); assert.equal(s.contact, 1); assert.equal(s.damage, 1);
    assert.equal(agitationEffect(law, s).contact, 0);
    const repeated = run(s).state;
    assert.equal(repeated.contact, s.contact); assert.equal(repeated.damage, 1);
    const base = run(fresh(), {seconds: 10}, {...batch, fragility: 0}).state;
    const settled = settleAgitation(law, base, batch, 100);
    assert.ok(agitationEffect(law, settled).uniformity < agitationEffect(law, base).uniformity);
    const rescued = run(settled, {}, {...batch, fragility: 0});
    assert.ok(rescued.state.suspension > settled.suspension && rescued.costs.stamina > 0);
    assert.equal(settled.damage, base.damage);
});

test('clock chunking, committed action batching and serialization preserve facts/costs', () => {
    let s = fresh(), stamina = 0;
    for(let i = 0; i < 10; i++) { const r = run(s); s = r.state; stamina += r.costs.stamina; }
    const one = run(fresh(), {seconds: 20});
    close(s, one.state); assert.ok(Math.abs(stamina - one.costs.stamina) < 1e-10);
    const once = settleAgitation(law, s, batch, 20);
    let chunk = s;
    for(let i = 0; i < 10; i++) chunk = settleAgitation(law, chunk, batch, 2);
    close(chunk, once);
    const saved = JSON.parse(JSON.stringify(s));
    assert.deepEqual(validateAgitationState(law, saved), s);
    assert.deepEqual(run(saved), run(s));
});

test('late admission dilutes earlier progress without retroactive work or restored material', () => {
    const s = run().state, added = admitAgitation(law, s, 1, 1);
    for(const k of ['contact', 'homogeneity', 'suspension', 'damage', 'air', 'foam']) assert.equal(added[k], s[k] / 2);
    assert.equal(added.work, s.work); assert.equal(added.heatWork, s.heatWork);
    assert.equal(s.contact, run().state.contact);
});

test('oriented flow and rhythm require a mechanism and consume declared power', () => {
    const l = {...law, id: 'original.oriented-pump', orientation: {direction: 'clockwise',
        targetWork: 5, energyPerWork: 2, mechanism: 'chiral baffles drive one-way interface contact', locator: 'ORIGINAL fixture'},
    rhythm: {pulsedEfficiency: 1.2, mechanism: 'pulse flushes baffle recesses', locator: 'ORIGINAL fixture'}};
    const s = createAgitationState(l);
    const a = run(s, {}, batch, means, l), reverse = run(s, {direction: 'counterclockwise'}, batch, means, l);
    assert.ok(agitationEffect(l, a.state).orientedFlow > 0);
    assert.equal(agitationEffect(l, reverse.state).orientedFlow, 0);
    assert.ok(a.costs.energy > 0);
    const pulsed = run(s, {rhythm: 'pulsed'}, batch, means, l);
    assert.ok(pulsed.state.contact > a.state.contact);
    assert.equal(run(s, {direction: 'alternating'}, batch, means, l).state.orientedWork, 0);
    assert.throws(() => createAgitationState({...l, orientation: {...l.orientation, mechanism: ''}}), /mechanism/);
});

test('stale means and malformed inputs refuse before changing state', () => {
    const s = fresh(), before = JSON.stringify(s);
    for(const m of [{...means, stamina: 0}, {...means, drive: 'powered', energy: 0},
        {...means, toolCondition: 0}, {...means, tools: []}, {...means, maxLoad: 0.5}]) assert.throws(() => run(s, {}, batch, m));
    assert.equal(JSON.stringify(s), before);
    for(const seconds of [NaN, Infinity, -1, 0]) assert.throws(() => run(s, {seconds}));
    assert.throws(() => run(s, {direction: 'ingredient-order'}), /motion/);
    assert.throws(() => run(s, {verb: 'chant'}), /reader/);
    assert.throws(() => validateAgitationState({...law, revision: 2}, s), /revision/);
    assert.throws(() => validateAgitationState(law, {...s, damage: NaN}), /finite/);
    assert.throws(() => admitAgitation(law, s, 0, 1), /positive/);
});
