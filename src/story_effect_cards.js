// Effect-carrying story cards (PWC129, AR1, AR3, AR14). The story director and the derived deck already decide which ordinary happening
// surfaces; a card may also carry an `effect` ({row, sentence, amount?, line?, thought?}), and when the director surfaces it the happening
// lands on the household through the one effect host (`landEffect`). One card shape (storylet_deck2.js), one path here, no second effect
// system: `story_director.js` is untouched and still writes nothing; this leaf is called by a domain once per window, never from a render.
// The household is a small engine world kept in the save (story_effects_domain.js). `row` names the source ledger row (a grammar's own
// sentence for a potion, a Gu or a spell) and is for the debug projection only, never player text (PRS).
// Dials (default, reason):
//   amount 3   the vitality a household happening moves: a bad cup or a shock is felt for a day, never a danger (a pacing dial, SKR11).
//   keep 12    log rows the save keeps; the Reports line already told the player.
import {createEngineWorld, restoreEngineWorld, serializeEngineWorld} from './engine_world.js';
import {landEffect} from './effect_host.js';
import {livingBodyState} from './world_substrate_packs/living_body.js';
import {EFFECT_GRAMMARS, EFFECT_PACK_IDS, EFFECT_SHARED, HP_KEYS, SUBSTRATE_OWN_PACKS} from './world_effect_packs.js';

export const HOUSEHOLD_YOU = 'you', HOUSEHOLD_PLACE = 'home';
export const EFFECT_AMOUNT = 3, KEEP = 12;
const config = {
    ownPacks: [SUBSTRATE_OWN_PACKS.vapor({constituents: {irritant: {harm: 'vapor-irritation'}}, uptakePermille: 500}),
        SUBSTRATE_OWN_PACKS.splash({uptakePermille: 500, response: {part: 'irritant', minimum: 1, form: 'swollen', minutes: 30, priority: 1}}),
        SUBSTRATE_OWN_PACKS.aperture(), SUBSTRATE_OWN_PACKS.protection(), SUBSTRATE_OWN_PACKS.breathing(),
        SUBSTRATE_OWN_PACKS.fiendfyre(), SUBSTRATE_OWN_PACKS.sustain(), SUBSTRATE_OWN_PACKS.form()],
    packs: ['l.living_body', 'a.mind', ...EFFECT_PACK_IDS, 'b.vapor', 'b.splash'].filter((id, i, all) => all.indexOf(id) === i),
    shared: EFFECT_SHARED,
};
export const createHousehold = () => createEngineWorld({...config, holders: [{id: HOUSEHOLD_PLACE, kind: 'place'},
    {id: HOUSEHOLD_YOU, place: HOUSEHOLD_PLACE, kind: 'body', tags: ['living.body', 'breathes.air'], quantities: {satiety: 0, vitality: 20},
        state: {'l.living_body': livingBodyState({species: 'human', rate: 0})}}]});
export const restoreHousehold = saved => restoreEngineWorld(saved, config);

// A card's effect read from a ledger row: the sentence is the grammar's own reading of the row, never typed here (AR3).
export const potionRow = subject => ({row: `hp.potion:${subject}`, sentence: EFFECT_GRAMMARS['hp.potion'].sentences.find(s => s.subject === subject).parts});
export const guRow = id => ({row: `gu:${id}`, sentence: EFFECT_GRAMMARS.gu.read(id)});
export const withEffect = (id, text, source, extra, card = {}) => ({id, text, category: 'happening', ...card, effect: {...source, ...extra}});

// The single path from a surfaced card into the world. Returns the next engine and what the world did.
export function landCard(engine, card, window) {
    const fx = card.effect, before = engine.world.holders[HOUSEHOLD_YOU].quantities.vitality ?? 0;
    const run = landEffect(engine.rules, engine.world, {sentence: fx.sentence, details: {target: {shape: 'holder', id: HOUSEHOLD_YOU}, place: HOUSEHOLD_PLACE, amount: fx.amount ?? EFFECT_AMOUNT}},
        {cause: `card:${card.id}@${window}`, by: 'story', keys: HP_KEYS});
    const next = {...engine, world: run.world};
    return {engine: next, status: run.status, delta: (next.world.holders[HOUSEHOLD_YOU].quantities.vitality ?? 0) - before};
}

export const freshStoryEffects = () => ({version: 1, world: null, through: null, log: []});
export function validateStoryEffects(slice) {
    if(slice == null) return slice;
    if(slice.version !== 1 || !Array.isArray(slice.log) || slice.log.length > KEEP || !(slice.through === null || Number.isSafeInteger(slice.through)) ||
        slice.log.some(r => typeof r?.card !== 'string' || typeof r.row !== 'string' || !Number.isSafeInteger(r.window))) throw Error('This save has an unsupported story effects record.');
    if(slice.world) restoreHousehold(slice.world);
    return slice;
}
// One pass over the director's windows after `saved.through` up to `upto`: every effect card that surfaced lands once. Pure: returns the
// next record, the rows landed and the engine. A record with no cursor starts at `upto`, so a life already under way gets no backlog
// (compatibility note, 2026-11-18: a save from before this slice has no record; its past windows are not replayed).
export function deliverWindows(saved, directed, cardById, upto) {
    const rec = saved?.world ? saved : {...freshStoryEffects(), ...saved, world: serializeEngineWorld(createHousehold())};
    if(rec.through === null) return {record: {...rec, through: upto}, landed: []};
    let engine = restoreHousehold(rec.world), changed = false;
    const landed = [];
    for(let w = rec.through + 1; w <= upto; w++) {
        const id = directed[w]?.surfaced?.id, card = id && cardById.get(id);
        if(!card?.effect) continue;
        const out = landCard(engine, card, w);
        engine = out.engine; changed = true;
        landed.push({card: card.id, row: card.effect.row, window: w, status: out.status, delta: out.delta, line: out.status === 'landed' ? card.effect.line : undefined,
            thought: out.status === 'landed' ? card.effect.thought : undefined});
    }
    const record = {version: 1, through: Math.max(rec.through, upto), world: changed ? serializeEngineWorld(engine) : rec.world,
        log: [...rec.log, ...landed.map(({card, row, window, status, delta}) => ({card, row, window, status, delta}))].slice(-KEEP)};
    return {record, landed};
}
