// Row-driven sustained Gu payments. Native clocks and ledgers remain the save owners (KW10-KW13).
import {guCatalogue} from './gu_catalogue.js';
import {runGuActivations} from './gu_working_host.js';

export function sustainedGuHost(config) {
    const {id, world, key, interval, dose, core, support, supply, effectType} = config;
    const pins = record => record?.extensions?.some(pin => pin.id === id);
    const held = (state, binding) => state.actors.player.facts[binding.id] === true;
    const empty = () => ({reserve: 0, active: null, reason: null, spent: 0});
    function stages(supported, clock, coreHeld = true, supportHeld = true) {
        return [...(supported ? [support] : []), core].map(binding => ({
            gu: {id: binding.id, kind: binding.kind, rank: binding.rank,
                holder: (binding === core ? coreHeld : supportHeld) ? 'player' : config.custodian, fedThrough: clock},
            operator: 'player', ability: binding.ability ?? guCatalogue[binding.kind].ability.value, supply,
        }));
    }
    function pay(supported, clock, reserve, coreHeld = true, supportHeld = true) {
        if (!Number.isSafeInteger(clock) || clock < 0 || !Number.isSafeInteger(clock + interval)) {
            throw Error('Invalid maintenance clock.');
        }
        const bindings = stages(supported, clock, coreHeld, supportHeld);
        if (bindings.some(({gu}) => gu.holder !== 'player')) {
            return {outcome: 'interrupted', remaining: {player: {[supply.pool]: reserve}}, reason: 'Gu unavailable'};
        }
        return runGuActivations({stages: bindings, reserves: {player: {[supply.pool]: reserve}}, day: clock});
    }
    const quote = supported => dose - pay(supported, 0, dose).remaining.player[supply.pool];
    function read(state) {
        const raw = state.worlds[world]?.facts?.[key];
        if (raw === undefined) return null;
        if (typeof raw !== 'string' || raw.length > config.maxRecordLength) throw Error('Invalid sustained Gu record.');
        const row = JSON.parse(raw);
        if (!Number.isSafeInteger(row.reserve) || row.reserve < 0 || !Number.isSafeInteger(row.spent) || row.spent < 0 ||
            ![null, 'stopped', 'Gu unavailable', 'needs more essence'].includes(row.reason) ||
            (row.active !== null && (!row.active || typeof row.active.supported !== 'boolean' || row.reason !== null ||
                !Number.isSafeInteger(row.active.due) || row.active.due < state.clock || row.active.due - state.clock > interval))) {
            throw Error('The sustained Gu clock and reserve disagree.');
        }
        return row;
    }
    function validate(state, record) {
        const row = read(state), completed = state.actors.player.completed;
        const bought = completed[`${id}.buy`] ?? 0;
        const starts = (completed[`${id}.start_solo`] ?? 0) + (completed[`${id}.start_supported`] ?? 0);
        if (!!row !== (bought > 0) || (row && (!pins(record) || row.reserve + row.spent !== bought * dose ||
            (starts > 0) !== (row.spent > 0) || (row.active && !held(state, core))))) {
            throw Error('The sustained Gu needs matching loan, fuel and movement receipts.');
        }
    }
    function facts(state, actor) {
        if (actor !== 'player' || state.actors.player?.worldId !== world) return {};
        const row = read(state) ?? empty();
        return {[`${id}.active`]: !!row.active, [`${id}.loaned`]: held(state, core),
            [`${id}.supported`]: held(state, support), [`${id}.reserve`]: row.reserve};
    }
    function view(state, record) {
        if (!pins(record)) return null;
        const row = read(state) ?? empty();
        return {...row, remaining: row.active ? row.active.due - state.clock : null};
    }
    const isEffect = effect => effect.type === effectType && effect.actor === 'player' &&
        ['buy', 'start_solo', 'start_supported', 'stop'].includes(effect.operation) &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
    function apply(state, effect, context) {
        if (!isEffect(effect) || context.actorId !== 'player' || !pins(context.structuredNative) ||
            state.actors.player?.worldId !== world) throw Error('Use the sustained Gu trial here.');
        const row = read(state) ?? empty(), {operation} = effect;
        if (operation === 'buy') {
            if (!Number.isSafeInteger(row.reserve + dose)) throw Error('The reserve is full.');
            row.reserve += dose;
        } else if (operation === 'stop') {
            if (!row.active) throw Error('No sustained Gu move is running.');
            row.active = null;
            row.reason = 'stopped';
        } else {
            const supported = operation === 'start_supported';
            if (row.active || !held(state, core) || supported && !held(state, support)) throw Error('The bound Gu are unavailable.');
            const result = pay(supported, state.clock, row.reserve);
            if (result.outcome !== 'complete') throw Error('There is not enough essence to start.');
            const remaining = result.remaining.player[supply.pool];
            row.spent += row.reserve - remaining;
            row.reserve = remaining;
            row.active = {supported, due: state.clock + interval};
            row.reason = null;
        }
        state.worlds[world].facts[key] = JSON.stringify(row);
    }
    const boundary = state => read(state)?.active?.due ?? Infinity;
    function advance(state) {
        const row = read(state);
        if (!row?.active || row.active.due !== state.clock) return 0;
        const {supported, due} = row.active;
        const result = pay(supported, due, row.reserve,
            held(state, core) && state.simulation.people.player.life === 'alive', held(state, support));
        const remaining = result.remaining.player[supply.pool];
        row.spent += row.reserve - remaining;
        row.reserve = remaining;
        row.active = result.outcome === 'complete' ? {supported, due: due + interval} : null;
        row.reason = result.reason ?? null;
        state.worlds[world].facts[key] = JSON.stringify(row);
        return 1;
    }
    return {quote, validate, facts, view, isEffect, apply, boundary, advance};
}
