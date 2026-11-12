// A holder's mental faculties and leased influences (AD32, WSC8, WSC15).
// Application data comes from the settling working, including the resolved
// holders and the size and duration of the influence. No spell ids enter here.
import {defineAgent, chooseWorking} from '../agency.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {WORLD_PROPERTIES} from '../world_quantities.js';

export const MIND_PACK = 'a.mind';
const level = id => ({id, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER});
const properties = [
    {id: 'mind_awake', type: 'flag'}, WORLD_PROPERTIES.senses, WORLD_PROPERTIES.concealed,
    level('mind_pain'), level('mind_confusion'), level('mind_mood'),
    {id: 'mind_memory', type: 'set'}, {id: 'mind_access', type: 'set'},
    {id: 'mind_controller', type: 'label'}, {id: 'mind_order', type: 'label'},
    {id: 'agency_goal', type: 'label'}, level('agency_until'),
];
const property = (holder, name, value) => ({op: 'property', holder, property: name, value});
const state = (holder, value) => ({op: 'state', holder, value});
const positive = n => Number.isSafeInteger(n) && n > 0;
const text = v => typeof v === 'string' && v.length > 0;
const kinds = [
    'effect.block.mind', 'effect.bind.mind', 'effect.add.mind',
    'effect.transform.mind', 'effect.transform.memory', 'effect.sense.mind', 'effect.add.memory',
];

function effective({base, layers}) {
    return layers.reduce((value, {change}) => {
        if (change.delta !== undefined)
            return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, (value ?? 0) + change.delta));
        if (change.expose) return [...new Set([...(value ?? []), ...change.expose])].sort();
        if (change.remove !== undefined) return value?.filter(item => item !== change.remove) ?? null;
        return change.value;
    }, base);
}

function update(view, id, changes, lease) {
    const channels = view.state(id) ?? {};
    const ops = [];
    for (const [name, change] of Object.entries(changes)) {
        const before = view.property(id, name);
        const channel = channels[name] ?? {base: before, layers: []};
        if (lease) {
            channel.layers = channel.layers.filter(layer => layer.key !== lease.key);
            channel.layers.push({...lease, change});
        } else {
            channel.base = effective({base: channel.base, layers: [{change}]});
        }
        const after = effective(channel);
        if (JSON.stringify(after) !== JSON.stringify(before)) ops.push(property(id, name, after));
        if (channel.layers.length) channels[name] = channel;
        else delete channels[name];
    }
    return lease || Object.keys(channels).length
        ? [...ops, state(id, channels)] : ops;
}

function lapse(view, id) {
    const channels = view.state(id) ?? {};
    const ops = [];
    let expired = false;
    for (const [name, channel] of Object.entries(channels)) {
        const active = channel.layers.filter(layer => layer.until > view.clock);
        if (active.length === channel.layers.length) continue;
        expired = true;
        channel.layers = active;
        ops.push(property(id, name, effective(channel)));
        if (!active.length) delete channels[name];
    }
    return expired ? [...ops, state(id, Object.keys(channels).length ? channels : null)] : [];
}

const isMinded = holder => Object.hasOwn(holder.properties, 'mind_awake');
const value = v => ({value: v});

function influence(view, id, {kind, by, detail}) {
    const {parts, application} = detail ?? {};
    if (!parts || !Array.isArray(application?.targets) || !application.targets.includes(id)) return [];
    const {mind, minutes, working} = application;
    if (!mind) return [];

    // Sustained workings refresh a short lease under their own identity. A
    // fixed timer uses an independent lease and needs no future publishes.
    const temporary = parts.time === 'sustained' || parts.time === 'timed';
    if (temporary && (!positive(minutes) || !Number.isSafeInteger(view.clock + minutes))) return [];
    const lease = temporary ? {
        key: JSON.stringify([by, kind, mind.faculty, mind.channel ?? null, working ?? view.clock]),
        until: view.clock + minutes,
    } : null;
    let changes;
    switch (kind) {
    case 'effect.block.mind':
        if (mind.faculty === 'sense' && text(mind.channel) && view.property(id, 'senses'))
            changes = {senses: {remove: mind.channel}};
        break;
    case 'effect.bind.mind':
        if (mind.faculty === 'awareness') changes = {mind_awake: value(false)};
        if (mind.faculty === 'will' && view.holder(by) && view.holder(mind.to)?.kind === 'place' && lease)
            changes = {mind_controller: value(by), mind_order: value(mind.to)};
        break;
    case 'effect.add.mind':
        if (mind.faculty === 'pain' && positive(mind.amount)) changes = {mind_pain: {delta: mind.amount}};
        break;
    case 'effect.transform.mind':
        if (mind.faculty === 'confusion' && positive(mind.amount)) changes = {mind_confusion: {delta: mind.amount}};
        if (mind.faculty === 'mood' && Number.isSafeInteger(mind.amount) && mind.amount)
            changes = {mind_mood: {delta: mind.amount}};
        break;
    case 'effect.transform.memory':
        if (mind.faculty === 'memory' && text(mind.record) && view.property(id, 'mind_memory')?.includes(mind.record))
            changes = {mind_memory: {remove: mind.record}};
        break;
    case 'effect.add.memory':
        // The knowledge owner announces a record a mind has just taken in.
        if (mind.faculty === 'memory' && text(mind.record)) changes = {mind_memory: {expose: [mind.record]}};
        break;
    case 'effect.sense.mind': {
        // W supplies only successfully sensed targets. The reader holds the
        // current access, qualified by subject, until the contact lapses.
        const records = view.property(id, 'mind_memory');
        if (mind.faculty !== 'memory' || !lease || !records?.length || !view.holder(by) ||
            view.property(by, 'mind_awake') !== true) return [];
        const expose = records.map(record => JSON.stringify([id, record]));
        return update(view, by, {mind_access: {expose}}, {...lease, key: JSON.stringify([lease.key, id])});
    }
    }
    return changes ? update(view, id, changes, lease) : [];
}

