// Place-authored drainage for the shared water.poured payload (SB2, SB3).
import {check, natural, object} from '../basics.js';
import {WORLD_EFFECT_KINDS as K, WORLD_QUANTITIES as Q} from '../world_quantities.js';

const placeId = id => typeof id === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(id);
const encodedPrefix = 'encoded.';

export function residueQuantity(substance) {
    check(typeof substance === 'string' && substance.length, 'Residue flow needs a substance id.');
    if (/^[a-z0-9][a-z0-9_.-]*$/i.test(substance) && !substance.startsWith(encodedPrefix)) {
        return `${Q.residue.id}:${substance}`;
    }
    // W keys cannot contain a second colon (e.g. in a material's :matrix).
    // Reserve a prefix and encode the original code units so keys never merge.
    const encoded = substance.split('').map(char => char.charCodeAt(0).toString(16).padStart(4, '0')).join('');
    return `${Q.residue.id}:${encodedPrefix}${encoded}`;
}

// E10: a drain is a one-way open link of `linkKinds` (default water) out of the place, read from the
// world's links. `drains` is the older pack-level list, read as such links through the same reader.
// With several ways out, the water takes the cheapest, then the lowest link id.
export function createResidueFlowPack({drains = [], linkKinds = ['water']} = {}) {
    const routes = new Map(), own = [];
    for (const {from, to, reason} of drains) {
        check(placeId(from) && placeId(to) && typeof reason === 'string' && reason.trim(),
            'Residue flow needs source and destination places and a reason.');
        check(!routes.has(from), `Residue flow has more than one drain from ${from}.`);
        routes.set(from, to);
        own.push({id: `own.${own.length}`, kind: linkKinds[0], from, to, oneWay: true, note: reason});
    }
    const drainFrom = (view, source) => view.exits(source, {kinds: linkKinds, also: own})
        .sort((a, b) => a.cost - b.cost)[0]?.to ?? null;

    return {
        id: 'w.residue_flow', revision: 0,
        quantities: [Q.residue], writes: [Q.residue.id], hears: [K.water_poured.id],
        reactors: [{
            id: 'drain', on: [K.water_poured.id],
            appliesTo: holder => holder.kind === 'place',
            react(view, source, effect) {
                const contents = effect.detail?.contents;
                if (contents == null) return [];
                const destination = drainFrom(view, source);
                if (destination == null) return [];
                check(object(contents) && effect.quantity == null, 'Residue flow needs a pour with a contents map.');
                check(view.holder(destination)?.kind === 'place', `Residue drain from ${source} needs a place at ${destination}.`);

                const ops = [];
                for (const [substance, amount] of Object.entries(contents)) {
                    check(natural(amount), `Residue flow needs a whole nonnegative amount of ${substance}.`);
                    if (!amount) continue;
                    const quantity = residueQuantity(substance);
                    check(view.has(destination, quantity), `Residue drain to ${destination} has no receiver for ${quantity}.`);
                    check(amount <= Q.residue.max - view.amount(destination, quantity),
                        `Residue drain to ${destination} has insufficient capacity for ${quantity}.`);
                    ops.push({op: 'add', holder: destination, quantity, amount});
                    // The add commits immediately in this reactor. The child
                    // effect reports it without applying the quantity twice.
                    ops.push({op: 'publish', kind: 'effect.add', place: destination,
                        detail: {target: destination, object: quantity, amount, substance}});
                }
                return ops;
            },
        }],
    };
}
