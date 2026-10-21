import {title_by_id, titleBonuses, describeTitleBonus} from '../../titles.js';

// An opt-in additive payoff. All held-title bonuses remain active in every mode.
const wornPayoffs = Object.freeze({quiet_hour: {Sleeping: 1.02}, pantry_keeper: {Cooking: 1.02}});

/** Absent on old saves; reject unsupported optional state before host mutation. */
export function validateWornTitle(raw, titles) {
    if(raw === undefined) return undefined;
    if(!raw || Array.isArray(raw) || typeof raw !== 'object' || raw.schema !== 1 ||
        typeof raw.enabled !== 'boolean' ||
        !(raw.worn === null || (typeof raw.worn === 'string' && Object.hasOwn(title_by_id, raw.worn) && titles?.[raw.worn])) ||
        Object.keys(raw).some(k => !['schema', 'enabled', 'worn'].includes(k))) {
        throw new Error('Invalid long-life worn-title state.');
    }
    return {schema: 1, enabled: raw.enabled, worn: raw.worn};
}

export function selectWornTitle(titles, raw, id, enabled = true) {
    validateWornTitle(raw, titles);
    return validateWornTitle({schema: 1, enabled, worn: id}, titles);
}

export function wornTitleView(titles, raw) {
    const state = validateWornTitle(raw, titles);
    const held = Object.keys(title_by_id).filter(id => titles?.[id]);
    const renown = held.length;
    // All valid selections remain representable, including held titles without a payoff.
    const choices = held.map(id => ({id, name: title_by_id[id].name,
        bonus: describeTitleBonus({xp_multipliers: wornPayoffs[id] || {}})}));
    const payoff = wornPayoffs[state?.worn];
    const active = !!(state?.enabled && renown >= 3 && payoff);
    const bonus = describeTitleBonus({xp_multipliers: payoff || {}});
    const reason = !state?.enabled ? 'Wearing is off.' : !state.worn ? 'Choose a held title.' :
        !payoff ? 'This title has no additional worn benefit.' : renown < 3 ?
        `Requires 3 known titles held (${renown}/3).` : 'Applies when the related activity awards skill XP.';
    return {enabled: state?.enabled || false, worn: state?.worn || null, renown, choices,
        active, bonus, reason,
        text: 'Worn benefits are additional to held bonuses. Changing selection preserves learned skills.'};
}

export function longLifeTitleBonuses(titles, raw) {
    const view = wornTitleView(titles, raw);
    const total = titleBonuses(titles);
    if(view.active) for(const [target, multiplier] of Object.entries(wornPayoffs[view.worn])) {
        total.xp_multipliers[target] = (total.xp_multipliers[target] || 1) * multiplier;
    }
    return total;
}
