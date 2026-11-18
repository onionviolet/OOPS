// A Hogwarts spell lands in a world (PSA27, PC8): a lead casts Lumos in a dim hall. The spell law settles the
// working as a sentence and the engine's effect host lands it, so the hall's lamp-light quantity changes.
// Defaults: a wand's light is its own light kind (`light:wand`), grade 4 for half an hour; both are dials here.
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, startEngineWorking} from '../engine_world.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../spell_law.js';
import {sentenceFromIntent} from '../spell_effects.js';
import {readQuantity} from '../world_substrate.js';
import {formatDuration} from '../number_format.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';

const hall = 'dim_classroom', caster = 'student', wand = 'wand', LIGHT = 'light:wand', GRADE = 4, MINUTES = 30;
const vocabulary = {id: 'w.vocabulary', quantities: Object.values(WORLD_QUANTITIES), properties: Object.values(WORLD_PROPERTIES)};
const config = {ownPacks: [vocabulary], packs: [vocabulary.id],
    host: {laws: [SPELL_EFFECT_LAW], effects: {keys: {light: 'wand'}}}};
const lumos = sentenceFromIntent({intent: 'light', target: 'place', execution: 'sustained', carrier: 'wand', cost: 'stamina'});
const light = engine => readQuantity(engine.world, hall, LIGHT);
const casts = engine => Object.keys(engine.records.workings).length;

const start = () => createEngineWorld({...config, holders: [
    {id: hall, kind: 'place', quantities: {[LIGHT]: 0}},
    {id: caster, kind: 'body', place: hall, properties: {alive: true}}]});

function cast(engine) {
    const {method, bindings} = spellEffectMethod([{sentence: lumos, target: {id: hall}, minutes: 1,
        details: {target: {shape: 'holder', id: hall}, amount: GRADE, minutes: MINUTES, cost: 0}}], {id: `charm.lumos.${casts(engine)}`});
    const begun = startEngineWorking(engine, {law: SPELL_EFFECT_LAW, id: `charm.lumos.${casts(engine)}`, method, bindings});
    return advanceEngineWorld(begun, begun.world.clock + 1).engine;
}

const view = engine => ({facts: [['Light in the room', `${light(engine)} (a wand's glow adds ${GRADE})`], ['Spells cast', String(casts(engine))]],
    actions: [{id: 'lumos', label: 'Cast Lumos', detail: `Light the room with your wand for ${formatDuration(MINUTES)}.`}],
    result: casts(engine) ? `You cast Lumos. The room's wand-light stands at ${light(engine)}.` : undefined,
    history: Array.from({length: casts(engine)}, (_, i) => `Cast ${i + 1}: Lumos lit the room.`)});

export const hogwartsLumosRun = {
    title: 'Hogwarts · Lumos', introduction: 'A dim classroom and your wand. Cast Lumos and watch what the spell changes in the room.',
    create: start, restore: saved => restoreEngineWorld(saved, config), view,
    act: (engine, id) => { if (id !== 'lumos') throw Error('That action is unavailable.'); return cast(engine); },
};
export const lumosLight = light;
