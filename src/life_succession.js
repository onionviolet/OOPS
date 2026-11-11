// PX78 (proposal, 2026-11-11): the life-end to next-seat loop over the existing heir code.
// Pure: a saved envelope in, the seats this life's records open and, per seat, what carries and
// what stays behind. The handover commits the same deriveHeirLeftovers call the preview shows,
// so the carry list cannot drift from what actually passes (PX73, SPR23). Before the end the
// preview reads a retired copy of the chronicle; nothing is written.
// Adapted from Crusader Kings' succession screen and Wildermyth's legacy (SPR29): we kept "see what
// passes before you choose", dropped titles and partition, and let the seat come from people this
// life's records name (an apprentice taught, a ward taken in) rather than a fixed heir order.
import {check} from './basics.js';
import {retiredChronicleCopy} from './chronicle.js';
import {learnedLifeLessons} from './life_experience.js';
import {HEIR_SEATS, openHeirSeats, wardNow, deriveHeirLeftovers, heirLeftoverLines} from './heir_inheritance.js';
import {CARRIED_SAVE_KEYS} from './life_experience_host.js';

// Saved slices the heir route reads into the leftovers or rebuilds itself; these are accounted
// for by the leftover lines or the body line, never silently.
const COUNTED_KEYS = Object.freeze(['character', 'levels', 'inventories', 'expansion', 'availabilities', 'homes', 'inherited_traits', 'village_career', 'kin',
    'current time', 'game version', 'language', 'saved_at', 'equipment', 'skills', 'stats', 'quests', 'global_flags', 'continuation']);
const SEAT_WORDS = Object.freeze({kin: 'Your next of kin', apprentice: 'Your apprentice', ward: 'Your ward', stranger: 'A newcomer'});

export function endedView(save, at) {
    const c = save?.expansion?.chronicle;
    check(c, 'This life has no chronicle to end.');
    if(c.life.endedAt != null) return save;
    return {...save, expansion: {...save.expansion, chronicle: retiredChronicleCopy(c, at ?? c.lastClock)}};
}

// changedSlices: saved slice ids whose value differs from their fresh default (the host knows the
// defaults); sliceLabels: player words for some of them. Anything unnamed is still counted.
export function staysBehindLines(previous, l, {labels = {}, changedSlices = [], sliceLabels = {}} = {}) {
    const c = previous.expansion.chronicle, x = c.life.experience || {}, name = id => labels[id] || id;
    const lines = ['This body, its skills and its levels stay with this life. The next person starts with their own.'];
    const passed = new Set([...l.papers, ...(l.recipient === 'apprentice' ? l.apprentice : [])]);
    const unwritten = learnedLifeLessons(c).map(s => s.id).filter(id => !passed.has(id) && !(x.reflected || []).includes(id));
    if(unwritten.length) lines.push(`Known only in your head, so lost: ${unwritten.map(name).join(', ')}. A lesson written down would pass as papers.`);
    if(l.recipient === 'stranger' && (x.reflected || []).length) lines.push(`Your written papers stay with the estate: ${x.reflected.map(name).join(', ')}.`);
    const taught = x.taught || [];
    if(taught.length && l.recipient !== 'apprentice') lines.push(`What you taught stays with your apprentice, who does not take the seat: ${taught.map(name).join(', ')}.`);
    const standing = Object.values(previous.character?.reputation || {}).some(v => Number.isSafeInteger(v) && v !== 0);
    if(standing) lines.push(l.recipient === 'stranger' ? 'None of your standing passes. The newcomer is unknown here.' : 'The other half of your standing fades with your name.');
    if(l.unclaimed) {
        const u = l.unclaimed, parts = [u.money ? `${u.money} coins` : '', u.goods ? `${u.goods} goods` : '', u.home ? 'the Shack' : '', u.residences ? `${u.residences} ${u.residences === 1 ? 'residence' : 'residences'}` : ''].filter(Boolean);
        lines.push(parts.length ? `With no one to claim it, the Village keeps the estate: ${parts.join(', ')}.` : 'There was little in the estate for the Village to keep.');
    }
    if(previous.inherited_traits && (l.recipient === 'ward' || l.recipient === 'stranger')) lines.push(`Inherited qualities: ${l.recipient === 'ward' ? 'your ward' : 'a newcomer'} is not of your blood, so none pass.`);
    if(l.recipient === 'stranger') lines.push('The elder does not count the newcomer as your successor, and nothing you owed or were owed passes.');
    else lines.push('The people you knew keep living and remember you. Their regard for you does not pass to the next person.');
    const other = changedSlices.filter(k => !CARRIED_SAVE_KEYS.includes(k) && !COUNTED_KEYS.includes(k));
    const named = [...new Set(other.map(k => sliceLabels[k]).filter(Boolean))], unnamed = other.filter(k => !sliceLabels[k]).length;
    if(named.length || unnamed) lines.push(`Other progress this body earned stays with it: ${[...named.slice(0, 6), ...(named.length > 6 ? [`${named.length - 6} more`] : []), ...(unnamed ? [`${unnamed} other ${unnamed === 1 ? 'record' : 'records'}`] : [])].join(', ')}.`);
    return lines;
}

// One row per seat, open or not, so a seat the player cannot take still says which record would open it.
export function successionSeats(save, {equippedKeys = [], law, labels = {}, labelItem, changedSlices = [], sliceLabels = {}, at} = {}) {
    const ended = endedView(save, at), c = ended.expansion.chronicle, open = openHeirSeats(ended), ward = wardNow(c);
    return HEIR_SEATS.map(id => {
        const who = id === 'ward' && ward ? `${ward.name}, ${ward.age}` : SEAT_WORDS[id];
        if(!open[id]) return {id, open: false, who, why: id === 'apprentice' ? 'No apprentice yet. An elder can teach a learned lesson to one.' : 'No ward shares this household. The elder may trust you with one once you keep your archive promise.'};
        const leftovers = deriveHeirLeftovers(ended, {equippedKeys, law, seat: id});
        return {id, open: true, who, leftovers, carries: heirLeftoverLines(leftovers, labels, labelItem), stays: staysBehindLines(ended, leftovers, {labels, changedSlices, sliceLabels})};
    });
}
