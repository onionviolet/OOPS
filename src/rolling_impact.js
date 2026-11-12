export function impactOfRollingLoad({mass, drop, loss, track}) {
    const motion = Math.max(0, mass * drop - loss);
    return {at: motion > 0 ? track.end : track.start, vibration: motion};
}

export function seversTether(effects, strength) {
    return effects.some(effect => effect.kind === 'damage' && effect.magnitude >= strength);
}

export function tetherFailureDelay({load, capacity, strainBudget}) {
    const overload = load - capacity;
    return overload > 0 ? Math.max(1, Math.ceil(strainBudget / overload)) : null;
}
