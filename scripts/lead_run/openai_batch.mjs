// OpenAI Batch API backend for the batch reader (2026-11-08). Paid route: Weibao's explicit go per run, same as `anthropic-batch` (AU7).
// Requests stay in the Anthropic shape the reader builds (system / messages / output_config); this file translates each one to a
// Responses API batch line, and wraps the Files + Batches endpoints in a client with the `messages.batches` surface collect() already uses,
// so submit, collect, the gates and the overnight driver run unchanged. Source text goes to OpenAI: `store: false` keeps responses unstored, but the uploaded
// request file and the output file sit in the project's Files storage (output 30 days) until `cleanup` deletes them after the summary is written.
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node scripts/lead_run/batch_submit.mjs --plan <plan> ...
// Prices: developers.openai.com/api/docs/pricing and the gpt-6-luna model page, read 2026-11-08 (standard per 1M tokens; Batch is half).

export const OPENAI_BASE = 'https://api.openai.com/v1';
export const OPENAI_DEFAULT = 'gpt-6-luna';
// Cache writes are 1.25x input on the model page, but batch usage reports only cached reads; check the pilot's usage object and set the factor if writes appear.
const P = (inPerM, outPerM, cached = 0.1) => ({inPerM, outPerM, batchFactor: 0.5, cacheReadFactor: cached, cacheWriteFactor: 0, promptCap: 272000});
// Standard rates; the batch rate is half. 272K input is the long-context price step on the pricing page.
export const OPENAI_PRICES = Object.freeze({
    'gpt-6-luna': P(0.10, 0.50),
    'gpt-5.6-luna': P(0.20, 1.20),
    'gpt-6.1-terra': P(1.00, 5.00, 0.05),
    'gpt-5-nano': P(0.05, 0.40),
    'gpt-5-mini': P(0.25, 2.00),
    'gpt-5.4-nano': P(0.20, 1.25),
    'gpt-5.4-mini': P(0.75, 4.50),
});

export const isOpenAIModel = model => /^(gpt-|o\d)/.test(String(model || ''));
// Anthropic effort names map one to one; OpenAI also has none / xhigh / max, passed through when a plan names them.
const EFFORTS = new Set(['none', 'low', 'medium', 'high', 'xhigh', 'max']);

/** One reader request (Anthropic shape) -> one Batch JSONL line for /v1/responses. */
export function toBatchLine({custom_id, params}) {
    const instructions = (params.system || []).map(b => b.text).join('\n\n');
    const body = {
        model: params.model, instructions, store: false, max_output_tokens: params.max_tokens,
        input: (params.messages || []).map(m => ({role: m.role, content: m.content.filter(b => b.type === 'text').map(b => ({type: 'input_text', text: b.text}))})),
        // Strict grammar: a non-strict schema let gpt-6-luna drop required fields (2026-11-08 CoI census: `whereabouts` missing on every row, 14 of 16 grade C).
        text: {format: params.output_config?.format ? {type: 'json_schema', name: 'shard_rows', schema: strictSchema(params.output_config.format.schema), strict: true} : {type: 'json_object'}},
        // The stable instructions are the cached prefix; one key per prefix keeps a pass's shards on the same cache.
        prompt_cache_key: `yairpg-${hash(instructions)}`,
    };
    const effort = params.output_config?.effort;
    if (effort && EFFORTS.has(effort)) body.reasoning = {effort};
    return {custom_id, method: 'POST', url: '/v1/responses', body};
}

/**
 * OpenAI strict mode needs every property listed in `required` and `additionalProperties: false`. A property the reader schema leaves optional
 * becomes nullable; toMessage() drops the nulls again, so rows match what the Anthropic route returns (a required field never takes null).
 */
export function strictSchema(s) {
    if (Array.isArray(s)) return s.map(strictSchema);
    if (!s || typeof s !== 'object') return s;
    const out = Object.fromEntries(Object.entries(s).map(([k, v]) => [k, k === 'properties' ? Object.fromEntries(Object.entries(v).map(([p, ps]) => [p, strictSchema(ps)])) : strictSchema(v)]));
    if (s.type === 'object' && s.properties) {
        const req = new Set(s.required || []);
        for (const [p, ps] of Object.entries(out.properties)) if (!req.has(p)) out.properties[p] = {anyOf: [ps, {type: 'null'}]};
        out.required = Object.keys(s.properties);
        out.additionalProperties = false;
    }
    return out;
}

/** Drop object keys whose value is null (only strict-mode optional fields can be null). */
export function dropNulls(v) {
    if (Array.isArray(v)) return v.map(dropNulls);
    if (!v || typeof v !== 'object') return v;
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null).map(([k, x]) => [k, dropNulls(x)]));
}

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }

