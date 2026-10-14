// Original proposal. Proto23 leisure/social mechanisms inspired the task;
// no foreign source or assets copied. Native host owns clock, RNG and resources.
export const LEISURE_PERSON = 'p23.leisure.eda';
export const LEISURE_SAVE_KEY = 'p23_leisure_memory';
const natural = n => Number.isSafeInteger(n) && n >= 0;
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const check = (x, m) => { if (!x) throw new Error(`Leisure memory: ${m}`); };
const exact = (x, keys) => object(x) && Object.keys(x).length === keys.length && keys.every(k => Object.hasOwn(x, k));
const seed = n => natural(n) && n > 0 && n <= 0xffffffff;
const face = n => Number.isInteger(n) && n >= 1 && n <= 6;
const roll = rng => { let n = rng; n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return n >>> 0; };
const result = (state, rng, effects = [], minutes = 0) => ({state, rng, effects, minutes});
const memory = (id, text) => ({type:'biography', id, kind:'memory', text});

// Seed is NOT stored here: use the existing expansion.rng at paid start only.
// The baseline avoids inventing memories of defeats before enrollment.
export function createLeisureMemory(defeatCount = 0) {
    check(natural(defeatCount), 'invalid defeat baseline');
    return {schema:1, revision:0, rounds:0, pending:null, last:null,
        response:null, helpAt:null, offer:'none', defeatCount};
}
export function validateLeisureMemory(s, clock) {
    check(natural(clock), 'invalid played clock');
    if (s == null) return s; // absent old-save family remains absent
    check(exact(s, ['schema','revision','rounds','pending','last','response','helpAt','offer','defeatCount']) && s.schema === 1, 'unsupported schema or fields');
    check([s.revision,s.rounds,s.defeatCount].every(natural) && s.rounds <= s.revision, 'invalid counters');
    check(s.response === null || ['help','refuse'].includes(s.response), 'invalid response');
    check(['none','waiting','ready','used'].includes(s.offer), 'invalid offer');
    check(s.helpAt === null || natural(s.helpAt) && s.helpAt <= clock, 'invalid help clock');
    check(s.response === 'help' ? s.helpAt !== null && s.offer !== 'none' : s.helpAt === null && s.offer === 'none', 'inconsistent kindness');
    if (s.pending !== null) {
        const p = s.pending;
        check(exact(p,['id','at','due','target','face','seedBefore','seedAfter','fee']) && p.id === s.rounds + 1 && natural(p.id) &&
            natural(p.at) && p.at <= clock && natural(p.due) && p.due === p.at + 2 && face(p.target) && face(p.face) && seed(p.seedBefore) &&
            seed(p.seedAfter) && roll(p.seedBefore) === p.seedAfter && p.face === 1 + Math.floor(p.seedAfter / 0x100000000 * 6) && [0,1].includes(p.fee), 'invalid pending draw');
        check(p.fee !== 0 || s.offer === 'used', 'unfunded practice offer');
    }
    if (s.last !== null) {
        const p = s.last;
        check(exact(p,['id','at','target','face','matched']) && natural(p.id) && p.id === s.rounds && p.id > 0 && natural(p.at) && p.at <= clock &&
            face(p.target) && face(p.face) && p.matched === (p.target === p.face), 'invalid settled round');
    }
    check((s.rounds === 0) === (s.last === null), 'missing round receipt');
    check(!s.pending || !s.last || s.pending.at >= s.last.at, 'backdated paid round');
    return s;
}
function preflight(state, c, expectedRevision) {
    validateLeisureMemory(state, c.clock);
    check(state !== null && state !== undefined && state.revision === expectedRevision && state.revision < Number.MAX_SAFE_INTEGER, 'stale revision');
    check(seed(c.rng), 'invalid native RNG');
    return structuredClone(state);
}
function local(c, person = false) {
    check(c.worldId === 'base.frontier' && c.location === 'Village' && c.alive === true && c.conscious === true && c.idle === true, 'requires idle living conscious Village body');
    if (person) check(c.personId === LEISURE_PERSON && c.personKnown === true && c.personPresent === true && c.personAlive === true, 'requires known present Eda');
}
const affordable = (c, money, stamina) => check(Number.isFinite(c.money) && c.money >= money && Number.isFinite(c.stamina) && c.stamina >= stamina, 'insufficient actual resources');

