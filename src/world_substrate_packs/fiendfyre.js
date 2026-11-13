const kind = 'fiendfyre-front';
const ownFront = (view, place) => view.lawFields(place, kind).find(field => field.scope === place);
const fuel = (view, place) => view.present(place).filter(id =>
    view.property(id, 'flammable') === true && view.amount(id, 'condition') > 0);

// A front crosses one fuel contact per minute. Ordinary paths are separate
// edges used by travellers, including paths whose supports the fire destroys.
export const FIENDFYRE_PACK = {
    id: 'hp.fiendfyre', revision: 1, reads: ['flammable'], writes: ['condition', 'vitality'],
    laws: [{
        id: 'front',
        appliesTo: holder => holder.kind === 'place' && holder.as.includes('fiendfyre-site'),
        horizon: (view, place) => ownFront(view, place) ? 1 : Infinity,
        decide(view, place) {
            const front = ownFront(view, place);
            if (!front || (front.params.ignitedAt ?? -1) >= view.clock) return [];
            const burning = fuel(view, place);
            if (!burning.length) return [{op: 'law_remove', id: front.id}];
            const ops = [];
            const crossings = target => view.links().filter(link =>
                link.kind === 'wooden-crossing' && link.to === target && link.state !== 'closed')
                .map(link => ({op: 'link_set', id: link.id, state: 'closed'}));
            for (const target of view.neighbours(place, {kinds: ['fuel-contact']})) {
                if (!view.holder(target)?.as.includes('fiendfyre-site') || ownFront(view, target) || !fuel(view, target).length) continue;
                ops.push({op: 'law_add', field: {id: `fiendfyre:${target}`, scope: target, kind,
                    source: front.source, params: {ignitedAt: view.clock}}});
                ops.push(...crossings(target));
            }
            for (const id of burning)
                ops.push({op: 'add', holder: id, quantity: 'condition', amount: -1});
            for (const id of view.present(place))
                if (view.holder(id).kind === 'body' && view.amount(id, 'vitality') > 0)
                    ops.push({op: 'add', holder: id, quantity: 'vitality', amount: -1});
            ops.push(...crossings(place));
            return ops;
        },
    }],
};
