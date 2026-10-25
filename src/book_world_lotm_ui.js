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
   status.textContent='A disposable test start: choose a life in early Tingen. Nothing here is canon; this save is for testing.';
   for(const pr of v.profiles)actions.append(row(button(pr.label,pr.key==='probationer'?'enroll':`enroll_${pr.key}`,()=>run(()=>enroll(pr.key),'You report to the workroom.'),!v.startable,v.startable?pr.blurb:'Begin from the Village with nothing else under way.'),node('span',pr.blurb)));return;
  }
  const d=v.district;
  status.textContent=`${v.at}${d?` · ${d.label} · supervised by ${d.officer}${d.officerHere?'':' (not here)'}${d.shift?(d.onShift?' (on shift)':' (off shift)'):''}${d.endorsed?'':' · not endorsed here'}`:''}${v.beyonder?'':' · no Beyonder source'} · ${d?`${d.officer.replace(/^./,c=>c.toUpperCase())}'s attention ${d.attention}`:`Hale's attention ${v.attention}`}${v.sleeping?' · asleep':''}`;
  if(d)status.title=d.responders;
  const live=new Set();for(const m of v.meters||[]){live.add(m.id);let b=bars.get(m.id);if(!b){b=createMeterBar();bars.set(m.id,b);}b.update({...m,compact:true});if(b.node.parentNode!==meters)meters.append(b.node);}
  for(const [id,b] of bars){if(!live.has(id)){b.node.remove();bars.delete(id);}}
  // Pathway ladder (DR2): reached stages, the current one, and what the next crossing still needs.
  const p=v.path;path.dataset.lotmPath=p.path;
  if(v.profile==='civil'){
   path.append(node('h3','Civil staff'),node('p','A civil post brings no potion or field membership.'));
   const contract=v.records.find(r=>r.id==='book.lotm.contract');
   if(contract)path.append(node('p',contract.text));
  }else{
  path.append(node('h3',p.label),node('p',p.ladder.map(s=>s.label===p.stage?`[${s.label}]`:s.label).join(' → ')));
  if(p.felt)path.append(node('p',`The ${p.potion} potion feels ${p.felt}.`));
  if(p.chosen)path.append(node('p',v.switchNotice));
  else for(const o of p.others){path.append(node('h3',o.label),node('p',o.ladder.map(s=>s.label).join(' → ')),node('p',v.switchNotice));}
  if(p.next&&!p.capped)for(const c of p.crossings){const r=node('p',`${c.met?'✓':'·'} ${c.label}${typeof c.need==='number'?` (${c.have}/${c.need})`:''}${c.irreversible?' · irreversible':''}`);r.dataset.crossing=c.id;path.append(r);}
  if(p.capped)path.append(node('p','Later Sequences are not offered in this branch.'));
  }
  if(v.cause.line)path.append(node('p',v.cause.line));
  if(v.clearance.length){path.append(node('h3',`Clearance · ${v.role.replace(/_/g,' ')}`));for(const g of v.clearance){const r=node('p',`Grade ${g.grade}: ${g.ok?'you may handle it here. ':''}${g.ok?g.line:g.reasons.join('; ')}`);r.dataset.clearance=String(g.grade);path.append(r);}}
  const held=[v.holds.dose?'prepared dose':'',v.holds.clownDose?'prepared Clown dose':'',...v.doseLabels,...v.marketHeld,...(v.holds.sealed3?['sealed grade 3 item']:[]),...[['frog','dried frog'],['hairs','bundle of hairs'],['ink','jar of grave-dust ink']].filter(([k])=>v.holds[k]).map(x=>x[1]),...['comparator','sampleA','sampleB'].filter(n=>v.holds[n]).map(n=>n==='comparator'?'comparator sample':`sample lot ${n.slice(-1)}`)].filter(Boolean);
  work.append(node('p',`You hold: ${held.length?held.join(', '):'nothing from the bench'}.`));
  if(v.broker){
   work.append(node('h3','Broker custody'),node('p',`Money held pending verification: ${v.broker.escrowPence} pence.`));
   for(const b of v.broker.barters)work.append(node('p',`Posted barter: ${b.offered} (${b.offeredPence} pence) for ${b.label} (${b.requestedPence} pence), equal value. Appraisal costs ${b.feePence} pence separately.`));
   for(const t of v.broker.trades){const r=node('p',`${t.label}: ${t.status}.`);r.dataset.brokerTrade=t.id;work.append(r);}
  }
  for(const j of v.jobs)work.append(row(node('span',`${j.label} · ${j.left} min left`),...(j.cancellable?[button('Stop (cost not returned)','cancel',()=>run(()=>cancel(j.id),'You stopped. What it cost is gone.'),false,'Stopping forfeits what this spent.')]:[])));
  for(const a of v.actions)actions.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))));
  if(v.district)walks.append(node('p',`${v.district.claim}`));
  if(v.places?.length){const list=node('ul');list.dataset.lotmPlaces='';for(const pl of v.places)list.append(node('li',`${pl.place} · ${pl.district}, ${pl.team} (${pl.church})${pl.here?' · you are here':` · ${pl.minutes} min`}`));walks.append(node('h3','Places'),list);}
  for(const m of v.moves)walks.append(row(button(m.label,m.id,()=>run(()=>move(m.id),'You walk there.'),!m.eligible,m.reasons.join(' '))));
  if(v.records.length){notebook.append(node('h3','What you know'));for(const r of v.records.slice(0,6))notebook.append(node('p',r.text));}
 }
 definePanel({id:'lotm',title:'Tingen workroom',role:'actions',node:panel,home,discovered:()=>{const v=read();return v.enrolled||v.startable;},eligible:()=>true,unavailableReason:()=>'Begin the Tingen branch to see it here'});
 render();return {render};
}
