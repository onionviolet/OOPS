// Hook vocabulary follows GauTech/experimental-idle-rpg, src/enemies.js.
// Only an attempted swing reaches on_strike. A miss or full block ends it
// before on_connectedstrike. Each adjustment multiplies the existing strike.
export const traitHooks = Object.freeze(['custom_generate', 'on_entry', 'on_strike', 'on_connectedstrike', 'on_death']);

export function quoteCounterTrait(row, hostileStats) {
    if (!traitHooks.includes(row.hook)) throw Error('Unknown enemy trait hook.');
    const measured = Math.max(0, hostileStats[row.stat] || 0);
    const other = row.compare ? Math.max(1, hostileStats[row.compare] || 0) : row.scale;
    const share = row.low ? other / (other + measured) : measured / (other + measured);
    return 1 + row.change * share;
}
