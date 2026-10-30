import {previewSimulationResponse} from './simulation.js';
import {storyletTemper} from './storylet_deck.js';
import {renderSceneCard} from './ui/scene_card.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
export function createStoryletPanel({registry,read,command}) {
    const panel=node('details');panel.id='storylet_panel';panel.className='expedition_panel';panel.open=true;
    panel.append(node('summary','Village encounters'));
    const status=node('p'),begin=node('button','Begin Village encounters'),cards=node('div'),news=node('ol');
    begin.type='button';begin.dataset.storylet='begin';
    // Village temper: Calm draws less often, Lively more; Usual keeps the default rhythm.
    const temper=node('p');temper.dataset.storyletTemper='';
    const tempers=['calm','usual','lively'].map(id=>{const b=node('button',id[0].toUpperCase()+id.slice(1));b.type='button';b.dataset.storyletTemper=id;
        b.addEventListener('click',()=>run({type:'command',id:`village.storylets.temper.${id}`}));return b;});
    temper.append(node('span','Village temper: '),...tempers);
    panel.append(status,begin,temper,cards,news);
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
        temper.hidden=!enabled;const current=storyletTemper(state);
        for(const b of tempers){b.disabled=!snapshot.enabled || !!snapshot.error || !!context.busy || b.dataset.storyletTemper===current;b.ariaPressed=String(b.dataset.storyletTemper===current);}
        status.textContent=snapshot.error || notice || (enabled?`Encounters draw while Village time passes (${storyletTemper(state)} temper). Decisions let idle play continue; unanswered cards close safely.`:'Speak to the elder, then begin. Nothing accrues while the game is closed.');
        const events=Object.values(s?.events || {}).filter(e=>e.storylet && e.actorId==='player' && e.discoveredBy.includes('player'));
        const open=events.filter(e=>e.status==='open');
        const nextSignature=JSON.stringify([open,state.clock,snapshot.enabled,snapshot.error,context.busy,context.external,context.gameplay]);
        if(nextSignature!==signature){signature=nextSignature;cards.replaceChildren();
            // The card module draws the slots; this panel only supplies the scene data.
            for(const e of open)renderSceneCard(cards,{kind:'storylet',attrs:{storyletCard:e.definitionId},
                header:{lead:e.mode==='decision'?'Decision':'Offer',title:e.label,time:`${Math.max(0,e.expiresAt-state.clock)} min left`},
                options:e.responses.map(r=>{
                    const preview=previewSimulationResponse(state,registry,{kind:'event',eventId:e.id,responseId:r.id},context);
                    return {id:r.id,label:r.label,attrs:{storyletResponse:r.id},blocked:preview.eligible?'':preview.reasons.join(' '),
                        disabled:!snapshot.enabled || !!snapshot.error || !preview.eligible,onChoose:()=>run({type:'event',eventId:e.id,responseId:r.id})};
                })});
        }
        const lines=events.filter(e=>e.status!=='open').slice(-5).reverse().map(e=>`${e.label}${e.status==='expired'?' · closed safely':e.response?' · '+(e.responses.find(r=>r.id===e.response.id)?.label || e.response.id):''}`);
        if(news.textContent!==lines.join(''))news.replaceChildren(...lines.map(text=>node('li',text)));
    }
    return {render};
}
