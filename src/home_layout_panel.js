import {definePanel} from './panel_kit.js';
// Desktop-first room plan for the manor (G22). Selecting a fixture or cell is free (UR35); a move shows
// its before/after sleep term and coin fee and only runs on the confirm button.
const el=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
const sign=v=>(v>=0?'+':'')+v.toFixed(2);
export function createHomeLayoutPanel({read,adopt,quote,execute}){
    const panel=el('section');panel.id='home_layout_panel';panel.className='expedition_panel';
    const body=el('div'),notice=el('p');notice.setAttribute('role','status');
    panel.append(el('h2','Room plan'),el('p','Where the manor’s fixtures stand. Warmth and smoke spread from the hearth across the floor; the bed’s cell decides how well the household sleeps.'),body,notice);
    let slot=null,pending=null,signature='';
    function render(){
        const view=read();if(!panel.isConnected)return;
        const sig=JSON.stringify([view,slot,pending&&pending.summary]);if(sig===signature)return;signature=sig;
        body.replaceChildren();
        if(!view.visible){body.append(el('p','No room plan is needed here yet.'));return;}
        if(!view.adopted){
            body.append(el('p','The manor has never been laid out. Until it is, fixtures have no places and nothing about sleep changes.'));
            const b=el('button','Lay out the manor · free');b.type='button';b.dataset.layoutAdopt='manor';
            b.onclick=()=>{try{adopt({home:'manor'});notice.textContent='';signature='';render();}catch(e){notice.textContent=e.message;}};body.append(b);return;
        }
        body.append(el('p',`Sleep from the room: ${sign(view.bedDelta)} · ${view.moves} move${view.moves===1?'':'s'} made · ${view.fee} coins to haul a fixture.`));
        const bar=el('div');bar.style.display='flex';bar.style.gap='var(--ui-space-3)';
        for(const s of view.slots){const b=el('button',s.label);b.type='button';b.dataset.layoutSlot=s.id;b.setAttribute('aria-pressed',String(slot===s.id));
            b.onclick=()=>{slot=slot===s.id?null:s.id;pending=null;signature='';render();};bar.append(b);}
        body.append(bar);
        const grid=el('div');grid.style.display='grid';grid.style.gridTemplateColumns=`repeat(${view.w},minmax(0,1fr))`;grid.style.gap='var(--ui-space-2)';
        for(const c of view.cells){
            const b=el('button',`${c.label||'Floor'}\nwarm ${c.warmth} · smoke ${c.turbid} · qi ${c.qi}`);b.type='button';b.style.whiteSpace='pre-line';
            b.dataset.layoutCell=`${c.x},${c.y}`;if(c.slot)b.dataset.layoutHolds=c.slot;
            b.onclick=()=>{if(!slot){notice.textContent='Choose a fixture to move first.';return;}
                const q=quote({home:'manor',slot,x:c.x,y:c.y});pending=q.eligible?q:null;notice.textContent=q.eligible?'':q.reason;signature='';render();};
            grid.append(b);
        }
        body.append(grid);
        if(pending){
            const p=el('p',pending.summary);p.dataset.layoutQuote='';body.append(p);
            const go=el('button',`Move it · ${pending.fee} coins`);go.type='button';go.dataset.layoutConfirm='';
            go.onclick=()=>{try{const r=execute(pending);pending=null;slot=null;notice.textContent=r.message;signature='';render();}catch(e){notice.textContent=e.message;}};
            body.append(go);
        }
    }
    definePanel({id:'home-layout',title:'Room plan',role:'records',node:panel,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>read().visible,eligible:()=>read().visible});
    render();return {render};
}
