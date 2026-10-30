// G1 first slice (PROPOSAL): one LOTM volume 1 canon beat the lead can push against, by id only.
// Stand-in table: ids and facts are authored for the slice, not read from the sealed pack. The
// host binds `lotm.v1.pull.b1` to the real beat id and its precondition fact (patch for floor-wire).
// The beat's content stays sealed: `sign` lines say that something mended it, never what it was.
import {defineBeats} from '../beat_records.js';

export const LOTM_PULL_BEAT = 'lotm.v1.pull.b1';
export const LOTM_PULL_FACT = 'lotm.v1.pull.b1.ready';
export const LOTM_PULL_BEATS = defineBeats([
    {id: 'lotm.v1.pull.a0', dayIndex: 1, kind: 'routine', effects: [{fact: 'lotm.v1.pull.a0.done', value: true}]},
    {id: LOTM_PULL_BEAT, dayIndex: 3, until: 3, kind: 'great', deps: [{id: 'lotm.v1.pull.a0', kind: 'after'}],
        needs: {fact: LOTM_PULL_FACT, value: true}, effects: [{fact: 'lotm.v1.pull.b1.done', value: true}],
        pull: {agents: [
            {id: 'fate', kind: 'fate', reason: 'fate.coincidence', sign: 'a small coincidence turned up at the right hour', cost: 1, budget: 2,
                restore: [{fact: LOTM_PULL_FACT, value: true}]},
            {id: 'church', kind: 'organisation', reason: 'org.contingency', sign: 'someone with standing stepped in', cost: 1, budget: 1,
                substitute: [{fact: 'lotm.v1.pull.b1.done', value: true}, {fact: 'lotm.v1.pull.b1.by_other', value: true}]}]}},
    {id: 'lotm.v1.pull.c1', dayIndex: 5, kind: 'detail', deps: [{id: LOTM_PULL_BEAT, kind: 'after'}], effects: [{fact: 'lotm.v1.pull.c1.done', value: true}]},
]);
export const lotmPullStart = () => ({[LOTM_PULL_FACT]: true});
