// World substrate v0 (chat W, procedural foundation plan O2-O5, PFP10-PFP15).
// Contract: docs/WORLD_SUBSTRATE_CONTRACT.md. Pure: every call returns a new world.
//
// Places, bodies and things are holders. Each carries typed integer quantities
// (a declared unit and bounds) with a provenance ledger, and law fields can be
// scoped to it. Domain packs never import each other: they declare the
// quantities they read and write, laws that change them over time and reactors
// that answer effects published into a place. Time settles in segments cut at
// every boundary a law can see, so one jump, many steps, near detail and far
// detail all give the same totals (SPR28, TMR4).
export const SUBSTRATE_SCHEMA = 'oops.world-substrate';
export const SUBSTRATE_REVISION = 0;

const fail = message => { throw new Error(`World substrate: ${message}`); };
const check = (ok, message) => { if (!ok) fail(message); };
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);
const whole = n => Number.isSafeInteger(n);
const KINDS = ['place', 'body', 'thing'];
const OPS = {gte: (a, b) => a >= b, gt: (a, b) => a > b, lt: (a, b) => a < b, lte: (a, b) => a <= b, eq: (a, b) => a === b};
const byId = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// Dials with their defaults. Each is a world setting, not a fixed limit.
export const SUBSTRATE_DIALS = Object.freeze({
    cascadeDepth: 4,      // reacting levels: an effect at this depth or deeper lands with no reactions and is recorded as damped
    chainCap: 200,        // effect records kept for cause chains (oldest trimmed first, SPR30)
    ledgerCap: 24,        // provenance sources kept per quantity; older ones merge into 'earlier'
    segmentBudget: 20000, // segments per advance call before it returns pending (CX5, TMR8)
    nearStep: 1,          // minutes per step while any place is settled near the player
});

/** Merge pack declarations into one frozen rule set. Order of `packs` is the
 * fixed settlement order (then law order inside a pack, then holder id). */
export function composeSubstrate({packs, quantities = [], dials = {}}) {
    check(Array.isArray(packs) && packs.length, 'compose needs packs.');
    const q = new Map();
    const addQuantity = (def, owner) => {
        check(idLike(def?.id) && typeof def.unit === 'string' && def.unit, `quantity needs id and unit (${owner}).`);
        const min = def.min ?? 0, max = def.max ?? Number.MAX_SAFE_INTEGER;
        check(whole(min) && whole(max) && min <= max, `quantity ${def.id} has bad bounds.`);
        const prior = q.get(def.id);
        if (prior) check(prior.unit === def.unit && prior.min === min && prior.max === max,
            `quantity ${def.id} declared twice with different unit or bounds (${prior.owner}, ${owner}).`);
        else q.set(def.id, Object.freeze({id: def.id, unit: def.unit, min, max, owner}));
    };
    for (const def of quantities) addQuantity(def, 'world');
    const seen = new Set(), laws = [], reactors = [];
    for (const pack of packs) {
        check(idLike(pack?.id) && !seen.has(pack.id), 'each pack needs a unique id.');
        seen.add(pack.id);
        for (const def of pack.quantities ?? []) addQuantity(def, pack.id);
        const reads = new Set([...(pack.reads ?? []), ...(pack.writes ?? [])]), writes = new Set(pack.writes ?? []);
        for (const name of reads) check(q.has(name), `pack ${pack.id} names undeclared quantity ${name}.`);
        for (const law of pack.laws ?? []) {
            check(idLike(law.id) && typeof law.appliesTo === 'function', `law in ${pack.id} needs id and appliesTo.`);
            check(!law.advance === !law.horizon || !law.advance, `law ${law.id}: advance needs a horizon.`);
            laws.push(Object.freeze({pack: pack.id, law, reads, writes}));
        }
        for (const reactor of pack.reactors ?? []) {
            check(idLike(reactor.id) && Array.isArray(reactor.on) && typeof reactor.react === 'function' &&
                typeof reactor.appliesTo === 'function', `reactor in ${pack.id} needs id, on, appliesTo and react.`);
            reactors.push(Object.freeze({pack: pack.id, reactor, reads, writes}));
        }
    }
    const d = {...SUBSTRATE_DIALS, ...dials};
    for (const [k, v] of Object.entries(d)) check(whole(v) && v >= (k === 'cascadeDepth' ? 0 : 1), `dial ${k} must be a whole number.`);
    return Object.freeze({quantities: q, packs: Object.freeze(packs.map(p => p.id)), laws, reactors, dials: Object.freeze(d)});
}

