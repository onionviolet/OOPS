// A measured serving moves through the same stock accounts regardless of its
// recipe. The world supplies route, compatible recipient and constituent effects.
import {defineWorkingLaw} from './kernel_working.js';
import {check, natural, positive} from './basics.js';
import {cancelOutputs, defineDoseRules} from './craft_dose_rules.js';
import {brewDoseContents, brewDoseQuantity, brewFlaskStamp, brewFractionOf, brewOriginsOf, brewStorageOf,
    measuredBrewShare, clearBrewFraction, clearBrewOrigins, clearBrewStorage, setBrewFraction, setBrewOrigins} from './engine_brew_stock.js';
import {storedBrewDose} from './brew_law.js';
import {fractionContents, matchesFraction, splitProcessServing} from './craft_process_separation.js';
import {WORLD_QUANTITIES} from './world_quantities.js';
import {recordsOf} from './knowledge_record.js';
import {SPELL_EFFECT_LAW} from './spell_law.js';
import {BREW_ASSAY_LAW} from './brew_assay.js';
import {releaseCreatureForm} from './creature_evolution.js';
import {residueQuantity} from './world_substrate_packs/residue_flow.js';

const roles = {flask: 'flask', recipient: 'body'};
const coatingRoles = {...roles, recipient: 'thing'};

function identifiedDose(engine, observer, sample) {
    const holder = engine.world.holders[sample];
    if (!holder?.place || holder.place !== engine.world.holders[observer]?.place) return {};
    const stock = brewDoseContents(holder);
    const storage = brewStorageOf(holder);
    const stamp = brewFlaskStamp(stock, brewFractionOf(holder), brewOriginsOf(holder), storage);
    const current = brewFlaskStamp(storedBrewDose(stock, storage, engine.world.clock).dose.contents);
    let latest = -1;
    let matches = false;
    for (const {law, record} of Object.values(engine.records.workings)) {
        if (law !== SPELL_EFFECT_LAW.ref) continue;
        for (const {ok, observed, at} of record.receipts) {
            const reading = observed?.doseSample ?? observed?.emptySample;
            if (!ok || reading?.observer !== observer || reading.sample !== sample || at < latest) continue;
            if (at > latest) matches = false;
            latest = at;
            matches ||= reading.stamp === stamp && reading.reading === current;
        }
    }
    if (!matches) return {};
    const readings = Object.values(recordsOf(engine.world, observer)).filter(record =>
        record.true.holder === sample && record.id.startsWith(`assay:${sample}:`) &&
        record.source.kind === 'observation' && record.source.by === observer && record.source.at === latest &&
        positive(record.believed.value));
    const quantities = Object.fromEntries(readings.map(record => [record.true.quantity, record.believed.value]));
    const identified = brewDoseContents({quantities});
    return brewFlaskStamp(identified) === current ? identified : {};
}

function identifiedPanel(engine, observer, sample) {
    const holder = engine.world.holders[sample];
    if (!holder?.place || holder.place !== engine.world.holders[observer]?.place) return null;
    const stock = brewDoseContents(holder), storage = brewStorageOf(holder);
    const stamp = brewFlaskStamp(stock, brewFractionOf(holder), brewOriginsOf(holder), storage);
    const current = brewFlaskStamp(storedBrewDose(stock, storage, engine.world.clock).dose.contents);
    const records = recordsOf(engine.world, observer);
    let total;
    let count;
    const bounds = new Map();
    for (const {law, record} of Object.values(engine.records.workings)) {
        if (law !== BREW_ASSAY_LAW.ref) continue;
        for (const {ok, op, observed, at} of record.receipts) {
            if (!ok || op !== 'measure-panel' || observed.observer !== observer || observed.flask !== sample ||
                observed.stamp !== stamp || observed.reading !== current || !positive(observed.total)) continue;
            const entries = Object.entries(observed.bounds);
            // Older receipts only attest completeness for an individual panel.
            const measuredCount = observed.constituentCount ??
                (observed.complete ? entries.filter(([, [min]]) => min > 0).length : undefined);
            for (const [part, [min, max]] of entries) {
                const quantity = brewDoseQuantity(part);
                const memory = records[`${observed.id}:${quantity}`];
                if (memory?.source.kind !== 'observation' || memory.source.by !== observer || memory.source.at !== at ||
                    memory.true.holder !== sample || memory.true.quantity !== quantity || memory.believed.value !== min) continue;
                total = observed.total;
                count = measuredCount ?? count;
                // Independent strips on the same composition can narrow a range.
                const [oldMin, oldMax] = bounds.get(part) ?? [min, max];
                bounds.set(part, [Math.max(min, oldMin), Math.min(max, oldMax)]);
            }
        }
    }
    if (!positive(total) || [...bounds.values()].some(([min, max]) => min > max)) return null;
    const measured = [...bounds].filter(([, [min]]) => min > 0);
    const mass = BigInt(total);
    const minimumMass = measured.reduce((sum, [, [min]]) => sum + BigInt(min), 0n);
    // If the minima already account for the measured mass, even a panel
    // without a constituent count can establish the complete signature.
    if (minimumMass > mass) return null;
    return {total: mass, bounds: Object.fromEntries(measured), complete: measured.length === count || minimumMass === mass};
}

