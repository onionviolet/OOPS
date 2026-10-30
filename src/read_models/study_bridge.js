// Bridge: L10 learnView (ability_records.js) -> the project shape research_view.js figures and text lines read (researchLadderSpec,
// researchMapSpec, projectLines): learning an ability is a study in progress. Pure and world-neutral: stages become levels, gates become evidence
// steps, learning and practice become the next steps. A card the seat has not heard of has no project (ABR19); `unstated` and `nextSignAt` never leave.
const KIND = {evidence: 'Evidence', understanding: 'Understanding', practice: 'Practice'};
const STATUS = {done: 'Done', doing: 'In progress', ready: 'Ready', locked: 'Not yet'};
const LEVELS = [['unlearned', 'Not learned', 'You have not learned it yet.'], ['practicing', 'Practicing', 'You know how, and are building the skill.'], ['castable', 'Ready to use', 'You can use it when you choose.']];
const bar = (list, label) => ({done: list.filter(s => s.status === 'done').length, total: list.length, label});

/** view: learnView(card, {facts}) result. opts: label (the ability's name), opensLabel, known: Set of ids the seat has heard of. Returns null when unknown. */
export function studyProjectFromLearn(view, {label, opensLabel = 'Use it', known = new Set()} = {}) {
    if(!view || !label || !known.has(view.id)) return null;
    const stageIdx = LEVELS.findIndex(l => l[0] === view.stage), owned = view.stage !== 'unlearned', ready = view.stage === 'castable';
    const mk = (id, text, kind, status, after, extra = {}) => ({id, label: text, kind, kindLabel: KIND[kind], status, statusLabel: STATUS[status], minutes: 0, left: null,
        times: status === 'done' ? 1 : 0, repeat: false, after, blocker: '', command: null, ...extra});
    const gates = view.gates.map((g, i) => mk(`gate-${i}`, g.label, 'evidence', g.met || owned ? 'done' : 'ready', []));
    const learnStatus = owned ? 'done' : view.canLearn ? 'ready' : 'locked';
    const unmet = view.gates.filter(g => !g.met).map(g => g.label);
    const learn = mk('learn', `Learn ${label}`, 'understanding', learnStatus, gates.map(g => g.id), {blocker: learnStatus === 'locked' ? `After: ${unmet.join(', ')}` : ''});
    const doing = view.stage === 'practicing';
    const practice = mk('practice', `Practise ${label}`, 'practice', ready ? 'done' : doing ? 'doing' : 'locked', ['learn'],
        {minutes: view.practiceMinutes ?? 0, left: doing ? view.practiceMinutes ?? 0 : null, repeat: false, blocker: owned ? '' : 'After: ' + `Learn ${label}`});
    const steps = [...gates, learn, practice];
    const levels = LEVELS.map(([id, text, means], i) => ({id, label: text, means, state: i < stageIdx ? 'done' : i === stageIdx ? 'current' : 'pending'}));
    const nextL = LEVELS[stageIdx + 1];
    const timed = ready ? 0 : view.practiceMinutes ?? 0;
    return {id: `learn-${view.id}`, title: label, subject: label, summary: LEVELS[stageIdx][2], panel: null, status: ready ? 'done' : owned ? 'doing' : view.canLearn ? 'available' : 'started',
        statusLabel: ready ? 'Finished' : owned ? 'In progress' : 'Could study',
        level: {id: LEVELS[stageIdx][0], label: LEVELS[stageIdx][1], means: LEVELS[stageIdx][2], index: stageIdx, of: LEVELS.length}, levels,
        next: nextL ? {label: nextL[1], changes: nextL[2], needs: steps.filter(s => s.status !== 'done').map(s => s.label)} : null,
        steps, findings: view.sign ? [{stepId: 'practice', stage: 'seen', stageLabel: 'Seen', text: view.sign, provenance: 'You noticed it', when: ''}] : [], nextStep: steps.find(s => s.status === 'doing' || s.status === 'ready')?.id ?? null,
        understanding: bar([...gates, learn], 'Understanding'), usability: bar([practice], 'Usable'),
        timeLeft: {minutes: timed, text: ready ? 'Finished' : timed > 0 ? `About ${timed} min of practice` : 'No timed work left'},
        opens: {label: opensLabel, how: '', command: null, state: ready ? 'open' : 'closed', used: 0, gate: ready ? '' : `Reach ${LEVELS[LEVELS.length - 1][1]}`}};
}
