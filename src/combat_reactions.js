export const frontierReactions = Object.freeze({
    initialChance: 0.12, trainedChance: 0.32, trainingScale: 25,
    parryReduction: 0.25, counterPower: 0.45,
});

function reacts(training, roll, row) {
    const level = Math.max(0, training || 0);
    return roll < row.initialChance + (row.trainedChance - row.initialChance) * level / (level + row.trainingScale);
}

export function quoteParry(training, roll, row = frontierReactions) {
    return reacts(training, roll, row) ? {reduction: row.parryReduction} : null;
}

export function quoteRiposte(training, roll, row = frontierReactions) {
    return reacts(training, roll, row);
}
