// Glue from a public scene to memory (LSD366-LSD369): the crowd leaves one group impression and the promoted
// witness keeps an episode of seeing the subject. Derived crowd, saved memory only. World-neutral.
import {generateCrowd, stepCrowd, chooseWitness, parsePerson, nameSeed} from './crowd.js';
import {remember, mergeImpression, readMemories} from './person_memory.js';
import {MEMORY_LIMITS} from './person_temperament.js';

export const groupHolder = place => `crowd.group.${place}`;
// scene {place, severity, scale}; returns the new memory and who was promoted. Idempotent per fact.
export function witnessScene({memory, scene, subject, fact, feeling, minute, day, root, namedHere = 0, limits = MEMORY_LIMITS}) {
    const crowd = generateCrowd({place: scene.place, minute, root, scale: scene.scale ?? 1, exclude: {worker: namedHere}});
    if (!crowd.size) return {memory, crowd, witness: null};
    const step = stepCrowd({crowd, severity: scene.severity ?? 0, step: 0, root});
    const witness = chooseWitness({crowd, step, reason: 'sees_face', root});
    if (!witness) return {memory, crowd, witness: null};
    // The same scene is never written twice (a replayed boundary, a reload).
    if (!readMemories(memory, witness.id, day, {limits}).some(e => e.fact === fact))
        memory = remember(memory, witness.id, {kind: 'witnessed', about: subject, fact, source: 'saw', certainty: 70, feeling: Math.sign(feeling) * Math.min(100, Math.abs(feeling)), day, count: 1}, day, limits);
    const watchers = Math.max(1, step.totals.watch + step.totals.freeze);
    const seen = readMemories(memory, groupHolder(scene.place), day, {limits}).find(e => e.kind === 'impression' && e.about === subject);
    if (!seen || seen.day !== day || !seen.count) memory = mergeImpression(memory, groupHolder(scene.place), {kind: 'impression', about: subject, fact: null, source: 'inferred', certainty: 60, feeling: Math.sign(feeling) * Math.min(100, Math.abs(feeling)), day, count: watchers}, day, limits);
    return {memory, crowd, step, witness};
}

// Player-facing read of who remembers: the promoted witnesses of a place and the crowd's impression.
// `nameOf(seed,id)` and `lineOf(holder)` are host ports (a world's name grammar, the reaction line).
export function witnessView({memory, place, subject, day, root, nameOf, lineOf, limits = MEMORY_LIMITS}) {
    const out = [];
    for (const holder of Object.keys(memory?.holders || {}).sort()) {
        const p = parsePerson(holder); if (!p || p.place !== place) continue;
        out.push({id: holder, role: p.role, name: nameOf(nameSeed(root, holder), holder), line: lineOf(holder)});
    }
    const group = readMemories(memory, groupHolder(place), day, {limits}).find(e => e.kind === 'impression' && e.about === subject);
    return {witnesses: out, group: group ? {count: group.count, feeling: group.feeling} : null};
}
