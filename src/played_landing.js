// The played-landing joint (PWC131). A played action in a native life lands its effect sentences through `landEffect` on a
// small transient engine world, seeded from the facts the action names, and reports what changed. Nothing here is saved and no
// native fact is written: the world lives for one action, so the native owner of health, items and conditions stays the one
// authority (AR3) and this reports beside it. A caller that wants a landed number to matter reads `result.after` itself.
// Default: one place and one living body, the shared effect vocabulary. Dial: `packs` adds laws a sentence needs.
// Domain-free: the words, amounts and bodies come from the caller's row (played_effects_domain.js).
import {createEngineWorld} from './engine_world.js';
import {landEffect} from './effect_host.js';
import {EFFECT_SHARED} from './world_effect_packs.js';

const PLACE = 'here';
const BASE_PACKS = ['l.living_body', 'a.mind'];

/** steps: [{sentence, details?}] landed in order on one body; each step's details aim at the body unless they name a target. */
export function landPlayed({entry, law, body, steps, packs = BASE_PACKS, keys = {}}) {
    const holder = {kind: 'body', tags: ['living.body'], ...body, place: PLACE};
    let engine = createEngineWorld({packs, shared: EFFECT_SHARED, holders: [{id: PLACE, kind: 'place'}, holder]});
    const before = structuredClone(engine.world.holders[holder.id]);
    const results = [];
    for (const [index, step] of steps.entries()) {
        const run = landEffect(engine.rules, engine.world, {sentence: step.sentence,
            details: {target: {shape: 'holder', id: holder.id}, place: PLACE, ...step.details}},
            {entry, law, cause: `${entry}:${index}`, by: holder.id, keys});
        engine = {...engine, world: run.world};
        results.push({status: run.status, changed: run.changed, reason: run.reason});
    }
    return {results, landed: results.filter(r => r.changed).length, before, after: engine.world.holders[holder.id]};
}

export const sentence = (verb, object, target, time, carrier) => ({verb, object, target, time, carrier, cost: 'none', limits: []});
