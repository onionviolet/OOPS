// PS168 (round 16, proposal; Discord F30, research P13): a setup good for winning can be poor for practice, and the
// practice line should name the actual cause, not a guess. Pure: the caller passes what the character's own situation
// shows (worn armour, a shield in hand, wounds taken, poison, cold felt) and the skill ids that went quiet; the reader
// returns one short cause per skill whose known gate is shut, or nothing.
//
// Default: only gates the skill's own description already states (Iron skin: bare skin; Evasion: no shield; Poison
// resistance: poison in you) or that follow from what it trains on (Fortitude: wounds; Cold resistance: feeling cold),
// so no hidden threshold is shown. Dial: a world registers its own gates with `registerPracticeGate`. Reason: the
// player can then choose to win or to practise; nothing is unequipped or forced.

const GATES = new Map([
    ['Iron skin', f => f.wearingArmor ? 'your armour takes the hits it learns from' : ''],
    ['Evasion', f => f.usingShield ? 'you block with a shield instead of dodging' : ''],
    ['Fortitude', f => f.woundsTaken === 0 ? 'it learns from wounds, and nothing has hurt you yet' : ''],
    ['Poison resistance', f => f.poisoned === false ? 'it builds while poison is in you, and none has taken hold' : ''],
    ['Cold resistance', f => f.feelsCold === false ? 'you are warm enough here; it trains when the cold bites' : ''],
]);

/** A world adds a gate: `read(facts)` returns the cause in words when it holds, else ''. */
export function registerPracticeGate(skillId, read) {
    if(typeof read !== 'function') throw new Error('A practice gate reads facts.');
    GATES.set(skillId, read);
}

/** The cause for one quiet skill, or '' when no known gate explains it. Unknown facts (undefined) explain nothing. */
export function practiceCause(skillId, facts = {}) {
    return GATES.get(skillId)?.(facts) || '';
}

/** "Iron skin: your armour takes the hits it learns from." per quiet skill with a known cause; the rest stay unexplained. */
export function practiceCauseLines(skillIds = [], facts = {}, name = id => id) {
    return skillIds.map(id => [id, practiceCause(id, facts)]).filter(([, why]) => why).map(([id, why]) => `${name(id)}: ${why}.`);
}
