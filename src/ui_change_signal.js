// UIX2 topic change signal (UIL2, 2026-10-18). State owners publish that something changed on a
// topic; readers subscribe by the topics their LAYOUT_SPEC surface declares in `reads` and re-read
// their owner when refreshed. Each reader refreshes at most once per batch (one microtask after the
// publishes that dirtied it), so a burst of changes in one task costs one refresh. Observe only:
// publishes carry no state, and nothing here mutates game state, saves or runs a clock (AR3).
// Legacy panels keep their own refresh; nothing is forced to migrate.
import {LAYOUT_SPEC} from './layout_spec.js';

export const TOPICS = Object.freeze(['inventory', 'place', 'time', 'body', 'knowledge', 'combat', 'world', 'work']);
const known = topic => { if (!TOPICS.includes(topic)) throw new TypeError(`Unknown change topic: ${topic}`); return topic; };
// A refresh that keeps publishing would otherwise loop inside one task; past this many chained
// batches the next one waits for a later task.
const MAX_CHAINED_BATCHES = 8;

export function createChangeSignal({schedule = queueMicrotask, later = run => setTimeout(run, 0), now = () => Date.now(), spec = LAYOUT_SPEC} = {}) {
    const readers = new Map(), topics = new Map(TOPICS.map(t => [t, {publishes: 0, last: null}]));
    const dirty = new Map();
    let queued = false, flushing = false, chained = 0, batches = 0;
    function flush() {
        queued = false; flushing = true; batches++;
        const due = [...dirty]; dirty.clear();
        for (const [reader, change] of due) {
            if (!readers.has(reader.id) || readers.get(reader.id) !== reader) continue;
            reader.refreshes++; reader.last = change;
            try { reader.refresh(change); } catch (error) { reader.error = String(error?.message || error); console.error(`Change reader ${reader.id} failed:`, error); }
        }
        flushing = false;
        // Publishes made by these refreshes wait for the next batch.
        if (dirty.size) { queued = true; if (++chained > MAX_CHAINED_BATCHES) { chained = 0; later(flush); } else schedule(flush); }
        else chained = 0;
    }
    // `source` names the owner (or legacy bridge) that saw the change, for the inspector only.
    function publish(topic, source = 'unknown') {
        const list = Array.isArray(topic) ? topic.map(known) : [known(topic)];
        const at = now();
        for (const t of list) {
            const entry = topics.get(t); entry.publishes++; entry.last = {source, at};
            for (const reader of readers.values()) if (reader.topics.includes(t) && !dirty.has(reader)) dirty.set(reader, {topic: t, source, at});
        }
        if (dirty.size && !queued && !flushing) { queued = true; schedule(flush); }
    }
    // Topics come from the reader's surface `reads` in the spec. `pending` names topics the reader
    // needs that the spec does not declare yet; the inspector lists them so the spec owner can add
    // them, and they still subscribe.
    function subscribe({id, surface = null, pending = [], refresh}) {
        if (!id || typeof refresh !== 'function') throw new TypeError('A change reader needs an id and a refresh function.');
        const entry = surface ? (spec.surfaces?.[surface] || spec.views?.[surface]) : null;
        const declared = Array.isArray(entry?.reads) ? entry.reads.map(known) : [];
        const extra = pending.map(known).filter(t => !declared.includes(t));
        const reader = {id, surface, declared, pending: extra, topics: [...declared, ...extra], refresh, refreshes: 0, last: null, error: null};
        if (!reader.topics.length) throw new TypeError(`Change reader ${id} reads no topics.`);
        readers.set(id, reader);
        return () => { if (readers.get(id) === reader) readers.delete(id); dirty.delete(reader); };
    }
    // A reader that still keeps a fallback poll for inputs with no publisher counts those passes here,
    // so the inspector shows its whole refresh cost.
    function countPoll(id) { const reader = readers.get(id); if (reader) reader.polls = (reader.polls || 0) + 1; }
    // UIX5 inspector: a read-only copy of who reads what and the last change that refreshed it.
    function inspect() {
        return {
            batches,
            readers: [...readers.values()].map(r => ({id: r.id, surface: r.surface, topics: [...r.topics], declared: [...r.declared], pending: [...r.pending],
                refreshes: r.refreshes, polls: r.polls || 0, last: r.last && {...r.last}, error: r.error})),
            topics: Object.fromEntries([...topics].map(([t, e]) => [t, {publishes: e.publishes, last: e.last && {...e.last}}])),
        };
    }
    return Object.freeze({publish, subscribe, inspect, countPoll});
}

export const changeSignal = createChangeSignal();
export const publishChange = changeSignal.publish;
export const subscribeChange = changeSignal.subscribe;

// A legacy-owned node whose contents are the reader's real input (for example the native action
// list behind Options' ready count) publishes `topic` when it mutates, until its owner publishes
// for itself. Mutations inside `ignore` (status text readers write back) are skipped so a reader
// cannot retrigger itself.
export function bridgeLegacyNode(node, topic, {source = `legacy:${node?.id || 'node'}`, ignore = 'summary', signal = changeSignal} = {}) {
    known(topic);
    if (!node || typeof MutationObserver === 'undefined') return () => {};
    const inside = n => (n?.nodeType === 1 ? n : n?.parentElement)?.closest?.(ignore);
    // Legacy owners often re-set an attribute to the value it already has; that is not a change.
    const changed = r => !inside(r.target) && (r.type !== 'attributes' || r.oldValue !== r.target.getAttribute(r.attributeName));
    const observer = new MutationObserver(records => { if (records.some(changed)) signal.publish(topic, source); });
    observer.observe(node, {subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ['disabled', 'hidden', 'style', 'class']});
    return () => observer.disconnect();
}

if (typeof window !== 'undefined') Object.defineProperty(window, 'yairpgChangeSignal', {value: Object.freeze({inspect: changeSignal.inspect, topics: TOPICS}), configurable: true});
