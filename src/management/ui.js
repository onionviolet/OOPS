import {managementPresentation} from './host.js';
import {courtyardOrganization} from './organization_source.js';
import {organizationView,organizationText} from '../organization_view.js';
import {definePanel} from '../panel_kit.js';
import './group_source.js';
import '../livelihood_sources.js'; // Frontier livelihood source (lane E)
import '../hired_hands_plot.js'; // hired hand for the courtyard plot (OB7/OB12)
import {groupsOf,groupLines} from '../organizations.js';
import {moneyText} from '../reveal_chain.js';
import {domainRegistry} from '../domain_registry.js';
const node=(tag,text='',attrs={})=>{const n=document.createElement(tag);n.textContent=text;for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
const MOVED_KEY='oops.management.movedNoticeSeen';
const seenMoved=()=>{try{return localStorage.getItem(MOVED_KEY)==='1';}catch{return false;}};
const markMoved=()=>{try{localStorage.setItem(MOVED_KEY,'1');}catch{}};
export function createManagementPanel({read,registry,command}) {
 // UR8: the panel owns its node and registers through definePanel; nothing appends it to Location actions.
 const claimHere=()=>{try{return !!domainRegistry.command('organizations','claimHere')?.();}catch{return false;}};
 const element=node('section','',{id:'management_panel','aria-label':'Market courtyard'});element.className='expedition_panel organization-panel';
 const terms=node('p','Work here moves only while you are here to do it. The courtyard keeps no tally against you while you are away.');terms.className='organization-note';
 const moved=node('p','This panel used to sit inside Location actions. It now has its own place in the panel list.');moved.className='organization-note organization-moved';
 const dismiss=node('button','Got it',{type:'button'});dismiss.setAttribute('aria-label','Got it: hide the note about the new Market courtyard panel');dismiss.title='Hide this note';dismiss.addEventListener('click',()=>{markMoved();moved.hidden=true;});moved.append(' ',dismiss);moved.hidden=seenMoved();
 const notice=node('p');notice.setAttribute('role','status');
 const overview=node('div','',{class:'organization-overview'});
 const sections=node('div'),history=node('details'),hs=node('summary','Your courtyard records'),records=node('div');history.append(hs,records);
 const groupsNote=node('p','',{class:'organization-note organization-groups','aria-label':'Groups here'});
 // Lane F step 2: found a small gathering (O1). Direct domain command, not the courtyard `command` prop (that routes to the simulation).
 const found=node('details',''),foundSum=node('summary','Found a small group'),foundBody=node('div','',{class:'expedition_card'});found.append(foundSum,foundBody);
 const nameIn=node('input','',{type:'text',maxlength:'40','aria-label':'Group name',placeholder:'Group name'}),dialSel={};
 const DIAL_LABEL={admission:'Who may join',dues:'Dues',secrecy:'How openly it meets',rhythm:'Meets'},foundBtn=node('button','Found the group',{type:'button'}),foundWhy=node('p','',{class:'organization-note'}),foundTerms=node('p','',{class:'organization-note'}),mine=node('div');
 {const lab=node('label','Name ');lab.append(nameIn);foundBody.append(lab);}
 for(const[dial,values]of Object.entries(domainRegistry.command('organizations','dials')?.()||{})){const lab=node('label',`${DIAL_LABEL[dial]} `),sel=node('select','',{'aria-label':DIAL_LABEL[dial]});for(const v of values)sel.append(node('option',v,{value:v}));sel.addEventListener('change',()=>render());dialSel[dial]=sel;lab.append(sel);foundBody.append(lab);}
 nameIn.addEventListener('input',()=>render());
 foundBody.append(foundTerms,foundBtn,foundWhy);mine.setAttribute('aria-label','Your groups');
 const dials=()=>({name:nameIn.value,...Object.fromEntries(Object.entries(dialSel).map(([k,sel])=>[k,sel.value]))});
 foundBtn.addEventListener('click',()=>{try{domainRegistry.command('organizations','found')(dials());nameIn.value='';message='Group founded and saved.';}catch(e){message=e.message;}render();});
 // OB7/OB12: hire a villager to tend the plot. Direct domain commands, like founding a group.
 const hands=node('details',''),handsBody=node('div','',{class:'expedition_card'});hands.append(node('summary','Hire help for the plot'),handsBody);
 const handCrop=node('select','',{'aria-label':'Crop to grow'});for(const c of['grain','greens'])handCrop.append(node('option',c,{value:c}));
 const handList=node('div');handsBody.append(node('label','Crop '),handList);handsBody.firstChild.append(handCrop);
 const awayHead=node('h3','Your groups',{class:'organization-away-head'});awayHead.hidden=true;
 element.append(moved,terms,notice,awayHead,overview,groupsNote,found,mine,hands,sections,history);
 const rows=new Map(),groups=new Map();let message='',selected=null,drawn='';
 function drawOverview(org) {
  const view=org&&organizationView(org);
  if(!view){overview.hidden=true;overview.replaceChildren();drawn='';return;} // hidden even on the first render (AT32: the panel can open away from the courtyard)
  const key=`${organizationText(view)}|${selected}`;
  if(key===drawn)return;drawn=key;overview.hidden=false;overview.replaceChildren();
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
  if(view.money){const m=view.money,parts=[Number.isFinite(m.onHand)&&`${!m.unit||m.unit==='coin'?moneyText(m.onHand):m.onHand+' '+m.unit} on hand`,Number.isFinite(m.committedOut)&&`${!m.unit||m.unit==='coin'?moneyText(m.committedOut):m.committedOut} committed out`,Number.isFinite(m.expectedIn)&&`${!m.unit||m.unit==='coin'?moneyText(m.expectedIn):m.expectedIn} expected in`].filter(Boolean);strip.append(node('p',parts.join(' · '),{class:'organization-money'}));}
  if(view.standing){const s=view.standing,wrap=node('div','',{class:'organization-standing'});
   const top=s.next?s.next.at:s.value||1,meter=node('meter','',{min:'0',max:String(Math.max(top,1)),value:String(Math.max(0,s.value)),'aria-label':`${s.label}: ${s.rank}`});
   wrap.append(node('strong',`${s.label}: ${s.rank}`),meter,node('span',s.next?` ${s.value} of ${s.next.at} for ${s.next.name}`:' the top rung'),node('p',s.feeling,{class:'organization-note'}));strip.append(wrap);}
  const hold=view.holdings.length?(()=>{const sec=node('section','',{class:'organization-holdings','aria-label':view.holdingsLabel});sec.append(node('h3',view.holdingsLabel),node('p',view.holdings.map(h=>h.note?`${h.label} (${h.note})`:h.label).join(' · ')));return sec;})():null;
  overview.append(summary,grid,ops,strip,...(hold?[hold]:[]));
 }
 function render() {
  const snapshot=read(),view=managementPresentation(snapshot.state,registry,snapshot.context);
  // AT32: at a group's claim place (the wilds stead) the panel opens with the group cards alone; the courtyard itself needs the Village.
  const here=!view.visible&&claimHere(),hidden=(!view.visible&&!here)||snapshot.inDialogue||snapshot.inCombat,court=hidden||here;element.hidden=hidden;
  terms.hidden=here;moved.hidden=here||seenMoved();awayHead.hidden=!here; // the panel keeps its registered title; away from the courtyard this names what it shows
  sections.hidden=here;history.hidden=here;
  notice.textContent=snapshot.error||message;notice.hidden=!notice.textContent;
  drawOverview(court||!view.opened?null:courtyardOrganization(snapshot.state,registry,snapshot.context));
  groupsNote.textContent=court||!view.opened?'':groupLines(groupsOf(snapshot.state)).join(' ');groupsNote.hidden=!groupsNote.textContent;
  {const hp=court||!view.opened?null:domainRegistry.project('hired_hands'),hj=hp?.jobs.find(j=>j.available||j.hired);hands.hidden=!hj;
   if(hj){const hire=hp.hires.find(h=>h.jobId===hj.id&&h.status==='active'),sig=JSON.stringify([snapshot.canWrite,hj,hire&&hire.paidThrough,hire&&hire.sellAbove]);
    if(handList.dataset.sig!==sig){handList.dataset.sig=sig;
     const run=(f,ok)=>()=>{try{f();message=ok;}catch(e){message=e.message;}render();};
     if(hire)handList.replaceChildren(node('p',`${hire.name} tends the ${hire.crop} for ${hire.wage} coins a week, paid ahead. ${hire.income?.text||''}`.trim(),{class:'organization-note'}),
      (()=>{const b=node('button',`Let ${hire.name} go`,{type:'button'});b.disabled=!snapshot.canWrite;b.addEventListener('click',run(()=>domainRegistry.command('hired_hands','fire')({jobId:hj.id}),'You let them go.'));return b;})(),
      (()=>{const w=node('p',null,{class:'organization-note'}),n=node('input',null,{type:'number',min:'0',max:'999',step:'1',value:String(hire.sellAbove??10),'aria-label':'Keep this much grain'}),set=node('button',hire.sellAbove==null?'Sell grain above this at the market':'Change the sell order',{type:'button'});set.disabled=!snapshot.canWrite;
       set.addEventListener('click',run(()=>domainRegistry.command('hired_hands','order')({jobId:hj.id,sellAbove:Number(n.value)}),'Sell order set.'));w.append(node('span',hire.sellAbove==null?'Grain above ':`Selling grain above ${hire.sellAbove}; set it to `),n,node('span',' '),set);
       if(hire.sellAbove!=null){const off=node('button','Stop selling',{type:'button'});off.disabled=!snapshot.canWrite;off.addEventListener('click',run(()=>domainRegistry.command('hired_hands','order')({jobId:hj.id,sellAbove:null}),'Sell order cleared.'));w.append(' ',off);}
       return w;})());
     else handList.replaceChildren(...hj.candidates.map(c=>{const wrap=node('p'),b=node('button',`Hire ${c.name} · ${c.wage} coins a week`,{type:'button'});b.disabled=!snapshot.canWrite||!c.eligible;
      b.addEventListener('click',run(()=>domainRegistry.command('hired_hands','hire')({jobId:hj.id,hand:c.id,crop:handCrop.value}),`${c.name} is hired.`));wrap.append(b,node('small',` ${c.eligible?c.line:c.reasons.join(' ')}`));return wrap;}));}}}
  found.hidden=court||!view.opened||!domainRegistry.command('organizations','quote');
  if(!found.hidden){const q=domainRegistry.command('organizations','quote')(dials());
   foundTerms.textContent=`Costs ${q.cost} coins now.${q.because?` ${q.because}`:''} With coin dues, members pay at each meeting into the group's treasury.`;
   foundBtn.disabled=!snapshot.canWrite||!q.eligible||!nameIn.value.trim();foundWhy.textContent=nameIn.value.trim()||!q.eligible?q.reasons.join(' '):'Name the group to found it.';foundWhy.hidden=!foundWhy.textContent;}
  mine.hidden=hidden||(!here&&!view.opened)||!domainRegistry.command('organizations','quote');
  if(!mine.hidden){
   const live=groupsOf(snapshot.state).filter(g=>g.charter&&g.status==='active'),org=id=>domainRegistry.command('organizations',id);
   const safe=(f,d)=>{try{return f();}catch{return d;}};
   const info=live.map(g=>({g,pend:g.charter.dues==='coin'?safe(()=>org('pending')({id:g.id}),0):0,inv:safe(()=>org('inviteQuote')({id:g.id}),[]),abil:g.charter.dues==='coin'?safe(()=>org('abilityQuote')({id:g.id}),[]):[],clm:safe(()=>org('claimQuote')({id:g.id}),[])}));
   const sig=JSON.stringify([snapshot.canWrite,info]);
   if(mine.dataset.sig!==sig){mine.dataset.sig=sig;
    const run=(f,ok)=>()=>{try{f();message=ok;}catch(e){message=e.message;}render();};
    const act=(label,why,f,ok,off)=>{const wrap=node('p'),b=node('button',label,{type:'button'});b.disabled=!!off;b.addEventListener('click',run(f,ok));wrap.append(b);if(why)wrap.append(node('small',` ${why}`));return wrap;};
    mine.replaceChildren(...info.map(({g,pend,inv,abil,clm})=>{
     const card=node('section','',{class:'expedition_card'}),coin=g.charter.dues==='coin',box=g.treasury?.coin||0;
     card.append(node('h4',g.name));
     if(coin){
      const late=g.members.filter(m=>m.lateMeetings>0).map(m=>`${m.name} (${m.lateMeetings} late)`);
      card.append(node('p',`Treasury: ${box} coin${box===1?'':'s'}. Dues: ${g.duesPerMeeting} coins per member per meeting; a member who cannot cover it is marked late and charged nothing.${late.length?` Late: ${late.join(', ')}.`:''}`,{class:'organization-note'}));
      card.append(act(pend?`Collect dues (${pend} meeting${pend===1?'':'s'} held)`:'Collect dues',pend?'':'No meeting has been held since the last collecting.',()=>org('settle')({id:g.id}),'Dues collected and saved.',!snapshot.canWrite||!pend));
     } else card.append(node('p','This group collects no coin dues, so it has no treasury.',{class:'organization-note'}));
     for(const q of inv)if(!q.joined)card.append(act(`Invite ${q.name}`,q.eligible?`Agrees at Village standing ${q.needs}.`:q.reasons.join(' '),()=>org('invite')({id:g.id,npc:q.npc}),`${q.name} joined ${g.name}.`,!snapshot.canWrite||!q.eligible));
     for(const q of abil)card.append(act(`${q.label} · ${q.cost} coins`,q.eligible?q.because:q.reasons.join(' '),()=>org('spend')({id:g.id,ability:q.key}),`${q.label}: done.`,!snapshot.canWrite||!q.eligible));
     for(const q of clm)card.append(q.held?act(`Give up ${q.label}`,`${g.name} claims ${q.label}.`,()=>org('release')({id:g.id,place:q.place}),`${g.name} gave up ${q.label}.`,!snapshot.canWrite)
      :act(`Claim ${q.label} · ${q.cost} coins`,q.eligible?q.because:q.reasons.join(' '),()=>org('claim')({id:g.id,place:q.place}),`${g.name} claims ${q.label}.`,!snapshot.canWrite||!q.eligible));
     card.append(act(`Dissolve ${g.name}`,box?`The ${box} coins in the box go back to the members who paid in.`:'',()=>org('dissolve')({id:g.id}),`${g.name} dissolved.`,!snapshot.canWrite));
     return card;}));}
   }
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
 const visible=()=>{try{const s=read(),v=managementPresentation(s.state,registry,s.context);return (v.visible||claimHere())&&!s.inDialogue&&!s.inCombat;}catch{return false;}};
 definePanel({id:'management',title:'Market courtyard',role:'actions',node:element,home:document.getElementById('main_content'),
  discovered:visible,eligible:visible,emptyText:'Return to the Village to use the market courtyard'});
 return {element,render};
}
