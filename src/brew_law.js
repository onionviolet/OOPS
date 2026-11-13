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
import {advanceThermal, createThermalState, quoteThermalBatch, resumeThermal, stopThermal, thermalWindowSeconds, thermalYield} from './craft_process_thermal.js';
import {readSpoilage} from './spoilage.js';
import {fractionContents, matchesFraction, normalizeConstituents, separateProcessBatch, splitProcessServing} from './craft_process_separation.js';
import {drawFraction} from './gen_kit.js';
import {WORLD_EFFECT_KINDS as K} from './world_quantities.js';
import {residueQuantity} from './world_substrate_packs/residue_flow.js';
import {brewFlaskStamp, measuredBrewShare, setBrewLotStorage, setBrewStorage} from './engine_brew_stock.js';

// Effect kinds the brew law publishes into a place, in W's vocabulary (W-B8).
const spillContact = 'brew.spill-contact';
export const BREW_SPLASH = 'brew.splash';
export const BREW_PUBLISHES = Object.freeze([K.heat_released.id, K.vapor_released.id, K.water_poured.id, spillContact, BREW_SPLASH]);

export const BREW_LAW_ID = 'b.brew';
export const BREW_LAW_REVISION = 1;
export const MILLI = 1000;
// retained: what stays with the maker outside the batch (strained solids, spent stock).
const BUCKETS = ['vapor', 'waste', 'spill', 'retained', 'lining'];

const sum = rows => Object.values(rows ?? {}).reduce((n, v) => n + v, 0);
const add = (rows, key, amount) => { if (amount) rows[key] = (rows[key] ?? 0) + amount; if (rows[key] === 0) delete rows[key]; };
const take = (rows, key, amount) => {
    check(natural(amount) && (rows[key] ?? 0) >= amount, `Not enough ${key} in the batch.`);
    add(rows, key, -amount);
};
const fresh = () => ({in: {}, batch: {}, film: {}, out: {vapor: {}, waste: {}, spill: {}, retained: {}}, doses: [], portions: [], fuel: 0, heat: null, clock: null});
const ledgerOf = facts => { const l = structuredClone(facts.brew ?? fresh()); l.out.retained ??= {}; return l; };

// Origin is a claim about all of a constituent in this bucket. Combining
// different or unknown sources drops the claim, while keeping the mass.
function admitOrigin(ledger, part, amount, origin) {
    const previous = Object.hasOwn(ledger.origins ?? {}, part) ? ledger.origins[part] : undefined;
    if (origin && (!ledger.batch[part] || previous === origin)) {
        (ledger.origins ??= Object.create(null))[part] = origin;
    } else if (previous) delete ledger.origins[part];
    add(ledger.batch, part, amount);
}

function pickOrigins(ledger, contents) {
    return Object.fromEntries(Object.entries(ledger.origins ?? {}).filter(([part]) => Object.hasOwn(contents, part)));
}

function ageFraction(packet, contents) {
    const remaining = {...contents};
    const constituents = [];
    for (const row of normalizeConstituents(packet.constituents)) {
        const active = row.id.endsWith(':spent') ? row.amount : Math.min(row.amount, remaining[row.id] ?? 0);
        if (active) {
            constituents.push({...row, amount: active});
            remaining[row.id] -= active;
        }
        if (active < row.amount) constituents.push({...row, id: `${row.id}:spent`, amount: row.amount - active});
    }
    return {...packet, constituents: normalizeConstituents(constituents)};
}

// PTD5: what a brewer can see. A cue is a share of the batch a world names
// ("Lilac" when the intermediate is at least 9% of it). Truth stays in facts.
export function batchCues(batch, cues = []) {
    const mass = sum(batch);
    return cues.filter(c => mass > 0 && (batch[c.constituent] ?? 0) * 1000 >= mass * c.atLeastPermille).map(c => c.cue);
}

// PTD2: freshness. A lot's age (minutes, times its storage rate) spends part of
// its constituents before they go in, into "<id>:spent", which stays with the
// maker. Either an absolute loss per day (`ageing: {constituent, perDay}`), or,
// for a good the spoilage owner knows (`key`), the share of its life used.
// A host may report elapsed minutes as of storageSince. Older descriptors
// supply a fixed elapsed age with no clock anchor.
function lotAgeAt(lot, at) {
    if (lot.lotStorage) {
        const {spent, since, rate} = lot.lotStorage;
        check(natural(since) && natural(at) && since <= at && Number.isFinite(spent) && spent >= 0 &&
            Number.isFinite(rate) && rate >= 0, 'An ageing ingredient needs a valid storage interval.');
        return spent + (at - since) * rate;
    }
    const {storageSince} = lot;
    const storageRate = lot.storageRate ?? 1;
    const prior = lot.spent ?? 0;
    if (storageSince !== undefined) check(natural(storageSince) && natural(at) && at >= storageSince &&
        Number.isFinite(prior) && prior >= 0 && Number.isFinite(storageRate) && storageRate >= 0,
    'An ageing ingredient needs a valid storage interval.');
    const elapsed = storageSince === undefined ? prior : prior + (at - storageSince);
    return elapsed * storageRate;
}

export function brewLotAgeLoss(lot, constituent, amount, at) {
    const spent = lotAgeAt(lot, at);
    if (!spent) return 0;
    if (lot.ageing) {
        return lot.ageing.constituent === constituent ? Math.min(amount, Math.floor(spent * lot.ageing.perDay / 1440)) : 0;
    }
    const read = lot.key && !constituent.endsWith(':matrix') && readSpoilage(lot.key, spent);
    return !read ? 0 : read.state === 'spoiled' ? amount : Math.floor(amount * Math.min(read.spent, read.life) / read.life);
}

function ageParts(lot, parts, at) {
    let aged = false;
    for (const [id, amount] of Object.entries(parts)) {
        const lost = brewLotAgeLoss(lot, id, amount, at);
        if (!lost) continue;
        parts[id] -= lost;
        parts[`${id}:spent`] = (parts[`${id}:spent`] ?? 0) + lost;
        aged = true;
    }
    return aged;
}

function measuredLotParts(lot, amount) {
    const props = Object.entries(lot.properties ?? {});
    check(props.reduce((n, [, p]) => n + p, 0) <= 1000, `Lot ${lot.id} properties exceed the whole.`);
    const parts = {};
    let placed = 0;
    for (const [id, fraction] of props) {
        const units = Math.floor(amount * fraction / 1000);
        parts[id] = units;
        placed += units;
    }
    parts[`${lot.material}:matrix`] = amount - placed;
    return parts;
}

// PTD1: a preparation form changes a part's constituents before it goes in
// (crushing frees more juice than slicing). Changes are {from, to, num, den},
// conserved: `to` gets floor(from * num / den), the rest stays as `from`.
function prepareParts(parts, changes = []) {
    for (const {from, to, num, den} of changes) {
        check(positive(den) && natural(num) && num <= den, 'A preparation change is a share num/den.');
        const moved = Math.floor((parts[from] ?? 0) * num / den);
        parts[from] -= moved; parts[to] = (parts[to] ?? 0) + moved;
    }
}

/** PTD8: shelf life of a finished dose, through the spoilage owner when it
 * knows the good (`key`), or a stated `life` dial in minutes otherwise. The
 * spent share of each active constituent moves to "<id>:spent"; nothing
 * vanishes. Returns a new dose and the spoilage reading. */
export function ageDose(dose, {key, spent, rate = 1, life, keep = []}) {
    const read = key ? readSpoilage(key, spent, {rate}) : null;
    const span = read?.life ?? life;
    check(positive(span ?? 0), 'Give a perishable key or a life in minutes.');
    const used = Math.min(span, (read?.spent ?? spent * rate));
    const contents = {};
    for (const [id, n] of Object.entries(dose.contents)) {
        if (id.endsWith(':matrix') || id.endsWith(':spent') || keep.includes(id)) { add(contents, id, n); continue; }
        const lost = Math.floor(n * used / span);
        add(contents, id, n - lost); add(contents, `${id}:spent`, lost);
    }
    return {dose: {...dose, contents}, state: read?.state ?? (used >= span ? 'spoiled' : used > span / 2 ? 'turning' : 'fresh')};
}

