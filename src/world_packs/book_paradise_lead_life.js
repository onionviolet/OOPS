// NS01 primary opening notes C01/C02; direct held English MTL ch1 p45–77,
// ch2 p1–84, ch3 p1–35. Edition drift is retained in the source receipt.
import {windowKit} from '../window_chain.js';
export const PARADISE_LEAD = 'book.su.lead';
export const paradiseLeadId = n => `${PARADISE_LEAD}.${n}`;
const id = paradiseLeadId, kit = windowKit({prefix: PARADISE_LEAD});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const state = value => eq(`actor.${id('stage')}`, value);
const set = (key, value) => kit.set(key, value);
const note = (key, value) => ({type: 'knowledge', actor: 'player', key: id(key), stage: 'understood', value});
const body = (key, value) => ({type: 'body', actor: 'player', key, value});
const ready = {all: [eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player')]};
const move = place => ({type: 'relocate', actor: 'player', location: id(place)});
function act(name, label, place, stage, description, locator, effects, extra = {}) {
    return {id: id(name), revision: 1, label, description, group: 'structured_local',
        worldId: id('world'), actorId: 'player', location: id(place), audience: ['$actor'], once: true,
        duration: 0, costs: [], requires: {all: [ready, state(stage),
            ...(['offer', 'answered'].includes(stage) ? [{fact: `situation.${id('recruitment_time')}.responseOpen`, op: 'eq', value: true, reason: 'The time offered before treatment has run out.'}] : [])]}, visibleWhen: state(stage),
        source: {kind: 'source-paraphrase', locator, timing: 'Dialogue and notices are instant; one-minute panel readings are authored and use the running trial clock.'},
        effects, ...extra};
}
const situation = (name, label, minutes) => ({id: id(name), revision: 1, label,
    context: {worldId: id('world'), instanceId: id('opening'), continuityId: id('opening'), eraId: id('first_trial'), regionId: id('goa')},
    participants: ['player'], initialPhase: 'open', phases: ['open'], privateTruth: {scope: 'opening'}, responseWindow: minutes});
export const paradiseLeadLife = {
    schema: 2, id: PARADISE_LEAD, revision: 1, title: 'Reincarnation Paradise · Su Xiao',
    description: 'You are Su Xiao. A message in the darkness offered a contract or death. Your answers and the steps you have taken are recorded below.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['jobs'],
    world: {id: id('world'), label: 'Reincarnation Paradise · Su Xiao’s trial'},
    locations: [
        {id: id('recruitment'), label: 'Dark recruitment space', underRoof: true,
            description: 'Pale text hangs in the darkness. This is where you received the offer of a contract or death.'},
        {id: id('house'), label: 'Ruined house in the Gray Terminal', underRoof: false,
            description: 'Dusty cobwebs hang overhead. Debris blocks the door and windows; the half-collapsed roof offers a way out.'}
    ],
    starts: [{id: id('start'), locationId: id('recruitment'),
        description: 'You are Su Xiao. Your heart is still beating despite the wounds in your chest and calf. A message says you will die without a contract. Your family knife is missing.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true,
            chestWounded: true, calfWounded: true},
        effects: [{type: 'situation', situationId: id('recruitment_time'), operation: 'begin'}, set('stage', 'offer'), set('name', 'Su Xiao'),
            note('opening', 'When you arrived here, you were alive rather than resurrected, with grave wounds. The message set a limit of about an hour and thirty-five minutes, threatening death without a contract.'),
            note('means', 'Your family knife is missing. You have received no weapon, money, office or trial reward.')]}],
    simulation: {people: [], energies: [], situations: [situation('recruitment_time', 'Time before treatment', 95), situation('trial_time', 'The issued Hunter trial', 4320)], commands: [
        act('inspect_wounds', 'Check your wounds and heartbeat', 'recruitment', 'offer',
            'Check your own body before answering. This does not treat the injuries.', 'MTL ch1 p45–61',
            [note('wounds', 'Your heart is beating. Your chest and calf are badly wounded, though they are not bleeding here. The countdown is keeping you alive for now.')]),
        act('ask_knife', 'Ask where your family knife is', 'recruitment', 'offer',
            'Ask about the keepsake you were carrying. Do not assume it came with you.', 'MTL ch1 p62–65',
            [note('knife_answer', 'The message says objects from your world cannot be brought here. Your family knife has not been returned to you.')]),
        act('ask_terms', 'Ask what a Hunter must do', 'recruitment', 'offer',
            'Ask about the work and the Hunter role before you sign. The answer ends the questions.', 'NS01-C01; MTL ch2 p3–7',
            [set('stage', 'answered'), note('terms', 'Contractors perform tasks for rewards. Hunters have additional assignments against designated offenders. The message says it will answer no more questions: sign, or wait for death.')]),
        act('sign_now', 'Sign before asking more', 'recruitment', 'offer',
            'Take the contract under the threat of death. You will not receive the unanswered explanations first.', 'Authored untaken response at NS01-C01 / MTL ch2 p7–17',
            [set('stage', 'signed'), set('signed_without_terms', true), note('agreement', 'You signed before asking about the Hunter’s duties. At that moment your wounds still needed treatment. This was a choice under threat of death, not a free offer.')]),
        act('sign', 'Sign the contract', 'recruitment', 'answered',
            'Press your thumb to the parchment. The alternative given to you is death.', 'NS01-C01; MTL ch2 p9–17',
            [set('stage', 'signed'), note('agreement', 'You pressed your thumb to the contract. At that moment your wounds still needed treatment.')]),
        act('treatment', 'Let the treatment finish', 'recruitment', 'signed',
            'The green light closes around your existing body. This is treatment, not a replacement body.', 'MTL ch2 p17–19',
            [body('chestWounded', false), body('calfWounded', false), set('stage', 'treated'),
                note('treatment', 'The treatment has closed the wounds in your chest and calf. You remain in the same body.')]),
        act('awakening', 'Endure the forced awakening', 'recruitment', 'treated',
            'A sudden pain follows the treatment. You were not offered a separate choice about awakening.', 'MTL ch2 p19–26',
            [set('stage', 'awakened'), set('talent_awakened', true),
                note('awakening', 'The pain passes. Something already within your body has awakened. The displayed information is an aid; a fatal injury to an organ can still kill you.')]),
        act('transfer', 'Open your eyes after the transfer', 'recruitment', 'awakened',
            'The transfer takes you to the trial world. This does not complete any part of the mission.', 'MTL ch2 p29–39',
            [move('house'), {type: 'situation', situationId: id('trial_time'), operation: 'begin'}, set('stage', 'arrival'),
                note('arrival', 'You wake in a small ruined house buried in rubbish. The door and windows are blocked. A black sword-shaped mark has appeared on your arm.'),
                note('issued', 'The world notice has appeared. Your trial has begun; reading its details later does not restart its time limit.')]),
        act('read_arrival', 'Read the world notice', 'house', 'arrival',
            'Read the task, regional warning and language notice that appeared in your sight.', 'NS01-C02; MTL ch2 p40–50',
            [set('stage', 'brand'), note('world_notice', 'The notice names the Kingdom of Goa and a task to kill its king. It warns against revealing Paradise or leaving the kingdom, and grants three days of understanding the local language. The trial countdown has begun.')]),
        act('open_brand', 'Open the mark’s menu', 'house', 'brand',
            'Call up the mark with a thought. Personal information and tasks are available; inventory, skills and equipment are locked.', 'MTL ch2 p60–69',
            [set('stage', 'panels'), note('brand', 'You can open Personal Information and Tasks. Inventory, Skills and Equipment are unavailable. The mark has not supplied a weapon.')]),
        act('read_trial', 'Read the 72-hour trial', 'house', 'panels',
            'Spend one minute reading the actual target and time limit before planning a route.', 'NS01-C02; MTL ch2 p70–83',
            [set('trial_received', true), note('trial', 'Kill Philip Herbert, king of Goa, within 72 hours. The notice places him in the palace. Completion earns the Hunter identity. You have not completed the trial or learned a route into the palace.')],
            {duration: 1, completionCoLocated: true, cancellation: 'refund', completionFailure: 'refund',
                requires: {all: [ready, state('panels'), eq(`actor.${id('trial_received')}`, false)]},
                visibleWhen: {all: [state('panels'), eq(`actor.${id('trial_received')}`, false)]}}),
        act('read_personal', 'Read your personal information', 'house', 'panels',
            'Spend one minute checking the mark’s account of your body and awakened talent. You can read this before or after the task.', 'NS01-C03; MTL ch3 p1–17',
            [set('personal_read', true), note('personal', 'Your mark names Su Xiao and shows a healthy body. It describes Soul Eater as gaining mana from defeated enemies, with a stated limit for each world. Reading it has not granted a kill, mana, coins or sword training.')],
            {duration: 1, completionCoLocated: true, cancellation: 'refund', completionFailure: 'refund',
                requires: {all: [ready, state('panels'), eq(`actor.${id('personal_read')}`, false)]},
                visibleWhen: {all: [state('panels'), eq(`actor.${id('personal_read')}`, false)]}})
    ]},
    presentation: {people: {}, status: [
        ['opening', 'Your situation'], ['knife_answer', 'Your missing knife'], ['terms', 'Hunter duties'],
        ['agreement', 'Contract'], ['treatment', 'Your wounds'], ['awakening', 'Awakening'],
        ['arrival', 'Arrival'], ['world_notice', 'World notice'], ['brand', 'The mark'], ['trial', 'Issued trial'], ['personal', 'Personal information']
    ].map(([key, label]) => ({id: id(`${key}_status`), label, knowledgeKey: id(key)}))}
};
// Explicit defaults are saved; a missing answer is not retroactive knowledge.
paradiseLeadLife.starts[0].effects.push(set('trial_received', false), set('personal_read', false));

export function paradiseLeadTrialStatus(state) {
    if (state.actors?.player?.worldId !== id('world')) return [];
    const issued = state.simulation?.situations?.[id('trial_time')];
    const offer = state.simulation?.situations?.[id('recruitment_time')];
    const signed = state.simulation?.knowledge?.player?.[id('agreement')];
    const row = issued || (!signed && offer);
    if (!row) return [];
    const remaining = Math.max(0, row.deadline - state.clock);
    const time = `${Math.floor(remaining / 60)} h ${remaining % 60} min`;
    return [{label: issued ? 'Trial time' : 'Time before treatment',
        value: `${issued ? 'Issued' : 'Offer received'} at minute ${row.openedAt}. ${remaining ? `${time} left.` : 'The stated time has elapsed.'}`}];
}

// Saved observations remain evidence. Rephrase their display as history rather
// than claiming the initial injuries are still present after treatment.
export function paradiseLeadOpeningStatus(state, rows) {
    if (state.actors?.player?.worldId !== id('world')) return rows;
    const known = state.simulation?.knowledge?.player || {};
    const opening = paradiseLeadLife.starts[0].effects.find(e => e.type === 'knowledge' && e.key === id('opening'));
    const command = paradiseLeadLife.simulation.commands.find(c => c.id === id(state.actors.player.facts[id('signed_without_terms')] ? 'sign_now' : 'sign'));
    const agreement = command.effects.find(e => e.type === 'knowledge' && e.key === id('agreement'));
    return rows.map(row => row.label === 'Your situation' && known[id('opening')] ? {...row, value: opening.value}
        : row.label === 'Contract' && known[id('agreement')] ? {...row, value: agreement.value} : row);
}

paradiseLeadLife.compatibility.identityAliases = [
    {
        "from": "sha256:53c568b7058753edfeecb600d9cbdd9793ae9a2269501974c588e44d583bd26c",
        "to": "sha256:09232a2c6d9c05dda6965ed1eb70c7689954e40eaff23b23324ca62d6f5bbb02",
        "reason": "Make opening and signature notes retrospective; the same body, choices, clocks and saved progress remain."
    },
    {
        "from": "sha256:ae09f7bddfaffdcd44e1bd7035f5f9b37804adcdf0c72a1a3e37691144c59740",
        "to": "sha256:c8efe700827e749510b4d90681e1d612e4d5b99192d4e8c3b84ba2bbbb990531",
        "reason": "Retrospective opening note preserves this exact injured-body start and all its effects."
    }
];
