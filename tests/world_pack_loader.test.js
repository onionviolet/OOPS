import test from 'node:test';
import assert from 'node:assert/strict';
import {loadWorldPacks, orderPacks, authorReport, playerNotices, isActive} from '../src/world_pack_loader.js';
import {makeSchoolPack, makeRulebookPack, fakeRuleAdapter, FEATURES, SEALED_TEST_TERM, cohortId} from './world_pack_school_fixture.js';

const load = (packs, options = {}) => loadWorldPacks(packs, {features: FEATURES, ruleAdapter: fakeRuleAdapter, ...options});
const codes = (registry, packId) => registry.diagnostics.filter(d => d.packId === packId).map(d => d.code);
const tiny = (id, requires = []) => ({...makeRulebookPack(), id, provides: {}, requires: {packs: requires.map(r => ({id: r, minRevision: 1}))}});
const summary = registry => JSON.stringify({order: registry.order, dormant: [...registry.dormantPacks],
    packs: [...registry.packs.values()].map(p => [p.id, p.fingerprint, [...p.coverage], [...p.dormant], p.ruleProfile]), diagnostics: registry.diagnostics});

test('the school loads after its rulebook with an active rule profile', () => {
    const registry = load([makeSchoolPack(), makeRulebookPack()]);
    assert.deepEqual(registry.order, ['test.rulebook', 'test.school']);
    assert.equal(registry.dormantPacks.size, 0);
    const school = registry.packs.get('test.school');
    assert.equal(school.ruleProfile.status, 'active');
    assert.deepEqual(school.ruleProfile.chain, ['test.rulebook.core', 'test.school.profile']);
    assert.deepEqual(school.ruleProfile.lock.refs, ['test.rulebook.mod.base_check@1', 'test.school.mod.curfew@1']);
    assert.deepEqual(school.ruleProfile.dormantModules, [{id: 'test.rulebook.mod.optional_crit', ruling: 'needs_ruling'}]);
    assert.ok(Object.isFrozen(registry) && Object.isFrozen(school.pack.content.areas[0]));
});

test('load order and every output are independent of input order', () => {
    const packs = [makeSchoolPack(), makeRulebookPack(), tiny('test.zeta', ['test.alpha']), tiny('test.alpha'), tiny('test.mid', ['test.zeta', 'test.alpha'])];
    const first = summary(load(packs));
    for (const order of [[4, 3, 2, 1, 0], [2, 0, 4, 1, 3], [1, 4, 0, 3, 2]]) assert.equal(summary(load(order.map(i => structuredClone(packs[i])))), first);
    assert.deepEqual(load(packs).order, ['test.alpha', 'test.rulebook', 'test.school', 'test.zeta', 'test.mid']);
});

test('dependency cycles and their dependants load dormant while the rest runs', () => {
    const registry = load([tiny('test.a', ['test.b']), tiny('test.b', ['test.c']), tiny('test.c', ['test.a']), tiny('test.d', ['test.a']), tiny('test.e')]);
    assert.deepEqual(registry.order, ['test.e']);
    assert.equal(registry.dormantPacks.get('test.a'), 'dependency-cycle');
    assert.equal(registry.dormantPacks.get('test.c'), 'dependency-cycle');
    assert.equal(registry.dormantPacks.get('test.d'), 'dependency-dormant');
    const {cyclic, blocked} = orderPacks(new Map([['x', ['x']], ['y', ['x']]]));
    assert.deepEqual([cyclic, blocked], [['x'], ['x', 'y']]);
});

test('missing, old, duplicate and nested dependencies fail only their packs', () => {
    assert.equal(load([makeSchoolPack()]).dormantPacks.get('test.school'), 'dependency-unmet');
    const school = makeSchoolPack(); school.requires.packs[0].minRevision = 2;
    assert.equal(load([school, makeRulebookPack()]).dormantPacks.get('test.school'), 'dependency-unmet');
    const dup = load([makeRulebookPack(), makeRulebookPack(), tiny('test.e')]);
    assert.equal(dup.dormantPacks.get('test.rulebook'), 'duplicate-pack');
    assert.deepEqual(dup.order, ['test.e']);
    const nested = load([tiny('test.e'), tiny('test.e.more')]);
    assert.equal(nested.dormantPacks.get('test.e.more'), 'namespace-overlap');
    assert.deepEqual(nested.order, ['test.e']);
});

