// PC95, WSC8: the substrate host keeps active stored records and the fields
// they support on their target. A counter detaches that record and its output.
import {restoreStored, chargeAt} from '../stored_working.js';
import {WORLD_QUANTITIES as Q} from '../world_quantities.js';

export const WORKING_END_PACK = 'k.working_end';
export const END_WORKING = 'effect.end.working';

export function createWorkingEndPack() {
    return {
        id: WORKING_END_PACK, revision: 0, hears: [END_WORKING],
        quantities: [Q.noise], writes: [Q.noise.id],
        reactors: [{
            id: 'end', on: [END_WORKING], appliesTo: holder => !!holder.state[WORKING_END_PACK]?.active?.length,
            react(view, id, effect) {
                const {targets, working} = effect.detail?.application ?? {};
                if (!Array.isArray(targets) || targets.length !== 1 || targets[0] !== id ||
                    typeof working !== 'string' || !working) return [];
                const state = view.state(id);
                const entry = state.active.find(item => item.record.id === working);
                if (!entry) return [];
                const record = restoreStored(entry.record);
                if (record.mode !== 'held' || record.status !== 'armed' || record.carrier !== id ||
                    view.clock < record.stored.at) return [];

                const {field, output, landing} = entry;
                const owned = field && view.lawFields(id, field.kind).find(f =>
                    f.scope === id && f.id === field.id && f.source === field.source);
                const ops = [];
                if (owned) ops.push({op: 'law_remove', id: owned.id});
                // These accounts can include ambient contributions. Remove only
                // the contribution that this host actually assigned to the hold.
                if (output && output.quantity === Q.noise.id &&
                    Number.isSafeInteger(output.amount) && output.amount > 0 && view.has(id, output.quantity)) {
                    ops.push({op: 'add', holder: id, quantity: output.quantity, amount: -output.amount});
                }
                if (owned && landing && view.placeOf(id) === landing.from && view.holder(landing.to)?.kind === 'place') {
                    ops.push({op: 'move', holder: id, to: landing.to});
                }
                ops.push({op: 'state', holder: id, value: {
                    active: state.active.filter(item => item.record.id !== working),
                    ended: [...(state.ended ?? []), {id: working, by: effect.by, at: view.clock, remainingCharge: chargeAt(record, view.clock)}],
                }});
                return ops;
            },
        }],
    };
}
