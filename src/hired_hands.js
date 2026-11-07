// OB7/OB12, delegation ladder rung L1: a hired hand runs one standing job on the clock for a weekly wage. World-neutral (AR3/AR4):
// a world registers a job (registerHandJob) that knows its own plot, tool and stock; this file owns the hire record, the wage and the report.
// Slice `hired_hands@1` (SAVES note in the lane return): {hires: {jobId: record}, reports: [{at, text}]}. An untouched life writes no key.
//   record  {hand, name, wage, crop, pace, since, workedTo, paidThrough, cycleAt, status: active|ended, endedAt, endReason, cycles, yielded}
// Time rules (OB4, ACR6/7):
//  - the wage is paid a week ahead, at hire and at each week boundary; work runs on the clock between boundaries, never per minute of play;
//  - if the purse cannot cover the next week the arrangement ends AT that boundary with a line: nothing is owed, no debt row, no work after it;
//  - the hand reports through a Reports line (one per settle pass), not as instant knowledge.
import {registerDomain} from './domain_registry.js';
export const HIRED_HANDS_FAMILY = 'hired_hands@1';
export const WEEK = 7 * 1440; // minutes. Dial: weekly wage; a week is the trade's natural pay period in a village.
const REPORT_CAP = 8, PASS_CAP = 600;
const nat = n => Number.isInteger(n) && n >= 0;
const jobs = new Map();
let slice = fresh();
let ports = null;
function fresh() { return {family: HIRED_HANDS_FAMILY, hires: {}, reports: []}; }
// job = {label, available(plan) -> '' | reason, candidates(plan) -> [{id, name, wage, pace, crops?, line}], contact(plan, hand) -> '' | reason,
//        busy(plan) -> '' | reason, hire(plan, rec), release(plan, rec), work(plan, rec, from, to, tally) -> void, report(rec, tally, span) -> text|null,
//        income(rec) -> {amount, unit, text}}
export function registerHandJob(id, job) {
    if (typeof id !== 'string' || !id || !job || ['available', 'candidates', 'work', 'hire', 'release'].some(k => typeof job[k] !== 'function')) throw Error('Invalid hand job.');
    jobs.set(id, Object.freeze({...job}));
}
// ports = {plan(0) -> {state, external, gameplay}, commit(plan), writable?(), blocked?(), logMessage?(text, kind)}
export function configureHiredHands(p) { ports = p; }
export function migrateHiredHands(s) {
    if (!s || s.family !== HIRED_HANDS_FAMILY) return fresh();
    const hires = {};
    for (const [id, r] of Object.entries(s.hires && typeof s.hires === 'object' ? s.hires : {})) {
        if (!id || !r || typeof r.hand !== 'string' || !nat(r.wage) || !nat(r.since) || !nat(r.workedTo) || !nat(r.paidThrough)) continue; // unreadable record: dropped
        hires[id] = {hand: r.hand, name: String(r.name || r.hand), wage: r.wage, crop: String(r.crop || ''), pace: Number.isFinite(r.pace) && r.pace > 0 ? r.pace : 1,
            since: r.since, workedTo: r.workedTo, paidThrough: r.paidThrough, cycleAt: nat(r.cycleAt) ? r.cycleAt : null,
            status: r.status === 'ended' ? 'ended' : 'active', endedAt: nat(r.endedAt) ? r.endedAt : null, endReason: typeof r.endReason === 'string' ? r.endReason : null,
            earned: nat(r.earned) ? r.earned : 0, cycles: nat(r.cycles) ? r.cycles : 0, yielded: nat(r.yielded) ? r.yielded : 0};
    }
    const reports = (Array.isArray(s.reports) ? s.reports : []).filter(x => x && nat(x.at) && typeof x.text === 'string' && x.text).slice(-REPORT_CAP).map(x => ({at: x.at, text: x.text}));
    return {family: HIRED_HANDS_FAMILY, hires, reports};
}
const isEmpty = s => !Object.keys(s.hires).length && !s.reports.length;
const say = (at, text) => { slice = {...slice, reports: [...slice.reports, {at, text}].slice(-REPORT_CAP)}; };
const span = minutes => minutes < 1440 ? 'the day' : minutes < 2 * WEEK ? `${Math.round(minutes / 1440)} days` : `${Math.round(minutes / WEEK)} weeks`;
const coinWord = n => `${n} coin${n === 1 ? '' : 's'}`;

