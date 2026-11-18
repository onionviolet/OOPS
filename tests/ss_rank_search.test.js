// Shadow Slave rank search (PWC99, PWC100): frozen folds, fold 5 scored once, derived rows carry their rule's score, creature rows carry none while the rule fails its baseline.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const rd = f => JSON.parse(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'));
const lines = f => readFileSync(new URL(`../docs/coverage/${f}.jsonl`, import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const foldOf = id => { const b = createHash('sha1').update(id).digest()[0]; return b < 0x33 ? 5 : 1 + Math.floor((b - 0x33) * 4 / (256 - 0x33)); };

test('the folds are the frozen hash split and every stated row sits in one fold', () => {
    const f = rd('docs/coverage/ss_rank_folds.json');
    for (const [pool, folds] of Object.entries(f.folds)) for (const [k, ids] of Object.entries(folds)) for (const id of ids) assert.equal(foldOf(id), Number(k), `${pool} ${id}`);
    assert.equal(Object.values(f.folds.creatures).flat().length, 61);
    assert.equal(Object.values(f.folds.artifacts).flat().length, 27);
});

test('fold 5 was scored once per pool; the figures add up and the verdicts follow the floor rule', () => {
    const r = rd('docs/coverage/ss_rank_search.json'), f = rd('docs/coverage/ss_rank_folds.json');
    for (const pool of ['creatures', 'artifacts']) {
        const p = r.pools[pool];
        assert.equal(p.final.n, f.folds[pool][5].length);
        assert.ok(p.final.exact <= p.final.within1 && p.final.within1 <= p.final.n);
        assert.equal(Object.values(p.final.by).reduce((a, b) => a + b.n, 0), p.final.n);
    }
    const rules = Object.fromEntries(rd('docs/coverage/derivation_rules.json').rules.map(x => [x.id, x]));
    assert.equal(rules['ss.rank.artifacts-story-time'].verdict, 'insufficient-held-out');
    assert.equal(rules['ss.rank.creatures-story-time'].verdict, 'fails-baseline');
});

test('derived artifact rows carry the artifact rule\'s score; no creature or echo row is derived', () => {
    const rule = rd('docs/coverage/derivation_rules.json').rules.find(x => x.id === 'ss.rank.artifacts-story-time');
    const derived = lines('shadow_slave_artifacts').filter(x => x.derived);
    assert.ok(derived.length >= 300);
    for (const row of derived) { assert.equal(row.derived.rule, rule.id); assert.equal(row.rankBasis, 'derived'); assert.deepEqual(row.derived.confidence, {...rule.confidence, version: rule.version}, row.id); }
    for (const f of ['shadow_slave_creatures', 'shadow_slave_echoes']) assert.equal(lines(f).filter(x => x.derived).length, 0);
});

test('named exceptions are two tiers or more off', () => {
    const e = rd('docs/coverage/ss_rank_exceptions.json');
    for (const x of e.exceptions) assert.ok(x.tiersOff >= 2 && /^authored:/.test(x.state));
});
