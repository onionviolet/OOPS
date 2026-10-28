// Message Batches reading protocol (v4): one structured request per shard, pass 1 census then pass 2 scenes.
// Pure functions plus a client factory. The SDK is imported only by `makeClient`, so tests and dry runs never need it.
// Paid API route: see docs/TOOL_REGISTRY.md (`anthropic-batch`). Source text goes to Anthropic; outputs stay in the
// gitignored private folder. The key is read from ANTHROPIC_API_KEY at run time and is never logged or written.
import {readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync, copyFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseShard, lintScenes, lintCensus, lintFills} from './lint_lead_run.mjs';
import {extractCandidates, buildGlossary, glossaryHits, auditShard} from './shard_tools.mjs';

export const MODEL = 'claude-haiku-5-5';
// claude-api skill cached table 2026-10-06: Haiku 5.5, prompts up to 100K tokens; the Batch API is half price.
export const PRICE = Object.freeze({inPerM: 0.10, outPerM: 0.50, batchFactor: 0.5, promptCap: 100000});
// Per-model standard prices (same cached table): Sonnet 5.5 is $2 / $10.
export const PRICES = Object.freeze({'claude-haiku-5-5': PRICE, 'claude-sonnet-5-5': {...PRICE, inPerM: 2, outPerM: 10}});
const here = dirname(fileURLToPath(import.meta.url));
const DOCS = resolve(here, '../../docs/gm/dispatch/protagonist-life-2026-10-27');

// ---- schema -------------------------------------------------------------------------------------------------
// Strict-output rules, learned from live rejections: every object has additionalProperties:false; no min/max constraints; no recursion;
// at most 24 optional properties and at most 16 union-typed properties (nullable or anyOf) per schema. So there are no unions: an absent
// optional field is omitted and `normalize` restores the nulls the lint expects. Rarely used card fields (conflict, tone, open, hook,
// estimateBy, voice, procedure, tech) are not in the batch schema; a later round can add them if a book needs them.
const str = {type: 'string'}, num = {type: 'number'}, bool = {type: 'boolean'};
const arr = items => ({type: 'array', items});
const obj = (properties, required = []) => ({type: 'object', properties, required, additionalProperties: false});
const label = {type: 'string', enum: ['S', 'I', 'U']};
const evidence = obj({label, locator: str, kind: str}, ['label', 'locator', 'kind']);

const SCENE = obj({
    schema: {type: 'string', enum: ['lead-run/1.3']}, beat: str, order: num, pov: str,
    date: obj({anchor: str, offsetDays: num, value: str, label, note: str}, ['value', 'label']),
    timeOfDay: obj({value: str, precision: {type: 'string', enum: ['day', 'band', 'hour', 'minute']}, evidence: str}, ['value', 'precision']),
    place: str,
    deps: arr(obj({id: str, kind: {type: 'string', enum: ['after', 'needs']}}, ['id', 'kind'])),
    steps: arr(obj({verb: str, class: str, label, time: obj({minutes: num, band: str}), inputs: arr(str), outputs: arr(str),
        gains: arr(str), requires: arr(str)}, ['verb', 'class', 'label'])),
    touched: arr(obj({kind: str, id: str, status: {type: 'string', enum: ['present', 'partial', 'missing']}}, ['kind', 'id', 'status'])),
    present: arr(str),
    knowledge: arr(obj({fact: str, change: {type: 'string', enum: ['gained', 'lost']}, from: str, locator: str}, ['fact', 'change', 'from', 'locator'])),
    motives: arr(obj({tag: str, locator: str}, ['tag', 'locator'])),
    choices: arr(obj({taken: str, options: arr(str), label, locator: str}, ['taken', 'options', 'label', 'locator'])),
    options: arr(obj({action: str, class: str, needs: arr(str), taken: bool, label, locator: str}, ['action', 'class', 'needs', 'taken', 'label', 'locator'])),
    outcomes: arr(obj({fact: str, value: str, class: {type: 'string', enum: ['carried', 'changed', 'blocked']}}, ['fact', 'value', 'class'])),
    anchors: arr(obj({fact: str, value: num, unit: str, scope: {type: 'string', enum: ['lead', 'household']}, locator: str, approx: bool},
        ['fact', 'value', 'unit', 'scope', 'locator'])),
    weight: {type: 'string', enum: ['great', 'routine']},
    footprint: obj({places: arr(str), window: obj({anchor: str, fromOffsetDays: num, toOffsetDays: num}), hazards: arr(str), roles: arr(str)}, ['places', 'window']),
    sealed: arr(str), evidence: arr(evidence), mechanism: str,
}, ['schema', 'beat', 'order', 'pov', 'date', 'timeOfDay', 'place', 'deps', 'steps', 'touched', 'present', 'knowledge', 'motives',
    'choices', 'options', 'outcomes', 'anchors', 'weight', 'sealed', 'evidence']);