// Pay one week from the player's purse; the hand's earnings are tallied on the record. Throws when the purse cannot cover it.
function payWeek(plan, rec) {
    const money = plan.external?.money;
    if (!Number.isFinite(money) || money < rec.wage) throw Error('The purse cannot cover the wage.');
    // The coins leave the purse and are recorded as earned by the hand in the hire record. The villager's resident cash stays on its authored
    // transactions (management/validation.js checks it exactly), so a hand's wages are not added to it.
    plan.external.money = money - rec.wage;
    rec.earned = (rec.earned || 0) + rec.wage;
}
function endHire(plan, job, rec, at, reason) {
    rec.status = 'ended'; rec.endedAt = at; rec.endReason = reason;
    job.release?.(plan, rec);
}
// Settle one active record up to `now`: work to each week boundary, then pay the next week or end there. Mutates the plan and the record.
function settleRec(plan, job, id, rec, now) {
    const tally = {cycles: 0, yielded: 0, noSeed: false, paid: 0, ended: null}, from = rec.workedTo;
    let guard = 0;
    while (rec.status === 'active' && rec.paidThrough <= now && guard++ < PASS_CAP) {
        const b = rec.paidThrough;
        job.work(plan, rec, rec.workedTo, b, tally); rec.workedTo = b;
        try { payWeek(plan, rec); rec.paidThrough = b + WEEK; tally.paid += rec.wage; }
        catch { endHire(plan, job, rec, b, 'unpaid'); tally.ended = 'unpaid'; }
    }
    if (rec.status === 'active' && rec.workedTo < now) { job.work(plan, rec, rec.workedTo, now, tally); rec.workedTo = now; }
    rec.cycles += tally.cycles; rec.yielded += tally.yielded;
    return {tally, from};
}
function tick() {
    if (!ports || ports.writable?.() === false) return;
    const live = Object.entries(slice.hires).filter(([id, r]) => r.status === 'active' && jobs.has(id));
    if (!live.length) return;
    const plan = ports.plan(0), now = plan.state.clock, prior = slice;
    const next = structuredClone(slice.hires);
    let changed = false;
    const lines = [];
    for (const [id] of live) {
        const rec = next[id], job = jobs.get(id);
        if (now <= rec.workedTo) continue;
        const {tally, from} = settleRec(plan, job, id, rec, now);
        changed = true;
        const text = job.report?.(rec, tally, span(now - from));
        if (text) lines.push({at: now, text});
        if (tally.ended) lines.push({at: now, text: `${rec.name} stopped coming: the ${coinWord(rec.wage)} for the week was not there, so the arrangement is over. Nothing is owed.`});
    }
    if (!changed) return;
    slice = {...slice, hires: next, reports: [...slice.reports, ...lines].slice(-REPORT_CAP)};
    try { ports.commit(plan); } catch { slice = prior; return; } // read-only or failed save: roll back, settle on a later tick (nothing lost, OB4)
    for (const l of lines) ports.logMessage?.(l.text, 'notification');
}

