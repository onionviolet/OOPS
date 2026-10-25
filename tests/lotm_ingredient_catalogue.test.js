import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildLotmCatalogue, DEFAULT_FLOOR} from '../src/lotm_ingredient_catalogue.js';
import {matchesQuery, materialTags} from '../src/craft_materials.js';

// Synthetic fixture: invented names and facts, not wiki or book text.
const tag = (id, parents = []) => ({id, parents});
const vocab = {
    physical: [tag('liquid'), tag('animal'), tag('plant'), tag('blood', ['liquid', 'animal']), tag('juice', ['liquid', 'plant']), tag('powder'), tag('flower', ['plant']), tag('substance')],
    functional: [tag('main_ingredient'), tag('auxiliary'), tag('solvent')],
    symbolic: [tag('sun'), tag('fire'), tag('night')]};
const ing = (id, en, physical, functional, symbolic) => ({id, en, cn: null, aliases: [], pathways: ['test'], uses: [], quantities: [], decay: [],
    traits: {physical, functional, symbolic}});
const pack = {
    vocab,
    ingredients: [
        ing('en.glimmerfin_blood', 'Glimmerfin Blood', ['blood'], ['main_ingredient'], ['sun', 'fire']),
        ing('en.emberling_blood', 'Emberling Blood', ['blood'], ['main_ingredient'], ['fire']),
        ing('en.duskmoth_blood', 'Duskmoth Blood', ['blood'], ['auxiliary'], ['night']),
        ing('en.cinder_dust', 'Cinder Dust', ['powder'], ['auxiliary'], ['fire']),
        ing('en.reed_sap', 'Reed Sap', ['juice'], ['auxiliary', 'solvent'], []),
        ing('en.nightbloom', 'Nightbloom', ['flower'], ['auxiliary'], ['night'])],
    formulas: [{id: 'test.9', name: 'Test Potion', name_cn: null, pathway: 'test', seq: 9, tier: {main: 'book', aux: 'wiki'}, slots: [
        {id: 'test.9.m1', role: 'main', qty: {n: 10, unit: 'ml'}, ref: 'en.glimmerfin_blood', alternates: [], tier: 'book',
            traits: {physical: ['blood'], functional: ['main_ingredient'], symbolic: ['sun', 'fire']}, traitsFrom: 'ingredient'},
        {id: 'test.9.a1', role: 'aux', qty: {n: 7, unit: 'drop'}, ref: 'en.reed_sap', alternates: ['en.nightbloom'], tier: 'wiki',
            traits: {physical: ['juice'], functional: ['auxiliary', 'solvent'], symbolic: []}, traitsFrom: 'ingredient'},
        {id: 'test.9.a2', role: 'aux', qty: {n: null, unit: null, stated: 'a large amount'}, ref: null, alternates: [], tier: 'wiki',
            traits: {physical: ['substance'], functional: ['auxiliary'], symbolic: ['night']}, traitsFrom: 'item_text'}]}],
    overrides: [{id: 'X9', formula: 'test.9', slot: 'test.9.a1', from: {n: 7, unit: 'drop'}, to: {n: 10, unit: 'ml'}, tier: 'book'}]};

test('catalogue builds materials with layered tags and parent expansion', () => {
    const lotm = buildLotmCatalogue(pack);
    assert.equal(Object.keys(lotm.catalogue.materials).length, 6);
    const tags = materialTags(lotm.catalogue, lotm.materialFor('en.glimmerfin_blood'));
    for(const t of ['blood', 'liquid', 'animal', 'sun', 'fire', 'main_ingredient']) assert.ok(tags.has(t), t);
    assert.equal(lotm.tagLayer('sun'), 'symbolic');
    assert.equal(lotm.catalogue.registry.get('sun').kind, 'symbolic_proposal');
    assert.equal(lotm.materialFor('en.missing'), null);
    assert.deepEqual(lotm.withTags(['night']), ['en.duskmoth_blood', 'en.nightbloom']);
});

test('slots keep stated units, apply overrides and expose selectors', () => {
    const lotm = buildLotmCatalogue(pack);
    const [m1, a1, a2] = lotm.slotsFor('test.9');
    assert.deepEqual(m1.qty, {n: 10, unit: 'ml'});
    assert.deepEqual(a1.qty, {n: 10, unit: 'ml'}, 'override replaces the wiki drop count');
    assert.equal(a1.override, 'X9');
    assert.equal(a1.tier, 'book');
    assert.equal(a2.qty.stated, 'a large amount');
    assert.deepEqual(a1.alternates, ['en.nightbloom']);
    assert.equal(a2.selector, null, 'a slot with only the substance fallback has no hard tag query');
    assert.deepEqual(m1.selector, {tags: 'blood'});
    assert.equal(matchesQuery(m1.selector.tags, materialTags(lotm.catalogue, lotm.materialFor('en.emberling_blood'))), true);
    assert.equal(matchesQuery(m1.selector.tags, materialTags(lotm.catalogue, lotm.materialFor('en.cinder_dust'))), false);
    assert.equal(lotm.overrides.length, 1);
});

