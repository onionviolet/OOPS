#!/usr/bin/env node
// Feedback check (FBK1-FBK8, docs/FEEDBACK_RULES.md). Plays each start with the shared trace
// recorder (scripts/headless/trace.mjs, via check_pacing.mjs's cached traceFor) and asks of every
// click: did the player get a visible, specific answer? Findings ratchet against
// scripts/feedback_baseline.json.
//
// NOT part of check:rules: it boots and plays the game (a couple of minutes per start, cached).
//
//   node scripts/check_feedback.mjs                    check every start (records traces that are missing)
//   node scripts/check_feedback.mjs --start village    one start
//   node scripts/check_feedback.mjs --fresh            ignore traces cached under another source build
//   node scripts/check_feedback.mjs --refresh          re-record even when a cached trace exists
//   node scripts/check_feedback.mjs --update-baseline  accept today's findings (after a real change)
//   node scripts/check_feedback.mjs --backlog          write docs/feedback/FEEDBACK_BACKLOG.md
//   node scripts/check_feedback.mjs --probe-disabled   FBK4 runtime probe: sample disabled controls, is a reason on screen? (boots the game; not ratcheted)
//
// Per click, repeat or panel-open step the class is (first match wins):
//   refused-silent       the click threw (action-error / step-error) and nothing visible explained it
//   refused-with-reason  the click threw and a Reports line or new text appeared in the same step
//   visible              a new Reports line, or a text block never seen earlier in the trace
//   visible-weak         only already-seen text re-appeared or went away (could be the clock)
//   state-only           a non-passive save path, money, item, skill level or unlock changed, but
//                        no Reports line and no new text
//   silent               nothing but passive ticks
// A control is FLAGGED (in the baseline) when no occurrence of it, in that start's trace, was
// visible, visible-weak or refused-with-reason. Mixed controls pass: one visible press shows the
// control can speak. Two more findings: generic-ack (a Reports line that is only "Done." and the like)
// and shared-line (one Reports line produced by three or more different controls in a start).
//
// Limits, read before acting on a row (also printed in the backlog):
//  - The policy presses each control once (unseen first), after which `dt` game minutes pass. A
//    silent result can be a policy artifact: the click may need a precondition the bot lacks.
//  - The trace carries no geometry, so "feedback lands far from the control" is not measured.
//  - A disabled control's inline reason is page text the trace does not tie to a control. The
//    refusal part therefore only sees clicks that threw; it is a lower bound.
//  - Passive buckets are ignored as change (same set as the pacing check).
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const BASELINE_PATH = resolve(root, 'scripts/feedback_baseline.json');
const BACKLOG_PATH = resolve(root, 'docs/feedback/FEEDBACK_BACKLOG.md');

// Buckets that tick on their own: skill practice, local-life bookkeeping (as the pacing check), plus the
// time-driven ones seen in traces (a world's own clock, effect durations, the simulation's due/count
// records, rumour days). Every press is followed by `dt` game minutes, so these change on any press.
export const PASSIVE_BUCKETS = new Set(['levels', 'skillRecords', 'absorb_local_life', 'dnd_phandalin', 'active_effects', 'expansion', 'economy_standing']);
export const GENERIC_ACK = /^\W*(done|ok|okay|success|successful|saved|complete|completed|finished|noted|got it|action (done|complete|completed)|you did it|nothing happens|nothing happened)\W*$/i;
export const SHARED_MIN_CONTROLS = 3;
export const FLAG_CLASSES = ['silent', 'state-only', 'refused-silent'];
const OK_CLASSES = new Set(['visible', 'visible-weak', 'refused-with-reason']);
// Starts whose Reports text may quote private-pack or sealed material: the backlog shows a hash, not the line.
const TEXT_SAFE_STARTS = new Set(['village']);

