// Harry's levitation charm as a cast (W1b, proposal under AD32, LT2): a spell row through the shared spell seam and the shared cast lowering.
// Default, dial, reason: stamina 1 per cast (HP's local cost source; a LOTM caller pays spirituality instead), spent whether the feather rises
// or not. The chance is the first-year dial already used by the Charms class (60% at no practice, 10 points less per step; hpLeadLessons owns it).
// The charm is the power Harry learns in his first Charms lesson (HP_LEVITATION, model 'practice'). A spell row cannot name an existing power
// (ability_records derives `<prefix>.power.<key>`), so the row is lowered and the one cast command is rewritten onto HP_LEVITATION; the generated
// learn/practice commands and power are dropped because the Charms lesson and practice already own them, and the faculty-source requirement is
// dropped because a learned power is the gate here. The cast needs the learned power and being at the school.
// Gaps (unstated, not invented): the wand and the spoken words. The lead life holds no wand fact or item at his first Charms lesson (the wand
// item book.hp.lead.w4_wand belongs to a later window) and no speech fact, so neither is required; both are listed on the row's `unstated`.
// Each cast, lifted or not, adds one step of practice to the charm (Weibao, 2026-11-08), the same step a Charms class try adds.
import {definePowerGrammar} from './power_grammar.js';
import {hpPowerPrices, HP_LEVITATION_PARTS} from './power_grammar_worlds.js';
import {hpSpellAdapter} from './spell_adapter_hp.js';
import {lowerSpellCasts, spellCastFacts} from './spell_cast_lowering.js';
// Shared save identity, pinned against the life-data export by spell_cast_lowering tests.
const HP_LEVITATION = 'book.hp.lead.levitation';

const WORLD = 'book.hp.lead.world', PREFIX = 'book.hp.lead.sp', HALL = 'book.hp.lead.school_hall', KEY = 'levitation_charm';
const note = (key, value) => ({type: 'knowledge', key: `book.hp.lead.${key}`, stage: 'understood', value});
const alive = {fact: 'actor.life', op: 'eq', value: 'alive'};

export const hpLeadPowerLaw = {...hpPowerPrices, functions: {levitate: () => [note('spell.levitation.last', 'You made the motion and said the words, and the feather rose off the desk.')]}};

export const hpLeadSpellSet = definePowerGrammar([{
    key: KEY, label: 'Cast the levitation charm on a feather', sourceId: `${PREFIX}.charm`, origin: {kind: 'teacher'}, fn: 'support',
    formula: [{label: 'At Hogwarts', requires: {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true}}],
    parts: HP_LEVITATION_PARTS,
    failureOutcome: [note('spell.levitation.last', 'You made the motion and said the words, and the feather only shivered. You noticed what you did wrong.')],
    unstated: ['wand (the lead life holds no wand fact at his first Charms lesson)', 'spoken words (no speech fact in the lead life)']}],
    hpLeadPowerLaw, hpSpellAdapter({worldId: WORLD, prefix: PREFIX}));

const castId = hpLeadSpellSet.ids[KEY].command;
export const hpLeadChanceFact = id => `hp.lead.spell.${id.slice(PREFIX.length + 1)}.failChance`;

export const hpLeadSpellCommands = lowerSpellCasts(hpLeadSpellSet, {chanceFact: hpLeadChanceFact, practice: {powerOf: () => HP_LEVITATION, amount: 1}}).filter(c => c.id === castId).map(c => {
    const own = hpLeadSpellSet.cards[KEY];
    return {...c, powerId: HP_LEVITATION, group: 'structured_local', worldId: WORLD, location: HALL, audience: ['$actor'],
        requires: {all: [alive, ...own.conditions.map(x => structuredClone(x.requires)), {fact: `power.${HP_LEVITATION}.owned`, op: 'eq', value: true, reason: 'Learn the charm in Charms first.'}],
            reason: 'You need to be at Hogwarts and to know the charm.'}};
});

export const hpLeadSpellFacts = state => ({...spellCastFacts(state, hpLeadSpellSet, {chanceFact: hpLeadChanceFact, powerOf: () => HP_LEVITATION}), ...hpLeadAdditionalSpellFacts(state)});

// A second application of the learned charm, not a second learned power. The
// lesson supplier issues one practice feather; the transfer owner conserves it.
export const HP_LEAD_FEATHER_ID = 'book.hp.lead.item.practice_feather';
export const HP_LEAD_FEATHER_KEY = JSON.stringify({id: HP_LEAD_FEATHER_ID});
export const hpLeadPowerItems = [{id: HP_LEAD_FEATHER_ID, name: 'Practice feather', description: 'A feather from Charms, light enough to practise on.', value: 0, tags: {feather: true}}];
export const hpLeadSpellIssueEffects = [{type: 'item', key: HP_LEAD_FEATHER_KEY, amount: 1}];
const passingLaw = {...hpLeadPowerLaw, functions: {...hpLeadPowerLaw.functions,
    pass_feather: parts => [{type: 'transfer', from: '$actor', to: 'book.hp.lead.ron', key: HP_LEAD_FEATHER_KEY, count: parts.targets}, note('spell.passing.last', 'The feather floated over to Ron. He caught it before it reached his nose.')]}};
export const hpLeadPassingSpellSet = definePowerGrammar([{key: 'pass_feather', label: 'Float your feather over to Ron',
    sourceId: `${PREFIX}.charm`, origin: {kind: 'teacher'}, fn: 'craft',
    parts: {functions: ['levitate', 'pass_feather'], magnitude: 1, range: 1, duration: 0, targets: 1, tier: 1},
    formula: [{label: 'At Hogwarts', requires: {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true}},
        {label: 'A practice feather to hand', requires: {fact: `item.${HP_LEAD_FEATHER_KEY}`, op: 'gte', value: 1, reason: 'You need your practice feather.'}}],
    failureOutcome: [note('spell.passing.last', 'The feather wobbled and fell back beside you.')],
    unstated: ['canon range band', 'canon stamina cost', 'spoken words (no speech fact in the lead life)']}], passingLaw, hpSpellAdapter({worldId: WORLD, prefix: PREFIX}));
export const hpLeadAdditionalSpellCommands = lowerSpellCasts(hpLeadPassingSpellSet, {chanceFact: hpLeadChanceFact, practice: {powerOf: () => HP_LEVITATION, amount: 1}})
    .filter(c => c.id === hpLeadPassingSpellSet.ids.pass_feather.command).map(c => ({...c, powerId: HP_LEVITATION, group: 'structured_local', worldId: WORLD, location: HALL, audience: ['$actor'], participants: ['player', 'book.hp.lead.ron'], participantsCoLocated: true,
        requires: {all: [alive, ...hpLeadPassingSpellSet.cards.pass_feather.conditions.map(x => structuredClone(x.requires)),
            {fact: `power.${HP_LEVITATION}.owned`, op: 'eq', value: true, reason: 'Learn the charm in Charms first.'}], reason: 'You need to know the charm and have a practice feather at Hogwarts.'}}));
export const hpLeadAdditionalSpellFacts = state => spellCastFacts(state, hpLeadPassingSpellSet, {chanceFact: hpLeadChanceFact, powerOf: () => HP_LEVITATION});

hpLeadSpellCommands.push(...hpLeadAdditionalSpellCommands);
