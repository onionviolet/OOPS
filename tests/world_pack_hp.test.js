import test from 'node:test';
import assert from 'node:assert/strict';
import hpPack from '../src/world_packs/book_hp_pack.js';
import {BUNDLED_WORLD_PACKS, installedWorldPack, loadBundledWorldPacks} from '../src/world_pack_registry.js';
import {authorReport, loadWorldPacks} from '../src/world_pack_loader.js';

const native = hpPack.native, STATUS = ['shown', 'stated', 'inferred'];
const evidence = new Map(native.evidence.map(e => [e.id, e]));

test('the Harry Potter pack is bundled, loads clean and is plain integer data (WA21, IS2)', () => {
    assert.ok(BUNDLED_WORLD_PACKS.includes(hpPack));
    const registry = loadBundledWorldPacks();
    assert.equal(registry.dormantPacks.size, 0, authorReport(registry));
    assert.deepEqual(registry.diagnostics.filter(d => d.packId === 'book.hp'), []);
    assert.deepEqual(JSON.parse(JSON.stringify(hpPack)), hpPack);
    assert.equal(installedWorldPack('book.hp').pack.attribution.source.includes('J.K. Rowling'), true);
});

test('every evidence row has a label, a page locator and a short paraphrase, never source text (MR13)', () => {
    assert.equal(evidence.size, native.evidence.length, 'unique evidence IDs');
    for(const e of native.evidence) {
        assert.ok(STATUS.includes(e.status), e.id);
        assert.match(e.locator, /^B[12]:PDF-p\d+/, e.id);
        assert.ok(e.speaker && e.note.length > 0 && e.note.length <= 200, `${e.id} paraphrase is short`);
        assert.ok(!/["“”]/.test(e.note), `${e.id} has no quotation marks`);
    }
});

test('the pinned formula cites evidence for every slot, and canon ingredients keep their canon labels', () => {
    const ids = new Map(native.ingredients.map(i => [i.id, i]));
    for(const slot of native.formula.slots) {
        assert.ok(ids.has(slot.ingredient), slot.id);
        assert.ok(slot.evidence.length > 0, slot.id);
        for(const id of slot.evidence) assert.ok(evidence.has(id), `${slot.id} cites ${id}`);
    }
    assert.deepEqual(native.formula.slots.map(s => s.id), ['lacewing', 'leeches', 'fluxweed', 'knotgrass', 'bicorn', 'boomslang']);
    assert.equal(native.formula.sample.added, 'last');
    assert.equal(evidence.get('book.hp.ev.fluxweed_moon').status, 'stated');
    assert.equal(native.formula.slots[0].minStewMinutes, 21 * 1440, 'twenty-one days is the stated requirement');
    assert.equal(native.formula.transformMinutes, 60);
    // Each ingredient route names its owner and access rule; bicorn and skin are never in the student store (stated).
    const student = native.routes.find(r => r.kind === 'store');
    assert.ok(!('book.hp.ing.bicorn_horn' in student.cost) && !('book.hp.ing.boomslang_skin' in student.cost));
});

test('every rule not stated by the novel is labelled original, and no sealed secret is authored here (HP-SEAL-1)', () => {
    assert.ok(native.originals.length >= 8 && native.originals.every(o => o.status === 'original' && o.reason));
    assert.equal(native.outcomes.canon.status, 'stated');
    assert.equal(native.outcomes.degraded.status, 'original');
    assert.equal(native.outcomes.original.status, 'original');
    assert.equal(hpPack.content.secrets, undefined);
    for(const u of native.unknowns) assert.match(u.id, /^book\.hp\.unknown\./);
});

test('catalog index matches the formula ingredients and all IDs sit in the pack namespace', () => {
    const cat = new Set(hpPack.content.catalog.map(c => c.id));
    for(const i of native.ingredients.filter(i => native.formula.slots.some(s => s.ingredient === i.id) || i.id.endsWith('bicorn_horn')))
        assert.ok(cat.has(i.id.replace('.ing.', '.cat.')), i.id);
    for(const family of [native.evidence, native.ingredients, native.variants, native.routes, hpPack.content.catalog])
        for(const r of family) assert.ok(r.id.startsWith('book.hp.'), r.id);
});

test('a duplicate of the pack does not load twice and an HP pack edit changes the fingerprint (WA10)', () => {
    const twice = loadWorldPacks([hpPack, structuredClone(hpPack)]);
    assert.equal(twice.packs.has('book.hp'), false);
    const edited = structuredClone(hpPack); edited.native.rules.brewMinutes += 1;
    const a = loadWorldPacks([hpPack]).packs.get('book.hp').fingerprint, b = loadWorldPacks([edited]).packs.get('book.hp').fingerprint;
    assert.notEqual(a, b);
});
