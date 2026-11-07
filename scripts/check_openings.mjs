#!/usr/bin/env node
// Openings check (OPN1-OPN9, docs/OPENING_RULES.md). Looks at what a new player meets in the
// first scenes of each start: the first screen (captured here) and the first ~60 presses of the
// shared curious-player trace (scripts/headless/trace.mjs, recorded by the PAC lane's cache).
//
// NOT part of check:rules: it boots the game once per start for the first screen and reuses (or
// records) the trace. Propose: "check:openings": "node scripts/check_openings.mjs".
//
//   node scripts/check_openings.mjs                      every start, ratcheted against the baseline
//   node scripts/check_openings.mjs --start village      one start
//   node scripts/check_openings.mjs --resume             reuse results from an interrupted run (OS temp)
//   node scripts/check_openings.mjs --skip a,b           leave starts out (private packs)
//   node scripts/check_openings.mjs --refresh            re-capture scenes and re-record traces
//   node scripts/check_openings.mjs --update-baseline    accept today's numbers (needs every start)
//   node scripts/check_openings.mjs --backlog            write docs/openings/OPENINGS_BACKLOG.md
//
// Flags (code = OPN rule; value = what the ratchet compares; all are defaults with dials in DIALS):
//   no-action          OPN1  first screen has no enabled scene action
//   stale-pointer      OPN8  "Next step" names something not on this screen
//   foreign-place      OPN8  a refusal reason names the Village on a start that is not the Village
//   prose-wall         OPN2  words of scene prose on the first screen above the budget (value = words)
//   long-block         OPN2  one block above the word budget (value = words in the longest)
//   unexplained-term   OPN3  a control label uses a capitalised term no screen text introduces (value = count)
//   same-label         OPN3  two or more controls share one label (value = largest group)
//   refusal-no-reason  OPN4  a disabled scene action on the first screen with no reason text (value = count)
//   trace-refusal-no-reason OPN4 a disabled control met in the trace with no title reason (policy-limited)
//   engine-reason      OPN4  an engine fallback reason is shown (value = count)
//   first-action-late  OPN5  presses before a scene action first changes anything (value = presses)
//   first-payoff-late  OPN5  presses before the first payoff (value = presses)
//   no-effect-choice   OPN6  scene-action presses that changed nothing visible (value = count)
//   dead-stretch       OPN7  longest run of presses with nothing visible changing (value = presses)
// A flag on a trace measure is "policy-limited" when the curious bot, not the screen, may be the
// cause (it presses what it has not pressed, in its own order). Those never rank in the backlog top.
import {existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {execSync, spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const BASELINE_PATH = resolve(root, 'scripts/openings_baseline.json');
const BACKLOG_PATH = resolve(root, 'docs/openings/OPENINGS_BACKLOG.md');
const PANEL_SELECT = '#workspace_navigation select[aria-label="Other known panels"]';

/** Trace parameters: the same as the pacing check, so its cached traces are reused. */
export const PARAMS = Object.freeze({seed: 1, minutes: 960, actions: 100, dt: 10});

/** Dials (OPN rules): default, dial, reason live in docs/OPENING_RULES.md. */
export const DIALS = Object.freeze({
    window: {steps: 60, minutes: 720},   // how much of the trace counts as "the opening"
    proseWords: 300,                     // words of scene prose on the first screen
    blockWords: 60,                      // words in one block
    firstActionSteps: 6,                 // presses before something real happens
    firstPayoffSteps: 20,                // presses before the first payoff
    noEffectChoices: 3,                  // scene-action presses that changed nothing
    deadRun: 6,                          // consecutive presses with nothing visible
});

export const PASSIVE_BUCKETS = new Set(['levels', 'skillRecords', 'absorb_local_life']);
// Engine fallback reasons (src/player_reasons.js, UR73/UR82). Copied so the pure analysis has no src import.
export const ENGINE_REASONS = Object.freeze([
    'The required knowledge, means or circumstances are missing.',
    'This command belongs to another world.', 'This command belongs to another actor.', 'This command belongs to another actor role.',
    'This expedition belongs to another world.', 'This source-specific rule belongs to another world.',
]);
const ACTION_ATTR = /^data-(?:native-choice|village-action|dialogue|textline|focus-action|field-command|expedition-action|campaign|lotm|structured-action|structured-repeat|structured-extension|structured-begin|pack-action|action|command|activity|trade|recipe|choice)\b/;
// Trace presses that browse the interface rather than act in the scene.
const BROWSE_SEL = /shell-stat|workspace-action|panel-path|control-box|data-character_item|data-item_|summary|overflow|data-recipe|shell-attributes|save_|options_/;
const BROWSE_LABEL = /^(?:←|back\b|close|cancel|×|attributes|gear ·|full item|find|‹|›|next|previous|expand|shortcuts|tools|body ·|latest|reports|filter|menu|here|stats|condition|inventory|ledger|settings|beginning|connection|worlds)|· empty$|^star_border/i;
const STOP = new Set('talk with from that this then your have into onto them what when where about after before over under here there local actions open start take give make find look walk'.split(' '));
const TERM_OK = new Set(['village', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'xp', 'hp', 'lv', 'ap', 'ep', 'str', 'agl', 'dex', 'int',
    'sequence', 'pathway']);   // world terms the player chose the start for count as given after the confirm step (OPN3 dial)

const clean = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const words = s => (clean(s).match(/\S+/g) || []).length;
const norm = s => clean(s).toLowerCase();
export const parseJsonl = text => text.split('\n').filter(Boolean).map(l => JSON.parse(l));

// ---------------------------------------------------------------------------------------------
// Pure analysis

/** Did this step visibly change anything? Passive skill ticks and clock noise do not count. */
export function stepEffect(s) {
    const buckets = Object.keys(s.changed?.buckets || {}).filter(b => !PASSIVE_BUCKETS.has(b));
    const payoff = (s.money?.delta || 0) > 0 || (s.items || []).some(x => x.delta > 0) || (s.skills || []).some(x => x.levelDelta > 0) || (s.unlocks || []).length > 0;
    return {payoff, changed: buckets.length > 0, report: (s.reports || []).length > 0, novel: (s.text?.novel || 0) > 0,
        any: payoff || buckets.length > 0 || (s.reports || []).length > 0 || (s.text?.novel || 0) > 0};
}
/** A press on the scene (a place's actions, people, stations) as opposed to browsing tiles, tabs and slots. */
export function isSceneAction(s) {
    const a = s.action || {};
    if(a.kind !== 'click' && a.kind !== 'repeat') return false;
    if(BROWSE_SEL.test(a.selector || '')) return false;
    if(BROWSE_LABEL.test(clean(a.label))) return false;
    return true;
}

const hasReason = (c) => clean(c.reason).length > 0;

/** Capitalised words in a control label that are not its first word. */
export function labelTerms(label) {
    const out = [];
    // A person or place named after Talk to / Walk to is introduced by the control itself (it says who and where).
    if(/^(?:Repeat )?(?:Talk to|Walk to|Speak with|Go to) /.test(clean(label))) return [];
    const toks = clean(label).replace(/^Repeat /, '').split(/[\s·,:;()]+/).filter(Boolean);   // a Repeat button shares its action's first word
    toks.forEach((t, i) => {
        if(i === 0) return;
        const w = t.replace(/[^A-Za-z'’-]/g, '');
        if(w.length >= 4 && /^[A-Z][a-z]/.test(w) && !TERM_OK.has(w.toLowerCase())) out.push(w);
    });
    return out;
}

/**
 * Pure. scene: {start, blocks:[{text, region}], controls:[{label, action, enabled, reason}], pointer:{text,target}|null}
 * steps: trace step records. Returns {start, status, measures, flags[], walk}.
 */
export function analyzeOpening({start, scene, steps = [], meta = null}, dials = DIALS) {
    const flags = [], M = {};
    const add = (code, value, detail, policyLimited = false) => flags.push({code, value, detail, policyLimited});
    const win = steps.filter(s => s.i < dials.window.steps && s.t <= dials.window.minutes);

    // --- first screen
    const sceneBlocks = (scene?.blocks || []).filter(b => b.region === 'scene');
    const prose = sceneBlocks.filter(b => words(b.text) >= 7);
    M.proseWords = prose.reduce((n, b) => n + words(b.text), 0);
    M.longestBlockWords = prose.reduce((n, b) => Math.max(n, words(b.text)), 0);
    M.proseBlocks = prose.length;
    const actions = (scene?.controls || []).filter(c => c.action);
    M.actionsEnabled = actions.filter(c => c.enabled).length;
    M.actionsDisabled = actions.filter(c => !c.enabled).length;
    if(scene) {
        if(M.actionsEnabled === 0) add('no-action', 1, 'the first screen offers no enabled scene action');
        if(M.proseWords > dials.proseWords) add('prose-wall', M.proseWords, `${M.proseWords} words of scene prose in ${M.proseBlocks} blocks before the first press (budget ${dials.proseWords})`);
        if(M.longestBlockWords > dials.blockWords) add('long-block', M.longestBlockWords, `longest block is ${M.longestBlockWords} words (budget ${dials.blockWords})`);

        // terms a control uses that no screen text introduces
        const labels = (scene.controls || []).map(c => norm(c.label)).filter(Boolean);
        const sources = norm([...sceneBlocks, ...(scene.blocks || []).filter(b => b.region === 'reports' || b.region === 'pointer')]
            .filter(b => !labels.some(l => l === norm(b.text) || norm(b.text).startsWith(l) || l.startsWith(norm(b.text)) && norm(b.text).length > 6))
            .map(b => b.text).join(' | '));
        const unexplained = [];
        for(const c of actions) for(const t of labelTerms(c.label)) if(!sources.includes(t.toLowerCase()) && !unexplained.includes(t)) unexplained.push(t);
        M.unexplainedTerms = unexplained;
        if(unexplained.length) add('unexplained-term', unexplained.length, `control labels use ${unexplained.map(t => `"${t}"`).join(', ')} with no screen text introducing them`);

        const groups = new Map();
        for(const c of actions) groups.set(norm(c.label), (groups.get(norm(c.label)) || 0) + 1);
        const same = [...groups].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
        M.sameLabel = same.map(([l, n]) => ({label: l.slice(0, 50), n}));
        if(same.length) add('same-label', same[0][1], `${same[0][1]} controls are all labelled "${same[0][0].slice(0, 40)}"`);

        const reasonFor = c => {
            if(hasReason(c)) return true;
            const m = clean(c.label).match(/^Repeat (.+?) \d+ times$/);   // a repeat button shares its base action's reason
            return !!m && actions.some(o => norm(o.label) === norm(m[1]) && hasReason(o));
        };
        const noReason = actions.filter(c => !c.enabled && !reasonFor(c));
        const engineC = (scene.controls || []).filter(c => ENGINE_REASONS.some(r => clean(c.reason).includes(r)));
        const engineB = (scene.blocks || []).filter(b => ENGINE_REASONS.some(r => clean(b.text).includes(r)));
        const engine = engineB.length >= engineC.length ? engineB : engineC;
        M.disabledNoReason = noReason.length; M.engineReasons = engine.length;
        const traceNoReason = win.flatMap(s => s.refusals || []).filter(r => r.kind === 'disabled' && !/: ./.test(r.text) && !actions.some(c => norm(c.label).startsWith(norm(r.text)) && hasReason(c)));
        M.traceRefusalsNoReason = traceNoReason.length;
        if(noReason.length) add('refusal-no-reason', noReason.length, `${noReason.length} disabled action(s) on the first screen give no reason`);
        if(traceNoReason.length) add('trace-refusal-no-reason', traceNoReason.length, `${traceNoReason.length} disabled control(s) met in the first presses show no title reason (${traceNoReason.slice(0, 3).map(r => `"${clean(r.text).slice(0, 30)}"`).join(', ')}); the trace cannot read aria-describedby, so some may have one`, true);
        if(engine.length) add('engine-reason', engine.length, `engine fallback text is shown ${engine.length} time(s)`);

        // guidance carried in from another world
        if(scene.pointer?.target) {
            const toks = clean(scene.pointer.target).toLowerCase().match(/[a-z]{4,}/g)?.filter(w => !STOP.has(w)) || [];
            const hay = norm([...sceneBlocks.map(b => b.text), ...actions.map(c => c.label)].join(' | '));
            if(toks.length && !toks.some(w => hay.includes(w))) add('stale-pointer', 1, `"Next step" names ${toks.map(w => `"${w}"`).join(', ')}, which this screen does not show`);
        }
        if(start !== 'village') {
            const reasons = (scene.controls || []).filter(c => /\bVillage\b/.test(c.reason || ''));
            const villageOnScreen = sceneBlocks.some(b => /\bVillage\b/.test(b.text));
            if(reasons.length && !villageOnScreen) add('foreign-place', reasons.length, `${reasons.length} refusal reason(s) tell the player to go back to the Village`);
        }
    }

    // --- first presses of the trace
    M.stepsSeen = win.length;
    const eff = win.map(stepEffect);
    const firstAct = win.findIndex((s, k) => isSceneAction(s) && (eff[k].changed || eff[k].payoff || eff[k].report));
    M.firstActionStep = firstAct < 0 ? null : firstAct + 1;
    M.firstActionMin = firstAct < 0 ? null : win[firstAct].t;
    const firstPay = win.findIndex((s, k) => eff[k].payoff);
    M.firstPayoffStep = firstPay < 0 ? null : firstPay + 1;
    const never = n => n.length + 1;
    if(win.length) {
        const fa = M.firstActionStep ?? never(win);
        if(fa > dials.firstActionSteps) add('first-action-late', fa, M.firstActionStep ? `first scene action that changes anything is press ${fa}` : `no scene action changed anything in ${win.length} presses`, true);
        const fp = M.firstPayoffStep ?? never(win);
        if(fp > dials.firstPayoffSteps) add('first-payoff-late', fp, M.firstPayoffStep ? `first payoff is press ${fp}` : `no payoff in ${win.length} presses`, true);
        const dud = win.filter((s, k) => isSceneAction(s) && !eff[k].any);
        M.noEffectChoices = dud.length;
        M.noEffectLabels = [...new Set(dud.map(s => clean(s.action.label).slice(0, 40)))].slice(0, 6);
        if(dud.length >= dials.noEffectChoices) add('no-effect-choice', dud.length, `${dud.length} scene presses changed nothing visible (${M.noEffectLabels.slice(0, 3).map(l => `"${l}"`).join(', ')})`, true);
        let run = 0, best = 0, bestAt = 0;
        win.forEach((s, k) => {if(eff[k].any) run = 0; else {run++; if(run > best) {best = run; bestAt = k - run + 2;}}});
        M.longestDeadRun = best; M.deadRunFrom = bestAt;
        if(best >= dials.deadRun) add('dead-stretch', best, `${best} presses in a row (from press ${bestAt}) changed nothing visible`, true);
    }
    return {start, status: scene || win.length ? 'ok' : 'empty', measures: M, flags, walk: walkSummary({start, scene, win, M, meta})};
}

/** Short human walk of the first ten minutes (no scene prose: labels and counts only). */
export function walkSummary({start, scene, win, M, meta}) {
    const L = [];
    const acts = (scene?.controls || []).filter(c => c.action);
    const on = acts.filter(c => c.enabled).map(c => clean(c.label).slice(0, 48));
    L.push(`Opens in ${meta?.location ?? 'an unnamed place'}${meta?.world ? ` (${meta.world})` : ''}. First screen: ${M.proseWords} words of scene text in ${M.proseBlocks} blocks, ${M.actionsEnabled} enabled and ${M.actionsDisabled} disabled scene actions${on.length ? ` (${on.slice(0, 4).map(l => `"${l}"`).join(', ')}${on.length > 4 ? ', ...' : ''})` : ''}.`);
    L.push(scene?.pointer ? `The game points at: "${clean(scene.pointer.target).slice(0, 60)}".` : 'The game gives no "Next step" pointer.');
    if(win.length) {
        const first = win[0];
        L.push(`The curious bot's first press is "${clean(first.action.label).slice(0, 40)}"; the first scene action that changes anything is press ${M.firstActionStep ?? 'none'}${M.firstActionMin != null ? ` (${M.firstActionMin} game minutes in)` : ''}; the first payoff is press ${M.firstPayoffStep ?? 'none'}.`);
        L.push(M.longestDeadRun >= DIALS.deadRun ? `It stalls: ${M.longestDeadRun} presses in a row from press ${M.deadRunFrom} change nothing visible.` : `No stall of ${DIALS.deadRun} presses or more in the ${win.length} presses read.`);
    } else L.push('No trace was available for the first presses.');
    return L;
}

// ---------------------------------------------------------------------------------------------
// Ratchet

const TRACE_CODES = new Set(['first-action-late', 'first-payoff-late', 'no-effect-choice', 'dead-stretch']);
export const TOLERANCE = Object.freeze({abs: 1, ratio: 0.25});
const slack = base => Math.max(TOLERANCE.abs, Math.round(base * TOLERANCE.ratio));

/** Pure: results vs baseline -> {regressions, misses, tighten, ok}. A flag must be recorded to pass. */
export function compareToBaseline(results, baseline = {starts: {}}) {
    const regressions = [], misses = [], tighten = [];
    for(const r of results) {
        if(r.status === 'skipped') continue;
        const base = baseline.starts?.[r.start];
        if(r.status === 'error') {if(base?.status !== 'error') regressions.push({start: r.start, code: 'status', note: 'capture failed'}); continue;}
        const seen = new Set();
        for(const f of r.flags) {
            seen.add(f.code);
            misses.push({start: r.start, code: f.code, value: f.value});
            const was = base?.misses?.[f.code];
            if(was == null) {regressions.push({start: r.start, code: f.code, value: f.value, note: 'new flag'}); continue;}
            if(f.value > was + slack(was)) regressions.push({start: r.start, code: f.code, value: f.value, was, note: 'worse than baseline'});
            else if(f.value < was - slack(was)) tighten.push({start: r.start, code: f.code, value: f.value, was, note: 'better than baseline; update it'});
        }
        for(const [code, was] of Object.entries(base?.misses || {})) if(!seen.has(code) && !(r.tracePending && TRACE_CODES.has(code))) tighten.push({start: r.start, code, value: null, was, note: 'flag cleared; retire the baseline entry'});
    }
    return {regressions, misses, tighten, ok: regressions.length === 0};
}

export function buildBaseline(results, params = PARAMS) {
    const starts = {};
    for(const r of results) {
        if(r.status === 'skipped') continue;
        if(r.status === 'error') {starts[r.start] = {status: 'error', misses: {}}; continue;}
        starts[r.start] = {status: r.tracePending ? 'trace-pending' : r.status, measured: {...r.measures, unexplainedTerms: undefined, sameLabel: undefined, noEffectLabels: undefined},
            misses: Object.fromEntries(r.flags.map(f => [f.code, f.value]))};
    }
    return {schema: 1, note: 'Openings ratchet (OPN9). Today\'s flags; values are counts, words or presses. Regenerate with check_openings.mjs --update-baseline.',
        params, dials: DIALS, tolerance: TOLERANCE, starts};
}

// ---------------------------------------------------------------------------------------------
// Capture (game driven)

/** Bundle hash, as the pacing check keys its cache; `withRecorder` adds the trace.mjs hash it appends. */
async function bundleKey(withRecorder = false) {
    const {bundleGame} = await import('./headless/runner.mjs');
    const base = (await bundleGame()).replace(/^.*game-/, '').replace(/\.mjs$/, '');
    return withRecorder ? base + '-' + createHash('sha256').update(readFileSync(join(root, 'scripts/headless/trace.mjs'))).digest('hex').slice(0, 8) : base;
}
const cacheDir = (kind, key) => {const d = join(tmpdir(), kind, key); mkdirSync(d, {recursive: true}); return d;};

async function enterStart(g, id) {
    if(id === 'village') return;
    const open = p => g.fill(PANEL_SELECT, p);
    if(id.startsWith('book.')) {
        await open('beginning');
        const sel = g.$('select[data-structured-choice="life"]');
        if(!sel || ![...sel.options].some(o => o.value === id)) throw Object.assign(new Error(`start ${id} not offered`), {skip: true});
        await g.fill(sel, id); await g.click('[data-structured-begin]');
    } else if(id.startsWith('lotm.')) {
        await open('lotm');
        const pick = g.$(`[data-lotm="pick_${id.slice(5)}"]`);
        if(!pick) throw Object.assign(new Error(`start ${id} not offered`), {skip: true});
        await g.click(pick); await g.click(g.$(`[data-lotm="enroll_${id.slice(5)}"]`) ?? g.$('[data-lotm="enroll"]'));
    } else if(id.startsWith('soldier.')) {
        await open('optional-worlds');
        const btn = g.$(`[data-pack-action="${id.slice(8)}.enter"]`);
        if(!btn) throw Object.assign(new Error(`start ${id} not offered`), {skip: true});
        await g.click(btn);
    } else throw new Error(`Unknown start ${id}`);
}

// Regions: text a player reads as the scene, versus chrome (menus, stat tiles, bag), the Reports log and the pointer.
const CHROME_SEL = '#options_panel, .control-box-panel, .control-box, .game-bar-overflow-item, #workspace_navigation, nav.workspace-toolbar, .workspace-module-header, #character_name_div, #basic_character_info_div, .shell-statline, #inventory_div, .inventory-tabs, #control_box_inventory, .workspace-layout-menu, #loading_screen, svg';
/** The control's own title: first text segment that is not an icon ligature (one lowercase_word). */
function labelOf(el) {
    const segs = [];
    const walk = n => {for(const c of n.childNodes) {if(c.nodeType === 3) {const t = clean(c.data ?? c.textContent); if(t) segs.push(t);} else if(c.nodeType === 1) walk(c);}};
    walk(el);
    const pick = segs.find(t => !/^[a-z_]+$/.test(t) || segs.length === 1);
    return clean(pick ?? iconless(el.textContent));
}
const iconless = s => clean(s).replace(/^[a-z_]+(?=[A-Z])/, '').split(/check_box_outline_blank|check_box/)[0].trim();

/** Boot a fresh game, enter the start, and read the first screen. */
export async function captureScene(id) {
    const {leadBot} = await import('./headless/lead_bot.mjs');
    const bot = await leadBot(null, {seed: PARAMS.seed, wallStart: Date.UTC(2026, 0, 1, 12)});
    const g = bot.game;
    try {
        await enterStart(g, id);
        await g.settle(500);
        await bot.step(1, {invariants: false});
        g.css.reset();
        const blocks = [], controls = [];
        const walk = el => {
            if(['script', 'style', 'option', 'select', 'textarea'].includes(el.localName) || g.css.hiddenReason(el)) return;
            let own = ''; for(const n of el.childNodes) if(n.nodeType === 3) own += ' ' + (n.data ?? n.textContent);
            own = clean(own);
            if(own) {
                const region = el.closest(CHROME_SEL) ? 'chrome' : el.closest('#reports_dock') ? 'pointer' : el.closest('#message_log_div') ? 'reports' : el.closest('button, summary') ? 'control' : 'scene';
                blocks.push({text: own.slice(0, 400), region});
            }
            for(const c of el.children) walk(c);
        };
        walk(g.document.body);
        const reasonOf = el => {
            const bits = [el.getAttribute('title'), el.getAttribute('aria-description')];
            for(const rid of clean(el.getAttribute('aria-describedby')).split(' ').filter(Boolean)) {
                if(/-(?:duration|costs)$/.test(rid)) continue;
                const t = g.document.getElementById(rid); if(t) bits.push(t.textContent);
            }
            if(!bits.some(Boolean)) {const prev = el.previousElementSibling; if(prev && prev.localName === 'p') bits.push(prev.textContent);}   // a note set just above a locked choice
            return clean(bits.filter(Boolean).join(' ')).slice(0, 200);
        };
        for(const el of g.$$('button, [data-native-choice], [data-village-action], [data-dialogue], [data-textline], [role="button"]')) {
            if(g.css.hiddenReason(el) || el.closest(CHROME_SEL)) continue;
            const attrs = el.getAttributeNames();
            const label = labelOf(el).slice(0, 90);
            if(!label) continue;
            const enabled = !el.disabled && el.getAttribute('aria-disabled') !== 'true';
            controls.push({label, action: attrs.some(a => ACTION_ATTR.test(a)) || !!el.closest('.nearby-context-list, [data-native-choice]'), enabled, reason: enabled ? '' : reasonOf(el)});
        }
        const dock = g.$('#reports_dock');
        let pointer = null;
        if(dock && !g.css.hiddenReason(dock)) {
            const row = dock.querySelector('[data-dock-row="next"]');
            if(row) {
                const label = row.querySelector('b')?.textContent ?? '';
                const small = row.querySelector('small')?.textContent ?? '';
                pointer = {text: clean(row.textContent), target: clean(row.textContent).replace(clean(label), '').replace(clean(small), '').trim()};
            }
        }
        return {start: id, location: g.internals.current_location?.id ?? null, world: g.snapshot().expansion?.actors?.player?.worldId ?? null, blocks, controls, pointer};
    } finally {bot.close();}
}

const liveRecorder = id => {try {return execSync(`ps -Ao command | grep -F "trace.mjs --start ${id} " | grep -v grep || true`, {encoding: 'utf8'}).trim().length > 0;} catch {return false;}};
// A trace is usable when it has an end record whose reason is not "error" (PAC re-records errored ones).
/** Newest cached file named `name` under any bundle key (sources change under a long run; the newest clean one is evidence enough). */
function newestCached(kind, name, ok = () => true) {
    const base = join(tmpdir(), kind);
    if(!existsSync(base)) return null;
    const hits = readdirSync(base).map(d => join(base, d, name)).filter(f => existsSync(f) && ok(f)).map(f => ({f, t: statSync(f).mtimeMs})).sort((a, b) => b.t - a.t);
    return hits[0]?.f ?? null;
}
const complete = file => {try {if(!existsSync(file)) return false; const last = readFileSync(file, 'utf8').trimEnd().split('\n').at(-1); return last.includes('"type":"end"') && !last.includes('"reason":"error"');} catch {return false;}};

/** The scene capture for a start, cached under the OS temp folder by bundle key. */
export async function sceneFor(id, {refresh = false} = {}) {
    const key = await bundleKey();
    const file = join(cacheDir('yairpg-openings', key), `${id}.scene.json`);
    const cached = refresh ? null : newestCached('yairpg-openings', `${id}.scene.json`);
    if(cached) return JSON.parse(readFileSync(cached, 'utf8'));
    const scene = await captureScene(id);
    writeFileSync(file, JSON.stringify(scene));
    return scene;
}

/** The pacing check's cached trace when its parameters match; otherwise record it (waiting for a live recorder of the same start). */
export async function traceFor(id, {params = PARAMS, refresh = false} = {}) {
    const key = await bundleKey(true);
    const file = join(cacheDir('yairpg-traces', key), `${id}.s${params.seed}.m${params.minutes}.a${params.actions}.d${params.dt}.jsonl`);
    const name = `${id}.s${params.seed}.m${params.minutes}.a${params.actions}.d${params.dt}.jsonl`;
    const reuse = refresh ? null : newestCached('yairpg-traces', name, complete);
    if(reuse) return {file: reuse, records: parseJsonl(readFileSync(reuse, 'utf8'))};
    if(!refresh) {
        for(let waited = 0; liveRecorder(id) && !complete(file) && !newestCached('yairpg-traces', name, complete) && waited < 25 * 60; waited += 10) await new Promise(r => setTimeout(r, 10000));
        const late = newestCached('yairpg-traces', name, complete);
        if(late) return {file: late, records: parseJsonl(readFileSync(late, 'utf8'))};
    }
    // An errored cached trace is PAC's to re-record: read it as pending rather than replay it here.
    if(refresh || !existsSync(file)) {
        const r = spawnSync(process.execPath, [join(root, 'scripts/headless/trace.mjs'), '--start', id, '--seed', String(params.seed), '--minutes', String(params.minutes), '--actions', String(params.actions), '--dt', String(params.dt), '--out', file],
            {encoding: 'utf8', timeout: 25 * 60 * 1000, maxBuffer: 1 << 26});
        if(!existsSync(file)) throw new Error(`trace for ${id} not written: ${(r.stderr || '').slice(0, 300)}`);
    }
    return {file, records: parseJsonl(readFileSync(file, 'utf8'))};
}

// ---------------------------------------------------------------------------------------------
// Backlog

export const START_ORDER = ['village', 'lotm.probationer', 'lotm.machinery', 'lotm.storm', 'lotm.civil', 'lotm.beside',
    'book.hp.school', 'book.hp.trade', 'book.hp.lead', 'book.ss.apprentice', 'book.ss.trial', 'book.ss.company', 'book.ri.academy', 'book.ri.keeper', 'soldier.p01'];
const rankOf = id => {const i = START_ORDER.indexOf(id); return i < 0 ? 99 : i;};
const WEIGHT = {'no-action': 100, 'stale-pointer': 60, 'engine-reason': 55, 'refusal-no-reason': 50, 'trace-refusal-no-reason': 8, 'prose-wall': 40, 'long-block': 35, 'unexplained-term': 30, 'same-label': 30, 'foreign-place': 45,
    'first-action-late': 10, 'first-payoff-late': 10, 'no-effect-choice': 10, 'dead-stretch': 10};
const FIX = {
    'no-action': 'Put at least one enabled action on the first screen, or say what the scene waits for (OPN1).',
    'stale-pointer': 'Clear or recompute the "Next step" pointer at entry so it names something on this screen (OPN8).',
    'foreign-place': 'Reasons name the current world\'s places, not the Village (OPN8).',
    'prose-wall': 'Fold rules and bookkeeping into a "Details" disclosure and keep the opening to what the character sees and can do now (OPN2, PRS3).',
    'long-block': 'Split the longest block; lead with the choice it supports (OPN2).',
    'unexplained-term': 'Introduce the term in a line above the controls, or use the word the screen already uses (OPN3, UR75).',
    'same-label': 'Name the difference in each label (the destination, the person, the task) (OPN3).',
    'refusal-no-reason': 'Give each disabled action one reason in player words, or hide it (OPN4, UR73).',
    'trace-refusal-no-reason': 'Check each listed control for a visible reason; add one where missing (OPN4).',
    'engine-reason': 'Hide engine fallback text; write the missing thing instead (OPN4, UR73, UR82).',
    'first-action-late': 'Make the first real action reachable and visibly rewarded in the first few presses (OPN5; the curious bot is a lower bound).',
    'first-payoff-late': 'Give the first payoff inside the opening window (OPN5; see the PAC lane for minutes).',
    'no-effect-choice': 'A scene choice should change a number, a line or the clock the player can see, or be a link (OPN6).',
    'dead-stretch': 'When nothing visible changes for a stretch, the scene should say what it is waiting for (OPN7).',
};

export function backlogText(results, cmp) {
    const ordered = [...results].filter(r => r.status !== 'skipped').sort((a, b) => rankOf(a.start) - rankOf(b.start));
    const L = [];
    L.push('# Openings backlog', '');
    L.push('Generated by `node scripts/check_openings.mjs --backlog` (2026-11-06). Do not edit by hand; edit the generator.');
    L.push('Rules: [OPENING_RULES](../OPENING_RULES.md), proposed (AD32). Evidence is SHOWN from a deterministic headless run: the first screen is read after');
    L.push(`entry, then the first ${DIALS.window.steps} presses of the shared curious-player trace (scripts/headless/trace.mjs, seed ${PARAMS.seed}, ${PARAMS.dt} game minutes per press).`);
    L.push('The bot presses what it has not pressed, in its own order, so flags on trace measures are marked policy-limited and never lead the ranking.');
    L.push('Quoted strings are engine-speak or control labels only; scene prose is counted, not quoted (sealed-secret practice).', '');
    L.push('## Ranked items (what a new player meets first)', '');
    const items = [];
    for(const r of ordered) for(const f of r.flags) items.push({start: r.start, ...f, score: (WEIGHT[f.code] || 5) - rankOf(r.start) * 0.5 + (f.policyLimited ? -50 : 0)});
    items.sort((a, b) => b.score - a.score);
    L.push('| Rank | Start | Flag | Detail | Default fix |', '| --- | --- | --- | --- | --- |');
    items.slice(0, 40).forEach((it, i) => L.push(`| ${i + 1} | ${it.start} | ${it.code}${it.policyLimited ? ' (policy-limited)' : ''} | ${it.detail.replace(/\|/g, '/')} | ${FIX[it.code]} |`));
    L.push('', `Total: ${items.length} flags across ${ordered.length} starts; ${cmp.regressions.length} regressions against the baseline.`, '');
    L.push('## First ten minutes, per start', '');
    for(const r of ordered) {
        L.push(`### ${r.start}`, '');
        if(r.tracePending) L.push('- **Pending**: first-press measures wait for a clean trace (re-run after the PAC lane re-records it).');
        for(const line of r.walk) L.push(`- ${line}`);
        L.push(r.flags.length ? `- Flags: ${r.flags.map(f => `${f.code} (${f.value})`).join(', ')}.` : '- Flags: none.', '');
    }
    return L.join('\n');
}

// ---------------------------------------------------------------------------------------------
// CLI

async function listIds() {
    const {listStarts} = await import('./headless/trace.mjs');
    return (await listStarts()).map(s => s.id);
}

async function runStart(id, {refresh}) {
    let scene = null, records = [];
    try {scene = await sceneFor(id, {refresh});} catch(e) {if(e.skip) return {start: id, status: 'skipped', flags: [], measures: {}, walk: []}; return {start: id, status: 'error', flags: [], measures: {}, walk: [], notes: [e.message]};}
    try {records = (await traceFor(id, {refresh})).records;} catch(e) {process.stderr.write(`${id}: no trace (${e.message.slice(0, 80)})\n`);}
    const meta = records.find(r => r.type === 'meta') || {location: scene.location, world: scene.world};
    const endRec = records.find(r => r.type === 'end');
    const pending = !endRec || endRec.reason === 'error';   // errored or missing trace: first-press measures are pending, not zero
    const res = analyzeOpening({start: id, scene, steps: pending ? [] : records.filter(r => r.type === 'step'), meta: {location: scene.location ?? meta.location, world: scene.world ?? meta.world}});
    if(pending) {res.tracePending = true; res.walk.push('Trace pending: the recorded trace errored or is missing, so first-press measures are not read for this start.');}
    return res;
}

async function main() {
    const argv = process.argv.slice(2), has = f => argv.includes(f), val1 = f => argv[argv.indexOf(f) + 1];
    const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) : {starts: {}};
    const skip = has('--skip') ? val1('--skip').split(',') : [];   // e.g. a private pack whose recorder is stuck
    const ids = (has('--start') ? [val1('--start')] : (await listIds()).sort((a, b) => rankOf(a) - rankOf(b))).filter(id => !skip.includes(id));
    const results = [];
    const lastDir = join(tmpdir(), 'yairpg-openings', 'last'); mkdirSync(lastDir, {recursive: true});
    for(const id of ids) {
        let r;
        const saved = join(lastDir, `${id}.json`);
        if(has('--emit')) {r = await runStart(id, {refresh: has('--refresh')}); process.stdout.write(JSON.stringify(r)); process.exit(0);}
        if(has('--resume') && existsSync(saved)) r = JSON.parse(readFileSync(saved, 'utf8'));
        else {
            // One game per process: many boots in one Node process ran out of memory, so each start runs in a child.
            const c = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--start', id, '--emit', ...(has('--refresh') ? ['--refresh'] : [])], {encoding: 'utf8', maxBuffer: 1 << 28, timeout: 60 * 60 * 1000});
            try {r = JSON.parse(c.stdout);} catch {r = {start: id, status: 'error', flags: [], measures: {}, walk: [], notes: [(c.stderr || 'child failed').slice(0, 200)]};}
            if(r.status !== 'error') writeFileSync(saved, JSON.stringify(r));
        }
        results.push(r);
        process.stderr.write(`${id}: ${r.status}${r.tracePending ? ' (trace pending)' : ''}${r.flags?.length ? ` ${r.flags.map(f => `${f.code}=${f.value}`).join(' ')}` : ''}\n`);
    }
    if(has('--update-baseline')) {
        if(has('--start')) {console.error('--update-baseline needs every start (omit --start).'); process.exit(2);}
        writeFileSync(BASELINE_PATH, JSON.stringify(buildBaseline(results), null, 2) + '\n');
        console.log(`openings baseline written for ${results.length} starts.`);
    }
    const cmp = compareToBaseline(results, has('--update-baseline') ? buildBaseline(results) : baseline);
    if(has('--backlog')) {mkdirSync(dirname(BACKLOG_PATH), {recursive: true}); writeFileSync(BACKLOG_PATH, backlogText(results, cmp)); console.log(`wrote ${BACKLOG_PATH}`);}
    for(const t of cmp.tighten) console.log(`tighten  ${t.start} ${t.code}: ${t.value ?? 'gone'} (baseline ${t.was}) ${t.note}`);
    for(const m of cmp.misses) console.log(`miss     ${m.start} ${m.code}: ${m.value}`);
    for(const g of cmp.regressions) console.log(`REGRESSION ${g.start} ${g.code}: ${g.value ?? ''} ${g.note}${g.was != null ? ` (baseline ${g.was})` : ''}`);
    console.log(`openings: ${results.filter(r => r.status === 'ok').length} starts read, ${cmp.misses.length} recorded or new flags, ${cmp.regressions.length} regressions.`);
    process.exit(cmp.ok ? 0 : 1);
}

if(process.argv[1] === fileURLToPath(import.meta.url)) await main();
