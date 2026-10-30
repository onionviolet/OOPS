import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LOTM_SUMMONS_ROWS, LOTM_SUMMONS_FACTS, LOTM_SUMMONS_GAPS} from '../src/lotm_summons_rows.js';

const {rows} = LOTM_SUMMONS_ROWS;
const locatorPattern = /^zh 第\d+章 p\d+$/;
const stage = {prepare: 0, call: 1, response: 2, rite: 3, outcome: 4};

test('schema, identities and ordered steps describe two summons scenes', () => {
  assert.equal(LOTM_SUMMONS_ROWS.schema, 1);
  for (const id of ['lotm.summon.copper-whistle-messenger', 'lotm.summon.candle-self-summoning']) assert.ok(rows.some(row => row.id === id), `${id} keeps its published id`);
  const ids = rows.map(row => row.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const row of rows) {
    assert.match(row.id, /^lotm\.summon\.[a-z0-9-]+$/);
    assert.ok(row.sourceIds.length > 0);
    assert.equal(new Set(row.sourceIds).size, row.sourceIds.length);
    assert.ok(row.steps.some(step => step.kind === 'prepare'));
    assert.ok(row.steps.some(step => step.kind === 'call'));
    assert.ok(row.steps.some(step => step.kind === 'response'));
    assert.equal(new Set(row.steps.map(step => step.id)).size, row.steps.length);
    let previous = -1;
    for (const step of row.steps) {
      assert.ok(Object.hasOwn(stage, step.kind), step.kind);
      assert.ok(stage[step.kind] >= previous, `${row.id}: ${step.id} is out of order`);
      previous = stage[step.kind];
      assert.ok(step.label && step.perceived);
      assert.ok(Number.isFinite(step.minutes) && step.minutes >= 0);
    }
    assert.ok(row.proposals.some(proposal => proposal.includes('minute')));
  }
});

test('locators are the cited anchor paragraphs and Chinese stays inside locators', () => {
  const expected = [
    ['zh 第170章 p94', 'zh 第182章 p56', 'zh 第189章 p76'],
    ['zh 第152章 p2', 'zh 第152章 p36', 'zh 第181章 p1', 'zh 第182章 p25'],
  ];
  for (const [index, row] of rows.entries()) {
    assert.deepEqual(row.locators, expected[index]);
    for (const locator of row.locators) assert.match(locator, locatorPattern);
  }
  const moduleSource = readFileSync(new URL('../src/lotm_summons_rows.js', import.meta.url), 'utf8');
  const withoutLocators = moduleSource.replace(/"zh 第\d+章 p\d+"/g, '"locator"');
  assert.doesNotMatch(withoutLocators, /\p{Script=Han}/u);
});

test('eligibility facts are declared and authorship is visible', () => {
  assert.equal(new Set(LOTM_SUMMONS_FACTS).size, LOTM_SUMMONS_FACTS.length);
  const usedFacts = new Set();
  for (const row of rows) {
    assert.ok(row.eligibility.all.length > 0);
    for (const rule of row.eligibility.all) {
      assert.match(rule.fact, /^actor\.lotm\.summon\./);
      assert.ok(LOTM_SUMMONS_FACTS.includes(rule.fact), rule.fact);
      assert.ok(['eq', 'gte'].includes(rule.op));
      assert.ok(Object.hasOwn(rule, 'value'));
      assert.ok(rule.reason);
      usedFacts.add(rule.fact);
    }
    for (const field of ['description', 'device', 'eligibility', 'participants', 'steps', 'response', 'result.stated', 'result.effects']) {
      assert.ok(['S', 'T', 'I'].includes(row.evidence[field]), `${row.id}: ${field}`);
    }
    assert.equal(row.evidence['steps.*.minutes'], 'I');
    assert.equal(row.evidence['eligibility.all.*.value'], 'I');
    assert.equal(row.evidence['result.effects'], 'I');
  }
  assert.deepEqual([...usedFacts].sort(), [...LOTM_SUMMONS_FACTS].sort());
  const self = rows.find(row => row.id === 'lotm.summon.candle-self-summoning');
  const threshold = self.eligibility.all.find(rule => rule.op === 'gte');
  assert.equal(threshold.value, 1);
  assert.match(threshold.reason, /authored/);
  assert.ok(self.proposals.some(proposal => proposal.includes('threshold')));
  assert.ok(self.limits.some(limit => /insufficient spirituality/.test(limit.condition) && /cannot open/.test(limit.outcome)));
});

test('participants and pending owner effects do not assert confirmed delivery', () => {
  for (const row of rows) {
    assert.ok(row.participants.some(participant => participant.role === 'responder'));
    for (const participant of row.participants) {
      assert.ok(['caller', 'responder', 'witness', 'recipient'].includes(participant.role));
      assert.ok(participant.ref && participant.note);
    }
    assert.ok(['delivery', 'attendance'].includes(row.result.kind));
    assert.ok(row.response.entity && row.response.perceived && row.result.stated);
    assert.ok(row.result.effects.some(effect => effect.type === 'owner-needed' && effect.owner));
    for (const effect of row.result.effects) {
      assert.equal(effect.type, 'owner-needed');
      assert.ok(effect.owner && effect.value);
    }
    for (const limit of row.limits) {
      assert.ok(limit.condition && limit.outcome);
      assert.ok(['S', 'T', 'I'].includes(limit.evidence));
    }
  }
  const messenger = rows.find(row => row.result.kind === 'delivery');
  assert.equal(messenger.result.effects[0].value.handoffObserved, true);
  assert.equal(messenger.result.effects[0].value.arrivalConfirmed, false);
  assert.deepEqual(messenger.steps.map(step => step.id), ['prepare', 'call', 'response', 'handoff', 'dismiss']);
});

test('unsupported source procedures stay in the gap register', () => {
  const gaps = new Set(LOTM_SUMMONS_GAPS.map(gap => gap.id));
  assert.equal(gaps.size, LOTM_SUMMONS_GAPS.length);
  for (const id of ['lotm.rite.messenger-summon', 'lotm.rule.spirit-medium-contact', 'lotm.rite.star-summons']) {
    assert.ok(gaps.has(id), id);
  }
  for (const gap of LOTM_SUMMONS_GAPS) {
    assert.ok(gap.reason);
    assert.ok(!rows.some(row => row.id === gap.id || row.sourceIds.includes(gap.id)));
  }
});
