import {boardLayout} from './layout_spec.js';
import {projectNativeOpponents,knowledgeOf,healthText,healthFill,factText,factShown,encounterCaption,kindHue,KNOWLEDGE_LABEL} from './opponent_board.js';
import {definePanel} from './panel_kit.js';
import {getDisplaySetting} from './display_settings.js';
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
    let selected=null,selectedEnemy=null,sceneSignature='',actionSignature='',focusSignature='',lastPlace='';
    const scene=node('section');scene.id='village_scene';
    const clock=node('p'),people=node('div'),things=node('div'),groups=node('div');
    people.className='scene-chips';things.className='scene-chips';
    clock.className='scene-location-header';const placeName=node('strong'),conditions=node('span'),calendar=node('span'),placeTags=node('span');conditions.className='scene-conditions';calendar.className='scene-calendar';placeTags.className='scene-place-tags';clock.append(placeName,conditions,placeTags,calendar);
    // R21 (Weibao, 2026-10-17): the group drop-downs live under Options, not in the action list.
    // The tab names how many there are and how many hold ready actions (UR13).
    const optionsLabel=()=>{const groups=[...document.querySelectorAll('#location_actions_div > details')].filter(d=>!d.hidden&&d.style.display!=='none'&&!d.classList.contains('none_display'));
        const ready=groups.filter(d=>[...d.querySelectorAll('button')].some(b=>!b.hidden&&!b.disabled)).length;return groups.length?`Options · ${groups.length}${ready?` (${ready} ready)`:''}`:'Options';};
    const placeTabs=node('nav');placeTabs.className='scene-local-tabs';placeTabs.setAttribute('aria-label','Location sections');let placeTab='actions';for(const [id,label]of [['actions','Actions'],['people','People'],['things','Things'],['options','Options']]){const b=node('button',label);b.type='button';b.dataset.placeTab=id;b.onclick=()=>{placeTab=id;render();};placeTabs.append(b);}scene.append(clock,placeTabs,people,things,groups);
    const focus=node('section');focus.id='current_focus';focus.setAttribute('aria-live','polite');
    // R20 opponent board: one row per opponent, laid out by count (layout_spec opponentBoard), and
    // the inspected opponent's facts once below the rows instead of repeated on every card. Reads the
    // public projection shape (opponent_board.js) only. Rows keep their node and native slot order,
    // so nothing moves under a pending click on ticks (UR52, WX4).
    const enemyView=node('div');enemyView.className='combat-focus-view';
    const rosterToolbar=node('div'),rosterCaption=node('span'),enemyCards=node('div'),enemyCardNodes=new Map(),groupLabels=new Map();
    rosterToolbar.className='enemy-roster-toolbar';enemyCards.className='enemy-cards';enemyCards.setAttribute('role','group');enemyCards.setAttribute('aria-label','Opponents');enemyCards.dataset.fitClip='';
    const detail=node('section'),detailFacts=node('dl'),detailEmpty=node('p'),detailNodes=new Map();detail.className='opponent-detail';detailFacts.dataset.effectAnchor='opponent-stats';detailFacts.setAttribute('aria-live','off');detail.append(detailFacts,detailEmpty);
    const rosterMode=node('button','Compare');rosterMode.type='button';rosterMode.className='combat-roster-mode';let compare=false;
    rosterMode.onclick=()=>{compare=!compare;render();};
    rosterToolbar.append(rosterCaption,rosterMode);enemyView.append(rosterToolbar,enemyCards,detail);
    // R22b (SU1–SU3): in the parity shell a fight lists the opponents in their own panel beside the
    // actions, stacked while the slot is tall enough; Around you keeps the inspected opponent's name,
    // health and facts level with You. If that panel is hidden or yields (an item detail), the list
    // returns to Around you as in R20. The nodes move, never rebuild, so handlers and focus survive.
    const opponentsView=node('section');opponentsView.id='opponent_list';opponentsView.className='combat-focus-view combat-opponents-view';
    const targetLine=node('div'),targetName=node('strong'),targetHealth=node('span'),targetCycle=node('progress');targetLine.className='opponent-target';targetHealth.className='opponent-target-health';targetCycle.className='opponent-target-cycle';targetCycle.max=100;
    targetLine.append(targetName,targetHealth,targetCycle);targetLine.hidden=true;enemyView.prepend(targetLine);
    // R22c (FC2, FC14): with the list elsewhere, Around you splits into the Target card (name, health
    // bar, cycle and facts, laid out like You's bars) and Encounter (this wave's counts). R22d adds
    // the damage and hit tally to Encounter.
    const encounterView=node('section'),encounterTitle=node('strong','Encounter'),encounterFacts=node('dl'),encounterNodes=new Map();
    encounterView.className='encounter-summary';encounterView.setAttribute('aria-label','Encounter');encounterView.append(encounterTitle,encounterFacts);encounterView.hidden=true;enemyView.append(encounterView);
    const listShown=()=>document.getElementById('main_content')?.dataset.parity==='r3'&&opponentsView.isConnected&&opponentsView.checkVisibility();

    const setText=(n,text)=>{if(n.textContent!==text)n.textContent=text;};
    const setAttr=(n,key,value)=>{value=String(value);if(n.getAttribute(key)!==value)n.setAttribute(key,value);};
    const setTitle=(n,value)=>{if(n.title!==value)n.title=value;};
    // Fact rows keyed by label inside a <dl>; `you` adds the player's own value where one exists.
    function renderFacts(list,nodes,facts,you){
        for(const[key,row]of nodes)if(!facts.some(f=>f.label===key)){row.remove();nodes.delete(key);}
        for(const fact of facts){let row=nodes.get(fact.label);if(!row){row=node('div');row.append(node('dt'),node('dd'),node('small'));row.tabIndex=0;nodes.set(fact.label,row);list.append(row);}
            const value=factText(fact),own=you?ownValue(fact.label):'';
            setText(row.firstChild,shortLabel[fact.label]||fact.label);setText(row.children[1],value);setText(row.lastChild,own);setAttr(row,'data-knowledge',fact.knowledge||'unknown');
            setTitle(row,`${fact.label}: ${value}. ${factHelp(fact.label)}${own?` ${own}.`:''}`);setAttr(row,'aria-label',`${fact.label}: ${value}`);}
    }
    const shortLabel={'You hit them':'Your hit','Evade you':'Evade','Attack':'Atk','Speed':'Spd'};
    const ownValue=label=>{const id=({'Attack':'attack_power_slot','Defense':'defense_slot','Speed':'attack_speed_slot'})[label];const own=id?document.querySelector(`#character_stats_div #${id}`)?.textContent.trim():'';return own?`You: ${own}${label==='Speed'?' /s':''}`:'';};
    function renderEnemy(target,board){
        const opponents=board.opponents,count=opponents.length,root=document.getElementById('main_content');
        if(enemyView.parentNode!==focus)focus.replaceChildren(enemyView);
        focus.dataset.nativeActor=target.id||'';
        // Repeated names group in first-appearance order; each group keeps native slot order.
        const named=new Map();for(const opp of opponents){if(!named.has(opp.name))named.set(opp.name,[]);named.get(opp.name).push(opp);}
        const inList=listShown(),host=inList?opponentsView:enemyView;
        if(rosterToolbar.parentNode!==host){if(inList)opponentsView.append(rosterToolbar,enemyCards);else enemyView.insertBefore(rosterToolbar,detail),enemyView.insertBefore(enemyCards,detail);}
        targetLine.hidden=!inList;encounterView.hidden=!inList;setAttr(enemyView,'data-list-elsewhere',inList);
        // FC11: letters show per the Opponent letters setting (off by default); names carry the rows.
        const letters=getDisplaySetting('panel.opponents.letters')||'off';if(root.dataset.opponentLetters!==letters)root.dataset.opponentLetters=letters;
        const fontSize=parseFloat(getComputedStyle(host).fontSize)||14,heightEm=inList?Math.max(0,opponentsView.clientHeight-rosterToolbar.offsetHeight)/fontSize:0;
        const layout=boardLayout({count,widthEm:host.clientWidth/fontSize,heightEm,groups:[...named.values()].map(g=>g.length)});
        const hueOf=name=>kindHue(opponents.map(o=>o.name),name);
        setAttr(enemyCards,'data-grouped',layout.grouped);
        setAttr(enemyCards,'data-layout',layout.layout);setAttr(enemyCards,'data-columns',layout.columns);setAttr(enemyCards,'data-count',count);
        if(enemyCards.style.getPropertyValue('--board-visible-rows')!==String(layout.visibleRows))enemyCards.style.setProperty('--board-visible-rows',String(layout.visibleRows));
        const comparing=compare&&count>1;setAttr(enemyCards,'data-compare',comparing);rosterMode.hidden=count<2;setAttr(rosterMode,'aria-pressed',comparing);
        setTitle(rosterMode,comparing?'Showing each opponent’s facts on its row. Select to show only the inspected opponent’s facts below.':'Show each opponent’s facts on its own row, to compare them. Inspection never changes attack targeting.');
        for(const[id,card]of enemyCardNodes)if(!opponents.some(o=>o.id===id)){card.remove();enemyCardNodes.delete(id);}
        for(const[name,label]of groupLabels)if(!layout.grouped||!named.has(name)){label.remove();groupLabels.delete(name);}
        const order=layout.grouped?[...named.entries()].flatMap(([name,group])=>{let label=groupLabels.get(name);if(!label){label=node('p');label.className='enemy-group-label';groupLabels.set(name,label);}
            setText(label,`${name} · ${group.length}`);setAttr(label,'data-kind-hue',hueOf(name));setTitle(label,`${group.length} opponents named ${name}, ${group.map(o=>o.letter).join(', ')}. Each keeps its own health and can be inspected on its own.`);return [label,...group];}):layout.stacked?[...named.values()].flat():opponents;
        for(const[index,opp]of order.entries()){
            if(opp.nodeType){if(enemyCards.children[index]!==opp)enemyCards.insertBefore(opp,enemyCards.children[index]||null);continue;}
            let card=enemyCardNodes.get(opp.id);
            if(!card){card=node('article');card.className='enemy-card';card.dataset.enemyCard=opp.id;
                const name=node('button'),hp=node('p'),cycle=node('progress'),facts=node('dl');
                name.type='button';name.dataset.inspectEnemy=opp.id;name.className='enemy-card-name';name.onclick=()=>{selectedEnemy=opp.id;render();};
                hp.className='enemy-card-health';hp.append(node('span'));cycle.max=100;cycle.className='enemy-card-cycle';facts.className='enemy-card-facts';facts.nodes=new Map();
                card.append(name,hp,cycle,facts);enemyCardNodes.set(opp.id,card);}
            if(enemyCards.children[index]!==card)enemyCards.insertBefore(card,enemyCards.children[index]||null);
            const[name,hp,cycle,facts]=card.children,inspected=opp.id===target.id,known=knowledgeOf(opp),kin=named.get(opp.name)||[opp],nth=kin.indexOf(opp)+1,label=count>1&&kin.length>1?`${opp.name}, ${nth} of ${kin.length}`:opp.name,shown=layout.grouped?opp.letter:opp.name,health=healthText(opp),fill=healthFill(opp);
            setText(name,shown);setAttr(name,'data-letter',layout.grouped?'':count>1?opp.letter:'');setAttr(card,'data-slot',opp.slot);setAttr(name,'aria-pressed',inspected);setAttr(name,'aria-label',`Inspect opponent ${label}${opp.defeated?', defeated':''}`);setTitle(name,`Inspect ${label}. Inspection does not change attack targeting. ${KNOWLEDGE_LABEL[known]}`);
            setText(hp.firstChild,health);setAttr(hp,'data-health-known',fill!=null);setTitle(hp,opp.defeated?`Defeated · ${opp.health?.text||''}`.trim():health);card.style.setProperty('--roster-health',`${fill??0}%`);
            if(inspected){name.dataset.effectAnchor='opponent-name';hp.dataset.effectAnchor='opponent-health';}else{name.removeAttribute('data-effect-anchor');hp.removeAttribute('data-effect-anchor');}
            cycle.hidden=opp.defeated||opp.cycle==null;cycle.value=opp.cycle||0;setAttr(cycle,'aria-label',`${label} attack cycle`);setTitle(cycle,'Attack cycle · native progress');
            setAttr(card,'data-inspected',inspected);setAttr(card,'data-kind-hue',hueOf(opp.name));setAttr(card,'data-defeated',!!opp.defeated);setAttr(card,'data-knowledge',known);
            facts.hidden=!comparing;if(comparing)renderFacts(facts,facts.nodes,opp.facts||[],false);
        }
        // The inspected opponent's facts, once. List form (with your own value) for up to four
        // opponents, a compact grid beyond that (layout_spec opponentBoard).
        detail.hidden=comparing;setAttr(detail,'data-facts',layout.facts);setAttr(detail,'data-knowledge',knowledgeOf(target));setTitle(detail,`${count>1?target.letter+' · ':''}${target.name}. ${KNOWLEDGE_LABEL[knowledgeOf(target)]}`);
        const facts=target.facts||[];renderFacts(detailFacts,detailNodes,facts,layout.facts==='list');
        if(inList){const t=opponents.find(o=>o.id===target.id)||target,fill=healthFill(t);
            const tk=named.get(t.name)||[t];setText(targetName,t.name);setAttr(targetName,'data-letter',count>1?t.letter||'':'');setAttr(targetName,'aria-label',tk.length>1?`${t.name}, ${tk.indexOf(t)+1} of ${tk.length}`:t.name);setAttr(targetName,'data-kind-hue',hueOf(t.name));setAttr(targetLine,'data-defeated',!!t.defeated);
            setText(targetHealth,healthText(t));targetLine.style.setProperty('--roster-health',`${fill??0}%`);setAttr(targetHealth,'data-health-known',fill!=null);
            targetCycle.hidden=!!t.defeated||t.cycle==null;targetCycle.value=t.cycle||0;setAttr(targetCycle,'aria-label',`${t.name} attack cycle`);
            setTitle(targetLine,`Inspecting ${tk.length>1?`${t.name}, ${tk.indexOf(t)+1} of ${tk.length}`:t.name}. Select another opponent in the list to inspect it; inspection does not change attack targeting.`);}
        detailEmpty.hidden=!!facts.length;setText(detailEmpty,'No combat facts observed yet.');
        const caption=encounterCaption(board);setText(rosterCaption,caption);setTitle(rosterCaption,caption);
        if(inList){const down=opponents.filter(o=>o.defeated).length,{groupsLeft,clears}=board.encounter||{};
            const rows=[['Opponents',String(count)],['Defeated',`${down} of ${count}`],...[...named.entries()].map(([n,g])=>[n,`${g.filter(o=>!o.defeated).length} of ${g.length} left`]),groupsLeft?['Groups left',groupsLeft]:null,clears?['Clears',String(clears).replace(/^Clears:\s*/,'')]:null].filter(Boolean);
            for(const[key,row]of encounterNodes)if(!rows.some(r=>r[0]===key)){row.remove();encounterNodes.delete(key);}
            for(const[key,value]of rows){let row=encounterNodes.get(key);if(!row){row=node('div');row.append(node('dt',key),node('dd'));encounterNodes.set(key,row);encounterFacts.append(row);}setText(row.lastChild,value);setAttr(row,'data-kind-hue',named.has(key)?hueOf(key):'');}}
        if(root.style.getPropertyValue('--enemy-cards-height'))root.style.removeProperty('--enemy-cards-height');
        root.dataset.enemyPanels='true';root.dataset.enemyCards='true';
        // A new wave with a different count is a stable moment for the fit engine (WX4).
        const signature=`${layout.layout}:${count}:${layout.columns}:${inList?'list':'focus'}`;if(root.dataset.opponentBoard!==signature)root.dataset.opponentBoard=signature;
    }
    const home=document.getElementById('main_content');
    definePanel({id:'focus',title:'Focus',role:'character',node:focus,home,defaultDock:'center',after:'time',eligible:()=>true});
    const fighting=()=>home.dataset.parity==='r3'&&home.dataset.parityCombat==='true';
    definePanel({id:'opponents',title:'Opponents',role:'character',node:opponentsView,home,defaultDock:'center',after:'local-actions',eligible:fighting,discovered:fighting,
        settings:[{key:'letters',label:'Opponent letters',description:'Show A, B, C beside opponents of the same name. Off by default: hover a report line to find its opponent.',options:[['off','Off'],['hover','On hover'],['always','Always']],default:'off'}]});
    // R22c (FC12): hovering or focusing a combat line marks its opponent's row in the current wave,
    // and a row marks its lines. Older waves' lines link to nothing. Presentation only.
    const linkOff=()=>{for(const n of document.querySelectorAll('[data-linked]'))n.removeAttribute('data-linked');};
    const latest=log=>Math.max(0,...[...log.querySelectorAll('[data-encounter]')].map(n=>Number(n.dataset.encounter)||0));
    const linkFrom=event=>{const log=document.getElementById('message_log_div');if(!log)return;linkOff();
        const line=event.target.closest?.('#message_log_div [data-combat-slot]'),card=event.target.closest?.('#opponent_list .enemy-card[data-slot], #current_focus .enemy-card[data-slot]');
        if(line&&line.dataset.combatSlot!=='many'&&Number(line.dataset.encounter)===latest(log)){const c=enemyCards.querySelector(`.enemy-card[data-slot="${CSS.escape(line.dataset.combatSlot)}"]`);if(c){c.dataset.linked='true';line.dataset.linked='true';}}
        else if(card){const n=latest(log);for(const l of log.querySelectorAll(`[data-combat-slot="${CSS.escape(card.dataset.slot)}"][data-encounter="${n}"]`))l.dataset.linked='true';card.dataset.linked='true';}};
    document.addEventListener('mouseover',linkFrom);document.addEventListener('focusin',linkFrom);
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
        if(!parity)setText(clock,view.clockText);setTitle(clock,view.clockText);placeTabs.hidden=!parity;people.hidden=!frame.people.length||parity&&placeTab!=='people';things.hidden=!frame.things.length||parity&&placeTab!=='things';for(const b of placeTabs.children){const count=b.dataset.placeTab==='people'?frame.people.length:b.dataset.placeTab==='things'?frame.things.length:null;setText(b,['actions','options'].includes(b.dataset.placeTab)?(b.dataset.placeTab==='actions'?'Actions':optionsLabel()):`${b.dataset.placeTab==='people'?'People':'Things'} · ${count}`);if(b.disabled!==(count===0))b.disabled=count===0;b.hidden=count===0||focusOwnsNearby&&count!==null;b.setAttribute('aria-pressed',String(b.dataset.placeTab===placeTab));}
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
        // R20: the board reads the public projection. A frame may carry it (preview fixtures, later
        // the registry projection, GU8); otherwise the existing read() rows are adapted, with the
        // encounter counters the cards already read (NX42). No new truth reads.
        const rows=frame.enemies||(frame.enemy?[frame.enemy]:[]);
        const board=frame.opponents||(rows.length?projectNativeOpponents(rows,{groupsLeft:document.getElementById('enemies_left_div')?.textContent.trim()||'',clears:document.getElementById('clear_count_div')?.textContent.replace(/\s+/g,' ').trim()||''}):{opponents:[]});
        const picked=board.opponents.find(o=>o.id===selectedEnemy)||board.opponents[0]||null,row=picked&&rows.find(r=>r.id===picked.id);
        // Classic keeps its native text (GU5); projection-only frames derive it from the shape.
        const enemy=picked&&{...picked,hp:row?.hp??healthText(picked),stats:row?.stats??(picked.facts||[]).filter(factShown).map(f=>`${f.label}: ${factText(f)}`).join(' · ')};
        const target=villageFocus({...frame,enemy},selected),next=JSON.stringify(target||{place:frame.place,people:frame.people,things:frame.things});
        focus.dataset.focusEmpty=String(!target);
        focus.closest('.workspace-module')?.setAttribute('data-focus-empty',String(!target));
        const heading=focus.closest('.workspace-module')?.querySelector('.workspace-module-header > strong');
        const shell=document.getElementById('main_content').dataset.presentation==='proto23-shell';
        if(shell&&!target){focus.dataset.focusEmpty='false';focus.closest('.workspace-module')?.setAttribute('data-focus-empty','false');}
        const nativeEncounter=target?.kind==='enemy'&&shell;if(nativeEncounter)renderEnemy(target,board);const groupHeading=nativeEncounter,enemyCount=board.opponents.length;
        if(heading){setText(heading,groupHeading?(enemyCount>1&&listShown()?'Inspecting':enemyCount>1?`Opponents · ${enemyCount}`:'Opponent'):shell?(target?.name||'Around you'): 'Focus');setTitle(heading,groupHeading?`${enemyCount} opponent${enemyCount===1?'':'s'}. Select a name to inspect; inspection does not change attack targeting.`:target?.name||'Inspect a known person, place or opponent');heading.removeAttribute('data-effect-anchor');heading.removeAttribute('tabindex');}
        focus.dataset.subjectHeading=String(shell&&!!target);
        if(nativeEncounter){focusSignature=next;return;}
        {const root=document.getElementById('main_content');if(root.dataset.enemyCards==='true')root.dataset.enemyCards='false';if(root.dataset.opponentBoard)delete root.dataset.opponentBoard;}
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
