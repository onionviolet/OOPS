import {mountInventoryComposition} from './inventory_composition.js';
import {mountStorageComparison} from './storage_comparison.js';
import {clear_message_log,log_message,setCombatReportsStopped,readPlayerAttributeInspector} from './display.js';
import {getDisplaySetting,setDisplaySettings,registerPanelSettings} from './display_settings.js';
import {INVENTORY_CATEGORIES,createInventoryTabs} from './inventory_tabs.js';
import {centerModes} from './center_modes.js';
import {definePanel} from './panel_kit.js';
import {expandWorkspaceModule,updateWorkspace} from './workspace_layout.js';
import {placeTypeEffectText} from './place_types_projection.js';
import {SECONDARY_STATS,secondaryVisible,pinKey,isRate} from './condition_facts.js';
import {mountConditionPanel} from './condition_panel.js';
import {mountShellControlBoxes} from './shell_control_boxes.js';
import {mountShellStripBoxes} from './shell_strip_boxes.js';
import {rendered} from './panel_reveal.js';
import {descriptionCopy} from './shell_item_description.js';
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const shortStatLabels={strength_slot:'STR',agility_slot:'AGL',dexterity_slot:'DEX',intuition_slot:'INT',magic_slot:'Magic',attack_power_slot:'Attack',attack_speed_slot:'Speed',crit_rate_slot:'Crit %',crit_multiplier_slot:'Crit ×',hit_chance_slot:'AP',defense_slot:'Defense',defensive_action_chance_slot:'EP'};
const active=()=>document.getElementById('main_content')?.dataset.presentation==='proto23-shell';
const action=(label,run)=>{const b=node('button',label);b.type='button';b.onclick=run;return b;};
function attributeExplanation(row){
    const fragment=document.createDocumentFragment(),numeric=value=>value==null?'Unavailable':typeof value==='number'?String(Number(value.toFixed(value!==0&&Math.abs(value)<.01?6:3))):String(value);
        const heading=node('h3',row.label),description=node('p',row.description||'Native player attribute.','attribute-description'),facts=node('dl',null,'attribute-facts');
        const fact=(label,value)=>{const pair=node('div');pair.append(node('dt',label),node('dd',value));facts.append(pair);};
        fact('Current',row.formatted??numeric(row.value));
        if(row.unit)fact('Unit',row.unit);
        if(row.base!=null||row.baseFormatted!=null)fact('Base',row.baseFormatted??numeric(row.base));
        if(row.preMultiplier!=null)fact('Before multipliers',numeric(row.preMultiplier));
        if(row.totalMultiplier!=null)fact('Total multiplier','×'+numeric(row.totalMultiplier));
        fragment.append(heading,description,facts);
        if(row.availability?.note)fragment.append(node('p',row.availability.note,'attribute-note'));
        const contributors=(row.sources||[]).filter(source=>source.flat!=null&&source.flat!==0||source.multiplier!=null&&source.multiplier!==1);
        if(contributors.length){
            fragment.append(node('h4','Native modifier sources'));
            const table=node('table',null,'attribute-sources'),head=node('thead'),header=node('tr');for(const label of ['Source category','Flat','Multiplier'])header.append(node('th',label));head.append(header);table.append(head);
            const body=node('tbody');for(const source of contributors){const tr=node('tr');tr.append(node('th',source.label),node('td',source.flat!=null&&source.flat!==0?(source.flat>0?'+':'')+numeric(source.flat):'None'),node('td',source.multiplier!=null&&source.multiplier!==1?'×'+numeric(source.multiplier):'None'));body.append(tr);}table.append(body);fragment.append(table,node('p','Native categories may combine several contributors. Individual item or effect attribution is shown only when supplied.','attribute-note'));
        }else fragment.append(node('p','No non-neutral modifiers reported.','attribute-note'));
    return fragment;
}
// Own section within the existing character Stats home. This is a reader,
// never an attribute engine: formats, bases and contributor categories are native.
function mountAttributeInspector(){
    const pinnable=new Set(SECONDARY_STATS.map(([id])=>id));
    const home=document.getElementById('character_stats_div'),section=node('section',null,'attribute-inspector');section.id='character_attribute_inspector';section.hidden=true;
    const tools=node('div',null,'attribute-inspector-tools'),group=node('select');group.setAttribute('aria-label','Attribute group');
    for(const[id,label]of [['all','All attributes'],['primary','Primary'],['offense','Offense'],['defense','Defense'],['health','Health'],['stamina','Stamina'],['mana','Mana'],['environment','Environment'],['learning','Learning']]){const option=node('option',label);option.value=id;group.append(option);}
    const modifiedLabel=node('label'),modified=node('input');modified.type='checkbox';modifiedLabel.append(modified,document.createTextNode(' With modifiers'));tools.append(group,modifiedLabel);
    const count=node('p',null,'attribute-inspector-count'),layout=node('div',null,'attribute-inspector-layout'),list=node('div',null,'attribute-inspector-list'),reading=node('section',null,'attribute-inspector-detail');
    list.setAttribute('aria-label','Native attributes');reading.tabIndex=0;reading.setAttribute('aria-label','Selected attribute explanation');
    const empty=node('p','No attributes match these filters.','attribute-empty');empty.hidden=true;layout.append(list,reading);section.append(tools,count,empty,layout);home?.append(section);
    const records=new Map();let rows=[],selectedId=null,detailSignature='',shown=false;
    const setText=(target,value)=>{const text=String(value??'');if(target.textContent!==text)target.textContent=text;};
    const numeric=value=>value==null?'Unavailable':String(value);
    function select(id){selectedId=id;paint();}
    function paintDetail(row){
        const signature=JSON.stringify([row||null,row&&getDisplaySetting(pinKey(row.id))]);if(signature===detailSignature)return;detailSignature=signature;
        const top=reading.scrollTop;reading.replaceChildren();reading.dataset.attributeId=row?.id||'';
        if(!row){reading.append(node('p','Choose an attribute to inspect.','attribute-empty'));return;}
        reading.append(attributeExplanation(row));
        if(pinnable.has(row.id)){
            const pinned=getDisplaySetting(pinKey(row.id))==='on';
            const pin=action(pinned?'Unpin row':'Pin row',()=>{setDisplaySettings({[pinKey(row.id)]:pinned?'off':'on'});paint();});
            pin.dataset.pinAttribute=row.id;pin.setAttribute('aria-pressed',String(pinned));
            reading.append(pin,node('p','Pinned rows stay in You, or Condition for rates. This browser owns pins; display export/import includes them and Reset this browser’s display settings clears them.','attribute-note'));
        }
        reading.scrollTop=top;
    }
    function paint(){
        const matches=row=>(group.value==='all'||row.group===group.value)&&(!modified.checked||row.hasModifiers===true);
        let matched=0,retained=0;for(const row of rows){const record=records.get(row.id),included=matches(row);if(included)matched++;
            const keep=!included&&(row.id===selectedId||record.button===document.activeElement);if(keep)retained++;
            record.button.hidden=!included&&!keep;record.button.dataset.outsideFilter=String(keep);record.button.dataset.selected=String(row.id===selectedId);record.button.setAttribute('aria-pressed',String(row.id===selectedId));
        }
        empty.hidden=matched+retained>0;setText(count,`${matched} attributes${retained?' · selected attribute retained outside filter':''}`);
        paintDetail(rows.find(row=>row.id===selectedId));
    }
    group.addEventListener('change',paint);modified.addEventListener('change',paint);
    list.addEventListener('keydown',event=>{
        if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key)||!event.target.matches('.attribute-inspector-row'))return;
        const visible=[...list.querySelectorAll('.attribute-inspector-row')].filter(button=>!button.hidden),index=visible.indexOf(event.target);
        const next=event.key==='Home'?visible[0]:event.key==='End'?visible.at(-1):visible[index+(event.key==='ArrowDown'?1:-1)];if(!next)return;
        event.preventDefault();select(next.dataset.attributeId);next.focus({preventScroll:true});next.scrollIntoView({block:'nearest'});
    });
    function refresh(){
        if(!shown)return;
        const frame=readPlayerAttributeInspector();rows=frame.rows||[];const ids=new Set(rows.map(row=>row.id));
        for(const[id,record]of records)if(!ids.has(id)){record.button.remove();records.delete(id);}
        for(const row of rows){let record=records.get(row.id);if(!record){const button=action('',()=>select(row.id)),label=node('span'),value=node('strong');button.className='attribute-inspector-row';button.dataset.attributeId=row.id;button.append(label,value);list.append(button);record={button,label,value};records.set(row.id,record);}
            record.button.dataset.group=row.group;record.button.dataset.availability=row.availability?.status||'available';setText(record.label,row.label);setText(record.value,row.formatted??numeric(row.value));
            const spoken=row.label+': '+(row.formatted??numeric(row.value));if(record.button.getAttribute('aria-label')!==spoken)record.button.setAttribute('aria-label',spoken);
        }
        if(!ids.has(selectedId))selectedId=rows[0]?.id||null;paint();
    }
    return {refresh,getRows:()=>rows,setVisible(value){if(shown===value)return;shown=value;section.hidden=!value;if(value)refresh();},destroy(){section.remove();}};
}
// Presentation only: authoritative values come from the supplied native reader;
// item commands delegate to the original row control, with its native guards.
export function mountProto23Shell({read,transferStorage,compareWorn}) {
    const player=node('section',null,'shell-character');player.id='proto23_character';
    const statline=node('div',null,'shell-statline shell-core-stats'),equipment=node('div',null,'shell-equipment');
    const secondary=node('section',null,'shell-secondary-stats'),secondaryHeading=node('div',null,'shell-secondary-heading'),secondaryGrid=node('div',null,'shell-secondary-grid');secondary.hidden=true;secondary.setAttribute('aria-label','Secondary attributes');secondary.append(secondaryHeading,secondaryGrid);
    const secondaryRecords=new Map();
    const secondaryOrder=SECONDARY_STATS;
    registerPanelSettings({id:'shell-character',title:'You · pinned rows',settings:secondaryOrder.map(([id,label])=>({key:'pin.'+id,label,default:'off',options:[['off','Automatic'],['on','Pinned']],description:'This browser; reset with display settings. Rates live in Condition; other secondary rows live in You.'}))});
    const rateSection=node('section',null,'shell-secondary-stats condition-rates'),rateGrid=node('div',null,'shell-secondary-grid');rateSection.append(rateGrid);rateSection.hidden=true;
    let statsSignature='';const statRecords=new Map();
    const attributeInspector=mountAttributeInspector();
    const details=action('Attributes ›',()=>{if(expandWorkspaceModule('preparation')){document.getElementById('character_show_stats')?.click();attributeInspector.refresh();}});
    details.className='shell-attributes-open';details.title='Inspect all supported native attributes and their modifiers';
    const gear=node('details',null,'shell-gear-disclosure');gear.open=false;let gearChosen=false;const gearSummary=node('summary','Equipment');gear.append(gearSummary,equipment);gearSummary.addEventListener('click',()=>{gearChosen=true;});
    const wornSummary=node('div',null,'shell-worn-summary');wornSummary.setAttribute('aria-label','Worn equipment');
    const characterTools=node('div',null,'shell-character-tools');characterTools.append(details,gear);player.append(statline,secondary,wornSummary,characterTools);
    const detail=node('section',null,'shell-item-detail');detail.id='proto23_item_detail';
    const title=node('strong'),meta=node('p'),body=node('div',null,'shell-item-description'),controls=node('div',null,'shell-item-actions');
    detail.append(title,meta,body,controls);
    let selected=null,signature='',playerSignature='';
    const originalLogLabels=new Map(),originalNoticeLabels=new Map();
    function syncNoticeLabels(){const parity=active()&&document.getElementById('main_content').dataset.parity==='r3';for(const link of document.querySelectorAll('#message_box_div .notice-panel-link')){if(parity){if(!originalNoticeLabels.has(link))originalNoticeLabels.set(link,{text:link.textContent,title:link.title});const label=({'skills':'Skills','belongings':'Inventory','crafting':'Crafting','local-actions':'Here','records':'Journal','condition':'Condition'})[link.dataset.noticePanel]||'Related panel';const text=label+' ›';if(link.textContent!==text)link.textContent=text;const description='Open '+label+' · current panel';if(link.title!==description)link.title=description;if(link.getAttribute('aria-label')!==description)link.setAttribute('aria-label',description);}else if(originalNoticeLabels.has(link)){const old=originalNoticeLabels.get(link);link.textContent=old.text;link.title=old.title;link.removeAttribute('aria-label');originalNoticeLabels.delete(link);}}for(const link of originalNoticeLabels.keys())if(!link.isConnected)originalNoticeLabels.delete(link);}
    function syncLogLabels(){const parity=active()&&document.getElementById('main_content').dataset.parity==='r3';for(const[id,label]of [['message_show_unlocks','Growth'],['message_show_events','Events'],['message_show_crafting','Crafting'],['message_show_combat','Combat'],['message_show_loot','Loot'],['message_show_background','World']]){const control=document.getElementById(id);if(!control)continue;if(parity){if(!originalLogLabels.has(control))originalLogLabels.set(control,control.textContent);if(control.textContent!==label)control.textContent=label;}else if(originalLogLabels.has(control)){control.textContent=originalLogLabels.get(control);originalLogLabels.delete(control);}}}

    // Context previews reuse public native descriptions. No hidden actor lookup,
    // simulation mutation, or reconstruction of an old event from current state.
    const contextPreview=node('aside',null,'shell-context-preview');contextPreview.id='shell_context_preview';contextPreview.setAttribute('popover','manual');contextPreview.setAttribute('role','tooltip');player.append(contextPreview);
    let contextSource=null,contextTimer=null,contextSignature='',contextPinned=false;
    function hideContext(){clearTimeout(contextTimer);if(contextPreview.matches(':popover-open'))contextPreview.hidePopover();contextSource?.removeAttribute('aria-describedby');contextSource=null;contextSignature='';contextPinned=false;}
    function showContext(source,interactive=false){
        if(!active()||document.getElementById('main_content').dataset.parity!=='r3')return;
        if(document.getElementById('main_content').dataset.shellResizing==='true'){hideContext();return;}
        if(contextPinned&&contextSource!==source&&!interactive)return;
        contextPinned=interactive||contextSource===source&&contextPinned;
        const anchor=source.getBoundingClientRect();
        contextPreview.dataset.interactive=String(contextPinned||source.dataset.contextPreview==='effects');clearTimeout(contextTimer);const attributeRow=source.dataset.attributePreview?attributeInspector.getRows().find(row=>row.id===source.dataset.attributePreview):null;const contentSignature=attributeRow?JSON.stringify(attributeRow):source.nativeEffectView&&JSON.stringify(source.nativeEffectView)||source.logDescription||source.dataset.contextPreview==='effects'&&document.getElementById('effects_tooltip')?.innerHTML||source.dataset.effectAnchor==='opponent-name'&&document.getElementById('current_focus').textContent||source.placeTypeView&&JSON.stringify(source.placeTypeView)||source.innerHTML+source.title;const nextSignature=JSON.stringify([contentSignature,anchor.x,anchor.y,anchor.width,anchor.height]);if(contextSource===source&&contextSignature===nextSignature&&contextPreview.matches(':popover-open'))return;contextSignature=nextSignature;hidePreview();contextSource?.removeAttribute('aria-describedby');contextSource=source;
        contextPreview.replaceChildren();
        if(attributeRow){contextPreview.append(attributeExplanation(attributeRow));
        }else if(source.dataset.contextPreview==='temperature'){
            contextPreview.append(node('strong','Temperature'),node('p',source.title));
            const native=document.getElementById('temperature_tooltip');if(native)contextPreview.append(descriptionCopy(native,{omitTitle:false}));
        }else if(source.logDescription){const saved=node('div');saved.innerHTML=source.logDescription;contextPreview.append(descriptionCopy(saved,{omitTitle:false}),node('small','Description recorded with this event.'));
        }else if(source.dataset.contextPreview==='effect'){
            const view=source.nativeEffectView;if(!view)return;
            const copy=node('div');copy.innerHTML=view.html;contextPreview.append(descriptionCopy(copy,{omitTitle:false}));
            if(view.ended)contextPreview.append(node('p','This effect has ended.'));
        }else if(source.dataset.contextPreview==='effects'){
            const native=document.getElementById('effects_tooltip');if(!native)return;
            contextPreview.append(node('strong','Active effects'));
            for(const effect of native.querySelectorAll('.active_effect_tooltip')){const copy=descriptionCopy(effect);if(effect.dataset.effectKind)copy.prepend(node('small',effect.dataset.effectKind==='debuff'?'Debuff':effect.dataset.effectKind==='buff'?'Buff':'Condition','context-effect-kind'));contextPreview.append(copy);}
        }else if(source.dataset.effectAnchor==='opponent-name'){
            const focus=document.getElementById('current_focus');contextPreview.append(node('strong',source.textContent),node('p',focus.querySelector('.combat-focus-view > p')?.textContent||''),node('p',[...focus.querySelectorAll('dl > div')].map(n=>[...n.children].map(c=>c.textContent).join(': ')).join(' · ')),node('small','Native compatibility readout. Knowledge and appraisal depend on the world and observer. Inspection does not change attack targeting.'));
        }else if(source.placeTypeView){
            const type=source.placeTypeView;contextPreview.append(node('strong',`Place type: ${type.label}`),node('p',type.description));
            for(const effect of type.effects)contextPreview.append(node('p',placeTypeEffectText(effect)));
        }else if(source.classList.contains('notice-panel-link')){
            contextPreview.append(node('strong','Related panel'),node('p','Open shows the current related panel. Hover an underlined subject for its recorded description.'));
        }else{
            const tooltip=source.dataset.nativeStat?document.querySelector(`#character_stats_div #${source.dataset.nativeStat}`)?.closest('.stat_slot_div')?.querySelector('.stat_tooltip'):source.querySelector('.stat_tooltip,[id$="_tooltip"]');
            if(tooltip)contextPreview.append(descriptionCopy(tooltip,{omitTitle:false}));
            else contextPreview.append(node('strong',source.matches('dl > div')?[...source.children].map(n=>n.textContent).join(': '):source.textContent.trim()),node('p',source.title||'Known native combat facts.'));
        }
        for(const n of contextPreview.querySelectorAll('[id]'))n.removeAttribute('id');
        const region=source.closest('[data-custom-palette]')||document.getElementById('location_related_div'),css=getComputedStyle(region);
        contextPreview.style.fontSize=css.getPropertyValue('--custom-size').trim()||css.fontSize;contextPreview.style.fontFamily=css.fontFamily;
        contextPreview.dataset.customPalette=region.dataset.customPalette||'false';
        for(const key of ['background','text','accent'])contextPreview.style.setProperty('--context-'+key,css.getPropertyValue('--custom-'+key));
        contextPreview.style.width='';contextPreview.style.maxHeight='';
        if(!contextPreview.matches(':popover-open'))contextPreview.showPopover();
        const box=source.getBoundingClientRect(),w=contextPreview.offsetWidth,h=contextPreview.offsetHeight;
        contextPreview.style.left=Math.max(8,Math.min(box.left,innerWidth-w-8))+'px';
        contextPreview.style.top=Math.max(8,box.bottom+h+8<innerHeight?box.bottom+6:box.top-h-6)+'px';
        source.setAttribute('aria-describedby',contextPreview.id);
    }
    const contextSelector='[data-context-preview=temperature],[data-context-preview=effect],.shell-place-tag,[data-attribute-preview],[data-native-stat],[data-effect-anchor=opponent-name],.shell-effects-summary,.combat-focus-view dl > div,.enemy-card dl > div,.combat-focus-choices button,.log-subject,.shell-stat-record,.character_bar_parent_div:has([id$="_tooltip"])';
    const contextEnter=event=>{const source=event.target.closest(contextSelector);if(source&&!source.contains(event.relatedTarget))showContext(source);};
    const contextLeave=event=>{if(contextPinned)return;const source=event.target.closest(contextSelector);if(source&&!source.contains(event.relatedTarget)){clearTimeout(contextTimer);contextTimer=setTimeout(hideContext,180);}};
    for(const type of ['mouseover','focusin'])document.addEventListener(type,contextEnter);
    for(const type of ['mouseout','focusout'])document.addEventListener(type,contextLeave);
    contextPreview.addEventListener('mouseenter',()=>clearTimeout(contextTimer));contextPreview.addEventListener('mouseleave',()=>{if(contextPinned)return;contextTimer=setTimeout(hideContext,180);});
    const contextDismiss=event=>{if(event.key==='Escape'&&contextPreview.matches(':popover-open')){hideContext();event.preventDefault();event.stopImmediatePropagation();}};
    document.addEventListener('keydown',contextDismiss,true);
    const resizeDismiss=event=>{if(event.target.closest('[data-shell-resize]')){hideContext();hidePreview();}};
    document.addEventListener('pointerdown',resizeDismiss);
    document.addEventListener('click',event=>{const subject=event.target.closest('.log-subject,.shell-place-tag,[data-context-preview=temperature],[data-context-preview=effect]');if(subject){showContext(subject,true);return;}if(!contextPreview.contains(event.target))hideContext();});

    const preview=node('aside',null,'shell-item-preview');preview.id='shell_item_preview';
    preview.setAttribute('popover','manual');preview.setAttribute('aria-label','Item preview');
    const previewBody=node('div',null,'shell-preview-body'),previewFooter=node('div',null,'shell-preview-footer');
    const full=action('Full item ›',()=>{if(hovered?.isConnected){const row=hovered;row.focus({preventScroll:true});choose(row);expandWorkspaceModule('shell-detail');}});
    previewFooter.append(full,node('span','Inspection is free · Esc closes'));preview.append(previewBody,previewFooter);player.append(preview);
    let hovered=null,previewSignature='',hideTimer=null;
    function hidePreview(){clearTimeout(hideTimer);if(preview.matches(':popover-open'))preview.hidePopover();hovered?.removeAttribute('aria-describedby');hovered=null;previewSignature='';}
    function deferHide(){clearTimeout(hideTimer);hideTimer=setTimeout(hidePreview,180);}
    function showPreview(row){
        // A visible stable inspector owns this reading space; hover must not cover its commands.
        const itemDetail=document.getElementById('proto23_item_detail');
        if(selected&&itemDetail&&rendered(itemDetail)){hidePreview();return;}
        if(!active()||document.getElementById('main_content').dataset.parity!=='r3')return;
        const tooltip=row.querySelector('.item_tooltip');if(!tooltip)return;hideContext();
        clearTimeout(hideTimer);if(hovered!==row||previewSignature!==tooltip.innerHTML){hovered?.removeAttribute('aria-describedby');hovered=row;previewSignature=tooltip.innerHTML;previewBody.replaceChildren(descriptionCopy(tooltip));}
        row.setAttribute('aria-describedby',preview.id);
        const source=document.getElementById('inventory_div'),css=getComputedStyle(source);
        for(const [key,value]of Object.entries({'--shell-preview-size':css.fontSize,'--shell-preview-fill':css.getPropertyValue('--custom-background'),'--shell-preview-text':css.getPropertyValue('--custom-text'),'--shell-preview-accent':css.getPropertyValue('--custom-accent')}))preview.style.setProperty(key,value);
        preview.dataset.customPalette=source.dataset.customPalette||'false';
        const region=document.querySelector('.parity-region[data-main-box="inventory"]')||row,box=region.getBoundingClientRect(),expanded=!!row.closest('#center_mode_content');
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
    // R18: native categories as tabs with counts; the choice is a browser-local panel setting (NX2).
    registerPanelSettings({id:'belongings',title:'Inventory',settings:[{key:'category',label:'Inventory category',description:'Which native inventory category the shell shows. Stored in this browser only.',options:INVENTORY_CATEGORIES.map(c=>[c.id,c.label]),default:'all'},{key:'controls',label:'Inventory view choices',description:'R21 control box: open search and sort on demand, or keep them open under the box. Stored in this browser only.',options:[['popover','Open on demand'],['kept','Keep open']],default:'popover'}]});
    const inventoryList=document.getElementById('inventory_content_div');
    // R21: the shared list tools may move into the Inventory control box, so they are found once by reference.
    let listToolsNode=null;const listTools=()=>{if(!listToolsNode){const n=inventoryList.previousElementSibling;if(n?.classList.contains('ui-list-tools'))listToolsNode=n;}return listToolsNode;};
    const tabs=createInventoryTabs({list:inventoryList,search:()=>listTools()?.querySelector('input[type=search]'),stored:()=>getDisplaySetting('panel.belongings.category'),store:id=>setDisplaySettings({'panel.belongings.category':id})});
    const inventoryComposition=mountInventoryComposition({list:inventoryList,tabs:tabs.node,detail});
    const storageComparison=mountStorageComparison({host:document.getElementById('storage_comparison'),carried:inventoryList,chest:document.getElementById('storage_inventory_div'),transfer:transferStorage});
    tabs.node.title='Item colors: gold equipment, green usable, blue components, violet books. Quality keeps its native percentage and color; color does not imply rarity of other items.';
    compact.append(tabs.node);
    // R22c (FC17): a fight opens Inventory on Usable (when you hold any) and leaving it returns the
    // tab you had; the stored preference stays the idle tab. Browser-local presentation only.
    {const shellRoot=document.getElementById('main_content');let idleTab=null;
        const follow=()=>{const fight=shellRoot.dataset.parity==='r3'&&shellRoot.dataset.parityCombat==='true';
            if(fight&&idleTab===null){idleTab=tabs.current();if(idleTab!=='usable'&&inventoryList.querySelector('.character_item_usable,.character_item_book'))tabs.select('usable');}
            else if(!fight&&idleTab!==null){const back=idleTab;idleTab=null;if(tabs.current()!==back)tabs.select(back);}};
        new MutationObserver(follow).observe(shellRoot,{attributes:true,attributeFilter:['data-parity-combat','data-parity']});follow();}
    const sort=makeSelect('Inventory sort',[['inventory_sort_by_name','Name'],['inventory_sort_by_price','Value'],['inventory_sort_by_type','Type']]);
    // CTL13: the native sort toggles direction when its active control is clicked again; show it.
    let ascending=true;sort.addEventListener('change',()=>{ascending=true;syncReverse();});
    const reverse=action('↑',()=>{document.getElementById(sort.value)?.click();ascending=!ascending;syncReverse();});
    const syncReverse=()=>{reverse.textContent=ascending?'↑':'↓';const label=`Sort ${ascending?'ascending':'descending'}; reverse`;reverse.setAttribute('aria-label',label);reverse.title=label;};syncReverse();
    reverse.className='inventory-sort-direction';compact.append(reverse);
    // R18: sort sits in the list's own search row so the tabs keep one row (same Inventory panel).
    const sortHome=node('span',null,'inventory-sort');sortHome.append(sort,reverse);
    const placeSort=()=>{const tools=listTools();if(tools&&sortHome.parentNode!==tools)tools.append(sortHome);};
    const home=document.getElementById('main_content');
    definePanel({id:'shell-inventory-tools',title:'Inventory tools',role:'records',node:compact,home,defaultDock:'left',after:'combat-controls',eligible:()=>home.dataset.parity==='r3',discovered:()=>home.dataset.parity==='r3'});
    const condition=mountConditionPanel({home,rates:rateSection,readRows:()=>[...rateGrid.children].filter(n=>!n.hidden),inspect:button=>showContext(button,true),isInspecting:button=>contextSource===button,notice:(text)=>log_message(text,'notification',{safeText:true,panelId:'condition'})});
    definePanel({id:'shell-character',title:'Stats & equipment',role:'character',node:player,home,defaultDock:'left',after:'vitals',eligible:active,discovered:active});
    definePanel({id:'shell-detail',title:'Item details',role:'records',node:detail,home,defaultDock:'center',after:'focus',eligible:()=>active()&&!!selected,discovered:active});
    const logTools=node('div',null,'shell-log-tools');const filters=action('Filters · All',()=>{const root=document.getElementById('main_content');root.dataset.logFiltersOpen=String(root.dataset.logFiltersOpen!=='true');filters.setAttribute('aria-expanded',root.dataset.logFiltersOpen);});filters.setAttribute('aria-expanded','false');filters.setAttribute('aria-controls','message_controls');
    const follow=node('select');follow.setAttribute('aria-label','Log follow');for(const [value,label]of [['hold','Follow: smart'],['always','Follow: always']]){const option=node('option',label);option.value=value;follow.append(option);}follow.title='Smart follow holds your place when you scroll up. Always follow jumps to new messages.';follow.onchange=()=>setDisplaySettings({logFollow:follow.value});
    const latest=action('Latest',()=>{const native=document.querySelector('.log-unread-anchor button');if(native)native.click();else{const box=document.getElementById('message_box_div');box.scrollTop=box.scrollHeight;}});latest.title='Jump to the latest message';let combatStopped=false;const combatLog=action('Stop combat log',()=>{combatStopped=setCombatReportsStopped(!combatStopped);combatLog.textContent=combatStopped?'Resume combat log':'Stop combat log';combatLog.setAttribute('aria-pressed',String(combatStopped));});combatLog.title='Stop recording new hit, miss, block and defeat reports in this presentation. Combat continues; existing history, loot and growth reports remain. Resets on reload.';
    const clearLog=action('Clear',()=>{hideContext();clear_message_log();});clearLog.title='Clear the visible report history. Character, discoveries, quests and combat are unchanged.';
    logTools.append(filters,follow,latest,combatLog,clearLog);
    // R21 control boxes (CB1–CB5): Inventory and Reports choices open from one box each; UM5 adds Skills, Quests and Crafting.
    const strips=mountShellStripBoxes();
    const boxes=mountShellControlBoxes({compact,tabs,sortHome,sort,reverse,inventoryList,listTools,log:{tools:logTools,filters,follow,latest,combatLog,clearLog},keepInventory:{stored:()=>getDisplaySetting('panel.belongings.controls')==='kept',store:on=>setDisplaySettings({'panel.belongings.controls':on?'kept':'popover'})}});
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
    function fitSecondary(){
        const root=document.getElementById('main_content');
        if(root.dataset.parity!=='r3'){secondary.hidden=true;rateSection.hidden=true;const shell=player.closest('.workspace-module');if(shell?.dataset.youMinimum){shell.style.removeProperty('min-height');delete shell.dataset.youMinimum;}return;}
        const fitBody=player.closest('.workspace-module-body');if(fitBody&&!fitBody.hasAttribute('data-fit-clip'))fitBody.dataset.fitClip='';
        const rows=attributeInspector.getRows(),byId=new Map(rows.map(row=>[row.id,row]));
        const candidates=secondaryOrder.filter(([id])=>secondaryVisible(byId.get(id),getDisplaySetting(pinKey(id))==='on'));
        const shown=new Set(candidates.map(([id])=>id));
        // Keep keyed nodes and focused/inspected rows through a tick that makes them neutral.
        for(const[id,record]of secondaryRecords){
            const held=record.button===document.activeElement||contextSource===record.button;
            record.button.hidden=!shown.has(id)&&!held;
        }
        for(const[id,label]of candidates){const row=byId.get(id);let record=secondaryRecords.get(id);
            if(!record){const button=node('button',null,'shell-secondary-stat');button.type='button';button.dataset.attributePreview=id;button.append(node('span',label),node('strong'));(isRate(id)?rateGrid:secondaryGrid).append(button);record={button,value:button.lastChild};secondaryRecords.set(id,record);}
            record.button.hidden=false;
            const text=(isRate(id)&&row.value>0?'+':'')+row.formatted.replace('°C difference','°C Δ').replace(/% max (stamina|hp|mana)\/s/,'% /s').replace('stamina/s','/s').replace('mana/s','/s').replace(' damage','');
            if(isRate(id)){record.button.dataset.rateSign=row.value>0?'gain':row.value<0?'loss':'zero';record.button.title='Regeneration contribution around zero, in the named native unit. Other simultaneous effects can change the net result.';}
            if(record.value.textContent!==text)record.value.textContent=text;
            record.button.setAttribute('aria-label',row.label+': '+row.formatted);
        }
        secondary.hidden=![...secondaryGrid.children].some(n=>!n.hidden);
        // At constrained sizes, whole secondary rows yield to core, controls and status effects.
        // Attributes remains the complete home; explicit pins are first in the available rows.
        if(fitBody){
            const shell=player.closest('.workspace-module'),css=getComputedStyle(player),bodyCss=getComputedStyle(fitBody),shellCss=getComputedStyle(shell);
            const inset=(cs,keys)=>keys.reduce((sum,key)=>sum+(parseFloat(cs[key])||0),0);
            const minimum=statline.getBoundingClientRect().height+characterTools.getBoundingClientRect().height+wornSummary.getBoundingClientRect().height+
                inset(css,['paddingTop','paddingBottom'])+inset(bodyCss,['paddingTop','paddingBottom'])+
                inset(shellCss,['borderTopWidth','borderBottomWidth'])+(shell.querySelector('.workspace-module-header')?.getBoundingClientRect().height||0);
            const value=Math.ceil(minimum)+'px';shell.dataset.youMinimum='true';if(shell.style.minHeight!==value)shell.style.setProperty('min-height',value,'important');
        }
        const region=player.closest('.parity-region'),shell=player.closest('.workspace-module');
        const siblings=region?[...region.children]:[],following=siblings.slice(siblings.indexOf(shell)+1).filter(rendered).reduce((sum,n)=>sum+(parseFloat(getComputedStyle(n).minHeight)||n.getBoundingClientRect().height),0);
        const available=region&&fitBody?region.getBoundingClientRect().bottom-fitBody.getBoundingClientRect().top-following-statline.getBoundingClientRect().height-characterTools.getBoundingClientRect().height-wornSummary.getBoundingClientRect().height:Infinity;
        const first=secondaryGrid.querySelector('button:not([hidden])'),rowHeight=first?.getBoundingClientRect().height||0;
        const cols=parseInt(getComputedStyle(secondaryGrid).gridTemplateColumns.split(' ').length)||2;
        const capacity=rowHeight?Math.max(0,Math.floor((available-8)/rowHeight))*cols:Infinity;
        const ordered=candidates.filter(([id])=>!isRate(id)).sort(([a],[b])=>Number(getDisplaySetting(pinKey(b))==='on')-Number(getDisplaySetting(pinKey(a))==='on'));
        const wanted=String(Math.ceil(rowHeight*Math.ceil(ordered.length/cols)+8));if(secondary.dataset.fitWant!==wanted)secondary.dataset.fitWant=wanted;
        const fitted=new Set(ordered.slice(0,capacity).map(([id])=>id));
        for(const[id,record]of secondaryRecords)if(!isRate(id)&&!fitted.has(id)&&record.button!==document.activeElement&&contextSource!==record.button)record.button.hidden=true;
        secondary.hidden=![...secondaryGrid.children].some(n=>!n.hidden);
        const omitted=ordered.length-fitted.size;const detailsText='Attributes ›';if(details.textContent!==detailsText)details.textContent=detailsText;
        details.title=omitted>0?`All attributes · ${omitted} additional rows available`:'All attributes';
        rateSection.hidden=![...rateGrid.children].some(n=>!n.hidden);
        // Whole rows yield with an explicit Attributes count; focused/inspected rows stay mounted.
        root.dataset.secondaryShown=String([...secondaryGrid.children].filter(n=>!n.hidden).length);
    }
    function render(){
        placeSort();tabs.refresh();boxes.render();strips.render();inventoryComposition.render(rowForSelection());storageComparison.render();
        condition.render();syncLogLabels();syncNoticeLabels();attributeInspector.setVisible(active()&&document.getElementById('main_content').dataset.parity==='r3');if(!gearChosen){const wanted=false;if(gear.open!==wanted)gear.open=wanted;}if(!active()){if(contextSource)hideContext();return;}const enabled=document.querySelectorAll('#message_controls .active_selection_button').length;filters.textContent=enabled===6?'Filters':`Filters ${enabled}/6`;follow.value=getDisplaySetting('logFollow');const logBox=document.getElementById('message_box_div');latest.disabled=logBox.scrollHeight-logBox.scrollTop-logBox.clientHeight<24;

        if(contextSource){if(contextSource.isConnected&&contextSource.checkVisibility()&&active())showContext(contextSource);else hideContext();}
        if(!active())return;
        attributeInspector.refresh();
        const nativeStats=[...document.querySelectorAll('#character_stats_div .stat_slot_div')].filter(n=>n.querySelector('.stat_value,.stat_value_long')?.textContent.trim());
        const nextStats=nativeStats.map(n=>n.innerHTML).join('');
        if(statsSignature!==nextStats){statsSignature=nextStats;
            const seen=new Set();
            for(const source of nativeStats){
                const valueNode=source.querySelector('.stat_value,.stat_value_long'),key=valueNode.id,label=source.querySelector('.stat_name,.stat_name_short')?.textContent.trim().replace(/:$/,'')||'Combat chance';seen.add(key);
                let row=statRecords.get(key);if(!row){row=node('button',null,'shell-stat-record');row.type='button';row.dataset.statRecord=key;row.dataset.nativeStat=key;row.append(node('span'),node('strong'));statRecords.set(key,row);statline.append(row);}
                row.dataset.attributePreview=key==='hit_chance_slot'?'attack_points':key==='defensive_action_chance_slot'?(label.includes('Block')?'block_chance':'evasion_points'):key.replace(/_slot$/,'');row.dataset.fullLabel=label;row.dataset.longValue=String(valueNode.classList.contains('stat_value_long'));row.firstChild.textContent=label.includes('Block')?'Block':shortStatLabels[key]||label;row.children[1].textContent=valueNode.textContent.trim()+(key==='attack_speed_slot'?' /s':'');
                const description=label+': '+row.children[1].textContent;if(row.getAttribute('aria-label')!==description)row.setAttribute('aria-label',description);
                const tooltip=source.querySelector('.stat_tooltip');if(tooltip&&row.dataset.tooltipSignature!==tooltip.innerHTML){row.dataset.tooltipSignature=tooltip.innerHTML;row.querySelector('.stat_tooltip')?.remove();const copy=tooltip.cloneNode(true);copy.removeAttribute('id');for(const n of copy.querySelectorAll('[id]'))n.removeAttribute('id');row.append(copy);}
            }
            for(const[key,row]of statRecords)if(!seen.has(key)){row.remove();statRecords.delete(key);}
        }
        const root=document.getElementById('main_content'),context=document.getElementById('location_related_div'),style=getComputedStyle(context);
        root.dataset.shellCustomPalette=context.dataset.customPalette||'false';
        for(const [key,value]of Object.entries({'--shell-context-size':style.fontSize,'--shell-context-font':style.fontFamily,'--shell-context-small-size':style.getPropertyValue('--custom-small-size'),'--shell-context-small-font':style.getPropertyValue('--custom-small-font'),'--shell-user-fill':style.getPropertyValue('--custom-background'),'--shell-user-text':style.getPropertyValue('--custom-text'),'--shell-user-accent':style.getPropertyValue('--custom-accent')}))if(root.style.getPropertyValue(key)!==value)root.style.setProperty(key,value);
        for(const select of [sort]){const active=[...select.options].find(o=>document.getElementById(o.value)?.classList.contains('active_selection_button'));if(active)select.value=active.value;}
        // A zero-capacity native resource is empty, including the currently
        // unimplemented 0/0 mana slot. Keep native numeric text untouched.
        if(root.dataset.parity==='r3')for(const id of ['character_health','character_xp','character_stamina','character_mana']){
            const value=document.getElementById(id+'_value'),host=document.getElementById(id+'_div');
            if(value&&host){host.tabIndex=0;const text=value.textContent.trim();host.dataset.zeroCapacity=String(/\/\s*0(?:\s|$)/.test(text));value.title=text;}
        }
        if(hovered){if(!hovered.isConnected)hidePreview();else showPreview(hovered);}
        const frame=read();const nextPlayer=JSON.stringify(frame);
        if(nextPlayer!==playerSignature){playerSignature=nextPlayer;
            const worn=frame.equipment.filter(s=>s.name).length;gearSummary.textContent=`Gear · ${worn}`;gearSummary.setAttribute('aria-label',`Equipment · ${worn} worn`);gearSummary.title=`${worn} worn items. Open native equipment slots.`;
            const wornIdentity=JSON.stringify(frame.equipment.filter(s=>s.name).map(s=>[s.id,s.name]));
            if(root.dataset.shellWorn!==wornIdentity)root.dataset.shellWorn=wornIdentity;
            player.dataset.effectAnchor='player-stats';
            const focusedSlot=document.activeElement?.dataset.shellSlot;
            const focusInSummary=wornSummary.contains(document.activeElement);
            wornSummary.replaceChildren();
            for(const slot of frame.equipment.filter(slot=>slot.name)){
                const button=action('',()=>{selected={slot:slot.id};signature='';render();updateWorkspace();});
                button.dataset.shellSlot=slot.id;button.className='shell-worn-item';button.title=`${slot.label}: ${slot.name}`;
                button.append(node('span',slot.label,'shell-worn-slot'),node('span',slot.name,'shell-worn-name'));wornSummary.append(button);
            }
            wornSummary.hidden=!worn;
            const toolsOpen=equipment.querySelector('details')?.open;equipment.replaceChildren();
            const tools=node('details'),toolLabel=node('summary','Tools');tools.open=!!toolsOpen;const toolGrid=node('div',null,'shell-equipment');tools.append(toolLabel,toolGrid);
            for(const slot of frame.equipment){const b=action(`${slot.label} · ${slot.name||'Empty'}`,()=>{selected={slot:slot.id};signature='';render();updateWorkspace();});b.dataset.shellSlot=slot.id;b.title=slot.name||`Empty ${slot.label} slot`;(['axe','pickaxe','sickle','shovel','fishing'].includes(slot.id)?toolGrid:equipment).append(b);}
            equipment.append(tools);
            if(focusedSlot)(focusInSummary?wornSummary:equipment).querySelector(`[data-shell-slot="${CSS.escape(focusedSlot)}"]`)?.focus({preventScroll:true});
        }
        const top=document.querySelector('.workspace-module[data-module=vitals]')?.getBoundingClientRect(),end=document.querySelector('.workspace-module[data-module="combat-controls"]')?.getBoundingClientRect();
        if(root.dataset.parity!=='r3'&&top?.height&&end?.height){const height=Math.min(innerHeight*.42,Math.ceil(end.bottom-top.top));const root=document.getElementById('main_content'),value=height+'px';if(root.style.getPropertyValue('--shell-upper-height')!==value)root.style.setProperty('--shell-upper-height',value);}
        fitSecondary();
        if(!selected)return;
        const row=rowForSelection();
        const comparison=selected.key?compareWorn?.(selected.key):null;
        const next=JSON.stringify([selected,row?.innerHTML,frame.reason,root.dataset.parity,root.dataset.parityExpanded,comparison]);if(next===signature)return;signature=next;
        const tooltip=row?.querySelector('.item_tooltip');
        detail.dataset.itemKind=row?.dataset.item_slot||row?.querySelector('.item_category')?.textContent.replace(/[\[\]]/g,'').trim()||(selected.slot?'Equipped item':'Item');
        title.className='shell-item-title';
        title.textContent=row?.querySelector('.item_name')?.textContent|| (selected.slot?frame.equipment.find(s=>s.id===selected.slot)?.name:'Item no longer held')||'Empty slot';
        meta.textContent=selected.slot?`Equipped · ${selected.slot}`:row?`Carried · ${row.dataset.item_count}`:'This held stack is gone. Choose another item to inspect.';
        meta.title=selected.slot?'Follows the current item in this equipment slot.':'Follows this exact carried stack.';
        body.replaceChildren();
        if(tooltip)body.append(descriptionCopy(tooltip));
        else body.append(node('p',selected.slot?'Choose a held item to equip in this slot.':'This item is no longer in your inventory.'));
        if(comparison){
            const section=node('section',null,'worn-comparison');section.append(node('strong',`If worn · compared with ${comparison.baselineName}`),node('p',comparison.note));
            const format=n=>String(Math.round(n*1000)/1000);
            for(const r of comparison.rows)section.append(node('p',`${r.label}: ${format(r.current)} → ${format(r.worn)} (Δ ${r.delta>0?'+':''}${format(r.delta)})`));
            body.append(section);
        }
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
        inventoryComposition.render(rowForSelection());
    }
    document.addEventListener('workspace-presentation-change',()=>{hideContext();hidePreview();render();updateWorkspace();});
    const timer=setInterval(render,400);return{render,destroy:()=>{document.removeEventListener('pointerdown',resizeDismiss);hidePreview();attributeInspector.destroy();condition.destroy();clearInterval(timer);document.removeEventListener('mouseover',hover);document.removeEventListener('mouseout',leave);document.removeEventListener('keydown',dismiss,true);document.removeEventListener('click',dismissClick);window.removeEventListener('blur',hidePreview);document.removeEventListener('click',inspect);document.removeEventListener('focusin',inspect);}};
}