export function storedBrewDose(contents, storage, at) {
    if (!storage) return {dose: {contents}};
    return ageDose({contents}, {...storage, rate: 1, spent: brewStorageAge(storage, at)});
}

function brewStorageAge({bottledAt, since = bottledAt, spent = 0, rate = 1}, at) {
    check(natural(bottledAt) && bottledAt <= at, 'Invalid brew bottling time.');
    check(natural(since) && bottledAt <= since && since <= at && Number.isFinite(spent) && spent >= 0 &&
        Number.isFinite(rate) && rate >= 0, 'Invalid brew storage interval.');
    return spent + (at - since) * rate;
}

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
    check(r.limitPermille == null || natural(r.limitPermille) && r.limitPermille <= 1000,
        `Reaction ${r.id} needs a rate between 0 and 1000 per mille.`);
    check(Object.entries(r.productOrigins ?? {}).every(([part, origin]) =>
        Object.hasOwn(r.products, part) && typeof origin === 'string' && origin.length),
    'A product origin must name a reaction product and an origin.');
}

// Fractional extent in milli-units: the limiting reactant decides, so a short
// measure binds less rather than failing (the formula is an attractor, MR7).
export function reactiveBrewAmount(amount, limitPermille) {
    return limitPermille == null ? amount : Number(BigInt(amount) * BigInt(limitPermille) / 1000n);
}

function reactionExtent(batch, r, present, shortfall) {
    if (r.catalyst && !present.includes(r.catalyst)) return 0;
    let extent = Math.min(...Object.entries(r.reactants).map(([id, k]) => {
        const amount = batch[id] ?? 0;
        const available = reactiveBrewAmount(amount, r.limitPermille);
        return Math.floor(available / k);
    }));
    if (r.limit != null) extent = Math.min(extent, r.limit);
    if (shortfall) extent -= Math.floor(extent * shortfall(r) / 1000);
    return extent;
}

function applyReaction(batch, r, extent) {
    for (const [id, k] of Object.entries(r.reactants)) take(batch, id, k * extent);
    for (const [id, k] of Object.entries(r.products)) add(batch, id, k * extent);
    return {reaction: r.id, extent};
}

export function recordThermalPortion(ledger, part, amount, since) {
    if (!amount) return;
    const portions = ledger.thermalPortions ??= Object.create(null);
    const rows = Object.hasOwn(portions, part) ? portions[part] : (portions[part] = []);
    if (rows.at(-1)?.since === since) rows.at(-1).amount += amount;
    else rows.push({amount, since});
}

export function consumeThermalPortions(ledger, part, amount) {
    const portions = ledger.thermalPortions;
    const rows = Object.hasOwn(portions ?? {}, part) ? portions[part] : [];
    // When an operation does not name a portion, debit the oldest first.
    while (amount && rows.length) {
        const used = Math.min(amount, rows[0].amount);
        rows[0].amount -= used;
        amount -= used;
        if (!rows[0].amount) rows.shift();
    }
    if (!rows.length && portions) delete portions[part];
}

function reconcileThermalPortions(ledger, at) {
    for (const part of Object.keys(ledger.thermalPortions ?? {}))
        if (!Object.hasOwn(ledger.batch, part)) delete ledger.thermalPortions[part];
    for (const [part, amount] of Object.entries(ledger.batch)) {
        const tracked = Object.hasOwn(ledger.thermalPortions ?? {}, part) ?
            ledger.thermalPortions[part].reduce((total, portion) => total + portion.amount, 0) : 0;
        if (tracked > amount) consumeThermalPortions(ledger, part, tracked - amount);
        else if (tracked < amount) recordThermalPortion(ledger, part, amount - tracked, at);
    }
    if (!Object.keys(ledger.thermalPortions ?? {}).length) delete ledger.thermalPortions;
}

function react(ledger, reactions, present, shortfall, eligible, at, qualifiedStock) {
    const trace = [];
    for (const r of [...reactions].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))) {
        checkReaction(r);
        if (!eligible(r)) continue;
        if (!Object.entries(r.requiresOrigins ?? {}).every(([part, origin]) =>
            Object.hasOwn(ledger.origins ?? {}, part) && ledger.origins[part] === origin)) continue;
        const stock = r.temperatureResidence === 'portions' ? qualifiedStock(r) : ledger.batch;
        const extent = reactionExtent(stock, r, present, shortfall);
        if (extent <= 0) continue;
        for (const [part, coefficient] of Object.entries(r.reactants)) {
            take(ledger.batch, part, coefficient * extent);
            consumeThermalPortions(ledger, part, coefficient * extent);
        }
        for (const [part, coefficient] of Object.entries(r.products)) {
            const origin = Object.hasOwn(r.productOrigins ?? {}, part) ? r.productOrigins[part] : undefined;
            admitOrigin(ledger, part, coefficient * extent, origin);
            recordThermalPortion(ledger, part, coefficient * extent, at);
            (ledger.constituentSince ??= Object.create(null))[part] = at;
        }
        trace.push({reaction: r.id, extent});
    }
    return trace;
}

function heldCatalyst({vessel, catalyst}, requirements) {
    const {part, minimum} = requirements ?? {};
    check(typeof part === 'string' && part.length && positive(minimum), 'A bound catalyst needs a constituent and minimum.');
    if (!catalyst.holder || !vessel.holder || catalyst.holder === vessel.holder ||
        !catalyst.place || catalyst.place !== vessel.place) return [];
    const fraction = Object.hasOwn(catalyst.properties, part) ? catalyst.properties[part] : 0;
    return natural(catalyst.amount) && natural(fraction) && fraction <= 1000 &&
        BigInt(catalyst.amount) * BigInt(fraction) / 1000n >= BigInt(minimum) ? [part] : [];
}

// PC19. Each firing can make an earlier candidate eligible. A cascade scans
// its local set again after each firing. A step at its limit settles only if
// the batch has reached a state with no eligible reaction.
function cascade(batch, {reactions, maxFirings, catalysts = []}, temperature) {
    check(Array.isArray(reactions) && reactions.length > 0 && positive(maxFirings), 'A cascade needs reactions and a positive firing limit.');
    const ids = new Set();
    for (const r of reactions) {
        checkReaction(r);
        check(!r.requiresOrigins && !r.productOrigins, 'Source-specific reactions use a staged reaction.');
        check(!ids.has(r.id) && Number.isSafeInteger(r.priority) && Object.keys(r.reactants).length > 0 &&
            (r.limit == null || natural(r.limit)), 'A cascade needs distinct reactions with priorities and valid amounts.');
        check((r.minTemperature === undefined || Number.isFinite(r.minTemperature)) &&
            (r.maxTemperature === undefined || Number.isFinite(r.maxTemperature)) &&
            (r.minTemperature ?? -Infinity) <= (r.maxTemperature ?? Infinity), 'Invalid cascade temperature window.');
        ids.add(r.id);
    }
    const candidates = [...reactions].sort((a, b) => b.priority - a.priority || (a.id < b.id ? -1 : 1))
        .filter(r => r.minTemperature === undefined && r.maxTemperature === undefined ||
            Number.isFinite(temperature) && temperature >= (r.minTemperature ?? -Infinity) && temperature <= (r.maxTemperature ?? Infinity));
    const trace = [];
    for (;;) {
        let firing;
        for (const r of candidates) {
            const extent = reactionExtent(batch, r, catalysts, null);
            if (extent > 0) { firing = {r, extent}; break; }
        }
        if (!firing) return trace;
        if (trace.length === maxFirings) return null;
        trace.push(applyReaction(batch, firing.r, firing.extent));
    }
}