const CENSUS = obj({
    schema: {type: 'string', enum: ['census/1.3']}, id: str, label: str, zh: str,
    nameSource: {type: 'string', enum: ['repo', 'wiki', 'pinyin-unconfirmed']}, kind: str, rung: {type: 'string', enum: ['M0', 'M1']},
    whereabouts: arr(obj({place: str, era: str, status: {type: 'string', enum: ['stated', 'claimed', 'inferred']}, locator: str},
        ['place', 'era', 'status', 'locator'])),
    firstMention: str, touchedByLead: bool, aliases: arr(str), claimant: str,
    amount: obj({value: num, unit: str, per: str, cap: num}, ['value', 'unit']), note: str,
}, ['schema', 'id', 'label', 'zh', 'nameSource', 'kind', 'rung', 'whereabouts', 'firstMention', 'touchedByLead', 'aliases', 'claimant', 'note']);

const FILL = obj({
    schema: {type: 'string', enum: ['fill/1.3']}, id: str, for: str, kind: str, what: str,
    status: {type: 'string', enum: ['authored-proposal']}, layer: {type: 'string', enum: ['implied', 'period', 'invented']},
    basis: arr(str), respects: arr(str), replaceableBy: str, confidence: {type: 'string', enum: ['high', 'medium', 'low']},
}, ['schema', 'id', 'for', 'kind', 'what', 'status', 'layer', 'basis', 'respects', 'replaceableBy', 'confidence']);

/** Restore the nulls and types the lint expects for fields the schema left optional. */
export function normalize(rows) {
    const out = {};
    if (rows.scenes) out.scenes = rows.scenes.map(r => {
        const x = {...r, date: {anchor: null, offsetDays: null, ...r.date}, footprint: r.footprint ?? null, mechanism: r.mechanism ?? null};
        // Evidence kinds `dialogue:<who>` must match [\w.-]+: a speaker written with a space ("Old Neil") is a lint failure for free, so fix it here.
        x.evidence = (r.evidence || []).map(e => { const m = /^(thought|dialogue|dream):(.*)$/.exec(e.kind || ''); return m ? {...e, kind: `${m[1]}:${m[2].trim().replace(/[^\w.]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown'}`} : e; });
        x.outcomes = (r.outcomes || []).map(o => ({...o, value: o.value === 'true' ? true : o.value === 'false' ? false : o.value}));
        return x;
    });
    if (rows.census) out.census = rows.census.map(r => ({firstVolume: null, ...r}));
    if (rows.fills) out.fills = rows.fills;
    return out;
}

/** Output schema per pass: 'census' (pass 1), 'scenes' (pass 2, scenes and fills), 'full' (both in one call). */
export function shardSchema(pass) {
    if (pass === 'census') return obj({census: arr(CENSUS)}, ['census']);
    if (pass === 'scenes') return obj({scenes: arr(SCENE), fills: arr(FILL)}, ['scenes', 'fills']);
    return obj({scenes: arr(SCENE), census: arr(CENSUS), fills: arr(FILL)}, ['scenes', 'census', 'fills']);
}

