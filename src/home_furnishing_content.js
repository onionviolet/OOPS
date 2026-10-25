// Original reversible fit-out proposals. Importing these definitions creates
// no home, resident, native item, source, stock, clock or persistence domain.
import {all, deepFreeze as freeze, eq} from './basics.js';
import {compileSiteProject} from './site_projects.js';
import {REMAINDER_HOME_KEYS as existingKeys} from './audit_remainder_home_content.js';
import {MOL_KEYS} from './book_world_mol_ids.js';
import {itemPlayerReturned as item, moneyActorNativeKey as money} from './content_kit.js';

export const HOME_FURNISHING_IDS = Object.freeze({prefix: 'home_furnishings.', group: 'home_furnishings',
    world: 'base.frontier', site: 'field.assembly', location: 'Shack', situation: 'home_furnishings.fit_out',
    survey: 'home_furnishings.survey', rack: 'home_furnishings.drying_rack', bench: 'home_furnishings.drafting_bench',
    dryFirst: 'home_furnishings.first_drying', dry: 'home_furnishings.dry_offcuts', adapt: 'home_furnishings.adapt_notebook',
    salvage: 'home_furnishings.draft_stave', pack: 'home_furnishings.draft_kit'});
export const HOME_FURNISHING_KEYS = Object.freeze({log: existingKeys.log, sap: existingKeys.sap, kit: existingKeys.kit,
    green: existingKeys.green, offcut: existingKeys.offcut, sound: existingKeys.sound,
    sharp: existingKeys.sharp, dull: existingKeys.dull, notebook: MOL_KEYS.notes});
const I = HOME_FURNISHING_IDS, K = HOME_FURNISHING_KEYS, P = I.prefix;
const af = (name, value = true) => ({type: 'fact', scope: 'actor', actor: 'player', key: P + name, value});
const wf = (key, value = true) => ({type: 'world', worldId: I.world, key, value});
const effort = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const know = (name, value, stage = 'seen') => ({type: 'knowledge', actor: 'player', key: P + name, stage, value,
    basis: {kind: 'observation', attributedTo: 'player', situationId: I.situation}});
const supported = eq('homeFurnishings.supported', true, 'Return to your actually assembled, owned Shack field workshop with your living controlled native human body and usable hands.');
const kit = eq('homeFurnishings.kit', true, 'Carry your actual unborrowed, unequipped kit, or retain this exact accepted job\'s reservation.');
const rights = eq('homeFurnishings.rights', true, 'Complete the paid fit-out survey and accept its two specific fixture permissions.');
const work = all(supported, rights);
const rack = all(work, eq('homeFurnishings.rackBuilt', true, 'Finish both physical drying-rack construction phases.'));
const mature = eq('homeFurnishings.matureNotebook', true, 'Bring your actually compiled mature Cyorian design notebook; a count, title, memory or lamp is insufficient.');
const bench = all(work, eq('homeFurnishings.benchBuilt', true, 'Build the supported fixed-stop drafting bench from your actual materials.'));
const drafted = all(bench, mature, eq('homeFurnishings.adapted', true, 'Complete your own mundane bench adaptation using the actual retained notebook.'));
const timed = (duration, requires) => ({duration, cancellation: 'refund', reservationReturns: 1, siteId: I.site,
    completionRequires: requires, completionFailure: 'refund', completionCoLocated: false});
const cmd = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: I.location,
    costs: [], effects: [], ...d});
const phase = d => ({actorId: 'player', location: I.location, siteId: I.site, cancellation: 'refund', completionFailure: 'refund', completionCoLocated: false, ...d});

