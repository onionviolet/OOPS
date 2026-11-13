// The workshop records contact changes on the exact workpiece at the world minute.
import {applyEngineOps, startEngineWorking} from '../engine_world.js';
import {PROCESS_LAW, remainingProcess} from '../process_law.js';
import {substratePort} from '../world_substrate.js';

const exposureState = 'workshop.process_exposure';
const mediumChanged = 'workshop.medium-changed';

function recordContact(saved, contact) {
    const history = saved.history.at(-1)?.at === contact.at ? saved.history.slice(0, -1) : saved.history;
    return {...saved, history: [...history, contact]};
}

export const workshopExposurePack = {
    id: exposureState, revision: 1, reads: ['temperature', 'exchange'], publishes: [mediumChanged],
    hears: [mediumChanged], reactors: [{
        id: 'medium-contact', on: [mediumChanged], appliesTo: holder => holder.as.includes('piece'),
        react(view, id, event) {
            const saved = view.state(id), current = saved?.history.at(-1);
            if (!current || current.medium !== event.by || view.placeOf(event.by) !== view.placeOf(id)) return [];
            const properties = view.properties(event.by);
            return [{op: 'state', holder: id, value: recordContact(saved, {at: view.clock, medium: event.by, properties})}];
        },
    }],
};

export function changeWorkshopMedium(engine, {medium, temperature, exchange}) {
    const contact = substratePort(engine.world)({kind: 'medium', id: medium});
    if (!contact || !Number.isSafeInteger(temperature) || !Number.isSafeInteger(exchange) || exchange < 0)
        throw Error('Choose a measured medium and valid new conditions.');
    return applyEngineOps(engine, [
        {op: 'property', holder: contact.holder, property: 'temperature', value: temperature},
        {op: 'property', holder: contact.holder, property: 'exchange', value: exchange},
        {op: 'publish', kind: mediumChanged, place: contact.place, by: contact.holder},
    ], 'workshop:medium-change');
}

export function recordWorkshopMedium(engine, {working, medium}) {
    const record = engine.records.workings[working]?.record;
    if (record?.method.law !== PROCESS_LAW.ref || record.status === 'complete' || !record.facts.piece)
        throw Error('Choose a process with a settled workpiece.');
    const read = substratePort(engine.world);
    const piece = read({kind: 'piece', id: record.facts.piece.id});
    const contact = read({kind: 'medium', id: medium});
    if (!piece || !contact || piece.place !== contact.place ||
        !Number.isFinite(contact.properties.temperature) || !Number.isFinite(contact.properties.exchange) ||
        contact.properties.exchange < 0) throw Error('Bring the workpiece to a measured medium.');

    const at = engine.world.clock, clock = record.facts.piece.clock;
    const saved = engine.world.holders[piece.holder].state[exposureState];
    const history = saved?.working === working && saved.clock === clock ? saved.history : [];
    if (!history.length && at !== clock) throw Error('Record the first medium at the paid checkpoint.');
    const value = recordContact({working, clock, history}, {at, medium: contact.holder, properties: contact.properties});
    return applyEngineOps(engine, [{op: 'state', holder: piece.holder, pack: exposureState, value}], 'workshop:medium-contact');
}

export function resumeWorkshopProcess(engine, {working, rows}) {
    const record = engine.records.workings[working]?.record;
    if (record?.method.law !== PROCESS_LAW.ref || record.status !== 'interrupted')
        throw Error('Choose an interrupted process to resume.');
    const read = substratePort(engine.world);
    const piece = record.facts.piece && read({kind: 'piece', id: record.facts.piece.id});
    const saved = piece && engine.world.holders[piece.holder].state[exposureState];
    if (!saved || saved.working !== working || saved.clock !== record.facts.piece.clock)
        throw Error('The saved contact history must start at this process checkpoint.');
    const at = engine.world.clock;
    const segments = saved.history.map(({medium, properties, at: start}, index) =>
        ({medium, properties, until: saved.history[index + 1]?.at ?? at, start}))
        .filter(segment => segment.start < at);
    return startEngineWorking(engine, remainingProcess(record, {at, rows, segments}));
}
