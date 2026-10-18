// Original bounded Proto23-inspired proposal. No timers, inventory or save owner.
const INSTANCE = 'e2_instance';
const MAX = 100;
const originalMethods = new WeakMap();
const own = (object, key) => Object.hasOwn(object, key);
const record = value => value && typeof value === 'object' && !Array.isArray(value);
const identity = key => {
    const data = JSON.parse(key);
    return typeof data[INSTANCE] === 'string' && /^e2\.[1-9]\d*$/.test(data[INSTANCE]) && Number.isSafeInteger(Number(data[INSTANCE].slice(3))) ? data[INSTANCE] : null;
};
export function canonicalDurabilityKey(key) {
    const data = JSON.parse(key);
    delete data[INSTANCE];
    return JSON.stringify(data);
}
// wearPerUse: condition lost per completed work cycle by tool verb (IP2 proposal, 2026-10-17).
export const DURABILITY_PROPOSAL = Object.freeze({maximum: MAX, wearPerHit: 0.04, fullRepairCoins: 5,
    wearPerUse: Object.freeze({mine: 1, chop: 1, dig: 0.8, cut: 0.5, fish: 0.4})});
// The tools domain owns per-instance max condition (lost to failed hand repairs).
// Durability still owns the one condition value and reads the cap here.
let capOf = () => MAX;
export function setConditionCap(lookup) { capOf = typeof lookup === 'function' ? lookup : () => MAX; }
const cap = key => Math.max(0, Math.min(MAX, Number(capOf(key)) || 0));

