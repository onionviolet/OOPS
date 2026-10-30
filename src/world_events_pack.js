// Versioned data seam into the world-neutral reader (AR3, AR5, AR10).
import {check, natural, object} from './basics.js';
import {buildEventBook} from './world_events.js';

// `leadId` is who is present for events marked witnessedByLead (the lead reaches the beat, so is there to see it).
export function loadEventPack(pack, {bindings = {}, leadId = null} = {}) {
    check(object(pack) && pack.schema === 1 && typeof pack.world === 'string' && pack.world.length > 0 && Array.isArray(pack.events), 'Invalid world event pack.');
    for (const event of pack.events) {
        check(object(event) && (event.lineKey === undefined || (typeof event.lineKey === 'string' && event.lineKey.length > 0)), 'Invalid world event lineKey.');
    }
    const events = leadId ? pack.events.map(e => e.witnessedByLead ? {...e, present: [...new Set([...(e.present ?? []), leadId])]} : e) : pack.events;
    return buildEventBook(events, {bindings});
}

// Each reached ordinal beat (a scene frame root, or a chapter beat in later volumes) gets its own day; reaching one supplies none for another.
export function frameBindings(pack, reachedBeats, baseDayFor) {
    loadEventPack(pack);
    const reached = new Set(reachedBeats), bindings = {};
    for (const event of pack.events) {
        if (event.placement !== 'ordinal' || !reached.has(event.ordinal.beat) || Object.hasOwn(bindings, event.ordinal.beat)) continue;
        const day = baseDayFor(event.ordinal.beat);
        check(natural(day), 'Invalid frame binding day.');
        Object.defineProperty(bindings, event.ordinal.beat, {value: day, enumerable: true, configurable: true, writable: true});
    }
    return bindings;
}
