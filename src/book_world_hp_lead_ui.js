import {definePanel} from './panel_kit.js';
import {shortActionLabel} from './ui/action_label.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
// While a household act runs, the notebook's current-work view shows this panel (as the other book panels do).
registerOwnedWorkPanel((_work,definition)=>definition?.group==='book_hp_lead'?'hp_panel':null);
// Workspace panel for the HP lead life: the current task, its control, the options that were not taken, the last result.
// It draws the domain projection and the structured campaign view; every start goes through the host's command.
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
export function createHpLeadPanel({project,read,command}){
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
  if(arc.aftermath){const p=node('p',`Last result: ${arc.aftermath}`);p.dataset.hpLastResult='';section.append(p);}
  if(arc.done&&arc.conclusion)section.append(node('p',arc.conclusion));
  if(notice)section.append(node('p',notice));
  body.append(section);
 };
 definePanel({id:'hp',title:'The household day',role:'actions',node:panel,home:document.getElementById('main_content'),discovered:()=>!!project()?.enrolled,eligible:()=>true,unavailableReason:()=>'Begin the household day to see this'});
 render();
 return {render};
}
