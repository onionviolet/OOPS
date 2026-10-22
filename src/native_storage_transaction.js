import {stageAcquisition} from "./acquisition.js";
import {validateExpansionState} from "./expansion_engine.js";
import {validateItemKey} from "./gameplay_transactions.js";
import {assertNativeItemDisposition, nativeActionReasons} from "./native_gameplay_adapter.js";

// The chest is an inventory owner, never a fabricated gameplay actor.
export function stageNativeStorageTransfer({state, gameplay, owners, money, equipment, favorites = {}, request}) {
    if(!request || request.sequence !== state.sequence) throw new Error("This chest request is stale. Refresh the chest.");
    if(!["deposit", "withdraw"].includes(request.direction) || Object.keys(owners).length !== 2 ||
        !Object.hasOwn(owners, "player") || !Object.hasOwn(owners, "chest")) throw new Error("Unsupported chest holder.");
    const reasons = nativeActionReasons(state);
    if(reasons.length) throw new Error(reasons.join(" "));
    const from = request.direction === "deposit" ? "player" : "chest", to = from === "player" ? "chest" : "player";
    const batch=Object.hasOwn(request,'items'),entries=batch?request.items:[request];
    if(!Array.isArray(entries)||!entries.length)throw new Error('Select at least one stack.');
    const seen=new Set(),transfers=[];
    for(const entry of entries){
        validateItemKey(entry.item_key);
        if(seen.has(entry.item_key))throw new Error('A stack was selected twice.');seen.add(entry.item_key);
        const available=owners[from][entry.item_key];
        if(from==='player'&&!available&&Object.values(equipment?.player||{}).includes(entry.item_key))throw new Error('Unequip the item before transferring it.');
        if(!Number.isSafeInteger(available)||available<=0||entry.expectedCount!==available)throw new Error('This chest quantity is stale or unavailable. Refresh the chest.');
        if(entry.count!==Infinity&&(!Number.isSafeInteger(entry.count)||entry.count<=0))throw new Error('Invalid chest quantity.');
        if(batch&&(entry.count===Infinity||entry.count>available))throw new Error('Review the exact batch quantity again.');
        if(batch&&from==='player'&&favorites[entry.item_key])throw new Error('Favorite items stay carried. Unfavorite that stack before batch storage.');
        assertNativeItemDisposition(state,entry.item_key);
        transfers.push({from,to,key:entry.item_key,count:Math.min(entry.count,available)});
    }
    // Validate the entire selection first; one durable publication moves every stack.
    const ownership=stageAcquisition(owners,{transfers});
    const nextState = structuredClone(state), nextGameplay = structuredClone(gameplay);
    nextState.sequence++;
    nextGameplay.player.inventory = ownership.player;
    validateExpansionState(nextState);
    return {state: nextState, external: {money}, gameplay: nextGameplay, ownership: {chest: ownership.chest}, chestTransfer: true};
}
