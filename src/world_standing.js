export const worldPopulations = {
    'base.frontier': {name: 'Frontier', powerAtPercentile: [0, 12, 35, 80, 240]},
    'book.lotm.tingen': {name: 'Tingen', powerAtPercentile: [0, 8, 28, 100, 420]},
};

// The bands describe a modeled population. Their power values correspond
// to the same five population percentiles in every consuming world.
const percentiles = [0, 50, 80, 95, 100];

export function worldStanding(worldId, power) {
    const population = worldPopulations[worldId];
    if (!population || !Number.isFinite(power)) return null;
    const bands = population.powerAtPercentile;
    let percentile = 100;
    for (let i = 1; i < bands.length; i++) {
        if (power > bands[i]) continue;
        const fraction = (Math.max(0, power) - bands[i - 1]) / (bands[i] - bands[i - 1]);
        percentile = percentiles[i - 1] + fraction * (percentiles[i] - percentiles[i - 1]);
        break;
    }
    return {population: population.name, power, topPercent: Math.max(1, Math.ceil(100 - percentile))};
}
