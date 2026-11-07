import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureInquiry, stepInquiry, freshInquiries, migrateInquiries, defineInquiry, inquiryView, CONFIDENCE} from '../src/inquiry.js';
import {studyInquiryId, studyEffort} from '../src/inquiry_study.js';
import {RESEARCH_PROJECTS} from '../src/research_content.js';
import {observerView} from '../src/observer_view.js';
import {researchView} from '../src/research_view.js';
import {createFieldFixture, fieldCommand, fieldAdvance, fieldReload} from '../scripts/field_fixtures.mjs';

const ID = 'study.frontier.lever', KEY = 'study.frontier.lever.writeup';
const ask = (p, id) => fieldCommand(p, `field.lp1.${id}`, 'Village', {targetId: 'oldCraftsman'});
const project = p => researchView(observerView(p.state), p.state).projects.find(x => x.id === 'frontier.lever');
let fx;
const wire = () => configureInquiry({plan: () => fx, commit: () => {}, writable: () => true});
const slice = () => domainRegistry.save({}).inquiry;
const record = () => domainRegistry.command('inquiry', 'record')({id: ID, effort: studyEffort(project(fx))});
const reset = () => { domainRegistry.load({}); fx = createFieldFixture(); wire(); };
const walkTo = steps => { for (const [id, adv] of steps) { fx = ask(fx, id); if (adv) fx = fieldAdvance(fx, adv); } };

test('the study consumer is defined against a real project', () => {
    assert.equal(studyInquiryId(RESEARCH_PROJECTS[0]), ID);
    assert.equal(studyInquiryId({id: 'frontier.datum'}), null);
});

test('an untouched life writes no key, and a foreign or junk slice loads fresh (failure scenario)', () => {
    domainRegistry.initialize(); reset();
    assert.equal(slice(), undefined);
    for (const foreign of [{family: 'other@1', records: {x: 1}}, 'junk', 7, {family: 'inquiry@1', records: []}]) {
        domainRegistry.validate({inquiry: foreign}); domainRegistry.load({inquiry: foreign});
        assert.equal(slice(), undefined);
    }
    assert.deepEqual(migrateInquiries({family: 'inquiry@1', records: {bad: {actor: 5}, 'ok.id': {actor: 'player', effort: {minutes: 1, evidence: 0}, openedAt: 0, wrote: ['a', 7]}}}).records,
        {'ok.id': {actor: 'player', effort: {minutes: 1, evidence: 0}, openedAt: 0, wrote: ['a']}});
    assert.equal(fx.state.simulation.knowledge.player?.[KEY], undefined);
});

test('effort advances, a partial result carries a confidence word, and the output fact is written once', () => {
    domainRegistry.initialize(); reset();
    walkTo([['demonstrate'], ['hand', 6]]);
    let r = record();
    assert.equal(r.confidence, CONFIDENCE.repeated);
    assert.equal(r.done, false);
    assert.match(r.partial, /6 of 6 minutes worked, 2 of 4 pieces of evidence/);
    assert.deepEqual(r.wroteNow, []);
    assert.equal(fx.state.simulation.knowledge.player[KEY], undefined);
    walkTo([['return'], ['explain']]);
    r = record();
    assert.equal(r.done, true); assert.equal(r.confidence, CONFIDENCE.confirmed);
    assert.deepEqual(r.wroteNow, [KEY]);
    const entry = fx.state.simulation.knowledge.player[KEY];
    assert.equal(entry.stage, 'understood'); assert.equal(entry.cause, `inquiry:${ID}`); assert.equal(entry.basis, undefined);
    entry.value = 'edited'; // a second record must not rewrite it
    assert.deepEqual(record().wroteNow, []);
    assert.equal(fx.state.simulation.knowledge.player[KEY].value, 'edited');
});

test('a failed commit rolls the slice back', () => {
    domainRegistry.initialize(); reset();
    walkTo([['demonstrate']]);
    configureInquiry({plan: () => fx, commit: () => { throw Error('disk full'); }, writable: () => true});
    assert.throws(record, /disk full/);
    assert.equal(slice(), undefined);
});

test('the slice persists through save, validate and reload with the knowledge fact', () => {
    domainRegistry.initialize(); reset();
    walkTo([['demonstrate'], ['hand', 6], ['return'], ['explain']]);
    record();
    const env = JSON.parse(JSON.stringify(domainRegistry.save({}))), saved = structuredClone(env.inquiry);
    assert.equal(saved.family, 'inquiry@1'); assert.deepEqual(saved.records[ID].wrote, [KEY]);
    domainRegistry.validate(env); domainRegistry.load({}); assert.equal(slice(), undefined);
    domainRegistry.load(env); assert.deepEqual(slice(), saved);
    fx = fieldReload(fx); wire();
    assert.equal(fx.state.simulation.knowledge.player[KEY].stage, 'understood');
    assert.deepEqual(record().wroteNow, []);
    assert.equal(domainRegistry.project('inquiry').inquiries[0].done, true);
});

test('a dropped slice cannot rewrite a fact already in the store, and definitions are checked', () => {
    const def = defineInquiry({id: 'x.q', question: 'q?', method: 'read', sources: [{kind: 'text', id: 'book.one'}], need: {minutes: 1, evidence: 0}, risk: 'r', outputs: [{key: 'x.fact', stage: 'seen', value: 'v'}]});
    const knowledge = {'x.fact': {stage: 'seen', value: 'old', at: 0, cause: 'c'}};
    const {slice: s, effects} = stepInquiry(freshInquiries(), def, {effort: {minutes: 1}, at: 5, knowledge});
    assert.deepEqual(effects, []); assert.equal(knowledge['x.fact'].value, 'old'); assert.equal(inquiryView(s, def).done, true);
    assert.throws(() => defineInquiry({...def, risk: ''}), /wrong or early/);
    assert.throws(() => defineInquiry({...def, method: 'guess'}), /Invalid inquiry/);
});
