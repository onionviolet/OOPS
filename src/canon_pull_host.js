// G1 host seam (PROPOSAL; floor-wire wires it into book_world_lotm_cast_host.js). Pure: no state write.
// One LOTM volume 1 beat the lead can push against by its own verb: the supervisor's dose offer, which the
// game's `decline` action turns down (fact book.lotm.declined). The story's pull is to have the offer stand.
// The beat is shown by id only (b1). Facts are re-read from the game every tick; the slice keeps the rest.
import {defineBeats} from './beat_records.js';
import {resolveWithPull, emptyPull, pullRead} from './canon_pull.js';

export const PULL_DECLINED = 'book.lotm.declined';
export const LOTM_DOSE_PULL_BEATS = defineBeats([
    {id: 'lotm.v1.pull.b1', dayIndex: 2, until: 2, kind: 'great', needs: {fact: PULL_DECLINED, value: false},
        effects: [{fact: 'lotm.v1.pull.b1.stands', value: true}],
        pull: {agents: [
            {id: 'fate', kind: 'fate', reason: 'fate.coincidence', sign: 'a coincidence put the offer back in front of you', cost: 1, budget: 1,
                restore: [{fact: PULL_DECLINED, value: false}]},
            {id: 'church', kind: 'organisation', reason: 'org.contingency', sign: 'someone with standing asked again on your behalf', cost: 1, budget: 1,
                substitute: [{fact: PULL_DECLINED, value: false}, {fact: 'lotm.v1.pull.b1.stands', value: true}]}]}},
]);

export const pullConfig = ({seat = 'be', worldSeed = 0} = {}) => ({seat, worldSeed, world: 'lotm.v1'});

// pull: the canonPull slice; facts: {[PULL_DECLINED]: bool}; day: 1-based days since the life began.
// Returns {pull, effects (simulation fact effects for the host to apply), records}.
export function canonPullTick(pull = emptyPull(), {facts, day, seat, worldSeed} = {}) {
    const beats = pull.beats ?? {done: {}, day: 0};
    if (!(day > beats.day)) return {pull, effects: [], records: []};
    const state = {facts: {[PULL_DECLINED]: false, ...facts}, done: beats.done, day: beats.day};
    const r = resolveWithPull(LOTM_DOSE_PULL_BEATS, state, day, {pull: {state: pull, ...pullConfig({seat, worldSeed})}});
    const effects = r.results.flatMap(x => x.diffs).filter(d => d.fact.startsWith('book.lotm.'))
        .map(d => ({type: 'fact', scope: 'actor', actor: 'player', key: d.fact, value: d.now}));
    return {pull: {...r.pull, beats: {done: r.state.done, day: r.state.day}}, effects, records: r.records};
}

// The panel's read, from the slice alone. Facts that matter (a declined dose) are pressed through
// the beat's own broken precondition, so the lean strains only while the player pushes.
export function canonPullRead(pull = emptyPull(), {seat = 'be', declined = false} = {}) {
    const pushed = declined && !(pull.beats?.done?.['lotm.v1.pull.b1']);
    const withPush = pushed ? {...pull, disturbance: [...pull.disturbance, {id: 'live', day: pull.beats?.day ?? 0, weight: 0.5, reaches: ['lotm.v1.pull.b1'], label: null}]} : pull;
    return pullRead(LOTM_DOSE_PULL_BEATS, {facts: {}, done: pull.beats?.done ?? {}, day: pull.beats?.day ?? 0}, withPush, pullConfig({seat}));
}
