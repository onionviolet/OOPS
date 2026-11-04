#!/usr/bin/env node
// Keeps docs/RULES_INDEX.md honest: register coverage, code ranges, AD
// contiguity, cited codes and relative links/anchors. Run: npm run check:rules
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, resolve, relative} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = process.env.RULES_INDEX_ROOT ? resolve(process.env.RULES_INDEX_ROOT) : resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(root, 'docs');
const indexPath = resolve(docs, 'RULES_INDEX.md');
const failures = [], warnings = [];
const fail = m => failures.push(m), warn = m => warnings.push(m);
const read = p => readFileSync(p, 'utf8');
const index = read(indexPath);
const rel = p => relative(root, p);

const sectionOf = (text, title) => {
  const m = new RegExp(`^## ${title}[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(text);
  return m ? m[1] : '';
};
const rows = section => section.split('\n').filter(l => /^\|/.test(l) && !/^\|[-| ]+\|$/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
const links = text => [...text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1]);

// Codes defined as a table row ("| UR12 |"), a bullet ("- **UR18.**") or a bold lead ("**UR47.").
const definedCodes = (text, prefix) => {
  const out = new Set();
  for (const m of text.matchAll(new RegExp(`^(?:\\|\\s*|[-*]\\s+\\*\\*|\\*\\*|)(${prefix})(\\d+)(?:\\s*\\||\\.)`, 'gm'))) out.add(+m[2]);
  return out;
};

// 1. Register coverage.
const register = rows(sectionOf(index, 'Register of rule sets')).slice(1);
const registered = new Set();
for (const r of register) for (const l of links(r[4] || '')) registered.add(resolve(docs, l.split('#')[0]));
const ruleFiles = readdirSync(docs).filter(f => /_RULES(_|\.)|^(UI|MAKING|ARCHITECTURE)_RULES|RULES_\d{4}/.test(f) && f.endsWith('.md') && !/^RULES_(INDEX|FROM_SCRATCH)\.md$/.test(f));
for (const f of ruleFiles) {
  if (!registered.has(resolve(docs, f))) fail(`rulebook docs/${f} has no row in the Register of rule sets`);
}

// 1b. Routing and ownership warnings (RIX2): a code family no router row names,
// and an owner link under docs/gm/dispatch/ (a dated working document).
const routerText = sectionOf(index, 'Router: what applies to my task');
for (const r of register) {
  const name = r[0] || r[1];
  for (const fam of new Set([...(r[1] || '').matchAll(/\b([A-Z]{2,4})\d+/g)].map(m => m[1]))) {
    if (!new RegExp(`\\b${fam}\\d`).test(routerText)) warn(`${name}: code family ${fam} appears in no router row`);
  }
  for (const l of links(r[4] || '')) {
    if (/^(https?:|#)/.test(l)) continue;
    const target = resolve(docs, l.split('#')[0]);
    if (target.startsWith(resolve(docs, 'gm', 'dispatch') + '/')) {
      const labelled = [...(r[4] || '').matchAll(/proposal source:\s*\[[^\]]*\]\(([^)\s]+)\)/gi)].some(m => m[1] === l);
      const proposalRow = /^proposal\b/i.test(r[2] || '') && !/\b(?:accepted|standing|binding)\b/i.test(r[2] || '');
      const proposalHeader = existsSync(target) && /\bStatus:\s*(?:\*\*)?proposal\b/i.test(read(target).slice(0, 4000));
      const stableRoute = links(r[4] || '').some(link => !/^(https?:|#)/.test(link) &&
        !resolve(docs, link.split('#')[0]).startsWith(resolve(docs, 'gm', 'dispatch') + '/') &&
        existsSync(resolve(docs, link.split('#')[0])));
      if (!(labelled && proposalRow && proposalHeader && stableRoute)) warn(`${name}: owner link ${l.split('#')[0]} is under docs/gm/dispatch/ (a dated working document)`);
    }
  }
}

// 2. Registered ranges vs highest defined code.
const adDefined = definedCodes(sectionOf(index, 'Accepted direction rules \\(AD\\)').replace(/^### .*$/gm, ''), 'AD');
const defined = {AD: adDefined};
const ownerFiles = new Set();
for (const r of register) {
  const files = links(r[4] || '').filter(l => !/^https?:/.test(l))
    .map(l => l.startsWith('#') ? indexPath : resolve(docs, l.split('#')[0]))
    .filter(f => existsSync(f) && f.endsWith('.md'));
  files.forEach(f => ownerFiles.add(f));
  const source = files.map(read).join('\n');
  const families = new Set([...(r[1] || '').matchAll(/\b([A-Z]{2,4})\d+/g)].map(m => m[1]));
  // Include auxiliary families defined in the same owner (for example UIV).
  for (const m of source.matchAll(/^(?:\|\s*|[-*]\s+\*\*|\*\*|)([A-Z]{2,4})\d+(?:\s*\||\.)/gm)) families.add(m[1]);
  for (const prefix of families) {
    const codes = prefix === 'AD' ? adDefined : definedCodes(source, prefix);
    defined[prefix] = new Set([...(defined[prefix] || []), ...codes]);
    const ranges = [...r[1].matchAll(new RegExp(`\\b${prefix}(\\d+)[–-](?:${prefix})?(\\d+)`, 'g'))];
    if (!ranges.length) continue;
    const hi = Math.max(...ranges.map(m => +m[2]));
    if (!codes.size) { fail(`${prefix}: no definitions found in registered owners`); continue; }
    const max = Math.max(...codes);
    if (max !== hi) fail(`register says ${prefix}1–${prefix}${hi}, highest in owner is ${prefix}${max}`);
    for (const [, lo, end] of ranges) {
      if (+lo > +end) fail(`register has reversed range ${prefix}${lo}–${prefix}${end}`);
      for (let n = +lo; n <= +end; n++) if (!codes.has(n)) fail(`register cites ${prefix}${n}, which is not defined`);
    }
  }
}

// 3. AD contiguity/uniqueness, and cited codes exist.
const adAll = [...sectionOf(index, 'Accepted direction rules \\(AD\\)').matchAll(/^\|\s*AD(\d+)\s*\|/gm)].map(m => +m[1]);
if (new Set(adAll).size !== adAll.length) fail(`duplicate AD codes: ${adAll.filter((n, i) => adAll.indexOf(n) !== i).map(n => 'AD' + n).join(', ')}`);
adAll.forEach((n, i) => { if (n !== i + 1) fail(`AD codes not contiguous at position ${i + 1}: found AD${n}`); });

const citationSections = ['Router: what applies to my task', 'Shared principles across rulebooks'];
for (const title of citationSections) {
  const text = sectionOf(index, title.replace(/[()]/g, '\\$&'));
  for (const m of text.matchAll(/\b([A-Z]{2,4})(\d+)(?:[–-](?:\1)?(\d+))?/g)) {
    const [, prefix, a, b] = m;
    const set = defined[prefix];
    // Unregistered palette identifiers are outside this check's authority.
    if (!set || !set.size) continue;
    for (let n = +a; n <= +(b || a); n++) if (!set.has(n)) fail(`${title}: cites ${prefix}${n}, which is not defined`);
  }
}

// 4. Links and anchors.
const slug = h => h.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '').toLowerCase().trim()
  .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
const anchorCache = new Map();
const anchorsOf = file => {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const seen = new Map(), set = new Set();
  let fence = false;
  for (const line of read(file).split('\n')) {
    if (/^\s*```/.test(line)) fence = !fence;
    const m = !fence && /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const s = slug(m[1]), n = seen.get(s) || 0;
    seen.set(s, n + 1);
    set.add(n ? `${s}-${n}` : s);
  }
  anchorCache.set(file, set);
  return set;
};
const tracked = new Map();
const isTracked = file => {
  if (!tracked.has(file)) {
    try { execFileSync('git', ['ls-files', '--error-unmatch', '--', file], {cwd: root, stdio: 'ignore'}); tracked.set(file, true); } catch { tracked.set(file, false); }
  }
  return tracked.get(file);
};
let linkCount = 0;
const linkSources = new Set([indexPath, ...ownerFiles,
  ...['AGENTS.md', 'CLAUDE.md', 'DESIGN.md', 'PROJECT.md', 'docs/VISION_DIGEST.md', 'docs/systems/README.md'].map(p => resolve(root, p)).filter(existsSync)]);
for (const source of linkSources) for (const l of new Set(links(read(source)))) {
  if (/^[a-z]+:/i.test(l)) continue;
  linkCount++;
  const [path, anchor] = l.split('#');
  const file = path ? resolve(dirname(source), decodeURIComponent(path)) : source;
  if (!existsSync(file)) { fail(`${rel(source)}: broken link: ${l}`); continue; }
  if (source === indexPath && path && !isTracked(file)) warn(`linked file exists but is not tracked by git: ${rel(file)}`);
  if (anchor && statSync(file).isFile() && file.endsWith('.md') && !anchorsOf(file).has(decodeURIComponent(anchor).toLowerCase())) fail(`${rel(source)}: broken anchor: ${l}`);
}

console.log(`Rules index check: ${register.length} register rows, ${adAll.length} AD codes, ${linkCount} relative links`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const f of failures) console.log(`  FAIL  ${f}`);
console.log(failures.length ? `FAIL (${failures.length} problems, ${warnings.length} warnings)` : `PASS (${warnings.length} warnings)`);
process.exit(failures.length ? 1 : 0);
