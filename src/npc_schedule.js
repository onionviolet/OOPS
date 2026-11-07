// NPC schedule facts: where an authored person is and what they are doing at a
// given minute of the day. A leaf: no imports, no saved state.
//
// Default: schedules are data a world authors, one row per person, attached to
// that person's controller definition; a person with no row has no schedule facts.
// Dial: density per world and per life (a bustling town schedules many people,
// a lone ruin none; a life may author a row for one person and leave the rest).
// Reason: the right person in the right place at the right time is what authored
// worlds need, and a later needs/goals layer reads the same facts to choose
// what to do instead of inventing a second place-and-time vocabulary.
//
// Row: {actor, slots:[{from, to, place, activity, id?}]}. Minutes of the day,
// from inclusive, to exclusive, 0 <= from < 1440, 0 < to <= 1440. from > to
// wraps past midnight (1320 to 360 is 22:00 to 06:00). Slots may not overlap;
// minutes no slot covers have slot 'none' and no place or activity.
// When the clock minute is unknown, a scheduled actor reads slot 'untimed', so a
// guard can choose to pass when no calendar is available.

export const MINUTES_PER_DAY = 1440;
const isInt = v => Number.isInteger(v);
const word = v => typeof v === 'string' && v.length > 0;

export function slotId(slot) {return slot.id ?? `${slot.from}-${slot.to}`;}

export function validateSchedule(row) {
    const fail = m => {throw new Error(`Invalid schedule: ${m}`);};
    if(!row || typeof row !== 'object' || !word(row.actor)) fail('a row needs an actor.');
    if(!Array.isArray(row.slots) || !row.slots.length) fail(`${row.actor} needs at least one slot.`);
    const covered = new Array(MINUTES_PER_DAY).fill(false), ids = new Set();
    for(const s of row.slots) {
        if(!s || !isInt(s.from) || !isInt(s.to) || s.from < 0 || s.from >= MINUTES_PER_DAY || s.to <= 0 || s.to > MINUTES_PER_DAY || s.from === s.to) fail(`${row.actor} has a slot with bad minutes.`);
        if(!word(s.place) || !word(s.activity)) fail(`${row.actor} slot ${slotId(s)} needs a place and an activity.`);
        if(ids.has(slotId(s))) fail(`${row.actor} repeats slot ${slotId(s)}.`);
        ids.add(slotId(s));
        for(let m = s.from; m !== s.to; m = (m + 1) % MINUTES_PER_DAY) {
            if(covered[m]) fail(`${row.actor} slots overlap at minute ${m}.`);
            covered[m] = true;
        }
    }
    return row;
}

export function slotAt(row, minuteOfDay) {
    const m = minuteOfDay;
    return row.slots.find(s => s.from < s.to ? m >= s.from && m < s.to : m >= s.from || m < s.to) || null;
}

// `schedules` is an array of rows. `minute` may be any non-negative integer (a
// calendar minute is reduced to its minute of the day); anything else is untimed.
export function scheduleFacts(schedules, actorId, minute) {
    const row = (schedules || []).find(r => r && r.actor === actorId);
    if(!row) return {};
    const prefix = `schedule.${actorId}.`;
    if(!isInt(minute) || minute < 0) return {[prefix + 'slot']: 'untimed'};
    const slot = slotAt(row, minute % MINUTES_PER_DAY);
    return slot ? {[prefix + 'place']: slot.place, [prefix + 'activity']: slot.activity, [prefix + 'slot']: slotId(slot)} : {[prefix + 'slot']: 'none'};
}
