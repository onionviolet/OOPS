// The Perfect Run, chapter 1, lead-run beats 00101–00104. The save point,
// failed reaction, car ambush, time-stop/bat and €50,000 repair payment are
// sourced. Body points and combat ticks are authored
// calibration, not canon statistics. Knowledge and the rewound world differ
// here from Zorian's calendar loop: death returns Ryan to his own checkpoint.
import {createEngineWorld, restoreEngineWorld, applyEngineOps, advanceEngineWorld} from '../engine_world.js';
import {beginContest, defineContestLaw, runContest} from '../contest.js';
import {contestBody} from '../contest_bodies.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {RYAN, MEMORY, ATTEMPT, memory, attempt, stateOp} from './perfect_run_state.js';
import {actWyvern, isWyvernAction, wyvernActions, wyvernFacts} from './perfect_run_wyvern.js';

const GHOUL = 'ghoul', STREET = 'new_rome.street', PUB = 'new_rome.jolie_wrangler';
const PAID = 'stock:repairs_euro';
const config = {packs: ['c.contest'], shared: {quantities: [WORLD_QUANTITIES.stock]}};
const set = (holder, quantity, amount) => ({op: 'set', holder, quantity, amount});
const fightLaw = defineContestLaw({id: 'c.perfect_run_ambush', revision: 1, moves: {
    stopped_time_bat: {resolver: 'strike', steps: [1], power: 30},
    ice_volley: {resolver: 'strike', steps: [12], power: 30},
}});

function create(kept = {loops: 3, ambush: false, tech: false, history: []}) {
    const engine = createEngineWorld({...config, holders: [
        {id: STREET, kind: 'place'}, {id: PUB, kind: 'place'},
        contestBody(RYAN, STREET, {vitality: 30, [PAID]: 0}),
        contestBody(GHOUL, STREET, {vitality: 30}),
        {id: 'briefcase', kind: 'thing', place: STREET},
        {id: 'plymouth', kind: 'thing', place: STREET},
    ]});
    return applyEngineOps(engine, [stateOp(MEMORY, kept), stateOp(ATTEMPT, {
        phase: 'arrival', delivered: false, wallDamage: false,
        result: 'New Rome. The Jolie Wrangler is ahead, and the briefcase is still yours.',
    })], 'perfect_run:checkpoint');
}

function actions(e) {
    const a = attempt(e), m = memory(e);
    const row = (id, label, detail, ready, reason) => ({id, label, detail, reason: ready ? undefined : reason});
    if (e.world.holders[RYAN].quantities.vitality === 0) return [
        row('return', 'Return to the save point', 'Death rewinds the world. Your memories stay; other people and possessions return to the checkpoint.', true),
    ];
    const nextMorning = wyvernActions(e);
    if (nextMorning.length || a.phase.startsWith('wyvern.')) return nextMorning;
    const rows = [
        row('enter', 'Deliver the briefcase', 'Enter the Jolie Wrangler and hand the case to Renesco.', a.phase === 'arrival', 'You have already entered this attempt.'),
        row('ask', 'Ask about Len and custom tech', 'Stay to question Renesco. You do not know who else is coming.', a.phase === 'pub', 'Speak with Renesco inside the pub first.'),
        row('react', 'Try to stop the ice spear', 'The attacker has fired. Try to stop time before it reaches you.', a.phase === 'attack', 'There is no incoming spear to react to.'),
        row('return', 'Return to the save point', 'Death rewinds the world. Your memories stay; the case and your body return to their earlier state.', a.phase === 'dead', 'Your death has not triggered a return.'),
        row('wait', 'Wait in the Plymouth for the attacker', 'Use what you remember to intercept the assassin outside.', a.phase === 'arrival' && m.ambush,
            m.ambush ? 'Start the next attempt outside the pub.' : 'You have not learned about the ambush.'),
        row('ram', 'Ram the attacker through the pub wall', 'Steer around the bystanders and strike first with the Plymouth. The pub entrance will take damage.', a.phase === 'waiting', 'Wait in the car for the attacker first.'),
        row('bat', 'Stop time and strike with the bat', 'Move around the ice volley while time is stopped, then beat the attacker down.', a.phase === 'fight', 'Get the bat from the trunk after intercepting the attacker.'),
        row('settle', 'Pay Renesco for the repairs', 'Give Renesco €50,000 for the damage to his pub.', a.phase === 'won',
            'Deal with the attacker before settling the damage.'),
        row('bribe', 'Offer the security captain a bribe', 'The captain demands your weapon license. Offer cash to settle the matter.', a.phase === 'security', 'Wait for the captain to challenge you.'),
        row('increase', 'Increase the bribe', 'Offer the captain more money. This is a separate payment from Renesco’s repairs.', a.phase === 'refused', 'Wait for the captain’s answer.'),
        row('deliver', 'Hand Renesco the briefcase', 'Finish the delivery now that security has lowered its weapons.', a.phase === 'cleared', 'Resolve the armed security challenge first.'),
    ];
    // A remembered route can be reconsidered; an unknown assassin's name or
    // an unobserved future expense must not leak from disabled controls.
    const relevant = {arrival: ['enter', ...(m.ambush ? ['wait'] : [])],
        pub: ['ask'], attack: ['react'], dead: ['return'], waiting: ['ram'],
        fight: ['bat'], won: ['settle'], security: ['bribe'], refused: ['increase'], cleared: ['deliver'], complete: []};
    return rows.filter(row => relevant[a.phase].includes(row.id));
}

