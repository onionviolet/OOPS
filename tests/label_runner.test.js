// Shared label runner (AU16): the request layout that lets the prompt cache work, and its cost arithmetic.
import test from 'node:test';
import assert from 'node:assert/strict';
import {request, cost} from '../scripts/label_runner.mjs';
import {toBatchLine, toMessage} from '../scripts/lead_run/openai_batch.mjs';

const schema = {type: 'object', additionalProperties: false, required: ['a'], properties: {a: {type: 'string'}}};
const item = {id: 'x:1', shared: 'Evidence:\n[wiki:A#intro] text', user: 'Question?\n\nSubject: A'};

test('OpenAI: the shared evidence is a developer message after the instructions, the question a user message', () => {
    const line = toBatchLine(request({model: 'gpt-6-luna', system: 'RULES', schema}, item, 3));
    assert.equal(line.custom_id, 'r3');
    assert.equal(line.body.instructions, 'RULES');
    assert.deepEqual(line.body.input.map(m => m.role), ['developer', 'user']);
    assert.equal(line.body.input[0].content[0].text, item.shared);
    assert.match(line.body.prompt_cache_key, /^yairpg-/);
});

test('Anthropic: the system is marked; the evidence is marked only when another pass reuses it', () => {
    const plain = request({model: 'claude-haiku-5-5', system: 'RULES', schema}, item, 0).params;
    assert.ok(plain.system[0].cache_control);
    assert.equal(plain.messages.length, 1);
    assert.equal(plain.messages[0].content[0].cache_control, undefined);
    const reused = request({model: 'claude-haiku-5-5', system: 'RULES', schema, reuse: true}, item, 0).params;
    assert.ok(reused.messages[0].content[0].cache_control);
});

test('OpenAI usage splits plain, read and written input, and the write rate is charged', () => {
    const m = toMessage({status: 'completed', output: [], usage: {input_tokens: 2000, input_tokens_details: {cached_tokens: 1500, cache_write_tokens: 400}, output_tokens: 100}});
    assert.deepEqual([m.usage.input_tokens, m.usage.cache_read_input_tokens, m.usage.cache_creation_input_tokens], [100, 1500, 400]);
    const usd = cost('gpt-6-luna', {in: 100, cached: 1500, written: 400, out: 100}, {batch: false});
    assert.equal(Number(usd.toFixed(8)), Number(((100 * 0.10 + 1500 * 0.01 + 400 * 0.125 + 100 * 0.50) / 1e6).toFixed(8)));
    assert.equal(cost('gpt-6-luna', {in: 100, cached: 0, written: 0, out: 100}, {batch: true}), (100 * 0.10 + 100 * 0.50) / 1e6 / 2);
});
