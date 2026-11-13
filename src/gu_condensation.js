// A refinement profile describes which result the Gu preserves. Other
// properties of the practiced move stay on the procedure that produced them.
export function deriveGuCondensation({witness, profile}) {
    const measure = output => {
        const measured = witness?.outcome === 'complete' && witness.effects
            .find(effect => effect.kind === output.sourceEffect)?.[output.measure];
        if (!Number.isFinite(measured) || measured <= 0) throw Error('Complete the source move and witness its effect first.');
        return {kind: output.effect, magnitude: Math.min(measured, output.capacity)};
    };
    return {
        recipe: profile.recipe,
        ability: {fuel: profile.fuel, cost: profile.cost,
            ...(profile.outputs ? {effects: profile.outputs.map(measure)} : {effect: measure(profile)})},
    };
}
export const beamCondensationMinutes = 15;
export const beamCondensationProfile = {
    sourceEffect: 'lower-beam', measure: 'load', effect: 'lower-beam', capacity: 1, fuel: 'primeval', cost: 2,
    recipe: {id: 'beam-catch-condensation', revision: 1, kind: 'beam-catch', rank: 1, recordLineage: true,
        stages: [{id: 'shape', inputs: [{material: 'petals', amount: 2}, {material: 'stone', amount: 1}]},
            {id: 'settle', inputs: []}]},
};
export const quietBeamCondensationProfile = {...beamCondensationProfile, outputs: [beamCondensationProfile,
    {sourceEffect: 'quiet-beam', measure: 'noise', effect: 'quiet-beam', capacity: 2}]};
