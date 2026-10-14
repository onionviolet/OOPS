// Original reversible proposal. Proto23 R13/N02 inspired the loop only;
// no foreign code, prose or assets. This is not a canon cultivation system.
export const mistglassProfile = Object.freeze({
    id: 'p23.mistglass.v1', worldId: 'p23.mistglass', bodyForm: 'human',
    label: 'Mistglass conservatory', locationId: 'p23.mistglass.conservatory',
    exposureConditionId: 'p23.mistglass.mist', blockedConditionId: 'p23.mistglass.raw',
    resourceId: 'p23.mistglass.condensate', subunitsPerUnit: 1000,
    subunitsPerMinute: 125, capacity: 10000, trialCost: 2000,
    doseItemId: 'p23.mistglass.dose', trialMinutes: 12, successThreshold: 7500,
    successSkillId: 'Meditation', successXp: 30, failureMinutes: 6,
});
// P00 must register these with native content/custody/discovery owners.
// A repeatable native shop purchase is the authored acquisition route.
export const mistglassContent = Object.freeze({
    status: 'original-proposal', defaultEnabled: false,
    dose: Object.freeze({id: mistglassProfile.doseItemId, label: 'Cloudseed dose',
        description: 'A conservatory preparation for a twelve-minute purification trial.'}),
    acquisition: Object.freeze({kind: 'native-shop', sellerId: 'p23.mistglass.keeper',
        locationId: mistglassProfile.locationId, itemId: mistglassProfile.doseItemId,
        priceCoins: 3, stockPerRestock: 4, restockPlayedMinutes: 60}),
    enrollment: Object.freeze({id: 'p23.mistglass.enroll', label: 'Learn the conservatory method',
        requiresExplicitOptIn: true, reveals: 'p23.mistglass.method'}),
});
// Native energy_resources.js policy: reserves are condensate subunits.
export const mistglassEnergyPolicy = Object.freeze({
    id: mistglassProfile.resourceId, revision: 1, label: 'Mistglass condensate',
    capacity: mistglassProfile.capacity, output: mistglassProfile.trialCost, control: 1,
    efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0,
});
