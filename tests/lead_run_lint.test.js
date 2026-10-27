import test from 'node:test';
import assert from 'node:assert/strict';
import {lintScenes, lintCensus, lintLoops, parseShard, summarize} from '../scripts/lead_run/lint_lead_run.mjs';

// Invented fixture text, not source prose.
const shard = parseShard('=== 第1章 测试 | member x\np1: 小镇有一座钟楼。\np2: 面包两便士。\np3: 无关。');
const scene = (over = {}) => ({schema: 'lead-run/1.1', beat: 'lr.test.v1.001', order: 1,
    date: {calendar: 'test', anchor: null, offsetDays: null, value: 'date-unsettled', tolerance: null, label: 'U'},
    timeOfDay: {value: 'dawn', evidence: 'zh 第1章 p1'}, place: 'missing:test.place.square', deps: [],
    steps: [{verb: 'buy', object: 'bread', cost: {amount: 2, unit: 'penny'}}],
    touched: [{kind: 'price', id: 'missing:test.price.bread', status: 'missing'}],
    knowledge: [], motives: [], choices: [], outcomes: [{fact: 'lead.holds.bread', value: true, class: 'carried'}],
    anchors: [{fact: 'lead.purse', value: -2, unit: 'penny', scope: 'lead', locator: 'zh 第1章 p2'}],
    weight: 'routine', footprint: null, sealed: [],
    evidence: [{label: 'S', locator: 'zh 第1章 p2', kind: 'narration'}], mechanism: null, continues: null, ...over});
const row = (over = {}) => ({schema: 'census/1.1', id: 'test.price.bread', label: 'Bread', zh: '面包', nameSource: 'repo',
    kind: 'price', rung: 'M1', whereabouts: [{place: 'test.place.square', era: 'v1', status: 'stated', locator: 'zh 第1章 p2'}],
    firstMention: 'zh 第1章 p2', firstVolume: 1, touchedByLead: true, aliases: [], claimant: 'narration',
    amount: {value: 2, unit: 'penny', per: 'loaf', cap: null}, estimateBy: null, futureAnchors: [], note: 'Plain loaf price.', ...over});

test('well-formed scene and census rows lint clean', () => {
    assert.deepEqual(lintScenes([scene()]), []);
    assert.deepEqual(lintCensus([row()], shard), []);
});

test('sample-run defects are caught (SF1, SF3, SF4, SF5, SF10)', () => {
    const scenes = [scene({weight: 'great', anchors: [{fact: 'lead.purse', value: 'at least 1', unit: 'penny', scope: 'lead', locator: 'zh 第1章 p2'}]}),
        scene({beat: 'lr.test.v1.003', order: 3, footprint: {places: []}}), scene({beat: 'lr.test.v1.002', order: 2,
        date: {anchor: 'lr.test.v1.009', offsetDays: 1, label: 'I'}, touched: [{kind: 'note-ish', id: 'x', status: 'missing'}],
        deps: [{id: 'lr.test.v1.007', kind: 'after'}]})];
    const s = summarize(lintScenes(scenes));
    for (const code of ['great-needs-footprint', 'date-anchor', 'touched-kind', 'dep-missing', 'anchor', 'footprint-shape']) assert.ok(s[code], code);
    const c = summarize(lintCensus([row({amount: null}), row({id: 'test.place.tower', kind: 'place', zh: '钟楼', firstMention: 'zh 第1章 p3', amount: null}),
        row({id: 'test.item.x', kind: 'item', zh: '不存在的词', amount: null}), row({id: 'test.event.y', kind: 'event', firstMention: 'zh 第9章 p1', amount: null})], shard));
    for (const code of ['price-amount', 'zh-not-at-locator', 'locator-outside-shard']) assert.ok(c[code], code);
});

test('a one-paragraph drift is tolerated, a paraphrased name is not', () => {
    assert.deepEqual(lintCensus([row({id: 'test.place.tower', kind: 'place', zh: '钟楼', firstMention: 'zh 第1章 p1', amount: null})], shard), []);
    assert.equal(lintCensus([row({zh: '面包价格'})], shard)[0].code, 'zh-not-at-locator');
});

test('quote guard flags long source-script runs outside the name field', () => {
    const issues = lintCensus([row({note: '这是一段很长的中文句子'})], shard);
    assert.ok(issues.some(i => i.code === 'quote-guard' && i.field === 'note'));
});

test('schema 1.2 requires an action class and label on steps; loops need rhythm, owner and evidence', () => {
    const ok = scene({schema: 'lead-run/1.2', steps: [{verb: 'buy', class: 'trade', label: 'S', time: {minutes: 10}}]});
    assert.deepEqual(lintScenes([ok]), []);
    const bad = summarize(lintScenes([scene({schema: 'lead-run/1.2', steps: [{verb: 'pocket', class: 'fidget', label: 'S'}]})]));
    assert.ok(bad['action-class']);
    const loop = {schema: 'loop/1.2', id: 'test.loop.bake', trigger: 'dawn', steps: ['work', 'trade'], rewards: ['money'],
        rhythm: 'schedule', owner: 'gap', evidence: [{label: 'I', locator: 'zh 第1章 p2', kind: 'inferred'}]};
    assert.deepEqual(lintLoops([loop]), []);
    assert.ok(summarize(lintLoops([{...loop, rhythm: 'sometimes', owner: ''}])).rhythm);
});
