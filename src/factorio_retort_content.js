// Original discrete-batch adapter. Factorio native-method qualification is
// root-owned. These terms are not Factorio balance or progressive burner rules.
// Importing definitions creates no stock, site, job, clock or publication.
import {all} from './basics.js';
import {REFERENCE_GAMEPLAY_IDS as R, REFERENCE_GAMEPLAY_KEYS as RK} from './reference_gameplay_content.js';
import {FEATURE_OBJECT_KEYS as O} from './feature_expansion_objects.js';
import {itemPlayerReturned as item, staminaPlayer as stamina} from './content_kit.js';

export const FACTORIO_RETORT_IDS = Object.freeze({
    world: R.world, group: 'factorio_retort', prefix: 'factorio_retort.',
    teacher: R.teacher, bench: R.site, site: 'factorio_retort.rack',
    install: 'factorio_retort.install', batch: 'factorio_retort.batch',
    collectResin: 'factorio_retort.collect_resin', collectResidue: 'factorio_retort.collect_residue',
    disposeFilled: 'factorio_retort.dispose_filled_residue', disposeLoose: 'factorio_retort.dispose_residue',
    plan: 'factorio_retort.three_batches', situation: 'feature_objects.sluice',
});
const I = FACTORIO_RETORT_IDS, key = id => JSON.stringify({id});
export const FACTORIO_RETORT_KEYS = Object.freeze({
    sap: RK.sap, log: O.log, resin: RK.resin, sound: RK.sound, kit: RK.kit,
    resinEmpty: key('Empty retort resin tray'), resinFull: key('Filled retort resin tray'),
    residueEmpty: key('Empty retort residue tray'), residueFull: key('Filled retort residue tray'),
    residue: key('Spent retort residue'),
});
export const FACTORIO_RETORT_TERMS = Object.freeze({
    revision: 1, setupLogs: 2, setupFee: 2, setupStamina: 1, siteCapacity: 1,
    batchDuration: 3, batchSap: 1, batchFuel: 1, batchStamina: 1,
    trayCapacity: 1, resinOutput: 1, residueOutput: 1,
    disposalDuration: 1, disposalStamina: 1, planBatches: 3,
});
const K = FACTORIO_RETORT_KEYS, T = FACTORIO_RETORT_TERMS;
export const factorioRetortItemSpecifications = Object.freeze([
    {id: 'Empty retort resin tray', value: 1, description: 'Your counted resin receiver, empty. One batch needs this actual held tray and the separate empty residue tray. A stored or sold tray is not free receiver capacity.'},
    {id: 'Filled retort resin tray', value: 3, description: 'The same receiver holding exactly one newly set resin unit. Collect at your Village rack to keep its empty tray and one actual Set repair resin. While filled it cannot receive another batch.'},
    {id: 'Empty retort residue tray', value: 1, description: 'Your counted coproduct receiver, empty. This is a separate one-batch capacity from the resin tray. Collecting only resin does not free it.'},
    {id: 'Filled retort residue tray', value: 1, description: 'The same receiver holding one spent residue unit. Collect the residue or spend effort disposing of its contents at the rack before this tray can receive another batch.'},
    {id: 'Spent retort residue', value: 1, description: 'One actual spent residue collected from your retort tray. It is physical owned stock, with a separate effort-paid cold disposal at the rack. It grants no resin, fuel or crop bonus.'},
]);
const eq = (fact, reason) => ({fact, op: 'eq', value: true, ...(reason ? {reason} : {})});
const f = (name, reason) => eq(`factorioRetort.${name}`, reason);
export const factorioRetortOperatingRequires = all(
    f('localSupported', 'Return to the Village with your actual living native body, usable hands and supported local clock.'),
    f('installed', 'Commission your own retort rack and two physical trays first.'),
    f('rackOwned', 'Retain your actual owned rack and the existing fitting-bench permission.'),
);
const operating = factorioRetortOperatingRequires;
const know = (name, value) => ({type: 'knowledge', actor: 'player', key: I.prefix + name, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: 'player', situationId: I.situation}});
const command = d => ({revision: T.revision, worldId: I.world, group: I.group, actorId: 'player', location: 'Village',
    reservationReturns: 1, costs: [], effects: [], ...d});
const timed = duration => ({duration, siteId: I.site, cancellation: 'refund', completionFailure: 'refund', completionRequires: operating});
const fullResin = f('resinFull', 'Carry your actual owned filled resin tray; a chest, shop, loan or equipped object is not this held receiver.');
const fullResidue = f('residueFull', 'Carry your actual owned filled residue tray before collecting or clearing it.');

