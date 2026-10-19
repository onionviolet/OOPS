// Original, reversible local policies inspired by the audited packets. These
// definitions create no people, stock, weather, debt or work on import/enrollment.
import {all, eq, not} from './basics.js';
import {EXCHANGE_CLERK, EXCHANGE_SITUATION, EXCHANGE_ITEMS} from './exchange_content.js';
import {NESTED_IDS as N, NESTED_LOCATIONS as L, NESTED_KEYS as NK} from './feature_expansion_nested_content.js';

export const REMAINDER_CONSEQUENCES_IDS = Object.freeze({
    group: 'remainder_consequences', prefix: 'remainder_consequences.', facts: 'remainder.consequences.',
    frontier: 'base.frontier', iona: EXCHANGE_CLERK, friction: 'remainder_consequences.iona_player_interruption',
    exchangeClaim: 'remainder_consequences.iona_exchange', concession: 'remainder_consequences.iona_concession',
    steward: 'remainder_consequences.nell', bed: 'remainder_consequences.herb_bed', plot: 'remainder_consequences.herb_plot',
    plotRight: 'remainder_consequences.herb_right', harvest: 'remainder_consequences.herb_harvest',
    warning: 'remainder_consequences.frost_warning', frost: 'remainder_consequences.frost_settlement',
    collector: 'remainder_consequences.corin', collection: 'remainder_consequences.collection',
    collectionClaim: 'remainder_consequences.collection_demand', notice: 'remainder_consequences.collection_notice',
    collectionExpiry: 'remainder_consequences.collection_expiry', commission: 'remainder_consequences.collection_commission',
});
const I = REMAINDER_CONSEQUENCES_IDS, P = I.facts;
const key = id => JSON.stringify({id});
export const REMAINDER_CONSEQUENCES_KEYS = Object.freeze({
    seed: key('Association herb seed packet'), herbs: key('Cooking herbs'), log: NK.log, rope: NK.rope,
    sound: EXCHANGE_ITEMS['Sound seal blank'],
});
const K = REMAINDER_CONSEQUENCES_KEYS;
export const remainderConsequencesItemSpecifications = Object.freeze([
    {id: 'Association herb seed packet', description: 'Nell’s one counted planting allocation for the permitted Village herb bed. Plant it once; this packet has no recurring supply or automatic replacement.', value: 2},
]);
const f = (name, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: `${P}${name}`, value});
const item = (stock, amount, actor = 'player') => ({type: 'item', actor, key: stock, amount});
const stamina = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
const credit = (amount, actor = 'player') => ({type: 'resource', actor, key: 'nested.credit', amount});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const claim = (claimKey, operation, actor = 'player') => ({type: 'claim', actor, key: claimKey, operation});
const schedule = (eventId, delay, target) => ({type: 'event', actor: 'player', eventId, delay, ...(target ? {target} : {})});
const know = (name, value, attributedTo, situationId, actor = 'player', kind = 'observation') => ({
    type: 'knowledge', actor, key: `${P}${name}`, stage: 'seen', value,
    basis: {kind, attributedTo, situationId},
});
const ionaKnow = (name, value, actor = 'player') => ({type: 'knowledge', actor,
    key: `exchange.remainder.${name}`, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: I.iona, situationId: EXCHANGE_SITUATION}});
const memory = (actor, target, text, amount = 0) => ({type: 'relationship', actor, target, axis: 'trust', amount, text});
const phase = (situationId, value) => eq(`situation.${situationId}.phase`, value);
const shift = (situationId, from, to) => ({type: 'situation', situationId, operation: 'advance', expected: [from], phase: to});
const enrolled = eq('auditRemainder.enrolled', true, 'Approve the optional local audit work before accepting its means.');
const frontier = eq(`${P}frontierSupported`, true, 'Return to the supported Frontier played clock.');
const hands = eq(`${P}playerHands`, true, 'Use your own living, recovered hands.');
const village = all(frontier, eq(`${P}atVillage`));
const localSalt = eq(`${P}saltSupported`, true, 'Return on an actual supported Saltworks visit.');
const iona = eq(`${P}ionaPresent`, true, 'Meet willing Iona in the Village with both bodies available.');
const plotSupport = all(village, hands, eq(`${P}plotRight`), eq(`${P}bedPresent`));
const warningOpen = all(plotSupport, phase(I.plot, 'warned'), eq(`${P}frostOpen`));
const collectionOpen = all(localSalt, eq(`${P}collectionNoticed`), phase(I.collection, 'notified'), eq(`${P}collectionOpen`));
const command = d => ({revision: 1, actorId: 'player', worldId: I.frontier, location: 'Village', group: I.group,
    costs: [], effects: [], ...d, requires: all(enrolled, ...(d.requires ? [d.requires] : [])),
    visibleWhen: all(enrolled, ...(d.visibleWhen ? [d.visibleWhen] : []))});
