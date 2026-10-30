import test from 'node:test';
import assert from 'node:assert/strict';
import {characterSheetView, characterSheetText} from '../src/character_sheet.js';
import {renderCharacterSheet} from '../src/ui/character_sheet_view.js';
import {observerView} from '../src/observer_view.js';
import {SHEET_PLAYER, SHEET_PERSON, SHEET_READS} from '../src/ui/preview/fixtures/character_sheet.js';

class Element {
    constructor(tag, doc) { this.tagName = tag; this.ownerDocument = doc; this.dataset = {}; this.attrs = {}; this.children = []; this.className = ''; this._text = ''; }
    get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
    set textContent(v) { this._text = v; this.children = []; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    append(...nodes) { for (const n of nodes) this.children.push(typeof n === 'string' ? Object.assign(new Element('#text', this.ownerDocument), {_text: n}) : n); }
    replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
    find(pred, out = []) { for (const c of this.children) { if (pred(c)) out.push(c); c.find(pred, out); } return out; }
    // Everything a secondary channel could carry (AA13): text, classes, data-*, attributes.
    dump() { return [this._text, this.className, JSON.stringify(this.dataset), JSON.stringify(this.attrs), ...this.children.map(c => c.dump())].join('|'); }
}
const makeDocument = () => { const doc = {createElement: tag => new Element(tag, doc)}; return doc; };
const read = id => SHEET_READS.find(r => r.id === id).read;
const observer = observerView({});
const other = (...ids) => characterSheetView(SHEET_PERSON, observer, ids.map(read), {compareTo: SHEET_PLAYER});
const section = (view, id) => view.sections.find(s => s.id === id);
const draw = view => { const doc = makeDocument(), host = new Element('div', doc); renderCharacterSheet(host, view, {text: true}); return host; };

test('a rough read hides exact values in the view, the text form and every DOM channel', () => {
    const rough = other('appraise-low');
    // The ceiling: she ranks above a rank-1 appraiser, so the read falls to a relative sense.
    assert.equal(rough.reads.at(-1).level, 2);
    assert.deepEqual(section(rough, 'stats').rows.map(r => [r.label, r.text, r.state]), [['Overall', 'far beyond you', 'guessed']]);
    const banded = other('sense', 'introduced');
    const precise = characterSheetView(SHEET_PERSON, observer, [{means: 'appraise', label: 'Appraise', level: 3, precision: 1}], {compareTo: SHEET_PLAYER});
    const magic = section(precise, 'stats').rows.find(r => r.id === 'magic');
    // Bands snap to a grid so the midpoint never equals the truth (38 → 35 to 39).
    assert.equal(magic.text, '35 to 39'); assert.equal(magic.state, 'guessed');
    for (const view of [rough, banded, precise]) {
        const all = JSON.stringify(view) + characterSheetText(view) + draw(view).dump();
        for (const exact of ['38', '"23"', 'Ash-sight', 'Soot cough', 'Bound by an old debt', 'ashsight', 'cough', 'debt']) assert.ok(!all.includes(exact), `${exact} leaked`);
    }
});

test('deeper reads turn rough reads into exact numbers and hidden traits', () => {
    const exact = other('appraise');
    assert.equal(section(exact, 'stats').rows.find(r => r.id === 'magic').text, '38');
    assert.equal(exact.level, '23');
    const abilities = section(exact, 'abilities').rows;
    assert.ok(abilities.some(r => r.label === 'Lampcraft' && r.text === 'Level 6 · warden'));
    // A power outside the read's schema shows as ??? and never by name or id.
    assert.ok(abilities.some(r => r.label === '???' && r.state === 'unknown'));
    assert.ok(!JSON.stringify(abilities).includes('Grey pact') && !JSON.stringify(abilities).includes('Ash-sight'));
    const soul = other('appraise', 'soul');
    const names = section(soul, 'abilities').rows.map(r => r.label);
    assert.ok(names.includes('Ash-sight') && names.includes('Grey pact') && !names.includes('???'));
    assert.ok(section(soul, 'traits').rows.some(r => r.label === 'Bound by an old debt'));
});

test('unknown, guessed and known stay distinct; undetected rows leave no count', () => {
    const glance = other();
    assert.equal(glance.title, 'Someone you have not identified');
    assert.deepEqual(section(glance, 'abilities').rows, [{id: 'unread', label: 'Abilities and powers', state: 'unknown', text: 'Not read. A closer look or another means could tell more.'}]);
    // Someone with no abilities at all reads the same as someone with four.
    const blank = characterSheetView({...SHEET_PERSON, abilities: []}, observer, [], {compareTo: SHEET_PLAYER});
    assert.deepEqual(section(blank, 'abilities'), section(glance, 'abilities'));
    // A concealed knife needs a listing read; the open lamp shows at a glance.
    assert.deepEqual(section(glance, 'gear').rows.map(r => r.id), ['lamp']);
    const fate = other('divination');
    assert.ok(section(fate, 'intent').rows.every(r => r.state === 'guessed'));
    const text = characterSheetText(fate);
    assert.match(text, /\[guessed\]/); assert.match(text, /\[unknown\]/);
    const host = draw(fate);
    const states = new Set(host.find(n => n.className === 'cs-row' || n.className === 'cs-unread').map(n => n.dataset.state));
    assert.deepEqual([...states].sort(), ['guessed', 'known', 'unknown']);
    // Every non-known row carries a word beside its mark (UR37).
    for (const row of host.find(n => (n.className === 'cs-row' || n.className === 'cs-unread') && n.dataset.state !== 'known')) assert.ok(row.find(n => n.className === 'cs-state').length === 1);
});

test('a scoped read reads only its sections, and learned facts come from the observer', () => {
    const doc = other('physician');
    assert.ok(section(doc, 'conditions').rows.some(r => r.label === 'Soot cough'));
    // A conditions-only read says nothing about her level, in the header or anywhere else.
    assert.equal(doc.level, null);
    assert.equal(doc.title, 'Someone you have not identified'); assert.equal(doc.kind, '');
    assert.equal(other('introduced', 'physician').title, 'Edda Marrow');
    assert.equal(other('sense', 'physician').level, 'far beyond you');
    assert.equal(section(doc, 'stats').rows[0].state, 'unknown');
    assert.ok(!JSON.stringify(section(doc, 'traits')).includes('old debt'));
    const told = observerView({simulation: {knowledge: {player: {'person.edda.name': {value: 'Edda Marrow'}}}}});
    const named = characterSheetView({...SHEET_PERSON, traits: [{id: 'patient', label: 'Patient', knowKey: 'person.edda.patient'}]}, told, []);
    assert.equal(named.title, 'Edda Marrow');
    const learned = observerView({simulation: {knowledge: {player: {'person.edda.patient': {value: 'Waits things out'}}}}});
    const trait = section(characterSheetView({...SHEET_PERSON, traits: [{id: 'patient', label: 'Patient', knowKey: 'person.edda.patient'}]}, learned, []), 'traits').rows[0];
    assert.deepEqual([trait.label, trait.state, trait.basis], ['Patient', 'known', 'You learned this']);
});

test('your own sheet is exact on native stats but blind to hidden layers, in any seat', () => {
    for (const seat of [observerView({}), observerView({lotm: {entryProfile: 'lotm.early_tingen.fixture'}})]) {
        const self = characterSheetView(SHEET_PLAYER, seat, []);
        assert.equal(self.title, 'You'); assert.ok(self.self);
        assert.equal(section(self, 'stats').rows.find(r => r.id === 'agility').text, '11.2');
        assert.ok(!JSON.stringify(self).includes('Old unease'));
        assert.ok(!self.sections.some(s => s.id === 'between'));
    }
    // The same person seen from a seat whose actor is not the subject is "other", never self.
    assert.equal(characterSheetView({...SHEET_PLAYER, id: 'lead'}, observer, []).self, false);
});

test('a met person in People you know gets the same sheet, read only from what you learned', async () => {
    const {subjectFromKnownPerson, MET_READ} = await import('../src/character_sheet_people.js');
    const view = characterSheetView(subjectFromKnownPerson({id: 'elder', name: 'Village elder', location: 'Last known: Village', details: ['You kept your promise.'], memories: [{id: 'm1', text: 'Shared a meal.'}]}), observer, [MET_READ]);
    assert.equal(view.title, 'Village elder');
    assert.deepEqual(section(view, 'between').rows.map(r => r.text), ['Last known: Village', 'You kept your promise.', 'Shared a meal.']);
    assert.equal(section(view, 'stats').rows[0].id, 'unread');
});

test('narrow layout stacks sections as disclosures and opens only read ones', () => {
    const doc = makeDocument(), host = new Element('div', doc);
    renderCharacterSheet(host, other('introduced'), {layout: 'narrow'});
    const boxes = host.find(n => n.className === 'cs-section');
    assert.ok(boxes.every(b => b.tagName === 'details'));
    assert.equal(boxes.find(b => b.dataset.section === 'appearance').open, true);
    // Unread sections fold into one line instead of six empty boxes.
    assert.ok(!boxes.some(b => b.dataset.section === 'stats'));
    assert.match(host.find(n => n.className === 'cs-unread')[0].textContent, /Not read yet: Stats, Abilities and powers/);
});

test('a row marked guess shows as guessed even under a plain read (L13 sheet bridge, G10)', () => {
    const subject = {id: 'x', name: 'X', gear: [{id: 'g1', label: 'Lamp', value: 'brass'}, {id: 'g2', label: 'Knife', value: 'long', guess: true}]};
    const view = characterSheetView(subject, observerView({}), [{means: 'eye', label: 'Looking', level: 9, precision: 3}]);
    const gear = view.sections.find(s => s.id === 'gear').rows;
    assert.equal(gear.find(r => r.id === 'g1').state, 'known');
    assert.equal(gear.find(r => r.id === 'g2').state, 'guessed');
});
