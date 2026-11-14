import {registerWorkspaceModule, workspaceOwns, unregisterWorkspaceModule, expandWorkspaceModule} from './workspace_layout.js';
import {setText} from './dom_sync.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
import {formatDuration} from './number_format.js';
import {renderFigure} from './ui/figure.js';
import {renderGuHouse} from './ui/gu_house_view.js';
import {createBookCraftControls} from './ui/book_craft_controls.js';
// The host supplies an observer-safe projection. This panel never reads pack
// definitions. Explicit session repeats dispatch through normal host commands.
// Optional `changed()` returns the host's cheap change token (an array compared
// element by element); the 250 ms poll then reads only after it moves. Without
// it the poll reads every time, as before.
export function createStructuredPackPanel({read,command,changed,localActions=null}) {
    const NOT_YET_SHOWN=3,NEXT_SHUT=1;
    // G16: when the life's own text says nothing about an act, the panel still names what just happened.
    // G16: an instant act whose outcome the life writes as a note (a status row read from knowledge) shows that note, so a drawn outcome is read
    // where it happened rather than folded under Details. Only note rows count; a changed count or meter is not an outcome.
    const changedNote=(beforeStatus,after)=>after.status.filter(r=>r.note&&r.value&&!beforeStatus.some(b=>b.note&&b.label===r.label&&b.value===r.value)).map(r=>r.value).join(' ');
    const resultLine=(actual,before,after,beforeStatus=[])=>{const label=before?.label||'';
        if(actual.type==='cancel')return 'Stopped. The work is set down where it was.';
        const job=after.jobs.find(j=>j.commandId===actual.id);
        if(job)return `Started: ${label||job.label}. ${formatDuration(job.remaining)} to go.`;
        if(actual.type==='action'&&after.actions.find(a=>a.id===actual.id)?.completed>(before?.completed||0)){const note=changedNote(beforeStatus,after);return note?`Done: ${label}. ${note}`:`Done: ${label}.`;}
        return label?`Chosen: ${label}.`:'Done.';};
    const panel=document.createElement('details');panel.id='structured_pack_panel';panel.open=true;
    const summary=document.createElement('summary');summary.textContent='Your beginning';panel.append(summary);
    // AR17: a shared fight panel (tempo openers) renders in the encounter slot; the body re-renders, the slot does not.
    const body=document.createElement('div'),encounterSlot=document.createElement('div');encounterSlot.dataset.sharedSlot='encounter';panel.append(body);body.append(encounterSlot);let signature,notice='',repetition=null,noticeError=false;
    const node=(tag,parent)=>{const n=document.createElement(tag);parent.append(n);return n;};
    const live={info:node('section',body),steps:node('section',body)},work=node('section',body);live.plans=node('section',body);live.renewal=node('section',body);const actions=node('section',body),message=node('p',body);
    const craft=createBookCraftControls(command);body.insertBefore(craft.element,message);
    // OPN2/OPN4: actions that cannot run yet wait in one closed list, each with its reason, so the opening lists what you can do now.
    const notYet=document.createElement('details'),notYetSummary=node('summary',notYet),notYetList=node('div',notYet);notYet.className='action-legibility__not-yet';notYet.hidden=true;
    const actionRows=new Map(),jobRows=new Map(),sectionRows={};let statusOpen=false;
    const trim=(cache,ids)=>{for(const [id,row]of cache)if(!ids.has(id)){if(row.card.contains(document.activeElement))summary.focus?.();row.card.remove();cache.delete(id);}};
    const projected=()=>{const v=read();return {
        expeditions:(v.expeditions||[]).map(s=>({id:s.id,label:s.label,phase:s.phase,injury:s.injury})),available:!!v.available,active:!!v.active,title:v.title,place:v.place,description:v.description,
        people:(v.people||[]).map(p=>({name:p.name,details:p.details||[]})),
        status:(v.status||[]).map(s=>({label:s.label,value:s.value,note:!!s.note})),ladders:v.ladders||[],house:v.house||null,craft:v.craft??null,
        actions:(v.actions||[]).map(a=>({id:a.id,label:a.label,description:a.description,eligible:!!a.eligible,reasons:a.reasons||[],duration:a.duration||0,costs:a.costs||[],completed:a.completed||0,repeatable:!!a.repeatable,once:!!a.once})),
        jobs:(v.jobs||[]).map(j=>({id:j.id,commandId:j.commandId,label:j.label,remaining:j.remaining,duration:j.duration||0,cancellable:!!j.cancellable})),
        extensions:v.extensions||[],choices:v.choices||[],selectedBeginning:v.selectedBeginning||'',beginningHash:v.beginningHash||'',arrival:v.arrival||null,pauseReason:v.pauseReason||'',beginLabel:v.beginLabel,renewal:v.renewal?{visible:!!v.renewal.visible,eligible:!!v.renewal.eligible,label:v.renewal.label,description:v.renewal.description,lost:v.renewal.lost,retain:v.renewal.retain,reward:v.renewal.reward,reasons:v.renewal.reasons,mastery:v.renewal.mastery,reserve:v.renewal.reserve,masteryThreshold:v.renewal.masteryThreshold,next:v.renewal.next}:null,canWrite:!!v.canWrite,error:v.error};};
    const button=(label,data,request,disabled)=>{
        const b=document.createElement('button');b.type='button';b.textContent=label;Object.assign(b.dataset,data);b.disabled=disabled;
        b.onclick=()=>{
            repetition=null;
            if(request.type==='stop-repeat'){notice='Further repetitions stopped. Current work is unchanged.';render(true);return;}
            const times=request.times||1,actual={...request};delete actual.times;
            const prior=projected(),before=prior.actions.find(a=>a.id===actual.id);
            try{command(actual);noticeError=false;const after=projected();notice=resultLine(actual,before,after,prior.status);
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
        const view=projected();lastView=view;
        craft.render(view.craft,view.canWrite);
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
        const info=document.createElement('section'),steps=document.createElement('section'),plans=document.createElement('section'),renewal=document.createElement('section');
        const rows=new Map([[info,[]],[steps,[]],[plans,[]],[renewal,[]]]);
        const p=(text,parent=info)=>{if(text==null||text==='')return;const n=node('p',parent);n.textContent=String(text);rows.get(parent).push(['p',n.textContent]);return n;};
        const add=(parent,label,data,request,disabled)=>{parent.append(button(label,data,request,disabled));rows.get(parent).push(['b',label,data,request,disabled]);};
        const ladderBlock=(parent,ladder)=>{const fig=node('div',parent),words=node('details',parent);fig.dataset.structuredLadder='';words.dataset.structuredLadderText='';
            const {text}=renderFigure(fig,ladder.spec,{idPrefix:'structured-ladder-'+ladder.id});
            words.append(Object.assign(document.createElement('summary'),{textContent:'Read the ladder as text'}),Object.assign(document.createElement('pre'),{textContent:text,className:'fig-text'}));
            rows.get(parent).push(['ladder',text]);};
        live.info.hidden=live.steps.hidden=work.hidden=live.plans.hidden=live.renewal.hidden=actions.hidden=!(view.available||view.active);
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
                // OPN2: one line says a thing once. A detail already shown as a status row, or by an earlier person, is not repeated.
                const said=new Set(view.status.map(r=>String(r.value)));
                for(const person of view.people){p(person.name);for(const detail of person.details){if(said.has(String(detail)))continue;said.add(String(detail));p(detail);}}
                // OPN2: status bookkeeping (means, access, timetable, food lots) folds behind "Details"; the choice survives re-renders.
                if(view.status.length){const more=node('details',info);more.className='structured-status-details';more.open=statusOpen;more.ontoggle=()=>{statusOpen=more.open;};
                    node('summary',more).textContent='Details';
                    for(const row of view.status){const n=node('p',more);n.textContent=`${row.label}: ${row.value}`;}
                    rows.get(info).push(['status',view.status.map(r=>[r.label,r.value])]);}
                if(view.house){renderGuHouse(info,view.house);rows.get(info).push(['house',view.house]);}
                for(const l of view.ladders)ladderBlock(info,l);
                // G15: every continuation you can take now, then only the next one that is still shut.
                let shut=0;for(const e of view.extensions){
                    if(!e.eligible&&shut++>=NEXT_SHUT)continue;
                    p(e.description,steps);for(const reason of e.reasons)p(reason,steps);
                    add(steps,'Choose '+e.label,{structuredExtension:e.id},{type:'adopt-extension',id:e.id,revision:e.revision,contentHash:e.contentHash},!view.canWrite||!e.eligible);
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
                    if(Number.isFinite(view.renewal.mastery)&&view.renewal.next){p(`Method mastery: ${view.renewal.mastery} now (needs ${view.renewal.masteryThreshold}), ${view.renewal.next.mastery} after renewal`,renewal);p(`Training reserve: ${view.renewal.reserve} now, ${view.renewal.next.reserve} after renewal`,renewal);}
                    for(const reason of view.renewal.reasons||[])p(reason,renewal);
                    add(renewal,'Accept renewal',{structuredRenewal:'accept'},{type:'renewal'},!view.canWrite||!view.renewal.eligible);
                }
                for(const action of view.actions){
                    let row=actionRows.get(action.id);
                    if(!row){const card=node('section',actions);card.className='action-legibility__card';card.dataset.structuredRow=action.id;
                        // OPN2: the quote (what it is, the clock, the inputs) folds behind "Details"; the locked reason stays in view (UIV1).
                        const heading=node('h4',card),more=node('details',card),summary=node('summary',more);summary.textContent='Details';more.className='action-legibility__details';
                        const description=node('p',more),state=node('p',more),duration=node('p',more),costs=node('p',more),blockers=node('p',card);
                        const act=button(action.label,{structuredAction:action.id},{type:'action',id:action.id},false),repeat=button('',{structuredRepeat:action.id},{type:'action',id:action.id,times:3},false),quote=node('small',card);quote.className='action-legibility__quote';card.append(act,quote,repeat,blockers,more); // the button leads; the reason and the folded quote follow
                        row={card,heading,description,state,duration,costs,blockers,act,repeat,quote};actionRows.set(action.id,row);}
                    // UIC191: one row per thing (UR158). The heading only repeated the button's words, so the button is the row's name;
                    // the clock and the inputs sit beside the button, one step away, as upstream's plain rows do (UIC130 human time).
                    setText(row.heading,action.label);row.heading.hidden=true;setText(row.description,action.description||'');
                    setText(row.quote,`${action.duration>0?formatDuration(action.duration):'At once'}${action.costs.length?' · uses '+action.costs.join(', '):''}`);
                    const pending=view.jobs.find(j=>j.commandId===action.id);setText(row.state,pending?(view.pauseReason?view.pauseReason+' ':!view.canWrite?'Paused. ':'Running. ')+formatDuration(pending.remaining)+' to go.':action.completed>0?'Settled completions: '+action.completed+'.':action.eligible?'Available.':'Unavailable.');
                    setText(row.duration,'Takes '+(action.duration>0?`${formatDuration(action.duration)}.`:'no time.'));
                    setText(row.costs,'Inputs: '+(action.costs.length?action.costs.join(', ')+'.':'None quoted.'));
                    setText(row.blockers,action.reasons.join(' '));row.blockers.hidden=!action.reasons.length;row.blockers.dataset.themeState='warning';
                    for(const [key,n]of [['duration',row.duration],['costs',row.costs],['blockers',row.blockers]])n.id='structured-'+encodeURIComponent(action.id)+'-'+key;
                    row.act.setAttribute?.('aria-describedby',[row.duration.id,row.costs.id,...(action.reasons.length?[row.blockers.id]:[])].join(' '));
                    setText(row.act,action.label);row.act.disabled=!view.canWrite||!action.eligible;
                    setText(row.repeat,'Repeat '+action.label+' 3 times');row.repeat.hidden=!action.repeatable;row.repeat.disabled=row.act.disabled;
                    // A repeatable action, or one done before that can be done again, is the ordinary day, not the road ahead (G15): when it is blocked it stays here with its
                    // reason in view, rather than joining the capped "Not available yet" list where shut story steps hide it.
                    const home=action.eligible||pending||action.repeatable||action.completed>0&&!action.once?actions:notYetList;if(home===actions&&row.card.hidden)row.card.hidden=false;
                    if(row.card.parentNode!==home){const had=row.card.contains(document.activeElement);home.append(row.card);if(had)row.act.focus?.();}
                }
            }
        }
        for(const [key,fresh] of [['info',info],['steps',steps],['plans',plans],['renewal',renewal]]){const sig=JSON.stringify(rows.get(fresh));if(sectionRows[key]!==sig){sectionRows[key]=sig;live[key].replaceChildren(...fresh.children);}}
        // G10: once a life is under way, what you can do now comes before the opening's account of how it began.
        // A life whose only move is the next story step has nothing else to lead with, so that step comes first.
        if(view.active&&(view.actions.some(a=>a.completed>0)||view.extensions.some(e=>e.eligible))){
            const doNow=view.actions.some(a=>a.eligible)||view.jobs.length>0,want=doNow?[work,actions,live.steps]:[live.steps,work,actions];
            if(want.some((n,k)=>body.children[k]!==n))for(const n of [...want].reverse())body.prepend(n);}
        trim(actionRows,new Set(view.active?view.actions.map(a=>a.id):[]));
        // G15: the closed list shows the next few steps, not the whole road ahead; later ones appear as these open.
        {const n=notYetList.children.length;notYet.hidden=!n;[...notYetList.children].forEach((card,i)=>{const hide=i>=NOT_YET_SHOWN;if(card.hidden!==hide)card.hidden=hide;});setText(notYetSummary,n>NOT_YET_SHOWN?`Not available yet (the next ${NOT_YET_SHOWN})`:`Not available yet (${n})`);if(notYet.parentNode!==actions||actions.lastChild!==notYet)actions.append(notYet);}
trim(jobRows,new Set(view.active?view.jobs.map(j=>j.id):[]));
        setText(message,view.error||notice);message.hidden=!message.textContent;
        message.dataset.themeState=view.error||noticeError?'error':'status';message.setAttribute('role',view.error||noticeError?'alert':'status');
        if(focusKey){const find=node=>node.dataset?.[focusKey[0]]===focusKey[1]?node:[...node.children].map(find).find(Boolean);find(body)?.focus();}
    }
    // G10: a life's day lives in its own panel, which is out of sight once you go Back to Here. While it is out of sight, Here's
    // action list carries a short "Your day" block: what can be done now (up to four, the rest one click on) and what is running.
    // Arrival still opens the panel itself (workspace_navigation ignores this block when it asks whether Here is empty).
    const DAY_SHOWN=4,day=document.createElement('section');day.className='life-day';day.dataset.lifeDay='';
    const dayHead=document.createElement('p'),dayRows=document.createElement('div'),dayNote=document.createElement('p'),dayOpen=document.createElement('button');
    dayHead.className='life-day__head';dayNote.setAttribute('role','status');dayOpen.type='button';dayOpen.textContent='Open your day';dayOpen.onclick=()=>expandWorkspaceModule('beginning');
    day.append(dayHead,dayRows,dayOpen,dayNote);let daySig='',dayInView=null,dayNotice=null,dayShown=false,lastView=null;
    const syncDay=(fresh=true)=>{
        // read() can be costly on a long life, so the block recomputes only when the life changed, the panel left or entered view, or a notice arrived.
        const inViewNow=!localActions||panel.parentElement===localActions||panel.isConnected&&!panel.hidden&&(panel.checkVisibility?panel.checkVisibility():true);
        if(!fresh&&inViewNow===dayInView&&notice===dayNotice&&(!dayShown||day.parentElement===localActions))return;dayInView=inViewNow;dayNotice=notice; // the action list rebuilds itself; a removed block comes back
        // The panel's own render already read the life; reading it again here every tick froze a long life's page.
        const view=lastView;if(!view||inViewNow||!view.active){if(day.isConnected)day.remove();dayShown=false;return;}
        const ready=view.active?view.actions.filter(a=>a.eligible):[],running=view.active?view.jobs:[];
        const show=view.active&&!inViewNow&&(ready.length>0||running.length>0);
        dayShown=show;if(!show){if(day.isConnected)day.remove();return;}
        if(day.parentElement!==localActions||localActions.firstElementChild!==day)localActions.prepend(day);
        const sig=JSON.stringify([ready.map(a=>[a.id,a.label,a.duration,a.costs]),running.map(j=>[j.id,j.remaining]),view.canWrite,notice]);if(sig===daySig&&dayRows.children.length)return;daySig=sig;
        dayHead.textContent=['Your day',ready.length?`${ready.length} ready`:'',...running.map(j=>`${j.label}, ${formatDuration(j.remaining)} to go`)].filter(Boolean).join(' · ');
        dayRows.replaceChildren(...ready.slice(0,DAY_SHOWN).map(a=>{const row=document.createElement('div');row.className='life-day__row';
            const b=button(a.label,{lifeDayAction:a.id},{type:'action',id:a.id},!view.canWrite),q=document.createElement('small');q.className='action-legibility__quote';
            q.textContent=`${a.duration>0?formatDuration(a.duration):'At once'}${a.costs.length?' · uses '+a.costs.join(', '):''}`;row.append(b,q);return row;}));
        dayOpen.textContent=ready.length>DAY_SHOWN?`Open your day (${ready.length-DAY_SHOWN} more)`:'Open your day';
        dayNote.textContent=notice;dayNote.hidden=!notice;
    };
    // G10: a life's own timed work stays with the life. Without an owner the Notebook claimed it and took the centre on every press (as UIC182 for the courtyard).
    const releaseWork=registerOwnedWorkPanel(work=>lastView?.actions.some(a=>a.id===work.commandId)||lastView?.jobs.some(j=>j.id===work.id)?'structured_pack_panel':null);
    render();syncDay();registerWorkspaceModule({id:'beginning',title:'Your beginning',node:panel,home:'right',eligible:()=>!panel.hidden});const timer=setInterval(()=>{const fresh=moved();if(fresh)render();syncDay(fresh);},250);return {render,destroy(){clearInterval(timer);releaseWork();unregisterWorkspaceModule('beginning');panel.remove();day.remove();}};
}
