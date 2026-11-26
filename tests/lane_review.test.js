import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { review } from '../scripts/lane_review.mjs';

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'lane-review-'));
  await mkdir(path.join(root, 'src'), { recursive: true }); await mkdir(path.join(root, 'tests'), { recursive: true });
  await mkdir(path.join(root, 'private_packs', 'lotm-cast'), { recursive: true });
  await writeFile(path.join(root, 'private_packs', 'lotm-cast', 'cast.json'), JSON.stringify({ people: [{ id: 'p1', name: 'Synthetic Name' }] }));
  await writeFile(path.join(root, 'src', 'app.js'), 'export const ok = true;\n');
  await writeFile(path.join(root, 'tests', 'app.test.js'), 'assert.equal(1, 1);\n');
  execFileSync('git', ['init', '-q'], { cwd: root }); execFileSync('git', ['add', 'src', 'tests'], { cwd: root });
  return root;
}
test('passes synthetic name-free tracked code within the grant', async (t) => {
  const root = await fixture(); t.after(() => rm(root, { recursive: true, force: true }));
  const result = await review({ root, grants: ['src/app.js'], paths: ['src/app.js'] });
  assert.equal(result.passed, true); assert.equal(result.nameHitFiles, 0); assert.equal(result.topLevelAwaitFiles, 0);
});
test('fails when a synthetic cast name appears in tracked code', async (t) => {
  const root = await fixture(); t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'src', 'app.js'), 'const label = "Synthetic Name";\n'); execFileSync('git', ['add', 'src/app.js'], { cwd: root });
  const result = await review({ root, grants: ['src/app.js'], paths: ['src/app.js'] });
  assert.equal(result.passed, false); assert.equal(result.nameHitFiles, 1);
  assert.equal(result.privateNames,1,'the native filesystem path still selects its private cast pack');
  const cli=spawnSync(process.execPath,[fileURLToPath(new URL('../scripts/lane_review.mjs',import.meta.url)),'--grant','src/app.js','src/app.js'],{cwd:root,encoding:'utf8'});
  assert.equal(cli.status,1,cli.stderr);assert.match(cli.stdout,/name-hit-files=1/);
});
test('fails on top-level await and outside-grant paths', async (t) => {
  const root = await fixture(); t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'src', 'app.js'), 'await Promise.resolve();\n'); execFileSync('git', ['add', 'src/app.js'], { cwd: root });
  const result = await review({ root, grants: ['src/app.js'], paths: ['src/app.js', 'docs/outside.md'] });
  assert.equal(result.passed, false); assert.equal(result.topLevelAwaitFiles, 1); assert.deepEqual(result.outsideGrant, ['docs/outside.md']);
});
