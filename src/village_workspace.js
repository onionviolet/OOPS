import {chooseCombatFocus} from './combat_focus.js';
import {definePanel} from './panel_kit.js';
import {projectVillageScene} from './causal_story_scenes.js';
import {openWorkspaceModule} from './workspace_layout.js';
import {storyRecap} from './lore_history_view.js';
const factHelp=label=>({'Attack':'Damage per connected attack, before your damage reduction.','Defense':'Damage reduction.','Speed':'Attack rate, in attacks per second.','Hit you':'This opponent’s chance to connect against you. Shield block is separate.','Evade you':'This opponent’s chance to evade your attack.','You hit them':'Your native chance to connect against this inspected opponent, before damage reduction or block. Inspection does not select an attack target.','Attack rating':'Native attack points, a rating rather than a percentage.','Evasion rating':'Native evasion points, a rating rather than a percentage.'})[label]||'';
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
    clock.className='scene-location-header';const placeName=node('strong'),conditions=node('span'),calendar=node('span'),placeTags=node('span');conditions.className='scene-conditions';calendar.className='scene-calendar';placeTags.className='scene-place-tags';clock.append(placeName,conditions,placeTags,calendar);
    const placeTabs=node('nav');placeTabs.className='scene-local-tabs';placeTabs.setAttribute('aria-label','Location sections');let placeTab='actions';for(const [id,label]of [['actions','Actions'],['people','People'],['things','Things'],['options','Options']]){const b=node('button',label);b.type='button';b.dataset.placeTab=id;b.onclick=()=>{placeTab=id;render();};placeTabs.append(b);}scene.append(clock,placeTabs,people,things,groups);
    const focus=node('section');focus.id='current_focus';focus.setAttribute('aria-live','polite');
    const enemyView=node('div');enemyView.className='combat-focus-view';
    const enemyChoices=node('div'),enemyName=node('strong'),enemyHealth=node('p'),enemyFacts=node('dl'),enemyCycle=node('progress'),enemyCycleLabel=node('label','Attack cycle '),enemyEmpty=node('p','Combat facts not yet available.');
    enemyChoices.className='combat-focus-choices';enemyChoices.setAttribute('aria-label','Inspect opponent');
    enemyHealth.setAttribute('aria-live','off');enemyFacts.setAttribute('aria-live','off');
    enemyName.dataset.effectAnchor='opponent-name';enemyHealth.dataset.effectAnchor='opponent-health';enemyFacts.dataset.effectAnchor='opponent-stats';
    enemyCycle.max=100;enemyCycle.setAttribute('aria-label','Native attack cycle');enemyCycleLabel.append(enemyCycle);
    const combatDetails=node('details'),combatSummary=node('summary','Combat readout');combatDetails.className='combat-readout';combatDetails.append(combatSummary,enemyFacts,enemyEmpty);enemyView.append(enemyChoices,enemyName,enemyHealth,enemyCycleLabel,combatDetails);const enemyChoiceNodes=new Map();
    const enemyCards=node('div'),enemyCardNodes=new Map(),rosterToolbar=node('div'),rosterCaption=node('span');enemyCards.className='enemy-cards';rosterToolbar.className='enemy-roster-toolbar';rosterToolbar.append(rosterCaption);enemyView.prepend(rosterToolbar,enemyCards);
    const knownFacts=enemy=>(enemy.facts||[]).filter(f=>f.value!=null&&String(f.value).trim()&&!/^(?:\?+|unknown|unavailable)(?:\s|$)/i.test(String(f.value).trim()));
    const factNodes=new Map();let readoutChosen=false;combatSummary.addEventListener('click',()=>{readoutChosen=true;});
    const rosterMode=node('button','Panels');rosterMode.type='button';rosterMode.className='combat-roster-mode';let enemyPanels=false,enemyPanelsChosen=false;
    rosterMode.onclick=()=>{enemyPanelsChosen=true;enemyPanels=!enemyPanels;setText(rosterMode,enemyPanels?'Compact':'Panels');setAttr(rosterMode,'aria-pressed',enemyPanels);render();};rosterMode.title='Show an individual health and attack-cycle panel for each opponent. Inspection never selects an attack target.';
    rosterToolbar.append(rosterMode);

    const setText=(n,text)=>{if(n.textContent!==text)n.textContent=text;};
    const setAttr=(n,key,value)=>{value=String(value);if(n.getAttribute(key)!==value)n.setAttribute(key,value);};
    const setTitle=(n,value)=>{if(n.title!==value)n.title=value;};
    function renderEnemy(target,enemies){
        if(!enemyPanelsChosen){const font=parseFloat(getComputedStyle(focus).fontSize)||14;enemyPanels=focus.clientWidth/font>=(enemies.length>3?40:20);setText(rosterMode,enemyPanels?'Compact':'Panels');setAttr(rosterMode,'aria-pressed',enemyPanels);}
        setTitle(rosterMode,`${enemyPanelsChosen?'Manual':'Automatic'} ${enemyPanels?'individual panels':'compact roster'}. Show ${enemyPanels?'compact roster':'individual health and attack-cycle panels'}. Inspection never changes attack targeting.`);
        if(enemyView.parentNode!==focus)focus.replaceChildren(enemyView);
        focus.dataset.nativeActor=target.id||'';setText(enemyName,target.name);setText(enemyHealth,target.hp);
        enemyHealth.dataset.healthKnown=String(target.healthProgress!=null);enemyHealth.style.setProperty('--focus-health-fill-size',`${target.healthProgress??0}%`);
        enemyName.title='Native compatibility readout. In-world knowledge and appraisal remain world-specific; this view supplies no level, intent or enemy effects.';
        for(const [id,b]of enemyChoiceNodes)if(!enemies.some(e=>e.id===id)){b.remove();enemyChoiceNodes.delete(id);}
        for(const [index,enemy]of enemies.entries()){
            let b=enemyChoiceNodes.get(enemy.id);if(!b){b=node('button');b.type='button';b.dataset.inspectEnemy=enemy.id;b.append(node('span'),node('small'),node('progress'));b.lastChild.max=100;b.onclick=()=>{selectedEnemy=enemy.id;render();};enemyChoiceNodes.set(enemy.id,b);enemyChoices.append(b);}
            setText(b.firstChild,`${index+1} · ${enemy.name}`);setText(b.children[1],enemy.hp);b.lastChild.value=enemy.attackProgress||0;b.lastChild.setAttribute('aria-label',`Opponent ${index+1}: ${enemy.name} attack cycle`);b.style.setProperty('--roster-health',`${enemy.healthProgress??0}%`);setTitle(b,`Inspect opponent ${index+1}: ${enemy.name}. ${enemy.hp}`);setAttr(b,'aria-label',b.title);setAttr(b,'aria-pressed',enemy.id===target.id);
        }
        const fontSize=parseFloat(getComputedStyle(focus).fontSize)||14,widthEm=focus.clientWidth/fontSize,cardColumns=widthEm>=60?3:widthEm>=30?2:1;
        const fitHeight=Math.max(304,Math.ceil(fontSize*Math.max(20,Math.ceil(enemies.length/cardColumns)*5+3))),root=document.getElementById('main_content');if(root.style.getPropertyValue('--enemy-cards-height')!==fitHeight+'px')root.style.setProperty('--enemy-cards-height',fitHeight+'px');
        setAttr(enemyCards,'data-columns',cardColumns);setAttr(enemyCards,'data-count',enemies.length);
        for(const[id,card]of enemyCardNodes)if(!enemies.some(e=>e.id===id)){card.remove();enemyCardNodes.delete(id);}
        for(const[index,enemy]of enemies.entries()){
            let card=enemyCardNodes.get(enemy.id);
            if(!card){card=node('article');card.className='enemy-card';card.dataset.enemyCard=enemy.id;
                const name=node('button'),hp=node('p'),cycle=node('progress'),facts=node('dl'),empty=node('small');
                name.type='button';name.dataset.inspectEnemy=enemy.id;name.onclick=()=>{selectedEnemy=enemy.id;render();};name.className='enemy-card-name';hp.className='enemy-card-health';hp.append(node('span'));cycle.max=100;cycle.className='enemy-card-cycle';empty.textContent='No combat details observed.';
                const identity=node('div');identity.className='enemy-card-identity';identity.append(name,hp,cycle);card.append(identity,facts,empty);card.factNodes=new Map();enemyCardNodes.set(enemy.id,card);enemyCards.append(card);}
            const[name,hp,cycle]=card.firstChild.children,facts=card.children[1],empty=card.children[2];
            setText(name,`${index+1} · ${enemy.name}`);setAttr(name,'aria-pressed',enemy.id===target.id);setAttr(name,'aria-label',`Inspect opponent ${index+1}: ${enemy.name}`);setTitle(name,'Inspect this opponent. Inspection does not change attack targeting.');
            setText(hp.firstChild,enemy.hp);setAttr(hp,'data-health-known',enemy.healthProgress!=null);card.style.setProperty('--roster-health',`${enemy.healthProgress??0}%`);
            cycle.value=enemy.attackProgress||0;setAttr(cycle,'aria-label',`${enemy.name} attack cycle`);setTitle(cycle,'Attack cycle · native progress');
            const rows=knownFacts(enemy);empty.hidden=!!rows.length;
            for(const[key,row]of card.factNodes)if(!rows.some(f=>f.label===key)){row.remove();card.factNodes.delete(key);}
            for(const fact of rows){let row=card.factNodes.get(fact.label);if(!row){row=node('div');row.append(node('dt'),node('dd'));row.tabIndex=0;card.factNodes.set(fact.label,row);facts.append(row);}setText(row.firstChild,({'You hit them':'Your hit','Evade you':'Evade','Attack':'Atk','Speed':'Spd'})[fact.label]||fact.label);setText(row.lastChild,fact.value);setTitle(row,`${fact.label}: ${fact.value}. ${factHelp(fact.label)}`);setAttr(row,'aria-label',`${fact.label}: ${fact.value}`);}
            const cardEm=widthEm/(cardColumns===2&&index===enemies.length-1&&enemies.length%2?1:cardColumns);setAttr(card,'data-presentation',cardEm>=20?'row':'stack');setAttr(facts,'data-columns',2);setAttr(card,'data-inspected',enemy.id===target.id);
        }
        enemyCards.hidden=!enemyPanels;enemyChoices.hidden=enemies.length<2||enemyPanels;rosterMode.hidden=false;
        // R13: native area progress (Proto23's "Area · n" lesson) read from the native counters, never computed here.
        const groupsLeft=document.getElementById('enemies_left_div')?.textContent.trim(),clears=document.getElementById('clear_count_div')?.textContent.replace(/\s+/g,' ').trim();
        setText(rosterCaption,[`${enemies.length} opponent${enemies.length===1?'':'s'} · inspect`,groupsLeft?`${groupsLeft} group${groupsLeft==='1'?'':'s'} left`:'',clears||''].filter(Boolean).join(' · '));
        enemyName.hidden=enemyPanels;enemyHealth.hidden=enemyPanels;enemyCycleLabel.hidden=enemyPanels;combatDetails.hidden=enemyPanels;
        enemyChoices.dataset.presentation='compact';document.getElementById('main_content').dataset.enemyPanels=String(enemyPanels);document.getElementById('main_content').dataset.enemyCards=String(enemyPanels);
        setText(combatSummary,`Combat readout · ${enemies.length} opponent${enemies.length===1?'':'s'}`);
        const facts=(target.facts||[]).filter(fact=>fact.value!=null&&String(fact.value).trim()&&!/^(?:\?+|unknown|unavailable)(?:\s|$)/i.test(String(fact.value).trim()));enemyEmpty.hidden=!!facts.length;
        for(const [key,pair]of factNodes)if(!facts.some(f=>f.label===key)){pair.remove();factNodes.delete(key);}
        for(const fact of facts){let pair=factNodes.get(fact.label);if(!pair){pair=node('div');pair.append(node('dt',fact.label),node('dd'),node('small'));factNodes.set(fact.label,pair);enemyFacts.append(pair);}setText(pair.children[1],fact.value);
            const ownId=({'Attack':'attack_power_slot','Defense':'defense_slot','Speed':'attack_speed_slot'})[fact.label];
            const own=ownId?document.querySelector(`#character_stats_div #${ownId}`)?.textContent.trim():null;
            setText(pair.lastChild,own?`You: ${own}${fact.label==='Speed'?' /s':''}`:'');pair.tabIndex=0;pair.title=factHelp(fact.label);}
        enemyCycle.value=target.attackProgress||0;
        // Fit public facts to the actual pane and selected type size. A deliberate
        // disclosure choice lasts for this session, including live resizes.
        const font=parseFloat(getComputedStyle(focus).fontSize)||14,columns=focus.clientWidth/font>=20?2:1;
        setAttr(enemyFacts,'data-columns',columns);
        if(!readoutChosen){const needed=(enemies.length>1?(enemyPanels?10:8):6)+Math.ceil(facts.length/columns)*(columns===2?3:2);const wanted=(focus.closest('.workspace-module-body')?.clientHeight||focus.clientHeight)/font>=needed;if(combatDetails.open!==wanted)combatDetails.open=wanted;}
        setTitle(combatSummary,`${readoutChosen?'Manual':'Automatic fit'} · inspect known combat facts; inspection does not change attack targeting.`);
    }
    const home=document.getElementById('main_content');
    definePanel({id:'focus',title:'Focus',role:'character',node:focus,home,defaultDock:'center',after:'time',eligible:()=>true});
    definePanel({id:'village-scene',title:'Village scene',role:'actions',node:scene,home,defaultDock:'center',after:'location',
        discovered:()=>true,eligible:()=>read().inVillage||document.getElementById('main_content').dataset.parity==='r3'});
    function choose(id){selected=id;render();}
    const followService=event=>{if(event.target.closest('#fort_supply_panel'))choose('waypost-clerk');};
    document.addEventListener('focusin',followService);
    // R13: Esc leaves a selected subject for the place card, after the center controller
    // has had its chance to go back (it prevents default when it handles Esc).
    const leaveSubject=event=>{if(event.key!=='Escape'||event.defaultPrevented||!selected||document.getElementById('main_content').dataset.centerTask)return;if(event.target.closest?.('input,textarea,select,dialog'))return;choose(null);};
    document.addEventListener('keydown',leaveSubject);
    function chip(row,kind){const b=node('button',row.name);b.type='button';
        b.dataset.sceneFocus=row.id;b.onclick=()=>choose(row.id);return b;}
    // R15: native place types return to the place header. Rebuild only when the facts change,
    // so a focused tag keeps focus through ticks.
    function renderPlaceTags(types){
        const signature=JSON.stringify(types);if(placeTags.dataset.signature===signature)return;placeTags.dataset.signature=signature;
        const focused=placeTags.contains(document.activeElement)?document.activeElement.dataset.placeType:null;
        placeTags.replaceChildren(...types.map(type=>{const b=node('button',type.label);b.type='button';b.className='shell-place-tag';b.dataset.placeType=type.id;b.placeTypeView=type;b.setAttribute('aria-label',`Place type: ${type.label}`);return b;}));
        placeTags.hidden=!types.length;if(focused)placeTags.querySelector(`[data-place-type="${CSS.escape(focused)}"]`)?.focus();
    }
    function render(){
        const frame=read();if(frame.place!==lastPlace){selected=null;lastPlace=frame.place;placeTab='actions';}
        const view=projectVillageScene({overview:{title:frame.place,clockText:frame.clock,people:frame.people,things:frame.things,actions:frame.actions}});
        // This adapter reads the existing public native clock projection. It does
        // not compute weather/season or alter their world rules.
        const parity=document.getElementById('main_content').dataset.parity==='r3';
        if(parity&&!clock.contains(placeName))clock.replaceChildren(placeName,conditions,placeTags,calendar);
        renderPlaceTags(frame.placeTypes||[]);
        const parts=view.clockText.split(' · '),date=parts[1]||'',season=date.split(',')[1]?.trim();
        setText(placeName,frame.place);
        const conditionRows=[['season',season],['weather',parts[3]],['temperature',parts[4]]].filter(([,value])=>value);
        const nativeTemperatureState=document.querySelector('#weather_div .cold_temperature')?'cold_temperature':'normal_temperature';const conditionSignature=JSON.stringify([conditionRows,nativeTemperatureState]);if(conditions.dataset.signature!==conditionSignature){conditions.dataset.signature=conditionSignature;conditions.replaceChildren();for(const[kind,value]of conditionRows){const symbol=kind==='season'?({'Spring':'❀','Summer':'☀','Autumn':'❧','Fall':'❧','Winter':'❄'}[value]||'◈'):kind==='weather'?({'Rain':'☂','Snow':'❄'}[value]||''):'♨';const badge=node('span');badge.dataset.condition=kind;badge.dataset.conditionValue=value.toLowerCase();const icon=node('span',symbol);icon.setAttribute('aria-hidden','true');if(symbol)badge.append(icon);badge.append(document.createTextNode((symbol?' ':'')+value+(kind==='temperature'&&nativeTemperatureState==='cold_temperature'?' · Cold':'')));if(kind==='temperature')badge.dataset.temperatureState=nativeTemperatureState;badge.title=kind==='temperature'?(document.getElementById('temperature_tooltip')?.textContent||value):kind==='weather'?value+' · native weather; no additional effect inferred.':value+' · native calendar season';conditions.append(badge);}}

        setText(calendar,[season?date.replace(', '+season,''):date,parts[2]?((/night/i.test(parts[2])?'☾ ':'☼ ')+parts[2]):''].filter(Boolean).join(' · '));calendar.dataset.timeOfDay=/night/i.test(parts[2])?'night':'day';
        // R13 dedupe: with the shell, Focus's place card is the home for who and what is here, so the
        // lower People/Things tabs would repeat it. Actions and Options stay.
        const focusOwnsNearby=parity&&document.getElementById('main_content').dataset.presentation==='proto23-shell';if(focusOwnsNearby&&['people','things'].includes(placeTab))placeTab='actions';
        if(!parity)setText(clock,view.clockText);setTitle(clock,view.clockText);placeTabs.hidden=!parity;people.hidden=!frame.people.length||parity&&placeTab!=='people';things.hidden=!frame.things.length||parity&&placeTab!=='things';for(const b of placeTabs.children){const count=b.dataset.placeTab==='people'?frame.people.length:b.dataset.placeTab==='things'?frame.things.length:null;setText(b,['actions','options'].includes(b.dataset.placeTab)?(b.dataset.placeTab==='actions'?'Actions':'Options'):`${b.dataset.placeTab==='people'?'People':'Things'} · ${count}`);if(b.disabled!==(count===0))b.disabled=count===0;b.hidden=count===0||focusOwnsNearby&&count!==null;b.setAttribute('aria-pressed',String(b.dataset.placeTab===placeTab));}
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
        const target=villageFocus({...frame,enemy},selected),next=JSON.stringify(target||{place:frame.place,people:frame.people,things:frame.things});
        focus.dataset.focusEmpty=String(!target);
        focus.closest('.workspace-module')?.setAttribute('data-focus-empty',String(!target));
        const heading=focus.closest('.workspace-module')?.querySelector('.workspace-module-header > strong');
        const shell=document.getElementById('main_content').dataset.presentation==='proto23-shell';
        if(shell&&!target){focus.dataset.focusEmpty='false';focus.closest('.workspace-module')?.setAttribute('data-focus-empty','false');}
        const nativeEncounter=target?.kind==='enemy'&&shell;if(nativeEncounter)renderEnemy(target,enemies);const groupHeading=nativeEncounter&&enemyPanels;
        if(heading){setText(heading,groupHeading?`Opponents · ${enemies.length}`:shell?(target?.name||'Around you'): 'Focus');setTitle(heading,groupHeading?`${enemies.length} opponents. Select a name to inspect; inspection does not change attack targeting.`:target?.name||'Inspect a known person, place or opponent');if(nativeEncounter&&!groupHeading){heading.dataset.effectAnchor='opponent-name';heading.tabIndex=0;enemyName.removeAttribute('data-effect-anchor');}else{heading.removeAttribute('data-effect-anchor');heading.removeAttribute('tabindex');enemyName.dataset.effectAnchor='opponent-name';}}
        focus.dataset.subjectHeading=String(shell&&!!target);
        if(nativeEncounter){focusSignature=next;return;}
        if(document.getElementById('main_content').dataset.enemyCards==='true')document.getElementById('main_content').dataset.enemyCards='false';
        // R13: the key includes the presentation and place text, so the idle place card
        // appears once the shell is active, not only after the subject changes.
        const focusKey=JSON.stringify([next,shell,!target&&shell?document.getElementById('location_description_div')?.textContent.trim()||'':'']);
        if(focusKey!==focusSignature||enemyView.parentNode===focus){focusSignature=focusKey;focus.replaceChildren();
            if(!target&&shell){const overview=node('div');overview.className='shell-place-overview';const description=document.getElementById('location_description_div')?.textContent.trim();
                const nearby=node('div');nearby.className='shell-nearby';for(const person of frame.people){const b=node('button');b.type='button';b.append(node('strong',person.name),node('small',person.role||'Known person'));b.onclick=()=>choose(person.id);b.title=`Inspect ${person.name}. Does not start a conversation.`;b.dataset.inspectNearby=person.id;nearby.append(b);}
                for(const thing of frame.things){const b=node('button');b.type='button';b.append(node('strong',thing.name),node('small',thing.description||'Here'));b.onclick=()=>choose(thing.id);b.title=`Inspect ${thing.name}. Does not use it.`;b.dataset.inspectNearby=thing.id;b.dataset.nearbyKind='thing';nearby.append(b);}
                // R13: who and what is here comes first; the longer place text follows and may scroll.
                if(frame.people.length||frame.things.length)overview.append(nearby);else overview.append(node('small','Select an item or known subject to inspect.'));if(description)overview.append(node('p',description));focus.append(overview);}

            if(target&&shell&&selected&&!frame.dialogue&&target.kind!=='enemy'){const back=node('button',`← ${frame.place}`);back.type='button';back.className='shell-focus-back';back.dataset.focusBack='';back.title='Back to the place overview. Esc also works.';back.onclick=()=>choose(null);focus.append(back);}
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
    return {render,destroy:()=>{clearInterval(timer);document.removeEventListener('focusin',followService);document.removeEventListener('keydown',leaveSubject);}};
}
