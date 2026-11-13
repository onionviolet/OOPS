// PC95 generation. Assayed lots supply ingredient identities and measured
// quantities. A known reaction or a route through known reactions supplies the
// method. BREW_LAW still decides what happens when the working settles.
import {check, natural, positive} from './basics.js';
import {brewLotAgeLoss, brewMethod, checkBrewTemperatureWindow, consumeThermalPortions, heatQualifiedAmount,
    inBrewTemperatureWindow, paidBrewHeatWindow, reactantResidenceSeconds, reactiveBrewAmount, recordThermalPortion,
    storedBrewDose} from './brew_law.js';
import {BREW_ASSAY_LAW} from './brew_assay.js';
import {brewDoseContents, brewFilmQuantity, brewFlaskStamp, brewFractionOf, brewLotRevision, brewLotStorageOf, brewMeasureQuantity,
    brewOriginsOf, brewStorageOf} from './engine_brew_stock.js';
import {advanceThermal, stopThermal} from './craft_process_thermal.js';
import {followsServingVolume} from './craft_process_separation.js';

function originalAssayFloor(reading, storage, observedAt) {
    const {part, atLeast, total} = reading;
    if (!storage || !atLeast || part.endsWith(':spent')) return atLeast;
    const quantityAt = (amount, at) => storedBrewDose({[part]: amount}, storage, at).dose.contents[part] ?? 0;
    // Find the smallest original quantity consistent with what was observed.
    let low = atLeast, high = total;
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (quantityAt(mid, observedAt) < atLeast) low = mid + 1;
        else high = mid;
    }
    return low;
}

// Ingredient composition stays with the live lot. Planning uses only lower
// bounds observed by this brewer and reads current reach and stock separately.
export function generateObservedBrewWorking(engine, {observer, ...request}) {
    const place = engine.world.holders[observer]?.place;
    const receiver = engine.world.holders[request.flask];
    if (!place || request.vessel === request.flask || engine.world.holders[request.vessel]?.place !== place ||
        receiver?.place !== place || Object.keys(brewDoseContents(receiver)).length || brewFractionOf(receiver)?.volume)
        return null;
    const known = new Map();
    const servings = new Map();
    for (const {record} of Object.values(engine.records.workings)) {
        if (record.law !== BREW_ASSAY_LAW.ref) continue;
        for (const receipt of record.receipts) {
            const reading = receipt.observed;
            if (request.goal && receipt.ok && receipt.op === 'measure' && reading.observer === observer && positive(reading.total)) {
                const holder = engine.world.holders[reading.flask];
                if (holder?.place !== place || holder.id === request.vessel || holder.id === request.flask) continue;
                if (!servings.has(holder.id)) {
                    const storage = brewStorageOf(holder);
                    const stamp = brewFlaskStamp(brewDoseContents(holder), brewFractionOf(holder), brewOriginsOf(holder), storage);
                    if (stamp !== reading.stamp) continue;
                    const packet = brewFractionOf(holder);
                    const capacity = packet?.volume ?? reading.total;
                    if (!positive(capacity)) continue;
                    servings.set(holder.id, {id: holder.id, stamp, storage, total: reading.total, capacity, amount: capacity,
                        byVolume: Boolean(packet), admissionAt: engine.world.clock,
                        properties: Object.create(null), originalFloors: new Map(), phaseFloors: new Map(), bounds: new Map()});
                }
                const serving = servings.get(holder.id);
                if (serving.stamp !== reading.stamp) continue;
                if (reading.phase !== undefined) {
                    const phases = serving.phaseFloors.get(reading.part) ?? new Map();
                    phases.set(reading.phase, Math.max(phases.get(reading.phase) ?? 0, reading.atLeast));
                    serving.phaseFloors.set(reading.part, phases);
                    serving.properties[reading.part] ??= 0;
                    continue;
                }
                const original = originalAssayFloor(reading, serving.storage, receipt.at);
                serving.properties[reading.part] = Math.max(serving.properties[reading.part] ?? 0, original);
                if ((!serving.byVolume || reading.followsVolume) && (!serving.storage || !reading.part.endsWith(':spent')))
                    serving.originalFloors.set(reading.part, Math.max(serving.originalFloors.get(reading.part) ?? 0, original));
                if (!serving.storage || !reading.part.endsWith(':spent'))
                    serving.bounds.set(reading.part, Math.min(serving.bounds.get(reading.part) ?? serving.amount, reading.below - 1));
                continue;
            }
            if (!receipt.ok || receipt.op !== 'measure-lot' || receipt.observed.observer !== observer) continue;
            const {lot, part, atLeast, below, origin, compositionRevision = null} = receipt.observed;
            const holder = engine.world.holders[lot];
            if (holder?.place !== place || !positive(holder.quantities[brewMeasureQuantity])) continue;
            if ((holder.properties[brewLotRevision] ?? null) !== compositionRevision) continue;
            if (!known.has(lot)) {
                const live = engine.host.ports.readThing?.({kind: 'lot', id: lot}, engine.world.clock, engine.world,
                    engine.records, {drawRoot: engine.draws.root});
                const {spent, storageSince, storageRate, ageing, key} = {...engine.host.things[`lot:${lot}`], ...live};
                known.set(lot, {id: lot, amount: holder.quantities[brewMeasureQuantity], properties: Object.create(null),
                    bounds: new Map(), origin, condition: {spent, storageSince, storageRate, ageing, key, lotStorage: brewLotStorageOf(holder)},
                    admissionAt: engine.world.clock, compositionRevision});
            }
            const knownLot = known.get(lot);
            if (knownLot.origin !== origin) knownLot.origin = undefined;
            const {properties, bounds} = knownLot;
            properties[part] = Math.max(properties[part] ?? 0, atLeast);
            bounds.set(part, Math.min(bounds.get(part) ?? 1000, below - 1));
        }
    }
    const vessel = engine.host.things[`vessel:${request.vessel}`];
    const fuel = vessel?.fuelAccount && engine.world.holders[request.vessel].quantities[vessel.fuelAccount];
    const burner = vessel?.thermal && !vessel.thermalState && natural(fuel) ? {vessel, fuel} : null;
    const flaskInputs = [...servings.values()].filter(serving => !known.has(serving.id));
    const input = {...request, lots: [...known.values(), ...flaskInputs], burner, retainPermille: vessel?.retainPermille ?? 0,
        vesselStock: engine.world.holders[request.vessel].quantities};
    return request.goal ? generateBrewRoute(input) : generateBrewWorking(input);
}

