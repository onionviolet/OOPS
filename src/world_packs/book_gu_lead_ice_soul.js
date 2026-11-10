// Qing Mao, volume two chapters 131–135.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_ICE_SOUL = id('ice_soul');
const local = name => `${GU_LEAD_ICE_SOUL}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:29f33a1bbc70882bbe6785e8d90ad4a28a44e5c50805dd7ae86b20fc96df8408';
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
const moonglow = stock(`${GU_LEAD_MOONGLOW}.moonglow_gu`);
const jade = stock(`${GU_LEAD_WHITE_JADE}.white_jade_gu`);
const scales = stock(`${GU_LEAD_EAR_GRASS}.stealth_scales_gu`);
const ear = stock(`${GU_LEAD_EAR_GRASS}.earth_ear_grass`);
const adapted = eq(`actor.${GU_LEAD_EAR_GRASS}.ear`, 'right_ear_adapted');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const stamina = loss => ({type: 'vital', actor: 'player', key: 'stamina', amount: -loss});
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
const predecessor = all(eq(extensionFact(GU_LEAD_EAR_GRASS)),
    eq(`completed.${GU_LEAD_EAR_GRASS}.run_ahead_of_the_tide`),
    eq(`actor.${GU_LEAD_EAR_GRASS}.tide`, 'running_toward_village'),
    eq(`world.${GU_LEAD_EAR_GRASS}.tide`, 'true_wave_started'));
const admitted = eq(extensionFact(GU_LEAD_ICE_SOUL));

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

export const guLeadIceSoul = {
    schema: 1, id: GU_LEAD_ICE_SOUL, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan works the first days of the wolf tide',
    description: 'Reach the village, then decide what the merit board makes worth risking.',
    requires: all(ready, predecessor, ear, adapted, scales, moonglow, jade),
    reason: 'Return ahead of the first wave with your Gu ready.',
    status: [status('storm', 'The first night'), status('board', 'The resource board'), status('target', 'Man Shi’s group'),
        status('pursuit', 'Bai Ning Bing’s pursuit'), status('battle', 'The fight in the pack'),
        status('appraisal', 'What you make of Bai Ning Bing')],
    commands: [
        act('stay_in_the_inn', 'Reach the village and sit out the first sortie', 720, predecessor,
            'Stay at the inn while the clan sends Gu Masters into the storm. Wait until you can see what came back.',
            [set('storm', 'first_sortie_avoided'), note('storm', 'By morning, twenty-five groups have disappeared from the board. The losses tell you more about the storm than the clan’s orders did.')]),
        act('work_the_wolf_tide', 'Scout the packs and keep clear of the larger ones', 180, done('stay_in_the_inn'),
            'Use the ear and Stealth Scales on the routes you can work. Spend eight parts on the trips and sixteen stones on recovery between them.',
            [recover(18), set('storm', 'packs_escalating'),
                note('storm', 'Over the next days you work the smaller packs. Bold wolves and then frenzy wolves appear. More groups disappear from the board.')],
            {needs: [ear, adapted, scales, moonglow], atStart: [stoneCost(16)], costs: [pay(16)], parts: 8}),
        act('read_the_resource_board', 'Check what the board asks for Three Step Fragrant Grass', 20, done('work_the_wolf_tide'),
            'One wolf eye buys ten merit, and one stone costs twenty-five. Look at the single movement Gu on offer. Too many declared eyes would invite attention, and another buyer could get there before your leaves sell.',
            [set('board', 'movement_gu_sought'), event('xiong_zhan', 'killed_after_plunder_backlash'),
                event('plunder', 'held_by_bai'), event('first_witnesses', 'killed_by_bai'),
                note('board', 'Three Step Fragrant Grass could give you the speed you need. Merit is what the board takes, but its buying power could fall. Turning in a recovered Gu would pay more than ordinary eyes.')]),
        act('choose_man_shis_group', 'Scout an exposed group and choose where to lead the pack', 30, done('read_the_resource_board'),
            'Spend three parts listening through the roots. Pass over groups that might hear you or have an elder watching. Man Shi’s group is already struggling and has a Monolith Gu worth turning in.',
            [set('target', 'man_shi_selected'), note('target', 'You choose Man Shi’s group. You hope to turn in its Gu after the wolves overwhelm it. The Gu is still his.')],
            {needs: [ear, adapted, field('board', 'movement_gu_sought')], parts: 3}),
        act('lure_the_bold_pack', 'Lead the bold wolf and its pack into Man Shi’s fight', 15, done('choose_man_shis_group'),
            'Spend six parts getting the pack’s attention and drawing it toward the group. Take cover before the two fights become one.',
            [set('target', 'pack_lured'), note('target', 'The wolves close on Man Shi’s group. You wait for a chance to recover the Gu. Someone has spotted you.')],
            {needs: [scales, moonglow, field('target', 'man_shi_selected')], parts: 6}),
        act('escape_bai_through_the_pack', 'Run through the wolves under White Jade and vanish', 10, done('lure_the_bold_pack'),
            'Bai Ning Bing wants a fight. Run through the pack instead. Spend thirteen parts protecting yourself from the bites and slipping from sight.',
            [set('pursuit', 'vanished_near_wolves'), event('man_shi', 'killed_by_bai'),
                note('pursuit', 'The wolves slow him long enough for you to disappear. He claims he killed a Xiong Gu Master. You lose sight of him near the trapped Gu Yue group and recover nothing.')],
            {needs: [jade, scales, field('target', 'pack_lured')], parts: 13, costs: [health(5)]}),
        act('redirect_bai_toward_xiong', 'Lead Bai Ning Bing to Xiong Li and call out about Plunder', 10, done('escape_bai_through_the_pack'),
            'Run toward the Xiong group. Tell them you saw Plunder Gu on him and say he is killing witnesses. Leave them to decide what to make of it.',
            [set('pursuit', 'redirected_to_xiong'), note('pursuit', 'Xiong Li hears your accusation. The group turns on Bai Ning Bing while wolves are still around them.')],
            {needs: [field('pursuit', 'vanished_near_wolves')], costs: [stamina(5)]}),
        act('watch_and_reconsider', 'Watch the fight from outside the pack', 15, done('redirect_bai_toward_xiong'),
            'Watch how quickly Bai Ning Bing recovers and which Gu he holds back. Weigh what you remember about his body against what you see now.',
            [set('battle', 'xiong_and_bai_fighting'), set('appraisal', 'direct_fight_unfavorable'),
                note('battle', 'The Xiong fighters still cannot match him, even after the fighting he has already done. The fight is still going.'),
                note('appraisal', 'You recognize Northern Dark Ice Soul. A full aperture gives him extraordinary reserves and puts him in danger of collapse. He dilutes his essence and holds back stronger Gu. You would lose a direct fight. You consider a way around him.')],
            {needs: [field('pursuit', 'redirected_to_xiong')]})
    ]
};

let installed;
export async function registerGuLeadIceSoul(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_EAR_GRASS && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadIceSoul, base);
    return installed;
}

const longJobs = new Set(guLeadIceSoul.commands.filter(command => command.duration >= 120).map(command => command.id));
export function guLeadIceSoulClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_ICE_SOUL);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.has(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
