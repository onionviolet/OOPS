import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {scanReviewed, scanFile, format} from '../scripts/lotm_slice/prescan.mjs';
import {generate} from '../scripts/lotm_slice/gen-runner.mjs';
import {receiptFields} from '../scripts/lotm_slice/receipt-fields.mjs';

const fixture = {
  window: 'x'.repeat(500),
  acts: [
    {id: 'book.lotm.zz.a', description: 'x'.repeat(201), report: 'ok', effects: [
      {type: 'fact', scope: 'actor', actor: 'player', key: 'book.lotm.zz.f', value: true},
      {type: 'knowledge', actor: 'player', key: 'book.lotm.zz.k', value: 'y'.repeat(260)},
      {type: 'relocate', actor: 'player', location: 'place.x'}], costs: []},
    {id: 'book.lotm.zz.b', description: 'x'.repeat(200), report: 'z'.repeat(300), effects: [], costs: []},
  ],
  sequences: [{id: 's', title: 't', conclusion: 'c'.repeat(205)}],
};

test('T1 reports every over-length packed string at once, with path, length and limit', () => {
  const found = scanReviewed(fixture);
  assert.deepEqual(found.map(f => [f.path, f.length, f.limit]), [
    ['acts.0.description', 201, 200],
    ['acts.0.effects.1.value', 260, 200],
    ['acts.1.report', 300, 200],
    ['sequences.0.conclusion', 205, 200],
  ]);
  assert.equal(found[0].id, 'book.lotm.zz.a');
  assert.match(format(found), /4 string\(s\) over 200/);
  assert.equal(scanReviewed(fixture, {all: true}).length, 5, '--all also counts unpacked review fields');
  assert.match(format([]), /^ok/);
});

test('T1 limit matches the pack validator', () => {
  const src = fs.readFileSync(new URL('../src/book_world_lotm_cast.js', import.meta.url), 'utf8');
  assert.match(src, /value\.length > 200/);
});

test('T1 scans a builder .py by string literal', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lotm-slice-')), 'b.py');
  fs.writeFileSync(f, `a='ok'\nb='${'q'.repeat(210)}'\n`);
  const found = scanFile(f);
  assert.equal(found.length, 1);
  assert.equal(found[0].length, 210);
});

const KJ3J = 'docs/research/novels/lord-of-mysteries/private/kj3j-ch22-2026-11-02';
const lits = src => new Set([...src.matchAll(/(?:prefix\+)?['"]([a-z0-9_.-]+)['"]/g)].map(m => m[1]));

test('T4 generates lintable runner text with the proof bundle default', () => {
  const src = generate(fixture, {sliceDir: 'x/slice', origin: 'x/origin.json'});
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lotm-slice-'));
  fs.writeFileSync(path.join(dir, 'play.mjs'), src);
  const r = spawnSync(process.execPath, ['--check', path.join(dir, 'play.mjs')]);
  assert.equal(r.status, 0, String(r.stderr));
  assert.match(src, /proof-bundles\/kj3e-bundle-919b17d3/);
  assert.match(src, /browser-result\.json/);
  assert.match(src, /save_to_file/);
  assert.match(src, /"book\.lotm\.zz\.f"\],true/);
  assert.match(src, /current location'\],"place\.x"/);
});

test('T4 regenerated KJ3J runner covers everything the hand-written one asserts', { skip: !fs.existsSync(KJ3J + '/play-episode.mjs') }, () => {
  const review = JSON.parse(fs.readFileSync(KJ3J + '/reviewed-episode.json', 'utf8'));
  const src = generate(review, {
    sliceDir: KJ3J,
    origin: 'docs/research/novels/lord-of-mysteries/private/kj3i-ch21-2026-11-02/completed-checkpoint.json',
    carryFacts: ['book.lotm.kj3i.leonard.met'],
    leaks: [['lotm.person.cast-58a592b36b216b67fb82', 'transmigrat|way back|lay a way|reason for']],
    absent: [['lotm.person.cast-58a592b36b216b67fb82', 'pryer']],
  });
  const hand = fs.readFileSync(KJ3J + '/play-episode.mjs', 'utf8');
  // hand-written asserts use prefix+'x'; expand to full keys before comparing
  const full = new Set([...hand.matchAll(/prefix\+'([a-z0-9_.]+)'/g)].map(m => 'book.lotm.kj3j.' + m[1]));
  const genLits = lits(src);
  for (const k of full) assert(genLits.has(k), 'generated runner misses ' + k);
  for (const k of ['book.lotm.kj3i.leonard.met', 'lotm.place.cast-f8a975abd5f00378bc54', 'lotm.place.cast-acb062678b9aac4760dd'])
    assert(genLits.has(k), k);
  for (const frag of ['browser-result.json', 'completed-checkpoint.json', 'completed-export.txt', 'seed:7', 'opTimeout:300000', 'save_to_file', 'pageErrors']) {
    assert(hand.includes(frag) && src.includes(frag), frag);
  }
  assert.match(src, /no money moves/);
});

test('T6 fills receipt text from a browser result', () => {
  const t = receiptFields({
    steps: [{id: 'a', minutes: 3, location: 'L', money: 5}], checks: ['c'], bundleSha256: 'B', packSha256: 'P', pageErrors: [], wallMs: 12000,
    timings: [{phase: 'boot', ms: 1000}, {phase: 'native-action', ms: 2000}, {phase: 'settle', ms: 3000}, {phase: 'import', ms: 4000}, {phase: 'boot', ms: 5000}],
  }, {expectBundle: 'B'});
  assert.match(t, /Passed: 1 intents, money 5 unchanged, 0 page errors, 12\.0 s/);
  assert.match(t, /2 boots and 1 import/);
  assert.match(t, /Bundle sha256: B \(matches expected\)/);
  assert.match(t, /- a: 3 min, at L, money 5/);
});
