import test from 'node:test';
import assert from 'node:assert/strict';
import {loadWorldPacks} from '../src/world_pack_loader.js';
import {createPopulation} from '../src/world_pack_population.js';
import {emptyWorldPackSaves, createSection, validateSection, createMigrationRegistry, reconcileWorldPackSaves,
    revealPerson, personView, freezeEdge, addException, savedExceptions, sectionBytes} from '../src/world_pack_save.js';
import {makeSchoolPack, makeRulebookPack, fakeRuleAdapter, FEATURES, cohortId} from './world_pack_school_fixture.js';

const DAY = 1440, INSTANCE = 'test.school.main', ADA = 'test.school.person.ada';
const registryFor = (options = {}, extra = []) => loadWorldPacks([makeSchoolPack(options), makeRulebookPack(), ...extra], {features: FEATURES, ruleAdapter: fakeRuleAdapter});
const setup = (options = {}) => {
    const registry = registryFor(options), loaded = registry.packs.get('test.school');
    return {registry, loaded, pop: createPopulation(loaded, {root: 42, instanceId: INSTANCE})};
};
// What a save/reload/import does to the section: JSON out and back.
const roundTrip = value => JSON.parse(JSON.stringify(value));
const STUDENT = `${cohortId(4, 'cedar')}.m2`;

function playedSection() {
    const {loaded, pop} = setup();
    let s = createSection(loaded);
    s = revealPerson(s, pop, STUDENT);
    s = revealPerson(s, pop, ADA, {rung: 'known'});
    s = freezeEdge(s, pop, ADA, `${cohortId(3, 'ash')}.m1`);
    s = addException(s, pop, {id: 'test.school.save.tutor', kind: 'quest', personId: STUDENT, placeId: 'test.school.area.library', start: 20 * DAY, end: 21 * DAY});
    return s;
}

test('a section holds only the delta and survives save, reload and import', () => {
    const {registry, loaded, pop} = setup();
    const empty = createSection(loaded);
    assert.deepEqual(empty, {packId: 'test.school', packRevision: 1, schema: 1, delta: {instances: {}, retired: {}}});
    const s = playedSection();
    assert.deepEqual(Object.keys(s.delta.instances[INSTANCE].people).sort(), [ADA, STUDENT].sort());
    assert.equal(s.delta.instances[INSTANCE].people[ADA].rung, 'known');
    assert.equal(validateSection(s, loaded), s);
    const saves = {...emptyWorldPackSaves(), sections: {'test.school': s}};
    const {saves: back, dormant} = reconcileWorldPackSaves(roundTrip(saves), registry);
    assert.deepEqual(dormant, []);
    assert.deepEqual(back, saves);
    assert.deepEqual(personView(pop, back.sections['test.school'], STUDENT), personView(pop, s, STUDENT));
    assert.equal(pop.presenceAt(STUDENT, 20 * DAY + 545, {extra: savedExceptions(back.sections['test.school'], pop)}).source, 'quest');
    assert.equal(pop.relation(ADA, `${cohortId(3, 'ash')}.m1`, back.sections['test.school'].delta.instances[INSTANCE].edges).source, 'frozen');
});

test('validation is derived from the pack definition', () => {
    const {loaded} = setup();
    const bad = playedSection();
    bad.delta.instances[INSTANCE].people['test.school.person.ghost'] = {rung: 'met', frozen: {}};
    assert.throws(() => validateSection(bad, loaded), /Invalid person delta/);
    const wrongRung = playedSection(); wrongRung.delta.instances[INSTANCE].people[ADA].rung = 'best_friend';
    assert.throws(() => validateSection(wrongRung, loaded), /Invalid person delta/);
    const fact = playedSection(); fact.delta.instances[INSTANCE].facts['other.fact'] = 1;
    assert.throws(() => validateSection(fact, loaded), /Invalid fact delta/);
});

test('seen beats revised: revealed values stay, unseen people take the new revision', () => {
    const s = playedSection();
    const before = setup().pop;
    const unseen = `${cohortId(4, 'cedar')}.m5`;
    const nameBefore = before.person(unseen).name, seenBefore = personView(before, s, STUDENT).name;
    // Revision 2 renames every generated given name and bumps the table revision.
    const revised = makeSchoolPack({revision: 2, given: ['Zed', 'Yara', 'Xan', 'Wren', 'Vale', 'Uma', 'Tam', 'Sol', 'Rue', 'Quin', 'Pell', 'Oro']});
    revised.content.slots[0].table.revision = 2;
    const registry = loadWorldPacks([revised, makeRulebookPack()], {features: FEATURES, ruleAdapter: fakeRuleAdapter});
    const {saves, dormant} = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, registry);
    assert.deepEqual(dormant, []);
    assert.equal(saves.sections['test.school'].packRevision, 2, 'identity hop: revision 1 is save-compatible');
    const after = createPopulation(registry.packs.get('test.school'), {root: 42, instanceId: INSTANCE});
    assert.equal(personView(after, saves.sections['test.school'], STUDENT).name, seenBefore);
    assert.notEqual(after.person(unseen).name, nameBefore);
});

test('the migration chain runs registered steps and identity hops in order', () => {
    const s = playedSection(), seen = [];
    const migrations = createMigrationRegistry();
    migrations.register({packId: 'test.school', from: 2, to: 4, migrate: section => {seen.push('2->4');
        section.delta.instances[INSTANCE].facts['test.school.fact.bells_rewired'] = true; return {...section, packRevision: 4};}});
    assert.throws(() => migrations.register({packId: 'test.school', from: 2, to: 3, migrate: x => x}), /Duplicate/);
    const registry = registryFor({revision: 5});
    const {saves, dormant} = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, registry, migrations);
    assert.deepEqual(dormant, []);
    assert.deepEqual(seen, ['2->4']);
    assert.equal(saves.sections['test.school'].packRevision, 5);
    assert.equal(saves.sections['test.school'].delta.instances[INSTANCE].facts['test.school.fact.bells_rewired'], true);
});

