import {definePanel} from './panel_kit.js';
import {openMixtureCounter} from './mixture_ui.js';
import {knownWorkspaceModules,expandWorkspaceModule} from './workspace_layout.js';
import {listable,movedNotices} from './panel_folds.js';
import {PANEL_GROUPS} from './panel_directory.js';
// A disabled row keeps the module's own reason, cut to a short clause so the list stays one line each.
const shortReason=reason=>{const text=String(reason||'').replace(/\.$/,'');return !text||/^(Return to the relevant place|This panel has no content here|Unavailable)/.test(text)?'not here':text.length>44?text.slice(0,41).trimEnd()+'…':text;};
import {centerModes} from './center_modes.js';
import {decorateInventoryList,summarizeGroups} from './ui_components.js';
import {mountGameBar} from './game_bar.js';
import {routeTable} from './layout_spec.js';
import {changeSignal,subscribeChange,publishChange} from './ui_change_signal.js';
import {registerChangeProbes} from './ui_change_probes.js';
import {shortcutGroups} from './shortcut_registry.js';
import {mountUiExtras} from './ui_extras.js';
import {configureUiPorts} from './ui_ports.js';
import {pollBadges,badgeCount,markSeen,paintBadge} from './change_badges.js';
import {controlForRoute} from './seat_profiles.js';
import {observerView} from './observer_view.js';
import {readPort} from './ui_ports.js';

