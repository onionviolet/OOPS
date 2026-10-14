// Original proposal inspired by Proto23's related-skill milestones; no foreign code.
// P00 installs this before skill reconstruction. Native Skill owns XP and replay.
export const trainingLink = Object.freeze({
    id: 'p23.cooking.alchemy.3', source: 'Cooking', target: 'Alchemy', level: 3, multiplier: 1.05,
});

/** Preflight then append one native milestone component. Safe to register again. */
export function installTrainingLink(skills) {
    const {source, target, level, multiplier} = trainingLink;
    const skill = skills?.[source];
    if(!skill || !skills[target] || !skill.milestones || skill.max_level < level) {
        throw new Error('Long-life training requires native Cooking and Alchemy.');
    }
    const old = skill.milestones[level] || {};
    const existing = old.xp_multipliers?.[target];
    if(existing !== undefined && existing !== multiplier) {
        throw new Error('Long-life training milestone conflicts with its native owner.');
    }
    if(existing === multiplier) return false;
    skill.milestones[level] = {...old, xp_multipliers: {...old.xp_multipliers, [target]: multiplier}};
    return true;
}

/** Only disclose names after both native skills are known. No grant or XP side effect. */
export function trainingView(readSkill) {
    const source = readSkill(trainingLink.source), target = readSkill(trainingLink.target);
    if(!source?.known || !target?.known) return null;
    const active = source.level >= trainingLink.level;
    return {id: trainingLink.id, active, multiplier: active ? trainingLink.multiplier : 1,
        text: `Cooking level 3: +5% Alchemy XP${active ? ' (active)' : ''}.`};
}
