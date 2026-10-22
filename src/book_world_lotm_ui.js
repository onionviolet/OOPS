import {definePanel} from './panel_kit.js';
import {createMeterBar} from './meter_bar.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
// Surface type: place service (UR1). Home: the main workspace, discovered only inside the Tingen
// branch (or on the local opt-in start). Warden Hale runs the workroom; the lodging is where you sleep.
export function createLotmPanel({read,act,cancel,move,enroll,home}){
 const panel=node('section');panel.id='lotm_panel';panel.className='expedition_panel';panel.dataset.surfaceType='place-service';
 const status=node('p'),meters=node('div'),path=node('div'),work=node('div'),actions=node('div'),walks=node('div'),notebook=node('div'),notice=node('p');notice.setAttribute('role','status');
 panel.append(node('h2','Tingen · probationer branch'),status,meters,path,work,actions,walks,notebook,notice);
 let signature='';const bars=new Map();
 const run=(fn,done)=>{try{fn();notice.textContent=done;}catch(e){notice.textContent=e.message;}signature='';render();};
 const button=(label,token,onclick,disabled,reason)=>{const b=node('button',label);b.type='button';b.dataset.lotm=token;b.disabled=!!disabled;if(reason)b.title=reason;b.onclick=onclick;return b;};
 const row=(...kids)=>{const r=node('div');r.dataset.panelRow='';r.append(...kids);return r;};
 function render(){
  const v=read(),next=JSON.stringify([v,notice.textContent]);if(next===signature)return;signature=next;
  path.replaceChildren();work.replaceChildren();actions.replaceChildren();walks.replaceChildren();notebook.replaceChildren();
  if(!v.enrolled){
   for(const b of bars.values())b.node.remove();bars.clear();
   status.textContent='A disposable test start: you become a clerk of the supervised workroom in early Tingen. Nothing here is canon; this save is for testing.';
   actions.append(row(button('Begin as a Tingen probationer','enroll',()=>run(enroll,'You report to the workroom.'),!v.startable,v.startable?'':'Begin from the Village with nothing else under way.')));return;
  }
  status.textContent=`${v.at} · ${v.supervisorHere?'Warden Hale is here':'Warden Hale is elsewhere'}${v.energy?'':' · no Seer source'} · Hale's attention ${v.attention}${v.sleeping?' · asleep':''}`;
  const live=new Set();for(const m of v.meters||[]){live.add(m.id);let b=bars.get(m.id);if(!b){b=createMeterBar();bars.set(m.id,b);}b.update({...m,compact:true});if(b.node.parentNode!==meters)meters.append(b.node);}
  for(const [id,b] of bars){if(!live.has(id)){b.node.remove();bars.delete(id);}}
  // Pathway ladder (DR2): reached stages, the current one, and what the next crossing still needs.
  const p=v.path;path.dataset.lotmPath=p.path;
  path.append(node('h3',p.label),node('p',p.ladder.map(s=>s.label===p.stage?`[${s.label}]`:s.label).join(' → ')));
  if(p.felt)path.append(node('p',`The Seer potion feels ${p.felt}.`));
  if(p.next&&!p.capped)for(const c of p.crossings){const r=node('p',`${c.met?'✓':'·'} ${c.label}${typeof c.need==='number'?` (${c.have}/${c.need})`:''}${c.irreversible?' · irreversible':''}`);r.dataset.crossing=c.id;path.append(r);}
  if(p.capped)path.append(node('p','Later Sequences are not offered in this branch.'));
  const held=[v.holds.dose?'prepared dose':'',v.holds.clownDose?'prepared Clown dose':'',...['comparator','sampleA','sampleB'].filter(n=>v.holds[n]).map(n=>n==='comparator'?'comparator sample':`sample lot ${n.slice(-1)}`)].filter(Boolean);
  work.append(node('p',`You hold: ${held.length?held.join(', '):'nothing from the bench'}.`));
  for(const j of v.jobs)work.append(row(node('span',`${j.label} · ${j.left} min left`),...(j.cancellable?[button('Stop (cost not returned)','cancel',()=>run(()=>cancel(j.id),'You stopped. What it cost is gone.'),false,'Stopping forfeits what this spent.')]:[])));
  for(const a of v.actions)actions.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))));
  for(const m of v.moves)walks.append(row(button(m.label,m.id,()=>run(()=>move(m.id),'You walk there.'),!m.eligible,m.reasons.join(' '))));
  if(v.records.length){notebook.append(node('h3','What you know'));for(const r of v.records.slice(0,6))notebook.append(node('p',r.text));}
 }
 definePanel({id:'lotm',title:'Tingen workroom',role:'actions',node:panel,home,discovered:()=>{const v=read();return v.enrolled||v.startable;},eligible:()=>true,unavailableReason:()=>'Begin the Tingen branch to see it here'});
 render();return {render};
}
