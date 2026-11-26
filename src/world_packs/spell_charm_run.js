// Hogwarts Lumos and Nox land in a world (PSA27, PC8): the spell law settles each working as a sentence and
// the engine's effect host changes the hall's wand-light quantity. Grade 4 and the half-hour Lumos duration
// are dials here; Nox puts out the light from the run's one wand.
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
const nox = sentenceFromIntent({intent: 'darken', target: 'place', execution: 'instant', carrier: 'wand', cost: 'none'});
const light = engine => readQuantity(engine.world, hall, LIGHT);
const casts = engine => Object.keys(engine.records.workings).length;

const start = () => createEngineWorld({...config, holders: [
    {id: hall, kind: 'place', quantities: {[LIGHT]: 0}},
    {id: caster, kind: 'body', place: hall, properties: {alive: true}}]});

function cast(engine, name) {
    const sentence = name === 'nox' ? nox : lumos;
    const amount = name === 'nox' ? Math.max(GRADE, light(engine)) : GRADE;
    const id = `charm.${name}.${casts(engine)}`;
    const {method, bindings} = spellEffectMethod([{sentence, target: {id: hall}, minutes: 1,
        details: {target: {shape: 'holder', id: hall}, amount, minutes: MINUTES, cost: 0}}], {id});
    const begun = startEngineWorking(engine, {law: SPELL_EFFECT_LAW, id, method, bindings});
    return advanceEngineWorld(begun, begun.world.clock + 1).engine;
}

const spellName = id => id.includes('.nox.') ? 'Nox' : 'Lumos';
const spellOutcome = (name, amount) => `You cast ${name}. The room's wand-light stands at ${amount}.`;
const history = engine => Object.keys(engine.records.workings).map((id, i) => {
    const name = spellName(id);
    return `Cast ${i + 1}: ${name}.`;
});

const view = engine => {
    const ids = Object.keys(engine.records.workings), rows = history(engine);
    const name = ids.length ? spellName(ids.at(-1)) : null;
    return {facts: [['Light in the room', `${light(engine)} (a wand's glow adds ${GRADE})`], ['Spells cast', String(casts(engine))]],
        actions: [
            {id: 'lumos', label: 'Cast Lumos', detail: `Light the room with your wand for ${formatDuration(MINUTES)}.`},
            {id: 'nox', label: 'Cast Nox', detail: 'Extinguish wand-light in the room.'},
        ],
        result: name ? spellOutcome(name, light(engine)) : undefined,
        history: rows};
};

export const hogwartsLumosRun = {
    title: 'Hogwarts · Lumos and Nox', introduction: 'A dim classroom and your wand. Cast Lumos to light the room, then Nox to put the wand-light out.',
    create: start, restore: saved => restoreEngineWorld(saved, config), view,
    act: (engine, id) => { if (!['lumos', 'nox'].includes(id)) throw Error('That action is unavailable.'); return cast(engine, id); },
};
export const lumosLight = light;
