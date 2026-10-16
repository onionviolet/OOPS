// Proposal (WPL2, WPL4): load world packs into a frozen, deterministic
// registry. Pure: no fetch, no storage, no native registry writes. The rule
// lock comes from an injected adapter (rule_modules.createRuleLock at runtime);
// a missing adapter or resolver is a dormant feature, never an error (EC5, WP12).
import {compareCodePoints} from './gen_kit.js';
import {validateWorldPack, diagnostic, namespacesOverlap, RULE_LAYERS, ACTIVE_SLOT_KINDS} from './world_pack_manifest.js';

const byId = (a, b) => compareCodePoints(a, b);
// Records and definitions are frozen; Maps are read-only by convention.
const freeze = v => {
    if (v instanceof Map || v instanceof Set) v.forEach(freeze);
    else if (v && typeof v === 'object' && !Object.isFrozen(v)) {Object.values(v).forEach(freeze); Object.freeze(v);}
    return v;
};

// P9P2a, P9P2h: Kahn's algorithm with an ID-sorted ready queue, so file order
// never changes the result. Nodes left over sit on or behind a cycle.
export function orderPacks(deps) {
    const ids = [...deps.keys()].sort(byId), indegree = new Map(ids.map(id => [id, 0])), users = new Map(ids.map(id => [id, []]));
    for (const id of ids) for (const d of deps.get(id)) if (deps.has(d)) {indegree.set(id, indegree.get(id) + 1); users.get(d).push(id);}
    const ready = ids.filter(id => indegree.get(id) === 0), order = [];
    while (ready.length) {
        const id = ready.shift(); order.push(id);
        for (const u of users.get(id)) {indegree.set(u, indegree.get(u) - 1); if (indegree.get(u) === 0) {ready.push(u); ready.sort(byId);}}
    }
    const blocked = ids.filter(id => !order.includes(id));
    // A blocked node is on a cycle when it can reach itself through blocked nodes.
    const reaches = (from, target, seen = new Set()) => deps.get(from).some(d => d === target || blocked.includes(d) && !seen.has(d) && (seen.add(d), reaches(d, target, seen)));
    return {order, cyclic: blocked.filter(id => reaches(id, id)), blocked};
}

function references(family, r) {
    // [referenced id, required family, label] for reference integrity (WP4).
    switch (family) {
    case 'areas': return [...r.routes.map(x => [x.to, 'areas', 'route']), ...(r.people || []).map(p => [p, 'people', 'person']),
        ...(r.slots || []).map(s => [s, 'slots', 'slot']), ...(r.institution ? [[r.institution, 'institutions', 'institution']] : [])];
    case 'institutions': return [[r.commons, 'areas', 'commons'], ...r.houses.map(h => [h.dorm, 'areas', 'dorm']), ...(r.clubs || []).map(c => [c.place, 'areas', 'club place'])];
    case 'cohorts': return [[r.institution, 'institutions', 'institution'], ...Object.values(r.timetable).flatMap(row => Object.values(row).map(p => [p, 'areas', 'timetable place'])), ...(r.slot ? [[r.slot, 'slots', 'slot']] : [])];
    case 'people': return r.cohort ? [[r.cohort, 'cohorts', 'cohort']] : [];
    case 'relationships': return [[r.a, 'people', 'endpoint'], [r.b, 'people', 'endpoint']];
    case 'exceptions': return [...(r.personId ? [[r.personId, 'people', 'person']] : []), ...(r.cohortId ? [[r.cohortId, 'cohorts', 'cohort']] : []), ...(r.placeId ? [[r.placeId, 'areas', 'place']] : [])];
    case 'catalog': return r.containedIn ? [[r.containedIn, 'catalog', 'container']] : [];
    default: return [];
    }
}
// Generated members and named people both count as "people" for edges and exceptions.
const memberOf = (id, records) => {const m = /^(.*)\.m(\d+)$/.exec(id); const c = m && records.get(m[1]);
    return c?.family === 'cohorts' && Number(m[2]) < c.record.count;};

