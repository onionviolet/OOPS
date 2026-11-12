import {DAMAGE_TYPES} from './damage_types.js';

// Layers are ordered outside to inside. A layer spends capacity only on
// damage it can intercept. A landing can follow a blast as its own packet.
export function resolveGuDefense(packets, layers) {
    const guards = layers.map(({id, type, phase, capacity, breaks}) => {
        if (!DAMAGE_TYPES.includes(type) || !Number.isFinite(capacity) || capacity <= 0) throw Error('Invalid Gu defense layer.');
        return {id, type, phase, capacity, breaks, absorbed: 0};
    });
    const remainder = packets.map(packet => {
        if (!DAMAGE_TYPES.includes(packet.type) || !Number.isFinite(packet.amount) || packet.amount < 0) {
            throw Error('Invalid incoming damage.');
        }
        let amount = packet.amount;
        for (const guard of guards) {
            if (guard.type !== packet.type || guard.phase !== packet.phase) continue;
            const stopped = Math.min(amount, guard.capacity - guard.absorbed);
            guard.absorbed += stopped;
            amount -= stopped;
        }
        return {...packet, amount};
    });
    return {remainder, layers: guards.map(({id, capacity, absorbed, breaks}) => ({
        id, absorbed, broken: !!breaks && absorbed === capacity,
    }))};
}
