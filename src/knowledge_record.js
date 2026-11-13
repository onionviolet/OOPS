// The knowledge record (E2, GKM247-GKM250; proposal, design note
// docs/gm/dispatch/foundation-run-2026-11-12/W17_KNOWLEDGE_RECORD.md).
// One record per thing a holder knows, with two sides of the same shape:
//   true      what the record really is: the steps a holder carries out when he
//             follows it, or where the world keeps a fact's answer;
//   believed  what its holder takes it to be.
// A holder acts on the believed side: his quote binds it and reads the world
// through his own beliefs. Settlement binds the true side through composeWorking
// and the fillers' own laws, so nothing here decides an outcome. Checking,
// teaching and closing a condition are ordinary kernel workings with a price.
// Records live in the engine world as the n.knowledge pack's state
// (world_substrate_packs/knowledge.js is the one writer). The book of
// compositions and fillers is the caller's, like any law. Names no world.
import {check, natural, object, copy, deepFreeze, sameJson} from './basics.js';
import {defineWorkingLaw, quoteWorking, beginWorking} from './kernel_working.js';
import {composeWorking, composedPart, defineComposition} from './kernel_compose.js';
import {resolveRef} from './world_substrate.js';
import {speechObstruction} from './spell_effects.js';

export const KNOWLEDGE_PACK = 'n.knowledge';
export const KNOWLEDGE_KINDS = Object.freeze({learn: 'effect.add.information', teach: 'effect.copy.information', check: 'effect.sense.information'});
export const CONDITION_CLOSED = 'condition.closed';
export const EVIDENCE_KINDS = Object.freeze(['dry', 'trial', 'second', 'watch', 'look']);

const word = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x) && !['__proto__', 'constructor', 'prototype'].includes(x);
const fillerMap = x => object(x) && Object.entries(x).every(([slot, key]) => word(slot) && word(key));
const plain = v => typeof v === 'boolean' || typeof v === 'string' || Number.isSafeInteger(v) || (Array.isArray(v) && v.every(x => typeof x === 'string'));
const costRows = rows => Array.isArray(rows) && rows.every(object);
const owed = (rows, holder) => rows.map(row => ({holder, ...copy(row)}));
const isFact = record => record.subject.kind === 'fact';
const BASES = ['recollection', 'observation', 'instruction', 'inference'];
const FIELDS = ['id', 'subject', 'true', 'believed', 'source', 'doubts', 'checks'];

// A learner's record equals the truth unless something made it differ: with no
// believed side given, a composition record believes its own steps.
export function defineRecord(data) {
    check(object(data) && word(data.id) && object(data.subject) && ['composition', 'fact'].includes(data.subject.kind) && word(data.subject.id) &&
        Object.keys(data).every(key => FIELDS.includes(key)), 'A knowledge record names itself and a composition or a fact.');
    const fact = data.subject.kind === 'fact', t = data.true, b = data.believed ?? (fact ? null : {fillers: t?.fillers});
    if (fact) {
        check(object(t) && word(t.holder) && Object.keys(t).length === 2 && (word(t.quantity) || word(t.property)),
            'A fact record points at one quantity or property of a holder.');
        check(object(b) && plain(b.value), 'A fact record carries the value its holder believes.');
    } else {
        check(object(t) && fillerMap(t.fillers) && Object.keys(t.fillers).length > 0 && object(b) && fillerMap(b.fillers) &&
            (b.conditions ?? []).every(word), 'A composition record names a filler per slot on each side.');
    }
    // KNW2, KNW4: every record has a basis, in the four kinds the knowledge rules name.
    const source = data.source ?? {kind: 'recollection'};
    check(object(source) && BASES.includes(source.kind) && ['by', 'from'].every(k => source[k] === undefined || word(source[k])) &&
        (source.at === undefined || natural(source.at)), 'A record says where it came from.');
    check((data.doubts ?? []).every(word) && (data.checks ?? []).every(object), 'Invalid record doubts or checks.');
    return deepFreeze({id: data.id, subject: {kind: data.subject.kind, id: data.subject.id},
        true: fact ? copy(t) : {fillers: copy(t.fillers)},
        believed: fact ? {value: copy(b.value)} : {fillers: copy(b.fillers), conditions: [...new Set(b.conditions ?? [])].sort()},
        source: copy(source), doubts: [...new Set(data.doubts ?? [])].sort(), checks: copy(data.checks ?? [])});
}

