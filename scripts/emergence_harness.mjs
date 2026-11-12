// Emergence harness (chat E, procedural foundation plan PFP13, PFP15, MC16).
// Runs a seeded substrate world headless for a long stretch, harvests every
// effect record before the chain cap trims it, and reports:
//   - cause chains, each as a signature of publishing pack, effect kind and
//     answering reactor, root first (PFP13);
//   - quantity contacts, where two packs write one holder's quantity and a third
//     reads it (the O2 half of emergence, which effect records alone miss);
//   - multi-domain chains (two or more chat letters) and which are new against
//     a known list (PFP15: a found chain becomes a regression or a backlog row);
//   - loops: effects damped by the cascade dial, repeats of one step on one path,
//     and signatures whose daily count keeps growing (runaway) versus a steady
//     rhythm;
//   - settlement cost per simulated day: segments (deterministic, the budget)
//     and wall milliseconds (recorded, loose ceiling) (MC16);
//   - a fingerprint of the final world, so one jump, many steps and reloads can
//     be compared.
// The harness reads the substrate's public calls only. It never adds join code
// between packs: a case composes packs and schedules outside ops, nothing else.
import {createHash} from 'node:crypto';
import {advanceWorld, applyWorldOps, serializeWorld, restoreWorld} from '../src/world_substrate.js';

const DAY = 1440;

/** Deterministic draw for scenario parameters (mulberry32). Packs get no randomness from here. */
export function seededRandom(seed) {
    let a = (Number(seed) >>> 0) || 1;
    const next = () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return Object.freeze({next, int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), pick: list => list[Math.floor(next() * list.length)]});
}

export const fingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
const chatOf = pack => pack.includes('.') ? pack.split('.')[0] : pack;

export const HARNESS_DIALS = Object.freeze({
    runawayGrowth: 2,   // a signature counts as runaway when its last-day count is this many times its first-day count...
    runawayFloor: 12,   // ...and at least this many per day; below that a growing count is noise
    windowMinutes: 60,  // harvested modes cut at least this often, so the chain cap never trims a record
                        // before it is read, and quantity contacts are attributed per window
});

// ---------- running ----------

/**
 * Run one case. `mode` decides where the run cuts time:
 *   jump   - only at scheduled outside ops, then straight to the end (chain records may be trimmed);
 *   day    - every day end and scheduled op (the harvest default);
 *   odd    - day cuts plus seeded odd minutes, including any `cuts` the case names;
 *   reload - odd cuts plus a serialize and restore at seeded minutes.
 */
