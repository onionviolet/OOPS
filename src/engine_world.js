// The engine world (P1.7, PC95): one headless world that composes the substrate
// from a registered pack list and owns it. Every pack runs on one clock in one
// set of holders, with no code written for a pair of packs (PFP10).
//
// This file holds no world numbers and names no world. A pack's law values
// arrive as `settings[packId]` from the caller (PFP3); `shared` adds vocabulary
// the caller's holders carry that no loaded pack declares.
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, restoreWorld, serializeWorld} from './world_substrate.js';
import {createSkyPack} from './world_sky.js';
import {createBrewSteamPack} from './world_substrate_packs/brew_steam.js';
import {createShellRegulatorPack} from './world_substrate_packs/shell_regulator.js';
import {createGuBrewRegulatorPack} from './world_substrate_packs/gu_brew_regulator.js';
import {createResidueFlowPack} from './world_substrate_packs/residue_flow.js';
import {createBodyAlterationPack} from './world_substrate_packs/body_alteration.js';
import {createLivingBodyPack} from './world_substrate_packs/living_body.js';
import {createLivingResiduePack} from './world_substrate_packs/living_residue.js';
import {createForageAttractionPack} from './world_substrate_packs/forage_attraction.js';
import {createColonyLightPack} from './world_substrate_packs/colony_light.js';
import {createWildAgencyPack} from './agency_wild.js';
import {contestPack} from './contest_bodies.js';
import {createMindPack} from './world_substrate_packs/mind.js';
import {createWorkingEndPack} from './world_substrate_packs/working_end.js';
import {createPresencePack} from './world_substrate_packs/presence.js';
import {createMarketPack} from './market_substrate.js';
import {createKnowledgePack} from './world_substrate_packs/knowledge.js';
import {advanceRecords, emptyRecords, hostOf, recordsEmpty, restoreRecords, serializeRecords,
    DEFAULT_DRAW_ROOT, drawAt, drawsOf, packDraw, restoreDraws} from './engine_records.js';

// The records slice and its engine actions (E9): kernel workings in flight, stored workings and bindings.
export {RECORDS_SCHEMA, engineReceipts, exitEngineBinding, fireEngineStored, makeEngineBinding, startEngineWorking,
    storeEngineWorking, waitingWorkings} from './engine_records.js';

// The saved draw root (E11).
export {DRAWS_SCHEMA, DEFAULT_DRAW_ROOT} from './engine_records.js';

export const ENGINE_SCHEMA = 'engine.world@1';

// Registry order is the settlement order (sky first, so a day read sees today).
const pack = (id, create) => Object.freeze({id, domain: id.split('.')[0], create});
export const ENGINE_PACKS = Object.freeze([
    pack('w.sky', createSkyPack),
    pack('b.brew_steam', createBrewSteamPack),
    pack('l.shell_regulator', createShellRegulatorPack),
    pack('g.brew_regulator', createGuBrewRegulatorPack),
    pack('w.residue_flow', createResidueFlowPack),
    pack('l.living_body', createLivingBodyPack),
    pack('l.body_alteration', createBodyAlterationPack),
    pack('l.living_residue', createLivingResiduePack),
    pack('l.colony_light', createColonyLightPack),
    pack('l.forage_attraction', createForageAttractionPack),
    pack('a.mind', createMindPack),
    pack('a.wild_agency', createWildAgencyPack),
    pack('c.contest', contestPack),
    pack('m.market', createMarketPack),
    pack('k.working_end', createWorkingEndPack),
    pack('n.presence', createPresencePack),
    pack('n.knowledge', createKnowledgePack),
]);

const fail = message => { throw new Error(`Engine world: ${message}`); };

// `ownPacks` (E11, proposal) are packs the caller brings: a world's own law or a fixture's. Like settings
// they are the caller's, are passed again on restore, and settle after the registered packs in the order given.
function compose({ownPacks = [], packs = [...ENGINE_PACKS, ...ownPacks].map(p => p.id), settings = {}, shared = {}, dials = {}, host}, draws) {
    if (new Set(packs).size !== packs.length) fail('a pack is listed twice.');
    const known = [...ENGINE_PACKS, ...ownPacks.map(made => ({id: made.id, create: () => made}))];
    for (const id of packs) if (!known.some(p => p.id === id)) fail(`${id} is not a registered pack.`);
    const loaded = known.filter(p => packs.includes(p.id)).map(entry => {
        const made = entry.create(settings[entry.id]);
        if (made.id !== entry.id) fail(`registry id ${entry.id} made pack ${made.id}.`);
        return made;
    });
    const rules = composeSubstrate({packs: loaded, dials, quantities: shared.quantities ?? [],
        properties: shared.properties ?? [], effectKinds: shared.effectKinds ?? [], draw: packDraw(draws)});
    return {rules, publishes: Object.fromEntries(loaded.map(p => [p.id, [...(p.publishes ?? [])]])), host: hostOf(host)};
}

