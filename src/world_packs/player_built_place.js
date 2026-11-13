// PC95 opt-in building operations. A named position is a substrate place,
// its entrance is a graph link, and a fitting is a thing at that position.
import {startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw, quoteWorking} from '../kernel_working.js';
import {linkDistance, substratePort, worldLinks} from '../world_substrate.js';
import {WORLD_QUANTITIES as Q} from '../world_quantities.js';

export const building = Object.freeze({
    tenure: 'building.tenure',
    slot: 'building.fitting',
    support: 'building.support',
    exposure: 'building.exposure',
    sun: 'building.sun',
    brace: 'building.braced',
    name: 'building.name',
    design: 'building.design',
    recordedPlan: 'building.recorded_plan',
    adjoining: 'building.adjoining',
    timber: 'stock:building_timber',
    cloth: 'stock:building_cloth',
    wet: 'stock:wet_reeds',
    dry: 'stock:dry_reeds',
    water: 'stock:water',
});

// An authored catalog. Plans refer to these revisioned rows and carry no
// materials or site rights. More materials belong in the world's recipe data.
const designs = Object.freeze({
    'shade-v1': Object.freeze({support: 2, minutes: 6, timber: 2, cloth: 1}),
    'rack-v1': Object.freeze({support: 1, minutes: 4, timber: 2, cloth: 0}),
});

const property = (holder, key, value) => ({op: 'property', holder, property: key, value});
const change = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const refuse = reason => ({ok: false, reason});
const cost = (payer, quantity, amount) => ({payer, quantity, amount});
const permitted = (actor, position) => position.properties[building.tenure] === actor.holder;
const installed = (fitting, position) => position.properties[building.slot] === fitting.holder && fitting.place === position.holder;
const sound = fitting => fitting.quantities.condition >= 40;
const roles = {actor: 'body', position: 'place', fitting: 'building.fitting'};
const canUseRack = (actor, position, fitting) => actor.place === position.holder &&
    installed(fitting, position) && fitting.properties[building.design] === 'rack-v1' && sound(fitting);

function local(actor, position) {
    if (actor.place !== position.holder) return 'Return to the work position.';
    if (!permitted(actor, position)) return 'Get permission to improve this position.';
    return null;
}

function placeable(position, fitting, plan) {
    if (!plan || fitting.properties[building.design] !== plan) return 'Use a matching fitting and a known plan.';
    const design = Object.hasOwn(designs, plan) ? designs[plan] : null;
    if (!design || !supports(position.properties[building.support], position.properties[building.brace], design))
        return 'This position needs firmer supports.';
    if (position.properties[building.slot]) return 'Clear the occupied position first.';
    return null;
}

function supports(ground, brace, design) {
    return (ground ?? 0) + (brace ? 1 : 0) >= design.support;
}

