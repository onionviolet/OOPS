// Reversible original local commissions, using the existing residents, native
// stock, purses, learned operations, sites, common clock and job executor.
export const REMAINDER_LIVELIHOOD_IDS = Object.freeze({
    prefix: 'remainder_livelihood', group: 'remainder_livelihood', world: 'base.frontier',
    orr: 'feature_society.orr', vale: 'feature_society.vale', lio: 'partyPartner',
    craftsman: 'oldCraftsman', method: 'feature_society.ordinary_join',
    residentBench: 'feature_society.bench', residentRight: 'feature_society.bench_right',
    localBench: 'village.workbench', localRight: 'remainder_livelihood.local_bench_permission',
    lioRight: 'remainder_livelihood.lio_bench_permission',
});
const I = REMAINDER_LIVELIHOOD_IDS, P = I.prefix;
export const REMAINDER_LIVELIHOOD_ITEMS = Object.freeze({
    log: JSON.stringify({id: 'Rough wood log'}), kit: JSON.stringify({id: 'Prepared survey kit'}),
    sap: JSON.stringify({id: 'Tree sap'}),
});
const K = REMAINDER_LIVELIHOOD_ITEMS;
export const REMAINDER_LIVELIHOOD_SCHEDULE = Object.freeze({period: 1440, opens: 480, closes: 1080});
export const remainderLivelihoodItemSpecifications = Object.freeze([]);
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const af = (key, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: `${P}.${key}`, value});
const wf = (key, value) => ({type: 'world', worldId: I.world, key: `${P}.${key}`, value});
const resource = (actor, key, amount) => ({type: 'resource', actor, key: `${P}.${key}`, amount});
const coins = (actor, amount) => ({type: 'resource', actor, key: 'coins', amount});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const item = (actor, key, amount, returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
const transfer = (from, to, key, count = 1) => ({type: 'transfer', from, to, key, count});
const stamina = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
const claim = (operation, key, actor, target) => ({type: 'claim', operation, key, actor, ...(target ? {target} : {})});
const know = (key, value, actor = 'player') => ({type: 'knowledge', actor, key: `${P}.${key}`, stage: 'seen', value});
const f = (key, value = true, reason) => eq(`remainder.livelihood.${key}`, value, reason);
const enrolled = eq('auditRemainder.enrolled', true, 'Explicitly enroll in the optional local remainder work first.');
const local = f('local', true, 'These residents need actual Village contact and the supported local clock.');
const window = duration => f(`window${duration}`, true, 'Local shifts run 08:00–18:00; leave enough played minutes to finish before closing.');
const common = all(enrolled, local);
const command = d => ({revision: 1, group: I.group, worldId: I.world, actorId: 'player', location: 'Village',
    costs: [], effects: [], requires: common, visibleWhen: enrolled, ...d});
const npc = d => command({audience: ['$actor'], ...d});
const identity = (topic, worker, duration, outputs, extras = {}) => Object.freeze({
    topic, worker, duration, outputs, logs: topic === 'lio' ? 2 : 1, wage: topic === 'lio' ? 2 : 1,
    fittings: topic === 'lio' ? 0 : 1, attention: worker !== I.lio,
    site: topic.startsWith('allocation_') ? I.localBench : I.residentBench,
    fundingClaim: `${P}.${topic.startsWith('allocation_') ? 'allocation' : topic}.funding`,
    workClaim: `${P}.${topic.startsWith('allocation_') ? 'allocation' : topic}.work`,
    escrow: `${topic}.escrow`, demand: `${topic}.demand`, ...extras,
});
export const REMAINDER_LIVELIHOOD_COMMISSIONS = Object.freeze([
    identity('shift1', I.orr, 4, 1), identity('shift2', I.orr, 4, 1),
    identity('lio', I.lio, 4, 2, {site: I.localBench}),
    identity('allocation_orr', I.orr, 5, 1),
    identity('allocation_vale', I.vale, 5, 0, {sap: 1, driesBench: true}),
]);
const termsTopic = c => c.topic.startsWith('shift') ? 'resident' : c.topic.startsWith('allocation_') ? 'allocation' : 'lio';
const hasTerms = c => f(`${termsTopic(c)}Terms`);
const support = c => all(common, hasTerms(c), f(`${c.topic}.supported`, true,
    'The actual worker needs their own present living body, current willingness, acquired operation and agreed bench access.'),
    f(`${c.topic}.offered`), f(`${c.topic}.unfinished`));
const supplied = c => [transfer('player', c.worker, K.log, c.logs),
    ...(c.topic.startsWith('allocation_') ? [transfer('player', c.worker, K.kit)] : []),
    ...(c.sap ? [transfer('player', c.worker, K.sap, c.sap)] : []), money(-2)];
const terms = [
    command({id: `${P}.resident_terms`, label: 'Hear Orr’s two finite local shifts · free', once: true,
        targetId: I.orr, coLocated: true, participants: ['$target'],
        visibleWhen: all(enrolled, eq('actor.feature_society.introduced')),
        requires: all(common, eq('actor.feature_society.introduced'), f('orrSupported'), f('residentAccess')),
        effects: [af('residentTerms'), know('resident.terms',
            'Orr offers exactly two new local kit shifts, separate from existing household work and finite merchant supplies. Each sponsorship transfers one actual log and two native coins into Orr’s separate work purse: one coin for consumable fittings and one earned wage after actual completion. Orr independently reserves that stock, one of their own attention and stamina, their current ordinary join, their counted reusable kit and four played minutes at their agreed bench between 08:00 and 18:00. The new kit remains Orr’s until you separately collect it. Cancellation or lost completion support returns exact reservations to Orr; before a result, a separate withdrawal returns your unchanged supplied log and two work-purse coins. It creates no wage or kit. No visit replenishes attention, demand or merchant stock.')]}),
    command({id: `${P}.lio_terms`, label: 'Ask Lio about one packing shift or a contest · free', once: true,
        targetId: I.lio, coLocated: true, participants: ['$target', I.craftsman],
        visibleWhen: all(enrolled, eq('actor.party.met')),
        requires: all(common, eq('actor.party.met'), eq('actor.field.member'), f('lioSupported'),
            eq('village.craftsmanMet'), f('localBenchPresent'), f('craftsmanConsent')),
        effects: [af('lioTerms'), claim('acquire', I.lioRight, I.lio), know('lio.terms',
            'Lio offers one independent packing shift or remains free for the ordinary contest. Supply two actual logs and two native coins to his separate work purse. If still willing and supported, he reserves his own reusable kit, supplied logs, two stamina and four played minutes at the Village workbench during 08:00–18:00. Successful completion moves those two funded coins into his own purse and makes two actual kits in his own stock; collect them separately. His current brace body and acquired control remain required, and his equipped frame is retained. The active job occupies Lio for existing party admission while the player can do other work. Cancellation or lost support returns the exact reservations to Lio; withdrawal before a result returns two supplied logs and two work-purse coins. Personal preparation and supplied rest remain available.')]}),
    command({id: `${P}.allocation_terms`, label: 'Hear one toolkit allocation at the Village bench · free', once: true,
        targetId: I.craftsman, coLocated: true, participants: ['$target'],
        visibleWhen: all(enrolled, eq('actor.feature_society.lessonReported')),
        requires: all(common, eq('actor.feature_society.lessonReported'), f('allocationPeopleReady'),
            eq('village.craftsmanMet'), f('localBenchPresent'), f('craftsmanConsent')),
        effects: [af('allocationTerms'), claim('acquire', I.localRight, 'player'), know('allocation.terms',
            'The present craftsman permits one new finite commission at his actual Village bench. Choose Orr’s ordinary kit production or Vale’s learned bench drying, or keep your kit for your own work. Sponsorship transfers one actual player-owned unencumbered kit, one log and two native coins to the chosen worker’s stock and separate work purse; Vale additionally needs one actual Tree sap. The worker independently reserves their own learned join, counted kit, one attention, two stamina and five played minutes during 08:00–18:00. One funded coin becomes consumable fittings and one becomes their earned wage on completion. Orr’s one new kit stays theirs until separate collection; their original sponsored tool returns exactly once and stays theirs. Vale consumes the log and sap to dry only this current wet Village bench, enabling its existing ordinary harness work until another authored wetting. Both jobs contend for the same one commission claim and actual one-capacity bench. Cancelled/lost-support work refunds exact reservations to its worker; a separate pre-result withdrawal returns all supplied stock and funded coins. No competence, attention, stock or permanent weather immunity is granted.')]}),
];

const commissionCommands = REMAINDER_LIVELIHOOD_COMMISSIONS.flatMap(c => {
    const allocation = c.topic.startsWith('allocation_'), label = c.worker === I.orr ? 'Orr' : c.worker === I.vale ? 'Vale' : 'Lio';
    const workSupport = support(c), completeSupport = all(workSupport, f('windowOpen'),
        ...(c.driesBench ? [eq('world.workbench.wet', true, 'The one wet-bench purpose ended before completion; return the accepted reservations.')] : []));
    const returns = [item(c.worker, K.kit, 1, true)];
    const result = [coins(c.worker, c.wage), ...returns,
        ...(c.outputs ? [item(c.worker, K.kit, c.outputs)] : []),
        ...(c.driesBench ? [{type: 'world', worldId: I.world, key: 'workbench.wet', value: false}] : []),
        af(`offered.${c.topic}`, false, c.worker), wf(`result.${c.topic}`, c.worker),
        ...(allocation ? [claim('settle', I.localRight, c.worker)] : c.worker === I.lio ? [claim('settle', I.lioRight, I.lio)] : []),
        know(`${c.topic}.result`, c.driesBench
            ? 'I used the one sponsored log and sap on this actual wet Village workbench, spent my own learned operation, attention and two stamina, and dried this bench. My counted sponsored kit returned once and remains mine. One funded coin paid fittings and one entered my earned purse. No future weather immunity or kit product was created.'
            : `I completed the finite ${c.topic} with ${c.logs} actual supplied log${c.logs === 1 ? '' : 's'}, my own supported body, counted reusable kit${c.attention ? ', acquired ordinary join and attention' : ' and acquired control'}, and ${c.duration} played minutes. The returned original kit remains mine; ${c.outputs} new kit${c.outputs === 1 ? '' : 's'} entered my actual stock. ${c.wage} funded coin${c.wage === 1 ? '' : 's'} entered my earned purse${c.fittings ? ' and one funded coin paid consumed fittings' : ''}. No second output, borrowed tool or unpaid wage was created.`, c.worker)];
    const jobs = [
        command({id: `${P}.fund_${c.topic}`, label: `Sponsor ${label} ${c.topic.startsWith('shift') ? `shift ${c.topic.slice(-1)}` : c.driesBench ? 'bench drying' : 'packing'} · ${c.logs} log${c.logs === 1 ? '' : 's'}${allocation ? ' + 1 owned kit' : ''}${c.sap ? ' + 1 sap' : ''} + 2 coins`,
            once: true, claim: c.fundingClaim, targetId: c.worker, coLocated: true, participants: ['$target'],
            visibleWhen: all(enrolled, hasTerms(c)), requires: all(common, hasTerms(c), f(`${c.topic}.supported`), window(c.duration),
                f(`${c.topic}.unfunded`), ...(allocation ? [f('allocationUnchosen'), eq(`claim.${I.localRight}.owner`, 'player')] : [])),
            costs: supplied(c), effects: [resource(c.worker, c.escrow, 2), resource(c.worker, c.demand, 1),
                af(`funded.${c.topic}`), af(`offered.${c.topic}`, true, c.worker),
                ...(allocation ? [wf('allocationChoice', c.worker), claim('transfer', I.localRight, 'player', c.worker)] : []),
                know(`${c.topic}.funding`, `Supplied ${label} with ${c.logs} real log${c.logs === 1 ? '' : 's'}${allocation ? ', one actual kit transferred into their ownership' : ''}${c.sap ? ' and one real Tree sap' : ''}. Two native coins moved into their separate work purse and one finite player commission became available. No kit output, earned wage or acquired operation was awarded. The independent worker must reserve and complete the supported local job.`, 'player'),
                know(`${c.topic}.funding`, `Received this one finite commission, actual supplied stock and two real coins in my separate work purse. Funding grants me no competence or replenished attention. My accepted work and eventual earned purse remain my own.`, c.worker)]}),
        npc({id: `${P}.work_${c.topic}`, label: `${label} independently ${c.driesBench ? 'dries the wet Village bench' : `packs ${c.outputs} funded kit${c.outputs === 1 ? '' : 's'}`}`,
            actorId: c.worker, once: true, claim: c.workClaim, siteId: c.site, duration: c.duration, cancellation: 'refund',
            ...(c.worker !== I.lio ? {powerId: I.method} : {}),
            requires: all(workSupport, window(c.duration), ...(c.driesBench ? [eq('world.workbench.wet', true, 'This specific Village workbench is already dry.')] : [])),
            visibleWhen: all(enrolled, f(`${c.topic}.offered`)), completionRequires: completeSupport, completionFailure: 'refund', completionCoLocated: true,
            costs: [item(c.worker, K.log, -c.logs), item(c.worker, K.kit, -1),
                ...(c.sap ? [item(c.worker, K.sap, -c.sap)] : []), resource(c.worker, c.escrow, -2), resource(c.worker, c.demand, -1),
                stamina(c.worker, c.worker === I.lio || allocation ? -2 : -1),
                ...(c.attention ? [{type: 'resource', actor: c.worker, key: 'attention', amount: -1}] : [])], effects: result}),
        command({id: `${P}.withdraw_${c.topic}`, label: `Withdraw ${label}’s unfinished ${c.topic} sponsorship · return supplied stock + 2 coins`,
            once: true, targetId: c.worker, coLocated: true, participants: ['$target'],
            visibleWhen: all(enrolled, f(`${c.topic}.funded`)), requires: all(common, hasTerms(c), f(`${c.topic}.funded`),
                f(`${c.topic}.unfinished`), f(`${c.topic}.workerFree`), f(`${c.topic}.notWithdrawn`)),
            costs: [transfer(c.worker, 'player', K.log, c.logs), ...(allocation ? [transfer(c.worker, 'player', K.kit)] : []),
                ...(c.sap ? [transfer(c.worker, 'player', K.sap, c.sap)] : []), resource(c.worker, c.escrow, -2), resource(c.worker, c.demand, -1)],
            effects: [money(2), af(`withdrawn.${c.topic}`), af(`offered.${c.topic}`, false, c.worker),
                ...(allocation ? [claim('transfer', I.localRight, c.worker, 'player')] : c.worker === I.lio ? [claim('settle', I.lioRight, I.lio)] : []),
                know(`${c.topic}.withdrawal`, 'Withdrew the unfinished sponsorship after any live reservation ended. The worker returned exactly the supplied material stock and two unchanged funded coins. Their original equipment, attention, private funds and prior lawful results stay theirs. This finite commission is now closed and cannot be funded again.')]}),
    ];
    jobs.push(command({id: `${P}.${c.outputs ? 'collect' : 'report'}_${c.topic}`,
        label: c.outputs ? `Collect ${label}’s ${c.outputs} actually completed kit${c.outputs === 1 ? '' : 's'} · funded separately` : 'Meet Vale and inspect the actual dry Village bench',
        once: true, targetId: c.worker, coLocated: true, participants: ['$target'],
        visibleWhen: all(enrolled, f(`${c.topic}.funded`)), requires: all(common, hasTerms(c), f(`${c.topic}.complete`), f(`${c.topic}.notCollected`)),
        costs: c.outputs ? [transfer(c.worker, 'player', K.kit, c.outputs)] : [],
        effects: [af(`collected.${c.topic}`), know(`${c.topic}.report`, c.outputs
            ? `At this actual later meeting ${label} transferred ${c.outputs} real completed survey kit${c.outputs === 1 ? '' : 's'} from their native-compatible stock into yours. Their returned original kit and earned wage remain theirs. These are the existing Prepared survey kits used by field preparation, supply, ordinary work and trade; this report supplies no additional item.`
            : 'Vale showed the completed bench-drying commission at a later actual meeting. Their retained sponsored tool and earned wage remain theirs. The one real Village workbench was dried by actual paid work; its current state and the existing ordinary harness commands determine whether it is still dry. No recurring immunity or extra kit was granted.')]}));
    return jobs;
});
const finiteChoices = [
    ...residentDeclines(),
    command({id: `${P}.keep_lio`, label: 'Keep Lio free for the contest · no supplies spent', once: true, claim: `${P}.lio.funding`,
        targetId: I.lio, coLocated: true, participants: ['$target'], visibleWhen: all(enrolled, f('lioTerms')),
        requires: all(common, f('lioTerms'), f('lio.unfunded')),
        effects: [af('kept.lio'), claim('settle', I.lioRight, I.lio), know('lio.choice', 'Kept Lio free rather than funding this one packing commission. No log, coin, effort, kit or occupation changed. Existing party admission still needs his actual consent, body, owned kit, control, recovery and free time.')]}),
    command({id: `${P}.keep_toolkit`, label: 'Keep your actual toolkit for personal field work · no supplies spent', once: true, claim: `${P}.allocation.funding`,
        visibleWhen: all(enrolled, f('allocationTerms')), requires: all(common, f('allocationTerms'), f('allocationUnchosen'), f('playerKitAvailable')),
        effects: [af('kept.allocation'), wf('allocationChoice', 'player'), know('allocation.choice', 'Kept your actual available owned kit for your own work and closed this one finite commission. Neither Orr nor Vale received stock, funds, competence or another demand. Their existing household work and independent means remain unchanged.')]}),
    npc({id: `${P}.lio_refuse`, label: 'Lio declines the offered packing shift', actorId: I.lio, once: true,
        visibleWhen: all(enrolled, f('lio.offered')), requires: all(common, f('lio.offered'), eq('actor.party.willing', false)),
        effects: [af('offered.lio', false, I.lio), know('lio.refusal', 'I decline this offered packing shift. I accepted no job, wage or kit production. Its unchanged supplied stock and work-purse funds remain available for the disclosed withdrawal.', I.lio)]}),
];
function residentDeclines() {
    return REMAINDER_LIVELIHOOD_COMMISSIONS.filter(c => c.topic.startsWith('shift')).map(c => command({
        id: `${P}.decline_${c.topic}`, label: `Decline Orr’s finite shift ${c.topic.slice(-1)} · no supplies spent`,
        once: true, claim: c.fundingClaim, targetId: I.orr, coLocated: true, participants: ['$target'],
        visibleWhen: all(enrolled, f('residentTerms')), requires: all(common, f('residentTerms'), f(`${c.topic}.unfunded`)),
        effects: [af(`kept.${c.topic}`), know(`${c.topic}.choice`, 'Declined this one finite Orr shift before funding it. No material, money, worker demand, wage, kit or occupation changed. Your own packing and every other actually unaccepted offer remain separate choices.')],
    }));
}
const controllers = [I.orr, I.vale, I.lio].map(actorId => ({
    id: `${P}.${actorId === I.orr ? 'orr' : actorId === I.vale ? 'vale' : 'lio'}_controller`, revision: 1,
    label: 'Finite independently funded local work', actorId, interval: 1,
    actions: [
        ...(actorId === I.lio ? [{commandId: `${P}.lio_refuse`, priority: 10, when: all(enrolled, f('lio.offered'), eq('actor.party.willing', false))}] : []),
        ...REMAINDER_LIVELIHOOD_COMMISSIONS.filter(c => c.worker === actorId).map((c, index) => ({
            commandId: `${P}.work_${c.topic}`, priority: 5 - index, when: all(enrolled, f(`${c.topic}.offered`)),
        })),
    ],
}));
function freeze(value) {if(value && typeof value === 'object') {Object.values(value).forEach(freeze); Object.freeze(value);} return value;}
export const remainderLivelihoodDefinitions = freeze({commands: [...terms, ...commissionCommands, ...finiteChoices], controllers});
export const remainderLivelihoodCommand = id => remainderLivelihoodDefinitions.commands.find(d => d.id === id);
