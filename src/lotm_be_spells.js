// Klein's Spirit Vision as a repeatable cast (W2b, proposal under AD32, LT2 second caller): the shared spell-cast lowering with LOTM's own law.
// Default, dial, reason: the cost is spirituality (beSeerUse(), the pool the Seer potion brings), not stamina, and LOTM states no failure number
// (lotmSpellAdapter has chance null; its law is strain and the exhaustion that ending the vision leaves), so lowerSpellCasts returns this command
// plain with no fizzle outcomes. That is the contrast with Harry's levitation charm (hp_lead_spells.js): same lowering, different local law (AR11).
// It reuses the story's own fact for "vision open": the condition BE_SPIRIT_VISION that the content act `book.lotm.kj3p.switch` turns on, with the
// same requires (the Seer source held, vision closed, mind not worn out). The cast opens it for a while; the story's two-tap switch-off still ends it
// and leaves its exhaustion. Proposal dial: 60 minutes open; the text gives no length for a held vision (ch33 has it on until Klein stops).
// A lapse after the time ends the vision without a notch of exhaustion (only the deliberate ending leaves one). Gaps: the glabella tap itself is not
// a requirement here (the story act names it); the wording below is a plain player note.
import {definePowerGrammar} from './power_grammar.js';
import {lotmPowerPrices, LOTM_SPIRIT_VISION_PARTS} from './power_grammar_worlds.js';
import {lotmSpellAdapter} from './spell_adapter_lotm.js';
import {lowerSpellCasts, spellCastFacts} from './spell_cast_lowering.js';
import {beSpiritVisionOnRequires, beSpiritVisionOnEffects, beSeerCogitateEffects, BE_SEER_SOURCE, BE_SEER_ENERGY_ID, BE_SEER_ENERGY} from './book_world_lotm_be_seer.js';

const WORLD = 'book.lotm.tingen', PREFIX = 'book.lotm.be.sp', KEY = 'spirit_vision';
export const BE_SPIRIT_VISION_OPEN_MINUTES = 60;
// Practice (Weibao, 2026-11-08): each opening develops the Seer faculty by one, its control with use. Default, dial, reason: one per
// opening; the amount is the dial. LOTM's own law still moves Sequences by digesting the potion through acting; practice does not
// replace or speed that law, it is a second, separate growth (the world's core rule stays, use is not the only way).
const note = value => ({type: 'knowledge', key: 'book.lotm.be.spell.spirit_vision.last', stage: 'understood', value});

export const lotmBePowerLaw = {...lotmPowerPrices,
    cost: values => {
        if(values.cost <= 0) return [];
        if(values.strain !== BE_SEER_ENERGY.strainPerUse) throw Error('Composed strain needs a matching native energy policy.');
        return [{type: 'energy', energyId: BE_SEER_ENERGY_ID, operation: 'use', output: Math.ceil(values.cost), control: Math.ceil(values.control)}];
    },
    functions: {open_vision: parts => [...beSpiritVisionOnEffects().map(e => ({...e, duration: parts.duration})),
        note('You tapped your brow and let your spirit open. Auras came into view, and your spirit began to drain.')],
        cogitate: parts => [...beSeerCogitateEffects(parts.magnitude), {type: 'knowledge', key: 'book.lotm.be.spell.cogitation.last', stage: 'understood', value: 'You held a familiar image in mind and let your thoughts settle. Your spirit feels steadier.'}]}};

export const lotmBeSpellSet = definePowerGrammar([{
    key: KEY, label: 'Open your Spirit Vision', sourceId: `${PREFIX}.seer`, origin: {kind: 'granted'}, fn: 'perception',
    formula: [{label: 'The Seer potion in you, the vision closed, a rested mind', requires: beSpiritVisionOnRequires()}],
    parts: LOTM_SPIRIT_VISION_PARTS, limit: {kind: 'none'},
    unstated: ['cost amount (spirituality is spent through its own pool use, not a stated number)', 'failure chance (none stated for abilities)']}],
    lotmBePowerLaw, lotmSpellAdapter({worldId: WORLD, prefix: PREFIX}));

const castId = lotmBeSpellSet.ids[KEY].command;
export const lotmBeChanceFact = id => `lotm.be.spell.${id.slice(PREFIX.length + 1)}.failChance`;

// A spell row must name a prefix-owned source, so the row uses a generated one and the command's requires are rewritten onto the story's own gate
// (the real Seer source, through the host fact lotm.beSeer.supported), as the Harry caller does for its power. The grammar's native energy-use price now travels through ability_records with the other costs.
export const lotmBeSpellCommands = lowerSpellCasts(lotmBeSpellSet, {chanceFact: lotmBeChanceFact, practice: {sourceOf: () => BE_SEER_SOURCE, amount: 1}}).filter(c => c.id === castId).map(c => ({
    ...c, group: 'book_lotm', worldId: WORLD, audience: ['$actor'],
    requires: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, beSpiritVisionOnRequires()], reason: 'You need the Seer potion in you and a rested mind.'}}));

export const lotmBeSpellFacts = state => spellCastFacts(state, lotmBeSpellSet, {chanceFact: lotmBeChanceFact});

// Taught Cogitation already restores this same pool in the story (ch32 P041).
// The one-unit recovery and ten-minute session are gameplay dials, not canon numbers.
export const lotmBeCogitationSet = definePowerGrammar([{key: 'cogitation', label: 'Cogitate quietly · 10 min',
    sourceId: `${PREFIX}.seer`, origin: {kind: 'granted'}, fn: 'support',
    parts: {functions: ['cogitate'], magnitude: 1, range: 0, duration: 10, targets: 1, tier: 9},
    formula: [{label: 'The Seer potion in you', requires: {fact: 'lotm.beSeer.supported', op: 'eq', value: true}},
        {label: 'Neil’s Cogitation lesson', requires: {fact: 'knowledge.book.lotm.kj3p.cogitation.seen.seen', op: 'eq', value: true}}],
    unstated: ['canon recovery amount', 'canon session length']}], lotmBePowerLaw, lotmSpellAdapter({worldId: WORLD, prefix: PREFIX}));
export const lotmBeCogitationCommands = lowerSpellCasts(lotmBeCogitationSet, {practice: {sourceOf: () => BE_SEER_SOURCE, amount: 1}})
    .filter(c => c.id === lotmBeCogitationSet.ids.cogitation.command).map(c => ({...c, duration: lotmBeCogitationSet.cards.cogitation.costBasis.parts.duration, cancellation: 'refund', group: 'book_lotm', audience: ['$actor'],
        requires: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, ...lotmBeCogitationSet.cards.cogitation.conditions.map(c=>structuredClone(c.requires))], reason: 'Learn Cogitation from Neil first.'},
        completionRequires: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, ...lotmBeCogitationSet.cards.cogitation.conditions.map(c=>structuredClone(c.requires))]}, completionFailure: 'refund', completionCoLocated: true}));

lotmBeSpellCommands.push(...lotmBeCogitationCommands);
