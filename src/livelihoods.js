// Lane E (livelihood stage record), read side. A world-neutral projection: each world registers a source that reads its own existing
// owners and returns stage records; nothing here stores, saves or imports a world (AR3, AR17 direction). Rows are derived on every
// read, so an untouched save gains no key. A source that throws is skipped: a broken world never stops a digest.
// Record: {id, world, kind, label, stage, detail, income, runBy, obligations, authority}
//  stage       one of STAGES (idea, set up, running, automated, ended); a world uses the ones its owner can tell apart.
//  income      {amount, unit, per, text} where an owner already computes it, else null. Never invented.
//  runBy       self | hire | group (who does the work today).
//  obligations {kind: none|rent|tax|dues|wage-terms|other, pointer, why}; pointer names the duties/owed row, or null.
//  authority   {known, who}, read through authorityOver (src/authority.js) by the world's source, never hard-coded; `claim` carries {reach, why, short} beside it.
//              A record with no `who` (no one claims the place) owes nothing either. OB8/OB12: where no authority knows of the place, no rent, tax or dues are owed, so known=false forces kind none.
import {authorityOver} from './authority.js';
export const STAGES = Object.freeze(['idea', 'set up', 'running', 'automated', 'ended']);
export const RUNNERS = Object.freeze(['self', 'hire', 'group']);
export const OBLIGATION_KINDS = Object.freeze(['none', 'rent', 'tax', 'dues', 'wage-terms', 'other']);
const text = v => typeof v === 'string' && v.length > 0;
const sources = new Map();
export function registerLivelihoodSource(worldId, fn) {
    if (!text(worldId) || typeof fn !== 'function') throw Error('A livelihood source needs a world id and a reader.');
    sources.set(worldId, fn);
}
export function validateLivelihood(r) {
    const bad = m => { throw Error(`Invalid livelihood ${r?.id}: ${m}`); };
    if (!r || !text(r.id) || !text(r.world) || !text(r.kind) || !text(r.label)) bad('needs id, world, kind and label.');
    if (!STAGES.includes(r.stage)) bad('unknown stage.');
    if (!RUNNERS.includes(r.runBy)) bad('unknown runner.');
    if (r.income != null && !(Number.isFinite(r.income.amount) && text(r.income.per) && text(r.income.text))) bad('income needs amount, per and text.');
    if (!r.obligations || !OBLIGATION_KINDS.includes(r.obligations.kind) || !text(r.obligations.why)) bad('obligations need a kind and a reason.');
    if (!r.authority || typeof r.authority.known !== 'boolean') bad('authority needs known.');
    if (!r.authority.known && r.obligations.kind !== 'none') bad('no authority knows of it, so nothing is owed (OB8).');
    if(!r.authority.who && r.obligations.kind !== 'none') bad('no one claims the place, so nothing is owed (OB8).');
    return r;
}
// The authority fields of a record for a place, from the OB8 seam. `registered` / `holder` come from the world's own facts (a plot right, a lease).
export function authorityFields(state, {world, place, registered = false, holder = null, ctx = {}}) {
    const a = authorityOver(state, {world, place, registered, holder, ctx});
    return {authority: {known: a.knows, who: a.knows && a.claimant ? (a.holder ?? a.claimant) : null}, claim: {reach: a.reach, why: a.why, short: a.short}};
}
export function livelihoodsOf(state, ctx = {}) {
    const out = [];
    for (const [world, read] of sources) {
        if (ctx.worldId && ctx.worldId !== world) continue;
        let rows;
        try { rows = read(state, ctx) || []; } catch { continue; }
        for (const row of rows) {
            try { out.push(validateLivelihood({...row, world})); } catch { /* an invalid row is dropped, not shown */ }
        }
    }
    return out;
}
// One short player-facing line per record, for any view.
export function livelihoodLine(r) {
    const pay = r.income ? ` Pays ${r.income.text} ${r.income.per}.` : '';
    const owes = r.obligations.kind === 'none' ? '' : ` ${r.obligations.why}`;
    return `${r.label}: ${r.stage}${r.detail ? `, ${r.detail}` : ''}.${pay}${owes}`;
}
