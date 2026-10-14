// Standard native Local actions; no rewards, timers, effects or owner writes.
export function createHouseholdPanel({host,read,act}) {
    const panel=document.createElement('details');panel.id='p23_household_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='A lived home (proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');panel.append(summary,body,notice);host.append(panel);
    function render(){const frame=read();panel.hidden=!frame.visible;
        if(panel.parentElement!==host)host.append(panel);body.replaceChildren();
        for(const text of frame.records){const p=document.createElement('p');p.textContent=text;body.append(p);}
        for(const action of frame.actions){const button=document.createElement('button');button.textContent=action.label;button.dataset.householdAction=action.id;
            button.disabled=frame.disabled||action.enabled===false;button.title=action.reason||'';
            button.onclick=()=>{try{act(action.id);notice.textContent='';}catch(error){notice.textContent=error.message;}render();};body.append(button);}}
    render();return {render};
}