function sampleReading(engine, observer, sample) {
    const exactAmounts = Object.entries(identifiedDose(engine, observer, sample));
    return exactAmounts.length ? {
        bounds: Object.fromEntries(exactAmounts.map(([part, amount]) => [part, [amount, amount]])),
        total: exactAmounts.reduce((sum, [, amount]) => sum + BigInt(amount), 0n),
        complete: true,
    } : identifiedPanel(engine, observer, sample);
}

function sampleBand({bounds, total, complete}, part) {
    const [lower, upper] = bounds[part].map(BigInt);
    const limits = Object.values(bounds);
    const lowerTotal = limits.reduce((sum, [min]) => sum + BigInt(min), 0n);
    const upperTotal = limits.reduce((sum, [, max]) => sum + BigInt(max), 0n);
    const impliedLower = complete ? total - (upperTotal - upper) : lower;
    const impliedUpper = total - (lowerTotal - lower);
    return [lower > impliedLower ? lower : impliedLower, upper < impliedUpper ? upper : impliedUpper];
}

function shareFits(reading, part, {min = 0, max = 1000}) {
    check(natural(min) && natural(max) && min <= max && max <= 1000, 'Sample shares need inclusive permille bounds.');
    if (!Object.hasOwn(reading.bounds, part)) return false;
    const [lower, upper] = sampleBand(reading, part);
    return 1000n * lower >= BigInt(min) * reading.total && 1000n * upper <= BigInt(max) * reading.total;
}

/** Match a known recipe to the complete observed dose signature. Optional
 * shares are inclusive permille bounds on the measured serving. */
export function selectIdentifiedBrewRecipe(engine, {observer, sample, recipes}) {
    const reading = sampleReading(engine, observer, sample);
    if (!reading?.complete) return null;
    const {bounds} = reading;
    const count = Object.keys(bounds).length;
    if (!count) return null;
    const exact = recipes.filter(({ingredients}) => ingredients.length === count && new Set(ingredients).size === count &&
        ingredients.every(part => Object.hasOwn(bounds, part)));
    const qualified = exact.filter(({shares}) => {
        if (shares === undefined) return false;
        check(shares && typeof shares === 'object' && !Array.isArray(shares) && Object.keys(shares).length > 0,
            'Recipe shares need named constituents.');
        return Object.entries(shares).every(([part, range]) => shareFits(reading, part, range));
    });
    if (qualified.length) return qualified.length === 1 ? qualified[0] : null;
    return exact.find(({shares}) => shares === undefined) ?? null;
}

function identifiedRemedy(engine, {observer, sample, candidates}) {
    const holders = engine.world.holders;
    const place = holders[observer]?.place;
    if (!place) return null;
    const reading = sampleReading(engine, observer, sample);
    if (!reading) return null;
    const stocked = [...new Set(candidates)].filter(id => {
        const holder = holders[id];
        return holder?.place === place && holder.as.includes('flask') &&
            Object.hasOwn(reading.bounds, holder.properties.antidote_for) &&
            Object.keys(brewDoseContents(holder)).length > 0;
    });
    const qualified = stocked.filter(id => {
        const {antidote_for: part, antidote_share_min: min, antidote_share_max: max} = holders[id].properties;
        return (min != null || max != null) && shareFits(reading, part, {min: min ?? 0, max: max ?? 1000});
    });
    const flask = qualified.length ? (qualified.length === 1 ? qualified[0] : null) : stocked.find(id => {
        const {antidote_share_min: min, antidote_share_max: max} = holders[id].properties;
        return min == null && max == null;
    });
    return flask ? {flask, reading} : null;
}

