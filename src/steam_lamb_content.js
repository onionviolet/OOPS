// LAMB-P02: original local agreement and service, separate from learned means.
import {all, eq} from './basics.js';
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as K} from './feature_expansion_objects.js';
import {moneyActorNativeKey as money, itemKeyActorReturned as item} from './content_kit.js';

export const STEAM_LAMB_IDS = Object.freeze({world: O.world, group: 'steam_lamb', prefix: 'steam.lamb.',
    owner: O.miri, site: O.site, situation: O.situation, method: O.method, version: 1,
    observe: 'feature_objects.observe_alignment', learn: 'feature_objects.learn',
    appoint: 'steam.lamb.appoint', inspectFine: 'steam.lamb.inspect_fine', inspectFineDull: 'steam.lamb.inspect_fineDull',
    deliver: 'steam.lamb.deliver', end: 'steam.lamb.end', office: 'steam.lamb.office', approval: 'steam.lamb.approval'});
export const STEAM_LAMB_KEYS = Object.freeze({matched: K.matched, fine: K.fine, fineDull: K.fineDull});
const I = STEAM_LAMB_IDS;
const local = eq('steamLamb.supported', true, 'Return to the Village with your living body and finish any battle or journey.');
const qualified = eq('steamLamb.qualified', true, 'Watch Eda’s actual cut and complete Grain matching practice with her first.');
const office = eq('steamLamb.office', true, 'Eda must still hold your agreed fitting appointment.');
const live = all(local, eq('steamLamb.handsUsable', true, 'Recover your hands before fitting work.'),
    eq('steamLamb.ownerSupported', true, 'Eda needs her present consent, living body, usable hands and trained fitting method.'),
    eq('steamLamb.benchSupported', true, 'Use Eda’s actual fitting bench.'));
const purse = amount => ({type: 'resource', actor: I.owner, key: 'coins', amount});
const fact = (key, value, actor) => ({type: 'fact', scope: 'actor', actor, key, value});
const know = (key, value) => ({type: 'knowledge', actor: 'player', key: `${I.prefix}${key}`, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: I.owner, situationId: I.situation}});
const command = d => Object.fromEntries(Object.entries({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village', once: true,
    targetId: I.owner, coLocated: true, participants: ['$target'], costs: [], effects: [], ...d}).filter(([, value]) => value !== undefined));
const timed = (d, requirements) => command({...d, siteId: I.site, cancellation: 'refund', reservationReturns: 1,
    completionCoLocated: true, completionFailure: 'refund', completionRequires: all(live, qualified, requirements,
        eq('steamLamb.workCurrent', true, 'This work has lost the exact items or bench space set aside for it.'))});
const inspect = (id, variant, key) => timed({id, label: `Ask Eda to inspect a matched stave with her ${variant === 'fine' ? 'sharp' : 'dulled'} fine guide · 1 coin + 2 min`,
    duration: 2, visibleWhen: all(office, eq('steamLamb.inspectionAvailable')),
    requires: all(live, qualified, office, eq('steamLamb.inspectionAvailable'),
        eq('steamLamb.own.matched', true, 'Bring one of your own Matched repair staves, free of any loan or equipment.'),
        eq(`steamLamb.guide.${variant}`, true, 'Eda needs her own available fine guide. Return any guided knife loan first.')),
    costs: [money(-1), {type: 'vital', actor: I.owner, key: 'stamina', amount: -1}, item(K.matched, -1), item(K[variant], -1, I.owner)],
    effects: [item(K.matched, 1, 'player', true), item(K[variant], 1, I.owner, true), purse(1), fact(I.approval, true, 'player'),
        know(key, `Eda used her own ${variant === 'fine' ? 'sharp' : 'dulled'} fine guide and trained fitting method to inspect your Matched repair stave. She returns the stave and puts away that unchanged guide. Your coin paid for her attention. She accepts one stave of this kind for one small order, paying three coins from her own purse when you deliver it.`)],
    description: 'Set aside one owned Matched repair stave and Eda’s own fine guide for two minutes. Eda spends one stamina. You receive both items back unchanged; her approval covers this kind of stave for one order. Stopping returns the coin, stamina and items without approval.'},
    all(office, eq('steamLamb.inspectionAvailable')));

export const steamLambDefinitions = {commands: [
    timed({id: I.appoint, label: 'Agree Eda’s fitting assessor appointment · 1 min', duration: 1,
        visibleWhen: all(eq('actor.feature_objects.introduced'), qualified, eq('steamLamb.unappointed')),
        requires: all(live, qualified, eq('steamLamb.unappointed')),
        effects: [fact(I.office, true, I.owner), know('appointment', 'After watching Eda’s real grain cut and completing supervised Grain matching practice, you agree a local fitting assessor appointment together. Eda keeps her own practiced method. For one coin and two minutes, she will inspect an owned matched stave with her own fine guide; one approved small order can then pay three coins from her purse.')],
        description: 'Spend one willing minute together at Eda’s bench to agree the terms. No fee or new ability comes with the appointment. Stopping leaves the agreement unmade.'}, eq('steamLamb.unappointed')),
    inspect(I.inspectFine, 'fine', 'inspection_fine'),
    inspect(I.inspectFineDull, 'fineDull', 'inspection_fineDull'),
    timed({id: I.deliver, label: 'Deliver one approved matched stave to Eda · receive 3 coins + 1 min', duration: 1,
        visibleWhen: all(office, eq('steamLamb.approval')),
        requires: all(live, qualified, office, eq('steamLamb.approval'),
            eq('steamLamb.own.matched', true, 'Bring one owned Matched repair stave for this order.'),
            eq('steamLamb.purseReady', true, 'Eda must have three available coins in her own purse.')),
        costs: [item(K.matched, -1), purse(-3)],
        effects: [item(K.matched, 1, I.owner), money(3), fact(I.approval, false, 'player'),
            know('delivery', 'You handed one of your own Matched repair staves to Eda for her small fitting order. She paid three coins from her actual purse. The stave is now hers, and that one approval is spent. This order is settled.')],
        description: 'One minute at the bench hands your owned stave to Eda. The stave and her three coins are held aside until completion. Stopping returns both without paying or settling the order.'}, all(office, eq('steamLamb.approval'))),
    command({id: I.end, label: 'End the fitting assessor agreement', targetId: null, coLocated: false, participants: undefined,
        visibleWhen: office, requires: all(local, office),
        effects: [fact(I.office, false, I.owner), know('ending', 'You end the fitting assessor agreement. Eda keeps her practiced Grain matching method, and the appointment and work already done remain remembered. No further inspection or delivery is accepted under these terms.')],
        description: 'End future inspection and delivery access. Earlier learning and settled work remain. Eda does not need an active fitting method, a guide or spare stock for you to end the agreement.'}),
]};
