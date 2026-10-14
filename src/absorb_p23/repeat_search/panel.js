import {repeatSearchView} from './repeat_search.js';
// Presentation only. P00 owns the native read/transaction bindings. No effects,
// timers, random rolls, save access or resource mutation occur in this panel.
export function createRepeatSearchPanel({container,read,act}) {
    const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
    const panel=node('details'),heading=node('summary','Runner offcuts'),body=node('div'),status=node('p');
    panel.id='repeat_search_panel';panel.className='expedition_panel';status.setAttribute('role','status');
    panel.append(heading,body,status);container.append(panel);
    let signature='';
    function render() {
        if(panel.parentElement!==container)container.append(panel);
        const {state,context}=read(),v=repeatSearchView(state,context);panel.hidden=!v.visible;
        const next=JSON.stringify(v);if(next===signature)return;signature=next;status.textContent='';
        const focused=document.activeElement?.dataset.repeatSearchAction;
        body.replaceChildren(node('p',v.summary));
        for(const row of v.rows) {
            const button=node('button',row.label);button.type='button';button.disabled=row.disabled;button.dataset.repeatSearchAction=row.id;
            button.addEventListener('click',()=>{let message='';try{const answer=act(row.id);message=answer?.messages?.join(' ')||'';}
                catch(error){message=error.message;}render();status.textContent=message;});body.append(button);
        }
        if(focused)body.querySelector('[data-repeat-search-action="runner_offcut"]')?.focus();
    }
    render();return {panel,render,destroy:()=>panel.remove()};
}