export function selectIdentifiedBrewRemedy(engine, request) {
    return identifiedRemedy(engine, request)?.flask ?? null;
}

// A measured profile specifies one draw size per bracket of sample units.
// Require the whole observed band to imply the same bracket.
export function bindIdentifiedBrewRemedy(engine, request, method) {
    const match = identifiedRemedy(engine, request);
    if (!match) return null;
    const holder = engine.world.holders[match.flask];
    const {antidote_for: part, antidote_sample_units: per, antidote_serving_units: serving} = holder.properties;
    if (per == null && serving == null) return {flask: match.flask, method};
    check(positive(per) && positive(serving), 'A measured remedy needs positive sample and serving units.');
    const [lower, upper] = sampleBand(match.reading, part);
    const divisor = BigInt(per);
    const bracket = units => (units + divisor - 1n) / divisor;
    if (bracket(lower) !== bracket(upper)) return null;
    const amount = bracket(upper) * BigInt(serving);
    const stock = Object.values(brewDoseContents(holder)).reduce((sum, units) => sum + BigInt(units), 0n);
    if (amount > stock || amount > BigInt(Number.MAX_SAFE_INTEGER)) return null;
    check(method.steps.length === 1 && method.steps[0].op === 'administer' && method.steps[0].options.volume === undefined,
        'A measured remedy needs one mass-based administration step.');
    const [step] = method.steps;
    const stockStamp = brewFlaskStamp(brewDoseContents(holder), brewFractionOf(holder), brewOriginsOf(holder), brewStorageOf(holder));
    return {flask: match.flask, method: {...method, steps: [
        {...step, options: {...step.options, amount: Number(amount), stockStamp}},
    ]}};
}

// Physiological burden is separate from received material. The authored
// order is the priority when several burdens compete for one remedy.
function reliefFor(recipient, contents, route, treatment) {
    if (treatment.route !== route) return {effects: [], cancelled: []};
    const burdens = {};
    const remedies = {};
    const conversions = new Map();
    const pairs = [];
    for (const {quantity, part, per = 1, reason} of treatment.pairs) {
        check(typeof quantity === 'string' && !quantity.startsWith('stock:'),
            'Treatment targets a recipient burden, separate from material stock.');
        check(positive(per), 'Treatment needs a positive material measure per unit of relief.');
        const burden = `burden:${quantity}`;
        const remedy = `remedy:${part}`;
        const strength = Math.floor((Object.hasOwn(contents, part) ? contents[part] : 0) / per);
        check(!conversions.has(part) || conversions.get(part) === per,
            'A shared remedy needs the same conversion for every burden.');
        conversions.set(part, per);
        remedies[remedy] = strength;
        if (Object.hasOwn(recipient.quantities, quantity)) {
            const amount = recipient.quantities[quantity];
            check(natural(amount), 'Treatment needs a nonnegative burden.');
            burdens[burden] = amount;
            pairs.push({a: burden, b: remedy, reason});
        }
    }
    const rules = defineDoseRules({id: 'b.dose.relief', revision: 1, pairs});
    const {outputs, cancelled} = cancelOutputs(rules, {[route]: {...burdens, ...remedies}});
    const effects = Object.entries(burdens).flatMap(([key, before]) => {
        const removed = before - (outputs[route]?.[key] ?? 0);
        return removed ? [{op: 'add', holder: recipient.holder, quantity: key.slice('burden:'.length), amount: -removed}] : [];
    });
    return {effects, cancelled};
}

