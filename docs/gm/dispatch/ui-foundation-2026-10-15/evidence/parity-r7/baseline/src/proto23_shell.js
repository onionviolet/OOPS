import {getDisplaySetting,setDisplaySettings} from './display_settings.js';
import {centerModes} from './center_modes.js';
import {definePanel} from './panel_kit.js';
import {expandWorkspaceModule,updateWorkspace} from './workspace_layout.js';
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
// Preserve native tooltip content and markup; add presentation roles to its
// existing lines, never synthesize item facts from names or hidden templates.
function descriptionCopy(tooltip) {
    const copy=tooltip.cloneNode(true);copy.removeAttribute('id');copy.removeAttribute('style');
    copy.className='shell-native-item-description';
    for(const n of copy.querySelectorAll('[id]'))n.removeAttribute('id');
    const lines=document.createDocumentFragment();let line=document.createElement('div');
    const finish=()=>{if(line.hasChildNodes()){const text=line.textContent.trim();
        line.className='shell-description-line';
        if(/^(Slot|Type|Material type|Component tier|Basic stats|Effects|Compared to equipped|Time to read|Reading it provided|Value|Count in player inventory):?/.test(text))line.dataset.detailRole='label';
        if(/^Value:/.test(text))line.dataset.detailRole='value';
        // Signed changes retain their literal sign. Color means increase/decrease,
        // not a universal assertion that every increased stat is beneficial.
        if(/:\s*-\d/.test(text))line.dataset.detailRole='decrease';
        else if(/:\s*\+\d/.test(text))line.dataset.detailRole='increase';
        else {const multiplier=text.match(/:\s*x(\d+(?:\.\d+)?)/);if(multiplier&&Number(multiplier[1])!==1)line.dataset.detailRole=Number(multiplier[1])<1?'decrease':'increase';}
        lines.append(line);}line=document.createElement('div');};
    for(const child of [...copy.childNodes]){if(child.nodeName==='BR'){child.remove();finish();}else line.append(child);}finish();copy.append(lines);
    return copy;
}
const active=()=>document.getElementById('main_content')?.dataset.presentation==='proto23-shell';
const action=(label,run)=>{const b=node('button',label);b.type='button';b.onclick=run;return b;};
// Presentation only: authoritative values come from the supplied native reader;
// item commands delegate to the original row control, with its native guards.
export function mountProto23Shell({read}) {
    const player=node('section',null,'shell-character');player.id='proto23_character';
    const statline=node('div',null,'shell-statline'),equipment=node('div',null,'shell-equipment');
    let allStatsOpen=false,statsSignature='';const statsCatalog=node('section',null,'shell-stats-catalog');statsCatalog.hidden=true;
    const details=action('All stats',()=>{allStatsOpen=!allStatsOpen;statsCatalog.hidden=!allStatsOpen;statline.hidden=allStatsOpen;details.textContent=allStatsOpen?'Overview':'All stats';details.setAttribute('aria-expanded',String(allStatsOpen));document.getElementById('main_content').dataset.shellStatsOpen=String(allStatsOpen);});
    const fullStats=action('Full stats ›',()=>expandWorkspaceModule('preparation'));statsCatalog.append(fullStats);
    const statsRows=node('div',null,'shell-stat-records');statsCatalog.append(statsRows);
    const gear=node('details',null,'shell-gear-disclosure'),gearSummary=node('summary','Equipment');gear.append(gearSummary,equipment);
    details.title='Show all native character stats in this panel';const effectsSummary=action('Effects',()=>showContext(effectsSummary));effectsSummary.className='shell-effects-summary';effectsSummary.hidden=true;effectsSummary.dataset.contextPreview='effects';player.append(statline,details,effectsSummary,gear,statsCatalog);
    const detail=node('section',null,'shell-item-detail');detail.id='proto23_item_detail';
    const title=node('strong'),meta=node('p'),body=node('div',null,'shell-item-description'),controls=node('div',null,'shell-item-actions');
    detail.append(title,meta,body,controls);
    let selected=null,signature='',playerSignature='';const playerStatNodes=new Map();
    const originalLogLabels=new Map();
    function syncLogLabels(){const parity=active()&&document.getElementById('main_content').dataset.parity==='r3';for(const[id,label]of [['message_show_unlocks','Growth'],['message_show_events','Events'],['message_show_crafting','Crafting'],['message_show_combat','Combat'],['message_show_loot','Loot'],['message_show_background','World']]){const control=document.getElementById(id);if(!control)continue;if(parity){if(!originalLogLabels.has(control))originalLogLabels.set(control,control.textContent);if(control.textContent!==label)control.textContent=label;}else if(originalLogLabels.has(control)){control.textContent=originalLogLabels.get(control);originalLogLabels.delete(control);}}}

    // Context previews reuse public native descriptions. No hidden actor lookup,
    // simulation mutation, or reconstruction of an old event from current state.
    const contextPreview=node('aside',null,'shell-context-preview');contextPreview.id='shell_context_preview';contextPreview.setAttribute('popover','manual');contextPreview.setAttribute('role','tooltip');player.append(contextPreview);
    let contextSource=null,contextTimer=null,contextSignature='';
    function hideContext(){clearTimeout(contextTimer);if(contextPreview.matches(':popover-open'))contextPreview.hidePopover();contextSource?.removeAttribute('aria-describedby');contextSource=null;contextSignature='';}
    function showContext(source){
        if(!active()||document.getElementById('main_content').dataset.parity!=='r3')return;
        clearTimeout(contextTimer);const nextSignature=source.logDescription||source.dataset.contextPreview==='effects'&&document.getElementById('effects_tooltip')?.innerHTML||source.dataset.effectAnchor==='opponent-name'&&document.getElementById('current_focus').textContent||source.innerHTML+source.title;if(contextSource===source&&contextSignature===nextSignature&&contextPreview.matches(':popover-open'))return;contextSignature=nextSignature;hidePreview();contextSource?.removeAttribute('aria-describedby');contextSource=source;
        contextPreview.replaceChildren();
        if(source.logDescription){const saved=node('div');saved.innerHTML=source.logDescription;contextPreview.append(descriptionCopy(saved),node('small','Description recorded with this event.'));
        }else if(source.dataset.contextPreview==='effects'){
            const native=document.getElementById('effects_tooltip');if(!native)return;
            contextPreview.append(node('strong','Active effects'));
            for(const effect of native.querySelectorAll('.active_effect_tooltip')){const copy=descriptionCopy(effect);if(effect.dataset.effectKind)copy.prepend(node('small',effect.dataset.effectKind==='debuff'?'Debuff':effect.dataset.effectKind==='buff'?'Buff':'Condition','context-effect-kind'));contextPreview.append(copy);}
        }else if(source.dataset.effectAnchor==='opponent-name'){
            const focus=document.getElementById('current_focus');contextPreview.append(node('strong',source.textContent),node('p',focus.querySelector('.combat-focus-view > p')?.textContent||''),node('p',[...focus.querySelectorAll('dl > div')].map(n=>[...n.children].map(c=>c.textContent).join(': ')).join(' · ')),node('small','Current native combat facts. Level, intent and status effects are not supplied by this view.'));
        }else if(source.classList.contains('notice-panel-link')){
            contextPreview.append(node('strong','Related panel'),node('p','Open shows the current related panel. Hover an underlined subject for its recorded description.'));
        }else{
            const tooltip=source.querySelector('.stat_tooltip,[id$="_tooltip"]');
            if(tooltip)contextPreview.append(descriptionCopy(tooltip));
            else contextPreview.append(node('strong',source.matches('dl > div')?[...source.children].map(n=>n.textContent).join(': '):source.textContent.trim()),node('p',source.title||'Known native combat facts.'));
        }
        for(const n of contextPreview.querySelectorAll('[id]'))n.removeAttribute('id');
        const region=source.closest('[data-custom-palette]')||document.getElementById('location_related_div'),css=getComputedStyle(region);
        contextPreview.style.fontSize=css.fontSize;contextPreview.style.fontFamily=css.fontFamily;
        contextPreview.dataset.customPalette=region.dataset.customPalette||'false';
        for(const key of ['background','text','accent'])contextPreview.style.setProperty('--context-'+key,css.getPropertyValue('--custom-'+key));
        const effectAnchor=source.dataset.contextPreview==='effects'?document.querySelector('.parity-region[data-region="player"]')?.getBoundingClientRect():null;
        contextPreview.style.width=effectAnchor?Math.min(460,effectAnchor.width-8)+'px':'';
        contextPreview.style.maxHeight=effectAnchor?Math.max(140,innerHeight-effectAnchor.bottom-60)+'px':'';
        if(!contextPreview.matches(':popover-open'))contextPreview.showPopover();
        if(effectAnchor){contextPreview.style.left=effectAnchor.left+4+'px';contextPreview.style.top=effectAnchor.bottom+6+'px';source.setAttribute('aria-describedby',contextPreview.id);return;}
        const box=source.getBoundingClientRect(),w=contextPreview.offsetWidth,h=contextPreview.offsetHeight;
        contextPreview.style.left=Math.max(8,Math.min(box.left,innerWidth-w-8))+'px';
        contextPreview.style.top=Math.max(8,box.bottom+h+8<innerHeight?box.bottom+6:box.top-h-6)+'px';
        source.setAttribute('aria-describedby',contextPreview.id);
    }
    const contextSelector='[data-effect-anchor=opponent-name],.shell-effects-summary,.combat-focus-view dl > div,.combat-focus-choices button,.log-subject,.shell-stat-record,#message_box_div .notice-panel-link,#character_health_div,#character_stamina_div,#character_xp_div';
    const contextEnter=event=>{const source=event.target.closest(contextSelector);if(source&&!source.contains(event.relatedTarget))showContext(source);};
    const contextLeave=event=>{const source=event.target.closest(contextSelector);if(source&&!source.contains(event.relatedTarget)){clearTimeout(contextTimer);contextTimer=setTimeout(hideContext,180);}};
    for(const type of ['mouseover','focusin'])document.addEventListener(type,contextEnter);
    for(const type of ['mouseout','focusout'])document.addEventListener(type,contextLeave);
    contextPreview.addEventListener('mouseenter',()=>clearTimeout(contextTimer));contextPreview.addEventListener('mouseleave',()=>{contextTimer=setTimeout(hideContext,180);});
    const contextDismiss=event=>{if(event.key==='Escape'&&contextPreview.matches(':popover-open')){hideContext();event.preventDefault();event.stopImmediatePropagation();}};
    document.addEventListener('keydown',contextDismiss,true);
    document.addEventListener('click',event=>{const subject=event.target.closest('.log-subject');if(subject){showContext(subject);return;}if(!contextPreview.contains(event.target)&&event.target!==effectsSummary)hideContext();});

    const preview=node('aside',null,'shell-item-preview');preview.id='shell_item_preview';
    preview.setAttribute('popover','manual');preview.setAttribute('aria-label','Item preview');
    const previewBody=node('div',null,'shell-preview-body'),previewFooter=node('div',null,'shell-preview-footer');
    const full=action('Full item ›',()=>{if(hovered?.isConnected){const row=hovered;row.focus({preventScroll:true});choose(row);expandWorkspaceModule('shell-detail');}});
    previewFooter.append(full,node('span','Inspection is free · Esc closes'));preview.append(previewBody,previewFooter);player.append(preview);
    let hovered=null,previewSignature='',hideTimer=null;
    function hidePreview(){clearTimeout(hideTimer);if(preview.matches(':popover-open'))preview.hidePopover();hovered?.removeAttribute('aria-describedby');hovered=null;previewSignature='';}
    function deferHide(){clearTimeout(hideTimer);hideTimer=setTimeout(hidePreview,180);}
    function showPreview(row){
        if(!active()||document.getElementById('main_content').dataset.parity!=='r3')return;
        const tooltip=row.querySelector('.item_tooltip');if(!tooltip)return;hideContext();
        clearTimeout(hideTimer);if(hovered!==row||previewSignature!==tooltip.innerHTML){hovered?.removeAttribute('aria-describedby');hovered=row;previewSignature=tooltip.innerHTML;previewBody.replaceChildren(descriptionCopy(tooltip));}
        row.setAttribute('aria-describedby',preview.id);
        const source=document.getElementById('inventory_div'),css=getComputedStyle(source);
        for(const [key,value]of Object.entries({'--shell-preview-size':css.fontSize,'--shell-preview-fill':css.getPropertyValue('--custom-background'),'--shell-preview-text':css.getPropertyValue('--custom-text'),'--shell-preview-accent':css.getPropertyValue('--custom-accent')}))preview.style.setProperty(key,value);
        preview.dataset.customPalette=source.dataset.customPalette||'false';
        const region=document.querySelector('.parity-region[data-region="inventory"]')||row,box=region.getBoundingClientRect(),expanded=!!row.closest('#center_mode_content');
        preview.style.setProperty('--shell-preview-width',expanded?Math.max(280,box.width-8)+'px':'28em');
        preview.style.setProperty('--shell-preview-left',(expanded?box.left+4:Math.min(box.right+6,innerWidth-480))+'px');
        preview.style.setProperty('--shell-preview-top',Math.max(48,Math.min(box.top,innerHeight-300))+'px');
        preview.style.setProperty('--shell-preview-height',Math.max(160,innerHeight-Math.max(48,Math.min(box.top,innerHeight-300))-54)+'px');
        if(!preview.matches(':popover-open'))preview.showPopover();
    }
    const hover=event=>{const row=event.target.closest('#inventory_content_div > [data-character_item]');if(row&&!row.contains(event.relatedTarget))showPreview(row);};
    const leave=event=>{if(event.target.closest('#inventory_content_div > [data-character_item]')&&!event.target.closest('#inventory_content_div > [data-character_item]').contains(event.relatedTarget))deferHide();};
    document.addEventListener('mouseover',hover);document.addEventListener('mouseout',leave);
    preview.addEventListener('mouseenter',()=>clearTimeout(hideTimer));preview.addEventListener('mouseleave',deferHide);
    preview.addEventListener('focusout',event=>{if(!preview.contains(event.relatedTarget))deferHide();});
    const dismiss=event=>{if(event.key==='Escape'&&preview.matches(':popover-open')){hidePreview();event.preventDefault();event.stopImmediatePropagation();}};
    document.addEventListener('keydown',dismiss,true);
    window.addEventListener('blur',hidePreview);
    const dismissClick=event=>{if(!preview.contains(event.target))hidePreview();};
    document.addEventListener('click',dismissClick);
    // Compact controls delegate to the existing native category/sort controls.
    // Their original controls remain attached and retain filter/sort state.
    const compact=node('div',null,'parity-inventory-controls');
    const makeSelect=(label,choices)=>{const select=node('select');select.setAttribute('aria-label',label);
        for(const [id,text]of choices){const option=node('option',text);option.value=id;select.append(option);}
        select.onchange=()=>document.getElementById(select.value)?.click();compact.append(select);return select;};
    const category=makeSelect('Inventory category',[['inventory_show_all','All items'],['inventory_show_equipment','Equipment'],['inventory_show_consumable','Usable'],['inventory_show_other','Other'],['inventory_show_favs','Favorites']]);
    const sort=makeSelect('Inventory sort',[['inventory_sort_by_name','Name'],['inventory_sort_by_price','Value'],['inventory_sort_by_type','Type']]);
    const reverse=action('Reverse',()=>document.getElementById(sort.value)?.click());reverse.setAttribute('aria-label','Reverse inventory sort');reverse.title='Reverse the current native sort order';compact.append(reverse);
    const home=document.getElementById('main_content');
    definePanel({id:'shell-inventory-tools',title:'Inventory tools',role:'records',node:compact,home,defaultDock:'left',after:'combat-controls',eligible:()=>home.dataset.parity==='r3',discovered:()=>home.dataset.parity==='r3'});
    definePanel({id:'shell-character',title:'Stats & equipment',role:'character',node:player,home,defaultDock:'left',after:'vitals',eligible:active,discovered:active});
    definePanel({id:'shell-detail',title:'Item details',role:'records',node:detail,home,defaultDock:'center',after:'focus',eligible:()=>active()&&!!selected,discovered:active});
    const logTools=node('div',null,'shell-log-tools');const filters=action('Filters · All',()=>{const root=document.getElementById('main_content');root.dataset.logFiltersOpen=String(root.dataset.logFiltersOpen!=='true');filters.setAttribute('aria-expanded',root.dataset.logFiltersOpen);});filters.setAttribute('aria-expanded','false');filters.setAttribute('aria-controls','message_controls');
    const follow=node('select');follow.setAttribute('aria-label','Log follow');for(const [value,label]of [['hold','Follow: smart'],['always','Follow: always']]){const option=node('option',label);option.value=value;follow.append(option);}follow.title='Smart follow holds your place when you scroll up. Always follow jumps to new messages.';follow.onchange=()=>setDisplaySettings({logFollow:follow.value});
    const latest=action('Latest',()=>{const native=document.querySelector('.log-unread-anchor button');if(native)native.click();else{const box=document.getElementById('message_box_div');box.scrollTop=box.scrollHeight;}});latest.title='Jump to the latest message';logTools.append(filters,follow,latest);
    definePanel({id:'shell-log-tools',title:'Reports controls',role:'log',node:logTools,home,defaultDock:'right',after:'messages',eligible:()=>home.dataset.parity==='r3',discovered:()=>home.dataset.parity==='r3'});

    function rowForSelection(){
        if(!selected)return null;
        if(selected.slot)return document.getElementById(selected.slot+'_slot');
        return [...document.querySelectorAll('#inventory_content_div > [data-character_item]')].find(r=>r.dataset.character_item===selected.key);
    }
    function choose(row){
        hidePreview();
        selected=row.classList.contains('equipment_slot_div')?{slot:row.id.replace(/_slot$/,'')}:{key:row.dataset.character_item};
        signature='';render();updateWorkspace();
    }
    const inspect=event=>{
        if(!active())return;
        const row=event.target.closest('#inventory_content_div > [data-character_item]');
        if(!row||event.target.closest('.item_controls,.item_use_button,.item_auto_use_button,.item_fav_div,.known-item-binding'))return;
        choose(row);
    };
    document.addEventListener('click',inspect);document.addEventListener('focusin',inspect);
    document.addEventListener('keydown',event=>{if(active()&&['Enter',' '].includes(event.key)&&event.target.matches('#inventory_content_div > [data-character_item]')){event.preventDefault();choose(event.target);}});
    function render(){
        syncLogLabels();if(!active()){if(contextSource)hideContext();return;}const enabled=document.querySelectorAll('#message_controls .active_selection_button').length;filters.textContent=enabled===6?'Filters · All':`Filters · ${enabled}/6`;follow.value=getDisplaySetting('logFollow');const logBox=document.getElementById('message_box_div');latest.disabled=logBox.scrollHeight-logBox.scrollTop-logBox.clientHeight<24;
        const effectRows=[...document.querySelectorAll('#effects_tooltip .active_effect_tooltip')],effectName=effectRows[0]?.querySelector('.active_effect_name')?.textContent.replace(/^'|'\s*:\s*$/g,'').trim();effectsSummary.hidden=!effectRows.length||document.getElementById('main_content').dataset.parity!=='r3';effectsSummary.textContent=effectName?(effectName+(effectRows.length>1?' +'+(effectRows.length-1):'')):'Effects';effectsSummary.setAttribute('aria-label',`Active effects: ${effectRows.length}. ${effectName||''}`);player.dataset.hasEffects=String(!!effectRows.length);
        if(contextSource){if(contextSource.isConnected&&!contextSource.hidden&&active())showContext(contextSource);else hideContext();}
        if(!active())return;
        const nativeStats=[...document.querySelectorAll('#character_stats_div .stat_slot_div')].filter(n=>n.querySelector('.stat_value')?.textContent.trim());const nextStats=nativeStats.map(n=>n.innerHTML).join('');if(statsSignature!==nextStats){statsSignature=nextStats;const focused=document.activeElement?.dataset.statRecord;statsRows.replaceChildren();for(const source of nativeStats){const label=source.querySelector('.stat_name,.stat_name_short')?.textContent.trim()||'Combat chance',value=source.querySelector('.stat_value')?.textContent.trim();const row=node('button',null,'shell-stat-record');row.type='button';row.dataset.statRecord=source.querySelector('.stat_value')?.id||label;row.append(node('span',label.replace(/:$/,'')),node('strong',value));const tooltip=source.querySelector('.stat_tooltip');if(tooltip){const copy=tooltip.cloneNode(true);for(const n of copy.querySelectorAll('[id]'))n.removeAttribute('id');row.append(copy);}statsRows.append(row);}if(focused)statsRows.querySelector(`[data-stat-record="${CSS.escape(focused)}"]`)?.focus({preventScroll:true});}
        const root=document.getElementById('main_content'),context=document.getElementById('location_related_div'),style=getComputedStyle(context);
        root.dataset.shellCustomPalette=context.dataset.customPalette||'false';
        for(const [key,value]of Object.entries({'--shell-context-size':style.fontSize,'--shell-context-font':style.fontFamily,'--shell-user-fill':style.getPropertyValue('--custom-background'),'--shell-user-text':style.getPropertyValue('--custom-text'),'--shell-user-accent':style.getPropertyValue('--custom-accent')}))if(root.style.getPropertyValue(key)!==value)root.style.setProperty(key,value);
        for(const select of [category,sort]){const active=[...select.options].find(o=>document.getElementById(o.value)?.classList.contains('active_selection_button'));if(active)select.value=active.value;}
        // A zero-capacity native resource is empty, including the currently
        // unimplemented 0/0 mana slot. Keep native numeric text untouched.
        if(root.dataset.parity==='r3')for(const id of ['character_health','character_xp','character_stamina','character_mana']){
            const value=document.getElementById(id+'_value'),host=document.getElementById(id+'_div');
            if(value&&host){host.tabIndex=0;const text=value.textContent.trim();host.dataset.zeroCapacity=String(/\/\s*0(?:\s|$)/.test(text));value.title=text;}
        }
        if(hovered){if(!hovered.isConnected)hidePreview();else showPreview(hovered);}
        const frame=read();const nextPlayer=JSON.stringify(frame);
        if(nextPlayer!==playerSignature){playerSignature=nextPlayer;
            for(const [label,value]of frame.stats){let cell=playerStatNodes.get(label);if(!cell){cell=node('span');cell.dataset.playerStat=label;cell.append(node('span',label),node('strong'));playerStatNodes.set(label,cell);statline.append(cell);}if(cell.lastChild.textContent!==String(value))cell.lastChild.textContent=String(value);}
            const worn=frame.equipment.filter(s=>s.name).length;gearSummary.textContent=`Gear · ${worn}`;gearSummary.setAttribute('aria-label',`Equipment · ${worn} worn`);gearSummary.title=`${worn} worn items. Open native equipment slots.`;
            player.dataset.effectAnchor='player-stats';
            const focusedSlot=document.activeElement?.dataset.shellSlot;
            const toolsOpen=equipment.querySelector('details')?.open;equipment.replaceChildren();
            const tools=node('details'),toolLabel=node('summary','Tools');tools.open=!!toolsOpen;const toolGrid=node('div',null,'shell-equipment');tools.append(toolLabel,toolGrid);
            for(const slot of frame.equipment){const b=action(`${slot.label} · ${slot.name||'Empty'}`,()=>{selected={slot:slot.id};signature='';render();updateWorkspace();});b.dataset.shellSlot=slot.id;b.title=slot.name||`Empty ${slot.label} slot`;(['axe','pickaxe','sickle','shovel','fishing'].includes(slot.id)?toolGrid:equipment).append(b);}
            equipment.append(tools);
            if(focusedSlot)equipment.querySelector(`[data-shell-slot="${CSS.escape(focusedSlot)}"]`)?.focus({preventScroll:true});
        }
        const top=document.querySelector('.workspace-module[data-module=vitals]')?.getBoundingClientRect(),end=document.querySelector('.workspace-module[data-module="combat-controls"]')?.getBoundingClientRect();
        if(root.dataset.parity!=='r3'&&top?.height&&end?.height){const height=Math.min(innerHeight*.42,Math.ceil(end.bottom-top.top));const root=document.getElementById('main_content'),value=height+'px';if(root.style.getPropertyValue('--shell-upper-height')!==value)root.style.setProperty('--shell-upper-height',value);}
        if(!selected)return;
        const row=rowForSelection();
        const next=JSON.stringify([selected,row?.innerHTML,frame.reason,root.dataset.parity,root.dataset.parityExpanded]);if(next===signature)return;signature=next;
        const tooltip=row?.querySelector('.item_tooltip');
        detail.dataset.itemKind=row?.dataset.item_slot||row?.querySelector('.item_category')?.textContent.replace(/[\[\]]/g,'').trim()||(selected.slot?'Equipped item':'Item');
        title.className='shell-item-title';
        title.textContent=row?.querySelector('.item_name')?.textContent|| (selected.slot?frame.equipment.find(s=>s.id===selected.slot)?.name:'Item no longer held')||'Empty slot';
        meta.textContent=selected.slot?`Equipped · ${selected.slot}`:row?`${detail.dataset.itemKind} · Held: ${row.dataset.item_count} · ${row.querySelector('.item_value')?.textContent.trim()||'No sale value'}`:'Choose another held item to inspect.';
        body.replaceChildren();
        if(tooltip){const copy=descriptionCopy(tooltip);copy.firstElementChild?.remove();body.append(copy);}
        else body.append(node('p',selected.slot?'Choose a held item to equip in this slot.':'This item is no longer in your inventory.'));
        const moreWasOpen=!!detail.closest('#center_mode_content')&&controls.querySelector('.shell-item-more')?.open;
        controls.replaceChildren();const more=node('details',null,'shell-item-more');more.open=!!moreWasOpen;more.append(node('summary','More actions'));more.addEventListener('toggle',()=>{if(more.open&&root.dataset.parity==='r3'&&!detail.closest('#center_mode_content'))expandWorkspaceModule('shell-detail');});
        if(selected.slot&&tooltip){const takeoff=action('Take off',()=>{const source=rowForSelection();if(source&&!source.classList.contains('equipment_slot_empty'))source.click();signature='';render();});takeoff.disabled=!!frame.reason;takeoff.title=frame.reason;controls.append(takeoff);}
        if(!selected.slot&&row){
            const favorite=row.querySelector('.item_fav_div');
            if(favorite&&root.dataset.parity==='r3'){const favored=row.querySelector('.item_fav_icon')?.textContent==='star';const b=action(favored?'Unfavorite':'Favorite',()=>{rowForSelection()?.querySelector('.item_fav_div')?.click();signature='';render();});b.dataset.shellFavorite='';b.setAttribute('aria-pressed',String(favored));more.append(b);}
            for(const selector of ['.equip_item_button','.item_use_button','.item_auto_use_button']){const native=row.querySelector(selector);if(!native)continue;
                const label=native.textContent.replace(/[\[\]]/g,'').trim();const b=action(label[0].toUpperCase()+label.slice(1),()=>{const current=rowForSelection()?.querySelector(selector);if(current){const slot=rowForSelection()?.dataset.item_slot;current.click();if(selector==='.equip_item_button'&&slot)selected={slot};signature='';render();updateWorkspace();}});b.dataset.shellItemAction=label;b.disabled=!!frame.reason;b.title=frame.reason;(selector==='.item_auto_use_button'&&root.dataset.parity==='r3'?more:controls).append(b);}
        }
        if(frame.reason)controls.append(node('span',frame.reason,'ui-disabled-reason'));
        if(root.dataset.parity==='r3'&&row?.querySelector('.known-item-binding'))more.append(action('Hotkey…',()=>{
            expandWorkspaceModule('belongings');const binding=rowForSelection()?.querySelector('.known-item-binding');
            if(binding){binding.open=true;binding.scrollIntoView({block:'nearest'});binding.querySelector('input,button,summary')?.focus({preventScroll:true});}
        }));
        (root.dataset.parity==='r3'?more:controls).append(action('Compare equipment ›',()=>expandWorkspaceModule('equipment-comparison')));
        if(root.dataset.parity==='r3'&&!detail.closest('#center_mode_content'))controls.append(action('Full item ›',()=>expandWorkspaceModule('shell-detail')));
        controls.append(action('Close item',()=>{if(detail.closest('#center_mode_content'))centerModes().back();selected=null;signature='';updateWorkspace();}));if(root.dataset.parity==='r3')controls.append(more);
    }
    document.addEventListener('workspace-presentation-change',()=>{hideContext();hidePreview();render();updateWorkspace();});
    const timer=setInterval(render,400);return{render,destroy:()=>{hidePreview();clearInterval(timer);document.removeEventListener('mouseover',hover);document.removeEventListener('mouseout',leave);document.removeEventListener('keydown',dismiss,true);document.removeEventListener('click',dismissClick);window.removeEventListener('blur',hidePreview);document.removeEventListener('click',inspect);document.removeEventListener('focusin',inspect);}};
}
