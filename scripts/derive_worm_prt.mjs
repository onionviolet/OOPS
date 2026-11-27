#!/usr/bin/env node
// Worm PRT derivation score (derive-worm lane). Scores scripts/worm_prt_rules.mjs once against the stated classes
// (docs/coverage/worm_power_labels.json) and numbers (docs/coverage/worm_prt_ratings.json). Writes docs/coverage/worm_prt_derived.json.
//   node scripts/derive_worm_prt.mjs           write
//   node scripts/derive_worm_prt.mjs --check   exit 1 when the written file differs from a fresh run
// Split: sha1(id)[0] < 0x33 held out (GKM429, the sidecar's heldOut flag). Nothing is fitted, so the whole cohort is also reported,
// labelled "labels seen while writing, not blind": the rule author read the cape table's classes before writing.
// Baseline: the most common primary class (or stated number) among the NON-held-out stated rows; it scores every row it is asked about.
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readCanonicalText} from './canonical_text.mjs';
import {fileURLToPath} from 'node:url';
import {classSet, primaryOf, ratingOf} from './worm_prt_rules.mjs';

const dir = new URL('../docs/coverage/', import.meta.url);
const rd = f => JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
export const OUT = 'worm_prt_derived.json';
const rate = (k, n) => (n ? Math.round(1000 * k / n) / 1000 : null);
const mode = xs => { const c = new Map(); for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1); return [...c].sort((a, b) => b[1] - a[1] || (a[0] > b[0] ? 1 : -1))[0][0]; };
const same = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

export function build() {
    const side = rd('worm_power_labels.json'), nums = rd('worm_prt_ratings.json');
    const rows = Object.entries(side.rows);
    const rated = rows.filter(([, r]) => r.rating && r.kind === 'cape');
    const train = rated.filter(([, r]) => !r.heldOut);
    const basePrimary = mode(train.map(([, r]) => r.rating.primary));
    const cls = (subset, label) => {
        let n = 0, abst = 0, pe = 0, pin = 0, se = 0, bpe = 0, bpin = 0, bse = 0; const misses = [];
        for (const [id, r] of subset) {
            const set = classSet(r);
            const canon = new Set(r.rating.all);
            if (!set) { abst++; continue; }
            n++;
            const p = primaryOf(set);
            const okP = p === r.rating.primary, okIn = canon.has(p), okS = same(set, canon);
            pe += okP; pin += okIn; se += okS;
            bpe += basePrimary === r.rating.primary; bpin += canon.has(basePrimary); bse += same(new Set([basePrimary]), canon);
            if (!okP) misses.push({id, canon: r.rating.all, derived: [...set].sort(), derivedPrimary: p});
        }
        return {label, rated: subset.length, abstained: abst, n, primaryExact: pe, primaryInCanonSet: pin, setExact: se,
            baseline: {primary: basePrimary, primaryExact: bpe, primaryInCanonSet: bpin, setExact: bse}, misses};
    };
    const heldRated = rated.filter(([, r]) => r.heldOut);
    const classScore = {whole: cls(rated, 'every rated cape row the rule fires on (labels seen while writing, not blind)'), heldOut: cls(heldRated, 'held-out rated cape rows (frozen split)')};

    const nrows = Object.entries(nums.rows).map(([id, v]) => ({id, ...v, heldOut: side.rows[id].heldOut}));
    const trainVals = nrows.filter(r => !r.heldOut).map(r => r.values[r.values.length - 1]);
    const baseNum = mode(trainVals);
    const rat = subset => {
        let n = 0, abst = 0, ex = 0, w1 = 0, bex = 0, bw1 = 0; const misses = [];
        for (const r of subset) {
            const p = ratingOf(side.rows[r.id]);
            if (p == null) { abst++; continue; }
            n++;
            const e = r.values.includes(p), w = r.values.some(v => Math.abs(v - p) <= 1);
            ex += e; w1 += w; bex += r.values.includes(baseNum); bw1 += r.values.some(v => Math.abs(v - baseNum) <= 1);
            if (!e) misses.push({id: r.id, stated: r.values, derived: p});
        }
        return {rated: subset.length, abstained: abst, n, exact: ex, within1: w1, baseline: {value: baseNum, exact: bex, within1: bw1}, misses};
    };
    const ratingScore = {whole: rat(nrows), heldOut: rat(nrows.filter(r => r.heldOut))};

    // Fan tier: class words a community claim attaches to a ledger row, against the canon class set. A second voice, never ground truth.
    const comm = rd('community_tier_worm.json').rows;
    const fan = [];
    for (const c of comm) {
        const r = side.rows[c.ledgerRow];
        const words = [...new Set([...c.claim.matchAll(/\b(Mover|Shaker|Brute|Breaker|Master|Tinker|Blaster|Thinker|Striker|Changer|Trump|Stranger)\b/g)].map(m => m[1]))];
        if (!r || !words.length) continue;
        fan.push({id: c.id, row: c.ledgerRow, fanClasses: words, canon: r.rating?.all ?? null, agrees: r.rating ? words.every(w => r.rating.all.includes(w)) : null});
    }
    const fanScore = {communityRows: comm.length, rowsNamingAClass: fan.length, comparable: fan.filter(f => f.canon).length, agree: fan.filter(f => f.agrees).length, numericRatingsStated: 0, detail: fan};

    // Derived blocks for cape rows with no stated class: the rule's set and primary, and a number where it fires.
    const derived = {};
    for (const [id, r] of rows) {
        if (r.rating || r.kind !== 'cape') continue;
        const set = classSet(r);
        if (!set) continue;
        const e = {class: primaryOf(set), classSet: [...set].sort()};
        const n = ratingOf(r); if (n != null) e.rating = n;
        derived[id] = e;
    }
    return {meta: {pass: 'docs/research/power-catalogues-2026-11-16/lanes/derive-worm.md', date: '2026-11-17', status: 'proposal (AD32)',
        rulesCommit: '38159016a (rules and stated numbers frozen before this scorer ran)', rulesHash: createHash('sha1').update(readCanonicalText(new URL('../scripts/worm_prt_rules.mjs', import.meta.url))).digest('hex').slice(0, 10),
        split: 'GKM429: sha1(id)[0] < 0x33 held out', baselines: {class: `most common training primary (${basePrimary})`, rating: `most common training stated number (${baseNum})`},
        bandDefinitions: {class: 'primaryInCanonSet = the derived primary appears anywhere in the canon class set', rating: 'within1 = within one of any stated value'}},
        class: classScore, rating: ratingScore, fanTier: fanScore, derived};
}

