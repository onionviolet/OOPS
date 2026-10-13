import {packConditions} from './content_packs.js';
export function createContentPackPanel({definitions,read,command}) {
    if(!definitions.size)return null;
    const panel=document.createElement('details');panel.id='optional_content_panel';panel.open=true;
    const summary=document.createElement('summary');summary.textContent='Optional worlds';panel.append(summary);
    const body=document.createElement('div');panel.append(body);let signature,notice='';
    const button=(label,id,fn,disabled=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.packAction=id;b.disabled=disabled;b.onclick=()=>{try{fn();notice='Saved.';}catch(error){notice=error.message;}render(true);};return b;};
    function render(force=false) {
        // Native location refreshes can detach the panel without changing its view.
        const host=document.getElementById('location_actions_div');if(host&&panel.parentElement!==host)host.prepend(panel);
        const view=read(),next=JSON.stringify(view);if(!force&&signature===next)return;signature=next;body.replaceChildren();
        const p=text=>{const n=document.createElement('p');n.textContent=text;body.append(n);};
        const active=Object.entries(view.state.packs).find(([,r])=>r.active);
        for(const [id,d] of definitions) {
            if(active&&active[0]!==id)continue;
            const row=view.state.packs[id];p(d.title);
            if(!row?.active) {p(d.description);body.append(button('Visit '+d.title,id+'.enter',()=>command(id,'enter'),!view.canEnter));continue;}
            p(d.locations[0].label);p(d.locations[0].description);
            p(d.people.map(person=>person.label+': '+(person.memoryField&&d.displays?.[person.memoryField]?.[row.values[person.memoryField]]||person.description||'')).join(' · '));
            for(const [key,label] of Object.entries(d.status||{}))p(label+': '+(d.displays?.[key]?.[row.values[key]]??row.values[key]));
            if(view.reference)p('Tessa’s reference recognizes your resolved Village patrol history. Local rank remains separate.');
            if(row.job)p((d.activities.find(a=>a.id===row.job.actionId)?.label||'Local work')+' · '+row.job.remaining+' played minutes remaining. Leaving pauses this work without pay.');
            for(const a of d.activities)if(packConditions(row.values,a.visibleWhen)) {
                p(a.description);body.append(button(a.label,a.id,()=>command(id,a.id),!view.canAct||!!row.job||!packConditions(row.values,a.requires)));
            }
            body.append(button('Return to Village',id+'.return',()=>command(id,'return'),!view.canAct));
        }
        if(notice)p(notice);
    }
    render();const timer=setInterval(render,250);return {render,destroy(){clearInterval(timer);panel.remove();}};
}
