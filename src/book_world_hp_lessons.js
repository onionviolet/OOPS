// W9-D: Harry's first lessons at Hogwarts through the shared lesson seam (lesson.js, FD11). The commands are native data in
// world_packs/book_hp_lead_life_data.js; this module owns the rest: the weekly lesson windows and the practice chances as facts for the
// simulation (hpFacts calls hpLessonFacts), a read model for the panel, and the hand-off that marks the class slot duty.
// One authority per fact: the school year and the duty decide "in term at school"; the learned charm is the native power
// state.simulation.powers.player['book.hp.lead.levitation'] (saved with the expansion state); the Alchemy skill owns potion progress.
// Authored proposals (dial, reason): the class slot is Monday 09:00 to 11:00 (book_world_hp_duties.js). Charms takes its first hour,
// Potions its second, so either lesson keeps the week's slot. Lessons also need the Sorting first (canon order).
import {lessonAvailability} from './lesson.js';
import {failureChance} from './spell_seam.js';
import {schoolYearPosition} from './book_world_hp_school_calendar.js';
import {HP_LEVITATION} from './world_packs/book_hp_lead_life_data.js';

// No import of book_world_hp_duties.js or _positions.js: world_calendar.js reaches this file through book_world_hp_facts.js, so that
// would close an import cycle. The constants below are copies, and tests/hp_lessons.test.js pins each to its owner.
const P = 'book.hp.lead', CLASS = 'hp.lead.class_slot', HP_HOUSE_FACT = 'hp.lead.house', AT_SCHOOL = 'hp.lead.atSchool';
const SLOT = Object.freeze({period: 7 * 1440, opens: 2 * 1440 + 9 * 60, closes: 2 * 1440 + 11 * 60});
// Minutes on the lead calendar since day 0 00:00 (anchor 08:00), the same counter as hpDutyMinute; null before the life has begun.
const leadMinute = state => { const o = state?.simulation?.knowledge?.player?.[`${P}.opening`]; return o ? Math.max(0, state.clock - o.at) + 480 : null; };
const inTerm = state => { const m = leadMinute(state); return state?.actors?.player?.worldId === `${P}.world` && state.actors.player.facts?.[AT_SCHOOL] === true && m != null
    && schoolYearPosition(Math.floor(m / 1440))?.phase === 'term'; };
const HOUR = 60;
export const HP_LESSONS = Object.freeze({
    charms: Object.freeze({id: 'charms', label: 'Charms', teacher: 'the charms master', firstId: `${P}.lesson_charms`, practiceId: `${P}.charms_practice`,
        schedule: Object.freeze({period: SLOT.period, opens: SLOT.opens, closes: SLOT.opens + HOUR}), fact: 'hp.lead.charmsOpen', when: 'Mondays 09:00 to 10:00 in term'}),
    potions: Object.freeze({id: 'potions', label: 'Potions', teacher: 'the potions master', firstId: `${P}.lesson_potions`, practiceId: `${P}.lesson_potions`,
        schedule: Object.freeze({period: SLOT.period, opens: SLOT.opens + HOUR, closes: SLOT.closes}), fact: 'hp.lead.potionsOpen', when: 'Mondays 10:00 to 11:00 in term'})});
// A spell row Harry can have. `channels` is the explicit channel (src/channels.js reads it first); a levitated feather changes
// what is where, the nearest built-in kind is 'change_situation' (proposal).
export const HP_SPELL_ROWS = Object.freeze([Object.freeze({key: 'levitation_charm', label: 'Levitation charm', powerId: HP_LEVITATION, channels: Object.freeze(['change_situation']),
    // Dials with reasons: a first try usually fails (60%), and each practice step takes 10 points off, never below 5%. The spell seam's
    // world default is 40% at the needed mastery and 10 per step (spell_adapter_hp.js); a first-year charm starts harder than that.
    failure: Object.freeze({chance: 0.6, perMastery: 0.1}), floor: 0.05})]);
const lessonOpen = (state, l) => {
    const house = state?.actors?.player?.facts?.[HP_HOUSE_FACT];
    return !!house && inTerm(state) && lessonAvailability(l.schedule, leadMinute(state)).available;
};
const powerOf = state => state?.simulation?.powers?.player?.[HP_LEVITATION];
// W11-C library study (book_world_hp_inquiry.js owns the sessions). A finished own study is the knowledge fact below at stage
// 'understood' in the player's knowledge (the inquiry's output; a note read second hand is 'interpreted' and earns no bonus).
// Dial with reason: +10 points on the lesson's chance, the worth of one more practice try, because knowing why the motion works
// helps the hand but is not the practice. The sum still respects each lesson's own cap.
export const HP_STUDY = Object.freeze({charms: Object.freeze({inquiry: 'study.hp.charms', key: 'study.hp.charms.writeup'}),
    potions: Object.freeze({inquiry: 'study.hp.potions', key: 'study.hp.potions.writeup'}), bonus: 0.1});
