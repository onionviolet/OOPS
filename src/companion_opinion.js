// Opinion of the keeper (CPR18, FRC55; proposal under AD32). Caves of Qud keeps a follower's opinion apart from its allegiance,
// with its own duration, and leaving the party keeps it. Here allegiance is the claim and the being record's tie (CPR10); opinion
// is a reader over attributed thought rows (mood_thoughts.js, MND5): what `holder` thinks of `subject`, summed from the running
// rows it keeps about that one person. Nothing is stored apart from those rows, so the opinion outlasts giving the creature back.
// THIN READER: the opinion lane (branch claude/opinion-thoughts-ac63b6) adds `opinionOf` and a `kind: 'social'` row marker.
// When that merges, this file uses them on its own (the namespace import below); until then it sums the holder's rows about the
// subject with the mood reader, and written rows carry no `kind` (master's validator rejects it), so they also count as mood.
import * as thoughts from './mood_thoughts.js';
import {thoughtRows, addMoodThought} from './mood_thoughts_domain.js';
const SOCIAL = typeof thoughts.opinionOf === 'function';
// Band edges: the opinion lane's dials when present, else the same defaults (a few remembered acts either way).
const COOL = thoughts.THOUGHT_LIMITS.cool ?? -5, FOND = thoughts.THOUGHT_LIMITS.fond ?? 8;
export const opinionBand = total => total <= COOL ? 'cool' : total >= FOND ? 'fond' : 'even';
export function opinionOfSlice(slice, holder, subject, now) {
    if(SOCIAL) return thoughts.opinionOf(slice, holder, subject, now);
    const {total, rows} = thoughts.moodOf({schema: 1, rows: (slice?.rows || []).filter(r => r.subject === subject)}, holder, now);
    return {total, band: opinionBand(total), rows};
}
export const readKeeperOpinion = (holder, subject, now) => opinionOfSlice(thoughtRows(), holder, subject, now);
// The one writer for opinion rows: the caller supplies a key per occasion so a replay or a later save writes nothing twice.
export function rememberAbout(row, now) { addMoodThought({...row, ...(SOCIAL ? {kind: 'social'} : {})}, now); }
// Facts for rules: the target's opinion of the acting actor. Derived each read, never written (one authority, AR3).
export function opinionFacts(state, context) {
    const target = context?.targetId, actor = context?.actorId;
    if(!target || !actor || !Number.isSafeInteger(state?.clock) || !state.simulation?.people?.[target]) return {};
    const o = readKeeperOpinion(target, actor, state.clock);
    return {'target.opinion.total': o.total, 'target.opinion.band': o.band};
}
