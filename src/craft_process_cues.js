// Live process knowledge/policy seam. ORIGINAL authored vocabulary, not canon kinetics.
// No clock, inventory, random draw or causal trace owner. Law adapters own matter.
const copy = value => JSON.parse(JSON.stringify(value));
const fail = message => { throw new Error(message); };
const nat = value => Number.isSafeInteger(value) && value >= 0;
const text = value => typeof value === 'string' && value.length > 0;
const CHANNELS = {
    smell: ['smell', ['faint', 'herbal', 'sharp', 'scorched']],
    color: ['sight', ['clear', 'pale', 'dark', 'amber']],
    bubbling: ['sight', ['still', 'gentle', 'vigorous']],
    texture: ['sight', ['smooth', 'cloudy', 'layered', 'grainy']],
    pressure: ['pressure', ['steady', 'rising', 'falling']],
    powerFlow: ['power', ['quiet', 'even', 'pulsing', 'disrupted']],
};

// A small ORIGINAL Frontier observation law over the released mechanism views.
// These thresholds are authored game impressions, not real brewing guidance.
// Pressure/power have no inferred producer: omit them until a physical law
// supplies a measured pressure or flow signal. An absent axis is not zero.
export function projectOriginalProcessCues({thermal, batch, pressure, powerFlow, means, reference}) {
    const readings = {};
    if(thermal && Number.isFinite(thermal.temperature) && Number.isFinite(thermal.degradationSeconds)
        && Number.isFinite(thermal.extractionSeconds)) {
        readings.smell = thermal.degradationSeconds > 0 ? 'scorched' : 'herbal';
        readings.color = thermal.degradationSeconds > 0 ? 'dark' : thermal.extractionSeconds >= 60 ? 'amber' : 'pale';
        readings.bubbling = thermal.temperature >= 80 ? 'vigorous' : thermal.temperature >= 50 ? 'gentle' : 'still';
    }
    if(Array.isArray(batch?.constituents)) {
        const suspended = batch.constituents.some(row => row.phase === 'suspended' && row.amount > 0);
        const settled = batch.constituents.some(row => row.phase === 'settled' && row.amount > 0);
        readings.texture = settled ? 'layered' : suspended ? 'cloudy' : 'smooth';
    }
    if(['steady', 'rising', 'falling'].includes(pressure)) readings.pressure = pressure;
    if(['quiet', 'even', 'pulsing', 'disrupted'].includes(powerFlow)) readings.powerFlow = powerFlow;
    return projectProcessCues({readings, means, reference});
}

// readings are impressions produced by the world's physical law, not its hidden causes.
// Unknown/absent readings mean unmeasured, not measured absence.
export function projectProcessCues({readings = {}, means = {}, reference = []} = {}) {
    const senses = new Set(means.senses ?? []);
    const instruments = new Set(means.instruments ?? []);
    return Object.entries(CHANNELS).flatMap(([id, [sense, words]]) => {
        const reading = readings[id];
        if(!words.includes(reading) || !(senses.has(sense) || instruments.has(sense))) return [];
        const prior = reference.find(cue => cue.id === id && words.includes(cue.impression));
        return [{id, impression: reading,
            confidence: (means.skills?.observation ?? 0) >= 10 ? 'practiced observation' : 'plain impression',
            comparison: prior ? (prior.impression === reading ? 'matches the demonstration' : 'differs from the demonstration') : 'no witnessed reference'}];
    });
}

// A rule is already-known theory, not a truth check. Matching two rules yields two
// hypotheses even when only one of their causes is physically present.
export function diagnoseProcess(cues, knownRules = []) {
    return knownRules.filter(rule => text(rule.id) && text(rule.explanation)
        && text(rule.source?.status) && text(rule.source?.locator)
        && Array.isArray(rule.when) && rule.when.length > 0
        && rule.when.every(match => cues.some(cue => cue.id === match.id && cue.impression === match.impression)))
        .map(rule => ({id: rule.id, explanation: rule.explanation, certainty: 'possible cause',
            source: {status: rule.source.status, locator: rule.source.locator}}));
}

