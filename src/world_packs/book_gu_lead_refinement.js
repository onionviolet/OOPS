// Volume one, chapters 8–10: the storm drives Fang Yuan indoors.
// The Moonlight Gu keeps its will and remains the same carried specimen.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_SELECTION, leadMoonlightKey} from './book_gu_lead_selection.js';

export const GU_LEAD_REFINEMENT = id('refinement');
const ref = name => `${GU_LEAD_REFINEMENT}.${name}`;
const key = name => JSON.stringify({id: ref(name)});
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const world = id('world');
const academy = id('academy');
const home = id('home');
const essence = id('primeval');
const storm = ref('storm_wait');
const rain = ref('rain');
const stormDuration = 3 * 1440;
const traceDuration = 6 * 60;
const stone = key('primeval_stone');
const drawnStone = key('drawn_stone');
const wine = key('search_wine');
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const completed = name => eq(`completed.${ref(name)}`);
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: ref(name), stage: 'understood', value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const admitted = eq(extensionFact(GU_LEAD_REFINEMENT));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`faculty.${id('aperture')}.active`, true, 'You need to be able to move your primeval essence.'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'));
const hasMoonlight = eq(`item.${leadMoonlightKey}`, 1, 'You need the Moonlight Gu you chose from the Gu room in your bag.');
const hasSelection = all(eq(extensionFact(GU_LEAD_SELECTION)), eq(`completed.${GU_LEAD_SELECTION}.take_moonlight`),
    eq(`knowledge.${GU_LEAD_SELECTION}.chosen.seen`), hasMoonlight);

function act(name, label, location, duration, visibleWhen, needs, description, effects, extra = {}) {
    const support = all(ready, hasSelection, admitted, visibleWhen, eq('actor.location', location));
    return {
        id: ref(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location, audience: ['$actor'], once: true,
        duration, visibleWhen: all(admitted, visibleWhen), requires: all(support, ...needs),
        completionRequires: support, completionCoLocated: true, cancellation: 'refund',
        completionFailure: 'refund', reservationReturns: 1, costs: [], effects, ...extra
    };
}

export const guLeadRefinement = {
    schema: 1, id: GU_LEAD_REFINEMENT, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'the first Moonlight Gu attempt',
    description: 'Take your Moonlight Gu home. A storm cuts off the search outside the village and gives you time to try refining it.',
    requires: all(ready, hasSelection, eq('actor.location', academy)),
    reason: 'Choose your Moonlight Gu and keep it in your bag at the academy.',
    items: [
        {id: ref('primeval_stone'), label: 'Primeval stone', description: 'Condensed primeval essence. You can draw it into your aperture.', value: 0},
        {id: ref('drawn_stone'), label: 'Primeval stone · partly drawn', description: 'You have drawn essence from this stone. Some essence remains.', value: 0},
        {id: ref('search_wine'), label: 'Jar of aged wine', description: 'Its scent can draw a Liquor Worm when the weather holds.', value: 0}
    ],
    status: [
        {id: ref('household_status'), label: 'Your uncle’s offer', knowledgeKey: ref('household')},
        {id: ref('rain_status'), label: 'The night search', knowledgeKey: rain},
        {id: ref('attempt_status'), label: 'First attempt', knowledgeKey: ref('attempt')},
        {id: ref('recovery_status'), label: 'Drawing from a stone', knowledgeKey: ref('recovery')}
    ],
    commands: [
        act('go_home', 'Go home with Fang Zheng', academy, 120, hasSelection, [],
            'Stop at the tavern and put the last of your old savings toward two jars of wine. Fang Zheng calls you home to speak with your aunt and uncle. Hear them out and keep your claim to your parents’ inheritance.',
            [{type: 'relocate', actor: 'player', location: home}, item(wine, 2), item(stone, 6),
                note('household', 'Your uncle gives you six primeval stones for refining Gu. Fang Zheng agrees to be adopted. You turn down the adoption and the separate offer of two hundred stones.')]),
        act('search', 'Search the outskirts with wine', home, 360, completed('go_home'),
            [{fact: `item.${wine}`, op: 'gte', value: 2, reason: 'Bring both jars from the tavern.'}],
            'Carry two jars of wine past the village gate. Open them where the scent can travel and watch for the Liquor Worm. A downpour can wash out the trail.',
            [note('rain', 'Rain washes away the scent before anything comes. You leave the outskirts and take shelter at your guardians’ house.')],
            {costs: [item(wine, -2)]}),
        act('storm_wait', 'Sit out the mountain rain', home, stormDuration, completed('search'), [],
            'Pass the three days of rain. The downpour keeps washing away any scent outside. If you stop, the time already passed still counts.',
            [note('shelter', 'Rain drums on the bamboo roof. You close the window and set the Moonlight Gu in your palm.')],
            {durationSinceKnowledge: rain}),
        act('infuse', 'Press essence into the Moonlight Gu', home, 30, completed('storm_wait'),
            [eq(`energy.${essence}.reserve`, 44, 'Begin with your primeval sea full at 44 parts.')],
            'Set aside 30 parts of primeval essence for a half-hour attempt. The Gu has a will of its own. If you stop before the attempt finishes, the reserved essence returns to your sea.',
            [note('attempt', 'The blue crescent shakes in your palm. Green reaches inward from its tips and covers about a twelfth when you break the flow. You spent 30 parts of essence and have 14 left. The Gu keeps its will and starts pushing the essence out.')],
            {costs: [{type: 'energy', actor: 'player', energyId: essence, operation: 'use', output: 30, control: 1}]}),
        act('draw_stone', 'Draw essence from a primeval stone', home, 30, completed('infuse'),
            [eq(`energy.${essence}.reserve`, 14, 'Draw from a stone after you spend 30 parts on the Moonlight Gu.'),
                {fact: `item.${stone}`, op: 'gte', value: 1, reason: 'Keep one untouched primeval stone in your bag.'}],
            'Set aside one primeval stone for half an hour. Draw 30 parts of essence from it and keep the partly drawn stone. The Gu keeps pushing out your essence while you work.',
            [{type: 'energy', actor: 'player', energyId: essence, operation: 'recover', amount: 30}, item(drawnStone, 1),
                note('recovery', 'Your primeval sea is full again at 44 parts. The Moonlight Gu is still unrefined. Outside, the rain is easing.')],
            {costs: [item(stone, -1)]})
    ]
};

let installed;
export async function registerGuLeadRefinement(register, base) {
    installed = null;
    if(!register.extension || base.contentHash !== baseHash || !base.extensions?.some(e => e.id === GU_LEAD_SELECTION)) return null;
    installed = await register.extension(guLeadRefinement, base);
    return installed;
}

export function guLeadRefinementClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if(!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_REFINEMENT);
    if(!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId.startsWith(GU_LEAD_REFINEMENT + '.'));
    const work = extension.commands.find(c => c.id === job?.commandId);
    if(!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || !work || job.completionSupport?.location !== work.location ||
        pupil.location !== work.location || work.duration <= 30) return null;
    const remaining = job.due - state.clock;
    const pace = work.id === storm ? 120 : 30;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= work.duration ? Math.min(pace, remaining) : null;
}

