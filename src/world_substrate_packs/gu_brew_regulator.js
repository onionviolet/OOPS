import {resolveGuActivation} from '../gu_activation.js';
import {WORLD_PROPERTIES as P, WORLD_QUANTITIES as Q} from '../world_quantities.js';

export const GU_BREW_REGULATOR = 'g.brew_regulator';
const ventOpen = {id: 'vent_open', type: 'flag'};
const humidity = Q.humidity.id;
const energy = 'energy:primeval.rank1';

// Authored rank-one Gu law. A pulse exchanges air between two well-mixed
// spaces at the same temperature. The outside space in this setup has ten
// times the effective air volume, so it gains one humidity point per ten
// lost indoors. Whole steps stop short of reversing the gradient.
const guKind = 'draft-wing';
const volumeRatio = 10;
const interval = 5;
const ability = {fuel: 'primeval', cost: 2, effect: {kind: 'air.exchanged', magnitude: 2}};
const supply = {family: 'primeval', pool: energy, rank: 1, source: 'aperture'};

/** A fitted vent connects the workshop to a specific outside air volume. */
export function createGuBrewRegulatorPack({room, outside, vent}) {
    return {
        id: GU_BREW_REGULATOR, revision: 0,
        quantities: [Q.humidity, Q.energy, Q.day],
        properties: [P.alive, ventOpen],
        reads: [humidity, Q.day.id, P.alive.id, ventOpen.id],
        writes: [energy, humidity],
        publishes: [ability.effect.kind],
        laws: [{
            id: 'exchange',
            appliesTo: h => h.kind === 'body' && h.as.includes('gu'),
            horizon: (view, id) => view.placeOf(id) === room ? interval - view.clock % interval : Infinity,
            decide: (view, id) => {
                const alive = view.property(id, P.alive.id);
                if (view.clock % interval !== 0 || view.placeOf(id) !== room || !alive) return [];
                if (room === outside || view.holder(vent)?.kind !== 'thing' || view.placeOf(vent) !== room ||
                    !view.property(vent, ventOpen.id) || view.holder(outside)?.kind !== 'place' ||
                    !view.has(room, humidity) || !view.has(outside, humidity) || !view.has(room, Q.day.id)) return [];

                const gu = view.state(id)?.specimen;
                if (gu?.id !== id || gu.kind !== guKind || gu.rank !== 1 || !Number.isSafeInteger(gu.fedThrough)) return [];
                const operator = gu.holder;
                if (view.holder(operator)?.kind !== 'body' || view.placeOf(operator) !== room ||
                    !view.property(operator, P.alive.id) || !view.has(operator, energy)) return [];

                const gradient = view.amount(room, humidity) - view.amount(outside, humidity);
                const capacity = Math.floor(gradient / (volumeRatio + 1));
                if (capacity < 1) return [];

                const reserve = view.amount(operator, energy);
                const result = resolveGuActivation({stages: [{gu: {...gu, alive}, operator, ability, supply}],
                    reserves: {[operator]: {[energy]: reserve}}, day: view.amount(room, Q.day.id)});
                if (result.outcome !== 'complete') return [];

                const [effect] = result.effects;
                const exchanged = Math.min(capacity, effect.magnitude);
                return [
                    {op: 'set', holder: operator, quantity: energy, amount: result.remaining[operator][energy]},
                    {op: 'publish', kind: effect.kind, place: room, quantity: humidity, amount: -exchanged * volumeRatio},
                    {op: 'publish', kind: effect.kind, place: outside, quantity: humidity, amount: exchanged},
                ];
            },
        }],
    };
}
