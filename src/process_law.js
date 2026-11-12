// Proposal (AD32, PFP3/PFP22, PC70): a piece carries intensive structure and scalars.
// The brew law carries extensive lots in buckets; both use kernel workings and receipts.
// Fixture caller: tests/process_law.test.js. Host adoption is a later integration.
import {check, object, natural} from './basics.js';
import {defineWorkingLaw} from './kernel_working.js';

const MAX_SLICES = 256;
const sum = values => Object.values(values).reduce((total, value) => total + value, 0);
const name = value => typeof value === 'string' && value.length > 0 &&
    !['__proto__', 'prototype', 'constructor'].includes(value);

function quantities(values, label, nonnegative = false) {
    check(object(values), `${label} needs a quantity map.`);
    for (const [key, value] of Object.entries(values)) {
        check(name(key) && Number.isFinite(value) && (!nonnegative || value >= 0), `Invalid ${label} quantity ${key}.`);
    }
}

function checkRows(rows) {
    check(Array.isArray(rows), 'An exposure needs rows.');
    const ids = new Set();
    for (const row of rows) {
        check(object(row) && name(row.id) && !ids.has(row.id), 'Each process row needs a distinct id.');
        ids.add(row.id);
        check(object(row.band) && Number.isFinite(row.band.min) && Number.isFinite(row.band.max) &&
            row.band.min < row.band.max, `Row ${row.id} needs an increasing finite band.`);
        check(Number.isFinite(row.tauMinutes) && row.tauMinutes > 0, `Row ${row.id} needs a positive tauMinutes.`);
        const transfer = name(row.from) && name(row.to) && row.from !== row.to && row.scalar === undefined;
        const drift = name(row.scalar) && Number.isFinite(row.toward) && row.from === undefined && row.to === undefined;
        check(transfer || drift, `Row ${row.id} needs a transfer or a scalar drift.`);
        check(typeof row.cause === 'string' && row.cause.length > 0, `Row ${row.id} needs a cause.`);
        check(row.driveBy === undefined || name(row.driveBy), `Row ${row.id} has an invalid drive property.`);
        if (row.needs !== undefined) {
            check(object(row.needs), `Row ${row.id} needs a requirement map.`);
            for (const [scope, values] of Object.entries(row.needs)) {
                check(['medium', 'shares', 'scalars'].includes(scope), `Row ${row.id} has an unknown need scope.`);
                quantities(values, `row ${row.id} needs`);
            }
        }
    }
}

export function processBalance(facts) {
    const piece = facts.piece;
    check(object(piece), 'No settled piece is present.');
    quantities(piece.shares, 'shares', true);
    const held = sum(piece.shares), starting = piece.startingTotal;
    check(Number.isFinite(starting) && starting >= 0 && Number.isFinite(held), 'Invalid piece total.');
    // Relative floating-point tolerance checks conservation across exponential transfers.
    return {starting, held, difference: held - starting,
        balanced: Math.abs(held - starting) <= 1e-10 * Math.max(1, starting)};
}

export function projectProcess(facts, projection) {
    check(object(projection) && object(facts.piece), 'Projection needs a piece and property rows.');
    const result = {};
    for (const [property, row] of Object.entries(projection)) {
        check(name(property) && object(row) && Number.isFinite(row.base ?? 0), 'Invalid projected property.');
        let value = row.base ?? 0;
        for (const scope of ['shares', 'scalars']) {
            quantities(row[scope] ?? {}, `projection ${scope}`);
            for (const [key, weight] of Object.entries(row[scope] ?? {})) value += (facts.piece[scope][key] ?? 0) * weight;
        }
        check(Number.isFinite(value), `Projection ${property} is outside the numeric range.`);
        result[property] = value;
    }
    return result;
}

function pieceState(facts, bound, start) {
    const piece = facts.piece ? structuredClone(facts.piece) : {
        id: bound.id, properties: structuredClone(bound.properties), temperature: bound.temperature,
        shares: structuredClone(bound.shares), scalars: structuredClone(bound.scalars ?? {}),
        clock: start, path: structuredClone(bound.path ?? []),
        startingTotal: bound.startingTotal ?? sum(bound.shares ?? {}),
    };
    check(piece.id === bound.id && Number.isFinite(piece.temperature) && natural(piece.clock) && piece.clock <= start &&
        Array.isArray(piece.path), 'Invalid piece identity, temperature, clock or path.');
    quantities(piece.scalars, 'scalars');
    check(processBalance({piece}).balanced, 'The piece structure does not balance.');
    return piece;
}

