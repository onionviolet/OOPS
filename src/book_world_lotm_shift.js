// Klein's office day after the story window (lead core-flow audit, loop K2 on the shared day shape PS5; proposal under AD32, AD56, ACR1, ACR6).
// The book has him keep office hours for the Nighthawks at the Blackthorn Security front: the reception desk, reading in the archives,
// and the team's turns guarding Chanis Gate. A shift spends its hours through the host's clock (the cells-sentence route) and leaves one
// result line in his knowledge and in Reports. Pay stays the weekly salary (book_world_lotm_wage.js); shifts are counted for the pay week
// beside it and never gate it (a gate on pay would be a limit, which waits for Weibao under AD56; the open question is in the audit).
// Pure: the host passes the life's day and hour (castCalendar); nothing here reads the clock or saves.
// Dials keep `why` (source or authoring note, code only) and `say` (what the player reads, PRS1).
import {wageView, WAGE_WEEK, WAGE_START_NOTE} from './book_world_lotm_wage.js';
import {fnv1a, mix32} from './hash_rng.js';

export const SHIFT_NOTE = 'book.lotm.shift.last';
export const SHIFT_DAY_FACT = 'book.lotm.shift.day';
export const SHIFT_WEEK_FACT = 'book.lotm.shift.week';
export const SHIFT_COUNT_FACT = 'book.lotm.shift.count';
const SITUATION = 'book.lotm.tingen.canon_beside'; // the cast situation, as the wage names it
export const SHIFT_KINDS = Object.freeze({
    desk: Object.freeze({label: 'Keep the reception desk', minutes: 4 * 60, from: 9, until: 13,
        why: 'Stated: the team keeps a security company front with a reception room that a clerk minds in office hours. Four hours and the morning window are authored.',
        say: 'Four hours at the front desk of Blackthorn Security, from a morning start.'}),
    archive: Object.freeze({label: 'Read in the archives', minutes: 4 * 60, from: 9, until: 15,
        why: 'Stated: he spends office time reading the team\'s archives and mysticism records. Four hours and the day window are authored.',
        say: 'Four hours with the team\'s files and records, any time from morning to mid-afternoon.'}),
    gate: Object.freeze({label: 'Take a turn at Chanis Gate', minutes: 6 * 60, from: 19, until: 23,
        why: 'Stated: the team takes turns guarding what lies behind Chanis Gate. Six hours from an evening start are authored.',
        say: 'Six hours on the night guard below the office, from an evening start.'})
});
// What a shift turns up, drawn once per day and kind (seeded by the life's seed): mostly quiet, sometimes a line worth a second look.
// Authored rows; none decides a case or reveals a sealed truth.
const TURNS = Object.freeze({
    desk: ['Nobody came in all morning. You sorted the post and kept the stove going.',
        'A woman asked whether the company finds lost pets. You took her address and said someone would call.',
        'A constable left a file for the captain and would not say what it was about.'],
    archive: ['You read through the old case files on the shelf by the window and copied out the names that keep coming back.',
        'A record on charms and their limits held you for most of the afternoon.',
        'You found a file whose last page is missing. The index says it was sent upstairs.'],
    gate: ['The turn passed quietly. The lamps along the passage never flickered.',
        'Once, late, you thought the air below the gate went cold. It passed.',
        'You and the other guard kept each other awake with cards and did not talk about the door.']
});
const pick = (seed, day, kind) => TURNS[kind][mix32(fnv1a(Number.isFinite(seed) ? seed >>> 0 : 1, `lotm.shift:${day}:${kind}`)) % TURNS[kind].length];
const facts = state => state?.actors?.player?.facts || {};
// The pay week this shift falls in: the wage's own weeks once he draws pay, otherwise the life's 7-day weeks.
const weekOf = (state, day) => { const at = state?.simulation?.knowledge?.player?.[WAGE_START_NOTE]?.at;
    return Number.isFinite(at) ? Math.floor((state.clock - at) / WAGE_WEEK) : Math.floor(day / 7); };

// {kinds: [{id, label, minutes, say, eligible, reason}], doneToday, thisWeek, last}; null for a life without the Nighthawk contract.
export function shiftView(state, {day, hour} = {}) {
    if(!wageView(state)) return null;
    const f = facts(state), doneToday = f[SHIFT_DAY_FACT] === day, week = weekOf(state, day);
    const thisWeek = f[SHIFT_WEEK_FACT] === week && Number.isSafeInteger(f[SHIFT_COUNT_FACT]) ? f[SHIFT_COUNT_FACT] : 0;
    const kinds = Object.entries(SHIFT_KINDS).map(([id, k]) => {
        const reason = !Number.isInteger(day) || !Number.isInteger(hour) ? 'The office clock cannot be read just now.'
            : doneToday ? 'You have already worked a shift today. The office expects you again tomorrow.'
            : hour < k.from || hour >= k.until ? `${k.label} starts between ${k.from}:00 and ${k.until}:00.` : '';
        return {id, label: `${k.label} · ${k.minutes / 60} h`, minutes: k.minutes, say: k.say, eligible: !reason, reason};
    });
    return {kinds, doneToday, thisWeek, last: state?.simulation?.knowledge?.player?.[SHIFT_NOTE]?.value ?? null};
}
// The effects of a finished shift: one result note, the day marked, the week's count SET (a replay cannot count twice). Throws the reason.
export function shiftEffects(state, kind, {day, hour, seed = state?.simulation?.seed ?? 1} = {}) {
    const v = shiftView(state, {day, hour}), row = v?.kinds.find(k => k.id === kind);
    if(!v) throw Error('You hold no post at the office.');
    if(!row) throw Error('That is not a shift the office keeps.');
    if(!row.eligible) throw Error(row.reason);
    const week = weekOf(state, day), count = v.thisWeek + 1;
    const line = `${pick(seed, day, kind)} That is ${count === 1 ? 'one shift' : `${count} shifts`} this pay week.`;
    const fact = (key, value) => ({type: 'fact', scope: 'actor', actor: 'player', key, value});
    return {minutes: row.minutes, line, effects: [fact(SHIFT_DAY_FACT, day), fact(SHIFT_WEEK_FACT, week), fact(SHIFT_COUNT_FACT, count),
        {type: 'knowledge', actor: 'player', key: SHIFT_NOTE, stage: 'seen', value: line, basis: {kind: 'observation', attributedTo: 'player', situationId: SITUATION}}]};
}