// ---------- holders, ledger, chain ----------

function makeHolder(rules, h) {
    check(idLike(h?.id) && KINDS.includes(h.kind), `holder needs id and kind (${h?.id}).`);
    check(h.kind === 'place' ? h.place == null : idLike(h.place), `holder ${h.id}: places have no place; bodies and things sit in one.`);
    const quantities = {};
    for (const [name, amount] of Object.entries(h.quantities ?? {})) {
        const def = rules.quantities.get(name);
        check(def, `holder ${h.id} carries undeclared quantity ${name}.`);
        check(whole(amount) && amount >= def.min && amount <= def.max, `holder ${h.id}: ${name} out of bounds.`);
        quantities[name] = amount;
    }
    check(h.detail == null || (h.kind === 'place' && ['near', 'far'].includes(h.detail)), `holder ${h.id}: detail is near or far, on places.`);
    return {id: h.id, kind: h.kind, place: h.place ?? null, tags: [...(h.tags ?? [])].sort(),
        ...(h.detail ? {detail: h.detail} : {}), quantities,
        ledger: structuredClone(h.ledger ?? {}), state: structuredClone(h.state ?? {})};
}

function credit(rules, holder, name, source, amount) {
    if (!amount) return;
    const row = holder.ledger[name] ??= {};
    if (!(source in row) && Object.keys(row).length >= rules.dials.ledgerCap) {
        const oldest = Object.keys(row).find(k => k !== 'earlier');
        row.earlier = (row.earlier ?? 0) + row[oldest];
        delete row[oldest];
    }
    row[source] = (row[source] ?? 0) + amount;
}

// Adds with clamping; whatever the bound refuses is credited to 'bound' so the
// ledger always sums to the change in amount (SPR25).
function addAmount(rules, holder, name, amount, source) {
    const def = rules.quantities.get(name);
    check(def && name in holder.quantities, `${holder.id} does not carry ${name}.`);
    check(whole(amount), `amount for ${name} must be whole.`);
    const before = holder.quantities[name];
    const after = Math.min(def.max, Math.max(def.min, before + amount));
    holder.quantities[name] = after;
    credit(rules, holder, name, source, amount);
    credit(rules, holder, name, 'bound', after - before - amount);
    return after - before;
}

function record(rules, world, row) {
    world.chain.push(row);
    if (world.chain.length > rules.dials.chainCap) world.chain.splice(0, world.chain.length - rules.dials.chainCap);
}

// ---------- views ----------

// Read-only view for one pack. State reads are limited to the pack's own slice:
// domains exchange through quantities and effects, not each other's state (PFP10).
function viewFor(rules, world, pack) {
    const holder = id => world.holders[id];
    return Object.freeze({
        clock: world.clock,
        holder: id => { const h = holder(id); return h && Object.freeze({id: h.id, kind: h.kind, place: h.place, tags: h.tags}); },
        has: (id, name) => !!holder(id) && name in holder(id).quantities,
        amount: (id, name) => { const h = holder(id); check(h && name in h.quantities, `${id} does not carry ${name}.`); return h.quantities[name]; },
        state: id => structuredClone(holder(id)?.state[pack] ?? null),
        placeOf: id => { const h = holder(id); return !h ? null : h.kind === 'place' ? h.id : h.place; },
        present: place => Object.keys(world.holders).filter(id => world.holders[id].place === place).sort(byId),
        // Nearest scope first: the holder, then its place, then the world.
        lawFields: (id, kind) => {
            const h = holder(id), scopes = [id, h?.kind === 'place' ? null : h?.place, 'world'].filter(Boolean);
            return scopes.flatMap(s => world.laws.filter(f => f.scope === s && f.kind === kind)).map(f => structuredClone(f));
        },
    });
}

// ---------- operations and contact ----------

