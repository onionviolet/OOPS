// Crafting engine: material catalogues, tag queries and seeded material
// generation. Pure: no main, DOM, item classes, clocks or live owners.
// Follows GR1-GR10 (docs/GENERATION_FOUNDATION_RULES_2026-10-14.md) and the
// material/batch records in docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md.
// Content packs supply axes, tags, families and authored materials; the engine
// never names a specific ingredient.
import {TagRegistry} from './tag_store.js';
import {address, compareCodePoints, drawU32, hash64, indexFromU32, pickWeighted, withRetries} from './gen_kit.js';

export const MATRIX = 'matrix';
export const MATERIAL_GENERATOR = 'craft.material@1';
const fail = message => { throw new Error(message); };
const nat = n => Number.isSafeInteger(n) && n >= 0;
const pos = n => Number.isSafeInteger(n) && n > 0;
const text = (value, label) => typeof value === 'string' && value.length ? value : fail(`${label} must be non-empty text.`);
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
const only = (value, allowed, label) => {
    if(!plain(value)) fail(`${label} must be an object.`);
    for(const key of Object.keys(value)) if(!allowed.includes(key)) fail(`Unknown ${label} field: ${key}.`);
};
const sortKeys = object => Object.fromEntries(Object.keys(object).sort(compareCodePoints).map(key => [key, object[key]]));
export const versioned = (id, revision) => `${id}@${revision}`;
export function deepFreeze(value) {
    if(value && typeof value === 'object' && !Object.isFrozen(value)) {
        Object.freeze(value);
        for(const child of Object.values(value)) deepFreeze(child);
    }
    return value;
}
const hex = (root, key) => { const {lo, hi} = hash64(root, key); return hi.toString(16).padStart(8, '0') + lo.toString(16).padStart(8, '0'); };

// Tag query: a tag ID, {all:[...]}, {any:[...]} or {not:q}. null matches all.
export function matchesQuery(query, tags) {
    if(query == null) return true;
    if(typeof query === 'string') return tags.has(query);
    only(query, ['all', 'any', 'not'], 'query');
    const ops = Object.keys(query);
    if(ops.length !== 1) fail('Query needs exactly one of all, any or not.');
    if(ops[0] === 'not') return !matchesQuery(query.not, tags);
    if(!Array.isArray(query[ops[0]])) fail('Query children must be an array.');
    return ops[0] === 'all' ? query.all.every(q => matchesQuery(q, tags)) : query.any.some(q => matchesQuery(q, tags));
}
function queryTags(query, out = new Set()) {
    if(query == null) return out;
    if(typeof query === 'string') { out.add(query); return out; }
    for(const child of [].concat(query.all ?? [], query.any ?? [], query.not ?? [])) queryTags(child, out);
    return out;
}

