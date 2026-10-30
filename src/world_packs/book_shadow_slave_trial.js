// Shadow Slave · Second Nightmare trial (original divergent proposal). Rows cited by id only:
// ss.law.rank-system (ladder), ss.law.rank-advancement (Second Nightmare survived: Ascended; Ascended can
// enter and leave the Dream Realm at will), ss.law.nightmare-spell. Route, supplies, injuries and costs are
// authored. The risk is modelled as health loss and injury that must be treated; this slice has no random
// death route. No book prose.
import {ssRankPath, SS_KNOWN_RUNGS} from '../ascension_paths_ss.js';
const P = 'book.ss.trial';
const id = n => `${P}.${n}`;
const key = n => JSON.stringify({id: id(n)});
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const ge = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const flag = (n, value) => ({type: 'fact', scope: 'actor', key: id(n), value});
const note = (n, value) => ({type: 'knowledge', actor: 'player', key: id(n), stage: 'understood', value});
const item = (n, amount) => ({type: 'item', key: key(n), amount});
const vital = (k, amount) => ({type: 'vital', key: k, amount});
const move = n => ({type: 'relocate', location: id(n)});
const phase = (...v) => v.length === 1 ? eq(`actor.${id('phase')}`, v[0]) : {any: v.map(n => eq(`actor.${id('phase')}`, n))};
const own = all(eq('actor.life', 'alive'), eq('native.alive'), eq('native.ready'), eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const cmd = (n, label, extra = {}) => ({id: id(n), revision: 1, label, group: 'structured_local', worldId: id('world'), actorId: 'player',
    location: id('hall'), audience: ['$actor'], requires: own, costs: [], effects: [], ...extra});
const timed = (duration, requires) => ({duration, cancellation: 'refund', reservationReturns: 1, completionRequires: requires, completionCoLocated: true, completionFailure: 'refund'});
const inRealm = all(own, phase(2));

export const shadowSlaveTrial = {
    schema: 2, id: P, revision: 1, title: 'Shadow Slave · Second Nightmare trial',
    description: 'An Awakened student at a training hall prepares supplies, crosses into the Dream Realm for the Second Nightmare, and either returns Ascended or retreats hurt.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'jobs'],
    world: {id: id('world'), label: 'Shadow Slave · original trial-hall life'},
    locations: [
        {id: id('hall'), label: 'Training hall', underRoof: true, description: 'An original waking-world hall where Awakened students provision and recover between Dream Realm trials. It is not the Awakened Academy of the book.'},
        {id: id('realm'), label: 'Dream Realm · Second Nightmare', underRoof: false, description: 'An original authored route through the Dream Realm. Crossing is one-way until you retreat or finish; the trial is dangerous and can leave you injured.'}],
    items: [['supplies', 'Trial supplies', 'Food, water and tools for one crossing. Preparation spends two.'], ['salve', 'Healing salve', 'One dressing treats the injury a rushed crossing leaves and restores some health.'],
        ['fragment', 'Memory fragment', 'A fragment recovered from a finished trial. It is the proof of the attempt; no further use is modelled here.']].map(([n, label, description]) => ({id: id(n), label, description, value: 1})),
    starts: [{id: id('start'), locationId: id('hall'),
        description: 'In this original life you are an Awakened student with four sets of trial supplies and one healing salve. Your Aspect is Awakened; the Second Nightmare is the next step on the rank ladder.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true},
        effects: [item('supplies', 4), item('salve', 1), flag('rank', 1), flag('second_nightmare', false), flag('phase', 0), flag('injury', 0), flag('report', false),
            note('opening', 'Prepare costs 5 played minutes and two supplies. The steady route takes 12 minutes and costs little health. The rushed route takes 5 minutes, costs 25 health and leaves an injury that needs a salve before another attempt.'),
            note('trial_known', 'The Second Nightmare waits across the Dream Realm. Prepare, enter, choose a route, then settle the trial at its end. You can retreat instead; that brings you home with nothing gained.'),
            note('rank_state', 'Rank: Awakened. Surviving the Second Nightmare makes you Ascended.')]}],
    simulation: {people: [], commands: [], events: []},
    presentation: {people: {}, status: [{id: id('opening_status'), label: 'Trial terms', knowledgeKey: id('opening')}, {id: id('rank_status'), label: 'Rank', knowledgeKey: id('rank_state')}, {id: id('trial_status'), label: 'Latest trial', knowledgeKey: id('trial_known')}],
        ladder: {path: ssRankPath, positionKey: id('rank'), facts: {secondNightmare: id('second_nightmare')}, known: SS_KNOWN_RUNGS}},
    expeditions: [{id: id('trial'), label: 'Second Nightmare', phaseKey: id('phase'), injuryKey: id('injury'), knowledgeKey: id('trial_known'), locationIds: [id('hall'), id('realm')],
        prepareId: id('prepare'), enterId: id('enter'), approaches: [id('steady'), id('rushed')], retreatId: id('retreat'), extractId: id('settle'), treatmentId: id('treat')}]
};
const ready = all(own, eq(`actor.${id('injury')}`, 0, 'Treat your injury with a salve before another attempt.'));
shadowSlaveTrial.simulation.commands.push(
    cmd('prepare', 'Prepare for the crossing · 5 min, 2 supplies', {requires: all(ready, phase(0, 4)), ...timed(5, all(ready, phase(0, 4))),
        description: 'Spend two supplies on provisioning. Completion readies the crossing; stopping refunds them.', costs: [item('supplies', -2)], effects: [flag('phase', 1), flag('report', false)]}),
    cmd('enter', 'Cross into the Dream Realm · 10 min', {requires: all(own, phase(1)), ...timed(10, all(own, phase(1))),
        description: 'Walk into the Second Nightmare. Until you retreat or settle the trial you are away from the hall.', effects: [move('realm'), flag('phase', 2),
            note('trial_known', 'You are inside the Second Nightmare. Choose a route.')]}),
    cmd('steady', 'Take the steady route · 12 min', {location: id('realm'), visibleWhen: phase(2), requires: all(inRealm, ge('vital.health', 11, 'You need more than 10 health for this route.')), ...timed(12, inRealm),
        description: 'A slow, careful route. Costs 10 health, no lasting injury, and survives the trial.', effects: [vital('health', -10), flag('report', true), flag('phase', 3),
            note('trial_known', 'You survived the Second Nightmare by the steady route. Settle it to return as Ascended.')]}),
    cmd('rushed', 'Take the rushed route · 5 min', {location: id('realm'), visibleWhen: phase(2), requires: all(inRealm, ge('vital.health', 26, 'You need more than 25 health for this route.')), ...timed(5, inRealm),
        description: 'A fast route. Costs 25 health and leaves an injury that needs a salve, but survives the trial in half the time.', effects: [vital('health', -25), flag('injury', 1), flag('report', true), flag('phase', 3),
            note('trial_known', 'You survived the Second Nightmare by the rushed route, injured. Settle it, then treat the injury.')]}),
    cmd('retreat', 'Retreat to the hall · 5 min', {location: id('realm'), visibleWhen: phase(2, 3), requires: all(own, phase(2, 3)), ...timed(5, all(own, phase(2, 3))),
        description: 'Leave the Dream Realm without finishing. Nothing is gained, and any injury stays.', effects: [move('hall'), flag('phase', 4), note('trial_known', 'You withdrew from the Second Nightmare. Prepare again when you are ready.')]}),
    cmd('settle', 'Settle the trial and wake Ascended · 5 min', {location: id('realm'), visibleWhen: phase(3), requires: all(own, phase(3), eq(`actor.${id('report')}`, true, 'This attempt did not survive the trial.')),
        ...timed(5, all(own, phase(3))), description: 'Leave the Dream Realm with the proof of the trial. Your rank rises to Ascended.',
        effects: [move('hall'), item('fragment', 1), flag('rank', 2), flag('second_nightmare', true), flag('phase', 4),
            note('rank_state', 'Rank: Ascended. You can enter and leave the Dream Realm at will.'), note('trial_known', 'You are home. The Second Nightmare is behind you.')]}),
    cmd('treat', 'Treat the injury · 5 min, 1 salve', {requires: all(own, phase(0, 4), eq(`actor.${id('injury')}`, 1)),
        ...timed(5, all(own, phase(0, 4), eq(`actor.${id('injury')}`, 1))), description: 'Use one salve: the injury closes and you recover 20 health.', costs: [item('salve', -1)], effects: [flag('injury', 0), vital('health', 20)]}),
    cmd('shallows', 'Rest in the Dream Realm shallows · 5 min', {visibleWhen: eq(`actor.${id('rank')}`, 2), requires: all(own, phase(0, 4), ge(`actor.${id('rank')}`, 2, 'Only Ascended can enter and leave the Dream Realm at will.')),
        ...timed(5, all(own, phase(0, 4))), description: 'As an Ascended you step in and out of the Dream Realm freely. Rest there for five minutes to recover 10 health.', effects: [vital('health', 10)]})
);
