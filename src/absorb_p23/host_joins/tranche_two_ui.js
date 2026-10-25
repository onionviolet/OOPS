export function createLivingGearPanel({read,spend}) {
    const panel=document.createElement('details');panel.id='p23_living_gear_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Living equipment';
    const body=document.createElement('div'),notice=document.createElement('p');panel.append(summary,body,notice);
    function render(){const host=document.getElementById('location_actions_div');if(panel.parentElement!==host)host.append(panel);
        const frame=read();panel.hidden=!frame.rows.length;body.replaceChildren();
        if(panel.hidden)return;
        const projection=document.createElement('p');projection.textContent=`Native attack ×${frame.attackMultiplier.toFixed(5)}; local light +${frame.lightBonus}.`;body.append(projection);
        for(const row of frame.rows){const p=document.createElement('p');p.textContent=`${row.name}: ${row.kind==='weapon'?`${row.kills} remembered kills; ${row.wornMinutes} worn minutes, time tempering ×${row.tempering.toFixed(5)}`:row.kind==='collector'?`${row.reserve}/30 cinders`:'uses the native day/night clock'}.`;body.append(p);
            if(row.kind==='collector'){const button=document.createElement('button');button.textContent='Spend 3 cinders for up to 5 stamina';button.dataset.livingGearAction='spend';button.disabled=frame.disabled||row.reserve<3;button.onclick=()=>{try{spend(row.key);notice.textContent='';}catch(error){notice.textContent=error.message;}render();};body.append(button);}}
    }render();return {render};
}
