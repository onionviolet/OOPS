// Spell effect sentences (chat S, docs/PROCEDURAL_FOUNDATION_PLAN.md "One effect
// grammar for every world", PFP23). A spell's effect is a sentence of verb,
// object, target, time, carrier, cost and limits. The intent law below says what
// a caster's will to do something means in those terms; it names no world (PFP3).
// Proposal under AD56: every list is a working default, extended when a canon
// effect cannot be said with it and a second consumer needs the part (EF2).
// Owner note: W owns effect primitives and P composition (seam SB3); this is the
// spell-side vocabulary until a second domain shares it (request in S checkpoint).

export const EFFECT_VERBS = Object.freeze(['move', 'add', 'remove', 'transform', 'bind', 'sense', 'conceal', 'copy',
    'block', 'end', 'alter_law', 'animate', 'command']);
export const EFFECT_OBJECTS = Object.freeze(['position', 'light', 'fire', 'water', 'force', 'cold', 'form', 'size', 'material',
    'integrity', 'vitality', 'motion', 'mind', 'mood', 'memory', 'pain', 'voice', 'sound', 'sight', 'presence', 'access',
    'custody', 'agent', 'effect', 'mark', 'magic', 'harm', 'answer']);
export const EFFECT_TARGETS = Object.freeze(['self', 'object', 'body', 'creature', 'place', 'area', 'effect', 'implement', 'working']);
export const EFFECT_TIMES = Object.freeze(['instant', 'sustained', 'lasting', 'timed', 'triggered']);
export const EFFECT_CARRIERS = Object.freeze(['wand', 'attuned_mana', 'spell_slot', 'ritual', 'ability', 'gu', 'potion', 'item']);
export const EFFECT_COSTS = Object.freeze(['stamina', 'mana', 'slot', 'spirituality', 'essence', 'material', 'none']);

// The intent law: what willing an outcome does, as verb, object and direction.
// Default: one row per intent; a world adds intents through its pack (dial),
// with the canon effect that needed it as the reason (EF2).
export const INTENT_LAW = Object.freeze({
    raise: {verb: 'move', object: 'position', direction: 'up'},
    lower: {verb: 'move', object: 'position', direction: 'down'},
    fetch: {verb: 'move', object: 'position', direction: 'toward_caster'},
    send: {verb: 'move', object: 'position', direction: 'away'},
    carry: {verb: 'move', object: 'position', direction: 'along'},
    travel: {verb: 'move', object: 'position', direction: 'to_place'},
    disarm: {verb: 'move', object: 'custody', direction: 'away'},
    free: {verb: 'end', object: 'effect'},
    end: {verb: 'end', object: 'effect'},
    hold: {verb: 'bind', object: 'motion'},
    shield: {verb: 'block', object: 'harm'},
    ward: {verb: 'alter_law', object: 'access'},
    counter: {verb: 'block', object: 'magic'},
    open: {verb: 'add', object: 'access'},
    seal: {verb: 'remove', object: 'access'},
    light: {verb: 'add', object: 'light'},
    darken: {verb: 'remove', object: 'light'},
    kindle: {verb: 'add', object: 'fire'},
    pour: {verb: 'add', object: 'water'},
    chill: {verb: 'add', object: 'cold'},
    strike: {verb: 'add', object: 'force'},
    mend: {verb: 'transform', object: 'integrity', direction: 'restore'},
    heal: {verb: 'transform', object: 'vitality', direction: 'restore'},
    sever: {verb: 'remove', object: 'integrity'},
    blast: {verb: 'remove', object: 'integrity', direction: 'burst'},
    dig: {verb: 'remove', object: 'material', direction: 'carve'},
    reshape: {verb: 'transform', object: 'form'},
    harden: {verb: 'transform', object: 'material', direction: 'harder'},
    enlarge: {verb: 'transform', object: 'size', direction: 'up'},
    shrink: {verb: 'transform', object: 'size', direction: 'down'},
    vanish: {verb: 'remove', object: 'presence'},
    clean: {verb: 'remove', object: 'material', direction: 'surface'},
    duplicate: {verb: 'copy', object: 'form'},
    reveal: {verb: 'sense', object: 'presence'},
    // Added 2026-11-12 after the D&D canon test missed Detect Magic (EF2); second
    // consumer: Lord of the Mysteries Spirit Vision senses hidden spiritual properties.
    sense_magic: {verb: 'sense', object: 'magic'},
    // Added for Lord of the Mysteries divination (nine canon rows ask a question and
    // read an answer); second consumer: Hogwarts Divination lessons (prophecy, tea leaves).
    divine: {verb: 'sense', object: 'answer'},
    read: {verb: 'sense', object: 'mark'},
    guide: {verb: 'sense', object: 'position'},
    mark: {verb: 'add', object: 'mark'},
    conceal: {verb: 'conceal', object: 'presence'},
    amplify: {verb: 'add', object: 'voice'},
    silence: {verb: 'block', object: 'voice'},
    muffle: {verb: 'block', object: 'sound'},
    blind: {verb: 'block', object: 'sight'},
    stun: {verb: 'bind', object: 'mind'},
    revive: {verb: 'end', object: 'effect', direction: 'mind'},
    hurt: {verb: 'remove', object: 'vitality'},
    torment: {verb: 'add', object: 'pain'},
    compel: {verb: 'command', object: 'mind'},
    forget: {verb: 'transform', object: 'memory'},
    confuse: {verb: 'transform', object: 'mind'},
    cheer: {verb: 'transform', object: 'mood', direction: 'up'},
    afflict: {verb: 'transform', object: 'form', direction: 'body'},
    summon_agent: {verb: 'add', object: 'agent'},
    animate: {verb: 'animate', object: 'agent'},
    direct: {verb: 'command', object: 'agent'},
});
export const INTENTS = Object.freeze(Object.keys(INTENT_LAW));

