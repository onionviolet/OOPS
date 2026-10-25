// Original reversible content. Residents enter once through an explicit meeting.
// Their purses, stock, consent, work and knowledge use existing simulation owners.
import {all, eq, not} from './basics.js';
import {coinsActorFirst as coin, moneyActorKeyNative as money, itemActorFirst as item, transferCount as transfer, staminaActorFirst as stamina} from './content_kit.js';
export const SOCIETY_IDS = Object.freeze({prefix: 'feature_society', world: 'base.frontier',
    household: 'feature_society.hessa', craftsperson: 'feature_society.orr', apprentice: 'feature_society.vale',
    home: 'feature_society.home', bench: 'feature_society.bench', method: 'feature_society.ordinary_join',
    homeRight: 'feature_society.home_work_right', benchRight: 'feature_society.bench_right', begin: 'feature_society.begin'});
const {prefix: P, world: W, household: H, craftsperson: O, apprentice: V, method: M} = SOCIETY_IDS;
export const SOCIETY_ITEMS = Object.freeze({wood: JSON.stringify({id: 'Rough wood log'}),
    kit: JSON.stringify({id: 'Prepared survey kit'}), rope: JSON.stringify({id: 'Survey rope'})});
const {wood: LOG, kit: KIT, rope: ROPE} = SOCIETY_ITEMS;
const af = (key, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: `${P}.${key}`, value});
const wf = (key, value = true) => ({type: 'world', worldId: W, key: `${P}.${key}`, value});
const a = (key, value = true) => eq(`actor.${P}.${key}`, value);
const w = (key, value = true) => eq(`world.${P}.${key}`, value);
const resource = (actor, key, amount) => ({type: 'resource', actor, key, amount});
const knowledge = (key, value, actor = 'player', stage = 'seen', attributedTo = H) => ({type: 'knowledge', actor,
    key: `${P}.${key}`, stage, value, basis: {kind: stage === 'understood' ? 'instruction' : 'observation', attributedTo, situationId: `${P}.home_agreement`}});
const memory = (actor, target, text) => ({type: 'relationship', actor, target, axis: 'respect', amount: 1, text});
const permission = (operation, key, actor, target) => ({type: 'claim', operation, key, actor, ...(target ? {target} : {})});
const learned = actor => [{type: 'source', actor, sourceId: M, operation: 'grant', origin: 'trained', awakened: true, active: true},
    {type: 'power', actor, powerId: M, operation: 'learn'}];
const local = eq('society.clockSupported', true, 'This household has no supported local contact while you are in another realm.');
const introduced = a('introduced');
const ready = all(eq(`faculty.${M}.active`), eq(`power.${M}.owned`), eq('society.handsUsable'),
    {fact: 'vital.health', op: 'gte', value: 2});
const command = d => ({revision: 1, group: 'feature_society', worldId: W, actorId: 'player', location: 'Village',
    costs: [], effects: [], requires: all(introduced, local), visibleWhen: introduced, ...d});
// Controller visibility cannot require the player's introduction fact on an NPC.
// Their actual consent, means and offered-work requirements still govern admission.
const npc = d => command({actorId: O, audience: ['$actor'], visibleWhen: null, ...d});
const support = requires => ({completionRequires: all(local, requires), completionCoLocated: true,
    completionFailure: 'refund', cancellation: 'refund'});

// This is live eligibility, including NPC controller and completion callers.
// Do not expose this private support projection as a player character sheet.
export function societyFacts(state, context = {}) {
    const s = state.simulation, actorId = context.actorId || 'player';
    const supported = id => {
        const p = s?.people[id], a = state.actors[id], source = a?.sources?.[SOCIETY_IDS.method], faculty = s?.faculties[id]?.[SOCIETY_IDS.method];
        return !!p && p.life === 'alive' && a?.worldId === SOCIETY_IDS.world && p.location === 'Village' &&
            (p.body?.hands ?? 0) >= 2 && p.vitals?.health > 1 && !!source &&
            (source.expiresAt == null || source.expiresAt > state.clock) && !!faculty?.active && !!faculty.awakened && !faculty.suppressed;
    };
    return {'society.clockSupported': state.actors.player.worldId === SOCIETY_IDS.world && !state.realmPrototype?.activeVisitId,
        'society.personalMethodUnowned': !s?.powers.player?.[M]?.owned,
        'society.orrSupported': supported(SOCIETY_IDS.craftsperson),
        'society.valeSupported': !!s?.people[SOCIETY_IDS.apprentice] && s.people[SOCIETY_IDS.apprentice].life === 'alive' &&
            state.actors[SOCIETY_IDS.apprentice]?.worldId === SOCIETY_IDS.world && s.people[SOCIETY_IDS.apprentice].location === 'Village' &&
            (s.people[SOCIETY_IDS.apprentice].body?.hands ?? 0) >= 2 && s.people[SOCIETY_IDS.apprentice].vitals?.health > 1 &&
            state.actors[SOCIETY_IDS.apprentice].facts[`${P}.agreed`] === true,
        'society.handsUsable': (s?.people[actorId]?.body?.hands ?? (actorId === 'player' ? 2 : 0)) >= 2};
}

