// IM23 (itch.io wave, modeled on Talk of the Town's story recognition; ideas only, no source copied).
// Pure scan over saved chronicle facts. Stories are found, never scripted or stored; recaps may quote them.
// Thresholds sit in one salience table so a world can retune them.
export const STORY_SALIENCE = Object.freeze({
    rivalry: {grievance: 3, negativeAxis: -1, memoryPerGrievance: 1, minimum: 3},
    debt: {paidCoins: 1, minimum: 1}
});
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const grievanceMemories = r => r.memories.filter(m => /attack|assault|grievance|restitution/i.test(m.text)).length;
export function recognizeStories(state, table = STORY_SALIENCE) {
    const out = [], c = state?.chronicle;
    if(!object(c)) return out;
    for(const [id, r] of Object.entries(c.relationships || {})) {
        if(!object(r)) continue;
        const axes = Object.entries(r.axes || {}).filter(([, v]) => v <= table.rivalry.negativeAxis).map(([k]) => k);
        const score = (r.ties?.grievance ? table.rivalry.grievance : 0) + axes.length + grievanceMemories(r) * table.rivalry.memoryPerGrievance;
        if(score >= table.rivalry.minimum)
            out.push({kind: 'rivalry', with: id, salience: score, open: !!r.ties?.grievance,
                causes: [r.ties?.grievance && 'tie:grievance', ...axes.map(k => `axis:${k}`), ...r.memories.filter(m => /attack|assault|grievance/i.test(m.text)).map(m => `memory:${m.id}`)].filter(Boolean)});
    }
    const paid = c.life?.experience?.inheritance?.debtsPaid;
    if(Number.isSafeInteger(paid) && paid * table.debt.paidCoins >= table.debt.minimum)
        out.push({kind: 'debt', with: 'villageGuard', salience: paid * table.debt.paidCoins, open: false, causes: ['life.experience.inheritance.debtsPaid']});
    return out.sort((a, b) => b.salience - a.salience || a.kind.localeCompare(b.kind) || a.with.localeCompare(b.with));
}