function integrity(v, features, diagnostics) {
    const {records, dormant, id: packId} = v, active = id => records.has(id) && !dormant.has(id);
    const mark = (rid, code, message) => {if (!dormant.has(rid)) {dormant.set(rid, code); diagnostics.push(diagnostic('error', code, packId, rid, message));}};
    // Feature gating per part (WP12) before references, so dormancy cascades.
    for (const [rid, {family, record: r}] of records) {
        if (family === 'areas') {const missing = (r.requiresFeatures || []).filter(f => !features.has(f));
            if (missing.length) mark(rid, 'missing-feature', `Area needs absent feature(s): ${missing.join(', ')}.`);}
        if (family === 'slots') {
            if (!ACTIVE_SLOT_KINDS.includes(r.kind)) mark(rid, 'slot-kind-dormant', `Slot kind ${r.kind} has no reader yet (GR12).`);
            else if (!features.has(`generator:${r.generator}`)) mark(rid, 'missing-generator', `Generator ${r.generator} is absent.`);
            else if (r.requiresFeature && !features.has(r.requiresFeature)) mark(rid, 'missing-feature', `Slot needs absent feature ${r.requiresFeature}.`);
        }
    }
    // Cascade to a fixpoint: a record referencing a dormant or missing record is dormant.
    for (let changed = true; changed;) {
        changed = false;
        for (const [rid, {family, record: r}] of records) {
            if (dormant.has(rid)) continue;
            for (const [ref, want, label] of references(family, r)) {
                if (family === 'areas' && label === 'route') continue; // routes are checked by coverage
                const ok = active(ref) && records.get(ref).family === want || want === 'people' && family !== 'areas' && memberOf(ref, records) && active(/^(.*)\.m\d+$/.exec(ref)[1]);
                if (!ok) {mark(rid, 'dangling-reference', `Unresolved ${label} ${ref}.`); changed = true; break;}
            }
            if (!dormant.has(rid) && family === 'cohorts') {
                const inst = records.get(r.institution).record;
                if (!inst.houses.some(h => h.id === r.house)) {mark(rid, 'dangling-reference', `Unknown house ${r.house}.`); changed = true;}
                else if (Object.values(r.timetable).some(row => Object.keys(row).some(b => !inst.blocks.some(x => x.id === b)))) {mark(rid, 'dangling-reference', 'Timetable names an unknown block.'); changed = true;}
                else if (r.count > 0 && !r.slot) {mark(rid, 'missing-slot', 'A cohort with generated members needs a slot.'); changed = true;}
            }
            if (!dormant.has(rid) && family === 'people' && r.club) {
                const cohort = records.get(r.cohort)?.record, inst = cohort && records.get(cohort.institution)?.record;
                if (!inst?.clubs?.some(c => c.id === r.club)) {mark(rid, 'dangling-reference', `Unknown club ${r.club}.`); changed = true;}
            }
        }
    }
}
// CX6/WP4: effective coverage. Playable needs a verb and a person; routes only
// lead to effectively playable areas; repeat until stable.
function coverage(v, diagnostics) {
    const {records, dormant, id: packId} = v, effective = new Map(), liveRoutes = new Map();
    const areas = [...records].filter(([id, x]) => x.family === 'areas' && !dormant.has(id)).sort(([a], [b]) => byId(a, b));
    const hasPeople = (id, r) => (r.people || []).some(p => records.has(p) && !dormant.has(p)) ||
        (r.slots || []).some(s => records.has(s) && !dormant.has(s)) ||
        [...records].some(([cid, x]) => x.family === 'cohorts' && !dormant.has(cid) && Object.values(x.record.timetable).some(row => Object.values(row).includes(id)));
    for (const [id, {record: r}] of areas) {
        let level = r.coverage;
        if (level === 'playable' && !(r.activities?.length && hasPeople(id, r))) {level = 'inspectable';
            diagnostics.push(diagnostic('warning', 'coverage-downgraded', packId, id, 'Declared playable but lacks a useful verb or a person (P9Y21).'));}
        effective.set(id, level);
    }
    // Levels never depend on routes, so one pass suffices: a route to an area
    // that is not effectively playable stays dormant.
    for (const [id, {record: r}] of areas) {
        liveRoutes.set(id, r.routes.filter(x => effective.get(x.to) === 'playable'));
        for (const x of r.routes) if (effective.get(x.to) !== 'playable')
            diagnostics.push(diagnostic('warning', 'route-dormant', packId, id, `Route to ${x.to} has no playable content (CX6).`));
    }
    const reachable = new Set(), entry = v.pack.entryArea;
    if (entry && effective.get(entry) === 'playable') {
        const queue = [entry]; reachable.add(entry);
        while (queue.length) for (const x of liveRoutes.get(queue.shift()) || []) if (!reachable.has(x.to)) {reachable.add(x.to); queue.push(x.to);}
    } else if (areas.length) diagnostics.push(diagnostic('warning', 'no-playable-entry', packId, entry ?? null, 'No playable entry area: catalog and inspectable content only.'));
    for (const [id] of areas) if (effective.get(id) === 'playable' && !reachable.has(id))
        diagnostics.push(diagnostic('warning', 'unreachable', packId, id, 'Playable area is not reachable from the entry area.'));
    return {effective, routes: liveRoutes, reachable};
}

