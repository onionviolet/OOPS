import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {defineProcess, processGaps, processReady, processLedger} from '../src/dose_process.js';
import {fresh, run, wait, at, holds, save, hostOver} from './lotm_helpers.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_LOCATIONS as L, LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {LOTM_FORMULA_ROWS, LOTM_BREWABLE_ROWS, LOTM_INGREDIENTS, rowById, scalePence, tierOf} from '../src/lotm_formula_rows.js';
import {INGREDIENT_BY_NAME, BENCH_STOCK, STOCK_REV_KEY} from '../src/book_world_lotm_bench.js';
import {CC_BREW} from '../src/book_world_lotm_brew.js';
import {HP_PROCESS} from '../src/hp_brewing_formula.js';
import {settle, validate, HP} from '../src/hp_brewing_state.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';

// DWF101 envelope, DWF102 rows, and the old-save fixtures written before the port (docs/gm/dispatch/dose-mechanism-2026-10-25/fixtures).
const FIX = new URL('../docs/gm/dispatch/dose-mechanism-2026-10-25/fixtures/', import.meta.url);
const fixture = name => JSON.parse(fs.readFileSync(new URL(name, FIX), 'utf8'));
const ok = p => { assert.ok(validateLotmState(p.state)); assert.ok(validateLotmEnvelope(save(p))); };
const base = {id: 'x', world: 'w', name: 'X', minutes: 60, slots: [{id: 's', role: 'main', select: {material: 'Ash'}, qty: 2, key: 'k'}]};

test('defineProcess validates, freezes and rejects malformed rows', () => {
    const row = defineProcess(base);
    assert.ok(Object.isFrozen(row) && Object.isFrozen(row.slots[0]));
    assert.throws(() => defineProcess({...base, slots: []}), /needs slots/);
    assert.throws(() => defineProcess({...base, minutes: 0}), /minutes/);
    assert.throws(() => defineProcess({...base, slots: [{...base.slots[0], select: {material: 'A', tags: {}}}]}), /exactly one/);
    assert.throws(() => defineProcess({...base, slots: [base.slots[0], base.slots[0]]}), /Duplicate/);
    assert.throws(() => defineProcess({...base, ritual: {needed: true, text: 'x', scale: 'galaxy'}}), /ritual scale/);
    assert.equal(defineProcess({...base, status: 'inspect-only', slots: []}).status, 'inspect-only');
});

test('processGaps explains every miss; an unmet ritual is a risk, not a lock', () => {
    const row = defineProcess({...base, ritual: {needed: true, text: 'sing', scale: 'creature'}, gaps: ['amount unknown'], route: {id: 'church', text: 'issued'}});
    let g = processGaps(row, {k: 1});
    assert.deepEqual(g.missing.map(m => [m.slot, m.need, m.have]), [['s', 2, 1]]);
    assert.equal(g.unmet[0].risk, true); assert.deepEqual(g.known, ['amount unknown']); assert.equal(g.route.id, 'church');
    g = processGaps(row, {k: 2}); assert.equal(g.ok, true); assert.equal(g.unmet.length, 1);
    assert.equal(processGaps(row, {k: 2}, {ritualDone: true}).unmet.length, 0);
    assert.equal(processGaps(defineProcess({...base, slots: [{id: 's', role: 'main', select: {material: 'A'}}]}), {}).missing[0].reason, 'no runtime item stands for this slot yet');
});

test('processReady is elapsed minutes and nothing else', () => {
    assert.equal(processReady({startedAt: 10, now: 69, minutes: 60}), false);
    assert.equal(processReady({startedAt: 10, now: 70, minutes: 60}), true);
    assert.equal(processReady({startedAt: null, now: 70, minutes: 60}), false);
});

