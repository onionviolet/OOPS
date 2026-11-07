#!/usr/bin/env node
// Pacing check (PAC1-PAC8, docs/PACING_RULES.md). Plays each start with the shared trace
// recorder (scripts/headless/trace.mjs), measures how soon and how often the game pays off,
// and ratchets the result against scripts/pacing_baseline.json.
//
// The full run is a PERIODIC check, not a per-edit one: the trace cache key hashes the whole game bundle
// (all of src/), so any src edit by any session re-records every start (about 44 minutes cold under load).
// After a fix, re-measure only the starts it touches with --only; the cache key is not weakened.
//
// NOT part of check:rules: it boots and plays the game (about a minute or two per start).
//
//   node scripts/check_pacing.mjs                       check every start (records traces that are missing)
//   node scripts/check_pacing.mjs --start village       one start
//   node scripts/check_pacing.mjs --only village,soldier.p01   several starts (re-measure what a fix touched)
//   node scripts/check_pacing.mjs --jobs 3             parallel recordings (default 3)
//   node scripts/check_pacing.mjs --policy unseen-first   the old browse-first policy (default is the work policy)
//   node scripts/check_pacing.mjs --refresh             re-record even when a cached trace exists
//   node scripts/check_pacing.mjs --update-baseline     accept today's numbers (after a real pacing change)
//   node scripts/check_pacing.mjs --backlog             write docs/pacing/PACING_BACKLOG.md
//
// Ratchet (as PRS5): a start that already misses a target is recorded in the baseline with its
// value; it passes while it is no worse than that value plus a tolerance (the trace is
// deterministic, but unrelated source edits shift a step or two). A new miss, or a worse value
// than the baseline, fails. Improving a recorded miss prints "tighten" and the baseline can be
// updated so the gain cannot be lost.
//
// Measures, in game minutes since the first step (`t`):
//   firstPayoffMin       first step with money up, an item gained, a skill level, or a new unlock id
//   firstActedPayoffMin  the same, but only on a click or repeat step (not a wait or a panel glance)
//   longestPayoffGapMin  longest stretch with no payoff, counting from the start to the first
//                        payoff and from the last payoff to the end of the trace
//   longestDeadMin       longest stretch with no meaningful save change, no novel text and no
//                        new Reports line (passive skill ticks do not count as change)
//   payoffCount, unlockGapMedianMin, unlockGapMaxMin
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const BASELINE_PATH = resolve(root, 'scripts/pacing_baseline.json');
const BACKLOG_PATH = resolve(root, 'docs/pacing/PACING_BACKLOG.md');

/** Recording parameters. Part of the baseline: changing them means a new baseline. */
export const PARAMS = Object.freeze({seed: 1, minutes: 960, actions: 100, dt: 10});
/** The pacing check plays the work policy. PARAMS stays policy-free: the feedback check imports it and its default-policy traces and baseline must stay valid. */
export const PACING_PARAMS = Object.freeze({...PARAMS, policy: 'work'});
/** Per-start trace length under the work policy (default, dial, reason). Default: PACING_PARAMS.minutes (960). Dial: a start whose
 *  world closes for the night is traced over its open day. Reason: the Village closes paid work at 20:00 and the hero sleeps, so
 *  the night is a world rhythm (PAC7: the screen says work is closed), not a stall; counting it would fail every Village run. */
export const START_MINUTES = Object.freeze({village: 720});

// Save buckets that tick without play (passive skill practice, local-life bookkeeping).
export const PASSIVE_BUCKETS = new Set(['levels', 'skillRecords', 'absorb_local_life']);