function act(e, id) {
    const option = actions(e).find(row => row.id === id);
    if (!option || option.reason) return e;
    const a = attempt(e), m = memory(e);
    if (id === 'return') return create({...m, loops: m.loops + 1,
        history: [...m.history, a.phase === 'dead'
            ? 'The attacker killed you at the Jolie Wrangler. You remember the ambush; the delivery and injury are undone.'
            : 'Death returns you to the checkpoint. You remember the conversation, but its promises and possessions belong to the erased attempt.']});
    if (isWyvernAction(id)) return actWyvern(e, id);
    let patch, ops = [], learned = m;
    if (id === 'enter') {
        patch = {phase: 'pub', delivered: true, result: 'Renesco takes the case. You stay to ask about Len.'};
        ops = [{op: 'move', holder: RYAN, to: PUB}, {op: 'move', holder: 'briefcase', to: PUB}];
    } else if (id === 'ask') {
        learned = {...m, tech: true};
        patch = {phase: 'attack', result: 'Renesco points you toward Rust Town and the Junkyard. An attacker arrives, speaking for Adam, and fires an ice spear.'};
    } else if (id === 'react') {
        learned = {...m, ambush: true};
        patch = {phase: 'dead', result: 'Too late. The spear freezes you before you can stop time. The world starts slipping away.'};
        ops = [set(RYAN, 'vitality', 0)];
    } else if (id === 'wait') patch = {phase: 'waiting', result: 'You wait outside in the Plymouth. This time, you know who to look for.'};
    else if (id === 'ram') {
        patch = {phase: 'fight', wallDamage: true, result: 'You steer clear of the bystanders and smash the attacker through the pub entrance. He gets up and sends ice flying. Your bat is in the trunk.'};
        ops = [set(GHOUL, 'vitality', 20)];
    } else if (id === 'bat') {
        const bout = beginContest(fightLaw, {id: `ghoul_loop_${m.loops}`, seed: 2, place: STREET, entrants: [
            {id: RYAN, body: RYAN, side: 'ryan', profile: {attack: 100, evasion: 0}, moves: ['stopped_time_bat']},
            {id: GHOUL, body: GHOUL, side: 'ghoul', profile: {attack: 100, evasion: 0}, moves: ['ice_volley']},
        ], limits: {landed: 1}}, e.world);
        const fought = runContest(fightLaw, bout, e.rules, e.world);
        e = {...e, world: fought.world};
        patch = {phase: 'won', result: 'You stop time, move around the ice and bring the bat down. The attacker is on the street, unable to resist. Renesco surveys the hole in his pub.'};
    } else if (id === 'settle') {
        patch = {phase: 'security', result: 'Renesco accepts €50,000 for repairs. The security captain demands your weapon license; his men keep their rifles on you.'};
        ops = [{op: 'add', holder: RYAN, quantity: PAID, amount: 50000}];
    } else if (id === 'bribe') {
        patch = {phase: 'refused', result: 'The captain refuses your first offer. The rifles stay raised.'};
    } else if (id === 'increase') {
        patch = {phase: 'cleared', securityPaid: true, result: 'The captain accepts the larger bribe. His men lower their rifles and carry the attacker away.'};
    } else {
        learned = {...m, name: true};
        patch = {phase: 'complete', delivered: true, result: 'Renesco takes the briefcase and identifies the attacker as Ghoul, from the Meta-Gang. You leave with a lead on Rust Town and the Junkyard.'};
        ops = [{op: 'move', holder: 'briefcase', to: PUB}];
    }
    const result = patch.result;
    learned = {...learned, history: [...learned.history, result]};
    const advanced = advanceEngineWorld(e, e.world.clock + 1).engine;
    return applyEngineOps(advanced, [...ops, stateOp(ATTEMPT, {...a, ...patch}), stateOp(MEMORY, learned)], `perfect_run:${id}`);
}

function view(e) {
    const a = attempt(e), m = memory(e);
    const meeting = a.phase.startsWith('wyvern.');
    return {facts: [
        ['Attempt', meeting ? `Loop ${m.loops} · next morning` : `Loop ${m.loops} · ${e.world.clock} min since arrival`],
        ['Body', e.world.holders[RYAN].quantities.vitality > 0 ? 'Alive' : a.phase === 'dead' ? 'Frozen by the ice spear' : 'Dead'],
        ...(meeting ? [['Earlier delivery', 'Case with Renesco · €50,000 repairs paid']] : [
        ['Briefcase', a.delivered ? 'With Renesco' : 'With you'],
        ['Repair payment', `€${e.world.holders[RYAN].quantities[PAID].toLocaleString('en-US')} paid`],
        ...(a.securityPaid ? [['Security captain', 'Larger bribe accepted · rifles lowered']] : []),
        ['Pub entrance', a.wallDamage ? 'Wrecked by the Plymouth' : 'As it was at the save point'],
        ['What you remember', [m.ambush && (m.name ? 'Ghoul’s ambush' : 'The ice-wielding attacker’s ambush'), m.tech && 'Rust Town and the Junkyard'].filter(Boolean).join(' · ') || 'The delivery address'],
        ]),
        ...wyvernFacts(e),
    ], actions: actions(e), result: a.result, history: m.history};
}

export const ryanOpeningRun = {title: 'Ryan Romano · New Rome',
    introduction: 'Bring a briefcase to the Jolie Wrangler. What you learn from a failed attempt can change the next one.',
    create, restore: saved => restoreEngineWorld(saved, config), act, view};
