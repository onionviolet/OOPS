import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {aggregate, blockerIndex, summary, pageRows, projectRow, parseRows, familyOf, buildCodex, ledgerNames, readLedger, MAX_PAGE} from '../prototypes/world-atlas/codex.mjs';

const A = [
    {id: 'a', source: 'https://x.test/a; ch1', state: 'runs-authored', mechanisms: ['G'], test: 't.js', case: {module: 'src/m.js', id: 'a'}},
    {id: 'b', source: 'ch2', state: 'blocked:rank-unknown', mechanisms: ['G', 'P'], test: 't.js', note: 'n'},
    {id: 'c', source: 'ch3', state: 'blocked:rank-unknown', mechanisms: [], test: 't.js'},
    {id: 'd', source: 'ch4', state: 'blocked:form', mechanisms: [], test: 't.js', label: 'Dee'},
    {id: 'e', source: 'ch5', state: 'catalogued', mechanisms: [], test: 't.js'},
    {id: 'f', source: 'ch6', state: 'not-a-thing', mechanisms: [], test: 't.js'},
    {id: 'g', source: 'ch7', state: 'expressed-derived', mechanisms: [], test: 't.js'},
    {id: 'bad', source: 'x'},
];
const B = [{id: 'a', source: 'ch1', state: 'blocked:rank-unknown', mechanisms: [], test: 't.js'}];

test('families', () => {
    assert.deepEqual(['runs-authored', 'expressed-canon', 'blocked:x', 'not-a-thing', 'catalogued'].map(familyOf), ['runs', 'expressed', 'blocked', 'notAThing', 'catalogued']);
});

test('aggregate counts families and blockers, sorted by rows', () => {
    const a = aggregate('A', A);
    assert.deepEqual(a.counts, {runs: 1, expressed: 1, catalogued: 1, blocked: 3, notAThing: 1});
    assert.equal(a.rows, 8); assert.equal(a.invalid, 1); assert.equal(a.things, 6);
    assert.deepEqual(a.blockers, [{slug: 'rank-unknown', rows: 2}, {slug: 'form', rows: 1}]);
});

test('blocker summary names the other ledgers with the same slug', () => {
    const codex = {ledgers: [aggregate('A', A), aggregate('B', B)], inputs: {}};
    codex.blockers = blockerIndex(codex.ledgers);
    const s = summary(codex, 'A');
    const rank = s.blockers.find(b => b.slug === 'rank-unknown');
    assert.deepEqual(rank.alsoIn, [{ledger: 'B', rows: 1}]); assert.equal(rank.alsoInCount, 1);
    assert.equal(s.blockers.find(b => b.slug === 'form').alsoInCount, 0);
    assert.equal(summary(codex, 'nope'), null);
});

test('ladder rungs stay separate and unrecorded rungs are null', () => {
    const run = projectRow('A', A[0]);
    assert.equal(run.key, 'A:a');
    assert.equal(run.ladder.caseState, 'runs-authored');
    assert.deepEqual(run.ladder.case, {module: 'src/m.js', id: 'a'});
    assert.equal(run.ladder.moduleReachable, null); assert.equal(run.ladder.playerAction, null); assert.equal(run.ladder.persistence, null);
    const blocked = projectRow('A', A[1]);
    assert.equal(blocked.ladder.case, null); assert.equal(blocked.blocker, 'rank-unknown');
    assert.deepEqual(run.locators, ['https://x.test/a', 'ch1']);
    assert.notEqual(projectRow('A', A[0]).key, projectRow('B', B[0]).key); // same bare id, distinct composite keys
});

test('paging, state filter and search', () => {
    const all = pageRows('A', A, {limit: 3});
    assert.equal(all.total, 7); assert.equal(all.rows.length, 3); // the row with no state is skipped
    assert.equal(pageRows('A', A, {offset: 6, limit: 3}).rows.length, 1);
    assert.equal(pageRows('A', A, {state: 'blocked'}).total, 3);
    assert.equal(pageRows('A', A, {state: 'rank-unknown'}).total, 2);
    assert.equal(pageRows('A', A, {state: 'runs-authored'}).total, 1);
    assert.deepEqual(pageRows('A', A, {q: 'DEE'}).rows.map(r => r.key), ['A:d']);
    assert.equal(pageRows('A', A, {q: 'ch1'}).total, 1);
    const big = Array.from({length: 300}, (_, i) => ({id: 'r' + i, state: 'catalogued'}));
    assert.equal(pageRows('Z', big, {limit: 9999}).rows.length, MAX_PAGE);
    assert.equal(pageRows('Z', big, {offset: -5, limit: 'x'}).offset, 0);
});

