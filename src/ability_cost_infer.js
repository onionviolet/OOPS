// L10 authoring proposal, not an engine charge. Qualitative metadata stays separate
// from ability_records.cost (which requires concrete stock and negative amounts).
// Defaults describe ordinary use; a world profile, mastery and circumstances can
// change them. Stated costs, including a stated cost with no number, take priority.
export function hasStatedAbilityCost(row) {
    return row.costStated === true || row.costStated === 'stated'
        || [row.costs, row.cost].some(xs => Array.isArray(xs) && xs.length > 0)
        || (row.stated ?? []).some(x => x.kind === 'cost');
}

const DEFAULTS = {
    bodily: {cost: 'light exertion', cooldown: 'brief recovery', risk: 'ordinary fatigue'},
    perception: {cost: 'light attention', cooldown: 'brief refocus', risk: 'distraction'},
    mental: {cost: 'moderate concentration', cooldown: 'short recovery', risk: 'mental strain'},
    projection: {cost: 'moderate spiritual effort', cooldown: 'short recovery', risk: 'spiritual strain'},
    transformation: {cost: 'substantial sustained effort', cooldown: 'extended recovery', risk: 'bodily strain'},
    transport: {cost: 'substantial spiritual effort', cooldown: 'extended recovery', risk: 'disorientation'},
    material: {cost: 'prepared supply', cooldown: 'preparation dependent', risk: 'supply exhaustion'},
    passive: {cost: 'ongoing upkeep uncertain', cooldown: 'activation recovery not inferred', risk: 'upkeep strain uncertain'},
};

// Deliberately narrow name hints. They select a proposal, not a source fact.
// Unknown names get an explicit reason rather than a generic invented mechanism.
export function abilityMechanismHint(row) {
    const name = String(row.name ?? row.label ?? '').toLowerCase();
    if (/\b(passive|permanent)\b/.test(name)) return 'passive';
    if (/\b(paper.doll|talisman|charm|ammunition|bullet crafting)\b/.test(name)) return 'material';
    if (/\b(teleport|teleportation|blink|travel|jump|door opening)\b/.test(name)) return 'transport';
    if (/\b(transform|transformation|shapeshift|regeneration)\b/.test(name)) return 'transformation';
    if (/\b(insight|vision|sight|sense|sensing|perception|intuition|divination|detect)\b/.test(name)) return 'perception';
    if (/\b(hypnosis|soothe|soothing|dream|mind|mental|telepathy|psychological)\b/.test(name)) return 'mental';
    if (/\b(flame|fire|lightning|air bullet|summon|summoning|spirituality)\b/.test(name)) return 'projection';
    if (/\b(strength|agility|speed|balance|aim|punch|kick|climb|climbing)\b/.test(name)) return 'bodily';
    return null;
}

/** Pure authoring inference. sequence is the user's rung, not volume, target
 * rank or an incidental number in a name. Null leaves rank explicitly unresolved.
 * profile is a per-world map of mechanism -> {cost,cooldown,risk}; no numeric
 * spending, cooldown timers, damage or failure probability is authored here. */
export function inferAbilityCost(row, {sequence = null, mechanism = null, worldId = 'unspecified', profile = {}} = {}) {
    if (hasStatedAbilityCost(row)) return null;
    const basis = {rule: 'l10-cost-v1', worldId, sequence, mechanism: mechanism ?? abilityMechanismHint(row),
        mechanismBasis: mechanism == null ? 'name hint, not source verified' : 'caller supplied',
        rankBasis: sequence == null ? 'rung unstated; no volume-to-rung assumption' : 'caller supplied user rung',
        status: 'proposal', dial: 'world profile, mastery, duration and circumstances'};
    if (sequence !== null && (!Number.isInteger(sequence) || sequence < 0 || sequence > 9)) {
        return {inferred: true, basis, reason: 'Invalid Sequence; supply an integer from 0 to 9 or null.'};
    }
    const defaults = Object.hasOwn(DEFAULTS, basis.mechanism) ? DEFAULTS[basis.mechanism] : null;
    if (!defaults) return {inferred: true, basis, reason: 'Mechanism unresolved; needs a reviewed mechanism before cost inference.'};
    const tuning = profile[basis.mechanism] ?? {};
    for (const key of ['cost', 'cooldown', 'risk']) {
        if (key in tuning && (typeof tuning[key] !== 'string' || !tuning[key].trim())) throw Error(`Invalid ${key} adjective.`);
    }
    const intensity = sequence == null ? 'unresolved' : sequence >= 7 ? 'modest' : sequence >= 5 ? 'demanding' : sequence >= 2 ? 'major' : 'extreme';
    return {inferred: true, basis, cost: tuning.cost ?? defaults.cost, cooldown: tuning.cooldown ?? defaults.cooldown,
        risk: tuning.risk ?? defaults.risk, intensity,
        reason: 'Ordinary use requires effort, attention or supplies through this mechanism; higher-rung scope defaults to greater demands, adjustable by mastery and world.'};
}
