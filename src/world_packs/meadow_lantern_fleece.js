// Original headless breeding line. The same light-reactive coat supplies
// extra fleece and stores enough daylight to give off a brief flash.
import {defineWorkingLaw, interruptWorking, restoreWorking} from '../kernel_working.js';
import {MEADOW_BREEDING_GENOME} from '../living_genomes.js';
import {expressGenes, geneContributions, validateGenes, validateGenome} from '../heredity.js';
import {measureCreatureCapability} from '../creature_methods.js';
import {FINE_WOOL_KEY, planMeadowFleece} from '../meadow_fleece.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES as Q} from '../world_quantities.js';
import {creatureForm, defineCreatureEvolution, hasTemporaryCreatureForm, releaseCreatureForm} from '../creature_evolution.js';
import {advanceEngineWorld, applyEngineOps, engineReceipts, startEngineWorking} from '../engine_world.js';
import {changeCreatureSpecies, creatureDevelopment, creatureIncubationConditions, creatureMaturityAt,
    practiceWithCreature, replaceCreatureAlleles, transferCreature} from '../creature_lifecycle.js';
import {linkExits, linksWithin, readLineage, worldLinks} from '../world_substrate.js';
import {readLivingBody} from '../living_body.js';
import {JUVENILE_GROWTH, SATIETY} from '../world_substrate_packs/living_body.js';
import {syncCreatureGrowthCare} from '../creature_growth_world.js';
import {brewDoseMethod} from '../brew_dose_delivery.js';
import {brewMethod} from '../brew_law.js';
import {bloodline} from '../kernel_descent.js';

export {syncCreatureGrowthCare as syncLanternGrowthCare};

export const LANTERN_FLEECE_GENOME = validateGenome({
    ...MEADOW_BREEDING_GENOME,
    id: 'village.sheep.lantern-fleece',
    ivs: undefined,
    loci: {...MEADOW_BREEDING_GENOME.loci,
        coat: {...MEADOW_BREEDING_GENOME.loci.coat, shows: {mature: true},
            contributions: {'fleece.yield': 2, 'lantern-fleece.light': 4}}},
});
const mistHumidity = 60;
const nurseryHumidity = 'nursery-humidity-mark';
export const MIST_LANTERN_GENOME = validateGenome({
    ...LANTERN_FLEECE_GENOME, id: 'village.sheep.mist-lantern',
    loci: {...LANTERN_FLEECE_GENOME.loci, fleece: {...LANTERN_FLEECE_GENOME.loci.fleece,
        shows: {...LANTERN_FLEECE_GENOME.loci.fleece.shows, suppressedBy: ['nursery-warmth-mark']}},
    coat: {
        ...LANTERN_FLEECE_GENOME.loci.coat,
        shows: {mature: true, needs: {quantity: 'humidity', min: mistHumidity}, suppressedBy: [nurseryHumidity]},
    }},
});
const mistCoat = 'lantern-mist-coat';
const sustainMistVeil = 'lantern-sustain-mist-veil';
const ventilation = 'lantern-ventilation';

const light = {id: 'lantern-fleece.light', unit: 'grade', combine: 'sum'};
const charge = 'energy:lantern-charge';
const readiness = 'lantern-fleece-ready-at';
const capacity = 'lantern-fleece-capacity';
const fine = 'stock:fine-wool', plain = 'stock:wool';
const woolLamp = 'lantern-wool-lamp';
const lightAccount = 'light:lantern-fleece';
const shade = 'lantern-shade';
const roles = {animal: 'body'};
const feedingRoles = {...roles, keeper: 'body'};
const huskChargeRoles = {...feedingRoles, shell: 'thing'};
const meadowHay = 'stock:meadow-hay';
const coatWash = 'stock:lantern-coat-wash';
const coatWashUntil = 'lantern-coat-wash-until';
const coatWashMinutes = 4;
const coatGraft = 'stock:lantern-coat-graft';
const coatRepair = 'lantern-coat-repair-left';
const coatRepairMinutes = 3;
const coatRepairSusceptible = 'lantern-coat-repair-susceptible';
const coatRepairLiquidKey = 'lantern-coat-repair-liquid';
const coatRepairActiveKey = 'lantern-coat-repair-active';
const coatRepairLiquid = `energy:${coatRepairLiquidKey}`;
const coatRepairActive = `energy:${coatRepairActiveKey}`;
const coatRepairContact = 2;
const stillGrowing = animal => animal.quantities?.[JUVENILE_GROWTH.id] > 0;
const flashResponsiveness = 50;
const lanternForm = 'lantern-fleece';
const beaconForm = 'beacon-fleece';
const hearthForm = 'hearth-fleece';
const moonForm = 'moon-fleece';
const stormForm = 'storm-fleece';
const prismForm = 'prism-fleece';
const marketForm = 'market-fleece';
const companionForm = 'companion-fleece';
const companionBond = 6;
const signalSkill = 'lantern-signal';
const barterStock = 'stock:lantern-barter';
const prismCollar = 'lantern-prism-collar';
const prismAnchor = 'lantern-prism-anchor';
export const LANTERN_BATTLE_FORM = 'guard-fleece';
const wispForm = 'husk-wisp';
const wispCapacity = 'husk-wisp-capacity';
const wispBasking = 'husk-wisp-basking';
export const WISP_FORAGE_RANGE = 'husk-wisp-forage-range';
export const WISP_TIMED_FLIGHT = 'husk-wisp-timed-flight';
const wispPaths = {kinds: ['wisp-path']};
export const WISP_NECTAR = 'stock:husk-wisp-nectar';
const nectarCapacity = 'husk-wisp-nectar-capacity';
const isWisp = holder => holder.kind === 'body' && (holder.tags.includes(wispForm) || holder.properties.form === wispForm);
function nectarRoomInDaylight(view, id) {
    if (view.property(id, shade) || !view.has(id, 'daylight') || view.amount(id, 'daylight') !== 1) return 0;
    return view.property(id, nectarCapacity) - view.amount(id, WISP_NECTAR);
}
function wispHasRoom(view, place) {
    return !wispHabitatAtLimit(view.property(place, wispCapacity), () => view.present(place).filter(other =>
        isWisp({...view.holder(other), properties: view.properties(other)})).length);
}

function wispForageExit(view, id, place, stocked) {
    const exits = view.exits(place, wispPaths);
    const maxLinks = view.property(id, WISP_FORAGE_RANGE) ?? 1;
    if (maxLinks === 1) return exits.filter(({to}) => stocked(to) && wispHasRoom(view, to))
        .sort((a, b) => a.cost - b.cost)[0];
    const links = view.links().filter(({kind, from, to}) => kind === 'wisp-path' &&
        (from === place || wispHasRoom(view, from)) && (to === place || wispHasRoom(view, to)));
    const patch = linksWithin(links, place, {maxLinks})
        .filter(way => way.links > 0 && stocked(way.place))
        .sort((a, b) => a.cost - b.cost || a.links - b.links)[0];
    return exits.find(exit => exit.link === patch?.route[0]);
}

function wispFeedingOps(view, id) {
    const place = view.placeOf(id);
    const flight = view.state(id)?.flight;
    const hungry = view.has(id, charge) && view.amount(id, charge) === 0;
    if (flight) {
        const clear = {op: 'state', holder: id, value: null};
        const exit = place === flight.from && view.exits(place, wispPaths)
            .find(way => way.link === flight.link && way.to === flight.to);
        if (!hungry || !exit || !wispHasRoom(view, flight.to)) return [clear];
        return view.clock < flight.arriveAt ? [] : [clear, {op: 'move', holder: id, to: flight.to}];
    }
    if (!hungry || !place) return [];
    const stocked = site => view.has(site, WISP_NECTAR) && view.amount(site, WISP_NECTAR) > 0;
    if (stocked(place)) return [
        {op: 'add', holder: place, quantity: WISP_NECTAR, amount: -1},
        {op: 'add', holder: id, quantity: charge, amount: 1},
    ];
    const exit = wispForageExit(view, id, place, stocked);
    if (!exit) return [];
    if (!view.property(id, WISP_TIMED_FLIGHT)) return [{op: 'move', holder: id, to: exit.to}];
    return [{op: 'state', holder: id, value: {flight: {from: place, link: exit.link, to: exit.to,
        arriveAt: view.clock + Math.max(1, exit.cost)}}}];
}

function wispHabitatAtLimit(limit, count) {
    return limit != null && count() >= limit;
}

function wispHabitatFull(world, place, placeOfHolder = holder => holder.place) {
    return wispHabitatAtLimit(world.holders[place]?.properties[wispCapacity], () =>
        Object.values(world.holders).filter(holder => placeOfHolder(holder) === place && isWisp(holder)).length);
}
const prism = 'stock:sun-prism';
const husk = 'stock:lantern-husk';
const packedHusk = 'lantern-husk-parcel';
const custodian = 'custodian';

function keeperPresent(world, keeper, place) {
    const body = world.holders[keeper];
    return body?.kind === 'body' && body.place === place && body.properties.alive !== false;
}

