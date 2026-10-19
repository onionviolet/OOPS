// Technique knowledge and ownership are saved independently of derived execution
// requirements. This is a narrow learning handler, not a general spell engine.
import {check, natural as integer} from './basics.js';
const object = v => v && typeof v === "object" && !Array.isArray(v);
const id = v => typeof v === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !["__proto__", "constructor", "prototype"].includes(v);
export const PRACTICE_RESPONSES = Object.freeze({hold: "Hold your ground", sidestep: "Step aside", advance: "Advance"});
const freshRecord = () => ({observed: null, understood: null, owned: null, proficiency: 0, executions: 0, practice: null, lastPractice: null});

export function validateTechniqueDefinitions(registry) {
    for(const definition of registry.techniques.values()) {
        check(id(definition.worldId) && registry.worlds.has(definition.worldId) && id(definition.id) &&
            integer(definition.revision) && definition.revision > 0 && typeof definition.label === "string" &&
            typeof definition.enemyId === "string" && integer(definition.readyAt) && definition.readyAt > 0 &&
            integer(definition.maxProficiency) && definition.maxProficiency >= definition.readyAt &&
            Number.isFinite(definition.minAgility) && definition.minAgility >= 0 && object(definition.patterns), "Invalid technique definition.");
        for(const [patternId, cues] of Object.entries(definition.patterns)) {
            check(id(patternId), "Invalid practice pattern."); validateCues(cues);
        }
    }
}

function validateCues(cues) {
    check(Array.isArray(cues) && cues.length === 3, "Practice needs three saved cues.");
    for(const cue of cues) check(object(cue) && id(cue.id) && typeof cue.label === "string" &&
        Object.hasOwn(PRACTICE_RESPONSES, cue.response), "Invalid saved practice cue.");
}

export function validateTechniqueEffect(effect, registry) {
    check(id(effect.techniqueId) && ["observe", "understand", "own", "practice", "beginPractice", "execute"].includes(effect.operation), "Invalid technique effect.");
    if(effect.revision != null) check(integer(effect.revision) && effect.revision > 0, "Invalid technique revision.");
    if(effect.cap != null) check(integer(effect.cap) && effect.cap > 0, "Invalid proficiency cap.");
    if(effect.readyAt != null) check(integer(effect.readyAt) && effect.readyAt > 0, "Invalid execution proficiency.");
    const definition = registry?.techniques.get(effect.techniqueId);
    if(registry) check(definition, "Unknown technique.");
    if(effect.operation === "observe") check(typeof effect.enemyId === "string" &&
        ["field-observation", "native-victory"].includes(effect.route) && (!definition || definition.enemyId === effect.enemyId), "Invalid observation provenance.");
    if(effect.operation === "practice") check(integer(effect.amount) && effect.amount > 0, "Invalid practice award.");
    if(effect.operation === "beginPractice") check(id(effect.patternId) && (!definition || Object.hasOwn(definition.patterns, effect.patternId)), "Unknown practice pattern.");
}

