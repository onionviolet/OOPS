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
import {addIdentity, changeFacets, createIdentities, lineageKey, lineageOf, recordLineage, validateIdentities} from './kernel_identity.js'; // E12

export const SUBSTRATE_SCHEMA = 'oops.world-substrate';
export const SUBSTRATE_REVISION = 1;

const fail = message => { throw new Error(`World substrate: ${message}`); };
const check = (ok, message) => { if (!ok) fail(message); };
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);
const whole = n => Number.isSafeInteger(n);
const KINDS = ['place', 'body', 'thing', 'cohort']; // E12: a cohort is a counted group with shared properties
const PROPERTY_TYPES = ['flag', 'level', 'label', 'set'];
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
// Effect kinds the substrate itself publishes. `effect.<verb>` and
// `effect.<verb>.<object>` belong to the effect primitives (world_effects.js).
const BUILT_IN_KINDS = Object.freeze(['departed', 'arrived', 'law.lapsed',
    // E12: one kind per holder-lifecycle act, and the priced fault.
    'lifecycle.create', 'lifecycle.end', 'lifecycle.copy', 'lifecycle.split', 'lifecycle.merge', 'lifecycle.promote', 'lifecycle.demote',
    'lifecycle.cohort-change', 'lifecycle.fault']);
const primitiveKind = kind => /^effect\.[a-z]+(\.[a-z0-9_:.*-]+)?$/.test(kind);

export function composeSubstrate({packs, quantities = [], properties = [], effectKinds = [], dials = {}, draw = null}) {
    check(Array.isArray(packs) && packs.length, 'compose needs packs.');
    const q = new Map(), pr = new Map();
    const addQuantity = (def, owner) => {
        check(idLike(def?.id) && !def.id.includes(':') && typeof def.unit === 'string' && def.unit, `quantity needs id and unit (${owner}).`);
        const min = def.min ?? 0, max = def.max ?? Number.MAX_SAFE_INTEGER, keyed = def.keyed === true;
        check(whole(min) && whole(max) && min <= max, `quantity ${def.id} has bad bounds.`);
        const prior = q.get(def.id);
        if (prior) check(prior.unit === def.unit && prior.min === min && prior.max === max && prior.keyed === keyed,
            `quantity ${def.id} declared twice with different unit, bounds or keying (${prior.owner}, ${owner}).`);
        else q.set(def.id, Object.freeze({id: def.id, unit: def.unit, min, max, keyed, owner}));
    };
    const addProperty = (def, owner) => {
        check(idLike(def?.id) && PROPERTY_TYPES.includes(def.type), `property needs id and a type (${owner}).`);
        const shape = {type: def.type, min: def.min ?? 0, max: def.max ?? Number.MAX_SAFE_INTEGER, values: def.values ? [...def.values].sort() : null};
        const prior = pr.get(def.id);
        if (prior) check(JSON.stringify({type: prior.type, min: prior.min, max: prior.max, values: prior.values}) === JSON.stringify(shape),
            `property ${def.id} declared twice with different shapes (${prior.owner}, ${owner}).`);
        else pr.set(def.id, Object.freeze({id: def.id, ...shape, owner}));
    };
    for (const def of quantities) addQuantity(def, 'world');
    for (const def of properties) addProperty(def, 'world');
    const seen = new Set(), laws = [], reactors = [], moveChecks = [], kinds = new Set([...BUILT_IN_KINDS, ...effectKinds]);
    for (const pack of packs) for (const kind of [...(pack.publishes ?? []), ...(pack.hears ?? [])]) {
        check(typeof kind === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(kind), `pack ${pack?.id} declares a malformed effect kind (${kind}).`);
        kinds.add(kind);
    }
    for (const pack of packs) {
        check(idLike(pack?.id) && !seen.has(pack.id), 'each pack needs a unique id.');
        seen.add(pack.id);
        for (const def of pack.quantities ?? []) addQuantity(def, pack.id);
        for (const def of pack.properties ?? []) addProperty(def, pack.id);
    }
    for (const id of q.keys()) check(!pr.has(id), `${id} is both a quantity and a property.`);
    for (const pack of packs) {
        const reads = new Set([...(pack.reads ?? []), ...(pack.writes ?? [])]), writes = new Set(pack.writes ?? []);
        if (pack.checkEffectMove !== undefined) {
            // Read-only admission for position effects. Callers of raw move
            // operations still own their travel policy.
            check(typeof pack.checkEffectMove === 'function', `pack ${pack.id} needs a function for checkEffectMove.`);
            moveChecks.push(pack.checkEffectMove);
        }
        for (const name of reads) check(q.has(family(name)) || pr.has(name), `pack ${pack.id} names undeclared quantity or property ${name}.`);
        for (const law of pack.laws ?? []) {
            check(idLike(law.id) && typeof law.appliesTo === 'function', `law in ${pack.id} needs id and appliesTo.`);
            check(!law.advance === !law.horizon || !law.advance, `law ${law.id}: advance needs a horizon.`);
            laws.push(Object.freeze({pack: pack.id, law, reads, writes}));
        }
        for (const reactor of pack.reactors ?? []) {
            check(idLike(reactor.id) && Array.isArray(reactor.on) && typeof reactor.react === 'function' &&
                typeof reactor.appliesTo === 'function', `reactor in ${pack.id} needs id, on, appliesTo and react.`);
            // W-B8: a reactor on a kind nobody publishes would wait forever; say so at composition.
            for (const kind of reactor.on) check(kinds.has(kind) || primitiveKind(kind), `reactor ${pack.id}:${reactor.id} answers unknown effect kind ${kind}.`);
            reactors.push(Object.freeze({pack: pack.id, reactor, reads, writes}));
        }
    }
    // E12 (begin): a pack names the holder-lifecycle acts its laws and reactors may use, the price of
    // an act that cannot be done as asked, and whether its copies share or redraw innate traits.
    const lifecycle = new Map();
    for (const pack of packs) {
        const l = pack.lifecycle;
        if (l == null) continue;
        check(Array.isArray(l.acts) && l.acts.every(a => LIFECYCLE_ACTS.includes(a)), `pack ${pack.id}: lifecycle names acts from ${LIFECYCLE_ACTS.join(', ')}.`);
        check(l.fault == null || faultPriceOk(q, l.fault), `pack ${pack.id}: a lifecycle fault price is {quantity, amount, to?}.`);
        check(l.innate == null || INNATE.includes(l.innate), `pack ${pack.id}: innate is share or redraw.`);
        lifecycle.set(pack.id, Object.freeze({acts: Object.freeze([...l.acts]), fault: l.fault ? Object.freeze({...l.fault}) : null, innate: l.innate ?? 'share'}));
    }
    // E12 (end)
    const d = {...SUBSTRATE_DIALS, ...dials};
    for (const [k, v] of Object.entries(d)) check(whole(v) && v >= (k === 'cascadeDepth' ? 0 : 1), `dial ${k} must be a whole number.`);
    return Object.freeze({quantities: q, properties: pr, effectKinds: Object.freeze(kinds), packs: Object.freeze(packs.map(p => p.id)), laws, reactors,
        moveChecks: Object.freeze(moveChecks), dials: Object.freeze(d),
        draw: checkDraw(draw), /* E11 saved dice */ lifecycle /* E12 */});
}

