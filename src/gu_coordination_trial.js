import {resolveThreeHeadsSixArms} from './gu_coordination.js';
import {applyEnergyEffect} from './energy_resources.js';

export const coordinationId = 'book.ri.coordination';
export const coordinationWorld = `${coordinationId}.world`;
export const coordinationHall = `${coordinationId}.hall`;
export const coordinationEnergy = `${coordinationId}.primeval`;
export const coordinationActors = [
    {id: 'player', label: 'Liu Wen Wu', initial: 13},
    {id: `${coordinationId}.ouyang`, label: 'Ouyang Bi Sang', initial: 12},
    {id: `${coordinationId}.mo`, label: 'Mo Shi Kuang', initial: 11},
];
const ranks = [3, 3, 4, 4, 5, 5];
const cue = `${coordinationId}.cue`;
const formed = `${coordinationId}.formed_until`;
const status = `${coordinationId}.result`;
const supply = {pool: 'primeval', family: 'primeval', rank: 5, source: 'aperture'};

export function isCoordinationEffect(effect) {
    return effect.type === 'guCoordinate' && effect.actor === 'player' &&
        Object.keys(effect).every(key => ['type', 'actor'].includes(key));
}

export function guCoordinationFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== coordinationWorld) return {};
    const facts = state.actors.player.facts;
    return {
        [`${coordinationId}.formed`]: (facts[formed] ?? 0) > state.clock,
        [`${coordinationId}.team_present`]: coordinationActors.every(({id}) => {
            const person = state.simulation.people[id];
            return person?.life === 'alive' && person.location === coordinationHall && person.body?.controllerId === id;
        }),
    };
}

export function applyCoordinationEffect(state, effect, context, registry, cause) {
    const actor = state.actors.player;
    const availability = guCoordinationFacts(state, context.actorId);
    if (!isCoordinationEffect(effect) || !availability[`${coordinationId}.team_present`] || !actor.facts[cue] ||
        availability[`${coordinationId}.formed`]) throw Error('Gather the three operators and mark the cue first.');
    const reserves = Object.fromEntries(coordinationActors.map(({id}) =>
        [id, {primeval: state.simulation.energies[id][coordinationEnergy].reserve}]));
    const stages = coordinationActors.flatMap(({id}) => ranks.map((rank, index) => ({
        operator: id, gu: {id: `${id}:gu-${index + 1}`, kind: 'formation-gu', rank, fedThrough: state.clock},
        ability: {fuel: 'primeval', cost: 2}, supply,
    })));
    const result = resolveThreeHeadsSixArms({stages, reserves, day: state.clock});
    for (const {id} of coordinationActors) {
        const spent = reserves[id].primeval - result.remaining[id].primeval;
        if (spent) applyEnergyEffect(state, id, {energyId: coordinationEnergy, operation: 'use', output: spent, control: 1}, registry);
    }
    actor.facts[cue] = false;
    const merged = result.effects.find(effect => effect.kind === 'merged-body');
    if (merged) actor.facts[formed] = state.clock + 10;
    const summary = merged ? 'The three operators merge into one form with three heads and six arms.' :
        'The Gu missed the shared beat. The form did not merge, and the synchronized draw spent nothing.';
    const remaining = coordinationActors.map(({id, label}) => `${label} ${result.remaining[id].primeval}`).join(' · ');
    state.simulation.knowledge.player[status] = {stage: 'understood', at: state.clock, cause,
        value: `${summary} Reserves after the attempt · ${remaining}.`};
}