function compileWorking({id, vessel, flask}, draws, stages) {
    const sourceSensitive = stages.some(({reaction}) => Object.keys(reaction.requiresOrigins ?? {}).length);
    const inputs = draws.map((draw, i) => ({...draw, role: `input-${i + 1}`}));
    const lotOptions = draw => {
        const {amount, compositionRevision, origin, recoverSpent} = draw;
        return {amount,
            ...(compositionRevision !== undefined ? {compositionRevision} : {}),
            ...(sourceSensitive && origin !== undefined ? {origin} : {}),
            ...(recoverSpent ? {recoverSpent} : {}),
            ...(recoverSpent || draw.condition?.lotStorage || draw.condition?.storageSince !== undefined ?
                {minimumContents: Object.fromEntries(admissionParts(draw)
                .map(part => [part, admittedFloor(draw, part, amount)]))} : {})};
    };
    const slots = inputs.filter(draw => !draw.stamp && draw.admitAfter === undefined).map(draw => ({id: draw.role, ...lotOptions(draw)}));
    const bindings = {vessel: {kind: 'vessel', id: vessel}, flask: {kind: 'flask', id: flask},
        ...Object.fromEntries(inputs.map(draw => [draw.role, {kind: draw.stamp ? 'flask' : 'lot', id: draw.id}]))};
    const admissionStep = draw => draw.stamp ?
        {op: 'admit-fraction', flask: draw.role, options: {stamp: draw.stamp,
            ...(draw.amount < draw.capacity ? {[draw.byVolume ? 'volume' : 'amount']: draw.amount} : {}),
            ...(draw.storage || draw.byVolume ? {minimumContents: Object.fromEntries(admissionParts(draw)
                .map(part => [part, admittedFloor(draw, part, draw.amount)]))} : {})}} :
        {op: 'admit', lot: draw.role, options: lotOptions(draw)};
    const process = stages.flatMap(({reaction, extent, minutes, retained, heating}, i) => {
        const options = {reactions: [{...structuredClone(reaction), limit: extent}]};
        if (heating) options.heating = structuredClone(heating);
        const step = {op: 'react', minutes, options};
        if (retained) {
            const catalyst = `catalyst-${i + 1}`;
            bindings[catalyst] = {kind: 'lot', id: retained.id};
            options.heldCatalyst = {part: reaction.catalyst, minimum: retained.minimum, compositionRevision: retained.compositionRevision};
            Object.assign(step, {op: 'react-with-catalyst', catalyst});
        }
        const additions = inputs.filter(draw => draw.admitAfter === i).map(admissionStep);
        return reaction.activeHeat === false ? [{op: 'cool'}, step, ...additions] : [step, ...additions];
    });
    const method = brewMethod({id, slots, process: [
        ...inputs.filter(draw => draw.stamp && draw.admitAfter === undefined).map(admissionStep),
        ...process,
        {op: 'divide', minutes: 1, options: {doses: 1}},
        {op: 'pour', minutes: 1, options: {index: 0}},
    ]});
    return {method, bindings};
}

