import {homeModelLines} from './home_overview_model.js';
import {renderHomeView} from './ui/home_view.js';
import {definePanel} from './panel_kit.js';
import {setWorkspaceModuleTitle} from './workspace_layout.js';
import {shortActionLabel} from './ui/action_label.js';
import {renderHpSchoolDay} from './ui/hp_school_day.js';
import {registerOwnedWorkPanel} from './adventure_notebook.js';
import {hpLeadTieCommands,hpLeadMakingCommands} from './world_packs/book_hp_lead_life_data.js';
import {hpLeadSpellCommands,hpLeadBenchCommands,HP_FEATHER_CAST,HP_SPELL_PRACTICE} from './hp_lead_spells.js';
import {HP_LEAD_MAKING} from './hp_lead_making.js';
import {HP_LEAD_FLIGHT,isHpSchoolPassage} from './book_world_hp_lead_flight.js';
import {isHpDuelPassage} from './book_world_hp_lead_duel.js';
import {isHpHalloweenPassage} from './book_world_hp_lead_halloween.js';
import {isHpQuidditchPassage} from './book_world_hp_lead_quidditch.js';
import {isHpMirrorPassage} from './book_world_hp_lead_mirror.js';
import {isHpFlamelPassage} from './book_world_hp_lead_flamel.js';
import {isHpNorbertPassage} from './book_world_hp_lead_norbert.js';
import {isHpFinalePassage} from './book_world_hp_lead_finale.js';
import {HP_SUMMER,HP_SUMMER_ACTION} from './hp_summer_passage.js';
// The lead life owns its household and school work, including the native
// train and Sorting commands shared with the public start.
registerOwnedWorkPanel((_work,definition)=>definition?.worldId==='book.hp.lead.world'?'hp_panel':null);
// Workspace panel for the HP lead life: the current task, its control, the options that were not taken, the last result.
// It draws the domain projection and the structured campaign view; every start goes through the host's command.
const node=(tag,text)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;return n;};
const workTime=minutes=>{
 const days=Math.floor(minutes/1440),hours=Math.floor(minutes%1440/60),rest=minutes%60;
 return [days&&`${days} d`,hours&&`${hours} h`,rest&&`${rest} min`].filter(Boolean).join(' ');
};
export function createHpLeadPanel({project,read,command,keepSlot,study,homeAct}){
 const panel=node('section');panel.id='hp_panel';panel.className='expedition_panel';panel.dataset.surfaceType='place-service';
 const heading=node('h2','The household day'),schoolBody=node('div'),body=node('div'),encounterSlot=node('div');encounterSlot.dataset.sharedSlot='encounter'; // AR17: the shared fight panel renders here
 panel.append(heading,schoolBody,encounterSlot,body);
 let notice='',schoolHistoryOpen=false;
 const render=()=>{
  const v=project();body.replaceChildren();schoolBody.replaceChildren();
  if(!v?.enrolled)return;
  const title=v.schoolDay?'Hogwarts':'The household day';
  if(heading.textContent!==title){heading.textContent=title;setWorkspaceModuleTitle('hp',title);}
  const campaign=read(),arc=v.arc,section=node('section');section.className='ui-panel-section';section.dataset.hpArc=arc.id;
  if(v.summer){
   const s=node('section');s.className='ui-panel-section';s.dataset.hpSummer='';
   s.append(node('h3','Before the school term'),node('p',v.summer.date),
    node('p',v.summer.remaining?`Next: the train to Hogwarts, available on 1 September. ${workTime(v.summer.remaining)} until then.`:'It is 1 September. Take the train to Hogwarts when you are ready.'));
   const offer=(campaign.extensions||[]).find(e=>e.id===HP_SUMMER),a=(campaign.actions||[]).find(a=>a.id===HP_SUMMER_ACTION),job=(campaign.jobs||[]).find(j=>j.commandId===HP_SUMMER_ACTION);
   const b=node('button',job?'Stop household routine':offer?'Choose an ordinary household routine':a?.label||'');b.type='button';b.dataset.hpSummerAction=job?'stop':offer?'adopt':'start';
   b.disabled=!campaign.canWrite||(!job&&(offer?!offer.eligible:!a?.eligible));
   b.onclick=()=>{try{command(job?{type:'cancel',jobId:job.id}:offer?{type:'adopt-extension',id:offer.id,revision:offer.revision,contentHash:offer.contentHash}:{type:'action',id:HP_SUMMER_ACTION});notice=job?'Routine stopped. Time already spent still counts.':'';}catch(e){notice=e.message;}render();};
   if(job||offer||a&&v.summer.remaining){s.append(b,node('p','An optional routine through ordinary household days, with a quicker school clock. Stop to do something else; elapsed time still counts. You choose the train yourself.'));
    const reasons=offer?.reasons||a?.reasons||[];if(!job&&reasons.length)s.append(node('p',reasons.join(' ')));}
   section.append(s);
  }
  if(v.schoolDay&&!v.schoolDay.inFight)schoolBody.append(renderHpSchoolDay(v,campaign,{study,studyRun:(id,write)=>{try{write?study.writeNote(id):study.start(id);notice='';}catch(e){notice=e.message;}render();},historyOpen:schoolHistoryOpen,revealHistory:open=>{schoolHistoryOpen=open;},
   run:(request,lesson)=>{try{command(request);if(lesson)keepSlot?.();notice='';}catch(e){notice=e.message;}render();}}));
  section.append(node('h3',arc.title));
  const next=arc.next,running=next&&v.jobs.find(j=>j.commandId===next.id),action=next&&(campaign.actions||[]).find(a=>a.id===next.id);
  const excursion=v.excursion,flight=excursion?.id===HP_LEAD_FLIGHT;
  const offer=excursion&&(campaign.extensions||[]).find(e=>e.id===excursion.id);
  const schoolExtras=!v.schoolWeek||arc.done||!!offer;
  const showAftermath=()=>{
   if(arc.aftermath){const p=node('p',`Last result: ${arc.aftermath}`);p.dataset.hpLastResult='';section.append(p);}
   if(arc.done&&arc.conclusion)section.append(node('p',arc.conclusion));
  };
  if(offer){
   const start=node('button',flight?'Continue to the flying lesson':offer.label);start.type='button';start.dataset.hpExcursionStart=offer.id;
   if(flight)start.dataset.hpFlightStart=offer.id;
   start.disabled=!campaign.canWrite||!offer.eligible;
   start.onclick=()=>{try{command({type:'adopt-extension',id:offer.id,revision:offer.revision,contentHash:offer.contentHash});notice='';}catch(e){notice=e.message;}render();};
   section.append(node('p',offer.description),start);
   if(offer.reasons.length)section.append(node('p',offer.reasons.join(' ')));
  }else if(next||!excursion){
   section.append(node('p',running?`In progress: ${next.label}`:next?`Next: ${next.label}`:v.schoolWeek?'Your first week is complete.':'This day is complete.'));
  }
  if(next&&!offer){
   if(excursion?.venue){const venue=node('p',excursion.venue);venue.dataset.hpExcursionVenue='';if(flight)venue.dataset.hpFlightVenue='';section.append(venue);}
   if(action||running||!excursion){
    const link=node('button',running?'Show current work':'Show current action');link.type='button';link.dataset.hpTaskLink=next.id;
    link.onclick=()=>{const c=body.querySelector(`[data-hp="${CSS.escape(next.id)}"]`);c?.parentElement.scrollIntoView?.({block:'nearest'});c?.focus();};
    section.append(link);
   }else section.append(node('p',flight?'Return to the Great Hall to pick up the lesson.':'Return to the Great Hall to pick up the evening.'));
   if(action){
    const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(action.label);
    const b=node('button',s.text);b.type='button';b.dataset.hp=next.id;b.disabled=!!running||!action.eligible||!campaign.canWrite;
    if(s.chip)b.append(node('span',` · ${s.chip}`));
    b.onclick=()=>{try{command({type:'action',id:next.id});notice='';}catch(e){notice=e.message;}render();};
    row.append(b);
    if(action.reasons?.length)row.append(node('p',action.reasons.join(' ')));
    if(action.description)row.append(node('p',action.description));
    if((excursion||next.id.startsWith('book.hp.lead.w6.'))&&action.duration>0){
     row.append(node('p',`Time: ${workTime(action.duration)}.`));
     if(excursion&&(isHpSchoolPassage(next.id)||isHpDuelPassage(next.id)||isHpHalloweenPassage(next.id)||isHpQuidditchPassage(next.id)||isHpMirrorPassage(next.id)||isHpFlamelPassage(next.id)||isHpNorbertPassage(next.id)||isHpFinalePassage(next.id)))row.append(node('p','The school clock runs faster through this stretch. You can stop at any point and keep the time that has passed.'));
     if(excursion&&action.costs?.length)row.append(node('p',`Costs ${action.costs.join(', ')}.`));
    }
    section.append(row);
   }
   if(running){
    const job=(campaign.jobs||[]).find(j=>j.commandId===next.id);
    const t=node('p',excursion&&job?.remaining?`${workTime(job.remaining)} remaining`:`${job?.remaining??''} minutes remaining`);t.dataset.hpTaskTerms='';section.append(t);
    if(v.schoolWeek&&job?.cancellable){
     const cancel=node('button','Stop this task');cancel.type='button';cancel.dataset.hpTaskCancel=job.id;
     cancel.onclick=()=>{try{command({type:'cancel',jobId:job.id});notice='Task stopped. Time already spent still counts.';}catch(e){notice=e.message;}render();};
     section.append(cancel);
    }
   }
  }
  for(const o of v.locked||[]){const r=node('div');r.dataset.hpLocked=o.id;r.append(node('button',o.label));r.firstChild.disabled=true;r.append(node('span',' Not how it happened'));section.append(r);}
  if(excursion)showAftermath();
  if(v.being){
   // CPR10: Norbert's one card. Grain, holder, custody, care and tie read from the shared being record; nothing here is stored.
   const b=v.being,card=node('section');card.className='ui-panel-section';card.dataset.hpBeing=b.id;
   card.append(node('h3',`${b.name}, ${b.stage.toLowerCase()}`),node('p',`${b.grain==='held'?'Held':'Tied'} · with ${b.holder}. ${b.origin}`),node('p',`Care: ${b.care.line}`),node('p',b.tie.line));
   const h=node('ul');for(const line of b.custody)h.append(node('li',line));card.append(h);section.append(card);
  }
  if(v.match){
   const match=node('section');match.className='ui-panel-section';match.dataset.hpMatch='';
   match.append(node('h3','Gryffindor against Slytherin'));
   const condition={
    named:'Wood has named you as Seeker.',
    scouting:'You are above the play, looking for the Snitch.',
    scattered:'The Snitch has vanished. Hooch has awarded a penalty for the foul.',
    bucking:'The Nimbus won’t answer your steering. Hold on.',
    dangling:'You are hanging by one hand. The twins are circling below.',
    recovered:'The broom answers you again. You are back in the saddle.',
    ended:'You have the Snitch. The match is over.'
   }[v.match.position];
   if(condition)match.append(node('p',condition));
   if(v.match.score)match.append(node('p',`Final score: Gryffindor ${v.match.score.gryffindor}, Slytherin ${v.match.score.slytherin}.`));
   if(v.match.schoolDeduction)match.append(node('p',`${v.match.schoolDeduction} Gryffindor house points for the confiscated book.`));
   section.append(match);
  }
  if(v.hufflepuffResult){
   const second=node('section');second.className='ui-panel-section';second.dataset.hpHufflepuff='';
   second.append(node('h3','Gryffindor against Hufflepuff'),node('p',v.hufflepuffResult));section.append(second);
  }
  if(v.termResults){
   const cup=node('section');cup.className='ui-panel-section';cup.dataset.hpCup='';
   cup.append(node('h3','The House Cup'),node('p',v.termResults));section.append(cup);
  }
  if(v.housePoints){
   const points=node('section');points.className='ui-panel-section';points.dataset.hpHousePoints='';
   const signed=delta=>delta>0?`+${delta}`:String(delta);
   points.append(node('h3','Gryffindor’s Halloween points'),node('p',`${signed(v.housePoints.change)} points from the rescue.`));
   const list=node('ul');
   for(const {label,delta} of v.housePoints.rows)list.append(node('li',`${signed(delta)} · ${label}`));
   points.append(list);section.append(points);
  }
  const sc=v.school;
  if(sc){const s2=node('section');s2.className='ui-panel-section';s2.dataset.hpSchool='';s2.append(node('h3','The road to Hogwarts'));
   if(sc.next&&!v.schoolWeek){const a=(campaign.actions||[]).find(x=>x.id===sc.next.id);
    if(a){const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(a.label);
     const b=node('button',s.text);b.type='button';b.dataset.hpSchool=sc.next.id;b.disabled=!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===sc.next.id);
     if(s.chip)b.append(node('span',` · ${s.chip}`));
     b.onclick=()=>{try{command({type:'action',id:sc.next.id});notice='';}catch(e){notice=e.message;}render();};
     row.append(b);if(a.reasons?.length)row.append(node('p',a.reasons.join(' ')));if(a.description)row.append(node('p',a.description));s2.append(row);}}
   if(!v.schoolWeek)for(const o of sc.locked){const r=node('div');r.dataset.hpLocked=o.id;const b=node('button',o.label);b.disabled=true;r.append(b,node('span',` Not how it happened. ${o.reason}`));s2.append(r);}
   if(sc.atSchool)s2.append(node('p',sc.house?`You are a first year at Hogwarts, in ${sc.house}.`:'You have reached Hogwarts.'));
   if(sc.next||sc.atSchool)section.append(s2);}
  const renderCharm=(parent,c)=>{const a=(campaign.actions||[]).find(x=>x.id===c.id);if(!a)return;
    const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(a.label),b=node('button',s.text);b.type='button';b.dataset.hpCast=c.id;
    b.disabled=!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===c.id);if(s.chip)b.append(node('span',` · ${s.chip}`));
    b.onclick=()=>{try{command({type:'action',id:c.id});notice='';}catch(e){notice=e.message;}render();};
    const stamina=-(c.costs||[]).filter(x=>x.type==='vital'&&x.key==='stamina').reduce((n,x)=>n+x.amount,0);
    row.append(b);if(c.description)row.append(node('p',c.description));
    if(stamina)row.append(node('p',`Costs ${stamina} stamina, even if it fizzles${c.powerId?'; every try adds practice':''}.`));if(!a.eligible)row.append(node('p',a.once&&a.completed>0?'Done.':(a.reasons||[]).join(' ')));
    // OR6: a practised jinx says how often it lands now and what the last try did, under its own row.
    const jx=v.jinxRows?.[c.id];if(jx){if(Number.isFinite(jx.failChance)){const p=node('p',`Lands about ${Math.round(100*(1-jx.failChance))}% of tries now; practice raises it.`);p.dataset.hpJinxChance='';row.append(p);}
     if(jx.last){const p=node('p',`Last try: ${jx.last}`);p.dataset.hpJinxLast='';row.append(p);}}
    parent.append(row);};
  const ls=v.lessons;
  if(ls&&schoolExtras){const s3=node('section');s3.className='ui-panel-section';
   if(!v.schoolDay){s3.dataset.hpLessons='';s3.append(node('h3','Lessons'));
   for(const l of ls.lessons){const a=(campaign.actions||[]).find(x=>x.id===l.commandId);if(!a)continue;
    const row=node('div');row.dataset.panelRow='';
    const label=v.halloweenCharms&&l.commandId==='book.hp.lead.lesson_charms'? `Attend another Charms lesson · ${a.duration} min`:a.label;
    const s=shortActionLabel(label);
    const b=node('button',s.text);b.type='button';b.dataset.hpLesson=l.id;b.disabled=!l.open||!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===l.commandId);
    if(s.chip)b.append(node('span',` · ${s.chip}`));
    // The lesson runs through the host command; once it is accepted this week's class slot is kept through the duties API.
    b.onclick=()=>{try{command({type:'action',id:l.commandId});keepSlot?.();notice='';}catch(e){notice=e.message;}render();};
    row.append(b);row.append(node('p',l.open?(a.description||''):l.reason));s3.append(row);}
   for(const sp of ls.spells){const p=node('p',sp.line);p.dataset.hpSpell=sp.key;s3.append(p);}
   // W1b: casting the learned charm outside class (shared spell lowering; stamina either way, a fizzle chance that falls with practice).
   for(const c of hpLeadSpellCommands)renderCharm(s3,c);
   for(const t of ls.last){const p=node('p',`Last class: ${t}`);p.dataset.hpLessonResult='';s3.append(p);}
   }
   if(v.schoolDay){const extra=node('section');extra.className='ui-panel-section';
    for(const c of hpLeadSpellCommands)if(c.id!==HP_FEATHER_CAST)renderCharm(extra,c);
    if(extra.childElementCount){extra.prepend(node('h3','More spell practice'));section.append(extra);}}
   // W11-C: library study through the inquiry domain (one hour a session; the topic finishes on minutes plus lessons attended).
   for(const r of study?.rows?.()||[]){if(v.schoolDay&&r.topic==='charms')continue;const row=node('div');row.dataset.panelRow='';
    const b=node('button',r.label);b.type='button';b.dataset.hpStudy=r.id;b.disabled=!r.eligible||!campaign.canWrite;
    b.onclick=()=>{try{study.start(r.id);notice='';}catch(e){notice=e.message;}render();};
    row.append(b);row.append(node('p',r.eligible?r.progress:(r.done?`Worked out. ${r.progress}`:`${r.reason} ${r.progress}`)));if(r.lead){const lead=node('p',r.lead);lead.dataset.studyLead='';row.append(lead);}
    if(r.canNote){const nb=node('button','Write it up as a note');nb.type='button';nb.dataset.hpStudyNote=r.id;
     nb.onclick=()=>{try{study.writeNote(r.id);notice='You wrote a note.';}catch(e){notice=e.message;}render();};row.append(nb);}
    s3.append(row);}
   if(s3.childElementCount){if(v.schoolDay)s3.prepend(node('h3','Library study'));section.append(s3);}}
  const practice=node('section');practice.className='ui-panel-section';
   const bench=(campaign.extensions||[]).find(e=>e.id===HP_SPELL_PRACTICE);
   if(bench?.eligible&&v.atCharmsBench){const b=node('button','Open the Charms practice bench');b.type='button';b.disabled=!campaign.canWrite;
    b.onclick=()=>{try{command({type:'adopt-extension',id:bench.id,revision:bench.revision,contentHash:bench.contentHash});notice='';}catch(e){notice=e.message;}render();};practice.append(b);}
  for(const c of hpLeadBenchCommands)renderCharm(practice,c);
  if(practice.childElementCount){practice.prepend(node('h3','Charms practice bench'));
   if(v.boardResult)practice.append(node('p',v.boardResult));
   if(v.trialJournal.length){const journal=node('details');journal.append(node('summary','Cast observations'));
    for(const entry of v.trialJournal)journal.append(node('p',entry));practice.append(journal);}
   section.append(practice);}
  // Exams (hp_exam_model.js, book_world_hp_exams.js): a dated event of the year, so it shows beside any story passage, not only between excursions. The date, revision by subject before it, the papers on the day, the marks after.
  const ex=v.exams;
  if(ex&&v.school?.atSchool){const s6=node('section');s6.className='ui-panel-section';s6.dataset.hpExams=ex.phase;s6.append(node('h3','End-of-year exams'),node('p',ex.line));
   const actionRow=(id,label,note,quiet)=>{const a=(campaign.actions||[]).find(x=>x.id===id);if(!a)return;
    const row=node('div');row.dataset.panelRow='';const sh=shortActionLabel(label),b=node('button',sh.text);b.type='button';
    b.disabled=!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===id);if(sh.chip)b.append(node('span',` · ${sh.chip}`));
    b.onclick=()=>{try{command({type:'action',id});notice='';}catch(e){notice=e.message;}render();};
    row.append(b,node('p',note));if(!a.eligible&&!quiet)row.append(node('p',(a.reasons||[]).join(' ')));return row;};
   if(ex.phase==='revision')for(const r of ex.revision){const row=actionRow(r.commandId,`Revise ${r.label} · 90 min`,`${r.sessions} of ${ex.cap} sessions so far.${r.full?` You know ${r.label} as well as notes can teach you; what is left is practice or a teacher.`:''}`,r.full);
    if(row){row.dataset.hpRevise=r.id;s6.append(row);}}
   if(ex.phase==='exams'){const p=ex.nextPaper;
    if(p){const row=actionRow(p.commandId,`Sit the ${p.label} paper · 90 min`,'Marks are read on the last day of term.');if(row){row.dataset.hpPaper=p.id;s6.append(row);}}
    const doneRows=ex.papers.filter(x=>x.done);if(doneRows.length)s6.append(node('p',`Sat: ${doneRows.map(x=>x.label).join(', ')}.`));}
   if(ex.phase==='marks_pending'){const row=actionRow('book.hp.lead.read_marks','Read your marks on the board · 10 min','Pinned on the board in the common room.');if(row){row.dataset.hpMarks='';s6.append(row);}}
   if(ex.results){const r=ex.results;s6.append(node('p',`Overall: ${r.overallWords}.`));
    const list=node('ul');list.dataset.hpMarksList='';for(const m of r.rows)list.append(node('li',`${m.label}: ${m.words}. ${m.remark}`));s6.append(list);
    for(const line of r.others)s6.append(node('p',line));s6.append(node('p',r.nextYear));}
   section.append(s6);}
  // W1a: the Potions bench (shared craft engine rows); shown at school, a shut brew says what it needs (UR70-UR75).
  if(v.school?.atSchool&&schoolExtras){const s5=node('section');s5.className='ui-panel-section';s5.dataset.hpBench='';s5.append(node('h3','Potions bench'));
   const brew=v.potionsBench;
   if(brew){
    const status=node('p',brew.heat ? `${brew.heat}. Your ingredients are already in the brew.` : 'Use the school cauldron and fire. Either preparation takes 40 minutes.');
    status.dataset.hpBrewStatus='';s5.append(status);
    if(!brew.heat){
     const stock=node('ul');stock.setAttribute('aria-label','Ingredients carried and required');
     for(const i of brew.inputs)stock.append(node('li',`${i.label} · ${i.have} carried / ${i.need} needed`));
     s5.append(stock);
    }
    if(brew.flasks.length)s5.append(node('p',`Ready to hand in · ${brew.flasks.join(', ')}`));
    if(brew.handIn)s5.append(node('p',brew.handIn));
    if(brew.lessonBonus)s5.append(node('p',`The accepted cure adds up to ${brew.lessonBonus} percentage points to your chance in Potions class.`));
   }
   for(const j of campaign.jobs||[]){if(!hpLeadMakingCommands.some(c=>c.id===j.commandId))continue;const line=node('p',`${j.label} · ${j.remaining} min left`);s5.append(line);if(j.cancellable){const b=node('button','Stop this preparation');b.type='button';b.dataset.hpProcedureCancel=j.id;b.onclick=()=>{try{command({type:'cancel',jobId:j.id});notice='Completed steps are kept. You can try this step again.';}catch(e){notice=e.message;}render();};s5.append(b);}}
   let route=null; // PS11: two brews share their first step, so each route is named above its steps
   for(const c of hpLeadMakingCommands){const a=(campaign.actions||[]).find(x=>x.id===c.id);if(!a)continue;
    if(c.making?.rowId!==route){route=c.making?.rowId;const r=HP_LEAD_MAKING.rows.find(x=>x.id===route);if(r){const h=node('h4',r.label.split(' · ')[0]);h.dataset.hpBrewRoute=route;s5.append(h);}}
    const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(c.procedure?`${a.label} · ${a.duration} min`:a.label),b=node('button',s.text);b.type='button';b.dataset.hpMake=c.id;
    b.disabled=!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===c.id);if(s.chip)b.append(node('span',` · ${s.chip}`));
    b.onclick=()=>{try{command({type:'action',id:c.id});notice='';}catch(e){notice=e.message;}render();};
    const reasons=(a.reasons||[]).filter(r=>r!=='Insufficient, stale or unavailable item quantity. Refresh the trade.');
    row.append(b,node('p',a.eligible?(a.description||''):reasons.join(' ')||'The needed ingredients or flask are unavailable.'));
    if(a.eligible && c.procedure?.restart)row.append(node('p','Uses the ingredients listed above.'));
    if(a.eligible && c.making.stage==='use')row.append(node('p',`Uses ${c.making.costText}.`));
    s5.append(row);}
   if(s5.childElementCount>1)section.append(s5);}
  // LT8: tie-gated talks (person_ties offers as native commands). Shown once at school; a shut one says what opens it (UR70-UR75).
  if(v.school?.atSchool&&schoolExtras){const s4=node('section');s4.className='ui-panel-section';s4.dataset.hpFriends='';s4.append(node('h3','Friends'));
   for(const r of v.reputation||[]){const p=node('p',`${r.label} · what you have seen: ${r.line}`);p.dataset.reputationAudience=r.audienceId;p.dataset.hpTieLine=(v.ties||[]).find(t=>t.personId===r.audienceId)?.alias||'';s4.append(p);}
   for(const t of (v.ties||[]).filter(t=>!(v.reputation||[]).some(r=>r.audienceId===t.personId))){const p=node('p',`${t.label}: ${t.line}`);p.dataset.hpTieLine=t.alias;s4.append(p);}
   for(const c of hpLeadTieCommands){const a=(campaign.actions||[]).find(x=>x.id===c.id);if(!a)continue;
    const row=node('div');row.dataset.panelRow='';const s=shortActionLabel(a.label),b=node('button',s.text);b.type='button';b.dataset.hpTie=c.id;
    b.disabled=!a.eligible||!campaign.canWrite||!!v.jobs.find(j=>j.commandId===c.id);if(s.chip)b.append(node('span',` · ${s.chip}`));
    b.onclick=()=>{try{command({type:'action',id:c.id});notice='';}catch(e){notice=e.message;}render();};
    row.append(b,node('p',a.eligible?(a.description||''):(a.reasons||[]).join(' ')));s4.append(row);}
   if(s4.childElementCount>1)section.append(s4);}
  // W2c: home read side through the shared world home port (hp_lead_home.js).
  if(v.home?.lines?.length){const h=node('section');h.className='ui-panel-section';h.dataset.hpHome='';h.append(node('h3','Home'),...v.home.lines.filter(l=>!homeModelLines(v.home.model).includes(l)).map(l=>node('p',l)));
   const detail=node('div');detail.dataset.worldHomeView='';renderHomeView(detail,v.home.model);h.append(detail);
   // W3a: home acts through the shared home engine; a shut one says why (UR70-UR75).
   for(const a of v.home.actions||[]){const b=node('button',a.label);b.type='button';b.dataset.hpHomeAct=a.id;b.disabled=!a.eligible||!campaign.canWrite;b.onclick=()=>{try{homeAct?.(a.request);notice='';}catch(e){notice=e.message;}render();};h.append(b);if(!a.eligible&&a.reason)h.append(node('p',a.reason));}
   for(const id of v.home.travel||[]){const a=(campaign.actions||[]).find(x=>x.id===id);if(!a)continue;const b=node('button',a.label);b.type='button';b.dataset.hpHomeTravel=id;b.disabled=!a.eligible||!campaign.canWrite;b.onclick=()=>{try{command({type:'action',id});notice='';}catch(e){notice=e.message;}render();};h.append(b);}
   section.append(h);}
  if(!excursion)showAftermath();
  if(notice)section.append(node('p',notice));
  body.append(section);
 };
 definePanel({id:'hp',title:'The household day',role:'actions',node:panel,home:document.getElementById('main_content'),discovered:()=>!!project()?.enrolled,eligible:()=>true,unavailableReason:()=>'Begin the household day to see this'});
 render();
 return {render};
}