const RESCUES = new Set(['cool', 'dilute', 'settle', 'neutralize', 'split']);
function hasCost(costs) {
    if(!costs || typeof costs !== 'object' || Array.isArray(costs)) return false;
    const values = Object.values(costs);
    return values.every(value => typeof value === 'number' ? Number.isFinite(value) && value >= 0
        : value && typeof value === 'object' && validCostTree(value))
        && values.some(value => typeof value === 'number' ? value > 0 : hasCost(value));
}
const validCostTree = value => value && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every(n => typeof n === 'number' ? Number.isFinite(n) && n >= 0 : validCostTree(n));
function rescueHandler(current, action, handlers) {
    if(!nat(current?.revision) || !nat(action?.expectedRevision)
        || action.expectedRevision !== current.revision) return {reason: 'The batch changed. Inspect it again.'};
    if(!RESCUES.has(action.kind) || typeof handlers?.[action.kind]?.quote !== 'function'
        || typeof handlers[action.kind].apply !== 'function') return {reason: 'No supported intervention with the available apparatus.'};
    return {handler: handlers[action.kind]};
}

// Quotes must be observer-safe: adapters return public refusal/cost, never debug.
// Pass copies even to adapters so inspection cannot mutate the custody owner.
export function quoteProcessRescue(current, action, {handlers = {}, means = {}} = {}) {
    const selected = rescueHandler(current, action, handlers);
    if(selected.reason) return {ok: false, reason: selected.reason};
    const quote = selected.handler.quote(copy(current), copy(action), copy(means));
    if(!quote?.ok) return {ok: false, reason: quote?.reason || 'The intervention cannot run with these means.'};
    if(!hasCost(quote.costs)) return {ok: false, reason: 'The intervention has no declared work, time or material cost.'};
    return {ok: true, kind: action.kind, expectedRevision: current.revision, costs: copy(quote.costs)};
}

// Requote against live current/means. Integration debits returned costs and commits
// returned state/destinations atomically. Thermal/separation adapters do the laws.
export function applyProcessRescue(current, action, options = {}) {
    const quote = quoteProcessRescue(current, action, options);
    if(!quote.ok) return quote;
    const result = options.handlers[action.kind].apply(copy(current), copy(action), copy(options.means ?? {}));
    if(!result?.ok) return {ok: false, reason: result?.reason || 'The intervention could not finish.'};
    if(!result.state || result.state.revision !== current.revision + 1
        || !Array.isArray(result.destinations) || result.destinations.length === 0)
        fail('Rescue law must advance the current revision and declare material destinations.');
    return {ok: true, state: copy(result.state), destinations: copy(result.destinations), costs: quote.costs};
}

export const PROCESS_RECEIPT_LIMIT = 16;
export const PROCESS_METHOD_LIMIT = 64;
export function createProcessRecord({law, apparatus, stopPolicy, at = 0}) {
    if(!text(law) || !text(apparatus)) fail('A demonstrated process needs its law revision and apparatus reference.');
    if(!nat(at)) fail('A demonstrated process needs its starting game time.');
    validateStopPolicy(stopPolicy);
    return {schema: 1, law, apparatus, startedAt: at, stopPolicy: copy(stopPolicy), steps: [], receipt: [], omitted: 0, overflow: false};
}

// Host passes a committed player-known action, after its real transaction. Never
// spread an input event: private traces, ingredient truth and arbitrary logs stay out.
export function recordProcessStep(record, event) {
    if(!text(event?.verb) || !text(event.stage) || !nat(event.at) || !nat(event.revision)
        || !text(event.outcome) || !hasCost(event.costs)) fail('A recorded step needs a committed action, game time, revision, outcome and cost.');
    const previous = record.receipt.at(-1);
    if(event.at < record.startedAt || previous && (event.revision <= previous.revision || event.at < previous.at)) fail('A process receipt cannot rewind completed work.');
    const step = {verb: event.verb, stage: event.stage, at: event.at, revision: event.revision,
        quantities: copy(event.quantities ?? {}), parameters: copy(event.parameters ?? {}), costs: copy(event.costs),
        conditions: copy(event.conditions ?? {}), uncertainty: String(event.uncertainty ?? 'untested tolerances'),
        outcome: event.outcome, decision: event.decision === true};
    const steps = record.steps.length < PROCESS_METHOD_LIMIT ? [...record.steps, step] : record.steps;
    const receipt = [...record.receipt, step].slice(-PROCESS_RECEIPT_LIMIT);
    return {...record, steps, receipt, omitted: Math.max(0, record.omitted + (record.receipt.length === PROCESS_RECEIPT_LIMIT ? 1 : 0)),
        overflow: record.overflow || record.steps.length >= PROCESS_METHOD_LIMIT};
}

