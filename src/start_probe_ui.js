import {resolveStart} from './start_records.js';
import {frontierStartWorld as world} from './data/start_layers_frontier.js';
export function createStartProbe(panel) {
    if(!['localhost','127.0.0.1'].includes(location.hostname) || new URLSearchParams(location.search).get('start_probe')!=='1')return null;
    panel.classList.add('start-probe-active');
    const section=document.createElement('section');section.dataset.startRoll='';section.setAttribute('aria-label','Layered start probe');
    section.innerHTML='<h2>Try a layered beginning</h2><p>Local prototype. Lock a layer, roll it, or leave it unknown.</p><div data-start-axes></div><label>Seed <input data-start-seed maxlength="72" placeholder="Generate a seed"></label><button type="button" data-start-roll-button>Roll start</button><article data-start-card aria-live="polite"></article><label class="start-use"><input type="checkbox" data-start-use> Begin with this start</label>';
    panel.querySelector('#hero_creation_panel_confirmation_wrapper').before(section);
    const rows=new Map(),seed=section.querySelector('[data-start-seed]'),card=section.querySelector('[data-start-card]'),use=section.querySelector('[data-start-use]');
    let resolved=null;
    for(const axis of world.axes) {
        const row=document.createElement('div');row.dataset.startAxis=axis;
        const label=document.createElement('label');label.textContent=axis;
        const mode=document.createElement('select');mode.dataset.startMode='';mode.setAttribute('aria-label',`${axis} mode`);
        for(const value of ['lock','roll','unknown'])mode.add(new Option(value,value));
        mode.value=axis==='entry' ? 'lock' : 'roll';
        const layer=document.createElement('select');layer.dataset.startLayer='';layer.setAttribute('aria-label',`${axis} layer`);layer.title='Used when this axis is locked';
        for(const l of world.layers[axis])layer.add(new Option(l.id,l.id));
        layer.value=axis==='entry' ? 'vanilla' : 'empty';
        label.append(mode);row.append(label,layer);section.querySelector('[data-start-axes]').append(row);rows.set(axis,{mode,layer});
        mode.addEventListener('change',roll);layer.addEventListener('change',roll);
    }
    function roll() {
        if(!seed.value.trim())seed.value=crypto.randomUUID();
        const choices=Object.fromEntries([...rows].map(([axis,{mode,layer}])=>[axis,{mode:mode.value,layerId:layer.value}]));
        try {
            resolved=resolveStart(world,choices,seed.value);
            const {snapshot:s,provenance,hidden,layers}=resolved;
            card.dataset.startResolved=JSON.stringify({money:s.money,items:s.items,pockets:s.pockets,location:s.location,quest:s.quest,provenance});
            card.replaceChildren();
            const title=document.createElement('h3');title.textContent='Your beginning';card.append(title);
            for(const l of layers) {
                const p=document.createElement('p');
                p.textContent=hidden.includes(l.axis) ? `${l.axis}: not yet known` : (l.patch.text || []).join(' ') || `${l.axis}: nothing special`;
                card.append(p);
            }
            const pocketsTitle=document.createElement('h4');pocketsTitle.textContent='In your pockets';card.append(pocketsTitle);
            const pockets=document.createElement('ul');pockets.dataset.startPockets='';
            for(const pocket of s.pockets) {
                const item=document.createElement('li');
                item.textContent=hidden.includes(pocket.axis) ? "Something from your past you can't place yet." : `${pocket.itemId}: ${pocket.line}`;
                pockets.append(item);
            }
            card.append(pockets);
            const seedLine=document.createElement('p');seedLine.className='start-seed';seedLine.textContent=`Seed: ${provenance.seed}`;card.append(seedLine);
            use.disabled=false;
        } catch(error) {
            resolved=null;delete card.dataset.startResolved;card.textContent=`This combination is unavailable. ${error.message}`;use.checked=false;use.disabled=true;
        }
    }
    seed.addEventListener('input',()=>{resolved=null;delete card.dataset.startResolved;card.textContent='Roll to preview this seed.';use.checked=false;use.disabled=true;});
    section.querySelector('[data-start-roll-button]').addEventListener('click',roll);roll();
    // Read the recipe held by the module, never mutable DOM JSON.
    return {selected:()=>use.checked && resolved ? structuredClone(resolved) : null};
}
