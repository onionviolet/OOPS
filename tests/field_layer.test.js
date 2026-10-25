import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh, pour, ignite, douse, sweep, advance, validateFields, upgradeFields, raiseField, dropField, massOf, DIALS, readPlace, floorReading} from '../src/field_layer.js';
import {createFieldDomain, WATER, HATCH, harmOf} from '../src/field_layer_factory.js';
const adv = (s, n, o) => advance(s, n, o).state;

// Mixture-shaped material: fractions sum to mass, as mixture_state.js retains them.
const EMBER = {fractions: {restore: 0, vigor: 120, trace: 8, matrix: 872}, mass: 1000};
const LEAF = {fractions: {restore: 110, vigor: 0, trace: 12, matrix: 878}, mass: 1000};
const WATERC = {fractions: {restore: 0, vigor: 0, trace: 0, matrix: 1000}, mass: 1000};
const lit = (s, p = 'Shack', lv = 0) => ignite(s, p, lv);
const conserved = s => Object.values(s.places).every(p => p.poured === massOf(p) + p.vented);

test('burning turns stock into smoke that rises and fumes that sink; mass balances every minute', () => {
    let s = lit(pour(fresh(), 'Shack', 0, EMBER));
    for (let i = 0; i < 6; i++) { s = adv(s, 1); validateFields(s); assert.ok(conserved(s)); }
    const r = readPlace(s.places.Shack, 'Shack'), early = readPlace(adv(lit(pour(fresh(), 'Shack', 0, EMBER)), 2).places.Shack, 'Shack');
    assert.ok(early.levels[0].fume > 0, 'fume sinks to and pools on the floor');
    assert.ok(r.levels[1].smoke + r.levels[2].smoke > r.levels[0].smoke, 'smoke gathers above the fire');
});

test('stock spilled on a shelf falls to the floor, level by level', () => {
    let s = pour(fresh(), 'Shack', 2, LEAF);
    s = adv(s, 1); assert.ok(s.places.Shack.levels[1].solid.restore > 0);
    s = adv(s, 30);
    assert.equal(s.places.Shack.levels[2].solid.restore + s.places.Shack.levels[1].solid.restore, 0);
    assert.equal(s.places.Shack.levels[0].solid.restore, 110);
});

test('fire climbs to flammable stock above and ignores damp stock', () => {
    let s = pour(pour(fresh(), 'Shack', 0, EMBER), 'Shack', 1, EMBER);
    s = lit(s, 'Shack', 0); s = adv(s, 1);
    assert.equal(s.places.Shack.levels[1].fire, true);
    const wet = douse(douse(douse(pour(fresh(), 'Shack', 0, EMBER), 'Shack', 0, WATERC), 'Shack', 0, WATERC), 'Shack', 0, WATERC);
    assert.throws(() => ignite(wet, 'Shack', 0), /will not catch/);
});

test('dousing a burning level puts it out', () => {
    let s = adv(lit(pour(fresh(), 'Shack', 0, EMBER)), 2);
    for (let i = 0; i < 4; i++) s = douse(s, 'Shack', 0, WATERC);
    assert.equal(s.places.Shack.levels[0].fire, false);
    validateFields(s);
});

test('adv(a+b) equals adv(a) then adv(b); a mid-burn save resumes identically', () => {
    const s = lit(pour(pour(fresh(), 'Village', 0, EMBER), 'Village', 1, LEAF), 'Village');
    const whole = adv(s, 37), split = adv(adv(s, 11), 26), reloaded = adv(structuredClone(adv(s, 11)), 26);
    assert.deepEqual(whole, split); assert.deepEqual(whole, reloaded);
});

test('a place at the pour cap settles inside the step bound, so the cap loses no outcome', () => {
    let s = fresh();
    for (let i = 0; i < 12; i++) s = pour(s, 'Cave depths', i % 2, i % 3 ? EMBER : LEAF);
    s = lit(s, 'Cave depths', 0);
    const a = adv(s, DIALS.MAX_STEPS), b = adv(a, 500);
    assert.deepEqual(a, b, 'already settled at the bound');
    assert.ok(a.places['Cave depths'].levels.every(l => !l.fire && l.gas.smoke === 0 && l.gas.fume === 0));
    assert.ok(conserved(a));
    assert.throws(() => pour(s, 'Cave depths', 0, EMBER), /no more room/);
    const t = Date.now(); adv(s, 1e9); assert.ok(Date.now() - t < 2000, 'huge absences are cheap');
});

test('validate rejects invented mass, floating fire, and unknown shapes', () => {
    const s = pour(fresh(), 'Shack', 0, EMBER);
    const bad = structuredClone(s); bad.places.Shack.poured += 1;
    assert.throws(() => validateFields(bad), /not conserved/);
    const fire = structuredClone(fresh()); fire.places.X = structuredClone(s.places.Shack);
    fire.places.X.poured = 0; fire.places.X.levels = fire.places.X.levels.map(l => ({...l, solid: {restore: 0, vigor: 0, trace: 0, matrix: 0}, fire: true}));
    assert.throws(() => validateFields(fire));
    assert.throws(() => validateFields({schema: 3, places: {}}));
    validateFields(null); validateFields(s);
});

