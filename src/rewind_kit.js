// Rewind kit (XG6, 2026-11-18, proposal): the restore side of the time substrate. One spec, one planner, seven kinds as data.
// Pure leaf (AR4): imports only the pin store's address reader type, no world, no clock, no save. The host domain
// (rewind_domain.js) owns state and supplies ports; this file only plans and never mutates what it is given.
//
// A stage is `{clock, slices:{<id>: json}}`: the saved slices of the domains a rewind may touch (the same values the save holds).
// A path is `slice/seg/seg` (segments escape "/" as %2F); a pattern may use `*` for one segment and `{actor}` for a person.
// A capture keeps the cells (path -> value) a spec's tracked set names. A rewind never restores outside the cells it captured,
// so a pin is a fixed, bounded record, never the whole envelope.
//
// Terms (all defaults with a dial and an in-world reason, AD5; none is a never or an only):
//  kind        global | area | object | personal | perception | undo | branch  (what it selects, below)
//  carry       paths that keep their live value (the carried set); `holder` carries the holder's own mind and body paths
//  anchor      fixed (a named capture) | moving (the capture advances every N minutes or on named events)
//  horizons    per actor: minutes (how far back that person rewinds, at most) | 'outside' (keeps their time)
//  awareness   per actor: none | deja_vu | fragments | full (full = a fellow looper, keeps their memory)
//  nesting     which pin wins when rewinds nest: rank | earliest | latest | own
//  cost, terms CHT4: what the ability asks and what it gives, shown by the inspector line
import {CARRY_CLASSES} from './harm_loops.js';
import {formatDuration} from './number_format.js';

export const REWIND_SCHEMA = 1;
export const REWIND_DIALS = Object.freeze({
    maxCaptures: {value: 12, why: 'A save shares one 4 MiB origin budget; twelve small captures cover a day of moving marks.'},
    maxCells: {value: 400, why: 'A capture names paths, not the whole save; four hundred is more than any one ability tracks.'},
    maxChars: {value: 120000, why: 'Hard cap on the saved captures so a rewind can never crowd out the save itself.'},
    maxLog: {value: 24, why: 'The inspector reads the last two dozen rewinds; older ones fall off.'},
    maxEvents: {value: 64, why: 'Undo recomputes from this log; a longer log is a replay, which the story windows already do.'},
    maxEchoes: {value: 8, why: 'A person half-remembers a handful of rewound spans; more would be a fellow looper.'},
});
export const KINDS = Object.freeze(['global', 'area', 'object', 'personal', 'perception', 'undo', 'branch']);
export const AWARENESS = Object.freeze(['none', 'deja_vu', 'fragments', 'full']);
export const NESTING = Object.freeze(['rank', 'earliest', 'latest', 'own']);
export {CARRY_CLASSES};

