#!/usr/bin/env node
// LOTM natural mains (PWC21d, 2026-11-17, proposal). A second rule beside lotm.rule.characteristic-replaces-main: the table says mains
// are creature organs, blood or crystals (PATHWAY_POTION_TABLE.md 0.1, "Ingredient class"), so a Sequence's natural main is a creature part of
// ITS pathway's themed creatures, one Sequence offset from the row's own. Two parts, both frozen before they were scored:
//   N1 class: the class of the stated main (characteristic, blood, organ, crystal, exterior, plant) is predicted from the Sequence band
//      (9-7, 6-5, 4-1) as the modal class of the TRAINING rows in that band (sha1(id)[0] >= 0x33, GKM429); the baseline is the
//      training majority class overall.
//   N2 creature: a main that is a characteristic keeps the identity prediction (pathway P, Sequence S); a creature part is predicted as
//      pathway P at Sequence S + d, d the modal (label Sequence - row Sequence) over TRAINING creature-part labels; plant and mineral
//      mains get no prediction (counted wrong, so the marks are comparable with the identity score in docs/coverage/lotm_derived_score.json).
// Labels are the same private Luna recall labels the identity score used (derive_lotm_mains_luna.json). Scored apart for the held-out split.
//   node scripts/derive_lotm_natural_mains.mjs [--out docs/coverage/lotm_derived_score.json]
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {statedMains, LABEL_FILE, heldOut} from './derive_lotm_formulas.mjs';
import {LOTM_PATHWAYS} from '../src/lotm_derived_formulas.js';

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
export const classOf = name => /characteristic|uniqueness/i.test(name) ? 'characteristic'
    : /blood/i.test(name) ? 'blood'
    : /crystal|core\b|dust|stone|rock|\bsoul\b|consciousness/i.test(name) ? 'crystal'
    : /brain|heart|eye|pituitary|stomach|liver|bladder|marrow|gland|spinal|fluid|palm|skull|scalp|intestine|pouch/i.test(name) ? 'organ'
    : /horn|feather|silk|skin|scale|crown|shell|tail|fang|claw|hide|bone|egg/i.test(name) ? 'exterior'
    : /grass|flower|root|tree|fruit|rhizome|sunflower|rose|cannabis|plant|leaf|mushroom|herb/i.test(name) ? 'plant' : 'other';
const band = seq => (seq >= 7 ? '9-7' : seq >= 5 ? '6-5' : '4-1');
const mode = xs => { const c = {}; for (const x of xs) c[x] = (c[x] ?? 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0]?.[0]; };

export async function scoreNatural() {
    const raw = JSON.parse(readFileSync(LABEL_FILE, 'utf8'));
    const items = (await statedMains()).map(it => {
        const m = /^lotm\.potion\.(.+)_(\d)$/.exec(it.rowId), pathway = LOTM_PATHWAYS.find(p => slug(p) === m[1]);
        return {...it, seq: Number(m[2]), pathway, cls: classOf(it.main), held: heldOut(it.rowId), label: raw[it.main]?.reply};
    }).filter(it => it.seq !== 0 && it.label);
    const train = items.filter(i => !i.held);
    const bandClass = Object.fromEntries(['9-7', '6-5', '4-1'].map(b => [b, mode(train.filter(i => band(i.seq) === b).map(i => i.cls))]));
    const majority = mode(train.map(i => i.cls));
    const det = i => !(i.label.pathway === 'unknown' || i.label.pathway === 'none' || i.label.sequence < 0);
    const partOffsets = train.filter(i => det(i) && ['blood', 'organ', 'crystal', 'exterior'].includes(i.cls)).map(i => i.label.sequence - i.seq);
    const d = Number(mode(partOffsets) ?? 0);
    const predict = i => i.cls === 'characteristic' ? {pathway: i.pathway, sequence: i.seq}
        : ['blood', 'organ', 'crystal', 'exterior'].includes(i.cls) ? {pathway: i.pathway, sequence: Math.min(9, Math.max(1, i.seq + d))} : null;
    const run = rows => {
        const dets = rows.filter(det), hit = (i, k) => { const p = predict(i); return p && p[k] === i.label[k]; };
        const identity = i => (i.label.pathway === i.pathway ? 1 : 0);
        return {items: rows.length, determinable: dets.length,
            classRule: {right: rows.filter(i => i.cls === bandClass[band(i.seq)]).length, baseline: rows.filter(i => i.cls === majority).length},
            bothAxes: dets.filter(i => hit(i, 'pathway') && hit(i, 'sequence')).length, pathway: dets.filter(i => hit(i, 'pathway')).length,
            sequence: dets.filter(i => hit(i, 'sequence')).length,
            identityRule: {bothAxes: dets.filter(i => i.label.pathway === i.pathway && i.label.sequence === i.seq).length, pathway: dets.filter(identity).length}};
    };
    return {rule: 'lotm.rule.natural-main-creature-part', frozen: {offset: d, bandClass, majorityClass: majority, classWords: 'classOf() in this script'},
        marks: {bothAxes: '24% (16 of 68)', pathwayBaseline: '15% (10 of 68)'}, all: run(items), heldOut: run(items.filter(i => i.held)),
        classes: Object.fromEntries(Object.entries(items.reduce((a, i) => ({...a, [i.cls]: (a[i.cls] ?? 0) + 1}), {})))};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const s = await scoreNatural();
    console.log(JSON.stringify(s, null, 1));
    const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
    if (out) { const cur = JSON.parse(readFileSync(out, 'utf8')); cur.naturalMains = {...s, date: '2026-11-17'}; writeFileSync(out, JSON.stringify(cur, null, 2) + '\n'); }
}
