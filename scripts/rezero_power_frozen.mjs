// FROZEN BEFORE ANY GRAMMAR OUTPUT (2026-11-16, PWC2, GKM429). This file holds the prediction tables, the capability
// rules and the fold rule for the Re:Zero power ledger. It was written and committed before the first grammar pass
// ran, so the held-out score below cannot have been fitted to the labellers' output. Edit it only by adding a dated
// revision note; a changed table must report its score apart from the frozen one.
//
// Held-out labels (the labeller never sees them): the six attributes for spells, the Witch Factor sin for Factors
// and Authorities. The grammar pass gets the row's own names replaced by a neutral token and the attribute (spells)
// or sin (Factors and Authorities) words masked; a separate pass reads the unmasked evidence for the stated label.
//
// Fold rule: every stated label folds (it carries a locator). A row's effect-grammar parts fold as `grammar` only
// when Luna and Haiku agree on verb and object; otherwise they stay `grammarGuess`. For the held-out classes
// (spells, Factors, Authorities) the parts fold as `grammar` only when that class's held-out agreement beats its
// baseline (the most common label's share) on the held-out rows; otherwise the class keeps `grammarGuess`.
//
// Predictions come from the deep dive's own descriptions of each label (DEEP_DIVE_2026-10-24.md l.131 for the
// attributes; DEEP_DIVE_2026-10-10.md l.71-82 for the sins), restated as grammar parts. Order matters: first match.
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';

export {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES};
export const ATTR_RULES = [
    // Fire: temperature, flame, ice
    {attr: 'fire', test: g => g.object === 'heat'},
    // Water: life-force and healing
    {attr: 'water', test: g => ['vitality', 'moisture'].includes(g.object)},
    // Yin: separation, spatial, perceptual
    {attr: 'yin', test: g => ['sense', 'conceal'].includes(g.verb) || (g.verb === 'move' && g.object === 'position')},
    // Yang: enhancement of a body or a working
    {attr: 'yang', test: g => ['add', 'alter'].includes(g.verb) && ['force', 'essence', 'lifespan', 'working'].includes(g.object) && ['self', 'touched', 'bound'].includes(g.target)},
    // Wind: atmosphere and environment, acting over a space
    {attr: 'wind', test: g => ['force', 'sound', 'light'].includes(g.object) && ['area', 'cone', 'line'].includes(g.target)},
    // Earth: internal and ground, a solid thing shaped or held
    {attr: 'earth', test: g => ['thing', 'form'].includes(g.object) && ['transform', 'block', 'bind'].includes(g.verb)},
];
export const predictAttribute = g => ATTR_RULES.find(r => r.test(g))?.attr ?? 'none';

export const SIN_RULES = [
    {sin: 'gluttony', test: g => g.verb === 'remove' && ['memory', 'information', 'soul'].includes(g.object)},
    {sin: 'lust', test: g => g.verb === 'transform' && ['form', 'vitality'].includes(g.object)},
    {sin: 'wrath', test: g => g.object === 'mind' && ['alter', 'bind', 'add'].includes(g.verb)},
    {sin: 'sloth', test: g => g.verb === 'move' && ['force', 'thing', 'position'].includes(g.object)},
    {sin: 'greed', test: g => g.object === 'time' && ['alter', 'bind'].includes(g.verb)},
    {sin: 'vainglory', test: g => ['law', 'luck'].includes(g.object)},
    {sin: 'envy', test: g => g.object === 'relation'},
    {sin: 'pride', test: g => ['end', 'block'].includes(g.verb)},
];
export const predictSin = g => SIN_RULES.find(r => r.test(g))?.sin ?? 'none';

// Capability slugs (PWC5): each names an engine capability the row needs and the engine lacks. A row's state names the
// first that fires in this order; all that fire go in `blockers` for the cross-world histogram. Checked 2026-11-16 against
// src: fixed-start month loops exist for Mother of Learning (src/mol_zorian_loop.js, src/harm_loops.js) and the player-marked
// return point with memory carry exists as the continuation faculty (src/continuation_state.js, TT1 in the time-travel doc),
// so Return by Death is not "no loops": its gap is the death trigger on a checkpoint the holder does not choose.
export const CAPABILITIES = {
    'death-checkpoint-rewind': 'Rewinds the world on the holder\'s death to a hidden checkpoint that moves on events, memory-only carry (R1, R2, R3)',
    'speech-penalty': 'A penalty keyed to the speaker and the act of telling, with a site exemption (R25)',
    'mind-binding': 'Binds, alters or compels another mind (verb bind or alter on mind)',
    'memory-erasure': 'Removes a name or memory from other minds and records (R10, R11)',
    'power-transfer': 'A power that moves to a successor on the holder\'s death or by selection (R6, R12)',
    'holder-mind-drift': 'The power warps its holder over time (PWC6)',
    'spirit-contract-judgement': 'Contract breach judged by the contractor\'s belief and wording (R30)',
    // PWC27 (2026-11-17, proposal): capabilities a chapter-read effect sentence needs, from the shared reader list.
    'protection-field': 'A ward or shield around a person or place that stops harm (PWC27)',
    'divination': 'Learns what is hidden, distant or to come by a power (PWC27)',
    'mind-state': 'Changes the holder\'s or another\'s mood, senses or will without binding it (PWC27)',
    'containment-rule': 'A power held in a place or vessel by a rule or seal (PWC27)',
    'formation-field': 'An arranged ground or circle that sets the field the power acts in (PWC27)',
    'power-interaction': 'The effect depends on another power meeting or cancelling it (PWC27)',
    'effect-unknown': 'The evidence states no effect to express',
};
export const CAPABILITY_ORDER = Object.keys(CAPABILITIES);

// route_to_player (PWC4): authored suggestions keyed by the route the evidence states, from the round 2 proposals
// (DEEP_DIVE_2026-10-24.md l.90-97: hidden gate stat, a 1-in-N blessing roll as a world dial, no Witch Factor in the
// default kit). Labelled authored and proposal; none is a source fact.
export const ROUTE_TO_PLAYER = {
    birth: 'hidden roll at birth, revealed by a palm scan or first overload (world dial)',
    inheritance: 'passes from a dying holder to a successor the power selects; not offered in a default start',
    'factor-transfer': 'the Factor selects a bearer after its holder dies; not offered in a default start',
    contract: 'a pact with a spirit or person, with its own terms and a belief-judged breach',
    learned: 'study and practice with a teacher, bounded by gate size and affinity',
    trial: 'a gated trial such as the Sanctuary tomb, passed by an accepted choice',
    artifact: 'held through an item, crystal or book with its own custody',
    grant: 'granted or conferred by another holder or a Witch',
    other: 'no start route stated; a world dial',
    unknown: 'no start route stated; a world dial',
};
export const ROUTES = Object.keys(ROUTE_TO_PLAYER);
export const KNOWERS = ['public', 'holder', 'institution', 'none', 'unknown'];
