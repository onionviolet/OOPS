// MND5 second world (proposal, FRC39, AD51): Ron's mood in the Harry Potter lead life, on the same pure reader as Captain Dunn's.
// Adapted shape, with the reason: LOTM writes Dunn's thoughts from a host command (the weekly filing), but HP school moments are
// data-driven native commands with no completion hook. Every moment that moves Ron already leaves a dated note in the player's
// knowledge (`at` on the root clock, TMR1), so Ron's thought rows are rebuilt from those notes on each read through the core's own
// addThought (limits, keys, stacking) and moodOf (fade, sum, band). Nothing new is saved: the notes are the record, so a second
// copy of the same fact in `moodThoughts` would be two owners of one event. Dial: a later HP producer with no dated note of its own
// writes through mood_thoughts_domain's addMoodThought, and this reader would add the stored rows. The stored slice stays one-world.
// Imports no domain: the world pack data registers this beside its ties, so the `mood.ron` fact exists wherever the offer gate does.
// Canon sets where the mood lands (STY33): Ron is cross after a charm goes wrong for him, glad when Harry wins, and the troll night
// makes the three of them friends. The route varies by timing: how long Harry waits, and what else happened in those days.
import {addThought, freshThoughts, moodOf} from './mood_thoughts.js';
import {registerTieMood} from './person_ties.js';
import {temperamentFromTraits} from './person_temperament.js';

const P = 'book.hp.lead', DAY = 24 * 60;
export const HP_RON_ID = P + '.ron';
const HOUSE_FACT = 'hp.lead.house'; // book_world_hp_positions.js HP_HOUSE_FACT; Ron is met at the Sorting
// One row per dated note. Magnitudes and run lengths are calibration hints (SKR11), not source numbers.
// The first two notes ship in the public life; the Halloween and match notes come from the private school continuations.
export const RON_MOOD = Object.freeze([
    {note: P + '.tie.ron.sorting', source: 'hp.sorting', subject: 'player', magnitude: 6, minutes: 2 * DAY, line: 'the hat put you in Gryffindor beside him'},
    {note: P + '.tie.ron.charms', source: 'hp.charm.stuck', subject: P + '.levitation', magnitude: -6, minutes: DAY, line: 'his feather would not leave the desk in Charms'},
    {note: P + '.w7_halloween.charms.seen', source: 'hp.charm.corrected', subject: P + '.hermione', magnitude: -8, minutes: 2 * DAY, line: 'Hermione corrected his charm in front of the class'},
    {note: P + '.w7_halloween.thanks.seen', source: 'hp.troll.friends', subject: 'player', magnitude: 10, minutes: 4 * DAY, line: 'you faced the troll together and came out of it friends'},
    {note: P + '.w8_quidditch.catch.seen', source: 'hp.match.won', subject: 'player', magnitude: 8, minutes: 3 * DAY, line: 'you caught the Snitch and Gryffindor beat Slytherin'}]);

// Ron's thought rows as of the notes the save holds, oldest first, each run scaled by Ron's own temperament (MND2, as dunnTempo).
export function ronThoughts(state) {
    const known = state?.simulation?.knowledge?.player || {}, t = temperamentFromTraits(state?.simulation?.people?.[HP_RON_ID]?.traits);
    const dated = RON_MOOD.flatMap(row => Number.isSafeInteger(known[row.note]?.at) ? [{row, at: known[row.note].at}] : []).sort((a, b) => a.at - b.at);
    let slice = freshThoughts();
    for(const {row, at} of dated) slice = addThought(slice, {holder: HP_RON_ID, subject: row.subject, source: row.source, magnitude: row.magnitude,
        minutes: Math.max(1, Math.round(row.minutes * (row.magnitude < 0 ? t.harmFade : t.helpFade))), line: row.line, key: row.note}, at);
    return slice;
}
// {total, band, rows} once Ron is met, else null (the tie fact then reads 0).
export const ronMood = state => Number.isSafeInteger(state?.clock) && state.actors?.player?.facts?.[HOUSE_FACT] ? moodOf(ronThoughts(state), HP_RON_ID, state.clock) : null;
registerTieMood(P + '.world', (state, personId) => personId === HP_RON_ID ? ronMood(state) : null);
