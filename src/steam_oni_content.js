// ONI-P04: original sheltered nursery fiction and compressed timing.
// Optional native work only; neither source plant code nor ecology is imported.
export const STEAM_ONI_IDS = Object.freeze({world: 'base.frontier', group: 'steam_oni', prefix: 'steam.oni.',
    begin: 'steam.oni.begin', build: 'steam.oni.build_tray', cycle: 'steam.oni.tend_cycle',
    enrolled: 'steam.oni.enrolled', built: 'steam.oni.trayBuilt', site: 'steam.oni.nursery_tray', situation: 'steam.oni.nursery_plan', version: 1});
export const STEAM_ONI_KEYS = Object.freeze({log: JSON.stringify({id: 'Rough wood log'}),
    herbs: JSON.stringify({id: 'Cooking herbs'}), sap: JSON.stringify({id: 'Tree sap'})});
const I = STEAM_ONI_IDS, K = STEAM_ONI_KEYS;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const plan = eq('steamONI.enrolled', true, 'Consider the nursery plan first.');
const support = all(eq('steamONI.supported', true, 'Return beneath the Shack roof, recover above one health and finish any battle or journey.'),
    eq('steamONI.handsUsable', true, 'Let your sore or scraped hands recover before tending the tray.'));
const tray = eq('steamONI.trayPresent', true, 'Finish your own nursery tray at the Shack first.');
const unbuilt = eq('steamONI.trayPresent', false, 'Your nursery tray is already built.');
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const fact = key => ({type: 'fact', scope: 'actor', actor: 'player', key, value: true});
const know = (key, value) => ({type: 'knowledge', actor: 'player', key: `${I.prefix}${key}`, stage: 'understood', value});
const command = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Shack', costs: [], effects: [], ...d});
const timed = (d, requires) => command({...d, cancellation: 'refund', reservationReturns: 1,
    completionRequires: all(plan, support, requires, eq('steamONI.workCurrent', true, 'This nursery work has changed; cancel it and begin again.')),
    completionFailure: 'refund'});
const refunds = 'Stop the work to recover the supplies and stamina set aside for it. If you cannot finish here, they return without a harvest.';

export const steamONIDefinitions = {sites: [{id: I.site, revision: 1, label: 'Your sheltered nursery tray', capacity: 1, provision: false}],
    situations: [{id: I.situation, revision: 1, label: 'Your Shack nursery plan',
        context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.shack'},
        privateTruth: {renewalPolicy: 'explicit_paid_native_inputs'}, participants: ['player'], initialPhase: 'idle', phases: ['idle']}], commands: [
    command({id: I.begin, label: 'Consider a sheltered nursery beside the Shack window', once: true,
        visibleWhen: all(eq('village.shackUnlocked'), eq('steamONI.enrolled', false)), requires: all(support, eq('steamONI.enrolled', false)),
        effects: [{type: 'situation', situationId: I.situation, operation: 'begin'}, fact(I.enrolled), know('plan', 'A shallow tray beside the Shack window would keep fresh shoots out of the weather. Two Rough wood logs, two coins for lining, four minutes and one stamina will put it together. For each later round, choose a fresh shoot from one Cooking herbs bundle and seal the tray with one Tree sap. Five minutes of care and one stamina will give you two bundles for the cookfire.')],
        description: 'Consider the frame and lining. Making the tray and tending each round are separate choices.'}),
    timed({id: I.build, label: 'Build your sheltered nursery tray · 2 logs + 2 coins + 1 stamina + 4 min', once: true, duration: 4,
        visibleWhen: all(plan, unbuilt), requires: all(plan, support, unbuilt, eq('steamONI.own.logs', true, 'Bring two of your own Rough wood logs.')),
        costs: [item(K.log, -2), {type: 'resource', actor: 'player', native: true, key: 'money', amount: -2}, stamina(-1)],
        effects: [{type: 'site', actor: 'player', siteId: I.site, operation: 'open'}, fact(I.built),
            know('built', 'You cut the two logs into a shallow frame and fitted the paid lining beneath the Shack window. Four minutes and one stamina leave you with your own empty nursery tray. The shoots and sap for each round are still yours to supply.')],
        description: `Two Rough wood logs become the frame; two coins pay for its lining. The tray is ready after four minutes and one stamina. ${refunds}`}, unbuilt),
    timed({id: I.cycle, label: 'Tend a fresh nursery round · 1 herb bundle + 1 sap + 1 stamina + 5 min → 2 herb bundles', duration: 5, siteId: I.site,
        visibleWhen: all(plan, tray), requires: all(plan, support, tray,
            eq('steamONI.own.herbs', true, 'Bring one of your own Cooking herbs bundles with a fresh shoot.'),
            eq('steamONI.own.sap', true, 'Bring one of your own Tree sap to seal the tray.')),
        costs: [item(K.herbs, -1), item(K.sap, -1), stamina(-1)], effects: [item(K.herbs, 2),
            know('harvest', 'You chose a fresh shoot from your herb bundle and sealed the tray with sap. After five minutes of sheltered care and one stamina, you lift two Cooking herbs bundles for the cookfire. The tray is empty again; another round needs a fresh shoot and sap.')],
        description: `Use both one Cooking herbs bundle and one Tree sap for this round. Stay beneath the roof for five minutes; one stamina yields two Cooking herbs bundles. ${refunds}`}, tray),
]};
