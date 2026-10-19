// Proposal (WA1–WA21, docs/WORLD_ABSORPTION_RULES.md): pure world-pack lint and
// kit coverage. A pack is data a shared engine reads; this module validates it
// and reports gaps. It owns no state, save slice, tick or UI. Passing lint means
// "pack valid", never "integrated" (AR10, WA19).
import {object, positive} from './basics.js';
import {validateRuleModule} from './rule_modules.js';
import {address, compareCodePoints, hash64} from './gen_kit.js';

export const WORLD_PACK_SCHEMA = 1;
// WA3: every record says where its truth came from.
export const CANON_STATUS = Object.freeze(['source', 'supplement', 'inferred', 'authored', 'generated', 'fan']);
const CITED = new Set(['source', 'supplement', 'fan']);
// The research lens labels (AGENTS: shown, stated, inferred), plus a
// translation flag for unverified or machine-translated sources.
export const CONFIDENCE = Object.freeze(['shown', 'stated', 'inferred', 'translated']);
export const CONTINUITY_KINDS = Object.freeze(['canon', 'divergent', 'au', 'fan', 'original']);
// World core kit parts (docs/worlds/WORLD_CORE_KIT_2026-10-14.md).
export const KIT_PARTS = Object.freeze(Array.from({length: 24}, (_, i) => `K${i + 1}`));
// WA6: the five parts that make a world feel like itself, and their floor tier.
export const CORE_FLOOR = Object.freeze({K2: 2, K3: 2, K6: 2, K8: 2, K13: 4});
export const RECORD_KINDS = Object.freeze([
    'law', 'power', 'technique', 'rank', 'start', 'place', 'route', 'person', 'institution',
    'job', 'price', 'food', 'item', 'material', 'craft', 'threat', 'secret', 'appraisal',
    'event', 'loop', 'panel', 'carry', 'ending', 'hook', 'belief', 'health', 'news', 'custom', 'other']);
// A record kind's default kit part, used only when the record names none.
const DEFAULT_PART = {law: 'K2', power: 'K3', technique: 'K3', rank: 'K3', start: 'K4', place: 'K5',
    route: 'K5', person: 'K6', institution: 'K7', job: 'K8', price: 'K8', food: 'K8', item: 'K9',
    material: 'K9', craft: 'K9', threat: 'K10', secret: 'K11', appraisal: 'K11', event: 'K12',
    loop: 'K13', panel: 'K14', carry: 'K15', ending: 'K16', hook: 'K17', belief: 'K21', health: 'K22',
    news: 'K23', custom: 'K24'};

const text = v => typeof v === 'string' && v.trim().length > 0;
const tierOf = t => typeof t === 'string' && /^T[1-5]$/.test(t) ? Number(t[1]) : 0;

function allowed(issues, value, fields, path, rule) {
    for(const key of Object.keys(value)) if(!fields.includes(key)) issues.push({rule, path: `${path}.${key}`, message: 'Unknown field.'});
}

