// The contest owns readiness and outcomes. The Lantern pack owns its coat,
// charge and form. Contest ticks do not advance the surrounding world minutes.
import {abortContest, defaultChoice, flushContest, stepContest} from '../contest.js';
import {creatureForm, releaseCreatureForm} from '../creature_evolution.js';
import {applyEngineOps, startEngineWorking} from '../engine_world.js';
import {LANTERN_BATTLE_FORM, LANTERN_EVOLUTION} from './meadow_lantern_fleece.js';

const route = 'guard-fleece';
const ram = 'lantern-ram';
const owner = 'lantern-guard-bout';
export const LANTERN_CONTEST_PROPERTIES = [{id: owner, type: 'label'}];
const workingId = (record, entrant) => `lantern-guard:${record.id}:${entrant}`;

export function enterLanternContest(engine, record, entrant) {
    const id = workingId(record, entrant);
    const animal = record.entrants[entrant]?.body;
    const body = engine.world.holders[animal];
    if (record.result || record.steps || !body || body.place !== record.place || engine.records.workings[id])
        return engine;
    const {law, methods} = LANTERN_EVOLUTION;
    const started = startEngineWorking(engine, {law, method: methods[route], id, bindings: {animal: {kind: 'body', id: animal}}});
    if (!started.records.workings[id].record.receipts.some(row => row.ok && row.op === route)) return started;
    return applyEngineOps(started, [{op: 'property', holder: animal, property: owner, value: id}], id);
}

function choose(law, record, world, entrant) {
    const entry = record.entrants[entrant];
    if (!entry.moves.includes(ram) || guardActive(record, world, entrant, entry.body))
        return defaultChoice(law, record, world, entrant);
    const withoutRam = {...entry, moves: entry.moves.filter(move => move !== ram)};
    return defaultChoice(law, {...record, entrants: {...record.entrants, [entrant]: withoutRam}}, world, entrant);
}

function guardActive(record, world, entrant, bodyId) {
    const body = world.holders[bodyId];
    return body?.properties[owner] === workingId(record, entrant) &&
        creatureForm(body, world.clock) === LANTERN_BATTLE_FORM;
}

function profile(view, record, world) {
    if (!guardActive(record, world, view.id, view.body)) return view.profile;
    return {...view.profile, armor: (view.profile.armor ?? 0) + 3};
}

export function stepLanternContest(law, record, engine) {
    if (record.result) return {record, engine};
    const next = stepContest(law, record, engine.rules, engine.world, {choose, profile});
    if (!next.record.result) return {record: next.record, engine: {...engine, world: next.world}};
    return releaseBoutForms(engine, flushContest(law, next.record, engine.rules, next.world));
}

export function abortLanternContest(law, record, engine) {
    return releaseBoutForms(engine, abortContest(law, record, engine.rules, engine.world));
}

function releaseBoutForms(engine, next) {
    const effects = Object.entries(next.record.entrants).flatMap(([entrant, {body}]) => {
        const holder = next.world.holders[body];
        if (holder?.properties[owner] !== workingId(next.record, entrant)) return [];
        return [...releaseCreatureForm({...holder, holder: body}, next.world.clock, LANTERN_BATTLE_FORM),
            {op: 'property', holder: body, property: owner, value: null}];
    });
    const updated = next.world === engine.world ? engine : {...engine, world: next.world};
    return {record: next.record, engine: effects.length ? applyEngineOps(updated, effects, `contest:${next.record.id}:revert`) : updated};
}