function applyOps(rules, world, ops, ctx, queue) {
    check(Array.isArray(ops ?? []), 'ops must be a list.');
    for (const op of ops ?? []) {
        const h = op.holder != null ? world.holders[op.holder] : null;
        switch (op.op) {
        case 'state': {
            check(h, `state op on unknown holder ${op.holder}.`);
            const pack = ctx.pack ?? op.pack;
            check(idLike(pack) && (!ctx.pack || !op.pack || op.pack === ctx.pack), 'a law writes only its own pack state.');
            if (op.value == null) delete h.state[pack]; else h.state[pack] = structuredClone(op.value);
            break;
        }
        case 'add': case 'set': {
            check(h, `${op.op} op on unknown holder ${op.holder}.`);
            check(!ctx.writes || ctx.writes.has(op.quantity), `pack ${ctx.pack} does not declare writing ${op.quantity}.`);
            const amount = op.op === 'set' ? op.amount - (h.quantities[op.quantity] ?? 0) : op.amount;
            addAmount(rules, h, op.quantity, amount, op.source ?? ctx.source);
            break;
        }
        case 'carry': {
            check(h && rules.quantities.has(op.quantity), 'carry needs a holder and a declared quantity.');
            check(!(op.quantity in h.quantities), `${h.id} already carries ${op.quantity}.`);
            const def = rules.quantities.get(op.quantity), amount = op.amount ?? Math.max(def.min, 0);
            check(whole(amount) && amount >= def.min && amount <= def.max, 'carry amount out of bounds.');
            h.quantities[op.quantity] = amount;
            break;
        }
        case 'publish': {
            check(typeof op.kind === 'string' && world.holders[op.place]?.kind === 'place', 'publish needs a kind and a place.');
            if (op.quantity != null) check(rules.quantities.has(op.quantity) && whole(op.amount), 'an effect on a quantity needs a whole amount.');
            queue.push({kind: op.kind, place: op.place, quantity: op.quantity ?? null, amount: op.amount ?? 0,
                detail: structuredClone(op.detail ?? null), by: op.by ?? ctx.by ?? ctx.source,
                depth: ctx.depth ?? 0, cause: ctx.parent ?? ctx.cause ?? null});
            break;
        }
        case 'move': {
            check(h && h.kind !== 'place' && world.holders[op.to]?.kind === 'place', 'move needs a body or thing and a place.');
            const from = h.place;
            if (from === op.to) break;
            h.place = op.to;
            queue.push({kind: 'departed', place: from, quantity: null, amount: 0, detail: {to: op.to}, by: h.id, depth: ctx.depth ?? 0, cause: ctx.parent ?? ctx.cause ?? null});
            queue.push({kind: 'arrived', place: op.to, quantity: null, amount: 0, detail: {from}, by: h.id, depth: ctx.depth ?? 0, cause: ctx.parent ?? ctx.cause ?? null});
            break;
        }
        case 'holder_add': {
            check(!ctx.pack, 'only outside callers add holders.');
            const made = makeHolder(rules, op.value);
            check(!world.holders[made.id], `holder ${made.id} exists.`);
            check(made.kind === 'place' || world.holders[made.place]?.kind === 'place', `holder ${made.id} sits in an unknown place.`);
            world.holders[made.id] = made;
            break;
        }
        case 'holder_remove': {
            check(!ctx.pack && h, 'only outside callers remove holders.');
            check(!Object.values(world.holders).some(x => x.place === h.id), `place ${h.id} still holds things.`);
            delete world.holders[h.id];
            break;
        }
        case 'law_add': {
            const f = op.field;
            check(idLike(f?.id) && idLike(f.kind) && (f.scope === 'world' || world.holders[f.scope]), 'law field needs id, kind and a scope.');
            check(!world.laws.some(x => x.id === f.id), `law field ${f.id} exists.`);
            world.laws.push({id: f.id, scope: f.scope, kind: f.kind, params: structuredClone(f.params ?? {}), source: f.source ?? ctx.source ?? null});
            world.laws.sort((a, b) => byId(a.id, b.id));
            break;
        }
        case 'law_remove':
            check(world.laws.some(x => x.id === op.id), `no law field ${op.id}.`);
            world.laws = world.laws.filter(x => x.id !== op.id);
            break;
        default: fail(`unknown op ${op.op}.`);
        }
    }
}