export function guLeadRefinementStatus(state, record, context) {
    if(record?.packId !== GU_LEAD || !record.extensions?.some(pin => pin.id === GU_LEAD_REFINEMENT)) return [];
    const s = state.simulation, energy = s.energies.player?.[essence], attempt = s.knowledge.player?.[ref('attempt')];
    const bag = context.gameplay?.player?.inventory;
    const facts = state.actors.player.facts;
    const latest = record.extensions.findLast(pin =>
        Object.hasOwn(facts, pin.id + '.condensed_parts') || Object.hasOwn(facts, pin.id + '.reserve_grade'));
    const stronger = latest && facts[latest.id + '.condensed_parts'];
    const grade = latest && facts[latest.id + '.reserve_grade'];
    const total = energy && `${energy.reserve} of ${energy.policy.capacity} parts`;
    const rows = energy ? [{label: 'Primeval sea', value: grade === 'peak' ? `${total} · black green` :
        grade === 'upper' ? `${total} · dark green` : grade === 'rank_two_middle' ? `${total} · scarlet red` : grade === 'rank_two_initial'
        ? `${total} · pale red` : grade === 'rank_two_condensed' ? `${energy.reserve + stronger} of ${energy.policy.capacity} parts · ${energy.reserve} scarlet, ${stronger} upper-stage` : grade === 'rank_two_peak_essence' ? `${total} · dark red` : grade === 'rank_two_mixed'
        ? `${total} · black green and pale red` : grade === 'rank_three_pure' ? `${total} · white silver` : grade === 'rank_three_trace' ? `${total} · white silver with a trace of black red` : stronger === undefined
        ? total : `${energy.reserve + stronger} of ${energy.policy.capacity} parts · ${energy.reserve} ordinary, ${stronger} stronger`}] : [];
    if(!attempt || !bag?.[leadMoonlightKey]) return rows;
    const remaining = Math.max(0, attempt.at + traceDuration - state.clock);
    rows.push({label: 'Moonlight Gu in your bag', value: remaining
        ? `Unrefined. The green trace is fading. About ${remaining} played minute${remaining === 1 ? '' : 's'} until the Gu pushes it all out.`
        : 'Unrefined. The Gu has pushed out the last of the green trace.'});
    return rows;
}
