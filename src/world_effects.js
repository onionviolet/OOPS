// SB3 effect primitives (chat W). The verbs of the shared effect grammar
// (procedural foundation plan, "One effect grammar for every world"), acting on
// W's quantities, properties, positions and law fields at one minute. P composes
// sentences (target shape, time, carrier, cost, limits) and lowers each to these
// acts; K pays for them as a working; W only executes. Nothing here names a
// world or a domain (PFP3). Counterplay comes free (EF3): `block` stops any verb
// on any object it names, `conceal` defeats `sense`, `alter` changes law fields.
import {applyWorldOps, quantityDef, reachReport, worldLinks} from './world_substrate.js'; // E10: reachReport, worldLinks

// Kept in step with P's effect grammar verbs (src/effect_grammar.js EFFECT_VERBS): one list of twelve.
export const EFFECT_VERBS = Object.freeze(['move', 'add', 'remove', 'transform', 'bind', 'release', 'sense', 'conceal', 'copy', 'block', 'end', 'alter']);

/** P's effect objects (src/effect_grammar.js EFFECT_OBJECTS) on W's vocabulary.
 * A string is the W object; null means the object belongs to another owner
 * (K for workings, N for knowledge, A and L for minds, P for luck on draws, L
 * for souls) and W publishes the
 * effect for that owner to answer. Keyed families take the world's key at
 * lowering (`light:<kind>`, `energy:<kind>`). */
export const W_OBJECT_OF = Object.freeze({
    vitality: 'vitality', heat: 'temperature', light: 'light', sound: 'noise', essence: 'energy', moisture: 'humidity',
    force: null, lifespan: null,
    position: 'position', form: 'property:form', mind: null,
    information: null, memory: null,
    relation: 'property:marks', thing: 'position', working: null, law: 'law:*', time: 'law:*',
    luck: null, soul: null,
});
export const EFFECT_PRIMITIVES_REVISION = 0;
// E12: the verb each holder-lifecycle act rides when a landed effect carries it.
export const LIFECYCLE_VERB = Object.freeze({create: 'add', end: 'end', copy: 'copy', split: 'transform', merge: 'transform', promote: 'transform', demote: 'transform'});

const fail = message => { throw new Error(`World effects: ${message}`); };
const check = (ok, message) => { if (!ok) fail(message); };
const whole = Number.isSafeInteger;
const byId = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// Objects: a quantity name (`temperature`, `energy:mana`), `property:<name>`,
// `position`, or `law:<kind>`.
function parseObject(rules, object) {
    check(typeof object === 'string' && object, 'an act needs an object.');
    if (object === 'position') return {type: 'position', name: 'position'};
    if (object.startsWith('property:')) {
        const name = object.slice(9);
        check(rules.properties.has(name), `unknown property ${name}.`);
        return {type: 'property', name};
    }
    if (object.startsWith('law:')) return {type: 'law', name: object.slice(4)};
    check(quantityDef(rules, object), `unknown quantity ${object}.`);
    return {type: 'quantity', name: object, family: object.split(':')[0]};
}

/** Target shapes W can resolve on its own. Geometric shapes (line, cone,
 * radius) need places with positions and belong to X; P passes their result
 * as `{shape: 'holders', ids}`. */
export function resolveTargets(world, target) {
    const all = Object.keys(world.holders).sort(byId), h = id => world.holders[id];
    const placeOf = id => h(id)?.kind === 'place' ? id : h(id)?.place;
    switch (target?.shape) {
    case 'self': case 'holder': check(h(target.id), `no holder ${target.id}.`); return [target.id];
    case 'holders': check(Array.isArray(target.ids) && target.ids.every(h), 'unknown target holder.'); return [...new Set(target.ids)].sort(byId);
    case 'place': return all.filter(id => id === target.place || h(id).place === target.place);
    case 'present': return all.filter(id => h(id).place === target.place);
    case 'marked': return all.filter(id => (h(id).properties.marks ?? []).includes(target.mark) && (!target.place || placeOf(id) === target.place));
    case 'having': return all.filter(id => (!target.place || placeOf(id) === target.place) && id in world.holders &&
        target.property in h(id).properties && (target.value === undefined || JSON.stringify(h(id).properties[target.property]) === JSON.stringify(target.value)));
    // E10 place graph: holders within a number of links; this list is what is reachable with nothing forced.
    case 'within': return resolveReach(world, target).ids;
    default: return fail(`unknown target shape ${target?.shape}.`);
    }
}