export const homeFurnishingProjects = [
    {id: I.rack, revision: 1, worldId: I.world, phases: [
        phase({id: 'frame', label: 'Frame your workshop drying rack · 2 logs + held kit + 2 stamina + 4 min', duration: 4,
            visibleWhen: rights, requires: all(work, kit), completionRequires: all(work, kit),
            costs: [item(K.log, -2), item(K.kit, -1), effort(-2)], effects: [item(K.kit, 1, true),
                know('rack_frame', 'Two actual Rough wood logs became the drying-rack uprights and rails inside your earned Shack workshop. Your kit was held and returned once; four played minutes and two stamina were spent. A frame cannot dry stock. No room, resident, source or material was granted.')]}),
        phase({id: 'finish', after: ['frame'], label: 'Finish the ventilated drying rack · 1 log + 1 sap + held kit + 1 stamina + 3 min', duration: 3,
            visibleWhen: eq('homeFurnishings.rackFrame'), requires: all(work, kit), completionRequires: all(work, kit),
            costs: [item(K.log, -1), item(K.sap, -1), item(K.kit, -1), effort(-1)], effects: [item(K.kit, 1, true), wf(P + 'rackBuilt'),
                know('rack_finished', 'One further real log and one Tree sap became the spaced drying rails. The kit returned once after three played minutes and one stamina. This stationary fixture permits only the new four-minute two-offcut drying job in this workshop. It supplies no stock and changes no old rack, weather, room or residence rule.')]}),
    ]},
    {id: I.bench, revision: 1, worldId: I.world, phases: [
        phase({id: 'frame', label: 'Frame a fixed-stop drafting bench · 1 log + 1 sound stave + held kit + 2 stamina + 4 min', duration: 4,
            visibleWhen: all(eq('homeFurnishings.rackUsed'), eq('homeFurnishings.matureRecord')),
            requires: all(rack, eq('homeFurnishings.rackUsed'), eq('homeFurnishings.matureRecord'), kit),
            completionRequires: all(rack, eq('homeFurnishings.rackUsed'), eq('homeFurnishings.matureRecord'), kit),
            costs: [item(K.log, -1), item(K.sound, -1), item(K.kit, -1), effort(-2)], effects: [item(K.kit, 1, true),
                know('bench_frame', 'Your actual log became the bench frame and one dry Sound repair stave became its fixed measuring stop. This follows your own rack-drying result and actual mature Cyoria notebook compilation. Four played minutes and two stamina were spent; your kit returned once. The frame grants no recipe or magical interface.')]}),
        phase({id: 'finish', after: ['frame'], label: 'Finish your drafting surface · 2 dry offcuts + 1 sap + held kit + 1 stamina + 3 min', duration: 3,
            visibleWhen: eq('homeFurnishings.benchFrame'), requires: all(work, kit), completionRequires: all(work, kit),
            costs: [item(K.offcut, -2), item(K.sap, -1), item(K.kit, -1), effort(-1)], effects: [item(K.kit, 1, true), wf(P + 'benchBuilt'),
                know('bench_finished', 'Two counted Compatible repair offcuts and one sap became the drafting surface and stops. Your kit returned once after three played minutes and one stamina. This fixed home bench is physically distinct from Eda\'s Village bench and from your portable jig; neither is changed or duplicated. A separate actual notebook adaptation is still needed.')]}),
    ]},
];
const construction = homeFurnishingProjects.flatMap(project => compileSiteProject(project).map(d => ({...d, group: I.group, reservationReturns: 1})));
const situation = {id: I.situation, revision: 1, label: 'Your paid workshop fit-out survey',
    context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
    participants: ['player'], initialPhase: 'surveyed', phases: ['surveyed'], privateTruth: {scope: 'two_stationary_workshop_fixtures'}};