// UIL1 (UIM2): the routes come from the layout spec's route table; this module owns how each opens.
const routes=routeTable();
// Routes that are center views rather than workspace panels show whether or not a panel is known.
const views=new Set(routes.filter(r=>r.open&&r.open!=='in-place').map(r=>r.target));
export function mountWorkspaceNavigation({notice,ports}={}) {
    configureUiPorts(ports);
    const nav=document.createElement('nav');nav.id='workspace_navigation';nav.setAttribute('aria-label','Game panels');
    const buttons=new Map(),arrivals=new Set();
    function go(route) {
        const {target:id,tab}=route;
        arrivals.delete(id);markSeen(route.id);
        for(const[known,b]of buttons)if(known.target===id)delete b.dataset.newHome;
        if(route.open==='here'){centerModes().showHere();return;}
        if(route.open==='crafting'){window.openCraftingWindow();return;}
        if(route.open==='mixing'){openMixtureCounter();return;}
        // R13: Inventory already has a visible home in the parity layout. Go there instead of
        // pulling the list into the center and leaving its own panel blank; Expand still opens it large.
        if(route.open==='in-place'&&document.getElementById('main_content')?.dataset.parity==='r3'){
            const inventoryList=document.querySelector('#inventory_content_div');
            if(inventoryList?.checkVisibility()&&!inventoryList.closest('#center_mode_content')){
                const region=inventoryList.closest('.parity-region');// R21: the search may live in the Inventory control box; then the box takes focus.
                (region?.querySelector('.ui-list-tools input, [data-control-box="inventory"] > .control-box-button')||inventoryList).focus({preventScroll:true});region?.scrollIntoView({block:'nearest'});return;}
        }
        if(expandWorkspaceModule(id,{title:tab?'Journal':route.label})){if(tab)document.getElementById(tab)?.click();else if(route.select)document.getElementById(route.select)?.click();}
    }
    for(const route of routes){const {label,key,target:id}=route,b=document.createElement('button');b.type='button';b.textContent=label;
        b.dataset.panelPath=id;if(route.tab)b.dataset.panelTab=route.tab;b.dataset.routeId=route.id;b.title=`${label} · Alt+${key.toUpperCase()}`;b.setAttribute('aria-keyshortcuts',`Alt+${key}`);b.onclick=()=>{delete b.dataset.newHome;go(route);};nav.append(b);buttons.set(route,b);}
    const more=document.createElement('select');more.setAttribute('aria-label','Other known panels');
    more.onchange=()=>{if(more.value){arrivals.delete(more.value);expandWorkspaceModule(more.value);}more.value='';};nav.append(more);
    const help=document.createElement('button');help.type='button';help.textContent='?';help.title='Keyboard shortcuts · ?';nav.append(help);const extras=mountUiExtras({nav,openPanel:expandWorkspaceModule});
    const sheet=document.createElement('dialog');sheet.id='workspace_shortcuts';const title=document.createElement('h2');title.textContent='Panel shortcuts';
    const list=document.createElement('div'),close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=()=>sheet.close();sheet.append(title,list,close);nav.append(sheet);
    const showHelp=()=>{list.replaceChildren();for(const [route,b]of buttons)if(!b.hidden){const p=document.createElement('p');p.textContent=b.title;list.append(p);}const p=document.createElement('p');p.textContent='Esc: return to the named previous view. F6 / Shift+F6: cycle visible panels.';list.append(p);for(const {scope,items}of shortcutGroups()){const h=document.createElement('h3');h.textContent=scope;list.append(h);for(const item of items){const line=document.createElement('p');line.textContent=`${item.label} · ${item.keys}`;list.append(line);}}sheet.showModal();};help.onclick=showHelp;
    const paneNav=document.createElement('nav');paneNav.id='workspace_pane_navigation';paneNav.setAttribute('aria-label','Center views');
    const paneButtons=new Map();for(const route of routes.filter(r=>r.pane).sort((x,y)=>x.pane-y.pane)){const b=document.createElement('button');b.type='button';b.textContent=route.label;b.dataset.panelPath=route.target;b.onclick=()=>go(route);paneNav.append(b);paneButtons.set(route,b);}
    const paneHelp=document.createElement('button');paneHelp.type='button';paneHelp.textContent='?';paneHelp.title='Keyboard shortcuts';paneHelp.onclick=showHelp;paneNav.append(paneHelp);
    const root=document.getElementById('main_content');definePanel({id:'pane-navigation',title:'Center views',role:'actions',node:paneNav,home:root,defaultDock:'center',after:'local-actions',eligible:()=>root.dataset.parity==='r3',discovered:()=>root.dataset.parity==='r3'});
    document.getElementById('main_content').before(nav);
    // R21 (MB2): in the parity shell the navigation joins the one bar with save and menu.
    const gameBar=mountGameBar({nav});gameBar?.bar?.querySelector('.game-bar-save-state')?.before(extras.findButton);
    const resize=new ResizeObserver(()=>document.documentElement.style.setProperty('--workspace-nav-height',nav.offsetHeight+'px'));resize.observe(nav);
    let last='',notified=false,lastRefresh=0,held=false;
    // UIX4 / UR52: a route appearing or leaving moves the buttons after it and refolds the bar, so
    // that waits while the pointer or focus is on the bar or its More list. Counts, dots, titles and
    // disabled state still update at once; none of them moves a button.
    const interacting=()=>[nav.closest('#game_bar')||nav,document.getElementById('control_box_game-bar-more')].some(n=>n&&(n.matches(':hover')||!!n.querySelector(':focus-visible')));
    const lists=[decorateInventoryList(),
        decorateInventoryList({id:'skill_list',label:'skill',rowSelector:'.skill_div',nameSelector:'.skill_bar_name',emptyText:'Practice an activity to discover its skills.'}),
        decorateInventoryList({id:'bestiary_list',label:'bestiary entry',rowSelector:':scope > *',nameSelector:'.bestiary_entry_name',emptyText:'Meet enemies to record what you learn.'}),
        decorateInventoryList({id:'books_list',label:'read book',rowSelector:':scope > *',nameSelector:'.book_name',emptyText:'Finish reading a book to record it here.'})];
    const refresh=()=>{
        lastRefresh=performance.now();const hold=interacting();held=false;
        for(const list of lists)list.refresh();summarizeGroups(document.getElementById('location_actions_div'));summarizeGroups(document.getElementById('projects_drawer'));
        if(!notified&&document.getElementById('main_content').dataset.workspaceComposition==='proto23'){notified=true;if(document.getElementById('main_content').dataset.parity!=='r3')notice?.('Workspace now groups You above Inventory. Character details and known records remain in the named navigation.','preparation');const stats=[...buttons].find(([route])=>route.target==='preparation')?.[1];if(stats)stats.dataset.newHome='true';}
        const known=knownWorkspaceModules(),ids=new Set(known.map(m=>m.id));
        const observer=observerView(readPort('expansion'));
        for(const [route,b]of buttons){const {target:id,tab}=route;
            let hidden=!views.has(id)&&!ids.has(id);
            if(tab){const control=document.getElementById(tab);hidden=!control||control.hidden||control.dataset.referenceKnown==='false';
                // A Journal tab whose panel is not eligible yet opened an empty 0x0 view; it appears once the panel is reachable.
                if(!ids.has(id)||known.some(m=>m.id===id&&!m.eligible))hidden=true;}
            const controlId=controlForRoute(route.id);
            if(controlId&&!observer.sees({control:controlId}))hidden=true;
            if(b.hidden!==hidden){if(hold)held=true;else b.hidden=hidden;}
            // Compute disabled and title once, then write only a change: writing the module's value and
            // then the crafting or mixing override flip-flopped them every refresh (2026-10-29 freeze).
            const module=known.find(m=>m.id===id);let disabled=!!module&&!module.eligible,title=`${route.label} · Alt+${route.key.toUpperCase()}${disabled?' · '+module.reason:''}`;
            if(arrivals.has(id))b.dataset.newHome='true';
            if(route.open==='crafting'){disabled=!document.querySelector('.choice_craft');title=disabled?'Crafting · Alt+C · no available station or finish this conversation.':`Crafting · Alt+C`;}
            if(route.open==='mixing'){const launch=document.getElementById('village_mixing_open');disabled=!launch||launch.hidden;title=disabled?'Mixing · Alt+M · return to Village and finish your conversation.':'Mixing · Alt+M';}
            if(b.disabled!==disabled)b.disabled=disabled;if(b.title!==title)b.title=title;
            b.setAttribute('aria-current',centerModes().mode===`workspace:${id}`?'page':'false');
        }
        pollBadges();for(const [route,b]of buttons)paintBadge(b,badgeCount(route.id),route.label);
        for(const [route,b]of paneButtons){const original=buttons.get(route);b.hidden=original.hidden||!observer.sees({control:'menu.pane-selector'});b.disabled=original.disabled;b.title=original.title;const mode=centerModes().mode;b.setAttribute('aria-current',route.open==='here'&&mode==='local'||route.open==='crafting'&&mode==='crafting'?'page':original.getAttribute('aria-current'));if(arrivals.has(route.target))b.dataset.newHome='true';else delete b.dataset.newHome;}
        const next=JSON.stringify([known,[...arrivals],known.map(m=>badgeCount(m.id))]);if(next!==last){last=next;more.replaceChildren();const first=document.createElement('option');first.value='';first.textContent=arrivals.size?'All panels… •':'All panels…';more.append(first);
            // COV6: five groups in player words; a greyed row says why (UIV1) instead of sitting there silent.
            const groups=new Map(PANEL_GROUPS.map(g=>[g,document.createElement('optgroup')]));groups.forEach((g,name)=>{g.label=name;});
            for(const m of known){if(['pane-navigation','shell-log-tools'].includes(m.id)||(controlForRoute(m.id)&&!observer.sees({control:controlForRoute(m.id)})))continue;const option=document.createElement('option');option.value=m.id;const why=m.eligible?'':shortReason(m.reason);option.textContent=m.title+(arrivals.has(m.id)?' •':'')+(badgeCount(m.id)?` (${badgeCount(m.id)} new)`:'')+(why?` · ${why}`:'');option.title=m.eligible?'':m.reason;option.disabled=!m.eligible;(groups.get(m.group)||groups.get('World')).append(option);}
            groups.forEach(g=>{if(g.children.length)more.append(g);});}
            // COV5/COV12: a folded panel is listed once, under its owner (src/panel_folds.js).
            for(const option of [...more.querySelectorAll('option')])if(!listable(option.value))option.remove();for(const group of [...more.querySelectorAll('optgroup')])if(!group.children.length)group.remove();
    };
    // COV5/COV12, UR13: the first load that finds an old panel id in a saved layout says where it went and dots the owner.
    const announce=setInterval(()=>{if(!nav.isConnected){clearInterval(announce);return;}if(document.documentElement.dataset.startScreen!=='closed')return;clearInterval(announce);
        const known=knownWorkspaceModules();for(const move of movedNotices({titleOf:id=>known.find(m=>m.id===id)?.title||id})){arrivals.add(move.into);notice?.(move.text,move.into);}refresh();},700);
    document.addEventListener('workspace-panel-arrival',event=>{const{id}=event.detail||{};if(id==='pane-navigation')return;const known=knownWorkspaceModules().find(m=>m.id===id);if(!known)return;arrivals.add(id);notice?.(`${known.title} is now available in navigation.`,id);publishChange('knowledge','panel-arrival');});
    // A held route change lands once the pointer leaves the bar or focus moves off it.
    const release=()=>{if(held)queueMicrotask(()=>{if(held&&!interacting())refresh();});};
    document.addEventListener('pointerout',release);document.addEventListener('focusout',release);
    document.addEventListener('keydown',event=>{
        if(event.defaultPrevented)return;
        const editing=event.target.closest('input,textarea,select,[contenteditable="true"]');
        if(event.key==='?'&&!editing){event.preventDefault();showHelp();return;}
        if(editing||!event.altKey||event.ctrlKey||event.metaKey)return;
        const entry=[...buttons].find(([route,b])=>route.key===event.key.toLowerCase()&&!b.hidden&&!b.disabled);
        if(entry){event.preventDefault();go(entry[0]);}
    });
    // UIL2 (UIX2): route state is a change reader. The spec gives the navigation no `reads` yet, so
    // its topics are pending. Inputs with no publisher yet (discovery of panels and Journal tabs,
    // the center mode after Esc, list decoration) keep the 500 ms poll as a fallback, skipped when
    // a change already refreshed it since the last poll, so it stays at the old 2/s while changes arrive at most that often.
    registerChangeProbes();
    const stop=subscribeChange({id:'workspace-navigation',surface:'pane-navigation',pending:['place','work','combat','knowledge','inventory'],refresh});
    let lastPoll=0;refresh();const timer=setInterval(()=>{const skip=lastRefresh>lastPoll;lastPoll=performance.now();if(skip)return;changeSignal.countPoll('workspace-navigation');refresh();},500);
    return {destroy:()=>{clearInterval(timer);stop();extras.destroy();document.removeEventListener('pointerout',release);document.removeEventListener('focusout',release);}};
}
