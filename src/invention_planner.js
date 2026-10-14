/**
 * Pure authored AND/OR planner, schema version 1. See the T6 report for data
 * contracts. Graphs are world truth; only roadmapView is an actor projection.
 */
const scales = ["person", "workshop", "town", "nation", "civilization"];
const compare = (a, b) => { tick("ordering"); return a < b ? -1 : a > b ? 1 : 0; };
const sorted = values => [...new Set(values)].sort(compare);
// Scoped instrumentation used by the headless QA adapter. Original signatures
// and in-bound outputs are unchanged; exhaustion throws before publication.
let accounting = null;
const tick = (phase, amount = 1) => {
    if (!accounting) return;
    accounting.total += amount;
    accounting.phases[phase] = (accounting.phases[phase] ?? 0) + amount;
    if (accounting.total > accounting.limit) {
        const error = new RangeError("Planner work budget exceeded");
        error.code = "budget-exceeded"; error.counters = {...accounting, phases: {...accounting.phases}}; throw error;
    }
};
export function measurePlannerCall(call, limit = 1000000) {
    if (accounting) throw new TypeError("Nested accounting is unsupported");
    const counters = {total: 0, phases: {}, limit};
    accounting = counters;
    try { return {value: call(), counters}; }
    finally { accounting = null; }
}
const copy = value => { if (accounting) tick("copy", JSON.stringify(value).length); return structuredClone(value); };
const available = (world, id) => world.available?.[id] === true || world.available?.[id]?.available === true;

function catalog(pack, world) {
    const entries = new Map();
    for (const [kind, values] of [
        ["goal", [...(pack.functions ?? []), ...(world.functions ?? [])]],
        ["primitive", [...(pack.primitives ?? []), ...(world.primitives ?? [])]],
        ["method", [...(pack.methods ?? []), ...(world.methods ?? [])]],
    ]) {
        for (const value of values) {
            tick("catalog");
            if (typeof value.id !== "string" || !value.id || value.id.startsWith("$")) {
                throw new TypeError("Node IDs must be nonempty strings without the reserved $ prefix");
            }
            if (entries.has(value.id)) throw new TypeError(`Duplicate node ID: ${value.id}`);
            if (typeof value.label !== "string" || !value.label) throw new TypeError(`Missing label: ${value.id}`);
            if (value.scale !== undefined && !scales.includes(value.scale)) throw new TypeError(`Unknown scale: ${value.id}`);
            entries.set(value.id, {...copy(value), kind});
        }
    }
    for (const entry of entries.values()) {
        tick("validation");
        if (entry.kind !== "method") continue;
        if (entries.get(entry.produces)?.kind !== "goal") throw new TypeError(`Unknown product: ${entry.produces}`);
        if (!Array.isArray(entry.requires)) throw new TypeError(`Missing requirements: ${entry.id}`);
        for (const id of entry.requires) {
            tick("validation");
            if (!["goal", "primitive"].includes(entries.get(id)?.kind)) throw new TypeError(`Unknown requirement: ${id}`);
        }
    }
    return entries;
}

function targetId(entries, target) {
    if (typeof target === "string") {
        if (entries.get(target)?.kind !== "goal") throw new RangeError(`Unknown target: ${target}`);
        return target;
    }
    if (!target || !["function", "magnitude", "form"].every(key => typeof target[key] === "string")) {
        throw new TypeError("A target needs function, magnitude and form strings");
    }
    const matches = [...entries.values()].filter(entry => entry.kind === "goal" &&
        ["function", "magnitude", "form"].every(key => entry.target?.[key] === target[key]));
    if (matches.length !== 1) throw new RangeError(`Target matches ${matches.length} authored functions`);
    return matches[0].id;
}

function pruneReason(method, world) {
    if (Object.hasOwn(world.rules?.blockedMethods ?? {}, method.id)) {
        return world.rules.blockedMethods[method.id] || "Method blocked by world rules";
    }
    for (const tag of sorted(method.tags ?? [])) {
        if (Object.hasOwn(world.rules?.blockedTags ?? {}, tag)) {
            return world.rules.blockedTags[tag] || `World blocks ${tag}`;
        }
    }
    for (const flag of Object.keys(method.when ?? {}).sort(compare)) {
        if (world.rules?.flags?.[flag] !== method.when[flag]) return `World rule ${flag} does not permit this method`;
    }
    return null;
}

