// E12 gives an individual its world body. The creature lifecycle remains the
// owner of phased profiles, development, and the next creature identity.
import {check, natural, sameStructural} from './basics.js';
import {acquireCreature, advanceWildHabitat, creatureWildHerd, layCreatureEgg, releaseCreatureToWildHerd, returnPhasedCreature,
    settleCreatureBirth, settleCreatureEggLoss, settleCreatureHatch, settleWildCreatureRelocation,
    transferCreature, WILD_WINDOW_BUDGET} from './creature_lifecycle.js';
import {advanceEngineWorld, applyEngineOps, engineDraw} from './engine_world.js';
import {linkExits, quantityDef, readLineage, worldLinks} from './world_substrate.js';
import {JUVENILE_GROWTH, SATIETY, livingBodyState} from './world_substrate_packs/living_body.js';
import {GRAZING_HOME} from './world_packs/meadow_grazing.js';
import {syncCreatureGrowthCare} from './creature_growth_world.js';
import {CREATURE_GESTATION_PACK, EGG_IMPRINT, EGG_IMPRINT_LEFT, EGG_IMPRINTS,
    EGG_TOLERANCE, GESTATION_BROOD, GESTATION_LEFT, GESTATION_MINIMUM,
    GESTATION_QUANTITY, INCUBATING_EGG} from './world_packs/creature_gestation.js';

const rowId = name => typeof name === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(name);

function boundHerd(engine, lifecycle, id) {
    const herd = lifecycle.cohorts[id], holder = engine.world.holders[id];
    check(herd && holder?.kind === 'cohort' && holder.refs.herd === id &&
        holder.place === herd.habitat && holder.count === herd.stock,
    'The phased herd and its world holder must agree.');
    return holder;
}

