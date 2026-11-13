// MND5 slice owner: the saved thought rows (optional top-level key `moodThoughts`, SAVES 2026-11-10). Imports no world (AR3).
// Worlds write through addMoodThought and read through readMood; the clock is the caller's played minute (TMR1).
import {registerDomain} from './domain_registry.js';
import {freshThoughts, validateThoughts, addThought, moodOf, pruneThoughts} from './mood_thoughts.js';
let slice = freshThoughts(), lastNow = 0;
export const addMoodThought = (thought, now) => { slice = addThought(slice, thought, now); lastNow = Math.max(lastNow, now); return slice; };
export const readMood = (holder, now) => moodOf(slice, holder, now);
registerDomain({id: 'moodThoughts', deps: [], initialState: freshThoughts,
    // Only thoughts still running are written; an untouched life or one with nothing running writes no key.
    save: () => { const live = pruneThoughts(slice, lastNow); return live.rows.length ? structuredClone(live) : undefined; },
    validate: s => { validateThoughts(s); },
    load: s => { slice = s ? structuredClone(validateThoughts(s)) : freshThoughts(); lastNow = 0; },
    projection: (holder, now) => moodOf(slice, holder, now)});
// Read-only view of the live rows for derived readers outside this owner (companion_opinion.js). Never mutate it.
export const thoughtRows = () => slice;
