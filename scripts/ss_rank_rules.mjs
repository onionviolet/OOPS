// Score rows for the Shadow Slave rank rules (PWC80, PWC99, PWC100; proposal). Definitions live here; derivation_rules_backtest.mjs registers them
// with one line and the coordinator regenerates docs/coverage/derivation_rules.json. Reads only the committed fold-5 result, so it runs without private files.
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
const root = new URL('..', import.meta.url).pathname;
export const SS_RESULT = 'docs/coverage/ss_rank_search.json';
export function ssRankRows(row, sha) {
    if (!existsSync(join(root, SS_RESULT))) return [];
    const r = JSON.parse(readFileSync(join(root, SS_RESULT), 'utf8'));
    const mech = {
        creatures: 'Nightmare Creature tier = tier of the creatures first met at nearly the same chapter (story time, k=3; the Nightmare the story is in sets the tier it spawns); source and class rules abstain on the rows that matter (PWC93, PWC99)',
        artifacts: 'Memory and item tier = tier of the Memories first met at nearly the same chapter (story time, k=3: a Memory is the tier of the creature or Nightmare of its day); the source-creature link fires on one row (PWC93, PWC99)',
    };
    return ['creatures', 'artifacts'].map(pool => {
        const p = r.pools[pool], f = p.final;
        return row({id: `ss.rank.${pool}-story-time`, mechanism: mech[pool], fit: 'k=3 neighbours chosen on dev folds 1-4; nothing else fitted',
            inputs: ['first chapter in the evidence', 'tiers stated by other records (visible folds only)'], version: sha(['scripts/ss_rank_search.mjs', 'scripts/ss_rank_rules.mjs']),
            split: 'five frozen folds (ss_rank_folds.json); fold 5 scored once', baselineRule: 'most common visible tier in the pool'},
        {label: `frozen fold 5, every stated ${pool} row (abstain falls back to the baseline)`, n: f.n, exact: f.exact, within: f.within1, baseline: 'most common visible tier', bExact: p.baseline.exact, bWithin: p.baseline.within1},
        {n: f.n, exact: f.exact, baselineExact: p.baseline.exact, resemblanceExact: p.resemblance.exact, resemblanceWithin1: p.resemblance.within1, note: 'resemblance = shared name stem; tier order is the ledger class_map order (a default)'},
        `Stated rows are mostly kind names that carry the tier in the name, so this scores story time against name-stated tiers. Within-one depends on the ladder order. ${pool === 'artifacts' ? 'Fold 5 has fewer than ten stated rows, so it is scored, not judged.' : 'Exact is below baseline; within-one is above it.'}`);
    });
}
