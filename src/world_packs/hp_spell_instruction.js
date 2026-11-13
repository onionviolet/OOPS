// FG6 / PC95. Written forms and trial reports use the existing knowledge
// owner. Each use compiles fresh role bindings into the shared spell law.
import {applyEngineOps, startEngineWorking} from '../engine_world.js';
import {KNOWLEDGE_KINDS, recordsOf} from '../knowledge_record.js';
import {sentenceFromIntent} from '../spell_effects.js';
import {labelSpellRow} from '../spell_grammar.js';
import {spellEffectMethod} from '../spell_law.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../spell_pack_hogwarts.js';

const form = 'hp.summoning.v1';
const row = HP_SPELL_ROWS.find(row => row.id === 'summoning');
const sentence = sentenceFromIntent(labelSpellRow(row, HP_SPELL_WORLD).parts);
const trialKey = id => `trial:${id.replaceAll(':', '::').replaceAll('/', ':s')}`;

function publish(engine, actor, kind, knowledge) {
    return applyEngineOps(engine, [{op: 'publish', kind, place: engine.world.holders[actor].place, by: actor,
        detail: {knowledge}}], 'hp-spell-instruction');
}

function beginForm(engine, actor, {id, wand, target}) {
    const body = engine.world.holders[actor];
    if (body?.kind !== 'body' || !body.place) throw Error('The caster is unavailable.');
    const working = spellEffectMethod([{
        sentence, target: {id: target}, grip: {caster: actor, implement: wand},
        requiresSpeech: true, minutes: 1, contact: {links: 1, kinds: ['sightline']},
        details: {cost: 2},
    }], {id: form});
    return startEngineWorking(engine, {...working, id, payer: actor});
}

// The instructor already knows the form. A witnessed trial supplies the
// qualification to write it up for instruction.
export function demonstrateSummoning(engine, actor, bindings) {
    if (engine.world.holders[actor]?.properties.summoning_instructor !== true)
        throw Error('The caster needs the instructor’s training.');
    return beginForm(engine, actor, bindings);
}

export function repeatSummoning(engine, actor, bindings) {
    const record = recordsOf(engine.world, actor)[form];
    if (record?.subject.kind !== 'composition' || record.subject.id !== form || record.believed.fillers?.method !== form)
        throw Error('Study the written form before trying it.');
    return beginForm(engine, actor, bindings);
}

export function recordSummoningTrial(engine, actor, id) {
    const entry = engine.records.workings[id];
    const receipt = entry?.record.receipts[0];
    const impact = entry?.landed[0];
    if (entry?.payer !== actor || entry?.record.method.id !== form || entry.record.status !== 'complete' ||
        !receipt?.ok || receipt.truth.paid?.status !== 'paid' || !impact)
        throw Error('A settled and paid attempt is required.');
    const observed = impact.status === 'landed' ? 'worked' : 'failed';
    const witness = trialKey(id);
    engine = publish(engine, actor, KNOWLEDGE_KINDS.learn, {to: actor, record: {
        id: witness, subject: {kind: 'composition', id: form},
        true: {fillers: {method: form, target: receipt.bindings.target, outcome: observed}},
        source: {kind: 'observation', by: actor, at: impact.at},
    }});
    if (observed !== 'worked' || engine.world.holders[actor].properties.summoning_instructor !== true) return engine;
    return publish(engine, actor, KNOWLEDGE_KINDS.learn, {to: actor, record: {
        id: form, subject: {kind: 'composition', id: form}, true: {fillers: {method: form}},
        source: {kind: 'observation', by: actor, from: witness, at: impact.at},
    }});
}

export function retrySummoning(engine, actor, {from, id, wand}) {
    const report = recordsOf(engine.world, actor)[trialKey(from)];
    const trial = report?.believed.fillers;
    if (report?.source.by !== actor || trial?.method !== form || trial.outcome !== 'failed')
        throw Error('Recall a failed trial of this form before repeating its target.');
    return repeatSummoning(engine, actor, {id, wand, target: trial.target});
}

export function teachSummoning(engine, teacher, student) {
    const {world} = engine;
    const from = world.holders[teacher], to = world.holders[student];
    if (teacher === student || from?.kind !== 'body' || to?.kind !== 'body' || !from.place || from.place !== to.place ||
        !recordsOf(world, teacher)[form]) throw Error('Read the written form with its teacher.');
    return publish(engine, teacher, KNOWLEDGE_KINDS.teach, {to: student, from: teacher, record: form});
}
