// Reproducible C1 prep. --check compares artifacts without writing anything.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inferAbilityCost, hasStatedAbilityCost} from '../../../../../../src/ability_cost_infer.js';

const tracked = 'docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1';
const base = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27';
const costs = `${base}/l10/cost-infer`, slugs = `${base}/l10/slug-cluster`;
const merged = `${base}/m4-whole-book-2026-10-29/merged/extras.jsonl`;
const check = process.argv.includes('--check');
const hash = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const json = x => JSON.stringify(x, null, 2) + '\n';
const artifacts = new Map(), inputs = {};
const load = p => {inputs[p] = hash(p); return readFileSync(p, 'utf8');};
inputs['src/ability_cost_infer.js'] = hash('src/ability_cost_infer.js');
inputs[`${tracked}/prep.mjs`] = hash(`${tracked}/prep.mjs`);
const raw = load(merged).trim().split('\n').map(JSON.parse)
    .map((row, index) => ({row, index})).filter(({row}) => row.extra === 'rules' && row.kind === 'ability');
const typed = [];
for (let volume = 2; volume <= 8; volume++) {
    const path = `private_packs/lotm-abilities/typed_v${volume}.json`;
    JSON.parse(load(path)).rows.forEach((row, index) => typed.push({row, index, volume, path}));
}
const counts = {};
for (const [family, rows] of [['merged', raw], ['typed', typed]]) {
    const output = rows.filter(({row}) => !hasStatedAbilityCost(row)).map(({row, index, volume, path}) => ({
        id: row.id, rowIndex: index, input: path ?? merged, ...(volume ? {volume} : {}),
        inference: inferAbilityCost(row, {worldId: 'book.lotm'}),
    }));
    counts[family] = {rows: rows.length, stated: rows.length - output.length, costless: output.length,
        inferredCost: output.filter(x => x.inference.cost).length,
        reasonOnly: output.filter(x => !x.inference.cost).length,
        unresolvedRung: output.filter(x => x.inference.basis.sequence === null).length};
    artifacts.set(`${costs}/${family}.jsonl`, output.map(x => JSON.stringify(x)).join('\n') + '\n');
}