export const societySources = [{id: M, revision: 1, label: 'Ordinary sound join', kind: 'technique', origin: 'trained',
    bioDetail: 'A learned local repair operation. It still needs real wood, a counted kit, hands and permission.', grants: []}];

export const societyDefinitions = {
    situations: [{id: `${P}.home_agreement`, revision: 1, label: 'Household work circle',
        context: {worldId: W, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
        privateTruth: {funding: 'finite_resident_purses', homeOwner: H, teacher: O, learner: V},
        participants: ['player',H,O,V], initialPhase: 'open', phases: ['open']}],
    people: [
        {id: H, revision: 1, label: 'Hessa, household keeper', worldId: W, location: 'Village', inventory: 'simulation', provision: false,
            resources: {coins: 8, repairDemand: 1, apprenticeDemand: 1}, body: {hands: 2},
            vitals: {health: 20, max_health: 20, stamina: 8, max_stamina: 8}},
        {id: O, revision: 1, label: 'Orr, local joiner', worldId: W, location: 'Village', inventory: 'simulation', provision: false,
            resources: {coins: 0, attention: 3}, body: {hands: 2},
            vitals: {health: 20, max_health: 20, stamina: 12, max_stamina: 12}},
        {id: V, revision: 1, label: 'Vale, prospective apprentice', worldId: W, location: 'Village', inventory: 'simulation', provision: false,
            resources: {coins: 0, attention: 2}, body: {hands: 2},
            vitals: {health: 18, max_health: 18, stamina: 8, max_stamina: 8}},
    ],
    sites: [{id: SOCIETY_IDS.home, revision: 1, label: "Hessa's permitted home work", capacity: 1},
        {id: SOCIETY_IDS.bench, revision: 1, label: "Orr's agreed teaching bench", capacity: 1}],
    powers: [{id: M, revision: 1, label: 'Ordinary sound join', model: 'practice', capacity: 1, execution: ready}],
    commands: [
        command({id: SOCIETY_IDS.begin, label: 'Meet the household work circle', once: true, visibleWhen: null,
            requires: all(local, eq('village.elderMet', true, 'Meet the Village elder before asking about local households.')),
            description: 'An explicit introduction creates three independent residents. Hessa has eight finite coins and one household log; Orr owns one rope and one kit. No work, gift to the player or teaching is accepted by meeting them.',
            effects: [H,O,V].map(personId => ({type: 'spawn', personId, definitionId: personId})).concat([
                item(H, LOG, 1), item(O, ROPE, 1), item(O, KIT, 1), ...learned(O),
                permission('acquire', SOCIETY_IDS.homeRight, H), permission('acquire', SOCIETY_IDS.benchRight, O),
                {type: 'situation', situationId: `${P}.home_agreement`, operation: 'begin'},
                af('introduced'), af('homeAuthorized', false), wf('closed', false), wf('homeRepaired', false), wf('handedOff', false),
                wf('answered', false), wf('taught', false), wf('shelfBuilt', false), wf('handoffWilling', false),
                wf('repairConsent', false), wf('apprenticeConsent', false), wf('requestScope', 'none'),
                af('willingBounded', true, V), af('ordinaryIntent', true, O),
                knowledge('meeting', 'Hessa keeps a household; Orr repairs locally; Vale is considering bounded teaching. Each has their own means and may refuse. Meeting them accepted no work.')])}),
        command({id: `${P}.terms`, label: 'Hear Hessa’s paid repair and access terms', once: true, targetId: H, coLocated: true, participants: ['$target'],
            effects: [af('termsHeard'), knowledge('home.terms', 'Hessa offers two coins for two actual player-owned logs, three coins to Orr for one home repair, and two coins for one later apprentice shelf. Home access is limited to accepted repairs. No exclusive service or affection is bought.')]}),
        command({id: `${P}.supply`, label: 'Supply Hessa · 2 logs · earn 2 coins', once: true, targetId: H, coLocated: true, participants: ['$target'],
            visibleWhen: a('termsHeard'), requires: all(introduced, local, a('termsHeard'), not(w('closed'))),
            costs: [transfer('player', H, LOG, 2), coin(H, -2)],
            effects: [money(2), af('supplied'), wf('supplied'),
                knowledge('home.supply', 'Transferred two real logs to Hessa. Her reserved two coins paid the player. No replacement logs or wage were created.'),
                knowledge('home.supply', 'Bought two real logs from the player for two of my eight coins.', H)]}),
        command({id: `${P}.authorize_home`, label: 'Witness Hessa and Orr’s bounded repair agreement', once: true, targetId: H, coLocated: true, participants: [H,O],
            visibleWhen: a('termsHeard'), requires: all(introduced, local, a('termsHeard'), w('supplied'), not(w('closed')),
                eq(`claim.${SOCIETY_IDS.homeRight}.owner`, H), eq('society.orrSupported')),
            description: 'Hessa grants Orr limited home-work access. Orr will reserve their kit/body, Hessa’s two supplied logs and three real coins. The player may pursue other work. Future offers and rights remain separate.',
            effects: [permission('transfer', SOCIETY_IDS.homeRight, H, O), wf('repairConsent'), af('homeAuthorized'),
                af('repairOffered', true, O), knowledge('home.agreement', 'Witnessed the agreed limited repair right. No wage or result has been awarded; Orr must perform the funded work.')]}),
        command({id: `${P}.decline_home`, label: 'Decline future household work', once: true, targetId: H, coLocated: true,
            visibleWhen: a('termsHeard'), requires: all(introduced, local, a('termsHeard'), not(w('homeRepaired')), not(a('homeAuthorized'))),
            effects: [wf('closed'), af('declined'), knowledge('home.refusal', 'Declined future home work. Existing lawful supply sales stay settled; no repair, teaching, access transfer or unpaid wage was granted. Ordinary personal work remains available.')]}),
        npc({id: `${P}.orr_repair`, label: 'Orr repairs Hessa’s home with the funded stock', once: true, targetId: H, coLocated: true,
            participants: ['$target'], siteId: SOCIETY_IDS.home, duration: 6, powerId: M,
            requires: all(local, a('repairOffered'), w('repairConsent'), eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O)),
            ...support(all(a('ordinaryIntent'), w('repairConsent'), eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O), ready)),
            costs: [item(H, LOG, -2), coin(H, -3), resource(H, 'repairDemand', -1), item(O, KIT, -1), stamina(O, -2), resource(O, 'attention', -1)],
            effects: [item(O, KIT, 1, true), coin(O, 3), wf('homeRepaired'), af('repairDone', true, O), af('repairOffered', false, O),
                {type: 'power', actor: O, powerId: M, operation: 'refine', amount: 1},
                knowledge('home.result', 'Consumed Hessa’s two reserved logs into her retained repair. Her three reserved coins paid my purse. Returned my counted kit. One demand, attention and body time were spent.', O),
                knowledge('home.result', 'Orr performed my agreed repair with the actual two logs and returned their kit. Paid three of my own coins. My home is now repaired.', H)]}),
        command({id: `${P}.hear_home`, label: 'Meet Hessa and inspect the retained repair', once: true, targetId: H, coLocated: true, participants: ['$target'],
            visibleWhen: a('homeAuthorized'), requires: all(introduced, local, w('homeRepaired')),
            effects: [af('homeReported'), knowledge('home.report', 'At an actual later meeting, Hessa showed the completed home repair. Two supplied logs became the retained fixture; Orr earned the actual three-coin wage. This report does not expose Orr’s purse or future plans.')]}),
        command({id: `${P}.request_apprentice`, label: 'Offer Vale a bounded lesson and one paid shelf', once: true, targetId: V, coLocated: true, participants: ['$target'],
            visibleWhen: a('homeReported'), requires: all(introduced, local, a('homeReported'), w('requestScope', 'none')),
            effects: [wf('requestScope', 'bounded'), af('requested'), af('requestPending', true, V),
                knowledge('apprentice.request', 'Offered Vale one lesson, an owned kit, two consumable coins and one separately paid household shelf. Vale has not yet answered. Future management and bench rights are separate offers.')]}),
        command({id: `${P}.request_exclusive`, label: 'Ask Vale for exclusive permanent service', once: true, targetId: V, coLocated: true, participants: ['$target'],
            visibleWhen: a('homeReported'), requires: all(introduced, local, a('homeReported'), w('requestScope', 'none')),
            effects: [wf('requestScope', 'exclusive'), af('requested'), af('requestPending', true, V),
                knowledge('apprentice.request', 'Asked for exclusive permanent service. No teaching, funds, right or work is transferred until a supported willing agreement exists.')]}),
        npc({id: `${P}.vale_answer_bounded`, actorId: V, label: 'Vale chooses the bounded apprenticeship', once: true,
            requires: all(local, a('requestPending'), a('willingBounded'), w('requestScope', 'bounded')),
            effects: [af('requestPending', false, V), af('agreed', true, V), wf('answered'), wf('apprenticeConsent'),
                knowledge('apprentice.answer', 'I choose one bounded lesson and shelf. I reserve the right to stop future offers, keep my own earned wages and decide on a later handoff.', V)]}),
        npc({id: `${P}.vale_refuse_exclusive`, actorId: V, label: 'Vale refuses exclusive permanent service', once: true,
            requires: all(local, a('requestPending'), w('requestScope', 'exclusive')),
            effects: [af('requestPending', false, V), wf('answered'), wf('apprenticeConsent', false), af('refusedExclusive', true, V),
                knowledge('apprentice.answer', 'I refuse exclusive permanent service. No paid affection, copied mastery, teaching, tools or right are owed.', V)]}),
        command({id: `${P}.hear_acceptance`, label: 'Hear Vale’s actual bounded answer', once: true, targetId: V, coLocated: true, participants: ['$target'],
            visibleWhen: a('requested'), requires: all(introduced, local, w('answered'), w('apprenticeConsent')),
            effects: [af('consentHeard'), knowledge('apprentice.answer', 'At this meeting Vale accepted only the bounded lesson and one funded shelf. Their future autonomy and earned wages remain theirs.', 'player', 'seen', V)]}),
        command({id: `${P}.hear_refusal`, label: 'Hear Vale’s refusal and correct the offer', once: true, targetId: V, coLocated: true, participants: ['$target'],
            visibleWhen: a('requested'), requires: all(introduced, local, w('answered'), w('requestScope', 'exclusive')),
            effects: [wf('requestScope', 'bounded'), af('requestPending', true, V), af('refusalHeard'),
                knowledge('apprentice.refusal', 'Vale refused permanent exclusive service. You corrected the offer to one bounded lesson and separately funded shelf. The corrected request still needs Vale’s own decision; refusal gave no result.', 'player', 'seen', V)]}),
        command({id: `${P}.fund_lesson`, label: 'Fund Orr’s consented lesson · 1 coin', once: true, targetId: O, coLocated: true, participants: [O,V],
            visibleWhen: a('consentHeard'), requires: all(introduced, local, a('consentHeard'), w('apprenticeConsent'), eq('society.orrSupported')),
            costs: [money(-1)], effects: [coin(O, 1), af('lessonFunded'), wf('lessonFunded'), af('teachOffered', true, O),
                knowledge('apprentice.lessonTerms', 'Paid Orr one actual coin for the agreed lesson. Orr and Vale will use their own attention/body at a free bench. Payment grants no competence, affection or future labor.')]}),
        npc({id: `${P}.orr_teach`, label: 'Orr teaches Vale their own ordinary operation', once: true, targetId: V, coLocated: true,
            participants: ['$target'], siteId: SOCIETY_IDS.bench, duration: 5,
            requires: all(local, a('teachOffered'), w('apprenticeConsent'), eq('society.valeSupported'), eq(`claim.${SOCIETY_IDS.benchRight}.owner`, O), ready),
            ...support(all(a('ordinaryIntent'), w('apprenticeConsent'), eq('society.valeSupported'), ready)),
            costs: [resource(O, 'attention', -1), resource(V, 'attention', -1), stamina(O, -1), stamina(V, -1)],
            effects: [...learned(V), af('taught', true, V), wf('taught'), af('teachOffered', false, O),
                knowledge('apprentice.method', 'Learned my own ordinary sound-join operation from Orr. My mastery begins at zero. I still need an actual kit, wood, body, funds and permission.', V, 'understood', O),
                knowledge('apprentice.teaching', 'Completed the consented lesson with our own body/attention. Vale acquired their own trained operation; none of the player’s or my mature competence was copied.', O)]}),
        command({id: `${P}.hear_lesson`, label: 'Hear the completed lesson', once: true, targetId: V, coLocated: true, participants: ['$target'],
            visibleWhen: a('lessonFunded'), requires: all(introduced, local, w('taught')),
            effects: [af('lessonReported'), knowledge('apprentice.lessonReport', 'At this later meeting Vale reported their completed lesson and zero initial mastery. Teaching is distinct from owned tools, permitted work and wages.', 'player', 'seen', V)]}),
        command({id: `${P}.fund_apprentice`, label: 'Equip Vale’s one shelf · 1 kit + 2 coins', once: true, targetId: V, coLocated: true, participants: [V,H,O],
            visibleWhen: a('lessonReported'), requires: all(introduced, local, a('lessonReported'), w('apprenticeConsent'), w('taught'), eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O)),
            costs: [transfer('player', V, KIT), money(-2)],
            effects: [coin(V, 2), af('apprenticeFunded'), wf('apprenticeFunded'), wf('apprenticeSubcontract'), af('shelfOffered', true, V),
                knowledge('apprentice.funding', 'Transferred one actual kit and two native coins to Vale’s separate stock/purse. Hessa offers one household log and two of her remaining coins for the shelf. No competence was granted by funding.')]}),
        npc({id: `${P}.vale_shelf`, actorId: V, label: 'Vale performs their own funded shelf work', once: true, targetId: H, coLocated: true,
            participants: ['$target'], siteId: SOCIETY_IDS.home, duration: 5, powerId: M,
            requires: all(local, a('shelfOffered'), w('apprenticeConsent'), w('apprenticeFunded'), w('taught'), w('repairConsent'), w('apprenticeSubcontract'), eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O)),
            ...support(all(w('apprenticeConsent'), w('repairConsent'), w('apprenticeSubcontract'), eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O), ready)),
            costs: [item(H, LOG, -1), coin(H, -2), resource(H, 'apprenticeDemand', -1), item(V, KIT, -1), coin(V, -1), stamina(V, -2), resource(V, 'attention', -1)],
            effects: [item(V, KIT, 1, true), coin(V, 2), wf('shelfBuilt'), af('shelfOffered', false, V), af('demonstrated', true, V),
                {type: 'power', actor: V, powerId: M, operation: 'refine', amount: 1},
                knowledge('apprentice.result', 'Performed my own permitted shelf, consumed Hessa’s log and one of my coins on consumable fittings, returned my kit and earned Hessa’s actual two-coin wage. My demonstrated practice is my own.', V),
                knowledge('home.shelf', 'Vale completed the agreed shelf using my actual reserved log. My two reserved coins paid Vale. The shelf stays in my home.', H)]}),
        command({id: `${P}.hear_shelf`, label: 'Meet Vale and inspect the independent shelf', once: true, targetId: V, coLocated: true, participants: [V,H],
            visibleWhen: a('apprenticeFunded'), requires: all(introduced, local, w('shelfBuilt')),
            effects: [af('demonstrationReported'), knowledge('apprentice.demonstration', 'At this later actual meeting Vale and Hessa showed the retained shelf and confirmed its paired wage. Vale used their own trained operation, kit, attention, stamina and consumed one own coin. No player mastery or private telemetry was copied.', 'player', 'seen', V)]}),
        command({id: `${P}.offer_handoff`, label: 'Offer the demonstrated apprentice a bounded handoff', once: true, targetId: V, coLocated: true, participants: ['$target'],
            visibleWhen: a('demonstrationReported'), requires: all(introduced, local, a('demonstrationReported'), w('apprenticeConsent')),
            effects: [af('handoffAsked'), af('handoffPending', true, V), knowledge('apprentice.handoffOffer', 'Offered Vale the separate bench and home-work rights after their demonstrated result. They have not accepted management. Ownership of Hessa’s home and Orr’s physical rope remains separate.')]}),
        npc({id: `${P}.vale_accept_handoff`, actorId: V, label: 'Vale chooses the limited handoff', once: true,
            requires: all(local, a('handoffPending'), a('demonstrated'), a('willingBounded'), w('apprenticeConsent')),
            effects: [af('handoffPending', false, V), wf('handoffWilling'), knowledge('apprentice.handoffAnswer', 'I accept the limited bench/home-work rights after my own result. It obliges me to no unpaid future work or permanent service.', V)]}),
        command({id: `${P}.handoff`, label: 'Hear Vale and transfer the separate work rights', once: true, targetId: V, coLocated: true, participants: [V,O,H],
            visibleWhen: a('handoffAsked'), requires: all(introduced, local, w('handoffWilling'), a('demonstrationReported'),
                eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O), eq(`claim.${SOCIETY_IDS.benchRight}.owner`, O)),
            effects: [permission('transfer', SOCIETY_IDS.homeRight, O, V), permission('transfer', SOCIETY_IDS.benchRight, O, V),
                wf('handedOff'), af('handedOff'), memory(V, O, 'Accepted limited work rights after my own demonstrated contribution.'),
                knowledge('apprentice.handoff', 'Heard Vale’s willing decision and witnessed Orr transfer the separate bench/home-work rights. Hessa retains her home, Vale retains their kit/wages and learned operation, Orr keeps their rope. No future demand, purse or body was replenished.', 'player', 'seen', V)]}),
        command({id: `${P}.stop_future`, label: 'End future teaching and home-work consent', once: true, targetId: H, coLocated: true,
            visibleWhen: a('homeAuthorized'), requires: all(introduced, local, not(w('handedOff')), eq(`claim.${SOCIETY_IDS.homeRight}.owner`, O)),
            description: 'Revokes unaccepted future cooperation. Already funded fees and completed lawful sales stay settled. Any accepted live job fails its next support check, refunds its exact remaining reservation and gives no result.',
            effects: [permission('transfer', SOCIETY_IDS.homeRight, O, H), wf('repairConsent', false), wf('apprenticeConsent', false), wf('closed'), af('stoppedFuture'),
                knowledge('home.stop', 'Returned the limited home-work right to Hessa and ended future cooperation. Finished lawful pay/results remain; later live completion needs consent and returns reservations if consent is missing. No unpaid future worker or forfeited-sale reversal is inferred.')]}),
        command({id: `${P}.personal_lesson`, label: 'Learn Orr’s ordinary join yourself · 1 coin · 3 min', once: true, targetId: O, coLocated: true,
            participants: ['$target'], siteId: SOCIETY_IDS.bench, duration: 3, visibleWhen: a('termsHeard'),
            requires: all(introduced, local, a('termsHeard'), eq('society.orrSupported'), eq(`claim.${SOCIETY_IDS.benchRight}.owner`, O), eq('society.personalMethodUnowned')),
            ...support(all(eq('society.orrSupported'), eq(`claim.${SOCIETY_IDS.benchRight}.owner`, O))), costs: [money(-1), stamina('player', -1), resource(O, 'attention', -1), stamina(O, -1)],
            effects: [coin(O, 1), ...learned('player'), {type: 'xp', skill: 'Perception', amount: 3}, af('personalTaught'),
                knowledge('personal.method', 'Orr taught the ordinary sound join. You paid their real one-coin fee after completion and gained three native Perception XP. This personal route needs no home agreement or apprenticeship.', 'player', 'understood', O)]}),
        command({id: `${P}.personal_pack`, label: 'Use the ordinary join at home · 1 log · 4 min', location: 'Shack', duration: 4, powerId: M,
            visibleWhen: a('personalTaught'), requires: all(introduced, local, a('personalTaught'), eq('village.shackUnlocked')),
            ...support(ready), costs: [item('player', LOG, -1), stamina('player', -1)],
            effects: [item('player', KIT, 1), {type: 'power', actor: 'player', powerId: M, operation: 'refine', amount: 1},
                knowledge('personal.use', 'Used one actual log, your learned ordinary join and body time to create one actual survey kit at your Shack. Household refusal and future closure do not revoke this personal method.', 'player', 'understood', O)]}),
        command({id: `${P}.revisit`, label: 'Revisit the household’s retained aftermath', targetId: H, coLocated: true, participants: ['$target'],
            visibleWhen: a('homeReported'), requires: all(introduced, local, a('homeReported')),
            effects: [af('revisited'), knowledge('home.revisit', 'Met Hessa again. The previously reported repair remains in her home; your own dated apprentice reports and any handed-off rights remain recorded. This visit refilled no stock, funds, attention or missed wage.')]}),
    ],
    controllers: [
        {id: `${P}.orr_controller`, revision: 1, label: 'Orr’s finite funded household plan', actorId: O, interval: 1,
            actions: [{commandId: `${P}.orr_repair`, targetId: H, priority: 2, when: a('repairOffered')},
                {commandId: `${P}.orr_teach`, targetId: V, priority: 1, when: a('teachOffered')}]},
        {id: `${P}.vale_controller`, revision: 1, label: 'Vale’s independent choice and finite work', actorId: V, interval: 1,
            actions: [{commandId: `${P}.vale_refuse_exclusive`, priority: 5, when: all(a('requestPending'), w('requestScope', 'exclusive'))},
                {commandId: `${P}.vale_answer_bounded`, priority: 4, when: all(a('requestPending'), w('requestScope', 'bounded'))},
                {commandId: `${P}.vale_shelf`, targetId: H, priority: 3, when: a('shelfOffered')},
                {commandId: `${P}.vale_accept_handoff`, priority: 2, when: a('handoffPending')}]},
    ],
};

