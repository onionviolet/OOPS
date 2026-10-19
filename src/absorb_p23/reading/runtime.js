import {check, natural} from '../../basics.js';
import {ANTHOLOGY_KEY, REST_KEY, STORIES, anthologyOutcome, LONG_REST_MINUTES, REST_BATCH_MINUTES} from './content.js';
const object = x => x && typeof x === 'object' && !Array.isArray(x);
const keys = (x, expected) => object(x) && Object.keys(x).length === expected.length && expected.every(k => Object.hasOwn(x,k));
const equal = (a,b) => Object.keys(a).length === Object.keys(b).length && Object.entries(a).every(([k,v]) => b[k] === v);
const empty = () => ({schema:1, nextId:1, current:null, receipts:[]});

/** Import preflight only. Missing optional state stays absent. Never enroll. */
export function validateReadingState(state, clock) {
    check(natural(clock), 'Bind the actual played clock.');
    if(state === undefined) return true;
    check(keys(state,['schema','nextId','current','receipts']) && state.schema === 1 &&
        natural(state.nextId) && state.nextId > 0 && Array.isArray(state.receipts), 'Unsupported anthology/rest schema.');
    const rows = [...state.receipts, ...(state.current ? [state.current] : [])];
    check(state.current === null || object(state.current), 'Invalid current reading/rest.');
    check(rows.length === state.nextId - 1, 'Missing reading/rest event receipts.');
    rows.forEach((row,i) => {
        check(keys(row,['id','kind','startedAt','observedAt','progress','status','outcome']) && row.id === i+1 &&
            ['read','rest'].includes(row.kind) && natural(row.startedAt) && natural(row.observedAt) &&
            row.startedAt <= row.observedAt && row.observedAt <= clock && Number.isFinite(row.progress) && row.progress >= 0,
        'Invalid reading/rest event.');
        if(i) check(row.startedAt >= rows[i-1].observedAt, 'Overlapping reading/rest receipts.');
        const current = row === state.current;
        check(current ? ['active','paused'].includes(row.status) : ['finished','cancelled'].includes(row.status), 'Invalid settlement status.');
        if(row.kind === 'read') {
            check(object(row.outcome) && equal(row.outcome,anthologyOutcome(row.outcome.draw)), 'Invalid saved anthology draw.');
            check(row.status !== 'cancelled', 'Reading stops preserve the existing attempt.');
        } else check(keys(row.outcome,['duration']) && row.outcome.duration === LONG_REST_MINUTES && row.status !== 'paused' &&
            natural(row.progress) && row.progress === row.observedAt-row.startedAt, 'Invalid long-rest terms.');
        check(row.progress <= row.outcome.duration && (row.status === 'finished' ? row.progress === row.outcome.duration : row.progress < row.outcome.duration), 'Invalid reading/rest progress.');
    });
    return true;
}
function frame(state,context) {
    validateReadingState(state,context?.clock);
    check(context.clock >= (state?.current?.observedAt ?? state?.receipts.at(-1)?.observedAt ?? 0), 'Played clock moved backwards.');
    return structuredClone(state ?? empty());
}
function eligible(context,kind) {
    check(context.worldId === 'base.frontier' && context.nativeBody === true && context.alive === true &&
        context.safe === true && context.available === true, 'Finish conflicting work and return to your living native body in a safe frontier location.');
    if(kind === 'read') check(context.ownedAnthology === true, 'Hold your own anthology, not a borrowed copy.');
    else check(context.housingAccessible === true && Number.isFinite(context.sleepingLevel) && context.sleepingLevel >= 5 &&
        context.ownedRestMeal === true, 'Earn Sleeping level 5, an accessible sleeping place and your own packed long-rest meal.');
}
const result = (state,effects=[]) => ({state,effects});
/** Immutable plan; P00 must publish state, native costs/XP and RNG atomically. */
export function planReadingCommand(state,command,context) {
    const next = frame(state,context), current = next.current;
    if(command?.type === 'startRead' || command?.type === 'startRest') {
        check(!current, 'Finish or stop the current commitment first.');
        const kind = command.type === 'startRead' ? 'read' : 'rest';
        eligible(context,kind);
        check(next.nextId < Number.MAX_SAFE_INTEGER, 'Event counter cannot overflow. Preserve this save.');
        next.current = {id:next.nextId++,kind,startedAt:context.clock,observedAt:context.clock,progress:0,status:'active',
            outcome:kind === 'read' ? anthologyOutcome(command.draw) : {duration:LONG_REST_MINUTES}};
        return result(next,kind === 'rest' ? [{type:'consume',key:REST_KEY,count:1,eventId:next.current.id}] : []);
    }
    check(current, 'No current reading/rest.');
    // Every elapsed interval must be joined before command admission. Otherwise
    // pause/cancel could silently lose accepted played time.
    if(current.status === 'active') check(current.observedAt === context.clock, 'Observe accepted played time before stopping.');
    if(command?.type === 'stopRead') {
        check(current.kind === 'read' && current.status === 'active','No active anthology read.');
        current.status = 'paused';
    } else if(command?.type === 'resumeRead') {
        check(current.kind === 'read' && current.status === 'paused','No paused anthology read.');
        eligible(context,'read'); current.status = 'active'; current.observedAt = context.clock;
    } else if(command?.type === 'cancelRest') {
        check(current.kind === 'rest','No active long rest.');
        current.status = 'cancelled'; next.receipts.push(current); next.current = null;
    } else throw Error('Unknown reading/rest command.');
    return result(next);
}
/** Observe ONLY minutes accepted by the native joined clock, never wall time.
 * readProgressPerMinute is wave-1's live Literacy/reading-rate projection.
 * Interrupted eligibility must stop BEFORE the clock advances; P00 owns it.
 */
