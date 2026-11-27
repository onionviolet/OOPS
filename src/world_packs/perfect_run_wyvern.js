// Direct held English ch2, rr:36735:569531:p0004–p0052. Payment amount,
// investigation result and permanent alliance are not stated. Withholding the
// personal search and declining the card are authored alternatives.
import {advanceEngineWorld, applyEngineOps} from '../engine_world.js';
import {RYAN, MEMORY, ATTEMPT, memory, attempt, stateOp} from './perfect_run_state.js';

const HOTEL = 'new_rome.hotel', WYVERN = 'wyvern', CARD = 'wyvern_card';
const DEPARTURE = 'new_rome.northbound';
const SOCIAL = 'perfect_run.wyvern', CUSTODY = 'perfect_run.custody';
const ids = new Set(['morning', 'open_window', 'ask_len', 'keep_private', 'defer_recruitment', 'take_card', 'leave_card']);
export const isWyvernAction = id => ids.has(id);
const social = e => e.world.holders[WYVERN]?.state[SOCIAL];
const cardHeld = e => e.world.holders[CARD]?.state[CUSTODY]?.holder === RYAN;
const npcOp = value => ({op: 'state', holder: WYVERN, pack: SOCIAL, value});
const action = (id, label, detail) => ({id, label, detail});

export function wyvernActions(e) {
    const a = attempt(e);
    if (a.phase === 'complete') return [action('morning', 'Continue to the next morning',
        'Return to your hotel. Check the delivery payment and follow up on Renesco’s lead.')];
    if (a.phase === 'wyvern.window') return [action('open_window', 'Open the window',
        'A woman is hovering outside your tenth-floor room. Hear what she wants.')];
    if (a.phase === 'wyvern.introduced') return [
        action('ask_len', 'Ask Wyvern about Len', 'Describe your friend and tell Wyvern you are looking for her. She will learn about your search.'),
        action('keep_private', 'Keep your search for Len private', 'Hear Wyvern out without giving her Len’s name or description.'),
    ];
    if (a.phase === 'wyvern.invitation') return [action('defer_recruitment', 'Put recruitment aside for now',
        'You have your own search to pursue. Leave the invitation open without joining Il Migliore.')];
    if (a.phase === 'wyvern.card') return [
        action('take_card', 'Take Wyvern’s card', 'Keep the headquarters address. Taking a card does not mean joining.'),
        action('leave_card', 'Decline the card', 'Leave the physical business card with Wyvern.'),
    ];
    return [];
}

function prepareMorning(e) {
    // Lazy optional holders preserve compatibility with pre-N1 saved runs.
    const additions = [
        {id: HOTEL, kind: 'place'},
        {id: DEPARTURE, kind: 'place'},
        {id: WYVERN, kind: 'body', place: HOTEL},
        {id: CARD, kind: 'thing', place: HOTEL},
    ].filter(row => !e.world.holders[row.id]);
    return applyEngineOps(e, [
        ...additions.map(value => ({op: 'holder_add', value})),
        {op: 'state', holder: CARD, pack: CUSTODY, value: {holder: WYVERN}},
        npcOp({introduced: false, knowsLen: false, offer: null, recruitment: 'not_discussed'}),
    ], 'perfect_run:morning_setup');
}

