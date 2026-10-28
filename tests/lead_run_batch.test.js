import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, readFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {normalize, shardSchema, buildRequest, systemText, estimateCost, makeClient, parseMessage, collect, repairRequest, mergeRepair, requestsFromPlan} from '../scripts/lead_run/batch_lib.mjs';
import {submit} from '../scripts/lead_run/batch_submit.mjs';
import {buildGlossary} from '../scripts/lead_run/shard_tools.mjs';

// Invented fixture text, not source prose.
const TEXT = '=== 第1章 测试 | member x\np1: 约翰·史密斯在七点钟出门。\np2: 面包九便士，走了三公里。\np3: 无关。';
const scene = {schema: 'lead-run/1.3', beat: 'lr.test.main.0001', order: 1, pov: 'lead', date: {value: 'date-unsettled', label: 'U'}, place: 'x', weight: 'routine',
    deps: [], steps: [{verb: 'buy', class: 'trade', label: 'S'}], touched: [], present: [], knowledge: [], motives: [{tag: 'thrift', locator: 'zh 第1章 p2'}],
    choices: [{taken: 'wait', options: ['wait'], label: 'S', locator: 'zh 第1章 p2'}], options: [], outcomes: [], anchors: [], footprint: null, sealed: [],
    evidence: [{label: 'S', locator: 'zh 第1章 p2', kind: 'narration'}], mechanism: null};
const census = {schema: 'census/1.3', id: 'test.item.bread', label: 'Bread', zh: '面包', nameSource: 'pinyin-unconfirmed', kind: 'item', rung: 'M0', whereabouts: [],
    firstMention: 'zh 第1章 p2', aliases: [], claimant: 'narration', note: 'Sold.'};

function fixture() {
    const dir = mkdtempSync(join(tmpdir(), 'batch-'));
    writeFileSync(join(dir, 'shard.txt'), TEXT);
    return {dir, plan: {label: 't', pass: 'full', world: 'test', privateDir: join(dir, 'p'), outDir: join(dir, 'o'), shards: [{prefix: 'z1', shard: join(dir, 'shard.txt'), base: '0001', chapters: '1-1'}]}};
}
const mockClient = (results, seen = {}) => ({messages: {batches: {
    create: async body => { seen.created = body; return {id: 'msgbatch_test'}; },
    retrieve: async () => ({processing_status: 'ended', request_counts: {succeeded: results.length}}),
    results: async () => (async function* () { yield* results; })(),
}}});
const ok = (id, rows, extra = {}) => ({custom_id: id, result: {type: 'succeeded', message: {stop_reason: 'end_turn', usage: {input_tokens: 1000, output_tokens: 500},
    content: [{type: 'thinking', thinking: ''}, {type: 'text', text: JSON.stringify(rows)}], ...extra}}});

test('request keeps a stable cached system prefix, the format schema and no sampling params', () => {
    const g = buildGlossary({censusRows: [{zh: '约翰·史密斯', id: 'test.person.john', label: 'John', kind: 'person'}]});
    const a = buildRequest({customId: 'a-full', prefix: 'a', base: '0001', shardText: TEXT, glossary: g, pass: 'full', world: 'test'});
    const b = buildRequest({customId: 'b-full', prefix: 'b', base: '0002', shardText: TEXT + '\np4: 他走了。', glossary: g, pass: 'full', world: 'test'});
    assert.equal(a.params.system[0].text, b.params.system[0].text);
    assert.equal(a.params.system[0].cache_control.type, 'ephemeral');
    assert.equal(a.params.model, 'claude-haiku-5-5');
    assert.ok(!('temperature' in a.params) && !('tools' in a.params));
    assert.equal(a.params.output_config.format.type, 'json_schema');
    assert.equal(a._hits, 1);
    assert.ok(a.params.messages[0].content[0].text.includes('test.person.john'));
    const pm = buildRequest({customId: 'c', prefix: 'c', base: '1', shardText: TEXT, pass: 'full', schemaMode: 'prompt'});
    assert.equal(pm.params.output_config.format, undefined);
    assert.match(pm.params.system[0].text, /JSON schema/);
    assert.match(systemText('census', {world: 'test'}), /PASS 1/);
});

test('every schema object forbids extra properties', () => {
    const walk = n => { if (n && typeof n === 'object') { if (n.type === 'object') assert.equal(n.additionalProperties, false); Object.values(n).forEach(walk); } };
    for (const p of ['census', 'scenes', 'full']) walk(shardSchema(p));
});