// ---- E11 saved dice (proposal): begin ----
// The substrate keeps no dice of its own. Whoever composes it may pass `draw(pack, address)`,
// a pure function of a saved root and the address (engine_world.js does). A pack law reads it
// as `view.draw(address)`: the value depends on the root, the pack and the address alone, so
// settlement order, jump size and a save and restore cannot change it. An address is a list of
// strings and whole numbers the law chooses: a holder, a purpose, and the minute or period
// when the draw is of a moment.
// Lineage: `drawKey` is the name a holder's innate draws go by. It is the holder's id unless
// the holder carries `refs.draws`, which a copy act sets to the original's key so a clone
// shares the original's innate draws; leaving it off is the dial for an independent copy.
// Draws of a moment (does the gust hit today) use the holder's own id, so copies fare apart.
export const drawKeyOf = holder => holder?.refs?.draws ?? holder?.id ?? null;
const checkDraw = draw => { check(draw == null || typeof draw === 'function', 'draw is a function of (pack, address).'); return draw ?? null; };
const viewDraws = (rules, world, pack) => ({
    draw: address => {
        check(rules.draw, `pack ${pack} asked for a draw, and this world was composed without a draw root.`);
        const drawn = rules.draw(pack, address);
        check(Number.isInteger(drawn) && drawn >= 0 && drawn <= 0xffffffff, 'a draw is a whole number below 2^32.');
        return drawn;
    },
    drawKey: id => drawKeyOf(world.holders[id]),
});
// ---- E11 saved dice: end ----

// A keyed quantity is a family: `energy:primeval.rank1`, `stock:bread`. The
// family carries unit and bounds; the key names the kind (WSC2).
const family = name => typeof name === 'string' ? name.split(':')[0] : name;
const keyOk = name => !name.includes(':') || /^[a-z][a-z0-9_.-]*:[a-z0-9][a-z0-9_.-]*$/i.test(name);
export function quantityDef(rules, name) {
    const def = rules.quantities.get(family(name));
    if (!def || !keyOk(name) || def.keyed !== name.includes(':')) return null;
    return def;
}
// A declaration of the family covers every key; a keyed name covers only itself.
const declares = (set, name) => set.has(name) || set.has(family(name));

function checkProperty(rules, name, value, where) {
    const def = rules.properties.get(name);
    check(def, `${where}: undeclared property ${name}.`);
    const ok = def.type === 'flag' ? typeof value === 'boolean'
        : def.type === 'level' ? whole(value) && value >= def.min && value <= def.max
        : def.type === 'label' ? typeof value === 'string' && (!def.values || def.values.includes(value))
        : Array.isArray(value) && value.every(v => typeof v === 'string' && (!def.values || def.values.includes(v))) && new Set(value).size === value.length;
    check(ok, `${where}: ${name} has a bad value.`);
    return def.type === 'set' ? [...value].sort() : value;
}

// ---------- holders, ledger, chain ----------

function makeHolder(rules, h) {
    check(idLike(h?.id) && KINDS.includes(h.kind), `holder needs id and kind (${h?.id}).`);
    check(h.kind === 'place' ? h.place == null : idLike(h.place), `holder ${h.id}: places have no place; bodies and things sit in one.`);
    const quantities = {};
    for (const [name, amount] of Object.entries(h.quantities ?? {})) {
        const def = quantityDef(rules, name);
        check(def, `holder ${h.id} carries undeclared quantity ${name}.`);
        check(whole(amount) && amount >= def.min && amount <= def.max, `holder ${h.id}: ${name} out of bounds.`);
        quantities[name] = amount;
    }
    check(h.detail == null || (h.kind === 'place' && ['near', 'far'].includes(h.detail)), `holder ${h.id}: detail is near or far, on places.`);
    const properties = {};
    for (const [name, value] of Object.entries(h.properties ?? {})) properties[name] = checkProperty(rules, name, value, `holder ${h.id}`);
    // Identity (SC7, SB1): one holder id; `as` lists the kinds it can be bound as
    // (item, body, gu); `refs` points at the records other owners keep for it.
    const as = [...new Set(h.as ?? [])].sort(), refs = {...(h.refs ?? {})};
    check(as.every(idLike) && Object.entries(refs).every(([k, v]) => idLike(k) && typeof v === 'string' && v), `holder ${h.id}: bad identity.`);
    // E12: a cohort counts its members; other kinds carry no count.
    check(h.kind === 'cohort' ? whole(h.count ?? 0) && (h.count ?? 0) >= 0 : h.count == null, `holder ${h.id}: a cohort has a whole count; other kinds have none.`);
    return {id: h.id, kind: h.kind, place: h.place ?? null, tags: [...(h.tags ?? [])].sort(), as, refs,
        ...(h.detail ? {detail: h.detail} : {}), ...(h.kind === 'cohort' ? {count: h.count ?? 0} : {}) /* E12 */, quantities, properties,
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
    const def = quantityDef(rules, name);
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
        holder: id => { const h = holder(id); return h && Object.freeze({id: h.id, kind: h.kind, place: h.place, tags: h.tags, as: h.as}); },
        // Properties are what laws test instead of categories (PFP22, SB2).
        property: (id, name) => structuredClone(holder(id)?.properties[name] ?? null),
        properties: id => structuredClone(holder(id)?.properties ?? {}),
        has: (id, name) => !!holder(id) && name in holder(id).quantities,
        amount: (id, name) => { const h = holder(id); check(h && name in h.quantities, `${id} does not carry ${name}.`); return h.quantities[name]; },
        state: id => structuredClone(holder(id)?.state[pack] ?? null),
        placeOf: id => { const h = holder(id); return !h ? null : h.kind === 'place' ? h.id : h.place; },
        present: place => Object.keys(world.holders).filter(id => world.holders[id].place === place).sort(byId),
        // >>> E10 place graph: every pack reads the same links. opts: {kinds, weights, closed, maxLinks, maxCost, also}
        links: () => structuredClone(worldLinks(world)),
        exits: (place, opts) => linkExits(linksFor(world, opts), place, opts),
        neighbours: (place, opts) => linkNeighbours(linksFor(world, opts), place, opts),
        distance: (from, to, opts) => linkDistance(linksFor(world, opts), from, to, opts),
        within: (from, opts) => linksWithin(linksFor(world, opts), from, opts),
        // <<< E10 place graph
        // E12: members of a cohort, and a holder's lineage rows and trait address.
        count: id => holder(id)?.count ?? null,
        lineage: id => readLineage(world, id),
        lineageKey: id => readLineageKey(world, id),
        // Nearest scope first: the holder, then its place, then the world.
        lawFields: (id, kind) => {
            const h = holder(id), scopes = [id, h?.kind === 'place' ? null : h?.place, 'world'].filter(Boolean);
            return scopes.flatMap(s => world.laws.filter(f => f.scope === s && f.kind === kind)).map(f => structuredClone(f));
        },
        ...viewDraws(rules, world, pack), // E11 saved dice
    });
}