// Catalogue spec: {id, revision, basis?, axes, tags, families?, materials?}.
// Fraction axes are integer amounts per `basis` mass; the reserved matrix axis
// holds the inert remainder so composition always sums to basis (conservation).
// Scalar axes are bounded integers combined by mass-weighted mean.
export function defineCatalogue(spec) {
    only(spec, ['id', 'revision', 'basis', 'axes', 'tags', 'families', 'materials'], 'catalogue');
    const id = text(spec.id, 'Catalogue ID');
    if(!pos(spec.revision)) fail('Catalogue revision must be a positive integer.');
    const basis = spec.basis ?? 1000;
    if(!pos(basis)) fail('Catalogue basis must be a positive integer.');
    const registry = spec.tags instanceof TagRegistry ? spec.tags : new TagRegistry(spec.tags ?? []);
    const axes = {};
    for(const axis of spec.axes ?? []) {
        only(axis, ['id', 'kind', 'min', 'max', 'label', 'hidden'], 'axis');
        text(axis.id, 'Axis ID');
        if(axis.id === MATRIX || axes[axis.id]) fail(`Reserved or duplicate axis: ${axis.id}.`);
        if(!['fraction', 'scalar'].includes(axis.kind)) fail('Axis kind must be fraction or scalar.');
        const min = axis.kind === 'scalar' ? axis.min ?? 0 : 0, max = axis.kind === 'scalar' ? axis.max ?? 100 : basis;
        if(!nat(min) || !nat(max) || min > max) fail(`Invalid bounds for axis ${axis.id}.`);
        axes[axis.id] = {id: axis.id, kind: axis.kind, min, max, label: axis.label ?? axis.id, hidden: axis.hidden === true};
    }
    axes[MATRIX] = {id: MATRIX, kind: 'fraction', min: 0, max: basis, label: 'inert matrix', hidden: false};
    const catalogue = {id, revision: spec.revision, ref: versioned(id, spec.revision), basis, registry,
        axes: sortKeys(axes), families: {}, materials: {}};
    for(const family of spec.families ?? []) {
        only(family, ['id', 'revision', 'tags', 'phase', 'ranges', 'correlations', 'names', 'weight'], 'family');
        text(family.id, 'Family ID');
        if(catalogue.families[family.id]) fail(`Duplicate family: ${family.id}.`);
        if(!pos(family.revision)) fail('Family revision must be a positive integer.');
        const tags = registry.expand(family.tags ?? []);
        for(const tag of family.tags ?? []) if(!registry.has(tag)) fail(`Unknown tag: ${tag}.`);
        const ranges = {};
        for(const [axis, range] of Object.entries(family.ranges ?? {})) {
            if(!axes[axis] || axis === MATRIX) fail(`Unknown family axis: ${axis}.`);
            if(!Array.isArray(range) || range.length !== 2 || !nat(range[0]) || range[0] > range[1] || range[1] > axes[axis].max || range[0] < axes[axis].min)
                fail(`Invalid range for ${family.id}.${axis}.`);
            ranges[axis] = [range[0], range[1]];
        }
        const correlations = (family.correlations ?? []).map(c => {
            only(c, ['from', 'to', 'per'], 'correlation');
            if(!ranges[c.from] || !ranges[c.to] || c.from === c.to || !Number.isSafeInteger(c.per)) fail('Correlations link two ranged axes with an integer permille.');
            return {from: c.from, to: c.to, per: c.per};
        });
        const names = family.names ?? {};
        if(!Array.isArray(names.prefix) || !names.prefix.length || !Array.isArray(names.root) || !names.root.length) fail(`Family ${family.id} needs prefix and root names.`);
        const weight = family.weight ?? 1;
        if(!nat(weight)) fail('Family weight must be a non-negative integer.');
        catalogue.families[family.id] = {id: family.id, revision: family.revision, ref: versioned(family.id, family.revision),
            tags: [...family.tags ?? []].sort(compareCodePoints), expanded: tags, phase: text(family.phase ?? 'solid', 'Phase'),
            ranges: sortKeys(ranges), correlations, names: {prefix: [...names.prefix], root: [...names.root]}, weight};
    }
    for(const material of spec.materials ?? []) {
        const normalized = normalizeMaterial(catalogue, material);
        if(catalogue.materials[normalized.id]) fail(`Duplicate material: ${normalized.id}.`);
        catalogue.materials[normalized.id] = normalized;
    }
    return deepFreeze(catalogue);
}

