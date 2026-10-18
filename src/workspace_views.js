import {decorateActionComponents} from './ui_components.js';
import {definePanel} from './panel_kit.js';
import {createReferenceDisclosure} from './workspace_disclosure.js';
import {registerWorkspaceModule, updateWorkspace, openWorkspaceModule} from './workspace_layout.js';
import {publishChange} from './ui_change_signal.js';

// Only host-supplied, already visible labels enter this presentation. No new
// definition lookup, command dispatcher or gameplay timer belongs here.
export function createWorkspaceViews({read,combatKnown=()=>false}) {
    const components=decorateActionComponents(document.getElementById('location_related_div'));
    // Native bestiary/anthology lists contain earned records, including restored
    // history. Empty future magic navigation has no useful destination yet.
    const references = createReferenceDisclosure({read: () => ({
        bestiary: !!document.querySelector('#bestiary_list .bestiary_entry_div'),
        books: !!document.querySelector('#books_list .anthology_entry_div'),
        magic: !!document.querySelector('#magic_list > *'),
    })});
    const panel=document.createElement('section');panel.id='workspace_current_work';
    const heading=document.createElement('strong');heading.textContent='Current work';
    const work=document.createElement('p'),ownership=document.createElement('p');
    const jump=document.createElement('button');jump.type='button';jump.textContent='Open local controls';
    jump.onclick=()=>{if(read().waiting){openWorkspaceModule('notebook');return;}openWorkspaceModule('local-actions');const target=document.getElementById('location_related_div');target?.scrollIntoView({block:'nearest'});const first=target?.querySelector('button:not(:disabled),[role="button"],summary');first?.focus();};
    panel.append(heading,work,ownership,jump);
    document.getElementById('location_related_div')?.prepend(panel);
    registerWorkspaceModule({id:'current-work',title:'Current work & saving',node:panel,home:'center',critical:true});
    // Native combat and stance views join the board while shown; retreat stays in Local actions just below.
    const shown=node=>!!node&&getComputedStyle(node).display!=='none';
    const combat=document.getElementById('combat_div'),stance=document.getElementById('character_combat_management');
    // Discovery: the first real fight (save facts: last combat location or a landed hit), or being shown in one now.
    if(combat)definePanel({id:'combat',role:'actions',unavailableReason:()=> 'No fight right now',title:'Combat',node:combat,home:'center',after:'current-work',eligible:()=>shown(combat),discovered:()=>combatKnown()||shown(combat)});
    if(stance)definePanel({id:'stance',role:'character',unavailableReason:()=> 'Only during a fight',title:'Stance & combatants',node:stance,home:'left',after:'combat-controls',eligible:()=>shown(stance),discovered:()=>combatKnown()||shown(stance)});
    // Place prose keeps its first lines readable; the rest opens in place.
    const prose=document.getElementById('location_description_div'),more=document.createElement('button');
    more.type='button';more.className='workspace-prose-toggle';more.hidden=true;
    more.onclick=()=>{const open=prose.dataset.proseOpen!=='true';prose.dataset.proseOpen=String(open);syncProse();};
    prose?.after(more);
    // Open crafting, trade or storage views get the place block's height.
    const tasks=['crafting_window','trade_div','storage_div'].map(id=>document.getElementById(id)).filter(Boolean);
    const syncTask=()=>{const open=tasks.find(t=>t.style.display&&t.style.display!=='none'&&getComputedStyle(t).display!=='none');
        const root=document.getElementById('main_content');if(!root)return;const next=open?open.id:'';if((root.dataset.localTask||'')===next)return;
        if(next)root.dataset.localTask=next;else delete root.dataset.localTask;
        // Entering trade shows your own stock from its first row.
        if(next==='trade_div'){const shell=root.querySelector('.workspace-module[data-module="belongings"]');const dock=shell?.parentElement;if(dock?.classList.contains('workspace-dock')&&!shell.classList.contains('workspace-floating'))requestAnimationFrame(()=>{dock.scrollTop=0;});}};
    const taskObserver=new MutationObserver(syncTask);tasks.forEach(t=>taskObserver.observe(t,{attributes:true,attributeFilter:['style','class']}));syncTask();
    let proseText='';
    const syncProse=()=>{if(!prose)return;if(prose.textContent!==proseText){proseText=prose.textContent;prose.dataset.proseOpen='false';}
        // Each 250 ms tick writes only what changed, so an idle board keeps style and layout clean.
        const open=prose.dataset.proseOpen==='true',hidden=!open&&prose.scrollHeight<=prose.clientHeight+1,label=open?'Less':'More about this place';
        if(more.hidden!==hidden)more.hidden=hidden;if(more.textContent!==label)more.textContent=label;if(more.getAttribute('aria-expanded')!==String(open))more.setAttribute('aria-expanded',String(open));};
    let signature='';
    const render=()=>{
        references.render();
        syncProse();
        const view=read(),next=JSON.stringify(view);
        if(next!==signature){signature=next;work.textContent=view.work.length?view.work.join(' · '):'No work running.';jump.textContent=view.waiting?'Open waiting response':'Open local controls';
            ownership.textContent=view.canWrite?'Saving available.':view.error||'Read only. Restore saving before starting work.';
            ownership.className=view.canWrite?'':'workspace-warning';jump.hidden=!view.waiting&&!view.work.length&&view.canWrite;
            // UIX2: this panel owns the current-work presentation; readers (the bar chip) re-read it.
            panel.dataset.workCount=String(view.work.length);publishChange('work','current-work');}
        // Generic world palettes stay deliberately independent of sealed IDs.
        const world=!view.world || view.world === 'base.frontier' ? 'native' : view.world,theme=view.away?'cool':'warm',root=document.getElementById('main_content');
        if(document.documentElement.dataset.world!==world)document.documentElement.dataset.world=world;
        if(root.dataset.worldTheme!==theme)root.dataset.worldTheme=theme;
        updateWorkspace();
    };
    const nativeHost=document.getElementById('location_related_div');
    const decorate=()=>{for(const control of nativeHost?.querySelectorAll('div[onclick],.location_choice_dropdown')||[]){
        control.setAttribute('role','button');control.tabIndex=0;control.dataset.nativeKeyboard='true';
        control.setAttribute('aria-disabled',String(control.classList.contains('activity_unavailable')));
        if(control.classList.contains('location_choice_dropdown'))control.setAttribute('aria-expanded',String(control.classList.contains('location_choice_dropdown_expanded')));
        for(const icon of control.querySelectorAll('.material-icons'))icon.setAttribute('aria-hidden','true');
    }};
    const onKey=event=>{const control=event.target.closest('[data-native-keyboard]');
        if(control===event.target&&['Enter',' '].includes(event.key)){event.preventDefault();if(control.getAttribute('aria-disabled')!=='true')control.click();}
    };
    nativeHost?.addEventListener('keydown',onKey);
    const observer=new MutationObserver(decorate);if(nativeHost)observer.observe(nativeHost,{childList:true,subtree:true,attributes:true,attributeFilter:['onclick','class']});decorate();
    render();const timer=setInterval(render,250);return {render,destroy(){clearInterval(timer);components.destroy();references.destroy();observer.disconnect();nativeHost?.removeEventListener('keydown',onKey);panel.remove();more.remove();taskObserver.disconnect();}};
}