// ---- prompt -------------------------------------------------------------------------------------------------
const PASS_TEXT = {
    census: 'PASS 1 (census). Return only the `census` array: every named entity and every distinct amount, time and measure in the shard.',
    scenes: 'PASS 2 (scenes). Return `scenes` and `fills`. Do not return census rows; reuse the ids in the known-names table for `present`, `touched`, `needs` and `whereabouts` references. A name missing from the table gets an id built from the schema card rules.',
    full: 'Return `scenes`, `census` and `fills` in one pass.',
};

/** Byte-stable prefix: identical for every request in a batch (and a pass), so it caches. */
export function systemText(pass, {world = 'lotm', cardPath = join(DOCS, 'SCHEMA_CARD_1_3.md')} = {}) {
    return [
        'You are a bounded source reader for YAIRPG. You receive one shard of a novel (paragraph-numbered: `pN: text` under chapter headers) and return structured rows as JSON matching the output schema. You have no tools and no other source: record only what the shard states. Do not add facts you know from elsewhere about this book or its sequels; if a row needs context the shard lacks, label it `I` and say so in the note.',
        PASS_TEXT[pass],
        'Rules: labels are exactly S, I or U; locators are `zh 第N章 pM` for a paragraph inside the shard; copy `zh` exactly as printed; every `deps` entry is an object `{id, kind}` naming a beat id in your output; a date `anchor` is a beat id in your output or null; a census row at rung M1 needs a `whereabouts` row (otherwise use M0); motives come only from the vocabulary in the card; never copy more than five source characters outside `zh` and `aliases`; notes are at most 15 words in your own words. Omit any optional field you have nothing for (never write null), and omit `footprint` unless the scene weight is `great`. Every money, time, duration, measure and dotted-name candidate in the user message must end up as a census row, an anchor, a step cost, a `timeOfDay`, or be skipped. Census is every mention, not only lead-relevant ones.',
        `World id prefix for ids: ${world}. Beat ids are \`lr.${world}.main.NNNN\` counting up from the base given in the user message.`,
        '# Schema card\n\n' + readFileSync(cardPath, 'utf8'),
    ].join('\n\n');
}

export function glossaryTable(hits) {
    return '| zh | id | label | kind | source |\n| --- | --- | --- | --- | --- |\n' +
        hits.map(h => `| ${h.zh} | ${h.id || ''} | ${h.label} | ${h.kind || ''} | ${h.source} |`).join('\n');
}

export function candidateTable(candidates) {
    return '| kind | value | locator |\n| --- | --- | --- |\n' + candidates.map(c => `| ${c.kind} | ${c.value} | ${c.locator} |`).join('\n');
}

/** One batch request. Varying parts (base, glossary, candidates, text) go in the user turn after the stable system prefix. */
export function buildRequest({customId, prefix, base, shardText, glossary, pass, model = MODEL, effort = 'low', maxTokens = 48000,
    schemaMode = 'format', world = 'lotm', system = systemText(pass, {world})}) {
    const hits = glossary ? glossaryHits(glossary, shardText) : [];
    const cands = extractCandidates(parseShard(shardText));
    const meta = `Shard ${prefix}. Beat ids start at lr.${world}.main.${base}.\n\n# Known names in this shard (reuse these ids and labels)\n\n${glossaryTable(hits)}\n\n# Candidates found by script\n\n${candidateTable(cands)}\n\n# Shard text\n`;
    const params = {
        model, max_tokens: maxTokens,
        // Prompt mode (no strict format): the schema travels in the stable system text and the reply is parsed and linted in code.
        system: [{type: 'text', text: schemaMode === 'format' ? system : `${system}\n\n# Output\n\nReply with only one JSON object (no code fence, no commentary) that matches this JSON schema:\n${JSON.stringify(shardSchema(pass))}`, cache_control: {type: 'ephemeral', ttl: '1h'}}],
        messages: [{role: 'user', content: [{type: 'text', text: meta}, {type: 'text', text: shardText}]}],
        output_config: schemaMode === 'format' ? {effort, format: {type: 'json_schema', schema: shardSchema(pass)}} : {effort},
    };
    return {custom_id: customId, params, _hits: hits.length, _candidates: cands.length};
}