// >>> E10 place graph: target resolution over links
/** `{shape: 'within', from, links?, kinds?, cost?, weights?, present?, force?, payer?}`:
 * holders in places within `links` links (default 1) of the place of `from`, over
 * the named link kinds (all kinds when absent) and inside `cost` when given.
 * `present: true` leaves the places themselves out. Returns the free reach (`ids`,
 * `places`) and the graph's report of what a force would open and what has no way. */
export function resolveReach(world, target) {
    const h = id => world.holders[id];
    check(h(target?.from), `no holder ${target?.from}.`);
    check(target.kinds == null || Array.isArray(target.kinds) && target.kinds.every(k => typeof k === 'string'), 'within: kinds is a list.');
    const from = h(target.from).kind === 'place' ? target.from : h(target.from).place;
    const report = reachReport(worldLinks(world), from, {kinds: target.kinds, weights: target.weights, maxLinks: target.links ?? 1, maxCost: target.cost});
    const places = report.reached.map(e => e.place);
    return {from, places, ids: holdersIn(world, places, target), ...report};
}
function holdersIn(world, places, target) {
    const set = new Set(places);
    return Object.keys(world.holders).sort(byId).filter(id => {
        const x = world.holders[id];
        return x.kind === 'place' ? !target.present && set.has(id) : set.has(x.place);
    });
}
// <<< E10 place graph

// Block fields: kind 'block', params {verb, object}, either may be '*'. They
// guard the target, its place and the world, nearest first.
function blockingField(world, target, verb, obj) {
    const h = world.holders[target], scopes = [target, h?.kind === 'place' ? null : h?.place, 'world'].filter(Boolean);
    for (const scope of scopes) for (const f of world.laws) {
        if (f.scope !== scope || f.kind !== 'block') continue;
        const threshold = f.params.threshold;
        if (threshold && (world.holders[scope]?.quantities[threshold.quantity] ?? 0) < threshold.minimum) continue;
        if (f.params.spellObject !== undefined && f.params.spellObject !== obj.spellObject) continue;
        const v = f.params.verb ?? '*', o = f.params.object ?? '*';
        const objectHit = o === '*' || o === obj.name || o === obj.family || (obj.type === 'law' && o === `law:${obj.name}`) || (obj.type === 'property' && o === `property:${obj.name}`);
        if ((v === '*' || v === verb) && objectHit) return f;
    }
    return null;
}

const blockerOf = (world, target, verb, obj) => blockingField(world, target, verb, obj)?.id ?? null;

/** A barrier can stop an incoming cast at its aim, before custody or another
 * effect selects the holder it will change. Ordinary object blocks still run
 * on that eventual holder in applyEffect. */
export function spellContactBarrier(world, target, verb, spellObject) {
    return blockingField(world, target, verb, {type: 'contact', name: 'spell-contact', spellObject});
}

/** Audible speech is an addition to the speaker's noise channel. */
export function voiceBlocker(world, speaker) {
    return blockerOf(world, speaker, 'add', {type: 'quantity', name: 'noise', family: 'noise'});
}

export function concealedFrom(world, target, channel) {
    const h = world.holders[target];
    if ((h.properties.concealed ?? []).includes(channel)) return true;
    const scopes = [target, h.kind === 'place' ? null : h.place].filter(Boolean);
    const garment = h.kind === 'body' ? world.holders[h.properties.worn_cloak] : null;
    return world.laws.some(f => {
        const covers = f.kind === 'conceal' && scopes.includes(f.scope) ||
            f.kind === 'wearer-conceal' && garment?.kind === 'thing' && garment.place === h.place && f.scope === garment.id;
        return covers && (f.params.channel === channel || f.params.channel === '*');
    });
}

