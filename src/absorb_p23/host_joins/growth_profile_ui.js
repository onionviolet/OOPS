export function createGrowthPanel({read,act}) {
    const panel=document.createElement('details');panel.id='p23_growth_panel';panel.className='expedition_panel';
    const title=document.createElement('summary');title.textContent='Study conditioning (proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');panel.append(title,body,notice);
    function render(){const host=document.getElementById('location_actions_div');if(host&&panel.parentElement!==host)host.append(panel);
        const f=read();panel.hidden=!f.visible;body.replaceChildren();if(panel.hidden)return;
        for(const text of f.lines){const p=document.createElement('p');p.textContent=text;body.append(p);}
        for(const row of f.actions){const button=document.createElement('button');button.textContent=row.label;button.dataset.p23Growth=row.id;
            button.disabled=!!row.reason;button.title=row.reason||'';button.onclick=()=>{try{act(row.id,f.sequence);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(button);}
    }render();return {render};
}