test('sweep clears cooled stock but not a live fire', () => {
    let s = lit(pour(fresh(), 'Shack', 0, EMBER));
    assert.throws(() => sweep(s, 'Shack'), /cleared/);
    s = adv(s, DIALS.MAX_STEPS);
    s = sweep(s, 'Shack'); assert.deepEqual(s.places, {});
});

// Domain over fake ports, with a plain inventory owner as lamplight's test does.
function setup({ember = 2, lamp = true, water = 1} = {}) {
    const inv = {counts: {[JSON.stringify({id: 'Emberseed'})]: ember, [WATER]: water}}, log = [], env = {fail: false, writes: 0, place: 'Shack', lamp, harms: [], light: null};
    const comps = {[JSON.stringify({id: 'Emberseed'})]: EMBER, [WATER]: WATERC};
    const d = createFieldDomain({
        itemOwners: () => [inv], assertSpend: k => { if (!inv.counts[k]) throw Error('Not held.'); },
        persist: mark => { if (env.fail) throw Error('Disk full.'); env.writes++; mark(); }, writable: () => true,
        location: () => env.place, refresh() {}, logMessage: m => log.push(m),
        heldItems: () => Object.entries(inv.counts).filter(([, n]) => n > 0).map(([key, count]) => ({key, count, name: key})),
        removeKey: (k, n) => { inv.counts[k] -= n; }, composition: k => comps[k] ?? null, ignitionSource: () => env.lamp, harm: h => env.harms.push(h), bindLightSource: r => { env.light = r; return () => {}; }});
    const run = req => d.commands.execute(d.commands.quote(req));
    return {d, inv, log, env, run, key: JSON.stringify({id: 'Emberseed'})};
}

test('domain: spill, light and burn through ticks; only a quoted command spends items', () => {
    const {d, inv, run, key, log} = setup();
    assert.equal(d.commands.quote({kind: 'light'}).eligible, false);
    run({kind: 'pour', key, level: 0}); assert.equal(inv.counts[key], 1);
    run({kind: 'light'});
    d.tick(5); assert.ok(d.projection().here.burning); assert.equal(inv.counts[key], 1, 'tick never touches the pack');
    d.tick(2000);
    assert.equal(d.projection().here.burning, false);
    assert.ok(log.some(m => /burns itself out|Fire has taken/.test(m)));
    validateFields(d.save());
});

test('domain: needs a lit lamp; failed write rolls back item and state', () => {
    const s = setup({lamp: false});
    s.run({kind: 'pour', key: s.key, level: 0});
    assert.match(s.d.commands.quote({kind: 'light'}).reason, /lit oil lamp/);
    s.env.fail = true;
    assert.throws(() => s.run({kind: 'pour', key: s.key, level: 1}), /Disk full/);
    assert.equal(s.inv.counts[s.key], 1); assert.equal(massOf(s.d.getState().places.Shack), 1000);
});

test('domain: stale quote is refused; empty state saves nothing; old save loads clean', () => {
    const s = setup();
    const quoted = s.d.commands.quote({kind: 'pour', key: s.key, level: 0});
    s.run({kind: 'pour', key: s.key, level: 0}); s.run({kind: 'pour', key: s.key, level: 0});
    assert.throws(() => s.d.commands.execute(quoted), /Not held|hold nothing|room/);
    assert.equal(createFieldDomain().save(), undefined);
    assert.deepEqual(s.d.migrate(undefined), fresh());
    const copy = createFieldDomain(); copy.load(s.d.migrate(s.d.save()));
    assert.deepEqual(copy.getState(), s.d.getState());
});

test('domain: douse spends spring water and stops the fire', () => {
    const s = setup({ember: 1});
    s.run({kind: 'pour', key: s.key, level: 0}); s.run({kind: 'light'}); s.d.tick(1);
    s.run({kind: 'douse', level: 0});
    assert.equal(s.inv.counts[WATER], 0);
    assert.equal(s.d.getState().places.Shack.levels[0].fire, false);
    assert.equal(s.d.commands.quote({kind: 'douse', level: 0}).eligible, false);
});

test('a burning shelf gives way after COLLAPSE_AFTER minutes, drops its load, and cannot be loaded again', () => {
    let s = lit(raiseField(pour(fresh(), 'Shack', 1, EMBER, 6), 'Shack', 0, HATCH), 'Shack', 1); // barred hatch keeps the load up
    const early = advance(s, DIALS.COLLAPSE_AFTER - 3, {watch: 'Shack'}); assert.equal(early.exposure.fell, 0);
    const r = advance(s, DIALS.COLLAPSE_AFTER + 2, {watch: 'Shack'});
    assert.equal(r.exposure.fell, 1, 'the boards land on the floor once');
    const p = r.state.places.Shack; assert.equal(p.levels[1].fallen, true); assert.equal(p.collapses, 1);
    assert.ok(conserved(r.state)); validateFields(r.state);
    assert.throws(() => pour(r.state, 'Shack', 1, LEAF), /fallen in/);
    const t = adv(dropField(pour(r.state, 'Shack', 2, LEAF), 'Shack', 0, HATCH), 5);
    assert.equal(t.places.Shack.levels[1].solid.restore, 0, 'stock falling past a fallen level does not stop on it');
});

