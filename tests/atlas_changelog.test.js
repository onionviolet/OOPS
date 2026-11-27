import test from 'node:test';
import assert from 'node:assert/strict';
import {groupsOf, parseLog, parseStatus, collectCounts, countDeltas, buildChanges, resolveSince, changesSince, LOG_FORMAT} from '../prototypes/world-atlas/changelog.mjs';

const LOG = `\x1eaaa111\x1f2026-11-24T10:00:00+00:00\x1fAdd rows\ndocs/coverage/gu_kinds.jsonl\nsrc/cheat_cards.js\n\x1ebbb222\x1f2026-11-23T09:00:00+00:00\x1fTouch board\ndocs/research/WORLD_ATLAS_IDEABOARD_2026-11-22.md\nprototypes/world-atlas/build.mjs\n`;
const codex = a => ({ledgers: [{ledger: 'gu_kinds', rows: a, counts: {runs: 1, expressed: 0, catalogued: a - 1, blocked: 0, notAThing: 0}}]});
const cheats = n => ({counts: {cheats: 95, variations: n, withDefinition: 8, candidates: 10, byStatus: {proposal: 70, 'working-default': 14, implemented: 11}}});

test('paths fall into the input groups, several at once when they fit', () => {
    assert.deepEqual(groupsOf('docs/coverage/x.jsonl'), ['coverage']);
    assert.deepEqual(groupsOf('docs/CHEAT_CATALOGUE.md'), ['cheat-docs']);
    assert.deepEqual(groupsOf('docs/audits/CHEAT_ABSORPTION_SWEEP_2026-11-24.md'), ['cheat-docs']);
    assert.deepEqual(groupsOf('src/cheat_host.js'), ['cheat-src']);
    assert.deepEqual(groupsOf('docs/IDEA_INDEX.md'), ['idea-boards']);
    assert.deepEqual(groupsOf('docs/worlds/PORTAL_MULTIVERSE_WORLDS_IDEABOARD_2026-11-07.md'), ['idea-boards']);
    assert.deepEqual(groupsOf('tests/atlas_cheats.test.js'), ['atlas']);
    assert.deepEqual(groupsOf('src/main.js'), []);
});

test('parseLog reads hash, date, subject, files and groups', () => {
    const c = parseLog(LOG);
    assert.equal(c.length, 2); assert.equal(c[0].hash, 'aaa111'); assert.equal(c[0].subject, 'Add rows');
    assert.deepEqual(c[0].groups, ['coverage', 'cheat-src']); assert.deepEqual(c[1].groups, ['idea-boards', 'atlas']);
    assert.deepEqual(parseLog(''), []);
});

test('parseStatus keeps only atlas input paths', () => {
    const w = parseStatus(' M docs/coverage/a.jsonl\n?? prototypes/world-atlas/cheats.mjs\n M src/main.js\nR  docs/old.md -> docs/CHEAT_RULES.md\n');
    assert.deepEqual(w.map(x => [x.status, x.path]), [['M', 'docs/coverage/a.jsonl'], ['??', 'prototypes/world-atlas/cheats.mjs'], ['R', 'docs/CHEAT_RULES.md']]);
});

test('counts flatten per ledger and cheat, and deltas list only what moved, biggest first', () => {
    const a = collectCounts({codex: codex(10), cheats: cheats(100)}), b = collectCounts({codex: codex(14), cheats: cheats(101)});
    assert.equal(a['codex.gu_kinds.rows'], 10); assert.equal(a['cheats.status.implemented'], 11);
    const d = countDeltas(a, b);
    assert.deepEqual(d.map(x => x.key), ['codex.gu_kinds.catalogued', 'codex.gu_kinds.rows', 'cheats.variations']);
    assert.deepEqual(d[0], {key: 'codex.gu_kinds.catalogued', from: 9, to: 13, change: 4});
    assert.deepEqual(countDeltas({x: 1}, {y: 2}).map(x => [x.key, x.from, x.to]), [['y', null, 2], ['x', 1, null]]);
});