const vesselOf = bound => bound.vessel;

function takeVesselFilm(ledger, vessel) {
    if (ledger.vesselTaken) return [];
    ledger.vesselTaken = true;
    let carried = 0;
    for (const {id, amount} of vessel.films ?? []) {
        admitOrigin(ledger, id, amount);
        carried += amount;
    }
    if (!carried) return [];
    add(ledger.in, `vessel:${vessel.id}`, carried);
    return [{op: 'clear-films', holder: vessel.id, amount: carried}];
}

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

function breach({bound: {vessel, target}, facts, options}) {
    const {constituent, minimum, contact} = options;
    check(typeof constituent === 'string' && positive(minimum), 'A breach needs a constituent and threshold.');
    if ((facts.brew?.batch[constituent] ?? 0) < minimum) return {ok: true, observed: {breached: false}};
    const condition = vessel.quantities?.condition;
    if (!vessel.holder || !natural(condition)) return {ok: false, reason: 'breach-condition-unavailable'};
    const spill = spillBatch(facts, vessel);
    const effects = [{op: 'add', holder: vessel.holder, quantity: 'condition', amount: -condition}];
    if (target?.holder && target.place === vessel.place && contact) {
        check(natural(contact.permille) && contact.permille <= 1000 && typeof contact.harm === 'string', 'Invalid spill contact.');
        const contents = {};
        for (const [id, amount] of Object.entries(spill.effect.detail.contents)) {
            const touched = Number(BigInt(amount) * BigInt(contact.permille) / 1000n);
            add(contents, id, touched);
            take(spill.effect.detail.contents, id, touched);
        }
        if (sum(contents)) effects.push(publish(vessel, spillContact, {target: target.holder, contents}));
        if (contents[constituent]) effects.push(publish(vessel, 'living.harm',
            {target: target.holder, kind: contact.harm, amount: contents[constituent]}));
    }
    effects.push(spill.effect);
    return {ok: true, facts: spill.facts, effects, observed: {breached: true}};
}

function flameAt(ledger, vessel, at) {
    const thermal = vessel.thermalState ?? (ledger.heat?.law
        ? advanceThermal(ledger.heat.law, ledger.heat.thermal, (at - ledger.heat.at) * 60) : null);
    if (!thermal) return ledger.offHeat ? {active: false} : null;
    return {active: thermal.segment.at + thermal.segment.burnSeconds > thermal.elapsedSeconds,
        temperature: Math.round(thermal.temperature)};
}

export function checkBrewTemperatureWindow({minTemperature, maxTemperature, minTemperatureSeconds, temperatureResidence}) {
    check((minTemperature === undefined || Number.isFinite(minTemperature)) &&
        (maxTemperature === undefined || Number.isFinite(maxTemperature)) &&
        (minTemperature ?? -Infinity) <= (maxTemperature ?? Infinity), 'Invalid reaction temperature window.');
    check(minTemperatureSeconds === undefined || positive(minTemperatureSeconds) &&
        Number.isFinite(minTemperature) && Number.isFinite(maxTemperature) && minTemperature < maxTemperature,
    'Thermal residence needs a positive duration and a bounded temperature range.');
    check(temperatureResidence === undefined ||
        ['batch', 'reactants', 'portions'].includes(temperatureResidence) && minTemperatureSeconds !== undefined,
    'Thermal residence scope needs a minimum exposure.');
}

// A mixed constituent qualifies once its newest material has had enough time.
// Old records without a constituent clock can credit only the current stage.
export function reactantResidenceSeconds(row, since, at, stageStart) {
    return (at - Math.max(...Object.keys(row.reactants).map(part =>
        Object.hasOwn(since ?? {}, part) ? since[part] : stageStart))) * 60;
}

export function inBrewTemperatureWindow(row, temperature, law, state, seconds) {
    const {minTemperature, maxTemperature, minTemperatureSeconds} = row;
    if (minTemperatureSeconds !== undefined)
        return Boolean(law && state && thermalWindowSeconds(law, state,
            row.temperatureResidence === 'batch' ? state.elapsedSeconds : seconds, row) >= minTemperatureSeconds);
    if (minTemperature === undefined && maxTemperature === undefined) return true;
    return Number.isFinite(temperature) && temperature >= (minTemperature ?? -Infinity) &&
        temperature <= (maxTemperature ?? Infinity);
}

export function heatQualifiedAmount(ledger, part, row, law, state, at) {
    const portions = Object.hasOwn(ledger.thermalPortions ?? {}, part) ? ledger.thermalPortions[part] : [];
    return portions.reduce((total, portion) => total +
        (inBrewTemperatureWindow(row, undefined, law, state, (at - portion.since) * 60) ? portion.amount : 0), 0);
}

// Both planning and settlement use the same finite paid burner window.
export function paidBrewHeatWindow(vessel, {law, load, maker, program}, state, seconds, available) {
    const quote = quoteThermalBatch({law, vessel: vessel.thermal, load,
        maker: {...maker, fuelStock: Number.MAX_SAFE_INTEGER}, holdWarm: true,
        program: {...program, startTemperature: state?.temperature ?? program.startTemperature}});
    if (!quote.ok) return {reason: quote.reasons[0]};
    const windowFuel = seconds * quote.fuelPerSecond;
    const fuel = Math.min(available, quote.costs.fuel, windowFuel);
    const litThroughWindow = seconds > 0 && fuel >= windowFuel;
    const burning = state ? resumeThermal(law, state, quote, {fuel, retainHistory: true}) : createThermalState(law, quote, {fuel});
    return {state: advanceThermal(law, burning, seconds), litThroughWindow};
}

function settleSeparation(op) {
    return ({bound: {vessel}, facts, options}) => {
        const l = ledgerOf(facts);
        if ((!sum(l.batch) && !l.fraction?.volume) || !vessel.separator) return {ok: false, reason: 'filter-or-batch-unavailable'};
        if (l.fraction && !matchesFraction(l.fraction, l.batch)) return {ok: false, reason: 'fraction-changed-before-filter'};
        const packet = l.fraction ?? {volume: options.volume,
            constituents: Object.entries(l.batch).map(([id, amount]) => ({id, amount, phase: options.phases?.[id] ?? 'dissolved'}))};
        if (!positive(packet.volume) || packet.volume > vessel.separator.capacity)
            return {ok: false, reason: 'filter-volume-unavailable'};
        const volume = options.takeVolume ?? packet.volume;
        if (!positive(volume) || volume > packet.volume) return {ok: false, reason: 'separation-volume-unavailable'};
        if (op === 'distill' && vessel.separator.closure !== 'reflux')
            return {ok: false, reason: 'condenser-unavailable'};
        const split = separateProcessBatch(options.law, packet, {op, volume},
            {...vessel.separator, id: vessel.id, films: [], remainders: l.condenserRemainders});
        const effects = [];
        const debits = new Map();
        for (const [cost, quantity] of Object.entries(vessel.separator.accounts ?? {})) {
            const amount = split.costs[cost];
            const owed = (debits.get(quantity) ?? 0) + amount;
            if (!natural(amount) || !vessel.holder || !(vessel.quantities?.[quantity] >= owed))
                return {ok: false, reason: 'filter-cost-unavailable'};
            debits.set(quantity, owed);
        }
        for (const [quantity, amount] of debits) effects.push({op: 'add', holder: vessel.holder, quantity, amount: -amount});
        const contents = fractionContents(split.product);
        l.batch = fractionContents(split.residue);
        l.fraction = split.residue;
        for (const row of split.vessel.films) add(l.film, row.id, row.amount);
        const origins = pickOrigins(l, contents);
        if (l.origins) l.origins = pickOrigins(l, l.batch);
        if (sum(contents) || split.product.volume) l.doses.push({index: l.doses.length, contents, fraction: split.product,
            ...(Object.keys(origins).length ? {origins} : {})});
        if (op === 'distill') {
            l.condenserRemainders = split.vessel.remainders;
            const escaped = fractionContents(split.exit);
            for (const [id, amount] of Object.entries(escaped)) add(l.out.vapor, id, amount);
            if (split.exit.volume || sum(escaped)) effects.push(publish(vessel, K.vapor_released.id, split.exit));
            return {ok: true, facts: {brew: l}, effects, observed: {captured: sum(contents), escaped: sum(escaped),
                retained: sum(l.batch), costs: split.costs}};
        }
        return {ok: true, facts: {brew: l}, effects, observed: {filtered: sum(contents), retained: sum(l.batch), costs: split.costs}};
    };
}