test('a barred hatch blocks fall, fire and gas; the edge opens only when the last field ends', () => {
    let s = raiseField(pour(pour(fresh(), 'Shack', 0, EMBER), 'Shack', 1, EMBER), 'Shack', 0, HATCH);
    s = adv(lit(s, 'Shack', 0), 4);
    assert.equal(s.places.Shack.levels[1].fire, false, 'fire does not cross');
    assert.equal(s.places.Shack.levels[1].gas.smoke, 0, 'smoke does not cross');
    assert.ok(s.places.Shack.levels[0].gas.smoke > 0);
    const spill = adv(raiseField(pour(fresh(), 'Shack', 1, LEAF), 'Shack', 0, HATCH), 20);
    assert.equal(spill.places.Shack.levels[0].solid.restore, 0, 'stock cannot fall through the bar');
    let f = raiseField(raiseField(fresh(), 'Shack', 0, HATCH), 'Shack', 0, 'ward', 3);
    f = adv(f, 5); assert.deepEqual(Object.keys(f.places.Shack.edges[0]), [HATCH], 'timed ward ended, hatch remains');
    f = dropField(f, 'Shack', 0, HATCH);
    assert.equal(readPlace(f.places.Shack, 'Shack').edges[0].blocked, false);
    validateFields(f);
});

test('fire jumps through a doorway after SPREAD_AFTER minutes, but not to damp or empty floors', () => {
    const neighbors = null; // doorways come from the places' own recorded doors, joined both ways
    const base = pour(pour(fresh(), 'Village', 0, EMBER, 3, ['Shack']), 'Shack', 0, EMBER);
    const quick = advance(lit(base, 'Village', 0), 3, {neighbors}).state;
    assert.equal(quick.places.Shack.levels[0].fire, false);
    const later = advance(lit(base, 'Village', 0), DIALS.SPREAD_AFTER + 3, {neighbors}).state;
    assert.equal(later.places.Shack.levels[0].fire, true);
    const wet = [1, 2, 3].reduce(s => douse(s, 'Shack', 0, WATERC), base);
    assert.equal(advance(lit(wet, 'Village', 0), DIALS.SPREAD_AFTER + 5, {neighbors}).state.places.Shack.levels[0].fire, false);
});

test('rain puts out fire in open air but not in a closed place', () => {
    const open = adv(lit(pour(fresh(), 'Village', 0, EMBER), 'Village'), 2, {rain: true});
    assert.equal(open.places.Village.levels[0].fire, false);
    const closed = adv(lit(pour(fresh(), 'Cave depths', 0, EMBER), 'Cave depths'), 2, {rain: true});
    assert.equal(closed.places['Cave depths'].levels[0].fire, true);
});

test('exposure to a fire becomes bounded harm and light; fire is the only light source here', () => {
    const r = advance(lit(pour(fresh(), 'Shack', 0, EMBER)), 5, {watch: 'Shack'});
    assert.equal(r.exposure.burning, 5);
    const h = harmOf(r.exposure); assert.equal(h.health, 10); assert.ok(h.stamina >= 0);
    assert.equal(floorReading(r.state.places.Shack).light, 30);
    assert.equal(floorReading(undefined).light, 0);
});

test('domain: harm and light reach their ports; harm stops with the fire; leaving the place means no harm', () => {
    const s = setup({ember: 1});
    s.run({kind: 'pour', key: s.key, level: 0}); s.run({kind: 'light'});
    s.d.tick(4);
    assert.ok(s.env.harms.length === 1 && s.env.harms[0].health === 8);
    assert.equal(s.env.light(), 30, 'a burning place lights its floor');
    s.env.place = 'Village'; const n = s.env.harms.length; s.d.tick(3);
    assert.equal(s.env.harms.length, n, 'no harm in another place');
    assert.equal(s.env.light(), 0);
});

test('domain: hatch command quotes, bars, lifts; a schema-1 slice upgrades without losing mass', () => {
    const s = setup();
    s.run({kind: 'pour', key: s.key, level: 0});
    assert.equal(s.d.commands.quote({kind: 'unseal', level: 0}).eligible, false);
    s.run({kind: 'seal', level: 0}); assert.equal(s.d.commands.quote({kind: 'seal', level: 0}).eligible, false);
    s.run({kind: 'unseal', level: 0});
    const old = {schema: 1, places: {Shack: {poured: 1000, vented: 0, levels: [
        {solid: {restore: 0, vigor: 120, trace: 8, matrix: 872}, gas: {smoke: 0, fume: 0}, fire: true}, ...[0, 1].map(() => ({solid: {restore: 0, vigor: 0, trace: 0, matrix: 0}, gas: {smoke: 0, fume: 0}, fire: false}))]}}};
    const up = s.d.migrate(old); validateFields(up); assert.equal(up.schema, 2); assert.equal(massOf(up.places.Shack), 1000);
    validateFields(upgradeFields(old));
});
