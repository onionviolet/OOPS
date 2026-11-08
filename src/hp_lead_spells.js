// Harry's levitation charm as a cast (W1b, proposal under AD32, LT2): a spell row through the shared spell seam and the shared cast lowering.
// Default, dial, reason: stamina 1 per cast (HP's local cost source; a LOTM caller pays spirituality instead), spent whether the feather rises
// or not. The chance is the first-year dial already used by the Charms class (60% at no practice, 10 points less per step; hpLeadLessons owns it).
// The charm is the power Harry learns in his first Charms lesson (HP_LEVITATION, model 'practice'). A spell row cannot name an existing power
// (ability_records derives `<prefix>.power.<key>`), so the row is lowered and the one cast command is rewritten onto HP_LEVITATION; the generated
// learn/practice commands and power are dropped because the Charms lesson and practice already own them, and the faculty-source requirement is
// dropped because a learned power is the gate here. The cast needs the learned power and being at the school.
// Gaps (unstated, not invented): the wand and the spoken words. The lead life holds no wand fact or item at his first Charms lesson (the wand
// item book.hp.lead.w4_wand belongs to a later window) and no speech fact, so neither is required; both are listed on the row's `unstated`.
// Cast mastery gain is not modelled here: the Charms class refines the power.
import {defineSpells} from './spell_seam.js';
import {hpSpellAdapter} from './spell_adapter_hp.js';
import {lowerSpellCasts, spellCastFacts} from './spell_cast_lowering.js';
import {HP_LEVITATION} from './world_packs/book_hp_lead_life_data.js';

const WORLD = 'book.hp.lead.world', PREFIX = 'book.hp.lead.sp', HALL = 'book.hp.lead.school_hall', KEY = 'levitation_charm';
const note = (key, value) => ({type: 'knowledge', key: `book.hp.lead.${key}`, stage: 'understood', value});
const alive = {fact: 'actor.life', op: 'eq', value: 'alive'};

export const hpLeadSpellSet = defineSpells([{
    key: KEY, label: 'Cast the levitation charm on a feather', sourceId: `${PREFIX}.charm`, origin: {kind: 'teacher'}, fn: 'support',
    formula: [{label: 'At Hogwarts', requires: {fact: 'actor.hp.lead.atSchool', op: 'eq', value: true}}],
    cost: [{type: 'vital', key: 'stamina', amount: -1}],
    effects: [note('spell.levitation.last', 'You made the motion and said the words, and the feather rose off the desk.')],
    failure: {chance: 0.6, perMastery: 0.1, outcome: [note('spell.levitation.last', 'You made the motion and said the words, and the feather only shivered. You noticed what you did wrong.')]},
    unstated: ['wand (the lead life holds no wand fact at his first Charms lesson)', 'spoken words (no speech fact in the lead life)']}],
    hpSpellAdapter({worldId: WORLD, prefix: PREFIX}));

const castId = hpLeadSpellSet.ids[KEY].command;
export const hpLeadChanceFact = id => `hp.lead.spell.${id.slice(PREFIX.length + 1)}.failChance`;

export const hpLeadSpellCommands = lowerSpellCasts(hpLeadSpellSet, {chanceFact: hpLeadChanceFact}).filter(c => c.id === castId).map(c => {
    const own = hpLeadSpellSet.cards[KEY];
    return {...c, powerId: HP_LEVITATION, group: 'structured_local', worldId: WORLD, location: HALL, audience: ['$actor'],
        requires: {all: [alive, ...own.conditions.map(x => structuredClone(x.requires)), {fact: `power.${HP_LEVITATION}.owned`, op: 'eq', value: true, reason: 'Learn the charm in Charms first.'}],
            reason: 'You need to be at Hogwarts and to know the charm.'}};
});

export const hpLeadSpellFacts = state => spellCastFacts(state, hpLeadSpellSet, {chanceFact: hpLeadChanceFact, powerOf: () => HP_LEVITATION});