function rinseSurface({bound: {target, solvent}, facts, options}) {
    const {part, amount, removalPerUnit = 1, solventPart} = options;
    check(typeof part === 'string' && part.length && positive(amount) && positive(removalPerUnit),
        'A surface rinse needs a constituent, solvent measure and removal rate.');
    if (!target.holder || !solvent.holder || !target.place || target.place !== solvent.place)
        return {ok: false, reason: 'rinse-solvent-out-of-reach'};
    if (solvent.amount < amount) return {ok: false, reason: 'rinse-solvent-unavailable'};
    const quantity = residueQuantity(part);
    // Legacy rinses use the whole solvent. A selective scrub uses only its
    // measured soluble constituent, evaluated from the bound lot at settlement.
    let concentration = MILLI;
    if (solventPart !== undefined)
        concentration = Object.hasOwn(solvent.properties, solventPart) ? solvent.properties[solventPart] : 0;
    check(natural(concentration) && concentration <= MILLI, 'A surface solvent needs a whole constituent permille.');
    const strength = Number(BigInt(amount) * BigInt(concentration) / BigInt(MILLI));
    const washed = Math.min(target.quantities[quantity] ?? 0, strength * removalPerUnit);
    const l = ledgerOf(facts);
    add(l.in, solvent.id, amount);
    add(l.in, `surface:${target.holder}`, washed);
    const contents = {[solvent.material]: amount};
    add(contents, part, washed);
    for (const [id, units] of Object.entries(contents)) add(l.out.waste, id, units);
    return {ok: true, facts: {brew: l}, effects: [
        {op: 'debit', holder: solvent.id, amount},
        ...(washed ? [{op: 'add', holder: target.holder, quantity, amount: -washed}] : []),
        publish(target, K.water_poured.id, {what: 'rinse', contents}),
    ], observed: {washed}};
}

