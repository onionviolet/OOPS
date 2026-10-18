// IP1 instrument profiles: content data and pure rate math. No state, no draws.
// A profile is derived from the native Tool template (slot plus base_bonus_skill_levels),
// so gathering rates are exactly the upstream rates; the profile only names and measures them.
export const VERB_BY_SLOT = Object.freeze({pickaxe: 'mine', axe: 'chop', sickle: 'cut', shovel: 'dig', fishing_pole: 'fish'});
export const VERB_LABEL = Object.freeze({mine: 'Mine', chop: 'Chop', cut: 'Cut', dig: 'Dig', fish: 'Fish'});

// Proposal numbers (2026-10-17). Hardness and precision are read by later phases
// (ore tiers, crafting control); they do not change gathering today.
const EXTRAS = Object.freeze({
    old: {hardness: 1, precision: 0.8},
    iron: {hardness: 2, precision: 1},
    steel: {hardness: 3, precision: 1.1},
    wood: {hardness: 1, precision: 1},
});
function family(name) {
    if (/^(Old|Makeshift)\b/.test(name)) return 'old';
    if (/^Steel\b/.test(name)) return 'steel';
    if (/^Iron\b/.test(name)) return 'iron';
    return 'wood';
}

// Improvised fallback (TQ7): what you work with when the tool is broken. Default and dial:
// half speed and a smaller find chance; a world with better improvised craft can raise these.
export const IMPROVISED = Object.freeze({
    mine: {speed: 0.5, yield: 0.6, means: 'a fist-sized rock'},
    chop: {speed: 0.5, yield: 0.6, means: 'a sharp stone and your weight'},
    cut: {speed: 0.6, yield: 0.7, means: 'bare hands and a flint flake'},
    dig: {speed: 0.5, yield: 0.6, means: 'a flat stick'},
    fish: {speed: 0.5, yield: 0.6, means: 'the line wrapped on a branch'},
});

// Repair requirements (IP3) by kind, then tool type (equip slot) with a `default` row. Values that
// differ by tool family are keyed by family with an `any` fallback. Proposal defaults (2026-10-17).
// Later worlds add rows or kinds (spell mend, maker-only repair, recharge) without changing the command.
// Inputs guide rather than refuse: a short skill, station or material gives a worse band (REPAIR_BANDS).
// A row may carry `claim: {belief, basis}` when local knowledge of the repair is missing; the Village has none.
export const REPAIR_REQUIREMENTS = Object.freeze({
    hand: Object.freeze({
        default: {skill: 'Forging', level: {old: 0, iron: 2, steel: 5, any: 2}, station: {tag: 'forging', tier: 1},
            materials: {old: [{id: 'Low quality iron ingot', count: 1}], steel: [{id: 'Steel ingot', count: 1}], any: [{id: 'Iron ingot', count: 1}]},
            minutes: {base: 20, perPoint: 0.4}, failure: {maxLoss: 3, floor: 40}},
        // Fishing poles are rewound and relined at a woodworking bench.
        fishing_pole: {skill: 'Woodworking', level: {any: 0}, station: {tag: 'woodworking', tier: 1},
            materials: {any: [{id: 'Flax string', count: 1}]}, minutes: {base: 15, perPoint: 0.3}, failure: {maxLoss: 3, floor: 40}},
    }),
});
// Result band: skill sets the base; each short input lowers restore and raises the failure share.
export const REPAIR_BANDS = Object.freeze({
    restore: {base: 0.4, perLevel: 0.06}, chance: {base: 0.55, perLevel: 0.04, max: 0.97, min: 0.1},
    short: {skill: {restore: 0.15, chance: 0.05}, station: {restore: 0.5, chance: 0.2, lossFactor: 2}, material: {restore: 0.6, chance: 0.25}},
});
const pick = (byFamily, kind) => byFamily[kind] ?? byFamily.any;
export function repairRequirements(kind, profile) {
    const table = REPAIR_REQUIREMENTS[kind];
    if (!table || !profile) return null;
    const row = table[profile.slot] ?? table.default;
    return {kind, skill: row.skill, level: pick(row.level, profile.family) ?? 0, station: row.station,
        materials: pick(row.materials, profile.family) ?? [], minutes: row.minutes, failure: row.failure, claim: row.claim ?? null};
}