export function demonstrateProcessMethod(record, {id, requirements, result}) {
    if(!text(id) || !record.steps.length || record.overflow || !text(result?.consumer)
        || !text(result?.label) || !requirements || !Array.isArray(requirements.tools)
        || !requirements.skills || !requirements.stock) fail('Quick method requires a complete demonstrated sequence, actual means and a useful result.');
    for(const amounts of [requirements.skills, requirements.stock])
        if(Object.values(amounts).some(amount => !Number.isFinite(amount) || amount < 0)) fail('Method means must be declared nonnegative quantities.');
    if(requirements.apparatus && Object.values(requirements.apparatus).some(amount => !Number.isFinite(amount) || amount < 0))
        fail('Apparatus requirements must be demonstrated nonnegative capabilities.');
    return {schema: 1, id, law: record.law, apparatus: record.apparatus, startedAt: record.startedAt, stopPolicy: copy(record.stopPolicy),
        steps: copy(record.steps), requirements: copy(requirements), result: {consumer: result.consumer, label: result.label}};
}

function validateStopPolicy(policy) {
    if(policy?.kind === 'complete') return;
    if(policy?.kind === 'atTime' && nat(policy.at)) return;
    if(policy?.kind === 'atCue' && CHANNELS[policy.id]?.[1].includes(policy.impression)) return;
    fail('Choose completion, a game-time deadline or an observable cue as the unattended stop policy.');
}

// Modes change how many decisions are shown, never the program or potency. Means
// are the actual player/helper snapshot. Stock is rechecked by the host per stage.
export function planProcessRepeat(method, {mode = 'quick', means = {}, stopPolicy, at = method.startedAt} = {}) {
    if(!['quick', 'guided', 'deep'].includes(mode)) fail('Unknown process depth.');
    if(!nat(at)) fail('A repeat needs its starting game time.');
    const offset = at - method.startedAt;
    const policy = stopPolicy ?? (method.stopPolicy.kind === 'atTime'
        ? {...method.stopPolicy, at: method.stopPolicy.at + offset} : method.stopPolicy);
    validateStopPolicy(policy);
    const required = method.requirements;
    const apparatusSupported = required.apparatus
        ? Object.entries(required.apparatus).every(([key, amount]) => Number.isFinite(means.apparatusCapabilities?.[key]) && means.apparatusCapabilities[key] >= amount)
        : means.apparatus === method.apparatus;
    const missingTools = required.tools.filter(tool => !(means.tools ?? []).includes(tool));
    if(!apparatusSupported || missingTools.length)
        return {ok: false, reason: `The demonstrated ${!apparatusSupported ? 'apparatus' : 'tool'} is missing${missingTools.length ? `: ${missingTools.join(', ')}` : ''}. A comparable ${!apparatusSupported ? 'apparatus' : 'tool'} would do the work with less control.`, shortfall: {apparatus: !apparatusSupported, tools: missingTools}};
    const lackedSkills = Object.entries(required.skills).filter(([skill, amount]) => !Number.isFinite(means.skills?.[skill]) || means.skills[skill] < amount);
    if(lackedSkills.length)
        return {ok: false, reason: `This maker lacks the demonstrated control: ${lackedSkills.map(([skill, amount]) => `${skill} ${means.skills?.[skill] ?? 0} of ${amount}`).join(', ')}. Practice raises it.`, shortfall: {skills: Object.fromEntries(lackedSkills)}};
    const lackedStock = Object.entries(required.stock).filter(([id, amount]) => !Number.isFinite(means.stock?.[id]) || means.stock[id] < amount);
    if(lackedStock.length)
        return {ok: false, reason: `The demonstrated materials run short: ${lackedStock.map(([id, amount]) => `${id} ${means.stock?.[id] ?? 0} of ${amount}`).join(', ')}.`, shortfall: {stock: Object.fromEntries(lackedStock)}};
    if(policy.kind === 'atCue' && !projectProcessCues({readings: {[policy.id]: policy.impression}, means}).length)
        return {ok: false, reason: 'This maker cannot observe the chosen stopping cue yet. A sense or instrument that shows it would let the repeat run.'};
    const actions = method.steps.map(step => ({...copy(step), at: step.at + offset}));
    if(actions.some(step => !nat(step.at))) fail('Repeat timeline exceeds supported game time.');
    return {ok: true, law: method.law, actions, stopPolicy: copy(policy),
        decisions: mode === 'quick' ? [] : method.steps.filter(step => mode === 'deep' || step.decision).map(step => step.revision)};
}

// Pure absolute-time predicate: one long interval and many short intervals stop
// on the same known boundary. Host must sample cues at causal stage boundaries.
export function processShouldStop(policy, {at, cues = [], complete = false}) {
    validateStopPolicy(policy);
    if(!nat(at)) fail('Stopping uses the owning game clock.');
    return complete || (policy.kind === 'atTime' && at >= policy.at)
        || (policy.kind === 'atCue' && cues.some(cue => cue.id === policy.id && cue.impression === policy.impression));
}
