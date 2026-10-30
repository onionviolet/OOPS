import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText} from '../src/ui/figure.js';
import {familyFigureSpec, familyFanSpec, familyPeople, successionRows, MAX_PER_ROW} from '../src/family_figure.js';
import {foundLine, heirLine} from '../src/lineage_traits.js';
import {heirLaw, resolveHeir} from '../src/heir_inheritance.js';
import {FAMILY_FIXTURES, HOUSEHOLD_PROJECTION, STRANGER_PROJECTION} from '../src/ui/preview/fixtures/family_tree.js';

const labels = spec => spec.nodes.map(n => n.label);

test('a fresh line draws known parents, unknown grandparents and you, and nothing invented', () => {
    const spec = familyFigureSpec({line: foundLine('42'), succession: null});
    assert.deepEqual(labels(spec).sort(), ['Father', "Father's father", "Father's mother", 'Mother', "Mother's father", "Mother's mother", 'You'].sort());
    const byLabel = Object.fromEntries(spec.nodes.map(n => [n.label, n]));
    assert.equal(byLabel.Father.state, undefined, 'known people draw plain, with no state word in the text');
    assert.equal(byLabel.Father.glyph, 'F');
    assert.equal(byLabel.Father.role, 'ancestor');
    assert.equal(byLabel["Mother's mother"].state, 'unknown');
    assert.equal(byLabel.You.state, 'active');
    assert.ok(byLabel.Father.at[1] < byLabel.You.at[1] && byLabel["Father's father"].at[1] < byLabel.Father.at[1], 'older generations sit higher');
    assert.ok(byLabel["Father's father"].at[0] < byLabel["Mother's father"].at[0], "father's side stays left");
    assert.match(figureText(spec), /Only what you know: 2 known, 4 unknown\./);
    assert.doesNotMatch(figureText(spec), /filled/);
});

test('after an heir the old life becomes a parent and the founding parents become grandparents', () => {
    const next = heirLine(foundLine('7'), {at: 0, tag: 'end'});
    const {people} = familyPeople({line: next});
    const gens = Object.fromEntries(people.map(p => [p.word, p.gen]));
    assert.equal(people.filter(p => p.gen === -1).length, 2);
    assert.equal(people.filter(p => p.gen === -2 && p.grade === 'known').length, 2, 'the founding parents are now known grandparents');
    assert.equal(gens.You, 0);
    // The heir's other parent was never tracked, so it is drawn as guessed, not as a stored name.
    assert.deepEqual(people.filter(p => p.gen === -1).map(p => p.grade).sort(), ['guessed', 'known']);
});

test('a seat that knows less never carries a stored name into the drawing or its text', () => {
    const line = {selfId: 'self', members: [{id: 'father', name: 'Hollis Brack', sex: 'm', sire: null, dam: null}, {id: 'mother', name: 'Neve Brack', sex: 'f', sire: null, dam: null},
        {id: 'self', name: 'You', sex: 'm', sire: 'father', dam: 'mother'}]};
    const full = figureText(familyFigureSpec({line}));
    assert.match(full, /Hollis Brack/);
    const knows = key => ({'family.raised': false, 'family.f': 'unknown'})[key];
    const text = figureText(familyFigureSpec({line}, {knows}));
    assert.doesNotMatch(text, /Hollis|Neve/);
    assert.match(text, /Father \(guessed\)/);
    assert.match(text, /Mother \(unknown\)/);
});

test('the drawn heir is the one the inheritance law would name at life end', () => {
    const kin = [{id: 'kin:0', name: 'Bree', relation: 'child', sex: 'f', age: 24, adult: true}, {id: 'kin:1', name: 'Odo', relation: 'child', sex: 'm', age: 20, adult: true},
        {id: 'kin:2', name: 'Lune', relation: 'spouse', sex: 'f', age: 50, adult: true}];
    const law = heirLaw('primogeniture'), verdict = resolveHeir(law, kin);
    const spec = familyFigureSpec({line: foundLine('1'), kin, succession: {law: 'Primogeniture', reason: law.reason, heirId: verdict.heir.id, heirName: verdict.heir.name}});
    const heir = spec.edges.find(e => e.kind === 'heir');
    assert.equal(heir.to, verdict.heir.id);
    assert.match(figureText(spec), new RegExp(`${verdict.heir.name} would inherit`));
});

test('crowded generations fold into a note instead of overlapping', () => {
    const kin = Array.from({length: MAX_PER_ROW + 3}, (_, i) => ({id: `kin:${i}`, name: `Kid ${i}`, relation: 'child', age: 5}));
    const spec = familyFigureSpec({line: foundLine('3'), kin});
    assert.equal(spec.nodes.filter(n => n.label.startsWith('Child')).length, MAX_PER_ROW);
    assert.ok(spec.notes.some(n => /3 more in generation \+1/.test(n.text)));
});

test('gallery fixtures render through the one figure renderer with their text form', () => {
    for (const spec of FAMILY_FIXTURES) {
        const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
        const host = dom.document.getElementById('host');
        const {text} = renderFigure(host, spec, {text: true});
        assert.equal(host.querySelector('pre.fig-text').textContent, text);
        assert.ok(text.includes(spec.title));
    }
    assert.match(figureText(FAMILY_FIXTURES[0]), /Lives in this line, 2 of 3 done/);
    assert.match(figureText(FAMILY_FIXTURES[0]), /Heirloom: Ashdown pewter lamp/);
    assert.ok(HOUSEHOLD_PROJECTION.kin.length && STRANGER_PROJECTION.line.members.length === 3);
});

test('succession reads as a ranked list and the note names who comes next', () => {
    const order = [{id: 'kin:0', name: 'Bree', why: 'eldest child'}, {id: 'kin:1', name: 'Odo', why: 'eldest child'}];
    assert.deepEqual(successionRows({order}).map(r => r.rank), [1, 2]);
    const kin = [{id: 'kin:0', name: 'Bree', relation: 'child', age: 24}, {id: 'kin:1', name: 'Odo', relation: 'child', age: 20}];
    const spec = familyFigureSpec({line: foundLine('5'), kin, succession: {law: 'Primogeniture', reason: 'r.', order, heirId: 'kin:0', heirName: 'Bree'}});
    assert.match(figureText(spec), /Bree would inherit, then Odo\./);
    assert.equal(spec.nodes.find(n => n.id === 'kin:0').role, 'heir');
});

test('the fan form gives every ancestor a fixed slot, father\'s side left, gaps as empty places', () => {
    const fan = familyFanSpec({line: foundLine('9')});
    assert.deepEqual(fan.rings.map(r => r.slots), [2, 4]);
    assert.equal(fan.slots.filter(s => s.state === 'empty').length, 4);
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    renderFigure(host, fan);
    const cx = id => +host.querySelector(`[data-id="${id}"] .fig-body`).getAttribute('cx');
    const centre = cx('self');
    assert.ok(cx('m:father') < centre && cx('m:mother') > centre);
    assert.ok(cx('u:m.m') < centre && cx('u:f.f') > centre);
});