const job = (duration, support, siteId) => ({duration, cancellation: 'refund',
    completionRequires: all(enrolled, support), completionFailure: 'refund', ...(siteId ? {siteId} : {})});
const terminalPlot = (branch, count, text) => [shift(I.plot, 'warned', branch), f('plot.branch', branch), f('plot.yield', count),
    claim(I.harvest, 'settle'), item(K.herbs, count), know('plot.result', text, I.steward, I.plot)];
export const remainderConsequencesCoveredPlotEffects=text=>terminalPlot('covered',5,text);
const terminalCollection = (branch, text) => [shift(I.collection, 'notified', branch), f('collection.branch', branch),
    f('collection.closed'), claim(I.collectionClaim, 'settle', N.foreman), know('collection.result', text, I.collector, I.collection)];

const ionaCommands = [
    ...[
        ['interrupt', 'Interrupt Iona’s count', 'interrupted',
            [ {type: 'condition', actor: I.iona, id: I.friction, operation: 'apply', duration: 8},
              memory(I.iona, 'player', 'The traveler interrupted my parcel count. I declined one optional discounted sale for eight local played minutes.'),
              ionaKnow('exchange', 'You interrupted Iona while she counted parcel fittings. She asked for quiet and closed one optional two-coin sound-blank sale for eight local played minutes. Any accepted parcel order, reserved payment and borrowed gauge keep their own terms.') ]],
        ['considerate', 'Wait for Iona to finish her count', 'considerate',
            [memory(I.iona, 'player', 'The traveler waited for my parcel count. I kept the optional discounted sale available.'),
             ionaKnow('exchange', 'You waited for Iona to finish her count. She keeps one optional two-coin sound-blank sale available from her actual stock. This reply accepts no new order or payment.')]],
    ].map(([id, label, response, effects]) => command({id: `${I.prefix}iona_${id}`, label, once: true,
        targetId: I.iona, coLocated: true, participants: ['$target'],
        visibleWhen: all(eq('knowledge.exchange.meeting.seen'), not(eq(`${P}ionaExchanged`))),
        requires: all(village, iona, eq('knowledge.exchange.meeting.seen'), not(eq(`${P}ionaExchanged`))),
        effects: [claim(I.exchangeClaim, 'acquire'), claim(I.exchangeClaim, 'settle'), f('iona.response', response), ...effects],
        description: 'One witnessed exchange between these two people. The directional clerk memory retains its cause; only the specified optional sale reads the temporary friction.'})),
    command({id: `${I.prefix}iona_repair`, label: 'Repair the interruption with Iona · 2 min', once: true,
        targetId: I.iona, coLocated: true, participants: ['$target'], visibleWhen: eq(`${P}ionaFriction`),
        requires: all(village, iona, eq(`${P}ionaFriction`)), ...job(2, all(village, iona, eq(`${P}ionaFriction`))), completionCoLocated: true,
        effects: [{type: 'condition', actor: I.iona, id: I.friction, operation: 'remove'}, f('iona.repaired'),
            memory(I.iona, 'player', 'The traveler returned for the specific interruption and let me finish my count. I reopened the optional sale without changing the parcel order.'),
            ionaKnow('repair', 'You and Iona repaired the interruption in a short conversation. Her temporary refusal ended. The original interruption remains remembered; parcel debt, gauge custody and reserved payment are unchanged.')],
        description: 'Conversation reserves both people for two local played minutes. If the fixed-pair friction already expires or either person becomes unavailable, the unfinished conversation awards no new response.'}),
    command({id: `${I.prefix}iona_later`, label: 'Hear Iona’s later response', once: true, targetId: I.iona, coLocated: true, participants: ['$target'],
        visibleWhen: eq(`${P}ionaExchanged`), requires: all(village, iona, eq(`${P}ionaExchanged`), not(eq(`${P}ionaFriction`))),
        effects: [ionaKnow('later', 'Iona says the recent exchange no longer closes her optional sale. She still remembers what happened. An accepted fitted-seal order remains owed until its existing delivery or withdrawal terms settle it.')]}),
    command({id: `${I.prefix}iona_concession`, label: 'Take Iona’s one optional sound-blank sale · 2 wooden coins', once: true,
        targetId: I.iona, coLocated: true, participants: ['$target'], visibleWhen: eq(`${P}ionaExchanged`),
        requires: all(village, iona, eq(`${P}ionaExchanged`), not(eq(`${P}ionaFriction`, true, 'This recent interruption still closes this optional sale.')),
            eq(`${P}ionaSoundStock`, true, 'Iona needs one actual sound blank in her own stock.')),
        costs: [money(-2), {type: 'transfer', from: I.iona, to: 'player', key: K.sound, count: 1}],
        effects: [{type: 'resource', actor: I.iona, key: 'coins', amount: 2}, claim(I.concession, 'acquire'), claim(I.concession, 'settle'),
            ionaKnow('concession', 'You paid Iona two actual wooden coins for her one optional sound-blank sale. One counted blank left her stock. This once-only concession neither pays nor cancels the accepted parcel obligation.')],
        description: 'A narrow once-only stocked concession. Ordinary blank purchases, order settlement, gauge return and withdrawal retain their existing rules.'}),
];

