// Detection channels read the signal they can reach. A physical screen can
// block a channel even when the observer sees through magical concealment.
export function detectGuApproach({senses, concealment = [], screens = []}) {
    return Object.entries(senses).find(([channel, {reach, penetration = 0}]) =>
        !screens.includes(channel) && reach + penetration > concealment
            .filter(effect => effect.channel === channel).reduce((sum, effect) => sum + effect.magnitude, 0))?.[0] ?? null;
}

export function readGuSignals(signals, reach) {
    return signals.filter(signal => signal.distance <= (reach[signal.channel] ?? -1));
}