function expand(pack, world, targets) {
    const entries = catalog(pack, world);
    const roots = sorted(targets.map(target => targetId(entries, target)));
    const nodes = new Map(), pruned = [];
    const methods = [...entries.values()].filter(entry => entry.kind === "method").sort((a, b) => compare(a.id, b.id));
    function visit(id) {
        tick("traversal");
        if (nodes.has(id)) return;
        const entry = entries.get(id);
        const node = {id, kind: entry.kind, label: entry.label, scale: entry.scale ?? "person"};
        nodes.set(id, node); // Reserve first so cycles become edges, never recursive expansion.
        if (entry.kind === "primitive") {
            node.available = available(world, id);
            node.missingReason = entry.missingReason ?? `No ${entry.label.toLowerCase()} available in this world.`;
        } else if (entry.kind === "goal") {
            node.operator = "OR";
            if (entry.target) node.target = copy(entry.target);
            node.alternatives = [];
            for (const method of methods.filter(method => { tick("expansion"); return method.produces === id; })) {
                const reason = pruneReason(method, world);
                if (reason !== null) pruned.push({id: method.id, product: id, reason});
                else { node.alternatives.push(method.id); visit(method.id); }
            }
        } else {
            node.operator = "AND";
            node.produces = entry.produces;
            node.scale = entry.scale ?? entries.get(entry.produces).scale ?? "person";
            node.requires = sorted(entry.requires);
            node.requires.forEach(visit);
        }
    }
    roots.forEach(visit);
    return {version: 1, roots, nodes: [...nodes.values()].sort((a, b) => compare(a.id, b.id)),
        pruned: pruned.sort((a, b) => compare(a.id, b.id))};
}

export function expandTarget(pack, world, target) {
    return expand(pack, world, [target]);
}

/** Both roots must be met; merging during expansion shares every stable ID. */
export function composeTargets(pack, world, a, b) {
    return expand(pack, world, [a, b]);
}

const children = node => { tick("edges"); return node.kind === "goal" ? node.alternatives : node.kind === "method" ? node.requires : []; };
const index = graph => new Map(graph.nodes.map(node => { tick("index"); return [node.id, node]; }));

// Tarjan SCCs report cycles once, including overlapping loops in the same group.
function cycleGroups(nodes, edges) {
    const indices = new Map(), low = new Map(), stack = [], active = new Set(), groups = [];
    let next = 0;
    function visit(id) {
        tick("traversal");
        indices.set(id, next); low.set(id, next++); stack.push(id); active.add(id);
        for (const child of edges(nodes.get(id))) {
            tick("edges");
            if (!indices.has(child)) { visit(child); low.set(id, Math.min(low.get(id), low.get(child))); }
            else if (active.has(child)) low.set(id, Math.min(low.get(id), indices.get(child)));
        }
        if (low.get(id) !== indices.get(id)) return;
        const group = [];
        let member;
        do { member = stack.pop(); active.delete(member); group.push(member); } while (member !== id);
        if (group.length > 1 || edges(nodes.get(id)).includes(id)) groups.push(group.sort(compare));
    }
    for (const id of nodes.keys()) if (!indices.has(id)) visit(id);
    return groups.sort((a, b) => compare(a[0], b[0]));
}

/** Least fixed point: a cycle alone cannot create a product from nothing. */
export function checkFeasibility(graph, world) {
    const nodes = index(graph), solved = new Set(), selected = new Map();
    for (const node of nodes.values()) if (node.kind === "primitive" && available(world, node.id)) solved.add(node.id);
    let changed = true;
    while (changed) {
        changed = false;
        for (const node of nodes.values()) {
            tick("solve");
            if (solved.has(node.id) || node.kind === "primitive") continue;
            const method = node.kind === "goal" ? node.alternatives.find(id => { tick("solve-edge"); return solved.has(id); }) : undefined;
            if (node.kind === "method" ? node.requires.every(id => { tick("solve-edge"); return solved.has(id); }) : method !== undefined) {
                solved.add(node.id); changed = true;
                if (method !== undefined) selected.set(node.id, method);
            }
        }
    }
    const solvable = graph.roots.every(id => solved.has(id));
    let witness = null;
    if (solvable) {
        const seen = new Set(), steps = [], primitives = [];
        function trace(id) {
            tick("trace");
            if (seen.has(id)) return;
            seen.add(id);
            const node = nodes.get(id);
            if (node.kind === "primitive") primitives.push(id);
            else if (node.kind === "goal") {
                const method = nodes.get(selected.get(id));
                seen.add(method.id);
                method.requires.forEach(trace);
                steps.push({id, method: method.id, requires: [...method.requires]});
            }
        }
        graph.roots.forEach(trace);
        witness = {roots: [...graph.roots], nodeIds: sorted(seen), steps, primitives: sorted(primitives)};
    }
    // Stop at solved subprojects: shortages in their unused OR branches cannot
    // block a composed goal. Remaining shortages are a union, not a minimal cut.
    const frontier = new Set();
    function diagnose(id) {
        tick("diagnose");
        if (solved.has(id) || frontier.has(id)) return;
        frontier.add(id); children(nodes.get(id)).forEach(diagnose);
    }
    graph.roots.forEach(diagnose);
    const missingPrimitives = graph.nodes.filter(node => { tick("diagnostics"); return node.kind === "primitive" && frontier.has(node.id); })
        .map(node => ({id: node.id, label: node.label, reason: world.available?.[node.id]?.reason ?? node.missingReason}));
    // An exit for one goal in a large SCC need not break every smaller loop.
    const unresolved = new Map([...nodes].filter(([id]) => !solved.has(id)));
    const blocked = new Set(cycleGroups(unresolved, node => children(node).filter(id => unresolved.has(id))).flat());
    const cycles = cycleGroups(nodes, children).map(nodeIds => ({nodeIds,
        blocking: nodeIds.some(id => blocked.has(id))}));
    const deadEnds = graph.nodes.filter(node => { tick("diagnostics"); return node.kind === "goal" && node.alternatives.length === 0 && frontier.has(node.id); })
        .map(node => ({id: node.id, label: node.label, reason: `No permitted method for ${node.label.toLowerCase()}.`}));
    return {solvable, witness, missingPrimitives, cycles, deadEnds};
}

