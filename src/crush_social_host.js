import {sameStructural as same} from './basics.js';
import {CRUSH_SOCIAL_IDS as I, crushSocialDefinitions, crushSocialWorkPlans, crushSocialCommand} from './crush_social_content.js';
import {crushSocialContext} from './crush_social_facts.js';
import {assert, natural, record} from './simulation_contracts.js';
import {commitSimulationCommand, cancelSimulationJob} from './simulation.js';
import {startWorkPlan, controlWorkPlan} from './feature_expansion_work_plan.js';

const P = I.prefix, visitorId = I.visitor, key = suffix => `${P}.${suffix}`;
const done = (state, id) => state.actors?.player?.completed?.[key(id)] || 0;

export {crushSocialFacts, crushSocialContext} from './crush_social_facts.js';

// Root registers these definitions in the one existing registry and routes
// their results through the same durable publisher as ordinary promise work.
export function commitCrushSocialAction(state, registry, command, context, expectedSequence = state.sequence) {
    assert(expectedSequence === state.sequence && context.actorId === 'player', 'This local collaboration action is stale or unbound.');
    context = crushSocialContext(state, context);
    let out;
    if(command.type === 'plan_start') {
        assert(crushSocialWorkPlans.some(d => d.id === command.id) && registry.workPlans?.has(command.id), 'Choose the current finite preparation phase.');
        out = startWorkPlan(state, registry, registry.workPlans, command.id, context, expectedSequence);
    } else if(command.type === 'plan_control') {
        const cursor = state.simulation?.workPlans?.cursors?.player;
        assert(cursor?.id === command.cursorId && crushSocialWorkPlans.some(d => d.id === cursor.definitionId), 'Control only this actual preparation cursor.');
        out = controlWorkPlan(state, registry, command, context, expectedSequence);
    } else if(command.type === 'cancel_job') {
        const job = state.simulation?.jobs.find(j => j.id === command.id && j.actorId === 'player');
        assert(job && crushSocialCommand(job.commandId), 'Cancel only your actual accepted Tamsin collaboration.');
        out = cancelSimulationJob(state, registry, job.id, context, expectedSequence);
    } else {
        const d = crushSocialCommand(command.id);
        assert(command.type === 'command' && d && (command.targetId == null || command.targetId === visitorId), 'Choose the declared Tamsin collaboration.');
        out = commitSimulationCommand(state, registry, {id: d.id}, {...context, targetId: visitorId}, expectedSequence);
    }
    validateCrushSocial(out.state, registry);
    return out;
}

