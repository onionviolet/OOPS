import {HABITAT as H,HAY_KEY,WOOL_KEY,habitatFacts,planHabitatAction} from './habitat_care.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
export function createHabitatPanel({parent,read,act}){
    const panel=node('details');panel.id='meadow_pen_panel';panel.className='expedition_panel';
    panel.append(node('summary','Meadow pen · care proposal'));
    const body=node('div'),status=node('div'),controls=node('div'),notice=node('p');notice.setAttribute('role','status');
    controls.style.cssText='display:flex;flex-wrap:wrap;gap:6px';
    const policy=node('details');policy.append(node('summary','Care and away policy'),
        node('p','Policy: feeding and brushing each last 12 played minutes. Six minutes of overlapping care produce one batch of 5 Wool. Progress pauses without support; at most one batch waits. Collection starts a new care cycle. Welfare stays safe in the shelter even when routine care lapses.'),
        node('p','Away policy: the open game’s native calendar advances care and production while you work or travel elsewhere. Closed-game wall time adds nothing. No offline feed use, harm, automatic collection or stock. Ready wool remains available when care expires.'));
    body.append(node('p','Original LP4 proposal. One sheltered, drained grass pen with clean water and one fleece sheep. Feed and brush for one wool batch.'),status,controls,policy,
        node('p','Use the wool: after the craftsman teaches Crafting, open Crafting → Crafting → Wool cloth (5 Wool per attempt). Native skill, station and success chance apply. Cloth supplies wool clothing recipes.'),notice);
    panel.append(body);parent.append(panel);let message='',signature='';
    const buttons=new Map();
    for(const [action,label]of [['build',`Obtain sheltered pen · ${H.buildCost} coins`],['adopt',`Adopt fleece sheep · ${H.adoptCost} coins`],['buy_feed',`Buy 1 Meadow hay · ${H.feedCost} coins`],['feed','Feed sheep · consume 1 Meadow hay'],['attend','Brush and inspect sheep'],['collect',`Collect ready wool · ${H.yield} Wool`]]){
        const b=node('button',label);b.type='button';b.dataset.habitat=action;
        b.onclick=()=>{try{act(action);message='Meadow pen progress saved.';}catch(e){message=e.message;}signature='';render();};
        controls.append(b);buttons.set(action,b);
    }
    function render(){
        if(panel.parentElement!==parent)parent.append(panel);
        const r=read();panel.hidden=r.location!==H.location||r.world!==H.world||r.inDialogue||r.inCombat;
        if(panel.hidden)return;
        const next=JSON.stringify(r);if(next===signature)return;signature=next;
        const f=habitatFacts(r.owner,r.clock),s=f.state;status.replaceChildren();
        for(const [key,text]of [['ownership',s?`Site: your sheltered meadow pen · capacity 1. Animal: ${s.animal?'your fleece sheep, housed here':'none; adoption requires this pen'}.`:'Site: not owned. Animal: none. No inherited animals or materials.'],
            ['welfare',`Welfare: ${f.welfare}.`],['care',`Care: ${f.fed?'fed':'needs hay'}; ${f.attended?'brushed and inspected':'needs attention'}. Carried hay: ${r.inventory[HAY_KEY]||0}.`],
            ['harvest',`Harvest: ${f.ready?'ready, 5 Wool':`${s?.progress||0}/${H.batchMinutes} supported minutes`}. Collected batches: ${s?.collected||0}. Carried Wool: ${r.inventory[WOOL_KEY]||0}.`]]){
            const p=node('p',text);p.dataset.habitatFact=key;status.append(p);
        }
        for(const [action,b]of buttons){
            b.hidden=action==='build'?!!s:action==='adopt'?!!s?.animal:action!=='buy_feed'&&!s?.animal;
            if(!s&&action!=='build')b.hidden=true;
            try{planHabitatAction(r.owner,action,r);b.disabled=false;b.title='';}
            catch(e){b.disabled=true;b.title=e.message;}
        }
        notice.textContent=message;
    }
    render();setInterval(render,500);return {render};
}