export function createEquipmentComparison({read}) {
    const panel=document.createElement('details');panel.id='workspace_equipment_comparison';const title=document.createElement('summary');title.textContent='Equipment comparison';panel.append(title);
    const note=document.createElement('p');note.textContent='Compare equipment you hold or wear. Values describe each item, before your body, skills and situational effects. No equipment changes here.';
    const choices=document.createElement('div'),table=document.createElement('table');table.setAttribute('aria-label','Held equipment comparison');
    const selects=[0,1].map(i=>{const label=document.createElement('label');label.textContent=i?'Compare with ':'Compare item ';const select=document.createElement('select');select.setAttribute('aria-label',i?'Second equipment item':'First equipment item');label.append(select);choices.append(label);select.onchange=()=>render(true);return select;});
    panel.append(note,choices,table);document.getElementById('character_div')?.append(panel);
    registerWorkspaceModule({id:'equipment-comparison',title:'Equipment comparison',node:panel,home:'left'});
    let last='';
    function render(force=false){
        const rows=read(),signature=JSON.stringify(rows);if(!force&&last===signature)return;
        if(last!==signature){const previous=selects.map(s=>s.value);for(const [i,select]of selects.entries()){
            select.replaceChildren(...rows.map(row=>{const o=document.createElement('option');o.value=row.id;o.textContent=row.label;return o;}));
            select.value=rows.some(r=>r.id===previous[i])?previous[i]:rows[Math.min(i,rows.length-1)]?.id||'';
        }last=signature;}
        const chosen=selects.map(s=>rows.find(r=>r.id===s.value));
        const makeRow=(label,values,header=false)=>{const tr=document.createElement('tr');for(const text of [label,...values]){const c=document.createElement(header?'th':'td');c.textContent=String(text??'None');tr.append(c);}return tr;};
        const keys=[...new Set(chosen.flatMap(r=>Object.keys(r?.stats||{})))];
        table.replaceChildren(makeRow('Item',chosen.map(r=>r?.label),true),makeRow('Slot',chosen.map(r=>r?.slot)),...keys.map(k=>makeRow(k,chosen.map(r=>r?.stats[k]??'No bonus'))));
    }
    render();const timer=setInterval(render,1000);return {render,destroy(){clearInterval(timer);panel.remove();}};
}
