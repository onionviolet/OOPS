// Study view model (proposal, docs/representations/RESEARCH.md). A pure projection: the seat
// observer's own completed commands and knowledge, plus that seat's own pending jobs and powers,
// through the rows in research_content.js. It reads no situation record (their private truths stay
// sealed), saves nothing and grants nothing, so it needs no migration. Every number it shows is
// counted from live state; the row only supplies words and the ids to look up.
import {RESEARCH_PROJECTS} from './research_content.js';

export const STEP_STATE_WORDS = Object.freeze({done: 'Done', doing: 'In progress', ready: 'Ready', locked: 'Not yet'});
const STAGE_WORDS = {seen: 'Seen', understood: 'Understood', interpreted: 'Guessed'};
const KIND_WORDS = {evidence: 'Evidence', understanding: 'Understanding', practice: 'Practice'};
const MINUTES_PER_DAY = 1440;

export function whenText(at, clock) {
    if (!Number.isFinite(at)) return '';
    const days = Number.isFinite(clock) ? Math.floor(clock / MINUTES_PER_DAY) - Math.floor(at / MINUTES_PER_DAY) : 0;
    return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
}
const provenanceOf = entry => {
    const b = entry.basis;
    switch (b?.kind) {
        case 'observation': return 'You saw it';
        case 'instruction': return entry.stage === 'seen' ? 'You were shown' : 'You were taught';
        case 'inference': return 'You worked it out';
        case 'recollection': return 'You remember it';
    }
    return entry.stage === 'understood' ? 'You learned it' : 'You saw it';
};
const minutesText = m => m <= 0 ? '' : m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`;

function projectView(row, observer, state) {
    const knowledge = observer.knowledge(), clock = state?.clock, actor = observer.actorId;
    const jobs = (state?.simulation?.jobs || []).filter(j => j.actorId === actor);
    const power = state?.simulation?.powers?.[actor]?.[row.opens.power];
    const doneCount = id => Number(state?.actors?.[actor]?.completed?.[id]) || (observer.completed(id) ? 1 : 0);
    const byId = new Map(row.steps.map(s => [s.id, s]));
    const done = new Set(row.steps.filter(s => doneCount(s.command) > 0).map(s => s.id));
    const steps = row.steps.map(step => {
        const job = jobs.find(j => j.commandId === step.command);
        const blockers = step.after.filter(id => !done.has(id)).map(id => byId.get(id).label);
        const status = done.has(step.id) && !job ? 'done' : job ? 'doing' : blockers.length ? 'locked' : 'ready';
        const entry = step.finding ? knowledge[step.finding] : undefined;
        return {
            id: step.id, label: step.label, kind: step.kind, kindLabel: KIND_WORDS[step.kind], status, statusLabel: STEP_STATE_WORDS[status],
            minutes: step.minutes, left: job ? Math.max(0, job.due - (clock ?? job.due)) : null, times: doneCount(step.command), repeat: !!step.repeat,
            where: step.where, how: step.how, command: step.command, after: step.after.slice(),
            blocker: status === 'locked' ? `After: ${blockers.join(', ')}` : '',
            finding: entry ? {key: step.finding, stage: entry.stage, stageLabel: STAGE_WORDS[entry.stage] || 'Noted', text: entry.value, at: entry.at, when: whenText(entry.at, clock), provenance: provenanceOf(entry)} : null,
        };
    });
    // Levels: the highest one reached with every earlier level also reached (a level never skips).
    let reached = 0;
    while (reached + 1 < row.levels.length && row.levels[reached + 1].needs.every(id => done.has(id))) reached++;
    const level = row.levels[reached], next = row.levels[reached + 1] || null;
    const levels = row.levels.map((l, i) => ({id: l.id, label: l.label, means: l.means, state: i < reached ? 'done' : i === reached ? 'current' : 'pending'}));
    const understandSteps = steps.filter(s => s.kind !== 'practice'), practiceSteps = steps.filter(s => s.kind === 'practice');
    const bar = (list, word) => ({done: list.filter(s => s.status === 'done').length, total: list.length, label: word});
    const remaining = steps.filter(s => s.status !== 'done' && !(s.repeat && s.times > 0));
    const timed = remaining.reduce((sum, s) => sum + (s.status === 'doing' ? s.left : s.minutes), 0);
    const opened = !!power?.owned;
    const started = done.size > 0;
    const status = steps.some(s => s.status === 'doing') ? 'doing' : opened ? 'done' : started ? 'started' : 'available';
    const findings = steps.filter(s => s.finding).map(s => ({stepId: s.id, ...s.finding})).sort((a, b) => (a.at ?? 0) - (b.at ?? 0));
    const nextStep = steps.find(s => s.status === 'doing') || steps.find(s => s.status === 'ready' && !(s.repeat && s.times > 0));
    return {
        id: row.id, title: row.title, subject: row.subject, summary: row.summary, panel: row.panel, status,
        level: {id: level.id, label: level.label, means: level.means, index: reached, of: row.levels.length},
        next: next ? {label: next.label, changes: next.means, needs: next.needs.filter(id => !done.has(id)).map(id => byId.get(id).label)} : null,
        levels, steps, findings, nextStep: nextStep ? nextStep.id : null,
        understanding: bar(understandSteps, 'Understanding'), usability: bar(practiceSteps, 'Usable'),
        timeLeft: {minutes: timed, text: opened ? 'Finished' : timed > 0 ? `About ${minutesText(timed)} of timed work, plus asking` : remaining.length ? 'No timed work left, only asking' : 'Finished'},
        opens: {label: row.opens.label, how: row.opens.how, command: row.opens.command, state: opened ? 'open' : 'closed',
            used: doneCount(row.opens.command), gate: opened ? '' : next ? `Reach ${row.levels[row.levels.length - 1].label}` : 'Finish the last step'},
    };
}

const STATUS_ORDER = {doing: 0, started: 1, available: 2, done: 3};
const STATUS_WORDS = {doing: 'In progress', started: 'Started', available: 'Could study', done: 'Finished'};

/** observer: from observerView(state). Only this seat's world and this seat's own records. */
export function researchView(observer, state) {
    const projects = RESEARCH_PROJECTS.filter(row => !row.world || row.world === observer.worldId)
        .map(row => projectView(row, observer, state))
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    for (const p of projects) p.statusLabel = STATUS_WORDS[p.status];
    const count = s => projects.filter(p => p.status === s).length;
    const glance = projects.length ? [count('doing') + count('started') ? `${count('doing') + count('started')} under study` : '', count('available') ? `${count('available')} to begin` : '', count('done') ? `${count('done')} finished` : ''].filter(Boolean).join(', ') : '';
    return {projects, glance, empty: projects.length ? '' : 'Nothing here can be studied yet. Lessons, books and odd things you meet will appear here once you start on them.'};
}

/** One plain line per step: the text form the list shows and the map's description shares (UR37). */
export function stepLine(step) {
    const bits = [step.statusLabel, step.kindLabel];
    if (step.status === 'doing') bits.push(`${step.left} min left`);
    else if (step.minutes && step.status !== 'done') bits.push(`${step.minutes} min`);
    if (step.times > 1) bits.push(`done ${step.times} times`);
    return `${step.label} (${bits.join(', ')})${step.blocker ? `. ${step.blocker}` : ''}`;
}
export const findingLine = f => `${f.stageLabel}: ${f.text} (${f.provenance}${f.when ? `, ${f.when}` : ''})`;
export function projectLines(p) {
    return [`${p.title}: ${p.level.label} (${p.level.index + 1} of ${p.level.of}). ${p.timeLeft.text}.`,
        `Understanding ${p.understanding.done} of ${p.understanding.total}; usable ${p.usability.done} of ${p.usability.total}.`,
        ...p.steps.map(stepLine),
        p.next ? `Next level, ${p.next.label}: ${p.next.changes}` : 'Last level reached.',
        `Opens: ${p.opens.label} (${p.opens.state === 'open' ? 'open' : 'closed'}). ${p.opens.how}`];
}

// Figures (MDL2). The ladder is a track of levels; the map is the dependency graph of steps in columns by
// depth, ending in what the study opens. A graph fits "what needs what"; a ring or a bar would hide the order.
const NODE_STATE = {done: 'done', doing: 'current', ready: 'active', locked: 'pending'};
export function researchLadderSpec(p, {size = 720} = {}) {
    return {id: `research-ladder-${p.id}`, size, title: `${p.title}: how far you have got`, summary: p.level.means,
        tracks: [{id: 'levels', label: 'Understanding', steps: p.levels.map(l => ({label: l.label, state: l.state === 'current' ? 'current' : l.state, ...(l.state === 'current' ? {effect: 'pulse'} : {})}))}],
        notes: p.next ? [{text: `Next, ${p.next.label}: ${p.next.changes}`}] : [{state: 'done', text: 'Last level reached.'}]};
}
export function researchMapSpec(p, {size = 720} = {}) {
    const depth = new Map(); const byId = new Map(p.steps.map(s => [s.id, s]));
    const of = s => { if (!depth.has(s.id)) depth.set(s.id, s.after.length ? 1 + Math.max(...s.after.map(id => of(byId.get(id)))) : 0); return depth.get(s.id); };
    p.steps.forEach(of);
    const last = Math.max(...depth.values()) + 1, columns = new Map();
    for (const s of p.steps) columns.set(depth.get(s.id), [...(columns.get(depth.get(s.id)) || []), s]);
    // A lone node in a column alternates above and below the line so neighbouring labels never overlap.
    const at = (col, i, n) => [last ? -0.85 + 1.7 * col / last : 0, n <= 1 ? (col % 2 ? 0.22 : -0.22) : -0.6 + 1.2 * i / (n - 1)];
    const nodes = [];
    for (const [col, list] of columns) list.forEach((s, i) => nodes.push({id: s.id, label: s.label, state: NODE_STATE[s.status], at: at(col, i, list.length), ...(s.status === 'doing' ? {effect: 'pulse'} : s.status === 'ready' ? {effect: 'glow'} : {})}));
    nodes.push({id: 'opens', label: p.opens.label, glyph: '★', state: p.opens.state === 'open' ? 'filled' : 'empty', at: at(last, 0, 1), ...(p.opens.state === 'open' ? {effect: 'glow'} : {})});
    const dependents = new Set(p.steps.flatMap(s => s.after));
    const edges = [...p.steps.flatMap(s => s.after.map(from => ({from, to: s.id, kind: 'needs'}))),
        ...p.steps.filter(s => !dependents.has(s.id) && s.kind === 'practice').map(s => ({from: s.id, to: 'opens', kind: 'opens'}))];
    return {id: `research-map-${p.id}`, size, title: `What it takes: ${p.title}`, summary: 'Left to right: what has to come first. The star is what finishing opens.',
        nodes, edges, legend: [{state: 'done', label: 'finished'}, {state: 'current', label: 'doing now'}, {state: 'active', label: 'ready to start'}, {state: 'pending', label: 'waits on earlier steps'}, {state: 'filled', label: 'opened'}, {state: 'empty', label: 'still closed'}, {kind: 'needs', label: 'has to come first'}, {kind: 'opens', label: 'leads to what it opens'}]};
}