test('build reads a directory, rejects unlisted names and skips malformed lines', () => {
    const dir = mkdtempSync(join(tmpdir(), 'codex-'));
    try {
        writeFileSync(join(dir, 'one.jsonl'), A.map(r => JSON.stringify(r)).join('\n') + '\nnot json\n');
        writeFileSync(join(dir, 'worlds.jsonl'), '{"id":"w"}\n');
        assert.deepEqual(ledgerNames(dir), ['one']);
        assert.equal(readLedger('../one', dir), null);
        const c = buildCodex(ledgerNames(dir), dir);
        assert.equal(c.ledgers[0].rows, 8); assert.match(c.inputs.one.hash, /^[0-9a-f]{12}$/);
        assert.equal(parseRows('{"a":1}\n\nx\n').length, 1);
    } finally {rmSync(dir, {recursive: true, force: true});}
});

test('nextAction points at an owner and never acts', async () => {
    const {nextAction, ledgerActions} = await import('../prototypes/world-atlas/codex.mjs');
    const canon = ['body-form'];
    assert.equal(nextAction('rank-unknown', canon).kind, 'targeted-read'); assert.equal(nextAction('rank-unknown', canon).gated, true);
    assert.equal(nextAction('body-form', canon).kind, 'rule-owner');
    assert.equal(nextAction('runner-unmapped', canon).kind, 'runner-fix');
    assert.equal(nextAction('odd', canon).kind, 'normalize-slug');
    assert.equal(ledgerActions(aggregate('A', A))[0].kind, 'draft-consumer');
    const codex = {ledgers: [aggregate('A', A)], inputs: {}, canonical: canon, blockers: {}};
    assert.equal(summary(codex, 'A').blockers.find(b => b.slug === 'form').nextAction.kind, 'normalize-slug');
});

test('WA23 moveSlots groups one move by variant, keeps open slots and unstated order, and ignores other moves', async () => {
    const {moveSlots} = await import('../prototypes/world-atlas/codex.mjs');
    const {mkdtempSync, writeFileSync} = await import('node:fs');
    const {tmpdir} = await import('node:os');
    const {join: pj} = await import('node:path');
    const file = pj(mkdtempSync(pj(tmpdir(), 'slots-')), 'gu_move_slots.jsonl');
    const row = o => JSON.stringify({move: 'm1', variant: 'm1@ch1', role: 'core', gu: 'a', name: 'A Gu', locator: 'ri:ch1:p1', tier: 'chapter', orderStated: false, order: null, resolution: 'exact', ...o});
    writeFileSync(file, [row(), row({role: 'unnamed', gu: null, name: 'many mortal Gu', resolution: 'unresolved', secondRead: 'differ', secondReadNote: 'n', job: 'feed', jobAt: 'ri:ch1:p2'}), row({variant: null, locator: 'wiki:M#x', tier: 'wiki'}), row({move: 'm2'})].join('\n') + '\n');
    const s = moveSlots('m1', file);
    assert.equal(s.variants.length, 2);
    const v1 = s.variants.find(v => v.variant === 'm1@ch1');
    assert.equal(v1.slots.length, 2);
    assert.deepEqual(v1.slots.map(t => t.role), ['core', 'unnamed']);
    assert.ok(v1.slots.every(t => t.order === null && t.orderStated === false));
    assert.deepEqual([v1.slots[1].secondRead, v1.slots[1].secondReadNote, v1.slots[1].job, v1.slots[1].jobAt], ['differ', 'n', 'feed', 'ri:ch1:p2']);
    assert.equal(v1.slots[0].secondRead, null, 'an unread slot stays null, never inferred');
    assert.equal(moveSlots('m1', file + '.missing'), null);
});
