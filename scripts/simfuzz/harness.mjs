// Engine-level simulation fuzzer core (wave D). Pure engine API in Node: no DOM,
// no browser, no personal save. Fixtures come from tests/fixtures/perf/.
// See scripts/simfuzz/README.md for what each policy and invariant means.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const FIXTURES = ['fresh', 'mid', 'crowded'];
const src = f => path.join(ROOT, 'src', f);

// ---------- module loading ----------
// Host modules are imported one by one so a broken import shows in the report
// instead of killing the run.
const HOST_MODULES = {
    steam: ['steam_absorption_host.js', 'commitSteamAbsorptionCommand'],
    contextual_balm: ['contextual_balm_host.js', 'commitContextualBalmCommand'],
    cooling_refinement: ['cooling_refinement_host.js', 'commitCoolingRefinementCommand'],
    world_completion: ['world_completion_host.js', 'commitWorldCompletionCommand'],
    lore_practice: ['lore_practice_host.js', 'commitLorePracticeCommand'],
    book_care: ['book_care_host.js', 'commitBookCareCommand'],
    field_care: ['field_care_host.js', 'commitFieldCareCommand'],
    status_care: ['status_care_host.js', 'commitStatusCareCommand'],
    book_paradise_campaign: ['book_world_paradise_campaign_host.js', 'commitParadiseCampaignDepthCommand'],
    book_paradise: ['book_world_paradise_host.js', 'commitParadiseCommand'],
    book_mol: ['book_world_mol_host.js', 'commitMolCommand'],
    home_furnishings: ['home_furnishing_host.js', 'commitHomeFurnishingCommand'],
    proto23: ['proto23_world_host.js', 'commitProto23Command'],
    factorio_retort: ['factorio_retort_host.js', 'commitFactorioRetortCommand'],
    game_absorption_assay: ['game_absorption_assay_host.js', 'commitGameAbsorptionAssayCommand'],
    nethack_fieldcraft: ['nethack_fieldcraft_host.js', 'commitNethackFieldcraftCommand'],
    artifact_collection: ['artifact_workshop_host.js', 'commitArtifactWorkshopCommand'],
    audit_remainder: ['audit_remainder_host.js', 'commitAuditRemainderCommand'],
    audit_workshop: ['audited_workshop_host.js', 'commitAuditedWorkshopCommand'],
    reference_gameplay: ['reference_gameplay_host.js', 'commitReferenceGameplayCommand'],
    feature_objects: ['feature_expansion_objects_host.js', 'commitFeatureObjectCommand'],
    feature_society: ['feature_expansion_society_host.js', 'commitSocietyAction'],
    tidemark: ['feature_expansion_destination_host.js', 'commitTidemarkAction'],
    nested_campaign: ['feature_expansion_nested_host.js', 'commitNestedCommand'],
    nested_life: ['feature_expansion_nested_life.js', 'commitNestedLifeCommand'],
    nested_chains: ['feature_expansion_nested_chains_host.js', 'commitNestedChainCommand'],
    causal_story: ['causal_story_host.js', 'commitCausalStoryCommand'],
    causal_story_preview: ['causal_story_host.js', 'previewCausalStoryCommand'],
    remainder_livelihood: ['audit_remainder_livelihood_host.js', 'commitRemainderLivelihoodCommand'],
    remainder_home: ['audit_remainder_home_host.js', 'commitRemainderHomeCommand'],
    remainder_offers: ['audit_remainder_offers_host.js', 'commitRemainderOffersCommand'],
    remainder_consequences: ['audit_remainder_consequences_host.js', 'commitRemainderConsequencesCommand'],
    remainder_combat_fit: ['audit_remainder_combat_fit_host.js', 'commitRemainderCombatFitCommand'],
    remainder_combat_objectives: ['audit_remainder_combat_objectives_host.js', 'commitRemainderCombatObjectivesCommand'],
    glasshouse: ['pocket_realm_host.js', 'commitPocketRealmAction'],
    observation: ['observation_content.js', 'commitObservationCommand'],
    exchange: ['exchange.js', 'commitExchangeCommand'],
    original_frontier: ['original_frontier_campaign_host.js', 'commitOriginalFrontier'],
    repositories: ['repository_absorption_host.js', 'commitRepositoryAbsorption'],
    management: ['management/host.js', 'commitManagement'],
    crush_social: ['crush_social_host.js', 'commitCrushSocialAction'],
    feature_powers: ['feature_expansion_powers_host.js', 'planFeaturePowerCommand'],
    agreed_duty: ['agreed_duty_host.js', 'commitAgreedDutyAction'],
};
// Openers: owner-creating entry points main.js calls before a world's commands exist.
const OPENER_MODULES = {
    'open:simulation.enroll': ['simulation.js', 'enrollSimulation', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:feature_objects': ['feature_expansion_objects_host.js', 'beginFeatureObjects', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:feature_society': ['feature_expansion_society_host.js', 'beginSociety', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:tidemark': ['feature_expansion_destination_host.js', 'beginTidemark', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:observation': ['observation_content.js', 'beginObservation', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:exchange': ['exchange.js', 'beginExchange', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:promise': ['promise_content.js', 'beginPromiseVisitor', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:body': ['body_progression.js', 'beginBodyRecord', (f, s, r, c) => f(s, r, c)],
    'open:field': ['field_workshop.js', 'beginFieldWorkshop', (f, s, r, c) => f(s, r, c)],
    'open:original_frontier': ['original_frontier_campaign_host.js', 'beginOriginalFrontier', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:repositories': ['repository_absorption_host.js', 'beginRepositoryAbsorption', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:reference_gameplay': ['reference_gameplay_state.js', 'enrollReferenceGameplay', (f, s, r, c) => f(s, c, s.sequence)],
    'open:audited_kit_reserve': ['audited_kit_reserve_host.js', 'startAuditedKitReserve', (f, s, r, c) => f(s, r, c, s.sequence)],
    'open:factorio_retort_plan': ['factorio_retort_host.js', 'startFactorioRetortPlan', (f, s, r, c) => f(s, r, c, s.sequence)],
};
// Context layers, in buildFeatureWaveContext order (src/main.js). Each takes
// (state[, registry], context) and returns an enriched context.
const CONTEXT_LAYERS = [
    ['skill_expansion_host.js', 'skillExpansionContext', false],
    ['original_frontier_campaign_host.js', 'originalFrontierContext', true],
    ['feature_expansion_objects_host.js', 'featureObjectContext', true],
    ['feature_expansion_society_host.js', 'societyContext', false],
    ['feature_expansion_destination_host.js', 'tidemarkContext', false],
    ['feature_expansion_powers_host.js', 'featurePowerContext', false],
    ['repository_absorption_host.js', 'repositoryAbsorptionContext', true],
    ['feature_expansion_nested_host.js', 'nestedContext', false],
    ['feature_expansion_nested_chains_host.js', 'nestedChainContext', false],
    ['feature_expansion_nested_life.js', 'nestedLifeContext', false],
    ['reference_gameplay_host.js', 'referenceGameplayContext', true],
    ['book_world_paradise_host.js', 'paradiseContext', false],
    ['book_world_mol_host.js', 'molContext', false],
    ['book_world_paradise_campaign_facts.js', 'paradiseCampaignContext', false],
    ['nethack_fieldcraft_host.js', 'nethackFieldcraftContext', true],
    ['audited_workshop_host.js', 'auditedWorkshopContext', true],
    ['audit_remainder_host.js', 'auditRemainderContext', true],
    ['world_completion_facts.js', 'worldCompletionContext', false],
    ['proto23_world_host.js', 'proto23Context', false],
    ['factorio_retort_host.js', 'factorioRetortContext', true],
    ['game_absorption_assay_host.js', 'gameAbsorptionAssayContext', true],
    ['contextual_balm_facts.js', 'contextualBalmContext', false],
    ['cooling_refinement_host.js', 'coolingRefinementContext', true],
    ['steam_absorption_host.js', 'steamAbsorptionContext', true],
];

export async function loadEngine() {
    const engine = await import(src('expansion_engine.js'));
    const sim = await import(src('simulation.js'));
    const content = await import(src('expedition_content.js'));
    const saveFiles = await import(src('save_files.js'));
    const backlog = await import(src('backlog_expansion_host.js'));
    const workPlan = await import(src('feature_expansion_work_plan.js'));
    const render = await import(src('simulation_render.js'));
    const loadErrors = [];
    const pick = async (file, name) => {
        try {
            const m = await import(src(file));
            if (typeof m[name] !== 'function') throw new Error(`${name} is not exported`);
            return m[name];
        } catch (e) { loadErrors.push(`${file}#${name}: ${e.message}`); return null; }
    };
    const hosts = {};
    for (const [k, [f, n]] of Object.entries(HOST_MODULES)) hosts[k] = await pick(f, n);
    const openers = {};
    for (const [k, [f, n, call]] of Object.entries(OPENER_MODULES)) {
        const fn = await pick(f, n);
        if (fn) openers[k] = (s, r, c) => call(fn, s, r, c);
    }
    // main.js persistExpansion's final publication guards: a plan they refuse is
    // never saved, so the harness treats it as a host rejection.
    const guards = [];
    for (const [f, n, call] of [
        ['backlog_expansion_host.js', 'assertBacklogPublication', (fn, prev, plan) => fn(prev.state, plan)],
        ['audit_remainder_facts.js', 'validateAuditRemainderNative', (fn, prev, plan) => fn(plan.state, plan.gameplay)],
        ['game_absorption_assay_facts.js', 'validateGameAbsorptionAssay', (fn, prev, plan, reg) => fn(plan.state, reg, plan)],
        ['feature_expansion_book_host.js', 'assertQualifiedOfficePlan', (fn, prev, plan, reg, ctx) => fn(prev.state, plan, {id: plan.backlogCommand}, ctx)],
    ]) { const fn = await pick(f, n); if (fn) guards.push({name: n, check: (prev, plan, reg, ctx) => call(fn, prev, plan, reg, ctx)}); }
    const layers = [];
    for (const [f, n, withRegistry] of CONTEXT_LAYERS) {
        const fn = await pick(f, n);
        if (fn) layers.push({name: n, fn, withRegistry});
    }
    return {engine, sim, registry: content.expeditionRegistry, saveFiles, backlog, workPlan, frame: render.withSimulationFrame, hosts, openers, layers, guards, loadErrors};
}

// ---------- seeded RNG (independent of the engine's own state.rng) ----------
export function rng(seed) {
    let a = (seed >>> 0) || 0x9e3779b9;
    const next = () => {a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;};
    return {next, int: n => Math.floor(next() * n), pick: arr => arr[Math.floor(next() * arr.length)], chance: p => next() < p};
}

// ---------- hashing ----------
function canonical(v) {
    if (Array.isArray(v)) return v.map(canonical);
    if (v !== null && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])]));
    return v;
}
export const durable = p => ({state: p.state, external: p.external, gameplay: p.gameplay});
export const hash = v => createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex').slice(0, 16);

// ---------- fixtures ----------
const fixtureCache = new Map();
export function readFixture(name) {
    if (!fixtureCache.has(name)) fixtureCache.set(name, fs.readFileSync(path.join(ROOT, 'tests/fixtures/perf', name + '.json'), 'utf8'));
    return JSON.parse(fixtureCache.get(name));
}

// Synthetic native snapshot from the save envelope: money, the player's and
// native NPCs' inventories, fixed vitals. Skills are left empty (no native
// skill registry in Node); facts mirror buildExpeditionContext's keys.
export function fixturePlan(E, name) {
    const save = readFixture(name);
    const state = E.engine.loadExpansionState(save.expansion, E.registry);
    const inv = owner => Object.fromEntries(Object.entries(save.inventories?.person?.[owner] || {})
        .map(([k, v]) => [k, v?.count ?? 0]).filter(([, c]) => Number.isSafeInteger(c) && c > 0));
    const gameplay = {player: {inventory: inv('main_character'), skills: {}, reputation: {...(save.character?.reputation || {})}}};
    for (const [id, p] of Object.entries(state.simulation?.people || {}))
        if (id !== 'player' && p.inventory === 'native') gameplay[id] = {inventory: inv(id), skills: {}, reputation: {}};
    const location = save['current location'] || 'Village';
    // Equipment keys use the native Item.createInventoryKey codec, as
    // validateBacklogEnvelope reads them, so context and envelope agree.
    const equipmentKey = item => JSON.stringify({...(item.components ? {components: item.components} : {id: item.id}), ...(item.quality ? {quality: item.quality} : {})});
    const equipment = {player: Object.fromEntries(Object.entries(save.character?.equipment || {}).filter(([, i]) => i).map(([slot, i]) => [slot, equipmentKey(i)]))};
    for (const [id, slots] of Object.entries(save.npc_equipment || {})) if (gameplay[id]) equipment[id] = Object.fromEntries(Object.entries(slots).filter(([, k]) => k));
    return {save, plan: {state, external: {money: save.character?.money ?? 0}, gameplay, equipment}, location};
}

const VITALS = Object.freeze({health: 60, max_health: 60, stamina: 40, max_stamina: 40});
const KIT = JSON.stringify({id: 'Prepared survey kit'}), ROPE = JSON.stringify({id: 'Survey rope'});
export function baseContext(E, plan, location, extra = {}) {
    const vitalsByActor = {player: {...VITALS}};
    for (const id of Object.keys(plan.gameplay)) vitalsByActor[id] ||= {...VITALS};
    const inv = plan.gameplay.player?.inventory || {};
    return {
        actorId: 'player', worldId: plan.state.actors.player.worldId, external: plan.external, gameplay: plan.gameplay,
        vitals: vitalsByActor, vitalsByActor, equipment: plan.equipment || {}, nativeAlive: true, nativeReady: true, busy: false, targetId: null,
        facts: {location, strength: 10, agility: 10, perception: 5, climbing: 0, 'day.hour': 9, calendarMinute: 9 * 60,
            'weather.raining': false, 'weather.damp': false, 'village.circleOpen': true, 'village.briefingActive': false,
            'village.elderMet': true, 'village.craftsmanMet': true, 'village.shackUnlocked': true, 'village.notesRead': false,
            'village.notesHeld': false, 'skill.Crafting': 1, 'skill.Cooking': 1, kits: inv[KIT] || 0, rope: inv[ROPE] || 0},
        ...extra,
    };
}

// Feature-wave context chain. A layer that throws is skipped and counted:
// that is a harness-coverage gap, not an engine defect.
export function fullContext(E, plan, location, layerErrors, extra = {}) {
    let ctx = baseContext(E, plan, location, extra);
    for (const L of E.layers) {
        try {
            const next = L.withRegistry ? L.fn(plan.state, E.registry, ctx) : L.fn(plan.state, ctx);
            if (next && typeof next === 'object') ctx = {...ctx, ...next, facts: {...ctx.facts, ...(next.facts || {})}};
        } catch (e) { if (layerErrors) layerErrors[L.name] = (layerErrors[L.name] || 0) + 1; }
    }
    return {...ctx, ...extra, external: plan.external, gameplay: plan.gameplay};
}

// ---------- catalog ----------
const HOST_FOR_GROUP = {
    steam_df: 'steam', steam_boh: 'steam', steam_oni: 'steam', steam_lamb: 'steam',
    contextual_balm: 'contextual_balm', cooling_refinement: 'cooling_refinement',
    world_completion_life: 'world_completion', world_completion_lens: 'world_completion',
    world_completion_learning: 'world_completion', world_completion_materials: 'world_completion',
    lore_work: 'lore_practice', lore_warning: 'lore_practice', book_care: 'book_care', book_care_npc: 'book_care',
    field_care: 'field_care', status_care: 'status_care', book_paradise_campaign: 'book_paradise_campaign',
    book_paradise: 'book_paradise', book_mol: 'book_mol', home_furnishings: 'home_furnishings', proto23: 'proto23',
    factorio_retort: 'factorio_retort', game_absorption_assay: 'game_absorption_assay', nethack_fieldcraft: 'nethack_fieldcraft',
    artifact_collection: 'artifact_collection', audit_remainder: 'audit_remainder', audit_fixture: 'audit_workshop',
    audit_lesson: 'audit_workshop', reference_gameplay: 'reference_gameplay', feature_objects: 'feature_objects',
    feature_society: 'feature_society', tidemark: 'tidemark', nested_campaign: 'nested_campaign', nested_life: 'nested_life',
    nested_chains: 'nested_chains', causal_story: 'causal_story', remainder_livelihood: 'remainder_livelihood',
    remainder_home: 'remainder_home', remainder_offers: 'remainder_offers', remainder_consequences: 'remainder_consequences',
    remainder_combat_fit: 'remainder_combat_fit', remainder_combat_objectives: 'remainder_combat_objectives',
    glasshouse: 'glasshouse', observation: 'observation', exchange: 'exchange', original_frontier: 'original_frontier',
    repositories: 'repositories', management: 'management', feature_powers: 'feature_powers',
};
// main.js passes these hosts a {type: <name>} command.
const HOST_TYPE = {world_completion: 'world_completion', lore_practice: 'lore_practice', audit_workshop: 'audit_workshop',
    book_paradise_campaign: 'book_paradise_campaign', feature_powers: 'feature_command', management: 'command'};

export function buildCatalog(E) {
    const r = E.registry, rows = [];
    for (const [id, d] of r.simulation.commands) {
        const host = HOST_FOR_GROUP[d.group];
        rows.push({key: 'sim:' + id, kind: 'sim', id, group: d.group || '(none)', worldId: d.worldId || null,
            actorId: d.actorId || null, targetId: d.targetId || null, route: host && E.hosts[host] ? 'host:' + host : 'engine',
            // Means drawn from the player's native inventory or purse only.
            hasCosts: (d.costs || []).some(c => (c.actor == null || c.actor === 'player') && c.amount < 0 &&
                (c.type === 'item' || (c.type === 'resource' && c.native === true)))});
    }
    for (const [id, a] of r.actions) rows.push({key: 'action:' + id, kind: 'action', id, group: 'engine_action', worldId: a.worldId || null, route: 'engine',
        hasCosts: (a.costs || []).some(c => c.type === 'item' || c.scope === 'external')});
    for (const [id] of r.simulation.transitions) rows.push({key: 'transition:' + id, kind: 'transition', id, group: 'campaign_transition', route: 'engine'});
    for (const [id] of r.simulation.advancements) rows.push({key: 'advancement:' + id, kind: 'advancement', id, group: 'power_advancement', route: 'engine'});
    for (const [id, enc] of r.simulation.encounters) for (const resp of responsesOf(enc))
        rows.push({key: `response:${id}:${resp}`, kind: 'response', id: resp, encounterId: id, group: 'encounter_response', route: 'engine'});
    for (const [id, ev] of r.simulation.events) for (const resp of (ev.responses || []).map(x => x.id).filter(Boolean))
        rows.push({key: `event:${id}:${resp}`, kind: 'event', id: resp, eventId: id, group: 'event_response', route: 'engine'});
    for (const a of E.backlog.backlogActions()) rows.push({key: 'backlog:' + a.id, kind: 'backlog', id: a.id, group: 'backlog', route: 'host:backlog'});
    for (const [id] of (r.workPlans?.definitions || r.workPlans || new Map())) rows.push({key: 'workplan:' + id, kind: 'workplan', id, group: 'work_plan', route: 'engine'});
    for (const k of Object.keys(E.openers)) rows.push({key: k, kind: 'opener', id: k.slice(5), group: 'opener', route: 'host:opener'});
    for (const k of ['cancel', 'program', 'pause', 'resume', 'withdraw']) rows.push({key: 'control:' + k, kind: 'control', id: k, group: 'control', route: 'engine'});
    return rows;
}
function responsesOf(enc) {
    const ids = new Set();
    for (const t of enc.turns || []) for (const r of t.responses || []) if (r.id) ids.add(r.id);
    for (const r of enc.responses || []) if (r.id) ids.add(r.id);
    return [...ids];
}

// ---------- invariants ----------
const NEG_OK = /(axes|delta|offset|trust|affinity|mood|attitude|relation|stance|balance|score|modifier|bias|drift)/i;
function scanNumbers(value, pathStr, out, limit = 8) {
    if (out.length >= limit) return;
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) out.push(`${pathStr}=${value}`);
        return;
    }
    if (value && typeof value === 'object') {
        if (Array.isArray(value)) { for (let i = 0; i < value.length; i++) scanNumbers(value[i], pathStr + '[' + i + ']', out, limit); return; }
        for (const k in value) scanNumbers(value[k], pathStr + '.' + k, out, limit);
    }
}
export function checkInvariants(E, prev, plan) {
    const fails = [];
    const s = plan.state, sim = s.simulation;
    try { E.engine.validateExpansionState(s, E.registry); } catch (e) { fails.push(['validate', e.message]); }
    const bad = [];
    scanNumbers(s, 'state', bad); scanNumbers(plan.external, 'external', bad); scanNumbers(plan.gameplay, 'gameplay', bad);
    if (bad.length) fails.push(['finite', bad.join(', ')]);
    const neg = [];
    for (const [k, v] of Object.entries(plan.external || {})) if (typeof v === 'number' && v < 0) neg.push(`external.${k}=${v}`);
    for (const [a, g] of Object.entries(plan.gameplay || {})) for (const [k, c] of Object.entries(g.inventory || {}))
        if (!(Number.isSafeInteger(c) && c >= 0)) neg.push(`gameplay.${a}.inventory[${k}]=${c}`);
    for (const [o, items] of Object.entries(sim?.owners || {})) for (const [k, c] of Object.entries(items || {}))
        if (!(Number.isSafeInteger(c) && c >= 0)) neg.push(`owners.${o}[${k}]=${c}`);
    for (const [a, actor] of Object.entries(s.actors || {})) for (const [k, v] of Object.entries(actor.resources || {}))
        if (typeof v === 'number' && v < 0 && !NEG_OK.test(k)) neg.push(`actors.${a}.resources.${k}=${v}`);
    if (neg.length) fails.push(['nonnegative', neg.slice(0, 6).join(', ')]);
    if (sim) {
        const cust = [];
        const people = sim.people || {};
        for (const o of Object.keys(sim.owners || {})) if (!people[o] && !E.registry.simulation.containers?.get?.(o) && !s.actors[o]) cust.push(`owner ${o} has no person`);
        const lent = {};
        for (const [cid, c] of Object.entries(sim.custody || {})) {
            if (!people[c.owner] || !people[c.holder]) cust.push(`custody ${cid} names a missing person`);
            const k = c.holder + '\u0000' + c.key; lent[k] = (lent[k] || 0) + c.count;
        }
        for (const [k, count] of Object.entries(lent)) {
            const [holder, key] = k.split('\u0000');
            const held = people[holder]?.inventory === 'native' ? plan.gameplay?.[holder]?.inventory?.[key] ?? 0 : sim.owners?.[holder]?.[key] ?? 0;
            if (held < count) cust.push(`${holder} holds ${held} of ${key} but has ${count} in custody`);
        }
        const jobIds = new Set();
        for (const j of sim.jobs || []) { if (jobIds.has(j.id)) cust.push(`duplicate job ${j.id}`); jobIds.add(j.id); }
        if (cust.length) fails.push(['custody', cust.slice(0, 6).join('; ')]);
    }
    if (prev) {
        if (s.clock < prev.state.clock) fails.push(['clock', `clock went ${prev.state.clock} -> ${s.clock}`]);
        if (s.sequence < prev.state.sequence) fails.push(['sequence', `sequence went ${prev.state.sequence} -> ${s.sequence}`]);
    }
    return fails;
}

