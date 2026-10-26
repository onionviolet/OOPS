// Observer-safe material explanation. Inputs are already projected by the
// world/knowledge owner. This leaf has no truth, inventory, clock or RNG ports.
const STATUSES = new Set(['observed', 'claim', 'inferred', 'unknown', 'unsupported']);
const copy = value => structuredClone(value);
const pick = (value, keys) => Object.fromEntries(keys.filter(k => value?.[k] !== undefined).map(k => [k, copy(value[k])]));
function evidence(row) {
    if(!row || typeof row.id !== 'string' || !row.id || !STATUSES.has(row.status)) throw Error('Evidence needs an id and supported status.');
    const result = pick(row, ['id', 'status', 'source', 'reason']);
    // Missing authored support and missing observer knowledge are not numbers.
    // A claim or inference retains its status, even when its value equals truth.
    if(['observed', 'claim', 'inferred'].includes(row.status) && Object.hasOwn(row, 'value')) result.value = copy(row.value);
    if(row.status === 'claim' && !row.source) throw Error('A claim needs attribution.');
    return result;
}
const rows = values => (values ?? []).map(evidence);
function coverageView(value) {
    const result = pick(value, ['reason']);
    for(const key of ['searched', 'total']) if(value?.[key] !== undefined) {
        if(!Number.isSafeInteger(value[key]) || value[key] < 0) throw Error('Search coverage counts must be non-negative integers.');
        result[key] = value[key];
    }
    if(result.searched !== undefined && result.total !== undefined && result.searched > result.total) throw Error('Searched count exceeds known candidates.');
    result.complete = result.searched !== undefined && result.total !== undefined && result.searched === result.total;
    result.summary = result.complete ? 'All listed known lots checked; other sources may exist.' : 'Search of known lots is incomplete.';
    return result;
}

// The caller owns what is observable. Never pass raw truth then ask this helper
// to infer permission from matching names or a supplier's assertion.
export function inspectMaterialEvidence(input = {}) {
    const properties = rows(input.properties), tags = rows(input.tags), conditions = rows(input.conditions);
    for(const row of conditions) if(row.status === 'observed' && typeof row.value !== 'boolean') throw Error('Observed conditions need a boolean value.');
    const method = input.method ? {
        ...pick(input.method, ['id', 'revision']),
        supportedConditions: rows(input.method.supportedConditions),
        changedAssumptions: rows(input.method.changedAssumptions),
        revisionStatus: input.method.revision == null ? 'unsupported' : 'specified',
    } : null;
    const receipt = input.receipt ? {
        required: [...new Set(input.receipt.required ?? [])],
        retained: [...new Set(input.receipt.retained ?? [])],
    } : null;
    if(receipt) {
        if([...receipt.required, ...receipt.retained].some(id => typeof id !== 'string' || !id)) throw Error('Receipt references must be non-empty ids.');
        receipt.missing = receipt.required.filter(id => !receipt.retained.includes(id));
    }
    return {
        identity: pick(input.identity, ['id', 'name', 'source']),
        lot: input.lot ? pick(input.lot, ['id', 'form', 'custody']) : null,
        properties, tags, conditions,
        // Only observed conditions can substantiate a definite refusal here.
        failedConditions: conditions.filter(r => r.status === 'observed' && r.value === false),
        uncertainConditions: conditions.filter(r => r.status !== 'observed'),
        method, receipt,
        trace: (input.trace ?? []).map(step => pick(step, ['id', 'process', 'revision', 'inputs', 'output', 'source'])),
        consumer: input.consumer ? pick(input.consumer, ['id', 'description', 'source']) : null,
        coverage: coverageView(input.coverage),
    };
}