// Returns every problem at once so an author can fix a pack in one pass.
// options.registry (TagRegistry) and options.facts enable rule-module checks.
export function lintWorldPack(pack, options = {}) {
    const issues = [], add = (rule, path, message) => issues.push({rule, path, message});
    if(!object(pack)) return {ok: false, issues: [{rule: 'WA1', path: '$', message: 'A pack is an object.'}]};
    // Packs are plain data so they diff, hash and load without running code (WA21).
    try { if(JSON.stringify(JSON.parse(JSON.stringify(pack))) !== JSON.stringify(pack)) throw Error(); }
    catch { add('WA21', '$', 'Pack must be plain JSON data.'); }
    try { address(pack); } catch(error) { add('WA21', '$', `Pack is not hashable data: ${error.message}`); }
    allowed(issues, pack, ['schema', 'id', 'revision', 'worldId', 'label', 'source', 'continuity', 'tiers',
        'namespace', 'facts', 'records', 'laws', 'generators', 'unknowns', 'budget'], '$', 'WA1');
    if(pack.schema !== WORLD_PACK_SCHEMA) add('WA1', '$.schema', `Expected schema ${WORLD_PACK_SCHEMA}.`);
    if(!text(pack.worldId)) add('WA9', '$.worldId', 'Pack needs a world ID.');
    // Namespace defaults to the world ID; an existing world may keep a shorter
    // released prefix (WA9: never rename released IDs).
    const ns = `${pack.namespace ?? pack.worldId}.`;
    if(pack.namespace !== undefined && (!text(pack.namespace) || !`${pack.worldId}.`.startsWith(ns)))
        add('WA9', '$.namespace', 'Namespace must be a prefix of the world ID.');
    if(!text(pack.id) || !pack.id.startsWith(ns)) add('WA9', '$.id', 'Pack ID must sit in its world namespace.');
    if(!positive(pack.revision)) add('WA10', '$.revision', 'Pack revision must be a positive integer.');
    if(!text(pack.label)) add('WA1', '$.label', 'Pack needs a label.');

    const source = pack.source;
    if(!object(source) || !text(source.title) || !text(source.snapshot) || !text(source.boundary))
        add('WA10', '$.source', 'Source needs title, pinned snapshot and represented boundary.');
    const continuity = pack.continuity;
    if(!object(continuity) || !text(continuity.id) || !CONTINUITY_KINDS.includes(continuity.kind))
        add('WA18', '$.continuity', `Continuity needs an ID and a kind (${CONTINUITY_KINDS.join(', ')}).`);

    // Ledger facts: IDs and locators only; prose stays in the private ledger (WA2).
    const facts = new Map();
    for(const [i, f] of (Array.isArray(pack.facts) ? pack.facts : []).entries()) {
        const path = `$.facts[${i}]`;
        if(!object(f)) { add('WA2', path, 'Fact is an object.'); continue; }
        allowed(issues, f, ['id', 'status', 'locator', 'confidence', 'note'], path, 'WA2');
        if(!text(f.id) || !f.id.startsWith(ns)) add('WA9', path, 'Fact ID must sit in the world namespace.');
        else if(facts.has(f.id)) add('WA9', path, `Duplicate fact ${f.id}.`);
        else facts.set(f.id, f);
        if(!CANON_STATUS.includes(f.status)) add('WA3', path, 'Unknown canon status.');
        if(CITED.has(f.status) && !text(f.locator)) add('WA3', path, 'Cited facts need a locator.');
        if(f.confidence !== undefined && !CONFIDENCE.includes(f.confidence)) add('WA3', path, `Confidence is one of ${CONFIDENCE.join(', ')}.`);
        if(f.status === 'fan' && continuity?.kind === 'canon') add('WA18', path, 'Fan facts cannot sit in a canon continuity.');
        if(f.note !== undefined && (!text(f.note) || f.note.length > 240)) add('WA2', path, 'Notes are short paraphrase, not source text.');
    }
    if(!Array.isArray(pack.facts)) add('WA2', '$.facts', 'Pack needs a fact list, even an empty one.');

    // Rule modules: world laws as engine rules (WA4).
    const laws = new Map();
    for(const [i, m] of (Array.isArray(pack.laws) ? pack.laws : []).entries()) {
        const path = `$.laws[${i}]`;
        if(!object(m) || !text(m.id)) { add('WA4', path, 'Law module needs an ID.'); continue; }
        if(laws.has(m.id)) add('WA9', path, `Duplicate law module ${m.id}.`);
        laws.set(m.id, m);
        if(options.registry) {
            try { validateRuleModule(m, {registry: options.registry, facts: options.facts}); }
            catch(error) { add('WA4', path, error.message); }
        }
        if(m.scope?.worldId !== undefined && m.scope.worldId !== pack.worldId) add('WA9', path, 'Law scope names another world.');
    }

    const records = new Map(), partCounts = Object.fromEntries(KIT_PARTS.map(k => [k, 0]));
    for(const [i, r] of (Array.isArray(pack.records) ? pack.records : []).entries()) {
        const path = `$.records[${i}]`;
        if(!object(r)) { add('WA1', path, 'Record is an object.'); continue; }
        allowed(issues, r, ['id', 'kind', 'part', 'status', 'facts', 'locator', 'summary', 'reason', 'rule',
            'engine', 'tier', 'sealed', 'route', 'secretStatus', 'requires', 'carries', 'generator'], path, 'WA1');
        if(!text(r.id) || !r.id.startsWith(ns)) add('WA9', path, 'Record ID must sit in the world namespace.');
        else if(records.has(r.id)) add('WA9', path, `Duplicate record ${r.id}.`);
        else records.set(r.id, r);
        if(!RECORD_KINDS.includes(r.kind)) add('WA1', path, 'Unknown record kind.');
        const part = r.part ?? DEFAULT_PART[r.kind];
        if(!KIT_PARTS.includes(part)) add('WA6', path, 'Record needs a kit part.');
        else partCounts[part]++;
        if(!CANON_STATUS.includes(r.status)) add('WA3', path, 'Unknown canon status.');
        const cited = Array.isArray(r.facts) ? r.facts : [];
        for(const id of cited) if(!facts.has(id)) add('WA2', path, `Unknown fact ${id}.`);
        if(CITED.has(r.status) && !text(r.locator) && !cited.some(id => CITED.has(facts.get(id)?.status)))
            add('WA3', path, 'Canon-labelled records cite a ledger fact or locator.');
        if(r.status === 'fan' && continuity?.kind === 'canon') add('WA18', path, 'Fan records cannot sit in a canon continuity.');
        if(r.status === 'generated' && !text(r.generator)) add('WA7', path, 'Generated records name their generator.');
        if(r.status === 'generated' && cited.some(id => facts.get(id)?.status === 'source'))
            add('WA7', path, 'Generated records cannot claim source facts as their own truth.');
        if(r.kind === 'law') {
            if(!text(r.reason)) add('WA4', path, 'A law gives the player-readable reason it blocks or permits.');
            if(r.rule === undefined && r.engine === undefined) add('WA4', path, 'A law names a rule module or an engine fact; prose alone is not a law.');
            if(r.rule !== undefined && !laws.has(r.rule)) add('WA4', path, `Unknown rule module ${r.rule}.`);
            // options.engineFacts: the fact names the runtime actually reads.
            if(r.engine !== undefined && options.engineFacts && !options.engineFacts.has(r.engine))
                add('WA4', path, `Engine fact ${r.engine} is read by nothing.`);
        }
        if(r.kind === 'carry' && !object(r.carries)) add('WA14', path, 'Carry records state what crosses in and out.');
        if(r.kind === 'event' && !Array.isArray(r.requires)) add('WA15', path, 'Canon events list their causal preconditions.');
        // Sealed secrets: public fields carry ID, route and status only (WA11).
        if(r.sealed === true) {
            if(r.summary !== undefined || r.reason !== undefined) add('WA11', path, 'Sealed records keep their truth out of public fields.');
            if(!text(r.route) || !text(r.secretStatus)) add('WA11', path, 'Sealed records name a discovery route and status.');
            // IDs are public: a descriptive sealed ID spoils the secret it names.
            if(text(r.id) && !/\.s\d+$/.test(r.id)) add('WA11', path, 'Sealed record IDs end in an opaque code like .s2.');
        } else if(r.kind === 'secret') add('WA11', path, 'Secrets are sealed by default.');
        if(r.tier !== undefined && !tierOf(r.tier)) add('WA6', path, 'Tier is T1–T5.');
        if(r.summary !== undefined && (!text(r.summary) || r.summary.length > 400)) add('WA2', path, 'Summaries paraphrase in at most 400 characters.');
    }
    if(!Array.isArray(pack.records)) add('WA1', '$.records', 'Pack needs a record list.');

    for(const [i, g] of (Array.isArray(pack.generators) ? pack.generators : []).entries()) {
        const path = `$.generators[${i}]`;
        if(!object(g) || !text(g.id) || !g.id.startsWith(ns)) { add('WA9', path, 'Generator ID must sit in the world namespace.'); continue; }
        if(!text(g.table) || !/@\d+$/.test(g.table)) add('WA7', path, 'Generator names its table as id@rev (GR10).');
        if(!text(g.reader)) add('WA7', path, 'Generator names the action, cost or gate that reads it (GR12).');
        if(!object(g.budget) || !positive(g.budget.maxEntities) || !positive(g.budget.maxDrawsPerDay))
            add('WA16', path, 'Generator declares entity and daily draw budgets (GR11).');
        if(g.reader && !records.has(g.reader) && !laws.has(g.reader)) add('WA7', path, `Reader ${g.reader} is not in this pack.`);
    }
    for(const r of records.values()) if(r.status === 'generated' && text(r.generator) &&
        !(pack.generators || []).some(g => g?.id === r.generator)) add('WA7', `$.records(${r.id})`, `Unknown generator ${r.generator}.`);

    for(const [i, u] of (Array.isArray(pack.unknowns) ? pack.unknowns : []).entries()) {
        if(!object(u) || !text(u.id) || !text(u.question)) add('WA8', `$.unknowns[${i}]`, 'Unknowns state an ID and the open question.');
    }

    // Declared tiers per kit part (WA6). Missing entries mean not started.
    if(!object(pack.tiers)) add('WA6', '$.tiers', 'Pack declares a tier per kit part it covers.');
    else for(const [part, tier] of Object.entries(pack.tiers)) {
        if(!KIT_PARTS.includes(part)) add('WA6', `$.tiers.${part}`, 'Unknown kit part.');
        else if(!tierOf(tier)) add('WA6', `$.tiers.${part}`, 'Tier is T1–T5.');
        else if(tierOf(tier) >= 2 && partCounts[part] === 0) add('WA6', `$.tiers.${part}`, 'A tier above T1 needs at least one record.');
    }
    const budget = pack.budget;
    if(budget !== undefined && (!object(budget) || !positive(budget.maxRecords))) add('WA16', '$.budget', 'Budget states maxRecords.');
    else if(budget && records.size > budget.maxRecords) add('WA16', '$.budget', 'Record count exceeds the declared budget.');

    issues.sort((a, b) => compareCodePoints(a.rule, b.rule) || compareCodePoints(a.path, b.path));
    return {ok: issues.length === 0, issues};
}

