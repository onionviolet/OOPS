#!/usr/bin/env node
// Warning-first mechanical rule lints (FRC27, docs/audits/FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md).
// Each lint is a narrow pattern: it misses some cases rather than crying wolf.
//
//   TMR1  (docs/TIME_RULES.md)        a day number computed from the raw clock outside
//                                      src/world_day_index.js: Math.floor(<…clock…> / 1440)
//                                      or a `…day` / `…Day` name (or `day:` key) set from
//                                      Math.floor(<…> / 1440 | 24*60 | MINUTES_PER_DAY).
//                                      Durations ("days left", `days = …`) are not flagged.
//   WKR1  (docs/WORLD_KIND_RULES.md)  a reader comparing a preset id with a string literal
//                                      (`.preset === 'x'`, `switch (w.preset)`, `presetId`,
//                                      `startsWith('preset:')`) outside the pack manifest and loader.
//   STY17 (docs/STORY_RULES.md)       a story window module (builds `completed.${…}` facts and
//                                      defines its own `local`/`done` helper) that does not
//                                      import from window_chain.js.
//
// Ratchet: scripts/rule_lints_baseline.json counts the hits that already shipped
// (rule + file + sha of the hit text). Only hits beyond the baseline warn. The
// check never fails: it prints WARN lines with the rule code and exits 0.
//
//   node scripts/check_rule_lints.mjs                    check (warns, exit 0)
//   node scripts/check_rule_lints.mjs --update-baseline  rewrite the baseline from today's hits
//
// Allow one line with a trailing comment: // rule-lint: allow <why>
import {createHash} from 'node:crypto';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baselinePath = resolve(root, 'scripts/rule_lints_baseline.json');
const sha = s => createHash('sha256').update(s.replace(/\s+/g, '')).digest('hex').slice(0, 12);

export const RULES = {
    TMR1: 'new day counter outside world_day_index.js; read dayIndex/resolveWorldCalendar instead (docs/TIME_RULES.md TMR1)',
    WKR1: 'reader branches on a preset id; read the axis values instead (docs/WORLD_KIND_RULES.md WKR1)',
    STY17: 'story window builds its own helpers; start from windowKit in window_chain.js (docs/STORY_RULES.md STY17)',
};

const DAY = String.raw`(?:1440|24\s*\*\s*60|60\s*\*\s*24|MINUTES_PER_DAY)`;
// Math.floor( <no ';' up to 160 chars> / DAY )
const FLOOR_DAY = new RegExp(String.raw`Math\.floor\(([^;]{0,160}?)\/\s*\(?\s*${DAY}\s*\)?\s*\)`, 'g');
const DAY_NAME = /(?:\b\w*Day|\bday)\s*(?:=|:)\s*$/;
const TMR1_EXEMPT = new Set(['src/world_day_index.js', 'src/world_calendar.js', 'src/game_time.js']);

