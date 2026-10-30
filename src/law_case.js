// Cross-book law case seam (GM23, bk-seams). Extends jurisdiction_rules.js, which stays the one owner of "one act in one place gives one
// ruling" (CX2: reuse, do not fork). This file adds what the merged law rows show that module cannot say: detection as a step before
// evidence, nested jurisdiction (place inside district inside realm), several statutes and enforcers on one act, an actor filter
// (`appliesTo`), a response ladder, and an adapter from a merged law row plus a typed overlay. Pure read model; no save, no host
// registration (AR3, AR12). Chance is not drawn here: a caller passes who actually saw what (MR2), so reloads cannot reroll a witness.
import {check, object, deepFreeze} from './basics.js';
import {defineStatutes, rulingFor} from './jurisdiction_rules.js';

const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const tags = v => Array.isArray(v) && v.every(id);
const VIA = ['witness', 'trace', 'detector'];

/** Statutes plus optional `appliesTo:[actor tags]` (empty or absent: everyone), `detection:[{via, gives, min?}]` and
 *  `responses:[{trigger, response, by}]`. The base fields are validated by defineStatutes; the extras here. */
export function defineLawBook(rows) {
    const table = defineStatutes(rows);
    for(const r of rows) {
        check(r.appliesTo === undefined || tags(r.appliesTo), `Invalid appliesTo on ${r.id}.`);
        check(r.detection === undefined || (Array.isArray(r.detection) && r.detection.every(d => object(d) && VIA.includes(d.via) && typeof d.gives === 'string' && d.gives
            && (d.min === undefined || (Number.isSafeInteger(d.min) && d.min >= 1)))), `Invalid detection on ${r.id}.`);
        check(r.responses === undefined || (Array.isArray(r.responses) && r.responses.every(x => object(x) && id(x.trigger) && typeof x.response === 'string' && x.response && typeof x.by === 'string' && x.by)), `Invalid responses on ${r.id}.`);
    }
    return table;
}

/** Place first, then each ancestor. parentOf: {place: parent}. Stops at a repeat so a bad map cannot loop. */
export function jurisdictionChain(place, parentOf = {}) {
    const chain = [];
    for(let p = place; p && !chain.includes(p); p = parentOf[p]) chain.push(p);
    return chain;
}

/** scene: {witnesses: [{id, saw: bool}], traces: [kinds present], detectors: [kinds present]}.
 *  -> evidence kinds the statute's detection sources produce. A witness source with min:2 needs two who saw. A statute with no
 *  detection list produces nothing here; the caller's own evidence still counts. */
export function detect(statute, scene = {}) {
    const seen = (scene.witnesses || []).filter(w => w.saw).length, out = [];
    for(const d of statute.detection || []) {
        const ok = d.via === 'witness' ? seen >= (d.min ?? 1)
            : d.via === 'trace' ? (scene.traces || []).includes(d.gives) : (scene.detectors || []).includes(d.gives);
        if(ok && !out.includes(d.gives)) out.push(d.gives);
    }
    return out;
}

const applies = (row, actorTags) => !row.appliesTo?.length || row.appliesTo.some(t => actorTags.includes(t));

/** Every statute on the act at the place and each ancestor that applies to the actor.
 *  ctx: {evidence, strictness (number, or {place: number}), flags, scene, actor: {tags}}.
 *  -> {act, place, covered, cases:[{level, statute, ruling, found, responses}], enforcers, primary}
 *  `primary` is the most local case that is both unlawful and proven (a local office acts before a distant one); null if none. */
export function caseFor(table, act, place, parentOf = {}, ctx = {}) {
    const actorTags = ctx.actor?.tags || [], cases = [];
    for(const level of jurisdictionChain(place, parentOf)) {
        for(const row of table.filter(r => r.act === act && r.places.includes(level) && applies(r, actorTags))) {
            const found = detect(row, ctx.scene), evidence = [...new Set([...(ctx.evidence || []), ...found])];
            const strictness = typeof ctx.strictness === 'object' ? (ctx.strictness[level] ?? 1) : (ctx.strictness ?? 1);
            const ruling = rulingFor([row], act, level, {evidence, strictness, flags: ctx.flags || []});
            cases.push({level, statute: row.id, ruling, found, responses: row.responses || []});
        }
    }
    const enforcers = [...new Set(cases.filter(c => !c.ruling.lawful).map(c => c.ruling.enforcer))];
    const primary = cases.find(c => !c.ruling.lawful && c.ruling.proven) || null;
    return deepFreeze({act, place, covered: cases.length > 0, cases, enforcers, primary});
}

/** Responses a case would meet, in row order, for the triggers that have happened (e.g. 'repeat', 'resisted'). */
export function responsesFor(caseRow, triggers = []) { return caseRow.responses.filter(r => triggers.includes(r.trigger)); }

const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** Merged law row (reading rows: conditions, who, consequences[{trigger,response,by}], optional enforcement{penalty,enforcer,detection})
 *  plus a typed overlay {act, places, appliesTo?, detection?, evidence?, exemptions?} -> statute, or {skipped} when the row names no enforcer
 *  (a norm with nobody to act on it is kept as text, not invented an enforcer; WPR). Free-text `enforcement.detection` is kept as `note`. */
export function statuteFromRow(row, overlay) {
    check(object(row) && id(row.id) && object(overlay) && id(overlay.act) && Array.isArray(overlay.places), `Invalid law row or overlay ${row?.id}.`);
    const cons = Array.isArray(row.consequences) ? row.consequences.filter(c => object(c)) : [];
    const enforcer = row.enforcement?.enforcer || cons.find(c => c.by)?.by;
    if(!enforcer) return {skipped: row.id, why: 'No enforcer named in the row.'};
    const penaltyText = row.enforcement?.penalty || cons.find(c => c.response)?.response;
    if(!penaltyText) return {skipped: row.id, why: 'No penalty or response named in the row.'};
    // An overlay that types only detection still needs proof: default the need to what detection can give, so no scene means unproven.
    const needs = overlay.evidence || [...new Set((overlay.detection || []).map(d => d.gives))];
    const responses = cons.filter(c => id(slug(c.trigger || '')) && c.response && c.by).map(c => ({trigger: slug(c.trigger), response: c.response, by: c.by}));
    return {id: row.id, act: overlay.act, places: overlay.places, enforcer,
        penalty: {kind: overlay.penaltyKind || 'sanction', text: penaltyText},
        evidence: {needs, known: needs.length > 0},
        ...(overlay.exemptions ? {exemptions: overlay.exemptions} : {}),
        ...(overlay.appliesTo ? {appliesTo: overlay.appliesTo} : {}),
        ...(overlay.detection ? {detection: overlay.detection} : {}),
        ...(row.enforcement?.detection ? {note: row.enforcement.detection} : {}),
        ...(responses.length ? {responses} : {})};
}

/** Rows plus overlays by row id -> {statutes: validated table, skipped:[{skipped, why}], untyped:[row ids with no overlay]}. */
export function lawBookFromRows(rows, overlays) {
    const made = [], skipped = [], untyped = [];
    for(const row of rows) {
        const overlay = overlays[row.id];
        if(!overlay) { untyped.push(row.id); continue; }
        const s = statuteFromRow(row, overlay);
        (s.skipped ? skipped : made).push(s);
    }
    return {statutes: defineLawBook(made), skipped, untyped};
}
