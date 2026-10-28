#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { transform } from 'esbuild';

async function walk(dir) {
  let entries; try { entries = await readdir(dir, { withFileTypes: true }); } catch { return []; }
  return (await Promise.all(entries.map((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))).flat();
}
function tracked(root) { return execFileSync('git', ['ls-files', '-z', '--', 'src', 'tests'], { cwd: root }).toString().split('\0').filter(Boolean); }
function packNames(pack) {
  const found = new Set();
  const visit = (x) => {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) return x.forEach(visit);
    if (typeof x.name === 'string' && x.name.trim()) found.add(x.name.trim());
    for (const v of Object.values(x)) visit(v);
  };
  visit(pack); return [...found].filter((x) => x.length >= 3);
}
async function topLevelAwait(source) {
  try { await transform(source, { format: 'cjs', target: 'esnext' }); return false; }
  catch (error) { return error.errors?.some((item) => item.text.includes('Top-level await')) || false; }
}
export async function review({ root = process.cwd(), grants = [], paths = [] }) {
  const absRoot = path.resolve(root);
  const granted = new Set(grants.map((p) => path.normalize(p)));
  const changed = paths.length ? paths : execFileSync('git', ['diff', '--name-only', '--'], { cwd: absRoot }).toString().split('\n').filter(Boolean);
  const outside = changed.filter((p) => !granted.has(path.normalize(p)));
  const allTracked = tracked(absRoot);
  // Review the lane's candidate paths; broad scans would mix concurrent checkout work
  // into this lane's receipt. The target paths still have to be tracked src/tests files.
  const candidates = paths.length ? paths : changed;
  const sources = candidates.filter((p) => p.startsWith('src/') || p.startsWith('tests/'));
  const names = new Set();
  for (const file of await walk(path.join(absRoot, 'private_packs'))) {
    if (!file.endsWith('-cast/cast.json') && !/private_packs\/(lotm|mol)-cast\/cast\.json$/.test(file)) continue;
    try { for (const n of packNames(JSON.parse(await readFile(file, 'utf8')))) names.add(n.toLocaleLowerCase()); } catch {}
  }
  let nameHits = 0, awaitHits = 0;
  for (const rel of sources) {
    let source; try { source = await readFile(path.join(absRoot, rel), 'utf8'); } catch { continue; }
    if (rel.startsWith('src/') && await topLevelAwait(source)) awaitHits++;
    for (const name of names) {
      if (new RegExp(`(^|[^\\p{L}\\p{N}_])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}\\p{N}_]|$)`, 'iu').test(source)) { nameHits++; break; }
    }
  }
  return { passed: outside.length === 0 && nameHits === 0 && awaitHits === 0, trackedFiles: sources.length, privateNames: names.size, nameHitFiles: nameHits, topLevelAwaitFiles: awaitHits, outsideGrant: outside };
}

async function main(argv) {
  const grants = [], paths = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--grant') {
      if (!argv[i + 1]) throw new Error('--grant needs one or more paths');
      grants.push(argv[++i]);
    } else paths.push(argv[i]);
  }
  if (!grants.length) throw new Error('usage: lane_review.mjs --grant <path> [--grant <path>...] [changed-path...]');
  const result = await review({ grants, paths });
  console.log(`tracked=${result.trackedFiles} private-names=${result.privateNames} name-hit-files=${result.nameHitFiles} top-level-await-files=${result.topLevelAwaitFiles} outside-grant=${result.outsideGrant.length}`);
  if (result.outsideGrant.length) console.log(`outside grant paths: ${result.outsideGrant.join(', ')}`);
  return result.passed ? 0 : 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) main(process.argv.slice(2)).then((code) => { process.exitCode = code; }).catch((e) => { console.error(`lane_review: ${e.message}`); process.exitCode = 1; });