/** `settings` is keyed by pack id; `packs` defaults to every registered pack. `host` is what the
 * records slice needs from the caller and cannot save: laws, things, costs, effects, ports. */
export function createEngineWorld({clock = 0, holders = [], lawFields = [], drawRoot, ...config} = {}) {
    const draws = drawsOf(drawRoot);
    const {rules, publishes, host} = compose(config, draws);
    return {rules, publishes, host, draws, world: createWorld(rules, {clock, holders, lawFields}), records: emptyRecords()};
}

/** E11: a raw draw at an address under this world's saved root (an unsigned whole number of four bytes).
 * `engine.draws.root` is the root itself, for owners that take a root and an id (heredity). */
export const engineDraw = (engine, ...parts) => drawAt(engine.draws, ...parts);

/** The packs and the records advance on one clock; the order at each stop is stated in engine_records.js. */
export function advanceEngineWorld(engine, toClock) {
    if (recordsEmpty(engine.records)) {
        const {world, segments, pending} = advanceWorld(engine.rules, engine.world, toClock);
        return {engine: {...engine, world}, segments, pending};
    }
    return advanceRecords(engine, toClock);
}

export function applyEngineOps(engine, ops, cause) {
    return {...engine, world: applyWorldOps(engine.rules, engine.world, ops, cause)};
}

/** Plain JSON. The pack list is saved; settings and the host are the caller's and are not.
 * `records` is written when the slice holds something, so a world with no records saves as it did before. */
export function serializeEngineWorld(engine) {
    return {schema: ENGINE_SCHEMA, packs: [...engine.rules.packs], world: serializeWorld(engine.world),
        ...(recordsEmpty(engine.records) ? {} : {records: serializeRecords(engine.records)}),
        // E11: the default root is not written, so a world that never chose a root saves as it did before.
        ...(engine.draws.root === DEFAULT_DRAW_ROOT ? {} : {draws: {...engine.draws}})};
}

export function restoreEngineWorld(saved, config = {}) {
    if (saved?.schema !== ENGINE_SCHEMA || !Array.isArray(saved.packs)) fail('not an engine world save.');
    // Compatibility (E11): a save with no `draws` (every save before E11) restores with the default root.
    const draws = restoreDraws(saved.draws);
    const {rules, publishes, host} = compose({...config, packs: saved.packs}, draws);
    // Compatibility: a save with no `records` (every save before E9) restores with an empty slice.
    return {rules, publishes, host, draws, world: restoreWorld(rules, saved.world), records: restoreRecords(saved.records, host)};
}

/**
 * Couplings between two packs that this world's own records show happened:
 *   effect:   a pack published a kind and another pack's reactor answered it (cause chain);
 *   quantity: two or more packs credited one quantity on one holder (provenance ledger).
 * A pack reading a quantity leaves no record, so read-only couplings are not listed.
 * Rows trimmed from the chain by its cap are not seen; size `dials.chainCap` for the run.
 */
export function exercisedCouplings(engine) {
    const {world, rules, publishes} = engine;
    const ids = rules.packs;
    const domainOf = id => id.split('.')[0];
    const owner = text => ids.find(id => text === id || text.startsWith(id + ':')) ?? null;
    const rowBySeq = new Map(world.chain.map(row => [row.seq, row]));
    // Who published a chain row: the law named in its cause, or the reacting packs of its parent row.
    const publishers = row => {
        if (typeof row.cause === 'string') return [owner(row.cause)].filter(Boolean);
        const reacted = [...new Set((rowBySeq.get(row.cause)?.reactions ?? []).map(owner).filter(Boolean))];
        const declared = reacted.filter(id => publishes[id].includes(row.kind));
        return declared.length ? declared : reacted;
    };
    const found = new Map();
    const note = (kind, name, packs) => {
        const key = `${kind} ${name}: ${packs.join(kind === 'effect' ? ' -> ' : ' + ')}`;
        found.set(key, {kind, name, packs, crossDomain: new Set(packs.map(domainOf)).size > 1, text: key});
    };
    for (const row of world.chain) for (const reaction of row.reactions) {
        const to = owner(reaction);
        for (const from of publishers(row)) if (from !== to) note('effect', row.kind, [from, to]);
    }
    for (const holder of Object.values(world.holders)) for (const [quantity, ledger] of Object.entries(holder.ledger)) {
        const writers = new Set();
        for (const source of Object.keys(ledger)) {
            const direct = owner(source);
            if (direct) { writers.add(direct); continue; }
            for (const row of world.chain) {
                if (row.place === holder.id && row.quantity === quantity && source === `effect:${row.kind}:${row.by}`)
                    for (const id of publishers(row)) writers.add(id);
            }
        }
        if (writers.size > 1) note('quantity', quantity, [...writers].sort());
    }
    return [...found.values()].sort((a, b) => a.text < b.text ? -1 : a.text > b.text ? 1 : 0);
}
