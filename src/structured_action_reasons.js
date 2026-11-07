// What a locked structured action says when the engine could only refuse with its fallback (OPN4, UR73).
// The engine reads a command's own top-level `reason`; the reasons authored on leaves inside all() never
// surface, and a command's definition is pinned by content hash (saved lives, school extension), so a
// reason cannot be added to the definition without breaking saves. This table is display only, keyed by
// command id, in each world's voice: what is missing in the character's terms, effect first (PRS4).
import {evaluateRule} from './rules.js';
import {UNMET_REASON} from './player_reasons.js';

export const STRUCTURED_ACTION_REASONS = Object.freeze({
    // Harry Potter, school life: a posted timetable and a loaned wand.
    'book.hp.school.lesson_plants': 'The posted lesson is closed, or there is not enough time left to complete it.',
    'book.hp.school.practice_levitation': 'Learn this method in a lesson first, and hold a practice wand.',
    'book.hp.school.practice_repair_glass': 'Learn this method in a lesson first, and hold a practice wand.',
    'book.hp.school.return_wand': 'You have not borrowed a practice wand.',
    // Reverend Insanity, academy: one Gu to refine, a reserve to spend, petals that spoil.
    'book.ri.academy.learn': 'Refine the Moonlight Gu with Lin first.',
    'book.ri.academy.recover': 'Your primeval reserve is already full.',
    'book.ri.academy.prepare_4': 'Refine the Moonlight Gu first, while the petals are fresh.',
    'book.ri.academy.prepare_8': 'Refine the Moonlight Gu first, while the petals are fresh.',
    'book.ri.academy.prepare_12': 'Refine the Moonlight Gu first, while the petals are fresh.',
    // Shadow Slave, apprentice: study the keepsake, fit each piece once, bind the pair, then practice it.
    'book.ss.apprentice.fit_coat': 'Study your keepsake until you know its pattern. Each piece takes the fitting once.',
    'book.ss.apprentice.fit_gloves': 'Study your keepsake until you know its pattern. Each piece takes the fitting once.',
    'book.ss.apprentice.bind_pair': 'Fit the lattice to both pieces first, and keep them in your bag.',
    'book.ss.apprentice.practice_pair': 'Bind the coat and gloves together first.',
    'book.ss.apprentice.rest_essence': 'Your essence is already full.',
    // Shadow Slave, company: a shadow in storage, a patrol to accept, splinters to pull.
    'book.ss.company.recall': 'Your shadow is already in storage.',
    'book.ss.company.prepare': 'Manifest your living shadow first, and remove any embedded splinters.',
    'book.ss.company.prepare_rope': 'Accept and provision a patrol first. Each piece goes in once.',
    'book.ss.company.prepare_brace': 'Accept and provision a patrol first. Each piece goes in once.',
    'book.ss.company.enter': 'Accept and provision a patrol first.',
    'book.ss.company.treat': 'You have no splinters to remove.',
    // Shadow Slave, trial: prepare, cross, settle.
    'book.ss.trial.enter': 'Prepare for the crossing first.',
    'book.ss.trial.treat': 'You have no injury to treat.',
});

// A leaf's own authored reason, read the way the author meant it, for the commands the table does not name.
// A sequenced act lists every earlier scene; the first unmet is the one to do next, and the rest are counted.
function authored(rule, facts, out) {
    if(!rule) return out;
    if(rule.all || rule.any) {
        for(const child of rule.all || rule.any) authored(child, facts, out);
        return out;
    }
    if(rule.not || evaluateRule(rule, facts).met) return out;
    if(typeof rule.reason === 'string' && rule.reason && rule.reason !== UNMET_REASON) out.add(rule.reason);
    return out;
}

// "First: <scene>." for the next unmet scene, plus how many more come before this one (hp.lead's acts have no clock gate).
function sequenceReason(all) {
    if(!all.length) return [];
    const more = all.filter(r => r.startsWith('First: ')).length - 1;
    return [more > 0 && all[0].startsWith('First: ') ? `${all[0]} ${more === 1 ? 'One more scene comes' : `${more} more scenes come`} before this.` : all[0]];
}

/** Replaces the engine fallback in a locked action's reasons with the table text, else the leaves' own words. */
export function structuredActionReasons(command, reasons, facts) {
    if(!reasons.includes(UNMET_REASON)) return reasons;
    const own = STRUCTURED_ACTION_REASONS[command.id] ? [STRUCTURED_ACTION_REASONS[command.id]] : facts ? sequenceReason([...authored(command.requires, facts, new Set())]) : [];
    return own.length ? [...new Set(reasons.flatMap(r => r === UNMET_REASON ? own : [r]))] : reasons;
}
