// AGT1, AGT14 (proposal): Heaven's Will in Reverend Insanity, the second world on the shared acting-power record (LLR26 answered: built now).
// Fate level F2 (a soft pull through a real channel that leaves traces) with F6 (contention: several plans move at once; STY24, STY31, the
// fate handoff C1, C5). Its reach is a rule over facts: it detects power gathered high, not a young Rank-one aperture, and it touches luck
// facts only. Unbudgeted: no stated limit in the sources, and a forced one would be a forced weakness (AGT4, AD55). Its motive stays sealed
// by id; a faithful run leaves it unresolved (STY26, AGT6). Pure reader over the lead's own knowledge; no state, no slice.
import {registerPower, powerView} from './acting_powers.js';
import {GU_LEAD, riLeadId} from './world_packs/book_gu_lead_life.js';

export const HEAVENS_WILL = 'ri.heavens_will';
export const heavensWill = registerPower({id: HEAVENS_WILL, world: riLeadId('world'), kind: 'fate', label: 'Heaven’s Will',
    goals: [{id: 'ri.heavens_will.motive', sealed: true}],
    fate: {level: 'F2', modifiers: ['F6']},
    reach: {detects: {fact: 'rank', gte: 6}, touches: ['luck.'], channels: ['luck', 'opening']},
    budget: {kind: 'unbudgeted'},
    acts: [{id: 'press', kind: 'nudge', touches: ['luck.'], effects: [{fact: 'luck.pressure', add: 1}], windowDays: 30, severity: 'minor', probability: 0.2}],
    sign: 'a run of bad luck that follows power'});

// What the returned youth can read of it. He remembers a lifetime of it; he can see his own rank. The seat's rank is one until a rank source exists.
const LEAD_RANK = 1;
export function guHeavensWillStatus(state, record) {
    if (record?.packId !== GU_LEAD || !state.simulation?.knowledge?.player?.[riLeadId('awakening')]) return [];
    const v = powerView(heavensWill, {rank: LEAD_RANK});
    return [{label: v.label, value: v.sees
        ? 'It has turned its eye on you. Luck runs against whatever you gather.'
        : 'Not looking your way. In your old life it turned on power gathered high, never on a green-copper sea at Rank one. Nothing here draws it yet.'}];
}
