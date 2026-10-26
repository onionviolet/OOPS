// Pure inventory planning for processed material cohorts.
// Inventory keys carry cohort identity; the native stack count remains the only
// quantity authority. This module deliberately owns no inventory or save state.
export const MATERIAL_LINEAGE_SCHEMA = 'oops.processed-material';
export const MATERIAL_LINEAGE_REVISION = 1;

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const positive = value => Number.isSafeInteger(value) && value > 0;
const nonnegative = value => Number.isSafeInteger(value) && value >= 0;
const fail = message => { throw new Error(message); };
const clone = value => structuredClone(value);
const canonical = value => JSON.stringify(value);
const boundedText = (value, name, max = 180) => {
    if (typeof value !== 'string' || !value.trim() || value.length > max) fail(`Invalid ${name}.`);
    return value;
};

function parseKey(itemKey) {
    if (typeof itemKey !== 'string' || !itemKey) fail('Invalid inventory key.');
    // Opaque legacy IDs remain valid native identities. Only lineage-bearing
    // records use the canonical JSON envelope defined below.
    if (!itemKey.startsWith('{')) return {id: itemKey};
    let value;
    try { value = JSON.parse(itemKey); } catch { fail('Unsupported inventory key.'); }
    if (!object(value) || canonical(value) !== itemKey) fail('Non-canonical inventory key.');
    return value;
}

function validateFacts(facts) {
    if (!object(facts) || Object.keys(facts).some(k => !['born', 'origin_world', 'quality', 'completeness', 'evidence', 'treatment'].includes(k))) fail('Invalid material facts.');
    if (facts.treatment != null && !/^[a-z][a-z0-9-]{0,39}$/.test(facts.treatment)) fail('Invalid material treatment.');
    if (facts.born != null && !nonnegative(facts.born)) fail('Invalid material age.');
    if (facts.origin_world != null) boundedText(facts.origin_world, 'origin world', 120);
    if (facts.quality != null && (!Number.isFinite(facts.quality) || facts.quality < 0 || facts.quality > 1000)) fail('Invalid material quality.');
    if (facts.completeness != null) boundedText(facts.completeness, 'completeness', 80);
    if (facts.evidence != null) {
        let encoded;
        try { encoded = JSON.stringify(facts.evidence); } catch { fail('Invalid source evidence.'); }
        if (!object(facts.evidence) || encoded.length > 12000) fail('Invalid source evidence.');
        const inspect = (value, depth = 0) => {
            if (depth > 10) fail('Source evidence is too deep.');
            if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
            if (typeof value === 'number' && Number.isFinite(value)) return;
            if (Array.isArray(value)) { value.forEach(item => inspect(item, depth + 1)); return; }
            if (object(value)) { Object.values(value).forEach(item => inspect(item, depth + 1)); return; }
            fail('Invalid source evidence.');
        };
        inspect(facts.evidence);
    }
    return facts;
}

export function readMaterialLineage(itemKey) {
    if(typeof itemKey !== 'string' || !itemKey.startsWith('{')) return null;
    const ordinary = JSON.parse(itemKey);
    if(ordinary.lineage == null) return null;
    const value = parseKey(itemKey);
    const lineage = value.lineage;
    if (!object(lineage) || lineage.schema !== MATERIAL_LINEAGE_SCHEMA || lineage.revision !== MATERIAL_LINEAGE_REVISION ||
        Object.keys(lineage).some(k => !['schema', 'revision', 'family', 'facts', 'history', 'deeds'].includes(k))) fail('Invalid or unsupported material lineage.');
    boundedText(lineage.family, 'material family', 120);
    validateFacts(lineage.facts);
    if((value.quality ?? null) !== (lineage.facts.quality ?? null) || (value.completeness ?? null) !== (lineage.facts.completeness ?? null)) fail('Material properties disagree with their lineage.');
    if (!Array.isArray(lineage.history) || lineage.history.length < 1 || lineage.history.length > 64) fail('Invalid material history.');
    lineage.history.forEach(validateProcessEvent);
    if (lineage.deeds != null) validateDeeds(lineage.deeds);
    return clone(lineage);
}