function resolveProfile(v, loaded, features, adapter, diagnostics) {
    const want = v.pack.requires?.ruleProfile;
    if (!want) return {status: 'none'};
    const visible = new Set([v.id]), stack = [...(v.pack.requires?.packs || []).map(d => d.id)];
    while (stack.length) {const id = stack.pop(); if (!visible.has(id) && loaded.has(id)) {visible.add(id); stack.push(...(loaded.get(id).pack.requires?.packs || []).map(d => d.id));}}
    const profiles = new Map();
    for (const id of visible) {const p = id === v.id ? v.pack : loaded.get(id)?.pack; for (const prof of p?.provides?.ruleProfiles || []) profiles.set(prof.id, prof);}
    const dormantProfile = (code, message) => {diagnostics.push(diagnostic('warning', code, v.id, want, message)); return {status: 'dormant', id: want, reason: code};};
    const chain = [];
    for (let id = want, seen = new Set(); id; id = profiles.get(id)?.extends) {
        if (seen.has(id)) return dormantProfile('profile-cycle', 'Rule profile extends itself.');
        seen.add(id);
        if (!profiles.has(id)) return dormantProfile('profile-missing', `Rule profile ${id} is not provided by this pack or its dependencies.`);
        chain.unshift(profiles.get(id));
    }
    // MV layers: a child profile's modules never rank below its parent's highest layer.
    for (let i = 1; i < chain.length; i++) {
        const floor = Math.max(...chain[i - 1].modules.map(m => RULE_LAYERS.indexOf(m.priority.layer)), 0);
        if (chain[i].modules.some(m => RULE_LAYERS.indexOf(m.priority.layer) < floor)) return dormantProfile('profile-layer', `Profile ${chain[i].id} overrides below its parent layer.`);
    }
    const top = chain[chain.length - 1], modules = new Map(), rulings = {};
    for (const p of chain) for (const m of p.modules) {modules.set(m.id, m); rulings[m.id] = p.rulings[m.id];}
    const ids = [...modules.keys()].sort(byId), supported = ids.filter(id => rulings[id] === 'supported');
    const held = ids.filter(id => rulings[id] !== 'supported').map(id => ({id, ruling: rulings[id]}));
    for (const h of held) diagnostics.push(diagnostic('info', 'rule-module-dormant', v.id, h.id, `Rule module held dormant: ${h.ruling} (MC5-1).`));
    const summary = {id: want, chain: chain.map(p => p.id), resolver: top.resolver, growthUnit: top.growthUnit, scaleClass: top.scaleClass, directorPolicy: top.directorPolicy, dormantModules: held};
    if (!adapter?.createRuleLock) return {...dormantProfile('rule-owner-absent', 'No rule lock owner is available; current behavior applies.'), ...summary, status: 'dormant'};
    if (!features.has(`resolver:${top.resolver}`)) return {...dormantProfile('resolver-absent', `Resolver ${top.resolver} is absent; current behavior applies.`), ...summary, status: 'dormant'};
    try {
        const lock = adapter.createRuleLock(supported.map(id => structuredClone(modules.get(id))));
        return {...summary, status: 'active', lock: {refs: lock.refs, fingerprint: lock.fingerprint}};
    } catch (error) {return {...dormantProfile('rule-lock-refused', `Rule owner refused the lock: ${error.message}`), ...summary, status: 'dormant'};}
}