// ---------- E12 holder lifecycle (begin) ----------
//
// Birth, death, copy, split, merge and a cohort becoming individuals and back
// are world acts: {op: 'lifecycle', act, ...}. A pack law or reactor may use the
// acts its pack declares (`lifecycle: {acts, fault, innate}`); an outside caller
// or a landed effect may use any. Acts that change identities write lineage into
// `world.identity` (kernel_identity.js). Each act hands quantities to a holder or a named row in
// `world.rows`, and publishes `lifecycle.<act>` where it happened. An act that
// cannot be done as asked changes nothing else, charges the fault price from
// the pack's or the op's data and publishes `lifecycle.fault` with the reason
// and a way around. A malformed op (no id, an unknown act) is a contract error
// and throws like any other op.
//
//   create  {value: {id, kind, place?, quantities?, ...}, parents?, from?, allowRetiredParents?}
//   copy    {holder, value: {id, ...overrides}, from?, innate?: 'share' | 'redraw'}
//   end     {holder, remains?: {id, ...}, to?, routes?}
//   split   {holder, into: [{id, share, ...overrides}], keep?, to?}
//   merge   {holders, value: {id, ...} | into: id, to?, routes?}
//   promote {holder: cohort, ids, kind?, value?, to?}
//   demote  {holders, into: cohort, to?, routes?}
//   cohort-change {holder: cohort, delta, quantities?: {name: amount}, row}
//   Count changes draw from (birth) or credit (loss) the named row.
//
// `from` lists where a new holder's starting amounts come from, in order:
// holder ids, then `row:<name>` for the rest (default `row:lifecycle.made`).
// `to` lists who takes what the act's own heir does not: holder ids take the
// quantities they already carry, `row:<name>` takes anything; whatever is left
// lands on `row:lifecycle.unclaimed`. `routes` names a list per quantity.
// A row amount is what left the holders through it; a source row runs negative.
export const LIFECYCLE_ACTS = Object.freeze(['create', 'end', 'copy', 'split', 'merge', 'promote', 'demote', 'cohort-change']);
const INNATE = ['share', 'redraw'];
const LIFECYCLE_WAYS = Object.freeze({
    'id-taken': 'name an id no holder, living or ended, has used',
    'no-holder': 'name holders that exist at this minute',
    'no-place': 'give the new holder a place that exists',
    short: 'name a row among the sources, or ask for less',
    occupied: 'move what the place holds first, or keep a share of the place',
    'not-cohort': 'make a cohort with create, or merge instead',
});
const faultPriceOk = (quantities, f) => typeof f?.quantity === 'string' && quantities.has(family(f.quantity)) && whole(f.amount) && f.amount >= 0 &&
    (f.to == null || (typeof f.to === 'string' && f.to));
const clampTo = (def, n) => Math.min(def.max, Math.max(def.min, n));

function rowAdd(world, row, name, amount) {
    if (!amount) return;
    check(idLike(row), `a named row needs an id (${row}).`);
    const r = (world.rows ??= {})[row] ??= {};
    r[name] = (r[name] ?? 0) + amount;
}
function knownIdentity(world, id, cause) {
    world.identity ??= createIdentities();
    if (!Object.hasOwn(world.identity.entries, id))
        world.identity = addIdentity(world.identity, {id, facets: {holder: {owner: 'world', key: id}}, at: world.clock, cause});
}
function lineageRow(world, id, row, cause) {
    knownIdentity(world, id, cause);
    world.identity = recordLineage(world.identity, id, {...row, at: world.clock, cause});
}
function retireIdentity(world, id, cause) {
    if (Object.hasOwn(world.identity.entries[id].facets, 'holder'))
        world.identity = changeFacets(world.identity, id, {remove: ['holder'], at: world.clock, cause});
}
function lineageForAdd(world, id, lineage, cause) {
    const parents = lineage.parents ?? [];
    check(Array.isArray(parents) && parents.every(idLike), 'holder_add lineage names parent ids.');
    lineageRow(world, id, {act: lineage.act ?? 'create', parents, traitKey: id, ...(lineage.note ? {note: lineage.note} : {})}, cause);
}
// A quantity newly carried starts at zero, or at the nearest bound with the difference on a named row.
function carryFor(rules, world, h, name) {
    if (name in h.quantities) return;
    const start = clampTo(quantityDef(rules, name), 0);
    h.quantities[name] = start;
    credit(rules, h, name, 'lifecycle:bound', start);
    rowAdd(world, 'lifecycle.bound', name, -start);
}
// Take up to `amount` from a holder that stays, down to the quantity's floor.
function takeFrom(rules, h, name, amount, source) {
    const got = Math.max(0, Math.min(amount, h.quantities[name] - quantityDef(rules, name).min));
    h.quantities[name] -= got;
    credit(rules, h, name, source, -got);
    return got;
}
// Hand `amount` down the destinations. `heirs` are holders this act made or chose: they start carrying what they are handed.
function handOn(rules, world, name, amount, dests, heirs, source) {
    let left = amount;
    for (const d of dests) {
        if (!left) return;
        check(typeof d === 'string' && d, 'a destination is a holder id or row:<name>.');
        if (d.startsWith('row:')) { rowAdd(world, d.slice(4), name, left); return; }
        const h = world.holders[d];
        if (!h || (!(name in h.quantities) && !heirs.includes(d))) continue;
        carryFor(rules, world, h, name);
        const before = h.quantities[name], after = clampTo(quantityDef(rules, name), before + left);
        h.quantities[name] = after;
        credit(rules, h, name, source, after - before);
        left -= after - before;
    }
    rowAdd(world, 'lifecycle.unclaimed', name, left);
}