// ---------- reading records out of the world ----------

// What a holder can use now. A holder with a memory set (the mind owner's
// `mind_memory`) holds a record while its id is in the set, so an effect that
// takes a memory takes the knowledge with it, and a lapsed one gives it back.
export const heldRecords = (records, memory) => Object.fromEntries(Object.entries(records ?? {}).filter(([id]) => !memory || memory.includes(id)));
export function recordsOf(world, holder) {
    const h = world.holders[holder];
    return heldRecords(h?.state[KNOWLEDGE_PACK]?.records, h?.properties.mind_memory);
}
// What a holder may be shown of his own record: everything but the true side.
export const viewRecord = ({true: _, ...seen}) => copy(seen);
export function factTruth(world, record) {
    const h = world.holders[record.true.holder];
    return (record.true.quantity ? h?.quantities[record.true.quantity] : h?.properties[record.true.property]) ?? null;
}

// The world as one holder knows it (KW17). `read` is the host's own reader.
// Default (a dial): he sees himself, his place and what is in it; anything
// farther he knows through a fact record or not at all. A belief about a thing
// stands over what he sees of it until he checks it.
export function believedRead(world, holder, read) {
    const self = world.holders[holder];
    check(self && typeof read === 'function', 'A believed reading needs a holder and the host reader.');
    const here = self.kind === 'place' ? self.id : self.place;
    const facts = Object.values(recordsOf(world, holder)).filter(isFact);
    return ref => {
        const thing = read(ref);
        if (!object(thing)) return null;
        const about = facts.filter(record => record.true.holder === thing.holder);
        const near = thing.holder === undefined || thing.holder === holder || thing.holder === here || thing.place === here;
        if (!near && !about.length) return null;
        const seen = near ? copy(thing) : {kind: thing.kind, id: thing.id, holder: thing.holder, place: thing.place, quantities: {}, properties: {}};
        for (const record of about) {
            const table = record.true.quantity ? 'quantities' : 'properties';
            (seen[table] ??= {})[record.true.quantity ?? record.true.property] = copy(record.believed.value);
        }
        return seen;
    };
}

// ---------- binding a side ----------

// A condition row on a filler: {id, kind, role, deny: {costs, minutes}, lapse?: {costs}, forgo?: {costs}}.
function conditionRow(row, filler) {
    check(object(row) && word(row.id) && word(row.kind) && filler.method.roles[row.role] !== undefined &&
        object(row.deny) && costRows(row.deny.costs) && natural(row.deny.minutes) && row.deny.minutes > 0 &&
        ['lapse', 'forgo'].every(k => row[k] === undefined || (object(row[k]) && costRows(row[k].costs))), `Invalid condition ${row?.id}.`);
    return row;
}

// The working one side of a record makes. A side may leave slots out (an
// incomplete manual, a withheld step): the working is composed from the slots
// it fills. `conditions` are the fillers' real rows; `listed` says whether the
// holder knows of each.
export function bindRecord(book, record, side = 'true') {
    check(!isFact(record) && ['true', 'believed'].includes(side), 'Bind the true or the believed side of a composition record.');
    const whole = book.compositions[record.subject.id];
    check(object(whole), `No composition ${record.subject.id}.`);
    const chosen = record[side].fillers;
    const slots = whole.slots.filter(slot => chosen[slot.name] !== undefined);
    check(slots.length === Object.keys(chosen).length, 'The record fills a slot the composition does not have.');
    const missing = whole.slots.filter(slot => !slots.includes(slot)).map(slot => slot.name);
    const composition = missing.length ? defineComposition({...copy(whole), slots: copy(slots)}) : whole;
    const fillers = {}, conditions = [];
    for (const slot of slots) {
        const filler = book.fillers[chosen[slot.name]];
        check(object(filler), `No filler ${chosen[slot.name]}.`);
        fillers[slot.name] = filler;
        for (const row of filler.conditions ?? []) conditions.push({...copy(conditionRow(row, filler)), slot: slot.name,
            role: slot.bindings[row.role], listed: record.believed.conditions.includes(row.id)});
    }
    return {...composeWorking(composition, fillers), conditions, missing};
}