const studied = (state, topic) => state?.simulation?.knowledge?.player?.[HP_STUDY[topic].key]?.stage === 'understood';
export const hpStudyBonus = (state, topic) => studied(state, topic) ? HP_STUDY.bonus : 0;
/** The library is open to a sorted first year in term (same calendar owner as the lessons); returns a reason when not. */
export function hpLibraryReason(state) {
    const f = state?.actors?.player?.facts || {};
    if(state?.actors?.player?.worldId !== `${P}.world` || !f[AT_SCHOOL]) return 'The school library is open once you are at Hogwarts.';
    if(!f[HP_HOUSE_FACT]) return 'You are not sorted yet; the library asks which house you belong to.';
    try { if(!inTerm(state)) return 'The library is shut for the holidays.'; } catch { return 'The library is shut just now.'; }
    return '';
}
// Two-argument forms are separate names: tests and callers map the one-argument forms over arrays (index would be read as a bonus).
const levitateWith = (mastery, bonus) => {
    const row = HP_SPELL_ROWS[0];
    return Math.min(1 - row.floor, Math.max(0, 1 - failureChance({failure: row.failure}, mastery, 0) + bonus));
};
export const levitateChance = mastery => levitateWith(mastery ?? 0, 0);
// Potions chance: 50% to start, 2 points per Alchemy xp (a class is worth 5 or 2 xp), at most 95%. Reason: a written, supervised recipe
// is easier than a first spell, and the skill is the only record of practice (no second counter).
const brewWith = (xp, bonus) => Math.min(0.95, 0.5 + 0.02 * Math.max(0, xp) + bonus);
export const brewChance = (xp = 0) => brewWith(xp, 0);
// Facts for the simulation (called from hpFacts for the lead life). Always defined so outcome weights resolve at any time.
export function hpLessonFacts(state, context = {}) {
    let charms = false, potions = false;
    try { charms = lessonOpen(state, HP_LESSONS.charms); potions = lessonOpen(state, HP_LESSONS.potions); } catch { /* calendar not ready: closed */ }
    return {[HP_LESSONS.charms.fact]: charms, [HP_LESSONS.potions.fact]: potions,
        'hp.lead.levitateChance': levitateWith(powerOf(state)?.mastery ?? 0, hpStudyBonus(state, 'charms')),
        'hp.lead.brewChance': brewWith(context.gameplay?.player?.skills?.Alchemy?.xp ?? 0, hpStudyBonus(state, 'potions'))};
}
// Read model for the panel and the status lines. Empty until the player is at school and sorted (so a summer life shows nothing new).
export const HP_LESSON_CONSTANTS = Object.freeze({CLASS, SLOT, HP_HOUSE_FACT, AT_SCHOOL});
export function hpLessonView(state, context = {}) {
    const f = state?.actors?.player?.facts || {};
    if(!f[AT_SCHOOL] || !f[HP_HOUSE_FACT]) return null;
    const minute = leadMinute(state), term = inTerm(state);
    const power = powerOf(state), owned = !!power?.owned;
    const lessons = Object.values(HP_LESSONS).map(l => {
        const a = minute == null ? {available: false, window: {reason: ''}} : lessonAvailability(l.schedule, minute);
        const open = term && a.available;
        return {id: l.id, label: l.label, when: l.when, open, commandId: l.id === 'charms' && owned ? l.practiceId : l.firstId,
            reason: open ? '' : term ? `${l.label} is taught ${l.when}. ${a.window.reason}` : `${l.label} is taught ${l.when}; there are no lessons in the holidays.`};
    });
    const spells = HP_SPELL_ROWS.filter(r => powerOf(state)?.owned).map(r => ({key: r.key, label: r.label, channels: [...r.channels], practice: power.mastery ?? 0,
        successChance: Math.round(levitateWith(power.mastery ?? 0, hpStudyBonus(state, 'charms')) * 100),
        line: `${r.label} · practised ${power.mastery ?? 0} time${(power.mastery ?? 0) === 1 ? '' : 's'} · about ${Math.round(levitateWith(power.mastery ?? 0, hpStudyBonus(state, 'charms')) * 100)}% to lift the feather${hpStudyBonus(state, 'charms') ? ' (you studied why it works)' : ''}`}));
    const k = state.simulation?.knowledge?.player || {};
    return {lessons, spells, last: [k[`${P}.charms_last`]?.value, k[`${P}.potions_last`]?.value].filter(Boolean)};
}
// After a lesson was started: if this week's class slot is open and unkept, keep it through the duties API (the duties domain owns the
// record). Returns whether it was marked. A slot already kept this week, or a shut one, is left alone; the lesson itself already ran.
export function keepClassSlot(registry) {
    const item = registry.project('duties')?.items?.find(i => i.id === CLASS && i.open);
    if(!item) return false;
    registry.command('duties', 'attend')({dutyId: CLASS});
    return true;
}
