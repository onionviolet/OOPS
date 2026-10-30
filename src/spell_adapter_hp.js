// Harry Potter adapter for the spell seam (GM40, proposal): the second world, chosen for the most spell rows (325 SPL rows in the family table,
// 653 in the L10 sample; hp1_rules plans exist). It imports no LOTM module. What differs from LOTM, and why the seam is not LOTM-shaped:
// knowledge comes from lessons, books and watching (never a sequence); a cast needs a wand, words and a gesture (the formula); a spell is prepared
// only when it is held ready (a stated charm); failure is a skill chance that falls with mastery; there is no backlash ledger, so strain is refused.
// Defaults are authored proposals (WPR5): 40% at the needed mastery, 10 points less per extra mastery. Dial: per spell row or per world.
import {defineSpellAdapter} from './spell_seam.js';

export const hpSpellAdapter = (overrides = {}) => defineSpellAdapter({
    worldId: 'hp.world', prefix: 'hp.sp',
    origins: {teacher: {reason: 'Lessons and tutors teach most charms.'}, text: {reason: 'Books and notes teach some.'}, observed: {reason: 'Some are picked up by watching a cast.'},
        inherited: {reason: 'Some talents run in the blood.'}},
    failure: {chance: 0.4, perMastery: 0.1, reason: 'Skill: a charm is likelier to fizzle until it is practiced; no source gives a number.'},
    strain: {allowed: false, reason: 'No backlash ledger; a botched charm is a failed effect.'},
    ...overrides});

// Formula from wand and words. wand: true when a wand must be in hand. words: when an incantation is spoken (a blocker, silence, refuses it).
export const hpFormula = ({wand = true, words = null, locator} = {}) => [
    ...(wand ? [{label: 'Wand in hand', requires: {fact: 'actor.hp.wand_held', op: 'eq', value: true}, ...(locator ? {locator} : {})}] : []),
    ...(words ? [{label: `Say "${words}"`, requires: {fact: 'actor.hp.can_speak', op: 'eq', value: true}, ...(locator ? {locator} : {})}] : [])];

// A learnable-spells pack row (ability-record shape with a `learn` block) to a spell row. Teacher becomes a teacher origin; the rest keeps its shape.
export function spellFromLearnRow({learn, conditions, ruleId, ...row}) {
    const {teacher, prerequisites, lessonCost, practice, masteryNeeded, signs} = learn;
    return {...row, formula: conditions, origin: {kind: 'teacher', gate: teacher, ...(prerequisites ? {prerequisites} : {}), ...(lessonCost ? {lessonCost} : {})},
        ...(practice ? {practice} : {}), ...(masteryNeeded != null ? {masteryNeeded} : {}), ...(signs ? {signs} : {})};
}