function known(entry) {
    const fidelity = typeof entry === "number" ? entry : entry?.fidelity ?? (entry?.wrong ? 2 : 0);
    if (!Number.isInteger(fidelity) || fidelity < 0 || fidelity > 5) throw new RangeError("Knowledge fidelity must be 0–5");
    if (entry?.label !== undefined && typeof entry.label !== "string") throw new TypeError("A believed label must be a string");
    return {fidelity, believed: entry?.wrong === true, label: entry?.label};
}

/**
 * Knowledge-only view. Slots never expose unknown IDs, labels, scale, stock or
 * descendants. A belief is displayed without validating it against world truth.
 * nextMissing names a knowledge gap, never an inventory/feasibility verdict.
 */
export function roadmapView(graph, knowledge) {
    const nodes = index(graph), visible = new Map(), roots = [];
    let slot = 0, nextMissing = null;
    const gap = (id, reason) => { nextMissing ??= {id, reason}; };
    function show(id) {
        tick("show");
        const node = nodes.get(id), info = known(knowledge[id]);
        if (info.fidelity < 2 && !info.believed) {
            const slotId = `$slot:${++slot}`;
            visible.set(slotId, {id: slotId, kind: "slot", label: "Unknown requirement", fidelity: info.fidelity});
            gap(slotId, "Something is needed here; you don't know what.");
            return slotId;
        }
        if (visible.has(id)) return id;
        const view = {id, kind: node.kind, label: info.label ?? node.label, fidelity: info.fidelity,
            state: info.believed ? "believed" : "known"};
        visible.set(id, view);
        if (node.kind === "goal") {
            view.operator = "OR";
            view.alternatives = node.alternatives.filter(child => {
                tick("view-edge");
                const childInfo = known(knowledge[child]);
                return childInfo.fidelity > 0 || childInfo.believed;
            }).map(show);
            if (!view.alternatives.length) gap(id, `No method known for ${view.label.toLowerCase()}.`);
        } else if (node.kind === "method") {
            view.operator = "AND";
            view.requires = node.requires.map(show);
        }
        if (info.fidelity < 4 && !info.believed) gap(id, `Learn a usable method for ${view.label.toLowerCase()}.`);
        return id;
    }
    graph.roots.forEach(id => roots.push(show(id)));
    return {roots, nodes: [...visible.values()], nextMissing};
}

/**
 * choice optionally maps goal IDs to permitted method IDs. Unchosen goals retain
 * all alternatives. Counts de-duplicate nodes; depth counts dependency edges;
 * width is the largest shortest-distance layer. Cyclic depth is null.
 */
export function estimate(graph, choice = {}) {
    const nodes = index(graph);
    for (const [id, method] of Object.entries(choice)) {
        if (nodes.get(id)?.kind !== "goal" || !nodes.get(id).alternatives.includes(method)) {
            throw new RangeError(`Invalid method choice: ${id} -> ${method}`);
        }
    }
    const edges = node => node.kind === "goal" && Object.hasOwn(choice, node.id) ? [choice[node.id]] : children(node);
    const distance = new Map(graph.roots.map(id => [id, 0])), queue = [...graph.roots];
    for (let i = 0; i < queue.length; i++) {
        const id = queue[i];
        for (const child of edges(nodes.get(id))) {
            tick("edges");
            if (!distance.has(child)) { distance.set(child, distance.get(id) + 1); queue.push(child); }
        }
    }
    const reached = new Map(queue.map(id => [id, nodes.get(id)]));
    const cycles = cycleGroups(reached, edges);
    const memo = new Map();
    function depth(id) {
        tick("depth");
        if (memo.has(id)) return memo.get(id);
        const result = Math.max(0, ...edges(nodes.get(id)).map(child => 1 + depth(child)));
        memo.set(id, result); return result;
    }
    const byScale = Object.fromEntries(scales.map(scale => [scale, 0]));
    const byKind = {goal: 0, method: 0, primitive: 0}, layers = [];
    for (const [id, level] of distance) {
        tick("estimate");
        const node = nodes.get(id);
        byScale[node.scale]++; byKind[node.kind]++;
        layers[level] = (layers[level] ?? 0) + 1;
    }
    return {depth: cycles.length ? null : Math.max(0, ...graph.roots.map(depth)),
        width: Math.max(0, ...layers), nodeCount: distance.size, byKind, byScale,
        scale: [...scales].reverse().find(scale => byScale[scale] > 0) ?? "person",
        layers, cyclic: cycles.length > 0};
}