export function isToolLike(item) { return !!item?.tags?.tool && Object.hasOwn(VERB_BY_SLOT, item.equip_slot); }

export function instrumentProfile(item) {
    if (!isToolLike(item)) return null;
    const name = item.id || item.name, verb = VERB_BY_SLOT[item.equip_slot], kind = family(name);
    const bonus = {...(item.base_bonus_skill_levels || {})};
    const levels = Object.values(bonus).reduce((sum, value) => sum + value, 0);
    const profile = {id: name, slot: item.equip_slot, verb, family: kind, bonus, levels, ...EXTRAS[kind],
        verbs: {[verb]: {levels}}, improvised: IMPROVISED[verb]};
    return {...profile, repair: repairRequirements('hand', profile)};
}

// Same geometric interpolation as misc.js slerp.
const slerp = (range, t) => range[0] * (range[1] / range[0]) ** t;
const modifier = (level, range) => Math.min(1, Math.max(0, (level - range[0] + 1) / (range[1] - range[0] + 1)));

// Mirrors LocationActivity.getActivityEfficiency for time and finds. The IP1 golden test
// pins this to the native method, so the tooltip compares like with like.
export function gatherRates(gained, workingPeriod, levels, toolRates = null) {
    if (!gained) return {gathering_time_needed: workingPeriod, gained_resources: []};
    let t = 1;
    if (gained.skill_required?.length === 2) {
        const offset = toolRates?.levels || 0;
        t = levels.reduce((sum, level) => sum + modifier(level + offset, gained.skill_required), 0) / (levels.length || 1);
    }
    let time = Math.floor(slerp(gained.time_period, t));
    const resources = gained.resources.map(r => {
        const amount = r.ammount || [[1, 1], [1, 1]];
        return {name: r.name, chance: slerp(r.chance, t),
            count: [Math.round(slerp([amount[0][0], amount[1][0]], t)), Math.round(slerp([amount[0][1], amount[1][1]], t))]};
    });
    if (toolRates) {
        time = Math.ceil(time / toolRates.speed);
        for (const r of resources) r.chance *= toolRates.yield;
    }
    return {gathering_time_needed: time, gained_resources: resources};
}

// Expected finds per hour for one activity, used for speed and yield ratios.
function perHour(rates) {
    const finds = rates.gained_resources.reduce((sum, r) => sum + r.chance * (r.count[0] + r.count[1]) / 2, 0);
    return {cycles: 60 / Math.max(1, rates.gathering_time_needed), finds};
}

// Tool verb numbers for one activity at the holder's current levels (tool bonus included).
export function verbNumbers(profile, gained, workingPeriod, levelsWithTool) {
    const without = levelsWithTool.map(level => level - profile.levels);
    const withTool = perHour(gatherRates(gained, workingPeriod, levelsWithTool));
    const bare = perHour(gatherRates(gained, workingPeriod, without));
    const speed = withTool.cycles / bare.cycles, yieldRatio = bare.finds ? withTool.finds / bare.finds : 1;
    return {verb: profile.verb, levels: profile.levels, speed: Math.round(speed * 100) / 100,
        yield: Math.round(yieldRatio * 100) / 100, precision: profile.precision, hardness: profile.hardness};
}

// Improvised rates replace the broken tool's bonus levels with the improvised penalty.
export function improvisedRates(profile) {
    return {levels: -profile.levels, speed: profile.improvised.speed, yield: profile.improvised.yield, means: profile.improvised.means};
}