// These are fact slugs, not the ability id suffixes. Preserve every use and
// conflicting label for the readers rather than assuming equal names mean equal states.
const inventory = new Map();
for (const {row, index, volume, path} of typed) for (const role of ['conditions', 'blockers']) for (const item of row[role]) {
    if (!item.fact.startsWith('actor.lotm.')) throw Error(`Unexpected fact prefix in ${row.id}`);
    const slug = item.fact.slice('actor.lotm.'.length);
    const entry = inventory.get(slug) ?? {slug, count: 0, meaning: '', meaningBasis: 'first extracted label; paragraph review pending', labels: [], occurrences: []};
    entry.count++;
    if (!entry.labels.includes(item.label)) entry.labels.push(item.label);
    entry.meaning ||= item.label.replace(/\s+/g, ' ').slice(0, 180);
    entry.occurrences.push({id: row.id, volume, rowIndex: index, input: path, role, locator: item.locator, label: item.label});
    inventory.set(slug, entry);
}
const all = [...inventory.values()].sort((a, b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
artifacts.set(`${slugs}/inventory.json`, json(all));
const chunks = Array.from({length: 7}, (_, i) => all.slice(Math.floor(i * all.length / 7), Math.floor((i + 1) * all.length / 7)));
const coverage = chunks.flat().map(x => x.slug);
if (new Set(coverage).size !== all.length || coverage.length !== all.length) throw Error('Slug coverage failed.');
const slices = chunks.map((rows, i) => ({lane: i + 1, count: rows.length, input: `${slugs}/in_${i + 1}.json`, output: `${slugs}/out_${i + 1}.jsonl`}));
for (const [i, rows] of chunks.entries()) {
    const slice = slices[i];
    artifacts.set(slice.input, json(rows));
    artifacts.set(`${tracked}/luna_${i + 1}.md`, `# C1 slug slice ${i + 1}\n\nModel: gpt-6-luna medium. Coordinator launches; do not spawn agents.\n\nWork in /Users/weiwei/code/yet-another-idle-rpg. Read AGENTS.md. Own exactly ONE private output: \`${slice.output}\`. No other edits, commits, web, host wiring or source promotion.\n\nInput: \`${slice.input}\` (${rows.length} fact slugs, each with count, one-line meaning, all extracted labels and ability/volume/role/locator uses). Snapshot: \`${costs}/manifest.json\`; run \`node ${tracked}/prep.mjs --check\` first. Meanings are extraction hints, not verified source claims.\n\nCluster synonyms or differently named states with the same causal mechanism. Propose a short existing snake_case canonical slug. Keep different mechanisms, target types, scope, rank requirements, negation and knowledge apart; a similar word is insufficient. Condition/blocker roles stay at their original usage sites. Same-slug conflicting uses need review, not a forced merge. Unmatched reviewed slugs may form singleton groups. Do not assume person ids denote the same person. Codes: AD5, AD38, AR3, AR8, WA48; this is proposed data, not runtime behavior.\n\nRead source paragraphs for each resolved member, using its locators and ability id. Batch ids with:\n\n\`node scripts/lead_run/cite_paragraphs.mjs ${base} --merged ${base}/m4-whole-book-2026-10-29/merged --id <ability-id> --context 3 --max 8\`\n\nUse bounded calls; inspect help for locator filters if an id has many passages. Budget: at most 12,000 source words and six model responses, then retire; stop before exceeding the budget and mark remaining slugs unread. A cited id alone does not prove its label: read the matching locator window. If conflicting extracted meanings cannot be resolved within budget, mark the slug unread with the exact unresolved occurrence locators in the final report. No guessed, placeholder or unread groups.\n\nOutput JSONL, one group per line:\n\n\`{"canonical":"existing_slug","members":[{"slug":"input_slug","evidence":[{"id":"ability-id","locator":"exact locator actually read"}]}],"reason":"own English explanation of shared mechanism"}\`\n\nFinal line REQUIRED, including when empty: \`{"unread":["remaining_input_slug"]}\`. Every row must come from paragraphs actually read; unread ids go in that final line. For this task ids are input slug ids. Each input slug occurs exactly once across members and unread; no foreign slugs. All members need matching input occurrence evidence. If a slug has materially different labels, inspect them before resolving it. Never paste book prose into tracked files or stdout; keep source details in this private output.\n\nDone check: count distinct covered slugs = ${rows.length}; no duplicates; every resolved member has actually read matching id/locator evidence. Run \`node ${tracked}/fold.mjs --validate-only --lane ${i + 1}\`. Report counts and exact unread slugs only.\n`);
}
const manifest = {schema: 1, rule: 'l10-cost-v1', inputs, counts, slugCount: all.length,
    slugOccurrences: all.reduce((n, x) => n + x.count, 0), slices,
    gaps: ['Typed source covers volumes 2-8; merged output additionally covers volume 1.',
        'User rungs absent from these schemas. Rung stays null; volume and target rank are not substituted.',
        'Mechanisms are name-hint proposals or explicit unresolved reasons, not paragraph-verified facts.',
        'Qualitative inference is not wired to transactions; stated rows omitted and originals unchanged.']};
artifacts.set(`${costs}/manifest.json`, json(manifest));
for (const [path, data] of artifacts) {
    if (check) {if (readFileSync(path, 'utf8') !== data) throw Error(`Stale artifact: ${path}`);}
    else {mkdirSync(path.slice(0, path.lastIndexOf('/')), {recursive: true}); writeFileSync(path, data);}
}
console.log(JSON.stringify({mode: check ? 'checked' : 'prepared', artifacts: artifacts.size, ...manifest.counts,
    slugs: all.length, occurrences: manifest.slugOccurrences, slices: slices.map(x => x.count)}));
