// FD11 shared lesson seam (proposal, reversible). A lesson is: a teacher who is available (a recurring window plus
// present/busy blockers), something taught (an instruction-basis knowledge fact), a time and cost the host act carries, and
// an optional skill step paid through the existing native {type:'xp'} effect (FD5 ladder and skill XP stay the owners).
// Pure data helpers; no state, clock or save. Consumers: Klein's Old Neil divination lesson (beDivMethodLearnEffects);
// next named consumer: HP classes (not built).
import {recurringWindow} from './world_rhythm.js';

/** Availability: the window is open and no blocker applies. `blockers` is [[truthy-when-blocked, reason], ...]. */
export function lessonAvailability(schedule, minute, blockers = []) {
    const window = recurringWindow(schedule, minute);
    const blocked = blockers.find(([on]) => on);
    return {window, available: !!window.open && !blocked, cause: blocked ? blocked[1] : ''};
}

/** What the learner gains: one knowledge fact (basis instruction, attributed to the teacher) and optionally one skill step. */
export function lessonEffects({key, value, situationId, teacherId = 'player', actor = 'player', stage = 'understood', skill, xp}) {
    const effects = [{type: 'knowledge', actor, key, stage, value, basis: {kind: 'instruction', attributedTo: teacherId, situationId}}];
    if(skill && xp > 0) effects.push({type: 'xp', skill, amount: xp});
    return effects;
}
