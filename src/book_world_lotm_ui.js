import {scheduleWaitUntil} from './wait_until.js';
import {COPY_FILE} from './lotm_copy_routine.js';
import {renderCharmLoan} from './ui/lotm_charm_loan.js';
import {renderPersonalShopping} from './ui/lotm_personal_shopping.js';
import {registerPlaceNoticed,noticedFromPlace} from './place_noticed.js';
import {noticedRecordsFor} from './book_world_lotm_noticed.js';
import {lotmTaskSummary,renderLotmTaskSummary} from './ui/lotm_task_summary.js';
import {definePanel} from './panel_kit.js';
import {crossFreely,CROSS_FREELY_EVENT} from './ui/cross_freely.js';
import {expandWorkspaceModule,setWorkspaceModuleTitle} from './workspace_layout.js';
import {createMeterBar} from './meter_bar.js';
import {shortActionLabel} from './ui/action_label.js';
import {decorateActionComponents} from './ui_components.js';
import {tidyReasons} from './player_reasons.js';
import {PERSPECTIVE_CONTROLS} from './perspective_controls.js';
import {observerForProfile,registerCapability} from './observer_view.js';
import {renderFigure} from './ui/figure.js';
import {ladderFigureSpec} from './ability_ladder_figure.js';
import {lotmRungAbilities} from './book_world_lotm_path.js';
import {riteCircleSpec,makingSpec,riskLedger} from './ui/rite_figure.js';
import {walkMapBlock} from './ui/walk_map.js';
import {walkBoard} from './ui/walk_board.js';
import {legsFromMoves} from './read_models/travel_legs_bridge.js';
import {renderCrossingThreshold} from './ui/crossing_threshold.js';
import {renderStartCompare} from './ui/start_compare.js';
import {lotmThresholdView} from './book_world_lotm_threshold.js';
import {mountWorkroomTabs, WORKROOM_TABS} from './book_world_lotm_tabs.js';
import {lotmPositionsFromView,lotmPositionLine} from './book_world_lotm_positions.js';
import {GUARD_POSITION_ID,guardPayWords} from './book_world_lotm_guard.js';
import {wageWords} from './book_world_lotm_wage.js';
import {officeBudget,officePracticeRows} from './lotm_office_day.js';
import {kitControl,kitRow} from './ui/kit.js';
import {formatDuration} from './number_format.js';
import {homeModelLines} from './home_overview_model.js';
import {renderHomeView} from './ui/home_view.js';
import {renderCircusHandbill} from './ui/lotm_circus_handbill.js';
import {LOTM_GUARD_DUTY_ID,LOTM_RENT_ID} from './book_world_lotm_duties.js';
import {lotmLibraryQuote,lotmLibraryStudy} from './book_world_lotm_inquiry.js';
import {channelNote} from './channels.js';
import {owedLedgerView} from './owed_ledger_view.js';
import {readOwedLedger,settleOwed} from './owed_ledger_sources.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
export const lotmPanelTitle=v=>v.resident?v.at:'Tingen workroom';
// Surface type: place service (UR1). Home: the main workspace, discovered inside the Tingen
// branch and in the Village, where its starts begin. Warden Hale runs the workroom; the lodging is where you sleep.
export function createLotmPanel({read,reviseCommissionEarmark,beginWait=null,act,cancel,move,enroll,home,duties,attend,tieAsk,homeAct,setOrder,resign,signGuard,collectGuard,startWage,collectWage,shiftRead=null,workShift=null,lawRoute,readOwed=readOwedLedger,settle=settleOwed,discovered=null,observer=null}){
 const panel=node('section');panel.id='lotm_panel';panel.className='expedition_panel';panel.dataset.surfaceType='place-service';
 const status=node('p'),meters=node('div'),path=node('div'),work=node('div'),bench=node('details'),actions=node('div'),walks=node('div'),notebook=node('div'),notice=node('p');notice.setAttribute('role','status');
 const encounterSlot=node('div');encounterSlot.dataset.sharedSlot='encounter'; // AR17: shared panels (a fight) render here; not tab-owned, not re-rendered.
 const waitBox=node('section'),waitLine=node('p');waitLine.dataset.lotmWaitProgress='';waitLine.setAttribute('role','status');waitBox.append(waitLine);
 panel.append(node('h2','Tingen'),status,meters,encounterSlot,path,work,bench,actions,walks,notebook,notice);
 // Round 2 density: in-panel tabs after the heading; Here (actions and walks) comes first (UR42; moved notice per UR13).
 const tabsUi=mountWorkroomTabs({panel,after:panel.firstChild,blocks:{actions,walks,path,work,bench,notebook}});
 decorateActionComponents(panel); // UIV1: blocked reasons visible and Tab-reachable, not title-only.
 const NEAR_WALKS=8;
 // Dense maps start on demand; an explicit map choice survives later renders
 // and walks. Small maps keep their immediate overview until that choice.
 let signature='',lastRung=null,pulseUntil=0,plannedAct=null,selected=null,benchOpen=false,planOpen=true,choosing=null,currentDistrict=null,mapOpen=null,handbillOpen=false,confirmingResign=false,officeHistoryOpen=false;const bars=new Map(),districtOpen=new Map(),placesOpen=new Map();bench.dataset.lotmBench='';bench.ontoggle=()=>{benchOpen=bench.open;};
 const waitButtons=new Map();
 registerCapability({id:'lotm.local-task-entry',audience:'seat-only',panel:'lotm'});
 registerCapability({id:'lotm.own-power-notes',audience:'seat-only',panel:'lotm'}); // W11-D: kind-of-power lines and owed rows are the lead's own (ABR19)
 registerCapability({id:'lotm.public-reading',audience:'world-general',panel:'lotm'});
 const readOwedRows=()=>{try{return readOwed?.()||null;}catch{return null;}};
 // observer (optional) answers without building the view; the seat filter runs on every DOM change (UIC205).
 const currentObserver=observer||(()=>observerForProfile(read(selected)?.entryProfile));
 const applySeatFilter=()=>{
  const observer=currentObserver();
  for(const item of PERSPECTIVE_CONTROLS){
   if(item.kind!=='panel-block')continue;
   const selector=item.anchor.startsWith('#lotm_panel')?item.anchor.replace('#lotm_panel',':scope'):item.anchor;
   let targets=[];try{targets=panel.querySelectorAll(selector);}catch{}
   for(const node of targets){const target=node.closest('[data-panel-row]')||node,hidden=!observer.sees({control:item.id});if(target.hidden!==hidden)target.hidden=hidden;}
  }
 };
 const seatObserver=new MutationObserver(applySeatFilter);seatObserver.observe(panel,{childList:true,subtree:true});
 let activeWait=null,objectNotice=null;
 const stopWait=()=>{if(!activeWait)return;const result=activeWait.waiting.stop('You stopped waiting.');activeWait=null;syncWait();notice.textContent=`Wait interrupted after ${result.minutes} min. ${result.reason}`;};
 const run=(fn,done,{copyMarkKeyboard=false}={})=>{stopWait();objectNotice=null;const source=document.activeElement,focused=panel.contains(source)?source?.dataset?.lotm:null;let succeeded=false;try{fn();succeeded=true;if(done!==undefined)notice.textContent=typeof done==='function'?done():done;}catch(e){notice.textContent=e.message;}signature='';render();
  // Mark retires the focused choice. Hand its intentional keyboard activation
  // to the same file's Resume control, without scrolling or starting its work.
  if(copyMarkKeyboard&&succeeded&&focused===COPY_FILE.flag&&!source.isConnected&&[source,document.body,document.documentElement].includes(document.activeElement)){
   const resume=panel.querySelector(`[data-lotm="${COPY_FILE.resume}"]`);if(resume&&!resume.disabled){resume.focus({preventScroll:true});return;}
  }
  if(focused&&!restoreControl(focused))panel.querySelector('#lotm-current-task-title')?.focus({preventScroll:true});};
 const waitProgress=p=>`Waiting here · ${p.minutes} min elapsed · ${p.remaining} min remaining.`;
 function syncWait(progress){
  if(!activeWait){waitBox.remove();return;}
  if(waitBox.parentNode!==panel)status.after(waitBox);
  if(progress){const text=waitProgress(progress);if(waitLine.textContent!==text)waitLine.textContent=text;}
 }

 function startWait(id){
  if(!beginWait){run(()=>{const r=act(id);notice.textContent=r.interrupted?`Wait interrupted after ${r.minutes} min. ${r.reason}`:`You waited ${r.minutes} min here.`;});return;}
  stopWait();
  try{
   const task={waiting:beginWait(id)};activeWait=task;syncWait(task.waiting.view());
   for(const b of waitButtons.values())b.disabled=true;
   waitBox.querySelector('button').focus({preventScroll:true});
   scheduleWaitUntil(task.waiting,{onProgress:p=>{if(activeWait!==task)return;syncWait(p);}})
    .then(r=>{if(activeWait!==task)return;activeWait=null;syncWait();notice.textContent=r.interrupted?`Wait interrupted after ${r.minutes} min. ${r.reason}`:`You waited ${r.minutes} min here.`;signature='';render();})
    .catch(e=>{if(activeWait!==task)return;task.waiting.stop(e.message);activeWait=null;syncWait();notice.textContent=e.message;signature='';render();});
  }catch(e){notice.textContent=e.message;signature='';render();}
 }
 // COV7 / UR42: a button reads as a short verb phrase. Cost and time ride in a chip after it, a bracketed risk note moves to
 // the hover text, and an over-long phrase is cut at eight words with the whole line kept in the title.
 // OPN4: before the first report-in the engine refuses with its situation assertion; the player's reason is the report.
// A reason is a block reason only on a disabled button; on a live one it is hover text, so lock readers and the row menu do not show it as a refusal.
 const button=(label,token,onclick,disabled,reason0)=>{const reason=String(reason0||'').split('Knowledge needs its actual situation context.').join('Report in at the workroom first.');const s=shortActionLabel(label);const b=node('button',s.text);if(s.chip){const c=node('span',` · ${s.chip}`);c.className='action-chip';b.append(c);}b.type='button';b.dataset.lotm=token;b.disabled=!!disabled;const title=[reason,s.note,s.cut?label:''].filter(Boolean).join(' · ');if(title)b.title=title;if(reason&&b.disabled)b.dataset.disabledReason=reason;b.onclick=onclick;return b;};
 waitBox.append(button('Stop waiting','wait.stop',()=>{stopWait();signature='';render();},false));
 const row=(...kids)=>{const r=node('div');r.dataset.panelRow='';r.append(...kids);return r;};
 // Navigation only: focus the existing command row, including its disabled reason.
 const tabBlocks={actions,walks,path,work,bench,notebook};
 // A control on another workroom tab is brought into view first; focusing a tab-hidden row did nothing.
 const showTabOf=b=>{const off=b.closest('[data-tab-off]');const key=off&&Object.keys(tabBlocks).find(k=>tabBlocks[k]===off);const tab=key&&WORKROOM_TABS.find(t=>t.blocks.includes(key));if(tab)tabsUi.select(tab.id);};
 const findControl=(id,{focusAction=false}={})=>{const b=[...panel.querySelectorAll('[data-lotm]')].find(n=>n.dataset.lotm===id);if(!b)return false;for(let a=b.parentElement;a&&a!==panel;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;showTabOf(b);const r=b.parentElement;r.tabIndex=-1;(focusAction&&!b.disabled?b:r).focus();r.scrollIntoView({block:'nearest'});return true;};
 const findWork=id=>{const status=[...panel.querySelectorAll('[data-lotm-job]')].find(n=>n.dataset.lotmJob===id);if(!status)return false;showTabOf(status);status.focus();status.scrollIntoView({block:'nearest'});return true;};
 const restoreControl=id=>{
  if(findControl(id,{focusAction:true}))return true;
  const next=id.startsWith('wait.until.')&&actions.querySelector('button[data-lotm^="wait.until."]');if(next)return findControl(next.dataset.lotm,{focusAction:true});
  const job=[...panel.querySelectorAll('[data-lotm-job-command]')].find(n=>n.dataset.lotmJobCommand===id);if(job){showTabOf(job);job.focus();job.scrollIntoView({block:'nearest'});return true;}
  return false;
 };

 // Brewing bench (DWF128): one picked formula at a time, never a button per formula. Surface: a disclosure inside the place service (UR42).
 function renderBench(v){
  const b=v.bench;bench.open=benchOpen||!!selected;
  const kept=b.rows.filter(r=>r.brewing||r.doses);
  const waiting=kept.find(r=>r.brewing);
  const readiness=r=>r.ready?'Settled · ready to bottle':'Still settling';
  bench.append(node('summary',waiting?`Brewing bench · ${waiting.name} · ${readiness(waiting)}`
   :kept.length?'Brewing bench · Bottled doses':'Brewing bench · formulas'));
  const pickFormula=id=>{selected=id||null;benchOpen=true;signature='';render();};
  for(const r of kept){
   if(r.id===selected)continue;
   bench.append(kitRow({label:`Return to ${r.name}`,state:r.ready||!r.brewing?'ready':'running',
    fact:r.brewing?readiness(r):`${r.doses} bottled ${r.doses===1?'dose':'doses'} held`,
    action:{run:()=>{pickFormula(r.id);findControl('bench_select',{focusAction:true});}},
    data:{panelRow:'',lotmBenchReturn:r.id}}));
  }
  const sel=node('select');sel.dataset.lotm='bench_select';sel.setAttribute('aria-label','Choose a formula');
  sel.append(Object.assign(node('option','Pick a formula'),{value:''}));
  const groups=new Map();for(const r of b.rows){if(!groups.has(r.pathway))groups.set(r.pathway,[]);groups.get(r.pathway).push(r);}
  for(const [pw,rows] of groups){const g=node('optgroup');g.label=pw;for(const r of rows.sort((x,y)=>y.seq-x.seq)){const o=node('option',`Sequence ${r.seq} ${r.name} · ${r.status}${r.formulaKnown?' · formula held':''}${r.brewing?' · brewing':''}`);o.value=r.id;o.selected=r.id===selected;g.append(o);}sel.append(g);}
  sel.onchange=()=>pickFormula(sel.value);
  bench.append(sel);
  const d=b.selected;if(!d){bench.append(node('p','Pick a formula to see its materials, its rite, what is unknown and what you can do about it.'));return;}
  bench.append(node('h3',`${d.name} · Sequence ${d.seq} · ${d.pathway}`));
  bench.append(node('p',`${d.status==='brewable'?'Brewable':'Inspect-only (the notes do not name every material)'}${d.price?` · formula copy ${d.price.pence} pence (canon ${d.price.canon.pounds} pounds, scaled)`:''} · ${d.minutes} minutes at the bench · formula ${d.formulaKnown?'held':'not held'}`));
  if(d.via)bench.append(node('p',d.via));
  const actionRow=(a,observation)=>{
   const b=kitControl(button(a.label,a.id,()=>{
    b.focus({preventScroll:true});
    if(!a.eligible)return;
    run(()=>act(a.id),'');
    if(!bench.contains(document.activeElement))findControl('bench_select',{focusAction:true});
   },!a.eligible&&!observation,tidyReasons(a.reasons)||(!a.eligible?a.label:'')),a.id);
   if(!a.eligible&&observation){b.setAttribute('aria-disabled','true');b.setAttribute('aria-describedby',observation.id);}
   return row(b);
  };
  // Bring the live bottle controls up beside the vessel. Formula reference
  // material below stays available without making the player scroll past it.
  if(d.brewing||d.doses){
   const dose=node('section');dose.className='potion-bench potion-bench--tingen';
   const figure=node('figure');figure.className='potion-bench__vessel';
   const glass=node('div');glass.className='potion-bench__glass';glass.setAttribute('aria-hidden','true');
   glass.dataset.vessel=d.brewing?'pot':'bottle';
   const liquid=node('span');liquid.className='potion-bench__liquid';liquid.dataset.liquid='unconfirmed';glass.append(liquid);
   figure.append(glass,node('figcaption',d.brewing?'Brewing pot':'Bottled dose'));
   const result=node('div');result.className='potion-bench__dose';
   if(d.brewing){
    const state=node('strong',readiness(d));state.dataset.semanticInk='state';state.id='lotm-bench-settling';result.append(state);
    for(const a of d.actions.filter(a=>a.id.startsWith('book.lotm.bf_collect_')))result.append(actionRow(a,d.ready?null:state));
   }
   if(d.doses){
    const held=node('strong',`You hold ${d.doses} ${d.product?.name||'dose'}.`);held.dataset.semanticInk='item';result.append(held);
    const bottled=v.records?.find(r=>r.id===`book.lotm.brew.${d.id}.collected`);
    const start=v.records?.find(r=>r.id===`book.lotm.brew.${d.id}.started`);
    if(!d.brewing&&start&&bottled){
     const record=node('details');record.append(node('summary','Brew record'),node('p',start.text),node('p',bottled.text));result.append(record);
    }
    for(const o of d.drinkOptions||[])result.append(actionRow(o));
    if(d.drink)result.append(row(button('Drink a brewed dose','bench_drink',()=>{},true,d.drink.reason)));
   }
   dose.append(figure,result);bench.append(dose);
  }
  // RPX1/RPX2 glance before the reference lines (UR42): the rite circle beside its risk ledger, then the making tracks.
  // The lines below stay the full text form (UR37) and keep the buy buttons.
  const circle=riteCircleSpec(d),ledger=riskLedger(d),making=d.brewing||d.doses?null:makingSpec(d);
  if(circle){const r=node('div');r.className='fig-row';r.dataset.lotmFigure=circle.id;const fig=node('div');renderFigure(fig,circle,{idPrefix:`lotm-${circle.id}`});
   const l=node('div');l.className='fig-ledger';l.dataset.lotmLedger=ledger.grade;l.append(node('p',ledger.headline),node('p',ledger.advice));
   for(const x of ledger.rows){const row=node('div');row.className=`fig-ledger-row fig-state--${x.status==='met'?'filled':x.status==='substituted'?'strained':'empty'}`;
    const m=node('meter');m.min=0;m.max=100;m.low=25;m.high=60;m.optimum=0;m.value=x.share;m.setAttribute('aria-label',`${x.label}: ${x.share}% of the added risk`);
    row.append(node('strong',`${x.label} · ${x.share}% of the added risk`),m,node('small',x.text));l.append(row);}
   r.append(fig,l);bench.append(r);}
  if(making){const fig=node('div');fig.dataset.lotmFigure=making.id;renderFigure(fig,making,{idPrefix:`lotm-${making.id}`});bench.append(fig);}
  const list=node('ul');list.dataset.lotmSlots='';
  for(const s of d.slots){
   const li=node('li',`${s.held>=s.need&&d.status==='brewable'?'✓':'○'} ${s.role}: ${s.name}${s.amount?` (${s.amount})`:''}${d.status==='brewable'&&!d.via?` · hold ${s.held}/${s.need}`:''}${s.evidence?` [${s.evidence}]`:''}`);
   if(s.buy){const x=s.buy;li.append(' ',button(`Buy · ${s.pence} pence${s.stock?` (${s.stock} left)`:''}`,x.id,()=>run(()=>act(x.id),''),!x.eligible,tidyReasons(x.reasons)||x.label));}
   if(s.noRoute){const n=node('small',` No Tingen route. ${s.noRoute}`);li.append(n);}
   list.append(li);}
  bench.append(list);
  if(d.formulaRoute)bench.append(node('p',`No Tingen route for the formula. Canon: ${d.formulaRoute.text} [${d.formulaRoute.evidence}]`));
  else if(d.route)bench.append(node('p',`Canon route: ${d.route.text} [${d.route.evidence}]`));
  bench.append(node('p',d.ritual?(d.ritual.needed?`Rite (${d.ritual.scale}): ${d.ritual.text}${d.ritual.materials.length?` · needs ${d.ritual.materials.join(', ')}`:''} [${d.ritual.evidence}]. You can still brew without it. Drinking without it risks losing control.`:d.ritual.text):'Rite: not in the notes.'));
  if(d.rite){const r=d.rite,box=node('div');box.dataset.lotmRite=r.grade;
   box.append(node('p',`${r.label} if drunk now: ${r.grade} · stated loss-of-control odds ${r.odds} percent (pre-signs stay reversible about ${r.recoveryDays} days). Seq ${d.seq} doses cannot be drunk yet, so this is a preview.`));
   for(const c of r.conditions){const p=node('p',c.status==='met'?`${c.label}: met (${c.via})`:c.status==='substituted'?`${c.label}: substituted, fit ${c.fit} (${c.via})`:`${c.label}: absent. Wanted: ${c.wanted}.`);p.dataset.lotmRiteCondition=c.status;box.append(p);}
   bench.append(box);}
  for(const g of d.gaps){const p=node('p',`Unknown: ${g}`);p.dataset.lotmGap='';bench.append(p);}
  for(const a of d.actions.filter(a=>!a.id.startsWith('book.lotm.bf_collect_')))bench.append(actionRow(a));
 }
 // In-world entrance (field_ui.js workshop-door pattern): a Village place action that only opens this panel; it commits nothing.
 const door=node('button');door.type='button';door.className='location_choice_dropdown choice_travel';door.dataset.lotmDoor='';
 const doorText=node('span','Cross to another world: Tingen');
 {const icon=node('i','blur_on');icon.className='material-icons';icon.setAttribute('aria-hidden','true');door.append(icon,doorText);}
 // Choosing a new life is a large task, so it opens in the center with the shared Back (UR9, UR41), like Homes.
 door.addEventListener('click',()=>{const v=read(selected),first=currentObserver().sees({capability:'lotm.local-task-entry'})?v.objectActs?.find(a=>a.eligible):null;
  if(expandWorkspaceModule('lotm')&&first){tabsUi.select('here');findControl(first.id,{focusAction:true});}});
 // PS305: the nouns the life's own acts here are about (the desk, the wall lamp) are things in Here, each with its verbs. A verb takes the
 // player to the act's own control, as the Nearby door does, and presses nothing itself.
 let hereActs=[],hereAtId=null;
 registerPlaceNoticed({id:'lotm-acts',rows:()=>noticedFromPlace(noticedRecordsFor(hereAtId),hereActs,{open:id=>{if(expandWorkspaceModule('lotm')){tabsUi.select('here');findControl(id,{focusAction:true});}}})});
 const localActions=()=>document.getElementById('location_actions_div');
 function syncDoor(v){const place=localActions(),local=v.resident&&currentObserver().sees({capability:'lotm.local-task-entry'}),first=local?v.objectActs?.find(a=>a.eligible):null;
  const hidden=!local&&(!!v.enrolled||!v.atVillage||!crossFreely()),entry=local?'true':'false',text=local?(first?`Nearby: ${first.label}`:'Open nearby actions'):'Cross to another world: Tingen';
  if(door.hidden!==hidden)door.hidden=hidden;if(door.dataset.lotmLocalEntry!==entry)door.dataset.lotmLocalEntry=entry;
  if(doorText.textContent!==text)doorText.textContent=text;
  if(place&&!door.isConnected)place.append(door);}
 let doorObserver=null;
 (globalThis.window||globalThis).addEventListener?.(CROSS_FREELY_EVENT,()=>syncDoor(read(selected)));
 function render(){
  const v={...read(selected),duties:duties?.()?.items||[]};
  // A click-time notice belongs to its exact native job, not to every later
  // render. Completion or cancellation elsewhere must retire 'Started'.
  if(objectNotice){
   if(notice.textContent!==objectNotice.text)objectNotice=null;
   else if(!(v.jobs||[]).some(j=>j.id===objectNotice.jobId)){
    const record=(v.records||[]).find(r=>r.id===objectNotice.knowledgeKey);
    const changed=record&&(record.at!==objectNotice.before?.at||record.text!==objectNotice.before?.text);
    notice.textContent=changed?`Finished: ${record.text}`:'This work is no longer in progress. See Reports for what happened.';
    objectNotice=null;
   }
  }
setWorkspaceModuleTitle('lotm',lotmPanelTitle(v));syncDoor(v);hereActs=v.resident&&currentObserver().sees({capability:'lotm.local-task-entry'})?v.objectActs||[]:[];hereAtId=v.resident?v.atId||null:null;if(!doorObserver&&localActions()){doorObserver=new MutationObserver(()=>{if(!door.isConnected)syncDoor(read(selected));});doorObserver.observe(localActions(),{childList:true});}
  // The seat filter owns hidden on workroom blocks; slot availability is separate.
  if(encounterSlot.inert!==!v.resident)encounterSlot.inert=!v.resident;
  // Countdown-only changes update the existing control so pointer/focus stays
  // on it. Eligibility, reasons, target times and the rest of the view still
  // participate in the signature; execution requotes through the host.
  for(const a of v.waits||[]){const b=waitButtons.get(a.id);if(b&&b.textContent!==a.label)b.textContent=a.label;}
  // A resident clock line does not alter the action structure. Update it in
  // place so minute passage retains the controls and their keyboard focus.
  const residentStatus=v.resident?`${v.at} · ${v.localClock}${v.shoppingFirst?' · groceries first':v.authoredDeparture?' · chose to skip the tent reading':v.runMode?' · canon run':''}${v.sleeping?' · asleep':''}${v.sky?` · ${v.sky}`:''}`:null;
  if(residentStatus!==null&&status.textContent!==residentStatus)status.textContent=residentStatus;
  const signatureView=v.waits?{...v,waits:v.waits.map(({label,duration,...rest})=>rest)}:{...v};
  if(v.resident){delete signatureView.localClock;delete signatureView.sky;}

  const owedSource=readOwedRows(),owedRows=owedSource?owedLedgerView({...owedSource}).rows.filter(r=>r.direction==='owe'):[];
  const sh=v.enrolled?shiftRead?.():null;
  const next=JSON.stringify([signatureView,sh,notice.textContent,selected,choosing,confirmingResign,owedRows.map(r=>[r.id,r.amount,r.dueText,r.quote?.label??null,r.quote?.blocked??null])]);if(next===signature)return;signature=next;
  const focused=document.activeElement,focusId=panel.contains(focused)?focused?.dataset?.lotm||(focused?.hasAttribute?.('data-panel-row')?focused.querySelector('[data-lotm]')?.dataset?.lotm:null):null;
  const headingFocused=panel.contains(focused)&&focused?.id==='lotm-current-task-title';
  const handbillFocused=panel.contains(focused)&&focused?.hasAttribute?.('data-lotm-handbill-summary');
  const taskFocus=panel.contains(focused)?['lotmTaskLink','lotmTaskWaitLink','lotmTaskWorkLink','lotmJob'].map(key=>[key,focused?.dataset?.[key]]).find(([,id])=>id):null;
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
    // PX49: one shared reason above the choices instead of the same line under every button (UR64).
    const shared=v.startable?null:node('p',v.startReasons.join(' '));if(shared){shared.id='lotm-start-blocked';actions.append(shared);}
    const pickButton=pr=>{const b=button(pr.label,`pick_${pr.key}`,()=>{choosing=pr.key;notice.textContent='';signature='';render();},!v.startable||pr.available===false,pr.available===false?'This life isn\'t open to you yet.':v.startable?(pr.independent?'See this new life.':'See what this life keeps and leaves before crossing.'):'');if(shared&&pr.available!==false){b.title=shared.textContent;b.setAttribute('aria-describedby',shared.id);}return b;};
    const inTable=new Set();renderStartCompare(actions,v.profiles,undefined,{action:key=>{const pr=v.profiles.find(p=>p.key===key);inTable.add(key);return pickButton(pr);}}); // CG5: compare the lives before picking one.
    for(const pr of v.profiles){const blurb=node('p',pr.blurb);if(inTable.has(pr.key)){const label=String(pr.label||'').replace(/^Begin /,'');if(label)blurb.prepend(node('strong',label+'. '));actions.append(blurb);}else actions.append(row(pickButton(pr)),blurb);}
    tabsUi.update(v);return;
   }
   // The nine entry answers come before the irreversible step (WER3, UR43), grouped as a carry list (RPX20).
   renderCrossingThreshold(actions,lotmThresholdView(v,pick,{onConfirm:()=>{choosing=null;notice.textContent=pick.independent?'Starting…':'Crossing…';Promise.resolve().then(()=>enroll(pick.key)).then(()=>{notice.textContent='Your first day in Tingen begins.';},e=>{const message=e?.message||'The new life could not start.';notice.textContent=/current save is kept/i.test(message)?message:`${message} Your current save is kept.`;}).finally(()=>{signature='';render();});},
    onBack:()=>{choosing=null;signature='';render();}}));
   tabsUi.update(v);return;
  }
  const d=v.district,resident=v.resident===true;bench.hidden=resident;
  status.textContent=`${v.at}${d?` · ${d.label} · supervised by ${d.officer}${d.officerHere?'':' (not here)'}${d.shift?(d.onShift?' (on shift)':' (off shift)'):''}${d.endorsed?'':' · not endorsed here'}`:''}${v.beyonder?'':' · no Beyonder source'} · ${d?`${d.officer.replace(/^./,c=>c.toUpperCase())}'s attention ${d.attention}`:`Hale's attention ${v.attention}`}${v.sleeping?' · asleep':''}`;
  if(resident)status.textContent=`${v.at} · ${v.localClock}${v.shoppingFirst?' · groceries first':v.authoredDeparture?' · chose to skip the tent reading':v.runMode?' · canon run':''}${v.sleeping?' · asleep':''}${v.sky?` · ${v.sky}`:''}`;
  status.title=resident?'':d?.responders||'';
  const live=new Set();for(const m of v.meters||[]){live.add(m.id);let b=bars.get(m.id);if(!b){b=createMeterBar();bars.set(m.id,b);}b.update({...m,compact:true});if(b.node.parentNode!==meters)meters.append(b.node);}
  for(const [id,b] of bars){if(!live.has(id)){b.node.remove();bars.delete(id);}}
  // Pathway ladder (DR2): reached stages, the current one, and what the next crossing still needs.
  const p=v.path;path.dataset.lotmPath=resident?'':p.path;
  if(!resident){
  const posRows=lotmPositionsFromView(v);if(posRows.length){const line=node('p',lotmPositionLine(posRows,typeof v.termDay==='number'?v.termDay*1440:undefined));line.dataset.lotmPosition='';path.append(line);}
  // FD15 exit: one verb, resign, on a post that offers it; the cost is shown before the second click and the exit is recorded once.
  const leaving=posRows.find(r=>!r.ended&&r.exit?.kinds?.includes('resign'));
  if(leaving&&resign){
   if(!confirmingResign)path.append(row(button('Resign the post','resign',()=>{confirmingResign=true;signature='';render();},false,leaving.exit.cost)));
   else path.append(node('p',`Resign the ${leaving.role.toLowerCase()} post? ${leaving.exit.cost}`),row(button('Confirm resignation','resign_confirm',()=>{confirmingResign=false;run(()=>resign(leaving.id),leaving.id===GUARD_POSITION_ID?'You walked out on the warehouse watch.':'You resigned the civil staff post.');},false,'Recorded once. It cannot be taken back.'),button('Keep the post','resign_keep',()=>{confirmingResign=false;signature='';render();},false)));
  }else confirmingResign=false;
  // W9-A hired guard: the offer while a man is free for it, then the pay, the trouble and the last words of what happened. The shift itself is a duty in the work list.
  const gd=v.guard;
  if(gd){
   const g=node('div');g.dataset.lotmGuard='';g.append(node('h3','Hired guard'));
   if(gd.offer)g.append(node('p',gd.offer.text),row(button('Sign on as a night watchman','guard_sign',()=>run(()=>signGuard(),'You signed on at the warehouse.'),!signGuard,'Six weeks, one night shift a week. You can walk out, but the week in progress is forfeited.')));
   if(gd.rows.length){
    const o=gd.owed;g.append(node('p',`Watch pay owed now: ${o.pence?guardPayWords(o.pence):'nothing'}${o.bonus?` (with a ${guardPayWords(o.bonus)} bonus)`:''}. The foreman pays a week when it closes; ${gd.stood&&gd.live?'this week\'s watch is stood':'a week with no watch stood pays nothing'}.`));
    if(o.pence&&collectGuard)g.append(row(button(`Collect the watch pay · ${guardPayWords(o.pence)}`,'guard_collect',()=>run(()=>collectGuard(),'The foreman paid you.'),false,'Weeks already closed and any bonus.')));
   }
   if(gd.trouble)g.append(node('p',gd.trouble));
   for(const t of gd.lines)g.append(node('p',t));
   path.append(g);
  }
  // The groups you belong to (a hidden gathering appears only once the player knows of it; none is known yet).
  if(v.groups?.length){const g=node('div');g.dataset.lotmGroups='';g.append(node('h3','Groups'),...v.groups.map(t=>node('p',t)));path.append(g);}
  if(v.profile==='civil'){
   path.append(node('h3','Civil staff'),node('p','A civil post brings no potion or field membership.'));
   const contract=v.records.find(r=>r.id==='book.lotm.contract');
   if(contract)path.append(node('p',contract.text));
  }else{
  // RPX5: the ladder as a vertical figure; the current rung carries the felt digestion and fills with acts. The plan below keeps the crossings.
  const fig=node('div'),words=node('details');fig.dataset.lotmLadder='';words.dataset.lotmLadderText='';
  // RA19: a rung gained pulses for a few seconds of wall time; effects off and reduced keep only the words.
  // RS15 ghost fill: a running acting act, or the one last found from the guidance below, previews its count on the rung.
  const planned=v.actingGuidance?.find(a=>a.pending)||v.actingGuidance?.find(a=>a.id===plannedAct&&!a.completed);
  const spec=ladderFigureSpec(p,{felt:p.felt,crossings:false,planned:planned?{label:planned.label.split(' · ')[0].toLowerCase()}:undefined,abilities:p.path==='lotm.seer'?lotmRungAbilities(p.position):undefined});
  if(lastRung!==null&&p.position>lastRung)pulseUntil=Date.now()+6000;
  lastRung=p.position;
  if(Date.now()<pulseUntil)for(const s of spec.tracks[0].steps)if(s.state==='current')s.effect='pulse';
  const {text}=renderFigure(fig,spec,{idPrefix:'lotm-ladder'});
  words.append(node('summary','Read the ladder as text'),Object.assign(node('pre',text),{className:'fig-text'}));
  path.append(node('h3',p.label),fig,words);
  // Reference prose sits behind one disclosure after the ladders and steps (UR42, round 2 density).
  const howTo=[v.switchNotice];
  if(!p.chosen)for(const o of p.others)path.append(node('h3',o.label),node('p',o.ladder.map(s=>s.label).join(' → ')));
  if(p.next&&!p.capped){
   const plan=node('details');plan.dataset.lotmPlan='';plan.open=planOpen;plan.ontoggle=()=>{planOpen=plan.open;};
   plan.append(node('summary',`Plan the next crossing · ${p.next}`),...(p.ready?[node('p','The recorded preparations are met. Taking the dose remains a separate irreversible action.')]:[]));
   if(!p.ready)howTo.push('Prepare this current body for the next crossing. Met requirements record preparation, not a completed promotion.');
   for(const c of p.crossings){const r=node('p',`${c.met?'✓':'·'} ${c.label}${typeof c.need==='number'?` (${c.have}/${c.need})`:''}${c.irreversible?' · irreversible':''}`);r.dataset.crossing=c.id;plan.append(r);}
   if(p.failure)plan.append(node('p',`Risk: ${p.failure.signs}. ${p.failure.outcome}.`));
   howTo.push('Finding a step spends nothing. Review its current terms at the normal control; using it rechecks your body, supplies and available support.');
   const steps=v.actions.filter(a=>/\.(report_in|accept_allocation|ingest|request_assessment|request_prescreen|request_exam)/.test(a.id));
   for(const a of steps)plan.append(row(node('span',`${a.label} · ${a.duration?`${a.duration} min`:'immediate'}. ${a.eligible?'Available now.':tidyReasons(a.reasons)||'Not available right now.'}`),button('Find step',`plan_${a.id}`,()=>findControl(a.id),false,'Focus the existing control without starting it.')));
   if(!steps.length)plan.append(node('p','No progression step is currently offered here. Known acting guidance and the normal walking controls below retain their own requirements.'));
   path.append(plan);
  }
  if(v.actingGuidance?.length){
   const guidance=node('div');guidance.dataset.lotmActingGuidance='';
   guidance.append(node('p','Known acting actions that feed this digestion. Progress counts when the action completes; stopping timed work adds no act. Find an action below, then use its normal control.'));
   for(const a of v.actingGuidance){
    const state=a.pending?'In progress; not counted yet.':a.completed?'Already completed.':a.eligible?'Available now.':tidyReasons(a.reasons)||'Not available right now.';
    const r=row(node('span',`${a.label} · ${a.place} · ${a.duration?`${a.duration} min`:'immediate'}${a.free?' · no resource cost':''}. ${state}`));
    if(a.visible)r.append(button('Find action',`find_${a.id}`,()=>{plannedAct=a.id;signature='';render();findControl(a.id);},false,'Move focus to the existing action and preview its count on the ladder. This spends nothing.'));
    else if(!a.here&&a.moveId)r.append(button(`Find walk to ${a.place}`,`find_${a.moveId}_${a.id}`,()=>{plannedAct=a.id;signature='';render();findControl(a.moveId);},false,'Move focus to the existing walk and preview the act\'s count on the ladder. This does not start walking.'));
    guidance.append(r);
   }
   path.append(guidance);
  }
  if(p.capped)path.append(node('p','Later Sequences are not offered in this branch.'));
  const how=node('details');how.className='lotm-how';how.append(node('summary','How this works'),...howTo.map(t=>node('p',t)));path.append(how);
  }
  }
  // Keep the comparison together. Practice rows lead to the original rites and running work.
  const office=sh&&workShift?node('section'):null;
  if(office){
   office.dataset.lotmOfficeDay='';office.append(node('h3','Office day'));
   const choices=node('div');choices.dataset.lotmShift='';
   const count=sh.thisWeek===1?'One shift':`${sh.thisWeek} shifts`;
   choices.append(node('p',`${count} this pay week. Your salary is weekly.`));
   for(const k of sh.kinds){
    const reason=k.eligible?k.say:k.reason;
    const shiftRow=kitRow({state:k.eligible?'ready':'near',label:k.label,action:{title:reason,disabled:!k.eligible,run:()=>run(()=>workShift(k.id),'')},fact:reason,data:{panelRow:''}});
    const control=shiftRow.firstElementChild;control.dataset.lotm=`shift_${k.id}`;
    if(!k.eligible)control.dataset.disabledReason=reason;
    choices.append(shiftRow);
   }
   office.append(choices);
   const practice=officePracticeRows(v.divinations,v.jobs);
   if(practice.length||v.beDigestion){
    const g=node('div');g.dataset.lotmOfficePractice='';g.append(node('h4','Seer practice'));
    for(const a of practice){
     const reason=a.eligible?(a.costs?.length?a.costText:''):tidyReasons(a.reasons);
     const label=a.running?`${a.running.label} · ${formatDuration(a.running.left)} left`:a.label;
     const action={title:reason||label,run:()=>a.running?findWork(a.running.id):findControl(a.id,{focusAction:true})};
     const practiceRow=kitRow({state:a.running?'running':a.eligible?'ready':'near',label,action,fact:a.running?'':reason});
     practiceRow.firstElementChild.dataset.lotmOfficePracticeLink=a.id;
     g.append(practiceRow);
    }
    if(v.beDigestion){const digestion=node('p',v.beDigestion);digestion.dataset.lotmMind='digestion';g.append(digestion);}
    office.append(g);
   }
  }
  const wg=sh?.wage??v.wage,wageSection=wg?node('div'):null;
  if(wg){
   const g=wageSection;g.dataset.lotmWage='';g.tabIndex=-1;
   const rent=v.duties.find(d=>d.id===LOTM_RENT_ID);
   g.append(node(office?'h4':'h3',rent?'Pay and rent':'Weekly pay'));
   if(office)g.append(...officeBudget(wg,rent).map(line=>node('p',line)));
   if(!wg.started){
    if(!office)g.append(node('p',`Your Nighthawk wage is ${wageWords(wg.weeklyPence)} a week, paid by Mrs. Orianna${wg.advance?`; half of it is kept until the advance of ${wageWords(wg.advanceLeft)} is repaid`:''}.`));
    g.append(row(button('Draw your weekly pay','wage_start',()=>run(()=>startWage(),''),!startWage,'The first week closes seven days from now.')));
   }
   else{
    g.append(node('p',wg.owedWeeks?`Owed now: ${wageWords(wg.net)} for ${wg.owedWeeks===1?'one week':`${wg.owedWeeks} weeks`}${wg.kept?` (${wageWords(wg.kept)} kept against the advance)`:''}.`:`Next pay in ${formatDuration(wg.nextIn)}.`),
     ...(wg.advance?[node('p',wg.advanceLeft?`Advance still owed: ${wageWords(wg.advanceLeft)}.`:'The advance is repaid; the full wage is yours.')]:[]));
    if(wg.owedWeeks&&collectWage)g.append(row(button(`Collect your pay · ${wageWords(wg.net)}`,'wage_collect',()=>run(()=>collectWage(),''),false,'Every closed week not yet collected.')));
   }
   (office||actions).append(g);
  }
  if(office){
   if(sh.customers?.length){
    const customers=node('div');customers.dataset.lotmOfficeCustomers='';
    customers.append(node('h4','Customers'),...sh.customers.map(line=>node('p',line)));office.append(customers);
   }
   const [latest,...earlier]=sh.recent||[];
   if(latest){
    const recap=node('div');recap.dataset.lotmOfficeRecap='';recap.append(node('h4','Latest result'),node('p',latest));
    if(earlier.length){const history=node('details');history.open=officeHistoryOpen;history.ontoggle=()=>{officeHistoryOpen=history.open;};history.append(node('summary','Earlier results'),...earlier.map(line=>node('p',line)));recap.append(history);}
    office.append(recap);
   }
   work.prepend(office);
  }
  // RET3: the paused Village life is resumed from the connection panel, not from here. It leads the Here tab: the other life is a crossing fact, not a path detail.
  // W1d (LT10 read side): the flat on the household model: who lives there, the rent, what is kept there.
  if(v.home?.lines?.length){const h=node('div');h.dataset.lotmHome='';h.append(node('h3','Home'),...v.home.lines.filter(l=>!homeModelLines(v.home.model).includes(l)).map(l=>node('p',l)));
   const detail=node('div');detail.dataset.worldHomeView='';renderHomeView(detail,v.home.model);h.append(detail);
   // W3a-S3: home acts through the shared home engine (take up the flat, buy at the market, fit a piece); a shut one says why.
   for(const a of v.home.actions||[]){const b=node('button',a.label);b.type='button';b.dataset.lotmHomeAct=a.id;b.disabled=!a.eligible;if(!a.eligible)b.title=a.reason;b.onclick=()=>run(()=>homeAct?.(a.request));h.append(b);if(!a.eligible&&a.reason)h.append(node('p',a.reason));}
   actions.append(h);}
  if(v.pausedLife){const r=row(node('span',`${v.pausedLife} is paused where you left it. Your continuing connection is the way back.`),button('Open Continuing connection','open_connection',()=>expandWorkspaceModule('continuation'),false,'Resuming pauses this Tingen life in turn.'));r.dataset.lotmPausedLife='';actions.append(r);}
  if(!resident&&v.cause.line)path.append(node('p',v.cause.line));
  // FRC51: what the lead witnessed and has not shaken off, under Here for resident and other lives alike (prose, never a count).
  for(const line of v.mind?.lines||[]){const p=node('p',line);p.dataset.lotmMind='';actions.append(p);}
  if(v.beDigestion&&!office){const p=node('p',v.beDigestion);p.dataset.lotmMind='digestion';actions.append(p);}
  if(!resident&&v.clearance.length){path.append(node('h3',`Clearance · ${v.role.replace(/_/g,' ')}`));for(const g of v.clearance){const r=node('p',`Grade ${g.grade}: ${g.ok?'you may handle it here. ':''}${g.ok?g.line:tidyReasons(g.reasons,'; ')}`);r.dataset.clearance=String(g.grade);path.append(r);}}
  // FD8: recurring duties as plain prose (UR70-UR75) for resident and non-resident lives alike: what it is, when it shuts, how many missed; a button only while the window is open.
  for(const d of v.duties){const span=m=>m>=1440?`${Math.ceil(m/1440)} days`:m>=60?`${Math.ceil(m/60)} hours`:`${m} minutes`;
  const when=d.open?` It shuts in ${span(d.shutsIn)}.`:d.status==='late'?' The window has shut for this round.':` ${d.reason}`,gone=d.missed?` Missed ${d.missed} time${d.missed===1?'':'s'}.`:'';
  if(d.standing){ // a standing order (OB1): the choice sits beside the line; it settles on the clock, so there is no button
   const sel=node('select');sel.dataset.dutyPolicy=d.id;sel.setAttribute('aria-label','Standing order');
   for(const o of d.policies){const op=node('option',o.label);op.value=o.id;op.selected=o.id===d.policy;sel.append(op);}
   sel.onchange=()=>{try{setOrder(d.id,sel.value);notice.textContent='Standing order changed.';}catch(e){notice.textContent=e.message;}signature='';render();};
   const inBudget=office&&wageSection&&d.id===LOTM_RENT_ID;
   if(inBudget)sel.title=d.policies.find(option=>option.id===d.policy)?.label||'';
   const context=inBudget?(d.escalation?`${d.escalation} `:''):`${d.why}${gone}${d.escalation?` ${d.escalation}`:''} `;
   const sr=row(node('span',`${context}Standing order: `),sel);sr.dataset.dutyId=d.id;(inBudget?wageSection:work).append(sr);continue;}
  const line=node('span',`${d.why}${when}${gone}`);const guardShift=d.id===LOTM_GUARD_DUTY_ID,r=d.open&&attend?row(line,button(guardShift?'Stand the night watch':'Hand it in',`duty_${d.id}`,()=>{try{const said=attend(d.id);notice.textContent=typeof said==='string'&&said?said:'Handed in.';}catch(e){notice.textContent=e.message;}signature='';render();},false)):row(line);r.dataset.dutyId=d.id;work.append(r);}
  // LT8: tie-gated conversations (person_ties offers) sit with the duties that earn them; a disabled button says what opens it (UR70-UR75).
  // XC4: a tie shown from first meeting, before it moves, with what moves it (knowledge only, never the regard number).
  for(const r of v.reputation||[]){const p=node('p',`${r.label} · ${r.heard?'what they have heard':'what you have seen'}: ${r.line}`);p.dataset.reputationAudience=r.audienceId;if(r.heard)p.dataset.reputationHeard=r.teller;p.dataset.lotmTie=(v.ties||[]).find(t=>t.personId===r.audienceId)?.alias||'';work.append(p);}
  for(const t of (v.ties||[]).filter(t=>!(v.reputation||[]).some(r=>r.audienceId===t.personId))){const p=node('p',`${t.label}: ${t.line}`);p.dataset.lotmTie=t.alias;work.append(p);}
  for(const o of v.tieOffers||[]){if(o.taken){const said=node('p',o.said);said.dataset.tieSaid=o.id;work.append(said);continue;}const r=row(node('span',o.eligible?o.description:`${o.description} ${tidyReasons(o.reasons)}`),button(o.label,`tie_${o.id}`,()=>{try{tieAsk(o.id);notice.textContent='Noted in your Notebook.';}catch(e){notice.textContent=e.message;}signature='';render();},!o.eligible||!tieAsk));r.dataset.tieOffer=o.id;work.append(r);}
  if(!resident){
  const held=[v.holds.dose?'prepared dose':'',v.holds.clownDose?'prepared Clown dose':'',...v.doseLabels,...v.marketHeld,...(v.holds.sealed3?['sealed grade 3 item']:[]),...[['frog','dried frog'],['hairs','bundle of hairs'],['ink','jar of grave-dust ink']].filter(([k])=>v.holds[k]).map(x=>x[1]),...['comparator','sampleA','sampleB'].filter(n=>v.holds[n]).map(n=>n==='comparator'?'comparator sample':`sample lot ${n.slice(-1)}`)].filter(Boolean);
  work.append(node('p',`You hold: ${held.length?held.join(', '):'nothing from the bench'}.`));
  if(v.issuedDose)work.append(node('p',`Issued dose label: ${v.issuedDose.text}.`));
  if(v.broker){
   work.append(node('h3','Broker custody'),node('p',`Money held pending verification: ${v.broker.escrowPence} pence.`));
   for(const b of v.broker.barters)work.append(node('p',`Posted barter: ${b.offered} (${b.offeredPence} pence) for ${b.label} (${b.requestedPence} pence), equal value. Appraisal costs ${b.feePence} pence separately.`));
   for(const t of v.broker.trades){const r=node('p',`${t.label}: ${t.status}.`);r.dataset.brokerTrade=t.id;if(t.certainty)r.dataset.itemReading=t.certainty;work.append(r);}
  }
  if(v.merit){const m=v.merit,box=node('div');box.dataset.lotmMerit='';box.append(node('h3',`${m.name} · merit`));
   const bal=node('p',`Merit in hand: ${m.balance} (earned ${m.earned}, spent ${m.spent}). Standing is tracked separately.`);bal.dataset.lotmMeritBalance=String(m.balance);box.append(bal);
   if(m.copyFile){const copy=node('section');copy.dataset.lotmCopyFile='';copy.append(node('h4','One file, at your own pace'),node('p',m.copyFile.status));for(const a of m.copyFile.actions)copy.append(button(a.label,a.id,event=>run(()=>act(a.id),'',{copyMarkKeyboard:a.id===COPY_FILE.flag&&event.detail===0&&document.activeElement===event.currentTarget}),!a.eligible,tidyReasons(a.reasons)));box.append(copy);}
   for(const a of m.missions)box.append(row(button(a.action.label,a.action.id,()=>run(()=>act(a.action.id),''),!a.action.eligible,tidyReasons(a.action.reasons)),node('span',`${a.comparison?a.comparison+' ':''}Issuer ${a.issuer}. Risk: ${a.risk}`)));
   for(const a of m.missions.filter(a=>a.repeat)){const q=a.repeat;box.append(row(button(`Do 2 assignments: ${a.label} · ${formatDuration(a.minutes*2)} · earns ${a.pay*2} merit`,q.id,()=>run(()=>act(q.id),''),!q.eligible,tidyReasons(q.reasons)),node('span',[q.text,...(q.eligible?[]:q.reasons)].join(' '))));}
   if(m.routine){const line=node('p',m.routine);line.dataset.lotmRoutine='';line.setAttribute('role','status');box.append(line);}
   if(m.publicWork){const lead=m.publicWork,section=node('section');section.dataset.lotmPublicWorkLead='';
    if(!lead.note){section.append(node('p',lead.forecast));const a=lead.handover;if(a?.visible)section.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons)),...(!a.eligible?[node('span',tidyReasons(a.reasons))]:[])));}
    else{section.append(node('h3','A public work lead'),node('p',lead.note),node('p',`Terms to check at the duty office: ${lead.terms.endorsementPence} pence for endorsement, then ${formatDuration(lead.terms.minutes)} for ${lead.terms.payPence} pence on a completed errand. Availability depends on the officer and your papers.`));
     const walk=v.moves.find(m=>m.to===lead.place);if(walk)section.append(button(`Follow the lead: ${walk.label}`,`lead_${walk.id}`,()=>run(()=>move(walk.id),''),!walk.eligible,tidyReasons(walk.reasons)));
     else section.append(button('See the duty office’s current work','public_work_here',()=>tabsUi.select('here'),false));}
    box.append(section);}
   if(m.practice?.learned){const pr=m.practice,pv=pr.pool,pb=node('div');pb.dataset.lotmPractice='';
    const lv=node('p',`Copying hand: mastery ${pr.level}.${pr.next.length?` At ${pr.next[0].at}: ${pr.next[0].label.toLowerCase()}.`:''}`);lv.dataset.lotmPracticeLevel=String(pr.level);pb.append(lv);
    const pl=node('p',`Desk practice pooled: ${pv.pool} of ${pv.cap}. Each copy adds to it until it is full. ${pv.reason}`);pl.dataset.lotmPracticePool=String(pv.pool);pb.append(pl);
    for(const c of pv.checkpoints){const cl=node('p',`${c.label} (${c.at} pooled): ${c.text} ${c.on?'You have this now.':'Not yet.'}`);cl.dataset.lotmPracticeCheckpoint=c.on?'on':'off';pb.append(cl);}
    const sp=pr.spend,warn=sp.loses.length?`Spending drops you below ${sp.loses.join(', ')}.`:'No checkpoint is lost by this.';
    if(sp.action)pb.append(row(button(sp.action.label,sp.action.id,()=>run(()=>act(sp.action.id),''),!sp.action.eligible,tidyReasons(sp.action.reasons)),node('span',warn)));
    box.append(pb);}
   box.append(node('p','Evidence store'));
   for(const r of m.store){const line=row(button(`${r.label} · ${r.price} merit${r.left==null?'':` · ${r.left} left`}`,r.action.id,()=>run(()=>act(r.action.id),''),!r.action.eligible,tidyReasons(r.reasons)),node('span',r.eligible?r.text:tidyReasons(r.reasons)));line.dataset.lotmMeritRow=r.id;box.append(line);}
   work.append(box);}
  renderBench(v);
  }
  if(owedRows.length&&currentObserver().sees({capability:'lotm.own-power-notes'})){
   const owe=node('section');owe.dataset.lotmOwed='';owe.append(node('h3','What I owe'));
   for(const r of owedRows){const quote=r.quote,line=row(node('span',r.effect));line.dataset.lotmOwedRow=r.id;
    if(quote&&settle)line.append(button(quote.label||'Settle',`owed_${r.id}`,()=>{let paid=0;run(()=>{paid=settle(quote);},()=>`Paid ${paid} coins.`);},!!quote.blocked,quote.blocked||''));owe.append(line);}
   work.append(owe);}
  const jobsHome=resident?actions:work;
  if(resident&&v.jobs.length)jobsHome.append(node('h3','In progress'));
  for(const j of v.jobs){
   const refund=j.cancellation==='refund',returns=refund&&j.refundsInputs;
   const label=returns?'Stop (reserved inputs returned)':refund?'Stop work':'Stop (cost not returned)';
   const consequence=returns?'Reserved inputs were returned; elapsed time stays spent.':refund?'The work stopped; elapsed time stays spent.':'What this work cost is gone.';
   const jobStatus=node('p',`${j.label} · ${j.left} min left`);jobStatus.dataset.lotmJob=j.id;if(j.commandId)jobStatus.dataset.lotmJobCommand=j.commandId;jobStatus.tabIndex=-1;
   jobsHome.append(row(jobStatus,...(j.cancellable?[
    button(label,'cancel',()=>run(()=>cancel(j.id),`You stopped. ${consequence}`),false,returns?'Stopping returns the reserved inputs; elapsed time stays spent.':refund?'Stopping ends this work; elapsed time stays spent.':'Stopping forfeits what this spent.'),
    node('span',returns?'Stopping returns reserved inputs; elapsed time stays spent.':refund?'Stopping keeps elapsed time spent.':'Stopping keeps the paid cost spent.')]:[])));
  }
  const commonActions=node('section');commonActions.dataset.commonActions='lotm';
  if(v.waits?.length||activeWait){
   commonActions.append(node('h3','Common actions'),node('p','Wait here while the day continues. A local decision can interrupt the wait.'));
   for(const a of v.waits||[]){const reasons=activeWait?'Stop waiting before choosing another time.':tidyReasons(a.reasons),b=button(a.label,a.id,()=>startWait(a.id),!!activeWait||!a.eligible,reasons);waitButtons.set(a.id,b);commonActions.append(row(b,...(activeWait||!a.eligible?[node('span',reasons)]:[])));}
  }
  const renderObjectAction=a=>row(button(a.label,a.id,()=>run(()=>{
   const before=(v.records||[]).find(r=>r.id===a.knowledgeKey);
   act(a.id);
   const after=read(selected),job=(after.jobs||[]).find(j=>j.commandId===a.id);
   if(job){
    const text=`Started: ${shortActionLabel(a.label).text}. See In progress for time and stopping terms.`;
    objectNotice={jobId:job.id,knowledgeKey:a.knowledgeKey,before:before?{...before}:null,text};
    notice.textContent=text;
   }else notice.textContent='Action settled. See Last result for its consequence.';
  }),!a.eligible,tidyReasons(a.reasons)));
  // STN19: a constable who knows you and can place you has a case; the routes are yours. Cases that cannot be proven do not show (nobody has a case against a man they cannot place).
  const lw=v.law;
  if(lw){
   const g=node('div');g.dataset.lotmLaw='';g.append(node('h3','The watch'));
   for(const c of lw.cases){g.append(node('p',c.line));for(const r of c.routes)g.append(row(button(r.label,`law_${r.id}`,()=>{let said='';run(()=>{said=lawRoute(c.id,r.id);},()=>said);},!lawRoute||!!r.blocked,r.blocked||r.hint)));}
   for(const t of lw.lines)g.append(node('p',t));
   actions.prepend(g);
  }
  if(v.arc)actions.prepend(renderLotmTaskSummary(v,{findControl,findWork,renderAction:renderObjectAction}));
  if(v.tentIncident){
   const tent=node('section');tent.dataset.lotmTentIncident='';
   tent.append(node('h3',v.tentIncident.title),node('p',v.tentIncident.status));
   const handbill=renderCircusHandbill(v.tentIncident.paper,{document:panel.ownerDocument,open:handbillOpen,onToggle:open=>{handbillOpen=open;}});if(handbill)tent.append(handbill);
   actions.prepend(tent);
  }
  for(const stock of v.stockViews||[]){
   const supplies=node('section');supplies.dataset.lotmStock='true';supplies.append(node('h3',stock.title));
   for(const r of stock.rows)supplies.append(node('p',`${r.label}: ${r.amount??'unknown'}`));
   actions.append(supplies);
  }
  for(const meeting of v.remoteMeetings||[]){
   const room=node('section');room.dataset.remoteMeeting=meeting.id;room.append(node('h3',meeting.title),node('p',`Last familiar physical place: ${meeting.anchor}`));
   for(const seat of meeting.seats)room.append(node('p',`${seat.label}: ${seat.connected?'connected':'connection lost'}`));
   actions.append(room);
  }
  const summary=lotmTaskSummary(v);
  // The current command lives beside its quote; in-flight work has its own
  // status/Stop controls. Keep other native object actions in their disclosure.
  const otherObjectActs=(v.objectActs||[]).filter(a=>summary?.targetId!==a.id&&!v.jobs.some(j=>j.commandId===a.id&&j.id===summary?.workId));
  if(otherObjectActs.length){
   const objects=node('details');objects.open=true;objects.dataset.lotmObjectActs='';objects.append(node('summary','Things at hand'));
   for(const a of otherObjectActs){
    const reason=[...new Set(a.reasons||[])].join(' ');
    objects.append(node('p',a.description),renderObjectAction(a),...(!a.eligible?[node('span',reason)]:[]));
   }
   actions.append(objects);
  }
  if(v.inferences?.length){
   const thoughts=node('details');thoughts.dataset.lotmInferences='';thoughts.dataset.perspective='player';thoughts.append(node('summary','Thoughts and intentions · Your thoughts'));
   for(const a of v.inferences)thoughts.append(node('p',`${a.chainLabel}: ${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(a.record?[node('p',a.record)]:[]),...(a.status?[node('p',`Your intention: ${a.status}`)]:[]),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   actions.append(thoughts);
  }
  // W2b: powers on the shared spell lowering; a shut one says why (UR70-UR75).
  if(v.powers?.length){const pw=node('div');pw.dataset.lotmPowers='';pw.append(node('h3','Powers'));for(const a of v.powers)pw.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(a.description?[node('p',a.description)]:[]),...(!a.eligible&&a.reasons.length?[node('p',tidyReasons(a.reasons))]:[]));actions.append(pw);}
  if(v.abilityConflicts?.length){
   const encounter=node('details');encounter.dataset.lotmAbilityConflicts='';encounter.dataset.perspective='player';encounter.append(node('summary','Encounters · Your encounter'));
   for(const a of v.abilityConflicts)encounter.append(node('p',`${a.encounterLabel}: ${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(a.record?[node('p',a.record)]:[]),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   actions.append(encounter);
  }
  if(v.divinations?.length){
   const rites=node('details');rites.dataset.lotmDivinations='';rites.dataset.perspective='player';rites.append(node('summary','Rites and questions · Your rite'));
   for(const a of v.divinations)rites.append(node('p',`${a.queryLabel}: ${a.question} ${a.method}. ${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(a.record?[node('p',a.record)]:[]),...(a.signal?[node('p',a.signal)]:[]),...(a.belief?[node('p',`Your interpretation: ${a.belief}`)]:[]),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   actions.append(rites);
  }
  if(v.altarRites?.length){
   // One block per rite: the altar as text lines in placing order, then its steps with only the next one a live button (U3).
   const altar=node('details');altar.dataset.lotmAltarRites='';altar.dataset.perspective='player';altar.append(node('summary','Altar and rites · Your rite'));
   const byRow=new Map();for(const a of v.altarRites){if(!byRow.has(a.rowId))byRow.set(a.rowId,[]);byRow.get(a.rowId).push(a);}
   for(const [rowId,steps] of byRow){
    const rite=node('div');rite.dataset.lotmRite=rowId;rite.append(node('h4',steps[0].rowLabel));
    if(steps[0].layout)rite.append(node('p',`Altar, in the order you set it: ${steps[0].layout.stations.map((x,i)=>`${i+1}. ${x.label}${steps.find(t=>t.id===`${rowId}.${x.id}`)?.status==='done'?' (set)':''}`).join('; ')}.`));
    for(const a of steps)rite.append(node('p',`${a.index+1}/${a.total} ${a.step}${a.status==='done'?' · done':a.status==='next'?' · next':''}. ${a.description} ${a.costText}`),...(a.status==='next'?[row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[])]:[]));
    altar.append(rite);
   }
   actions.append(altar);
  }
  if(v.sealedRecords?.length){
   // Sealed records (R6): the stack is fetched, then each page is its own read; a page above the lead's clearance shows why it stays shut.
   const sealed=node('details');sealed.dataset.lotmSealedRecords='';sealed.dataset.perspective='player';sealed.append(node('summary','Sealed records · Your reading'));
   for(const a of v.sealedRecords){
    const line=a.status==='read'?'Read.':a.status==='ready'?`${a.duration} min. ${a.costText}`:tidyReasons(a.reasons);
    const item=node('div');item.dataset.lotmRecordRow=a.id;item.dataset.status=a.status;
    item.append(node('p',`${a.label} · ${a.status==='read'?'read':a.status==='ready'?'ready':a.status==='withheld'?'withheld':'not yet'}`),node('p',line),
     ...(a.status==='read'?[]:[row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons)))]));
    sealed.append(item);
   }
   actions.append(sealed);
  }
  if(v.charmLoan)actions.append(renderCharmLoan(v.charmLoan,{node}));
  if(v.personalShopping&&reviseCommissionEarmark)actions.append(renderPersonalShopping(v.personalShopping,{revise:reviseCommissionEarmark,buy:act,run,node}));
  if(v.exchanges?.length){
   const exchange=node('details');exchange.dataset.lotmExchanges='';exchange.dataset.perspective='player';exchange.append(node('summary','Belongings · Your exchange'));
   for(const a of v.exchanges)exchange.append(node('p',a.description),node('p',a.costText),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   actions.append(exchange);
  }
  if(v.making?.length){
   const making=node('details');making.dataset.lotmMaking='';making.dataset.perspective='player';making.append(node('summary','Making · Your preparation'));
   for(const a of v.making)making.append(node('p',a.description),node('p',a.costText),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   actions.append(making);
  }
  const talkPeople=new Map();
  for(const a of v.topicTalks||[]){
   let person=talkPeople.get(a.personId);
   if(!person){person=node('details');person.dataset.lotmTopicPerson=a.personId;person.dataset.perspective='player';person.append(node('summary',`Talk to ${a.personLabel} · ${a.perspective}`));talkPeople.set(a.personId,person);actions.append(person);}
   let topic=[...person.children].find(n=>n.dataset?.lotmTopic===a.topicId);
   if(!topic){topic=node('details');topic.dataset.lotmTopic=a.topicId;topic.append(node('summary',a.topicLabel));person.append(topic);}
   topic.append(node('p',a.description),node('p',`${a.costText} ${a.effectText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
  }
  if(v.bodyCare?.length){
   const care=node('details');care.dataset.lotmBodyCare='';care.dataset.perspective='player';care.append(node('summary','Rest and meals · Your body'));
   for(const a of v.bodyCare)care.append(node('p',`${a.description} ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   actions.append(care);
  }
  // OPN2/OPN3/OPN4 (display only; command definitions stay byte-identical): a broker step waits out of sight until its turn,
  // its locked reason says what it waits for, and doses that look alike on purpose carry a lot number.
  const BROKER_WAIT={pay:'The broker must be at the docks with this lot, and you must be able to pay or swap.',verify:'The appraiser checks only a lot you have paid the broker to hold.',settle:'Settling waits for the appraiser to judge the lot genuine.',reject:'Taking your side back waits for the appraiser to judge the lot forged.'};
  const brokerStep=a=>/(?:^|\.)lot_(pay|verify|settle|reject)_/.exec(a.id)?.[1];
  const lotNo=new Map();
  for(const a0 of v.actions){const step=brokerStep(a0);if(step&&step!=='pay'&&!a0.eligible)continue;
   const a=step?{...a0,reasons:a0.reasons.map(r=>r==='The required knowledge, means or circumstances are missing.'?BROKER_WAIT[step]:r)}:a0;
   if(step&&/an unmarked/.test(a.label)){const id=a.id.replace(/lot_(pay|verify|settle|reject)_/,'lot_');if(!lotNo.has(id))lotNo.set(id,lotNo.size+1);a.label=a.label.replace(/ an unmarked /,` lot ${lotNo.get(id)}, an unmarked `);}
   actions.append(row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))));
   const power=a.id.startsWith('book.lotm.ab.')?channelNote(a,{holder:true}):'';
   if(power&&currentObserver().sees({capability:'lotm.own-power-notes'})){const pn=node('p',power);pn.dataset.lotmPower=a.id;actions.append(pn);}}
  if(currentObserver().sees({capability:'lotm.public-reading'})){
   let q=null;try{q=lotmLibraryQuote();}catch{}
   if(q){const lib=node('div');lib.dataset.lotmLibrary='';
    if(q.done)lib.append(node('p','You have read the city papers in the reading room.'));
    else lib.append(row(button(`${q.question||'Read the city papers in the reading room'} · ${q.minutes||60} min`,'library_study',()=>run(()=>lotmLibraryStudy(),'You read the city papers.'),!q.eligible,q.eligible?'':q.reason||'')));
    actions.append(lib);}
  }
  if(commonActions.childNodes.length)actions.append(commonActions);
  if(v.journeys?.length){
   const journeys=node('details');journeys.dataset.lotmJourneys='';journeys.dataset.perspective='player';journeys.append(node('summary','Journeys · Your journey'));
   for(const a of v.journeys)journeys.append(node('p',`${a.description} ${a.routeText}. ${a.costText}`),row(button(a.label,a.id,()=>run(()=>act(a.id),''),!a.eligible,tidyReasons(a.reasons))),...(!a.eligible?[node('p',tidyReasons(a.reasons))]:[]));
   walks.append(journeys);
  }
  if(v.elsewhere?.length){walks.append(node('h3','Elsewhere'));for(const person of v.elsewhere){const line=node('p',person.label);line.dataset.lotmElsewhere=person.id;walks.append(line);}}
  if(v.district&&!resident)walks.append(node('p',`${v.district.claim}`));
  // RPX14 round 2: one departures board (nearest first, walk buttons in their rows) replaces the Places lists and
  // per-district walk disclosures; the walking map opens below it on request. Walks with no listed place keep a plain row.
  const walkRow=m=>row(button(m.label,m.id,()=>run(()=>move(m.id),'You walk there.'),!m.eligible,tidyReasons(m.reasons)));
  const legs=legsFromMoves(v),walkIds=new Set(legs.map(l=>l.moveId));
  const mapShown=mapOpen??((v.places||[]).filter(p=>!p.here&&Number.isFinite(p.minutes)).length<=NEAR_WALKS);
  if(v.places?.length){
   walks.append(walkBoard({...v,legs,elsewhere:[]},{move:id=>run(()=>move(id),'You walk there.'),onToggleMap:()=>{mapOpen=!mapShown;signature='';render();},mapShown}));
   if(mapShown)walks.append(walkMapBlock({...v,legs},{open:true,ontoggle:o=>{if(!o){mapOpen=false;signature='';render();}},onPick:findControl}));
  }
  // OPN2/OPN3: a cast life can know hundreds of addresses. The nearest few stay in view; the rest wait in one
  // disclosure, nearest first (default 8, a dial). Its open state survives re-renders like placesOpen.
  const others=v.moves.filter(m=>!walkIds.has(m.id)).sort((a,b)=>(a.minutes??1e9)-(b.minutes??1e9));
  for(const m of others.slice(0,NEAR_WALKS))walks.append(walkRow(m));
  if(others.length>NEAR_WALKS){
   const more=node('details');more.dataset.lotmMoreWalks='';more.dataset.perspective='player';more.open=placesOpen.get('more-walks')===true;
   more.ontoggle=()=>placesOpen.set('more-walks',more.open);
   more.append(node('summary',`More places you know (${others.length-NEAR_WALKS})`));
   for(const m of others.slice(NEAR_WALKS))more.append(walkRow(m));
   walks.append(more);
  }
  if(v.records.length){
   notebook.append(node('h3','What you know'));
   const recent=v.records.slice(-6).reverse();for(const r of recent)notebook.append(node('p',r.text));
   if(v.records.length>6){const earlier=node('details');earlier.append(node('summary',`Earlier notes (${v.records.length-6})`));for(const r of v.records.slice(0,-6))earlier.append(node('p',r.text));notebook.append(earlier);}
  }
  if(v.skills?.length&&currentObserver().sees({capability:'lotm.own-power-notes'})){
   const sk=node('section');sk.dataset.lotmSkills='';sk.append(node('h3','Skills you have used'));
   for(const k of v.skills){const l=node('p',`${k.id}. ${k.power}`);l.dataset.lotmSkill=k.id;sk.append(l);}
   path.append(sk);}
  tabsUi.update(v);
  if(focusId&&!focused.isConnected&&!restoreControl(focusId))panel.querySelector('#lotm-current-task-title')?.focus({preventScroll:true});
  if(handbillFocused&&!focused.isConnected)panel.querySelector('[data-lotm-handbill-summary]')?.focus({preventScroll:true});
  // A review link is navigation, not the native command it points at. Retain
  // that exact target across refresh; never transfer a pending click to a new task.
  if((taskFocus||headingFocused)&&!focused.isConnected){
   const [attr,id]=taskFocus||[];
   const same=taskFocus&&[...panel.querySelectorAll('[data-lotm-task-link],[data-lotm-task-wait-link],[data-lotm-task-work-link],[data-lotm-job]')].find(n=>n.dataset[attr]===id);
   (same||panel.querySelector('#lotm-current-task-title'))?.focus({preventScroll:true});
  }
 }
 definePanel({id:'lotm',title:'Tingen workroom',role:'actions',node:panel,home,perspective:'book.lotm.tingen',discovered:discovered||(()=>{const v=read();return v.enrolled||v.startable;}),eligible:()=>true,unavailableReason:()=>'Visit the Village to see the Tingen starts here'});
 function openShift(id){render();return findControl(`shift_${id}`,{focusAction:true});}
 function openWage(){render();const wage=panel.querySelector('[data-lotm-wage]');if(!wage)return false;showTabOf(wage);wage.focus();wage.scrollIntoView({block:'nearest'});return true;}
 function openCopyQuestion(){render();return findControl(COPY_FILE.ask,{focusAction:true})||findControl(COPY_FILE.flag,{focusAction:true});}
 render();return {render,openShift,openWage,openCopyQuestion};
}
