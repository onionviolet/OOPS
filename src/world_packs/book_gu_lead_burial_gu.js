// Qing Mao, volume two chapters 150–152.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_EAR_GRASS} from './book_gu_lead_ear_grass.js';
import {GU_LEAD_ICE_CRYSTAL} from './book_gu_lead_ice_crystal.js';
import {GU_LEAD_MOONGLOW} from './book_gu_lead_moonglow.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_WOOD_CHARM} from './book_gu_lead_wood_charm.js';
import {GU_LEAD_WALL_NIGHT} from './book_gu_lead_wall_night.js';

export const GU_LEAD_BURIAL_GU = id('burial_gu');
const local = name => `${GU_LEAD_BURIAL_GU}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:aa002f161e9a739225b73296c069db2b534793c4275b9fe583c7bb803e718d3b';
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
const merit = `${GU_LEAD_EAR_GRASS}.merit`;
const moonglow = stock(`${GU_LEAD_MOONGLOW}.moonglow_gu`);
const jade = stock(`${GU_LEAD_WHITE_JADE}.white_jade_gu`);
const shield = stock(`${GU_LEAD_WOOD_CHARM}.water_shield_gu`);
const scales = stock(`${GU_LEAD_EAR_GRASS}.stealth_scales_gu`);
const plunder = stock(`${GU_LEAD_ICE_CRYSTAL}.plunder_gu`);
const bearGu = stock(`${GU_LEAD_WALL_NIGHT}.bear_enslavement_gu`);
const taken = local('yao_le_gu');
const burial = local('man_beast_life_burial_gu');
const event = (name, value) => ({type: 'fact', actor: 'player', scope: 'world', key: local(name), value});
const health = loss => ({type: 'vital', actor: 'player', key: 'health', amount: -loss});
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
const predecessor = all(eq(extensionFact(GU_LEAD_WALL_NIGHT)),
    eq(`completed.${GU_LEAD_WALL_NIGHT}.rotate_back_until_ten`),
    eq(`actor.${GU_LEAD_WALL_NIGHT}.wall`, 'five_entries_by_ten_battle_continues'));
const admitted = eq(extensionFact(GU_LEAD_BURIAL_GU));

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

// Authored dials (labelled in the private receipt): essence per step (4, 4, 8, 28), the 8 stones that refill 30 parts,
// the 800 merit that buys the Charcoal, Kerosene and poison Gu, the 6 health lost in the fall, minutes per step, and
// the 12 stones that refill 44 parts of white silver essence. The 1,000 stones thrown into the light are sourced.
// Yao Ji's search and the new elder meeting are other people's scenes and stay world facts.
export const guLeadBurialGu = {
    schema: 1, id: GU_LEAD_BURIAL_GU, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan pushes through to Rank Three',
    description: 'The frenzy wolves reach the wall. You take Yao Le out of the fight and use the recipe you remember.',
    requires: all(ready, predecessor, moonglow, jade, shield, scales, plunder, bearGu, stoneCost(1030)),
    reason: 'Keep your Gu, your Bear Enslavement Gu and about a thousand stones.',
    items: [
        {id: taken, label: 'Gu taken from Yao Le', description: 'Every Gu she carried, refined as your own. No list was kept.', value: 0},
        {id: burial, label: 'Man-beast Life Burial Gu', description: 'Rank Three. It can lift a Rank Two Gu Master past the barrier. The essence it leaves keeps a trace of black red.', value: 0}
    ],
    status: [status('tower', 'The tower'), status('wolves', 'The frenzy wolves'), status('gate', 'The east gate'),
        status('yao_le', 'Yao Le'), status('recipe', 'The Life Burial recipe'), status('rank', 'Your aperture')],
    commands: [
        act('throw_moonblades_from_the_tower', 'Throw Moonblades from the tower', 30, predecessor,
            'Stand with the Gu Masters on a stone tower. Wolf bodies pile in the traps and the towers do most of the killing. Spend four parts.',
            [set('tower', 'moonblades_thrown'), note('tower', 'The towers and the Gu Masters on them kill most of the bold wolves. You throw a few Moonblades and watch the field. The three frenzy wolves wait behind the pack.')],
            {needs: [moonglow], parts: 4}),
        act('take_the_thunderball', 'Take a frenzy wolf’s thunderball on the tower', 10, done('throw_moonblades_from_the_tower'),
            'One frenzy wolf lets out a thunderball the size of a millstone. Put up Water Shield and White Jade.',
            [set('tower', 'tower_broken_fang_yuan_alone'), set('defence_gu', 'dulled_and_fragile'), event('tower', 'half_destroyed_gu_masters_dead'),
                note('tower', 'The shield goes in two breaths. You are thrown off the tower. Everyone else on it is dead and the wall is open. Both Gu look dull and will not take many more hits.')],
            {needs: [field('tower', 'moonblades_thrown'), shield, jade], costs: [health(6)]}),
        act('watch_the_frenzy_wolves', 'Watch the three frenzy wolves from a corner of the field', 20, done('take_the_thunderball'),
            'A second thunderball follows, then elders arrive. Stay out of the fight and see what each wolf carries.',
            [set('wolves', 'three_wolves_read'), event('elders', 'nine_elders_fighting_three_frenzy_wolves'),
                note('wolves', 'Nine elders fight the three wolves. One wolf carries two Thunderclap Gu, one Thunder Wings, one Thunder Roar. A thousand beast king carries three or four Rank Two Gu and one Rank Three. The elders will win it in time.')],
            {needs: [field('tower', 'tower_broken_fang_yuan_alone')]}),
        act('see_the_east_gate_break', 'Watch the east gate give way', 10, done('watch_the_frenzy_wolves'),
            'A fourth wolf swells to the size of an elephant. You think it carried an Aura Restraint Gu and hid in the pack. Yao Le is at that gate.',
            [set('gate', 'fourth_wolf_through_the_gate'), event('east_gate', 'smashed_by_fourth_frenzy_wolf'),
                event('xiong_jiao_man', 'last_bear_killed_and_thrown_by_a_roar'), event('yao_le', 'thrown_outside_the_village'),
                event('yao_ji', 'rushed_to_the_gate_and_poisoned_the_wolf'),
                note('gate', 'You see the gate smashed and the elders turn too late. Yao Ji runs for it. You cannot see what happens inside. Only an Aura Restraint Gu in the wolf would explain how it got so close unseen, but you have not seen the Gu.')],
            {needs: [field('wolves', 'three_wolves_read')]}),
        act('guide_yao_le_out_of_the_fight', 'Guide Yao Le away from the wolves with your voice and Moonblades', 25, done('see_the_east_gate_break'),
            'Find her outside the gate. Tell her where to step and cover her with Moonblades. Spend four parts. Take her far from the village.',
            [set('yao_le', 'led_to_a_remote_forest'), note('yao_le', 'She follows your voice without knowing whose it is. In the forest she sees you and asks if you helped her. You tell her you are only helping yourself.')],
            {needs: [field('gate', 'fourth_wolf_through_the_gate'), moonglow], parts: 4}),
        act('take_her_to_the_cave', 'Knock her out, hide with Stealth Scales and draw from stones', 30, done('guide_yao_le_out_of_the_fight'),
            'Carry her unseen to a cave. Pay eight stones to refill part of your sea.',
            [recover(30), set('yao_le', 'tied_in_a_cave'), set('cave', 'ready'),
                note('yao_le', 'She wakes tied to a rock in a dark cave. She does not know why you took her.')],
            {needs: [field('yao_le', 'led_to_a_remote_forest'), scales], atStart: [stoneCost(8)], costs: [pay(8)]}),
        act('take_her_gu_with_plunder', 'Use Plunder on every Gu she carries', 10, done('take_her_to_the_cave'),
            'Spend eight parts. Refine what you take as your own.',
            [item(taken, 1), set('plunder', 'her_gu_taken'), note('recipe', 'Her Gu are yours. She has nothing left to defend herself with.')],
            {needs: [plunder, field('cave', 'ready')], parts: 8}),
        act('let_the_bear_finish_the_recipe', 'Let a wild bear do what the recipe asks', 60, done('take_her_gu_with_plunder'),
            'You enslaved a wild black bear in the wolf tide. The recipe needs a girl with an aptitude, fed whole to a flesh-eating beast. Keep it at the work until nothing is left.',
            [set('yao_le', 'dead_in_the_cave'), event('yao_le', 'killed_by_fang_yuan_for_the_recipe'), set('recipe', 'bear_fed'),
                note('recipe', 'Yao Le does not leave the cave alive. You hold the bear to the work until the recipe is satisfied. You feel nothing about it.')],
            {needs: [field('plunder', 'her_gu_taken'), bearGu]}),
        act('burn_the_materials_into_a_gu', 'Burn the bear, add the Gu and a thousand stones', 40, done('let_the_bear_finish_the_recipe'),
            'Burn the bear from inside with a Charcoal Gu and three Kerosene Gu. Add more Gu bought with eight hundred merit, then a Rank Two poison Gu, and feed the light a thousand stones.',
            [item(burial, 1), pay(1000), item(merit, -800), set('recipe', 'life_burial_gu_refined'),
                note('recipe', 'The fire burns blood red. The light takes the stones and shrinks to a Rank Three Gu with a bear’s head and a face on its back. You do not mind the face.')],
            {needs: [field('recipe', 'bear_fed')], atStart: [stoneCost(1000), stock(merit, 800)]}),
        act('swallow_the_gu_and_break_through', 'Swallow it and break the aperture wall', 30, done('burn_the_materials_into_a_gu'),
            'The black-red water turns all your essence the same colour. Break the wall with a little over a third of it, then force the rest out before it fouls the new wall. Spend all twenty-eight parts.',
            [item(burial, -1), set('aperture_stage', 'rank_three_initial'), set('rank', 'wall_broken_essence_expelled'),
                note('rank', 'The white crystal wall breaks and a round light membrane takes its place. You are Rank Three. You drive out the black-red essence that is left, because it would spoil the wall.')],
            {needs: [stock(burial), field('recipe', 'life_burial_gu_refined')], parts: 28}),
        act('form_white_silver_essence', 'Draw from a stone and re-form your sea', 40, done('swallow_the_gu_and_break_through'),
            'Pay twelve stones. Form the new white silver essence and expel it again until the black-red is nearly gone.',
            [recover(44), set('reserve_grade', 'rank_three_trace'), set('rank', 'rank_three_white_silver_with_trace'),
                event('cleansing_water_gu', 'bought_by_the_chi_faction'), event('yao_ji', 'searching_three_days_and_suspecting_fang_yuan'),
                event('elder_meeting', 'called_to_confirm_the_new_rank_three'),
                note('rank', 'Your sea is white silver with a trace of black red that will not leave. The Cleansing Water Gu that could wash it out was bought by the Chi faction.')],
            {needs: [field('rank', 'wall_broken_essence_expelled')], atStart: [stoneCost(12)], costs: [pay(12)]})
    ]
};

export async function registerGuLeadBurialGu(register, base) {
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_WALL_NIGHT && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    return register.extension(guLeadBurialGu, base);
}
