// Original proposal inspired by Proto23 disassembly/portable-tool mechanisms.
// No foreign code/assets. Native owners retain clock, custody and publication.
import {check, object as record} from '../../basics.js';
import {validateGameplaySnapshot, validateItemKey, applyGameplayEffect} from '../../gameplay_transactions.js';
import {stageAcquisition} from '../../acquisition.js';
import {assertNativeItemDisposition, nativeActionReasons} from '../../native_gameplay_adapter.js';
import {validateExpansionState} from '../../expansion_engine.js';
import {canonicalDurabilityKey} from '../../absorb_e2/durability.js';

const key = id => JSON.stringify({id});
export const SALVAGE = Object.freeze({salvage: 'p23.salvage.vest', craft: 'p23.salvage.survey_kit',
    tool: 'Portable leatherworking kit', material: key('Piece of wolf leather'), log: key('Rough wood log'),
    output: key('Prepared survey kit'), minimumQuality: 60, skill: 'Crafting', duration: 1});
export const salvageItemSpecifications = Object.freeze([{id: SALVAGE.tool, value: 30,
    description: 'A portable blade and awl for reclaiming leather. Needs quality 60 or better and a usable condition.',
    quality: 100, equip_slot: 'sickle'}]);
const stableCopy = k => {validateItemKey(k); const id = JSON.parse(k).e2_instance; return /^e2\.[1-9]\d*$/.test(id || '') && Number.isSafeInteger(Number(id.slice(3)));};

// Optional save domain: absence grants no knowledge and changes no old inventory.
// Validate fully before returning a clone, never repair malformed input in place.
export function loadSalvage(value) {
    if (value === undefined) return {schema: 1, learned: false, receipts: {}};
    check(record(value) && Object.keys(value).length===3 && value.schema === 1 && typeof value.learned === 'boolean' && record(value.receipts), 'Unsupported salvage save.');
    for (const [id, r] of Object.entries(value.receipts)) {
        check(/^p23\.salvage:[1-9]\d*$/.test(id) && record(r) && Object.keys(r).length===10 && r.id === id &&
            [SALVAGE.salvage, SALVAGE.craft].includes(r.recipe) && Number.isSafeInteger(r.sequence) && r.sequence > 0 &&
            id === `p23.salvage:${r.sequence}` && Number.isSafeInteger(r.at) && r.at >= 0 &&
            stableCopy(r.consumedKey) && typeof r.toolKey === 'string' && Number.isFinite(r.condition) && r.condition >= 0 && r.condition <= 100 &&
            Number.isSafeInteger(r.outputCount) && r.outputCount >= 1 && r.outputCount <= 4 &&
            r.outputKey === (r.recipe === SALVAGE.salvage ? SALVAGE.material : SALVAGE.output) &&
            (r.recipe !== SALVAGE.craft || r.outputCount === 1) && JSON.parse(r.consumedKey).id === 'Leather vest' &&
            r.xp === (r.recipe === SALVAGE.salvage ? 2 : 3), 'Invalid salvage receipt.');
        validateItemKey(r.toolKey); check(JSON.parse(r.toolKey).id === SALVAGE.tool, 'Invalid salvage tool receipt.');
    }
    check(value.learned || Object.keys(value.receipts).length === 0, 'Salvage receipt requires learned recipe.');
    return structuredClone(value);
}

function preflight(c) {
    validateExpansionState(c.state); validateGameplaySnapshot(c.gameplay);
    check(c.state.actors.player.worldId === 'base.frontier' && c.location === 'Village', 'Use the Village workbench.');
    const reasons = nativeActionReasons(c.state); check(!reasons.length, reasons.join(' '));
    check(typeof c.getItem === 'function' && c.durability?.condition && c.durability?.serialize, 'Bind native item and condition owners.');
    return loadSalvage(c.saved);
}
function permitted(c, k) {
    assertNativeItemDisposition(c.state, k);
    assertNativeItemDisposition(c.state, canonicalDurabilityKey(k));
}
function condition(c, k) {
    const n = c.durability.condition(k);
    check(Number.isFinite(n) && n >= 0 && n <= 100, 'Invalid native condition.');
    return n;
}
function ingredient(c, k) {
    check(stableCopy(k), 'Choose an identified leather vest copy.');
    check(c.gameplay.player.inventory[k] === 1 && !Object.values(c.equipment?.player || {}).includes(k), 'Choose one carried, unequipped copy.');
    permitted(c, k);
    check(c.getItem(k)?.id === 'Leather vest', 'This recipe needs a leather vest.');
    return condition(c, k);
}
export function wornSalvageChoices(c) {
    preflight(c);
    return Object.keys(c.gameplay.player.inventory).flatMap(k => {
        try {return [{key: k, condition: ingredient(c, k)}];} catch {return [];}
    }).sort((a, b) => a.condition - b.condition || a.key.localeCompare(b.key));
}

