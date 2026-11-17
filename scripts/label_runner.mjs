#!/usr/bin/env node
// Shared runner for paid label passes (AU16, 2026-11-16). One pass = a common `system` header + per item an optional
// `shared` evidence block and a `user` question + a strict schema. The opening goes to the provider's prompt cache (OpenAI
// `instructions` with a `prompt_cache_key`; Anthropic `cache_control` blocks), and the run goes by batch at half price
// unless `--sync` is asked for.
//
// Order inside a request, most shared first, because a cache matches only a request's opening: one header common to every
// pass (`system`), then the item's evidence (`shared`, byte-identical for every pass that reads it, so passes sent
// together share it), then this pass's question and subject (`user`). Caching starts only at 1,024 identical leading tokens (OpenAI) or the model's minimum
// (Anthropic), so a short system text alone earns nothing; the evidence block is where the saving is. Better still,
// ask every question about one packet in one request.
//
// Replies land in <dir>/<name>_<suffix>.json as {id: {reply, usage: {in, cached, out}}}, the shape every normaliser
// here already reads, so a pass can move between sync and batch without touching its scorer.
//
//   import {runPass} from './label_runner.mjs';
//   await runPass({name, dir, system, schema, items: [{id, user}], model: 'gpt-6-luna', effort: 'low', maxTokens: 16000}, argv);
//
// Modes (argv): default `--batch` submits and writes <name>_<suffix>.batch.json, then exits; run again to collect (it polls
// once and exits while the batch is running). `--wait` polls every 60 s until done. `--sync` calls directly, eight at a
// time, for pilots and debugging that need a quick answer. `--dry` prints the estimate and the cache shape and sends nothing.
// `--max-usd N` refuses a submit whose bound (every item at maxTokens out) is over N. Keys come from the Keychain into env:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)"
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)"
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {makeOpenAIClient, strictSchema, toMessage, isOpenAIModel} from './lead_run/openai_batch.mjs';

// Standard per-million rates; batch is half. Reads are a tenth of input on both. Writes: gpt-6-luna writes every prompt over
// 1,024 tokens on its own at 1.25x input (measured 2026-11-16); Anthropic writes only marked blocks, 1.25x for 5 minutes and
// 2x for an hour, so a block is marked only when something will read it again (`reuse`).
export const RATES = {'gpt-6-luna': {in: 0.10, cached: 0.01, write: 0.125, out: 0.50},
    'claude-haiku-5-5': {in: 0.10, cached: 0.01, write: 0.20, out: 0.50},
    // GPT-6.1 Sol: $2 in, $0.10 cached, $10 out per million (OpenAI's announcement, 2026-11-17). The cache-write rate is an
    // assumption (Luna's 1.25x), not measured; read real cost from `usage`.
    'gpt-6.1-sol': {in: 2, cached: 0.10, write: 2.5, out: 10},
    // Claude Sonnet 5.5: $2 in, $10 out; reads 0.1x; writes 2x (the runner marks 1-hour blocks).
    'claude-sonnet-5-5': {in: 2, cached: 0.20, write: 4, out: 10}};

const sha = s => createHash('sha1').update(s).digest('hex').slice(0, 12);
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, JSON.stringify(value));
const flag = (argv, name) => argv.includes(name);
const opt = (argv, name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);

/**
 * One item as an Anthropic-shaped request, the shape openai_batch.mjs translates. custom_id is positional (ids carry ':').
 * Where the shared evidence goes, measured 2026-11-16: OpenAI reuses a cached prefix only up to the end of `instructions` or a
 * developer message (a second question after the same evidence in a user message wrote the whole prompt again), so on OpenAI
 * the evidence is its own developer message. Anthropic caches up to a marked block, so the evidence block is marked when
 * `pass.reuse` says another pass reads it within the hour; unmarked, it costs plain input.
 */
