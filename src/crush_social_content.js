// Original, finite Village interactions inspired by the audited CC-P01/P03
// packets. No reference-game character, affection purchase or clock is added.
import {CRUSH_SOCIAL_IDS} from './crush_social_facts.js';
import {SOCIETY_IDS as S} from './feature_expansion_society.js';

export {CRUSH_SOCIAL_IDS} from './crush_social_facts.js';
export const CRUSH_SOCIAL_ITEMS = Object.freeze({wood: JSON.stringify({id: 'Rough wood log'}), kit: JSON.stringify({id: 'Prepared survey kit'})});
const P = CRUSH_SOCIAL_IDS.prefix, W = CRUSH_SOCIAL_IDS.world, promiseId = CRUSH_SOCIAL_IDS.promise, visitorId = CRUSH_SOCIAL_IDS.visitor;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const a = (key, value = true) => eq(`actor.${P}.${key}`, value);
const fact = (key, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: `${P}.${key}`, value});
const know = (key, value, actor = 'player') => ({type: 'knowledge', actor, key: `${P}.${key}`, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: visitorId, situationId: promiseId}});
const memory = text => ({type: 'relationship', actor: visitorId, target: 'player', axis: 'trust', amount: 1, text});
const stamina = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
const item = (actor, key, amount) => ({type: 'item', actor, key, amount});
const metHelp = all(eq(`situation.${promiseId}.phase`, 'met_help'), eq('crushSocial.metHelp'));
const local = eq('crushSocial.local', true, 'Meet Tamsin in the Village with supported local contact.');
const supported = all(local, eq('crushSocial.playerSupported', true, 'Recover your own two usable hands and supported mobile body before this shared work.'),
    eq('crushSocial.tamsinSupported', true, 'Tamsin cannot currently take this shared work. Recover or restore actual contact first.'),
    {fact: 'vital.health', op: 'gte', value: 2});
const offered = all(metHelp, a('offerHeard'));
const unchosen = not(eq('crushSocial.chosen'));
const willing = eq('crushSocial.tamsinWilling', true, 'Tamsin has not consented to this shared work.');
const practiced = all(eq('knowledge.promise.bracing.understood'), eq('knowledge.promise.bracing.basis', 'instruction'),
    eq('faculty.promise.bracing_control.active'), {fact: 'strength', op: 'gte', value: 6});
const shared = {reservationReturns: 1, cancellation: 'refund', completionCoLocated: true,
    completionRequires: all(supported, willing), completionFailure: 'refund'};
const command = d => ({revision: 1, group: 'promise', worldId: W, actorId: 'player', location: 'Village', targetId: visitorId,
    coLocated: true, participants: ['$target'], once: true, costs: [], effects: [], ...d});

