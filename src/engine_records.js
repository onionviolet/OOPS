// The engine host's records slice (E9, proposal; PC95, PC99, KW5, KW10, KW11, KW15).
// The engine world keeps, beside its packs and world, the records that used to
// be held and saved by each caller: kernel workings in flight, stored workings,
// and bindings with their log. They settle on the world's own clock, in one
// stated order, and are saved in the one engine save.
//
// Order at each stop (a minute at which something is due):
//   1. the packs and the world reach the minute (so every record reads today);
//   2. kernel workings, by id, one step at a time: authority (bindings and
//      their oaths), the operation, the step's costs debited, its effects landed;
//   3. stored workings, by id: their pulse reads what step 2 just landed;
//   4. bindings, by event time then id: upkeep and duties read the receipts
//      step 2 just wrote, and their prices and aftermath land last.
//
// This module names no world and holds no number. What it cannot save is the
// caller's, like pack settings: `host` = {laws, things, costs, effects, ports}.
//   laws:    kernel laws by ref (functions cannot be saved);
//   things:  {'<kind>:<id>': data} for bound things the world keeps no holder for;
//   costs:   {accounts, backers, fault}, the world's price list (cost_owner.js);
//   effects: {keys, read}, what the effect host needs to land a sentence;
//   ports:   {authority?, pace?, stored?}, extra kernel and stored-working ports.
import {advanceWorld, applyWorldOps, substratePort} from './world_substrate.js';
import {beginWorking, nextWorkingDeadline, restoreWorking, serializeWorking, settleWorking} from './kernel_working.js';
import {advanceStoredWorkings, fireStored, restoreStored, serializeStored, storeWorking} from './stored_working.js';
import {bindingAuthority, bindingDues, bindingState, defineBinding, dueBindingEvents, restoreBindings, serializeBindings, takeExit} from './binding.js';
import {settleCosts} from './cost_owner.js';
import {landEffect} from './effect_host.js';
import {sentenceCosts} from './effect_grammar.js';

export const RECORDS_SCHEMA = 'engine.records@1';
const fail = message => { throw new Error(`Engine records: ${message}`); };
const byId = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const plain = value => JSON.parse(JSON.stringify(value));
const live = state => ['held', 'strained'].includes(state.status);
const terminal = record => ['spent', 'broken', 'lost'].includes(record.status);

export const emptyRecords = () => ({schema: RECORDS_SCHEMA, workings: {}, stored: {}, bindings: [], log: [], published: [], dues: []});
export const recordsEmpty = r => !r || !Object.keys(r.workings).length && !Object.keys(r.stored).length && !r.bindings.length && !r.dues.length;

export function hostOf({laws = [], things = {}, costs = null, effects = {}, ports = {}} = {}) {
    const table = Array.isArray(laws) ? Object.fromEntries(laws.map(law => [law.ref, law])) : {...laws};
    return {laws: table, things, costs, effects, ports};
}

// ---------- what the records read and write ----------

// KW3. A bound thing is the caller's data for it overlaid with the holder the world keeps.
const reader = (host, getWorld) => (ref, at) => {
    const thing = host.things[`${ref.kind}:${ref.id}`], held = substratePort(getWorld())(ref, at);
    if (!thing && !held) return null;
    return {...structuredClone(thing ?? {}), ...(held ? {holder: held.holder, place: held.place, quantities: held.quantities,
        properties: {...(thing?.properties ?? {}), ...held.properties}} : {}), kind: ref.kind, id: ref.id};
};

/** Every settled receipt of the host's workings, with its method and bindings (what bindings and oaths read). */
export const engineReceipts = engine => Object.keys(engine.records.workings).sort(byId).flatMap(id => {
    const {record} = engine.records.workings[id];
    return record.receipts.map(row => ({...row, working: id, method: record.method.id, bindings: record.bindings}));
});

const pay = (engine, world, rows, payer, cause) => settleCosts({rules: engine.rules, world, costs: rows, payer, cause,
    ...(engine.host.costs ?? {}), keys: engine.host.effects.keys, read: engine.host.effects.read});

