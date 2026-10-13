// The host supplies an observer-safe projection. This panel never reads pack
// definitions. Explicit session repeats dispatch through normal host commands.
export function createStructuredPackPanel({read,command}) {
    const panel=document.createElement('details');panel.id='structured_pack_panel';panel.open=true;
    const summary=document.createElement('summary');summary.textContent='Your beginning';panel.append(summary);
    const body=document.createElement('div');panel.append(body);let signature,notice='',repetition=null;
    const projected=()=>{const v=read();return {
        available:!!v.available,active:!!v.active,title:v.title,place:v.place,description:v.description,
        people:(v.people||[]).map(p=>({name:p.name,details:p.details||[]})),
        status:(v.status||[]).map(s=>({label:s.label,value:s.value})),
        actions:(v.actions||[]).map(a=>({id:a.id,label:a.label,description:a.description,eligible:!!a.eligible,reasons:a.reasons||[],duration:a.duration||0,costs:a.costs||[],completed:a.completed||0,repeatable:!!a.repeatable})),
        jobs:(v.jobs||[]).map(j=>({id:j.id,commandId:j.commandId,label:j.label,remaining:j.remaining,duration:j.duration||0,cancellable:!!j.cancellable})),
        beginLabel:v.beginLabel,renewal:v.renewal?{visible:!!v.renewal.visible,eligible:!!v.renewal.eligible,label:v.renewal.label,description:v.renewal.description,lost:v.renewal.lost,retain:v.renewal.retain,reward:v.renewal.reward,reasons:v.renewal.reasons}:null,canWrite:!!v.canWrite,error:v.error};};
    const button=(label,data,request,disabled)=>{
        const b=document.createElement('button');b.type='button';b.textContent=label;Object.assign(b.dataset,data);b.disabled=disabled;
        b.onclick=()=>{
            repetition=null;
            if(request.type==='stop-repeat'){notice='Further repetitions stopped. Current work continues.';render(true);return;}
            const times=request.times||1,actual={...request};delete actual.times;
            const before=projected().actions.find(a=>a.id===actual.id);
            try{command(actual);notice='Saved.';
                if(times>1){const job=projected().jobs.find(j=>j.commandId===actual.id);
                    if(job)repetition={id:actual.id,label:before.label,remaining:times-1,jobId:job.id,completed:before.completed};}
            }catch{notice=projected().error||'The action could not be saved.';}render(true);
        };return b;
    };
    function render(force=false) {
        const host=document.getElementById('location_actions_div');if(host&&panel.parentElement!==host)host.prepend(panel);
        const view=projected();
        if(repetition&&(!view.canWrite||view.error)){notice='Repeated work stopped. '+(view.error||'Restore saving before continuing.');repetition=null;}
        if(repetition&&!view.jobs.some(j=>j.id===repetition.jobId)){
            const a=view.actions.find(a=>a.id===repetition.id);
            if(!view.canWrite||view.error||!a?.eligible||!a.repeatable||a.completed!==repetition.completed+1){
                notice='Repeated work stopped. '+(view.error||a?.reasons?.join(' ')||'The work is no longer available.');repetition=null;
            }else{
                const pending=repetition;repetition=null;
                try{command({type:'action',id:pending.id});const fresh=projected(),job=fresh.jobs.find(j=>j.commandId===pending.id);
                    pending.remaining--;pending.completed=a.completed;pending.jobId=job?.id;
                    if(job&&pending.remaining>0)repetition=pending;
                    notice='Next repetition saved.';
                }catch{notice=projected().error||'Repeated work could not be saved.';repetition=null;}
                return render(true);
            }
        }
        const next=JSON.stringify({view,repetition,notice});if(!force&&signature===next)return;signature=next;
        const focused=document.activeElement,focusKey=focused&&body.contains(focused)?Object.entries(focused.dataset||{}).find(([key])=>key.startsWith('structured')):null;
        body.replaceChildren();
        panel.hidden=!view.available&&!view.active;
        const p=text=>{if(text==null||text==='')return;const n=document.createElement('p');n.textContent=String(text);body.append(n);};
        if(view.available||view.active){
            p(view.title);p(view.description);
            if(!view.active)body.append(button(view.beginLabel||'Begin',{structuredBegin:'begin'},{type:'begin'},!view.canWrite));
            else {
                p(view.place);
                for(const person of view.people){p(person.name);for(const detail of person.details)p(detail);}
                for(const row of view.status)p(`${row.label}: ${row.value}`);
                for(const job of view.jobs){p(`${job.label} · ${job.remaining} played minutes remaining.`);
                    if(job.duration>0){const progress=document.createElement('progress');progress.max=job.duration;progress.value=Math.max(0,Math.min(job.duration,job.duration-job.remaining));progress.setAttribute?.('aria-label',job.label+' progress');body.append(progress);}
                    if(job.cancellable)body.append(button('Cancel '+job.label,{structuredCancel:job.id},{type:'cancel',jobId:job.id},!view.canWrite));}
                if(repetition){p(`${repetition.label}: ${repetition.remaining} further repetitions planned. Each rechecks inputs; closing this page stops the plan.`);
                    body.append(button('Stop repeated work',{structuredRepeat:'stop'},{type:'stop-repeat'},false));}
                if(view.renewal?.visible){
                    p(view.renewal.label);p(view.renewal.description);
                    for(const text of view.renewal.lost||[])p(text);
                    for(const text of view.renewal.retain||[])p(text);p(view.renewal.reward);
                    for(const reason of view.renewal.reasons||[])p(reason);
                    body.append(button('Accept renewal',{structuredRenewal:'accept'},{type:'renewal'},!view.canWrite||!view.renewal.eligible));
                }
                for(const action of view.actions){p(action.description);
                    p(action.duration>0?`${action.duration} played minutes.`:'Immediate.');
                    if(action.costs.length)p('Inputs: '+action.costs.join(', ')+'.');
                    for(const reason of action.reasons)p(reason);
                    body.append(button(action.label,{structuredAction:action.id},{type:'action',id:action.id},!view.canWrite||!action.eligible));
                    if(action.repeatable)body.append(button('Repeat '+action.label+' 3 times',{structuredRepeat:action.id},{type:'action',id:action.id,times:3},!view.canWrite||!action.eligible));}
            }
            p(view.error||notice);
        }
        if(focusKey){const find=node=>node.dataset?.[focusKey[0]]===focusKey[1]?node:[...node.children].map(find).find(Boolean);find(body)?.focus();}
    }
    render();const timer=setInterval(render,250);return {render,destroy(){clearInterval(timer);panel.remove();}};
}
