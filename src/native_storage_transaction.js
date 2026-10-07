import {stageAcquisition} from "./acquisition.js";
import {validateExpansionState} from "./expansion_engine.js";
import {validateItemKey} from "./gameplay_transactions.js";
import {assertNativeItemDisposition, nativeActionReasons} from "./native_gameplay_adapter.js";

// The chest is an inventory owner, never a fabricated gameplay actor.
export function stageNativeStorageTransfer({state, gameplay, owners, money, equipment, request}) {
    if(!request || request.sequence !== state.sequence) throw new Error("This chest request is stale. Refresh the chest.");
    if(!["deposit", "withdraw"].includes(request.direction) || Object.keys(owners).length !== 2 ||
        !Object.hasOwn(owners, "player") || !Object.hasOwn(owners, "chest")) throw new Error("Unsupported chest holder.");
    const reasons = nativeActionReasons(state);
    if(reasons.length) throw new Error(reasons.join(" "));
    validateItemKey(request.item_key);
    const from = request.direction === "deposit" ? "player" : "chest", to = from === "player" ? "chest" : "player";
    const available = owners[from][request.item_key];
    // Native equipment is already outside carried stock. Protect an equipped-
    // only request, while preserving transfers of owned spare copies in the bag.
    if(from === "player" && !available && Object.values(equipment?.player || {}).includes(request.item_key)) {
        throw new Error("Unequip the item before transferring it.");
    }
    if(!Number.isSafeInteger(available) || available <= 0 || request.expectedCount !== available) {
        throw new Error("This chest quantity is stale or unavailable. Refresh the chest.");
    }
    if(request.count !== Infinity && (!Number.isSafeInteger(request.count) || request.count <= 0)) throw new Error("Invalid chest quantity.");
    assertNativeItemDisposition(state, request.item_key);
    const count = Math.min(request.count, available);
    const ownership = stageAcquisition(owners, {transfers: [{from, to, key: request.item_key, count}]});
    const nextState = structuredClone(state), nextGameplay = structuredClone(gameplay);
    nextState.sequence++;
    nextGameplay.player.inventory = ownership.player;
    validateExpansionState(nextState);
    return {state: nextState, external: {money}, gameplay: nextGameplay, ownership: {chest: ownership.chest}, chestTransfer: true};
}