test('substitutes rank by weighted trait fit, symbolic doubled', () => {
    const lotm = buildLotmCatalogue(pack);
    const result = lotm.substitutesFor('test.9.m1', Object.keys(lotm.catalogue.materials));
    assert.equal(result.ranked[0].id, 'en.glimmerfin_blood');
    assert.equal(result.ranked[0].score, 1);
    // Emberling: physical 1, functional 1, symbolic 1 of 2 (weight 2): (1+1+1)/4.
    const ember = result.ranked.find(r => r.id === 'en.emberling_blood');
    assert.equal(ember.score, 0.75);
    assert.deepEqual(ember.missing, ['sun']);
    assert.ok(result.ranked.indexOf(ember) > 0);
});

test('substitutes reject with reasons: no physical match and below the floor', () => {
    const lotm = buildLotmCatalogue(pack);
    const result = lotm.substitutesFor('test.9.m1', ['en.duskmoth_blood', 'en.cinder_dust', 'en.nightbloom', 'en.unknown']);
    const reason = id => result.rejected.find(r => r.id === id)?.reason;
    assert.match(reason('en.cinder_dust'), /no physical match, needs blood/);
    assert.match(reason('en.nightbloom'), /no physical match/);
    assert.match(reason('en.duskmoth_blood'), /below floor 0\.5, missing .*fire.*sun/, 'blood matches but the symbols are wrong');
    assert.match(reason('en.unknown'), /not in this catalogue/);
    assert.equal(result.ranked.length, 0);
    // A lower floor admits the same candidate.
    const loose = lotm.substitutesFor('test.9.m1', ['en.duskmoth_blood'], {floor: 0.2});
    assert.equal(loose.ranked[0].id, 'en.duskmoth_blood');
    assert.equal(DEFAULT_FLOOR, 0.5);
});

test('item-text slots rank on symbolic and functional fit alone', () => {
    const lotm = buildLotmCatalogue(pack);
    const result = lotm.substitutesFor('test.9.a2', ['en.nightbloom', 'en.cinder_dust']);
    assert.equal(result.ranked[0].id, 'en.nightbloom');
    assert.equal(result.ranked[0].score, 1);
    assert.equal(result.rejected[0].id, 'en.cinder_dust');
});

test('bad packs fail loudly', () => {
    assert.throws(() => buildLotmCatalogue({}), /vocab/);
    const bad = structuredClone(pack);
    bad.formulas[0].slots[0].traits.symbolic = ['nonexistent'];
    assert.throws(() => buildLotmCatalogue(bad), /unknown tag: nonexistent/);
    const dangling = structuredClone(pack);
    dangling.formulas[0].slots[0].ref = 'en.nope';
    assert.throws(() => buildLotmCatalogue(dangling), /unknown ingredient/);
});

// Optional: runs against the private local pack when present.
const PRIVATE = ['private_packs/lotm-ingredients/ingredients.json', '/Users/weiwei/code/yet-another-idle-rpg/private_packs/lotm-ingredients/ingredients.json'].find(f => fs.existsSync(f));
test('private pack: counts, units and book overrides', {skip: !PRIVATE && 'private pack not present'}, () => {
    const real = JSON.parse(fs.readFileSync(PRIVATE, 'utf8'));
    const lotm = buildLotmCatalogue(real);
    assert.ok(real.ingredients.length >= 291 && real.ingredients.length <= 294, `ingredients ${real.ingredients.length}`);
    assert.ok(real.formulas.length >= 170 && real.formulas.length <= 190, `formulas ${real.formulas.length}`);
    assert.ok(real.formulas.every(f => f.seq >= 2 && f.seq <= 9));
    const slot = id => lotm.slotFor(id);
    const rockWater = lotm.slotsFor('sun.5').find(s => s.override === 'X1');
    assert.deepEqual(rockWater.qty, {n: 10, unit: 'ml'});
    const bird = lotm.slotsFor('sun.4').find(s => s.override === 'X2');
    assert.deepEqual(bird.qty, {n: 60, unit: 'ml'});
    assert.ok(slot(bird.id));
    assert.ok(lotm.slotsFor('fool.9').some(s => s.qty?.unit === 'drop'), 'drops stay drops');
    const units = new Set(real.formulas.flatMap(f => f.slots.map(s => s.qty?.unit).filter(Boolean)));
    for(const u of units) assert.match(u, /^[a-z]+$/);
});
