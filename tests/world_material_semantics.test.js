import test from 'node:test';
import assert from 'node:assert/strict';
import {begin, commit, quote, view, settle, resolveBrew, HP} from '../src/hp_brewing_state.js';
import {HP_PROCESS, assessHpPreparation} from '../src/hp_brewing_formula.js';
import {CC_BREW} from '../src/book_world_lotm_brew.js';
import {processGaps} from '../src/dose_process.js';
import {nativeCatalogue, SYMBOLIC_PROPOSALS} from '../src/native_material_catalogue.js';
import {renderingSources} from '../src/native_rendering_recipes.js';
import {fresh, run, wait, holds, def} from './lotm_helpers.js';
import {LOTM_KEYS as K, LOTM_IDS as I} from '../src/book_world_lotm_ids.js';

// Cross-world boundary, not a translation registry: these fixtures exercise each
// world's real consumer. No tag/name grants a foreign identity or active power.
const nativeKey = id => JSON.stringify({id});
const hpLots = () => Object.fromEntries(HP.formula.slots.map(slot => [slot.id, {
    ingredient: slot.ingredient, form: slot.form, variant: null,
    truth: {provenance: slot.provenance ?? null, stewedMinutes: slot.minStewMinutes ?? 0},
}]));

test('one animal-material concept has functional native use and exact LOTM identity use', () => {
    const source = renderingSources().find(s => s.id === 'Frog meat');
    assert.ok(source && source.count > 0, 'native food reads meat/oil contribution');
    const bone = nativeCatalogue.materials['Monster bone'];
    assert.ok(SYMBOLIC_PROPOSALS[bone.id].includes('deathly'));
    assert.equal(nativeCatalogue.registry.get('deathly').kind, 'symbolic_proposal');
    const stock = {[nativeKey('Frog meat')]: source.count, [nativeKey('Monster bone')]: 1};
    assert.equal(processGaps(CC_BREW, stock).ok, false, 'physical cousin/symbolism is not the exact formula key');
    let p = run(run(fresh(5000), 'report_in'), 'buy_formula_cc');
    Object.assign(p.gameplay.player.inventory, stock);
    const before = structuredClone(p);
    assert.throws(() => run(p, 'brew_start_cc'));
    assert.deepEqual(p, before, 'refused standard brew spends no stock/time/draw/knowledge');
    // Named fixture grants one exact, source-qualified lot, then uses real costs,
    // clock, collect and ingestion. It does not claim an earned acquisition route.
    p.gameplay.player.inventory[K.frog] = 1;
    p = run(p, 'brew_start_cc');
    assert.equal(holds(p, K.frog), 0);
    assert.equal(holds(p, nativeKey('Monster bone')), 1);
    assert.equal(holds(p, nativeKey('Frog meat')), source.count);
    assert.deepEqual(def('brew_start_cc').costs[0].key, K.frog);
    p = run(wait(p, CC_BREW.minutes), 'brew_collect_cc');
    assert.equal(holds(p, K.corpseDose), 1);
    assert.equal(p.state.actors.player.sources[I.corpse], undefined, 'holding is not power');
    p = run(p, 'ingest_cc');
    assert.equal(holds(p, K.corpseDose), 0);
    assert.ok(p.state.actors.player.sources[I.corpse], 'actual ingestion owns the power');
});

test('HP reads exact identity plus preparation/provenance, not LOTM or native names', () => {
    const lots = hpLots();
    assert.equal(resolveBrew(lots, 1000).grade, 'canon');
    const wrongOrigin = structuredClone(lots); wrongOrigin.fluxweed.truth.provenance = 'other';
    assert.equal(resolveBrew(wrongOrigin, 1000).grade, 'original');
    const wrongForm = structuredClone(lots); wrongForm.bicorn.form = 'raw';
    assert.equal(resolveBrew(wrongForm, 1000).grade, 'original');
    for(const identity of ['Fluxweed', 'Frog meat', CC_BREW.slots[0].select.material]) {
        const imported = structuredClone(lots); imported.fluxweed.ingredient = identity;
        assert.equal(resolveBrew(imported, 1000).grade, 'original', 'no directional translation exists for this foreign identity');
    }
    assert.equal(HP_PROCESS.world, 'book.hp');
    assert.notEqual(CC_BREW.world, HP_PROCESS.world);
    for(const slot of HP_PROCESS.slots) {
        const original = HP.formula.slots.find(s => s.id === slot.id);
        assert.equal(slot.select.material, original.ingredient);
        for(const id of original.evidence) {
            const ev = HP.evidence.find(e => e.id === id);
            assert.ok(ev && ev.locator && ev.status, 'consumed local requirement has source status and locator');
        }
    }
});