export function createDurability(initial) {
    let state;
    const bound = new WeakSet();
    const api = {
        load(value) {
            if (value?.schema != null && value.schema !== 1) throw new Error('Unsupported equipment durability schema.');
            state = {schema: 1, enabled: value?.enabled === true, nextId: 1, condition: {}};
            if (record(value?.condition)) for (const [key, condition] of Object.entries(value.condition)) {
                if (!identity(key) || typeof condition !== 'number' || !Number.isFinite(condition)) throw new Error('Invalid equipment durability record.');
                state.condition[key] = Math.max(0, Math.min(MAX, condition));
                state.nextId = Math.max(state.nextId, Number(identity(key).slice(3)) + 1);
            }
            if (Number.isSafeInteger(value?.nextId) && value.nextId > 0) state.nextId = Math.max(state.nextId, value.nextId);
            return api;
        },
        serialize: () => structuredClone(state),
        get enabled() { return state.enabled; },
        setEnabled(enabled) { state.enabled = enabled === true; },
        condition(itemOrKey) {
            const key = typeof itemOrKey === 'string' ? itemOrKey : itemOrKey.getInventoryKey();
            return own(state.condition, key) ? state.condition[key] : MAX;
        },
        factor(item, floor = 0.1) { return state.enabled ? floor + (1 - floor) * api.condition(item) / MAX : 1; },
        // Call on *all* getItemFromKey results. Native canonical data stays intact.
        bindFromKey(key, item) {
            if (!item?.tags?.equippable) return item;
            const id = identity(key);
            if (id) {
                item.inventory_key = key;
            }
            if (!bound.has(item)) {
                for (const [method, floor] of [['getAttack', 0.1], ['getDefense', 0.15], ['getShieldStrength', 0.15]]) {
                    if (typeof item[method] === 'function') {
                        let originals = originalMethods.get(item);
                        if (!originals) { originals = {}; originalMethods.set(item, originals); }
                        const base = originals[method] ||= item[method];
                        item[method] = function (...args) { return base.apply(this, args) * api.factor(this, floor); };
                    }
                }
                bound.add(item);
            }
            return item;
        },
        // Clone BEFORE giving identity: native equip may leave identical copies
        // sharing the inventory's original item object. Never mutate that object.
        prepareEquip(item, getItemFromKey, {requireIdentity = false} = {}) {
            if (!item?.tags?.equippable || (!state.enabled && !requireIdentity)) return item;
            const key = item.getInventoryKey();
            if (identity(key)) {
                state.nextId = Math.max(state.nextId, Number(identity(key).slice(3)) + 1);
                if (!own(state.condition, key)) state.condition[key] = MAX;
                return api.bindFromKey(key, item);
            }
            const copy = getItemFromKey(key);
            const data = JSON.parse(key);
            if (!Number.isSafeInteger(state.nextId) || state.nextId >= Number.MAX_SAFE_INTEGER) throw new Error('Equipment instance IDs exhausted.');
            data[INSTANCE] = `e2.${state.nextId++}`;
            const instanceKey = JSON.stringify(data);
            state.condition[instanceKey] = MAX;
            return api.bindFromKey(instanceKey, copy);
        },
        activateEquipment(actor, getItemFromKey) {
            if (!state.enabled) return;
            const equipment = actor.getEquipment();
            for (const [slot, item] of Object.entries(equipment)) if (item) equipment[slot] = api.prepareEquip(item, getItemFromKey);
        },
        // After the native equipment migration/loader; old saves remain native.
        restoreEquipment(actor, savedSlots, getItemFromKey) {
            const equipment = actor.getEquipment();
            for (const [slot, saved] of Object.entries(savedSlots || {})) {
                const key = typeof saved === 'string' ? saved : saved?.inventory_key;
                if (!key || !identity(key) || !equipment[slot]) continue;
                const item = getItemFromKey(key);
                if (item.equip_slot !== slot) throw new Error('Durability equipment slot mismatch.');
                equipment[slot] = api.bindFromKey(key, item);
            }
            // Explicit hydration after native loading, never factory decoding:
            // transaction preparation must not mutate the live ledger.
            for (const item of [...Object.values(equipment), ...Object.values(actor.getItems()).map(entry => entry.item)]) if (item) {
                const key = item.getInventoryKey(), id = identity(key);
                if (!id) continue;
                state.nextId = Math.max(state.nextId, Number(id.slice(3)) + 1);
                if (!own(state.condition, key)) state.condition[key] = MAX;
            }
        },
        wearItem(item, hits = 1) {
            if (!state.enabled || !item?.tags?.equippable || !identity(item.getInventoryKey())) return false;
            if (!Number.isSafeInteger(hits) || hits < 0) throw new Error('Invalid equipment use count.');
            const key = item.getInventoryKey();
            const before = api.condition(key);
            state.condition[key] = Math.max(0, Math.round((before - hits * DURABILITY_PROPOSAL.wearPerHit) * 10000) / 10000);
            return state.condition[key] !== before;
        },
        // IP2: one call per completed work cycle with the cycle's tool verb.
        wearUse(item, verb, uses = 1) {
            const per = DURABILITY_PROPOSAL.wearPerUse[verb];
            if (!state.enabled || !per || !item?.tags?.equippable || !identity(item.getInventoryKey())) return false;
            if (!Number.isSafeInteger(uses) || uses < 0) throw new Error('Invalid tool use count.');
            const key = item.getInventoryKey(), before = api.condition(key);
            state.condition[key] = Math.max(0, Math.round((before - uses * per) * 10000) / 10000);
            return state.condition[key] !== before;
        },
        broken(item) { return state.enabled && !!item && identity(item.getInventoryKey()) !== null && api.condition(item) <= 0; },
        // Hand repair writes the restored value here; the caller owns the quote and draw.
        setCondition(key, value) {
            if (!identity(key) || typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Invalid equipment condition.');
            state.condition[key] = Math.max(0, Math.min(cap(key), Math.round(value * 10000) / 10000));
        },
        // Root calls only on an actual landed hit. No additional combat loop.
        landedHit(fighter, target) {
            let changed = false;
            if (fighter?.tags?.main_character) changed = api.wearItem(fighter.getEquipment().weapon) || changed;
            if (target?.tags?.main_character) for (const slot of ['off-hand', 'head', 'torso', 'arms', 'legs', 'feet', 'cape']) {
                const item = target.getEquipment()[slot];
                if (item && (typeof item.getDefense === 'function' || typeof item.getShieldStrength === 'function')) changed = api.wearItem(item) || changed;
            }
            return changed;
        },
        ownedItem(actor, key) {
            return actor.getItems()[key]?.item || Object.values(actor.getEquipment()).find(item => item?.getInventoryKey() === key);
        },
        quoteRepair(actor, key) {
            const item = api.ownedItem(actor, key);
            if (!item?.tags?.equippable || !identity(key)) throw new Error('Repair needs an owned equipment instance.');
            const condition = api.condition(key);
            const cost = Math.ceil(Math.max(0, cap(key) - condition) / MAX * DURABILITY_PROPOSAL.fullRepairCoins);
            return {key, condition, cost, affordable: Number.isFinite(actor.money) && actor.money >= cost};
        },
        // Root owns custody preflight and native save/refresh publication. This
        // mutates the actual native coin balance, never a parallel currency.
        repair(actor, key, assertDisposition) {
            if (typeof assertDisposition !== 'function') throw new Error('Repair needs native custody preflight.');
            assertDisposition(key);
            assertDisposition(canonicalDurabilityKey(key));
            const quote = api.quoteRepair(actor, key);
            if (!quote.affordable) throw new Error(`Repair needs ${quote.cost} coins.`);
            actor.money -= quote.cost;
            state.condition[key] = Math.max(quote.condition, cap(key));
            return quote;
        },
        // Stage only. persistExpansionPlan writes external/equipment/nativePatch;
        // call publish only after persistence succeeds. Rejected writes need no
        // rollback because live balance, condition, IDs and items are untouched.
        stageRepair(actor, key, assertDisposition) {
            const staged = createDurability(api.serialize());
            const shadow = {money: actor.money, getItems: () => actor.getItems(), getEquipment: () => actor.getEquipment()};
            const quote = staged.repair(shadow, key, assertDisposition);
            const next = staged.serialize();
            return {quote, external: {money: shadow.money}, nativePatch: {equipment_durability: next},
                publish() { api.load(next); }};
        },
        stageToggle(actor, enabled, getItemFromKey, assertDisposition) {
            if (typeof assertDisposition !== 'function') throw new Error('Durability activation needs native custody preflight.');
            const staged = createDurability(api.serialize());
            staged.setEnabled(enabled);
            const slots = {};
            for (const [slot, item] of Object.entries(actor.getEquipment())) if (item) {
                const key = item.getInventoryKey();
                assertDisposition(key);
                assertDisposition(canonicalDurabilityKey(key));
                const copy = staged.bindFromKey(key, getItemFromKey(key));
                slots[slot] = staged.prepareEquip(copy, k => staged.bindFromKey(k, getItemFromKey(k))).getInventoryKey();
            }
            const next = staged.serialize();
            return {equipment: {player: slots}, nativePatch: {equipment_durability: next},
                publish() { api.load(next); }};
        },
        rows(actor) {
            return [...Object.values(actor.getEquipment()), ...Object.values(actor.getItems()).map(entry => entry.item)]
                .filter(item => item?.tags?.equippable && identity(item.getInventoryKey()))
                .map(item => ({key: item.getInventoryKey(), name: item.getName(), slot: item.equip_slot, ...api.quoteRepair(actor, item.getInventoryKey())}));
        },
    };
    api.load(initial);
    return api;
}
export const equipmentDurability = createDurability();
