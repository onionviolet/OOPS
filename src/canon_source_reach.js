// A life that has played the book's text through a passage has met the canon scenes inside it.
// Pure projection of the completed-act ledger against source locators: no state, no clock (AR3).
// Default: a canon beat whose zh chapter/paragraph the lead's finished acts have read past counts as
// met, so it no longer reserves time. Dial: pack.leadLife.sourceReach.chapterOffset (zh chapter minus
// en chapter, default 0); pack.leadLife.sourceReach.enabled=false restores the clock-only reading.
const PASSAGE = /ch(\d+)|P(\d+)(?:\s*-\s*P?(\d+))?/g;
// Furthest [chapter, paragraph] an act locator reaches; continuity notes are earlier text, not progress.
export function locatorReach(locator) {
    const text = String(locator ?? '').split(/continuity/i)[0];
    let chapter = null, best = null;
    for (const m of text.matchAll(PASSAGE)) {
        if (m[1] !== undefined) { chapter = Number(m[1]); continue; }
        if (chapter === null) continue;
        const at = [chapter, Math.max(Number(m[2]), Number(m[3] ?? 0))];
        if (!best || at[0] > best[0] || (at[0] === best[0] && at[1] > best[1])) best = at;
    }
    return best;
}
export const beatPassage = locator => {
    const m = /第(\d+)章\s*p(\d+)/.exec(String(locator ?? ''));
    return m ? [Number(m[1]), Number(m[2])] : null;
};
const reaches = (reach, at) => reach[0] > at[0] || (reach[0] === at[0] && reach[1] >= at[1]);
// Ids of beats whose passage the finished acts have reached. `completed` is actors.<id>.completed.
export function sourceCoveredBeats(beats, acts, completed, {chapterOffset = 0, enabled = true} = {}) {
    if (!enabled || !completed) return new Set();
    let reach = null;
    for (const act of acts || []) {
        if (!completed[act.id]) continue;
        const at = locatorReach(act.locator);
        if (at && (!reach || at[0] > reach[0] || (at[0] === reach[0] && at[1] > reach[1]))) reach = at;
    }
    if (!reach) return new Set();
    return new Set((beats || []).filter(b => {
        const at = beatPassage(b.locator);
        return at && reaches(reach, [at[0] - chapterOffset, at[1]]);
    }).map(b => b.id));
}
