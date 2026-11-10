import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildRequest, estimateCost, makeClient, parseMessage, usageUsd, collect} from '../scripts/lead_run/batch_lib.mjs';
import {submit} from '../scripts/lead_run/batch_submit.mjs';
import {toBatchLine, toMessage, makeOpenAIClient, isOpenAIModel} from '../scripts/lead_run/openai_batch.mjs';
import {ACTION_CLASSES, MOTIVES, KINDS, RULE_KINDS} from '../scripts/lead_run/lint_lead_run.mjs';

// Invented fixture text, not source prose.
const TEXT = '=== 第1章 测试 | member x\np1: 约翰·史密斯在七点钟出门。\np2: 面包九便士，走了三公里。\np3: 无关。';
const reply = (rows, extra = {}) => ({status: 'completed', output: [{type: 'reasoning', summary: []}, {type: 'message', content: [{type: 'output_text', text: JSON.stringify(rows)}]}],
    usage: {input_tokens: 3000, input_tokens_details: {cached_tokens: 2000}, output_tokens: 900, output_tokens_details: {reasoning_tokens: 600}}, ...extra});

test('OpenAI 1.5 scene requests constrain paragraph citations and action vocabularies', () => {
    const request = {customId: 'a-scenes', prefix: 'a', base: '0001', shardText: TEXT,
        pass: 'scenes', world: 'test', model: 'gpt-6-luna'};
    const sceneSchema = version => toBatchLine(buildRequest({...request, version})).body.text.format.schema.properties.scenes.items.properties;
    const current = sceneSchema('1.5');
    const locator = new RegExp(current.evidence.items.properties.locator.pattern);
    assert.ok(locator.test('zh b2 第1章 p4'));
    assert.ok(locator.test('en b1 c1 p4'));
    assert.ok(!locator.test('en b1 c1 p4-p6'));
    assert.ok(!locator.test('en b1 c1'));
    assert.deepEqual(current.steps.items.properties.class.enum, ACTION_CLASSES);
    assert.deepEqual(current.options.items.properties.class.enum, ACTION_CLASSES);
    assert.deepEqual(current.motives.items.properties.tag.enum, MOTIVES);
    assert.equal(sceneSchema('1.3').evidence.items.properties.locator.pattern, undefined);
    const census = toBatchLine(buildRequest({...request, pass: 'census', version: '1.5'})).body.text.format.schema.properties.census.items.properties;
    assert.deepEqual(census.kind.enum, [...new Set([...KINDS, ...RULE_KINDS])]);
});

/** Fake Files + Batches endpoints: records uploads, serves the uploaded input file and canned output/error lines. */
function fakeOpenAI({status = 'completed', output = [], errors = [], inputReadable = true} = {}) {
    const files = {}, calls = [];
    const res = (body, ok = true) => ({ok, status: ok ? 200 : 400, json: async () => body, text: async () => typeof body === 'string' ? body : JSON.stringify(body)});
    const fetchFn = async (url, init = {}) => {
        const path = url.replace('https://api.openai.com/v1', ''), method = init.method || 'GET';
        calls.push({method, path, auth: init.headers?.Authorization});
        if (method === 'POST' && path === '/files') { files.in = await init.body.get('file').text(); return res({id: 'file_in'}); }
        if (method === 'POST' && path === '/batches') { calls.at(-1).body = JSON.parse(init.body); return res({id: 'batch_1', status: 'validating'}); }
        if (method === 'DELETE') return res({id: path.split('/').pop(), deleted: true});
        if (path === '/files/file_in/content' && !inputReadable) return res('not allowed', false);
        if (path === '/batches/batch_1') return res({id: 'batch_1', status, input_file_id: 'file_in', output_file_id: output.length ? 'file_out' : null, error_file_id: errors.length ? 'file_err' : null,
            request_counts: {total: 3, completed: output.length, failed: errors.length}});
        const lines = {'/files/file_in/content': files.in, '/files/file_out/content': output.map(o => JSON.stringify(o)).join('\n'), '/files/file_err/content': errors.map(o => JSON.stringify(o)).join('\n')};
        if (path in lines) return res(lines[path] || '');
        return res('not found', false);
    };
    return {fetchFn, files, calls};
}