export function startLeisureRound(state, target, c, expectedRevision = state?.revision) {
    const s = preflight(state,c,expectedRevision); local(c);
    check(!s.pending && s.rounds < Number.MAX_SAFE_INTEGER && face(target) && natural(c.clock + 2), 'pending round or invalid target/time');
    // Discount requires the actual known donor to be here, not only a saved flag.
    const free = s.offer === 'ready' && c.personId === LEISURE_PERSON && c.personKnown === true && c.personPresent === true && c.personAlive === true && Number.isFinite(c.personMoney) && c.personMoney >= 1;
    const fee = free ? 0 : 1; affordable(c,fee,1);
    const rng = roll(c.rng);
    s.pending = {id:s.rounds+1, at:c.clock, due:c.clock+2, target, face:1+Math.floor(rng / 0x100000000 * 6), seedBefore:c.rng, seedAfter:rng, fee};
    if (free) s.offer = 'used';
    s.revision++;
    return result(s,rng,[{type:'nativeMoney',amount:-fee},{type:'nativeStamina',amount:-1},...(free ? [{type:'personMoney',personId:LEISURE_PERSON,amount:-1}] : [])],0);
}
export function settleLeisureRound(state, id, c, expectedRevision = state?.revision) {
    const s = preflight(state,c,expectedRevision);
    // Replayed timer/restore callback never republishes payment or memory.
    if (natural(id) && id > 0 && id <= s.rounds) return result(s,c.rng);
    check(s.pending && s.pending.id === id && c.clock >= s.pending.due, 'round is not due');
    const p = s.pending, matched = p.target === p.face;
    s.last = {id,at:c.clock,target:p.target,face:p.face,matched}; s.rounds = id; s.pending = null; s.revision++;
    // Avoid resurrecting stamina into an ended life. Result itself remains true.
    const effects = matched && c.alive === true && c.conscious === true ? [{type:'nativeStamina',amount:1}] : [];
    effects.push(memory(`p23.leisure.round:${id}`, `You played target dice in Village: chose ${p.target}, rolled ${p.face}. ${matched ? 'A matching throw.' : 'A different throw.'}`));
    return result(s,c.rng,effects);
}
export function respondToEda(state, response, c, expectedRevision = state?.revision) {
    const s = preflight(state,c,expectedRevision); local(c,true);
    check(!s.pending && ['help','refuse'].includes(response) && ['none','used'].includes(s.offer), 'finish current round or offer first');
    affordable(c,response === 'help' ? 1 : 0,0);
    s.response = response; s.helpAt = response === 'help' ? c.clock : null; s.offer = response === 'help' ? 'waiting' : 'none'; s.revision++;
    const id = `p23.leisure.response:${s.revision}`;
    const text = response === 'help' ? 'You gave Eda one coin toward replacing her worn dice cup. She said to visit again later.' : 'You declined Eda’s request for a coin toward her dice cup.';
    return result(s,c.rng,[...(response === 'help' ? [{type:'nativeMoney',amount:-1},{type:'personMoney',personId:LEISURE_PERSON,amount:1}] : []),
        {type:'relationshipMemory',personId:LEISURE_PERSON,id,text},memory(id,text)]);
}
export function revisitEda(state, c, expectedRevision = state?.revision) {
    const s = preflight(state,c,expectedRevision); local(c,true);
    if (s.offer !== 'waiting' || c.clock < s.helpAt + 2) return result(s,c.rng);
    s.offer = 'ready'; s.revision++;
    return result(s,c.rng,[memory(`p23.leisure.return:${s.revision}`, 'Eda remembered your help and offered to cover the fee for your next target-dice practice.')]);
}

// Call ONLY after the native combat defeat event. No killer lookup or death rule.
export function rememberNativeDefeat(state, event, c, expectedRevision = state?.revision) {
    const s = preflight(state,c,expectedRevision);
    check(event && natural(event.count) && event.count > 0 && event.kind === 'unconsciousness' && ['combat','unknown'].includes(event.cause), 'unsupported native defeat');
    if (event.count <= s.defeatCount) return result(s,c.rng);
    check(event.count === s.defeatCount + 1, 'missing native defeat occurrence');
    check(event.knownOpponent == null || event.cause === 'combat' && typeof event.knownOpponent === 'string' && event.knownOpponent.length > 0 && event.knownOpponent.length <= 48 && !/[<>\x00-\x1f]/.test(event.knownOpponent), 'invalid known opponent');
    s.defeatCount = event.count; s.revision++;
    const text = event.knownOpponent ? `You lost consciousness in combat with ${event.knownOpponent} and began recovering.` : event.cause === 'combat' ? 'You lost consciousness in combat and began recovering.' : 'You lost consciousness and began recovering.';
    return result(s,c.rng,[memory(`p23.leisure.recovery:${event.count}`,text)]);
}

export function leisureMemoryView(state, c) {
    validateLeisureMemory(state,c.clock);
    if (!state) return null;
    const known = c.personId === LEISURE_PERSON && c.personKnown === true;
    return {title:'Target dice', rounds:state.rounds,
        pending:state.pending ? {id:state.pending.id,due:state.pending.due,target:state.pending.target} : null,
        last:structuredClone(state.last), person:known ? {id:LEISURE_PERSON,name:'Eda',response:state.response,offer:state.offer,
            text:state.offer === 'ready' ? 'I remember the cup money. Your next practice is on me.' : state.response === 'refuse' ? 'No worries. The ordinary table is still open.' : state.offer === 'waiting' ? 'Thank you. Come back after I have repaired the cup.' : 'A practice round costs one coin and one stamina; a matching throw restores that stamina.'} : null};
}