function lifecycleAct(rules, world, op, ctx, queue) {
    check(LIFECYCLE_ACTS.includes(op.act), `unknown lifecycle act ${op.act}.`);
    const decl = ctx.pack ? rules.lifecycle.get(ctx.pack) : null;
    check(!ctx.pack || decl?.acts.includes(op.act), `pack ${ctx.pack} does not declare the lifecycle act ${op.act}.`);
    check(op.fault == null || faultPriceOk(rules.quantities, op.fault), 'a lifecycle fault price is {quantity, amount, to?}.');
    const H = id => world.holders[id], act = op.act, cause = ctx.source, source = `lifecycle:${act}`;
    const taken = id => !!H(id) || Object.hasOwn(world.identity?.entries ?? {}, id);
    const placeOf = id => H(id)?.kind === 'place' ? id : H(id)?.place ?? null;
    const occupied = id => H(id).kind === 'place' && Object.values(world.holders).some(x => x.place === id);
    const key = id => readLineageKey(world, id);
    const effect = (kind, place, detail) => queue.push({kind, place, quantity: null, amount: 0, detail,
        by: op.by ?? ctx.by ?? ctx.source, depth: ctx.depth ?? 0, cause: ctx.parent ?? ctx.cause ?? null});
    const done = (place, detail) => effect(`lifecycle.${act}`, place, {act, ...detail});
    const fault = (reason, payerId) => {
        const price = op.fault ?? decl?.fault ?? null, payer = H(op.payer ?? payerId);
        let paid = 0;
        if (price && payer && price.quantity in payer.quantities) {
            paid = takeFrom(rules, payer, price.quantity, price.amount, `${source}:fault`);
            handOn(rules, world, price.quantity, paid, [price.to ?? 'row:lifecycle.fault'], [], `${source}:fault:${payer.id}`);
        }
        effect('lifecycle.fault', payer ? placeOf(payer.id) : null, {act, reason, way: LIFECYCLE_WAYS[reason],
            price: price ? {quantity: price.quantity, asked: price.amount, paid, payer: payer?.id ?? null} : null});
    };
    const dests = (name, heirs) => [...heirs, ...(op.routes?.[name] ?? op.to ?? [])];
    // Everything a leaving holder carries goes on: the heirs first, then the op's list, then the unclaimed row.
    const empty = (h, heirs) => {
        for (const [name, amount] of Object.entries(h.quantities)) {
            handOn(rules, world, name, amount, op.routes?.[name] ? op.routes[name] : dests(name, heirs), heirs, `${source}:${h.id}`);
            h.quantities[name] = 0;
        }
    };
    // Law fields scoped to a leaving holder follow its heir, or lapse with it.
    const remove = (id, heir) => {
        world.laws = world.laws.flatMap(f => f.scope !== id ? [f] : heir ? [{...f, scope: heir}] : []);
        knownIdentity(world, id, cause);
        retireIdentity(world, id, cause);
        delete world.holders[id];
    };
    // A new holder shaped like `like` (kind, place, tags, properties and pack state, so a design kept as state goes along).
    const shaped = (like, spec) => makeHolder(rules, {kind: like.kind, place: like.place, tags: like.tags, as: like.as,
        properties: like.properties, state: like.state, ...(like.kind === 'cohort' ? {count: 0} : {}), ...spec, quantities: {}});
    const fresh = ids => ids.every(idLike) && new Set(ids).size === ids.length && !ids.some(taken);

    switch (act) {
    case 'cohort-change': {
        const cohort = H(op.holder), {delta, quantities = {}, row} = op;
        if (!cohort) return fault('no-holder');
        if (cohort.kind !== 'cohort') return fault('not-cohort', cohort.id);
        check(whole(delta) && delta !== 0 && idLike(row), 'cohort-change needs a signed count and a named quantity row.');
        const count = cohort.count + delta;
        if (!whole(count) || count < 0) return fault('short', cohort.id);
        const amounts = Object.entries(quantities);
        for (const [name, amount] of amounts) {
            const def = quantityDef(rules, name);
            check(Object.hasOwn(cohort.quantities, name) && whole(amount) && amount >= 0,
                'cohort-change moves whole amounts of quantities carried by the cohort.');
            const after = cohort.quantities[name] + Math.sign(delta) * amount;
            const balance = (world.rows?.[row]?.[name] ?? 0) - Math.sign(delta) * amount;
            if (!whole(after) || !whole(balance) || after < def.min || after > def.max) return fault('short', cohort.id);
        }
        for (const [name, amount] of amounts) {
            const moved = Math.sign(delta) * amount;
            addAmount(rules, cohort, name, moved, `${source}:${row}`);
            rowAdd(world, row, name, -moved);
        }
        cohort.count = count;
        return done(cohort.place, {id: cohort.id, delta, count, row, quantities});
    }
    case 'create': case 'copy': {
        const src = act === 'copy' ? H(op.holder) : null;
        if (act === 'copy' && !src) return fault('no-holder');
        const parents = act === 'copy' ? [src.id] : op.parents ?? [];
        check(Array.isArray(parents) && idLike(op.value?.id), `${act} needs a value with an id.`);
        if (!fresh([op.value.id])) return fault('id-taken', parents.find(H));
        if (parents.some(p => !H(p) && !(act === 'create' && op.allowRetiredParents === true &&
            Object.hasOwn(world.identity?.entries ?? {}, p)))) return fault('no-holder', parents.find(H));
        const v = src ? {kind: src.kind, tags: src.tags, as: src.as, properties: src.properties, state: src.state,
            ...(src.kind === 'cohort' ? {count: src.count} : {}), quantities: src.quantities, ...op.value} : op.value;
        const place = v.kind === 'place' ? null : v.place ?? (src ? src.place : placeOf(parents[0]));
        if (v.kind !== 'place' && H(place)?.kind !== 'place') return fault('no-place', parents.find(H));
        const amounts = Object.entries(v.quantities ?? {}), from = op.from ?? ['row:lifecycle.made'];
        check(Array.isArray(from) && from.every(s => typeof s === 'string' && s), 'sources are holder ids or row:<name>.');
        const hasRow = from.some(s => s.startsWith('row:'));
        for (const [name, need] of amounts) {
            const def = quantityDef(rules, name);
            check(def && whole(need) && need >= def.min && need <= def.max, `${act}: ${name} is undeclared or out of bounds.`);
        }
        const short = ([name, need]) => !hasRow && (need < 0 || need > from.reduce((n, s) =>
            n + (H(s) && name in H(s).quantities ? H(s).quantities[name] - quantityDef(rules, name).min : 0), 0));
        if (amounts.some(short)) return fault('short', parents.find(H));
        const made = makeHolder(rules, {...v, place, quantities: {}});
        world.holders[made.id] = made;
        for (const [name, need] of amounts) {
            made.quantities[name] = 0;
            let left = need;
            for (const s of from) {
                if (!left) break;
                let got = left;
                if (s.startsWith('row:')) rowAdd(world, s.slice(4), name, -left);
                else if (H(s) && s !== made.id && name in H(s).quantities && left > 0) got = takeFrom(rules, H(s), name, left, `${source}:${made.id}`);
                else continue;
                made.quantities[name] += got;
                credit(rules, made, name, `${source}:${s}`, got);
                left -= got;
            }
        }
        const innate = act === 'copy' ? op.innate ?? decl?.innate ?? 'share' : null;
        check(innate == null || INNATE.includes(innate), 'innate is share or redraw.');
        lineageRow(world, made.id, {act, parents, ...(innate ? {innate} : {}),
            traitKey: innate === 'share' ? key(src.id) : made.id, ...(op.note ? {note: op.note} : {})}, cause);
        for (const p of parents) lineageRow(world, p, {act, role: act === 'copy' ? 'source' : 'parent', into: [made.id]}, cause);
        return done(place ?? made.id, {id: made.id, parents});
    }
    case 'end': {
        const h = H(op.holder), r = op.remains;
        if (!h) return fault('no-holder');
        if (occupied(h.id)) return fault('occupied', h.id);
        if (r && !fresh([r.id])) return fault('id-taken', h.id);
        const place = h.kind === 'place' ? r?.place ?? null : h.place;
        if (r && H(place)?.kind !== 'place') return fault('no-place', h.id);
        let heir = null;
        if (r) {
            heir = makeHolder(rules, {kind: 'thing', tags: h.tags, properties: h.properties, state: h.state, refs: h.refs, ...r, place, quantities: {}});
            world.holders[heir.id] = heir;
        }
        const traitKey = key(h.id), heirs = heir ? [heir.id] : [];
        empty(h, heirs);
        lineageRow(world, h.id, {act, into: heirs, ...(h.kind === 'cohort' ? {count: h.count} : {})}, cause);
        remove(h.id, heir?.id);
        if (heir) lineageRow(world, heir.id, {act, role: 'remains', parents: [h.id], traitKey}, cause);
        return done(place, {id: h.id, remains: heir?.id ?? null});
    }
    case 'split': {
        const h = H(op.holder), parts = op.into, keep = op.keep ?? 0;
        check(Array.isArray(parts) && parts.length && parts.every(p => idLike(p?.id) && whole(p.share) && p.share > 0) && whole(keep) && keep >= 0,
            'split needs parts with an id and a whole share, and a whole keep.');
        if (!h) return fault('no-holder');
        if (!keep && occupied(h.id)) return fault('occupied', h.id);
        if (!fresh(parts.map(p => p.id))) return fault('id-taken', h.id);
        const all = keep + parts.reduce((n, p) => n + p.share, 0), traitKey = key(h.id), ids = parts.map(p => p.id);
        const before = {...h.quantities}, members = h.count ?? null;
        for (const {share, ...spec} of parts) world.holders[spec.id] = shaped(h, spec);
        // Each part takes floor(amount * share / all shares). What the floors leave stays with a kept holder, else goes to the first part.
        for (const p of parts) {
            for (const [name, total] of Object.entries(before)) {
                const part = Math.floor(total * p.share / all);
                const got = keep ? takeFrom(rules, h, name, part, `${source}:${p.id}`) : part;
                if (!keep) h.quantities[name] -= got;
                handOn(rules, world, name, got, dests(name, [p.id]), [p.id], `${source}:${h.id}`);
            }
            if (members != null && H(p.id).kind === 'cohort') { const n = Math.floor(members * p.share / all); H(p.id).count = n; h.count -= n; }
        }
        lineageRow(world, h.id, {act, into: ids, kept: keep > 0}, cause);
        for (const p of parts) lineageRow(world, p.id, {act, parents: [h.id], share: p.share, of: all, traitKey}, cause);
        if (!keep) {
            if (members != null && H(ids[0]).kind === 'cohort') H(ids[0]).count += h.count;
            empty(h, [ids[0]]);
            remove(h.id, ids[0]);
        }
        return done(placeOf(ids[0]), {id: h.id, into: ids, kept: keep > 0});
    }
    case 'merge': case 'demote': {
        const ids = op.holders;
        check(Array.isArray(ids) && ids.length && new Set(ids).size === ids.length && (op.into != null || idLike(op.value?.id)),
            `${act} needs holders and a value with an id, or an existing holder \`into\`.`);
        const payer = ids.find(H);
        if (ids.some(id => !H(id)) || (op.into != null && !H(op.into))) return fault('no-holder', payer);
        if (act === 'demote' && H(op.into)?.kind !== 'cohort') return fault('not-cohort', payer);
        const leaving = ids.filter(id => id !== op.into);
        if (op.into == null && !fresh([op.value.id])) return fault('id-taken', payer);
        if (leaving.some(occupied)) return fault('occupied', payer);
        const first = H(ids[0]);
        const t = op.into != null ? H(op.into) : world.holders[op.value.id] = shaped(first, {refs: first.refs, ...op.value});
        const traitKey = op.into != null ? key(t.id) : t.id;
        for (const id of leaving) {
            const h = H(id);
            empty(h, [t.id]);
            if (t.kind === 'cohort') t.count += h.count ?? 1;
            lineageRow(world, id, {act, into: [t.id]}, cause);
            remove(id, t.id);
        }
        lineageRow(world, t.id, {act, parents: leaving, traitKey, ...(t.kind === 'cohort' ? {count: t.count} : {})}, cause);
        return done(placeOf(t.id), {id: t.id, parents: leaving});
    }
    case 'promote': {
        const c = H(op.holder), ids = op.ids;
        check(Array.isArray(ids) && ids.length && ids.every(idLike), 'promote names the ids of the individuals to take out.');
        if (!c) return fault('no-holder');
        if (c.kind !== 'cohort') return fault('not-cohort', c.id);
        if (!fresh(ids)) return fault('id-taken', c.id);
        if (ids.length > c.count) return fault('short', c.id);
        // Each individual takes one head's share, floor(amount / count); what the floors leave stays with the cohort.
        const head = Object.fromEntries(Object.entries(c.quantities).map(([name, total]) => [name, Math.floor(total / c.count)]));
        const traitKey = key(c.id), serial = readLineage(world, c.id).reduce((n, row) => n + (row.act === 'promote' ? row.into.length : 0), 0);
        ids.forEach((id, i) => {
            world.holders[id] = shaped(c, {kind: op.kind ?? 'body', count: undefined, ...op.value, id});
            for (const [name, part] of Object.entries(head))
                handOn(rules, world, name, takeFrom(rules, c, name, part, `${source}:${id}`), [id, c.id, ...dests(name, [])], [id], `${source}:${c.id}`);
            // The lineage key the saved-dice lane draws this individual's innate traits by: the cohort's key and a serial.
            lineageRow(world, id, {act, parents: [c.id], traitKey: `${traitKey}/${serial + i + 1}`}, cause);
        });
        c.count -= ids.length;
        lineageRow(world, c.id, {act, into: [...ids], count: c.count}, cause);
        return done(c.place, {id: c.id, into: [...ids]});
    }
    default: return fail(`unhandled lifecycle act ${act}.`);
    }
}
// ---------- E12 holder lifecycle (end) ----------

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
            check(!ctx.writes || declares(ctx.writes, op.quantity), `pack ${ctx.pack} does not declare writing ${op.quantity}.`);
            const amount = op.op === 'set' ? op.amount - (h.quantities[op.quantity] ?? 0) : op.amount;
            addAmount(rules, h, op.quantity, amount, op.source ?? ctx.source);
            break;
        }
        case 'property': {
            check(h, `property op on unknown holder ${op.holder}.`);
            check(!ctx.writes || ctx.writes.has(op.property), `pack ${ctx.pack} does not declare writing ${op.property}.`);
            if (op.value == null) delete h.properties[op.property];
            else h.properties[op.property] = checkProperty(rules, op.property, op.value, `holder ${h.id}`);
            break;
        }
        case 'carry': {
            check(h && quantityDef(rules, op.quantity), 'carry needs a holder and a declared quantity.');
            check(!(op.quantity in h.quantities), `${h.id} already carries ${op.quantity}.`);
            const def = quantityDef(rules, op.quantity), amount = op.amount ?? Math.max(def.min, 0);
            check(whole(amount) && amount >= def.min && amount <= def.max, 'carry amount out of bounds.');
            h.quantities[op.quantity] = amount;
            break;
        }
        case 'publish': {
            check(typeof op.kind === 'string' && world.holders[op.place]?.kind === 'place', 'publish needs a kind and a place.');
            check(rules.effectKinds.has(op.kind) || primitiveKind(op.kind), `effect kind ${op.kind} is not declared (a pack's publishes, or composeSubstrate effectKinds).`);
            if (op.quantity != null) check(quantityDef(rules, op.quantity) && whole(op.amount), 'an effect on a quantity needs a whole amount.');
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
            // E12: an outside caller may say what the new holder came from.
            if (op.lineage) lineageForAdd(world, made.id, op.lineage, ctx.source);
            break;
        }
        case 'holder_remove': {
            check(!ctx.pack && h, 'only outside callers remove holders.');
            check(!Object.values(world.holders).some(x => x.place === h.id), `place ${h.id} still holds things.`);
            // E12: what the holder carried goes to a named row instead of vanishing.
            for (const [name, amount] of Object.entries(h.quantities)) rowAdd(world, 'holder.removed', name, amount);
            if (world.identity && Object.hasOwn(world.identity.entries, h.id)) retireIdentity(world, h.id, ctx.source);
            delete world.holders[h.id];
            break;
        }
        case 'lifecycle': lifecycleAct(rules, world, op, ctx, queue); break; // E12
        case 'law_add': {
            const f = op.field;
            check(idLike(f?.id) && idLike(f.kind) && (f.scope === 'world' || world.holders[f.scope]), 'law field needs id, kind and a scope.');
            check(!world.laws.some(x => x.id === f.id), `law field ${f.id} exists.`);
            // `until` (a later whole minute) makes the field lapse at that boundary: sustained effects end by time.
            check(f.until == null || (whole(f.until) && f.until > world.clock), `law field ${f.id}: until is a later minute.`);
            world.laws.push({id: f.id, scope: f.scope, kind: f.kind, params: structuredClone(f.params ?? {}), source: f.source ?? ctx.source ?? null,
                ...(f.until != null ? {until: f.until} : {})});
            world.laws.sort((a, b) => byId(a.id, b.id));
            break;
        }
        case 'law_remove':
            check(world.laws.some(x => x.id === op.id), `no law field ${op.id}.`);
            world.laws = world.laws.filter(x => x.id !== op.id);
            break;
        case 'law_params': {
            const f = world.laws.find(x => x.id === op.id);
            check(f, `no law field ${op.id}.`);
            f.params = {...f.params, ...structuredClone(op.params ?? {})};
            break;
        }
        // >>> E10 place graph: links are world data; opening, closing and rerouting are ops
        case 'link_add': {
            const link = normalizeLink(op.link);
            check(!(world.links ?? []).some(x => x.id === link.id), `link ${link.id} exists.`);
            world.links = [...(world.links ?? []), link].sort((a, b) => byId(a.id, b.id));
            break;
        }
        case 'link_set': {
            const at = (world.links ?? []).findIndex(x => x.id === op.id);
            check(at >= 0, `no link ${op.id}.`);
            const {op: ignored, id, ...changes} = op;
            world.links[at] = normalizeLink({...world.links[at], ...structuredClone(changes), id});
            if (changes.force === null) delete world.links[at].force;
            break;
        }
        case 'link_remove':
            check((world.links ?? []).some(x => x.id === op.id), `no link ${op.id}.`);
            world.links = world.links.filter(x => x.id !== op.id);
            if (!world.links.length) delete world.links;
            break;
        // <<< E10 place graph
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
            ...(e.detail != null ? {detail: structuredClone(e.detail)} : {}),
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