// One published effect: a substrate op, a sentence for the effect host, or a label nothing can land.
function land(engine, world, effect, cause, by) {
    if (typeof effect?.op === 'string') return {world: applyWorldOps(engine.rules, world, [effect], cause), status: 'applied', reason: null};
    const {world: next, status, reason} = landEffect(engine.rules, world, effect, {cause, by, keys: engine.host.effects.keys, read: engine.host.effects.read});
    return {world: next, status, reason};
}

function kernelPorts(engine, entry, world) {
    const {host, records} = engine;
    const bindings = records.bindings.map(defineBinding);
    const inner = host.ports.authority;
    return {
        read: reader(host, world.get),
        ...(bindings.length || inner ? {authority: bindingAuthority(bindings, {log: records.log, receipts: engineReceipts(engine), inner})} : {}),
        ...(host.ports.pace ? {pace: host.ports.pace} : {}),
        // KW15 and H2: the step's own cost rows and the rows its sentences carry are debited
        // before its effects land. A quote asks the same question and keeps nothing.
        settleCosts({working, step, costs, effects, forecast}) {
            const rows = [...costs, ...effects.flatMap(e => e?.sentence ? sentenceCosts(e.sentence, e.details) : [])];
            if (!rows.length) return undefined;
            const {world: next, ...paid} = pay(engine, world.get(), rows, entry.payer ?? undefined, `working:${working}:${step}`);
            if (!forecast) world.set(next);
            return paid;
        },
    };
}

// ---------- settlement at the world's minute ----------

function settleWorkings(engine) {
    const now = engine.world.clock;
    for (const id of Object.keys(engine.records.workings).sort(byId)) {
        for (;;) {
            const entry = engine.records.workings[id], law = engine.host.laws[entry.law];
            const due = law && nextWorkingDeadline(entry.record);
            if (due == null || due > now) break;
            let world = engine.world;
            const run = settleWorking(law, entry.record, {now, maxSteps: 1,
                ports: kernelPorts(engine, entry, {get: () => world, set: next => { world = next; }})});
            const landed = [...entry.landed];
            for (const {step, at, effect} of run.effects) {
                const out = land({...engine, world}, world, effect, `working:${id}:${step}`, entry.payer ?? undefined);
                world = out.world;
                landed.push({step, at, status: out.status, ...(out.reason ? {reason: out.reason} : {})});
            }
            engine = {...engine, world, records: {...engine.records, workings: {...engine.records.workings, [id]: {...entry, record: run.record, landed}}}};
        }
    }
    return engine;
}

function settleStored(engine) {
    const now = engine.world.clock, all = Object.values(engine.records.stored);
    if (!all.some(record => !terminal(record) && record.watch.next <= now)) return engine;
    const out = advanceStoredWorkings({rules: engine.rules, world: engine.world, records: all, to: now,
        advance: (world, at) => world.clock === at ? world : fail(`a stored working pulsed at ${at} with the world at ${world.clock}.`),
        ports: engine.host.ports.stored ?? {}, keys: engine.host.effects.keys, read: engine.host.effects.read,
        ...(engine.host.costs ? {costs: engine.host.costs} : {})});
    return {...engine, world: out.world, records: {...engine.records, stored: Object.fromEntries(out.records.map(record => [record.id, record]))}};
}

function settleBindings(engine) {
    const {records} = engine, now = engine.world.clock;
    if (!records.bindings.length) return engine;
    const receipts = engineReceipts(engine);
    const rows = records.bindings.map(defineBinding).flatMap(b => now < b.madeAt ? []
        : dueBindingEvents(b, {now, receipts, log: records.log, published: records.published})
            .map(row => ({...row, payer: row.vower ?? row.by ?? bindingState(b, {now, receipts, log: records.log}).sides[row.side]})))
        .sort((a, b) => a.at - b.at || byId(a.id, b.id));
    if (!rows.length) return engine;
    let world = engine.world;
    const published = [...records.published], dues = [...records.dues];
    for (const row of rows) {
        published.push(row.id);
        const due = {at: now, what: row.id, kind: row.kind};
        if (row.costs?.length) { const {world: next, ...paid} = pay(engine, world, row.costs, row.payer, `binding:${row.id}`); world = next; due.paid = paid; }
        for (const effect of row.effects ?? []) {
            const out = land(engine, world, effect, `binding:${row.id}`, row.payer);
            world = out.world;
            (due.landed ??= []).push(out.status);
        }
        if (due.paid || due.landed) dues.push(due);
    }
    return {...engine, world, records: {...records, published, dues}};
}