// save -> stringify -> decode/validate -> load -> equal
export function roundTrip(E, plan, save) {
    // Publish the synthetic native snapshot into the envelope the way the
    // host would: money, player and native NPC bags (counts), full vitals.
    const inventories = structuredClone(save.inventories || {});
    const bag = (old = {}, counts = {}) => Object.fromEntries(Object.entries(counts).filter(([, c]) => c > 0).map(([k, c]) => [k, {...(old[k] || {}), count: c}]));
    inventories.person ||= {};
    inventories.person.main_character = bag(inventories.person.main_character, plan.gameplay.player?.inventory);
    for (const [id, g] of Object.entries(plan.gameplay)) if (id !== 'player') inventories.person[id] = bag(inventories.person[id], g.inventory);
    const envelope = {...save, expansion: plan.state, inventories,
        character: {...save.character, money: plan.external.money, hp_to_full: 0, stamina_to_full: 0}};
    const text = JSON.stringify(envelope);
    const encoded = E.saveFiles.encodeSaveFile(text);
    const decoded = E.saveFiles.decodeSaveFile(encoded, save['game version']);
    const loaded = E.engine.loadExpansionState(decoded.expansion, E.registry);
    const a = JSON.stringify(canonical(plan.state)), b = JSON.stringify(canonical(loaded));
    if (a !== b) {
        const da = JSON.parse(a), db = JSON.parse(b), diff = [];
        for (const k of new Set([...Object.keys(da), ...Object.keys(db)])) if (JSON.stringify(da[k]) !== JSON.stringify(db[k])) diff.push(k);
        return `round-trip changed state keys: ${diff.join(',')}`;
    }
    return null;
}

