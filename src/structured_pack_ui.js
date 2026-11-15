import {registerWorkspaceModule, workspaceOwns, unregisterWorkspaceModule, expandWorkspaceModule} from './workspace_layout.js';
import {setText} from './dom_sync.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
import {registerReady} from './ready_rows.js';
import {nextLinks} from './ui/next_steps.js';
import {verbOf} from './ui/action_verbs.js';
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
    const body=document.createElement('div'),encounterSlot=document.createElement('div');encounterSlot.dataset.sharedSlot='encounter';panel.append(body);body.append(encounterSlot);let signature,notice='',repetition=null,noticeError=false,timed=null;
    const node=(tag,parent)=>{const n=document.createElement(tag);parent.append(n);return n;};
    // UIC278: the story block (the next steps and the shut ones after them) is one node another owner may place elsewhere on Here;
    // the panel keeps rendering into it and reorders it only while it is still in the panel body.
    const story=document.createElement('section');story.dataset.hereStory='';story.className='life-story';
    const live={info:node('section',body),steps:node('section',story)},work=node('section',body);body.append(story);live.plans=node('section',body);live.renewal=node('section',body);const actions=node('section',body),message=node('p',body);
    const craft=createBookCraftControls(command);body.insertBefore(craft.element,message);
    // OPN2/OPN4: actions that cannot run yet wait in one closed list, each with its reason, so the opening lists what you can do now.
    const notYet=document.createElement('details'),notYetSummary=node('summary',notYet),notYetList=node('div',notYet);notYet.className='action-legibility__not-yet';notYet.hidden=true;
    const actionRows=new Map(),jobRows=new Map(),sectionRows={};let statusOpen=false;
    const trim=(cache,ids)=>{for(const [id,row]of cache)if(!ids.has(id)){if(row.card.contains(document.activeElement))summary.focus?.();row.card.remove();cache.delete(id);}};
    const projected=()=>{const v=read();return {
        expeditions:(v.expeditions||[]).map(s=>({id:s.id,label:s.label,phase:s.phase,injury:s.injury})),available:!!v.available,active:!!v.active,title:v.title,place:v.place,description:v.description,
        people:(v.people||[]).map(p=>({name:p.name,details:p.details||[]})),
        status:(v.status||[]).map(s=>({label:s.label,value:s.value,note:!!s.note})),ladders:v.ladders||[],house:v.house||null,craft:v.craft??null,
        actions:(v.actions||[]).map(a=>({id:a.id,label:a.label,description:a.description,eligible:!!a.eligible,reasons:a.reasons||[],duration:a.duration||0,costs:a.costs||[],completed:a.completed||0,repeatable:!!a.repeatable,once:!!a.once,runs:Number.isFinite(a.runs)?a.runs:null,verb:a.verb||null})),
        jobs:(v.jobs||[]).map(j=>({id:j.id,commandId:j.commandId,label:j.label,remaining:j.remaining,duration:j.duration||0,cancellable:!!j.cancellable})),
        extensions:v.extensions||[],choices:v.choices||[],selectedBeginning:v.selectedBeginning||'',beginningHash:v.beginningHash||'',arrival:v.arrival||null,pauseReason:v.pauseReason||'',beginLabel:v.beginLabel,renewal:v.renewal?{visible:!!v.renewal.visible,eligible:!!v.renewal.eligible,label:v.renewal.label,description:v.renewal.description,lost:v.renewal.lost,retain:v.renewal.retain,reward:v.renewal.reward,reasons:v.renewal.reasons,mastery:v.renewal.mastery,reserve:v.renewal.reserve,masteryThreshold:v.renewal.masteryThreshold,next:v.renewal.next}:null,canWrite:!!v.canWrite,error:v.error};};
    const button=(label,data,request,disabled)=>{
        const b=document.createElement('button');b.type='button';b.textContent=label;Object.assign(b.dataset,data);b.disabled=disabled;
        b.onclick=()=>run(request);return b;
    };
    // One way an act runs, from its button or from the hub on Here (PS57): the command, the result line, the repeat plan.
    const run=request=>{
            repetition=null;
            if(request.type==='stop-repeat'){notice='Further repetitions stopped. Current work is unchanged.';render(true);return;}
            const times=request.times||1,actual={...request};delete actual.times;
            const prior=projected(),before=prior.actions.find(a=>a.id===actual.id);
            try{command(actual);noticeError=false;const after=projected();notice=resultLine(actual,before,after,prior.status);
                const started=actual.type==='action'&&times===1&&after.jobs.find(j=>j.commandId===actual.id);timed=started?{id:actual.id,jobId:started.id,label:before?.label||started.label,completed:before?.completed||0,status:prior.status}:null;
                if(times>1){const job=projected().jobs.find(j=>j.commandId===actual.id);
                    if(job)repetition={id:actual.id,label:before.label,remaining:times-1,jobId:job.id,completed:before.completed};}
            }catch{noticeError=true;notice=projected().error||'The action could not be saved.';}render(true);
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
        // G16 for timed acts: when the work the player started settles, its notice turns from "to go" to what came of it (the life's note).
        if(timed&&!repetition&&!view.jobs.some(j=>j.id===timed.jobId)){const a=view.actions.find(a=>a.id===timed.id),note=changedNote(timed.status,view);
            if(a?a.completed>timed.completed:note){notice=note?`Done: ${timed.label}. ${note}`:`Done: ${timed.label}.`;}timed=null;}
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
                        const act=button(action.label,{structuredAction:action.id},{type:'action',id:action.id},false),repeatRequest={type:'action',id:action.id,times:3},repeat=button('',{structuredRepeat:action.id},repeatRequest,false),quote=node('small',card);quote.className='action-legibility__quote';card.append(act,quote,repeat,blockers,more); // the button leads; the reason and the folded quote follow
                        row={card,heading,description,state,duration,costs,blockers,act,repeat,repeatRequest,quote};actionRows.set(action.id,row);}
                    // UIC191: one row per thing (UR158). The heading only repeated the button's words, so the button is the row's name;
                    // the clock and the inputs sit beside the button, one step away, as upstream's plain rows do (UIC130 human time).
                    setText(row.heading,action.label);row.heading.hidden=true;setText(row.description,action.description||'');
                    setText(row.quote,`${action.duration>0?formatDuration(action.duration):'At once'}${action.costs.length?' · uses '+action.costs.join(', '):''}`);
                    const pending=view.jobs.find(j=>j.commandId===action.id);setText(row.state,pending?(view.pauseReason?view.pauseReason+' ':!view.canWrite?'Paused. ':'Running. ')+formatDuration(pending.remaining)+' to go.':action.completed>0?'Settled completions: '+action.completed+'.':action.eligible?'Available.':'Unavailable.');
                    setText(row.duration,'Takes '+(action.duration>0?`${formatDuration(action.duration)}.`:'no time.'));
                    setText(row.costs,'Inputs: '+(action.costs.length?action.costs.join(', ')+'.':'None quoted.'));
                    setText(row.blockers,action.reasons.join(' '));row.blockers.hidden=!action.reasons.length;row.blockers.dataset.themeState='warning';
                    // PS103: the shared status word on the row, as in Ready now and Crafting: ready, near (a reason to fetch), blocked.
                    row.card.dataset.uiState=action.eligible&&view.canWrite?'ready':action.reasons.length&&(action.repeatable||action.completed>0&&!action.once)?'near':'blocked';
                    for(const [key,n]of [['duration',row.duration],['costs',row.costs],['blockers',row.blockers]])n.id='structured-'+encodeURIComponent(action.id)+'-'+key;
                    row.act.setAttribute?.('aria-describedby',[row.duration.id,row.costs.id,...(action.reasons.length?[row.blockers.id]:[])].join(' '));
                    setText(row.act,action.label);row.act.disabled=!view.canWrite||!action.eligible;
                    // A repeat offer never promises more runs than the inputs in hand cover; below two runs there is nothing to repeat.
                    const times=Math.min(3,action.runs??3);row.repeatRequest.times=times;setText(row.repeat,`Repeat ×${times}`);const repeatSays=`Repeat ${action.label} ${times} times`;if(row.repeat.title!==repeatSays){row.repeat.title=repeatSays;row.repeat.setAttribute?.('aria-label',repeatSays);} // PS11: the act's name is on its own button; the repeat says only how many
                    row.repeat.hidden=!action.repeatable||times<2;row.repeat.disabled=row.act.disabled;
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
            const doNow=view.actions.some(a=>a.eligible)||view.jobs.length>0,want=(doNow?[work,actions,story]:[story,work,actions]).filter(n=>n!==story||story.parentElement===body);
            if(want.some((n,k)=>body.children[k]!==n))for(const n of [...want].reverse())body.prepend(n);}
        trim(actionRows,new Set(view.active?view.actions.map(a=>a.id):[]));
        // G15: the closed list shows the next few steps, not the whole road ahead; later ones appear as these open.
        {const n=notYetList.children.length;notYet.hidden=!n;[...notYetList.children].forEach((card,i)=>{const hide=i>=NOT_YET_SHOWN;if(card.hidden!==hide)card.hidden=hide;});setText(notYetSummary,n>NOT_YET_SHOWN?`Not available yet (the next ${NOT_YET_SHOWN})`:`Not available yet (${n})`);if(notYet.parentElement!==story||story.lastChild!==notYet)story.append(notYet);story.hidden=live.steps.hidden&&notYet.hidden||!live.steps.childElementCount&&notYet.hidden;}