const law = defineWorkingLaw({
    id: 'building.place', revision: 1, operations: {
        build: {roles, settle({bound: {actor, position, fitting}, options: {plan}}) {
            const reason = local(actor, position) ?? placeable(position, fitting, plan);
            if (reason) return refuse(reason);
            if (fitting.place !== position.holder || fitting.quantities.condition !== 0)
                return refuse('Bring the unfinished fitting here.');
            const {timber, cloth} = designs[plan];
            if (!(actor.quantities[building.timber] >= timber) || (cloth && !(actor.quantities[building.cloth] >= cloth)))
                return refuse('Bring the full bill of materials.');
            return {ok: true, costs: [cost(actor.holder, building.timber, timber),
                ...(cloth ? [cost(actor.holder, building.cloth, cloth)] : [])],
                effects: [property(position.holder, building.slot, fitting.holder), change(fitting.holder, 'condition', 100)]};
        }},
        relocate: {roles: {...roles, destination: 'place'}, settle({bound: {actor, position, fitting, destination}}) {
            const reason = local(actor, position) ?? placeable(destination, fitting, fitting.properties[building.design]);
            if (reason) return refuse(reason);
            if (!permitted(actor, destination) || !installed(fitting, position))
                return refuse('Move an installed fitting to another permitted position.');
            return {ok: true, effects: [property(position.holder, building.slot, null),
                {op: 'move', holder: fitting.holder, to: destination.holder},
                property(destination.holder, building.slot, fitting.holder),
                {op: 'move', holder: actor.holder, to: destination.holder}]};
        }},
        repair: {roles, minutes: 3, settle({bound: {actor, position, fitting}}) {
            const reason = local(actor, position);
            if (reason) return refuse(reason);
            const condition = fitting.quantities.condition;
            if (!installed(fitting, position) || !Number.isSafeInteger(condition) || condition >= 100 ||
                !(actor.quantities[building.timber] >= 1))
                return refuse('Bring a repair timber to a worn installed fitting.');
            return {ok: true, costs: [cost(actor.holder, building.timber, 1)],
                effects: [change(fitting.holder, 'condition', Math.min(50, 100 - condition))]};
        }},
        brace: {roles: {actor: 'body', position: 'place'}, minutes: 3, settle({bound: {actor, position}}) {
            const reason = local(actor, position);
            if (reason) return refuse(reason);
            if (position.properties[building.brace]) return refuse('This position already has a brace.');
            if (!(actor.quantities[building.timber] >= 1)) return refuse('Bring timber for the brace.');
            return {ok: true, costs: [cost(actor.holder, building.timber, 1)],
                effects: [property(position.holder, building.brace, true)]};
        }},
        annex: {roles: {actor: 'body', position: 'place', destination: 'place'}, minutes: 5,
            settle({bound: {actor, position, destination}}) {
                const reason = local(actor, position);
                if (reason) return refuse(reason);
                if (destination.properties[building.adjoining] !== position.holder || destination.properties[building.tenure])
                    return refuse('Choose an unclaimed adjoining plot with a granted extension.');
                if (!(actor.quantities[building.timber] >= 1)) return refuse('Bring timber for the approach.');
                return {ok: true, costs: [cost(actor.holder, building.timber, 1)],
                    effects: [property(destination.holder, building.tenure, actor.holder),
                        {op: 'link_add', link: {id: `building.approach:${destination.holder}`, kind: 'path',
                            from: position.holder, to: destination.holder, cost: 2}}]};
            }},
        rename: {roles, minutes: 0, settle({bound: {actor, position, fitting}, options: {name}}) {
            const reason = local(actor, position);
            if (reason) return refuse(reason);
            if (!installed(fitting, position) || typeof name !== 'string' || !name.trim() || name.length > 60)
                return refuse('Name an installed fitting with up to sixty characters.');
            return {ok: true, effects: [property(fitting.holder, building.name, name.trim())]};
        }},
        record: {roles: {...roles, notebook: 'building.notebook'}, minutes: 2,
            settle({bound: {actor, position, fitting, notebook}}) {
                const reason = local(actor, position);
                if (reason) return refuse(reason);
                const design = fitting.properties[building.design];
                if (!installed(fitting, position) || !Object.hasOwn(designs, design) ||
                    notebook.place !== position.holder || notebook.properties[building.tenure] !== actor.holder)
                    return refuse('Bring your notebook to an installed fitting you may survey.');
                return {ok: true, effects: [property(notebook.holder, building.recordedPlan, design)]};
            }},
        load: {roles, minutes: 1, settle({bound: {actor, position, fitting}}) {
            if (!canUseRack(actor, position, fitting))
                return refuse('Use a sound drying rack at this position.');
            if (!(actor.quantities[building.wet] >= 1) || !(fitting.quantities[building.wet] < Q.stock.max))
                return refuse('Bring wet reeds and leave room on the rack.');
            return {ok: true, costs: [cost(actor.holder, building.wet, 1)],
                effects: [change(fitting.holder, building.wet, 1)]};
        }},
        dry: {roles, minutes: 4, settle({bound: {actor, position, fitting}}) {
            if (!canUseRack(actor, position, fitting))
                return refuse('Use a sound drying rack at this position.');
            if (position.quantities.rain && position.properties[building.exposure])
                return refuse('Move the rack under cover or wait for dry weather.');
            if (!(fitting.quantities[building.wet] >= 1) || !(fitting.quantities[building.dry] < Q.stock.max))
                return refuse('Load wet reeds and leave room for the dried bundle.');
            return {ok: true, costs: [cost(fitting.holder, building.wet, 1)],
                effects: [change(fitting.holder, building.dry, 1)]};
        }},
        collect: {roles, minutes: 1, settle({bound: {actor, position, fitting}}) {
            if (actor.place !== position.holder || !installed(fitting, position) ||
                fitting.properties[building.design] !== 'rack-v1')
                return refuse('Collect the bundle at its actual rack.');
            if (!(fitting.quantities[building.dry] >= 1) || !(actor.quantities[building.dry] < Q.stock.max))
                return refuse('Wait for a dry bundle and leave room to carry it.');
            return {ok: true, costs: [cost(fitting.holder, building.dry, 1)],
                effects: [change(actor.holder, building.dry, 1)]};
        }},
        haul: {roles: {actor: 'body', position: 'place', source: 'place'}, settle({bound: {actor, position, source}}) {
            const reason = local(actor, position);
            if (reason) return refuse(reason);
            if (!(source.quantities[building.water] >= 1) || !(actor.quantities[building.water] < Q.stock.max))
                return refuse('Bring a container with room and use a source with water.');
            return {ok: true, costs: [cost(source.holder, building.water, 1)],
                effects: [change(actor.holder, building.water, 1)]};
        }},
    },
});

