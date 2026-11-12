// SB2-SB4: a crop takes a fraction of a committed soil deposit. A later
// grazing command spends forage and moves its trace material into tissue.
import {check, natural} from '../basics.js';
import {WORLD_QUANTITIES as Q} from '../world_quantities.js';

const GRAZE = 'living.graze';
const UPTAKE = 'living.crop_uptake';
const FED = 'living.grazed';
const HARM = 'living.harm';
const reasonGiven = reason => typeof reason === 'string' && reason.trim();
const positive = amount => natural(amount) && amount > 0;
const quantityIn = (id, family) => typeof id === 'string' &&
    /^[a-z][a-z0-9_.-]*:[a-z0-9][a-z0-9_.-]*$/i.test(id) && id.startsWith(family + ':');

export function grazeOp({place, crop, body, portions}) {
    return {op: 'publish', kind: GRAZE, place, by: body, detail: {crop, body, portions}};
}

// Authored model: each deposit supplies uptakePermille of its trace units.
// Each deposit's surviving trace is spread evenly across remaining forage.
// Whole-unit rounding stays in the crop until a later meal takes it.
const portionOf = (trace, eaten, stock) => Number(BigInt(trace) * BigInt(eaten) / BigInt(stock));
const add = (holder, quantity, amount, source) => ({op: 'add', holder, quantity, amount, source});
const publish = (kind, place, by, detail) => ({by, op: 'publish', kind, place, detail});
const lotsAt = (view, crop) => view.state(crop)?.lots ?? [];

export function createLivingResiduePack({plots}) {
    const fields = new Map();
    for (const {field, crop, forage, concentration, residues} of structuredClone(plots)) {
        check(typeof field === 'string' && field && typeof crop === 'string' && crop &&
            quantityIn(forage, Q.stock.id) && concentration === 'uniform-per-deposit',
            'Living residue needs a field, crop, forage account and uniform-per-deposit concentration.');
        check(!fields.has(field), `Living residue already has a crop plot in ${field}.`);
        const quantities = new Map();
        for (const {substance, quantity, uptakePermille, intakeReason, dose} of residues) {
            check(typeof substance === 'string' && substance && quantityIn(quantity, Q.residue.id) &&
                !quantities.has(quantity) && natural(uptakePermille) && uptakePermille <= 1000 && reasonGiven(intakeReason),
                'Living residue needs a distinct residue account, a whole uptake fraction per thousand and an intake reason.');
            check(dose == null || (positive(dose.threshold) && positive(dose.amount) &&
                typeof dose.kind === 'string' && dose.kind && reasonGiven(dose.reason)),
                'Living residue harm needs a dose threshold, amount, kind and reason.');
            quantities.set(quantity, {substance, uptakePermille, intakeReason, dose});
        }
        fields.set(field, {crop, forage, quantities});
    }

    const cropPresent = (view, place, crop) => view.holder(crop)?.kind === 'thing' && view.placeOf(crop) === place;
    const atPlot = holder => holder.kind === 'place' && fields.has(holder.id);
    return {
        id: 'l.living_residue', revision: 0,
        quantities: [Q.residue, Q.stock], writes: [Q.residue.id, Q.stock.id],
        hears: ['effect.add'], publishes: [GRAZE, UPTAKE, FED, HARM],
        reactors: [{
            id: 'uptake', on: ['effect.add'], appliesTo: atPlot,
            react(view, place, effect) {
                const {target, object, amount, substance} = effect.detail ?? {};
                // A drain receipt describes a completed deposit, not a
                // quantity-bearing publication or a generic effect primitive.
                if (target !== place || effect.quantity !== null || !positive(amount) ||
                    !positive(effect.cause) || effect.by === place || view.holder(effect.by)?.kind !== 'place') return [];
                const {crop, forage, quantities} = fields.get(place);
                const row = quantities.get(object);
                if (!row || row.substance !== substance || !cropPresent(view, place, crop) ||
                    !view.has(crop, forage) || !view.amount(crop, forage) ||
                    !view.has(place, object) || !view.has(crop, object)) return [];

                const taken = Math.min(portionOf(amount, row.uptakePermille, 1000),
                    view.amount(place, object), Q.residue.max - view.amount(crop, object));
                if (!taken) return [];
                const source = `l.living_residue:deposit:${effect.seq}`;
                const lot = {quantity: object, deposit: effect.seq, trace: taken};
                return [
                    add(place, object, -taken, source),
                    add(crop, object, taken, source),
                    {op: 'state', holder: crop, value: {lots: [...lotsAt(view, crop), lot]}},
                    publish(UPTAKE, place, crop, {crop, substance, amount: taken}),
                ];
            },
        }, {
            id: 'graze', on: [GRAZE], appliesTo: atPlot,
            react(view, place, effect) {
                const {crop, body, portions} = effect.detail ?? {};
                const plot = fields.get(place);
                const animal = view.holder(body);
                if (crop !== plot.crop || !positive(portions) || effect.by !== body ||
                    animal?.kind !== 'body' || !animal.tags.includes('living.body') || view.placeOf(body) !== place ||
                    !cropPresent(view, place, crop) || !view.has(crop, plot.forage)) return [];
                const stock = view.amount(crop, plot.forage);
                if (portions > stock) return [];

                const ops = [add(crop, plot.forage, -portions)];
                const remaining = [], totals = new Map(), transfers = [];
                const lots = lotsAt(view, crop);
                const carried = new Map();
                for (const {quantity, trace} of lots) {
                    carried.set(quantity, (carried.get(quantity) ?? 0) + trace);
                }
                for (const [quantity, trace] of carried) {
                    if (!plot.quantities.has(quantity) || !view.has(crop, quantity) || view.amount(crop, quantity) < trace) return [];
                }
                for (const lot of lots) {
                    const moved = portionOf(lot.trace, portions, stock);
                    if (moved < lot.trace) remaining.push({...lot, trace: lot.trace - moved});
                    if (!moved) continue;
                    const {quantity, deposit} = lot;
                    const total = (totals.get(quantity) ?? 0) + moved;
                    if (!view.has(body, quantity) || total > Q.residue.max - view.amount(body, quantity)) return [];
                    totals.set(quantity, total);
                    const source = `l.living_residue:graze:${effect.seq}:deposit:${deposit}`;
                    ops.push(add(crop, quantity, -moved, source), add(body, quantity, moved, source));
                    transfers.push({quantity, deposit, amount: moved, reason: plot.quantities.get(quantity).intakeReason});
                }
                ops.push({op: 'state', holder: crop, value: {lots: remaining}},
                    publish(FED, place, crop, {crop, target: body, portions, transfers}));
                for (const [quantity, {dose}] of plot.quantities) {
                    if (dose && (totals.get(quantity) ?? 0) >= dose.threshold) {
                        ops.push(publish(HARM, place, crop, {target: body, kind: dose.kind, amount: dose.amount, reason: dose.reason}));
                    }
                }
                return ops;
            },
        }],
    };
}
