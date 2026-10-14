// Standalone presence tags. No gameplay state, clocks, strengths or effects.
// Registries are immutable; new content revisions create a new registry.
const sorted = values => [...new Set(values)].sort();
function text(value, label) {
    if(typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be non-empty text.`);
    return value;
}
function record(value, label) {
    if(!value || typeof value !== 'object' || Array.isArray(value) ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(value))) {
        throw new Error(`${label} must be an object.`);
    }
}
function keys(value, allowed, label) {
    record(value, label);
    if(Object.keys(value).some(key => !allowed.includes(key))) throw new Error(`Unknown ${label} field.`);
}
function ids(value, label) {
    if(!Array.isArray(value) && !(value instanceof Set)) throw new Error(`${label} must be an array or Set.`);
    return sorted([...value].map(id => text(id, label)));
}
// Accept the boolean map used by items.js without mutating the item.
function tagIds(value) {
    if(Array.isArray(value) || value instanceof Set) return ids(value, 'Tags');
    record(value, 'Tags');
    return Object.entries(value).filter(([id, present]) => {
        text(id, 'Tag ID');
        if(typeof present !== 'boolean') throw new Error('Item tags must be booleans.');
        return present;
    }).map(([id]) => id).sort();
}

export class TagRegistry {
    #definitions = new Map();
    constructor(definitions = []) {
        if(!Array.isArray(definitions)) throw new Error('Tag definitions must be an array.');
        for(const definition of definitions) {
            keys(definition, ['id', 'kind', 'parents', 'revision', 'visible'], 'tag definition');
            const id = text(definition.id, 'Tag ID'), kind = text(definition.kind, 'Tag kind');
            if(this.#definitions.has(id)) throw new Error(`Duplicate tag: ${id}.`);
            if(!Number.isSafeInteger(definition.revision) || definition.revision < 1) {
                throw new Error('Tag revision must be a positive safe integer.');
            }
            const parents = Object.freeze(ids(definition.parents ?? [], 'Parents'));
            const visible = definition.visible ?? 'open';
            if(!['open', 'hidden'].includes(visible)) throw new Error('Tag visibility must be open or hidden.');
            this.#definitions.set(id, Object.freeze({id, kind, parents, revision: definition.revision, visible}));
        }
        const visiting = new Set(), visited = new Set();
        const visit = id => {
            if(visiting.has(id)) throw new Error(`Tag implication cycle at ${id}.`);
            if(visited.has(id)) return;
            const definition = this.#definitions.get(id);
            if(!definition) throw new Error(`Unknown parent tag: ${id}.`);
            visiting.add(id);
            for(const parent of definition.parents) visit(parent);
            visiting.delete(id); visited.add(id);
        };
        for(const id of this.#definitions.keys()) visit(id);
        Object.freeze(this);
    }
    get(id) { return this.#definitions.get(id); }
    has(id) { return this.#definitions.has(id); }
    definitions() { return sorted(this.#definitions.keys()).map(id => this.get(id)); }
    expand(tags) {
        const expanded = new Set();
        const visit = id => {
            if(expanded.has(id)) return;
            expanded.add(id);
            for(const parent of this.get(id)?.parents ?? []) visit(parent);
        };
        for(const id of tagIds(tags)) visit(id);
        return sorted(expanded);
    }
}

// No observer means open tags only. Explicit tags/kinds form a sense's allow
// list (union) and can reveal hidden tags. Empty lists see nothing. Omniscience
// is explicit and also exposes opaque unknown IDs retained from a save.
function visibility(registry, observer = {}) {
    keys(observer, ['tags', 'kinds', 'omniscient'], 'observer');
    if(observer.omniscient !== undefined && typeof observer.omniscient !== 'boolean') {
        throw new Error('Observer omniscient must be a boolean.');
    }
    const tags = observer.tags === undefined ? null : new Set(ids(observer.tags, 'Observer tags'));
    const kinds = observer.kinds === undefined ? null : new Set(ids(observer.kinds, 'Observer kinds'));
    return id => {
        if(observer.omniscient === true) return true;
        const definition = registry.get(id);
        if(!definition) return false;
        if(tags || kinds) return tags?.has(id) || kinds?.has(definition.kind) || false;
        return definition.visible === 'open';
    };
}

// entity is {registry: TagRegistry, tags: boolean map | array | Set}.
// Defaults to actor.tag.<id>; options.prefix='target' serves target facts.
// options.tags limits work/output to the IDs a card names. Observable absent
// registered tags are false; hidden or unknown absent tags have no fact.
export function tagFacts(entity, observer = {}, options = {}) {
    if(!(entity?.registry instanceof TagRegistry)) throw new Error('Entity needs a TagRegistry.');
    keys(options, ['prefix', 'tags'], 'fact options');
    const prefix = text(options.prefix ?? 'actor', 'Fact prefix');
    const present = new Set(entity.registry.expand(entity.tags));
    const candidates = options.tags === undefined
        ? sorted([...entity.registry.definitions().map(tag => tag.id), ...present])
        : ids(options.tags, 'Fact tags');
    const canSee = visibility(entity.registry, observer), facts = {};
    for(const id of candidates) {
        if(canSee(id) && (entity.registry.has(id) || present.has(id))) {
            facts[`${prefix}.tag.${id}`] = present.has(id);
        }
    }
    return facts;
}

function evaluateQuery(query, read) {
    if(typeof query === 'string') return read(text(query, 'Query tag'));
    keys(query, ['all', 'any', 'not'], 'query');
    const operators = Object.keys(query);
    if(operators.length !== 1) throw new Error('Query needs exactly one of all, any or not.');
    const op = operators[0];
    if(op === 'not') {
        const result = evaluateQuery(query.not, read);
        return {known: result.known, met: result.known && !result.met};
    }
    if(!Array.isArray(query[op])) throw new Error('Query children must be an array.');
    const results = query[op].map(child => evaluateQuery(child, read));
    const met = op === 'all' ? results.every(result => result.met) : results.some(result => result.met);
    const known = op === 'all'
        ? results.every(result => result.known) || results.some(result => result.known && !result.met)
        : met || results.every(result => result.known);
    return {known, met};
}

export class TagStore {
    #entities = new Map();
    constructor(registry = new TagRegistry()) {
        if(!(registry instanceof TagRegistry)) throw new Error('Store needs a TagRegistry.');
        Object.defineProperty(this, 'registry', {value: registry, enumerable: true});
        Object.freeze(this);
    }
    // Replacement is atomic. Live writes reject typos; only deserialize keeps
    // unknown IDs. Empty sets remain serialized as explicitly tracked entities.
    set(entity, tags) {
        text(entity, 'Entity ID');
        const direct = tagIds(tags);
        for(const id of direct) if(!this.registry.has(id)) throw new Error(`Unknown tag: ${id}.`);
        this.#entities.set(entity, new Set(direct));
        return this;
    }
    add(entity, tag) {
        text(entity, 'Entity ID'); text(tag, 'Tag ID');
        if(!this.registry.has(tag)) throw new Error(`Unknown tag: ${tag}.`);
        if(!this.#entities.has(entity)) this.#entities.set(entity, new Set());
        this.#entities.get(entity).add(tag);
        return this;
    }
    // Removes an explicit grant only. A parent stays present while any child
    // implies it; removing the child never erases another explicit parent.
    remove(entity, tag) {
        text(entity, 'Entity ID'); text(tag, 'Tag ID');
        return this.#entities.get(entity)?.delete(tag) ?? false;
    }
    tags(entity, {implied = true} = {}) {
        text(entity, 'Entity ID');
        const direct = this.#entities.get(entity) ?? new Set();
        return implied ? this.registry.expand(direct) : sorted(direct);
    }
    has(entity, tag) { return this.tags(entity).includes(text(tag, 'Tag ID')); }
    // Detached read view for the standalone helper. Mutating it cannot edit
    // the store, and later store writes do not change an earlier view.
    entity(entity) {
        return Object.freeze({id: entity, registry: this.registry, tags: Object.freeze(this.tags(entity, {implied: false}))});
    }
    visibleTags(entity, observer = {}) {
        const canSee = visibility(this.registry, observer);
        return this.tags(entity).filter(canSee);
    }
    tagFacts(entity, observer = {}, options = {}) { return tagFacts(this.entity(entity), observer, options); }
    matches(entity, query, observer) {
        const present = new Set(this.tags(entity));
        // Omitted observer asks about true state. An explicit {} asks only
        // about open tags. Negation cannot turn a hidden tag into a match.
        const canSee = observer === undefined ? () => true : visibility(this.registry, observer);
        return evaluateQuery(query, id => {
            const known = canSee(id) && (this.registry.has(id) || present.has(id));
            return {known, met: known && present.has(id)};
        }).met;
    }
    query(query, observer) {
        // Validate even when no entities have been tracked.
        evaluateQuery(query, () => ({known: false, met: false}));
        if(observer !== undefined) visibility(this.registry, observer);
        return sorted(this.#entities.keys()).filter(id => this.matches(id, query, observer));
    }
    serialize() {
        return JSON.stringify({schema: 1, registry: this.registry.definitions(),
            entities: sorted(this.#entities.keys()).map(id => ({id, tags: this.tags(id, {implied: false})}))});
    }
    // Schema 1 is independent of ENGINE_SCHEMA. No current save is changed.
    // Saved definitions, including revisions and implications, remain the read
    // authority. currentRegistry is diagnostic only; migration is caller-owned.
    static deserialize(serialized, {currentRegistry} = {}) {
        if(currentRegistry !== undefined && !(currentRegistry instanceof TagRegistry)) {
            throw new Error('Current registry must be a TagRegistry.');
        }
        const saved = typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
        keys(saved, ['schema', 'registry', 'entities'], 'tag snapshot');
        if(saved.schema !== 1) throw new Error('Unsupported tag snapshot schema.');
        if(!Array.isArray(saved.registry) || !Array.isArray(saved.entities)) throw new Error('Invalid tag snapshot arrays.');
        const store = new TagStore(new TagRegistry(saved.registry)), diagnostics = [];
        const unknown = new Map();
        for(const entry of saved.entities) {
            keys(entry, ['id', 'tags'], 'entity');
            text(entry.id, 'Entity ID');
            if(store.#entities.has(entry.id)) throw new Error(`Duplicate entity: ${entry.id}.`);
            const tags = ids(entry.tags, 'Saved tags');
            store.#entities.set(entry.id, new Set(tags));
        }
        for(const id of sorted(store.#entities.keys())) for(const tag of store.tags(id)) {
            if(!store.registry.has(tag) || (currentRegistry && !currentRegistry.has(tag))) {
                if(!unknown.has(tag)) unknown.set(tag, []);
                unknown.get(tag).push(id);
            }
        }
        for(const id of sorted(unknown.keys())) diagnostics.push({code: 'unknown-tag', id, entities: unknown.get(id)});
        if(currentRegistry) for(const savedTag of store.registry.definitions()) {
            const current = currentRegistry.get(savedTag.id);
            if(current && current.revision !== savedTag.revision) diagnostics.push({code: 'revision-mismatch',
                id: savedTag.id, savedRevision: savedTag.revision, currentRevision: current.revision});
        }
        return {store, diagnostics};
    }
}
