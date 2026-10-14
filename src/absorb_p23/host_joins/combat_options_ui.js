export function createCombatOptionsPanel({read,act}) {
    const panel=document.createElement('details');panel.id='p23_combat_options_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Combat options (proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');panel.append(summary,body,notice);
    function render(){const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);
        const frame=read();panel.hidden=!frame.visible;body.replaceChildren();if(panel.hidden)return;
        const status=document.createElement('p');status.textContent=frame.status;body.append(status);
        for(const action of frame.actions){const b=document.createElement('button');b.dataset.combatOption=action.id;b.textContent=action.label;b.disabled=frame.disabled||action.disabled;
            b.onclick=()=>{try{act(action.id);notice.textContent='';}catch(error){notice.textContent=error.message;}render();};body.append(b);}}
    render();return {render};
}