// loadWorldPacks(rawPacks, {features, ruleAdapter}) -> frozen registry.
// features: engine features available ('generator:<id>', 'resolver:<id>', ...).
export function loadWorldPacks(rawPacks, {features = [], ruleAdapter = null} = {}) {
    const featureSet = new Set(features), diagnostics = [], validated = new Map(), dormantPacks = new Map();
    const dormantPack = (id, code, message) => {if (!dormantPacks.has(id)) {dormantPacks.set(id, code); diagnostics.push(diagnostic('error', code, id, id, message));}};
    const seen = new Map();
    for (const raw of rawPacks) {const id = raw && typeof raw === 'object' ? raw.id : null; if (typeof id === 'string') seen.set(id, (seen.get(id) || 0) + 1);}
    for (const raw of rawPacks) {
        const v = validateWorldPack(raw);
        if (v.id && seen.get(v.id) > 1) {dormantPack(v.id, 'duplicate-pack', 'Two packs share this ID; neither loads.'); continue;}
        if (v.fatal) {diagnostics.push(...v.diagnostics); if (v.id) dormantPacks.set(v.id, v.diagnostics.at(-1).code); continue;}
        validated.set(v.id, v);
    }
    const ids = [...validated.keys()].sort(byId);
    for (const a of ids) for (const b of ids) if (a < b && namespacesOverlap(a, b)) {dormantPack(b, 'namespace-overlap', `Pack namespace overlaps ${a}.`);}
    for (const id of ids) {const missing = (validated.get(id).pack.requires?.features || []).filter(f => !featureSet.has(f));
        if (missing.length) dormantPack(id, 'missing-feature', `Pack needs absent feature(s): ${missing.join(', ')}.`);}
    const deps = new Map(ids.filter(id => !dormantPacks.has(id)).map(id => [id, (validated.get(id).pack.requires?.packs || []).map(d => d.id)]));
    const {order, cyclic, blocked} = orderPacks(deps);
    for (const id of cyclic) dormantPack(id, 'dependency-cycle', 'Pack is part of a dependency cycle.');
    for (const id of blocked) dormantPack(id, 'dependency-dormant', 'Pack depends on a pack in a cycle.');
    const loaded = new Map();
    for (const id of order) {
        const v = validated.get(id);
        const bad = (v.pack.requires?.packs || []).find(d => !loaded.has(d.id) || loaded.get(d.id).revision < d.minRevision);
        if (bad) {dormantPack(id, 'dependency-unmet', `Needs ${bad.id} at revision ${bad.minRevision} or later.`); continue;}
        diagnostics.push(...v.diagnostics);
        // CX5: a slot asked to fill more than it declared is dormant; the cascade follows.
        for (const [rid, {family, record}] of v.records) if (family === 'slots' && !v.dormant.has(rid)) {
            const fill = [...v.records.values()].filter(x => x.family === 'cohorts' && x.record.slot === rid).reduce((n, x) => n + x.record.count, 0);
            if (fill > record.budget.maxEntities) {v.dormant.set(rid, 'budget-slot'); diagnostics.push(diagnostic('error', 'budget-slot', id, rid, `Slot asked for ${fill} entities over its budget of ${record.budget.maxEntities}.`));}
        }
        integrity(v, featureSet, diagnostics);
        const cov = coverage(v, diagnostics);
        const ruleProfile = resolveProfile(v, loaded, featureSet, ruleAdapter, diagnostics);
        const entities = [...v.records.values()].filter(x => x.family === 'cohorts' || x.family === 'people').reduce((n, x) => n + (x.family === 'cohorts' ? x.record.count : 1), 0);
        if (entities > v.pack.budgets.entities) {dormantPack(id, 'budget-entities', `Declares ${entities} people over its budget of ${v.pack.budgets.entities}.`); continue;}
        loaded.set(id, {id, revision: v.pack.revision, saveSchema: v.pack.saveSchema, saveCompatibleFrom: v.pack.saveCompatibleFrom ?? v.pack.revision,
            fingerprint: v.fingerprint, pack: v.pack, records: v.records, dormant: v.dormant, coverage: cov.effective, routes: cov.routes, reachable: cov.reachable, ruleProfile});
    }
    // P9P5d: crossings need a declared rule, and a scale rule across scale classes.
    for (const p of loaded.values()) for (const [rid, {family, record}] of p.records) if (family === 'crossings' && !p.dormant.has(rid)) {
        const target = loaded.get(record.to), crossScale = target && p.ruleProfile.scaleClass && target.ruleProfile.scaleClass && p.ruleProfile.scaleClass !== target.ruleProfile.scaleClass;
        const code = !target ? 'crossing-target' : !record.rule ? 'crossing-rule' : crossScale && !record.scaleRule ? 'crossing-scale' : null;
        if (code) {p.dormant.set(rid, code); diagnostics.push(diagnostic('error', code, p.id, rid, code === 'crossing-target' ? `Crossing target ${record.to} is not loaded.` : code === 'crossing-rule' ? 'Crossing declares no rule.' : 'Crossing between scale classes needs a scale rule (EP5).'));}
    }
    const packs = new Map([...loaded].sort(([a], [b]) => byId(a, b)));
    return freeze({order: order.filter(id => loaded.has(id)), packs, dormantPacks: new Map([...dormantPacks].sort(([a], [b]) => byId(a, b))), diagnostics: sortDiagnostics(diagnostics)});
}
function sortDiagnostics(list) {
    const rank = {error: 0, warning: 1, info: 2};
    return list.sort((a, b) => byId(a.packId ?? '', b.packId ?? '') || rank[a.severity] - rank[b.severity] || byId(a.code, b.code) || byId(a.subjectId ?? '', b.subjectId ?? '') || byId(a.message, b.message));
}

