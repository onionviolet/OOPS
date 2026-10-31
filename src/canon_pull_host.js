// G1 host seam (PROPOSAL; wired in book_world_lotm_cast_host.js by floor-wire). Pure: no state write.
// One LOTM volume 1 beat the lead can push against by walking away from where the book has them: b1, due when
// day 3 turns, needs the lead to be at their scheduled place. The story's pull is to reach them anyway: a
// coincidence brings the event to wherever they are (fate), or someone else carries it (the church).
// The beat is shown by id only. Facts are re-read from the game each tick; the slice keeps the rest.
import {defineBeats} from './beat_records.js';
import {resolveWithPull, emptyPull, pullRead} from './canon_pull.js';

export const PULL_PRESENT = 'lotm.pull.b1.present';
export const PULL_REACHED = 'book.lotm.pull.b1.reached';
export const LOTM_DOSE_PULL_BEATS = defineBeats([
    {id: 'lotm.v1.pull.b1', dayIndex: 3, until: 3, kind: 'great', needs: {fact: PULL_PRESENT, value: true},
        effects: [{fact: PULL_REACHED, value: true}],
        pull: {agents: [
            {id: 'fate', kind: 'fate', reason: 'fate.coincidence', sign: 'a coincidence carried the day to where you stood', cost: 1, budget: 1,
                restore: [{fact: PULL_REACHED, value: true}]},
            {id: 'church', kind: 'organisation', reason: 'org.contingency', sign: 'someone with standing carried it in your place', cost: 1, budget: 1,
                substitute: [{fact: PULL_REACHED, value: true}]}]}},
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