export const crushSocialDefinitions = {commands: [
    command({id: `${P}.outing_offer`, label: 'Ask Tamsin about a shared cart check', visibleWhen: metHelp, requires: all(metHelp, supported),
        description: 'One optional local outing after her actual repair report. Hearing the offer reserves no materials or future work.',
        effects: [fact('offerHeard'), fact('willing', true, visitorId),
            know('outing.terms', 'Tamsin offers one load check at the Village crossing. She says she prefers patient testing because it lets her inspect the brace. Patient testing takes five played minutes, your one log and two stamina, and her one stamina; the log becomes a retained stop wedge. A quicker carry takes two played minutes, your four stamina and her three stamina, with no log. Both reserve you and Tamsin together. Cancellation or lost contact returns each person’s reserved inputs; elapsed time remains spent. Declining creates no duty and changes none of your earlier bracing or passage.'),
            know('outing.offer', 'I offered one optional crossing load check and explained that I prefer patient testing. Hearing me is not an agreement.', visitorId)]}),
    command({id: `${P}.outing_patient`, label: 'Patient load check · 1 log + 2 stamina · 5 min', duration: 5, ...shared,
        visibleWhen: all(offered, unchosen), requires: all(offered, unchosen, supported, willing),
        description: 'You supply a stop wedge and test the cart together. Tamsin spends one of her own stamina. Both people stay occupied for five played minutes.',
        costs: [item('player', CRUSH_SOCIAL_ITEMS.wood, -1), stamina('player', -2), stamina(visitorId, -1)],
        effects: [fact('choice', 'patient'), fact('performed', 'patient', visitorId),
            {type: 'world', worldId: W, key: `${P}.crossingWedge`, value: true},
            know('outing.patient', 'You and Tamsin completed the patient load check. Your real log became the crossing stop wedge; you spent two stamina and she spent one. You tested the brace together without accepting the old promise.'),
            know('outing.patient', 'We used the traveler’s real stop wedge and tested the brace patiently. They followed the careful working preference I had explained.', visitorId),
            memory('Shared a patient cart check with actual wood, effort and time, following my disclosed preference.')] }),
    command({id: `${P}.outing_quick`, label: 'Quicker carry · 4 stamina · 2 min', duration: 2, ...shared,
        visibleWhen: all(offered, unchosen), requires: all(offered, unchosen, supported, willing),
        description: 'Carry the load together with no new wood. Tamsin spends three of her own stamina. The shorter job uses more effort from each person.',
        costs: [stamina('player', -4), stamina(visitorId, -3)],
        effects: [fact('choice', 'quick'), fact('performed', 'quick', visitorId),
            know('outing.quick', 'You and Tamsin completed the quicker carry. No new wood was spent; you spent four stamina and she spent three. The load crossed, but this was a carry rather than her preferred measured brace inspection.'),
            know('outing.quick', 'We carried the load across with our own effort. The help was real, though I still prefer measured inspection for the next brace.', visitorId),
            memory('Shared a quicker carry with real effort and time; it helped the delivery but did not replace my preferred measured inspection.')] }),
    command({id: `${P}.outing_decline`, label: 'Decline this outing · no duty or cost', visibleWhen: all(offered, unchosen), requires: all(offered, unchosen, local),
        effects: [fact('choice', 'declined'), fact('willing', false, visitorId),
            know('outing.declined', 'You declined the optional load check. Tamsin accepted the answer. No new promise, future work, missed affection or debt was created; your earlier repair and practiced bracing remain separate.')] }),
    ...['patient', 'quick'].map(route => command({id: `${P}.report_${route}`, label: 'Hear Tamsin’s account of your shared check',
        visibleWhen: a('choice', route), requires: all(metHelp, local, a('choice', route), eq(`knowledge.${P}.outing.${route}.seen`)),
        description: 'An actual later meeting records her account. Rereading the retained report is free and gives no new reward.',
        effects: [fact('reported'), know('outing.report', route === 'patient'
            ? 'Tamsin says: “The patient check suited how I work. The stop wedge is still at the crossing, and we saw the brace hold together. After you actually learn my bracing grip, I would like to pack one measured survey kit with you: one of your logs, one stamina from each of us, and three played minutes.”'
            : 'Tamsin says: “The carry helped me get the load across. I still prefer taking time to inspect a brace. After you actually learn my bracing grip, I would like our next job to be one measured survey kit: one of your logs, two of your stamina, one of mine, and four played minutes.”')]})),
    ...['patient', 'quick'].map(route => command({id: `${P}.shared_pack_${route}`, label: `Pack one measured kit with Tamsin · 1 log + ${route === 'patient' ? 1 : 2} stamina · ${route === 'patient' ? 3 : 4} min`,
        duration: route === 'patient' ? 3 : 4, ...shared, completionRequires: all(supported, willing, practiced),
        visibleWhen: all(a('reported'), a('choice', route)), requires: all(metHelp, a('reported'), a('choice', route), supported, willing, practiced),
        description: 'Accept only this later offered collaboration. You must have earned the existing practiced bracing method; hearing a description or an outing report cannot grant it. Tamsin spends one of her own stamina.',
        costs: [item('player', CRUSH_SOCIAL_ITEMS.wood, -1), stamina('player', route === 'patient' ? -1 : -2), stamina(visitorId, -1)],
        effects: [item('player', CRUSH_SOCIAL_ITEMS.kit, 1), fact('collaborationDone'),
            know('collaboration.result', 'You and Tamsin packed the one offered measured survey kit using your actually learned bracing method, real log and both people’s effort. The kit is in your own bag. This completed collaboration creates no repeat demand, free stock or future duty.'),
            know('collaboration.result', 'We completed the one measured kit I offered after our shared outing. The traveler used their own learned bracing grip and wood; both of us spent effort.', visitorId),
            memory('Completed the separately agreed measured kit after the actual outing report and practiced bracing lesson.')] })),
]};

// Distinct revision-1 IDs leave every existing household/apprentice cursor
// intact. The preparation phase ends before the next actual conversation.
export const crushSocialWorkPlans = Object.freeze([
    {id: CRUSH_SOCIAL_IDS.preparation, revision: 1, label: 'Known household preparation, then meet Hessa', actorId: 'player',
        origin: `${S.prefix}.terms`, visibleWhen: eq(`actor.${S.prefix}.termsHeard`),
        requires: all(eq(`actor.${S.prefix}.introduced`), eq('society.clockSupported'), eq(`actor.${S.prefix}.termsHeard`), not(eq(`world.${S.prefix}.closed`))),
        steps: [{id: 'supply', kind: 'command', commandId: `${S.prefix}.supply`, revision: 1, targetId: S.household},
            {id: 'permission', kind: 'command', commandId: `${S.prefix}.authorize_home`, revision: 1, targetId: S.household},
            {id: 'wait_repair', kind: 'wait', requires: eq(`world.${S.prefix}.homeRepaired`), actorId: S.craftsperson,
                commandId: `${S.prefix}.orr_repair`, revision: 1, label: 'Wait for Orr’s funded repair, then stop before hearing Hessa’s report'}]},
    {id: CRUSH_SOCIAL_IDS.knownUse, revision: 1, label: 'One already learned household method at home', actorId: 'player',
        origin: `${S.prefix}.personal_lesson`, visibleWhen: all(eq(`actor.${S.prefix}.homeReported`), eq(`actor.${S.prefix}.personalTaught`)),
        requires: all(eq('society.clockSupported'), eq(`actor.${S.prefix}.homeReported`), eq(`actor.${S.prefix}.personalTaught`),
            eq(`knowledge.${S.prefix}.personal.method.understood`)),
        steps: [{id: 'travel_home', kind: 'travel', location: 'Shack', label: 'Travel to your Shack through native travel'},
            {id: 'personal_use', kind: 'command', commandId: `${S.prefix}.personal_pack`, revision: 1}]},
]);

export const crushSocialCommand = id => crushSocialDefinitions.commands.find(d => d.id === id);
