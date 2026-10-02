import {validateExpansionState} from "./expansion_engine.js";
import {writeOwnershipToEnvelope} from "./acquisition.js";
import {writeGameplayToEnvelope} from "./gameplay_transactions.js";

// Caller publishes plan.state and plan.external only after this succeeds.
// The existing envelope is copied, retaining unrelated and dormant content.
export function persistExpansionPlan(plan, {createSave, storage, key, bindings, ownershipBindings, validateEnvelope}) {
    validateExpansionState(plan.state);
    const serialized = createSave();
    if(typeof serialized !== "string") throw new Error("No valid save could be created.");
    const envelope = JSON.parse(serialized);
    if(!envelope?.character || !Number.isFinite(plan.external.money) || plan.external.money < 0) {
        throw new Error("Invalid character resource transaction.");
    }
    envelope.expansion = plan.state;
    envelope.character.money = plan.external.money;
    writeGameplayToEnvelope(envelope, plan.gameplay || {}, bindings);
    if(plan.ownership) writeOwnershipToEnvelope(envelope, plan.ownership, ownershipBindings);
    if(plan.market) envelope.loot_sold_count = plan.market;
    if(plan.itemLog) envelope.item_log = plan.itemLog;
    if(validateEnvelope) validateEnvelope(envelope);
    const committed = JSON.stringify(envelope);
    storage.setItem(key, committed);
    return committed;
}
