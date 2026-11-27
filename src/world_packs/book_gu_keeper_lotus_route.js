import {keeperLotus as id, LOTUS_DIALS as D, LOTUS_SPRINGS} from '../gu_keeper_lotus_route.js';
import {LOTUS_AMOUNT} from './gu_lotus_essence_case.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';
import {formatDuration} from '../number_format.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const annex = kId('annex'), trail = `${id}.trail`, stone = kKey('stone');
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason && {reason})});
const ge = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason && {reason})});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const admitted = eq(extensionFact(id));
const item = amount => ({type: 'item', actor: 'player', key: stone, amount});

function command(operation, label, description, {location = annex, duration = 0, needs = [], costs = [], effects} = {}) {
    const gate = all(ready, admitted, ...needs);
    return {id: `${id}.${operation}`, revision: 1, label, description, group: 'structured_local',
        worldId: kId('world'), location, actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: gate, duration, costs, effects,
        ...(duration && {cancellation: 'refund', reservationReturns: 1, completionRequires: all(ready, admitted),
            completionCoLocated: true, completionFailure: 'refund'})};
}
const can = (operation, reason) => eq(`${id}.can_${operation}`, true, reason);
const act = (operation, label, description, opts = {}) => command(operation, label, description, {
    ...opts, needs: [can(operation, opts.reason ?? 'The required Lotus claim, knowledge, spring or time is missing.'), ...(opts.needs ?? [])],
    effects: [{type: 'guRefine', actor: 'player', world: kId('world'), operation}],
});

export const guKeeperLotusRoute = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Advance a Heavenly Essence Treasure Lotus',
    description: 'The steward holds a rank-three Lotus and a rank-four recipe. Seven outside spirit springs each grant one finite charge under a custodian’s terms.',
    requires: ready, reason: 'Begin the keeper life at the Gu house.',
    locations: [{id: trail, label: 'Seven Springs trail', underRoof: false,
        description: 'Outside the settlement, seven custodians keep separate spirit springs. Every draw drains its spring permanently.'}],
    commands: [
        act('buy_precursor', `Take title to the rank-three Heavenly Essence Treasure Lotus · ${D.precursorStones} stones`,
            'The clan steward transfers one living rank-three specimen to your care. It is the required precursor, not a loose material.', {
                needs: [ge(`item.${stone}`, D.precursorStones, 'You need two stones.')], costs: [item(-D.precursorStones)]}),
        act('buy_recipe', `Learn the Monarch Lotus recipe · ${D.recipeStones} stones`,
            'The clan steward teaches the rank-four recipe. It needs the living precursor and seven separate spirit spring charges.', {
                needs: [ge(`item.${stone}`, D.recipeStones, 'You need two stones.')], costs: [item(-D.recipeStones)]}),
        command('walk_trail', `Walk to Seven Springs · ${D.trailMinutes} min`,
            'Follow the outer path to the custodians’ springs.', {duration: D.trailMinutes,
                effects: [{type: 'relocate', actor: 'player', location: trail}]}),
        ...LOTUS_SPRINGS.map(s => act(`draw_${s.id}`, `Draw ${s.id} spring · ${D.springStones} stone, ${D.springDutyMinutes} min duty`,
            `${s.custodian} grants one charge if you pay and ${s.obligation}. The charge drains this spring permanently.`, {
                location: trail, duration: D.springDutyMinutes,
                reason: `${s.custodian}’s spring is spent, or you still need the precursor and recipe.`,
                needs: [ge(`item.${stone}`, D.springStones, 'You need one stone for this custodian.')],
                costs: [item(-D.springStones)]})),
        command('walk_home', `Return to the Gu house · ${D.trailMinutes} min`,
            'Carry the seven sealed charges back along the outer path.', {location: trail, duration: D.trailMinutes,
                effects: [{type: 'relocate', actor: 'player', location: annex}]}),
        act('begin', 'Set the Lotus and seven spring charges in the refinement basin',
            'Commit the living rank-three precursor and all seven charges to the rank-four recipe.'),
        ...Array.from({length: 7}, (_, i) => act(`stage_${i + 1}`, `Tend Monarch Lotus spring stage ${i + 1} of 7`,
            `Wait ${formatDuration(D.stageMinutes)} after the previous stage, then consume charge ${i + 1} in the basin.`, {
                reason: `The previous stage has not settled for ${formatDuration(D.stageMinutes)}, or the work is not at this stage.`})),
        act('use', 'Let the Monarch Lotus refill your own primeval sea',
            `The Gu produces up to ${LOTUS_AMOUNT} essence for your own pool, capped by your aperture. It may answer once each ${formatDuration(D.useCadenceMinutes)}. It makes no stones.`, {
                reason: 'Hold the finished Lotus, have room in your sea, and wait for its next daily use.'}),
    ],
};

export async function registerGuKeeperLotusRoute(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash)
        await register.bundledInstantExtension(guKeeperLotusRoute, base);
}