// ---------- step execution ----------
function seqOf(plan) { return plan.state.sequence; }
// The registry definitions are frozen; a returned plan must not alias them.
function normalizePlan(out, prev) {
    if (!out || !out.state) throw new Error('host returned no plan');
    // Equipment stays the fixture's: the harness has no native item registry to publish changes into.
    return {state: out.state, external: out.external || prev.external, gameplay: out.gameplay || prev.gameplay, equipment: prev.equipment};
}

export function previewEligible(E, plan, row, ctx) {
    const r = E.registry;
    try {
        if (row.kind === 'sim') {
            const d = r.simulation.commands.get(row.id);
            const c = {...ctx, targetId: d.targetId || ctx.targetId, ...(d.group === 'proto23' ? {proto23Host: true} : {})};
            if (!plan.state.simulation) return {eligible: false, reasons: ['not enrolled']};
            const q = E.sim.previewSimulationCommand(plan.state, r, row.id, c);
            return {eligible: !!(q.visible !== false && q.eligible), reasons: q.reasons || []};
        }
        if (row.kind === 'action') {
            const q = E.engine.evaluateAction(plan.state, r, row.id, ctx);
            return {eligible: !!(q.available ?? q.eligible ?? q.allowed), reasons: q.reasons || q.blockers || []};
        }
        if (row.kind === 'transition') {
            if (!plan.state.simulation) return {eligible: false, reasons: ['not enrolled']};
            const q = E.sim.previewCampaignTransition(plan.state, r, row.id, ctx);
            return {eligible: !!q.eligible, reasons: q.reasons || []};
        }
        if (row.kind === 'backlog') {
            const q = E.backlog.previewBacklogAction(plan.state, r, row.id, ctx);
            return {eligible: !!(q.visible && q.eligible), reasons: q.reasons || []};
        }
        if (row.kind === 'response') {
            const ses = plan.state.simulation?.sessions?.player;
            if (!ses || ses.definitionId !== row.encounterId) return {eligible: false, reasons: ['no open encounter']};
            const q = E.sim.previewSimulationResponse(plan.state, r, row.id, ctx);
            return {eligible: !!(q?.eligible ?? true), reasons: q?.reasons || []};
        }
        if (row.kind === 'event') {
            const ev = Object.values(plan.state.simulation?.events || {}).find(e => e.definitionId === row.eventId && e.status === 'open' && e.actorId === 'player');
            return {eligible: !!ev, reasons: ev ? [] : ['no open event']};
        }
        if (row.kind === 'control') {
            const s = plan.state.simulation;
            const ok = row.id === 'cancel' ? !!s?.jobs.some(j => j.actorId === 'player')
                : row.id === 'pause' ? !!s?.programs?.player && !s.programs.player.paused
                : row.id === 'resume' ? !!s?.programs?.player?.paused
                : row.id === 'withdraw' ? !!s?.sessions?.player : !!s;
            return {eligible: ok, reasons: ok ? [] : ['nothing to control']};
        }
        // opener, advancement, workplan: no separate preview; the commit decides.
        return {eligible: null, reasons: []};
    } catch (e) { return {eligible: false, reasons: ['preview threw: ' + e.message], threw: e.message}; }
}