const placeOf = (world, id) => world.holders[id].kind === 'place' ? id : world.holders[id].place;

/**
 * Run one act at the world's current minute.
 * act = {verb, object, target, amount?, to?, into?, ratio?, value?, from?, channel?, mark?, until?, field?, params?, by}
 * Physical thing details name a quantity to remove, properties to transform,
 * or a thing or body to create at the target. A move on marks moves the marked
 * implement and releases its named grip. A quantity transform without a
 * conversion names a signed delta. Copy writes one property from a source
 * holder; with create: {id, kind: 'thing'}, it creates that thing at the
 * single target's place and initializes only the copied property.
 * Returns {world, outcome: {applied, blocked, skipped, observed}}. Each applied
 * target also gets an `effect.<verb>` effect in its place so present things can
 * answer (a ward noticing, a Gu reacting to being sensed).
 */
export function applyEffect(rules, world, act, cause, {previewVitality = false} = {}) {
    check(EFFECT_VERBS.includes(act?.verb), `unknown verb ${act?.verb}.`);
    check(typeof cause === 'string' && cause, 'an act needs a cause.');
    const verb = act.verb;
    check(!previewVitality || verb === 'remove' && act.object === 'vitality', 'Only direct vitality removal can be previewed.');
    // bind and conceal write the marks and concealed properties; block, alter and a bare sense name no object.
    const implied = {bind: 'property:marks', conceal: 'property:concealed'}[verb] ?? (verb === 'release' ? `property:${act.channel ? 'concealed' : 'marks'}` : undefined);
    const base = implied ? parseObject(rules, implied) : verb === 'block' || verb === 'alter' || verb === 'end' || verb === 'sense' && !act.object
        ? {type: 'none', name: act.object ?? '*'} : parseObject(rules, act.object);
    const physical = base.type === 'position';
    let obj = base;
    if (physical && verb === 'remove') {
        check(quantityDef(rules, act.quantity), 'remove material needs a declared quantity.');
        obj = parseObject(rules, act.quantity);
    }
    const changes = physical && verb === 'transform' ? Object.entries(act.properties ?? {}) : [];
    if (physical && verb === 'transform' && !act.lifecycle /* E12 */) {
        check(changes.length && changes.every(([name, value]) => rules.properties.has(name) && value != null),
            'transform material needs explicit declared properties and values.');
    }
    const position = {type: 'position', name: 'position'};
    const grips = verb === 'move' && obj.type === 'property' && obj.name === 'marks';
    const copyNew = verb === 'copy' && act.create !== undefined;
    const affected = [obj, ...changes.map(([name]) => ({type: 'property', name}))];
    if (grips || obj !== base) affected.push(grips ? position : base);
    if (copyNew) affected.push(position);
    // >>> E10 place graph: a `within` target also reports what it could not reach
    const reaching = act.target?.shape === 'within' ? resolveReach(world, act.target) : null;
    let targets = reaching ? reaching.ids : resolveTargets(world, act.target);
    // <<< E10 place graph
    const plannedMoves = new Map();
    if (physical && verb === 'add' && !act.lifecycle /* E12 */) {
        check(targets.length === 1 && ['thing', 'body'].includes(act.create?.kind),
            'add material needs one target and a thing or body to create.');
    }
    if (copyNew) {
        check(targets.length === 1 && act.create?.kind === 'thing', 'copy into a new thing needs one target and a thing holder to create.');
    }
    const by = act.by ?? cause, ops = [], outcome = {applied: [], blocked: [], skipped: [], observed: []};
    const note = (target, extra = {}) => {
        outcome.applied.push({target, verb, object: obj.name, ...extra});
        const place = placeOf(world, target);
        ops.push({op: 'publish', kind: `effect.${verb}`, place, by, detail: {target, object: obj.name, ...extra}});
        // Presence is learned only from a successful channel act. The bare
        // grammar publish has no resolved observation and grants no knowledge.
        if (act.presence === true && (verb === 'sense' || verb === 'conceal')) {
            ops.push({op: 'publish', kind: `effect.${verb}.information`, place, by,
                detail: {target, channel: act.channel, presence: true}});
        }
    };
    // E12: a holder an effect makes records what it came from (`parents`, empty for a plain make).
    const createAt = (target, value, parents = [], note) => {
        ops.push({op: 'holder_add', value: {...value, place: placeOf(world, target)}, lineage: {parents, ...(note ? {note} : {})}});
    };
    // E12 (begin): a landed effect may carry one holder-lifecycle act in `act.lifecycle` (the substrate's
    // {act, ...} without `op`). The verb must be the one in LIFECYCLE_VERB. The target is the holder
    // acted on (end, copy, split, promote), the place or holder a create happens at, or the holders
    // merged or demoted. A block on the verb over `position` stops it. A fault comes back in
    // `outcome.faults` with its reason, way around and price; the world has already charged it.
    if (act.lifecycle) {
        const L = act.lifecycle, many = L.act === 'merge' || L.act === 'demote';
        check(LIFECYCLE_VERB[L.act] === verb, `lifecycle act ${L.act} rides the verb ${LIFECYCLE_VERB[L.act]}.`);
        check(targets.length && (many || targets.length === 1), 'this lifecycle act names one target.');
        const stopped = targets.map(target => ({target, by: blockerOf(world, target, verb, position)})).filter(x => x.by);
        if (stopped.length) { outcome.blocked.push(...stopped); return {world, outcome}; }
        const subject = L.act === 'create' ? {value: {...L.value, ...(L.value?.kind === 'place' ? {} : {place: L.value?.place ?? placeOf(world, targets[0])})}}
            : many ? {holders: targets} : {holder: targets[0]};
        const next = applyWorldOps(rules, world, [{...L, op: 'lifecycle', by, ...subject}], cause);
        const faults = next.chain.filter(row => row.seq > world.seq && row.kind === 'lifecycle.fault').map(row => ({target: targets[0], ...row.detail}));
        if (faults.length) outcome.faults = faults;
        else outcome.applied.push(...targets.map(target => ({target, verb, object: 'holder', act: L.act})));
        return {world: next, outcome};
    }
    // E12 (end)
    if (verb === 'sense') {
        const sensor = act.by && world.holders[act.by];
        if (sensor?.properties.senses && !sensor.properties.senses.includes(act.channel)) {
            outcome.skipped.push({target: act.by, reason: 'no-sense', channel: act.channel});
            return {world, outcome};
        }
    }
    // Amount changes are planned on a working copy so a transfer conserves exactly.
    const working = new Map();
    const cur = id => { if (!working.has(id)) working.set(id, {...world.holders[id].quantities}); return working.get(id); };
    const adjust = (target, delta) => {
        if (!(obj.name in world.holders[target].quantities)) {
            outcome.skipped.push({target, reason: 'not-carried'});
            return;
        }
        const def = quantityDef(rules, obj.name), before = cur(target)[obj.name];
        const after = Math.min(def.max, Math.max(def.min, before + delta));
        if (after === before && (physical || verb === 'transform')) {
            outcome.skipped.push({target, reason: 'at-bound'});
            return;
        }
        cur(target)[obj.name] = after;
        ops.push({op: 'add', holder: target, quantity: obj.name, amount: after - before, source: by});
        note(target, {amount: after - before});
    };
    // >>> E10 place graph: closed links. With `force` the payer (target.payer, else the actor) pays each
    // forced link's stated price once and the effect passes; a place whose price is not met, or that is not
    // forced, or that has no stated way, is listed in outcome.unreached with the price a way would cost.
    if (reaching) {
        outcome.unreached = reaching.unreached.map(u => ({...u}));
        outcome.forced = [];
        const payer = act.target.payer ?? act.by, paid = new Set(), extra = [];
        for (const way of reaching.forceable) {
            const quote = {place: way.place, via: way.forced, price: way.price};
            if (act.target.force !== true) { outcome.unreached.push({...quote, reason: 'closed'}); continue; }
            const due = way.price.filter(p => !paid.has(p.link)), need = {};
            for (const p of due) need[p.quantity] = (need[p.quantity] ?? 0) + p.amount;
            const can = Object.hasOwn(world.holders, payer ?? '') && Object.entries(need).every(([name, amount]) =>
                !amount || name in world.holders[payer].quantities && cur(payer)[name] - quantityDef(rules, name).min >= amount);
            if (!can) { outcome.unreached.push({...quote, reason: 'price'}); continue; }
            for (const p of due) {
                if (p.amount) { cur(payer)[p.quantity] -= p.amount; ops.push({op: 'add', holder: payer, quantity: p.quantity, amount: -p.amount, source: `force:${p.link}`}); }
            }
            for (const link of way.forced) paid.add(link);
            outcome.forced.push({...quote, payer});
            extra.push(way.place);
        }
        outcome.unreached.sort((a, b) => byId(a.place, b.place));
        if (extra.length) targets = [...new Set([...targets, ...holdersIn(world, extra, act.target)])].sort(byId);
    }
    // <<< E10 place graph
    for (const target of targets) {
        const blocker = affected.map(object => blockerOf(world, target, verb, object)).find(Boolean);
        if (blocker) { outcome.blocked.push({target, by: blocker}); continue; }
        const h = world.holders[target];
        switch (verb) {
        case 'add': case 'remove': {
            if (physical && verb === 'add') {
                createAt(target, act.create);
                note(target, {created: act.create.id});
                break;
            }
            check(obj.type === 'quantity' && whole(act.amount) && act.amount > 0, `${verb} needs a quantity and a positive whole amount.`);
            adjust(target, verb === 'add' ? act.amount : -act.amount);
            break;
        }
        case 'move': {
            if (physical || grips) {
                check(world.holders[act.to]?.kind === 'place', 'move position needs a place `to`.');
                if (h.kind === 'place') { outcome.skipped.push({target, reason: 'is-a-place'}); break; }
                const placeOfHolder = holder => plannedMoves.get(holder.id) ?? holder.place;
                let refusal;
                for (const admit of rules.moveChecks ?? []) {
                    refusal = admit({world, holder: h, to: act.to, placeOfHolder});
                    if (refusal) break;
                }
                if (refusal) { outcome.blocked.push({target, by: act.to, reason: refusal}); break; }
                if (grips) {
                    check(typeof act.mark === 'string' && act.mark, 'move a gripped holder needs a grip mark.');
                    const marks = h.properties.marks ?? [];
                    if (!marks.includes(act.mark)) { outcome.skipped.push({target, reason: 'not-held'}); break; }
                    ops.push({op: 'property', holder: target, property: 'marks', value: marks.filter(mark => mark !== act.mark)});
                }
                ops.push({op: 'move', holder: target, to: act.to});
                plannedMoves.set(target, act.to);
                note(target, {to: act.to, ...(grips ? {released: act.mark} : {})});
                break;
            }
            check(obj.type === 'quantity' && whole(act.amount) && act.amount > 0 && world.holders[act.to], 'move amount needs a quantity, an amount and a holder `to`.');
            const dest = world.holders[act.to];
            if (!(obj.name in h.quantities) || !(obj.name in dest.quantities)) { outcome.skipped.push({target, reason: 'not-carried'}); break; }
            const def = quantityDef(rules, obj.name), have = cur(target)[obj.name] - def.min, room = def.max - cur(act.to)[obj.name];
            const moved = Math.max(0, Math.min(act.amount, have, room));
            cur(target)[obj.name] -= moved;
            cur(act.to)[obj.name] += moved;
            ops.push({op: 'add', holder: target, quantity: obj.name, amount: -moved, source: `moved:${act.to}`},
                {op: 'add', holder: act.to, quantity: obj.name, amount: moved, source: `moved:${target}`});
            note(target, {to: act.to, amount: moved});
            break;
        }
        case 'transform': {
            if (physical) {
                const changed = changes.filter(([name, value]) => JSON.stringify(h.properties[name]) !== JSON.stringify(value));
                if (!changed.length) { outcome.skipped.push({target, reason: 'unchanged-properties'}); break; }
                for (const [property, value] of changed) ops.push({op: 'property', holder: target, property, value});
                note(target, {properties: Object.fromEntries(changed)});
                break;
            }
            if (obj.type === 'property') {
                ops.push({op: 'property', holder: target, property: obj.name, value: act.value});
                note(target, {value: act.value});
                break;
            }
            if (obj.type === 'quantity' && act.into == null && act.delta !== undefined) {
                check(whole(act.delta) && act.delta !== 0, 'transform quantity needs a nonzero whole delta.');
                adjust(target, act.delta);
                break;
            }
            check(obj.type === 'quantity' && quantityDef(rules, act.into) && whole(act.amount) && act.amount > 0, 'transform needs a quantity, `into` and an amount.');
            const r = act.ratio ?? {numerator: 1, denominator: 1};
            check(whole(r.numerator) && whole(r.denominator) && r.numerator >= 0 && r.denominator > 0, 'transform ratio is whole.');
            if (!(obj.name in h.quantities) || !(act.into in h.quantities)) { outcome.skipped.push({target, reason: 'not-carried'}); break; }
            const def = quantityDef(rules, obj.name), taken = Math.min(act.amount, cur(target)[obj.name] - def.min);
            const made = Math.floor(taken * r.numerator / r.denominator);
            cur(target)[obj.name] -= taken;
            cur(target)[act.into] = Math.min(quantityDef(rules, act.into).max, cur(target)[act.into] + made);
            ops.push({op: 'add', holder: target, quantity: obj.name, amount: -taken, source: `transform:${act.into}`},
                {op: 'add', holder: target, quantity: act.into, amount: made, source: `transform:${obj.name}`});
            note(target, {into: act.into, amount: taken, made});
            break;
        }
        case 'bind': case 'conceal': {
            const prop = verb === 'bind' ? 'marks' : 'concealed', value = verb === 'bind' ? act.mark : act.channel;
            check(typeof value === 'string' && value, `${verb} needs a ${verb === 'bind' ? 'mark' : 'channel'}.`);
            if (verb === 'conceal' && act.until != null) {
                ops.push({op: 'law_add', field: {id: act.field ?? `conceal.${target}.${value}.${world.clock}`, scope: target, kind: 'conceal', params: {channel: value}, until: act.until, source: by}});
            } else {
                const now = h.properties[prop] ?? [];
                if (!now.includes(value)) ops.push({op: 'property', holder: target, property: prop, value: [...now, value]});
            }
            note(target, {[verb === 'bind' ? 'mark' : 'channel']: value, ...(act.until != null ? {until: act.until} : {})});
            break;
        }
        case 'release': {
            // The counter to bind and conceal: drop a mark, or a hidden channel.
            const prop = act.channel ? 'concealed' : 'marks', value = act.channel ?? act.mark;
            check(typeof value === 'string' && value, 'release needs a mark or a channel.');
            const now = h.properties[prop] ?? [];
            if (!now.includes(value)) { outcome.skipped.push({target, reason: 'not-held'}); break; }
            ops.push({op: 'property', holder: target, property: prop, value: now.filter(v => v !== value)});
            note(target, {[act.channel ? 'channel' : 'mark']: value});
            break;
        }
        case 'end': {
            // Ends a sustained effect: a law field scoped to the target, by id or kind. A running working is K's to end.
            const f = world.laws.find(x => x.scope === target && (act.field ? x.id === act.field : x.kind === act.kind));
            if (!f) { outcome.skipped.push({target, reason: act.working ? 'kernel-working' : 'no-field'}); break; }
            ops.push({op: 'law_remove', id: f.id});
            note(target, {ended: f.id});
            break;
        }
        case 'copy': {
            check(obj.type === 'property' && typeof act.from === 'string' && Object.hasOwn(world.holders, act.from),
                'copy needs a property and a holder `from`.');
            const value = world.holders[act.from].properties[obj.name];
            if (value === undefined) { outcome.skipped.push({target, reason: 'nothing-to-copy'}); break; }
            if (copyNew) {
                createAt(target, {id: act.create.id, kind: act.create.kind, properties: {[obj.name]: value}}, [act.from], `copy:property:${obj.name}`); // E12: lineage
                note(target, {from: act.from, created: act.create.id});
                break;
            }
            ops.push({op: 'property', holder: target, property: obj.name, value});
            note(target, {from: act.from});
            break;
        }
        case 'sense': {
            if (concealedFrom(world, target, act.channel)) { outcome.skipped.push({target, reason: 'concealed'}); break; }
            const wanted = act.reads ?? [];
            const reading = {target, channel: act.channel};
            for (const name of wanted) {
                if (name.startsWith('property:')) { const v = h.properties[name.slice(9)]; if (v !== undefined) reading[name] = v; }
                else if (name in h.quantities) reading[name] = h.quantities[name];
            }
            outcome.observed.push(reading);
            note(target, {channel: act.channel});
            break;
        }
        case 'block': {
            check(typeof act.params?.verb === 'string' && typeof act.params?.object === 'string', 'block needs params {verb, object}.');
            const threshold = act.params.threshold;
            check(threshold === undefined || typeof threshold?.quantity === 'string' && quantityDef(rules, threshold.quantity) &&
                Number.isSafeInteger(threshold.minimum) && threshold.minimum > 0, 'A block threshold needs a quantity and positive minimum.');
            ops.push({op: 'law_add', field: {id: act.field ?? `block.${target}.${act.params.verb}.${act.params.object}.${world.clock}`, scope: target,
                kind: 'block', params: {verb: act.params.verb, object: act.params.object,
                    ...(threshold ? {threshold: {quantity: threshold.quantity, minimum: threshold.minimum}} : {}),
                    ...(act.params.object === 'spell-contact' && typeof act.params.spellObject === 'string'
                        ? {spellObject: act.params.spellObject} : {}),
                    ...(act.params.object === 'spell-contact' && act.params.reflect === true ? {reflect: true} : {})},
                ...(act.until != null ? {until: act.until} : {}), source: by}});
            note(target, {params: act.params, ...(act.until != null ? {until: act.until} : {})});
            break;
        }
        case 'alter': {
            // Change law fields scoped to the target: remove one, change its params, or add one.
            if (act.remove) {
                const f = world.laws.find(x => x.id === act.remove && x.scope === target);
                if (!f) { outcome.skipped.push({target, reason: 'no-field'}); break; }
                ops.push({op: 'law_remove', id: f.id});
                note(target, {removed: f.id});
            } else if (act.field && act.params && world.laws.some(x => x.id === act.field)) {
                ops.push({op: 'law_params', id: act.field, params: act.params});
                note(target, {field: act.field});
            } else {
                check(act.field && typeof act.kind === 'string', 'alter adds a field with an id and kind.');
                ops.push({op: 'law_add', field: {id: act.field, scope: target, kind: act.kind, params: act.params ?? {}, ...(act.until != null ? {until: act.until} : {}), source: by}});
                note(target, {field: act.field, kind: act.kind});
            }
            break;
        }
        default: fail(`unhandled verb ${verb}.`);
        }
    }
    const next = ops.length && !previewVitality ? applyWorldOps(rules, world, ops, cause) : world;
    return {world: next, outcome};
}
