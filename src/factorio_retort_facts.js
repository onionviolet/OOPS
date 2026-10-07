// Read-only actual-stock predicates. Root must recompute these inside the
// common simulationFacts path as well as the manual/UI context.
import {FACTORIO_RETORT_IDS as I, FACTORIO_RETORT_KEYS as K, FACTORIO_RETORT_TERMS as T} from './factorio_retort_content.js';
import {referenceGameplayFacts} from './reference_gameplay_host.js';
import {availableOwnedNativeCount} from './audited_kit_reserve_facts.js';
import {featureObjectDefinitions} from './feature_expansion_objects.js';
import {statusCareSupportedBody} from './status_care_facts.js';

export function factorioRetortBenchSupported(state) {
    const bench = state.simulation?.sites?.[I.bench];
    const definition = featureObjectDefinitions.sites.find(site => site.id === I.bench);
    return !!definition && bench?.owner === I.teacher && bench.capacity === definition.capacity;
}

export function factorioRetortFacts(state, context = {}, registry) {
    const s = state.simulation, p = s?.people?.player, actor = state.actors?.player;
    const reference = referenceGameplayFacts(state, context, registry);
    const record = state.referenceGameplay?.retort;
    const installed = record?.schema === 1 && actor?.facts?.[I.prefix + 'installed'] === true;
    const workshopOpened = reference['reference.workshop.opened'] === true;
    const benchPresent = factorioRetortBenchSupported(state);
    const localSupported = (context.actorId || 'player') === 'player' && p?.inventory === 'native' && p.life === 'alive' &&
        statusCareSupportedBody(state, context) &&
        actor?.worldId === I.world && reference['reference.workshop.supported'] === true &&
        reference['reference.workshop.handsUsable'] === true && context.vitals?.player?.health >= 2;
    const site = s?.sites?.[I.site];
    const rackOwned = installed && workshopOpened && benchPresent && site?.owner === 'player' && site.capacity === T.siteCapacity;
    const owned = name => availableOwnedNativeCount(state, context, K[name]);
    const counts = Object.fromEntries(['resinEmpty', 'resinFull', 'residueEmpty', 'residueFull', 'residue', 'sap', 'log'].map(name => [name, owned(name)]));
    return {
        'factorioRetort.workshopOpened': workshopOpened, 'factorioRetort.benchPresent': benchPresent,
        'factorioRetort.localSupported': !!localSupported, 'factorioRetort.installed': installed,
        'factorioRetort.edaPresent': reference['reference.workshop.edaPresent'] === true,
        'factorioRetort.rackOwned': !!rackOwned, 'factorioRetort.supported': !!localSupported && rackOwned,
        'factorioRetort.setupLogs': counts.log >= T.setupLogs,
        'factorioRetort.resinEmpty': counts.resinEmpty === 1, 'factorioRetort.resinFull': counts.resinFull === 1,
        'factorioRetort.residueEmpty': counts.residueEmpty === 1, 'factorioRetort.residueFull': counts.residueFull === 1,
        'factorioRetort.looseResidue': counts.residue >= 1,
        'factorioRetort.sapAvailable': counts.sap >= T.batchSap, 'factorioRetort.fuelAvailable': counts.log >= T.batchFuel,
        ...Object.fromEntries(Object.entries(counts).map(([name, count]) => [`factorioRetort.count.${name}`, count])),
    };
}
