// Bridge: HP school charms (book_hp_life_data.js hpSpellRows, native powers) + GM40 HP adapter (spell_adapter_hp.js) -> plain status rows.
// Pure: reads the saved simulation state and calendar; no host state, no save slice. Proposal (AD32); implemented below floor for the fizzle line.
// Each row answers: where it came from, how far practice has got against what the cast needs, what the cast costs, and the next step.
// The fizzle chance is the adapter's world default (a dial with a reason). No command draws it yet, so the row says so rather than quoting a chance.
import {failureChance} from '../spell_seam.js';
import {hpSpellAdapter} from '../spell_adapter_hp.js';

const P = 'book.hp.school';
const MASTERY_NEEDED = 1; // the cast command requires power mastery >= 1 (book_hp_life_data.js)
const COST = {levitation: '1 practice feather and 1 stamina', repair_glass: '1 complete shard set and 1 stamina'};
const RESULT = {levitation: 'the feather rises to the high rack', repair_glass: 'the shards rejoin into a pane'};

// The planned fizzle line the seam would draw: shown as a dial, never as a live chance.
export function plannedFizzle(mastery = 0) {
    const a = hpSpellAdapter();
    const spell = {failure: {chance: a.failure.chance, perMastery: a.failure.perMastery ?? 0}};
    return Math.round(failureChance(spell, mastery, MASTERY_NEEDED) * 100);
}

/**
 * state: expansion state. calendar: hpSchoolCalendar(state) result or null. rows: hpSpellRows.
 * Returns [{label, value}] status rows.
 */
export function hpCharmRows(state, calendar, rows) {
    const powers = state.simulation?.powers?.player ?? {};
    return rows.map(r => {
        const p = powers[`${P}.${r.key}`], name = r.label;
        if (!p?.owned) {
            const when = calendar?.charms
                ? 'The charms lesson is open now: attend it with Mara.'
                : 'Mara teaches it in the charms lesson, on teaching days from 09:00 to 11:00.';
            return {label: name, value: `Not learned yet. ${when}`};
        }
        const done = Math.min(p.mastery ?? 0, MASTERY_NEEDED);
        if ((p.mastery ?? 0) < MASTERY_NEEDED)
            return {label: name, value: `Taught by Mara. Practised ${done} of ${MASTERY_NEEDED} drills needed before you can cast it. Next: Practice (3 min, 1 stamina, needs your wand).`};
        const used = p.executions ?? 0;
        return {label: name, value: `Ready to cast (practised ${p.mastery} drill${p.mastery === 1 ? '' : 's'}; ${used} cast${used === 1 ? '' : 's'} so far). A cast uses ${COST[r.key] ?? 'its listed costs'}; on success ${RESULT[r.key] ?? 'it works'}. It does not fizzle yet: a chance of about ${plannedFizzle(p.mastery)}% is planned and not in effect.`};
    });
}
