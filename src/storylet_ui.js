import {previewSimulationResponse} from './simulation.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
export function createStoryletPanel({registry,read,command}) {
    const panel=node('details');panel.id='storylet_panel';panel.className='expedition_panel';panel.open=true;
    panel.append(node('summary','Village encounters'));
    const status=node('p'),begin=node('button','Begin Village encounters'),cards=node('div'),news=node('ol');
    begin.type='button';begin.dataset.storylet='begin';panel.append(status,begin,cards,news);
    let notice='',signature='';
    function run(c){try{command(c);notice='Response saved.';}catch(error){notice=error.message;}render();}
    begin.addEventListener('click',()=>run({type:'storylet_begin'}));
    function render(){
        const snapshot=read(),{state,context}=snapshot,s=state.simulation;
        panel.hidden=state.actors.player.worldId!=='base.frontier' || context.facts.location!=='Village' || snapshot.inDialogue;
        if(panel.hidden)return;
        if(!panel.isConnected)document.getElementById('location_actions_div')?.append(panel);
        const enabled=state.actors.player.facts['storylets.enabled']===true;
        begin.hidden=enabled;begin.disabled=!snapshot.enabled || !!snapshot.error || !!context.busy;
        status.textContent=snapshot.error || notice || (enabled?'Encounters draw while Village time passes. Decisions let idle play continue; unanswered cards close safely.':'Speak to the elder, then begin. Nothing accrues while the game is closed.');
        const events=Object.values(s?.events || {}).filter(e=>e.storylet && e.actorId==='player' && e.discoveredBy.includes('player'));
        const open=events.filter(e=>e.status==='open');
        const nextSignature=JSON.stringify([open,state.clock,snapshot.enabled,snapshot.error,context.busy,context.external,context.gameplay]);
        if(nextSignature!==signature){signature=nextSignature;cards.replaceChildren();
            for(const e of open){const section=node('section');section.dataset.storyletCard=e.definitionId;
                section.append(node('p',`${e.mode==='decision'?'Decision': 'Offer'} · ${e.label} · ${Math.max(0,e.expiresAt-state.clock)} min left`));
                for(const r of e.responses){const b=node('button',r.label);b.type='button';b.dataset.storyletResponse=r.id;
                    const preview=previewSimulationResponse(state,registry,{kind:'event',eventId:e.id,responseId:r.id},context);
                    b.disabled=!snapshot.enabled || !!snapshot.error || !preview.eligible;b.title=preview.reasons.join(' ');
                    b.addEventListener('click',()=>run({type:'event',eventId:e.id,responseId:r.id}));section.append(b);}
                cards.append(section);
            }
        }
        const lines=events.filter(e=>e.status!=='open').slice(-5).reverse().map(e=>`${e.label}${e.status==='expired'?' · closed safely':e.response?' · '+(e.responses.find(r=>r.id===e.response.id)?.label || e.response.id):''}`);
        if(news.textContent!==lines.join(''))news.replaceChildren(...lines.map(text=>node('li',text)));
    }
    return {render};
}
