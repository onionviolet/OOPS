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
    assert.match(host.textContent, /Unknown to you: its numbers/); assert.match(host.textContent, /quality unknown/);
    assert.doesNotMatch(host.textContent, /Defense/);
    const measured = draw(model('measured')); assert.match(measured.textContent, /Defense/);
    assert.match(measured.textContent, /Unknown to you: where it came from/, 'a measured reader still cannot see the past');
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

test('PS248: the sheet reads affixes as the life knows them and lists where the item can go', () => {
    const item = {equip_slot: 'torso', quality: 80, getName: () => 'Coat', getAttack: () => 0, getDefense: () => 2, getShieldStrength: () => 0, getStats: () => ({}),
        affixes: [{id: 'armor.reinforced', v: 2}, {id: 'armor.padded', v: 0.02}], gearwork: {roles: {external: {name: 'Wolf hide'}}}};
    const m = itemCardModel(item, null, {rarity: 'rare', wearFactor: 0.6});
    assert.equal(m.affixes[0].text, 'Defense +2, rolls 1.5–4.5');
    assert.equal(m.affixes[1].text, 'Damage taken −2% (less taken), rolls 1.5%–4.5%');
    assert.deepEqual(m.verbs.map(v => v.id), ['wear', 'repair', 'reforge', 'salvage', 'sell']);
    const unread = itemCardModel(item, null, {rarity: 'rare', level: 'AP2'});
    assert.deepEqual(unread.affixes.map(a => [a.known, a.name]), [[false, '?'], [false, '?']], 'unread stats: one "?" row per affix, never a zero');
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>');
    const root = renderItemCard(dom.document.getElementById('h'), m);
    assert.match(root.textContent, /In its make.*Reinforced: Defense \+2, rolls 1\.5–4\.5/);
    assert.match(root.textContent, /Where it can go.*Repair · at the Gear workshop/);
});

test('PS249: the sheet draws the workshop reroll preview, with "?" spans when the make is unread, and opens the bench', () => {
    const preview = {kind: 'reroll', target: {id: 'armor.nimble', v: .02, name: 'Nimble'}, stays: [{id: 'armor.vital', v: .03}], quality: 150, parts: [], history: 0,
        band: [.125, 1], factors: [{id: 'skill', label: 'Forging 4 at a tier 1 forge', effect: 'the worst a new mark can be is 13% of its range'}],
        pool: [{id: 'armor.reinforced', name: 'Reinforced', chance: .5, lo: 1.5, hi: 4.5, min: 1.5, max: 4.5}]};
    let opened = 0;
    const m = {...model('affixed'), reforge: {preview, known: false, cost: [{name: 'Iron ingot', count: 1}], open: () => opened++}};
    const host = draw(m), sec = host.querySelector('[data-role="reforge"]');
    assert.match(sec.textContent, /Stays.*Vital 3%/s);
    assert.match(sec.textContent, /Rerolled: Nimble 2%/);
    assert.match(sec.querySelector('.kit-row[data-affix="armor.reinforced"]').textContent, /50% chance · lands \?/);
    assert.match(sec.textContent, /Costs 1 Iron ingot.*paid whatever lands/s);
    sec.querySelector('[data-reforge-open]').click(); assert.equal(opened, 1);
    const refused = draw({...model('affixed'), reforge: {preview: null, reason: 'A local crafting station is needed for this process.', open: null}});
    assert.match(refused.querySelector('[data-role="reforge"]').textContent, /crafting station is needed/);
});

test('PS292: the card body is drawn by the kit: chips and rows are kit forms, and the kit releases the host document afterwards', () => {
    const host = draw(model('upgrade'));
    assert.ok(host.querySelector('.item-card-chip.kit-chip[data-role="slot"]'), 'the slot chip is a kit chip');
    const rows = host.querySelectorAll('.item-card-rows > .kit-row.item-card-row');
    assert.equal(rows.length, model('upgrade').rows.length);
    assert.ok(rows[0].dataset.direction && rows[0].querySelector('.item-card-value') && rows[0].querySelector('.item-card-delta'), 'each row keeps its direction, number and change');
    assert.equal(host.querySelector('.item-card-rows').getAttribute('role'), 'list');
    assert.equal(host.querySelector('table'), null, 'no table of its own');
});
