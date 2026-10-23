// Story recognition (IM23) and world history (IM24) as one records panel. No save slice of its own: the recap is a pure
// scan of saved chronicle facts, and the history is stored by lore_history_state.js under loreHistory.worldHistories
// (inside the expansion slice, validated with it). History is derived at one commit, on the player's first request for it.
import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {recognizeStories} from './story_recognizer.js';
import {deriveWorldHistory} from './lore_history_state.js';
let ports,panel;
export function configureStoryInsight(operations){ports=operations;}
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
const CAUSE_TEXT={'tie:grievance':'an unsettled grievance'};
const causeText=c=>CAUSE_TEXT[c]??(c.startsWith('axis:')?`strained ${c.slice(5)}`:c.startsWith('memory:')?'a remembered clash':c.replace(/^life\.experience\.inheritance\./,'').replace('debtsPaid','debts paid'));
export function storyLines(state){
 return recognizeStories(state).map(s=>({kind:s.kind,with:s.with,
  line:s.kind==='rivalry'?`A rivalry with ${s.with}, ${s.open?'still open':'settled'}, from ${s.causes.map(causeText).join(', ')}.`:`You paid ${s.salience} coin${s.salience===1?'':'s'} toward a debt owed to ${s.with}; it is closed.`}));
}
const RELATION_TEXT={rival:'a standing rivalry',enemy:'open enmity'};
export function warLines(history){
 const name=id=>id.charAt(0).toUpperCase()+id.slice(1);
 return (history?.wars??[]).map(w=>({id:w.id,line:`Year ${w.year}: ${name(w.attacker)} marched on ${name(w.defender)}. Cause: ${RELATION_TEXT[w.cause.relation]??w.cause.relation} between them, and ${name(w.attacker)} was the stronger (${w.cause.attackerPower} against ${w.cause.defenderPower}).`+
  (w.attackerAllies.length?` Alongside ${name(w.attacker)}: ${w.attackerAllies.map(name).join(', ')}.`:'')+(w.defenderAllies.length?` Alongside ${name(w.defender)}: ${w.defenderAllies.map(name).join(', ')}.`:'')}));
}
export function recallHistory(){const plan=ports.plan(0);deriveWorldHistory(plan.state,{worldId:ports.world()});ports.commit(plan);panel?.render();}
function createPanel(){
 const root=node('section');root.id='story_insight_panel';root.className='expedition_panel';root.dataset.surfaceType='expanded-center';
 const title=node('h2','Stories & history'),storiesHead=node('h3','Stories so far'),stories=node('div'),historyHead=node('h3','Regional history'),recall=node('button',"Recall the region's history"),wars=node('div'),notice=node('p');
 recall.type='button';recall.dataset.storyInsight='recall';notice.setAttribute('role','status');stories.dataset.storyList='';wars.dataset.warList='';
 recall.onclick=()=>{try{recallHistory();notice.textContent='';}catch(e){notice.textContent=e.message;}};
 root.append(title,storiesHead,stories,historyHead,recall,wars,notice);
 let signature;
 function render(){
  const state=ports.root(),world=ports.world(),history=state.loreHistory?.worldHistories?.[world];
  const next=JSON.stringify([recognizeStories(state),history??null,world]);if(next===signature)return;signature=next;
  stories.replaceChildren(...(storyLines(state).map(s=>{const p=node('p',s.line);p.dataset.storyKind=s.kind;return p;})));
  if(!stories.childElementCount)stories.append(node('p','No story has taken shape yet. Rivalries and debts appear here once the saved record shows them.'));
  recall.hidden=!!history;
  wars.replaceChildren(...(history?(warLines(history).map(w=>{const p=node('p',w.line);p.dataset.warId=w.id;return p;})):[]));
  if(history&&!history.wars.length)wars.append(node('p','The region has held to its peace so far; no war is recorded.'));
 }
 definePanel({id:'story-insight',title:'Stories & history',role:'records',node:root,home:document.getElementById('main_content'),defaultDock:'center',after:'records',discovered:()=>true,eligible:()=>true});
 render();return {render};
}
registerDomain({id:'storyInsight',projection:()=>({stories:storyLines(ports.root()),history:ports.root().loreHistory?.worldHistories?.[ports.world()]??null}),
 refresh:()=>panel?.render(),panels:[()=>{panel=createPanel();}],commands:{recall:recallHistory}});
