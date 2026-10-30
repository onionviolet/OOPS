// Versioned data seam into the world-neutral reader (AR3, AR5, AR10).
import {check, natural, object} from './basics.js';
import {buildEventBook} from './world_events.js';

export function loadEventPack(pack, {bindings = {}} = {}) {
    check(object(pack) && pack.schema === 1 && typeof pack.world === 'string' && pack.world.length > 0 && Array.isArray(pack.events), 'Invalid world event pack.');
    for (const event of pack.events) {
        check(object(event) && (event.lineKey === undefined || (typeof event.lineKey === 'string' && event.lineKey.length > 0)), 'Invalid world event lineKey.');
    }
    return buildEventBook(pack.events, {bindings});
}

// Frames are independent: reaching one root supplies no date for another.
export function frameBindings(pack, reachedBeats, baseDayFor) {
    loadEventPack(pack);
    const reached = new Set(reachedBeats), bindings = {};
    for (const event of pack.events) {
        if (event.placement !== 'ordinal' || event.id !== `ev.${event.ordinal.beat}` || !reached.has(event.ordinal.beat)) continue;
        const day = baseDayFor(event.ordinal.beat);
        check(natural(day), 'Invalid frame binding day.');
        Object.defineProperty(bindings, event.ordinal.beat, {value: day, enumerable: true, configurable: true, writable: true});
    }
    return bindings;
}