test('gaps, failures, newer saves and schema changes keep the original section dormant', () => {
    const s = playedSection(), original = structuredClone(s);
    const gap = makeSchoolPack({revision: 3}); gap.saveCompatibleFrom = 2;
    const gapRegistry = loadWorldPacks([gap, makeRulebookPack()], {features: FEATURES});
    let result = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, gapRegistry);
    assert.equal(result.dormant[0].code, 'migration-gap');
    assert.deepEqual(result.saves.sections['test.school'], original);
    const failing = createMigrationRegistry();
    failing.register({packId: 'test.school', from: 1, to: 2, migrate: () => {throw Error('cannot place the moved dorm');}});
    result = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, registryFor({revision: 2}), failing);
    assert.deepEqual([result.dormant[0].code, result.saves.sections['test.school']], ['migration-failed', original]);
    const newer = {...structuredClone(s), packRevision: 9};
    result = reconcileWorldPackSaves({schema: 1, sections: {'test.school': newer}}, registryFor());
    assert.equal(result.dormant[0].code, 'save-newer');
    assert.equal(result.saves.sections['test.school'].packRevision, 9, 'never a silent downgrade');
    const schema = makeSchoolPack({revision: 2}); schema.saveSchema = 2;
    result = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, loadWorldPacks([schema, makeRulebookPack()], {features: FEATURES}));
    assert.equal(result.dormant[0].code, 'schema-mismatch');
    assert.deepEqual(s, original, 'inputs are never mutated');
});

test('a missing or failed pack keeps its section verbatim (IS8)', () => {
    const s = playedSection();
    const other = {packId: 'test.gone', packRevision: 3, schema: 1, delta: {instances: {}, retired: {}, anything: 'kept'}};
    const registry = loadWorldPacks([makeRulebookPack()], {features: FEATURES});
    const {saves, dormant} = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s, 'test.gone': other}}, registry);
    assert.deepEqual(saves.sections, {'test.gone': other, 'test.school': s});
    assert.deepEqual(dormant.map(d => [d.packId, d.code]), [['test.gone', 'pack-missing'], ['test.school', 'pack-missing']]);
    assert.throws(() => reconcileWorldPackSaves({schema: 7, sections: {}}, registry), /preserved/);
    assert.deepEqual(reconcileWorldPackSaves(undefined, registry), {saves: emptyWorldPackSaves(), dormant: []});
});

test('removed content moves to retired storage instead of being deleted', () => {
    const s = playedSection();
    // Revision 2 shrinks the year-4 cedar cohort and retires a named person.
    const smaller = makeSchoolPack({revision: 2, perCohort: 2});
    smaller.content.people = smaller.content.people.filter(p => p.id !== ADA);
    smaller.content.relationships = [];
    smaller.retired.push({id: ADA, since: 2});
    smaller.content.exceptions = smaller.content.exceptions.filter(e => e.personId !== ADA);
    const registry = loadWorldPacks([smaller, makeRulebookPack()], {features: FEATURES});
    const {saves, dormant} = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, registry);
    assert.deepEqual(dormant, []);
    const d = saves.sections['test.school'].delta;
    assert.deepEqual(Object.keys(d.instances[INSTANCE].people), []);
    assert.equal(d.retired[`person:${INSTANCE}:${ADA}`].reason, 'retired');
    assert.equal(d.retired[`person:${INSTANCE}:${STUDENT}`].reason, 'missing');
    assert.deepEqual(d.retired[`person:${INSTANCE}:${STUDENT}`].value, s.delta.instances[INSTANCE].people[STUDENT]);
    assert.ok(d.retired[`exception:${INSTANCE}:test.school.save.tutor`]);
    assert.equal(Object.keys(d.instances[INSTANCE].edges).length, 0);
    assert.equal(Object.keys(d.retired).filter(k => k.startsWith('edge:')).length, 1);
});

test('dormant records stay in place; only undefined IDs retire', () => {
    const s = playedSection();
    const registry = loadWorldPacks([makeSchoolPack(), makeRulebookPack()], {features: ['resolver:test.d20@1']});
    const {saves, dormant} = reconcileWorldPackSaves({schema: 1, sections: {'test.school': s}}, registry);
    assert.deepEqual(dormant, []);
    assert.deepEqual(saves.sections['test.school'], s, 'the student slot is dormant, but nothing is retired');
});

test('instances never share people, edges or exceptions (P9P2f)', () => {
    const {loaded} = setup();
    const a = createPopulation(loaded, {root: 42, instanceId: 'test.school.main'}), b = createPopulation(loaded, {root: 42, instanceId: 'test.school.mirror'});
    let s = revealPerson(createSection(loaded), a, STUDENT);
    assert.equal(personView(b, s, STUDENT).rung, null);
    s = revealPerson(s, b, STUDENT);
    assert.deepEqual(Object.keys(s.delta.instances).sort(), ['test.school.main', 'test.school.mirror']);
    assert.notDeepEqual(s.delta.instances['test.school.main'].people[STUDENT].frozen, s.delta.instances['test.school.mirror'].people[STUDENT].frozen);
    assert.ok(sectionBytes(s) > 0);
});