// The kernel authority (KW35) for a bound side's conditions. A closure is a law
// field on the holder (`condition.closed`, with its own `until`), so the
// substrate ends it. A step whose condition is closed for the bound holder is
// refused with the lapse price; `forgo` lists conditions the user pays to skip.
export function conditionAuthority(world, conditions, {forgo = [], inner} = {}) {
    return request => {
        let answer = inner ? inner(request) : {ok: true};
        if (!answer.ok) return answer;
        const slot = composedPart(request.op);
        for (const row of conditions) {
            const who = resolveRef(world, request.bindings[row.role]);
            if (row.slot !== slot || !world.laws.some(f => f.kind === CONDITION_CLOSED && f.scope === who && f.params.condition === row.id)) continue;
            if (row.forgo && forgo.includes(row.id)) {
                answer = {...answer, costs: [...(answer.costs ?? []), ...owed(row.forgo.costs, who)], cause: 'condition-forgone'};
                continue;
            }
            return {ok: false, reason: 'condition-denied', cause: row.id, observed: {condition: row.id},
                ...(row.lapse ? {costs: owed(row.lapse.costs, who)} : {})};
        }
        return answer;
    };
}

// What the holder is shown before he acts: the believed side, read through his
// beliefs, refused by the closures he knows of. It never binds the true side,
// so a quote cannot give away what a check is priced to find.
export function quoteRecord(book, world, holder, recordId, {id, bindings, facts = {}, at = world.clock, read, forgo}) {
    const record = recordsOf(world, holder)[recordId];
    if (!record) return {ok: false, reason: 'record-unknown'};
    const bound = bindRecord(book, record, 'believed');
    return quoteWorking(bound.law, bound.method, {id, bindings, facts, at, ports: {read: believedRead(world, holder, read),
        authority: conditionAuthority(world, bound.conditions.filter(row => row.listed), {forgo})}});
}

// What happens: the true side, begun as an ordinary working. The host settles
// it with its own reader and `conditionAuthority(world, bound.conditions)`.
export function beginRecord(book, world, holder, recordId, {id, bindings, facts = {}, at = world.clock}) {
    const record = recordsOf(world, holder)[recordId];
    check(record, `${holder} holds no record ${recordId}.`);
    const bound = bindRecord(book, record, 'true');
    return {bound, working: beginWorking(bound.law, bound.method, {id, bindings, facts, at})};
}

// What a failed working turned back on its user: the costs its failed step charged (KW15).
export function backlashOf(working) {
    const last = working.receipts.at(-1);
    return working.status === 'interrupted' && last && !last.ok ? copy(last.truth.costs ?? []) : [];
}

// ---------- the truth side of a check ----------

// Every place the believed side departs from the true one. Not for the holder's
// eyes: a check hands him the part of it he found.
export function recordGaps(book, world, record) {
    if (isFact(record)) {
        const is = factTruth(world, record);
        return sameJson(is, record.believed.value) ? [] : [{kind: 'value', is}];
    }
    const t = record.true.fillers, b = record.believed.fillers, gaps = [];
    for (const slot of [...new Set([...Object.keys(t), ...Object.keys(b)])].sort())
        if (t[slot] !== b[slot]) gaps.push({slot, kind: 'step', is: t[slot] ?? null});
    for (const row of bindRecord(book, record, 'true').conditions)
        if (!row.listed) gaps.push({slot: row.slot, kind: 'condition', condition: row.id, is: t[row.slot]});
    return gaps;
}

const differences = (mine, theirs, other, slots) => isFact(mine)
    ? sameJson(mine.believed.value, theirs.believed.value) ? [] : [{kind: 'differs', other}]
    : [...new Set([...Object.keys(mine.true.fillers), ...Object.keys(theirs.true.fillers)])].sort()
        .filter(slot => (!slots || slots.includes(slot)) && mine.true.fillers[slot] !== theirs.true.fillers[slot])
        .map(slot => ({slot, kind: 'differs', other}));

