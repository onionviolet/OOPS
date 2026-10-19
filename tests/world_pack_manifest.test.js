import test from 'node:test';
import assert from 'node:assert/strict';
import {validateWorldPack, fingerprintWorldPack, namespacesOverlap} from '../src/world_pack_manifest.js';
import {makeSchoolPack, makeRulebookPack, SEALED_TEST_TERM} from './world_pack_school_fixture.js';

const fatalCode = raw => {const v = validateWorldPack(raw); assert.equal(v.fatal, true); return v.diagnostics.at(-1).code;};

test('the synthetic school and rulebook packs validate without local errors', () => {
    for (const raw of [makeSchoolPack(), makeRulebookPack()]) {
        const v = validateWorldPack(raw);
        assert.equal(v.fatal, false);
        assert.deepEqual(v.diagnostics, []);
        assert.equal(v.dormant.size, 0);
    }
});

test('header problems make the whole pack dormant', () => {
    assert.equal(fatalCode({...makeSchoolPack(), format: 'other'}), 'format');
    assert.equal(fatalCode({...makeSchoolPack(), formatVersion: 2}), 'format-version');
    assert.equal(fatalCode({...makeSchoolPack(), surprise: 1}), 'header-fields');
    assert.equal(fatalCode({...makeSchoolPack(), revision: 0}), 'header');
    assert.equal(fatalCode({...makeSchoolPack(), budgets: {entities: 10}}), 'budgets');
    assert.equal(fatalCode({...makeSchoolPack(), budgets: {...makeSchoolPack().budgets, entities: 1.5}}), 'non-integer');
    assert.equal(fatalCode({...makeSchoolPack(), sourceSnapshot: undefined}), 'not-json');
    const {sourceSnapshot, ...noSnapshot} = makeSchoolPack();
    assert.equal(fatalCode(noSnapshot), 'source-snapshot');
    assert.equal(fatalCode({...makeSchoolPack(), kind: 'generated'}), 'generator');
    assert.equal(fatalCode({...makeSchoolPack(), requires: {packs: [{id: 'test.school', minRevision: 1}]}}), 'self-dependency');
});

test('attribution travels with the pack and private research never ships', () => {
    const pack = makeSchoolPack();
    assert.equal(fatalCode({...pack, attribution: {source: 'x', licence: 'private-research', notice: 'n'}}), 'licence-refused');
    assert.equal(fatalCode({...pack, attribution: {source: 'x', licence: 'mystery', notice: 'n'}}), 'licence');
    assert.equal(fatalCode({...pack, attribution: {licence: 'original'}}), 'attribution');
});

test('bad records go dormant one at a time, not the whole pack', () => {
    const pack = makeSchoolPack();
    pack.content.catalog.push({id: 'other.pack.thing', label: 'Stray', kind: 'item'});
    pack.content.catalog.push({id: 'test.school.cat.academy', label: 'Duplicate', kind: 'item'});
    pack.content.people.push({id: 'test.school.person.old_headmaster', name: 'Back again'});
    pack.content.people.push({id: 'test.school.person.blank', name: ''});
    const v = validateWorldPack(pack);
    assert.equal(v.fatal, false);
    assert.equal(v.dormant.get('other.pack.thing'), 'namespace');
    assert.equal(v.dormant.get('test.school.cat.academy'), 'duplicate-id');
    assert.equal(v.records.has('test.school.cat.academy'), false, 'both duplicates are withheld');
    assert.equal(v.dormant.get('test.school.person.old_headmaster'), 'retired-reuse');
    assert.equal(v.dormant.get('test.school.person.blank'), 'shape');
    assert.ok(v.records.has('test.school.person.ada'));
});

test('sealed terms in player text dorm that record and diagnostics name only the secret ID', () => {
    const pack = makeSchoolPack();
    pack.content.areas.find(a => a.id === 'test.school.area.library').label = `Library above the ${SEALED_TEST_TERM}`;
    const v = validateWorldPack(pack);
    assert.equal(v.dormant.get('test.school.area.library'), 'sealed-text');
    const report = JSON.stringify(v.diagnostics);
    assert.ok(report.includes('test.school.secret.s1'));
    assert.equal(report.toLowerCase().includes(SEALED_TEST_TERM), false);
    const header = validateWorldPack({...makeSchoolPack(), title: `The ${SEALED_TEST_TERM}`});
    assert.equal(header.fatal, true);
    assert.equal(JSON.stringify(header.diagnostics).toLowerCase().includes(SEALED_TEST_TERM), false);
});

test('fingerprint ignores display text and tracks rules, slots and budgets', () => {
    const base = fingerprintWorldPack(makeSchoolPack());
    const typo = makeSchoolPack(); typo.content.areas[0].label = 'Front gates'; typo.title = 'Test School';
    assert.equal(fingerprintWorldPack(typo), base);
    const rule = makeSchoolPack(); rule.provides.ruleProfiles[0].directorPolicy = 'chaotic';
    assert.notEqual(fingerprintWorldPack(rule), base);
    const slot = makeSchoolPack(); slot.content.slots[0].table.traits[0].weight = 3;
    assert.notEqual(fingerprintWorldPack(slot), base);
});

test('cohort slots declare enough draws for one member and well-formed tables', () => {
    const pack = makeSchoolPack(); pack.content.slots[0].budget.maxDrawsPerEntity = 3;
    assert.equal(validateWorldPack(pack).dormant.get('test.school.slot.students'), 'shape');
    const empty = makeSchoolPack(); empty.content.slots[0].table.given = [];
    assert.equal(validateWorldPack(empty).dormant.get('test.school.slot.students'), 'shape');
});

test('rule profiles need a ruling status for every module', () => {
    const pack = makeRulebookPack(); delete pack.provides.ruleProfiles[0].rulings['test.rulebook.mod.base_check'];
    assert.equal(fatalCode(pack), 'rule-profile');
});

test('pack namespaces may not nest', () => {
    assert.equal(namespacesOverlap('book.mol', 'book.mol.extra'), true);
    assert.equal(namespacesOverlap('book.mol', 'book.molten'), false);
});
