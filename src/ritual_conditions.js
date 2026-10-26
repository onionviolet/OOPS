// Ritual conditions (DWF145-DWF149, 2026-10-25), shared across worlds beside the dose envelope (dose_process.js). A ritual is a list of
// conditions checked at the moment of a transition (a potion drunk, a breakthrough begun, an Animagus preparation ended). Each condition has an
// exact rule and a principle; a substitute that carries the principle's traits counts with a fit score (the pattern of substitutesFor in
// lotm_ingredient_catalogue.js: physical 1, functional 1, symbolic 2, a floor under which a stand-in is rejected). Outcomes are graded and never a
// lock: met, substituted, partial (some condition absent) or absent, with stated loss-of-control odds (AD38). Rules are the evaluateRule shapes over
// facts the world already tracks, so no second predicate language exists. Leaf: no world imports, no DOM, no clock, no save. Every number is a
// per-world dial and a labelled proposal (WPR5).
import {evaluateRule} from './rules.js';

export const RITUAL_GRADES = Object.freeze(['met', 'substituted', 'partial', 'absent']);
export const RITUAL_LAYERS = Object.freeze(['physical', 'functional', 'symbolic']);
export const LAYER_WEIGHT = Object.freeze({physical: 1, functional: 1, symbolic: 2});
const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);
const plain = v => v && typeof v === 'object' && !Array.isArray(v);
const freeze = v => { if(v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; };
const layerTags = (v, label) => {
    const out = {};
    for(const layer of RITUAL_LAYERS) {
        const list = v?.[layer] ?? [];
        if(!Array.isArray(list) || list.some(t => typeof t !== 'string' || !t)) fail(`${label} ${layer} traits must be a list of text.`);
        out[layer] = [...list];
    }
    return out;
};

// A world's dial: floor under which a stand-in is rejected, baseline odds when everything is met, the ceiling when nothing is, and the recovery
// window canon gives after a pre-sign (about a week, DWF149). Default plus dial plus reason.
export function ritualDial(world, d = {}) {
    const dial = {world: text(world, 'Dial world'), floor: d.floor ?? 0.5, baseOdds: d.baseOdds ?? 5, maxOdds: d.maxOdds ?? 90, recoveryDays: d.recoveryDays ?? 7,
        status: d.status ?? 'PROPOSAL', why: d.why ?? 'Default dial: a weak stand-in raises the odds, an absent condition raises them most; nothing refuses (AD38).'};
    if(!(dial.floor >= 0 && dial.floor <= 1)) fail('Dial floor is between 0 and 1.');
    if(!(Number.isInteger(dial.baseOdds) && Number.isInteger(dial.maxOdds) && dial.baseOdds >= 0 && dial.maxOdds >= dial.baseOdds && dial.maxOdds <= 100)) fail('Dial odds are whole percents with base at most max at most 100.');
    return freeze(dial);
}

export function defineRitual(row) {
    if(!plain(row)) fail('A ritual is an object.');
    if(!Array.isArray(row.conditions) || !row.conditions.length) fail('A ritual lists its conditions.');
    const conditions = row.conditions.map(c => {
        const id = text(c.id, 'Condition ID');
        if(!plain(c.exact) || !plain(c.exact.rule)) fail(`Condition ${id} needs an exact rule.`);
        evaluateRule(c.exact.rule, {});
        const substitutes = (c.substitutes ?? []).map(s => {
            evaluateRule(s.rule, {});
            return {id: text(s.id, 'Substitute ID'), rule: structuredClone(s.rule), tags: layerTags(s.tags, `Substitute ${s.id}`), text: text(s.text, 'Substitute text')};
        });
        return {id, label: text(c.label, 'Condition label'), principle: {id: text(c.principle?.id, 'Principle id'), text: text(c.principle?.text, 'Principle text'), wants: layerTags(c.principle?.wants, `Principle of ${id}`)},
            exact: {rule: structuredClone(c.exact.rule), text: text(c.exact.text, 'Exact text')}, substitutes, weight: c.weight ?? 1};
    });
    if(new Set(conditions.map(c => c.id)).size !== conditions.length) fail('Duplicate condition ID.');
    return freeze({id: text(row.id, 'Ritual ID'), world: text(row.world, 'Ritual world'), formula: text(row.formula, 'Ritual formula'), scale: text(row.scale, 'Ritual scale'),
        label: text(row.label, 'Ritual label'), conditions, evidence: [...(row.evidence ?? [])], proposals: [...(row.proposals ?? [])]});
}

// Weighted share of the principle's wanted traits that a candidate carries; symbolic fit counts double. No wanted traits means a perfect fit.
export function fitScore(wants, has) {
    let total = 0, weight = 0;
    for(const layer of RITUAL_LAYERS) {
        if(!wants[layer].length) continue;
        total += LAYER_WEIGHT[layer] * wants[layer].filter(t => has[layer].includes(t)).length / wants[layer].length;
        weight += LAYER_WEIGHT[layer];
    }
    return weight ? Math.round(total / weight * 1000) / 1000 : 1;
}

const ruleMet = (rule, facts) => { try { return evaluateRule(rule, facts).met; } catch { return false; } };

// The one check, run at the moment of transition. `facts` is the world's own fact map. Returns per-condition status and the aggregate:
// every condition met -> met; none absent but some substituted -> substituted; some absent, some not -> partial; all absent -> absent.
// Odds = base + (max - base) x weighted loss share, where met loses 0, a substitute loses 1 - fit and an absent condition loses 1.
export function gradeRitual(ritual, facts, dial) {
    const floor = dial.floor, rows = ritual.conditions.map(c => {
        if(ruleMet(c.exact.rule, facts)) return {id: c.id, label: c.label, status: 'met', fit: 1, via: c.exact.text, loss: 0, principle: c.principle.text, rejected: []};
        const ranked = [], rejected = [];
        for(const s of c.substitutes) {
            if(!ruleMet(s.rule, facts)) continue;
            const fit = fitScore(c.principle.wants, s.tags);
            if(fit < floor) rejected.push({id: s.id, text: s.text, reason: `fit ${fit} is below the floor ${floor}`}); else ranked.push({s, fit});
        }
        ranked.sort((a, b) => b.fit - a.fit);
        if(ranked.length) return {id: c.id, label: c.label, status: 'substituted', fit: ranked[0].fit, via: ranked[0].s.text, loss: 1 - ranked[0].fit, principle: c.principle.text, rejected};
        return {id: c.id, label: c.label, status: 'absent', fit: 0, via: null, loss: 1, principle: c.principle.text, rejected, wanted: c.exact.text};
    });
    const weights = ritual.conditions.map(c => c.weight), sum = weights.reduce((a, b) => a + b, 0);
    const lossShare = rows.reduce((n, r, i) => n + weights[i] * r.loss, 0) / sum;
    const odds = Math.round(dial.baseOdds + (dial.maxOdds - dial.baseOdds) * lossShare);
    const absent = rows.filter(r => r.status === 'absent').length, subbed = rows.filter(r => r.status === 'substituted').length;
    const grade = absent === rows.length ? 'absent' : absent ? 'partial' : subbed ? 'substituted' : 'met';
    return {ritualId: ritual.id, grade, odds, conditions: rows, recoveryDays: dial.recoveryDays, status: dial.status};
}

// Plain sentence for a UI line or a log: what was checked, what stood in, what was missing, the odds.
export function describeGrade(result) {
    const parts = result.conditions.map(c => c.status === 'met' ? `${c.label}: met (${c.via})` : c.status === 'substituted' ? `${c.label}: substituted (${c.via}, fit ${c.fit})`
        : `${c.label}: absent (${c.wanted})`);
    return {headline: `Rite ${result.grade}: stated loss-of-control odds ${result.odds} percent (a proposal)`, lines: parts};
}
