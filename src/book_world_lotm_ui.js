import {definePanel} from './panel_kit.js';
import {createMeterBar} from './meter_bar.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
// Surface type: place service (UR1). Home: the main workspace, discovered only inside the Tingen
// branch (or on the local opt-in start). Warden Hale runs the workroom; the lodging is where you sleep.
export function createLotmPanel({read,act,cancel,move,enroll,home}){
 const panel=node('section');panel.id='lotm_panel';panel.className='expedition_panel';panel.dataset.surfaceType='place-service';
 const status=node('p'),meters=node('div'),path=node('div'),work=node('div'),bench=node('details'),actions=node('div'),walks=node('div'),notebook=node('div'),notice=node('p');notice.setAttribute('role','status');
 panel.append(node('h2','Tingen · probationer branch'),status,meters,path,work,bench,actions,walks,notebook,notice);
 let signature='',selected=null,benchOpen=false;const bars=new Map();bench.dataset.lotmBench='';bench.ontoggle=()=>{benchOpen=bench.open;};
 const run=(fn,done)=>{try{fn();notice.textContent=done;}catch(e){notice.textContent=e.message;}signature='';render();};
 const button=(label,token,onclick,disabled,reason)=>{const b=node('button',label);b.type='button';b.dataset.lotm=token;b.disabled=!!disabled;if(reason)b.title=reason;b.onclick=onclick;return b;};
 const row=(...kids)=>{const r=node('div');r.dataset.panelRow='';r.append(...kids);return r;};

 // Brewing bench (DWF128): one picked formula at a time, never a button per formula. Surface: a disclosure inside the place service (UR42).
 function renderBench(v){
  const b=v.bench;bench.open=benchOpen||!!selected;
  bench.append(node('summary','Brewing bench · formulas'));
  const sel=node('select');sel.dataset.lotm='bench_select';sel.setAttribute('aria-label','Choose a formula');
  sel.append(Object.assign(node('option','Pick a formula'),{value:''}));
  const groups=new Map();for(const r of b.rows){if(!groups.has(r.pathway))groups.set(r.pathway,[]);groups.get(r.pathway).push(r);}
  for(const [pw,rows] of groups){const g=node('optgroup');g.label=pw;for(const r of rows.sort((x,y)=>y.seq-x.seq)){const o=node('option',`Sequence ${r.seq} ${r.name} · ${r.status}${r.formulaKnown?' · formula held':''}${r.brewing?' · brewing':''}`);o.value=r.id;o.selected=r.id===selected;g.append(o);}sel.append(g);}
  sel.onchange=()=>{selected=sel.value||null;benchOpen=true;signature='';render();};
  bench.append(sel);
  const d=b.selected;if(!d){bench.append(node('p','Pick a formula to see its materials, its rite, what is unknown and what you can do about it.'));return;}
  bench.append(node('h3',`${d.name} · Sequence ${d.seq} · ${d.pathway}`));
  bench.append(node('p',`${d.status==='brewable'?'Brewable':'Inspect-only (the notes do not name every material)'}${d.price?` · formula copy ${d.price.pence} pence (canon ${d.price.canon.pounds} pounds, scaled)`:''} · ${d.minutes} minutes at the bench · formula ${d.formulaKnown?'held':'not held'}`));
  if(d.via)bench.append(node('p',d.via));
  const list=node('ul');list.dataset.lotmSlots='';
  for(const s of d.slots){
   const li=node('li',`${s.held>=s.need&&d.status==='brewable'?'✓':'○'} ${s.role}: ${s.name}${s.amount?` (${s.amount})`:''}${d.status==='brewable'&&!d.via?` · hold ${s.held}/${s.need}`:''}${s.evidence?` [${s.evidence}]`:''}`);
   if(s.buy){const x=s.buy;li.append(' ',button(`Buy · ${s.pence} pence${s.stock?` (${s.stock} left)`:''}`,x.id,()=>run(()=>act(x.id),''),!x.eligible,x.reasons.join(' ')||x.label));}
   if(s.noRoute){const n=node('small',` No Tingen route. ${s.noRoute}`);li.append(n);}
   list.append(li);}
  bench.append(list);
  if(d.formulaRoute)bench.append(node('p',`No Tingen route for the formula. Canon: ${d.formulaRoute.text} [${d.formulaRoute.evidence}]`));
  else if(d.route)bench.append(node('p',`Canon route: ${d.route.text} [${d.route.evidence}]`));
  bench.append(node('p',d.ritual?(d.ritual.needed?`Rite (${d.ritual.scale}): ${d.ritual.text}${d.ritual.materials.length?` · needs ${d.ritual.materials.join(', ')}`:''} [${d.ritual.evidence}]. This does not stop the brewing; drinking without it is a stated loss-of-control risk.`:d.ritual.text):'Rite: not in the notes.'));
  for(const g of d.gaps){const p=node('p',`Unknown: ${g}`);p.dataset.lotmGap='';bench.append(p);}
  if(d.brewing)bench.append(node('p',d.ready?'The pot has settled and is ready to bottle.':`Brewing · ${d.left} min left`));
  if(d.doses)bench.append(node('p',`You hold ${d.doses} ${d.product?.name||'dose'}.`));
  for(const a of d.actions)bench.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))));
  for(const o of d.drinkOptions||[])bench.append(row(button(o.label,o.id,()=>run(()=>act(o.id),''),!o.eligible,o.reasons.join(' ')||o.label)));
  if(d.drink)bench.append(row(button('Drink a brewed dose','bench_drink',()=>{},true,d.drink.reason),node('span',d.drink.reason)));
 }
 function render(){
  const v=read(selected),next=JSON.stringify([v,notice.textContent,selected]);if(next===signature)return;signature=next;
  path.replaceChildren();work.replaceChildren();bench.replaceChildren();actions.replaceChildren();walks.replaceChildren();notebook.replaceChildren();
  if(!v.enrolled){
   for(const b of bars.values())b.node.remove();bars.clear();
   bench.hidden=true;
   status.textContent='A disposable test start: choose a life in early Tingen. Nothing here is canon; this save is for testing.';
   for(const pr of v.profiles)actions.append(row(button(pr.label,pr.key==='probationer'?'enroll':`enroll_${pr.key}`,()=>run(()=>enroll(pr.key),'You report to the workroom.'),!v.startable,v.startable?pr.blurb:'Begin from the Village with nothing else under way.'),node('span',pr.blurb)));return;
  }
  const d=v.district;bench.hidden=false;
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
  renderBench(v);
  for(const j of v.jobs)work.append(row(node('span',`${j.label} · ${j.left} min left`),...(j.cancellable?[button(j.cancellation==='refund'?'Stop (reserved attention returned)':'Stop (cost not returned)','cancel',()=>run(()=>cancel(j.id),j.cancellation==='refund'?'You stopped. Reserved attention was returned.':'You stopped. What it cost is gone.'),false,j.cancellation==='refund'?'Stopping returns reserved attention; elapsed time stays spent.':'Stopping forfeits what this spent.')]:[])));
  for(const a of v.actions)actions.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))));
  if(v.district)walks.append(node('p',`${v.district.claim}`));
  if(v.places?.length){const list=node('ul');list.dataset.lotmPlaces='';for(const pl of v.places)list.append(node('li',`${pl.place} · ${pl.district}, ${pl.team} (${pl.church})${pl.here?' · you are here':` · ${pl.minutes} min`}`));walks.append(node('h3','Places'),list);}
  for(const m of v.moves)walks.append(row(button(m.label,m.id,()=>run(()=>move(m.id),'You walk there.'),!m.eligible,m.reasons.join(' '))));
  if(v.records.length){notebook.append(node('h3','What you know'));for(const r of v.records.slice(0,6))notebook.append(node('p',r.text));}
 }
 definePanel({id:'lotm',title:'Tingen workroom',role:'actions',node:panel,home,discovered:()=>{const v=read();return v.enrolled||v.startable;},eligible:()=>true,unavailableReason:()=>'Begin the Tingen branch to see it here'});
 render();return {render};
}
