// R1 proposal. Shared admission and outcome semantics for rolls and exact odds.
import {address} from './gen_kit.js';
import {evaluateRule} from './rules.js';

export const CHECK_ENGINE = 'check@1';
export const CHECK_BUDGET = Object.freeze({dice: 32, sides: 100, support: 512, modifiers: 32, spends: 8, attemptsPerDie: 8});
const need = (ok, message) => { if (!ok) throw TypeError(message); };
export const integer = (n, min, max) => Number.isSafeInteger(n) && n >= min && n <= max;
export const text = s => typeof s === 'string' && s.length > 0;
// null marks the incomplete uint32 tail. Every accepted face has exactly
// floor(2^32/sides) preimages, which is the fair-die basis for checkOdds.
export function checkDieFace(draw, sides) {
    need(integer(draw, 0, 0xffffffff) && integer(sides, 2, CHECK_BUDGET.sides), 'Invalid die draw/sides.');
    const bucket = Math.floor(0x100000000 / sides);
    return draw < bucket * sides ? Math.floor(draw / bucket) + 1 : null;
}
export function shape(v, allowed, required = []) {
    need(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every(k => allowed.includes(k)) &&
        required.every(k => Object.hasOwn(v, k)), 'Unsupported check fields.');
}
export function validateCheckProfile(profile) {
    address(profile); // Reject non-JSON, lossy numbers and cycles before cloning.
    shape(profile, ['id', 'revision', 'family', 'dice', 'successAt', 'degreeStep', 'critical'], ['id', 'revision', 'family', 'dice']);
    need(text(profile.id) && integer(profile.revision, 1, Number.MAX_SAFE_INTEGER), 'Invalid profile id/revision.');
    need(['sum_target', 'roll_under', 'success_pool'].includes(profile.family), 'Unsupported resolver family.');
    shape(profile.dice, ['count', 'sides'], ['count', 'sides']);
    const {count, sides} = profile.dice;
    need(integer(count, 1, CHECK_BUDGET.dice) && integer(sides, 2, CHECK_BUDGET.sides) && count * sides <= CHECK_BUDGET.support,
        'Dice exceed check budget.');
    need(profile.family !== 'roll_under' || count === 1, 'Roll under requires one die.');
    need(profile.family === 'success_pool' ? integer(profile.successAt, 1, sides) : profile.successAt === undefined,
        'Pool needs successAt; other families do not.');
    need(profile.degreeStep === undefined || integer(profile.degreeStep, 1, 1000000), 'Invalid degree step.');
    if (profile.critical !== undefined) {
        shape(profile.critical, ['successFace', 'failureFace'], ['successFace', 'failureFace']);
        need(count === 1 && profile.family !== 'success_pool' && Object.values(profile.critical).every(n => integer(n, 1, sides)) &&
            profile.critical.successFace !== profile.critical.failureFace, 'Critical faces require distinct faces on a single die.');
    }
    return structuredClone(profile);
}
function modifier(m, timing, spend = false) {
    shape(m, ['id', 'kind', 'value', 'reason'], ['id', 'kind', 'reason']);
    need(text(m.id) && text(m.reason), 'Modifiers need id and reason.');
    const kinds = timing === 'after' ? ['bonus', 'target', 'reroll'] : ['bonus', 'target', 'advantage', 'disadvantage'];
    need(kinds.includes(m.kind) && (m.kind !== 'reroll' || spend), 'Unsupported modifier timing/kind.');
    need(['bonus', 'target'].includes(m.kind) ? integer(m.value, -1000000, 1000000) : m.value === undefined,
        'Numeric modifiers need integer values; other modifiers have no value.');
}
function predicate(rule, depth = 0) {
    need(depth <= 16, 'Check predicate exceeds depth budget.');
    shape(rule, ['all', 'any', 'not', 'fact', 'op', 'value', 'reason']);
    const branches = ['all', 'any', 'not'].filter(k => Object.hasOwn(rule, k));
    if (branches.length) {
        need(branches.length === 1 && Object.keys(rule).length === 1, 'Ambiguous check predicate.');
        const op = branches[0];
        if (op === 'not') predicate(rule.not, depth + 1);
        else {
            need(Array.isArray(rule[op]) && rule[op].length <= 32, 'Check predicate exceeds child budget.');
            rule[op].forEach(r => predicate(r, depth + 1));
        }
    } else {
        need(text(rule.fact) && ['eq', 'gte', 'lte'].includes(rule.op) && Object.hasOwn(rule, 'value') &&
            (rule.op === 'eq' || Number.isSafeInteger(rule.value)) && (rule.reason === undefined || text(rule.reason)), 'Invalid check predicate.');
    }
}
export function prepareCheck(profile, input) {
    const p = validateCheckProfile(profile);
    address(input);
    shape(input, ['id', 'target', 'modifiers', 'resources', 'spends', 'requires', 'facts'], ['id', 'target']);
    need(text(input.id) && integer(input.target, -1000000, 1000000), 'Check needs id and integer target.');
    const check = {modifiers: [], resources: {}, spends: [], facts: {}, ...structuredClone(input)};
    need(Array.isArray(check.modifiers) && check.modifiers.length <= CHECK_BUDGET.modifiers &&
        Array.isArray(check.spends) && check.spends.length <= CHECK_BUDGET.spends, 'Check modifier/spend budget exceeded.');
    check.modifiers.forEach(m => modifier(m, 'before'));
    need(check.resources && !Array.isArray(check.resources) && typeof check.resources === 'object' &&
        Object.values(check.resources).every(n => integer(n, 0, 1000000000)), 'Invalid resource balances.');
    const reserved = {...check.resources};
    for (const s of check.spends) {
        shape(s, ['id', 'timing', 'resource', 'cost', 'modifier', 'when'], ['id', 'timing', 'resource', 'cost', 'modifier']);
        need(text(s.id) && text(s.resource) && integer(s.cost, 1, 1000000000) && ['before', 'after'].includes(s.timing), 'Invalid spend.');
        need(s.when === undefined || s.when === 'always' || (s.when === 'failure' && s.timing === 'after'), 'Unsupported spend condition.');
        modifier(s.modifier, s.timing, true);
        need(Object.hasOwn(reserved, s.resource) && reserved[s.resource] >= s.cost, 'Insufficient resource for requested spend policy.');
        reserved[s.resource] -= s.cost; // Admission reserves worst case; only applied spends are debited below.
    }
    const ids = [...check.modifiers.map(m => m.id), ...check.spends.map(s => s.modifier.id)];
    need(new Set(ids).size === ids.length && new Set(check.spends.map(s => s.id)).size === check.spends.length, 'Duplicate modifier/spend id.');
    need(check.spends.filter(s => s.modifier.kind === 'reroll').length <= 1, 'Only one after-roll reroll per check is supported.');
    need(check.facts && typeof check.facts === 'object' && !Array.isArray(check.facts), 'Invalid check facts.');
    if (check.requires !== undefined) predicate(check.requires);
    const gate = check.requires === undefined ? {met: true, known: true, reasons: []} : evaluateRule(check.requires, check.facts);
    const before = [...check.modifiers, ...check.spends.filter(s => s.timing === 'before').map(s => s.modifier)];
    // Presence cancels, independent of the number/order of sources.
    const advantage = before.some(m => m.kind === 'advantage'), disadvantage = before.some(m => m.kind === 'disadvantage');
    return {profile: p, check, gate, mode: advantage === disadvantage ? 'normal' : advantage ? 'advantage' : 'disadvantage'};
}
export function scoreDice(profile, dice) {
    return profile.family === 'success_pool' ? dice.filter(n => n >= profile.successAt).length : dice.reduce((a, b) => a + b, 0);
}
export function chooseScore(profile, mode, scores) {
    const bestHigh = profile.family !== 'roll_under';
    const high = mode === 'advantage' ? bestHigh : !bestHigh;
    return mode === 'normal' ? 0 : scores[0] === scores[1] ? 0 : (scores[1] > scores[0]) === high ? 1 : 0;
}
export function outcome(profile, target, bonus, raw) {
    const total = raw + bonus;
    const margin = profile.family === 'roll_under' ? target - total : total - target;
    const critical = raw === profile.critical?.successFace ? 'success' : raw === profile.critical?.failureFace ? 'failure' : null;
    const success = critical ? critical === 'success' : margin >= 0;
    const degree = critical ? `critical_${critical}` : success ? 'success' : 'failure';
    const level = success ? 1 + Math.floor(Math.max(0, margin) / (profile.degreeStep || 1000000000))
        : -1 - Math.floor(Math.max(0, -margin - 1) / (profile.degreeStep || 1000000000));
    return {raw, bonus, total, target, margin, success, degree, level};
}
// The same policy evaluator is used for every exact-odds branch and actual roll.
export function applyCheckPolicy(plan, first, reroll) {
    const {profile, check, gate} = plan;
    const remaining = {...check.resources}, spent = [], modifiers = [...check.modifiers];
    if (!gate.met) return {result: {success: false, degree: 'blocked', level: 0}, remaining, spent, modifiers: []};
    let raw = first, bonus = 0, target = check.target;
    const apply = m => { if (m.kind === 'bonus') bonus += m.value; if (m.kind === 'target') target += m.value; };
    const spend = s => {
        remaining[s.resource] -= s.cost;
        spent.push({id: s.id, timing: s.timing, resource: s.resource, cost: s.cost, modifier: structuredClone(s.modifier)});
        modifiers.push(s.modifier);
        apply(s.modifier);
    };
    check.modifiers.forEach(apply);
    check.spends.filter(s => s.timing === 'before').forEach(spend);
    for (const s of check.spends.filter(s => s.timing === 'after')) {
        if (s.when === 'failure' && outcome(profile, target, bonus, raw).success) continue;
        spend(s);
        if (s.modifier.kind === 'reroll') raw = reroll(); // Replace, including a worse result.
    }
    return {result: outcome(profile, target, bonus, raw), remaining, spent, modifiers: structuredClone(modifiers)};
}
