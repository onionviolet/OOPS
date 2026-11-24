import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {ITEM_BOUND_CASE_MODULE, ITEM_BOUND_PATTERNS, ITEM_BOUND_TERMS, canRunItemBound, carryAdmit, itemBoundCase, itemBoundPatternOf} from '../src/item_bound_law.js';

const dir = new URL('../docs/coverage/', import.meta.url);
const rows = readdirSync(dir).filter(f => f.endsWith('.jsonl')).flatMap(f => readFileSync(new URL(f, dir), 'utf8').split('\n').filter(Boolean)
    .map(l => JSON.parse(l)).filter(r => r.case?.module === ITEM_BOUND_CASE_MODULE));

test('every ledger row on the item-bound law runs, in six or more worlds', async () => {
    assert.ok(rows.length >= 80, `rows on the law: ${rows.length}`);
    assert.ok(new Set(rows.map(r => r.id.split('.')[0])).size >= 6);
    for (const id of new Set(rows.map(r => r.case.id))) {
        const out = await runCaseData(itemBoundCase(id), {id});
        assert.match(out.state, /^(expressed|runs)-authored$/, `${id}: ${out.state} ${out.detail}`);
    }
});

test('every term runs under every pattern', async () => {
    for (const term of Object.keys(ITEM_BOUND_TERMS)) for (const p of ITEM_BOUND_PATTERNS) {
        const id = `item:${term}.instant.${p}`;
        assert.match((await runCaseData(itemBoundCase(id), {id})).state, /^expressed-authored$/, id);
    }
});

test('a wrong expectation fails: a stranger cannot use a bound item, and a spent charge does not refill', async () => {
    const bound = itemBoundCase('item:add.vitality.instant.bound');
    bound.timeline[1].expect = [{holder: 'wielder', quantity: 'vitality', direction: 'up'}];
    assert.equal((await runCaseData(bound, {id: 'neg1'})).state, 'blocked:runner-expect-mismatch');
    const charged = itemBoundCase('item:add.vitality.instant.charged');
    charged.timeline[3].expect = [{holder: 'wielder', quantity: 'vitality', direction: 'up'}];
    assert.equal((await runCaseData(charged, {id: 'neg2'})).state, 'blocked:runner-expect-mismatch');
});

test('sentences with no world account stay blocked; patterns read the row words; the limit refuses past its count', () => {
    for (const s of [{verb: 'add', object: 'force'}, {verb: 'alter', object: 'working'}, {verb: 'transform', object: 'moisture'}]) assert.equal(canRunItemBound(s), false);
    assert.throws(() => itemBoundCase('item:add.force.instant.single'));
    assert.equal(itemBoundPatternOf('a cypher'), 'single');
    assert.equal(itemBoundPatternOf('works only for its attuned holder'), 'bound');
    assert.equal(itemBoundPatternOf('a bladed weapon'), 'charged');
    assert.deepEqual(carryAdmit(2, 3), {ok: true, left: 0});
    assert.deepEqual(carryAdmit(3, 3), {ok: false, reason: 'limit', displace: 1});
    assert.throws(() => carryAdmit(-1, 3));
});

test('vitality counterplay blocks a loss and ending the existing ward permits it', async () => {
    const probe = (direction, to) => ({
        id: 'strike',
        sentence: {verb: 'remove', object: 'vitality'},
        details: {target: {shape: 'holder', id: 'wielder'}, amount: 5},
        expect: [{holder: 'wielder', quantity: 'vitality', direction, to}],
    });
    for (const [verb, direction, to] of [['block', 'unchanged', 50], ['end', 'down', 45]]) {
        const id = `item:${verb}.vitality.instant.single`, data = itemBoundCase(id);
        data.world.holders.find(h => h.id === 'wielder').quantities.vitality = 50;
        data.timeline.push(probe(direction, to));
        const out = await runCaseData(data, {id});
        assert.equal(out.state, 'expressed-authored', out.detail);
    }
});
