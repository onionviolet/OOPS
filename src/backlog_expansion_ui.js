import {backlogActions, backlogView, previewBacklogAction} from './backlog_expansion_host.js';
import {projectActionLegibility} from './action_legibility.js';
const node = (tag,text = '') => {const n = document.createElement(tag);n.textContent = text;return n;};
const strings = value => Array.isArray(value) ? value.filter(v => typeof v === 'string') : [];

/** Read-only native view; all writes go to the integrator's command callback. */
export function createBacklogExpansionPanel({registry,read,command,parent,opening = false,preview = previewBacklogAction}) {
    const panel = node('details'), summary = node('summary','Optional lives and local experiments');
    panel.className = 'expedition_panel'; panel.id = opening ? 'backlog_opening_panel' : 'backlog_expansion_panel';
    const intro = node('p','These original proposals use your actual belongings and local people. Choose a proof to read its terms before committing.'), records = node('div'), status = node('p');
    status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); panel.append(summary,intro,records);
    const groups = new Map(), controls = new Map(); let message = '', signature = '';
    for(const action of backlogActions()) {
        const family = action.family || 'experiments';
        let group = groups.get(family);
        if(!group) {const details=node('details'), title=node('summary',family.replaceAll('_',' '));details.append(title);panel.append(details);group={details,title};groups.set(family,group);}
        const row=node('div'), button=node('button',action.label), explanation=node('p',action.description || ''), reason=node('p');
        row.className='expedition_card';button.type='button';button.dataset.backlogAction=action.id;
        explanation.id=`${panel.id}_${action.id.replaceAll('.','_')}_terms`;
        reason.id=`${panel.id}_${action.id.replaceAll('.','_')}_blockers`;
        button.setAttribute('aria-describedby',`${explanation.id} ${reason.id}`);
        button.addEventListener('click',()=>{try {const packet=controls.get(action.id)?.packet;
            if(!packet)throw new Error('Review the current offer before accepting it.');
            command(structuredClone(packet));message='The selected action was recorded.';
        } catch(error) {message=error.message;}render();});
        row.append(button,explanation,reason);group.details.append(row);controls.set(action.id,{action,row,button,explanation,reason});
    }
    panel.append(status);
    function packetFor(action,snapshot) {
        // Dynamic packet factories are authored read-only adapters, never writes.
        return typeof action.packet === 'function' ? action.packet(snapshot.state,snapshot.context) : {...(action.packet || {})};
    }
    function render() {
        const focused=document.activeElement,snapshot=read(),{state,context,error,canWrite}=snapshot;
        const view=backlogView(state,context),nearby=['Village','Shack'].includes(context.facts?.location);
        panel.hidden=opening ? !context.freshOpening : (!nearby || (!view.enrolled && context.facts?.['village.elderMet']!==true));
        if(snapshot.inCombat || snapshot.inDialogue) panel.hidden=true;
        const publicRecords=view.sections.flatMap(section=>strings(section?.records));
        const next=JSON.stringify(publicRecords);
        if(next!==signature) {signature=next;records.replaceChildren(...publicRecords.map(text=>node('p',text)));}
        // A hidden panel shows no control, so it skips the per-action staged previews;
        // the first render after it opens computes them before anything is visible.
        if(!panel.hidden) for(const control of controls.values()) {
            const isOpening=control.action.id==='backlog.body.origin_reedling';
            control.row.hidden=opening ? !isOpening : isOpening;
            if(control.row.hidden) continue;
            const packet=packetFor(control.action,snapshot);
            control.packet={...structuredClone(packet),id:control.action.id,sequence:state.sequence};
            const quote=preview(state,registry,control.action.id,context,packet);
            const projection=projectActionLegibility({id:control.action.id,label:control.action.label,
                description:control.action.description,discovered:quote.visible===true,preview:quote,context,
                disclosure:{costs:control.action.description ? [{known:true,text:control.action.description}] : [],
                    reasons:quote.reasons.map(text=>({known:true,match:text,text}))}});
            control.row.hidden=!projection;
            control.button.disabled=!canWrite || !!error || !projection?.control.enabled;
            control.explanation.textContent=projection?.costs.length ? `Known terms: ${projection.costs.map(row=>row.text).join(' ')}` : control.action.description || '';
            control.reason.textContent=error || projection?.blockers.map(row=>row.text).join(' ') || '';
            control.reason.hidden=!control.reason.textContent;
            if(control.row.hidden && focused===control.button) control.button.closest('details')?.querySelector('summary')?.focus();
        }
        for(const group of groups.values()) group.details.hidden=![...group.details.querySelectorAll('.expedition_card')].some(row=>!row.hidden);
        status.textContent=error || message;status.hidden=!status.textContent;
        if(panel.hidden && panel.contains(focused)) summary.focus();
    }
    parent?.append(panel);render();return {panel,render};
}
