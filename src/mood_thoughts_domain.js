// MND5 slice owner: the saved thought rows (optional top-level key `moodThoughts`, SAVES 2026-11-10). Imports no world (AR3).
// Worlds write through addMoodThought and read through readMood; the clock is the caller's played minute (TMR1).
import {registerDomain} from './domain_registry.js';
import {freshThoughts, validateThoughts, addThought, moodOf, pruneThoughts, runningThoughts} from './mood_thoughts.js';
let slice = freshThoughts(), lastNow = 0;
export const addMoodThought = (thought, now) => { slice = addThought(slice, thought, now); lastNow = Math.max(lastNow, now); return slice; };
export const readMood = (holder, now) => moodOf(slice, holder, now);
// FRC51 (mind meters): the running rows themselves, and one validated edit for pure slice functions (cancel, close a route).
export const moodRows = (holder, now) => runningThoughts(slice, holder, now);
export const editMoodThoughts = (edit, now) => { slice = validateThoughts(edit(slice)); lastNow = Math.max(lastNow, now); return slice; };
registerDomain({id: 'moodThoughts', deps: [], initialState: freshThoughts,
    // Only thoughts still running are written; an untouched life or one with nothing running writes no key.
    save: () => { const live = pruneThoughts(slice, lastNow); return live.rows.length ? structuredClone(live) : undefined; },
    validate: s => { validateThoughts(s); },
    load: s => { slice = s ? structuredClone(validateThoughts(s)) : freshThoughts(); lastNow = 0; },
    projection: (holder, now) => moodOf(slice, holder, now)});
