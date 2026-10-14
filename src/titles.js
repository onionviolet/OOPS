// Titles for lifetime counters (O1, Proto23 absorption 2026-10-10). Proposal content: names, thresholds and bonuses are reversible.
// character.titles is the save record: {id: {at: calendar minute}}. Bonuses are derived from it on read, never stored.
export const TITLE_START = {year: 999, month: 4, day: 1};

export const title_families = ['combat', 'endurance', 'craft', 'life'];

// counter: key of the snapshot built by readTitleCounters in main.js. at: threshold. bonus: optional, small on purpose.
export const title_catalog = [
    {id: 'first_blood', family: 'combat', name: 'Blooded', counter: 'kills', at: 1, text: 'Defeat your first enemy.'},
    {id: 'hunter', family: 'combat', name: 'Hunter', counter: 'kills', at: 100, text: 'Defeat 100 enemies.', bonus: {xp_multipliers: {Combat: 1.02}}},
    {id: 'slayer', family: 'combat', name: 'Slayer', counter: 'kills', at: 1000, text: 'Defeat 1,000 enemies.', bonus: {xp_multipliers: {Combat: 1.03}}},
    {id: 'scourge', family: 'combat', name: 'Scourge of the Wilds', counter: 'kills', at: 10000, text: 'Defeat 10,000 enemies.', bonus: {multipliers: {attack_power: 1.02}}},
    {id: 'naturalist', family: 'combat', name: 'Naturalist', counter: 'enemy_kinds', at: 10, text: 'Defeat 10 different kinds of enemy.', bonus: {xp_multipliers: {Perception: 1.03}}},
    {id: 'keen_edge', family: 'combat', name: 'Keen Edge', counter: 'crits_done', at: 250, text: 'Land 250 critical hits.', bonus: {flats: {crit_rate: 0.005}}},
    {id: 'heavy_hand', family: 'combat', name: 'Heavy Hand', counter: 'strongest_hit', at: 100, text: 'Deal a single hit of 100 damage or more.'},

    {id: 'bruised', family: 'endurance', name: 'Bruised', counter: 'hits_taken', at: 500, text: 'Take 500 hits.', bonus: {xp_multipliers: {'Iron skin': 1.02}}},
    {id: 'thick_skinned', family: 'endurance', name: 'Thick-Skinned', counter: 'hits_taken', at: 5000, text: 'Take 5,000 hits.', bonus: {multipliers: {max_health: 1.02}}},
    {id: 'back_again', family: 'endurance', name: 'Back Again', counter: 'deaths', at: 1, text: 'Lose consciousness in battle and wake up anyway.'},
    {id: 'stubborn', family: 'endurance', name: 'Stubborn', counter: 'deaths', at: 25, text: 'Lose consciousness 25 times and keep going.', bonus: {xp_multipliers: {Persistence: 1.03}}},
    {id: 'unbroken', family: 'endurance', name: 'Unbroken', counter: 'level_without_death', at: 10, text: 'Reach character level 10 without ever losing consciousness.', bonus: {multipliers: {max_health: 1.03}}},
    {id: 'seasoned', family: 'endurance', name: 'Seasoned', counter: 'level', at: 10, text: 'Reach character level 10.'},
    {id: 'veteran', family: 'endurance', name: 'Veteran', counter: 'level', at: 25, text: 'Reach character level 25.', bonus: {xp_multipliers: {hero: 1.02}}},

    {id: 'tinkerer', family: 'craft', name: 'Tinkerer', counter: 'crafts', at: 10, text: 'Succeed at 10 crafts.'},
    {id: 'artisan', family: 'craft', name: 'Artisan', counter: 'crafts', at: 250, text: 'Succeed at 250 crafts.', bonus: {xp_multipliers: {Crafting: 1.03}}},
    {id: 'master_hand', family: 'craft', name: 'Master Hand', counter: 'crafts', at: 2500, text: 'Succeed at 2,500 crafts.', bonus: {xp_multipliers: {'Crafting mastery': 1.03}}},
    {id: 'forager', family: 'craft', name: 'Forager', counter: 'gathered', at: 100, text: 'Gather 100 materials.'},
    {id: 'hoarder', family: 'craft', name: 'Hoarder', counter: 'gathered', at: 2500, text: 'Gather 2,500 materials.', bonus: {xp_multipliers: {'Gathering mastery': 1.03}}},

    {id: 'reader', family: 'life', name: 'Reader', counter: 'books', at: 1, text: 'Finish reading a book.'},
    {id: 'bookworm', family: 'life', name: 'Bookworm', counter: 'books', at: 5, text: 'Finish reading 5 books.', bonus: {xp_multipliers: {Literacy: 1.03}}},
    {id: 'settled', family: 'life', name: 'Settled In', counter: 'years', at: 1, text: 'Live through your first year.'},
    {id: 'old_hand', family: 'life', name: 'Old Hand', counter: 'years', at: 5, text: 'Live through five years.', bonus: {xp_multipliers: {all_skill: 1.01}}},
    {id: 'hermit', family: 'life', name: 'Long-Lived', counter: 'years', at: 10, text: 'Live through a whole decade.', bonus: {xp_multipliers: {all_skill: 1.02}}},
    {id: 'devoted', family: 'life', name: 'Devoted', counter: 'playtime_hours', at: 10, text: 'Spend 10 hours of your own time on this life.'},
    // Original proposal goals; P00 projects only earned native counters, never elapsed wall time.
    {id: 'quiet_hour', family: 'life', name: 'A Place to Breathe', counter: 'home_minutes', at: 60, text: 'Spend 60 played minutes at home.', requires_counter: true},
    {id: 'home_season', family: 'life', name: 'Keeper of the Hearth', counter: 'home_minutes', at: 129600, text: 'Spend a season of played time at home.', requires_counter: true},
    {id: 'pantry_keeper', family: 'life', name: 'Pantry Keeper', counter: 'items_bought', at: 25, text: 'Buy 25 items through settled native purchases.', requires_counter: true},
    {id: 'small_surprise', family: 'endurance', name: 'Small Surprise', counter: 'weak_enemy_losses', at: 1, text: 'Lose a settled fight to a known novice opponent.', requires_counter: true},
    {id: 'million_tales', family: 'combat', name: 'A Million Encounters', counter: 'kills', at: 1000000, text: 'Defeat 1,000,000 enemies.'},
    {id: 'well_off', family: 'life', name: 'Well-Off', counter: 'money', at: 10000, text: 'Hold 10,000 coins at once.', bonus: {xp_multipliers: {Haggling: 1.03}}},
];