// Advance the existing world first at each boundary, then publish the actual
// losses and births in lifecycle order. The two slices travel together.
export function advancePhasedWorldHerds({engine, lifecycle}, {revision, habitat, clock, populations}) {
    check(revision === lifecycle.revision, 'Creature state changed since this action was prepared.');
    const ledger = lifecycle.habitats[habitat?.id];
    check(ledger && natural(clock) && clock >= engine.world.clock && engine.world.clock <= ledger.nextAt &&
        Array.isArray(populations),
        'The world and wild herd clocks must advance together.');
    const policies = new Map();
    const authored = populations.map(({world, ...population}) => {
        const herd = boundHerd(engine, lifecycle, population.id);
        check(population.pedigree || lifecycle.cohorts[population.id].phase, 'Count-based world herds need phased profiles.');
        check(world && rowId(world.birthRow) && rowId(world.lossRow) &&
            Object.entries(world.perBirth ?? {}).every(([name, amount]) => natural(amount) &&
                (population.pedigree ? quantityDef(engine.rules, name) : Object.hasOwn(herd.quantities, name))),
        'A bound herd needs declared whole birth quantities and named source and loss rows.');
        check(world.remainsFor === undefined || population.pedigree && typeof world.remainsFor === 'function',
            'A remains policy needs a tracked wild population.');
        checkBirthBodyPolicy(engine, world, population.pedigree);
        if (world.gestation !== undefined) {
            check(population.pedigree, 'Conditional gestation needs a tracked population.');
            checkGestationCondition(engine, world.gestation);
        }
        check(world.expressionQuantities === undefined ||
            Array.isArray(world.expressionQuantities) && world.expressionQuantities.every(name => quantityDef(engine.rules, name)),
        'A herd selection environment needs declared world quantities.');
        policies.set(population.id, world);
        return {...population, root: engine.draws.root};
    });
    let windows = 0;
    while (windows < WILD_WINDOW_BUDGET) {
        const nextAt = lifecycle.habitats[habitat.id].nextAt;
        const boundary = Math.min(clock, nextAt);
        const advanced = advanceTrackedWorld({engine, lifecycle}, boundary);
        ({engine, lifecycle} = advanced);
        if (advanced.pending) return {engine, lifecycle, windows, pending: true};
        if (boundary < nextAt) return {engine, lifecycle, windows, pending: false};
        const place = engine.world.holders[habitat.id];
        const populationsAtBoundary = authored.map(population => {
            const names = policies.get(population.id).expressionQuantities;
            if (names === undefined) return population;
            const environment = {...population.environment};
            for (const name of names) {
                delete environment[name];
                if (Object.hasOwn(place?.quantities ?? {}, name)) environment[name] = place.quantities[name];
            }
            return {...population, environment};
        });
        const {state, turnover} = advanceWildHabitat(lifecycle, {revision: lifecycle.revision,
            habitat, clock: boundary, populations: populationsAtBoundary, reportTurnover: true,
            carrierPresent(id, animal, broodId) {
                const body = engine.world.holders[id];
                return gestationReady(body, broodId) &&
                    (body?.properties[GRAZING_HOME] !== animal.habitat || body.place === animal.habitat);
            },
            parentReady(id, animal) {
                // A newborn from this boundary is materialized after lifecycle
                // settlement. Older tracked parents must already have a body.
                if (!Object.hasOwn(lifecycle.individuals, id)) {
                    const policy = policies.get(creatureWildHerd(animal));
                    return !(policy?.perBirth?.[JUVENILE_GROWTH.id] > 0 ||
                        policy?.fedGrowth && animal.matureAt > animal.bornAt);
                }
                const body = engine.world.holders[id];
                return body?.kind === 'body' && body.refs.creature === id && body.place === animal.habitat &&
                    !(body.quantities[JUVENILE_GROWTH.id] > 0);
            }});
        for (const {id, births, losses, death, newborn} of turnover) {
            const policy = policies.get(id);
            if (death || newborn) {
                engine = settleTrackedBody(engine, state, {death, newborn}, policy);
                continue;
            }
            const herd = engine.world.holders[id];
            const amounts = births ? Object.entries(policy.perBirth ?? {}) :
                Object.entries(herd.quantities).filter(([, total]) => total > 0)
                    .map(([name, total]) => [name, losses === herd.count ? total : Math.floor(total / herd.count) * losses]);
            const quantities = Object.fromEntries(amounts.map(([name, amount]) => [name, births ? amount * births : amount]));
            const delta = births ?? -losses;
            const count = herd.count + delta;
            engine = applyEngineOps(engine, [{op: 'lifecycle', act: 'cohort-change', holder: id, delta, quantities,
                row: births ? policy.birthRow : policy.lossRow}], `wild-herd:${id}:${boundary}`);
            check(engine.world.holders[id]?.count === count, 'The world could not settle the herd turnover.');
        }
        for (const [broodId, brood] of Object.entries(state.broods)) {
            const condition = policies.get(brood.wild)?.gestation;
            if (!condition || Object.hasOwn(lifecycle.broods, broodId)) continue;
            engine = startWorldGestation(engine, broodId, brood, condition);
        }
        for (const {id} of authored) boundHerd(engine, state, id);
        lifecycle = state;
        windows++;
        if (boundary === clock) return {engine, lifecycle, windows, pending: false};
    }
    return {engine, lifecycle, windows, pending: true};
}

// Advance to the next due habitat before the shared world clock can pass it.
// Policies are supplied by the host on every call, including after restore.
export function advancePhasedWorldHabitats({engine, lifecycle}, {revision, clock, habitats}) {
    check(revision === lifecycle.revision, 'Creature state changed since this action was prepared.');
    check(natural(clock) && clock >= engine.world.clock && Array.isArray(habitats),
        'Invalid shared wild habitat advance.');
    const routes = new Map();
    for (const route of habitats) {
        const id = route?.habitat?.id;
        const ledger = rowId(id) && Object.hasOwn(lifecycle.habitats, id) && lifecycle.habitats[id];
        check(ledger && ledger.nextAt >= engine.world.clock && !routes.has(id) && Array.isArray(route.populations),
            'Shared habitat advance needs distinct current habitats and their population policies.');
        routes.set(id, route);
    }
    for (const [id, ledger] of Object.entries(lifecycle.habitats))
        check(ledger.nextAt > clock || routes.has(id), 'A due wild habitat needs a population policy before the world advances.');
    const ids = [...routes.keys()].sort();
    let windows = 0;
    for (;;) {
        let nextId, boundary = Infinity;
        for (const id of ids) {
            const nextAt = lifecycle.habitats[id].nextAt;
            if (nextAt < boundary) {
                nextId = id;
                boundary = nextAt;
            }
        }
        if (boundary > clock) {
            const advanced = advanceTrackedWorld({engine, lifecycle}, clock);
            return {...advanced, windows};
        }
        if (windows === WILD_WINDOW_BUDGET) return {engine, lifecycle, windows, pending: true};
        const step = advancePhasedWorldHerds({engine, lifecycle}, {
            ...routes.get(nextId), revision: lifecycle.revision, clock: boundary,
        });
        ({engine, lifecycle} = step);
        windows += step.windows;
        if (step.pending) return {engine, lifecycle, windows, pending: true};
    }
}

