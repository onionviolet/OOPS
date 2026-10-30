// Bridge: L10 learnView (ability_records.js) -> the abilities "Skills and techniques" tab rows (ABILITIES.md; same glance grammar as the ladder:
// rows with a stage word and, behind a click, the gates). Pure. A card the seat has not heard of has no row (ABR19), so an unmet teacher gate is never
// shown for it; `unstated` never leaves; `nextSignAt` (a hidden mastery threshold) leaves only when the world marks the ability understood (RA26).
const STAGE_WORD = Object.freeze({unlearned: 'Not learned', practicing: 'Practicing', castable: 'Ready to use'});

/**
 * views: [learnView(card, {facts})] results (nulls skipped). opts: labelOf(id) -> string | null (unlabelled cards are dropped),
 * known: Set of ids the seat has heard of, understood: Set of ids whose thresholds the seat understands (default none).
 */
export function skillsTabRows(views, {labelOf, known = new Set(), understood = new Set()} = {}) {
    return views.filter(v => v && known.has(v.id)).flatMap(v => {
        const label = labelOf(v.id);
        if (!label) return [];
        const practicing = v.stage === 'practicing';
        return [{id: v.id, label, stage: v.stage, stageWord: STAGE_WORD[v.stage] ?? v.stage, canLearn: v.canLearn,
            gates: v.gates.map(g => ({label: g.label, met: g.met})), refusedBy: v.refusedBy,
            progress: practicing ? {value: v.mastery, of: v.masteryNeeded} : null,
            practiceMinutes: v.practiceMinutes, sign: v.sign, ...(understood.has(v.id) && v.nextSignAt != null ? {nextSignAt: v.nextSignAt} : {})}];
    });
}
