export function createReadingSalvagePanel({read,act}) {
    const panel=document.createElement('details');panel.id='p23_reading_salvage_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Books, earned rest and leatherwork (proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');panel.append(summary,body,notice);
    function render(){const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);
        const f=read();panel.hidden=!f.visible;body.replaceChildren();if(panel.hidden)return;
        for(const text of f.lines){const p=document.createElement('p');p.textContent=text;body.append(p);}
        for(const row of f.actions){const button=document.createElement('button');button.textContent=row.label;button.dataset.p23Study=row.id;button.disabled=!!row.reason;button.title=row.reason||'';button.onclick=()=>{try{act(row.id,row);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(button);}
    }render();return {render};
}
