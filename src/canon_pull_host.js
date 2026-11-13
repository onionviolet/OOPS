// G1 host seam (PROPOSAL; wired in book_world_lotm_cast_host.js by floor-wire). Pure: no state write.
// One LOTM volume 1 beat the lead can push against by walking away from where the book has them: b1, due when
// day 3 turns, needs the lead to be at their scheduled place. The story's pull is to reach them anyway: a
// coincidence brings the event to wherever they are (fate), or someone else carries it (the church).
// The beat is shown by id only. Facts are re-read from the game each tick; the slice keeps the rest.
import {defineBeats} from './beat_records.js';
import {resolveWithPull, emptyPull, pullRead} from './canon_pull.js';
import {registerPower} from './acting_powers.js';

export const PULL_PRESENT = 'lotm.pull.b1.present';
export const PULL_REACHED = 'book.lotm.pull.b1.reached';
// AGT1, AGT11: the "church" agent is a record. Its institution face is the Evernight quarter's authority row (STN6, `book_world_lotm_districts.js`);
// no faith face is built. Reach: it detects people in Tingen's Evernight quarter and touches only the pull's own reached fact, so it carries a beat in the lead's place
// and nothing else (AGT3, AGT5). Budget: one act, the code's old default, now declared (AGT4); a world dial may add `refillDays`. `church` stays an alias so saved spend keeps its meaning.
export const EVERNIGHT_CHURCH = 'lotm.church.evernight';
registerPower({id: EVERNIGHT_CHURCH, world: 'lotm.v1', kind: 'institution', label: 'The Church of the Evernight Goddess', aliases: ['church'], institution: 'evernight',
    reason: 'org.contingency', sign: 'a Nighthawk with standing carried it in your place',
    goals: [{id: 'lotm.church.evernight.aims', sealed: true}],
    reach: {detects: {fact: 'lotm.pull.b1.known', eq: true}, touches: [PULL_REACHED], channels: ['clergy', 'office']},
    budget: {kind: 'acts', amount: 1},
    acts: [{id: 'carry_beat', kind: 'substitute', touches: [PULL_REACHED], effects: [{fact: PULL_REACHED, value: true}]}]});

export const LOTM_DOSE_PULL_BEATS = defineBeats([
    {id: 'lotm.v1.pull.b1', dayIndex: 3, until: 3, kind: 'great', needs: {fact: PULL_PRESENT, value: true},
        effects: [{fact: PULL_REACHED, value: true}],
        pull: {agents: [
            {id: 'fate', kind: 'fate', reason: 'fate.coincidence', sign: 'a coincidence carried the day to where you stood', cost: 1, budget: 1,
                restore: [{fact: PULL_REACHED, value: true}]},
            {id: EVERNIGHT_CHURCH, substitute: [{fact: PULL_REACHED, value: true}]}]}},
]);
// The book only says where the lead is during its slots; between slots there is nothing to be present at, so the
// tick waits (PULL_KNOWN false) rather than carrying the beat from an unknown.
export const PULL_KNOWN = 'lotm.pull.b1.known';
export const pullFacts = ({scheduledPlace, playerPlace}) => ({[PULL_KNOWN]: scheduledPlace != null, [PULL_PRESENT]: scheduledPlace == null || scheduledPlace === playerPlace});

export const pullConfig = ({seat = 'be', worldSeed = 0} = {}) => ({seat, worldSeed, world: 'lotm.v1'});

// pull: the canonPull slice; facts: {[PULL_DECLINED]: bool}; day: 1-based days since the life began.
// Returns {pull, effects (simulation fact effects for the host to apply), records}.
export function canonPullTick(pull = emptyPull(), {facts, day, seat, worldSeed} = {}) {
    const beats = pull.beats ?? {done: {}, day: 0};
    if (!(day > beats.day) || facts?.[PULL_KNOWN] === false) return {pull, effects: [], records: []};
    const state = {facts: {[PULL_PRESENT]: true, ...facts}, done: beats.done, day: beats.day};
    const r = resolveWithPull(LOTM_DOSE_PULL_BEATS, state, day, {pull: {state: pull, ...pullConfig({seat, worldSeed})}});
    const effects = r.results.flatMap(x => x.diffs).filter(d => d.fact.startsWith('book.lotm.'))
        .map(d => ({type: 'fact', scope: 'actor', actor: 'player', key: d.fact, value: d.now}));
    return {pull: {...r.pull, beats: {done: r.state.done, day: r.state.day}}, effects, records: r.records};
}

// The panel's read, from the slice alone. A push that matters (the lead away from their place) is pressed through
// the beat's own broken precondition, so the lean strains only while the player pushes.
export function canonPullRead(pull = emptyPull(), {seat = 'be', away = false} = {}) {
    const pushed = away && !(pull.beats?.done?.['lotm.v1.pull.b1']);
    const withPush = pushed ? {...pull, disturbance: [...pull.disturbance, {id: 'live', day: pull.beats?.day ?? 0, weight: 0.5, reaches: ['lotm.v1.pull.b1'], label: null}]} : pull;
    return pullRead(LOTM_DOSE_PULL_BEATS, {facts: {}, done: pull.beats?.done ?? {}, day: pull.beats?.day ?? 0}, withPush, pullConfig({seat}));
}
