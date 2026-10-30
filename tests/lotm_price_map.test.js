import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LOTM_PENCE} from '../src/book_world_lotm_ids.js';
import {mapLotmPrice, buildLotmPriceMap, traceLotmPrices} from '../src/lotm_price_map.js';

const price = (slug, zh) => ({id: `lotm.price.${slug}`, kind: 'price', zh});
const source = name => readFileSync(new URL(`../src/${name}.js`, import.meta.url), 'utf8');

test('exact currency quantities use native denominations, compounds and half pennies', () => {
    for (const [text, expected] of [['1苏勒', LOTM_PENCE.soli], ['一金镑', LOTM_PENCE.pound],
        ['3金镑10苏勒', 840], ['十二铜便士', 12], ['五个便士', 5], ['二分之一便士', 0.5],
        ['1.5便士', 1.5], ['5万镑', 12000000], ['一万二千镑', 2880000], ['0镑', 0]]) {
        const result = mapLotmPrice(price('fixture', text));
        assert.equal(result.status, 'mapped', text);
        assert.equal(result.pence, expected, text);
        assert.equal(result.inferred, false);
    }
});

test('stated ranges and inferred vague bands stay distinct and have no point value', () => {
    const explicit = mapLotmPrice(price('rent', '19苏勒到1镑18苏勒'));
    assert.deepEqual(explicit.bandPence, [228, 456]);
    assert.equal(explicit.inferred, false);
    assert.deepEqual(mapLotmPrice(price('range', '150到200镑')).bandPence, [36000, 48000]);
    const vague = mapLotmPrice(price('several-hundred-pounds', '几百镑'));
    assert.equal(vague.status, 'band-inferred');
    assert.equal(vague.pence, null);
    assert.equal(vague.inferred, true);
    assert.deepEqual(vague.bandPence, [48000, 216000]);
    assert.match(vague.basis, /not a stated bound/);
    assert.deepEqual(vague.gameRefs, []);
    assert.equal(mapLotmPrice(price('several-hundred-pounds', '300镑')).pence, 72000, 'stated wins over vague id');
});

test('ambiguous merged ids, weights, foreign coins and contextual numbers are gaps', () => {
    for (const row of [price('copper-penny', '4便士'), price('mutton-1lb', '1磅'), price('foreign', '5金币'),
        price('unknown-500', ''), price('ocr', '1oo镑'), price('vague', '两三百镑'), price('context', '一公里一便士'),
        price('shorthand', '一千五镑'), price('partial', '100镑或200镑'), price('duplicate', '1镑2镑'), price('reversed', '20到10镑')]) {
        const result = mapLotmPrice(row);
        assert.equal(result.status, 'unmapped', row.id);
        assert.equal(result.pence, null);
        assert.ok(result.reason);
        assert.deepEqual(result.gameRefs, []);
    }
});

test('trace requires an actual amount carrier; shared conversions do not consume every amount', () => {
    const registry = [price('amt-1-soli', '1苏勒'), price('weekly-total', '3镑'), price('amt-12-pound', '12镑'),
        price('half-penny-coin', '二分之一便士'), price('black-spot-frog', '170镑')];
    const before = JSON.stringify(registry);
    const traced = traceLotmPrices(registry, [source('book_world_lotm_ids'), source('book_world_lotm_broker'), source('book_world_lotm_lives')]);
    assert.ok(traced[0].gameRefs.some(ref => ref.id === 'LOTM_PENCE.soli'));
    assert.ok(traced[1].gameRefs.some(ref => ref.id.endsWith('contract.weeklyPence')));
    assert.ok(traced[2].gameRefs.some(ref => ref.id === 'marketLots.dose8.payment.pence'));
    assert.equal(traced[3].pence, 0.5);
    assert.deepEqual(traced[3].gameRefs, []);
    assert.deepEqual(traced[4].gameRefs, [], 'scaled game frog price is not the canon frog amount');
    assert.ok(traceLotmPrices(registry, '12 240 720 2880').every(row => row.gameRefs.length === 0));
    assert.equal(JSON.stringify(registry), before);
    const mapped = buildLotmPriceMap([...registry, {kind: 'person', id: 'lotm.person.fixture'}]);
    assert.equal(mapped.length, registry.length);
    mapped[0].gameRefs[0].id = 'changed';
    assert.equal(mapLotmPrice(registry[0]).gameRefs[0].id, 'LOTM_PENCE.soli');
});