/** A Responses API body -> the Anthropic-shaped message parseMessage() and usageUsd() read. Reasoning items are dropped like thinking blocks. */
export function toMessage(body = {}) {
    const parts = (body.output || []).filter(o => o.type === 'message').flatMap(o => o.content || []);
    let text = parts.filter(p => p.type === 'output_text').map(p => p.text).join('');
    if (body.status === 'completed') try { text = JSON.stringify(dropNulls(JSON.parse(text))); } catch { /* left as is: the parser reports it */ }
    const refused = parts.some(p => p.type === 'refusal');
    const reason = body.incomplete_details?.reason;
    const stop_reason = body.status === 'incomplete' ? (reason === 'max_output_tokens' ? 'max_tokens' : 'refusal') : refused && !text ? 'refusal' : 'end_turn';
    const u = body.usage || {}, cached = u.input_tokens_details?.cached_tokens || 0;
    return {stop_reason, content: [{type: 'text', text}],
        usage: {input_tokens: Math.max(0, (u.input_tokens || 0) - cached), cache_read_input_tokens: cached, cache_creation_input_tokens: 0, output_tokens: u.output_tokens || 0,
            reasoning_tokens: u.output_tokens_details?.reasoning_tokens || 0}};
}

/** One output or error file line -> the result item collect() iterates. */
export function toResultItem(line) {
    const r = line.response;
    if (r && r.status_code === 200 && r.body) return {custom_id: line.custom_id, result: {type: 'succeeded', message: toMessage(r.body)}};
    return {custom_id: line.custom_id, result: {type: 'errored', error: line.error || {code: `http-${r?.status_code ?? 'none'}`, message: r?.body?.error?.message || ''}}};
}

const TERMINAL = new Set(['completed', 'failed', 'expired', 'cancelled']);
const jsonl = text => text.split('\n').filter(l => l.trim()).map(l => JSON.parse(l));

/** Client with the `messages.batches` surface of the Anthropic SDK. The key is read here only; no fallback key, base URL or model. */
export function makeOpenAIClient(env = process.env, {fetchFn = globalThis.fetch} = {}) {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set. This is a paid API route and has no fallback. Run it with the key loaded into the child environment only, ' +
        'for example: OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node <script> ...');
    const auth = {Authorization: `Bearer ${apiKey}`};
    const call = async (path, init = {}) => {
        const res = await fetchFn(`${OPENAI_BASE}${path}`, {...init, headers: {...auth, ...(init.headers || {})}});
        if (!res.ok) throw new Error(`OpenAI ${init.method || 'GET'} ${path}: ${res.status} ${(await res.text()).slice(0, 300)}`);
        return res;
    };
    const fileText = async id => (await call(`/files/${id}/content`)).text();
    return {provider: 'openai', messages: {batches: {
        async create({requests}) {
            const form = new FormData();
            form.append('purpose', 'batch');
            form.append('file', new Blob([requests.map(r => JSON.stringify(toBatchLine(r))).join('\n') + '\n'], {type: 'application/jsonl'}), 'requests.jsonl');
            const file = await (await call('/files', {method: 'POST', body: form})).json();
            const batch = await (await call('/batches', {method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({input_file_id: file.id, endpoint: '/v1/responses', completion_window: '24h'})})).json();
            return {id: batch.id, inputFileId: file.id};
        },
        async retrieve(id) {
            const b = await (await call(`/batches/${id}`)).json(), c = b.request_counts || {};
            return {id, status: b.status, processing_status: TERMINAL.has(b.status) ? 'ended' : b.status, errors: b.errors || null,
                request_counts: {processing: Math.max(0, (c.total || 0) - (c.completed || 0) - (c.failed || 0)), succeeded: c.completed || 0, errored: c.failed || 0, total: c.total || 0},
                _files: {input: b.input_file_id, output: b.output_file_id, error: b.error_file_id}};
        },
        /** Output lines, then error lines, then an `errored` item for every input id with neither (a failed, expired or cancelled batch), so no shard goes uncounted by the gates. */
        async results(id) {
            const b = await this.retrieve(id), seen = new Set(), items = [];
            for (const f of [b._files.output, b._files.error]) if (f) for (const line of jsonl(await fileText(f))) { seen.add(line.custom_id); items.push(toResultItem(line)); }
            // Ids with no line: read back from the input file when the API allows it; collect() also marks any plan shard it never saw as missing.
            let inputLines = [];
            if (b._files.input) try { inputLines = jsonl(await fileText(b._files.input)); } catch { inputLines = []; }
            for (const line of inputLines) if (!seen.has(line.custom_id))
                items.push({custom_id: line.custom_id, result: {type: b.status === 'expired' ? 'expired' : 'errored', error: {code: `batch-${b.status}`}}});
            return (async function* () { yield* items; })();
        },
        /** Delete the batch's input, output and error files from OpenAI storage. Call only after the summary is written: outputs are then private files here. */
        async cleanup(id) {
            const b = await this.retrieve(id), gone = [];
            for (const f of Object.values(b._files)) if (f) { await call(`/files/${f}`, {method: 'DELETE'}); gone.push(f); }
            return gone;
        },
    }}};
}
