// E2, PC95: the engine world's one owner of what holders know. A holder's
// records are this pack's state on that holder; each has a believed side and a
// true side (src/knowledge_record.js). Learning, teaching and checking arrive
// as effects in the holder's place, so the pack is the single writer.
// The mind owner keeps which records a mind holds (`mind_memory`): a new record
// is announced to it, and a record whose id leaves that set cannot be used.
import {object} from '../basics.js';
import {KNOWLEDGE_PACK, KNOWLEDGE_KINDS as K, checkedRecord, heldRecords, learnedRecord, taughtRecord} from '../knowledge_record.js';

const MEMORY = {id: 'mind_memory', type: 'set'};
const REMEMBER = 'effect.add.memory';

export function createKnowledgePack() {
    return {
        id: KNOWLEDGE_PACK, revision: 0, properties: [MEMORY], reads: [MEMORY.id], hears: Object.values(K), publishes: [REMEMBER],
        reactors: [{
            id: 'record', on: Object.values(K), appliesTo: holder => holder.kind !== 'place',
            react(view, id, effect) {
                const k = effect.detail?.knowledge;
                if (!object(k) || k.to !== id) return [];
                const records = view.state(id)?.records ?? {};
                let next;
                if (effect.kind === K.check) {
                    if (!records[k.record]) return [];
                    next = checkedRecord(records[k.record], k.check);
                } else {
                    const incoming = effect.kind === K.learn ? k.record
                        : taughtRecord(heldRecords(view.state(k.from)?.records, view.property(k.from, MEMORY.id)), k);
                    if (!incoming) return [];
                    next = learnedRecord(records[incoming.id], incoming);
                }
                const ops = [{op: 'state', holder: id, value: {records: {...records, [next.id]: next}}}];
                if (!records[next.id] && view.property(id, MEMORY.id)) ops.push({op: 'publish', kind: REMEMBER, place: view.placeOf(id), by: id,
                    detail: {owner: 'A', parts: {verb: 'add', object: 'memory', time: 'instant'},
                        application: {targets: [id], mind: {faculty: 'memory', record: next.id}}}});
                return ops;
            },
        }],
    };
}