// Targets: default, dial, reason (PAC3). Game minutes. null = no target written for that measure.
// Default row first; a start overrides only the numbers it names.
export const DEFAULT_TARGET = Object.freeze({firstPayoffMin: 30, firstActedPayoffMin: 60, longestPayoffGapMin: 240, longestDeadMin: 90});
export const TARGETS = Object.freeze({
    'village': {firstActedPayoffMin: 30, longestPayoffGapMin: 120, longestDeadMin: 60,
        reason: 'the default opening teaches the loop; a first acted payoff inside three actions and no stretch of two hours without a gain'},
    'book.hp.school': {firstPayoffMin: 60, longestPayoffGapMin: 360, reason: 'a school term is lesson-shaped; a day of classes is a long, planned gap'},
    'book.hp.trade': {firstPayoffMin: 60, longestPayoffGapMin: 300, reason: 'a trade life pays on orders and deliveries, not minutes'},
    'book.hp.lead': {firstPayoffMin: 60, longestPayoffGapMin: 420, reason: 'a child under guardians waits on the household day (chores run two hours, errands are asked, not chosen)'},
    'book.ss.apprentice': {firstPayoffMin: 60, longestPayoffGapMin: 300, reason: 'study then bind: the first payoff is the first fitted piece'},
    'book.ss.trial': {firstPayoffMin: 60, longestPayoffGapMin: 360, reason: 'a trial is prepared, crossed, settled'},
    'book.ss.company': {firstPayoffMin: 60, longestPayoffGapMin: 360, reason: 'recovery and sleep are the pacing; patrol is the payoff'},
    'book.ri.academy': {firstPayoffMin: 90, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'cultivation is slow by canon; refining and daily care take hours'},
    'book.ri.keeper': {firstPayoffMin: 90, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'feeding schedules set the rhythm; a weekly stipend is a slow clock'},
    'lotm.probationer': {firstPayoffMin: 60, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'a supervised probation runs in shifts and appointments'},
    'lotm.machinery': {firstPayoffMin: 60, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'same probation shape, workshop-led'},
    'lotm.storm': {firstPayoffMin: 60, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'same probation shape, patrol-led'},
    'lotm.civil': {firstPayoffMin: 60, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'desk work with appointments'},
    'lotm.beside': {firstPayoffMin: 420, firstActedPayoffMin: 420, longestPayoffGapMin: 480, longestDeadMin: 180, reason: 'living beside the lead follows the book calendar: the life opens at night with the household out, the screen names who is away and when they are back (PAC4), and the first meeting waits for dawn (359 minutes)'},
    'soldier.p01': {firstPayoffMin: 60, longestPayoffGapMin: 360, reason: 'a short visit: something should land in the first hour'},
});
export const targetFor = id => ({...DEFAULT_TARGET, ...(TARGETS[id] || {})});
const MEASURES = ['firstPayoffMin', 'firstActedPayoffMin', 'longestPayoffGapMin', 'longestDeadMin'];

// Practice every life does by existing (Breathing, Patience) and the Skills panel it reveals are the clock, not play.
export const PASSIVE_SKILLS = new Set(['Breathing', 'Patience']);
export const PASSIVE_UNLOCKS = new Set(['panel:skills']);
const gainedSkill = s => (s.skills || []).some(x => x.levelDelta > 0 && !PASSIVE_SKILLS.has(x.id));
const newUnlock = s => (s.unlocks || []).some(u => !PASSIVE_UNLOCKS.has(u));
const isPayoff = s => s._progressUp || (s.money?.delta ?? 0) > 0 || (s.items || []).some(x => x.delta > 0) || gainedSkill(s) || newUnlock(s);
const meaningfulChange = s => Object.entries(s.changed?.buckets || {}).some(([k, n]) => !PASSIVE_BUCKETS.has(k) && n > 0);
const alive = s => isPayoff(s) || s._progressLive || meaningfulChange(s) || (s.text?.novel ?? 0) > 0 || (s.reports || []).length > 0;
const median = a => {if(!a.length) return null; const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)];};

