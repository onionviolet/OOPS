// Original reversible local prototypes inspired by the audited Elin and
// KeeperRL packets. Definitions do not enroll, provision or advance anyone.
import {compileSiteProject} from './site_projects.js';
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as OK} from './feature_expansion_objects.js';

export const REMAINDER_HOME_IDS = Object.freeze({
    world: O.world, group: 'remainder_home', bench: O.site, eda: O.miri, grain: O.method,
    workshop: 'field.assembly', resident: 'remainder_home.neri', method: 'remainder_home.kit_binding',
    situation: 'remainder_home.terms', room: 'remainder_home.room', residence: 'remainder_home.residence',
    track: 'remainder_home.specialization', exclusive: 'remainder_home.one_training',
    loadedAdvance: 'remainder_home.advance_loaded', fineAdvance: 'remainder_home.advance_fine',
    loadedChoice: 'remainder_home.choose_loaded', fineChoice: 'remainder_home.choose_fine',
});
const I = REMAINDER_HOME_IDS, P = 'remainder_home.';
export const remainderHomeSources = [{id: I.method, revision: 1, label: 'Neri\'s ordinary kit binding', kind: 'technique', origin: 'trained', grants: [],
    bioDetail: 'Neri\'s own learned binding operation. Funding gives neither competence nor material output; she needs her actual stock, hands and permitted site.'}];