test('cost estimate is positive, halved for batch, and flags requests over the price tier', () => {
    const r = buildRequest({customId: 'a', prefix: 'a', base: '1', shardText: TEXT, pass: 'full'});
    const e = estimateCost([r], 20000);
    assert.ok(e.usdBatch > 0 && Math.abs(e.usdUncachedStandard - 2 * e.usdBatch) < 1e-3);
    assert.equal(e.requestsOverPromptCap, 0);
});

test('missing key fails clearly and never falls back', async () => {
    await assert.rejects(() => makeClient({ANTHROPIC_AUTH_TOKEN: 'x'}), /ANTHROPIC_API_KEY is not set/);
});

test('dry run writes request and estimate and does not touch the client; live needs a cap', async () => {
    const {plan} = fixture();
    const logs = [];
    let called = false;
    await submit({plan, log: m => logs.push(m), makeClientFn: async () => { called = true; }});
    assert.equal(called, false);
    assert.ok(existsSync(join(plan.outDir, 't_requests.jsonl')) && existsSync(join(plan.outDir, 't_estimate.json')));
    await assert.rejects(() => submit({plan, live: true, maxUsd: 0, log: () => {}}), /exceeds --max-usd/);
    const seen = {};
    const out = await submit({plan, live: true, maxUsd: 5, log: () => {}, makeClientFn: async () => mockClient([], seen)});
    assert.equal(out.receipt.batchId, 'msgbatch_test');
    assert.equal(seen.created.requests[0].custom_id, 'z1-full');
    assert.ok(!JSON.stringify(out.receipt).includes('约翰'));
});

test('collect keys results by custom_id, writes private files, grades, logs usage and builds a repair for lint failures', async () => {
    const {plan: p2} = fixture();
    await submit({plan: p2, log: () => {}});
    const bad = ok('z1-full', {scenes: [{...scene, motives: [{tag: 'peckish', locator: 'zh 第1章 p2'}]}], census: [census], fills: []});
    const sum = await collect({client: mockClient([bad]), batchId: 'b', plan: p2, outDir: p2.outDir, sleep: async () => {}, runTools: false});
    assert.equal(sum.shards[0].status, 'ok');
    assert.ok(sum.shards[0].lintIssues > 0);
    assert.equal(sum.repair.length, 1);
    assert.equal(sum.repair[0].request.custom_id, 'z1-full-repair');
    assert.ok(existsSync(join(p2.privateDir, 'z1_scenes.jsonl')));
    assert.match(readFileSync(join(p2.outDir, 't_usage.csv'), 'utf8'), /z1-full,succeeded,1000,0,0,500/);
    const merged = mergeRepair({scenes: [scene], census: [census], fills: []}, {scenes: [{...scene, place: 'fixed'}]});
    assert.equal(merged.scenes[0].place, 'fixed');
});

test('max_tokens, errored and expired results become repair entries, not crashes', async () => {
    const {plan} = fixture();
    await submit({plan, log: () => {}});
    assert.deepEqual(parseMessage({stop_reason: 'max_tokens', content: []}), {error: 'max_tokens'});
    const sum = await collect({client: mockClient([{custom_id: 'z1-full', result: {type: 'errored', error: {type: 'server_error'}}}, {custom_id: 'nope-full', result: {type: 'expired'}}]),
        batchId: 'b', plan, outDir: plan.outDir, sleep: async () => {}, runTools: false});
    assert.equal(sum.repair[0].why, 'errored');
    assert.equal(sum.shards[1].status, 'unknown-custom-id');
});

test('plan requests rebuild from files with the graded-only glossary filter', () => {
    const {plan, dir} = fixture();
    writeFileSync(join(dir, 'g1m_census.jsonl'), JSON.stringify({zh: '约翰·史密斯', id: 'test.person.john', label: 'John', kind: 'person'}) + '\n');
    writeFileSync(join(dir, 'g1m_header.json'), JSON.stringify({grade: 'B'}));
    writeFileSync(join(dir, 'g3m_census.jsonl'), JSON.stringify({zh: '面包', id: 'test.person.graded-c', label: 'C shard', kind: 'person'}) + '\n');
    writeFileSync(join(dir, 'g3m_header.json'), JSON.stringify({grade: 'C'}));
    writeFileSync(join(dir, 'g2_census.jsonl'), JSON.stringify({zh: '面包', id: 'test.person.bread', label: 'Bread', kind: 'person'}) + '\n');
    const reqs = requestsFromPlan({...plan, glossary: {censusDir: dir, censusMatch: '^g[13]m_census\\.jsonl$'}});
    assert.equal(reqs[0]._hits, 1);
    assert.ok(!reqs[0].params.messages[0].content[0].text.includes('graded-c'), 'a grade C shard never feeds the glossary (PL-A47)');
    assert.ok(!reqs[0].params.messages[0].content[0].text.includes('test.person.bread'));
});