export function commitRow(E, plan, row, ctx, opts = {}) {
    const r = E.registry, s = plan.state, seq = opts.sequence ?? s.sequence;
    if (row.kind === 'sim') {
        const d = r.simulation.commands.get(row.id);
        const c = {...ctx, targetId: opts.targetId !== undefined ? opts.targetId : (d.targetId || ctx.targetId)};
        if (!s.simulation && !opts.raw) throw new Error('not enrolled');
        const hostName = row.route.startsWith('host:') && !opts.engineOnly ? row.route.slice(5) : null;
        if (!hostName) return E.sim.commitSimulationCommand(s, r, {id: row.id}, c, seq);
        const fn = E.hosts[hostName], type = HOST_TYPE[hostName] || d.group;
        const cmd = {type, id: row.id, sequence: seq, ...(d.targetId ? {targetId: d.targetId} : {})};
        if (hostName === 'causal_story') {
            const q = E.hosts.causal_story_preview?.(s, r, row.id, c, cmd);
            if (q?.command?.token) cmd.token = q.command.token;
        }
        if (['tidemark', 'nested_campaign', 'glasshouse'].includes(hostName)) return fn(s, r, row.id, c, seq);
        if (hostName === 'feature_society' || hostName === 'nested_chains') return fn(s, r, {...cmd, type: 'command'}, c, seq);
        if (hostName === 'agreed_duty') return fn(s, r, c, row.id, seq);
        return fn(s, r, cmd, c, seq);
    }
    if (row.kind === 'action') return E.engine.commitAction(s, r, row.id, ctx, seq);
    if (row.kind === 'transition') return E.sim.commitCampaignTransition(s, r, row.id, ctx, seq);
    if (row.kind === 'advancement') return E.sim.advancePowerProgression(s, r, row.id, ctx, seq);
    if (row.kind === 'backlog') return E.backlog.commitBacklogAction(s, r, {id: row.id, sequence: seq}, ctx, seq,
        {advancePlan: (p, m) => advance(E, p, m, ctx)});
    if (row.kind === 'response') return E.sim.answerSimulationEncounter(s, r, row.id, ctx, seq);
    if (row.kind === 'event') {
        const ev = Object.values(s.simulation?.events || {}).find(e => e.definitionId === row.eventId && e.status === 'open' && e.actorId === 'player');
        return E.sim.respondSimulationEvent(s, r, ev?.id, row.id, ctx, seq);
    }
    if (row.kind === 'workplan') return E.workPlan.startWorkPlan(s, r, r.workPlans, row.id, ctx, seq);
    if (row.kind === 'opener') return E.openers[row.key](s, r, ctx);
    if (row.kind === 'control') {
        if (row.id === 'cancel') return E.sim.cancelSimulationJob(s, r, s.simulation?.jobs.find(j => j.actorId === 'player')?.id, ctx, seq);
        if (row.id === 'pause') return E.sim.pauseSimulationProgram(s, ctx, seq);
        if (row.id === 'resume') return E.sim.resumeSimulationProgram(s, r, ctx, seq);
        if (row.id === 'withdraw') return E.sim.withdrawSimulationEncounter(s, ctx, seq);
        if (row.id === 'program') {
            const auto = [...r.simulation.commands.values()].filter(d => d.automatable);
            const d = auto[(opts.pick ?? 0) % Math.max(1, auto.length)];
            return E.sim.setSimulationProgram(s, r, d?.id, 1 + ((opts.pick ?? 0) % 4), ctx, seq);
        }
    }
    throw new Error('unsupported row ' + row.key);
}