const key = id => JSON.stringify({id});
export const REMAINDER_HOME_KEYS = Object.freeze({...OK,
    jig: key('Reusable measuring jig'), green: key('Green repair offcut'), offcut: key('Compatible repair offcut'),
});
const K = REMAINDER_HOME_KEYS;
export const remainderHomeItemSpecifications = Object.freeze([
    {id: 'Reusable measuring jig', description: 'A paid, built bench gauge for fitting two compatible dry offcuts. It is reserved and returned by its named salvage work, never equipped.', value: 5},
    {id: 'Green repair offcut', description: 'A counted green side piece from the local one-log trimming job. Two pieces need real drying before precise salvage.', value: 0.5},
    {id: 'Compatible repair offcut', description: 'A counted dry side piece from that same local trimming stock. Two compatible pieces and a reusable jig can form one sound repair stave.', value: 1},
]);
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const af = (name, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: P + name, value});
const wf = (name, value = true) => ({type: 'world', worldId: I.world, key: P + name, value});
const item = (key, amount, actor = 'player', returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const coins = (amount, actor = I.eda) => ({type: 'resource', actor, key: 'coins', amount});
const stamina = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
const attention = amount => ({type: 'resource', actor: I.resident, key: 'attention', amount});
const transfer = (from, to, key, count = 1) => ({type: 'transfer', from, to, key, count});
const know = (name, value, stage = 'seen', actor = 'player', attributedTo = actor, kind = 'observation') => ({type: 'knowledge', actor,
    key: P + name, stage, value, basis: {kind, attributedTo, situationId: I.situation}});
const enrolled = eq('auditRemainder.enrolled', true, 'Accept the optional local remainder terms first.');
const bench = all(enrolled, eq('remainderHome.benchSupported', true, 'Use the actual permitted Eda bench in Village with your living native body and recovered hands.'));
const eda = eq('remainderHome.edaSupported', true, 'Eda must still be willing, present and physically able to attend this paid work.');
const edaMethod = eq('remainderHome.edaMeasuringMethod', true, 'Eda needs her own current active Grain matching method to teach the disclosed measuring and fitting control.');
const terms = eq('remainderHome.benchRight', true, 'Hear and accept Eda\'s specific measuring-strip build and work permission.');
const benchWork = all(bench, terms);
const contact = {targetId: I.eda, coLocated: true, participants: ['$target']};
const timed = (duration, requires, siteId = I.bench, coLocated = false) => ({duration, cancellation: 'refund', siteId,
    completionRequires: requires, completionCoLocated: coLocated, completionFailure: 'refund'});
const command = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village', costs: [], effects: [], ...d});
const roomSupport = all(enrolled, eq('remainderHome.workshopSupported', true, 'Return to your actually assembled Shack field workshop with usable hands and actual build permission.'),
    eq('remainderHome.roomTerms', true, 'Accept the stated room materials, site and residence limits.'));
const unoccupied = eq('remainderHome.unoccupied', true, 'This completed room must still be unoccupied and its residence claim held by you.');
const resident = eq('remainderHome.residentSupported', true, 'Neri must be alive, willing and physically present in the Shack with her own usable hands and attention.');
const residentReady = all(enrolled, eq('remainderHome.localClock'), eq('remainderHome.residentMethod'), eq('remainderHome.residentSupported'),
    eq('remainderHome.occupied'), eq('remainderHome.serviceFunded'), eq('remainderHome.residentKit', true, 'Neri must own her actual unencumbered kit or its exact current reservation.'));

// This is a real installation at the already earned field.assembly site in the
// actual native Shack, not a new native location or free constructed room.
export const remainderHomeRoomProject = {id: I.room, revision: 1, worldId: I.world, phases: [
    {id: 'frame', actorId: 'player', label: 'Frame the permitted guest room · 1 log + 2 coins + 1 stamina + 4 min', location: 'Shack', siteId: I.workshop,
        duration: 4, cancellation: 'refund', visibleWhen: eq('remainderHome.roomTerms'), requires: roomSupport,
        completionRequires: roomSupport, completionFailure: 'refund', costs: [item(K.log, -1), money(-2), stamina(-1)],
        effects: [know('room_frame', 'One supplied Rough wood log and two paid construction coins became the guest-room frame inside your earned Shack field-workshop site. Four played minutes and one stamina were spent. A frame grants no residence slot or resident.')]},
    {id: 'finish', actorId: 'player', label: 'Finish one guest room · 1 log + 2 coins + held kit + 2 stamina + 3 min', location: 'Shack', siteId: I.workshop,
        after: ['frame'], duration: 3, cancellation: 'refund', visibleWhen: eq('remainderHome.roomFrame'), requires: all(roomSupport, eq('remainderHome.playerKit')),
        completionRequires: all(roomSupport, eq('remainderHome.playerKit')), completionFailure: 'refund',
        costs: [item(K.log, -1), money(-2), item(K.kit, -1), stamina(-2)],
        effects: [item(K.kit, 1, 'player', true), {type: 'claim', operation: 'acquire', key: I.residence, actor: 'player'}, wf('roomCompleted'),
            know('room_finished', 'The second real log and two construction coins finished one guest room at your earned Shack field workshop. Your counted kit was returned once. The completed room grants exactly one unoccupied residence claim; it grants no person, wood, kit, wage or service. No dismantling action is offered, and occupancy must end before any later removal design.')]},
]};
const roomCommands = compileSiteProject(remainderHomeRoomProject).map(d => ({...d, group: I.group}));
const specializationSupport = all(benchWork, eda, edaMethod, eq('remainderHome.conditioned', true, 'Finish two actual grip drills, retain Conditioned grip and recover your hands.'),
    eq('remainderHome.fieldTrial', true, 'Complete the actual ordinary-response loaded-frame assessment first.'),
    eq('remainderHome.noSpecialization', true, 'Your one local specialization has already been chosen.'));
const specializationCosts = [money(-2), item(K.sap, -1), stamina(-1), stamina(-1, I.eda)];
const branch = (id, name, label, text) => ({id, revision: 1, label, track: I.track, branch: name, exclusiveGroup: I.exclusive,
    requires: specializationSupport, costs: specializationCosts,
    effects: [coins(2), af('specialization', name), know('specialization', text, 'understood', 'player', I.eda, 'instruction'),
        know('specialization_witness', `I consented to and completed the paid ${name === 'loaded' ? 'loaded-survey' : 'delicate-fitting'} instruction. One actual sap and our own effort were spent; two native coins entered my purse. The other local specialization was foregone.`, 'seen', I.eda, I.eda, 'instruction')]});
export const remainderHomeDefinitions = {
    people: [{id: I.resident, revision: 1, label: 'Neri, independent kit binder', worldId: I.world, location: 'Shack', inventory: 'simulation', provision: false,
        resources: {coins: 0, attention: 2}, body: {hands: 2}, vitals: {health: 18, max_health: 18, stamina: 8, max_stamina: 8}}],
    situations: [{id: I.situation, revision: 1, label: 'Permitted local home work', context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
        participants: ['player', I.eda], initialPhase: 'open', phases: ['open'], privateTruth: {roomCapacity: 1, invitation: 'once_only_funded_consent'}}],
    powers: [{id: I.method, revision: 1, label: 'Neri\'s ordinary kit binding', model: 'practice', worlds: [I.world], capacity: 1,
        execution: all(eq('remainderHome.localClock'), eq('remainderHome.residentMethod'), eq('remainderHome.residentSupported'))}],
    advancements: [
        branch(I.loadedAdvance, 'loaded', 'Choose loaded-survey training · forego delicate fitting · 2 coins + 1 sap + our effort',
            'After my own recovered conditioning and ordinary loaded-frame trial, Eda taught one paid loaded-survey specialization. In the newly offered supported loaded survey, control reduces my effort from three stamina to two while the real kit, log load and four minutes remain required. Delicate offcut fitting is foregone; ordinary survey and ordinary jig salvage remain available.'),
        branch(I.fineAdvance, 'fine', 'Choose delicate-fitting training · forego loaded survey · 2 coins + 1 sap + our effort',
            'After my own recovered conditioning and ordinary loaded-frame trial, Eda taught one paid delicate-fitting specialization. It enables a two-minute precise offcut salvage with my real built measuring jig and two dry compatible offcuts; the ordinary four-minute salvage remains available. Loaded-survey control training is foregone.'),
    ],
    commands: [
        command({id: P + 'terms', label: 'Hear Eda\'s measuring-strip terms · free optional permission', once: true, ...contact, siteId: I.bench,
            visibleWhen: all(enrolled, eq('actor.feature_objects.jointInspected')), requires: all(bench, eda, eq('actor.feature_objects.jointInspected')),
            effects: [{type: 'situation', operation: 'begin', situationId: I.situation}, af('benchRight', I.bench),
                know('terms', 'Eda permits one timber rain cover over the outer measuring strip of her real Village fitting-bench site. Two supplied logs, two coins, two stamina and five played minutes build it. The cover permits only the newly offered offcut-trimming job during actual rain; the old dry rack, shelf, recipes and regional weather keep their existing rules. Your own completed cutting and drying observations can support paid measuring research. One separate specialization requires actual recovered conditioning and an ordinary loaded-frame trial.', 'understood', 'player', I.eda, 'instruction'),
                know('permission', 'I permit the traveler to build one cover on my outer measuring strip and do the disclosed new trimming and measuring work here. My existing shelf, recipes, stock and ownership remain separate. Cover payment is two coins only at actual completion.', 'seen', I.eda, I.eda, 'instruction')]}),
        command({id: P + 'cover', label: 'Build the outer measuring-strip cover · 2 logs + 2 coins + 2 stamina + 5 min', once: true, ...contact,
            visibleWhen: terms, requires: all(benchWork, eda, not(eq('remainderHome.coverBuilt'))), ...timed(5, all(benchWork, eda, not(eq('remainderHome.coverBuilt'))), I.bench, true),
            costs: [item(K.log, -2), money(-2), stamina(-2)], effects: [coins(2), wf('cover', I.bench),
                know('cover', 'Two actual logs became a stationary cover over Eda\'s permitted outer measuring strip. Two native coins entered her purse. This particular new trimming job can now continue during actual rain; no other job, wet wood or regional weather changed.'),
                know('cover_witness', 'I completed the paid two-log cover at my Village bench. I still own the site and permit the traveler\'s disclosed independent strip work.', 'seen', I.eda)]}),
        ...[['uncovered', false], ['covered', true]].map(([name, covered]) => {
            const support = all(benchWork, eq('remainderHome.coverBuilt', covered), ...(covered ? [] : [eq('remainderHome.dryWeather', true, 'Rain interrupts the uncovered outer measuring strip. Build its actual cover or wait for dry weather.')]), eq('remainderHome.sharpKnife'));
            return command({id: P + 'trim_' + name, label: `${covered ? 'Use your covered' : 'Use the uncovered'} measuring strip · 1 log + held sharp knife + 2 stamina + 5 min`,
                visibleWhen: all(terms, eq('remainderHome.coverBuilt', covered)), requires: support, ...timed(5, support),
                costs: [item(K.log, -1), item(K.sharp, -1), stamina(-2)], effects: [item(K.dull, 1, 'player', true), item(K.wet, 1), item(K.green, 2),
                    know('trim', 'One real Rough wood log was divided into one Wet repair stave and two Green repair offcuts. Your owned sharp fitting knife became its dulled variant and stayed yours. These three counted green pieces account for the timber; none is sound or dry yet. The reusable measuring jig was not supplied.')]});
        }),
        command({id: P + 'dry_offcuts', label: 'Dry two counted green offcuts · 2 stamina + 6 min', visibleWhen: terms,
            requires: benchWork, ...timed(6, benchWork), costs: [item(K.green, -2), stamina(-2)], effects: [item(K.offcut, 2),
                know('dry_offcuts', 'Two actual Green repair offcuts from the disclosed local trimming stock dried into two Compatible repair offcuts over six played minutes. No piece was duplicated and no jig or fitting knowledge was awarded.')]}),
        command({id: P + 'research', label: 'Reconcile your two actual work observations · 2 coins + our effort + 4 min', once: true, ...contact,
            visibleWhen: all(terms, eq('remainderHome.observations')), requires: all(benchWork, eda, edaMethod, eq('remainderHome.observations')),
            ...timed(4, all(benchWork, eda, edaMethod, eq('remainderHome.observations')), I.bench, true),
            costs: [money(-2), stamina(-1), stamina(-1, I.eda)], effects: [coins(2),
                know('research', 'Eda reconciled my own committed cutting result and separate committed wet-to-sound drying result. I understood the matching-width measurement used by one local salvage recipe. Two real coins paid her, and both of us spent effort and four played minutes. Reading this report supplies no wood, physical jig, source or salvage output.', 'understood', 'player', I.eda, 'instruction'),
                know('research_witness', 'I completed the paid measurement study with the traveler\'s actual firsthand cutting and drying records. I supplied instruction and spent my own effort; no physical jig was gifted.', 'seen', I.eda, I.eda, 'instruction')]}),
        command({id: P + 'build_jig', label: 'Build your reusable measuring jig · 1 log + 1 sap + 1 stamina + 3 min', once: true,
            visibleWhen: eq('remainderHome.researchKnown'), requires: all(benchWork, eq('remainderHome.researchKnown')), ...timed(3, all(benchWork, eq('remainderHome.researchKnown'))),
            costs: [item(K.log, -1), item(K.sap, -1), stamina(-1)], effects: [item(K.jig, 1),
                know('jig', 'One actual log and one sap became one owned Reusable measuring jig after three played minutes and one stamina. The paid research gave the recipe; this separate construction supplied the tool. No offcut or stave was granted.')]}),
        command({id: P + 'ordinary_trial', label: 'Witness one ordinary loaded field trial · held log + held kit + 3 stamina + 3 min', once: true, ...contact,
            visibleWhen: all(terms, eq('remainderHome.conditioned')), requires: all(benchWork, eda, eq('remainderHome.conditioned'), eq('remainderHome.ordinarySkill'), eq('remainderHome.playerKit')),
            ...timed(3, all(benchWork, eda, eq('remainderHome.conditioned'), eq('remainderHome.ordinarySkill'), eq('remainderHome.playerKit')), I.bench, true),
            costs: [item(K.log, -1), item(K.kit, -1), stamina(-3), stamina(-1, I.eda)],
            effects: [item(K.log, 1, 'player', true), item(K.kit, 1, 'player', true),
                know('ordinary_trial', 'With my actually recovered conditioned grip and current ordinary climbing skill, I completed a witnessed three-minute ordinary field-load trial at Eda\'s permitted outer strip. I spent three stamina carrying one actual log and kit; both held objects returned once. Eda spent her own effort to witness it. This trial gives no source, stock or XP; it is the prerequisite for one local training choice.'),
                know('trial_witness', 'I physically witnessed the traveler complete the paid-effort ordinary field-load trial with their own real log, kit, current skill and recovered conditioned hands. The returned objects stayed theirs.', 'seen', I.eda)]}),
        ...[['ordinary', 4, 2, []], ['delicate', 2, 1, [eq('remainderHome.fineSpecialist', true, 'Only the earned delicate-fitting choice supports this precise two-minute use.')]]].map(([name, duration, effort, extra]) => {
            const support = all(benchWork, eq('remainderHome.researchKnown'), eq('remainderHome.jigBuilt'), eq('remainderHome.jig'), ...extra);
            return command({id: P + 'salvage_' + name, label: `${name === 'delicate' ? 'Use delicate fitting' : 'Use ordinary jig salvage'} · 2 compatible offcuts + held jig + ${effort} stamina + ${duration} min`,
                visibleWhen: all(eq('remainderHome.jigBuilt'), ...(name === 'delicate' ? [eq('remainderHome.fineSpecialist')] : [])), requires: support, ...timed(duration, support),
                costs: [item(K.offcut, -2), item(K.jig, -1), stamina(-effort)], effects: [item(K.jig, 1, 'player', true), item(K.sound, 1),
                    know('salvage_' + name, `Two counted Compatible repair offcuts became one actual Sound repair stave in ${duration} played minutes. Your owned measuring jig was reserved and returned exactly once. ${name === 'delicate' ? 'The earned delicate-fitting branch supplied this narrow faster fit.' : 'Ordinary measured fitting remains available without either specialization.'} The sound stave can supply the existing brace, grain matching or kit recipes.`)]});
        }),
        // The host sends these visible command IDs to the actual progression
        // executor. Lane validation rejects a generic command-only substitute.
        ...[[I.loadedChoice, I.loadedAdvance], [I.fineChoice, I.fineAdvance]].map(([id, advancementId]) => command({id,
            label: advancementId === I.loadedAdvance ? 'Choose loaded-survey specialization · 2 coins + 1 sap + our effort' : 'Choose delicate-fitting specialization · 2 coins + 1 sap + our effort',
            ...contact, advancementId, costs: specializationCosts, visibleWhen: all(terms, eq('remainderHome.conditioned'), eq('remainderHome.fieldTrial')),
            requires: specializationSupport, description: 'One explicit mutually exclusive local progression choice. The other remains visible as foregone training. Physical tools, material, supported hands and ordinary routes stay authoritative.'})),
        ...[['ordinary', 3, []], ['loaded', 2, [eq('remainderHome.loadedSpecialist', true, 'This controlled loaded use needs the earned loaded-survey branch.')]]].map(([name, effort, extra]) => {
            const support = all(enrolled, eq('remainderHome.workshopSupported'), eq('remainderHome.playerKit'), ...extra);
            return command({id: P + 'survey_' + name, location: 'Shack', label: `${name === 'loaded' ? 'Control the loaded' : 'Make an ordinary loaded'} workshop survey · held log + held kit + ${effort} stamina + 4 min`,
                visibleWhen: all(eq('remainderHome.workshopEarned'), ...(name === 'loaded' ? [eq('remainderHome.loadedSpecialist')] : [])), requires: support, ...timed(4, support, I.workshop),
                costs: [item(K.log, -1), item(K.kit, -1), stamina(-effort)], effects: [item(K.log, 1, 'player', true), item(K.kit, 1, 'player', true),
                    know('survey_' + name, `I surveyed my earned Shack workshop approach while carrying one actual log and my real kit for four played minutes. Both held objects were returned once. ${name === 'loaded' ? 'My earned loaded-survey training kept control with two stamina instead of the ordinary three.' : 'The ordinary three-stamina route remains useful without either specialization.'} This firsthand load survey grants no material or repeated training reward.`)]});
        }),
        command({id: P + 'room_terms', location: 'Shack', label: 'Choose one permitted guest-room plan · no construction or invitation yet', once: true,
            visibleWhen: all(enrolled, terms, eq('remainderHome.workshopEarned')), requires: all(enrolled, terms, eq('remainderHome.workshopSupported')),
            effects: [af('roomTerms', I.workshop), {type: 'world', worldId: I.world, key: `project.${I.room}.started`, value: true},
                know('room_terms', 'I authorize one guest room inside my actually assembled, player-owned field-workshop site at the native Shack. Two staged phases consume two logs, four construction coins, seven played minutes and three stamina; a counted kit is held and returned in finishing. Only the finished room grants one residence claim. A later one-time willing invitation requires a separate real kit, log and two-coin starter purse. No automatic rent, food drain or supply refill is created.', 'understood')] }),
        ...roomCommands,
        command({id: P + 'meet_resident', location: 'Shack', label: 'Meet Neri\'s actual bounded residence and work terms', once: true,
            visibleWhen: eq('remainderHome.roomCompleted'), requires: all(roomSupport, eq('remainderHome.roomCompleted'), unoccupied),
            effects: [{type: 'spawn', personId: I.resident, definitionId: I.resident}, af('willing', true, I.resident), af('residentMet'),
                {type: 'source', actor: I.resident, sourceId: I.method, operation: 'grant', origin: 'trained', awakened: true, active: true},
                {type: 'power', actor: I.resident, powerId: I.method, operation: 'learn'},
                know('resident_method', 'I learned ordinary kit binding through my earlier local work. I arrive with my own living two-handed body and finite attention, but no timber, kit or purse. I will choose one funded stay and one supported binding job, retain my own tool and unspent wage, and may leave after reserved work ends.', 'understood', I.resident),
                know('resident_terms', 'Neri is an independent willing local kit binder with her own body, learned operation and finite attention. Meeting her supplies no tool, wage, residence or result. Invite supplies one actual kit, one log and two native coins to her own stock/purse. She independently accepts supported terms, occupies the one room and performs at most one material service. One coin pays her fittings expense; one remains hers. One produced kit may be collected after her actual job. Decline is free; departure ends future offers while retaining her identity and earned property.', 'understood', 'player', I.resident, 'instruction')]}),
        command({id: P + 'invite', location: 'Shack', label: 'Offer funded invitation · transfer 1 kit + 1 log + 2 coins', once: true, targetId: I.resident, coLocated: true, participants: ['$target'],
            visibleWhen: all(eq('remainderHome.residentMet'), eq('remainderHome.invitationOpen')),
            requires: all(roomSupport, unoccupied, resident, eq('remainderHome.invitationOpen'), eq('remainderHome.residentMethod')),
            costs: [transfer('player', I.resident, K.kit), transfer('player', I.resident, K.log), money(-2)],
            effects: [coins(2, I.resident), af('invited'), af('invitationPending', true, I.resident),
                know('invitation', 'I transferred one actual kit, one log and two native coins to Neri\'s separate stock and purse under her one-stay terms. This is a supplied invitation, not an immediate occupant or finished service. Her own controller must still accept with the completed vacant room, current willingness and living supported body. The supplies are hers; meeting or rendering cannot refill them.')] }),
        command({id: P + 'decline', location: 'Shack', label: 'Decline Neri\'s invitation · keep room and supplies', once: true, targetId: I.resident, coLocated: true,
            visibleWhen: all(eq('remainderHome.residentMet'), eq('remainderHome.invitationOpen')), requires: all(roomSupport, resident, eq('remainderHome.invitationOpen')),
            effects: [af('declined'), know('declined', 'I declined the one local invitation. The completed residence claim remains unoccupied; no kit, log, coin, occupation, service or debt changed hands. Neri remains the same independent person.')] }),
        command({id: P + 'resident_accept', actorId: I.resident, location: 'Shack', label: 'Neri chooses the supported funded stay', audience: ['$actor'], once: true,
            requires: all(enrolled, eq('remainderHome.localClock'), resident, eq('remainderHome.residentMethod'), eq('remainderHome.invitationFunded'), unoccupied),
            effects: [{type: 'claim', operation: 'transfer', key: I.residence, actor: 'player', target: I.resident}, af('accepted', true, I.resident), af('invitationPending', false, I.resident), af('serviceOffered', true, I.resident),
                know('acceptance', 'I choose the one funded stay in the actual completed vacant Shack room. Its unique residence claim now records my occupancy. I own the supplied kit, log and purse. I will decide on my own one supported binding service; arrival produces no material.', 'seen', I.resident)]}),
        command({id: P + 'resident_bind', actorId: I.resident, location: 'Shack', label: 'Neri performs her one funded kit-binding service', audience: ['$actor'], once: true, powerId: I.method,
            requires: residentReady, ...timed(5, residentReady, I.workshop), costs: [item(K.log, -1, I.resident), item(K.kit, -1, I.resident), coins(-1, I.resident), stamina(-2, I.resident), attention(-1)],
            effects: [item(K.kit, 1, I.resident, true), item(K.kit, 1, I.resident), af('serviceDone', true, I.resident), af('serviceOffered', false, I.resident),
                know('service', 'I spent my supplied log, one actual purse coin for fittings, two of my stamina, one attention and five played minutes to make one new Prepared survey kit. My counted tool kit returned exactly once and stays mine. I retain my remaining coin. The new product belongs to me until the disclosed collection transfer; no second service is promised.', 'seen', I.resident)]}),
        command({id: P + 'hear_resident', location: 'Shack', label: 'Hear Neri\'s current public residence and work account', targetId: I.resident, coLocated: true,
            visibleWhen: eq('remainderHome.residentMet'), requires: all(roomSupport, resident), effects: [
                know('resident_report', 'I met Neri at the real Shack room. Arrival, occupancy, her funded work and collection are separate commitments. Her completed public work is available through its own known collection control; this meeting grants no stock, occupation or wage.', 'seen', 'player', I.resident, 'recollection')] }),
        command({id: P + 'collect_resident', location: 'Shack', label: 'Collect Neri\'s one actually produced kit', once: true, targetId: I.resident, coLocated: true, participants: ['$target'],
            visibleWhen: all(eq('remainderHome.workshopSupported'), resident, eq('remainderHome.residentDone')), requires: all(roomSupport, resident, eq('remainderHome.residentDone'), eq('remainderHome.occupied')),
            costs: [transfer(I.resident, 'player', K.kit)], effects: [af('collected'),
                know('collected', 'Neri transferred the one actual Prepared survey kit produced by her completed paid service. Her returned tool kit, unspent coin, body and previous work remain hers. This kit supports the existing native field preparation, packing, orders and trade; collection cannot repeat.')] }),
        command({id: P + 'departure', location: 'Shack', label: 'Agree Neri\'s once-only departure · release occupancy after work', once: true, targetId: I.resident, coLocated: true, participants: ['$target'],
            visibleWhen: all(eq('remainderHome.workshopSupported'), resident, eq('remainderHome.occupied')), requires: all(roomSupport, resident, eq('remainderHome.occupied'), eq('remainderHome.residentFree', true, 'Wait for Neri\'s reserved job to finish or return its unsupported inputs before departure.')),
            effects: [{type: 'claim', operation: 'transfer', key: I.residence, actor: I.resident, target: 'player'}, af('departed'), af('willing', false, I.resident), af('serviceOffered', false, I.resident),
                {type: 'life', actor: I.resident, status: 'departed', reason: 'Completed the agreed one-stay residence; independent person and property retained.'},
                know('departure', 'We ended the one stay after all Neri\'s reservations had ended. Her occupancy claim returned to me; her stable departed person, actual tool, purse and prior results remain retained. The one invitation cannot respawn her or fund another stay. Any uncollected product remains hers, and no new room removal action is granted.', 'seen', 'player', I.resident, 'recollection')] }),
    ],
    controllers: [{id: P + 'resident_controller', revision: 1, label: 'Neri\'s bounded independent choices', actorId: I.resident, interval: 1,
        actions: [{commandId: P + 'resident_accept', priority: 2}, {commandId: P + 'resident_bind', priority: 1}]}],
};