function advanceTrackedWorld({engine, lifecycle}, clock) {
    const advanced = advanceEngineWorld(syncCreatureGrowthCare(engine, lifecycle), clock);
    return {...reconcileTrackedEggLosses({engine: advanced.engine, lifecycle}), pending: advanced.pending};
}

// A missing holder by itself is ambiguous. Require retirement in the world
// identity ledger so stale or mismatched save slices cannot close a brood.
export function reconcileTrackedEggLosses({engine, lifecycle}) {
    for (const [broodId, {egg, parents}] of Object.entries(lifecycle.broods)) {
        if (!egg || Object.hasOwn(engine.world.holders, egg)) continue;
        const identity = engine.world.identity?.entries[egg];
        if (!identity || Object.hasOwn(identity.facets, 'holder') || !readLineage(engine.world, egg)
            .some(row => row.act === 'create' && !row.role && sameStructural(row.parents, parents))) continue;
        lifecycle = settleCreatureEggLoss(lifecycle, {revision: lifecycle.revision, broodId, egg});
    }
    return {engine, lifecycle};
}

function checkBirthBodyPolicy(engine, world, tracked) {
    check(world.fedGrowth === undefined || tracked &&
        natural(world.fedGrowth?.foodRate) && engine.rules.packs.includes('l.living_body') &&
        Object.hasOwn(world.perBirth ?? {}, SATIETY.id) && !Object.hasOwn(world.perBirth, JUVENILE_GROWTH.id),
    'Fed growth needs a tracked birth with a living body pack and starting satiety.');
    check(world.birthTags === undefined || tracked && Array.isArray(world.birthTags) && world.birthTags.every(rowId),
        'Birth tags need a tracked birth and valid world tags.');
}

function gestationReady(body, broodId) {
    return body?.properties[GESTATION_BROOD] !== broodId || body.quantities[GESTATION_LEFT] === 0;
}

function checkGestationCondition(engine, condition) {
    const {quantity, min} = condition ?? {};
    const def = typeof quantity === 'string' && quantityDef(engine.rules, quantity);
    const law = engine.rules.laws.find(entry => entry.pack === CREATURE_GESTATION_PACK);
    check(def && law?.reads.has(def.id) && !law.writes.has(def.id) &&
        Number.isSafeInteger(min) && min >= def.min && min <= def.max,
    'Conditional development needs a declared habitat threshold.');
}

const gestationProperties = (broodId, {quantity, min}) => ({
    [GESTATION_BROOD]: broodId, [GESTATION_QUANTITY]: quantity, [GESTATION_MINIMUM]: min,
});

function clearGestation(holder) {
    return [GESTATION_BROOD, GESTATION_QUANTITY, GESTATION_MINIMUM]
        .map(property => ({op: 'property', holder, property, value: null}));
}

function startWorldGestation(engine, broodId, brood, {quantity, min}) {
    const holder = brood.parents[0], body = engine.world.holders[holder];
    check(body?.kind === 'body' && body.refs.creature === holder && !body.properties[GESTATION_BROOD],
        'Conditional gestation needs the tracked carrier’s free body.');
    return applyEngineOps(engine, [
        {op: Object.hasOwn(body.quantities, GESTATION_LEFT) ? 'set' : 'carry', holder,
            quantity: GESTATION_LEFT, amount: brood.dueAt - engine.world.clock},
        ...Object.entries(gestationProperties(broodId, {quantity, min}))
            .map(([property, value]) => ({op: 'property', holder, property, value})),
    ], `gestation:${broodId}`);
}