test('buildChanges keeps the old baseline until the commit or counts move', () => {
    const first = buildChanges({commit: 'c1', codex: codex(10), cheats: cheats(100), existing: null});
    assert.equal(first.previous, null);
    const second = buildChanges({commit: 'c2', codex: codex(12), cheats: cheats(100), existing: first});
    assert.equal(second.previous.commit, 'c1'); assert.equal(second.previous.counts['codex.gu_kinds.rows'], 10);
    const again = buildChanges({commit: 'c2', codex: codex(12), cheats: cheats(100), existing: second});
    assert.equal(again.previous.commit, 'c1'); // nothing moved: the c1 baseline survives a rebuild
    const dirtyMove = buildChanges({commit: 'c2', codex: codex(13), cheats: cheats(100), existing: second});
    assert.equal(dirtyMove.previous.commit, 'c2'); // same commit, counts moved: the earlier build becomes the baseline
});

test('resolveSince accepts a date, a commit or nothing, and rejects the rest', () => {
    assert.equal(resolveSince('', {commit: 'abc1234', builtAt: 't'}).kind, 'previous-snapshot');
    assert.equal(resolveSince('', null).kind, 'none');
    assert.equal(resolveSince('abc1234', null).kind, 'commit');
    assert.deepEqual(resolveSince('2026-11-20', null), {kind: 'iso', ref: '2026-11-20T00:00:00.000Z', label: 'since 2026-11-20T00:00:00.000Z'});
    for (const bad of ['HEAD~1; rm -rf', '--output=x', 'yesterday', 'zzzz']) assert.throws(() => resolveSince(bad, null), /ISO date or a commit/);
});

function fakeGit(known = ['abc1234']) {
    const calls = [];
    const git = args => {
        calls.push(args);
        if (args[0] === 'rev-parse' && args[1] === '--verify') {if (known.some(k => args[3].startsWith(k))) return 'ok'; throw Error('bad');}
        if (args[0] === 'rev-parse') return 'head999\n';
        if (args[0] === 'log') return LOG;
        if (args[0] === 'status') return ' M docs/coverage/a.jsonl\n M src/main.js\n';
        throw Error('unexpected ' + args.join(' '));
    };
    return {git, calls};
}
const CHANGES = {current: {commit: 'head999', builtAt: 'now', counts: {a: 5, b: 1}}, previous: {commit: 'abc1234', builtAt: 'then', counts: {a: 3, b: 1}}};

test('changesSince defaults to the previous snapshot commit and reports count deltas', () => {
    const {git, calls} = fakeGit();
    const r = changesSince(CHANGES, '', git);
    assert.equal(r.since.kind, 'previous-snapshot'); assert.equal(r.commits.length, 2); assert.equal(r.head, 'head999');
    assert.deepEqual(r.deltas, [{key: 'a', from: 3, to: 5, change: 2}]);
    assert.deepEqual(r.working.map(w => w.path), ['docs/coverage/a.jsonl']);
    const log = calls.find(c => c[0] === 'log');
    assert.ok(log.includes('abc1234..HEAD') && log.includes(LOG_FORMAT) && log.includes('--') && log.includes('docs/coverage'));
});

test('an explicit commit that is the previous snapshot gets deltas; another commit does not; an unknown commit falls back', () => {
    assert.ok(changesSince(CHANGES, 'abc1234', fakeGit().git).deltas);
    assert.equal(changesSince(CHANGES, 'def5678', fakeGit(['def5678']).git).deltas, null);
    const unknown = changesSince(CHANGES, 'def5678', fakeGit().git);
    assert.equal(unknown.since.kind, 'none'); assert.match(unknown.note, /not in this checkout/);
});

test('a date passes --since and no previous snapshot lists the last 25 commits with a note', () => {
    const f = fakeGit();
    changesSince(CHANGES, '2026-11-20', f.git);
    assert.ok(f.calls.find(c => c[0] === 'log').includes('--since=2026-11-20T00:00:00.000Z'));
    const g = fakeGit();
    const r = changesSince(null, '', g.git);
    assert.equal(r.since.kind, 'none'); assert.match(r.note, /last 25/); assert.equal(r.deltas, null);
    assert.ok(g.calls.find(c => c[0] === 'log').includes('25'));
});