test('feature gating: a missing pack feature dorms the pack, a missing area feature dorms the area', () => {
    const needy = {...tiny('test.f'), requires: {features: ['physics:orbital']}};
    assert.equal(load([needy]).dormantPacks.get('test.f'), 'missing-feature');
    const school = makeSchoolPack();
    school.content.areas.find(a => a.id === 'test.school.area.library').requiresFeatures = ['ui:archive-reader'];
    const p = load([school, makeRulebookPack()]).packs.get('test.school');
    assert.equal(p.dormant.get('test.school.area.library'), 'missing-feature');
    assert.equal(p.dormant.get('test.school.inst.academy'), 'dangling-reference', 'the chess club meets in the library');
    assert.ok(p.dormant.has(cohortId(3, 'ash')), 'cohorts of a dormant institution go dormant');
    assert.equal(isActive(p, 'test.school.person.porter'), true, 'the porter has no cohort and stays');
    assert.equal(p.coverage.get('test.school.area.gate'), 'playable');
});

test('an absent generator dorms its slot and cascades through cohorts, people and edges', () => {
    const p = load([makeSchoolPack(), makeRulebookPack()], {features: ['resolver:test.d20@1']}).packs.get('test.school');
    assert.equal(p.dormant.get('test.school.slot.students'), 'missing-generator');
    assert.equal(p.dormant.get(cohortId(1, 'ash')), 'dangling-reference');
    assert.equal(p.dormant.get('test.school.person.ada'), 'dangling-reference');
    assert.equal(p.dormant.get('test.school.rel.ada_bram'), 'dangling-reference');
    assert.equal(p.dormant.get('test.school.exc.assembly'), 'dangling-reference');
    assert.equal(p.coverage.get('test.school.area.classroom_a'), 'inspectable', 'no one is left to attend');
    assert.equal(p.coverage.get('test.school.area.gate'), 'playable');
    assert.ok(codes(load([makeSchoolPack(), makeRulebookPack()], {features: ['resolver:test.d20@1']}), 'test.school').includes('coverage-downgraded'));
});

test('honest coverage: routes only lead to playable areas and reachability is reported', () => {
    const school = makeSchoolPack();
    school.content.areas.push({id: 'test.school.area.attic', label: 'Attic', coverage: 'playable', routes: [], activities: ['test.school.act.rummage'], people: ['test.school.person.porter']});
    const registry = load([school, makeRulebookPack()]), p = registry.packs.get('test.school');
    assert.equal(p.routes.get('test.school.area.hall').some(r => r.to === 'test.school.area.greenhouse'), false);
    assert.ok(p.reachable.has('test.school.area.library'));
    assert.equal(p.reachable.has('test.school.area.attic'), false);
    const diag = registry.diagnostics.filter(d => d.packId === 'test.school').map(d => `${d.code}:${d.subjectId}`);
    assert.ok(diag.includes('route-dormant:test.school.area.hall'));
    assert.ok(diag.includes('unreachable:test.school.area.attic'));
    const empty = makeSchoolPack(); empty.content.areas.find(a => a.id === 'test.school.area.gate').activities = [];
    const q = load([empty, makeRulebookPack()]);
    assert.equal(q.packs.get('test.school').coverage.get('test.school.area.gate'), 'inspectable');
    assert.ok(codes(q, 'test.school').includes('no-playable-entry'));
});

test('rule profiles stay dormant without an owner, a resolver or a valid layer, and the world keeps running', () => {
    const noOwner = load([makeSchoolPack(), makeRulebookPack()], {ruleAdapter: null}).packs.get('test.school');
    assert.equal(noOwner.ruleProfile.status, 'dormant');
    assert.equal(noOwner.ruleProfile.reason, 'rule-owner-absent');
    assert.equal(noOwner.coverage.get('test.school.area.gate'), 'playable');
    const noResolver = load([makeSchoolPack(), makeRulebookPack()], {features: ['generator:person.cohort@1']}).packs.get('test.school');
    assert.equal(noResolver.ruleProfile.reason, 'resolver-absent');
    const high = makeRulebookPack(); high.provides.ruleProfiles[0].modules[0].priority.layer = 'region';
    const school = load([makeSchoolPack(), high]).packs.get('test.school');
    assert.equal(school.ruleProfile.reason, 'profile-layer');
    const lost = makeSchoolPack(); lost.provides.ruleProfiles[0].extends = 'test.rulebook.missing';
    assert.equal(load([lost, makeRulebookPack()]).packs.get('test.school').ruleProfile.reason, 'profile-missing');
    const hidden = makeSchoolPack(); hidden.requires.packs = []; hidden.requires.ruleProfile = 'test.rulebook.core';
    assert.equal(load([hidden, makeRulebookPack()]).packs.get('test.school').ruleProfile.reason, 'profile-missing', 'profiles come only from declared dependencies');
    const refused = load([makeSchoolPack(), makeRulebookPack()], {ruleAdapter: {createRuleLock() {throw Error('bad module');}}});
    assert.equal(refused.packs.get('test.school').ruleProfile.reason, 'rule-lock-refused');
    assert.equal(load([makeRulebookPack()]).packs.get('test.rulebook').ruleProfile.status, 'none');
});

