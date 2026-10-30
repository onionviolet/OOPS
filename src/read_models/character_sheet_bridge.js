// Bridge: L8 dated sheet (character_sheets.js sheetAsOf) + L11 persona standing -> rep-character-sheet `subject`
// (claude/rep-character-sheet, character_sheet.js header and CHARACTER_SHEET.md "Dated sheets"). Pure; the rep view decides what a read reveals.
// Observer rules: the gated `hidden` count never leaves (CS6h, ABR19). For the sheet's own person the actual view is used.
// For anyone else the `shown` view wins wherever it exists, `actual` appears only where nothing is shown in that field, and
// `believed` entries appear only when `by` is this observer, marked `guess: true`.
import {attitudeOf} from '../persona_standing.js';

const humanize = id => String(id).split(/[.:]/).pop().replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
const strings = list => (Array.isArray(list) ? list : []).filter(s => typeof s === 'string' && s);

/**
 * The entries an observer may see for one list field, each tagged guess when believed. A field the person displays anything on is
 * seen through that display only (shown wins as a whole); actual entries reach another observer only when nothing is shown for the field.
 */
function visible(field, bucket, {self, observerId}) {
    if (self) return bucket.actual.map(e => ({e, guess: false}));
    const base = bucket.shown.length ? bucket.shown : bucket.actual;
    const believed = bucket.believed.filter(e => e.by === observerId).map(e => ({e, guess: true}));
    return [...base.map(e => ({e, guess: false})), ...believed];
}

/**
 * sheet: sheetAsOf() output. options: {observerId, subjectId (defaults to sheet.id), abilityLabels: {ruleId: label},
 * powerStrength: ({path, level}) => number (world dial for a descending scale like Sequences; without it the level is words), standing: rows from standingRows()}.
 */
export function subjectFromDatedSheet(sheet, {observerId = null, subjectId, abilityLabels = {}, powerStrength = null, standing = []} = {}) {
    if (!sheet) return null;
    const self = observerId !== null && observerId === sheet.id, ctx = {self, observerId};
    const rows = field => visible(field, sheet[field], ctx);
    const ids = rows('identities'), named = ids.filter(({e}) => ['legal', 'alias'].includes(e.v.kind)), faces = ids.filter(({e}) => e.v.kind === 'persona');
    // Self: the legal name. Others: a displayed name, else the displayed persona, else a name this observer merely believes.
    const name = (self ? named.find(({e}) => e.v.kind === 'legal') : [...named.filter(x => !x.guess), ...faces.filter(x => !x.guess), ...named, ...faces][0])?.e.v.name ?? (self ? sheet.id : 'Unknown person');
    const power = rows('power').at(-1)?.e.v ?? null;
    const subject = {id: subjectId ?? sheet.id, name, kind: '', appearance: [],
        stats: rows('stats').map(({e, guess}) => ({id: e.v.axis, label: humanize(e.v.axis), value: e.v.band, desc: 'On the world\'s 0 to 9 scale.', ...(guess ? {guess} : {})})),
        abilities: rows('abilities').map(({e, guess}) => {
            const bits = [...strings(e.v.conditions), ...strings(e.v.costs).map(c => `Costs ${c}`), ...strings(e.v.limits)];
            return {id: e.v.rule, label: abilityLabels[e.v.rule] ?? humanize(e.v.rule), ...(bits.length ? {desc: bits.join('; ')} : {}), ...(guess ? {guess} : {})};
        }),
        conditions: rows('condition').map(({e, guess}) => ({id: e.v.state, label: humanize(e.v.state), ...(e.v.severity != null ? {value: String(e.v.severity)} : {}), ...(guess ? {guess} : {})})),
        gear: rows('held').map(({e, guess}) => ({id: e.v.item, label: humanize(e.v.item), value: e.v.kind ?? '', ...(e.v.where ? {desc: e.v.where} : {}), ...(guess ? {guess} : {})})),
        traits: [], standing: [...rows('identities').filter(({e}) => ['persona', 'title'].includes(e.v.kind)).map(({e, guess}) => ({id: `id:${e.v.name}`, label: humanize(e.v.kind), value: e.v.name, public: !guess && sheet.identities.shown.includes(e), ...(guess ? {guess} : {})})),
            ...rows('affiliation').map(({e, guess}) => ({id: `org:${e.v.org}`, label: humanize(e.v.org), value: [e.v.rank, e.v.role].filter(Boolean).join(' · '), public: sheet.affiliation.shown.includes(e), ...(guess ? {guess} : {})})),
            ...standing],
        ties: [], history: [], intent: [], between: []};
    if (power) {
        const words = power.title ?? [humanize(power.path), power.level].filter(v => v !== undefined && v !== '').join(' ');
        if (typeof powerStrength === 'function') { subject.level = {value: powerStrength(power), text: words}; subject.rank = subject.level.value; }
        else subject.level = words;
    }
    return subject;
}

/**
 * Persona standing rows (L11 persona_standing.js attitudeOf). personaState: {personas}; regions: {regionId: label}.
 * knowsLink: this observer knows the persona is the body (then the body's own standing counts, via bodyStanding).
 */
export function standingRows(personaState, personaIds = [], regions = {}, {knowsLink = false, bodyStanding = {}} = {}) {
    return personaIds.filter(pid => personaState?.personas?.[pid]).flatMap(pid => Object.entries(regions).map(([region, label]) => {
        const a = attitudeOf(personaState, pid, region, {knowsLink, bodyStanding});
        return {id: `standing:${pid}:${region}`, label: `${label}`, value: a.name ?? String(a.id ?? ''), desc: a.basis, public: true};
    }));
}