export function runCase(caseDef, {seed = 1, days = caseDef.days ?? 3, mode = 'day', now = () => performance.now()} = {}) {
    const rng = seededRandom(seed);
    const built = caseDef.build({rng, days, seed});
    const {rules} = built;
    let world = built.world;
    const start = world.clock, end = start + days * DAY;
    const schedule = [...(built.schedule ?? [])].filter(s => s.at >= start && s.at <= end).sort((a, b) => a.at - b.at);
    const cutRng = seededRandom(seed * 7919 + 13);
    const cuts = new Set(schedule.map(s => s.at));
    const W = HARNESS_DIALS.windowMinutes;
    if (mode !== 'jump') for (let t = start + W; t <= end; t += W) cuts.add(t);
    const reloads = new Set();
    if (mode === 'odd' || mode === 'reload') {
        for (const c of built.cuts ?? []) if (c > start && c <= end) cuts.add(c);
        for (let i = 0; i < days * 6; i++) cuts.add(cutRng.int(start + 1, end));
    }
    if (mode === 'reload') for (let i = 0; i < days * 2; i++) { const c = cutRng.int(start + 1, end - 1); cuts.add(c); reloads.add(c); }
    cuts.add(end);

    const records = new Map(); // seq -> record copy, harvested before the chain cap trims it
    const gaps = [];
    let lastSeq = world.seq;
    const harvest = () => {
        const fresh = world.chain.filter(r => r.seq > lastSeq);
        if (fresh.length && fresh[0].seq !== lastSeq + 1) gaps.push({from: lastSeq + 1, to: fresh[0].seq - 1});
        for (const r of fresh) records.set(r.seq, structuredClone(r));
        lastSeq = Math.max(lastSeq, world.seq);
    };
    const daily = []; // per simulated day: segments and wall ms
    const charge = (clockBefore, clockAfter, segments, ms) => {
        // Spread a cut's cost over the days it covered, by minutes.
        let t = clockBefore;
        while (t < clockAfter) {
            const d = Math.floor((t - start) / DAY), dayEnd = start + (d + 1) * DAY, span = Math.min(clockAfter, dayEnd) - t;
            const share = span / (clockAfter - clockBefore);
            const row = daily[d] ??= {day: d, segments: 0, ms: 0};
            row.segments += segments * share; row.ms += ms * share;
            t += span;
        }
    };
    const advanceTo = to => {
        while (world.clock < to) {
            const before = world.clock, t0 = now();
            const out = advanceWorld(rules, world, to);
            charge(before, out.world.clock, out.segments, now() - t0);
            world = out.world;
            harvest();
            if (!out.pending) break;
        }
    };
    // Per window, which packs moved each holder's quantity (ledger deltas). The
    // jump mode has no windows: it is for the world fingerprint and the cost.
    const windows = [];
    let lastLedger = ledgerSnapshot(world);
    const closeWindow = () => {
        if (mode === 'jump' || (world.clock - start) % W) return;
        const now = ledgerSnapshot(world), moved = {};
        for (const [key, row] of Object.entries(now)) for (const [source, amount] of Object.entries(row))
            if (source !== 'bound' && source !== 'earlier' && amount !== (lastLedger[key]?.[source] ?? 0)) (moved[key] ??= new Set()).add(source);
        windows[(world.clock - start) / W - 1] = moved;
        lastLedger = now;
    };
    // Generator and search cost per simulated day (PR3, MC16): calls, trials
    // (draws or evaluated candidates, as the search reports them) and wall ms.
    const searchDaily = [], generations = [];
    const metered = at => (name, fn) => {
        const t0 = now(), out = fn();
        const d = Math.floor((at - start) / DAY), row = searchDaily[d] ??= {day: d, calls: 0, trials: 0, ms: 0, by: {}};
        row.calls++; row.trials += out.trials ?? 0; row.ms += now() - t0;
        row.by[name] = (row.by[name] ?? 0) + (out.trials ?? 0);
        return out.value;
    };
    // Case observations, last reading per key (a batch read when it is cleared or the run ends).
    const outcomeMap = new Map();
    const observe = at => { for (const o of built.observe?.(world, at) ?? []) outcomeMap.set(o.key ?? JSON.stringify(o), o); };
    let si = 0;
    for (const cut of [...cuts].sort((a, b) => a - b)) {
        advanceTo(cut);
        closeWindow();
        while (si < schedule.length && schedule[si].at === cut) {
            const s = schedule[si++];
            observe(cut);
            // An op list may be computed at settlement time (an actor or a generator acting
            // on the world as it stands); its searches are metered (PR3, MC16).
            const ops = typeof s.ops === 'function' ? s.ops(world, {at: cut, search: metered(cut), generated: g => generations.push({at: cut, ...g})}) : s.ops;
            world = applyWorldOps(rules, world, ops, s.cause);
            harvest();
        }
        if (reloads.has(cut)) world = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(world))));
    }
    observe(end);
    const outcomes = [...outcomeMap.values()];
    return analyse({caseDef, rules, world, records: [...records.values()].sort((a, b) => a.seq - b.seq), gaps, daily, outcomes, seed, days, mode, start, windows, searchDaily, generations});
}

function ledgerSnapshot(world) {
    const out = {};
    for (const h of Object.values(world.holders)) for (const [name, row] of Object.entries(h.ledger)) out[`${h.id}.${name}`] = {...row};
    return out;
}

// ---------- analysis ----------

// Which pack published a record. Depth 0 effects carry a string cause: a
// decision's `pack:law`, or an outside cause. Deeper ones carry the parent's seq,
// and the parent's reactions name the reacting pack at the publishing holder.
function publisherOf(rec, bySeq, packs) {
    if (typeof rec.cause === 'number') {
        const parent = bySeq.get(rec.cause);
        if (!parent) return {pack: '?', via: '?'};
        const hits = parent.reactions.filter(r => r.endsWith(`@${rec.by}`));
        if (hits.length === 1) { const [pack, reactor] = hits[0].split('@')[0].split(':'); return {pack, via: reactor}; }
        return {pack: hits.length ? 'ambiguous' : '?', via: hits.map(h => h.split('@')[0]).join('+') || '?'};
    }
    const cause = String(rec.cause ?? 'outside');
    const pack = packs.find(p => cause.startsWith(`${p}:`));
    return pack ? {pack, via: cause.slice(pack.length + 1)} : {pack: 'outside', via: cause};
}

