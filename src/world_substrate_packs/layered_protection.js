// Contact settlement for the headless world. Delivery has already selected
// the target. Layers are ordered outermost first by the equipment owner.
import {resolveGuDefense} from '../gu_defense.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const LAYERED_PROTECTION_PACK = 'c.layered_protection';
export const PROTECTION_IMPACT = 'protection.impact';
const RESULT = 'protection.resolved';
const CAPACITY = 'protection-capacity';
const RATING = 'protection-rating';
const RESISTANCE = 'innate-resistance';
const quantity = (id, keyed = false) => ({id, keyed, unit: 'impact point', min: 0});
const whole = amount => Number.isSafeInteger(amount) && amount >= 0;

export function createLayeredProtectionPack() {
    return {
        id: LAYERED_PROTECTION_PACK, revision: 0,
        quantities: [WORLD_QUANTITIES.vitality, quantity(CAPACITY), quantity(RATING, true), quantity(RESISTANCE, true)],
        properties: [{id: 'protectionLayers', type: 'set'}, {id: 'protectionOrder', type: 'level'}],
        reads: ['protectionLayers', 'protectionOrder', RATING, RESISTANCE],
        writes: [CAPACITY, 'vitality'],
        hears: [PROTECTION_IMPACT], publishes: [RESULT, 'living.harm'],
        laws: [],
        reactors: [{
            id: 'contact', on: [PROTECTION_IMPACT], appliesTo: holder => holder.kind === 'body',
            react(view, id, event) {
                const {target, type, amount} = event.detail ?? {};
                if (target !== id || !view.has(id, 'vitality')) return [];
                if (!whole(amount)) throw new Error('Protection impact needs a whole amount.');
                const rating = `${RATING}:${type}`;
                const layers = [];
                const worn = (view.property(id, 'protectionLayers') ?? []).sort((a, b) =>
                    (view.property(a, 'protectionOrder') ?? 0) - (view.property(b, 'protectionOrder') ?? 0));
                for (const layer of worn) {
                    if (view.placeOf(layer) !== event.place || !view.has(layer, CAPACITY) || !view.has(layer, rating)) continue;
                    const capacity = Math.min(view.amount(layer, CAPACITY), view.amount(layer, rating));
                    if (capacity > 0) layers.push({id: layer, type, capacity});
                }
                const {remainder: [hit], layers: resolved} = resolveGuDefense([{type, amount}], layers);
                const innate = `${RESISTANCE}:${type}`;
                const resisted = view.has(id, innate) ? Math.min(hit.amount, view.amount(id, innate)) : 0;
                const damage = Math.min(hit.amount - resisted, view.amount(id, 'vitality'));
                const absorbed = resolved.filter(layer => layer.absorbed > 0).map(({id: layer, absorbed}) => ({
                    id: layer, absorbed, remaining: view.amount(layer, CAPACITY) - absorbed,
                }));
                return [
                    ...absorbed.map(layer => ({op: 'add', holder: layer.id, quantity: CAPACITY, amount: -layer.absorbed})),
                    ...(damage ? [
                        {op: 'add', holder: id, quantity: 'vitality', amount: -damage},
                        {op: 'publish', kind: 'living.harm', place: event.place, by: event.by, detail: {target, kind: type, amount: damage}},
                    ] : []),
                    {op: 'publish', kind: RESULT, place: event.place, by: event.by,
                        detail: {target, type, amount, layers: absorbed, resisted, damage}},
                ];
            },
        }],
    };
}
