// Volume one, chapters 11–20. The earlier bond returns to view during a
// counterattack. Refining either Rank-one Gu is a separate, later result.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {leadMoonlightKey} from './book_gu_lead_selection.js';

export const GU_LEAD_VITAL = id('vital');
const vital = name => `${GU_LEAD_VITAL}.${name}`;
const key = name => JSON.stringify({id: vital(name)});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const refinementHash = 'sha256:20a9c2c6d1207e36f37bf61801e37a31553e5c1d01531c8c0934b59451494413';
const world = id('world');
const home = id('home');
const academy = id('academy');
const elder = id('academy_elder');
const essence = id('primeval');
const stone = JSON.stringify({id: `${GU_LEAD_REFINEMENT}.primeval_stone`});
const wine = key('bamboo_wine');
const worm = key('liquor_worm');
const refinedWorm = key('refined_liquor_worm');

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const done = name => eq(`completed.${vital(name)}`);
const owns = (itemKey, reason) => eq(`item.${itemKey}`, 1, reason);
const fact = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: vital(name), value});
const actorFact = (name, value, reason) => eq(`actor.${vital(name)}`, value, reason);
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: vital(name), stage: 'understood', value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const energy = output => ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output, control: 1});
const admitted = eq(extensionFact(GU_LEAD_VITAL));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`faculty.${id('aperture')}.active`, true, 'You need to be able to move your primeval essence.'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'));
const predecessor = all(eq(extensionFact(GU_LEAD_REFINEMENT)), eq(`completed.${GU_LEAD_REFINEMENT}.draw_stone`),
    owns(leadMoonlightKey, 'Keep the Moonlight Gu you chose at the academy.'));
const holdsWorm = owns(worm, 'Keep the Liquor Worm you took from the crevice.');
const canPress = actorFact('vital_bond', 'spring_autumn_cicada', 'You need the bond you felt in your aperture.');
const hasCrescent = actorFact('moonlight_form', 'forehead', 'The elder needs to see your refined Moonlight Gu.');