// BRG1-BRG4 as operations. Roles: every step works in a vessel; admit also
// binds a lot. A lot is {kind:'lot', id, material, amount, properties:{constituent: permille}}.
const operations = {
    'change-lot-storage': {roles: {lot: 'lot', storage: 'storage'}, settle({bound: {lot, storage}, at}) {
        if (!lot.holder || !storage.holder || !lot.place || lot.place !== storage.place || lot.holder === storage.holder)
            return {ok: false, reason: 'brew-storage-out-of-reach'};
        if (!positive(lot.amount) || (!lot.ageing && !lot.key)) return {ok: false, reason: 'brew-storage-profile-unavailable'};
        const permille = storage.properties.brew_storage_rate;
        if (!natural(permille)) return {ok: false, reason: 'brew-storage-rate-unavailable'};
        return {ok: true, effects: [setBrewLotStorage(lot.holder, {
            spent: lotAgeAt(lot, at), since: at, rate: permille / 1000, compositionRevision: lot.compositionRevision ?? null,
        })], observed: {storage: storage.holder}};
    }},
    'change-flask-storage': {roles: {flask: 'flask', storage: 'storage'}, settle({bound: {flask, storage}, at}) {
        if (!flask.holder || !storage.holder || !flask.place || flask.place !== storage.place || flask.holder === storage.holder)
            return {ok: false, reason: 'brew-storage-out-of-reach'};
        if (!flask.brewStorage || flask.brewEmpty) return {ok: false, reason: 'brew-storage-profile-unavailable'};
        const permille = storage.properties.brew_storage_rate;
        if (!natural(permille)) return {ok: false, reason: 'brew-storage-rate-unavailable'};
        const spent = brewStorageAge(flask.brewStorage, at);
        return {ok: true, effects: [setBrewStorage(flask.holder, {
            ...flask.brewStorage, spent, since: at, rate: permille / 1000,
        })], observed: {storage: storage.holder}};
    }},
    admit: {roles: {vessel: 'vessel', lot: 'lot'}, settle({bound, facts, options, at}) {
        const lot = bound.lot, l = ledgerOf(facts), vessel = vesselOf(bound);
        if (lot.holder && (!vessel.holder || !lot.place || lot.place !== vessel.place || lot.holder === vessel.holder))
            return {ok: false, reason: 'ingredient-out-of-reach'};
        if (options.compositionRevision !== undefined && options.compositionRevision !== lot.compositionRevision)
            return {ok: false, reason: 'ingredient-composition-changed'};
        if (options.origin !== undefined && options.origin !== lot.origin)
            return {ok: false, reason: 'ingredient-origin-changed'};
        const amount = options.amount ?? lot.amount;
        if (!natural(amount) || amount > lot.amount) return {ok: false, reason: 'You do not hold that much.', observed: {short: true}};
        const parts = measuredLotParts(lot, amount);
        const aged = ageParts(lot, parts, at);
        const prep = l.prepared?.[lot.id];
        prepareParts(parts, prep?.changes);
        const {recoverSpent = [], minimumContents = {}} = options;
        check(Array.isArray(recoverSpent) && recoverSpent.every(part => typeof part === 'string' && part.endsWith(':spent')),
            'Recovered ingredient fractions must name spent constituents.');
        const retained = constituent => (constituent.endsWith(':spent') && !recoverSpent.includes(constituent)) ||
            (prep?.admitOnly && !prep.admitOnly.includes(constituent));
        for (const [part, minimum] of Object.entries(minimumContents)) {
            check(natural(minimum), 'An ingredient minimum needs a whole measure.');
            const available = !retained(part) && Object.hasOwn(parts, part) ? parts[part] : 0;
            if (available < minimum) return {ok: false, reason: 'ingredient-below-assayed-minimum'};
        }
        // PTD4: what the vessel's lining kept from earlier brews comes back into this one, once.
        const filmEffects = takeVesselFilm(l, vessel);
        const r = residenceAt(l, vessel, at);
        for (const [constituent, n] of Object.entries(parts)) {
            if (!n) continue;
            if (retained(constituent)) { add(l.out.retained, constituent, n); continue; }
            admitOrigin(l, constituent, n, typeof lot.origin === 'string' ? lot.origin : undefined);
            if (!constituent.endsWith(':matrix')) l.portions.push({id: constituent, amount: n, lot: lot.id, baseline: r});
        }
        add(l.in, lot.id, amount);
        return {ok: true, facts: {brew: l}, effects: [{op: 'debit', holder: lot.id, amount}, ...filmEffects],
            observed: {added: lot.material, amount, ...(aged ? {aged: true} : {}),
                cues: batchCues(l.batch, options.cues)}};
    }},
    // PTD6: `variationPermille` lets each batch fall short of the full extent by
    // an addressed draw, so two batches of one recipe differ and a reload repeats.
    react: {roles: {vessel: 'vessel'}, settle(args) {
        const {bound, options, address, at} = args;
        let heated = null;
        if (options.heating) {
            const {law, load, maker, program} = options.heating;
            if (!bound.vessel.fuelAccount) return {ok: false, reason: 'heat-fuel-account-unavailable'};
            heated = operations.heat.settle({...args, options: {law, load, maker, program, reactionWindow: true}});
        }
        if (heated && !heated.ok) return heated;
        const facts = heated?.facts ?? args.facts;
        const l = ledgerOf(facts);
        const rows = options.reactions ?? [];
        reconcileThermalPortions(l, at);
        const readsHeat = rows.some(row => row.activeHeat !== undefined || row.minTemperature !== undefined || row.maxTemperature !== undefined);
        const flame = readsHeat ? heated?.observed.flame ?? flameAt(l, bound.vessel, at) : null;
        // The stage starts at the previous settled operation. An earlier wait
        // cannot satisfy this reaction's own residence time.
        const elapsed = at - (l.clock ?? at);
        const thermalLaw = l.heat?.law;
        const readsResidence = rows.some(row => row.minTemperatureSeconds !== undefined);
        const thermal = readsResidence ? heated?.thermalWindow ??
            (!bound.vessel.thermalState && thermalLaw ? advanceThermal(thermalLaw, l.heat.thermal, (at - l.heat.at) * 60) : null) : null;
        const shortfall = options.variationPermille ? r => Math.floor(options.variationPermille * drawFraction('b.brew', `${address}/${r.id}`)) : null;
        const eligible = row => {
            check(row.minMinutes === undefined || natural(row.minMinutes), 'A reaction needs a whole-minute minimum.');
            checkBrewTemperatureWindow(row);
            const origins = Object.entries(row.requiresOrigins ?? {});
            check(origins.every(([part, origin]) => Object.hasOwn(row.reactants, part) && typeof origin === 'string' && origin),
                'An origin requirement must name a reactant and an origin.');
            const seconds = row.temperatureResidence === 'reactants'
                ? reactantResidenceSeconds(row, l.constituentSince, at, l.clock ?? at) : elapsed * 60;
            return elapsed >= (row.minMinutes ?? 0) && (row.activeHeat === undefined || row.activeHeat === flame?.active) &&
                (row.temperatureResidence === 'portions' || inBrewTemperatureWindow(row, flame?.temperature, thermalLaw, thermal, seconds));
        };
        const qualifiedStock = row => Object.fromEntries(Object.keys(row.reactants).map(part =>
            [part, heatQualifiedAmount(l, part, row, thermalLaw, thermal, at)]));
        const trace = react(l, rows, options.catalysts ?? [], shortfall, eligible, at, qualifiedStock);
        return {ok: true, facts: {brew: l, reactions: [...(facts.reactions ?? []), ...trace]},
            ...(heated ? {effects: heated.effects} : {}),
            observed: {...heated?.observed, changed: trace.length > 0, cues: batchCues(l.batch, options.cues), ...(flame ? {flame} : {})}};
    }},
    cascade: {roles: {vessel: 'vessel'}, settle({bound, facts, options, at}) {
        const l = ledgerOf(facts);
        const current = bound.vessel.thermalState ?? (l.heat?.law
            ? advanceThermal(l.heat.law, l.heat.thermal, (at - l.heat.at) * 60) : null);
        const trace = cascade(l.batch, options, current?.temperature);
        if (!trace) return {ok: false, reason: 'cascade-firing-limit', observed: {unsettled: true}};
        const reactions = new Map(options.reactions.map(row => [row.id, row]));
        for (const {reaction: id, extent} of trace) {
            const reaction = reactions.get(id);
            for (const [part, coefficient] of Object.entries(reaction.reactants))
                consumeThermalPortions(l, part, coefficient * extent);
            for (const [part, coefficient] of Object.entries(reaction.products)) {
                (l.constituentSince ??= Object.create(null))[part] = at;
                recordThermalPortion(l, part, coefficient * extent, at);
            }
        }
        return {ok: true, facts: {brew: l, reactions: [...(facts.reactions ?? []), ...trace]},
            observed: {changed: trace.length > 0, cues: batchCues(l.batch, options.cues)}};
    }},
    // PTD3: stirring as tokens. Each stroke is a direction; a world's rules move
    // matter by the run of strokes so far: `reversal` when a stroke breaks a run
    // of at least `after`, `cadence` on every `every`-th stroke of a run. Off the
    // pattern, the result shifts (less settles) rather than failing. Adjacent
    // steps with the same pattern and run carry the settled stroke count.
    stir: {roles: {vessel: 'vessel'}, settle({facts, options}) {
        const l = ledgerOf(facts);
        const {strokes = '', run = 'L', reversal, cadence, pattern} = options;
        check(typeof strokes === 'string' && /^[LR]*$/.test(strokes), 'Strokes are L or R.');
        check(pattern === undefined || typeof pattern === 'string' && pattern.length > 0, 'A stirring pattern needs an identity.');
        const continued = pattern !== undefined && l.stirPattern?.id === pattern && l.stirPattern.run === run;
        let length = continued ? l.stirPattern.length : 0;
        const offset = continued ? l.stirPattern.count : 0;
        const trace = [];
        for (const [index, direction] of [...strokes].entries()) {
            const broke = direction !== run && reversal && length >= reversal.after;
            length = direction === run ? length + 1 : 0;
            const rule = broke ? reversal : cadence && direction === run && length % cadence.every === 0 ? cadence : null;
            const moved = rule ? Math.min(l.batch[rule.from] ?? 0, rule.amount) : 0;
            if (moved) {
                take(l.batch, rule.from, moved);
                add(l.batch, rule.to, moved);
                delete l.origins?.[rule.to];
            }
            trace.push({stroke: offset + index + 1, direction, reversal: !!broke, moved});
        }
        if (pattern !== undefined) l.stirPattern = {id: pattern, run, length, count: offset + trace.length};
        else delete l.stirPattern;
        return {ok: true, facts: {brew: l, strokes: [...(facts.strokes ?? []), ...trace]}, observed: {cues: batchCues(l.batch, options.cues)}};
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
        const start = l.clock ?? at;
        const account = vessel.fuelAccount;
        const available = account === undefined ? null : vessel.quantities?.[account];
        if (account !== undefined && (!vessel.holder || !natural(available) || vessel.thermalState))
            return {ok: false, reason: 'heat-fuel-account-unavailable'};
        const before = l.heat?.thermal ?? null;
        let state;
        let litThroughWindow;
        if (vessel.thermalState) state = vessel.thermalState;
        else {
            let s = before ? advanceThermal(law, before, (start - l.heat.at) * 60) : null;
            const burning = s && s.segment.at + s.segment.burnSeconds > s.elapsedSeconds;
            if (available !== null) {
                // A paid stage leases the burner for its own interval. It can
                // run out before the deadline, then cool on the same trajectory.
                const window = paidBrewHeatWindow(vessel, options, s, (at - start) * 60, available);
                if (window.reason) return {ok: false, reason: window.reason, observed: {cold: true}};
                ({state, litThroughWindow} = window);
            } else {
                if (!s || !burning && s.temperature < program.targetTemperature) {
                    const quote = quoteThermalBatch({law, vessel: vessel.thermal, load, maker,
                        program: {...program, startTemperature: s?.temperature ?? program.startTemperature}});
                    if (!quote.ok) return {ok: false, reason: quote.reasons[0], observed: {cold: true}};
                    s = s ? resumeThermal(law, s, quote, {retainHistory: true}) : createThermalState(law, quote);
                }
                state = advanceThermal(law, s, (at - start) * 60);
            }
        }
        const fuel = state.fuelSpent - (before?.fuelSpent ?? 0);
        const effects = fuel > 0 ? [publish(vessel, K.heat_released.id, {fuel, temperature: state.temperature})] : [];
        const paid = available === null ? 0 : Math.max(0, Math.ceil(fuel - 1e-9));
        if (available !== null && paid > available) return {ok: false, reason: 'heat-fuel-stock-changed'};
        if (paid) effects.unshift({op: 'add', holder: vessel.holder, quantity: account, amount: -paid});
        if (active) for (const portion of l.portions.filter(p => p.id === active)) yieldPortion(l, law, state, portion, extract, degraded);
        // A minute steams when the burner is lit at its start, as in brew_steam.js.
        const litMinutes = Math.ceil(fuel / state.segment.fuelPerSecond / 60 - 1e-9);
        if (solvent && vaporPerMinute && vessel.closure !== 'sealed') {
            const lost = Math.min(l.batch[solvent] ?? 0, litMinutes * vaporPerMinute);
            take(l.batch, solvent, lost); add(l.out.vapor, solvent, lost);
            // In a world the brew steam pack already wrote this into humidity.
            if (lost && !vessel.thermalState) effects.push(publish(vessel, K.vapor_released.id, {constituent: solvent, amount: lost}));
        }
        l.fuel = state.fuelSpent;
        l.heat = {at, thermal: available === null ? state : stopThermal(law, state, {retainHistory: true}), law};
        // A reaction in this same operation sees the flame just before the
        // paid window closes. Later operations see the extinguished state.
        const flame = {active: litThroughWindow ?? state.segment.at + state.segment.burnSeconds > state.elapsedSeconds,
            temperature: Math.round(state.temperature)};
        return {ok: true, facts: {brew: l}, effects, ...(options.reactionWindow ? {thermalWindow: state} : {}),
            observed: {temperature: Math.round(state.temperature),
            ...(options.reactionWindow ? {flame} : {}),
            ...(available === null ? {} : {fuelPaid: paid})}};
    }},
    // A part's own preparation (crush, slice, stew), a nested step of its slot
    // (BRG3, PGB2). It records the preparation on the lot; amounts are moved
    // only when the lot is admitted, so the ledger stays balanced.
    prepare: {roles: {vessel: 'vessel', lot: 'lot'}, settle({bound, facts, options, at}) {
        const l = ledgerOf(facts);
        if (typeof options.how !== 'string' || !options.how) return {ok: false, reason: 'Say how the part is prepared.'};
        (l.prepared ??= {})[bound.lot.id] = {how: options.how, at, ...(options.changes ? {changes: options.changes} : {}),
            ...(options.admitOnly ? {admitOnly: options.admitOnly} : {})};
        return {ok: true, facts: {brew: l}, observed: {prepared: bound.lot.material, how: options.how}};
    }},
    // Take the vessel off the heat: the burner stops, the batch keeps its
    // residence and cools from here (craft_process_thermal stopThermal).
    cool: {roles: {vessel: 'vessel'}, settle({facts, at}) {
        const l = ledgerOf(facts);
        if (l.heat?.law) {
            const settled = advanceThermal(l.heat.law, l.heat.thermal, (at - l.heat.at) * 60);
            l.heat = {at, thermal: stopThermal(l.heat.law, settled, {retainHistory: true}), law: l.heat.law};
        }
        l.offHeat = true;
        return {ok: true, facts: {brew: l}, observed: {offHeat: true}};
    }},
    // A local failure row can consume the remaining batch as a real spill
    // after a hazardous product reaches the vessel's authored tolerance.
    breach: {roles: {vessel: 'vessel'}, settle: breach},
    'breach-contact': {roles: {vessel: 'vessel', target: 'body'}, settle: breach},
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
        for (const dose of doses) {
            const origins = pickOrigins(l, dose.contents);
            if (Object.keys(origins).length) dose.origins = origins;
        }
        l.batch = {};
        delete l.origins;
        delete l.fraction;
        l.doses.push(...doses);
        return {ok: true, facts: {brew: l}, observed: {doses: n}};
    }},
    // Strain the whole liquid phase into an indexed serving. Keep the cake in
    // the working so it can be collected separately or passed to a later step.
    strain: {roles: {vessel: 'vessel'}, settle: settleSeparation('strain')},
    distill: {roles: {vessel: 'vessel'}, settle: settleSeparation('distill')},
    'dissolve-in-flask': {roles: {flask: 'flask', lot: 'lot'}, settle({bound: {flask, lot}, options}) {
        if (!flask.holder || !lot.holder || !flask.place || flask.place !== lot.place || flask.holder === lot.holder)
            return {ok: false, reason: 'ingredient-out-of-reach'};
        if (flask.brewEmpty || flask.properties?.brew_sealed === true)
            return {ok: false, reason: 'open-serving-unavailable'};
        const {amount} = options;
        if (!positive(amount) || amount > lot.amount) return {ok: false, reason: 'ingredient-measure-unavailable'};
        const added = measuredLotParts(lot, amount);
        for (const id of Object.keys(added)) if (added[id] === 0) delete added[id];
        const stock = flask.brewContents, fraction = flask.brewFraction, storage = flask.brewStorage;
        if (fraction && !matchesFraction(fraction, stock)) return {ok: false, reason: 'fraction-changed-before-addition'};
        if (lot.ageing || (lot.key && readSpoilage(lot.key, 0))) return {ok: false, reason: 'stable-additive-unavailable'};
        const stable = Object.keys(added).filter(id => !id.endsWith(':matrix') && !id.endsWith(':spent'));
        const keep = storage?.keep ?? [];
        if (storage && stable.some(id => Object.hasOwn(stock, id) && !keep.includes(id)))
            return {ok: false, reason: 'additive-overlaps-ageing-constituent'};
        const blend = {batch: {...stock}, origins: {...flask.brewOrigins}};
        for (const [id, units] of Object.entries(added)) admitOrigin(blend, id, units, lot.origin);
        const packet = fraction ? {...fraction, constituents: normalizeConstituents([...fraction.constituents,
            ...Object.entries(added).map(([id, units]) => ({id, amount: units, phase: 'dissolved'}))])} : null;
        return {ok: true, effects: [{op: 'dissolve-brew-stock', holder: flask.holder, lot: lot.holder, amount, added,
            fraction: packet, origins: pickOrigins(blend, blend.batch),
            ...(storage ? {storage: {...storage, keep: [...new Set([...keep, ...stable])]}} : {})}],
            observed: {dissolved: amount}};
    }},
    'decant-flask': {roles: {flask: 'flask', receiver: 'flask'}, settle({bound: {flask, receiver}, options}) {
        if (!flask.holder || !receiver.holder || !flask.place || flask.place !== receiver.place || flask.holder === receiver.holder)
            return {ok: false, reason: 'flask-out-of-reach'};
        if (flask.brewEmpty) return {ok: false, reason: 'serving-unavailable'};
        if (!receiver.brewEmpty) return {ok: false, reason: 'empty-flask-unavailable'};
        const stock = flask.brewContents, fraction = flask.brewFraction;
        if (fraction && !matchesFraction(fraction, stock))
            return {ok: false, reason: 'fraction-changed-before-decant'};
        const total = fraction?.volume ?? sum(stock);
        const measure = fraction ? options.volume : options.amount;
        if ((fraction ? options.amount : options.volume) !== undefined ||
            (measure !== undefined && (!positive(measure) || measure > total)))
            return {ok: false, reason: 'decant-measure-unavailable'};
        const partial = measure !== undefined && measure < total;
        const split = partial && fraction ? splitProcessServing(fraction, measure) : null;
        const contents = split ? fractionContents(split.product) : partial ? measuredBrewShare(stock, measure, total) : stock;
        return {ok: true, effects: [{op: 'decant-brew', holder: flask.holder, receiver: receiver.holder, stock, contents,
            partial, ...(split ? {fraction: split.product, remainder: split.residue} : {})}],
            observed: {decanted: sum(contents), ...(fraction ? {volume: measure ?? total} : {})}};
    }},
    // Transfer exact amounts. An empty receiver can carry the measured phase
    // and volume into its next separation without a new assay.
    'admit-fraction': {roles: {vessel: 'vessel', flask: 'flask'}, settle({bound: {vessel, flask}, facts, at, options}) {
        if (!vessel.holder || !flask.holder || !vessel.place || vessel.place !== flask.place || vessel.holder === flask.holder)
            return {ok: false, reason: 'flask-out-of-reach'};
        const held = flask.brewContents;
        if (options.stamp !== undefined && options.stamp !== brewFlaskStamp(held, flask.brewFraction, flask.brewOrigins, flask.brewStorage))
            return {ok: false, reason: 'serving-composition-changed'};
        const total = sum(held);
        if (!total && !flask.brewFraction?.volume) return {ok: false, reason: 'serving-unavailable'};
        const packet = flask.brewFraction;
        const measure = packet ? options.volume : options.amount;
        const capacity = packet?.volume ?? total;
        if ((packet ? options.amount : options.volume) !== undefined ||
            (measure !== undefined && (!positive(measure) || measure > capacity)))
            return {ok: false, reason: 'admission-measure-unavailable'};
        if (packet && !matchesFraction(packet, held)) return {ok: false, reason: 'fraction-changed-before-admission'};
        const partial = measure !== undefined && measure < capacity;
        const split = partial && packet ? splitProcessServing(packet, measure) : null;
        const stock = split ? fractionContents(split.product) : partial ? measuredBrewShare(held, measure, total) : held;
        const incomingPacket = split?.product ?? packet;
        const l = ledgerOf(facts);
        const filmEffects = takeVesselFilm(l, vessel);
        const {dose: {contents}} = storedBrewDose(stock, flask.brewStorage, at);
        if (Object.entries(options.minimumContents ?? {}).some(([part, minimum]) =>
            (Object.hasOwn(contents, part) ? contents[part] : 0) < minimum))
            return {ok: false, reason: 'serving-below-assayed-minimum'};
        if (incomingPacket && (!sum(l.batch) || (l.fraction && matchesFraction(l.fraction, l.batch)))) {
            const incoming = flask.brewStorage ? ageFraction(incomingPacket, contents) : incomingPacket;
            const volume = (l.fraction?.volume ?? 0) + incoming.volume;
            if (!natural(volume)) return {ok: false, reason: 'blend-volume-unavailable'};
            l.fraction = {volume, constituents: normalizeConstituents([
                ...(l.fraction?.constituents ?? []), ...incoming.constituents,
            ])};
        } else {
            // An unmeasured addition makes the combined phase packet unknown.
            delete l.fraction;
        }
        const baseline = residenceAt(l, vessel, at);
        for (const [id, amount] of Object.entries(contents)) {
            admitOrigin(l, id, amount, Object.hasOwn(stock, id) && Object.hasOwn(flask.brewOrigins ?? {}, id)
                ? flask.brewOrigins[id] : undefined);
            if (!id.endsWith(':matrix')) l.portions.push({id, amount, lot: flask.holder, baseline});
        }
        add(l.in, `flask:${flask.holder}`, sum(contents));
        return {ok: true, facts: {brew: l}, effects: [{op: 'debit-brew-fraction', holder: flask.holder, contents: stock,
            ...(partial ? {partial} : {}), ...(split ? {remainder: split.residue} : {})}, ...filmEffects],
            observed: {admitted: sum(contents)}};
    }},
    // A damaged container can lose its contents without destroying the holder.
    'spill-flask': {roles: {flask: 'flask'}, settle({bound: {flask}, facts, options, at}) {
        if (!flask.holder || !flask.place) return {ok: false, reason: 'flask-out-of-reach'};
        const stock = flask.brewContents;
        const volume = flask.brewFraction?.volume ?? 0;
        if (!sum(stock) && !volume) return {ok: false, reason: 'serving-unavailable'};
        const {dose: {contents}} = storedBrewDose(stock, flask.brewStorage, at);
        const l = ledgerOf(facts);
        add(l.in, `flask:${flask.holder}`, sum(stock));
        for (const [part, amount] of Object.entries(contents)) add(l.out.spill, part, amount);
        return {ok: true, facts: {brew: l}, effects: [
            {op: 'debit-brew-fraction', holder: flask.holder, contents: stock},
            publish(flask, options.splash === true ? BREW_SPLASH : K.water_poured.id,
                {what: 'spill', contents, ...(volume ? {volume} : {})}),
        ], observed: {spilled: sum(contents)}};
    }},
    // Bind a late sample to one divided serving. The sample contributes one
    // unit whose identity comes from the bound lot's observed world data.
    'bind-sample': {roles: {vessel: 'vessel', sample: 'lot'}, settle({bound: {vessel, sample}, facts, options}) {
        const l = ledgerOf(facts);
        const dose = l.doses.find(row => row.index === options.index);
        if (!dose || dose.pouredTo || dose.sample || !sum(dose.contents) || dose.fraction)
            return {ok: false, reason: 'sample-serving-unavailable'};
        if (!vessel.holder || !sample.holder || !vessel.place || sample.place !== vessel.place || sample.holder === vessel.holder)
            return {ok: false, reason: 'sample-out-of-reach'};
        if (!positive(sample.amount) || typeof sample.donor !== 'string' || !/^[a-z0-9_.-]+$/i.test(sample.donor))
            return {ok: false, reason: 'donor-sample-unavailable'};
        dose.sample = sample.holder;
        add(dose.contents, `sample:${sample.donor}`, 1);
        add(l.in, sample.id, 1);
        return {ok: true, facts: {brew: l}, effects: [{op: 'debit', holder: sample.id, amount: 1}],
            observed: {serving: dose.index, sampleAdded: true}};
    }},
    // A division receipt is a single measured serving. Its destination and
    // any lining left by division settle with the same engine working step.
    pour: {roles: {vessel: 'vessel', flask: 'flask'}, settle({bound: {vessel, flask}, facts, options, at}) {
        const l = ledgerOf(facts);
        const dose = l.doses.find(row => row.index === options.index);
        if (!dose || dose.pouredTo || (!sum(dose.contents) && !dose.fraction?.volume)) return {ok: false, reason: 'serving-unavailable'};
        if (!vessel.holder || !flask.holder || !vessel.place || vessel.place !== flask.place || vessel.holder === flask.holder)
            return {ok: false, reason: 'flask-out-of-reach'};
        if (flask.brewEmpty !== true) return {ok: false, reason: 'empty-flask-unavailable'};
        const profile = options.shelfLife;
        let storage;
        if (profile !== undefined) {
            const {key, life, rate = 1, keep = []} = profile;
            check(Number.isFinite(rate) && rate >= 0 && Array.isArray(keep) && keep.every(part => typeof part === 'string'),
                'Invalid brew shelf-life profile.');
            storage = {bottledAt: at, rate, keep, ...(key === undefined ? {} : {key}), ...(life === undefined ? {} : {life})};
            storedBrewDose({}, storage, at);
        }
        dose.pouredTo = flask.holder;
        const film = l.film;
        l.film = {};
        l.out.lining ??= {};
        for (const [part, amount] of Object.entries(film)) add(l.out.lining, part, amount);
        return {ok: true, facts: {brew: l}, effects: [{op: 'pour-brew', holder: flask.holder,
            vessel: vessel.holder, contents: dose.contents, film, ...(dose.fraction ? {fraction: dose.fraction} : {}),
            ...(storage ? {storage} : {}), ...(dose.origins ? {origins: dose.origins} : {})}],
            observed: {poured: dose.index}};
    }},
    // Wash held surface residue with measured solvent and route both to runoff.
    'rinse-surface': {roles: {target: 'body', solvent: 'lot'}, settle: rinseSurface},
    'rinse-object': {roles: {target: 'thing', solvent: 'lot'}, settle: rinseSurface},
    // Rinse the film into waste water that leaves into the place (BRC2).
    rinse: {roles: {vessel: 'vessel'}, settle({bound, facts, options}) {
        const l = ledgerOf(facts), vessel = vesselOf(bound);
        const {solvent} = options;
        const effects = [];
        if (solvent) {
            const {account, part, amount} = solvent;
            check(typeof account === 'string' && account.startsWith('stock:') &&
                typeof part === 'string' && part.length && positive(amount), 'A paid rinse needs a stock account, solvent and measure.');
            if (!vessel.holder || !(vessel.quantities?.[account] >= amount))
                return {ok: false, reason: 'rinse-solvent-unavailable'};
            add(l.in, `rinse:${account}`, amount);
            effects.push({op: 'add', holder: vessel.holder, quantity: account, amount: -amount});
        }
        const washed = structuredClone(l.film);
        const carried = (vessel.films ?? []).reduce((total, film) => total + film.amount, 0);
        if (vessel.holder && carried) {
            for (const {id, amount} of vessel.films) add(washed, id, amount);
            add(l.in, `vessel:${vessel.id}`, carried);
        }
        for (const [id, amount] of Object.entries(washed)) add(l.out.waste, id, amount);
        l.film = {};
        if (vessel.holder && carried) effects.push({op: 'clear-films', holder: vessel.id, amount: carried});
        const contents = {...washed};
        if (solvent) {
            add(contents, solvent.part, solvent.amount);
            add(l.out.waste, solvent.part, solvent.amount);
        }
        if (sum(contents)) effects.push(publish(vessel, K.water_poured.id, {
            what: 'rinse', water: solvent?.amount ?? options.water ?? 0, contents,
        }));
        return {ok: true, facts: {brew: l}, effects,
            observed: {washed: sum(washed)}};
    }},
};