// ---- estimate -----------------------------------------------------------------------------------------------
/** Token estimate [I]: CJK characters about 1.0 token each, other words about 1.4. Replace with usage numbers after the pilot. */
export function estimateTokens(text) {
    const cjk = (text.match(/[㐀-鿿]/g) || []).length, words = (text.replace(/[㐀-鿿]/g, ' ').match(/[A-Za-z0-9']+/g) || []).length;
    return Math.ceil(cjk * 1.0 + words * 1.4 + (text.length - cjk) * 0.15);
}

export function requestText(req) {
    return req.params.system.map(b => b.text).join('\n') + req.params.messages.flatMap(m => m.content.map(b => b.text)).join('\n') +
        (req.params.output_config?.format ? JSON.stringify(req.params.output_config.format.schema) : '');
}

/** Dollars at batch price. `outTokens` is per request (thinking at low effort plus rows), an assumption until measured. */
export function estimateCost(requests, outTokens, model = MODEL) {
    const price = PRICES[model] || PRICES[MODEL];
    const inTok = requests.map(r => estimateTokens(requestText(r)));
    const over = inTok.filter(t => t > PRICE.promptCap).length;
    const totalIn = inTok.reduce((a, b) => a + b, 0), totalOut = outTokens * requests.length;
    const usd = (totalIn * price.inPerM + totalOut * price.outPerM) / 1e6 * price.batchFactor;
    return {requests: requests.length, inputTokens: totalIn, outputTokensAssumed: totalOut, usdBatch: Number(usd.toFixed(4)),
        usdUncachedStandard: Number((usd / price.batchFactor).toFixed(4)), requestsOverPromptCap: over, perRequestInput: Math.round(totalIn / Math.max(1, requests.length))};
}

// ---- plan -> requests ---------------------------------------------------------------------------------------
const readJsonl = p => existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
// PL-A47: only graded shards feed the glossary. A census file counts when its `<prefix>_header.json` says grade A or B.
const gradedOk = (dir, file) => {
    const h = join(dir, file.replace(/_census\.jsonl$/, '_header.json'));
    try { return ['A', 'B'].includes(JSON.parse(readFileSync(h, 'utf8')).grade); } catch { return false; }
};
const readDirJsonl = (dir, re) => {
    const out = [];
    for (const f of execFileSync('ls', [dir]).toString().split('\n')) if (re.test(f) && !f.startsWith('sample') && gradedOk(dir, f)) out.push(...readJsonl(join(dir, f)));
    return out;
};

/** Build the request list from a plan file object. Glossary: wiki pages plus census files matching `glossary.censusMatch`. */
export function glossaryFromPlan(plan) {
    const g = plan.glossary || {};
    const pages = g.wiki ? JSON.parse(readFileSync(g.wiki, 'utf8')).pages : [];
    const rows = g.censusDir ? readDirJsonl(g.censusDir, new RegExp(g.censusMatch || '_census\\.jsonl$')) : [];
    return buildGlossary({wikiPages: pages, censusRows: rows});
}

/** Two reader rows with one id are one entity under two spellings (a full name and its given name): keep the first row and fold the other spelling into its aliases. */
export function mergeDuplicateIds(census) {
    const first = new Map(), out = [];
    for (const r of census) {
        const k = first.get(r.id);
        if (!k) { first.set(r.id, r); out.push(r); continue; }
        if (r.zh !== k.zh && !(k.aliases || []).includes(r.zh)) k.aliases = [...(k.aliases || []), r.zh];
    }
    return out;
}

/** Known names (with ids) that occur in the shard but are missing from the model's census: add an M0 row each, claimant `script`. Nothing is invented. */
export function addMissingKnown(census, glossary, shardText) {
    const shardMap = parseShard(shardText), have = new Set(census.map(r => String(r.zh).replace(/[.．・]/g, '·'))), ids = new Set(census.map(r => r.id)), added = [];
    for (const h of glossaryHits(glossary, shardText)) {
        const zh = String(h.zh).replace(/[.．・]/g, '·');
        if (!h.id || !h.kind || have.has(zh) || ids.has(h.id)) continue;
        const hit = [...shardMap].find(([, t]) => t.includes(h.zh));
        if (!hit) continue;
        const [ch, para] = hit[0].split(':');
        have.add(zh); ids.add(h.id);
        added.push({schema: 'census/1.3', id: h.id, label: h.label, zh: h.zh, nameSource: h.source === 'wiki' ? 'wiki' : 'repo', kind: h.kind, rung: 'M0', whereabouts: [],
            firstMention: `zh 第${ch}章 p${para}`, firstVolume: null, touchedByLead: false, aliases: [], claimant: 'script', note: 'Known name found by script, not by the reader.'});
    }
    return [...census, ...added];
}

export function requestsFromPlan(plan) {
    const glossary = glossaryFromPlan(plan);
    const pass = plan.pass, system = systemText(pass, {world: plan.world || 'lotm'});
    return plan.shards.map(s => buildRequest({
        customId: `${s.prefix}-${pass}`, prefix: s.prefix, base: s.base, shardText: readFileSync(s.shard, 'utf8'), glossary, pass,
        model: plan.model || MODEL, effort: plan.effort || 'low', maxTokens: plan.maxTokens || 48000, schemaMode: plan.schemaMode || 'format',
        world: plan.world || 'lotm', system}));
}

export const planHash = plan => createHash('sha256').update(JSON.stringify(plan)).digest('hex').slice(0, 12);
export const stripMeta = ({custom_id, params}) => ({custom_id, params});

// ---- client -------------------------------------------------------------------------------------------------
/** The only place the key is read. No fallback to another credential, base URL, profile or model. */
export async function makeClient(env = process.env) {
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set. This is a paid API route and has no fallback. Run it with the key loaded into the child environment only, ' +
            'for example: ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" node <script> ...');
    }
    let Anthropic;
    try { ({default: Anthropic} = await import('@anthropic-ai/sdk')); }
    catch { throw new Error('@anthropic-ai/sdk is not installed. Run `npm install` in the repo.'); }
    // Explicit key and base URL; authToken null so ANTHROPIC_AUTH_TOKEN or an `ant` profile is never picked up instead.
    return new Anthropic({apiKey, authToken: null, baseURL: 'https://api.anthropic.com'});
}

// ---- results ------------------------------------------------------------------------------------------------
/** Message -> {rows} or {error}. Thinking blocks are ignored; max_tokens and refusal are failures. */
export function parseMessage(message) {
    if (message.stop_reason === 'max_tokens') return {error: 'max_tokens'};
    if (message.stop_reason === 'refusal') return {error: 'refusal'};
    const text = (message.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    try { return {rows: normalize(JSON.parse(text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '')))}; } catch { return {error: 'json-parse'}; }
}

export function usageUsd(u = {}, model = MODEL) {
    const price = PRICES[model] || PRICE;
    const inTok = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) * 1.25 + (u.cache_read_input_tokens || 0) * 0.1;
    return (inTok * price.inPerM + (u.output_tokens || 0) * price.outPerM) / 1e6 * price.batchFactor;
}

