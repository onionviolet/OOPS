// Qing Mao, volume two chapters 136–140.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_ICE_SOUL} from './book_gu_lead_ice_soul.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';

export const GU_LEAD_ICE_CRYSTAL = id('ice_crystal');
const local = name => `${GU_LEAD_ICE_CRYSTAL}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:f636738b7ff455bde8868e24f30ed661982eb1506093173141a78c69957b58da';
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
const plunder = local('plunder_gu');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const stamina = loss => ({type: 'vital', actor: 'player', key: 'stamina', amount: -loss});
const sea = id('primeval');
const reserve = value => ({fact: `energy.${sea}.reserve`, op: 'gte', value,
    reason: `Prepare ${value} parts of essence first.`});
const spend = output => ({type: 'energy', actor: 'player', energyId: sea, operation: 'use', output, control: 1});
const recover = amount => ({type: 'energy', actor: 'player', energyId: sea, operation: 'recover', amount});
const pay = amount => item(stone, -amount);
const stoneCost = amount => stock(stone, amount);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_ICE_SOUL)),
    eq(`completed.${GU_LEAD_ICE_SOUL}.watch_and_reconsider`),
    eq(`actor.${GU_LEAD_ICE_SOUL}.battle`, 'xiong_and_bai_fighting'),
    eq(`actor.${GU_LEAD_ICE_SOUL}.appraisal`, 'direct_fight_unfavorable'));
const admitted = eq(extensionFact(GU_LEAD_ICE_CRYSTAL));

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


export const guLeadIceCrystal = {
    schema: 1, id: GU_LEAD_ICE_CRYSTAL, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan waits for an opening in the wolf pack',
    description: 'Stay out of sight while the Xiong group fights. Keep Bai Ning Bing guessing where you are.',
    requires: all(ready, predecessor, moonglow, jade, scales),
    reason: 'Reach the ongoing fight with Moonglow, White Jade and Stealth Scales.',
    items: [{id: plunder, label: 'Plunder Gu', description: 'The Gu Bai Ning Bing threw down. Its use takes essence, and a failed plunder can hurt its user.', value: 0}],
    status: [status('pressure', 'The fight around Bai Ning Bing'), status('shield', 'The shield and the link'),
        status('plunder', 'Plunder Gu'), status('report', 'What you tell Qing Shu'), status('ice', 'The frozen path')],
    commands: [
        act('wait_for_a_retreat', 'Wait out the fight and draw from ten stones', 15, predecessor,
            'Let Bai Ning Bing keep looking for you while the Xiong fighters press him. Replenish your sea while you wait for him to break away.',
            [recover(36), set('pressure', 'bai_breaking_away'),
                note('pressure', 'An ice bird kills a Xiong fighter. Bai Ning Bing has spent a strong Gu attack and is trying to get clear. He still has to watch for you.')],
            {needs: [scales], atStart: [stoneCost(10)], costs: [pay(10)]}),
        act('help_close_the_formation', 'Cut off the retreat and close in with the Xiong fighters', 8, done('wait_for_a_retreat'),
            'Reveal yourself when he starts to slip away. Spend twelve parts on attacks that give the Xiong fighters room to close the formation.',
            [set('pressure', 'xiong_formation_closed'), note('pressure', 'They object at first, then begin to make room for your attacks. Bai Ning Bing cannot just run through the line.')],
            {needs: [moonglow, field('pressure', 'bai_breaking_away')], parts: 12}),
        act('watch_for_the_link', 'Watch the shield fail and look for the shadow link', 5, done('help_close_the_formation'),
            'The ice bird bursts too close for Water Shield to take its full force. Watch Xiong Li close for a finishing blow.',
            [event('xiong_li', 'killed_by_bai'), set('pressure', 'xiong_li_fell'), set('link', 'shadow_bond_active'),
                note('shield', 'The shield needs room to turn a blow aside. The bad arm was bait, and Bai Ning Bing kills Xiong Li with the frost. Xiong Jiang’s shadow now links him to Bai Ning Bing.')],
            {needs: [field('pressure', 'xiong_formation_closed')]}),
        act('strike_through_the_shadow', 'Strike Xiong Jiang while Shadow Bond links him to Bai', 4, done('watch_for_the_link'),
            'Spend ten parts on the opening. Go after Xiong Jiang rather than throw your blades into Bai Ning Bing’s shield.',
            [event('xiong_jiang', 'killed_by_fang_yuan'), set('link', 'harm_transferred'), set('pressure', 'bai_wounded_through_link'),
                note('shield', 'Xiong Jiang dies. Part of the injury reaches Bai Ning Bing through their linked shadows. He stumbles and pulls away. His recovery gives you little time.')],
            {needs: [moonglow, field('link', 'shadow_bond_active')], parts: 10}),
        act('take_plunder_in_the_pursuit', 'Catch and refine Plunder Gu during the pursuit', 8, done('strike_through_the_shadow'),
            'Spend eight parts in the pursuit and the quick refinement. Bai Ning Bing throws a Gu into your path. Catch it and work it into your aperture before you run on.',
            [item(plunder, 1), event('plunder_custody', 'held_by_fang_yuan'), set('pressure', 'distance_opened'),
                note('plunder', 'You keep Plunder Gu. Taking it gives him time to widen the gap. Without a movement Gu you may lose him as he recovers.')],
            {needs: [moonglow, field('pressure', 'bai_wounded_through_link')], parts: 8}),
        act('warn_qing_shu', 'Reach Qing Shu’s group and call out a warning', 8, done('take_plunder_in_the_pursuit'),
            'Keep going when you see the group ahead. Tell them Bai Ning Bing killed fighters from the Xiong Li and Man Shi groups. Fang Zheng is with them.',
            [set('report', 'accusation_made'), note('report', 'Qing Shu hears your account. Bai Ning Bing sees the group and realizes he may have to face them as well as you.')],
            {needs: [field('pressure', 'distance_opened')]}),
        act('test_the_ice', 'Try one blade against the ice and judge what it would take', 5, done('warn_qing_shu'),
            'Bai Ning Bing bursts the frost Gu and loses his right arm. He freezes himself into a crystal. Spend five parts testing the new barrier.',
            [event('frost_demon', 'destroyed'), event('bai_right_arm', 'lost_in_frost'), set('ice', 'crystal_resists'),
                note('ice', 'Your blade scratches the surface and the scar closes. Qing Shu says the crystal is protecting him. Breaking it would take too much time and essence.')],
            {needs: [moonglow, field('report', 'accusation_made')], parts: 5}),
        act('leave_the_frozen_path', 'Leave before the ice gives way', 20, done('test_the_ice'),
            'Tell the others you are leaving. Qing Shu looks ready to stay. Keep your Gu and leave before you have to fight beside them.',
            [set('ice', 'fang_yuan_withdrew'), event('bai_crystal', 'broken_out'), event('bai_cultivation', 'rank_three_released'),
                event('clan_elder', 'killed_by_bai'), event('qing_shu', 'wood_charm_activated'),
                note('ice', 'You leave them by the frozen path. You do not stay to see what happens when the ice breaks.')],
            {needs: [field('ice', 'crystal_resists')], costs: [stamina(4)]})
    ]
};

export async function registerGuLeadIceCrystal(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_ICE_SOUL && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadIceCrystal, base);
}