// What one piece of evidence shows of a record. Each kind sees its own part:
//   dry     the method worked through in the head, against what the holder
//           believes of the world: a step that would fail, a step that is absent
//           or extra, a condition written into a step. A step that runs and
//           makes something else passes.
//   trial   a use that really happened (`working`) beside what was promised
//           (`promise`, the quote shown before it): the step that failed, the
//           condition that bit, or, when the result differs, the wrong steps.
//   second  another holder's record of the same subject: where the two differ,
//           with which one is right left open.
//   watch   the same, for the steps another holder was seen to carry out.
//   look    going to see: a fact's value.
function seenBy(book, world, record, evidence, read) {
    const gaps = recordGaps(book, world, record);
    const other = () => {
        const theirs = recordsOf(world, evidence.other?.holder)[evidence.other?.record];
        check(theirs && sameJson(theirs.subject, record.subject), 'Compare two records of the same subject.');
        return theirs;
    };
    switch (evidence.kind) {
    case 'look': return gaps.filter(gap => gap.kind === 'value');
    case 'second': return differences(record, other(), evidence.other.holder);
    case 'watch': return differences(record, other(), evidence.other.holder,
        evidence.working.receipts.filter(row => row.ok).map(row => composedPart(row.op)));
    case 'dry': {
        if (isFact(record)) return [];
        const bound = bindRecord(book, record, 'true');
        const quote = quoteWorking(bound.law, bound.method, {id: evidence.id, bindings: evidence.scene.bindings, facts: evidence.scene.facts ?? {},
            at: world.clock, ports: {read: believedRead(world, evidence.holder, read)}});
        const failing = quote.ok ? null : composedPart(quote.steps.at(-1).op);
        const seen = gaps.filter(gap => gap.kind === 'condition' || gap.slot === failing || gap.is === null || !(gap.slot in record.believed.fillers))
            .map(gap => gap.slot === failing && gap.kind === 'step' ? {...gap, reason: quote.reason} : gap);
        if (failing && !seen.some(gap => gap.slot === failing && gap.kind === 'step')) seen.push({slot: failing, kind: 'fails', reason: quote.reason});
        return seen;
    }
    default: { // trial
        const {working, promise} = evidence, last = working.receipts.at(-1);
        if (working.status === 'interrupted' && last && !last.ok) {
            const slot = composedPart(last.op);
            if (last.reason === 'condition-denied') return gaps.filter(gap => gap.kind === 'condition' && gap.condition === last.truth.cause);
            const here = gaps.filter(gap => gap.kind === 'step' && gap.slot === slot).map(gap => ({...gap, reason: last.reason}));
            return here.length ? here : [{slot, kind: 'fails', reason: last.reason}];
        }
        const same = sameJson(working.facts, promise.facts) && sameJson(working.receipts.flatMap(row => row.truth.effects), promise.effects);
        return same ? [] : gaps.filter(gap => gap.kind === 'step');
    }
    }
}

// What a found thing does to the record: belief moves to the truth where the
// truth was seen, and to doubt where two sources only disagreed.
export function checkedRecord(record, row) {
    const next = copy(record), doubts = new Set(next.doubts);
    for (const found of row.found) {
        if (found.kind === 'value') { next.believed.value = copy(found.is); doubts.delete('value'); }
        if (found.kind === 'differs') doubts.add(found.slot ?? 'value');
        if (found.kind === 'step' || found.kind === 'condition') {
            if (found.is === null) delete next.believed.fillers[found.slot]; else next.believed.fillers[found.slot] = found.is;
            doubts.delete(found.slot);
        }
        if (found.kind === 'condition') next.believed.conditions.push(found.condition);
    }
    return defineRecord({...next, doubts: [...doubts], checks: [...next.checks, copy(row)]});
}

// A record arriving where one of the same id is held fills what the first
// leaves out; the first keeps its own steps (two halves of an inheritance, a
// withheld last step supplied later). Two tellings of a fact that disagree
// leave the first belief standing, in doubt.
export function learnedRecord(held, incoming) {
    const next = defineRecord(incoming);
    if (!held) return next;
    check(sameJson(held.subject, next.subject), `Record ${next.id} is already about something else.`);
    if (isFact(held)) return sameJson(held.believed.value, next.believed.value) ? held : defineRecord({...copy(held), doubts: [...held.doubts, 'value']});
    return defineRecord({...copy(held), true: {fillers: {...next.true.fillers, ...held.true.fillers}},
        believed: {fillers: {...next.believed.fillers, ...held.believed.fillers}, conditions: [...held.believed.conditions, ...next.believed.conditions]}});
}