test('A/B comparison reports recall of the reference names and extra names', async () => {
    const {compareShards} = await import('../scripts/lead_run/batch_compare.mjs');
    const ref = {scenes: [scene], census: [{zh: '面包'}, {zh: '约翰.史密斯'}], fills: [], header: {grade: 'B'}};
    const cand = {scenes: [scene], census: [{zh: '约翰·史密斯'}, {zh: '新人'}], fills: [], header: {grade: 'B'}};
    const c = compareShards(ref, cand);
    assert.equal(c.recall, 0.5);
    assert.equal(c.onlyCandidate, 1);
});

test('a scenes pass collected after a census pass keeps the census', async () => {
    const {plan} = fixture();
    const census2 = {...census, zh: '面包'};
    const p1 = {...plan, label: 'c', pass: 'census'}, p2 = {...plan, label: 's', pass: 'scenes'};
    await submit({plan: p1, log: () => {}});
    await collect({client: mockClient([ok('z1-census', {census: [census2]})]), batchId: 'b1', plan: p1, outDir: p1.outDir, sleep: async () => {}});
    const before = readFileSync(join(plan.privateDir, 'z1m_census.jsonl'), 'utf8');
    assert.ok(before.includes('test.item.bread'));
    await collect({client: mockClient([ok('z1-scenes', {scenes: [scene], fills: []})]), batchId: 'b2', plan: p2, outDir: p2.outDir, sleep: async () => {}});
    assert.equal(readFileSync(join(plan.privateDir, 'z1m_census.jsonl'), 'utf8'), before);
    assert.ok(readFileSync(join(plan.privateDir, 'z1m_scenes.jsonl'), 'utf8').includes('lr.test.main.0001'));
    const h = JSON.parse(readFileSync(join(plan.privateDir, 'z1m_header.json'), 'utf8'));
    assert.equal(h.counts.census, 1);
    assert.equal(h.route, 'batch');
});

test('a repair batch submits the written request file, and a second live submit needs --resubmit', async () => {
    const {plan, dir} = fixture();
    await submit({plan, log: () => {}});
    const rf = join(dir, 'repair.jsonl');
    const orig = buildRequest({customId: 'z1-full', prefix: 'z1', base: '0001', shardText: TEXT, pass: 'full', world: 'test'});
    writeFileSync(rf, JSON.stringify(repairRequest({original: orig, failing: {scenes: [scene], census: [], fills: [], codes: ['motive-tag:x']}, shardText: TEXT, pass: 'full'})) + '\n');
    const seen = {};
    const out = await submit({plan, live: true, maxUsd: 5, requestsFile: rf, log: () => {}, makeClientFn: async () => mockClient([], seen)});
    assert.equal(seen.created.requests[0].custom_id, 'z1-full-repair');
    assert.equal(out.receipt.label, 't-repair');
    await assert.rejects(() => submit({plan, live: true, maxUsd: 5, requestsFile: rf, log: () => {}, makeClientFn: async () => mockClient([])}), /already has a receipt/);
});

test('the pinned SDK exposes the batch surface the runner calls', async () => {
    const {default: Anthropic} = await import('@anthropic-ai/sdk');
    const c = new Anthropic({apiKey: 'sk-test-not-real', authToken: null, baseURL: 'https://api.anthropic.com'});
    for (const m of ['create', 'retrieve', 'results']) assert.equal(typeof c.messages.batches[m], 'function', m);
});

test('schemas stay inside the API caps (24 optional properties, 16 unions) and normalize restores nulls', () => {
    for (const pass of ['census', 'scenes', 'full']) {
        let optional = 0, unions = 0;
        const walk = n => {
            if (n && typeof n === 'object') {
                if (n.type === 'object') optional += Object.keys(n.properties).filter(k => !n.required.includes(k)).length;
                if (n.anyOf || Array.isArray(n.type)) unions++;
                Object.values(n).forEach(walk);
            }
        };
        walk(shardSchema(pass));
        assert.ok(optional <= 24, `${pass} optional ${optional}`);
        assert.ok(unions <= 16, `${pass} unions ${unions}`);
    }
    const n = normalize({scenes: [{beat: 'x', date: {value: 'u', label: 'U'}, outcomes: [{fact: 'f', value: 'true', class: 'carried'}]}], census: [{id: 'c'}]});
    assert.deepEqual(n.scenes[0].date, {anchor: null, offsetDays: null, value: 'u', label: 'U'});
    assert.equal(n.scenes[0].footprint, null);
    assert.equal(n.scenes[0].outcomes[0].value, true);
    assert.equal(n.census[0].firstVolume, null);
});