// One registration line in derivation_rules_backtest.mjs calls this with its own row() builder.
export function backtestRows(row, version) {
    const j = JSON.parse(readFileSync(new URL(OUT, dir), 'utf8')), c = j.class.whole, r = j.rating.whole, hc = j.class.heldOut, hr = j.rating.heldOut;
    const common = {inputs: ['effect grammar verb, object, target, time (valid fits only)', 'effect sentence keywords'], version, fit: 'none (written from the page\'s class definitions before scoring; rules frozen in 38159016a)',
        split: 'GKM429 hash split; nothing fitted, so the whole stated cohort is the comparison set (the author had read the cape table: labels seen while writing, not blind)'};
    return [
        row({id: 'worm.prt.class-from-effect', mechanism: 'PRT class set and primary from what the power does: ranged energy is Blaster, area effect is Shaker, controls others is Master, and so on per the page definitions', ...common},
            {label: `rated cape rows the rule fires on (${c.abstained} abstain); primary class exact, within = primary is in the canon class set`, n: c.n, exact: c.primaryExact, within: c.primaryInCanonSet, baseline: j.meta.baselines.class, bExact: c.baseline.primaryExact, bWithin: c.baseline.primaryInCanonSet},
            {n: c.rated, exact: c.primaryExact, baselineExact: c.baseline.primaryExact, heldOutSlice: {n: hc.n, exact: hc.primaryExact, baselineExact: hc.baseline.primaryExact, setExact: hc.setExact}, setExact: {n: c.n, rule: c.setExact, baseline: c.baseline.setExact}, note: 'abstain counted as a miss; set-exact is reported alongside'},
            'Misses are pinned in worm_prt_derived.json class.whole.misses. Held-out slice alone is n=5.'),
        row({id: 'worm.prt.rating-from-reach-and-output', mechanism: 'PRT number from reach (self/touch 0, one target or line 1, cone 2, area 3), whether it lasts, and a high-output object', ...common, fit: 'none (constants fixed before scoring)'},
            {label: `capes with a stated number the rule fires on (${r.abstained} abstain); exact or within one of any stated value`, n: r.n, exact: r.exact, within: r.within1, baseline: j.meta.baselines.rating, bExact: r.baseline.exact, bWithin: r.baseline.within1},
            {n: r.rated, exact: r.exact, baselineExact: r.baseline.exact, heldOutSlice: {n: hr.n, exact: hr.exact, baselineExact: hr.baseline.exact}, note: 'abstain counted as a miss'},
            'Passes the written verdict rule by one exact hit and ties within-one; read as no evidence either way. Misses pinned in worm_prt_derived.json rating.whole.misses.'),
    ];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const out = `${JSON.stringify(build(), null, 1)}\n`;
    if (process.argv.includes('--check')) process.exit(out === readFileSync(new URL(OUT, dir), 'utf8') ? 0 : 1);
    writeFileSync(new URL(OUT, dir), out);
    const j = JSON.parse(out);
    for (const k of ['whole', 'heldOut']) { const c = j.class[k], r = j.rating[k]; console.log(k, 'class', `n=${c.n}/${c.rated}`, `primary ${c.primaryExact}/${c.baseline.primaryExact}`, `inSet ${c.primaryInCanonSet}/${c.baseline.primaryInCanonSet}`, `setExact ${c.setExact}/${c.baseline.setExact}`, '| rating', `n=${r.n}/${r.rated}`, `exact ${r.exact}/${r.baseline.exact}`, `w1 ${r.within1}/${r.baseline.within1}`); }
    console.log('derived rows', Object.keys(j.derived).length, 'fan', JSON.stringify({...j.fanTier, detail: undefined}));
}
