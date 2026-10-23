import {definePanel} from './panel_kit.js';
// Desktop-first records panel: how well the manor household knows you (gift tiers) and who is better
// off at the manor. Gifts above a tier's comfortable size are allowed and cost trust, with the reason shown.
const el=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
export function createPeerStandingPanel({read,quote,execute}){
    const panel=el('section');panel.id='peer_standing_panel';panel.className='expedition_panel';
    const body=el('div'),notice=el('p');notice.setAttribute('role','status');
    panel.append(el('h2','Regard and standing'),el('p','Gifts are coins from your purse to theirs. Nobody refuses a gift; a gift too large for how well they know you costs trust instead.'),body,notice);
    let signature='';
    function render(){
        if(!panel.isConnected)return;const view=read();const sig=JSON.stringify(view);if(sig===signature)return;signature=sig;
        body.replaceChildren();if(!view.visible){body.append(el('p','The manor household has not been met yet.'));return;}
        for(const r of view.rows){
            const box=el('div');box.dataset.trustRow=r.id;box.append(el('strong',`${r.name} · ${r.tier} · ${r.points} trust`),el('p',`Comfortable gift up to ${r.ceiling} coins at this tier.`));
            if(r.alive)for(const amount of view.amounts){
                const q=quote({actor:r.id,amount}),b=el('button',`Give ${amount} coins`);b.type='button';b.dataset.trustGift=`${r.id}:${amount}`;b.disabled=!q.eligible;
                b.title=q.eligible?q.summary:q.reason;b.onclick=()=>{try{const done=execute(q);notice.textContent=done.summary;signature='';render();}catch(e){notice.textContent=e.message;}};
                box.append(b);const note=el('small',q.eligible?q.summary:q.reason);note.dataset.trustNote=`${r.id}:${amount}`;box.append(note);
            }else box.append(el('p','Not here to receive a gift.'));
            body.append(box);
        }
        const rk=view.ranking;body.append(el('h3','Who is better off at the manor'),el('p',`You rank ${rk.rank} of ${rk.of} by coins in hand${rk.next?`; ${rk.next.name} is ${rk.next.gap} ahead`:''}.`));
        for(const o of rk.order)body.append(el('p',`${o.rank}. ${o.name} · ${o.score} coins`));
    }
    definePanel({id:'social-trust',title:'Regard',role:'records',node:panel,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>read().visible,eligible:()=>read().visible});
    render();return {render};
}