// The authored local sunlight input and the sky pack must not both write
// daylight on a position. A caller can load the sky pack for other places.
const isPosition = holder => holder.kind === 'place' &&
    holder.tags.includes('building.position') && !holder.tags.includes('sky');
const localFitting = (view, position) => {
    const fitting = view.property(position, building.slot);
    return fitting && view.placeOf(fitting) === position && view.has(fitting, 'condition') ? fitting : null;
};

const conditions = {
    id: 'building.conditions', revision: 1,
    quantities: [Q.condition, Q.daylight, Q.rain, Q.stock],
    properties: [
        ...[building.tenure, building.slot, building.design, building.name, building.adjoining, building.recordedPlan]
            .map(id => ({id, type: 'label'})),
        ...[building.sun, building.exposure, building.brace].map(id => ({id, type: 'flag'})),
        {id: building.support, type: 'level', min: 0, max: 10},
    ],
    reads: ['condition', 'daylight', 'rain', building.slot, building.sun, building.exposure, building.brace, building.design],
    writes: ['condition', 'daylight'],
    publishes: ['sky.daylight'],
    laws: [{
        id: 'local-light', appliesTo: isPosition,
        decide(view, position) {
            if (!view.has(position, 'daylight')) return [];
            const fitting = localFitting(view, position);
            const blocksSun = fitting && view.property(fitting, building.design) === 'shade-v1' &&
                view.amount(fitting, 'condition') >= 40 &&
                supports(view.property(position, building.support), view.property(position, building.brace), designs['shade-v1']);
            const before = view.amount(position, 'daylight');
            const after = view.property(position, building.sun) && !blocksSun ? 1 : 0;
            if (before === after) return [];
            return [{op: 'set', holder: position, quantity: 'daylight', amount: after},
                {op: 'publish', kind: 'sky.daylight', place: position, detail: {from: before, to: after}}];
        },
        watches(view, position) {
            const fitting = localFitting(view, position);
            return fitting ? [{holder: fitting, quantity: 'condition', op: 'gte', value: 40}] : [];
        },
        rates(view, position) {
            const fitting = localFitting(view, position);
            if (!fitting || !view.property(position, building.exposure) || !view.has(position, 'rain') ||
                !view.amount(position, 'rain') || view.amount(fitting, 'condition') === 0) return [];
            return [{holder: fitting, quantity: 'condition', perMinute: -1}];
        },
    }],
};

