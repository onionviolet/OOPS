// Writes the Nov 1 schedule's batch plan files (NOV1_SCHEDULE.md). Plans only: no request is built or sent here; dry-run each with batch_submit.mjs.
//   node scripts/lead_run/make_wave_plans.mjs [--sonnet=rules,people]
// Prefixes follow the merge (merge_shards.mjs): extra-pass rows of a shard are written under the raw prefix of its migrated header (s2r, w1s10, b4s42).
import {writeFileSync, readFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PRIV = join(root, 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27');
const PLANS = join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans');
const WIKI = join(root, 'docs/research/novels/lord-of-mysteries/wiki-api-2026-10-25/lotm_wiki_api_2026-10-25.json');
// Agent-read shards plus the volume 1 batch prefixes (graded A or B only; batch_lib enforces the grade at read time).
const ALL_CENSUS = '^(s[2-6]r?|s[7-9]vm|w[1-4]s[0-9]+m|b[4-7]s[0-9]+m)_census\\.jsonl$'.replace('s[2-6]r?', 's2m|s[2-6]rm');
const SETTINGS = {
    // Medium since v1-census-w1 (2026-10-28, NOV1_SCHEDULE section 9): high used 40,000-64,000 output tokens on 3-chapter shards and lost 4 of 11 at the
    // 64,000 limit; medium used 20,000-32,000. Two medium runs (prefixes b and c) give the union recall (0.70 in Stage A, high 0.74).
    census: {effort: 'medium', maxTokens: 64000, outTokensAssumed: 32000},
    scenes: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
    rules: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
    people: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
    texture: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
};
const base = (label, pass, shards, extra = {}) => ({world: 'lotm', model: 'claude-haiku-5-5', ...SETTINGS[pass], privateDir: PRIV, outDir: join(PRIV, 'batch'),
    glossary: {wiki: WIKI, censusDir: PRIV, censusMatch: ALL_CENSUS}, label, pass, shards, ...extra});
const write = (name, plan) => { writeFileSync(join(PLANS, `${name}.json`), JSON.stringify(plan, null, 1) + '\n'); return name; };
const chunk = (xs, n) => { const k = Math.ceil(xs.length / n), out = []; for (let i = 0; i < xs.length; i += k) out.push(xs.slice(i, i + k)); return out; };

// Volume 1 remainder (ch 121-213): the 31 shards of the existing pass-1 plan, in three waves.
const v1 = JSON.parse(readFileSync(join(PLANS, 'lotm_v1_ch121-213_pass1.json'), 'utf8')).shards;
const v1Waves = chunk(v1, 3);
// Every volume 1 shard for passes 3-5: agent-read shards keyed by their migrated header, then the batch prefixes.
const shardFile = ch => readdirSync(PRIV).find(f => new RegExp(`^shard_(s\\d|w\\ds\\d+)_ch${ch}\\.txt$`).test(f));
const agent = readdirSync(PRIV).filter(f => /m_header\.json$/.test(f)).map(f => ({prefix: f.replace('m_header.json', ''), h: JSON.parse(readFileSync(join(PRIV, f), 'utf8'))}))
    .filter(x => x.h.route !== 'batch').map(x => {
        const [a, b = a] = String(x.h.chapters).split('-').map(n => String(Number(n)).padStart(3, '0'));
        return {prefix: x.prefix, shard: join(PRIV, shardFile(`${a}-${b}`) || 'missing'), base: /s(\d+)/.exec(x.prefix)[1] + '01', chapters: x.h.chapters};
    }).sort((p, q) => parseInt(p.chapters, 10) - parseInt(q.chapters, 10));
const vol1 = [...agent, ...v1];

const out = [];
// Stage A: census arms on the pilot shards (F5: a second medium run for the union, one high run), and the Sonnet A/B on three shards that already have
// Haiku arms (w3s33 medium census, pilot census p25/p36, extra-pass waves 3-4). Sonnet prefixes start with z so they never overwrite a Haiku file.
const pilot = JSON.parse(readFileSync(join(PLANS, 'pilot3_census.json'), 'utf8'));
out.push(write('pilot3_census_b', {...pilot, label: 'pilot-3-census-b', shards: pilot.shards.map(s => ({...s, prefix: s.prefix.replace('p', 'u')}))}));
out.push(write('pilot3_census_high', {...pilot, label: 'pilot-3-census-high', effort: 'high', maxTokens: 64000, outTokensAssumed: 50000, shards: pilot.shards.map(s => ({...s, prefix: s.prefix.replace('p', 'h')}))}));
const sab = [['w2s25', '070-072', '2501', '70-72'], ['w3s33', '094-096', '3301', '94-96'], ['w3s36', '103-105', '3601', '103-105']]
    .map(([raw, ch, b, chapters]) => ({raw, shard: join(PRIV, `shard_${raw}_ch${ch}.txt`), base: b, chapters}));
// The census arm must not see these shards' own answers; the other arms read the agent census as pass 2 does.
const notOwn = '^(s2m|s[2-6]rm|s[7-9]vm|w1s1[0-9]m|w2s2[0-46-9]m|w3s3[0-24-57-9]m|w4s4[0-1]m)_census\\.jsonl$';
for (const pass of ['census', 'scenes', 'rules', 'people']) {
    // The A/B ran on 2026-10-28 with census at medium; keep its plan as run.
    const plan = base(`sab-${pass}`, pass, sab.map(({raw, ...x}) => ({...x, prefix: `z${raw}${pass[0]}`})), {model: 'claude-sonnet-5-5', ...(pass === 'census' ? {effort: 'medium', maxTokens: 48000, outTokensAssumed: 42000} : {})});
    if (pass === 'census') plan.glossary.censusMatch = notOwn;
    out.push(write(`sab_${pass}`, plan));
}
// Stages B-D: volume 1 census and scenes waves, then passes 3-5 over all of volume 1 in waves of about 10.
// Wave 1 ran at high effort on 2026-10-28; keep its plan as run and retry its four max_tokens shards at medium.
v1Waves.forEach((w, i) => out.push(write(`v1_census_w${i + 1}`, base(`v1-census-w${i + 1}`, 'census', w, i ? {} : {effort: 'high', outTokensAssumed: 50000}))));
const w1Truncated = new Set(['b4s44', 'b4s47', 'b4s48', 'b4s49']);
out.push(write('v1_census_w1_retry', base('v1-census-w1-retry', 'census', v1Waves[0].filter(s => w1Truncated.has(s.prefix)))));
v1Waves.forEach((w, i) => out.push(write(`v1_scenes_w${i + 1}`, base(`v1-scenes-w${i + 1}`, 'scenes', w))));
// Second census per wave for the F5 union, used only if the pilot union rule passes (NOV1_SCHEDULE). Prefix c instead of b.
v1Waves.forEach((w, i) => out.push(write(`v1_census_b_w${i + 1}`, base(`v1-census-b-w${i + 1}`, 'census', w.map(s => ({...s, prefix: s.prefix.replace(/^b/, 'c')}))))));
const extraWaves = chunk(vol1, 8);
for (const pass of ['rules', 'people', 'texture']) extraWaves.forEach((w, i) => out.push(write(`v1_${pass}_w${i + 1}`, base(`v1-${pass}-w${i + 1}`, pass, w.map(s => ({...s, prefix: s.prefix.replace(/m$/, '')}))))));
// Sonnet scale-up of an extra pass (Stage C), written only when asked: --sonnet rules,people. Prefix z keeps the Haiku rows.
const sonnet = (process.argv.find(x => x.startsWith('--sonnet=')) || '').slice(9).split(',').filter(Boolean);
for (const pass of sonnet) extraWaves.forEach((w, i) => out.push(write(`sv1_${pass}_w${i + 1}`, base(`sv1-${pass}-w${i + 1}`, pass, w.map(s => ({...s, prefix: 'z' + s.prefix.replace(/m$/, '')})), {model: 'claude-sonnet-5-5'}))));
console.log(JSON.stringify({plans: out.length, vol1Shards: vol1.length, missingShardFiles: agent.filter(a => a.shard.endsWith('missing')).map(a => a.prefix), extraWaveSizes: extraWaves.map(w => w.length)}));