const plotCommands = [
    command({id: `${I.prefix}plot_terms`, label: 'Ask Nell for one finite Village herb plot', once: true,
        visibleWhen: all(eq('village.elderMet'), not(eq(`${P}plotAllocated`))), requires: all(village, hands, eq('village.elderMet'), not(eq(`${P}plotAllocated`))),
        effects: [{type: 'spawn', personId: I.steward, definitionId: I.steward}, item(K.seed, 1, I.steward),
            {type: 'site', actor: I.steward, siteId: I.bed, operation: 'open'}, claim(I.plotRight, 'acquire'),
            {type: 'situation', situationId: I.plot, operation: 'begin'}, f('plot.allocated'), f('plot.source', 'association_saved_seed_allocation'),
            know('plot.terms', 'Nell opens one permitted herb bed beside the Village field association. Her association’s saved planting allocation contains one actual seed packet; buy it for two native coins, then spend one coin for water, two stamina and three played minutes planting it. No packet or crop is free from reading this report. Four further supported local played minutes bring an authored inspection of this bed: an observed cold draft then gives six minutes to cover with one log and two stamina over two minutes, harvest early for three Cooking herbs, or leave a one-herb salvage. Covered work yields five herbs once. This is an original local draft, with no claim about the world’s season or offscreen weather.', I.steward, I.plot, 'player', 'instruction')],
        description: 'Nell keeps the one saved association packet and the bed. Permission is local and finite; planting and purchase are separate voluntary commitments.'}),
    command({id: `${I.prefix}plot_buy_seed`, label: 'Buy Nell’s one actual planting packet · 2 coins', once: true,
        targetId: I.steward, coLocated: true, participants: ['$target'], visibleWhen: eq(`${P}plotAllocated`),
        requires: all(plotSupport, eq(`${P}stewardPresent`), eq(`${P}seedStock`)),
        costs: [money(-2), {type: 'transfer', from: I.steward, to: 'player', key: K.seed, count: 1}],
        effects: [{type: 'resource', actor: I.steward, key: 'coins', amount: 2}, f('plot.seedBought'),
            know('plot.purchase', 'Two actual native coins entered Nell’s purse, and her association’s one counted seed packet moved into your inventory. This purchase creates no herbs or replenished seed supply.', I.steward, I.plot)]}),
    command({id: `${I.prefix}plot_plant`, label: 'Plant your permitted herb bed · seed + coin + 2 stamina + 3 min', once: true,
        targetId: I.steward, coLocated: true, participants: ['$target'], visibleWhen: phase(I.plot, 'allocated'),
        requires: all(plotSupport, eq(`${P}stewardPresent`), eq(`${P}seedBought`), phase(I.plot, 'allocated')),
        ...job(3, all(plotSupport, eq(`${P}stewardPresent`), phase(I.plot, 'allocated')), I.bed), completionCoLocated: true,
        costs: [item(K.seed, -1), money(-1), stamina(-2)],
        effects: [{type: 'resource', actor: I.steward, key: 'coins', amount: 1}, shift(I.plot, 'allocated', 'planted'),
            claim(I.harvest, 'acquire'), f('plot.planted'), schedule(I.warning, 4),
            know('plot.planting', 'Your actual packet was planted in the permitted association bed over three played minutes. Nell received one coin for the bed’s measured water; your two stamina were spent. One finite crop now exists. The later local inspection can expose the authored cold draft only while this bed and its supported contact remain actual.', I.steward, I.plot)]}),
    command({id: `${I.prefix}plot_cover`, label: 'Cover the warned bed · 1 log + 2 stamina + 2 min · 5 herbs', once: true,
        visibleWhen: phase(I.plot, 'warned'), requires: warningOpen, ...job(2, warningOpen, I.bed),
        costs: [item(K.log, -1), stamina(-2)],
        effects: terminalPlot('covered', 5, 'You used one owned log, two stamina and two local played minutes to cover the actual warned bed. The cover preserved this crop; its one final harvest added five real Cooking herbs to your native inventory. The log remains in the bed cover, and no further crop or seed packet is created.'),
        description: 'Finish before the six-minute local window ends. A late or unsupported job returns its reserved log and effort and awards no crop; the one-herb timeout result remains the only settlement.'}),
    command({id: `${I.prefix}plot_early`, label: 'Harvest the warned bed early · 3 Cooking herbs', once: true,
        visibleWhen: phase(I.plot, 'warned'), requires: warningOpen,
        effects: terminalPlot('early', 3, 'You harvested the actual planted bed early. Its finite crop added three real Cooking herbs to your native inventory once; no cover log was spent, and the crop cannot grow or pay out again.')}),
    command({id: `${I.prefix}plot_neglect`, label: 'Leave the warned bed and salvage its crop · 1 Cooking herb', once: true,
        visibleWhen: phase(I.plot, 'warned'), requires: warningOpen,
        effects: terminalPlot('neglected', 1, 'You left this warned bed uncovered and collected its declared limited salvage: one real Cooking herb, once. No cover materials were spent. This local authored yield is not a universal frost-death rule.')}),
];