// Per-actor simulation contexts, shaped like main.js simulationNativeContexts:
// each native person gets its own vitals object, the player the full context.
export function simulationContexts(plan, ctx) {
    const out = {player: {...ctx, actorId: 'player', vitals: ctx.vitalsByActor?.player || VITALS}};
    for (const [id, p] of Object.entries(plan.state.simulation?.people || {}))
        if (id !== 'player' && p.inventory === 'native') out[id] = {actorId: id, worldId: plan.state.actors[id]?.worldId, facts: {}, equipment: {}, vitals: {...VITALS}};
    return out;
}
export function advance(E, plan, minutes, ctx) {
    return E.engine.advanceSimulation(plan.state, E.registry, minutes, plan.external, plan.gameplay, simulationContexts(plan, ctx));
}

// Cheap, fact-free reasons a row cannot run now. Never decides eligibility;
// only skips rows whose definition plainly belongs elsewhere.
export function staticCandidates(E, catalog, plan, ctx) {
    const s = plan.state, world = s.actors.player.worldId, loc = ctx.facts?.location;
    return catalog.filter(row => {
        if (row.kind === 'sim') {
            if (!s.simulation) return false;
            const d = E.registry.simulation.commands.get(row.id);
            if (d.actorId && d.actorId !== 'player') return false;
            if (d.worldId && d.worldId !== world) return false;
            if (d.location && d.location !== loc) return false;
            if (d.targetId && !s.simulation.people[d.targetId]) return false;
            return true;
        }
        if (row.kind === 'response') return s.simulation?.sessions?.player?.definitionId === row.encounterId;
        if (row.kind === 'event') return Object.values(s.simulation?.events || {}).some(e => e.definitionId === row.eventId && e.status === 'open');
        if (row.kind === 'transition' || row.kind === 'advancement' || row.kind === 'workplan') return !!s.simulation;
        return true;
    });
}

