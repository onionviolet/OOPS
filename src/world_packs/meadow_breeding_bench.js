// Original, opt-in bench. The lifecycle owns inheritance and test knowledge.
// The world owns the physical bench, its stock and the clock.
import {check, positive} from '../basics.js';
import {markCreatureGenesKnown, startCreatureBrood} from '../creature_lifecycle.js';
import {creatureForm} from '../creature_evolution.js';
import {genotypeView, validateGenes} from '../heredity.js';
import {applyEngineOps} from '../engine_world.js';
import {JUVENILE_GROWTH} from '../world_substrate_packs/living_body.js';

const reagent = 'stock:fleece-assay-reagent';
const clasp = 'stock:breeding-clasp';

function canUseBench(engine, bench, animals, keeper, stock) {
    const holder = engine.world.holders[bench];
    return holder?.kind === 'thing' && holder.properties['breeding-bench'] === true &&
        holder.properties.custodian === keeper && holder.quantities[stock] >= 1 &&
        animals.every(animal => animal?.keeper === keeper && animal.habitat === holder.place);
}

export function testMeadowFleece({engine, lifecycle}, {bench, id, keeper, genome}) {
    const animal = lifecycle.individuals[id];
    if (!canUseBench(engine, bench, [animal], keeper, reagent) || !animal.genes || !Object.hasOwn(genome.loci, 'fleece'))
        return {ok: false, reason: 'fleece-assay-unavailable', engine, lifecycle};
    validateGenes(genome, animal.genes);
    if (genotypeView(genome, animal.genes, animal.tested ?? [], 'fleece').known)
        return {ok: false, reason: 'fleece-already-known', engine, lifecycle};
    const next = markCreatureGenesKnown(lifecycle, {revision: lifecycle.revision, id, loci: ['fleece']});
    return {ok: true, reading: genotypeView(genome, animal.genes, next.individuals[id].tested, 'fleece'),
        lifecycle: next, engine: applyEngineOps(engine, [{op: 'add', holder: bench, quantity: reagent, amount: -1}], `fleece-assay:${id}`)};
}

export function startMeadowClaspBrood({engine, lifecycle}, {bench, parents, keeper, genome, root,
    gestationMinutes, growthMinutes, parent, formRule}) {
    if (!Array.isArray(parents) || parents.length !== 2 || ![0, 1].includes(parent) ||
        !canUseBench(engine, bench, parents.map(id => lifecycle.individuals[id]), keeper, clasp))
        return {ok: false, reason: 'breeding-clasp-unavailable', engine, lifecycle};
    for (const id of parents) {
        const body = engine.world.holders[id];
        // The bench also supports lifecycle-only parents. A materialized body
        // must match its lifecycle record and satisfy its saved growth clock.
        if (!body) continue;
        if (body.kind !== 'body' || body.refs.creature !== id || body.place !== lifecycle.individuals[id].habitat)
            return {ok: false, reason: 'breeding-parent-out-of-reach', engine, lifecycle};
        if (body.quantities[JUVENILE_GROWTH.id] > 0)
            return {ok: false, reason: 'breeding-parent-still-growing', engine, lifecycle};
    }
    if (formRule !== undefined) {
        check(formRule && [0, 1].includes(formRule.parent) && typeof formRule.form === 'string' &&
            formRule.form.length > 0 && positive(formRule.gestationMinutes), 'Invalid breeding form rule.');
        const body = engine.world.holders[parents[formRule.parent]];
        if (!body || creatureForm(body, engine.world.clock) !== formRule.form)
            return {ok: false, reason: 'breeding-parent-form-unavailable', engine, lifecycle};
        gestationMinutes = formRule.gestationMinutes;
    }
    const brood = startCreatureBrood(lifecycle, {revision: lifecycle.revision, parents, keeper, genome, root,
        clock: engine.world.clock, gestationMinutes, growthMinutes,
        ivInheritance: {guaranteed: {stat: 'woolYield', parent}}});
    return {ok: true, broodId: brood.id, lifecycle: brood.state,
        engine: applyEngineOps(engine, [{op: 'add', holder: bench, quantity: clasp, amount: -1}], `breeding-clasp:${brood.id}`)};
}
