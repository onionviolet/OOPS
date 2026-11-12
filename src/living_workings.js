// Care of a living body as a kernel working (chat L, phase 2, 2026-11-12; proposal
// under AD56). The first L task consumer on K's contract (docs/KERNEL_WORKING_CONTRACT.md):
// feeding and tending are operations; a canon or local care routine is a method row.
// Each step reads the body through `ports.read` at its own time (KW3, KW6), so a body
// that changed keeper or left partway interrupts that step and earlier steps stand
// (KW8). Settlement returns effect intents; the host applies them to the lifecycle
// (startCreatureCare) and the substrate (satiety) in one settlement (KW11).
import {defineWorkingLaw} from './kernel_working.js';

const ownKeeper = (keeper, body) => body.keeper === keeper.id;

export const LIVING_CARE_LAW = defineWorkingLaw({id: 'l.care', revision: 1, operations: {
    feed: {roles: {keeper: 'actor', body: 'living', ration: 'food'}, minutes: 1,
        settle({bound}) {
            const {keeper, body, ration} = bound;
            if (!ownKeeper(keeper, body)) return {ok: false, reason: 'not this keeper’s animal', observed: {refused: true}};
            if (!(ration.count > 0)) return {ok: false, reason: 'no ration left', observed: {empty: true}};
            if (body.hunger === null) return {ok: false, reason: 'this body does not eat', observed: {ignored: true}};
            return {ok: true, effects: [{kind: 'living.fed', body: body.id, ration: ration.id, minutes: ration.minutes}],
                observed: {ate: true}};
        }},
    tend: {roles: {keeper: 'actor', body: 'living'}, minutes: 1,
        settle({bound, options}) {
            const {keeper, body} = bound;
            if (!ownKeeper(keeper, body)) return {ok: false, reason: 'not this keeper’s animal', observed: {refused: true}};
            if (body.inCare) return {ok: false, reason: 'already in care', observed: {busy: true}};
            const duration = options.duration ?? 6;
            return {ok: true, effects: [{kind: 'living.care', body: body.id, duration}],
                observed: {wound: body.injury ? 'open' : 'none'}};
        }},
}});

/** A care routine as data: feed, then tend for `duration` minutes. */
export const careRoutine = ({id = 'l.care.routine', duration = 6} = {}) => ({
    id, revision: 1, law: LIVING_CARE_LAW.ref,
    roles: {keeper: 'actor', body: 'living', ration: 'food'},
    steps: [{op: 'feed', bindings: {keeper: 'keeper', body: 'body', ration: 'ration'}},
        {op: 'tend', bindings: {keeper: 'keeper', body: 'body'}, options: {duration}}],
});