function unmetNeeds(row, medium, before) {
    const reasons = [];
    for (const [scope, needs] of Object.entries(row.needs ?? {})) {
        const values = scope === 'medium' ? medium.properties : before[scope];
        for (const [key, minimum] of Object.entries(needs)) {
            if ((values[key] ?? 0) < minimum) reasons.push(`${scope}.${key} below ${minimum}`);
        }
    }
    return reasons;
}

// Read all rows against the slice's starting state. Competing transfers share
// one depletion; simultaneous scalar drifts share a rate-weighted destination.
// `fresh` opens a new trace segment; later slices of one segment add to it.
function moveSegment(piece, medium, tool, rows, minutes, temperature, traces, fresh) {
    const before = {shares: {...piece.shares}, scalars: {...piece.scalars}};
    const groups = new Map();
    rows.forEach((row, index) => {
        if (temperature < row.band.min || temperature >= row.band.max) return;
        const trace = traces[index];
        trace.minutesInBand += minutes;
        const reasons = unmetNeeds(row, medium, before);
        const drive = row.driveBy ? tool?.properties?.[row.driveBy] ?? 0 : 1000;
        check(Number.isFinite(drive) && drive >= 0, `Row ${row.id} has invalid drive.`);
        if (!drive) reasons.push('no drive');
        const source = row.from ? before.shares[row.from] ?? 0 : before.scalars[row.scalar] ?? 0;
        if (row.from && source === 0) reasons.push(`nothing of ${row.from} present`);
        if (row.scalar && source === row.toward) reasons.push(`${row.scalar} already at target`);
        if (fresh) trace.segments.push({minutes: 0, moved: 0, reasons: []});
        const segment = trace.segments.at(-1);
        segment.minutes += minutes;
        for (const reason of reasons) if (!segment.reasons.includes(reason)) segment.reasons.push(reason);
        if (reasons.length) return;
        const rate = drive / 1000 / row.tauMinutes;
        check(Number.isFinite(rate), `Row ${row.id} has an unrepresentable rate.`);
        const key = row.from ? `share:${row.from}` : `scalar:${row.scalar}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({row, rate, trace, segment});
    });
    for (const group of groups.values()) {
        const totalRate = group.reduce((total, entry) => total + entry.rate, 0);
        check(Number.isFinite(totalRate) && totalRate > 0, 'Invalid combined process rate.');
        const fraction = -Math.expm1(-totalRate * minutes);
        const first = group[0].row;
        if (first.from) {
            const amount = before.shares[first.from] * fraction;
            piece.shares[first.from] -= amount;
            for (const {row, rate, trace, segment} of group) {
                const moved = amount * (rate / totalRate);
                piece.shares[row.to] = (piece.shares[row.to] ?? 0) + moved;
                trace.moved += moved;
                segment.moved += moved;
            }
        } else {
            let delta = 0;
            for (const {row, rate, trace, segment} of group) {
                const moved = (row.toward - (before.scalars[row.scalar] ?? 0)) * fraction * (rate / totalRate);
                delta += moved;
                trace.moved += moved;
                segment.moved += moved;
            }
            piece.scalars[first.scalar] = (before.scalars[first.scalar] ?? 0) + delta;
        }
    }
}

function expose({bound, facts, options, at}, working) {
    const {rows, minutes, projection = {}} = options;
    checkRows(rows);
    check(natural(minutes) && natural(at) && at >= minutes, 'An exposure needs whole elapsed minutes.');
    const piece = pieceState(facts, bound.piece, at - minutes);
    const medium = bound.medium, mass = bound.piece.properties?.thermalMass;
    const target = medium.properties?.temperature, exchange = medium.properties?.exchange;
    check(Number.isFinite(mass) && mass > 0 && Number.isFinite(target) && Number.isFinite(exchange) && exchange >= 0,
        'Exposure needs finite temperatures, positive thermalMass and nonnegative exchange.');
    const rate = exchange / mass, startTemperature = piece.temperature;
    check(Number.isFinite(rate), 'The thermal rate is outside the numeric range.');
    const temperatureAt = time => target + (startTemperature - target) * Math.exp(-rate * time);
    const boundaries = new Set([0, minutes]);
    if (rate > 0 && startTemperature !== target) {
        for (const row of rows) for (const edge of [row.band.min, row.band.max]) {
            const ratio = (edge - target) / (startTemperature - target);
            if (ratio > 0 && ratio < 1) {
                const crossing = -Math.log(ratio) / rate;
                if (crossing > 0 && crossing < minutes) boundaries.add(crossing);
            }
        }
    }
    const times = [...boundaries].sort((a, b) => a - b);
    const traces = rows.map(row => ({id: row.id, minutesInBand: 0, moved: 0, cause: row.cause, segments: []}));
    for (let index = 1; index < times.length; index += 1) {
        const start = times[index - 1], end = times[index], middle = temperatureAt(start + (end - start) / 2);
        // A chain (one row feeding the next) needs the later row to see what the
        // earlier one made, so a segment is cut into equal slices no longer than
        // its quickest active row's tau. Dial: MAX_SLICES bounds the work per segment.
        const quickest = Math.min(...rows.filter(row => middle >= row.band.min && middle < row.band.max).map(row => row.tauMinutes));
        const slices = Number.isFinite(quickest) ? Math.min(MAX_SLICES, Math.max(1, Math.ceil((end - start) / quickest))) : 1;
        for (let slice = 0; slice < slices; slice += 1) {
            moveSegment(piece, medium, working ? bound.tool : null, rows, (end - start) / slices, middle, traces, slice === 0);
        }
    }
    // A reason explains a row that stood still; a row that moved needs none.
    for (const trace of traces) for (const segment of trace.segments) if (segment.moved !== 0) segment.reasons = [];
    piece.temperature = temperatureAt(minutes);
    piece.clock = at;
    quantities(piece.scalars, 'scalars');
    check(Number.isFinite(piece.temperature) && processBalance({piece}).balanced, 'Exposure state does not balance.');
    const path = {op: working ? 'work' : 'hold', at, minutes, medium: medium.id,
        ...(working ? {tool: bound.tool.id} : {}), startTemperature, temperature: piece.temperature, rows: traces};
    piece.path.push(path);
    const nextFacts = {...facts, piece};
    // A landed property is a whole level, as the world substrate keeps them; the
    // pack's projection weights choose the unit. The facts keep the exact state.
    const effects = options.finish ? Object.entries(projectProcess(nextFacts, projection))
        .map(([property, value]) => ({op: 'property', holder: bound.piece.holder ?? bound.piece.id, property, value: Math.round(value)})) : [];
    return {ok: true, facts: nextFacts, effects,
        observed: {temperature: piece.temperature, rows: structuredClone(traces)},
        cause: 'Exposure time, contact and delivered work changed the piece.'};
}

export const PROCESS_LAW = defineWorkingLaw({id: 'f.process', revision: 1, operations: {
    hold: {roles: {piece: 'piece', medium: 'medium'}, settle: args => expose(args, false)},
    work: {roles: {piece: 'piece', medium: 'medium', tool: 'tool'}, settle: args => expose(args, true)},
}});

export function processMethod({id, revision = 1, steps, rows, projection = {}}) {
    checkRows(rows);
    check(Array.isArray(steps) && steps.length > 0, 'A process method needs exposure steps.');
    const roles = {piece: 'piece'};
    const methodSteps = steps.map((step, index) => {
        check(object(step) && ['hold', 'work'].includes(step.op) && name(step.medium), 'Invalid exposure step.');
        const bindings = {piece: 'piece', medium: step.medium};
        check(step.medium !== 'piece' && (!roles[step.medium] || roles[step.medium] === 'medium'), 'Conflicting medium role.');
        roles[step.medium] = 'medium';
        if (step.op === 'work') {
            check(name(step.tool) && (!roles[step.tool] || roles[step.tool] === 'tool'), 'Invalid tool role.');
            roles[step.tool] = 'tool';
            bindings.tool = step.tool;
        }
        const minutes = step.minutes ?? 0;
        check(natural(minutes), 'Exposure duration is a whole number of minutes.');
        const stepRows = step.options?.rows ?? rows;
        checkRows(stepRows);
        return {op: step.op, bindings, minutes, options: {...structuredClone(step.options ?? {}),
            minutes, rows: structuredClone(stepRows), projection: structuredClone(projection), finish: index === steps.length - 1}};
    });
    return {id, revision, law: PROCESS_LAW.ref, roles, steps: methodSteps};
}

/** Return a bound-piece snapshot so an interrupted working can be continued. */
export function unfinishedPiece(record) {
    check(object(record.facts?.piece), 'No settled piece to recover.');
    check(processBalance(record.facts).balanced, 'The recovered piece does not balance.');
    return {kind: 'piece', ...structuredClone(record.facts.piece)};
}
