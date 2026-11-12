// Reference contact pack, brewing heat (W v0; ownership passes to chat B at
// embed). A batch on a burner runs the existing thermal leaf
// (craft_process_thermal.js) closed-form from its anchor, so a long jump and
// many short steps reach the same temperature, extraction and fuel. While the
// burner burns, the batch steams into its place's humidity. When the burner goes
// out it publishes smoke into the place. The pack knows nothing about who else
// is in the room.
import {advanceThermal, createThermalState, thermalYield, validateThermalState} from '../craft_process_thermal.js';
import {WORLD_QUANTITIES as Q, WORLD_EFFECT_KINDS as K} from '../world_quantities.js';

const remainingBurn = t => t.segment.at + t.segment.burnSeconds - t.elapsedSeconds;

// Optional recipe row: at burnout, a moisture-sensitive binder leaves part
// of the usable active material in the vessel film. The thermal leaf still
// owns heat, extraction and degradation, including cooling after burnout.
export function createBrewSteamPack({thermalLaw, steamPerMinute, humidityFinish}) {
    if (!Number.isSafeInteger(steamPerMinute) || steamPerMinute < 0) throw new Error('Brew steam: steamPerMinute is whole.');
    const finishRule = humidityFinish == null ? null : {...humidityFinish};
    if (finishRule) {
        const {activeAmount, maxHumidity, dampResiduePercent} = finishRule;
        if (!Number.isSafeInteger(activeAmount) || activeAmount < 0 ||
            !Number.isSafeInteger(maxHumidity) || maxHumidity < Q.humidity.min || maxHumidity > Q.humidity.max ||
            !Number.isSafeInteger(dampResiduePercent) || dampResiduePercent < 0 || dampResiduePercent > 100) {
            throw new Error('Brew steam: humidity finish needs a whole active amount and whole percentages.');
        }
    }
    const isBatch = h => h.kind === 'thing' && h.tags.includes('brew.batch');
    // A minute steams when the burner is lit at its start; that is the same test in one jump or many steps.
    const burning = s => remainingBurn(s.thermal) > 0;
    return {
        id: 'b.brew_steam', revision: 0,
        quantities: [Q.humidity], reads: ['humidity'], writes: ['humidity'],
        publishes: [K.smoke.id],
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
                const place = view.placeOf(id);
                const next = {...s, lit};
                if (!lit && finishRule) {
                    const {activeAmount, maxHumidity, dampResiduePercent} = finishRule;
                    const humidity = view.has(place, Q.humidity.id) ? view.amount(place, Q.humidity.id) : null;
                    const yieldAtBurnout = thermalYield(thermalLaw, s.thermal, activeAmount);
                    const film = humidity !== null && humidity > maxHumidity
                        ? Number(BigInt(yieldAtBurnout.usable) * BigInt(dampResiduePercent) / 100n) : 0;
                    next.finish = {at: view.clock, place, humidity, activeAmount, maxHumidity, dampResiduePercent,
                        ...yieldAtBurnout, usable: yieldAtBurnout.usable - film, film};
                }
                return [{op: 'state', holder: id, value: next},
                    ...(!lit ? [{op: 'publish', kind: K.smoke.id, place, detail: {fuelSpent: s.thermal.fuelSpent}}] : [])];
            },
        }],
    };
}

/** Batch state from an admitted thermal quote (the thermal leaf refuses a bad one). */
export function brewBatchState(thermalLaw, quote, options) {
    const thermal = validateThermalState(createThermalState(thermalLaw, quote, options));
    return {thermal, lit: remainingBurn(thermal) > 0};
}
