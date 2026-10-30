import {managementPresentation} from './host.js';
import {courtyardOrganization} from './organization_source.js';
import {organizationView,organizationText} from '../organization_view.js';
import {definePanel} from '../panel_kit.js';
const node=(tag,text='',attrs={})=>{const n=document.createElement(tag);n.textContent=text;for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
const MOVED_KEY='oops.management.movedNoticeSeen';
const seenMoved=()=>{try{return localStorage.getItem(MOVED_KEY)==='1';}catch{return false;}};
const markMoved=()=>{try{localStorage.setItem(MOVED_KEY,'1');}catch{}};
export function createManagementPanel({read,registry,command}) {
 // UR8: the panel owns its node and registers through definePanel; nothing appends it to Location actions.
 const element=node('section','',{id:'management_panel','aria-label':'Market courtyard'});element.className='expedition_panel organization-panel';
 const terms=node('p','Original local proposals. Work advances only during play. No browser-closed rent, upkeep or debt collection.');terms.className='organization-note';
 const moved=node('p','This panel used to sit inside Location actions. It now has its own place in the panel list.');moved.className='organization-note organization-moved';
 const dismiss=node('button','Got it',{type:'button'});dismiss.addEventListener('click',()=>{markMoved();moved.hidden=true;});moved.append(' ',dismiss);moved.hidden=seenMoved();
 const notice=node('p');notice.setAttribute('role','status');
 const overview=node('div','',{class:'organization-overview'});
 const sections=node('div'),history=node('details'),hs=node('summary','Your courtyard records'),records=node('div');history.append(hs,records);
 element.append(moved,terms,notice,overview,sections,history);
 const rows=new Map(),groups=new Map();let message='',selected=null,drawn='';
 function drawOverview(org) {
  const view=org&&organizationView(org);
  const key=view?`${organizationText(view)}|${selected}`:'';
  if(key===drawn)return;drawn=key;overview.hidden=!view;overview.replaceChildren();if(!view)return;
  const summary=node('p',view.summary,{class:'organization-summary'});
  const grid=node('div','',{class:'organization-grid'});
  // Roster: table with a pinned inspector (O1).
  const roster=node('section','',{class:'organization-roster','aria-label':view.rosterLabel});roster.append(node('h3',view.rosterLabel));
  const table=node('table','',{class:'organization-table'}),head=node('tr'),thead=node('thead');
  for(const c of ['Name',...view.rosterColumns])head.append(node('th',c,{scope:'col'}));thead.append(head);table.append(thead);
  const body=node('tbody');
  for(const m of view.members){const tr=node('tr'),th=node('th','',{scope:'row'}),b=node('button',m.name,{type:'button','aria-pressed':String(selected===m.id)});
   b.addEventListener('click',()=>{selected=selected===m.id?null:m.id;drawOverview(org);});th.append(b);tr.append(th,node('td',m.role),node('td',m.doing));if(selected===m.id)tr.setAttribute('aria-selected','true');body.append(tr);}
  table.append(body);roster.append(table);
  const pick=view.members.find(m=>m.id===selected);
  const inspector=node('aside','',{class:'organization-inspector','aria-label':'Selected person'});
  inspector.append(node('h4',pick?pick.name:'Select a person'));
  inspector.append(node('p',pick?[`${pick.role||'No role recorded'}.`,pick.present?'Here now.':'Not here.',`Doing: ${pick.doing}.`,pick.note?`${pick.note[0].toUpperCase()}${pick.note.slice(1)}.`:''].filter(Boolean).join(' '):'Choose a name to see what they are doing and whether they are here.'));
  grid.append(roster,inspector);
  // Operations: rows with time left (O2).
  const ops=node('section','',{class:'organization-ops','aria-label':'Operations'});ops.append(node('h3',`Operations · ${view.operations.length}`));
  if(!view.operations.length)ops.append(node('p',view.empty,{class:'organization-note'}));
  else{const ul=node('ul');for(const o of view.operations){const li=node('li');li.append(node('strong',o.label),node('span',` · ${o.who||'you'} · ${o.timeText}${o.state==='paused'?' · paused':''}`));
   const more=[o.held.length&&`holds ${o.held.join(', ')}`,o.pays.length&&`pays ${o.pays.join(', ')}`].filter(Boolean).join('; ');if(more)li.append(node('small',` (${more})`));ul.append(li);}ops.append(ul);}
  // Money strip (O3) and standing meter (O4).
  const strip=node('div','',{class:'organization-strip'});
  if(view.money){const m=view.money,parts=[Number.isFinite(m.onHand)&&`${m.onHand} coins on hand`,Number.isFinite(m.committedOut)&&`${m.committedOut} committed out`,Number.isFinite(m.expectedIn)&&`${m.expectedIn} expected in`].filter(Boolean);strip.append(node('p',parts.join(' · '),{class:'organization-money'}));}
  if(view.standing){const s=view.standing,wrap=node('div','',{class:'organization-standing'});
   const top=s.next?s.next.at:s.value||1,meter=node('meter','',{min:'0',max:String(Math.max(top,1)),value:String(Math.max(0,s.value)),'aria-label':`${s.label}: ${s.rank}`});
   wrap.append(node('strong',`${s.label}: ${s.rank}`),meter,node('span',s.next?` ${s.value} of ${s.next.at} for ${s.next.name}`:' the top rung'),node('p',s.feeling,{class:'organization-note'}));strip.append(wrap);}
  const hold=view.holdings.length?(()=>{const sec=node('section','',{class:'organization-holdings','aria-label':view.holdingsLabel});sec.append(node('h3',view.holdingsLabel),node('p',view.holdings.map(h=>h.note?`${h.label} (${h.note})`:h.label).join(' · ')));return sec;})():null;
  overview.append(summary,grid,ops,strip,...(hold?[hold]:[]));
 }
 function render() {
  const snapshot=read(),view=managementPresentation(snapshot.state,registry,snapshot.context);
  const hidden=!view.visible||snapshot.inDialogue||snapshot.inCombat;element.hidden=hidden;
  notice.textContent=snapshot.error||message;notice.hidden=!notice.textContent;
  drawOverview(hidden||!view.opened?null:courtyardOrganization(snapshot.state,registry,snapshot.context));
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
  for(const [id,r]of rows)if(!seen.has(id)){if(r.el.contains(document.activeElement))element.focus?.();r.el.hidden=true;}
  for(const [id,g]of groups)g.hidden=!visibleGroups.has(id);
  records.replaceChildren(...view.records.map(k=>node('p',k.text)));history.hidden=!view.records.length;
  return view;
 }
 // Discovery follows the existing visibility: the Village, outside dialogue and combat.
 const visible=()=>{try{const s=read(),v=managementPresentation(s.state,registry,s.context);return v.visible&&!s.inDialogue&&!s.inCombat;}catch{return false;}};
 definePanel({id:'management',title:'Market courtyard',role:'actions',node:element,home:document.getElementById('main_content'),
  discovered:visible,eligible:visible,emptyText:'Return to the Village to use the market courtyard'});
 return {element,render};
}