// Heirloom biography (IM12, modeled on Kinfolks' passing lines, 2026-10-23).
// Dated holder and deed lines ride inside the immutable lineage, so they travel
// with the key through save, export and import with no separate save slice.
// Old keys have no `deeds` and stay valid. The cap keeps keys bounded.
export const HEIRLOOM_LINE_CAP = 14;
const DEED_KINDS = ['passed', 'deed'];
function validateDeeds(deeds) {
    if (!Array.isArray(deeds) || deeds.length > HEIRLOOM_LINE_CAP) fail('Invalid heirloom biography.');
    deeds.forEach((line, i) => {
        if (!object(line) || Object.keys(line).some(k => !['at', 'kind', 'holder', 'text'].includes(k)) || !nonnegative(line.at) || !DEED_KINDS.includes(line.kind)) fail('Invalid heirloom line.');
        if (line.holder != null) boundedText(line.holder, 'heirloom holder', 80);
        if (line.text != null) boundedText(line.text, 'heirloom deed', 160);
        if (line.kind === 'passed' && line.holder == null) fail('A passing line names its new holder.');
        if (line.kind === 'deed' && line.text == null) fail('A deed line needs text.');
        if (i > 0 && line.at < deeds[i - 1].at) fail('Heirloom lines run in date order.');
    });
}

export function heirloomLines(itemKey) {
    return clone(readMaterialLineage(itemKey)?.deeds ?? []);
}

// Value grows with age and with the number of recorded lines: a dial, not a
// price. minutesPerYear is the world's own year length (default 365 days).
export function heirloomValue(itemKey, now, {minutesPerYear = 525600, perYear = 1, perLine = 2} = {}) {
    const lineage = readMaterialLineage(itemKey);
    if (!lineage) return 0;
    const born = lineage.facts.born ?? lineage.history[0].at;
    const years = Math.max(0, Math.floor((nonnegative(now) ? now - born : 0) / minutesPerYear));
    return years * perYear + (lineage.deeds?.length ?? 0) * perLine;
}

// Passing an heirloom or recording a deed on it changes the key (the lineage is
// part of identity), so this plans a whole-stack swap: consume the old key,
// produce the new one. kind 'passed' needs holder; 'deed' needs text.
export function planHeirloomLine({stock, item_key, count, at, kind, holder, text}) {
    const lineage = readMaterialLineage(item_key);
    if (!lineage) fail('Only processed material carries an heirloom biography.');
    if (!positive(count) || stockCount(stock, item_key) < count) fail('Selected material is stale or insufficient.');
    const line = {at, kind, ...(holder != null ? {holder} : {}), ...(text != null ? {text} : {})};
    const deeds = [...(lineage.deeds ?? []), line];
    validateDeeds(deeds.length > HEIRLOOM_LINE_CAP ? deeds.slice(-HEIRLOOM_LINE_CAP) : deeds);
    const next = {...lineage, deeds: deeds.slice(-HEIRLOOM_LINE_CAP)};
    const parsed = parseKey(item_key);
    const nextKey = canonical({...parsed, lineage: next});
    return {item_key: nextKey, output: {item_key: nextKey, count}, inputs: [{item_key, count}], lineage: next};
}

// Heir succession path: a processed good that crosses to the heir gains a
// 'passed' line. Keys without lineage (or that fail to read) pass unchanged.
export function passHeirloomKey(itemKey, at, holder) {
    try {
        if (!readMaterialLineage(itemKey)) return itemKey;
        return planHeirloomLine({stock: {[itemKey]: 1}, item_key: itemKey, count: 1, at, kind: 'passed', holder}).item_key;
    } catch { return itemKey; }
}

// Item-detail sentence: dated lines plus the value stated in its two parts.
export function heirloomText(itemKey, now, minutesPerYear = 518400) {
    const lines = heirloomLines(itemKey);
    if (!lines.length) return '';
    const day = at => `day ${Math.floor(at / 1440)}`;
    const said = lines.map(l => l.kind === 'passed' ? `${day(l.at)}: passed to ${l.holder}` : `${day(l.at)}: ${l.text}`).join('; ');
    const total = heirloomValue(itemKey, now, {minutesPerYear}), fromLines = lines.length * 2;
    return `Heirloom history: ${said}. Heirloom value ${total} (${total - fromLines} from age, 1 per year; ${fromLines} from ${lines.length} recorded ${lines.length === 1 ? 'line' : 'lines'}, 2 each).`;
}