export function createWorld(rules, {clock = 0, holders = [], lawFields = [], links = []} = {}) { // E10: links
    check(whole(clock) && clock >= 0, 'clock must be whole minutes.');
    // A new world counts its first minute as decided: nothing fires at creation.
    const world = {schema: SUBSTRATE_SCHEMA, revision: SUBSTRATE_REVISION, clock, decidedAt: clock, seq: 0, holders: {}, laws: [], chain: []};
    applyOps(rules, world, holders.map(value => ({op: 'holder_add', value})), {source: 'create'}, []);
    applyOps(rules, world, lawFields.map(field => ({op: 'law_add', field})), {source: 'create'}, []);
    applyOps(rules, world, links.map(link => ({op: 'link_add', link})), {source: 'create'}, []); // E10 place graph
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

function expireLaws(rules, world) {
    const due = world.laws.filter(f => f.until != null && f.until <= world.clock);
    if (!due.length) return;
    world.laws = world.laws.filter(f => !due.includes(f));
    const queue = [];
    for (const f of due) {
        const place = f.scope === 'world' ? null : world.holders[f.scope]?.kind === 'place' ? f.scope : world.holders[f.scope]?.place;
        if (place) queue.push({kind: 'law.lapsed', place, quantity: null, amount: 0, detail: {id: f.id, kind: f.kind, scope: f.scope},
            by: f.source ?? 'law', depth: 0, cause: null});
    }
    settleContact(rules, world, queue);
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
        if (world.decidedAt !== world.clock) { expireLaws(rules, world); decideAll(rules, world); world.decidedAt = world.clock; }
        if (world.clock >= toClock) break;
        if (segments >= rules.dials.segmentBudget) return {world: validateWorld(rules, world), segments, pending: true};
        const laws = applicable(rules, world);
        // Net per-minute rate on each (holder, quantity), and who contributes it.
        const flows = new Map();
        for (const l of laws) for (const r of l.law.rates?.(l.view, l.id) ?? []) {
            check(declares(l.writes, r.quantity), `pack ${l.pack} does not declare writing ${r.quantity}.`);
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
            const f = flows.get(`${holder}\u0000${name}`), v = world.holders[holder].quantities[name], def = quantityDef(rules, name);
            if (!f?.net || (f.net > 0 && v >= def.max) || (f.net < 0 && v <= def.min)) return 0;
            return f.net;
        };
        // Stay inside bounds: a step that would overshoot is a single clamped minute.
        for (const f of flows.values()) {
            const r = effective(f.holder, f.quantity);
            if (!r) continue;
            const v = world.holders[f.holder].quantities[f.quantity], def = quantityDef(rules, f.quantity);
            k = Math.min(k, Math.max(1, Math.floor((r > 0 ? def.max - v : v - def.min) / Math.abs(r))));
        }
        for (const f of world.laws) if (f.until != null) k = Math.min(k, f.until - world.clock);
        for (const l of laws) {
            for (const w of l.law.watches?.(l.view, l.id) ?? []) {
                check(declares(l.reads, w.quantity), `pack ${l.pack} does not declare reading ${w.quantity}.`);
                if (!world.holders[w.holder] || !(w.quantity in world.holders[w.holder].quantities)) continue;
                k = Math.min(k, linearFlip(world.holders[w.holder].quantities[w.quantity], effective(w.holder, w.quantity), w.op, w.value, k));
            }
            if (l.law.horizon) {
                const hz = l.law.horizon(l.view, l.id);
                check(hz === Infinity || (whole(hz) && hz >= 1), `law ${l.law.id}: horizon is whole minutes >= 1.`);
                k = Math.min(k, hz);
            }
        }
        // Closed-form laws settle their k minutes reading the world as the segment starts. An `add` to a
        // quantity the pack declares is the law's own total for the segment: it joins the rates on that
        // quantity, so the bound clamps the sum once and the ledger credits the law (WSC4).
        const closed = laws.filter(l => l.law.advance).map(l => ({l, source: `${l.pack}:${l.law.id}:${l.id}`, ops: l.law.advance(l.view, l.id, k) ?? []}));
        for (const {l, source, ops} of closed) for (const op of ops) {
            if (op.op !== 'add') continue;
            check(declares(l.writes, op.quantity), `pack ${l.pack} does not declare writing ${op.quantity}.`);
            check(world.holders[op.holder] && op.quantity in world.holders[op.holder].quantities && whole(op.amount), `${op.holder} does not carry ${op.quantity}.`);
            const key = `${op.holder}\u0000${op.quantity}`;
            const f = flows.get(key) ?? {holder: op.holder, quantity: op.quantity, net: 0, parts: []};
            f.total = (f.total ?? 0) + op.amount; f.parts.push({source, total: op.amount});
            flows.set(key, f);
        }
        for (const f of flows.values()) {
            const h = world.holders[f.holder];
            const before = h.quantities[f.quantity], change = f.net * k + (f.total ?? 0);
            for (const p of f.parts) credit(rules, h, f.quantity, p.source, p.total ?? p.perMinute * k);
            const def = quantityDef(rules, f.quantity);
            h.quantities[f.quantity] = Math.min(def.max, Math.max(def.min, before + change));
            credit(rules, h, f.quantity, 'bound', h.quantities[f.quantity] - before - change);
        }
        for (const {l, source, ops} of closed)
            applyOps(rules, world, ops.filter(op => op.op !== 'add'), {pack: l.pack, writes: new Set(), source}, []);
        world.clock += k;
        segments++;
    }
    return {world: validateWorld(rules, world), segments, pending: false};
}

