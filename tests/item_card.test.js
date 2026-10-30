import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {itemCardModel} from '../src/item_card_model.js';
import {renderItemCard} from '../src/ui/item_card.js';
import {ITEM_CARD_FIXTURES} from '../src/ui/preview/item_card_fixtures.js';

const fx = id => ITEM_CARD_FIXTURES.find(f => f.id === id);
const model = id => itemCardModel(fx(id).item, fx(id).worn, fx(id).info);
const draw = m => { const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>'); const host = dom.document.getElementById('h'); renderItemCard(host, m); return host; };

test('an empty slot compares through the same readers, with words for direction', () => {
    const m = model('first-gear'), defense = m.rows.find(r => r.id === 'defense');
    assert.equal(m.worn, null);
    assert.equal(defense.delta, 2); assert.match(defense.words, /gained/);
    const text = draw(m).textContent;
    assert.match(text, /Nothing worn in torso/); assert.match(text, /trash · 40%/i);
});

test('lower-is-better stats read as better when they fall, and say so', () => {
    const row = model('upgrade').rows.find(r => r.id === 'damage_taken');
    assert.equal(row.direction, 'better'); assert.match(row.words, /lower takes less damage/);
    assert.equal(model('upgrade').rows.find(r => r.id === 'agility').direction, 'worse');
});

test('appraisal hides facets as unknown, never as zero', () => {
    const glance = model('unappraised'), host = draw(glance);
    assert.equal(glance.facets.stats, 'unknown'); assert.equal(host.querySelector('.item-card-rows'), null);
    assert.match(host.textContent, /beyond what you can read/); assert.match(host.textContent, /quality unknown/);
    assert.doesNotMatch(host.textContent, /Defense/);
    const measured = draw(model('measured')); assert.match(measured.textContent, /Defense/);
    assert.match(measured.textContent, /hidden from you/, 'a measured reader still cannot see the past');
});

test('provenance lists recorded work and parts, and admits when nothing is recorded', () => {
    assert.deepEqual(model('upgrade').trail.map(t => t.kind), ['work', 'work', 'part']);
    assert.match(draw(model('upgrade')).textContent, /Reforge by old craftsman/);
    assert.match(draw(model('first-gear')).textContent, /No maker or past is recorded/);
});

test('condition appears only when wear is tracked, with a word', () => {
    assert.equal(model('first-gear').condition, null);
    assert.equal(model('upgrade').condition.text, 'badly worn');
});

test('non-equipment has no card', () => { assert.equal(itemCardModel({getName: () => 'Bread'}), null); });
