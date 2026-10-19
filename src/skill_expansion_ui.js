import {skillExpansionPresentation} from './skill_expansion_host.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createSkillExpansionPanel({registry,read,command}){
 const panel=node('details');panel.id='skills_panel';panel.className='expedition_panel';
 const summary=node('summary','Methods & practice');summary.tabIndex=0;
 const intro=node('p','Observed work opens lessons. Paid practice develops a learned method; current body, stock and agreed help still matter.');
 const cards=node('div'),work=node('div'),contest=node('div'),status=node('p');status.setAttribute('role','status');panel.append(summary,intro,cards,work,contest,status);
 let notice='',signature='';const rows=new Map(),responses=new Map();
 const run=c=>{try{command(c);notice='Progress saved.';}catch(e){notice=e.message;}render();};
 const button=(text,c)=>{const b=node('button',text);b.type='button';b.addEventListener('click',()=>run(c));return b;};
 const enroll=button('Follow local people and work',{type:'enroll'});panel.append(enroll);
 const cancel=button('Cancel accepted work',{type:'cancel'});work.append(cancel);
 const workText=node('p'),recovery=node('p','For your own recovery, use native Rest or Sleep. Restore an acquired source before attempting its method.');work.prepend(workText);panel.append(recovery);
 const withdraw=button('Withdraw from the agreed press · keep spent inputs',{type:'withdraw'});contest.append(withdraw);
 function render(){const snapshot=read(),{state,context,error,enabled}=snapshot,view=skillExpansionPresentation(state,registry,context),focused=document.activeElement;
  panel.hidden=!view.panel||snapshot.inDialogue||snapshot.inCombat||!!state.realmPrototype?.activeVisitId;
  if((view.work||view.contest)&&!snapshot.inDialogue&&!snapshot.inCombat)panel.hidden=false;
  summary.textContent=view.panel?`Methods & practice · ${view.panel.count} known offers/methods`:'Methods & practice';
  enroll.hidden=!view.canEnroll;enroll.disabled=!enabled||!!error;
  const current=new Set(view.families.map(f=>f.id));for(const [id,r]of rows)if(!current.has(id)){if(r.section.contains(focused))summary.focus();r.section.remove();rows.delete(id);}
  for(const f of view.families){let r=rows.get(f.id);if(!r){r={section:node('section'),heading:node('h4'),description:node('p'),progress:node('p'),actions:new Map(),records:node('div')};r.section.className='expedition_card';r.section.append(r.heading,r.description,r.progress,r.records);cards.append(r.section);rows.set(f.id,r);}
   r.heading.textContent=f.row.label;r.description.textContent=f.row.description;
   r.progress.textContent=f.learned?`Learned · mastery ${+f.mastery.toFixed(2)} · ${f.uses} ${f.uses===1?'use':'uses'}. `+f.milestones.map(m=>`${m.met?'Reached':'At '+m.at}: ${m.label}`).join(' · '):f.row.status==='hinted'?'Known offer':'Observe or complete the offered lesson to learn this method.';
   const actionIds=new Set(f.actions.map(a=>a.id));for(const[id,a]of r.actions)if(!actionIds.has(id)){if(a.row.contains(focused))summary.focus();a.row.remove();r.actions.delete(id);}
   for(const a of f.actions){let c=r.actions.get(a.id);if(!c){const row=node('div'),b=button(a.row.label,{type:'command',id:a.id,targetId:a.targetId}),terms=node('p'),reason=node('p');row.append(b,terms,reason);r.section.append(row);c={row,b,terms,reason};r.actions.set(a.id,c);}
    c.b.textContent=a.row.label;c.b.disabled=!enabled||!!error||!a.row.control.enabled;c.terms.textContent=[a.row.description,...a.row.surfaces.preview].filter(Boolean).join(' ');c.reason.textContent=error||a.row.reasons.join(' ');c.reason.hidden=!c.reason.textContent;}
   const records=JSON.stringify(f.records||[]);if(r.recordSignature!==records){r.recordSignature=records;r.records.replaceChildren(...(f.records||[]).map(x=>node('p',`${x.text} · Recorded at played minute ${x.at}.`)));}
  }
  work.hidden=!view.work;if(!view.work&&work.contains(focused))summary.focus();workText.textContent=view.work?`${view.work.label} · ${view.work.remainingMinutes} min remaining. ${view.work.surfaces.preview.join(' ')}`:'';
  cancel.hidden=!view.work||view.cancellation==='none';cancel.disabled=!enabled||!!error;cancel.textContent=view.cancellation==='refund'?'Cancel accepted work · refund reserved inputs':'Cancel accepted work · spent inputs remain';
  recovery.hidden=!view.families.some(f=>f.learned)&&!view.work&&!view.contest;
  contest.hidden=!view.contest;withdraw.disabled=!enabled||!!error;
  const next=view.contest?.id||'';if(signature!==next){signature=next;if(contest.contains(focused))summary.focus();for(const n of [...contest.children])if(n!==withdraw)n.remove();responses.clear();if(view.contest){contest.prepend(node('p',view.contest.cue));for(const r of view.contest.responses){const b=button(r.label,{type:'response',responseId:r.id}),reason=node('p');contest.append(b,reason);responses.set(r.id,{b,reason});}}}
  if(view.contest)for(const r of view.contest.responses){const c=responses.get(r.id);c.b.disabled=!enabled||!!error||!r.preview.eligible;c.reason.textContent=r.preview.eligible?'':'Your current means do not support that response. Yield remains available.';c.reason.hidden=!c.reason.textContent;}
  status.textContent=error||notice;status.hidden=!status.textContent;
 }
 document.getElementById('location_actions_div')?.append(panel);render();return {panel,render};
}
