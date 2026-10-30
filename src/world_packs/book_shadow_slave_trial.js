// Shadow Slave · Second Trial (original divergent proposal). Rows cited by id only:
// ss.law.rank-system (ladder), ss.law.rank-advancement (Second Trial survived: Risen; Risen can
// enter and leave the Far Reach at will). Route, supplies, injuries and costs are
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
const why = {0: 'Prepare the crossing first, or settle or retreat from the last one.', 1: 'Prepare the crossing first.', 2: 'You must be inside the Far Reach.', 3: 'Survive the trial first.', 4: 'Finish or retreat from the current crossing first.'};
const phase = (...v) => v.length === 1 ? eq(`actor.${id('phase')}`, v[0], why[v[0]]) : {any: v.map(n => eq(`actor.${id('phase')}`, n, why[v[0]]))};
const own = all(eq('actor.life', 'alive'), eq('native.alive'), eq('native.ready'), eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const cmd = (n, label, extra = {}) => ({id: id(n), revision: 1, label, group: 'structured_local', worldId: id('world'), actorId: 'player',
    location: id('hall'), audience: ['$actor'], requires: own, costs: [], effects: [], ...extra});
const timed = (duration, requires) => ({duration, cancellation: 'refund', reservationReturns: 1, completionRequires: requires, completionCoLocated: true, completionFailure: 'refund'});
const inRealm = all(own, phase(2));

export const shadowSlaveTrial = {
    schema: 2, id: P, revision: 1, title: 'Shadow Slave · Second Trial',
    description: 'An Woken student at a training hall prepares supplies, crosses into the Far Reach for the Second Trial, and either returns Risen or retreats hurt.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'jobs'],
    world: {id: id('world'), label: 'Shadow Slave · original trial-hall life'},
    locations: [
        {id: id('hall'), label: 'Training hall', underRoof: true, description: 'An original waking-world hall where Woken students provision and recover between Far Reach trials. It is not the Woken Academy of the book.'},
        {id: id('realm'), label: 'Far Reach · Second Trial', underRoof: false, description: 'An original authored route through the Far Reach. Crossing is one-way until you retreat or finish; the trial is dangerous and can leave you injured.'}],
    items: [['supplies', 'Trial supplies', 'Food, water and tools for one crossing. Preparation spends two.'], ['salve', 'Healing salve', 'One dressing treats the injury a rushed crossing leaves and restores some health.'],
        ['fragment', 'Trial fragment', 'A fragment recovered from a finished trial. It is the proof of the attempt; no further use is modelled here.']].map(([n, label, description]) => ({id: id(n), label, description, value: 1})),
    starts: [{id: id('start'), locationId: id('hall'),
        description: 'In this original life you are a Woken student with four sets of trial supplies and one healing salve. You are Woken; the Second Trial is the next step on the rank ladder.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true},
        effects: [item('supplies', 4), item('salve', 1), flag('rank', 1), flag('second_trial', false), flag('phase', 0), flag('injury', 0), flag('report', false),
            note('opening', 'Prepare costs 5 played minutes and two supplies. The steady route takes 12 minutes and costs little health. The rushed route takes 5 minutes, costs 25 health and leaves an injury that needs a salve before another attempt.'),
            note('trial_known', 'The Second Trial waits across the Far Reach. Prepare, enter, choose a route, then settle the trial at its end. You can retreat instead; that brings you home with nothing gained.'),
            note('rank_state', 'Woken. Surviving the Second Trial makes you Risen.')]}],
    simulation: {people: [], commands: [], events: []},
    presentation: {people: {}, status: [{id: id('opening_status'), label: 'Trial terms', knowledgeKey: id('opening')}, {id: id('rank_status'), label: 'Rank', knowledgeKey: id('rank_state')}, {id: id('trial_status'), label: 'Latest trial', knowledgeKey: id('trial_known')}],
        ladders: [{id: 'rank', path: ssRankPath, positionKey: id('rank'), facts: {secondTrial: id('second_trial')}, known: SS_KNOWN_RUNGS}]},
    expeditions: [{id: id('trial'), label: 'Second Trial', phaseKey: id('phase'), injuryKey: id('injury'), knowledgeKey: id('trial_known'), locationIds: [id('hall'), id('realm')],
        prepareId: id('prepare'), enterId: id('enter'), approaches: [id('steady'), id('rushed')], retreatId: id('retreat'), extractId: id('settle'), treatmentId: id('treat')}]
};
const ready = all(own, eq(`actor.${id('injury')}`, 0, 'Treat your injury with a salve before another attempt.'), {fact: `actor.${id('rank')}`, op: 'lte', value: 1, reason: 'You are already Risen; the Second Trial is behind you.'});
shadowSlaveTrial.simulation.commands.push(
    cmd('prepare', 'Prepare for the crossing · 5 min, 2 supplies', {requires: all(ready, phase(0, 4)), ...timed(5, all(ready, phase(0, 4))),
        description: 'Spend two supplies on provisioning. Completion readies the crossing; stopping refunds them.', costs: [item('supplies', -2)], effects: [flag('phase', 1), flag('report', false)]}),
    cmd('enter', 'Cross into the Far Reach · 10 min', {requires: all(own, phase(1)), ...timed(10, all(own, phase(1))),
        description: 'Walk into the Second Trial. Until you retreat or settle the trial you are away from the hall.', effects: [move('realm'), flag('phase', 2),
            note('trial_known', 'You are inside the Second Trial. Choose a route.')]}),
    cmd('steady', 'Take the steady route · 12 min', {location: id('realm'), visibleWhen: phase(2), requires: all(inRealm, ge('vital.health', 11, 'You need more than 10 health for this route.')), ...timed(12, inRealm),
        description: 'A slow, careful route. Costs 10 health, no lasting injury, and survives the trial.', effects: [vital('health', -10), flag('report', true), flag('phase', 3),
            note('trial_known', 'You survived the Second Trial by the steady route. Settle it to return as Risen.')]}),
    cmd('rushed', 'Take the rushed route · 5 min', {location: id('realm'), visibleWhen: phase(2), requires: all(inRealm, ge('vital.health', 26, 'You need more than 25 health for this route.')), ...timed(5, inRealm),
        description: 'A fast route. Costs 25 health and leaves an injury that needs a salve, but survives the trial in half the time.', effects: [vital('health', -25), flag('injury', 1), flag('report', true), flag('phase', 3),
            note('trial_known', 'You survived the Second Trial by the rushed route, injured. Settle it, then treat the injury.')]}),
    cmd('retreat', 'Retreat to the hall · 5 min', {location: id('realm'), visibleWhen: phase(2, 3), requires: all(own, phase(2, 3)), ...timed(5, all(own, phase(2, 3))),
        description: 'Leave the Far Reach without finishing. Nothing is gained, and any injury stays.', effects: [move('hall'), flag('phase', 4), note('trial_known', 'You withdrew from the Second Trial. Prepare again when you are ready.')]}),
    cmd('settle', 'Settle the trial and wake Risen · 5 min', {location: id('realm'), visibleWhen: phase(3), requires: all(own, phase(3), eq(`actor.${id('report')}`, true, 'This attempt did not survive the trial.')),
        ...timed(5, all(own, phase(3))), description: 'Leave the Far Reach with the proof of the trial. Your rank rises to Risen.',
        effects: [move('hall'), item('fragment', 1), flag('rank', 2), flag('second_trial', true), flag('phase', 4),
            note('rank_state', 'Risen. You can enter and leave the Far Reach at will.'), note('trial_known', 'You are home. The Second Trial is behind you.')]}),
    cmd('treat', 'Treat the injury · 5 min, 1 salve', {requires: all(own, phase(0, 4), eq(`actor.${id('injury')}`, 1)),
        ...timed(5, all(own, phase(0, 4), eq(`actor.${id('injury')}`, 1))), description: 'Use one salve: the injury closes and you recover 20 health.', costs: [item('salve', -1)], effects: [flag('injury', 0), vital('health', 20)]}),
    cmd('shallows', 'Rest in the Far Reach shallows · 5 min', {visibleWhen: eq(`actor.${id('rank')}`, 2), requires: all(own, phase(0, 4), ge(`actor.${id('rank')}`, 2, 'Only Risen can enter and leave the Far Reach at will.')),
        ...timed(5, all(own, phase(0, 4))), description: 'As an Risen you step in and out of the Far Reach freely. Rest there for five minutes to recover 10 health.', effects: [vital('health', 10)]})
);