export function validateTechniqueRecords(records, clock, registry) {
    check(object(records), "Invalid saved techniques.");
    let busy = 0;
    for(const [techniqueId, record] of Object.entries(records)) {
        check(id(techniqueId) && object(record) && integer(record.proficiency) && integer(record.executions), "Invalid technique progress.");
        if(registry) check(registry.techniques.has(techniqueId), "Unsupported saved technique.");
        for(const key of ["observed", "understood", "owned"]) if(record[key] != null) {
            const evidence = record[key];
            check(object(evidence) && integer(evidence.at) && evidence.at <= clock && id(evidence.receiptId) &&
                id(evidence.worldId) && integer(evidence.revision) && evidence.revision > 0, "Invalid technique evidence.");
            if(registry) check(registry.worlds.has(evidence.worldId), "Unsupported technique acquisition world.");
            if(key === "observed") check(typeof evidence.enemyId === "string" &&
                ["field-observation", "native-victory"].includes(evidence.route) &&
                (!registry || registry.techniques.get(techniqueId).enemyId === evidence.enemyId), "Invalid enemy evidence.");
        }
        check(!record.understood || record.observed, "Understanding needs observation evidence.");
        check(!record.owned || record.understood, "Owned technique needs understanding.");
        check(!record.proficiency || record.understood, "Practice needs understanding.");
        check(!record.executions || record.owned, "Execution needs ownership.");
        if(record.practice != null) {
            busy++;
            const p = record.practice;
            check(record.understood && object(p) && id(p.id) && id(p.patternId) && integer(p.revision) && p.revision > 0 &&
                Number.isFinite(p.draw) && p.draw >= 0 && p.draw < 1 && integer(p.at) && p.at <= clock &&
                Array.isArray(p.answers) && p.answers.length < 3 && p.answers.every(answer => Object.hasOwn(PRACTICE_RESPONSES, answer)), "Invalid saved practice.");
            validateCues(p.cues);
            check(Array.isArray(p.rewards) && p.rewards.length === 4 && p.rewards.every(v => integer(v) && v > 0) &&
                integer(p.cap) && p.cap >= record.proficiency && integer(p.xpPerPoint) && p.xpPerPoint > 0 &&
                typeof p.xpSkill === "string", "Invalid frozen practice rewards.");
        }
        if(record.lastPractice != null) {
            const p = record.lastPractice;
            check(object(p) && id(p.receiptId) && integer(p.at) && p.at <= clock && integer(p.gain) &&
                integer(p.score) && p.score <= 3 && ["active", "idle"].includes(p.mode), "Invalid practice receipt.");
        }
    }
    check(busy <= 1, "Actor has overlapping technique practice.");
}

export function activePractice(actor) {
    return Object.entries(actor.techniques || {}).find(([, record]) => record.practice) || null;
}

export function techniqueFacts(actor, registry, context) {
    const facts = {};
    for(const definition of registry.techniques.values()) {
        const record = actor.techniques?.[definition.id] || freshRecord(), prefix = `technique.${definition.id}`;
        facts[`${prefix}.observed`] = !!record.observed;
        facts[`${prefix}.understood`] = !!record.understood;
        facts[`${prefix}.owned`] = !!record.owned;
        facts[`${prefix}.proficiency`] = record.proficiency;
        facts[`${prefix}.executable`] = !!record.owned && !!record.understood && record.proficiency >= definition.readyAt &&
            actor.worldId === definition.worldId && (context.facts?.agility || 0) >= definition.minAgility;
    }
    return facts;
}

export function applyTechniqueEffect(actor, effect, {registry, clock, worldId, receiptId, draw = 0}) {
    validateTechniqueEffect(effect, registry);
    const definition = registry.techniques.get(effect.techniqueId);
    const records = actor.techniques ||= {}, record = records[effect.techniqueId] ||= freshRecord();
    const evidence = () => ({at: clock, worldId, receiptId, revision: effect.revision ?? definition.revision});
    if(effect.operation === "observe") {
        record.observed ||= {...evidence(), enemyId: effect.enemyId, route: effect.route};
    } else if(effect.operation === "understand") {
        check(record.observed, "Observe the technique before studying it."); record.understood ||= evidence();
    } else if(effect.operation === "own") {
        check(record.understood && record.proficiency >= 2, "Understand and practice before internalizing the technique."); record.owned ||= evidence();
    } else if(effect.operation === "practice") {
        check(record.understood && !activePractice(actor), "Study first and finish any active drill.");
        const gain = Math.min(effect.amount, Math.max(0, (effect.cap ?? definition.maxProficiency) - record.proficiency));
        record.proficiency += gain;
        record.lastPractice = {receiptId, at: clock, gain, score: 0, mode: "idle"};
    } else if(effect.operation === "beginPractice") {
        check(record.understood && !activePractice(actor) && record.proficiency < definition.maxProficiency, "Study first or finish your current drill.");
        record.practice = {id: receiptId, at: clock, patternId: effect.patternId, revision: definition.revision, draw,
            cues: structuredClone(definition.patterns[effect.patternId]), answers: [], rewards: [1, 1, 2, 3],
            cap: definition.maxProficiency, xpSkill: "Equilibrium", xpPerPoint: 10};
    } else {
        check(record.owned && record.proficiency >= (effect.readyAt ?? definition.readyAt), "Technique cannot be executed yet.");
        check(Number.isSafeInteger(record.executions + 1), "Technique execution overflow."); record.executions++;
    }
}