/** Pure: records (parsed trace lines) -> measures. No game, no files. */
export function analyzeTrace(records) {
    const meta = records.find(r => r.type === 'meta') || {};
    // A book life keeps its stock and jobs in its own records: a rise in settled completions or its event log is a payoff (PAC1, dial: world payoff kinds).
    let pg = meta.progress0 || null;
    // PAC2 counts from the first press; the recorder's own 1-minute init tick before it is not play.
    const first = records.find(r => r.type === 'step');
    const t0 = first ? Math.max(0, (first.t ?? 0) - (first.advanced ?? 0)) : 0;
    const steps = records.filter(r => r.type === 'step').map(r => ({...r, t: r.t - t0})).map(s => {
        const up = !!(pg && s.progress && (s.progress.settled > pg.settled || (s.progress.gains ?? 0) > (pg.gains ?? 0) || (s.progress.packs ?? 0) > (pg.packs ?? 0)));
        // The event log and running jobs show a life is moving (liveness for the dead-stretch measure), but a refused or failed command is not a gain.
        const live = !!(pg && s.progress && (s.progress.simLog > pg.simLog || s.progress.jobs !== pg.jobs));
        if(s.progress) pg = s.progress;
        return up || live ? {...s, ...(up ? {_progressUp: true} : {}), ...(live ? {_progressLive: true} : {})} : s;
    });
    const end = records.find(r => r.type === 'end') || {};
    const out = {start: meta.start ?? null, status: meta.skipped ? 'skipped' : end.reason === 'error' ? 'error' : 'ok', endReason: end.reason ?? null,
        actions: steps.length, traceMinutes: steps.length ? steps.at(-1).t : 0,
        firstPayoffMin: null, firstPayoffKind: null, firstActedPayoffMin: null, longestPayoffGapMin: null, longestDeadMin: null,
        payoffCount: 0, unlockGapMedianMin: null, unlockGapMaxMin: null, firstMoneyMin: null, notes: []};
    if(out.status !== 'ok' || !steps.length) return out;
    const kind = s => s._progressUp ? 'progress' : newUnlock(s) ? 'unlock' : gainedSkill(s) ? 'skill' : (s.items || []).some(x => x.delta > 0) ? 'item' : 'money';
    const payoffAt = [], unlockAt = [];
    let prevT = 0, dead = 0, longestDead = 0;
    for(const s of steps) {
        const stepStart = prevT, stepEnd = s.t; prevT = s.t;
        if(isPayoff(s)) {
            payoffAt.push(stepEnd);
            if(out.firstPayoffMin == null) {out.firstPayoffMin = stepEnd; out.firstPayoffKind = kind(s);}
            if(out.firstActedPayoffMin == null && ['click', 'repeat'].includes(s.action?.kind)) out.firstActedPayoffMin = stepEnd;
            if(newUnlock(s)) unlockAt.push(stepEnd);
            if(out.firstMoneyMin == null && (s.money?.delta ?? 0) > 0) out.firstMoneyMin = stepEnd;
        }
        if(alive(s)) dead = 0; else {dead += stepEnd - stepStart; longestDead = Math.max(longestDead, dead);}
    }
    out.payoffCount = payoffAt.length;
    out.longestDeadMin = longestDead;
    const marks = [0, ...payoffAt, out.traceMinutes];
    out.longestPayoffGapMin = Math.max(...marks.slice(1).map((m, i) => m - marks[i]));
    const gaps = unlockAt.slice(1).map((m, i) => m - unlockAt[i]);
    out.unlockGapMedianMin = median(gaps); out.unlockGapMaxMin = gaps.length ? Math.max(...gaps) : null;
    if(out.endReason === 'blocked') out.notes.push('trace ended blocked (clock stopped)');
    return out;
}

/** Worse = a bigger number; null on a first-payoff style measure means "never within the trace". */
const NEVER = Infinity;
const val = (v, r) => v == null ? (r.traceMinutes ? r.traceMinutes + 1 : NEVER) : v;
export const TOLERANCE = Object.freeze({minutes: 30, ratio: 0.25});
const slack = base => Math.max(TOLERANCE.minutes, Math.round(base * TOLERANCE.ratio));

/**
 * Pure: results (analyzeTrace outputs) vs a baseline object -> {regressions, misses, tighten, ok}.
 * A measure that meets its target needs no baseline entry; one that misses must be recorded.
 */
export function compareToBaseline(results, baseline = {starts: {}}) {
    const regressions = [], misses = [], tighten = [];
    for(const r of results) {
        const base = baseline.starts?.[r.start];
        if(r.status === 'skipped') continue;
        if(r.status === 'error') {if(base?.status !== 'error') regressions.push({start: r.start, measure: 'status', note: 'trace failed to record'}); continue;}
        const target = targetFor(r.start);
        for(const m of MEASURES) {
            const t = target[m]; if(t == null) continue;
            const v = val(r[m], r), missed = v > t;
            const recorded = base?.misses?.[m];
            if(!missed) {if(recorded != null) tighten.push({start: r.start, measure: m, value: r[m], was: recorded, note: 'now meets target; retire the baseline entry'}); continue;}
            misses.push({start: r.start, measure: m, value: r[m], target: t});
            if(recorded == null) {regressions.push({start: r.start, measure: m, value: r[m], target: t, note: 'new miss'}); continue;}
            if(v > recorded + slack(recorded)) regressions.push({start: r.start, measure: m, value: r[m], was: recorded, note: 'worse than baseline'});
            else if(v < recorded - slack(recorded)) tighten.push({start: r.start, measure: m, value: r[m], was: recorded, note: 'better than baseline; update it'});
        }
    }
    return {regressions, misses, tighten, ok: regressions.length === 0};
}

