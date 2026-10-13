import {managementPresentation} from './host.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createManagementPanel({read,registry,command}) {
 const element=node('details');element.id='management_panel';element.className='expedition_panel';
 const summary=node('summary','Market courtyard · trade, property and projects');summary.tabIndex=0;
 const terms=node('p','Original local proposals. Work advances only during play. No browser-closed rent, upkeep or debt collection.');
 const notice=node('p');notice.setAttribute('role','status');
 const sections=node('div'),history=node('details'),hs=node('summary','Your courtyard records'),records=node('div');history.append(hs,records);element.append(summary,terms,notice,sections,history);
 const rows=new Map(),groups=new Map();let message='';
 function render() {
  const host=document.getElementById('location_actions_div');if(host&&element.parentElement!==host)host.append(element);
  const snapshot=read(),view=managementPresentation(snapshot.state,registry,snapshot.context);
  element.hidden=!view.visible||snapshot.inDialogue||snapshot.inCombat;
  notice.textContent=snapshot.error||message;notice.hidden=!notice.textContent;
  const seen=new Set(),visibleGroups=new Set();
  for(const s of view.sections) {
   visibleGroups.add(s.id);let g=groups.get(s.id);
   if(!g){g=node('details');g.className='expedition_card';g.append(node('summary',s.label));groups.set(s.id,g);sections.append(g);if(s.id==='charter'||s.id==='work')g.open=true;}
   g.hidden=false;
   for(const a of s.actions) {
    const id=`${s.id}:${a.type||'command'}:${a.id||''}`;seen.add(id);let r=rows.get(id);
    if(!r){const el=node('section'),button=node('button'),description=node('p'),reason=node('p');button.type='button';el.className='expedition_card';el.append(button,description,reason);g.append(el);r={el,button,description,reason,action:a};rows.set(id,r);
     button.addEventListener('click',()=>{try{const current=read();command({...r.action,sequence:current.state.sequence});message='Courtyard change saved.';}catch(e){message=e.message;}render();});}
    r.action=a;r.el.hidden=false;r.button.textContent=a.label;r.button.disabled=!snapshot.canWrite||!a.eligible;r.description.textContent=a.description||'';
    r.reason.textContent=(a.reasons||[]).join(' ');r.reason.hidden=!r.reason.textContent;
   }
  }
  for(const [id,r]of rows)if(!seen.has(id)){if(r.el.contains(document.activeElement))summary.focus();r.el.hidden=true;}
  for(const [id,g]of groups)g.hidden=!visibleGroups.has(id);
  records.replaceChildren(...view.records.map(k=>node('p',k.text)));history.hidden=!view.records.length;
 }
 return {element,render};
}
