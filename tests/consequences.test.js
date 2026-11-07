import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {LOTM_DUTIES} from '../src/book_world_lotm_duties.js';
import {eventFeed} from '../src/event_feed.js';
import {runConsequences, consequenceNews, registerConsequence, OWED_DUE_RULE} from '../src/consequences.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';

const WEEK = 10080, ID = 'lotm.expense_claim';
let clock = 10, enrolled = false;
registerDutySet('consequences-test', {defs: LOTM_DUTIES, state: () => ({clock, enrolled}), active: s => s.enrolled, minute: s => s.clock});
const state = () => initializeExpedition(createExpansionState(7));
const claimLines = feed => feed.news.filter(n => n.id.startsWith(`owed:duty:${ID}@`));

test('an untouched life gets no event and no new save key', () => {
    domainRegistry.initialize(); domainRegistry.load({}); enrolled = false;
    const before = JSON.stringify(domainRegistry.save({}));
    assert.deepEqual(consequenceNews(state()), []);
    assert.deepEqual(eventFeed(state(), registry), {leads: [], news: [], life: [], heard: []});
    domainRegistry.tick(1);
    assert.equal(JSON.stringify(domainRegistry.save({})), before);
});

test('a due duty row produces one person-shaped line once; a second read and a replay add nothing', () => {
    domainRegistry.load({}); enrolled = true; clock = 10; domainRegistry.tick(1);
    const first = claimLines(eventFeed(state(), registry));
    assert.equal(first.length, 1);
    assert.match(first[0].text, /Captain Dunn/);
    domainRegistry.tick(1);
    const second = claimLines(eventFeed(state(), registry));
    assert.deepEqual(second, first);
    // Caller replays with the ids it has already shown: nothing new.
    const owed = {rows: domainRegistry.project('duties').rows, live: {}, labels: {}, now: clock};
    assert.equal(runConsequences({owed}, {seen: first.map(e => e.id)}).length, 0);
    assert.equal(runConsequences({owed}).length, 1);
    const save = JSON.stringify(domainRegistry.save({}));
    eventFeed(state(), registry);
    assert.equal(JSON.stringify(domainRegistry.save({})), save, 'reading writes nothing');
});

test('the next weekly cycle is a new cause; rules are deduped by id and a throwing rule is skipped', () => {
    const row = since => ({id: `duty:${ID}`, kind: 'duty', debtor: 'player', creditor: 'nighthawks', since, why: 'x'});
    const a = runConsequences({owed: {rows: [row(0)]}}), b = runConsequences({owed: {rows: [row(WEEK)]}});
    assert.notEqual(a[0].id, b[0].id);
    registerConsequence({id: 'test.dup', read: () => [{...a[0]}, {...a[0]}]});
    registerConsequence({id: 'test.boom', read: () => { throw Error('not ready'); }});
    assert.equal(runConsequences({owed: {rows: [row(0)]}}).filter(e => e.id === a[0].id).length, 1);
    registerConsequence({id: 'test.dup', read: () => []}); registerConsequence({id: 'test.boom', read: () => []});
});

test('dated rows are due only on or after their date; debts without a date and others\' rows stay silent', () => {
    const loan = {id: 'credit:x', kind: 'coin', debtor: 'player', creditor: 'counting_house', since: 5, why: 'A loan.'};
    const ctx = days => ({owed: {rows: [loan, {...loan, id: 'o', debtor: 'npc', kind: 'duty'}, {...loan, id: 'g', kind: 'grievance'}], live: {'credit:x': {due: {daysLeft: days, overdue: false}}}, labels: {counting_house: 'the Counting-House'}, now: 5000}});
    assert.equal(runConsequences(ctx(2)).length, 0);
    const [e] = runConsequences(ctx(0));
    assert.match(e.text, /Counting-House is waiting on you/);
    assert.equal(OWED_DUE_RULE.id, 'owed.due');
});
