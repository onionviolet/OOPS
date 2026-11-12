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
import {advanceThermal, createThermalState, quoteThermalBatch, resumeThermal, stopThermal, thermalYield} from './craft_process_thermal.js';

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
const fresh = () => ({in: {}, batch: {}, film: {}, out: {vapor: {}, waste: {}, spill: {}}, doses: [], portions: [], fuel: 0, heat: null, clock: null});
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

// Move one portion of the active constituent toward the thermal leaf's split at
// the current residence. Deltas only, so repeated heat steps never double count;
// if extract has since been used, only what is still in the batch degrades.
function yieldPortion(l, law, state, portion, extract, degraded) {
    const target = thermalYield(law, state, portion.amount, portion.baseline);
    const applied = portion.applied ?? {usable: 0, degraded: 0};
    const out = Math.min(Math.max(0, portion.amount - applied.usable - applied.degraded - target.unextracted), l.batch[portion.id] ?? 0);
    take(l.batch, portion.id, out);
    let deg = Math.max(0, target.degraded - applied.degraded), use = out - deg, lifted = 0;
    if (use < 0) { lifted = Math.min(-use, l.batch[extract] ?? 0); take(l.batch, extract, lifted); deg = out + lifted; use = 0; }
    add(l.batch, extract, use); add(l.batch, degraded, deg);
    portion.applied = {usable: applied.usable + use - lifted, degraded: applied.degraded + deg};
}
// Residence of the batch so far, as the baseline of a newly admitted portion:
// late additions do not inherit the heat earlier material already had.
function residenceAt(l, vessel, at) {
    const t = vessel.thermalState ?? (l.heat ? advanceThermal(l.heat.law, l.heat.thermal, (at - l.heat.at) * 60) : null);
    if (!t) return {extractionSeconds: 0, degradationSeconds: 0};
    return {extractionSeconds: t.extractionSeconds, degradationSeconds: t.degradationSeconds};
}
const publish = (vessel, kind, detail) => ({op: 'publish', kind, place: vessel.place, by: vessel.id, detail});