export const title_by_id = Object.fromEntries(title_catalog.map(t => [t.id, t]));

const count = v => Number.isFinite(v) && v >= 0 ? v : 0;

/** Whole years lived since the fixed start date, using 30-day months. */
export function yearsSince(time, start = TITLE_START) {
    const days = (time.year - start.year) * 360 + (time.month - start.month) * 30 + (time.day - start.day);
    return Math.max(0, Math.floor(days / 360));
}

export function titleCalendarMinute(time, start = TITLE_START) {
    const days = (time.year - start.year) * 360 + (time.month - start.month) * 30 + (time.day - start.day);
    return Math.max(0, days * 1440 + (time.hour || 0) * 60 + (time.minute || 0));
}

/**
 * Keeps known ids with a valid record; unknown ids are kept untouched (a newer build may know them) but grant nothing.
 * Old saves stored {} here, so no migration is needed.
 */
export function normalizeTitles(raw) {
    const titles = {};
    if(!raw || typeof raw !== 'object' || Array.isArray(raw)) return titles;
    for(const [id, record] of Object.entries(raw)) {
        if(record && typeof record === 'object' && !Array.isArray(record)) titles[id] = {at: Number.isSafeInteger(record.at) && record.at >= 0 ? record.at : 0};
    }
    return titles;
}

/** Ids whose counters reached their threshold and are not yet held, in catalog order. */
export function newlyEarnedTitles(titles, counters) {
    return title_catalog.filter(t => !titles[t.id] && count(counters[t.counter]) >= t.at).map(t => t.id);
}

/** Grants in place and returns the new ids. */
export function grantEarnedTitles(titles, counters, at) {
    const earned = newlyEarnedTitles(titles, counters);
    for(const id of earned) titles[id] = {at};
    return earned;
}

/** Combined bonus of every held known title: {flats, multipliers, xp_multipliers}. */
export function titleBonuses(titles) {
    const total = {flats: {}, multipliers: {}, xp_multipliers: {}};
    for(const id of Object.keys(titles || {})) {
        const bonus = title_by_id[id]?.bonus;
        if(!bonus) continue;
        for(const [stat, v] of Object.entries(bonus.flats || {})) total.flats[stat] = (total.flats[stat] || 0) + v;
        for(const [stat, v] of Object.entries(bonus.multipliers || {})) total.multipliers[stat] = (total.multipliers[stat] || 1) * v;
        for(const [target, v] of Object.entries(bonus.xp_multipliers || {})) total.xp_multipliers[target] = (total.xp_multipliers[target] || 1) * v;
    }
    return total;
}

const stat_names = {attack_power: 'attack power', max_health: 'max health', crit_rate: 'crit chance'};
const xp_names = {hero: 'character xp', all_skill: 'all skill xp'};

export function describeTitleBonus(bonus) {
    if(!bonus) return '';
    const parts = [];
    for(const [stat, v] of Object.entries(bonus.flats || {})) parts.push(`+${Math.round(v * 1000) / 10}% ${stat_names[stat] || stat}`);
    for(const [stat, v] of Object.entries(bonus.multipliers || {})) parts.push(`+${Math.round((v - 1) * 1000) / 10}% ${stat_names[stat] || stat}`);
    for(const [target, v] of Object.entries(bonus.xp_multipliers || {})) parts.push(`+${Math.round((v - 1) * 1000) / 10}% ${xp_names[target] || target + ' xp'}`);
    return parts.join(', ');
}

/** Rows for the panel: every catalog title with held state and progress toward it. */
export function titleView(titles, counters, {knownOnly = false} = {}) {
    return title_catalog.filter(t => !knownOnly || !t.requires_counter || titles[t.id] || Object.hasOwn(counters, t.counter)).map(t => ({
        id: t.id, family: t.family, name: t.name, text: t.text, bonus: describeTitleBonus(t.bonus),
        held: !!titles[t.id], progress: Math.min(count(counters[t.counter]), t.at), at: t.at,
    }));
}