test('ledger groups by world and pathway, highest Sequence first, with status and gaps', () => {
    const led = processLedger(LOTM_FORMULA_ROWS);
    assert.equal(led.length, 1);
    const fool = led[0].pathways.find(p => p.pathway === 'Fool').entries;
    assert.deepEqual(fool.map(e => e.seq), [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    assert.equal(fool.find(e => e.seq === 8).status, 'inspect-only');
    assert.ok(fool.find(e => e.seq === 8).known > 0);
});

test('LOTM rows: 43 known, 23 brewable, one item per distinct ingredient, canon price kept beside the scaled pence', () => {
    assert.equal(LOTM_FORMULA_ROWS.length, 43); assert.equal(LOTM_BREWABLE_ROWS.length, 23);
    assert.equal(new Set(LOTM_INGREDIENTS.map(i => i.key)).size, LOTM_INGREDIENTS.length);
    const seer = rowById('fool_9'); assert.deepEqual(seer.slots.map(s => s.select.material).slice(0, 2), ['Lavatan octopus blood', 'Star crystal']);
    assert.equal(seer.price.pence, scalePence(230)); assert.equal(seer.price.pence, 1200); assert.equal(seer.price.canon.pounds, 230);
    assert.equal(rowById('visionary_9').slots.length, 6); assert.equal(rowById('black_emperor_7').slots.length, 6);
    for(const r of LOTM_BREWABLE_ROWS) { assert.ok(r.slots.every(s => s.key && INGREDIENT_BY_NAME[s.select.material]), r.id); assert.ok(r.ritual, r.id); assert.ok(r.route.id, r.id); }
    for(const r of LOTM_FORMULA_ROWS.filter(r => r.status === 'inspect-only')) assert.ok(r.gaps.length, r.id);
    assert.equal(tierOf(9), 'supplier'); assert.equal(tierOf(6), 'order'); assert.equal(tierOf(4), 'none');
    assert.ok(LOTM_INGREDIENTS.filter(i => i.tier === 'none').every(i => i.pence === null && i.stock === 0));
    assert.equal(rowById('fool_5').ritual.scale, 'creature'); assert.equal(rowById('fool_5').ritual.needed, true);
});

test('CC and HP are shared-envelope rows', () => {
    assert.equal(CC_BREW.minutes, 120); assert.equal(CC_BREW.product.key, K.corpseDose); assert.equal(CC_BREW.price.canon.pounds, 230);
    assert.equal(HP_PROCESS.minutes, HP.rules.brewMinutes); assert.equal(HP_PROCESS.slots.length, HP.formula.slots.length);
    assert.equal(HP_PROCESS.slots.find(s => s.id === 'fluxweed').require.provenance, 'full_moon');
});

test('old saves finish on the ported code: CC brew in progress and ready, HP Polyjuice simmering', () => {
    const started = fixture('cc-brew-started.json'), ready = fixture('cc-brew-ready.json');
    ok(started); let p = started; assert.throws(() => run(p, 'brew_collect_cc'));
    p = run(wait(p, 120), 'brew_collect_cc'); assert.equal(holds(p, K.corpseDose), 1); ok(p);
    p = run(ready, 'brew_collect_cc'); assert.equal(holds(p, K.corpseDose), 1); ok(p);
    const hp = fixture('hp-brewing.json'), s = hp.slice; validate(s);
    settle(s, s.cauldron.brew.readyAt - 1); assert.ok(s.cauldron.brew);
    settle(s, s.cauldron.brew.readyAt); assert.equal(s.cauldron.brew, null); assert.equal(Object.values(s.batches)[0].grade, 'canon'); validate(s);
});

// advanceSimulation stops early at some boundaries; long brews repeat until the clock arrives.
const pass = (p, minutes) => { const to = p.state.clock + minutes; for(let i = 0; p.state.clock < to && i < 40; i++) p = wait(p, to - p.state.clock); return p; };
const bench = (id, money = 40000) => {
    let p = run(fresh(money), 'report_in'); const row = rowById(id);
    p = at(p, L.docks); if(row.price) p = run(p, `bf_buy_${id}`);
    for(const s of row.slots) p = run(p, `bf_ing_${INGREDIENT_BY_NAME[s.select.material].slug}`);
    return {p: at(p, L.workroom), row};
};

test('a Sequence 9 formula brews, bottles, holds and sells; counters balance', () => {
    let {p, row} = bench('sun_9'); ok(p);
    p = run(p, 'bf_start_sun_9'); ok(p); assert.ok(row.slots.every(s => holds(p, s.key) === 0));
    assert.throws(() => run(p, 'bf_start_sun_9')); assert.throws(() => run(p, 'bf_collect_sun_9'));
    p = wait(p, row.minutes - 1); assert.throws(() => run(p, 'bf_collect_sun_9'));
    p = run(wait(p, 1), 'bf_collect_sun_9'); ok(p); assert.equal(holds(p, row.product.key), 1);
    const m = p.external.money; p = run(at(p, L.docks), 'bf_sell_sun_9'); assert.equal(p.external.money - m, row.product.sellPence); ok(p);
    const forged = save(p); forged.expansion.actors.player.resources['book.lotm.bf.sun_9.made'] = 2; assert.throws(() => validateLotmEnvelope(forged), /balance|equal/);
});

test('special-order tier costs more and has little stock; Seq 4 and above have no Tingen route', () => {
    const q = INGREDIENT_BY_NAME['Hallucination-herb oil'], c = INGREDIENT_BY_NAME['Purified water'];
    assert.equal(q.tier, 'order'); assert.ok(q.pence > c.pence); assert.ok(q.stock < c.stock);
    const p0 = at(run(fresh(40000), 'report_in'), L.docks);
    assert.equal(rowById('fool_4').price, undefined); assert.ok(rowById('fool_4').route.text.includes('rite'));
    assert.throws(() => run(p0, 'bf_buy_fool_4'));
    const mythic = LOTM_INGREDIENTS.find(i => i.tier === 'none'); assert.throws(() => run(p0, `bf_ing_${mythic.slug}`));
    // Held through a test hook, the brew still runs; the unmet rite is data, not a lock.
    let p = at(run(fresh(10), 'report_in'), L.workroom); const row = rowById('fool_4');
    p.state.actors.player.facts['book.lotm.bf.fool_4.formula'] = true;
    for(const s of row.slots) p.gameplay.player.inventory[s.key] = 1;
    p = run(p, 'bf_start_fool_4'); p = run(pass(p, row.minutes), 'bf_collect_fool_4'); ok(p); assert.equal(holds(p, row.product.key), 1);
    assert.match(hostOver(p).host.view('fool_4').bench.selected.drink.reason, /Not yet written.*without its rite.*loss-of-control/);
});

test('stock reaches a save enrolled before the bench (DWF127) and the frog invariant still holds', () => {
    const p = run(fresh(40000), 'report_in');
    for(const key of Object.keys(BENCH_STOCK)) delete p.gameplay[I.broker].inventory[key];
    delete p.state.actors[I.broker].resources[STOCK_REV_KEY]; ok(p);
    const {host, box} = hostOver(at(p, L.docks));
    assert.equal(host.view('sun_9').bench.selected.slots.find(x => x.name === 'Midsummer grass').buy.eligible, true, 'an unseeded save still offers its stock');
    host.act('book.lotm.bf_ing_purified_water');
    assert.equal(box.p.state.actors[I.broker].resources[STOCK_REV_KEY], 1);
    assert.equal(box.p.gameplay.player.inventory[INGREDIENT_BY_NAME['Purified water'].key], 1);
    assert.equal(box.p.gameplay[I.broker].inventory[INGREDIENT_BY_NAME['Purified water'].key], INGREDIENT_BY_NAME['Purified water'].stock - 1);
    ok(box.p); host.act('book.lotm.bf_ing_purified_water'); host.act('book.lotm.bf_ing_purified_water'); host.act('book.lotm.bf_ing_purified_water');
    assert.throws(() => host.act('book.lotm.bf_ing_purified_water'));
});

test('the bench view lists every row, shows one formula, and drinking is honestly unwritten', () => {
    const {p, row} = bench('sun_9'); const {host, box} = hostOver(p);
    const v0 = host.view(); assert.equal(v0.bench.rows.length, 43); assert.equal(v0.bench.selected, null);
    assert.ok(!v0.actions.some(a => a.id.startsWith('book.lotm.bf_')), 'the flat list stays free of bench buttons');
    host.act('book.lotm.bf_start_sun_9'); box.p = pass(box.p, row.minutes); host.act('book.lotm.bf_collect_sun_9');
    const d = host.view('sun_9').bench.selected;
    assert.equal(d.doses, 1); assert.match(d.drink.reason, /Not yet written/); assert.equal(d.drink.eligible, false);
    assert.equal(d.slots.length, 4); assert.ok(d.ritual.text); assert.ok(d.gaps.length >= 0);
    const high = host.view('fool_4').bench.selected; assert.equal(high.formulaRoute.id, 'church_potion_rite'); assert.ok(high.slots.every(s => s.noRoute));
    assert.equal(host.view('death_9').bench.selected.viaMain, true);
});
