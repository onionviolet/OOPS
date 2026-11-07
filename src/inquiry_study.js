// Consumer 1 of inquiry@1: the Frontier Study panel. Defines the inquiry behind a Study project and turns the project's
// own projection (research_view.js) into running effort totals. Data and a pure reader; it writes nothing (inquiry.js
// owns the slice and the knowledge write). Only the understanding side counts: evidence and explanation steps, not the
// practice that follows (usability stays the lesson's own business).
import {registerInquiry} from './inquiry.js';

const STUDY_INQUIRIES = [{
    project: 'frontier.lever', id: 'study.frontier.lever', question: 'Why does the long arm lift?', method: 'derive',
    sources: [{kind: 'person', id: 'oldCraftsman', coverage: 'shows what he holds'}],
    need: {minutes: 6, evidence: 4},
    risk: 'A wrong rule costs a log and stamina on the next brace.',
    outputs: [{key: 'study.frontier.lever.writeup', stage: 'understood', value: 'You worked out why the long arm lifts and wrote it down: brace near the pivot and the far end takes the lift.'}],
}];
const byProject = new Map(STUDY_INQUIRIES.map(d => [d.project, registerInquiry(d)]));

/** The inquiry id behind a Study project view, or null when that project has none. */
export const studyInquiryId = project => byProject.get(project.id)?.id ?? null;
/** Running effort totals from a project view: worked minutes and finished understanding steps. */
export function studyEffort(project) {
    const done = project.steps.filter(s => s.kind !== 'practice' && s.status === 'done');
    return {minutes: done.reduce((sum, s) => sum + (s.minutes || 0), 0), evidence: done.length};
}
