// Developer authoring surface. Ports retain command, clock and persistence authority.
// Ordinary observation never calls snapshot/save or receives a full domain frame.
const copy = value => structuredClone(value);
function freeze(value) {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
}

export function semanticDelta(before, after, path = '') {
    if (JSON.stringify(before) === JSON.stringify(after)) return [];
    if (before && after && typeof before === 'object' && typeof after === 'object'
        && Array.isArray(before) === Array.isArray(after)) {
        return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(key =>
            semanticDelta(before[key], after[key], `${path}/${key}`));
    }
    return [{path, before: copy(before), after: copy(after)}];
}

/** Ports must supply observer-safe inspect/quote results, never authoritative frames.
 * Persistence is explicitly developer-only and returns raw save/file data on request.
 * This facade does not implement transactions, replay, a clock or a second state store.
 */
export function createScenarioFacade({identity, quote, execute, inspect, advance, persistence}) {
    for (const [name, fn] of Object.entries({quote, execute, inspect, advance, ...persistence}))
        if (typeof fn !== 'function') throw Error(`Scenario operation ${name} must be a function.`);
    const input = freeze(copy(identity));
    const read = async () => freeze(copy(await inspect()));
    async function act(kind, operation) {
        const before = await read();
        let result, error;
        try { result = await operation(); }
        catch (failure) { error = {name: failure.name, message: failure.message}; }
        const after = await read();
        return freeze({kind, status: error ? 'rejected' : 'applied', ...(error ? {error} : {result:copy(result)}),
            before, after, delta:semanticDelta(before, after)});
    }
    return Object.freeze({
        identity: () => input,
        inspect: read,
        quote: async command => freeze({command:copy(command), value:copy(await quote(copy(command)))}),
        execute: ticket => act('execute', () => execute(copy(ticket.command), copy(ticket.value))),
        advance: minutes => {
            if (!Number.isFinite(minutes) || minutes < 0) throw Error('Scenario minutes must be finite and nonnegative.');
            return act('advance', () => advance(minutes));
        },
        // Deliberately distinct from the ordinary inspection/causal receipt surface.
        persistence: Object.freeze(Object.fromEntries(['save', 'load', 'reload', 'exportFile', 'importFile'].map(name => {
            if (typeof persistence?.[name] !== 'function') throw Error(`Missing scenario persistence operation ${name}.`);
            return [name, async (...args) => copy(await persistence[name](...copy(args)))];
        }))),
    });
}

// The native domain projection includes internal notice accumulation. No notice
// counters, future reveal IDs or raw saves cross this ordinary inspection boundary.
export function knownLampProjection(projection, minute) {
    return {minute, lamp: {held:projection.held, lit:projection.lit, shining:projection.shining,
        oil:projection.oil, light: projection.light ? {ambient:projection.light.ambient,
            bonus:projection.light.bonus, light:projection.light.light} : null}};
}