const settleAt = engine => settleBindings(settleStored(settleWorkings(engine)));

// The next minute after now at which a record is due. Extra stops are harmless: the world settles the same in parts.
function nextTime(engine) {
    const {records, world: {clock}} = engine;
    let next = Infinity;
    const want = at => { if (at != null && at > clock && at < next) next = at; };
    for (const {law, record} of Object.values(records.workings)) if (engine.host.laws[law]) want(nextWorkingDeadline(record));
    for (const record of Object.values(records.stored)) if (!terminal(record)) want(record.watch.next);
    if (records.bindings.length) {
        const receipts = engineReceipts(engine);
        for (const b of records.bindings.map(defineBinding)) {
            if (clock < b.madeAt) { want(b.madeAt); continue; }
            if (!live(bindingState(b, {now: clock, receipts, log: records.log}))) continue;
            want(b.endsAt);
            for (const t of b.terms) want(t.by);
            for (const u of b.upkeep) { const from = u.from ?? b.madeAt; want(from + (Math.floor(Math.max(0, clock - from) / u.every) + 1) * u.every); }
        }
    }
    return next;
}

/** Advance the world and its records to `to`. A pending world advance returns early; call again to resume. */
export function advanceRecords(engine, to) {
    let segments = 0;
    for (;;) {
        const stop = Math.min(to, nextTime(engine));
        const out = advanceWorld(engine.rules, engine.world, stop);
        segments += out.segments;
        engine = {...engine, world: out.world};
        if (out.pending) return {engine, segments, pending: true};
        engine = settleAt(engine);
        if (stop >= to) return {engine, segments, pending: false};
    }
}

// ---------- engine actions (at the world's minute) ----------

/** Start a kernel working. Steps due now settle now; the rest settle as the world advances. */
export function startEngineWorking(engine, {law, method, id, bindings, facts = {}, payer = null, paceRole}) {
    if (engine.records.workings[id]) fail(`working ${id} is already held.`);
    const host = {...engine.host, laws: {...engine.host.laws, [law.ref]: law}};
    engine = {...engine, host};
    const entry = {law: law.ref, payer, landed: []};
    let world = engine.world;
    entry.record = beginWorking(law, method, {id, bindings, facts, at: world.clock, paceRole,
        ports: kernelPorts(engine, entry, {get: () => world, set: () => {}})});
    return settleAt({...engine, records: {...engine.records, workings: {...engine.records.workings, [id]: entry}}});
}

/** Lay a stored working (a ward, a trap, a held slot) on its carrier. */
export function storeEngineWorking(engine, spec, {id, by}) {
    if (engine.records.stored[id]) fail(`stored working ${id} is already held.`);
    const record = storeWorking(spec, {id, by, at: engine.world.clock, ports: engine.host.ports.stored ?? {}});
    return {...engine, records: {...engine.records, stored: {...engine.records.stored, [id]: record}}};
}

/** Fire a stored working by hand (a touch, a word, force). Its receipt is the record's last. */
export function fireEngineStored(engine, id, {stimulus = {}, way = {}} = {}) {
    const record = engine.records.stored[id] ?? fail(`no stored working ${id}.`);
    const run = fireStored({rules: engine.rules, world: engine.world, record, at: engine.world.clock, stimulus, way,
        ports: engine.host.ports.stored ?? {}, keys: engine.host.effects.keys, read: engine.host.effects.read,
        ...(engine.host.costs ? {costs: engine.host.costs} : {})});
    return settleAt({...engine, world: run.world, records: {...engine.records, stored: {...engine.records.stored, [id]: run.record}}});
}