// Content identity for saves and receipts (WA10): same data, same fingerprint.
// A changed fingerprint under an unchanged revision means a missed bump.
export function worldPackFingerprint(pack) {
    const {hi, lo} = hash64('world-pack@1', address(pack)), hex = n => n.toString(16).padStart(8, '0');
    return `${pack.id}@${pack.revision}#${hex(hi)}${hex(lo)}`;
}

// Kit coverage read model for an author inspector: counts, declared tiers,
// canon mix and whether the WA6 core floor is met. Assumes a linted pack.
export function worldPackCoverage(pack) {
    const parts = Object.fromEntries(KIT_PARTS.map(k => [k, {records: 0, tier: pack.tiers?.[k] ?? null, status: {}}]));
    for(const r of pack.records || []) {
        const part = parts[r.part ?? DEFAULT_PART[r.kind]];
        if(!part) continue;
        part.records++;
        part.status[r.status] = (part.status[r.status] || 0) + 1;
    }
    const lawsAsRules = (pack.records || []).filter(r => r.kind === 'law' && (r.rule || r.engine)).length;
    const floor = Object.entries(CORE_FLOOR).map(([part, need]) => ({part, need: `T${need}`,
        have: parts[part].tier, met: tierOf(parts[part].tier) >= need && parts[part].records > 0}));
    return {packRef: `${pack.id}@${pack.revision}`, parts, floor, coreFloorMet: floor.every(f => f.met),
        lawsAsRules, unknowns: (pack.unknowns || []).length, generators: (pack.generators || []).length};
}