function settleTrackedBody(engine, lifecycle, {death, newborn}, policy) {
    if (death) {
        const animal = lifecycle.individuals[death], body = engine.world.holders[death];
        check(body?.kind === 'body' && body.refs.creature === death &&
            (body.place === animal.habitat || body.properties[GRAZING_HOME] === animal.habitat),
            'The wild creature and its world body must agree before retirement.');
        const carcass = policy.remainsFor?.({id: death, animal, clock: engine.world.clock,
            draw: address => engineDraw(engine, 'wild-remains', death, address) / 0x100000000});
        const {id, retain = [], tags = [], as = [], properties = {}, state = {}, refs = {}} = carcass ?? {};
        const loss = [`row:${policy.lossRow}`];
        check(!carcass || rowId(id) && Array.isArray(retain) &&
            retain.every(name => Object.hasOwn(body.quantities, name)), 'Wild remains must retain quantities carried by the body.');
        const routes = Object.fromEntries(Object.keys(body.quantities)
            .filter(name => !retain.includes(name)).map(name => [name, loss]));
        const next = applyEngineOps(engine, [{op: 'lifecycle', act: 'end', holder: death,
            to: loss, ...(carcass ? {remains: {id, tags, as, properties, state, refs}, routes} : {})}],
        `wild-death:${death}`);
        check(!next.world.holders[death], 'The world could not retire the wild creature.');
        return next;
    }
    const animal = lifecycle.individuals[newborn];
    for (const parent of animal.parents) {
        const source = lifecycle.individuals[parent], body = engine.world.holders[parent];
        const retired = source.deadAt !== undefined && !body && readLineage(engine.world, parent).some(row => row.act === 'end');
        const living = source.deadAt === undefined && body?.kind === 'body' && body.refs.creature === parent &&
            (body.place === source.habitat || parent !== animal.parents[0] && body.properties[GRAZING_HOME] === source.habitat);
        check(retired || living,
            'The wild parent and its world identity must agree before birth.');
    }
    const carrier = engine.world.holders[animal.parents[0]];
    const clear = carrier?.properties[GESTATION_BROOD] ? clearGestation(carrier.id) : [];
    return createTrackedNewborn(engine, lifecycle, newborn, policy, animal.parents, clear);
}

function createTrackedNewborn(engine, lifecycle, newborn, policy, parents, following = []) {
    const animal = lifecycle.individuals[newborn];
    const fedGrowth = policy.fedGrowth && {
        state: {'l.living_body': livingBodyState({species: animal.species, rate: policy.fedGrowth.foodRate})},
    };
    const tags = [...new Set([...(policy.birthTags ?? []), ...(fedGrowth ? ['living.body'] : [])])];
    const quantities = fedGrowth ? {...policy.perBirth, [JUVENILE_GROWTH.id]: animal.matureAt - animal.bornAt} : policy.perBirth;
    const next = applyEngineOps(engine, [{op: 'lifecycle', act: 'create', parents, allowRetiredParents: true,
        from: [`row:${policy.birthRow}`], value: {id: newborn, kind: 'body', place: animal.habitat,
            refs: {creature: newborn}, properties: policy.propertiesFor?.(animal), quantities, tags, ...fedGrowth}}, ...following], `wild-birth:${newborn}`);
    check(!engine.world.holders[newborn] && next.world.holders[newborn]?.refs.creature === newborn,
        'The world could not create the wild newborn.');
    return next;
}