function sizeTreatment({flask, recipient, available, total, packet, options, at}) {
    const targets = [].concat(options.sizeForBurden);
    const {treatment, route} = options;
    check(targets.length > 0 && new Set(targets).size === targets.length &&
        targets.every(quantity => treatment?.pairs.some(row => row.quantity === quantity)) &&
        options.amount === undefined && options.volume === undefined,
    'Burden-sized administration needs named treatment targets and an unmeasured serving.');
    const pending = targets.filter(quantity => positive(recipient.quantities[quantity]));
    if (!pending.length || treatment.route !== route) return {reason: 'treatment-burden-unavailable'};
    const capacity = packet?.volume ?? total;
    const meets = units => {
        // Both the phase split and the proportional mass floors are
        // monotonic. A whole serving includes all remaining phases.
        const draw = units === capacity ? available : packet ? fractionContents(splitProcessServing(packet, units).product) :
            Object.fromEntries(Object.entries(available).map(([part, held]) =>
                [part, Number(BigInt(units) * BigInt(held) / BigInt(total))]));
        const {dose} = storedBrewDose(draw, flask.brewStorage, at);
        const {effects} = reliefFor(recipient, dose.contents, route, treatment);
        return pending.every(quantity => effects.some(effect =>
            effect.quantity === quantity && effect.amount === -recipient.quantities[quantity]));
    };
    if (!meets(capacity)) return {reason: 'treatment-serving-insufficient'};
    let low = 1, high = capacity;
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        if (meets(mid)) high = mid;
        else low = mid + 1;
    }
    return {measure: low};
}

// Project the measured serving into the living body's existing liquid uptake
// interface. Its energy accounts are transient. The brew stock keeps the
// material receipt and the body owner decides the physiological response.
function uptakeEffects(flask, recipient, contents, amount, rows, route) {
    const {liquidKey} = rows[0];
    const actives = new Map();
    const stagedParts = new Set();
    for (const {part, liquidKey: carrier, activeKey} of rows) {
        check(typeof part === 'string' && typeof carrier === 'string' && typeof activeKey === 'string' &&
            carrier !== activeKey, 'Liquid uptake needs distinct liquid and active keys.');
        const active = `energy:${activeKey}`;
        if (carrier !== liquidKey || actives.has(active) || stagedParts.has(part)) return null;
        stagedParts.add(part);
        actives.set(active, Object.hasOwn(contents, part) ? contents[part] : 0);
    }
    const liquid = `energy:${liquidKey}`;
    if (amount > WORLD_QUANTITIES.energy.max || (flask.quantities[liquid] ?? 0) ||
        [...actives.keys()].some(active => (flask.quantities[active] ?? 0) !== 0) || recipient.quantities[liquid] !== 0)
        return null;
    const stage = (quantity, units) => ({op: Object.hasOwn(flask.quantities, quantity) ? 'add' : 'carry',
        holder: flask.holder, quantity, amount: units});
    const stagedAccounts = [liquid, ...actives.keys()];
    return [stage(liquid, amount), ...[...actives].map(([active, units]) => stage(active, units)),
        {sentence: {verb: 'move', object: 'essence', time: 'instant', carrier: route},
            details: {key: liquidKey, target: {shape: 'holder', id: flask.holder}, to: recipient.holder, amount}},
        ...stagedAccounts.map(quantity => ({op: 'set', holder: flask.holder, quantity, amount: 0})),
        {op: 'set', holder: recipient.holder, quantity: liquid, amount: 0},
    ];
}

// Body-surface route (proposal, wave 3). A preparation is applied to one named surface of a body (skin,
// hair, a wound) for a stated contact time. Mechanism: the surface must exist on that body (its world mark
// `surface:<name>` in the `marks` property; a bald head has no hair surface to treat), and during contact a fraction of the
// applied units reaches the body: fraction = min(1000, uptake permille per contact minute x minutes).
// The absorbed units land in the same body dose account as a swallowed dose, so every dose response
// reads them unchanged; the rest stays as surface residue in the account coat and splash already use
// (washing, drying and transfer are those packs' rules, connected and not copied). Defaults by surface,
// each with its in-world reason, and a dial (`uptakePermille` on the method overrides it):
//   skin 40 (intact skin is a slow barrier: ten minutes of contact reach four tenths),
//   hair 100 (hair holds a liquid on a large surface and takes a treatment in about ten minutes),
//   wound 250 (broken skin has no barrier: about four minutes of contact reach all of it).
// The contact time counts from the application; the dose is settled once, with no per-minute drift.
export const SURFACE_UPTAKE = Object.freeze({skin: 40, hair: 100, wound: 250});