const writeJsonl = (p, rows) => writeFileSync(p, (rows || []).map(r => JSON.stringify(r)).join('\n') + (rows?.length ? '\n' : ''));

/** Lint codes with row ids for a parsed result, in-process (same checks as the CLI). */
export function lintAll({scenes = [], census = [], fills = [], shardMap}) {
    return [...lintScenes(scenes), ...lintCensus(census, shardMap), ...lintFills(fills)];
}

/** Rows that failed lint, by kind, so a repair request can carry only them. */
export function failingRows({scenes = [], census = [], fills = [], issues}) {
    const where = new Set(issues.map(i => i.where));
    return {scenes: scenes.filter(r => where.has(r.beat)), census: census.filter(r => where.has(r.id)), fills: fills.filter(r => where.has(r.id)), codes: issues.slice(0, 60).map(i => `${i.code}:${i.where}${i.field ? '.' + i.field : ''}`)};
}

/** Repair request: the failing rows, their lint codes, the shard text; asks for corrected rows only. */
export function repairRequest({original, failing, shardText, pass}) {
    const p = structuredClone(original.params);
    p.messages = [{role: 'user', content: [{type: 'text', text: `REPAIR. These rows failed lint. Return corrected versions of only these rows, same ids and same schema, fixing the listed codes. Do not add new rows.\n\nLint codes: ${failing.codes.join(', ')}\n\nRows:\n${JSON.stringify({scenes: failing.scenes, census: failing.census, fills: failing.fills})}\n\n# Shard text\n`}, {type: 'text', text: shardText}]}];
    return {custom_id: original.custom_id.replace(/-repair$/, '') + '-repair', params: p};
}

