// A refinement profile describes which result the Gu preserves. Other
// properties of the practiced move stay on the procedure that produced them.
export function deriveGuCondensation({witness, profile}) {
    const measured = witness?.outcome === 'complete' && witness.effects
        .find(effect => effect.kind === profile.sourceEffect)?.[profile.measure];
    if (!Number.isFinite(measured) || measured <= 0) throw Error('Complete the source move and witness its effect first.');
    return {
        recipe: profile.recipe,
        ability: {fuel: profile.fuel, cost: profile.cost,
            effect: {kind: profile.effect, magnitude: Math.min(measured, profile.capacity)}},
    };
}