function problem(jobId, handId) {
    const job = jobs.get(jobId);
    if (!ports) return 'Hiring is not ready yet.';
    if (!job) return 'There is nothing here to hire help for.';
    if (ports.writable?.() === false) return 'Use the writable game tab.';
    const blocked = ports.blocked?.();
    if (blocked) return blocked;
    if (ports.idle?.() === false) return 'Finish what you are doing first.';
    const plan = ports.plan(0), why = job.available(plan);
    if (why) return why;
    if (slice.hires[jobId]?.status === 'active') return `${slice.hires[jobId].name} already tends this.`;
    const c = job.candidates(plan).find(x => x.id === handId);
    if (!c) return 'No one by that name can take this on.';
    const there = job.contact(plan, c) || job.busy?.(plan);
    if (there) return there;
    if ((plan.external?.money ?? 0) < c.wage) return `You need ${coinWord(c.wage)} for the first week, paid ahead.`;
    return '';
}
function hire({jobId, hand, crop} = {}) {
    const reason = problem(jobId, hand);
    if (reason) throw Error(reason);
    const job = jobs.get(jobId), plan = ports.plan(0), c = job.candidates(plan).find(x => x.id === hand), now = plan.state.clock;
    const kind = crop ?? c.crops?.[0] ?? '';
    if (c.crops && !c.crops.includes(kind)) throw Error('That is not a crop this hand will grow.');
    const rec = {hand: c.id, name: c.name, wage: c.wage, crop: kind, pace: c.pace, since: now, workedTo: now, paidThrough: now + WEEK, cycleAt: null,
        status: 'active', endedAt: null, endReason: null, cycles: 0, yielded: 0};
    const prior = slice;
    payWeek(plan, rec);
    job.hire(plan, rec);
    slice = {...slice, hires: {...slice.hires, [jobId]: rec}};
    say(now, `${c.name} takes the plot on for ${coinWord(c.wage)} a week, paid ahead. ${c.line ?? ''}`.trim());
    try { ports.commit(plan); } catch (e) { slice = prior; throw e; }
    ports.logMessage?.(`You hire ${c.name} for ${coinWord(c.wage)} a week.`, 'notification');
    return project();
}
function fire({jobId} = {}) {
    const rec = slice.hires[jobId];
    if (!ports || !rec || rec.status !== 'active') throw Error('No one is hired for that.');
    if (ports.writable?.() === false) throw Error('Use the writable game tab.');
    const plan = ports.plan(0), job = jobs.get(jobId), prior = slice, now = plan.state.clock;
    const next = structuredClone(rec);
    // Settle the days worked first so a fire after a long gap still hands over what was grown; the prepaid week is not refunded (dial: wages are for time worked).
    const {tally, from} = settleRec(plan, job, jobId, next, now);
    const text = job.report?.(next, tally, span(now - from));
    if (next.status === 'active') endHire(plan, job, next, now, 'fired');
    slice = {...slice, hires: {...slice.hires, [jobId]: next}, reports: [...slice.reports, ...(text ? [{at: now, text}] : []), {at: now, text: `You let ${next.name} go. The bed stays as it is; the week already paid is not refunded.`}].slice(-REPORT_CAP)};
    try { ports.commit(plan); } catch (e) { slice = prior; throw e; }
    ports.logMessage?.(`You let ${next.name} go.`, 'notification');
    return project();
}
function quote({jobId, hand} = {}) {
    const job = jobs.get(jobId);
    if (!job || !ports) return {eligible: false, reasons: ['Hiring is not ready yet.']};
    const reason = problem(jobId, hand);
    const c = (() => { try { return job.candidates(ports.plan(0)).find(x => x.id === hand); } catch { return null; } })();
    return {eligible: !reason, reasons: reason ? [reason] : [], wage: c?.wage ?? null};
}
// Everything a panel or a livelihood row needs, derived on read. Read-only.
function project() {
    const out = {jobs: [], hires: [], reports: slice.reports.map(r => ({...r}))};
    for (const [id, rec] of Object.entries(slice.hires)) out.hires.push({jobId: id, ...rec, income: rec.status === 'active' ? jobs.get(id)?.income?.(rec) ?? null : null});
    if (!ports) return out;
    let plan = null;
    try { plan = ports.plan(0); } catch { return out; }
    for (const [id, job] of jobs) {
        let why = '', candidates = [];
        try { why = job.available(plan); candidates = why ? [] : job.candidates(plan); } catch { why = 'Not available.'; }
        const active = slice.hires[id]?.status === 'active';
        out.jobs.push({id, label: job.label, available: !why, why, hired: active,
            candidates: active ? [] : candidates.map(c => { const q = quote({jobId: id, hand: c.id}); return {...c, eligible: q.eligible, reasons: q.reasons}; })});
    }
    return out;
}
// Digest rows for returnDigest({events: {around: ..., missed: []}}): the hand's own reports since the player last looked.
export const handDigestRows = (seenAt = 0) => slice.reports.filter(r => r.at > seenAt).map(r => ({text: r.text, at: r.at}));
export const hireOf = jobId => slice.hires[jobId] ? {...slice.hires[jobId]} : null;
export const handJobs = () => [...jobs.keys()];
registerDomain({id: 'hired_hands', deps: [], initialState: fresh,
    save: () => isEmpty(slice) ? undefined : structuredClone(slice), // an untouched life writes no key: older saves stay byte-identical
    validate: s => { if (s != null && s.family !== HIRED_HANDS_FAMILY) throw Error('Hired hands: wrong family.'); },
    migrate: migrateHiredHands,
    load: s => { slice = migrateHiredHands(s); },
    tick, projection: project, commands: {hire, fire, quote}});
