// Original, reversible functional objects proposal. Importing definitions never
// enrolls people, creates native stock, teaches a method or advances time.
import {dryingRewardDefinition} from './earned_drying_tracker.js';
export const FEATURE_OBJECT_IDS = Object.freeze({
    world: 'base.frontier', group: 'feature_objects', miri: 'feature_objects.miri',
    situation: 'feature_objects.sluice', site: 'feature_objects.fitting_bench',
    method: 'feature_objects.grain_matching', loan: 'feature_objects.knife_loan',
    begin: 'feature_objects.begin',
});
const I = FEATURE_OBJECT_IDS;
export const FEATURE_OBJECT_ITEMS = Object.freeze([
    {id: 'Field fitting knife', description: 'A sharp, held fitting tool. One cutting batch dulls it; it is not a weapon or an equipped stat bonus.', value: 6, kind: 'tool', condition: 'sharp'},
    {id: 'Dulled field fitting knife', description: 'The same fitting tool after cutting. Restore its edge before another cutting batch.', value: 4, kind: 'tool', condition: 'dulled'},
    {id: 'Fine field fitting knife', description: 'A sharp fitting knife with a narrow, refitted guide. Learned grain matching needs this guide; ordinary cuts still work.', value: 9, kind: 'tool', condition: 'sharp'},
    {id: 'Dulled fine field fitting knife', description: 'A dulled guided fitting knife. Sharpen it without discarding its refitted guide.', value: 7, kind: 'tool', condition: 'dulled'},
    {id: 'Broad field fitting knife', description: 'PROPOSAL: Common rarity, fixed item level 1. Cutting yield 3 wet staves per log instead of 2. The broad back recovers an extra usable strip; it cannot support Grain matching. Cutting dulls it.', value: 9, kind: 'tool', condition: 'sharp'},
    {id: 'Dulled broad field fitting knife', description: 'The broad fitting knife after cutting. Restore its edge with one sap and one stamina. Common rarity, fixed item level 1; its cutting yield remains 3 once sharp.', value: 7, kind: 'tool', condition: 'dulled'},
    {id: 'Wet repair stave', description: 'A real cut stave that still holds moisture. Pressure and a learned method cannot make it dry.', value: 1, kind: 'material'},
    {id: 'Sound repair stave', description: 'A dried stave. It can brace a joint, supply grain matching, or become an actual survey kit.', value: 2, kind: 'material'},
    {id: 'Matched repair stave', description: 'One sound stave cut along its inspected grain. It fits the Village sluice joint without crushing the seal.', value: 4, kind: 'material'},
]);
export const featureObjectItemSpecifications = FEATURE_OBJECT_ITEMS;
const key = id => JSON.stringify({id});
export const FEATURE_OBJECT_KEYS = Object.freeze({
    sharp: key('Field fitting knife'), dull: key('Dulled field fitting knife'),
    fine: key('Fine field fitting knife'), fineDull: key('Dulled fine field fitting knife'),
    broad: key('Broad field fitting knife'), broadDull: key('Dulled broad field fitting knife'),
    wet: key('Wet repair stave'), sound: key('Sound repair stave'), matched: key('Matched repair stave'),
    log: key('Rough wood log'), sap: key('Tree sap'), kit: key('Prepared survey kit'),
});
const K = FEATURE_OBJECT_KEYS;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const gte = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), any = (...rules) => ({any: rules}), not = rule => ({not: rule});
const af = (name, value = true, actor) => ({type: 'fact', scope: 'actor', key: `feature_objects.${name}`, value, ...(actor ? {actor} : {})});
const wf = (name, value) => ({type: 'world', worldId: I.world, key: `feature_objects.${name}`, value});
const item = (key, amount, actor = 'player', returned = false) => ({type: 'item', key, amount, actor, ...(returned ? {reservationReturn: true} : {})});
const money = amount => ({type: 'resource', native: true, key: 'money', amount, actor: 'player'});
const coins = (amount, actor = I.miri) => ({type: 'resource', key: 'coins', amount, actor});
const stamina = (amount, actor = 'player') => ({type: 'vital', key: 'stamina', amount, actor});
const know = (name, text, stage = 'seen', actor = 'player', attributedTo = 'player', kind = 'observation') => ({type: 'knowledge', actor, key: `feature_objects.${name}`, stage, value: text,
    basis: {kind, attributedTo, situationId: I.situation}});
