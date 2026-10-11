import {FORT,ORDERS,itemSourceJournal,migrateFortSupply} from './fort.js';

// A projection inside native center actions; transactions belong to the caller.
export function createFortControls({read,act,document=globalThis.document}) {
    const panel=document.createElement('div');panel.id='fort_supply_panel';panel.className='village_career_panel';
    const title=document.createElement('strong'),text=document.createElement('div'),buttons=document.createElement('div'),journal=document.createElement('div');
    title.textContent='Waypost supply clerk';panel.append(title,text,buttons,journal);
    let previous='';
    function render(){
        const view=read();
        if(view.worldId!=='base.frontier'||!['Village',FORT.post].includes(view.location)){panel.remove();return;}
        const host=document.getElementById('location_actions_div');if(!host)return;
        if(panel.parentElement!==host)host.prepend(panel);
        const fingerprint=JSON.stringify(view);if(previous===fingerprint)return;previous=fingerprint;
        const f=migrateFortSupply({fort_supply:view.fort});
        text.textContent=`Clerk purse: ${f.funds} coins. Paid so far: ${f.spent}. Supplies change hands immediately; no shift, promotion or patrol credit. `+
            (f.repaired?'Cellar hatch repaired.':f.notesIssued?'Read the repair notes; clear the yard, then bring three ore and one iron ingot to the Fort.':'After one Infested field clear the clerk offers free repair notes, or buy a copy for 10 coins.');
        const controls=[];
        const button=(id,label,disabled=false)=>{const b=document.createElement('button');b.type='button';b.dataset.fortAction=id;b.textContent=label;b.disabled=!!view.disabled||disabled;
            b.onclick=()=>{try{act(id);previous='';render();}catch(error){text.textContent=error.message;}};controls.push(b);};
        if(!f.notesIssued){button('notes','Ask for repair notes (one field clear)',!(view.fieldClears>=1));button('buy_notes','Buy repair notes (10 coins)',view.money<10);}
        else for(const [id,o] of Object.entries(ORDERS))button(`deliver:${id}`,`${o.name}: ${o.count} ${o.item} → ${o.pay} coins`,f.funds<o.pay||(view.stock?.[o.item]||0)<o.count);
        if(view.location===FORT.post&&!f.repaired)button('repair','Repair hatch: 3 ore + 1 iron ingot',!view.notesRead||!(view.yardClears>=1)||(view.stock?.['Iron ore']||0)<3||(view.stock?.['Iron ingot']||0)<1);
        buttons.replaceChildren(...controls);
        const entries=itemSourceJournal(f,view.knownItems);
        journal.replaceChildren();
        if(entries.length){const heading=document.createElement('strong');heading.textContent='Learned item sources';journal.append(heading);
            for(const edge of entries){const row=document.createElement('div');row.textContent=`${edge.itemId}: ${edge.label} (${edge.certainty}, ${edge.kind})`;journal.append(row);}}
    }
    render();return {render,destroy:()=>panel.remove()};
}