export function promotePhasedWorldCreature({engine, lifecycle}, {
    revision, cohortId, destination, genome, keeper = null, ageMinutes, growthMinutes, propertiesFor,
}) {
    const herd = boundHerd(engine, lifecycle, cohortId);
    check(destination?.id === herd.place, 'Promote at the herd before transferring the individual.');
    const {id, state} = acquireCreature(lifecycle, {revision, cohortId, destination, keeper, genome,
        ageMinutes, growthMinutes, clock: engine.world.clock, root: engine.draws.root});
    check(!Object.hasOwn(engine.world.holders, id) && !Object.hasOwn(engine.world.identity?.entries ?? {}, id),
        'The creature identity has already been used in this world.');
    const properties = propertiesFor?.(state.individuals[id]) ?? herd.properties;
    const next = applyEngineOps(engine, [{op: 'lifecycle', act: 'promote', holder: herd.id, ids: [id],
        value: {properties, refs: {creature: id}, state: {}}}], `creature-promote:${id}`);
    check(next.world.holders[id]?.refs.creature === id && next.world.holders[herd.id]?.count === state.cohorts[herd.id].stock,
        'The world did not promote the selected herd member.');
    return {id, engine: next, lifecycle: state};
}

export function relocateTrackedWorldCreature({engine, lifecycle}, {revision, id, destination, cohortId, birthCohortId}) {
    const animal = lifecycle.individuals[id], body = engine.world.holders[id];
    check(animal && body?.kind === 'body' && body.refs.creature === id && body.place === animal.habitat,
        'Relocation starts at the wild creature’s current home.');
    boundHerd(engine, lifecycle, creatureWildHerd(animal));
    boundHerd(engine, lifecycle, cohortId);
    if (birthCohortId !== undefined) boundHerd(engine, lifecycle, birthCohortId);
    check(linkExits(worldLinks(engine.world), body.place, {kinds: ['grazing-path']})
        .some(exit => exit.to === destination?.id), 'Relocation needs an open grazing path to the destination herd.');
    const state = settleWildCreatureRelocation(lifecycle, {
        revision, id, cohortId, destination, birthCohortId, clock: engine.world.clock,
    });
    const ops = [{op: 'move', holder: id, to: destination.id}];
    if (Object.hasOwn(body.properties, GRAZING_HOME))
        ops.push({op: 'property', holder: id, property: GRAZING_HOME, value: destination.id});
    const next = applyEngineOps(engine, ops, `wild-relocation:${id}`);
    check(next.world.holders[id]?.place === destination.id &&
        (!Object.hasOwn(body.properties, GRAZING_HOME) || next.world.holders[id].properties[GRAZING_HOME] === destination.id),
    'The world could not settle the creature relocation.');
    return {engine: next, lifecycle: state};
}

export function takeTrackedWorldCreature({engine, lifecycle}, {revision, id, keeper, destination}) {
    const body = custodyEncounter(engine, lifecycle, {id, keeper, destination});
    const state = transferCreature(lifecycle, {revision, id, fromKeeper: null, toKeeper: keeper,
        destination, clock: engine.world.clock});
    return {engine: settleGrazingHome(engine, body, destination.id), lifecycle: state};
}

export function releaseTrackedWorldCreature({engine, lifecycle}, options) {
    const {cohortId, birthCohortId, destination} = options;
    const body = custodyEncounter(engine, lifecycle, options);
    boundHerd(engine, lifecycle, cohortId);
    if (birthCohortId !== undefined) boundHerd(engine, lifecycle, birthCohortId);
    const state = releaseCreatureToWildHerd(lifecycle, {...options, clock: engine.world.clock});
    return {engine: settleGrazingHome(engine, body, destination.id), lifecycle: state};
}

function custodyEncounter(engine, lifecycle, {id, keeper, destination}) {
    const animal = lifecycle.individuals[id], body = engine.world.holders[id];
    const handler = engine.world.holders[keeper];
    check(animal && body?.kind === 'body' && body.refs.creature === id && body.properties.alive !== false &&
        (body.place === animal.habitat || body.properties[GRAZING_HOME] === animal.habitat),
    'The tracked creature needs its living world body at home or out grazing.');
    check(handler?.kind === 'body' && handler.id !== id && handler.properties.alive !== false &&
        handler.place === body.place && destination?.id === body.place,
    'The keeper needs to meet the creature at the receiving habitat.');
    return body;
}

function settleGrazingHome(engine, body, destination) {
    if (!Object.hasOwn(body.properties, GRAZING_HOME) || body.properties[GRAZING_HOME] === destination) return engine;
    const next = applyEngineOps(engine, [{op: 'property', holder: body.id, property: GRAZING_HOME, value: destination}],
        `creature-custody:${body.id}`);
    check(next.world.holders[body.id]?.properties[GRAZING_HOME] === destination,
        'The world could not settle the creature’s new grazing home.');
    return next;
}

