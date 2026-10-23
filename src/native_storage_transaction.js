import {stageAcquisition} from "./acquisition.js";
import {validateExpansionState} from "./expansion_engine.js";
import {validateItemKey} from "./gameplay_transactions.js";
import {assertNativeItemDisposition, nativeActionReasons} from "./native_gameplay_adapter.js";
import {simulationOccupiesActor} from "./simulation.js";
import {canonicalDurabilityKey} from "./absorb_e2/durability.js";

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

// Carried stock <-> a companion's simulation inventory. Handing goods over records a loan
// (owner you, holder them) so taking them back is the lawful return; no new store is written.
// Take-back moves whole loans, so a quantity can never drift from its custody record.
export function stageCompanionStockTransfer({state, gameplay, money, equipment, favorites = {}, request}) {
    if(!request || request.sequence !== state.sequence) throw new Error("This stock request is stale. Refresh the view.");
    const s = state.simulation, id = request.companionId;
    if(!s?.people.player || !["entrust", "retrieve"].includes(request.direction) || typeof id !== "string" || id === "player") throw new Error("Unsupported stock holder.");
    const who = s.people[id];
    if(!who || who.inventory !== "simulation" || who.life !== "alive" || !s.owners[id]) throw new Error("That person has no stock of their own here.");
    if(state.actors[id]?.worldId !== state.actors.player.worldId || who.location !== s.people.player.location) throw new Error("They are not with you right now.");
    const reasons = nativeActionReasons(state);
    if(reasons.length) throw new Error(reasons.join(" "));
    if(simulationOccupiesActor(state, id)) throw new Error("They are busy. Wait until they are free.");
    const entries = request.items;
    if(!Array.isArray(entries) || !entries.length) throw new Error("Select at least one stack.");
    const bag = Object.fromEntries(Object.entries(gameplay.player.inventory)), theirs = structuredClone(s.owners[id]);
    const nextState = structuredClone(state), nextGameplay = structuredClone(gameplay), seen = new Set(), done = [];
    entries.forEach((entry, i) => {
        validateItemKey(entry.item_key);
        if(seen.has(entry.loanId || entry.item_key)) throw new Error("A stack was selected twice.");
        seen.add(entry.loanId || entry.item_key);
        if(request.direction === "entrust") {
            const have = bag[entry.item_key];
            if(!Object.hasOwn(bag, entry.item_key) && Object.values(equipment?.player || {}).includes(entry.item_key)) throw new Error("Unequip the item before handing it over.");
            if(!Number.isSafeInteger(have) || have <= 0 || entry.expectedCount !== have) throw new Error("This quantity is stale or unavailable. Refresh the view.");
            if(!Number.isSafeInteger(entry.count) || entry.count <= 0 || entry.count > have) throw new Error("Review the exact quantity again.");
            if(favorites[entry.item_key]) throw new Error("Favorite items stay carried. Unfavorite that stack before handing it over.");
            assertNativeItemDisposition(state, entry.item_key);
            const loanId = `stock.${id}.${state.sequence + 1}.${i}`;
            if(nextState.simulation.custody[loanId]) throw new Error("Loan already exists.");
            nextState.simulation.custody[loanId] = {owner: "player", holder: id, key: entry.item_key, count: entry.count, at: state.clock, cause: `stock:${state.sequence + 1}`};
            bag[entry.item_key] = have - entry.count; theirs[entry.item_key] = (theirs[entry.item_key] || 0) + entry.count;
        } else {
            const loan = s.custody[entry.loanId];
            if(!loan || loan.owner !== "player" || loan.holder !== id || loan.key !== entry.item_key || entry.expectedCount !== loan.count) throw new Error("This loan changed. Refresh the view.");
            const held = Object.values(s.custody).filter(c => c.holder === id && canonicalDurabilityKey(c.key) === canonicalDurabilityKey(loan.key)).reduce((n, c) => n + c.count, 0);
            if(!(theirs[loan.key] >= held)) throw new Error("They no longer have all of it. Settle that with them first.");
            theirs[loan.key] -= loan.count; if(!theirs[loan.key]) delete theirs[loan.key];
            bag[loan.key] = (bag[loan.key] || 0) + loan.count;
            delete nextState.simulation.custody[entry.loanId];
        }
        done.push(entry.item_key);
    });
    for(const k of Object.keys(bag)) if(!bag[k]) delete bag[k];
    nextState.sequence++;
    nextState.simulation.owners[id] = theirs;
    nextGameplay.player.inventory = bag;
    validateExpansionState(nextState);
    return {state: nextState, external: {money}, gameplay: nextGameplay, stockTransfer: true};
}
