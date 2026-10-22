import {furniturePresentation} from './absorb_b/furniture.js';
import {expandWorkspaceModule} from './workspace_layout.js';
// Existing furnishing readout, moved intact out of the composition root. Homes
// is a separate owned center view; this is its contextual local entry.
export function createFurniturePanel({read,busy,host}) {
    const panel=document.createElement('details');panel.id='furniture_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Furniture and home comforts';
    const open=document.createElement('button');open.type='button';open.textContent='Open Homes · rights, furnishings and belongings';open.dataset.openHomes='';open.onclick=()=>expandWorkspaceModule('homes');
    const body=document.createElement('div');panel.append(summary,open,body);host().append(panel);
    let signature='';
    const render=()=>{if(panel.parentElement!==host())host().append(panel);const input=read(),view=furniturePresentation(input);panel.hidden=busy()||(!view.visible&&input.state.actors?.player?.worldId!=='base.frontier');
        const next=JSON.stringify(view.sections.map(section=>section.records.map(r=>r.text)));if(next===signature)return;signature=next;
        body.replaceChildren();for(const section of view.sections)for(const record of section.records){const p=document.createElement('p');p.textContent=record.text;body.append(p);}};
    render();return {render};
}
