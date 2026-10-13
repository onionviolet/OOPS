import {registerWorkspaceModule, workspaceOwns, unregisterWorkspaceModule} from './workspace_layout.js';
import {packConditions} from './content_packs.js';
export function createContentPackPanel({definitions,read,command,always=false}) {
    if(!definitions.size&&!always)return null;
    const panel=document.createElement('details');panel.id='optional_content_panel';panel.open=true;
    const summary=document.createElement('summary');summary.textContent='Optional worlds';panel.append(summary);
    const body=document.createElement('div');panel.append(body);
    const node=(tag,parent)=>{const n=document.createElement(tag);parent.append(n);return n;};
    const message=node('p',panel),packs=new Map();let signature,notice='',noticeError=false,lastWork=null;
    const button=(label,id,packId,action)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.packAction=id;
        b.onclick=()=>{notice='Command requested; saving…';message.textContent=notice;
            try{command(packId,action);noticeError=false;const row=read().state.packs[packId],definition=definitions.get(packId)?.activities.find(a=>a.id===action);
                notice='Command saved.';
                if(definition){lastWork={packId,actionId:action,hadJob:!!row?.job,label:definition.label};if(!row?.job)notice+=' Immediate action settled.';}
                else if(action==='cancel')notice+=' Work cancelled: material returned, no product or pay.';
                else if(action==='return'&&row?.job){lastWork={packId,actionId:row.job.actionId,hadJob:true,label:definitions.get(packId).activities.find(a=>a.id===row.job.actionId)?.label||'Local work'};notice+=' Work paused while away; no completion pay.';}
            }catch(error){noticeError=true;notice=error.message;}render(true);};return b;};
    function render(force=false) {
        const host=document.getElementById('location_actions_div');if(host&&!workspaceOwns(panel)&&panel.parentElement!==host)host.append(panel);
        panel.hidden=!definitions.size;
        const view=read(),next=JSON.stringify(view)+definitions.size+[...definitions.values()].map(d=>d.title+d.activities.map(a=>a.label+a.duration+(a.pay||0)).join()).join();if(!force&&signature===next)return;signature=next;
        const active=Object.entries(view.state.packs).find(([,r])=>r.active),wanted=new Set();
        for(const [id,d]of definitions){if(active&&active[0]!==id)continue;wanted.add(id);
            let cache=packs.get(id);if(!cache){const card=node('section',body),info=node('section',card),work=node('p',card),actions=node('section',card);
                const enter=button('Visit '+d.title,id+'.enter',id,'enter'),leave=button('Return to Village',id+'.return',id,'return'),cancel=button('Cancel work',id+'.cancel',id,'cancel');card.append(enter,leave,cancel);cache={card,info,work,actions,enter,leave,cancel,rows:new Map()};packs.set(id,cache);}
            const row=view.state.packs[id];cache.info.replaceChildren();const p=text=>{const n=node('p',cache.info);n.textContent=text;};
            p(d.title);cache.enter.textContent='Visit '+d.title;cache.enter.hidden=!!row?.active;cache.enter.disabled=!view.canEnter;cache.leave.hidden=!row?.active;cache.leave.disabled=!view.canAct;
            const visible=new Set();cache.work.hidden=!row?.job;cache.cancel.hidden=!(row?.active&&row.job);cache.cancel.disabled=!view.canAct;
            if(!row?.active){p(d.description);cache.work.textContent=row?.job?'Paused while away. '+row.job.remaining+' played minutes remain.':'';}
            else{p(d.locations[0].label);p(d.locations[0].description);
                if(d.people.length)p(d.people.map(person=>person.label+': '+(person.memoryField&&d.displays?.[person.memoryField]?.[row.values[person.memoryField]]||person.description||'')).join(' · '));
                for(const [key,label]of Object.entries(d.status||{}))p(label+': '+(d.displays?.[key]?.[row.values[key]]??row.values[key]));
                if(view.reference)p('Tessa’s reference recognizes your resolved Village patrol history. Local rank remains separate.');
                if(row.job)cache.work.textContent=(d.activities.find(a=>a.id===row.job.actionId)?.label||'Local work')+' · '+(view.pauseReason?view.pauseReason+' ':!view.canAct?'Paused until saving is restored. ':'Running. ')+row.job.remaining+' played minutes remaining. Leaving pauses this work without pay.';
                for(const a of d.activities)if(packConditions(row.values,a.visibleWhen)){visible.add(a.id);let r=cache.rows.get(a.id);
                    if(!r){const card=node('section',cache.actions);card.className='action-legibility__card';card.dataset.packRow=a.id;
                        const title=node('h4',card),description=node('p',card),duration=node('p',card),blockers=node('p',card),control=button(a.label,a.id,id,a.id);card.append(control);r={card,title,description,duration,blockers,control};cache.rows.set(a.id,r);}
                    const allowed=view.canAct&&!row.job&&packConditions(row.values,a.requires);
                    r.title.textContent=a.label;r.control.textContent=a.label;r.description.textContent=a.description||'';r.duration.textContent='Time terms: '+(a.duration?`${a.duration} played minutes.`:'Immediate.')+(a.pay?` Pays ${a.pay} wood coins on completion.`:'');
                    r.blockers.textContent=!view.canAct?'Restore saving before acting.':row.job?'Finish or leave the current work first.':!packConditions(row.values,a.requires)?'Local prerequisites are not met.':'';r.blockers.hidden=!r.blockers.textContent;r.blockers.dataset.themeState='warning';r.control.disabled=!allowed;
                }
            }
            for(const [key,r]of cache.rows)if(!visible.has(key)){if(r.card.contains(document.activeElement))summary.focus?.();r.card.remove();cache.rows.delete(key);}
        }
        for(const [id,cache]of packs)if(!wanted.has(id)){cache.card.remove();packs.delete(id);}
        if(lastWork&&!noticeError){const row=view.state.packs[lastWork.packId];if(lastWork.hadJob&&row?.active&&!row.job){notice='Command saved. '+lastWork.label+' settled.';lastWork=null;}}
        message.textContent=notice;message.hidden=!notice;message.dataset.themeState=noticeError?'error':'status';message.setAttribute('role',noticeError?'alert':'status');
    }
    render();registerWorkspaceModule({id:'optional-worlds',title:'Optional worlds',node:panel,home:'right',eligible:()=>!panel.hidden});const timer=setInterval(render,250);return {render,destroy(){clearInterval(timer);unregisterWorkspaceModule('optional-worlds');panel.remove();}};
}
