import {FOUNDATION_PROBE_GROUP,FOUNDATION_PROBE_ACTORS,foundationInteractionProbeContext,foundationInteractionProbeGuard} from './foundation_interaction_content.js';
import {foundationInteractionView,admitFoundationInteraction} from './foundation_interaction_policy.js';
import {previewSimulationCommand} from './simulation.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
// read(): {state,context,enabled,error}; command uses the existing sole publisher.
// enabled is the native host's exact URL opt-in, never a persisted save flag.
export function createFoundationInteractionPanel({registry,read,command,enabled=false}) {
    const panel=node('details');panel.id='foundation_interaction_panel';panel.className='expedition_panel';panel.open=true;
    panel.append(node('summary','Experimental interaction arena'));
    panel.append(node('p','Original development policies: P-A closes incoming magic including aid. P-B admits named aid and needs sustained control. Physical projectiles remain independent after release. Demonstration fuel belongs only to identified arena actors.'));
    const status=node('p'),controls=node('div'),observer=node('div');panel.append(status,controls,observer);
    let notice='';
    const buttons=new Map(),sections=new Map();
    const sync=(parent,rows)=>{for(const child of [...parent.children])if(!rows.includes(child))child.remove();for(let i=0;i<rows.length;i++)if(parent.children[i]!==rows[i])parent.insertBefore(rows[i],parent.children[i]||null);};
    const run=c=>{try{command(c);notice='Published experimental action.';}catch(e){notice=e.message;}render();};
    function button(label,token,action,disabled=false) {let b=buttons.get(token);if(!b){b=node('button');b.type='button';b.dataset.foundationProbe=token;buttons.set(token,b);}b.textContent=label;b.disabled=disabled;b.title='';b.onclick=()=>run(action);return b;}
    function render() {
        const {state,context={},enabled:ready=true,error}=read();panel.hidden=!enabled;
        if(!panel.isConnected)document.getElementById('location_actions_div')?.append(panel);
        if(!enabled)return;
        status.textContent=error||notice||'Use a disposable test save. Actions and aftermath use the current durable publisher and played-time clock.';
        const controlRows=[];observer.replaceChildren();
        const sequence=state.sequence;
        if(!state.simulation?.foundationInteraction){sync(controls,[button('Complete experimental admission drill','enroll',{type:'command',id:'foundation.probe.enroll',actorId:'player',expectedSequence:sequence},!ready)]);return;}
        for(const actorId of FOUNDATION_PROBE_ACTORS) {
            let shell=sections.get(actorId);if(!shell){shell={section:node('section'),title:node('h4',`Arena ${actorId.at(-1).toUpperCase()}`),means:node('p')};sections.set(actorId,shell);}
            const {section,title,means}=shell,p=state.simulation.people[actorId],a=state.actors[actorId],rows=[title,means];
            means.textContent=`Actual health ${p?.vitals?.health ?? '?'} / ${p?.vitals?.max_health ?? '?'}; own demonstration fuel ${a?.resources?.demonstrationFuel ?? '?'}; acquired control ${a?.sources?.['foundation.probe.control']?'present':'removed'}.`;
            const actorContext=foundationInteractionProbeContext(state,actorId,context),session=state.simulation.sessions[actorId];
            if(session){for(const r of session.turns[session.turn].responses)rows.push(button(r.label,`${actorId}.response.${r.id}`,{type:'encounter',id:r.id,actorId,targetId:session.targetId,expectedSequence:sequence},!ready));}
            for(const d of registry.simulation.commands.values())if(d.group===FOUNDATION_PROBE_GROUP&&d.actorId===actorId){
                const ctx={...actorContext,targetId:d.targetId};let eligible=false,reason='';
                try {foundationInteractionProbeGuard(state,d,ctx);const preview=previewSimulationCommand(state,registry,d.id,ctx);eligible=preview.eligible;reason=preview.reasons.join(' ');if(eligible)admitFoundationInteraction(state,d.effects,ctx);}catch(e){eligible=false;reason=e.message;}
                // No future collision trace in tooltips. Present physical means
                // and saved outcomes below are the observer's earned evidence.
                const b=button(d.label,d.id,{type:'command',id:d.id,actorId,targetId:d.targetId,expectedSequence:sequence},!ready||!eligible);
                if(reason)b.title=reason;rows.push(b);
            }
            sync(section,rows);controlRows.push(section);
            const view=foundationInteractionView(state,actorId,actorContext),seen=node('section');seen.append(node('h4',`${actorId.at(-1).toUpperCase()} · observed lifecycle and aftermath`));
            for(const i of view.instances)seen.append(node('p',`${i.id}: ${i.status}; original expiry ${i.expiresAt}.`));
            const history=node('ol');for(const h of view.history.slice(-8))history.append(node('li',`${h.at}: ${h.operation}${h.reason?` (${h.reason})`:''}.`));seen.append(history);observer.append(seen);
        }
        sync(controls,controlRows);
        if(!panel.isConnected)document.getElementById('location_actions_div')?.append(panel);
    }
    render();return {panel,render};
}
