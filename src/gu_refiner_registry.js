// One effect type, `guRefine`, for any world that refines Gu through the shared engine (gu_refinement.js). A world module registers its
// refiner here; the three shared seams (simulation_contracts, structured_pack_definitions, simulation_effects) each ask this registry
// and hold nothing world-specific (foundation run 2026-11-14, FND5/AD51; replaces a Keeper-style one-off gate per world).
// Effect shape: {type: 'guRefine', actor: 'player', world, operation}. Only the registered pack may carry it, only as a command named
// `${pack}.${operation}`, and only for the player. `consequences(state, effect, context)` runs the engine and returns ordinary effects
// (items, facts, notes) that the effect path applies with its usual checks, so this registry never writes state itself.
// Leaf: no imports.
const refiners = new Map();
const text = v => typeof v === 'string' && v.length > 0;

export function registerGuRefiner(world, {pack, operations, consequences}) {
    if(!text(world) || !text(pack) || !Array.isArray(operations) || !operations.length || !operations.every(text) || typeof consequences !== 'function') {
        throw Error('A Gu refiner needs a world, its pack, its operations and a consequence function.');
    }
    const prior = refiners.get(world);
    if(prior && prior.pack !== pack) throw Error(`World ${world} already has a Gu refiner.`);
    refiners.set(world, Object.freeze({pack, operations: Object.freeze([...operations]), consequences}));
}

export function isGuRefineEffect(e) {
    const r = e?.type === 'guRefine' && refiners.get(e.world);
    return !!r && e.actor === 'player' && r.operations.includes(e.operation) &&
        Object.keys(e).every(k => ['type', 'actor', 'world', 'operation'].includes(k));
}

// The pack-definition gate: the registered pack, in its own world, on the command named for the operation, for the player.
export function guRefinePackEffect(e, {pack, world, command, player}) {
    return player && isGuRefineEffect(e) && e.world === world && refiners.get(world).pack === pack && command === `${pack}.${e.operation}`;
}

// Settle: the world's refiner runs the engine and returns the effects to apply. The actor must be in that world.
export function guRefineConsequences(state, e, context) {
    if(!isGuRefineEffect(e) || context?.actorId !== 'player' || state.actors?.player?.worldId !== e.world) throw Error('There is no Gu here to refine.');
    const out = refiners.get(e.world).consequences(state, e, context);
    if(!Array.isArray(out) || out.some(x => x?.type === 'guRefine')) throw Error('A Gu refiner returns ordinary effects.');
    return out;
}