// A retained catalyst is read at settlement. It stays in the stock holder
// and contributes no matter to the batch. Each stage binds its own lot.
for (const op of ['react', 'cascade']) {
    const operation = operations[op];
    operations[`${op}-with-catalyst`] = {
        ...operation, roles: {...operation.roles, catalyst: 'lot'},
        settle(args) {
            const revision = args.options.heldCatalyst?.compositionRevision;
            if (revision !== undefined && revision !== args.bound.catalyst.compositionRevision)
                return {ok: false, reason: 'ingredient-composition-changed'};
            return operation.settle({...args, options: {...args.options,
                catalysts: heldCatalyst(args.bound, args.options.heldCatalyst)}});
        },
    };
}

// A guided stirring step uses the operator's current state and pays for the
// work only when the strokes can settle. Ordinary stirring stays available.
operations['stir-by-operator'] = {
    roles: {vessel: 'vessel', operator: 'body'},
    settle(args) {
        const {bound: {vessel, operator}, options} = args;
        if (!operator.holder || !vessel.holder || !operator.place || operator.place !== vessel.place)
            return {ok: false, reason: 'brew-operator-out-of-reach'};
        const {maxConfusion, effort = 0} = options;
        check(natural(maxConfusion) && natural(effort), 'Operator stirring needs a confusion tolerance and whole effort.');
        if (operator.properties.mind_awake === false || (operator.properties.mind_confusion ?? 0) > maxConfusion)
            return {ok: false, reason: 'brew-operator-unfocused'};
        if (effort > (operator.quantities.stamina ?? 0))
            return {ok: false, reason: 'brew-operator-short-stamina'};
        const result = operations.stir.settle(args);
        return effort ? {...result, costs: [{quantity: 'stamina', amount: effort, payer: operator.holder}]} : result;
    },
};