// ---------- reading ----------

// E12 readers (begin)
/** Lineage rows of a holder, living or ended: [{at, act, parents?, into?, traitKey?, cause, ...}]. */
export const readLineage = (world, id) => world.identity ? lineageOf(world.identity, id) : [];
/** The address the saved-dice lane draws innate traits by. A copy that shares traits has its source's key. */
export const readLineageKey = (world, id) => world.identity ? lineageKey(world.identity, id) : id;
/** Held amounts summed over holders, the named source and sink rows, and their sum. A lifecycle act leaves `total` unchanged. */
export function readTotals(world) {
    const held = {}, total = {};
    for (const h of Object.values(world.holders)) for (const [name, amount] of Object.entries(h.quantities)) held[name] = (held[name] ?? 0) + amount;
    Object.assign(total, held);
    for (const row of Object.values(world.rows ?? {})) for (const [name, amount] of Object.entries(row)) total[name] = (total[name] ?? 0) + amount;
    return {held, rows: structuredClone(world.rows ?? {}), total};
}
// E12 readers (end)

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

/** SC7 identity: the holder a kernel binding `{kind, id}` names. It matches the
 * holder id or a ref another owner keeps (an inventory key, a lifecycle id), and
 * the holder must be bindable as that kind (`as`, or its physical kind). */