export const BEACON_SHEEP_GENOME = validateGenome({
    ...LANTERN_FLEECE_GENOME, id: 'village.beacon-sheep',
    loci: {...LANTERN_FLEECE_GENOME.loci, coat: {...LANTERN_FLEECE_GENOME.loci.coat,
        contributions: {...LANTERN_FLEECE_GENOME.loci.coat.contributions, 'fleece.yield': 3}}},
});

export const BEACON_SHEEP_KIND = {
    id: 'beacon-sheep', label: 'Beacon sheep', class: 'animal', needs: 'sheep',
    inheritance: 'alleles', genome: BEACON_SHEEP_GENOME.id,
    reproduction: ['pair'], stages: ['juvenile', 'adult'], lifespan: null, organs: [],
    diet: {food: 'Meadow hay'}, source: {kind: 'original', locator: 'Lantern Fleece Sun Molt'},
};
export const MIST_LANTERN_KIND = {
    ...BEACON_SHEEP_KIND, id: 'mist-lantern-sheep', label: 'Mist Lantern sheep',
    genome: MIST_LANTERN_GENOME.id, source: {kind: 'original', locator: 'Mist Lantern habitat'},
};

const packCause = working => `lantern-husk-pack:${working}`;
const awakenCause = parent => `lantern-husk:${parent}`;
const parcelOrigin = (world, id) => readLineage(world, id)
    .find(row => row.act === 'create' && row.note === packedHusk)?.parents[0];
const parcelSpent = (world, id, parent) => readLineage(world, id)
    .some(row => row.act === 'create' && row.role === 'parent' && row.cause === awakenCause(parent));

function unpackedMolt(engine, parent, altar) {
    const history = readLineage(engine.world, parent);
    if (history.some(row => row.act === 'create' && row.cause === awakenCause(parent))) return undefined;
    return engineReceipts(engine).find(row => row.ok && row.method === 'sun-molt' && row.op === 'sun-molt' &&
        row.bindings.animal?.id === parent && row.bindings.altar?.id === altar &&
        engine.records.workings[row.working].law === LANTERN_EVOLUTION.law.ref &&
        !history.some(entry => entry.act === 'create' && entry.cause === packCause(row.working)));
}

function huskFromParent(engine, parent, shell) {
    return shell.tags.includes(packedHusk)
        ? parcelOrigin(engine.world, shell.id) === parent && !parcelSpent(engine.world, shell.id, parent)
        : Boolean(unpackedMolt(engine, parent, shell.id));
}

export function packLanternHusk(engine, {parent, altar, parcel, keeper}) {
    const {world} = engine;
    const source = world.holders[parent], shell = world.holders[altar];
    const shed = unpackedMolt(engine, parent, altar);
    if (!shed || source?.kind !== 'body' || !source.place || shell?.kind !== 'thing' || shell.place !== source.place ||
        !(shell.quantities[husk] >= 1))
        return {ok: false, reason: 'lantern-husk-needs-parent-and-shell', engine};
    const holder = shell.properties[custodian];
    if ((holder !== undefined && holder !== keeper) ||
        (keeper !== undefined && !keeperPresent(world, keeper, shell.place)))
        return {ok: false, reason: 'lantern-husk-custody', engine};
    const settled = applyEngineOps(engine, [{op: 'lifecycle', act: 'create', parents: [parent], from: [altar],
        note: packedHusk, value: {id: parcel, kind: 'thing', place: shell.place, tags: [packedHusk],
            properties: keeper === undefined ? {} : {[custodian]: keeper},
            quantities: {[husk]: 1, [charge]: shell.quantities[charge] > 0 ? 1 : 0}}}], packCause(shed.working));
    return !world.holders[parcel] && settled.world.holders[parcel] ? {ok: true, engine: settled} :
        {ok: false, reason: 'lantern-husk-identity-unavailable', engine};
}

// E12 moves the actual material and charge and keeps its provenance.
export function awakenLanternHusk(engine, {parent, huskHolder, offspring, keeper}) {
    const {world} = engine;
    const source = world.holders[parent], shell = world.holders[huskHolder];
    const shed = shell && huskFromParent(engine, parent, shell);
    if (!shed || source?.kind !== 'body' || source.properties.form !== beaconForm || shell?.kind !== 'thing' ||
        !source.place || source.place !== shell.place || !(shell.quantities[husk] >= 1) ||
        !(shell.quantities[charge] >= 1))
        return {ok: false, reason: 'lantern-husk-needs-parent-and-charge', engine};
    const holder = shell.properties[custodian];
    if (holder !== undefined && (holder !== keeper || !keeperPresent(world, keeper, shell.place)))
        return {ok: false, reason: 'lantern-husk-custody', engine};
    if (wispHabitatFull(world, source.place))
        return {ok: false, reason: 'lantern-wisp-habitat-full', engine};
    const settled = applyEngineOps(engine, [{op: 'lifecycle', act: 'create', parents: shell.tags.includes(packedHusk) ? [parent, huskHolder] : [parent], from: [huskHolder],
        value: {id: offspring, kind: 'body', place: source.place, tags: [wispForm], properties: {form: wispForm},
            quantities: {[husk]: 1, [charge]: 1}}}], awakenCause(parent));
    if (!world.holders[offspring] && settled.world.holders[offspring]) return {ok: true, engine: settled};
    return {ok: false, reason: 'lantern-husk-identity-unavailable', engine};
}

// This caller represents an agreed exchange. Custody and payment settle together.
export function tradeLanternHusk(engine, {parcel, seller, buyer, price}) {
    const {world} = engine;
    const shell = world.holders[parcel];
    const parent = parcelOrigin(world, parcel);
    if (!Number.isSafeInteger(price) || price < 0) throw Error('A husk trade needs a whole price.');
    if (shell?.kind !== 'thing' || !shell.tags.includes(packedHusk) || !parent || parcelSpent(world, parcel, parent) ||
        !(shell.quantities[husk] > 0) ||
        shell.properties[custodian] !== seller || seller === buyer ||
        !keeperPresent(world, seller, shell.place) || !keeperPresent(world, buyer, shell.place))
        return {ok: false, reason: 'lantern-husk-custody', engine};
    const purse = world.holders[buyer].quantities[barterStock];
    const till = world.holders[seller].quantities[barterStock];
    if (price && (!(purse >= price) || !(till <= Q.stock.max - price)))
        return {ok: false, reason: 'lantern-husk-trade-stock', engine};
    const payment = price ? [
        {op: 'add', holder: buyer, quantity: barterStock, amount: -price},
        {op: 'add', holder: seller, quantity: barterStock, amount: price},
    ] : [];
    return {ok: true, engine: applyEngineOps(engine, [...payment,
        {op: 'property', holder: parcel, property: custodian, value: buyer}], `lantern-husk-trade:${parcel}`)};
}