function analyse({caseDef, rules, world, records, gaps, daily, outcomes, seed, days, mode, start, windows, searchDaily = [], generations = []}) {
    const packs = [...rules.packs];
    const bySeq = new Map(records.map(r => [r.seq, r]));
    const children = new Map();
    for (const r of records) if (typeof r.cause === 'number') (children.get(r.cause) ?? children.set(r.cause, []).get(r.cause)).push(r);
    const step = r => { const p = publisherOf(r, bySeq, packs); return {pack: p.pack, label: `${p.pack}:${p.via}>${r.kind}`}; };

    // Quantity contacts from the final ledgers: who wrote each holder's quantity,
    // and which packs read it. Ledgers are cumulative, so writer sets only grow.
    const writersOf = ledger => [...new Set(Object.keys(ledger).filter(s => s !== 'bound' && s !== 'earlier')
        .map(s => s.startsWith('effect:') ? 'effect' : packs.find(p => s.startsWith(`${p}:`)) ?? `outside:${s}`))].sort();
    const readers = name => [...new Set(rules.laws.filter(l => l.reads.has(name)).map(l => l.pack)
        .concat(rules.reactors.filter(r => r.reads.has(name)).map(r => r.pack)))].sort();
    const contacts = [];
    for (const h of Object.values(world.holders).sort((a, b) => a.id < b.id ? -1 : 1)) for (const [name, ledger] of Object.entries(h.ledger)) {
        const writers = writersOf(ledger), rd = readers(name).filter(p => !writers.includes(p) || writers.length > 1);
        const domains = new Set([...writers, ...readers(name)].filter(p => packs.includes(p)).map(chatOf));
        if (writers.filter(w => packs.includes(w)).length >= 2 || (writers.some(w => packs.includes(w)) && rd.some(p => !writers.includes(p))))
            contacts.push({holder: h.id, quantity: name, writers, readers: readers(name), multiDomain: domains.size > 1,
                net: Object.fromEntries(Object.entries(ledger).sort())});
    }
    const contactAt = place => contacts.filter(c => c.holder === place);

    // Paths root to leaf. A leaf's state-only reactions close the path.
    const chains = new Map();
    const loops = [];
    const roots = records.filter(r => typeof r.cause !== 'number' || !bySeq.has(r.cause));
    const perDay = new Map();
    const walk = (rec, path, packsOn, seen) => {
        const s = step(rec);
        const key = `${s.pack}|${rec.kind}|${rec.by}`;
        if (seen.has(key)) loops.push({kind: 'repeat-on-path', at: rec.at, step: s.label, root: path[0]});
        const nextPath = [...path, s.label], nextPacks = new Set([...packsOn, s.pack]), nextSeen = new Set([...seen, key]);
        const kids = children.get(rec.seq) ?? [];
        const kidReactors = new Set(kids.map(k => publisherOf(k, bySeq, packs)).map(p => `${p.pack}:${p.via}`));
        const closing = rec.reactions.map(r => r.split('@')[0]).filter(r => !kidReactors.has(r));
        if (rec.damped) loops.push({kind: 'damped-by-cascade-dial', at: rec.at, step: s.label, depth: rec.depth, root: path[0] ?? s.label});
        if (!kids.length || closing.length) {
            for (const r of closing) nextPacks.add(r.split(':')[0]);
            const tail = rec.damped ? 'damped' : closing.length ? closing.sort().join('+') : '-';
            emit(`${nextPath.join(' | ')} | ${tail}`, nextPacks, rec);
        }
        for (const k of kids) walk(k, nextPath, nextPacks, nextSeen);
    };
    let rootRec = null;
    const W = HARNESS_DIALS.windowMinutes;
    const sourcePack = source => packs.find(p => source.startsWith(`${p}:`)) ?? null;
    // A threshold decision (a law with watches) rooted at a place whose quantity
    // another pack moved in the window up to that minute or the one before is a
    // quantity-mediated chain: note which contact fed it and who wrote it then.
    const contactFeeding = rec => {
        const p = publisherOf(rec, bySeq, packs);
        const law = rules.laws.find(l => l.pack === p.pack && l.law.id === p.via);
        if (!law?.law.watches || rec.depth !== 0) return [];
        const i = Math.floor((rec.at - 1 - start) / W);
        const out = [];
        for (const c of contactAt(rec.place)) {
            if (!c.readers.includes(p.pack)) continue;
            const key = `${c.holder}.${c.quantity}`;
            const writers = new Set([...(windows[i]?.[key] ?? []), ...(windows[i - 1]?.[key] ?? [])].map(sourcePack).filter(Boolean));
            if ([...writers].some(w => w !== p.pack)) out.push({quantity: c.quantity, writers: [...writers].sort()});
        }
        return out;
    };
    const emit = (signature, packsOn, leaf) => {
        const real = [...packsOn].filter(p => packs.includes(p));
        const via = contactFeeding(rootRec);
        const viaPacks = via.flatMap(c => c.writers);
        const full = via.length ? `${via.map(c => `${c.quantity}{${c.writers.join(',')}}`).join('+')} ~ ${signature}` : signature;
        const domains = [...new Set([...real, ...viaPacks].map(chatOf))].sort();
        const row = chains.get(full) ?? {signature: full, domains, multiDomain: domains.length > 1, count: 0, first: leaf.at, last: leaf.at, example: rootRec.seq};
        row.count++; row.last = leaf.at;
        chains.set(full, row);
        const d = Math.floor((rootRec.at - start) / DAY);
        const pd = perDay.get(full) ?? perDay.set(full, []).get(full);
        pd[d] = (pd[d] ?? 0) + 1;
    };
    for (const r of roots) { rootRec = r; walk(r, [], new Set(), new Set()); }

    // Runaway versus rhythm, from per-day counts of each signature.
    const rhythms = [], runaways = [];
    for (const [sig, counts] of perDay) {
        const full = Array.from({length: days}, (_, i) => counts[i] ?? 0);
        if (days < 2) continue;
        const first = full.find(c => c > 0) ?? 0, last = full[days - 1];
        if (first && last >= HARNESS_DIALS.runawayFloor && last >= first * HARNESS_DIALS.runawayGrowth) runaways.push({signature: sig, perDay: full});
        else if (full.filter(c => c > 0).length >= Math.min(days, 2)) rhythms.push({signature: sig, perDay: full});
    }

    const known = new Set(caseDef.known ?? []);
    const chainRows = [...chains.values()].sort((a, b) => a.signature < b.signature ? -1 : 1);
    const segmentsPerDay = daily.map(d => Math.round(d.segments * 100) / 100);
    const msPerDay = daily.map(d => Math.round(d.ms * 100) / 100);
    const report = {
        case: caseDef.id, seed, days, mode, clock: world.clock,
        fingerprint: fingerprint(serializeWorld(world)),
        records: records.length, gaps,
        chains: chainRows,
        multiDomain: chainRows.filter(c => c.multiDomain).map(c => c.signature),
        newChains: chainRows.filter(c => c.multiDomain && !known.has(c.signature)).map(c => c.signature),
        contacts,
        loops: {damped: loops.filter(l => l.kind === 'damped-by-cascade-dial'), repeats: loops.filter(l => l.kind === 'repeat-on-path'), runaways, rhythms},
        outcomes,
        generations,
        cost: {segmentsPerDay, maxSegmentsPerDay: Math.max(0, ...segmentsPerDay), msPerDay, maxMsPerDay: Math.max(0, ...msPerDay),
            search: Array.from({length: days}, (_, d) => {
                const r = searchDaily[d] ?? {calls: 0, trials: 0, ms: 0, by: {}};
                return {day: d, calls: r.calls, trials: r.trials, ms: Math.round(r.ms * 100) / 100, by: r.by};
            })},
    };
    report.cost.maxSearchTrialsPerDay = Math.max(0, ...report.cost.search.map(r => r.trials));
    report.cost.maxSearchMsPerDay = Math.max(0, ...report.cost.search.map(r => r.ms));
    report.chainFingerprint = fingerprint({chains: chainRows, contacts, loops: report.loops, outcomes, generations});
    return report;
}

