// A holder's mental faculties and leased influences (AD32, WSC8, WSC15).
// Application data comes from the settling working, including the resolved
// holders and the size and duration of the influence. No spell ids enter here.
import {defineAgent, chooseWorking} from '../agency.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {WORLD_PROPERTIES} from '../world_quantities.js';

export const MIND_PACK = 'a.mind';
const focusLost = 'mind.focus-lost';
const level = id => ({id, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER});
const properties = [
    {id: 'mind_awake', type: 'flag'}, {id: 'mind_laughing', type: 'flag'}, {id: 'mind_speech_disrupted', type: 'flag'},
    {id: 'mind_compelled_steps', type: 'flag'}, {id: 'mind_unsteady_footing', type: 'flag'},
    WORLD_PROPERTIES.senses, WORLD_PROPERTIES.concealed,
    {id: 'mind_compelled_disclosure', type: 'flag'},
    {id: 'mind_disclosure_protected', type: 'flag'},
    {id: 'mind_fixation', type: 'label'},
    {id: 'mind_instinct', type: 'label'}, {id: 'mind_instinct_protected', type: 'flag'},
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
    'effect.transform.mind', 'effect.transform.memory', 'effect.sense.mind', 'effect.add.memory', 'effect.end.working',
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

const counterable = ['mind_awake', 'mind_laughing', 'mind_speech_disrupted', 'mind_compelled_steps', 'mind_unsteady_footing'];

function endHold(view, id, working, names) {
    if (!text(working)) return [];
    const channels = view.state(id) ?? {};
    const ops = [];
    for (const name of names) {
        const channel = channels[name];
        if (!channel) continue;
        const remaining = channel.layers.filter(layer => layer.working !== working);
        if (remaining.length === channel.layers.length) continue;
        channel.layers = remaining;
        if (!remaining.length) delete channels[name];
        ops.push(property(id, name, effective(channel)));
    }
    return ops.length ? [...ops,
        state(id, Object.keys(channels).length ? channels : null)] : [];
}

const isMinded = holder => Object.hasOwn(holder.properties, 'mind_awake');
const value = v => ({value: v});

function influence(view, id, {kind, by, place, detail}) {
    const {parts, application} = detail ?? {};
    if (!parts || !Array.isArray(application?.targets) || !application.targets.includes(id)) return [];
    const {mind, minutes, working} = application;
    if (kind === 'effect.end.working')
        return application.targets.length === 1
            ? endHold(view, id, working, mind?.faculty === 'awareness' ? ['mind_awake'] : counterable) : [];
    if (!mind) return [];

    // Sustained workings refresh a short lease under their own identity. A
    // fixed timer uses an independent lease and needs no future publishes.
    // An order can be issued instantly and remain in force for its own term.
    const directedOrder = kind === 'effect.bind.mind' && mind.faculty === 'will';
    const temporary = parts.time === 'sustained' || parts.time === 'timed' || directedOrder;
    if (temporary && (!positive(minutes) || !Number.isSafeInteger(view.clock + minutes))) return [];
    const lease = temporary ? {
        key: JSON.stringify([by, kind, mind.faculty, mind.channel ?? null, working ?? view.clock]),
        until: view.clock + minutes,
        ...(text(working) ? {working} : {}),
    } : null;
    let changes;
    switch (kind) {
    case 'effect.block.mind':
        if (mind.faculty === 'sense' && text(mind.channel) && view.property(id, 'senses'))
            changes = {senses: {remove: mind.channel}};
        if (mind.faculty === 'disclosure' && lease) changes = {mind_disclosure_protected: value(true)};
        if (mind.faculty === 'instinct' && lease) changes = {mind_instinct_protected: value(true)};
        break;
    case 'effect.bind.mind':
        if (mind.faculty === 'awareness') changes = {mind_awake: value(false)};
        if (mind.faculty === 'laughter') changes = {mind_laughing: value(true),
            ...(mind.disruptSpeech === false ? {} : {mind_speech_disrupted: value(true)})};
        if (mind.faculty === 'steps') changes = {mind_compelled_steps: value(true)};
        if (mind.faculty === 'footing') changes = {mind_unsteady_footing: value(true)};
        if (mind.faculty === 'disclosure' && lease) changes = {mind_compelled_disclosure: value(true)};
        if (mind.faculty === 'instinct' && lease && view.holder(mind.to)?.kind === 'place')
            changes = {mind_instinct: value(mind.to)};
        if (mind.faculty === 'fixation' && lease && mind.subject !== id && view.holder(mind.subject)?.kind === 'body')
            changes = {mind_fixation: value(mind.subject)};
        if (mind.faculty === 'will' && view.holder(by) && view.holder(mind.to)?.kind === 'place' && lease)
            changes = {mind_controller: value(by), mind_order: value(mind.to)};
        break;
    case 'effect.add.mind':
        if (mind.faculty === 'pain' && positive(mind.amount)) changes = {mind_pain: {delta: mind.amount}};
        break;
    case 'effect.transform.mind':
        if (mind.faculty === 'confusion' && Number.isSafeInteger(mind.amount) &&
            (mind.amount > 0 || (lease && mind.amount < 0))) changes = {mind_confusion: {delta: mind.amount}};
        if (mind.faculty === 'pain' && lease && Number.isSafeInteger(mind.amount) && mind.amount < 0)
            changes = {mind_pain: {delta: mind.amount}};
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
    if (!changes) return [];
    const ops = update(view, id, changes, lease);
    if (ops.some(op => op.op === 'property' && (op.property === 'mind_awake' && op.value === false ||
        op.property === 'mind_confusion' && op.value > 0))) {
        ops.push({op: 'publish', kind: focusLost, place, by: id});
    }
    return ops;
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
    const fixation = view.property(id, 'mind_fixation');
    const instinct = view.property(id, 'mind_instinct_protected') === true ? null : view.property(id, 'mind_instinct');
    const goal = order ?? instinct ?? (fixation ? view.placeOf(fixation) : null) ?? (lapsed ? null : view.property(id, 'agency_goal'));
    const here = view.placeOf(id);
    if (!goal || goal === here || view.property(id, 'mind_awake') === false || view.property(id, 'mind_compelled_steps') === true) return cleanup;
    if (!exits(view, here).includes(goal) || view.holder(goal)?.kind !== 'place') return cleanup;
    const candidate = {
        id: 'cross', label: 'crosses to the destination', law: travel,
        method: {id: 'a.cross', revision: 0, law: travel.ref, roles: {origin: 'place', destination: 'place'},
            steps: [{op: 'cross', bindings: {origin: 'origin', destination: 'destination'}}]},
        bindings: {origin: {kind: 'place', id: here}, destination: {kind: 'place', id: goal}},
        serves: () => ({arrive: 1}),
    };
    const choice = chooseWorking({agent: mover, actor: id, needs: {arrive: {urgency: 1,
        why: order ? 'another will directs its movement' : instinct ? 'it follows an instinct' : fixation ? 'it seeks the person it is fixated on' :
            'it is moving toward its destination'}},
        candidates: [candidate], at: view.clock, knows: ref => view.holder(ref.id)});
    return choice.choice ? [...cleanup, {op: 'move', holder: id, to: goal}] : cleanup;
}

// E10: a body crosses along the world's open links of `linkKinds` (default path). `routes` is the
// older pack-level list, read as one-way links of the first kind through the same reader.
export function createMindPack({routes = [], linkKinds = ['path']} = {}) {
    const own = [];
    for (const {from, to} of routes) {
        if (!text(from) || !text(to) || from === to) throw new Error('Mind motion needs a directed route between places.');
        own.push({id: `own.${own.length}`, kind: linkKinds[0], from, to, oneWay: true});
    }
    const exits = (view, here) => view.neighbours(here, {kinds: linkKinds, also: own});
    const names = properties.map(def => def.id);
    return {
        id: MIND_PACK, revision: 0, properties, reads: names, writes: names, hears: kinds, publishes: [focusLost],
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
                (holder.properties.agency_goal !== undefined || holder.properties.mind_order !== undefined ||
                    holder.properties.mind_fixation !== undefined || holder.properties.mind_instinct !== undefined),
            horizon: (view, id) => {
                const until = view.property(id, 'agency_until');
                return until === null ? Infinity : Math.max(1, until - view.clock);
            },
            decide: (view, id) => move(view, id, exits),
        }],
    };
}
