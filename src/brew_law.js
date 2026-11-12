// Brewing domain law (chat B, procedural foundation plan; checkpoint
// docs/gm/dispatch/foundation-b-2026-11-12/CHECKPOINT.md, BRG1-BRG8, BRC1-BRC12).
// A brew is a kernel working (kernel_working.js, KW1-KW14) whose facts carry one
// matter ledger: what came in from each lot, what is in the batch, what clings
// to the vessel and what left (vapor, waste, spill, doses). Every operation moves
// amounts between those buckets, so the ledger always balances, including after
// an interruption, because the kernel keeps the facts of every settled step.
// Names no world. Ingredient properties, reactions and numbers come from world
// packs as step options (PFP3, MR37). Amounts are whole milli-units of each
// row's own unit (TSW9); a reaction balances by its coefficients.
import {check, natural, object, positive} from './basics.js';
import {defineWorkingLaw} from './kernel_working.js';
import {advanceThermal, createThermalState, quoteThermalBatch, thermalYield} from './craft_process_thermal.js';

export const BREW_LAW_ID = 'b.brew';
export const BREW_LAW_REVISION = 1;
export const MILLI = 1000;
const BUCKETS = ['vapor', 'waste', 'spill'];

const sum = rows => Object.values(rows ?? {}).reduce((n, v) => n + v, 0);
const add = (rows, key, amount) => { if (amount) rows[key] = (rows[key] ?? 0) + amount; if (rows[key] === 0) delete rows[key]; };
const take = (rows, key, amount) => {
    check(natural(amount) && (rows[key] ?? 0) >= amount, `Not enough ${key} in the batch.`);
    add(rows, key, -amount);
};
const fresh = () => ({in: {}, batch: {}, film: {}, out: {vapor: {}, waste: {}, spill: {}}, doses: [], fuel: 0, heat: null});
const ledgerOf = facts => structuredClone(facts.brew ?? fresh());

/** Totals that must balance: everything admitted equals everything still held
 * or released. Reactions keep totals by their coefficients (checked in react). */
export function brewBalance(facts) {
    const l = facts.brew ?? fresh();
    const out = BUCKETS.reduce((n, b) => n + sum(l.out[b]), 0) + l.doses.reduce((n, d) => n + sum(d.contents), 0);
    const admitted = sum(l.in);
    const held = sum(l.batch) + sum(l.film);
    return {admitted, held, released: out, balanced: admitted === held + out};
}

function checkReaction(r) {
    check(object(r) && typeof r.id === 'string' && object(r.reactants) && object(r.products), 'A reaction needs reactants and products.');
    const total = side => Object.values(side).reduce((n, k) => { check(positive(k), 'Reaction coefficients are positive whole numbers.'); return n + k; }, 0);
    check(total(r.reactants) === total(r.products), `Reaction ${r.id} must conserve its amounts.`);
}

// Fractional extent in milli-units: the limiting reactant decides, so a short
// measure binds less rather than failing (the formula is an attractor, MR7).
function react(batch, reactions, present) {
    const trace = [];
    for (const r of [...reactions].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))) {
        checkReaction(r);
        if (r.catalyst && !present.includes(r.catalyst)) continue;
        let extent = Math.min(...Object.entries(r.reactants).map(([id, k]) => Math.floor((batch[id] ?? 0) / k)));
        if (r.limit != null) extent = Math.min(extent, r.limit);
        if (extent <= 0) continue;
        for (const [id, k] of Object.entries(r.reactants)) take(batch, id, k * extent);
        for (const [id, k] of Object.entries(r.products)) add(batch, id, k * extent);
        trace.push({reaction: r.id, extent});
    }
    return trace;
}

const vesselOf = bound => bound.vessel;
const publish = (vessel, kind, detail) => ({op: 'publish', kind, place: vessel.place, by: vessel.id, detail});