/** Make a binding now. Its making price is debited from the side that owes it (default: `by`, side a). */
export function makeEngineBinding(engine, data, {by = 'a'} = {}) {
    const b = defineBinding({...data, madeAt: data.madeAt ?? engine.world.clock});
    if (engine.records.bindings.some(row => row.id === b.id)) fail(`binding ${b.id} is already held.`);
    const rows = bindingDues(b, {by}), dues = [...engine.records.dues];
    let world = engine.world;
    if (rows.length) {
        const {world: next, ...paid} = pay(engine, world, rows, undefined, `binding:${b.id}:made`);
        world = next;
        dues.push({at: world.clock, what: `${b.id}/made`, kind: 'made', paid});
    }
    return settleAt({...engine, world, records: {...engine.records, bindings: [...engine.records.bindings, plain(b)], dues}});
}

/** Take one of a binding's exits. A refused exit is written to `dues` with its reason; an allowed one is logged and its price debited. */
export function exitEngineBinding(engine, {binding, exit, by, consents = []}) {
    const {records} = engine, at = engine.world.clock;
    const b = defineBinding(records.bindings.find(row => row.id === binding) ?? fail(`no binding ${binding}.`));
    const answer = takeExit(b, bindingState(b, {now: at, receipts: engineReceipts(engine), log: records.log}), {exit, by, at, consents});
    if (!answer.ok) return {...engine, records: {...records, dues: [...records.dues, {at, what: `${binding}/exit/${exit}`, kind: 'exit-refused', reason: answer.reason, missing: answer.missing}]}};
    const log = [...records.log, answer.event], due = {at, what: answer.event.id, kind: 'exit'};
    let world = engine.world;
    const rows = bindingDues(b, {log, at, by, price: answer});
    if (rows.length) { const {world: next, ...paid} = pay(engine, world, rows, by, `binding:${answer.event.id}`); world = next; due.paid = paid; }
    for (const effect of answer.effects ?? []) {
        const out = land(engine, world, effect, `binding:${answer.event.id}`, by);
        world = out.world;
        (due.landed ??= []).push(out.status);
    }
    return settleAt({...engine, world, records: {...records, log, dues: [...records.dues, due]}});
}

// ---------- save shape ----------

export function serializeRecords(records) {
    const {bindings, log} = serializeBindings({bindings: records.bindings, log: records.log});
    return plain({schema: RECORDS_SCHEMA,
        workings: Object.fromEntries(Object.entries(records.workings).map(([id, entry]) => [id, {...entry, record: serializeWorking(entry.record)}])),
        stored: Object.fromEntries(Object.entries(records.stored).map(([id, record]) => [id, serializeStored(record)])),
        bindings, log, published: records.published, dues: records.dues});
}

/** An engine save from before the slice has no `records`: it restores with an empty slice.
 * A working whose law the caller did not pass is kept as saved and waits (see `waitingWorkings`). */
export function restoreRecords(saved, host) {
    if (saved === undefined) return emptyRecords();
    if (saved?.schema !== RECORDS_SCHEMA) fail('unsupported records save version.');
    const {bindings, log} = restoreBindings({schema: 'kernel.binding@1', bindings: saved.bindings ?? [], log: saved.log ?? []});
    return {schema: RECORDS_SCHEMA,
        workings: Object.fromEntries(Object.entries(saved.workings ?? {}).map(([id, entry]) => [id, {...plain(entry),
            record: host.laws[entry.law] ? restoreWorking(host.laws[entry.law], entry.record, {ports: host.ports}) : plain(entry.record)}])),
        stored: Object.fromEntries(Object.entries(saved.stored ?? {}).map(([id, record]) => [id, restoreStored(record)])),
        bindings: bindings.map(plain), log, published: [...(saved.published ?? [])], dues: plain(saved.dues ?? [])};
}

/** Workings held in the save whose law this host was not given: kept untouched, not advanced. */
export const waitingWorkings = engine => Object.keys(engine.records.workings).filter(id => !engine.host.laws[engine.records.workings[id].law]).sort(byId);
