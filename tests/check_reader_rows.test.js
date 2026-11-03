import test from 'node:test';
import assert from 'node:assert/strict';
import {checkReader, locators, parsePayload} from '../scripts/lead_run/check_reader_rows.mjs';

const payload = `## v1 ch1 Alpha
P001 Klein paid five soli six pence for a thing at the stall near the river bank.
P002 He walked home slowly and counted what was left in his small leather purse.
## v1 ch2 Beta
P001 Melissa asked about the dress and he answered carefully, saying nothing about the job.
`;
const row = o => ({rows: [{id: 'a.1', loc: 'ch1 P001-P002', summary: 'Klein buys a thing.', ...o}], seams: [], mechanisms: [], plants: []});

test('payload parser and locators', () => {
  assert.equal(parsePayload(payload).get(2).size, 1);
  assert.deepEqual(locators('ch1 P001-P002')[0], {ch: 1, from: 1, toCh: 1, to: 2});
});
test('clean row passes', () => assert.deepEqual(checkReader(row({}), payload), []));
test('missing paragraph, outside chapter and reversed range are hard problems', () => {
  const t = k => checkReader(row({loc: k}), payload).map(p => p.type);
  assert.ok(t('ch1 P009').includes('locator-paragraph-missing'));
  assert.ok(t('ch3 P001').includes('locator-chapter-outside-window'));
  assert.ok(t('ch1 P002-P001').includes('locator-reversed'));
});
test('verbatim run is hard, over-limit and unmatched money are soft', () => {
  const quote = checkReader(row({summary: 'He walked home slowly and counted what was left in his purse.'}), payload);
  assert.ok(quote.some(p => p.type === 'verbatim-run' && !p.soft));
  const long = checkReader(row({summary: Array(31).fill('word').join(' ')}), payload, {limit: 30});
  assert.ok(long.some(p => p.type === 'over-limit' && p.soft));
  const money = checkReader(row({summary: 'Klein pays 12 soli.'}), payload);
  assert.ok(money.some(p => p.type === 'money-figure-unmatched' && p.soft));
  assert.deepEqual(checkReader(row({summary: 'Klein pays 5 soli.'}), payload), []);
});

test('coarse rows and uncovered chapters are soft', () => {
  const big = '## v1 ch5 Big\n' + Array.from({length: 60}, (_, i) => `P${String(i + 1).padStart(3, '0')} sentence number ${i} about nothing in particular here.`).join('\n') + '\n';
  const r = checkReader({rows: [{id: 'x.1', loc: 'ch5 P001-P020', summary: 'whole stretch'}], seams: [], mechanisms: [], plants: []}, big, {spanLimit: 10});
  assert.ok(r.some(p => p.type === 'coarse-row' && p.soft));
  assert.ok(r.some(p => p.type === 'uncovered-paragraphs' && p.soft));
});
