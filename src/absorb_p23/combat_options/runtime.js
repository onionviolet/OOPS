// Original proposal. Proto23 tactical choices are inspiration only.
export const TACTICS = Object.freeze({
    throw: Object.freeze({itemId: 'P23 throwing stone', power: 5}),
    smoke: Object.freeze({itemId: 'P23 smoke pellet'}),
    lure: Object.freeze({itemId: 'P23 scent pouch'}),
});
const check = (ok, message) => { if (!ok) throw new Error(message); };
const natural = n => Number.isSafeInteger(n) && n >= 0;

export function validateCombatOptions(state) {
    if (state === undefined) return; // Old saves have no optional family.
    check(state && Object.keys(state).sort().join(',') === 'breakRequested,lastEvent,phase,schema,selected', 'Invalid combat options fields.');
    check(state.schema === 1, 'Unsupported combat options schema.');
    check(state.selected === null || Object.hasOwn(TACTICS, state.selected), 'Invalid selected tactic.');
    check(typeof state.breakRequested === 'boolean' && natural(state.lastEvent), 'Invalid combat options cursor.');
    check(['active', 'exchange-break', 'encounter-break', 'escaped'].includes(state.phase), 'Invalid combat options phase.');
    check(state.phase === 'active' || !state.breakRequested, 'Invalid paused break request.');
}

/** Host owns custody, played clock, save lock and authored opportunity publication.
 * consumeItem must atomically remove one usable player-owned item or return false.
 * preflight and transition callbacks are synchronous and must not throw after payment.
 * Event numbers come from the host's saved monotonically increasing real-event cursor.
 */
export function createCombatOptions({state, host}) {
    validateCombatOptions(state);
    for (const key of ['preflight', 'consumeItem', 'escape', 'offerEncounter']) {
        check(typeof host?.[key] === 'function', `Missing combat options host: ${key}`);
    }
    let current = state ? structuredClone(state) : {schema: 1, selected: null, breakRequested: false, lastEvent: 0, phase: 'active'};
    const snapshot = () => structuredClone(current);
    const event = id => { check(natural(id) && id > 0, 'Invalid real combat event.'); return id > current.lastEvent; };
    function pay(tactic, eventId, context) {
        if (!event(eventId)) return false;
        const request = {tactic, eventId, itemId: TACTICS[tactic].itemId, count: 1, context};
        if (host.preflight(request) !== true || host.consumeItem(request) !== true) return false;
        current.lastEvent = eventId;
        current.selected = null;
        return true;
    }
    return {
        snapshot,
        restore(state) { validateCombatOptions(state); check(state !== undefined, 'Missing combat options checkpoint.'); current=structuredClone(state); },
        select(tactic) {
            check(tactic === null || Object.hasOwn(TACTICS, tactic), 'Unknown tactic.');
            current.selected = tactic;
        },
        requestBreak(value = true) { check(typeof value === 'boolean', 'Invalid break request.'); if (current.phase === 'active') current.breakRequested = value; },
        beforeExchange(eventId, context) {
            if (current.phase !== 'active') return {kind: 'paused'};
            if (!event(eventId)) return {kind: 'duplicate'};
            const tactic = current.selected;
            if (tactic !== 'throw' && tactic !== 'smoke') return {kind: 'attack'};
            if (!pay(tactic, eventId, context)) return {kind: 'attack', blocked: tactic};
            if (tactic === 'throw') return {kind: 'throw', power: TACTICS.throw.power};
            current.phase = 'escaped'; current.breakRequested = false;
            host.escape({eventId, context, awardKill: false});
            return {kind: 'escaped'};
        },
        lure(eventId, context) {
            if (current.phase !== 'active' || !pay('lure', eventId, context)) return false;
            // Opportunity only. No enemies, kills, clear progress, XP or loot are created here.
            host.offerEncounter({eventId, context});
            return true;
        },
        trainThrow(eventId, context) {
            check(typeof host.trainThrow === 'function', 'Missing native throwing training host.');
            if (current.phase !== 'active' || !pay('throw', eventId, {...context, training: true})) return false;
            host.trainThrow({eventId, xp: 1, context});
            return true;
        },
        afterExchange({victory}) {
            if (current.phase !== 'active' || !current.breakRequested) return false;
            current.breakRequested = false;
            current.phase = victory ? 'encounter-break' : 'exchange-break';
            return true;
        },
        resume() {
            const phase = current.phase;
            if (phase === 'escaped' || phase === 'active') return null;
            current.phase = 'active';
            return phase;
        },
    };
}

// Narrow P16 input: host validates the authored profile before constructing Combat.
export function validateEncounterCombatProfile(profile) {
    if (profile === undefined) return;
    check(profile && Object.keys(profile).sort().join(',') === 'dropChanceModifier,id', 'Invalid encounter combat profile.');
    check(typeof profile.id === 'string' && /^[a-zA-Z0-9_.-]{1,80}$/.test(profile.id), 'Invalid encounter profile id.');
    check(Number.isFinite(profile.dropChanceModifier) && profile.dropChanceModifier >= 0 && profile.dropChanceModifier <= 100, 'Invalid encounter drop modifier.');
}