export function resolveRef(world, ref) {
    if (!ref || typeof ref.kind !== 'string' || typeof ref.id !== 'string') return null;
    const fits = h => h.as.includes(ref.kind) || h.kind === ref.kind;
    const direct = world.holders[ref.id];
    if (direct && fits(direct)) return direct.id;
    const found = Object.values(world.holders).filter(h => h.refs[ref.kind] === ref.id).map(h => h.id).sort(byId);
    check(found.length <= 1, `two holders claim ${ref.kind} ${ref.id}.`);
    return found[0] ?? null;
}

/** A `ports.read(ref, at)` for the kernel working over this world (K's KW3).
 * It answers for the world's own minute only; a host settles the world to the
 * step's time first (KW6, KW13). */
export function substratePort(world) {
    return (ref, at) => {
        check(at == null || at === world.clock, `substrate port asked for minute ${at} but the world is at ${world.clock}.`);
        const id = resolveRef(world, ref);
        if (!id) return null;
        const h = world.holders[id];
        return Object.freeze({kind: ref.kind, id: ref.id, holder: h.id, place: h.place, as: [...h.as],
            quantities: {...h.quantities}, properties: structuredClone(h.properties)});
    };
}

/** Scarcity is derived, never stored (SPR23): stock of a good held in a place
 * against the want rate of the holders there. `days` is how long the stock lasts
 * at that want (Infinity with no want). */
export function readScarcity(world, place, good) {
    const holders = [place, ...Object.keys(world.holders).filter(id => world.holders[id].place === place)];
    const sum = name => holders.reduce((n, id) => n + (world.holders[id]?.quantities[name] ?? 0), 0);
    const stock = sum(`stock:${good}`), want = sum(`want:${good}`);
    return {good, place, stock, want, days: want ? Math.floor(stock / want) : Infinity, short: want > 0 && stock < want};
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

// One migration per revision step (OS8).
const MIGRATIONS = Object.freeze({
    // 0 -> 1 (2026-11-12, phase 2): holders gain properties, identity kinds and refs; nothing else moves.
    0: saved => ({...saved, revision: 1, holders: Object.fromEntries(Object.entries(saved.holders ?? {})
        .map(([id, h]) => [id, {...h, properties: h.properties ?? {}, as: h.as ?? [], refs: h.refs ?? {}}]))}),
});

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
    if (raw.links?.length) world.links = raw.links.map(normalizeLink).sort((a, b) => byId(a.id, b.id)); // E10 place graph (absent in older saves)
    // E12: identity history and named rows exist once a lifecycle act has run.
    if (raw.identity) world.identity = validateIdentities(structuredClone(raw.identity));
    if (raw.rows) world.rows = structuredClone(raw.rows);
    return validateWorld(rules, world);
}

export function validateWorld(rules, world) {
    check(world?.schema === SUBSTRATE_SCHEMA && world.revision === SUBSTRATE_REVISION, 'unknown world shape.');
    for (const [id, h] of Object.entries(world.holders)) {
        check(h.id === id && KINDS.includes(h.kind), `holder ${id} is malformed.`);
        if (h.kind !== 'place') check(world.holders[h.place]?.kind === 'place', `holder ${id} sits in an unknown place.`);
        for (const [name, amount] of Object.entries(h.quantities)) {
            const def = quantityDef(rules, name);
            check(def && whole(amount) && amount >= def.min && amount <= def.max, `holder ${id}: ${name} invalid.`);
            const sum = Object.values(h.ledger[name] ?? {}).reduce((a, b) => a + b, 0);
            check(whole(sum), `holder ${id}: ${name} ledger invalid.`);
        }
    }
    for (const [id, h] of Object.entries(world.holders)) for (const [name, value] of Object.entries(h.properties ?? {})) checkProperty(rules, name, value, `holder ${id}`);
    for (const f of world.laws) check(idLike(f.id) && (f.scope === 'world' || world.holders[f.scope]), `law field ${f.id} has no scope.`);
    // E12: cohort counts and named rows are whole.
    for (const [id, h] of Object.entries(world.holders)) check(h.kind === 'cohort' ? whole(h.count) && h.count >= 0 : h.count == null, `holder ${id}: bad count.`);
    for (const row of Object.values(world.rows ?? {})) check(Object.values(row).every(whole), 'a named row holds whole amounts.');
    check(world.chain.length <= rules.dials.chainCap, 'chain exceeds its cap.');
    // >>> E10 place graph
    check(world.links === undefined || Array.isArray(world.links) && world.links.length > 0 &&
        new Set(world.links.map(l => l.id)).size === world.links.length, 'links need unique ids.');
    // <<< E10 place graph
    return world;
}