// Throws the first publication guard's refusal for this plan, if any.
export function publicationGate(E, prev, out, ctx) {
    const plan = {...out, equipment: out.equipment || prev.equipment || {}, vitals: out.vitals || ctx.vitalsByActor,
        gameplay: out.gameplay || prev.gameplay, external: out.external || prev.external};
    for (const g of E.guards) {
        try { g.check(prev, plan, E.registry, ctx); }
        catch (e) { throw new Error(`publication guard ${g.name}: ${e.message}`); }
    }
}

// ---------- the fuzz run ----------
export const POLICIES = ['random', 'greedy', 'adversarial'];
export const policyForSeed = seed => POLICIES[seed % 3];
export const fixtureForSeed = seed => FIXTURES[Math.floor(seed / 3) % 3];

export function runSeed(E, catalog, {seed, steps, policy = policyForSeed(seed), fixture = fixtureForSeed(seed),
    roundTripEvery = 50, splitEvery = 10, splitMax = 6, purityEvery = 4, sweep = 'ends', sample = 1, advanceP = 0.15, busyAdvanceP = 0.45, maxHop = 15, stopAt = null, trace = false} = {}) {
    const R = rng(seed);
    const {save, plan: start, location} = fixturePlan(E, fixture);
    let plan = start;
    const res = {seed, policy, fixture, steps: 0, eligible: new Set(), committed: new Set(), attempted: new Set(),
        rejected: {}, guarded: {}, previewThrew: {}, initialEligible: new Set(), failures: [], layerErrors: {}, adversarial: {tried: 0, rejected: 0, accepted: []},
        advances: 0, minutes: 0, roundTrips: 0, splitChecks: 0, commits: 0, events: [], timing: {}};
    const T = (k, f) => { const t = performance.now(); try { return f(); } finally { res.timing[k] = (res.timing[k] || 0) + performance.now() - t; } };
    const fail = (step, kind, detail, extra = {}) => {
        if (res.failures.length < 50) res.failures.push({seed, policy, fixture, step, kind, detail: String(detail).slice(0, 400), ...extra});
    };
    const counts = new Map();
    const ctxFor = (p, extra) => fullContext(E, p, location, res.layerErrors, extra);
    // Previews run inside a simulation frame over the unchanged state, so
    // simulationFacts builds are reused (src/simulation_render.js).
    const sweepAll = (p, ctx, into = null) => E.frame(p.state, () => {
        for (const row of catalog) {
            if (res.eligible.has(row.key) && !into) continue;
            const q = previewEligible(E, p, row, ctx);
            if (q.eligible) { res.eligible.add(row.key); into?.add(row.key); }
            if (q.threw) res.previewThrew[row.key] ||= q.threw.slice(0, 160);
        }
    });
    const accept = (step, prev, out, label) => {
        const next = normalizePlan(out, prev);
        for (const [k, d] of T('invariants', () => checkInvariants(E, prev, next))) fail(step, k, d, {action: label});
        if (roundTripEvery && step % roundTripEvery === 0) {
            res.roundTrips++;
            try { const msg = T('roundtrip', () => roundTrip(E, next, save)); if (msg) fail(step, 'roundtrip', msg, {action: label}); }
            catch (e) { fail(step, 'roundtrip', 'reload threw: ' + e.message, {action: label}); }
        }
        return next;
    };
    const pure = (step, before, beforeHash, label) => {
        if (beforeHash && T('purity', () => hash(durable(before))) !== beforeHash) fail(step, 'purity', 'call mutated its input plan', {action: label});
    };
    const hashIf = (step, p) => step % purityEvery === 0 ? T('purity', () => hash(durable(p))) : null;
    let ctxCache = null;
    for (let step = 1; step <= steps; step++) {
        if (stopAt && step > stopAt) break;
        res.steps = step;
        if (ctxCache?.state !== plan.state) ctxCache = {state: plan.state, ctx: T('context', () => ctxFor(plan))};
        const ctx = ctxCache.ctx;
        if (step === 1 && sweep !== 'none') T('sweep', () => sweepAll(plan, ctx, res.initialEligible));
        // Pick an action for this step.
        let mode = R.next();
        const busy = !!plan.state.simulation?.jobs?.some(j => j.actorId === 'player');
        if (policy === 'adversarial' && mode < 0.35) { T('adversarial', () => adversarialStep(E, catalog, plan, ctx, R, res, step, fail, pure)); continue; }
        if (mode < (busy ? busyAdvanceP : advanceP)) {
            // Advance. Split-vs-jump on a sample.
            // Mostly short hops: every simulated minute rebuilds simulationFacts
            // (see the report's perf note), so long jumps dominate run time.
            const due = E.sim.nextSimulationBoundary(plan.state);
            const toBoundary = Number.isSafeInteger(due) && due > plan.state.clock ? due - plan.state.clock : 1;
            const roll = R.next();
            const n = roll < 0.6 ? 1 : roll < 0.9 ? 2 + R.int(4) : Math.min(maxHop, toBoundary);
            const prev = plan, prevHash = hashIf(step, prev);
            let out;
            try { out = T('advance', () => advance(E, plan, n, ctx)); }
            catch (e) { fail(step, 'advance-threw', e.message, {action: `advance ${n}`}); continue; }
            pure(step, prev, prevHash, `advance ${n}`);
            try { T('guards', () => publicationGate(E, prev, out, ctx)); }
            catch (e) { res.guarded[`advance`] = (res.guarded.advance || 0) + 1; res.rejected['advance'] ||= e.message.slice(0, 160); continue; }
            if (splitEvery && step % splitEvery === 0 && n > 1 && n <= splitMax) {
                res.splitChecks++;
                try { T('split', () => {
                    let p = prev;
                    for (let i = 0; i < n; i++) { const o = advance(E, p, 1, ctx); p = {state: o.state, external: o.external, gameplay: o.gameplay}; }
                    const a = hash(durable({state: out.state, external: out.external, gameplay: out.gameplay})), b = hash(durable(p));
                    if (a !== b) fail(step, 'split-jump', `advance ${n} != ${n} x advance 1 (clock ${out.state.clock} vs ${p.state.clock}, seq ${out.state.sequence} vs ${p.state.sequence}, rng ${out.state.rng} vs ${p.state.rng})`, {action: `advance ${n}`, minutes: n});
                }); } catch (e) { fail(step, 'split-jump', 'split advance threw: ' + e.message, {action: `advance ${n}`}); }
            }
            plan = accept(step, prev, out, `advance ${n}`);
            res.advances++; res.minutes += plan.state.clock - prev.state.clock;
            continue;
        }
        // Command: preview a sample, pick by policy.
        // Static prefilter (actor, world, location, enrollment) before the real
        // previews, which each rebuild simulationFacts.
        const pool = [];
        const cands = T('prefilter', () => staticCandidates(E, catalog, plan, ctx));
        const sampled = [];
        for (let i = 0; i < sample && cands.length; i++) sampled.push(cands[R.int(cands.length)]);
        if (policy === 'greedy') {
            // Novelty first: an untried opener, else an eligible-but-uncommitted row.
            const openers = cands.filter(r => r.kind === 'opener' && !res.attempted.has(r.key));
            const fresh = cands.filter(r => res.eligible.has(r.key) && !res.committed.has(r.key));
            const untried = cands.filter(r => !res.attempted.has(r.key));
            const prefer = openers.length ? openers : fresh.length && R.chance(0.6) ? fresh : untried;
            if (prefer.length) sampled[0] = prefer[R.int(prefer.length)];
        }
        T('preview', () => E.frame(plan.state, () => {
            for (const row of sampled) {
                if (!row) continue;
                const q = previewEligible(E, plan, row, ctx);
                if (q.eligible) { res.eligible.add(row.key); pool.push(row); }
                else if (q.eligible === null) pool.push(row);
                if (q.threw) res.previewThrew[row.key] ||= q.threw.slice(0, 160);
            }
        }));
        if (!pool.length) continue;
        let row;
        if (policy === 'greedy') {
            pool.sort((a, b) => (counts.get(a.key) || 0) - (counts.get(b.key) || 0) || (a.kind === 'opener' ? -1 : 0));
            row = pool[0];
        } else row = R.pick(pool);
        res.attempted.add(row.key);
        const prev = plan, prevHash = hashIf(step, prev);
        let out;
        try { out = T('commit', () => commitRow(E, plan, row, {...ctx, targetId: row.targetId || null}, {pick: R.int(1000)})); }
        catch (e) {
            pure(step, prev, prevHash, row.key);
            res.rejected[row.key] = e.message.slice(0, 160);
            continue;
        }
        pure(step, prev, prevHash, row.key);
        try { T('guards', () => publicationGate(E, prev, out, ctx)); }
        catch (e) { res.guarded[row.key] = (res.guarded[row.key] || 0) + 1; res.rejected[row.key] = e.message.slice(0, 160); continue; }
        try { plan = accept(step, prev, out, row.key); }
        catch (e) { fail(step, 'plan-shape', e.message, {action: row.key}); continue; }
        res.committed.add(row.key); res.commits++;
        counts.set(row.key, (counts.get(row.key) || 0) + 1);
        if (trace) res.events.push(`${step} ${row.key} clock=${plan.state.clock} seq=${plan.state.sequence}`);
    }
    // Every run ends with a round-trip of its final state.
    if (roundTripEvery) {
        res.roundTrips++;
        try { const msg = T('roundtrip', () => roundTrip(E, plan, save)); if (msg) fail(res.steps, 'roundtrip', msg, {action: 'final state'}); }
        catch (e) { fail(res.steps, 'roundtrip', 'reload threw: ' + e.message, {action: 'final state'}); }
    }
    if (sweep === 'ends') { const ctx = ctxFor(plan); T('sweep', () => sweepAll(plan, ctx)); }
    res.finalHash = hash(durable(plan));
    res.finalClock = plan.state.clock;
    res.finalSequence = plan.state.sequence;
    return res;
}