/** Run a case in every mode and say whether they agree (one jump, many steps, reload). */
export function runEquivalence(caseDef, opts = {}) {
    const runs = Object.fromEntries(['jump', 'day', 'odd', 'reload'].map(mode => [mode, runCase(caseDef, {...opts, mode})]));
    const worlds = new Set(Object.values(runs).map(r => r.fingerprint));
    // The jump run may lose records to the chain cap; chains compare across harvested runs.
    const harvested = ['day', 'odd', 'reload'].map(m => runs[m]);
    const chainSets = new Set(harvested.map(r => r.chainFingerprint));
    // Settlement cost (MC16) comes from the jump run: it has no harness cuts of its own.
    return {runs, cost: runs.jump.cost, sameWorld: worlds.size === 1, sameChains: chainSets.size === 1 && harvested.every(r => !r.gaps.length)};
}

/** MC16: which budget lines a report exceeds (empty when within budget). */
export function overBudget(report, budget = {}) {
    const out = [];
    if (budget.segmentsPerDay != null && report.cost.maxSegmentsPerDay > budget.segmentsPerDay)
        out.push(`segments/day ${report.cost.maxSegmentsPerDay} > ${budget.segmentsPerDay}`);
    if (budget.msPerDay != null && report.cost.maxMsPerDay > budget.msPerDay) out.push(`ms/day ${report.cost.maxMsPerDay} > ${budget.msPerDay}`);
    if (budget.searchTrialsPerDay != null && report.cost.maxSearchTrialsPerDay > budget.searchTrialsPerDay)
        out.push(`search trials/day ${report.cost.maxSearchTrialsPerDay} > ${budget.searchTrialsPerDay}`);
    if (budget.searchMsPerDay != null && report.cost.maxSearchMsPerDay > budget.searchMsPerDay)
        out.push(`search ms/day ${report.cost.maxSearchMsPerDay} > ${budget.searchMsPerDay}`);
    return out;
}

