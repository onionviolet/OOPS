import {localLifeView} from './local_life.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
// No timer, inventory or save owner. Root binds its transactional dispatcher.
export function createLocalLifePanel({container,read,act}) {
    const panel=node('details');panel.id='local_life_panel';panel.className='expedition_panel';
    const summary=node('summary','Local life'),body=node('div'),status=node('p');
    status.setAttribute('role','status');panel.append(summary,body,status);container.append(panel);
    let signature='';
    function render() {
        if(panel.parentElement!==container)container.append(panel);
        const {state,context}=read(),v=localLifeView(state,context);panel.hidden=!v.visible;
        const next=JSON.stringify(v);if(next===signature)return;signature=next;
        const focused=document.activeElement?.dataset.localLifeAction;
        body.replaceChildren(node('p',v.summary),node('p',v.readiness),node('p',v.exposure));
        if(v.encounter)body.append(node('p',v.encounter));
        for(const row of v.rows){const b=node('button',row.label);b.type='button';b.disabled=row.disabled;b.dataset.localLifeAction=row.id;
            b.addEventListener('click',()=>{try{const answer=act(row.id);status.textContent=answer?.messages?.join(' ')||'';}catch(e){status.textContent=e.message;}render();});body.append(b);}
        if(focused)body.querySelector(`[data-local-life-action="${focused}"]`)?.focus();
    }
    render();return {panel,render,destroy:()=>panel.remove()};
}
