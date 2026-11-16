// The layout grows with the life (round 21, PS216/PS275; proposal, ?variant=ps216 only). gridTemplate already folds a
// column whose regions are all empty (PS99); under the variant the Journal and Reports columns also count as empty
// until the life gives them something, so a new life starts on You and the place and each column opens when it gets
// content. A Village life starts with its opening quest and two Reports lines (the quest and the name hint, besides the
// date stamp), so the Journal opens on a second quest or the first skill and Reports on its first line past those.
// Once open, a column stays open for this sitting. Display only: nothing is stored in the save, and without the
// variant `empty` passes through unchanged. Prototype limit: another world's opening may start with other counts.
const SETTLE_MS = 2400;
export const OPENING = Object.freeze({quests: 1, reports: 2});
const opened = new Set();

const questCount = doc => [...(doc.getElementById('quests_box_div')?.children || [])].filter(n => n.textContent.trim() && !/^=.*=$/.test(n.textContent.trim())).length;
const reportCount = doc => doc.querySelectorAll('#message_box_div > .message_common:not(.message_notification)').length;

/** Pure: which columns open now, and why. */
export function columnsToOpen(now, opening = OPENING) {
    const out = {};
    if (now.skills > 0) out.journal = 'First skill';
    else if (now.quests > opening.quests) out.journal = 'A new quest';
    if (now.reports > opening.reports) out.log = 'First report';
    return out;
}

function mark(doc, id, because) {
    const region = doc.querySelector(`[data-region="${id}"]`); if (!region) return;
    region.dataset.regionOpened = 'new';
    const heads = [...region.querySelectorAll(':scope > .workspace-module .workspace-module-header > strong')];
    for (const h of heads) h.dataset.openedBecause = because;
    setTimeout(() => { region.dataset.regionOpened = 'open'; for (const h of heads) delete h.dataset.openedBecause; }, SETTLE_MS);
}

/** Widen gridTemplate's `empty` under ?variant=ps216; otherwise return it unchanged. */
export function growEmpty(empty, doc = globalThis.document) {
    if (!doc || doc.documentElement.dataset.variant !== 'ps216') return empty;
    const open = columnsToOpen({quests: questCount(doc), reports: reportCount(doc), skills: doc.querySelectorAll('.skill_div').length}), out = [...empty];
    for (const id of ['journal', 'log']) {
        if (opened.has(id)) continue;
        if (open[id]) { opened.add(id); mark(doc, id, open[id]); } else if (!out.includes(id)) out.push(id);
    }
    return out;
}
