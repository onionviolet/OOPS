import {REGIONAL_POSTURES,regionPosture,chooseRegionPosture} from './regional_posture.js';
import {lifeRecordView} from './life_record.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {definePanel} from './panel_kit.js';
import {readPort,whenPortsReady} from './ui_ports.js';
import {node,visibleRenderer} from './reference_kit.js';
import {freshJournal,validateJournal,writeJournal,discoveredAtlas,characterCard} from './personal_journal.js';
let journal=freshJournal(),ports,panel;
export const configurePersonalJournal=operations=>{ports=operations;};
function saveText(text){
 if(!ports?.writable?.())throw Error('Use the writable game tab to save your journal.');
 const next=writeJournal(text,journal);persistJournal(next);
}
function persistJournal(next){
 if(!ports?.writable?.())throw Error('Use the writable game tab to save your journal.');
 validateJournal(next);const tx=beginNativeCraftTransaction({bindings:[{get:()=>journal,set:v=>journal=v}]});
 try{journal=next;ports.persist(()=>tx.markDurable());}catch(e){if(tx.status==='pending')tx.rollback();throw e;}panel?.render(true);
}
function savePosture(posture){persistJournal(chooseRegionPosture(journal,{world:ports?.world?.(),place:ports?.location?.(),posture}));}
function view(){const hero=readPort('character'),r=readPort('records'),world=ports?.world?.()||readPort('expansion')?.actors?.player?.worldId||'base.frontier',place=ports?.location?.()||'';return {region:{world,place,name:r?.locations?.[place]?.name||place,posture:regionPosture(journal,world,place)},writable:!!ports?.writable?.(),worldCrossings:ports?.lifeRecord?Object.entries(lifeRecordView(ports.lifeRecord()).crossings).map(([id,count])=>({id,count,name:ports.registry.worlds.get(id)?.label||'Earlier world'})):[],text:journal.text,places:discoveredAtlas(r?.locations),name:hero?.name||'Traveler',world:readPort('expansion')?.actors?.player?.worldId||'base.frontier',stats:hero?.getFullStats?.(),stage:domainRegistry.project('pledges')?.state.trial.stage??0};}
function mount(){
 const root=node('section',null,{id:'personal_journal_panel',class:'expedition_panel reference-panel'}),input=node('textarea',null,{'aria-label':'Your journal',rows:'10',maxlength:'20000'}),notice=node('p','',{role:'status'}),region=node('div'),save=node('button','Save your words',{type:'button'}),atlas=node('ul'),crossings=node('div'),card=node('button','Export character card (SVG)',{type:'button'});
 let storedText=journal.text;input.value=journal.text;input.style.width='100%';input.style.boxSizing='border-box';save.dataset.journalSave='';card.dataset.characterCard='';
 root.append(node('h2','Your journal'),node('p','Your own words. Save keeps this text with the continuing self across connected lives and rewinds. Heir succession follows its separate estate law. Nothing here sends it anywhere.'),input,save,notice,node('h3','How you meet this place'),region,node('h3','Discovered atlas'),atlas,node('h3','Recorded world crossings'),node('p','Arrivals through observed world changes in this life record. Counting begins when this record is observed; earlier unrecorded journeys are not reconstructed.'),crossings,card);
 const render=visibleRenderer(root,view,v=>{if(input.value===storedText&&input.value!==v.text)input.value=v.text;storedText=v.text;region.replaceChildren();if(v.region.place){region.append(node('p',`${v.region.name}: ${REGIONAL_POSTURES[v.region.posture]||'no chosen posture'}. Your choice shapes remembered-day reflections here. The latest 256 regional choices stay in this journal.`));for(const [id,label]of [...Object.entries(REGIONAL_POSTURES),['none','Leave the tone open']]){const b=node('button',label,{type:'button'});b.dataset.regionPosture=id;b.disabled=!v.writable||(id==='none'?!v.region.posture:v.region.posture===id);b.onclick=()=>{try{savePosture(id==='none'?null:id);notice.textContent='Your approach to this place is saved.';}catch(e){notice.textContent=e.message;}};region.append(b);}}atlas.replaceChildren();for(const p of v.places){const li=node('li',p.name+(p.routes.length?' → '+p.routes.map(id=>v.places.find(p=>p.id===id)?.name||id).join(', '):''));atlas.append(li);}crossings.replaceChildren();for(const row of v.worldCrossings)crossings.append(node('p',`${row.name}: ${row.count} recorded arrivals through world crossings.`));});
 save.onclick=()=>{try{saveText(input.value);notice.textContent='Your words are saved.';}catch(e){notice.textContent=e.message;}};
 card.onclick=()=>{try{const v=view();if(!v.stats)throw Error('Your current public stats are not available.');const svg=characterCard({...v,knownPlaces:v.places.length,palette:Object.fromEntries([['background','--ui-navy'],['border','--ui-accent'],['text','--ui-text']].map(([key,token])=>[key,getComputedStyle(document.documentElement).getPropertyValue(token).trim()]))}),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),a=node('a');a.href=url;a.download='oops-character.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);notice.textContent='Character card exported with current public stats.';}catch(e){notice.textContent=e.message;}};
 definePanel({id:'personal-journal',title:'Your journal & atlas',role:'records',node:root,home:document.getElementById('main_content'),discovered:()=>true,eligible:()=>true});whenPortsReady(()=>render(true));return {render};
}
registerDomain({id:'personal_journal',initialState:()=>freshJournal(),save:()=>journal.text||journal.regions?.length?structuredClone(validateJournal(journal)):undefined,validate:s=>{if(s!=null)validateJournal(s);},migrate:s=>s==null?freshJournal():structuredClone(validateJournal(s)),load:s=>{journal=s??freshJournal();},commands:{write:saveText,posture:savePosture},projection:view,refresh:()=>panel?.render(false),panels:[()=>panel=mount()]});