export const homeFurnishingDefinitions = {
    situations: [situation],
    commands: [
        cmd({id: I.survey, label: 'Survey and register two workshop fixtures · 2 coins + held kit + 1 stamina + 3 min', once: true,
            claim: P + 'survey_right', visibleWhen: eq('homeFurnishings.workshopEarned'), requires: all(supported, kit), ...timed(3, all(supported, kit)),
            costs: [money(-2), item(K.kit, -1), effort(-1)], effects: [item(K.kit, 1, true),
                {type: 'situation', operation: 'begin', situationId: I.situation, definition: situation}, af('right', I.site),
                ...homeFurnishingProjects.map(project => wf(`project.${project.id}.started`)),
                know('survey', 'You paid two construction coins and physically surveyed your own completed Shack field workshop using your real kit. Three played minutes and one stamina registered permission for one ventilated drying rack and one fixed-stop drafting bench. Each fixture still needs its supplied physical phases. This opt-in has no automatic upkeep, dismantling, housing, resident, source, casting, fuel or free material. The existing guest room, Neri\'s occupation/service and old facilities retain their own claims and rules.', 'understood')],
            description: 'Original reversible fit-out proposal at your earned workshop. Payment covers this completed survey only. Cancel or lose actual completion support to refund coins, kit and effort without a right or fixture.'}),
        ...construction,
        ...[true, false].map(first => cmd({id: first ? I.dryFirst : I.dry,
            label: `${first ? 'Complete the first' : 'Dry another'} two-offcut rack batch · 1 stamina + 4 min`,
            ...(first ? {once: true, claim: P + 'first_drying'} : {}),
            visibleWhen: all(eq('homeFurnishings.rackBuilt'), ...(!first ? [eq('homeFurnishings.rackUsed')] : [])),
            requires: first ? rack : all(rack, eq('homeFurnishings.rackUsed')),
            ...timed(4, first ? rack : all(rack, eq('homeFurnishings.rackUsed'))), costs: [item(K.green, -2), effort(-1)], effects: [item(K.offcut, 2),
                know(first ? 'rack_first_drying' : 'rack_drying', 'Two actual Green repair offcuts dried on your physically finished spaced rack into two Compatible repair offcuts. Four played minutes and one stamina were spent. The same counted pieces changed condition; no log, jig, recipe, arbitrary wet item or automatic idle output was supplied.')],
            description: 'A useful local fixture consumer: four minutes and one stamina instead of the existing Village offcut route\'s six minutes and two stamina. The first completed batch retains its own permanent work receipt; later batches cannot replace it. Those old jobs and their weather rules remain unchanged.'})),
        cmd({id: I.adapt, label: 'Adapt your own Cyoria notebook to mundane bench stops · held notebook + 1 sap + 1 stamina + 4 min', once: true,
            claim: P + 'adaptation', visibleWhen: all(eq('homeFurnishings.benchBuilt'), eq('homeFurnishings.matureRecord')),
            requires: all(bench, mature), ...timed(4, all(bench, mature)), costs: [item(K.notebook, -1), item(K.sap, -1), effort(-1)],
            effects: [item(K.notebook, 1, true), af('adapted'),
                know('adaptation', 'You used your own actually compiled Cyorian annotated design notebook to compare tested manual control, measured stops and honest observation limits with this built home bench. One sap marked the physical stops; four played minutes and one stamina produced your own mundane fitting plan. The same notebook returned once. This original mechanical adaptation permits only the new counted offcut fitting and knife-and-stave kit jobs here. It imports no lamp operation, mana, personal spell source, teacher\'s talent, future event or universal formula conversion.', 'understood')]}),
        cmd({id: I.salvage, label: 'Fit two dry offcuts with your drafted stops · held notebook + 1 stamina + 3 min',
            visibleWhen: eq('homeFurnishings.adapted'), requires: drafted, ...timed(3, drafted),
            costs: [item(K.offcut, -2), item(K.notebook, -1), effort(-1)], effects: [item(K.notebook, 1, true), item(K.sound, 1),
                know('drafted_stave', 'Two actual Compatible repair offcuts fitted against your built bench stops became one Sound repair stave after three played minutes and one stamina. Your own mature notebook was reserved and returned once. This mundane fit uses the fixed home bench; the old portable jig and delicate/ordinary specialization routes retain their own costs and permission.')]}),
        cmd({id: I.pack, label: 'Cut one drafted survey kit · 1 sound stave + 1 sap + held knife/notebook + 1 stamina + 3 min',
            visibleWhen: eq('homeFurnishings.adapted'),
            requires: all(drafted, eq('homeFurnishings.sharpKnife', true, 'Carry your own unborrowed sharp Field fitting knife; this job returns its actual dulled variant.')),
            ...timed(3, all(drafted, eq('homeFurnishings.sharpKnife'))),
            costs: [item(K.sound, -1), item(K.sap, -1), item(K.sharp, -1), item(K.notebook, -1), effort(-1)],
            effects: [item(K.notebook, 1, true), item(K.dull, 1, true), item(K.kit, 1),
                know('drafted_kit', 'One actual Sound repair stave and one Tree sap became one Prepared survey kit using the fixed home stops and your actual sharp fitting knife. Three played minutes and one stamina were spent. The same knife returned dulled and the same notebook returned unchanged, each once. The ordinary native kit can supply existing expedition preparation, work, field commissions, stock orders and trade. A repeat needs another actual stave/sap and a restored owned sharp knife; no demand, wage or stock refills.')]}),
    ],
};
freeze(homeFurnishingProjects); freeze(homeFurnishingDefinitions);
export const homeFurnishingPublicCommandIds = Object.freeze(homeFurnishingDefinitions.commands.map(d => d.id));
