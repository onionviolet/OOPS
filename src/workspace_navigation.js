import {definePanel} from './panel_kit.js';
import {openMixtureCounter} from './mixture_ui.js';
import {knownWorkspaceModules,expandWorkspaceModule} from './workspace_layout.js';
import {centerModes} from './center_modes.js';
import {decorateInventoryList,summarizeGroups} from './ui_components.js';
import {mountGameBar} from './game_bar.js';
import {routeTable} from './layout_spec.js';

// UIL1 (UIM2): the routes come from the layout spec's route table; this module owns how each opens.
const routes=routeTable();
// Routes that are center views rather than workspace panels show whether or not a panel is known.
const views=new Set(routes.filter(r=>r.open&&r.open!=='in-place').map(r=>r.target));
export function mountWorkspaceNavigation({notice}={}) {
    const nav=document.createElement('nav');nav.id='workspace_navigation';nav.setAttribute('aria-label','Game panels');
    const buttons=new Map(),arrivals=new Set();
    function go(route) {
        const {target:id,tab}=route;
        arrivals.delete(id);
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
    const help=document.createElement('button');help.type='button';help.textContent='?';help.title='Keyboard shortcuts · ?';nav.append(help);
    const sheet=document.createElement('dialog');sheet.id='workspace_shortcuts';const title=document.createElement('h2');title.textContent='Panel shortcuts';
    const list=document.createElement('div'),close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=()=>sheet.close();sheet.append(title,list,close);nav.append(sheet);
    const showHelp=()=>{list.replaceChildren();for(const [route,b]of buttons)if(!b.hidden){const p=document.createElement('p');p.textContent=b.title;list.append(p);}const p=document.createElement('p');p.textContent='Esc: return to the named previous view. F6 / Shift+F6: cycle visible panels.';list.append(p);sheet.showModal();};help.onclick=showHelp;
    const paneNav=document.createElement('nav');paneNav.id='workspace_pane_navigation';paneNav.setAttribute('aria-label','Center views');
    const paneButtons=new Map();for(const route of routes.filter(r=>r.pane).sort((x,y)=>x.pane-y.pane)){const b=document.createElement('button');b.type='button';b.textContent=route.label;b.dataset.panelPath=route.target;b.onclick=()=>go(route);paneNav.append(b);paneButtons.set(route,b);}
    const paneHelp=document.createElement('button');paneHelp.type='button';paneHelp.textContent='?';paneHelp.title='Keyboard shortcuts';paneHelp.onclick=showHelp;paneNav.append(paneHelp);
    const root=document.getElementById('main_content');definePanel({id:'pane-navigation',title:'Center views',role:'actions',node:paneNav,home:root,defaultDock:'center',after:'local-actions',eligible:()=>root.dataset.parity==='r3',discovered:()=>root.dataset.parity==='r3'});
    document.getElementById('main_content').before(nav);
    // R21 (MB2): in the parity shell the navigation joins the one bar with save and menu.
    mountGameBar({nav});
    const resize=new ResizeObserver(()=>document.documentElement.style.setProperty('--workspace-nav-height',nav.offsetHeight+'px'));resize.observe(nav);
    let last='',notified=false;
    const lists=[decorateInventoryList(),
        decorateInventoryList({id:'skill_list',label:'skill',rowSelector:'.skill_div',nameSelector:'.skill_bar_name',emptyText:'Practice an activity to discover its skills.'}),
        decorateInventoryList({id:'bestiary_list',label:'bestiary entry',rowSelector:':scope > *',nameSelector:'.bestiary_entry_name',emptyText:'Meet enemies to record what you learn.'}),
        decorateInventoryList({id:'books_list',label:'read book',rowSelector:':scope > *',nameSelector:'.book_name',emptyText:'Finish reading a book to record it here.'})];
    const refresh=()=>{
        for(const list of lists)list.refresh();summarizeGroups(document.getElementById('location_actions_div'));summarizeGroups(document.getElementById('projects_drawer'));
        if(!notified&&document.getElementById('main_content').dataset.workspaceComposition==='proto23'){notified=true;if(document.getElementById('main_content').dataset.parity!=='r3')notice?.('Workspace now groups You above Inventory. Character details and known records remain in the named navigation.','preparation');const stats=[...buttons].find(([route])=>route.target==='preparation')?.[1];if(stats)stats.dataset.newHome='true';}
        const known=knownWorkspaceModules(),ids=new Set(known.map(m=>m.id));
        for(const [route,b]of buttons){const {target:id,tab}=route;
            b.hidden=!views.has(id)&&!ids.has(id);
            if(tab){const control=document.getElementById(tab);b.hidden=!control||control.hidden||control.dataset.referenceKnown==='false';}
            const module=known.find(m=>m.id===id);b.disabled=!!module&&!module.eligible;
            if(arrivals.has(id))b.dataset.newHome='true';
            b.title=`${route.label} · Alt+${route.key.toUpperCase()}${b.disabled?' · '+module.reason:''}`;
            if(route.open==='crafting'){b.disabled=!document.querySelector('.choice_craft');b.title=b.disabled?'Crafting · Alt+C · no available station or finish this conversation.':`Crafting · Alt+C`;}
            if(route.open==='mixing'){const launch=document.getElementById('village_mixing_open');b.disabled=!launch||launch.hidden;b.title=b.disabled?'Mixing · Alt+M · return to Village and finish your conversation.':'Mixing · Alt+M';}
            b.setAttribute('aria-current',centerModes().mode===`workspace:${id}`?'page':'false');
        }
        for(const [route,b]of paneButtons){const original=buttons.get(route);b.hidden=original.hidden;b.disabled=original.disabled;b.title=original.title;const mode=centerModes().mode;b.setAttribute('aria-current',route.open==='here'&&mode==='local'||route.open==='crafting'&&mode==='crafting'?'page':original.getAttribute('aria-current'));if(arrivals.has(route.target))b.dataset.newHome='true';else delete b.dataset.newHome;}
        const next=JSON.stringify([known,[...arrivals]]);if(next!==last){last=next;more.replaceChildren();const first=document.createElement('option');first.value='';first.textContent=arrivals.size?'More panels… •':'More panels…';more.append(first);
            for(const m of known){if(['pane-navigation','shell-log-tools'].includes(m.id))continue;const option=document.createElement('option');option.value=m.id;option.textContent=m.title+(arrivals.has(m.id)?' •':'');option.disabled=!m.eligible;more.append(option);}}
    };
    document.addEventListener('workspace-panel-arrival',event=>{const{id}=event.detail||{};if(id==='pane-navigation')return;const known=knownWorkspaceModules().find(m=>m.id===id);if(!known)return;arrivals.add(id);notice?.(`${known.title} is now available in navigation.`,id);refresh();});
    document.addEventListener('keydown',event=>{
        if(event.defaultPrevented)return;
        const editing=event.target.closest('input,textarea,select,[contenteditable="true"]');
        if(event.key==='?'&&!editing){event.preventDefault();showHelp();return;}
        if(editing||!event.altKey||event.ctrlKey||event.metaKey)return;
        const entry=[...buttons].find(([route,b])=>route.key===event.key.toLowerCase()&&!b.hidden&&!b.disabled);
        if(entry){event.preventDefault();go(entry[0]);}
    });
    refresh();const timer=setInterval(refresh,500);return {destroy:()=>clearInterval(timer)};
}