// Teaching (GKM249). The thing itself travels as the student's true side, and
// the teacher chooses what it is taken to be:
//   side   'true' (default) hands over the record as it is, flaws and
//          improvements the teacher does not know of included; 'believed'
//          retells it from the teacher's understanding, so the student gets
//          what the teacher thinks it is.
//   cover  another of the teacher's records, whose believed side is presented
//          as what this one is. Without it the teacher's own belief travels.
//   slots  the steps taught; the rest are withheld.
//   say    for a fact, the value told (a rumour or a lie); default his belief.
export function taughtRecord(theirs, {record, cover: label, as = record, slots, side = 'true', say, from, at}) {
    const src = theirs[record], cover = label === undefined ? src : theirs[label];
    if (!src || !cover || !sameJson(src.subject, cover.subject)) return null;
    const source = {by: from, kind: 'instruction', from: record, ...(at === undefined ? {} : {at})};
    if (isFact(src)) return defineRecord({id: as, subject: src.subject, true: src.true, believed: {value: say ?? cover.believed.value}, source});
    const pick = fillers => Object.fromEntries(Object.entries(fillers).filter(([slot]) => !slots || slots.includes(slot)));
    return defineRecord({id: as, subject: src.subject, true: {fillers: pick(src[side].fillers)},
        believed: {fillers: label === undefined ? pick(src.believed.fillers) : cover.believed.fillers, conditions: cover.believed.conditions}, source});
}

// ---------- knowing as work ----------

// Whole permille from an address, so one check gives one result however the
// clock was cut and after any restore. `seed` is a world dial.
export function knowledgeDraw(address) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < address.length; i += 1) hash = Math.imul(hash ^ address.charCodeAt(i), 0x01000193) >>> 0;
    return hash % 1000;
}

const publish = (kind, mind, knowledge) => ({op: 'publish', kind, place: mind.place, by: knowledge.from ?? mind.id, detail: {owner: 'N', knowledge}});

// Checking, teaching and closing a condition, as kernel operations. Each
// publishes its price as cost rows (KW15) and changes records through the pack.
export const KNOWLEDGE_LAW = defineWorkingLaw({id: KNOWLEDGE_PACK, revision: 1, operations: {
    answer: {roles: {speaker: 'body', listener: 'body'}, settle({bound: {speaker, listener}, options, at}) {
        if (!speaker.holder || !listener.holder || !speaker.place || speaker.place !== listener.place || speaker.holder === listener.holder)
            return {ok: false, reason: 'conversation-out-of-reach'};
        if (speaker.properties.mind_awake !== true || speechObstruction(speaker.properties, speaker.voiceBlocked))
            return {ok: false, reason: 'speaker-cannot-answer'};
        const {record, willing = false, opportunity} = options;
        const known = Object.hasOwn(speaker.records ?? {}, record) && speaker.records[record];
        const compelled = speaker.properties.mind_compelled_disclosure === true &&
            speaker.properties.mind_disclosure_protected !== true;
        const disclosed = known?.subject?.kind === 'fact' && (willing === true || compelled);
        let chance = {};
        if (disclosed && opportunity && !compelled) {
            const {action, odds, effort} = opportunity;
            check(word(action) && natural(odds) && odds <= 1000 && natural(effort), 'Invalid disclosure opportunity.');
            const bonus = (listener.workingLuck ?? []).reduce((best, field) =>
                field.action === action && natural(field.bonus) ? Math.max(best, field.bonus) : best, 0);
            chance = {odds: odds === 0 ? 0 : Math.min(1000, odds + bonus), miss: {observed: {disclosed: false}},
                costs: effort ? [{quantity: 'stamina', amount: effort, payer: listener.holder}] : []};
        }
        return {ok: true, ...chance, observed: {disclosed}, effects: disclosed ?
            [publish(KNOWLEDGE_KINDS.teach, listener, {from: speaker.holder, to: listener.holder, record, at})] : []};
    }},
    // GKM248. Each thing the evidence shows is missed on its own draw. The
    // holder sees `observed.found`; what he missed stays in the truth.
    check: {roles: {checker: 'mind', evidence: 'evidence'}, settle({bound, options, at, address}) {
        const {checker, evidence} = bound, {record, route, seed = 0} = options;
        if (!checker.records[record]) return {ok: false, reason: 'record-unknown'};
        if (evidence.holder !== checker.id || evidence.record !== record || evidence.route !== route.kind) return {ok: false, reason: 'evidence-unfit'};
        const found = [], missed = [];
        for (const row of evidence.seen)
            (knowledgeDraw([seed, address, row.slot ?? '', row.kind, row.condition ?? ''].join('/')) < route.missPermille ? missed : found).push(row);
        const row = {id: address, route: route.id, kind: route.kind, at, found};
        return {ok: true, costs: owed(route.costs, checker.id), facts: {missed}, observed: {found: copy(found)},
            effects: [publish(KNOWLEDGE_KINDS.check, checker, {to: checker.id, record, check: row})]};
    }},
    teach: {roles: {teacher: 'mind', student: 'mind'}, settle({bound, options, at}) {
        const {teacher, student} = bound, {costs = [], ...lesson} = options;
        if (!taughtRecord(teacher.records, {...lesson, from: teacher.id})) return {ok: false, reason: 'record-unknown'};
        return {ok: true, costs: owed(costs, teacher.id),
            effects: [publish(KNOWLEDGE_KINDS.teach, student, {...lesson, from: teacher.id, to: student.id, at})]};
    }},
    // GKM250. Closing a condition for one holder costs the closer for as long
    // as it lasts. He has to know of the condition: some record of his lists it.
    close: {roles: {closer: 'mind', target: 'mind'}, settle({bound, options, at}) {
        const {closer, target} = bound, {condition, minutes, costs} = options;
        if (!Object.values(closer.records).some(record => !isFact(record) && record.believed.conditions.includes(condition)))
            return {ok: false, reason: 'condition-unknown'};
        return {ok: true, costs: owed(costs, closer.id), effects: [{op: 'law_add', field: {id: `closed.${target.id}.${condition}.${at}`,
            scope: target.id, kind: CONDITION_CLOSED, params: {condition, by: closer.id}, until: at + minutes}}]};
    }},
}});