const fail = m => { throw Error(`Rewind: ${m}`); };
const check = (ok, m) => { if (!ok) fail(m); };
const plain = v => v !== null && typeof v === 'object' && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.]*$/.test(x);
const ABSENT = Symbol('absent');
const esc = s => String(s).replace(/%/g, '%25').replace(/\//g, '%2F');
const unesc = s => s.replace(/%2F/g, '/').replace(/%25/g, '%');
export const keysAt = (slices, path) => { const v = getAt(slices, segsOf(path)); return v !== ABSENT && v !== null && typeof v === 'object' ? Object.keys(v) : []; };
export const pathOf = (...segs) => segs.map(esc).join('/');
export const segsOf = path => path.split('/').map(unesc);

// ---------- paths ----------
function getAt(slices, segs) {
    let v = slices;
    for (const s of segs) {
        if (v === null || typeof v !== 'object' || !Object.hasOwn(v, s)) return ABSENT;
        v = v[s];
    }
    return v;
}
function setAt(slices, segs, value) {
    check(segs.length >= 1 && segs.every(s => !['__proto__', 'constructor', 'prototype'].includes(s)), 'a path cannot name a prototype key.');
    if (segs.length === 1) { if (value === ABSENT) delete slices[segs[0]]; else slices[segs[0]] = value; return; }
    let v = slices;
    for (const s of segs.slice(0, -1)) {
        if (v[s] === null || typeof v[s] !== 'object') { if (value === ABSENT) return; v[s] = {}; }
        v = v[s];
    }
    const last = segs.at(-1);
    if (value === ABSENT) { if (Array.isArray(v)) v.splice(Number(last), 1); else delete v[last]; } else v[last] = value;
}
// Expand a pattern against the live stage into concrete paths (a `*` fans out over keys; a missing branch yields nothing).
function expand(slices, pattern) {
    let level = [[]];
    for (const seg of segsOf(pattern)) {
        const next = [];
        for (const base of level) {
            if (seg !== '*') { next.push([...base, seg]); continue; }
            const v = getAt(slices, base);
            if (v !== ABSENT && v !== null && typeof v === 'object') for (const k of Object.keys(v)) next.push([...base, k]);
        }
        level = next;
    }
    return level.map(s => pathOf(...s));
}
// a covers b when a is b or an ancestor of b (`*` matches one segment).
const covers = (a, b) => { const x = segsOf(a), y = segsOf(b); return x.length <= y.length && x.every((s, i) => s === '*' || s === y[i]); };
const touches = (a, b) => covers(a, b) || covers(b, a);
const fill = (templates, actor) => (templates ?? []).map(t => t.replaceAll('{actor}', esc(actor)));

// ---------- specs ----------
// The seven kinds differ only in how they pick the restore set; everything after that is one pipeline.
export const KIND_ROWS = Object.freeze({
    global: {restore: spec => spec.select?.paths ?? [], needs: [], why: 'every tracked path returns to the pin'},
    area: {restore: (spec, ctx) => ctx.areas?.[spec.select?.area] ?? [], needs: ['area'], why: "one place's holders and things return; the rest keeps its time"},
    object: {restore: spec => spec.select?.paths ?? [], needs: ['paths'], why: 'one thing returns, such as a wound or a broken item'},
    personal: {restore: spec => spec.select?.paths ?? [], needs: ['holder'], why: 'the world returns; the holder keeps their mind and powers'},
    perception: {restore: (spec, ctx) => ctx.minds ?? [], needs: ['minds'], why: "only other people's memory returns; the world stays"},
    undo: {restore: () => [], needs: ['via'], why: 'one action is taken back and what followed is recomputed from the log'},
    branch: {restore: spec => spec.select?.paths ?? [], needs: [], why: 'the world returns and the old line stays reachable'},
});

export function validateSpec(spec) {
    check(plain(spec) && idLike(spec.id), 'a spec needs a lowercase id.');
    check(KINDS.includes(spec.kind), `unknown kind ${spec.kind}.`);
    check(typeof spec.label === 'string' && spec.label, 'a spec needs a label.');
    check(Array.isArray(spec.track) && spec.track.length && spec.track.every(p => typeof p === 'string'), 'a spec names the paths it tracks.');
    if (spec.kind === 'personal') check(typeof spec.holder === 'string' && spec.holder, 'a personal return names its holder.');
    if (spec.kind === 'area') check(spec.select?.area, 'an area rewind names its area.');
    if (spec.kind === 'object') check(Array.isArray(spec.select?.paths) && spec.select.paths.length, 'an object rewind names its paths.');
    const a = spec.anchor ?? {kind: 'fixed'};
    check(['fixed', 'moving'].includes(a.kind), 'an anchor is fixed or moving.');
    if (a.kind === 'moving') check(Number.isFinite(a.every) && a.every > 0 || Array.isArray(a.on) && a.on.length, 'a moving anchor advances on a period or on events.');
    for (const [actor, level] of Object.entries(spec.awareness ?? {})) check(AWARENESS.includes(level), `awareness of ${actor} is ${AWARENESS.join(', ')}.`);
    for (const [actor, h] of Object.entries(spec.horizons ?? {})) check(h === 'outside' || Number.isFinite(h) && h >= 0, `horizon of ${actor} is minutes or outside.`);
    check(NESTING.includes(spec.nesting ?? 'rank'), `nesting is ${NESTING.join(', ')}.`);
    check(spec.cost === undefined || plain(spec.cost), 'cost is a record.');
    check(spec.terms === undefined || plain(spec.terms), 'terms is a record.');
    return spec;
}

// ---------- store (the saved part) ----------
export const freshStore = () => ({schema: REWIND_SCHEMA, seq: 0, captures: [], anchors: {}, log: [], branches: [], echoes: {}, events: [], lastUsed: {}});
export const isFreshStore = s => !s.captures.length && !s.log.length && !s.branches.length && !Object.keys(s.echoes).length && !s.events.length;

export function validateStore(s) {
    check(plain(s) && s.schema === REWIND_SCHEMA && Number.isSafeInteger(s.seq) && s.seq >= 0, 'invalid rewind slice.');
    for (const k of ['captures', 'log', 'branches', 'events']) check(Array.isArray(s[k]), `invalid rewind slice (${k}).`);
    check(plain(s.anchors) && plain(s.echoes) && plain(s.lastUsed), 'invalid rewind slice.');
    check(s.captures.length <= REWIND_DIALS.maxCaptures.value, 'too many captures.');
    check(JSON.stringify(s.captures).length <= REWIND_DIALS.maxChars.value, 'captures are too large.');
    const ids = new Set();
    for (const c of s.captures) {
        check(plain(c) && typeof c.id === 'string' && !ids.has(c.id) && Number.isFinite(c.at) && plain(c.cells), 'invalid capture.');
        ids.add(c.id);
        check(Object.keys(c.cells).length <= REWIND_DIALS.maxCells.value, 'a capture has too many cells.');
        for (const [p, cell] of Object.entries(c.cells)) {
            check(typeof p === 'string' && p && plain(cell) && (cell.absent === true || Object.hasOwn(cell, 'v')), 'invalid capture cell.');
            segsOf(p);
        }
    }
    for (const b of s.branches) check(ids.has(b.capture) && typeof b.label === 'string', 'a branch names a capture that exists.');
    for (const [spec, a] of Object.entries(s.anchors)) check(typeof a.capture === 'string' && Number.isFinite(a.movedAt) && spec, 'invalid anchor.');
    return s;
}

// A capture of the cells the patterns name, read from the live stage.
export function capture(store, stage, {label, patterns, id, kind = 'mark', keep = []}) {
    check(typeof label === 'string' && label, 'a capture needs a label.');
    const cells = {};
    const paths = [...new Set(patterns.flatMap(p => expand(stage.slices, p)))].sort();
    // Descendants of a captured ancestor are already inside it.
    const top = paths.filter(p => !paths.some(q => q !== p && covers(q, p)));
    for (const p of top) {
        const v = getAt(stage.slices, segsOf(p));
        cells[p] = v === ABSENT ? {absent: true} : {v: structuredClone(v)};
    }
    // A pattern that names a path with nothing there records "nothing", so a restore removes what appeared since.
    for (const p of patterns) if (!p.includes('*') && !top.some(q => touches(q, p)) && !p.includes('{')) cells[p] = {absent: true};
    check(Object.keys(cells).length <= REWIND_DIALS.maxCells.value, 'this capture names too many cells.');
    const n = store.seq + 1;
    const entry = {id: id ?? `c${n}`, at: stage.clock, label, kind, cells};
    check(!store.captures.some(c => c.id === entry.id), `capture ${entry.id} exists.`);
    const protectedIds = new Set([...keep, ...store.branches.map(b => b.capture), ...Object.values(store.anchors).map(a => a.capture)]);
    let captures = [...store.captures, entry];
    while (captures.length > REWIND_DIALS.maxCaptures.value || JSON.stringify(captures).length > REWIND_DIALS.maxChars.value) {
        const drop = captures.find(c => c.id !== entry.id && !protectedIds.has(c.id));
        check(drop, 'no room for another capture: every held capture is an anchor or a branch.');
        captures = captures.filter(c => c !== drop);
    }
    return {store: {...store, seq: n, captures}, capture: entry};
}

// Moving anchor: due on a period since it last moved, or on a named event (a rest, a death, a day's end).
export function anchorDue(spec, store, {clock, events = []}) {
    const a = spec.anchor ?? {kind: 'fixed'};
    if (a.kind !== 'moving') return false;
    const held = store.anchors[spec.id];
    if (!held) return true;
    if (Array.isArray(a.on) && events.some(e => a.on.includes(e))) return true;
    return Number.isFinite(a.every) && clock - held.movedAt >= a.every;
}

// Which pin wins when rewinds nest. candidates: [{capture, owner, rank, own}], each a pin some live rewind could return to.
// Default rank, then earliest. `own` always wins under 'own' (the innermost). Returns {winner, lost:[{owner, reason}]}.
export function resolvePin(candidates, rule = 'rank') {
    check(candidates.length, 'no pin to return to.');
    const by = {
        earliest: (a, b) => a.capture.at - b.capture.at,
        latest: (a, b) => b.capture.at - a.capture.at,
        rank: (a, b) => (b.rank ?? 0) - (a.rank ?? 0) || a.capture.at - b.capture.at,
        own: (a, b) => Number(!!b.own) - Number(!!a.own) || a.capture.at - b.capture.at,
    }[rule];
    check(by, `unknown nesting ${rule}.`);
    const sorted = [...candidates].sort(by);
    return {winner: sorted[0], lost: sorted.slice(1).map(c => ({owner: c.owner, at: c.capture.at, reason: `the ${rule} rule gave way to ${sorted[0].owner}`}))};
}

// ---------- the planner ----------
// plan: what would change, what would carry, who remembers. Pure; the host commits it through its own validated ports.
// ctx: {capture (the spec's pin), standing:[{owner,rank,capture}], pinned(path)->bool (the pin store holds that address),
//       areas, minds:[patterns], actors:[ids present], clock}
export function planRewind(stage, store, spec, ctx) {
    validateSpec(spec);
    const row = KIND_ROWS[spec.kind];
    for (const need of row.needs) if (need === 'minds') check(ctx.minds?.length, 'a perception rewind needs the minds it can reset.');
    const clock = stage.clock;
    // Which pin: the spec's own, unless a nesting rule hands the choice to another live rewind that overlaps.
    const own = ctx.capture ?? check(false, 'there is no pin to return to yet.');
    const overlap = (ctx.standing ?? []).filter(s => s.capture && s.capture.id !== own.id);
    const pick = resolvePin([{capture: own, owner: spec.id, rank: spec.rank ?? 0, own: true}, ...overlap], spec.nesting ?? 'rank');
    const pin = pick.winner.capture;
    const restore = row.restore(spec, ctx);
    const scope = restore.length ? restore : spec.track;
    const mindT = spec.minds ?? [], bodyT = spec.actorPaths ?? [];
    const holder = spec.holder ?? null;
    const carry = [], carryWhy = [];
    const addCarry = (paths, why) => { for (const p of paths) { carry.push(p); carryWhy.push({path: p, why}); } };
    addCarry(spec.carry?.paths ?? [], 'named in the carried set');
    if (holder) addCarry([...fill(mindT, holder), ...fill(bodyT, holder), ...fill(spec.carry?.holder, holder)], 'the holder keeps their own mind and powers');
    // Per-actor handling: horizon, awareness. Actors are the people the rewind could reach.
    const actors = [];
    const actorList = [...new Set([...(ctx.actors ?? []), ...Object.keys(spec.awareness ?? {}).filter(a => a !== '*'), ...Object.keys(spec.horizons ?? {}).filter(a => a !== '*')])]
        .filter(a => a !== holder);
    const perActorPin = new Map();
    for (const actor of actorList) {
        const aware = spec.awareness?.[actor] ?? spec.awareness?.['*'] ?? 'none';
        const horizon = spec.horizons?.[actor] ?? spec.horizons?.['*'] ?? null;
        const paths = [...fill(mindT, actor), ...fill(bodyT, actor)];
        let outcome = 'rewound', used = pin;
        if (horizon === 'outside') { outcome = 'outside'; addCarry(paths, `${actor} is outside the radius and keeps their time`); }
        else if (horizon !== null && clock - pin.at > horizon) {
            const edge = clock - horizon;
            const near = store.captures.filter(c => c.at <= edge && c.at >= pin.at && c.kind !== 'branch').sort((a, b) => b.at - a.at)[0];
            if (near && near.id !== pin.id) { used = near; outcome = 'shorter'; perActorPin.set(actor, {capture: near, paths}); }
            else { outcome = 'kept'; addCarry(paths, `${actor} rewinds at most ${formatDuration(horizon)} and no record that fine is held`); }
        }
        if (aware === 'full' && outcome !== 'outside') { outcome = outcome === 'rewound' ? 'full' : outcome; addCarry(paths, `${actor} remembers (a fellow looper)`); }
        actors.push({actor, awareness: aware, outcome, pinAt: used.at, echo: aware === 'none' || outcome === 'outside' || outcome === 'kept' ? null : aware});
    }
    // Pin store: a canon or cheat pin on a path keeps it across every rewind.
    const held = p => ctx.pinned?.(p) === true;
    const writes = [], carried = [];
    const considered = new Map();
    const take = (cells, owned) => {
        for (const [path, cell] of Object.entries(cells)) {
            if (!scope.some(s => touches(s, path)) || !scope.some(s => covers(s, path) || covers(path, s))) continue;
            if (owned && !owned.some(p => touches(p, path))) continue;
            considered.set(path, cell);
        }
    };
    take(pin.cells);
    for (const [actor, {capture: c, paths}] of perActorPin) {
        // a shorter-horizon actor uses the nearer capture for their own paths only
        for (const p of paths) for (const path of Object.keys(pin.cells)) if (touches(p, path)) considered.delete(path);
        const cells = Object.fromEntries(Object.entries(c.cells).filter(([path]) => paths.some(q => touches(q, path))));
        take(cells);
    }
    if (spec.kind === 'perception') {
        for (const path of [...considered.keys()]) if (!ctx.minds.some(m => touches(m, path)) || (holder && fill(mindT, holder).some(m => covers(m, path)))) considered.delete(path);
    }
    for (const [path, cell] of considered) {
        const heldPin = held(path);
        const carriedBy = carry.findIndex(c => c === path || covers(c, path));
        if (heldPin) { carried.push({path, why: 'the pin store holds this address'}); continue; }
        if (carriedBy >= 0) { carried.push({path, why: carryWhy[carriedBy].why}); continue; }
        const live = getAt(stage.slices, segsOf(path));
        const to = cell.absent ? ABSENT : cell.v;
        if (live !== ABSENT && to !== ABSENT && JSON.stringify(live) === JSON.stringify(to)) continue;
        if (live === ABSENT && to === ABSENT) continue;
        // A carried descendant inside a restored ancestor keeps its live value.
        const inner = carry.filter(c => covers(path, c) && c !== path).map(c => ({path: c, live: getAt(stage.slices, segsOf(c)), why: carryWhy.find(w => w.path === c)?.why ?? 'carried inside a restored area'}));
        writes.push({path, from: live === ABSENT ? undefined : structuredClone(live), to: to === ABSENT ? undefined : structuredClone(to), keep: inner});
        for (const k of inner) carried.push({path: k.path, why: k.why});
    }
    const echoes = actors.filter(a => a.echo).map(a => ({actor: a.actor, level: a.echo, at: clock}));
    return {ok: true, spec: spec.id, kind: spec.kind, clock, pin: {id: pin.id, at: pin.at, label: pin.label}, lost: pick.lost,
        writes, carried, actors, echoes, cost: spec.cost ?? {}, terms: spec.terms ?? {}, branch: spec.kind === 'branch' || spec.branch === true,
        why: row.why};
}

// Apply a plan's writes to a copy of the slices. Throws on a bad path; never touches the input.
export function applyPlan(slices, plan) {
    const next = structuredClone(slices);
    for (const w of plan.writes) {
        const segs = segsOf(w.path);
        setAt(next, segs, w.to === undefined ? ABSENT : structuredClone(w.to));
        for (const k of w.keep ?? []) setAt(next, segsOf(k.path), k.live === ABSENT ? ABSENT : structuredClone(k.live));
    }
    return next;
}
export const touchedSlices = plan => [...new Set(plan.writes.map(w => segsOf(w.path)[0]))];

// ---------- undo one action (from the event log) ----------
// events: [{id, at, writes:[{path, before, after}]}] in order. Undoing e restores each of its paths to the value the nearest
// earlier writer left (or e's own before), unless a LATER event wrote that path: then the path is recomputed as if e never ran
// by replaying the later writers' `after` values (their absolute results stand), and a later event that read what e changed
// (`reads` names the path) is reported as needing a recompute, not guessed at.
export function planUndo(events, eventId, live) {
    const i = events.findIndex(e => e.id === eventId);
    check(i >= 0, `no event ${eventId} in the log.`);
    const target = events[i], later = events.slice(i + 1);
    const writes = [], recompute = [], settled = [];
    for (const w of target.writes) {
        const next = later.filter(e => e.writes.some(x => x.path === w.path));
        if (next.length) { settled.push({path: w.path, by: next[0].id}); continue; }
        const liveV = getAt(live, segsOf(w.path));
        if (liveV !== ABSENT && JSON.stringify(liveV) !== JSON.stringify(w.after)) { settled.push({path: w.path, by: 'something outside the log'}); continue; }
        writes.push({path: w.path, from: w.after, to: w.before});
    }
    for (const e of later) {
        const reads = (e.reads ?? []).filter(p => target.writes.some(w => touches(w.path, p)));
        if (reads.length) recompute.push({id: e.id, because: reads});
    }
    return {ok: true, kind: 'undo', spec: 'undo', event: eventId, writes: writes.map(w => ({...w, keep: []})), settled, recompute, carried: [], actors: [], echoes: [], lost: [],
        pin: {id: eventId, at: target.at, label: `before ${eventId}`}, cost: {}, terms: {}, branch: false, why: KIND_ROWS.undo.why};
}

// ---------- the inspector ----------
// One player line per fact: what came back, what stayed, who remembers (PRS vocabulary: no engine words).
const LEVEL_TEXT = {full: 'remembers everything', fragments: 'keeps fragments', deja_vu: 'feels it was familiar', none: 'remembers nothing'};
export function inspectorLines(report, names = {}) {
    const label = p => names[segsOf(p)[0]] ?? segsOf(p)[0];
    const lines = [];
    const back = [...new Set(report.writes.map(w => label(w.path)))];
    lines.push(back.length ? `Came back to how it was at ${report.pin.label}: ${back.join(', ')}.` : `Nothing needed to come back to ${report.pin.label}.`);
    const reasons = [...new Set(report.carried.map(c => c.why))], stayed = reasons.length > 1 ? reasons.filter(w => !/inside a restored area/.test(w)) : reasons;
    if (stayed.length) lines.push(`Stayed as it is: ${stayed.join('; ')}.`);
    for (const a of report.actors) lines.push(`${a.actor}: ${a.outcome === 'outside' ? 'was outside the reach and kept their time' : a.outcome === 'kept' ? 'could not be taken back that far' : LEVEL_TEXT[a.awareness]}${a.outcome === 'shorter' ? ' (taken back a shorter way)' : ''}.`);
    for (const l of report.lost ?? []) lines.push(`A stronger anchor held: ${l.reason}.`);
    if (report.settled?.length) lines.push(`Left as it is because something later wrote it: ${report.settled.map(s => label(s.path)).join(', ')}.`);
    if (report.recompute?.length) lines.push(`Later actions that leaned on it: ${report.recompute.map(r => r.id).join(', ')}.`);
    return lines;
}

// A spec's price and gain as one readable line (CHT4).
export function termsLine(spec) {
    const c = spec.cost ?? {}, t = spec.terms ?? {};
    const bits = [];
    if (c.cooldown) bits.push(`ready again after ${formatDuration(c.cooldown)}`);
    if (c.note) bits.push(c.note);
    if (t.gain) bits.push(`gives ${t.gain}`);
    for (const l of t.limits ?? []) bits.push(l);
    return bits.join('; ');
}
