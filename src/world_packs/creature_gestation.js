export const CREATURE_GESTATION_PACK = 'l.creature_gestation';
export const GESTATION_LEFT = 'gestation-left';
export const GESTATION_BROOD = 'gestation-brood';
export const GESTATION_QUANTITY = 'gestation-place-quantity';
export const GESTATION_MINIMUM = 'gestation-place-minimum';
export const INCUBATING_EGG = 'creature-incubating-egg';
export const EGG_TOLERANCE = 'egg-exposure-left';
export const EGG_EXPOSURE_LOSS = 'creature.egg-exposure';
export const EGG_IMPRINT_LEFT = 'egg-imprint-left';
export const EGG_IMPRINT = 'egg-imprint-condition';
export const EGG_IMPRINT_QUANTITY = 'egg-imprint-quantity';
export const EGG_IMPRINT_MINIMUM = 'egg-imprint-minimum';
export const EGG_IMPRINTS = 'egg-imprint';

// The host declares the place quantities its species can depend on. The
// individual brood keeps its own choice and threshold on the carrier.
export function createCreatureGestationPack(quantities) {
    function condition(view, id, quantity = GESTATION_QUANTITY, minimum = GESTATION_MINIMUM) {
        return {holder: view.placeOf(id), quantity: view.property(id, quantity),
            op: 'gte', value: view.property(id, minimum)};
    }
    function suitable(view, {holder, quantity, value}) {
        return view.has(holder, quantity) && view.amount(holder, quantity) >= value;
    }
    const egg = holder => holder.kind === 'thing' && holder.tags.includes(INCUBATING_EGG) && holder.properties[GESTATION_BROOD];
    return {
        id: CREATURE_GESTATION_PACK, revision: 1,
        quantities: [{id: GESTATION_LEFT, unit: 'gestation-minute', min: 0, max: Number.MAX_SAFE_INTEGER},
            {id: EGG_TOLERANCE, unit: 'exposure-minute', min: 0, max: Number.MAX_SAFE_INTEGER},
            {id: EGG_IMPRINTS, unit: 'exposure-minute', min: 0, max: Number.MAX_SAFE_INTEGER, keyed: true},
            {id: EGG_IMPRINT_LEFT, unit: 'exposure-minute', min: 0, max: Number.MAX_SAFE_INTEGER}, ...quantities],
        properties: [{id: GESTATION_BROOD, type: 'label'}, {id: GESTATION_QUANTITY, type: 'label'},
            {id: GESTATION_MINIMUM, type: 'level', min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER},
            {id: EGG_IMPRINT, type: 'label'}, {id: EGG_IMPRINT_QUANTITY, type: 'label'},
            {id: EGG_IMPRINT_MINIMUM, type: 'level', min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER}],
        reads: [GESTATION_QUANTITY, GESTATION_MINIMUM, EGG_IMPRINT_QUANTITY, EGG_IMPRINT_MINIMUM, ...quantities.map(q => q.id)],
        writes: [GESTATION_LEFT, EGG_TOLERANCE, EGG_IMPRINT_LEFT, EGG_IMPRINTS],
        lifecycle: {acts: ['end']},
        laws: [{
            id: 'develop',
            appliesTo: holder => (holder.kind === 'body' && holder.properties.alive !== false ||
                egg(holder)) &&
                holder.properties[GESTATION_BROOD] && holder.quantities[GESTATION_LEFT] > 0,
            watches: (view, id) => [condition(view, id)],
            rates(view, id) {
                return suitable(view, condition(view, id))
                    ? [{holder: id, quantity: GESTATION_LEFT, perMinute: -1}] : [];
            },
        }, {
            id: 'egg-imprint',
            appliesTo: holder => egg(holder) && holder.properties[EGG_IMPRINT] &&
                holder.quantities[GESTATION_LEFT] > 0 && holder.quantities[EGG_IMPRINT_LEFT] > 0,
            watches: (view, id) => [condition(view, id), condition(view, id, EGG_IMPRINT_QUANTITY, EGG_IMPRINT_MINIMUM)],
            rates(view, id) {
                return suitable(view, condition(view, id)) &&
                    suitable(view, condition(view, id, EGG_IMPRINT_QUANTITY, EGG_IMPRINT_MINIMUM))
                    ? [{holder: id, quantity: EGG_IMPRINT_LEFT, perMinute: -1}] : [];
            },
        }, {
            id: 'egg-imprints',
            appliesTo: holder => egg(holder) && holder.quantities[GESTATION_LEFT] > 0 &&
                Boolean(holder.state[CREATURE_GESTATION_PACK]?.imprints?.length),
            watches: (view, id) => [condition(view, id), ...view.state(id).imprints.map(({quantity, min}) =>
                ({holder: view.placeOf(id), quantity, op: 'gte', value: min}))],
            rates(view, id) {
                if (!suitable(view, condition(view, id))) return [];
                return view.state(id).imprints.flatMap(({condition: name, quantity, min}) => {
                    const account = `${EGG_IMPRINTS}:${name}`;
                    return view.amount(id, account) > 0 && suitable(view, {holder: view.placeOf(id), quantity, value: min})
                        ? [{holder: id, quantity: account, perMinute: -1}] : [];
                });
            },
        }, {
            id: 'egg-exposure',
            appliesTo: holder => egg(holder) && Object.hasOwn(holder.quantities, EGG_TOLERANCE),
            watches: (view, id) => [condition(view, id)],
            rates(view, id) {
                return view.amount(id, EGG_TOLERANCE) > 0 && !suitable(view, condition(view, id))
                    ? [{holder: id, quantity: EGG_TOLERANCE, perMinute: -1}] : [];
            },
            decide(view, id) {
                return view.amount(id, EGG_TOLERANCE) === 0
                    ? [{op: 'lifecycle', act: 'end', holder: id, to: [`row:${EGG_EXPOSURE_LOSS}`]}] : [];
            },
        }],
    };
}
