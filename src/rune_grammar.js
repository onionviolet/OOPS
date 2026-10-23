// Rune-pair grammar and talisman ordering (gaps G67, G70). Runes combine in
// pairs; a pair the grammar does not name still resolves (to discord, a costly
// muddle) so free experimentation works in every world and formulas are
// attractors, not gates (MR rules, AD38). A talisman is an ordered strip: each
// adjacent pair is read left to right, an ordered entry `a>b` beats the
// unordered pair, so swapping two runes can change the talisman. Learning by
// contrast reuses craft_experiment_log.deduce (one authority for deduction).
// Pure; the player's pair record is plain JSON `magic.runes@1`. Not wired yet.
import {natural as nat, positive as pos} from './basics.js';
import {compareCodePoints} from './gen_kit.js';
import {deduce} from './craft_experiment_log.js';

export const RUNE_FAMILY = 'magic.runes@1';
const fail = message => { throw new Error(message); };
const unordered = (a, b) => [a, b].sort(compareCodePoints).join('+');

// spec: {id, revision, runes:[id], pairs:[{a, b, ordered?, effect, power}], discord:{effect, power, reason}, maxLength, perRuneCost}
export function defineRuneGrammar(spec) {
    const runes = [...new Set(spec.runes ?? [])];
    if(runes.length < 2 || runes.some(r => typeof r !== 'string' || !r)) fail('A grammar needs at least two named runes.');
    const table = {};
    for(const p of spec.pairs ?? []) {
        if(!runes.includes(p.a) || !runes.includes(p.b) || (p.a === p.b && p.ordered)) fail(`Bad pair ${p.a}/${p.b}.`);
        if(!p.effect || !pos(p.power)) fail(`Pair ${p.a}/${p.b} needs an effect and positive power.`);
        const key = p.ordered ? `${p.a}>${p.b}` : unordered(p.a, p.b);
        if(table[key]) fail(`Duplicate pair ${key}.`);
        table[key] = {effect: p.effect, power: p.power};
    }
    if(!spec.discord?.effect || !pos(spec.discord.power) || !spec.discord.reason) fail('Discord needs an effect, power and in-world reason.');
    return Object.freeze({id: spec.id, revision: pos(spec.revision) ? spec.revision : fail('Revision must be positive.'), runes: Object.freeze(runes), table: Object.freeze(table),
        discord: Object.freeze({...spec.discord}), maxLength: spec.maxLength ?? 5, perRuneCost: spec.perRuneCost ?? 1});
}
export const totalPairs = grammar => grammar.runes.length * (grammar.runes.length + 1) / 2; // unordered, repeats allowed

// Reads the pair as written (a then b).
export function readPair(grammar, a, b) {
    for(const r of [a, b]) if(!grammar.runes.includes(r)) fail(`Unknown rune ${r}.`);
    const hit = grammar.table[`${a}>${b}`] ?? grammar.table[unordered(a, b)];
    return hit ? {...hit, discord: false} : {effect: grammar.discord.effect, power: grammar.discord.power, discord: true};
}
// A strip of runes, left to right. Cost is paid whatever happens; discord is a cost, not a block.
export function readTalisman(grammar, runes) {
    if(!Array.isArray(runes) || runes.length < 2 || runes.length > grammar.maxLength) fail(`A talisman holds 2-${grammar.maxLength} runes.`);
    const effects = {}, steps = [];
    for(let i = 0; i + 1 < runes.length; i++) {
        const r = readPair(grammar, runes[i], runes[i + 1]);
        effects[r.effect] = (effects[r.effect] ?? 0) + r.power;
        steps.push({at: i, pair: [runes[i], runes[i + 1]], ...r});
    }
    return {effects: Object.fromEntries(Object.entries(effects).sort(([a], [b]) => compareCodePoints(a, b))), steps,
        discords: steps.filter(s => s.discord).length, cost: runes.length * grammar.perRuneCost};
}

export const createRuneRecord = () => ({family: RUNE_FAMILY, pairs: []});
// The player's own trials: only what was cast and seen. Duplicates by (a,b,effect) are kept once.
export function recordPair(record, a, b, effect, at) {
    if(!nat(at)) fail('Pairs are recorded at a game minute.');
    if(record.pairs.some(p => p.a === a && p.b === b && p.effect === effect)) return record;
    return {...record, pairs: [...record.pairs, {a, b, effect, at}]};
}
// Exhaustion: how many distinct unordered pairs the player has tried, out of all of them.
export function coverage(grammar, record) {
    const tried = new Set(record.pairs.map(p => unordered(p.a, p.b)));
    return {tried: tried.size, total: totalPairs(grammar), missing: grammar.runes.flatMap((a, i) => grammar.runes.slice(i).map(b => unordered(a, b))).filter(k => !tried.has(k))};
}
// Rune meanings by contrast: which effect follows a rune across every pair it is in, and not pairs without it.
export function learnByContrast(record) {
    const trials = record.pairs.map(p => ({materials: [p.a, p.b], seen: [p.effect], at: p.at}));
    return deduce({entries: trials});
}
export function validateRuneRecord(grammar, record) {
    if(record?.family !== RUNE_FAMILY) fail('Unsupported rune record.');
    for(const p of record.pairs) if(!grammar.runes.includes(p.a) || !grammar.runes.includes(p.b) || !p.effect || !nat(p.at)) fail('Invalid rune pair record.');
    return record;
}
