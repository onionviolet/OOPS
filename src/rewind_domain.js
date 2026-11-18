// Rewind domain (XG6, 2026-11-18, proposal): owns the namespaced `rewind` save slice (`rewind@1`: bounded captures, moving
// anchors, branches, per-person echoes, the rewind log) and runs the one rewind pipeline from rewind_kit.js over the saved
// slices of other domains. A rewind plans on copies, validates every touched slice through its own domain, and only then
// loads them (a refused plan changes nothing). The pin store (PSA29) keeps any path whose `rewind.hold` address is pinned.
// Not restored here: the native clock, inventories and character (not domains) and per-holder clocks (the advance loop's).
import {registerDomain, domainRegistry} from './domain_registry.js';
import * as K from './rewind_kit.js';
import {readPinNow} from './pin_store_domain.js';
import {pinAddress} from './pin_store.js';
import {current_game_time} from './game_time.js';
import {calendarMinutes} from './world_rhythm.js';
import {definePanel} from './panel_kit.js';
import {node} from './reference_kit.js';
import {formatDuration} from './number_format.js';
import {fnv1a} from './hash_rng.js';
import {testHooksEnabled} from './simulation_clock.js';
import {decodeMemory, decodeClaims, encodeMemory} from './person_memory.js';

let store = K.freshStore(), panel = null, lastLines = [], lastError = '';
const specs = new Map();
const render = () => panel?.render?.();
const domainOf = id => domainRegistry.list().find(d => d.id === id);

// Ports: tests and hosts replace them; the defaults read the live registry.
const defaultPorts = () => ({
    clock: () => calendarMinutes(current_game_time),
    read: id => { const d = domainOf(id); return d?.save ? d.save({}) : undefined; },
    validate: (id, slice) => { const d = domainOf(id); if (!d) throw Error(`no domain ${id}`); const m = d.migrate ? d.migrate(slice, {}) : slice; d.validate?.(m, {}); return m; },
    load: (id, slice) => { const d = domainOf(id); d.load(slice === undefined ? d.initialState?.() : slice, {}); },
    pinned: path => readPinNow(pinAddress('rewind.hold', path)) !== null,
});
let ports = defaultPorts();
export const configureRewind = (next = {}) => { ports = {...defaultPorts(), ...next}; };

export function registerRewind(spec) { K.validateSpec(spec); specs.set(spec.id, Object.freeze(structuredClone(spec))); render(); return spec; }
// Index of held restore points by pin address (`time.restore`, owner, capture id) -> {at, digest}. Derived from the captures on
// read, so the pin store's saved layer is not written twice (one authority); the pin store answers the address, this owns the row.
export const restoreAddress = (specId, captureId) => pinAddress('time.restore', specId, captureId);
export function restoreIndex() {
    const out = {};
    for (const [specId, a] of Object.entries(store.anchors)) {
        const c = store.captures.find(x => x.id === a.capture);
        if (c) out[restoreAddress(specId, c.id)] = {at: c.at, digest: fnv1a(2166136261, JSON.stringify(c.cells))};
    }
    for (const c of store.captures) {
        const addr = restoreAddress('captured', c.id);
        out[addr] = {at: c.at, digest: fnv1a(2166136261, JSON.stringify(c.cells))};
    }
    return out;
}
export const rewindSpecs = () => [...specs.values()];
export const rewindStore = () => structuredClone(store);

// A codec lets a compact saved slice be rewound in a readable shape: the stage holds `decode(slice)` and a restore goes back
// through `encode(view)` before the owner validates it (memory keeps a shared id table, so its rows cannot be cut apart raw).
const codecs = new Map();
export const registerRewindCodec = (id, codec) => { codecs.set(id, codec); };
const dayNow = () => Math.floor(ports.clock() / 1440);
registerRewindCodec('memory', {
    decode: slice => ({holders: {...decodeMemory(slice ?? {schema: 1, ids: [], holders: {}}, dayNow())}, claims: slice ? decodeClaims(slice) : []}),
    encode: view => encodeMemory(view.holders, dayNow(), undefined, view.claims),
});
const tracked = spec => [...new Set([...spec.track, ...(spec.select?.paths ?? [])])];
function stageOf(spec) {
    const slices = {}, raw = {};
    for (const id of new Set(tracked(spec).map(p => K.segsOf(p)[0]))) {
        const v = ports.read(id), codec = codecs.get(id);
        raw[id] = v === undefined ? undefined : structuredClone(v);
        if (codec) slices[id] = codec.decode(v === undefined ? undefined : structuredClone(v));
        else if (v !== undefined) slices[id] = structuredClone(v);
    }
    return {clock: ports.clock(), slices, raw};
}
const nameOf = spec => spec.names ?? {};
const spec = id => specs.get(id) ?? (() => { throw Error(`No rewind ${id}.`); })();

