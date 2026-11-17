#!/usr/bin/env node
// LOTM derived formulas (PWC21, proposal): the ledger hook, the rules file writer and the held-out score.
//   node scripts/derive_lotm_formulas.mjs --write-rules    regenerate docs/coverage/lotm_rules.json
//   node scripts/derive_lotm_formulas.mjs --score <labels.json> [--out docs/coverage/lotm_derived_score.json]
// The law lives in src/lotm_derived_formulas.js (pure, so a row can be brewed in a test). This module decides which ledger rows
// take it: only rows still `blocked:formula-in-notes` after the wiki and chapter tiers folded, so a stated formula always wins.
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {LOTM_DERIVE_RULES, derivedSpec, derivedRowId} from '../src/lotm_derived_formulas.js';

export const DERIVED_CASE_MODULE = 'src/world_packs/lotm_derived_cases.js';
export const RULES_FILE = 'docs/coverage/lotm_rules.json';
export const TABLE_DOC = 'docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md';
// GKM429: held out when sha1(id)[0] < 0x33. Frozen with the rule before any score label exists.
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;

/** Rows the law takes: still blocked on the formula, a pathway Sequence the law knows. */
export const takesDerived = row => row.state === 'blocked:formula-in-notes' && row.pathway && Number.isInteger(row.seq);

/** Patch one ledger row into expressed-derived with its case; the runner confirms the state. */
export function applyDerived(row) {
    const spec = derivedSpec(row.pathway, row.seq);
    row.note += ` Derived tier (PWC20, PWC21; not canon): ${spec.slots.filter(s => s.role === 'main').map(s => `${s.qty > 1 ? s.qty + ' x ' : ''}${s.select.material}`).join(' plus ')} as the main, an unnamed lot the economy fills, with themed supplementary items; ritual open. A stated formula at the chapter or wiki tier replaces it.`;
    row.state = 'expressed-derived';
    row.mechanisms = [...new Set([...row.mechanisms, 'engine_brew_stock', 'lotm_derived_formulas'])];
    row.test = 'tests/lotm_derived_formulas.test.js';
    row.case = {module: DERIVED_CASE_MODULE, id: `lotm.derived.${derivedRowId(row.pathway, row.seq)}`};
    row.derived = {rule: spec.rules[0], inputs: spec.inputs};
}

export function rulesFile(derivedIds) {
    const T = TABLE_DOC;
    return {
        meta: {world: 'book.lotm.tingen', pwc: 'PWC21, PWC25 (first rules-as-rows file)', date: '2026-11-17', status: 'proposal (AD32)',
            shape: '{id, world, statement (paraphrased), locators, speaker, mechanism, derives: [row slugs]}',
            split: 'held out when sha1(id)[0] < 0x33 (GKM429)'},
        rules: [
            {id: LOTM_DERIVE_RULES.characteristic, world: 'lotm',
                statement: 'A same-Sequence Beyonder characteristic can stand in for the main materials of that Sequence\'s potion; the supplementary items are still needed and Sequences cannot be skipped. Beyonder characteristics are conserved, so a creature part that carries the characteristic and a dead Beyonder\'s characteristic are the same stuff.',
                locators: [`${T}#01-rules-that-apply-to-every-row (Main versus aux; Characteristic worth)`, 'lotm_c_0214.xhtml', 'lotm_c_0221.xhtml', 'lotm_c_0209.xhtml'],
                speaker: 'character (stated in scene, per the table\'s T tags)',
                mechanism: 'brew_law main slot as an unnamed lot (src/lotm_derived_formulas.js, src/world_packs/lotm_brew_pack.js packRow)',
                derives: derivedIds.filter(id => !id.endsWith('_0'))},
            {id: LOTM_DERIVE_RULES.uniqueness, world: 'lotm',
                statement: 'A pathway has one Sequence 0 at a time and it needs the Uniqueness; the Sequence 0 potions the novel states combine the Uniqueness with Sequence 1 characteristics. The Sequence 0 branch is fitted to two stated rows (Fool, Black Emperor), so it is a default and outside the score.',
                locators: [`${T}#01-rules-that-apply-to-every-row (Seq 0 and 1)`, 'lotm_c_0269.xhtml', 'lotm_c_0327.xhtml', 'lotm_c_0412.xhtml', 'lotm_c_0449.xhtml'],
                speaker: 'character; scene (Blasphemy Card, Fool 0 formula)',
                mechanism: 'brew_law, two main slots (Uniqueness, then Sequence 1 characteristics)',
                derives: derivedIds.filter(id => id.endsWith('_0'))},
            {id: LOTM_DERIVE_RULES.supplementary, world: 'lotm',
                statement: 'Supplementary items are plant liquids, powders and water that fit the Sequence\'s theme; no stated rule links them across Sequences or pathways, so the derived row carries one themed placeholder slot, never a named item.',
                locators: [`${T}#01-rules-that-apply-to-every-row (Ingredient class)`],
                speaker: 'reader inference (dwf57, dwf59)',
                mechanism: 'brew_law aux slot (read by nothing; Neil: the first five barely matter)',
                derives: derivedIds},
        ]};
}

/** Score: does the rule's identity prediction (main carries this row's pathway at this Sequence) match a label made without the rule?
 *  labels: {rowId: [{main, pathway, seq, kind}]}, kind 'characteristic' | 'creature-part' | 'other'. */
export function score(labels) {
    const bins = {all: {}, heldOut: {}};
    for (const [rowId, mains] of Object.entries(labels)) {
        const m = /^lotm\.potion\.(.+)_(\d)$/.exec(rowId), seq = Number(m[2]);
        if (seq === 0) continue;
        for (const x of mains) {
            const bin = x.pathway == null ? 'undeterminable' : (x.pathway === rowId.pathwayName ? '' : '');
            void bin;
        }
    }
    return bins;
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes('--write-rules')) {
    const rows = readFileSync('docs/coverage/lotm_potions.jsonl', 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(r => r.derived).map(r => r.id.replace(/^lotm\.potion\./, ''));
    writeFileSync(RULES_FILE, JSON.stringify(rulesFile(rows), null, 2) + '\n');
    console.log(`wrote ${RULES_FILE} (${rows.length} derived rows)`);
}