test('HP truth changes the actual batch/use while inspection and preview grant nothing', () => {
    const journey = moon => {
        let s = begin({seed:11, now:0}), now = 0;
        const act = req => {s = commit(s, {now, moon}, req).state;};
        const acquire = (ingredient, route) => {
            act({type:'acquire', ingredient, route}); return Object.values(s.lots).at(-1).id;
        };
        const slots = {};
        // Acquire/prep through the real owner. The clock helper is a named fixture.
        for(const slot of HP.formula.slots) slots[slot.id] = acquire(slot.ingredient,
            slot.id === 'fluxweed' ? 'book.hp.route.harvest' : ['bicorn','boomslang'].includes(slot.id) ? 'book.hp.route.trusted_supplier' : 'book.hp.route.student_store');
        act({type:'stew', lotId:slots.lacewing}); now += 30240; settle(s, now);
        act({type:'prepare', lotId:slots.bicorn, variant:'book.hp.prep.powder_fine'});
        act({type:'prepare', lotId:slots.boomslang, variant:'book.hp.prep.shred_fine'});
        const before = structuredClone(s), ctx = {now, moon};
        const assessment = assessHpPreparation(view(s, ctx), slots);
        assert.equal(assessment.rows.find(r => r.slot === 'fluxweed').status, moon === 'Full' ? 'supported' : 'deviation');
        assert.equal(quote(s, ctx, {type:'brew', slots}).eligible, true, 'changed known provenance changes prediction, not permission to experiment');
        assert.deepEqual(s, before, 'projection/preview leaves truth/knowledge/serial/stock/time unchanged');
        act({type:'brew', slots}); now += HP.rules.brewMinutes; settle(s, now);
        const batch = Object.values(s.batches).at(-1);
        act({type:'sample', donorId:'d1', route:'ask'});
        act({type:'drink', batchId:batch.id, sampleId:Object.keys(s.samples).at(-1)});
        return {s, grade:batch.grade};
    };
    const full = journey('Full'), other = journey('New');
    assert.equal(full.grade, 'canon'); assert.equal(full.s.effect.kind, 'transform');
    assert.equal(other.grade, 'original'); assert.equal(other.s.effect.kind, 'nothing');
    assert.equal(other.s.effect.endsAt, other.s.effect.startedAt, 'off-formula use grants no duration');
    settle(other.s, other.s.now); assert.equal(other.s.effect, null);
    assert.equal(Object.keys(full.s.samples).length, 0); assert.equal(Object.keys(other.s.samples).length, 0);
});

test('LOTM supported characteristic exception is local identity law, not symbolic similarity', async () => {
    const {LOTM_CHARACTERISTIC, characteristicMatchesFormula} = await import('../src/book_world_lotm_bench.js');
    const {rowById} = await import('../src/lotm_formula_rows.js');
    const formula = rowById('visionary_9');
    assert.equal(characteristicMatchesFormula(formula, LOTM_CHARACTERISTIC), true);
    assert.equal(characteristicMatchesFormula(formula, {...LOTM_CHARACTERISTIC, world:'base.native', pathway:'Fool'}), false);
    assert.equal(characteristicMatchesFormula(formula, {id:'Monster bone', tags:['deathly']}), false);
    assert.equal(characteristicMatchesFormula(formula, {...LOTM_CHARACTERISTIC, seq:8}), false);
});