test('crossings need an authority model, its conversion or cause, and a scale rule across scale classes', () => {
    const giant = {...makeSchoolPack(), id: 'test.giants', title: 'Giants'};
    const raw = JSON.parse(JSON.stringify(giant).replaceAll('test.school.', 'test.giants.'));
    raw.axes = {scale: 'giant'};
    const school = makeSchoolPack();
    const to = 'test.giants', scaleRule = 'test.school.scale_rule';
    school.content.crossings = [{id: 'test.school.cross.ok', to, authority: 'traveler', scaleRule},
        {id: 'test.school.cross.none', to, scaleRule}, {id: 'test.school.cross.odd', to, authority: 'vibes', scaleRule},
        {id: 'test.school.cross.equal', to, authority: 'equalized', scaleRule}, {id: 'test.school.cross.equal_ok', to, authority: 'equalized', conversion: 'test.school.conv', scaleRule},
        {id: 'test.school.cross.dominant', to, authority: 'dominant', scaleRule}, {id: 'test.school.cross.noscale', to, authority: 'place'},
        {id: 'test.school.cross.nowhere', to: 'test.void', authority: 'raw'}];
    const p = load([school, raw, makeRulebookPack()]).packs.get('test.school');
    assert.equal(p.dormant.has('test.school.cross.ok'), false);
    assert.equal(p.dormant.has('test.school.cross.equal_ok'), false);
    assert.equal(p.dormant.get('test.school.cross.none'), 'crossing-authority');
    assert.equal(p.dormant.get('test.school.cross.odd'), 'crossing-authority');
    assert.equal(p.dormant.get('test.school.cross.equal'), 'crossing-conversion');
    assert.equal(p.dormant.get('test.school.cross.dominant'), 'crossing-cause');
    assert.equal(p.dormant.get('test.school.cross.noscale'), 'crossing-scale');
    assert.equal(p.dormant.get('test.school.cross.nowhere'), 'crossing-target');
});

test('author report and player notices never reveal sealed truth or unlearned places', () => {
    const school = makeSchoolPack();
    school.content.areas.find(a => a.id === 'test.school.area.library').requiresFeatures = ['ui:archive-reader'];
    school.content.areas.find(a => a.id === 'test.school.area.gate').label = `Gate to the ${SEALED_TEST_TERM}`;
    const registry = load([school, makeRulebookPack()]);
    const everything = authorReport(registry) + JSON.stringify(registry.diagnostics);
    assert.ok(everything.includes('test.school.secret.s1'));
    assert.equal(everything.toLowerCase().includes(SEALED_TEST_TERM), false);
    const unknown = playerNotices(registry, {referenced: ['test.lost']});
    assert.deepEqual(unknown, ['A world you have touched is unavailable in this version. Its saved progress is kept.']);
    const known = playerNotices(registry, {known: new Set(['test.school.area.library', 'test.school.area.gate'])});
    assert.deepEqual(known, ['Library is closed in this version.'], 'a sealed-text area is never named, even when known');
    assert.deepEqual(playerNotices(registry), []);
});

test('the entity budget is checked at load', () => {
    const big = makeSchoolPack({perCohort: 40});
    big.budgets.entities = 500;
    assert.equal(load([big, makeRulebookPack()]).dormantPacks.get('test.school'), 'budget-entities');
    const slot = makeSchoolPack({perCohort: 40}); slot.budgets.entities = 2000; slot.content.slots[0].budget.maxEntities = 100;
    const p = load([slot, makeRulebookPack()]).packs.get('test.school');
    assert.equal(p.dormant.get('test.school.slot.students'), 'budget-slot');
    assert.equal(p.dormant.get(cohortId(2, 'birch')), 'dangling-reference');
    assert.equal(p.dormant.get('test.school.person.ada'), 'dangling-reference');
});