trim(jobRows,new Set(view.active?view.jobs.map(j=>j.id):[]));
        // PS55: a result line ends with "Next:" links to the ready or near rows that use what it names (next_steps.js reads the same rows as the hub),
        // and only on a Done line, once the gain is in hand rather than while it runs.
        const said=view.error||notice;if(message.dataset.said!==said){message.dataset.said=said;message.textContent=said;const next=!view.error&&!noticeError&&/^Done: /.test(said||'')?nextLinks(said):null;if(next)message.append(next);}message.hidden=!said;
        message.dataset.themeState=view.error||noticeError?'error':'status';message.setAttribute('role',view.error||noticeError?'alert':'status');
        if(focusKey){const find=node=>node.dataset?.[focusKey[0]]===focusKey[1]?node:[...node.children].map(find).find(Boolean);find(body)?.focus();}
    }
    // PS57: a life's day actions are rows in the hub on Here ("Ready now"), from the panel's own last read: what can be done now
    // runs from there exactly as its button does, and an ordinary act that is blocked shows as near with its reason. This replaces
    // the "Your day" block that sat on Here while the panel was out of view (G10, UIC196). Shut story steps stay in the panel.
    let lastView=null;
    const uses=costs=>costs.map(c=>c.replace(/^Entrust /,'').replace(/ (for this work|to recipient)$/,'').replace(/^\d+(\.\d+)?\s*(× )?/,'').trim()).filter(Boolean);
    const releaseReady=registerReady({id:'life-day',label:'Your day',rows:()=>{const v=lastView;if(!v?.active)return [];
        return v.actions.filter(a=>!a.once||a.eligible||a.completed===0).map(a=>{
            const detail=`${a.duration>0?formatDuration(a.duration):'At once'}${a.costs.length?' · uses '+a.costs.join(', '):''}`,open=()=>expandWorkspaceModule('beginning');
            // PS120: each row names its verb (the pack's own, else read from the act), and every row opens, rest included.
            const verb=verbOf(a);
            if(a.eligible&&v.canWrite)return {id:a.id,label:a.label,verb,state:'ready',detail,open,act:()=>run({type:'action',id:a.id}),uses:uses(a.costs)};
            const ordinary=a.repeatable||a.completed>0&&!a.once;
            return ordinary&&a.reasons.length?{id:a.id,label:a.label,verb,state:'near',gap:a.reasons[0],detail,open,uses:uses(a.costs)}:{id:a.id,label:a.label,verb,state:'rest',...(a.reasons.length?{gap:a.reasons[0]}:{}),detail,open};
        });}});
    // G10: a life's own timed work stays with the life. Without an owner the Notebook claimed it and took the centre on every press (as UIC182 for the courtyard).
    const releaseWork=registerOwnedWorkPanel(work=>lastView?.actions.some(a=>a.id===work.commandId)||lastView?.jobs.some(j=>j.id===work.id)?'structured_pack_panel':null);
    render();registerWorkspaceModule({id:'beginning',title:'Your beginning',node:panel,home:'right',eligible:()=>!panel.hidden});const timer=setInterval(()=>{if(moved())render();},250);return {render,destroy(){clearInterval(timer);releaseWork();releaseReady();unregisterWorkspaceModule('beginning');panel.remove();story.remove();}};
}