// BRG1-BRG4 as operations. Roles: every step works in a vessel; admit also
// binds a lot. A lot is {kind:'lot', id, material, amount, properties:{constituent: permille}}.
const operations = {
    admit: {roles: {vessel: 'vessel', lot: 'lot'}, settle({bound, facts, options, at}) {
        const lot = bound.lot, l = ledgerOf(facts);
        const amount = options.amount ?? lot.amount;
        if (!natural(amount) || amount > lot.amount) return {ok: false, reason: 'You do not hold that much.', observed: {short: true}};
        const props = Object.entries(lot.properties ?? {});
        const permille = props.reduce((n, [, p]) => n + p, 0);
        check(permille <= 1000, `Lot ${lot.id} properties exceed the whole.`);
        let placed = 0;
        const r = residenceAt(l, bound.vessel, at);
        for (const [constituent, p] of props) {
            const n = Math.floor(amount * p / 1000); add(l.batch, constituent, n); placed += n;
            if (n) l.portions.push({id: constituent, amount: n, lot: lot.id, baseline: r});
        }
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
    // Heat keeps one thermal state per batch across steps (craft_process_thermal).
    // The burner is lit (or relit by a paid resume) at the step's start and the
    // state runs to its deadline, so two heat steps compose like one. When the
    // vessel is read from a world, its batch holder's state (W's brew steam
    // pack) is the state, so heat keeps working while nobody is at the bench and
    // humidity and vapor come from the same lit minutes. The active constituent
    // of each admitted portion splits by its own residence since admission.
    heat: {roles: {vessel: 'vessel'}, settle({bound, facts, options, at}) {
        const l = ledgerOf(facts), vessel = vesselOf(bound);
        const {law, load, maker, program, active, extract, degraded, solvent, vaporPerMinute = 0} = options;
        const before = l.heat?.thermal ?? null;
        let state;
        if (vessel.thermalState) state = vessel.thermalState;
        else {
            const start = l.clock ?? at;
            let s = before ? advanceThermal(law, before, (start - l.heat.at) * 60) : null;
            const burning = s && s.segment.at + s.segment.burnSeconds > s.elapsedSeconds;
            if (!s || !burning && s.temperature < program.targetTemperature) {
                const quote = quoteThermalBatch({law, vessel: vessel.thermal, load, maker,
                    program: {...program, startTemperature: s?.temperature ?? program.startTemperature}});
                if (!quote.ok) return {ok: false, reason: quote.reasons[0], observed: {cold: true}};
                s = s ? resumeThermal(law, s, quote) : createThermalState(law, quote);
            }
            state = advanceThermal(law, s, (at - start) * 60);
        }
        const fuel = state.fuelSpent - (before?.fuelSpent ?? 0);
        const effects = fuel > 0 ? [publish(vessel, 'heat_released', {fuel, temperature: state.temperature})] : [];
        if (active) for (const portion of l.portions.filter(p => p.id === active)) yieldPortion(l, law, state, portion, extract, degraded);
        // A minute steams when the burner is lit at its start, as in brew_steam.js.
        const litMinutes = Math.ceil(fuel / state.segment.fuelPerSecond / 60 - 1e-9);
        if (solvent && vaporPerMinute && vessel.closure !== 'sealed') {
            const lost = Math.min(l.batch[solvent] ?? 0, litMinutes * vaporPerMinute);
            take(l.batch, solvent, lost); add(l.out.vapor, solvent, lost);
            // In a world the brew steam pack already wrote this into humidity.
            if (lost && !vessel.thermalState) effects.push(publish(vessel, 'vapor', {constituent: solvent, amount: lost}));
        }
        l.fuel = state.fuelSpent;
        l.heat = {at, thermal: state, law};
        return {ok: true, facts: {brew: l}, effects, observed: {temperature: Math.round(state.temperature)}};
    }},
    // A part's own preparation (crush, slice, stew), a nested step of its slot
    // (BRG3, PGB2). It records the preparation on the lot; amounts are moved
    // only when the lot is admitted, so the ledger stays balanced.
    prepare: {roles: {vessel: 'vessel', lot: 'lot'}, settle({bound, facts, options, at}) {
        const l = ledgerOf(facts);
        if (typeof options.how !== 'string' || !options.how) return {ok: false, reason: 'Say how the part is prepared.'};
        (l.prepared ??= {})[bound.lot.id] = {how: options.how, at};
        return {ok: true, facts: {brew: l}, observed: {prepared: bound.lot.material, how: options.how}};
    }},
    // Take the vessel off the heat: the burner stops, the batch keeps its
    // residence and cools from here (craft_process_thermal stopThermal).
    cool: {roles: {vessel: 'vessel'}, settle({facts, at}) {
        const l = ledgerOf(facts);
        if (l.heat?.law) {
            const settled = advanceThermal(l.heat.law, l.heat.thermal, (at - l.heat.at) * 60);
            l.heat = {at, thermal: stopThermal(l.heat.law, settled), law: l.heat.law};
        }
        l.offHeat = true;
        return {ok: true, facts: {brew: l}, observed: {offHeat: true}};
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

// Every operation stamps the ledger clock (the next step's start) and, when the
// vessel is read from a world, keeps the batch's thermal state as last read.
const stamped = Object.fromEntries(Object.entries(operations).map(([op, def]) => [op, {...def, settle(args) {
    const result = def.settle(args);
    if (!result.ok) return result;
    const brew = result.facts?.brew ?? ledgerOf(args.facts);
    brew.clock = args.at;
    const t = args.bound.vessel?.thermalState;
    if (t && op !== 'heat') brew.heat = {at: args.at, thermal: t, law: brew.heat?.law ?? null};
    return {...result, facts: {...result.facts, brew}};
}}]));

export const BREW_LAW = defineWorkingLaw({id: BREW_LAW_ID, revision: BREW_LAW_REVISION, operations: stamped});

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
