import {cultivationMethods} from '../world_adaptation/index.js';
// Native P12 presenter. No simulation, RNG, inventory or save writes here.
export function createMistglassPanel({host,read,act}){
    const panel=document.createElement('details');panel.id='p23_mistglass_panel';panel.className='expedition_panel';
    const summary=document.createElement('summary');summary.textContent='Mistglass conservatory (opt-in proposal)';
    const body=document.createElement('div'),notice=document.createElement('p');panel.append(summary,body,notice);host.append(panel);
    const text=t=>{const p=document.createElement('p');p.textContent=t;body.append(p);};
    function render(){
        const f=read();body.replaceChildren();panel.hidden=!f.visible;
        if(panel.parentElement!==host)host.append(panel);
        if(!f.inside)text('An original optional test world. Enter with your present body and bag, then explicitly learn its method. Frontier is unchanged.');
        const v=f.view;
        if(v){text(`Condensate: ${v.reserve} / ${v.capacity}. Conservatory mist: +${v.ratePerMinute} per played minute.`);
            if(v.pending)text(`Purification trial ${v.pending.id}: ${v.pending.remainingMinutes} played minutes remaining.`);
            if(v.last)text(`Trial ${v.last.id}: ${v.last.outcome} (${v.last.reason}).`);
            if(f.rawRemaining)text(`Rawness blocks absorption and another trial for ${f.rawRemaining} played minutes.`);
        }
        if(v){const t=v.technique;text(`${t.label}: ${t.stage}${t.id==='mist'?'':` · ${t.minutes} practiced minutes`}${t.nextAt===null?'':` · next stage at ${t.nextAt}`}.`);text(t.description);if(v.pending)text('Practice pauses during purification; the trial retains its starting odds.');}
        if(f.sluice){const w=f.sluice;text(`Outflow sluice: ${w.jammed?'jammed':'running clear'}. Clearing it drives ${w.output/1000} condensate of pressure; ${w.method} (${w.stage}) spends ${w.cost/1000}${w.cost<w.baseCost?` instead of ${w.baseCost/1000}`:''}. ${w.pays==='reputation'?'Clearing it discharges the conservatory’s duty to the Village and earns standing there.':`The keeper pays ${w.wageCoins} coins per cleared jam.`}`);}
        if(f.history)text(f.history);
        if(v?.pathWork&&f.inside){const w=v.pathWork;text(`Precise path work: ${w.label||'choose a practiced method'}. Source: ${w.source}${w.quality?`; current material quality ${w.quality}`:''}. Frontier physical hides are compatible here; the charge stays bound to this body and instance.`);
            if(w.prepared)text(`Committed reserve: ${w.prepared.path}, control ${w.prepared.control}. Its 1 condensate is held for this work; it cannot also fund a trial. Conversion inputs remain spent on abandonment.`);
            if(w.last)text(`Last precise work: ${w.last.productId}, quality ${w.last.quality}, control ${w.last.control}.`);
            for(const [id,label,enabled] of [['prepare','Prepare this path’s reserve · 1 condensate; refinement also uses a dose',!!w.label&&!w.prepared],['cut','Flow-cut one owned pelt',w.prepared?.path==='breath'],['set','Set-grain one owned pelt',w.prepared?.path==='settling'],['discard','Abandon the committed preparation',!!w.prepared]]){const b=document.createElement('button');b.textContent=label;b.dataset.mistglassAction='method:path:'+id;const q=v.pathQuotes?.[id];b.disabled=f.disabled||!v.supported||!!v.pending||!enabled||q?.eligible===false;b.title=q?.reason||'';b.onclick=()=>{try{act('method:path:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}}

        if(v?.history){const h=v.history;if(h.consequence)text(h.consequence+' '+h.terms);for(const [id,label,enabled] of [['inspect','Inspect the surviving outflow masonry',h.heard],['restore','Restore the old outflow brace · 1 rough log',h.inspected&&!h.restored]]){const b=document.createElement('button');b.textContent=label;b.dataset.mistglassAction='method:history:'+id;b.disabled=f.disabled||!f.inside||!enabled;b.onclick=()=>{try{act('method:history:'+id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}}
        if(f.preview){text(`Spend one Cloudseed dose and 2 condensate. Twelve played minutes. ${f.preview.successPercent}% success awards 30 native Meditation XP.`);text(f.preview.risk);}
        const methods=v&&f.inside?Object.entries(cultivationMethods).map(([id,m])=>({id:`method:${id}`,label:m.label,enabled:!v.pending&&!v.pathWork?.prepared&&v.supported&&v.technique.id!==id,reason:'Finish purification or rawness before switching; the active method is already selected.'})):[];
        if(methods.length){text('Practice stages: learning → practiced at 16 → integrated at 48 played mist minutes. Practice pauses during purification, rawness and absence.');for(const m of Object.values(cultivationMethods))text(`${m.label}: condensate/min ${m.rates.map(n=>n/1000).join(' → ')}; purification ${m.odds.map(n=>n/100+'%').join(' → ')}.`);}
        for(const a of [...(f.actions||[]),...methods]){const b=document.createElement('button');b.textContent=a.label;b.dataset.mistglassAction=a.id;b.disabled=f.disabled||a.enabled===false;b.title=f.disabled?'Finish your current work in the writable game tab.':a.reason||'';
            b.onclick=()=>{try{act(a.id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}
        panel.classList.toggle('success',!!v?.cue&&v.cue==='success');panel.classList.toggle('failure',!!v?.cue&&v.cue==='failure');
    }
    render();return {render};
}