// BRG1-BRG4 as operations. Roles: every step works in a vessel; admit also
// binds a lot. A lot is {kind:'lot', id, material, amount, properties:{constituent: permille}}.
const operations = {
    admit: {roles: {vessel: 'vessel', lot: 'lot'}, settle({bound, facts, options}) {
        const lot = bound.lot, l = ledgerOf(facts);
        const amount = options.amount ?? lot.amount;
        if (!natural(amount) || amount > lot.amount) return {ok: false, reason: 'You do not hold that much.', observed: {short: true}};
        const props = Object.entries(lot.properties ?? {});
        const permille = props.reduce((n, [, p]) => n + p, 0);
        check(permille <= 1000, `Lot ${lot.id} properties exceed the whole.`);
        let placed = 0;
        for (const [constituent, p] of props) { const n = Math.floor(amount * p / 1000); add(l.batch, constituent, n); placed += n; }
        add(l.batch, `${lot.material}:matrix`, amount - placed);
        add(l.in, lot.id, amount);
        return {ok: true, facts: {brew: l}, effects: [{op: 'debit', holder: lot.id, amount}],
            observed: {added: lot.material, amount}};
    }},
    react: {roles: {vessel: 'vessel'}, settle({facts, options}) {
        const l = ledgerOf(facts);
        const trace = react(l.batch, options.reactions ?? [], options.catalysts ?? []);
        return {ok: true, facts: {brew: l, reactions: [...(facts.reactions ?? []), ...trace]}, observed: {changed: trace.length > 0}};
    }},
    // Heat runs the thermal leaf over the step's own seconds. The active
    // constituent splits into extract, degraded and untouched (conserved), the
    // fuel burned is recorded and the heat and vapor go into the vessel's place.
    heat: {roles: {vessel: 'vessel'}, settle({bound, facts, options}) {
        const l = ledgerOf(facts), vessel = vesselOf(bound);
        const {law, load, maker, program, seconds, active, extract, degraded, evaporate} = options;
        const quote = quoteThermalBatch({law, vessel: vessel.thermal, load, maker, program});
        if (!quote.ok) return {ok: false, reason: quote.reasons[0], observed: {cold: true}};
        const state = advanceThermal(law, createThermalState(law, quote), seconds);
        const effects = [publish(vessel, 'heat_released', {fuel: state.fuelSpent, temperature: state.temperature})];
        if (active && l.batch[active]) {
            const y = thermalYield(law, state, l.batch[active]);
            take(l.batch, active, y.usable + y.degraded);
            add(l.batch, extract, y.usable); add(l.batch, degraded, y.degraded);
        }
        if (evaporate && vessel.closure !== 'sealed') {
            const lost = Math.min(l.batch[evaporate.constituent] ?? 0, evaporate.amount);
            take(l.batch, evaporate.constituent, lost); add(l.out.vapor, evaporate.constituent, lost);
            if (lost) effects.push(publish(vessel, 'vapor', {constituent: evaporate.constituent, amount: lost}));
        }
        l.fuel += state.fuelSpent;
        l.heat = {temperature: state.temperature, extractionSeconds: state.extractionSeconds, degradationSeconds: state.degradationSeconds};
        return {ok: true, facts: {brew: l}, effects, observed: {temperature: Math.round(state.temperature)}};
    }},
    // Divide the batch into doses. The vessel keeps its film share (retainPermille)
    // of each constituent; the doses share the rest, remainders to the last dose.
    divide: {roles: {vessel: 'vessel'}, settle({bound, facts, options}) {
        const l = ledgerOf(facts), vessel = vesselOf(bound);
        const n = options.doses;
        if (!positive(n)) return {ok: false, reason: 'Choose how many doses to pour.'};
        const doses = Array.from({length: n}, (_, i) => ({index: l.doses.length + i, contents: {}}));
        for (const [id, amount] of Object.entries(l.batch)) {
            const film = Math.floor(amount * (vessel.retainPermille ?? 0) / 1000), each = Math.floor((amount - film) / n);
            add(l.film, id, film);
            doses.forEach((d, i) => add(d.contents, id, i === n - 1 ? amount - film - each * (n - 1) : each));
        }
        l.batch = {};
        l.doses.push(...doses);
        return {ok: true, facts: {brew: l}, observed: {doses: n}};
    }},
    // Rinse the film into waste water that leaves into the place (BRC2).
    rinse: {roles: {vessel: 'vessel'}, settle({bound, facts, options}) {
        const l = ledgerOf(facts), vessel = vesselOf(bound);
        const washed = structuredClone(l.film);
        for (const [id, amount] of Object.entries(washed)) add(l.out.waste, id, amount);
        l.film = {};
        return {ok: true, facts: {brew: l},
            effects: sum(washed) ? [publish(vessel, 'rinse_water', {water: options.water ?? 0, contents: washed})] : [],
            observed: {washed: sum(washed)}};
    }},
};

export const BREW_LAW = defineWorkingLaw({id: BREW_LAW_ID, revision: BREW_LAW_REVISION, operations});

/** After an interruption the batch stays in the vessel as an unfinished batch;
 * the host keeps it (or spills it) instead of deleting it (BRC7). */
export function unfinishedBatch(record) {
    const l = ledgerOf(record.facts);
    return {status: record.status, settledSteps: record.receipts.filter(r => r.ok).length, batch: l.batch, film: l.film,
        balance: brewBalance(record.facts)};
}

/** A spill moves what is left in the batch out into the place (a burnt-through
 * cauldron, a dropped flask). Returns new facts and the effect to publish. */
export function spillBatch(facts, vessel) {
    const l = ledgerOf(facts), spilled = structuredClone(l.batch);
    for (const [id, amount] of Object.entries(spilled)) add(l.out.spill, id, amount);
    l.batch = {};
    return {facts: {...facts, brew: l}, effect: publish(vessel, 'spill', {contents: spilled})};
}

/** Build a method from a recipe row: admit each slot in order, then the row's
 * process steps. Each slot id is a role; the host binds a lot holding the
 * measured amount to it (KW3). Effects: `publish` ops go to the world substrate
 * as written; `debit` ops go to the lot's inventory owner. */
export function brewMethod({id, revision = 1, slots, process}) {
    check(Array.isArray(slots) && slots.length && Array.isArray(process), 'A brew method needs slots and process steps.');
    const roles = {vessel: 'vessel'};
    const steps = [];
    for (const slot of slots) {
        check(!roles[slot.id], `Duplicate slot ${slot.id}.`);
        roles[slot.id] = 'lot';
        steps.push({op: 'admit', bindings: {vessel: 'vessel', lot: slot.id}, minutes: slot.minutes ?? 0,
            ...(slot.amount != null ? {options: {amount: slot.amount}} : {})});
    }
    for (const step of process) steps.push({op: step.op, bindings: {vessel: 'vessel'}, minutes: step.minutes ?? 0, options: step.options ?? {}});
    return {id, revision, law: BREW_LAW.ref, roles, steps};
}