// Breadth-first, fixed order: each effect lands on its place's quantity, then
// present holders (sorted by id, the place first) react through their packs in
// pack order. Past the depth dial an effect still lands but nothing reacts.
function settleContact(rules, world, queue) {
    while (queue.length) {
        const e = queue.shift();
        const seq = ++world.seq;
        const place = world.holders[e.place];
        let landed = 0;
        if (e.quantity != null && place && e.quantity in place.quantities)
            landed = addAmount(rules, place, e.quantity, e.amount, `effect:${e.kind}:${e.by}`);
        const damped = e.depth >= rules.dials.cascadeDepth;
        const row = {seq, at: world.clock, kind: e.kind, place: e.place, by: e.by, depth: e.depth, cause: e.cause,
            quantity: e.quantity, amount: e.amount, landed, reactions: [], ...(damped ? {damped: true} : {})};
        record(rules, world, row);
        if (damped || !place) continue;
        const effect = Object.freeze({...e, seq, detail: structuredClone(e.detail)});
        for (const id of [e.place, ...Object.keys(world.holders).filter(x => world.holders[x].place === e.place).sort(byId)]) {
            for (const {pack, reactor, writes} of rules.reactors) {
                const h = world.holders[id];
                if (!h || !reactor.on.includes(e.kind) || !reactor.appliesTo(Object.freeze({...h}))) continue;
                const ops = reactor.react(viewFor(rules, world, pack), id, effect);
                if (!ops?.length) continue;
                row.reactions.push(`${pack}:${reactor.id}@${id}`);
                applyOps(rules, world, ops, {pack, writes, source: `${pack}:${reactor.id}:${id}`, by: id, depth: e.depth + 1, parent: seq}, queue);
            }
        }
    }
}

// ---------- worlds ----------

export function createWorld(rules, {clock = 0, holders = [], lawFields = []} = {}) {
    check(whole(clock) && clock >= 0, 'clock must be whole minutes.');
    // A new world counts its first minute as decided: nothing fires at creation.
    const world = {schema: SUBSTRATE_SCHEMA, revision: SUBSTRATE_REVISION, clock, decidedAt: clock, seq: 0, holders: {}, laws: [], chain: []};
    applyOps(rules, world, holders.map(value => ({op: 'holder_add', value})), {source: 'create'}, []);
    applyOps(rules, world, lawFields.map(field => ({op: 'law_add', field})), {source: 'create'}, []);
    return validateWorld(rules, world);
}

/** Outside changes (a player action, a settlement, a move) at the current minute.
 * Effects they publish settle at once. The minute's decisions are not rerun. */
export function applyWorldOps(rules, world0, ops, cause) {
    check(typeof cause === 'string' && cause, 'outside ops need a cause.');
    const world = structuredClone(world0), queue = [];
    applyOps(rules, world, ops, {source: cause, cause, by: cause}, queue);
    settleContact(rules, world, queue);
    return validateWorld(rules, world);
}

function decideAll(rules, world) {
    for (const entry of rules.laws) {
        if (!entry.law.decide) continue;
        for (const id of Object.keys(world.holders).sort(byId)) {
            const h = world.holders[id];
            if (!h || !entry.law.appliesTo(Object.freeze({...h}))) continue;
            const queue = [];
            applyOps(rules, world, entry.law.decide(viewFor(rules, world, entry.pack), id),
                {pack: entry.pack, writes: entry.writes, source: `${entry.pack}:${entry.law.id}:${id}`, by: id, depth: 0, cause: `${entry.pack}:${entry.law.id}`}, queue);
            settleContact(rules, world, queue);
        }
    }
}

function applicable(rules, world) {
    const out = [];
    for (const entry of rules.laws) for (const id of Object.keys(world.holders).sort(byId))
        if (entry.law.appliesTo(Object.freeze({...world.holders[id]}))) out.push({...entry, id, view: viewFor(rules, world, entry.pack)});
    return out;
}