// Every operation stamps the ledger clock (the next step's start) and, when the
// vessel is read from a world, keeps the batch's thermal state as last read.
const stamped = Object.fromEntries(Object.entries(operations).map(([op, def]) => [op, {...def, settle(args) {
    const result = def.settle(args);
    if (!result.ok) return result;
    const brew = result.facts?.brew ?? ledgerOf(args.facts);
    const before = args.facts.brew?.batch;
    const since = brew.constituentSince ??= Object.create(null);
    for (const part of Object.keys(since)) if (!Object.hasOwn(brew.batch, part)) delete since[part];
    for (const [part, amount] of Object.entries(brew.batch)) {
        if (amount > (Object.hasOwn(before ?? {}, part) ? before[part] : 0)) since[part] = args.at;
    }
    reconcileThermalPortions(brew, args.at);
    if (!Object.keys(since).length) delete brew.constituentSince;
    if (op !== 'stir' && op !== 'stir-by-operator') delete brew.stirPattern;
    if (brew.origins) {
        if ((op === 'cascade' || op === 'cascade-with-catalyst') && result.observed.changed) delete brew.origins;
        else for (const part of Object.keys(brew.origins)) {
            if (!brew.batch[part] || (['heat', 'stir', 'stir-by-operator'].includes(op) && brew.batch[part] !== args.facts.brew?.batch[part]))
                delete brew.origins[part];
        }
        if (brew.origins && !Object.keys(brew.origins).length) delete brew.origins;
    }
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
    delete l.fraction;
    return {facts: {...facts, brew: l}, effect: publish(vessel, K.water_poured.id, {what: 'spill', contents: spilled})};
}

/** Build a method from a recipe row: admit each slot in order, then the row's
 * process steps. Each slot id is a role; the host binds a lot holding the
 * measured amount to it (KW3). Effects: `publish` ops go to the world substrate
 * as written; `debit` ops go to the lot's inventory owner. */
export function brewMethod({id, revision = 1, slots, process}) {
    check(Array.isArray(slots) && Array.isArray(process) && (slots.length || process.some(step =>
        step.op === 'admit-fraction' || step.op === 'admit')),
        'A brew method needs inputs and process steps.');
    const roles = {vessel: 'vessel'};
    const steps = [];
    for (const slot of slots) {
        check(!roles[slot.id], `Duplicate slot ${slot.id}.`);
        roles[slot.id] = 'lot';
        steps.push({op: 'admit', bindings: {vessel: 'vessel', lot: slot.id}, minutes: slot.minutes ?? 0,
            ...(slot.amount != null || slot.compositionRevision !== undefined || slot.origin !== undefined ||
                slot.recoverSpent !== undefined || slot.minimumContents !== undefined ? {options: {
                ...(slot.amount != null ? {amount: slot.amount} : {}),
                ...(slot.compositionRevision !== undefined ? {compositionRevision: slot.compositionRevision} : {}),
                ...(slot.origin !== undefined ? {origin: slot.origin} : {}),
                ...(slot.recoverSpent !== undefined ? {recoverSpent: slot.recoverSpent} : {}),
                ...(slot.minimumContents !== undefined ? {minimumContents: slot.minimumContents} : {}),
            }} : {})});
    }
    for (const step of process) {
        const bindings = {vessel: 'vessel'};
        if (step.op === 'admit') {
            check(typeof step.lot === 'string' && step.lot && (!roles[step.lot] || roles[step.lot] === 'lot'),
                'A delayed admission needs a lot role.');
            roles[step.lot] = 'lot';
            bindings.lot = step.lot;
        }
        if (step.op === 'pour' || step.op === 'admit-fraction') {
            const flask = step.flask ?? 'flask';
            check(!roles[flask] || roles[flask] === 'flask', `Duplicate role ${flask}.`);
            roles[flask] = 'flask';
            bindings.flask = flask;
        }
        if (step.op === 'breach-contact') {
            check(!roles.target || roles.target === 'body', 'Duplicate role target.');
            roles.target = 'body';
            bindings.target = 'target';
        }
        if (step.op === 'stir-by-operator') {
            check(!roles.operator || roles.operator === 'body', 'Duplicate operator role.');
            roles.operator = 'body';
            bindings.operator = 'operator';
        }
        if (step.op === 'bind-sample') {
            const sample = step.sample ?? 'sample';
            check(!roles[sample] || roles[sample] === 'lot', 'Duplicate sample role.');
            roles[sample] = 'lot';
            bindings.sample = sample;
        }
        if (step.op === 'react-with-catalyst' || step.op === 'cascade-with-catalyst') {
            const catalyst = step.catalyst ?? 'catalyst';
            check(!roles[catalyst] || roles[catalyst] === 'lot', 'Duplicate catalyst role.');
            roles[catalyst] = 'lot';
            bindings.catalyst = catalyst;
        }
        steps.push({op: step.op, bindings, minutes: step.minutes ?? 0, options: step.options ?? {}});
    }
    return {id, revision, law: BREW_LAW.ref, roles, steps};
}
