// Import-free, observer-safe composition for route rows already disclosed by
// their native owners. This module never searches destinations or makes quotes.
import {object as isRecord} from './basics.js';
const knownText = value => value?.known === true && typeof value.text === 'string' ? value.text : '';

/**
 * Compose the current represented destination and already-known route receipts.
 * `routes` must come from current native host presentations, not registries.
 * The caller supplies an exact fingerprint for the host's frozen quote inputs.
 */
export function projectKnownRoutes({ current, routes = [] } = {}) {
    if (!isRecord(current) || current.known !== true || current.recipientId !== 'player' ||
        typeof current.destinationId !== 'string' || !current.destinationId ||
        typeof current.destinationLabel !== 'string' || !current.destinationLabel) {
        return { visible: false, section: null };
    }

    const counts = new Map();
    for (const route of routes) if (isRecord(route) && typeof route.id === 'string') {
        counts.set(route.id, (counts.get(route.id) || 0) + 1);
    }
    const shown = [];
    for (const route of routes) {
        if (!isRecord(route) || route.known !== true || route.recipientId !== 'player' ||
            route.currentDestinationId !== current.destinationId ||
            !['onward', 'return'].includes(route.direction) ||
            typeof route.id !== 'string' || !route.id || counts.get(route.id) !== 1 ||
            typeof route.destinationLabel !== 'string' || !route.destinationLabel ||
            typeof route.label !== 'string' || !route.label ||
            typeof route.inputFingerprint !== 'string' || !route.inputFingerprint ||
            !isRecord(route.action) || !isRecord(route.action.command)) continue;

        // Keep the host's own availability, quote, costs, blockers and command.
        // Text is already disclosed by the host and is never inferred here.
        shown.push({
            id: route.id,
            direction: route.direction,
            destinationLabel: route.destinationLabel,
            label: route.label,
            description: knownText(route.description),
            costText: knownText(route.costText),
            blockerText: knownText(route.blockerText),
            commitmentText: knownText(route.commitmentText),
            eligible: route.action.eligible === true,
            reasons: Array.isArray(route.action.reasons) ? route.action.reasons.slice() : [],
            command: structuredClone(route.action.command),
            inputFingerprint: route.inputFingerprint
        });
    }

    const commitments = (Array.isArray(current.commitments) ? current.commitments : [])
        .filter(row => isRecord(row) && row.known === true && row.recipientId === 'player')
        .map(row => ({ id: row.id, text: knownText(row.text) }))
        .filter(row => typeof row.id === 'string' && row.text);

    return {
        visible: true,
        section: {
            id: 'known-routes',
            label: 'Known routes',
            current: current.destinationLabel,
            commitments,
            routes: shown
        }
    };
}

// Stable enough for a same-render stale check. The host fingerprint remains
// authoritative for connection revision, body/cargo, direction and exceptions.
export function sameKnownRouteQuote(left, right) {
    return !!left && !!right && left.id === right.id &&
        left.inputFingerprint === right.inputFingerprint &&
        JSON.stringify(left.command) === JSON.stringify(right.command);
}

// G40: traffic-built route speed. A path walked often is worn in; the gain is a default with a
// reason (the ground sets the ceiling), not a law. This is a pure rating over a traversal count.
// It is a projection input: native travel durations belong to their family owners and do not read
// it yet, so callers must show it as "worn in", never as a time already saved.
export const ROUTE_WEAR = Object.freeze({cap: 0.25, rate: 12,
    why: 'A path walked often is worn in; the ground, not the walker, sets how much quicker it gets (a quarter at most).'});
export const routeSpeedGain = (count, wear = ROUTE_WEAR) =>
    !(count > 0) ? 0 : Math.round(wear.cap * (1 - Math.exp(-count / wear.rate)) * 1000) / 1000;
export const routeMinutes = (minutes, count, wear = ROUTE_WEAR) => Math.max(1, Math.round(minutes * (1 - routeSpeedGain(count, wear))));