const collectionCommands = [
    command({id: I.commission, label: 'Brin funds Corin’s one local collection visit', actorId: N.foreman, worldId: N.salt,
        location: L.enginehouse, audience: [N.foreman], once: true,
        visibleWhen: eq(`${P}seizureSupported`), requires: all(localSalt, eq(`${P}seizureSupported`), eq(`${P}laterSaltVisit`),
            eq(`${P}foremanPresent`), not(eq(`${P}collectionCommissioned`))),
        ...job(2, all(localSalt, eq(`${P}seizureSupported`), eq(`${P}laterSaltVisit`), eq(`${P}foremanPresent`)), N.saltSite),
        costs: [credit(-1, N.foreman), stamina(-1, N.foreman),
            {type: 'resource', actor: N.foreman, key: 'nested.agenda', amount: -1}, {type: 'resource', actor: N.foreman, key: 'nested.attention', amount: -1}],
        effects: [{type: 'spawn', actor: N.foreman, personId: I.collector, definitionId: I.collector}, credit(1, I.collector),
            f('collection.willing', true, I.collector), f('collection.commissioned'), claim(I.collectionClaim, 'acquire', N.foreman),
            memory(N.foreman, 'player', 'I retained the locally witnessed forced outlet and spent one actual operating credit, agenda, attention and body effort on Corin’s one landing visit.'),
            know('collection.commission', 'I saw the forced outlet and retained its repair account. I spent one existing operating credit, one agenda, one attention and one stamina on a two-minute commission. Corin accepts that actual credit for one finite walk to the landing and back; no remote pursuit or repeated fee is authorized.', N.foreman, 'nested.chain.welfare', N.foreman)],
        description: 'Only the existing committed, locally attributed seizure and a supported later visit permit this funded resident decision. No player order, free collector purse or omniscient raid is created.'}),
    command({id: `${I.prefix}collection_walk`, label: 'Corin performs the paid enginehouse-to-landing route', actorId: I.collector, worldId: N.salt,
        location: L.enginehouse, once: true, audience: [I.collector],
        requires: all(localSalt, eq(`${P}collectorSupported`), eq(`${P}collectionCommissioned`), not(eq(`${P}collectorArrived`)), not(eq(`${P}collectionClosed`))),
        ...job(3, all(localSalt, eq(`${P}collectorSupported`), not(eq(`${P}collectionClosed`)))),
        costs: [credit(-1, I.collector), stamina(-2, I.collector), {type: 'resource', actor: I.collector, key: 'routeAgenda', amount: -1}],
        effects: [{type: 'relocate', actor: I.collector, location: L.salt}, f('collection.arrived', true, I.collector), schedule(I.notice, 1, I.collector),
            know('collection.route', 'I used the paid credit, my one route agenda and two stamina to walk the declared enginehouse-to-landing route. I wait at the actual landing for local contact. No information or movement follows the traveler to another world.', I.collector, 'nested.chain.welfare', I.collector)]}),
    command({id: `${I.prefix}collection_fee`, label: 'Pay Corin’s one visit deferral · 2 Saltworks credits', worldId: N.salt, location: L.salt,
        targetId: I.collector, coLocated: true, participants: ['$target'], once: true, visibleWhen: eq(`${P}collectionNoticed`),
        requires: all(collectionOpen, eq(`${P}collectorAtLanding`)), costs: [credit(-2)],
        effects: [credit(2, N.foreman), ...terminalCollection('deferred', 'You paid two actual Saltworks credits to Brin through the witnessed collector account. Corin’s single funded visit ends, and this visit creates no new trade refusal. The forced outlet, retained grievance and original material repair duty remain; native wooden coins were not converted or used.'), f('collection.feePaid', 2)],
        description: 'One declared local fee, paid to the commissioning owner. Deferral closes this collection visit and does not repair the water line or erase its history.'}),
    command({id: `${I.prefix}collection_refuse`, label: 'Decline future Saltworks trade and close this visit', worldId: N.salt, location: L.salt,
        targetId: I.collector, coLocated: true, participants: ['$target'], once: true, visibleWhen: eq(`${P}collectionNoticed`),
        requires: all(collectionOpen, eq(`${P}collectorAtLanding`)),
        effects: [...terminalCollection('refused', 'You declined further Saltworks supply trade and Brin’s funded paid work. This single visit closes; ordinary departure, mission return and material restitution stay available. The existing forced outlet and repair account remain in local history.'), f('collection.futureTradeClosed')],
        description: 'A local future-trade consequence affects actual Saltworks supply sales and Brin’s paid commissions. It never blocks movement, mission departure, recovery or the existing material restitution.'}),
    command({id: `${I.prefix}collection_restore`, label: 'Restore the retained water line · 2 logs + rope + 2 stamina + 3 min', worldId: N.salt, location: L.enginehouse,
        targetId: N.foreman, coLocated: true, participants: ['$target'], once: true,
        visibleWhen: all(eq(`${P}collectionNoticed`), eq(`${P}waterRepairDue`)),
        requires: all(localSalt, hands, eq(`${P}collectionNoticed`), eq(`${P}waterRepairDue`), eq(`${P}foremanPresent`)),
        ...job(3, all(localSalt, hands, eq(`${P}collectionNoticed`), eq(`${P}waterRepairDue`), eq(`${P}foremanPresent`)), N.saltSite), completionCoLocated: true,
        costs: [item(K.log, -2), item(K.rope, -1), stamina(-2), stamina(-1, N.foreman)],
        effects: [{type: 'fact', actor: 'player', scope: 'actor', key: 'nested.chain.welfare.repairDue', value: false},
            {type: 'fact', actor: 'player', scope: 'actor', key: 'nested.chain.welfare.accessRestricted', value: false},
            {type: 'fact', actor: 'player', scope: 'actor', key: 'nested.chain.welfare.restituted', value: true},
            {type: 'world', worldId: N.salt, key: 'nested.saltworks.repaired', value: true}, {type: 'world', worldId: N.salt, key: 'nested.saltworks.water', value: 'stable'},
            f('collection.materialRestitution'), f('collection.futureTradeClosed', false),
            memory(N.foreman, 'player', 'The traveler supplied the actual two logs and rope and restored the retained water line. The old forcing and paid collection remain in the record.'),
            know('collection.restitution', 'Your actual two logs and rope repaired the existing water line with both people’s paid effort. The retained water-duty and access-restriction fields are settled under their existing owner, with no second export or mission payment. Material restitution ends any outstanding collection demand and reopens its future-trade terms; prior forcing, fee and resident spending remain recorded.', N.foreman, 'nested.chain.welfare')],
        description: 'Uses the same actual material repair and water-duty owners as the existing restitution. This route remains available after fee/refusal/timeout; reconciliation closes an outstanding demand exactly once.'}),
    command({id: `${I.prefix}collection_cancel_before_route`, label: 'Corin returns an unused route payment after actual restitution', actorId: I.collector, worldId: N.salt,
        location: L.enginehouse, once: true, audience: [I.collector],
        requires: all(localSalt, eq(`${P}collectorSupported`), eq(`${P}collectionClosed`), not(eq(`${P}collectorArrived`))),
        costs: [credit(-1, I.collector)], effects: [credit(1, N.foreman), f('collection.cancelledBeforeRoute', true, I.collector),
            {type: 'life', actor: I.collector, status: 'departed', reason: 'Actual restitution ended the finite demand before the paid landing route completed; the unused payment returned to Brin.'},
            know('collection.cancelled', 'The actual material restitution ended the demand before my landing walk completed. Its refundable reservation returned any held route effort. I returned the one unused commissioning credit to Brin and left this case; the resident’s earlier commission effort and forced outlet history remain spent and recorded.', I.collector, 'nested.chain.welfare', I.collector)]}),
    command({id: `${I.prefix}collection_return`, label: 'Corin finishes the finite landing return', actorId: I.collector, worldId: N.salt,
        location: L.salt, once: true, audience: [I.collector],
        requires: all(localSalt, eq(`${P}collectorSupported`), eq(`${P}collectionClosed`), eq(`${P}collectorArrived`)),
        ...job(3, all(localSalt, eq(`${P}collectorSupported`), eq(`${P}collectionClosed`))),
        costs: [stamina(-1, I.collector)], effects: [{type: 'relocate', actor: I.collector, location: L.enginehouse},
            f('collection.returned', true, I.collector), {type: 'life', actor: I.collector, status: 'departed', reason: 'Completed the one funded Saltworks landing route and returned to ordinary work.'},
            know('collection.returned', 'I used my remaining declared route effort to return to the enginehouse after the finite collection closed. My identity, paid credit sink, route agenda and prior results remain spent; I cannot respawn or launch another visit.', I.collector, 'nested.chain.welfare', I.collector)]}),
];

