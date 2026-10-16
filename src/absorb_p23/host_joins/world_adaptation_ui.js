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
        if(f.preview){text('Spend one Cloudseed dose and 2 condensate. Twelve played minutes. 75% success awards native Meditation XP.');text(f.preview.risk);}
        for(const a of f.actions||[]){const b=document.createElement('button');b.textContent=a.label;b.dataset.mistglassAction=a.id;b.disabled=f.disabled||a.enabled===false;b.title=f.disabled?'Finish your current work in the writable game tab.':a.reason||'';
            b.onclick=()=>{try{act(a.id);notice.textContent='';}catch(e){notice.textContent=e.message;}render();};body.append(b);}
        panel.classList.toggle('success',!!v?.cue&&v.cue==='success');panel.classList.toggle('failure',!!v?.cue&&v.cue==='failure');
    }
    render();return {render};
}