function validateProcessEvent(event) {
    if (!object(event) || Object.keys(event).some(k => !['process_id', 'revision', 'at', 'world_id', 'parameters', 'inputs'].includes(k))) fail('Invalid process history.');
    boundedText(event.process_id, 'process id', 120);
    if (!positive(event.revision) || !nonnegative(event.at)) fail('Invalid process revision or time.');
    if (event.world_id != null) boundedText(event.world_id, 'process world', 120);
    if (!object(event.parameters) || Object.keys(event.parameters).length > 32) fail('Invalid process parameters.');
    if (!Array.isArray(event.inputs) || event.inputs.length < 1) fail('Invalid process inputs.');
    event.inputs.forEach(input => {
        if (!object(input) || Object.keys(input).some(k => !['item_key', 'count', 'facts', 'role', 'disposition'].includes(k)) || !positive(input.count)) fail('Invalid process input.');
        if (input.role != null || input.disposition != null) {
            if (input.role !== 'support' || !['consumed', 'retained'].includes(input.disposition)) fail('Invalid support disposition.');
        }
        // Parents can themselves be native legacy keys. Validate the serialization
        // without requiring them to have lineage.
        parseKey(input.item_key);
        if (input.facts != null) validateFacts(input.facts);
    });
}

function stockCount(stock, itemKey) {
    if (!object(stock) || Object.keys(stock).some(key => !Number.isSafeInteger(stock[key]) || stock[key] < 0)) fail('Invalid inventory snapshot.');
    return stock[itemKey] ?? 0;
}

function exactAllocations(stock, allocations) {
    if (!Array.isArray(allocations) || allocations.length < 1) fail('Invalid material selections.');
    const seen = new Set();
    const rows = allocations.map(row => {
        if (!object(row) || Object.keys(row).some(k => !['item_key', 'count'].includes(k)) || !positive(row.count)) fail('Invalid selected material.');
        const item = parseKey(row.item_key);
        if (seen.has(row.item_key)) fail('Combine duplicate selections before planning.');
        seen.add(row.item_key);
        if (stockCount(stock, row.item_key) < row.count) fail('Selected material is stale or insufficient.');
        return {item_key: row.item_key, count: row.count, item};
    });
    return rows;
}

// A split is an allocation of one exact stack into two portable fragments. It
// does not change identity, age, grade or history, and its counts sum exactly.
export function planMaterialSplit({item_key, available, count}) {
    parseKey(item_key);
    readMaterialLineage(item_key);
    if (!positive(available) || !positive(count) || count >= available) fail('Split quantity must leave material on both sides.');
    return {item_key, fragments: [{item_key, count}, {item_key, count: available - count}], source_count: available, conserved_count: available};
}

// Equal immutable identities may coalesce. Different keys remain separate even
// when their families match, because that can conceal different age or history.
export function planMaterialMerge(fragments) {
    if (!Array.isArray(fragments) || fragments.length < 2 || fragments.length > 32) fail('Select two or more material stacks.');
    const first = fragments[0];
    if (!object(first) || !positive(first.count)) fail('Invalid material stack.');
    parseKey(first.item_key);
    readMaterialLineage(first.item_key);
    let count = 0;
    for (const row of fragments) {
        if (!object(row) || !positive(row.count)) fail('Invalid material stack.');
        parseKey(row.item_key);
        readMaterialLineage(row.item_key);
        if (row.item_key !== first.item_key) fail('Material cohorts differ; preserve them as separate stacks.');
        count += row.count;
        if (!Number.isSafeInteger(count)) fail('Merged stack is too large.');
    }
    return {item_key: first.item_key, count, consumed: fragments.map(({item_key, count}) => ({item_key, count}))};
}