// Smallest t >= 1 (up to cap) at which the predicate on v + r*t differs from now.
export function linearFlip(v, r, op, value, cap) {
    const test = OPS[op];
    check(test && whole(value), `bad watch ${op} ${value}.`);
    if (!r || cap < 1) return Infinity;
    const now = test(v, value);
    if (test(v + r * cap, value) === now) return Infinity;
    let lo = 1, hi = cap; // predicate on a monotone line flips once
    while (lo < hi) { const mid = (lo + hi) >> 1; if (test(v + r * mid, value) !== now) hi = mid; else lo = mid + 1; }
    return lo;
}

/** Settle to `toClock`. Decisions run exactly once at every minute boundary
 * reached, including toClock itself; a later call does not repeat them. */
export function advanceWorld(rules, world0, toClock) {
    check(whole(toClock) && toClock >= world0.clock, 'advance needs a later whole-minute clock.');
    const world = structuredClone(world0);
    let segments = 0;
    for (;;) {
        if (world.decidedAt !== world.clock) { decideAll(rules, world); world.decidedAt = world.clock; }
        if (world.clock >= toClock) break;
        if (segments >= rules.dials.segmentBudget) return {world: validateWorld(rules, world), segments, pending: true};
        const laws = applicable(rules, world);
        // Net per-minute rate on each (holder, quantity), and who contributes it.
        const flows = new Map();
        for (const l of laws) for (const r of l.law.rates?.(l.view, l.id) ?? []) {
            check(l.writes.has(r.quantity), `pack ${l.pack} does not declare writing ${r.quantity}.`);
            check(world.holders[r.holder] && r.quantity in world.holders[r.holder].quantities, `${r.holder} does not carry ${r.quantity}.`);
            check(whole(r.perMinute), 'rates are whole units per minute.');
            if (!r.perMinute) continue;
            const key = `${r.holder}\u0000${r.quantity}`;
            const f = flows.get(key) ?? {holder: r.holder, quantity: r.quantity, net: 0, parts: []};
            f.net += r.perMinute; f.parts.push({source: `${l.pack}:${l.law.id}:${l.id}`, perMinute: r.perMinute});
            flows.set(key, f);
        }
        const near = Object.values(world.holders).some(h => h.kind === 'place' && h.detail === 'near');
        let k = toClock - world.clock;
        if (near) k = Math.min(k, rules.dials.nearStep);
        // A decision that would still act on the current state (one created or
        // changed out of line with its own thresholds) acts at the next minute.
        if (laws.some(l => l.law.decide?.(l.view, l.id)?.length)) k = 1;
        const effective = (holder, name) => {
            const f = flows.get(`${holder}\u0000${name}`), v = world.holders[holder].quantities[name], def = rules.quantities.get(name);
            if (!f?.net || (f.net > 0 && v >= def.max) || (f.net < 0 && v <= def.min)) return 0;
            return f.net;
        };
        // Stay inside bounds: a step that would overshoot is a single clamped minute.
        for (const f of flows.values()) {
            const r = effective(f.holder, f.quantity);
            if (!r) continue;
            const v = world.holders[f.holder].quantities[f.quantity], def = rules.quantities.get(f.quantity);
            k = Math.min(k, Math.max(1, Math.floor((r > 0 ? def.max - v : v - def.min) / Math.abs(r))));
        }
        for (const l of laws) {
            for (const w of l.law.watches?.(l.view, l.id) ?? []) {
                check(l.reads.has(w.quantity), `pack ${l.pack} does not declare reading ${w.quantity}.`);
                if (!world.holders[w.holder] || !(w.quantity in world.holders[w.holder].quantities)) continue;
                k = Math.min(k, linearFlip(world.holders[w.holder].quantities[w.quantity], effective(w.holder, w.quantity), w.op, w.value, k));
            }
            if (l.law.horizon) {
                const hz = l.law.horizon(l.view, l.id);
                check(hz === Infinity || (whole(hz) && hz >= 1), `law ${l.law.id}: horizon is whole minutes >= 1.`);
                k = Math.min(k, hz);
            }
        }
        for (const f of flows.values()) {
            const h = world.holders[f.holder];
            const before = h.quantities[f.quantity];
            for (const p of f.parts) credit(rules, h, f.quantity, p.source, p.perMinute * k);
            const def = rules.quantities.get(f.quantity);
            h.quantities[f.quantity] = Math.min(def.max, Math.max(def.min, before + f.net * k));
            credit(rules, h, f.quantity, 'bound', h.quantities[f.quantity] - before - f.net * k);
        }
        for (const l of laws) if (l.law.advance)
            applyOps(rules, world, l.law.advance(l.view, l.id, k), {pack: l.pack, writes: new Set(), source: `${l.pack}:${l.law.id}:${l.id}`}, []);
        world.clock += k;
        segments++;
    }
    return {world: validateWorld(rules, world), segments, pending: false};
}

