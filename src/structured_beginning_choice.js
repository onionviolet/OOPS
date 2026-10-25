// Installed packs are registered in manifest order. The first is the current
// authored edition; later editions remain available to exact saved receipts.
// Reading this choice neither draws randomness nor provisions a life.
export function initialStructuredBeginning(definitions, probeId = null) {
    return (probeId && definitions.get(probeId)) || definitions.values().next().value;
}

// Typed presentation registrations reference loader-owned starts. Selection is
// a transient preview; only the existing durable origin transaction grants stock.
export function createStructuredBeginningChoices(definitions, probe = () => null) {
    const registrations = new Map();
    let selected = null;
    const fallback = () => {
        const candidate = typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)
            ? new URLSearchParams(location.search).get('structured_candidate') : null;
        return initialStructuredBeginning(definitions, candidate || probe());
    };
    const definition = () => selected ? definitions.get(selected.packId) : fallback();
    const unlocked = state => !state.structured && !state.pendingStructured;
    return {
        register(entry) {
            const d = definitions.get(entry.packId);
            if (!d?.starts?.length || !d.contentHash || registrations.has(entry.packId)
                || ['label', 'arrival', 'means'].some(k => typeof entry[k] !== 'string' || !entry[k]))
                throw Error('A beginning choice requires a loaded typed start and arrival description.');
            registrations.set(entry.packId, Object.freeze({...entry}));
        },
        definition,
        preview(view, state) {
            if (!unlocked(state)) return view;
            return {...view, choices: [...registrations.values()], selectedBeginning: selected?.packId || '',
                beginningHash: selected?.contentHash || '', arrival: selected ? registrations.get(selected.packId) : null};
        },
        handle(command, state, context) {
            if (!['select-beginning', 'cancel-beginning'].includes(command.type)) return false;
            if (!unlocked(state)) throw Error('Your saved beginning is already chosen. Continue it instead.');
            if (context.worldId !== 'base.frontier' || context.facts?.location !== 'Village' || context.busy)
                throw Error('Choose a beginning from an unoccupied Village opening.');
            if (command.type === 'cancel-beginning') { selected = null; return true; }
            const d = definitions.get(command.packId);
            if (!registrations.has(command.packId) || !d?.starts?.length) throw Error('This beginning is unavailable.');
            selected = {packId: d.id, contentHash: d.contentHash};
            return true;
        },
        require(command, state) {
            if (!definition()) throw Error('This beginning content is unavailable.');
            if (unlocked(state) && command.packId && !selected) throw Error('This arrival preview is out of date. Choose the beginning again.');
            if (selected && unlocked(state) && (command.packId !== selected.packId || command.contentHash !== selected.contentHash
                || definition().contentHash !== selected.contentHash))
                throw Error('This arrival preview is out of date. Choose the beginning again.');
            if (command.packId && (state.structured || state.pendingStructured) && command.packId !== (state.structured || state.pendingStructured).packId)
                throw Error('Continue your saved beginning instead.');
            return true;
        },
    };
}
