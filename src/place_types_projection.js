// Public place-type facts for shell views. The caller injects the native stage
// lookup, effective penalty and stat names, so this module reads no game state.
export function projectPlaceTypes(types, {stageOf, penalty, statName}) {
    return (types || []).map(({type, stage}) => {
        const definition = stageOf(type, stage);
        if (!definition) return null;
        const effects = [];
        for (const [stat, effect] of Object.entries(definition.effects || {})) {
            for (const kind of ['multiplier', 'flat']) {
                if (!effect[kind]) continue;
                const actual = penalty(type, stage, stat, kind);
                effects.push({stat: statName(stat), kind, actual: Math.round(1000 * actual) / 1000,
                    base: actual != effect[kind] ? effect[kind] : null});
            }
        }
        return {id: `${type}:${stage}`, label: type + (stage > 1 ? ` ${'I'.repeat(stage)}` : ''),
            description: definition.description || '', effects};
    }).filter(Boolean);
}

// Same wording as the native location tooltip.
export function placeTypeEffectText({stat, kind, actual, base}) {
    const value = kind === 'multiplier' ? `${stat} x${actual}` : `${stat}: ${actual}`;
    if (base == null) return value;
    return `${value} [base: ${kind === 'multiplier' ? 'x' : ''}${base}]`;
}