/** Replace rows with the same beat/id; keep the rest. */
export function mergeRepair(base, fixed) {
    const key = (k, r) => k === 'scenes' ? r.beat : r.id;
    const out = {};
    for (const k of ['scenes', 'census', 'fills']) {
        const m = new Map((fixed?.[k] || []).map(r => [key(k, r), r]));
        out[k] = (base[k] || []).map(r => m.get(key(k, r)) || r);
    }
    return out;
}

/**
 * Poll, download, and process a batch. `plan.shards` maps custom ids to files. Writes private outputs, runs migrate and audit,
 * logs usage per request (AU12), and returns a summary plus an optional repair request list. No source text in the summary.
 */
export async function collect({client, batchId, plan, outDir, pollMs = 60000, sleep = ms => new Promise(r => setTimeout(r, ms)), log = () => {}, runTools = true}) {
    let batch;
    for (;;) {
        batch = await client.messages.batches.retrieve(batchId);
        if (batch.processing_status === 'ended') break;
        log(`batch ${batchId}: ${batch.processing_status}, processing ${batch.request_counts?.processing}`);
        await sleep(pollMs);
    }
    mkdirSync(plan.privateDir, {recursive: true});
    const byId = new Map(plan.shards.map(s => [`${s.prefix}-${plan.pass}`, s]));
    const summary = {batchId, counts: batch.request_counts, shards: [], repair: [], usd: 0};
    const ledger = join(outDir, `${plan.label}_usage.csv`);
    if (!existsSync(ledger)) writeFileSync(ledger, 'custom_id,type,input,cache_read,cache_create,output,usd_batch\n');
    for await (const item of await client.messages.batches.results(batchId)) {
        const id = item.custom_id, s = byId.get(id.replace(/-repair$/, ''));
        const r = item.result;
        if (!s) { summary.shards.push({id, status: 'unknown-custom-id'}); continue; }
        if (r.type !== 'succeeded') { summary.shards.push({id, status: r.type}); summary.repair.push({id, why: r.type}); appendFileSync(ledger, `${id},${r.type},0,0,0,0,0\n`); continue; }
        const u = r.message.usage || {}, usd = usageUsd(u, plan.model || MODEL);
        summary.usd += usd;
        appendFileSync(ledger, `${id},succeeded,${u.input_tokens || 0},${u.cache_read_input_tokens || 0},${u.cache_creation_input_tokens || 0},${u.output_tokens || 0},${usd.toFixed(6)}\n`);
        const parsed = parseMessage(r.message);
        if (parsed.error) { summary.shards.push({id, status: parsed.error}); summary.repair.push({id, why: parsed.error}); continue; }
        const shardText = readFileSync(s.shard, 'utf8'), shardMap = parseShard(shardText);
        let rows = parsed.rows;
        if (id.endsWith('-repair')) {
            const prior = {scenes: readJsonl(join(plan.privateDir, `${s.prefix}_scenes.jsonl`)), census: readJsonl(join(plan.privateDir, `${s.prefix}_census.jsonl`)), fills: readJsonl(join(plan.privateDir, `${s.prefix}_fills.jsonl`))};
            rows = mergeRepair(prior, rows);
        }
        if (plan.pass !== 'scenes' && plan.scriptFill !== false && rows.census) rows = {...rows, census: addMissingKnown(mergeDuplicateIds(rows.census), glossaryFromPlan(plan), shardText)};
        const p = s.prefix, keys = plan.pass === 'census' ? ['census'] : plan.pass === 'scenes' ? ['scenes', 'fills'] : ['scenes', 'census', 'fills'];
        // Write only what this pass returned: a scenes pass must not blank the census an earlier pass wrote for the same prefix.
        for (const k of keys) writeJsonl(join(plan.privateDir, `${p}_${k}.jsonl`), rows[k]);
        if (runTools) {
            execFileSync('node', [join(here, 'migrate_shard.mjs'), plan.privateDir, p, s.shard]);
            for (const k of keys) copyFileSync(join(plan.privateDir, `${p}_m13_${k}.jsonl`), join(plan.privateDir, `${p}m_${k}.jsonl`));
        }
        const suffix = runTools ? 'm' : '';
        const cur = {scenes: readJsonl(join(plan.privateDir, `${p}${suffix}_scenes.jsonl`)), census: readJsonl(join(plan.privateDir, `${p}${suffix}_census.jsonl`)), fills: readJsonl(join(plan.privateDir, `${p}${suffix}_fills.jsonl`))};
        // Repair is decided on the migrated rows: migrate_shard already fixes the structural failures for free.
        const issues = lintAll({...cur, shardMap});
        const audit = auditShard({...cur, shardMap});
        const grade = audit.grade;
        writeFileSync(join(plan.privateDir, `${p}m_header.json`), JSON.stringify({schema: 'shard-header/1.3', shard: p, readerModel: plan.model || MODEL, chapters: s.chapters || 'unknown',
            sourceHash: createHash('sha256').update(shardText).digest('hex').slice(0, 16), date: new Date().toISOString().slice(0, 10), lint: audit.lintOk ? 'pass' : 'fail', grade,
            locatorValid: audit.locatorValid, nameAccuracy: Number(audit.nameAccuracy.toFixed(3)), spotChecked: 0, counts: audit.counts, route: 'batch', pass: plan.pass}, null, 1) + '\n');
        summary.shards.push({id, status: 'ok', grade, lintIssues: issues.length, counts: audit.counts, nameAccuracy: Number(audit.nameAccuracy.toFixed(3))});
        if (grade === 'C' || issues.length) {
            const failing = failingRows({...cur, issues});
            if (!id.endsWith('-repair') && (failing.scenes.length || failing.census.length || failing.fills.length)) {
                const orig = {custom_id: id, params: buildRequest({customId: id, prefix: p, base: s.base, shardText, glossary: glossaryFromPlan(plan), pass: plan.pass, model: plan.model, effort: plan.effort, maxTokens: plan.maxTokens, schemaMode: plan.schemaMode, world: plan.world}).params};
                summary.repair.push({id, why: 'lint', request: repairRequest({original: orig, failing, shardText, pass: plan.pass})});
            }
        }
    }
    summary.usd = Number(summary.usd.toFixed(4));
    return summary;
}