const learned = all(eq(`power.${I.method}.owned`), eq(`faculty.${I.method}.active`, true, 'Restore your actual acquired Grain matching source.'),
    eq(`knowledge.feature_objects.method.understood`));
const introduced = eq('actor.feature_objects.introduced');
const live = all(eq('featureObjects.supported', true, 'This Village work needs the current native body, location, stock and supported local clock.'),
    eq('featureObjects.handsUsable', true, 'Recover your hands before fitting work.'), gte('vital.health', 2, 'Recover above one HP before fitting work.'));
const lender = eq('featureObjects.miriSupported', true, 'Eda needs present consent, her own living body and free attention.');
const own = variant => eq(`featureObjects.own.${variant}`, true, 'Carry an owned, unequipped and unborrowed knife in the declared condition.');
const loan = variant => eq(`featureObjects.loan.${variant}`, true, 'Carry the exact matching Eda loan in the declared condition.');
const custody = (variant, returning = false) => ({type: 'custody', from: returning ? 'player' : I.miri, to: returning ? I.miri : 'player',
    key: K[variant], count: 1, loanId: I.loan, ...(returning ? {returning: true} : {})});
const command = d => Object.fromEntries(Object.entries({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village', costs: [], effects: [], ...d,
    requires: d.id === I.begin ? d.requires : all(introduced, d.requires)}).filter(([, value]) => value !== undefined));
const timed = requires => ({completionRequires: requires, completionFailure: 'refund'});
const contact = requires => ({...timed(all(requires, lender)), completionCoLocated: true, targetId: I.miri, coLocated: true, participants: ['$target']});

// The returned variant is explicitly a transformed existing tool, not a found
// item. Borrowed transformations use only supported custody/item effects, in
// order: return, transform under actual owner, reloan under the same loan ID.
function toolUse(variant, borrowed = false) {
    const worn = variant === 'broad' ? 'broadDull' : variant === 'fine' ? 'fineDull' : 'dull';
    return borrowed ? {costs: [], effects: [custody(variant, true), item(K[variant], -1, I.miri), item(K[worn], 1, I.miri, true), custody(worn)]}
        : {costs: [item(K[variant], -1)], effects: [item(K[worn], 1, 'player', true)]};
}
function knifeBatch(id, label, variant, borrowed, costs, effects, duration, requirements, description, extra = {}) {
    const use = toolUse(variant, borrowed), support = all(live, ...(borrowed ? [loan(variant)] : []), ...requirements);
    return command({id: `feature_objects.${id}_${variant}_${borrowed ? 'loan' : 'own'}`, label: `${label} · ${duration} min`, duration, cancellation: 'refund', siteId: I.site,
        visibleWhen: all(introduced, ...(id === 'match' ? [eq('knowledge.feature_objects.alignment.seen')] : [])),
        requires: all(live, borrowed ? loan(variant) : own(variant), ...requirements),
        ...(borrowed ? contact(support) : timed(support)), costs: [...costs, ...use.costs], effects: [...use.effects, ...effects],
        description: `${description} The sharp knife becomes its dulled variant on completion. Cancellation restores reserved inputs, produces nothing and leaves the knife's condition unchanged.${borrowed ? ' Eda is reserved with you; her same loan follows the worn tool and may then be returned.' : ' The owned knife is held in this job, so other work cannot spend it.'}`, ...extra});
}

const cutBatches = ['sharp', 'fine'].flatMap(variant => [false, true].map(borrowed => knifeBatch('cut', 'Cut one actual log into two wet staves', variant, borrowed,
    [item(K.log, -1), stamina(-2)], [item(K.wet, 2), know('cut', 'You cut one real Rough wood log into two Wet repair staves. The knife dulled; these pieces still need drying.')], 4, [],
    'One log and two stamina become two wet staves, not two already sound parts. No native skill unlock or XP is inferred.')));
const matchBatches = [false, true].map(borrowed => knifeBatch('match', 'Match an inspected sound stave along its grain', 'fine', borrowed,
    [item(K.sound, -1), stamina(-1)], [item(K.matched, 1), {type: 'xp', skill: 'Woodworking', amount: 6},
        know('matched', 'Your learned Grain matching and a refitted fine guide made one actual Matched repair stave from one sound stave. Neither wet wood nor a remembered explanation supplies that function.')],
    3, [eq('actor.feature_objects.jointInspected'), learned], 'One sound stave and one stamina feed an acquired, active fitting function. Wet staves are not a substitute.', {powerId: I.method}));