/** Pure: the baseline object that records today's misses. */
export function buildBaseline(results, params = PACING_PARAMS) {
    const starts = {};
    for(const r of results) {
        if(r.status === 'skipped') continue;
        if(r.status === 'error') {starts[r.start] = {status: 'error', misses: {}}; continue;}
        const misses = {}, target = targetFor(r.start);
        for(const m of MEASURES) {const t = target[m]; if(t != null && val(r[m], r) > t) misses[m] = val(r[m], r);}
        starts[r.start] = {status: 'ok', measured: Object.fromEntries(MEASURES.concat(['payoffCount']).map(m => [m, r[m]])), misses};
    }
    return {schema: 1, note: 'Pacing ratchet (PAC5). Today\'s misses; values are game minutes. Regenerate with check_pacing.mjs --update-baseline.', params, tolerance: TOLERANCE, starts};
}

export const parseJsonl = text => text.split('\n').filter(Boolean).map(l => JSON.parse(l));

function traceFile(id, params, bundleKey) {
    const dir = join(tmpdir(), 'yairpg-traces', bundleKey);
    mkdirSync(dir, {recursive: true});
    return join(dir, `${id}.s${params.seed}.m${params.minutes}.a${params.actions}.d${params.dt}${params.policy && params.policy !== 'unseen-first' ? '.p' + params.policy : ''}.jsonl`);
}

/** Record (or reuse) the trace for a start. Runs the recorder in its own process. */
export async function traceFor(id, {params: given = PARAMS, refresh = false} = {}) {
    const params = given.policy === 'work' && START_MINUTES[id] ? {...given, minutes: START_MINUTES[id]} : given;
    const {bundleGame} = await import('./headless/runner.mjs');
    const recorder = createHash('sha256').update(readFileSync(join(root, 'scripts/headless/trace.mjs'))).digest('hex').slice(0, 8);
    const key = (await bundleGame()).replace(/^.*game-/, '').replace(/\.mjs$/, '') + '-' + recorder;
    const file = traceFile(id, params, key);
    if(refresh || !existsSync(file)) {
        const args = [join(root, 'scripts/headless/trace.mjs'), '--start', id, '--seed', String(params.seed), '--minutes', String(params.minutes), '--actions', String(params.actions), '--dt', String(params.dt), '--policy', params.policy || 'unseen-first', '--out', file];
        const stderr = await new Promise(res => {
            let err = ''; const c = spawn(process.execPath, args, {stdio: ['ignore', 'ignore', 'pipe']});
            c.stderr.on('data', d => {err += d;}); const t = setTimeout(() => c.kill(), 30 * 60 * 1000);
            c.on('close', () => {clearTimeout(t); res(err);});
        });
        if(!existsSync(file)) throw new Error(`trace for ${id} not written: ${stderr.slice(0, 300)}`);
    }
    return {file, records: parseJsonl(readFileSync(file, 'utf8'))};
}

async function listIds() {
    const {listStarts} = await import('./headless/trace.mjs');
    return (await listStarts()).map(s => s.id);
}

const fmt = v => v == null ? 'never' : String(Math.round(v));

function backlogText(results, cmp) {
    const rank = m => ({firstPayoffMin: 0, firstActedPayoffMin: 1, longestPayoffGapMin: 2, longestDeadMin: 3})[m];
    const rows = [...cmp.misses].sort((a, b) => rank(a.measure) - rank(b.measure) || a.start.localeCompare(b.start));
    const L = [];
    L.push('# Pacing backlog', '');
    L.push('Generated by `node scripts/check_pacing.mjs --backlog` (2026-11-07). Do not edit by hand below the line; edit the generator.');
    L.push('Rules: [PACING_RULES](../PACING_RULES.md). Targets are proposals (AD32); numbers are game minutes from a deterministic', 'curious-player trace (scripts/headless/trace.mjs). A miss is a start where the trace waited longer than the proposed target.', '');
    L.push(`Recording: policy ${PACING_PARAMS.policy}, seed ${PARAMS.seed}, ${PARAMS.actions} actions, at most ${PARAMS.minutes} game minutes, ${PARAMS.dt} game minutes per action.`, '');
    L.push('## Measured', '', '| Start | Actions | Trace min | First payoff | First acted payoff | Longest gap | Longest dead | Payoffs |', '|---|---|---|---|---|---|---|---|');
    for(const r of results) {
        if(r.status !== 'ok') {L.push(`| ${r.start} | ${r.status} | | | | | | |`); continue;}
        L.push(`| ${r.start} | ${r.actions} | ${fmt(r.traceMinutes)} | ${fmt(r.firstPayoffMin)} | ${fmt(r.firstActedPayoffMin)} | ${fmt(r.longestPayoffGapMin)} | ${fmt(r.longestDeadMin)} | ${r.payoffCount} |`);
    }
    L.push('', '## Misses, ranked (what a player meets first, then longest waits)', '', '| # | Start | Measure | Now | Target | Why the target |', '|---|---|---|---|---|---|');
    rows.forEach((m, i) => L.push(`| ${i + 1} | ${m.start} | ${m.measure} | ${fmt(m.value)} | ${m.target} | ${TARGETS[m.start]?.reason ?? 'default target (PAC3)'} |`));
    if(!rows.length) L.push('| | none | | | | |');
    L.push('', '## Policy limits (read before acting on a row)', '',
        '- The trace plays the "work" policy: it presses a start\'s own paid or main work first (a Village job run for one paid round then stopped, a book life\'s actions, Tingen tasks, a pack duty), and browses only when nothing else is open. It does not know the game beyond that. Check the trace before changing the game.',
        '- A payoff is money up, an item gained, a skill level, a new unlock id, or a gain a life keeps in its own records (settled actions, knowledge, powers, a pack purse). A refused command or a log line is liveness, not a payoff.',
        '- The Village is traced over its open day (720 minutes); paid work closes at 20:00 and the screen says so.',
        '- Away time is out of scope: the trace is attended play, `dt` game minutes per press. PAC6 owns idle and away pacing as a separate proposal.',
        '- The full run is periodic (about 44 minutes cold); re-measure touched starts with `--only <start,...>`.');
    return L.join('\n') + '\n';
}

