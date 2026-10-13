// A synchronous native craft batch mutates live model owners before create_save.
// Preserve their identities and prototypes without replaying reward/inventory APIs.
// Private fields must be exposed explicitly through the owners' existing getters.
export function beginNativeCraftTransaction({owners = [], bindings = [], onRollback} = {}) {
    if(!Array.isArray(owners) || !Array.isArray(bindings)) throw new TypeError('Invalid native craft owners.');
    const snapshots = new Map();
    function capture(value) {
        if(value === null || typeof value !== 'object' || snapshots.has(value)) return;
        // These require internal-slot restoration, which this native data boundary
        // deliberately does not promise. Fail before crafting if an owner drifts.
        if(value instanceof Map || value instanceof Set || value instanceof Date || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
            throw new TypeError('Unsupported native craft owner.');
        }
        const descriptors = Object.getOwnPropertyDescriptors(value);
        snapshots.set(value, descriptors);
        for(const key of Reflect.ownKeys(descriptors)) {
            const descriptor = descriptors[key];
            if('value' in descriptor) capture(descriptor.value);
        }
    }
    const bound = bindings.map(binding => {
        if(typeof binding?.get !== 'function' || typeof binding?.set !== 'function') throw new TypeError('Invalid native craft binding.');
        const value = binding.get(); capture(value);
        return {binding, value};
    });
    owners.forEach(capture);
    let status = 'pending';
    return {
        get status() {return status;},
        // Call immediately AFTER synchronous durable setItem returns, BEFORE
        // publish/render/event callbacks. A later error must never undo this batch.
        markDurable() {
            if(status !== 'pending') throw new Error('Native craft batch is already settled.');
            status = 'durable'; snapshots.clear(); bound.length = 0;
        },
        rollback() {
            if(status !== 'pending') return false;
            for(const [owner, descriptors] of snapshots) {
                for(const key of Reflect.ownKeys(owner)) if(!Object.hasOwn(descriptors, key)) {
                    if(!Reflect.deleteProperty(owner, key)) throw new Error('Could not restore native craft owner.');
                }
                // Array length must be restored after indexed entries, since it
                // can otherwise truncate entries that still need restoration.
                for(const key of Reflect.ownKeys(descriptors)) if(!(Array.isArray(owner) && key === 'length')) {
                    Object.defineProperty(owner, key, descriptors[key]);
                }
                if(Array.isArray(owner)) Object.defineProperty(owner, 'length', descriptors.length);
            }
            for(const {binding, value} of bound) binding.set(value);
            status = 'rolled-back'; snapshots.clear(); bound.length = 0;
            // Optional redraw runs only AFTER all live data has been restored.
            onRollback?.();
            return true;
        }
    };
}

// Registry references alone do not expose private availability fields in active
// Quest/QuestTask instances. Include them even when the registry was overwritten
// by a later instance. No setStatus call: it intentionally cannot relock unlocks.
export function nativeCraftQuestOwners(quests = {}, activeQuests = {}) {
    const owners = [quests, activeQuests];
    for(const quest of [...Object.values(quests), ...Object.values(activeQuests)]) {
        owners.push(quest.getAvailabilityComponent());
        for(const task of quest.quest_tasks || []) owners.push(task.getAvailabilityComponent());
    }
    return owners;
}
