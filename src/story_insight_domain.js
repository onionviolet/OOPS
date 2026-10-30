// Story recognition (IM23) and world history (IM24) as one records panel. No save slice of its own: the recap is a pure
// scan of saved chronicle facts, and the history is stored by lore_history_state.js under loreHistory.worldHistories
// (inside the expansion slice, validated with it). History is derived at one commit, on the player's first request for it.
import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {recognizeStories} from './story_recognizer.js';
import {recognizeTropes} from './trope_recognizer.js';
import {skillSummary,setRust,bindSkillRecordsPanel} from './skill_records_domain.js';
import {deriveWorldHistory,upgradeWorldEvents,DOCTRINES} from './lore_history_state.js';
let ports,panel;
export function configureStoryInsight(operations){ports=operations;}
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
const CAUSE_TEXT={'tie:grievance':'an unsettled grievance'};
const causeText=c=>CAUSE_TEXT[c]??(c.startsWith('axis:')?`strained ${c.slice(5)}`:c.startsWith('memory:')?'a remembered clash':c.replace(/^life\.experience\.inheritance\./,'').replace('debtsPaid','debts paid'));
export function storyLines(state){
 return recognizeStories(state).map(s=>({kind:s.kind,with:s.with,
  line:s.kind==='rivalry'?`A rivalry with ${s.with}, ${s.open?'still open':'settled'}, from ${s.causes.map(causeText).join(', ')}.`:`You paid ${s.salience} coin${s.salience===1?'':'s'} toward a debt owed to ${s.with}; it is closed.`}));
}
export const tropeLines=state=>recognizeTropes(state).map(t=>({id:t.id,trope:t.trope,name:t.name,line:t.line}));
const RELATION_TEXT={rival:'a standing rivalry',enemy:'open enmity'};
export function warLines(history){
 const name=id=>id.charAt(0).toUpperCase()+id.slice(1);
 return (history?.wars??[]).map(w=>({id:w.id,line:`Year ${w.year}: ${name(w.attacker)} marched on ${name(w.defender)}. Cause: ${RELATION_TEXT[w.cause.relation]??w.cause.relation} between them, and ${name(w.attacker)} was the stronger (${w.cause.attackerPower} against ${w.cause.defenderPower}).`+
  (w.attackerAllies.length?` Alongside ${name(w.attacker)}: ${w.attackerAllies.map(name).join(', ')}.`:'')+(w.defenderAllies.length?` Alongside ${name(w.defender)}: ${w.defenderAllies.map(name).join(', ')}.`:'')}));
}
const STANDING_TEXT={ally:'an alliance',friendly:'friendly terms',neutral:'neutral terms',suspicion:'open suspicion',rival:'a rivalry',enemy:'open enmity'};
const CAUSE_EVENT={'common-war':'they fought the same side of','opposed-in-war':'they ended on opposite sides of','war-grievance':'the grievance from'};
const doctrineText=id=>DOCTRINES.find(d=>d.id===id)?.text??id;
export function eventLines(history){
 const warLabel=id=>{const w=history.wars.find(x=>x.id===id);return w?`the war of Year ${w.year}`:'a war';};
 const name=id=>id.split('.').map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(' ');
 return (history?.events??[]).map(e=>{
  const head=`Year ${e.year}: `;
  if(e.kind==='pact'||e.kind==='breach')return {id:e.id,kind:e.kind,line:`${head}${name(e.a)} and ${name(e.b)} moved from ${STANDING_TEXT[e.from]} to ${STANDING_TEXT[e.to]}. Cause: ${CAUSE_EVENT[e.cause.kind]??e.cause.kind} ${warLabel(e.cause.ref)}.`};
  if(e.kind==='schism')return {id:e.id,kind:e.kind,line:`${head}${name(e.faction)} split. ${name(e.child)} broke away with about ${e.share} of its land. Cause: a dispute over ${doctrineText(e.doctrine)}.`};
  return {id:e.id,kind:e.kind,line:e.child?`${head}${name(e.faction)} named the ${name(e.child)} doctrine heresy. Cause: the split over ${doctrineText(e.doctrine)}.`:`${head}${name(e.faction)} condemned a view on ${doctrineText(e.doctrine)} as heresy; its holders stayed. Cause: the doctrine itself, with no split.`};
 });
}
export function skillLines(summary){
 if(!summary)return [];
 const rows=[];
 for(const r of summary.rusty)rows.push({kind:'rust',line:`${r.name} has gone rusty: ${r.from} at its best, ${r.to} now after ${Math.round(r.idle/1440)} days without practice. Practice wins it back faster than first learning.`});
 for(const n of summary.nearMisses)rows.push({kind:'near-miss',line:`Near miss: ${n.name} stalled ${n.short} experience short of level ${n.level+1}, left untouched for a day.`});
 for(const u of summary.untaken)rows.push({kind:'untaken',line:`Path not taken: ${u.category}, known but never practiced (${u.skills.join(', ')}).`});
 for(const d of summary.declined)rows.push({kind:'declined',line:`Path not taken: you turned down a request for ${d}.`});
 return rows;
}
export function recallHistory(){const plan=ports.plan(0);deriveWorldHistory(plan.state,{worldId:ports.world()});upgradeWorldEvents(plan.state,ports.world());ports.commit(plan);panel?.render();}
function createPanel(){
 const root=node('section');root.id='story_insight_panel';root.className='expedition_panel';root.dataset.surfaceType='expanded-center';
 const title=node('h2','Stories & history'),storiesHead=node('h3','Stories so far'),stories=node('div'),historyHead=node('h3','Regional history'),recall=node('button',"Recall the region's history"),wars=node('div'),events=node('div'),notice=node('p'),skillsHead=node('h3','Skills and paths not taken'),skillBox=node('div'),rustLabel=node('label'),rustBox=node('input'),rustText=node('span');
 rustBox.type='checkbox';rustBox.dataset.skillRust='';rustLabel.append(rustBox,rustText);skillBox.dataset.skillList='';
 rustBox.onchange=()=>{try{setRust(rustBox.checked);notice.textContent='';}catch(e){notice.textContent=e.message;rustBox.checked=!!skillSummary()?.rustOn;}};
 recall.type='button';recall.dataset.storyInsight='recall';notice.setAttribute('role','status');stories.dataset.storyList='';wars.dataset.warList='';events.dataset.eventList='';
 recall.onclick=()=>{try{recallHistory();notice.textContent='';}catch(e){notice.textContent=e.message;}};
 root.append(title,storiesHead,stories,historyHead,recall,wars,events,skillsHead,rustLabel,skillBox,notice);
 let signature;
 function render(){
  const state=ports.root(),world=ports.world(),history=state.loreHistory?.worldHistories?.[world];
  const sk=skillSummary(),next=JSON.stringify([recognizeStories(state),tropeLines(state),history??null,world,sk]);if(next===signature)return;signature=next;
  stories.replaceChildren(...(storyLines(state).map(s=>{const p=node('p',s.line);p.dataset.storyKind=s.kind;return p;})));
  for(const t of tropeLines(state)){const p=node('p',`${t.name}. ${t.line}`);p.dataset.trope=t.trope;p.dataset.tropeId=t.id;stories.append(p);}
  if(!stories.childElementCount)stories.append(node('p','No story has taken shape yet. Rivalries and debts appear here once the saved record shows them.'));
  rustLabel.hidden=!sk?.rustAvailable;rustBox.checked=!!sk?.rustOn;rustText.textContent=sk?.dial?` Let unpracticed skills go rusty here. ${sk.dial.reason}`:'';
  skillBox.replaceChildren(...skillLines(sk).map(l=>{const p=node('p',l.line);p.dataset.skillKind=l.kind;return p;}));
  if(!skillBox.childElementCount)skillBox.append(node('p','Nothing recorded yet. Near misses and rusty skills appear after time passes without practice.'));
  recall.hidden=!!history?.events;recall.textContent=history?'Recall further events (diplomacy and schisms)':"Recall the region's history";
  wars.replaceChildren(...(history?(warLines(history).map(w=>{const p=node('p',w.line);p.dataset.warId=w.id;return p;})):[]));
  events.replaceChildren(...eventLines(history).map(e=>{const p=node('p',e.line);p.dataset.eventId=e.id;p.dataset.eventKind=e.kind;return p;}));
  if(history&&!history.wars.length)wars.append(node('p','The region has held to its peace so far; no war is recorded.'));
 }
 definePanel({id:'story-insight',title:'Stories & history',role:'records',node:root,home:document.getElementById('main_content'),defaultDock:'center',after:'records',discovered:()=>true,eligible:()=>true});
 render();bindSkillRecordsPanel({render});return {render};
}
registerDomain({id:'storyInsight',projection:()=>({stories:storyLines(ports.root()),history:ports.root().loreHistory?.worldHistories?.[ports.world()]??null,events:eventLines(ports.root().loreHistory?.worldHistories?.[ports.world()])}),
 refresh:()=>panel?.render(),panels:[()=>{panel=createPanel();}],commands:{recall:recallHistory}});
