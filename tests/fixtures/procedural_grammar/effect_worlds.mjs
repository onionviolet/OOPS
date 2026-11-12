// Compatibility exports for the world grammars. GL2 and move-role proofs live here.
import fs from 'node:fs';
import {guEffects, labelGuEffect} from '../../../src/world_packs/gu_effect_pack.js';
export {guEffects, labelGuEffect, compareGuEffect, guEffectRows, guCanonAmounts, GU_FORBID} from '../../../src/world_packs/gu_effect_pack.js';

// ---------- Hogwarts (spellbook research records) ----------
// The grammar, labeller, family check and world law live in the world pack (PC6);
// re-exported so existing callers keep their import. The row reader stays here
// because it reads a research file from disk.
export {hpEffects, labelHpEffect, compareHpEffect, HP_FORBID, hpEffectsGl2, labelHpEffectGl2} from '../../../src/world_packs/hp_effect_pack.js';
// Rows from the spellbook tables under the six family headings.
export function hpEffectRows(path = new URL('../../../docs/research/HOGWARTS_SPELLBOOK_2026-11-11.md', import.meta.url)) {
    const rows = [];
    let family = null;
    for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
        const heading = /^### (.+)$/.exec(line);
        if (heading) { family = /ACT NOW|ACCOUNT|LATER/.test(heading[1]) ? null : heading[1].trim(); continue; }
        const m = /^\| `([^`]+)` \| ([^|]+) \| ([^|]+) \|/.exec(line);
        if (family && m) rows.push({id: `hp:${m[1]}`, family, names: m[2].trim(), lead: m[3].trim()});
    }
    return rows;
}

// ---------- World words, prices and laws for the five checks ----------
// A world can explain a part only if it has a word for it. Default words
// cover what that world's canon uses (so an exotic part fails "explains"
// until the naming owner adds a word); each world overrides a few.
const SHARED_WORDS = {
    verb: {move: 'moves', add: 'adds', remove: 'takes away', transform: 'changes', bind: 'holds fast', release: 'frees', sense: 'perceives',
        conceal: 'hides', copy: 'records', block: 'wards off', end: 'ends', alter: 'reshapes'},
    object: {vitality: 'life', heat: 'heat', light: 'light', sound: 'sound', essence: 'essence', force: 'strength', moisture: 'water', lifespan: 'years',
        position: 'place', form: 'shape', mind: 'mind', information: 'what is hidden', memory: 'memory', relation: 'a bond', thing: 'a thing',
        working: 'a working', law: 'a law of the place', time: 'time'},
    target: {self: 'of the user', touched: 'of what is touched', bound: 'of a chosen target', line: 'along a line', cone: 'in a cone', area: 'around',
        marked: 'of all that bears the mark'},
    time: {instant: 'at once', sustained: 'while fed', lasting: 'for good', delayed: 'after a while', triggered: 'when set off'},
    carrier: {gu: 'by a Gu', 'spoken-spell': 'by a spoken spell', ward: 'by a ward'},
    cost: {'essence-primeval': 'on primeval essence', 'essence-immortal': 'on immortal essence', mental: 'on mental energy', stamina: 'on the caster\'s strength'},
};
export function worldWords(canonParts, overrides = {}) {
    const words = {};
    for (const slot of Object.keys(SHARED_WORDS)) {
        const used = new Set(canonParts.map(p => p[slot]));
        words[slot] = Object.fromEntries(Object.entries(SHARED_WORDS[slot]).filter(([v]) => used.has(v)));
        Object.assign(words[slot], overrides[slot] ?? {});
    }
    return words;
}
// ---------- GL2: the effect predicted from identity ----------
// The identity layer goes first and the effect slots are conditioned on it,
// so holding out the effect and predicting it reads identity through the fit.
// Gu identity: wiki type and path labels (authored apart from G's function
// families). Hogwarts identity: chat S's family heading.
import {defineGrammar as defineG} from '../../../src/procedural_grammar.js';
export const GU_GL2_FIELDS = ['verb', 'object', 'target', 'time'];
const guGl2Spec = guEffects.spec;
export const guEffectsGl2Baseline = defineG({
    ...guGl2Spec, id: 'effect.gu.gl2',
    slots: [
        {id: 'type', type: 'set', open: true, min: 0},
        {id: 'gpath', type: 'set', open: true, min: 0},
        ...guGl2Spec.slots.filter(s => GU_GL2_FIELDS.includes(s.id))
            .map(s => s.id === 'verb' ? {...s, given: ['type', 'gpath']} : s),
    ],
    rules: guGl2Spec.rules.filter(r => r.reads.every(id => GU_GL2_FIELDS.includes(id))),
    fallback: {id: 'effect.gu.gl2.fallback', parts: Object.fromEntries(
        GU_GL2_FIELDS.map(id => [id, guGl2Spec.fallback.parts[id]]))},
});
// Wiki type distinguishes affected properties within a verb. Path can
// distinguish how long the same verb operates. Both back off through GL5.
const guGl2Given = {object: ['verb', 'type'], time: ['verb', 'gpath']};
export const guEffectsGl2 = defineG({
    ...guEffectsGl2Baseline.spec, revision: 2,
    slots: guEffectsGl2Baseline.spec.slots.map(s => guGl2Given[s.id] ? {...s, given: guGl2Given[s.id]} : s),
});
// G's catalogue keeps chapter-stated path separate from the wiki review index.
// Retain raw categories and empty sets when neither source supplies a value.
export function guGl2Identity(row) {
    const p = row.parts?.value;
    return {type: [...(p?.wiki?.type ?? [])], gpath: p?.path ? [p.path] : [...(p?.wiki?.path ?? [])]};
}
export function labelGuEffectGl2(row) {
    const out = labelGuEffect(row);
    if (!out.parts) return out;
    const {verb, object, target, time} = out.parts;
    return {parts: {...guGl2Identity(row), verb, object, target, time}};
}

// ---------- GL6 proof: killer moves as nested roles ----------
// Each canon move record lists roles, each filled by a Gu kind. The move is a
// thing whose `roles` slot holds child things (role id, kind). GL3's canon
// test (rebuild through K's composed working) builds on this shape.
export const guMoveRole = defineG({
    id: 'proof.gu-move-role', revision: 1,
    slots: [{id: 'role', type: 'one', open: true}, {id: 'kind', type: 'one', open: true, min: 0}],
    rules: [
        {id: 'participant-named', kind: 'check', severity: 'flag', default: 'A role may leave its Gu unnamed when the source does; flagged.',
            reason: 'Records keep unspecified participants as a role with a count or band, not an invented kind.',
            run: ({parts}) => parts.kind ? null : {reason: 'participant unnamed in the source'}},
        {id: 'kind-catalogued', kind: 'check', severity: 'flag', default: 'A named role is filled by a catalogued kind; an uncatalogued one is flagged.',
            reason: 'A move can only run through kinds the catalogue gives a working (PFP16).',
            run: ({parts, dials}) => parts.kind && dials.catalogue && !dials.catalogue.includes(parts.kind) ? {reason: `${parts.kind} has no catalogue row`} : null}],
    fallback: {id: 'proof.gu-move-role.fallback', parts: {role: 'core', kind: 'moonlight'}},
});
export function guMoveGrammar(catalogue) {
    const role = defineG({...guMoveRole.spec, dials: {catalogue}});
    return defineG({
        id: 'proof.gu-move', revision: 1,
        slots: [{id: 'roles', type: 'parts', grammar: role, min: 1}],
        rules: [{id: 'two-or-more', kind: 'check', severity: 'flag', default: 'A killer move combines two or more Gu.',
            reason: 'A single Gu activation is an ability, not a move; flagged, since a lone-core move may exist.',
            run: ({parts}) => parts.roles.length < 2 ? {reason: 'one role'} : null}],
        fallback: {id: 'proof.gu-move.fallback', parts: {roles: [{role: 'core', kind: 'moonlight'}, {role: 'support', kind: 'little-light'}]}},
    });
}
export function guMoveRows(file = new URL('../../../docs/research/gu-identity-evidence.json', import.meta.url)) {
    return JSON.parse(fs.readFileSync(file, 'utf8')).moves.map(m => ({id: `move:${m.id}`, parts: {roles: m.roles.map(r => ({role: r.id, kind: r.kind}))}}));
}