export const isActive = (loaded, id) => loaded.records.has(id) && !loaded.dormant.has(id);

// WP14: author-only coverage printout. Lists IDs, codes and counts; reads no
// secret body beyond its ID, route and status (sealed by default).
export function authorReport(registry) {
    const lines = [];
    for (const p of registry.packs.values()) {
        const count = level => [...p.coverage.values()].filter(x => x === level).length;
        lines.push(`${p.id}@${p.revision} ${p.fingerprint} playable=${count('playable')} inspectable=${count('inspectable')} background=${count('background')} reachable=${p.reachable.size} dormant=${p.dormant.size} rules=${p.ruleProfile.status}`);
        for (const [id, {family, record}] of p.records) if (family === 'secrets') lines.push(`  secret ${id} route=${record.route} status=${record.status}`);
    }
    for (const [id, code] of registry.dormantPacks) lines.push(`${id} DORMANT ${code}`);
    return lines.join('\n');
}
// IS8, P9P2e: plain player messages. A pack or area the player has not learned
// is never named; diagnostics never reach this text.
export function playerNotices(registry, {known = new Set(), referenced = []} = {}) {
    const notices = [];
    for (const id of [...new Set(referenced)].sort(byId)) {
        if (registry.packs.has(id)) continue;
        notices.push(known.has(id) ? `${id} is unavailable in this version. Its saved progress is kept.` : 'A world you have touched is unavailable in this version. Its saved progress is kept.');
    }
    for (const p of registry.packs.values()) for (const [id, code] of p.dormant) {
        const r = p.records.get(id);
        if (r?.family === 'areas' && known.has(id) && code !== 'sealed-text') notices.push(`${r.record.label} is closed in this version.`);
    }
    return notices;
}