// Absent facts are inert. New records require their actual named completions;
// old promise phases, jobs, lesson source and work-plan cursors are untouched.
export function validateCrushSocial(state, registry) {
    const s = state.simulation, actors = state.actors || {}, p = actors.player, definitions = crushSocialDefinitions.commands;
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(`${P}.`));
    const owned = Object.entries(actors).flatMap(([actorId, a]) => ['facts', 'resources', 'completed'].flatMap(domain =>
        Object.entries(a[domain] || {}).filter(([k]) => k.startsWith(`${P}.`)).map(([k, value]) => ({actorId, domain, k, value}))));
    const records = Object.entries(s?.knowledge || {}).flatMap(([actorId, knowledge]) =>
        Object.entries(knowledge).filter(([k]) => k.startsWith(`${P}.`)).map(([k, r]) => ({actorId, k, r})));
    const worlds = Object.entries(state.worlds || {}).flatMap(([worldId, w]) => Object.entries(w.facts || {})
        .filter(([k]) => k.startsWith(`${P}.`)).map(([k, value]) => ({worldId, k, value})));
    if(!owned.length && !records.length && !worlds.length && !jobs.length) return;
    assert(s && p?.completed?.['promise.meet_help'] === 1 && s.people?.[visitorId] && actors[visitorId],
        'Tamsin collaboration needs the actual earlier repair meeting, not a retrospective outing.');
    const allowedFacts = new Map(), allowedRecords = new Map();
    for(const d of definitions) {
        const count = p.completed?.[d.id] || 0;
        assert(count === 0 || count === 1, 'This Tamsin interaction is finite and once-only.');
        for(const e of d.effects) {
            if(e.type === 'fact') {
                const id = `${e.actor}:${e.key}`;
                if(!allowedFacts.has(id)) allowedFacts.set(id, []);
                allowedFacts.get(id).push({commandId: d.id, value: e.value});
            }
            if(e.type === 'knowledge') {
                const id = `${e.actor}:${e.key}`;
                if(!allowedRecords.has(id)) allowedRecords.set(id, []);
                allowedRecords.get(id).push({effect: e, commandId: d.id});
            }
        }
    }
    assert(owned.every(e => e.domain === 'facts' && allowedFacts.has(`${e.actorId}:${e.k}`) ||
        e.domain === 'completed' && e.actorId === 'player' && !!crushSocialCommand(e.k) && e.value === 1),
        'Unsupported local collaboration fact, resource or completion.');
    const choice = p.facts?.[key('choice')], choices = ['outing_patient', 'outing_quick', 'outing_decline'].filter(id => done(state, id));
    assert(choices.length <= 1 && (choice == null) === (choices.length === 0) &&
        (choice == null || choice === ({outing_patient: 'patient', outing_quick: 'quick', outing_decline: 'declined'})[choices[0]]),
        'Only one actual optional outing approach can be retained.');
    for(const [id, effects] of allowedFacts) {
        const [actorId, factKey] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':') + 1)];
        const applied = effects.filter(e => p.completed?.[e.commandId] === 1);
        const actual = actors[actorId]?.facts?.[factKey];
        assert(applied.length ? applied.some(e => e.value === actual) : actual == null, 'A collaboration fact needs its actual command completion.');
    }
    assert((p.facts?.[key('offerHeard')] === true) === (done(state, 'outing_offer') === 1) &&
        actors[visitorId].facts?.[key('willing')] === (done(state, 'outing_decline') ? false : done(state, 'outing_offer') ? true : undefined),
        'Consent comes from the actual disclosed offer and declines reserve no later work.');
    if(choices.length || jobs.length) assert(done(state, 'outing_offer') === 1, 'Hear the actual outing terms before accepting work.');
    for(const route of ['patient', 'quick']) {
        if(done(state, `report_${route}`)) assert(done(state, `outing_${route}`) === 1, 'A received report needs the actual shared outing.');
        if(done(state, `shared_pack_${route}`)) assert(done(state, `report_${route}`) === 1 && p.completed?.['promise.lesson'] === 1,
            'The later kit collaboration needs its actual report and existing practiced lesson.');
    }
    assert(records.every(({actorId, k, r}) => {
        const expected = allowedRecords.get(`${actorId}:${k}`)?.find(entry => p.completed?.[entry.commandId] === 1);
        if(!expected) return false;
        const e = expected.effect;
        return r.stage === e.stage && r.value === e.value && same(r.basis, e.basis) && natural(r.at) && r.at <= state.clock &&
            /^simulation:[1-9][0-9]*$/.test(r.cause || '') && Number(r.cause.slice(11)) <= state.sequence;
    }), 'Retain only the actual observer-addressed collaboration receipt.');
    for(const d of definitions.filter(d => p.completed?.[d.id] === 1)) for(const e of d.effects.filter(e => e.type === 'knowledge')) {
        // The two branch-specific reports share the one last received key.
        assert(s.knowledge?.[e.actor]?.[e.key], 'A completed interaction must retain its addressed report.');
    }
    assert(worlds.every(e => e.worldId === I.world && e.k === key('crossingWedge') && e.value === true) &&
        (state.worlds?.[I.world]?.facts?.[key('crossingWedge')] === true) === (done(state, 'outing_patient') === 1),
        'The retained crossing stop wedge needs the actually completed, wood-funded patient check.');
    assert(jobs.length <= 1, 'Only one shared Tamsin job can occupy these participants.');
    for(const job of jobs) {
        const d = crushSocialCommand(job.commandId);
        assert(d?.duration > 0 && job.revision === d.revision && job.actorId === 'player' && job.targetId === visitorId &&
            job.cancellation === 'refund' && job.reservationReturns === 1 && same(job.costs, d.costs) && same(job.effects, d.effects) &&
            same(job.participants, ['player', visitorId]) && job.siteId === null && job.claim === null && job.roll === null && job.outcomeId === null &&
            same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: true, location: 'Village', failure: 'refund'}) &&
            !p.completed?.[d.id] && natural(job.due) && job.due >= state.clock && job.due <= state.clock + d.duration,
            'Shared outing work must retain its exact actual refundable costs, participants and completion support.');
        if(registry) assert(same(registry.simulation?.commands?.get(d.id), d), 'Unsupported Tamsin command revision.');
    }
}
