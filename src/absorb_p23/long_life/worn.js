import {title_by_id, titleBonuses} from '../../titles.js';

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
    const choices = held.filter(id => wornPayoffs[id]).map(id => ({id, name: title_by_id[id].name}));
    return {enabled: state?.enabled || false, worn: state?.worn || null, renown, choices,
        active: !!(state?.enabled && renown >= 3 && wornPayoffs[state.worn]),
        text: 'Wear a domestic title for +2% related skill XP with 3 known titles held. All held bonuses stay active.'};
}

export function longLifeTitleBonuses(titles, raw) {
    const view = wornTitleView(titles, raw);
    const total = titleBonuses(titles);
    if(view.active) for(const [target, multiplier] of Object.entries(wornPayoffs[view.worn])) {
        total.xp_multipliers[target] = (total.xp_multipliers[target] || 1) * multiplier;
    }
    return total;
}
