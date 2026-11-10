// Qing Mao, volume two chapters 126–130.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ALLIANCE_SLOPE} from './book_gu_lead_alliance_slope.js';
import {GU_LEAD_STONE_FOREST} from './book_gu_lead_stone_forest.js';
import {GU_LEAD_RIVER_TOAD} from './book_gu_lead_river_toad.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_EAR_GRASS = id('ear_grass');
const local = name => `${GU_LEAD_EAR_GRASS}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:5990ec8ed004505d82109ccfdec8002cfd0595a1f342241f0c8b195426aa5ce0';
const world = id('world');
const academy = id('academy');
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const key = itemId => JSON.stringify({id: itemId});
const stock = (itemId, value = 1) => ({fact: `item.${key(itemId)}`, op: 'gte', value});
const item = (itemId, amount) => ({type: 'item', actor: 'player', key: key(itemId), amount});
const stone = `${GU_LEAD_REFINEMENT}.primeval_stone`;
const moonglow = `${GU_LEAD_MOONGLOW}.moonglow_gu`;
const jade = `${GU_LEAD_WHITE_JADE}.white_jade_gu`;
const stealth = `${GU_LEAD_STONE_FOREST}.stealth_rock_gu`;
const boar = `${GU_LEAD_RIVER_TOAD}.refined_black_boar_gu`;
const fish = local('fish_scale_gu');
const scales = local('stealth_scales_gu');
const wildEar = local('earth_ear_grass');
const roots = local('ginseng_roots');
const petals = local('moon_orchid_petals');
const eyes = local('wolf_eyes');
const cachedEyes = local('cached_wolf_eyes');
const merit = local('merit');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount});
const health = loss => ({type: 'vital', actor: 'player', key: 'health', amount: -loss});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_ALLIANCE_SLOPE)),
    eq(`completed.${GU_LEAD_ALLIANCE_SLOPE}.admit_defeat_without_sparring`),
    eq(`actor.${GU_LEAD_ALLIANCE_SLOPE}.challenge`, 'conceded_before_sparring'),
    eq(`world.${GU_LEAD_ALLIANCE_SLOPE}.alliance`, 'formed'));
const admitted = eq(extensionFact(GU_LEAD_EAR_GRASS));

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], parts = 0, reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart, ...(parts ? [reserve(parts)] : [])), reason: reason || 'Finish the previous step and stay in the village.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects
    };
}

export const guLeadEarGrass = {
    schema: 1, id: GU_LEAD_EAR_GRASS, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan finds a way to scout the mountain',
    description: 'Hear the new alliance terms, settle your trade with Qing Shu and look for a way to approach the cave.',
    requires: all(ready, predecessor, stock(boar), stock(stealth), stock(moonglow), stock(jade)),
    reason: 'Answer the challenge at Alliance Slope and bring your Gu.',
    items: [
        {id: fish, label: 'Fish Scale Gu', description: 'Qing Shu’s side of the Black Boar trade. Combine it with Stealth Rock to hide clothing as well.', value: 0},
        {id: scales, label: 'Stealth Scales Gu', description: 'Hides your body and clothing from ordinary sight. It does little against sharper senses or certain scouting Gu.', value: 0},
        {id: wildEar, label: 'Earth Communication Ear Grass', description: 'Also called Earth Communication Flesh Ear Gu. It feeds on ginseng and needs a bodily attachment to scout.', value: 0},
        {id: roots, label: 'Dried ginseng roots', description: 'Food for Earth Communication Ear Grass.', value: 0},
        {id: petals, label: 'Moon orchid petals', description: 'Food for Moonglow Gu.', value: 0},
        {id: eyes, label: 'Lightning wolf eye', description: 'The alliance awards ten merit for each eye you hand in.', value: 0},
        {id: cachedEyes, label: 'Hidden lightning wolf eye', description: 'An eye put aside away from the board. It earns no merit while hidden.', value: 0},
        {id: merit, label: 'Battle merit', description: 'Credit on the alliance board. Exchange it for supplies or Gu the clans have made available.', value: 0}
    ],
    status: [status('alliance', 'The alliance terms'), status('concealment', 'Stealth Scales Gu'),
        status('merit', 'Your wolf quota'), status('ear', 'Earth Communication Ear Grass'),
        status('probe', 'The sealed passage'), status('tide', 'The storm')],
    commands: [
        act('hear_the_alliance_terms', 'Watch Qing Shu and hear the alliance terms', 35, predecessor,
            'After the crowd turns on you, watch Qing Shu use Wood Charm to beat Xiong Li at strength. Then hear the rules the clans have agreed to.',
            [event('merit_board', 'open'), set('alliance', 'rules_heard'),
                note('alliance', 'Wood Charm lets Qing Shu draw essence as he fights, but you know what prolonged use can do to the body. The clans ban killing each other, require surrender of Gu taken from dead Gu Masters, and pay ten merit per wolf eye.')]),
        act('exchange_black_boar', 'Settle your Fish Scale trade with Qing Shu', 10, done('hear_the_alliance_terms'),
            'Give him Black Boar Gu for Fish Scale Gu and forty stones. The strength you built with Black Boar stays with you.',
            [item(fish, 1), item(stone, 40), set('exchange', 'settled')],
            {atStart: [stock(boar)], costs: [item(boar, -1)]}),
        act('fuse_stealth_scales', 'Fuse Stealth Rock with Fish Scale', 60, done('exchange_black_boar'),
            'Set both Gu beside eighty stones and work in private. You need concealment that will cover clothes as well as skin.',
            [item(scales, 1), set('concealment', 'scales_refined'),
                note('concealment', 'Stealth Scales takes the place of both Gu. Ordinary wolves can lose sight of you. A crown wolf with Lightning Eye, or a creature that follows sound or heat, can still find you.')],
            {atStart: [stock(stealth), stock(fish), stoneCost(80)], costs: [item(stealth, -1), item(fish, -1), pay(80)]}),
        act('hunt_for_the_quota', 'Hunt alone, vanish when the wolves close, and turn in four eyes', 120, done('fuse_stealth_scales'),
            'Draw from twelve stones while you prepare, then use Moonglow and Stealth Scales to get through the hunt. Hand in just enough to meet the quota.',
            [recover(26), item(merit, 40), set('merit', 'solo_quota_met'),
                note('merit', 'The board credits forty merit for four eyes. Your one-person group is still at the bottom. You can buy food for your Gu without taking on companions.')],
            {needs: [stock(scales), stock(moonglow)], atStart: [stoneCost(12)], costs: [pay(12)]}),
        act('take_the_ear_grass', 'Return to the pillars and open the flower', 45, done('hunt_for_the_quota'),
            'Wait until the paths near the cave are quieter. Spend twelve parts clearing a small group of monkeys. Follow the stairs and look inside the Earth Treasury Flower.',
            [item(wildEar, 1), set('ear', 'grass_found'), set('cave', 'inner_door_closed'),
                note('ear', 'You take Earth Communication Ear Grass from the flower. Its roots can carry sounds from about three hundred paces when they reach the ground. The next stone door stays shut.')],
            {needs: [stock(scales), stock(moonglow)], parts: 12}),
        act('buy_ginseng_and_petals', 'Exchange thirty merit for ginseng and Moon Orchid petals', 10, done('take_the_ear_grass'),
            'Take roots for the new Gu and petals for Moonglow. Keep the cave door closed until you can use the grass.',
            [item(roots, 1), item(petals, 1)],
            {atStart: [stock(merit, 30)], costs: [item(merit, -30)]}),
        act('attach_the_ear_grass', 'Feed the Gu, replace your right ear and let it heal', 720, done('buy_ginseng_and_petals'),
            'Feed it the roots. In private, cut off the right ear, put the grass against the wound and wait for it to take. Remove the blood and what remains of the old ear.',
            [set('ear', 'right_ear_adapted'), note('ear', 'The roots grow into the wound. By the time you wake, the new ear looks ordinary. It can send roots out when you feed it essence.')],
            {needs: [stock(wildEar)], atStart: [stock(roots)], costs: [item(roots, -1), health(12)]}),
        act('probe_the_centipede_passage', 'Use the grass to listen and send a wounded deerling ahead', 30, done('attach_the_ear_grass'),
            'Put the roots against the stone and spend three parts listening. Use the deerling’s movement to draw out what is in the dark.',
            [set('cave', 'centipede_seen_door_closed'),
                note('probe', 'The centipedes take the deerling. You identify a Rank Three Chainsaw Golden Centipede. At your present stage, you close the door and put off the attempt.')],
            {needs: [stock(wildEar), field('ear', 'right_ear_adapted')], parts: 3}),
        act('draw_back_the_healthy_pack', 'Fight the healthy wolves, vanish and draw them back', 25, done('probe_the_centipede_passage'),
            'Spend eight parts across the first attacks and the concealment. Draw ten stones while you are hidden. Show yourself again once you have enough essence to use White Jade.',
            [recover(16), set('hunt', 'healthy_pack_broken')],
            {needs: [stock(scales), stock(jade), stock(moonglow)], atStart: [stoneCost(10)], costs: [pay(10)], parts: 8}),
        act('listen_then_collect_the_eyes', 'Listen through the soil before you take the eyes', 15, done('draw_back_the_healthy_pack'),
            'Spend three parts to put the ear’s roots into the ground. Take the eyes only when you hear no wolves or Gu Masters nearby.',
            [item(eyes, 8), set('hunt', 'eyes_collected')],
            {needs: [stock(wildEar), field('ear', 'right_ear_adapted'), field('hunt', 'healthy_pack_broken')], parts: 3}),
        act('declare_two_eyes', 'Turn in two eyes and hide the rest', 10, done('listen_then_collect_the_eyes'),
            'Take two eyes to the board and hide the other six. Taking the whole lot in at once would invite questions.',
            [item(merit, 20), item(cachedEyes, 6), set('hunt', 'eyes_split')],
            {atStart: [stock(eyes, 8)], costs: [item(eyes, -8)]}),
        act('run_ahead_of_the_tide', 'Check the ground once more and run toward the village', 15, done('declare_two_eyes'),
            'Spend three parts listening below the storm. Faint howls come from farther off than the roots can reach. Run while you still have a lead.',
            [set('tide', 'running_toward_village'), event('tide', 'true_wave_started'), event('peng', 'killed_during_wave'),
                note('tide', 'The storm is rising and there are more wolves out there than you can hear through the earth. You take the way back toward the village.')],
            {needs: [stock(wildEar), field('ear', 'right_ear_adapted')], parts: 3})
    ]
};

let installed;
export async function registerGuLeadEarGrass(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ALLIANCE_SLOPE && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadEarGrass, base);
    return installed;
}

const longJobs = new Set(guLeadEarGrass.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadEarGrassClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_EAR_GRASS);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