export function request(pass, item, index) {
    const openai = isOpenAIModel(pass.model), mark = {type: 'ephemeral', ttl: '1h'};
    const text = (t, cache) => ({type: 'text', text: t, ...(cache && !openai ? {cache_control: mark} : {})});
    const messages = !item.shared ? [{role: 'user', content: [text(item.user)]}]
        : openai ? [{role: 'developer', content: [text(item.shared)]}, {role: 'user', content: [text(item.user)]}]
        : [{role: 'user', content: [text(item.shared, pass.reuse), text(item.user)]}];
    return {custom_id: `r${index}`, params: {model: pass.model, max_tokens: pass.maxTokens ?? 16000,
        system: [text(pass.system, true)], messages,
        output_config: {effort: pass.effort ?? 'low', format: {type: 'json_schema', schema: pass.schema}}}};
}

// in: plain input; cached: read from cache; written: written to cache (billed at the write rate); out: output.
const usageOf = u => ({in: u.input_tokens ?? 0, cached: u.cache_read_input_tokens ?? 0, written: u.cache_creation_input_tokens ?? 0, out: u.output_tokens ?? 0});
export function cost(model, usage, {batch}) {
    const r = RATES[model] ?? RATES['gpt-6-luna'];
    const usd = (usage.in * r.in + (usage.cached ?? 0) * r.cached + (usage.written ?? 0) * (r.write ?? r.in) + usage.out * r.out) / 1e6;
    return batch ? usd / 2 : usd;
}
const parse = message => JSON.parse(message.content.filter(b => b.type === 'text').map(b => b.text).join(''));

function anthropic() {
    if (!process.env.ANTHROPIC_API_KEY) throw Error('ANTHROPIC_API_KEY is not set; load it from the Keychain into this process only.');
    return import('@anthropic-ai/sdk').then(m => new m.default());
}

