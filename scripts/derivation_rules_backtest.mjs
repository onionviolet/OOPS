#!/usr/bin/env node
// Derivation rule backtest (PWC80, PWC86, PWC100; proposal). One score row per derivation rule in docs/coverage/derivation_rules.json.
//   node scripts/derivation_rules_backtest.mjs          recompute where the private inputs exist, read the score files elsewhere, write the file
//   node scripts/derivation_rules_backtest.mjs --check  exit 1 when the written file differs from a fresh run
// Split: GKM429, sha1(id)[0] < 0x33 held out, frozen before any score (each rule's own scorer already uses it; this script adds the envelope).
// Verdict rule, written before the table was filled (PWC100):
//   comparison set  the rows the rule applies to, held out (or the whole cohort when the rule fits nothing from training). Rows it abstains on
//                   fall back to the baseline, so scoring the applied set is the same as scoring rule-plus-fallback against baseline on every row;
//                   the abstain-as-miss figure is stored too (allHeldOut) and is not the verdict basis.
//   insufficient-held-out   fewer than FLOOR (10, PWC91) rows in that set: scored, not judged.
//   passes                  exact above baseline exact and within-band not below baseline within-band.
//   fails-baseline          otherwise. Proposal only: relabel its rows `generated`; this script never relabels.
// Confidence on a derived row = the rule's exact and within-band rates on that set, plus n and verdict (read from derivation_rules.json).
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = new URL('..', import.meta.url).pathname;
export const RULES_FILE = 'docs/coverage/derivation_rules.json';
export const FLOOR = 10;
const rd = f => JSON.parse(readFileSync(join(root, f), 'utf8'));
const sha = files => createHash('sha1').update(files.map(f => readFileSync(join(root, f))).reduce((a, b) => Buffer.concat([a, b]), Buffer.alloc(0))).digest('hex').slice(0, 10);
const rate = (k, n) => (n ? Math.round(1000 * k / n) / 1000 : null);

export function verdictOf(n, exact, within, bExact, bWithin) {
    if (n < FLOOR) return 'insufficient-held-out';
    return exact > bExact && (within ?? exact) >= (bWithin ?? bExact) ? 'passes' : 'fails-baseline';
}

function row(base, set, all, notes) {
    const verdict = verdictOf(set.n, set.exact, set.within, set.bExact, set.bWithin);
    return {...base, set: set.label, heldOutN: set.n, exact: set.exact, withinBand: set.within ?? null,
        baseline: {name: set.baseline, exact: set.bExact, withinBand: set.bWithin ?? null}, allHeldOut: all ?? null, verdict,
        confidence: {exact: rate(set.exact, set.n), withinBand: set.within == null ? null : rate(set.within, set.n), n: set.n, verdict}, note: notes};
}

