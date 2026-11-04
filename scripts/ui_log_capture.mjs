// L1 runtime log capture (docs/ui/COPY_STYLE_SHEET.md round 2). Plays three headless
// routes on the full game and records every message-log line the player would see, with
// its kind, so the copy pass can measure real log text instead of the static floor (F9).
//   node scripts/ui_log_capture.mjs            -> docs/reviews/UI_LOG_CAPTURE_<date>.md
//   node scripts/ui_log_capture.mjs --json-only (local JSON only)
// Local JSON (gitignored): docs/reviews/ui-string-inventory/log_capture.local.json
// Report-only: no game state is written outside the headless runner's in-memory storage.
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {boot, ROOT} from './headless/runner.mjs';
import {ROUTE, PATCHES, SEED, WALL_START} from './headless/village_route.mjs';

const DATE = '2026-11-03';
const JSON_OUT = join(ROOT, 'docs/reviews/ui-string-inventory/log_capture.local.json');
const MD_OUT = join(ROOT, `docs/reviews/UI_LOG_CAPTURE_${DATE}.md`);

// Same word list as the inventory's spec-voice lead (CPY1).
const SPEC = /\b(actual|supplied|qualified|native|bindings?|canonical|owning|seam|counterpart|retained|explicitly|enrolled|baseline|observer|provenance|applicability|authored|not stated|proposal|proposed|schema|invalid|authority)\b/i;
const IRREGULAR_PAST = new Set('was were found got made took gave saw felt went came left won lost ate drank slept woke heard knew bought sold paid caught fell hit swore wore sat stood ran wrote read spent kept held brought met told thought fought'.split(' '));
const MODAL = /^(can|cannot|can't|need|have|must|should|will|would|may|might|don't|do|are|aren't|already|still|now|lack)$/;

function tense(text) {
    const m = text.match(/^(?:You|[A-Z][a-z]+(?: [a-z]+)?)\s+(\w+)/);
    if(!m) return null;
    const v = m[1].toLowerCase();
    if(IRREGULAR_PAST.has(v) || /^[a-z]{3,}ed$/.test(v)) return 'past';
    if(m[0].startsWith('You') && !MODAL.test(v)) return 'present';
    if(/^[a-z]+s$/.test(v)) return 'present';
    return null;
}

function collector(game, route) {
    const lines = [];
    return {
        lines,
        scan(step) {
            const box = game.document.getElementById('message_box_div');
            for(const node of box ? [...box.children] : []) {
                if(!node.dataset?.logKind) continue;
                const clean = el => String(el?.textContent || '').replace(/\s+/g, ' ').trim();
                // A line carries an original and a compact span (one shows, by presentation),
                // plus an optional tooltip; record all three and the fold count.
                const text = clean(node.querySelector('.log-original')) || clean(node);
                const compact = clean(node.querySelector('.log-compact'));
                const row = {route, step, kind: node.dataset.logKind, text, compact: compact !== text ? compact : undefined,
                    title: node.getAttribute('title') || undefined, repeat: Number(node.dataset.repeat || 1)};
                if(node.dataset.lcId) {Object.assign(lines[Number(node.dataset.lcId)], {text, compact: row.compact, repeat: row.repeat}); continue;}
                node.dataset.lcId = String(lines.length);
                lines.push(row);
            }
        }
    };
}

async function run(route, save, actions) {
    const game = await boot(save, {seed: SEED, wallStart: WALL_START, heroName: null});
    const c = collector(game, route);
    const errors = [];
    try {
        c.scan('boot');
        for(const [label, act] of actions) {
            try {await act(game);} catch(e) {errors.push(`${label}: ${String(e.message || e).slice(0, 160)}`);}
            c.scan(label);
        }
    } finally {game.close();}
    return {lines: c.lines, errors: [...errors, ...game.errors.map(e => String(e).slice(0, 160))]};
}

const villageActions = (() => {
    const saves = {};
    return ROUTE.map((s, i) => [`${i}:${s.op}${s.sel ? ' ' + s.sel.slice(0, 40) : ''}`, async game => {
        if(s.op === 'click') await game.click(s.sel);
        else if(s.op === 'step') await game.step(s.minutes);
        else if(s.op === 'save') saves[s.name] = await game.save();
        else if(s.op === 'load') {game.storage.clear(); await game.load(PATCHES[s.patch](saves[s.from]));}
    }]);
})();

const idleActions = [
    ['talk elder', async g => {await g.click('.choice_dialogue'); await g.click('[data-dialogue="villageElder"]'); await g.click('[data-textline="hello"]'); await g.click('#center_mode_back');}],
    ['idle 12h', async g => g.step(720)],
    ['idle 12h more', async g => g.step(720)],
];

const tingenActions = [
    ['cross to Tingen', async g => g.clickText('blur_onCross to another world: Tingen')],
    ['begin as Nighthawk probationer', async g => g.clickText('Begin as a Nighthawk probationer')],
    ['confirm crossing', async g => g.clickText('Confirm and cross to Tingen')],
    ['wait 6h', async g => g.step(360)],
    ['wait 18h', async g => g.step(1080)],
];

const routes = {
    'village route': await run('village route', null, villageActions),
    'idle day': await run('idle day', null, idleActions),
    'Tingen day': await run('Tingen day', null, tingenActions),
};

const all = Object.values(routes).flatMap(r => r.lines);
const byKind = {};
for(const l of all) (byKind[l.kind] ||= []).push(l);
const tenses = {past: 0, present: 0};
for(const l of all) {const t = tense(l.text); if(t) tenses[t] += 1;}
const spec = all.filter(l => SPEC.test(l.text) || SPEC.test(l.compact || ''));
const semis = all.filter(l => l.text.includes(';'));
const folded = all.filter(l => l.repeat > 1);
const titled = all.filter(l => l.title);
const specTitles = titled.filter(l => SPEC.test(l.title));
const words = all.map(l => l.text.split(/\s+/).length).sort((a, b) => a - b);
const median = words.length ? words[Math.floor(words.length / 2)] : 0;
const you = all.filter(l => /\b(you|your)\b/i.test(l.text));

mkdirSync(join(ROOT, 'docs/reviews/ui-string-inventory'), {recursive: true});
writeFileSync(JSON_OUT, JSON.stringify({generated: DATE, seed: SEED, routes}, null, 1));
if(process.argv.includes('--json-only')) {console.log(`${all.length} lines -> ${JSON_OUT}`); process.exit(0);}

const pct = n => all.length ? `${(100 * n / all.length).toFixed(1)}%` : '0%';
const esc = s => s.replace(/\|/g, '\\|').slice(0, 140);
const md = [];
md.push(`# UI log capture (${DATE})`, '');
md.push(`Generated by \`node scripts/ui_log_capture.mjs\`. Report-only (L1 in the [copy style sheet](../ui/COPY_STYLE_SHEET.md#round-2-other-games-the-log-and-other-aspects-2026-11-03)). Three headless routes on the full game, seed ${SEED}: the scripted village route (talk, learn, equip, woodcut, buy, smelt), an idle day after talking to the elder, and a day after crossing to Tingen. Every message-log line the player would see is recorded with its kind; folded repeats are read once with their final count. Lines the routes never trigger are not here, so this is a sample of real play, not a census.`, '');
md.push('## Totals', '');
md.push('| Route | Lines | Errors |', '| --- | ---: | ---: |');
for(const [name, r] of Object.entries(routes)) md.push(`| ${name} | ${r.lines.length} | ${r.errors.length} |`);
md.push(`| **All** | **${all.length}** | |`, '');
md.push('## Measures', '');
md.push('| Measure | Value |', '| --- | ---: |');
md.push(`| Median words per line | ${median} |`);
md.push(`| Says "you" or "your" | ${pct(you.length)} |`);
md.push(`| Has a semicolon | ${pct(semis.length)} |`);
md.push(`| Has a spec or dev word | ${pct(spec.length)} |`);
md.push(`| Folded repeats (×N) | ${pct(folded.length)} |`);
md.push(`| Has a tooltip | ${pct(titled.length)} (spec or dev words in ${specTitles.length}) |`);
md.push(`| Tense, lines with a readable subject and verb | past ${tenses.past}, present ${tenses.present} |`, '');
md.push('## By kind', '');
md.push('| Kind | Lines | Example |', '| --- | ---: | --- |');
for(const [kind, rows] of Object.entries(byKind).sort((a, b) => b[1].length - a[1].length)) md.push(`| ${kind} | ${rows.length} | ${esc(rows[0].text)} |`);
md.push('');
md.push('## Lines with spec or dev words', '');
if(!spec.length) md.push('None in these routes.');
for(const l of spec.slice(0, 25)) md.push(`- ${l.route} · ${l.kind}: ${esc(l.text)}`);
for(const t of [...new Set(specTitles.map(l => l.title))].slice(0, 10)) md.push(`- tooltip: ${esc(t)}`);
md.push('');
md.push('## Route errors', '');
const errs = Object.entries(routes).flatMap(([n, r]) => r.errors.map(e => `- ${n}: ${esc(e)}`));
md.push(...(errs.length ? errs : ['None.']), '');
writeFileSync(MD_OUT, md.join('\n'));
console.log(`${all.length} lines; report ${MD_OUT}`);
