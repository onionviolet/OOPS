// Overlay small repair answers by stable ID, without editing original reader files.
import assert from 'node:assert/strict';
import {parseAnswer} from '../../../../../../scripts/lead_run/family_pass.mjs';
export function overlayAnswers(entries, answers, meta, repairs) {
    const byId = new Map(entries.map((e, i) => [e.id, i + 1]));
    const merged = new Map(answers), remaining = new Set(meta.unread), assigned = new Set();
    const reasons = {...meta.new_reasons};
    let pending = 0;
    for (const repair of repairs) {
        for (const e of repair.entries) {
            assert(byId.has(e.id) && !assigned.has(e.id), 'Foreign/duplicate repair ID');
            assert(!answers.has(byId.get(e.id)), 'Repair overlaps an original label');
            assigned.add(e.id); remaining.add(e.id);
        }
        if (repair.text === null) { pending++; continue; }
        const raw = repair.text.trimEnd().split('\n');
        assert(raw.at(-1)?.startsWith('{'), 'Repair needs final unread trailer');
        const trailer = JSON.parse(raw.pop());
        assert(Array.isArray(trailer.unread), 'Repair needs unread array');
        const skipped = new Set(trailer.unread);
        assert.equal(skipped.size, trailer.unread.length, 'Duplicate repair unread ID');
        const own = new Set(repair.entries.map(e => e.id));
        for (const id of skipped) assert(own.has(id), 'Foreign repair unread ID');
        const parsed = parseAnswer(raw.join('\n'));
        assert.equal(parsed.duplicates, 0, 'Duplicate repair n');
        assert.equal(parsed.malformed, 0, 'Malformed repair answer');
        for (const [n, code] of parsed.answers) {
            const e = repair.entries[n - 1];
            assert(e, 'Foreign repair n');
            assert(!skipped.has(e.id), 'Repair row labelled and unread');
            assert(!merged.has(byId.get(e.id)), 'Duplicate repair label');
            if (code.startsWith('NEW:')) {
                const reason = trailer.new_reasons?.[code];
                assert(typeof reason === 'string' && reason.trim().length >= 12, 'NEW needs reason');
            }
            merged.set(byId.get(e.id), code); remaining.delete(e.id);
        }
        repair.entries.forEach((e, i) => assert(parsed.answers.has(i + 1) || skipped.has(e.id), 'Silently missing repair row'));
        assert(new Set([...parsed.answers.values()].filter(c => c.startsWith('NEW:'))).size <= 8);
        Object.assign(reasons, trailer.new_reasons);
    }
    return {answers: merged, meta: {unread: [...remaining], new_reasons: reasons}, pending};
}