export function settleKeptWorldBirth({engine, lifecycle}, {revision, broodId, destination, world}) {
    const brood = lifecycle.broods[broodId];
    check(brood && !brood.egg, 'No creature birth is due.');
    const carrier = lifecycle.individuals[brood.parents[0]];
    check(carrier && carrier.keeper !== null, 'A kept birth needs a carrier in custody.');
    check(gestationReady(engine.world.holders[brood.parents[0]], broodId), 'The creature is still gestating.');
    checkNewbornPolicy(engine, world);
    const {id, state} = settleCreatureBirth(lifecycle, {revision, broodId, destination, clock: engine.world.clock});
    return {id, lifecycle: state, engine: settleTrackedBody(engine, state, {newborn: id}, world)};
}

function checkNewbornPolicy(engine, world) {
    check(world && rowId(world.birthRow) && Object.entries(world.perBirth ?? {}).every(([name, amount]) =>
        natural(amount) && quantityDef(engine.rules, name)), 'A birth needs declared quantities and a named source row.');
    checkBirthBodyPolicy(engine, world, true);
}

export function layTrackedWorldEgg({engine, lifecycle}, {
    revision, broodId, egg, condition, sourceRow, exposureMinutes, imprint, imprints = [],
}) {
    const brood = lifecycle.broods[broodId];
    const carrier = engine.world.holders[brood?.parents[0]];
    check(rowId(egg) && rowId(sourceRow) && carrier?.kind === 'body' && carrier.refs.creature === brood.parents[0] &&
        carrier.properties.alive !== false, 'An egg needs a tracked living carrier, identity and source row.');
    checkGestationCondition(engine, condition);
    check(exposureMinutes === undefined || natural(exposureMinutes) && exposureMinutes > 0,
        'Egg exposure tolerance needs positive whole minutes.');
    const clock = engine.world.clock;
    const state = layCreatureEgg(lifecycle, {revision, broodId, egg, clock});
    const started = carrier.properties[GESTATION_BROOD] === broodId;
    const remaining = started ? carrier.quantities[GESTATION_LEFT] : Math.max(0, brood.dueAt - clock);
    const properties = gestationProperties(broodId, condition);
    const extra = [];
    if (exposureMinutes !== undefined) extra.push({op: 'carry', holder: egg, quantity: EGG_TOLERANCE, amount: exposureMinutes});
    check(Array.isArray(imprints) && (imprint === undefined || !imprints.length), 'Provide one incubation imprint or a list.');
    const marks = imprint === undefined ? imprints : [imprint];
    const names = new Set();
    for (const mark of marks) {
        checkGestationCondition(engine, mark);
        check(rowId(mark.condition) && !names.has(mark.condition) &&
            natural(mark.minutes) && mark.minutes > 0 && mark.minutes <= remaining,
            'An incubation imprint needs a condition and minutes within the remaining development.');
        names.add(mark.condition);
        extra.push({op: 'carry', holder: egg, quantity: `${EGG_IMPRINTS}:${mark.condition}`, amount: mark.minutes});
    }
    const next = applyEngineOps(engine, [{op: 'lifecycle', act: 'create', parents: brood.parents, allowRetiredParents: true,
        from: started ? [carrier.id] : [`row:${sourceRow}`],
        value: {id: egg, kind: 'thing', place: carrier.place, tags: [INCUBATING_EGG],
            properties, quantities: {[GESTATION_LEFT]: remaining},
            ...(marks.length ? {state: {[CREATURE_GESTATION_PACK]: {imprints: marks.map(({condition, quantity, min}) =>
                ({condition, quantity, min}))}}} : {})}},
    ...extra,
    ...(started ? clearGestation(carrier.id) : [])],
    `creature-egg:${egg}`);
    check(!engine.world.holders[egg] && next.world.holders[egg]?.properties[GESTATION_BROOD] === broodId,
        'The world could not lay the egg.');
    return {engine: next, lifecycle: state};
}

