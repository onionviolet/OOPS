// SB3 effect primitives (chat W). The verbs of the shared effect grammar
// (procedural foundation plan, "One effect grammar for every world"), acting on
// W's quantities, properties, positions and law fields at one minute. P composes
// sentences (target shape, time, carrier, cost, limits) and lowers each to these
// acts; K pays for them as a working; W only executes. Nothing here names a
// world or a domain (PFP3). Counterplay comes free (EF3): `block` stops any verb
// on any object it names, `conceal` defeats `sense`, `alter` changes law fields.
import {applyWorldOps, quantityDef} from './world_substrate.js';

export const EFFECT_VERBS = Object.freeze(['move', 'add', 'remove', 'transform', 'bind', 'sense', 'conceal', 'copy', 'block', 'alter']);
export const EFFECT_PRIMITIVES_REVISION = 0;

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
    default: return fail(`unknown target shape ${target?.shape}.`);
    }
}

// Block fields: kind 'block', params {verb, object}, either may be '*'. They
// guard the target, its place and the world, nearest first.
function blockerOf(world, target, verb, obj) {
    const h = world.holders[target], scopes = [target, h?.kind === 'place' ? null : h?.place, 'world'].filter(Boolean);
    for (const scope of scopes) for (const f of world.laws) {
        if (f.scope !== scope || f.kind !== 'block') continue;
        const v = f.params.verb ?? '*', o = f.params.object ?? '*';
        const objectHit = o === '*' || o === obj.name || o === obj.family || (obj.type === 'law' && o === `law:${obj.name}`) || (obj.type === 'property' && o === `property:${obj.name}`);
        if ((v === '*' || v === verb) && objectHit) return f.id;
    }
    return null;
}

function concealedFrom(world, target, channel) {
    const h = world.holders[target];
    if ((h.properties.concealed ?? []).includes(channel)) return true;
    const scopes = [target, h.kind === 'place' ? null : h.place].filter(Boolean);
    return world.laws.some(f => f.kind === 'conceal' && scopes.includes(f.scope) && (f.params.channel === channel || f.params.channel === '*'));
}

const placeOf = (world, id) => world.holders[id].kind === 'place' ? id : world.holders[id].place;

/**
 * Run one act at the world's current minute.
 * act = {verb, object, target, amount?, to?, into?, ratio?, value?, from?, channel?, mark?, until?, field?, params?, by}
 * Returns {world, outcome: {applied, blocked, skipped, observed}}. Each applied
 * target also gets an `effect.<verb>` effect in its place so present things can
 * answer (a ward noticing, a Gu reacting to being sensed).
 */
export function applyEffect(rules, world, act, cause) {
    check(EFFECT_VERBS.includes(act?.verb), `unknown verb ${act?.verb}.`);
    check(typeof cause === 'string' && cause, 'an act needs a cause.');
    const verb = act.verb;
    // bind and conceal write the marks and concealed properties; block, alter and a bare sense name no object.
    const implied = {bind: 'property:marks', conceal: 'property:concealed'}[verb];
    const obj = implied ? parseObject(rules, implied) : verb === 'block' || verb === 'alter' || verb === 'sense' && !act.object
        ? {type: 'none', name: act.object ?? '*'} : parseObject(rules, act.object);
    const targets = resolveTargets(world, act.target);
    const by = act.by ?? cause, ops = [], outcome = {applied: [], blocked: [], skipped: [], observed: []};
    const note = (target, extra = {}) => {
        outcome.applied.push({target, verb, object: obj.name, ...extra});
        ops.push({op: 'publish', kind: `effect.${verb}`, place: placeOf(world, target), by, detail: {target, object: obj.name, ...extra}});
    };
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
    for (const target of targets) {
        const blocker = blockerOf(world, target, verb, obj);
        if (blocker) { outcome.blocked.push({target, by: blocker}); continue; }
        const h = world.holders[target];
        switch (verb) {
        case 'add': case 'remove': {
            check(obj.type === 'quantity' && whole(act.amount) && act.amount > 0, `${verb} needs a quantity and a positive whole amount.`);
            if (!(obj.name in h.quantities)) { outcome.skipped.push({target, reason: 'not-carried'}); break; }
            const def = quantityDef(rules, obj.name), before = cur(target)[obj.name];
            const after = Math.min(def.max, Math.max(def.min, before + (verb === 'add' ? act.amount : -act.amount)));
            cur(target)[obj.name] = after;
            ops.push({op: 'add', holder: target, quantity: obj.name, amount: after - before, source: by});
            note(target, {amount: after - before});
            break;
        }
        case 'move': {
            if (obj.type === 'position') {
                check(world.holders[act.to]?.kind === 'place', 'move position needs a place `to`.');
                if (h.kind === 'place') { outcome.skipped.push({target, reason: 'is-a-place'}); break; }
                ops.push({op: 'move', holder: target, to: act.to});
                note(target, {to: act.to});
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
            if (obj.type === 'property') {
                ops.push({op: 'property', holder: target, property: obj.name, value: act.value});
                note(target, {value: act.value});
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
        case 'copy': {
            check(obj.type === 'property' && world.holders[act.from], 'copy needs a property and a holder `from`.');
            const value = world.holders[act.from].properties[obj.name];
            if (value === undefined) { outcome.skipped.push({target, reason: 'nothing-to-copy'}); break; }
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
            ops.push({op: 'law_add', field: {id: act.field ?? `block.${target}.${act.params.verb}.${act.params.object}.${world.clock}`, scope: target,
                kind: 'block', params: {verb: act.params.verb, object: act.params.object}, ...(act.until != null ? {until: act.until} : {}), source: by}});
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
    const next = ops.length ? applyWorldOps(rules, world, ops, cause) : world;
    return {world: next, outcome};
}
