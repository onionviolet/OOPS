const pressureRules = {
    'Infested field': {base: 1.05, perClear: 0.05, limit: 1.4},
    'Cave depths': {base: 1.1, perClear: 0.1, limit: 1.7},
};

export function zonePressure(zone, rules = pressureRules) {
    const rule = rules[zone?.id];
    if (!rule) return 1;
    const clears = Math.floor(zone.enemy_groups_killed / zone.enemy_count);
    return Math.min(rule.limit, rule.base + clears * rule.perClear);
}

export function pressureTemplate(template, pressure) {
    if (pressure === 1) return template;
    const stats = {...template.stats};
    for (const key of ['health', 'attack', 'defense']) stats[key] *= pressure;
    return {...template, stats, xp_value: template.xp_value * pressure};
}

export function pressureText(zone) {
    const pressure = zonePressure(zone);
    return pressure === 1 ? '' : `Zone pressure ${pressure.toFixed(2)}x: enemy strength, XP and loot chance.`;
}
