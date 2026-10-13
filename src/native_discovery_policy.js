// Event identity and disclosure are supplied by the native owner. No XP, RNG,
// inventory, getter, DOM or save access belongs in this presentation policy.
export function createDiscoveryCuePolicy() {
    const seen = new Set();
    return {
        take(events = []) {
            const fresh = [];
            for (const event of events) {
                if (event?.type !== 'native-skill-discovery' || event.settled !== true ||
                    event.known !== true || typeof event.id !== 'string' || !event.id ||
                    typeof event.label !== 'string' || !event.label.trim() || seen.has(event.id)) continue;
                seen.add(event.id);
                fresh.push({id: event.id, label: event.label});
            }
            // The native log retains each discovery. A synchronous batch gets
            // one small visual cue; no decorative backlog delays gameplay.
            if (!fresh.length) return null;
            return {type: 'native-skill-discovery', motif: 'guidance',
                sequence: fresh.map(row => row.id).join('|'), id: fresh.at(-1).id,
                text: fresh.length === 1 ? `Discovered: ${fresh[0].label}` :
                    `Discovered ${fresh.length} skills: ${fresh.map(row => row.label).join(', ')}`};
        },
        reset() {seen.clear();}
    };
}
