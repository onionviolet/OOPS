import {creatureGrowthPauseUntil, creatureHealth} from './creature_lifecycle.js';
import {applyEngineOps} from './engine_world.js';
import {JUVENILE_GROWTH, JUVENILE_GROWTH_PAUSE} from './world_substrate_packs/living_body.js';

// Project the saved care schedule before the next advance. A host settles
// changes to wounds and care at the current world minute before calling this.
export function syncCreatureGrowthCare(engine, lifecycle) {
    if (!engine.rules.packs.includes('l.living_body')) return engine;
    const {world} = engine;
    const property = JUVENILE_GROWTH_PAUSE.id;
    const ops = Object.values(world.holders).flatMap(body => {
        if (body.kind !== 'body' || !(body.quantities[JUVENILE_GROWTH.id] > 0) || body.refs.creature !== body.id) return [];
        const animal = lifecycle.individuals[body.id];
        if (!animal?.pauseWhileInjured || animal.deadAt !== undefined) return [];
        const until = creatureGrowthPauseUntil(creatureHealth(lifecycle, body.id, world.clock));
        const savedUntil = body.properties[property] ?? null;
        if (until === savedUntil || until === null && savedUntil <= world.clock) return [];
        return [{op: 'property', holder: body.id, property, value: until}];
    });
    return ops.length ? applyEngineOps(engine, ops, 'creature-growth-care') : engine;
}