export function observeReadingClock(state,context) {
    const next = frame(state,context), row = next.current;
    if(!row || row.status === 'paused') return result(state === undefined ? undefined : next);
    check(context.alive === true && context.safe === true && context.available === true && context.nativeBody === true && context.worldId === 'base.frontier' &&
        (row.kind === 'read' ? context.ownedAnthology === true : context.housingAccessible === true), 'Stop unsupported reading/rest before advancing time.');
    const elapsed = context.clock-row.observedAt;
    const rate = row.kind === 'read' ? context.readProgressPerMinute : 1;
    check(Number.isFinite(rate) && rate > 0, 'Bind the native reading progress rate.');
    if(row.kind === 'rest') check(elapsed <= REST_BATCH_MINUTES && elapsed <= row.outcome.duration-row.progress,
        'Long rest requires bounded cancellable native batches, not synchronous replay or overshoot.');
    row.progress = Math.min(row.outcome.duration,row.progress+elapsed*rate); row.observedAt = context.clock;
    if(row.progress < row.outcome.duration) return result(next);
    row.status = 'finished'; next.receipts.push(row); next.current = null;
    return result(next,row.kind === 'read' ? [
        {type:'skillXp',skill:'Literacy',amount:row.outcome.literacyXp,eventId:row.id},
        {type:'finishOwnedBook',key:ANTHOLOGY_KEY,eventId:row.id},
        {type:'story',text:STORIES[row.outcome.story],eventId:row.id},
    ] : []);
}
export function longRestClockRequest(state,context) {
    validateReadingState(state,context?.clock);
    const row = state?.current;
    if(row?.kind !== 'rest') return 0;
    check(context.clock === row.observedAt && context.alive === true && context.safe === true && context.available === true && context.nativeBody === true &&
        context.worldId === 'base.frontier' && context.housingAccessible === true, 'Cancel unsupported rest before requesting played time.');
    return Math.min(REST_BATCH_MINUTES,row.outcome.duration-row.progress);
}
