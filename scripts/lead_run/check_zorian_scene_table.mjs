#!/usr/bin/env node
// Count and spot check for ZORIAN_S0_S1_SCENE_TABLE: 105 rows, none missing or duplicated, per-row place and
// step counts equal the scene file, sealed rows carry no place or option text, ten rows spot-checked.
//   node scripts/lead_run/check_zorian_scene_table.mjs [--scenes PATH] [--doc PATH]
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SCENES = arg('--scenes', '/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/mother-of-learning/private/wb8-merged-2026-10-30/scenes.jsonl');
const DOC = arg('--doc', path.join(root, 'docs/worlds/mother-of-learning/ZORIAN_S0_S1_SCENE_TABLE_2026-11-03.md'));

const scenes = fs.readFileSync(SCENES, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  .filter((r) => /^lr\.mol\.main\.0(0[1-9]|1[0-3])\d\d$/.test(r.beat)).sort((a, b) => a.beat.localeCompare(b.beat));
const doc = fs.readFileSync(DOC, 'utf8');
const block = (name) => (doc.match(new RegExp(`<!-- BEGIN generated:${name} -->\\n([\\s\\S]*?)\\n<!-- END generated:${name} -->`)) || [])[1] || '';
const rowsOf = (name) => block(name).split('\n').filter((l) => /^\| lr\.mol\.main\.\d{5}/.test(l)).map((l) => l.split(' | '));
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

const t1 = rowsOf('table'), t3 = rowsOf('g11');
ok(scenes.length === 105, `scene file has ${scenes.length} lead rows for c1-c13, expected 105`);
ok(t1.length === 105, `section 1 has ${t1.length} rows`);
ok(t3.length === 105, `G11 table has ${t3.length} rows`);
const ids1 = t1.map((c) => c[0].replace(/^\| /, '').replace(/ \(sealed\)$/, ''));
ok(new Set(ids1).size === 105, 'duplicate beat ids in section 1');
for (const s of scenes) ok(ids1.includes(s.beat), `missing ${s.beat}`);
ok(ids1.join() === scenes.map((s) => s.beat).join(), 'row order differs from beat order');

const sealed = new Set(scenes.filter((s) => s.sealed && s.sealed.length).map((s) => s.beat));
ok(sealed.size === 19, `sealed count ${sealed.size}, expected 19`);
let checked = 0;
scenes.forEach((s, i) => {
  const cells = t1[i];
  const isSealed = sealed.has(s.beat);
  ok(cells[0].includes('(sealed)') === isSealed, `${s.beat}: sealed marker mismatch`);
  if (isSealed) {
    ok(/^\d+ verbs/.test(cells[2]) && +cells[2].match(/^(\d+) verbs/)[1] === s.steps.length, `${s.beat}: sealed verb count`);
    const leak = [s.place, ...s.steps.map((x) => x.verb), ...(s.options || []).map((o) => o.action)];
    const own = [...block('table').split('\n'), ...block('g12').split('\n')].filter((l) => l.startsWith(`| ${s.beat}`));
    for (const text of leak) ok(!own.some((l) => l.includes(text.replace(/\|/g, '/'))), `${s.beat}: sealed text leaked: ${text.slice(0, 30)}`);
    const asNext = block('g11').split('\n').filter((l) => l.includes(`| ${s.beat} (sealed) |`) && !l.startsWith(`| ${s.beat}`));
    ok(asNext.every((l) => l.split(' | ')[3] === 'withheld'), `${s.beat}: place shown as next beat`);
  } else {
    ok(cells[1] === s.place.replace(/\|/g, '/'), `${s.beat}: place`);
    ok(cells[2].split('<br>').length === s.steps.length, `${s.beat}: step count`);
    ok(cells[4].split('<br>').length === s.steps.length, `${s.beat}: command cell count`);
  }
  ok(/(exists-for-visitor|partial|gap)\s*\|?$/.test(cells[cells.length - 1].trim()), `${s.beat}: reach word`);
});
// spot check: ten rows spread over the range, place and first verb compared with the scene file
const open = scenes.filter((s) => !sealed.has(s.beat));
const spot = Array.from({ length: 10 }, (_, k) => open[Math.floor((k * (open.length - 1)) / 9)]);
for (const s of spot) { const c = t1[scenes.indexOf(s)]; ok(c[1] === s.place && c[2].includes(s.steps[0].verb), `spot ${s.beat}`); checked++; }
const withOpts = scenes.filter((s) => (s.options || []).length).length;
ok(block('counts').includes(`| ${withOpts} |`) || block('counts').includes(`${withOpts}`), 'options count missing');

console.log(`rows=${t1.length}/${t3.length} sealed=${sealed.size} spotChecked=${checked} nonEmptyOptions=${withOpts} fails=${fails.length}`);
fails.forEach((f) => console.log('FAIL', f));
process.exit(fails.length ? 1 : 0);