const WKR1_PATTERNS = [
    /\.preset(?:Id)?\s*[!=]==?\s*['"`]/,
    /['"`]\s*[!=]==?\s*[\w$.?]*\.preset(?:Id)?\b/,
    /\bpresetId\s*[!=]==?\s*['"`]/,
    /['"`]\s*[!=]==?\s*presetId\b/,
    /switch\s*\(\s*[\w$.?]*\bpreset(?:Id)?\s*\)/,
    /\.startsWith\(\s*['"`]preset:/,
    /\.presets?\??\.includes\(\s*['"`]/,
];
const WKR1_EXEMPT = new Set(['src/world_pack_manifest.js', 'src/world_pack_loader.js']);

const STY17_EXEMPT = new Set(['src/window_chain.js', 'src/place_act_sequence.js']);

function lineIndex(source) {
    const starts = [0];
    for (let i = 0; i < source.length; i++) if (source[i] === '\n') starts.push(i + 1);
    const lineOf = idx => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= idx) lo = mid; else hi = mid - 1; } return lo; };
    const text = ln => source.slice(starts[ln], starts[ln + 1] ?? source.length);
    return {lineOf, text};
}
const allowed = line => /rule-lint:\s*allow/.test(line);

export function scanClock(name, source) {
    if (TMR1_EXEMPT.has(name)) return [];
    const {lineOf, text} = lineIndex(source);
    const hits = [];
    for (const m of source.matchAll(FLOOR_DAY)) {
        const dividend = m[1];
        const before = source.slice(Math.max(0, m.index - 40), m.index);
        if (!/\bclock\b/.test(dividend) && !DAY_NAME.test(before)) continue;
        const ln = lineOf(m.index);
        if (allowed(text(ln))) continue;
        hits.push({rule: 'TMR1', file: name, line: ln + 1, text: m[0], key: `TMR1:${name}:${sha(m[0])}`});
    }
    return hits;
}

export function scanPreset(name, source) {
    if (WKR1_EXEMPT.has(name)) return [];
    const hits = [];
    source.split('\n').forEach((line, i) => {
        if (allowed(line) || /^\s*(\/\/|\*)/.test(line)) return;
        const p = WKR1_PATTERNS.find(re => re.test(line));
        if (!p) return;
        const t = line.match(p)[0];
        hits.push({rule: 'WKR1', file: name, line: i + 1, text: line.trim().slice(0, 120), key: `WKR1:${name}:${sha(line)}`, match: t});
    });
    return hits;
}

export function scanWindow(name, source) {
    if (STY17_EXEMPT.has(name)) return [];
    if (!/completed\.\$\{/.test(source)) return [];
    if (!/^\s*(?:const|let|function)\s+(?:done|local)\b/m.test(source)) return [];
    if (/from\s+['"](?:\.\.?\/)+(?:[\w./]*\/)?window_chain\.js['"]/.test(source)) return [];
    if (/rule-lint:\s*allow STY17/.test(source)) return [];
    return [{rule: 'STY17', file: name, line: 1, text: 'window module without windowKit', key: `STY17:${name}`}];
}

export function scanSource(name, source) {
    return [...scanClock(name, source), ...scanPreset(name, source), ...scanWindow(name, source)];
}

function sources() {
    const out = [];
    for (const dir of ['src', 'src/world_packs']) {
        const abs = resolve(root, dir);
        if (!existsSync(abs)) continue;
        for (const f of readdirSync(abs).filter(f => f.endsWith('.js')).sort()) out.push(`${dir}/${f}`);
    }
    return out;
}

export function scanTree() {
    return sources().flatMap(name => scanSource(name, readFileSync(resolve(root, name), 'utf8')));
}

const countKeys = hits => hits.reduce((m, h) => m.set(h.key, (m.get(h.key) || 0) + 1), new Map());

// Hits beyond the baseline count for their key are new.
export function newHits(hits, baseline) {
    const left = new Map(Object.entries(baseline || {}));
    const fresh = [];
    for (const h of hits) {
        const n = left.get(h.key) || 0;
        if (n > 0) left.set(h.key, n - 1); else fresh.push(h);
    }
    return fresh;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const hits = scanTree();
    if (process.argv.includes('--update-baseline')) {
        const keys = Object.fromEntries([...countKeys(hits).entries()].sort(([a], [b]) => a.localeCompare(b)));
        writeFileSync(baselinePath, JSON.stringify({generated: new Date().toISOString().slice(0, 10), keys}, null, 1) + '\n');
        console.log(`rule lints baseline: ${hits.length} known hits`);
        process.exit(0);
    }
    const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, 'utf8')).keys : {};
    const fresh = newHits(hits, baseline);
    const by = rule => hits.filter(h => h.rule === rule).length;
    console.log(`Rule lints (warning only): TMR1 ${by('TMR1')}, WKR1 ${by('WKR1')}, STY17 ${by('STY17')} hits; ${fresh.length} new beyond baseline`);
    for (const h of fresh) console.log(`  WARN  ${h.rule}  ${h.file}:${h.line}  ${h.text.slice(0, 100)}\n        ${RULES[h.rule]}`);
    if (fresh.length) console.log('  Fix it, mark a deliberate case with `// rule-lint: allow <why>`, or rerun with --update-baseline after review.');
    console.log(fresh.length ? `WARN (${fresh.length} new, not failing)` : 'PASS');
    process.exit(0);
}