export function generateBrewWorking({id, reaction, extent, lots, vessel, flask}) {
    const inputs = Object.entries(reaction.reactants);
    check(inputs.length === 2 && positive(extent) && inputs.every(([, ratio]) => positive(ratio)),
        'This brew search needs a two-input reaction and a whole positive extent.');
    check(reaction.limitPermille == null && reaction.catalyst == null && reaction.requiresOrigins == null && reaction.activeHeat == null &&
        (reaction.limit == null || extent <= reaction.limit), 'This brew search needs an available, unrestricted reaction extent.');
    const [first, second] = inputs.map(([part, ratio]) => {
        const need = extent * ratio;
        check(positive(need), 'The measured requirement exceeds whole-unit precision.');
        return lots.flatMap(lot => {
            if (admittedFloor(lot, part, lot.amount) < need) return [];
            return [{...lot, amount: drawFor(lot, part, need)}];
        });
    });

    let selection = null;
    for (const a of first) for (const b of second) {
        if (a.id === b.id) continue;
        const total = a.amount + b.amount;
        const key = JSON.stringify([a.id, b.id]);
        if (!selection || total < selection.total || (total === selection.total && key < selection.key))
            selection = {lots: [a, b], total, key};
    }
    if (!selection) return null;

    return compileWorking({id, vessel, flask}, selection.lots, [{reaction, extent, minutes: 3}]);
}

const needIn = (map, id) => map.get(id) ?? 0;
const measuredFloor = (amount, fraction) => Number(BigInt(amount) * BigInt(fraction) / 1000n);
const spentSuffix = ':spent';
const canAgeInFlask = part => !part.endsWith(spentSuffix) && !part.endsWith(':matrix');

function admissionParts(lot) {
    const parts = Object.keys(lot.properties);
    const spent = lot.storage ? parts.filter(canAgeInFlask).map(part => part + spentSuffix) : lot.recoverSpent ?? [];
    return [...new Set([...parts, ...spent])];
}

function flaskShareFloor(lot, part, draw) {
    const full = draw === lot.capacity;
    const shareOf = amount => Number(BigInt(draw) * BigInt(amount) / BigInt(lot.capacity));
    let fromPhases = 0;
    for (const [phase, amount] of lot.phaseFloors.get(part) ?? []) {
        if (full || followsServingVolume(phase)) fromPhases += shareOf(amount);
    }
    // An aged whole-flask spent reading can include decay since bottling.
    // Keep it separate from the physical share measured in a phase.
    const whole = Object.hasOwn(lot.properties, part) ? lot.properties[part] : 0;
    return Math.max(fromPhases, full && !(lot.storage && part.endsWith(spentSuffix)) ? whole :
        shareOf(lot.originalFloors.get(part) ?? 0));
}

