// G4 workbench drafts: a row becomes a brief in the owner's shape, saving never overwrites, and the list shows whether the row moved.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildDraft, draftFile, listDrafts, parseMeta, rowHash, saveDraft, stepFor} from '../prototypes/world-atlas/workbench.mjs';

const row = {id: 'wolf-swallow', name: 'Wolf Swallow Gu', state: 'blocked:spatial-storage', source: 'ri:ch10:p2; https://x', mechanisms: ['G'], test: 'tests/gu_coverage.test.js'};
const at = '2026-11-24T00:00:00.000Z';

test('the next step follows the row state and never claims proof', () => {
    assert.equal(stepFor(row, ['spatial-storage']).kind, 'rule-owner');
    assert.equal(stepFor({state: 'blocked:rank-unknown'}).gated, true, 'a reading step is gated');
    assert.equal(stepFor({state: 'expressed-authored'}).kind, 'draft-consumer');
    assert.equal(stepFor({state: 'runs-authored'}).kind, 'prove');
    assert.equal(stepFor({state: 'catalogued'}).kind, 'case');
});

test('a draft carries the row, its hash, the owner, the four rungs apart and the never-by-inference list', () => {
    const d = buildDraft('gu_kinds', row, {canonical: ['spatial-storage'], createdAt: at});
    assert.equal(d.key, 'gu_kinds:wolf-swallow');
    assert.deepEqual(parseMeta(d.text), d.meta);
    assert.equal(d.meta.baseHash, rowHash(row));
    for (const s of ['Proposal (AD32)', 'blocked:spatial-storage', 'rule-owner', '2. Module reachability', '4. Persistence', 'a static import is not play', 'never runs it'])
        assert.ok(d.text.includes(s), s);
    assert.equal(buildDraft('gu_kinds', row, {canonical: ['spatial-storage'], createdAt: at}).text, d.text, 'same inputs, same text');
});

test('saving never overwrites, and the list reports open, row-changed and row-gone', () => {
    const dir = mkdtempSync(join(tmpdir(), 'drafts-'));
    const d = buildDraft('gu_kinds', row, {createdAt: at});
    const first = saveDraft(d, dir);
    assert.equal(first.saved, true);
    assert.equal(readFileSync(join(dir, draftFile(d.key)), 'utf8'), d.text);
    assert.equal(saveDraft(d, dir).conflict, true, 'a second save is a conflict');
    const other = buildDraft('gu_kinds', {...row, id: 'gone-row'}, {createdAt: at}); saveDraft(other, dir);
    let current = {...row};
    const lookup = (ledger, id) => id === 'wolf-swallow' ? current : null;
    const byId = () => Object.fromEntries(listDrafts(lookup, dir).map(x => [x.meta.id, x.status]));
    assert.deepEqual(byId(), {'wolf-swallow': 'open', 'gone-row': 'row-gone'});
    current = {...row, state: 'runs-authored'};
    assert.equal(byId()['wolf-swallow'], 'row-changed');
});

test('draft file names stay inside the folder', () => {
    assert.ok(!draftFile('gu_kinds:../../etc/passwd').includes('/'));
});
