// Original optional local instruction. Definitions grant no teacher, body,
// stock, source, energy or controller merely by being imported.
import {REMAINDER_HOME_IDS as H, REMAINDER_HOME_KEYS as K} from './audit_remainder_home_content.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';

export const WORLD_COMPLETION_LEARNING_IDS = Object.freeze({
    world: H.world, group: 'world_completion_learning', prefix: 'world.completion.learning.',
    eda: H.eda, neri: H.resident, teacherMethod: H.grain, bench: H.bench,
    workshop: H.workshop, residence: H.residence, situation: 'world.completion.learning.terms',
    method: 'world.completion.learning.datum', controller: 'world.completion.learning.neri_controller',
});
export const WORLD_COMPLETION_LEARNING_KEYS = Object.freeze({offcut: K.offcut, strip: JSON.stringify({id: 'Measured drain strip'})});
const I = WORLD_COMPLETION_LEARNING_IDS, P = I.prefix, Q = WORLD_COMPLETION_LEARNING_KEYS;
export const worldCompletionLearningSources = [{id: I.method, revision: 1, label: 'Taught datum marking', kind: 'technique', origin: 'trained', grants: [],
    bioDetail: 'Eda taught the measurement procedure through an actual paid demonstration. Execution needs this learner’s own usable human hands, current sample and compatible material; Eda retains her Grain matching source.'}];
export const worldCompletionLearningItemSpecifications = [{id: 'Measured drain strip', value: 1,
    description: 'One compatible offcut marked and fitted by an actual trained learner against the current local sample. Its measured provenance stays with the maker or exact recorded transfer. It can line the opted-in notch or fit one timber cover; ordinary larger-material work remains available.'}];
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const f = (name, reason) => eq('worldCompletionLearning.' + name, true, reason);
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const af = (name, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: P + name, value});
const wf = (name, value) => ({type: 'world', worldId: I.world, key: P + name, value});
const item = (actor, key, amount, returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
const stamina = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
const resource = (actor, key, amount) => ({type: 'resource', actor, key, amount});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const transfer = (from, to, key) => ({type: 'transfer', from, to, key, count: 1});
const know = (name, value, actor = 'player', speaker = actor, instruction = false) => ({type: 'knowledge', actor, key: P + name,
    stage: instruction ? 'understood' : 'seen', value, basis: {kind: instruction ? 'instruction' : 'observation', attributedTo: speaker, situationId: I.situation}});
const command = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village', reservationReturns: 1,
    costs: [], effects: [], visibleWhen: f('enrolled'), ...d});
const npc = d => command({actorId: I.neri, audience: ['$actor'], ...d});
const contact = targetId => ({targetId, coLocated: true, participants: ['$target']});
const local = f('local', 'Use the living human home body and supported played clock.');
const sample = f('sample', 'Perform a current notch sample and an actual lens measurement before this precise work.');
const teacher = all(f('teacher', 'Eda needs her present willing body, recovered hands and actual permitted Village bench.'),
    f('teacherMethod', 'Eda must retain her own active Grain matching source and executable control.'));
const bench = all(local, f('benchRight', 'Accept Eda’s actual measuring-bench permission and this separate lesson’s terms.'));
const learner = all(f('learner', 'This actual learner needs their own living human body and two recovered hands.'),
    f('frozenLearner', 'The accepted job belongs to the same actual learner body; unchanged reservations return.'));
const offcut = f('offcut', 'Supply an actual unencumbered Compatible repair offcut, including only this exact held demonstration.');
const timed = (duration, support, siteId = I.bench, coLocated = false) => ({duration, cancellation: 'refund',
    completionRequires: support, completionFailure: 'refund', completionCoLocated: coLocated, ...(siteId ? {siteId} : {})});
