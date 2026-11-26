import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
import {mergePersonReaderDetails} from '../prototypes/world-atlas/people-details.mjs';
import {personReaderDetailSections} from '../prototypes/world-atlas/people-detail-views.mjs';
import {createDom} from '../scripts/headless/dom.mjs';

const id = 'w.person.guide', friend = 'w.person.clerk';
const person = {id, label: 'T', locator: 'en b1 c1 p5', wants: ['Keep the market safe'],
    routine: [{what: 'Check tickets', until: 'the fair ends', label: 'S', locator: 'en b1 c1 p5'}],
    relations: [{with: friend, kind: 'Colleagues', basis: 'They divide the fares', label: 'I', locator: 'en b1 c1 p5'}],
    reacts: [{to: 'Someone refuses the fare', response: 'Calls the clerk', by: friend, class: 'refuse', responseClass: 'speak', label: 'I', locator: 'en b1 c1 p5'}]};

test('people fold sourced wants, reaction condition and response, routine end and tie basis without losing evidence', () => {
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', people: [person, person]}]});
    const p = d.entities.find(r => r.id === id);
    assert.deepEqual(p.wants, [{what: 'Keep the market safe', label: 'T', locator: 'en b1 c1 p5'}]);
    assert.equal(p.reacts.length, 1);
    assert.deepEqual(p.reacts[0], person.reacts[0]);
    assert.equal(p.routine[0].until, 'the fair ends');
    assert.equal(p.relations[0].basis, 'They divide the fares');
    const changed = {...person, label: 'I', locator: 'en b1 c2 p4', relations: person.relations.map(r => ({...r, label: 'T', locator: 'en b1 c2 p4'}))};
    const merged = digestWorld({world: 'w', shards: [{prefix: 'a', people: [person]}, {prefix: 'b', people: [changed]}]}).entities.find(r => r.id === id);
    assert.equal(merged.relations.length, 2, 'inferred and stated ties keep their separate evidence');
    assert.equal(merged.wants.length, 2, 'different provenance is retained rather than silently resolving conflicting readings');
});

test('people detail projection omits sealed/private rows and blocked references, and whitelists bounded summary fields', () => {
    const target = {};
    mergePersonReaderDetails(target, {...person, knows: [{fact: 'PRIVATE_KNOWLEDGE'}], rawSource: 'RAW_SOURCE',
        wants: [...person.wants, 'unstated'], reacts: [...person.reacts,
            {to: 'SEALED_CONDITION', response: 'SEALED_RESPONSE', sealed: ['s1']},
            {to: 'PRIVATE_CONDITION', scope: 'private'}, {to: 'BLOCKED_CONDITION', by: 'w.person.hidden'}]}, {blockedIds: new Set(['w.person.hidden'])});
    mergePersonReaderDetails(target, {wants: ['PRIVATE_ROW'], private: true});
    assert.doesNotMatch(JSON.stringify(target), /PRIVATE|SEALED|BLOCKED|RAW_SOURCE|hidden/);
    assert.equal(target.wants.length, 1);
    const unknown = mergePersonReaderDetails({}, {wants: ['A goal'], locator: 'bad locator'});
    assert.equal(unknown.wants[0].locator, null);
});

test('people DOM distinguishes inference, matched and unmatched refs, and missing older fields', () => {
    const document = createDom().document;
    const el = (tag, value) => {const node = document.createElement(tag); if (value) node.textContent = value; return node;};
    const section = (title, rows, empty) => {const node = el('section'); node.append(el('h3', title)); if (!rows.length) node.append(el('p', empty)); for (const row of rows) {const p = el('p'); p.append(...row); node.append(p);} return node;};
    const link = ref => {const node = el('a', 'The clerk'); node.href = '#world/w/things/' + ref; return node;};
    const p = mergePersonReaderDetails({}, person);
    p.reacts.push({to: 'A second condition', response: 'A response', by: 'w.person.missing', label: 'U'});
    const node = el('div'); node.append(...personReaderDetailSections(p, {el, section, link, matched: ref => ref === friend}));
    assert.match(node.textContent, /Wants and aims.*Keep the market safe.*Stated.*Reactions.*Calls the clerk.*Inference/);
    assert.equal(node.querySelectorAll('a').length, 1);
    assert.match(node.textContent, /w.person.missing \(reference not matched\).*Unsettled/);
    assert.doesNotMatch(node.textContent, /undefined|null/);
    const older = el('div'); older.append(...personReaderDetailSections({}, {el, section, link, matched: () => false}));
    assert.match(older.textContent, /No wants recorded.*No reaction conditions or outcomes recorded/);
});
