// The chapter tier for effect-unknown rows (PWC27, 2026-11-17; proposals): a row the ledger blocks as `effect-unknown` that a chapter
// shows doing something gains that effect sentence. It becomes `catalogued` when the sentence alone runs it, or `blocked:<slug>` when
// the sentence needs a capability, and keeps its former state in the note. The reader names a capability from one shared list; each
// ledger has its own blocker vocabulary (PWC5), so the capability maps to the nearest slug the ledger already defines and the note
// keeps the reader's word. Reads docs/coverage/chapter_tier_labels.json (section effect_unknown, from scripts/chapter_effect_labels.mjs).
// Every ledger builder calls foldChapterEffect on its rows, so a rebuild keeps the fold.
// For Gu, a second-read sentence can also replace a wiki-family classification with no executed case.
import {readFileSync, existsSync} from 'node:fs';

const cov = new URL('../docs/coverage/', import.meta.url);
const json = name => JSON.parse(readFileSync(new URL(name, cov), 'utf8'));
let cache = null;
const section = () => (cache ??= (() => { try { return json('chapter_tier_labels.json').effect_unknown?.ledgers ?? {}; } catch { return {}; } })());

// Preferred ledger slugs for each reader capability, nearest first. A slug the ledger does not define is skipped.
export const NEAREST = {
    'mind-state': ['mind-state', 'mind-binding', 'mind-ennoblement'], 'body-form': ['body-form', 'form-transformation', 'body-conditioning-rank'],
    divination: ['divination', 'divination-fate', 'precognition', 'future-vision'], precognition: ['precognition', 'divination-fate', 'divination', 'future-vision'],
    'time-manipulation': ['time-manipulation', 'time-stop', 'time-loop'], 'death-checkpoint-rewind': ['death-checkpoint-rewind', 'revival-on-death', 'time-loop', 'time-manipulation'],
    'creature-control': ['creature-control', 'familiar-summon', 'mind-binding'], 'protection-field': ['protection-field', 'area-field'], 'formation-field': ['formation-field', 'area-field'],
    'area-field': ['area-field'], 'item-state': ['item-state', 'item-bound-power'], 'portal-space': ['portal-space', 'dimension-travel', 'world-travel'],
    'spatial-storage': ['spatial-storage', 'item-bound-power'], 'power-interaction': ['power-interaction'], 'containment-rule': ['containment-rule', 'vow-cost', 'item-bound-power'],
    'form-transformation': ['form-transformation', 'body-form'], 'conceal-or-sense': ['conceal-or-sense'], 'mind-binding': ['mind-binding'],
    'tinker-device': ['tinker-device', 'blueprint-craft', 'item-bound-power'], 'soul-binding': ['soul-binding', 'soul-state'], 'familiar-summon': ['familiar-summon', 'creature-control'],
    'power-transfer': ['power-transfer'],
};
const ARTIFACT = ['area-field', 'power-interaction', 'mind-binding', 'form-transformation', 'familiar-summon', 'power-transfer', 'containment-rule', 'negative-effect-drift',
    'soul-binding', 'item-state', 'divination', 'spatial-storage', 'material-row', 'formation-field', 'time-stop'];
const WORM = ['mind-state', 'body-form', 'conceal-or-sense', 'protection-field', 'mind-binding', 'creature-control', 'area-field', 'power-interaction', 'precognition',
    'time-manipulation', 'portal-space', 'power-granting', 'tinker-device', 'projection-body', 'timeline-split'];
const known = {};
function slugsOf(ledger) {
    if (ledger in known) return known[ledger];
    let s = null;
    if (['hp_objects', 'lotm_artifacts', 'ri_treasures'].includes(ledger)) s = ARTIFACT;
    else if (ledger === 'worm_powers') s = WORM;
    else if (ledger === 'rezero_powers') s = Object.keys(json('rezero_power_labels.json').capabilities ?? {});
    else if (ledger === 'gu_kinds') s = null; // the Gu ledger's rules are free slugs
    else {
        const f = `${ledger.replace(/_powers$/, '')}_power_labels.json`;
        if (existsSync(new URL(f, cov))) s = Object.keys(json(f).meta?.slugs ?? {});
        else if (existsSync(new URL(`${ledger}_sheet.json`, cov))) {
            s = [...new Set(json(`${ledger}_sheet.json`).map(r => r.blocking?.slug).filter(x => x && x !== 'none'))];
        }
    }
    return (known[ledger] = s?.filter(x => x !== 'effect-unknown') ?? null);
}
export function slugFor(ledger, cap) {
    const s = slugsOf(ledger);
    if (!s) return cap;
    return (NEAREST[cap] ?? [cap]).find(x => s.includes(x)) ?? (s.includes('power-interaction') ? 'power-interaction' : cap);
}

export const chapterEffect = (ledger, id) => section()[ledger]?.[id]?.effect ?? null;

export function foldChapterEffect(ledger, row) {
    const e = section()[ledger]?.[row.id];
    if (!e?.effect) return row;
    const fromFamily = ledger === 'gu_kinds' && e.secondRead === 'agree' && !row.case
        && (row.state.startsWith('runs-') || (row.state === 'catalogued' && row.typed));
    if (row.state !== 'blocked:effect-unknown' && !fromFamily) return row;
    const {verb, object, target, time, at, speaker} = e.effect;
    const runs = e.blocked === 'none', slug = runs ? null : slugFor(ledger, e.blocked);
    const sentence = `effect ${verb}.${object}/${target}/${time} at ${at} (${speaker})`;
    const tail = runs ? '; the sentence alone runs it' : `; needs ${e.blocked}${slug === e.blocked ? '' : `, held under the ledger's ${slug}`}`;
    const tier = e.secondRead === 'agree' ? 'PWC27, chapter passage checked by a second reader' : 'PWC27, Luna over chapter text, unchecked';
    const review = e.secondRead === 'agree' ? '' : e.second === 'confirmed' ? ' Second reader (Haiku 5.5) states the same verb and object: confirmed.' : e.second ? ' Second reader (Haiku 5.5) differs or finds nothing: review-only.' : ' One reader only.';
    const reason = e.blockedReason ? ` Missing rule: ${e.blockedReason}.` : '';
    const former = fromFamily ? 'catalogued' : row.state;
    const note = `${(row.note ?? '').trim()} Chapter tier (${tier}): ${sentence}${tail}.${review ? ` ${review}` : ''} Former state: ${former}.${runs ? '' : ` Missing: ${slug}.`}${reason}`.trim();
    if (!fromFamily) return {...row, state: runs ? 'catalogued' : `blocked:${slug}`, note};
    const {typed, ...withoutFamilyState} = row;
    return {...withoutFamilyState, state: runs ? 'catalogued' : `blocked:${slug}`, mechanisms: ['G'], note};
}