const learnEffects = actor => [item(actor, Q.offcut, 1, true), resource(I.eda, 'coins', 2),
    {type: 'source', actor, operation: 'grant', sourceId: I.method, origin: 'trained', awakened: true, active: true},
    {type: 'power', actor, operation: 'learn', powerId: I.method},
    know('procedure', 'Completed Eda’s paid five-minute datum demonstration with one actual compatible offcut held and returned. I spent my own stamina; Eda spent hers and retained her own Grain matching source. I learned only the datum procedure. Its exact teacher/source/sample causes are retained separately; it grants no body, mana, stock or exclusive specialization.', actor, I.eda, true),
    know(actor === 'player' ? 'taught_player' : 'taught_neri', 'I completed this paid datum lesson with the actual learner and held demonstration offcut. Two coins entered my own purse. My own source and body stayed mine.', I.eda, I.eda, true)];
const atBench = f('atBench', 'Use the actual permitted Village bench; retained knowledge cannot move this body there.');
const lessonSupport = all(bench, atBench, learner, teacher, sample, offcut, f('frozenSample', 'The accepted sample or teacher source changed; unchanged reservations return without a lesson.'));
const makingSupport = all(bench, atBench, learner, sample, f('method', 'Keep your own active learned datum source and procedure.'),
    f('frozenSample', 'The accepted measurement changed; unchanged inputs return without a strip.'));