// No unearned future costs or private outcomes are contained in these plans.
// Native travel stays a manual step using the existing location/access owner.
export const societyWorkPlans = Object.freeze([
    {id: `${P}.household_itinerary`, revision: 1, label: 'Supply, funded repair and a personal method', actorId: 'player',
        origin: `${P}.terms`, visibleWhen: a('termsHeard'), requires: all(introduced, local, a('termsHeard'), not(w('closed'))),
        steps: [{id: 'supply', kind: 'command', commandId: `${P}.supply`, revision: 1, targetId: H},
            {id: 'permission', kind: 'command', commandId: `${P}.authorize_home`, revision: 1, targetId: H},
            {id: 'wait_repair', kind: 'wait', requires: w('homeRepaired'), actorId: O, commandId: `${P}.orr_repair`, revision: 1, label: 'Wait for Orr’s actual funded repair before hearing the result'},
            {id: 'report', kind: 'command', commandId: `${P}.hear_home`, revision: 1, targetId: H},
            {id: 'learn', kind: 'command', commandId: `${P}.personal_lesson`, revision: 1, targetId: O},
            {id: 'travel_home', kind: 'travel', location: 'Shack', label: 'Travel to your Shack through native travel'},
            {id: 'personal_use', kind: 'command', commandId: `${P}.personal_pack`, revision: 1}]},
    {id: `${P}.apprentice_itinerary`, revision: 1, label: 'Willing lesson, own tools, demonstration and rights', actorId: 'player',
        origin: `${P}.hear_acceptance`, visibleWhen: a('consentHeard'), requires: all(introduced, local, a('consentHeard'), w('apprenticeConsent')),
        steps: [{id: 'fund_lesson', kind: 'command', commandId: `${P}.fund_lesson`, revision: 1, targetId: O},
            {id: 'wait_lesson', kind: 'wait', requires: w('taught'), actorId: O, commandId: `${P}.orr_teach`, revision: 1, label: 'Wait for the consented lesson to finish'},
            {id: 'hear_lesson', kind: 'command', commandId: `${P}.hear_lesson`, revision: 1, targetId: V},
            {id: 'own_tools', kind: 'command', commandId: `${P}.fund_apprentice`, revision: 1, targetId: V},
            {id: 'wait_shelf', kind: 'wait', requires: w('shelfBuilt'), actorId: V, commandId: `${P}.vale_shelf`, revision: 1, label: 'Wait for Vale’s independently funded shelf work'},
            {id: 'demonstration', kind: 'command', commandId: `${P}.hear_shelf`, revision: 1, targetId: V},
            {id: 'offer_rights', kind: 'command', commandId: `${P}.offer_handoff`, revision: 1, targetId: V},
            {id: 'wait_rights', kind: 'wait', requires: w('handoffWilling'), actorId: V, commandId: `${P}.vale_accept_handoff`, revision: 1, label: 'Wait for Vale’s own handoff decision'},
            {id: 'hear_and_transfer', kind: 'command', commandId: `${P}.handoff`, revision: 1, targetId: V}]},
]);