// Preview and commit share every guard, including held tool and native custody.
export function quoteSalvage(c, request) {
    const saved = preflight(c);
    check(Number.isFinite(c.money) && c.money >= 0, 'Invalid native purse.');
    check(request && request.sequence === c.state.sequence, 'Stale craft request. Refresh the recipe.');
    check([SALVAGE.salvage, SALVAGE.craft].includes(request.recipe), 'Unknown salvage recipe.');
    if (request.recipe === SALVAGE.craft) check(saved.learned, 'Salvage one leather vest to learn this recipe.');
    const wear = ingredient(c, request.itemKey);
    validateItemKey(request.toolKey);
    check(request.toolKey !== request.itemKey && (c.gameplay.player.inventory[request.toolKey] > 0 ||
        Object.values(c.equipment?.player || {}).includes(request.toolKey)), 'Carry a portable leatherworking kit.');
    permitted(c, request.toolKey);
    const tool = c.getItem(request.toolKey);
    check(tool?.id === SALVAGE.tool && Number.isFinite(tool.quality) && tool.quality >= SALVAGE.minimumQuality &&
        condition(c, request.toolKey) > 0, 'A usable portable leatherworking kit of quality 60 is required.');
    const skill = c.gameplay.player.skills[SALVAGE.skill];
    check(skill?.enabled && Number.isFinite(c.skillLevel) && c.skillLevel >= 0, 'Crafting must be available.');
    if (request.recipe === SALVAGE.craft) {
        check(c.gameplay.player.inventory[SALVAGE.log] >= 1, 'Bring one rough wood log.'); permitted(c, SALVAGE.log);
    }
    const quote = {recipe: request.recipe, sequence: c.state.sequence, consumedKey: request.itemKey,
        toolKey: request.toolKey, condition: wear, toolQuality: tool.quality, skillLevel: c.skillLevel,
        outputKey: request.recipe === SALVAGE.salvage ? SALVAGE.material : SALVAGE.output,
        outputCount: request.recipe === SALVAGE.salvage ? Math.min(4, 1 + Math.floor(wear / 50) + Math.min(1, Math.floor(c.skillLevel / 10))) : 1,
        xp: request.recipe === SALVAGE.salvage ? 2 : 3, duration: SALVAGE.duration};
    return {...quote, token: JSON.stringify(quote)};
}

// Pure staged plan for persistExpansionPlan, not a live inventory mutation.
// P00 publishes saved state and availability only after durable persistence.
export function stageSalvage(c, request) {
    const quote = quoteSalvage(c, request);
    check(request.token === quote.token, 'Craft preview changed. Refresh the recipe.');
    const saved = loadSalvage(c.saved), next = structuredClone(c.state), gameplay = structuredClone(c.gameplay);
    check(next.sequence < Number.MAX_SAFE_INTEGER, 'Craft sequence exhausted.');
    next.sequence++;
    const id = `p23.salvage:${next.sequence}`;
    check(!Object.hasOwn(saved.receipts, id), 'This craft event is already settled.');
    const consumes = [{owner: 'player', key: quote.consumedKey, count: 1}];
    if (quote.recipe === SALVAGE.craft) consumes.push({owner: 'player', key: SALVAGE.log, count: 1});
    const acquisitions = [{key: quote.outputKey, count: quote.outputCount}];
    gameplay.player.inventory = stageAcquisition({player: gameplay.player.inventory}, {consumes,
        grants: acquisitions.map(r => ({owner: 'player', ...r}))}).player;
    const nativeXP=c.nativeXP ?? quote.xp;
    check(Number.isFinite(nativeXP)&&nativeXP>=0,'Invalid native salvage XP quote.');
    if(nativeXP)applyGameplayEffect(gameplay, {type: 'xp', skill: SALVAGE.skill, amount: nativeXP}, 'player');
    const receipt = {id, recipe: quote.recipe, sequence: next.sequence, at: next.clock,
        consumedKey: quote.consumedKey, toolKey: quote.toolKey, condition: quote.condition,
        outputKey: quote.outputKey, outputCount: quote.outputCount, xp: quote.xp};
    saved.receipts[id] = receipt; saved.learned = true;
    const durability = c.durability.serialize(); delete durability.condition[quote.consumedKey];
    loadSalvage(saved); validateExpansionState(next); validateGameplaySnapshot(gameplay);
    return {state: next, gameplay, external: {money: c.money},
        nativePatch: {p23_salvage: saved, equipment_durability: durability}, acquisitions,
        receipt, learnedRecipe: SALVAGE.craft, duration: quote.duration};
}