const kitBatches = ['sharp', 'fine'].flatMap(variant => [false, true].map(borrowed => knifeBatch('kit', 'Cut two sound staves into two usable survey kits', variant, borrowed,
    [item(K.sound, -2), item(K.sap, -1), stamina(-2)], [item(K.kit, 2), know('kits', 'You cut two Sound repair staves and used one Tree sap to make two actual Prepared survey kits. Native preparation, work and trade use those same kit items.')],
    4, [], 'Two sound staves, one Tree sap and two stamina become two ordinary native Prepared survey kits. The matching method is optional.')));
const returns = ['sharp', 'dull', 'fine', 'fineDull'].map(variant => command({id: `feature_objects.return_${variant}`, label: 'Return the exact borrowed knife · receive your 2-coin deposit',
    targetId: I.miri, coLocated: true, participants: ['$target'], visibleWhen: all(introduced, loan(variant)), requires: all(live, lender, loan(variant)), costs: [coins(-2)],
    effects: [custody(variant, true), money(2), af('depositHeld', false), know('returned', 'You returned the actual knife in its current condition. Eda paid the two coins she held as your deposit; the loan is closed.')],
    description: 'Sharp, dulled and fine variants have distinct matching returns. Returning creates no replacement tool, wage or friendship reward.'}));
const repairs = [['dull', 'sharp'], ['fineDull', 'fine']].flatMap(([from, to]) => [false, true].map(borrowed => command({
    id: `feature_objects.repair_${from}_${borrowed ? 'loan' : 'own'}`, label: 'Restore the knife edge · 1 sap + 1 stamina',
    targetId: borrowed ? I.miri : undefined, coLocated: borrowed, ...(borrowed ? {participants: ['$target']} : {}),
    visibleWhen: all(introduced, borrowed ? loan(from) : own(from)), requires: all(live, borrowed ? all(lender, loan(from)) : own(from)),
    costs: [item(K.sap, -1), stamina(-1), ...(!borrowed ? [item(K[from], -1)] : [])],
    effects: [...(borrowed ? [custody(from, true), item(K[from], -1, I.miri), item(K[to], 1, I.miri, true), custody(to)] : [item(K[to], 1, 'player', true)]),
        know('edgeRestored', 'You used one Tree sap to hold the bench abrasive and one stamina to restore the actual dulled edge. A fine guide stays fine; the owner and any deposit are unchanged.')],
    description: 'Eda permits this atomic loan repair at her bench. Owned repair uses the same physical edge restoration. There is no duration or reward for merely viewing it.'})));
const refits = [['sharp', 'fine'], ['dull', 'fineDull']].map(([from, to]) => command({id: `feature_objects.refit_${from}`, label: 'Refit your own knife with a fine guide · 1 log + 1 sap + 3 min',
    duration: 3, cancellation: 'refund', siteId: I.site, visibleWhen: all(introduced, eq('knowledge.feature_objects.alignment.seen')),
    requires: all(live, own(from), eq('knowledge.feature_objects.alignment.seen')), ...timed(live),
    costs: [item(K[from], -1), item(K.log, -1), item(K.sap, -1), stamina(-1)], effects: [item(K[to], 1, 'player', true),
        know('refit', 'You fitted an actual narrow guide from one log and one sap to your own knife. The sharp or dull edge condition was preserved. This provides a tool, not Grain matching knowledge or a new source.')],
    description: 'Refitting changes an owned tool into one corresponding fine tool. Return a loan before choosing this permanent change; no borrowed object is silently appropriated.'}));