// Execution form to time. Default: how the source shows the effect lasting.
export const EXECUTION_TIME = Object.freeze({instant: 'instant', sustained: 'sustained', concentration: 'sustained',
    timed: 'timed', lasting: 'lasting', rite: 'timed', triggered: 'triggered'});

const one = (list, v, field) => list.includes(v) ? null : `${field} ${v} is not in the effect vocabulary`;

// sentence parts -> frozen sentence, or throws with the first problem.
export function effectSentence({verb, object, target, time, carrier, cost, direction = null, limits = []}) {
    const problem = one(EFFECT_VERBS, verb, 'verb') ?? one(EFFECT_OBJECTS, object, 'object') ?? one(EFFECT_TARGETS, target, 'target')
        ?? one(EFFECT_TIMES, time, 'time') ?? one(EFFECT_CARRIERS, carrier, 'carrier') ?? one(EFFECT_COSTS, cost, 'cost');
    if (problem) throw Error(problem);
    if (!Array.isArray(limits) || limits.some(l => typeof l !== 'string')) throw Error('limits are short strings');
    return Object.freeze({verb, object, target, time, carrier, cost, direction, limits: Object.freeze([...limits])});
}

// intent + target + execution + carrier + cost -> sentence (the derive rule).
export function sentenceFromIntent({intent, target, execution, carrier, cost, limits = []}) {
    const law = INTENT_LAW[intent];
    if (!law) throw Error(`No law for the intent ${intent}.`);
    return effectSentence({...law, target, time: EXECUTION_TIME[execution] ?? execution, carrier, cost, limits});
}

// Fields a canon truth fixes. Carrier and cost are world facts checked separately.
export const SENTENCE_FIELDS = Object.freeze(['verb', 'object', 'target', 'time', 'direction']);
export function compareSentences(got, expected, fields = SENTENCE_FIELDS) {
    return fields.filter(f => expected[f] !== undefined && (got?.[f] ?? null) !== expected[f])
        .map(field => ({field, expected: expected[field], got: got?.[field] ?? null}));
}

// Check 4 (it explains itself): a plain line built from the sentence. World packs
// may swap words; the order stays verb, object, target, time, cost.
const VERB_WORDS = {move: 'moves', add: 'brings', remove: 'takes away', transform: 'changes', bind: 'holds', sense: 'reveals',
    conceal: 'hides', copy: 'copies', block: 'blocks', end: 'ends', alter_law: 'changes what is allowed for', animate: 'animates', command: 'commands'};
const TIME_WORDS = {instant: 'at once', sustained: 'while you keep it up', lasting: 'and it lasts', timed: 'for a while', triggered: 'when its trigger comes'};
export function describeSentence(s) {
    const what = s.direction ? `${s.object} (${s.direction.replaceAll('_', ' ')})` : s.object;
    const article = /^[aeiou]/.test(s.target) ? 'an' : 'a';
    return `It ${VERB_WORDS[s.verb]} ${what} of ${article} ${s.target}, ${TIME_WORDS[s.time]}. Paid with ${s.cost}.`;
}
