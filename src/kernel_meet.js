// Workings that meet (KB8; docs/KERNEL_WORKING_CONTRACT.md KW27-KW30). A hit
// lands before a killer move's last beat; a Counterspell ends a cast in
// flight. Several running workings settle in one fixed order, and after each
// settled step the caller's meets hook may interrupt others at that step's
// time. K orders steps and applies interrupts, nothing more: effects landing
// on whatever is present, and cascades, stay with W (WSC7-WSC9). Each record
// still saves alone. Imports only the kernel.
import {check, natural, object} from './basics.js';
import {interruptWorking, nextWorkingDeadline, settleWorking} from './kernel_working.js';

// KW28. The next step to settle: earliest deadline, then the order dial (a
// readiness, C's K4; lower goes first, default 0), then the working id.
function nextDue(entries, now) {
    let best = null;
    for (const [index, entry] of entries.entries()) {
        const at = nextWorkingDeadline(entry.record);
        if (at === null || at === undefined || at > now) continue;
        const key = [at, entry.order ?? 0, entry.record.id];
        if (!best || key[0] < best.key[0] || (key[0] === best.key[0] && (key[1] < best.key[1] ||
            (key[1] === best.key[1] && key[2] < best.key[2])))) best = {index, key};
    }
    return best?.index ?? null;
}

// KW27 and KW29. entries: [{law, record, order?}]. meets({settled, running})
// is called once per successfully settled step with that step's receipt and
// effects and the next step of every other running working, and returns
// [{working, reason, observed?}]. Interrupts apply at the settled step's time
// and do not call meets again (one level, no cascade). The same set settled to
// `now` once or in any partition gives the same records and effects.
export function settleTogether(entries, {now, ports = {}, meets}) {
    check(Array.isArray(entries) && entries.every(entry => object(entry?.law) && object(entry?.record)), 'Give each working with its law.');
    check(natural(now) && (meets === undefined || typeof meets === 'function'), 'Settle together at a whole minute.');
    const ids = new Set(entries.map(entry => entry.record.id));
    check(ids.size === entries.length, 'Each working in a meeting needs its own id.');
    const current = entries.map(entry => ({...entry, record: structuredClone(entry.record)}));
    const effects = [];
    for (let guard = 0; ; guard += 1) {
        check(guard <= current.reduce((n, entry) => n + entry.record.deadlines.length, 0), 'A meeting did not settle.');
        const index = nextDue(current, now);
        if (index === null) break;
        const entry = current[index];
        const before = entry.record.receipts.length;
        const step = settleWorking(entry.law, entry.record, {now, ports, maxSteps: 1});
        entry.record = step.record;
        effects.push(...step.effects);
        const receipt = entry.record.receipts[before];
        if (!meets || !receipt?.ok) continue;
        const running = current.filter(other => other !== entry && other.record.status === 'running').map(other => ({
            working: other.record.id, step: other.record.cursor, op: other.record.method.steps[other.record.cursor].op,
            at: nextWorkingDeadline(other.record), bindings: structuredClone(other.record.bindings)}));
        const answers = meets({settled: {working: entry.record.id, step: receipt.step, op: receipt.op, at: receipt.at,
            bindings: structuredClone(entry.record.bindings), effects: structuredClone(step.effects.map(row => row.effect))}, running});
        check(Array.isArray(answers ?? []), 'meets returns a list of interrupts.');
        for (const answer of answers ?? []) {
            const target = current.find(other => other.record.id === answer?.working);
            check(target && target !== entry && typeof answer.reason === 'string' && answer.reason.length,
                'An interrupt names another working in the meeting and a reason.');
            if (target.record.status !== 'running') continue;
            target.record = interruptWorking(target.record, {at: receipt.at, reason: answer.reason,
                by: {working: entry.record.id, step: receipt.step}, observed: answer.observed});
        }
    }
    return {records: current.map(entry => entry.record), effects};
}