// Create a new processed key plus a transaction-ready exact input expenditure.
// Output count cannot exceed consumed count here: recipes that transform volume
// need a separate explicit, world-authored yield mechanism at their call site.
export function planProcessedMaterial({stock, inputs, supportInputs = [], output, process, sourceFacts = {}, yieldRatio = {numerator: 1, denominator: 1}}) {
    const selected = exactAllocations(stock, inputs);
    // Supports retain causal identity without becoming extra units of hide,
    // meat or wood. A retained tool is checked but is not an expenditure.
    // Legacy receipts omit support rows; do not reconstruct their missing facts.
    if (!Array.isArray(supportInputs)) fail('Invalid material supports.');
    const supports = supportInputs.length ? exactAllocations(stock, supportInputs.map(row => {
        if (!object(row) || Object.keys(row).some(k => !['item_key', 'count', 'disposition'].includes(k)) || !['consumed', 'retained'].includes(row.disposition)) fail('Invalid support disposition.');
        if (selected.some(input => input.item_key === row.item_key)) fail('Primary and support selections overlap; supply one exact allocation per stock key.');
        return {item_key: row.item_key, count: row.count};
    })).map((row, i) => ({...row, disposition: supportInputs[i].disposition})) : [];
    if (!object(output) || Object.keys(output).some(k => !['id', 'family', 'count', 'quality', 'completeness', 'treatment'].includes(k))) fail('Invalid processed material output.');
    const id = boundedText(output.id, 'material id', 180);
    const family = boundedText(output.family, 'material family', 120);
    if (!positive(yieldRatio.numerator) || !positive(yieldRatio.denominator) || !positive(output.count) || BigInt(output.count) * BigInt(yieldRatio.denominator) > selected.reduce((sum, row) => sum + BigInt(row.count), 0n) * BigInt(yieldRatio.numerator)) fail('Processed yield exceeds consumed material.');
    if (output.quality != null && (!Number.isFinite(output.quality) || output.quality < 0 || output.quality > 1000)) fail('Invalid processed quality.');
    if (output.completeness != null) boundedText(output.completeness, 'completeness', 80);
    if (!object(process) || Object.keys(process).some(k => !['id', 'revision', 'at', 'world_id', 'parameters'].includes(k))) fail('Invalid process.');
    const processId = boundedText(process.id, 'process id', 120);
    if (!positive(process.revision) || !nonnegative(process.at)) fail('Invalid process revision or time.');
    if (process.world_id != null) boundedText(process.world_id, 'process world', 120);
    if (!object(process.parameters ?? {}) || Object.keys(process.parameters ?? {}).length > 32) fail('Invalid process parameters.');

    if (!object(sourceFacts)) fail('Invalid source material facts.');
    const parentFacts = [...selected, ...supports].map(row => {
        const lineage = readMaterialLineage(row.item_key);
        const source = row.item;
        const supplied = sourceFacts[row.item_key] == null ? {} : validateFacts(sourceFacts[row.item_key]);
        return lineage?.facts ?? {...{
            ...(Number.isSafeInteger(source.born) && source.born >= 0 ? {born: source.born} : {}),
            ...(typeof source.origin_world === 'string' ? {origin_world: source.origin_world} : {}),
            ...(Number.isFinite(source.quality) ? {quality: source.quality} : {}),
            ...(typeof source.completeness === 'string' ? {completeness: source.completeness} : {})
        }, ...supplied};
    });
    const facts = {};
    const inheritedFacts = parentFacts.slice(0, selected.length);
    const ages = inheritedFacts.map(row => row.born).filter(nonnegative);
    if (ages.length) facts.born = Math.min(...ages); // processing never rejuvenates a perishable input
    const worlds = [...new Set(inheritedFacts.map(row => row.origin_world).filter(Boolean))];
    if (worlds.length === 1) facts.origin_world = worlds[0];
    if (output.quality != null) facts.quality = output.quality;
    if (output.completeness != null) facts.completeness = output.completeness;
    // A treatment is the explicit result of this process, never inherited by default.
    if (output.treatment != null) facts.treatment = output.treatment;
    // Preserve full native source observations (for example harvest specimen
    // and timestamped inspection records) in the exact parent event. The item
    // projection must still honor observer knowledge separately.

    const event = {
        process_id: processId, revision: process.revision, at: process.at,
        ...(process.world_id ? {world_id: process.world_id} : {}),
        parameters: clone(process.parameters ?? {}),
        inputs: [...selected, ...supports].map((row, index) => ({item_key: row.item_key, count: row.count, facts: clone(parentFacts[index]),
            ...(row.disposition ? {role: 'support', disposition: row.disposition} : {})}))
    };
    const lineage = {schema: MATERIAL_LINEAGE_SCHEMA, revision: MATERIAL_LINEAGE_REVISION, family, facts, history: [event]};
    if (lineage.history.length > 64) fail('Material history exceeds supported depth.');
    const itemKey = canonical({id, ...(output.quality != null ? {quality: output.quality} : {}), ...(output.completeness != null ? {completeness: output.completeness} : {}), lineage});
    return {
        item_key: itemKey,
        output: {item_key: itemKey, count: output.count},
        inputs: [...selected, ...supports.filter(row => row.disposition === 'consumed')].map(({item_key, count}) => ({item_key, count})),
        lineage
    };
}
