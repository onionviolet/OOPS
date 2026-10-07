// Energy policies use integer units. Recovery is an ordinary frozen job on the
// shared clock; this module never runs a timer or writes a save.
const check = (ok, message) => {if(!ok) throw new Error(message);};
const natural = n => Number.isSafeInteger(n) && n >= 0;
export function validateEnergyPolicy(d) {
    check(d && typeof d.id === "string" && Number.isSafeInteger(d.revision) && d.revision > 0 && typeof d.label === "string", "Invalid energy policy identity.");
    for(const key of ["capacity", "output", "control", "efficiencyNumerator", "efficiencyDenominator", "strainLimit", "strainPerUse"]) check(natural(d[key]), "Invalid energy policy dimension.");
    check(d.capacity > 0 && d.output > 0 && d.control > 0 && d.efficiencyNumerator > 0 && d.efficiencyDenominator > 0 && d.strainPerUse <= d.strainLimit, "Invalid energy limits.");
}
export function validateEnergyEffect(e) {
    check(typeof e.energyId === "string" && ["learn", "recover", "use", "refund"].includes(e.operation), "Invalid energy effect.");
    if(["use", "refund"].includes(e.operation)) check(natural(e.output) && e.output > 0 && natural(e.control) && e.control > 0, "Invalid energy output/control.");
    if(e.operation === "recover") check(natural(e.amount) && natural(e.cooling || 0), "Invalid energy recovery.");
    if(e.policy) {validateEnergyPolicy(e.policy); check(e.policy.id === e.energyId, "Energy policy binding differs.");}
}
export function energyCharge(policy, effect) {
    const numerator=BigInt(effect.output)*BigInt(policy.efficiencyDenominator),denominator=BigInt(policy.efficiencyNumerator);
    const cost=Number((numerator+denominator-1n)/denominator);
    check(natural(cost) && cost > 0, "Energy conversion overflow."); return cost;
}
export function applyEnergyEffect(state, actorId, e, registry) {
    const definition = registry.energies.get(e.energyId); check(definition, "Unsupported energy policy.");
    const records = (state.simulation.energies ||= {})[actorId] ||= {};
    if(e.operation === "learn") {
        check(!records[e.energyId], "This energy method is already learned.");
        const policy = structuredClone(e.policy || definition); validateEnergyPolicy(policy);
        records[e.energyId] = {policy, reserve: 0, strain: 0}; return;
    }
    const owned = records[e.energyId]; check(owned, "Learn this energy method first.");
    const policy = owned.policy;
    if(e.operation === "recover") {
        owned.reserve = Math.min(policy.capacity, owned.reserve + e.amount);
        owned.strain = Math.max(0, owned.strain - (e.cooling || 0)); return;
    }
    check(e.output <= policy.output && e.control <= policy.control, "This method cannot supply that output or control.");
    const cost = energyCharge(policy, e);
    if(e.operation === "refund") {
        check(owned.reserve + cost <= policy.capacity && owned.strain >= policy.strainPerUse, "Invalid reserved energy refund.");
        owned.reserve += cost; owned.strain -= policy.strainPerUse;
    } else {
        check(owned.reserve >= cost, "Recover enough energy before using this method.");
        check(owned.strain + policy.strainPerUse <= policy.strainLimit, "Rest this method before adding more strain.");
        owned.reserve -= cost; owned.strain += policy.strainPerUse;
    }
}
export function validateEnergyState(records, person, registry) {
    check(records && typeof records === "object" && !Array.isArray(records), "Invalid saved energies.");
    for(const [actor, energies] of Object.entries(records)) {
        person(actor); check(energies && typeof energies === "object" && !Array.isArray(energies), "Invalid actor energies.");
        for(const [id, e] of Object.entries(energies)) {
            validateEnergyPolicy(e.policy);
            check(e.policy.id === id && natural(e.reserve) && e.reserve <= e.policy.capacity && natural(e.strain) && e.strain <= e.policy.strainLimit, "Invalid saved energy reserve/strain.");
            if(registry) check(registry.energies.has(id), "Unsupported saved energy.");
        }
    }
}
export function energyView(state, actorId = "player") {
    return Object.entries(state.simulation?.energies?.[actorId] || {}).map(([id,e]) => ({id, label: e.policy.label, reserve: e.reserve, capacity: e.policy.capacity,
        strain: e.strain, strainLimit: e.policy.strainLimit, output: e.policy.output, control: e.policy.control}));
}
