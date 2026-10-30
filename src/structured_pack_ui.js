import {registerWorkspaceModule, workspaceOwns, unregisterWorkspaceModule} from './workspace_layout.js';
import {setText} from './dom_sync.js';
import {renderFigure} from './ui/figure.js';
// The host supplies an observer-safe projection. This panel never reads pack
// definitions. Explicit session repeats dispatch through normal host commands.
// Optional `changed()` returns the host's cheap change token (an array compared
// element by element); the 250 ms poll then reads only after it moves. Without
// it the poll reads every time, as before.
export function createStructuredPackPanel({read,command,changed}) {
    const panel=document.createElement('details');panel.id='structured_pack_panel';panel.open=true;
    const summary=document.createElement('summary');summary.textContent='Your beginning';panel.append(summary);
    const body=document.createElement('div');panel.append(body);let signature,notice='',repetition=null,noticeError=false;
    const node=(tag,parent)=>{const n=document.createElement(tag);parent.append(n);return n;};
    const live={info:node('section',body)},work=node('section',body);live.plans=node('section',body);live.renewal=node('section',body);const actions=node('section',body),message=node('p',body);
    const actionRows=new Map(),jobRows=new Map(),sectionRows={};
    const trim=(cache,ids)=>{for(const [id,row]of cache)if(!ids.has(id)){if(row.card.contains(document.activeElement))summary.focus?.();row.card.remove();cache.delete(id);}};
    const projected=()=>{const v=read();return {
        expeditions:(v.expeditions||[]).map(s=>({id:s.id,label:s.label,phase:s.phase,injury:s.injury})),available:!!v.available,active:!!v.active,title:v.title,place:v.place,description:v.description,
        people:(v.people||[]).map(p=>({name:p.name,details:p.details||[]})),
        status:(v.status||[]).map(s=>({label:s.label,value:s.value})),ladder:v.ladder||null,
        actions:(v.actions||[]).map(a=>({id:a.id,label:a.label,description:a.description,eligible:!!a.eligible,reasons:a.reasons||[],duration:a.duration||0,costs:a.costs||[],completed:a.completed||0,repeatable:!!a.repeatable})),
        jobs:(v.jobs||[]).map(j=>({id:j.id,commandId:j.commandId,label:j.label,remaining:j.remaining,duration:j.duration||0,cancellable:!!j.cancellable})),
        extensions:v.extensions||[],choices:v.choices||[],selectedBeginning:v.selectedBeginning||'',beginningHash:v.beginningHash||'',arrival:v.arrival||null,pauseReason:v.pauseReason||'',beginLabel:v.beginLabel,renewal:v.renewal?{visible:!!v.renewal.visible,eligible:!!v.renewal.eligible,label:v.renewal.label,description:v.renewal.description,lost:v.renewal.lost,retain:v.renewal.retain,reward:v.renewal.reward,reasons:v.renewal.reasons}:null,canWrite:!!v.canWrite,error:v.error};};
    const button=(label,data,request,disabled)=>{
        const b=document.createElement('button');b.type='button';b.textContent=label;Object.assign(b.dataset,data);b.disabled=disabled;
        b.onclick=()=>{
            repetition=null;
            if(request.type==='stop-repeat'){notice='Further repetitions stopped. Current work is unchanged.';render(true);return;}
            const times=request.times||1,actual={...request};delete actual.times;
            const before=projected().actions.find(a=>a.id===actual.id);
            try{command(actual);noticeError=false;const after=projected();notice=actual.type==='cancel'?'Command saved. Selected work stopped.':actual.type==='action'&&!after.jobs.some(j=>j.commandId===actual.id)&&after.actions.find(a=>a.id===actual.id)?.completed>before.completed?'Command saved. Action settled.':'Command saved.';
                if(times>1){const job=projected().jobs.find(j=>j.commandId===actual.id);
                    if(job)repetition={id:actual.id,label:before.label,remaining:times-1,jobId:job.id,completed:before.completed};}
            }catch{noticeError=true;notice=projected().error||'The action could not be saved.';}render(true);
        };return b;
    };
    let token=null;
    const moved=()=>{if(!changed)return true;const next=changed();const same=token&&next.length===token.length&&next.every((v,i)=>Object.is(v,token[i]));token=next;return !same;};
    function render(force=false) {
        if(changed)token=changed();
        const host=document.getElementById('location_actions_div');if(host&&!workspaceOwns(panel)&&panel.parentElement!==host)host.append(panel);
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
                    notice='Next repetition command saved.';
                }catch{noticeError=true;notice=projected().error||'Repeated work could not be saved.';repetition=null;}
                return render(true);
            }
        }
        const next=JSON.stringify({view,repetition,notice});if(!force&&signature===next)return;signature=next;
        const focused=document.activeElement,focusKey=focused&&body.contains(focused)?Object.entries(focused.dataset||{}).find(([key])=>key.startsWith('structured')):null;
        panel.hidden=!view.available&&!view.active;
        // Prose, plans and renewal build detached; a live section is replaced only
        // when its own rows (text, controls, disabled state) differ from last time.
        const info=document.createElement('section'),plans=document.createElement('section'),renewal=document.createElement('section');
        const rows=new Map([[info,[]],[plans,[]],[renewal,[]]]);
        const p=(text,parent=info)=>{if(text==null||text==='')return;const n=node('p',parent);n.textContent=String(text);rows.get(parent).push(['p',n.textContent]);return n;};
        const add=(parent,label,data,request,disabled)=>{parent.append(button(label,data,request,disabled));rows.get(parent).push(['b',label,data,request,disabled]);};
        const ladderBlock=(parent,ladder)=>{const fig=node('div',parent),words=node('details',parent);fig.dataset.structuredLadder='';words.dataset.structuredLadderText='';
            const {text}=renderFigure(fig,ladder.spec,{idPrefix:'structured-ladder'});
            words.append(Object.assign(document.createElement('summary'),{textContent:'Read the ladder as text'}),Object.assign(document.createElement('pre'),{textContent:text,className:'fig-text'}));
            rows.get(parent).push(['ladder',text]);};
        live.info.hidden=work.hidden=live.plans.hidden=live.renewal.hidden=actions.hidden=!(view.available||view.active);
        if(view.available||view.active){
            p(view.arrival?.label||view.title);if(!view.arrival)p(view.description);
            if(!view.active){
                if(view.choices.length){
                    p('Choosing a life previews it. Confirm to leave Village; cancel to keep your opening.');
                    const label=node('label',info);label.textContent='Optional world and life ';
                    const select=node('select',label);select.dataset.structuredChoice='life';select.setAttribute('aria-label','Optional world and life');select.disabled=!view.canWrite;
                    for(const choice of [{packId:'',label:'Keep my current opening'},...view.choices]){const option=node('option',select);option.value=choice.packId;option.textContent=choice.label;}
                    select.value=view.selectedBeginning;
                    select.onchange=()=>{try{command(select.value?{type:'select-beginning',packId:select.value}:{type:'cancel-beginning'});notice='';noticeError=false;}catch{noticeError=true;notice=projected().error||'This beginning is unavailable.';}render(true);};
                    rows.get(info).push(['choices',view.choices,view.selectedBeginning,view.canWrite]);
                }
                add(info,view.arrival?'Confirm arrival':view.beginLabel||'Begin',{structuredBegin:'begin'},{type:'begin',...(view.selectedBeginning?{packId:view.selectedBeginning,contentHash:view.beginningHash}:{})},!view.canWrite);
                if(view.arrival){
                    add(info,'Cancel life choice',{structuredChoiceCancel:'cancel'},{type:'cancel-beginning'},!view.canWrite);
                    p(view.arrival.arrival);p(view.arrival.means);
                    p('Carried cargo, equipment and Frontier coins stay yours, unchanged. Local supplies arrive once; local units do not convert Frontier coins.');
                }
            }
            else {
                p(view.place);
                for(const site of view.expeditions)p(`${site.label}: ${site.phase}${site.injury>0?' · treatment needed':''}`);
                for(const person of view.people){p(person.name);for(const detail of person.details)p(detail);}
                for(const row of view.status)p(`${row.label}: ${row.value}`);
                if(view.ladder)ladderBlock(info,view.ladder);
                for(const e of view.extensions){
                    p(e.description);for(const reason of e.reasons)p(reason);
                    add(info,'Choose '+e.label,{structuredExtension:e.id},{type:'adopt-extension',id:e.id,revision:e.revision,contentHash:e.contentHash},!view.canWrite||!e.eligible);
                }
                for(const job of view.jobs){
                    let row=jobRows.get(job.id);
                    if(!row){const card=node('section',work);card.className='action-legibility__card action-legibility__work';card.dataset.structuredJob=job.id;
                        const text=node('p',card),progress=node('progress',card),cancel=button('Cancel '+job.label,{structuredCancel:job.id},{type:'cancel',jobId:job.id},false);card.append(cancel);row={card,text,progress,cancel};jobRows.set(job.id,row);}
                    setText(row.text,`${job.label} · ${view.pauseReason?view.pauseReason+' ':!view.canWrite?'Paused until saving is restored. ':'Running. '}${job.remaining} played minutes remaining.`);
                    row.progress.hidden=!(job.duration>0);row.progress.max=job.duration;row.progress.value=Math.max(0,Math.min(job.duration,job.duration-job.remaining));row.progress.setAttribute?.('aria-label',job.label+' progress');
                    setText(row.cancel,'Cancel '+job.label);row.cancel.hidden=!job.cancellable;row.cancel.disabled=!view.canWrite;
                }
                if(repetition){p(`${repetition.label}: ${repetition.remaining} further repetitions planned. Each rechecks inputs; closing this page stops the plan.`,plans);
                    add(plans,'Stop repeated work',{structuredRepeat:'stop'},{type:'stop-repeat'},false);}
                if(view.renewal?.visible){
                    p(view.renewal.label,renewal);p(view.renewal.description,renewal);
                    for(const text of view.renewal.lost||[])p(text,renewal);
                    for(const text of view.renewal.retain||[])p(text,renewal);p(view.renewal.reward,renewal);
                    for(const reason of view.renewal.reasons||[])p(reason,renewal);
                    add(renewal,'Accept renewal',{structuredRenewal:'accept'},{type:'renewal'},!view.canWrite||!view.renewal.eligible);
                }
                for(const action of view.actions){
                    let row=actionRows.get(action.id);
                    if(!row){const card=node('section',actions);card.className='action-legibility__card';card.dataset.structuredRow=action.id;
                        const heading=node('h4',card),description=node('p',card),state=node('p',card),duration=node('p',card),costs=node('p',card),blockers=node('p',card);
                        const act=button(action.label,{structuredAction:action.id},{type:'action',id:action.id},false),repeat=button('',{structuredRepeat:action.id},{type:'action',id:action.id,times:3},false);card.append(act,repeat);
                        row={card,heading,description,state,duration,costs,blockers,act,repeat};actionRows.set(action.id,row);}
                    setText(row.heading,action.label);setText(row.description,action.description||'');
                    const pending=view.jobs.find(j=>j.commandId===action.id);setText(row.state,pending?(view.pauseReason?view.pauseReason+' ':!view.canWrite?'Paused. ':'Running. ')+pending.remaining+' played minutes remaining.':action.completed>0?'Settled completions: '+action.completed+'.':action.eligible?'Available.':'Unavailable.');
                    setText(row.duration,'Time quote: '+(action.duration>0?`${action.duration} played minutes.`:'Immediate.'));
                    setText(row.costs,'Inputs: '+(action.costs.length?action.costs.join(', ')+'.':'None quoted.'));
                    setText(row.blockers,action.reasons.join(' '));row.blockers.hidden=!action.reasons.length;row.blockers.dataset.themeState='warning';
                    for(const [key,n]of [['duration',row.duration],['costs',row.costs],['blockers',row.blockers]])n.id='structured-'+encodeURIComponent(action.id)+'-'+key;
                    row.act.setAttribute?.('aria-describedby',[row.duration.id,row.costs.id,...(action.reasons.length?[row.blockers.id]:[])].join(' '));
                    setText(row.act,action.label);row.act.disabled=!view.canWrite||!action.eligible;
                    setText(row.repeat,'Repeat '+action.label+' 3 times');row.repeat.hidden=!action.repeatable;row.repeat.disabled=row.act.disabled;
                }
            }
        }
        for(const [key,fresh] of [['info',info],['plans',plans],['renewal',renewal]]){const sig=JSON.stringify(rows.get(fresh));if(sectionRows[key]!==sig){sectionRows[key]=sig;live[key].replaceChildren(...fresh.children);}}
        trim(actionRows,new Set(view.active?view.actions.map(a=>a.id):[]));trim(jobRows,new Set(view.active?view.jobs.map(j=>j.id):[]));
        setText(message,view.error||notice);message.hidden=!message.textContent;
        message.dataset.themeState=view.error||noticeError?'error':'status';message.setAttribute('role',view.error||noticeError?'alert':'status');
        if(focusKey){const find=node=>node.dataset?.[focusKey[0]]===focusKey[1]?node:[...node.children].map(find).find(Boolean);find(body)?.focus();}
    }
    render();registerWorkspaceModule({id:'beginning',title:'Your beginning',node:panel,home:'right',eligible:()=>!panel.hidden});const timer=setInterval(()=>{if(moved())render();},250);return {render,destroy(){clearInterval(timer);unregisterWorkspaceModule('beginning');panel.remove();}};
}
