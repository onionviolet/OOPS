import {createMeterBar} from './meter_bar.js';

// Presentation of an existing work owner's clock and boundaries. This module stores no job state.
export function normalizeWorkStatus(work) {
    if (!work || typeof work.subject !== 'string' || !work.subject || typeof work.label !== 'string'
        || !Number.isFinite(work.total) || work.total <= 0 || !Number.isFinite(work.remaining)
        || work.remaining < 0) throw new Error('Invalid work status.');
    const total = work.total, remaining = Math.min(total, work.remaining);
    const completed = total - remaining;
    const paused = typeof work.pausedReason === 'string' && work.pausedReason.length > 0;
    const completionText=typeof work.completionText==='string'&&work.completionText?work.completionText:'Completed';
    const out = {subject: work.subject, label: work.label, total, remaining, completed, paused, completionText,
        status: paused ? work.pausedReason : remaining === 0 ? completionText : 'working'};
    if (work.stage) {
        if (typeof work.stage.label !== 'string' || !Number.isInteger(work.stage.index) || !Number.isInteger(work.stage.count)
            || work.stage.index < 1 || work.stage.count < work.stage.index) throw new Error('Invalid work stage.');
        out.stage = {...work.stage};
    }
    if (work.cycle) {
        if (typeof work.cycle.label !== 'string' || !Number.isSafeInteger(work.cycle.completed) || work.cycle.completed < 0)
            throw new Error('Invalid work cycle.');
        out.cycle = {...work.cycle};
    }
    if (work.batch) {
        if (typeof work.batch.label !== 'string' || !Number.isFinite(work.batch.completed) || work.batch.completed < 0
            || !Number.isFinite(work.batch.target) || work.batch.target <= 0) throw new Error('Invalid work batch.');
        out.batch = {...work.batch};
    }
    return out;
}

export function createWorkStatusView(doc = document) {
    const root = doc.createElement('section'); root.className = 'work-status-view';
    const stageTrack=doc.createElement('div');stageTrack.className='work-stage-track';
    const heading = doc.createElement('p'), meter = createMeterBar(doc), state = doc.createElement('p'), detail = doc.createElement('p');
    root.append(heading, meter.node, stageTrack, state, detail);
    return {node: root, update(input) {
        if (input == null) { root.hidden = true; return null; }
        const work = normalizeWorkStatus(input); root.hidden = false;
        heading.textContent = work.label;
        meter.update({id: `work:${work.subject}`, label: 'Work completed', kind: 'track', value: work.completed, max: work.total,
            note: work.paused ? `Paused: ${work.status}. ${work.remaining} ${input.unit || 'minutes'} remain.` : `${work.remaining} ${input.unit || 'minutes'} remain.`});
        state.textContent = work.paused ? `Paused: ${work.status}` : work.remaining === 0 ? work.completionText : 'In progress';
        stageTrack.replaceChildren();
        if(input.stages?.length){
            if(input.stages.some(s=>typeof s.label!=='string'||!Number.isFinite(s.duration)||s.duration<=0)||Math.abs(input.stages.reduce((n,s)=>n+s.duration,0)-work.total)>.000001)throw Error('Invalid native work allocation.');
            let elapsed=0;for(const s of input.stages){const segment=doc.createElement('span');segment.style.flex=String(s.duration);segment.textContent=`${s.label}: ${s.duration} ${input.unit||'minutes'}`;segment.dataset.state=work.completed>=elapsed+s.duration?'complete':work.completed>elapsed?'current':'pending';stageTrack.append(segment);elapsed+=s.duration;}
        }
        stageTrack.hidden=!input.stages?.length;
        const parts = [`${work.completed} of ${work.total} ${input.unit || 'minutes'} complete`, `${work.remaining} remain`];
        if (work.stage) parts.push(`Stage ${work.stage.index} of ${work.stage.count}: ${work.stage.label}`);
        if (work.cycle) parts.push(`${work.cycle.completed} ${work.cycle.label} completed`);
        if (work.batch) parts.push(`${work.batch.completed} of ${work.batch.target} ${work.batch.label}`);
        if(input.stages?.length)parts.push('Work allocation; all selected parts settle together at completion');
        detail.textContent = parts.join(' · ');
        return work;
    }};
}