function admittedFloor(lot, part, draw) {
    if (lot.stamp) {
        const share = flaskShareFloor(lot, part, draw);
        if (!lot.storage) return share;
        if (!part.endsWith(spentSuffix))
            return storedBrewDose({[part]: share}, lot.storage, lot.admissionAt).dose.contents[part] ?? 0;
        const parent = part.slice(0, -spentSuffix.length);
        const formed = canAgeInFlask(parent) ?
            storedBrewDose({[parent]: flaskShareFloor(lot, parent, draw)}, lot.storage, lot.admissionAt).dose.contents[part] ?? 0 : 0;
        const observed = draw === lot.capacity && Object.hasOwn(lot.properties, part) ? lot.properties[part] : 0;
        return Math.max(observed, share + formed);
    }
    const isSpent = part.endsWith(spentSuffix);
    if (isSpent && !lot.recoverSpent?.includes(part)) return 0;
    const parent = isSpent ? part.slice(0, -spentSuffix.length) : part;
    const fraction = Object.hasOwn(lot.properties, parent) ? lot.properties[parent] : 0;
    if (!positive(fraction) || fraction > 1000) return 0;
    const measured = measuredFloor(draw, fraction);
    const lost = brewLotAgeLoss(lot.condition ?? {}, parent, measured, lot.admissionAt);
    return isSpent ? lost : measured - lost;
}

// The route objective compares mass, so a phase draw uses a conservative
// upper bound on its mass rather than comparing volume to ingredient units.
function drawCost(draw) {
    return draw.byVolume ? Number(BigInt(draw.amount) * BigInt(draw.total) / BigInt(draw.capacity)) : draw.amount;
}

function drawFor(lot, part, need) {
    let low = 0, high = lot.amount;
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (admittedFloor(lot, part, mid) < need) low = mid + 1;
        else high = mid;
    }
    return low;
}
const bump = (map, id, amount) => {
    const next = needIn(map, id) + amount;
    check(Number.isSafeInteger(next), 'Brew route quantities exceed whole-unit precision.');
    map.set(id, next);
};