export const remainderConsequencesDefinitions = {
    people: [
        {id: I.steward, revision: 1, label: 'Nell, field-association steward', worldId: I.frontier, location: 'Village', inventory: 'simulation', provision: false,
            resources: {coins: 0}, body: {hands: 2, mobile: true}, vitals: {health: 20, max_health: 20, stamina: 6, max_stamina: 6}},
        {id: I.collector, revision: 1, label: 'Corin, Saltworks landing collector', worldId: N.salt, location: L.enginehouse, inventory: 'simulation', provision: false,
            resources: {'nested.credit': 0, routeAgenda: 1}, body: {hands: 2, mobile: true}, vitals: {health: 20, max_health: 20, stamina: 4, max_stamina: 4}},
    ],
    sites: [{id: I.bed, revision: 1, label: 'Nell’s permitted Village herb bed', capacity: 1}],
    conditions: [{id: I.friction, revision: 1, label: 'Iona’s recent interruption by this traveler', stacking: 'max'}],
    situations: [
        {id: I.plot, revision: 1, label: 'One actual association herb crop', context: {worldId: I.frontier, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
            privateTruth: {source: 'association_saved_seed_allocation', weatherPolicy: 'original_local_cold_draft_after_supported_inspection', cropCycles: 1},
            participants: ['player', I.steward], initialPhase: 'allocated', phases: ['allocated', 'planted', 'warned', 'covered', 'early', 'neglected', 'expired']},
        {id: I.collection, revision: 1, label: 'One funded Saltworks collection visit', context: {worldId: N.salt, instanceId: 'nested.saltworks.main', continuityId: 'nested.original.branch', eraId: 'nested.service_district.present', regionId: 'nested.saltworks.coast'},
            privateTruth: {commissioner: N.foreman, grievance: 'locally_witnessed_committed_outlet_seizure', route: 'enginehouse_landing_enginehouse', opportunities: 1},
            participants: ['player', N.foreman, I.collector], initialPhase: 'notified', phases: ['notified', 'deferred', 'refused', 'expired', 'restored']},
    ],
    commands: [...ionaCommands, ...plotCommands, ...collectionCommands],
    events: [
        {id: I.warning, revision: 1, label: 'Nell observes a cold draft at your actual planted herb bed', mode: 'ambient', interval: 1, maxOccurrences: 1,
            public: true, requires: all(enrolled, plotSupport, eq(`${P}stewardPresent`), phase(I.plot, 'planted')),
            effects: [shift(I.plot, 'planted', 'warned'), f('plot.warned'), schedule(I.frost, 6),
                know('plot.warning', 'At this actual planted Village bed, Nell shows you a cold draft through the hedge. This explicitly authored local trigger creates one six-minute supported played-time response window. Covering consumes a real log and two stamina over two minutes for five Cooking herbs; early harvest gives three; deliberate neglect or timeout gives one. All paths end this same crop once. No global season or universal crop death is inferred.', I.steward, I.plot)]},
        {id: I.frost, revision: 1, label: 'The warned herb bed reaches its one uncovered salvage', mode: 'ambient', interval: 1, maxOccurrences: 1,
            public: true, requires: all(enrolled, eq(`${P}frontierClockSupported`), phase(I.plot, 'warned')),
            effects: terminalPlot('expired', 1, 'The observed bed’s six supported local played minutes expired without completed cover or harvest. Its one final salvage added one real Cooking herb to your native inventory. No log was spent by the timeout; unfinished late cover refunds its actual reserved inputs and cannot add another crop.')},
        {id: I.notice, revision: 1, label: 'Corin meets you at the landing with Brin’s funded water account', mode: 'ambient', interval: 1, maxOccurrences: 1,
            public: true, requires: all(enrolled, localSalt, eq(`${P}atLanding`), eq(`${P}collectorAtLanding`), not(eq(`${P}collectionNoticed`)), not(eq(`${P}collectionClosed`))),
            effects: [{type: 'situation', situationId: I.collection, operation: 'begin'}, f('collection.noticed'), schedule(I.collectionExpiry, 6),
                know('collection.notice', 'You meet Corin at the actual Saltworks landing. Brin spent one existing local credit, agenda, attention and stamina on this single collection; Corin spent that credit, one route agenda and two stamina walking here. For six supported Saltworks minutes, choose a two-credit deferral paid to Brin, the actual two-log-and-rope water restitution, or refusal of future supply trade and Brin’s paid work. Departure and the original mission accounts remain available. Corin has no supported contest profile, so no combat option is offered.', I.collector, I.collection)]},
        {id: I.collectionExpiry, revision: 1, label: 'Corin’s single observed collection window closes', mode: 'ambient', interval: 1, maxOccurrences: 1,
            public: true, requires: all(enrolled, localSalt, phase(I.collection, 'notified'), not(eq(`${P}collectionClosed`))),
            effects: [...terminalCollection('expired', 'The six supported Saltworks minutes ended without a paid deferral or completed material restitution. Corin’s single visit closes and future Saltworks supply trade and Brin’s paid work close under the disclosed terms. Basic departure, mission settlement and later actual material restitution remain available; no collector, funds or grievance resets.'), f('collection.futureTradeClosed')]},
    ],
    controllers: [
        {id: `${I.prefix}brin_collection`, revision: 1, label: 'Brin’s one funded response to an actual grievance', actorId: N.foreman, interval: 1,
            actions: [{commandId: I.commission, priority: 1}]},
        {id: `${I.prefix}corin_route`, revision: 1, label: 'Corin’s finite paid landing route', actorId: I.collector, interval: 1,
            actions: [{commandId: `${I.prefix}collection_cancel_before_route`, priority: 3}, {commandId: `${I.prefix}collection_return`, priority: 2}, {commandId: `${I.prefix}collection_walk`, priority: 1}]},
    ],
};