// LP7 reuses the existing one-slot bench, exact native item transformations and
// scheduler. Older refit definitions remain unchanged for accepted saved jobs.
const materialChoices = [['broad', 'stat', 'Broad back: cutting yield 2 → 3', 'Cutting yield increases from two to three wet staves for the same log, effort and time. Grain matching remains unavailable.'],
    ['fine', 'function', 'Fine guide: enable learned Grain matching', 'Cutting yield stays two. This guide supports the existing Grain matching task only after its separate lesson, source and joint inspection.']]
    .map(([to, kind, label, effect]) => command({id: `feature_objects.choose_${kind}`, label: `PROPOSAL · ${label} · 1 log + 1 sap + 3 min`,
        duration: 3, cancellation: 'refund', siteId: I.site, visibleWhen: introduced,
        requires: all(live, own('sharp')), ...timed(live),
        costs: [item(K.sharp, -1), item(K.log, -1), item(K.sap, -1), stamina(-1)],
        effects: [item(K[to], 1, 'player', true), know(`choice_${kind}`, `Your owned sharp fitting knife, one Rough wood log and one Tree sap became one ${to === 'broad' ? 'Broad' : 'Fine'} field fitting knife. ${effect} Rarity: Common. Item level: 1 (fixed). Learned method: unchanged.`)],
        description: `One material choice at Eda's single fitting slot. ${effect} Rarity: Common; item level: 1 (fixed); learned method: separate. Cancellation restores the exact knife, log, sap and effort. An existing broad or fine knife cannot stack this refit.`}));
const broadCut = knifeBatch('cut', 'Cut one actual log into three wet staves · yield stat 3', 'broad', false,
    [item(K.log, -1), stamina(-2)], [item(K.wet, 3), know('broad_cut', 'Your broad knife recovered three actual Wet repair staves from one Rough wood log, with the ordinary two stamina and four minutes. Cutting yield 3 replaced the ordinary yield 2. The knife dulled; drying and Grain matching remain separate.')],
    4, [], 'The broad back improves the cutting-yield stat by one. It provides no fine guide or learned method.');
const broadRepair = command({id: 'feature_objects.repair_broad', label: 'Restore the broad knife edge · 1 sap + 1 stamina',
    visibleWhen: all(introduced, own('broadDull')), requires: all(live, own('broadDull')),
    costs: [item(K.broadDull, -1), item(K.sap, -1), stamina(-1)], effects: [item(K.broad, 1, 'player', true),
        know('broad_restored', 'One actual sap and one stamina restored your broad edge. Its cutting yield remains three; no refit or method was awarded.')]});

export const featureObjectSources = [{id: I.method, revision: 1, label: 'Learned Grain matching', kind: 'knowledge', grants: [],
    bioDetail: 'An instructed, practiced fitting method. It needs sound wood, the fine guide and usable hands; remembered explanation is not a tool.'}];
