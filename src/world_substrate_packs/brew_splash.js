// Allocate a flask spill across exposed parts in the room. The rest goes to
// the existing runoff reader. The contact response is opt-in world data.
import {check, natural, positive} from '../basics.js';
import {BREW_SPLASH} from '../brew_law.js';
import {WORLD_EFFECT_KINDS as K, WORLD_QUANTITIES as Q} from '../world_quantities.js';
import {brewDoseQuantity} from '../engine_brew_stock.js';
import {residueQuantity} from './residue_flow.js';

const layers = 'temporary-form-layers';
const contact = 'brew.spill-contact';
export const BREW_SURFACE_CONTACT = 'brew.surface-contact';

export function createBrewSplashPack({uptakePermille, response, surfaceTransferPermille = 0, dryingPerMinute = 0}) {
    check(natural(uptakePermille) && uptakePermille <= 1000, 'Splash uptake needs a whole permille.');
    check(natural(surfaceTransferPermille) && surfaceTransferPermille <= 1000, 'Surface transfer needs a whole permille.');
    const {part, minimum, form, minutes, priority} = response;
    check(typeof part === 'string' && part.length && typeof form === 'string' && /^[a-z][a-z0-9_.:-]*$/.test(form) &&
        positive(minimum) && positive(minutes) && positive(priority), 'Invalid splash response.');
    const surface = surfaceTransferPermille > 0;
    check(natural(dryingPerMinute) && (!dryingPerMinute || surface), 'Drying needs a transferable surface coating and a whole rate.');
    const material = surface ? Q.residue : Q.stock;
    const quantityOf = surface ? residueQuantity : brewDoseQuantity;
    const wet = quantityOf(part);
    const dry = residueQuantity(`${part}:dry`);
    const exposed = holder => holder?.kind === 'body' && holder.tags.includes('splash-exposed') &&
        !holder.tags.includes('splash-covered');
    const deposit = (view, target, quantity, units) => {
        const held = view.has(target, quantity) ? view.amount(target, quantity) : null;
        const amount = Math.min(units, material.max - (held ?? 0));
        return amount ? {op: held === null ? 'carry' : 'add', holder: target, quantity, amount} : null;
    };
    const contactEffects = (view, place, by, target, contents) => {
        if (!Object.keys(contents).length) return [];
        const ops = [{op: 'publish', kind: contact, place, by, detail: {target, contents}}];
        if (Object.hasOwn(contents, part) && contents[part] >= minimum) {
            const until = view.clock + minutes;
            check(positive(until), 'Splash response exceeds the clock range.');
            ops.push({op: 'property', holder: target, property: layers,
                value: [...new Set([...(view.property(target, layers) ?? []), [form, priority, until].join('|')])]});
        }
        return ops;
    };
    const dryAccount = (view, target) => dryingPerMinute && !view.has(target, dry)
        ? [{op: 'carry', holder: target, quantity: dry, amount: 0}] : [];
    return {
        id: 'b.splash', revision: 0, quantities: [material], reads: [material.id, layers], writes: [material.id, layers],
        hears: [BREW_SPLASH, ...(surface ? [BREW_SURFACE_CONTACT] : [])], publishes: [contact, K.water_poured.id],
        laws: dryingPerMinute ? [{
            id: 'dry-coating',
            appliesTo: holder => holder.kind === 'body' && (holder.quantities[wet] ?? 0) > 0 && Object.hasOwn(holder.quantities, dry),
            horizon: () => Infinity,
            advance(view, id, elapsed) {
                const amount = Math.min(view.amount(id, wet), Q.residue.max - view.amount(id, dry), elapsed * dryingPerMinute);
                return amount ? [{op: 'add', holder: id, quantity: wet, amount: -amount},
                    {op: 'add', holder: id, quantity: dry, amount}] : [];
            },
        }] : [],
        reactors: [{id: 'allocate', on: [BREW_SPLASH], appliesTo: holder => holder.kind === 'place',
            react(view, place, event) {
                const targets = view.present(place).filter(id => exposed(view.holder(id)));
                const runoff = {...event.detail.contents};
                const ops = [];
                const share = Object.entries(runoff).map(([id, amount]) => [id,
                    Number(BigInt(amount) * BigInt(uptakePermille) / (1000n * BigInt(Math.max(1, targets.length))))]);
                for (const target of targets) {
                    const received = {};
                    for (const [id, units] of share) {
                        const added = deposit(view, target, quantityOf(id), units);
                        if (!added) continue;
                        received[id] = added.amount;
                        runoff[id] -= added.amount;
                        ops.push(added);
                    }
                    if (Object.hasOwn(received, part)) ops.push(...dryAccount(view, target));
                    ops.push(...contactEffects(view, place, event.by, target, received));
                }
                ops.push({op: 'publish', kind: K.water_poured.id, place, by: event.by, detail: {...event.detail, contents: runoff}});
                return ops;
            }}, ...(surface ? [{id: 'transfer', on: [BREW_SURFACE_CONTACT], appliesTo: holder => holder.kind === 'place',
            react(view, place, event) {
                const {from, target} = event.detail ?? {};
                if (from === target || !exposed(view.holder(target)) || view.holder(from)?.kind !== 'body' ||
                    view.placeOf(from) !== place || view.placeOf(target) !== place) return [];
                const quantity = quantityOf(part);
                if (!view.has(from, quantity)) return [];
                const units = Number(BigInt(view.amount(from, quantity)) * BigInt(surfaceTransferPermille) / 1000n);
                const added = deposit(view, target, quantity, units);
                if (!added) return [];
                return [{op: 'add', holder: from, quantity, amount: -added.amount}, added, ...dryAccount(view, target),
                    ...contactEffects(view, place, from, target, {[part]: added.amount})];
            }}] : [])],
    };
}