async function guRank() {
    const g = await import('./derive_gu_ranks.mjs');
    const priv = ['/Users/weiwei/code/yet-another-idle-rpg/', root].map(b => join(b, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json')).find(existsSync);
    let rules, held, baseHeld, hn;
    if (priv) {
        const index = JSON.parse(readFileSync(priv, 'utf8')), edges = rd(g.EDGES_FILE).edges;
        const chapterTier = rd('docs/coverage/chapter_tier_labels.json').gu_kinds, wikiTier = rd('docs/coverage/wiki_tier_labels.json').gu_kinds;
        const world = g.buildWorld({index, edges, chapterTier, wikiTier});
        const cohort = Object.entries(chapterTier).filter(([id, c]) => c.role === 'cohort' && c.rank != null && world.recs.get(id).metadata.fandom_category_ranks[0] === c.rank).map(([id]) => id);
        const s = g.scoreRules(world, cohort);
        rules = s.rules; held = cohort.filter(g.heldOut); hn = held.length;
        baseHeld = held.filter(id => world.rank[id] === s.baselineRank).length;
        var baselineRank = s.baselineRank, cohortN = cohort.length;
    } else { const m = rd(g.DERIVED_FILE).meta.scores; rules = m.rules; hn = m.cohort.heldOut; baseHeld = null; baselineRank = m.baselineRank; cohortN = m.cohort.n; }
    const files = ['scripts/derive_gu_ranks.mjs'];
    const common = {inputs: ['band, path and type family', 'known ranks of the family (training rows only)'], version: sha(files), split: 'GKM429 hash split; cohort = rows whose wiki and chapter ranks agree', baselineRule: `most common training rank (${baselineRank})`};
    const f = rules.family, p = rules.precursor, sr = rules.series;
    return [
        row({id: 'gu.rank.family-median', mechanism: 'Gu rank = median known rank of its band, path and type family (resemblance; PWC83 second voice)', fit: 'family medians from training rows', ...common},
            {label: 'held-out cohort rows the rule applies to', n: f.heldOut.n, exact: f.heldOut.exact, within: f.heldOut.within1, baseline: common.baselineRule, bExact: f.heldOut.baselineExact, bWithin: f.heldOut.baselineWithin1},
            {n: hn, exact: f.heldOut.exact, baselineExact: baseHeld, note: 'abstain counted as a miss'},
            'Within-band = rank within one. A rule that rests on name resemblance, not on what the Gu does.'),
        row({id: 'gu.rank.precursor', mechanism: 'Gu rank = highest known precursor rank + 1 (refinement process; PWC93)', fit: 'none (the +1 is a constant, nothing is fitted from training ranks)', ...common},
            {label: 'whole cohort rows with a precursor edge (nothing fitted, so no hold-out needed); held-out slice is n=' + p.heldOut.n, n: p.n, exact: p.exact, within: p.within1, baseline: common.baselineRule, bExact: p.baselineExact, bWithin: p.baselineWithin1},
            {n: hn, exact: p.heldOut.exact, baselineExact: baseHeld, heldOutSlice: p.heldOut, note: 'abstain counted as a miss'},
            'Held-out slice alone is below the floor; the rule fits nothing, so the whole cohort is a fair test.'),
        ...(existsSync(join(root, 'docs/coverage/gu_rank_search.json')) ? (() => {
            const r = rd('docs/coverage/gu_rank_search.json');
            return [{...row({id: 'gu.rank.search-set-v1', mechanism: 'Ordered set: precursor rank + 1, inverse (below its products), next-rank link, story-time neighbours (first appearance), family median fallback (PWC99)', fit: 'nothing fitted beyond k=7 neighbours, chosen on folds 1-4',
                inputs: ['refinement edges', 'first appearance chapter', 'band, path, type family'], version: sha(['scripts/gu_rank_search.mjs']), split: 'five frozen folds (gu_rank_folds.json); fold 5 scored once', baselineRule: 'family-median set on the same fold'},
                {label: 'frozen fold 5, every cohort row (abstain falls back to family median)', n: r.final.n, exact: r.final.exact, within: r.final.within1, baseline: 'gu.rank.family-median set', bExact: r.familyMedian.exact, bWithin: r.familyMedian.within1}, null,
                'Proposal, not wired into any builder. Story-time is a narrative proxy, not an in-world process (PWC93).'), proposed: true}];
        })() : []),
        row({id: 'gu.rank.series', mechanism: 'Gu rank climbs by the step a numbered series shows', fit: 'none', ...common},
            {label: 'whole cohort rows in a series', n: sr.n, exact: sr.exact, within: sr.within1, baseline: common.baselineRule, bExact: sr.baselineExact, bWithin: sr.baselineWithin1}, null,
            'Not among the six rules the ledgers cite (it produced no row); scored for completeness.'),
    ];
}

function hp() {
    const h = rd('docs/coverage/hp_derived_score.json').heldRun;
    return row({id: 'hp.rule.recipe-carries-effect', mechanism: 'An ingredient carries the property axis of the potions whose recipes use it (recipe edges; PWC93)',
        inputs: ['recipe edges ingredient to potion', 'potion effect axis', 'sibling ingredients (training axes only)'], version: sha(['scripts/derive_hp_properties.mjs']),
        fit: 'axis votes from training siblings; dials in DERIVE_DIALS', split: 'GKM429, held-out ingredients hide their own stated axes'},
    {label: 'held-out ingredients the rule derives', n: h.derived, exact: h.top, within: h.any, baseline: `always ${'venom'}`, bExact: h.baseTopOnDerived, bWithin: h.baseTopOnDerived},
    {n: h.n, exact: h.top, baselineExact: h.baseTop, note: 'abstain counted as a miss; the rule alone loses to "always venom" here, the rule with baseline fallback wins'},
    'Misses are pinned in hp_derived_score.json heldRun.misses.');
}

function lotm() {
    const s = rd('docs/coverage/lotm_derived_score.json').byTier.all.heldOut;
    const upper = Math.min(s.majorityPathway.right, s.majoritySequence.right);
    return [
        row({id: 'lotm.rule.characteristic-replaces-main', mechanism: 'A same-Sequence characteristic can stand in for the potion main (brew_law main slot)',
            inputs: ['pathway', 'Sequence'], version: sha(['src/lotm_derived_formulas.js']), fit: 'none (identity prediction; stated in scene)',
            split: 'GKM429 (frozen in 13b7b765c); labels = Luna recall of the natural main, not a chapter read'},
        {label: 'held-out rows with a determinable natural main, both axes right', n: s.determinable, exact: s.ruleBothAxes, within: Math.max(s.rulePathwayRight, s.ruleSeqRight), baseline: 'majority pathway and Sequence (upper bound: the smaller single-axis majority count)', bExact: upper, bWithin: upper}, null,
            'The rule says a characteristic CAN replace a main; it never claimed it is the natural main, so a miss here is partly a mismatch of claim and test (edge case E1).'),
        row({id: 'lotm.rule.seq0-uniqueness-and-seq1-characteristics', mechanism: 'Sequence 0 potion = the pathway Uniqueness plus Sequence 1 characteristics', inputs: ['pathway'],
            version: sha(['src/lotm_derived_formulas.js']), fit: 'fitted to the two stated Sequence 0 formulas (Blasphemy Card, Fool 0)', split: 'none: no Sequence 0 formula is left to hold out'},
        {label: 'no held-out Sequence 0 formula', n: 0, exact: 0, within: null, baseline: 'no baseline', bExact: 0, bWithin: null}, null,
            'Scored, not judged. Needs a later Sequence 0 formula from the books (PWC87).'),
    ];
}

function generator() {
    const s = rd('docs/coverage/gu_generated_score.json');
    const k = (r, n) => Math.round(r * n / 100);
    return row({id: 'gu.generated.concept', mechanism: 'A model drafts a Gu from a concept word and the catalogue prefix; rank band, path and verb checked against canon Gu of the same concept',
        inputs: ['concept word', 'prompt hash', 'catalogue prefix'], version: sha(['docs/coverage/gu_generated_prefix.txt']),
        fit: 'none (prompted, frozen set gu_generated_frozen.json)', split: 'concepts frozen before generation; scored on canon Gu that share the concept'},
    {label: 'rank band, every scored concept (path and verb in note)', n: s.band.n, exact: k(s.band.generator, s.band.n), within: null, baseline: 'most common band', bExact: k(s.band.baseline, s.band.n), bWithin: null}, null,
        `Ahead of baseline on path (${s.path.generator}% against ${s.path.baseline}%, n=${s.path.n}), behind on band and verb (${s.verb.generator}% against ${s.verb.baseline}%, n=${s.verb.n}). These rows already carry tier generated; no relabel needed, the palette says why.`);
}

export async function build() {
    const rules = [...(await guRank()), hp(), ...lotm(), generator(), ...(await import('./ss_rank_rules.mjs')).ssRankRows(row, sha)];
    return {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#pwc100-pwc119-derivation-rule-scores-and-core-axioms-2026-11-17-proposals', date: '2026-11-17', status: 'proposal (AD32)',
        split: 'GKM429: sha1(id)[0] < 0x33 held out, frozen before scoring', floor: FLOOR,
        verdicts: 'passes | fails-baseline | insufficient-held-out; written in scripts/derivation_rules_backtest.mjs before the table was filled',
        regenerate: 'node scripts/derivation_rules_backtest.mjs'}, rules};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const out = `${JSON.stringify(await build(), null, 1)}\n`;
    if (process.argv.includes('--check')) { process.exit(out === readFileSync(join(root, RULES_FILE), 'utf8') ? 0 : 1); }
    writeFileSync(join(root, RULES_FILE), out);
    for (const r of JSON.parse(out).rules) console.log(r.id.padEnd(52), String(r.heldOutN).padStart(4), `${r.exact}/${r.baseline.exact}`.padStart(8), `${r.withinBand ?? '-'}/${r.baseline.withinBand ?? '-'}`.padStart(8), r.verdict);
}