// ---------- place graph (E10, audit AF2) ----------
// >>> E10 place graph: links between places and the one reader over them.
// A link is world data: {id, kind, from, to, cost, state, oneWay, force?, note?}.
// `kind` is any id a world uses (path, door, air, water, sightline, wire, ...);
// nothing here names one. `cost` is the link's length in whatever unit the world
// counts (minutes, paces). A closed link is not a wall: `force` states what
// passing it anyway costs (extra length, and a price in quantities the caller
// debits). A closed link with no `force` has no stated way through, so a reader
// lists the places behind it as unreached rather than failing. The readers are
// pure over a list of links, so a caller can add rows of its own (`also`).
const natural = n => Number.isSafeInteger(n) && n >= 0;
/** The world's links whose two ends are places that exist now. A link to a place
 * that is gone stays stored and dormant; it works again if the place returns. */
export const worldLinks = world => (world.links ?? []).filter(l => world.holders[l.from]?.kind === 'place' && world.holders[l.to]?.kind === 'place');
// What a pack's view reads: the world's links plus any rows the pack passes in `also`.
const linksFor = (world, opts) => opts?.also?.length ? [...opts.also.map(normalizeLink), ...worldLinks(world)] : worldLinks(world);
export const LINK_STATES = Object.freeze(['open', 'closed']);

/** One link in its stored shape. Defaults: cost 1, open, two-way. */
export function normalizeLink(raw) {
    check(idLike(raw?.id) && idLike(raw.kind) && idLike(raw.from) && idLike(raw.to) && raw.from !== raw.to,
        `a link needs an id, a kind and two different places (${raw?.id}).`);
    const cost = raw.cost ?? 1, state = raw.state ?? 'open';
    check(natural(cost) && LINK_STATES.includes(state), `link ${raw.id}: cost is a whole number and state is open or closed.`);
    const out = {id: raw.id, kind: raw.kind, from: raw.from, to: raw.to, cost, state, oneWay: raw.oneWay === true};
    if (raw.force != null) {
        const price = raw.force.price ?? [];
        check(natural(raw.force.cost ?? 0) && Array.isArray(price) &&
            price.every(p => typeof p?.quantity === 'string' && p.quantity && natural(p.amount)),
            `link ${raw.id}: force is {cost, price: [{quantity, amount}]}.`);
        out.force = {cost: raw.force.cost ?? 0, price: price.map(p => ({quantity: p.quantity, amount: p.amount}))};
    }
    if (raw.note != null) { check(typeof raw.note === 'string', `link ${raw.id}: note is text.`); out.note = raw.note; }
    return out;
}

/** Ways out of `place`, in link-id order. opts: kinds (list; all when absent),
 * weights ({kind: multiplier} on cost), closed: 'skip' (default) leaves closed
 * links out, 'force' passes those that state a force at its added cost, 'any'
 * passes every closed link (used to say what lies behind them). */
export function linkExits(links, place, {kinds, weights, closed = 'skip'} = {}) {
    const out = [];
    for (const link of links) {
        if (kinds && !kinds.includes(link.kind)) continue;
        const to = link.from === place ? link.to : !link.oneWay && link.to === place ? link.from : null;
        if (to == null) continue;
        const shut = link.state === 'closed';
        if (shut && (closed === 'skip' || closed === 'force' && !link.force)) continue;
        const cost = link.cost * (weights?.[link.kind] ?? 1) + (shut && closed === 'force' ? link.force.cost : 0);
        check(natural(cost), `link ${link.id}: weighted cost must stay whole.`);
        out.push({link: link.id, to, cost, forced: shut});
    }
    return out.sort((a, b) => byId(a.link, b.link));
}

/** Places one open link away, sorted. */
export const linkNeighbours = (links, place, opts) => [...new Set(linkExits(links, place, opts).map(x => x.to))].sort(byId);

const better = (a, b) => !b || a.cost < b.cost || a.cost === b.cost && (a.links < b.links ||
    a.links === b.links && a.route.join('\u0000') < b.route.join('\u0000'));

/** Every place reachable from `from`, with the cheapest way there:
 * Map place -> {place, links, cost, route: [link ids], forced: [link ids]}.
 * opts as linkExits, plus maxLinks (hops) and maxCost. The origin is in the map at
 * 0. With both limits the answer is the cheapest route inside both, exactly: the
 * search keeps the least cost per place for each number of links. */
export function linkReach(links, from, opts = {}) {
    const {maxLinks, maxCost} = opts;
    check(maxLinks == null || natural(maxLinks), 'maxLinks is a whole number.');
    check(maxCost == null || natural(maxCost), 'maxCost is a whole number.');
    const places = new Set([from]);
    for (const link of links) { places.add(link.from); places.add(link.to); }
    const hops = Math.min(maxLinks ?? Infinity, places.size - 1);
    const best = new Map([[from, {place: from, links: 0, cost: 0, route: [], forced: []}]]);
    let layer = new Map(best);
    for (let h = 1; h <= hops && layer.size; h++) {
        const next = new Map();
        for (const place of [...layer.keys()].sort(byId)) {
            const at = layer.get(place);
            for (const exit of linkExits(links, place, opts)) {
                const cost = at.cost + exit.cost;
                if (maxCost != null && cost > maxCost) continue;
                const cand = {place: exit.to, links: h, cost, route: [...at.route, exit.link],
                    forced: exit.forced ? [...at.forced, exit.link] : at.forced};
                if (better(cand, next.get(exit.to))) next.set(exit.to, cand);
            }
        }
        for (const [place, cand] of next) if (better(cand, best.get(place))) best.set(place, cand);
        layer = next;
    }
    return best;
}

/** Places within the limits, sorted by id, each with its cheapest way. */
export const linksWithin = (links, from, opts) => [...linkReach(links, from, opts).values()].sort((a, b) => byId(a.place, b.place));

/** The cheapest way from one place to another, or null when no way is open. */
export const linkDistance = (links, from, to, opts) => linkReach(links, from, opts).get(to) ?? null;

/** What a reaching effect needs in one answer. `reached` are places with an open
 * way inside the limits (going around a closed link counts when the limits allow
 * it). `forceable` are further places a stated force would open, each with the
 * links to force and their summed price. `unreached` are places that lie inside
 * the limits only through closed links with no stated way. */
export function reachReport(links, from, opts = {}) {
    const open = linkReach(links, from, {...opts, closed: 'skip'});
    const forced = linkReach(links, from, {...opts, closed: 'force'});
    const any = linkReach(links, from, {...opts, closed: 'any'});
    const byLink = new Map(links.map(l => [l.id, l]));
    const sorted = map => [...map.values()].sort((a, b) => byId(a.place, b.place));
    return {
        reached: sorted(open),
        forceable: sorted(forced).filter(e => !open.has(e.place)).map(e => ({...e,
            price: e.forced.flatMap(id => byLink.get(id).force.price.map(p => ({link: id, ...p})))})),
        unreached: sorted(any).filter(e => !forced.has(e.place)).map(e => ({place: e.place, reason: 'closed',
            via: e.forced.filter(id => !byLink.get(id).force)})),
    };
}
// <<< E10 place graph
