import {registerDomain,domainRegistry} from './domain_registry.js';
import {intentView,stageIntent,validateIntents} from './cultivation_intents.js';
import {definePanel} from './panel_kit.js';
let ports,panel;
const context=()=>({clock:ports.root().clock,world:ports.world(),alive:ports.actor().is_alive===true,ready:ports.writable()&&ports.idle()&&!ports.blocked(),ordeal:!!domainRegistry.project('pledges')?.state.ordeal});
const view=()=>ports?intentView(ports.root()):{choices:[],selected:null};
const act=id=>{const c=context(),v=view(),row=v.choices.find(r=>r.id===id);if(!row)throw Error('This insight has no known earned basis.');const p=stageIntent(ports.plan(row.learned?5:15),id,c);ports.commit(p);ports.logMessage('Your reflection records '+row.name+'. Its known effects follow the current Frontier execution rules.','notification');panel?.render();};
export function configureIntents(operations){ports=operations;}
registerDomain({id:'cultivation_intents',initialState:()=>null,validate:(_,save)=>validateIntents(save.expansion),projection:view,commands:{select:act},refresh:()=>panel?.render(),panels:[()=>{
 const root=document.createElement('section');root.className='expedition_panel reference-panel';root.id='cultivation_intents_panel';let notice='';
 const render=()=>{const v=view();root.replaceChildren();const title=document.createElement('h2');title.textContent='Cultivation insights';root.append(title);for(const row of v.choices){const p=document.createElement('p');p.textContent=row.name+': '+row.effect+' '+(row.id===v.selected?'Selected.':row.learned?'Remembered.':'Your completed work supports this reflection.');const b=document.createElement('button');b.type='button';b.dataset.cultivationIntent=row.id;b.textContent=(row.learned?'Select known habit · 5 min':'Reflect on earned habit · 15 min');b.disabled=row.id===v.selected||!context().ready||context().ordeal;b.onclick=()=>{try{act(row.id);notice='The chosen execution habit is recorded.';}catch(e){notice=e.message;}render();};root.append(p,b);}const status=document.createElement('p');status.setAttribute('role','status');status.textContent=notice;root.append(status);};
 definePanel({id:'cultivation-insights',title:'Cultivation insights',role:'actions',node:root,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>view().choices.length>0,eligible:()=>ports?.world()==='base.frontier'});panel={render};render();return panel;
}]});
