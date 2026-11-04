#!/usr/bin/env node
// Count and spot check for ZORIAN_S2_S6_SCENE_TABLE (c14-c55): every scene has one row in order, no duplicates, place and
// step counts equal the scene file, sealed rows carry no place, verb or option text and show as withheld when they are the next beat.
// Sibling of check_zorian_scene_table.mjs (S0/S1, unchanged).
//   node scripts/lead_run/check_zorian_s2_s6_scene_table.mjs [--scenes PATH] [--doc PATH]
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SCENES = arg('--scenes', '/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/mother-of-learning/private/wb8-merged-2026-10-30/scenes.jsonl');
const DOC = arg('--doc', path.join(root, 'docs/worlds/mother-of-learning/ZORIAN_S2_S6_SCENE_TABLE_2026-11-03.md'));
const LO = 14, HI = 55;

const scenes = fs.readFileSync(SCENES, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  .filter((r) => /^lr\.mol\.main\.\d{5}$/.test(r.beat) && +r.beat.slice(12, 15) >= LO && +r.beat.slice(12, 15) <= HI)
  .sort((a, b) => a.beat.localeCompare(b.beat));
const doc = fs.readFileSync(DOC, 'utf8');
const block = (name) => (doc.match(new RegExp(`<!-- BEGIN generated:${name} -->\\n([\\s\\S]*?)\\n<!-- END generated:${name} -->`)) || [])[1] || '';
const rowsOf = (name) => block(name).split('\n').filter((l) => /^\| lr\.mol\.main\.\d{5}/.test(l)).map((l) => l.split(' | '));
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

const N = scenes.length;
const t1 = rowsOf('table'), t3 = rowsOf('g11');
ok(N === 341, `scene file has ${N} lead rows for c${LO}-c${HI}, expected 341`);
ok(t1.length === N, `section 1 has ${t1.length} rows`);
ok(t3.length === N, `G11 table has ${t3.length} rows`);
const ids1 = t1.map((c) => c[0].replace(/^\| /, '').replace(/ \(sealed\)$/, ''));
ok(new Set(ids1).size === N, 'duplicate beat ids in section 1');
ok(ids1.join() === scenes.map((s) => s.beat).join(), 'row order or membership differs from the scene file');
ok(!ids1.some((b) => +b.slice(12, 15) === 13), 'c13 rows belong to the S0/S1 table');

const sealed = new Set(scenes.filter((s) => s.sealed && s.sealed.length).map((s) => s.beat));
ok(sealed.size === 29, `sealed count ${sealed.size}, expected 29`);
const g12 = block('g12').split('\n');
let checked = 0;
scenes.forEach((s, i) => {
  const cells = t1[i];
  if (!cells) return;
  const isSealed = sealed.has(s.beat);
  ok(cells[0].includes('(sealed)') === isSealed, `${s.beat}: sealed marker mismatch`);
  if (isSealed) {
    ok(/^\d+ verbs/.test(cells[2]) && +cells[2].match(/^(\d+) verbs/)[1] === s.steps.length, `${s.beat}: sealed verb count`);
    const leak = [s.place, ...s.steps.map((x) => x.verb), ...(s.options || []).map((o) => o.action)];
    const own = [...block('table').split('\n'), ...g12].filter((l) => l.startsWith(`| ${s.beat}`));
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
// A sealed scene's place or verb may equal an open scene's place, so the leak test is per row (above), not over the whole body.
const open = scenes.filter((s) => !sealed.has(s.beat));
const spot = Array.from({ length: 10 }, (_, k) => open[Math.floor((k * (open.length - 1)) / 9)]);
for (const s of spot) { const c = t1[scenes.indexOf(s)]; ok(c && c[1] === s.place && c[2].includes(s.steps[0].verb), `spot ${s.beat}`); checked++; }
// the counts block carries the totals
const total = (label) => (block('counts').split('\n').find((l) => l.startsWith(`| ${label} |`)) || '').split('|').filter(Boolean).pop()?.trim();
ok(total('Scenes') === String(N), `counts block Scenes total ${total('Scenes')}`);
ok(total('Sealed scenes') === '29', `counts block Sealed total ${total('Sealed scenes')}`);
const withOpts = scenes.filter((s) => (s.options || []).length).length;
ok(total('Scenes with non-empty `options`') === String(withOpts), 'options count');
const locked = scenes.reduce((n, s) => n + (s.options || []).filter((o) => !o.taken).length, 0);
ok(total('Untaken options') === String(locked), `untaken options ${total('Untaken options')} vs ${locked}`);

console.log(`rows=${t1.length}/${t3.length} sealed=${sealed.size} spotChecked=${checked} nonEmptyOptions=${withOpts} untaken=${locked} fails=${fails.length}`);
fails.forEach((f) => console.log('FAIL', f));
process.exit(fails.length ? 1 : 0);