function surfaceContact(recipient, options, drawn) {
    const {surface, contact} = options;
    if (typeof surface !== 'string' || !surface) return {reason: 'surface-unnamed'};
    if (!(recipient.properties?.marks ?? []).includes(`surface:${surface}`)) return {reason: 'recipient-lacks-surface'};
    const rate = options.uptakePermille ?? SURFACE_UPTAKE[surface];
    if (!natural(rate) || rate > 1000) return {reason: 'surface-uptake-unset'};
    if (!positive(contact)) return {reason: 'contact-time-unset'};
    const fraction = Math.min(1000, rate * contact);
    const absorbed = {}, remaining = {};
    for (const [part, units] of Object.entries(drawn)) {
        const taken = Number(BigInt(units) * BigInt(fraction) / 1000n);
        if (taken) absorbed[part] = taken;
        if (units - taken) remaining[part] = units - taken;
    }
    return {absorbed, remaining};
}

const doseOperations = {
    administer: {roles, minutes: 2, settle({bound: {flask, recipient}, options, at, address}, mode = 'dose') {
        const coating = mode === 'coat';
        if (!flask.holder || !recipient.holder || flask.holder === recipient.holder || !flask.place || flask.place !== recipient.place)
            return {ok: false, reason: 'serving-out-of-reach'};
        const available = brewDoseContents(flask);
        if (options.stockStamp !== undefined &&
            options.stockStamp !== brewFlaskStamp(available, flask.brewFraction, flask.brewOrigins, flask.brewStorage))
            return {ok: false, reason: 'remedy-stock-changed'};
        const total = Object.values(available).reduce((sum, units) => sum + units, 0);
        if (!total) return {ok: false, reason: 'empty-flask'};
        const packet = flask.brewFraction;
        let volume = options.volume;
        const sizeByVolume = options.sizeForBurdenByVolume === true;
        if (sizeByVolume && (options.sizeForBurden === undefined || !packet?.volume))
            return {ok: false, reason: 'serving-measure-unavailable'};
        if (volume !== undefined && (options.amount !== undefined || !packet || !positive(volume) || volume > packet.volume))
            return {ok: false, reason: 'serving-measure-unavailable'};
        if ((volume !== undefined || sizeByVolume) && !matchesFraction(packet, available))
            return {ok: false, reason: 'serving-phase-stock-changed'};
        let measure = options.amount ?? total;
        if (options.sizeForBurden !== undefined) {
            const sized = sizeTreatment({flask, recipient, available, total, packet: sizeByVolume ? packet : null, options, at});
            if (sized.reason) return {ok: false, reason: sized.reason};
            if (sizeByVolume) volume = sized.measure;
            else measure = sized.measure;
        }
        const split = volume !== undefined && volume < packet.volume ? splitProcessServing(packet, volume) : null;
        if (!positive(measure) || measure > total) return {ok: false, reason: 'serving-measure-unavailable'};
        const drawn = split ? fractionContents(split.product) : measuredBrewShare(available, measure, total);
        const amount = Object.values(drawn).reduce((sum, units) => sum + units, 0);
        if (!amount) return {ok: false, reason: 'serving-measure-unavailable'};
        const {dose: {contents: delivered}, state} = storedBrewDose(drawn, flask.brewStorage, at);
        const surface = mode === 'apply' ? surfaceContact(recipient, options, delivered) : null;
        if (surface?.reason) return {ok: false, reason: surface.reason};
        // Responses read what reached the body: the whole dose, or the share a surface let through.
        const contents = surface ? surface.absorbed : delivered;
        const deposits = surface
            ? [...Object.entries(surface.absorbed).map(([part, amount]) => [brewDoseQuantity(part), amount, WORLD_QUANTITIES.stock.max]),
                ...Object.entries(surface.remaining).map(([part, amount]) => [residueQuantity(part), amount, WORLD_QUANTITIES.residue.max])]
            : Object.entries(delivered).map(([part, amount]) => coating
                ? [residueQuantity(part), amount, WORLD_QUANTITIES.residue.max] : [brewDoseQuantity(part), amount, WORLD_QUANTITIES.stock.max]);
        const effects = [];
        for (const [quantity, amount, max] of deposits) {
            const held = recipient.quantities[quantity];
            if (amount > max - (held ?? 0)) return {ok: false, reason: 'recipient-dose-account-full'};
            effects.push(held === undefined ? {op: 'carry', holder: recipient.holder, quantity, amount} :
                {op: 'add', holder: recipient.holder, quantity, amount});
        }
        for (const [part, units] of Object.entries(drawn))
            effects.push({op: 'add', holder: flask.holder, quantity: brewDoseQuantity(part), amount: -units});
        effects.push(split ? setBrewFraction(flask.holder, split.residue) : clearBrewFraction(flask.holder));
        const empty = !split && amount === total;
        if (empty) effects.push(clearBrewOrigins(flask.holder));
        else if (flask.brewOrigins) effects.push(setBrewOrigins(flask.holder, Object.fromEntries(Object.entries(flask.brewOrigins)
            .filter(([part]) => available[part] > (drawn[part] ?? 0)))));
        if (flask.brewStorage && empty) effects.push(clearBrewStorage(flask.holder));
        const relief = options.treatment && reliefFor(recipient, contents, options.route, options.treatment);
        if (relief) effects.push(...relief.effects);
        const selected = new Set();
        const formProperties = {...recipient.properties};
        const uptakeRows = [];
        let uptakePosition;
        const meets = ({part, minimum}) => (Object.hasOwn(contents, part) ? contents[part] : 0) >= minimum;
        // Within a group, the first matching row wins. Ungrouped rows retain
        // the original ordered fallback behavior.
        for (const [index, outcome] of options.responses.entries()) {
            const group = outcome.group ?? null;
            check(group === null || typeof group === 'string' && group.length > 0, 'A dose response group needs a name.');
            if (selected.has(group) || (outcome.route != null && outcome.route !== options.route) ||
                !meets(outcome) || !(outcome.requires ?? []).every(meets)) continue;
            selected.add(group);
            const responseAddress = group === null ? address : `${address}/response/${index}`;
            const fieldId = responseAddress.replaceAll('/', '.');
            if (outcome.luck) {
                const {action, bonus, minutes} = outcome.luck;
                check(typeof action === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(action) &&
                    positive(bonus) && bonus <= 1000 && positive(minutes) && positive(at + minutes), 'Invalid scoped luck dose.');
                effects.push({op: 'law_add', field: {id: `luck.${fieldId}`,
                    scope: recipient.holder, kind: 'working-luck', params: {action, bonus}, until: at + minutes}});
            }
            if (outcome.steam) {
                const {minutes, humidityPerMinute} = outcome.steam;
                check(positive(minutes) && positive(at + minutes) && positive(humidityPerMinute) &&
                    humidityPerMinute <= WORLD_QUANTITIES.humidity.max, 'Invalid timed steam response.');
                effects.push({op: 'law_add', field: {id: `steam.${fieldId}`, scope: recipient.holder,
                    kind: 'body-steam', params: {humidityPerMinute}, until: at + minutes}});
            }
            if (outcome.haulStrength) {
                const {bonus, minutes} = outcome.haulStrength;
                check(positive(bonus) && positive(minutes) && positive(at + minutes), 'Invalid timed haul strength.');
                effects.push({op: 'law_add', field: {id: `haul-strength.${fieldId}`,
                    scope: recipient.holder, kind: 'haul-strength', params: {bonus}, until: at + minutes}});
            }
            if (outcome.liquidUptake) {
                uptakePosition ??= effects.length;
                uptakeRows.push(outcome.liquidUptake);
            } else if (outcome.clearTemporaryForm) {
                check(typeof outcome.clearTemporaryForm === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(outcome.clearTemporaryForm),
                    'Invalid temporary potion form to clear.');
                const changes = releaseCreatureForm({...recipient, properties: formProperties}, at, outcome.clearTemporaryForm);
                for (const change of changes) formProperties[change.property] = change.value;
                effects.push(...changes);
            } else if (outcome.temporaryForm) {
                const {form, minutes, priority} = outcome.temporaryForm;
                check(typeof form === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(form) && positive(minutes) &&
                    positive(priority) && positive(at + minutes), 'Invalid temporary potion form.');
                const layer = [form, priority, at + minutes].join('|');
                const value = [...new Set([...(formProperties['temporary-form-layers'] ?? []), layer])];
                formProperties['temporary-form-layers'] = value;
                effects.push({op: 'property', holder: recipient.holder, property: 'temporary-form-layers', value});
            } else if (outcome.sentence) {
                const details = {...outcome.details, place: recipient.place, target: {shape: 'holder', id: recipient.holder}};
                if (coating && outcome.sentence.verb === 'block' && details.field)
                    details.field = `${details.field}.${fieldId}`;
                if (group !== null && details.mind) details.working ??= responseAddress;
                if (outcome.mindUnitsPerPoint !== undefined) {
                    check(positive(outcome.mindUnitsPerPoint) && typeof details.mind?.faculty === 'string',
                        'A measured mind response needs a faculty and a positive measure per point.');
                    const direction = outcome.mindDirection ?? 1;
                    check(direction === 1 || direction === -1, 'A measured mind response needs a unit direction.');
                    details.mind = {...details.mind, amount: direction * Math.floor((contents[outcome.part] ?? 0) / outcome.mindUnitsPerPoint)};
                }
                effects.push({sentence: {...outcome.sentence, carrier: options.route}, details});
            }
            for (const [extraIndex, {sentence, details}] of (outcome.additionalEffects ?? []).entries()) {
                effects.push({sentence: {...sentence, carrier: options.route}, details: {...details,
                    ...(group !== null && details?.mind && details.working === undefined ?
                        {working: `${responseAddress}/extra/${extraIndex}`} : {}),
                    place: recipient.place, target: {shape: 'holder', id: recipient.holder}}});
            }
        }
        if (uptakeRows.length) {
            const uptake = uptakeEffects(flask, recipient, contents, amount, uptakeRows, options.route);
            if (!uptake) return {ok: false, reason: 'liquid-uptake-account-unavailable'};
            effects.splice(uptakePosition, 0, ...uptake);
        }
        const origins = Object.fromEntries(Object.entries(flask.brewOrigins ?? {}).filter(([part]) => Object.hasOwn(contents, part)));
        return {ok: true, effects, observed: {route: options.route, contents, ...(volume === undefined ? {} : {volume}),
            ...(Object.keys(origins).length ? {origins} : {}),
            ...(state ? {storage: state} : {}),
            ...(relief ? {cancelled: relief.cancelled} : {})}};
    }},
};