function normalizeMaterial(catalogue, material) {
    only(material, ['id', 'revision', 'name', 'family', 'tags', 'phase', 'properties', 'weight', 'origin'], 'material');
    const id = text(material.id, 'Material ID');
    if(!pos(material.revision)) fail('Material revision must be a positive integer.');
    if(material.family != null && !catalogue.families[material.family]) fail(`Unknown material family: ${material.family}.`);
    const tags = [...new Set(material.tags ?? [])].sort(compareCodePoints);
    for(const tag of tags) if(!catalogue.registry.has(tag)) fail(`Unknown tag: ${tag}.`);
    if(!plain(material.properties ?? {})) fail('Material properties must be an object.');
    const properties = {};
    let fractions = 0;
    for(const [axis, value] of Object.entries(material.properties ?? {})) {
        const def = catalogue.axes[axis];
        if(!def) fail(`Unknown axis: ${axis}.`);
        if(axis === MATRIX) continue; // derived; checked below when supplied
        if(!nat(value) || value < def.min || value > def.max) fail(`Axis ${axis} out of bounds on ${id}.`);
        if(def.kind === 'fraction') fractions += value;
    }
    if(fractions > catalogue.basis) fail(`Fractions exceed basis on ${id}.`);
    for(const def of Object.values(catalogue.axes)) {
        if(def.id === MATRIX) properties[MATRIX] = catalogue.basis - fractions;
        else properties[def.id] = material.properties?.[def.id] ?? def.min;
    }
    if(material.properties?.[MATRIX] != null && material.properties[MATRIX] !== properties[MATRIX]) fail(`Matrix does not account for ${id}.`);
    const weight = material.weight ?? (material.family ? catalogue.families[material.family].weight : 1);
    if(!nat(weight)) fail('Material weight must be a non-negative integer.');
    const result = {id, revision: material.revision, name: text(material.name ?? id, 'Material name'), family: material.family ?? null,
        tags, phase: text(material.phase ?? (material.family ? catalogue.families[material.family].phase : 'solid'), 'Phase'),
        properties: sortKeys(properties), weight};
    if(material.origin != null) {
        only(material.origin, ['generator', 'catalogue', 'family', 'scope', 'index', 'fallback'], 'origin');
        result.origin = {...material.origin};
    }
    return result;
}

// Validates an authored or frozen generated material against this catalogue.
// Authored materials must match the catalogue exactly; generated ones must
// name this catalogue revision. Returns a frozen normalized copy.
export function validateMaterial(catalogue, material) {
    const normalized = normalizeMaterial(catalogue, material);
    const authored = catalogue.materials[normalized.id];
    if(authored) {
        if(JSON.stringify(authored) !== JSON.stringify(normalized)) fail(`Material ${normalized.id} disagrees with its catalogue entry.`);
    } else if(normalized.origin?.catalogue !== catalogue.ref) {
        fail(`Material ${normalized.id} is not from ${catalogue.ref}.`);
    }
    return deepFreeze(normalized);
}

export function materialTags(catalogue, material) {
    return new Set(catalogue.registry.expand([...material.tags, ...(material.family ? catalogue.families[material.family].tags : [])]));
}

// Seeded material generation (audit P7): a family's ranges and correlations
// produce a coherent property bundle. Same root/scope/index/revisions give the
// same material; callers freeze it once seen (GR3) via craft_state.
export function generateMaterial(catalogue, familyId, {root, scope, index}) {
    const family = catalogue.families[familyId] ?? fail(`Unknown family: ${familyId}.`);
    text(scope, 'Generation scope');
    if(!nat(index)) fail('Generation index must be a non-negative integer.');
    const base = address('craft.material', catalogue.ref, family.ref, scope, index);
    const id = `gen:${family.id}:${hex(root, base)}`;
    const make = (properties, attempt) => {
        const name = `${family.names.prefix[indexFromU32(drawU32(root, address(base, 'name.prefix')), family.names.prefix.length)]} ${
            family.names.root[indexFromU32(drawU32(root, address(base, 'name.root')), family.names.root.length)]}`;
        return {id, revision: 1, name, family: family.id, tags: [], phase: family.phase, properties,
            origin: {generator: MATERIAL_GENERATOR, catalogue: catalogue.ref, family: family.ref, scope, index, ...(attempt == null ? {fallback: true} : {})}};
    };
    const fractionSum = properties => Object.entries(properties).reduce((n, [axis, v]) => n + (catalogue.axes[axis].kind === 'fraction' ? v : 0), 0);
    const roll = key => {
        const values = {};
        for(const [axis, [lo, hi]] of Object.entries(family.ranges)) values[axis] = lo + indexFromU32(drawU32(root, address(key, 'axis', axis)), hi - lo + 1);
        for(const {from, to, per} of family.correlations) {
            const [lo, hi] = family.ranges[from], [tlo, thi] = family.ranges[to];
            const lift = Math.trunc((values[from] * 2 - lo - hi) * per / 2000);
            values[to] = Math.min(thi, Math.max(tlo, values[to] + lift));
        }
        return values;
    };
    const midpoint = Object.fromEntries(Object.entries(family.ranges).map(([axis, [lo, hi]]) => [axis, Math.floor((lo + hi) / 2)]));
    const total = fractionSum(midpoint);
    if(total > catalogue.basis) for(const axis of Object.keys(midpoint)) if(catalogue.axes[axis].kind === 'fraction') midpoint[axis] = Math.floor(midpoint[axis] * catalogue.basis / total);
    const {value, receipt} = withRetries(key => roll(key), values => fractionSum(values) <= catalogue.basis,
        {max: 8, fallback: {id: `${family.ref}:midpoint`, value: midpoint}, address: base});
    return {value: validateMaterial(catalogue, make(value, receipt.fallbackUsed ? null : receipt.attempts - 1)), receipt};
}

