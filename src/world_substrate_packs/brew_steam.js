// Reference contact pack, brewing heat (W v0; ownership passes to chat B at
// embed). A batch on a burner runs the existing thermal leaf
// (craft_process_thermal.js) closed-form from its anchor, so a long jump and
// many short steps reach the same temperature, extraction and fuel. While the
// burner burns, the batch steams into its place's humidity. When the burner goes
// out it publishes smoke into the place. The pack knows nothing about who else
// is in the room.
import {advanceThermal, createThermalState, validateThermalState} from '../craft_process_thermal.js';
import {WORLD_QUANTITIES as Q} from '../world_quantities.js';

const remainingBurn = t => t.segment.at + t.segment.burnSeconds - t.elapsedSeconds;

export function createBrewSteamPack({thermalLaw, steamPerMinute}) {
    if (!Number.isSafeInteger(steamPerMinute) || steamPerMinute < 0) throw new Error('Brew steam: steamPerMinute is whole.');
    const isBatch = h => h.kind === 'thing' && h.tags.includes('brew.batch');
    // A minute steams when the burner is lit at its start; that is the same test in one jump or many steps.
    const burning = s => remainingBurn(s.thermal) > 0;
    return {
        id: 'b.brew_steam', revision: 0,
        quantities: [Q.humidity], reads: ['humidity'], writes: ['humidity'],
        laws: [{
            id: 'batch', appliesTo: isBatch,
            rates: (view, id) => {
                const place = view.placeOf(id);
                return burning(view.state(id)) && view.has(place, 'humidity') && steamPerMinute
                    ? [{holder: place, quantity: 'humidity', perMinute: steamPerMinute}] : [];
            },
            horizon: (view, id) => {
                const s = view.state(id);
                return burning(s) ? Math.max(1, Math.ceil(remainingBurn(s.thermal) / 60)) : Infinity;
            },
            advance: (view, id, minutes) => {
                const s = view.state(id);
                return [{op: 'state', holder: id, value: {...s, thermal: advanceThermal(thermalLaw, s.thermal, minutes * 60)}}];
            },
            decide: (view, id) => {
                const s = view.state(id), lit = burning(s);
                if (lit === s.lit) return [];
                return [{op: 'state', holder: id, value: {...s, lit}},
                    ...(!lit ? [{op: 'publish', kind: 'smoke', place: view.placeOf(id), detail: {fuelSpent: s.thermal.fuelSpent}}] : [])];
            },
        }],
    };
}

/** Batch state from an admitted thermal quote (the thermal leaf refuses a bad one). */
export function brewBatchState(thermalLaw, quote, options) {
    const thermal = validateThermalState(createThermalState(thermalLaw, quote, options));
    return {thermal, lit: remainingBurn(thermal) > 0};
}