async function main() {
    const argv = process.argv.slice(2), has = f => argv.includes(f), val1 = f => argv[argv.indexOf(f) + 1];
    const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) : {starts: {}};
    const params = {...PACING_PARAMS};
    for(const k of ['seed', 'minutes', 'actions', 'dt']) if(has('--' + k)) params[k] = +val1('--' + k);
    if(has('--policy')) params.policy = val1('--policy');
    const only = has('--only') ? val1('--only').split(',').map(x => x.trim()).filter(Boolean) : has('--start') ? [val1('--start')] : null;
    const ids = only ?? await listIds();
    const jobs = Math.max(1, +(has('--jobs') ? val1('--jobs') : 3)), results = new Array(ids.length);
    let next = 0;
    const worker = async () => {
        while(next < ids.length) {
            const at = next++, id = ids[at];
            try {
                const {records} = await traceFor(id, {params, refresh: has('--refresh')});
                results[at] = analyzeTrace(records);
            } catch(e) {results[at] = {start: id, status: 'error', notes: [e.message]};}
            const r = results[at];
            process.stderr.write(`${id}: ${r.status}${r.status === 'ok' ? ` first ${fmt(r.firstPayoffMin)} gap ${fmt(r.longestPayoffGapMin)} dead ${fmt(r.longestDeadMin)}` : ''}\n`);
        }
    };
    await Promise.all(Array.from({length: jobs}, worker));
    const sameParams = JSON.stringify(baseline.params ?? PACING_PARAMS) === JSON.stringify(params);
    if(has('--update-baseline')) {
        if(only) {console.error('--update-baseline needs every start (omit --start/--only).'); process.exit(2);}
        writeFileSync(BASELINE_PATH, JSON.stringify(buildBaseline(results, params), null, 2) + '\n');
        console.log(`pacing baseline written for ${results.length} starts.`);
    }
    const cmp = compareToBaseline(results, has('--update-baseline') ? buildBaseline(results, params) : baseline);
    if(has('--backlog')) {mkdirSync(dirname(BACKLOG_PATH), {recursive: true}); writeFileSync(BACKLOG_PATH, backlogText(results, cmp)); console.log(`wrote ${BACKLOG_PATH}`);}
    for(const t of cmp.tighten) console.log(`tighten  ${t.start} ${t.measure}: ${fmt(t.value)} (baseline ${fmt(t.was)}) ${t.note}`);
    for(const m of cmp.misses) console.log(`miss     ${m.start} ${m.measure}: ${fmt(m.value)} > ${m.target}`);
    for(const g of cmp.regressions) console.log(`REGRESSION ${g.start} ${g.measure}: ${g.value != null ? fmt(g.value) : ''} ${g.note}${g.was != null ? ` (baseline ${fmt(g.was)})` : ''}`);
    if(!sameParams) console.log('note: recording parameters differ from the baseline; numbers are not comparable.');
    console.log(`pacing: ${results.filter(r => r.status === 'ok').length} starts measured, ${cmp.misses.length} recorded or new misses, ${cmp.regressions.length} regressions.`);
    process.exit(cmp.ok ? 0 : 1);
}

if(process.argv[1] === fileURLToPath(import.meta.url)) await main();