export function actWyvern(e, id) {
    if (!wyvernActions(e).some(row => row.id === id)) return e;
    const a = attempt(e), m = memory(e);
    let patch, learned = m, ops = [], duration = 1;
    if (id === 'morning') {
        e = prepareMorning(e);
        duration = 12 * 60; // Authored overnight compression, not a canon hour.
        learned = {...m, cityResearch: true};
        patch = {phase: 'wyvern.window', courierPaid: true,
            result: 'By morning, the client has wired your delivery payment. You locate Rust Town in the northwest and learn that the Junkyard is an old coal mine used as a landfill. Someone knocks on your window.'};
        ops = [{op: 'move', holder: RYAN, to: HOTEL}];
    } else if (id === 'open_window') {
        learned = {...m, wyvernKnown: true};
        patch = {phase: 'wyvern.introduced', result: 'The visitor introduces herself as Wyvern and thanks you for Ghoul’s arrest. She asks what brought you to New Rome.'};
        ops = [npcOp({...social(e), introduced: true})];
    } else if (id === 'ask_len') {
        learned = {...m, wyvernOfferRemembered: true};
        const offer = {by: WYVERN, to: RYAN, target: 'len', kind: 'look_in_files', status: 'offered',
            conditional: true, result: null, at: e.world.clock, loop: m.loops};
        patch = {phase: 'wyvern.invitation', result: 'You describe Len and explain that she is your friend. Wyvern has not heard of her, but offers to look in the files and help if she can. She then invites you to visit Il Migliore’s headquarters.'};
        ops = [npcOp({...social(e), knowsLen: true, disclosed: {name: 'Len', hair: 'black', eyes: 'blue',
            politicalDescription: 'Marxist-Leninist', relationship: 'Ryan’s friend'}, offer, recruitment: 'invited'})];
    } else if (id === 'keep_private') {
        patch = {phase: 'wyvern.invitation', result: 'You keep Len out of the conversation. Wyvern invites you to visit Il Migliore’s headquarters, but you have not asked her to look for your friend.'};
        ops = [npcOp({...social(e), recruitment: 'invited'})];
    } else if (id === 'defer_recruitment') {
        patch = {phase: 'wyvern.card', result: 'You put recruitment aside for now. Wyvern offers you a business card in case you change your mind.'};
        ops = [npcOp({...social(e), recruitment: 'deferred'})];
    } else {
        const take = id === 'take_card';
        learned = {...m, ...(take ? {hqAddressKnown: true} : {})};
        patch = {phase: 'wyvern.complete', result: take
            ? `You keep Wyvern’s card and the headquarters address. She leaves. You have not joined Il Migliore. ${social(e).offer ? 'Her offer to look for Len has no answer yet.' : 'You have kept your search for Len private.'}`
            : 'You let Wyvern keep the card. She flies away. You have not joined Il Migliore.'};
        ops = [{op: 'state', holder: CARD, pack: CUSTODY, value: {holder: take ? RYAN : WYVERN}},
            {op: 'move', holder: WYVERN, to: DEPARTURE},
            ...(!take ? [{op: 'move', holder: CARD, to: DEPARTURE}] : []),
            npcOp({...social(e), departed: true})];
    }
    const advanced = advanceEngineWorld(e, e.world.clock + duration).engine;
    return applyEngineOps(advanced, [...ops, stateOp(ATTEMPT, {...a, ...patch}),
        stateOp(MEMORY, {...learned, history: [...learned.history, patch.result]})], `perfect_run:${id}`);
}

export function wyvernFacts(e) {
    const a = attempt(e), m = memory(e), npc = social(e);
    const offered = npc?.offer?.status === 'offered';
    return [
        ...(a.courierPaid ? [['Delivery payment', 'Received from the client']] : []),
        ...(m.cityResearch ? [['Your lead', 'Rust Town, northwest New Rome · Junkyard, former coal mine']] : []),
        ...(npc?.introduced ? [['Wyvern', npc.departed ? 'Left the hotel' : 'At your window'],
            ['What you told Wyvern', npc.knowsLen ? 'Len’s name and description · you are looking for your friend' : 'You have not told her about Len'],
            ...(npc.recruitment !== 'not_discussed' ? [
                ['Wyvern’s offer', offered ? 'Offered to look in the files if she can · no answer yet' : 'No inquiry about Len discussed'],
                ['Il Migliore', npc.recruitment === 'deferred' ? 'Invitation left open · you have not joined' : 'Invited to visit headquarters · you have not joined'],
            ] : []),
        ] : []),
        ...(a.phase === 'wyvern.complete' ? [['Wyvern’s card', cardHeld(e) ? 'With you · headquarters address kept' : 'With Wyvern']] : []),
        ...(m.wyvernOfferRemembered && !offered ? [['Remembered conversation', 'Wyvern offered to look for Len in an earlier attempt. She has not made that offer in this attempt.']] : []),
        ...(m.hqAddressKnown && !cardHeld(e) ? [['Remembered contact', 'You remember the headquarters address, but do not hold Wyvern’s card in this attempt.']] : []),
    ];
}
