import {definePanel} from './panel_kit.js';
import {shortActionLabel} from './ui/action_label.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
// While a household act runs, the notebook's current-work view shows this panel (as the other book panels do).
registerOwnedWorkPanel((_work,definition)=>definition?.group==='book_hp_lead'?'hp_panel':null);
// Workspace panel for the HP lead life: the current task, its control, the options that were not taken, the last result.
// It draws the domain projection and the structured campaign view; every start goes through the host's command.
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
export function createHpLeadPanel({project,read,command,keepSlot,study}){
 const panel=node('section');panel.id='hp_panel';panel.className='expedition_panel';panel.dataset.surfaceType='place-service';
 const body=node('div');panel.append(node('h2','The household day'),body);
 let notice='';
 const render=()=>{
  const v=project();body.replaceChildren();
  if(!v?.enrolled)return;
  const campaign=read(),arc=v.arc,section=node('section');section.className='ui-panel-section';section.dataset.hpArc=arc.id;
  section.append(node('h3',arc.title));
  const next=arc.next,running=next&&v.jobs.find(j=>j.commandId===next.id),action=next&&(campaign.actions||[]).find(a=>a.id===next.id);
  section.append(node('p',running?`In progress: ${next.label}`:next?`Next: ${next.label}`:'This day is complete.'));
  if(next){
   const link=node('button',running?'Show current work':'Show current action');link.type='button';link.dataset.hpTaskLink=next.id;
   link.onclick=()=>{const c=body.querySelector(`[data-hp="${CSS.escape(next.id)}"]`);c?.parentElement.scrollIntoView?.({block:'nearest'});c?.focus();};
   section.append(link);
   if(action){
    const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(action.label);
    const b=node('button',s.text);b.type='button';b.dataset.hp=next.id;b.disabled=!!running||!action.eligible||!campaign.canWrite;
    if(s.chip)b.append(node('span',` · ${s.chip}`));
    b.onclick=()=>{try{command({type:'action',id:next.id});notice='';}catch(e){notice=e.message;}render();};
    row.append(b);
    if(action.reasons?.length)row.append(node('p',action.reasons.join(' ')));
    if(action.description)row.append(node('p',action.description));
    section.append(row);
   }
   if(running){const t=node('p',`${(campaign.jobs||[]).find(j=>j.commandId===next.id)?.remaining??''} minutes remaining`);t.dataset.hpTaskTerms='';section.append(t);}
  }
  for(const o of v.locked||[]){const r=node('div');r.dataset.hpLocked=o.id;r.append(node('button',o.label));r.firstChild.disabled=true;r.append(node('span',' Not how it happened'));section.append(r);}
  const sc=v.school;
  if(sc){const s2=node('section');s2.className='ui-panel-section';s2.dataset.hpSchool='';s2.append(node('h3','The road to Hogwarts'));
   if(sc.next){const a=(campaign.actions||[]).find(x=>x.id===sc.next.id);
    if(a){const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(a.label);
     const b=node('button',s.text);b.type='button';b.dataset.hpSchool=sc.next.id;b.disabled=!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===sc.next.id);
     if(s.chip)b.append(node('span',` · ${s.chip}`));
     b.onclick=()=>{try{command({type:'action',id:sc.next.id});notice='';}catch(e){notice=e.message;}render();};
     row.append(b);if(a.reasons?.length)row.append(node('p',a.reasons.join(' ')));if(a.description)row.append(node('p',a.description));s2.append(row);}}
   for(const o of sc.locked){const r=node('div');r.dataset.hpLocked=o.id;const b=node('button',o.label);b.disabled=true;r.append(b,node('span',` Not how it happened. ${o.reason}`));s2.append(r);}
   if(sc.atSchool)s2.append(node('p',sc.house?`You are a first year at Hogwarts, in ${sc.house}.`:'You have reached Hogwarts.'));
   if(sc.next||sc.atSchool)section.append(s2);}
  const ls=v.lessons;
  if(ls){const s3=node('section');s3.className='ui-panel-section';s3.dataset.hpLessons='';s3.append(node('h3','Lessons'));
   for(const l of ls.lessons){const a=(campaign.actions||[]).find(x=>x.id===l.commandId);if(!a)continue;
    const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(a.label);
    const b=node('button',s.text);b.type='button';b.dataset.hpLesson=l.id;b.disabled=!l.open||!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===l.commandId);
    if(s.chip)b.append(node('span',` · ${s.chip}`));
    // The lesson runs through the host command; once it is accepted this week's class slot is kept through the duties API.
    b.onclick=()=>{try{command({type:'action',id:l.commandId});keepSlot?.();notice='';}catch(e){notice=e.message;}render();};
    row.append(b);row.append(node('p',l.open?(a.description||''):l.reason));s3.append(row);}
   for(const sp of ls.spells){const p=node('p',sp.line);p.dataset.hpSpell=sp.key;s3.append(p);}
   for(const t of ls.last){const p=node('p',`Last class: ${t}`);p.dataset.hpLessonResult='';s3.append(p);}
   // W11-C: library study through the inquiry domain (one hour a session; the topic finishes on minutes plus lessons attended).
   for(const r of study?.rows?.()||[]){const row=node('div');row.dataset.panelRow='';
    const b=node('button',r.label);b.type='button';b.dataset.hpStudy=r.id;b.disabled=!r.eligible||!campaign.canWrite;
    b.onclick=()=>{try{study.start(r.id);notice='';}catch(e){notice=e.message;}render();};
    row.append(b);row.append(node('p',r.eligible?r.progress:(r.done?`Worked out. ${r.progress}`:`${r.reason} ${r.progress}`)));
    if(r.canNote){const nb=node('button','Write it up as a note');nb.type='button';nb.dataset.hpStudyNote=r.id;
     nb.onclick=()=>{try{study.writeNote(r.id);notice='You wrote a note.';}catch(e){notice=e.message;}render();};row.append(nb);}
    s3.append(row);}
   section.append(s3);}
  if(arc.aftermath){const p=node('p',`Last result: ${arc.aftermath}`);p.dataset.hpLastResult='';section.append(p);}
  if(arc.done&&arc.conclusion)section.append(node('p',arc.conclusion));
  if(notice)section.append(node('p',notice));
  body.append(section);
 };
 definePanel({id:'hp',title:'The household day',role:'actions',node:panel,home:document.getElementById('main_content'),discovered:()=>!!project()?.enrolled,eligible:()=>true,unavailableReason:()=>'Begin the household day to see this'});
 render();
 return {render};
}
