import {definePanel} from './panel_kit.js';
import {expandWorkspaceModule,setWorkspaceModuleTitle} from './workspace_layout.js';
import {createMeterBar} from './meter_bar.js';
import {decorateActionComponents} from './ui_components.js';
import {PERSPECTIVE_CONTROLS} from './perspective_controls.js';
import {observerForProfile} from './observer_view.js';
import {renderFigure} from './ui/figure.js';
import {ladderFigureSpec} from './ability_ladder_figure.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
export const lotmPanelTitle=v=>v.resident?v.at:'Tingen workroom';
// Surface type: place service (UR1). Home: the main workspace, discovered inside the Tingen
// branch and in the Village, where its starts begin. Warden Hale runs the workroom; the lodging is where you sleep.
export function createLotmPanel({read,act,cancel,move,enroll,home}){
 const panel=node('section');panel.id='lotm_panel';panel.className='expedition_panel';panel.dataset.surfaceType='place-service';
 const status=node('p'),meters=node('div'),path=node('div'),work=node('div'),bench=node('details'),actions=node('div'),walks=node('div'),notebook=node('div'),notice=node('p');notice.setAttribute('role','status');
 panel.append(node('h2','Tingen'),status,meters,path,work,bench,actions,walks,notebook,notice);
 decorateActionComponents(panel); // UIV1: blocked reasons visible and Tab-reachable, not title-only.
 let signature='',selected=null,benchOpen=false,planOpen=true,choosing=null,currentDistrict=null;const bars=new Map(),districtOpen=new Map(),placesOpen=new Map();bench.dataset.lotmBench='';bench.ontoggle=()=>{benchOpen=bench.open;};
 const waitButtons=new Map();
 const applySeatFilter=()=>{
  const observer=observerForProfile(read(selected)?.entryProfile);
  for(const item of PERSPECTIVE_CONTROLS){
   if(item.kind!=='panel-block')continue;
   const selector=item.anchor.startsWith('#lotm_panel')?item.anchor.replace('#lotm_panel',':scope'):item.anchor;
   let targets=[];try{targets=panel.querySelectorAll(selector);}catch{}
   for(const node of targets){const target=node.closest('[data-panel-row]')||node;target.hidden=!observer.sees({control:item.id});}
  }
 };
 const seatObserver=new MutationObserver(applySeatFilter);seatObserver.observe(panel,{childList:true,subtree:true});
 const run=(fn,done)=>{try{fn();if(done!==undefined)notice.textContent=typeof done==='function'?done():done;}catch(e){notice.textContent=e.message;}signature='';render();};
 const button=(label,token,onclick,disabled,reason)=>{const b=node('button',label);b.type='button';b.dataset.lotm=token;b.disabled=!!disabled;if(reason)b.title=reason;b.onclick=onclick;return b;};
 const row=(...kids)=>{const r=node('div');r.dataset.panelRow='';r.append(...kids);return r;};
 // Navigation only: focus the existing command row, including its disabled reason.
 const findControl=id=>{const b=[...panel.querySelectorAll('[data-lotm]')].find(n=>n.dataset.lotm===id);if(!b)return;const r=b.parentElement;r.tabIndex=-1;r.focus();r.scrollIntoView({block:'nearest'});};

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
  if(d.rite){const r=d.rite,box=node('div');box.dataset.lotmRite=r.grade;
   box.append(node('p',`${r.label} if drunk now: ${r.grade} · stated loss-of-control odds ${r.odds} percent (pre-signs stay reversible about ${r.recoveryDays} days). Seq ${d.seq} doses cannot be drunk yet, so this is a preview.`));
   for(const c of r.conditions){const p=node('p',c.status==='met'?`${c.label}: met (${c.via})`:c.status==='substituted'?`${c.label}: substituted, fit ${c.fit} (${c.via})`:`${c.label}: absent. Wanted: ${c.wanted}. Principle: ${c.principle}.`);p.dataset.lotmRiteCondition=c.status;box.append(p);}
   bench.append(box);}
  for(const g of d.gaps){const p=node('p',`Unknown: ${g}`);p.dataset.lotmGap='';bench.append(p);}
  if(d.brewing)bench.append(node('p',d.ready?'The pot has settled and is ready to bottle.':`Brewing · ${d.left} min left`));
  if(d.doses)bench.append(node('p',`You hold ${d.doses} ${d.product?.name||'dose'}.`));
  for(const a of d.actions)bench.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))));
  for(const o of d.drinkOptions||[])bench.append(row(button(o.label,o.id,()=>run(()=>act(o.id),''),!o.eligible,o.reasons.join(' ')||o.label)));
  if(d.drink)bench.append(row(button('Drink a brewed dose','bench_drink',()=>{},true,d.drink.reason),node('span',d.drink.reason)));
 }
 // In-world entrance (field_ui.js workshop-door pattern): a Village place action that only opens this panel; it commits nothing.
 const door=node('button');door.type='button';door.className='location_choice_dropdown choice_travel';door.dataset.lotmDoor='';
 {const icon=node('i','blur_on');icon.className='material-icons';icon.setAttribute('aria-hidden','true');door.append(icon,'Cross to another world: Tingen');}
 // Choosing a new life is a large task, so it opens in the center with the shared Back (UR9, UR41), like Homes.
 door.addEventListener('click',()=>expandWorkspaceModule('lotm'));
 const localActions=()=>document.getElementById('location_actions_div');
 function syncDoor(v){const place=localActions();door.hidden=!!v.enrolled||!v.atVillage;if(place&&!door.isConnected)place.append(door);}
 let doorObserver=null;
 function render(){
  const v=read(selected);setWorkspaceModuleTitle('lotm',lotmPanelTitle(v));syncDoor(v);if(!doorObserver&&localActions()){doorObserver=new MutationObserver(()=>{if(!door.isConnected)syncDoor(read(selected));});doorObserver.observe(localActions(),{childList:true});}
  // Countdown-only changes update the existing control so pointer/focus stays
  // on it. Eligibility, reasons, target times and the rest of the view still
  // participate in the signature; execution requotes through the host.
  for(const a of v.waits||[]){const b=waitButtons.get(a.id);if(b&&b.textContent!==a.label)b.textContent=a.label;}
  const signatureView=v.waits?{...v,waits:v.waits.map(({label,duration,...rest})=>rest)}:v;
  const next=JSON.stringify([signatureView,notice.textContent,selected,choosing]);if(next===signature)return;signature=next;
  waitButtons.clear();
  path.replaceChildren();work.replaceChildren();bench.replaceChildren();actions.replaceChildren();walks.replaceChildren();notebook.replaceChildren();
  if(!v.enrolled){
   for(const b of bars.values())b.node.remove();bars.clear();
   bench.hidden=true;
   const pick=v.profiles.find(pr=>pr.key===choosing);
   status.textContent=pick?.independent?'Start a new independent life in Tingen. Your current life is kept until the new life is ready.':'Tingen lies in another world: a foggy industrial city where three church teams hire clerks who may later be offered a Beyonder potion; a civil post under a new name is open too. Pick a life to see how it begins.';
   if(!pick){
    // Each entry axis shows the written choice and, beside it, what is listed but not written yet (WER2, WER6, WER8).
    for(const axis of v.axes){const on=axis.options.find(o=>o.available),line=node('p',`${axis.label}: ${on.label}.`);line.dataset.lotmEntryAxis=axis.id;
     for(const o of axis.options.filter(o=>!o.available)){const off=node('small',` Also listed: ${o.label}. ${o.reason}`);off.dataset.lotmEntryUnwritten=o.id;line.append(off);}
     actions.append(line);}
    for(const pr of v.profiles)actions.append(row(button(pr.label,`pick_${pr.key}`,()=>{choosing=pr.key;notice.textContent='';signature='';render();},!v.startable||pr.available===false,pr.available===false?'A fresh book life is unavailable in this host.':v.startable?(pr.independent?'See this new life.':'See what this life keeps and leaves before crossing.'):v.startReasons.join(' '))),node('p',pr.blurb));
    if(!v.startable)actions.append(node('p',v.startReasons.join(' ')));return;
   }
   // The nine entry answers come before the irreversible step (WER3, UR43).
   const box=node('div');box.dataset.lotmEntryAnswers=pick.key;box.append(node('h3',`${pick.independent?'New life':'Before you cross'} · ${pick.label.replace(/^Begin /,'')}`));
   for(const [q,a] of pick.answers){const r=node('p');r.append(node('strong',`${q}. `),a);r.dataset.lotmAnswer=q;box.append(r);}
   actions.append(box,row(button(pick.independent?'Start this new life':'Confirm and cross to Tingen',pick.key==='probationer'?'enroll':`enroll_${pick.key}`,()=>{choosing=null;notice.textContent=pick.independent?'Starting…':'Crossing…';Promise.resolve().then(()=>enroll(pick.key)).then(()=>{notice.textContent='Your first day in Tingen begins.';},e=>{const message=e?.message||'The new life could not start.';notice.textContent=/current save is kept/i.test(message)?message:`${message} Your current save is kept.`;}).finally(()=>{signature='';render();});},!v.startable||pick.available===false,v.startable?(pick.independent?'Start this new life.':'Crossing cannot be undone on this save.'):v.startReasons.join(' ')),
    button('Back to the lives','entry_back',()=>{choosing=null;signature='';render();},false,'Return to the list of Tingen lives. Nothing changes.')));
   if(!v.startable)actions.append(node('p',v.startReasons.join(' ')));return;
  }
  const d=v.district,resident=v.resident===true;bench.hidden=resident;
  status.textContent=`${v.at}${d?` · ${d.label} · supervised by ${d.officer}${d.officerHere?'':' (not here)'}${d.shift?(d.onShift?' (on shift)':' (off shift)'):''}${d.endorsed?'':' · not endorsed here'}`:''}${v.beyonder?'':' · no Beyonder source'} · ${d?`${d.officer.replace(/^./,c=>c.toUpperCase())}'s attention ${d.attention}`:`Hale's attention ${v.attention}`}${v.sleeping?' · asleep':''}`;
  if(resident)status.textContent=`${v.at} · ${v.localClock}${v.runMode?' · canon run':''}${v.sleeping?' · asleep':''}`;
  status.title=resident?'':d?.responders||'';
  const live=new Set();for(const m of v.meters||[]){live.add(m.id);let b=bars.get(m.id);if(!b){b=createMeterBar();bars.set(m.id,b);}b.update({...m,compact:true});if(b.node.parentNode!==meters)meters.append(b.node);}
  for(const [id,b] of bars){if(!live.has(id)){b.node.remove();bars.delete(id);}}
  // Pathway ladder (DR2): reached stages, the current one, and what the next crossing still needs.
  const p=v.path;path.dataset.lotmPath=resident?'':p.path;
  if(!resident){
  if(v.profile==='civil'){
   path.append(node('h3','Civil staff'),node('p','A civil post brings no potion or field membership.'));
   const contract=v.records.find(r=>r.id==='book.lotm.contract');
   if(contract)path.append(node('p',contract.text));
  }else{
  // RPX5: the ladder as a vertical figure; the current rung carries the felt digestion and fills with acts. The plan below keeps the crossings.
  const fig=node('div'),words=node('details');fig.dataset.lotmLadder='';words.dataset.lotmLadderText='';
  const {text}=renderFigure(fig,ladderFigureSpec(p,{felt:p.felt,crossings:false}),{idPrefix:'lotm-ladder'});
  words.append(node('summary','Read the ladder as text'),Object.assign(node('pre',text),{className:'fig-text'}));
  path.append(node('h3',p.label),fig,words);
  if(p.chosen)path.append(node('p',v.switchNotice));
  else for(const o of p.others){path.append(node('h3',o.label),node('p',o.ladder.map(s=>s.label).join(' → ')),node('p',v.switchNotice));}
  if(p.next&&!p.capped){
   const plan=node('details');plan.dataset.lotmPlan='';plan.open=planOpen;plan.ontoggle=()=>{planOpen=plan.open;};
   plan.append(node('summary',`Plan the next crossing · ${p.next}`),node('p',p.ready?'The recorded preparations are met. Taking the dose remains a separate irreversible action.':'Prepare this current body for the next crossing. Met requirements record preparation, not a completed promotion.'));
   for(const c of p.crossings){const r=node('p',`${c.met?'✓':'·'} ${c.label}${typeof c.need==='number'?` (${c.have}/${c.need})`:''}${c.irreversible?' · irreversible':''}`);r.dataset.crossing=c.id;plan.append(r);}
   if(p.failure)plan.append(node('p',`Risk: ${p.failure.signs}. ${p.failure.outcome}.`));
   plan.append(node('p','Finding a step spends nothing. Review its current terms at the normal control; using it rechecks your body, supplies and available support.'));
   const steps=v.actions.filter(a=>/\.(report_in|accept_allocation|ingest|request_assessment|request_prescreen|request_exam)/.test(a.id));
   for(const a of steps)plan.append(row(node('span',`${a.label} · ${a.duration?`${a.duration} min`:'immediate'}. ${a.eligible?'Available now.':a.reasons.join(' ')||'Currently unavailable.'}`),button('Find step',`plan_${a.id}`,()=>findControl(a.id),false,'Focus the existing control without starting it.')));
   if(!steps.length)plan.append(node('p','No progression step is currently offered here. Known acting guidance and the normal walking controls below retain their own requirements.'));
   path.append(plan);
  }
  if(v.actingGuidance?.length){
   const guidance=node('div');guidance.dataset.lotmActingGuidance='';
   guidance.append(node('p','Known acting actions that feed this digestion. Progress counts when the action completes; stopping timed work adds no act. Find an action below, then use its normal control.'));
   for(const a of v.actingGuidance){
    const state=a.pending?'In progress; not counted yet.':a.completed?'Already completed.':a.eligible?'Available now.':a.reasons.join(' ')||'Currently unavailable.';
    const r=row(node('span',`${a.label} · ${a.place} · ${a.duration?`${a.duration} min`:'immediate'}${a.free?' · no resource cost':''}. ${state}`));
    if(a.visible)r.append(button('Find action',`find_${a.id}`,()=>findControl(a.id),false,'Move focus to the existing action. This spends nothing.'));
    else if(!a.here&&a.moveId)r.append(button(`Find walk to ${a.place}`,`find_${a.moveId}_${a.id}`,()=>findControl(a.moveId),false,'Move focus to the existing walk. This does not start walking.'));
    guidance.append(r);
   }
   path.append(guidance);
  }
  if(p.capped)path.append(node('p','Later Sequences are not offered in this branch.'));
  }
  }
  // RET3: the paused Village life is resumed from the connection panel, not from here.
  if(v.pausedLife){const r=row(node('span',`${v.pausedLife} is paused where you left it.`),button('Open Continuing connection','open_connection',()=>expandWorkspaceModule('continuation'),false,'Resuming pauses this Tingen life in turn.'));r.dataset.lotmPausedLife='';path.append(r);}
  if(!resident&&v.cause.line)path.append(node('p',v.cause.line));
  if(!resident&&v.clearance.length){path.append(node('h3',`Clearance · ${v.role.replace(/_/g,' ')}`));for(const g of v.clearance){const r=node('p',`Grade ${g.grade}: ${g.ok?'you may handle it here. ':''}${g.ok?g.line:g.reasons.join('; ')}`);r.dataset.clearance=String(g.grade);path.append(r);}}
  if(!resident){
  const held=[v.holds.dose?'prepared dose':'',v.holds.clownDose?'prepared Clown dose':'',...v.doseLabels,...v.marketHeld,...(v.holds.sealed3?['sealed grade 3 item']:[]),...[['frog','dried frog'],['hairs','bundle of hairs'],['ink','jar of grave-dust ink']].filter(([k])=>v.holds[k]).map(x=>x[1]),...['comparator','sampleA','sampleB'].filter(n=>v.holds[n]).map(n=>n==='comparator'?'comparator sample':`sample lot ${n.slice(-1)}`)].filter(Boolean);
  work.append(node('p',`You hold: ${held.length?held.join(', '):'nothing from the bench'}.`));
  if(v.broker){
   work.append(node('h3','Broker custody'),node('p',`Money held pending verification: ${v.broker.escrowPence} pence.`));
   for(const b of v.broker.barters)work.append(node('p',`Posted barter: ${b.offered} (${b.offeredPence} pence) for ${b.label} (${b.requestedPence} pence), equal value. Appraisal costs ${b.feePence} pence separately.`));
   for(const t of v.broker.trades){const r=node('p',`${t.label}: ${t.status}.`);r.dataset.brokerTrade=t.id;work.append(r);}
  }
  if(v.merit){const m=v.merit,box=node('div');box.dataset.lotmMerit='';box.append(node('h3',`${m.name} · merit`));
   const bal=node('p',`Merit in hand: ${m.balance} (earned ${m.earned}, spent ${m.spent}). Standing is tracked separately.`);bal.dataset.lotmMeritBalance=String(m.balance);box.append(bal);
   for(const a of m.missions)box.append(row(button(a.action.label,a.action.id,()=>run(()=>act(a.action.id),''),!a.action.eligible,a.action.reasons.join(' ')),node('span',`Issuer ${a.issuer}. Risk: ${a.risk}`)));
   box.append(node('p','Evidence store'));
   for(const r of m.store){const line=row(button(`${r.label} · ${r.price} merit${r.left==null?'':` · ${r.left} left`}`,r.action.id,()=>run(()=>act(r.action.id),''),!r.action.eligible,r.reasons.join(' ')),node('span',r.eligible?r.text:r.reasons.join(' ')));line.dataset.lotmMeritRow=r.id;box.append(line);}
   work.append(box);}
  renderBench(v);
  }
  for(const j of v.jobs)work.append(row(node('span',`${j.label} · ${j.left} min left`),...(j.cancellable?[button(j.cancellation==='refund'?'Stop (reserved attention returned)':'Stop (cost not returned)','cancel',()=>run(()=>cancel(j.id),j.cancellation==='refund'?'You stopped. Reserved attention was returned.':'You stopped. What it cost is gone.'),false,j.cancellation==='refund'?'Stopping returns reserved attention; elapsed time stays spent.':'Stopping forfeits what this spent.')]:[])));
  if(v.waits?.length){
   actions.append(node('p','Wait here while the day continues. A local decision can interrupt the wait.'));
   for(const a of v.waits){const b=button(a.label,a.id,()=>run(()=>{const r=act(a.id);notice.textContent=r.interrupted?`Wait interrupted after ${r.minutes} min. ${r.reason}`:`You waited ${r.minutes} min here.`;}),!a.eligible,a.reasons.join(' '));waitButtons.set(a.id,b);actions.append(row(b,...(!a.eligible?[node('span',a.reasons.join(' '))]:[])));}
  }
  if(v.objectActs?.length){
   const objects=node('details');objects.open=true;objects.dataset.lotmObjectActs='';objects.append(node('summary','Things at hand'));
   for(const a of v.objectActs)objects.append(row(node('p',a.description),button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' ')),...(!a.eligible?[node('span',a.reasons.join(' '))]:[])));
   actions.append(objects);
  }
  if(v.inferences?.length){
   const thoughts=node('details');thoughts.dataset.lotmInferences='';thoughts.dataset.perspective='player';thoughts.append(node('summary','Thoughts and intentions · Your thoughts'));
   for(const a of v.inferences)thoughts.append(node('p',`${a.chainLabel}: ${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(a.record?[node('p',a.record)]:[]),...(a.status?[node('p',`Your intention: ${a.status}`)]:[]),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   actions.append(thoughts);
  }
  if(v.abilityConflicts?.length){
   const encounter=node('details');encounter.dataset.lotmAbilityConflicts='';encounter.dataset.perspective='player';encounter.append(node('summary','Encounters · Your encounter'));
   for(const a of v.abilityConflicts)encounter.append(node('p',`${a.encounterLabel}: ${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(a.record?[node('p',a.record)]:[]),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   actions.append(encounter);
  }
  if(v.divinations?.length){
   const rites=node('details');rites.dataset.lotmDivinations='';rites.dataset.perspective='player';rites.append(node('summary','Rites and questions · Your rite'));
   for(const a of v.divinations)rites.append(node('p',`${a.queryLabel}: ${a.question} ${a.method}. ${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(a.record?[node('p',a.record)]:[]),...(a.signal?[node('p',a.signal)]:[]),...(a.belief?[node('p',`Your interpretation: ${a.belief}`)]:[]),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   actions.append(rites);
  }
  if(v.exchanges?.length){
   const exchange=node('details');exchange.dataset.lotmExchanges='';exchange.dataset.perspective='player';exchange.append(node('summary','Belongings · Your exchange'));
   for(const a of v.exchanges)exchange.append(node('p',a.description),node('p',a.costText),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   actions.append(exchange);
  }
  if(v.making?.length){
   const making=node('details');making.dataset.lotmMaking='';making.dataset.perspective='player';making.append(node('summary','Making · Your preparation'));
   for(const a of v.making)making.append(node('p',a.description),node('p',a.costText),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   actions.append(making);
  }
  const talkPeople=new Map();
  for(const a of v.topicTalks||[]){
   let person=talkPeople.get(a.personId);
   if(!person){person=node('details');person.dataset.lotmTopicPerson=a.personId;person.dataset.perspective='player';person.append(node('summary',`Talk to ${a.personLabel} · ${a.perspective}`));talkPeople.set(a.personId,person);actions.append(person);}
   let topic=[...person.children].find(n=>n.dataset?.lotmTopic===a.topicId);
   if(!topic){topic=node('details');topic.dataset.lotmTopic=a.topicId;topic.append(node('summary',a.topicLabel));person.append(topic);}
   topic.append(node('p',a.description),node('p',`${a.costText} ${a.effectText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
  }
  if(v.bodyCare?.length){
   const care=node('details');care.dataset.lotmBodyCare='';care.dataset.perspective='player';care.append(node('summary','Rest and meals · Your body'));
   for(const a of v.bodyCare)care.append(node('p',`${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   actions.append(care);
  }
  for(const a of v.actions)actions.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))));
  if(v.journeys?.length){
   const journeys=node('details');journeys.dataset.lotmJourneys='';journeys.dataset.perspective='player';journeys.append(node('summary','Journeys · Your journey'));
   for(const a of v.journeys)journeys.append(node('p',`${a.description} ${a.routeText}. ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,a.reasons.join(' '))),...(!a.eligible?[node('p',a.reasons.join(' '))]:[]));
   walks.append(journeys);
  }
  if(v.elsewhere?.length){walks.append(node('h3','Elsewhere'));for(const person of v.elsewhere){const line=node('p',person.label);line.dataset.lotmElsewhere=person.id;walks.append(line);}}
  if(v.district&&!resident)walks.append(node('p',`${v.district.claim}`));
  const placeLine=pl=>v.runMode?`${pl.place}${pl.here?' · you are here':` · ${pl.minutes} min`}`:`${pl.place} · ${pl.district}, ${pl.team} (${pl.church})${pl.here?' · you are here':` · ${pl.minutes} min`}`;
  const walkRow=m=>row(button(m.label,m.id,()=>run(()=>move(m.id),'You walk there.'),!m.eligible,m.reasons.join(' ')));
  if(resident){
   const here=v.places.find(pl=>pl.here)?.district;
   if(here!==currentDistrict){districtOpen.clear();placesOpen.clear();currentDistrict=here;}
   walks.append(node('h3','Places and walks'));
   for(const district of new Set(v.places.map(pl=>pl.district))){
    const group=node('details');group.dataset.lotmDistrict=district;group.open=districtOpen.get(district)??district===here;
    group.ontoggle=()=>districtOpen.set(district,group.open);
    const list=node('ul');list.dataset.lotmPlaces='';for(const pl of v.places.filter(pl=>pl.district===district))list.append(node('li',placeLine(pl)));
    const places=node('details');places.open=placesOpen.get(district)??false;places.ontoggle=()=>placesOpen.set(district,places.open);
    places.append(node('summary','Places'),list);group.append(node('summary',district),places);
    for(const m of v.moves.filter(m=>m.label.includes(` · ${district}: `)))group.append(walkRow(m));
    walks.append(group);
   }
  }else{
   if(v.places?.length){const list=node('ul');list.dataset.lotmPlaces='';for(const pl of v.places)list.append(node('li',placeLine(pl)));walks.append(node('h3','Places'),list);}
   for(const m of v.moves)walks.append(walkRow(m));
  }
  if(v.records.length){notebook.append(node('h3','What you know'));for(const r of v.records.slice(0,6))notebook.append(node('p',r.text));}
 }
 definePanel({id:'lotm',title:'Tingen workroom',role:'actions',node:panel,home,perspective:'book.lotm.tingen',discovered:()=>{const v=read();return v.enrolled||v.startable;},eligible:()=>true,unavailableReason:()=>'Visit the Village to see the Tingen starts here'});
 render();return {render};
}
