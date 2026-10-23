import {definePanel} from './panel_kit.js';
// Desktop-first records panel for the manor household (IM9, IM10, OG16, IM32). Reads the observer-safe
// projection only; the hidden disposition is never in it, so it cannot be drawn here (AR8).
const el=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
const pct=v=>Math.round(v*100)+'%';
export function createFortunesPanel({read,obligations,setRoutinePaused}){
    const panel=el('section');panel.id='household_fortunes_panel';panel.className='expedition_panel';
    const body=el('div'),notice=el('p');notice.setAttribute('role','status');
    panel.append(el('h2','Household fortunes'),el('p','What the household can see of its people. Nobody here knows who is nearer to awakening; the list ranks what you have noticed.'),body,notice);
    let signature='';
    function section(title){const d=el('details');d.open=true;d.append(el('summary',title));body.append(d);return d;}
    function render(){
        const view=read();if(!panel.isConnected)return;
        const rows=obligations?.()||[];
        const sig=JSON.stringify([view,rows]);if(sig===signature)return;signature=sig;
        body.replaceChildren();
        if(!view.visible){body.append(el('p','The manor household has not been seen yet.'));return;}
        const watch=section('Watch list');
        if(!view.watch.length)watch.append(el('p','Nobody is left to watch.'));
        for(const w of view.watch)watch.append(el('p',`${w.name} · circumstances ${w.score}${w.signs?` · ${w.signs} sign${w.signs===1?'':'s'} noticed`:''}`));
        const staff=section('Staff, part by part');
        for(const s of view.staff){
            const head=s.dead?`${s.name} · ${s.role} · died`:`${s.name} · ${s.role}${s.awakened?' · has awakened':''}`;
            const box=el('div');box.dataset.fortuneStaff=s.id;box.append(el('strong',head));
            if(!s.dead)for(const p of s.parts)box.append(el('p',`${p.label} ${pct(p.value)} — ${p.why}`));
            staff.append(box);
        }
        const rec=section('Household record');
        rec.append(el('p',`Standing ${view.household.standing} · resentment ${view.household.resentment}. Both ease with decent treatment; nothing locks.`));
        if(!view.household.ledger.length)rec.append(el('p','No one has died in this household’s care.'));
        for(const r of view.household.ledger)rec.append(el('p',`Day ${r.at}: ${r.note} (${r.cause.replace('_',' ')})`));
        const rt=section('Standing routines');
        for(const r of view.routines){
            const unlocked=r.count>=r.threshold,row=el('p',unlocked?`${r.why} ${r.paused?'Stopped by you.':'Running when needed.'}`:`${r.task} ${r.count}/${r.threshold} completions before it becomes habit.`);
            row.dataset.fortuneRoutine=r.id;rt.append(row);
            if(unlocked){const b=el('button',r.paused?'Resume routine':'Stop routine');b.type='button';b.dataset.fortuneRoutineToggle=r.id;
                b.onclick=()=>{try{setRoutinePaused(r.id,!r.paused);signature='';render();}catch(e){notice.textContent=e.message;}};rt.append(b);}
        }
        rt.append(el('small','A routine stops when you are mid-task yourself, when the purse could not bear it, or when you tell it to.'));
        const ob=section('Obligations');
        if(!rows.length)ob.append(el('p','Nothing is owed or held against you.'));
        for(const o of rows)ob.append(el('p',`${o.kind} · ${o.amount} · ${o.creditor} — ${o.why}${o.eases?' (eases with time)':''}`));
    }
    definePanel({id:'household-fortunes',title:'Household',role:'records',node:panel,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>read().visible,eligible:()=>read().visible});
    render();return {render};
}