// Set the spec's fixed mark now, or advance its moving one.
function markNow(s, label) {
    const stage = stageOf(s);
    const made = K.capture(store, stage, {label, patterns: tracked(s), keep: []});
    store = {...made.store, anchors: {...made.store.anchors, [s.id]: {capture: made.capture.id, movedAt: stage.clock}}};
    // A moved anchor lets the capture it left go (the pin store of captures stays bounded).
    return made.capture;
}
function pinFor(s) {
    const held = store.anchors[s.id];
    return held ? store.captures.find(c => c.id === held.capture) : null;
}
function ctxFor(s, stage, pin) {
    const standing = [...specs.values()].filter(o => o.id !== s.id && o.anchor?.kind && store.anchors[o.id] && tracked(o).some(p => tracked(s).some(q => K.segsOf(p)[0] === K.segsOf(q)[0])))
        .map(o => ({owner: o.id, rank: o.rank ?? 0, capture: store.captures.find(c => c.id === store.anchors[o.id].capture)})).filter(x => x.capture);
    const actors = s.actorsFrom ? K.keysAt(stage.slices, s.actorsFrom) : [];
    return {capture: pin, standing, pinned: ports.pinned, areas: s.areas, minds: s.minds ? actors.flatMap(a => s.minds.map(m => m.replaceAll('{actor}', a))) : [], actors};
}
const quoteOf = (s, now) => {
    const held = store.anchors[s.id], used = store.lastUsed[s.id];
    if (!held) return {eligible: false, reason: 'No mark is set yet.'};
    const cool = s.cost?.cooldown ?? 0;
    if (used != null && now - used < cool) return {eligible: false, reason: `Ready again in ${formatDuration(cool - (now - used))}.`};
    return {eligible: true, reason: ''};
};

function commit(s, plan, stage) {
    const next = K.applyPlan(stage.slices, plan);
    const touched = K.touchedSlices(plan);
    const checked = {};
    for (const id of touched) checked[id] = next[id] === undefined ? undefined : ports.validate(id, codecs.has(id) ? codecs.get(id).encode(next[id]) : next[id]); // refuses before anything loads
    const before = Object.fromEntries(touched.map(id => [id, stage.raw[id]]));
    const done = [];
    try { for (const id of touched) { ports.load(id, checked[id]); done.push(id); } }
    catch (error) { for (const id of done) { try { ports.load(id, before[id]); } catch { /* best effort */ } } throw Error(`A rewind failed to load and was rolled back: ${error.message}`); }
}

// The registry tick is shared by every domain: a failure here is recorded for the panel and never thrown into it.
const safely = fn => { try { fn(); } catch (error) { lastError = error.message; } };

export const commands = {
    // Set a fixed mark here (a moving mark advances by itself and also answers this).
    mark(id, label = 'your mark') { const s = spec(id); const c = markNow(s, label); render(); return {id: c.id, at: c.at, label: c.label}; },
    quote(id) { const s = spec(id); return {...quoteOf(s, ports.clock()), terms: K.termsLine(s), label: s.label, why: K.KIND_ROWS[s.kind].why}; },
    // Rewind. Plans on copies, validates through each owner, then loads. A refused rewind changes nothing and says why.
    rewind(id, {capture: forced} = {}) {
        const s = spec(id), now = ports.clock(), q = quoteOf(s, now);
        lastError = '';
        try {
            if (!q.eligible && !forced) throw Error(q.reason);
            const stage = stageOf(s);
            const pin = forced ? store.captures.find(c => c.id === forced) : pinFor(s);
            if (!pin) throw Error('That pin is no longer held.');
            const plan = K.planRewind(stage, store, s, ctxFor(s, stage, pin));
            let st = store;
            if (plan.branch && plan.writes.length) {
                const made = K.capture(st, stage, {label: `before ${s.label}`, patterns: tracked(s), kind: 'branch', keep: [pin.id]});
                st = {...made.store, branches: [...made.store.branches, {capture: made.capture.id, label: `the line before ${s.label}`, at: now}]};
            }
            store = st;   // captured first so a failed commit leaves only an extra, valid branch
            commit(s, plan, stage);
            const echoes = {...store.echoes};
            for (const e of plan.echoes) echoes[e.actor] = [...(echoes[e.actor] ?? []), {at: e.at, level: e.level, rewind: s.id}].slice(-K.REWIND_DIALS.maxEchoes.value);
            const lines = K.inspectorLines(plan, nameOf(s));
            store = {...store, echoes, lastUsed: {...store.lastUsed, [s.id]: now}, log: [...store.log, {at: now, spec: s.id, pin: plan.pin.label, lines}].slice(-K.REWIND_DIALS.maxLog.value)};
            lastLines = lines; render();
            return {ok: true, lines, plan};
        } catch (error) { lastError = error.message; lastLines = []; render(); return {ok: false, reason: error.message, lines: []}; }
    },
    // The event log: a host that wants "undo one action" appends what an action wrote (path, before, after).
    record(event) {
        store = {...store, events: [...store.events, structuredClone(event)].slice(-K.REWIND_DIALS.maxEvents.value)};
    },
    undo(eventId, specId) {
        const s = spec(specId), stage = stageOf(s);
        try {
            const plan = K.planUndo(store.events, eventId, stage.slices);
            commit(s, plan, stage);
            store = {...store, events: store.events.filter(e => e.id !== eventId)};
            lastLines = K.inspectorLines(plan, nameOf(s)); lastError = ''; render();
            return {ok: true, lines: lastLines, plan};
        } catch (error) { lastError = error.message; render(); return {ok: false, reason: error.message, lines: []}; }
    },
    // Branching: go back to a kept line; the line you leave becomes a branch in turn.
    switchBranch(id, captureId) { return commands.rewind(id, {capture: captureId}); },
    read: () => structuredClone(store),
    index: restoreIndex,
    event(name) { safely(() => { for (const s of specs.values()) if (K.anchorDue(s, store, {clock: ports.clock(), events: [name]})) markNow(s, s.markLabel ?? 'your mark'); render(); }); },
};