function act(name, label, duration, previous, description, effects, {needs = [], costs = [], location = home, ...extra} = {}) {
    const visible = all(admitted, previous);
    const support = all(ready, visible, eq('actor.location', location), ...needs);
    return {
        id: vital(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location, audience: ['$actor'], once: true,
        duration, visibleWhen: visible, requires: support, completionRequires: support, completionCoLocated: true,
        cancellation: 'refund', completionFailure: 'refund', reservationReturns: 1, costs, effects, ...extra
    };
}

export const guLeadVital = {
    schema: 1, id: GU_LEAD_VITAL, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan’s search after the rain',
    description: 'Leave your guardians’ house after the storm and search the mountain with a stronger wine.',
    requires: all(ready, predecessor, eq('actor.location', home)),
    reason: 'Finish drawing from a stone after the Moonlight Gu resists you. Keep that Gu with you at your guardians’ house.',
    items: [
        {id: vital('bamboo_wine'), label: 'Jar of green bamboo wine', description: 'The inn’s strongest wine. Its scent carries far in the mountain air.', value: 0},
        {id: vital('liquor_worm'), label: 'Liquor Worm · unrefined', description: 'A pearl-white Gu that feeds on wine. It can still resist your essence.', value: 0},
        {id: vital('refined_liquor_worm'), label: 'Liquor Worm · refined', description: 'It curls at a thought and can enter your aperture. Keep it out of the elder’s sight.', value: 0},
        {id: vital('half_stone'), label: 'Half a primeval stone', description: 'Fang Zheng has already drawn half the essence from this stone.', value: 0}
    ],
    status: [
        {id: vital('night_status'), label: 'The search', knowledgeKey: vital('search_result')},
        {id: vital('cave_status'), label: 'Inside the crevice', knowledgeKey: vital('crevice_result')},
        {id: vital('first_night_status'), label: 'First night at the inn', knowledgeKey: vital('first_night')},
        {id: vital('brother_status'), label: 'Fang Zheng’s visit', knowledgeKey: vital('brother')},
        {id: vital('bond_status'), label: 'Your vital Gu', knowledgeKey: vital('bond')},
        {id: vital('worm_status'), label: 'Liquor Worm', knowledgeKey: vital('worm_result')},
        {id: vital('moonlight_status'), label: 'Moonlight Gu', knowledgeKey: vital('moonlight_result')},
        {id: vital('academy_status'), label: 'The academy assessment', knowledgeKey: vital('academy_result')}
    ],
    commands: [
        act('leave', 'Take a room at the inn', 20, predecessor,
            'Shen Cui comes upstairs with food and wine, and men wait below. Send her away and take a room, supper and wine at the inn for two primeval stones.',
            [fact('scene', 'inn')], {costs: [item(stone, -2)]}),
        act('buy_wine', 'Buy green bamboo wine', 5, done('leave'),
            'Jiang Ya breaks a hunter’s jar. The scent fills the room. Order a jar of your own for two primeval stones and take it up the mountain.',
            [item(wine, 1), fact('scene', 'grove')], {costs: [item(stone, -2)]}),
        act('lure', 'Set the wine out in the bamboo grove', 180, done('buy_wine'),
            'Pour the wine in several clearings and wait downwind. The rain has passed and the scent can carry again. Use the whole jar.',
            [note('search_result', 'The last wine soaks into the flowers. You are turning to leave when the clouds part and a white bead shows on a bamboo stem. It is a Liquor Worm.')],
            {costs: [item(wine, -1)]}),
        act('follow', 'Follow the Liquor Worm upstream', 35, done('lure'),
            'Back away until the worm comes down to drink. Let it fly on and follow while the wine slows it. Wade upstream and squeeze through the crack behind the falling water.',
            [fact('scene', 'crevice')]),
        act('take_worm', 'Pick up the sleeping Liquor Worm', 3, done('follow'),
            'The worm lies on a clump of dead roots. Pick it up. Pull the vines aside to see what is underneath.',
            [item(worm, 1), note('crevice_result', 'You have the Liquor Worm in hand. The vines hide the Flower Wine Monk’s bones. When you pull them back, a voice behind you tells you to stop.')]),
        act('search_crevice', 'Watch the wall and search the remains', 12, done('take_worm'),
            'Stand still and see where the voice comes from. Search the remains after you understand what is playing on the wall.',
            [item(stone, 15), note('crevice_result', 'The voice comes from a scene repeating on the wall. You recognize a Photo-audio Gu’s work. The recording contradicts the clan’s story of the fourth head’s fight. You find fifteen primeval stones and leave the recording where it is.')],
            {needs: [holdsWorm]}),
        act('return_inn', 'Bring the Liquor Worm back to your room', 45, done('search_crevice'),
            'Squeeze back through the crack and get the innkeeper to let you in. Wash up and bolt your door before taking out the worm.',
            [fact('scene', 'inn')], {needs: [holdsWorm]}),
        act('first_night', 'Work essence into the Liquor Worm', 360, done('return_inn'),
            'Set aside two primeval stones and 30 parts of essence. A breath of wine from the worm has already thickened a drop of essence. Try to reach its will before dawn.',
            [note('first_night', 'The worm’s scent condensed a drop of your essence. By dawn only a faint patch has taken. You suspect the Flower Wine Monk’s will still holds the worm.')],
            {needs: [holdsWorm], costs: [item(stone, -2), energy(30)]}),
        act('brother', 'Hear Fang Zheng out at breakfast', 15, done('first_night'),
            'Your brother has come to confront you about Shen Cui. Let him take the matter of her service to your guardians. He offers the stones in his purse.',
            [item(stone, 5), item(key('half_stone'), 1),
                note('brother', 'Fang Zheng leaves five whole stones and a half-drawn one. He wants Shen Cui reassigned to him. That decision still belongs to your guardians.')]),
        act('press_again', 'Keep working against the Liquor Worm’s will', 2880, done('brother'),
            'Spend two days and nights working through the resistance. Set aside ten more primeval stones and ten parts of essence to keep the pressure up.',
            [fact('vital_bond', 'spring_autumn_cicada'),
                note('bond', 'The Liquor Worm’s will surges into your aperture. The Spring Autumn Cicada stirs and crushes the attack. You refined it in your former life, and that bond survived the return. It is still your vital Gu. It is too weak to carry you back again, but you can let a trace of its aura out.')],
            {needs: [holdsWorm], costs: [item(stone, -10), energy(10)]}),
        act('refine_worm', 'Subdue and refine the Liquor Worm', 1, done('press_again'),
            'Release a trace of your vital Gu’s aura and send one part of essence through the worm while its will is pinned.',
            [item(refinedWorm, 1), note('worm_result', 'The worm turns green from end to end. Its will gives way. It curls at a thought and slips into your aperture.')],
            {needs: [canPress], costs: [item(worm, -1), energy(1)]}),
        act('refine_moonlight', 'Refine your Moonlight Gu', 5, done('refine_worm'),
            'Take out the blue crescent you brought from the academy. Suppress its will with the same aura and send in one part of essence.',
            [fact('moonlight_form', 'forehead'),
                note('moonlight_result', 'Your Moonlight Gu takes the essence all the way through. When you draw back, it settles against your brow and leaves a pale blue crescent.')],
            {needs: [canPress, owns(refinedWorm, 'Keep the Liquor Worm with you for now.')], costs: [item(leadMoonlightKey, -1), energy(1)]}),
        act('go_academy', 'Hide the worm and walk to the academy', 15, done('refine_moonlight'),
            'Tuck the Liquor Worm in a corner of the bed. Walk to the academy with the crescent on your brow and ask the night watch to call the elder.',
            [fact('worm_custody', 'inn_bed'), fact('scene', 'academy'), {type: 'relocate', actor: 'player', location: academy},
                note('worm_result', 'You left the refined Liquor Worm tucked away at the inn before going to the academy.')],
            {needs: [hasCrescent], costs: [item(refinedWorm, -1)]}),
        act('show_elder', 'Show the elder your crescent', 2, done('go_academy'),
            'The elder sees the crescent and calls you Fang Zheng. Correct him and show him the mark.',
            [fact('assessment', 'first'),
                note('academy_result', 'The elder looks from your face to the crescent on your brow. The night watch has seen no other pupil with a refined Gu. The elder confirms your name as the first in the batch. The twenty-stone prize is still with the academy.')],
            {location: academy, needs: [hasCrescent], targetId: elder, coLocated: true, participants: ['$target']})
    ]
};

let installed;
export async function registerGuLeadVital(register, base) {
    installed = null;
    if(!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_REFINEMENT && e.revision === 1 && e.contentHash === refinementHash)) return null;
    installed = await register.extension(guLeadVital, base);
    return installed;
}

export function guLeadVitalClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if(!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_VITAL);
    if(!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId.startsWith(GU_LEAD_VITAL + '.'));
    const work = extension.commands.find(c => c.id === job?.commandId);
    if(!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || !work || job.completionSupport?.location !== work.location ||
        pupil.location !== work.location || work.duration < 12) return null;
    const remaining = job.due - state.clock;
    const pace = work.duration >= 180 ? 120 : 15;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= work.duration ? Math.min(pace, remaining) : null;
}

const sceneLabels = {
    inn: 'The village inn',
    grove: 'The bamboo grove',
    crevice: 'The crevice behind the waterfall',
    academy: 'Clan academy'
};

export function guLeadVitalStatus(state, record) {
    if(record?.packId !== GU_LEAD || !record.extensions?.some(pin => pin.id === GU_LEAD_VITAL)) return [];
    const scene = state.actors.player?.facts[vital('scene')];
    return Object.hasOwn(sceneLabels, scene) ? [{label: 'Where you are', value: sceneLabels[scene]}] : [];
}
