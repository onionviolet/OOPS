import {chooseCombatFocus} from './combat_focus.js';
import {definePanel} from './panel_kit.js';
import {projectVillageScene} from './causal_story_scenes.js';
import {openWorkspaceModule} from './workspace_layout.js';
import {storyRecap} from './lore_history_view.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};

// Input people are already observer-filtered. Selection is ephemeral presentation.
export function villageFocus(frame,selected) {
    if(frame.enemy)return {kind:'enemy',...frame.enemy};
    const id=frame.dialogue||selected;
    const person=[...frame.people,...(frame.services||[])].find(p=>p.id===id);
    if(person)return {kind:'person',name:person.name,role:person.role,traits:person.met?person.traits:[],
        relationship:person.met?person.relationship:null,
        memory:person.met?storyRecap(frame.history,person.id)?.line:null};
    const thing=frame.things.find(t=>t.id===selected);
    return thing?{kind:'thing',name:thing.name,role:thing.description}:null;
}
export function createVillageWorkspace({read,act}) {
    let selected=null,selectedEnemy=null,enemyRoster='',sceneSignature='',actionSignature='',focusSignature='',lastPlace='';
    const scene=node('section');scene.id='village_scene';
    const clock=node('p'),people=node('div'),things=node('div'),groups=node('div');
    people.className='scene-chips';things.className='scene-chips';
    clock.className='scene-location-header';const placeName=node('strong'),conditions=node('span'),calendar=node('span');conditions.className='scene-conditions';calendar.className='scene-calendar';clock.append(placeName,conditions,calendar);
    const placeTabs=node('nav');placeTabs.className='scene-local-tabs';placeTabs.setAttribute('aria-label','Location sections');let placeTab='actions';for(const [id,label]of [['actions','Actions'],['people','People'],['things','Things'],['options','Options']]){const b=node('button',label);b.type='button';b.dataset.placeTab=id;b.onclick=()=>{placeTab=id;render();};placeTabs.append(b);}scene.append(clock,placeTabs,people,things,groups);
    const focus=node('section');focus.id='current_focus';focus.setAttribute('aria-live','polite');
    const enemyView=node('div');enemyView.className='combat-focus-view';
    const enemyChoices=node('div'),enemyName=node('strong'),enemyHealth=node('p'),enemyFacts=node('dl'),enemyCycle=node('progress'),enemyCycleLabel=node('label','Attack cycle '),enemyEmpty=node('p','Combat facts not yet available.');
    enemyChoices.className='combat-focus-choices';enemyChoices.setAttribute('aria-label','Inspect opponent');
    enemyHealth.setAttribute('aria-live','off');enemyFacts.setAttribute('aria-live','off');
    enemyName.dataset.effectAnchor='opponent-name';enemyHealth.dataset.effectAnchor='opponent-health';enemyFacts.dataset.effectAnchor='opponent-stats';
    enemyCycle.max=100;enemyCycle.setAttribute('aria-label','Native attack cycle');enemyCycleLabel.append(enemyCycle);
    const combatDetails=node('details'),combatSummary=node('summary','Combat readout');combatDetails.className='combat-readout';combatDetails.append(combatSummary,node('small','Attack, defense and chances for this encounter.'),enemyFacts,enemyEmpty);enemyView.append(enemyChoices,enemyName,enemyHealth,enemyCycleLabel,combatDetails);const enemyChoiceNodes=new Map();
    const factNodes=new Map();
    const setText=(n,text)=>{if(n.textContent!==text)n.textContent=text;};
    function renderEnemy(target,enemies){
        if(enemyView.parentNode!==focus)focus.replaceChildren(enemyView);
        focus.dataset.nativeActor=target.id||'';setText(enemyName,target.name);setText(enemyHealth,target.hp);
        enemyHealth.dataset.healthKnown=String(target.healthProgress!=null);enemyHealth.style.setProperty('--focus-health-fill-size',`${target.healthProgress??0}%`);
        enemyName.title='Facts from the native combat view. No native level or intent is supplied.';
        for(const [id,b]of enemyChoiceNodes)if(!enemies.some(e=>e.id===id)){b.remove();enemyChoiceNodes.delete(id);}
        for(const [index,enemy]of enemies.entries()){
            let b=enemyChoiceNodes.get(enemy.id);if(!b){b=node('button');b.type='button';b.dataset.inspectEnemy=enemy.id;b.append(node('span'),node('small'));b.onclick=()=>{selectedEnemy=enemy.id;render();};enemyChoiceNodes.set(enemy.id,b);enemyChoices.append(b);}
            setText(b.firstChild,`${index+1} · ${enemy.name}`);setText(b.lastChild,enemy.hp);b.title=`Inspect opponent ${index+1}: ${enemy.name}. ${enemy.hp}`;b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed',String(enemy.id===target.id));
        }
        enemyChoices.hidden=enemies.length<2;
        combatSummary.textContent=`Combat readout · ${enemies.length} opponent${enemies.length===1?'':'s'}`;
        const facts=target.facts||[];enemyEmpty.hidden=!!facts.length;
        for(const [key,pair]of factNodes)if(!facts.some(f=>f.label===key)){pair.remove();factNodes.delete(key);}
        for(const fact of facts){let pair=factNodes.get(fact.label);if(!pair){pair=node('div');pair.append(node('dt',fact.label),node('dd'));factNodes.set(fact.label,pair);enemyFacts.append(pair);}setText(pair.lastChild,fact.value);pair.tabIndex=0;pair.title=({'Attack':'Damage per connected attack, before your damage reduction.','Defense':'Damage reduction.','Speed':'Attack rate, in attacks per second.','Hit you':'This opponent’s chance to connect against you. Shield block is separate.','Evade you':'This opponent’s chance to evade your attack.','You hit them':'Your native chance to connect against this selected opponent, before damage reduction or block.','Attack rating':'Native attack points, a rating rather than a percentage.','Evasion rating':'Native evasion points, a rating rather than a percentage.'})[fact.label]||'';}
        enemyCycle.value=target.attackProgress||0;
    }
    const home=document.getElementById('main_content');
    definePanel({id:'focus',title:'Focus',role:'character',node:focus,home,defaultDock:'center',after:'time',eligible:()=>true});
    definePanel({id:'village-scene',title:'Village scene',role:'actions',node:scene,home,defaultDock:'center',after:'location',
        discovered:()=>true,eligible:()=>read().inVillage||document.getElementById('main_content').dataset.parity==='r3'});
    function choose(id){selected=id;render();}
    const followService=event=>{if(event.target.closest('#fort_supply_panel'))choose('waypost-clerk');};
    document.addEventListener('focusin',followService);
    function chip(row,kind){const b=node('button',row.name);b.type='button';
        b.dataset.sceneFocus=row.id;b.onclick=()=>choose(row.id);return b;}
    function render(){
        const frame=read();if(frame.place!==lastPlace){selected=null;lastPlace=frame.place;placeTab='actions';}
        const view=projectVillageScene({overview:{title:frame.place,clockText:frame.clock,people:frame.people,things:frame.things,actions:frame.actions}});
        // This adapter reads the existing public native clock projection. It does
        // not compute weather/season or alter their world rules.
        const parity=document.getElementById('main_content').dataset.parity==='r3';
        if(parity&&!clock.contains(placeName))clock.replaceChildren(placeName,conditions,calendar);
        const parts=view.clockText.split(' · '),date=parts[1]||'',season=date.split(',')[1]?.trim();
        placeName.textContent=frame.place;
        conditions.textContent=[season,parts[3],parts[4]].filter(Boolean).join(' · ');
        calendar.textContent=[season?date.replace(', '+season,''):date,parts[2]].filter(Boolean).join(' · ');
        if(!parity)clock.textContent=view.clockText;clock.title=view.clockText;placeTabs.hidden=!parity;people.hidden=!frame.people.length||parity&&placeTab!=='people';things.hidden=!frame.things.length||parity&&placeTab!=='things';for(const b of placeTabs.children){const count=b.dataset.placeTab==='people'?frame.people.length:b.dataset.placeTab==='things'?frame.things.length:null;b.textContent=['actions','options'].includes(b.dataset.placeTab)?(b.dataset.placeTab==='actions'?'Actions':'Options'):`${b.dataset.placeTab==='people'?'People':'Things'} · ${count}`;b.disabled=count===0;b.hidden=count===0;b.setAttribute('aria-pressed',String(b.dataset.placeTab===placeTab));}
        document.getElementById('main_content').dataset.placeTab=parity?placeTab:'actions';groups.hidden=parity;
        scene.dataset.inVillage=String(frame.inVillage);
        const signature=JSON.stringify([frame.inVillage,frame.people,frame.things,frame.actions]);
        if(sceneSignature!==signature){sceneSignature=signature;
            people.replaceChildren(node('span','People here: '),...frame.people.map(p=>chip(p,'person')));
            things.replaceChildren(node('span','Things here: '),...frame.things.map(t=>chip(t,'thing')));
        }
        const active=view.groups.find(group=>group.id===selected);
        const actionKey=JSON.stringify(active||null);
        if(actionSignature!==actionKey){actionSignature=actionKey;groups.replaceChildren();
            if(active){const row=node('div');row.className='scene-target-row';row.append(node('strong','Actions:'));
                for(const action of active.actions){const b=node('button',action.label);b.type='button';b.dataset.sceneAction=action.id;b.disabled=!!action.disabled;b.title=action.reason||'';
                    b.onclick=()=>{act(action.id);render();};row.append(b);}
                groups.append(row);
            }
        }
        for(const b of scene.querySelectorAll('[data-scene-focus]'))b.setAttribute('aria-pressed',String(b.dataset.sceneFocus===selected));
        const enemies=frame.enemies|| (frame.enemy?[frame.enemy]:[]),enemy=chooseCombatFocus(enemies,selectedEnemy);
        const target=villageFocus({...frame,enemy},selected),next=JSON.stringify(target);
        focus.dataset.focusEmpty=String(!target);
        focus.closest('.workspace-module')?.setAttribute('data-focus-empty',String(!target));
        const heading=focus.closest('.workspace-module')?.querySelector('.workspace-module-header > strong');
        const shell=document.getElementById('main_content').dataset.presentation==='proto23-shell';
        if(heading){heading.textContent=shell?(target?.name||''): 'Focus';heading.title=target?.name||'Inspect a known person, place or opponent';if(shell&&target?.kind==='enemy'){heading.dataset.effectAnchor='opponent-name';heading.tabIndex=0;enemyName.removeAttribute('data-effect-anchor');}else{heading.removeAttribute('data-effect-anchor');heading.removeAttribute('tabindex');enemyName.dataset.effectAnchor='opponent-name';}}
        focus.dataset.subjectHeading=String(shell&&!!target);
        if(target?.kind==='enemy'&&shell){renderEnemy(target,enemies);focusSignature=next;return;}
        if(next!==focusSignature||enemyView.parentNode===focus){focusSignature=next;focus.replaceChildren();
            if(target){focus.append(node('strong',target.name),node('p',target.role||'Role not assessed'));
                if(target.kind==='enemy')focus.append(node('p',`Level/title: ${target.title||'???'} · ${target.hp||'??? hp'}`),node('p',target.stats||'Stats: ???'));
                if(target.kind==='person')focus.append(node('p',`Known traits: ${target.traits?.join(', ')||'Not assessed'}`),node('p',`Relationship: ${target.relationship||'No remembered dealings.'}`),node('p',target.memory||''));
                if(target.kind==='person'&&target.memory)focus.lastElementChild.title=target.memory;
                if(active){const menu=node('div');menu.className='shell-focus-actions';
                    for(const choice of active.actions){const b=node('button',choice.label);b.type='button';b.disabled=!!choice.disabled;b.title=choice.reason||'';b.dataset.focusAction=choice.id;b.onclick=()=>{act(choice.id);render();};menu.append(b);}focus.append(menu);}

            }
        }
    }
    render();const timer=setInterval(render,250);
    return {render,destroy:()=>{clearInterval(timer);document.removeEventListener('focusin',followService);}};
}