const method = (id, op, roles, minutes, options) => ({id, revision: 1, law: KNOWLEDGE_LAW.ref,
    roles: Object.fromEntries(roles.map(role => [role, role === 'evidence' ? 'evidence' : 'mind'])),
    steps: [{op, bindings: Object.fromEntries(roles.map(role => [role, role])), minutes, options}]});

// A check route is world data: {id, kind (an evidence kind), costs, minutes, missPermille}.
export function checkMethod(route, {record, seed = 0}) {
    check(object(route) && word(route.id) && EVIDENCE_KINDS.includes(route.kind) && costRows(route.costs) && natural(route.minutes) &&
        natural(route.missPermille) && route.missPermille <= 1000 && word(record) && natural(seed), 'A check route needs a kind, a price, minutes and a miss rate.');
    return method(route.id, 'check', ['checker', 'evidence'], route.minutes,
        {record, seed, route: {id: route.id, kind: route.kind, costs: copy(route.costs), missPermille: route.missPermille}});
}
// A lesson is world data: {id, minutes, costs}. `what` is {record, cover?, as?, slots?, side?, say?}.
export function teachMethod(lesson, what) {
    check(object(lesson) && word(lesson.id) && natural(lesson.minutes) && costRows(lesson.costs) && object(what) && word(what.record) &&
        ['true', 'believed', undefined].includes(what.side), 'A lesson needs a price, minutes and a record to teach.');
    return method(lesson.id, 'teach', ['teacher', 'student'], lesson.minutes, {...copy(what), costs: copy(lesson.costs)});
}
// The closing act is instant; `deny.minutes` is how long the closure lasts.
export function closeMethod(condition) {
    conditionRow(condition, {method: {roles: {[condition?.role]: true}}});
    return method(`close.${condition.id}`, 'close', ['closer', 'target'], 0,
        {condition: condition.id, minutes: condition.deny.minutes, costs: copy(condition.deny.costs)});
}

// The reader for KNOWLEDGE_LAW's roles. A mind is a holder bindable as one
// (SC7) with the records it holds now. `evidence` is keyed by the bound id:
// {kind, holder, record, scene? | working?, promise? | other?: {holder, record}};
// what it shows is worked out here, at the step's own minute.
export function knowledgeRead(world, {book, read, evidence = {}} = {}) {
    return ref => {
        if (ref.kind === 'evidence') {
            const row = evidence[ref.id];
            if (!object(row) || !EVIDENCE_KINDS.includes(row.kind)) return null;
            const record = recordsOf(world, row.holder)[row.record];
            return {kind: 'evidence', id: ref.id, holder: row.holder, record: row.record, route: row.kind,
                seen: record ? seenBy(book, world, record, {...row, id: ref.id}, read) : []};
        }
        const id = ref.kind === 'mind' ? resolveRef(world, ref) : null;
        const holder = id && world.holders[id];
        return holder ? {kind: 'mind', id, place: holder.kind === 'place' ? id : holder.place, records: copy(recordsOf(world, id))} : null;
    };
}