export const featureObjectDefinitions = {
    people: [{id: I.miri, revision: 1, label: 'Eda, Village sluice fitter', worldId: I.world, location: 'Village', inventory: 'simulation', provision: false,
        resources: {coins: 12, kitOrders: 2}, body: {hands: 2}, vitals: {health: 18, max_health: 18, stamina: 12, max_stamina: 12}}],
    sites: [{id: I.site, revision: 1, label: 'Eda\'s dry fitting bench', capacity: 1}],
    powers: [{id: I.method, revision: 1, label: 'Grain matching', model: 'practice', capacity: 1, worlds: [I.world], execution: all(live, learned)}],
    situations: [{id: I.situation, revision: 1, label: 'The leaking joint', context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
        participants: ['player', I.miri], initialPhase: 'offered', phases: ['offered', 'braced', 'sealed'], privateTruth: {fault: 'wet_stave_swollen_across_grain', limit: 'one_local_drying_shelf'}}],
    commands: [
        command({id: I.begin, label: 'Ask Eda about the leaking drying shelf', once: true, claim: 'feature_objects.opening',
            visibleWhen: eq('village.craftsmanMet'), requires: all(live, eq('village.craftsmanMet')),
            description: 'An optional Village fitting problem after meeting the ordinary craftsman. Asking accepts no job, deposit, lesson or debt. Eda has her own finite stock and coins.',
            effects: [{type: 'spawn', personId: I.miri, definitionId: I.miri}, {type: 'situation', situationId: I.situation, operation: 'begin'},
                {type: 'site', siteId: I.site, actor: I.miri, operation: 'open'}, item(K.sharp, 2, I.miri), item(K.fine, 1, I.miri), item(K.sound, 2, I.miri), item(K.wet, 2, I.miri), item(K.sap, 2, I.miri),
                af('introduced'), af('willing', true, I.miri), af('depositHeld', false), wf('joint', 'leaking'),
                {type: 'source', actor: I.miri, sourceId: I.method, operation: 'grant', origin: 'trained', awakened: true, active: true}, {type: 'power', actor: I.miri, powerId: I.method, operation: 'learn'},
                know('opening', 'Eda says a swollen joint drips onto her drying shelf. She offers a two-coin refundable knife deposit or a six-coin purchase. Bracing needs ordinary sound wood; an offered demonstration may reveal a more exact fitting method.', 'seen', 'player', I.miri)]}),
        command({id: 'feature_objects.inspect', label: 'Inspect the actual swollen joint · 2 min + 1 stamina', once: true, duration: 2, cancellation: 'refund',
            visibleWhen: introduced, requires: all(introduced, live), ...timed(live), costs: [stamina(-1)],
            effects: [af('jointInspected'), know('joint', 'Firsthand joint inspection: the cross-grain swollen stave leaks onto the one Village drying shelf. An ordinary brace can hold it clear while it still seeps; a matching sound-grain insert can seal this particular joint.')],
            description: 'Observe the target yourself. Eda\'s offered report is retained separately; no method, material or repaired target is granted by inspection.'}),
        command({id: 'feature_objects.borrow', label: 'Borrow Eda\'s sharp fitting knife · refundable 2-coin deposit', targetId: I.miri, coLocated: true, participants: ['$target'],
            visibleWhen: introduced, requires: all(introduced, live, lender, eq('featureObjects.loanAbsent')), costs: [money(-2)],
            effects: [coins(2), custody('sharp'), af('depositHeld'), know('borrowed', 'You hold Eda\'s actual sharp fitting knife. She owns it and holds your two-coin deposit. Approved cutting may dull it; return the matching variant to recover the same deposit.', 'seen', 'player', I.miri)],
            description: 'Loan permits named cutting and edge repair, not refitting, selling, spending, storage or onward transfer. A loan never creates an owned duplicate.'}),
        command({id: 'feature_objects.buy', label: 'Buy one actual sharp fitting knife · 6 coins', targetId: I.miri, coLocated: true, participants: ['$target'],
            visibleWhen: introduced, requires: all(introduced, live, lender), costs: [money(-6), {type: 'transfer', from: I.miri, to: 'player', key: K.sharp, count: 1}],
            effects: [coins(6), know('purchase', 'You paid Eda six native coins for one actual sharp fitting knife from her finite stock. The tool is yours; the money is now hers.', 'seen', 'player', I.miri)],
            description: 'Direct payer-to-owner transfer. Availability uses the same actual seller stock and player money as commitment.'}),
        command({id: 'feature_objects.borrow_fine', label: 'Sharpen and borrow Eda\'s demonstrated fine knife · 1 sap + 1 stamina + refundable 2 coins', targetId: I.miri, coLocated: true, participants: ['$target'],
            visibleWhen: all(introduced, eq('knowledge.feature_objects.alignment.seen')),
            requires: all(live, lender, eq('knowledge.feature_objects.alignment.seen'), eq('featureObjects.loanAbsent')),
            costs: [money(-2), item(K.sap, -1), stamina(-1), item(K.fineDull, -1, I.miri)],
            effects: [coins(2), item(K.fine, 1, I.miri, true), custody('fine'), af('depositHeld'),
                know('fineBorrowed', 'You restored the edge on Eda\'s actual demonstrated fine knife and borrowed that same guided tool. Her fine knife remains hers; she holds your two-coin deposit. The guide supplies no learned matching method.', 'seen', 'player', I.miri)],
            description: 'The witnessed demonstration leaves one real dulled fine guide. This atomic sharpening and loan spends your own sap and stamina, then transfers that one existing tool. Close any other knife loan first.'}),
        command({id: 'feature_objects.buy_sound', label: 'Buy Eda\'s one actual sound stave · 2 coins', targetId: I.miri, coLocated: true, participants: ['$target'],
            visibleWhen: introduced, requires: all(introduced, live, lender), costs: [money(-2), {type: 'transfer', from: I.miri, to: 'player', key: K.sound, count: 1}],
            effects: [coins(2), know('materialPurchase', 'Eda handed over one actual Sound repair stave for two coins. Her stock decreased by one; it does not replenish on revisit.', 'seen', 'player', I.miri)]}),
        ...returns, ...repairs, ...refits, ...materialChoices, broadCut, broadRepair, ...cutBatches, ...matchBatches, ...kitBatches,
        command(dryingRewardDefinition),
        ...[['shade', 6, 2, null], ['braced', 4, 1, 'braced'], ['shelf', 2, 1, 'sealed']].map(([route, duration, effort, joint]) => command({id: `feature_objects.dry_${route}`, label: `${route === 'shade' ? 'Dry in the ordinary sheltered rack' : route === 'braced' ? 'Dry along your braced clear working strip' : 'Use your sealed drying shelf'} · ${duration} min`,
            duration, cancellation: 'refund', siteId: I.site, visibleWhen: all(introduced, ...(joint ? [eq(`actor.feature_objects.${joint === 'sealed' ? 'sealed' : 'braced'}`)] : [])),
            requires: all(introduced, live, ...(joint ? [eq('world.feature_objects.joint', joint)] : [])), ...timed(live), costs: [item(K.wet, -1), stamina(-effort)],
            effects: [item(K.sound, 1), know(`dry_${route}`, `One Wet repair stave dried into one actual Sound repair stave in ${duration} played minutes. ${joint === 'sealed' ? 'The sealed joint kept this shelf dry.' : joint === 'braced' ? 'Your brace kept the covered working strip clear while the joint still seeped.' : 'The covered ordinary rack worked without a repaired joint or method.'}`)],
            description: 'This spends the actual wet variant and returns a sound one after paid work. Grain matching cannot skip moisture; ordinary sheltered preparation remains viable.'})),
        command({id: 'feature_objects.observe_alignment', label: 'Watch Eda cut her actual grain sample · 2 min', once: true, duration: 2, cancellation: 'refund', siteId: I.site,
            visibleWhen: introduced, requires: all(introduced, live, lender, eq('featureObjects.miriFunctionSupported')), ...contact(all(live, eq('featureObjects.miriSourceSupported'))),
            costs: [item(K.sound, -1, I.miri), item(K.fine, -1, I.miri), stamina(-1, I.miri)],
            effects: [item(K.matched, 1, I.miri), item(K.fineDull, 1, I.miri, true),
                know('alignment', 'Firsthand demonstration: Eda used her acquired method, one real sound stave and her fine guided knife to match the grain. The stave became her Matched repair stave and the actual knife dulled. You saw a function, but have not learned to execute it.', 'seen', 'player', I.miri),
                know('demonstration', 'I consented to a two-minute demonstration, spent my own stamina and transformed my actual stave and knife. The traveler watched; I gave no tool or executable method.', 'seen', I.miri, I.miri)],
            description: 'Only a present reserved witness sees this discovery. Eda\'s real materials, guide, body, active source and stamina support it; merely hearing the offer grants nothing.'}),
        command({id: 'feature_objects.learn', label: 'Practice Grain matching with Eda · 1 coin + 3 min', once: true, duration: 3, cancellation: 'refund', siteId: I.site,
            visibleWhen: all(introduced, eq('knowledge.feature_objects.alignment.seen'), not(eq(`power.${I.method}.owned`))),
            requires: all(live, lender, eq('knowledge.feature_objects.alignment.seen'), eq('featureObjects.miriSourceSupported')), ...contact(all(live, eq('featureObjects.miriSourceSupported'))),
            costs: [money(-1), stamina(-1), stamina(-1, I.miri)],
            effects: [coins(1), {type: 'source', sourceId: I.method, operation: 'grant', origin: 'trained', awakened: true, active: true}, {type: 'power', powerId: I.method, operation: 'learn'},
                {type: 'unlock', kind: 'skill', id: 'Woodworking'}, know('method', 'Eda taught and supervised your Grain matching practice after you witnessed its real sample. You acquired the active learned method. A fine guide and sound material are still separate requirements.', 'understood', 'player', I.miri, 'instruction')],
            description: 'One native coin goes into Eda\'s purse only when this lesson completes. Both people spend their own stamina. Cancellation returns the reserved costs and grants no source, method, unlock or understanding.'}),
        ...[['brace', K.sound, 'braced', 5, 2], ['seal', K.matched, 'sealed', 3, 1]].map(([route, material, phase, duration, effort]) => command({id: `feature_objects.install_${route}`, label: `${route === 'brace' ? 'Brace the leaking joint with ordinary stock' : 'Install your matched sealing insert'} · ${duration} min`,
            duration, cancellation: 'refund', siteId: I.site, visibleWhen: all(introduced, eq('actor.feature_objects.jointInspected')),
            requires: all(live, lender, eq('actor.feature_objects.jointInspected'), not(eq('world.feature_objects.joint', 'sealed')), ...(route === 'brace' ? [eq('world.feature_objects.joint', 'leaking')] : [])),
            ...contact(live), costs: [item(material, -1), item(K.sap, -1), stamina(-effort)],
            effects: [wf('joint', phase), af(phase), {type: 'situation', situationId: I.situation, operation: 'advance', expected: route === 'brace' ? ['offered'] : ['offered', 'braced'], phase},
                know('installed', route === 'brace' ? 'Your actual sound stave and sap now brace the joint clear of the covered working strip. The joint still seeps, but that clear strip supports four-minute drying instead of the ordinary six-minute rack. This preparation can later be improved.' : 'Your actual matched stave and sap now seal the inspected local joint. The one dry shelf supports two-minute drying; no other world or arbitrary flood is repaired.'),
                know('installation', `I witnessed the traveler install an actual ${route === 'brace' ? 'brace' : 'grain-matched seal'} on my Village shelf.`, 'seen', I.miri)],
            description: 'The installed part is consumed into this persistent target. Eda consents and witnesses the work; nothing grants an extra loose stave. A purchased matched part can be installed without copying its maker\'s method.'})),
        command({id: 'feature_objects.buy_matched', label: 'Buy Eda\'s demonstrated matched stave · 4 coins', targetId: I.miri, coLocated: true, participants: ['$target'],
            visibleWhen: all(introduced, eq('knowledge.feature_objects.alignment.seen')), requires: all(live, lender),
            costs: [money(-4), {type: 'transfer', from: I.miri, to: 'player', key: K.matched, count: 1}], effects: [coins(4), know('matchedPurchase', 'Eda sold you the actual matched demonstration part for four coins. It supplies one compatible insert, not her knowledge, source or future stock.', 'seen', 'player', I.miri)]}),
        command({id: 'feature_objects.deliver_kits', label: 'Deliver two real survey kits to Eda · earn 2 coins', targetId: I.miri, coLocated: true, participants: ['$target'],
            duration: 2, cancellation: 'refund', visibleWhen: introduced, requires: all(live, lender), ...contact(live),
            costs: [{type: 'transfer', from: 'player', to: I.miri, key: K.kit, count: 2}, coins(-2), {type: 'resource', actor: I.miri, key: 'kitOrders', amount: -1}],
            effects: [money(2), know('kitDelivery', 'Eda received two actual Prepared survey kits and paid two coins from her own reserved purse for one finite order. Existing native kits work too; no phantom replacement or extra claim was awarded.', 'seen', 'player', I.miri)],
            description: 'Eda funds two orders. Only this accepted order reserves its kits, two coins and one demand unit. Cancellation returns that exact paired transfer and funding; it does not mint income.'}),
        command({id: 'feature_objects.revisit', label: 'Inspect your retained shelf result', visibleWhen: all(introduced, any(eq('actor.feature_objects.braced'), eq('actor.feature_objects.sealed'))),
            requires: all(live, eq('actor.feature_objects.jointInspected')),
            effects: [{type: 'observation', scope: 'world', key: 'feature_objects.joint', as: 'feature_objects.lastSeenJoint'},
                know('revisit', 'You returned to the same Village joint and inspected its retained condition. Earlier materials, coins and effort remain spent; native stock and the matching loan remain under their existing owners.')],
            description: 'A free current observation with no XP, stock, payment, reset or hidden future result.'}),
    ],
};

// Caller explicitly registers these plain descriptors in native item_templates.
// OtherItem supports the existing key codec; functional tools are carried tools,
// never an extra equipped slot or a parallel durability/stat system.
export function registerFeatureObjectItems({itemTemplates, OtherItem}) {
    if(!itemTemplates || typeof OtherItem !== 'function') throw new Error('Functional objects need the existing native item constructor.');
    for(const d of FEATURE_OBJECT_ITEMS) {
        if(itemTemplates[d.id]) throw new Error(`Duplicate functional object item ${d.id}.`);
        itemTemplates[d.id] = new OtherItem({id: d.id, name: d.id, description: d.description, value: d.value, tags: {expedition: true}});
    }
}