test('a reader request becomes a Responses batch line with the same instructions, schema, effort and output cap', () => {
    const req = buildRequest({customId: 'a-census', prefix: 'a', base: '0001', shardText: TEXT, pass: 'census', world: 'test', model: 'gpt-6-luna', effort: 'high', maxTokens: 128000});
    const line = toBatchLine(req);
    assert.equal(line.url, '/v1/responses');
    assert.equal(line.custom_id, 'a-census');
    assert.equal(line.body.model, 'gpt-6-luna');
    assert.equal(line.body.instructions, req.params.system[0].text);
    assert.equal(line.body.max_output_tokens, 128000);
    assert.deepEqual(line.body.reasoning, {effort: 'high'});
    assert.equal(line.body.store, false, 'source text is not stored on the provider');
    assert.equal(line.body.text.format.type, 'json_schema');
    assert.equal(line.body.text.format.strict, true, 'strict grammar keeps required fields');
    const walk = n => { if (n && typeof n === 'object') { if (n.type === 'object' && n.properties) { assert.deepEqual([...n.required].sort(), Object.keys(n.properties).sort()); assert.equal(n.additionalProperties, false); } Object.values(n).forEach(walk); } };
    walk(line.body.text.format.schema);
    assert.equal(line.body.input[0].content.at(-1).text, TEXT);
    const other = toBatchLine(buildRequest({customId: 'b-census', prefix: 'b', base: '0002', shardText: TEXT + '\np4: 他走了。', pass: 'census', world: 'test', model: 'gpt-6-luna'}));
    assert.equal(other.body.prompt_cache_key, line.body.prompt_cache_key, 'shards of one pass share the cache key');
    const prompt = toBatchLine(buildRequest({customId: 'c-rules', prefix: 'c', base: '1', shardText: TEXT, pass: 'rules', world: 'test', model: 'gpt-6-luna'}));
    assert.equal(prompt.body.text.format.type, 'json_schema', 'OpenAI has no optional-property cap, so the large passes get a strict schema too');
});

test('responses map to the message shape the parser reads: text, cut-off and cached usage', () => {
    const m = toMessage(reply({rules: []}));
    assert.equal(m.stop_reason, 'end_turn');
    assert.deepEqual(parseMessage(m).rows.rules, []);
    assert.deepEqual([m.usage.input_tokens, m.usage.cache_read_input_tokens, m.usage.output_tokens], [1000, 2000, 900]);
    const cut = toMessage({status: 'incomplete', incomplete_details: {reason: 'max_output_tokens'}, output: [{type: 'message', content: [{type: 'output_text', text: '{"rules": [{"id": "x"}, {"id"'}]}]});
    assert.equal(cut.stop_reason, 'max_tokens');
    assert.equal(parseMessage(cut).partial, true, 'complete rows before the cut are salvaged as with Haiku');
    assert.equal(toMessage({status: 'completed', output: [{type: 'message', content: [{type: 'refusal', refusal: 'no'}]}]}).stop_reason, 'refusal');
    const nulls = toMessage(reply({rules: [{id: 'x', recurrence: null, inputs: [{item: 'y', unit: null}]}]}));
    assert.deepEqual(JSON.parse(nulls.content[0].text), {rules: [{id: 'x', inputs: [{item: 'y'}]}]}, 'strict-mode nulls for optional fields are dropped');
    // gpt-6-luna batch: $0.05 in, $0.005 cached, $0.25 out per 1M.
    assert.equal(Number(usageUsd(m.usage, 'gpt-6-luna').toFixed(8)), Number(((1000 * 0.05 + 2000 * 0.005 + 900 * 0.25) / 1e6).toFixed(8)));
});

test('estimates use the OpenAI price row, and an unpriced OpenAI model is refused rather than priced as Haiku', () => {
    const req = buildRequest({customId: 'a-census', prefix: 'a', base: '1', shardText: TEXT, pass: 'census', world: 'test', model: 'gpt-6-luna'});
    const luna = estimateCost([req], 10000, 'gpt-6-luna'), terra = estimateCost([req], 10000, 'gpt-6.1-terra');
    assert.ok(terra.usdBatch > 5 * luna.usdBatch);
    assert.throws(() => estimateCost([req], 10000, 'gpt-9-unknown'), /no price row/);
    assert.ok(isOpenAIModel('gpt-6-luna') && !isOpenAIModel('claude-haiku-5-5'));
});

test('the OpenAI route needs its own key and never falls back to the Anthropic one', async () => {
    await assert.rejects(makeClient({ANTHROPIC_API_KEY: 'sk-ant-test'}, {model: 'gpt-6-luna'}), /OPENAI_API_KEY is not set/);
    const c = await makeClient({OPENAI_API_KEY: 'sk-test'}, {model: 'gpt-6-luna'});
    assert.equal(c.provider, 'openai');
});