export const BREW_DOSE_LAW = defineWorkingLaw({id: 'b.dose', revision: 1, operations: {
    ...doseOperations,
    coat: {...doseOperations.administer, roles: coatingRoles, settle(args) {
        if (args.options.route !== 'coat') return {ok: false, reason: 'coating-route-unavailable'};
        return doseOperations.administer.settle(args, 'coat');
    }},
    apply: {...doseOperations.administer, settle(args) {
        if (args.options.route !== 'apply') return {ok: false, reason: 'surface-route-unavailable'};
        return doseOperations.administer.settle(args, 'apply');
    }},
}});

export function brewDoseMethod({id, route, amount, volume, responses = [], treatment, sizeForBurden, sizeForBurdenByVolume, surface, contact, uptakePermille}) {
    return {id, revision: 1, law: BREW_DOSE_LAW.ref, roles,
        steps: [{op: 'administer', bindings: {flask: 'flask', recipient: 'recipient'},
            options: {route, responses, ...(surface === undefined ? {} : {surface}), ...(contact === undefined ? {} : {contact}),
                ...(uptakePermille === undefined ? {} : {uptakePermille}), ...(amount === undefined ? {} : {amount}), ...(volume === undefined ? {} : {volume}),
                ...(treatment ? {treatment} : {}), ...(sizeForBurden === undefined ? {} : {sizeForBurden}),
                ...(sizeForBurdenByVolume ? {sizeForBurdenByVolume} : {})}}]};
}

export function brewCoatingMethod({id, amount, responses}) {
    const method = brewDoseMethod({id, amount, responses, route: 'coat'});
    return {...method, roles: coatingRoles, steps: method.steps.map(step => ({...step, op: 'coat'}))};
}

/** A preparation applied to a named surface of a body for a contact time (see SURFACE_UPTAKE). */
export function brewApplyMethod({id, surface, contact, uptakePermille, amount, responses = []}) {
    const method = brewDoseMethod({id, route: 'apply', amount, responses, surface, contact, uptakePermille});
    return {...method, steps: method.steps.map(step => ({...step, op: 'apply'}))};
}