/**
 * GL4 context fit: do things arise where the source says they do? For each
 * place with an expected value of one part (`expect[place] = value`), compare
 * the share of that place's generations carrying the value with its base share
 * (the corpus rate, `base[value]`). Lift at or above the dial counts as fit.
 * `partOf(generation)` returns the list of values a generation carries.
 */
export function contextFit(generations, {expect, base, partOf, lift = 1.5, minCount = 8}) {
    const rows = Object.entries(expect).sort().map(([place, value]) => {
        const here = generations.filter(g => g.place === place);
        const hits = here.filter(g => partOf(g).includes(value)).length;
        const share = here.length ? hits / here.length : 0, b = base[value] ?? 0;
        const ratio = b ? share / b : 0;
        return {place, value, count: here.length, hits, share: Math.round(share * 1000) / 1000, base: Math.round(b * 1000) / 1000,
            lift: Math.round(ratio * 100) / 100, fit: here.length >= minCount && ratio >= lift};
    });
    return {rows, fit: rows.filter(r => r.fit).length, of: rows.length, lift, minCount};
}

/** Short text form of a report for the CLI and checkpoints. */
export function describeReport(r) {
    const lines = [`${r.case} seed ${r.seed}, ${r.days} days, mode ${r.mode}: world ${r.fingerprint}, chains ${r.chainFingerprint}`,
        `  ${r.records} effect records, ${r.chains.length} chain shapes, ${r.multiDomain.length} multi-domain, ${r.newChains.length} new; gaps ${r.gaps.length}`,
        `  cost: max ${r.cost.maxSegmentsPerDay} segments/day, max ${r.cost.maxMsPerDay} ms/day`];
    for (const c of r.chains.filter(c => c.multiDomain)) lines.push(`  [${c.domains.join('')}] x${c.count} ${c.signature}${r.newChains.includes(c.signature) ? '  (NEW)' : ''}`);
    for (const c of r.contacts) lines.push(`  contact ${c.holder}.${c.quantity}: writers ${c.writers.join(', ')}; readers ${c.readers.join(', ')}`);
    lines.push(`  loops: ${r.loops.damped.length} damped by dial, ${r.loops.repeats.length} repeats on a path, ${r.loops.runaways.length} runaway, ${r.loops.rhythms.length} rhythms`);
    for (const o of r.outcomes) lines.push(`  outcome ${JSON.stringify(o)}`);
    return lines.join('\n');
}
