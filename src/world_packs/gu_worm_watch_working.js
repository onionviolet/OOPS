// PC95. The wild agency pack chooses where the Worm goes. This working uses
// ordinary sensing to turn a witnessed visit into a local search lead.
import {defineWorkingLaw} from '../kernel_working.js';

const roles = {observer: 'operator', site: 'place'};
const sighting = 'gu_worm_sighting';
const operations = {
    watch: {roles, minutes: 1, settle({bound: {observer, site}}) {
        if (!observer.holder || observer.place !== site.holder || !observer.properties.senses?.includes('sight')) {
            return {ok: false, reason: 'The observer cannot watch this site.'};
        }
        // The observer binds a site. The sensing owner resolves what is
        // actually there and visible when the watch settles.
        return {ok: true, effects: [{
            sentence: {verb: 'sense', object: 'information', target: 'bound', time: 'instant',
                carrier: 'body', cost: 'none', limits: []},
            details: {target: {shape: 'having', place: site.holder, property: 'gu_kind', value: 'liquor-worm'}, channel: 'sight',
                place: site.holder, presence: true, by: observer.holder},
        }]};
    }},
    search: {roles, minutes: 1, settle({bound: {observer, site}}) {
        if (observer.place !== site.holder || observer.properties[sighting] !== site.holder) {
            return {ok: false, reason: 'This observer has no Worm sighting here.'};
        }
        if (!(site.quantities?.['stock:searchable-traces'] > 0)) {
            return {ok: false, reason: 'The trail has already been examined.'};
        }
        return {ok: true, effects: [
            {op: 'add', holder: site.holder, quantity: 'stock:searchable-traces', amount: -1},
            {op: 'property', holder: observer.holder, property: sighting, value: null},
            {op: 'publish', kind: 'gu.worm-trail-examined', place: site.holder, by: observer.holder},
        ]};
    }},
};
export const GU_WORM_WATCH_LAW = defineWorkingLaw({id: 'gu.worm-watch', revision: 1, operations});
export function guWormWatchWorking(operation) {
    if (!Object.hasOwn(operations, operation)) throw Error('Unknown Worm watch action.');
    const {roles} = operations[operation];
    return {id: 'gu.worm-watch.' + operation, revision: 1, law: GU_WORM_WATCH_LAW.ref, roles,
        steps: [{op: operation, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]};
}

export const guWormWatchPack = {
    id: 'g.worm-watch', revision: 1,
    properties: [{id: sighting, type: 'label'}],
    reads: ['gu_kind', 'alive'], writes: [sighting],
    hears: ['effect.sense.information'], publishes: ['gu.worm-trail-examined'],
    reactors: [{
        id: 'witnessed-worm', on: ['effect.sense.information'],
        appliesTo: holder => holder.as.includes('operator'),
        react(view, id, event) {
            const {target, channel, presence} = event.detail ?? {};
            if (id !== event.by || !presence || channel !== 'sight' ||
                view.property(target, 'gu_kind') !== 'liquor-worm' || view.property(target, 'alive') !== true) return [];
            return [{op: 'property', holder: id, property: sighting, value: event.place}];
        },
    }],
};
