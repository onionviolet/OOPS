import {HABITAT as H,HAY_KEY,carriedWool,habitatFacts,planHabitatAction} from './habitat_care.js';
import {readFleece,FLEECE} from './fleece_from_care.js';
import {sheepTieLine} from './being_sheep.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
// FRC56: the sheep's own mood rows, its tie, and what the next fleece would be if collected now (grade from care; the dense roll is per fleece).
function sheepLines(s,mood){
    const fl=readFleece({owner:s,mood}),rows=(mood?.rows||[]).slice(0,4).map(t=>`${t.line.replace(/\.$/,"")} (${t.value>0?'+':''}${t.value})`);
    return [['tie',sheepTieLine(s)],
        ['mood',`Mood: ${mood?.band||'even'}${rows.length?`, from ${rows.join('; ')}`:', nothing on its mind'}.`],
        ['fleece',`Next fleece: ${fl.grade} wool, ${fl.quality}% quality, ${FLEECE.base} Wool, ${Math.round(fl.chance*100)}% chance of a dense fleece${fl.friendship<FLEECE.deluxeMinimum?` once the tie reaches ${FLEECE.deluxeMinimum}`:''}.`]];
}
export function createHabitatPanel({parent,read,act}){
    const panel=node('details');panel.id='meadow_pen_panel';panel.className='expedition_panel';
    panel.append(node('summary','Meadow pen · care proposal'));
    const body=node('div'),status=node('div'),controls=node('div'),notice=node('p');notice.setAttribute('role','status');
    controls.style.cssText='display:flex;flex-wrap:wrap;gap:6px';
    const policy=node('details');policy.append(node('summary','Care and away policy'),
        node('p','Policy: one hay bundle feeds the sheep for 12 played minutes, and six fed minutes grow one fleece of 5 Wool. Progress pauses while it is hungry; at most one fleece waits. Brushing does not grow wool: it builds the sheep\'s tie to you and lifts its mood, and both decide how fine the fleece is and whether it comes in dense (2 more Wool). A missed meal costs a short sour spell, never the tie, and an ignored sheep still gives plain wool. Welfare stays safe in the shelter even when routine care lapses.'),
        node('p','Away policy: the open game’s native calendar advances care and production while you work or travel elsewhere. Closed-game wall time adds nothing. No offline feed use, harm, automatic collection or stock. Ready wool remains available when care expires.'));
    body.append(node('p','Original LP4 proposal. One sheltered, drained grass pen with clean water and one fleece sheep. Feed it for wool; brush it and keep it fed on time for finer wool.'),status,controls,policy,
        node('p','Use the wool: after the craftsman teaches Crafting, open Crafting → Tinkering → Wool cloth (5 Wool per attempt). Native skill, station and success chance apply. Cloth supplies wool clothing recipes. Finer wool sells for more at any trader.'),notice);
    panel.append(body);parent.append(panel);let message='',signature='';
    const buttons=new Map();
    for(const [action,label]of [['build',`Obtain sheltered pen · ${H.buildCost} coins`],['adopt',`Adopt fleece sheep · ${H.adoptCost} coins`],['buy_feed',`Buy 1 Meadow hay · ${H.feedCost} coins`],['feed','Feed sheep · consume 1 Meadow hay'],['attend','Brush and inspect sheep'],['collect','Collect ready wool']]){
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
            ['welfare',`Welfare: ${f.welfare}.`],['care',`Care: ${f.fed?'fed':'needs hay'}; ${f.attended?'brushed this interval':'not brushed this interval'}. Carried hay: ${r.inventory[HAY_KEY]||0}.`],
            ...(s?.animal?sheepLines(s,r.mood):[]),
            ['harvest',`Harvest: ${f.ready?'ready':`${s?.progress||0}/${H.batchMinutes} fed minutes`}. Collected fleeces: ${s?.collected||0}. Carried Wool, all grades: ${carriedWool(r.inventory)}.`]]){
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
