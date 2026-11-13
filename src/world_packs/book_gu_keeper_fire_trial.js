import {guCatalogue} from '../gu_catalogue.js';
import {guMoveTrial} from '../gu_move_trial_host.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

export const keeperFireTrial = kId('fire_trial');
export const keeperFireSlots = 8;
const id = keeperFireTrial;
const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const ledge = `${id}.ledge`;
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const aperture = eq(`faculty.${kId('aperture')}.active`);
const reserve = amount => ({fact: `energy.${kId('primeval')}.reserve`, op: 'gte', value: amount});
const issued = `${id}.issued`;
const returned = `${id}.duplicate_returned`;
const loaned = value => eq(`${id}.loaned`, value);
const duplicateAway = value => eq(`${id}.duplicate_away`, value);
const write = (key, value) => ({type: 'fact', scope: 'actor', actor: 'player', key, value});
const trial = (operation, slot) => ({type: 'guMoveTrial', actor: 'player', operation, ...(slot !== undefined && {slot})});
const move = location => ({type: 'relocate', actor: 'player', location});
const fire = guCatalogue['red-fire'].ability.value;
const source = guCatalogue['fire-source'].ability.value;
const minAttackCost = source.cost + fire.cost * source.modifier.factor;
const crossCost = guCatalogue['fire-discharge'].ability.value.cost;

export const fireMoveTrial = guMoveTrial({
    id, world: kId('world'), place: annex, energyId: kId('primeval'), slots: keeperFireSlots,
    admitted: state => !!state.actors.player.facts[issued],
    research: 'research_fire', effect: 'flame', referenceReserve: 12,
    core: {id: 'red-fire', kind: 'red-fire'},
    supports: {
        'fire-source': {kind: 'fire-source', label: 'Fire Source Gu'},
        duplicate: {kind: 'duplicate', label: 'Duplicate Gu', ready: state => !state.actors.player.facts[returned]},
        enlarge: {kind: 'enlarge', label: 'Enlarge Gu'},
    },
    notes: {key: `${id}.notes`, orderedSupports: true, keepExtra: true, receiptOrder: ['slot', 'spent', 'outcome']},
    outcomeFields: {count: {property: 'count', values: [1, 2]}, force: {property: 'magnitude', values: [1, 2]}},
    progress: {pair: {field: 'count', minimum: 2}, bundle: {field: 'force', minimum: 2}},
    crossing: {operation: 'cross_fire', specimen: {id: 'fire-discharge', kind: 'fire-discharge'}, effect: 'travel',
        unfunded: 'Gather enough essence to cross with Fire Discharge.'},
    errors: {
        invalidNotes: 'Invalid Red Fire trial notes.',
        disagree: 'The Red Fire results and their notes disagree.',
        admission: 'Bring the steward’s fire set to the Gu house.',
        research: 'Gather enough essence to test the fire set.',
        plan: 'The fire set is not ready for this trial.',
    },
});

export function validateKeeperFireTrial(state, record) {
    const notes = fireMoveTrial.read(state);
    const flags = state.actors.player.facts;
    const done = action => state.actors.player.completed[`${id}.${action}`] ?? 0;
    const crossings = done('cross') - done('return_house');
    if (Boolean(notes) !== (done('research') > 0) ||
        Boolean(flags[issued]) !== (done('loan') === 1) ||
        done('return_duplicate') - done('borrow_duplicate') !== Number(!!flags[returned]) ||
        (notes || flags[returned] !== undefined) && !flags[issued] ||
        (notes || flags[issued]) && !fireMoveTrial.pinned(record) ||
        notes?.last && !done(`try_${notes.last.slot}`) ||
        ![0, 1].includes(crossings) ||
        done('cross') > 0 && !fireMoveTrial.routeReady(notes)) {
        throw Error('The Red Fire trial needs matching loan, casting and crossing receipts.');
    }
}

export function keeperFireTrialFacts(state) {
    const notes = fireMoveTrial.read(state);
    const flags = state.actors.player.facts;
    return {
        [`${id}.loaned`]: flags[issued] === true,
        [`${id}.duplicate_away`]: flags[returned] === true,
        ...fireMoveTrial.planFacts(notes),
        [`${id}.route_ready`]: fireMoveTrial.routeReady(notes),
    };
}

export function keeperFireTrialView(state, record) {
    if (!fireMoveTrial.pinned(record)) return null;
    const notes = fireMoveTrial.read(state);
    return {pair: notes?.pair ?? false, bundle: notes?.bundle ?? false, last: notes?.last,
        plans: fireMoveTrial.describePlans(state, notes)};
}

function command(name, label, description, needs, effects, location = annex) {
    return {id: `${id}.${name}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: kId('world'), location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs: [], effects};
}

export const guKeeperFireTrial = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Practice with the Red Fire set',
    description: 'Use Red Fire and its three supports to light the kiln’s twin braziers and catch the damp kindling. Then try Fire Discharge at the ledge.',
    requires: ready, reason: 'Visit the Gu house to borrow the steward’s fire set.',
    locations: [{id: ledge, label: 'Kiln ledge', underRoof: false, description: 'The far side of the practice kiln, above the warmed channel.'}],
    commands: [
        command('loan', 'Borrow the steward’s fire set', 'The steward keeps the five loan Gu fed.',
            [loaned(false)], [write(issued, true)]),
        command('return_duplicate', 'Return Duplicate Gu', 'A written cast can still call for this Gu after you return it.',
            [loaned(true), duplicateAway(false)], [write(returned, true)]),
        command('borrow_duplicate', 'Borrow Duplicate Gu again', 'Bring it back to the kiln for combinations that need more than one flame.',
            [loaned(true), duplicateAway(true)], [write(returned, false)]),
        command('research', 'Write down workable Red Fire combinations', 'Compare flame count, force per flame and essence.',
            [loaned(true), aperture, reserve(minAttackCost)], [trial('research_fire')]),
        ...Array.from({length: keeperFireSlots}, (_, index) => {
            const slot = index + 1;
            return command(`try_${slot}`, `Try written Red Fire combination ${slot}`,
                'Each Gu uses essence in the written order. An interrupted cast keeps what it already spent.',
                [loaned(true), aperture, eq(`${id}.plan_${slot}`)], [trial('cast_fire', slot)]);
        }),
        command('cross', `Cross to the kiln ledge with Fire Discharge · ${crossCost} essence`,
            'Light both braziers and catch the damp kindling to open the practice crossing.',
            [loaned(true), aperture, reserve(crossCost), eq(`${id}.route_ready`)], [trial('cross_fire'), move(ledge)]),
        command('return_house', 'Walk back to the Gu house', 'Take the steps down from the practice ledge.', [], [move(annex)], ledge),
    ],
};

export async function registerGuKeeperFireTrial(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFireTrial, base);
    }
}