// ---------- reading ----------

export const readQuantity = (world, id, name) => world.holders[id]?.quantities[name] ?? null;
export const readProvenance = (world, id, name) => structuredClone(world.holders[id]?.ledger[name] ?? {});

/** The cause chain behind one effect, root first (PFP13). */
export function explainEffect(world, seq) {
    const out = [];
    let row = world.chain.find(r => r.seq === seq);
    while (row) {
        out.unshift({seq: row.seq, at: row.at, kind: row.kind, by: row.by, place: row.place});
        row = typeof row.cause === 'number' ? world.chain.find(r => r.seq === row.cause) : null;
    }
    return out;
}

/** Flat facts in the simulation predicate shape: self.<q>, here.<q>, world.clock. */
export function substrateFacts(world, id) {
    const h = world.holders[id];
    check(h, `no holder ${id}.`);
    const facts = {'world.clock': world.clock};
    for (const [k, v] of Object.entries(h.quantities)) facts[`self.${k}`] = v;
    const place = h.kind === 'place' ? h : world.holders[h.place];
    for (const [k, v] of Object.entries(place?.quantities ?? {})) facts[`here.${k}`] = v;
    return facts;
}

// ---------- save shape (OS8) ----------

// One migration per revision step; v0 is the first shape, so the table is empty.
const MIGRATIONS = Object.freeze({});

export function migrateWorldSave(saved) {
    check(saved?.schema === SUBSTRATE_SCHEMA && whole(saved.revision), 'not a world substrate save.');
    check(saved.revision <= SUBSTRATE_REVISION, `save revision ${saved.revision} is newer than this build.`);
    let out = structuredClone(saved);
    while (out.revision < SUBSTRATE_REVISION) out = MIGRATIONS[out.revision](out);
    return out;
}

export function serializeWorld(world) {
    return JSON.parse(JSON.stringify(world));
}

/** Pack state slices for packs this build does not load are kept untouched. */
export function restoreWorld(rules, saved) {
    const raw = migrateWorldSave(saved);
    const world = {schema: SUBSTRATE_SCHEMA, revision: SUBSTRATE_REVISION, clock: raw.clock, decidedAt: raw.decidedAt,
        seq: raw.seq, holders: {}, laws: [], chain: structuredClone(raw.chain ?? [])};
    check(whole(raw.clock) && whole(raw.decidedAt) && raw.decidedAt <= raw.clock && whole(raw.seq), 'save clock fields are invalid.');
    for (const h of Object.values(raw.holders ?? {})) world.holders[h.id] = makeHolder(rules, h);
    world.laws = structuredClone(raw.laws ?? []);
    return validateWorld(rules, world);
}

export function validateWorld(rules, world) {
    check(world?.schema === SUBSTRATE_SCHEMA && world.revision === SUBSTRATE_REVISION, 'unknown world shape.');
    for (const [id, h] of Object.entries(world.holders)) {
        check(h.id === id && KINDS.includes(h.kind), `holder ${id} is malformed.`);
        if (h.kind !== 'place') check(world.holders[h.place]?.kind === 'place', `holder ${id} sits in an unknown place.`);
        for (const [name, amount] of Object.entries(h.quantities)) {
            const def = rules.quantities.get(name);
            check(def && whole(amount) && amount >= def.min && amount <= def.max, `holder ${id}: ${name} invalid.`);
            const sum = Object.values(h.ledger[name] ?? {}).reduce((a, b) => a + b, 0);
            check(whole(sum), `holder ${id}: ${name} ledger invalid.`);
        }
    }
    for (const f of world.laws) check(idLike(f.id) && (f.scope === 'world' || world.holders[f.scope]), `law field ${f.id} has no scope.`);
    check(world.chain.length <= rules.dials.chainCap, 'chain exceeds its cap.');
    return world;
}