export const worldCompletionLearningDefinitions = {
    situations: [{id: I.situation, revision: 1, label: 'A paid datum procedure',
        context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
        participants: ['player', I.eda], initialPhase: 'open', phases: ['open'], privateTruth: {method: 'instruction_does_not_copy_teacher_body', sponsorship: 'finite_owned_means'}}],
    powers: [{id: I.method, revision: 1, label: 'Taught datum marking', model: 'practice', worlds: [I.world], capacity: 1,
        execution: all(bench, atBench, learner, sample, f('method'))}],
    commands: [
        command({id: P + 'begin', once: true, label: 'Hear Eda’s separate datum lesson terms · optional', ...contact(I.eda), siteId: I.bench,
            visibleWhen: all(f('canBegin'), not(f('enrolled'))), requires: all(f('canBegin'), teacher, sample),
            effects: [{type: 'situation', operation: 'begin', situationId: I.situation}, af('enrolled'),
                know('terms', 'Two native coins pay Eda only when the five-minute lesson completes. The learner holds and returns one compatible offcut and spends one own stamina; Eda spends one own stamina and keeps her Grain matching source. You may learn personally, fund a willing Neri, or keep ordinary log lining. Neri must finish and settle her old service first; sponsorship spends her own remaining attention, two two-minute trips, lesson effort and separate strip effort. It supplies no refill. A later two-minute job consumes one compatible offcut and one own stamina for one measured strip. Neri owns her actual product until she separately hands it over.', 'player', I.eda, true)]}),
        command({id: P + 'learn_player', once: true, label: 'Learn datum marking yourself · 2 coins + held offcut + our effort + 5 min',
            ...contact(I.eda), requires: all(lessonSupport, not(f('methodOwned'))), ...timed(5, lessonSupport, I.bench, true),
            costs: [money(-2), item('player', Q.offcut, -1), stamina('player', -1), stamina(I.eda, -1)], effects: learnEffects('player')}),
        command({id: P + 'sponsor', once: true, location: 'Shack', label: 'Offer Neri datum instruction · 1 offcut + 2 coins escrow', ...contact(I.neri),
            visibleWhen: all(f('enrolled'), f('neriKnown')), requires: all(local, f('neriContact'), f('neriHome'), f('neriSettled'), sample),
            costs: [money(-2), transfer('player', I.neri, Q.offcut)], effects: [resource(I.neri, P + 'escrow', 2), wf('response', 'pending'),
                know('sponsor_offer', 'Offered one actual compatible offcut and two separate instruction coins. Neri decides whether her own remaining attention, four stamina and permitted trips support the lesson and separate strip work. A refusal preserves her old room, tool, wages and first service; only this unchanged new escrow can be withdrawn.', 'player', I.neri),
                know('offer', 'Received one new actual compatible offcut and two separately held lesson coins. I may accept or decline on my own present means. This offer does not replenish my attention or stamina.', I.neri, 'player')]}),
        npc({id: P + 'accept', once: true, location: 'Shack', label: 'Neri agrees to one lesson and her own strip work',
            requires: all(local, f('pending'), f('neriAccepts')), effects: [wf('response', 'accepted'),
                know('accept', 'I consented to one funded datum lesson and separate owned strip work after checking my own attention, four stamina, unchanged supplied stock and Eda’s actual permitted site/source. The trips, demonstration and production still need to happen.', I.neri)]}),
        npc({id: P + 'refuse', once: true, location: 'Shack', label: 'Neri declines the offered instruction',
            requires: all(local, f('pending'), not(f('neriAccepts'))), effects: [wf('response', 'refused'),
                know('refuse', 'I declined this lesson with my present means or support. I spent no attention and earned no product; this unchanged new offcut and lesson escrow remain refundable.', I.neri)]}),
        npc({id: P + 'walk_to_bench', once: true, location: 'Shack', label: 'Neri walks to the actual Village bench · own 1 stamina + 2 min',
            requires: all(local, f('neriAccepted'), f('neriHome'), learner), ...timed(2, all(local, f('neriAccepted'), learner), null),
            costs: [stamina(I.neri, -1)], effects: [{type: 'relocate', actor: I.neri, location: 'Village'},
                know('arrived', 'Spent my own stamina and two played minutes reaching Eda’s actual Village bench. My body and stock moved together; the traveler need not be my controller.', I.neri)]}),
        npc({id: P + 'learn_neri', once: true, label: 'Eda teaches consenting Neri · held offcut + their own effort/attention + 5 min', ...contact(I.eda),
            requires: all(lessonSupport, f('neriAccepted'), not(f('methodOwned'))), ...timed(5, all(lessonSupport, f('neriAccepted')), I.bench, true),
            costs: [resource(I.neri, P + 'escrow', -2), resource(I.neri, 'attention', -1), item(I.neri, Q.offcut, -1), stamina(I.neri, -1), stamina(I.eda, -1)],
            effects: [...learnEffects(I.neri), wf('response', 'learned')]}),
        command({id: P + 'make_player', label: 'Fit your measured drain strip · 1 offcut + 1 stamina + 2 min', powerId: I.method,
            visibleWhen: f('methodOwned'), requires: all(makingSupport, f('stripAbsent')), ...timed(2, makingSupport),
            costs: [item('player', Q.offcut, -1), stamina('player', -1)], effects: [
                know('made', 'Consumed one actual compatible offcut and my own stamina over two played minutes to fit one measured drain strip. Its frozen current sample cause is retained with this actual production. The strip is physical stock; it can supply the compatible notch or cover once.')]}),
        npc({id: P + 'make_neri', once: true, label: 'Neri fits her own measured drain strip · 1 offcut + own 1 stamina + 2 min', powerId: I.method,
            requires: all(makingSupport, f('neriAccepted'), f('stripAbsent')), ...timed(2, all(makingSupport, f('neriAccepted'))),
            costs: [item(I.neri, Q.offcut, -1), stamina(I.neri, -1)], effects: [wf('response', 'made'),
                know('made', 'Consumed the actual supplied compatible offcut and my own stamina over two played minutes to fit one measured drain strip. It is my physical product until the separate agreed handover. No traveler source or stock was granted.', I.neri)]}),
        command({id: P + 'collect', once: true, label: 'Receive Neri’s exact produced strip · separate handover', ...contact(I.neri),
            visibleWhen: f('collectionVisible'), requires: all(local, f('neriContact'), f('collectable')),
            costs: [transfer(I.neri, 'player', Q.strip)], effects: [wf('response', 'collected'),
                know('collected', 'Neri separately handed over her actual produced measured drain strip. Its exact maker and frozen sample causes were retained. Her datum procedure, body, wages and room remain hers.', 'player', I.neri)]}),
        command({id: P + 'release_neri', once: true, label: 'Release Neri from this unfinished new work · retain any learned procedure', ...contact(I.neri),
            visibleWhen: f('releasable'), requires: all(local, f('neriContact'), f('releasable')),
            effects: [wf('released', true), know('released', 'Agreed to stop only this unfinished new sponsored work. Any actually learned procedure stays Neri’s. Cancelled or unsupported reservations return first; unearned new escrow and unchanged offcut can be separately withdrawn. Existing residence and wages remain hers.', 'player', I.neri)]}),
        ...['Village', 'Shack'].map(location => command({id: P + 'withdraw_' + location.toLowerCase(), once: true, location,
            label: 'Withdraw unchanged lesson escrow · 1 offcut + 2 coins returned', ...contact(I.neri), visibleWhen: f('withdrawable'),
            requires: all(local, f('neriContact'), f('withdrawable')), costs: [resource(I.neri, P + 'escrow', -2), transfer(I.neri, 'player', Q.offcut)],
            effects: [money(2), wf('response', 'withdrawn'), know('withdrawn', 'Only the unperformed new lesson’s two escrow coins and unchanged supplied offcut returned. Completed instruction earns its fee and retains its learned procedure; old wages and property are not refundable.', 'player', I.neri)]})),
        npc({id: P + 'return_home', once: true, label: 'Neri returns to her retained room · own 1 stamina + 2 min',
            requires: all(local, learner, f('neriReturn')), ...timed(2, all(local, learner, f('neriReturn')), null),
            costs: [stamina(I.neri, -1)], effects: [{type: 'relocate', actor: I.neri, location: 'Shack'},
                know('returned', 'Spent my own stamina and two played minutes returning to my retained room after the new work ended or was released. No stock, attention or lesson was reset.', I.neri)]}),
        ...['Village', 'Shack'].map(location => command({id: P + 'account_' + location.toLowerCase(), location,
            label: 'Hear Neri’s current lesson and product account', ...contact(I.neri), visibleWhen: f('neriKnown'),
            requires: all(local, f('neriContact'), f('enrolled')), effects: [know('account', 'Met the actual Neri and heard her current answer, travel, instruction, product and handover account. This report supplies no hidden purse, stock, source or completed work.', 'player', I.neri)]})),
        command({id: P + 'ordinary', once: true, label: 'Keep ordinary larger-material lining · no lesson or fee',
            requires: all(local, f('enrolled')), effects: [af('ordinary'), know('ordinary', 'Kept the ordinary larger-material route. No fee, learner, body, method or strip was granted. A later paid lesson remains possible without rewriting an earlier rain or crop outcome.')]}),
    ],
    controllers: [{id: I.controller, revision: 1, label: 'Neri’s finite datum-learning agenda', actorId: I.neri, interval: 1, actions: [
        ['accept', 100], ['refuse', 90], ['walk_to_bench', 80], ['learn_neri', 70], ['make_neri', 60], ['return_home', 50],
    ].map(([id, priority]) => ({priority, commandId: P + id, ...(id === 'learn_neri' ? {targetId: I.eda} : {}), when: f('enrolled')}))}],
};

// The host freezes the actual maker key for the single immediate handover.
// Base definitions retain the template placeholder only while ineligible.
export function worldCompletionLearningCollectDefinition(key) {
    const d = worldCompletionLearningDefinitions.commands.find(d => d.id === P + 'collect');
    if(!worldCompletionStripStamp(key)) return d;
    return {...d, costs: [{type: 'transfer', from: I.neri, to: 'player', key, count: 1}]};
}

// Exact co-located release alternative before the outbound trip.
const villageRelease=worldCompletionLearningDefinitions.commands.find(d=>d.id===P+"release_neri");
worldCompletionLearningDefinitions.commands.push({...villageRelease,id:P+"release_neri_shack",location:"Shack"});