// Weighted pool by tag query with GR8 overlays (core -> world -> region ...).
// Overlay ops: {id, op:'ban', match}, {id, op:'reweight', match, permille},
// {id, op:'add', materials:[frozen materials]}. Order matters; each row keeps
// the reasons that shaped it (GR9).
export function materialPool(catalogue, query, {overlays = [], extra = []} = {}) {
    let rows = [...Object.values(catalogue.materials), ...extra.map(m => validateMaterial(catalogue, m))]
        .map(material => ({material, weight: material.weight, reasons: [material.family ? `family:${material.family}` : 'authored']}));
    for(const overlay of overlays) {
        only(overlay, ['id', 'op', 'match', 'permille', 'materials'], 'overlay');
        text(overlay.id, 'Overlay ID');
        if(overlay.op === 'add') {
            rows.push(...(overlay.materials ?? []).map(m => ({material: validateMaterial(catalogue, m), weight: m.weight ?? 1, reasons: [`add:${overlay.id}`]})));
            continue;
        }
        const hit = row => matchesQuery(overlay.match, materialTags(catalogue, row.material));
        if(overlay.op === 'ban') rows = rows.filter(row => !hit(row));
        else if(overlay.op === 'reweight') {
            if(!nat(overlay.permille)) fail('Reweight needs an integer permille.');
            rows = rows.map(row => hit(row) ? {...row, weight: Math.floor(row.weight * overlay.permille / 1000), reasons: [...row.reasons, `reweight:${overlay.id}`]} : row);
        } else fail(`Unknown overlay op: ${overlay.op}.`);
    }
    for(const tag of queryTags(query)) if(!catalogue.registry.has(tag)) fail(`Unknown query tag: ${tag}.`);
    const seen = new Set();
    return rows.filter(row => matchesQuery(query, materialTags(catalogue, row.material)))
        .filter(row => !seen.has(row.material.id) && seen.add(row.material.id))
        .sort((a, b) => compareCodePoints(a.material.id, b.material.id));
}

export function pickMaterial(catalogue, query, {root, key, overlays, extra, exclude = []} = {}) {
    const rows = materialPool(catalogue, query, {overlays, extra}).filter(row => !exclude.includes(row.material.id));
    const byId = new Map(rows.map(row => [row.material.id, row]));
    const picked = pickWeighted(rows.map(row => ({id: row.material.id})),
        item => ({weight: byId.get(item.id).weight, reason: byId.get(item.id).reasons.join('+')}), drawU32(root, key));
    return {value: picked.value ? byId.get(picked.value.id).material : null, receipt: picked.receipt};
}