export const builtPlaceConfig = {ownPacks: [conditions], host: {laws: [law]}};

function pathMinutes(world, from, to) {
    return linkDistance(worldLinks(world), from, to, {kinds: ['path']})?.cost ?? null;
}

export function surveyBuildPosition(world, actorId, positionId, resourceId) {
    const actor = world.holders[actorId];
    const position = world.holders[positionId];
    if (actor?.kind !== 'body' || !position || !isPosition(position)) throw Error('Choose a known work position.');
    return {
        permitted: position.properties[building.tenure] === actorId,
        accessMinutes: pathMinutes(world, actor.place, positionId),
        supplyMinutes: resourceId ? pathMinutes(world, positionId, resourceId) : null,
        exposed: position.properties[building.exposure] === true,
        daylight: position.quantities.daylight,
        support: position.properties[building.support] ?? 0,
    };
}

function working(engine, {id, action, actor, position, fitting, destination, plan, name, notebook, source}) {
    if (!Object.hasOwn(law.operations, action)) throw Error('Choose a building action.');
    const operation = law.operations[action];
    const holders = {actor, position, fitting, destination, notebook, source};
    const bindings = Object.fromEntries(Object.entries(operation.roles).map(([role, kind]) => [role, {kind, id: holders[role]}]));
    const at = engine.world.clock;
    const moving = action === 'relocate';
    if (operation.roles.destination && !destination) return {reason: 'Choose a known work position.'};
    if (destination && !isPosition(engine.world.holders[destination] ?? {})) return {reason: 'Choose a known work position.'};
    const site = surveyBuildPosition(engine.world, actor, position, destination);
    if (moving && site.supplyMinutes === null) return {reason: 'Open a path to the destination.'};
    if (action === 'annex' && engine.world.links?.some(link => link.id === `building.approach:${destination}`))
        return {reason: 'This approach already exists.'};
    const design = Object.hasOwn(designs, plan) ? designs[plan] : null;
    const rainDelay = site.exposed && engine.world.holders[position].quantities.rain ? 2 : 0;
    let minutes = operation.minutes;
    if (moving) minutes = site.supplyMinutes + 2;
    if (action === 'build') minutes = (design?.minutes ?? 1) + rainDelay;
    if (action === 'haul') {
        if (!source || source === position) return {reason: 'Choose a separate water source.'};
        const out = pathMinutes(engine.world, position, source);
        const back = pathMinutes(engine.world, source, position);
        if (out === null || back === null) return {reason: 'Open a round trip to the water source.'};
        minutes = out + back + 1;
    }
    const method = {id: law.id, revision: 1, law: law.ref, roles: operation.roles,
        steps: [{op: action, minutes, options: {...(plan ? {plan} : {}), ...(name !== undefined ? {name} : {})},
            bindings: Object.fromEntries(Object.keys(bindings).map(role => [role, role]))}]};
    return {law, method, id, bindings, at, minutes};
}

export function quoteBuilding(engine, request) {
    return quoteTerms(engine, working(engine, request));
}

function quoteTerms(engine, terms) {
    if (terms.reason) return {eligible: false, reason: terms.reason};
    const {law, method, minutes, ...context} = terms;
    // Forecast holds current site conditions, just like a quote on a native job.
    const read = substratePort(engine.world);
    const quote = quoteWorking(law, method, {...context, ports: {read: ref => read(ref)}});
    return {eligible: quote.ok, minutes, costs: quote.costs, ...(quote.reason ? {reason: quote.reason} : {})};
}

export function startBuilding(engine, request) {
    const terms = working(engine, request);
    const quote = quoteTerms(engine, terms);
    if (!quote.eligible) throw Error(quote.reason);
    return startEngineWorking(engine, terms);
}