// Responses are persisted one at a time. The frozen cues/rewards survive balance
// edits, reload and cancellation. Completion is removed before any reward repeats.
export function answerTechniquePractice(state, actorId, practiceId, response, expectedSequence) {
    check(state.sequence === expectedSequence, "This practice response is stale.");
    check(Object.hasOwn(PRACTICE_RESPONSES, response), "Unknown practice response.");
    const next = structuredClone(state), actor = next.actors[actorId], active = actor && activePractice(actor);
    check(active && active[1].practice.id === practiceId, "This practice has already ended.");
    const [techniqueId, record] = active, practice = record.practice;
    practice.answers.push(response); next.sequence++;
    let reward = null;
    const correct = response === practice.cues[practice.answers.length - 1].response;
    if(practice.answers.length === practice.cues.length) {
        const score = practice.answers.filter((answer, i) => answer === practice.cues[i].response).length;
        const gain = Math.min(practice.rewards[score], practice.cap - record.proficiency);
        record.proficiency += gain;
        const receiptId = `practice:${next.sequence}`;
        record.lastPractice = {receiptId, at: next.clock, gain, score, mode: "active"};
        record.practice = null;
        next.history.push({id: receiptId, sequence: next.sequence, at: next.clock, actorId,
            actionId: "frontier.rat_step.active", revision: practice.revision, outcome: "practiced", draw: practice.draw,
            label: `Rat-step practice: ${score}/3 correct; +${gain} proficiency`, practiceId, techniqueId,
            patternId: practice.patternId, answers: [...practice.answers]});
        next.history = next.history.slice(-100);
        reward = gain ? {type: "xp", skill: practice.xpSkill, amount: gain * practice.xpPerPoint} : null;
    }
    return {state: next, reward, correct};
}

export function cancelTechniquePractice(state, actorId, practiceId, expectedSequence) {
    check(state.sequence === expectedSequence, "This cancellation is stale.");
    const next = structuredClone(state), active = activePractice(next.actors[actorId]);
    check(active && active[1].practice.id === practiceId, "This practice has already ended.");
    const p = active[1].practice; active[1].practice = null;
    next.history.push({id: `cancel:${++next.sequence}`, sequence: next.sequence, at: next.clock, actorId,
        actionId: "frontier.rat_step.active", outcome: "cancelled", draw: p.draw,
        label: "Active practice cancelled; fee forfeited and no proficiency awarded"});
    next.history = next.history.slice(-100);
    return next;
}

// Native combat is not a saved donor actor. Victory provides learning evidence;
// it never transfers ownership from or weakens the respawned enemy template.
export function observeNativeTechnique(state, registry, actorId, enemyId) {
    const definitions = [...registry.techniques.values()].filter(t => t.enemyId === enemyId && t.worldId === state.actors[actorId].worldId &&
        !state.actors[actorId].techniques[t.id]?.observed);
    if(!definitions.length) return null;
    const next = structuredClone(state), actor = next.actors[actorId], sequence = ++next.sequence;
    for(const t of definitions) applyTechniqueEffect(actor, {type: "technique", techniqueId: t.id, operation: "observe", enemyId,
        route: "native-victory", revision: t.revision}, {registry, clock: next.clock, worldId: actor.worldId, receiptId: `enemy:${sequence}`});
    next.history.push({id: `enemy:${sequence}`, sequence, at: next.clock, actorId, actionId: "native.enemy_observation", outcome: "observed", draw: 0,
        label: `${enemyId}: technique observed after victory`});
    next.history = next.history.slice(-100);
    return next;
}