// The growth offer uses the measured stature to choose a route.
// Settlement reads the measurement again before paying.
const beaconStature = 70;
const statureMolts = [
    {id: 'beacon-stature-molt', to: beaconForm, op: 'atLeast'},
    {id: 'hearth-stature-molt', to: hearthForm, op: 'less'},
].map(({id, to, op}) => ({
    id, to, from: lanternForm, trigger: 'growth', minutes: 1, roles,
    needs: [
        {role: 'animal', field: 'properties', key: 'lantern-growth-ready', op: 'is', value: true},
        {role: 'animal', field: 'properties', key: 'lantern-height-cm', op, value: beaconStature},
        {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
        {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
    ],
    spends: [{role: 'animal', quantity: charge, amount: 1, max: Q.energy.max}],
}));

const humidCoat = {role: 'site', field: 'quantities', key: 'humidity', op: 'atLeast', value: mistHumidity};
const coatExpressionAlternatives = [
    [{role: 'animal', field: 'properties', key: mistCoat, op: 'isNot', value: true}],
    [humidCoat, {role: 'animal', field: 'properties', key: coatRepairSusceptible, op: 'isNot', value: true}],
    [humidCoat, {role: 'animal', field: 'quantities', key: coatRepair, op: 'is', value: 0}],
    [humidCoat, {role: 'animal', field: 'properties', key: coatWashUntil, op: 'greater', other: {clock: true}}],
];

export const LANTERN_EVOLUTION = defineCreatureEvolution({
    id: 'village.lantern-evolution', revision: 1, routes: [{
        id: 'sun-molt', trigger: 'item', from: lanternForm, to: beaconForm, minutes: 1,
        preserveTemporary: true,
        roles: {animal: 'body', site: 'place', altar: 'thing'},
        needs: [
            {role: 'site', field: 'quantities', key: 'daylight', op: 'is', value: 1},
            {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
            {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
            {role: 'animal', field: 'quantities', key: charge, op: 'atLeast', other: {role: 'animal', field: 'properties', key: capacity}},
        ],
        alternatives: coatExpressionAlternatives,
        spends: [{role: 'altar', quantity: prism, amount: 1, max: Q.stock.max}],
        outputs: [{role: 'altar', quantity: husk, amount: 1, max: 1}],
    }, {
        id: 'companion-molt', trigger: 'growth', from: lanternForm, to: companionForm, roles,
        needs: [
            {role: 'animal', field: 'properties', key: 'lantern-mature', op: 'is', value: true},
            {role: 'animal', field: 'properties', key: 'lantern-bond', op: 'atLeast', value: companionBond},
            {role: 'animal', field: 'properties', key: 'lantern-learned', op: 'has', value: signalSkill},
            {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
            {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
        ],
        spends: [{role: 'animal', quantity: charge, amount: 1, max: Q.energy.max}],
    }, {
        id: 'market-molt', trigger: 'trade', from: lanternForm, to: marketForm,
        roles: {animal: 'body', buyer: 'body', seller: 'body', market: 'place'},
        needs: [
            {role: 'market', field: 'properties', key: 'lantern-market', op: 'is', value: true},
            {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
            {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
        ],
        spends: [{role: 'buyer', quantity: barterStock, amount: 1, max: Q.stock.max}],
        outputs: [{role: 'seller', quantity: barterStock, amount: 1, max: Q.stock.max}],
    }, {
        id: 'moon-veil', trigger: 'event', from: lanternForm, to: moonForm, minutes: 1,
        temporary: {duration: 6}, roles: {animal: 'body', site: 'place'},
        alternatives: coatExpressionAlternatives,
        needs: [
            {role: 'site', field: 'quantities', key: 'daylight', op: 'is', value: 0},
            {role: 'site', field: 'quantities', key: 'moon_phase', op: 'is', value: 4},
            {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
            {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
        ],
        spends: [{role: 'animal', quantity: charge, amount: 1, max: Q.energy.max}],
    }, {
        id: 'storm-mantle', trigger: 'item', from: lanternForm, to: stormForm, minutes: 1,
        temporary: {duration: 3, priority: 10}, roles: {animal: 'body', catalyst: 'thing'},
        needs: [{role: 'animal', field: 'quantities', key: charge, op: 'atLeast', value: 1}],
        spends: [{role: 'catalyst', quantity: 'stock:storm-salt', amount: 1, max: Q.stock.max}],
    }, {
        id: 'guard-fleece', trigger: 'battle', from: lanternForm, to: LANTERN_BATTLE_FORM,
        temporary: {priority: 5}, roles,
        needs: [
            {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
            {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
        ],
        spends: [{role: 'animal', quantity: charge, amount: 1, max: Q.energy.max}],
    }, {
        id: 'prism-collar', trigger: 'item', from: lanternForm, to: prismForm,
        temporary: {priority: 15}, roles: {animal: 'body', collar: 'thing'},
        needs: [
            {role: 'collar', field: 'properties', key: prismCollar, op: 'is', value: true},
            {role: 'animal', field: 'properties', key: capacity, op: 'atLeast', value: 4},
            {clock: true, op: 'atLeast', other: {role: 'animal', field: 'properties', key: readiness}},
        ],
        spends: [{role: 'animal', quantity: charge, amount: 1, max: Q.energy.max}],
    }, ...statureMolts],
});

export function offerLanternStatureMolt(engine, {id, working}) {
    const body = engine.world.holders[id];
    if (body?.kind !== 'body' || body.refs.creature !== id || body.properties.form !== lanternForm ||
        Object.hasOwn(engine.records.workings, working)) return engine;
    const facts = engine.host.ports.readThing?.({kind: 'body', id}, engine.world.clock,
        engine.world, engine.records, {drawRoot: engine.draws.root})?.properties;
    const height = facts?.['lantern-height-cm'];
    if (!facts?.['lantern-growth-ready'] || !Number.isSafeInteger(height)) return engine;
    const {law, methods} = LANTERN_EVOLUTION;
    const method = methods[height >= beaconStature ? 'beacon-stature-molt' : 'hearth-stature-molt'];
    return startEngineWorking(engine, {law, method, id: working, bindings: {animal: {kind: 'body', id}}});
}

// The offer can follow a practice session or a world advance. The lifecycle
// owns the facts, and the instant working reads them only for this settlement.
export function offerLanternGrowth({engine, lifecycle}, {id, keeper, working}) {
    const animal = lifecycle.individuals[id], body = engine.world.holders[id];
    if (animal?.species !== 'sheep' || animal.keeper !== keeper || animal.deadAt !== undefined ||
        body?.kind !== 'body' || body.refs.creature !== id || body.place !== animal.habitat ||
        body.properties.form !== lanternForm || engine.world.clock < animal.bornAt ||
        Object.hasOwn(engine.records.workings, working)) return engine;

    const {mature} = creatureDevelopment(lifecycle, id, engine.world.clock);
    const experience = animal.experience[keeper];
    const key = `body:${id}`, things = engine.host.things;
    const thing = things[key];
    const staged = {...engine, host: {...engine.host, things: {...things, [key]: {...thing, properties: {
        ...thing?.properties, 'lantern-mature': mature && !stillGrowing(body), 'lantern-bond': experience?.bond ?? 0,
        'lantern-learned': Object.keys(experience?.training ?? {}),
    }}}}};
    const {law, methods} = LANTERN_EVOLUTION;
    const offered = startEngineWorking(staged, {law, method: methods['companion-molt'], id: working,
        bindings: {animal: {kind: 'body', id}}});
    return {...offered, host: {...offered.host, things}};
}

export function practiceLanternSheep({engine, lifecycle}, {id, keeper, working, skill}) {
    const body = engine.world.holders[id], trainer = engine.world.holders[keeper];
    if (body?.kind !== 'body' || body.refs.creature !== id || trainer?.kind !== 'body' ||
        trainer.place !== body.place || lifecycle.individuals[id]?.habitat !== body.place ||
        lifecycle.individuals[id].keeper !== keeper || Object.hasOwn(engine.records.workings, working))
        return {engine, lifecycle};
    const trained = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: keeper,
        clock: engine.world.clock, minimumGap: 1, bondGain: 3, skill});
    return {lifecycle: trained, engine: offerLanternGrowth({engine, lifecycle: trained}, {id, keeper, working})};
}

// The barter caller owns keeper authority. Publish the custody transfer and
// the paid trade working together, using the current meeting place.
export function tradeLanternSheep(state, {id, seller, buyer, habitat, working}) {
    const {engine, lifecycle} = state;
    const animal = lifecycle.individuals[id], body = engine.world.holders[id];
    const unchanged = {changed: false, engine, lifecycle};
    if (new Set([id, seller, buyer]).size !== 3 || animal?.species !== 'sheep' ||
        animal.keeper !== seller || animal.deadAt !== undefined || body?.refs.creature !== id ||
        body.kind !== 'body' || body.place !== habitat?.id || animal.habitat !== habitat.id ||
        [buyer, seller].some(keeper => engine.world.holders[keeper]?.kind !== 'body') ||
        Object.hasOwn(engine.records.workings, working)) return unchanged;
    const transferred = transferCreature(lifecycle, {revision: lifecycle.revision, id, fromKeeper: seller,
        toKeeper: buyer, destination: habitat, clock: engine.world.clock});
    const {law, methods} = LANTERN_EVOLUTION;
    const traded = startEngineWorking(engine, {law, method: methods['market-molt'], id: working, bindings: {
        animal: {kind: 'body', id}, buyer: {kind: 'body', id: buyer}, seller: {kind: 'body', id: seller},
        market: {kind: 'place', id: body.place},
    }});
    const receipt = traded.records.workings[working].record.receipts[0];
    return receipt?.ok ? {changed: true, engine: traded, lifecycle: transferred} :
        {...unchanged, reason: receipt?.reason};
}

export function fastenLanternPrism(engine, {id, collar, working}) {
    const body = engine.world.holders[id];
    if (body?.kind !== 'body' || !body.place || engine.world.holders[collar]?.kind !== 'thing' ||
        engine.records.workings[working] || !engine.rules.packs.includes(LANTERN_PRISM_COLLAR_PACK.id) ||
        Object.values(engine.world.holders).some(holder => holder.properties[prismAnchor] === collar &&
            hasTemporaryCreatureForm(holder, engine.world.clock, prismForm)))
        return engine;
    const {law, methods} = LANTERN_EVOLUTION;
    const started = startEngineWorking(engine, {law, method: methods['prism-collar'], id: working,
        bindings: {animal: {kind: 'body', id}, collar: {kind: 'thing', id: collar}}});
    if (!started.records.workings[working].record.receipts.some(row => row.ok && row.op === 'prism-collar')) return started;
    return applyEngineOps(started, [{op: 'property', holder: id, property: prismAnchor, value: collar}], working);
}

function checkPrismAnchor(view, id) {
    const properties = view.properties(id), collar = properties[prismAnchor];
    const anchored = view.holder(collar)?.kind === 'thing' && view.property(collar, prismCollar) === true &&
        view.placeOf(collar) === view.placeOf(id);
    const body = {holder: id, properties};
    if (anchored && hasTemporaryCreatureForm(body, view.clock, prismForm)) return [];
    return [...releaseCreatureForm(body, view.clock, prismForm),
        {op: 'property', holder: id, property: prismAnchor, value: null}];
}

const hasPrismAnchor = holder => holder.kind === 'body' && holder.properties[prismAnchor] !== undefined;

export const LANTERN_PRISM_COLLAR_PACK = {
    id: 'l.lantern_prism_collar', revision: 1,
    properties: [{id: prismCollar, type: 'flag'}, {id: prismAnchor, type: 'label'}],
    reads: [prismCollar, prismAnchor, 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    writes: [prismAnchor, 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    hears: ['departed', 'arrived'],
    laws: [{id: 'check-anchor', appliesTo: hasPrismAnchor, decide: checkPrismAnchor}],
    reactors: [{
        id: 'separate', on: ['departed', 'arrived'], appliesTo: hasPrismAnchor,
        react: checkPrismAnchor,
    }],
};

function completedSunMolt({engine, lifecycle}, {id, working, keeper}) {
    const body = engine.world.holders[id], animal = lifecycle.individuals[id];
    const molt = engine.records.workings[working];
    return body?.kind === 'body' && body.refs.creature === id && body.properties.form === beaconForm &&
        animal?.keeper === keeper && animal.habitat === body.place &&
        molt?.law === LANTERN_EVOLUTION.law.ref && molt.record.method.id === 'sun-molt' &&
        molt.record.bindings.animal?.id === id && molt.record.receipts.some(row => row.ok && row.op === 'sun-molt')
        ? animal : null;
}

// Optional meadow law: a completed Sun Molt fixes fine fleece in the germline.
export function settleLanternGermline(state, {id, working, keeper}) {
    const {engine, lifecycle} = state;
    const animal = completedSunMolt(state, {id, working, keeper});
    if (!['sheep', BEACON_SHEEP_KIND.id].includes(animal?.species) || !animal.genes?.fleece?.includes('f'))
        return {changed: false, engine, lifecycle};
    const next = replaceCreatureAlleles(lifecycle, {revision: lifecycle.revision, id,
        genome: LANTERN_FLEECE_GENOME, locus: 'fleece', alleles: ['F', 'F']});
    return {changed: true, engine, lifecycle: next};
}

// Another world can make Beacon Fleece a breeding kind. Both kinds use the
// same trial loci, so the adult keeps its chromosome pairs and experience.
export function settleLanternSpecies(state, {id, working, keeper, habitat, cohortId, retainSignal, learnSignal}) {
    const animal = completedSunMolt(state, {id, working, keeper});
    const planned = planLanternSpecies(state, animal, {id, keeper, habitat, cohortId, retainSignal, learnSignal}, state.engine.world.clock);
    return planned.changed ? publishLanternSpecies(planned, state.engine, id) : planned;
}

const moltSignals = ['lantern-signal', 'lantern-steady-signal'];

function publishLanternSpecies(planned, engine, id) {
    const animal = planned.lifecycle.individuals[id];
    if (animal.previousSpecies.at(-1) === MIST_LANTERN_KIND.id)
        engine = applyEngineOps(engine, [{op: 'property', holder: id, property: mistCoat, value: null}], `beacon-coat:${id}`);
    return {...planned, engine};
}

function planLanternSpecies(state, animal, {id, keeper, habitat, cohortId, retainSignal, learnSignal}, clock) {
    const {engine, lifecycle} = state;
    if (!['sheep', MIST_LANTERN_KIND.id].includes(animal?.species) || !animal.genes || animal.ivs || animal.breeding ||
        lifecycle.cohorts[cohortId]?.species !== BEACON_SHEEP_KIND.id)
        return {changed: false, engine, lifecycle};
    const signals = moltSignals.filter(skill =>
        animal.experience[keeper]?.training[skill] > 0);
    if (retainSignal !== undefined && !signals.includes(retainSignal))
        return {changed: false, reason: 'lantern-signal-unpracticed', engine, lifecycle};
    if (learnSignal !== undefined && (!moltSignals.includes(learnSignal) || signals.includes(learnSignal)))
        return {changed: false, reason: 'lantern-signal-lesson-unavailable', engine, lifecycle};
    const forgetSkills = retainSignal === undefined && learnSignal === undefined ? [] :
        signals.filter(skill => skill !== retainSignal);
    validateGenes(BEACON_SHEEP_GENOME, animal.genes);
    const next = changeCreatureSpecies(lifecycle, {revision: lifecycle.revision, id, habitat, cohortId,
        clock, forgetSkills, learnSkill: learnSignal});
    return {changed: true, engine, lifecycle: next};
}

// Both owners are pure settlements. The caller publishes the returned pair.
// A refused molt leaves the original world clock, stock and lifecycle intact.
export function runLanternSpeciesMolt(state, options) {
    const prepared = prepareLanternSpeciesMolt(state, options);
    return prepared.pending ? finishLanternSpeciesMolt(state, prepared.pending, options.habitat) : prepared;
}

// The paired caller saves the pending record beside its two owners. A normal
// world advance cannot settle the detached working or spend its prism.
export function prepareLanternSpeciesMolt(state, options) {
    const {engine, lifecycle} = state;
    const {id, working, keeper, altar} = options;
    const animal = lifecycle.individuals[id], body = engine.world.holders[id];
    const unchanged = {changed: false, engine, lifecycle};
    if (body?.kind !== 'body' || body.refs.creature !== id || !body.place ||
        body.properties.form !== lanternForm || !animal || animal.keeper !== keeper ||
        animal.habitat !== body.place || engine.world.holders[altar]?.kind !== 'thing' ||
        Object.hasOwn(engine.records.workings, working)) return unchanged;
    const {law, methods} = LANTERN_EVOLUTION;
    const pending = startEngineWorking(engine, {law, method: methods['sun-molt'], id: working, bindings: {
        animal: {kind: 'body', id}, site: {kind: 'place', id: body.place}, altar: {kind: 'thing', id: altar},
    }});
    const deadline = pending.records.workings[working].record.deadlines[0];
    const planned = planLanternSpecies(state, animal, options, deadline);
    if (!planned.changed) return planned;
    return {...unchanged, pending: {id, working, keeper, cohortId: options.cohortId,
        ...(options.retainSignal === undefined ? {} : {retainSignal: options.retainSignal}),
        ...(options.learnSignal === undefined ? {} : {learnSignal: options.learnSignal}),
        record: pending.records.workings[working].record}};
}

export function finishLanternSpeciesMolt(state, pending, habitat) {
    return settlePendingLanternMolt(state, pending, habitat, false);
}

function settlePendingLanternMolt(state, pending, habitat, reportRefusal) {
    const {engine, lifecycle} = state;
    const {id, working, keeper} = pending;
    const {law, methods} = LANTERN_EVOLUTION;
    const unchanged = {changed: false, engine, lifecycle};
    const record = restoreWorking(law, pending.record);
    if (record.id !== working || record.status !== 'running' || record.cursor !== 0 ||
        record.method.id !== methods['sun-molt'].id || record.method.steps.length !== 1 ||
        record.method.steps[0].op !== 'sun-molt' ||
        record.bindings.animal?.id !== id)
        return {...unchanged, reason: 'invalid-pending-sun-molt'};
    const deadline = record.deadlines[0];
    const options = {...pending, habitat};
    const body = engine.world.holders[id], animal = lifecycle.individuals[id];
    if (body?.kind !== 'body' || body.refs.creature !== id || body.place !== record.bindings.site?.id ||
        animal?.keeper !== keeper || animal.habitat !== body.place ||
        engine.world.clock < record.startedAt || engine.world.clock > deadline ||
        Object.hasOwn(engine.records.workings, working)) return unchanged;
    let planned;
    try {
        planned = planLanternSpecies(state, animal, options, deadline);
    } catch (error) {
        if (!reportRefusal) throw error;
        return {...unchanged, reason: error.message};
    }
    if (!planned.changed) return planned;
    const staged = {...engine, host: {...engine.host, laws: {...engine.host.laws, [law.ref]: law}},
        records: {...engine.records, workings: {...engine.records.workings, [working]: {law: law.ref, record, payer: null, landed: []}}}};
    const advanced = advanceEngineWorld(staged, deadline);
    if (advanced.pending) return {...unchanged, reason: 'sun-molt-clock-pending'};
    const candidate = {engine: advanced.engine, lifecycle};
    if (!completedSunMolt(candidate, options))
        return {...unchanged, reason: advanced.engine.records.workings[working].record.receipts[0]?.reason};
    return publishLanternSpecies(planned, advanced.engine, id);
}

// The caller saves pendingMolts with the engine and lifecycle. Habitats are
// supplied at advance time so a pending action uses current conditions.
export function advanceLanternSpeciesClock({engine, lifecycle, pendingMolts = [], autoGrowth = false}, to, habitats) {
    if (!Number.isSafeInteger(to) || to < engine.world.clock) throw Error('Lantern clock needs a later whole minute.');
    engine = syncCreatureGrowthCare(engine, lifecycle);
    const queue = [...pendingMolts].sort((a, b) => a.record.deadlines[0] - b.record.deadlines[0] ||
        (a.working < b.working ? -1 : Number(a.working > b.working)));
    const checks = queue.map(command => ({at: command.record.deadlines[0], command}));
    if (autoGrowth) for (const [id, animal] of Object.entries(lifecycle.individuals)) {
        const body = engine.world.holders[id], experience = animal.experience[animal.keeper];
        const working = `companion-growth:${id}:${animal.matureAt}`;
        if (animal.species === 'sheep' && animal.keeper !== null && animal.deadAt === undefined &&
            animal.matureAt >= engine.world.clock && body?.properties.form === lanternForm &&
            experience?.bond >= companionBond && experience.training[signalSkill] > 0 &&
            !Object.hasOwn(engine.records.workings, working))
            checks.push({at: animal.matureAt, growth: {id, keeper: animal.keeper, working}});
    }
    // Stable sort puts saved item commands before growth offers at a tie.
    checks.sort((a, b) => a.at - b.at);
    const outcomes = [];
    let current = {engine, lifecycle};
    let index = 0;
    for (const {at: deadline, command, growth} of checks) {
        if (deadline > to) break;
        if (deadline >= current.engine.world.clock) {
            const advanced = advanceEngineWorld(current.engine, deadline);
            current = {...current, engine: advanced.engine};
            if (advanced.pending) return {...current, pendingMolts: queue.slice(index), autoGrowth, outcomes, pending: true};
        }
        if (growth) {
            current = {...current, engine: offerLanternGrowth(current, growth)};
            const receipt = current.engine.records.workings[growth.working]?.record.receipts[0];
            if (receipt) outcomes.push({working: growth.working, at: deadline, changed: receipt.ok,
                ...(!receipt.ok ? {reason: receipt.reason} : {})});
            continue;
        }
        const result = settlePendingLanternMolt(current, command, habitats[command.record.bindings.site.id], true);
        if (result.reason === 'sun-molt-clock-pending')
            return {...current, pendingMolts: queue.slice(index), autoGrowth, outcomes, pending: true};
        const {engine, lifecycle, changed, reason} = result;
        current = {engine, lifecycle};
        outcomes.push({working: command.working, at: current.engine.world.clock, changed,
            ...(!changed ? {reason: reason ?? 'sun-molt-no-longer-available'} : {})});
        index++;
    }
    const advanced = advanceEngineWorld(current.engine, to);
    return {...current, engine: advanced.engine, pendingMolts: queue.slice(index), autoGrowth, outcomes, pending: advanced.pending};
}

function lightCapacity(genes, genome = LANTERN_FLEECE_GENOME, environment, conditions) {
    const expression = expressGenes(genome, genes, {environment, conditions});
    return measureCreatureCapability(light, geneContributions(genome, expression, light)).value;
}

function coatGenome(animal) {
    if (animal.properties?.[mistCoat]) return MIST_LANTERN_GENOME;
    return animal.species === BEACON_SHEEP_KIND.id ? BEACON_SHEEP_GENOME : LANTERN_FLEECE_GENOME;
}

function coatIncubationConditions(animal, at) {
    const conditions = creatureIncubationConditions(animal);
    return at < animal.properties?.[coatWashUntil] || animal.quantities?.[coatRepair] === 0
        ? conditions.filter(condition => condition !== nurseryHumidity) : conditions;
}

function canTreatMistCoat(animal, keeper) {
    return animal.holder && keeper.holder && animal.genes && animal.deadAt === undefined &&
        animal.keeper === keeper.id && animal.place && keeper.place === animal.place && animal.properties?.[mistCoat] &&
        creatureIncubationConditions(animal).includes(nurseryHumidity);
}

// Seed the saved body from the inherited coat. The readiness minute then
// belongs to the world and is moved forward by a settled clip.
export function lanternCoatProperties(animal, {mist = animal.species === MIST_LANTERN_KIND.id} = {}) {
    return {[capacity]: lightCapacity(animal.genes), [readiness]: animal.matureAt, ...(mist ? {[mistCoat]: true} : {}),
        ...(mist && creatureIncubationConditions(animal).includes(nurseryHumidity) ? {[coatRepairSusceptible]: true} : {}),
        ...(animal.species === BEACON_SHEEP_KIND.id ? {form: beaconForm} :
            animal.species === MIST_LANTERN_KIND.id ? {form: lanternForm} : {})};
}

// Restore the base form omitted by older tracked Mist Lantern births.
export function restoreMistLanternBaseForms({engine, lifecycle}) {
    const ops = [];
    for (const [id, animal] of Object.entries(lifecycle.individuals)) {
        const body = engine.world.holders[id];
        if (animal.species === MIST_LANTERN_KIND.id && animal.deadAt === undefined &&
            body?.kind === 'body' && body.refs.creature === id &&
            body.properties[mistCoat] === true && body.properties.form === undefined)
            ops.push({op: 'property', holder: id, property: 'form', value: lanternForm});
    }
    return {engine: ops.length ? applyEngineOps(engine, ops, 'restore-mist-lantern-base-forms') : engine, lifecycle};
}

// A paired host can supply a live lifecycle reader so pending workings see
// species and training changes at settlement. Reattach the port on restore.
export function lanternBodyReader(lifecycleOrRead, registry, {statureMolt = false, readObservedPedigree} = {}) {
    const readLifecycle = typeof lifecycleOrRead === 'function' ? lifecycleOrRead : () => lifecycleOrRead;
    return (ref, at, world, records, {drawRoot} = {}) => {
        const holder = world.holders[ref.id];
        if (ref.kind === 'thing' && holder?.kind === 'thing' && holder.quantities[husk] > 0 && records) {
            const parents = holder.tags.includes(packedHusk) ? [parcelOrigin(world, holder.id)] :
                Object.values(records.workings).filter(({record}) => record.bindings.altar?.id === holder.id)
                    .map(({record}) => record.bindings.animal?.id);
            return {lanternHuskParents: [...new Set(parents)].filter(parent =>
                parent && huskFromParent({world, records}, parent, holder))};
        }
        if (ref.kind !== 'body' || holder?.refs.creature !== ref.id) return undefined;
        const lifecycle = readLifecycle();
        const animal = lifecycle.individuals[ref.id];
        if (!animal || holder.place !== animal.habitat || at < animal.health.lastAt) return {genes: undefined};
        const coatEnvironment = holder.properties[mistCoat] ?
            {humidity: world.holders[holder.place]?.quantities.humidity} : undefined;
        const {keeper, learned, injury, spread, mature} = readLivingBody({
            lifecycle, registry, id: ref.id, clock: at, environment: coatEnvironment, root: statureMolt ? drawRoot : undefined,
        });
        const pedigree = keeper === null ? undefined : readObservedPedigree?.({keeper, id: ref.id, at});
        return {keeper, learned, injury, species: animal.species, genes: animal.genes, matureAt: creatureMaturityAt(animal, at),
            ...(pedigree ? {observedAncestors: bloodline(pedigree.graph, pedigree.identity).ancestors.map(row => row.id)} : {}),
            incubationConditions: creatureIncubationConditions(animal),
            ...(coatEnvironment ? {coatEnvironment} : {}),
            deadAt: animal.deadAt, ...(statureMolt && {properties: {
                'lantern-height-cm': spread?.heightCm,
                'lantern-growth-ready': mature && animal.deadAt === undefined && !stillGrowing(holder),
            }})};
    };
}

export const LANTERN_COAT_PACK = {
    id: 'l.lantern_coat', revision: 1,
    checkEffectMove({world, holder, to, placeOfHolder}) {
        if (holder.place !== to && isWisp(holder) && wispHabitatFull(world, to, placeOfHolder))
            return 'There is no room for another wisp there.';
    },
    quantities: [Q.energy, Q.daylight, Q.stock, Q.light, Q.humidity,
        {id: coatRepair, unit: 'repair-minute', min: 0, max: coatRepairMinutes}],
    properties: [
        WORLD_PROPERTIES.form,
        {id: mistCoat, type: 'flag'},
        {id: coatRepairSusceptible, type: 'flag'},
        {id: coatWashUntil, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER},
        {id: sustainMistVeil, type: 'flag'},
        {id: ventilation, type: 'level', min: 0, max: Q.humidity.max},
        {id: capacity, type: 'level', min: 0, max: Q.energy.max},
        {id: readiness, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER},
        {id: woolLamp, type: 'flag'},
        {id: shade, type: 'flag'},
        {id: 'lantern-market', type: 'flag'},
        {id: wispCapacity, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER},
        {id: wispBasking, type: 'flag'},
        {id: nectarCapacity, type: 'level', min: 0, max: Q.stock.max},
        {id: WISP_FORAGE_RANGE, type: 'level', min: 1, max: Number.MAX_SAFE_INTEGER},
        {id: WISP_TIMED_FLIGHT, type: 'flag'},
        {id: custodian, type: 'label'},
    ],
    reads: ['energy', 'stock', 'daylight', 'humidity', capacity, readiness, shade, wispBasking, nectarCapacity, wispCapacity,
        'form', ventilation, mistCoat, WISP_FORAGE_RANGE, WISP_TIMED_FLIGHT],
    writes: ['energy', 'stock', 'humidity', coatRepair],
    hears: ['effect.move', 'effect.transform', 'effect.add'],
    reactors: [{
        id: 'coat-repair-contact', on: ['effect.move', 'effect.transform', 'effect.add'],
        appliesTo: holder => holder.kind === 'body' && holder.properties.alive !== false &&
            holder.properties[coatRepairSusceptible] === true && !stillGrowing(holder) && !(coatRepair in holder.quantities),
        react(view, id, event) {
            const {target, object, to, amount} = event.detail ?? {};
            if (view.clock < view.property(id, readiness)) return [];
            const startRepair = () => [{op: 'carry', holder: id, quantity: coatRepair, amount: coatRepairMinutes}];
            if (event.kind !== 'effect.move') {
                return target === id && object === Q.vitality.id && Number.isSafeInteger(amount) && amount >= coatRepairContact
                    ? startRepair() : [];
            }
            const flask = target;
            if (to !== id || object !== coatRepairLiquid || !Number.isSafeInteger(amount) || amount <= 0 ||
                !view.has(flask, coatRepairLiquid) || !view.has(flask, coatRepairActive)) return [];
            const active = view.amount(flask, coatRepairActive);
            const liquid = view.amount(flask, coatRepairLiquid) + amount;
            if (active > liquid || BigInt(active) * BigInt(amount) < 2n * BigInt(liquid)) return [];
            return startRepair();
        },
    }],
    laws: [{
        id: 'ventilate',
        appliesTo: place => place.kind === 'place' && place.properties[ventilation] > 0 &&
            Object.hasOwn(place.quantities, 'humidity'),
        rates: (view, id) => [{holder: id, quantity: 'humidity', perMinute: -view.property(id, ventilation)}],
    }, {
        id: 'coat-repair',
        appliesTo: body => body.kind === 'body' && body.properties.alive !== false && body.quantities[coatRepair] > 0,
        rates(view, id) {
            const place = view.placeOf(id);
            return view.has(place, 'humidity') && view.amount(place, 'humidity') >= mistHumidity
                ? [{holder: id, quantity: coatRepair, perMinute: -1}] : [];
        },
        watches: (view, id) => [{holder: view.placeOf(id), quantity: 'humidity', op: 'gte', value: mistHumidity}],
    }, {
        id: 'charge', appliesTo: h => h.kind === 'body' && h.properties[capacity] > 0,
        rates(view, id) {
            const place = view.placeOf(id);
            if (view.property(place, shade) === true || view.clock < view.property(id, readiness) || !view.has(id, charge) ||
                !view.has(place, 'daylight') || view.amount(place, 'daylight') !== 1 ||
                view.amount(id, charge) >= view.property(id, capacity)) return [];
            if (view.property(id, mistCoat) && (!view.has(place, 'humidity') || view.amount(place, 'humidity') < mistHumidity))
                return [];
            return [{holder: id, quantity: charge, perMinute: 1}];
        },
        watches(view, id) {
            const place = view.placeOf(id);
            return view.property(id, mistCoat) && view.has(place, 'humidity') ?
                [{holder: place, quantity: 'humidity', op: 'gte', value: mistHumidity}] : [];
        },
        horizon(view, id) {
            const ready = view.property(id, readiness) - view.clock;
            if (ready > 0) return ready;
            const room = view.has(id, charge) ? view.property(id, capacity) - view.amount(id, charge) : 0;
            return room > 0 ? room : Infinity;
        },
    }, {
        id: 'wisp-bask', appliesTo: isWisp,
        rates(view, id) {
            const place = view.placeOf(id);
            if (!view.property(place, wispBasking) || view.property(place, shade) ||
                !view.has(place, 'daylight') || view.amount(place, 'daylight') !== 1 ||
                !view.has(id, charge) || view.amount(id, charge) !== 0) return [];
            return [{holder: id, quantity: charge, perMinute: 1}];
        },
        watches: (view, id) => view.has(id, charge) ? [{holder: id, quantity: charge, op: 'gte', value: 1}] : [],
    }, {
        id: 'wisp-nectar-growth',
        appliesTo: place => place.kind === 'place' && place.properties[nectarCapacity] > 0 &&
            Object.hasOwn(place.quantities, WISP_NECTAR),
        // An empty patch may have waiting wisps. Let them feed at the first
        // new unit, even when the host advances by a longer interval.
        horizon(view, id) {
            if (nectarRoomInDaylight(view, id) <= 0) return Infinity;
            return view.amount(id, WISP_NECTAR) === 0 ? 1 : Infinity;
        },
        advance(view, id, elapsed) {
            const amount = Math.min(elapsed, nectarRoomInDaylight(view, id));
            return amount > 0 ? [{op: 'add', holder: id, quantity: WISP_NECTAR, amount}] : [];
        },
    }, {
        id: 'wisp-feed', appliesTo: isWisp,
        horizon(view, id) {
            const arriveAt = view.state(id)?.flight?.arriveAt;
            return arriveAt > view.clock ? arriveAt - view.clock : Infinity;
        },
        decide: wispFeedingOps,
    }],
};

// Worlds can make the Mantle draw one coat charge each minute, including
// while masked. Daylight charging still uses the ordinary coat law.
export const LANTERN_STORM_UPKEEP_PACK = {
    id: 'l.lantern_storm_upkeep', revision: 1,
    reads: ['energy', 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    writes: ['energy', 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    laws: [{
        id: 'sustain-storm', appliesTo: holder => holder.kind === 'body' &&
            holder.properties['temporary-form-layers'] !== undefined,
        rates(view, id) {
            if (!view.has(id, charge) || view.amount(id, charge) === 0 ||
                !hasTemporaryCreatureForm({properties: view.properties(id)}, view.clock, stormForm)) return [];
            return [{holder: id, quantity: charge, perMinute: -1}];
        },
        horizon(view, id) {
            // Recheck the coat law after each debit. A full coat may be below
            // capacity after the debit and start collecting daylight again.
            return this.rates(view, id).length ? 1 : Infinity;
        },
        decide(view, id) {
            if (view.has(id, charge) && view.amount(id, charge) > 0) return [];
            return releaseCreatureForm({holder: id, properties: view.properties(id)}, view.clock, stormForm);
        },
    }],
};

// Optional world policy. Sky owns the trigger, and the same Moon Veil
// settlement owns the charge and form change on both entry paths.
export const LANTERN_MOON_CYCLE_PACK = {
    id: 'l.lantern_moon_cycle', revision: 1,
    reads: ['daylight', 'moon_phase', 'energy', 'form', capacity, readiness, 'humidity', mistCoat, sustainMistVeil,
        coatRepair, coatRepairSusceptible, coatWashUntil, 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    writes: ['energy', 'temporary-form', 'temporary-form-until', 'temporary-form-layers'],
    laws: [{
        id: 'sustain-mist-veil',
        appliesTo: holder => holder.kind === 'body' && holder.properties[mistCoat] === true &&
            holder.properties[sustainMistVeil] === true,
        watches(view, id) {
            const place = view.placeOf(id);
            return view.has(place, 'humidity') ? [{holder: place, quantity: 'humidity', op: 'gte', value: mistHumidity}] : [];
        },
        horizon(view, id) {
            const until = view.property(id, coatWashUntil);
            return view.property(id, coatRepairSusceptible) === true &&
                hasTemporaryCreatureForm({properties: view.properties(id)}, view.clock, moonForm) && until > view.clock
                ? until - view.clock : Infinity;
        },
        decide(view, id) {
            const place = view.placeOf(id);
            const humid = view.has(place, 'humidity') && view.amount(place, 'humidity') >= mistHumidity;
            const coatUsable = view.property(id, coatRepairSusceptible) !== true ||
                view.clock < view.property(id, coatWashUntil) ||
                (view.has(id, coatRepair) && view.amount(id, coatRepair) === 0);
            if (humid && coatUsable) return [];
            return releaseCreatureForm({holder: id, properties: view.properties(id)}, view.clock, moonForm);
        },
    }],
    hears: ['sky.daylight', 'arrived'],
    reactors: [{
        id: 'moon-veil', on: ['sky.daylight', 'arrived'],
        appliesTo: holder => holder.kind === 'body' && holder.properties.form === lanternForm &&
            holder.properties[capacity] > 0,
        react(view, id, event) {
            const place = view.placeOf(id);
            if (!view.has(place, 'daylight') || (event.kind === 'arrived' && event.by !== id)) return [];
            const properties = view.properties(id);
            const animal = {holder: id, place, properties};
            const daylight = view.amount(place, 'daylight');
            if (daylight === 1) return releaseCreatureForm(animal, view.clock, moonForm);
            if (event.kind !== 'sky.daylight' || event.detail?.to !== 0 ||
                !view.has(place, 'moon_phase') || !view.has(id, charge)) return [];
            animal.quantities = {[charge]: view.amount(id, charge)};
            if (view.has(id, coatRepair)) animal.quantities[coatRepair] = view.amount(id, coatRepair);
            const site = {holder: place, quantities: {daylight, moon_phase: view.amount(place, 'moon_phase')}};
            if (view.has(place, 'humidity')) site.quantities.humidity = view.amount(place, 'humidity');
            return LANTERN_EVOLUTION.law.operations['moon-veil'].settle({bound: {animal, site}, at: view.clock}).effects ?? [];
        },
    }],
};

export const LANTERN_FLEECE_LAW = defineWorkingLaw({id: 'village.lantern-fleece', revision: 1, operations: {
    'charge-husk': {roles: huskChargeRoles, minutes: 1, settle({bound: {animal, keeper, shell}}) {
        if (!animal.holder || !keeper.holder || !shell.holder || !animal.place ||
            animal.place !== keeper.place || animal.place !== shell.place || animal.keeper !== keeper.id ||
            animal.deadAt !== undefined || animal.properties?.alive === false || keeper.properties?.alive === false ||
            animal.properties?.form !== beaconForm || shell.properties?.[custodian] !== undefined &&
                shell.properties[custodian] !== keeper.id || !shell.lanternHuskParents?.includes(animal.holder) ||
            !(shell.quantities?.[husk] > 0))
            return {ok: false, reason: 'lantern-husk-charge-unavailable'};
        if (shell.quantities[charge] !== 0) return {ok: false, reason: 'lantern-husk-charge-account-unavailable'};
        if (!(animal.quantities?.[charge] >= 1)) return {ok: false, reason: 'lantern-charge-empty'};
        return {ok: true, costs: [{quantity: charge, payer: animal.holder, amount: 1}],
            effects: [{op: 'add', holder: shell.holder, quantity: charge, amount: 1}]};
    }},
    feed: {roles: feedingRoles, minutes: 1, settle({bound: {animal, keeper}}) {
        if (!animal.holder || !keeper.holder || !animal.genes || animal.deadAt !== undefined || animal.keeper !== keeper.id ||
            !animal.place || keeper.place !== animal.place || !(keeper.quantities?.[meadowHay] > 0))
            return {ok: false, reason: 'lantern-feed-unavailable'};
        const ration = Math.min(4, SATIETY.max - animal.quantities?.satiety);
        if (!(ration > 0)) return {ok: false, reason: 'lantern-feed-no-room'};
        return {ok: true, costs: [{quantity: meadowHay, payer: keeper.holder, amount: 1}],
            effects: [{op: 'add', holder: animal.holder, quantity: 'satiety', amount: ration}]};
    }},
    'coat-wash': {roles: feedingRoles, minutes: 1, settle({bound: {animal, keeper}, at}) {
        if (!canTreatMistCoat(animal, keeper))
            return {ok: false, reason: 'lantern-coat-wash-unavailable'};
        if (stillGrowing(animal) || at < animal.matureAt)
            return {ok: false, reason: 'lantern-coat-regrowing'};
        if (animal.quantities?.[coatRepair] === 0) return {ok: false, reason: 'lantern-coat-already-repaired'};
        if (at < animal.properties[coatWashUntil]) return {ok: false, reason: 'lantern-coat-wash-active'};
        if (!(keeper.quantities?.[coatWash] > 0)) return {ok: false, reason: 'lantern-coat-wash-empty'};
        const until = at + coatWashMinutes;
        if (!Number.isSafeInteger(until)) return {ok: false, reason: 'lantern-coat-wash-clock-exhausted'};
        return {ok: true, costs: [{quantity: coatWash, payer: keeper.holder, amount: 1}],
            effects: [{op: 'property', holder: animal.holder, property: coatWashUntil, value: until}]};
    }},
    'coat-graft': {roles: feedingRoles, minutes: 1, settle({bound: {animal, keeper}, at}) {
        if (!canTreatMistCoat(animal, keeper))
            return {ok: false, reason: 'lantern-coat-graft-unavailable'};
        if (stillGrowing(animal) || at < animal.matureAt) return {ok: false, reason: 'lantern-coat-regrowing'};
        if (animal.quantities?.[coatRepair] !== undefined) return {ok: false, reason: 'lantern-coat-graft-already-applied'};
        if (!(keeper.quantities?.[coatGraft] > 0)) return {ok: false, reason: 'lantern-coat-graft-empty'};
        return {ok: true, costs: [{quantity: coatGraft, payer: keeper.holder, amount: 1}],
            effects: [{op: 'carry', holder: animal.holder, quantity: coatRepair, amount: coatRepairMinutes}]};
    }},
    flash: {roles, minutes: 1, settle({bound, at, options, facts}) {
        const {animal} = bound;
        if (!animal.genes || !animal.holder || !animal.place || animal.deadAt !== undefined)
            return {ok: false, reason: 'lantern-creature-unavailable'};
        if (stillGrowing(animal) || at < Math.max(animal.properties?.[readiness] ?? 0, animal.matureAt ?? 0))
            return {ok: false, reason: 'lantern-coat-regrowing'};
        const form = creatureForm(animal, at);
        if (options.moonbeam && form !== moonForm) return {ok: false, reason: 'moonbeam-needs-moon-fleece'};
        if (options.stormflash && form !== stormForm) return {ok: false, reason: 'stormflash-needs-storm-fleece'};
        if (options.prismflash && form !== prismForm) return {ok: false, reason: 'prismflash-needs-prism-fleece'};
        if ((options.signal || options.steadySignal) && Object.hasOwn(facts, 'signalKeeper') &&
            animal.keeper !== facts.signalKeeper) return {ok: false, reason: 'lantern-signal-keeper-changed'};
        if (options.signal && !(animal.learned?.[animal.keeper]?.skills?.['lantern-signal'] > 0))
            return {ok: false, reason: 'lantern-signal-unpracticed'};
        if (options.ancestralSignal && !animal.observedAncestors?.includes(facts.signalAncestor))
            return {ok: false, reason: 'lantern-signal-lineage-unverified'};
        if (options.steadySignal && !(animal.learned?.[animal.keeper]?.skills?.['lantern-steady-signal'] > 0))
            return {ok: false, reason: 'lantern-steady-signal-unpracticed'};
        if (animal.quantities?.responsiveness < flashResponsiveness)
            return {ok: false, reason: 'lantern-body-too-drowsy'};
        if (animal.injury) return {ok: false, reason: 'lantern-coat-needs-care'};
        const multiplier = {[beaconForm]: 2, [hearthForm]: 3, [marketForm]: 2, [companionForm]: 2,
            [moonForm]: 3, [stormForm]: 4, [prismForm]: 5}[form] ?? 1;
        const conditions = coatIncubationConditions(animal, at);
        const value = lightCapacity(animal.genes, coatGenome(animal), animal.coatEnvironment, conditions) * multiplier;
        if (!value) return {ok: false, reason: 'no-expressed-lantern-coat'};
        if (!(animal.quantities?.[charge] >= 1)) return {ok: false, reason: 'lantern-charge-empty'};
        return {ok: true, facts: {glow: {place: animal.place, amount: value}}, effects: [
            {op: 'add', holder: animal.holder, quantity: charge, amount: -1},
            {op: 'add', holder: animal.place, quantity: 'light:lantern-fleece', amount: value},
        ]};
    }},
    'wisp-glow': {roles, minutes: 1, settle({bound, at}) {
        const {animal} = bound;
        if (!animal.holder || !animal.place || creatureForm(animal, at) !== wispForm)
            return {ok: false, reason: 'glow-needs-husk-wisp'};
        if (!(animal.quantities?.[charge] >= 1)) return {ok: false, reason: 'lantern-charge-empty'};
        const amount = 6;
        return {ok: true, facts: {glow: {place: animal.place, amount}}, effects: [
            {op: 'add', holder: animal.holder, quantity: charge, amount: -1},
            {op: 'add', holder: animal.place, quantity: 'light:lantern-fleece', amount},
        ]};
    }},
    fade: {roles: {}, minutes: 2, settle({facts}) {
        const {place, amount} = facts.glow;
        return {ok: true, effects: [{op: 'add', holder: place, quantity: lightAccount, amount: -amount}]};
    }},
    'light-wool-lamp': {roles: {wool: 'thing', lamp: 'thing', site: 'place'}, minutes: 1, settle({bound}) {
        const {wool, lamp, site} = bound;
        if (!wool.holder || !lamp.holder || !site.holder || wool.holder === lamp.holder ||
            wool.place !== site.holder || lamp.place !== site.holder || lamp.properties?.[woolLamp] !== true)
            return {ok: false, reason: 'wool-lamp-out-of-reach'};
        if (!((wool.quantities?.[fine] ?? 0) > 0 || (wool.quantities?.[plain] ?? 0) > 0) ||
            !(wool.quantities?.[charge] >= 2))
            return {ok: false, reason: 'wool-lamp-needs-charged-wool'};
        const amount = 8;
        if (!(site.quantities?.[lightAccount] <= Q.light.max - amount))
            return {ok: false, reason: 'wool-lamp-light-account-full'};
        return {ok: true, facts: {glow: {place: site.holder, amount}}, effects: [
            {op: 'add', holder: wool.holder, quantity: charge, amount: -2},
            {op: 'add', holder: site.holder, quantity: lightAccount, amount},
        ]};
    }},
    clip: {roles: {animal: 'body', wool: 'thing'}, minutes: 1, settle({bound, at}) {
        const {animal, wool} = bound;
        if (!animal.holder || !animal.genes || !animal.place || !wool.holder || animal.place !== wool.place)
            return {ok: false, reason: 'lantern-clip-unavailable'};
        if (stillGrowing(animal) || !Number.isSafeInteger(animal.properties?.[readiness]) || at < animal.properties[readiness])
            return {ok: false, reason: 'lantern-coat-regrowing'};
        if (![fine, plain, charge].every(name => wool.quantities?.[name] === 0) || animal.quantities?.[charge] === undefined)
            return {ok: false, reason: 'lantern-clip-needs-empty-holder'};
        const harvest = planMeadowFleece(animal.id, animal, 5, {
            genome: coatGenome(animal), clock: at, environment: animal.coatEnvironment,
            incubationConditions: coatIncubationConditions(animal, at),
        });
        if (!harvest.ok) return harvest;
        const [{key, amount}] = harvest.effects;
        const reserve = animal.quantities[charge];
        const regrownAt = at + 4;
        if (!Number.isSafeInteger(regrownAt)) return {ok: false, reason: 'lantern-regrowth-clock-exhausted'};
        return {ok: true, effects: [
            {op: 'add', holder: wool.holder, quantity: key === FINE_WOOL_KEY ? fine : plain, amount},
            ...(reserve ? [
                {op: 'add', holder: animal.holder, quantity: charge, amount: -reserve},
                {op: 'add', holder: wool.holder, quantity: charge, amount: reserve},
            ] : []),
            {op: 'property', holder: animal.holder, property: readiness, value: regrownAt},
        ]};
    }},
}});

export const LANTERN_FLASH = {id: 'village.lantern-flash', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles, steps: [{op: 'flash', bindings: {animal: 'animal'}}, {op: 'fade'}]};

export const LANTERN_MOONBEAM = {...LANTERN_FLASH, id: 'village.lantern-moonbeam', steps: [
    {...LANTERN_FLASH.steps[0], options: {moonbeam: true}}, LANTERN_FLASH.steps[1],
]};

export const LANTERN_STORMFLASH = {...LANTERN_FLASH, id: 'village.lantern-stormflash', steps: [
    {...LANTERN_FLASH.steps[0], options: {stormflash: true}}, LANTERN_FLASH.steps[1],
]};

export const LANTERN_PRISMFLASH = {...LANTERN_FLASH, id: 'village.lantern-prismflash', steps: [
    {...LANTERN_FLASH.steps[0], options: {prismflash: true}}, LANTERN_FLASH.steps[1],
]};

export const LANTERN_SIGNAL = {...LANTERN_FLASH, id: 'village.lantern-signal', steps: [
    {...LANTERN_FLASH.steps[0], options: {signal: true}}, {...LANTERN_FLASH.steps[1], minutes: 1},
]};

const LANTERN_ANCESTRAL_SIGNAL = {...LANTERN_SIGNAL, id: 'village.lantern-ancestral-signal', steps: [
    {...LANTERN_SIGNAL.steps[0], options: {signal: true, ancestralSignal: true}}, {...LANTERN_SIGNAL.steps[1], minutes: 3},
]};

export const LANTERN_STEADY_SIGNAL = {...LANTERN_FLASH, id: 'village.lantern-steady-signal', steps: [
    {...LANTERN_FLASH.steps[0], options: {steadySignal: true}}, {...LANTERN_FLASH.steps[1], minutes: 3},
]};

export function cueLanternSignal(engine, {id, animal, keeper, steady = false}) {
    if (typeof keeper !== 'string' || !keeper) throw Error('A Lantern cue needs a keeper.');
    return startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method: steady ? LANTERN_STEADY_SIGNAL : LANTERN_SIGNAL, id,
        bindings: {animal: {kind: 'body', id: animal}}, facts: {signalKeeper: keeper}});
}

export function cueAncestralLanternSignal(engine, {id, animal, keeper, ancestor}) {
    if (![keeper, ancestor].every(value => typeof value === 'string' && value.length))
        throw Error('An ancestral Lantern cue needs a keeper and an ancestor identity.');
    return startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method: LANTERN_ANCESTRAL_SIGNAL, id,
        bindings: {animal: {kind: 'body', id: animal}}, facts: {signalKeeper: keeper, signalAncestor: ancestor}});
}

export const LANTERN_WISP_GLOW = {...LANTERN_FLASH, id: 'village.lantern-wisp-glow', steps: [
    {...LANTERN_FLASH.steps[0], op: 'wisp-glow'}, LANTERN_FLASH.steps[1],
]};

export const LANTERN_CLIP = {id: 'village.lantern-clip', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles: {animal: 'body', wool: 'thing'}, steps: [{op: 'clip', bindings: {animal: 'animal', wool: 'wool'}}]};

export const LANTERN_FEED = {id: 'village.lantern-feed', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles: feedingRoles, steps: [{op: 'feed', bindings: {animal: 'animal', keeper: 'keeper'}}]};

export const LANTERN_COAT_WASH = {id: 'village.lantern-coat-wash', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles: feedingRoles, steps: [{op: 'coat-wash', bindings: {animal: 'animal', keeper: 'keeper'}}]};

export const LANTERN_COAT_GRAFT = {id: 'village.lantern-coat-graft', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles: feedingRoles, steps: [{op: 'coat-graft', bindings: {animal: 'animal', keeper: 'keeper'}}]};

export const LANTERN_CHARGE_HUSK = {id: 'village.lantern-charge-husk', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles: huskChargeRoles,
    steps: [{op: 'charge-husk', bindings: {animal: 'animal', keeper: 'keeper', shell: 'shell'}}]};

export function lanternCoatRepairDose({route = 'topical', amount = 2} = {}) {
    return brewDoseMethod({id: 'village.apply-lantern-coat-repair', route, amount, responses: [{
        part: 'lantern-coat-repair-extract', route: 'topical', minimum: 2,
        liquidUptake: {part: 'lantern-coat-repair-extract', liquidKey: coatRepairLiquidKey, activeKey: coatRepairActiveKey},
    }]});
}

export function lanternCoatRepairBrew({steepMinutes = 2} = {}) {
    return brewMethod({id: 'village.brew-lantern-coat-repair',
        slots: [{id: 'moss', amount: 2}, {id: 'binder', amount: 2}],
        process: [{op: 'react', minutes: steepMinutes, options: {reactions: [{
            id: 'bind-coat-repair-extract', minMinutes: 2,
            reactants: {'lantern-repair-moss': 1, 'lantern-repair-binder': 1},
            products: {'lantern-coat-repair-extract': 2},
        }]}}, {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}}],
    });
}

export const LANTERN_WOOL_LAMP = {id: 'village.lantern-wool-lamp', revision: 1, law: LANTERN_FLEECE_LAW.ref,
    roles: {wool: 'thing', lamp: 'thing', site: 'place'}, steps: [
        {op: 'light-wool-lamp', bindings: {wool: 'wool', lamp: 'lamp', site: 'site'}},
        {op: 'fade', minutes: 3},
    ]};

// The live working owns both its credited light and its pending cleanup.
export function extinguishLanternWoolLamp(engine, {working, lamp}) {
    return stopLanternGlow(engine, working, 'lamp', lamp, ['light-wool-lamp'], 'Wool lamp extinguished.');
}

export function interruptLanternFlash(engine, {working, animal}) {
    return stopLanternGlow(engine, working, 'animal', animal, ['flash', 'wisp-glow'], 'Lantern flash interrupted.');
}

// This local travel action settles the path first. The covered destination
// scatters active coat pulses from the crossing animal.
export function crossLanternPath(engine, {animal, link}) {
    const body = engine.world.holders[animal];
    const exitAt = world => linkExits(worldLinks(world), body.place, {kinds: ['path']})
        .find(row => row.link === link);
    const exit = body?.kind === 'body' && exitAt(engine.world);
    if (!exit || !Number.isSafeInteger(engine.world.clock + exit.cost)) return {crossed: false, engine};
    if (isWisp(body) && wispHabitatFull(engine.world, exit.to))
        return {crossed: false, reason: 'lantern-wisp-habitat-full', engine};
    const {engine: current, pending} = advanceEngineWorld(engine, engine.world.clock + exit.cost);
    const stillOpen = exitAt(current.world);
    const traveler = current.world.holders[animal];
    if (pending || traveler?.place !== body.place ||
        !stillOpen || stillOpen.to !== exit.to || stillOpen.cost !== exit.cost) return {crossed: false, engine: current, pending};
    if (isWisp(traveler) && wispHabitatFull(current.world, exit.to))
        return {crossed: false, reason: 'lantern-wisp-habitat-full', engine: current};
    let moved = applyEngineOps(current, [{op: 'move', holder: animal, to: exit.to}], `lantern-path:${link}`);
    if (moved.world.holders[animal]?.place === exit.to && moved.world.holders[exit.to].properties[shade] === true) {
        for (const working of Object.keys(moved.records.workings))
            moved = interruptLanternFlash(moved, {working, animal});
    }
    return {crossed: true, engine: moved};
}

function stopLanternGlow(engine, working, role, holder, operations, reason) {
    const entry = Object.hasOwn(engine.records.workings, working) && engine.records.workings[working];
    const record = entry?.record;
    if (entry?.law !== LANTERN_FLEECE_LAW.ref || !holder || record.bindings[role]?.id !== holder || record.status !== 'running' ||
        record.method.steps[record.cursor]?.op !== 'fade' ||
        !record.receipts.some(row => row.ok && operations.includes(row.op))) return engine;
    const {place, amount} = record.facts.glow;
    const stopped = interruptWorking(record, {at: engine.world.clock, reason});
    const site = engine.world.holders[place];
    const effects = site?.quantities[lightAccount] === undefined ? [] :
        [{op: 'add', holder: place, quantity: lightAccount, amount: -amount}];
    const dimmed = applyEngineOps(engine, effects, `working:${working}:extinguish`);
    return {...dimmed, records: {...dimmed.records, workings: {
        ...dimmed.records.workings, [working]: {...entry, record: stopped},
    }}};
}