const mover = defineAgent({id: 'a.directed-motion', revision: 0, label: 'The mover', wants: {arrive: {weight: 1}}});
const travel = defineWorkingLaw({id: 'a.directed-travel', revision: 0, operations: {
    cross: {roles: {origin: 'place', destination: 'place'}, settle: () => ({ok: true})},
}});

// Route availability is supplied by the scene. A movement candidate is quoted
// through A like other agent workings, and W settles the location change.
function move(view, id, exits) {
    const until = view.property(id, 'agency_until');
    const lapsed = until !== null && until <= view.clock;
    const cleanup = lapsed ? [property(id, 'agency_goal', null), property(id, 'agency_until', null)] : [];
    const order = view.property(id, 'mind_order');
    const goal = order ?? (lapsed ? null : view.property(id, 'agency_goal'));
    const here = view.placeOf(id);
    if (!goal || goal === here || view.property(id, 'mind_awake') === false) return cleanup;
    if (!exits.get(here)?.has(goal) || view.holder(goal)?.kind !== 'place') return cleanup;
    const candidate = {
        id: 'cross', label: 'crosses to the destination', law: travel,
        method: {id: 'a.cross', revision: 0, law: travel.ref, roles: {origin: 'place', destination: 'place'},
            steps: [{op: 'cross', bindings: {origin: 'origin', destination: 'destination'}}]},
        bindings: {origin: {kind: 'place', id: here}, destination: {kind: 'place', id: goal}},
        serves: () => ({arrive: 1}),
    };
    const choice = chooseWorking({agent: mover, actor: id, needs: {arrive: {urgency: 1,
        why: order ? 'another will directs its movement' : 'it is moving toward its destination'}},
        candidates: [candidate], at: view.clock, knows: ref => view.holder(ref.id)});
    return choice.choice ? [...cleanup, {op: 'move', holder: id, to: goal}] : cleanup;
}

export function createMindPack({routes = []} = {}) {
    const exits = new Map();
    for (const {from, to} of routes) {
        if (!text(from) || !text(to) || from === to) throw new Error('Mind motion needs a directed route between places.');
        if (!exits.has(from)) exits.set(from, new Set());
        exits.get(from).add(to);
    }
    const names = properties.map(def => def.id);
    return {
        id: MIND_PACK, revision: 0, properties, reads: names, writes: names, hears: kinds,
        reactors: [{id: 'influence', on: kinds, appliesTo: isMinded, react: influence}],
        laws: [{
            id: 'lapse',
            appliesTo: holder => Object.hasOwn(holder.state, MIND_PACK),
            horizon: (view, id) => Math.min(Infinity, ...Object.values(view.state(id) ?? {})
                .flatMap(channel => channel.layers.map(layer => Math.max(1, layer.until - view.clock)))),
            decide: lapse,
        }, {
            id: 'directed-motion',
            appliesTo: holder => holder.kind !== 'place' &&
                (holder.properties.agency_goal !== undefined || holder.properties.mind_order !== undefined),
            horizon: (view, id) => {
                const until = view.property(id, 'agency_until');
                return until === null ? Infinity : Math.max(1, until - view.clock);
            },
            decide: (view, id) => move(view, id, exits),
        }],
    };
}
