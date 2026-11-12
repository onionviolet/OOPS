// Test-only packs for the emergence harness's own positive controls. They are
// not domain law and never ship: they exist so the harness is shown to flag a
// damped cascade, a repeat on one path and a runaway count, which the real
// contact case (CC1) does not produce at default dials.
import {composeSubstrate, createWorld} from '../../../src/world_substrate.js';

const DAY = 1440;

// x.ping answers pong with ping and y.pong answers ping with pong: an echo
// that only the cascade dial stops. A daily bell starts one echo each morning.
const pingPack = {
    id: 'x.ping', revision: 0, publishes: ['ping'],
    laws: [{id: 'bell', appliesTo: h => h.kind === 'place',
        horizon: view => DAY - (view.clock % DAY) || DAY,
        decide: (view, id) => view.clock % DAY === 0 && view.clock > 0 ? [{op: 'publish', kind: 'ping', place: id}] : []}],
    reactors: [{id: 'echo', on: ['pong'], appliesTo: h => h.kind === 'body' && h.tags.includes('pinger'),
        react: (view, id) => [{op: 'publish', kind: 'ping', place: view.placeOf(id)}]}],
};
const pongPack = {
    id: 'y.pong', revision: 0, publishes: ['pong'],
    reactors: [{id: 'echo', on: ['ping'], appliesTo: h => h.kind === 'body' && h.tags.includes('ponger'),
        react: (view, id) => [{op: 'publish', kind: 'pong', place: view.placeOf(id)}]}],
};

// z.swarm doubles its members each dawn and each member buzzes once: a count
// that grows day on day with nothing in the world to stop it.
const swarmPack = {
    id: 'z.swarm', revision: 0, publishes: ['buzz'],
    laws: [{id: 'grow', appliesTo: h => h.kind === 'thing' && h.tags.includes('swarm'),
        horizon: view => DAY - (view.clock % DAY) || DAY,
        decide: (view, id) => {
            if (view.clock % DAY !== 0 || view.clock === 0) return [];
            const s = view.state(id);
            return [{op: 'state', holder: id, value: {members: s.members * 2}},
                ...Array.from({length: s.members}, () => ({op: 'publish', kind: 'buzz', place: view.placeOf(id)}))];
        }}],
};

export const toyCase = ({cascadeDepth = 4, swarm = false} = {}) => ({
    id: swarm ? 'toy-swarm' : 'toy-echo', days: 4, known: [],
    build() {
        const rules = composeSubstrate({packs: swarm ? [swarmPack] : [pingPack, pongPack], dials: {cascadeDepth, chainCap: 1000}});
        const holders = swarm
            ? [{id: 'hive', kind: 'place'}, {id: 'swarm', kind: 'thing', place: 'hive', tags: ['swarm'], state: {'z.swarm': {members: 3}}}]
            : [{id: 'hall', kind: 'place'}, {id: 'a', kind: 'body', place: 'hall', tags: ['pinger']}, {id: 'b', kind: 'body', place: 'hall', tags: ['ponger']}];
        return {rules, world: createWorld(rules, {clock: 0, holders})};
    },
});