// Adversarial: each probe must be rejected and must leave the input unchanged.
function adversarialStep(E, catalog, plan, ctx, R, res, step, fail, pure) {
    const kind = R.pick(['stale', 'actor', 'means', 'unknown', 'minutes']);
    const sims = catalog.filter(r => r.kind === 'sim');
    let row = null;
    const costly = kind === 'means' ? sims.filter(r => r.hasCosts) : sims;
    E.frame(plan.state, () => {
        for (let i = 0; i < 12 && !row; i++) {
            const cand = R.pick(costly);
            const q = previewEligible(E, plan, cand, ctx);
            if (q.eligible) { res.eligible.add(cand.key); row = cand; }
        }
    });
    const before = plan, h = hash(durable(before));
    const label = `adversarial:${kind}${row ? ':' + row.key : ''}`;
    let accepted = false, err = null;
    res.adversarial.tried++;
    try {
        if (kind === 'minutes') {
            const bad = R.pick([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]);
            advance(E, plan, bad, ctx);
            accepted = true; err = `advanceSimulation accepted minutes=${bad}`;
        } else if (kind === 'unknown') {
            E.sim.commitSimulationCommand(plan.state, E.registry, {id: 'simfuzz.no_such_command'}, ctx, plan.state.sequence);
            accepted = true; err = 'unknown command id accepted';
        } else if (!row) { res.adversarial.tried--; return; }
        else if (kind === 'stale') {
            commitRow(E, plan, row, ctx, {sequence: plan.state.sequence - 1});
            accepted = true; err = `stale sequence ${plan.state.sequence - 1} (current ${plan.state.sequence}) accepted`;
        } else if (kind === 'actor') {
            const d = E.registry.simulation.commands.get(row.id);
            const others = Object.keys(plan.state.simulation?.people || {}).filter(id => id !== (d.actorId || 'player'));
            const actorId = others.length && R.chance(0.7) ? R.pick(others) : 'simfuzz.ghost';
            commitRow(E, plan, row, {...ctx, actorId}, {engineOnly: true});
            // A command without a declared actor may legally run for any actor that exists.
            if (d.actorId || actorId === 'simfuzz.ghost') { accepted = true; err = `command declared for ${d.actorId || 'player'} accepted for actor ${actorId}`; }
        } else if (kind === 'means') {
            const poor = {state: plan.state, external: {...plan.external, money: 0},
                gameplay: Object.fromEntries(Object.entries(plan.gameplay).map(([id, g]) => [id, {...g, inventory: {}}]))};
            const c = {...ctx, external: poor.external, gameplay: poor.gameplay};
            commitRow(E, poor, row, c, {engineOnly: true});
            accepted = true; err = 'command with item/money costs accepted with zero money and empty inventories';
        }
    } catch (e) { /* expected rejection */ }
    pure(step, before, h, label);
    if (accepted) { res.adversarial.accepted.push({step, kind, row: row?.key || null}); fail(step, 'adversarial-' + kind, err, {action: label}); }
    else res.adversarial.rejected++;
}

export function summarize(res) {
    return {...res, eligible: [...res.eligible], committed: [...res.committed], attempted: [...res.attempted], initialEligible: [...res.initialEligible]};
}