registerDomain({id: 'rewind', deps: [], initialState: () => null,
    save: () => K.isFreshStore(store) && !Object.keys(store.anchors).length ? undefined : structuredClone(K.validateStore(store)),
    validate: slice => { if (slice != null) K.validateStore(slice); },
    migrate: slice => { if (slice == null) return K.freshStore(); if (slice.schema > K.REWIND_SCHEMA) throw Error('This save has rewinds from a newer game version.'); return slice; },
    load: slice => { store = slice ?? K.freshStore(); lastLines = []; lastError = ''; render(); },
    // The registry's tick carries game minutes (AR3: no second timer): moving anchors advance here.
    tick: () => safely(() => { const clock = ports.clock(); for (const s of specs.values()) if (K.anchorDue(s, store, {clock})) markNow(s, s.markLabel ?? 'your mark'); render(); }),
    refresh: render,
    projection: () => ({store, specs: rewindSpecs(), lines: lastLines, error: lastError}),
    commands,
    panels: [() => { panel = createPanel(); }]});

// ---------- the shipped ability: Return to the mark (personal return, moving anchor) ----------
// Default (proposal): the holder goes back to a mark that moves up every hour and at each rest; their own memory and powers
// carry; others' memory returns with the world and leaves a familiar feeling. A world swaps any dial (fixed anchor, fellow
// loopers, an outside radius) by registering its own spec.
export const RETURN_TO_MARK = {
    id: 'return_to_mark', kind: 'personal', label: 'Return to the mark', holder: 'player', rank: 1, nesting: 'rank',
    track: ['memory', 'moodThoughts', 'duties'],
    names: {memory: 'what people remember', moodThoughts: 'moods', duties: 'duties'},
    minds: ['memory/holders/{actor}'], actorsFrom: 'memory/holders',
    anchor: {kind: 'moving', every: 60, on: ['rest']}, markLabel: 'your mark',
    awareness: {'*': 'deja_vu'},
    cost: {cooldown: 240, note: 'what you did since the mark is undone but the time still passed'},
    terms: {gain: 'a second try at the last hour', limits: ['people forget it, though some feel they have been here before', 'your own memory and powers come with you']},
};
registerRewind(RETURN_TO_MARK);

// Player panel: the mark, the button, and the inspector lines (what came back, what stayed, who remembers).
function createPanel() {
    if (typeof document === 'undefined') return null;
    const root = node('section', null, {id: 'rewind_panel', class: 'reference-panel'});
    root.dataset.surfaceType = 'reference';
    const status = node('p', '', {role: 'status'}), terms = node('p', ''), lines = node('ul', null, {'aria-label': 'What the rewind did'}),
        echoes = node('ul', null, {'aria-label': 'Who half-remembers'});
    const mark = node('button', 'Set the mark here', {type: 'button'}), back = node('button', 'Return to the mark', {type: 'button'});
    mark.onclick = () => { commands.mark(RETURN_TO_MARK.id); };
    back.onclick = () => { commands.rewind(RETURN_TO_MARK.id); };
    root.append(node('h2', 'Return to the mark'), terms, status, mark, back, lines, echoes);
    root.render = () => {
        const q = commands.quote(RETURN_TO_MARK.id), held = pinFor(spec(RETURN_TO_MARK.id));
        terms.textContent = q.terms;
        const wait = q.eligible ? '' : ` ${q.reason}`;
        status.textContent = lastError || (held ? `Your mark is ${formatDuration(Math.max(0, ports.clock() - held.at))} behind you.${wait}` : q.reason);
        back.disabled = !q.eligible;
        lines.replaceChildren(...lastLines.map(l => node('li', l)));
        echoes.replaceChildren(...Object.entries(store.echoes).map(([who, rows]) => node('li', `${who} ${K.AWARENESS.includes(rows.at(-1).level) ? ({deja_vu: 'felt it was familiar', fragments: 'kept fragments', full: 'remembers'})[rows.at(-1).level] : ''} (${rows.length}).`)));
    };
    definePanel({id: 'rewind', title: 'Return to the mark', role: 'records', node: root, home: document.getElementById('main_content'),
        access: () => true, discovered: () => true, eligible: () => true, emptyText: 'No rewind yet'});
    return root;
}
if (testHooksEnabled && typeof window !== 'undefined') window.__rewind = {registry: domainRegistry, commands, specs: () => rewindSpecs(), configure: configureRewind, register: registerRewind};