export const factorioRetortDefinitions = {
    sites: [{id: I.site, revision: T.revision, label: 'Player’s Village retort rack', worldId: I.world, location: 'Village', capacity: T.siteCapacity, provision: false}],
    commands: [
        command({id: I.install, once: true, targetId: I.teacher, coLocated: true, participants: ['$target'],
            label: 'Commission your retort rack and two trays · 2 logs + 2 coins + 1 stamina',
            visibleWhen: {all: [f('workshopOpened'), {not: f('installed')}]},
            requires: all(f('localSupported'), f('workshopOpened'), f('benchPresent'),
                f('edaPresent', 'Meet living, willing Eda for this separately funded fixture and placement agreement.'),
                {not: f('installed')}, f('setupLogs', 'Carry two owned, unequipped and unborrowed Rough wood logs for the original rack and trays.')),
            costs: [item(K.log, -T.setupLogs), {type: 'resource', actor: 'player', native: true, key: 'money', amount: -T.setupFee}, stamina(-T.setupStamina)],
            effects: [{type: 'resource', actor: I.teacher, key: 'coins', amount: T.setupFee},
                {type: 'site', siteId: I.site, operation: 'open'},
                {type: 'fact', actor: 'player', scope: 'actor', key: I.prefix + 'installed', value: true},
                item(K.resinEmpty, 1), item(K.residueEmpty, 1),
                know('installed', 'Commissioned one fixed retort rack and cold disposal place beside the permitted Village bench. Two logs and my effort supplied its frame and wooden receiver fixtures; Eda received the separate two-coin fixture and placement fee. I received exactly one empty resin tray and one empty residue tray. Returning does not provide another pair.')],
            description: 'Optional once-only funded installation and permission. The actual site and native tray pair persist; returning or rendering never supplies another pair.'}),
        command({id: I.batch, label: 'Prepare one retort batch · sap + log fuel + both empty trays + 1 stamina + 3 min',
            visibleWhen: f('installed'), requires: all(operating,
                f('resinEmpty', 'The resin tray has no free receiving space. Collect its contents or recover the actual empty tray.'),
                f('residueEmpty', 'The residue tray has no free receiving space. Collect or dispose of its contents before another batch.'),
                f('sapAvailable', 'Carry one owned, unequipped and unborrowed Tree sap.'),
                f('fuelAvailable', 'Carry one owned, unequipped and unborrowed Rough wood log as this batch’s fuel.')),
            ...timed(T.batchDuration),
            costs: [item(K.sap, -T.batchSap), item(K.log, -T.batchFuel), item(K.resinEmpty, -1), item(K.residueEmpty, -1), stamina(-T.batchStamina)],
            effects: [item(K.resinFull, 1, true), item(K.residueFull, 1, true),
                know('batch', 'Prepared and settled one retort batch. Its reserved sap and log fuel were spent once; my two held empty receivers returned as distinct filled trays. Resin and spent residue remain in those physical trays until separate collection or disposal. No second batch input or fuel was reserved by this completion.')],
            description: 'Reserve only this batch and both receiving objects. Preparation keeps fuel unburned until settlement. Cancellation or unsupported completion returns unchanged input, fuel, effort and both empty trays once.'}),
        command({id: I.collectResin, label: 'Collect the resin · keep the same empty receiver', visibleWhen: all(f('installed'), fullResin),
            requires: all(operating, fullResin), costs: [item(K.resinFull, -1)],
            effects: [item(K.resinEmpty, 1, true), item(K.resin, T.resinOutput),
                know('collected_resin', 'Collected one Set repair resin from the held filled resin tray and retained that same receiver empty. The existing resin-and-two-sound-stave route can bind two survey kits. The separate residue tray was not cleared.')]}),
        command({id: I.collectResidue, label: 'Collect the spent residue · keep its empty receiver', visibleWhen: all(f('installed'), fullResidue),
            requires: all(operating, fullResidue), costs: [item(K.residueFull, -1)],
            effects: [item(K.residueEmpty, 1, true), item(K.residue, T.residueOutput),
                know('collected_residue', 'Collected the spent residue into my bag and kept its same tray empty. The residue remains physical stock until transferred, stored or deliberately disposed of; clearing this tray did not clear resin or grant fuel.')]}),
        command({id: I.disposeFilled, label: 'Dispose of the held tray’s residue · 1 stamina + 1 min', visibleWhen: all(f('installed'), fullResidue),
            requires: all(operating, fullResidue), ...timed(T.disposalDuration), costs: [item(K.residueFull, -1), stamina(-T.disposalStamina)],
            effects: [item(K.residueEmpty, 1, true), know('disposed_filled_residue', 'Spent actual effort at my commissioned cold disposal place to discard the held tray’s spent contents. The same empty residue receiver returned once. I did not pour anything into the crop drain, clear resin, recover fuel or gain materials.')]}),
        command({id: I.disposeLoose, label: 'Dispose of one loose spent residue · 1 stamina + 1 min',
            visibleWhen: all(f('installed'), f('looseResidue')), requires: all(operating,
                f('looseResidue', 'Carry an actual owned, unequipped and unborrowed Spent retort residue.')),
            ...timed(T.disposalDuration), costs: [item(K.residue, -1), stamina(-T.disposalStamina)],
            effects: [know('disposed_residue', 'Spent actual effort and one supported minute disposing of one carried spent residue at my own commissioned cold disposal place. The material was removed once; no tray, resin, fuel, crop remedy or payout was created.')]}),
    ],
};
export const factorioRetortPlanDefinitions = [{id: I.plan, revision: T.revision, actorId: 'player', origin: I.install,
    label: 'Three retort batches with separate receiver clearing', visibleWhen: f('installed'), requires: operating,
    steps: Array.from({length: T.planBatches}, (_, index) => ({id: `batch_${index + 1}`, kind: 'command', commandId: I.batch, revision: T.revision}))}];

export function registerFactorioRetortItems({itemTemplates, OtherItem}) {
    if(!itemTemplates || typeof OtherItem !== 'function') throw new Error('Retort items require the existing native OtherItem owner.');
    for(const spec of factorioRetortItemSpecifications) {
        if(itemTemplates[spec.id]) throw new Error(`Duplicate retort item ${spec.id}.`);
        itemTemplates[spec.id] = new OtherItem({...spec, name: spec.id, tags: {expedition: true}});
    }
}
