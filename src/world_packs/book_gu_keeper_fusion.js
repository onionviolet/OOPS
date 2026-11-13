import {keeperFusion as id, keeperFusionTime as timeId, keeperFusionVital as vitalId, keeperFusionWorld, fusionWait, fusionRecovery,
    fusionSealMinutes} from '../gu_keeper_fusion.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const stone = kKey('stone');
const doseId = `${id}.dose`;
const dose = JSON.stringify({id: doseId});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});

function command(operation, label, description, {needs = [], costs = [], effects, pack = id} = {}) {
    const access = pack === id ? admitted : eq(extensionFact(pack));
    return {id: `${pack}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperFusionWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'], visibleWhen: access,
        requires: all(ready, access, eq(`${pack}.can_${operation}`), ...needs), costs,
        effects: effects ?? [{type: 'guFusion', actor: 'player', operation}]};
}

const payStone = {needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)]};
export const guKeeperFusion = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Find a refinement branch for Moonlight Gu',
    description: 'The steward provides a separate set of living ingredients. Compare power, reach and a possible substitution before choosing a fusion.',
    requires: ready,
    reason: 'Visit the Gu house.',
    items: [{id: doseId, label: 'Red-steel essence for the fusion trial', value: 0, description: 'One stored rank-two dose for a test cast.'}],
    commands: [
        command('setup', 'Lay out the fusion ingredients', 'Set out Moonlight, two Little Light Gu, Stone Scar and Groove Stone.'),
        command('research', 'Find recipes among the living Gu', 'Check which held Gu can take the roles in each fusion.'),
        ...Array.from({length: 3}, (_, index) => command(`start_${index + 1}`, `Prepare written fusion ${index + 1} · 1 stone`,
            `Bind the specific Gu from the notes and let them settle for ${fusionWait} minutes.`, payStone)),
        command('finish', 'Finish the settled fusion', 'Fuse the bound Gu into a new individual.'),
        command('rush', 'Force the fusion before it settles', `The rush will fail, injuring the survivors. Let them rest for ${fusionRecovery} minutes before tending them.`),
        command('recover', 'Tend the surviving Gu', 'Help the rested survivors recover enough to refine again.'),
        command('replace', 'Buy one Little Light Gu · 1 stone', 'Replace the lost Little Light with a new living specimen.', payStone),
        command('take_dose', 'Take the steward’s red-steel dose', 'The steward supplies one rank-two test cast.', {effects: [item(dose, 1)]}),
        command('cast', 'Test the fused Gu · 1 red-steel dose', 'Measure its force and reach on the steward’s targets.', {
            needs: [ge(`item.${dose}`, 1)], costs: [item(dose, -1)],
        }),
    ],
};

const sealCommand = (operation, label, description) => command(operation, label, description, {pack: timeId});
export const guKeeperFusionTime = {
    schema: 1, id: timeId, revision: 1, base: guKeeperFusion.base, dependsOn: [id],
    label: 'Free the Gu in the jammed cage',
    description: 'A Little Light Gu is trapped behind a jammed latch. Borrow the blade of your pending fusion to cut it. The latch needs force 3.',
    requires: ready, reason: 'Visit the fusion bench first.',
    commands: [
        sealCommand('open_seal', 'Open a seal on the pending fusion',
            `Prepare a fusion first. The seal lends you one cast for ${fusionSealMinutes} minutes, while that job is still pending.`),
        sealCommand('cut_latch', 'Strike the latch with the borrowed blade',
            'The seal supplies one red-steel dose. The cut takes effect now and the fusion keeps settling.'),
        sealCommand('cancel_fusion', 'Cancel the pending fusion',
            'Close the seal and keep the ingredients. The furnace has already used the stone.'),
        sealCommand('bring_rescued', 'Bring the rescued Little Light Gu to the bench',
            'If a Little Light Gu is lost, borrow the one you freed from the steward to fill the empty place.'),
    ],
};

export const guKeeperFusionVital = {
    schema: 1, id: vitalId, revision: 1, base: guKeeperFusion.base, dependsOn: [id],
    label: 'Learn how a Vital Gu survives fusion',
    description: 'If you lose a Little Light Gu, the steward will lend you his own Vital Gu for the empty place. His bond stays with it while you hold it.',
    requires: ready, reason: 'Visit the fusion bench first.',
    commands: [
        command('borrow_vital', 'Borrow the steward’s Vital Gu',
            'Use it in the vacant place, or borrow the finished Gu again. A failed fusion can still injure it.', {pack: vitalId}),
        command('return_vital', 'Return the steward’s Vital Gu',
            'Give the Gu back to its master once the furnace is free.', {pack: vitalId}),
    ],
};

export async function registerGuKeeperFusion(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFusion, base);
        await register.bundledInstantExtension(guKeeperFusionTime, base);
        await register.bundledInstantExtension(guKeeperFusionVital, base);
    }
}