async function syncCall(pass, req) {
    if (isOpenAIModel(pass.model)) {
        const res = await fetch('https://api.openai.com/v1/responses', {method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}`},
            body: JSON.stringify({model: pass.model, instructions: pass.system, prompt_cache_key: `yairpg-${sha(pass.system)}`, store: false,
                reasoning: {effort: pass.effort ?? 'low'}, max_output_tokens: pass.maxTokens ?? 16000,
                input: req.params.messages.map(m => ({role: m.role, content: m.content.map(b => ({type: 'input_text', text: b.text}))})),
                text: {format: {type: 'json_schema', name: 'row', schema: strictSchema(pass.schema), strict: true}}})});
        const body = await res.json();
        if (!res.ok) throw Object.assign(Error(`${res.status}: ${JSON.stringify(body.error ?? body).slice(0, 200)}`), {retry: res.status === 429 || res.status >= 500});
        return toMessage(body);
    }
    const client = await anthropic();
    return client.messages.create(req.params);
}

/** Run a pass. Returns {replies, done: boolean}. */
export async function runPass(pass, argv = process.argv.slice(2)) {
    const suffix = pass.suffix ?? (isOpenAIModel(pass.model) ? 'luna' : 'haiku');
    const file = `${pass.dir}${pass.name}_${suffix}.json`, receipt = `${pass.dir}${pass.name}_${suffix}.batch.json`;
    const replies = existsSync(file) ? json(file) : {};
    const todo = pass.items.filter(item => !replies[item.id]?.reply);
    const batch = !flag(argv, '--sync');
    const chars = todo.reduce((s, item) => s + item.user.length + (item.shared?.length ?? 0), 0);
    const estimate = {pass: pass.name, model: pass.model, items: todo.length, mode: batch ? 'batch' : 'sync',
        systemTokens: Math.round(pass.system.length / 4), userTokens: Math.round(chars / 4),
        bound: Number(cost(pass.model, {in: (chars + pass.system.length * todo.length) / 4, cached: 0, out: todo.length * (pass.maxTokens ?? 16000)}, {batch}).toFixed(4))};
    if (flag(argv, '--dry') || !todo.length) { console.log(JSON.stringify({...estimate, done: !todo.length})); return {replies, done: !todo.length}; }
    const cap = Number(opt(argv, '--max-usd') ?? pass.maxUsd ?? Infinity);
    if (!existsSync(receipt) && estimate.bound > cap) throw Error(`${pass.name}: bound $${estimate.bound} is over --max-usd ${cap}`);

    if (!batch) {
        for (let i = 0; i < todo.length; i += 8) {
            await Promise.all(todo.slice(i, i + 8).map(async (item, k) => {
                const req = request(pass, item, i + k);
                for (let attempt = 0; ; attempt++) {
                    try { const m = await syncCall(pass, req); replies[item.id] = {reply: parse(m), usage: usageOf(m.usage)}; break; }
                    catch (e) { if (attempt >= 3 || e.retry === false) { replies[item.id] = {error: String(e.message ?? e)}; break; } await new Promise(r => setTimeout(r, 2000 * 2 ** attempt)); }
                }
            }));
            write(file, replies);
        }
        return report(pass, replies, {batch: false});
    }

    const client = isOpenAIModel(pass.model) ? makeOpenAIClient() : await anthropic();
    let state = existsSync(receipt) ? json(receipt) : null;
    if (!state) {
        const ids = todo.map(item => item.id);
        const created = await client.messages.batches.create({requests: todo.map((item, i) => request(pass, item, i))});
        state = {provider: isOpenAIModel(pass.model) ? 'openai' : 'anthropic', id: created.id, ids, systemSha: sha(pass.system), submitted: new Date().toISOString(), estimate};
        write(receipt, state);
        console.log(JSON.stringify({submitted: pass.name, batch: created.id, items: ids.length, bound: estimate.bound}));
    }
    for (;;) {
        const status = await client.messages.batches.retrieve(state.id);
        if (status.processing_status === 'ended') break;
        if (!flag(argv, '--wait')) { console.log(JSON.stringify({pass: pass.name, batch: state.id, status: status.processing_status, counts: status.request_counts})); return {replies, done: false}; }
        await new Promise(r => setTimeout(r, 60000));
    }
    for await (const item of await client.messages.batches.results(state.id)) {
        const id = state.ids[Number(item.custom_id.slice(1))];
        if (item.result.type !== 'succeeded') { replies[id] = {error: item.result.type + (item.result.error ? `: ${JSON.stringify(item.result.error).slice(0, 160)}` : '')}; continue; }
        try { replies[id] = {reply: parse(item.result.message), usage: usageOf(item.result.message.usage), batch: true}; }
        catch (e) { replies[id] = {error: `parse: ${e.message}`}; }
    }
    write(file, replies);
    if (client.messages.batches.cleanup) await client.messages.batches.cleanup(state.id);
    write(receipt, {...state, collected: new Date().toISOString()});
    return report(pass, replies, {batch: true});
}

function report(pass, replies, {batch}) {
    const ok = Object.values(replies).filter(r => r.reply);
    const usage = ok.reduce((s, r) => ({in: s.in + r.usage.in, cached: s.cached + (r.usage.cached ?? 0), out: s.out + r.usage.out, written: s.written + (r.usage.written ?? 0)}),
        {in: 0, cached: 0, out: 0, written: 0});
    const usd = ok.reduce((s, r) => s + cost(pass.model, r.usage, {batch: r.batch ?? false}), 0);
    console.log(JSON.stringify({pass: pass.name, items: pass.items.length, ok: ok.length, errors: Object.values(replies).filter(r => r.error).length,
        ...usage, cachedShare: usage.in + usage.cached + usage.written ? Number((usage.cached / (usage.in + usage.cached + usage.written)).toFixed(3)) : 0, usd: Number(usd.toFixed(4)), mode: batch ? 'batch' : 'sync'}));
    return {replies, done: true};
}