export function hatchTrackedWorldEgg({engine, lifecycle}, {revision, broodId, destination, keeper = null, world}) {
    const brood = lifecycle.broods[broodId], egg = brood?.egg && engine.world.holders[brood.egg];
    check(egg?.kind === 'thing' && egg.tags.includes(INCUBATING_EGG) && egg.properties[GESTATION_BROOD] === broodId &&
        egg.place === destination?.id, 'Hatching needs its tracked egg at the receiving habitat.');
    check(egg.quantities[GESTATION_LEFT] === 0, 'The egg is still incubating.');
    if (keeper !== null) {
        const handler = engine.world.holders[keeper];
        check(handler?.kind === 'body' && handler.place === egg.place && handler.properties.alive !== false,
            'The hatchling’s keeper needs to be present.');
    }
    checkNewbornPolicy(engine, world);
    const incubationConditions = (egg.state[CREATURE_GESTATION_PACK]?.imprints ?? [])
        .filter(mark => egg.quantities[`${EGG_IMPRINTS}:${mark.condition}`] === 0).map(mark => mark.condition);
    if (egg.quantities[EGG_IMPRINT_LEFT] === 0 && egg.properties[EGG_IMPRINT]) incubationConditions.push(egg.properties[EGG_IMPRINT]);
    const {id, state} = settleCreatureHatch(lifecycle, {revision, broodId, egg: egg.id, destination, keeper,
        clock: engine.world.clock, incubationConditions});
    const next = createTrackedNewborn(engine, state, id, world, [egg.id, ...brood.parents], [
        {op: 'lifecycle', act: 'end', holder: egg.id, to: [`row:${world.birthRow}`]},
    ]);
    check(!next.world.holders[egg.id], 'The world could not settle the hatched egg.');
    return {id, lifecycle: state, engine: next};
}

export function demotePhasedWorldCreature({engine, lifecycle}, {revision, id, genome, propertiesFor}) {
    const animal = lifecycle.individuals[id], body = engine.world.holders[id];
    check(animal && body?.kind === 'body' && body.refs.creature === id && body.place === animal.habitat,
        'The phased creature and its world body must agree.');
    const herd = boundHerd(engine, lifecycle, animal.origin);
    const state = returnPhasedCreature(lifecycle, {revision, id, genome, clock: engine.world.clock});
    // E12 would send any excess to a ledger row. Keep the creature individual
    // when its whole share cannot go back into the herd's accounts.
    check(Object.entries(body.quantities).every(([name, amount]) =>
        (herd.quantities[name] ?? 0) + amount <= quantityDef(engine.rules, name).max),
    'The herd cannot take all of this creature’s quantities.');
    check(readLineage(engine.world, id).some(row => row.act === 'promote' && row.parents?.includes(herd.id)) &&
        sameStructural(body.refs, {creature: id}) && sameStructural(body.properties, propertiesFor?.(animal) ?? herd.properties) &&
        sameStructural(body.tags, herd.tags) && sameStructural(body.as, herd.as) && !Object.keys(body.state).length &&
        Object.values(body.ledger).every(row => Object.keys(row).every(source => source === `lifecycle:promote:${herd.id}`)) &&
        !engine.world.laws.some(field => field.scope === id) &&
        !Object.values(engine.world.holders).some(holder => holder.id !== id && Object.values(holder.refs).includes(id)) &&
        !engine.records.bindings.some(binding => Object.values(binding.sides).includes(id)) &&
        !Object.values(engine.records.stored).some(record => record.carrier === id && !['spent', 'broken', 'lost'].includes(record.status)) &&
        !Object.values(engine.records.workings).some(({record}) =>
            record.status === 'running' && Object.values(record.bindings).some(ref => ref.id === id)),
    'This creature still has individual world facts to preserve.');
    const next = applyEngineOps(engine, [{op: 'lifecycle', act: 'demote', holders: [id], into: herd.id}], `creature-demote:${id}`);
    check(!next.world.holders[id] && next.world.holders[herd.id]?.count === state.cohorts[herd.id].stock,
        'The world did not return the creature to its herd.');
    return {engine: next, lifecycle: state};
}