test('submit uploads one JSONL file and a 24h /v1/responses batch; collect reads output, error and unanswered ids', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'oa-'));
    writeFileSync(join(dir, 's.txt'), TEXT);
    const shards = ['z1', 'z2', 'z3'].map(p => ({prefix: p, shard: join(dir, 's.txt'), base: '1', chapters: '1-1'}));
    const plan = {label: 't', pass: 'rules', world: 'test', model: 'gpt-6-luna', effort: 'high', maxTokens: 64000, privateDir: join(dir, 'p'), outDir: join(dir, 'o'), shards};
    const rule = {id: 'test.craft.bread', name: 'Bread', kind: 'craft', conditions: [], steps: [], products: [], inputs: [], costs: [], results: [], limits: [], consequences: [], who: [], label: 'T', locator: 'zh 第1章 p2'};
    const fake = fakeOpenAI({status: 'expired',
        output: [{id: 'r1', custom_id: 'z1-rules', response: {status_code: 200, body: reply({rules: [rule], other: []})}, error: null}],
        errors: [{id: 'r2', custom_id: 'z2-rules', response: null, error: {code: 'batch_expired', message: 'expired'}}]});
    const client = makeOpenAIClient({OPENAI_API_KEY: 'sk-test'}, {fetchFn: fake.fetchFn});
    const {receipt} = await submit({plan, live: true, maxUsd: 1, log: () => {}, makeClientFn: async () => client});
    assert.equal(receipt.batchId, 'batch_1');
    const created = fake.calls.find(c => c.path === '/batches' && c.method === 'POST').body;
    assert.deepEqual(created, {input_file_id: 'file_in', endpoint: '/v1/responses', completion_window: '24h'});
    assert.equal(fake.files.in.trim().split('\n').length, 3);
    assert.ok(fake.calls.every(c => c.auth === 'Bearer sk-test'));
    const sum = await collect({client, batchId: 'batch_1', plan, outDir: plan.outDir, sleep: async () => {}, runTools: false});
    const by = Object.fromEntries(sum.shards.map(s => [s.id, s.status]));
    assert.deepEqual(by, {'z1-rules': 'ok', 'z2-rules': 'errored', 'z3-rules': 'expired'}, 'an id with no output line still counts against the gate');
    assert.ok(sum.usd > 0);
    assert.deepEqual(await client.messages.batches.cleanup('batch_1'), ['file_in', 'file_out', 'file_err'], 'uploaded source text and outputs are deleted after collect');
});

test('when the input file cannot be read back, collect still marks unanswered plan shards as missing', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'oa-'));
    writeFileSync(join(dir, 's.txt'), TEXT);
    const plan = {label: 't', pass: 'rules', world: 'test', model: 'gpt-6-luna', privateDir: join(dir, 'p'), outDir: join(dir, 'o'),
        shards: ['z1', 'z2'].map(p => ({prefix: p, shard: join(dir, 's.txt'), base: '1', chapters: '1-1'}))};
    const fake = fakeOpenAI({status: 'failed', inputReadable: false});
    const client = makeOpenAIClient({OPENAI_API_KEY: 'sk-test'}, {fetchFn: fake.fetchFn});
    await client.messages.batches.create({requests: []});
    const sum = await collect({client, batchId: 'batch_1', plan, outDir: plan.outDir, sleep: async () => {}, runTools: false});
    assert.deepEqual(sum.shards.map(s => s.status), ['missing', 'missing']);
    assert.equal(sum.repair.length, 2);
});

test('a live submit refuses shards in flight, and already-read shards unless the plan names the fix', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'oa-'));
    writeFileSync(join(dir, 's.txt'), TEXT);
    const shards = ['z1', 'z2', 'z3'].map(p => ({prefix: p, shard: join(dir, 's.txt'), base: '1', chapters: '1-1'}));
    const plan = {label: 'b-census-oa', pass: 'census', world: 'test', model: 'gpt-6-luna', privateDir: join(dir, 'p'), outDir: join(dir, 'p', 'batch'), shards};
    mkdirSync(plan.outDir, {recursive: true});
    writeFileSync(join(plan.privateDir, 'z1m_census.jsonl'), '{}\n');               // read earlier (Haiku)
    writeFileSync(join(plan.outDir, 'b-census_receipt.json'), '{}');                // a Haiku label submitted, not collected
    writeFileSync(join(plan.outDir, 'b-census_requests.jsonl'), JSON.stringify({custom_id: 'z2-census', params: {}}) + '\n');
    const sent = [];
    const makeClientFn = async () => ({messages: {batches: {create: async b => { sent.push(b); return {id: 'batch_x'}; }}}});
    const dry = await submit({plan, log: () => {}});
    assert.deepEqual(dry.estimate.overlap, {alreadyRead: 1, inFlight: [{label: 'b-census', shards: 1}]});
    await assert.rejects(submit({plan, live: true, maxUsd: 1, log: () => {}, makeClientFn}), /1 shard\(s\) in flight under b-census/);
    await assert.rejects(submit({plan: {...plan, reread: 'grade C fix'}, live: true, maxUsd: 1, log: () => {}, makeClientFn}), /in flight/, 'a stated fix never races a live batch');
    assert.equal(sent.length, 0);
    writeFileSync(join(plan.outDir, 'b-census_summary.json'), '{}');                // collected: no longer in flight
    await assert.rejects(submit({plan, live: true, maxUsd: 1, log: () => {}, makeClientFn}), /1 shard\(s\) already read/);
    const {receipt} = await submit({plan: {...plan, reread: 'z1 graded C: read whole again'}, live: true, maxUsd: 1, log: () => {}, makeClientFn});
    assert.equal(sent.length, 1, 'a reread that names its fix goes through');
    assert.deepEqual([receipt.reread, receipt.rereadShards], ['z1 graded C: read whole again', 1], 'the receipt records why the shard was paid for twice');
});
