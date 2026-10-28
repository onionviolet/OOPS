// Plan files for the English prime books (world profile lane): a one-shard pilot per book, then census, scenes and passes 3-5 in waves of about 10.
//   node scripts/lead_run/make_en_plans.mjs
// Settings follow the 2026-10-28 Stage A evidence: census at high effort (new-entity recall 0.74 against 0.53 at medium on the LOTM pilot shards),
// 64,000 max tokens everywhere, prompt mode for every pass but census. Plans only; dry-run each with batch_submit.mjs, and each label needs Weibao's go.
import {writeFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLANS = join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans');
const BOOKS = [
    {key: 'hp1', world: 'hp', dir: 'docs/research/novels/harry-potter/private/lead-run-2026-10-28', shardRe: /^shard_hp1_b1_ch(\d{3})-(\d{3})\.txt$/, pilotCh: 1},
    {key: 'mol', world: 'mol', dir: 'docs/research/novels/mother-of-learning/private/lead-run-2026-10-28', shardRe: /^shard_mol_b1_ch(\d{3})-(\d{3})\.txt$/, pilotCh: 1},
];
const SETTINGS = {
    census: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000},
    scenes: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
    rules: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
    people: {effort: 'high', maxTokens: 64000, outTokensAssumed: 50000, schemaMode: 'prompt'},
    texture: {effort: 'high', maxTokens: 64000, outTokensAssumed: 45000, schemaMode: 'prompt'},
};
const chunk = (xs, n) => { const out = []; for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n)); return out; };
const out = [];
for (const b of BOOKS) {
    const priv = join(root, b.dir);
    const shards = readdirSync(priv).map(f => [f, b.shardRe.exec(f)]).filter(([, m]) => m).map(([f, m]) => ({
        prefix: `${b.key}c${m[1]}`, shard: join(priv, f), base: `${m[1]}01`, chapters: `${Number(m[1])}-${Number(m[2])}`}))
        .sort((x, y) => x.prefix < y.prefix ? -1 : 1);
    const plan = (label, pass, list) => ({world: b.world, model: 'claude-haiku-5-5', ...SETTINGS[pass], privateDir: priv, outDir: join(priv, 'batch'),
        glossary: {censusDir: priv, censusMatch: `^${b.key}c\\d+m_census\\.jsonl$`}, label, pass,
        shards: ['rules', 'people', 'texture'].includes(pass) ? list.map(s => ({...s, prefix: s.prefix})) : list});
    const write = (name, p) => { writeFileSync(join(PLANS, `${name}.json`), JSON.stringify(p, null, 1) + '\n'); out.push(name); };
    const pilot = shards.filter(s => parseInt(s.chapters, 10) === b.pilotCh);
    write(`${b.key}_pilot_census`, plan(`${b.key}-pilot-census`, 'census', pilot));
    write(`${b.key}_pilot_scenes`, plan(`${b.key}-pilot-scenes`, 'scenes', pilot));
    const rest = shards.filter(s => !pilot.includes(s)), waves = chunk(rest, 10);
    waves.forEach((w, i) => write(`${b.key}_census_w${i + 1}`, plan(`${b.key}-census-w${i + 1}`, 'census', w)));
    waves.forEach((w, i) => write(`${b.key}_scenes_w${i + 1}`, plan(`${b.key}-scenes-w${i + 1}`, 'scenes', w)));
    for (const pass of ['rules', 'people', 'texture']) chunk(shards, 10).forEach((w, i) => write(`${b.key}_${pass}_w${i + 1}`, plan(`${b.key}-${pass}-w${i + 1}`, pass, w)));
}
console.log(JSON.stringify({plans: out.length, names: out.filter(n => /pilot|_w1$/.test(n))}));
