// DF-P04 is an original optional service, not a reproduction of DF formulas.
import {all, eq} from './basics.js';
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as K} from './feature_expansion_objects.js';
import {moneyActorNativeKey as money} from './content_kit.js';

export const STEAM_DF_IDS = Object.freeze({world: O.world, group: 'steam_df', prefix: 'steam.df.',
    owner: O.miri, site: O.site, situation: O.situation, item: K.sound,
    begin: 'steam.df.begin', estimate: 'steam.df.estimate', count: 'steam.df.count', buy: 'steam.df.buy_reported_pair',
    enrolled: 'steam.df.enrolled', report: 'steam.df.report', witness: 'steam.df.stockWitness'});
// Older issued notes remain readable; presentation changes do not erase them.
export const steamDFLegacyKnowledge = Object.freeze({
    'steam.df.opening': 'Eda offers a quick bracketed estimate or a paid full count of her sound staves. Each report is a dated sample of her offered stock. A current exact count can support buying two actual staves for four native coins.',
    'steam.df.purchase': 'You paid Eda four native coins and received two actual Sound repair staves from her offered stock. Those same carried items can brace the joint or feed fitting and ordinary survey-kit preparation. The withdrawal dated the previous report.',
});
const I = STEAM_DF_IDS;
const live = all(eq('steamDF.supported', true, 'Use your current living body and usable hands at the Village bench.'),
    eq('steamDF.ownerSupported', true, 'Eda must be present, willing and able to use her own hands.'),
    eq('steamDF.benchSupported', true, 'Eda must retain her actual fitting bench.'));
const enrolled = eq('steamDF.enrolled', true, 'Ask Eda about offered-stock reports first.');
const wage = amount => ({type: 'resource', actor: I.owner, key: 'coins', amount});
const knowledge = (key, value) => ({type: 'knowledge', actor: 'player', key, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: I.owner, situationId: I.situation}});
const command = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village',
    targetId: I.owner, coLocated: true, participants: ['$target'], costs: [], effects: [], ...d});
const report = (id, label, price, duration, effort, precision) => command({id, label, duration, cancellation: 'refund',
    reservationReturns: 1, siteId: I.site, steamDFPrecision: precision,
    visibleWhen: enrolled, requires: all(enrolled, live), completionRequires: all(enrolled, live,
        eq('steamDF.sampleCurrent', true, 'The accepted stock sample changed. Reserved costs return without a report or wage.')),
    completionCoLocated: true, completionFailure: 'refund',
    costs: [money(-price), {type: 'vital', actor: I.owner, key: 'stamina', amount: -effort}], effects: [wage(price)],
    description: precision === 'estimate'
        ? 'Eda can judge the stack at a glance. Give her a coin and a minute at the bench; she will give you a rough range. If the stack changes before she finishes, she returns your fee.'
        : 'For two coins, Eda will set aside three minutes to count the sound staves on her shelf. If the stack changes before she finishes, she returns your fee. Later orders can make an old count out of date.'});

export const steamDFDefinitions = {commands: [
    command({id: I.begin, label: 'Ask Eda about her offered-stock reports', once: true,
        visibleWhen: all(eq('actor.feature_objects.introduced'), eq('steamDF.enrolled', false)),
        requires: all(eq('actor.feature_objects.introduced'), live),
        effects: [{type: 'fact', scope: 'actor', actor: 'player', key: I.enrolled, value: true},
            knowledge('steam.df.opening', 'Eda taps the stacked staves. "A coin for a quick estimate, two for a proper count. If the count is still current, you can take a pair for four coins."')],
        description: 'Ask how Eda keeps track of the wood on her shelf. There is no charge for hearing her terms.'}),
    report(I.estimate, 'Pay Eda for a stock estimate · 1 coin + 1 min', 1, 1, 1, 'estimate'),
    report(I.count, 'Pay Eda for a full stock count · 2 coins + 3 min', 2, 3, 2, 'exact'),
    command({id: I.buy, label: 'Buy the currently reported pair · 4 coins', visibleWhen: enrolled,
        requires: all(enrolled, live, eq('steamDF.currentPair', true, 'Obtain a current exact report of at least two staves before buying this pair.')),
        costs: [money(-4), {type: 'transfer', from: I.owner, to: 'player', key: I.item, count: 2}],
        effects: [wage(4), knowledge('steam.df.purchase', 'Eda takes your four coins and lifts two sound staves from her shelf. They are yours to brace a joint or cut into survey-kit parts. Her shelf has changed; cross out the old count.')],
        description: 'Order two staves against Eda’s latest full count. She checks the shelf before handing them over. Once you take the pair, the old count is out of date.'}),
]};
