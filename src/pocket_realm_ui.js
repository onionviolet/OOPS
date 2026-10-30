import {pocketRealmView, previewPocketRealmAction, pocketRealmActions, POCKET_LOCATION} from './pocket_realm_host.js';
import {observerView} from './observer_view.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createPocketRealmPanel({registry,read,command}) {
 const panel=node('details');panel.id='pocket_realm_panel';panel.className='expedition_panel';
 const illustration=node('img');illustration.src='assets/realm/folded-glasshouse.svg';illustration.alt='Folded glass walls surround a planted workbench and brass doorway.';illustration.width=720;illustration.height=260;illustration.style.cssText='width:100%;height:auto;border-radius:8px;margin:8px 0';
 const summary=node('summary','A folded doorway'),intro=node('p'),place=node('p'),records=node('div'),viewStatus=node('p'),viewRecords=node('div'),status=node('p');status.setAttribute('role','status');panel.append(summary,illustration,intro,place,records,viewStatus,viewRecords,status);
 let message='',signature='';const controls=new Map();
 for(const action of pocketRealmActions){const row=node('div'),button=node('button',action.label),reason=node('p');row.className='expedition_card';button.type='button';button.dataset.pocketRealm=action.id;
  button.addEventListener('click',()=>{try{const snapshot=read();command({id:action.id,sequence:snapshot.state.sequence});message=action.id==='pocket.observation.replay'?'Stored viewing evidence displayed.':'Progress saved.';}catch(error){message=error.message;}render();});row.append(button,reason);panel.append(row);controls.set(action.id,{row,button,reason});}
 function render(){const focused=document.activeElement,snapshot=read(),{state,context,error,canWrite}=snapshot,view=pocketRealmView(state);
  panel.hidden=(!view.discovered&&!observerView(state).knows('exchange.lens_lead'))||snapshot.inDialogue||snapshot.inCombat||!['Village','Shack',POCKET_LOCATION].includes(context.facts.location);
  illustration.hidden=!(view.inside||view.observation.active);summary.textContent=view.inside?'Folded Glasshouse':'A folded doorway';intro.textContent=view.inside?'The room beyond the frame has its own bench and caretaker. Your carried belongings came with you; its stored materials stayed here.':'Iona’s viewing instruments include a narrow doorway. Looking through a paired glass and carrying your body through a route require different means.';
  place.textContent=view.description||'Opening the frame accepts no work. You can leave it closed and return later.';
  viewStatus.hidden=!view.observation.acquiredDevice;viewStatus.textContent=view.observation.description+(view.observation.active?` ${view.observation.remaining} played minutes remain. Close the slit before traveling.`:'');
  const next=JSON.stringify([view.records,view.observation.records]);if(signature!==next){signature=next;records.replaceChildren(...view.records.map(r=>node('p',`${r.text} · Recorded at played minute ${r.at}.`)));viewRecords.replaceChildren(...view.observation.records.map(r=>node('p',`${r.text} · Stored ${r.kind}, played minute ${r.at}.`)));}
  for(const [id,control] of controls){let preview;try{preview=previewPocketRealmAction(state,registry,id,context);}catch(error){preview={visible:true,eligible:false,reasons:[error.message]};}
   const readOnly=id==='pocket.observation.replay';control.row.hidden=!preview.visible;control.button.disabled=(!readOnly&&(!canWrite||!!error))||!preview.eligible;control.reason.textContent=control.row.hidden?'':(!readOnly&&error)||preview.reasons?.join(' ')||'';control.reason.hidden=!control.reason.textContent;
   if(control.row.hidden&&focused===control.button)summary.focus();}
  status.textContent=error||message;status.hidden=!status.textContent;
 }
 document.getElementById('location_actions_div')?.append(panel);render();return {render};
}