// Selectors that are focus targets, not controls: the recorder's menu includes any [tabindex] element, so
// it "presses" container rows and headings. Their real handler sits on a child (SHOWN by hand check: the
// crafting recipe row acts only when the click lands on its name or icon, display.js "components" rows),
// so a silent result there is a policy artifact, never flagged. Counted in `artifacts`.
export const ARTIFACTS = [
    {re: /^(h[1-6]|p|div|span|li|ul|dl|dd|dt|section|article|header|footer|td|tr)([.#:][^\[]*)?$/, reason: 'a heading, paragraph or container the menu lists for its tabindex'},
    {re: /^div\.message_common\b/, reason: 'a Reports line; the menu lists it for its tabindex'},
    {re: /^#[\w-]+_div$/, reason: 'a container div the menu lists (for example #location_actions_div); its children are the controls'},
    {re: /^#ui-disabled-[#\d]+$/, reason: 'a focusable note that explains a disabled control; it is not a control'},
    {re: /^\[data-recipe_id="[^"]*"\]$/, reason: 'a crafting recipe row; the handler needs the click on the name or icon'},
    // SHOWN 2026-11-07 (index.html move_trade_item): in a trade, a press moves the row between the trader list and
    // your basket and updates the total; the same text blocks move, so a text diff reads it as silent. Outside a
    // trade the same row press opens Item details (hand check: +500 to +850 characters). A trade press that truly
    // does nothing (an item the trader has run out of) stays a LATER browser check in the backlog, not a flag here.
    {re: /^\[[^ ]*\[?data-(trader|character)_item=/, reason: 'an inventory or trade row; in a trade the row moves between lists (same text), elsewhere it opens Item details'},
    // SHOWN 2026-11-07 (proto23_shell chooseSlot): a worn-item or filled slot press selects that slot; when its
    // detail already shows (the bot pressed the twin control first), nothing new appears. The first press answers.
    {re: /^(button\.shell-worn-item: (arms|head|torso|legs|feet|ring|weapon|off-hand|neck|back|hands)|button: (arms|head|torso|legs|feet|ring|weapon|off-hand|neck|back|hands) · (?!empty$))/i, reason: 'a filled equipment slot; it re-selects a detail already on screen'},
    // SHOWN 2026-11-07 (headless click on every summary in the village tree): a native details disclosure flips its
    // `open` state and shows text that is already in the page, so a text diff reads it as silent. The player sees it
    // open or close; the text it shows was read when the section first rendered.
    {re: /^summary: /, reason: 'a native disclosure; its open state flips and it shows text already in the page'},
];
export const artifactReason = selector => ARTIFACTS.find(a => a.re.test(selector))?.reason ?? null;

const mask = s => String(s).replace(/\d+/g, '#').replace(/\s+/g, ' ').trim().toLowerCase();
const hash = s => createHash('sha1').update(mask(s)).digest('hex').slice(0, 8);

/** Stable key for a control: digits in generated ids are masked, and a bare tag selector adds the label. */
export function controlKey(action) {
    const sel = String(action.selector).replace(/(?<=[-_=:"])\d+/g, '#');
    return /^(button|summary|a|div|span|label|li)(\.[\w-]+)*$/.test(sel) ? `${sel}: ${mask(action.label).slice(0, 40)}` : sel;
}

/** Pure: what changed for the player on one step. */
export function classifyStep(step) {
    const kind = step.action?.kind;
    const reports = step.reports ?? [], text = step.text ?? {};
    const strong = reports.length > 0 || (text.novel ?? 0) > 0;
    const weak = (text.new ?? 0) > 0 || (text.removed ?? 0) > 0;
    const buckets = Object.entries(step.changed?.buckets ?? {}).filter(([k]) => !PASSIVE_BUCKETS.has(k));
    const state = buckets.length > 0 || (step.money?.delta ?? 0) !== 0 || (step.items ?? []).length > 0
        || (step.skills ?? []).some(s => s.levelDelta > 0) || (step.unlocks ?? []).length > 0;
    const threw = (step.refusals ?? []).some(r => r.kind === 'action-error' || r.kind === 'step-error');
    if(threw) return strong || weak ? 'refused-with-reason' : 'refused-silent';
    if(strong) return 'visible';
    if(weak) return 'visible-weak';
    if(state) return 'state-only';
    return kind === 'wait' ? 'wait' : 'silent';
}

/** Pure: analyse one start's records. Returns controls keyed by selector plus the line findings. */
export function analyzeTrace(records) {
    const meta = records.find(r => r.type === 'meta');
    const end = records.find(r => r.type === 'end');
    if(!meta) return {start: null, status: 'error', notes: ['no meta line']};
    // A trace that ended in an error (for example a start whose enrol step failed) says nothing about feedback.
    if(end?.reason === 'error' || !records.some(r => r.type === 'step')) return {start: meta.start, status: 'pending', notes: [`trace ended: ${end?.reason ?? 'no end line'}; ${(end?.errors ?? []).join(' ').slice(0, 120)}`]};
    const steps = records.filter(r => r.type === 'step' && r.action && r.action.kind !== 'wait');
    const controls = new Map(), lines = new Map(), counts = {};
    for(const s of steps) {
        const cls = classifyStep(s);
        counts[cls] = (counts[cls] || 0) + 1;
        const key = controlKey(s.action);
        let c = controls.get(key);
        if(!c) controls.set(key, c = {raw: String(s.action.selector).replace(/(?<=[-_=:"])\d+/g, '#'), selector: key, label: s.action.label, kind: s.action.kind, n: 0, firstI: s.i, classes: {}, example: null});
        c.n++; c.classes[cls] = (c.classes[cls] || 0) + 1;
        if(!c.example && !OK_CLASSES.has(cls)) c.example = {i: s.i, buckets: Object.keys(s.changed?.buckets ?? {}).filter(k => !PASSIVE_BUCKETS.has(k)).slice(0, 4), money: s.money?.delta ?? 0, unlocks: (s.unlocks ?? []).slice(0, 3)};
        for(const r of s.reports ?? []) {
            const k = mask(r);
            let l = lines.get(k);
            if(!l) lines.set(k, l = {text: r, controls: new Set(), n: 0});
            l.controls.add(key); l.n++;
        }
    }
    const flagged = {silent: [], 'state-only': [], 'refused-silent': []}, artifacts = [];
    for(const c of controls.values()) {
        const why = artifactReason(c.raw) ?? artifactReason(c.selector);
        if(why) {if(![...Object.keys(c.classes)].some(k => OK_CLASSES.has(k))) artifacts.push(c.selector); continue;}
        if([...Object.keys(c.classes)].some(k => OK_CLASSES.has(k))) continue;
        const worst = c.classes['refused-silent'] ? 'refused-silent' : c.classes['state-only'] ? 'state-only' : c.classes.silent ? 'silent' : null;
        if(worst) flagged[worst].push(c.selector);
    }
    const genericAck = [], sharedLine = [];
    for(const [k, l] of lines) {
        if(GENERIC_ACK.test(l.text.trim())) genericAck.push({id: hash(k), text: l.text, controls: [...l.controls]});
        else if(l.controls.size >= SHARED_MIN_CONTROLS) sharedLine.push({id: hash(k), text: l.text, controls: [...l.controls]});
    }
    return {start: meta.start, status: 'ok', actions: steps.length, endReason: end?.reason ?? null, counts,
        controls: [...controls.values()], flagged, artifacts, genericAck, sharedLine};
}

/** Pure: the baseline object recording today's findings. */
export function buildBaseline(results, params) {
    const starts = {};
    for(const r of results) {
        if(r.status !== 'ok') continue;
        starts[r.start] = {
            silent: [...r.flagged.silent].sort(), stateOnly: [...r.flagged['state-only']].sort(), refusedSilent: [...r.flagged['refused-silent']].sort(),
            genericAck: r.genericAck.map(g => g.id).sort(), sharedLine: r.sharedLine.map(g => g.id).sort(),
        };
    }
    return {schema: 1, note: 'Feedback ratchet (FBK6). Controls with no visible answer in the recorded trace, by start. Regenerate with check_feedback.mjs --update-baseline.', params, starts};
}

const SECTIONS = [['silent', 'silent'], ['stateOnly', 'state-only'], ['refusedSilent', 'refused-silent']];

/** Pure: compare current results with a baseline. A new finding fails; a retired one is a "tighten". */
export function compareToBaseline(results, baseline) {
    const regressions = [], tighten = [];
    const current = buildBaseline(results, baseline.params).starts;
    for(const [start, cur] of Object.entries(current)) {
        const base = baseline.starts?.[start];
        if(!base) {
            const n = Object.values(cur).reduce((a, v) => a + v.length, 0);
            if(n) regressions.push({start, section: 'all', id: `${n} findings`, note: 'start not in baseline'});
            continue;
        }
        for(const sec of [...SECTIONS.map(s => s[0]), 'genericAck', 'sharedLine']) {
            const had = new Set(base[sec] ?? []);
            for(const id of cur[sec]) if(!had.has(id)) regressions.push({start, section: sec, id, note: 'new finding'});
            for(const id of had) if(!cur[sec].includes(id)) tighten.push({start, section: sec, id, note: 'retired; update the baseline'});
        }
    }
    return {regressions, tighten, ok: regressions.length === 0};
}

/** Pure: roll the per-start controls up by selector for the ranked backlog. */
export function rollUp(results) {
    const by = new Map();
    for(const r of results) {
        if(r.status !== 'ok') continue;
        const flagged = new Map();
        for(const cls of FLAG_CLASSES) for(const sel of r.flagged[cls]) flagged.set(sel, cls);
        for(const c of r.controls) {
            let g = by.get(c.selector);
            if(!g) by.set(c.selector, g = {selector: c.selector, label: c.label, starts: new Set(), flaggedStarts: new Map(), n: 0, nFlagged: 0, minI: c.firstI, example: null});
            g.starts.add(r.start); g.n += c.n; g.minI = Math.min(g.minI, c.firstI);
            if(flagged.has(c.selector)) {g.flaggedStarts.set(r.start, flagged.get(c.selector)); g.nFlagged += c.n; g.example ??= c.example;}
        }
    }
    return [...by.values()].filter(g => g.flaggedStarts.size).sort((a, b) =>
        (b.nFlagged - a.nFlagged) || (b.flaggedStarts.size - a.flaggedStarts.size) || (a.minI - b.minI) || a.selector.localeCompare(b.selector));
}

const esc = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').slice(0, 80);

export function backlogText(results, params) {
    const L = [];
    L.push('# Feedback backlog', '');
    L.push('Generated by `node scripts/check_feedback.mjs --backlog` (2026-11-06). Do not edit by hand; edit the generator.');
    L.push('Rules: [FEEDBACK_RULES](../FEEDBACK_RULES.md) (proposed, AD32). Owners it links: UR35, UR57, UR62, UIV1 in [UI rules](../UI_RULES.md), RPT1-RPT14 for Reports lines.');
    L.push(`Recording: seed ${params.seed}, up to ${params.actions} actions, ${params.dt} game minutes per action (deterministic curious-player trace, scripts/headless/trace.mjs).`, '');
    L.push('## Measured', '', '| Start | Presses | visible | weak | state-only | silent | refused | Flagged controls | Policy artifacts | Generic acks | Shared lines |', '|---|---|---|---|---|---|---|---|---|---|---|');
    for(const r of results) {
        if(r.status !== 'ok') {L.push(`| ${r.start} | ${r.status === 'pending' ? 'pending (trace errored; re-record)' : r.status} | | | | | | | | | |`); continue;}
        const c = r.counts, f = r.flagged;
        L.push(`| ${r.start} | ${r.actions} | ${c.visible || 0} | ${c['visible-weak'] || 0} | ${c['state-only'] || 0} | ${c.silent || 0} | ${(c['refused-silent'] || 0) + (c['refused-with-reason'] || 0)} | ${f.silent.length + f['state-only'].length + f['refused-silent'].length} | ${r.artifacts.length} | ${r.genericAck.length} | ${r.sharedLine.length} |`);
    }
    const rows = rollUp(results);
    L.push('', '## Controls with no visible answer, ranked (presses in the trace, then starts, then how early)', '',
        '| # | Control | Label | Class by start | Presses | First step | Only changed |', '|---|---|---|---|---|---|---|');
    rows.slice(0, 120).forEach((g, i) => {
        const cls = [...g.flaggedStarts].map(([s, c]) => `${s}: ${c}`).join('; ');
        const ex = g.example ? [...g.example.buckets, ...(g.example.money ? ['money'] : []), ...g.example.unlocks].join(', ') || 'nothing' : '';
        L.push(`| ${i + 1} | \`${esc(g.selector)}\` | ${esc(g.label)} | ${esc(cls)} | ${g.nFlagged} | ${g.minI} | ${esc(ex)} |`);
    });
    if(!rows.length) L.push('| | none | | | | | |');
    if(rows.length > 120) L.push('', `${rows.length - 120} more rows in the baseline.`);
    L.push('', '## Generic acknowledgements and shared lines', '', '| Start | Kind | Line | Controls |', '|---|---|---|---|');
    let any = false;
    for(const r of results) {
        if(r.status !== 'ok') continue;
        for(const [kind, list] of [['generic-ack', r.genericAck], ['shared-line', r.sharedLine]]) for(const g of list) {
            any = true;
            const shown = kind === 'generic-ack' || TEXT_SAFE_STARTS.has(r.start) ? esc(g.text) : `line ${g.id} (hash; text not copied)`;
            L.push(`| ${r.start} | ${kind} | ${shown} | ${g.controls.length} (${g.controls.slice(0, 3).map(esc).join('; ')}) |`);
        }
    }
    if(!any) L.push('| | none | | |');
    L.push('', '## Policy limits (read before acting on a row)', '',
        '- A flagged control is one the policy pressed and saw no visible answer to. The policy presses each control once, then lets time pass; a control that needs a held item, a chosen target or a prior step can look silent for that reason. Check one by hand (`scripts/headless/runner.mjs`) before changing the game.',
        '- Not measured: whether feedback lands near the control (no geometry in the trace), animation or sound cues, and inline reasons next to a disabled control. Refusals counted here are clicks that threw, a lower bound.',
        '- Book-start Reports text is shown only as a hash (it may carry private-pack text); read it from the trace or the game.');
    return L.join('\n') + '\n';
}

/** Newest cached trace for this start and these params, from any bundle build (traces are keyed by the
 * source hash, which shifts with every unrelated edit; the findings key on controls, so a slightly older
 * trace is still a fair read). `--fresh` skips this and records under the current bundle. */
export function newestCachedTrace(id, params) {
    const base = join(tmpdir(), 'yairpg-traces');
    if(!existsSync(base)) return null;
    const name = `${id}.s${params.seed}.m${params.minutes}.a${params.actions}.d${params.dt}.jsonl`;
    const hits = readdirSync(base).map(d => join(base, d, name)).filter(f => existsSync(f)).map(f => ({f, t: statSync(f).mtimeMs})).sort((a, b) => b.t - a.t);
    return hits[0]?.f ?? null;
}

// FBK4 runtime probe. The trace presses only enabled controls, so refusals are not measured there. This boots a
// start, finds disabled controls on screen (button[disabled], aria-disabled, disabled select options), tries to
// click a sample (the runner refuses a disabled target, as a browser does) and records where a reason shows:
//   inline      a visible reason node near the control (aria-describedby target, .ui-disabled-reason,
//               .ui-action-reason, [data-disabled-reason]) or reason words in the option text
//   title-only  only a title / aria-description (a hover tooltip: UIV1 says it is never found)
//   none        no reason anywhere
// Pure: `el` needs getAttribute, textContent, parentElement, ownerDocument.getElementById, querySelectorAll.
const REASON_NODES = '.ui-disabled-reason, .ui-action-reason, [data-disabled-reason], [id^="ui-disabled-"]';
const words = t => String(t ?? '').replace(/\s+/g, ' ').trim();
export function disabledReasonKind(el, hidden = () => false) {
    const seen = node => node && !hidden(node) && words(node.textContent).length > 3;
    for(const id of words(el.getAttribute?.('aria-describedby')).split(' ').filter(Boolean)) if(seen(el.ownerDocument?.getElementById?.(id))) return 'inline';
    if(el.tagName === 'OPTION' && / · \S/.test(words(el.textContent))) return 'inline';
    if(words(el.getAttribute?.('data-disabled-reason')) && !hidden(el)) return 'inline';
    for(let box = el.parentElement, depth = 0; box && depth < 2; box = box.parentElement, depth++)
        for(const n of box.querySelectorAll?.(REASON_NODES) ?? []) if(n !== el && seen(n)) return 'inline';
    if(words(el.getAttribute?.('title')) || words(el.getAttribute?.('aria-description'))) return 'title-only';
    return 'none';
}

/** Boot one start, sample disabled controls, return [{start, label, kind, clickRefused}] (not ratcheted). */
export async function probeDisabled(startId, {sample = 12} = {}) {
    const {leadBot} = await import('./headless/lead_bot.mjs');
    const bot = await leadBot(null, {seed: 1, wallStart: Date.UTC(2026, 0, 1, 12)});
    const g = bot.game, out = [];
    try {
        if(startId !== 'village') {
            const sel = '#workspace_navigation select[aria-label="Other known panels"]';
            await g.fill(sel, 'beginning'); await g.fill('select[data-structured-choice="life"]', startId);
            await g.click('[data-structured-begin]'); await g.settle(500);
        }
        await bot.step(10, {invariants: false}); await g.settle(900);
        g.css.reset();
        const found = [...g.$$('button[disabled], [aria-disabled="true"], select option[disabled]')].filter(e => e.tagName === 'OPTION' || !g.css.hiddenReason(e));
        const seen = new Set();
        for(const el of found) {
            const label = words(el.textContent).slice(0, 60);
            if(!label || seen.has(label)) continue;
            seen.add(label);
            if(out.length >= sample) break;
            let refused = el.tagName === 'OPTION';
            if(!refused) try {await g.click(el);} catch {refused = true;}
            out.push({start: startId, label, kind: disabledReasonKind(el, n => !!g.css.hiddenReason(n)), clickRefused: refused});
        }
    } finally {bot.close();}
    return out;
}

async function main() {
    const {traceFor, PARAMS, parseJsonl} = await import('./check_pacing.mjs');
    const {listStarts} = await import('./headless/trace.mjs');
    const argv = process.argv.slice(2), has = f => argv.includes(f), val1 = f => argv[argv.indexOf(f) + 1];
    if(has('--probe-disabled')) {
        const starts = has('--start') ? [val1('--start')] : ['village', 'book.hp.school', 'lotm.probationer'];
        const rows = [];
        for(const id of starts) rows.push(...await probeDisabled(id));
        for(const r of rows) console.log(`${r.kind.padEnd(10)} ${r.start.padEnd(18)} ${r.label}`);
        const by = k => rows.filter(r => r.kind === k).length;
        console.log(`disabled-control probe (FBK4): ${rows.length} sampled, ${by('inline')} inline reason, ${by('title-only')} title only, ${by('none')} none.`);
        process.exit(0);
    }
    const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) : {starts: {}};
    const params = {...PARAMS};
    for(const k of ['seed', 'minutes', 'actions', 'dt']) if(has('--' + k)) params[k] = +val1('--' + k);
    const ids = has('--start') ? [val1('--start')] : (await listStarts()).map(s => s.id);
    const results = [];
    for(const id of ids) {
        try {
            const cached = has('--fresh') || has('--refresh') ? null : newestCachedTrace(id, params);
            let {records} = cached ? {records: parseJsonl(readFileSync(cached, 'utf8'))} : await traceFor(id, {params, refresh: has('--refresh')});
            let a = analyzeTrace(records);
            if(a.status === 'pending' && !has('--refresh')) {({records} = await traceFor(id, {params, refresh: true})); a = analyzeTrace(records);}   // a cached error trace may predate a recorder fix
            results.push(a);
        } catch(e) {results.push(e?.skip ? {start: id, status: 'skipped'} : {start: id, status: 'error', notes: [e.message]});}
        const r = results.at(-1);
        process.stderr.write(`${id}: ${r.status}${r.status === 'ok' ? ` presses ${r.actions} flagged ${r.flagged.silent.length + r.flagged['state-only'].length + r.flagged['refused-silent'].length}` : ''}\n`);
    }
    const ran = results.filter(r => r.status === 'ok');
    if(has('--update-baseline')) {
        if(has('--start')) {console.error('--update-baseline needs every start (omit --start).'); process.exit(2);}
        writeFileSync(BASELINE_PATH, JSON.stringify(buildBaseline(ran, params), null, 2) + '\n');
        console.log(`feedback baseline written for ${ran.length} starts.`);
    }
    const base = has('--update-baseline') ? buildBaseline(ran, params) : baseline;
    const cmp = compareToBaseline(ran, base);
    if(has('--backlog')) {mkdirSync(dirname(BACKLOG_PATH), {recursive: true}); writeFileSync(BACKLOG_PATH, backlogText(results, params)); console.log(`wrote ${BACKLOG_PATH}`);}
    for(const t of cmp.tighten) console.log(`tighten  ${t.start} ${t.section} ${t.id}: ${t.note}`);
    for(const g of cmp.regressions) console.log(`REGRESSION ${g.start} ${g.section} ${g.id}: ${g.note}`);
    if(JSON.stringify(baseline.params ?? params) !== JSON.stringify(params)) console.log('note: recording parameters differ from the baseline; findings are not comparable.');
    const total = rollUp(ran).length;
    console.log(`feedback: ${ran.length} starts measured, ${total} controls without a visible answer, ${cmp.regressions.length} regressions.`);
    process.exit(cmp.ok ? 0 : 1);
}

if(process.argv[1] === fileURLToPath(import.meta.url)) await main();