// Plan a bounded sequence backwards from a measured constituent. Verify each
// candidate forwards against the assay floor before compiling a real working.
// Each stage has a whole extent. A capped reaction can run in several stages.
function generateBrewRoute({goal, reactions, lots, burner, heating, retainPermille, vesselStock, maxStages = 4,
    admitAfter = {}, searchAdmissionFor = [], recoverSpentFrom = [], ...working}) {
    check(typeof goal.part === 'string' && goal.part && positive(goal.amount) &&
        positive(maxStages) && Array.isArray(reactions), 'A brew route needs a measured goal and a stage limit.');
    check(natural(retainPermille) && retainPermille <= 1000, 'A brew vessel needs a whole retention share per mille.');
    check(Array.isArray(recoverSpentFrom) && recoverSpentFrom.every(id => typeof id === 'string' && id),
        'Spent ingredient recovery needs lot IDs.');
    const recovery = new Set(recoverSpentFrom);
    lots = lots.map(lot => lot.stamp || !recovery.has(lot.id) ? lot : {...lot,
        recoverSpent: Object.keys(lot.properties).filter(part => !part.endsWith(spentSuffix)).map(part => part + spentSuffix)});
    if (retainPermille === 1000) return null;
    // The target is in the bottle. Invert the division law's rounded film share.
    const batchTarget = Number(BigInt(goal.amount - 1) * 1000n / BigInt(1000 - retainPermille) + 1n);
    check(positive(batchTarget), 'The bottled goal exceeds whole-unit precision.');
    const ids = new Set();
    const rows = reactions.map(({minutes, catalystMinimum, ...reaction}) => {
        checkBrewTemperatureWindow(reaction);
        const reactants = Object.entries(reaction.reactants);
        const products = Object.entries(reaction.products);
        const mass = side => side.reduce((sum, [, amount]) => sum + amount, 0);
        check(typeof reaction.id === 'string' && reaction.id && !ids.has(reaction.id) && positive(minutes) &&
            reactants.length && products.length && [...reactants, ...products].every(([, amount]) => positive(amount)) &&
            positive(mass(reactants)) && mass(reactants) === mass(products) &&
            (reaction.activeHeat === undefined || typeof reaction.activeHeat === 'boolean') &&
            (reaction.limitPermille == null || natural(reaction.limitPermille) && reaction.limitPermille <= 1000) &&
            Object.entries(reaction.requiresOrigins ?? {}).every(([part, origin]) =>
                Object.hasOwn(reaction.reactants, part) && !part.endsWith(':matrix') && typeof origin === 'string' && origin) &&
            Object.entries(reaction.productOrigins ?? {}).every(([part, origin]) =>
                Object.hasOwn(reaction.products, part) && typeof origin === 'string' && origin) &&
            (reaction.catalyst == null ? catalystMinimum == null :
                typeof reaction.catalyst === 'string' && reaction.catalyst.length && positive(catalystMinimum ?? 1)) &&
            (reaction.limit == null || positive(reaction.limit)) &&
            (reaction.minMinutes == null || natural(reaction.minMinutes) && minutes >= reaction.minMinutes),
        'A brew route needs distinct, conserved reactions with supported conditions and times.');
        ids.add(reaction.id);
        const minimum = catalystMinimum ?? 1;
        const catalystLots = reaction.catalyst == null ? [] : lots.filter(lot => !lot.stamp &&
            measuredFloor(lot.amount, lot.properties[reaction.catalyst] ?? 0) >= minimum)
            .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
        return {reaction, reactants, products, minutes, minimum, catalystLots};
    });
    check(Object.values(admitAfter).every(id => ids.has(id)), 'Delayed admissions need a known reaction boundary.');
    check(Array.isArray(searchAdmissionFor) && searchAdmissionFor.every(id => typeof id === 'string' && id &&
        !Object.hasOwn(admitAfter, id)), 'Admission search needs lot IDs without fixed admission boundaries.');
    const flexible = new Set(searchAdmissionFor);

    let remaining = 100000;
    let best = null;
    const spend = () => check(--remaining >= 0, 'Brew route search budget exceeded.');
    const fit = (needs, stages) => {
        if (!stages.length) return;
        const missing = [...needs].filter(([, amount]) => amount > 0);
        const neededParts = missing.map(([part]) => part);
        const draws = new Map();
        const forward = [...stages].reverse();
        const requiredOrigins = new Set(forward.flatMap(({reaction}) => Object.keys(reaction.requiresOrigins ?? {})));
        if ([...requiredOrigins].some(part => vesselStock[brewFilmQuantity(part)] > 0)) return;
        const minutes = forward.reduce((total, row) => total + row.minutes, 0);
        check(positive(minutes + 2), 'Brew route duration exceeds whole-minute precision.');
        let fuel = burner?.fuel ?? 0;
        let thermal = null;
        let at = 0;
        const checkpoints = [];
        for (const {reaction, minutes} of forward) {
            const seconds = minutes * 60;
            if (reaction.activeHeat === true) {
                if (!burner || !heating) return;
                const window = paidBrewHeatWindow(burner.vessel, heating, thermal, seconds, fuel);
                if (!window.litThroughWindow) return;
                fuel -= Math.max(0, Math.ceil(window.state.fuelSpent - (thermal?.fuelSpent ?? 0) - 1e-9));
                thermal = window.state;
            } else if (thermal) thermal = advanceThermal(heating.law, thermal, seconds);
            const start = at;
            at += minutes;
            if (!['reactants', 'portions'].includes(reaction.temperatureResidence) &&
                !inBrewTemperatureWindow(reaction, thermal ? Math.round(thermal.temperature) : undefined, heating?.law, thermal, seconds)) return;
            checkpoints.push({thermal, at, start});
            if (reaction.activeHeat === true) thermal = stopThermal(heating.law, thermal, {retainHistory: true});
        }
        const boundaries = new Map(forward.map((row, index) => [row.reaction.id, index]).reverse());
        const atBoundary = (lot, boundary) => ({...lot, admitAfter: boundary,
            admissionAt: lot.admissionAt + checkpoints[boundary].at});
        const availableLots = [];
        const timingChoices = [];
        for (const lot of lots) {
            if (Object.hasOwn(admitAfter, lot.id)) {
                const boundary = boundaries.get(admitAfter[lot.id]);
                if (boundary !== undefined && boundary < forward.length - 1) availableLots.push(atBoundary(lot, boundary));
            } else if (flexible.has(lot.id) && forward.length > 1) {
                const choices = [lot, ...checkpoints.slice(0, -1).map((_, index) => atBoundary(lot, index))]
                    .filter(choice => neededParts.some(part => admittedFloor(choice, part, choice.amount) > 0));
                if (choices.length) timingChoices.push(choices);
            } else availableLots.push(lot);
        }
        function choose(index) {
            spend();
            if (index === missing.length) {
                const scheduled = [...draws.values()].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
                if (!scheduled.length) return;
                const pending = new Map(scheduled.filter(draw => draw.admitAfter !== undefined).map(draw => [draw.id, draw.admitAfter]));
                const units = scheduled.reduce((total, lot) => total + drawCost(lot), 0);
                check(positive(units), 'Brew route quantities exceed whole-unit precision.');
                const key = JSON.stringify([forward.map(row => [row.reaction.id, row.extent]), scheduled.map(lot => [lot.id, lot.amount])]);
                if (best && (units > best.units || units === best.units &&
                    (minutes > best.minutes || minutes === best.minutes && key >= best.key))) return;
                const batch = new Map();
                const since = Object.create(null);
                const portions = forward.some(row => row.reaction.temperatureResidence === 'portions') ? {} : null;
                // Unassayed traces could spoil a whole-batch origin claim.
                // Track possible contributions separately from guaranteed mass.
                const possible = new Map();
                const sources = new Map();
                const admit = (lot, at) => {
                    for (const part of admissionParts(lot)) {
                        const amount = admittedFloor(lot, part, lot.amount);
                        bump(batch, part, amount);
                        if (amount) since[part] = at;
                        if (portions) recordThermalPortion(portions, part, amount, at);
                    }
                    for (const part of requiredOrigins) {
                        // Largest-remainder draws can round a possible trace up.
                        const upper = lot.stamp ? Math.min(drawCost(lot), lot.storage ? lot.total : lot.bounds.get(part) ?? lot.total) :
                            part.endsWith(spentSuffix) && lot.recoverSpent?.includes(part) ? lot.amount :
                            measuredFloor(lot.amount, lot.bounds.get(part) ?? 1000);
                        if (!upper) continue;
                        bump(possible, part, upper);
                        if (!sources.has(part)) sources.set(part, lot.origin);
                        else if (sources.get(part) !== lot.origin) sources.set(part, undefined);
                    }
                };
                for (const lot of scheduled) if (lot.admitAfter === undefined) admit(lot, 0);
                const verified = [];
                for (const [index, row] of forward.entries()) {
                    const {thermal, at, start} = checkpoints[index];
                    if (row.reaction.temperatureResidence === 'reactants' &&
                        !inBrewTemperatureWindow(row.reaction, undefined, heating?.law, thermal,
                            reactantResidenceSeconds(row.reaction, since, at, start))) return;
                    let retained;
                    if (row.reaction.catalyst) {
                        const part = row.reaction.catalyst;
                        const lot = row.catalystLots.find(lot => measuredFloor(lot.amount -
                            ((pending.get(lot.id) ?? -1) < index ? draws.get(lot.id)?.amount ?? 0 : 0),
                            lot.properties[part]) >= row.minimum);
                        if (!lot) return;
                        retained = {id: lot.id, minimum: row.minimum, compositionRevision: lot.compositionRevision};
                    }
                    if (Object.entries(row.reaction.requiresOrigins ?? {}).some(([part, origin]) => sources.get(part) !== origin)) return;
                    const available = part => row.reaction.temperatureResidence === 'portions' ?
                        heatQualifiedAmount(portions, part, row.reaction, heating?.law, thermal, at) : needIn(batch, part);
                    if (row.reactants.some(([part, ratio]) =>
                        reactiveBrewAmount(available(part), row.reaction.limitPermille) < ratio * row.extent)) return;
                    for (const [part, ratio] of row.reactants) {
                        const amount = ratio * row.extent;
                        bump(batch, part, -amount);
                        if (portions) consumeThermalPortions(portions, part, amount);
                        if (requiredOrigins.has(part)) bump(possible, part, -amount);
                    }
                    for (const [part, ratio] of row.products) {
                        const amount = ratio * row.extent;
                        bump(batch, part, amount);
                        since[part] = at;
                        if (portions) recordThermalPortion(portions, part, amount, at);
                        if (!requiredOrigins.has(part)) continue;
                        const origin = Object.hasOwn(row.reaction.productOrigins ?? {}, part) ? row.reaction.productOrigins[part] : undefined;
                        if (!needIn(possible, part)) sources.set(part, origin);
                        else if (sources.get(part) !== origin) sources.set(part, undefined);
                        bump(possible, part, amount);
                    }
                    verified.push({...row, retained, heating: row.reaction.activeHeat === true ? heating : undefined});
                    for (const lot of scheduled) if (lot.admitAfter === index) admit(lot, at);
                }
                if (needIn(batch, goal.part) >= batchTarget) best = {picked: scheduled, forward: verified, units, minutes, key};
                return;
            }
            const [part, need] = missing[index];
            const sources = availableLots.flatMap(lot => {
                const capacity = admittedFloor(lot, part, lot.amount);
                if (!capacity) return [];
                const previous = draws.get(lot.id);
                const present = admittedFloor(lot, part, previous?.amount ?? 0);
                return [{lot, previous, present, room: capacity - present}];
            });
            const capacity = [0];
            for (const source of sources.toReversed())
                capacity.unshift(Math.min(need, capacity[0] + source.room));
            function allocate(sourceIndex, outstanding) {
                spend();
                if (!outstanding) return choose(index + 1);
                if (outstanding > capacity[sourceIndex]) return;
                const {lot, previous, present, room} = sources[sourceIndex];
                const min = Math.max(0, outstanding - capacity[sourceIndex + 1]);
                const max = Math.min(outstanding, room);
                for (let used = max; used >= min; used--) {
                    if (used) {
                        const size = drawFor(lot, part, present + used);
                        draws.set(lot.id, {...lot, amount: size});
                    }
                    allocate(sourceIndex + 1, outstanding - used);
                    if (previous) draws.set(lot.id, previous);
                    else draws.delete(lot.id);
                }
            }
            allocate(0, Math.max(0, need - sources.reduce((sum, source) => sum + source.present, 0)));
        }
        function schedule(index) {
            if (index === timingChoices.length) return choose(0);
            spend();
            for (const lot of timingChoices[index]) {
                availableLots.push(lot);
                schedule(index + 1);
                availableLots.pop();
            }
        }
        schedule(0);
    };
    function search(needs, stages) {
        spend();
        fit(needs, stages);
        if (stages.length >= maxStages) return;
        for (const row of rows) {
            if (row.reaction.catalyst && !row.catalystLots.length) continue;
            const rate = row.reaction.limitPermille ?? 1000;
            if (!rate) continue;
            if (rate === 1000 && row.reaction.limit == null && stages.some(stage => stage.reaction.id === row.reaction.id)) continue;
            const demand = row.products.reduce((largest, [part, ratio]) =>
                Math.max(largest, Math.ceil(needIn(needs, part) / ratio)), 0);
            const largestExtent = Math.min(demand, row.reaction.limit ?? Infinity);
            // Other reactions or stock can supply the rest of this demand.
            for (let extent = largestExtent; extent > 0; extent--) {
                const next = new Map(needs);
                for (const [part, ratio] of row.reactants) bump(next, part, ratio * extent);
                for (const [part, ratio] of row.products) bump(next, part, -ratio * extent);
                // A stage must both leave enough for its successors and start
                // with enough stock for the rate-limited extent to fire.
                for (const [part, ratio] of row.reactants) {
                    const threshold = Number((BigInt(ratio) * BigInt(extent) * 1000n + BigInt(rate - 1)) / BigInt(rate));
                    check(positive(threshold), 'Brew route quantities exceed whole-unit precision.');
                    next.set(part, Math.max(needIn(next, part), threshold));
                }
                search(next, [...stages, {...row, extent}]);
                // A fresh product can be too young for a downstream reaction.
                // Also try sourcing that demand from the initial stock.
                const older = new Map(next);
                for (const [part, ratio] of row.products) {
                    if (needIn(needs, part) > 0 && stages.some(stage =>
                        stage.reaction.temperatureResidence === 'portions' && Object.hasOwn(stage.reaction.reactants, part)))
                        bump(older, part, Math.min(needIn(needs, part), ratio * extent));
                }
                if (row.products.some(([part]) => needIn(older, part) > needIn(next, part)))
                    search(older, [...stages, {...row, extent}]);
            }
        }
    }
    search(new Map([[goal.part, batchTarget]]), []);
    return best ? compileWorking(working, best.picked, best.forward) : null;
}
